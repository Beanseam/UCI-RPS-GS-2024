import pandas as pd

def clean_altitude_data(input_file, output_file, altitude_column='altitude', threshold=0.1, window_size=10, buffer=10):
    # Read the CSV file
    df = pd.read_csv(input_file)
    
    # Compute rolling mean difference over the window size
    df['alt_diff'] = df[altitude_column].diff().rolling(window=window_size).sum()
    
    # Identify where significant altitude increase starts
    increasing = df['alt_diff'] > threshold
    start_idx = increasing.idxmax()
    
    # Identify where significant altitude decrease stops
    decreasing = df[altitude_column].diff().rolling(window=window_size).sum() < -threshold
    stop_idx = decreasing[::-1].idxmax()
    
    # Add buffer before and after
    start_idx = max(0, start_idx - buffer)
    stop_idx = min(len(df), stop_idx + buffer)
    
    # Keep only the relevant section
    df_cleaned = df.iloc[start_idx:stop_idx].drop(columns=['alt_diff'])
    
    # Save to output file
    df_cleaned.to_csv(output_file, index=False)
    
    print(f'Cleaned data saved to {output_file}')

# How to Use in Terminal:
# import clean_csv
# clean_csv.clean_altitude_data('input.csv', 'output.csv')
# OR
# assign input_file anmd output_file to the path of the input and output files
