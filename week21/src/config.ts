import { http, createConfig, injected } from "wagmi";
import { mainnet, seiDevnet } from "wagmi/chains";

//https://eth-sepolia.g.alchemy.com/v2/2qBzn9AIjY7lcSlbvri1k
//https://eth-mainnet.g.alchemy.com/v2/2qBzn9AIjY7lcSlbvri1k

export const config = createConfig({
	chains: [mainnet, seiDevnet],
	connectors: [injected()],
	transports: {
		[mainnet.id]: http(),
		[seiDevnet.id]: http(),
	},
});
