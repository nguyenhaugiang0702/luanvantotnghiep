const client = [
  
  {
    path: "/",
    component: () => import("../layouts/client/client.vue"),
    redirect: { name: "home" },
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("../pages/client/Login.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("../pages/client/Register.vue"),
      },
      {
        path: "forgotPassword",
        name: "forgotPassword",
        component: () => import("../pages/client/ForgotPassword.vue"),
      },
      {
        path: "",
        name: "home",
        component: () => import("../pages/client/Home.vue"),
      },
      {
        path: "cart",
        name: "cart",
        component: () => import("../pages/client/Cart.vue"),
      },
      {
        path: "checkout",
        name: "checkout",
        component: () => import("../pages/client/CheckOut.vue"),
        meta: { requiresAuth: true, requiresAdmin: false },
      },
      {
        path: "thanks",
        name: "thanks",
        component: () => import("../pages/client/Thanks.vue"),
      },
      {
        path: "/books",
        name: "books",
        redirect: { name: "book-list" },
        children: [
          {
            path: "",
            name: "book-list",
            component: () => import("../pages/client/Books.vue"),
          },
          {
            path: "detail/:bookID",
            name: "book-detail",
            component: () => import("../pages/client/DetailBook.vue"),
            props: true,
          },
        ],
      },
      {
        path: "/customer/account/edit/",
        name: "profile",
        meta: { requiresAuth: true, requiresAdmin: false },
        redirect: { name: "profile-infoUser" },
        component: () => import("../layouts/client/profile.vue"),
        children: [
          {
            path: "",
            name: "profile-infoUser",
            component: () =>
              import("../components/client/profile/InfoUser.vue"),
          },
          {
            path: "changePassword",
            name: "profile-password",
            component: () =>
              import("../components/client/profile/ChangePassword.vue"),
          },
          {
            path: "address",
            name: "profile-address",
            redirect: { name: "profile-address-list" },
            children: [
              {
                path: "",
                name: "profile-address-list",
                component: () =>
                  import("../components/client/profile/address/index.vue"),
              },
              {
                path: "edit/:addressID",
                name: "profile-address-edit",
                component: () =>
                  import(
                    "../components/client/profile/address/editAddress.vue"
                  ),
              },
              {
                path: "add",
                name: "profile-address-add",
                component: () =>
                  import("../components/client/profile/address/addAddress.vue"),
              },
            ],
          },
          {
            path: "orders",
            name: "profile-orders",
            redirect: { name: "profile-orders-list" },
            children: [
              {
                path: "",
                name: "profile-orders-list",
                component: () =>
                  import("../components/client/profile/orders/MyOrders.vue"),
              },
              {
                path: "detail/:orderID",
                name: "profile-orders-detail",
                component: () =>
                  import("../components/client/profile/orders/DetailOrder.vue"),
              },
            ],
          },
        ],
      },
      {
        path: "notfound",
        component: () =>
          import("../pages/Notfound.vue"),
      },
    ],
  },
];

export default client;
