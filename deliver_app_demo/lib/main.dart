import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import './screens/auth/login_screen.dart';
import 'screens/orders/order_screen.dart';
import 'services/dio_service.dart';
import 'providers/auth_provider.dart';
import 'providers/order_provider.dart';
import 'services/auth_service.dart';
import 'services/order_service.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load();
  // Khởi tạo DioBase
  final dioBase = DioBase();

  runApp(MyApp(dioBase: dioBase));
}

class MyApp extends StatelessWidget {
  final DioBase dioBase;

  const MyApp({
    super.key,
    required this.dioBase,
  });

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider(AuthService(dioBase)),
        ),
        ChangeNotifierProvider(
          create: (_) => OrderProvider(OrderService(dioBase)),
        ),
      ],
      child: MaterialApp(
        // title: 'Giao Hàng App',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.blue,
          scaffoldBackgroundColor: Colors.white,
          fontFamily: 'Lato',
          appBarTheme: const AppBarTheme(
            elevation: 0,
            backgroundColor: Colors.blue,
            iconTheme: IconThemeData(color: Colors.white),
            titleTextStyle: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
              fontFamily: 'Lato',
            ),
          ),
          textTheme: const TextTheme(
            displayLarge: TextStyle(
                fontFamily: 'Anton',
                fontSize: 32,
                fontWeight: FontWeight.bold), // Anton for large titles
            titleLarge: TextStyle(
                fontFamily: 'Anton',
                fontSize: 24,
                fontWeight: FontWeight.bold), // Anton for specific sub-titles
          ),
        ),
        home: Consumer<AuthProvider>(
          builder: (context, authProvider, child) {
            return authProvider.isLoggedIn
                ? const HomeScreen()
                : const LoginScreen();
          },
        ),
      ),
    );
  }
}
