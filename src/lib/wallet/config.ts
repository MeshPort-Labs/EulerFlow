import { createConfig, http } from 'wagmi';
import { mainnet, localhost } from 'wagmi/chains';
import { metaMask, walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';

// Define devland chain
export const devlandChain = {
  id: 31337,
  name: 'Devland',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  blockExplorers: {
    default: { name: 'Local', url: 'http://localhost:8545' },
  },
  testnet: true,
} as const;

// Wallet connectors
const connectors = [
  // MetaMask
  metaMask({
    dappMetadata: {
      name: 'EulerFlow',
      url: 'http://localhost:5173',
    },
  }),
  
  // Injected (for other browser wallets)
  injected({
    target: 'metaMask',
  }),
  
  // Coinbase Wallet
  coinbaseWallet({
    appName: 'EulerFlow',
    appLogoUrl: 'https://example.com/logo.png',
  }),
  
  // WalletConnect (optional - requires project ID)
  // walletConnect({
  //   projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  // }),
];

// Wagmi configuration
export const wagmiConfig = createConfig({
  chains: [devlandChain, mainnet],
  connectors,
  transports: {
    [devlandChain.id]: http('http://127.0.0.1:8545'),
    [mainnet.id]: http(),
  },
});