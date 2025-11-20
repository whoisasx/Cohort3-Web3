// #[derive(Debug)]

// enum Coin{
//     Penny,
//     Nickle,
//     Dime,
//     Quarter,
// }

// fn value_in_cents(coin:Coin)->u8{
//     match coin {
//         Coin::Penny=>{1},
//         Coin::Nickle=>{5},
//         Coin::Dime=>{10},
//         Coin::Quarter=>{25},
//     }
// }

// fn plus_one(num:Option<i32>)->Option<i32>{
//     match num{
//         None=>None,
//         Some(i)=>Some(i+1),
//     }
// }

fn main(){
    let s=String::from("adil shaikh");
    let r=&s;
    println!("s is: {s} and r is: {r}");

    let a="adil shaikh";
    let b=&a;
    println!("a is: {a} and b is: {b}");
}