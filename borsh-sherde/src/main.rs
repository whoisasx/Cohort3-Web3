fn main(){
    let s1:String="adil".into();
    let ans:&String;
    {
        let s2:String="shaikh".into();
        ans=longest_string(&s1,&s2);
        println!("ans: {ans}");
    }
}

fn longest_string<'a,'b:'a>(s1:&'a String, s2:&'b String)->&'a String{
    if s1.len()>s2.len() {
        return &s1;
    }
    &s2
}
