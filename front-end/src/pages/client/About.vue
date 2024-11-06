<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-start"
      >
        <div class="d-flex flex-column mb-3 mb-md-0">
          <div class="fw-bold text-uppercase fs-5">Giới thiệu về chúng tôi</div>
          <div>NHG BOOKSTORE</div>
        </div>
        <div class="align-self-md-center">
          <div>
            <span @click="handleNavigate(router, 'about')">Trang chủ </span>
            <span>/ Giới thiệu</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container my-5">
    <!-- Tiêu đề -->
    <div class="text-center" v-motion-slide-visible-once-top>
      <h1 class="display-4 text-primary">Giới thiệu về NHG BOOKSTORE</h1>
      <p class="lead mt-3">
        NHG BOOKSTORE - Mang tri thức đến gần bạn, với sứ mệnh nâng cao văn hóa
        đọc và cung cấp các đầu sách chất lượng nhất cho khách hàng.
      </p>
    </div>

    <!-- Phần Giới Thiệu Chung -->
    <section class="about-section my-5" v-motion-slide-visible-once-bottom>
      <h2 class="text-dark">Giới thiệu chung</h2>
      <p>
        Được thành lập từ năm 2020, NHG BOOKSTORE cam kết cung cấp các đầu sách
        chất lượng thuộc nhiều thể loại, từ văn học, kỹ năng sống đến các sách
        khoa học và chuyên ngành. Chúng tôi luôn nỗ lực không ngừng để tạo nên
        một không gian văn hóa đọc hiện đại, nơi mọi người có thể dễ dàng tìm
        kiếm và tiếp cận tri thức.
      </p>
      <p>
        Với hệ thống cửa hàng hiện đại và đội ngũ nhân viên tận tâm, NHG
        BOOKSTORE mang đến một trải nghiệm mua sắm sách thân thiện, tiện lợi cho
        các bạn đọc yêu sách.
      </p>
    </section>

    <!-- Phần Sứ Mệnh và Tầm Nhìn -->
    <section class="mission-vision my-5" v-motion-slide-visible-once-bottom>
      <h2 class="text-dark">Sứ mệnh & Tầm nhìn</h2>
      <p>
        <strong>Sứ mệnh:</strong> Chúng tôi luôn phấn đấu để mang tri thức đến
        gần hơn với mọi người. Với sứ mệnh này, chúng tôi mong muốn truyền cảm
        hứng và tạo điều kiện tốt nhất cho người đọc nâng cao kiến thức và phát
        triển bản thân.
      </p>
      <p>
        <strong>Tầm nhìn:</strong> Trở thành nhà cung cấp sách hàng đầu và là
        điểm đến đáng tin cậy của mọi người yêu sách. Chúng tôi muốn xây dựng
        một hệ sinh thái văn hóa đọc thân thiện, lan tỏa niềm yêu thích sách đến
        cộng đồng.
      </p>
    </section>

    <!-- Phần Giá Trị Cốt Lõi Dạng Card -->
    <section
      class="mission-vision core-values my-5"
      v-motion-slide-visible-once-bottom
    >
      <h2 class="text-dark">Giá trị cốt lõi</h2>
      <div class="row">
        <div
          class="col-md-6 col-lg-3 mb-4"
          v-for="value in coreValues"
          :key="value.title"
        >
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title text-dark fw-bold">{{ value.title }}</h5>
              <p class="card-text">{{ value.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Thông Tin Liên Hệ -->
    <section class="contact-info my-5" v-motion-slide-visible-once-bottom>
      <h2 class="text-dark">Liên hệ với chúng tôi</h2>
      <p>
        NHG BOOKSTORE luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn. Hãy
        liên hệ với chúng tôi qua các kênh sau:
      </p>
      <ul>
        <li>
          Email:
          <a href="mailto:nhgbookstore@gmail.com">nhgbookstore@gmail.com</a>
        </li>
        <li>Điện thoại: <a href="tel:+84123456789">+84 384 484 407</a></li>
        <li>Địa chỉ: Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ</li>
      </ul>
    </section>

    <!-- Mạng xã hội -->
    <div
      class="text-center social-icons my-4"
      v-motion-slide-visible-once-bottom
    >
      <p>Theo dõi chúng tôi:</p>
      <a href="#" class="mx-2">
        <i class="fab fa-facebook fa-2x"></i>
      </a>
      <a href="#" class="mx-2">
        <i class="fab fa-twitter fa-2x"></i>
      </a>
      <a href="#" class="mx-2">
        <i class="fab fa-instagram fa-2x"></i>
      </a>
      <a href="#" class="mx-2">
        <i class="fab fa-linkedin fa-2x"></i>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
// Giá trị cốt lõi
const coreValues = ref([
  {
    title: "Chất lượng",
    description:
      "Chúng tôi luôn đảm bảo các đầu sách cung cấp đều có chất lượng cao nhất.",
  },
  {
    title: "Đổi mới",
    description:
      "Liên tục cập nhật những đầu sách mới, xu hướng đọc sách hiện đại.",
  },
  {
    title: "Khách hàng là trung tâm",
    description:
      "Luôn lắng nghe, đáp ứng và làm hài lòng mọi nhu cầu của khách hàng.",
  },
  {
    title: "Phát triển bền vững",
    description: "Cống hiến vì sự phát triển của cộng đồng và văn hóa đọc.",
  },
]);
</script>

<style scoped>
.social-icons a {
  color: #333;
  transition: color 0.3s;
}

.social-icons a:hover {
  color: #007bff;
}

.about-section,
.mission-vision,
.contact-info {
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

p,
ul {
  line-height: 1.7;
}
</style>
