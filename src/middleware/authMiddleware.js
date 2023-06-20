import config from 'config'

export async function globalAuth(ctx, next) {
  //каждое новое сообщение должно проходить дальше только от авторизованных юзеров для бота разработки
  console.log(`\n\n${new Date().toISOString()} - new update from telegram`)
  console.log(
    '👩‍💻 USER:',
    ctx.from?.username ?? ctx.from?.first_name ?? ctx.from?.id ?? '🤖'
  )

  console.time('====>GlobalAuth ' + ctx.from?.id)
  if (config.get('NODE_ENV') === 'development' && !ctx.update?.callback_query) {
    if (!config.get('ADMIN').includes(ctx.message.from.id)) {
      console.log('🙅 not authorized user!')
      console.log('🖋 Context: ', ctx.message)
      return
    }
  }
  console.timeEnd('====>GlobalAuth ' + ctx.from?.id)
  await next()
}