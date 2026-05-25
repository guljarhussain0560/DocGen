**Multilingual Customer Feedback Analyzer**
=============================================

**Overview**
------------

The `feedback_analyzer` module is a Python script that analyzes multilingual customer feedback from a CSV file. It uses the Sarvam API to detect language and script, translate text to English, and perform text analytics to extract sentiment, main topic, key points, and improvement areas.

**Functions/Classes**
---------------------

### `FeedbackAnalyzer` Class

```python
class FeedbackAnalyzer:
    def __init__(self, api_key: str):
        """
        Initialize the FeedbackAnalyzer instance.

        Args:
            api_key (str): Sarvam API key.
        """
        self.api_key = api_key
        self.base_url = "https://api.sarvam.ai"
        self.headers = {
            "api-subscription-key": api_key,
            "Content-Type": "application/x-www-form-urlencoded"
        }
```

*   **`detect_language` Method**
    *   **Signature:** `detect_language(self, text: str) -> Dict`
    *   **Parameters:** `text` (str) - Text to detect language and script for.
    *   **Return Value:** A dictionary containing language and script codes.
    *   **Usage Example:**
        ```python
analyzer = FeedbackAnalyzer("your_api_key")
lang_info = analyzer.detect_language("Hello, world!")
print(lang_info)  # Output: {'language_code': 'en', 'script_code': 'latn'}
```

*   **`translate_text` Method**
    *   **Signature:** `translate_text(self, text: str, source_lang: str) -> str`
    *   **Parameters:** `text` (str) - Text to translate, `source_lang` (str) - Source language code.
    *   **Return Value:** Translated text in English.
    *   **Usage Example:**
        ```python
analyzer = FeedbackAnalyzer("your_api_key")
translated_text = analyzer.translate_text("Bonjour, monde!", "fr")
print(translated_text)  # Output: "Hello, world!"
```

*   **`analyze_text` Method**
    *   **Signature:** `analyze_text(self, text: str) -> Dict`
    *   **Parameters:** `text` (str) - Text to analyze.
    *   **Return Value:** A dictionary containing analysis results.
    *   **Usage Example:**
        ```python
analyzer = FeedbackAnalyzer("your_api_key")
analysis = analyzer.analyze_text("I love this product!")
print(analysis)  # Output: {'answers': {'q001': 'positive', 'q002': 'product', ...}}
```

*   **`process_feedback` Method**
    *   **Signature:** `process_feedback(self, feedback_file: str) -> pd.DataFrame`
    *   **Parameters:** `feedback_file` (str) - Path to the CSV file containing feedback.
    *   **Return Value:** A Pandas DataFrame containing analysis results.
    *   **Usage Example:**
        ```python
analyzer = FeedbackAnalyzer("your_api_key")
results_df = analyzer.process_feedback("feedback.csv")
print(results_df.head())  # Output: Analysis results for the first few rows
```

### `main` Function

```python
def main():
    """
    Main entry point for the script.
    """
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description='Analyze multilingual customer feedback')
    parser.add_argument('--api-key', required=True, help='Sarvam API key')
    parser.add_argument('--input-file', default='dummy.csv', help='Input CSV file with feedback')
    parser.add_argument('--output-file', default='feedback_analysis.csv', help='Output CSV file for analysis results')
    args = parser.parse_args()

    # Create a FeedbackAnalyzer instance
    analyzer = FeedbackAnalyzer(args.api_key)

    try:
        # Process feedback
        results_df = analyzer.process_feedback(args.input_file)

        # Save results
        results_df.to_csv(args.output_file, index=False)

        # Print summary
        print("\nFeedback Analysis Summary:")
        print("-" * 50)
        print(f"Total feedback analyzed: {len(results_df)}")
        print("\nLanguage Distribution:")
        print(results_df['detected_language'].value_counts())
        print("\nScript Distribution:")
        print(results_df['detected_script'].value_counts())
        print("\nSentiment Distribution:")
        print(results_df['sentiment'].value_counts())
        print("\nTop Main Topics:")
        print(results_df['main_topic'].value_counts().head())
        print("\nCommon Improvement Areas:")
        print(results_df['improvement_areas'].value_counts().head())

    except Exception as e:
        print(f"Error processing feedback: {str(e)}")
```

**Dependencies**
----------------

*   `argparse` - For parsing command-line arguments.
*   `csv` - For reading CSV files.
*   `json` - For working with JSON data.
*   `requests` - For making HTTP requests to the Sarvam API.
*   `pandas` - For data manipulation and analysis.
*   `typing` - For type hints.

**Usage Examples**
------------------

1.  **Analyzing Feedback from a CSV File**

    ```python
analyzer = FeedbackAnalyzer("your_api_key")
results_df = analyzer.process_feedback("feedback.csv")
print(results_df.head())  # Output: Analysis results for the first few rows
```

2.  **Saving Analysis Results to a CSV File**

    ```python
analyzer = FeedbackAnalyzer("your_api_key")
results_df = analyzer.process_feedback("feedback.csv")
results_df.to_csv("feedback_analysis.csv", index=False)
```

**Edge Cases & Warnings**
-------------------------

*   **API Key**: Make sure to replace `"your_api_key"` with your actual Sarvam API key.
*   **CSV File**: Ensure the CSV file contains a column named `feedback` with the text to analyze.
*   **Error Handling**: The script catches and prints any exceptions that occur during processing. Be sure to handle errors properly in your production environment.
*   **Data Manipulation**: The script uses Pandas for data manipulation and analysis. Be aware of the potential performance implications of using Pandas with large datasets.