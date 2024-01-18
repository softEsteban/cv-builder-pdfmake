import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-builder-navbar',
  templateUrl: './builder.navbar.component.html',
  styleUrls: ['./builder.navbar.component.css']
})
export class BuilderNavbarComponent {

  @Output() notifyViewPdf: EventEmitter<any> = new EventEmitter<any>();
  @Output() notifyDownloadPdf: EventEmitter<any> = new EventEmitter<any>();
  @Output() notifyLoadMockCV: EventEmitter<any> = new EventEmitter<any>();

  viewPdf() {
    this.notifyViewPdf.emit();
  }

  downloadPdf() {
    this.notifyDownloadPdf.emit();
  }
  
  loadMockCV() {
    this.notifyLoadMockCV.emit();
  }
}
