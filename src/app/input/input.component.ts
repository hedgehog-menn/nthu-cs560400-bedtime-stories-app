import { Component, EventEmitter } from '@angular/core';
import { OpenaiService } from '../services/openai.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  imageUrls: string[] = [];
  audioUrls: string[] = [];
  storyParts: string[] = [];
  storyTitle: string = '';
  errorMessage: string = '';
  isMaleVoice: boolean = true;
  isLoading: boolean = false;
  generationStarted = new EventEmitter<void>();
  generationCompleted = new EventEmitter<void>();

  constructor(private openaiService: OpenaiService) {}

  onClickGenerateBtn() {
    this.isLoading = true;
    this.storyTitle = '';
    this.errorMessage = '';
    this.generationStarted.emit();
    this.handleGenerate(this.isMaleVoice);
  }

  async handleGenerate(isMaleVoice: boolean = true) {
    try {
      this.imageUrls = [];
      this.audioUrls = [];
      this.storyParts = [];

      this.storyParts = await this.openaiService.generateStoryScript();

      if (this.storyParts[0].startsWith('Title')) {
        this.storyTitle = this.storyParts.shift() || '';
      }

      // Create an array of promises for generating images and audio
      const promises = this.storyParts.map((part) => {
        const imagePromise = this.openaiService.generateImage(part);
        const ttsPromise = this.openaiService.generateTTS(part, isMaleVoice);
        return Promise.all([imagePromise, ttsPromise]);
      });

      // Execute all promises in parallel
      const results = await Promise.all(promises);

      // Extract results and assign them to the corresponding arrays
      results.forEach(([imageUrl, audioUrl]) => {
        this.imageUrls.push(imageUrl);
        this.audioUrls.push(audioUrl);
      });

      this.isLoading = false;
      this.generationCompleted.emit();
    } catch (error) {
      this.isLoading = false;
      this.errorMessage =
        'Failed to generate story, image, or audio. Please try again later.';
      console.error('Error generating content:', error);
    }
  }
}
