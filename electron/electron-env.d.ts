/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string;
    VITE_PUBLIC: string;
  }
}

// Extender IpcRenderer para agregar métodos personalizados
interface CustomIpcRenderer extends Omit<import('electron').IpcRenderer, 'invoke'> {
  /**
   * Obtiene la lista de impresoras disponibles
   */
  getPrinters: () => Promise<{ name: string }[]>;
  invoke: (channel: string, ...args: any[]) => Promise<any>;

  /**
   * Envía una tarea de impresión a la impresora seleccionada
   * @param options Opciones para la impresión
   */
  print: (options: {
    deviceName: string;
    silent: boolean;
    printBackground: boolean;
    content: string;
  }) => Promise<void>;

  /**
   * Verifica si hay actualizaciones disponibles
   */
  checkForUpdates: () => void;

  /**
   * Escucha el evento cuando hay una actualización disponible
   * @param callback Función que se ejecuta cuando se detecta una actualización
   */
  onUpdateAvailable: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;

  /**
   * Escucha el evento cuando una actualización ha sido descargada
   * @param callback Función que se ejecuta cuando se descarga la actualización
   */
  onUpdateDownloaded: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
}

// Extender la interfaz Window para incluir ipcRenderer con los métodos personalizados
interface Window {
  ipcRenderer: CustomIpcRenderer;
}
