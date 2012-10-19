/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
function interfaceFinancialMasterViewport(oParam)
{
	var bShowHome = true
	
	if (oParam != undefined)
	{
		if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
	}

	ns1blankspace.object = -1;
	ns1blankspace.objectContextData = undefined;
	ns1blankspace.objectName = 'Financials';
	ns1blankspace.objectContext = -1;
	
	interfaceFinancialMasterInitialise();
	
	if (bShowHome)
	{
		ns1blankspaceViewportDestination({
			newDestination: 'interfaceFinancialMasterViewport({showHome: true});',
			move: false
			})		
	}	
			
	ns1blankspaceReset();
	
	$('#divns1blankspaceViewportControlSet').button(
	{
		label: "Financials"
	});
	
	$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceFinancialSearch('inputns1blankspaceViewportControlSearch')", ns1blankspace.option.typingWait);
	});
	
	$('#spanns1blankspaceViewportControlSearch').click(function(event)
	{
		interfaceFinancialSearch('inputns1blankspaceViewportControlSearch');
	});
	
	$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
	{
		interfaceFinancialSearchOptions();
	});
	
	$('#spanns1blankspaceViewportControlNew').click(function(event)
	{
		interfaceFinancialNew();
	})
	
	$('#spanns1blankspaceViewportControlNewOptions').click(function(event)
	{
		interfaceFinancialNewOptions();
	});
	
	$('#spanns1blankspaceViewportControlAction').click(function(event)
	{
		interfaceFinancialSave();
	});
	
	$('#spanns1blankspaceViewportControlActionOptions').click(function(event)
	{
		interfaceFinancialSaveOptions();
	});
	
	$('#spanns1blankspaceViewportControlSetup').click(function(event)
	{
		interfaceFinancialSetup();
	});
	
	$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
	{
		interfaceFinancialSetupOptions();
	});
	
	$('#spanns1blankspaceViewportControlHelp').click(function(event)
	{
		interfaceFinancialHelp();
	});
	
	$('#spanns1blankspaceViewportControlHelpOptions').click(function(event)
	{
		interfaceFinancialHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceFinancialSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceFinancialSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
	if (bShowHome) {interfaceFinancialHomeShow()};	
}

function interfaceFinancialMasterInitialise(oParam, oResponse)
{
	var bRefresh = false;
	var iStep = 0;
	
	if (oParam != undefined)
	{
		if (oParam.refresh != undefined) {bRefresh = oParam.refresh}
		if (oParam.step != undefined) {iStep = oParam.step}
	}

	if (ns1blankspace.financial == undefined)
	{
		ns1blankspaceStatusWorking();	
		ns1blankspace.financial = {};
		ns1blankspace.financial.status = 1;
	}
	
	if (iStep == 0)
	{
		if (oResponse == undefined)
		{
			$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
			ns1blankspaceStatus(ns1blankspace.xhtml.loadingSmall + ' initalising.')

			if (ns1blankspace.financial.init == undefined || bRefresh)
			{
				$.ajax(
				{
					type: 'GET',
					url: '/ondemand/setup/setup.asp?method=SETUP_FINANCIAL_SETTINGS_MANAGE&setdefault=1',
					dataType: 'json',
					async: false,
					success: function(data) {interfaceFinancialMasterInitialise(oParam, data)}
				});
			}
		}
		else
		{
			ns1blankspace.financial.init = 1;
			interfaceFinancialMasterInitialise($.extend(true, oParam, {step: 1}))
		}
	}

	if (iStep == 1)
	{
		if (oResponse == undefined)
		{
			if (ns1blankspace.financial.bankaccounts == undefined || bRefresh)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
				oSearch.addField('title,lastreconciledamount,lastreconcileddate,notes');
				oSearch.rows = 100;
				oSearch.async = false;
				oSearch.getResults(function(data) {interfaceFinancialMasterInitialise(oParam, data)});
			}
		}
		else
		{
			ns1blankspace.financial.bankaccounts = oResponse.data.rows;
			interfaceFinancialMasterInitialise($.extend(true, oParam, {step: 2}))
		}
	}
	
	if (iStep == 2)
	{
		if (oResponse == undefined)
		{
			if (ns1blankspace.financial.settings == undefined || bRefresh)
			{
				$.ajax(
				{
					type: 'GET',
					url: '/ondemand/setup/setup.asp?method=SETUP_FINANCIAL_SETTINGS_SEARCH&all=1&includefinancialaccounttext=1',
					dataType: 'json',
					async: false,
					success: function(data) {interfaceFinancialMasterInitialise(oParam, data)}
				});
			}
		}
		else
		{
			ns1blankspace.financial.settings = oResponse;
			//interfaceFinancialMasterInitialise($.extend(true, oParam, {step: 3}))
		}
	}
	
	if (iStep == 3)
	{
		if (oResponse == undefined)
		{
			if (ns1blankspace.financial.accounts == undefined || bRefresh)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
				oSearch.addField('title');
				oSearch.addFilter('parentaccount', 'EQUAL_TO', ns1blankspace.financial.rootAccount);
				oSearch.sort('parentaccount', 'asc')
				oSearch.getResults(function(data) {interfaceFinancialMasterInitialise(oParam, data)})	

				$.ajax(
				{
					type: 'GET',
					url: '/ondemand/setup/setup.asp?method=SETUP_FINANCIAL_ACCOUNTS_SEARCH&all=1&includefinancialaccounttext=1',
					dataType: 'json',
					async: false,
					success: function(data) {interfaceFinancialMasterInitialise(oParam, data)}
				});
			}
		}
		else
		{
			ns1blankspace.financial.accounts = oResponse.data.rows;
			ns1blankspace.financial.accountsTree = intefaceSetupFinancialAccountsTree(ns1blankspace.financial.accounts[ns1blankspace.financial.rootaccount],ns1blankspace.financial.accounts); 
			ns1blankspace.financial.status = 2;
		}
	}

	ns1blankspaceStatus('&nbsp;');
}

function interfaceFinancialHomeShow()
{	
	var aHTML = [];
	var h = -1;
				
	aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
	aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
					'<td id="tdInterfaceProjectHomeMostLikely" class="interfaceViewportMain">' +
					ns1blankspace.xhtml.loading + 
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';					
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;
				
	aHTML[++h] = '<table>';
	aHTML[++h] = '<tr>' +
					'<td id="ns1blankspaceViewportFinancialLarge" class="ns1blankspaceViewportImageLarge">' +
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
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlAccounts" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlAccounts" class="interfaceViewportControl">Accounts</td>' +
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
	aHTML[++h] = '<div id="divInterfaceMainAccounts" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainUnallocated" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
		interfaceFinancialSummary();
	});
	
	$('#tdInterfaceViewportControlBankAccount').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainBankAccount");
		interfaceFinancialBankAccount();
	});	
	
	$('#tdInterfaceViewportControlDebtors').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainDebtors");
		interfaceFinancialDebtors();
	});	
		
	$('#tdInterfaceViewportControlCreditors').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainCreditors");
		interfaceFinancialCreditors();
	});	
	
	$('#tdInterfaceViewportControlPL').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainPL");
		interfaceFinancialProfitLoss();
	});	
	
	$('#tdInterfaceViewportControlBS').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainBS");
		interfaceFinancialBalanceSheet();
	});	
	
	$('#tdInterfaceViewportControlAccounts').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainAccounts");
		interfaceFinancialAccounts();
	});	
	
	$('#tdInterfaceViewportControlUnallocated').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainUnallocated");
		interfaceFinancialUnallocated();
	});	
	
	$('#tdInterfaceViewportControlSummary').addClass('interfaceViewportControlHighlight');
	ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
	interfaceFinancialSummary();
}

function interfaceFinancialSummary(oParam, oResponse)
{
	//if (ns1blankspace.financial.summary != undefined)
	//	interfaceFinancialSummary(oParam, ns1blankspace.financial.summary)
		
	if (oResponse == undefined)
	{

		var sParam = 'method=FINANCIAL_PROFIT_LOSS_SEARCH&rf=JSON&rows=1';
	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/financial/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceFinancialSummary(oParam, data)}
		});
		
	}
	else
	{
		ns1blankspace.financial.summary = oResponse;
		
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

function interfaceFinancialDebtors(oParam, oResponse)
{

	if (oResponse == undefined)
	{

		var sParam = 'method=FINANCIAL_DEBTOR_SEARCH&rf=JSON';
	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/financial/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceFinancialDebtors(oParam, data)}
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
		
		ns1blankspacePaginationList(
		   {
			type: 'JSON',
			xhtmlElementID: 'divInterfaceMainDebtors',
			xhtmlContext: 'Debtors',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: ns1blankspace.option.defaultRows,
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

function interfaceFinancialCreditors(oParam, oResponse)
{

	if (oResponse == undefined)
	{

		var sParam = 'method=FINANCIAL_CREDITOR_SEARCH&rf=JSON';
	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/financial/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceFinancialCreditors(oParam, data)}
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
		
		ns1blankspacePaginationList(
		   {
			type: 'JSON',
			xhtmlElementID: 'divInterfaceMainCreditors',
			xhtmlContext: 'Creditors',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: ns1blankspace.option.defaultRows,
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

function interfaceFinancialProfitLoss(oParam, oResponse)
{
	if (oResponse == undefined)
	{		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_PROFIT_LOSS_SEARCH';
		oSearch.addField('financialaccounttext,total,percentage');
		oSearch.sort('financialaccounttext', 'asc');
		oSearch.rows = ns1blankspace.messaging.defaultRows;
		oSearch.getResults(function(data) {interfaceFinancialProfitLoss(oParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">Sorry nothing to show, add an invoice or expense<br />and you will be able to see how you are going.</td>';
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
		
		ns1blankspacePaginationList(
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

function interfaceFinancialBalanceSheet(oParam, oResponse)
{
	if (oResponse == undefined)
	{	
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_BALANCE_SHEET_SEARCH';
		oSearch.addField('financialaccounttext,amount,subtotalcount,type');
		oSearch.sort('financialaccounttext', 'asc');
		oSearch.rows = 100;
		oSearch.getResults(function(data) {interfaceFinancialBalanceSheet(oParam, data)});	
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">Sorry nothing to show, add an invoice or expense<br />and you will be able to see how you are going.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';

			$('#divInterfaceMainBS').html(aHTML.join(''));
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
		
		ns1blankspacePaginationList(
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

function interfaceFinancialBankAccount(oParam, oResponse)
{

	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
		oSearch.addField('title,lastreconciledamount,lastreconcileddate,notes');
		oSearch.sort('title', 'asc');
		oSearch.rows = ns1blankspace.option.defaultRows;
		oSearch.getResults(function(data) {interfaceFinancialBankAccount(oParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainBankAccount" class="interfaceMain">' +
					'<tr id="trInterfaceMainBankAccountow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainBankAccountColumn1" class="interfaceMainColumn1Large">' +
					ns1blankspace.xhtml.loading +
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
		
		ns1blankspacePaginationList(
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
						'<a href="#" id="aInterfaceMainBankAccountReco">Reconcile & Import Transactions</a>' +
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
			alert("Depositing of the sweet sweet cash...")
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

function interfaceFinancialUnallocated(oParam, oResponse)
{
	if (oResponse == undefined)
	{
		if (ns1blankspace.financial.unallocatedAccount == undefined)
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
					ns1blankspace.financial.unallocatedAccount = oResponse.data.rows[0].id;
				}
				else
				{
					ns1blankspace.financial.unallocatedAccount = -1;
				}	
			});	
		}
			
		if (ns1blankspace.financial.unallocatedAccount == -1)
		{
			$('#divInterfaceMainUnallocated').html("No unallocated account set up.");
		}
		else
		{	
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
			oSearch.addField('invoice.reference,invoice.amount');
			oSearch.addFilter('invoice.lineitem.financialaccount', 'EQUAL_TO', ns1blankspace.financial.unallocatedAccount);
			oSearch.rows = 20;
			oSearch.getResults(function(data) {interfaceFinancialUnallocated(oParam, data)});
		}	
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
		
		ns1blankspacePaginationList(
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
				
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_FinancialAccount-' + oRow["invoice.id"] + '" class="interfaceMainRow interfaceMainRowSelect">' +
							oRow["invoice.reference"] + '<br />';
	
	aHTML[++h] = '<span style="color: #808080;font-size: 0.75em;">' + oRow["invoice.amount"] + '</span>';
	
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
}

function interfaceFinancialTransaction(oParam, oResponse)
{
	var iObject = ns1blankspace.object;
	var iObjectContext = ns1blankspace.objectContext;
	var sXHTMLElementId = 'divInterfaceMainTransaction';

	if (oParam != undefined)
	{
		if (oParam.object != undefined) {iObject = oParam.object}
		if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
		if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
	}		
		
	if (oResponse == undefined)
	{			
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
		oSearch.addField('financialaccounttext,amount,date,description');
		oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
		oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
		oSearch.sort('financialaccounttext', 'asc');
		
		oSearch.getResults(function(data) {interfaceFinancialTransaction(oParam, data)});
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
			aHTML[++h] = '<td class="interfaceMainCaption" style="width:150px;">Financial Account</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="width:100px;">Date</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;width:125px;">Amount</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Description</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdFinancialATransaction_financialaccounttext-' + this.id + '" class="interfaceMainRow">' +
										this.financialaccounttext + '</td>';
										
				aHTML[++h] = '<td id="tdFinancialATransaction_date-' + this.id + '" class="interfaceMainRow">' +
										this.date + '</td>';
										
				aHTML[++h] = '<td id="tdFinancialATransaction_amount-' + this.id + '" style="text-align:right;" class="interfaceMainRow">' +
										this.amount + '</td>';
					
				aHTML[++h] = '<td id="tdFinancialATransaction_description-' + this.id + '" class="interfaceMainRow">' +
										this.description + '</td>';
																
				aHTML[++h] = '</td>';				
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			
		}
	}	
}

function interfaceFinancialAccounts(oParam, oResponse)
{
	var iStep = 1;
	var iFinancialAccount = -1;
	
	if (oParam != undefined)
	{
		if (oParam.step != undefined) {iStep = oParam.step};
		if (oParam.financialAccount != undefined) {iFinancialAccount = oParam.financialAccount};
	}
	else
	{
		oParam = {};
	}
	
	if (iStep == 1)	
	{
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table class="interfaceMainAccount" cellspacing=0 cellpadding=0>' +
				'<tr id="trInterfaceMainAccountRow1" class="interfaceMainRow1">' +
				'<td id="tdInterfaceMainAccountColumn1" style="width:100px;font-size:0.75em;">' +
				'</td>' +
				'<td id="tdInterfaceMainAccountColumn2" class="interfaceMainColumn2">' +
				'</td>' +
				'</tr>' +
				'</table>';			
		
		$('#divInterfaceMainAccounts').html(aHTML.join(''));
			
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<div id="interfaceMainAccountColumnCategory" style="width: 100;margin-bottom:3px;text-align:right;">';
		aHTML[++h] = '<input type="radio" id="interfaceMainBankAccountColumnCategory-1" name="radioCategory" /><label for="interfaceMainBankAccountColumnCategory-1" style="width: 100px;">All</label>';

		aHTML[++h] = '<input type="radio" id="interfaceMainBankAccountColumnCategory-2" name="radioCategory" /><label for="interfaceMainBankAccountColumnCategory-2" style="width: 100px;">Profit & Loss</label>';
	
		aHTML[++h] = '<input type="radio" id="interfaceMainBankAccountColumnCategory-3" name="radioCategory" /><label for="interfaceMainBankAccountColumnCategory-3" style="width: 100px;">Balance Sheet</label>';
	
		aHTML[++h] = '</div>';

		$('#tdInterfaceMainAccountColumn1').html(aHTML.join(''));
	
		$('#interfaceMainAccountColumnCategory').buttonset().css('font-size', '0.875em');
		
		$('#interfaceMainAccountColumnCategory :radio').click(function()
		{
			var aID = (event.target.id).split('-');
			$.extend(true, oParam, {step: 2, category: parseInt(aID[1])});
			interfaceFinancialAccounts(oParam);
		});
	}
	
	if (iStep == 2)
	{	
		if (oResponse == undefined)
		{	
			$('#tdInterfaceMainBankAccountColumn2').html(ns1blankspace.xhtml.loadingSmall);
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
			oSearch.addField('title');
			oSearch.sort('title', 'asc');
			//oSearch.addFilter('type', 'EQUAL_TO', iType);
			oSearch.rows = 200;
			oSearch.getResults(function(data) {interfaceFinancialAccounts(oParam, data)});	
		}
		else
		{
			$.extend(true, oParam, {step: 3});
			
			var aHTML = [];
			var h = -1;
		
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
				aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
				aHTML[++h] = '<td class="interfaceMainRowNothing">No Accounts</td>';
				aHTML[++h] = '</tr>';
				aHTML[++h] = '</table>';
				
				$('#tdInterfaceMainAccountColumn2').html(aHTML.join(''));
			}
			else
			{
				aHTML[++h] = '<table id="tableInterfaceFinancialAccountTransactions" class="interfaceMain">';
				aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountTransactionsRow1" class="interfaceMain">' +
							'<td id="tdInterfaceMainFinancialAccountTransactionsColumn1" style="width: 70px;font-size:0.875em;" class="interfaceMainColumn1">' +
							'</td>' +
							'<td id="tdInterfaceMainFinancialAccountTransactionsColumn2" class="interfaceMainColumn2">' +
							'</td>' +
							'</tr>';
				aHTML[++h] = '</table>';					
		
				$('#tdInterfaceMainAccountColumn2').html(aHTML.join(''));
		
				var aHTML = [];
				var h = -1;
		
				aHTML[++h] = '<table id="tableReco" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
				aHTML[++h] = '<tbody>';
			
				$(oResponse.data.rows).each(function(i) 
				{
					if (i==0)
					{
						aHTML[++h] = '<tr><td style="font-size:0.75em;"><span id="spanInterfaceBankAccountAll">All</span></td></tr>';	
					}
				
					aHTML[++h] = '<tr><td id="interfaceFinancialAccountReco_title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect financialaccount"' +
									'>' + this.title + '</td></tr>';
				});
			
				aHTML[++h] = '</tbody></table>';
			
				$('#tdInterfaceMainFinancialAccountTransactionsColumn1').html(aHTML.join(''));
				
				$('#spanInterfaceBankAccountAll').button(
				{
					label: "All"
				})
				.click(function() {
						$.extend(true, oParam, {step: 3, financialAccount: -1});
						interfaceFinancialAccounts(oParam);
				})
				.css("width", "75px");
				
				$('.financialaccount').click(function() {
						var aID = (event.target.id).split('-');
						$.extend(true, oParam, {step: 3, financialAccount: parseInt(aID[1])});
						interfaceFinancialAccounts(oParam);
				});
			}
			
		}
	}
	
	if (iStep == 3)
	{	
		if (oResponse == undefined)
		{	
			$('#tdInterfaceMainFinancialAccountTransactionsColumn2').html(ns1blankspace.xhtml.loadingSmall);
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
			oSearch.addField('date,description,amount');
			oSearch.addSummaryField('sum(amount) sumamount');
			oSearch.sort('date', 'desc');
			if (iFinancialAccount != -1) {oSearch.addFilter('financialaccount', 'EQUAL_TO', iFinancialAccount)};
			oSearch.rows = 200;
			oSearch.getResults(function(data) {interfaceFinancialAccounts(oParam, data)});	
		}
		else
		{
			$.extend(true, oParam, {step: 3});
			
			var aHTML = [];
			var h = -1;
		
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
				aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
				aHTML[++h] = '<td class="interfaceMainRowNothing">No transactions</td>';
				aHTML[++h] = '</tr>';
				aHTML[++h] = '</table>';
				
				$('#tdInterfaceMainFinancialAccountTransactionsColumn2').html(aHTML.join(''));
			}
			else
			{
				var aHTML = [];
				var h = -1;
		
				aHTML[++h] = '<table id="tableAccountTransactions" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
				aHTML[++h] = '<tbody>';
			
				aHTML[++h] = '<tr class="interfaceMainCaption">';
				aHTML[++h] = '<td class="interfaceMainCaption">TOTAL</td>';
				aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
				aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">' + oResponse.summary.sumamount + '</td>';
				aHTML[++h] = '</tr>';
				
				$(oResponse.data.rows).each(function(i) 
				{
					aHTML[++h] = '<tr><td id="interfaceFinancialAccountTransactions_date-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect"' +
									'>' + this.date + '</td>';
					
					aHTML[++h] = '<td id="interfaceFinancialAccountTransactions_description-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect"' +
									'>' + this.description + '</td>';
									
					aHTML[++h] = '<td id="interfaceFinancialAccountTransactions_amount-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect"' +
									' style="text-align:right;">' + this.amount + '</td>';				
													
					aHTML[++h] = '</tr>';
				});
			
				aHTML[++h] = '</tbody></table>';
			
				$('#tdInterfaceMainFinancialAccountTransactionsColumn2').html(aHTML.join(''));		
			}
			
		}
	}
}
