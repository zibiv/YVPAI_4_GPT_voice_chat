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
import action from './bot/controllers/commands/actions.js'

bot.start(startController)
bot.command('new', newController)
bot.command('mode', modeController)
bot.command('changeassistant', changeAssistantController)

bot.hears('улучши текст', hearsController.betterText)
bot.hears('чаттер', hearsController.chatter)
bot.hears(['спасибо', 'Спасибо'], hearsController.chatter)
bot.hears('проверка ответа', hearsController.checkAnswer)
bot.action('озвучить сообщение', action.messageToSpeech)

bot.telegram.setMyCommands(commands)

bot.on(message('voice'), messagesController.voice)
bot.on(message('text'), messagesController.text)

bot.launch()

const handleStopSignal = () => {
  bot.stop('Бот остановлен, сервер не работает')
}

process.once('SIGINT', handleStopSignal)
process.once('SIGTERM', handleStopSignal)
