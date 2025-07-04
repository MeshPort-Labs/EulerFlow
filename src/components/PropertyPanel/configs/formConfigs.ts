import { DEVLAND_ADDRESSES } from '../../../lib/euler/addresses';
import type { 
    CoreActionNodeData, 
    LpToolkitNodeData, 
    StrategyNodeData, 
    AlertNodeData,
    NodeData 
} from '../../../types/nodes';

export interface FormFieldConfig {
    key: string;
    type: 'input' | 'select' | 'textarea' | 'slider' | 'switch';
    label: string;
    placeholder?: string;
    required?: boolean;
    helpText?: string;
    tooltip?: string;
    validation?: (value: any) => { isValid: boolean; message?: string };
    
    // Input-specific options
    inputType?: 'text' | 'number' | 'email' | 'password' | 'url';
    min?: number;
    max?: number;
    step?: number;
    maxLength?: number;
    copyable?: boolean;
    externalLink?: string;
    
    // Select-specific options
    options?: Array<{ value: string; label: string; disabled?: boolean; badge?: string; description?: string }>;
    optionGroups?: Array<{ label: string; options: Array<{ value: string; label: string; disabled?: boolean }> }>;
    emptyMessage?: string;
    
    // Textarea-specific options
    rows?: number;
    
    // Slider-specific options
    formatValue?: (value: any) => string;
    showInput?: boolean;
    presets?: Array<{ label: string; value: number }>;
    defaultValue?: number;
    marks?: Array<{ value: number; label: string }>;
    
    // Switch-specific options
    description?: string;
    
    // Conditional rendering
    showIf?: (data: NodeData) => boolean;
}

// Create vault options from your devland addresses
export const vaultOptions = Object.entries(DEVLAND_ADDRESSES.vaults).map(([symbol, address]) => ({
    value: symbol,
    label: `${symbol} Vault`,
    description: `${symbol} lending vault on devland`,
    address: address,
    badge: symbol === 'USDC' || symbol === 'USDT' || symbol === 'DAI' || symbol === 'USDZ' ? 'Stable' : 
           symbol === 'wstETH' ? 'LST' : 'Native'
}));

export const tokenOptions = Object.keys(DEVLAND_ADDRESSES.vaults).map(symbol => ({
    value: symbol,
    label: symbol,
    description: `${symbol} Token`
}));

// Core Action configurations
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
            placeholder: 'Enter amount or percentage (e.g., 1000 or 50%)',
            required: true,
            helpText: 'Amount to supply. Use percentage for dynamic amounts.',
            tooltip: 'You can enter absolute amounts or percentages of your balance',
            validation: (value: string) => {
                if (!value) return { isValid: false, message: 'Amount is required' };
                if (value.includes('%')) {
                    const percentage = parseFloat(value.replace('%', ''));
                    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
                        return { isValid: false, message: 'Percentage must be between 0-100%' };
                    }
                } else {
                    const amount = parseFloat(value);
                    if (isNaN(amount) || amount <= 0) {
                        return { isValid: false, message: 'Amount must be greater than 0' };
                    }
                }
                return { isValid: true };
            },
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
            tooltip: 'Select the vault you want to withdraw assets from',
        },
        {
            key: 'amount',
            type: 'input',
            inputType: 'text',
            label: 'Amount',
            placeholder: 'Enter amount, percentage, or "max"',
            required: true,
            helpText: 'Amount to withdraw. Use "max" to withdraw all available.',
            tooltip: 'You can withdraw specific amounts, percentages, or your entire balance',
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
            tooltip: 'Select the vault containing the asset you want to borrow',
        },
        {
            key: 'amount',
            type: 'input',
            inputType: 'text',
            label: 'Amount',
            placeholder: 'Enter amount to borrow',
            required: true,
            helpText: 'Ensure you have sufficient collateral before borrowing.',
            tooltip: 'The amount you can borrow depends on your collateral and the vault\'s LTV ratio',
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
            tooltip: 'Select the vault where you have outstanding debt',
        },
        {
            key: 'amount',
            type: 'input',
            inputType: 'text',
            label: 'Amount',
            placeholder: 'Enter amount to repay or "max"',
            required: true,
            helpText: 'Use "max" to repay all outstanding debt.',
            tooltip: 'Repaying debt reduces your borrow balance and frees up collateral',
        },
    ],
    
    swap: [
        {
            key: 'tokenIn',
            type: 'select',
            label: 'From Token',
            placeholder: 'Select input token',
            required: true,
            options: tokenOptions,
            tooltip: 'The token you want to sell/exchange',
        },
        {
            key: 'tokenOut',
            type: 'select',
            label: 'To Token',
            placeholder: 'Select output token',
            required: true,
            options: tokenOptions,
            tooltip: 'The token you want to receive',
        },
        {
            key: 'amount',
            type: 'input',
            inputType: 'text',
            label: 'Amount',
            placeholder: 'Enter amount to swap',
            required: true,
            tooltip: 'Amount of input token to swap',
        },
        {
            key: 'slippage',
            type: 'slider',
            label: 'Slippage Tolerance',
            min: 0.1,
            max: 5.0,
            step: 0.1,
            defaultValue: 0.5,
            formatValue: (val: number) => `${val}%`,
            helpText: 'Maximum price movement tolerance',
            tooltip: 'Higher slippage tolerance increases the chance of execution but may result in worse prices',
            presets: [
                { label: '0.1%', value: 0.1 },
                { label: '0.5%', value: 0.5 },
                { label: '1%', value: 1.0 },
                { label: '3%', value: 3.0 },
            ],
        },
    ],
    
    permissions: [
        {
            key: 'controller',
            type: 'select',
            label: 'Controller Vault',
            placeholder: 'Select controller vault',
            options: vaultOptions,
            helpText: 'Vault that can borrow against your collateral',
            tooltip: 'A controller vault can create debt positions using your enabled collaterals',
        },
    ],
};

// Strategy configurations
export const strategyConfigs: Record<string, FormFieldConfig[]> = {
    leverage: [
        {
            key: 'collateralAsset',
            type: 'select',
            label: 'Collateral Asset (Long)',
            placeholder: 'Select asset to long',
            required: true,
            options: tokenOptions,
            helpText: 'Asset you want to have leveraged exposure to',
            tooltip: 'This is the asset you\'ll hold more of after the leverage operation',
        },
        {
            key: 'borrowAsset',
            type: 'select',
            label: 'Borrow Asset',
            placeholder: 'Select asset to borrow',
            required: true,
            options: tokenOptions,
            helpText: 'Asset to borrow and swap for more collateral',
            tooltip: 'This asset will be borrowed and immediately swapped for the collateral asset',
        },
        {
            key: 'leverageFactor',
            type: 'slider',
            label: 'Leverage Factor',
            min: 1.1,
            max: 10,
            step: 0.1,
            defaultValue: 2.0,
            formatValue: (val: number) => `${val}x`,
            helpText: 'Higher leverage = higher risk and potential returns',
            tooltip: 'Leverage multiplies both your potential gains and losses',
            presets: [
                { label: '2x', value: 2.0 },
                { label: '3x', value: 3.0 },
                { label: '5x', value: 5.0 },
                { label: '10x', value: 10.0 },
            ],
            marks: [
                { value: 2, label: '2x' },
                { value: 5, label: '5x' },
                { value: 10, label: '10x' },
            ],
        },
    ],
    
    'borrow-against-lp': [
        {
            key: 'borrowAsset',
            type: 'select',
            label: 'Borrow Asset',
            placeholder: 'Select asset to borrow',
            required: true,
            options: tokenOptions,
            tooltip: 'Asset to borrow using your LP position as collateral',
        },
        {
            key: 'borrowAmount',
            type: 'input',
            inputType: 'text',
            label: 'Borrow Amount',
            placeholder: 'Enter amount to borrow',
            required: true,
            helpText: 'LP position will be used as collateral',
            tooltip: 'Your LP shares will be used as collateral for this loan',
        },
    ],
    
    'hedged-lp': [
        {
            key: 'collateralAsset',
            type: 'select',
            label: 'Supply Asset',
            placeholder: 'Select asset to supply',
            required: true,
            options: tokenOptions,
            tooltip: 'Asset to deposit as collateral',
        },
        {
            key: 'borrowAsset',
            type: 'select',
            label: 'Borrow Asset',
            placeholder: 'Select asset to borrow',
            required: true,
            options: tokenOptions,
            helpText: 'Creates a delta-neutral position',
            tooltip: 'Borrowing this asset creates a hedge against price movements',
        },
    ],
    
    'jit-liquidity': [
        {
            key: 'jitAsset',
            type: 'select',
            label: 'JIT Asset',
            placeholder: 'Select asset for JIT provision',
            required: true,
            options: tokenOptions,
            tooltip: 'Asset to provide as just-in-time liquidity',
        },
        {
            key: 'jitAmount',
            type: 'input',
            inputType: 'text',
            label: 'JIT Amount',
            placeholder: 'Enter amount for JIT',
            required: true,
            tooltip: 'Amount of asset to provide as JIT liquidity',
        },
        {
            key: 'jitAction',
            type: 'select',
            label: 'JIT Action',
            placeholder: 'Select JIT action',
            required: true,
            options: [
                { value: 'deploy', label: 'Deploy JIT Liquidity', description: 'Provide temporary liquidity' },
                { value: 'withdraw', label: 'Withdraw JIT Liquidity', description: 'Remove temporary liquidity' },
            ],
            tooltip: 'Choose whether to deploy or withdraw JIT liquidity',
        },
    ],
};

// LP Toolkit configurations
export const lpToolkitConfigs: Record<string, FormFieldConfig[]> = {
    'create-pool': [
        {
            key: 'vault0',
            type: 'select',
            label: 'First Vault',
            placeholder: 'Select first vault',
            required: true,
            options: vaultOptions,
            tooltip: 'First vault for the trading pair',
        },
        {
            key: 'vault1',
            type: 'select',
            label: 'Second Vault',
            placeholder: 'Select second vault',
            required: true,
            options: vaultOptions,
            tooltip: 'Second vault for the trading pair',
        },
        {
            key: 'fee',
            type: 'input',
            inputType: 'text',
            label: 'Fee (%)',
            placeholder: '0.3',
            required: true,
            helpText: 'Trading fee percentage for the pool',
            tooltip: 'Fee charged on each trade, distributed to liquidity providers',
        },
    ],
    
    'add-liquidity': [
        {
            key: 'amount0',
            type: 'input',
            inputType: 'text',
            label: 'Amount 0',
            placeholder: 'Enter amount for first token',
            required: true,
            tooltip: 'Amount of the first token to add as liquidity',
        },
        {
            key: 'amount1',
            type: 'input',
            inputType: 'text',
            label: 'Amount 1',
            placeholder: 'Enter amount for second token',
            required: true,
            tooltip: 'Amount of the second token to add as liquidity',
        },
    ],
    
    'remove-liquidity': [
        {
            key: 'amount0',
            type: 'input',
            inputType: 'text',
            label: 'Amount 0',
            placeholder: 'Enter amount to remove',
            required: true,
            tooltip: 'Amount of the first token to remove from liquidity',
        },
        {
            key: 'amount1',
            type: 'input',
            inputType: 'text',
            label: 'Amount 1',
            placeholder: 'Enter amount to remove',
            required: true,
            tooltip: 'Amount of the second token to remove from liquidity',
        },
    ],
};

// Alert configurations
export const alertConfigs: Record<string, FormFieldConfig[]> = {
    telegram: [
        {
            key: 'botToken',
            type: 'input',
            inputType: 'password',
            label: 'Bot Token',
            placeholder: 'Enter your Telegram bot token',
            required: true,
            helpText: 'Get from @BotFather on Telegram',
            tooltip: 'Create a bot via @BotFather and copy the token here',
            copyable: true,
        },
        {
            key: 'chatId',
            type: 'input',
            inputType: 'text',
            label: 'Chat ID',
            placeholder: 'Enter chat ID or @username',
            required: true,
            helpText: 'Use @userinfobot to get your chat ID',
            tooltip: 'Your personal chat ID or a group chat ID where you want to receive alerts',
        },
        {
            key: 'message',
            type: 'textarea',
            label: 'Message Template',
            placeholder: 'Enter your alert message...',
            required: true,
            helpText: 'Use variables: {status}, {amount}, {asset}, {error}',
            tooltip: 'Customize your alert message with dynamic variables',
            rows: 3,
            maxLength: 500,
        },
        {
            key: 'triggerCondition',
            type: 'select',
            label: 'Trigger Condition',
            options: [
                { value: 'success', label: 'On Success', description: 'Send alert when operation succeeds' },
                { value: 'failure', label: 'On Failure', description: 'Send alert when operation fails' },
                { value: 'always', label: 'Always', description: 'Send alert regardless of outcome' },
            ],
            tooltip: 'When should this alert be triggered?',
        },
    ],
    
    discord: [
        {
            key: 'webhookUrl',
            type: 'input',
            inputType: 'url',
            label: 'Webhook URL',
            placeholder: 'Enter Discord webhook URL',
            required: true,
            helpText: 'Create webhook in Discord server settings',
            tooltip: 'Go to your Discord server settings > Integrations > Webhooks to create one',
            copyable: true,
        },
        {
            key: 'message',
            type: 'textarea',
            label: 'Message Template',
            placeholder: 'Enter your alert message...',
            required: true,
            helpText: 'Use variables: {status}, {amount}, {asset}, {error}',
            tooltip: 'Customize your alert message with dynamic variables',
            rows: 3,
            maxLength: 2000,
        },
        {
            key: 'triggerCondition',
            type: 'select',
            label: 'Trigger Condition',
            options: [
                { value: 'success', label: 'On Success', description: 'Send alert when operation succeeds' },
                { value: 'failure', label: 'On Failure', description: 'Send alert when operation fails' },
                { value: 'always', label: 'Always', description: 'Send alert regardless of outcome' },
            ],
            tooltip: 'When should this alert be triggered?',
        },
    ],
};