var routes = [{
  path: '/',
  component: httpVueLoader('./pages/Home.vue')
}, {
  path: '/keys',
  component: httpVueLoader('./pages/Keys.vue')
}, {
  path: '/steam',
  component: httpVueLoader('./pages/Keys.vue')
}, {
  path: '/origin',
  component: httpVueLoader('./pages/Keys.vue')
}, {
  path: '/uplay',
  component: httpVueLoader('./pages/Keys.vue')
}, {
  path: '/other',
  component: httpVueLoader('./pages/Keys.vue')
}, {
  path: '/settings',
  component: httpVueLoader('./pages/Settings.vue')
}, {
  path: '/about',
  component: httpVueLoader('./pages/About.vue')
}, ];
const router = new VueRouter({
  routes
});
getsteambdd()

store = new Vuex.Store({
  state: {
    steam: [],
    steamkey: [],
    uplay: [],
    uplaykey: [],
    origin: [],
    originkey: [],
    others: [],
  }

})


v = new Vue({
  el: '#app',
  store,
  router,
  data: ({
    show: true,
    items: [{
        title: 'Home',
        icon: 'mdi-home',
        link: '/'
      }, {
        title: 'All Keys',
        icon: 'mdi-key',
        link: '/keys'
      }, {
        title: 'Steam',
        icon: 'mdi-steam',
        link: '/steam'
      }, {
        title: 'Uplay',
        icon: 'mdi-ubisoft',
        link: '/uplay'
      },
      {
        title: 'Origin',
        icon: 'mdi-origin',
        link: '/origin'
      },
      {
        title: 'Other',
        icon: 'mdi-alert-circle',
        link: '/other'
      },
      {
        title: 'Settings',
        icon: 'mdi-settings',
        link: '/settings'
      },
      {
        title: 'About',
        icon: 'mdi-help-circle',
        link: '/about'
      }
    ],
    mini: false,
    keys: true,
  }),
 
})

