<template>
  <div class="bg-secondary-subtle py-5">
    <div class="container">
      <div class="row">
        <div class="col-md-5 bg-white sticky-side" ref="leftContainer">
          <!-- Thêm padding-right -->
          <Carousel
            id="gallery"
            :items-to-show="1"
            :wrap-around="false"
            v-model="currentSlide"
          >
            <Slide v-for="(image, index) in book.images" :key="index">
              <div class="carousel__item">
                <img
                  :src="`${config.imgUrl}/` + image.path"
                  alt="Product Image"
                  class="carousel-image"
                />
              </div>
            </Slide>
          </Carousel>

          <Carousel
            id="thumbnails"
            :items-to-show="4"
            :wrap-around="true"
            v-model="currentSlide"
            ref="carousel"
          >
            <Slide v-for="(image, index) in book.images" :key="index">
              <div class="carousel__item" @click="slideTo(index)">
                <img
                  :src="`${config.imgUrl}/` + image.path"
                  alt="Thumbnail"
                  class="thumbnail-image border border-dark me-2"
                />
              </div>
            </Slide>
          </Carousel>
        </div>

        <div class="col-md-7 product-info" ref="rightContainer">
          <div class="container">
            <div class="row bg-white">
              <div class="container py-3">
                <h2>{{ book.name }}</h2>
                <p class="font-weight-bold">
                  <span class="fs-3 fw-bold text-danger">
                    {{
                      formatCurrency(
                        book.detail?.originalPrice - book.detail?.discountPrice
                      )
                    }}
                  </span>
                  <span class="text-decoration-line-through ms-2 fs-5">{{
                    formatCurrency(book.detail?.discountPrice)
                  }}</span>
                  -25%
                </p>
                <div class="row">
                  <div class="col">
                    <p>Nhà cung cấp: Nhà Xuất Bản Kim Đồng</p>
                  </div>
                  <div class="col">
                    <p>Tác giả: {{ book.authorID?.name }}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <p>Nhà xuất bản: {{ book.publisherID?.name }}</p>
                  </div>
                  <div class="col">
                    <p>Năm XB: {{ book.detail?.publisherYear }}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <p>Trọng lượng: {{ book.detail?.weight }} g</p>
                  </div>
                  <div class="col">
                    <p>
                      Kích thước: {{ book.detail?.length }} x
                      {{ book.detail?.width }} cm
                    </p>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <p>Hình thức: {{ book.formalityID?.name }}</p>
                  </div>
                  <div class="col">
                    <p>Số trang: {{ book.detail?.pageNumber }}</p>
                  </div>
                </div>

                <div class="rating">★★★★★ (5 đánh giá)</div>
                <!-- Bootstrap component for quantity -->
                <div class="d-flex align-items-center mt-3">
                  <label for="quantity" class="me-2">Số lượng:</label>
                  <div class="input-group" style="width: 180px">
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="decreaseQuantity"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      class="form-control text-center border border-3"
                      v-model="quantity"
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="increaseQuantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button class="btn btn-danger mt-3">Mua ngay</button>
                <button class="btn btn-primary mt-3 ms-3">Thêm vào giỏ</button>
              </div>
            </div>
            <!-- Phần mô tả sản phẩm có thể cuộn -->
            <div class="row bg-white mt-3">
              <div class="container">
                <div
                  class="mt-4 description-container"
                  :class="{ expanded: isExpanded }"
                >
                  <h3>Mô tả sản phẩm</h3>
                  <!-- Phần mô tả sản phẩm có thể cuộn -->
                  <div
                    class="description-content"
                    v-html="book.description"
                  ></div>
                  <button
                    v-if="isLongDescription"
                    @click="toggleDescription"
                    class="btn btn-link"
                  >
                    {{ isExpanded ? "Thu gọn" : "Xem thêm" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BookService from "@/service/book.service";
import { ref, onMounted, computed, nextTick } from "vue";
import { useRoute } from "vue-router";
import config from "@/config/index";
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
const route = useRoute();
const bookID = route.params.bookID;
const bookService = new BookService();
const book = ref({});

const currentSlide = ref(0);
const quantity = ref(1);

const isExpanded = ref(false);
const leftContainer = ref(null);
const rightContainer = ref(null);
const initialLeftHeight = ref(null);

// Chuyển động của ảnh
const slideTo = (val) => {
  currentSlide.value = val;
};

// Lấy thông tin sách
const getBook = async () => {
  const response = await bookService.get(`/${bookID}`);
  if (response.status === 200) {
    book.value = response.data;
    isLongDescription.value = checkLongDescription(book.value.description);
  }
};

const isLongDescription = ref(false);

const checkLongDescription = (description) => {
  // Tính chiều dài văn bản để xác định nếu quá dài
  const textLength = description.replace(/<[^>]*>/g, "").length; // Loại bỏ các thẻ HTML
  return textLength > 500; // Thay đổi giá trị này tùy theo yêu cầu của bạn
};

// Hàm định dạng tiền
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// Hàm tăng số lượng sản phẩm
const increaseQuantity = () => {
  quantity.value++;
};

// Hàm giảm số lượng sản phẩm
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const toggleDescription = () => {
  isExpanded.value = !isExpanded.value;
  nextTick(() => {
    // Cập nhật chiều cao của phần bên trái để đồng bộ với phần bên phải khi mở rộng hoặc thu gọn
    const rightHeight = rightContainer.value?.scrollHeight || 0;
    if (leftContainer.value) {
      leftContainer.value.style.height = isExpanded.value
        ? `${rightHeight}px`
        : '656px';
    }
  });
  document
    .querySelector(".description-container")
    .classList.toggle("expanded", isExpanded.value);
};

// Kiểm tra mô tả và tách ra phần đầu và phần còn lại
onMounted(() => {
  getBook();
});
</script>

<style scoped>
.carousel-image {
  width: 100%;
  height: auto;
}

.thumbnail-image {
  width: 90px;
  height: 110px;
  cursor: pointer;
}

.sticky-side {
  position: sticky;
  top: 65px;
  overflow: auto;
}

.product-info {
  overflow-y: auto;
}

.description-container {
  position: relative;
  overflow: hidden; /* Đảm bảo nội dung không bị tràn ra ngoài khi thu gọn */
}

.description-content {
  max-height: 65px; /* Giới hạn chiều cao khi thu gọn */
  opacity: 1; /* Ẩn nội dung khi thu gọn */
  overflow: hidden; /* Ẩn phần nội dung ngoài chiều cao giới hạn */
  transition: max-height 0.5s ease, opacity 0.5s ease; /* Hiệu ứng mượt mà cho max-height và opacity */
}

.description-container.expanded .description-content {
  max-height: 1000px; /* Đặt chiều cao đủ lớn để hiển thị toàn bộ nội dung */
  opacity: 1; /* Hiển thị nội dung khi mở rộng */
  transition: max-height 0.5s ease, opacity 0.5s ease; /* Hiệu ứng mượt mà cho max-height và opacity */
}
</style>
