import React from 'react'
import { Copy, User, Bot, Paperclip } from 'lucide-react'
import { Message } from '../types'
import MdPreviewComponent from './MdPreviewComponent'

interface MessageBubbleProps {
  message: Message
  onCopy: (content: string) => void
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onCopy }) => {
  const isUser = message.role === 'user'

  const handleCopy = () => {
    onCopy(message.content)
  }

  const lang = navigator.language.startsWith('es')? 'es' : 'en';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'}`} style={{ maxWidth: 'calc(100% - 2em)' }}>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-600 ml-3' : 'bg-gray-600 mr-3'
          }`}
        >
          {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
        </div>

        <div
          className={`group relative ${
            isUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'
          } rounded-2xl px-4 py-3 shadow-sm`}
          style={{width: '-webkit-fill-available'}}
        >
          <div className="break-words">
            {isUser
              ? message.content
              : <MdPreviewComponent text={message.content} />
            }
            {message.isStreaming && <span className="inline-block w-2 h-4 bg-current opacity-75 animate-pulse ml-1" />}
          </div>

          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
              isUser ? 'hover:bg-blue-700' : 'hover:bg-gray-600'
            }`}
            title={lang == 'en'? "Copy message" : "Copiar mensaje"}
          >
            <Copy size={14} />
          </button>

          <div className={`text-xs mt-2 opacity-75 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
            <span>
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <ul className="inline-flex space-x-2 ml-2">
            {message.files?.map((file,i) =>
              <li key={file.name+i}
                className="g-5 ml-2 text-white border-dashed border-2 border-gray-600 rounded px-2 py-1 hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="flex items-center">
                  <Paperclip size={14} className="mr-2" />
                  {file.name}
                </span>

              </li>
            )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
