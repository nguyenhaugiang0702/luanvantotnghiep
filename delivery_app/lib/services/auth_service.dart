import 'package:dio/dio.dart';
import './dio_service.dart';

class AuthService {
  final DioBase _dioBase;

  AuthService(this._dioBase);

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _dioBase.dio.post(
        'auth/login',
        data: {
          'email': email,
          'password': password,
        },
      );
      return response.data;
    } catch (e) {
      throw Exception('Login failed');
    }
  }

  Future<Map<String, dynamic>> getShipperInfo() async {
    try {
      final response = await _dioBase.dio.get('admins/infoAdmin'); 
      return response.data;
    } catch (e) {
      print(e);
      throw Exception('Failed to fetch shipper info');
    }
  }

}
