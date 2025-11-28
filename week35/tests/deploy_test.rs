use litesvm::LiteSVM;
use solana_sdk::{
    pubkey::Pubkey,
    signature::{Keypair,Signer},
    transaction::Transaction,
};
use solana_system_interface::{instruction::create_account};
use borsh::{BorshSerialize,BorshDeserialize,to_vec};


#[derive(BorshSerialize,BorshDeserialize,Debug)]
struct  OnChaindata{
    count:u32
}

#[test]
fn test_deploy_program(){
    let mut svm=LiteSVM::new();

    let program_id=Pubkey::new_unique();
    let program_bytes=include_bytes!("../../target/deploy/week35.so");
    let _=svm.add_program(program_id, program_bytes).unwrap();

    let contract_info=svm.get_account(&program_id).unwrap();
    println!("contract information: {contract_info:?}");
    println!("contract address: {program_id:?}");

    let payer=Keypair::new();
    let _=svm.airdrop(&payer.pubkey(), 10_000_000_000).unwrap();

    let data_account=Keypair::new();
    let data=OnChaindata{count:2};
    let data_len=to_vec(&data).unwrap().len();
    let rent_exemption_amount=svm.minimum_balance_for_rent_exemption(data_len);
    let ixs=vec![
        create_account(&payer.pubkey(), &data_account.pubkey(), rent_exemption_amount, data_len as u64, &program_id)
    ];

    let tx=Transaction::new_signed_with_payer(&ixs, Some(&payer.pubkey()), &[&payer, &data_account], svm.latest_blockhash());
    let _=svm.send_transaction(tx).unwrap();

    let account_info=svm.get_account(&data_account.pubkey()).unwrap();
    println!("account_info: {account_info:?}");
    let counter_data=OnChaindata::try_from_slice(&account_info.data).unwrap();
    let count=counter_data.count;

    assert!(count==0);
}