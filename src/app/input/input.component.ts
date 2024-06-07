import { Component, EventEmitter, Output } from '@angular/core';
import { OpenaiService } from '../services/openai.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
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

      for (const part of this.storyParts) {
        if (part.startsWith('Title')) {
          this.storyTitle = part;
          continue;
        }
        const imageUrl = await this.openaiService.generateImage(part);
        const audioUrl = await this.openaiService.generateTTS(part, isMaleVoice);
        this.imageUrls.push(imageUrl);
        this.audioUrls.push(audioUrl);
      }

      this.isLoading = false;
      this.generationCompleted.emit();
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = 'Failed to generate story, image, or audio. Please try again later.';
      console.error('Error generating content:', error);
    }
  }
}