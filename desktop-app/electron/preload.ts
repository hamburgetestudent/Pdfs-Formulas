import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    // Add backend communication APIs here
});
