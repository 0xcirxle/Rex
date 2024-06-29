use alloy_sol_types::{sol, SolEventInterface};
use futures::Future;
use reth_execution_types::Chain;
use reth_exex::{ExExContext, ExExEvent};
use reth_node_api::FullNodeComponents;
use reth_node_ethereum::EthereumNode;
use reth_primitives::{address, Address, Log, SealedBlockWithSenders, TransactionSigned};
use reth_tracing::tracing::info;
use rusqlite::Connection;

sol!(TokenContract, "token_contract_abi.json");
use crate::TokenContract::{TokenTransfer, TokenContractEvents};

const TOKEN_CONTRACT_ADDRESS: Address = address!("YOUR_CONTRACT_ADDRESS_HERE");

async fn init<Node: FullNodeComponents>(
    ctx: ExExContext<Node>,
    mut connection: Connection,
) -> eyre::Result<impl Future<Output = eyre::Result<()>>> {
    create_tables(&mut connection)?;
    Ok(token_transfer_exex(ctx, connection))
}

fn create_tables(connection: &mut Connection) -> rusqlite::Result<()> {
    connection.execute(
        r#"
        CREATE TABLE IF NOT EXISTS token_transfers (
            id INTEGER PRIMARY KEY,
            block_number INTEGER NOT NULL,
            tx_hash TEXT NOT NULL,
            from_address TEXT NOT NULL,
            to_address TEXT NOT NULL,
            amount TEXT NOT NULL
        );
        "#,
        (),
    )?;

    info!("Initialized database table");
    Ok(())
}

async fn token_transfer_exex<Node: FullNodeComponents>(
    mut ctx: ExExContext<Node>,
    connection: Connection,
) -> eyre::Result<()> {
    while let Some(notification) = ctx.notifications.recv().await {
        if let Some(reverted_chain) = notification.reverted_chain() {
            let events = decode_chain_into_events(&reverted_chain);
            let deleted = delete_events(&connection, &events)?;
            info!(block_range = ?reverted_chain.range(), deleted, "Reverted chain events");
        }

        if let Some(committed_chain) = notification.committed_chain() {
            let events = decode_chain_into_events(&committed_chain);
            let inserted = insert_events(&connection, &events)?;
            info!(block_range = ?committed_chain.range(), inserted, "Committed chain events");

            ctx.events.send(ExExEvent::FinishedHeight(committed_chain.tip().number))?;
        }
    }

    Ok(())
}

fn decode_chain_into_events(
    chain: &Chain,
) -> Vec<(u64, String, TokenTransfer)> {
    chain
        .blocks_and_receipts()
        .flat_map(|(block, receipts)| {
            block.body.iter().zip(receipts.iter().flatten()).flat_map(move |(tx, receipt)| {
                receipt.logs.iter()
                    .filter(|log| log.address == TOKEN_CONTRACT_ADDRESS)
                    .filter_map(|log| {
                        TokenContractEvents::decode_raw_log(log.topics(), &log.data.data, true)
                            .ok()
                            .and_then(|event| {
                                if let TokenContractEvents::TokenTransfer(transfer) = event {
                                    Some((block.number, tx.hash().to_string(), transfer))
                                } else {
                                    None
                                }
                            })
                    })
            })
        })
        .collect()
}

fn insert_events(connection: &Connection, events: &[(u64, String, TokenTransfer)]) -> rusqlite::Result<usize> {
    let mut stmt = connection.prepare(
        "INSERT INTO token_transfers (block_number, tx_hash, from_address, to_address, amount) VALUES (?, ?, ?, ?, ?)"
    )?;

    let inserted = events.iter().try_fold(0, |acc, (block_number, tx_hash, event)| {
        stmt.execute(&[
            block_number.to_string(),
            tx_hash,
            &event.from.to_string(),
            &event.to.to_string(),
            &event.amount.to_string(),
        ])?;
        Ok(acc + 1)
    })?;

    Ok(inserted)
}

fn delete_events(connection: &Connection, events: &[(u64, String, TokenTransfer)]) -> rusqlite::Result<usize> {
    let mut stmt = connection.prepare("DELETE FROM token_transfers WHERE block_number = ? AND tx_hash = ?")?;

    let deleted = events.iter().try_fold(0, |acc, (block_number, tx_hash, _)| {
        let affected = stmt.execute(&[block_number.to_string(), tx_hash])?;
        Ok(acc + affected)
    })?;

    Ok(deleted)
}

fn main() -> eyre::Result<()> {
    reth::cli::Cli::parse_args().run(|builder, _| async move {
        let handle = builder
            .node(EthereumNode::default())
            .install_exex("TokenTransferIndexer", |ctx| async move {
                let connection = Connection::open("token_transfers.db")?;
                init(ctx, connection).await
            })
            .launch()
            .await?;

        handle.wait_for_node_exit().await
    })
}