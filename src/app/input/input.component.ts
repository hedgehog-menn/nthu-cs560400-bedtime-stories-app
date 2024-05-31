import { Component } from '@angular/core';
import { OpenaiService } from '../services/openai.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  prompt: string = '';
  imageUrl: string = '';
  audioUrl: string = '';
  showSlideshow: boolean = false;

  constructor(private openaiService: OpenaiService) {}

  async handleGenerate() {
    this.imageUrl = await this.openaiService.generateImage(this.prompt);
    this.audioUrl = await this.openaiService.generateTTS(this.prompt);
    this.showSlideshow = true;
  }
}