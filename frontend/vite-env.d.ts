/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_ENV: string;
    // 这里可以声明更多环境变量
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  