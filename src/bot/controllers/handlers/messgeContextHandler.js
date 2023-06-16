import { prisma } from '../../../../prisma/prismaClient.js'
import { dailyLimits } from '../../../config/dailyLimits.js'
export const messageContextHandler = async (ctx, bot) => {
  const { userFromDB } = ctx
  let context = null

  //кол-во последних сообщений которые используются для контекста
  const contextLength = dailyLimits[userFromDB?.subscriptionType]

  context = await prisma.context.findFirst({
    where: {
      chatId: ctx.message.chat.id,
    },
    orderBy: {
      createdAt: "desc"
    },
  })
  //так же получать все сообщения для данного контекста
  //TODO при запуске бота с нуля так же должен создаваться контекст

  console.log(context)
}
