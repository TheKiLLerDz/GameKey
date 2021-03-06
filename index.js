var routes = [{
  path: '/',
  component: httpVueLoader('./templates/Home.vue')
}, {
  path: '/keys',
  component: httpVueLoader('./templates/Keys.vue')
}, {
  path: '/keys/:searchvalue',
  component: httpVueLoader('./templates/Keys.vue'),
  props: true
}, {
  path: '/steam',
  component: httpVueLoader('./templates/Keys.vue')
}, {
  path: '/origin',
  component: httpVueLoader('./templates/Keys.vue')
}, {
  path: '/uplay',
  component: httpVueLoader('./templates/Keys.vue')
}, {
  path: '/other',
  component: httpVueLoader('./templates/Keys.vue')
}, {
  path: '/settings',
  component: httpVueLoader('./templates/Settings.vue')
}, {
  path: '/about',
  component: httpVueLoader('./templates/About.vue')
}, ];
const router = new VueRouter({
  routes
});

Vue.component("icon", httpVueLoader("icon.vue"))

const store = new Vuex.Store({
  state: {
    App: {
      website: App.website,
      Facebook: App.Facebook,
      Twitter: App.Twitter,
      Instagram: App.Instagram,
      Patreon: App.Patreon,
      Donations: App.Donations,
      Paypal: App.Paypal,
      OpenCollective: App.OpenCollective,
      Steam: App.Steam,
      version: '2.0',
      year: '2020'
    },
    dbupdated: false,
    dbCleared: false,
    userdata: {
      email: '',
      username: (localStorage.username != undefined && localStorage.username != '') ? localStorage.username : '',
      avatar: localStorage.avatar,
    },
    checkconnection: false,
    finished: false,
    steam: [],
    notifications: [],
    version: {},
    isDark: false,
    theme: 'theme--default',
    steamkey: [],
    uplay: [],
    uplaykey: [],
    infodialog: false,
    isNotSync: localStorage.userid == '' || localStorage.notsynced == 'true',
    moreinfo: {
      Developer: 'Undefined',
      Publisher: 'Undefined',
      Genre: '',
      Price: '0'
    },
    msg: {
      text: '',
      color: 'green',
      value: false
    },
    origin: [],
    updatedb: {},
    originkey: [],
    others: [],
    otherskey: [],
    allkeys: [],
    AvatarChanged: '',
    tempimport: undefined,
    import: false,
    waitingdialog: false,
    successdialog: false,
    importedapps: [],
  },
})
v = new Vue({
  el: '#app',
  store,
  router,
  data: ({
    UpdateAvailable: false,
    Launch: false,
    loading: false,
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
        color: 'orange',
        icon: 'mdi-settings',
        link: '/settings'
      },
      {
        title: 'About',
        color: '#CCCC00',
        icon: 'mdi-help-circle',
        link: '/about'
      }
    ],
    keys: true,
    mini: false,
    windowWidth: 0,
    Maximized: null,
    appupdated: false
  }),
  methods: {
    ChangeTheme(theme) {
      this.theme = theme.class;
    },
    OpenWebsite() {
      ipcRenderer.send('open-link', store.state.App.website);
    },
    open(Platform) {
      switch (Platform) {
        case 'Twitter':
          link = store.state.App.Twitter;
          break;
        case 'Facebook':
          link = store.state.App.Facebook;
          break;
        case 'Instagram':
          link = store.state.App.Instagram;
          break;
        case 'Patreon':
          link = store.state.App.Patreon;
          break;
        case 'donations':
          link = store.state.App.Donations;
          break;
        case 'Paypal':
          link = store.state.App.Paypal;
          break;
        default:
          link = store.state.App.website;
      }
      ipcRenderer.send('open-link', link);
    },
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
          updateDB(localStorage.getItem("version"));
          break;
        case 'NA':
          ipcRenderer.send('open-link', store.state.App.website);
          break;
        default:
          ipcRenderer.send('open-link', this.notifications[index].link);
      }
    },
    getNotif() {
      if (store.state.updatedb.notifications != undefined)
        store.state.updatedb.notifications.forEach(el => {
          if (!el.value || el.value != 'true') {
            if (el.type == 'NA') this.UpdateAvailable = true;
            else this.UpdateAvailable = false;
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
    isDark: {
      get: function () {
        return store.state.isDark
      },
      set: function (newValue) {
        store.state.isDark = newValue
      }
    },
    theme: {
      get: function () {
        return store.state.theme
      },
      set: function (newValue) {
        store.state.theme = newValue
      }
    },
    App() {
      return store.state.App
    },
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
        username: store.state.userdata.username != '' ? store.state.userdata.username : store.state.userdata.email.split('@')[0],
        email: store.state.userdata.email,
        avatar: store.state.userdata.avatar
      }
    },
    games() {
      return store.state.steamkey.concat(store.state.uplaykey.concat(store.state.originkey
        .concat(store.state.otherskey)));
    }
  },
  mounted() {
    ipcRenderer.send('get-data');
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
          this.UpdateAvailable = false;
        }
    },
    appupdated(value) {
      if (!value) {
        versions = JSON.parse(localStorage.getItem('version'));
        versions.app = this.App.version;
        localStorage.setItem('version', JSON.stringify(versions));
        store.state.notifications = [];
        getnotification(localStorage.getItem('version'));
      }
    },
    dbupdated(value) {
      if (!value) {
        store.state.notifications = [];
        getnotification(localStorage.getItem('version'));
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