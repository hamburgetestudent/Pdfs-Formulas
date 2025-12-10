import os
import time
import subprocess
import sys

# Archivos y extensiones a monitorear
WATCH_EXTENSIONS = ('.py', '.spec')
IGNORE_DIRS = ('dist', 'build', '__pycache__', '.git', '.gemini')

def get_file_mtimes(root_dir):
    """Obtiene un diccionario con {ruta_archivo: fecha_modificacion}"""
    mtimes = {}
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Filtrar directorios ignorados
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        
        for filename in filenames:
            if filename.endswith(WATCH_EXTENSIONS):
                filepath = os.path.join(dirpath, filename)
                try:
                    mtime = os.stat(filepath).st_mtime
                    mtimes[filepath] = mtime
                except OSError:
                    pass
    return mtimes

def build():
    """Ejecuta el script de build"""
    print("\n" + "="*50)
    print(f"[AUTO-BUILD] Detectados cambios. Reconstruyendo... ({time.strftime('%H:%M:%S')})")
    print("="*50 + "\n")
    
    # Ejecutamos build.bat pero sin el 'pause' del final para que no bloquee este script
    # Podemos llamar a pyinstaller directamente
    cmd = ["pyinstaller", "GeneradorFormulas.spec", "--clean", "--noconfirm"]
    
    try:
        subprocess.run(cmd, check=True)
        print("\n" + "="*50)
        print(f"[AUTO-BUILD] Construccion FINALIZADA con EXITO ({time.strftime('%H:%M:%S')})")
        print("Escuchando cambios...")
        print("="*50)
    except subprocess.CalledProcessError:
        print("\n" + "="*50)
        print(f"[AUTO-BUILD] ERROR en la construccion ({time.strftime('%H:%M:%S')})")
        print("="*50)
    except FileNotFoundError:
        print("[ERROR] No se encontro 'pyinstaller'. Asegurate de tenerlo instalado y en el PATH.")

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"[AUTO-BUILD] Monitoreando cambios en: {root_dir}")
    print("Presiona Ctrl+C para detener.")
    
    last_mtimes = get_file_mtimes(root_dir)
    
    try:
        while True:
            time.sleep(2) # Intervalo de chequeo
            current_mtimes = get_file_mtimes(root_dir)
            
            changed = False
            # Verificar si algun archivo fue modificado
            for filepath, mtime in current_mtimes.items():
                if filepath not in last_mtimes or mtime > last_mtimes[filepath]:
                    print(f"[CAMBIO DETECTADO] {os.path.basename(filepath)}")
                    changed = True
            
            # Verificar si se agrego algun archivo nuevo (opcional, pero util)
            if len(current_mtimes) != len(last_mtimes):
                 changed = True
            
            if changed:
                # Esperar un poco por si hay multiples guardados rapidos (debounce simple)
                time.sleep(1)
                build()
                last_mtimes = get_file_mtimes(root_dir) # Actualizar timestamps
                
    except KeyboardInterrupt:
        print("\n[AUTO-BUILD] Detenido por el usuario.")

if __name__ == "__main__":
    main()
