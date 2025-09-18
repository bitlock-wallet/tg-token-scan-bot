class ErrorHandler {
  static getSimpleMessage(error) {
    const message = error.message || error;

    // Map technical errors to simple user-friendly messages
    if (
      message.includes("Token not found on DEX") ||
      message.includes("Token not found") ||
      message.includes("not found on any supported network")
    ) {
      return "Token not found";
    }

    if (
      message.includes("Invalid token address") ||
      message.includes("invalid address")
    ) {
      return "Invalid address format";
    }

    if (
      message.includes("API error") ||
      message.includes("Network error") ||
      message.includes("timeout") ||
      message.includes("ECONNREFUSED")
    ) {
      return "Network connection error";
    }

    if (
      message.includes("rate limit") ||
      message.includes("too many requests")
    ) {
      return "Rate limit exceeded - try again later";
    }

    if (message.includes("Failed to scan token")) {
      // Extract just the core error without the wrapper
      const match = message.match(/Failed to scan token: (.+)/);
      if (match) {
        return this.getSimpleMessage(match[1]);
      }
    }

    // For any other errors, just return a generic message
    return "Something went wrong - try again";
  }
}

module.exports = { ErrorHandler };
