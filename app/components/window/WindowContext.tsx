import { createContext, useContext, useEffect, useState } from 'react'
import { Titlebar, TitlebarProps } from './Titlebar'
import { TitlebarContextProvider } from './TitlebarContext'
import { type Signal, useSignal } from '@preact/signals-react'

const WindowContext = createContext<WindowContextProps | undefined>(undefined)

export const WindowContextProvider = ({ children, titlebar }: WindowContextProviderProps) => {
  //useSignals()
  const dialogs = useSignal<Record<string, any>[]>([])
  const toasts = useSignal<Record<string, any>[]>([])
  const [initProps, setInitProps] = useState<WindowInitProps | undefined>()

  const defaultTitlebar: TitlebarProps = {
    title: 'Electron React App',
    icon: 'appIcon.png',
    titleCentered: false,
    menuItems: [],
  }

  // Merge default titlebar props with user defined props
  titlebar = { ...defaultTitlebar, ...titlebar }

  useEffect(() => {
    // Load window init props
    window.api.invoke('init-window').then((value: WindowInitProps) => setInitProps(value))

    // Add class to parent element
    const parent = document.querySelector('.window-content')?.parentElement
    if (parent) {
      parent.classList.add('window-frame')
    }
  }, [])

  return (
    <WindowContext.Provider value={{ titlebar, window: initProps!, dialogs, toasts }}>
      <TitlebarContextProvider>
        <Titlebar />
      </TitlebarContextProvider>
      <WindowContent>{children}</WindowContent>
    </WindowContext.Provider>
  )
}

const WindowContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="window-content">{children}</div>
}

export const useWindowContext = () => {
  const context = useContext(WindowContext)
  if (context === undefined) {
    throw new Error('useWindowContext must be used within a WindowContextProvider')
  }
  return context
}

interface WindowContextProps {
  titlebar: TitlebarProps
  readonly window: WindowInitProps
  dialogs: Signal<Record<string, any>[]>
  toasts: Signal<Record<string, any>[]>
}

interface WindowInitProps {
  width: number
  height: number
  maximizable: boolean
  minimizable: boolean
  platform: string
}

interface WindowContextProviderProps {
  children: React.ReactNode
  titlebar?: TitlebarProps
}
