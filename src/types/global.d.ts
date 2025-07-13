// Global type declarations for Figma plugin development

declare global {
  interface Window {
    parent: {
      postMessage: (message: any, targetOrigin: string) => void;
    };
  }
}

// Extend the console interface for Figma plugin environment
declare namespace NodeJS {
  interface Global {
    console: Console;
  }
}

export {};
