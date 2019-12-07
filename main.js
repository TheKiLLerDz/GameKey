CreateDB()
const {
  ipcRenderer
} = require('electron')
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
      username: localStorage.username,
      avatar: localStorage.avatar,
      password: '*'.repeat(localStorage.pwlength)
    },
    finished: false,
    steam: [],
    steamkey: [],
    uplay: [],
    uplaykey: [],
    infodialog: false,
    moreinfo:{
      Developer: 'Undefined',
      Publisher: 'Undefined',
      Genre: '',
      Price: '0'
    },
    origin: [],
    updatedb: {},
    originkey: [],
    others: [],
    otherskey: [],
    allkeys: [],
    temp: {},
    tempimport: undefined,
    import: false,
    waitingdialog: false,
    importedapps: [],
  },
})
v = new Vue({
  el: '#app',
  store,
  router,
  data: ({
    App: {
      version: '1.0',
      year: '2019'
    },
    Launch: false,
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
    Maximized: null,
    updatedb: []
  }),
  methods: {
    Minimize() {
      ipcRenderer.send('minimize-app');
    },
    Maximize() {
      this.Maximized = !this.Maximized;
      // var targLink = document.getElementById("demo");
      // var clickEvent = document.createEvent('MouseEvents');
      // clickEvent.initEvent('dblclick', true, true);
      // targLink.dispatchEvent(clickEvent);
    },
    Close() {
      ipcRenderer.send('close-app');
    },
    customFilter(item, queryText) {
      const textOne = item.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      const textTwo = String(item.appid).toLowerCase();
      const searchText = queryText.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1
    },
    ReadNotif(title, index) {
      this.updatedb.splice(index, 1);
    },
    Update(item) {
      this.updatedb[item].type == 'ND' ? updateDB(JSON.parse(localStorage.getItem("version"))) : this.updatedb[item].type == 'NA' ? console.log('very soon') : console.log('Link')
    },
    getNotif() {
      setTimeout(() => {
        if (store.state.updatedb.notifications != undefined)
          store.state.updatedb.notifications.forEach(el => {
            if (!el.value || el.value != 'true') {
              el.value = 'false';
              this.updatedb.push(el);
            }
          })
      }, 2000);
    },
  },
  computed: {
    userdata() {
      return {
        username: store.state.userdata.username,
        avatar: store.state.userdata.avatar,
        password: store.state.userdata.password
      }
    },
    games() {
      return store.state.steamkey.concat(store.state.uplaykey.concat(store.state.originkey
        .concat(store.state.otherskey)));
    }
  },
  beforeCreate() {
    opendb()
  },
  mounted() {
    if (!localStorage.Patterns) localStorage.Patterns = true;
    this.Maximized = screen.width == window.innerWidth && screen.height == window.innerHeight
    if (localStorage.theme) this.theme = localStorage.theme;
    if (localStorage.theme) this.isDark = (localStorage.Dark == 'true');
    this.windowWidth = window.innerWidth;
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth
      });
    })
    this.getNotif();
  },
  watch: {
    // Maximized(newValue) {
    //   console.log('newValue ' + newValue)
    //   newValue ? ipcRenderer.send('maximize-app') : ipcRenderer.send('unmaximize-app')
    // },
    windowWidth(newWidth, oldWidth) {
      //console.log(newWidth)
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