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
//  🙅‍♂️🤷‍♂️👉🌟⚡️💥💰⚙️🛠📈📉❇️⚠️❗️👆👇
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
        const balanceMSG = `<u>💰 <b>Баланс</b> 💰</u>
        👉 доступно =>  ${balance.USDT.free}$ 
        👉 занято      =>  ${balance.USDT.used}$ 
        👉 всего        =>  ${balance.USDT.total}$`;
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
    let posesSTR = `<u>🌟 <b>Открытые Позиции</b> 🌟</u>
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
        return "🙅‍♂️ Открытых позиций нет! 🙅‍♂️";
    }
    poses.forEach( pos => {
        console.log("Cur Pos is: ", pos)
        if (typeof pos != "undefined" && pos != {} && typeof pos.symbol != "undefined") {
            const _posStr = `
            💥 <b>${pos.symbol}</b> 💥 => ${pos.positionSide=="LONG"?" 📈 ":" 📉 "}
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
    .text("Проверить Позиции", "check_positions").row()
    // .text("Проверить Ордера", "check_orders").row()
    .text("Проверить Баланс", "check_balance").row();
// .text("...тест...", "check_info").row();
// Suggest commands in the menu
bot.api.setMyCommands([
    {
        command: "start",
        description: "Начать сначала"
    }
]);
// Handle all other messages and the /start command
const replyWithIntro = (ctx) => {
    var _a;
    const introductionMessage = `
    <b>Привет, ${(_a = ctx.from) === null || _a === void 0 ? void 0 : _a.username}!</b>
Я телеграм-бот для проверки
состояния твоего аккаунта на
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
    ctx.reply("Доступные действия:", {
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

// Все DETA-проекты базируются на Express-вебсервере!!!
const app = (0, express_1.default)();

// //******************************* */
// // При локальной РАЗРАБОТКЕ может потребоваться режим ОБЫЧНОГО бота, не через ВебХуки!
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
// Но для ПРОДАКШЕНА у нас не должно быть выбора вообще. Какой там нафиг БОТ в обычном режиме?
// Только лишь и исключительно лишь в виде вебхуков!!!

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
// Ну и в завершении DETA-проекта надо экспортировать Express-App
module.exports = app