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
                <v-card-text class="unselectable aboutsection"
                    style="font-size:1.8em;padding:20px;font-weight: medium;font-family: 'Comic Sans MS', cursive, sans-serif">
                    <div>Sup Traders / Gamers all around the globe ✌</div>
                    <div>This application was concieved to help users of all platforms to manage their keys more
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
                            class="orange--text linktext">Patreon</span>,<span @click="open('Paypal')"
                            class="blue--text linktext"> PayPal</span> or <span @click="open('website')"
                            class="green--text linktext">Check other donation methods on our website</span>.</div>
                    <div>Thank you for the support guys and stay tuned for more future projects! 😊😊😊</div>
                    <div align="left">
                        <v-divider style="margin:10px" color="orange"></v-divider>
                        <div>
                            GameKey was Developed by :</div>
                        <div>
                            <v-icon color="orange">mdi-star</v-icon><span class="blue--text"> Agaba Ramzi</span>
                            (TheKiLLerDz)
                        </div>
                        <div>
                            <v-icon color="orange">mdi-star</v-icon><span class="blue--text"> Malah Mehdi</span>
                            (mehdi.chihani1)
                        </div>
                    </div>
                    <div align="center">
                        <v-tooltip top>
                            <img slot="activator" class="unselectable" style="width:200px;border-radius:50%"
                                src="flag.jpg" alt="Dz">
                            <span class="top">Algeria (Dz)</span>
                        </v-tooltip>
                    </div>
                    <div align="center">
                        <icon style="width:250px;height: 250px;border-radius: 25%;font-size: 140px;line-height: 250px;"
                            class="linktext" type="sync" @click="open()"></icon>
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
                    case 'donations':
                        link = store.state.App.Donations;
                        break;
                    case 'Paypal':
                        link = store.state.App.Paypal;
                        break;
                    case 'OpenCollective':
                        link = store.state.App.OpenCollective;
                        break;
                    case 'Steam':
                        link = store.state.App.Steam;
                        break;
                    default:
                        link = store.state.App.website;
                }
                ipcRenderer.send('open-link', link);
            }
        }
    }
</script>