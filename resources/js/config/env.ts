// Environment configuration untuk Portfolio Website
// Konfigurasi sederhana yang kompatibel dengan browser environment

export interface AppConfig {
  apiUrl: string;
  appName: string;
  appVersion: string;
  environment: 'development' | 'production' | 'test';
  enableDebug: boolean;
}

// Configuration dengan nilai default
export const config: AppConfig = {
  apiUrl: 'http://localhost:8000/api',
  appName: 'Portfolio Database',
  appVersion: '1.0.0',
  environment: 'development',
  enableDebug: true
};

// Export individual values untuk kemudahan penggunaan
export const API_BASE_URL = config.apiUrl;
export const APP_NAME = config.appName;
export const APP_VERSION = config.appVersion;
export const IS_DEVELOPMENT = config.environment === 'development';
export const IS_PRODUCTION = config.environment === 'production';
export const ENABLE_DEBUG = config.enableDebug;

// Utility functions
export const isApiAvailable = (): boolean => {
  return Boolean(config.apiUrl);
};

export const getApiEndpoint = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${config.apiUrl}/${cleanPath}`;
};

// Log configuration hanya di development
if (IS_DEVELOPMENT && ENABLE_DEBUG) {
  console.log('🔧 Portfolio App Configuration:', {
    apiUrl: API_BASE_URL,
    appName: APP_NAME,
    version: APP_VERSION,
    environment: config.environment
  });
}

export default config;