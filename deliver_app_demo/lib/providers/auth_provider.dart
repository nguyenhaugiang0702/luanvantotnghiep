import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService;
  bool _isLoggedIn = false;
  Map<String, dynamic> _shipper = {};

  AuthProvider(this._authService) {
    _checkLoginStatus();
  }
  // Getter
  bool get isLoggedIn => _isLoggedIn;
  Map<String, dynamic> get shipper => _shipper;

  Future<void> _checkLoginStatus() async {
    final prefs = await SharedPreferences.getInstance();
     _isLoggedIn = prefs.getBool('isLoggedIn') ?? false;
    notifyListeners();
  }

  Future<void> login(String email, String password) async {
    try {
      final response = await _authService.login(email, password);

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('accessToken', response['accessToken']);
      await prefs.setString('refreshToken', response['refreshToken']);
      _isLoggedIn = true; // Cập nhật trạng thái đăng nhập thành công
      await prefs.setBool('isLoggedIn', response['isLoggedIn']);

      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> fetchShipperInfo() async {
    try {
      final response = await _authService.getShipperInfo();
      _shipper = response; 
      notifyListeners();
    } catch (e) {
      // Xử lý lỗi nếu có
      print('Failed to fetch shipper info: $e');
    }
  }

  Future<void> logout() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();
      _isLoggedIn = false;
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }
}
