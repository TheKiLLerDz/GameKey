var routes = [{
    path: '/',
    component: httpVueLoader('./pages/Home.vue')
},{
  path: '/keys',
  component: httpVueLoader('./pages/Keys.vue')
},{
  path: '/settings',
  component: httpVueLoader('./pages/Settings.vue')
},{
  path: '/about',
  component: httpVueLoader('./pages/About.vue')
},
];
const router = new VueRouter({
routes
});
new Vue({
    el: '#app',
    router,
    data: ({
        show: true,
      
        items: [
          {
            icon: 'home',
            title: 'Home',
            link: '/'
          },
          {
            title: 'My Keys',
            link: '/keys',
            subitems :[{
              icon: 'list',
              title: 'Steam',
              link: '/keyssteam'
            },{
              icon: 'list',
              title: 'Origin',
              link: '/keysorigin'
            },{
              icon: 'list',
              title: 'Uplay',
              link: '/keysuplay'
            },
            {
              icon: 'list',
              title: 'Other',
              link: '/keysother'
            }]
          },
          
          { divider: true },
          { header: 'OTHER' },
          {
            icon: 'settings',
            title: 'Settings',
            link: '/settings'
          },
          
          {
            icon: 'help',
            title: 'About',
            link: 'about'
          }
        ],
          mini: false,
          keys : true,
           }),
})