use borsh::{BorshDeserialize, BorshSerialize, from_slice};
use solana_program::{
    account_info::{next_account_info,AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    entrypoint
};

#[derive(BorshDeserialize,BorshSerialize)]
enum InstructionType{
    Increment(u32),
    Decrement(u32)
}

#[derive(BorshDeserialize,BorshSerialize)]
struct Counter{
    count:u32
}

entrypoint!(counter_contract);

pub fn counter_contract(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
)->ProgramResult{
    let acc=next_account_info(&mut accounts.iter())?;
    let instruction_type:InstructionType=from_slice(&instruction_data)?;
    let mut counter_data:Counter=from_slice(&acc.data.borrow())?;

    match instruction_type{
        InstructionType::Increment(val)=>{
            msg!("executing increment.");
            counter_data.count+=val;
        },
        InstructionType::Decrement(val)=>{
            msg!("executing decrement");
            counter_data.count-=val;
        }
    }

    let _=counter_data.serialize(&mut *acc.data.borrow_mut());
    msg!("contract succeded");

    Ok(())
}