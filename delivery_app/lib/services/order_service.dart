import 'package:dio/dio.dart';
import './dio_service.dart';

class OrderService {
  final DioBase _dioBase;

  OrderService(this._dioBase);
  Future<List<dynamic>> getOrders() async {
    try {
      final response = await _dioBase.dio.get('orders');
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch orders');
    }
  }

  Future<Map<String, dynamic>> fetchOrderDetail(String orderId) async {
    try {
      // final url = 'orders/$orderId'; // Tạo URL
      // print('Calling API URL: ${_dioBase.dio.options.baseUrl}$url');
      final response = await _dioBase.dio.get('orders/$orderId');
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch order detail');
    }
  }
}
