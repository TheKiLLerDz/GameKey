'use strict';

var keys;
var gamename;
var platform;
var pushplatform;

function PatternKeySteam(string) {
  var result = []
  const virtualkeypattern = /([\dA-Z]{5}\-){2}[\dA-Z]{5}/gi;
  const physicalkeypattern = /([\dA-Z]{5}\-){4}[\dA-Z]{5}/gi;
  result = result.concat(string.match(virtualkeypattern), string.match(physicalkeypattern)).filter(Boolean);
  if (result.length == 0) return null;
  else return result
}

function PatternKeyOrigin(string) {
  var result = []
  const keypattern1 = /MB-([\dA-Z]{16})/gi;
  const keypattern2 = /([\dA-Z]{4}\-){4}[\dA-Z]{4}/gi;
  result = result.concat(string.match(keypattern1), string.match(keypattern2)).filter(Boolean);
  if (result.length == 0) return null;
  else return result
}

function PatternKeyUplay(string) {
  var result = []
  const keypattern1 = /([\dA-Z]{4}\-){3}[\dA-Z]{4}/gi;
  const keypattern2 = /[\dA-Z]{3}\-([\dA-Z]{4}\-){3}[\dA-Z]{4}/gi;
  result = result.concat(string.match(keypattern1), string.match(keypattern2)).filter(Boolean);
  if (result.length == 0) return null;
  else return result
}

function impport(Platform) {
  ipcRenderer.send('Path-request', Platform);
}

ipcRenderer.on('Path-reply', (event, Paths, Platform) => {
  if (Paths != undefined) {
    var indicSlash = Paths[0].lastIndexOf('\/');
    var extension = Paths[0].substring(indicSlash + 1).split(".");
    console.log(extension)
    extension[1] == 'txt' ? importtxt(Platform, Paths[0]) : extension[1] == 'xlsx' ? importxls(Platform, Paths[0]) : console.log("Format Not Supported")
    // baseorxhr()
  }
})


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
  return platform.map(el => el.name.toLowerCase().replace(/\s/gi, '')).indexOf(name.toLowerCase().replace(/\s/gi, ''))
}

function importtxt(Platform, path) {
  var linestr;
  var index;
  var word;
  let line;
  let lineNumber = 1;
  const lineByLine = require('./readlines.js');
  const liner = new lineByLine(path);
  while (line = liner.next()) {
    linestr = line.toString('ascii');
    filters(Platform, linestr, lineNumber);
    lineNumber++;
  }


}

function filters(Platform, linestr, lineNumber) {
  store.state.waitingdialog = true
  setTimeout(() => {
    store.state.import = true;
    store.state.waitingdialog = false;
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
      line: lineNumber,
      name: '',
      keys: []
    }
    gamename = linestr;
    if (keys !== null) {
      for (var i = 0; i < keys.length; i++) {
        gamename = gamename.replace(keys[i], '');
        obj.keys.push({
          key: keys[i]
        })
      }
      obj.name = gamename.replace(/(\r\n|\n|\r)/gm, '').trim();
      var index = getindex(platform, obj.name)
      if (index != -1) {
        obj.name = platform[index].name;
        obj.appid = platform[index].appid;
        obj.platform = Platform;
        store.state.importedapps.push(obj);
      } else {
        obj.appid = '';
        obj.platform = Platform;
        store.state.importedapps.push(obj);
      }
    }
  }, 2000);
  lineNumber++;
}

function importxls(Platform, path) {
  const readXlsxFile = require('read-excel-file/node');
  readXlsxFile(path).then((rows) => {
    rows.forEach(el => {
      filters(Platform, el.join(' '))
    })
  })

}


// Readable Stream.



function exportxlxs(platform) {
  const {
    dialog
  } = require('electron').remote
  var path = dialog.showSaveDialog({
    properties: ['saveFile'],
    title: "Choose Export Path",
    filters: [{
      name: 'Excel File',
      extensions: ['xlsx']
    }]
  })
  if (path != undefined) {
    var json2xls = require('json2xls');
    var fs = require('fs')
    var appskey = []
    platform.forEach(app => {
      app.keys.forEach(key => {
        var obj = {
          name: app.name,
          key: key.key
        }
        appskey.push(obj)
      })
    })

    fs.writeFileSync(path, json2xls(appskey, {}), 'binary');
    return true
  } else return false
}

function copyimg(url, to_url) {
  const fs = require('fs');
  fs.copyFile(url, to_url, (err) => {
    if (err) throw err;
    console.log("success")
  });
}

function deleteimg(path) {
  const fs = require('fs');
  try {
    fs.unlinkSync(path)
    //img removed
  } catch (err) {
    console.error(err)
  }
}