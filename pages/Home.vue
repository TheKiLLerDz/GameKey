<template>
    <v-layout row wrap>
        <v-flex v-for="item in items" :key="item.title" xs12 sm6 md4 lg3 >
            <v-card elevation="3" style='border-radius:10px'>
                <v-list>
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <v-icon size="50px" :color="item.color">{{item.icon}}</v-icon>
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
                    <v-btn flat white :to="{path:item.link}" color="orange" round outline>
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
                        title: 'All Keys',
                        icon: 'mdi-key',
                        games: store.state.steamkey.concat(store.state.uplaykey.concat(store.state.originkey
                        .concat(store.state.others))).length,
                        keys: '',
                        link: '/keys',
                        color : ''
                    },
                    {
                        title: 'Steam',
                        icon: 'mdi-steam',
                        games: store.state.steamkey.length,
                        keys: '',
                        link: '/steam',
                        color : '#1d2f54'
                    }, {
                        title: 'Uplay',
                        icon: 'mdi-ubisoft',
                        games: store.state.uplaykey.length,
                        keys: '',
                        link: '/uplay',
                        color : '#0e82cf'
                    },
                    {
                        title: 'Origin',
                        icon: 'mdi-origin',
                        games: store.state.originkey.length,
                        keys: '',
                        link: '/origin',
                        color : '#eb6a00'
                    },
                    {
                        title: 'Other',
                        icon: 'mdi-alert-circle',
                        games: store.state.others.length,
                        keys: '',
                        link: '/other',
                        color : ''
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
