import pandas as pd
import numpy as np
import math

class ReadColumn:

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