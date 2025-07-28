import { handleIPC } from '../utils/handleIPC'
import { ollamaService } from '../services/ollama.service'
import { OllamaModel } from '@/app/types';
import { OllamaIpcEvents as msg } from '@/lib/events/ollamaIpcEvents';

export default function OllamaController() {
  handleIPC(msg.GET_MODELS, async (_,): Promise<OllamaModel[]> => await ollamaService.getModels())
  handleIPC(msg.IS_AVAILABLE, async (_,): Promise<boolean> => await ollamaService.isAvailable())
  handleIPC(msg.START_CHAT, async (event, { chatId, model, messages }) => 
    await ollamaService.startChat({chatId, model, messages, event})
  );
  handleIPC(msg.STOP_CHAT, (_, chatId: string) => ollamaService.stopChat(chatId));
  handleIPC(msg.SET_HOST, (_, host: string) => ollamaService.setHost(host));
  handleIPC(msg.GET_HOST, async () => await ollamaService.getHost());
}
