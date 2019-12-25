const {
  ipcRenderer
} = require('electron')

ipcRenderer.on('isMaximized', (event, value) => {
  v.Maximized = value;
})

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
    dbupdated: false,
    dbCleared: false,
    userdata: {
      username: localStorage.username,
      email: localStorage.email,
      avatar: localStorage.avatar,
      password: localStorage.password,
    },
    checkconnection: false,
    finished: false,
    steam: [],
    notifications: [],
    version: {},
    steamkey: [],
    uplay: [],
    uplaykey: [],
    infodialog: false,
    moreinfo: {
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
    theme: 'theme--default',
    themes: [{
      name: 'Default Theme',
      color: 'success',
      class: 'theme--default',
    }, {
      name: 'Green Theme',
      color: 'success',
      class: 'theme--green',
    }, {
      name: 'Blue Theme',
      color: 'blue',
      class: 'theme--blue',
    }, {
      name: 'Orange Theme',
      color: 'orange',
      class: 'theme--orange',
    }, {
      name: 'Red Theme',
      color: 'red',
      class: 'theme--red',
    }],
    selected: null,
    search: null,
    settingstab: false,
    show: true,
    items: [{
        title: 'Home',
        icon: 'mdi-home',
        color: '#0e82cf',
        link: '/'
      }, {
        title: 'All Keys',
        color: '#00acc1',
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
        color: '#0e82cf',
        icon: 'mdi-settings',
        link: '/settings'
      },
      {
        title: 'About',
        color: 'error',
        icon: 'mdi-help-circle',
        link: '/about'
      }
    ],
    keys: true,
    isDark: false,
    mini: false,
    windowWidth: 0,
    Maximized: null,
    appupdated: false
  }),
  methods: {
    Minimize() {
      ipcRenderer.send('minimize-app');
    },
    Maximize() {
      ipcRenderer.send('maximize-app');
    },
    Close() {
      localStorage.width = window.innerWidth;
      localStorage.height = window.innerHeight;
      ipcRenderer.send('close-app');
    },
    LogOut() {
      localStorage.AutoLogin = false;
      ipcRenderer.send('Log-Out');
    },
    setSize() {
      if (localStorage.width && localStorage.height) {
        width = parseInt(localStorage.width);
        height = parseInt(localStorage.height);
        ipcRenderer.send('setSize', width, height);
      }
    },
    customFilter(item, queryText) {
      const textOne = item.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      const textTwo = String(item.appid).toLowerCase();
      const searchText = queryText.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1
    },
    ReadNotif(title, index) {
      this.notifications.splice(index, 1);
    },
    Update(index) {
      switch (this.notifications[index].type) {
        case 'ND':
          updateDB(JSON.parse(localStorage.getItem("version")));
          break;
        case 'NA':
          console.log('Comming soon')
          break;
        default:
          console.log('Link')
      }
    },
    getNotif() {
      if (store.state.updatedb.notifications != undefined)
        store.state.updatedb.notifications.forEach(el => {
          if (!el.value || el.value != 'true') {
            el.value = 'false';
            store.state.notifications.push(el);
          }
        })
    },
    RetryConnection() {
      opendb();
      store.state.checkconnection = false;
    }
  },
  computed: {
    dbupdated() {
      return store.state.dbupdated
    },
    updatedb() {
      return store.state.updatedb
    },
    notifications() {
      return store.state.notifications
    },
    checkconnection() {
      return store.state.checkconnection
    },
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
  mounted() {
    opendb();
    this.setSize();
    if (!localStorage.Patterns) localStorage.Patterns = true;
    this.Maximized = screen.width == window.innerWidth && screen.height == window.innerHeight
    if (localStorage.theme) this.theme = localStorage.theme;
    else this.theme = "theme--default"
    if (localStorage.Dark) this.isDark = (localStorage.Dark == 'true');
    this.windowWidth = window.innerWidth;
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth
      });
    })
  },
  watch: {
    Launch(value) {
      if (value)
        if (parseFloat(this.App.version) > parseFloat(JSON.parse(localStorage.getItem('version')).app)) {
          Appupdated(this.App.version);
          this.appupdated = true;
        }
    },
    appupdated(value) {
      if (!value) {
        store.state.notifications = [];
        getnotification(JSON.parse(localStorage.getItem('version')));
      }
    },
    dbupdated(value) {
      if (!value) {
        store.state.notifications = [];
        getnotification(JSON.parse(localStorage.getItem('version')));
      }
    },
    updatedb() {
      this.getNotif();
    },
    windowWidth(newWidth, oldWidth) {
      if (newWidth >= 0.6 * screen.width) this.mini = false
      else this.mini = true
      ipcRenderer.send('isMaximized');
    },
    theme(mytheme) {
      localStorage.theme = mytheme;
    },
    isDark(value) {
      localStorage.Dark = value;
    }
  }
})