import pandas as pd
import numpy as np
import os
import math
from sklearn.preprocessing import MinMaxScaler, RobustScaler, OrdinalEncoder

class Processing:
    @staticmethod
    def read_column(path: str) -> list[str]:
        table = pd.read_csv(path)
        return table.columns.to_list()

    @staticmethod
    def read_table_content(path: str, limit: int = 5) -> dict[str, any]:
        df = pd.read_csv(path)
        
        df_limited = df.head(limit)
        df_limited = df_limited.replace([np.inf, -np.inf], np.nan)
        
        records = df_limited.to_dict(orient='records')
        
        # Clean every single dictionary to sanitize floats for standard JSON
        cleaned_records = []
        for row in records:
            cleaned_row = {}

            for key, val in row.items():
                if isinstance(val, float) and (math.isnan(val) or math.isinf(val)):
                    cleaned_row[key] = None

                elif pd.isna(val):
                    cleaned_row[key] = None

                else:
                    cleaned_row[key] = val
            cleaned_records.append(cleaned_row)

        return {
            "columns": df.columns.tolist(),
            "rows": cleaned_records,
            "total_rows": len(df)
        }

    @staticmethod
    def read_table_after_processed(
        path: str, 
        selectedFeatures: list,
        selectedLabels: list,
        isDropna: bool = False,
        normalizingMethod: str = None,
        encodingMethod: str = None,
        limit: int = 5,
    ) -> dict[str, any]:
        df = pd.read_csv(path)
        
        # 1. Column Selection (Combine features & labels without duplicates)
        all_selected = (selectedFeatures or []) + (selectedLabels or [])
        selected_columns = list(dict.fromkeys(all_selected))

        if not selected_columns:
            selected_columns = df.columns.tolist()

        df = df[selected_columns].copy()

        # 2. Handle Drop NaN
        if isDropna:
            df = df.dropna()

        # 3. Handle Categorical Encoding
        if encodingMethod:
            categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
            
            if categorical_cols:
                if encodingMethod in ['One-Hot', 'One-Hot Encoding']:
                    df = pd.get_dummies(df, columns=categorical_cols, dtype=int)
                    
                elif encodingMethod in ['Ordinal Encoder', 'Ordinal Encoding']:
                    encoder = OrdinalEncoder()
                    df[categorical_cols] = encoder.fit_transform(df[categorical_cols])

        # 4. Handle Normalization / Scaling
        if normalizingMethod:
            numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
            
            if numeric_cols:
                if normalizingMethod == 'MinMax Scaler':
                    scaler = MinMaxScaler()
                    df[numeric_cols] = scaler.fit_transform(df[numeric_cols])
                    
                elif normalizingMethod == 'Robust Scaler':
                    scaler = RobustScaler()
                    df[numeric_cols] = scaler.fit_transform(df[numeric_cols])

        # 5. Capture post-processed statistics and columns
        total_rows = len(df)
        final_columns = df.columns.tolist()  # Updated list (One-Hot expands columns)

        # 6. Sanitize NaN/Inf for JSON response
        df_limited = df.head(limit).replace([np.inf, -np.inf], np.nan)
        records = df_limited.to_dict(orient='records')
        
        cleaned_records = []
        for row in records:
            cleaned_row = {}
            for key, val in row.items():
                if isinstance(val, (float, np.floating)) and (math.isnan(val) or math.isinf(val)):
                    cleaned_row[key] = None
                elif pd.isna(val):
                    cleaned_row[key] = None
                else:
                    cleaned_row[key] = val
            cleaned_records.append(cleaned_row)

        return {
            "columns": final_columns,
            "rows": cleaned_records,
            "total_rows": total_rows
        }

    def create_histogram(
            path: str,
            column: str,
            bins: int
    ) -> list[dict[str, str]]:

        # Get data based on column and selected path
        df = pd.read_csv(path)
        df_numpy = df[column].to_numpy()
        
        # Calculate equal width intervals
        counts = pd.cut(df_numpy, bins=bins).value_counts()

        # Convert to list of dictionaries
        histogram_data = [
            {
                "interval": f"{round(interval.left, 1)} - {round(interval.right, 1)}",
                "count": int(count)
            }
            for interval, count in counts.items()
        ]

        return {
            "data": histogram_data
        }

class Utility:
    @staticmethod
    def list_in_directory(path: str) -> list[str]:
        list_inside = os.listdir(path)

        # Push the individual file size
        list_size = []
        for filepath in list_inside:
            list_size.append(os.path.getsize(os.path.join(path, filepath)))

        return {
            "files": list_inside,
            "size": list_size,
        }

    @staticmethod
    def get_file_size(path: str) -> int:
        return os.path.getsize(path)