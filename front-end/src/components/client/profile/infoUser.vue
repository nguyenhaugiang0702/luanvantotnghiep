<template>
  <h4>THÔNG TIN TÀI KHOẢN</h4>
  <form>
    <div class="form-group row mt-5">
      <label for="firstName" class="col-2">Họ*</label>
      <div class="col-8">
        <input
          type="text"
          class="form-control"
          id="firstName"
          placeholder="Nhập họ"
        />
      </div>
    </div>

    <div class="form-group row mt-4">
      <label for="lastName" class="col-2">Tên*</label>
      <div class="col-8">
        <input
          type="text"
          class="form-control"
          id="lastName"
          placeholder="Nhập tên"
        />
      </div>
    </div>
    <div class="form-group row mt-4">
      <label for="phone" class="col-2">Số điện thoại</label>
      <div class="col-8">
        <input
          type="tel"
          class="form-control"
          id="phone"
          placeholder="0384804407"
        />
      </div>
    </div>
    <div class="form-group row mt-4">
      <label for="email" class="col-2">Email</label>
      <div class="col-8">
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="Chưa có email"
        />
      </div>
    </div>
    <div class="form-group mt-4">
      <label>Giới tính*</label><br />
      <div class="mt-2">
        <label class="me-3"
          ><input type="radio" name="gender" value="male" /> Nam</label
        >
        <label><input type="radio" name="gender" value="female" /> Nữ</label>
      </div>
    </div>
    <div class="form-group row mt-4">
      <label for="birthday" class="col-2">Birthday*</label>
      <div class="col-8">
        <div class="row">
          <div class="col">
            <input type="text" class="form-control" placeholder="DD" />
          </div>
          <div class="col">
            <input type="text" class="form-control" placeholder="MM" />
          </div>
          <div class="col">
            <input type="text" class="form-control" placeholder="YYYY" />
          </div>
        </div>
      </div>
    </div>

    <div class="form-group row mt-4">
      <span class="col-2"></span>
      <label class="col-8"
        ><input
          type="checkbox"
          id="togglePassword"
          v-model="showPasswordSection"
        />
        Đổi mật khẩu</label
      >
    </div>

    <div
      class="password-section"
      id="passwordSection"
      v-if="showPasswordSection"
    >
      <div class="form-group row mt-4">
        <label for="currentPassword" class="col-2">Mật khẩu hiện tại*</label>
        <div class="col-8">
          <input
            type="password"
            class="form-control"
            id="currentPassword"
            placeholder="Mật khẩu hiện tại"
          />
        </div>
      </div>
      <div class="form-group row mt-4">
        <label for="newPassword" class="col-2">Mật khẩu mới*</label>
        <div class="col-8">
          <input
            type="password"
            class="form-control"
            id="newPassword"
            placeholder="Mật khẩu mới"
          />
        </div>
      </div>
      <div class="form-group row mt-4">
        <label for="confirmPassword" class="col-2"
          >Nhập lại mật khẩu mới*</label
        >
        <div class="col-8">
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <button type="submit" class="btn btn-primary mt-4 col-3 text-center">
        Lưu thay đổi
      </button>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const showPasswordSection = ref(false); // Trạng thái ẩn hiện phần đổi mật khẩu

    return {
      showPasswordSection,
    };
  },
};
</script>
