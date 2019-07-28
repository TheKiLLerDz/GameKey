<template>
    <v-layout row wrap>
        <v-flex xs12>
            <h1>{{$route.path | subStr}} Keys</h1>
        </v-flex>
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit app</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md6>
                                <v-overflow-btn :items='platforms' label="Platform" hide-details class="pa-0">
                                </v-overflow-btn>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedItem.code" label="ID"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-text-field v-model="editedItem.key" label="Key"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field v-model="editedItem.qnt" label="Qnt"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-text-field label="Tags"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat _click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat _click="save">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-flex xs12 sm8 md6 offset-md3 offset-sm2>
            <v-text-field clear-icon="cancel" v-model="search" append-icon="search" label="Search" clearable>
            </v-text-field>
        </v-flex>

        <v-flex xs12>
            <div style="max-height: 460px; overflow: auto;">
                <v-data-table hide-actions :headers="headers" :items="apps" :search="search"
                    :rows-per-page-items='[{ "text": "$vuetify.dataIterator.rowsPerPageAll", "value": -1 } ]'>
                    <template slot="headerCell" slot-scope="{ header }">
                        <span class="blue--text" v-text="header.text" />
                    </template>
                    <template slot="items" slot-scope="props" v-if="props.item.platform==this.pageof">
                        <td>
                            <v-img :src=props.item.pic></v-img>
                        </td>
                        <td>{{props.item.name}}</td>
                        <td>
                            <v-icon>mdi-{{props.item.platform}}</v-icon>
                        </td>
                        <td>{{props.item.key}}</td>
                        <td>{{props.item.qnt}}</td>
                        <td class="layout px-0">
                            <v-tooltip top>
                                <v-btn slot="activator" @click="deleteItem(props.item)" color="error" icon small>
                                    <v-icon small>
                                        delete
                                    </v-icon>
                                </v-btn>
                                <span class="top">Delete</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <v-btn slot="activator" @click="editItem(props.item)" color="success" icon small>
                                    <v-icon small>
                                        mdi-square-edit-outline
                                    </v-icon>
                                </v-btn>
                                <span class="top">Edit</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <v-btn slot="activator" color="info" icon small>
                                    <v-icon small>
                                        info
                                    </v-icon>
                                </v-btn>
                                <span class="top">Other information</span>
                            </v-tooltip>
                        </td>
                    </template>
                    <v-alert slot="no-results" :value="true" color="error" icon="warning">
                        Your search for "{{ search }}" found no results.
                    </v-alert>
                    <v-alert slot="no-data" :value="true" color="error" icon="warning">
                        Sorry, nothing to display here :(
                    </v-alert>
                </v-data-table>
            </div>
        </v-flex>

        <v-speed-dial v-model="fab" bottom right fixed direction="top" transition="slide-y-reverse-transition"
            open-on-hover>
            <template v-slot:activator>
                <v-btn color="blue darken-2" dark fab>
                    <v-icon v-if="fab">close</v-icon>
                    <v-icon v-else>add</v-icon>
                </v-btn>
            </template>
            <v-btn fab dark small color="indigo">
                <v-icon>add</v-icon>
            </v-btn>
            <v-btn fab dark small color="green">
                <v-icon>mdi-export</v-icon>
            </v-btn>
            <v-btn fab dark small color="orange">
                <v-icon>mdi-import</v-icon>
            </v-btn>
        </v-speed-dial>
    </v-layout>
</template>

<script>
    module.exports = {
        data() {
            return {
                fab: false,
                fling: false,
                tabs: null,
                dialog: false,
                search: '',
                pageof: '',
                platforms: ['Steam', 'Uplay', 'Origin', 'Other'],
                headers: [{
                        text: 'Pic',
                        align: 'left',
                        sortable: false,
                        value: 'pic'
                    },
                    {
                        text: 'Name',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },
                    {
                        text: 'Platform',
                        align: 'left',
                        sortable: false,
                        value: 'platform'
                    },
                    {
                        text: 'Key',
                        align: 'left',
                        sortable: false,
                        value: 'key'
                    },
                    {
                        text: 'Qnt',
                        align: 'left',
                        sortable: false,
                        value: 'qnt'
                    },
                    {
                        sortable: false,
                        text: 'Action'
                    }
                ],
                apps: [{
                    pic: '/apps/730.jpg',
                    name: 'Counter-Strike: Global Offensive',
                    platform: 'steam',
                    key: '45454-45454-45454-45454',
                    qnt: '2',
                }, {
                    pic: '/apps/578080.jpg',
                    name: "PLAYERUNKNOWN'S BATTLEGROUNDS",
                    platform: 'steam',
                    key: '45454-45454-45454-45454',
                    qnt: '4',
                }, {
                    pic: '/apps/578080.jpg',
                    name: "3",
                    platform: 'ubisoft',
                    key: '45454-45454-45454-45454',
                    qnt: '4',
                }, {
                    pic: '/apps/578080.jpg',
                    name: "4",
                    platform: 'origin',
                    key: '45454-45454-45454-45454',
                    qnt: '4',
                }, {
                    pic: '/apps/578080.jpg',
                    name: "5",
                    platform: '/origin',
                    key: '45454-45454-45454-45454',
                    qnt: '4',
                }, {
                    pic: '/apps/578080.jpg',
                    name: "6",
                    platform: 'ubisoft',
                    key: '45454-45454-45454-45454',
                    qnt: '9',
                }, {
                    pic: '/apps/578080.jpg',
                    name: "7",
                    platform: 'origin',
                    key: '45454-45454-45454-45454',
                    qnt: '1',
                }],
                editedItem: {
                    code: '',
                    pic: '',
                    name: '',
                    platform: '',
                    key: '',
                    qnt: 0
                },
            }
        },
        methods: {
            editItem(item) {
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },

            deleteItem(item) {
                const index = this.apps.indexOf(item)
                confirm('Are you sure you want to delete this item?') && this.apps.splice(index, 1)
            },
        },
        filters: {
            subStr: function (string) {
                this.pageof = string.substring(1, 15)
                return this.pageof.charAt(0).toUpperCase() + this.pageof.slice(1);
            }
        }
    }
</script>