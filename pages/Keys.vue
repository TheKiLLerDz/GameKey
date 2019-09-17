<template>
    <v-layout row wrap>
        <v-flex xs12 sm12 md12>
            <v-card class="elevation-5 mb-4 mt-5 px-2 py-0" style="border-radius: 8px; height: calc(100% - 70px)">
                <v-card
                    :class="$route.path.includes('/other') ? 'greencard' : $route.path.includes('/steam') ? 'steamcard':$route.path.includes('/origin') ? 'orangecard': 'infocard'"
                    class='white--text' style="top:-24px; padding: 15px;border-radius: 8px;">
                    <h1 v-if="!$route.path.includes('/keys')">
                        <v-icon v-if="$route.path=='/steam'" dense color='white' x-large>mdi-steam
                        </v-icon>
                        <v-icon v-else-if="$route.path=='/uplay'" color='white' x-large>mdi-ubisoft
                        </v-icon>
                        <v-icon v-else-if="$route.path=='/origin'" dense color='white' x-large>mdi-origin
                        </v-icon>
                        <v-icon v-else-if="$route.path=='/other'" dense color='white' x-large>
                            mdi-alert-circle
                        </v-icon>
                        {{subStr($route.path)}} Keys
                    </h1>
                    <h1 v-else>
                        <v-icon color='white' x-large>mdi-key</v-icon> All Keys
                    </h1>
                </v-card>
                <v-flex xs12 sm8 md6 offset-md3 offset-sm2>
                    <v-text-field clear-icon="cancel" v-model='search' append-icon="search" label="Search" solo
                        clearable light>
                    </v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-data-table hide-actions :headers="headers[2].show ? headers : headers.splice(2,1)"
                        sort-icon="mdi-menu-down" :items="apps" :update:page="loading" :search="search"
                        :single-expand="singleExpand" :expanded.sync="expanded" :pagination.sync="pagination"
                        show-expand ref="table" :expand="expand" item-key="appid">
                        <template slot="headerCell" slot-scope="{ header }">
                            <span :class="($route.path=='/origin') ? 'orange--text' : 'blue--text'"
                                v-text="header.text" />
                        </template>
                        <template slot="items" slot-scope="props">
                            <tr>
                                <td @click="props.expanded = !props.expanded">
                                    <img :src="props.item.platform == 'Steam' ? 'https://steamcdn-a.akamaihd.net/steam/apps/' + props.item.appid + '/header.jpg' : props.item.platform == 'Uplay' ? 'https://transform.dis.commercecloud.salesforce.com/transform/ABBS_PRD/on/demandware.static/-/Sites-masterCatalog/default/images/large/'+props.item.appid+'.jpg?sw=500&sh=200&sm=cut' : 'apps/undefined.gif'"
                                        onerror="this.src='apps/undefined.gif'" height="42" width="100">
                                </td>
                                <td @click="props.expanded = !props.expanded">
                                    <v-chip dark>{{ props.item.name }}</v-chip>
                                </td>
                                <td v-if="$route.path.includes('/keys')" @click="props.expanded = !props.expanded">
                                    <v-icon v-if="props.item.platform=='Steam'" :color='platforms[0].color'>mdi-steam
                                    </v-icon>
                                    <v-icon v-else-if="props.item.platform=='Uplay'" :color='platforms[1].color'>
                                        mdi-ubisoft</v-icon>
                                    <v-icon v-else-if="props.item.platform=='Origin'" :color='platforms[2].color'>
                                        mdi-origin</v-icon>
                                    <v-icon v-else-if="props.item.platform=='Other'" :color='platforms[3].color'>mdi-key
                                    </v-icon>
                                </td>
                                <td @click="props.expanded = !props.expanded">
                                    <v-chip :color="getColor(props.item.keys.length)" dark>
                                        {{props.item.keys.length}}</v-chip>
                                </td>
                                <td>
                                    <v-tooltip top>
                                        <v-btn slot="activator" @click="deletedialog=true;Itemtodelete=props.item"
                                            color="error" icon small>
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
                                        <!-- start !--
                                        <v-flex xs12 sm6>
                                            <v-card>
                                                <v-container fluid grid-list-md>
                                                    <v-layout row wrap>
                                                        <v-flex v-for="card in cards" :key="card.title">
                                                            <v-card>
                                                                <v-card-actions>
                                                                    <v-spacer></v-spacer>
                                                                    <v-btn icon>
                                                                        <v-icon>favorite</v-icon>
                                                                    </v-btn>
                                                                    <v-btn icon>
                                                                        <v-icon>bookmark</v-icon>
                                                                    </v-btn>
                                                                    <v-btn icon>
                                                                        <v-icon>share</v-icon>
                                                                    </v-btn>
                                                                </v-card-actions>
                                                            </v-card>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-container>
                                            </v-card>
                                        </v-flex>
                                        <-- end !-->
                                        <table>
                                            <tr v-for="(index,i) in props.item.keys" :key="i.key" style="width:20%">
                                                <td style="width:20%">
                                                    <v-tooltip top>
                                                        <template slot="activator" color="success">
                                                            <v-edit-dialog :value="index.key"
                                                                :return-value.sync="index.key" large persistent
                                                                color="red" @save="edit_key(props.item,i)">
                                                                <v-chip text-color="white"
                                                                    @click="Keytochange=index.key"
                                                                    :color="getColor(props.item.keys.length)">
                                                                    {{ index.key }}
                                                                </v-chip>
                                                                <template v-slot:input>
                                                                    <v-text-field v-model="index.key"
                                                                        :rules="[max25chars]" label="Edit" single-line
                                                                        counter autofocus color="red" return-object>
                                                                    </v-text-field>
                                                                </template>
                                                            </v-edit-dialog>
                                                        </template>
                                                        <span>Click to Edit Key</span>
                                                    </v-tooltip>
                                                </td>
                                                <td>
                                                    <v-checkbox v-model="index.traded" hide-details></v-checkbox> Traded
                                                </td>
                                                <td v-if="index.traded">
                                                    <v-text-field label="Traded With ?"></v-text-field>
                                                </td>
                                                <td>
                                                    <v-checkbox v-model="index.beta" hide-details
                                                        @change="index.beta ? index.betadate=new Date().toISOString().slice(0, 10) : delete index.betadate"
                                                        class="shrink mr-2 mt-0"></v-checkbox> Beta
                                                </td>
                                                <td v-if="index.beta">
                                                    <v-menu v-model="datepicker" :close-on-content-click="false"
                                                        :nudge-right="40" lazy transition="scale-transition" offset-y
                                                        full-width max-width="290px" min-width="290px">
                                                        <template v-slot:activator="{ on }">
                                                            <v-text-field v-model="index.betadate"
                                                                label="Beta Ending Date" prepend-icon="event" readonly
                                                                v-on="on"></v-text-field>
                                                        </template>
                                                        <v-date-picker v-model="index.betadate"
                                                            @input="datepicker = false">
                                                        </v-date-picker>
                                                    </v-menu>
                                                </td>
                                                <td style="width:20%">
                                                    <v-tooltip top>
                                                        <v-btn slot="activator" color="success"
                                                            @click="copykey(index.key)" :id="index.key" icon small>
                                                            <v-icon small>
                                                                mdi-content-copy
                                                            </v-icon>
                                                        </v-btn>
                                                        <span class="top">Copy Key</span>
                                                    </v-tooltip>
                                                    <!--<v-tooltip top>
                                                        <v-btn slot="activator" color="info" icon small>
                                                            <v-icon small>
                                                                mdi-tooltip-edit
                                                            </v-icon>
                                                        </v-btn>
                                                        <span class="top">Edit Key</span>
                                                    </v-tooltip>!-->
                                                    <v-tooltip top>
                                                        <v-btn slot="activator" color="error"
                                                            @click="deletekeydialog=true;keytodelete=index.key;Itemtodelete=props.item"
                                                            icon small>
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
        <v-dialog v-model="editdialog" persistent scrollable max-width="800px">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit app</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <table>
                                <tr>
                                    <v-flex xs12 sm12 md12>
                                        <v-select required :items='platforms.map(e => e.name)'
                                            v-model="editedItem.platform" label="Platform"
                                            @change="PlatformEdited(editedItem.platform);editedItem.name='';editedItem.appid=''"
                                            :prepend-icon="editedItem.platform=='Steam'||editedItem.platform=='Origin' ? 'mdi-'+editedItem.platform.toLowerCase() : 'mdi-key'">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs4 sm4 md4>
                                        <v-text-field :rules="[v => !!v || 'This field is required']"
                                            :disabled="editedItem.platform=='Origin' || editedItem.platform=='Other'"
                                            v-model="editedItem.appid" label="ID" @input="IDEdited(editedItem)">
                                        </v-text-field>
                                    </v-flex>
                                </tr>
                                <tr>
                                    <v-flex xs8 sm8 md8>
                                        <v-combobox :items='this.appnames' v-model="editedItem.name"
                                            @change="NameEdited(editedItem)" label="Name">
                                        </v-combobox>
                                    </v-flex>
                                </tr>
                                <tr>
                                    <v-chip disabled class="mx-auto" text-color="white" color="green">
                                        <v-icon>mdi-key</v-icon>
                                        <div class="pa-2 ma-2">Keys</div>
                                    </v-chip>
                                    <v-flex xs12 sm12 md12 v-for="(index,i) in editedItem.keys" :key="i">
                                        <v-text-field v-model="index.key" :label="'Key '+ parseInt(i+1)"
                                            :rules="[max25chars]" color="red">
                                        </v-text-field>
                                    </v-flex>
                                </tr>
                                <tr>
                                    <v-flex xs12 sm12 md12>
                                        <v-combobox :items="gametags" label="Game Tags" chips clearable
                                            prepend-icon="filter_list" solo multiple v-model="editedItem.tags">
                                            <template v-slot:selection="tags">
                                                <v-chip :selected="tags.selected" close
                                                    @input="removetag(editedItem,tags.item)" color="orange" outline>
                                                    <strong>{{ tags.item }}</strong>
                                                </v-chip>
                                            </template>
                                            <template v-slot:no-data>
                                                <v-list-tile>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>
                                                            No results found. Press <kbd>enter</kbd> to create a new tag
                                                        </v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </template>
                                        </v-combobox>
                                    </v-flex>
                                </tr>
                            </table>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat _click="close" @click="editdialog = !editdialog">Cancel
                    </v-btn>
                    <v-btn color="blue darken-1"
                        :disabled="editedItem.appid == '' || editedItem.platform == '' || editedItem.name == '' ? true : false"
                        :loading="isAdding" flat @click="save(editedItem,oldediteditem);isAdding = true">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="addialog" max-width="800px" persistent scrollable loading>
            <v-card>
                <v-progress-linear :active="isAdding" class="ma-0" color="blue lighten-3" height="4" indeterminate>
                </v-progress-linear>
                <v-card-title>
                    <span class="headline">Add app</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <table>
                                <tr>
                                    <v-flex xs12 sm12 md12>
                                        <v-select required :rules="[v => !!v || 'Platform is required']"
                                            :items='platforms.map(e => e.name)' v-model="itemtoadd.platform"
                                            @change="PlatformEdited(itemtoadd.platform);itemtoadd.name='';itemtoadd.tags=[];itemtoadd.appid=''"
                                            :readonly="$route.path.includes('/keys') ? false : true" label="Platform"
                                            :prepend-icon="itemtoadd.platform=='Steam'||itemtoadd.platform=='Origin' ? 'mdi-'+itemtoadd.platform.toLowerCase() : 'mdi-key'">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs4 sm4 md4>
                                        <v-text-field :rules="[v => !!v || 'This field is required']"
                                            :disabled="itemtoadd.platform=='Origin' || itemtoadd.platform=='Other'"
                                            v-model="itemtoadd.appid" label="ID" @input="IDEdited(itemtoadd)">
                                        </v-text-field>
                                    </v-flex>
                                </tr>
                                <tr>
                                    <v-flex xs8 sm8 md8>
                                        <v-combobox :items='this.appnames' v-model="itemtoadd.name"
                                            @change="NameEdited(itemtoadd)" label="Name">
                                        </v-combobox>
                                    </v-flex>
                                </tr>
                                <tr>
                                    <v-chip disabled class="mx-auto" text-color="white" color="green">
                                        <v-icon>mdi-key</v-icon>
                                        <div class="pa-2 ma-2">Keys</div>
                                    </v-chip>
                                    <v-flex xs12 sm12 md12>
                                        <div v-for="(index,i) in itemtoadd.keys.length" :key="i">
                                            <v-text-field placeholder="XXXX-XXXX-XXXX-XXXX"
                                                v-model="itemtoadd.keys[i].key" :label="'Key '+parseInt(i+1)"
                                                :rules="[max25chars]" color="red">
                                            </v-text-field>
                                        </div>
                                    </v-flex>
                                </tr>
                                <tr>
                                    <v-flex xs12 sm12 md12>
                                        <v-btn round @click="itemtoadd.keys.push({key:''})">add key</v-btn>
                                    </v-flex>
                                </tr>
                                <tr>
                                    <v-flex xs12 sm12 md12>
                                        <v-combobox v-model="itemtoadd.tags" :items="gametags" label="Game Tags" chips
                                            clearable prepend-icon="filter_list" solo multiple>
                                            <template v-slot:selection="tags">
                                                <v-chip :selected="tags.selected" close
                                                    @input="removetag(itemtoadd,tags.item)" color="orange" outline>
                                                    <strong>{{ tags.item }}</strong>
                                                </v-chip>
                                            </template>
                                            <template v-slot:no-data>
                                                <v-list-tile>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>
                                                            No results found. Press <kbd>enter</kbd> to create a new tag
                                                        </v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </template>
                                        </v-combobox>
                                    </v-flex>
                                </tr>
                            </table>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat _click="close" depressed @click="addialog = !addialog;itemtoadd={
                    appid: '',
                    name: '',
                    platform: '',
                    keys: [{
                        key: ''
                    }],
                    tags : []
                }">Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" flat
                        :disabled="itemtoadd.platform == '' || itemtoadd.name == '' || itemtoadd.appid == '' && itemtoadd.platform != 'Other' ? true : false"
                        :loading="isAdding" @click="add(itemtoadd);isAdding = true">Add</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="infodialog" persistent max-width="40%" @keydown.esc="infodialog = false"
            @keydown.enter="infodialog = false">
            <v-flex xs12>
                <v-card class="white--text">
                    <v-img
                        :src="itemtoadd.platform == 'Steam' ? 'https://steamcdn-a.akamaihd.net/steam/apps/' + itemtoadd.appid + '/header.jpg' : itemtoadd.platform == 'Uplay' ? 'https://transform.dis.commercecloud.salesforce.com/transform/ABBS_PRD/on/demandware.static/-/Sites-masterCatalog/default/images/large/'+itemtoadd.appid+'.jpg' : 'apps/undefined.gif'"
                        onerror="this.src='apps/undefined.gif'" height="410px">
                        <div style='background: rgb(0,0,0);
background: radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(255,255,255,0) 0%, rgba(0,0,0,1) 100%);'>
                            <v-layout row>
                                <v-flex xs5>
                                    <v-img
                                        :src="itemtoadd.platform == 'Steam' ? 'https://steamcdn-a.akamaihd.net/steam/apps/' + itemtoadd.appid + '/header.jpg' : itemtoadd.platform == 'Uplay' ? 'https://transform.dis.commercecloud.salesforce.com/transform/ABBS_PRD/on/demandware.static/-/Sites-masterCatalog/default/images/large/'+itemtoadd.appid+'.jpg' : 'apps/undefined.gif'"
                                        onerror="this.src='apps/undefined.gif'" height="350px" contain>
                                    </v-img>
                                </v-flex>
                                <v-flex xs7>
                                    <v-card-title primary-title>
                                        <div height="50px">
                                            <div class="headline">{{itemtoadd.name}}</div>
                                            <div class="pa-2 ma-2">
                                                <v-icon v-if="itemtoadd.platform=='Steam'" dense color='white'>mdi-steam
                                                </v-icon>
                                                <v-icon v-else-if="itemtoadd.platform=='Uplay'" color='white'>
                                                    mdi-ubisoft
                                                </v-icon>
                                                <v-icon v-else-if="itemtoadd.platform=='Origin'" dense color='white'>
                                                    mdi-origin
                                                </v-icon>
                                                <v-icon v-else-if="itemtoadd.platform=='Other'" dense color='white'>
                                                    mdi-alert-circle
                                                </v-icon> <span>{{itemtoadd.platform}}</span>
                                            </div>
                                            <div>Developer : "Valve, Hidden Path Entertainment" </div>
                                            <div>Publisher : "Valve" </div>
                                            <div>
                                                Price : "0"
                                            </div>
                                            <div>Genre : "Action, Free to Play"</div>
                                        </div>
                                    </v-card-title>
                                </v-flex>
                            </v-layout>
                            <v-divider light></v-divider>
                            <v-card-actions class="pa-3">
                                <v-btn> More </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat round _click="close" @click="infodialog=!infodialog">
                                    Ok
                                </v-btn>
                            </v-card-actions>
                        </div>
                    </v-img>
                </v-card>
            </v-flex>
        </v-dialog>
        <v-dialog v-model="deletedialog" max-width="300px" persistent @keydown.esc="deletedialog = false"
            @keydown.enter="deleteItem(Itemtodelete)">
            <v-card>
                <v-card-title class="headline">Delete this App?</v-card-title>
                <v-card-text>
                    Accepting This will result in loosing all the Keys of this game!
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat="flat" @click="deletedialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="red darken-1" flat="flat" @click="deleteItem(Itemtodelete)">
                        Accept
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deletekeydialog" max-width="300" persistent @keydown.esc="deletekeydialog = false"
            @keydown.enter="deletekey(keytodelete,Itemtodelete)">
            <v-card>
                <v-card-title class="headline">Delete this Key?</v-card-title>
                <v-card-text>
                    Are you sure you want to delete this key ? </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat="flat" @click="deletekeydialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="red darken-1" flat="flat" @click="deletekey(keytodelete,Itemtodelete)">
                        Accept
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="importdialog" max-width="700px" scrollable persistent>
            <v-card>
                <v-card-title class="headline">Import Keys</v-card-title>
                <v-card-text>
                    show data here
                    <table>
                        <tr v-for="(index,i) in platforms" :key="i">
                            <td style="width : 70%">
                                <v-text-field label="Name"></v-text-field>
                            </td>
                            <td style="width : 30%">
                                <v-text-field label="Key"></v-text-field>
                            </td>
                        </tr>
                    </table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat="flat" @click="hideimportdialog()">
                        Cancel
                    </v-btn>
                    <v-btn color="red darken-1" flat="flat">
                        Import
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-speed-dial v-model="fab" bottom right fixed direction="top" transition="slide-y-transition" open-on-hover>
            <template v-slot:activator>
                <v-btn v-model="fab" color="blue darken-2" dark fab>
                    <v-icon style="top : -10px">add</v-icon>
                    <v-icon style="top : -10px">close</v-icon>
                </v-btn>
            </template>
            <v-btn fab dark small color="indigo"
                @click="addialog = true; if (!$route.path.includes('/keys')) {itemtoadd.platform=subStr($route.path);PlatformEdited(itemtoadd.platform)}">
                <v-icon>add</v-icon>
            </v-btn>
            <v-btn fab dark small color="green">
                <v-icon>mdi-export</v-icon>
            </v-btn>
            <v-btn v-if="!$route.path.includes('/keys')" fab dark small color="orange"
                @click='impport(this.window.location.hash.slice(2).charAt(0).toUpperCase()+this.window.location.hash.slice(3))'>
                <v-icon>mdi-import</v-icon>
            </v-btn>
        </v-speed-dial>
        <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom :color="msg.color">
            <div class="pa-2 ma-2">{{msg.text}}</div>
        </v-snackbar>
    </v-layout>
</template>
<script>
    module.exports = {
        props: {
            searchvalue: {
                type: String,
                default: ''
            }
        },
        watch: {
            'itemtoadd.keys': {
                handler: function (after, before) {
                    for (var i = 0; i < after.length; i++) {
                        after[i].key = after[i].key.toUpperCase();
                    }
                },
                deep: true
            },
            'editedItem.keys': {
                handler: function (after, before) {
                    for (var i = 0; i < after.length; i++) {
                        after[i].key = after[i].key.toUpperCase();
                    }
                },
                deep: true
            },
            isAdding(val) {
                if (val) {
                    setTimeout(() => (this.isAdding = false), 500)
                }
            }
        },
        computed: {
            importdialog() {
                return store.state.import
            },
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
                msg: {
                    text: '',
                    color: 'green'
                },
                Keytochange: null,
                hasSaved: false,
                isAdding: false,
                expand: false,
                direction: 'top',
                fab: false,
                pagination: {
                    totalItems: '',
                    rowsPerPage: 10
                },
                max25chars: v => v.length <= 25 || 'Key is too long!',
                gametags: ["Indie", "Action", "Adventure", "Casual", "Low Confidence Metric", "Simulation",
                    "Strategy", "RPG", "Singleplayer", "Early Access", "Free to Play", "2D", "Great Soundtrack",
                    "Atmospheric", "Puzzle", "Violent", "Multiplayer", "VR", "Story Rich", "Gore", "Fantasy",
                    "Anime", "Nudity", "Difficult", "Sports", "Horror", "Sexual Content", "Pixel Graphics",
                    "Platformer", "Sci-fi", "Funny", "Massively Multiplayer", "Racing", "Shooter",
                    "Female Protagonist", "First-Person", "Open World", "Retro", "Turn-Based", "Co-op",
                    "Arcade", "Family Friendly", "FPS", "Visual Novel", "Survival", "Comedy", "Sandbox", "Cute",
                    "Exploration", "Online Co-Op", "Movie", "Point &amp; Click", "Classic", "Replay Value",
                    "Relaxing", "Space", "Utilities", "Design &amp; Illustration", "Psychological Horror",
                    "Masterpiece", "Colorful", "Third Person", "Software", "Local Multiplayer", "Fast-Paced",
                    "RPGMaker", "Physics", "Controller", "Mystery", "Shoot 'Em Up", "Tactical", "Rogue-like",
                    "Zombies", "Short", "Party-Based RPG", "Management", "Local Co-Op", "Side Scroller",
                    "Building", "Dark", "Memes", "Hidden Object", "Realistic", "Adult Content",
                    "Turn-Based Strategy", "Puzzle-Platformer", "Survival Horror", "Music", "RTS",
                    "Choices Matter", "Education", "Web Publishing", "Historical", "Rogue-lite", "Bullet Hell",
                    "War", "Top-Down", "Minimalist", "Mature", "Action-Adventure", "Crafting", "Action RPG",
                    "JRPG", "Competitive", "Tower Defense", "Stealth", "Hack and Slash",
                    "Procedural Generation", "Walking Simulator", "4 Player Local", "Fighting",
                    "Dungeon Crawler", "PvP", "Audio Production", "Old School", "Post-apocalyptic", "Card Game",
                    "Romance", "Drama", "Dark Fantasy", "Isometric", "Top-Down Shooter", "Turn-Based Combat",
                    "Animation &amp; Modeling", "Character Customization", "Multiple Endings", "Medieval",
                    "Third-Person Shooter", "Cartoony", "Base Building", "Stylized", "Cyberpunk",
                    "Resource Management", "Dating Sim", "Surreal", "Turn-Based Tactics", "Episodic", "Economy",
                    "Metroidvania", "Driving", "Moddable", "Futuristic", "World War II", "Military", "Magic",
                    "Robots", "Board Game", "3D Platformer", "Text-Based", "City Builder", "Hand-drawn",
                    "Choose Your Own Adventure", "Twin Stick Shooter", "Beat 'em up", "Soundtrack",
                    "Dark Humor", "Thriller", "Flight", "1990's", "Experimental", "Aliens",
                    "Interactive Fiction", "Detective", "Perma Death", "Match 3", "Level Editor", "Abstract",
                    "Cult Classic", "Mouse only", "Addictive", "Beautiful", "Crime", "MMORPG",
                    "Video Production", "Game Development", "Team-Based", "Arena Shooter", "Clicker", "Cartoon",
                    "Destruction", "Parkour", "LGBTQ+", "Grand Strategy", "2.5D", "Rhythm", "Steampunk",
                    "Psychological", "Trains", "Blood", "Logic", "Real-Time", "3D", "2D Fighter",
                    "Lovecraftian", "Loot", "Kickstarter", "Remake", "Real-Time with Pause",
                    "Software Training", "Space Sim", "1980s", "4X", "Score Attack", "GameMaker", "Mechs",
                    "Dystopian ", "Pirates", "Alternate History", "Documentary", "Time Management", "Otome",
                    "Demons", "Illuminati", "Tanks", "Wargame", "Real Time Tactics", "Linear", "Split Screen",
                    "Tactical RPG", "Dungeons &amp; Dragons", "Touch-Friendly", "Narration", "Strategy RPG",
                    "Voxel", "Science", "PvE", "Dark Comedy", "Hex Grid", "MOBA", "Western", "Runner",
                    "Psychedelic", "Tutorial", "NSFW", "TrackIR", "Dragons", "Naval", "Noir", "Ninja",
                    "Comic Book", "Dinosaurs", "Battle Royale", "Political", "Swordplay", "Superhero", "CRPG",
                    "Hacking", "Trading Card Game", "Supernatural", "eSports", "Agriculture", "Politics",
                    "Souls-like", "Photo Editing", "God Game", "Parody ", "Grid-Based Movement", "Mod",
                    "Lore-Rich", "Underwater", "Character Action Game", "Mythology", "Cold War", "FMV",
                    "Crowdfunded", "Cats", "Gothic", "Based On A Novel", "Nature", "Time Attack", "Cinematic",
                    "Emotional", "Football", "Vampire", "Villain Protagonist", "Time Travel",
                    "Inventory Management", "Epic", "Satire", "Games Workshop", "Trading", "Programming",
                    "Modern", "Gaming", "Assassin", "Experience", "Soccer", "Philisophical",
                    "Silent Protagonist", "Bullet Time", "Hunting", "Nonlinear", "Word Game", "Fishing",
                    "Martial Arts", "Time Manipulation", "America", "3D Vision", "World War I",
                    "Co-op Campaign", "Minigames", "Warhammer 40K", "Music-Based Procedural Generation",
                    "Faith", "Heist", "Chess", "Gun Customization", "Investigation", "LEGO", "Sailing",
                    "Offroad", "Capitalism", "Quick-Time Events", "Spectacle fighter", "6DOF", "Mars", "Dog",
                    "Class-Based", "Asynchronous Multiplayer", "Typing", "Artificial Intelligence", "Rome",
                    "Horses", "Sniper", "Conspiracy", "Pinball", "Dynamic Narration", "Mining", "360 Video",
                    "Mystery Dungeon", "Sokoban", "Star Wars", "Werewolves", "On-Rails Shooter", "Golf",
                    "Sequel", "Conversation", "Diplomacy", "Basketball", "Gambling", "Solitaire", "Bikes",
                    "Batman", "Immersive Sim", "Underground", "Mini Golf", "Motorbike", "Unforgiving",
                    "Intentionally Awkward Controls", "Submarine", "Benchmark", "Baseball", "Feature Film",
                    "Transhumanism", "Tennis", "Wrestling", "Lemmings", "Automation", "Hockey", "Pool",
                    "Motocross", "Lara Croft", "Voice Control", "Foreign", "Skateboarding", "Steam Machine",
                    "Spelling", "Bowling", "Cycling", "Hardware", "Jet", "Snow", "Transportation", "Skating",
                    "Asymmetric VR", "BMX", "Snowboarding", "ATV", "Skiing", "Social Deduction"
                ],
                fling: false,
                tabs: null,
                search: '',
                appnames: [],
                Itemtodelete: null,
                keytodelete: null,
                deletedialog: false,
                datepicker: false,
                deletekeydialog: false,
                editdialog: false,
                infodialog: false,
                addialog: false,
                platforms: [{
                    name: 'Steam',
                    color: '#1d2f54'
                }, {
                    name: 'Uplay',
                    color: '#0e82cf'
                }, {
                    name: 'Origin',
                    color: '#eb6a00'
                }, {
                    name: 'Other',
                    color: 'success'
                }],
                headers: [{
                        text: 'Pic',
                        align: 'left',
                        sortable: false,
                        show: true,
                        value: 'appid'
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
                    keys: [{
                        key: ''
                    }],
                    tags: [],
                },
                editedItem: {
                    appid: '',
                    name: '',
                    platform: '',
                    keys: [],
                    tags: [],
                },
            }
        },
        methods: {
            impport(Platform) {
                impport(Platform);
            },
            gettags(item) {
                index = store.state.steamkey.map(e => e.appid).indexOf(getappid(item));
                if (index == -1) {
                    tags(item.appid)
                    item.tags = tagsapp;
                } else item.tags = store.state.steamkey[index].tags;
            },
            IDEdited(item) {
                switch (item.platform) {
                    case 'Steam':
                        index = store.state.steam.map(e => e.appid).indexOf(getappid(item));
                        if (index == -1) {
                            item.name = '';
                            item.tags = [];
                        } else {
                            item.name = store.state.steam[index].name;
                            this.gettags(item);
                        }
                        break;
                    case 'Origin':
                        index = store.state.origin.map(e => e.appid).indexOf(getappid(item));
                        if (index == -1) item.name = ''
                        else item.name = store.state.origin[index].name;
                        break;
                    case 'Uplay':
                        index = store.state.uplay.map(e => e.appid).indexOf(getappid(item));
                        if (index == -1) item.name = ''
                        else item.name = store.state.uplay[index].name;
                        break;
                    case 'Other':
                        index = store.state.others.map(e => e.appid).indexOf(getappid(item));
                        if (index == -1) item.name = ''
                        else item.name = store.state.otehrs[index].name;
                        break;
                }
            },
            NameEdited(item) {
                switch (item.platform) {
                    case 'Steam':
                        index = store.state.steam.map(e => e.name).indexOf(item.name);
                        if (index == -1) {
                            item.appid = '';
                            item.tags = []
                        } else {
                            item.appid = store.state.steam[index].appid;
                            this.gettags(item)
                        }
                        break;
                    case 'Origin':
                        index = store.state.origin.map(e => e.name).indexOf(item.name);
                        if (index == -1) item.appid = ''
                        else item.appid = store.state.origin[index].appid;
                        break;
                    case 'Uplay':
                        index = store.state.uplay.map(e => e.name).indexOf(item.name);
                        if (index == -1) item.appid = ''
                        else item.appid = store.state.uplay[index].appid;
                        break;
                    case 'Other':
                        index = store.state.others.map(e => e.name).indexOf(item.name);
                        if (index == -1) item.appid = ''
                        else item.appid = store.state.others[index].appid;
                        break;
                }


            },
            PlatformEdited(platform) {
                switch (platform) {
                    case 'Steam':
                        this.appnames = store.state.steam.map(e => e.name)
                        break;
                    case 'Uplay':
                        this.appnames = store.state.uplay.map(e => e.name)
                        break;
                    case 'Origin':
                        this.appnames = store.state.origin.map(e => e.name)
                        break;
                    case 'Other':
                        this.appnames = store.state.others.map(e => e.name)
                        break;
                }
            },
            removetag(item, tag) {
                item.tags.splice(item.tags.indexOf(tag), 1)
            },
            Lowercasefirst(text) {
                return text.charAt(0).toLowerCase() + text.slice(1);
            },
            Equals(item1, item2) {
                return item1.platform == item2.platform & item1.name == item2.name & item1.appid == item2.appid &
                    item1.keys.length == item2.keys.length
            },
            editkey(item, oldkey, newkey) {
                editkey(gettab(item.platform), getappid(item), oldkey, newkey);
                // index = this.apps.map(e => e.appid).indexOf(getappid(item.appid));
                // indexk = this.apps[index].keys.map(e => e.key).indexOf(oldkey);
                //item.keys[indexk].key = newkey;
            },
            edit_key(item, index) {
                editkey(gettab(item.platform), getappid(item), this.Keytochange, item.keys[index]
                    .key)
            },
            updatetags(item, newtags) {
                index = this.apps.map(e => e.appid).indexOf(item.appid);
                this.apps[index].tags = newtags;
                updatetags(gettab(item.platform), getappid(item), newtags);
            },
            save(item1, item2) {
                for (i = 0; i < item2.keys.length; i++) {
                    if (item2.keys[i].key !== item1.keys[i].key)
                        this.editkey(item2, item2.keys[i].key, item1.keys[i]
                            .key)
                }
                this.updatetags(item2, item1.tags);

                if (!this.Equals(item2, item1)) {
                    i = 0;
                    gameexists = false;
                    while (i < this.apps.length) {
                        if (this.apps[i].appid == item1.appid) {
                            gameexists = true;
                            break;
                        }
                        i++
                    }
                    index = this.apps.map(e => e.appid).indexOf(item2.appid);
                    k = 0;
                    while (k < item1.keys.length) {
                        addkey(gettab(item1.platform), getappid(item1), item1.keys[k].key);
                        if (gameexists) {
                            this.apps[i].keys.push(item1.keys[k]);
                        }
                        k++;
                    }
                    delgametagskeys(gettab(item2.platform), getappid(item2));
                    this.apps.splice(index, 1);
                    var newitem = {
                        name: item1.name,
                        appid: item1.appid,
                        platform: item1.platform,
                        keys: item1.keys,
                        tags: item1.tags
                    }
                    if (!gameexists)
                        if (!this.$route.path.includes('/keys')) {
                            switch (item1.platform) {
                                case 'Steam':
                                    store.state.steamkey.push(newitem);
                                    break;
                                case 'Uplay':
                                    store.state.uplaykey.push(newitem);
                                    break;
                                case 'Origin':
                                    store.state.originkey.push(newitem);
                                    break;
                                case 'Other':
                                    store.state.otherskey.push(newitem);
                                    break;
                            }
                        } else
                            this.apps.push(newitem);

                    this.UpdateVuex(item1.platform, this.apps);
                    this.UpdateVuex(item2.platform, this.apps);
                }
                this.editedItem = {
                    appid: '',
                    name: '',
                    platform: '',
                    keys: [],
                    tags: []
                };

                this.oldeditedItem = null;
                this.msg.text = "App Saved successfully";
                this.hasSaved = true;
                this.editdialog = false;
            },
            UpdateVuex(platform, newvalue) {
                if (this.$route.path.includes('/keys')) {
                    switch (platform) {
                        case 'Steam':
                            store.state.steamkey = newvalue.reduce(function (items, item) {
                                if (item.platform == 'Steam')
                                    return items.concat(item);
                                else return items
                            }, []);
                            break;
                        case 'Uplay':
                            store.state.uplaykey = newvalue.reduce(function (items, item) {
                                if (item.platform == 'Uplay')
                                    return items.concat(item);
                                else return items
                            }, []);
                            break;
                        case 'Origin':
                            store.state.originkey = newvalue.reduce(function (items, item) {
                                if (item.platform == 'Origin')
                                    return items.concat(item);
                                else return items
                            }, []);
                            break;
                        case 'Other':
                            store.state.otherskey = newvalue.reduce(function (items, item) {
                                if (item.platform == 'Other')
                                    return items.concat(item);
                                else return items
                            }, []);
                            break;
                    }
                }
            },
            add(app) {
                if (gettab(app.platform) == 1 && app.appid == '') {
                    for (var i = 0; i < app.keys.length; i++) {
                        addkey(gettab(app.platform), {
                            appid: this.apps.length,
                            name: app.name
                        }, app.keys[i].key);

                    }
                } else {
                    for (var i = 0; i < app.keys.length; i++)
                        addkey(gettab(app.platform), getappid(app), app.keys[i].key);
                }
                updatetags(gettab(app.platform), getappid(app), app.tags);

                var index = this.apps.map(e => e.appid).indexOf(getappid(app));
                if (index == -1)
                    this.apps.push({
                        appid: app.platform == 'Other' ? this.apps.length : getappid(app),
                        name: app.name,
                        keys: app.keys,
                        platform: app.platform,
                        tags: app.tags
                    });
                else this.apps[index].keys = this.apps[index].keys.concat(app.keys);

                this.UpdateVuex(app.platform, this.apps);
                this.itemtoadd = {
                    appid: '',
                    name: '',
                    platform: '',
                    tags: [],
                    keys: [{
                        key: ''
                    }],
                    tags: []
                }
                this.msg.text = "App Added successfully";
                this.hasSaved = true;
                this.addialog = false;
            },
            hideimportdialog() {
                store.state.import = false
            },
            editItem(item) {
                this.editedItem = JSON.parse(JSON.stringify(item));
                this.oldediteditem = JSON.parse(JSON.stringify(item));
                this.PlatformEdited(this.editedItem.platform);
                this.editdialog = true;
            },
            deleteItem(item) {
                const index = this.apps.indexOf(item)
                delgametagskeys(gettab(item.platform), getappid(item)) & this.apps.splice(index, 1) & this
                    .UpdateVuex(item.platform, this.apps);
                this.deletedialog = false;
            },
            deletekey(key, item) {
                const index = this.apps.indexOf(item);
                const indexi = this.apps[index].keys.map(e => e.key).indexOf(key);
                delkey(gettab(item.platform), getappid(item), key) & this.apps[
                    index].keys.splice(indexi, 1);
                if (item.keys.length == 0) {
                    this.apps.splice(index, 1);
                    delgametagskeys(gettab(item.platform), getappid(item));
                    this.UpdateVuex(item.platform, this.apps);
                }
                this.deletekeydialog = false;
            },
            subStr(string) {
                if (string.includes('/keys')) {
                    return 'all'
                } else {
                    return string.substring(1, 15).charAt(0).toUpperCase() + string.substring(1, 15).slice(
                        1);
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
                this.itemtoadd = item;
            },
            getColor(qnt) {
                if (qnt < 1) return 'red'
                else if (qnt > 1) return 'green'
                else return 'orange'
            }
        },
        mounted() {
            this.search = this.searchvalue;
            if (window.location.hash.slice(1).includes("/keys")) {
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
                    this.apps = store.state.otherskey
                    break;
                default:
                    this.apps = store.state.steamkey.concat(store.state.uplaykey.concat(store.state.originkey
                        .concat(store.state.otherskey)))
                    break;
            }
        },
    }
</script>