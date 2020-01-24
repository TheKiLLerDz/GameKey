<template>
    <v-layout row wrap>
        <v-flex xs12 sm12 md12>
            <v-card class="elevation-5 px-2"
                style="border-radius: 8px; height: calc(100% - 70px);padding: 0px 0px 75px 0px;">
                <v-card
                    :class="$route.path.includes('/other') ? 'greencard' : $route.path.includes('/steam') ? 'steamcard':$route.path.includes('/origin') ? 'orangecard': 'infocard'"
                    class='white--text unselectable' style="top:-30px; padding: 15px;border-radius: 8px;">
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
                            <span
                                :class="($route.path=='/origin') ? 'orange--text' : ($route.path=='/other') ? 'green--text' :'blue--text'"
                                v-text="header.text" />
                        </template>
                        <template slot="items" slot-scope="props">
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
                                <v-chip class='unselectable'
                                    :color="getColor(props.item.keys.reduce(function (length, key) {
                                        if (key.trade != undefined && key.trade.value) return length; else return length + 1 }, 0))" dark>
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
                        <template v-slot:expand="props">
                            <v-card flat>
                                <v-card-text>
                                    <v-alert value="true" :color="getColor(props.item.keys.reduce(function (length, key) {
                                        if (key.trade && key.trade.value) return length; else return length + 1 }, 0))"
                                        outline>
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
                                                                    :color="index.trade && index.trade.value ? 'red': 'blue'">
                                                                    {{ index.key }}
                                                                </v-chip>
                                                                <template v-slot:input>
                                                                    <v-text-field v-model="index.key"
                                                                        :maxLength="props.item.platform == 'Steam' ? 17 : props.item.platform == 'Origin' ? 24 : props.item.platform == 'Uplay' ? 19 : 40"
                                                                        :rules="[rules.max25chars]" label="Edit"
                                                                        single-line counter autofocus color="red"
                                                                        @input="GetKeyFormat(props.item,index.key)"
                                                                        return-object>
                                                                    </v-text-field>
                                                                </template>
                                                            </v-edit-dialog>
                                                        </template>
                                                        <span>Click to Edit Key</span>
                                                    </v-tooltip>
                                                </td>
                                                <td>
                                                    <v-checkbox v-if="index.trade" v-model="index.trade.value"
                                                        @change="if (index.trade.value!=undefined && index.trade.value) TradeKeyEdit(props.item,index.key,''); else deletetrade(props.item,index);"
                                                        hide-details><template v-slot:label>
                                                            <v-text-field v-if="index.trade.value"
                                                                v-model="index.trade.user" label="Traded With ?"
                                                                @change="TradeKeyEdit(props.item,index.key,index.trade.user)"
                                                                @click.stop.prevent="doNothing()"> </v-text-field>
                                                            <div v-else>Traded</div>
                                                        </template></v-checkbox>
                                                    <v-checkbox v-else v-model="index.tradevalue" false-value="false"
                                                        true-value="true"
                                                        @change="TradeKeyEdit(props.item,index.key,'');index.trade={value:true,user:''};delete index.tradevalue"
                                                        hide-details label="Traded"></v-checkbox>
                                                </td>
                                                <td>
                                                    <v-checkbox v-if="index.beta" v-model="index.beta.value"
                                                        hide-details
                                                        @change="index.beta.value ? BetaKeyEdit(props.item,index,new Date().toISOString().slice(0, 10)) : deletebeta(props.item,index)"
                                                        class="shrink mr-2 mt-0"><template v-slot:label>
                                                            <v-menu v-if="index.beta.value" v-model="index.datepicker"
                                                                :close-on-content-click="false" :nudge-right="90" lazy
                                                                transition="scale-transition" offset-y full-width
                                                                max-width="290px" min-width="290px">
                                                                <template v-slot:activator="{ on }">
                                                                    <v-text-field v-model="index.beta.enddate"
                                                                        label="Beta Ending Date" prepend-icon="event"
                                                                        @click.stop.prevent="doNothing()" readonly
                                                                        v-on="on"></v-text-field>
                                                                </template>
                                                                <v-date-picker v-model="index.beta.enddate"
                                                                    @click.stop.prevent="doNothing()"
                                                                    @input="BetaKeyEdit(props.item,index,index.beta.enddate);index.datepicker = false">
                                                                </v-date-picker>
                                                            </v-menu>
                                                            <div v-else>
                                                                Beta
                                                            </div>
                                                        </template></v-checkbox>
                                                    <v-checkbox v-else label="Beta" v-model="index.betavalue"
                                                        @change="BetaKeyEdit(props.item,index,new Date().toISOString().slice(0, 10));delete index.betavalue"
                                                        hide-details></v-checkbox>
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
        <v-dialog v-model="editdialog" persistent scrollable width="70vw" @keydown.esc="editdialog = !editdialog"
            @keydown.enter="form ? save(editedItem,oldediteditem) : null ;isAdding = true">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit app</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-form v-model="form">
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-select :items='platforms.map(e => e.name)' v-model="editedItem.platform"
                                        label="Platform"
                                        @change="PlatformEdited(editedItem.platform);editedItem.name='';editedItem.appid=''"
                                        :prepend-icon="editedItem.platform=='Steam'||editedItem.platform=='Origin' ? 'mdi-'+editedItem.platform.toLowerCase() : editedItem.platform=='Uplay' ? 'mdi-ubisoft' :'mdi-key'"
                                        required>
                                    </v-select>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <v-text-field :rules="[v => !!v || 'This field is required']"
                                        :disabled="editedItem.platform=='Origin' || editedItem.platform=='Other'"
                                        v-model="editedItem.appid" label="ID" @input="IDEdited(editedItem)" required>
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs8 sm8 md8>
                                    <v-combobox :items='this.appnames' :rules="[v => !!v || 'This field is required']"
                                        v-model="editedItem.name" @change="NameEdited(editedItem)" label="Name"
                                        required>
                                    </v-combobox>
                                </v-flex>
                                <v-chip disabled class="mx-auto" text-color="white" color="green">
                                    <v-icon>mdi-key</v-icon>
                                    <div class="pa-2 ma-2">Keys</div>
                                </v-chip>
                                <v-flex xs12 sm12 md12 v-for="(index,i) in editedItem.keys" :key="i">
                                    <v-text-field v-model="index.key" :label="'Key '+ parseInt(i+1)"
                                        :maxLength="localStorage.Patterns == 'true' ? (editedItem.platform == 'Steam' ? 17 : editedItem.platform == 'Origin' ? 24 : editedItem.platform == 'Uplay' ? 19 : 40) : 40"
                                        :rules="[rules.max25chars,localStorage.Patterns == 'true' ? (editedItem.platform == 'Steam' ? rules.Steamkey : editedItem.platform == 'Origin' ? rules.Originkey : editedItem.platform == 'Uplay' ? rules.Uplaykey : rules.required):rules.required]"
                                        color="red" @input="GetKeyFormat(editedItem,index.key)" required>
                                    </v-text-field>
                                </v-flex>
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
                            </v-layout>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat _click="close" @click="editdialog = !editdialog">Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" :disabled="!form" :loading="isAdding" flat
                        @click="save(editedItem,oldediteditem);isAdding = true">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="addialog" width="70vw" persistent scrollable loading @keydown.esc="addialog = !addialog;itemtoadd={
                    appid: '',
                    name: '',
                    platform: '',
                    keys: [{
                        key: ''
                    }],
                    tags : []
                }" @keydown.enter="form ? add(itemtoadd) : null ;isAdding = true">
            <v-card>
                <v-progress-linear :active="isAdding" class="ma-0" color="blue lighten-3" height="4" indeterminate>
                </v-progress-linear>
                <v-card-title>
                    <span class="headline">Add app</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-form v-model="form">
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-select required :rules="[v => !!v || 'Platform is required']"
                                        :items='platforms.map(e => e.name)' v-model="itemtoadd.platform"
                                        @change="PlatformEdited(itemtoadd.platform);itemtoadd.name='';itemtoadd.tags=[];itemtoadd.appid=''"
                                        :readonly="$route.path.includes('/keys') ? false : true" label="Platform"
                                        :prepend-icon="itemtoadd.platform=='Steam'||itemtoadd.platform=='Origin' ? 'mdi-'+itemtoadd.platform.toLowerCase() : itemtoadd.platform=='Uplay' ? 'mdi-ubisoft' :'mdi-key'">
                                    </v-select>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <v-text-field v-show="itemtoadd.platform!='Other'"
                                        :rules="[v => !!v || 'This field is required']"
                                        :disabled="itemtoadd.platform=='Origin' || itemtoadd.platform=='Other'"
                                        v-model="itemtoadd.appid" label="ID" @input="IDEdited(itemtoadd)" required>
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs8 sm8 md8>
                                    <v-combobox :items='this.appnames' v-model="itemtoadd.name"
                                        @change="NameEdited(itemtoadd)" label="Name" required>
                                    </v-combobox>
                                </v-flex>
                                <v-chip disabled class="mx-auto" text-color="white" color="green">
                                    <v-icon>mdi-key</v-icon>
                                    <div class="pa-2 ma-2">Keys</div>
                                </v-chip>
                                <v-flex xs12 sm12 md12>
                                    <span v-for="(index,i) in itemtoadd.keys.length" :key="i">
                                        <v-text-field :append-outer-icon="i != 0 ? 'mdi-close' : ''"
                                            @click:append-outer="deletekeyjson(itemtoadd,i)"
                                            :maxLength="localStorage.Patterns == 'true' ? (itemtoadd.platform == 'Steam' ? 17 : itemtoadd.platform == 'Origin' ? 24 : itemtoadd.platform == 'Uplay' ? 19 : 40) : 40"
                                            :placeholder="itemtoadd.platform == 'Steam' ? 'XXXXX-XXXXX-XXXXX' : itemtoadd.platform == 'Origin' ? 'XXXX-XXXX-XXXX-XXXX-XXXX' : 'XXXX-XXXX-XXXX-XXXX-XXXX'"
                                            v-model="itemtoadd.keys[i].key" :label="'Key '+parseInt(i+1)"
                                            :rules="[rules.max25chars,localStorage.Patterns == 'true' ? (itemtoadd.platform == 'Steam' ? rules.Steamkey : itemtoadd.platform == 'Origin' ? rules.Originkey : itemtoadd.platform == 'Uplay' ? rules.Uplaykey : rules.required):rules.required]"
                                            color="red" required @input="GetKeyFormat(itemtoadd,itemtoadd.keys[i].key)">
                                        </v-text-field>
                                    </span>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-btn round @click="itemtoadd.keys.push({key:''})">add key</v-btn>
                                </v-flex>
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
                            </v-layout>
                        </v-form>
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
                    <v-btn color="blue darken-1" flat :disabled="!form" :loading="isAdding"
                        @click="add(itemtoadd);isAdding = true">Add</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="infodialog" persistent width="70vw" @keydown.esc="this.infoapp= {Developer: 'Undefined',Publisher: 'Undefined',
                    Genre: '',
                    Price: '0'
                };infodialog = false" @keydown.enter="this.infoapp= {Developer: 'Undefined',Publisher: 'Undefined',Genre: '',Price: '0'
                };infodialog = false">
            <v-card class="white--text">
                <v-img
                    :src="infoapp.platform == 'Steam' ? 'https://steamcdn-a.akamaihd.net/steam/apps/' + infoapp.appid + '/header.jpg' : infoapp.platform == 'Uplay' ? 'https://transform.dis.commercecloud.salesforce.com/transform/ABBS_PRD/on/demandware.static/-/Sites-masterCatalog/default/images/large/'+infoapp.appid+'.jpg' : 'apps/undefined.gif'"
                    onerror="this.src='apps/undefined.gif'" transition="fade-transition" lazy-src="apps/undefined.gif"
                    height="410px">
                    <div style='background: rgb(0,0,0);background: radial-gradient(circle, rgba(0,0,0,0) 0%, 
                                                           rgba(255,255,255,0) 0%, rgba(0,0,0,1) 100%);'>
                        <v-layout row>
                            <v-hover>
                                <v-img slot-scope="{ hover }" :src="infoapp.platform == 'Steam' ? 'https://steamcdn-a.akamaihd.net/steam/apps/' + infoapp.appid + '/header.jpg' : 
                                        infoapp.platform == 'Uplay' ? 
                                        'https://transform.dis.commercecloud.salesforce.com/transform/ABBS_PRD/on/demandware.static/-/Sites-masterCatalog/default/images/large/'
                                        +infoapp.appid+'.jpg' : 'apps/undefined.gif'"
                                    onerror="this.src='apps/undefined.gif'" transition="fade-transition"
                                    lazy-src="apps/undefined.gif" height="350px" contain>
                                    <v-expand-transition>
                                        <div v-if="hover"
                                            :class="infoapp.platform == 'Origin' ? 'orange darken-2' : 'blue darken-2'"
                                            class="d-flex unselectable transition-fast-in-fast-out v-card--reveal display-3 white--text"
                                            style="height: 100%;width:100%">
                                            {{gethover(infoapp)}}
                                        </div>
                                    </v-expand-transition>
                                </v-img>
                            </v-hover>
                            <v-flex xs7 lg4>
                                <v-card-title primary-title>
                                    <div height="50px" style="font-weight: bold;font-size: 120%;">
                                        <div style="font-size: 180%;" align="center">{{infoapp.name}}</div>
                                        <div class="pa-2 ma-2 unselectable" align="center">
                                            <v-icon large v-if="infoapp.platform=='Steam'" color='#1d2f54'>mdi-steam
                                            </v-icon>
                                            <v-icon large v-else-if="infoapp.platform=='Uplay'" color='#0e82cf'>
                                                mdi-ubisoft
                                            </v-icon>
                                            <v-icon large v-else-if="infoapp.platform=='Origin'" color='orange'>
                                                mdi-origin
                                            </v-icon>
                                            <v-icon large v-else-if="infoapp.platform=='Other'" color='success'>
                                                mdi-key
                                            </v-icon> <span style="font-size: 160%;"
                                                :style="infoapp.platform=='Origin' ? 'color:orange' :infoapp.platform=='Other' ?'color:green':infoapp.platform=='Steam' ? 'color:#1d2f54':'color:#0e82cf'">{{infoapp.platform}}</span>
                                        </div>
                                        <div v-if="infoapp.platform=='Steam'">
                                            <span>Developer : {{moreinfo.Developer}} </span><br>
                                            <div>Publisher : {{moreinfo.Publisher}} </div>
                                            <div>
                                                Price : {{moreinfo.Price}} $
                                            </div>
                                            <div>Genre : {{moreinfo.Genre}}</div>
                                        </div>
                                        <h3 v-else align="center">Info not Available</h3>
                                    </div>
                                </v-card-title>
                            </v-flex>
                        </v-layout>
                        <v-divider light></v-divider>
                        <v-card-actions class="pa-3">
                            <v-btn :color="infoapp.platform == 'Origin' ? 'warning' : 'info'"
                                @click="open(infoapp.platform,infoapp.appid,infoapp.name)"
                                :disabled="infoapp.platform == 'Other'"> More </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn color="success" round @click="this.infoapp= {Developer: 'Undefined',Publisher: 'Undefined',
                                Genre: '',Price: '0'};infodialog=!infodialog">
                                Ok
                            </v-btn>
                        </v-card-actions>
                    </div>
                </v-img>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deletedialog" max-width="300px" persistent @keydown.esc="deletedialog = false"
            @keydown.enter="deleteItem(Itemtodelete)">
            <v-card>
                <v-card-title class="headline red--text">Delete this App?</v-card-title>
                <v-card-text>
                    You'll lose all Keys of this app!
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
                <v-card-title class="headline red--text">Delete this Key?</v-card-title>
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
        <v-dialog v-model="importdialog" width="70vw" scrollable persistent>
            <v-card>
                <v-card-title class="headline">Import Keys</v-card-title>
                <v-card-text>
                    <h3 class="orange--text unselectable" style="text-align:center">Orange Apps will be added To
                        "Other" Category</h3>
                    <v-expansion-panel>
                        <v-expansion-panel-content v-for="(item,index) in importedapps" :key="index">
                            <template v-slot:actions>
                                <v-icon color="primary">mdi-arrow-down-thick</v-icon>
                            </template>
                            <template v-slot:header>
                                <v-layout fill-height align-center justify-center ma-0>
                                    <v-chip class='unselectable white--text'
                                        :color="item.appid == '' || item.name == '' ? 'orange' : 'blue'" dark>
                                        {{index+1}}</v-chip>
                                    <v-text-field label="Appid" v-model="item.appid" @input="IDEdited(item)">
                                    </v-text-field>
                                    <v-combobox :items='appnames' v-model="item.name" @change="NameEdited(item)"
                                        label="Name">
                                    </v-combobox>
                                    <v-chip outline class='unselectable' :color="getColor(item.keys.length)" dark>
                                        <v-icon left>mdi-key</v-icon>
                                        {{item.keys.length}}
                                    </v-chip>
                                </v-layout>
                            </template>
                            <v-card>
                                <v-card-text>
                                    <v-text-field label="Keys" readonly
                                        :value="item.keys.map(el => el.key).join('  ||  ')">
                                    </v-text-field>
                                </v-card-text>
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" flat="flat" @click="hideimportdialog()">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" flat="flat" @click="addimportedkeys(false)">
                        Added Blue Ones
                    </v-btn>
                    <v-btn color="green darken-1" flat="flat" @click="addimportedkeys(true)">
                        Added All
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="Exportdialog" min-width="50vw" max-width="900px" @keydown.esc="Exportdialog = false">
            <v-card>
                <v-card-title><span class="title font-weight-light orange--text unselectable"
                        style="text-align:center">Export Your Apps As :</span>
                    <v-spacer></v-spacer>
                    <v-icon color="error" @click="Exportdialog = false">mdi-close</v-icon>
                </v-card-title>
                <v-container class="pa-4 text-center">
                    <v-layout fill-height align-center justify-center ma-0>
                        <v-hover v-slot:default="{ hover }" style="margin:20px">
                            <v-card min-width="266px" :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }"
                                color='#e5cb35' dark @click="ExportApps(apps,'txt')" width="40%">
                                <v-card-title>
                                    <v-icon large left>
                                        mdi-note-text
                                    </v-icon>
                                    <span class="title font-weight-light">Text</span>
                                </v-card-title>
                                <v-card-text class="headline font-weight-bold">
                                    Export As Text File
                                </v-card-text>
                            </v-card>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }" style="margin:20px">
                            <v-card min-width="266px" :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }"
                                color='green' dark @click="ExportApps(apps,'xslx')" width="40%">
                                <v-card-title>
                                    <v-icon large left>
                                        mdi-file-excel-box
                                    </v-icon>
                                    <span class="title font-weight-light">Excel</span>
                                </v-card-title>
                                <v-card-text class="headline font-weight-bold">
                                    Export As Excel File
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-layout>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog v-model="waitingdialog" hide-overlay persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Please stand by
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-speed-dial v-model="fab" absolute bottom right fixed direction="left" transition="slide-y-transition"
            open-on-hover>
            <template v-slot:activator>
                <v-btn v-model="fab" dark fab>
                    <v-icon style="top : -11px">add</v-icon>
                    <v-icon style="top : -11px">close</v-icon>
                </v-btn>
            </template>
            <v-tooltip top>
                <v-btn slot="activator" fab dark small color="indigo"
                    @click="addialog = true; if (!$route.path.includes('/keys')) {itemtoadd.platform=subStr($route.path);PlatformEdited(itemtoadd.platform)}">
                    <v-icon>
                        add
                    </v-icon>
                </v-btn>
                <span class="top">Add Key</span>
            </v-tooltip>
            <v-tooltip top>
                <v-btn slot="activator" fab dark small color="green" @click="Exportdialog=true">
                    <v-icon>
                        mdi-export
                    </v-icon>
                </v-btn>
                <span class="top">Export Apps</span>
            </v-tooltip>
            <v-tooltip top>
                <v-btn slot="activator" v-if="!$route.path.includes('/keys') && !$route.path.includes('/other') " fab
                    dark small color="orange"
                    @click='impport(this.window.location.hash.slice(2).charAt(0).toUpperCase()+this.window.location.hash.slice(3))'>
                    <v-icon>
                        mdi-import
                    </v-icon>
                </v-btn>
                <span class="top">Import Apps</span>
            </v-tooltip>
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
            isAdding(val) {
                if (val) {
                    setTimeout(() => (this.isAdding = false), 500)
                }
            }
        },
        computed: {
            hasSaved: {
                get: function () {
                    return store.state.msg.value;
                },
                set: function (newValue) {
                    store.state.msg.value = newValue;
                }
            },
            msg: {
                get: function () {
                    return store.state.msg;
                },
                set: function (newValue) {
                    store.state.msg.text = newValue.text;
                    store.state.msg.color = newValue.color;
                }
            },
            infodialog: {
                get: function () {
                    return store.state.infodialog;
                },
                set: function (newValue) {
                    store.state.infodialog = newValue;
                }
            },
            moreinfo(value) {
                return store.state.moreinfo;
            },
            apps() {
                switch (window.location.hash.slice(1)) {
                    case '/steam':
                        return store.state.steamkey
                        break;
                    case '/uplay':
                        return store.state.uplaykey
                        break;
                    case '/origin':
                        return store.state.originkey
                        break;
                    case '/other':
                        return store.state.otherskey
                        break;
                    default:
                        return store.state.steamkey.concat(store.state.uplaykey.concat(store.state
                            .originkey
                            .concat(store.state.otherskey)))
                        break;
                }
            },
            waitingdialog() {
                return store.state.waitingdialog
            },
            importedapps() {
                return store.state.importedapps
            },
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
                Keytochange: null,
                isAdding: false,
                expand: false,
                update: true,
                update2: true,
                direction: 'top',
                fab: false,
                pagination: {
                    totalItems: '',
                    rowsPerPage: 9
                },
                rules: {
                    max25chars: v => v.length <= 25 || 'Key is too long!',
                    required: value => !!value || 'Required.',
                    Steamkey: value => {
                        const pattern = /([\dA-Z]{5}\-){2}[\dA-Z]{5}/gi
                        return pattern.test(value) || 'Invalid Key.'
                    },
                    Uplaykey: value => {
                        const pattern = /([\dA-Z]{4}\-){3}[\dA-Z]{4}/gi;
                        return pattern.test(value) || 'Invalid Key.'
                    },
                    Originkey: value => {
                        const pattern = /([\dA-Z]{4}\-){4}[\dA-Z]{4}/gi
                        return pattern.test(value) || 'Invalid Key.'
                    }
                },
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
                form: false,
                Exportdialog: false,
                search: '',
                appnames: [],
                Itemtodelete: null,
                keytodelete: null,
                deletedialog: false,
                deletekeydialog: false,
                editdialog: false,
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
                        sortable: false,
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
                infoapp: {
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
            gethover(app) {
                if (app.platform == 'Steam')
                    return this.moreinfo.Price + '$'
                else
                    return app.platform
            },
            deletekeyjson(item, index) {
                item.keys.splice(index, 1);
            },
            GetKeyFormat(item, key) {
                index = item.keys.map(e => e.key).indexOf(key);
                key = key.toUpperCase();
                item.keys[index].key = key;
                if (localStorage.Patterns == 'true') {
                    key = key.replace(/[^a-zA-Z0-9]/g, '');
                    // timeout to let the vue render
                    setTimeout(() => {
                        switch (item.platform) {
                            case 'Steam':
                                item.keys[index].key = key.match(/(.){1,5}/g).join("-");
                                break;
                            case 'Origin':
                                item.keys[index].key = key.match(/(.){1,4}/g).join("-");
                                break;
                            case 'Uplay':
                                item.keys[index].key = key.match(/(.){1,4}/g).join("-");
                                break;
                            default:
                                item.keys[index].key = key
                        }
                    }, 0.5)
                } else
                    item.keys[index].key = key
            },
            addimportedkeys(close) {
                for (var i = this.importedapps.length - 1; i >= 0; i--) {
                    if (this.importedapps[i].name != '' && this.importedapps[i].appid != '') {
                        this.importedapps[i].appid = getappid(this.importedapps[i]);
                        for (var j = 0; j < this.importedapps[i].keys.length; j++) {
                            addkey(gettab(this.importedapps[i].platform), getappid(store.state
                                .importedapps[i]), this.importedapps[i].keys[j].key);
                        }
                        var index = pushplatform.map(el => el.appid).indexOf(this.importedapps[i].appid);
                        index != -1 ? pushplatform[index].keys = pushplatform[index].keys.concat(this.importedapps[
                            i].keys) : pushplatform.push(this.importedapps[i]);
                        this.importedapps.splice(i, 1);
                    } else {
                        if (close) {
                            this.importedapps[i].platform = "Other";
                            this.add(this.importedapps[i]);
                            this.importedapps.splice(i, 1);
                        }
                    }
                }
                if (close || this.importedapps.length == 0) {
                    store.state.importedapps = [];
                    store.state.import = false;
                }
            },
            impport(Platform) {
                impport(Platform);
                this.PlatformEdited(Platform);
            },
            ExportApps(apps, type) {
                this.Exportdialog = false;
                ExportApps(apps, type);
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
                        if (index == -1) item.appid = item.name.toLowerCase().replace(/\s/gi, '-');
                        else item.appid = store.state.others[index].appid;
                        break;
                }
            },
            TradeKeyEdit(item, key, user) {
                addtradeorbeta(gettab(item.platform), getappid(item), key, {
                    trade: {
                        value: true,
                        user: user
                    }
                })
            },
            BetaKeyEdit(item, index, betadate) {
                index.beta = {
                    value: true,
                    enddate: betadate
                }
                addtradeorbeta(gettab(item.platform), getappid(item), index.key, {
                    beta: {
                        value: true,
                        enddate: betadate
                    }
                })
            },
            deletetrade(item, index) {
                deltradeorbeta(gettab(item.platform), getappid(item), index.key, "trade");
                index.trade.value = false;
                index.trade.user = '';
                index.tradevalue = false;
            },
            deletebeta(item, index) {
                deltradeorbeta(gettab(item.platform), getappid(item), index.key, "beta")
                index.beta.value = false
                index.beta.enddate = ''
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
            doNothing() {},
            open(platform, appid, appname) {
                var link;
                switch (platform) {
                    case 'Steam':
                        link = "https://store.steampowered.com/app/" + appid
                        break;
                    case 'Origin':
                        link = "https://www.origin.com/en-us/search?searchString=" + appname
                        break;
                    case 'Uplay':
                        link = "https://store.ubi.com/ie/" + appid + ".html"
                        break;
                    default:
                        link = "https://www.google.com/search?q=" + appname
                        break;
                }
                ipcRenderer.send('open-link', link);
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
                item2plat = this.getplatform(item2.platform);
                for (i = 0; i < item2.keys.length; i++) {
                    if (item2.keys[i].key !== item1.keys[i].key) {
                        this.editkey(item2, item2.keys[i].key, item1.keys[i]
                            .key)
                        item2plat[item2plat.map(e => e.appid).indexOf(item2.appid)].keys[i].key = item1.keys[i].key;
                    }
                }
                this.updatetags(item2, item1.tags);

                if (!this.Equals(item2, item1)) {
                    i = 0;
                    this.getplatform(item1.platform).map(e => e.appid).indexOf(item1.appid) != -1 ? gameexists =
                        true : gameexists = false
                    index = this.getplatform(item2.platform).map(e => e.appid).indexOf(item2.appid);
                    k = 0;
                    while (k < item1.keys.length) {
                        addkey(gettab(item1.platform), getappid(item1), item1.keys[k].key);
                        if (item1.keys[k].trade && item1.keys[k].trade.value) this.TradeKeyEdit(item1, item1.keys[k]
                            .key, item1.keys[k]
                            .trade.user)
                        if (item1.keys[k].beta && item1.keys[k].beta.value) this.BetaKeyEdit(item1, item1.keys[k],
                            item1.keys[k]
                            .beta.enddate)
                        if (gameexists) {
                            this.getplatform(item2.platform)[i].keys.push(item1.keys[k]);
                        }
                        k++;
                    }
                    delgametagskeys(gettab(item2.platform), getappid(item2));
                    this.getplatform(item2.platform).splice(index, 1);
                    var newitem = {
                        name: item1.name,
                        appid: item1.appid,
                        platform: item1.platform,
                        keys: item1.keys,
                        tags: item1.tags
                    }
                    gameexists ? this.getplatform(item1.platform)[i].keys = this.getplatform(item1.platform)[i].keys
                        .concat(item1.keys) :
                        this.getplatform(newitem.platform).push(newitem)
                    this.editedItem = {
                        appid: '',
                        name: '',
                        platform: '',
                        keys: [],
                        tags: []
                    };
                }
                this.appnames = [];
                this.oldeditedItem = null;
                this.msg.text = "App Saved successfully";
                this.hasSaved = true;
                this.editdialog = false;
            },
            add(app) {
                for (var i = 0; i < app.keys.length; i++)
                    addkey(gettab(app.platform) == 1 ? app.name : gettab(app.platform), getappid(app), app.keys[i]
                        .key);

                updatetags(gettab(app.platform), getappid(app), app.tags);
                var index = this.getplatform(app.platform).map(e => e.appid).indexOf(getappid(app));
                if (index == -1)
                    this.getplatform(app.platform).push({
                        appid: getappid(app),
                        name: app.name,
                        keys: app.keys,
                        platform: app.platform,
                        tags: app.tags
                    });
                else this.getplatform(app.platform)[index].keys = this.getplatform(app.platform)[index].keys.concat(
                    app.keys);
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
                this.appnames = [];
                this.msg.text = "App Added successfully";
                this.hasSaved = true;
                this.addialog = false;
            },
            getplatform(Platform) {
                switch (Platform) {
                    case 'Steam':
                        return store.state.steamkey;
                        break;
                    case 'Uplay':
                        return store.state.uplaykey;
                        break;
                    case 'Origin':
                        return store.state.originkey;
                        break;
                    case 'Other':
                        return store.state.otherskey;
                        break;
                };
            },
            hideimportdialog() {
                store.state.importedapps = [];
                store.state.import = false
            },
            editItem(item) {
                this.editedItem = JSON.parse(JSON.stringify(item));
                this.oldediteditem = JSON.parse(JSON.stringify(item));
                this.PlatformEdited(this.editedItem.platform);
                this.editdialog = true;
            },
            deleteItem(item) {
                const index = this.getplatform(item.platform).indexOf(item)
                delgametagskeys(gettab(item.platform), getappid(item)) & this.getplatform(item.platform).splice(
                    index, 1)
                this.deletedialog = false;
            },
            deletekey(key, item) {
                const index = this.getplatform(item.platform).indexOf(item);
                const indexi = this.getplatform(item.platform)[index].keys.map(e => e.key).indexOf(key);
                delkey(gettab(item.platform), getappid(item), key) & this.getplatform(item.platform)[
                    index].keys.splice(indexi, 1);
                if (item.keys.length == 0) {
                    this.getplatform(item.platform).splice(index, 1);
                    delgametagskeys(gettab(item.platform), getappid(item));
                }
                this.deletekeydialog = false;
            },
            subStr(string) {
                if (string.includes('/keys')) {
                    return 'all'
                } else {
                    return string.substring(1, 15).charAt(0).toUpperCase() + string.substring(1, 15)
                        .slice(
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
                this.infoapp = item;
                var promise1 = new Promise(function (resolve, reject) {
                    getinfo(item, resolve, reject);
                });
                promise1.then(
                    function (result) {
                        store.state.infodialog = true;
                    },
                    function (error) {
                        console.log(error);
                    }
                )
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
        },
    }
</script>