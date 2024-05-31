import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { OpenaiService } from './services/openai.service';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    SlideshowComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [OpenaiService],
  bootstrap: [AppComponent]
})
export class AppModule { }