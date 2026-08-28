import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

def create_histogram(data: np.array, bins: int):
    # Calculate equal width intervals
    counts = pd.cut(data, bins=bins).value_counts(sort=False)

    # Convert to list of dictionaries
    histogram_data = [
        {
            "interval": f"{round(interval.left, 1)} - {round(interval.right, 1)}",
            "count": int(count)
        }
        for interval, count in counts.items()
    ]

    return histogram_data

create_histogram(
    data = np.random.normal(loc=100, scale=15, size=10)
)