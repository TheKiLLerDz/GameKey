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
        message:'Hello World',
        show: true,
        items : [
          { title: 'Home', icon: 'home' ,link: '/'},
          { title: 'My Keys', icon: 'list' ,link: '/keys'},
          { title: 'Settings', icon: 'settings' ,link: '/settings'},
          { title: 'About', icon: 'help' ,link: '/about'}
          ],
          mini: false,
          drawer: true,
          keys : true,
           }),
})