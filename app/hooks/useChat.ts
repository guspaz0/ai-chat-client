import { useState, useRef, useCallback } from 'react';
import { Message, OllamaModel } from '../types';
import { useSignal, useSignalEffect } from '@preact/signals-react';
import FileParser from '../scripts/parsefiles';


export const useChat = () => {
  useSignalEffect(() => {
    // Initialize connection check on mount
    if (!serverUrl.value) {
      getHost().then(host => {
        serverUrl.value = host;
      });
    }
  })
  const messages = useSignal<Message[]>([]);
  const serverUrl = useSignal<string>('');
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const abortControllerRef = useRef<AbortController | null>(null);

  const getHost = async () => {
    try {
      return await window.ollama.getHost() || 'http://localhost:11434';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get host');
    }
  };

  const checkConnection = useCallback(async () => {
    try {
      const available = await window.ollama.isAvailable();
      setIsConnected(available);

      if (available) {
        const modelList = await window.ollama.getModels();
        setModels(modelList);
        if (modelList.length > 0 && !selectedModel) {
          setSelectedModel(modelList[0].name);
        }
        setError('');
      } else {
        setModels([]);
        setSelectedModel('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsConnected(false);
      setModels([]);
      setSelectedModel('');
    }
  }, [selectedModel]);

  const sendMessage = useCallback(async (content: string, files: File[]) => {
    if (!selectedModel || !isConnected || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      files,
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    messages.value = [...messages.value, userMessage, assistantMessage];
    setIsGenerating(true);
    setError('');

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    //let fullResponse = '';
    try {

      const chatId = assistantMessage.id;
      const filesParsed = await FileParser.parse(files);

      const chatHistory = [...messages.value, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content + filesParsed.join(', '),
        //files: msg.files ? msg.files : undefined,
      }));

      window.ollama.onChatChunk(handleChunk);
      window.ollama.onChatComplete(handleComplete);

      await window.ollama.startChat({
        chatId,
        model:selectedModel,
        messages: chatHistory,
        signal: abortControllerRef.current.signal
      });

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled
        messages.value = messages.value.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, content: msg.content + '\n\n[Generation stopped]', isStreaming: false }
            : msg
        )
      } else {
        setError(err instanceof Error ? err.message : 'Failed to send message');
        // Remove the failed assistant message
        messages.value = messages.value.filter(msg => msg.id !== assistantMessage.id);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
      window.ollama.removeAllListeners();
    }
  }, [selectedModel, isConnected, isGenerating]);

  const handleChunk = (data: { chatId: string; chunk: string }) => {

    messages.value = messages.value.map(msg =>{
      return msg.id === data.chatId
        ? { ...msg, content: msg.content + data.chunk, isStreaming: true }
        : msg
    });
  };

  const handleComplete = (data: { chatId: string }) => {
    messages.value = messages.value.map(msg =>
      msg.id === data.chatId
        ? { ...msg, isStreaming: false }
        : msg
    );
    window.ollama.removeAllListeners();
  };

  const clearChat = useCallback(() => {
    messages.value = [];
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
  }, []);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const copyMessage = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  }, []);

  return {
    serverUrl,
    messages: messages.value,
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
  };
};
