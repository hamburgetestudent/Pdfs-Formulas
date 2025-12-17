import { app, BrowserWindow } from 'electron';
import path from 'path';

/**
 * Crea la ventana principal de la aplicación.
 * Configura el tamaño, preferencias web, estilo de la barra de título y carga la URL o archivo apropiado.
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    // Aspecto moderno
    titleBarStyle: 'hidden', 
    titleBarOverlay: {
      color: '#1e1e1e', // Coincide con el fondo del tema oscuro
      symbolColor: '#ffffff',
      height: 35
    },
    backgroundColor: '#1e1e1e',
    show: false // Esperar hasta que esté listo para mostrarse para evitar un parpadeo blanco
  });

  // Cargar URL o Archivo
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  win.once('ready-to-show', () => {
    win.show();
  });
}

/**
 * Inicializa la aplicación cuando Electron está listo.
 * Crea la ventana y gestiona la activación en macOS.
 */
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * Maneja el evento cuando todas las ventanas están cerradas.
 * Cierra la aplicación en sistemas que no sean macOS (darwin).
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
