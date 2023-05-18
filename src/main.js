import config from 'config'
import { ogg } from './voice/ogg.js'
import { openAIApi } from './AI/openai.js'

import { Telegraf, session } from 'telegraf' //это экземпляр моего бота
import { message } from 'telegraf/filters'
import { SQLite } from '@telegraf/session/sqlite'

import { createNewContext } from "../data/starterMessage.js"

const store = SQLite({
  filename: './data/telegraf-sessions.sqlite',
})
const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))
bot.use(session({
  store,
}))

// bot.on("message", (ctx) => ctx.reply(JSON.stringify(ctx.message, null, 2)))
bot.start((ctx) => {
  ctx.session ??= createNewContext()
  
  return ctx.reply(
    //TODO форматировать сообщение
    `Привет ${ctx.update.message.from.first_name}! Рад тебя видеть. 
    Ты можешь задавать мне вопросы, просто напиши мне или отправь голосовое сообщение!
    Если хочешь что бы наш разговор был забыт и начался с чистого листа, напиши команду /new`
  )
})

bot.command('new', async (ctx) => {
  ctx.session = createNewContext()
  await ctx.reply('Начинаю новый диалог, жду вашего голосового сообщения или текста.')
})

bot.on(message('voice'), async (ctx) => {
  ctx.session ??= createNewContext()
  //узнаем какой пользователь прислал сообщение
  const userId = ctx.message.from.id
  //получаем ссылку на файл голосового сообщения
  const fileLinkObj = await ctx.telegram.getFileLink(ctx.message.voice.file_id)

  try {
    await ctx.sendChatAction('typing')
    const map3Path = await ogg.convert(fileLinkObj.href, userId)
    //TODO не сохранять файл, а направлять сразу поток
    const audioText = await openAIApi.transcriptAI(map3Path)

    ctx.session.messages.push({ role: openAIApi.roles.USER, content: audioText })
    const chatAnswer = await openAIApi.chatAI(ctx.session.messages.slice(-5))
    //TODO давать ответ в том числе голосом
    //передача обновленного контекста в хранилище сессии
    ctx.session.messages.push(chatAnswer)
    console.log(ctx.session.messages.slice(-3))
    console.log(ctx.session.messages.length)

    await ctx.sendMessage(chatAnswer.content)
  } catch (error) {
    const errorToShow = error.response?.data ?? error
    console.error("text message handler: ", errorToShow)
    await ctx.sendMessage(
      'Ваш запрос полностью провалился, уже исправляем это.'
    )
  }
})
//TODO два обработчика повторяются почти полностью, надо изменить
bot.on(message('text'), async (ctx) => {

  ctx.session ??= createNewContext()
  const userId = ctx.message.from.id
  const userMessage = ctx.message.text

  try {
    //TODO статус был дольше и покрывал все время которое необходимо на получение ответа в чате
    await ctx.sendChatAction('typing')

    ctx.session.messages.push({ role: openAIApi.roles.USER, content: userMessage })
    const chatAnswer = await openAIApi.chatAI(ctx.session.messages.slice(-5))
    ctx.session.messages.push(chatAnswer)
    console.log(ctx.session.messages.slice(-3))
    console.log(ctx.session.messages.length)

    await ctx.sendMessage(chatAnswer.content)
  } catch (error) {
    const errorToShow = error.response?.data ?? error
    console.error("text message handler: ", errorToShow)
    await ctx.sendMessage(
      'Ваш запрос полностью провалился, уже исправляем это.'
    )
  }
})

bot.launch()

const handleStopSignal = () => {
  bot.stop('Бот остановлен, сервер не работает')
}

process.once('SIGINT', handleStopSignal)
process.once('SIGTERM', handleStopSignal)