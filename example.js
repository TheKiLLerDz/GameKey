'use strict';
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
   word = linestr.split(' ')
   if (validateKey(word[0])) {
       console.log('key : ' + word[0])
       word = word.filter((el) => {
        return el !== word[0];})
       console.log('tagname : ' + word)
   }else {
       index = word["length"] - 1
       console.log('key : ' + word[index])
    word = word.filter((el) => {
        return el !== word[index];})
    console.log('tagname : ' + word)

   }
   console.log(word)
    lineNumber++;
}

console.log('end of line reached');
}

function validateKey(key) {
    // Pour vérifier j'ai utilisé pattern email

    // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return re.test(String(email).toLowerCase());
}