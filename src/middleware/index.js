const responseTime = async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log('Response time: %sms', ms)
}

const dailyLimits = async (ctx, next, dailyLimits) => {
  const userId = ctx.from.id
  const userSessionData = ctx.session[userId] || { messagesSent: 0 }
  console.log(userSessionData.messagesSent > dailyLimits.BASIC )
  console.log(userSessionData.messagesSent, dailyLimits.BASIC )
  if (userSessionData.messagesSent > dailyLimits.BASIC) {
    return await ctx.sendMessage(`Извините, но вы превысили ограничение по кол-ву сообщений в день (${dailyLimits.BASIC}) на этот час. Будем ждать вас в следующем часе!`)
  }

  userSessionData.messagesSent += 1
  ctx.session[userId] = userSessionData

  await next()
}
export default {
  responseTime, 
  dailyLimits
}