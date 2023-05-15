import config from 'config'
import { ogg } from './voice/ogg.js'

import { translateAI } from './AI/openai.js'

import { Telegraf } from 'telegraf' //это экземпляр моего бота
import { message } from 'telegraf/filters'
const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

// bot.on("message", (ctx) => ctx.reply(JSON.stringify(ctx.message, null, 2)))
bot.start((ctx) => {
  return ctx.reply(
    `Привет ${ctx.update.message.from.first_name}! Рад тебя видеть. Ты можешь задавать мне вопросы, просто напиши мне или отправь голосовое сообщение!`
  )
})
// bot.on("message", (ctx) => ctx.sendMessage(JSON.stringify(ctx.message, null, 2)))

bot.on(message('voice'), async (ctx) => {
  //узнаем какой пользователь прислал сообщение
  const userId = ctx.message.from.id
  //получаем ссылку на файл голосового сообщения
  const fileLinkObj  = await ctx.telegram.getFileLink(ctx.message.voice.file_id)

  try {
    //конвертируем из ogg в mp3
    const map3Path = await ogg.convert(fileLinkObj.href, userId)
    //получаем транскрипцию из аудио
    const audioText = await translateAI(map3Path)
    await ctx.sendMessage(audioText)
  } catch(error) {
    console.error(error);
    await ctx.sendMessage('Ваш запрос полностью провалился, уже исправляем это.')
  }
})

bot.launch()

const handleStopSignal = () => {
  bot.stop('Бот остановлен, сервер не работает')
}

process.once('SIGINT', handleStopSignal)
process.once('SIGTERM', handleStopSignal)
