import * as borsh from "borsh";
import bs58 from "bs58";
import {
	address,
	airdropFactory,
	appendTransactionMessageInstructions,
	createSolanaRpc,
	createSolanaRpcSubscriptions,
	createTransactionMessage,
	generateKeyPairSigner,
	getSignatureFromTransaction,
	lamports,
	pipe,
	sendAndConfirmTransactionFactory,
	setTransactionMessageFeePayer,
	setTransactionMessageFeePayerSigner,
	setTransactionMessageLifetimeUsingBlockhash,
	signTransactionMessageWithSigners,
	type KeyPairSigner,
} from "@solana/kit";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { expect, test } from "bun:test";
import {
	CounterAccount,
	DecrementInstruction,
	decrementInstructionSchema,
	GREETING_SIZE,
	instructionSchema,
	schema,
} from "./type";
import { getCreateAccountInstruction } from "@solana-program/system";

let counterAccountKeypair: KeyPairSigner<string>;
let adminKeypair: KeyPairSigner<string>;

test("account is initialised", async () => {
	adminKeypair = await generateKeyPairSigner();
	counterAccountKeypair = await generateKeyPairSigner();

	const rpc = createSolanaRpc("http://127.0.0.1:8899");
	const rpcSubscriptions = createSolanaRpcSubscriptions(
		"ws://127.0.0.1:8900"
	);
	const airdrop = airdropFactory({ rpc, rpcSubscriptions });

	//airdropping to the admin account.
	await airdrop({
		recipientAddress: adminKeypair.address,
		lamports: lamports(10_000_000_000n),
		commitment: "confirmed",
	});
	const balance = await rpc.getBalance(adminKeypair.address).send();
	expect(balance.value).toBe(lamports(10_000_000_000n));

	const minAmount = await rpc
		.getMinimumBalanceForRentExemption(BigInt(GREETING_SIZE))
		.send();
	const programid = address("CKKdTGDTdaxVnUY5kUo7yEgDgb2nTMLUUVDqYPtQQheP");

	const ix = getCreateAccountInstruction({
		payer: adminKeypair,
		newAccount: counterAccountKeypair,
		lamports: minAmount,
		space: GREETING_SIZE,
		programAddress: programid,
	});
	const {
		value: { blockhash, lastValidBlockHeight },
	} = await rpc.getLatestBlockhash().send();
	const transactionMessage = pipe(
		createTransactionMessage({ version: 0 }),
		(tx) =>
			setTransactionMessageFeePayer(address(adminKeypair.address), tx),
		(tx) =>
			setTransactionMessageLifetimeUsingBlockhash(
				{ blockhash, lastValidBlockHeight },
				tx
			),
		(tx) => appendTransactionMessageInstructions([ix], tx)
	);
	const signedTransaction = await signTransactionMessageWithSigners(
		transactionMessage
	);
	await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
		signedTransaction as any,
		{ commitment: "confirmed" }
	);
	const transactionSignature = getSignatureFromTransaction(signedTransaction);
	console.log(transactionSignature);
	console.log(counterAccountKeypair.address);

	const counterAccount = await rpc
		.getAccountInfo(counterAccountKeypair.address)
		.send();
	if (!counterAccount) {
		throw new Error("something is missing.");
	}
	const counter = borsh.deserialize(
		schema,
		bs58.decode(counterAccount.value?.data!)
	) as CounterAccount;
	console.log(counter.count);
	expect(counter.count).toBe(0);
});

test("counter does increase", async () => {
	const contractAddress = address(
		"DRgDaL97CE2TGukcugyeuQPGag6iPiMc5AczVm9ghqfA"
	);
	const programAddress = address(
		"CKKdTGDTdaxVnUY5kUo7yEgDgb2nTMLUUVDqYPtQQheP"
	);
	adminKeypair = await generateKeyPairSigner();

	const rpc = createSolanaRpc("http://127.0.0.1:8899");
	const rpcSubscriptions = createSolanaRpcSubscriptions(
		"ws://127.0.0.1:8900"
	);
	const airdrop = airdropFactory({ rpc, rpcSubscriptions });
	//airdropping to the admin account.
	await airdrop({
		recipientAddress: adminKeypair.address,
		lamports: lamports(10_000_000_000n),
		commitment: "confirmed",
	});
	const balance = await rpc.getBalance(adminKeypair.address).send();
	expect(balance.value).toBe(lamports(10_000_000_000n));

	const {
		value: { blockhash, lastValidBlockHeight },
	} = await rpc.getLatestBlockhash().send();

	const transactionMessage = pipe(
		createTransactionMessage({ version: 0 }),
		(tx) => setTransactionMessageFeePayerSigner(adminKeypair, tx),
		(tx) =>
			setTransactionMessageLifetimeUsingBlockhash(
				{ blockhash, lastValidBlockHeight },
				tx
			),
		(tx) =>
			appendTransactionMessageInstructions(
				[
					{
						accounts: [
							{
								address: contractAddress,
								role: 1,
							},
						],
						programAddress: programAddress,
						data: new Uint8Array([0, 1, 0, 0, 0]),
					},
				],
				tx
			)
	);

	const signedTransaction = await signTransactionMessageWithSigners(
		transactionMessage
	);
	await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
		signedTransaction as any,
		{ commitment: "confirmed" }
	);
	const transactionSignature = getSignatureFromTransaction(signedTransaction);

	const counterAccount = await rpc.getAccountInfo(contractAddress).send();
	if (!counterAccount) {
		throw new Error("contract is missing.");
	}

	const counter = borsh.deserialize(
		schema,
		bs58.decode(counterAccount.value?.data!)
	) as CounterAccount;

	console.log(counter.count);
	expect(counter.count).toBe(49);
});

test("counter does decrease ", async () => {
	const contractAddress = address(
		"DRgDaL97CE2TGukcugyeuQPGag6iPiMc5AczVm9ghqfA"
	);
	const programAddress = address(
		"CKKdTGDTdaxVnUY5kUo7yEgDgb2nTMLUUVDqYPtQQheP"
	);
	adminKeypair = await generateKeyPairSigner();

	const rpc = createSolanaRpc("http://127.0.0.1:8899");
	const rpcSubscriptions = createSolanaRpcSubscriptions(
		"ws://127.0.0.1:8900"
	);
	const airdrop = airdropFactory({ rpc, rpcSubscriptions });
	//airdropping to the admin account.
	await airdrop({
		recipientAddress: adminKeypair.address,
		lamports: lamports(10_000_000_000n),
		commitment: "confirmed",
	});
	const balance = await rpc.getBalance(adminKeypair.address).send();
	expect(balance.value).toBe(lamports(10_000_000_000n));

	const {
		value: { blockhash, lastValidBlockHeight },
	} = await rpc.getLatestBlockhash().send();

	// const decrementIx = new DecrementInstruction({
	// 	instruction: 1,
	// 	amount: 1,
	// });
	const decrementIx = {
		instruction: 1,
		amount: 1,
	};
	const instructionData = borsh.serialize(
		decrementInstructionSchema,
		// instructionSchema,
		decrementIx
	);
	console.log(instructionData);

	const transactionMessage = pipe(
		createTransactionMessage({ version: 0 }),
		(tx) => setTransactionMessageFeePayerSigner(adminKeypair, tx),
		(tx) =>
			setTransactionMessageLifetimeUsingBlockhash(
				{
					blockhash,
					lastValidBlockHeight,
				},
				tx
			),
		(tx) =>
			appendTransactionMessageInstructions(
				[
					{
						accounts: [
							{
								address: contractAddress,
								role: 1,
							},
						],
						programAddress: programAddress,
						data: instructionData,
					},
				],
				tx
			)
	);
	const signedTransaction = await signTransactionMessageWithSigners(
		transactionMessage
	);
	await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
		signedTransaction as any,
		{ commitment: "confirmed" }
	);
	const transactionSignature = getSignatureFromTransaction(signedTransaction);

	const counterAccount = await rpc.getAccountInfo(contractAddress).send();
	if (!counterAccount) {
		throw new Error("contract does not exist.");
	}
	const counter = borsh.deserialize(
		schema,
		bs58.decode(counterAccount.value?.data!)
	) as CounterAccount;
	console.log(counter.count);
	expect(counter.count).toBe(48);
});
