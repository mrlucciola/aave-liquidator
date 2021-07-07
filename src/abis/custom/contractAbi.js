export const address = '0x85Ddada2E76Db3B0A89073743422B220584c35D4';

export const abi = [
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback",
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "users",
        "type": "address[]",
      },
      {
        "name": "tokens",
        "type": "address",
      },
    ],
    "name": "healthFactors",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "user",
        "type": "address",
      },
      {
        "name": "token",
        "type": "address",
      },
    ],
    "name": "tokenHealth",
    "outputs": [
      {
        "name": "totalCollateralETH",
        "type": "uint256",
      },
      {
        "name": "totalDebtETH",
        "type": "uint256",
      },
      {
        "name": "availableBorrowsETH",
        "type": "uint256",
      },
      {
        "name": "currentLiquidationThreshold",
        "type": "uint256",
      },
      {
        "name": "ltv",
        "type": "uint256",
      },
      {
        "name": "healthFactor",
        "type": "uint256",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
];
