export interface EulerVault {
    address: string;
    asset: string;
    symbol: string;
    name: string;
    totalAssets: bigint;
    totalBorrows: bigint;
    supplyAPY: number;
    borrowAPY: number;
  }
  
  export interface SwapQuote {
    tokenIn: string;
    tokenOut: string;
    amountIn: bigint;
    amountOut: bigint;
    slippage: number;
    gasEstimate: bigint;
  }
  
  export interface BatchOperation {
    target: string;
    value: bigint;
    calldata: string;
  }