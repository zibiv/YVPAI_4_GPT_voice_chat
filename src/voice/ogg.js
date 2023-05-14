import path from 'path'
import { get } from 'https'
import fs from 'fs'

import ffmpeg from 'fluent-ffmpeg'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const mediaDir = path.join(__dirname, '..', '..', 'media')

class OggConverter {
  constructor() {

  }

  toMP3(){

  }

  create(url, userId){
    const fileName = userId + "_" + path.basename(url)
    let responseData = ''
    // const writableStream = fs.createWriteStream()
    get(url, (response) => {
      const stream = fs.createWriteStream(path.join(mediaDir, fileName))
      response.pipe(stream)
    })
  }
}

const oggFile = '560620244_file_23.oga'
const mp3File = '560620244_file_23.mp3'

const command = ffmpeg(path.join(mediaDir, oggFile), {logger: console})
command.outputFormat('mp3').output(mp3File).on('end', function() {
  console.log('Finished processing');
})
.run()

export const ogg = new OggConverter()