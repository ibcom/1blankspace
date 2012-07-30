function interfaceFinancialBankAccountMasterViewport(aParam)
{
	interfaceFinancialMasterInitialise();
	
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
	
	$('#divInterfaceViewportControl').html(aHTML.join(''));	

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableFinancialBankAccount" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
	aHTML[++h] = '<tbody>'
	
	$.each(ns1blankspace.financial.bankaccounts, function()
	{
		aHTML[++h] = '<tr class="interfaceMainRow">';
						
		aHTML[++h] = '<td id="tdBankAccount_title-' + this.id + '" class="interfaceHomeMostLikely" style="width:150px;">' +
								this["title"] + '</td>';
				
		aHTML[++h] = '<td id="interfaceBankAccount_lastreconcileddate-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:90px;text-align:right;">' +
									this.lastreconcileddate + '</td>';
													
		aHTML[++h] = '<td id="interfaceBankAccount_lastreconciledamount-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:90px;text-align:right;">' +
									'$' + this.lastreconciledamount + '</td>';
			
		aHTML[++h] = '<td>&nbsp;</td>';																	
		aHTML[++h] = '</tr>';
	});
	
	aHTML[++h] = '</tbody></table>';

	$('#tdInterfaceMainItemColumn1').html(aHTML.join(''));
	
	$('#divInterfaceMain').html(aHTML.join(''));

	$('.interfaceHomeMostLikely').click(function(event) {
		var aID = (event.target.id).split('-');
		interfaceFinancialBankAccountShow({id: aID[1]});
	});
}

function interfaceFinancialBankAccountViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
					'</tr>';
	
	aHTML[++h] = '</table>';
	
	aHTML[++h] = '<table class="interfaceViewportControl">';
				
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlImport" class="interfaceViewportControl">Import</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlItem" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlReconcile" class="interfaceViewportControl">Reconcile</td>' +
					'</tr>';

	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainContext" class="divInterfaceViewportMainContext"></div>';
	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainImport" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainReconcile" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceFinancialBankAccountSummary();
	});
	
	$('#tdInterfaceViewportControlImport').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainImport");
		interfaceFinancialBankAccountImport();
	});
	
	$('#tdInterfaceViewportControlReconcile').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainReconcile", true);
		interfaceFinancialBankAccountReconcile();
	});
}

function interfaceFinancialBankAccountShow(aParam, oResponse)
{
	if (aParam != undefined)
	{
		if (aParam.id != undefined) {giObjectContext = aParam.id}	
	}
	
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceFinancialBankAccountViewport();
	
	goObjectContext == undefined;
	goObjectContext = ($.grep(ns1blankspace.financial.bankaccounts, function (a) { return a.id == giObjectContext; }))[0];
	
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the bankaccount.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
			
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
			
		$('#divInterfaceViewportControlContext').html(goObjectContext.title+
			'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_date">' + goObjectContext.lastreconcileddate + '</span>' +
			'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_amount">$' + goObjectContext.lastreconciledamount + '</span>');
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialBankAccountMasterViewport({showHome: false});interfaceFinancialBankAccountShow({id: ' + giObjectContext + '})',
			move: false
			})
	
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceFinancialBankAccountSummary()'});
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
					'<td id="tdInterfaceMainSummaryColumn2Action" style="width:400px;" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';				

	$('#divInterfaceMainSummary').html(aHTML.join(''));	

	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
					
	aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTotalAmount" class="interfaceMainSummary"></td></tr>' +
					'<tr><td id="tdInterfaceMainSummaryTotalAmountValue" class="interfaceMainSummaryValue">' +
					'This bank account was last reconciled on the ' + goObjectContext.lastreconcileddate + '.' +
					'</td></tr>';			
	
	aHTML[++h] = '</table>';					

	$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table cellpadding=6>';
	
	aHTML[++h] = '<tr><td class="interfaceMainSummary" colspan=2>You have a number of options when reconciling a bank account.</td></tr>'
				
	aHTML[++h] = '<tr><td class="interfaceMainSummary" style="width:15px;padding-bottom:10px;">1</td><td class="interfaceViewportControlSub">' +
						'Use a printed or PDF bank statement directly.  In this case you skip the import step and go straight to reconcile.' +
						' You can then add a reconilication - selecting the date you want to balance up to.  You then search the system for matching payments or receipts that have already been entered or if not, add them as you go.' +
					'</td></tr>';

	aHTML[++h] = '<tr><td class="interfaceMainSummary" style="width:15px;">2</td><td class="interfaceViewportControlSub">' +
						'You export a file from your internet banking and then import it.' +
					'  You can then add a reconilication - selecting the date you want to balance up to.  The system will then help you then search the system for matching payments or receipts that have already been entered, based on these transactions or if not, add them as you go.' +
					'</td></tr>';

	aHTML[++h] = '</table>';
	
	$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''))
		
}

function interfaceFinancialBankAccountReconcile(aParam, oResponse)
{
	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
		oSearch.addField('statementbalance,statementdate,statustext,status');
		oSearch.addFilter('bankaccount', 'EQUAL_TO', giObjectContext);
		oSearch.sort('statementdate', 'desc');
		oSearch.rows = 12;
		oSearch.getResults(function(data) {interfaceFinancialBankAccountReconcile(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainBankAccount" class="interfaceMain">' +
					'<tr id="trInterfaceMainBankAccountRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainBankAccountColumnReco" style="width: 85px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumnReco2" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divInterfaceMainReconcile').html(aHTML.join(''));
				
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<tr><td style="font-size:0.75em;"><span id="spanInterfaceBankAccountRecoAdd">Add</span></td></tr>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
			
			$('#tdInterfaceMainBankAccountColumnReco').html(aHTML.join(''));	
		}
		else
		{		
			aHTML[++h] = '<table id="tableReco" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>';
			
			var oRows = oResponse.data.rows;
			
			$(oRows).each(function(i) 
			{
				if (i==0)
				{
					if (this.status == 2)
					{
						aHTML[++h] = '<tr><td style="font-size:0.75em;"><span id="spanInterfaceBankAccountRecoAdd">Add</span></td></tr>';
					}
				}
				
				aHTML[++h] = interfaceFinancialBankAccountRecoRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
			
			$('#tdInterfaceMainBankAccountColumnReco').html(aHTML.join(''));
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
		
		$('#spanInterfaceBankAccountRecoAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			interfaceFinancialBankAccountRecoEdit()
		})
		.css("width", "75px");
		
		$('.reco').click(function()
		{
			var aID = (event.target.id).split('-');
			interfaceFinancialBankAccountRecoItems({reconciliation: aID[1]});
		});
	}
}

function interfaceFinancialBankAccountRecoRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
		
	if (oRow.status == 2)
	{			
		aHTML[++h] = '<td id="interfaceFinancialBankAccountReco_title-' + oRow.id + '" class="interfaceMainRow interfaceMainRowSelect reco"' +
						' style="text-align:right;">' +
						'<span class="interfaceViewportControlSubContext" id="spanInterfaceFinancialBankAccountReco_date-' +
						oRow.id + '">' + oRow.statementdate + '</span><br />';
	}
	else
	{
		aHTML[++h] = '<td id="interfaceFinancialBankAccountReco_title-' + oRow.id + '" class="interfaceMainRow interfaceMainRowSelect reco"' +
							' style="text-align:right;"' +
							'>' + oRow.statementdate + '<br />';
	}						
	
	aHTML[++h] = '<span class="interfaceViewportControlSubContext" id="spanInterfaceFinancialBankAccountReco_balance-' + oRow.id + '">$' +
	 					oRow.statementbalance + '</span>';
				
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
}

function interfaceFinancialBankAccountRecoEdit(aParam, oResponse)
{
	var sID; 
	var iDefaultCategory;
	
	if (oResponse == undefined)
	{
		var sXHTMLElementID;

		if (aParam != undefined)
		{
			if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		}
		
		if (sXHTMLElementID != undefined)
		{
			var aXHTMLElementID = sXHTMLElementID.split('-');
			var sID = aXHTMLElementID[1];
		}	
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table class="interfaceMain" cellspacing=0 cellpadding=0>' +
				'<tr>' +
				'<td id="tdInterfaceMainBankAccountColumnRecoEdit" style="padding-right:15px;">' +
				'</td>' +
				'<td id="tdInterfaceMainBankAccountColumnRecoEdit2" class="interfaceMainColumn2" style="width: 250px">' +
				'</td>' +
				'</tr>' +
				'</table>';			
	
		$('#tdInterfaceMainBankAccountColumnReco2').html(aHTML.join(''));
			
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<table class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainFinancialBanksAccountRecoStatementDate" class="interfaceMain">' +
						'<td id="tdInterfaceMainFinancialBanksAccountRecoStatementDate" class="interfaceMain">' +
						'Bank Statement Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainFinancialBanksAccountRecoStatementDateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainFinancialBanksAccountRecoStatementDateValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainFinancialBanksAccountRecoStatementDate" class="inputInterfaceMainDate">' +
						'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceMainFinancialBanksAccountRecoStatementBalance" class="interfaceMain">' +
						'<td id="tdInterfaceMainFinancialBanksAccountRecoStatementBalance" class="interfaceMain">' +
						'Bank Statement Balance' +
						'</td></tr>' +
						'<tr id="trInterfaceMainFinancialBanksAccountRecoStatementBalanceValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainFinancialBanksAccountRecoStatementBalanceValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainFinancialBanksAccountRecoStatementBalance" class="inputInterfaceMainText">' +
						'</td></tr>';			
							
		aHTML[++h] = '<tr id="trInterfaceMainFinancialBanksAccountRecoStatus" class="interfaceMain">' +
						'<td id="tdInterfaceMainFinancialBanksAccountRecoStatus" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainFinancialBanksAccountRecoStatusValue">' +
						'<td id="tdInterfaceMainFinancialBanksAccountRecoStatusValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>In Progress' +
						'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Completed' +
						'</td></tr>';
																																			
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainBankAccountColumnRecoEdit').html(aHTML.join(''));
		
		$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});
			
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em;">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainBankAccountColumnRecoEditSave">Save</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainBankAccountColumnRecoEdit2').html(aHTML.join(''));
		
		$('#spanInterfaceMainBankAccountColumnRecoEditSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			interfaceMasterStatusWorking();
					
			var sData = 'bankaccount=' + giObjectContext;
			sData += '&id=' + interfaceMasterFormatSave(sID);
			sData += '&statementdate=' + interfaceMasterFormatSave($('#inputInterfaceMainFinancialBanksAccountRecoStatementDate').val());
			sData += '&statementbalance=' + interfaceMasterFormatSave($('#inputInterfaceMainFinancialBanksAccountRecoStatementBalance').val());
			sData += '&status=' + interfaceMasterFormatSave($('input[name="radioStatus"]:checked').val());
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/financial/?method=FINANCIAL_RECONCILIATION_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					interfaceFinancialBankAccountReconcile();
					interfaceMasterStatus('Reconciliation added.');
				}
			});
		});
		
		if (sID != undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/financial/?method=FINANCIAL_RECONCILIATION_SEARCH',
				data: 'id=' + sID,
				dataType: 'json',
				success: function(data) {interfaceFinancialBankAccountRecoEdit(aParam, data)}
			});
		}
		else
		{
			$('[name="radioStatus"][value="1"]').attr('checked', true);	
		}
	}
	else
	{
		if (oResponse.data.rows.length != 0)
		{
			var oObjectContext = oResponse.data.rows[0];
			$('#inputInterfaceMainFinancialBanksAccountRecoStatementDate').val(oObjectContext.statementdate);
			$('#inputInterfaceMainFinancialBanksAccountRecoStatementBalance').val(oObjectContext.statementbalance);
			$('[name="radioStatus"][value="' + oObjectContext.status + '"]').attr('checked', true);
		}
	}
}

function interfaceFinancialBankAccountRecoItems(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'tdInterfaceMainSetupStructureElementColumnElement1';
	var oOptions = {view: true, remove: true, automation: true};
	var oActions = {add: true};
	var iReconciliation;
	var iType = 1;
	var iSource = 1;
	
	if (aParam != undefined)
	{
		if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
		if (aParam.options != undefined) {oOptions = aParam.options}
		if (aParam.actions != undefined) {oActions = aParam.actions}
		if (aParam.reconciliation != undefined) {iReconciliation = aParam.reconciliation}
		if (aParam.type != undefined) {iType = aParam.type}
		if (aParam.source != undefined) {iSource = aParam.source}
	}		
	
	$.extend(true, aParam, {source: iSource, type: iType});
		
	if (oResponse == undefined)
	{	
		if ($('#tdInterfaceMainBankAccountColumnReco2').html() == '')
		{
		
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table class="interfaceMain" cellspacing=0 cellpadding=0 style="font-size:0.875em;">' +
					'<tr id="trInterfaceMainBankAccountRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainBankAccountColumnType" style="width: 75px;font-size:0.875em;text-align:right;padding-right:7px;">' +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumnItem" class="interfaceMainColumn2" style="width: 200px;font-size:0.875em;">' +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumnItemEdit" class="interfaceMainColumn2" style="font-size:0.875em;">' +
					'</td>' +
					'</tr>' +
					'</table>';			
		
			$('#tdInterfaceMainBankAccountColumnReco2').html(aHTML.join(''));
			
			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<div id="interfaceMainBankAccountColumnItemType" style="width: 70px;margin-bottom:3px;">';
			aHTML[++h] = '<input style="width: 100px;" type="radio" id="interfaceMainBankAccountColumnItemType-1" name="radioType" checked="checked" /><label for="interfaceMainBankAccountColumnItemType-1" style="width: 70px;">Debits (Out)</label>';
			aHTML[++h] = '<input style="width: 100px;"  type="radio" id="interfaceMainBankAccountColumnItemType-2" name="radioType" /><label for="interfaceMainBankAccountColumnItemType-2" style="width: 70px;">Credits (In)</label>';
			aHTML[++h] = '</div>';
		
			$('#tdInterfaceMainBankAccountColumnType').html(aHTML.join(''));
		
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<div id="interfaceMainBankAccountColumnItemSource" style="width: 200px;;margin-bottom:3px;">';
			aHTML[++h] = '<input style="width: 100px;" type="radio" id="interfaceMainBankAccountColumnItemSource-1" name="radioSource" checked="checked" /><label for="interfaceMainBankAccountColumnItemSource-1" style="width: 96px;">Reconciled</label>';
			aHTML[++h] = '<input style="width: 100px;" type="radio" id="interfaceMainBankAccountColumnItemSource-2" name="radioSource" /><label for="interfaceMainBankAccountColumnItemSource-2" style="width: 96px;">Statement</label>';
			aHTML[++h] = '</div>';
		
			aHTML[++h] = '<div id="divInterfaceMainRecoItems" style="width: 200px;margin-bottom:3px;"></div>';
			
			$('#tdInterfaceMainBankAccountColumnItem').html(aHTML.join(''));
			
			interfaceFinancialBankAccountRecoItemsEdit(aParam);
		}
	
		$('#interfaceMainBankAccountColumnItemType').buttonset().css('font-size', '0.875em');
		$('#interfaceMainBankAccountColumnItemSource').buttonset().css('font-size', '0.875em');
		
		$('#interfaceMainBankAccountColumnItemSource :radio').click(function()
		{
			var aID = (event.target.id).split('-');
			$.extend(true, aParam, {source: parseInt(aID[1])});
			interfaceFinancialBankAccountRecoItems(aParam);
		});
		
		$('#interfaceMainBankAccountColumnItemType :radio').click(function()
		{
			var aID = (event.target.id).split('-');
			$.extend(true, aParam, {type: parseInt(aID[1])});
			interfaceFinancialBankAccountRecoItems(aParam);	
		});
		
		$('#divInterfaceMainRecoItems').html(gsLoadingSmallXHTML);
		
		var oSearch = new AdvancedSearch();
		
		if (iSource == 1)
		{
			if (iType == 1)
			{
				oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
				oSearch.addField('reference,amount,paiddate,reconciliation');
				oSearch.sort('paiddate', 'desc');
			}	
			else
			{
				oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
				oSearch.addField('reference,amount,receiveddate,reconciliation');
				oSearch.sort('receiveddate', 'desc');
			}
			
			oSearch.addFilter('reconciliation', 'EQUAL_TO', iReconciliation);
			oSearch.rows = giReturnRows;
			oSearch.getResults(function(data) {interfaceFinancialBankAccountRecoItems(aParam, data)});
		}		
		else
		{
			oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
			oSearch.addField('description,amount,posteddate');
			oSearch.sort('posteddate', 'desc');
			oSearch.addFilter('bankaccount', 'EQUAL_TO', giObjectContext);
			oSearch.addFilter('status', 'EQUAL_TO', 1);
			oSearch.rows = giReturnRows;
			oSearch.getResults(function(data) {interfaceFinancialBankAccountRecoItems(aParam, data)});
		}		
	}
	else
	{
						
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableSetupStructureElement" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No items.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#divInterfaceMainRecoItems').html(aHTML.join(''));
		
		}
		else
		{
			aHTML[++h] = '<table id="tableRecoItems" border="0" cellspacing="0" cellpadding="0">';
			aHTML[++h] = '<tbody>'
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow"><td class="interfaceMainRow interfaceMainRowSelect">' +
					'<table cellspacing=0 cellpadding=0><tr>';
								
					if (this.paiddate)
					{				
						aHTML[++h] = '<td id="tdRecoItems_date-' + this.id + '" class="recoitempayment">' +
											this.paiddate + '</td>';
					}
					else if (this.receiveddate)
					{
						aHTML[++h] = '<td id="tdRecoItems_date-' + this.id + '" class="recoitemreceipt">' +
											this.receiveddate + '</td>';
					}							
					else if (this.posteddate)
					{
						aHTML[++h] = '<td id="tdRecoItems_date-' + this.id + '" class="recoitemstatement">' +
											this.posteddate + '</td>';
					}
				
					aHTML[++h] = '<td id="spanRecoItems_amount-' + this.id + '" style="text-align:right;"' +
										' class="recoitem">' +
										this.amount + '</td>';
					
					if (iSource == 1)
					{
						aHTML[++h] = '</tr><tr><td colspan=2 id="spanRecoItems_description-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
										' class="recoitem">' +
										this.reference + '</td>';
					}
					else
					{
						aHTML[++h] = '</tr><tr><td colspan=2 id="spanRecoItems_description-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
										' class="recoitem">' +
										this.description + '</td>';
					}
							
				aHTML[++h] = '</tr></table></td>';	
					
				if ((this.paiddate) || (this.receiveddate))
				{					
					aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
					aHTML[++h] = '<span id="spanRecoItems_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
					aHTML[++h] = '</td>';
				};	
				
				if (this.posteddate)
				{					
					aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
					aHTML[++h] = '<span id="spanRecoItems_options_search-' + this.id + '"' +
									' data-searchDate="' + this.posteddate + '"' +
									' data-searchAmount="' + this.amount + '"' +
									' class="interfaceMainRowOptionsMatch"></span>';
					aHTML[++h] = '</td>';
				};	
						
				aHTML[++h] = '</tr>';
				
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#divInterfaceMainRecoItems').html(aHTML.join(''));
		
			$('.interfaceMainRowOptionsRemove').button( {
				text: false,
				icons: {
					primary: "ui-icon-close"
				}
			})
			.click(function() {
				//interfaceMasterSetupStructureElementRemove({xhtmlElementID: this.id});
			})
			.css('width', '15px')
			.css('height', '17px')
			
			$('.interfaceMainRowOptionsMatch').button( {
				text: false,
				icons: {
					primary: "ui-icon-play"
				}
			})
			.click(function() {
				var aID = (this.id).split('-');
				$.extend(true, aParam, {searchSourceID: aID[1], searchDate: $(this).attr("data-searchDate"), searchAmount: $(this).attr("data-searchAmount")});
				interfaceFinancialBankAccountRecoItemsEdit(aParam);
			})
			.css('width', '15px')
			.css('height', '17px')
			
		}
	}	
}

function interfaceFinancialBankAccountRecoItemsEdit(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'tdInterfaceMainBankAccountColumnEdit';
	var oOptions = {view: true, remove: true, automation: true};
	var oActions = {add: true};
	var iReconciliation;
	var iType = 1;
	var iEditAction = 1;
	var dSearchDate;
	var cSearchAmount;
	
	if (aParam != undefined)
	{
		if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
		if (aParam.options != undefined) {oOptions = aParam.options}
		if (aParam.actions != undefined) {oActions = aParam.actions}
		if (aParam.reconciliation != undefined) {iReconciliation = aParam.reconciliation}
		if (aParam.type != undefined) {iType = aParam.type}
		if (aParam.editAction != undefined) {iEditAction = aParam.editAction}
		if (aParam.searchDate != undefined) {dSearchDate = aParam.searchDate}
		if (aParam.searchAmount != undefined) {cSearchAmount = aParam.searchAmount}	
	}		
	
	$.extend(true, aParam, {editAction: iEditAction, type: iType});
		
	if (oResponse == undefined)
	{	
		if ($('#tdInterfaceMainBankAccountColumnItemEdit').html() == '')
		{
		
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table class="interfaceMainRecoItemEdit" cellspacing=0 cellpadding=0>' +
					'<tr id="trInterfaceMainBankAccountRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainBankAccountColumnRecoItemEdit1" style="width:200px;">' +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumnRecoItemEdit2" class="interfaceMainColumn2" style="width:50px;">' +
					'</td>' +
					'</tr>' +
					'</table>';			
		
			$('#tdInterfaceMainBankAccountColumnItemEdit').html(aHTML.join(''));
			
			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<div id="interfaceMainBankAccountColumnItemEdit" style="width: 196;margin-bottom:3px;text-align:right;">';
			aHTML[++h] = '<input type="radio" id="interfaceMainBankAccountColumnItemEdit-1" name="radioEdit" checked="checked" /><label for="interfaceMainBankAccountColumnItemEdit-1" style="width: 112px;">Unreconciled</label>';
		
			aHTML[++h] = '<input type="radio" id="interfaceMainBankAccountColumnItemEdit-2" name="radioEdit" /><label for="interfaceMainBankAccountColumnItemEdit-2" style="width: 50px;">Add</label>';
			aHTML[++h] = '</div>';
		
			aHTML[++h] = '<div id="divInterfaceMainRecoItemsEdit"></div>';
			
			$('#tdInterfaceMainBankAccountColumnRecoItemEdit1').html(aHTML.join(''));
		}
	
		$('#interfaceMainBankAccountColumnItemEdit').buttonset().css('font-size', '0.875em');
		
		$('#interfaceMainBankAccountColumnItemEdit :radio').click(function()
		{
			var aID = (event.target.id).split('-');
			$.extend(true, aParam, {editAction: parseInt(aID[1])});
			interfaceFinancialBankAccountRecoItemsEdit(aParam);
		});
		
		if (iEditAction == 1)
		{
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table>';
			
			aHTML[++h] = '<tr id="trInterfaceMainItemsEditSearchDate">' +
							'<td id="tdInterfaceMainItemsEditDate" class="interfaceMain">' +
							'Date' +
							'</td></tr>' +
							'<tr id="trInterfaceMainItemsSearchDateValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainItemsSearchDateValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainItemsEditSearchDate" class="inputInterfaceMainDate">' +
							'</td></tr>';
				
			aHTML[++h] = '<tr id="trInterfaceMainItemsEditSearchAmount">' +
							'<td id="tdInterfaceMainItemsEditAmount" class="interfaceMain">' +
							'Amount' +
							'</td></tr>' +
							'<tr id="trInterfaceMainItemsSearchAmountValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainItemsSearchAmountValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainItemsEditSearchAmount" class="inputInterfaceMainText">' +
							'</td></tr>';
											
			aHTML[++h] = '<tr><td id="tdInterfaceMainRecoItemsEditSearch" class="interfaceMainAction">' +
							'<span style="width:100%" id="spanInterfaceMainRecoItemsEditSearch">Search</span>' +
							'</td></tr>';
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainBankAccountColumnRecoItemEdit2').html(aHTML.join(''));
		
			$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});
		
			if (dSearchDate) {$('#inputInterfaceMainItemsEditSearchDate').val(dSearchDate)}
			if (cSearchAmount) {$('#inputInterfaceMainItemsEditSearchAmount').val(cSearchAmount)}
				
			$('#spanInterfaceMainRecoItemsEditSearch').button( {
				label: 'Search',
				icons: {
					primary: "ui-icon-search"
				}
			})
			.click(function() {
				 //Search based on date and amount
			})
			
			$('#divInterfaceMainRecoItemsEdit').html(gsLoadingSmallXHTML);
		
			var oSearch = new AdvancedSearch();
		
			if (iType == 1)
			{
				oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
				oSearch.addField('reference,amount,paiddate,reconciliation');
				if (dSearchDate) {oSearch.addFilter('paiddate', 'GREATER_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-7).toString("dd-MMM-yyyy"))}
				oSearch.sort('paiddate', 'desc');
			}	
			else
			{
				oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
				oSearch.addField('reference,amount,receiveddate,reconciliation');
				if (dSearchDate) {oSearch.addFilter('receiveddate', 'GREATER_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-7).toString("dd-MMM-yyyy"))}
				oSearch.sort('receiveddate', 'desc');
			}
		
			if (cSearchAmount) {oSearch.addFilter('amount', 'APPROX_EQUAL_TO', cSearchAmount)}
			
			oSearch.addFilter('reconciliation', 'IS_NULL');
			oSearch.rows = giReturnRows;
			oSearch.getResults(function(data) {interfaceFinancialBankAccountRecoItemsEdit(aParam, data)});
		}
		else
		{
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table class="interfaceMain" style="width:190px;">';							
			
			aHTML[++h] = '<tr id="trInterfaceMainItemsEditDate" class="interfaceMain">' +
							'<td id="tdInterfaceMainItemsEditDate" class="interfaceMain">' +
							'Date' +
							'</td></tr>' +
							'<tr id="trInterfaceMainItemsEditDateValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainItemsEditDateValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainItemsEditDate" class="inputInterfaceMainDate">' +
							'</td></tr>';						
			
			aHTML[++h] = '<tr id="trInterfaceMainItemsEditContactBusiness" class="interfaceMain">' +
							'<td id="tdInterfaceMainItemsEditContactBusiness" class="interfaceMain">' +
							'Business' +
							'</td></tr>' +
							'<tr id="trInterfaceMainItemsEditContactBusinessValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceMainItemsEditContactBusinessValue" class="interfaceMainSelect">' +
							'<input id="inputInterfaceMainItemsEditContactBusiness" class="inputInterfaceMainSelect"' +
								' data-method="CONTACT_BUSINESS_SEARCH"' +
								' data-columns="tradename">' +
							'</td></tr>';
						
			aHTML[++h] = '<tr id="trInterfaceMainItemsEditContactPerson" class="interfaceMain">' +
							'<td id="tdInterfaceMainItemsEditContactPerson" class="interfaceMain">' +
							'Person' +
							'</td></tr>' +
							'<tr id="trInterfaceMainItemsEditContactPersonValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceMainItemsEditContactPersonValue" class="interfaceMainSelect">' +
							'<input id="inputInterfaceMainItemsEditContactPerson" class="inputInterfaceMainSelect"' +
								' data-method="CONTACT_PERSON_SEARCH"' +
								' data-columns="surname"' +
								' data-parent="inputInterfaceMainItemsEditContactBusiness"' +
								' data-parent-search-id="contactbusiness"' +
								' data-parent-search-text="tradename">' +
							'</td></tr>';		
		
			aHTML[++h] = '<tr id="trInterfaceMainItemsEditAmount" class="interfaceMain">' +
							'<td id="tdInterfaceMainItemsEditAmount" class="interfaceMain">' +
							'Amount' +
							'</td></tr>' +
							'<tr id="trInterfaceMainItemsEditAmountValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainItemsEditAmountValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainItemsEditAmount" class="inputInterfaceMainText">' +
							'</td></tr>';	
			
			aHTML[++h] = '<tr id="trInterfaceMainItemsEditDescription" class="interfaceMain">' +
						'<td id="tdInterfaceMainItemsEditDescription" class="interfaceMain">' +
						'Description' +
						'</td></tr>' +
						'<tr id="trInterfaceMainItemsEditDescriptionValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainItemsEditDescriptionValue" class="interfaceMainTextMulti">' +
						'<textarea rows="5" cols="35" id="inputInterfaceMainItemsEditDescription" class="inputInterfaceMainTextMultiSmall"></textarea>' +
						'</td></tr>';
														
			aHTML[++h] = '</table>';					
		
			$('#divInterfaceMainRecoItemsEdit').html(aHTML.join(''));
		
			$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});
		
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table>';
			
			aHTML[++h] = '<tr><td id="tdInterfaceMainRecoItemsEditSave" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainRecoItemsEditSave">Save</span>' +
							'</td></tr>';
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainBankAccountColumnRecoItemEdit2').html(aHTML.join(''));
		
			$('#spanInterfaceMainRecoItemsEditSave').button( {
				text: false,
				icons: {
					primary: "ui-icon-check"
				}
			})
			.click(function() {
				 //Save based on iType
			})
		}	
	}
	else
	{
		var aHTML = [];
		var h = -1;	
			
		aHTML[++h] = '<table style="margin-top:20px;">';
			
		aHTML[++h] = '<tr><td class="interfaceViewportControlSub">' +
						'No element selected.' +
						'<br /><br/ >Click the gear icon to set up automation (issue creation) for an element.' +
					'</td></tr>';

		aHTML[++h] = '</table>';		
		
		$('#tdInterfaceMainSetupStructureElementColumnElement2').html(aHTML.join(''));
			
		if (oActions != undefined)
		{	
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainSetupStructureElementColumn2" class="interfaceMainColumn2">';
			
			if (oActions.add)
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainFormStructureAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainSetupStructureAdd">Add</span>' +
							'</td></tr>';
			}
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSetupStructureElementColumnElement3').html(aHTML.join(''));
		
			$('#spanInterfaceMainSetupStructureAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				 interfaceMasterSetupStructureElementAdd(aParam);
			})
		}	
	
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableSetupStructureElement" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No items.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#divInterfaceMainRecoItemsEdit').html(aHTML.join(''));
		
		}
		else
		{
			aHTML[++h] = '<table id="tableRecoItems" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				if (this.paiddate)
				{				
					aHTML[++h] = '<td id="tdRecoItems_date-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect recoitempayment">' +
										this.paiddate + '</td>';
				}
				else
				{
					aHTML[++h] = '<td id="tdRecoItems_date-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect recoitemreceipt">' +
										this.receiveddate + '</td>';
				}							
				
				aHTML[++h] = '<td id="spanRecoItems_amount-' + this.id + '" style="text-align:right;" class="interfaceMainRow interfaceMainRowSelect recoitem">' +
										this.amount + '</td>';
				
										
				aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
					
				aHTML[++h] = '<span id="spanSetupStructureElement_options_view-' + this.id + '" class="interfaceMainRowOptionsItemAdd"></span>';
		
				aHTML[++h] = '</td>';
								
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#divInterfaceMainRecoItemsEdit').html(aHTML.join(''));
			
			$('.interfaceMainRowOptionsItemAdd').button( {
				text: false,
				icons: {
					primary: "ui-icon-check"
				}
			})
			.click(function() {
				//interfaceMasterSetupStructureElementRemove({xhtmlElementID: this.id});
			})
			.css('width', '15px')
			.css('height', '17px')
		}
	}	
}

function interfaceFinancialBankAccountImport(aParam, oResponse)
{
	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_SEARCH';
		oSearch.addField('startdate,enddate,processeddate');
		oSearch.addFilter('bankaccount', 'EQUAL_TO', giObjectContext);
		oSearch.sort('enddate', 'desc');
		oSearch.rows = giReturnRows;
		oSearch.getResults(function(data) {interfaceFinancialBankAccountImport(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainBankAccountImport" class="interfaceMain">' +
					'<tr id="trInterfaceMainBankAccountRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainBankAccountColumnImport1" style="width: 75px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumnImport2" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divInterfaceMainImport').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			
			aHTML[++h] = '<tr><td style="font-size:0.75em;"><span id="spanInterfaceBankAccountImportAdd">Add</span></td></tr>';

			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="trInterfaceFinancialHomeMostLikelyNothing">No existing imports.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
			
			$('#tdInterfaceMainBankAccountColumnImport1').html(aHTML.join(''));	
		}
		else
		{		
			aHTML[++h] = '<table id="tableImport" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
	
			var oRows = oResponse.data.rows;
			
			$(oRows).each(function(i) 
			{
				if (i==0)
				{
					aHTML[++h] = '<tr><td style="font-size:0.75em;"><span id="spanInterfaceBankAccountImportAdd">Add</span></td></tr>';
				}
				
				aHTML[++h] = interfaceFinancialBankAccountImportRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
			
			$('#tdInterfaceMainBankAccountColumnImport1').html(aHTML.join(''));
		}
			
		$('#spanInterfaceBankAccountImportAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			interfaceFinancialBankAccountImportAdd();
		})
		.css("width", "75px");
		
		$('.import').click(function()
		{
			var aID = (event.target.id).split('-');
			interfaceFinancialBankAccountImportTransactions({fileSource: aID[1]});
		});
	}
}

function interfaceFinancialBankAccountImportRow(oRow)
{
	var aHTML = [];
	var h = -1;

	if (oRow.processeddate != '')
	{
		aHTML[++h] = '<tr class="interfaceMainRow">';

		aHTML[++h] = '<td id="interfaceFinancialBankAccountImport_processeddate-' + oRow.id + '" class="interfaceMainRow interfaceMainRowSelect import"' +
								'">' + oRow.processeddate + '<br />';
							
		if (oRow.startdate != '')
		{		
			aHTML[++h] = '<span class="interfaceViewportControlSubContext" id="spanInterfaceFinancialBankAccountImport_enddate-' + oRow.id + '">' +
								oRow.startdate + '</span><br />';	
		}
	
		aHTML[++h] = '</tr>';
	}
		
	return aHTML.join('');
}

function interfaceFinancialBankAccountImportAdd(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'tdInterfaceMainBankAccountColumnImport21';
	var oOptions = {view: true, remove: true, automation: true};
	var oActions = {add: true};

	if (aParam != undefined)
	{
		if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
		if (aParam.options != undefined) {oOptions = aParam.options}
		if (aParam.actions != undefined) {oActions = aParam.actions}
	}		
		
	if (oResponse == undefined)
	{	
		var aHTML = [];
		var h = -1;
		
	//	aHTML[++h] = '<table>';
			
	//	aHTML[++h] = '<tr><td>';
							
		aHTML[++h] = interfaceMasterAttachmentsUpload(
						{	
							object: 28,
							objectContext: -1,
							label: ''
						});
		
	//	aHTML[++h] = '</td></tr>';
		
	//	aHTML[++h] = '<tr><td id="tdInterfaceMainPostDetailsSend" class="interfaceMainAction">' +
	//					'<span id="spanInterfaceMainBankAccountImportUpload">Upload</span>' +
	//					'</td></tr>';
								
	//	aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainBankAccountColumnImport2').html(aHTML.join(''));
		
		$('#spanInterfaceMainUpload').button(
		{
			label: "Upload Bank File"
		})
		.click(function()
		{
			if ($('#oFile0').val() == '')
			{
				interfaceMasterError("Need to select a file.");
			}
			else
			{
				var sData = 'processeddate=' + Date.today().toString("dd-MMM-yyyy");
				sData += '&bankaccount=' + giObjectContext;
				
				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/financial/?method=FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_MANAGE',
					data: sData,
					dataType: 'json',
					success: function(data) {
						interfaceFinancialBankAccountImportAdd(aParam, data);
					}
				});
			}
		});
	}
	else
	{
		if (oResponse.status == 'OK')
		{
			$('#objectcontext').val(oResponse.id);	
			interfaceMasterAttachmentsUploadProcess({functionPostUpdate: interfaceFinancialBankAccountImportAddProcess});
		}	
	}	
}

function interfaceFinancialBankAccountImportAddProcess(oResponse)
{
	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'CORE_ATTACHMENT_SEARCH';
		oSearch.addField('type,filename,description,download,modifieddate');
		oSearch.addFilter('object', 'EQUAL_TO', 28);
		oSearch.addFilter('objectcontext', 'EQUAL_TO', $('#objectcontext').val());
		oSearch.getResults(function(data) {interfaceFinancialBankAccountImportAddProcess(data)});
	}
	else
	{
		if (oResponse.data.rows.length !=0)
		{	
			var sData = 'id=' + oResponse.data.rows[0].id;
	
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/financial/?method=FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_PROCESS',
				data: sData,
				dataType: 'json',
				success: function(data) {
					alert("done");
				}
			});	
		}
	}	
}
