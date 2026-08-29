import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

def get_correlation_matrix(path: str, columns: list[str]) -> dict[str, any]:
    df = pd.read_csv(path)
    df = df[columns]

    numeric_df = df.select_dtypes(include=[np.number])
    corr_matrix = numeric_df.corr().round(3)
    
    # Format for frontend grid or heatmap rendering
    return {
        "columns": numeric_df.columns.tolist(),
        "matrix": corr_matrix.to_dict()
    }

print(
    get_correlation_matrix(path='/home/yasin/Work/Personal Project/workspace/example.csv', columns=['study_time_hours', 'attendance_percent'])["matrix"]
)