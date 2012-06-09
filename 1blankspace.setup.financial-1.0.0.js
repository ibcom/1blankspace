function interfaceSetupFinancialMasterViewport()
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
        giKeyPressTimeoutId = setTimeout("interfaceSetupFinancialSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceSetupFinancialSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupFinancialSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceSetupFinancialNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceSetupFinancialNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceSetupFinancialSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceSetupFinancialSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceSetupFinancialSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupFinancialSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceSetupFinancialHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupFinancialHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupFinancialSearch(event.target.id, giSearchSource_BROWSE);
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupFinancialSearch(event.target.id, giSearchSource_BROWSE);
	});
	
	$('#inputInterfaceMasterViewportControlSearch').focus();
	
	interfaceSetupFinancialHomeShow();
	
}

function interfaceSetupFinancialHomeShow(oResponse)
{
	var aHTML = [];
	var h = -1;
				
	aHTML[++h] = '<table>';
	aHTML[++h] = '<tr>' +
					'<td id="interfaceMasterViewportSetupFinancialLarge" class="interfaceMasterViewportImageLarge">' +
					'&nbsp;' + 
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';		
		
	aHTML[++h] = '<table>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlSummary" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl">Summary/td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlBankAccount" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlBankAccount" class="interfaceViewportControl">Bank Accounts</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlFinancialAccount" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlFinancialAccount" class="interfaceViewportControl">Financial Accounts</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlInvoicing" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlInvoicing class="interfaceViewportControl">Invoicing</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlTax" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlTax" class="interfaceViewportControl">Tax</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlPayroll" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlPayroll" class="interfaceViewportControl">Payroll</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlOther" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlOther" class="interfaceViewportControl">Other</td>' +
				'</tr>';	
				
	aHTML[++h] = '</table>';		

	$('#divInterfaceViewportControl').html(aHTML.join(''));	
}

function interfaceSetupFinancialSearch(sXHTMLElementId, iSource, sSearchText, sSearchContext)
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
		oSearch.getResults(function(data) {interfaceSetupFinancialShow(data)});
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
			
			oSearch.getResults(interfaceSetupFinancialSearchShow);
		}
	};	
}

function interfaceSetupFinancialSearchShow(oResponse)
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
			interfaceSetupFinancialSearch(event.target.id, 1);
		});
	}			
}

function interfaceSetupFinancialViewport()
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
		interfaceSetupFinancialSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupFinancialDetails();
	});	
}

function interfaceSetupFinancialShow(oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceSetupFinancialViewport();
	
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
		
		interfaceSetupFinancialSummary();
	}	
}		
		
function interfaceSetupFinancialSummary()
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
			interfaceSetupFinancialDisable();
		});
	}	
}

function interfaceSetupFinancialDetails()
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

function interfaceSetupFinancialNew()
{
	goObjectContext = undefinded;
	giObjectContext = -1;
	interfaceSetupFinancialViewport();
	$('#divInterfaceMainDetails').html(gsLoadingXHTML);
	$('#divInterfaceMainDetails').attr('onDemandLoading', '1');
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	interfaceSetupFinancialDetails();	
}

function interfaceSetupFinancialSave()
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

