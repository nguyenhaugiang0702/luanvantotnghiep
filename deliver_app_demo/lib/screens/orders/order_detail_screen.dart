import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/order_provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';
import 'dart:io' show Platform, File;
import 'package:image_picker/image_picker.dart';
import 'package:image/image.dart' as img;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../../utils/confirm_dialog.dart';

class OrderDetailsScreen extends StatefulWidget {
  final Map<String, dynamic> order;

  const OrderDetailsScreen({
    super.key,
    required this.order,
  });

  @override
  State<OrderDetailsScreen> createState() => _OrderDetailsScreenState();
}

class _OrderDetailsScreenState extends State<OrderDetailsScreen> {
  Map<String, dynamic>? orderDetail;
  bool isLoading = true;
  File? _capturedImage;
  final ScrollController _scrollController = ScrollController();
  bool isLoadingAction = false;

  @override
  void initState() {
    super.initState();
    _fetchOrderDetail();
  }

  Future<void> _fetchOrderDetail() async {
    try {
      final provider = Provider.of<OrderProvider>(context, listen: false);
      final detail = await provider.fetchOrderDetail(widget.order['_id']);
      print(widget.order['_id']);
      setState(() {
        orderDetail = detail;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> _openInGoogleMaps(String address) async {
    // Kiểm tra xem quyền truy cập vị trí đã được cấp chưa
    var status = await Permission.location.status;

    if (status.isGranted) {
      // Nếu đã được cấp quyền, lấy vị trí và mở Google Maps
      _getLocationAndOpenMaps(address);
    } else {
      // Nếu chưa được cấp quyền, yêu cầu cấp quyền
      var permissionStatus = await Permission.location.request();
      if (permissionStatus.isGranted) {
        // Nếu người dùng cấp quyền, lấy vị trí và mở Google Maps
        _getLocationAndOpenMaps(address);
      } else if (permissionStatus.isDenied) {
        // Nếu quyền bị từ chối, hiển thị thông báo yêu cầu cấp quyền
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Vui lòng cấp quyền truy cập vị trí'),
            ),
          );
        }
      } else if (permissionStatus.isPermanentlyDenied) {
        // Nếu quyền bị từ chối vĩnh viễn, yêu cầu người dùng cấp quyền trong cài đặt
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                  'Quyền truy cập vị trí bị từ chối vĩnh viễn. Vui lòng cấp quyền trong cài đặt.'),
            ),
          );
          openAppSettings(); // Mở cài đặt ứng dụng để người dùng cấp quyền
        }
      }
    }
  }

  Future<void> _getLocationAndOpenMaps(String address) async {
    try {
      // Kiểm tra GPS và quyền truy cập
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
                content: Text('Vui lòng bật GPS để sử dụng tính năng này')),
          );
        }
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Quyền truy cập vị trí bị từ chối')),
            );
          }
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                  'Quyền truy cập vị trí bị từ chối vĩnh viễn. Vui lòng cấp quyền trong cài đặt.'),
            ),
          );
        }
        return;
      }

      // Lấy vị trí hiện tại
      Position position = await Geolocator.getCurrentPosition(
        locationSettings:
            const LocationSettings(accuracy: LocationAccuracy.high),
      );

      final encodedAddress = Uri.encodeComponent(address);

      try {
        if (Platform.isAndroid) {
          // Thử mở trực tiếp với scheme của Google Maps
          String url =
              'google.navigation:q=$encodedAddress&saddr=${position.latitude},${position.longitude}';
          final uri = Uri.parse(url);
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        } else if (Platform.isIOS) {
          // URL cho iOS
          String url =
              'comgooglemaps://?saddr=${position.latitude},${position.longitude}&daddr=$encodedAddress&directionsmode=driving';
          final uri = Uri.parse(url);

          if (await canLaunchUrl(uri)) {
            await launchUrl(uri, mode: LaunchMode.externalApplication);
          } else {
            // Fallback sang Apple Maps nếu không có Google Maps
            url =
                'http://maps.apple.com/?saddr=${position.latitude},${position.longitude}&daddr=$encodedAddress&dirflg=d';
            final fallbackUri = Uri.parse(url);
            await launchUrl(fallbackUri, mode: LaunchMode.externalApplication);
          }
        } else {
          // URL cho web và các nền tảng khác
          String url =
              'https://www.google.com/maps/dir/${position.latitude},${position.longitude}/$encodedAddress';
          final uri = Uri.parse(url);
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        }
      } catch (e) {
        // Nếu cách trên thất bại, thử mở với URL web
        final webUrl =
            'https://www.google.com/maps/dir/${position.latitude},${position.longitude}/$encodedAddress';
        final webUri = Uri.parse(webUrl);

        try {
          await launchUrl(webUri, mode: LaunchMode.externalApplication);
        } catch (e) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Không thể mở ứng dụng bản đồ')),
            );
          }
        }
      }
    } catch (e) {
      print('Error opening maps: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Có lỗi xảy ra khi mở bản đồ')),
        );
      }
    }
  }

  Future<void> _updateOrderStatus(String orderId, Map<String, dynamic> status,
      {File? image}) async {
    setState(() {
      isLoadingAction = true;
    });
    try {
      final provider = Provider.of<OrderProvider>(context, listen: false);
      await provider.updateOrderStatus(orderId, status, image: image);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Thực hiện thành công')),
      );
      await _fetchOrderDetail();
    } catch (e) {
      print(e);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi khi cập nhật đơn hàng')),
      );
    } finally {
      setState(() {
        isLoadingAction = false;
      });
    }
  }

  Future<void> _openCamera() async {
    final status = await Permission.camera.status;
    if (status.isDenied) {
      await Permission.camera.request();
    }
    final picker = ImagePicker();
    try {
      final XFile? image = await picker.pickImage(source: ImageSource.camera);
      if (image != null) {
        setState(() {
          _capturedImage = File(image.path); // Store the captured image
        });
        // After capturing the image, scroll to the bottom
        Future.delayed(const Duration(milliseconds: 300), () {
          _scrollController.animateTo(
            _scrollController.position.maxScrollExtent,
            duration: const Duration(seconds: 1),
            curve: Curves.easeOut,
          );
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Ảnh đã được chụp thành công')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Không có ảnh nào được chụp')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Có lỗi xảy ra khi mở máy ảnh')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (orderDetail == null) {
      return const Scaffold(
        body: Center(child: Text('Không tìm thấy thông tin đơn hàng')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Chi tiết đơn hàng'),
      ),
      body: SingleChildScrollView(
        controller: _scrollController,
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSection(
              'Thông tin đơn hàng',
              [
                _buildInfoRow('Mã đơn hàng', '#${orderDetail!['_id']}'),
                _buildInfoRow('Trạng thái', orderDetail!['status']['label']),
                _buildInfoRow(
                  'Hình thức thanh toán',
                  orderDetail!['payment'] ?? 'Không xác định',
                ),
                _buildInfoRow(
                  'Phí vận chuyển',
                  '${_formatPrice(orderDetail!['shippingFee'])}đ',
                ),
                if (orderDetail!['notes']?.isNotEmpty ?? false)
                  _buildInfoRow('Ghi chú', orderDetail!['notes']),
              ],
            ),
            const SizedBox(height: 20),
            _buildSection(
              'Thông tin người đặt',
              [
                _buildInfoRow(
                  'Họ tên',
                  '${orderDetail!['userID']['firstName']} ${orderDetail!['userID']['lastName']}',
                ),
                _buildInfoRow('Email', orderDetail!['userID']['email'] ?? 'chưa biết'),
                _buildInfoRow(
                  'Số điện thoại',
                  orderDetail!['userID']['phoneNumber'],
                ),
              ],
            ),
            const SizedBox(height: 20),
            _buildSection(
              'Địa chỉ nhận hàng',
              [
                _buildInfoRow(
                  'Người nhận',
                  '${orderDetail!['addressID']['firstName']} ${orderDetail!['addressID']['lastName']}',
                ),
                _buildInfoRow(
                  'Số điện thoại',
                  orderDetail!['addressID']['phoneNumber'],
                ),
                // _buildInfoRow(
                //   'Địa chỉ',
                //   '${orderDetail!['addressID']['detailAddress']}, '
                //       '${orderDetail!['addressID']['ward']['name']}, '
                //       '${orderDetail!['addressID']['district']['name']}, '
                //       '${orderDetail!['addressID']['province']['name']}',
                // ),
                _buildAddressRow(
                  // Sử dụng widget mới cho phần địa chỉ
                  'Địa chỉ',
                  '${orderDetail!['addressID']['detailAddress']}, '
                      '${orderDetail!['addressID']['ward']['name']}, '
                      '${orderDetail!['addressID']['district']['name']}, '
                      '${orderDetail!['addressID']['province']['name']}',
                ),
              ],
            ),
            const SizedBox(height: 20),
            _buildOrderItems(orderDetail!['detail']),
            const SizedBox(height: 20),
            // Hiển thị ảnh khi chụp
            if (_capturedImage != null)
              Image.file(
                _capturedImage!, // Ảnh chụp từ camera
                height: 350,
                width: double.infinity,
                fit: BoxFit.cover,
              )
            else if (orderDetail!['image'] != null)
              Image.network(
                _getImageUrl(orderDetail!['image']),
                height: 350,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return const Text('');
                },
              )
          ],
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16.0),
        child: isLoadingAction
            ? const Center(child: CircularProgressIndicator())
            : (orderDetail!['status']['value'] == 2)
                ? ElevatedButton(
                    onPressed: () =>
                        _updateOrderStatus(widget.order['_id'], {'status': 5}),
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 50),
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Nhận hàng'),
                  )
                : (orderDetail!['status']['value'] == 5)
                    ? ElevatedButton(
                        onPressed: () => _updateOrderStatus(
                            widget.order['_id'], {'status': 6}),
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size(double.infinity, 50),
                          backgroundColor: Colors.blue,
                          foregroundColor: Colors.white,
                        ),
                        child: const Text('Chuyển sang Đang giao'),
                      )
                    : (orderDetail!['status']['value'] == 6)
                        ? Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              if (_capturedImage ==
                                  null) // Chỉ hiển thị khi chưa chụp ảnh
                                ElevatedButton(
                                  onPressed: () async {
                                    final bool? confirmed = await showDialog(
                                      context: context,
                                      builder: (context) =>
                                          const ConfirmationDialog(
                                        title:
                                            'Xác nhận giao hàng không thành công',
                                        content:
                                            'Bạn có chắc chắn muốn đánh dấu giao hàng không thành công?',
                                        confirmText: 'Xác nhận',
                                        cancelText: 'Hủy',
                                      ),
                                    );
                                    if (confirmed == true) {
                                      _updateOrderStatus(
                                          widget.order['_id'], {'status': 7});
                                    }
                                  },
                                  style: ElevatedButton.styleFrom(
                                    minimumSize:
                                        const Size(double.infinity, 50),
                                    backgroundColor: Colors.red,
                                    foregroundColor: Colors.white,
                                  ),
                                  child:
                                      const Text('Giao hàng không thành công'),
                                ),
                              const SizedBox(height: 8),
                              if (_capturedImage != null)
                                ElevatedButton(
                                  onPressed: () => _updateOrderStatus(
                                      widget.order['_id'], {'status': 8},
                                      image: _capturedImage),
                                  style: ElevatedButton.styleFrom(
                                    minimumSize:
                                        const Size(double.infinity, 50),
                                    backgroundColor: Colors.green,
                                    foregroundColor: Colors.white,
                                  ),
                                  child: const Text('Hoàn tất'),
                                )
                              else
                                ElevatedButton.icon(
                                  onPressed: _openCamera,
                                  style: ElevatedButton.styleFrom(
                                    minimumSize:
                                        const Size(double.infinity, 50),
                                    backgroundColor: Colors.orange,
                                    foregroundColor: Colors.white,
                                  ),
                                  icon: const Icon(Icons.camera_alt),
                                  label: const Text('Chụp ảnh'),
                                ),
                            ],
                          )
                        : null,
      ),
    );
  }

  Widget _buildAddressRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 140,
            child: Text(
              label,
              style: const TextStyle(
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Row(
              children: [
                Expanded(
                  child: Text(value),
                ),
                if (label == 'Địa chỉ') // Chỉ hiển thị icon cho dòng địa chỉ
                  IconButton(
                    icon: const Icon(Icons.location_on, color: Colors.blue),
                    onPressed: () {
                      _getLocationAndOpenMaps(value);
                    },
                    tooltip: 'Mở trong Google Maps',
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> children) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 140,
            child: Text(
              label,
              style: const TextStyle(
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderItems(List<dynamic> items) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Chi tiết đơn hàng',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];
                final book = item['bookID'];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              book['name'] ?? 'Không có tên',
                              style:
                                  const TextStyle(fontWeight: FontWeight.bold),
                            ),
                            Text(
                              'Số lượng: ${item['quantity']} x ${_formatPrice(item['realPrice'])}đ',
                              style: const TextStyle(color: Colors.grey),
                            ),
                          ],
                        ),
                      ),
                      Text(
                        '${_formatPrice(item['quantity'] * item['realPrice'])}đ',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                );
              },
            ),
            const Divider(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Tạm tính',
                  style: TextStyle(
                    fontSize: 14,
                  ),
                ),
                Text(
                  '${_formatPrice(orderDetail!['totalPriceOrder'])}đ',
                  style: const TextStyle(
                    fontSize: 14,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Phí vận chuyển',
                  style: TextStyle(
                    fontSize: 14,
                  ),
                ),
                Text(
                  '${_formatPrice(orderDetail!['shippingFee'])}đ',
                  style: const TextStyle(
                    fontSize: 14,
                  ),
                ),
              ],
            ),
            if (orderDetail!['totalDiscountPrice'] > 0) ...[
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Giảm giá',
                    style: TextStyle(
                      fontSize: 14,
                    ),
                  ),
                  Text(
                    '-${_formatPrice(orderDetail!['totalDiscountPrice'])}đ',
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.red,
                    ),
                  ),
                ],
              ),
            ],
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Tổng tiền',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  '${_formatPrice(orderDetail!['totalPrice'])}đ',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.red,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatPrice(dynamic price) {
    return price.toString().replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (Match m) => '${m[1]},',
        );
  }

  String _getImageUrl(String? imagePath) {
    final baseUrl =
        'https://${dotenv.env['DOMAIN']}/'; // Đổi thành URL thật nếu chạy trên server
    if (imagePath == null || imagePath.isEmpty) {
      return '';
    }
    // Nếu `imagePath` đã có base URL, thì trả về `imagePath` gốc, nếu không thêm `baseUrl`
    return imagePath.startsWith('https') ? imagePath : '$baseUrl$imagePath';
  } 
}
