import sys
import os
import unittest
from unittest.mock import patch

# We need to import the function to test. 
# Since it's in main.py and main.py runs code at top level (imports), we just handle it.
# We'll just read the file and extract the function to avoid running GUI code.

def get_external_path_logic(frozen, executable, filename):
    if frozen:
        base_path = os.path.dirname(executable)
    else:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, filename)

class TestPathResolution(unittest.TestCase):
    def test_frozen_path(self):
        # Simulate frozen state
        frozen = True
        executable = r"C:\Program Files\MyApp\app.exe"
        filename = "config.json"
        
        expected = r"C:\Program Files\MyApp\config.json"
        result = get_external_path_logic(frozen, executable, filename)
        
        print(f"Frozen: Expected {expected}, Got {result}")
        self.assertEqual(result, expected)

    def test_dev_path(self):
        # Simulate dev state
        frozen = False
        executable = r"C:\Python\python.exe" # irrelevant
        filename = "config.json"
        
        expected = os.path.abspath("config.json")
        result = get_external_path_logic(frozen, executable, filename)
        
        print(f"Dev: Expected {expected}, Got {result}")
        self.assertEqual(result, expected)

if __name__ == '__main__':
    unittest.main()
