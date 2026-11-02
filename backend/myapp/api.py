import pandas as pd
import numpy as np
from typing import Optional, List
from ninja import NinjaAPI, Router, File, Schema
from ninja.files import UploadedFile
from sklearn.preprocessing import MinMaxScaler, RobustScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from scipy.stats import f

from .services import *

api = NinjaAPI(
    title="API",
    version="1.0.0"
)

auth_router = Router()

@auth_router.post("/upload-csv")
def upload_file(request, file: UploadedFile = File(...)):
    if request.method == "POST":
        # Membuat S3 client
        s3_client = get_s3_client()

        # Mendefinisikan filename
        file = request.FILES['file']
        filename = 'files/' + file.name

        # Upload file binary ke Supabase S3
        s3_client.upload_fileobj(
            file.file,
            BUCKET_NAME,
            filename
        )

        return {
            "message": "Upload sukses"
        }
    
    return {
        "message": "Request tidak valid"
    }

@auth_router.get("/fetch-files")
def get_files(request):
    files = list_files_in_folder("files/")
    return {
        "files": files
    }

class FetchPresignedUrlRequest(Schema):
    file_path: str

@auth_router.post("/fetch-presigned-url")
def fetch_presigned_url(request, payload: FetchPresignedUrlRequest):
    # Membuat S3 client
    s3_client = get_s3_client()

    # Mendefinisikan filename
    filename = 'files/' + payload.file_path

    # Membuat presigned URL
    url = get_private_file_url(file_name=filename)

    return {
        "url": url
    }

class DeleteFileRequest(Schema):
    file_path: str

@auth_router.delete("/delete-file")
def delete_file(request, payload: DeleteFileRequest):
    # Membuat s3 client
    s3_client = get_s3_client()

    # Menghapus file dengan menggunakan delete_object() method
    s3_client.delete_object(
        Bucket=BUCKET_NAME,
        Key=f"files/{payload.file_path}"
    )

    return {
        "message": f"File {payload.file_path} berhasil dihapus"
    }

class GetCsvDataRequest(Schema):
    filename: str
    normalization_method: Optional[str] = None
    normalized_features: Optional[list[str]] = None
    feature: Optional[list[str]] = None
    label: Optional[list[str]] = None

@auth_router.post("/get-csv")
def get_csv_data(request, payload: GetCsvDataRequest):
    # Buat URL sementara yang berlaku selama 5 detik
    temp_url = get_private_file_url(f"files/{payload.filename}", 5)
    df = pd.read_csv(temp_url)

    # Filter berdasarkan feature dan label
    if payload.feature and payload.label:
        df = df[payload.feature + payload.label]

    # Lakukan normalization pada feature yang direquest
    if payload.normalization_method and payload.normalized_features:
        if payload.normalization_method == "Min-Max":
            scaler = MinMaxScaler()
            df[payload.normalized_features] = scaler.fit_transform(df[payload.normalized_features]).round(4)

        if payload.normalization_method == "Robust":
            scaler = RobustScaler()
            df[payload.normalized_features] = scaler.fit_transform(df[payload.normalized_features]).round(4)

    return {
        "headers": df.columns.to_list(),
        "rows": df.astype(str).to_dict(orient="records")
    }

class TrainRequest(Schema):
    filename: str
    features: List[str]
    labels: List[str]
    type: str

@auth_router.post("/train")
def train(request, payload: TrainRequest):
    # Fetch data lengkapnya terlebih dahulu
    temp_url = get_private_file_url(f"files/{payload.filename}")
    df = pd.read_csv(temp_url)

    # Filter berdasarkan feature dan label
    if payload.features and payload.labels:
        # Pisahkan dataframe awal menjadi feature dan label
        X = df[payload.features]
        y = df[payload.labels]

        # Ambil jumlah baris (n) dan jumlah fitur (p)
        n = len(X)
        p = X.shape[1]

        # Initialize model dan train
        model = LinearRegression()
        model.fit(X, y)

        # Prediction
        y_pred = model.predict(X)

        # Hitung metrics evaluasi
        mse = mean_squared_error(y, y_pred)
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(y, y_pred)
        r2 = r2_score(y, y_pred)

        # Hitung besarnya F-test dan F-value
        if n > p + 1 and r2 < 1.0:
            f_value = (r2 / p) / ((1 - r2) / (n - p - 1))
            p_value = 1 - f.cdf(f_value, p, n - p - 1)
        else:
            f_value = 0.0
            p_value = 1.0

        return {
            "coefficient": model.coef_[0].tolist(),
            "intercept": model.intercept_.tolist(),
            "evaluation": {
                "mae": [float(mae)],
                "mse": [float(mse)],
                "rmse": [float(rmse)],
                "r_squared": [float(r2)],
                "f_value": [float(f_value)],
                "p_value": [float(p_value)]
            }
        }

    # Jika tidak ada features dan labels, maka return message gagal
    else:
        return {
            "message": "Tidak dapat train data karena tidak features dan labels"
        }


api.add_router("", auth_router)