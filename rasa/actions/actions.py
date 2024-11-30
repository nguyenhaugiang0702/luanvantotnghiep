from actions.services.book_service import BookService
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import re
from rasa_sdk.events import SlotSet
from typing import Any, Text, List, Dict

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
    def name(self) -> Text:
        return "action_search_books_by_price"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[SlotSet]:
        price = tracker.get_slot("price")
        min_price = tracker.get_slot("min_price")
        max_price = tracker.get_slot("max_price")

        print(f"DEBUG: ------- By Price -------")
        print(f"DEBUG: Giá trị slot 'price': {price}")
        print(f"DEBUG: Giá trị slot 'min_price': {min_price}")
        print(f"DEBUG: Giá trị slot 'max_price': {max_price}")
        print(f"DEBUG: ------- By Price -------")

        # Chuyển đổi giá trị có "k" thành giá trị tương ứng
        def convert_price(price_str):
            if price_str:
                price_str = price_str.lower()
                match = re.match(r"(\d+)(k|K)?", price_str)
                if match:
                    price_value = int(match.group(1))
                    if match.group(2):  # Nếu có "k"
                        price_value *= 1000
                    return price_value
            return None

        # Chuyển đổi giá trị price, min_price và max_price
        if price:
            price = convert_price(price)

        # Xử lý yêu cầu tìm sách theo các điều kiện khác nhau
        if price:
            # Kiểm tra các từ khóa tìm kiếm (lớn hơn, nhỏ hơn, khoảng)
            price_condition = tracker.latest_message["text"].lower()
            print(price_condition)
            if "lớn hơn" in price_condition or "cao hơn" in price_condition or "trên" in price_condition:
                # Tìm sách với giá lớn hơn
                book_service = BookService()
                books = book_service.find_books_by_min_price(price)
                response = f"Tôi tìm thấy các sách với giá lớn hơn {price} VND:"
                if books:
                    book_details = extract_book_details(books)
                    response = {
                        "text": f"Tôi tìm thấy các sách với giá lớn hơn {price} VND:",
                        "books": book_details, 
                    }
                    dispatcher.utter_message(json_message=response)
                else:
                    dispatcher.utter_message(
                        text=f"Không tìm thấy các sách với giá lớn hơn {price} VND:"
                    )

            elif "bé hơn" in price_condition or "nhỏ hơn" in price_condition or "dưới" in price_condition:
                # Tìm sách với giá nhỏ hơn
                book_service = BookService()
                books = book_service.find_books_by_max_price(price)
                if books:
                    book_details = extract_book_details(books)
                    response = {
                        "text": f"Tôi tìm thấy các sách với giá nhỏ hơn {price} VND:",
                        "books": book_details, 
                    }
                    print(response)
                    dispatcher.utter_message(json_message=response)
                else:
                    dispatcher.utter_message(
                        text=f"Không tìm thấy các sách với giá nhỏ hơn {price} VND:"
                    )

            elif "khoảng" in price_condition or "khoản" in price_condition:
                # Tìm sách trong khoảng giá
                match = re.search(r"(khoảng|khoản)\s*(\d+k|\d+)", tracker.latest_message["text"].lower())
                print(match)
                if match:
                    base_price_str = match.group(2)
                    print(base_price_str)
                    base_price = convert_price(base_price_str)
                    print(base_price)
                    
                    if base_price:
                        # Xác định khoảng giá
                        min_range = base_price - 20000  # Giảm 20k
                        max_range = base_price + 20000  # Tăng 20k

                        book_service = BookService()
                        books = book_service.find_books_by_price_range(min_range, max_range)

                        if books:
                            book_details = extract_book_details(books)
                            response = {
                                "text": f"Tôi tìm thấy các sách với giá khoảng {base_price} VND:",
                                "books": book_details, 
                            }
                            dispatcher.utter_message(json_message=response)
                        else:
                            dispatcher.utter_message(
                                text=f"Không tìm thấy các sách với giá khoảng {base_price} VND:"
                            )
                    else:
                        dispatcher.utter_message(text="Giá trị không hợp lệ. Vui lòng cung cấp giá hợp lệ.")
                else:
                    dispatcher.utter_message(text="Không tìm thấy sách trong khoảng giá này.")
        return []

class ActionSearchBooksByPriceRange(Action):
    def name(self) -> Text:
        return "action_search_books_by_price_range"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[SlotSet]:
        price = tracker.get_slot("price")
        min_price = tracker.get_slot("min_price")
        max_price = tracker.get_slot("max_price")

        print(f"DEBUG: ------- By Price Range -------")
        print(f"DEBUG: Giá trị slot 'price': {price}")
        print(f"DEBUG: Giá trị slot 'min_price': {min_price}")
        print(f"DEBUG: Giá trị slot 'max_price': {max_price}")
        print(f"DEBUG: ------- By Price Range -------")

        # Kiểm tra các từ khóa tìm kiếm (lớn hơn, nhỏ hơn, khoảng)
        price_condition = tracker.latest_message["text"].lower()

        # Chuyển đổi giá trị có "k" thành giá trị tương ứng
        def convert_price(price_str):
            if price_str:
                price_str = price_str.lower()
                match = re.match(r"(\d+)(k|K)?", price_str)
                if match:
                    price_value = int(match.group(1))
                    if match.group(2):  # Nếu có "k"
                        price_value *= 1000
                    return price_value
            return None

        # Chuyển đổi giá trị price, min_price và max_price
        if min_price:
            min_price = convert_price(min_price)
        if max_price:
            max_price = convert_price(max_price)

        # Xử lý yêu cầu tìm sách theo các điều kiện khác nhau
        if min_price and max_price:
            min_price = int(min_price)
            max_price = int(max_price)
            if min_price > max_price:
                dispatcher.utter_message(text="Giá trị không hợp lệ. Vui lòng cung cấp giá hợp lệ.")
            
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
                dispatcher.utter_message(text=f"Không tìm thấy sách nào trong khoảng giá từ {min_price} đến {max_price} VND.")
        
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
