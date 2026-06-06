import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../core/models/todo.models';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: '[app-task-row]',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './task-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses'
  }
})
export class TaskRowComponent {
  @Input({ required: true }) task!: Task;
  @Output() toggleComplete = new EventEmitter<Task>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() viewDetails = new EventEmitter<Task>();

  get hostClasses(): string {
    return 'border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-150 ' +
      (this.task.isCompleted ? 'bg-slate-50/30 dark:bg-slate-800/5 opacity-70' : '');
  }
}
