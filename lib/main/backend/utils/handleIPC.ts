import { ipcMain } from 'electron'
import { WebFrameMain } from 'electron/main'

export const handleIPC = (channel: string, handler: (...args: any[]) => any) => {
  ipcMain.handle(channel, async (e, args) => {
    //if (!validateSender(e.senderFrame)) return null
    return await handler(e,args)
  })
}

function validateSender (frame: WebFrameMain) {
  // Value the host of the URL using an actual URL parser and an allowlist
  const host = new URL(frame.url).host
  if (allowedHosts.includes(host)) return true
  return false
}

const allowedHosts = [
  'localhost:5173',
]