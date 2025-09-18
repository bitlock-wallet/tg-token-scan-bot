const networks = {
  solana: {
    name: "Solana",
    chainId: "solana",
    aliases: ["sol", "solana"],
    rpcUrl: process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
    dexscreenerChain: "solana",
    honeypotSupported: false,
    explorer: "https://solscan.io/token/",
  },
  ethereum: {
    name: "Ethereum",
    chainId: 1,
    aliases: ["eth", "ethereum"],
    rpcUrl: process.env.ETHEREUM_RPC_URL,
    dexscreenerChain: "ethereum",
    honeypotSupported: true,
    honeypotChainId: 1,
    explorer: "https://etherscan.io/token/",
  },
  bsc: {
    name: "Binance Smart Chain",
    chainId: 56,
    aliases: ["bsc", "binance", "bnb"],
    rpcUrl: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org",
    dexscreenerChain: "bsc",
    honeypotSupported: true,
    honeypotChainId: 56,
    explorer: "https://bscscan.com/token/",
  },
  polygon: {
    name: "Polygon",
    chainId: 137,
    aliases: ["polygon", "matic", "poly"],
    rpcUrl: process.env.POLYGON_RPC_URL,
    dexscreenerChain: "polygon",
    honeypotSupported: true,
    honeypotChainId: 137,
    explorer: "https://polygonscan.com/token/",
  },
  arbitrum: {
    name: "Arbitrum",
    chainId: 42161,
    aliases: ["arbitrum", "arb"],
    rpcUrl: process.env.ARBITRUM_RPC_URL,
    dexscreenerChain: "arbitrum",
    honeypotSupported: true,
    honeypotChainId: 42161,
    explorer: "https://arbiscan.io/token/",
  },
  base: {
    name: "Base",
    chainId: 8453,
    aliases: ["base"],
    rpcUrl: process.env.BASE_RPC_URL || "https://base-rpc.publicnode.com",
    dexscreenerChain: "base",
    honeypotSupported: true,
    honeypotChainId: 8453,
    explorer: "https://basescan.org/token/",
  },
};

function getNetworkByAlias(alias) {
  for (const [key, network] of Object.entries(networks)) {
    if (network.aliases.includes(alias.toLowerCase())) {
      return { key, ...network };
    }
  }
  return null;
}

function getSupportedNetworksList() {
  return Object.entries(networks).map(([key, network]) => ({
    key,
    name: network.name,
    aliases: network.aliases,
  }));
}

module.exports = {
  networks,
  getNetworkByAlias,
  getSupportedNetworksList,
};
