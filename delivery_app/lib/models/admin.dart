class Shipper {
  final String firstName; // Tên người dùng
  final String lastName; // Họ người dùng
  final String email; // Địa chỉ email
  final String password; // Mật khẩu
  final String role; // Vai trò của người dùng
  final String phoneNumber; // Số điện thoại

  // Constructor
  Shipper({
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.password,
    required this.role,
    required this.phoneNumber,
  });

  // Phương thức từ JSON
  factory Shipper.fromJson(Map<String, dynamic> json) {
    return Shipper(
      firstName: json['firstName'], // Lấy tên từ JSON
      lastName: json['lastName'], // Lấy họ từ JSON
      email: json['email'], // Lấy email từ JSON
      password: json['password'], // Lấy mật khẩu từ JSON (nếu có, thường không nên)
      role: json['roleID']['name'], // Lấy vai trò từ JSON
      phoneNumber: json['phoneNumber'], // Lấy số điện thoại từ JSON
    );
  }

  // Phương thức chuyển đổi sang JSON (nếu cần)
  Map<String, dynamic> toJson() {
    return {
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'password': password, // Cẩn thận với việc đưa mật khẩu vào JSON
      'roleID': {
        'name': role, // Lưu tên vai trò vào JSON
      },
      'phoneNumber': phoneNumber,
    };
  }
}
