import { SQLite } from '@telegraf/session/sqlite'
import { Telegraf, session } from 'telegraf' //это экземпляр моего бота
import config from 'config'
import async from 'async';

//MiddlewareImport
import { checkDailyLimit } from '../middleware/dailyLimitMiddleware.js'
import { messageContextHandler } from './controllers/handlers/messageContextHandler.js'
import { getUser } from '../middleware/usersMiddleware.js'
import processAI from './controllers/messages/logic.js'
import { addToDB } from '../middleware/addMessageMiddleware.js'
import { globalAuth } from '../middleware/authMiddleware.js'

const botsQueue = async.queue((ctx, next) => {
  next(ctx)
}, 3)

class BotsContext {
  user = null
  userDailyMessageCount = 0

  constructor(token) {
    this.bot = new Telegraf(token)
    this.sessionStore = SQLite({
      filename: './data/telegraf-sessions.sqlite',
    })
  }

  //позволяет одновременно обрабатывать несколько сообщений
  async concurrentMessagesMiddleware(ctx, next) {
    botsQueue.push(ctx, next)
  }

  async globalAuthMiddleware(ctx, next) {
    await globalAuth(ctx, next)
  }

  async dailyLimitMWCall(ctx, next) {
    await checkDailyLimit(ctx, next)
  }

  async setUserMiddleware(ctx, next) {
    await getUser(ctx, next)
  }

  async messageTextHandler(ctx, bot = this.bot) {
    await messageContextHandler(ctx, bot)

    try {
      const { userMessage, chatAnswer } = await processAI(ctx, false)
      await addToDB(ctx, userMessage, chatAnswer)
    } catch (error) {
      const errorToShow = error
      console.error('messageTextHandler: ', errorToShow)
      await ctx.sendMessage(
        'Ваш запрос полностью провалился, уже исправляем это.'
      )
    }


  }

  async messageVoiceHandler(ctx, bot = this.bot) {
    await messageContextHandler(ctx, bot)
    await processAI(ctx, true)
  }
}

export const botsContext = new BotsContext(config.get('TELEGRAM_TOKEN'))
