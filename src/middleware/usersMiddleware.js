import { prisma } from '../../prisma/prismaClient.js'

export async function getUser(ctx, next) {
  console.time('====>> AUTH' + ctx.from?.id)
  
  const user = await  prisma.telegramUser.upsert({
    where: {
      id: ctx.from.id,
    },
    update: {
      username: ctx.from?.username,
      firstName: ctx.from?.first_name, 
    },
    create: {
      id: ctx.from?.id,
      username: ctx.from?.username || '',
      firstName: ctx.from?.first_name,
    }
  })
  
  console.timeLog('====>> AUTH' + ctx.from?.id, 'search ended')
  
  const matchDate = new Date(new Date().setUTCHours(0, 0, 0, 0)) //должен быть формат DateTime но время должно быть на начало дня
  console.log('match Date', matchDate)
  //считаем кол-во сообщений за сегодня у данного пользователя
  user.userDailyMessageCount = await prisma.message.count({
    where: {
      fromUserId: user.id,
      createdAt: {
        gte: matchDate,
      },
    },
  })

  console.timeEnd('====>> AUTH' + ctx.from?.id)
  console.log('Sub plan: ', user.subscriptionType)
  console.log('Messages today: ', user.userDailyMessageCount)

  ctx.userFromDB = user;
  await next()
}
