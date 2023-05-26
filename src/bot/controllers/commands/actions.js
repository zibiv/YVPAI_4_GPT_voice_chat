import { yc } from '../../../voice/ycSpeech.js'

const messageToSpeech = async (ctx) => {
  try {
    await ctx.answerCbQuery('озвучиваю')
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] })

    const messageToSpeech = ctx.update.callback_query.message.text
    const voiceAnswer = await yc.textToSpeech(messageToSpeech)
    await ctx.replyWithVoice(
      { source: voiceAnswer },
      { disable_notification: true }
    )
  } catch (error) {
    console.error('❌ action ', error)
    await ctx.sendMessage(
      'Ваш запрос на озвучку полностью провалился, уже исправляем это.'
    )
  }
}

const action = {
  messageToSpeech,
}

export default action
