const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

const { TokenScanner } = require("./services/tokenScanner");
const { MessageFormatter } = require("./utils/messageFormatter");
const { AddressDetector } = require("./utils/addressDetector");
const { ErrorHandler } = require("./utils/errorHandler");

class TelegramTokenBot {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true,
    });
    this.tokenScanner = new TokenScanner();
    this.formatter = new MessageFormatter();
    this.addressDetector = new AddressDetector();

    this.setupCommands();
    this.setupStartAndHelpCommands();
    this.setupCallbacks();
    this.setupErrorHandling();
  }

  setupCommands() {
    // /scan command handler with auto-detection (single argument)
    this.bot.onText(/\/scan ([a-zA-Z0-9]{25,})$/, async (msg, match) => {
      const chatId = msg.chat.id;
      const tokenAddress = match[1];

      await this.handleScanCommand(chatId, null, tokenAddress, true, msg);
    });

    // /scan command handler with manual network (two arguments)
    this.bot.onText(
      /\/scan ([a-zA-Z]+) ([a-zA-Z0-9]{25,})/,
      async (msg, match) => {
        const chatId = msg.chat.id;
        const network = match[1].toLowerCase();
        const tokenAddress = match[2];

        await this.handleScanCommand(chatId, network, tokenAddress, false, msg);
      }
    );
  }

  async handleScanCommand(
    chatId,
    network,
    tokenAddress,
    autoDetect = false,
    msg = null
  ) {
    let scanningMessage = null;

    try {
      // Validate address format first
      if (!this.addressDetector.isValidAddress(tokenAddress)) {
        await this.bot.sendMessage(chatId, `❌ Invalid address format`, {
          parse_mode: "HTML",
          reply_to_message_id: msg?.message_id,
        });
        return;
      }

      // Send initial scanning message
      const scanMessage = autoDetect
        ? "🔍 Auto-detecting network and scanning token... Please wait..."
        : "🔍 Scanning token... Please wait...";

      scanningMessage = await this.bot.sendMessage(chatId, scanMessage, {
        reply_to_message_id: msg?.message_id,
      });

      let finalNetwork = network;
      let tokenData = null;
      let lastError = null;

      if (autoDetect) {
        // Try to detect and scan on multiple networks
        const networksToTry = await this.addressDetector.detectBestNetwork(
          tokenAddress
        );

        for (const tryNetwork of networksToTry) {
          try {
            console.log(`Trying network: ${tryNetwork}`);
            tokenData = await this.tokenScanner.scanToken(
              tryNetwork,
              tokenAddress
            );
            finalNetwork = tryNetwork;
            break; // Success, exit loop
          } catch (error) {
            console.log(`Failed on ${tryNetwork}: ${error.message}`);
            lastError = error;
            continue; // Try next network
          }
        }

        if (!tokenData) {
          throw new Error("Token not found on any supported network");
        }
      } else {
        // Manual network specified
        tokenData = await this.tokenScanner.scanToken(network, tokenAddress);
      }

      const formattedMessage = this.formatter.formatTokenInfo(tokenData);

      // Delete the scanning message
      if (scanningMessage) {
        await this.bot.deleteMessage(chatId, scanningMessage.message_id);
      }

      // Send the results with inline keyboard
      const keyboard = this.formatter.getBitlockKeyboard(tokenData.symbol);
      await this.bot.sendMessage(chatId, formattedMessage, {
        parse_mode: "HTML",
        reply_markup: keyboard,
        disable_web_page_preview: true,
        reply_to_message_id: msg?.message_id,
      });
    } catch (error) {
      console.error("Error scanning token:", error);

      // Delete the scanning message on error too
      if (scanningMessage) {
        try {
          await this.bot.deleteMessage(chatId, scanningMessage.message_id);
        } catch (deleteError) {
          console.warn(
            "Could not delete scanning message:",
            deleteError.message
          );
        }
      }

      const simpleError = ErrorHandler.getSimpleMessage(error);
      await this.bot.sendMessage(chatId, `❌ ${simpleError}`, {
        reply_to_message_id: msg?.message_id,
      });
    }
  }

  setupStartAndHelpCommands() {
    // Start command
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const welcomeMessage = `
🤖 <b>Token Scanner Bot</b>

Welcome! Use this bot to scan tokens across different networks.

<b>Commands:</b>
/scan [token_address] - Auto-detect network and scan token
/scan [network] [token_address] - Scan token on specific network
/help - Show this help message

<b>Supported Networks:</b>
• solana (or sol)
• ethereum (or eth)
• bsc (or binance)
• polygon (or matic)
• arbitrum (or arb)
• base

<b>Examples:</b>
<code>/scan GMQm2g8gHnEMyjXDn91N2BvNw3cgQjKwvNdbFe3spump</code> (auto-detect)
<code>/scan solana GMQm2g8gHnEMyjXDn91N2BvNw3cgQjKwvNdbFe3spump</code> (manual)
            `;

      this.bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: "HTML",
        reply_to_message_id: msg.message_id,
      });
    });

    // Help command
    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      const helpMessage = `
🤖 <b>Token Scanner Bot Help</b>

<b>Commands:</b>
/scan [token_address] - Auto-detect network and scan token
/scan [network] [token_address] - Scan token on specific network
/start - Show welcome message
/help - Show this help message

<b>Supported Networks:</b>
• solana (or sol)
• ethereum (or eth)
• bsc (or binance)
• polygon (or matic)
• arbitrum (or arb)
• base

<b>Examples:</b>
<code>/scan GMQm2g8gHnEMyjXDn91N2BvNw3cgQjKwvNdbFe3spump</code> (auto-detect)
<code>/scan solana GMQm2g8gHnEMyjXDn91N2BvNw3cgQjKwvNdbFe3spump</code> (manual)

<b>Features:</b>
• Real-time token data
• Honeypot detection
• Price and volume analysis
• Market cap and FDV
• Age and holder information
            `;

      this.bot.sendMessage(chatId, helpMessage, {
        parse_mode: "HTML",
        reply_to_message_id: msg.message_id,
      });
    });
  }

  setupCallbacks() {
    // Handle callback queries from inline keyboards
    this.bot.on("callback_query", async (callbackQuery) => {
      const message = callbackQuery.message;
      const data = callbackQuery.data;
      const chatId = message.chat.id;

      try {
        if (data === "dexscreener") {
          // Extract token address from the message
          const messageText = message.text;
          const addressMatch = messageText.match(/([a-zA-Z0-9]{25,})/);

          if (addressMatch) {
            const address = addressMatch[0];
            const dexUrl = `https://dexscreener.com/search?q=${address}`;

            await this.bot.answerCallbackQuery(callbackQuery.id, {
              text: "Opening DEXScreener...",
              url: dexUrl,
            });
          } else {
            await this.bot.answerCallbackQuery(callbackQuery.id, {
              text: "Could not extract token address",
            });
          }
        }
      } catch (error) {
        console.error("Callback query error:", error);
        await this.bot.answerCallbackQuery(callbackQuery.id, {
          text: "Error processing request",
        });
      }
    });
  }

  setupErrorHandling() {
    this.bot.on("polling_error", (error) => {
      console.error("Polling error:", error);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });
  }

  start() {
    console.log("🚀 Telegram Token Scanner Bot started!");
    console.log("Bot is running and listening for commands...");
  }
}

// Start the bot
const bot = new TelegramTokenBot();
bot.start();
