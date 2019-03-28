var routes = [{
    path: '/',
    component: httpVueLoader('./pages/home.vue')
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
            { title: 'Home', icon: 'dashboard' },
            { title: 'About', icon: 'question_answer' }
          ],
          mini: false,
           }),
})