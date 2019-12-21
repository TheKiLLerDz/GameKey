<template>
    <v-layout row wrap>
        <v-flex md4 xs12>
            <v-card class="elevation-5" style="border-radius: 8px;">
                <v-avatar class="mx-auto d-flex" size="200" style="margin-bottom: -40px;top:-40px;border-radius: 100%">
                    <file-pond name="test" ref="pond"
                        label-Idle="Drag & Drop your picture or <span class='filepond--label-action'>Browse</span>"
                        image-Preview-Height='130' image-Crop-Aspect-Ratio='1:1' image-Resize-Target-Width=200,
                        image-Resize-Target-Height=200, style-Panel-Layout="compact circle"
                        style-Load-Indicator-Position="center bottom" style-Button-Remove-Item-Position='center bottom'
                        accepted-file-types="image/*" :files="userdata.avatar" />
                </v-avatar>
                <v-card-text class="text-xs-center">
                    <v-form v-model="forms.first">
                        <h3>User Profile</h3>
                        <v-container fluid grid-list-lg>
                            <v-layout row wrap>
                                <v-flex xs12 sm12 md12 lg12>
                                    <v-text-field prepend-icon="mdi-account" :rules="[rules.required, rules.min4]"
                                        color="red" label="Username" v-model="userdata.username" required>
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
                        <v-btn color="error">
                            Delete DataBase
                        </v-btn>
                    </v-layout>
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
    </v-layout>
</template>
<script>
    module.exports = {
        components: {
            FilePond: vueFilePond.default(FilePondPluginFileValidateType, FilePondPluginImagePreview,
                FilePondPluginImageCrop, FilePondPluginImageResize)
        },
        data() {
            return {
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
                }
            }
        },
        watch: {
            AutoLogin(value) {
                localStorage.AutoLogin = value
            },
            Patterns(value) {
                localStorage.Patterns = value;
            },
            loading() {
                setTimeout(() => (this.loading = false), 2000)
            }
        },
        methods: {
            save() {
                if (SHA1(this.oldpassword) == localStorage.password) {
                    var avatarchanged = false;
                    if (this.$refs.pond.getFiles().length > 0) {
                        if (this.$refs.pond.getFiles()[0].source.path != null) {
                            avatar = this.$refs.pond.getFiles()[0].source.path;
                            if (localStorage.avatar != '') {
                                deleteimg(localStorage.avatar);
                            }
                            localStorage.avatar = ipcRenderer.sendSync('userData-Path') + '/avatar.' + this.$refs
                                .pond.getFiles()[0].fileExtension;
                            copyimg(avatar, localStorage.avatar);
                            avatarchanged = true;
                        }
                    } else if (localStorage.avatar != '') {
                        deleteimg(localStorage.avatar);
                        localStorage.avatar = '';
                        avatarchanged = true;
                    }
                    if (avatarchanged) setavatar(localStorage.avatar);
                    store.state.userdata.avatar = localStorage.avatar;
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
            if (this.userdata.avatar != '') {
                this.userdata.avatar = 'avatar.cache';
                copyimg(localStorage.avatar, this.userdata.avatar);
            }
            this.AutoLogin = (localStorage.AutoLogin == 'true');
            this.Patterns = (localStorage.Patterns == 'true');
        },
        destroyed() {
            if (this.userdata.avatar != '')
                deleteimg(this.userdata.avatar);
        }
    }
</script>