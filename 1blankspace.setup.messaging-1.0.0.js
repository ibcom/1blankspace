function interfaceSetupMessagingMasterViewport()
{
	gsObjectName = 'Messaging';
	giObjectContext = -1;
	giObject = -1;
	goObjectContext = undefined;
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Messaging"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceSetupMessagingSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceSetupMessagingSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupMessagingSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceSetupMessagingNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceSetupMessagingNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceSetupMessagingSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceSetupMessagingSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceSetupMessagingSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupMessagingSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceSetupMessagingHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupMessagingHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupMessagingSearch(event.target.id, giSearchSource_BROWSE);
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupMessagingSearch(event.target.id, giSearchSource_BROWSE);
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	
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
						gsLoadingXHTML + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportMessagingEmailLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
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
			interfaceSetupMessagingSearch('tdInterfaceViewportMasterControlBrowse-', {source: giSearchSource_BROWSE});
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
		iSource = giSearchSource_TEXT_INPUT;
	}	
		
	if (sSearchContext != undefined && iSource != giSearchSource_BROWSE)
	{
		$('#divInterfaceViewportControl').html(gsLoadingXHTML);
		
		giObjectContext = sSearchContext;
	
		/*
		var sParam = 'method=SETUP_MESSAGING_ACCOUNT_SEARCH';
		sParam += '&type=5';
		sParam += '&id=' + giObjectContext;
		
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
		oSearch.addFilter('id', 'EQUAL_TO', giObjectContext);
		oSearch.getResults(function(data) {interfaceSetupMessagingShow(data)});
	
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
			
			var sParam = 'method=SETUP_MESSAGING_ACCOUNT_SEARCH';
			sParam += '&type=5';
			sParam += '&email=' + sSearchText;
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceSetupMessagingSearchShow(aParam, data)}
			});
			
			/*
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
			oSearch.addField('email');
			
			if (iSource == giSearchSource_BROWSE)
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
	

	if (giObjectContext == -1)
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
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceSetupMessagingSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupMessagingDetails();
	});	
}

function interfaceSetupMessagingShow(oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceSetupMessagingViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find then message account.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
		
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
				
		var sContext = goObjectContext.email;
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
	
	if (goObjectContext == undefined)
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
						goObjectContext.email +
						'</td></tr>';
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryEmail" class="interfaceMainSummary">Server</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryServer" class="interfaceMainSummaryValue">' +
						goObjectContext.server +
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
			interfaceMasterMainViewportShow("#divInterfaceMainDisable");
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
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsUser').val(goObjectContext.usertext);
			$('#inputInterfaceMainDetailsUser').attr('data-id', goObjectContext.user);
			$('#inputInterfaceMainDetailsEmail').val(goObjectContext.email);
			$('[name="radioType"][value="' + goObjectContext.type + '"]').attr('checked', true);
			$('#inputInterfaceMainDetailsAccountName').val(goObjectContext.accountname);
			$('#inputInterfaceMainDetailsServer').val(goObjectContext.server);
		}
		else
		{
			$('[name="radioType"][value="5"]').attr('checked', true);
		}
	}	
}

function interfaceSetupMessagingNew()
{
	goObjectContext = undefined;
	giObjectContext = -1;
	interfaceSetupMessagingViewport();
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	interfaceSetupMessagingDetails();	
}

function interfaceSetupMessagingSave()
{
	var sParam = 'method=SETUP_MESSAGING_ACCOUNT_MANAGE';
	var sData = '_=1';
	
	if (giObjectContext != -1)
	{
		sParam += '&id=' + giObjectContext	
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
				interfaceMasterStatus('Saved');
				interfaceSetupMessagingMasterViewport();
		}
	});		
}

