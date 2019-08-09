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
        </v-flex>
        <v-dialog v-model="editdialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{this.editedItem.appid == '' ? 'Add' : 'Edit'}} app</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <table>
                                <tr>
                                    <v-flex xs12 sm6 md6>
                                        <v-combobox :items='platforms'
                                            :value="editedItem.platform == null ? '' : Uppercasefirst(editedItem.platform)"
                                            label="Platform">
                                        </v-combobox>
                                    </v-flex>
                                    <v-flex xs12 sm6 md4>
                                        <v-text-field :rules="[() => !!editedItem.appid || 'This field is required']"
                                            :value="editedItem.appid == null ? '' : editedItem.appid" label="ID"
                                            :@click="IDEdited()"></v-text-field>
                                    </v-flex>
                                </tr>
                                <tr>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field :value="editedItem.name == null ? '' : editedItem.name"
                                            label="Name" disabled></v-text-field>
                                    </v-flex>
                                </tr>
                                <tr v-if="editedItem.keys == []">
                                    <v-flex xs12 sm12 md12 v-for="(index,i) in editedItem.keys" :key="i">
                                        Key {{i+1}}
                                        <v-edit-dialog :return-value.sync="index.key" large persistent color="red">
                                            <v-chip text-color="white" color="blue">{{ index.key }}</v-chip>
                                            <template v-slot:input>
                                                <div class="mt-4 title">Update key</div>
                                            </template>
                                            <template v-slot:input>
                                                <v-text-field v-model="index.key" :rules="[max25chars]" label="Edit"
                                                    single-line counter autofocus color="red"></v-text-field>
                                            </template>
                                        </v-edit-dialog>
                                    </v-flex>
                                </tr>
                                <tr>
                                    <v-flex xs12 sm12 md12>
                                        <v-combobox v-model="gametagsselected" :items="gametags" label="Game Tags" chips
                                            clearable prepend-icon="filter_list" solo multiple>
                                            <template v-slot:selection="tags">
                                                <v-chip :selected="tags.selected" close @input="remove(tags.item)"
                                                    color="orange" outline>
                                                    <strong>{{ tags.item }}</strong>
                                                </v-chip>
                                            </template>
                                        </v-combobox>
                                    </v-flex>
                                </tr>
                            </table>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat _click="close" @click="editdialog = !editdialog">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click="save(editedItem.appid)">{{this.editedItem.appid == '' ? 'Add' : 'Save'}}</v-btn>
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
            <v-data-table hide-actions :headers="headers[2].show ? headers : headers.splice(2,1)" :items="apps"
                :update:page="loading" :search="search" :single-expand="singleExpand" :expanded.sync="expanded"
                :pagination.sync="pagination" show-expand ref="table" class="elevation-1" :expand="expand"
                item-key="appid">
                <template slot="headerCell" slot-scope="{ header }" v-if="header.show == undefined | header.show">
                    <span class="blue--text" v-text="header.text" />
                </template>
                <template slot="items" slot-scope="props"
                    v-if="props.item.platform==this.pageof | $route.path=='/keys'">
                    <tr>
                        <td @click="props.expanded = !props.expanded">
                            <v-img
                                :src="'apps/' + props.item.appid + '.jpg' == undefined ? 'apps/undefined.gif' : 'apps/' + props.item.appid + '.jpg'">
                            </v-img>
                        </td>
                        <td @click="props.expanded = !props.expanded">
                            <v-chip dark>{{ props.item.name }}</v-chip>
                        </td>
                        <td v-if="$route.path=='/keys'" @click="props.expanded = !props.expanded">
                            <v-icon v-if="props.item.platform=='other'">mdi-key</v-icon>
                            <v-icon v-else-if="props.item.platform=='uplay'">mdi-ubisoft</v-icon>
                            <v-icon v-else>mdi-{{props.item.platform}}</v-icon>
                        </td>
                        <td @click="props.expanded = !props.expanded">
                            <v-chip :color="getColor(props.item.keys.length)" dark>
                                {{props.item.keys.length}}</v-chip>
                        </td>
                        <td>
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
                    </tr>
                </template>
                <template v-slot:expand="props">
                    <v-card flat>
                        <v-card-text>
                            <v-alert value="true" :color="getColor(props.item.keys.length)" outline>
                                <table>
                                    <tr v-for="(index,i) in props.item.keys" :key="i.key">
                                        <td>{{index.key}}</td>
                                        <td>
                                            <v-tooltip top>
                                                <v-btn slot="activator" color="success" @click="copykey(index.key)"
                                                    :id="index.key" icon small>
                                                    <v-icon small>
                                                        mdi-content-copy
                                                    </v-icon>
                                                </v-btn>
                                                <span class="top">Copy Key</span>
                                            </v-tooltip>
                                            <v-tooltip top>
                                                <v-btn slot="activator" color="info" icon small>
                                                    <v-icon small>
                                                        mdi-tooltip-edit
                                                    </v-icon>
                                                </v-btn>
                                                <span class="top">Edit Key</span>
                                            </v-tooltip>
                                            <v-tooltip top>
                                                <v-btn slot="activator" color="error"
                                                    @click="deletekey(index.key,props.item)" icon small>
                                                    <v-icon small>
                                                        delete
                                                    </v-icon>
                                                </v-btn>
                                                <span class="top">Delete Key!</span>
                                            </v-tooltip>
                                        </td>
                                    </tr>
                                </table>
                            </v-alert>
                        </v-card-text>
                    </v-card>
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
                <v-alert slot="no-data" :value="true" color="error" icon="warning">
                    Sorry, nothing to display here :(
                </v-alert>
            </v-data-table>
            <div class="text-xs-center pt-2">
                <v-pagination v-model="pagination.page" :length="pages" 
                next-icon="mdi-menu-right" prev-icon="mdi-menu-left" circle></v-pagination>
            </div>
        </v-flex>
        <v-speed-dial v-model="fab" bottom right fixed direction="top" transition="slide-y-reverse-transition"
            open-on-hover>
            <template v-slot:activator>
                <v-btn v-model="fab" color="blue darken-2" dark fab>
                    <v-icon style="top : -10px">add</v-icon>
                    <v-icon style="top : -10px">close</v-icon>
                </v-btn>
            </template>
            <v-btn fab dark small color="indigo" @click="additem(null)">
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
        computed: {
            loading() {
                return !store.state.finished;
            },
            totalItems() {
                this.pagination.totalItems = this.apps.length;
                return this.apps.length;
            },
            pages() {
                if (this.pagination.rowsPerPage == null ||
                    this.totalItems == null
                ) return 0
                return Math.ceil(this.totalItems / this.pagination.rowsPerPage)
            },
        },
        data() {
            return {
                expand: false,
                direction: 'top',
                fab: false,
                pagination: {
                    totalItems: '',
                    rowsPerPage: 10
                },
                max25chars: v => v.length <= 25 || 'Key is too long!',
                gametags: ['Action', 'AAA', 'Sport', 'Cars'],
                gametagsselected: [],
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
                        show: true,
                        value: 'pic'
                    },
                    {
                        text: 'Name',
                        align: 'left',
                        sortable: true,
                        show: true,
                        value: 'name'
                    },
                    {
                        text: 'Platform',
                        align: 'left',
                        sortable: true,
                        show: true,
                        value: 'platform'
                    },
                    {
                        text: 'Qnt',
                        align: 'left',
                        sortable: true,
                        show: true,
                        value: 'qnt'
                    },
                    {
                        sortable: false,
                        show: true,
                        text: 'Actions'
                    }
                ],
                expanded: [],
                singleExpand: false,
                apps: [],
                editedItem: {
                    appid: '',
                    name: '',
                    platform: '',
                    keys: [],
                },
            }
        },
        methods: {
            IDEdited() {
                i = 0;
                while (i < store.state.steamkey.length) {
                    if (store.state.steamkey[i].appid == this.editedItem.appid) {
                        this.editedItem.name = store.state.steamkey[i].name;
                    }
                    i = i + 1;
                }
            },
            remove(item) {
                this.gametagsselected.splice(this.gametagsselected.indexOf(item), 1)
                this.gametagsselected = [...this.gametagsselected]
            },
            Uppercasefirst(text) {
                return text.charAt(0).toUpperCase() + text.slice(1);
            },
            save(d) {
                i = 0;
                while (i < this.apps.length) {
                    if (this.apps[i].appid == d) {
                        this.apps[i] = this.editedItem;
                    }
                    i = i + 1;
                }
                this.editdialog = false;
            },
            additem() {
                this.editedItem = {
                    appid: '',
                    name: '',
                    platform: '',
                    keys: [],
                };
                this.editdialog = true;
            },
            editItem(item) {
                this.editedItem = Object.assign({}, item);
                this.editedItem.name = item.name;
                this.editdialog = true;
            },
            deleteItem(item) {
                const index = this.apps.indexOf(item)
                confirm('Are you sure you want to delete all The keys of this game?') && delgamekeys(0, item
                    .appid) & this.apps.splice(index, 1) & console.log("success")
            },
            deletekey(key, item) {
                var tab
                switch (item.platform) {
                    case 'steam':
                        tab = 0
                        break;
                    case 'uplay':
                        tab = 1
                        break;
                    case 'origin':
                        tab = 2
                        break;
                    case 'other':
                        tab = 3
                        break;
                }
                const index = this.apps.indexOf(item);
                confirm('Are you sure you want to delete this key?') && delkey(tab, item.appid, key) & this.apps[
                    index].keys.splice(item.keys.indexOf(key), 1);
                if (item.keys.length == 0) {
                    this.apps.splice(index, 1) & delgamekeys(0, item
                        .appid);
                }
            },
            copykey(key) {
                var el = document.createElement('textarea');
                el.value = key;
                el.setAttribute('readonly', '');
                el.style = {
                    position: 'absolute',
                    left: '-9999px'
                };
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            },
            otherinfo(item) {
                this.infodialog = true
            },
            getColor(qnt) {
                if (qnt < 1) return 'red'
                else if (qnt > 1) return 'green'
                else return 'orange'
            }
        },
        mounted() {
            if (window.location.hash.slice(1) == "/keys") {
                this.headers[2].show = true;
            } else {
                this.headers[2].show = false;
            }
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
                    pageof = 'all'
                    return this.pageof
                } else {
                    pageof = string.substring(1, 15)
                    return this.pageof.charAt(0).toUpperCase() + this.pageof.slice(1);
                }

            }
        }
    }
</script>