from actions.services.book_service import BookService
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

class ActionSearchBook(Action):
    def name(self):
        return "action_search_book"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        # Lấy tên sách từ slot
        book_name = tracker.get_slot("book_name")
        if tracker.latest_message["intent"].get("name") != "search_book":
            return []
        if not book_name:
            dispatcher.utter_message(text="Bạn vui lòng cung cấp tên sách.")
            return []

        # Sử dụng BookService để tìm sách
        book_service = BookService()
        book = book_service.search_book(book_name)

        if book:
            # Lấy giá sau giảm
            book_details = extract_book_details(book)
            response = {
                "text": f"Tôi tìm thấy sách '{book['name']}'",
                "books": book_details, 
            }
            dispatcher.utter_message(json_message=response)
        else:
            dispatcher.utter_message(text="Xin lỗi, tôi không tìm thấy sách nào phù hợp.")

        return []

class ActionSearchBooksByAuthor(Action):
    def name(self):
        return "action_search_books_by_author"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        # Lấy tên tác giả từ slot
        if tracker.latest_message["intent"].get("name") != "search_books_by_author":
            return []
        author_name = tracker.get_slot("author_name")

        if not author_name:
            dispatcher.utter_message(text="Bạn vui lòng cung cấp tên tác giả.")
            return []

        # Sử dụng service để tìm sách
        book_service = BookService()
        books = book_service.find_books_by_author_name(author_name)

        if books:
            book_details = extract_book_details(books)
            response = {
                "text": f"Tôi tìm thấy các sách của tác giả '{author_name}':",
                "books": book_details, 
            }
            dispatcher.utter_message(json_message=response)
        else:
            dispatcher.utter_message(
                text=f"Xin lỗi, tôi không tìm thấy sách nào của tác giả '{author_name}'."
            )

        return []
    
class ActionSearchBooksByPublisher(Action):
    def name(self):
        return "action_search_books_by_publisher"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        # Lấy tên nhà xuất bản từ slot
        if tracker.latest_message["intent"].get("name") != "search_books_by_publisher":
            return []
        
        publisher_name = tracker.get_slot("publisher_name")

        if not publisher_name:
            dispatcher.utter_message(text="Bạn vui lòng cung cấp tên nhà xuất bản.")
            return []

        # Sử dụng service để tìm sách
        book_service = BookService()
        books = book_service.find_books_by_publisher_name(publisher_name)

        if books:
            book_details = extract_book_details(books)
            response = {
                "text": f"Tôi tìm thấy các sách của nhà xuất bản '{publisher_name}':",
                "books": book_details, 
            }
            dispatcher.utter_message(json_message=response)
        else:
            dispatcher.utter_message(
                text=f"Xin lỗi, tôi không tìm thấy sách nào của nhà xuất bản '{publisher_name}'."
            )

        return []

class ActionFindBookQuantity(Action):
    def name(self):
        return "action_find_book_quantity"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        # Lấy tên sách từ slot
        book_name = tracker.get_slot("book_name")

        if not book_name:
            dispatcher.utter_message(text="Bạn vui lòng cung cấp tên sách.")
            return []

        # Tìm thông tin sách
        book_service = BookService()  # Thay bằng kết nối cơ sở dữ liệu
        book_info = book_service.find_book_quantity(book_name)

        if book_info:
            response = (
                f"Tôi tìm thấy thông tin sách '{book_info['name']}':\n"
                f"- Số lượng còn lại: {book_info['quantityAvailable']}"
            )
            dispatcher.utter_message(text=response)
        else:
            dispatcher.utter_message(text=f"Xin lỗi, tôi không tìm thấy sách nào có tên '{book_name}'.")

        return []
    
class ActionSearchBooksByPrice(Action):
    def name(self):
        return "action_search_books_by_price"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        # Lấy giá trị từ slot
        price = tracker.get_slot("price")
        min_price = tracker.get_slot("min_price")
        max_price = tracker.get_slot("max_price")

        print(f"DEBUG: Giá trị slot 'price': {price}")
        print(f"DEBUG: Giá trị slot 'min_price': {min_price}")
        print(f"DEBUG: Giá trị slot 'max_price': {max_price}")

        # Xử lý nếu người dùng cung cấp khoảng giá
        if min_price and max_price:
            try:
                min_price = int(min_price)
                max_price = int(max_price)
            except (ValueError, TypeError):
                dispatcher.utter_message(text="Giá trị không hợp lệ. Vui lòng cung cấp giá trị nguyên.")
                return []
            
            book_service = BookService()
            books = book_service.find_books_by_price_range(min_price, max_price)

            if books:
                book_details = extract_book_details(books)
                response = {
                    "text": f"Tôi tìm thấy các sách với giá từ {min_price} đến {max_price} VND:",
                    "books": book_details, 
                }
                dispatcher.utter_message(json_message=response)
            else:
                dispatcher.utter_message(
                    text=f"Không tìm thấy sách nào với giá từ {min_price} đến {max_price} VND."
                )
            return []

        # Xử lý nếu người dùng cung cấp giá cụ thể
        if price:
            try:
                price = int(price)
            except (ValueError, TypeError):
                dispatcher.utter_message(text="Giá trị không hợp lệ. Vui lòng cung cấp giá trị nguyên.")
                return []
            
            # Kiểm tra điều kiện "giá lớn hơn"
            if "cao hơn" in tracker.latest_message["text"] or "lớn hơn" in tracker.latest_message["text"] or "trên" in tracker.latest_message["text"]:
                book_service = BookService()
                books = book_service.find_books_by_min_price(price)
                if books:
                    book_details = extract_book_details(books)
                    response = {
                        "text": f"Tôi tìm thấy các sách với giá lớn hơn {price} VND:",
                        "books": book_details, 
                    }
                    dispatcher.utter_message(json_message=response)
                else:
                    dispatcher.utter_message(
                        text=f"Không tìm thấy sách nào với giá lớn hơn {price} VND."
                    )
                return []

            book_service = BookService()
            books = book_service.find_books_by_price(price)

            if books:
                book_details = extract_book_details(books)
                response = {
                    "text": f"Tôi tìm thấy các sách với giá dưới {price} VND:",
                    "books": book_details, 
                }
                dispatcher.utter_message(json_message=response)
            else:
                dispatcher.utter_message(
                    text=f"Không tìm thấy sách nào với giá dưới {price} VND."
                )
            return []

        # Trường hợp không có thông tin giá
        dispatcher.utter_message(text="Bạn vui lòng cung cấp khoảng giá hoặc giá cụ thể.")
        return []

class ActionFindBookDetails(Action):
    def name(self):
        return "action_get_book_details"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        # Lấy tên sách từ slot
        book_name = tracker.get_slot("book_name")

        if not book_name:
            dispatcher.utter_message(text="Bạn vui lòng cung cấp tên sách.")
            return []

        # Sử dụng BookService để tìm sách
        book_service = BookService()
        book_detail = book_service.find_book_details_by_name(book_name)

        if book_detail:
            book_with_detail = {
                "_id": book_detail['_id'],
                "book_name": book_detail["name"],
                "author": book_detail["author"],
                "publisher": book_detail["publisher"],
                "category": book_detail["category"],
                "formality": book_detail["formality"],
                "finalPrice": book_detail["finalPrice"],
                "quantityAvailable": book_detail["quantityAvailable"],
                "publisher_year": book_detail["publisher_year"],
                "image": book_detail["image"],
            }
            response = {
                "text": f"Tôi tìm thấy thông tin chi tiết của {book_name}, bạn có thể click vào để xem chi tiết hơn:",
                "books": book_with_detail, 
            }
            dispatcher.utter_message(json_message=response)
        else:
            dispatcher.utter_message(text=f"Xin lỗi, tôi không tìm thấy sách nào có tên '{book_name}'.")

        return []

def extract_book_details(books):
    """
    Hàm này nhận vào một đối tượng hoặc mảng sách và trả về danh sách thông tin sách với tên, giá và hình ảnh.
    """
    # Đảm bảo rằng books là một mảng
    if not isinstance(books, list):
        books = [books]  # Nếu books là đối tượng đơn, biến nó thành mảng

    book_details = []
    
    for book in books:
        # Tính toán giá (originalPrice - discountPrice)
        original_price = book.get("detail", {}).get("originalPrice", 0)
        discount_price = book.get("detail", {}).get("discountPrice", 0)
        price = original_price - discount_price if original_price and discount_price else original_price

        # Lấy hình ảnh (có thể lấy ảnh đầu tiên hoặc một mảng ảnh)
        image_path = book.get("images", [{}])[0].get("path", "")

        # Tạo đối tượng chứa thông tin sách
        book_info = {
            "_id": str(book.get("_id")),
            "name": book.get("name", "Chưa có tên sách"),
            "price": f"{price}",
            "image": image_path,
        }
        book_details.append(book_info)

    return book_details
