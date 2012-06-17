function interfaceFinancialMasterViewport(aParam)
{
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}

	giObject = -1;
	goObjectContext = undefined;
	gsObjectName = 'Financials';
	giObjectContext = -1;
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialMasterViewport({showHome: true});',
			move: false
			})		
	}	
			
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Financials"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceFinancialSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceFinancialSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceFinancialSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceFinancialNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceFinancialNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceFinancialSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceFinancialSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceFinancialSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceFinancialSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceFinancialHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceFinancialHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceFinancialSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceFinancialSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	if (bShowHome) {interfaceFinancialHomeShow()};	
}

function interfaceFinancialHomeShow()
{	
	var aHTML = [];
	var h = -1;
				
	aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
	aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
					'<td id="tdInterfaceProjectHomeMostLikely" class="interfaceViewportMain">' +
					gsLoadingXHTML + 
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';					
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
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
				'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl">Summary</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlBankAccount" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlBankAccount" class="interfaceViewportControl">Bank Accounts</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlDebtors" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlDebtors" class="interfaceViewportControl">Debtors</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlCreditors" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlCreditors" class="interfaceViewportControl">Creditors</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlPL" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlPL" class="interfaceViewportControl">Profit & Loss</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlBS" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlBS" class="interfaceViewportControl">Balance Sheet</td>' +
				'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlUnallocated" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlUnallocated" class="interfaceViewportControl">Unallocated</td>' +
				'</tr>';	
				
	aHTML[++h] = '</table>';		
	
	$('#divInterfaceViewportControl').html(aHTML.join(''));	
	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainBankAccount" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDebtors" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainCreditors" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainPL" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainBS" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainUnallocated" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceFinancialSummary();
	});
	
	$('#tdInterfaceViewportControlBankAccount').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainBankAccount");
		interfaceFinancialBankAccount();
	});	
	
	$('#tdInterfaceViewportControlDebtors').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDebtors");
		interfaceFinancialDebtors();
	});	
		
	$('#tdInterfaceViewportControlCreditors').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainCreditors");
		interfaceFinancialCreditors();
	});	
	
	$('#tdInterfaceViewportControlPL').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainPL");
		interfaceFinancialProfitLoss();
	});	
	
	$('#tdInterfaceViewportControlBS').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainBS");
		interfaceFinancialBalanceSheet();
	});	
	
	$('#tdInterfaceViewportControlUnallocated').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainUnallocated");
		interfaceFinancialUnallocated();
	});	
	
	$('#tdInterfaceViewportControlSummary').addClass('interfaceViewportControlHighlight');
	interfaceMasterMainViewportShow("#divInterfaceMainSummary");
	interfaceFinancialSummary();
}

function interfaceFinancialSummary(aParam, oResponse)
{

	if (oResponse == undefined)
	{

		var sParam = 'method=FINANCIAL_PROFIT_LOSS_SEARCH&rf=JSON&rows=1';
	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/financial/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceFinancialSummary(aParam, data)}
		});
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1Large" class="interfaceMainColumn1Large">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2Action" style="width:100px;">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';				
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));	
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		//parseFloat(oResponse.TotalSales).toFixed(2) +
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPhone" class="interfaceMainSummary">Sales</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPhoneValue" class="interfaceMainSummaryValue">' +	
						(oResponse.TotalSales).formatMoney(2, '.', ',') +
						'</td></tr>';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPhone" class="interfaceMainSummary">Cost of Sales</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPhoneValue" class="interfaceMainSummaryValue">' +
						(oResponse.TotalCostOfSales).formatMoney(2, '.', ',') +
						'</td></tr>';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPhone" class="interfaceMainSummary">Gross Margin</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPhoneValue" class="interfaceMainSummaryValue">' +
						(oResponse.GrossMargin).formatMoney(2, '.', ',') +
						'</td></tr>';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPhone" class="interfaceMainSummary">Operating Expenses</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPhoneValue" class="interfaceMainSummaryValue">' +
						(oResponse.TotalOperationalExpenses).formatMoney(2, '.', ',') +
						'</td></tr>';
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPhone" class="interfaceMainSummary">Net Margin</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPhoneValue" class="interfaceMainSummaryValue">' +
						(oResponse.NetMargin).formatMoney(2, '.', ',') +
						'</td></tr>';			
			
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''))
	
	}
}

function interfaceFinancialDebtors(aParam, oResponse)
{

	if (oResponse == undefined)
	{

		var sParam = 'method=FINANCIAL_DEBTOR_SEARCH&rf=JSON';
	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/financial/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceFinancialDebtors(aParam, data)}
		});
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialHomeMostLikelyNothing">Good news and band news, in that no debtors.  So good that no one owes you money, but bad in that no one owes you money.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			
			aHTML[++h] = '<table id="tableContactBusinessGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Debtor</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Amount Owed</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;color:#A0A0A0;">Last Receipt Date</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;color:#A0A0A0;">Last Receipt Amount</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			var oRows = oResponse.data.rows;
			
			$(oRows).each(function() 
			{
				aHTML[++h] = interfaceFinancialDebtorsRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		interfaceMasterPaginationList(
		   {
			type: 'JSON',
			xhtmlElementID: 'divInterfaceMainDebtors',
			xhtmlContext: 'Debtors',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: giReturnRows,
			functionShowRow: interfaceFinancialDebtorsRow,
			functionOpen: undefined,
			functionNewPage: ''
		   }); 	
	}
}

function interfaceFinancialDebtorsRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Contact-' + 'xx' + '" class="interfaceMainRow">' +
							oRow.debtorname + '</td>';
	
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Total-' + 'xx' + '" class="interfaceMainRow" style="text-align:right;">' +
							oRow.total + '</td>';
	
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_LastReceiptDate-' + 'xx' + '" class="interfaceMainRow" style="text-align:right;color:#A0A0A0;">' +
							oRow.lastreceiptdate + '</td>';
	
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_LastReceiptAmount-' + 'xx' + '" class="interfaceMainRow" style="text-align:right;color:#A0A0A0;">' +
							oRow.lastreceiptamount + '</td>';
	
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
	
}

function interfaceFinancialCreditors(aParam, oResponse)
{

	if (oResponse == undefined)
	{

		var sParam = 'method=FINANCIAL_CREDITOR_SEARCH&rf=JSON';
	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/financial/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceFinancialCreditors(aParam, data)}
		});
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialHomeMostLikelyNothing">You don\'t owe anyone any money.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			
			aHTML[++h] = '<table id="tableContactBusinessGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Creditor</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Amount To Be Paid</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;color:#A0A0A0;">Last Payment Date</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;color:#A0A0A0;">Last Payment Amount</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			var oRows = oResponse.data.rows;
			
			$(oRows).each(function() 
			{
				aHTML[++h] = interfaceFinancialCreditorsRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		interfaceMasterPaginationList(
		   {
			type: 'JSON',
			xhtmlElementID: 'divInterfaceMainCreditors',
			xhtmlContext: 'Creditors',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: giReturnRows,
			functionShowRow: interfaceFinancialDebtorsRow,
			functionOpen: undefined,
			functionNewPage: ''
		   }); 	
	}
}

function interfaceFinancialCreditorsRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Contact-' + 'xx' + '" class="interfaceMainRow">' +
							oRow.creditorname + '</td>';
	
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Total-' + 'xx' + '" class="interfaceMainRow" style="text-align:right;">' +
							oRow.total + '</td>';
	
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_LastReceiptDate-' + 'xx' + '" class="interfaceMainRow" style="text-align:right;color:#A0A0A0;">' +
							oRow.lastpaymentdate + '</td>';
	
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_LastReceiptAmount-' + 'xx' + '" class="interfaceMainRow" style="text-align:right;color:#A0A0A0;">' +
							oRow.lastpaymentamount + '</td>';
	
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
	
}

function interfaceFinancialProfitLoss(aParam, oResponse)
{
	if (oResponse == undefined)
	{		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_PROFIT_LOSS_SEARCH';
		oSearch.addField('financialaccounttext,total,percentage');
		oSearch.sort('financialaccounttext', 'asc');
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceFinancialProfitLoss(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialHomeMostLikelyNothing">Sorry nothing to report, add an invoice or expense and you will be able to see how your going.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			
			aHTML[++h] = '<table id="tableContactBusinessGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Account</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Amount</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;color:#A0A0A0;">Percentage</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			var oRows = oResponse.data.rows;
			
			$(oRows).each(function() 
			{
				aHTML[++h] = interfaceFinancialProfitLossRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		interfaceMasterPaginationList(
		   {
			type: 'JSON',
			xhtmlElementID: 'divInterfaceMainPL',
			xhtmlContext: 'Creditors',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: 100,
			functionShowRow: interfaceFinancialProfitLossRow,
			functionOpen: undefined,
			functionNewPage: ''
		   }); 	
	}
}

function interfaceFinancialProfitLossRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Contact-' + 'xx' + '" class="interfaceMainRow">' +
							oRow.financialaccounttext + '</td>';
	
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Total-' + 'xx' + '" class="interfaceMainRow" style="text-align:right;">' +
							oRow.total + '</td>';
	
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_LastReceiptDate-' + 'xx' + '" class="interfaceMainRow" style="text-align:right;color:#A0A0A0;">' +
							oRow.percentage + '</td>';
	
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
	
}

function interfaceFinancialBalanceSheet(aParam, oResponse)
{
	if (oResponse == undefined)
	{	
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_BALANCE_SHEET_SEARCH';
		oSearch.addField('financialaccounttext,amount,subtotalcount,type');
		oSearch.sort('financialaccounttext', 'asc');
		oSearch.rows = 100;
		oSearch.getResults(function(data) {interfaceFinancialBalanceSheet(aParam, data)});	
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialHomeMostLikelyNothing">Sorry nothing to report, add an invoice or expense and you will be able to see how your going.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialBalanceSheet" class="interfaceMain">';
			aHTML[++h] = '<tr id="trInterfaceMainFinancialBalanceSheetRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainFinancialBalanceSheetColumn1" style="width: 70px" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainFinancialBalanceSheetColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
			aHTML[++h] = '</table>';					
		
			$('#divInterfaceMainBS').html(aHTML.join(''));
		
			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
	
			aHTML[++h] = '<tr><td id="tdInterfaceMainBSAssets" class="interfaceMainSummary">Assets</td></tr>' +
							'<tr><td id="tdInterfaceMainBSAssetsValue" class="interfaceMainSummaryValue">' +	
							(oResponse.assettotal).formatMoney(2, '.', ',') +
							'</td></tr>';
		
			aHTML[++h] = '<tr><td id="tdInterfaceMainBSLiability" class="interfaceMainSummary">Liabilities</td></tr>' +
							'<tr><td id="tdInterfaceMainBSLiabilityValue" class="interfaceMainSummaryValue">' +
							(oResponse.liabilitytotal).formatMoney(2, '.', ',') +
							'</td></tr>';
		
			aHTML[++h] = '<tr><td id="tdInterfaceMainBSEquity" class="interfaceMainSummary">Equity</td></tr>' +
							'<tr><td id="tdInterfaceMainBSEquityValue" class="interfaceMainSummaryValue">' +
							(oResponse.equitytotal).formatMoney(2, '.', ',') +
							'</td></tr>';

			aHTML[++h] = '</table>';							
			
			$('#tdInterfaceMainFinancialBalanceSheetColumn1').html(aHTML.join(''));
		
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			
			aHTML[++h] = '<table id="tableContactBusinessGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Account</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Amount</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			var oRows = oResponse.data.rows;
			
			$(oRows).each(function() 
			{
				aHTML[++h] = interfaceFinancialBalanceSheetRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		interfaceMasterPaginationList(
		   {
			type: 'JSON',
			xhtmlElementID: 'tdInterfaceMainFinancialBalanceSheetColumn2',
			xhtmlContext: 'BalanceSheet',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: 100,
			functionShowRow: interfaceFinancialBalanceSheetRow,
			functionOpen: undefined,
			functionNewPage: ''
		   }); 	
	}
}

function interfaceFinancialBalanceSheetRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Contact-' + 'xx' + '" class="interfaceMainRow">' +
							oRow.financialaccounttext + '</td>';
	
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Total-' + 'xx' + '" class="interfaceMainRow" style="text-align:right;">' +
							oRow.amount + '</td>';
	
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
	
}

function interfaceFinancialBankAccount(aParam, oResponse)
{

	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
		oSearch.addField('title,lastreconciledamount,lastreconcileddate,notes');
		oSearch.sort('title', 'asc');
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceFinancialBankAccount(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainBankAccount" class="interfaceMain">' +
					'<tr id="trInterfaceMainBankAccountow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainBankAccountColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumn2" style="width: 150px;" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divInterfaceMainBankAccount').html(aHTML.join(''));
		
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
			aHTML[++h] = '<table id="tableBankAccountList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Name</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Reconciled Amount</td>';
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
			xhtmlElementID: 'tdInterfaceMainBankAccountColumn1',
			xhtmlContext: 'BankAccount',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: 100,
			functionShowRow: interfaceFinancialBankAccountRow,
			functionOpen: undefined,
			functionNewPage: ''
		   });
		
		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2" cellpadding=6>';
							
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTask2" class="interfaceMainColumn2Actionx" style="width:175px;">' +
						'<a href="#" id="aInterfaceMainBankAccountReco">Reconcile</a>' +
						'</td></tr>';
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTask2" class="interfaceMainColumn2Actionx" style="width:175px;">' +
						'<a href="#" id="aInterfaceMainBankAccountReceipt">Receipt an Invoice</a>' +
						'</td></tr>';
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTask2" class="interfaceMainColumn2Actionx" style="width:175px;">' +
						'<a href="#" id="aInterfaceMainBankAccountDeposit">Bulk Deposit</a>' +
						'</td></tr>';								
					
		aHTML[++h] = '</table>';					
				
		$('#tdInterfaceMainBankAccountColumn2').html(aHTML.join(''));
		
		$('#aInterfaceMainBankAccountReco').click(function()
		{
			interfaceFinancialBankAccountMasterViewport();
		});	
		
		$('#aInterfaceMainBankAccountReceipt').click(function()
		{
			interfaceFinancialReceiptMasterViewport();
		});	
		
		$('#aInterfaceMainBankAccountDeposit').click(function()
		{
			alert("Deposting of the sweet sweet cash...")
		});	
	}
}

function interfaceFinancialBankAccountRow(oRow)
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

function interfaceFinancialUnallocated(aParam, oResponse)
{
	var iAllocatedAccount;

	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
		oSearch.addField('title');
		oSearch.addFilter('title', 'TEXT_IS_LIKE', 'Unallocated');
		oSearch.async = false;
		oSearch.rows = 1;
		
		oSearch.getResults(function(oResponse)
		{
			if (oResponse.data.rows.length != 0)
			{
				iAllocatedAccount = oResponse.data.rows[0].id;
			}
		});	

		if (iAllocatedAccount == undefined)
		{
			$('#divInterfaceMainUnallocated').html("No unallocated account set up.");
		}
		else
		{
			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<table id="tableInterfaceFinancialUnallocated" class="interfaceMain">';
			aHTML[++h] = '<tr id="trInterfaceMainFinancialUnallocatedRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainFinancialUnallocatedColumn1" style="width: 70px" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainFinancialUnallocatedColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
			aHTML[++h] = '</table>';					
		
			$('#divInterfaceMainUnallocated').html(aHTML.join(''));
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
			oSearch.addField('invoice.reference,invoice.amount');
			oSearch.addFilter('invoice.lineitem.financialaccount', 'EQUAL_TO', iAllocatedAccount);
			oSearch.rows = 20;
			oSearch.getResults(function(data) {interfaceFinancialUnallocated(aParam, data)});
		}	
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialHomeMostLikelyNothing">No unallocated accounts.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			
			aHTML[++h] = '<table id="tableContactBusinessGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Invoice</td>';
			aHTML[++h] = '</tr>';
			
			var oRows = oResponse.data.rows;
			
			$(oRows).each(function() 
			{
				aHTML[++h] = interfaceFinancialUnallocatedRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		interfaceMasterPaginationList(
		   {
			type: 'JSON',
			xhtmlElementID: 'tdInterfaceMainFinancialUnallocatedColumn1',
			xhtmlContext: 'Unallocated',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: 100,
			functionShowRow: interfaceFinancialUnallocatedRow,
			functionOpen: undefined,
			functionNewPage: ''
		   }); 	
	}
}

function interfaceFinancialUnallocatedRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_FinancialAccount-' + oRow["invoice.id"] + '" class="interfaceMainRow">' +
							oRow["invoice.reference"] + '<br />';
	
	aHTML[++h] = '<span style="color: #808080;font-size: 0.75em;">' + oRow["invoice.amount"] + '</span>';
	
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
}

function interfaceFinancialTransaction(aParam, oResponse)
{
	var iObject = giObject;
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'divInterfaceMainTransaction';

	if (aParam != undefined)
	{
		if (aParam.object != undefined) {iObject = aParam.object}
		if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
	}		
		
	if (oResponse == undefined)
	{			
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
		oSearch.addField('financialaccounttext,amount');
		oSearch.addFilter('object', 'EQUAL_TO', giObject);
		oSearch.addFilter('objectcontext', 'EQUAL_TO', giObjectContext);
		oSearch.sort('financialaccounttext', 'asc');
		
		oSearch.getResults(function(data) {interfaceFinancialTransaction(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableFinancialTransaction" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No financial transactions.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
		}
		else
		{
			aHTML[++h] = '<table id="tableClientAudits" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Financial Account</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Amount</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" class="interfaceMainRow">' +
										this.financialaccounttext + '</td>';
										
				aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" style="text-align:right;" class="interfaceMainRow">' +
										this.amount + '</td>';
										
				aHTML[++h] = '</td>';				
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			
		}
	}	
}