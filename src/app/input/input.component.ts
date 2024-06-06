import { Component, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
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
  errorMessage: string = '';
  isLoading: boolean = false;
  generationStarted = new EventEmitter<void>();
  generationCompleted = new EventEmitter<void>();

  constructor(private openaiService: OpenaiService) {}

  onClickGenerateBtn() {
    this.isLoading = true;
    this.errorMessage = '';
    this.generationStarted.emit();
    this.handleGenerate();
  }

  async handleGenerate() {
    try {
      this.imageUrls = [];
      this.audioUrls = [];
      this.storyParts = [];

      this.storyParts = await this.openaiService.generateStoryScript();

      for (const part of this.storyParts) {
        const imageUrl = await this.openaiService.generateImage(part);
        const audioUrl = await this.openaiService.generateTTS(part);
        this.imageUrls.push(imageUrl);
        this.audioUrls.push(audioUrl);
      }

      this.isLoading = false;
      this.generationCompleted.emit();
      // this.generationCompleted.emit({
      //   imageUrls: this.imageUrls,
      //   audioUrls: this.audioUrls,
      //   storyParts: this.storyParts
      // });
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = 'Failed to generate story, image, or audio. Please check your billing status or try again later.';
      console.error('Error generating content:', error);
    }
  }
}