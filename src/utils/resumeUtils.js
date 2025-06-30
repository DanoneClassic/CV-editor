import { STORAGE_KEYS } from '../constants/resumeConstants';

// Утилиты для работы с localStorage
export const storage = {
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
    }
  },

  load: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Ошибка загрузки из localStorage:', error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Ошибка удаления из localStorage:', error);
    }
  },

  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Ошибка очистки localStorage:', error);
    }
  }
};

// Получение пустых данных для типа секции
export const getEmptyData = (type) => {
  switch (type) {
    case 'experience':
      return { position: '', company: '', period: '', description: '' };
    case 'education':
      return { institution: '', degree: '', period: '' };
    case 'skills':
      return { skills: [] };
    case 'certificates':
      return { name: '', issuer: '', date: '' };
    case 'about':
      return { description: '' };
    default:
      return {};
  }
};

// Валидация секции
export const validateSection = (section) => {
  const { type, data } = section;
  
  switch (type) {
    case 'experience':
      return data.position && data.company;
    case 'education':
      return data.institution && data.degree;
    case 'skills':
      return data.skills && data.skills.length > 0;
    case 'certificates':
      return data.name;
    case 'about':
      return data.description;
    default:
      return false;
  }
};

// Генерация уникального ID
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Утилиты для drag & drop
export const dragUtils = {
  reorderArray: (array, fromIndex, toIndex) => {
    const result = [...array];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  },

  calculateDropIndex: (draggedIndex, dropIndex) => {
    return draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
  }
};

// Форматирование данных для экспорта
export const formatResumeData = (personalInfo, sections, theme) => {
  return {
    personalInfo,
    sections: sections.filter(section => validateSection(section)),
    theme,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
};

// Валидация email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валидация телефона (простая)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Подсчет заполненности резюме (в процентах)
export const calculateCompleteness = (personalInfo, sections) => {
  const personalInfoFields = Object.values(personalInfo).filter(Boolean).length;
  const totalPersonalFields = Object.keys(personalInfo).length;
  
  const validSections = sections.filter(section => validateSection(section)).length;
  const totalSections = sections.length || 1;
  
  const personalScore = (personalInfoFields / totalPersonalFields) * 50;
  const sectionsScore = (validSections / totalSections) * 50;
  
  return Math.round(personalScore + sectionsScore);
};

// Экспорт в JSON
export const exportToJSON = (personalInfo, sections, theme) => {
  const data = formatResumeData(personalInfo, sections, theme);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `resume_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Дебаунс для автосохранения
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};