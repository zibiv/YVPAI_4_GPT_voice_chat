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

import config from 'config'
import middleware from './middleware/index.js'

const dailyLimits = {
  BASIC: 1000,
  PREMIUM: 50,
  UNLIMITED: "UNLIMITED"
}

bot.use(async (ctx, next) => {
  console.log(`\n\n${new Date().toISOString()} - new update from telegram`)
  console.log(
    "👩‍💻 USER:",
    ctx.from?.username ?? ctx.from?.first_name ?? ctx.from?.id ?? "🤖"
  )
  console.log("====Update")
   
  if(config.get("NODE_ENV") === "development" && !ctx.update?.callback_query) {
    if(config.get("ADMIN") !== ctx.message.from.id) {
      console.log('🙅 not authorized user!')
      console.log(
        "🖋 Context: ", 
        ctx.message
      )
      return
    }
  } 

  try {
    const botInfo = await bot.telegram.getMe();

  } catch (error) {
    
  }

  await next()
})
bot.use(middleware.responseTime)

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

bot.on(message('voice'), (ctx, next) => middleware.dailyLimits(ctx, next, dailyLimits), messagesController.voice)
bot.on(message('text'), (ctx, next) => middleware.dailyLimits(ctx, next, dailyLimits), messagesController.text)

bot.launch()

const handleStopSignal = () => {
  bot.stop('Бот остановлен, сервер не работает')
}

process.once('SIGINT', handleStopSignal)
process.once('SIGTERM', handleStopSignal)
