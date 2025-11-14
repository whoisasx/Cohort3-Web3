import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WagmiProvider } from "wagmi";
import { config } from "./config.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<WagmiProvider config={config}>
			<QueryClientProvider client={client}>
				<App />
			</QueryClientProvider>
		</WagmiProvider>
	</StrictMode>
);
