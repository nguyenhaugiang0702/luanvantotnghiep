import { useAuthStore } from "@/stores/auth";

const admin = [
  {
    path: "/admin/login",
    name: "admin-login",
    component: () => import("../components/admin/Login.vue"),
    prop: true,
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../layouts/admin/admin.vue"),
    prop: true,
    meta: { requiresAuth: true, requiresAdmin: true },
    redirect: { name: "admin-home" },
    children: [
      {
        path: "",
        name: "admin-home",
        component: () => import("../pages/admin/Home.vue"),
        prop: true,
      },
      {
        path: "users",
        name: "admin-users",
        component: () => import("../pages/admin/users/index.vue"),
        prop: true,
      },
      {
        path: "categories",
        name: "admin-categories",
        component: () => import("../pages/admin/categories/index.vue"),
        prop: true,
      },
      {
        path: "formalities",
        name: "admin-formalities",
        component: () => import("../pages/admin/formalities/index.vue"),
        prop: true,
      },
      {
        path: "suppliers",
        name: "admin-suppliers",
        children: [
          {
            path: "",
            name: "admin-suppliers-list",
            component: () => import("../pages/admin/suplliers/index.vue"),
          },
          {
            path: "add",
            name: "admin-suppliers-add",
            component: () => import("../pages/admin/suplliers/add.vue"),
            props: true,
          },
          {
            path: "edit/:supplierID",
            name: "admin-suppliers-edit",
            component: () => import("../pages/admin/suplliers/edit.vue"),
            props: true,
          },
        ],
      },
      {
        path: "receipts",
        name: "admin-receipts",
        children: [
          {
            path: "",
            name: "admin-receipts-list",
            component: () => import("../pages/admin/receipts/index.vue"),
            props: true,
          },
          {
            path: "add",
            name: "admin-receipts-add",
            component: () => import("../pages/admin/receipts/add.vue"),
            props: true,
          },
          {
            path: "detail/:receiptID",
            name: "admin-receipts-detail",
            component: () =>
              import("../pages/admin/receipts/receiptDetail.vue"),
            props: true,
          },
        ],
      },
      {
        path: "authors",
        name: "admin-authors",
        redirect: { name: "admin-authors-list" },
        children: [
          {
            path: "",
            name: "admin-authors-list",
            component: () => import("../pages/admin/authors/index.vue"),
            props: true,
          },
        ],
      },
      {
        path: "account/edit",
        name: "admin-account",
        redirect: { name: "admin-account-info" },
        children: [
          {
            path: "",
            name: "admin-account-info",
            component: () => import("../pages/admin/account/Info.vue"),
            props: true,
          },
          {
            path: "changePassword",
            name: "admin-account-changePassword",
            component: () => import("../pages/admin/account/changePassword.vue"),
            props: true,
          },
        ],
      },
      {
        path: "priceranges",
        name: "admin-priceranges",
        redirect: { name: "admin-priceranges-list" },
        children: [
          {
            path: "",
            name: "admin-priceranges-list",
            component: () => import("../pages/admin/priceranges/index.vue"),
            props: true,
          },
        ],
      },
      {
        path: "publishers",
        name: "admin-publishers",
        redirect: { name: "admin-publishers-list" },
        children: [
          {
            path: "",
            name: "admin-publishers-list",
            component: () => import("../pages/admin/publishers/index.vue"),
            props: true,
          },
          {
            path: "add",
            name: "admin-publishers-add",
            component: () => import("../pages/admin/publishers/add.vue"),
            props: true,
          },
          {
            path: "edit/:publisherID",
            name: "admin-publishers-edit",
            component: () => import("../pages/admin/publishers/edit.vue"),
            props: true,
          },
        ],
      },
      {
        path: "books",
        name: "admin-books",
        redirect: { name: "admin-books-list" },
        children: [
          {
            path: "",
            name: "admin-books-list",
            component: () => import("../pages/admin/books/index.vue"),
            props: true,
          },
          {
            path: "add",
            name: "admin-books-add",
            component: () => import("../pages/admin/books/add.vue"),
            props: true,
          },
          {
            path: "edit/:bookID",
            name: "admin-books-edit",
            component: () => import("../pages/admin/books/edit.vue"),
            props: true,
          },
          {
            path: "edit/detail/:bookID",
            name: "admin-books-edit-detail",
            component: () => import("../pages/admin/books/editDetail.vue"),
            props: true,
          },
        ],
      },
      {
        path: "statics-of-report",
        name: "admin-statics-of-report",
        redirect: { name: "admin-stock-product" },
        children: [
          {
            path: "revenue",
            name: "admin-revenue-statistics",
            component: () => import("../pages/admin/statistic/revenue.vue"),
            props: true,
          },
          {
            path: "profit",
            name: "admin-profit-statistics",
            component: () => import("../pages/admin/statistic/profit.vue"),
            props: true,
          },
          {
            path: "stock-product",
            name: "admin-stock-product",
            component: () =>
              import("../pages/admin/statistic/stockProduct.vue"),
            props: true,
          },
        ],
      },
      // {
      //   path: "statics-of-report",
      //   name: "admin-chats",
      //   component: () => import("../pages/admin/chats/index.vue"),
      // },
      {
        path: "orders",
        name: "admin-orders",
        redirect: { name: "admin-orders-list" },
        children: [
          {
            path: "",
            name: "admin-orders-list",
            component: () => import("../pages/admin/orders/index.vue"),
            props: true,
          },
          {
            path: "detail/:orderID",
            name: "admin-order-detail",
            component: () => import("../pages/admin/orders/detailOrder.vue"),
            props: true,
          },
        ],
      },
      {
        path: "comments",
        name: "admin-comments",
        redirect: { name: "admin-comments-list" },
        children: [
          {
            path: "",
            name: "admin-comments-list",
            component: () => import("../pages/admin/comments/index.vue"),
            props: true,
          },
        ],
      },
      {
        path: "chats",
        name: "admin-chats",
        component: () => import("../pages/admin/chats/index.vue"),
      },
      {
        path: "chats/chat/:chatRoomID",
        name: "admin-chats-room",
        component: () => import("../pages/admin/chats/chatPage.vue"),
        props: true,
      },
      {
        path: "role-management",
        name: "admin-role-management",
        redirect: { name: "admin-role-management-list" },
        children: [
          {
            path: "employee",
            name: "admin-role-management-employee",
            component: () =>
              import("../pages/admin/role-management/roleListEmployee.vue"),
            props: true,
          },
        ],
      },
      {
        path: "vouchers",
        name: "admin-vouchers",
        redirect: { name: "admin-vouchers-list" },
        children: [
          {
            path: "",
            name: "admin-vouchers-list",
            component: () => import("../pages/admin/vouchers/index.vue"),
            props: true,
          },
          {
            path: "voucherCategory",
            name: "admin-vouchers-voucherCategory-list",
            component: () =>
              import("../pages/admin/vouchers/voucherCategory.vue"),
            props: true,
          },
        ],
      },
    ],
  },
  {
    path: "/notfound",
    name: "notfound",
    component: () => import("../pages/Notfound.vue"),
  },
];

export default admin;
