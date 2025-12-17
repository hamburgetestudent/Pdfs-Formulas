"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
/**
 * Crea la ventana principal de la aplicación.
 * Configura el tamaño, preferencias web, estilo de la barra de título y carga la URL o archivo apropiado.
 */
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
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
    }
    else {
        win.loadFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
    win.once('ready-to-show', () => {
        win.show();
    });
}
/**
 * Inicializa la aplicación cuando Electron está listo.
 * Crea la ventana y gestiona la activación en macOS.
 */
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
/**
 * Maneja el evento cuando todas las ventanas están cerradas.
 * Cierra la aplicación en sistemas que no sean macOS (darwin).
 */
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
