import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: false,
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() title = '';
  @Input() value: number | string = 0;
  @Input() icon = '📊';
  @Input() color = '#3b82f6';
}
