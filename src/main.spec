# -*- mode: python ; coding: utf-8 -*-

import pathlib,os
pypylon_dir1 = pathlib.Path('./dlls')
pypylon_dir2 = pathlib.Path('../win10dll')
pylon_dlls = [(str(dll), '.') for dll in pypylon_dir1.glob('*.dll')]+[(str(dll), '.') for dll in pypylon_dir2.glob('*.dll')]
block_cipher = pyi_crypto.PyiBlockCipher(key='12346546')
ROOT_PATH=os.path.dirname(__file__)

a = Analysis(['main.py'],
             pathex=[ROOT_PATH+'\\src'],
             binaries=pylon_dlls,
             datas=[ ('..\\frontend\\dist','frontend'), ('cfg','cfg'),('img','img'),('release_note.txt','.'),('debug_console.cmd','.'),('info','.') ],
             hiddenimports=[
                 'engineio.async_drivers.threading',
                 'pkg_resources.py2_warn',  # only with minepez-Dev env
                #  'sklearn.neighbors._typedefs', #sklearn
                #  'sklearn.utils._cython_blas',
                #  'sklearn.neighbors._quad_tree',
                #  'sklearn.tree._utils',
                #  'sklearn.tree',
                

            ],
             hookspath=['./hooks'],  
             runtime_hooks=[],
             excludes=[
                 'PyQt5',
                'sqlite3',
                'setuptools',
                'pyinstaller',
                'pyinstaller-4.10',
                'pip',
                'altgraph',
                'wheel',
                'alabaster',
                'babel',
                'docutils',
                'flask_compress',
                'flask_compress-1.5.0',
                'sphinx',
                'typed_ast'
                ],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)

if not os.environ.get("PYINSTALLER_CEFPYTHON3_HOOK_SUCCEEDED", None):
    raise SystemExit("Error: Pyinstaller hook-cefpython3.py script was not found")
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          [],
          exclude_binaries=True,
          name='My_App',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=False,
            icon='..\\frontend\\src\\assets\\favicon.ico'
           )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=True,
               upx_exclude=[],
               name='My_App')
