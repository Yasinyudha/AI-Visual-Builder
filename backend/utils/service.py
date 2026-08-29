import pandas as pd
import numpy as np
import os
import math
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.preprocessing import MinMaxScaler, RobustScaler, OrdinalEncoder

class MachineLearningProcessing:
    @staticmethod
    def perform_linear_regression(filePath: str, selectedFeatures: list[str], selectedLabels: list[str], isDropna: bool, splitRatio: float):
        df = pd.read_csv(filePath)

        if isDropna:
            df.dropna(inplace=True)

        X = df[selectedFeatures]
        y = df[selectedLabels]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, train_size=splitRatio, random_state=42
        )

        model = LinearRegression()
        model.fit(X_train, y_train)

        preds = model.predict(X_test)

        return {
            "r2Score": float(r2_score(y_test, preds)),
            "mae": float(mean_absolute_error(y_test, preds)),
            "rmse": float(np.sqrt(mean_squared_error(y_test, preds)))
        }

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

        # 5. Capture post-processed total rows and active column names
        total_rows = len(df)
        final_columns = df.columns.tolist()

        # 6. Format into List of Dicts by Column
        df_all = df.replace([np.inf, -np.inf], np.nan)
        
        data = []
        for col in final_columns:
            raw_values = df_all[col].tolist()
            
            # Sanitize NaNs and Infs to None (null in JSON)
            cleaned_values = [
                None if (isinstance(v, (float, np.floating)) and (math.isnan(v) or math.isinf(v))) or pd.isna(v) else v
                for v in raw_values
            ]
            
            data.append({col: cleaned_values})

        return {
            "columns": final_columns,
            "rows": cleaned_records,
            "total_rows": total_rows,
            "data": data
        }

    def create_histogram(
            data: list[dict[str, list]],
            column: str,
            bins: int
    ) -> list[dict[str, str]]:

        # Find the list of given column
        for individual_data in data:
            if (list(individual_data.keys())[0] == column):

                # Get data based on column
                df_numpy = np.array(individual_data.get(column))
                
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