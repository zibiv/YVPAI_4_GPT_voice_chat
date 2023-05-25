import { openAIApi } from '../../../AI/openai.js'
import { ogg } from '../../../voice/ogg.js'
import { userMode } from '../../../modes/index.js'
import { createNewContext } from '../../../../data/starterMessage.js'
import { yc } from '../../../voice/ycSpeech.js'

const processAI = async (ctx, isVoiceInput) => {
  ctx.session ??= createNewContext()
  //узнаем какой пользователь прислал сообщение
  const userId = ctx.message.from.id
  let userMessage = ''
  let oggFilePath = ''
  //TODO статус был дольше и покрывал все время которое необходимо на получение ответа в чате
  await ctx.sendChatAction('typing')

  try {
    //обработка голосового сообщения или текстового для получения userMessage
    if (isVoiceInput) {
      //получаем ссылку на файл голосового сообщения
      const fileLinkObj = await ctx.telegram.getFileLink(
        ctx.message.voice.file_id
      )
      //конвертируем в mp3
      const map3Path = await ogg.convert(fileLinkObj.href, userId)
      //TODO не сохранять файл, а направлять сразу поток
      userMessage = await openAIApi.transcriptAI(map3Path)
    } else {
      userMessage = ctx.message.text
    }

    //обновление сессии запросом от пользователя
    ctx.session.messages.push({
      role: openAIApi.roles.USER,
      content: userMessage,
    })

    //получение ответа от OpenAI API
    const chatAnswer = await openAIApi.chatAI(
      ctx.session.messages.slice(userMode.contextValue)
    )

    //передача обновленного контекста в хранилище сессии, ответ от OpenAI
    ctx.session.messages.push(chatAnswer)
    console.log("Length of the context: %s messages", ctx.session.messages.length)

    const inline_keyboard = [
      [{ text: 'озвучить', callback_data: 'озвучить сообщение' }],
    ]
    
    //TODO подумать над улучшением реализации
    await ctx.sendMessage(chatAnswer.content, userMode.currentModeIdx !== 1 && {reply_markup: { remove_keyboard: true, inline_keyboard }})

    //если выбран любой режим по мимо chatter, после каждого ответа бота должна выводиться информация о режиме
    if (userMode.currentModeIdx) {
      await ctx.replyWithHTML(
        `<i style="color:blue">Действует режим ${userMode.currentMode}, жду вашего сообщения.</i>`
      )
    }
  } catch (error) {
    const errorToShow = error.response?.data ?? error
    console.error('text message handler: ', errorToShow)
    await ctx.sendMessage(
      'Ваш запрос полностью провалился, уже исправляем это.'
    )
  }
}

export default processAI
