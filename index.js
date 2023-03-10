//************************************************** */
'use strict';
require('dotenv').config();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const ccxt = require ('ccxt');
const ccxt_1 = __importDefault(require("ccxt"));
const grammy_1 = require("grammy");
const express_1 = __importDefault(require("express"));
const TOKEN = process.env.TELEGRAM_TOKEN || "";
const KEY = process.env.API_KEY || "";
const SECRET = process.env.API_SECRET || "";
const NODE_ENV = process.env.NODE_ENV || "dev";
const binance = new ccxt_1.default.binanceusdm({
    apiKey: KEY,
    secret: SECRET
});
//=====================================
//  πββοΈπ€·ββοΈππβ‘οΈπ₯π°βοΈπ ππβοΈβ οΈβοΈππ
//=====================================

const getBalance = async () => {
    console.log("NODE_ENV: " + NODE_ENV);
    console.log("Checking Binance Balance...");
    // console.log("***********************");
    // console.log("API_KEY: " + KEY);
    // console.log("CCXT Binance API_KEY: " + binance.apiKey);
    // console.log("API_SECRET:" + SECRET);
    // console.log("CCXT Binance API_SECRET:" + binance.secret);
    // console.log("***********************");
    try {
        const balance = await binance.fetchBalance();
        console.log("Balance: ", balance.USDT);
        const balanceMSG = `<u>π° <b>ΠΠ°Π»Π°Π½Ρ</b> π°</u>
        π Π΄ΠΎΡΡΡΠΏΠ½ΠΎ =>  ${balance.USDT.free}$ 
        π Π·Π°Π½ΡΡΠΎ      =>  ${balance.USDT.used}$ 
        π Π²ΡΠ΅Π³ΠΎ        =>  ${balance.USDT.total}$`;
        return balanceMSG;
    }
    catch (error) {
        console.log("Error:", error);
    }
};
const getOrders = async () => {
    console.log("NODE_ENV: " + NODE_ENV);
    console.log("Checking Binance Orders...");
    // console.log("***********************");
    // console.log("API_KEY: " + KEY);
    // console.log("CCXT Binance API_KEY: " + binance.apiKey);
    // console.log("API_SECRET:" + SECRET);
    // console.log("CCXT Binance API_SECRET:" + binance.secret);
    // console.log("***********************");
    try {
        const orders = await binance.fetchOrders();
        console.log("Orders: ", orders);
        return orders;
    }
    catch (error) {
        console.log("Error:", error);
    }
};
const getPositions = async () => {
    console.log("NODE_ENV: " + NODE_ENV);
    console.log("Checking Binance Positions...");
    // console.log("***********************");
    // console.log("API_KEY: " + KEY);
    // console.log("CCXT Binance API_KEY: " + binance.apiKey);
    // console.log("API_SECRET:" + SECRET);
    // console.log("CCXT Binance API_SECRET:" + binance.secret);
    // console.log("***********************");
    const poses = [{}];
    let posesSTR = `<u>π <b>ΠΡΠΊΡΡΡΡΠ΅ ΠΠΎΠ·ΠΈΡΠΈΠΈ</b> π</u>
    `;
    try {
        const positions = await binance.fetchPositions();
        positions.forEach(function (pos) {
            if (pos.contracts > 0) {
                // console.log ("Positions: ", pos.contracts, pos.info);
                poses.push(pos.info);
            }
        });
        // console.log ("Open Positions: ", poses);
        // return poses;
    }
    catch (error) {
        console.log("Error:", error);
    }
    if (poses.length == 1) {
        return "πββοΈ ΠΡΠΊΡΡΡΡΡ ΠΏΠΎΠ·ΠΈΡΠΈΠΉ Π½Π΅Ρ! πββοΈ";
    }
    poses.forEach( pos => {
        console.log("Cur Pos is: ", pos)
        if (typeof pos != "undefined" && pos != {} && typeof pos.symbol != "undefined") {
            const _posStr = `
            π₯ <b>${pos.symbol}</b> π₯ => ${pos.positionSide=="LONG"?" π ":" π "}
                => PnL: ${pos.unRealizedProfit}$
                => Size: ${Math.abs(pos.positionAmt)}
                => avgPrice: ${pos.entryPrice}$
            `;
            posesSTR = posesSTR + _posStr;
        }
    });

    return posesSTR;
};
// Create a bot using the Telegram token
const bot = new grammy_1.Bot(TOKEN);
// Handle the /yo command to greet the user
bot.command("yo", (ctx) => { var _a; return ctx.reply(`Yo ${(_a = ctx.from) === null || _a === void 0 ? void 0 : _a.username}`); });
// Handle the /about command
const buttonsKeyboard = new grammy_1.InlineKeyboard()
    .text("ΠΡΠΎΠ²Π΅ΡΠΈΡΡ ΠΠΎΠ·ΠΈΡΠΈΠΈ", "check_positions").row()
    // .text("ΠΡΠΎΠ²Π΅ΡΠΈΡΡ ΠΡΠ΄Π΅ΡΠ°", "check_orders").row()
    .text("ΠΡΠΎΠ²Π΅ΡΠΈΡΡ ΠΠ°Π»Π°Π½Ρ", "check_balance").row();
// .text("...ΡΠ΅ΡΡ...", "check_info").row();
// Suggest commands in the menu
bot.api.setMyCommands([
    {
        command: "start",
        description: "ΠΠ°ΡΠ°ΡΡ ΡΠ½Π°ΡΠ°Π»Π°"
    }
]);
// Handle all other messages and the /start command
const replyWithIntro = (ctx) => {
    var _a;
    const introductionMessage = `
    <b>ΠΡΠΈΠ²Π΅Ρ, ${(_a = ctx.from) === null || _a === void 0 ? void 0 : _a.username}!</b>
Π― ΡΠ΅Π»Π΅Π³ΡΠ°ΠΌ-Π±ΠΎΡ Π΄Π»Ρ ΠΏΡΠΎΠ²Π΅ΡΠΊΠΈ
ΡΠΎΡΡΠΎΡΠ½ΠΈΡ ΡΠ²ΠΎΠ΅Π³ΠΎ Π°ΠΊΠΊΠ°ΡΠ½ΡΠ° Π½Π°
    <u><b>Binance USDT-Futures!</b></u>
    `;
    ctx.reply(introductionMessage, {
        reply_markup: buttonsKeyboard,
        parse_mode: "HTML",
    });
    console.log("Bot have got START-command!");
    // console.log("***********************");
    // console.log("API_KEY: " + KEY);
    // console.log("CCXT Binance API_KEY: " + binance.apiKey);
    // console.log("API_SECRET:" + SECRET);
    // console.log("CCXT Binance API_SECRET:" + binance.secret);
    // console.log("***********************");
};
const replyWithButtons = (ctx) => {
    ctx.reply("ΠΠΎΡΡΡΠΏΠ½ΡΠ΅ Π΄Π΅ΠΉΡΡΠ²ΠΈΡ:", {
        reply_markup: buttonsKeyboard,
        parse_mode: "HTML",
    });
    console.log("Telegram Bot is working...");
    console.log("***********************");
    console.log("API_KEY: " + KEY);
    console.log("CCXT Binance API_KEY: " + binance.apiKey);
    console.log("API_SECRET:" + SECRET);
    console.log("CCXT Binance API_SECRET:" + binance.secret);
    console.log("***********************");
};
bot.command("start", replyWithIntro);
// bot.on("message", replyWithIntro);
bot.on("message", replyWithButtons);
// Wait for click events with specific callback data.
bot.callbackQuery("check_positions", async (ctx) => {
    const info = await getPositions();
    ctx.reply(info, {
        parse_mode: "HTML",
    });
});
bot.callbackQuery("check_balance", async (ctx) => {
    const info = await getBalance();
    ctx.reply(info, {
        parse_mode: "HTML",
    });
});

// ΠΡΠ΅ DETA-ΠΏΡΠΎΠ΅ΠΊΡΡ Π±Π°Π·ΠΈΡΡΡΡΡΡ Π½Π° Express-Π²Π΅Π±ΡΠ΅ΡΠ²Π΅ΡΠ΅!!!
const app = (0, express_1.default)();

// //******************************* */
// // ΠΡΠΈ Π»ΠΎΠΊΠ°Π»ΡΠ½ΠΎΠΉ Π ΠΠΠ ΠΠΠΠ’ΠΠ ΠΌΠΎΠΆΠ΅Ρ ΠΏΠΎΡΡΠ΅Π±ΠΎΠ²Π°ΡΡΡΡ ΡΠ΅ΠΆΠΈΠΌ ΠΠΠ«Π§ΠΠΠΠ Π±ΠΎΡΠ°, Π½Π΅ ΡΠ΅ΡΠ΅Π· ΠΠ΅Π±Π₯ΡΠΊΠΈ!
// //******************************* */
// // Start the server
// if (process.env.NODE_ENV === "production") {
//     // Use Webhooks for the production server
//     const app = (0, express_1.default)();
//     app.use(express_1.default.json());
//     app.use((0, grammy_1.webhookCallback)(bot, "express"));
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//         console.log(`Bot listening on port ${PORT}`);
//         console.log("***********************");
//         console.log("API_KEY: " + KEY);
//         console.log("CCXT Binance API_KEY: " + binance.apiKey);
//         console.log("API_SECRET:" + SECRET);
//         console.log("CCXT Binance API_SECRET:" + binance.secret);
//         console.log("***********************");
//     });
// }
// else {
//     // Use Long Polling for development
//     bot.start();
// }
// //************************************ */

//******************************* */
// ΠΠΎ Π΄Π»Ρ ΠΠ ΠΠΠΠΠ¨ΠΠΠ Ρ Π½Π°Ρ Π½Π΅ Π΄ΠΎΠ»ΠΆΠ½ΠΎ Π±ΡΡΡ Π²ΡΠ±ΠΎΡΠ° Π²ΠΎΠΎΠ±ΡΠ΅. ΠΠ°ΠΊΠΎΠΉ ΡΠ°ΠΌ Π½Π°ΡΠΈΠ³ ΠΠΠ’ Π² ΠΎΠ±ΡΡΠ½ΠΎΠΌ ΡΠ΅ΠΆΠΈΠΌΠ΅?
// Π’ΠΎΠ»ΡΠΊΠΎ Π»ΠΈΡΡ ΠΈ ΠΈΡΠΊΠ»ΡΡΠΈΡΠ΅Π»ΡΠ½ΠΎ Π»ΠΈΡΡ Π² Π²ΠΈΠ΄Π΅ Π²Π΅Π±ΡΡΠΊΠΎΠ²!!!

// Start the server
// Use Webhooks for the production server
app.use(express_1.default.json());
app.use((0, grammy_1.webhookCallback)(bot, "express"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
    console.log("***********************");
    console.log("NODE_ENV: " + NODE_ENV);
    console.log("API_KEY: " + KEY);
    console.log("CCXT Binance API_KEY: " + binance.apiKey);
    console.log("API_SECRET:" + SECRET);
    console.log("CCXT Binance API_SECRET:" + binance.secret);
    console.log("***********************");
});
//******************************* */




//*************************************************************** */
// ΠΡ ΠΈ Π² Π·Π°Π²Π΅ΡΡΠ΅Π½ΠΈΠΈ DETA-ΠΏΡΠΎΠ΅ΠΊΡΠ° Π½Π°Π΄ΠΎ ΡΠΊΡΠΏΠΎΡΡΠΈΡΠΎΠ²Π°ΡΡ Express-App
module.exports = app