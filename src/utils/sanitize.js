// Простая очистка текста - удаляем ВСЕ HTML теги и опасные символы
export const sanitizeText = (input) => {
  if (!input) return '';
  
  let clean = String(input);
  
  // Полностью удаляем все HTML теги
  clean = clean.replace(/<[^>]*>/g, '');
  
  // Удаляем скрипты
  clean = clean.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Блокируем javascript: протокол
  clean = clean.replace(/javascript:/gi, 'blocked:');
  
  // Блокируем другие опасные протоколы
  clean = clean.replace(/(vbscript|data):/gi, 'blocked:');
  
  // Удаляем опасные символы
  const dangerousChars = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
  };
  
  clean = clean.replace(/[&<>"'`]/g, (char) => dangerousChars[char] || char);
  
  return clean.trim();
};

// Для содержимого новостей - такое же очищение, без HTML
export const sanitizeContent = (input) => {
  if (!input) return '';
  
  // Удаляем ВСЕ HTML теги
  let clean = String(input).replace(/<[^>]*>/g, '');
  
  // Дополнительная очистка от скриптов
  clean = clean.replace(/script/gi, '');
  clean = clean.replace(/on\w+/gi, '');
  
  // Экранируем опасные символы
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  
  clean = clean.replace(/[&<>"']/g, (char) => htmlEntities[char]);
  
  // Сохраняем переносы строк
  clean = clean.replace(/\n/g, '<br>');
  
  return clean;
};

// Проверка URL
export const sanitizeUrl = (url) => {
  if (!url) return '';
  
  const str = String(url).toLowerCase().trim();
  
  // Проверяем на опасные протоколы
  const dangerous = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
  
  for (const bad of dangerous) {
    if (str.startsWith(bad)) {
      return '';
    }
  }
  
  // Проверяем, что URL начинается с http:// или https:// или /
  if (!str.startsWith('http://') && !str.startsWith('https://') && !str.startsWith('/')) {
    return '';
  }
  
  return url;
};

// Валидация
export const validateInput = (text, maxLength = 1000) => {
  if (!text) return { valid: false, message: 'Поле не может быть пустым' };
  if (text.length > maxLength) return { valid: false, message: `Максимальная длина ${maxLength} символов` };
  if (text.includes('<script') || text.includes('javascript:')) {
    return { valid: false, message: 'Текст содержит запрещённые конструкции' };
  }
  return { valid: true };
};