const client = [
  {
    path: "/",
    component: () => import("../layouts/client/client.vue"),
    redirect: { name: "home" },
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("../pages/client/Login_SignUp.vue"),
      },
      {
        path: "",
        name: "home",
        component: () => import("../pages/client/Home.vue"),
      },
      {
        path: "/customer/account/edit/",
        name: "profile",
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
            component: () => import("../components/client/profile/Address.vue"),
          },
        ],
      },
    ],
  },
];

export default client;
