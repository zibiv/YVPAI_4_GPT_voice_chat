import fs from 'fs'

export async function removeFile(path) {
  fs.unlink(path, () => console.log(path + ' файл успешно удален'))
}