function interfaceFinancialBankAccountMasterViewport(aParam)
{
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}

	giObject = -1;
	goObjectContext = undefined;
	gsObjectName = 'Bank Accounts';
	giObjectContext = -1;
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialBankAccountMasterViewport({showHome: true});',
			move: false
			})		
	}	
			
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Bank Accounts"
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
	if (bShowHome) {interfaceFinancialBankAccountHomeShow()};	
}

function interfaceFinancialBankAccountHomeShow(aParam, oResponse)
{	
	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
		oSearch.addField('title,lastreconciledamount,lastreconcileddate,notes');
		oSearch.sort('title', 'asc');
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceFinancialBankAccountHomeShow(aParam, data)});
	}
	else
	{
	
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
				'<td id="tdInterfaceViewportControlSummary" data-id="" class="interfaceViewportControl">Summary</td>' +
				'</tr>';
		
		aHTML[++h] = '</table>';	
			
		aHTML[++h] = '<table>';
					
		$.each(oResponse.data.rows, function() 
		{ 
			aHTML[++h] = '<tr id="trInterfaceViewportControlSummary" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControl' + this.id + '" data-id="' + this.id + '" class="interfaceViewportControl">' + this.title + '</td>' +
				'</tr>';
			
		});
			
		aHTML[++h] = '</table>';		
	
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
	
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';			

		$.each(oResponse.data.rows, function() 
		{ 
			aHTML[++h] = '<div id="divInterfaceMain' + this.id + '" class="divInterfaceViewportMain"></div>';			
		});
		
		$('#divInterfaceMain').html(aHTML.join(''));
	
		$('.interfaceViewportControl').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMain' + $(event.target.id).attr('data-id') + '");
		
			if ($(event.target.id).attr('data-id') = '')
			{
				interfaceFinancialBankAccountSummary();
			}
			else
			{
				interfaceFinancialBankAccountDetails({id: $(event.target.id).attr('data-id')});
			}	
		});
	
		$('#tdInterfaceViewportControlSummary').addClass('interfaceViewportControlHighlight');
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceFinancialBankAccountSummary();
	}
}

function interfaceFinancialBankAccountSummary(aParam, oResponse)
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
						
	aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPhone" class="interfaceMainSummary">Net Margin</td></tr>' +
					'<tr><td id="tdInterfaceMainSummaryPhoneValue" class="interfaceMainSummaryValue">' +
					(oResponse.NetMargin).formatMoney(2, '.', ',') +
					'</td></tr>';			
		
	aHTML[++h] = '</table>';					
	
	$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''))
}



function interfaceFinancialBankAccountDetails(aParam, oResponse)
{
	var iID;
	
	if (aParam != undefined)
	{
		if (aParam.id != undefined) {iID = aParam.id}	
	}

	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
		oSearch.addField('title,lastreconciledamount,lastreconcileddate,notes');
		aSearch.addFilter('id', 'EQUAL_TO', iID);
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
					'<td id="tdInterfaceMainBankAccountColumn2" style="width: 75px;" class="interfaceMainColumn2Action">' +
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
		
		aHTML[++h] = '<table id="tableInterfaceMainBankAccountColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainBankAccountReconciliation" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainBankAccountReconciliation">Reconcile</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainBankAccountColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainBankAccountReconciliation').button(
		{
			label: "Reconcile"
		})
		.click(function() {
			//interfaceOrderProductItemsAdd()
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
							oRow.title + '<br />';
	
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Balance-" class="interfaceMainRow" style="text-align:right;">' +
							oRow.lastreconciledamount + '<br />';
	
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Date-" class="interfaceMainRow" style="text-align:right;">' +
							oRow.lastreconcileddate + '</td>';
													
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
}