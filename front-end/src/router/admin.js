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
          },
          {
            path: "add",
            name: "admin-receipts-add",
            component: () => import("../pages/admin/receipts/add.vue"),
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
        ],
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
