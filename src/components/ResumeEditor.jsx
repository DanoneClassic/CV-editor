'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Download, Palette, Wand2 } from 'lucide-react';

// Импорт констант и утилит
import { 
  SECTION_TYPES, 
  AI_SUGGESTIONS, 
  COLOR_THEMES,
  DEFAULT_PERSONAL_INFO,
  DEFAULT_THEME,
  DEFAULT_SECTION,
  CSS_CLASSES,
  STORAGE_KEYS
} from '../constants/resumeConstants';

import { 
  storage, 
  getEmptyData, 
  validateSection, 
  generateId, 
  dragUtils,
  calculateCompleteness,
  debounce
} from '../utils/resumeUtils';

const ResumeEditor = () => {
  // Состояние приложения
  const [sections, setSections] = useState([DEFAULT_SECTION]);
  const [personalInfo, setPersonalInfo] = useState(DEFAULT_PERSONAL_INFO);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  
  // UI состояние
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Загрузка данных при монтировании
  useEffect(() => {
    const savedData = storage.load(STORAGE_KEYS.RESUME_DATA);
    if (savedData) {
      setSections(savedData.sections || [DEFAULT_SECTION]);
      setPersonalInfo(savedData.personalInfo || DEFAULT_PERSONAL_INFO);
      setTheme(savedData.theme || DEFAULT_THEME);
    }
  }, []);

  // Автосохранение с дебаунсом
  const debouncedSave = useCallback(
    debounce((data) => {
      storage.save(STORAGE_KEYS.RESUME_DATA, data);
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedSave({ sections, personalInfo, theme });
  }, [sections, personalInfo, theme, debouncedSave]);

  // Обработчики секций
  const addSection = useCallback((type) => {
    const newSection = {
      id: generateId(),
      type,
      data: getEmptyData(type)
    };
    setSections(prev => [...prev, newSection]);
    setShowSectionDropdown(false);
  }, []);

  const removeSection = useCallback((id) => {
    setSections(prev => prev.filter(section => section.id !== id));
  }, []);

  const updateSection = useCallback((id, newData) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, data: { ...section.data, ...newData } } : section
    ));
  }, []);

  const applyAISuggestion = useCallback((id, type) => {
    const suggestion = AI_SUGGESTIONS[type];
    if (suggestion) {
      updateSection(id, suggestion);
    }
  }, [updateSection]);

  // Drag & Drop обработчики
  const handleDragStart = useCallback((e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }

    setSections(prev => dragUtils.reorderArray(prev, draggedItem, dropIndex));
    setDraggedItem(null);
    setDragOverIndex(null);
  }, [draggedItem]);

  // Обработчики UI
  const downloadPDF = useCallback(async () => {
    try {
      // Динамический импорт html2pdf.js
      const { default: html2pdf } = await import('html2pdf.js');
      const element = document.querySelector('.resume-preview');
      
      if (!element) {
        alert('Элемент для экспорта не найден');
        return;
      }

      const opt = {
        margin: 0.5,
        filename: `resume_${personalInfo.name || 'user'}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Ошибка при экспорте в PDF:', error);
      alert('** Скачивание файла **');
    }
  }, [personalInfo.name]);

  // Рендер формы секции
  const renderSectionForm = useCallback((section) => {
    const { id, type, data } = section;

    switch (type) {
      case 'experience':
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Должность"
              value={data.position || ''}
              onChange={(e) => updateSection(id, { position: e.target.value })}
              className={CSS_CLASSES.input}
            />
            <input
              type="text"
              placeholder="Компания"
              value={data.company || ''}
              onChange={(e) => updateSection(id, { company: e.target.value })}
              className={CSS_CLASSES.input}
            />
            <input
              type="text"
              placeholder="Период работы"
              value={data.period || ''}
              onChange={(e) => updateSection(id, { period: e.target.value })}
              className={CSS_CLASSES.input}
            />
            <textarea
              placeholder="Описание обязанностей"
              value={data.description || ''}
              onChange={(e) => updateSection(id, { description: e.target.value })}
              className={`${CSS_CLASSES.textarea} h-20`}
            />
          </div>
        );

      case 'education':
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Учебное заведение"
              value={data.institution || ''}
              onChange={(e) => updateSection(id, { institution: e.target.value })}
              className={CSS_CLASSES.input}
            />
            <input
              type="text"
              placeholder="Специальность/Степень"
              value={data.degree || ''}
              onChange={(e) => updateSection(id, { degree: e.target.value })}
              className={CSS_CLASSES.input}
            />
            <input
              type="text"
              placeholder="Период обучения"
              value={data.period || ''}
              onChange={(e) => updateSection(id, { period: e.target.value })}
              className={CSS_CLASSES.input}
            />
          </div>
        );

      case 'skills':
        return (
          <div>
            <textarea
              placeholder="Навыки (каждый с новой строки)"
              value={(data.skills || []).join('\n')}
              onChange={(e) => updateSection(id, { skills: e.target.value.split('\n').filter(s => s.trim()) })}
              className={`${CSS_CLASSES.textarea} h-20`}
            />
          </div>
        );

      case 'certificates':
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Название сертификата"
              value={data.name || ''}
              onChange={(e) => updateSection(id, { name: e.target.value })}
              className={CSS_CLASSES.input}
            />
            <input
              type="text"
              placeholder="Организация"
              value={data.issuer || ''}
              onChange={(e) => updateSection(id, { issuer: e.target.value })}
              className={CSS_CLASSES.input}
            />
            <input
              type="text"
              placeholder="Дата получения"
              value={data.date || ''}
              onChange={(e) => updateSection(id, { date: e.target.value })}
              className={CSS_CLASSES.input}
            />
          </div>
        );

      case 'about':
        return (
          <textarea
            placeholder="Расскажите о себе"
            value={data.description || ''}
            onChange={(e) => updateSection(id, { description: e.target.value })}
            className={`${CSS_CLASSES.textarea} h-24`}
          />
        );

      default:
        return <div>Неизвестный тип секции</div>;
    }
  }, [updateSection]);

  // Рендер превью секции
  const renderSectionPreview = useCallback((section) => {
    const { type, data } = section;

    if (!validateSection(section)) return null;

    switch (type) {
      case 'experience':
        return (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">{data.position}</h3>
            <div className="text-sm text-gray-600 mb-1">
              {data.company} {data.period && `• ${data.period}`}
            </div>
            {data.description && (
              <p className="text-sm text-gray-700 leading-relaxed">{data.description}</p>
            )}
          </div>
        );

      case 'education':
        return (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">{data.degree}</h3>
            <div className="text-sm text-gray-600">
              {data.institution} {data.period && `• ${data.period}`}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );

      case 'certificates':
        return (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">{data.name}</h3>
            <div className="text-sm text-gray-600">
              {data.issuer} {data.date && `• ${data.date}`}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">{data.description}</p>
          </div>
        );

      default:
        return null;
    }
  }, []);

  // Подсчет прогресса заполнения
  const completeness = calculateCompleteness(personalInfo, sections);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок с прогрессом */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-2xl font-bold text-gray-900">Редактор резюме</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowThemePanel(!showThemePanel)}
                className={CSS_CLASSES.button.purple}
              >
                <Palette size={16} />
                Тема
              </button>
              <button
                onClick={downloadPDF}
                className={CSS_CLASSES.button.success}
              >
                <Download size={16} />
                Скачать PDF
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                  className={CSS_CLASSES.button.primary}
                >
                  <Plus size={16} />
                  Добавить секцию
                </button>
                
                {showSectionDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                    {Object.entries(SECTION_TYPES).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => addSection(key)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Прогресс заполнения */}
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Заполнение резюме</span>
              <span className="text-sm font-medium text-gray-900">{completeness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>

        {/* Панель тем */}
        {showThemePanel && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
            <h3 className="font-medium mb-3">Выберите цветовую схему</h3>
            <div className="flex gap-3 flex-wrap">
              {COLOR_THEMES.map((themeOption) => (
                <button
                  key={themeOption.color}
                  onClick={() => setTheme({ ...theme, primaryColor: themeOption.color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    theme.primaryColor === themeOption.color ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: themeOption.color }}
                  title={themeOption.name}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Левый блок - Редактор */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Редактирование</h2>
            
            {/* Личная информация */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Личная информация</h3>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Имя Фамилия"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                  className={CSS_CLASSES.input}
                />
                <input
                  type="text"
                  placeholder="Должность"
                  value={personalInfo.title}
                  onChange={(e) => setPersonalInfo({...personalInfo, title: e.target.value})}
                  className={CSS_CLASSES.input}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    placeholder="Email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                    className={CSS_CLASSES.input}
                  />
                  <input
                    type="text"
                    placeholder="Телефон"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                    className={CSS_CLASSES.input}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Местоположение"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                  className={CSS_CLASSES.input}
                />
              </div>
            </div>

            {/* Секции */}
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`${CSS_CLASSES.section} ${
                    dragOverIndex === index ? CSS_CLASSES.sectionDragging : CSS_CLASSES.sectionNormal
                  } ${draggedItem === index ? 'opacity-50' : 'opacity-100'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="cursor-grab active:cursor-grabbing">
                        <GripVertical size={16} className="text-gray-400" />
                      </div>
                      <h3 className="font-medium">{SECTION_TYPES[section.type]}</h3>
                      {!validateSection(section) && (
                        <span className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded">
                          Не заполнено
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => applyAISuggestion(section.id, section.type)}
                        className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        title="AI подсказка"
                      >
                        <Wand2 size={14} />
                      </button>
                      <button
                        onClick={() => removeSection(section.id)}
                        className={CSS_CLASSES.button.danger}
                        title="Удалить секцию"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {renderSectionForm(section)}
                </div>
              ))}
            </div>
          </div>

          {/* Правый блок - Превью */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Превью резюме</h2>
            
            <div 
              className="resume-preview bg-white border shadow-md rounded-lg p-6 max-w-full overflow-hidden" 
              style={{ fontFamily: theme.fontFamily }}
            >
              {/* Заголовок резюме */}
              <div className="border-b pb-4 mb-6" style={{ borderColor: theme.primaryColor }}>
                <h1 className="text-2xl font-bold text-gray-900 mb-1 break-words">
                  {personalInfo.name || 'Ваше имя'}
                </h1>
                <p className="text-lg font-medium mb-2 break-words" style={{ color: theme.primaryColor }}>
                  {personalInfo.title || 'Должность'}
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  {personalInfo.email && <div className="break-words">{personalInfo.email}</div>}
                  {personalInfo.phone && <div>{personalInfo.phone}</div>}
                  {personalInfo.location && <div>{personalInfo.location}</div>}
                </div>
              </div>

              {/* Секции резюме */}
              {sections.map((section) => {
                const preview = renderSectionPreview(section);
                if (!preview) return null;
                
                return (
                  <div key={section.id} className="mb-6">
                    <h2 className="text-lg font-semibold mb-3 pb-1 border-b" style={{ color: theme.primaryColor }}>
                      {SECTION_TYPES[section.type]}
                    </h2>
                    {preview}
                  </div>
                );
              })}
              
              {sections.every(section => !renderSectionPreview(section)) && (
                <div className="text-center text-gray-500 py-8">
                  <div className="mb-2">📝</div>
                  <div>Добавьте и заполните секции для отображения резюме</div>
                </div>
              )}
            </div>

            {/* Дополнительная информация */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
              <div className="flex justify-between items-center">
                <span>Секций заполнено: {sections.filter(validateSection).length} из {sections.length}</span>
                <span>Автосохранение включено</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;