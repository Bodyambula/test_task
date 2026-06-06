import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../core/models/todo.models';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './task-detail-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailModalComponent {
  /** The task whose details are displayed. */
  @Input({ required: true }) task!: Task;
  /** Emitted when the user closes the modal. */
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
