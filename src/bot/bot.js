import { SQLite } from '@telegraf/session/sqlite'
import { Telegraf, session } from 'telegraf' //это экземпляр моего бота
import config from 'config'

//MiddlewareImport
import { dailyLimitMiddleware } from '../middleware/dailyLimitMiddleware.js'
import { messageContextHandler } from './controllers/handlers/messgeContextHandler.js'
import processAI from './controllers/messages/logic.js'

const store = SQLite({
  filename: './data/telegraf-sessions.sqlite',
})

export const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))
bot.use(
  session({
    store,
  })
)

class BotsContext {
  user = null
  userDailyMessageCount = 0

  constructor(token) {
    this.bot = new Telegraf(token)
  }

  async dailyLimitMWCall(ctx, next) {
    await dailyLimitMiddleware(ctx, next)
  }

  async messageTextHandler(ctx, bot = this.bot) {
    await messageContextHandler(ctx, bot)
    await processAI(ctx, false)
  }

  async messageVoiceHandler(ctx, bot = this.bot) {
    await messageContextHandler(ctx, bot)
    await processAI(ctx, true)
  }
}

export const botsContext = new BotsContext(config.get('TELEGRAM_TOKEN'))
