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
			aHTML[++h] = '<div id="divInterfaceBankAccount_' + this.id + '" class="divInterfaceViewportMain"></div>';			
		});
		
		$('#divInterfaceMain').html(aHTML.join(''));
	
		$('.interfaceViewportControl').click(function(event)
		{
			
			var sID = $('#' + event.target.id).attr('data-id');
			
			interfaceMasterMainViewportShow('#divInterfaceBankAccount_' + sID);
		
			if (sID == '')
			{
				interfaceFinancialBankAccountSummary();
			}
			else
			{
				interfaceFinancialBankAccountDetails({id: sID});
			}	
		});
	
		$('#tdInterfaceViewportControlSummary').addClass('interfaceViewportControlHighlight');
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceFinancialBankAccountSummary();
	}
}

function interfaceFinancialBankAccountSummary(aParam, oResponse)
{
	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
		oSearch.addField('statementdate')
		oSearch.addSummaryField('max(statementdate) maxstatementdate')
		oSearch.rows = 1;
		oSearch.getResults(function(data) {interfaceFinancialBankAccountSummary(aParam, data)});
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
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTotalAmount" class="interfaceMainSummary"></td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryTotalAmountValue" class="interfaceMainSummaryValue">' +
						'Your last reconciled statement date is ' + oResponse.summary.maxstatementdate +
						'</td></tr>';			
		
		aHTML[++h] = '</table>';					
	
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''))
	}	
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
		oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
		oSearch.addField('statementbalance,statementdate,statustext,status');
		oSearch.addFilter('bankaccount', 'EQUAL_TO', iID);
		oSearch.sort('statementdate', 'desc');
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceFinancialBankAccountDetails(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		// Bank Account type = reco from trans then add another column
		aHTML[++h] = '<table id="tableInterfaceMainBankAccount" class="interfaceMain">' +
					'<tr id="trInterfaceMainBankAccountRow1_' + iID + '" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainBankAccountColumnReco_' + iID + '" style="width: 75px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumnTran_' + iID + '" class="interfaceMainColumn2">' +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumnEdit_' + iID + '" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divInterfaceBankAccount_' + iID).html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialHomeMostLikelyNothing">No recos.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
			
			$('#tdInterfaceMainBankAccountColumnReco_' + iID).html(aHTML.join(''));	
		}
		else
		{		
			aHTML[++h] = '<table id="tableReco" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			//aHTML[++h] = '<tr class="interfaceMainCaption">';
			//aHTML[++h] = '<td class="interfaceMainCaption">Reconciliation</td>';
			//aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			//aHTML[++h] = '</tr>';
			
			var oRows = oResponse.data.rows;
			
			$(oRows).each(function(i) 
			{
				if (i==0)
				{
					if (this.status == 2)
					{
						aHTML[++h] = '<tr><td style="font-size:0.75em;"><span id="spanInterfaceBankAccountRecoAdd-' + iID + '">Add</span></td></tr>';
					}
				}
				
				aHTML[++h] = interfaceFinancialBankAccountRecoRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
			
			$('#tdInterfaceMainBankAccountColumnReco_' + iID).html(aHTML.join(''));
		}
		
		/*
		interfaceMasterPaginationList(
		   {
			type: 'JSON',
			xhtmlElementID: 'tdInterfaceMainBankAccountColumnReco' + iID,
			xhtmlContext: 'BankAccountReco',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: 100,
			functionShowRow: interfaceFinancialBankAccountRecoRow,
			functionOpen: undefined,
			functionNewPage: ''
		   });
		*/
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainBankAccountColumnReco" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainBankAccountEdit" class="interfaceMainAction" style="font-size:0.875em;">' +
						'<span id="spanInterfaceBankAccountRecoEdit">Add</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainBankAccountColumnEdit').html(aHTML.join(''));
		
		$('#spanInterfaceBankAccountRecoAdd-' + iID).button(
		{
			label: "Add"
		})
		.click(function() {
			//interfaceOrderProductItemsAdd()
		})
		.css("width", "75px");
	}
}

function interfaceFinancialBankAccountRecoRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Title-' + oRow.id + '" class="interfaceMainRow interfaceMainRowSelect reco"' +
							' title="' + oRow.notes + '">' +
							oRow.statementdate + '<br />';
	
	aHTML[++h] = '<span class="interfaceViewportControlSubContext">' + oRow.statementbalance + '</span><br />';
	aHTML[++h] = '<span class="interfaceViewportControlSubContext">' + oRow.statustext + '</span></td>';
													
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
}