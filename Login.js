const {
    ipcRenderer
} = require('electron')
new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: ({
        userdata: {
            username: '',
            password: '',
            avatar: ''
        },
        newacc: {
            username: '',
            password: '',
            avatar: ''
        },
        files: [],
        createacc: true,
        isAdding: false,
        loading: false,
        accessgranted: false,
        show1: false,
        moreinfo: false,
        rememberme: false,
        password: 'Password',
        msg: "",
        AutoLogin: false,
        Loading: false,
        imgrules: [
            value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
        ],
        rules: {
            required: value => !!value || 'Required.',
            min: v => v.length >= 8 || 'Min 8 characters',
        },
    }),
    methods: {
        Minimize() {
            ipcRenderer.send('minimize-app');
        },
        Close() {
            ipcRenderer.send('close-app');
        },
        CredentialsEdited() {
            this.accessgranted = false;
        },
        ForgotPW() {
            console.log("Forgot Password &| Username")
        },
        Login(userdata) {
            this.Loading = true;
            if ((userdata.username == localStorage.username && SHA1(userdata.password) == localStorage.pwhash) || (userdata.username == localStorage.username && this.accessgranted))
                ipcRenderer.send('access-app');
            else {
                this.msg = "Wrong Login Credentials";
                this.moreinfo = true;
            }
        },
        getdata() {
            this.rememberme = (localStorage.rememberme == 'true');
            if (this.rememberme) {
                this.userdata = {
                    username: localStorage.savedusername,
                    avatar: localStorage.avatar,
                }
                var length = localStorage.pwlength;
                this.userdata.password = '*'.repeat(length);
                this.accessgranted = true;
            }
        },
        createaccount(account) {
            const fs = require('fs');
            avatar = 'avatar.' + this.$refs.file.initialValue.type.split('/')[1];
            fs.copyFile(this.$refs.file.internalArrayValue[0].path, avatar, (err) => {
                if (err) throw err;
                localStorage.username = account.username;
                localStorage.pwlength = account.password.length;
                localStorage.pwhash = SHA1(account.password);
                localStorage.avatar = avatar
                this.createacc = false;
                setUserData(localStorage.username, localStorage.pwhash);
                this.userdata = {
                    username: account.username,
                    password: account.password,
                    avatar: avatar
                }
            });
        }
    },
    watch: {
        Loading(value) {
            if (value) {
                setTimeout(() => (this.Loading = false), 2000)
            }
        },
        AutoLogin(value) {
            localStorage.AutoLogin = value
        },
        rememberme(value) {
            localStorage.rememberme = value;
            localStorage.savedusername=this.userdata.username;
            if (!value) {
                this.AutoLogin = false;
                localStorage.savedusername='';
            }
        },
        loading() {
            setTimeout(() => (this.loading = false), 1000)
        }
    },
    mounted() {
        CreateData();
        setTimeout(() => {
            if (localStorage.username && localStorage.pwlength) {
                this.createacc = false;
                this.getdata();
                localstorage = true;
            } else localstorage = false;
        }, 500);
        if (localStorage.AutoLogin == 'true') {
            this.AutoLogin = true;
            this.Loading = true;
            setTimeout(() => {
                this.Login(this.userdata);
            }, 2500);
        }
    }
})