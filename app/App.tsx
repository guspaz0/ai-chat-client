import React, { useEffect } from 'react'
import { ChatHeader } from './components/ChatHeader'
import { ChatArea } from './components/ChatArea'
import { ChatInput } from './components/ChatInput'
import { useChat } from './hooks/useChat'
import { useSignals } from '@preact/signals-react/runtime'
import ToastManager from './components/toasts/ToastsContainer'

function App() {
  useSignals()
  const {
    serverUrl,
    messages,
    models,
    selectedModel,
    isConnected,
    isGenerating,
    error,
    checkConnection,
    sendMessage,
    stopGeneration,
    clearChat,
    copyMessage,
    setSelectedModel,
  } = useChat()

  useEffect(() => {
    checkConnection()
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [checkConnection])

  const handleStartChat = () => {
    // Focus on input when starting chat from empty state
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.focus()
    }
  }

  return (
    <div className="main-h-screen bg-gray-900 flex flex-col">
      <ToastManager/>
      <ChatHeader
        serverUrl={serverUrl}
        selectedModel={selectedModel}
        models={models}
        isConnected={isConnected}
        onModelChange={setSelectedModel}
      />

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-6 py-3 mx-6 mt-4 rounded-lg">
          <p className="text-sm">
            <strong>Error:</strong> {error}
          </p>
          <button
            onClick={checkConnection}
            className="mt-2 text-sm bg-red-800 hover:bg-red-700 px-3 py-1 rounded transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      <ChatArea
        messages={messages}
        isConnected={isConnected}
        selectedModel={selectedModel}
        onClearChat={clearChat}
        onCopyMessage={copyMessage}
        onStartChat={handleStartChat}
      />

      <ChatInput
        onSendMessage={sendMessage}
        onStopGeneration={stopGeneration}
        disabled={!isConnected || !selectedModel}
        isGenerating={isGenerating}
      />
    </div>
  )
}

export default App

