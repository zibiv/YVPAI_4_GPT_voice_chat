import { yc } from "../../../voice/ycSpeech.js"

const messageToSpeech = async (ctx) => {
  await ctx.answerCbQuery('озвучиваю')
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] })
  

  const messageToSpeech = ctx.update.callback_query.message.text
  const voiceAnswer = await yc.textToSpeech(messageToSpeech)
  await ctx.replyWithVoice({ source: voiceAnswer } , {disable_notification: true})
  
}

const action = {
  messageToSpeech
}

export default action