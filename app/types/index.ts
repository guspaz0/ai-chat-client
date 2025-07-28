export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  files?: File[] | null;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface OllamaModel {
  name: string;
  model: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}
