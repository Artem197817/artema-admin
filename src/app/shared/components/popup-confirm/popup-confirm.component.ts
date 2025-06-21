import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-popup-confirm',
  standalone: true,
  templateUrl: './popup-confirm.component.html',
  styleUrl: './popup-confirm.component.scss'
})
export class PopupConfirmComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
