import { SQLite } from '@telegraf/session/sqlite'
import { Telegraf, session } from 'telegraf' //это экземпляр моего бота
import config from 'config'

const store = SQLite({
  filename: './data/telegraf-sessions.sqlite',
})

export const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))
bot.use(
  session({
    store,
  })
)
