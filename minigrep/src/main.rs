use std::env;
use std::fs;
use std::process;
use std::error::Error;
use minigrep::{search,search_case_insenstive};

fn main() {
    let args: Vec<String>=env::args().collect();

    let config=Config::build(&args).unwrap_or_else(|err| {
        println!("problem while parsing arguments: {err}");
        process::exit(1);
    });

    if let Err(e)=run(config){
        println!("problem while reading the file: {e}");
        process::exit(1);
    }
}

fn run(config:Config)->Result<(),Box<dyn Error>>{
    let contents=fs::read_to_string(config.file_path).expect("should have been able to read the file.");

    let results=if config.ignore_case{
        search_case_insenstive(&config.query,&contents)
    }else{
        search(&config.query,&contents)
    };
    
    for line in results{
        println!("{line}");
    }

    Ok(())
}

struct Config{
    query:String,
    file_path:String,
    ignore_case:bool,
}

impl Config{
    fn build(args: &[String])->Result<Config,&'static str>{
        if args.len()<3 {
            return Err("not enough parameters.");
        }
        let query=args[1].clone();
        let file_path=args[2].clone();

        let ignore_case=env::var("IGNORE_CASE").is_ok();

        Ok(Config{query,file_path,ignore_case})
    }
}
