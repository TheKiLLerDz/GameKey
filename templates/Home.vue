<template>
    <v-layout row wrap>
        <v-flex v-for="item in items" :key="item.title" xs12 sm6 md6 lg4>
            <v-card elevation="2" class="mb-4 px-3 py-0" style='border-radius:10px'>
                <v-card :color="item.color" :to="{path:item.link}"
                    style="top:-24px;margin: 0px 16px 0px;padding: 16px;border-radius: 8px;position: absolute;"
                    elevation="3" :class="item.class">
                    <v-icon color='white' size="50">{{item.icon}}</v-icon>
                </v-card>
                <v-card-text>
                    <h2 class="text-xs-right unselectable">{{item.title}}</h2>
                    <v-divider :class="'itemcolor ' + item.title" :color="item.color"></v-divider>
                </v-card-text>
                <div class="text-xs-center">Library : {{item.games}}</div>
                <div class="text-xs-center">Keys : {{item.keys}} </div>
                <v-card-actions>
                    <v-divider :class="'itemcolor ' + item.title" :color="item.color"></v-divider>
                    <v-btn flat white :to="{path:item.link}" :color="item.title !='Steam' ? item.color : ''"
                        :class="'itemcolor ' + item.title" round outline>
                        <v-icon size="30" class="mr-2">link</v-icon>
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
                        games: 0,
                        keys: '',
                        link: '/keys',
                        color: '#0e82cf',
                        class: 'infocard'
                    },
                    {
                        title: 'Steam',
                        icon: 'mdi-steam',
                        games: store.state.steamkey.length,
                        keys: '',
                        link: '/steam',
                        color: '#1d2f54',
                        class: 'steamcard'
                    }, {
                        title: 'Uplay',
                        icon: 'mdi-ubisoft',
                        games: store.state.uplaykey.length,
                        keys: '',
                        link: '/uplay',
                        color: '#0e82cf',
                        class: 'infocard'
                    },
                    {
                        title: 'Origin',
                        icon: 'mdi-origin',
                        games: store.state.originkey.length,
                        keys: '',
                        link: '/origin',
                        color: '#eb6a00',
                        class: 'orangecard'
                    },
                    {
                        title: 'Other',
                        icon: 'mdi-alert-circle',
                        games: store.state.otherskey.length,
                        keys: '',
                        link: '/other',
                        color: 'success',
                        class: 'greencard'
                    }
                ]
            }
        },
        mounted() {
            this.items[1].keys = store.state.steamkey.reduce(function (keys, item) {
                return keys + (item.keys.length);
            }, 0)
            this.items[2].keys = store.state.uplaykey.reduce(function (keys, item) {
                return keys + (item.keys.length);
            }, 0)
            this.items[3].keys = store.state.originkey.reduce(function (keys, item) {
                return keys + (item.keys.length);
            }, 0)
            this.items[4].keys = store.state.otherskey.reduce(function (keys, item) {
                return keys + (item.keys.length);
            }, 0)
            this.items[0].keys = this.items[1].keys + this.items[2].keys + this.items[3].keys + this.items[4].keys;
            this.items[0].games = this.items[1].games + this.items[2].games + this.items[3].games + this.items[4]
                .games;
        }
    }
</script>