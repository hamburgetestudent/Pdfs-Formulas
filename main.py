import pandas as pd
from pdf_builder import generate_pdf
import os

def main():
    input_file = "input_data.csv"
    output_file = "fisica_formulas.pdf"
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return

    try:
        # Read the CSV file
        # Using encoding='utf-8' and semicolon separator based on our created file
        df = pd.read_csv(input_file, sep=';', encoding='utf-8')
        
        print("Data loaded successfully.")
        print(df.head())
        
        # Generate PDF
        generate_pdf(df, output_file)
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
