'use strict';


var keys;
var game;

function PatternKeySteam(string) {
  const virtualkeypattern = /([\dA-Z]{5}\-){2}[\dA-Z]{5}/gi;
  const physicalkeypattern = /([\dA-Z]{5}\-){4}[\dA-Z]{5}/gi;
  var physicalkey = string.match(physicalkeypattern);
  if (physicalkey == null) return string.match(virtualkeypattern);
  else return physicalkey
}

function PatternKeyOrigin(string) {
  const keypattern = /([\dA-Z]{4}\-){4}[\dA-Z]{4}/gi;
  return string.match(keypattern);
}

function PatternKeyUplay(string) {
  const keypattern1 = /([\dA-Z]{4}\-){3}[\dA-Z]{4}/gi;
  const keypattern2 = /[\dA-Z]{3}\-([\dA-Z]{4}\-){3}[\dA-Z]{4}/gi;
  var format1 = string.match(keypattern1);
  if (format1 == null) return string.match(keypattern2);
  else return format1
}

function impport(Platform) {
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
  ////////
 var indicSlash = path[0].lastIndexOf('\/');
 var extension = path[0].substring(indicSlash+1).split(".");
console.log(extension)
  extension[1] == 'txt'?importtxt(Platform,path[0]):importxls(Platform,path[0])
  // baseorxhr()
}

function gettab(platform) {
  switch (platform) {
    case 'Steam':
      return 2
      break;
    case 'Uplay':
      return 3
      break;
    case 'Origin':
      return 0
      break;
    case 'Other':
      return 1
      break;
  }
}

function getappid(item) {
  if ((item.platform != 'Steam' || item.platform == 'Other') && (item.platform != 'Other' || item
      .platform == 'Steam')) return item.appid;
  else return parseInt(item.appid);

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

// function baseorxhr() {
//   var i = 0;
//   while (i < tagname.length) {
//     var j = 0;
//     var test = true
//     while (j < store.state.steam.length & test) {
//       if (tagname[i] == store.state.steam[j].name) {
//         addtokeys(store.state.steam[j].appid, i)
//         test = false;
//       }
//       j++
//     }
//     if (test) {
//       sendData(i)
//     }

//     i++

//   }

//   addtodb();
// }


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

function importtxt(Platform,path) {
    store.state.import = true;
    const lineByLine = require('./readlines.js');
    const liner = new lineByLine(path);
    var linestr;
    var index;
    var word;
    let line;
    let lineNumber = 0;

    while (line = liner.next()) {
      linestr = line.toString('ascii');
      var platform;
      var pushplatform;
      switch (Platform) {
        case 'Steam':
          keys = PatternKeySteam(linestr);
          platform = store.state.steam;
          pushplatform = store.state.steamkey;
          break;
        case 'Origin':
          keys = PatternKeyOrigin(linestr);
          platform = store.state.origin;
          pushplatform = store.state.originkey;
          break;
        case 'Uplay':
          keys = PatternKeyUplay(linestr);
          platform = store.state.uplay;
          pushplatform = store.state.uplaykey;
          break;
      }
      var obj = {
        name: '',
        keys: []
      }
      game = linestr;
      if (keys !== null) {
        for (var i = 0; i < keys.length; i++) {
          game = game.replace(keys[i], '');
          obj.keys.push({
            key: keys[i]
          })
        }
        obj.name = game.replace(/(\r\n|\n|\r)/gm, '').trim();
        var item;
        var index = getindex(pushplatform, obj.name)
        if (index !== -1) {
          item = pushplatform[index]
        } else {
          index = getindex(platform, obj.name)
          if (index !== -1) {
            item = JSON.parse(JSON.stringify(platform[index]));
            delete item.keys;
            item.platform = Platform;
          }
        }
        if (index == -1)
          console.log('game not found')
        else {
          for (var i = 0; i < keys.length; i++) {
            addkey(gettab(Platform), getappid(item), keys[i])
            if (item.keys == undefined) {
              item.keys = [{
                key: keys[i]
              }];
            } else {
              item.keys.push({
                key: keys[i]
              });
            }
          }
          getindex(pushplatform, obj.name) == -1 ? pushplatform.push(item) : console.log("game already exists")
        }
      } else console.log('key not found')
      lineNumber++;
    }
  }
function importxls(Platform,path) {
  const readXlsxFile = require('read-excel-file/node');
  
 
// File path.
readXlsxFile(path).then((rows) => {
  console.log(rows)
test = rows
})
 
// Readable Stream.

}

function exportxlxs(platform) {
  var json2xls = require('json2xls');
  var fs = require('fs')
  var appskey
// convert data to the table
  var xls = json2xls(platform, {});
  
  fs.writeFileSync('data.xlsx', xls, 'binary');  
}