import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/order_provider.dart';

class AllOrdersTab extends StatelessWidget {
  final String searchQuery; 
  const AllOrdersTab({super.key, required this.searchQuery});

  @override
  Widget build(BuildContext context) {
    return Consumer<OrderProvider>(
      builder: (context, orderProvider, child) {
        if (orderProvider.loading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (orderProvider.orders.isEmpty) {
          return const Center(
            child: Text('Không có đơn hàng nào'),
          );
        }

        final displayedOrders = searchQuery.isNotEmpty
            ? orderProvider.orders.where((order) {
                final orderId = order['_id'].toString();
                final statusLabel = order['status']['label']?.toLowerCase() ?? '';
                final query = searchQuery.toLowerCase();
                // Filter orders based on whether the search query matches the order ID or status label
                return orderId.contains(query) || statusLabel.contains(query);
              }).toList()
            : orderProvider.orders;

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: displayedOrders.length,
          itemBuilder: (context, index) {
            final order = displayedOrders[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 16),
              child: ListTile(
                title: Text('Đơn hàng #${order['_id']}'),
                subtitle: Text('Trạng thái: ${order['status']['label']}'),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () {
                  // Navigate to order details
                },
              ),
            );
          },
        );
      },
    );
  }
}