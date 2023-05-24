import { createNewContext } from '../../../../data/starterMessage.js'

export const commands = [
  { command: 'start', description: 'запустить бота' },
  { command: 'new', description: 'очистить контекст беседы' },
  { command: 'mode', description: 'выбрать режим работы' },
]

export const startController = (ctx) => {
  ctx.session ??= createNewContext()

  return ctx.replyWithMarkdownV2(
    `*Привет ${ctx.update.message.from.first_name}\\!* Рад тебя видеть\\. 
Сейчас я работаю в режиме *\\"чаттер\\"* в котором мы можем общаться на любые темы\\.
Ты можешь задавать мне вопросы, просто напиши мне или отправь *голосовое* сообщение\\!

Если хочешь, чтобы наш разговор был *забыт и начался с чистого листа*, напиши команду /new
Для выбора *режима работы* /mode`
  )
}

export const newController = async (ctx) => {
  ctx.session = createNewContext()
  await ctx.reply(
    'Начинаю новый диалог, жду вашего голосового сообщения или текста.'
  )
}

export const modeController = async (ctx) => {
  const modesButtons = {
    keyboard: [
      ['чаттер'],
      ['проверка ответа'],
      ['улучши текст']
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  }
  await ctx.reply('Выбери режим работы:', { reply_markup: modesButtons })
}

export const changeAssistantController = async (ctx) => {
  const assistanceButtons = {
    keyboard: [['эксперт веб разработки', 'эксперт компьютерной безопасности']],
    resize_keyboard: true,
    one_time_keyboard: true,
  }
  await ctx.reply('Выбери нового ассистента:', {
    reply_markup: assistanceButtons,
  })
}
