export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const LEGAL_CATEGORIES = {
  criminal: {
    id: 'criminal',
    en: 'Criminal Law',
    am: 'የወንጀል ሕግ',
    om: 'Seera Cubbuu',
    icon: '⚖️',
    color: '#fee2e2'
  },
  family: {
    id: 'family',
    en: 'Family Law',
    am: 'የቤተሰብ ሕግ',
    om: 'Seera Maatii',
    icon: '👨‍👩‍👧‍👦',
    color: '#dbeafe'
  },
  labor: {
    id: 'labor',
    en: 'Labor Law',
    am: 'የሠራተኛ ሕግ',
    om: 'Seera Hojii',
    icon: '💼',
    color: '#dcfce7'
  },
  constitution: {
    id: 'constitution',
    en: 'Constitution',
    am: 'ሕገ መንግሥት',
    om: 'Heera Mootummaa',
    icon: '📜',
    color: '#fef9c3'
  }
}

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', flag: '🇪🇹' }
]

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}

export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
}

export const SEARCH_TYPES = {
  KEYWORD: 'keyword',
  NATURAL: 'natural',
  ALL: 'all'
}

export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  MAX_VISIBLE_PAGES: 5
}

export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss'
}

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  LANGUAGE: 'language',
  THEME: 'theme',
  SEARCH_HISTORY: 'searchHistory'
}

export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.'
}

export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Successfully logged out!',
  PROFILE_UPDATE: 'Profile updated successfully!',
  PASSWORD_CHANGE: 'Password changed successfully!',
  BOOKMARK_ADD: 'Article bookmarked!',
  BOOKMARK_REMOVE: 'Bookmark removed!'
}