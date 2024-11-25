from actions.database.connection import Database
from bson.objectid import ObjectId

class BookService:
    def __init__(self):
        self.db = Database()
        self.books_collection = self.db.get_collection("books")
        self.authors_collection = self.db.get_collection("authors")

    def find_books_by_author_name(self, author_name):
        """
        Tìm tất cả sách của một tác giả dựa trên tên.
        :param author_name: Tên tác giả
        :return: Danh sách sách hoặc None
        """
        # Tìm Author dựa trên tên
        author = self.authors_collection.find_one({"name": {"$regex": author_name, "$options": "i"}})
        if not author:
            return None

        # Tìm sách dựa trên `authorID`
        books = self.books_collection.find({"authorID": ObjectId(author["_id"])})
        return list(books)
    
    def search_book(self, book_name):
        """
        Tìm kiếm sách theo tên.
        :param book_name: Tên sách cần tìm
        :return: Một cuốn sách nếu tìm thấy hoặc None
        """
        # Nếu tên sách không hợp lệ, trả về None
        if not book_name or not isinstance(book_name, str):
            return None
        
        # Thực hiện truy vấn MongoDB
        try:
            result = self.books_collection.find_one(
                {"name": {"$regex": book_name, "$options": "i"}}
            )
            return result
        except Exception as e:
            print(f"Lỗi khi truy vấn MongoDB: {e}")
            return None
    
    def find_books_by_price(self, price):
        """
        Tìm sách với giá <= price từ MongoDB.
        """
        # Query sách có giá sau giảm <= price
        books = self.books_collection.find({
            "$expr": {
                "$and": [
                { "$lte": [{ "$subtract": ["$detail.originalPrice", "$detail.discountPrice"] }, price] },
                ]
            }
        })

        # Chuyển kết quả thành danh sách Python
        result = []
        for book in books:
            original_price = book["detail"]["originalPrice"]
            discount_price = book["detail"]["discountPrice"]
            final_price = original_price - discount_price

            result.append({
                "name": book["name"],
                "author": book.get("author", "Unknown"),
                "finalPrice": final_price,
                "originalPrice": original_price,
                "category": book.get("category", "Unknown"),
                "view": book.get("view", 0),
                "quantitySold": book.get("quantitySold", 0)
            })

        return result
    
    def find_books_by_price(self, price):
        """
        Tìm sách với giá <= price.
        """
        books = self.books_collection.find({
            "$expr": {
                "$lte": [
                    {"$subtract": ["$detail.originalPrice", "$detail.discountPrice"]},
                    price
                ]
            }
        })
        return list(books)
    
    def find_books_by_min_price(self, min_price):
        """
        Tìm sách với giá >= min_price.
        """
        books = self.books_collection.find({
            "$expr": {
                "$gte": [
                    {"$subtract": ["$detail.originalPrice", "$detail.discountPrice"]},
                    min_price
                ]
            }
        })
        return list(books)

    def find_books_by_price_range(self, min_price, max_price):
        """
        Tìm sách trong khoảng giá [min_price, max_price].
        """
        books = self.books_collection.find({
            "$expr": {
                "$and": [
                    {"$gte": [{"$subtract": ["$detail.originalPrice", "$detail.discountPrice"]}, min_price]},
                    {"$lte": [{"$subtract": ["$detail.originalPrice", "$detail.discountPrice"]}, max_price]}
                ]
            }
        })
        return list(books)
