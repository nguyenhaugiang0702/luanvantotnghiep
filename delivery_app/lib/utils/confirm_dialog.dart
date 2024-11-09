import 'package:flutter/material.dart';

class ConfirmationDialog extends StatelessWidget {
  const ConfirmationDialog({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Xác nhận đăng xuất'),
      content: const Text('Bạn có chắc chắn muốn đăng xuất không?'),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop(false); 
          },
          child: const Text('Hủy'),
        ),
        TextButton(
          onPressed: () {
            Navigator.of(context).pop(true);
          },
          child: const Text('Đăng xuất'),
        ),
      ],
    );
  }
}
