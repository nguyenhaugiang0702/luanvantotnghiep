def format_currency(value):
    """Định dạng số thành tiền tệ."""
    return f"{value:,} VND"

def validate_order_id(order_id):
    """Kiểm tra mã đơn hàng có hợp lệ không."""
    return len(order_id) == 6 and order_id.isalnum()
