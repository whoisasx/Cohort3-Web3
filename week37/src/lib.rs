use solana_program::{
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    account_info::{AccountInfo,next_account_info},
    example_mocks::solana_sdk::system_instruction::create_account,
    program::invoke_signed
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id:&Pubkey,
    accounts:&[AccountInfo],
    _instruction_data:&[u8]
)->ProgramResult{
    let iter=&mut accounts.iter();
    let pda=next_account_info(iter)?;
    let user_acc=next_account_info(iter)?;
    let _system_program=next_account_info(iter)?;

    let seeds=&[user_acc.key.as_ref(),b"user"];
    let (_pda_pub_key,bump)=Pubkey::find_program_address(seeds, program_id);
    
    let ix=create_account(user_acc.key, pda.key, 1_000_000_000, 8, program_id);

    let _=invoke_signed(&ix, accounts, &[&[user_acc.key.as_ref(),b"user", &[bump]]])?;

    Ok(())
}
