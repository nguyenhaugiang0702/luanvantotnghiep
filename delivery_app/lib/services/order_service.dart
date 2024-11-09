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

}
