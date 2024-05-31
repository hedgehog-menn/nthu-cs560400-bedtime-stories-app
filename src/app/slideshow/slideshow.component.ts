import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent implements OnInit {
  @Input() imageUrl!: string;
  @Input() audioUrl!: string;

  ngOnInit(): void {
    // Combine image and audio into a video or a slideshow
    // This is a simplified example; in a real-world scenario, you may need to
    // handle video creation on the server side or use a library to combine them.
  }
}