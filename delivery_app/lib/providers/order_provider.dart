import 'package:flutter/material.dart';
import '../services/order_service.dart';

class OrderProvider extends ChangeNotifier {
  final OrderService _orderService;
  List<dynamic> _orders = [];
  bool _loading = false;
  
  OrderProvider(this._orderService);
  
  List<dynamic> get orders => _orders;
  bool get loading => _loading;
  
  Future<void> fetchOrders() async {
    try {
      _loading = true;
      notifyListeners();
      
      _orders = await _orderService.getOrders();
      
      _loading = false;
      notifyListeners();
    } catch (e) {
      _loading = false;
      notifyListeners();
      rethrow;
    }
  }
  
}