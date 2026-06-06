export const en = {
  common: {
    loading: 'Loading...',
    or: 'or',
    cancel: 'Cancel',
    save: 'Save',
    logout: 'Log Out',
    uncategorized: 'Uncategorized',
    noDescription: 'No description',
    noDate: 'No date',
    noDeadline: 'No deadline',
    grid: 'Grid',
    list: 'List'
  },
  auth: {
    login: {
      title: 'Sign In',
      welcomeBack: 'Welcome back!',
      emailLabel: 'Email',
      emailPlaceholder: 'example@mail.com',
      emailRequired: 'Please enter email',
      emailInvalid: 'Invalid email format',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      passwordRequired: 'Please enter password',
      passwordMinLength: 'Password must be at least 6 characters long',
      submit: 'Sign In',
      noAccount: "Don't have an account?",
      createAccount: 'Create an account',
      invalidCredentials: 'Invalid email or password',
      connectionError: 'Connection error. Please try again later.'
    },
    register: {
      title: 'Registration',
      subtitle: 'Create your free account',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      nameRequired: 'Please enter name',
      nameMaxLength: 'Name cannot be longer than 50 characters',
      passwordMismatch: 'Passwords do not match',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: '••••••••',
      confirmPasswordRequired: 'Please confirm password',
      passwordMaxLength: 'Password cannot exceed 100 characters',
      submit: 'Sign Up',
      hasAccount: 'Already have an account?',
      signIn: 'Sign In',
      userExists: 'User with this Email already exists or invalid data',
      registrationError: 'Registration failed. Try again later.',
      success: 'Registration successful! Redirecting to login...'
    }
  },
  dashboard: {
    title: 'Task Manager',
    welcome: 'Hello, {{userName}}! Manage your daily tasks.',
    newTask: 'New Task',
    theme: {
      dark: 'Switch to Dark Mode',
      light: 'Switch to Light Mode'
    },
    categories: {
      title: 'Categories',
      addBtn: 'Add Category',
      placeholder: 'Category name',
      all: 'All Categories',
      deleteTitle: 'Delete Category',
      confirmDelete: 'Deleting this category will keep all tasks in it but they will lose the category. Continue?',
      errorLoad: 'Failed to load categories',
      errorCreate: 'Failed to create category. It might already exist.',
      errorDelete: 'Failed to delete category'
    },
    filters: {
      searchPlaceholder: 'Search tasks by title...',
      all: 'All',
      active: 'Active',
      completed: 'Completed'
    },
    list: {
      loading: 'Updating task list...',
      emptyTitle: 'No tasks found',
      emptyDesc: 'No tasks match the selected filters. Create a new task to get started.',
      createBtn: 'Create Task',
      confirmDeleteTask: 'Are you sure you want to delete this task?',
      editTask: 'Edit Task',
      deleteTask: 'Delete Task',
      errorLoadTasks: 'Failed to load tasks',
      errorUpdateStatus: 'Failed to update task status',
      errorUpdateTask: 'Failed to update task',
      errorCreateTask: 'Failed to create task',
      errorDeleteTask: 'Failed to delete task'
    },
    table: {
      status: 'Status',
      task: 'Task',
      description: 'Description',
      category: 'Category',
      deadline: 'Deadline',
      actions: 'Actions'
    },
    modal: {
      createTitle: 'Create New Task',
      editTitle: 'Edit Task',
      titleLabel: 'Task Title',
      titlePlaceholder: 'e.g. Pass technical interview',
      titleRequired: 'Task title is required',
      titleMaxLength: 'Title cannot exceed 100 characters',
      descLabel: 'Task Description',
      descPlaceholder: 'Task details...',
      descMaxLength: 'Description cannot exceed 500 characters',
      categoryLabel: 'Category',
      dateLabel: 'Due Date',
      descModalTitle: 'Task Description'
    },
    pagination: {
      showing: 'Showing {{count}} of {{total}} tasks',
      page: 'Page {{current}} of {{total}}'
    }
  }
};
