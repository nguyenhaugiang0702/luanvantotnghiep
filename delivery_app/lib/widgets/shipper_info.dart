import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../utils/confirm_dialog.dart';

class ShipperInfo extends StatelessWidget {
  const ShipperInfo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final shipper = context
        .read<AuthProvider>()
        .shipper;

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Card(
        elevation: 4, // Độ cao bóng của Card
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10), // Bo tròn các góc
        ),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Thông tin của tôi',
                style: Theme.of(context)
                    .textTheme
                    .titleLarge
                    ?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              _buildInfoRow('Mã:', shipper['_id'] ?? 'Chưa có mã'),
              _buildInfoRow('Họ:', shipper['firstName'] ?? 'Chưa có tên'),
              _buildInfoRow('Tên:', shipper['lastName'] ?? 'Chưa có tên'),
              _buildInfoRow('Email:', shipper['email'] ?? 'Chưa có email'),
              _buildInfoRow('Số điện thoại:',
                  shipper['phoneNumber'] ?? 'Chưa có số điện thoại'),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () async {
                  bool? confirmLogout = await showDialog<bool>(
                    context: context,
                    builder: (BuildContext context) {
                      return const ConfirmationDialog();
                    },
                  );
                  // Kiểm tra nếu người dùng chọn đăng xuất
                  if (confirmLogout == true) {
                    await context.read<AuthProvider>().logout();
                    // Có thể điều hướng đến màn hình đăng nhập sau khi đăng xuất
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF42A5F5),
                  padding: const EdgeInsets.symmetric(
                      vertical: 12, horizontal: 24), // Padding cho nút
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30), // Bo tròn nút
                  ),
                ),
                child: const Text(
                  'Đăng xuất',
                  style: TextStyle(color: Colors.white), // Đặt màu chữ
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Hàm để xây dựng các hàng thông tin
  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
          Expanded(
            child: Text(value, textAlign: TextAlign.right),
          ),
        ],
      ),
    );
  }
}
