use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use ethers::prelude::*;
use ethers::providers::{Provider, Http};
use ethers::types::{Filter, H256, Log};
use serde_json::Value;
use std::convert::TryFrom;
use std::sync::{Arc, Mutex};
use tokio;
use mysql::*;
use mysql::prelude::*;
use anyhow::Result;
use ethers::abi::{Abi, Event};
use ethers::abi::ParamType;

#[derive(Clone)]
struct AppState {
    contract_address: Arc<Mutex<String>>,
    event_name: Arc<Mutex<String>>,
}


async fn handle_update_contract(state: web::Data<AppState>, body: web::Json<Value>) -> impl Responder {
    let contract_address = body["contract_address"].as_str().unwrap().to_string();
    let abi = body["abi"].as_str().unwrap();
    let event_name = body["event_name"].as_str().unwrap().to_string();

    {
        let mut addr = state.contract_address.lock().unwrap();
        *addr = contract_address.clone();
    }

    {
        let mut event = state.event_name.lock().unwrap();
        *event = event_name.clone();
    }

    
    if let Err(e) = main_logic(&contract_address, abi, &event_name).await {
        eprintln!("Error: {}", e);
        return HttpResponse::InternalServerError().body(format!("Error updating contract: {}", e));
    }

    HttpResponse::Ok().body("Contract updated")
}

async fn get_data(state: web::Data<AppState>) -> impl Responder {
    let contract_address = state.contract_address.lock().unwrap().clone();
    let event_name = state.event_name.lock().unwrap().clone();

    match fetch_data(&contract_address, &event_name).await {
        Ok(data) => HttpResponse::Ok().json(data),
        Err(e) => {
            eprintln!("Error fetching data: {}", e);
            HttpResponse::InternalServerError().body(format!("Error fetching data: {}", e))
        }
    }
}


async fn main_logic(contract_address: &str, abi: &str, event_name: &str) -> Result<(), Box<dyn std::error::Error>> {
    
    let provider = Provider::<Http>::try_from("https://rpc.sepolia.org")?;
    let provider = Arc::new(provider);

   
    let contract_address: Address = contract_address.parse()?;

   
    let abi: Abi = serde_json::from_str(abi)?;

   
    let event = abi.events().find(|e| e.name == event_name).unwrap();

    
    let table_name = format!("{}", event_name);
    let create_table_sql = create_table_sql(&table_name, &event)?;

    
    let url = "mysql://indexer:Harrish@90600@localhost:3306/ethereum_data";
    let pool = Pool::new(url)?;
    let mut conn = pool.get_conn()?;

    
    conn.query_drop(create_table_sql)?;

    
    let event_signature = create_event_signature(&event);
    println!("Event signature is {:?}", event_signature);

    
    let filter = Filter::new()
        .address(contract_address)
        .topic0(event_signature)
        .from_block(6189721)
        .to_block(BlockNumber::Latest);
    println!("Filter is {:?}", filter);

    
    let logs: Vec<Log> = provider.get_logs(&filter).await?;

    
    for log in logs {
        let insert_sql = insert_log_sql(&table_name, &event)?;
        let params = extract_log_params(&log, &event)?;

        conn.exec_drop(insert_sql, params)?;
    }

    Ok(())
}

// fn shorten_contract_address(address: &str) -> String {
//     if address.len() <= 8 {
//         return address.to_owned(); // Return as is if the address is too short to shorten
//     }

//     let start = &address[..6]; // Take the first 6 characters (0x2639)
//     let end = &address[address.len() - 4..]; // Take the last 4 characters (54ce)

//     format!("{}...{}", start, end)
// }

async fn fetch_data(contract_address: &str, event_name: &str) -> Result<Vec<Value>, Box<dyn std::error::Error>> {
    //let shortened_address = shorten_contract_address(contract_address);
    let table_name = format!("{}", event_name);

    let url = "mysql://indexer:Harrish@90600@localhost:3306/ethereum_data";
    let pool = Pool::new(url)?;
    let mut conn = pool.get_conn()?;

    let select_sql = format!("SELECT * FROM `{}`", table_name);
    let result: Vec<Value> = conn.query_map(select_sql, |row: Row| {
        let id: u32 = row.get("id").unwrap_or_default();
        let fields: Vec<_> = row.columns_ref().iter().skip(1).collect();
        let mut json = serde_json::json!({});
        json["id"] = serde_json::json!(id);
        for field in fields {
            let field_name = field.name_str().to_string();
            let field_value: Option<String> = row.get(field_name.as_str()).unwrap_or_default();
            json[field_name] = serde_json::json!(field_value);
        }
        json
    })?;
    Ok(result)
}


fn create_table_sql(table_name: &str, event: &Event) -> Result<String, Box<dyn std::error::Error>> {
    let mut sql = format!("CREATE TABLE IF NOT EXISTS {} (id INT AUTO_INCREMENT PRIMARY KEY", table_name);
    for param in &event.inputs {
        let field_name = &param.name;
        let field_type = "TEXT";
        sql.push_str(&format!(", hi{} {}", field_name, field_type));
    }
    sql.push_str(")");
    println!("{:?}", sql);
    
    Ok(sql)
}


fn insert_log_sql(table_name: &str, event: &Event) -> Result<String, Box<dyn std::error::Error>> {
    let fields: Vec<String> = event.inputs.iter().map(|p| p.name.clone()).collect();
    let placeholders: Vec<String> = event.inputs.iter().map(|_| "?".to_string()).collect();
    let sql = format!(
        "INSERT INTO {} (hi{}) VALUES ({})",
        table_name,
        fields.join(", hi"),
        placeholders.join(", ")
    );
    println!("{:?}", sql);
    Ok(sql)
}


fn extract_log_params(log: &Log, event: &Event) -> Result<Vec<mysql::Value>, Box<dyn std::error::Error>> {
    let mut params = Vec::new();
    for param in &event.inputs {
        let value = match param.kind {
            ParamType::Address => mysql::Value::from(format!("{:?}", log.topics[1])),
            ParamType::Uint(_) | ParamType::Int(_) => mysql::Value::from(format!("{:?}", log.topics[2])),
            _ => return Err("Unsupported parameter type".into()),
        };
        params.push(value);
    }
    Ok(params)
}


fn create_event_signature(event: &Event) -> H256 {
    let mut signature = event.name.clone();
    signature.push('(');
    for (i, input) in event.inputs.iter().enumerate() {
        if i != 0 {
            signature.push(',');
        }
        signature.push_str(&input.kind.to_string());
    }
    signature.push(')');
    H256::from_slice(&ethers::utils::keccak256(signature))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let state = web::Data::new(AppState {
        contract_address: Arc::new(Mutex::new(String::new())),
        event_name: Arc::new(Mutex::new(String::new())),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(state.clone())
            .wrap(Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600))
            .service(web::resource("/update_contract").route(web::post().to(handle_update_contract)))
            .service(web::resource("/get_data").route(web::get().to(get_data)))
    })
    .bind("127.0.0.1:3030")?
    .run()
    .await
}
