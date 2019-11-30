const {
    ipcRenderer
} = require('electron')
var mehdi ;
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
        files : [],
        createacc: true,
        isAdding: false,
        loading: false,
        accessgranted: false,
        show1: false,
        moreinfo: false,
        rememberme: false,
        password: 'Password',
        msg: "",
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
            if (userdata.username == localStorage.username && (SHA1(userdata.password) == localStorage.pwhash || this.accessgranted))
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
            localStorage.username = account.username;
            localStorage.pwlength = account.password.length;
            localStorage.pwhash = SHA1(account.password);
            localStorage.avatar = this.$refs.file.internalArrayValue[0].path
            this.createacc = false;
            this.userdata = {
                username: account.username,
                password: account.password,
                avatar: this.$refs.file.internalArrayValue[0].path
            }
     mehdi =  this.$refs.file
        }
    },
    watch: {
        rememberme(value) {
            localStorage.rememberme = value;
        },
        loading() {
            setTimeout(() => (this.loading = false), 2000)
        }
    },
    mounted() {
        if (localStorage.username && localStorage.pwlength) {
            this.createacc = false;
            this.getdata();
        }
    }
})