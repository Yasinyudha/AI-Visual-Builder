# backend/server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import ReadTable
import ReadWorkspace

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

@app.post("/api/multiply")
def multiply_numbers(data: MathInput):
    result = data.numA * data.numB
    return {"result": f"Python Output: {result}"}

@app.post("/api/read-column")
def read_column(data: PathInput):
    return {"columns": ReadTable.ReadColumn.read_column(data.path)}

@app.post("/api/read-in-directory")
def list_in_directory(data: PathInput):
    return ReadWorkspace.ReadDirectory.list_in_directory(data.path)

@app.post("/api/read-table")
def read_table(data: TableRequest):
    return ReadTable.ReadColumn.read_table_content(data.path, data.limit)

@app.post("/api/get-size")
def get_file_size(data: PathInput):
    return ReadWorkspace.ReadDirectory.get_file_size(data.path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)