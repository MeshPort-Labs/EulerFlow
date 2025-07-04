import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';
import { DEVLAND_PRIVATE_KEY } from '../euler/addresses';

const devlandChain = {
  ...mainnet,
  id: 31337,
  name: 'Devland',
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
};

export const publicClient = createPublicClient({
  chain: devlandChain,
  transport: http('http://127.0.0.1:8545'),
});

export function createDevlandWallet() {
  const account = privateKeyToAccount(DEVLAND_PRIVATE_KEY);
  
  const walletClient = createWalletClient({
    account,
    chain: devlandChain,
    transport: http('http://127.0.0.1:8545'),
  });

  console.log(`🔧 Devland wallet initialized for account: ${account.address}`);
  
  return { walletClient, account, publicClient };
}

export const { walletClient, account } = createDevlandWallet();