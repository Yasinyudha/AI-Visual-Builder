# backend/server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from utils.service import Processing, Utility

app = FastAPI()

# Allow React frontend to communicate with Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class MathInput(BaseModel):
    numA: float
    numB: float

class PathInput(BaseModel):
    path: str

class TableRequest(BaseModel):
    path: str
    limit: int = 5

class TableAfterProcessedRequest(BaseModel):
    path: str
    selectedFeatures: List[str]
    selectedLabels: List[str]
    isDropna: bool = False
    normalizingMethod: Optional[str] = None
    encodingMethod: Optional[str] = None
    limit: int = 5

class HistogramData(BaseModel):
    path: str
    column: str
    bins: int

@app.post("/api/multiply")
def multiply_numbers(data: MathInput):
    result = data.numA * data.numB
    return {"result": f"Python Output: {result}"}

@app.post("/api/read-column")
def read_column(data: PathInput):
    return {"columns": Processing.read_column(data.path)}

@app.post("/api/read-in-directory")
def list_in_directory(data: PathInput):
    return Utility.list_in_directory(data.path)

@app.post("/api/read-table")
def read_table(data: TableRequest):
    return Processing.read_table_content(data.path, data.limit)

@app.post("/api/read-processed-table")
def read_table_after_processed(data: TableAfterProcessedRequest):
    return Processing.read_table_after_processed(
        data.path, data.selectedFeatures, data.selectedLabels, data.isDropna, data.normalizingMethod, data.encodingMethod, data.limit
    )

@app.post("/api/get-size")
def get_file_size(data: PathInput):
    return Utility.get_file_size(data.path)

@app.post("/api/create-histogram")
def create_histogram(data: HistogramData):
    return Processing.create_histogram(data.path, data.column, data.bins)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)