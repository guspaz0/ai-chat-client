import React, { useEffect, useRef } from 'react'
import { Trash2 } from 'lucide-react'
import { Message } from '../types'
import { MessageBubble } from './MessageBubble'
import { EmptyState } from './EmptyState'

interface ChatAreaProps {
  messages: Message[]
  isConnected: boolean
  selectedModel: string
  onClearChat: () => void
  onCopyMessage: (content: string) => void
  onStartChat: () => void
}

export function ChatArea({
  messages,
  isConnected,
  selectedModel,
  onClearChat,
  onCopyMessage,
  onStartChat,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const lang = navigator.language.startsWith('es')? 'es' : 'en';

  const content = {
    model: {
      en: `Chat with ${selectedModel}`,
      es: `Chatea con ${selectedModel}`,
    },
    clearBtn: {
      en: 'Clear conversation',
      es: 'Limpiar conversación',
    },
    clear: {
      en: 'Clear',
      es: 'Limpiar',
    },
  }
  return (
    <>
      {messages.length === 0 ? (
        <EmptyState isConnected={isConnected} selectedModel={selectedModel} onStartChat={onStartChat} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-1xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">{content.model[lang]}</h3>
              <button
                onClick={onClearChat}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-700"
                title={content.clearBtn[lang]}
              >
                <Trash2 size={16} />
                <span className="text-sm">{content.clear[lang]}</span>
              </button>
            </div>

            <div className="">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} onCopy={onCopyMessage} />
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </>
  )
}
