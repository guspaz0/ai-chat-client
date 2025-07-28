import { Send } from 'lucide-react'
import { useSignals } from "@preact/signals-react/runtime"
import { type Signal, useSignal } from "@preact/signals-react"

type Props = {
    serverUrl: Signal<string>
}

export default function ServerConfig({serverUrl}: Props) {
  //useSignals()
  const serverUrlSignal = useSignal<string>(serverUrl.value || 'http://localhost:11434')

  async function setServerUrl() {
    try {
      if (!serverUrlSignal.value) {
        throw new Error('Server URL cannot be empty')
      }
      // Assuming window.ollama.setHost is a function to set the server URL
      await window.ollama.setHost(serverUrlSignal.value)
      serverUrl.value = serverUrlSignal.value
      window.location.reload()
    } catch (error) {
      console.error('Failed to set server URL:', error)
      alert(error instanceof Error ? error.message : 'Failed to set server URL')
    }
  }
  const lang = navigator.language.startsWith('es') ? 'es' : 'en'

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 bg-gray-800 text-white rounded-lg">
        <h2 className="w-full text-white">
          {lang === 'es' ? 'Configuración del Servidor' : 'Server Configuration'}
        </h2>
        <label htmlFor="server-url">Server URL:</label>
        <input id="server-url" 
          className="min-w-75 bg-gray-700 text-white placeholder-gray-400 rounded-2xl px-4 py-3 pr-12 resize-none border border-gray-600 focus:border-blue-500 focus:outline-none transition-all duration-200 max-h-30" 
          type="text" 
          placeholder="Server URL" 
          value={serverUrlSignal.value} 
          onChange={(e) => serverUrlSignal.value = e.target.value}
        />
        <button 
          className="w-30 mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200" 
          type="button"
          onClick={setServerUrl}
        >
          <Send size={16} className="text-white" />
          {lang == 'en'? 'Save' : 'Guardar'}
        </button>
      
    </div>
  )
}