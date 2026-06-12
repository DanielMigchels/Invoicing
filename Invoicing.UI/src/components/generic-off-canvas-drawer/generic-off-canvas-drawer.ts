import { NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-generic-off-canvas-drawer',
  imports: [NgIf, NgIconComponent],
  templateUrl: './generic-off-canvas-drawer.html',
  styleUrl: './generic-off-canvas-drawer.css',
})
export class GenericOffCanvasDrawer {

  showDrawer = false;
  isClosing = false;
  isOpening = false;
  @Output() DrawerClosed = new EventEmitter();
  @Input() title: string = '';

  constructor() { }

  @HostListener('document:keydown', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.showDrawer && !this.isClosing) {
      event.preventDefault();
      this.closeDrawer();
    }
  }

  openDrawer(event: Event) {
    event.stopPropagation();
    this.showDrawer = true;
    this.isClosing = false;
    this.isOpening = false;
    // Trigger animation after a brief delay to ensure DOM is ready
    setTimeout(() => {
      this.isOpening = true;
    }, 10);
  }

  closeDrawer() {
    this.isClosing = true;
    this.isOpening = false;
    setTimeout(() => {
      this.showDrawer = false;
      this.isClosing = false;
    }, 300); // Match animation duration
  }
}
