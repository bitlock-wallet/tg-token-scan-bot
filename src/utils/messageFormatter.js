class MessageFormatter {
  constructor() {
    this.networkEmojis = {
      solana: "🌐",
      sol: "🌐",
      ethereum: "🔷",
      eth: "🔷",
      bsc: "🟡",
      binance: "🟡",
    };
  }

  formatTokenInfo(tokenData) {
    const {
      name,
      symbol,
      price,
      fdv,
      marketCap,
      liquidity,
      volume24h,
      priceChange24h,
      priceChange1h,
      network,
      address,
      createdAt,
      dexId,
      rank,
      honeypot,
    } = tokenData;

    const networkEmoji = this.networkEmojis[network.toLowerCase()] || "🌐";
    const age = this.formatAge(createdAt);
    const rankText = rank ? `#${rank}` : "";

    // Format price changes with appropriate emojis
    const change1h = this.formatPriceChange(priceChange1h);
    const change24h = this.formatPriceChange(priceChange24h);

    // Honeypot warning
    const honeypotWarning = honeypot?.isHoneypot
      ? "\n⚠️ <b>HONEYPOT DETECTED!</b>"
      : "";
    const honeypotInfo = this.formatHoneypotInfo(honeypot);

    let message = `<b>${name} ${symbol}</b>
${networkEmoji} ${this.capitalizeFirst(network)} @ ${
      dexId || "DEX"
    } 🔥 ${rankText}
💰 USD: $${this.formatPrice(price)}
💎 FDV: ${this.formatNumber(fdv)}
💦 Liq: ${this.formatNumber(liquidity)}
📊 Vol: ${this.formatNumber(volume24h)} ⋅ Age: ${age}
🚀 1H: ${change1h}${change24h ? ` ⋅ 24H: ${change24h}` : ""}
${honeypotWarning}
${honeypotInfo}

📊 Chart: <a href="https://dexscreener.com/${network}/${address}">DEX</a>

<code>${address}</code>

Buy ${symbol} now on Bitlock`;

    return message;
  }

  formatHoneypotInfo(honeypot) {
    if (!honeypot) return "";

    if (honeypot.isHoneypot) {
      let info = "🚨 <b>HONEYPOT WARNING!</b>\n";
      if (honeypot.honeypotReason && honeypot.honeypotReason !== "") {
        info += `⚠️ Flags: ${honeypot.honeypotReason}\n`;
      }
      if (honeypot.buyTax > 0) {
        info += `💸 Buy Tax: ${honeypot.buyTax}%\n`;
      }
      if (honeypot.sellTax > 0) {
        info += `💸 Sell Tax: ${honeypot.sellTax}%\n`;
      }
      return info;
    }

    if (honeypot.simulationSuccess) {
      let info = "";

      // Risk level indicator
      if (honeypot.risk === "low") {
        info += "✅ <b>Security: LOW RISK</b>\n";
      } else if (honeypot.risk === "medium") {
        info += "⚠️ <b>Security: MEDIUM RISK</b>\n";
      } else if (honeypot.risk === "high") {
        info += "🚨 <b>Security: HIGH RISK</b>\n";
      } else {
        info += "✅ <b>Honeypot Check: SAFE</b>\n";
      }

      // Tax information
      if (honeypot.buyTax > 0 || honeypot.sellTax > 0) {
        info += `💰 Taxes - Buy: ${honeypot.buyTax || 0}% ⋅ Sell: ${
          honeypot.sellTax || 0
        }%\n`;
      }

      // Holder analysis if available
      if (honeypot.holderAnalysis && honeypot.holderAnalysis.totalHolders > 0) {
        info += `👥 Holders: ${honeypot.holderAnalysis.totalHolders} ⋅ Failed: ${honeypot.holderAnalysis.failedHolders}\n`;
      }

      return info;
    }

    return "⚠️ Honeypot check inconclusive\n";
  }

  formatPriceChange(change) {
    if (change === null || change === undefined) return "N/A";

    const emoji = change >= 0 ? "📈" : "📉";
    const sign = change >= 0 ? "+" : "";
    return `${emoji} ${sign}${change.toFixed(1)}%`;
  }

  formatPrice(price) {
    if (!price) return "0.00";

    if (price < 0.0001) {
      // For very small numbers, use fixed decimal places to avoid scientific notation
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 6,
        maximumFractionDigits: 15,
        useGrouping: false,
      }).format(price);
    }

    if (price < 1) {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
        useGrouping: false,
      }).format(price);
    }

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
      useGrouping: true,
    }).format(price);
  }

  formatNumber(num, decimals = 1) {
    if (num === null || num === undefined || num === 0) return "N/A";

    if (num >= 1e9) {
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num / 1e9);
      return `$${formatted}B`;
    }
    if (num >= 1e6) {
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num / 1e6);
      return `$${formatted}M`;
    }
    if (num >= 1e3) {
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num / 1e3);
      return `$${formatted}K`;
    }

    if (num < 1) {
      return `$${new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }).format(num)}`;
    }

    return `$${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num)}`;
  }

  formatAge(createdAt) {
    if (!createdAt) return "Unknown";

    const now = Date.now();
    const created = new Date(createdAt).getTime();
    const diffMs = now - created;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) return `${weeks}w`;
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Format for different message types
  formatError(error) {
    return `❌ <b>Error:</b> ${error}`;
  }

  formatLoading() {
    return "🔍 <b>Scanning token...</b>\nPlease wait while we fetch the latest data...";
  }

  formatNotFound(network, address) {
    return `❌ <b>Token not found</b>\n\nNetwork: ${this.capitalizeFirst(
      network
    )}\nAddress: <code>${address}</code>\n\nThe token might not be listed on DEX platforms yet.`;
  }

  // Create inline keyboard with Bitlock wallet button
  getBitlockKeyboard(tokenSymbol = "") {
    return {
      inline_keyboard: [
        [
          {
            text: `🚀 Buy ${tokenSymbol} on Bitlock`,
            url: `https://t.me/bitlockwallet_bot?startapp=${tokenSymbol}`,
          },
        ],
      ],
    };
  }
}

module.exports = { MessageFormatter };
