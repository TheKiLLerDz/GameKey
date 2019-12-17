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
                            <file-pond name="avatar" ref="avatar"
                                label-Idle="Drag & Drop your picture or <span class='filepond--label-action'>Browse</span>"
                                image-Preview-Height='130' image-Crop-Aspect-Ratio='1:1' image-Resize-Target-Width=200,
                                image-Resize-Target-Height=200, style-Panel-Layout="compact circle"
                                style-Load-Indicator-Position="center bottom"
                                style-Button-Remove-Item-Position='center bottom' accepted-file-types="image/*"
                                :files="userdata.avatar" />
                        </v-avatar>
                    </v-flex>
                    <v-flex xs6 sm6 md6 lg6>
                        <v-card-title class='infocard white--text unselectable' style="border-radius: 8px;">
                            <h3>User Profile</h3>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field color="red" label="Name" v-model="userdata.username">
                            </v-text-field>
                            <v-text-field color="red" label="Email" v-model="userdata.email">
                            </v-text-field>
                            <v-text-field :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'"
                                name="input-10-1" label="Password" hint="At least 8 characters" counter
                                @click:append="show1 = !show1" color="red" v-model="userdata.password">
                            </v-text-field>
                        </v-card-text>
                        <v-card-title class='greencard white--text unselectable' style="border-radius: 8px;">
                            <h3>App Settings</h3>
                        </v-card-title>
                        <v-card-text>
                            <table>
                                <tr>
                                    <td>
                                        <v-switch color='success' v-model="Patterns"
                                            :label="Patterns? 'Follow Key Patterns is : On' : 'Follow Key Patterns is Switched : Off'">
                                        </v-switch>
                                    </td>
                                    <td style="padding-left: 10vw;">
                                        <v-switch color="purple" v-model="AutoLogin"
                                            :label="`AutoLogin : ${AutoLogin.toString()}`">
                                        </v-switch>
                                    </td>
                                </tr>
                            </table>
                            <v-card-text>
                                <v-card-actions>
                                    <v-btn color="info" :loading="loading" :disabled="loading"
                                        @click="save();loading=true;">
                                        Save
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn color="success" @click="cancel()">Cancel</v-btn>
                                </v-card-actions>
                    </v-flex>
                    <v-flex xs3 sm3 md3 lg3>
                        <v-btn color="error">
                            Delete DataBase
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>
        <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>
            Your profile has been updated
        </v-snackbar>
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
                AutoLogin: false,
                loading: false,
                hasSaved: false,
                Patterns: null,
                show1: false,
                password: 'Password',
                rules: {
                    required: value => !!value || 'Required.',
                    min: v => v.length >= 8 || 'Min 8 characters',
                },
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
                store.state.userdata = JSON.parse(JSON.stringify(this.userdata));
                this.isEditing = !this.isEditing;
                localStorage.username = this.userdata.username;
                localStorage.avatar = this.userdata.avatar;
                //localStorage.pwhash=SHA1(this.userdata.password);
                this.hasSaved = true;
            },
            cancel() {
                this.userdata = JSON.parse(JSON.stringify(store.state.userdata));
            }
        },
        mounted() {
            this.AutoLogin = (localStorage.AutoLogin == 'true');
            this.Patterns = (localStorage.Patterns == 'true');
        }
    }
</script>