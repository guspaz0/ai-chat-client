import { OllamaModel } from '@/app/types';
import { ipcRenderer } from 'electron';
import { OllamaIpcEvents as msg } from '@/lib/events/ollamaIpcEvents';

export default {
  getModels: async (): Promise<OllamaModel[]> => ipcRenderer.invoke(msg.GET_MODELS),
  isAvailable: async (): Promise<boolean> => ipcRenderer.invoke(msg.IS_AVAILABLE),
  startChat: async ({chatId, model, messages, signal}: Record<string, any>) => 
    ipcRenderer.invoke(msg.START_CHAT, {chatId, model, messages, signal}),
  stopChat: async ({chatId}: Record<string, string>) => 
    ipcRenderer.invoke(msg.STOP_CHAT, { chatId }),
  onChatChunk: (callback: ({ chatId, chunk }: Record<string, string>) => void) => 
    ipcRenderer.on(msg.CHAT_CHUNK, (event, data) => callback(data)),
  onChatComplete: (callback: ({ chatId }: Record<string, string>) => void) => 
    ipcRenderer.on(msg.CHAT_COMPLETE, (event, data) => callback(data)),
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners(msg.CHAT_CHUNK);
    ipcRenderer.removeAllListeners(msg.STOP_CHAT);
    ipcRenderer.removeAllListeners(msg.CHAT_COMPLETE);
  },
  setHost: async (host: string) => ipcRenderer.invoke(msg.SET_HOST, host),
  getHost: async (): Promise<string> => ipcRenderer.invoke(msg.GET_HOST)
}
