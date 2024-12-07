import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/order_provider.dart';
import '../screens/orders/order_detail_screen.dart';

class DeliveringOrdersTab extends StatelessWidget {
  final String searchQuery; 
  const DeliveringOrdersTab({super.key, required this.searchQuery});

  @override
  Widget build(BuildContext context) {
    return Consumer<OrderProvider>(
      builder: (context, orderProvider, child) {
        final deliveringOrders = orderProvider.orders
            .where((order) => order['status']['value'] == 6 && order['shipperID'] != null)
            .toList();
        if (orderProvider.loading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (deliveringOrders.isEmpty) {
          return const Center(
            child: Text('Không có đơn hàng nào'),
          );
        }

        final displayedOrders = searchQuery.isNotEmpty
            ? deliveringOrders.where((order) {
                final orderId = order['_id'].toString();
                final statusLabel = order['status']['label']?.toLowerCase() ?? '';
                final query = searchQuery.toLowerCase();
                // Filter orders based on whether the search query matches the order ID or status label
                return orderId.contains(query) || statusLabel.contains(query);
              }).toList()
            : deliveringOrders;

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: displayedOrders.length,
          itemBuilder: (context, index) {
            final order = displayedOrders[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 16),
              child: ListTile(
                title: Text('Mã đơn #${order['_id']}'),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Trạng thái: ${order['status']['label']}'),
                    Text(
                        'Hình thức thanh toán: ${order['payment'] ?? 'Không xác định'}'),
                  ],
                ),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () async {
                  // Navigate to OrderDetailsScreen and wait for it to close
                  await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => OrderDetailsScreen(order: order),
                    ),
                  );

                  // Refresh orders after returning
                  orderProvider.fetchOrders();
                },
              ),
            );
          },
        );
      },
    );
  }
}