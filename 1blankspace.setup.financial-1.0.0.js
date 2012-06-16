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
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	
	var aHTML = [];
	var h = -1;
				
	aHTML[++h] = '<table>';
	aHTML[++h] = '<tr>' +
					'<td id="interfaceMasterViewportFinancialLarge" class="interfaceMasterViewportImageLarge">' +
					'&nbsp;' + 
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';		
		
	aHTML[++h] = '<table>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlSummary" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlGeneral" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlGeneral" class="interfaceViewportControl">General</td>' +
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
				'<td id="tdInterfaceViewportControlInvoicing" class="interfaceViewportControl">Invoicing</td>' +
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
		interfaceSetupFinancialSummary();
	});
	
	$('#tdInterfaceViewportControlGeneral').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainGeneral");
		interfaceSetupFinancialGeneral();
	});
	
	$('#tdInterfaceViewportControlBankAccount').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainBankAccount");
		interfaceSetupFinancialBankAccount();
	});
	
	$('#tdInterfaceViewportControlFinancialAccount').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainFinancialAccount");
		interfaceSetupFinancialFinancialAccount();
	});
	
	$('#tdInterfaceViewportControlFinancialAccountDefault').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainFinancialAccountDefault");
		interfaceSetupFinancialFinancialAccountDefault();
	});
	
	$('#tdInterfaceViewportControlInvoicing').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainInvoicing");
		interfaceSetupFinancialInvoicing();
	});
	
	$('#tdInterfaceViewportControlTax').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainTax");
		interfaceSetupFinancialTax();
	});
	
	$('#tdInterfaceViewportControlPayroll').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainPayroll");
		interfaceSetupFinancialPayroll();
	});
	
	interfaceSetupFinancialSummary();
}

function interfaceSetupFinancialSearch(sXHTMLElementId, iSource, sSearchText, sSearchContext)
{
	alert('Not applicable');
}
		
function interfaceSetupFinancialSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find settings.</td></tr>';
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
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTaxationMethod" class="interfaceMainSummary">Taxation Method</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryTaxationMethod" class="interfaceMainSummaryValue">' +
						goObjectContext.email +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));
	}	
}

function interfaceSetupFinancialGeneral()
{
	var aHTML = [];
	var h = -1;
		
	if ($('#divInterfaceMainGeneral').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainGeneral').attr('onDemandLoading', '');
		
		aHTML[++h] = '<table id="tableInterfaceMainGeneral" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainFinancialGeneralRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainGeneralColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainGeneralColumn2" class="interfaceMainColumn2x">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainGeneral').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainGeneralColumn1" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsTaxationMethod" class="interfaceMain">' +
						'<td id="tdInterfaceMainGeneralTaxationMethod" class="interfaceMain">' +
						'Taxation Method' +
						'</td></tr>' +
						'<tr id="trInterfaceMainGeneralTaxationMethod" class="interfaceMainText">' +
						'<td id="tdInterfaceMainGeneralTaxationMethodValue" class="interfaceMainText">' +
						'<input type="radio" id="radioTaxationMethod1" name="radioTaxationMethod" value="1"/>Cash' +
						'<br /><input type="radio" id="radioTaxationMethod2" name="radioTaxationMethod" value="2"/>Accrual' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainGeneralAccountingYear" class="interfaceMain">' +
						'<td id="tdInterfaceMainGeneralAccountingYear" class="interfaceMain">' +
						'Accounting Year' +
						'</td></tr>' +
						'<tr id="trInterfaceMainGeneralAccountingYearValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainGeneralAccountingYearValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainGeneralAccountingYear" class="inputInterfaceMainText">' +
						'</td></tr>';
														
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainGeneralColumn1').html(aHTML.join(''));

		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainFinancialAccountCash').val(goObjectContext.financialaccountcashtext);
			$('#inputInterfaceMainFinancialAccountCash').attr("data-id", goObjectContext.financialaccountcash);
		}
		else
		{
		}
	}	
}

function interfaceSetupFinancialBankAccount(aParam, oResponse)
{

	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
		oSearch.addField('title,notes');
		oSearch.sort('title', 'asc');
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceSetupFinancialBankAccount(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceSetupFinancialBankAccount">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialHomeMostLikelyNothing">No bank accounts set up.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{		
			
			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<table id="tableInterfaceMainBankAccount" class="interfaceMain">' +
					'<tr id="trInterfaceMainBankAccountRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainBankAccountColumn1" style="width: 200px;" class="interfaceMainColumn1">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumn2" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
			$('#divInterfaceMainBankAccount').html(aHTML.join(''));
		
			var aHTML = [];
			var h = -1;
		
		
			aHTML[++h] = '<table id="tableSetupFinancialBankAccount" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Title</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			var oRows = oResponse.data.rows;
			
			$(oRows).each(function() 
			{
				aHTML[++h] = interfaceSetupFinancialBankAccountRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		interfaceMasterPaginationList(
		   {
			type: 'JSON',
			xhtmlElementID: 'tdInterfaceMainBankAccountColumn1',
			xhtmlContext: 'BankAccount',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: 100,
			functionShowRow: interfaceSetupFinancialBankAccountRow,
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
														
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
}

function interfaceSetupFinancialFinancialAccount(aParam, oResponse)
{

	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
		oSearch.addField('title');
		oSearch.sort('title', 'asc');
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceSetupFinancialFinancialAccount(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceSetupFinancialFinancialAccount">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialHomeMostLikelyNothing">No accounts set up.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{		
			
			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<table id="tableInterfaceMainFinancialAAccount" class="interfaceMain">' +
					'<tr id="trInterfaceMainFinancialAAccountRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainFinancialAAccountColumn1" style="width: 200px;" class="interfaceMainColumn1">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainFinancialAccountColumn2" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
			$('#divInterfaceMainFinancialAccount').html(aHTML.join(''));
		
			var aHTML = [];
			var h = -1;
		
		
			aHTML[++h] = '<table id="tableSetupFinancialFinancialAAccount" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Title</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			var oRows = oResponse.data.rows;
			
			$(oRows).each(function() 
			{
				aHTML[++h] = interfaceSetupFinancialFinancialAccountRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		interfaceMasterPaginationList(
		   {
			type: 'JSON',
			xhtmlElementID: 'tdInterfaceMainFinancialAccountColumn1',
			xhtmlContext: 'BankAccount',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: 100,
			functionShowRow: interfaceSetupFinancialFinancialAccountRow,
			functionOpen: undefined,
			functionNewPage: ''
		   });
	}
}

function interfaceSetupFinancialFinancialAccountRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Title-" class="interfaceMainRow"' +
							' title="' + oRow.notes + '">' +
							oRow.title + '</td>';
														
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
}

function interfaceSetupFinancialFinancialAccountDefault()
{
	var aHTML = [];
	var h = -1;
		
	if ($('#divInterfaceMainFinancialAccountDefault').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainFinancialAccountDefault').attr('onDemandLoading', '');
		
		aHTML[++h] = '<table id="tableInterfaceMainFinancialAccount" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainFinancialAccountColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainFinancialAccountColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainFinancialAccountDefault').html(aHTML.join(''));
		
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
						'Debitors' +
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
										
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainFinancialAccountColumn1').html(aHTML.join(''));

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

function interfaceSetupFinancialTax()
{
	var aHTML = [];
	var h = -1;
		
	if ($('#divInterfaceMainTax').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainTax').attr('onDemandLoading', '');
		
		aHTML[++h] = '<table id="tableInterfaceMainTax" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainFinancialTaxRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainTaxColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainTaxColumn2" class="interfaceMainColumn2x">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainTax').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainTaxColumn1" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainTaxLock" class="interfaceMain">' +
						'<td id="tdInterfaceMainTaxLock" class="interfaceMain">' +
						'Lock transactions if in completed tax period.' +
						'</td></tr>' +
						'<tr id="trInterfaceMainGeneralTaxLock" class="interfaceMainText">' +
						'<td id="tdInterfaceMainGeneralTaxLockValue" class="interfaceMainText">' +
						'<input type="radio" id="radioTaxLockY" name="radioTaxLock" value="Y"/>Yes' +
						'<br /><input type="radio" id="radioTaxLockN" name="radioTaxLock" value="N"/>No' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainTaxDefault" class="interfaceMain">' +
						'<td id="tdInterfaceMainTaxDefault" class="interfaceMain">' +
						'Includes tax default' +
						'</td></tr>' +
						'<tr id="trInterfaceMainGeneralTaxDefault" class="interfaceMainText">' +
						'<td id="tdInterfaceMainGeneralTaxDefaultValue" class="interfaceMainText">' +
						'<input type="radio" id="radioTaxDefaultY" name="radioTaxDefault" value="Y"/>Yes' +
						'<br /><input type="radio" id="radioTaxDefaultN" name="radioTaxDefault" value="N"/>No' +
						'</td></tr>';
														
														
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainTaxColumn1').html(aHTML.join(''));

		if (goObjectContext != undefined)
		{
			$('[name="radioLock"][value="' + goObjectContext.taxlock + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioLock"][value="Y"]').attr('checked', true);			
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

