import { Configuration, OpenAIApi } from 'openai'
import config from 'config'
import fs from 'fs'

class OpenAI {
  roles = {
    ASSISTANT: 'assistant',
    USER: 'user',
    SYSTEM: "system",
  }
  constructor(api_key) {
    const configuration = new Configuration({
      apiKey: api_key,
    })
    this.API = new OpenAIApi(configuration)
  }

  async chatAI(messages) {
    const responseFromOpenAI = await this.API.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.3,
      frequency_penalty: 0.1,
      presence_penalty: -1,
      max_tokens: 500,
      stream: false,
      n: 1,
    })
    return responseFromOpenAI.data.choices[0].message
  }

  async transcriptAI(filePath) {
    const audioFile = fs.createReadStream(filePath)
    const transcript = await this.API.createTranscription(
      audioFile,
      'whisper-1'
    )
    return transcript.data.text
  }
}

export const openAIApi = new OpenAI(config.get('OPENAI_TOKEN'))
