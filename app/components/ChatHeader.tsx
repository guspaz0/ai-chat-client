import React,{ useRef } from 'react';
import { Settings, Bot } from 'lucide-react';
import { OllamaModel } from '../types';
import {Dialog} from './Dialog';
import ServerConfig from './ServerConfig';
import type { Signal } from '@preact/signals-react';

interface ChatHeaderProps {
  serverUrl: Signal<string>;
  selectedModel: string;
  models: OllamaModel[];
  isConnected: boolean;
  onModelChange: (model: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  serverUrl,
  selectedModel,
  models,
  isConnected,
  onModelChange,
}) => {

  const dialogId = useRef<number>(Math.round(Math.random()*100));

  return (
    <div className="border-b border-gray-700 px-6 py-4" style={{
      backgroundColor: 'var(--window-c-titlebar-background)',
      color: 'var(--window-c-text)'
    }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Ollama AI Chat</h1>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-400">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            disabled={!isConnected || models.length === 0}
          >
            {models.length === 0 ? (
              <option value="">No hay modelos disponibles</option>
            ) : (
              models.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))
            )}
          </select>

          <Dialog id={dialogId.current} content={<ServerConfig serverUrl={serverUrl}/>} buttonText={<Settings size={20}/>} />
        </div>
      </div>
    </div>
  );
};
