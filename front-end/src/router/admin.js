const admin = [
  
  // {
  //   path: "/forgotpassword",
  //   name: "forgotpassword",
  //   component: () => import("../pages/admin/teachers/forgot_password.vue"),
  // },
  // {
  //   path: '/resetpassword/:token',
  //   name: 'resetpassword',
  //   component: () => import("../pages/admin/teachers/resetpassword.vue"),
  // },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../layouts/admin/admin.vue"),
    prop: true,
    redirect: { name: "admin-users" },
    children: [
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

      // {
      //   path: "teachers",
      //   children: [
      //     {
      //       path: "",
      //       name: "admin-teachers",
      //       component: () => import("../pages/admin/teachers/index.vue"),
      //       prop: true,
      //     },
      //     {
      //       path: "changepassword",
      //       name: "admin-teachers-changepassword",
      //       component: () => import("../pages/admin/teachers/change_password.vue"),
      //     },
      //   ]
      // },
      // {
      //   path: "subjects/:id",
      //   name: "admin-questions",
      //   component: () => import("../pages/admin/questions/index.vue"),
      // },
      // {
      //   path: "subjects/random-question/:id",
      //   name: "admin-questions-random",
      //   component: () => import("../pages/admin/questions/random-question.vue"),
      // },
    ],
  },
];

export default admin;
