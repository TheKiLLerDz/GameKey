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
    import: false,
    importedapps: [],
  },
})
v = new Vue({
  store,
  router,
  data: ({
    App: {
      version: '1.0',
      year: '2019'
    },
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
        icon: 'mdi-home',
        link: '/'
      }, {
        title: 'All Keys',
        color: '#0e82cf',
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
        color: 'orange',
        icon: 'mdi-origin',
        link: '/origin'
      },
      {
        title: 'Other',
        color: 'success',
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
    keys: true,
    isDark: false,
    mini: false,
    windowWidth: 0,
    minimized: false,
  }),
  methods: {
    Minimize() {
      const {
        remote
      } = require('electron')
      remote.BrowserWindow.getFocusedWindow().minimize();
    },
    Maximize() {
      const {
        remote
      } = require('electron')
      var window = remote.BrowserWindow.getFocusedWindow();
      if (window.isMaximized()) {
        window.unmaximize();
        this.minimized = true
      } else {
        window.maximize();
        this.minimized = false
      }
    },
    Close() {
      const {
        remote
      } = require('electron')
      remote.BrowserWindow.getFocusedWindow().close();
    },
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
    if (localStorage.theme) this.isDark = (localStorage.Dark == 'true');
    this.windowWidth = window.innerWidth;
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth
      });
    })
  },
  watch: {
    windowWidth(newWidth, oldWidth) {
      if (newWidth >= 0.6 * screen.width) this.mini = false
      else this.mini = true
    },
    theme(mytheme) {
      localStorage.theme = mytheme;

    },
    isDark(value) {
      localStorage.Dark = value;
    }
  }
})