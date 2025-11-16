import { ethers } from "ethers";
import { PHRASE } from "./config";
import * as bip32 from "bip32";
import * as bip39 from "bip39";
import * as ecc from "tiny-secp256k1";
import { publicToAddress, toChecksumAddress } from "@ethereumjs/util";
import { HDNodeWallet } from "ethers";
import { Mnemonic } from "ethers";

export async function generateKeypair(
	index: number
): Promise<{ address: string; key: string }> {
	// const mnemonic = SEED;
	// const seed = await bip39.mnemonicToSeed(mnemonic);
	// const root = bip32.BIP32Factory(ecc).fromSeed(seed);
	// let derivedPath = `m/44'/60'/${index}/0/${index}'`;
	// const child = root.derivePath(derivedPath);
	// const addressBuffer = publicToAddress(child.publicKey, true);
	// const address = toChecksumAddress("0x" + addressBuffer.toHex());
	// const privatekey = "0x" + child.privateKey?.toHex();
	// console.log(privatekey, address);

	const mnemonic = PHRASE;
	// const mn = Mnemonic.entropyToPhrase(
	// 	crypto.getRandomValues(new Uint8Array(16))
	// );
	let derivedPath = `m/44'/60'/${index}/0/${index}'`;
	const wallet = HDNodeWallet.fromMnemonic(
		Mnemonic.fromPhrase(mnemonic),
		derivedPath
	);

	console.log(wallet.address, wallet.privateKey);
	return { address: wallet.address, key: wallet.privateKey };
}
generateKeypair(0);
