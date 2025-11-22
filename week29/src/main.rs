use std::fmt::{Debug, Formatter,Result};
// #[derive(Debug)]
struct User{
    username:String,
    password: String,
    age:u32,
}

impl Debug for User{
    fn fmt(&self, f: &mut Formatter<'_>) -> Result{
        write!(f, "username is {}", self.username);
        return Ok(());
    }
}

fn main(){
    let user=User{
        username:"adil".into(),
        password:"adil4064".into(),
        age:5
    };
    dbg!(&user);
    println!("{:?}",user);
}