import { message } from 'telegraf/filters'
import async from 'async';

import { bot } from './bot/index.js'
import { botsContext } from './bot/bot.js';

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

import { prisma } from '../prisma/prismaClient.js';

import config from 'config'
import { dailyLimitMiddleware } from './middleware/dailyLimitMiddleware.js'
import { messageContextHandler } from './bot/controllers/handlers/messgeContextHandler.js';

let user
let botInfo


const botsQueue = async.queue((ctx, next) => {
  next(ctx)
}, 3)

const asyncMiddleware = () => {
  return (ctx, next) => {
    botsQueue.push(ctx, next)
  }
}

bot.use(asyncMiddleware());



bot.use(async (ctx, next) => {
  console.log(`\n\n${new Date().toISOString()} - new update from telegram`)
  console.log(
    '👩‍💻 USER:',
    ctx.from?.username ?? ctx.from?.first_name ?? ctx.from?.id ?? '🤖'
  )
  console.time('====>Update' + ctx.from?.id)

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
    console.time('====>> AUTH' + ctx.from?.id)

    user = await prisma.telegramUser.findUnique({
      where: {
        id: ctx.from.id,
      },
    })

    console.timeLog('====>> AUTH' + ctx.from?.id, 'search ended')
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
      console.timeLog('====>> AUTH' + ctx.from?.id, 'User created')
    }

    //считаем кол-во сообщений за сегодня у данного пользователя
    user.userDailyMessageCount = await prisma.message.count({
      where: {
        fromUserId: user.id,
        createdAt: {
          gte: matchDate,
        },
      },
    })

    console.timeEnd('====>> AUTH' + ctx.from?.id)
    console.log("Sub plan: " , user.subscriptionType)
    console.log("Messages today: ", user.userDailyMessageCount)

  } catch (error) {
    console.log("Error in checking limits: ", error)
    await bot.telegram.sendMessage("560620244", error.message + "with user " + JSON.stringify(ctx.from, null, 2))
    await ctx.reply("У нас ошибка, мы уже в курсе и исправляем ее. Повторите попытку позже.", {reply_to_message_id: ctx.message?.message_id})
  }

  console.timeEnd('====>Update' + ctx.from?.id)
  ctx.userFromDB = user;
  await next()
})

bot.on(message("sticker"), botsContext.dailyLimitMWCall, (ctx) => messageContextHandler(ctx, bot))

bot.start(startController)
bot.command('new', botsContext.dailyLimitMWCall, newController)
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

bot.on(message('voice'), botsContext.dailyLimitMWCall, messagesController.voice)
bot.on(message('text'), botsContext.dailyLimitMWCall, messagesController.text)

bot.launch()

const handleStopSignal = () => {
  bot.stop('Бот остановлен, сервер не работает')
}

process.once('SIGINT', handleStopSignal)
process.once('SIGTERM', handleStopSignal)
