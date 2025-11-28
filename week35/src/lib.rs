use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info}, 
    entrypoint::ProgramResult,
    entrypoint,
    msg,
    pubkey::Pubkey
};

#[derive(BorshSerialize,BorshDeserialize)]
struct OnChaindata{
    count:u32
}

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id:&Pubkey,
    accounts:&[AccountInfo],
    _instruction_data: &[u8]
)->ProgramResult{
    let mut iter=accounts.iter();
    let data_account=next_account_info(&mut iter)?;

    let mut data_on_chain=OnChaindata::try_from_slice(&data_account.data.borrow_mut())?;
    if data_on_chain.count==0{
        data_on_chain.count=1;
    }
    else{
        data_on_chain.count*=2;
    }

    let _=data_on_chain.serialize(&mut *data_account.data.borrow_mut())?;
    msg!("contract succeded.");
    Ok(())
}
