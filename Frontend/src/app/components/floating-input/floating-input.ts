import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-floating-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-input.html',
  styleUrls: ['./floating-input.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FloatingInputComponent),
      multi: true,
    },
  ],
})
export class FloatingInputComponent implements ControlValueAccessor {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() hasError: boolean = false;
  @Input() errorMessage: string = '';
  @Input() disabled: boolean = false;
  @Input() icon?: string; // 'eye' | 'eye-off' para password
  @Output() iconClick = new EventEmitter<void>();

  value: string = '';
  showIcon: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onFocus(): void {
    this.onTouched();
  }

  onIconClick(): void {
    this.iconClick.emit();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
