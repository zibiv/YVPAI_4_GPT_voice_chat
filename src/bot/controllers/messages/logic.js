import { openAIApi } from '../../../AI/openai.js'
import { ogg } from '../../../voice/ogg.js'
import { userMode } from '../../../modes/index.js'
import { createNewContext } from '../../../../data/starterMessage.js'

const processAI = async (ctx, isVoiceInput) => {
  try {
    ctx.session ??= createNewContext()
    let userMessage = ''
    //TODO статус был дольше и покрывал все время которое необходимо на получение ответа в чате
    await ctx.sendChatAction('typing')
    
    //обработка голосового сообщения или текстового для получения userMessage
    if (isVoiceInput) {
      //узнаем какой пользователь прислал сообщение
      const userId = ctx.message.from.id
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

    ctx.session.messages.push({
      role: openAIApi.roles.USER,
      content: userMessage,
    })

    const chatAnswer = await openAIApi.chatAI(
      ctx.session.messages.slice(userMode.contextValue)
    )
    //TODO давать ответ в том числе голосом
    //передача обновленного контекста в хранилище сессии
    ctx.session.messages.push(chatAnswer)
    console.log(ctx.session.messages.length)

    await ctx.sendMessage(chatAnswer.content)
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
