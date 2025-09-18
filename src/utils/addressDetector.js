class AddressDetector {
  constructor() {
    // Address patterns for different networks
    this.patterns = {
      ethereum: /^0x[a-fA-F0-9]{40}$/,
      bsc: /^0x[a-fA-F0-9]{40}$/,
      polygon: /^0x[a-fA-F0-9]{40}$/,
      arbitrum: /^0x[a-fA-F0-9]{40}$/,
      base: /^0x[a-fA-F0-9]{40}$/,
      solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    };
  }

  detectNetwork(address) {
    // Solana addresses are base58 encoded and typically 32-44 characters
    if (this.patterns.solana.test(address)) {
      return "solana";
    }

    // EVM chains all use the same address format (0x + 40 hex chars)
    if (this.patterns.ethereum.test(address)) {
      // For EVM chains, we need additional logic to determine which specific chain
      // We'll default to ethereum but could enhance this with chain-specific detection
      return "ethereum";
    }

    return null;
  }

  // Enhanced detection that tries to determine specific EVM chain
  async detectNetworkAdvanced(address) {
    const basicNetwork = this.detectNetwork(address);

    if (basicNetwork === "solana") {
      return "solana";
    }

    if (basicNetwork === "ethereum") {
      // For now, we'll return ethereum as default for EVM addresses
      // Could be enhanced to check multiple chains via API calls
      return "ethereum";
    }

    return null;
  }

  // Try multiple networks for EVM addresses
  async detectBestNetwork(address) {
    const basicNetwork = this.detectNetwork(address);

    if (basicNetwork === "solana") {
      return ["solana"];
    }

    if (basicNetwork === "ethereum") {
      // Return multiple EVM networks to try in order of popularity
      return ["ethereum", "bsc", "base", "polygon", "arbitrum"];
    }

    return [];
  }

  isValidAddress(address) {
    return this.detectNetwork(address) !== null;
  }

  getAddressType(address) {
    if (this.patterns.solana.test(address)) {
      return {
        type: "solana",
        format: "Base58",
        length: address.length,
        isValid: true,
      };
    }

    if (this.patterns.ethereum.test(address)) {
      return {
        type: "evm",
        format: "Hexadecimal",
        length: address.length,
        isValid: true,
      };
    }

    return {
      type: "unknown",
      format: "Unknown",
      length: address.length,
      isValid: false,
    };
  }
}

module.exports = { AddressDetector };
