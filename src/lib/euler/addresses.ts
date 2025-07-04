import type { Address } from 'viem';

export interface DevlandAddresses {
  evc: Address;
  eVaultFactory: Address;
  vaults: {
    WETH: Address;
    wstETH: Address;
    USDC: Address;
    USDT: Address;
    DAI: Address;
    USDZ: Address;
  };
  eulerSwap: {
    factory: Address;
    periphery: Address;
  };
  lens: {
    maglev: Address;
  };
}

// Real devland addresses from your files
export const DEVLAND_ADDRESSES: DevlandAddresses = {
  evc: '0x261D8c5e9742e6f7f1076Fa1F560894524e19cad',
  eVaultFactory: '0x057ef64E23666F000b34aE31332854aCBd1c8544',
  vaults: {
    WETH: '0x3b3112c4376d037822DECFf3Fe6CD30E1E726517',    // vaults[0]
    wstETH: '0x94fFf89F1Bd236b709Ef01729Db481258015F8bf',  // vaults[1]
    USDC: '0xF9Ec57D2436177B4Decf90Ef9EdffCef0cC0EE25',    // vaults[2]
    USDT: '0x03d8C9d09623A6E51ccAb1d80Add8449FB1f35A7',    // vaults[3]
    DAI: '0x5B2855689d05c9D081a1023dF585FaAae0b51832',     // vaults[4]
    USDZ: '0x860cA3E2784a35F1f85B003975E0daBCb0d1FBbD',    // vaults[5]
  },
  eulerSwap: {
    factory: '0x48df654a5431182e6d386a10dBdDA5C58d4dDdc2',
    periphery: '0x018ECbAD742Fa1ce05efd0981f36Eb14D9625e14',
  },
  lens: {
    maglev: '0x11dE489De683DbBe8e1483700656F54280224531',
  },
};

// Default devland user and private key
export const DEVLAND_USER = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address;
export const DEVLAND_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as const;

// Helper functions
export function getVaultAddress(symbol: keyof DevlandAddresses['vaults']): Address {
  return DEVLAND_ADDRESSES.vaults[symbol];
}

export const VAULT_SYMBOLS: Record<Address, string> = {
  '0x3b3112c4376d037822DECFf3Fe6CD30E1E726517': 'WETH',
  '0x94fFf89F1Bd236b709Ef01729Db481258015F8bf': 'wstETH',
  '0xF9Ec57D2436177B4Decf90Ef9EdffCef0cC0EE25': 'USDC',
  '0x03d8C9d09623A6E51ccAb1d80Add8449FB1f35A7': 'USDT',
  '0x5B2855689d05c9D081a1023dF585FaAae0b51832': 'DAI',
  '0x860cA3E2784a35F1f85B003975E0daBCb0d1FBbD': 'USDZ',
};

export function getVaultSymbol(address: Address): string | undefined {
  return VAULT_SYMBOLS[address];
}