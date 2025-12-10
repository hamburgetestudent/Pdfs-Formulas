import unittest
import sys
import os
from quiz_data import QUIZ_DATA
from renderer import render_formula_to_image

class TestQuizHeadless(unittest.TestCase):
    def test_data_integrity(self):
        """Verify that quiz data is structured correctly."""
        self.assertIn("Cinemática en 2D", QUIZ_DATA)
        data = QUIZ_DATA["Cinemática en 2D"]
        self.assertTrue(len(data) > 0)
        for item in data:
            self.assertIn("concepto", item)
            self.assertIn("formula", item)
            self.assertIsInstance(item["concepto"], str)
            self.assertIsInstance(item["formula"], str)

    def test_render_formula(self):
        """Verify that formula rendering produces a buffer."""
        latex = r"\vec{F} = m\vec{a}"
        buf = render_formula_to_image(latex)
        self.assertIsNotNone(buf)
        self.assertTrue(buf.getbuffer().nbytes > 0)

if __name__ == '__main__':
    unittest.main()
