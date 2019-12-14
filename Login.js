const {
    ipcRenderer
} = require('electron')

const store = new Vuex.Store({
    state: {
        accountcreation: false,
        ForgotPwDialog: false
    }
})

new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: ({
        userdata: {
            username: '',
            password: '',
            avatar: '',
            email: ''
        },
        newacc: {
            username: '',
            password: '',
            avatar: '',
            email: ''
        },
        files: [],
        isAdding: false,
        show1: false,
        moreinfo: false,
        rememberme: false,
        msg: "",
        AutoLogin: false,
        Loading: false,
        imgrules: [
            value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
        ],
        rules: {
            required: value => !!value || 'Required.',
            min8: v => v.length >= 8 || 'Min 8 characters',
            min4: v => v.length >= 4 || 'Min 4 characters',
            email: value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Invalid e-mail.'
            }
        },
    }),
    methods: {
        Minimize() {
            ipcRenderer.send('minimize-app');
        },
        Close() {
            ipcRenderer.send('close-app');
        },
        ForgotPW() {
            var promise1 = new Promise(function (resolve, reject) {
                ForgotPw(localStorage.username, localStorage.email, resolve, reject);
            });
            promise1.then(
                function (result) {
                    store.state.ForgotPwDialog = true;
                    UpdatePW(localStorage.username, result.password);
                    localStorage.password = result.password;
                },
                function (error) {
                    console.log(error);
                }
            )

        },
        Login(userdata) {
            this.Loading = true;
            setTimeout(() => {
                if (userdata.username == localStorage.username && SHA1(userdata.password) == localStorage.password) {
                    if (this.rememberme) this.savedata();
                    ipcRenderer.send('access-app');
                } else {
                    this.msg = "Wrong Login Credentials";
                    this.moreinfo = true;
                    this.deletedata();
                }
            }, 2500);
        },
        savedata() {
            localStorage.savedusername = this.userdata.username;
            localStorage.savedpassword = this.userdata.password;
        },
        deletedata() {
            localStorage.savedusername = '';
            localStorage.savedpassword = '';
        },
        getdata() {
            this.rememberme = (localStorage.rememberme == 'true');
            if (this.rememberme) {
                this.userdata = {
                    username: localStorage.savedusername,
                    avatar: localStorage.avatar,
                    password: localStorage.savedpassword
                }
            }
        },
        createaccount(account) {
            const fs = require('fs');
            avatar = 'avatar.' + this.$refs.file.initialValue.type.split('/')[1];
            fs.copyFile(this.$refs.file.internalArrayValue[0].path, avatar, (err) => {
                if (err) throw err;
                localStorage.username = account.username;
                localStorage.email = account.email;
                localStorage.password = SHA1(account.password);
                localStorage.avatar = avatar;
                setUserData(localStorage.username, localStorage.email, localStorage.password);
                store.state.accountcreation = false;
                this.userdata = {
                    username: account.username,
                    email: account.email,
                    password: account.password,
                    avatar: avatar
                }
            });
        }
    },
    computed: {
        createacc() {
            return store.state.accountcreation
        },
        ForgotPwDialog() {
            return store.state.ForgotPwDialog
        }
    },
    watch: {
        Loading(value) {
            if (value) {
                setTimeout(() => (this.Loading = false), 2500)
            }
        },
        AutoLogin(value) {
            localStorage.AutoLogin = value;
            this.Loading = true;
            if (value) this.Login(this.userdata)
        },
        rememberme(value) {
            localStorage.rememberme = value;
            if (value)
                this.savedata();
            else {
                this.AutoLogin = false;
                this.deletedata();
            }
        }
    },
    mounted() {
        if (!(localStorage.username && localStorage.email && localStorage.password && localStorage.noupdate)) {
            var promise1 = new Promise(function (resolve, reject) {
                getUserData(resolve, reject);
            });
            promise1.then(
                function (result) {
                    store.state.accountcreation = false;
                },
                function (error) {
                    store.state.accountcreation = true;
                    console.log(error);
                }
            )
        } else {
            store.state.accountcreation = false;
        }
        this.AutoLogin = (localStorage.AutoLogin == 'true');
        this.getdata();
    }
})