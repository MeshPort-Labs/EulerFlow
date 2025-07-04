import { FormFieldConfig } from "@/components/PropertyPanel";

export const vaultOptions = [
  { 
    value: 'WETH', 
    label: 'WETH - Wrapped Ethereum Vault', 
    description: 'ETH lending vault',
    badge: 'Native',
    address: '0x3b3112c4376d037822DECFf3Fe6CD30E1E726517'
  },
  { 
    value: 'wstETH', 
    label: 'wstETH - Wrapped Staked ETH Vault', 
    description: 'Liquid staking token vault',
    badge: 'LST',
    address: '0x94fFf89F1Bd236b709Ef01729Db481258015F8bf'
  },
  { 
    value: 'USDC', 
    label: 'USDC - USD Coin Vault', 
    description: 'USDC lending vault',
    badge: 'Stable',
    address: '0xF9Ec57D2436177B4Decf90Ef9EdffCef0cC0EE25'
  },
  { 
    value: 'USDT', 
    label: 'USDT - Tether USD Vault', 
    description: 'USDT lending vault',
    badge: 'Stable',
    address: '0x03d8C9d09623A6E51ccAb1d80Add8449FB1f35A7'
  },
  { 
    value: 'DAI', 
    label: 'DAI - Dai Stablecoin Vault', 
    description: 'DAI lending vault',
    badge: 'Stable',
    address: '0x5B2855689d05c9D081a1023dF585FaAae0b51832'
  },
  { 
    value: 'USDZ', 
    label: 'USDZ - USDZ Vault', 
    description: 'USDZ lending vault',
    badge: 'Stable',
    address: '0x860cA3E2784a35F1f85B003975E0daBCb0d1FBbD'
  },
];
  
  export const tokenOptions = [
    { value: 'WETH', label: 'WETH', description: 'Wrapped Ethereum' },
    { value: 'wstETH', label: 'wstETH', description: 'Wrapped Staked ETH' },
    { value: 'USDC', label: 'USDC', description: 'USD Coin' },
    { value: 'USDT', label: 'USDT', description: 'Tether USD' },
    { value: 'DAI', label: 'DAI', description: 'Dai Stablecoin' },
    { value: 'USDZ', label: 'USDZ', description: 'USDZ Token' },
  ];


// Update existing configurations to use real vault options
export const coreActionConfigs: Record<string, FormFieldConfig[]> = {
  supply: [
    {
      key: 'vaultAddress',
      type: 'select',
      label: 'Vault',
      placeholder: 'Select vault to supply to',
      required: true,
      options: vaultOptions,
      helpText: 'Choose the vault where you want to supply your assets',
      tooltip: 'Vaults are isolated lending pools. Each vault corresponds to a specific asset.',
    },
    {
      key: 'amount',
      type: 'input',
      inputType: 'text',
      label: 'Amount',
      placeholder: 'Enter amount (e.g., 1000 or 50%)',
      required: true,
      helpText: 'Amount to supply. Use percentage for dynamic amounts.',
      tooltip: 'You can enter absolute amounts (1000) or percentages (50%) of your balance',
    },
  ],
  
  withdraw: [
    {
      key: 'vaultAddress',
      type: 'select',
      label: 'Vault',
      placeholder: 'Select vault to withdraw from',
      required: true,
      options: vaultOptions,
      helpText: 'Choose the vault where you want to withdraw your assets',
    },
    {
      key: 'amount',
      type: 'input',
      inputType: 'text',
      label: 'Amount',
      placeholder: 'Enter amount (e.g., 500 or 25%)',
      required: true,
      helpText: 'Amount to withdraw. Use percentage for dynamic amounts.',
    },
  ],
  
  borrow: [
    {
      key: 'vaultAddress',
      type: 'select',
      label: 'Vault',
      placeholder: 'Select vault to borrow from',
      required: true,
      options: vaultOptions,
      helpText: 'Choose the vault where you want to borrow assets',
      tooltip: 'Make sure you have sufficient collateral enabled before borrowing',
    },
    {
      key: 'amount',
      type: 'input',
      inputType: 'text',
      label: 'Amount',
      placeholder: 'Enter amount to borrow',
      required: true,
      helpText: 'Amount to borrow. Ensure you have enough collateral.',
    },
  ],
  
  repay: [
    {
      key: 'vaultAddress',
      type: 'select',
      label: 'Vault',
      placeholder: 'Select vault to repay to',
      required: true,
      options: vaultOptions,
      helpText: 'Choose the vault where you want to repay your debt',
    },
    {
      key: 'amount',
      type: 'input',
      inputType: 'text',
      label: 'Amount',
      placeholder: 'Enter amount to repay',
      required: true,
      helpText: 'Amount to repay. Can be partial or full repayment.',
    },
  ],
  
  permissions: [
    {
      key: 'collaterals',
      type: 'select',
      label: 'Enable Collaterals',
      placeholder: 'Select vaults to enable as collateral',
      required: false,
    //   multiple: true,
      options: vaultOptions,
      helpText: 'Enable these vaults as collateral for borrowing',
      tooltip: 'Collateral allows you to borrow against your deposits',
    },
    {
      key: 'controller',
      type: 'select',
      label: 'Enable Controller',
      placeholder: 'Select vault to enable as controller',
      required: false,
      options: vaultOptions,
      helpText: 'Enable this vault as a controller for debt management',
      tooltip: 'Controllers manage your debt positions and risk parameters',
    },
  ],
  
  swap: [
    {
      key: 'tokenIn',
      type: 'select',
      label: 'Token In',
      placeholder: 'Select token to swap from',
      required: true,
      options: tokenOptions,
    },
    {
      key: 'tokenOut',
      type: 'select',
      label: 'Token Out',
      placeholder: 'Select token to swap to',
      required: true,
      options: tokenOptions,
    },
    {
      key: 'amount',
      type: 'input',
      inputType: 'text',
      label: 'Amount',
      placeholder: 'Enter amount to swap',
      required: true,
    },
    {
      key: 'slippage',
      type: 'slider',
      label: 'Slippage Tolerance',
      min: 0.1,
      max: 5.0,
      step: 0.1,
      defaultValue: 0.5,
      formatValue: (value: number) => `${value}%`,
      helpText: 'Maximum price slippage you are willing to accept',
    },
  ],
};

// Strategy configurations with real vault options
export const strategyConfigs: Record<string, FormFieldConfig[]> = {
  leverage: [
    {
      key: 'collateralAsset',
      type: 'select',
      label: 'Collateral Asset',
      placeholder: 'Select collateral asset',
      required: true,
      options: tokenOptions,
      helpText: 'Asset to use as collateral for leverage',
    },
    {
      key: 'borrowAsset',
      type: 'select',
      label: 'Borrow Asset',
      placeholder: 'Select asset to borrow',
      required: true,
      options: tokenOptions,
      helpText: 'Asset to borrow for leverage',
    },
    {
      key: 'amount',
      type: 'input',
      inputType: 'text',
      label: 'Initial Amount',
      placeholder: 'Enter initial collateral amount',
      required: true,
    },
    {
      key: 'leverageFactor',
      type: 'slider',
      label: 'Leverage Factor',
      min: 1.1,
      max: 5.0,
      step: 0.1,
      defaultValue: 2.0,
      formatValue: (value: number) => `${value}x`,
      helpText: 'Leverage multiplier (e.g., 2x means 2x exposure)',
    },
  ],
  
  'borrow-against-lp': [
    {
      key: 'collateralAsset',
      type: 'select',
      label: 'LP Token Vault',
      placeholder: 'Select LP token vault',
      required: true,
      options: vaultOptions,
      helpText: 'LP token vault to use as collateral',
    },
    {
      key: 'borrowAsset',
      type: 'select',
      label: 'Asset to Borrow',
      placeholder: 'Select asset to borrow',
      required: true,
      options: tokenOptions,
      helpText: 'Asset to borrow against your LP position',
    },
    {
      key: 'borrowAmount',
      type: 'input',
      inputType: 'text',
      label: 'Borrow Amount',
      placeholder: 'Enter amount to borrow',
      required: true,
    },
  ],
  
  'hedged-lp': [
    {
      key: 'collateralAsset',
      type: 'select',
      label: 'Asset 0',
      placeholder: 'Select first asset',
      required: true,
      options: tokenOptions,
      helpText: 'First asset for the LP pair',
    },
    {
      key: 'borrowAsset',
      type: 'select',
      label: 'Asset 1',
      placeholder: 'Select second asset',
      required: true,
      options: tokenOptions,
      helpText: 'Second asset for the LP pair (will be borrowed)',
    },
    {
      key: 'amount',
      type: 'input',
      inputType: 'text',
      label: 'Asset 0 Amount',
      placeholder: 'Enter amount of first asset',
      required: true,
    },
    {
      key: 'borrowAmount',
      type: 'input',
      inputType: 'text',
      label: 'Asset 1 Borrow Amount',
      placeholder: 'Enter amount to borrow of second asset',
      required: true,
    },
  ],
  
  'jit-liquidity': [
    {
      key: 'jitAsset',
      type: 'select',
      label: 'JIT Asset',
      placeholder: 'Select asset for JIT liquidity',
      required: true,
      options: tokenOptions,
      helpText: 'Asset to provide as just-in-time liquidity',
    },
    {
      key: 'jitAmount',
      type: 'input',
      inputType: 'text',
      label: 'JIT Amount',
      placeholder: 'Enter amount for JIT liquidity',
      required: true,
    },
    {
      key: 'jitAction',
      type: 'select',
      label: 'JIT Action',
      placeholder: 'Select JIT action',
      required: true,
      options: [
        { value: 'deploy', label: 'Deploy JIT', description: 'Deploy just-in-time liquidity' },
        { value: 'withdraw', label: 'Withdraw JIT', description: 'Withdraw JIT liquidity' },
      ],
    },
  ],
};