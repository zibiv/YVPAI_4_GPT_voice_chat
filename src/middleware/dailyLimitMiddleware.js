import { dailyLimits } from "../config/dailyLimits.js";

export async function checkDailyLimit(ctx, next) {
  const { userFromDB } = ctx
  const {  userDailyMessageCount } = userFromDB
  console.log("daily middleware - user: ", userFromDB)
  let dailyLimitFlag =  false;

  switch(userFromDB.subscriptionType) {
    case "BASIC":
      if(userDailyMessageCount >= dailyLimits.BASIC) {
        console.log("Day limit: BASIC")
        dailyLimitFlag = true
      }
      break;
    case "PREMIUM":
      if(userDailyMessageCount >= dailyLimits.PREMIUM) {
        console.log("Day limit: PREMIUM")
        dailyLimitFlag = true
      }
      break;
    default:
      dailyLimitFlag = false
  }
  
  if(dailyLimitFlag) {
    await ctx.sendMessage("Вы достигли лимита на сегодня. Ждем вас завтра!", {reply_to_message_id: ctx.message.message_id})
    return;
  }
  await next()
}