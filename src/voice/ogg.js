import path, { resolve } from 'path'
import { get } from 'https'
import { removeFile } from '../utils/index.js'

import ffmpeg from 'fluent-ffmpeg'
import ffmpegBinary from '@ffmpeg-installer/ffmpeg'
//указание на то где хранится binary библиотеки ffmpeg
ffmpeg.setFfmpegPath(ffmpegBinary.path)

//так как я использую es modules, а не commonjs, то необходимо указать место положение этого файла в проекте
//надо убрать схему и название файла из пути
const __dirname = path.dirname(new URL(import.meta.url).pathname)
//нахождение папки в которой будет хранится готовые mp3
const mediaDir = path.join(__dirname, '..', '..', 'media')

class OggToMp3Converter {
  toMP3(readableStream, filePath) {
    return new Promise((resolve, reject) => {
      const command = ffmpeg(readableStream)
      command
        .outputFormat('mp3')
        .output(filePath)
        .on('end', () => {
          resolve(filePath)
        })
        .on('error', () => {
          reject(filePath)
        })
        .run()
    })
  }

  convert(url, userId) {
    //создание названия mp3 файла
    const fileName = userId + '_' + path.basename(url).split('.')[0] + ".mp3"
    const mp3Path = path.join(mediaDir, fileName)
    return new Promise((resolve, reject) => {
      get(url, async (response) => {
        try {
          const result = await this.toMP3(response, mp3Path)
          setTimeout(()=> removeFile(result), 30000)
          resolve(result)
        } catch(errorConvertation) {
          reject(result)
          console.log('Что то не так с конвертацией: ', errorConvertation)
        }
        
      })
      
    })

  }
}

export const ogg = new OggToMp3Converter()
