'use strict';


var keys;
var game;

function PatternKeySteam(string) {
  const keypattern = /([\dA-Z]{5}\-){2}[\dA-Z]{5}/gi;
  return string.match(keypattern);
}

function PatternKeyOrigin(string) {
  const keypattern = /([\dA-Z]{4}\-){4}[\dA-Z]{4}/gi;
  return string.match(keypattern);
}

function PatternKeyUplay(string) {
  const keypattern1 = /([\dA-Z]{4}\-){3}[\dA-Z]{4}/gi;
  const keypattern2 = /[\dA-Z]{3}\-([\dA-Z]{4}\-){3}[\dA-Z]{4}/gi;
  var format1 = string.match(keypattern1);
  if (format1.length == 0) {
    return string.match(keypattern2);
  } else return format1
}

function impport() {
  const {
    dialog
  } = require('electron').remote
  var path = dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{
        name: 'Supported Files',
        extensions: ['txt', 'xlsx', 'xls']
      },
      {
        name: 'Text Files',
        extensions: ['txt']
      },
      {
        name: 'Excel Files',
        extensions: ['xls', 'xlsx']
      },
      {
        name: 'All Files',
        extensions: ['*']
      }
    ]
  })
  console.log(path)
  if (path !== undefined) {
    const lineByLine = require('./readlines.js');
    const liner = new lineByLine(path[0]);
    var linestr;
    var index;
    var word;
    let line;
    let lineNumber = 0;

    while (line = liner.next()) {
      linestr = line.toString('ascii');
      keys = PatternKeySteam(linestr);
      var obj = {
        name: '',
        keys: []
      }
      game = linestr;
      if (keys !== null)
        for (var i = 0; i < keys.length; i++) {
          game = game.replace(keys[i], '');
          obj.keys.push({
            key: keys[i]
          })
        }
      obj.name = game.replace(/(\r\n|\n|\r)/gm, '').trim();
      console.log(obj);
      var index = getindex(store.state.steam, obj.name)
      var uiindex = getindex(store.state.steamkey, obj.name)
      if (index == -1) console.log('game not found');
      else {
        var item = store.state.steam[index]
        console.log(item)
        for (var i = 0; i < keys.length; i++) {
          addkey(2, store.state.steam[index].appid, keys[i])
          if (store.state.steam[index].keys == undefined) {
            store.state.steam[index].keys = [{
              key: keys[i]
            }];
          } else {
            item.keys.push({
              key: keys[i]
            });
          }
        }
        // problem here is if u delete a key of game then import it back it get's again, cz of store.state.steam variable
        // when we delete a key our algorithme only deletes it from store.state.steamkey
        uiindex == -1 ? store.state.steamkey.push(store.state.steam[index]) : console.log("game already exists")
      }
      lineNumber++;
    }
  }
  // baseorxhr()
}

function validateKey(key) {
  // Pour vérifier j'ai utilisé pattern email

  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(key).toLowerCase());
}



function filtrer(tag, i) {
  var el = document.createElement('div');
  el.innerHTML = tag
  var l = el.getElementsByTagName('a').item(0)
  var appid = l.attributes[1].value
  addtokeys(appid, i)


}

function baseorxhr() {
  var i = 0;
  while (i < tagname.length) {
    var j = 0;
    var test = true
    while (j < store.state.steam.length & test) {
      if (tagname[i] == store.state.steam[j].name) {
        addtokeys(store.state.steam[j].appid, i)
        test = false;
      }
      j++
    }
    if (test) {
      sendData(i)
    }

    i++

  }

  addtodb();
}


function addtokeys(appid, i) {
  keys.push({
    'key': key[i],
    'appid': appid
  })


}

function addtodb() {
  console.log(keys)

}

function getindex(platform, name) {
  return platform.map(el => el.name).indexOf(name)
}