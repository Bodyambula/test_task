export const uk = {
  common: {
    loading: 'Завантаження...',
    or: 'або',
    cancel: 'Скасувати',
    save: 'Зберегти',
    logout: 'Вийти',
    uncategorized: 'Без категорії',
    noDescription: 'Немає опису',
    noDate: 'Без дати',
    noDeadline: 'Без дедлайну',
    grid: 'Плитка',
    list: 'Список'
  },
  auth: {
    login: {
      title: 'Вхід в систему',
      welcomeBack: 'Раді бачити вас знову!',
      emailLabel: 'Email',
      emailPlaceholder: 'example@mail.com',
      emailRequired: 'Введіть email',
      emailInvalid: 'Некоректний формат email',
      passwordLabel: 'Пароль',
      passwordPlaceholder: '••••••••',
      passwordRequired: 'Введіть пароль',
      passwordMinLength: 'Пароль має містити щонайменше 6 символів',
      submit: 'Увійти',
      noAccount: 'Немає облікового запису?',
      createAccount: 'Створити акаунт',
      invalidCredentials: 'Невірний email або пароль',
      connectionError: 'Помилка підключення до сервера. Будь ласка, спробуйте пізніше.',
      showPassword: 'Показати пароль',
      hidePassword: 'Приховати пароль'
    },
    register: {
      title: 'Реєстрація',
      subtitle: 'Створіть свій безкоштовний акаунт',
      nameLabel: "Ім'я",
      namePlaceholder: "Ваше ім'я",
      nameRequired: "Введіть ім'я",
      nameMaxLength: "Ім'я не може бути довшим за 50 символів",
      passwordMismatch: 'Паролі не збігаються',
      confirmPasswordLabel: 'Підтвердження паролю',
      confirmPasswordPlaceholder: '••••••••',
      confirmPasswordRequired: 'Підтвердіть пароль',
      passwordMaxLength: 'Пароль має бути не довшим за 100 символів',
      submit: 'Зареєструватися',
      hasAccount: 'Вже маєте акаунт?',
      signIn: 'Увійти',
      userExists: 'Користувач з таким Email вже існує або дані некоректні',
      registrationError: 'Помилка реєстрації. Спробуйте пізніше.',
      success: 'Реєстрація успішна! Перенаправлення до входу...'
    }
  },
  dashboard: {
    title: 'Панель завдань',
    welcome: 'Привіт, {{userName}}! Управляйте своїми щоденними справами.',
    newTask: 'Нове завдання',
    theme: {
      dark: 'Увімкнути темну тему',
      light: 'Увімкнути світлу тему'
    },
    categories: {
      title: 'Категорії',
      addBtn: 'Додати категорію',
      placeholder: 'Назва категорії',
      all: 'Всі категорії',
      deleteTitle: 'Видалити категорію',
      confirmDelete: 'При видаленні категорії всі завдання в ній залишаться, але втратять цю категорію. Продовжити?',
      errorLoad: 'Не вдалося завантажити категорії',
      errorCreate: 'Не вдалося створити категорію. Можливо, вона вже існує.',
      errorDelete: 'Не вдалося видалити категорію'
    },
    filters: {
      searchPlaceholder: 'Пошук завдань за назвою...',
      all: 'Всі',
      active: 'Активні',
      completed: 'Виконані'
    },
    list: {
      loading: 'Оновлення списку завдань...',
      emptyTitle: 'Завдань не знайдено',
      emptyDesc: 'Немає жодного завдання, яке б відповідало обраним фільтрам. Створіть нове завдання, щоб почати.',
      createBtn: 'Створити завдання',
      confirmDeleteTask: 'Ви впевнені, що хочете видалити це завдання?',
      editTask: 'Редагувати завдання',
      deleteTask: 'Видалити завдання',
      errorLoadTasks: 'Не вдалося завантажити завдання',
      errorUpdateStatus: 'Не вдалося оновити статус завдання',
      errorUpdateTask: 'Не вдалося оновити завдання',
      errorCreateTask: 'Не вдалося створити завдання',
      errorDeleteTask: 'Не вдалося видалити завдання'
    },
    table: {
      status: 'Статус',
      task: 'Завдання',
      description: 'Опис',
      category: 'Категорія',
      deadline: 'Дедлайн',
      actions: 'Дії'
    },
    modal: {
      createTitle: 'Створити нове завдання',
      editTitle: 'Редагувати завдання',
      titleLabel: 'Назва завдання',
      titlePlaceholder: "Наприклад: Пройти технічне інтерв'ю",
      titleRequired: "Назва завдання є обов'язковою",
      titleMaxLength: 'Назва не може бути довшою за 100 символів',
      descLabel: 'Опис завдання',
      descPlaceholder: 'Деталі завдання...',
      descMaxLength: 'Опис не може бути довшим за 500 символів',
      categoryLabel: 'Категорія',
      dateLabel: 'Виконати до',
      descModalTitle: 'Опис завдання'
    },
    pagination: {
      showing: 'Показано {{count}} з {{total}} завдань',
      page: 'Сторінка {{current}} з {{total}}'
    }
  }
};
