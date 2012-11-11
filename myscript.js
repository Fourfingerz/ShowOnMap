
//var keywords = ["india","google"];

function display(){
	alert('dd');
}


/*
 * This is the function that actually highlights a text string by
 * adding HTML tags before and after all occurrences of the search
 * term. You can pass your own tags if you'd like, or if the
 * highlightStartTag or highlightEndTag parameters are omitted or
 * are empty strings then the default <font> tags will be used.
 */

function doHighlight(bodyText, searchTerm, index,highlightStartTag, highlightEndTag) 
{

  // the highlightStartTag and highlightEndTag parameters are optional
  if ((!highlightStartTag) || (!highlightEndTag)) {
	highlightStartTag = "<b style='color:blue; background-color:yellow;'  onmouseover=\""+"rePositionMap(event"+","+unique_latArray[index]+","+unique_lngArray[index]+");"+"\" onmouseout=\""+"hidemap();"+"\" "	+"   >";
	//alert(highlightStartTag);
	
	document.getElementById('map_canvas').innerHTML="<img src='http://maps.googleapis.com/maps/api/staticmap?center="+unique_latArray[index]+","+unique_lngArray[index]+"&zoom=5&size=249x249&maptype=roadmap\
&markers=size:mid%7Ccolor:red%7C"+unique_latArray[index]+","+unique_lngArray[index]+"&sensor=false'/>";

	//alert(highlightStartTag);
    highlightEndTag = "</b>";
  }
  
  // find all occurences of the search term in the given text,
  // and add some "highlight" tags to them (we're not using a
  // regular expression search, because we want to filter out
  // matches that occur within HTML tags and script blocks, so
  // we have to do a little extra validation)
  var newText = "";
  var i = -1;
  var lcSearchTerm = searchTerm.toLowerCase();
  var lcBodyText = bodyText.toLowerCase();
    
  while (bodyText.length > 0) {
    i = lcBodyText.indexOf(lcSearchTerm, i+1);
    if (i < 0) {
      newText += bodyText;
      bodyText = "";
    } else {
      // skip anything inside an HTML tag
      if (bodyText.lastIndexOf(">", i) >= bodyText.lastIndexOf("<", i)) {
        // skip anything inside a <script> block
        if (lcBodyText.lastIndexOf("/script>", i) >= lcBodyText.lastIndexOf("<script", i)) {
          newText += bodyText.substring(0, i) + highlightStartTag + bodyText.substr(i, searchTerm.length) + highlightEndTag;
          bodyText = bodyText.substr(i + searchTerm.length);
          lcBodyText = bodyText.toLowerCase();
          i = -1;
        }
      }
    }
  }
  
  return newText;
}


/*
 * This is sort of a wrapper function to the doHighlight function.
 * It takes the searchText that you pass, optionally splits it into
 * separate words, and transforms the text on the current web page.
 * Only the "searchText" parameter is required; all other parameters
 * are optional and can be omitted.
 */

function highlightSearchTerms(searchText,index, treatAsPhrase, warnOnFailure, highlightStartTag, highlightEndTag)
{

  // if the treatAsPhrase parameter is true, then we should search for 
  // the entire phrase that was entered; otherwise, we will split the
  // search string so that each word is searched for and highlighted
  // individually
  
  treatAsPhrase=true;
  if (treatAsPhrase) {
    searchArray = [searchText];
  } else {
    searchArray = searchText.split(" ");
  }
  
  if (!document.body || typeof(document.body.innerHTML) == "undefined") {
    if (warnOnFailure) {
      alert("Sorry, for some reason the text of this page is unavailable. Searching will not work.");
    }
    return false;
  }
  

  var bodyText = document.body.innerHTML;
  for (var i = 0; i < searchArray.length; i++) {
    bodyText = doHighlight(bodyText, searchArray[i], index,highlightStartTag, highlightEndTag);
  }
  
  document.body.innerHTML = bodyText;
  return true;
}


  function xmlhttpPost(strURL,url) {
		
		var xmlHttpReq = false;
		var self = this;
		// Mozilla/Safari
		if (window.XMLHttpRequest) {
			self.xmlHttpReq = new XMLHttpRequest();
		}
		// IE
		else if (window.ActiveXObject) {
			self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
		}
		self.xmlHttpReq.open('POST', strURL, true);
		self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		self.xmlHttpReq.onreadystatechange = function() {
			if (self.xmlHttpReq.readyState == 4) {
//				alert(self.xmlHttpReq.responseText);
				//document.getElementById('textdiv').innerHTML=self.xmlHttpReq.responseText;
				processReceivedData(self.xmlHttpReq.responseText);
			}
		}
		self.xmlHttpReq.send("url="+url);
		
	}
	
		var latArray=new Array();
	var lngArray=new Array();
	var unique_latArray=new Array();
	var unique_lngArray=new Array();
	var unique_location=new Array();
	
		function removeDupes(arr) {
			var nonDupes = new Array();
			arr.forEach(function(value) {
				if (nonDupes.indexOf(value) == -1) {
					nonDupes.push(value);
					unique_latArray.push(latArray[arr.indexOf(value)]);
					unique_lngArray.push(lngArray[arr.indexOf(value)]);
				}
			});
			return nonDupes;
		}
		

function processReceivedData(str){
	//alert("received Data = "+str);
	var response=new Array();
	response=eval(str);
	
	var index=0;
	var location=new Array();
	
	
	if(typeof response!="undefined"){
		for(index in response[0]){
			location[index]=response[0][index];
		}
		//alert(location);
		index=0;
		for(index in response[1]){
			latArray[index]=response[1][index][0];
			lngArray[index]=response[1][index][1];
		}
		
		
	if(index>=1){
	//alert(index);
	unique_location = removeDupes(location);
	//alert(unique_location.length);


		var k=0;
		for(k=0;k<unique_location.length;k++){
			//alert(unique_location[k]);
			highlightSearchTerms(unique_location[k],k);
		}
	}	
	}
	
}


function stripScripts(markup) {
  return markup.replace(/<script[^>]*?>[\s\S]*?<\/script>/gi, '');
}


function a(){

	var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'http://newsonmap.in/chrome_extension/map.js';
    document.head.appendChild(s);
	

	
	var newdiv = document.createElement('div');
	newdiv.setAttribute('id', 'map_canvas');
	newdiv.style.width='1px';
	newdiv.style.height='1px';
	newdiv.style.visibility="hidden";
	newdiv.style.bgColor='#000000';	
	document.body.appendChild(newdiv);
	
	
	var url=window.location.href;
	xmlhttpPost("http://www.newsonmap.in/chrome_extension/getLocationKeywords.php",url);
	

	var textdiv = document.createElement('div');
	textdiv.setAttribute('id', 'textdiv');
	document.body.appendChild(textdiv);

	
//alert('after');
//document.body.innerHTML=document.body.innerHTML;
}

a();
