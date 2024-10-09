<template>
  <div class="container-fluid bg-primary py-4">
    <div class="container text-white">
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-start"
      >
        <div class="d-flex flex-column mb-3 mb-md-0">
          <div class="fw-bold text-uppercase fs-5">Chi tiết</div>
          <div>
            Thông tin chi tiết của <span class="fw-bold">{{ book.name }}</span>
          </div>
        </div>
        <div class="align-self-md-center">
          <div>
            <span @click="handleNavigate(router, 'home')">Trang chủ</span>
            /<span @click="handleNavigate(router, 'books')"> Cửa hàng</span> /
            <span>Chi tiết</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container py-4">
    <div class="row row2col">
      <div class="col-md-5 bg-white sticky-side" ref="leftContainer">
        <!-- Thêm padding-right -->
        <Carousel
          id="gallery"
          :items-to-show="1"
          :wrap-around="true"
          v-model="currentSlide"
        >
          <Slide v-for="(image, index) in book.images" :key="index">
            <div class="carousel__item">
              <a-image
                :src="`${config.imgUrl}/` + image.path"
                alt="Product Image"
                style="width: 65%"
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
            <div
              class="carousel__item"
              @click="slideTo(index)"
              :class="{ 'active-thumbnail': index === currentSlide }"
            >
              <img
                :src="`${config.imgUrl}/` + image.path"
                alt="Thumbnail"
                class="thumbnail-image border me-2"
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
                    formatPrice(
                      book.detail?.originalPrice - book.detail?.discountPrice
                    )
                  }}
                </span>
                <span class="text-decoration-line-through ms-2 fs-5">{{
                  formatPrice(book.detail?.originalPrice)
                }}</span>
                <span class="ms-2 badge text-bg-danger"
                  >{{ "-" + book.discountPercent + "%" }}
                </span>
                <span class="ms-2 fw-bold">(Giá dự kiến - Đang nhập hàng)</span>
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
              <div v-if="book.quantityImported !== 0">
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
                <button
                  @click="addToCart((method = 'BUYNOW'))"
                  class="btn btn-danger mt-3"
                >
                  Mua ngay
                </button>
                <button
                  @click="addToCart((method = 'ADDTOCART'))"
                  class="btn btn-primary mt-3 ms-3"
                >
                  Thêm vào giỏ
                </button>
              </div>
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
    <div v-if="book.quantityImported !== 0" class="row mt-3 bg-white">
      <Comment v-if="book.quantityImported !== 0" :bookID="bookID" />
    </div>
  </div>
</template>

<script setup>
import ApiUser from "@/service/user/apiUser.service";
import { formatPrice, handleNavigate } from "@/utils/utils";
import { ref, onMounted, computed, nextTick, inject, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import config from "@/config/index";
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { toast } from "vue3-toastify";
import Cookies from "js-cookie";
import Comment from "./Comment.vue";

const route = useRoute();
const router = useRouter();
const bookID = ref(route.params.bookID);
const apiUser = new ApiUser();
const book = ref({});

const currentSlide = ref(0);
const quantity = ref(1);

const isExpanded = ref(false);
const leftContainer = ref(null);
const rightContainer = ref(null);
const token = Cookies.get("accessToken");
const isLoggedIn = Cookies.get("isLoggedIn");
const updateCart = inject("updateCart");

// Chuyển động của ảnh
const slideTo = (val) => {
  currentSlide.value = val;
};

// Lấy thông tin sách
const getBook = async () => {
  const response = await apiUser.get(`/books/${bookID.value}`);
  if (response.status === 200) {
    book.value = response.data;
    isLongDescription.value = checkLongDescription(book.value.description);
  }
};

watch(
  () => route.params.bookID,
  async (newBookID) => {
    if (newBookID) {
      bookID.value = newBookID;
      await getBook();
    }
  },
  { immediate: true } // Đảm bảo gọi ngay khi component mount
);

const isLongDescription = ref(false);

const checkLongDescription = (description) => {
  // Tính chiều dài văn bản để xác định nếu quá dài
  const textLength = description.replace(/<[^>]*>/g, "").length; // Loại bỏ các thẻ HTML
  return textLength > 500; // Thay đổi giá trị này tùy theo yêu cầu của bạn
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
    const descriptionElement = document.querySelector(".description-container");
    if (descriptionElement) {
      if (isExpanded.value) {
        // Cuộn đến mô tả khi mở rộng
        descriptionElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        // Cuộn lên phần mô tả khi thu gọn
        window.scrollTo({
          top: descriptionElement.offsetTop,
          behavior: "smooth",
        });
      }
    }
  });
  document
    .querySelector(".description-container")
    .classList.toggle("expanded", isExpanded.value);
};

const addToCart = async (method) => {
  if (!token || !isLoggedIn) {
    toast("Vui lòng đăng nhập", {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
    return;
  }
  if (isNaN(quantity.value) || quantity.value < 1) {
    // Hiển thị lại số lượng hiện tại
    quantity.value = 1;
    return;
  }
  try {
    const data = {
      books: [
        {
          bookID: bookID.value,
          quantity: parseInt(quantity.value),
          price:
            parseInt(book.value.detail.originalPrice - book.value.detail.discountPrice),
        },
      ],
    };

    const response = await apiUser.post("/cart", data);
    if (response.status === 200) {
      toast(response.data.message, {
        theme: "auto",
        type: "success",
        dangerouslyHTMLString: true,
      });
      if (method === "BUYNOW") {
        router.push({ name: "cart" });
      } else {
        updateCart.value += 1;
      }
    }
  } catch (error) {
    toast(error.response?.data?.message, {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
  }
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
  border: 2px solid black !important;
  border-radius: 5px;
}

.active-thumbnail .thumbnail-image {
  border: 2px solid red !important;
}

.row2col {
  display: flex;
  flex-wrap: nowrap;
}

.sticky-side {
  position: sticky;
  top: 35px;
  overflow-y: auto;
  max-height: 656px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.product-info {
  /* margin-left: 10px; */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.description-container {
  position: relative;
  overflow: hidden; /* Đảm bảo nội dung không bị tràn ra ngoài khi thu gọn */
}

.description-content {
  max-height: 90px; /* Giới hạn chiều cao khi thu gọn */
  opacity: 1; /* Ẩn nội dung khi thu gọn */
  overflow: hidden; /* Ẩn phần nội dung ngoài chiều cao giới hạn */
  transition: max-height 0.5s ease, opacity 0.5s ease; /* Hiệu ứng mượt mà cho max-height và opacity */
}

.description-container.expanded .description-content {
  max-height: none; /* Đặt chiều cao đủ lớn để hiển thị toàn bộ nội dung */
  opacity: 1; /* Hiển thị nội dung khi mở rộng */
  transition: max-height 0.5s ease, opacity 0.5s ease; /* Hiệu ứng mượt mà cho max-height và opacity */
}

/* Media Query cho màn hình nhỏ */
@media (max-width: 768px) {
  .row2col {
    flex-direction: column; /* Sắp xếp lại theo chiều dọc khi màn hình nhỏ */
  }

  .sticky-side {
    max-height: none; /* Bỏ giới hạn chiều cao cho màn hình nhỏ */
    position: relative; /* Đổi lại vị trí */
    top: -10px;
  }

  .product-info {
    margin-top: 10px; /* Thêm khoảng cách giữa hai cột */
  }

  .description-container {
    max-height: none; /* Bỏ giới hạn chiều cao cho mô tả khi thu gọn */
  }

  .description-content {
    max-height: 300px; /* Cho phép chiều cao lớn hơn khi mở rộng */
  }
}
</style>
