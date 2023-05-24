import processAI from './logic.js'

const voice = async (ctx) => {
  await processAI(ctx, true)

}

const text = async (ctx) => {
  await processAI(ctx, false)
}

const messages = {
  voice,
  text,
}

export default messages
