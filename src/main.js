import config from 'config'

import { Telegraf } from 'telegraf' //это экземпляр моего бота
import { message } from 'telegraf/filters'
// import { getFileLink } from 'telegraf/telegram'

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

bot.on(message('voice'), (ctx) => ctx.reply(JSON.stringify(ctx.message.voice, null, 2)))
bot.start((ctx) => ctx.reply(JSON.stringify(ctx.message, null, 2)))

bot.launch()

const handleStopSignal = () => {
  bot.stop('Бот остановлен, сервер не работает')
}

process.once('SIGINT', handleStopSignal)
process.once('SIGTERM', handleStopSignal)
