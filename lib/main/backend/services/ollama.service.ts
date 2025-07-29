import { OllamaModel, OllamaResponse } from "@/app/types";
import { IpcMainInvokeEvent } from "electron";
import { ConfigService } from "../config/config.services";
import { OllamaIpcEvents as msg } from '@/lib/events/ollamaIpcEvents';

const config = ConfigService.getInstance();

class OllamaService {
  private baseUrl: string;
  activeStreams: Map<string, AsyncGenerator<string>> = new Map();

  constructor(baseUrl: string = config.getConfig("ollamaHost")) {
    this.baseUrl = baseUrl;
  }
  async getHost(): Promise<string> {
    return this.baseUrl;
  }

  async setHost(host: string): Promise<void> {
    this.baseUrl = host;
    config.setConfig("ollamaHost", host);
  }

  async getModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error("Failed to fetch models");
      }
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error("Error fetching models:", error);
      throw new Error(
        `Unable to connect to Ollama. Make sure it's running on ${this.baseUrl}`,
      );
    }
  }

async *streamChat(model: string, messages: Record<string,string>[], files?: any[]): AsyncGenerator<string> {
    try {

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (data.message?.content) {
                yield data.message.content;
              }
              if (data.done) {
                return;
              }
            } catch (error) {
              console.warn('Failed to parse line:', line);
            }
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async startChat({chatId, model, messages, event}: Record<string, string | IpcMainInvokeEvent | Record<string, string>>
  ): Promise<OllamaResponse | { success: boolean; error?: string }> {
    try {
      // Cancel any existing stream for this chat
      if (this.activeStreams.has(chatId as string)) {
        this.activeStreams.get(chatId).cancelled = true;
        this.activeStreams.delete(chatId as string);
      }

      const streamControl = { cancelled: false };
      this.activeStreams.set(chatId as string, streamControl);

      const stream = this.streamChat(model as string, messages);

      for await (const chunk of stream) {
        if (streamControl.cancelled) {
          break;
        }

        // Send chunk to renderer
        (event as IpcMainInvokeEvent).sender.send(msg.CHAT_CHUNK, { chatId: chatId, chunk });
      }

      // Send completion signal
      if (!streamControl.cancelled) {
        (event as IpcMainInvokeEvent).sender.send(msg.CHAT_COMPLETE, { chatId: chatId });
      }

      this.activeStreams.delete(chatId as string);
      return { success: true };
    } catch (error: any) {
      this.activeStreams.delete(chatId as string);
      return {
        success: false,
        error: error.message || 'Failed to start chat stream'
      };
    }
  }

  stopChat(chatId: string) {
    if (this.activeStreams.has(chatId)) {
      this.activeStreams.get(chatId).cancelled = true;
      this.activeStreams.delete(chatId);
      return { success: true };
    }
    return { success: false, error: 'No active stream found' };
  }
}

export const ollamaService = new OllamaService();
