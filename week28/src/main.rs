use std::ops::Add;
#[derive(Debug)]

struct User{
    username:String,
    salary:u32,
}
impl Add for User{
    type Output = u32;
    fn add(self, rhs: Self) -> u32 {
        self.salary+rhs.salary
    }
}
fn main(){
    println!("hello world.");
    println!("{}",sum(3,4));

    let user1=User{
        username:"adil".to_string(),
        salary:3
    };
    let user2=User{
        username:"manisha".to_string(),
        salary:4
    };

    let usersum=sum(user1,user2);
    println!("{:?}",usersum);
}

fn sum<T:Add<Output=R>,R>(a:T,b:T)->R{
    a+b
}
