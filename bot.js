const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '7706567571:AAFaBwlLSWcNVgpnGoPhNoe0PF3WS0u19rM';
const openWeatherMapAPIKey = '37568eb0ec0b31128909d678e6f268ee';

const bot = new TelegramBot(token, {polling: true});
bot.on('polling_error', console.log);
bot.on('webhook_error', console.error);
const translate = {
  "а": "a",
  "б": "b",
  "в": "v",
  "г": "g",
  "д": "d",
  "е": "e",
  "ё": "yo",
  "ж": "j",
  "з": "z",
  "и": "i",
  "й": "y",
  "к": "k",
  "л": "l",
  "м": "m",
  "н": "n",
  "о": "o",
  "п": "p",
  "р": "r",
  "с": "s",
  "т": "t",
  "у": "u",
  "ф": "f",
  "х": "h",
  "ц": "c",
  "ч": "ch",
  "ш": "sh",
  "щ": 'sch',
  "ъ": "",
  "ы": "y",
  "ь": "",
  "э": "a",
  "ю": "yu",
  "я": "ya",
  " ": " ",
  "-": "-"
}

function translating(str) {
  let word = "";
  for (let i = 0; i < str.length; i++) {
    word += translate[str[i]];
  }
  return word;
}

bot.onText(/\/start/, async(msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Добро пожаловать! Введите Ваш город');
  await bot.onText(/^[?!,.а-яА-ЯёЁ0-9\s\-]+$/, async (msg, match) => {
    console.log(`msg: ${msg}`);
    console.log(`match: ${match[0]}`);
    const newChatId = msg.chat.id;
    const city = translating(match[0]);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherMapAPIKey}`;
      console.log(url);
      const response = await axios.get(url);
      const weatherData = response.data;
      const temperature = weatherData.main.temp - 273;
      bot.sendMessage(newChatId, `Спасибо! Температура: ${temperature.toFixed(1)}°C`);
      
    } catch (error) {
        bot.sendMessage(newChatId, "Введите существующий город");
    }
});
}
)
