/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
var gsHomeDefaultElementId = 'tdInterfaceViewportControlSetupWebsites';

$(function()
{
	//Direct entry points using #
	
	var sHash = window.location.hash;
	
	switch(sHash)
	{
	case '#home':
		interfaceMasterHomeShow();
		break;
	}
	
	//if (giUserID != -1 && giUserID != undefined)
	//{
		if (sHash != '')
		{
			var aHash = sHash.split('-');
		
			if (aHash[0] == '#viewport')
			{
				if (aHash.length > 1)
				{
					var sID = aHash[2]
					sID = aHash[1] + '-' + sID;
					eval('interface' + aHash[1] + 'MasterViewport({showHome: false});interface' + aHash[1] + 'Search("' + sID + '")');
				}
			}
		}
	//}	
	
});

function interfaceHomeViewport()
{
				
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceHomeViewport">';
	
	aHTML[++h] = '<tr>' +
						'<td style="background-position: right center;" id="interfaceMasterViewportSetupLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSetupWebsites" class="interfaceViewportControl interfaceViewportControlHome">Websites<br />&&nbsp;Webapps</td>' +
					'</tr>';
	
	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	interfaceMasterHomeViewportBind();
}

function interfaceMasterHomeViewportBind()
{
	
	$('#tdInterfaceViewportControlSetupWebsites').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(gsLoadingXHTML);
		gsHomeDefaultElementId = this.id;
		interfaceHomeSetupWebsitesShow()
	});
	
}	

function interfaceHome()
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMainHome" class="interfaceMainHome">';
		
	aHTML[++h] = '<tr id="trInterfaceMainHome1" class="interfaceMainHome">';

	aHTML[++h] = '<td id="tdInterfaceMainHomeColumn1" class="interfaceMainHome" style="width:470px;">';
	
	aHTML[++h] = '</td>';	
	
	aHTML[++h] = '<td id="tdInterfaceMainHomeColumn2" class="interfaceMainHome">';
	aHTML[++h] = '<table id="tableInterfaceMainHomeColumn2" class="interfaceMainHome">';
	aHTML[++h] = '<tr id="trInterfaceMainHomeColumn2Row2" class="interfaceMainHome">' +						
						'<td id="tdInterfaceMainHomeNotes" class="interfaceMainHome" style="font-size:0.75em;color:#404040;">' +
						'This is a simple jQueryUI app for managing your websites, webapps, structures & forms.' +
						'<br /><br />If you wish, you can grab these scripts and modify them to create your own IDE or use your existing preferred IDE.' +
						'<br /><br /><a href="https://github/ibcom/1blankspace-developer" target="_blank">github Repository</a>' +
						'<br /><br /><a href="http://mydigitalstructure.com/examples" target="_blank">More code examples</a>' +
						'<br /><br /><hr />' +
						'<br /><a href="http://mydigitalstructure.com/documentation" target="_blank">Documentation</a>' +
						'<br /><br /><a href="http://mydigitalstructure.com/endpoints" target="_blank">Endpoints</a>' +
						'<br /><br />If you\'re looking for help on a method you can do <i>mydigitalstructure.com/<br />[method name]</i> as a shortcut.' +
						'<br /><br /><hr />' +
						'<br /><a href="http://1blankspace.com" target="_blank">1blankspace.com</a> is an example jQueryUI app that covers all the endpoints.  You can use your logon to check it out.' +
							'<br /><br /><a href="http://1blankspace.com/developers" target="_blank">Developer notes</a>' +
						'</td>' +
						'</tr>';
						
	aHTML[++h] = '</table>'
	aHTML[++h] = '</td>'	
	
	aHTML[++h] = '</tr>'	
	aHTML[++h] = '</table>'
	
	return aHTML.join('');
}

function interfaceHomeShow()
{

	if (false)
	{

		sParam = 'method=NEWS_SEARCH&rf=XML&rows=5';

		$.ajax(
		{
			type: 'GET',
			url: '/directory/ondemand/object.asp?' + sParam,
			dataType: 'xml',
			success: interfaceHomeShowLatestNews
		});
	}
	
	if (gsHomeDefaultElementId != '')
	{
		$('#' + gsHomeDefaultElementId).addClass('interfaceViewportControlHighlight');
		$('#' + gsHomeDefaultElementId).click();
	}

}

function interfaceHomeOptions()
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableinterfaceHomeOptions" class="interfaceHomeOptions">';
		
	if (gbRoleBase)
	{
	
		aHTML[++h] = '<tr id="trinterfaceHomeOptions" class="interfaceHomeOptions">' +
					'<td id="tdinterfaceHomeOptionsMyStartPage" class="interfaceHomeOptions">' +
					'<a href="/index.asp?Site=475&p=asms%2Fmystartpage.asp" target="_blank">My Start Page (Classic)</a>' +
					'</td>' +
					'</tr>';
					
		//aHTML[++h] = '<tr id="trinterfaceHomeOptions" class="interfaceHomeOptions">' +
		//			'<td id="tdinterfaceHomeOptionsCalendar" class="interfaceHomeOptions">' +
		//			'Switch<span id="spaninterfaceHomeOptionsCalendar"><span>' +
		//			'</td>' +
		//			'</tr>';
				
	}
	
	aHTML[++h] = '</table>'
	
	return aHTML.join('');
		
}

function interfaceHomeOptionsBind()
{

	$('#tdinterfaceHomeOptionsCalendar').click(function(event)
	{
		interfaceActionMasterViewport({calendar: true});
	});
	
}

function interfaceHomeOptionsUpdate()
{

	if (gbRoleBase)
	{
		$('#spaninterfaceHomeOptionsNewClientEnquiries').html(gsLoadingSmallXHTML);
		
		var sParam = 'method=DASHBOARD_OPPORTUNITY_SUMMARY';
			
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/dashboard/dashboard.asp?rf=XML&' + sParam,
			dataType: 'xml',
			success: function (oXML)
						{
							var oRoot = oXML.getElementsByTagName("ondemand").item(0);
							if (oRoot.childNodes.length != 0)
							{
								var oRow = oRoot.childNodes.item(0);
								$('#spaninterfaceHomeOptionsNewOpportunities').html('(' + onDemandXMLGetData(oRow, "newcount") + ')');
							}
						}
		});
	}
	
}

function interfaceHomeSetupWebsitesShow(oResponse)
{

	if (oResponse == undefined)
	{
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?method=SETUP_SITE_SEARCH',
			dataType: 'json',
			success: interfaceHomeSetupWebsitesShow
		});
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
	
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceWebsiteHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceWebsiteHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceWebsiteHomeMostLikelyNothing">Click New to create a website/webapp</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceWebsiteHomeMostLikely">';
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceWebsiteHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.title +
										'</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceMainHomeColumn1').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceSetupWebsiteSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceHomeLogonShow()
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceHomeLogon" class="interfaceMasterLogon" style="width:600px;">';
	
	aHTML[++h] = '<tr id="trInterfaceHomeLogonNotes" class="interfaceMasterLogon" >' +
					'<td id="tdInterfaceHomeLogon" class="interfaceMasterLogon" style="width:150px;padding-right:15px;border-right-style:solid;border-width: 1px;border-color: #B8B8B8;">' +
					gsLoadingXHTML + 
					'</td>';
					
	aHTML[++h] = '<td id="tdInterfaceMasterLogonNotes" class="interfaceMasterLogon"  style="width:150px;padding-left:15px;">';
	
	aHTML[++h] = '<table id="tableInterfaceMainHomeNotes" class="interfaceMainHome">' +
						'<tr id="trInterfaceMainHomeNotes" class="interfaceMainHome">' +						
						'<td id="tdInterfaceMainHomeNotes" class="interfaceMainHome" style="color:#404040;">' +
						'<a href="http://mydigitalstructure.com/gettingstarted_first_app_ide" target="_blank"><strong>Help on building your first app<br/>using this simple development environment (IDE).</strong></a>' +
						'<br /><br /><hr />' +
						'<br />This is a simple jQueryUI app for managing your websites, webapps, structures & forms.' +
						'<br /><br />If you wish, you can grab these scripts and modify them to create your own IDE or use your preferred IDE.' +
						'<br /><br /><a href="http://mydigitalstructure.com/examples" target="_blank">More code examples</a>' +
						'<br /><br /><a href="http://mydigitalstructure.com/documentation" target="_blank">Documentation</a>' +
						'<br /><br /><a href="http://mydigitalstructure.com/gettingstarted" target="_blank">Getting started</a>' +
						'<br /><br /><a href="http://twitter.com/ibComMYDS" target="_blank">twitter.com/ibComMYDS</a>' +
						'<br /><br /><a href="http://mydigitalstructure.com/terms" target="_blank">By logging on you agree to the  mydigitalstructure terms of use</a>' +
						'</td>' +
						'</tr>' +
					'</table>';
					
	aHTML[++h] = '</td></tr></table>';				
	
	$('#divInterfaceBox').css("z-index", "1");
	$('#divInterfaceBox').css("width", "600px");
	$('#divInterfaceBox').html(aHTML.join(''));
	
	interfaceMasterLogonShow({xhtmlElementID: 'tdInterfaceHomeLogon'})
}
