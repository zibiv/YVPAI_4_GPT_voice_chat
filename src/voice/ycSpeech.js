import path from 'path'
import fetch from 'node-fetch'
import config from 'config'

class ycSpeech {
  textToSpeech(text) {
    return new Promise(async (resolve, reject) => {

      try {
        const dataYcSpeech = new URLSearchParams()
        dataYcSpeech.append('text', text)
        dataYcSpeech.append('lang', 'ru-RU')
        dataYcSpeech.append('voice', 'ermil')
        dataYcSpeech.append('emotion', 'good')

        const options = {
          method: 'POST',
          headers: {
            'Authorization': 'Api-key ' + config.get('YC_SPEECH_API'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: dataYcSpeech,
        }

        const result = await fetch('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize', options)
  
        resolve(result.body)
      } catch (error) {
        console.log('❌', error.response?.data.toString('utf-8') ?? error)
        reject(error)
      }
    })
  }
}

export const yc = new ycSpeech()
