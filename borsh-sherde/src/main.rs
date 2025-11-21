use serde::{Serialize, Deserialize};
use borsh::{BorshSerialize, BorshDeserialize, from_slice, to_vec};

#[derive(Serialize, Deserialize, Debug,BorshSerialize, BorshDeserialize)]
struct User{
    name: String,
    age: u8,
}

fn main() {
    let user:User=User{
        name:"Adil".into(),
        age:24,
    };

    let json=serde_json::to_string(&user).unwrap();
    println!("JSON: {json}");
    
    let bin=to_vec(&user).unwrap();
    println!("{:?}", bin);

    let new_user:User=serde_json::from_str(&json).unwrap();
    println!("new user: {new_user:?}");

    let new_user_1=from_slice::<User>(&bin).unwrap();
    println!("{:?}", new_user_1);
}
