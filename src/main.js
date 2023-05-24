import { message } from 'telegraf/filters'

import { bot } from './bot/index.js'
import {
  startController,
  changeAssistantController,
  modeController,
  newController,
  commands,
} from './bot/controllers/commands/index.js'
import messagesController from './bot/controllers/messages/index.js'
import hearsController from './bot/controllers/commands/hears.js'

bot.start(startController)
bot.command('new', newController)
bot.command('mode', modeController)
bot.command('changeassistant', changeAssistantController)

bot.hears('улучши текст', hearsController.betterText)
bot.hears('чаттер', hearsController.chatter)
bot.hears('спасибо', hearsController.chatter)
bot.hears('проверка ответа', hearsController.checkAnswer)
bot.action('эксперт веб разработки', (ctx) => {
  ctx.answerCbQuery('You clicked the button эксперт веб разработки!')
  ctx.editMessageReplyMarkup({ inline_keyboard: [] })
})

bot.telegram.setMyCommands(commands)

bot.on(message('voice'), messagesController.voice)
bot.on(message('text'), messagesController.text)

bot.launch()

const handleStopSignal = () => {
  bot.stop('Бот остановлен, сервер не работает')
}

process.once('SIGINT', handleStopSignal)
process.once('SIGTERM', handleStopSignal)
