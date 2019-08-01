<template>
    <v-layout row wrap>
        <v-flex lg12>
            <h1 v-if="$route.path!=='/keys'">
                <v-icon v-if="$route.path=='/steam'" large>mdi-steam</v-icon>
                <v-icon v-else-if="$route.path=='/origin'" large>mdi-origin</v-icon>
                <v-icon v-else-if="$route.path=='/uplay'" large>mdi-ubisoft</v-icon>
                {{$route.path | subStr}} Keys
            </h1>
            <h1 v-else>
                <v-icon large>mdi-key</v-icon> All Keys
            </h1>
            <v-dialog v-model="editdialog" max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Edit app</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md6>
                                    <v-overflow-btn :items='platforms' v-model="editedItem.platform" label="Platform">
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
                        <v-btn color="blue darken-1" flat _click="close" @click="editdialog=!editdialog">Cancel</v-btn>
                        <v-btn color="blue darken-1" flat @click="save(editedItem.code)">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="infodialog" max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">App Info</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat _click="close" @click="infodialog=!infodialog">Ok</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-layout row wrap>
                <v-flex xs12 sm8 md6 offset-md3 offset-sm2>
                    <v-text-field clear-icon="cancel" v-model="search" append-icon="search" label="Search" clearable>
                    </v-text-field>
                </v-flex>
                <v-flex xs12>
                    <div style="max-height: 460px; overflow: auto;">
                        <v-data-table hide-actions :headers="headers" :items="apps" :update:page="loading"
                            :search="search" :single-expand="singleExpand" :expanded.sync="expanded" item-keys="id"
                            show-expand class="elevation-1">

                            <template slot="headerCell" slot-scope="{ header }">
                                <span class="blue--text" v-text="header.text"
                                    v-if="header.text!=='Platform' | $route.path=='/keys'" />
                            </template>
                            <template slot="items" slot-scope="props"
                                v-if="props.item.platform==this.pageof | $route.path=='/keys'">
                                <td>
                                    <v-img  :src="'apps/' + props.item.appid + '.jpg'"></v-img>
                                </td>
                                <td>
                                    <v-chip dark>{{ props.item.name }}</v-chip>
                                </td>
                                <td v-if="$route.path=='/keys'">
                                    <v-icon v-if="props.item.platform=='other'">mdi-key</v-icon>
                                    <v-icon v-else-if="props.item.platform=='uplay'">mdi-ubisoft</v-icon>
                                    <v-icon v-else>mdi-{{props.item.platform}}</v-icon>
                                </td>
                                <td v-else>
                                </td>
                                <td>
                                    <v-chip :color="getColor(props.item.keys.length)" dark>{{props.item.keys.length}}</v-chip>
                                </td>
                                <td>
                                    {{props.item.keys[0].key}}
                                </td>
                                <td class="layout px-0">
                                    <v-tooltip top>
                                        <v-btn slot="activator" @click="deleteItem(props.item)" color="error" icon
                                            small>
                                            <v-icon small>
                                                delete
                                            </v-icon>
                                        </v-btn>
                                        <span class="top">Delete</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                        <v-btn slot="activator" @click="editItem(props.item)" color="success" icon
                                            small>
                                            <v-icon small>
                                                mdi-square-edit-outline
                                            </v-icon>
                                        </v-btn>
                                        <span class="top">Edit</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                        <v-btn slot="activator" @click="otherinfo(props.item)" color="info" icon small>
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
        </v-flex>
        <v-dialog v-model="editdialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit app</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md6>
                                <v-overflow-btn :items='platforms' v-model="editedItem.platform" label="Platform">
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
                    <v-btn color="blue darken-1" flat _click="close" @click="editdialog=!editdialog">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click="save(editedItem.code)">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="infodialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">App Info</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat _click="close" @click="infodialog=!infodialog">Ok</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-flex xs12 sm8 md6 offset-md3 offset-sm2>
            <v-text-field clear-icon="cancel" v-model="search" append-icon="search" label="Search" clearable>
            </v-text-field>
        </v-flex>
        <v-flex xs12>
            <div style="max-height: 460px; overflow: auto;">
                <v-data-table hide-actions :headers="headers" :items="apps" :update:page="loading" :search="search"
                    :single-expand="singleExpand" :expanded.sync="expanded" item-key="id" show-expand
                    class="elevation-1">

                    <template slot="headerCell" slot-scope="{ header }">
                        <span class="blue--text" v-text="header.text"
                            v-if="header.text!=='Platform' | $route.path=='/keys'" />
                    </template>
                    <template slot="items" slot-scope="props">
                        <td>
                            <v-img :src="'apps/' + props.item.appid + '.jpg'"></v-img>
                        </td>
                        <td>
                            <v-chip dark>{{ props.item.name }}</v-chip>
                        </td>
                        <td v-if="$route.path=='/keys'">
                            <v-icon v-if="props.item.platform=='other'">mdi-key</v-icon>
                            <v-icon v-else-if="props.item.platform=='uplay'">mdi-ubisoft</v-icon>
                            <v-icon v-else>mdi-{{props.item.platform}}</v-icon>
                        </td>
                        <td v-else>
                        </td>
                        <td>
                            <v-chip :color="getColor(props.item.qnt)" dark>{{props.item.qnt}}</v-chip>
                        </td>
                        <td>
                            {{props.item.key[0]}}
                        </td>
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
                                <v-btn slot="activator" @click="otherinfo(props.item)" color="info" icon small>
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
                loading: true,
                direction: 'top',
                fab: false,
                fling: false,
                tabs: null,
                editdialog: false,
                infodialog: false,
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
                        sortable: true,
                        value: 'name'
                    },
                    {
                        text: 'Platform',
                        align: 'left',
                        sortable: true,
                        value: 'platform'
                    },
                    {
                        text: 'Qnt',
                        align: 'left',
                        sortable: true,
                        value: 'qnt'
                    },
                    {
                        text: 'Key',
                        align: 'left',
                        sortable: false,
                        value: 'key'
                    },
                    {
                        sortable: false,
                        text: 'Actions'
                    }
                ],
                expanded: [],
                singleExpand: false,
                apps: [],
                editedItem: {
                    id: '',
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
            save(d) {
                i = 0;
                while (i < this.apps.length) {
                    if (this.apps[i].code == d) {
                        this.apps[i] = this.editedItem;
                        console.log(this.apps[i])
                    }
                    i = i + 1;
                }
                this.editdialog = false;
            },


            editItem(item) {
                this.editedItem = Object.assign({}, item)
                this.editdialog = true
            },

            deleteItem(item) {
                const index = this.apps.indexOf(item)
                confirm('Are you sure you want to delete this key?') && this.apps.splice(index, 1)
            },
            otherinfo(item) {
                this.infodialog = true
            },
            getColor(qnt) {
                if (qnt < 1) return 'red'
                else if (qnt > 1) return 'green'
                else return 'orange'
            },
        },
        mounted() {
            switch (window.location.hash.slice(1)) {
                case '/steam':
                    this.apps = store.state.steamkey
                    break;
                case '/uplay':
                    this.apps = store.state.uplaykey
                    break;
                case '/origin':
                    this.apps = store.state.originkey
                    break;
                case '/other':
                    this.apps = store.state.others
                    break;
                case '/keys':
                    this.apps = store.state.steamkey.concat(store.state.uplaykey.concat(store.state.originkey
                        .concat(store.state.others)))
                    break;
            }
        },
        filters: {
            subStr: function (string) {
                if (string == '/keys') {
                    pageof = 'steam'
                    return this.pageof
                } else {
                    pageof = string.substring(1, 15)
                    return this.pageof.charAt(0).toUpperCase() + this.pageof.slice(1);
                }

            }
        }
    }
</script>