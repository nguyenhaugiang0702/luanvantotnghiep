from pymongo import MongoClient

class Database:
    def __init__(self, uri="mongodb://localhost:27017", db_name="nhgbookstore"):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]

    def get_collection(self, collection_name):
        """Lấy collection từ database."""
        return self.db[collection_name]

    def close_connection(self):
        """Đóng kết nối với database."""
        self.client.close()
