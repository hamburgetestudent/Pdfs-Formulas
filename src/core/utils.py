import sys
import os
import json

def get_external_path(filename):
    """ Get absolute path to resource, looking in the executable folder first """
    if getattr(sys, 'frozen', False):
        # Running as compiled exe
        base_path = os.path.dirname(sys.executable)
    else:
        # Running as script
        base_path = os.path.abspath(".")

    return os.path.join(base_path, filename)

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

def load_config():
    """ Load configuration from external JSON file """
    config_path = get_external_path(os.path.join("data", "config.json"))
    default_config = {
        "quiz_formula_fontsize": 28,
        "quiz_formula_dpi": 100,
        "quiz_formula_scale": 0.9,
        "ui_theme": "Dark",
        "ui_color_theme": "blue"
    }

    if os.path.exists(config_path):
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                external_config = json.load(f)
                default_config.update(external_config)
        except Exception as e:
            print(f"Error loading config: {e}")

    return default_config
