<template>
  <div>
    <a-layout-header
      class="text-uppercase fw-bold sticky-top"
      style="background: #fff; padding: 0 20px"
    >
      Trang chủ
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Trang chủ</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <div class="row">
          <div class="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div class="dash-widget dash-widget5">
              <span class="float-left"
                ><img
                  src="../../assets/images/admin/books-home.png"
                  alt=""
                  style="width: 80px; height: 80px"
              /></span>
              <div class="dash-widget-info text-right">
                <span class="fs-5">Sách</span>
                <h3>{{ data.books }}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div class="dash-widget dash-widget5">
              <div class="dash-widget-info text-left d-inline-block">
                <span class="fs-5">Đơn hàng</span>
                <h3>{{ data.orders?.totalOrders }}</h3>
              </div>
              <span class="float-right"
                ><img
                  src="../../assets/images/admin/orders-home.png"
                  alt=""
                  style="width: 80px; height: 80px"
              /></span>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div class="dash-widget dash-widget5">
              <span class="float-left"
                ><img
                  src="../../assets/images/admin/users-home.png"
                  alt=""
                  style="width: 80px; height: 80px"
              /></span>
              <div class="dash-widget-info text-right">
                <span class="fs-5">Người dùng</span>
                <h3>{{ data.users?.totalUsers }}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div class="dash-widget dash-widget5">
              <div class="dash-widget-info d-inline-block text-left">
                <span class="fs-5">Thể loại</span>
                <h3>{{ data.categories?.totalCategories }}</h3>
              </div>
              <span class="float-right"
                ><img
                  src="../../assets/images/admin/categories-home.png"
                  alt=""
                  style="width: 80px; height: 80px"
              /></span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 d-flex">
            <div class="card flex-fill">
              <div class="card-header bg-white">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <div class="page-title fs-5 py-1">Khảo sát đơn hàng</div>
                  </div>
                </div>
              </div>
              <div class="card-body card-body-orders">
                <BarChartOrders :orders="data.orders"/>
              </div>
            </div>
          </div>
          
        </div>
        <div class="row my-4">
          <div class="col-lg-6 d-flex">
            <div class="card flex-fill">
              <div class="card-header bg-white">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <div class="page-title fs-5 py-1">Khảo sát thể loại</div>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <PieChartCategories :categories="data.categories"/>
              </div>
            </div>
          </div>
          <div class="col-lg-6 d-flex">
            <div class="card flex-fill">
              <div class="card-header bg-white">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <div class="page-title fs-5 py-1">Khảo sát người dùng</div>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <BarChartUsers :users="data.users"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-layout-content>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import BarChartOrders from "../../components/admin/charts/BarChart/BarChartOrders.vue";
import BarChartUsers from "../../components/admin/charts/BarChart/BarChartUsers.vue";
import PieChartCategories from "../../components/admin/charts/pie/PieChartCategories.vue";
import ApiAdminService from "@/service/admin/apiAdmin.service";
const apiAdmin = new ApiAdminService();
const data = ref({});
const getInfoAdminHomePage = async () => {
  const response = await apiAdmin.get("/home-page");
  if(response.status === 200){
    data.value = response.data;
    console.log(response.data);
  }
};

onMounted(()=>{
  getInfoAdminHomePage();
})
</script>
<style scoped>
.dash-widget-icon {
  border-radius: 100%;
  color: #777;
  display: inline-block;
  float: left;
  font-size: 30px;
  height: 66px;
  line-height: 66px;
  margin-right: 10px;
  text-align: center;
  width: 66px;
}
.dash-widget-info > h3 {
  font-size: 20px;
  font-weight: 600;
  margin-top: 15px;
}
.dash-widget-info > span {
  font-size: 15px;
}

.dash-widget {
  background-color: #fff;
  border: 1px solid #d5dbe1;
  border-radius: 4px;
  margin-bottom: 30px;
  padding: 20px;
  position: relative;
  box-shadow: 0 6px 15px rgba(36, 37, 38, 0.08);
}
.dash-widget2 {
  display: block;
  min-height: 90px;
  background: #fff;
  width: 100%;
  border-radius: 4px;
  margin-bottom: 30px;
  border: 1px solid #d5dbe1;
  box-shadow: 0 6px 15px rgba(36, 37, 38, 0.08);
}
.dash-widget2 .dash-widget-icon {
  border-radius: 4px 0 0 4px;
  display: block;
  float: left;
  height: 88px;
  width: 90px;
  text-align: center;
  font-size: 45px;
  line-height: 90px;
  color: #fff;
}
.dash-widget2 .dash-widget-info {
  padding: 11px 20px;
}
.dash-progress {
  margin-top: 15px;
}
.dash-progress h5 {
  margin-bottom: 0;
}
.dash-widget3 .dash-widget-icon {
  color: #fff;
  height: 60px;
  line-height: 60px;
  width: 60px;
}
.dash-widget4 .dash-widget-icon {
  color: #fff;
}
.dash-widget5 {
  display: flex;
  min-height: 90px;
  background: #fff;
  color: #333;
  width: 100%;
  border-radius: 10px;
  margin-bottom: 30px;
  border: 1px solid #d5dbe1;
  box-shadow: 0 6px 15px rgb(36 37 38/8%);
  justify-content: space-between;
  align-items: center;
}
.dash-widget5 .dash-widget-icon {
  border-radius: 50%;
  display: block;
  margin-top: 10px;
  float: left;
  height: 55px;
  width: 55px;
  text-align: center;
  font-size: 26px;
  line-height: 55px;
  color: #fff;
  border: 0 solid #2fdf84;
}
.dash-widget5 .dash-widget-info {
  padding: 11px 0;
}

.page-title {
  color: #000;
  padding-left: 10px;
  border-left: 5px solid;
  border-style: solid;
  border-width: 0;
  border-left-width: 5px;
  border-image: linear-gradient(180deg, #0d6efd 0%, #0d6efd 100%) 1;
}
</style>
