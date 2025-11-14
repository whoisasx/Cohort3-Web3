import {
	useAccount,
	useConnect,
	useConnectors,
	useDisconnect,
	useReadContract,
	useWriteContract,
} from "wagmi";
import "./App.css";
import { ABI } from "./abi";

function App() {
	return (
		<div>
			<h1>hello there</h1>
			<ConnectWallet />
			<TotalSupply />
			<AllowUsdt />
		</div>
	);
}

function ConnectWallet() {
	const { address } = useAccount();
	const connectors = useConnectors();
	const { connect } = useConnect();
	const { disconnect } = useDisconnect();

	if (address) {
		return (
			<div>
				<h3>connected to {address}</h3>
				<button onClick={() => disconnect()}>Disconnect</button>
			</div>
		);
	}

	return (
		<div>
			{connectors.map((c, id) => (
				<button key={id} onClick={() => connect({ connector: c })}>
					Connect via {c.name}
				</button>
			))}
		</div>
	);
}
function TotalSupply() {
	const { address } = useAccount();
	const { data, isLoading, error } = useReadContract({
		address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
		abi: ABI,
		functionName: "balanceOf",
		args: [address],
	});
	if (isLoading) return <>loading...</>;
	if (error) {
		console.error(error);
		return <>error</>;
	}
	return (
		<div>
			<h3>total balance: </h3>
			<p>{data?.toString()}</p>
		</div>
	);
}
function AllowUsdt() {
	const { data, writeContract } = useWriteContract();
	const { address } = useAccount();

	async function handleApprove() {
		writeContract({
			address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
			abi: ABI,
			functionName: "approve",
			args: [address, BigInt(1)],
		});
	}

	return (
		<div>
			<button onClick={handleApprove}>Approve 1 dollar</button>
			<p>{data && <>transaction hash: {data}</>}</p>
		</div>
	);
}

export default App;
