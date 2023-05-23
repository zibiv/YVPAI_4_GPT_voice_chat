const email = async (ctx) => {
  ctx.reply('Режим ответа на письма пока не поддерживается', {
    reply_markup: { remove_keyboard: true },
  })
}

const betterText = async (ctx) => {
  ctx.reply('Режим улучшения текста пока не поддерживается', {
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
  ctx.reply('Выбери эксперта для работы', {
    reply_markup: { remove_keyboard: true, inline_keyboard },
  })
}

const hears = { email, betterText, assistant }

export default hears
