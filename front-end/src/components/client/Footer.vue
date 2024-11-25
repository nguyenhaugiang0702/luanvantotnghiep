<template>
  <div class="container-fluid bg-primary">
    <div class="row mx-auto">
      <div class="col-sm-2 mt-4">
        <img class="w-100 bg-white rounded rounded-4" src="../../assets/images/logo1.png" alt="" />
        <h4 class="text-white mt-4 text-center">Website bán sách số 1 Việt Nam</h4>
      </div>

      <div class="col-sm-3 text-white mt-4">
        <h5 class="mb-4">Thông tin liên hệ</h5>
        <hr class="text-white" />
        <p><i class="fa-solid fa-phone fs-5"></i> : 0384804407</p>
        <p>
          <i class="fa-solid fa-location-dot fs-5"></i> : Khu II, Đ. 3 Tháng 2,
          Xuân Khánh, Ninh Kiều, Cần Thơ
        </p>
        <p>
          <i class="fa-solid fa-envelope fs-5"></i> : bookstore112233@gmail.com
        </p>
        <a href="#" class="text-decoration-none">
          <i
            class="fa-brands fa-facebook fs-3 text-white icon_footer_contact"
          ></i>
        </a>
        <a href="#" class="text-decoration-none">
          <i
            class="fa-brands fa-youtube ms-3 fs-3 text-white icon_footer_contact"
          ></i>
        </a>
        <a href="#" class="text-decoration-none">
          <i
            class="fa-brands fa-twitter ms-3 fs-3 text-white icon_footer_contact"
          ></i>
        </a>
      </div>

      <div class="col-sm-2 text-white mt-4">
        <h5 class="mb-4">Chính sách bán hàng</h5>
        <hr class="text-white" />
        <ul class="list-unstyled">
          <li>
            <p>Hướng dẫn mua hàng</p>
          </li>
          <li>
            <p>Hướng dẫn thanh toán</p>
          </li>
          <li>
            <p>Chính sách vận chuyển</p>
          </li>
          <li>
            <p>Điều khoản dịch vụ</p>
          </li>
          <li>
            <p>Chính sách bảo mật</p>
          </li>
          <li>
            <p>Chính sách đổi trả</p>
          </li>
        </ul>
      </div>

      <div class="col-sm-2 text-white mt-4">
        <h5 class="mb-4">Hỗ trợ khách hàng</h5>
        <hr class="text-white" />
        <ul class="list-unstyled">
          <li>
            <p>Trang chủ</p>
          </li>
          <li>
            <p>Cửa hàng</p>
          </li>
          <li>
            <p>Mã giảm giá</p>
          </li>
          <li>
            <p>Giới thiệu</p>
          </li>
          <li>
            <p>Liên hệ</p>
          </li>
        </ul>
      </div>

      <div class="col-sm-2 text-white mt-4">
        <h5 class="mb-4">Bản đồ</h5>
        <hr class="text-white" />
        <div id="map">
          <iframe
            class="w-100"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d245.55804535365044!2d105.76820174754104!3d10.02274050793034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1675434954291!5m2!1svi!2s"
            style="border: 0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
    <hr class="text-white" />
    <div class="row mx-auto">
      <div class="col-3"></div>
      <div class="col-5 text-center text-white">
        &copy 2024 My Website
      </div>
      <div class="col-3"></div>
      <div class="col-1 text-end">
        <a href="#top" class="text-decoration-none text-end"
          ><i class="fa-solid fa-arrow-up text-white fs-2"></i>
        </a>
      </div>
    </div>
    <!-- Chat component fixed at the bottom-right -->
    <div v-if="token" class="position-fixed bottom-0 end-0 p-2">
      <Chat v-if="token"/>
    </div>

  </div>

</template>
<script setup>
import Cookies from 'js-cookie'
import Chat from './Chat.vue';
// import ChatAI from './ChatAI.vue';

import {ref} from 'vue';
const token = Cookies.get("accessToken")
</script>