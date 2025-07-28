import { ElectronAPI } from '@electron-toolkit/preload'
import type api from './api'
import type ollamaEndpoints from './ollama.endpoints'

declare global {
  interface Window {
    electron: ElectronAPI
    api: typeof api
    ollama: typeof ollamaEndpoints
  }
}
