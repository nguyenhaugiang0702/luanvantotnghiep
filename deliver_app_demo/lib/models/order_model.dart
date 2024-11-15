class Order {
  final String id;
  final String customerName;
  final String status; // ví dụ: "Đã xác nhận", "Đang giao", v.v.
  final DateTime orderDate;

  Order({required this.id, required this.customerName, required this.status, required this.orderDate});
}
