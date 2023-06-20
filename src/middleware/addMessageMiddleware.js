import { prisma } from "../../prisma/prismaClient.js"

export async function addToDB (ctx, userMessage, chatAnswer){
  console.log(userMessage, chatAnswer)
  const message = await prisma.message.create({
    data: {
      chatId: ctx.chat.id,
      text: userMessage, 
      date: new Date(),
      id: ctx.message.message_id,
      fromUserId: ctx.userFromDB.id
  }
  })
  // const contextMessage = await prisma.contextMessage.create({
  //   data: [
  //     {
        
  //     }
  //   ]
  // })
}