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

import { PrismaClient } from '@prisma/client'

import config from 'config'
import middleware from './middleware/index.js'
import { dailyLimitMiddleware } from './middleware/dailyLimitMiddleware.js'
import { dailyLimits } from './config/dailyLimits.js'

let user
let botInfo
let userDailyMessageCount
let dailyLimitFlag = false
const prisma = new PrismaClient()
// bot.use(middleware.responseTime)

bot.use(async (ctx, next) => {
  console.log(`\n\n${new Date().toISOString()} - new update from telegram`)
  console.log(
    '👩‍💻 USER:',
    ctx.from?.username ?? ctx.from?.first_name ?? ctx.from?.id ?? '🤖'
  )
  console.time('====>Update')

  if (config.get('NODE_ENV') === 'development' && !ctx.update?.callback_query) {
    if (!config.get('ADMIN').includes(ctx.message.from.id)) {
      console.log('🙅 not authorized user!')
      console.log('🖋 Context: ', ctx.message)
      return
    }
  }

  try {
    botInfo = await bot.telegram.getMe()

    const matchDate = new Date(new Date().setUTCHours(0, 0, 0, 0))//должен быть формат DateTime но время должно быть на начало дня 
    console.log('match Date', matchDate)
    console.time('====>> AUTH')

    user = await prisma.telegramUser.findUnique({
      where: {
        id: ctx.from.id,
      },
    })

    console.timeLog('====>> AUTH', 'search ended')
    if (!user) {
      console.log('User not found. Creating...')
      user = await prisma.telegramUser.create({
        data: {
          id: ctx.from?.id,
          username: ctx.from?.username || '',
          firstName: ctx.from?.first_name,
        },
      })
      console.log(user)
      console.timeLog('====>> AUTH', 'User created')
    }

    //считаем кол-во сообщений за сегодня у данного пользователя
    userDailyMessageCount = await prisma.message.count({
      where: {
        fromUserId: user.id,
        createdAt: {
          gte: matchDate,
        },
      },
    })

    console.timeEnd('====>> AUTH')
    console.log("Sub plan: " , user.subscriptionType)
    console.log("Messages today: ", userDailyMessageCount)

    switch(user.subscriptionType) {
      case "BASIC":
        if(userDailyMessageCount >= dailyLimits.BASIC) {
          console.log("Day limit: BASIC")
          dailyLimitFlag = true
        }
        break;
      case "PREMIUM":
        if(userDailyMessageCount >= dailyLimits.PREMIUM) {
          console.log("Day limit: PREMIUM")
          dailyLimitFlag = true
        }
        break;
      default:
        dailyLimitFlag = false
    }
  } catch (error) {
    console.log("Error in checking limits: ", error)
    await bot.telegram.sendMessage("560620244", error.message + "with user " + JSON.stringify(ctx.from, null, 2))
    await ctx.reply("У нас ошибка, мы уже в курсе и исправляем ее. Повторите попытку позже.", {reply_to_message_id: ctx.message?.message_id})
  }

  console.timeEnd('====>Update')
  await next()
})
bot.use((ctx, next) =>
  dailyLimitMiddleware(ctx, next, { dailyLimitFlag: false })
)

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

// bot.on(message('video'), async (ctx) => {
//   ctx.from.
// })

bot.on(message('voice'), messagesController.voice)
bot.on(message('text'), messagesController.text)

bot.launch()

const handleStopSignal = () => {
  bot.stop('Бот остановлен, сервер не работает')
}

process.once('SIGINT', handleStopSignal)
process.once('SIGTERM', handleStopSignal)
