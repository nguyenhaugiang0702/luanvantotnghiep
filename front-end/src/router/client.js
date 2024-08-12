const client = [
  {
    path: "/",
    component: () => import("../layouts/client/client.vue"),
    // path: "/",
    // name: "Login",
    // // redirect: "/",
    // component: () => import("../pages/client/Login.vue"),
    children: [
        // {
        //     path: "",
        //     name: 'home',
        //     component: () => import("../pages/client/Home.vue"),
        // },
        // {
        //     path: "",
        //     name: 'home',
        //     component: () => import("../pages/client/Login.vue"),
        // },
        // {
        //     path: "books",
        //     name: 'booksPage',
        //     component: () => import("../pages/client/Book.vue"),
        // },
        // {
        //     path: "/books/:publisherId",
        //     name: 'books-filter-nxb',
        //     component: () => import("../pages/client/FilterNxb.vue"),
        //     props: true ,
        // },
        // {
        //     path: "/books/detail/:id",
        //     name: 'books-detail',
        //     component: () => import("../pages/client/Detail.vue"),
        // },
        // {
        //     path: "cart",
        //     name: 'cart',
        //     component: () => import("../pages/client/Cart.vue"),
        // },
        // {
        //     path: "checkout",
        //     name: 'checkout',
        //     component: () => import("../pages/client/CheckOut.vue"),
        // },
        {
            path: "/customer/account/edit/",
            name: 'profile',
            component: () => import("../layouts/client/profile.vue"),
            children: [
                {
                    path: "",
                    name: 'profile-infoUser',
                    component: () => import("../components/client/profile/infoUser.vue"),
                },
                // {
                //     path: "address",
                //     name: 'profile-address',
                //     component: () => import("../components/client/profile/address.vue"),
                // },
                // {
                //     path: "loanApplication",
                //     name: 'profile-loanApplication',
                //     component: () => import("../components/client/profile/borrowBook.vue"),
                // },
            ]
        },
    ],
  },
];

export default client;
