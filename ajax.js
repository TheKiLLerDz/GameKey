var tagsapp ;
http = new XMLHttpRequest();

function tags(appid) {
    tagsapp = [];


   
  
    var http = new XMLHttpRequest();
    var url = 'https://steamspy.com/api.php?request=appdetails&appid='+appid;
    // var params = "appid="+appid;
    http.open('GET', url);
    http.send()

    http.onload = function() {
      if (http.status == 200) {
var obj = JSON.parse(http.responseText)
console.log(obj)
for (x in obj.tags) {
 tagsapp.push(x);
}
      }
    }
}


function sendData(i, callback) {

  
    http.onreadystatechange = function () {
      if (http.readyState === 4) {
        // console.log(http.response); 
        filtrer(http.responseText, i)
      }
    }
  
    http.open('GET', 'https://store.steampowered.com/search/suggest?term=p&f=games&cc=DZ&l=french&excluded_content_descriptors%5B%5D=3&excluded_content_descriptors%5B%5D=4&v=6766867', true);
    http.send('');
  
  }