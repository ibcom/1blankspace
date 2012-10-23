function interfaceSetupUserMasterViewport()
{
	gsObjectName = 'Users';
	giObjectContext = -1;
	giObject = 40;
	goObjectContext = undefined;
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Users"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceSetupUserSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceSetupUserSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupUserSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceSetupUserNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceSetupUserNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceSetupUserSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceSetupUserSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceSetupUserSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupUserSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceSetupUserHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupUserHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupUserSearch(event.target.id, giSearchSource_BROWSE);
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupUserSearch(event.target.id, giSearchSource_BROWSE);
	});
	
	$('#inputInterfaceMasterViewportControlSearch').focus();
	
	interfaceSetupUserHomeShow();
	
}

function interfaceSetupUserHomeShow(oResponse)
{
	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceSetupUserHomeMostLikely" class="interfaceViewportMain">' +
						gsLoadingXHTML + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportSetupUserLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_USER_SEARCH';
		
		oSearch.addField('username');
		oSearch.async = false;
		oSearch.rf = 'json';
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		
		oSearch.getResults(interfaceSetupUserHomeShow);
		
	}
	else
	{
		var aHTML = [];
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML.push('<table id="tableInterfaceMessagingConversationHomeMostLikely">');
			aHTML.push('<tr class="trInterfaceMessagingConversationHomeMostLikelyNothing">');
			aHTML.push('<td class="tdInterfaceMessagingConversationHomeMostLikelyNothing">Click New to create a user.</td>');
			aHTML.push('</tr>');
			aHTML.push('</table>');
		}
		else
		{
		
			aHTML.push('<table id="tableInterfaceSetupUserHomeMostLikely">');
			aHTML.push('<tr>');
			aHTML.push('<td class="interfaceMain">MOST LIKELY</td>');
			aHTML.push('</tr>');
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML.push('<tr class="interfaceMainRow">');
				aHTML.push('<td id="interfaceSetupUserHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										oResponse.username +
										'</td>');
				aHTML.push('</tr>');
			});
			
			aHTML.push('</tbody></table>');
			
			aHTML.push('<table id="tableInterfaceSetupUserHomeMostLikelyMore">');
			aHTML.push('<tr><td id="tdInterfaceSetupUserHomeMostLikelyMore">' +
						'<a href="#" id="aInterfaceSetupUserHomeMostLikelyMore">more...</a>' +
						'</td></tr>');
			aHTML.push('</tbody></table>');
		}
		
		$('#tdInterfaceSetupUserHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceSetupUserSearch(event.target.id, {source: 1});
		});
		
		$('#aInterfaceSetupUserHomeMostLikelyMore').click(function(event)
		{
			interfaceSetupUserSearch('tdInterfaceViewportMasterControlBrowse-', {source: giSearchSource_BROWSE});
		});
	}
}

function interfaceSetupUserSearch(sXHTMLElementId, iSource, sSearchText, sSearchContext)
{
	
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
		
	if (iSource == undefined)
	{
		iSource = giSearchSource_TEXT_INPUT;
	}	
		
	if (sSearchContext != undefined && iSource != giSearchSource_BROWSE)
	{
	
		$('#divInterfaceViewportControl').html(gsLoadingXHTML);
		
		giObjectContext = sSearchContext;
		var sParam = 'method=SETUP_USER_SEARCH&advanced=1&id=' + giSetupContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?' + sParam,
			dataType: 'json',
			success: interfaceSetupUserShow
		});
	}
	else
	{
		var iMinimumLength = 3;
		var iMaximumColumns = 1;
		
		if (sSearchText == undefined)
		{
			sSearchText = $('#inputInterfaceMasterViewportControlSearch').val();
		}	
		
		if (iSource == giSearchSource_BROWSE)
		{
			iMinimumLength = 1;
			iMaximumColumns = 4;
			sSearchText = aSearch[1];
			if (sSearchText == '#') {sSearchText = '[0-9]'}
			sElementId = 'tableInterfaceViewportMasterBrowse';
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == giSearchSource_BROWSE)
		{	
			interfaceMasterOptionsSetPosition(sElementId);
			interfaceMasterSearchStart(sElementId);
			
			var sParam = 'method=SETUP_USER_SEARCH&quicksearch=' + sSearchText;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?' + sParam,
				dataType: 'json',
				success: interfaceSetupUserSearchShow
			});
			
		}
	};	
}

function interfaceSetupUserSearchShow(oResponse)
{
	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	if (oResponse.data.rows.length == 0)
	{
		interfaceMasterSearchStop();
		$('#divInterfaceMasterViewportControlOptions').hide();
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

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceSetupUserSearch(event.target.id, 1);
		});
	}			
}

function interfaceSetupUserViewport()
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
			
	aHTML[++h] = '</table>';					
				
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
			
	$('#divInterfaceMain').html(aHTML.join(''));
		
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceSetupUserSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupUserDetails();
	});	
}

function interfaceSetupUserShow(oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceSetupUserViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find User.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
				
		var sContext = goObjectContext.username;
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
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		interfaceSetupUserSummary();
	}	
}		
		
function interfaceSetupUserSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find user.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		var sTmpClass = ''
		
		if (goObjectContext.disabled == 'Y')
		{
			sTmpClass = ' interfaceMainDisabled';
		}
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySiteID" class="interfaceMainSummary">User</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarySiteID" class="interfaceMainSummaryValue' + sTmpClass + '">' +
						goObjectContext.username +
						'</td></tr>';
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryLastLogon" class="interfaceMainSummary">Name</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryLastLogon" class="interfaceMainSummaryValue">' +
						goObjectContext.contactpersontext +
						'</td></tr>';
		
		if (goObjectContext.lastlogondatetime != '&nbsp;')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryLastLogon" class="interfaceMainSummary">Last Logon</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryLastLogon" class="interfaceMainSummaryValue">' +
						goObjectContext.lastlogondatetime +
						'</td></tr>';
		}
		
		if (goObjectContext.browsertext != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryLastBrowser" class="interfaceMainSummary">Last Accessed Using Browser</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryLastBrowser" class="interfaceMainSummaryValue">' +
						goObjectContext.browsertext +
						'</td></tr>';
		}				
				
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2">';
		
		if (1==0 && goObjectContext.disabled == 'N')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTask1" class="interfaceMainSummary">' +
						'<a href="#" id="aInterfaceMainSummaryDisable">Disable Access</a>' +
						'</td></tr>';
		}				
										
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));
		
		$('#aInterfaceMainSummaryDisable').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMainDisable");
			interfaceSetupUserDisable();
		});
	}	
}

function interfaceSetupUserDetails()
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
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsUsername" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsUsername" class="interfaceMain">' +
						'User Name / Logon Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsUserNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsUserNameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsUserName" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDisabledText" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDisabledText" class="interfaceMain">' +
						'Disabled Reason' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDisabledTextValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDisabledTextValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsDisabledText" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		//$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsUserName').val(goObjectContext.username);
		}
	}	
}

function interfaceSetupUserSave()
{
	var sParam = 'method=SETUP_USER_MANAGE';
	var sData = '_=1';
	
	if (giObjectContext != -1)
	{
		sParam += '&id=' + giObjectContext	
	}	
	
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&username=' + encodeURIComponent($('#inputInterfaceMainDetailsUserName').val());
	};

	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/setup/?' + sParam,
		data: sData,
		dataType: 'text',
		success: interfaceMasterStatus('Saved')
	});		
}

