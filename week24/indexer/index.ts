import { JsonRpcProvider } from "ethers";
import axios from "axios";

const provider = new JsonRpcProvider(
	"https://eth-mainnet.g.alchemy.com/v2/2qBzn9AIjY7lcSlbvri1k"
);

async function getTransactionReciept(recentblock: number): Promise<any> {
	const hexblock = "0x" + recentblock.toString(16);
	const payload = {
		jsonrpc: "2.0",
		method: "eth_getBlockReceipts",
		params: [hexblock],
		id: 1,
	};
	const url = "https://eth-mainnet.g.alchemy.com/v2/2qBzn9AIjY7lcSlbvri1k";
	try {
		const response = await axios.post(url, payload, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		return response.data.result || [];
	} catch (error) {
		console.error("Error fetching transaction receipts:", error);
		return [];
	}
}

async function main() {
	//get the interested addresses from the database.
	const interestedAddresses = [
		"0xe4f6394211824cd8526568b0bf643e1fd3d5caca",
		"0xee7ae85f2fe2239e27d9c1e23fffe168d63b4055",
		"0xee7ae85f2fe2239e27d9c1e23fffe168d63b4055",
	];
	const recentblock = 23809582; //dont hardcode , get the latest one.

	//fetch all the tranasction from a block.
	const transactions = await getTransactionReciept(recentblock);
	// console.log("transactions: ", transactions);

	const interestedTransactions = Array(transactions).filter(
		(transaction: any) => {
			if (interestedAddresses.includes(transaction.to)) {
				console.log("yes");
				return true;
			}
			return false;
		}
	);
	console.log(interestedTransactions);

	//bad approach to update all the data in database as ethereum can fork.
	// wait for some blocks to be added.
}
main();
