"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
/**
 * Expone APIs seguras desde el proceso principal al proceso de renderizado.
 * Utiliza contextBridge para asegurar el aislamiento de contexto.
 */
electron_1.contextBridge.exposeInMainWorld('electron', {
// Agregar APIs de comunicación con el backend aquí
});
