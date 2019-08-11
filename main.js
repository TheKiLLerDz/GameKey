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
    allkeys: [],
  },
})
getsteambdd();
v = new Vue({
  store,
  router,
  data: ({
    loading: false,
    search: null,
    select: null,
    theme:'theme--dark',
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
    games: ["counter", "half", "pubg"],
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
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val)
    }
  },
  methods: {
    querySelections(v) {
      this.loading = true
      this.games = this.games.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
      })
      this.loading = false

    }
  },
  beforeCreate: function () {
    getsteambdd();
  },

})