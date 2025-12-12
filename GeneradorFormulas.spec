# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import collect_all
import os

datas_ctk, binaries_ctk, hiddenimports_ctk = collect_all('customtkinter')

# Removed aggressive collect_all('matplotlib') which causes test data issues
# PyInstaller hooks for matplotlib should handle standard usage fine.

datas = datas_ctk
binaries = binaries_ctk
hiddenimports = hiddenimports_ctk

a = Analysis(
    ['src/main.py'],
    pathex=[],
    binaries=binaries,
    datas=datas + [('data', 'data')],
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    # Exclude unnecessary accumulation of tests and Qt bindings
    excludes=['matplotlib.tests', 'numpy.random._examples', 'PyQt5', 'PySide2', 'PySide6', 'AppKit'],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name=f"GeneradorFormulas_{os.environ.get('EXE_SUFFIX', 'v2')}",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    version='file_version_info.txt',
)
