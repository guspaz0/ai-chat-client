export enum OllamaIpcEvents {
  GET_MODELS = "getModels",
  IS_AVAILABLE = "isAvailable",
  SET_HOST = "ollama:setHost",
  GET_HOST = "ollama:getHost",
  // Chat events
  START_CHAT = "startChat",
  STOP_CHAT = "stopChat",
  CHAT_CHUNK = "ollama:chatChunk",
  CHAT_COMPLETE = "ollama:chatComplete",
}