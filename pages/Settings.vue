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
                        <v-img max-height="30vw" max-width="30vw" :src="userdata.pic" :lazy-src="userdata.pic"
                            aspect-ratio="1" class="imgcontainer grey lighten-2"
                            style="border-radius: 50%;margin: 3vw;">
                            <template v-slot:placeholder>
                                <v-layout fill-height align-center justify-center ma-0>
                                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                </v-layout>
                            </template>
                            <h4 class="pictitle">Change Pic</h4>
                            <v-btn class="picbutton white--text" color="white" outline> Choose img </v-btn>
                        </v-img>
                    </v-flex>
                    <v-flex xs6 sm6 md6 lg6>
                        <v-card-title class='infocard white--text unselectable' style="border-radius: 8px;">
                            <h3>User Profile</h3>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field color="red" label="Name" v-model="userdata.username">
                            </v-text-field>
                            <v-text-field color="red" label="Profile Pic Link" v-model="userdata.pic">
                            </v-text-field>
                        </v-card-text>
                        <v-card-title class='greencard white--text unselectable' style="border-radius: 8px;">
                            <h3>App Settings</h3>
                        </v-card-title>
                        <v-card-text>
                            <v-switch color='success' v-model="Patterns"
                                :label="Patterns? 'Follow Key Patterns is : On' : 'Follow Key Patterns is Switched : Off'">
                            </v-switch>
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
        data() {
            return {
                loading: false,
                hasSaved: false,
                Patterns: null,
            }
        },
        watch: {
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
                this.isEditing = !this.isEditing
                this.hasSaved = true
            },
            cancel() {
                this.userdata = JSON.parse(JSON.stringify(store.state.userdata));
            }
        },
        mounted() {
            this.Patterns = (localStorage.Patterns == 'true');
        }
    }
</script>