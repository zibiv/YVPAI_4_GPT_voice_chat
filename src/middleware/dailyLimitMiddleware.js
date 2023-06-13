export async function dailyLimitMiddleware(ctx, next, { dailyLimitFlag }) {
  
  if(dailyLimitFlag) {
    await ctx.sendMessage("Вы достигли лимита на сегодня.", {reply_to_message_id: ctx.message.message_id})
    return;
  }
  next()
}