<template>
    <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12>
            <v-card class="elevation-5 px-2"
                style="border-radius: 8px; height: calc(100% - 70px);padding: 0px 0px 75px 0px;">
                <v-card class='greencard white--text unselectable' style="top:-30px; padding: 15px;border-radius: 8px;">
                    <h1>
                        <v-icon dense color='white' x-large>
                            mdi-account
                        </v-icon>
                        Settings
                    </h1>
                </v-card>
                <v-layout row wrap>
                    <v-flex xs3 sm3 md3 lg3>
                        <v-avatar class="mx-auto d-flex" size="15vw">
                            <file-pond name="test" ref="pond"
                                label-Idle="Drag & Drop your picture or <span class='filepond--label-action'>Browse</span>"
                                image-Preview-Height='130' image-Crop-Aspect-Ratio='1:1' image-Resize-Target-Width=200,
                                image-Resize-Target-Height=200, style-Panel-Layout="compact circle"
                                style-Load-Indicator-Position="center bottom"
                                style-Button-Remove-Item-Position='center bottom' accepted-file-types="image/*"
                                :files="userdata.avatar" />
                        </v-avatar>
                    </v-flex>
                    <v-flex xs6 sm6 md6 lg6>
                        <v-card-title class='greencard white--text unselectable' style="border-radius: 8px;">
                            <h3>App Settings</h3>
                        </v-card-title>
                        <v-card-text>
                            <v-layout fill-height align-center justify-center ma-0>
                                <v-switch color='success' v-model="Patterns"
                                    :label="Patterns? 'Follow Key Patterns is : On' : 'Follow Key Patterns is Switched : Off'">
                                </v-switch>
                                <v-switch color="purple" v-model="AutoLogin"
                                    :label="`AutoLogin : ${AutoLogin.toString()}`">
                                </v-switch>
                                <v-btn color="error">
                                    Delete DataBase
                                </v-btn>
                            </v-layout>
                        </v-card-text>
                        <v-card-title class='infocard white--text unselectable' style="border-radius: 8px;">
                            <h3>User Profile</h3>
                        </v-card-title>
                        <v-card-text>
                            <v-form v-model="forms.first">
                                <v-container fluid grid-list-lg>
                                    <v-layout row wrap>
                                        <v-flex xs12 sm6 md6 lg6>
                                            <v-text-field :rules="[rules.required, rules.min4]" color="red" label="Name"
                                                v-model="userdata.username" required>
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md6 lg6>
                                            <v-text-field :rules="[rules.required, rules.email]" color="red"
                                                label="Email" v-model="userdata.email" required>
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md6 lg6>
                                            <v-text-field :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                :rules="[rules.required, rules.min8]"
                                                :type="show1 ? 'text' : 'password'" name="input-10-1"
                                                label="Enter Old Password" hint="At least 8 characters" counter
                                                @click:append="show1 = !show1" color="red" v-model="oldpassword"
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
                        <v-card-actions style="padding:0px 20px 10px 20px;">
                            <v-btn color="info" :loading="loading" :disabled="loading || !forms.first"
                                @click="save();loading=true;">
                                Save
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn color="success" @click="cancel()">Cancel</v-btn>
                        </v-card-actions>
                    </v-flex>
                </v-layout>
            </v-card>
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
        computed: {
            userdata() {
                return JSON.parse(JSON.stringify(store.state.userdata));
            }
        },
        methods: {
            save() {
                if (SHA1(this.oldpassword) == localStorage.password) {
                    avatar = this.$refs.pond.getFiles()[0].source.path;
                    if (this.userdata.username != store.state.userdata.username || this.userdata.email !=
                        store
                        .state
                        .userdata.email || avatar != undefined) {
                        if (avatar != undefined) {
                            deleteimg(localStorage.avatar);
                            localStorage.avatar = 'avatar.' + this.$refs.pond.getFiles()[0].fileExtension;
                            copyimg(avatar, localStorage.avatar);
                        }
                        localStorage.username = this.userdata.username;
                        localStorage.email = this.userdata.email;
                        store.state.userdata.avatar = localStorage.avatar;
                        store.state.userdata = JSON.parse(JSON.stringify(this.userdata));
                        setUserData(localStorage.username, localStorage.email, localStorage.avatar);
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
            this.AutoLogin = (localStorage.AutoLogin == 'true');
            this.Patterns = (localStorage.Patterns == 'true');
        }
    }
</script>