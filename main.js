var routes = [{
  path: '/',
  component: httpVueLoader('./pages/Home.vue')
}, {
  path: '/keys',
  component: httpVueLoader('./pages/Keys.vue')
}, {
  path: '/keys/:searchvalue',
  component: httpVueLoader('./pages/Keys.vue'),
  props: true
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
    userdata: {
      username: 'TheKiLLerDz',
      pic: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/bc/bc562ea70469cfdb020f9a79ba1f08cc2e91bda0_full.jpg'
    },
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
    tempimport: undefined,
    import: false
  },
})
v = new Vue({
  store,
  router,
  data: ({
    loading: false,
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
        color: '#1d2f54',
        icon: 'mdi-home',
        link: '/'
      }, {
        title: 'All Keys',
        color: '#1d2f54',
        icon: 'mdi-key',
        link: '/keys'
      }, {
        title: 'Steam',
        color: '#1d2f54',
        icon: 'mdi-steam',
        link: '/steam'
      }, {
        title: 'Uplay',
        color: '#0e82cf',
        icon: 'mdi-ubisoft',
        link: '/uplay'
      },
      {
        title: 'Origin',
        color: '#eb6a00',
        icon: 'mdi-origin',
        link: '/origin'
      },
      {
        title: 'Other',
        color: 'black',
        icon: 'mdi-alert-circle',
        link: '/other'
      },
      {
        title: 'Settings',
        color: '#1d2f54',
        icon: 'mdi-settings',
        link: '/settings'
      },
      {
        title: 'About',
        color: '#1d2f54',
        icon: 'mdi-help-circle',
        link: '/about'
      }
    ],
    mini: false,
    keys: true,
    isDark: true,
  }),
  methods: {
    customFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = String(item.appid).toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1
    }
  },
  computed: {
    userdata() {
      return {
        username: store.state.userdata.username,
        pic: store.state.userdata.pic
      }
    },
    games() {
      return store.state.steamkey.concat(store.state.uplaykey.concat(store.state.originkey
        .concat(store.state.others)));
    }
  },
  beforeCreate() {
    opendb()
  },
  mounted() {
    if (localStorage.theme) this.theme = localStorage.theme;
  },
  watch: {
    theme(mytheme) {
      localStorage.theme = mytheme;
    }
  }
})