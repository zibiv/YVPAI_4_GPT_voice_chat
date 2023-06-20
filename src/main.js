import { message } from 'telegraf/filters'
import { session } from 'telegraf';

import { botsContext } from './bot/bot.js';

import {
  startController,
  changeAssistantController,
  modeController,
  newController,
  commands,
} from './bot/controllers/commands/index.js'
import hearsController from './bot/controllers/commands/hears.js'
import action from './bot/controllers/commands/actions.js'


botsContext.bot.use(botsContext.concurrentMessagesMiddleware);
botsContext.bot.use(botsContext.globalAuthMiddleware);
botsContext.bot.use(botsContext.setUserMiddleware);

//использование сессий
botsContext.bot.use(session({store: botsContext.sessionStore}))

botsContext.bot.start(startController)
botsContext.bot.command('new', botsContext.dailyLimitMWCall, newController)
botsContext.bot.command('mode', modeController)
botsContext.bot.command('changeassistant', changeAssistantController)

botsContext.bot.hears('улучши текст', hearsController.betterText)
botsContext.bot.hears('чаттер', hearsController.chatter)
botsContext.bot.hears(['спасибо', 'Спасибо'], hearsController.chatter)
botsContext.bot.hears('проверка ответа', hearsController.checkAnswer)
botsContext.bot.action('озвучить сообщение', action.messageToSpeech)

botsContext.bot.telegram.setMyCommands(commands)

botsContext.bot.on(message('voice'), botsContext.dailyLimitMWCall, botsContext.messageVoiceHandler)
botsContext.bot.on(message('text'), botsContext.dailyLimitMWCall, botsContext.messageTextHandler)

botsContext.bot.launch()

const handleStopSignal = () => {
  botsContext.bot.stop('Бот остановлен, сервер не работает')
}

process.once('SIGINT', handleStopSignal)
process.once('SIGTERM', handleStopSignal)
