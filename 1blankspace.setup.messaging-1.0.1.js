/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
function interfaceSetupMessagingMasterViewport()
{
	ns1blankspace.objectName = 'Messaging';
	ns1blankspace.objectContext = -1;
	ns1blankspace.object = -1;
	ns1blankspace.objectContextData = undefined;
	
	ns1blankspaceReset();		
			
	$('#divns1blankspaceViewportControlSet').button(
	{
		label: "Messaging"
	});
	
	$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceSetupMessagingSearch('inputns1blankspaceViewportControlSearch')", ns1blankspace.option.typingWait);
	});
	
	$('#spanns1blankspaceViewportControlSearch').click(function(event)
	{
		interfaceSetupMessagingSearch('inputns1blankspaceViewportControlSearch');
	});
	
	$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupMessagingSearchOptions();
	});
	
	$('#spanns1blankspaceViewportControlNew').click(function(event)
	{
		interfaceSetupMessagingNew();
	})
	
	$('#spanns1blankspaceViewportControlNewOptions').click(function(event)
	{
		interfaceSetupMessagingNewOptions();
	});
	
	$('#spanns1blankspaceViewportControlAction').click(function(event)
	{
		interfaceSetupMessagingSave();
	});
	
	$('#spanns1blankspaceViewportControlActionOptions').click(function(event)
	{
		interfaceSetupMessagingSaveOptions();
	});
	
	$('#spanns1blankspaceViewportControlSetup').click(function(event)
	{
		interfaceSetupMessagingSetup();
	});
	
	$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupMessagingSetupOptions();
	});
	
	$('#spanns1blankspaceViewportControlHelp').click(function(event)
	{
		interfaceSetupMessagingHelp();
	});
	
	$('#spanns1blankspaceViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupMessagingHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupMessagingSearch(event.target.id, ns1blankspace.data.searchSource.browse);
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupMessagingSearch(event.target.id, ns1blankspace.data.searchSource.browse);
	});
	
	if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
	
	interfaceSetupMessagingHomeShow();
	
}

function interfaceSetupMessagingHomeShow(oResponse)
{
	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceSetupMessagingHomeMostLikely" class="interfaceViewportMain">' +
						ns1blankspace.xhtml.loading + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="ns1blankspaceViewportMessagingEmailLarge" class="ns1blankspaceViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
		oSearch.addField('email');
		oSearch.addFilter('type', 'EQUAL_TO', 5);
		oSearch.rows = 50;
		oSearch.sort('email', 'asc');
		oSearch.getResults(interfaceSetupMessagingHomeShow);
	}
	else
	{
		var aHTML = [];
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML.push('<table id="tableInterfaceMessagingConversationHomeMostLikely">');
			aHTML.push('<tr class="trInterfaceMessagingConversationHomeMostLikelyNothing">');
			aHTML.push('<td class="tdInterfaceMessagingConversationHomeMostLikelyNothing">Click New to add a message account.</td>');
			aHTML.push('</tr>');
			aHTML.push('</table>');
		}
		else
		{
			aHTML.push('<table id="tableInterfaceSetupMessagingHomeMostLikely">');
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML.push('<tr class="interfaceMainRow">');
				aHTML.push('<td id="interfaceSetupMessagingHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.email +
										'</td>');
				aHTML.push('</tr>');
			});
			
			aHTML.push('</tbody></table>');
			
		}
		
		$('#tdInterfaceSetupMessagingHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceSetupMessagingSearch(event.target.id, {source: 1});
		});
		
		$('#aInterfaceSetupMessagingHomeMostLikelyMore').click(function(event)
		{
			interfaceSetupMessagingSearch('tdInterfaceViewportMasterControlBrowse-', {source: ns1blankspace.data.searchSource.browse});
		});
	}
}

function interfaceSetupMessagingSearch(sXHTMLElementId, iSource, sSearchText, sSearchContext)
{
	
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
		
	if (iSource == undefined)
	{
		iSource = ns1blankspace.data.searchSource.text;
	}	
		
	if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
	{
		$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
		
		ns1blankspace.objectContext = sSearchContext;
	
		/*
		var sParam = 'method=SETUP_MESSAGING_ACCOUNT_SEARCH';
		sParam += '&type=5';
		sParam += '&id=' + ns1blankspace.objectContext;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceSetupMessagingShow(data)}
		});
		*/
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
		oSearch.addField('email,type,typetext,authtype,authtypetext,accountname,server,sslport,title,user,usertext');
		oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
		oSearch.getResults(function(data) {interfaceSetupMessagingShow(data)});
	
	}
	else
	{
		var iMinimumLength = 3;
		var iMaximumColumns = 1;
		
		if (sSearchText == undefined)
		{
			sSearchText = $('#inputns1blankspaceViewportControlSearch').val();
		}	
		
		if (iSource == ns1blankspace.data.searchSource.browse)
		{
			iMinimumLength = 1;
			iMaximumColumns = 4;
			sSearchText = aSearch[1];
			if (sSearchText == '#') {sSearchText = '[0-9]'}
			sElementId = 'tableInterfaceViewportMasterBrowse';
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
		{	
			ns1blankspaceOptionsSetPosition(sElementId);
			ns1blankspaceSearchStart(sElementId);
			
			var sParam = 'method=SETUP_MESSAGING_ACCOUNT_SEARCH';
			sParam += '&type=5';
			sParam += '&email=' + sSearchText;
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceSetupMessagingSearchShow(oParam, data)}
			});
			
			/*
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
			oSearch.addField('email');
			
			if (iSource == ns1blankspace.data.searchSource.browse)
			{
				oSearch.addFilter('email', 'STRING_STARTS_WITH', sSearchText);
			}
			else
			{	
				oSearch.addFilter('email', 'STRING_IS_LIKE', sSearchText);
			}	
			
			oSearch.getResults(interfaceSetupMessagingSearchShow);
			*/
		}
	};	
}

function interfaceSetupMessagingSearchShow(oResponse)
{
	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	if (oResponse.data.rows.length == 0)
	{
		ns1blankspaceSearchStop();
		$('#divns1blankspaceViewportControlOptions').hide();
	}
	else
	{	
		aHTML[++h] = '<table class="interfaceSearchMedium">';
		aHTML[++h] = '<tbody>'
			
		$.each(oResponse.data.rows, function()
		{	
			iColumn = iColumn + 1;
			
			if (iColumn == 1)
			{
				aHTML[++h] = '<tr class="interfaceSearch">';
			}
			
			aHTML[++h] = '<td class="interfaceSearch" id="' +
							'-' + this.id + '">' +
							this.username + '</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		});
    	
		aHTML[++h] = '</tbody></table>';

		$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
		$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		ns1blankspaceSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
			$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
			interfaceSetupMessagingSearch(event.target.id, 1);
		});
	}			
}

function interfaceSetupMessagingViewport()
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	

	if (ns1blankspace.objectContext == -1)
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
						'</tr>';
	}
	else
	{				
		aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
						'</tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
						'</tr>';
	}

	aHTML[++h] = '</table>';					
				
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
			
	$('#divInterfaceMain').html(aHTML.join(''));
		
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
		interfaceSetupMessagingSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupMessagingDetails();
	});	
}

function interfaceSetupMessagingShow(oResponse)
{
	$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
	interfaceSetupMessagingViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		ns1blankspace.objectContextData = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find then message account.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		ns1blankspace.objectContextData = oResponse.data.rows[0];
		
		$('#spanns1blankspaceViewportControlAction').button({disabled: false});
				
		var sContext = ns1blankspace.objectContextData.email;
		var aContext = sContext.split("@");
		
		sContext = aContext[0];
		
		for (var i = 1; i < aContext.length; i++)
		{
			sContext += '<br />@' + aContext[i];
		}
			
		$('#divInterfaceViewportControlContext').html(sContext);
		
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2x">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		interfaceSetupMessagingSummary();
	}	
}		
		
function interfaceSetupMessagingSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (ns1blankspace.objectContextData == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find user.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySiteID" class="interfaceMainSummary">Email</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarySiteID" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.email +
						'</td></tr>';
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryEmail" class="interfaceMainSummary">Server</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryServer" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.server +
						'</td></tr>';				
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));
		
		$('#aInterfaceMainSummaryDisable').click(function(event)
		{
			ns1blankspaceMainViewportShow("#divInterfaceMainDisable");
			interfaceSetupMessagingDisable();
		});
	}	
}

function interfaceSetupMessagingDetails()
{
	var aHTML = [];
	var h = -1;
		
	if ($('#divInterfaceMainDetails').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainDetails').attr('onDemandLoading', '');
		
		aHTML[++h] = '<table id="tableInterfaceMainDetails" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainDetailsRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainDetailsColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainDetails').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
	

		aHTML[++h] = '<tr id="trInterfaceMainDetailsUser" class="interfaceMain">' +
						'<td id="tdInterfaceMainMainDetailsUser" class="interfaceMain">' +
						'User' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsUserValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsUserValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsUser" class="inputInterfaceMainSelect"' +
							' data-method="SETUP_USER_SEARCH"' +
							' data-columns="username">' +
						'</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceMainDetailsEmail" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsEmail" class="interfaceMain">' +
						'Email' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEmailValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsEmailValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsEmail" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsAccountName" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsAccountName" class="interfaceMain">' +
						'Account Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsAccountNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsAccountNameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsAccountName" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsAccountPassword" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsAccountPassword" class="interfaceMain">' +
						'Account Password' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsAccountPasswordValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsAccountPasswordValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsAccountPassword" class="inputInterfaceMainText" type="password">' +
						'</td></tr>';				
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsServer" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsServer" class="interfaceMain">' +
						'Server' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsServerValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsServerValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsServer" class="inputInterfaceMainText">' +
						'</td></tr>';	
										
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsType" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsType" class="interfaceMain">' +
						'Type' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsType" class="interfaceMainRadio">' +
						'<td id="tdInterfaceMainDetailsTypeValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioType5" name="radioType" value="5"/>IMAP' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
		
		if (ns1blankspace.objectContextData != undefined)
		{
			$('#inputInterfaceMainDetailsUser').val(ns1blankspace.objectContextData.usertext);
			$('#inputInterfaceMainDetailsUser').attr('data-id', ns1blankspace.objectContextData.user);
			$('#inputInterfaceMainDetailsEmail').val(ns1blankspace.objectContextData.email);
			$('[name="radioType"][value="' + ns1blankspace.objectContextData.type + '"]').attr('checked', true);
			$('#inputInterfaceMainDetailsAccountName').val(ns1blankspace.objectContextData.accountname);
			$('#inputInterfaceMainDetailsServer').val(ns1blankspace.objectContextData.server);
		}
		else
		{
			$('[name="radioType"][value="5"]').attr('checked', true);
		}
	}	
}

function interfaceSetupMessagingNew()
{
	ns1blankspace.objectContextData = undefined;
	ns1blankspace.objectContext = -1;
	interfaceSetupMessagingViewport();
	ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
	$('#spanns1blankspaceViewportControlAction').button({disabled: false});
	$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
	interfaceSetupMessagingDetails();	
}

function interfaceSetupMessagingSave()
{
	var sParam = 'method=SETUP_MESSAGING_ACCOUNT_MANAGE';
	var sData = '_=1';
	
	if (ns1blankspace.objectContext != -1)
	{
		sParam += '&id=' + ns1blankspace.objectContext	
	}	
	
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&user=' + encodeURIComponent($('#inputInterfaceMainDetailsUser').attr("data-id"));
		sData += '&email=' + encodeURIComponent($('#inputInterfaceMainDetailsEmail').val());
		sData += '&title=' + encodeURIComponent($('#inputInterfaceMainDetailsEmail').val());
		sData += '&type=' + $('input[name="radioType"]:checked').val();
		sData += '&accountname=' + encodeURIComponent($('#inputInterfaceMainDetailsAccountName').val());
		sData += '&server=' + encodeURIComponent($('#inputInterfaceMainDetailsServer').val());
		sData += '&cachetype=1';
		sData += '&sslport=993';
		sData += '&authtype=0';
		
		if ($('#inputInterfaceMainDetailsAccountPassword').val() != '')
		{
			sData += '&accountpassword=' + encodeURIComponent($('#inputInterfaceMainDetailsAccountPassword').val());
		}
	};

	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/setup/?' + sParam,
		data: sData,
		dataType: 'text',
		success: function()
		{
				ns1blankspaceStatus('Saved');
				interfaceSetupMessagingMasterViewport();
		}
	});		
}

