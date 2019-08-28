<template>
    <v-card class="hide-overflow" color="purple lighten-1" dark>
        <v-toolbar card color="purple">
            <v-icon>mdi-account</v-icon>
            <v-toolbar-title class="font-weight-light">User Profile</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="purple darken-3" fab small @click="isEditing = !isEditing">
                <v-icon v-if="isEditing">mdi-close</v-icon>
                <v-icon v-else>mdi-pencil</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-text-field :disabled="!isEditing" color="white" label="Name" v-model="userdata.username"></v-text-field>
            <v-text-field :disabled="!isEditing" color="white" label="Profile Pic Link" v-model="userdata.pic">
            </v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!isEditing" color="success" @click="save">
                Save
            </v-btn>
        </v-card-actions>
        <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>
            Your profile has been updated
        </v-snackbar>
    </v-card>
</template>
<script>
    module.exports = {
        data() {
            return {
                hasSaved: false,
                isEditing: null,
                model: null,
                userdata: {
                    username: null,
                    pic: null
                },
            }
        },

        methods: {
            save() {
                store.state.userdata = JSON.parse(JSON.stringify(this.userdata));
                this.isEditing = !this.isEditing
                this.hasSaved = true
            }
        },
        mounted() {
            this.userdata = JSON.parse(JSON.stringify(store.state.userdata));
        }
    }
</script>