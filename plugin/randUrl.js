/*
	* Random Valid Url Generator.
	* Written by Pavel Kryukov.
	* 
	* Copyright 2011 Pavel Kryukov.
*/

var chars = "0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* 
	* Get XML Document from mentioned url
	* Universal for MSIE and other browser
*/
function getXMLDocument( url)
{
	var xml;
	if (window.XMLHttpRequest)
	{
		xml = new XMLHttpRequest(); 
		xml.open( "GET", url, false);
		xml.send( "");
	}
	else
	{
		xml = new ActiveXObject( "Microsoft.XMLHTTP"); 
		xml.open( "GET", url, false);
		xml.send();
	}		
	return xml.responseXML;
}	

/*
	* Checks url for 404, 403 and other errors.
*/
function checkUrl( url)
{
	// Coming soon
	return url;
}

/*
	* Returns random bit.ly hash.
	* Typical length is 6 symbols, but 5 and 4 symbols are also possible.
	* If it is 6, symbol cannot be greater than "r".
*/
function hashBitLy() 
{
	var firstChars = 35;
	var hash = '';	
	var string_length = 6 - ( ( Math.random() < ( 1 / chars.length)) ? 1 : 0) - ( (Math.random() < ( 1 / chars.length)) ? 1 : 0);
	var rnum = 0;
	if ( string_length == 6)
	{
		rnum = Math.floor( Math.random() * firstChars);
		hash += chars.substring( rnum, rnum + 1);	
		for ( var i = 1; i < string_length; i++) 
		{
			rnum = Math.floor( Math.random() * chars.length);
			hash += chars.substring( rnum, rnum + 1);
		}
	}		
	else
	{
		for ( var i = 0; i < string_length; i++) 
		{
			rnum = Math.floor( Math.random() * chars.length);
			hash += chars.substring(rnum,rnum + 1);
		}
	}
	return hash;
}

/*
	* Makes request to api.bit.ly using mentioned hash.
	* If hash is valid hashlink for bit.ly, returns url.
	* If error occured, returns "error.html".
	* If hash isn't valid, returns null.
*/	
function urlBitLy( hash)
{
	var output = "";
	var url = 'http://api.bit.ly/v3/expand?format=xml&login=YOUR_LOGIN&apiKey=R_942b1765419c3c11c8c07d9bd99a8a98&hash=' + hash;
	try
	{
		xml = getXMLDocument( url);
		if( !xml) 
			return "error.html?error=noxml";
	}
	catch( e)
	{
		return "error.html?error=noxml";
	}
	
	var response = xml.getElementsByTagName( "response")[0];
	if ( response)
	{
		var status_code = response.getElementsByTagName("status_code")[0].childNodes[0].nodeValue;
		if ( status_code == 200)
		{
			var data = response.getElementsByTagName( "data")[0];
			var error = data.getElementsByTagName( "error")[0];
			if ( !error)
			{
				var long_url = data.getElementsByTagName( "long_url")[0].childNodes[0].nodeValue;
				return long_url;
			}
			else
			{
				return null;
			}
		}
		else
		{
			return "error.html?error=invalidrequest";
		}
	}
	else
	{
		return "error.html?error=invalidxml";
	}
}
	
/*
	* This function returns random valid url or error.html if there's an error.
	* If "check" is true, url cannot return 404, 403 or other error.
*/
function getRandomUrl( check)
{
	var url = null;
	var tries = 0;
	while ( url == null)
	{ 
		var hash = hashBitLy();
		var url = urlBitLy( hash);
		if ( check)
		{
			url = checkUrl( url);
		}
		broadcast( tries);
		tries++;
	}
	return url;
}

/*
	* Absctract function for GUI
*/
function broadcast( value)
{
	return null;
}