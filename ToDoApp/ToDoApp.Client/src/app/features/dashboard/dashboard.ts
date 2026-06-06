import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CategoryService } from '../../core/services/category.service';
import { TaskService } from '../../core/services/task.service';
import { Category, Task, TaskPagedResult } from '../../core/models/todo.models';
import { TranslationService } from '../../core/services/translation.service';
import { ThemeService } from '../../core/services/theme.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { TaskRowComponent } from './components/task-row/task-row.component';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { TaskDetailModalComponent } from './components/task-detail-modal/task-detail-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslatePipe, TaskCardComponent, TaskRowComponent, TaskModalComponent, TaskDetailModalComponent],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  private categoryService = inject(CategoryService);
  private taskService = inject(TaskService);
  private router = inject(Router);
  translationService = inject(TranslationService);
  themeService = inject(ThemeService);

  lang = this.translationService.currentLang;
  theme = this.themeService.currentTheme;

  // User details
  userName = computed(() => this.authService.currentUser()?.name || (this.lang() === 'uk' ? 'Користувач' : 'User'));
  userEmail = computed(() => this.authService.currentUser()?.email || '');

  // Categories and Tasks signals
  categories = signal<Category[]>([]);
  tasks = signal<Task[]>([]);
  totalTasksCount = signal<number>(0);

  // Sorting signals
  sortBy = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  sortedTasks = computed(() => {
    const items = [...this.tasks()];
    const field = this.sortBy();
    const direction = this.sortDirection();

    if (!field) {
      return items;
    }

    return items.sort((a, b) => {
      let valA: any = null;
      let valB: any = null;

      if (field === 'status') {
        valA = a.isCompleted ? 1 : 0;
        valB = b.isCompleted ? 1 : 0;
      } else if (field === 'title') {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      } else if (field === 'description') {
        valA = (a.description || '').toLowerCase();
        valB = (b.description || '').toLowerCase();
      } else if (field === 'category') {
        valA = (a.category?.name || '').toLowerCase();
        valB = (b.category?.name || '').toLowerCase();
      } else if (field === 'dueDate') {
        valA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        valB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      }

      if (valA === valB) return 0;
      if (valA === null || valA === undefined || valA === '') return 1;
      if (valB === null || valB === undefined || valB === '') return -1;
      
      const compare = valA > valB ? 1 : -1;
      return direction === 'asc' ? compare : -compare;
    });
  });

  // Filters signals
  searchQuery = signal<string>('');
  selectedCategoryId = signal<number | null>(null);
  selectedStatus = signal<boolean | null>(null); // null = all, true = completed, false = in progress
  currentPage = signal<number>(1);
  pageSize = signal<number>(6);
  totalPages = computed(() => Math.ceil(this.totalTasksCount() / this.pageSize()));

  // Modal signals
  isTaskModalOpen = signal<boolean>(false);
  editingTask = signal<Task | null>(null); // null = creating, set = editing
  viewMode = signal<'grid' | 'list'>('grid');
  selectedTaskForDesc = signal<Task | null>(null);

  // Category management inline signals
  isAddingCategory = signal<boolean>(false);
  newCategoryName = signal<string>('');
  categoryError = signal<string | null>(null);

  // Loading signals
  isTasksLoading = signal<boolean>(false);

  // Debounce timer for search
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Track-by functions for *ngFor performance
  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  trackByCategoryId(index: number, cat: Category): number {
    return cat.id;
  }

  ngOnDestroy(): void {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
  }

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
  // Refresh tasks list
  refreshDashboard(): void {
    this.loadTasks();
  }

  // Filter handlers
  toggleSort(field: string): void {
    if (this.sortBy() === field) {
      if (this.sortDirection() === 'asc') {
        this.sortDirection.set('desc');
      } else {
        this.sortBy.set(null); // Reset sorting
      }
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);

    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    this.searchDebounceTimer = setTimeout(() => {
      this.currentPage.set(1);
      this.loadTasks();
    }, 300);
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
    this.editingTask.set(null);
    this.isTaskModalOpen.set(true);
  }

  openEditTaskModal(task: Task): void {
    this.editingTask.set(task);
    this.isTaskModalOpen.set(true);
  }

  closeTaskModal(): void {
    this.isTaskModalOpen.set(false);
    this.editingTask.set(null);
  }

  onTaskSaved(): void {
    this.closeTaskModal();
    this.refreshDashboard();
  }

  openDescModal(task: Task): void {
    this.selectedTaskForDesc.set(task);
  }

  closeDescModal(): void {
    this.selectedTaskForDesc.set(null);
  }


  deleteTask(id: number): void {
    if (confirm(this.translationService.translate('dashboard.list.confirmDeleteTask'))) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.refreshDashboard();
        },
        error: () => console.error(this.translationService.translate('dashboard.list.errorDeleteTask'))
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
          this.categoryError.set(this.translationService.translate('dashboard.categories.errorCreate'));
        }
      }
    });
  }

  deleteCategory(id: number, event: Event): void {
    event.stopPropagation(); // Prevent category filter triggering
    if (confirm(this.translationService.translate('dashboard.categories.confirmDelete'))) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          // If the deleted category was selected, reset filter
          if (this.selectedCategoryId() === id) {
            this.selectedCategoryId.set(null);
          }
          this.loadCategories();
          this.refreshDashboard();
        },
        error: () => console.error(this.translationService.translate('dashboard.categories.errorDelete'))
      });
    }
  }



  logout(): void {
    this.authService.logout();
  }
}
