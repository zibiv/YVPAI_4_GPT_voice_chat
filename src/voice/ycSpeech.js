import path from 'path'
import axios from 'axios'
import config from 'config'

class ycSpeech {
  textToSpeech(text) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await axios.post(
          'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
          {
            text: text,
            lang: 'ru-RU',
            voice: 'ermil',
            emotion: 'good'
          },
          {
            headers: {
              Authorization: 'Api-key ' + config.get('YC_SPEECH_API'),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            responseType: 'arraybuffer',
          }
        )
        resolve(result.data)
      } catch (error) {
        console.log('❌', error.response?.data.toString('utf-8') ?? error)
        reject(error)
      }
    })
  }
}

export const yc = new ycSpeech()
