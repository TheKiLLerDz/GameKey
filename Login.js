const store = new Vuex.Store({
    state: {
        termsdialog: false,
        terms: [],
        PwChanged: false,
        waitingdialog: false,
        newkey: '',
        accountcreation: false,
        accountfound: false,
        ForgotPwDialog: false,
        enterkey: false,
        ForgotPwDialogmsg: '',
        userdata: {
            password: '',
            avatar: '',
            email: ''
        },
        newacc: {
            email: '',
            emailconfirmation: '',
            password: '',
            passwordconfirmation: '',
            avatar: ''
        },
    }
})

Vue.component("icon", httpVueLoader("icon.vue"))

v = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: ({
        PWdialog: false,
        Launch: false,
        forms: '',
        falsekey: false,
        decrytionkey: '',
        files: [],
        isAdding: false,
        ResetPwDialog: false,
        show1: false,
        moreinfo: false,
        rememberme: false,
        msg: "",
        checkbox: false,
        RecoveryOption: '',
        Loading: false,
        imgrules: [
            value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
        ],
        rules: {
            required: value => !!value || 'Required.',
            min8: v => v.length >= 8 || 'Min 8 characters',
            min4: v => v.length >= 4 || 'Min 4 characters',
            length32: v => v.length == 32 || 'Should be 32 characters',
            email: value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Invalid e-mail.'
            },
            emailconfirmation: v => v == store.state.newacc.email || 'Emails does not match',
            passwordconfirmation: v => v == store.state.newacc.password || 'Passwords does not match',
        },
    }),
    methods: {
        Minimize() {
            ipcRenderer.send('minimize-app');
        },
        Close() {
            ipcRenderer.send('close-app');
        },
        openwebsite() {
            ipcRenderer.send('open-link', App.website);
        },
        ResetPwDialogLive() {
            if (localStorage.userid && localStorage.userid != '')
                this.ResetPwDialog = true;
            else {
                store.state.ForgotPwDialogmsg = "No Recovery Option available"
                store.state.ForgotPwDialog = true;
            }
        },
        getterms() {
            var promise1 = new Promise(function (resolve, reject) {
                GetTerms(resolve, reject);
            });
            promise1.then(
                function (result) {
                    store.state.termsdialog = true;
                    store.state.terms = result.terms;
                },
                function (error) {
                    console.log("error");
                }
            )
        },
        ForgotPW() {
            var promise1 = new Promise(function (resolve, reject) {
                ForgotPwd(store.state.userdata.email, localStorage.userid, resolve, reject);
            });
            promise1.then(
                function (result) {
                    store.state.ForgotPwDialogmsg = "Check your inbox for the Key";
                    store.state.enterkey = true;
                    store.state.ForgotPwDialog = true;
                },
                function (error) {
                    store.state.ForgotPwDialogmsg = "Please Check your connection & try again";
                    store.state.ForgotPwDialog = true;
                }
            )
        },
        KeyTester() {
            if (authentication(store.state.userdata.email, this.decrytionkey)) {
                store.state.ForgotPwDialog = false;
                this.PWdialog = true;
            } else {
                this.falsekey = true;
                this.decrytionkey = "";
            }
        },
        ChangePw(newpw, confirmation) {
            if (newpw == confirmation) {
                this.PWdialog = false;
                store.state.waitingdialog = true;
                newKey = hex_md5(SHA1(newpw));
                store.state.newKey = newKey;
                OnLoad(this.decrytionkey);
            }
        },
        DB_Path() {
            ipcRenderer.send('DB-Path-request');
        },
        accessLogin(userdata) {
            if (!this.Loading && this.accountfound && userdata.email != "" && userdata.password != "") {
                this.Login(userdata);
            }
        },
        Login(userdata) {
            this.Loading = true;
            Key = hex_md5(SHA1(userdata.password));
            setTimeout(() => {
                if (authentication(userdata.email, Key)) {
                    if (this.rememberme) localStorage.savedemail = userdata.email;
                    ipcRenderer.send('access-app', Key, userdata.email);
                } else {
                    this.msg = "Wrong Login Credentials";
                    this.moreinfo = true;
                    localStorage.savedemail = '';
                }
            }, 3000);
        },
        getdata() {
            this.rememberme = (localStorage.rememberme == 'true');
            if (this.rememberme) {
                this.userdata.email = localStorage.savedemail;
                this.userdata.avatar = localStorage.avatar;
            }
        },
        createaccount(account) {
            this.isAdding = true
            if (account.password == account.passwordconfirmation && account.email == account.emailconfirmation) {
                const fs = require('fs');
                extention = '';
                if (this.$refs.file.initialValue != null && this.$refs.file.initialValue.type != null) {
                    extention = this.$refs.file.initialValue.type.split('/')[1]
                    avatar = ipcRenderer.sendSync('userData-Path') + "/avatar." + extention;
                    fs.copyFile(this.$refs.file.internalArrayValue[0].path, avatar, (err) => {
                        if (err) throw err;
                    });
                } else avatar = '';
                keycryp = hex_md5(SHA1(account.password));
                cipher = aes256.createCipher(keycryp);
                Text = "gamekeyapp.com/" + account.email;
                CryptedText = Crypt(Text);
                localStorage.avatar = avatar;
                addUserData(CryptedText, 'avatar.' + extention);
                localStorage.authC = CryptedText;
                store.state.accountcreation = false;
                store.state.accountfound = true;
                localStorage.userid = '';
                if (this.RecoveryOption == "Yes") {
                    var promise1 = new Promise(function (resolve, reject) {
                        send_data(account.email, keycryp, resolve, reject);
                    });
                    promise1.then(
                        function (result) {
                            addUserID(result);
                            localStorage.userid = result;
                        },
                        function (error) {
                            console.log(error);
                        }
                    )
                }
                this.userdata = {
                    email: account.email,
                    password: account.password,
                    avatar: avatar
                }
            } else {
                this.isAdding = false;
                if (account.email != account.emailconfirmation) this.newacc.emailconfirmation = '';
                else if (account.password != account.passwordconfirmation) this.newacc.passwordconfirmation = '';
            }
        }
    },
    computed: {
        userdata: {
            get: function () {
                return store.state.userdata;
            },
            set: function (newValue) {
                store.state.userdata = newValue;
            }
        },
        newacc: {
            get: function () {
                return store.state.newacc;
            },
            set: function (newValue) {
                store.state.newacc = newValue;
            }
        },
        termsdialog() {
            return store.state.termsdialog
        },
        terms() {
            return store.state.terms
        },
        isDark() {
            return localStorage.Dark == 'true'
        },
        PwChanged() {
            return store.state.PwChanged
        },
        waitingdialog() {
            return store.state.waitingdialog
        },
        enterkey() {
            return store.state.enterkey
        },
        ForgotPwDialogmsg() {
            return store.state.ForgotPwDialogmsg
        },
        createacc() {
            return store.state.accountcreation
        },
        accountfound() {
            return store.state.accountfound
        },
        ForgotPwDialog() {
            return store.state.ForgotPwDialog
        }
    },
    watch: {
        Launch(value) {
            if (value) {
                var promise = new Promise(function (result) {
                    ChangeEncryptionKey(store.state.newKey, store.state.userdata.email, result);
                    v.Launch = false;
                });
                promise.then((result) => {
                    UpdateSvDataPw(store.state.userdata.email, store.state.newKey, localStorage.userid);
                    store.state.waitingdialog = false;
                    store.state.PwChanged = true;
                })
            }
        },
        Loading(value) {
            if (value) {
                setTimeout(() => (this.Loading = false), 3000)
            }
        },
        rememberme(value) {
            localStorage.rememberme = value;
            if (value)
                localStorage.savedemail = this.userdata.email;
            else {
                localStorage.savedemail = '';
            }
        }
    },
    mounted() {
        ipcRenderer.send('Show-Login');
        if (!(localStorage.noupdate && localStorage.email && localStorage.authC)) {
            var promise1 = new Promise(function (resolve, reject) {
                getUserData(resolve, reject);
            });
            promise1.then(
                function (result) {
                    store.state.accountcreation = false;
                    store.state.accountfound = true;
                },
                function (error) {
                    store.state.accountcreation = true;
                    console.log(error);
                }
            )
        } else {
            store.state.accountcreation = false;
            store.state.accountfound = true;
        }
        this.getdata();
    }
})