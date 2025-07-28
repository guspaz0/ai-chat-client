import { BrowserWindow, shell, app, protocol, net, dialog, ipcMain } from 'electron'
import { join } from 'path'
import { registerWindowIPC } from '@/lib/window/ipcEvents'
import appIcon from '@/resources/build/icon.png?asset'
import { pathToFileURL } from 'url'
import { AppIpcEvents as msg } from '@/lib/events/appIpc.events'
import EnvService from '@/lib/main/backend/config/env.service'

export function createAppWindow(): void {
  // Register custom protocol for resources
  registerResourcesProtocol()

  // Create the main window.
  const mainWindow = new BrowserWindow({
    width: 1050,
    height: 720,
    show: false,
    backgroundColor: '#1c1c1c',
    icon: appIcon,
    frame: false,
    titleBarStyle: 'hiddenInset',
    title: 'AI Chat Client',
    maximizable: true,
    resizable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
      devTools: EnvService.isDev,
      contextIsolation: true
    },
  })

  // Register IPC events for the main window.
  registerWindowIPC(mainWindow)
  ipcMain.handle(msg.GET_VERSION, async (_, data) => versionWindow())

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    EnvService.isDev && mainWindow.webContents.openDevTools({ mode: 'detach' })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Register custom protocol for assets
function registerResourcesProtocol() {
  protocol.handle('res', async (request) => {
    try {
      const url = new URL(request.url)
      // Combine hostname and pathname to get the full path
      const fullPath = join(url.hostname, url.pathname.slice(1))
      const filePath = join(__dirname, '../../resources', fullPath)
      return net.fetch(pathToFileURL(filePath).toString())
    } catch (error) {
      console.error('Protocol error:', error)
      return new Response('Resource not found', { status: 404 })
    }
  })
}

// Handle the version window display
async function versionWindow(){
  try {
    await dialog.showMessageBox({
      type: 'info',
      buttons: ['aceptar'],
      title: app.getName(),
      message: app.getName(),
      detail: `Version: ${app.getVersion()}\n`,
      cancelId: 1
    })
  } catch (e) {
    throw e
  }
}
