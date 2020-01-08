<template>
    <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12>
            <v-card class="elevation-5 px-2"
                style="border-radius: 8px; height: calc(100% - 70px);padding: 0px 0px 75px 0px;">
                <v-card class='yellowcard white--text unselectable'
                    style="top:-30px; padding: 15px;border-radius: 8px;">
                    <h1>
                        <v-icon dense color='white' x-large>
                            mdi-help-circle
                        </v-icon>
                        About GameKey
                    </h1>
                </v-card>
                <v-card-text class="unselectable"
                    style="color:#2F363D;font-size:1.8em;;padding:20px;font-weight: medium;font-family: 'Comic Sans MS', cursive, sans-serif">
                    <div>Sup gamers all around the globe ✌</div>
                    <div>This application was concieved to help users of all plateforms manage their keys more
                        easily without the need to be connected to the internet in all privacy and security.</div>
                    <div>If you like the app why don't you show us some love down bellow :
                        <span>
                            <v-btn color="indigo" class="white--text" @click="open('Facebook')" fab icon small round>
                                <v-icon>mdi-facebook</v-icon>
                            </v-btn>
                            <v-btn color="cyan" class="white--text" @click="open('Twitter')" fab icon small round>
                                <v-icon>mdi-twitter</v-icon>
                            </v-btn>
                            <v-btn color="red" class="white--text" @click="open('Instagram')" fab icon small round>
                                <v-icon>mdi-instagram</v-icon>
                            </v-btn>
                        </span>
                    </div>
                    <div>We hope our modest work helped getting your life a little bit easier, if you're
                        interested in supporting us please consider donating to <span @click="open('Patreon')"
                            class="orange--text linktext">Patreon</span>.</div>
                    <div>Thank you for the support guys and stay tuned for more future projects! 😊😊😊</div>
                    <div align="center" class="linktext">
                        <span style="margin:20px;display: inline-block;font-family: 'Verdana', cursive, sans-serif;width: 250px;height: 250px;
        text-align: center;border-radius: 50px;color: #fff;font-weight: bold;font-size: 140px;line-height: 250px;vertical-align: middle;
        background: #ee7752;background-image: linear-gradient(to right top, #ff25a1, #d200b3, #9213c3, #7942dc, #565ef0, #009fff, #5ffbf1);
        box-shadow: 0px 3px 10px rgba(0, 0, 0, .25);" @click="open()">GK</span>
                    </div>
                </v-card-text>
</template>
<script>
    module.exports = {
        data() {
            return {}
        },
        methods: {
            open(Platform) {
                switch (Platform) {
                    case 'Twitter':
                        link = store.state.App.Twitter;
                        break;
                    case 'Facebook':
                        link = store.state.App.Facebook;
                        break;
                    case 'Instagram':
                        link = store.state.App.Instagram;
                        break;
                    case 'Patreon':
                        link = store.state.App.Patreon;
                        break;
                    default:
                        link = store.state.App.website;
                }
                ipcRenderer.send('open-link', link);
            }
        }
    }
</script>