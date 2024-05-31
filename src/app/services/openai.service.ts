import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenaiService {
  // private apiKey = 'your-openai-api-key';
  private apiKey = environment.openaiApiKey;

  async generateImage(prompt: string): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt,
        n: 1,
        size: '1024x1024',
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    return response.data.data[0].url;
  }

  async generateTTS(text: string): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1',
        input: text,
        voice: 'shimmer'
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        responseType: 'arraybuffer'
      }
    );
    const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
    return URL.createObjectURL(audioBlob);
  }
}
