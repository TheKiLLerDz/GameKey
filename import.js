'use strict';


var keys;
var game;


function PatternKeySteam(string) {
  const keypattern = /([\dA-Z]{5}\-){2}[\dA-Z]{5}/gi;
  return string.match(keypattern);
}



function impport() {
  const lineByLine = require('./readlines.js');
  const liner = new lineByLine('./text.txt');
  var linestr;
  var index;
  var word;
  let line;
  let lineNumber = 0;

  while (line = liner.next()) {
    linestr = line.toString('ascii');
    keys = PatternKeySteam(linestr);
    var obj = {
      game: '',
      keys: []
    }
    game = linestr;
    for (var i = 0; i < keys.length; i++) {
      game = game.replace(keys[i], '');
      obj.keys.push({
        key: keys[i]
      })
    }
    obj.game = game;
    console.log(obj);
   //addkey = getappid(store.state.steamkey,game)
   //addkey == 0?'game not found':addkey(2,addkey,key)
    lineNumber++;
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

function getappid(platform,name) {

 var index = platform.map(el => el.name).indexOf(name)
 return index == -1?false:platform[index].appid
}

