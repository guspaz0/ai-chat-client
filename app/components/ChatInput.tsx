import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Paperclip } from 'lucide-react';
import { Button } from '@/app/components/ui/button'
import { useWindowContext } from './window/WindowContext'

interface ChatInputProps {
  onSendMessage: (message: string, files: File[]) => void;
  onStopGeneration: () => void;
  disabled: boolean;
  isGenerating: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopGeneration,
  disabled,
  isGenerating,
}) => {
  const Toasts = useWindowContext().toasts
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<React.InputHTMLAttributes<HTMLInputElement> | undefined>(null);
	const dropZoneRef = useRef<React.HTMLAttributes<HTMLDivElement> | undefined>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled && !isGenerating) {
      onSendMessage(input.trim(), selectedFiles as File[]);
      setInput('');
      adjustTextareaHeight();
      setSelectedFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);


  async function handleFileChange(e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) {
		const supportFileTypes = ['image/', 'video/', 'audio/', 'text/', 'application/pdf', 'application/msword'];
		const supporterExtensions = ['.tsx', '.ts', '.jsx', '.js', '.json','.py','.java']
    let inputFiles = []
		if (e.type == "change") inputFiles = e.target.files
		if (e.type == "drop") inputFiles = e.dataTransfer.files
		if (inputFiles && inputFiles[0]) {
			let prevState = selectedFiles;
			Array.from(inputFiles).forEach((file: File,i) => {
        console.log(file)
        if (supportFileTypes.some(type => file.type.startsWith(type))
          || supporterExtensions.some(ext => file.name.endsWith(ext))
        ) {
					prevState = [ ...prevState.filter(f => f.name !== file.name), file]
				} else {
            Toasts.value = [...Toasts.value, {
              id: Date.now(),
              message: content.error[lang],
              data: `¡tipo de archivo incompatible! ${file.name}`
            }]
				}
			})
			setSelectedFiles(prevState)
			inputRef.current.value = null
		}
	}

  function handleDragDropEvent(e: React.DragEvent<HTMLDivElement>){
		e.preventDefault();
		e.stopPropagation();
		if (e.type == 'dragenter'
			|| e.type == 'dragover') dropZoneRef.current.style.backgroundColor = 'gray'
		if (e.type == 'dragleave'
			|| e.type == 'drop') dropZoneRef.current.style.backgroundColor = `var(--navbar-bg)`
	}

  const removeFile = (name)=> setSelectedFiles([...selectedFiles.filter(f => f.name != name)])

  const lang = navigator.language.startsWith('es')? 'es' : 'en';

  const content = {
    placeholder: {
      enabled: {
        en: 'Type your message...',
        es: 'Escribe tu mensaje...',
      },
      disabled: {
        en: 'Connect to Ollama to start chatting...',
        es: 'Conéctate a Ollama para comenzar a chatear...',
      }
    },
    enterToSend: {
      en: 'Press Enter to send, Shift+Enter for new line',
      es: 'Presiona Enter para enviar, Shift+Enter para nueva línea',
    },
    fileUpload: {
      en: 'Upload file',
      es: 'Subir archivo'
    },
    error: {
      en: 'Unsupported file type',
      es: 'Tipo de archivo no soportado'
    }
  };


  return (
    <div className="border-t border-gray-700 p-6"
      style={{
        backgroundColor: 'var(--window-c-titlebar-background)'
      }}
      ref={dropZoneRef}
      onDragEnter={handleDragDropEvent}
      onDragOver={handleDragDropEvent}
      onDragLeave={handleDragDropEvent}
      onDrop={(e) => {
        handleDragDropEvent(e)
        handleFileChange(e)
      }}
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={!disabled
                ? content.placeholder.enabled[lang]
                : content.placeholder.disabled[lang]
              }
              disabled={disabled}
              rows={1}
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-2xl px-4 py-3 pr-12 resize-none border border-gray-600 focus:border-blue-500 focus:outline-none transition-all duration-200 max-h-30"
              style={{ minHeight: '48px' }}
            />
          </div>

          {isGenerating ? (
            <Button
              type="button"
              onClick={onStopGeneration}
              variant="destructive"
              size="lg"
              title="Stop generation"
            >
              <Square size={20} />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={disabled || !input.trim() || isGenerating}
              //className=""
              variant="secondary"
              size="lg"
              title="Send message"
            >
              <Send size={20} />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
          <span>
            <label htmlFor="file-upload"
              className="border p-2 rounded cursor-pointer hover:bg-gray-700 transition-colors duration-200">
              <Paperclip size={16} className="inline mr-1" />
              {content.fileUpload[lang]}
              <input
                ref={inputRef}
                multiple
                id='file-upload'
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={disabled || isGenerating}
                className="mt-2"
              />
            </label>
            <ul className="inline-flex space-x-2 ml-2">
            {selectedFiles?.map((file,i) =>
              <li key={file.name+i}
                className="g-5 ml-2 text-gray-300 border-dashed border-2 border-gray-600 rounded px-2 py-1 hover:bg-gray-700 transition-colors duration-200"
                onClick={()=> removeFile(file.name)}
              >
                {file.name}
                <b className="before-X m-r-5 text-red-400">
                  &times;
                </b>
              </li>
            )}
            </ul>
          </span>
          <span>{content.enterToSend[lang]}</span>
          {input.length > 0 && (
            <span className={input.length > 1000 ? 'text-yellow-400' : ''}>
              {input.length}/2000
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
