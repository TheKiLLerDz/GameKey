<template>
    <v-layout row wrap>
        <v-flex v-for="item in items" :key="item.title" xs12 sm6 md4 lg3>
            <v-card>
                <v-list>
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <v-icon size="50px">{{item.icon}}</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{item.title}}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
                <v-card-text>
                    <div>Your Game Count : {{item.games}}</div>
                    <div>With : {{item.keys}} Keys </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn flat white :to="{path:item.link}">
                        Go to {{item.title}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    module.exports = {
        data() {
            return {
                items: [{
                        title: 'All key',
                        icon: 'mdi-key',
                        games: store.state.steamkey.concat(store.state.uplaykey.concat(store.state.originkey
                        .concat(store.state.others))).length,
                        keys: 250,
                        link: '/keys'
                    },
                    {
                        title: 'Steam',
                        icon: 'mdi-steam',
                        games: store.state.steamkey.length,
                        keys: 250,
                        link: '/steam'
                    }, {
                        title: 'Uplay',
                        icon: 'mdi-ubisoft',
                        games: store.state.uplaykey.length,
                        keys: 250,
                        link: '/uplay'
                    },
                    {
                        title: 'Origin',
                        icon: 'mdi-origin',
                        games: store.state.originkey.length,
                        keys: 250,
                        link: '/origin'
                    },
                    {
                        title: 'Other',
                        icon: 'mdi-alert-circle',
                        games: store.state.others.length,
                        keys: 250,
                        link: '/other'
                    }
                ]
            }
        },
        mounted() {
            this.items[1].keys = store.state.steamkey.reduce(function (keys ,item) {
                return keys + (item.keys.length);
            }, 0)
            this.items[2].keys = store.state.uplaykey.reduce(function (keys ,item) {
                return keys + (item.keys.length);
            }, 0)
            this.items[3].keys = store.state.originkey.reduce(function (keys ,item) {
                return keys + (item.keys.length);
            }, 0)
            this.items[4].keys = store.state.others.reduce(function (keys ,item) {
                return keys + (item.keys.length);
            }, 0)
            this.items[0].keys = store.state.steamkey.concat(store.state.uplaykey.concat(store.state.originkey
                .concat(store.state.others))).reduce(function (keys ,item) {
                return keys + (item.keys.length);
            }, 0)
        }
    }
</script>