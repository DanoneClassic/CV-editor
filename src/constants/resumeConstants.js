export const SECTION_TYPES = {
  experience: 'Опыт работы',
  education: 'Образование', 
  skills: 'Навыки',
  certificates: 'Сертификаты',
  about: 'О себе'
};

// Моковые данные для AI подсказок
export const AI_SUGGESTIONS = {
  experience: {
    position: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    period: '2022 - настоящее время',
    description: 'Разработка современных веб-приложений с использованием React, TypeScript и Next.js. Руководство командой из 4 разработчиков, внедрение best practices и code review процессов.'
  },
  education: {
    institution: 'Московский государственный университет',
    degree: 'Бакалавр компьютерных наук',
    period: '2018 - 2022'
  },
  skills: {
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker']
  },
  certificates: {
    name: 'AWS Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2023'
  },
  about: {
    description: 'Опытный frontend разработчик с 5+ годами опыта создания масштабируемых веб-приложений. Специализируюсь на React экосистеме и современных инструментах разработки.'
  }
};

// Цветовые темы
export const COLOR_THEMES = [
  { name: 'Синий', color: '#2563eb' },
  { name: 'Зеленый', color: '#16a34a' },
  { name: 'Фиолетовый', color: '#7c3aed' },
  { name: 'Красный', color: '#dc2626' },
  { name: 'Оранжевый', color: '#ea580c' },
  { name: 'Индиго', color: '#4f46e5' },
  { name: 'Розовый', color: '#ec4899' },
  { name: 'Темно-серый', color: '#374151' }
];

// Дефолтные значения для состояния
export const DEFAULT_PERSONAL_INFO = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: ''
};

export const DEFAULT_THEME = {
  primaryColor: '#2563eb',
  fontFamily: 'Inter'
};

export const DEFAULT_SECTION = {
  id: '1',
  type: 'about',
  data: { description: '' }
};

// Типы полей для валидации
export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  TEXTAREA: 'textarea',
  ARRAY: 'array'
};

// Конфигурация секций для формы
export const SECTION_CONFIG = {
  experience: {
    fields: [
      { name: 'position', placeholder: 'Должность', type: FIELD_TYPES.TEXT, required: true },
      { name: 'company', placeholder: 'Компания', type: FIELD_TYPES.TEXT, required: true },
      { name: 'period', placeholder: 'Период работы', type: FIELD_TYPES.TEXT },
      { name: 'description', placeholder: 'Описание обязанностей', type: FIELD_TYPES.TEXTAREA, rows: 4 }
    ]
  },
  education: {
    fields: [
      { name: 'institution', placeholder: 'Учебное заведение', type: FIELD_TYPES.TEXT, required: true },
      { name: 'degree', placeholder: 'Специальность/Степень', type: FIELD_TYPES.TEXT, required: true },
      { name: 'period', placeholder: 'Период обучения', type: FIELD_TYPES.TEXT }
    ]
  },
  skills: {
    fields: [
      { name: 'skills', placeholder: 'Навыки (каждый с новой строки)', type: FIELD_TYPES.ARRAY, rows: 4 }
    ]
  },
  certificates: {
    fields: [
      { name: 'name', placeholder: 'Название сертификата', type: FIELD_TYPES.TEXT, required: true },
      { name: 'issuer', placeholder: 'Организация', type: FIELD_TYPES.TEXT },
      { name: 'date', placeholder: 'Дата получения', type: FIELD_TYPES.TEXT }
    ]
  },
  about: {
    fields: [
      { name: 'description', placeholder: 'Расскажите о себе', type: FIELD_TYPES.TEXTAREA, rows: 6 }
    ]
  }
};

// Локальное хранилище ключи
export const STORAGE_KEYS = {
  RESUME_DATA: 'resumeData',
  THEME: 'resumeTheme',
  PERSONAL_INFO: 'resumePersonalInfo'
};

// CSS классы для переиспользования
export const CSS_CLASSES = {
  input: 'w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
  textarea: 'w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500',
  button: {
    primary: 'flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
    secondary: 'flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors',
    success: 'flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors',
    danger: 'p-1 text-red-600 hover:bg-red-50 rounded transition-colors',
    purple: 'flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
  },
  section: 'p-4 border rounded-lg bg-white shadow-sm transition-all duration-200',
  sectionDragging: 'border-blue-500 bg-blue-50',
  sectionNormal: 'border-gray-200'
};