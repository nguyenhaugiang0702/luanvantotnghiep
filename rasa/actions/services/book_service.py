from actions.database.connection import Database
from bson.objectid import ObjectId

class BookService:
    def __init__(self):
        self.db = Database()
        self.books_collection = self.db.get_collection("books")
        self.authors_collection = self.db.get_collection("authors")
        self.publishers_collection = self.db.get_collection("publishers")
        self.categories_collection = self.db.get_collection("categories")
        self.formalities_collection = self.db.get_collection("formalities")

    # Tìm theo tên tác giả
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
        books = self.books_collection.find({"authorID": ObjectId(author["_id"]), "isShowed": True})
        return list(books)
    
    # Tìm theo tên nhà xuất bản
    def find_books_by_publisher_name(self, publisher_name):
        """
        Tìm tất cả sách của một nhà xuất bản dựa trên tên.
        :param publisher_name: Tên nhà xuất bản
        :return: Danh sách sách hoặc None
        """
        # Tìm Publisher dựa trên tên
        publisher = self.publishers_collection.find_one({"name": {"$regex": publisher_name, "$options": "i"}})
        
        # Kiểm tra nếu không tìm thấy nhà xuất bản
        if not publisher:
            return None

        # Tìm sách dựa trên `publisherID`
        books = self.books_collection.find({"publisherID": ObjectId(publisher["_id"]), "isShowed": True})
        return list(books)

    # Tìm theo tên sách
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
                {"name": {"$regex": book_name, "$options": "i"}, "isShowed": True}
            )
            return result
        except Exception as e:
            print(f"Lỗi khi truy vấn MongoDB: {e}")
            return None
        
    # Số lượng sách tồn kho 
    def find_book_quantity(self, book_name):
        """
        Tìm thông tin số lượng sách dựa trên tên sách.
        :param book_name: Tên sách cần tìm
        :return: Thông tin số lượng sách hoặc None nếu không tìm thấy
        """
        # Tìm sách theo tên
        book = self.books_collection.find_one({"name": {"$regex": book_name, "$options": "i"}})

        if not book:
            return None

        # Trích xuất thông tin quantityImported và quantitySold
        return {
            "name": book.get("name"),
            "quantityImported": book.get("quantityImported", 0),
            "quantitySold": book.get("quantitySold", 0),
            "quantityAvailable": book.get("quantityImported", 0) - book.get("quantitySold", 0)
        }
    
    # Tìm theo giá
    def find_books_by_price(self, price):
        """
        Tìm sách với giá <= price từ MongoDB.
        """
        # Query sách có giá sau giảm <= price
        books = self.books_collection.find({
            "$expr": {
                "$and": [
                    {"isShowed": True},
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
    
    # Tìm theo giá
    def find_books_by_price(self, price):
        """
        Tìm sách với giá <= price.
        """
        books = self.books_collection.find({
            "$expr": {
                "$and": [
                    {"isShowed": True},
                    {
                        "$lte": [
                            {"$subtract": ["$detail.originalPrice", "$detail.discountPrice"]},
                            price
                        ]
                    }
                ]
                
            }
        })
        return list(books)
    
    # Tìm sách có giá lớn hơn >= minprice
    def find_books_by_min_price(self, min_price):
        """
        Tìm sách với giá >= min_price.
        """
        books = self.books_collection.find({
            "$expr": {
                "$and": [
                    {"isShowed": True},
                    {
                        "$gte": [
                            {"$subtract": ["$detail.originalPrice", "$detail.discountPrice"]},
                            min_price
                        ]
                    }
                ]
                
            }
        })
        return list(books)

    # Tìm trong khoảng giá
    def find_books_by_price_range(self, min_price, max_price):
        """
        Tìm sách trong khoảng giá [min_price, max_price].
        """
        books = self.books_collection.find({
            "$expr": {
                "$and": [
                    {"isShowed": True},
                    {"$gte": [{"$subtract": ["$detail.originalPrice", "$detail.discountPrice"]}, min_price]},
                    {"$lte": [{"$subtract": ["$detail.originalPrice", "$detail.discountPrice"]}, max_price]}
                ]
            }
        })
        return list(books)

    # Chi tiết sách
    def find_book_details_by_name(self, book_name):
        """
        Tìm thông tin chi tiết sách dựa trên tên sách.
        :param book_name: Tên sách
        :return: Thông tin chi tiết của sách hoặc None nếu không tìm thấy
        """
        try:
            # Tìm sách theo tên
            book = self.books_collection.find_one({"name": {"$regex": book_name, "$options": "i"}, "isShowed": True})
            
            if not book:
                return None  # Không tìm thấy sách

            # Lấy thông tin tác giả
            author = self.authors_collection.find_one({"_id": ObjectId(book["authorID"])}) if "authorID" in book else None
            
            # Lấy thông tin nhà xuất bản
            publisher = self.publishers_collection.find_one({"_id": ObjectId(book["publisherID"])}) if "publisherID" in book else None
            
            # Lấy thông tin thể loại
            category = self.categories_collection.find_one({"_id": ObjectId(book["categoryID"])}) if "categoryID" in book else None
            
            # Lấy thông tin hình thức
            formality = self.formalities_collection.find_one({"_id": ObjectId(book["formalityID"])}) if "formalityID" in book else None

            # Xây dựng thông tin chi tiết sách
            book_details = {
                "_id": str(book.get("_id")),                
                "name": book.get("name"),
                "author": author["name"] if author else "Unknown",
                "publisher": publisher["name"] if publisher else "Unknown",
                "category": category["name"] if category else "Unknown",
                "formality": formality["name"] if formality else "Unknown",
                "finalPrice": book["detail"].get("originalPrice", 0) - book["detail"].get("discountPrice", 0),
                "quantityImported": book.get("quantityImported", 0),
                "quantitySold": book.get("quantitySold", 0),
                "quantityAvailable": book.get("quantityImported", 0) - book.get("quantitySold", 0),
                "image": book.get("images", [{}])[0].get("path", ""),
                "publisher_year": book["detail"].get("publisherYear", "Unknown")
            }

            return book_details
        
        except Exception as e:
            print(f"Lỗi khi tìm kiếm chi tiết sách: {e}")
            return None