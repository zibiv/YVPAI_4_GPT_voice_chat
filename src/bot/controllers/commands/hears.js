import { userMode } from "../../../modes/index.js"
import { createNewContext } from "../../../../data/starterMessage.js"

const email = async (ctx) => {
  ctx.reply('Режим пока не поддерживается.', {
    reply_markup: { remove_keyboard: true },
  })
}

const betterText = async (ctx) => {
  userMode.setMode('betterText')
  ctx.session = createNewContext()
  ctx.reply('Включаю режим улучшения текста, жду вашего сообщения содержащего текст для улучшения, исправления орфографии.', {
    reply_markup: { remove_keyboard: true },
  })
}

const assistant = async (ctx) => {
  const inline_keyboard = [
    [
      { text: 'web dev', callback_data: 'эксперт веб разработки' },
      { text: 'dev ops', callback_data: 'эксперт dev ops' },
      { text: 'secure', callback_data: 'эксперт компьютерной безопасности' },
    ],
  ]
  ctx.reply('Выбери эксперта для работы:', {
    reply_markup: { remove_keyboard: true, inline_keyboard },
  })
}

const chatter = async (ctx) => {
  userMode.setMode('chatter')
  ctx.session = createNewContext()
  ctx.reply('Включаю режим чаттер, в котором мы общаемся на различные темы, жду ваше аудио сообщение или текст.', {
    reply_markup: { remove_keyboard: true },
  })
}

const hears = { email, betterText, assistant, chatter }

export default hears
