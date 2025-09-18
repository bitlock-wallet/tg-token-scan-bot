# Telegram Token Scanner Bot

A powerful Telegram bot that automatically scans cryptocurrency tokens across multiple blockchain networks and provides comprehensive analysis including price data, market metrics, liquidity information, and security checks.

## 🤖 Live Bot

Try the live version: [@bitlockscannerbot](https://t.me/bitlockscannerbot)

Simply add the bot to your chat and start scanning tokens - no setup required!

## Features

- 🧠 **Smart Auto-Detection**: Automatically detects the best network for token scanning
- 🔍 **Multi-Network Support**: Scan tokens on Solana, Ethereum, BSC, Polygon, Arbitrum, and Base
- 💰 **Comprehensive Data**: Price, FDV, market cap, liquidity, volume, and price changes (1h & 24h)
- 🍯 **Honeypot Detection**: Integration with honeypot.is API for security analysis
- 📊 **Real-time Data**: Fetches latest data from DEXScreener API
- ⚡ **Smart Caching**: 5-minute cache for improved performance and reduced API calls
- 🎨 **Rich Formatting**: Beautiful message formatting with emojis and inline keyboards
- 📈 **Market Analysis**: Token ranking, age tracking, and holder information
- 🔗 **Direct Integration**: Quick access to DEXScreener charts and Bitlock trading

## Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd tg-token-scan-bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp env.example .env
   ```

4. **Configure your bot**

   - Get a bot token from [@BotFather](https://t.me/BotFather) on Telegram
   - Add your bot token to `.env`
   - Optionally add RPC URLs for better performance

5. **Start the bot**

   ```bash
   npm start
   ```

   For development:

   ```bash
   npm run dev
   ```

## Usage

### Commands

- `/start` - Get welcome message and instructions
- `/help` - Show detailed help information
- `/scan [token_address]` - **Auto-detect network** and scan token (recommended)
- `/scan [network] [token_address]` - Scan token on specific network

### Supported Networks

- `solana` or `sol` - Solana network
- `ethereum` or `eth` - Ethereum network
- `bsc` or `binance` - Binance Smart Chain
- `polygon` or `matic` - Polygon network
- `arbitrum` or `arb` - Arbitrum network
- `base` - Base network

### Usage Examples

**Auto-detection (Recommended):**

```
/scan pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn
```

**Manual network specification:**

```
/scan solana pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn
/scan ethereum 0xa0b86a33e6ba11e5db5aa23e44a4b6f7f3d4c5e6
/scan bsc 0x1234567890abcdef1234567890abcdef12345678
```

## Sample Output

```
Pump PUMP
🌐 Solana @ pumpswap 🔥
💰 USD: $0.008005
💎 FDV: $8.0B
💦 Liq: $25.8M
📊 Vol: $6.9M ⋅ Age: 9w
🚀 1H: 📉 -0.6% ⋅ 24H: 📈 +0.0%

✅ Honeypot Check: SAFE


📊 Chart: DEX

pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn

Buy PUMP now on Bitlock
```

## Environment Variables

```env
# Required
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Optional RPC URLs (for better performance and reliability)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your_key_here
BSC_RPC_URL=https://bsc-dataseed.binance.org
POLYGON_RPC_URL=https://polygon-rpc.com
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
BASE_RPC_URL=https://base-rpc.publicnode.com

# Optional API Keys
HELIUS_API_KEY=your_helius_api_key_here

# API Endpoints (usually don't need to change)
DEXSCREENER_API_URL=https://api.dexscreener.com
HONEYPOT_API_URL=https://api.honeypot.is
```

## API Integrations

- **DEXScreener API**: For real-time token price, volume, and market data
- **Honeypot.is API**: For honeypot detection and security analysis
- **Multiple RPC endpoints**: For direct blockchain data access and validation
- **Auto-fallback system**: Switches between networks automatically for best results

## Security Features

- ✅ **Honeypot Detection**: Identifies potentially malicious tokens
- ✅ **Tax Analysis**: Shows buy/sell tax information where available
- ✅ **Simulation Testing**: Verifies transaction success rates
- ✅ **Address Validation**: Validates token address formats before scanning
- ✅ **Network Auto-detection**: Prevents scanning on wrong networks
- ✅ **Security Warnings**: Clear alerts for suspicious or dangerous tokens

## Architecture

The bot is built with a modular architecture:

- **`bot.js`**: Main bot logic and command handling
- **`tokenScanner.js`**: Token data fetching and analysis
- **`messageFormatter.js`**: Message formatting and display logic
- **`addressDetector.js`**: Address validation and network detection
- **`networks.js`**: Network configuration and mappings

## Performance & Caching

- **Smart Caching**: 5-minute cache prevents redundant API calls
- **Concurrent Requests**: Parallel API calls for faster response times
- **Error Handling**: Graceful fallbacks and retry mechanisms
- **Memory Efficient**: Automatic cache cleanup and memory management

## Troubleshooting

### Common Issues

1. **Bot not responding**: Check if `TELEGRAM_BOT_TOKEN` is valid
2. **Token not found**: Try using manual network specification
3. **Rate limiting**: The bot includes built-in rate limiting and caching
4. **Network errors**: Configure custom RPC URLs for better reliability

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions:

- Open an issue on GitHub
- Check the troubleshooting section above
- Review the code documentation in `/src` directory

## Disclaimer

This bot is for informational purposes only. Always conduct your own research before making any investment decisions. The developers are not responsible for any financial losses. Cryptocurrency investments carry inherent risks.
