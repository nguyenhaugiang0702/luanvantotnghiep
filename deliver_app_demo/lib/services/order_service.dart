import 'dio_service.dart';
import 'dart:io';
import 'dart:typed_data';
import 'package:dio/dio.dart';
import 'package:image/image.dart' as img;
import 'package:mime/mime.dart';
import 'package:http_parser/http_parser.dart';

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
      final response = await _dioBase.dio.get('orders/$orderId');
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch order detail');
    }
  }

  Future<Map<String, dynamic>> updateOrderStatus(
      String orderId, Map<String, dynamic> status,
      {File? image}) async {
    try {
      FormData formData;

      if (image != null) {
        // Đọc file ảnh và chuyển về đúng định dạng JPEG nếu cần
        final bytes = await image.readAsBytes();
        img.Image? originalImage = img.decodeImage(bytes);

        if (originalImage == null) {
          throw Exception('Không thể đọc ảnh');
        }

        // Chuyển đổi về JPEG nếu ảnh không phải JPEG hoặc PNG
        Uint8List imageData;
        final mimeType = lookupMimeType(image.path) ?? 'image/jpeg';

        if (mimeType != 'image/jpeg' &&
            mimeType != 'image/jpg' &&
            mimeType != 'image/png' &&
            mimeType != 'image/webp') {
          imageData = Uint8List.fromList(img.encodeJpg(originalImage));
        } else {
          imageData = bytes;
        }

        // Lưu ảnh đã chuyển đổi vào file tạm thời
        final tempDir = await Directory.systemTemp.createTemp();
        final tempFile = File('${tempDir.path}/temp_image.jpg')
          ..writeAsBytesSync(imageData);

        // Tạo FormData với ảnh
        formData = FormData.fromMap({
          'fileType': 'orders',
          ...status,
          'image': await MultipartFile.fromFile(
            tempFile.path,
            filename: 'image.jpg',
            contentType: MediaType('image', 'jpeg'),
          ),
        });
      } else {
        // Nếu không có ảnh, chỉ gửi `fileType` và `status`
        formData = FormData.fromMap({
          'fileType': 'orders',
          ...status,
        });
      }

      // Gửi request
      final response = await _dioBase.dio.put(
        'orders/$orderId',
        data: formData,
        options: Options(
          headers: {'Content-Type': 'multipart/form-data'},
        ),
      );

      return response.data;
    } catch (e) {
      if (e is DioError) {
        print('DioError: ${e.response?.data}');
        print('Mã trạng thái: ${e.response?.statusCode}');
      } else {
        print('Lỗi: $e');
      }
      throw Exception('Không thể cập nhật chi tiết trạng thái đơn hàng');
    }
  }
}
