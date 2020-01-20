<template>
    <v-layout row wrap>
        <v-flex md4 xs12>
            <v-card class="elevation-5" style="border-radius: 8px;">
                <v-avatar @drop.prevent="addFile" @dragover.prevent class="mx-auto d-flex" size="200"
                    style="margin-bottom: -40px;top:-40px;border-radius: 100%;background-color:#F5F5F5">
                    <v-img
                        style="box-shadow: 0 10px 28px -10px rgba(0, 0, 0, .5), 0 4px 25px 0 rgba(0, 0, 0, .15), 0 10px 10px -5px rgba(0, 0, 0, .3);"
                        :src="userdata.avatar" transition="fade-transition">
                        <span style="position: absolute;left:5%;right:5%"
                            :style="userdata.avatar=='' ? 'top:40%' : 'top:80%'">
                            <span v-if="userdata.avatar==''">
                                <input type="file" label="Upload" accept="image/*" buttonAfter='{uploadFileButton}'
                                    ref="file" style="display: none" @change="addFile">
                                Drag & Drop your picture or <span @click="$refs.file.click()"
                                    style="text-decoration: underline;-webkit-text-decoration-skip: ink;text-decoration-skip-ink: auto;-webkit-text-decoration-color: #a7a4a4;text-decoration-color: #a7a4a4;cursor: pointer;">Browse</span></span>
                            <button v-else @click="userdata.avatar=''" class="imagebutton" type="button"
                                data-align="center bottom"
                                style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1); opacity: 1;"><svg
                                    width="26" height="26" viewBox="0 0 26 26">
                                    <path
                                        d="M11.586 13l-2.293 2.293a1 1 0 0 0 1.414 1.414L13 14.414l2.293 2.293a1 1 0 0 0 1.414-1.414L14.414 13l2.293-2.293a1 1 0 0 0-1.414-1.414L13 11.586l-2.293-2.293a1 1 0 0 0-1.414 1.414L11.586 13z"
                                        fill="currentColor" fill-rule="nonzero"></path>
                                </svg><span>Remove</span></button></span>
                    </v-img>
                </v-avatar>
                <v-card-text class="text-xs-center">
                    <v-form v-model="forms.first">
                        <h3>User Profile</h3>
                        <v-container fluid grid-list-lg>
                            <v-layout row wrap>
                                <v-flex xs12 sm12 md12 lg12>
                                    <v-text-field prepend-icon="mdi-account"
                                        :rules="[rules.required, rules.min4, rules.username]" color="red"
                                        label="Username" v-model="userdata.username" required>
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6 lg6>
                                    <v-text-field prepend-icon="mdi-email" :rules="[rules.required, rules.email]"
                                        color="red" label="Email" v-model="userdata.email" required>
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6 lg6>
                                    <v-text-field prepend-icon="mdi-lock"
                                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                        :rules="[rules.required, rules.min8]" :type="show1 ? 'text' : 'password'"
                                        name="input-10-1" label="Enter Old Password" hint="At least 8 characters"
                                        counter @click:append="show1 = !show1" color="red" v-model="oldpassword"
                                        required>
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12>
                                    <v-btn color="warning" @click="PWdialog=true">Change Password</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions style="padding:0px 40px 20px 40px;">
                    <v-btn color="info" :loading="loading" :disabled="loading || !forms.first"
                        @click="save();loading=true;">
                        Save
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="cancel()">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
        <v-flex md8 xs12>
            <v-card class="elevation-5 px-2"
                style="border-radius: 8px; height: calc(100% - 70px);padding: 0px 0px 75px 0px;">
                <v-card class='orangecard white--text unselectable'
                    style="top:-30px; padding: 15px;border-radius: 8px;">
                    <h1>
                        <v-icon dense color='white' x-large>
                            mdi-settings
                        </v-icon>
                        App Settings
                    </h1>
                </v-card>
                <v-card-text>
                    <v-layout fill-height align-center justify-center ma-0>
                        <v-switch color='success' v-model="Patterns"
                            :label="Patterns? 'Follow Key Patterns is : On' : 'Follow Key Patterns is Switched : Off'">
                        </v-switch>
                        <v-switch color="purple" v-model="AutoLogin" :label="`AutoLogin : ${AutoLogin.toString()}`">
                        </v-switch>
                    </v-layout>
                    <v-layout fill-height align-center justify-center ma-0>
                        <v-switch color='black' v-model="isDark"
                            :label="isDark? 'Dark Mode is Switched : On' : 'Dark Mode is Switched : Off'">
                        </v-switch>
                        <div class="body-2 sidebar-filter unselectable">THEMES
                        </div>
                        <v-radio-group class="justify-center" v-model="theme" row>
                            <v-tooltip top v-for="theme in themes" :key="theme.name">
                                <v-radio slot="activator" :value="theme.class.toLowerCase()" :color="theme.color">
                                </v-radio>
                                <span>{{theme.name}}</span>
                            </v-tooltip>
                        </v-radio-group>
                    </v-layout>
                    <v-card-title class='greencard white--text unselectable' style="border-radius: 8px;">
                        <h3>DataBase Settings</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-btn color="error" @click="dbClearconfirm=true">
                            Delete DataBase
                        </v-btn>
                    </v-card-text>
                </v-card-text>
        </v-flex>
        <v-snackbar v-model="snack" :timeout="2000" :color="msg.color" absolute bottom left>
            {{msg.text}}
        </v-snackbar>
        <v-dialog v-model="PWdialog" max-width="500" persistent @keydown.esc="PWdialog = false">
            <v-card>
                <v-card-title class="headline red--text">Change Password</v-card-title>
                <v-card-text style="padding:0px 40px 0px 40px;">
                    <v-form v-model="forms.second">
                        <v-text-field :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, rules.min8]" :type="show1 ? 'text' : 'password'" name="input-10-1"
                            label="Enter Old Password" hint="At least 8 characters" counter
                            @click:append="show1 = !show1" color="red" v-model="oldpassword">
                        </v-text-field>
                        <v-text-field :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, rules.min8]" :type="show1 ? 'text' : 'password'" name="input-10-1"
                            label="New Password" hint="At least 8 characters" counter @click:append="show1 = !show1"
                            color="red" v-model="newpassword.pw">
                        </v-text-field>
                        <v-text-field :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, rules.min8]" :type="show1 ? 'text' : 'password'" name="input-10-1"
                            label="Confirm New Password" hint="At least 8 characters" counter
                            @click:append="show1 = !show1" color="red" v-model="newpassword.confirmation">
                        </v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click="PWdialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="red darken-1" :disabled="!forms.second" flat @click="ChangePw()">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dbCleared" width="500" persistent @keydown.enter="store.state.dbCleared = false"
            @keydown.esc="store.state.dbCleared = false">
            <v-card class="unselectable">
                <v-card-title class="headline red--text">DATABASE Cleared</v-card-title>
                <v-card-text>
                    All Keys Deleted <br>
                    DATABASE Cleared Successfully
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat="flat" @click="store.state.dbCleared = false">
                        Ok
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dbClearconfirm" width="500" persistent @keydown.esc="dbClearconfirm = false">
            <v-card class="unselectable">
                <v-card-title class="headline red--text">Clear DATABASE ?</v-card-title>
                <v-card-text>
                    All Keys will be Deleted <br>
                    Are You Sure you want To continue
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat="flat" @click="dbClearconfirm = false">
                        Cancel
                    </v-btn>
                    <v-btn color="red darken-1" flat="flat" @click="ClearDB()">
                        Accept
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>
<script>
    module.exports = {
        data() {
            return {
                dbClearconfirm: false,
                forms: {
                    first: '',
                    second: ''
                },
                userdata: {
                    username: '',
                    password: '',
                    avatar: '',
                    email: ''
                },
                oldpassword: '',
                newpassword: {
                    pw: '',
                    confirmation: ''
                },
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
                PWdialog: false,
                avatar: [],
                AutoLogin: false,
                loading: false,
                snack: false,
                msg: {
                    text: '',
                    color: ''
                },
                Patterns: null,
                show1: false,
                password: 'Password',
                rules: {
                    required: value => !!value || 'Required.',
                    min8: v => v.length >= 8 || 'Min 8 characters',
                    min4: v => v.length >= 4 || 'Min 4 characters',
                    email: value => {
                        const pattern =
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'Invalid e-mail.'
                    },
                    username: value => {
                        const pattern = /^[a-z0-9_-]{3,15}$/igm
                        return pattern.test(value) || 'Invalid username.'
                    }
                }
            }
        },
        watch: {
            AvatarChanged(value) {
                console.log('changed');
                this.userdata.avatar = value;
            },
            AutoLogin(value) {
                localStorage.AutoLogin = value;
            },
            Patterns(value) {
                localStorage.Patterns = value;
            },
            loading() {
                setTimeout(() => (this.loading = false), 2000)
            },
            theme(mytheme) {
                localStorage.theme = mytheme;
            },
            isDark(value) {
                localStorage.Dark = value;
            }
        },
        methods: {
            addFile(e) {
                if (e.target.files == undefined)
                    file = ([...e.dataTransfer.files])[0];
                else
                    file = e.target.files[0];

                var URL = window.URL || window.webkitURL;

                if (file) {
                    var image = new Image();
                    image.onload = function () {
                        store.state.AvatarChanged = file.path;
                    };
                    image.onerror = function () {
                        alert('Invalid image');
                    };
                    image.src = URL.createObjectURL(file);
                }
            },
            save() {
                if (SHA1(this.oldpassword) == localStorage.password) {
                    if (this.userdata.avatar != localStorage.avatar) {
                        if (localStorage.avatar != '') deleteimg(localStorage.avatar);
                        if (this.userdata.avatar != '') {
                            localStorage.avatar = ipcRenderer.sendSync('userData-Path') + '/' + Math.random()
                                .toString(36).substring(7) + '.' + this
                                .userdata
                                .avatar.split('.')[this.userdata.avatar.split('.').length - 1];
                            copyimg(this.userdata.avatar, localStorage.avatar);
                        } else localStorage.avatar = '';
                        setavatar(localStorage.avatar);
                        store.state.userdata.avatar = localStorage.avatar;
                        this.userdata.avatar = localStorage.avatar;
                    }
                    if (this.userdata.username != store.state.userdata.username || this.userdata.email !=
                        store.state.userdata.email) {
                        localStorage.username = this.userdata.username;
                        localStorage.email = this.userdata.email;
                        store.state.userdata = JSON.parse(JSON.stringify(this.userdata));
                        setUserData(localStorage.username, localStorage.email);
                    }
                    this.msg.text = "Your profile has been updated";
                    this.msg.color = "success";
                    this.oldpassword = "";
                } else {
                    this.msg.text = "Wrong Password";
                    this.msg.color = "error";
                }
                this.snack = true;
            },
            cancel() {
                this.userdata = JSON.parse(JSON.stringify(store.state.userdata));
            },
            ClearDB() {
                this.dbClearconfirm = false;
                var promise = new Promise(function (resolve) {
                    ClearDB(resolve);
                });
                promise.then(
                    function (result) {
                        store.state.dbCleared = true;
                    })
            },
            ChangePw() {
                pw = SHA1(this.newpassword.pw);
                if (SHA1(this.oldpassword) == localStorage.password) {
                    if (this.newpassword.pw == this.newpassword.confirmation) {
                        UpdatePW(localStorage.username, pw);
                        localStorage.password = pw;
                        this.msg.text = "Password Changed Successfully";
                        this.msg.color = "success";
                        this.PWdialog = false;
                    } else {
                        this.msg.text = "Passwords does not Match";
                        this.msg.color = "error";
                    }
                } else {
                    this.msg.text = "Your Old Password is Wrong";
                    this.msg.color = "error";
                }
                this.snack = true;
            }
        },
        mounted() {
            this.userdata = JSON.parse(JSON.stringify(store.state.userdata));
            this.AutoLogin = (localStorage.AutoLogin == 'true');
            this.Patterns = (localStorage.Patterns == 'true');
        },
        computed: {
            AvatarChanged() {
                return store.state.AvatarChanged
            },
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
            dbCleared() {
                return store.state.dbCleared
            }
        }
    }
</script>