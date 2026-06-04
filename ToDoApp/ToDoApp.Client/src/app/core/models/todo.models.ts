export interface AuthResponse {
  token: string;
  email: string;
  name: string;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface RegisterModel {
  email: string;
  password: string;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface CreateCategoryModel {
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate?: string;
  createdAt: string;
  category?: Category;
}

export interface CreateTaskModel {
  title: string;
  description?: string;
  dueDate?: string;
  categoryId?: number | null;
}

export interface UpdateTaskModel {
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  categoryId?: number | null;
}

export interface TaskPagedResult {
  items: Task[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
