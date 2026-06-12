import { Component, Input } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-generic-banner',
  imports: [NgIconComponent],
  templateUrl: './generic-banner.html',
  styleUrl: './generic-banner.css',
})
export class GenericBanner {
  @Input() icon: string = 'heroExclamationCircle';
  @Input() title: string = '';
}
