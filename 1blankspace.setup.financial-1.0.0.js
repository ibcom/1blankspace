function interfaceSetupFinancialMasterViewport()
{
	gsObjectName = 'Financials';
	giObjectContext = -1;
	giObject = -1;
	goObjectContext = undefined;
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Financials"
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
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlOther" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlOther" class="interfaceViewportControl">General</td>' +
				'</tr>';	
				
	aHTML[++h] = '<tr id="trInterfaceViewportControlBankAccount" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlBankAccount" class="interfaceViewportControl">Bank Accounts</td>' +
				'</tr>';	
	
	aHTML[++h] = '</table>';		
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlFinancialAccount" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlFinancialAccount" class="interfaceViewportControl">Financial Accounts</td>' +
				'</tr>';
				
	aHTML[++h] = '<tr id="trInterfaceViewportControlFinancialAccountDefault" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlFinancialAccountDefault" class="interfaceViewportControl">Defaults</td>' +
				'</tr>';	
	
	aHTML[++h] = '</table>';		
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlInvoicing" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlInvoicing class="interfaceViewportControl">Invoicing</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlTax" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlTax" class="interfaceViewportControl">Tax</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlPayroll" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlPayroll" class="interfaceViewportControl">Payroll</td>' +
				'</tr>';	
	
	aHTML[++h] = '</table>';		

	$('#divInterfaceViewportControl').html(aHTML.join(''));	
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainGeneral" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainBankAccount" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainFinancialAccount" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainFinancialAccountDefault" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainInvoicing" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainTax" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainPayroll" class="divInterfaceViewportMain"></div>';

	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceContactBusinessSummary();
	});
	
	$('#tdInterfaceViewportControlGeneral').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainGeneral");
		interfaceContactBusinessGeneral();
	});
	
	$('#tdInterfaceViewportControlBankAccount').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainBankAccount");
		interfaceContactBusinessBankAccount();
	});
	
	$('#tdInterfaceViewportControlFinancialAccount').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainFinancialAccount");
		interfaceContactBusinessFinancialAccount();
	});
	
	$('#tdInterfaceViewportControlFinancialAccountDefault').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainFinancialAccountDefault");
		interfaceContactBusinessFinancialAccountDefault();
	});
	
	$('#tdInterfaceViewportControlInvoicing').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainInvoicing");
		interfaceContactBusinessInvoicing();
	});
	
	$('#tdInterfaceViewportControlTax').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainTax");
		interfaceContactBusinessTax();
	});
	
	$('#tdInterfaceViewportControlPayroll').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainPayroll");
		interfaceContactBusinessPayroll();
	});
}

function interfaceSetupFinancialSearch(sXHTMLElementId, iSource, sSearchText, sSearchContext)
{
	alert('Not applicable');
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
				
		$('#divInterfaceMainSummary').html(aHTML.join(''));
	}
	else
	{	
		
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
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

function interfacesSetupFinancialBankAccount(aParam, oResponse)
{

	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_FINANCIAL_BANK_ACCOUNT_SEARCH';
		oSearch.addField('title,notes');
		oSearch.sort('title', 'asc');
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceFinancialBankAccount(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialHomeMostLikelyNothing">No bank accounts set up.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{		
			aHTML[++h] = '<table id="tableContactBusinessGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Title</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Last Reconciled Amount</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Last Reconciled</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			var oRows = oResponse.data.rows;
			
			$(oRows).each(function() 
			{
				aHTML[++h] = interfaceFinancialBankAccountRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		interfaceMasterPaginationList(
		   {
			type: 'JSON',
			xhtmlElementID: 'divInterfaceMainBankAccount',
			xhtmlContext: 'BankAccount',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: 100,
			functionShowRow: interfaceFinancialBankAccountRow,
			functionOpen: undefined,
			functionNewPage: ''
		   });
	}
}

function interfaceSetupFinancialBankAccountRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Title-" class="interfaceMainRow"' +
							' title="' + oRow.notes + '">' +
							oRow.title + '</td>';
	
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Balance-" class="interfaceMainRow" style="text-align:right;">' +
							oRow.lastreconciledamount + '</td>';
	
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Date-" class="interfaceMainRow" style="text-align:right;">' +
							oRow.lastreconcileddate + '</td>';
													
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
}

function interfaceSetupFinancialFinancialAccountDefault()
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
	
		aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountCash" class="interfaceMain">' +
						'<td id="tdInterfaceMainFinancialAccountCash" class="interfaceMain">' +
						'Cash' +
						'</td></tr>' +
						'<tr id="trInterfaceMainFinancialAccountCashValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainFinancialAccountCashValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainFinancialAccountCash" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountCreditors" class="interfaceMain">' +
						'<td id="tdInterfaceMainFinancialAccountCreditors" class="interfaceMain">' +
						'Creditors' +
						'</td></tr>' +
						'<tr id="trInterfaceMainFinancialAccountCreditorsValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainFinancialAccountCreditorsValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainFinancialAccountCreditors" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountDebitors" class="interfaceMain">' +
						'<td id="tdInterfaceMainFinancialAccountDebitors" class="interfaceMain">' +
						'Creditors' +
						'</td></tr>' +
						'<tr id="trInterfaceMainFinancialAccountDebitorsValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainFinancialAccountDebitorsValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainFinancialAccountDebitors" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountCurrentProfit" class="interfaceMain">' +
						'<td id="tdInterfaceMainFinancialAccountCurrentProfit" class="interfaceMain">' +
						'Current Profit' +
						'</td></tr>' +
						'<tr id="trInterfaceMainFinancialAccountCurrentProfitValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainFinancialAccountCurrentProfitValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainFinancialAccountCurrentProfit" class="inputInterfaceMainText">' +
						'</td></tr>';	
						
		aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
						'<td id="tdInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
						'Retained Profit' +
						'</td></tr>' +
						'<tr id="trInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainFinancialAccountRetainedProfit" class="inputInterfaceMainText">' +
						'</td></tr>';														
			
		aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
						'<td id="tdInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
						'Retained Profit' +
						'</td></tr>' +
						'<tr id="trInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainFinancialAccountRetainedProfit" class="inputInterfaceMainText">' +
						'</td></tr>';	
										
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));

		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainFinancialAccountCash').val(goObjectContext.financialaccountcashtext);
			$('#inputInterfaceMainFinancialAccountCash').attr("data-id", goObjectContext.financialaccountcash);
			$('#inputInterfaceMainFinancialAccountCreditors').val(goObjectContext.financialaccountcreditortext);
			$('#inputInterfaceMainFinancialAccountCreditors').attr("data-id", goObjectContext.financialaccountcreditor);
			$('#inputInterfaceMainFinancialAccountDebitors').val(goObjectContext.financialaccountdebitortext);
			$('#inputInterfaceMainFinancialAccountDebitors').attr("data-id", goObjectContext.financialaccountdebitor);
			$('#inputInterfaceMainFinancialAccountCurrentProfit').val(goObjectContext.financialaccountcurrentearningstext);
			$('#inputInterfaceMainFinancialAccountCurrentProfit').attr("data-id", goObjectContext.financialaccountcurrentearnings);
			$('#inputInterfaceMainFinancialAccountRetainedProfit').val(goObjectContext.financialaccountretainedearningstext);
			$('#inputInterfaceMainFinancialAccountRetainedProfit').attr("data-id", goObjectContext.financialaccountretainedearnings);
		}
		else
		{
		}
	}	
}

function interfaceSetupFinancialSave()
{
	var sParam = 'method=SETUP_MESSAGING_ACCOUNT_MANAGE';
	var sData = '_=1';
	
	if (giObjectContext != -1)
	{
		sParam += '&id=' + giObjectContext	
	}	
	
	if ($('#divInterfaceMainFinancialAccount').html() != '')
	{
		sData += '&financialaccountcash=' + encodeURIComponent($('#inputInterfaceMainFinancialAccountCash').attr('data-id'));
		sData += '&financialaccountcreditor=' + encodeURIComponent($('#inputInterfaceMainFinancialAccountCreditors').attr('data-id'));
		sData += '&financialaccountdebitor=' + encodeURIComponent($('#inputInterfaceMainFinancialAccountDebitors').attr('data-id'));
		sData += '&financialaccountcurrentearnings=' + encodeURIComponent($('#inputInterfaceMainFinancialAccountCurrentProfit').attr('data-id'));
		sData += '&financialaccountretainedearnings=' + encodeURIComponent($('#inputInterfaceMainFinancialAccountRetainedProfit').attr('data-id'));	
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

