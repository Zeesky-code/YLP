# src/data/preprocess.py
import re
import json
import pandas as pd
from typing import List, Dict, Any

def prepare_csv():
    df = pd.read_json("data/raw/yankari.jsonl", lines=True)
    df.to_csv("data/raw/yankari.csv", index=False)
    print("Saved yankari.csv — you can now clean this.")


def load_json_data(file_path: str) -> List[Dict[str, Any]]:
    data = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                data.append(json.loads(line))
    return data


def json_to_dataframe(data: List[Dict[str, Any]]) -> pd.DataFrame:
    df = pd.DataFrame(data)
    return df


def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""

    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def process_dataset(input_file: str, output_file: str) -> pd.DataFrame:
    df = pd.read_csv(input_file)

    if 'text' in df.columns:
        df['clean_text'] = df['text'].apply(clean_text)

    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], errors='coerce')

    # Create text features
    df['text_length'] = df['clean_text'].apply(len)
    df['word_count'] = df['clean_text'].apply(lambda x: len(x.split()))

    # Save cleaned data
    df.to_csv(output_file, index=False)
    print(f"Processed data saved to {output_file}")

    return df


if __name__ == "__main__":
    prepare_csv()
    input_file = "data/raw/yankari.csv"
    output_file = "data/processed/cleaned_data.csv"
    df = process_dataset(input_file, output_file)

    print(f"Dataset size: {len(df)}")
    print(f"Text length statistics:\n{df['text_length'].describe()}")
    if 'date' in df.columns:
        print(f"Date range: {df['date'].min()} to {df['date'].max()}")