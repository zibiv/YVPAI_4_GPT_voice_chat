import { Configuration, OpenAIApi } from 'openai'
import config from 'config'
import fs from 'fs'

const configuration = new Configuration({
  apiKey: config.get('OPENAI_TOKEN'),
})

const openAI = new OpenAIApi(configuration)

export async function translateAI(filePath) {
  const audioFile = fs.createReadStream(filePath)
  const transcript = await openAI.createTranscription(audioFile, 'whisper-1')
  return transcript.data.text
}
