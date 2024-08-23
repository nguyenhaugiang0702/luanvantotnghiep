<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold"
      style="background: #fff; padding: 0 20px"
    >
      Quản lý nhà xuất bản
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Nhà xuất bản</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Thêm</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <form @submit.prevent="">
          <div class="row">
            <div class="form-group col-sm-6">
              <label class="form-label" for="name">Tên nhà xuất bản</label>
              <input
                class="form-control"
                type="text"
                name="name"
                id="name"
                placeholder="Nhập tên nhà cung cấp"
              />
              <!-- <ErrorMessage name="name" class="invalid-feedback" /> -->
            </div>
            <div class="form-group col-sm-6">
              <label class="form-label" for="email">Địa chỉ email</label>
              <input
                class="form-control"
                type="text"
                name="email"
                id="email"
                placeholder="Nhập địa chỉ email"
              />
              <!-- <ErrorMessage name="email" class="invalid-feedback" /> -->
            </div>
          </div>
          <div class="row mt-4">
            <div class="form-group col-sm-6">
              <label class="form-label" for="address">Địa chỉ</label>
              <input
                class="form-control"
                type="text"
                name="address"
                id="address"
                placeholder="Nhập địa chỉ"
              />
              <!-- <ErrorMessage name="address" class="invalid-feedback" /> -->
            </div>
            <div class="form-group col-sm-6">
              <label class="form-label" for="phoneNumber">Số điện thoại</label>
              <input
                class="form-control"
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Nhập số điện thoại"
              />
              <ErrorMessage name="phoneNumber" class="invalid-feedback" />
            </div>
          </div>
          <div class="row mt-5 d-flex justify-content-center">
            <button type="submit" class="btn btn-primary col-sm-1">Lưu</button>
          </div>
        </form>
      </div>
    </a-layout-content>
  </div>
</template>
