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

const store = new Vuex.Store({
  state: {
    finished: false,
    steam: [],
    steamkey: [],
    uplay: [],
    uplaykey: [],
    origin: [],
    originkey: [],
    others: [],
    otherskey: [],
    allkeys: [],
    temp: {},
  },
})
v = new Vue({
  store,
  router,
  data: ({
    loading: false,
    games: [],
    theme: '',
    themes: [{
        name: 'Dark Theme',
        color: 'dark',
        class: 'theme--dark',
      },
      {
        name: 'Light Theme',
        color: 'success',
        class: 'theme--light',
      }, {
        name: 'Blue Theme',
        color: 'blue',
        class: 'theme--blue',
      }
    ],
    selected: null,
    search: null,
    settingstab: false,
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
    isDark: true,
  }),
  beforeCreate() {
    opendb()
  },
  mounted() {
    this.games = store.state.steamkey.concat(store.state.uplaykey.concat(store.state.originkey
      .concat(store.state.otherskey)));
    if (localStorage.theme) this.theme = localStorage.theme;
  },
  watch: {
    theme(mytheme) {
      localStorage.theme = mytheme;
    }
  }
})