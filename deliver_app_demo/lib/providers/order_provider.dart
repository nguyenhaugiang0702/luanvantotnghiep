import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../services/order_service.dart';
import 'dart:io' show File;

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
      print(_orders[1]);

      _loading = false;
      notifyListeners();
    } catch (e) {
      _loading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<Map<String, dynamic>> fetchOrderDetail(String orderId) async {
    try {
      final data = await _orderService.fetchOrderDetail(orderId);
      notifyListeners();
      return data;
    } catch (e) {
      throw Exception('Failed to fetch order detail');
    }
  }

  Future<void> updateOrderStatus(String orderId, Map<String, dynamic> status,
      {File? image}) async {
    try {
      await _orderService.updateOrderStatus(orderId, status, image: image);
      notifyListeners();
    } catch (e) {
      print(e);
      throw Exception('Failed to update order detail');
    }
  }
}
