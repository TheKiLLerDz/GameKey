<template>
    <v-layout row wrap>
        <v-flex xs12 sm12 md12>
            <v-card class="elevation-5 mb-4 mt-5 px-2 py-0" style="border-radius: 8px; height: calc(100% - 70px)">
                <v-card color="blue" class="white--text" style="top:-24px; padding: 15px;border-radius: 8px;">
                    <h1 v-if="$route.path!=='/keys'">
                        <v-icon v-if="$route.path=='/steam'" dense color='#1d2f54' x-large>mdi-steam</v-icon>
                        <v-icon v-else-if="$route.path=='/origin'" dense color='#eb6a00' x-large>mdi-origin</v-icon>
                        <v-icon v-else-if="$route.path=='/uplay'" color='#0e82cf' x-large>mdi-ubisoft</v-icon>
                        <v-icon v-else-if="$route.path=='/other'" color='white' x-large>mdi-key</v-icon>
                        {{subStr($route.path)}} Keys
                    </h1>
                    <h1 v-else>
                        <v-icon x-large>mdi-key</v-icon> All Keys
                    </h1>
                </v-card>
                <v-flex xs12 sm8 md6 offset-md3 offset-sm2>
                    <v-text-field clear-icon="cancel" v-model='search' append-icon="search" label="Search" solo
                        clearable>
                    </v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-data-table hide-actions :headers="headers[2].show ? headers : headers.splice(2,1)" :items="apps"
                        :update:page="loading" :search="search" :single-expand="singleExpand" :expanded.sync="expanded"
                        :pagination.sync="pagination" show-expand ref="table" class="elevation-1" :expand="expand"
                        item-key="appid">
                        <template slot="headerCell" slot-scope="{ header }">
                            <span class="blue--text" v-text="header.text" />
                        </template>
                        <template slot="items" slot-scope="props">
                            <tr>
                                <td @click="props.expanded = !props.expanded">
                                    <img :src="'apps/' + props.item.appid + '.jpg'"
                                        onerror="this.src='apps/undefined.gif'" height="42" width="100">
                                </td>
                                <td @click="props.expanded = !props.expanded">
                                    <v-chip dark>{{ props.item.name }}</v-chip>
                                </td>
                                <td v-if="$route.path=='/keys'" @click="props.expanded = !props.expanded">
                                    <v-icon v-if="props.item.platform=='Other'">mdi-key</v-icon>
                                    <v-icon v-else-if="props.item.platform=='Uplay'">mdi-ubisoft</v-icon>
                                    <v-icon v-else-if="props.item.platform=='Origin'">mdi-origin</v-icon>
                                    <v-icon v-else-if="props.item.platform=='Steam'">mdi-steam</v-icon>
                                </td>
                                <td @click="props.expanded = !props.expanded">
                                    <v-chip :color="getColor(props.item.keys.length)" dark>
                                        {{props.item.keys.length}}</v-chip>
                                </td>
                                <td>
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
                                                        <v-btn slot="activator" color="success"
                                                            @click="copykey(index.key)" :id="index.key" icon small>
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
                        <v-pagination v-model="pagination.page" :length="pages" next-icon="mdi-menu-right"
                            prev-icon="mdi-menu-left" circle></v-pagination>
                    </div>
                </v-flex>
            </v-card>
        </v-flex>
        <v-dialog v-model="editdialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit app</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <table>
                                <tr>
                                    <v-flex xs12 sm6 md6>
                                        <v-combobox :items='platforms' v-model="editedItem.platform" label="Platform">
                                        </v-combobox>
                                    </v-flex>
                                    <v-flex xs12 sm6 md4>
                                        <v-text-field :rules="[() => !!editedItem.appid || 'This field is required']"
                                            v-model="editedItem.appid" label="ID" @input="IDEdited()">
                                        </v-text-field>
                                    </v-flex>
                                </tr>
                                <tr>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="editedItem.name" label="Name" readonly>
                                        </v-text-field>
                                    </v-flex>
                                </tr>
                                <tr>
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
                                                <v-chip :selected="tags.selected" close @input="removetag(tags.item)"
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
                    <v-btn color="blue darken-1" flat _click="close" @click="editdialog = !editdialog">Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" flat @click="save()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="addialog" max-width="500px" loading>
            <v-card>
                <v-progress-linear :active="isAdding" class="ma-0" color="blue lighten-3" height="4" indeterminate>
                </v-progress-linear>
                <v-card-title>
                    <span class="headline">Add app</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <table>
                                <tr>
                                    <v-flex xs12 sm6 md6>
                                        <v-combobox :items='platforms' v-model="itemtoadd.platform"
                                            :readonly="$route.path == '/keys' ? false : true" label="Platform">
                                        </v-combobox>
                                    </v-flex>
                                    <v-flex xs12 sm6 md4>
                                        <v-text-field :rules="[() => !!itemtoadd.appid || 'This field is required']"
                                            v-model="itemtoadd.appid" label="ID" @input="IDAdded()"></v-text-field>
                                    </v-flex>
                                </tr>
                                <tr>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="itemtoadd.name" label="Name"></v-text-field>
                                    </v-flex>
                                </tr>
                                <tr>
                                    <v-flex xs12 sm12 md12>
                                        Add keys
                                        <v-edit-dialog :v-model="itemtoadd.keys" return-object large persistent
                                            color="red">
                                            <v-chip text-color="white" color="blue">{{ itemtoadd.keys }}</v-chip>
                                            <template v-slot:input>
                                                <div class="mt-4 title">add key</div>
                                            </template>
                                            <template v-slot:input>
                                                <v-text-field v-model="itemtoadd.keys" :rules="[max25chars]" label="add"
                                                    single-line counter autofocus color="red" return-object>
                                                </v-text-field>
                                            </template>
                                        </v-edit-dialog>
                                    </v-flex>
                                </tr>
                                <tr>
                                    <v-flex xs12 sm12 md12>
                                        <v-combobox v-model="gametagsselected" :items="gametags" label="Game Tags" chips
                                            clearable prepend-icon="filter_list" solo multiple>
                                            <template v-slot:selection="tags">
                                                <v-chip :selected="tags.selected" close @input="removetag(tags.item)"
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
                    <v-btn color="blue darken-1" flat _click="close" depressed @click="addialog = !addialog">Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" flat :disabled="itemtoadd.appid == '' || itemtoadd.platform == '' ? true : false"
                        :loading="isAdding" @click="add(itemtoadd);isAdding = true">Add</v-btn>
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
        <v-speed-dial v-model="fab" bottom right fixed direction="top" transition="slide-y-reverse-transition"
            open-on-hover>
            <template v-slot:activator>
                <v-btn v-model="fab" color="blue darken-2" dark fab>
                    <v-icon style="top : -10px">add</v-icon>
                    <v-icon style="top : -10px">close</v-icon>
                </v-btn>
            </template>
            <v-btn fab dark small color="indigo"
                @click="addialog = true; if ($route.path!=='/keys') itemtoadd.platform=subStr($route.path)">
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
        watch: {
            isAdding(val) {
                if (val) {
                    setTimeout(() => (this.isAdding = false), 700)
                }
            }
        },
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
            }
        },
        data() {
            return {
                isAdding: false,
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
                search: null,
                editdialog: false,
                infodialog: false,
                addialog: false,
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
                oldediteditem: null,
                itemtoadd: {
                    appid: '',
                    name: '',
                    platform: '',
                    keys: '',
                },
                editedItem: {
                    appid: '',
                    name: '',
                    platform: '',
                    keys: '',
                },
            }
        },
        methods: {
            IDEdited() {
                ///////// edit
                i = 0;
                while (i < store.state.steam.length) {
                    if (store.state.steam[i].appid == this.editedItem.appid) {
                        this.editedItem.name = store.state.steam[i].name;
                        break;
                    } else this.editedItem.name = ''
                    i = i + 1;
                }
            },
            IDAdded() {
                ///////// edit
                i = 0;
                while (i < store.state.steam.length) {
                    if (store.state.steam[i].appid == this.itemtoadd.appid) {
                        this.itemtoadd.name = store.state.steam[i].name;
                        break;
                    } else this.itemtoadd.name = ''
                    i = i + 1;
                }
            },
            removetag(item) {
                this.gametagsselected.splice(this.gametagsselected.indexOf(item), 1)
                this.gametagsselected = [...this.gametagsselected]
            },
            Lowercasefirst(text) {
                return text.charAt(0).toLowerCase() + text.slice(1);
            },
            save() {
                if (this.oldediteditem.appid !== this.editedItem.appid) {
                    i = 0;
                    gameexists = false;
                    while (i < this.apps.length) {
                        if (this.apps[i].appid == this.editedItem.appid) {
                            gameexists = true;
                            break;
                        }
                        i++
                    }
                    var newitem = {
                        name: this.editedItem.name,
                        appid: this.editedItem.appid,
                        platform: this.editedItem.platform,
                        keys: []
                    };
                    const index = this.apps.indexOf(this.oldediteditem);
                    k = 0;
                    while (k < this.apps[index].keys.length) {
                        if (this.editedItem.platform!='Steam') appid=this.editedItem.appid
                        else appid=parseInt(this.editedItem.appid)
                        ////
                        addkey(this.gettab(this.editedItem.platform), appid, this.apps[index].keys[k].key);
                        if (gameexists) {
                            this.apps[i].keys.push(this.apps[index].keys[k]);
                        } else {
                            newitem.keys.push(this.apps[index].keys[k]);
                        }
                        k++;
                    }
                    delgamekeys(this.gettab(this.editedItem.platform), this.oldediteditem.appid);
                    this.apps.splice(index, 1);
                    if (!gameexists) this.apps.push(newitem);
                }
                this.editdialog = false;
            },
            gettab(platform){
                switch (platform) {
                    case 'Steam':
                        return 1
                        break;
                    case 'Uplay':
                        return 3
                        break;
                    case 'Origin':
                        return 0
                        break;
                    case 'Other':
                        return 2
                        break;
                }
            },
            add(app) {
                if (app.platform!='Steam') appid=app.appid
                else appid=parseInt(app.appid)
                addkey(this.gettab(app.platform),appid, app.keys);
                var index = this.apps.map(e => e.appid).indexOf(appid);
                if (index == -1)
                    this.apps.push({
                        appid: appid,
                        name: app.name,
                        keys: [{
                            key: app.keys
                        }],
                        platform: app.platform
                    });
                else {
                    this.apps[index].keys.push({
                        'key': app.keys
                    });
                }
            },
            editItem(item) {
                this.editedItem = Object.assign({}, item);
                this.oldediteditem = item;
                this.editdialog = true;
            },
            deleteItem(item) {
                const index = this.apps.indexOf(item)
                confirm('Are you sure you want to delete all The keys of this game?') && delgamekeys(this.gettab(item.platform), item
                    .appid) & this.apps.splice(index, 1) & console.log("success")
            },
            deletekey(key, item) {
                const index = this.apps.indexOf(item);
                const indexi = this.apps[index].keys.map(e => e.key).indexOf(key);
                confirm('Are you sure you want to delete this key?') && delkey(this.gettab(item.platform), item.appid, key) & this.apps[
                    index].keys.splice(indexi, 1);
                if (item.keys.length == 0) {
                    this.apps.splice(index, 1);
                    delgamekeys(this.gettab(item.platform), item.appid);
                }
            },
            subStr(string) {
                if (string == '/keys') {
                    return 'all'
                } else {
                    return string.substring(1, 15).charAt(0).toUpperCase() + string.substring(1, 15).slice(1);
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
    }
</script>