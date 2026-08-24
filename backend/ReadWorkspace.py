import os

class ReadDirectory:

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