const {
    ipcRenderer
} = require('electron')
vm = new Vue({
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
            emailMatch: () => ('The email and password you entered don\'t match'),
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
                    username: localStorage.username,
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
            if (!value) this.AutoLogin = false;
        },
        loading() {
            setTimeout(() => (this.loading = false), 1000)
        }
    },
    mounted() {
        if (localStorage.username && localStorage.pwlength) {
            this.createacc = false;
            this.getdata();
        }
        if (localStorage.AutoLogin == 'true') {
            this.AutoLogin = true;
            this.Loading = true;
            setTimeout(() => {
                this.Login(this.userdata);
            }, 2500);
        }
    }
})