import 'package:delivery_app/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import '../../widgets/all_order_tab.dart';
import '../../widgets/delivered_order_tab.dart';
import '../../widgets/delivering_order_tab.dart';
import '../../widgets/shipper_info.dart';
import 'package:provider/provider.dart';
import '../../providers/order_provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  String _searchQuery = '';

  // Danh sách tiêu đề tương ứng với các tab
  final List<String> _titles = [
    'Tất cả đơn hàng',
    'Đơn đang giao',
    'Đã giao',
    'Thông tin shipper',
  ];

  @override
  void initState() {
    super.initState();
    // Fetch orders when screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<OrderProvider>().fetchOrders();
    });
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> _tabs = [
      AllOrdersTab(searchQuery: _searchQuery),
      DeliveringOrdersTab(searchQuery: _searchQuery),
      DeliveredOrdersTab(searchQuery: _searchQuery),
      ShipperInfo(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(
            _titles[_currentIndex]), // Cập nhật tiêu đề theo index hiện tại
      ),
      // body: IndexedStack(
      //   index: _currentIndex,
      //   children: _tabs,
      // ),
      body: Column(
        children: [
          if (_currentIndex < 3)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: TextField(
                onChanged: (value) {
                  setState(() {
                    _searchQuery = value; // Cập nhật giá trị tìm kiếm
                  });
                },
                decoration: const InputDecoration(
                  hintText: 'Tìm kiếm đơn hàng...',
                  prefixIcon: Icon(Icons.search),
                  border: OutlineInputBorder(),
                ),
              ),
            ),
          Expanded(
            child: IndexedStack(
              index: _currentIndex,
              children: _tabs.map((tab) {
                // Chuyển giá trị tìm kiếm tới từng tab
                if (tab is AllOrdersTab) {
                  return AllOrdersTab(searchQuery: _searchQuery);
                } else if (tab is DeliveringOrdersTab) {
                  return DeliveringOrdersTab(searchQuery: _searchQuery);
                } else if (tab is DeliveredOrdersTab) {
                  return DeliveredOrdersTab(searchQuery: _searchQuery);
                } else {
                  return tab;
                }
              }).toList(),
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
            _searchQuery = '';
          });
          context.read<OrderProvider>().fetchOrders();
          context.read<AuthProvider>().fetchShipperInfo();
        },
        selectedItemColor: Colors.black,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(
              icon: Icon(Icons.list), label: 'Tất cả đơn hàng'),
          BottomNavigationBarItem(
              icon: Icon(Icons.delivery_dining), label: 'Đơn đang giao'),
          BottomNavigationBarItem(icon: Icon(Icons.check), label: 'Đã giao'),
          BottomNavigationBarItem(
              icon: Icon(Icons.info), label: 'Thông tin shipper'),
        ],
      ),
    );
  }
}
