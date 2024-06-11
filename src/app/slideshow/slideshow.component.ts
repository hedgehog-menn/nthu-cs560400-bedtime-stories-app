import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss'],
})
export class SlideshowComponent implements OnInit, OnDestroy {
  @Input() imageUrls: string[] = [];
  @Input() audioUrls: string[] = [];
  @Input() storyTitle: string = '';
  @Input() storyParts: string[] = [];
  @Input() generationStarted!: EventEmitter<void>;
  @Input() generationCompleted!: EventEmitter<void>;

  isLoading: boolean = false;

  currentSlideIndex = 0;

  constructor() {}

  ngOnInit(): void {
    this.generationStarted.subscribe(() => {
      this.isLoading = true;
      // this.currentSlideIndex = 0;
      this.imageUrls = [];
      this.audioUrls = [];
      this.storyParts = [];
      console.log('Generation started');
    });
    this.generationCompleted.subscribe(() => {
      this.isLoading = false;
      this.currentSlideIndex = 0;
      console.log('Generation completed');
    });
  }

  ngOnDestroy(): void {
    this.generationStarted.unsubscribe();
    this.generationCompleted.unsubscribe();
  }

  onAudioEnded() {
    if (this.currentSlideIndex < this.imageUrls.length - 1) {
      this.nextSlide();
    }
  }

  previousSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.imageUrls.length - 1) {
      this.currentSlideIndex++;
    }
  }

  getSlideTitle(index: number): string {
    return `Slide ${index + 1}`;
  }
}
