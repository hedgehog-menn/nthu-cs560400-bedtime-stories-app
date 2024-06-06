import { Component, Input, OnInit, ViewChild, ElementRef, OnDestroy, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent implements OnInit, OnDestroy {
  @Input() imageUrls: string[] = [];
  @Input() audioUrls: string[] = [];
  @Input() storyParts: string[] = [];
  @Input() generationStarted!: EventEmitter<void>;
  @Input() generationCompleted!: EventEmitter<void>;

  isLoading: boolean = false;

  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;
  currentSlideIndex = 0;

  constructor() { }

  ngOnInit(): void {
    this.generationStarted.subscribe(() => {
      this.isLoading = true;
      this.imageUrls = [];
      this.audioUrls = [];
      this.storyParts = [];
      console.log('Generation started');
    });
    this.generationCompleted.subscribe(() => {
      this.isLoading = false;
      // this.playSlide();
      console.log('Generation completed');
    });
  }

  ngOnDestroy(): void {
    this.cleanUpAudio();
    this.generationStarted.unsubscribe();
    this.generationCompleted.unsubscribe();
  }

  cleanUpAudio() {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      this.audioPlayer.nativeElement.pause();
      this.audioPlayer.nativeElement.src = '';
    }
  }

  onAudioEnded() {
    if (this.currentSlideIndex < this.imageUrls.length - 1) {
      this.nextSlide();
    }
  }

  playSlide() {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      this.audioPlayer.nativeElement.src = this.audioUrls[this.currentSlideIndex];
      this.audioPlayer.nativeElement.load();
      this.audioPlayer.nativeElement.play();
    }
  }

  previousSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.playSlide();
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.imageUrls.length - 1) {
      this.currentSlideIndex++;
      this.playSlide();
    }
  }

  getSlideTitle(index: number): string {
    return `Slide ${index + 1}`;
  }
}
