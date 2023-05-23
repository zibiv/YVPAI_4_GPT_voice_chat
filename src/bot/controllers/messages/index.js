import { createNewContext } from '../../../../data/starterMessage.js'
import { ogg } from '../../../voice/ogg.js'
import { openAIApi } from '../../../AI/openai.js'

//TODO два обработчика повторяются почти полностью, надо изменить
const voice = async (ctx) => {
  ctx.session ??= createNewContext()
  //узнаем какой пользователь прислал сообщение
  const userId = ctx.message.from.id
  //получаем ссылку на файл голосового сообщения
  const fileLinkObj = await ctx.telegram.getFileLink(ctx.message.voice.file_id)

  try {
    await ctx.sendChatAction('typing')
    const map3Path = await ogg.convert(fileLinkObj.href, userId)
    //TODO не сохранять файл, а направлять сразу поток
    const audioText = await openAIApi.transcriptAI(map3Path)

    ctx.session.messages.push({
      role: openAIApi.roles.USER,
      content: audioText,
    })
    const chatAnswer = await openAIApi.chatAI(ctx.session.messages.slice(-5))
    //TODO давать ответ в том числе голосом
    //передача обновленного контекста в хранилище сессии
    ctx.session.messages.push(chatAnswer)
    console.log(ctx.session.messages.slice(-3))
    console.log(ctx.session.messages.length)

    await ctx.sendMessage(chatAnswer.content)
  } catch (error) {
    const errorToShow = error.response?.data ?? error
    console.error('text message handler: ', errorToShow)
    await ctx.sendMessage(
      'Ваш запрос полностью провалился, уже исправляем это.'
    )
  }
}

const text = async (ctx) => {
  ctx.session ??= createNewContext()
  const userId = ctx.message.from.id
  const userMessage = ctx.message.text

  try {
    //TODO статус был дольше и покрывал все время которое необходимо на получение ответа в чате
    await ctx.sendChatAction('typing')

    ctx.session.messages.push({
      role: openAIApi.roles.USER,
      content: userMessage,
    })
    const chatAnswer = await openAIApi.chatAI(ctx.session.messages.slice(-5))
    ctx.session.messages.push(chatAnswer)
    console.log(ctx.session.messages.slice(-3))
    console.log(ctx.session.messages.length)

    await ctx.sendMessage(chatAnswer.content)
  } catch (error) {
    const errorToShow = error.response?.data ?? error
    console.error('text message handler: ', errorToShow)
    await ctx.sendMessage(
      'Ваш запрос полностью провалился, уже исправляем это.'
    )
  }
}

const messages = {
  voice,
  text,
}

export default messages
