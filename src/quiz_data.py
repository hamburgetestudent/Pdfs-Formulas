import json
import os
from utils import get_external_path, resource_path

def load_quiz_db():
    """
    Loads the quiz database from the JSON file.
    Tries external 'data/quiz_db.json' first, then internal resource.
    """
    # Try external file first (next to exe or in dev env)
    external_path = get_external_path(os.path.join("data", "quiz_db.json"))

    # If not found, look for it in the resources (packaged)
    # Note: 'resource_path' handles sys._MEIPASS for PyInstaller
    internal_path = resource_path(os.path.join("data", "quiz_db.json"))

    path_to_use = None
    if os.path.exists(external_path):
        path_to_use = external_path
    elif os.path.exists(internal_path):
        path_to_use = internal_path

    if path_to_use:
        try:
            with open(path_to_use, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading quiz DB from {path_to_use}: {e}")
            return {}

    return {}

QUIZ_DATA = load_quiz_db()
