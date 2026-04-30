import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-premium-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './premium-button.html',
  styleUrls: ['./premium-button.scss'],
})
export class PremiumButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Output() click = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.click.emit();
    }
  }
}
