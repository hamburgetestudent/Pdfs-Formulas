# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import collect_all
import os

datas_ctk, binaries_ctk, hiddenimports_ctk = collect_all('customtkinter')
datas_mpl, binaries_mpl, hiddenimports_mpl = collect_all('matplotlib')

datas = datas_ctk + datas_mpl
binaries = binaries_ctk + binaries_mpl
hiddenimports = hiddenimports_ctk + hiddenimports_mpl

a = Analysis(
    ['src/main.py'],
    pathex=[],
    binaries=binaries,
    datas=datas + [('data', 'data')],
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
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
