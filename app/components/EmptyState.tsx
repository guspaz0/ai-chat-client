import React from 'react'
import { MessageCircle, Zap, Shield, Globe, Settings } from 'lucide-react'
import { connected } from 'process'

interface EmptyStateProps {
  isConnected: boolean
  selectedModel: string
  onStartChat: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isConnected, selectedModel, onStartChat }) => {
  const features = [
    {
      icon: <MessageCircle size={24} />,
      title: {
        en: 'Natural Conversations',
        es: 'Conversaciones Naturales',
      },
      description: {
        en: 'Chat with AI models in a natural, conversational way',
        es: 'Chatea con modelos de IA de manera natural y conversacional'
      },
    },
    {
      icon: <Zap size={24} />,
      title: {
        en: 'Real-time Streaming',
        es: 'Transmisión en Tiempo Real'
      },
      description: {
        en: "Get responses as they're generated with smooth streaming",
        es: 'Obtén respuestas a medida que se generan con una transmisión fluida'
      }
    },
    {
      icon: <Shield size={24} />,
      title: {
        en: 'Private & Secure',
        es: 'Privado y Seguro'
      },
      description: {
        en: 'All conversations happen locally on your machine',
        es: 'Todas las conversaciones ocurren localmente en tu máquina'
      }
    },
    {
      icon: <Globe size={24} />,
      title: {
        en: 'Multiple Models',
        es: 'Múltiples Modelos'
      },
      description: {
        en: 'Switch between different Ollama models seamlessly',
        es: 'Cambia entre diferentes modelos de Ollama sin problemas'
      }
    },
  ]
  const title = {
    en: 'Welcome to Ollama AI Chat',
    es: 'Bienvenido a Ollama AI Chat'
  }
  const modelName = {
    en: {
      connected: `Ready to chat with ${selectedModel || 'your AI model'}`,
      disconnected: 'Connect to Ollama to start chatting with local AI models'
    },
    es: {
      connected: `Listo para chatear con ${selectedModel || 'tu modelo de IA'}`,
      disconnected: 'Conéctate a Ollama para comenzar a chatear con modelos de IA locales'
    }
  }

  const gettingStarted = {
    title: {
      en: 'Get started by connecting to Ollama',
      es: 'Comienza por conectarte a Ollama'
    },
    instructions: {
      local: {
        first: {
          en: 'Install Ollama from',
          es: 'Instala Ollama desde'
        },
        second: {
          en: 'Run',
          es: 'Ejecuta'
        },
        third: {
          en: 'Pull a model:',
          es: 'Descarga un modelo:'
        },
        fourth: {
          en: 'Start chatting with your AI model',
          es: 'Comienza a chatear con tu modelo de IA'
        }
      },
      remote:{
        first: {
          en: 'Go to settings:',
          es: 'Ir a ajustes:'
        },
        second: {
          en: 'Enter Your Ollama server Url',
          es: 'Ingresa la URL del servidor Ollama'
        },
        third:{
          en: 'Ensure the server has a model',
          es: 'Asegúrate de que el servidor tenga un modelo'
        },
        fourth: {
          en: 'Save, Start chatting with your AI model',
          es: 'Guardar, Comienza a chatear con tu modelo de IA'
        }
      }
    }
  }

  const lang = navigator.language.startsWith('es') ? 'es' : 'en'

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{title[lang]}</h2>
          <p className="text-gray-400 text-lg">
            {isConnected
              ? modelName[lang].connected
              : modelName[lang].disconnected
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3 text-blue-400">
                {feature.icon}
              </div>
              <h4 className="font-semibold text-white mb-2">{feature.title[lang]}</h4>
              <p className="text-sm text-gray-400">{feature.description[lang]}</p>
            </div>
          ))}
        </div>

        {!isConnected && (
          <div className="mt-8 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <p className="text-gray-300 mb-2">
              <strong>{gettingStarted.title[lang]}</strong>
            </p>
            <div className="flex flex-row items-center">
              <ol className="text-sm text-gray-400 space-y-1 text-left max-w-md mx-auto">
                <li>
                  1. {gettingStarted.instructions.local.first[lang]} <span className="text-blue-400">https://ollama.ai</span>
                </li>
                <li>
                  2. {gettingStarted.instructions.local.second[lang]} <code className="bg-gray-600 px-2 py-1 rounded text-xs">ollama serve</code>
                </li>
                <li>
                  3. {gettingStarted.instructions.local.third[lang]} <code className="bg-gray-600 px-2 py-1 rounded text-xs">ollama pull llama2</code>
                </li>
                <li>4. {gettingStarted.instructions.local.fourth[lang]}</li>
              </ol>
              <b>{lang == 'en' ? 'Or:' : 'O:'}</b>
              <ol className="text-sm text-gray-400 space-y-1 text-left max-w-md mx-auto">
                <li className="flex flex-row">
                  <span>1. {gettingStarted.instructions.remote.first[lang]} </span> <Settings size={18} className="ml-3 rounded"/>
                </li>
                <li>
                  2. {gettingStarted.instructions.remote.second[lang]}
                </li>
                <li>
                  3. {gettingStarted.instructions.remote.third[lang]}
                </li>
                <li>4. {gettingStarted.instructions.remote.fourth[lang]}</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
