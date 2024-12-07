import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class DioBase {
  late Dio dio;
  // final String baseUrl = 'http://${dotenv.env['DOMAIN']}/api/v1/admin/';
  final String baseUrl = 'http://localhost:3000/api/v1/admin/';

  DioBase() {
    dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10000),
      receiveTimeout: const Duration(seconds: 10000),
    ));

    dio.interceptors
        .add(InterceptorsWrapper(onRequest: (options, handler) async {
      final prefs = await SharedPreferences.getInstance();
      final accessToken = prefs.getString('accessToken');
      final refreshToken = prefs.getString('refreshToken');
      if (options.path.contains('/auth/refreshToken')) {
        if (refreshToken != null) {
          options.headers['Authorization'] = 'Bearer $refreshToken';
        }
      } else {
        if (accessToken != null) {
          options.headers['Authorization'] = 'Bearer $accessToken';
        }
      }
      // FormData
      if(options.data is FormData){
        options.headers['Content-Type'] = 'multipart/form-data';
      }
      return handler.next(options);
    }, onError: (error, handler) async {
      if (error.response?.statusCode == 401) {
        // Token expired
        final prefs = await SharedPreferences.getInstance();
        final refreshToken = prefs.getString('refreshToken');

        if (refreshToken != null) {
          try {
            // Call refresh token API
            final response = await dio.post(
              '/auth/refreshToken',
              options: Options(
                headers: {'Authorization': 'Bearer $refreshToken'},
              ),
            );

            // Save new tokens
            await prefs.setString('accessToken', response.data['accessToken']);
            await prefs.setString(
                'refreshToken', response.data['refreshToken']);

            // Retry failed request
            final options = error.requestOptions;
            final newToken = response.data['accessToken'];
            options.headers['Authorization'] = 'Bearer $newToken';

            final retryResponse = await dio.fetch(options);
            return handler.resolve(retryResponse);
          } catch (e) {
            // Refresh token failed - logout user
            await prefs.clear();
            // Navigate to login screen
            return handler.reject(error);
          }
        }
      }
      return handler.next(error);
    }));
  }
}
