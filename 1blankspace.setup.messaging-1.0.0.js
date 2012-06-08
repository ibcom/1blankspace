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
	
	$('#inputInterfaceMasterViewportControlSearch').focus();
	
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
						'<td id="interfaceMasterViewportSetupMessagingLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
		oSearch.addField('email');
		oSearch.addFilter('type', EQUAL_TO, 5);
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		oSearch.getResults(interfaceSetupMessagingHomeShow);
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
			aHTML.push('<table id="tableInterfaceSetupMessagingHomeMostLikely">');
			aHTML.push('<tr>');
			aHTML.push('<td class="interfaceMain">MOST LIKELY</td>');
			aHTML.push('</tr>');
			
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
			
			aHTML.push('<table id="tableInterfaceSetupMessagingHomeMostLikelyMore">');
			aHTML.push('<tr><td id="tdInterfaceSetupMessagingHomeMostLikelyMore">' +
						'<a href="#" id="aInterfaceSetupMessagingHomeMostLikelyMore">more...</a>' +
						'</td></tr>');
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
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
		oSearch.addField('email');
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
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
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
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsEmail" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsEmail" class="interfaceMain">' +
						'Email' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEmailValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsEmailValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsEmail" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsType" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsType" class="interfaceMain">' +
						'Tracking' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsType" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTypeValue" class="interfaceMainText">' +
						'<input type="radio" id="radioType5" name="radioType" value="5"/>IMAP' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsEmail').val(goObjectContext.username);
			$('[name="radioType"][value="' + goObjectContext.type + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioType"][value="5"]').attr('checked', true);
		}
	}	
}

function interfaceSetupMessagingNew()
{
	goObjectContext = undefinded;
	giObjectContext = -1;
	interfaceSetupMessagingViewport();
	$('#divInterfaceMainDetails').html(gsLoadingXHTML);
	$('#divInterfaceMainDetails').attr('onDemandLoading', '1');
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
		sData += '&email=' + encodeURIComponent($('#inputInterfaceMainDetailsEmail').val());
		sData += '&type=' + $('input[name="radioType"]:checked').val();
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

