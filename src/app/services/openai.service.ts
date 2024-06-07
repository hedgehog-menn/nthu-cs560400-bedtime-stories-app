import { Injectable, model } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenaiService {
  // private apiKey = 'your-openai-api-key';
  private apiKey = environment.openaiApiKey;

  async generateStoryScript(): Promise<string[]> {
    const messages = [
      {
        role: 'system',
        content: 'You are a creative assistant for generating bedtime stories.',
      },
      {
        role: 'user',
        content:
          'Generate a bedtime story for kids. Generate its title name. Separate a story into 3 paragraphs for 3 show slides. Every time that mention their name again, add what kind of their creature in a bracket.',
      },
    ];

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    const storyText = response.data.choices[0].message.content.trim();
    return storyText.split('\n\n'); // Split story into parts
  }

  async generateImage(prompt: string): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: prompt + ' (do not inject text inject the image)',
        n: 1,
        // size: '256x256',
        size: '1024x1024',
        quality: "standard",
        // quality: 'hd',
        style: 'vivid',
        model: 'dall-e-3'
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    return response.data.data[0].url;
  }

  async generateTTS(text: string, isMaleVoice: boolean = true): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1',
        input: text,
        voice: isMaleVoice ? 'echo' : 'shimmer',
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        responseType: 'arraybuffer',
      }
    );
    const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
    return URL.createObjectURL(audioBlob);
  }
}
