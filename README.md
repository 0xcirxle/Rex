## Rex [Reth based Indexer 🦀⚡️]

[[Youtube Demo video](https://www.youtube.com/watch?v=C7p0q3PMeqc)]

This project is an Ethereum indexer built using Reth (Rust Ethereum) and Lighthouse. It's designed to efficiently index and store specific events from the Ethereum Sepolia blockchain. Our indexer utilizes Reth's Execution Extensions (ExExes) to create a high-performance, real-time indexing solution.

### Key Features:

- Real-time indexing of specific Ethereum events
- Efficient handling of chain reorganizations
- SQLite and MySQL database for persistent storage of indexed data
- Built on Reth's ExEx framework for optimal performance
- Compatible with Ethereum

Rex is particularly useful for projects that need to track specific on-chain events without the overhead of running a full Ethereum node or relying on centralized indexing services.

## Architecture

![architecture](https://github.com/0xcirxle/Rex/assets/156283441/4e877215-d5d9-4ecb-ab3c-bcb0a8f6e597)

## Local installation

Our indexer consists of three main components:

- Reth Node: Provides real-time blockchain data
- ExEx (Execution Extension): Processes blockchain data and extracts relevant events
- Database: Stores indexed events persistently

### Configure the indexer:

Update the TOKEN_CONTRACT_ADDRESS in BackEnd/Local/main.rs with your target contract address.
Ensure token_contract_abi.json contains the correct ABI for your contract


Build and run the indexer: `Copycargo build --release ./target/release/sepolia-token-transfer-indexer`


### Key Components

#### ExEx Implementation (BackEnd/Local/main.rs):

- init: Initializes the database and starts the indexing process
- token_transfer_exex: Main indexing logic, processes blockchain notifications
- decode_chain_into_events: Extracts relevant events from blockchain data
- insert_events and delete_events: Handle database operations


#### Database Schema:
```
sqlCopyCREATE TABLE IF NOT EXISTS token_transfers (
    id INTEGER PRIMARY KEY,
    block_number INTEGER NOT NULL,
    tx_hash TEXT NOT NULL,
    from_address TEXT NOT NULL,
    to_address TEXT NOT NULL,
    amount TEXT NOT NULL
);
```
#### Event Processing:

1. The indexer listens for TokenTransfer events from the specified contract
2. Events are processed in real-time as new blocks are added to the chain
3. Chain reorganizations are handled by deleting and re-inserting affected events

## RPC Installation

This indexer also consists of three main components:

- Reth Endpoint: Provides real-time blockchain data
- Backend: gets data and places it in the database, also serves the data to the frontend
- Database: Stores indexed events persistently

### Using Rex

- first specify the chain
- then enter the address, ABI, and event that you want to index
- click on generate button and wait for the indexer to finish.
- get the JSON data on the results page


### Performance Considerations

The indexer leverages Reth's efficient block processing capabilities. SQLite is used for its simplicity and performance for single-machine deployments. Batch inserts are used to optimize database write operations

## Challenges Faced

1. Node setup : Biggest hurdle we face was in setting up our local node. It had high hardware requirements. Long sync times, many kind of errors. We tried a lot and had the node setup and synced at the 6th day of the hackathon. This was the major reason of non integration of local node.

2. Reth Integration: Adapting to Reth's ExEx framework required a deep dive into its documentation and examples. We faced initial challenges in learning rust within a very short timeframe.

3. Event Decoding: Properly decoding Ethereum events and handling different data types proved to be tricky, especially when dealing with complex event structures.

4. Performance Optimization: Balancing real-time indexing with database write performance was challenging. We had to experiment with different batch sizes and database configurations to find the optimal setup.

### Team Members Contribution
- Aniruddh
  - I focused mainly on the local node portion of the project.
  - I wrote the ExEx, setup the node and interacted with the execution and consensus clients.
  - I also made the front-end of our project
 
- Harrish
  - 
Learning from this Hackathon

Rust Ecosystem: We gained valuable experience working with Rust in a blockchain context, appreciating its performance benefits and strong type system.
Ethereum Internals: The project deepened our understanding of Ethereum's internal workings, particularly around event emission and chain reorganizations.
Real-time Data Processing: We learned techniques for efficient real-time data processing and storage, balancing speed with data integrity.
Collaboration and Project Management: Working as a team on a complex project improved our skills in code collaboration, task division, and project management in a hackathon setting.
Blockchain Indexing Concepts: We gained insights into the challenges and solutions in blockchain data indexing, which are applicable beyond this specific project.
Open Source Development: Contributing to and building upon open-source projects like Reth and Lighthouse taught us valuable lessons about open-source development practices.
Problem-Solving Under Pressure: The hackathon environment honed our ability to quickly troubleshoot issues and make decisions under time constraints.

This project has not only resulted in a functional Ethereum indexer but has also significantly expanded our skills and knowledge in blockchain development, Rust programming, and real-time data processing.
