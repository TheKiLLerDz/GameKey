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
                    <div>your games is: {{item.games}}</div>
                    <div>your keys is : {{item.keys}} </div>
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
                        games: 50,
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
                        games: 50,
                        keys: 250,
                        link: '/uplay'
                    },
                    {
                        title: 'Origin',
                        icon: 'mdi-origin',
                        games: 20,
                        keys: 250,
                        link: '/origin'
                    },
                    {
                        title: 'Other',
                        icon: 'mdi-alert-circle',
                        games: 50,
                        keys: 250,
                        link: '/other'
                    }
                ]
            }
        }
    }
</script>