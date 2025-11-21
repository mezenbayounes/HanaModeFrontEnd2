/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

// Type declarations for image imports
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';
declare module '*.webp';

// some global object injected by platform
declare global {
  interface Window {
    aiSdk?: Record<string, any>;
    ywConfig?: Record<string, any>;
    ywSdk?: Record<string, any>;
  }
}

export { };