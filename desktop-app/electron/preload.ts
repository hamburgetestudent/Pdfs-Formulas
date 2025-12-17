import { contextBridge } from 'electron';

/**
 * Expone APIs seguras desde el proceso principal al proceso de renderizado.
 * Utiliza contextBridge para asegurar el aislamiento de contexto.
 */
contextBridge.exposeInMainWorld('electron', {
    // Agregar APIs de comunicación con el backend aquí
});
