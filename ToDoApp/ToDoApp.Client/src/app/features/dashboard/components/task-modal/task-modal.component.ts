import { Component, Input, Output, EventEmitter, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, Task } from '../../../../core/models/todo.models';
import { TaskService } from '../../../../core/services/task.service';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './task-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskModalComponent implements OnInit {
  /** The task to edit. If null, the modal is in "create" mode. */
  @Input() editingTask: Task | null = null;
  /** Available categories for the dropdown. */
  @Input() categories: Category[] = [];
  /** Emitted after a task is successfully saved (created or updated). */
  @Output() saved = new EventEmitter<void>();
  /** Emitted when the user closes the modal without saving. */
  @Output() closed = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    dueDate: [''],
    categoryId: ['']
  });

  ngOnInit(): void {
    if (this.editingTask) {
      let dateStr = '';
      if (this.editingTask.dueDate) {
        dateStr = new Date(this.editingTask.dueDate).toISOString().substring(0, 10);
      }
      this.taskForm.reset({
        title: this.editingTask.title,
        description: this.editingTask.description,
        dueDate: dateStr,
        categoryId: this.editingTask.category?.id ? this.editingTask.category.id.toString() : ''
      });
    }
  }

  close(): void {
    this.closed.emit();
  }

  save(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formVal = this.taskForm.value;
    const catId = formVal.categoryId ? parseInt(formVal.categoryId, 10) : null;
    const dueDateVal = formVal.dueDate ? new Date(formVal.dueDate).toISOString() : undefined;

    if (this.editingTask) {
      const model = {
        title: formVal.title!,
        description: formVal.description || '',
        isCompleted: this.editingTask.isCompleted,
        dueDate: dueDateVal,
        categoryId: catId
      };

      this.taskService.updateTask(this.editingTask.id, model).subscribe({
        next: () => this.saved.emit(),
        error: () => console.error('Failed to update task')
      });
    } else {
      const model = {
        title: formVal.title!,
        description: formVal.description || '',
        dueDate: dueDateVal,
        categoryId: catId
      };

      this.taskService.createTask(model).subscribe({
        next: () => this.saved.emit(),
        error: () => console.error('Failed to create task')
      });
    }
  }
}
