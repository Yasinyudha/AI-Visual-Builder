import boto3

SUPABASE_S3_ENDPOINT = "https://txsegowmnagykxyqjxlz.storage.supabase.co/storage/v1/s3"
SUPABASE_ACCESS_KEY = "b46d5d6d52f0af3a19216cc97cad3d96"
SUPABASE_SECRET_KEY = "843f02b51d336270ccdfdfb115b7a6a72bc900a87bc00708cdc6e4ce8c6301b9"
REGION_NAME = "ap-south-1"
BUCKET_NAME = "ai-builder"

def get_s3_client():
    return boto3.client(
        's3',
        endpoint_url=SUPABASE_S3_ENDPOINT,
        aws_access_key_id=SUPABASE_ACCESS_KEY,
        aws_secret_access_key=SUPABASE_SECRET_KEY,
        region_name=REGION_NAME
    )

def get_private_file_url(file_name: str, expires_in: int = 60) -> str:
    s3_client = get_s3_client()

    url = s3_client.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': BUCKET_NAME,
            'Key': file_name
        },
        ExpiresIn=expires_in
    )

    return url

def list_files_in_folder(folder: str) -> list:
    s3_client = get_s3_client()

    # Ambil semua object yang diawali dengan prefix
    response = s3_client.list_objects_v2(
        Bucket=BUCKET_NAME,
        Prefix=folder
    )

    file_list = []
    if "Contents" in response:
        for obj in response["Contents"]:
            key = obj["Key"]
            filename = key.replace(folder, "")

            # Abaikan jika key adalah folder itu sendiri
            if (
                key == folder
                or filename == ".emptyFolderPlaceholder"
                or filename.startswith(".")
            ):
                continue

            # Buat presigned URL untuk akses private file
            presigned_url = get_private_file_url(key)

            file_list.append({
                "filename": filename,
                "full_path": key,
                "size_bytes": obj["Size"],
                "url": presigned_url
            })

    return file_list