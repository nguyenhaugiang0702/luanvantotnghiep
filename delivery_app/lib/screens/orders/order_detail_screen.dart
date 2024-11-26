import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/order_provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';

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

  @override
  void initState() {
    super.initState();
    _fetchOrderDetail();
  }

  Future<void> _fetchOrderDetail() async {
    try {
      final provider = Provider.of<OrderProvider>(context, listen: false);
      final detail = await provider.fetchOrderDetail(widget.order['_id']);
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
      // Kiểm tra xem GPS có được bật không
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Vui lòng bật GPS để sử dụng tính năng này'),
            ),
          );
        }
        return;
      }
      // Kiểm tra quyền truy cập vị trí
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Quyền truy cập vị trí bị từ chối'),
              ),
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
      // Lấy vị trí hiện tại của thiết bị
      Position position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.low);
      final encodedAddress = Uri.encodeComponent(address);
      final url =
          'https://www.google.com/maps/dir/?api=1&origin=${position.latitude},${position.longitude}&destination=$encodedAddress&travelmode=driving';
      // final url = 'https://www.google.com/maps/search/?api=1&query=$encodedAddress';
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        // await launchUrl(uri);
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        // Hiển thị thông báo lỗi nếu không thể mở được Google Maps
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Không thể mở Google Maps'),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Không thể lấy vị trí của thiết bị'),
          ),
        );
      }
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
        title: Text('Chi tiết đơn hàng #${orderDetail!['_id']}'),
      ),
      body: SingleChildScrollView(
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
                _buildInfoRow('Email', orderDetail!['userID']['email']),
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
          ],
        ),
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
}
