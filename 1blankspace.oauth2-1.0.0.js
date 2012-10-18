/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 

if (ns1blankspace === undefined) {ns1blankspace = {}}
if (ns1blankspace.oauth === undefined) {ns1blankspace.oauth = {}}

ns1blankspace.oauth.urlParams = {};

(function () {
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);

    while (e = r.exec(q))
       ns1blankspace.oauth.urlParams[d(e[1])] = d(e[2]);
})();

ns1blankspace.oauth.user;
ns1blankspace.oauth.scope;
ns1blankspace.oauth.uri;
ns1blankspace.oauth.state;
ns1blankspace.oauth.space

function interfaceMasterViewport()
{
	var aHTML = [];
	var h = -1;

	ns1blankspace.oauth.user = urlParams["client_id"];
	if (ns1blankspace.oauth.user == undefined) {ns1blankspace.oauth.user = urlParams["user"]};
	ns1blankspace.oauth.scope = urlParams["scope"];
	ns1blankspace.oauth.state = urlParams["state"];
	
	var sParam = 'method=SITE_OAUTH2_URI_SEARCH&user=' + ns1blankspace.oauth.user;
		
	$.ajax(
	{
		type: 'GET',
		url: '/ondemand/site/?' + sParam,
		dataType: 'json',
		async: false,
		success: function(oJSON) 
		{
			if (oJSON.status == 'ER')
			{
				$('#divInterfaceOAuth2Main').html('Required information (URI) is missing.<br /><br /><a target="_blank" href="http://mydsondemand.com/gettingstarted_oauth2">See OAuth2 documentation</a>.');
			}
			else
			{
				ns1blankspace.oauth.uri = oJSON.URI;
				ns1blankspace.oauth.space = oJSON.spaceName;
				interfaceOAuth2MasterViewport();
			}	
		}
	})
	
}

function interfaceOAuth2MasterViewport() 
{
	
	if (ns1blankspace.oauth.user == undefined || ns1blankspace.oauth.uri == undefined)
	{
		$('#divInterfaceOAuth2Main').html('Required information is missing.<br /><br /><a target="_blank" href="http://mydsondemand.com/gettingstarted_oauth2">See OAuth2 documentation</a>.');
	}
	else
	{
	
		$('#divInterfaceOAuth2Header').html('Request For Access By ' + ns1blankspace.oauth.space);
	
		var sParam = 'method=CORE_GET_USER_DETAILS';
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/core/?' + sParam,
			dataType: 'json',
			async: false,
			success: function(oJSON) 
			{
				if (oJSON.status == 'ER')
				{
					interfaceMasterLogonShow(
					{
						stayOnDocument: true,
						setSecurity: true,
						xhtmlElementID: 'divInterfaceOAuth2Main'
					});
				}
				else
				{
					interfaceOAuth2MasterViewportShow(oJSON);
				}	
			}
		})
	}	
}

function interfaceOAuth2MasterViewportShow(oJSON)	
{
	if (!oJSON.systemadmin)
	{
		$('#divInterfaceOAuth2Main').html('You need to be a system administrator to grant other user access.');
	}
	else
	{	
	
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<table id="tableInterfaceOAuth2" class="interfaceOAuth2">';
	
		aHTML[++h] = '<tr id="trInterfaceOAuth2Header" class="interfaceOAuth2Header">' +
						'<td id="tdInterfaceOAuth2Action" class="interfaceOAuth2Header">' +
						'<span id="spanInterfaceOAuth2Accept"></span>' +
						'<span id="spanInterfaceOAuth2Deny"></span>' +
						'</td>' +
						'</tr>' +
						'</table>';
		
		$('#divInterfaceOAuth2Main').html(aHTML.join(''));
		
		$('#spanInterfaceOAuth2Accept').button( {
				label: "Accept",
			})
			.click(function() {
				interfaceOAuth2Accept();
			})
			
			$('#spanInterfaceOAuth2Deny').button( {
				label: "Deny",
			})
			.click(function() {
				interfaceOAuth2Deny();
			})	
	}
}	

function interfaceOAuth2Accept()	
{
	var sParam = 'method=SETUP_OAUTH2';
	var sData = 'user=' + ns1blankspace.oauth.user;
	sData += '&rights=' + ns1blankspace.oauth.scope;
	sData += '&state=' + ns1blankspace.oauth.state;
	
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/setup/?' + sParam,
		data: sData,
		dataType: 'json',
		async: false,
		success: function(oJSON)
		{
			if (oJSON.status == 'OK')
			{
				window.location.href = ns1blankspace.oauth.uri + '/?code=' + oJSON.code;
			}	
		}
	})
}	
