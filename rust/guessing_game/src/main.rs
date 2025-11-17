use std::io;
use rand::Rng;
use std::cmp::Ordering;

fn main(){
    println!("please guess the number.");

    let secret_number=rand::rng().random_range(1..=100);
    println!("your secret number is: {}", secret_number);

    loop{
        println!("please input your number.");

        let mut guess=String::new();
        io::stdin()
            .read_line(&mut guess)
            .expect("failed to read line.");

        let guess: u32=match guess.trim().parse(){
            Ok(num)=>num,
            Err(_)=>continue,
        };

        println!("you guessed: {guess}");

        match guess.cmp(&secret_number){
            Ordering::Less => println!("too small."),
            Ordering::Greater => println!("too large."),
            Ordering::Equal => {
                println!("you won.");
                break;
            }
        }
    }
}
