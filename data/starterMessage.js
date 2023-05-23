import { openAIApi } from '../src/AI/openai.js'

export function createNewContext() {
  return {
    messages: []
  }
}