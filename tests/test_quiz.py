import unittest
import sys
import os
from quiz_data import QUIZ_DATA
from renderer import render_formula_to_image

class TestQuizHeadless(unittest.TestCase):
    def test_data_integrity(self):
        """Verify that quiz data is structured correctly with the new hierarchy."""
        # Top level check
        self.assertIn("Física", QUIZ_DATA)
        self.assertIn("Mecánica", QUIZ_DATA["Física"])

        # Topic Level check
        mechanics = QUIZ_DATA["Física"]["Mecánica"]
        self.assertIn("Cinemática en 2D", mechanics)

        topic_data = mechanics["Cinemática en 2D"]
        self.assertIn("formulas", topic_data)
        self.assertIn("questions", topic_data)

        # Check Formulas
        formulas = topic_data["formulas"]
        self.assertTrue(len(formulas) > 0)
        for item in formulas:
            self.assertIn("concepto", item)
            self.assertIn("formula", item)
            self.assertIsInstance(item["concepto"], str)
            self.assertIsInstance(item["formula"], str)

        # Check Questions
        questions = topic_data["questions"]
        self.assertTrue(len(questions) > 0)
        for item in questions:
            self.assertIn("question", item)
            self.assertIn("options", item)
            self.assertIn("correct_option", item)
            self.assertIn("difficulty", item)
            self.assertEqual(len(item["options"]), 4)

    def test_render_formula(self):
        """Verify that formula rendering produces a buffer."""
        latex = r"\vec{F} = m\vec{a}"
        buf = render_formula_to_image(latex)
        self.assertIsNotNone(buf)
        self.assertTrue(buf.getbuffer().nbytes > 0)

if __name__ == '__main__':
    unittest.main()
