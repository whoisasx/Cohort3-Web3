const {
	Connection,
	clusterApiUrl,
	Keypair,
	SystemProgram,
	Transaction,
	sendAndConfirmTransaction,
	LAMPORTS_PER_SOL,
} = require("@solana/web3.js");
// const { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction } = require('@solana/spl-token');
const splToken = require("@solana/spl-token");

const connection = new Connection(clusterApiUrl("devnet"));

async function createTokenMint(payer) {
	const mint = Keypair.generate();

	const createAccountInstruction = SystemProgram.createAccount({
		fromPubkey: payer.publicKey,
		newAccountPubkey: mint.publicKey,
		space: splToken.MINT_SIZE,
		lamports: await connection.getMinimumBalanceForRentExemption(
			splToken.MINT_SIZE
		),
		programId: splToken.TOKEN_PROGRAM_ID,
	});

	const initializeMintInstruction = splToken.createInitializeMintInstruction(
		mint.publicKey,
		9,
		payer.publicKey,
		payer.publicKey,
		splToken.TOKEN_PROGRAM_ID
	);

	const transaction = new Transaction().add(
		createAccountInstruction,
		initializeMintInstruction
	);

	const transactionSignature = await sendAndConfirmTransaction(
		connection,
		transaction,
		[payer, mint],
		{ commitment: "confirmed" }
	);

	console.log("mint address: ", mint.publicKey.toBase58());
	console.log("transaction signature: ", transactionSignature);
}

async function main() {
	const secretkey = [
		64, 229, 56, 194, 246, 46, 35, 60, 220, 243, 170, 180, 25, 145, 42, 93,
		249, 170, 178, 78, 28, 83, 120, 135, 179, 93, 151, 145, 136, 178, 131,
		175, 150, 44, 145, 85, 59, 112, 233, 186, 226, 192, 108, 250, 240, 209,
		64, 43, 23, 37, 245, 159, 89, 164, 156, 226, 79, 22, 215, 174, 40, 199,
		179, 82,
	];
	try {
		const payer = Keypair.fromSecretKey(Uint8Array.from(secretkey));
		const balance = await connection.getBalance(payer.publicKey);
		console.log(`Payer Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

		if (balance < 0.005 * LAMPORTS_PER_SOL) {
			console.log(
				"🚨 WARNING: SOL balance bohot kam hai. Minting fail ho sakti hai!"
			);
		}
		await createTokenMint(payer);
	} catch (e) {
		console.error("\n❌ FINAL ERROR:", e);
		console.log(
			"\nRoast: Lagta hai Devnet phir se gussa ho gaya ya key ka koi masla hai!"
		);
	}
}
main();
