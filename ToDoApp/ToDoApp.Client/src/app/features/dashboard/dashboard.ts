import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CategoryService } from '../../core/services/category.service';
import { TaskService } from '../../core/services/task.service';
import { Category, Task, TaskPagedResult } from '../../core/models/todo.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private categoryService = inject(CategoryService);
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // User details
  userName = computed(() => this.authService.currentUser()?.name || 'Користувач');
  userEmail = computed(() => this.authService.currentUser()?.email || '');

  // Statistics signals
  statTotal = signal<number>(0);
  statCompleted = signal<number>(0);
  statPending = computed(() => this.statTotal() - this.statCompleted());
  statRate = computed(() => {
    const total = this.statTotal();
    return total > 0 ? Math.round((this.statCompleted() / total) * 100) : 0;
  });

  // Categories and Tasks signals
  categories = signal<Category[]>([]);
  tasks = signal<Task[]>([]);
  totalTasksCount = signal<number>(0);

  // Filters signals
  searchQuery = signal<string>('');
  selectedCategoryId = signal<number | null>(null);
  selectedStatus = signal<boolean | null>(null); // null = all, true = completed, false = in progress
  currentPage = signal<number>(1);
  pageSize = signal<number>(6);

  // Modal signals
  isTaskModalOpen = signal<boolean>(false);
  editingTaskId = signal<number | null>(null); // null = creating, otherwise editing

  // Category management inline signals
  isAddingCategory = signal<boolean>(false);
  newCategoryName = signal<string>('');
  categoryError = signal<string | null>(null);

  // Loading signals
  isTasksLoading = signal<boolean>(false);
  isStatsLoading = signal<boolean>(false);

  // Task form
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    dueDate: [''],
    categoryId: ['']
  });

  ngOnInit(): void {
    this.loadCategories();
    this.refreshDashboard();
  }

  // Load all user categories
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: () => console.error('Не вдалося завантажити категорії')
    });
  }

  // Load tasks according to filters and page
  loadTasks(): void {
    this.isTasksLoading.set(true);
    this.taskService.getTasks(
      this.currentPage(),
      this.pageSize(),
      this.selectedStatus(),
      this.selectedCategoryId(),
      this.searchQuery()
    ).subscribe({
      next: (data: TaskPagedResult) => {
        this.tasks.set(data.items);
        this.totalTasksCount.set(data.totalCount);
        this.isTasksLoading.set(false);
      },
      error: () => {
        this.isTasksLoading.set(false);
        console.error('Не вдалося завантажити завдання');
      }
    });
  }

  // Load statistics using lightweight calls
  loadStats(): void {
    this.isStatsLoading.set(true);
    forkJoin({
      all: this.taskService.getTasks(1, 1),
      completed: this.taskService.getTasks(1, 1, true)
    }).subscribe({
      next: (res) => {
        this.statTotal.set(res.all.totalCount);
        this.statCompleted.set(res.completed.totalCount);
        this.isStatsLoading.set(false);
      },
      error: () => {
        this.isStatsLoading.set(false);
        console.error('Не вдалося оновити статистику');
      }
    });
  }

  // Refresh both tasks list and statistics
  refreshDashboard(): void {
    this.loadTasks();
    this.loadStats();
  }

  // Filter handlers
  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.currentPage.set(1);
    this.loadTasks();
  }

  onCategorySelect(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
    this.currentPage.set(1);
    this.loadTasks();
  }

  onStatusSelect(status: boolean | null): void {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
    this.loadTasks();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadTasks();
  }

  // Task Completion quick toggle
  toggleTaskCompletion(task: Task): void {
    const updatedModel = {
      title: task.title,
      description: task.description,
      isCompleted: !task.isCompleted,
      dueDate: task.dueDate,
      categoryId: task.category?.id || null
    };

    this.taskService.updateTask(task.id, updatedModel).subscribe({
      next: () => {
        this.refreshDashboard();
      },
      error: () => console.error('Не вдалося оновити статус завдання')
    });
  }

  // Task Modal controls
  openCreateTaskModal(): void {
    this.editingTaskId.set(null);
    this.taskForm.reset({
      title: '',
      description: '',
      dueDate: '',
      categoryId: ''
    });
    this.isTaskModalOpen.set(true);
  }

  openEditTaskModal(task: Task): void {
    this.editingTaskId.set(task.id);
    let dateStr = '';
    if (task.dueDate) {
      // Convert ISO string to YYYY-MM-DD for the input type=date
      dateStr = new Date(task.dueDate).toISOString().substring(0, 10);
    }

    this.taskForm.reset({
      title: task.title,
      description: task.description,
      dueDate: dateStr,
      categoryId: task.category?.id ? task.category.id.toString() : ''
    });
    this.isTaskModalOpen.set(true);
  }

  closeTaskModal(): void {
    this.isTaskModalOpen.set(false);
  }

  saveTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formVal = this.taskForm.value;
    const catId = formVal.categoryId ? parseInt(formVal.categoryId, 10) : null;
    const dueDateVal = formVal.dueDate ? new Date(formVal.dueDate).toISOString() : undefined;

    if (this.editingTaskId()) {
      // Update task
      const taskId = this.editingTaskId()!;
      // We need to keep the completed state as it is currently, or if we edit we fetch it first
      const currentTask = this.tasks().find(t => t.id === taskId);
      const isCompleted = currentTask ? currentTask.isCompleted : false;

      const model = {
        title: formVal.title!,
        description: formVal.description || '',
        isCompleted,
        dueDate: dueDateVal,
        categoryId: catId
      };

      this.taskService.updateTask(taskId, model).subscribe({
        next: () => {
          this.closeTaskModal();
          this.refreshDashboard();
        },
        error: () => console.error('Не вдалося оновити завдання')
      });
    } else {
      // Create task
      const model = {
        title: formVal.title!,
        description: formVal.description || '',
        dueDate: dueDateVal,
        categoryId: catId
      };

      this.taskService.createTask(model).subscribe({
        next: () => {
          this.closeTaskModal();
          this.refreshDashboard();
        },
        error: () => console.error('Не вдалося створити завдання')
      });
    }
  }

  deleteTask(id: number): void {
    if (confirm('Ви впевнені, що хочете видалити це завдання?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.refreshDashboard();
        },
        error: () => console.error('Не вдалося видалити завдання')
      });
    }
  }

  // Category management inline actions
  createCategory(): void {
    const name = this.newCategoryName().trim();
    if (!name) return;

    this.categoryError.set(null);
    this.categoryService.createCategory({ name }).subscribe({
      next: () => {
        this.newCategoryName.set('');
        this.isAddingCategory.set(false);
        this.loadCategories();
      },
      error: (err) => {
        if (err.error?.message) {
          this.categoryError.set(err.error.message);
        } else {
          this.categoryError.set('Не вдалося створити категорію. Можливо, вона вже існує.');
        }
      }
    });
  }

  deleteCategory(id: number, event: Event): void {
    event.stopPropagation(); // Prevent category filter triggering
    if (confirm('При видаленні категорії всі завдання в ній залишаться, але втратять цю категорію. Продовжити?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          // If the deleted category was selected, reset filter
          if (this.selectedCategoryId() === id) {
            this.selectedCategoryId.set(null);
          }
          this.loadCategories();
          this.refreshDashboard();
        },
        error: () => console.error('Не вдалося видалити категорію')
      });
    }
  }

  // Math helper
  MathCeil(val: number): number {
    return Math.ceil(val);
  }

  logout(): void {
    this.authService.logout();
  }
}
