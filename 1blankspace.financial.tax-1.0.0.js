function interfaceFinancialTaxMasterViewport(aParam)
{
	interfaceFinancialMasterInitialise();
	
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}

	giObject = -1;
	goObjectContext = undefined;
	gsObjectName = 'Tax';
	giObjectContext = -1;
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialTaxMasterViewport({showHome: true});',
			move: false
			})		
	}	
			
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Tax"
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
	if (bShowHome) {interfaceFinancialTaxHomeShow()};	
}

function interfaceFinancialTaxHomeShow(aParam, oResponse)
{		
	if (oResponse == undefined)
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
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_TAX_REPORT_SEARCH';
		//oSearch.addField('taxstartdate,enddate,taxofficereference,statustext');
		oSearch.addField('*')
		oSearch.rows = 10;
		oSearch.sort('enddate', 'desc');
		oSearch.getResults(function(data){interfaceFinancialTaxHomeShow(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableFinancialTax" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
		aHTML[++h] = '<tbody>'
	
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialTaxHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialTaxHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialTaxHomeMostLikelyNothing">Click New to create a invoice.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{	
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
						
				aHTML[++h] = '<td id="tdTax_title-' + this.id + '" class="interfaceHomeMostLikely" style="width:150px;">' +
										this["enddate"] + '</td>';
				
				aHTML[++h] = '<td id="interfaceTax_lastreconcileddate-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:90px;">' +
											this.statustext + '</td>';
													
				aHTML[++h] = '<td id="interfaceTax_lastreconciledamount-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:90px;">' +
											this.taxofficereference + '</td>';
			
				aHTML[++h] = '<td>&nbsp;</td>';																	
				aHTML[++h] = '</tr>';
			});
	
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceMainItemColumn1').html(aHTML.join(''));
	
		$('#divInterfaceMain').html(aHTML.join(''));

		$('.interfaceHomeMostLikely').click(function(event) {
			interfaceFinancialTaxSearch(event.target.id, {source: 1});
		});
	}	
}


function interfaceFinancialTaxSearch(sXHTMLElementId, aParam)
{
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	var iMinimumLength = 3;
	var iSource = giSearchSource_TEXT_INPUT;
	var sSearchText;
	var iMaximumColumns = 1;
	var iRows = 10;
	
	if (aParam != undefined)
	{
		if (aParam.source != undefined) {iSource = aParam.source}
		if (aParam.searchText != undefined) {sSearchText = aParam.searchText}
		if (aParam.rows != undefined) {iRows = aParam.rows}
		if (aParam.searchContext != undefined) {sSearchContext = aParam.searchContext}
		if (aParam.minimumLength != undefined) {iMinimumLength = aParam.minimumLength}
		if (aParam.maximumColumns != undefined) {iMaximumColumns = aParam.maximumColumns}
	}
	
	if (sSearchContext != undefined  && iSource != giSearchSource_BROWSE)
	{
		$('#divInterfaceViewportControl').html(gsLoadingXHTML);
		
		giObjectContext = sSearchContext;
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_TAX_REPORT_SEARCH';
		oSearch.addField('*');
		oSearch.rf = 'json';
		oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
		
		oSearch.getResults(function(data) {interfaceFinancialTaxShow(aParam, data)});
	}
	else
	{
		if (sSearchText == undefined)
		{
			sSearchText = $('#inputInterfaceMasterViewportControlSearch').val();
		}	
		
		if (iSource == giSearchSource_BROWSE)
		{
			iMinimumLength = 1;
			iMaximumColumns = 4;
			var aSearch = sSearch.split('-');
			sSearchText = aSearch[1];
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == giSearchSource_BROWSE)
		{
			interfaceMasterOptionsSetPosition(sElementId);
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
			oSearch.addField('enddate,taxofficereference');
			oSearch.addFilter('taxofficereference', 'STRING_IS_LIKE', sSearchText);
			
			oSearch.getResults(function(data) {interfaceFinancialTaxSearchShow(aParam, data)});	
		}
	};	
}

function interfaceFinancialTaxSearchShow(aParam, oResponse)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	if (oResponse.data.rows.length == 0)
	{
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
		
			aHTML[++h] = '<td class="interfaceSearch" id="' + +
							'-' + this.id + '">' +
							this.enddate + ' - ' + this.taxofficereference +
							'</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		});
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceFinancialTaxSearch(event.target.id, {source: 1});
		});
	}		
}

function interfaceFinancialTaxViewport()
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
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlItem" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlReporting" class="interfaceViewportControl">Report</td>' +
					'</tr>';

	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainContext" class="divInterfaceViewportMainContext"></div>';
	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainReport" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceFinancialTaxSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceFinancialTaxDetails();
	});
	
	$('#tdInterfaceViewportControlReporting').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainReport", true);
		interfaceFinancialTaxReport();
	});
}

function interfaceFinancialTaxShow(aParam, oResponse)
{	
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceFinancialTaxViewport();
		
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
			
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this tax report.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
			
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
			
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
			
		$('#divInterfaceViewportControlContext').html(goObjectContext.enddate+
			'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_status">' + goObjectContext.statustext + '</span>');
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialTaxMasterViewport({showHome: false});interfaceFinancialTaxShow("-' + giObjectContext + '")',
			move: false
			})
	
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceFinancialTaxSummary()'});
	}		
}	

function interfaceFinancialTaxSummary(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
	aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
				'<td id="tdInterfaceMainSummaryColumn1Large" class="interfaceMainColumn1Large">' +
					'</td>' +
					'<td id="tdInterfaceMainSummaryColumn2Action" style="width:400px;" class="interfaceMainColumn2x">' +
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';				

	$('#divInterfaceMainSummary').html(aHTML.join(''));	

	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
					
	aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTotalAmount" class="interfaceMainSummary"></td></tr>' +
					'<tr><td id="tdInterfaceMainSummaryTotalAmountValue" class="interfaceMainSummaryValue">' +
					'This tax report was last updated on the ' + goObjectContext.modifieddate + '.' +
					'</td></tr>';			
	
	aHTML[++h] = '</table>';					

	$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));		
}

function interfaceFinancialTaxReport()
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMainTax" class="interfaceMain">' +
				'<tr id="trInterfaceMainTaxRow1" class="interfaceMainRow1">' +
				'<td id="tdInterfaceMainTaxColumnReportCategory" style="width: 120px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
				gsLoadingXHTML +
				'</td>' +
				'<td id="tdInterfaceMainTaxColumnReportType" style="width: 85px;padding-right:5px;" class="interfaceMainColumn2">' +
				'</td>' +
				'<td id="tdInterfaceMainTaxColumnReportItem" class="interfaceMainColumn2">' +
				'</td>' +
				'</tr>' +
				'</table>';				
	
	$('#divInterfaceMainReport').html(aHTML.join(''));
				
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="interfaceMainTaxColumnCategory" style="width: 110px;margin-bottom:3px;">';
	aHTML[++h] = '<input style="width: 115px;" type="radio" id="interfaceMainTaxColumnCategory-revenue" name="radioCategory" checked="checked" /><label for="interfaceMainTaxColumnCategory-revenue" style="width: 115px;">Supplies (In)</label>';
	aHTML[++h] = '<input style="width: 115px;"  type="radio" id="interfaceMainTaxColumnCategory-expense" name="radioCategory" /><label for="interfaceMainTaxColumnCategory-expense" style="width: 115px;">Aquisitions (Out)</label>';
	aHTML[++h] = '</div>';

	$('#tdInterfaceMainTaxColumnReportCategory').html(aHTML.join(''));			
		
	$('#interfaceMainTaxColumnCategory').buttonset().css('font-size', '0.875em');
			
	$('#interfaceMainTaxColumnCategory :radio').click(function()
	{
		var aID = (event.target.id).split('-');
		interfaceFinancialTaxReportSummary({category: aID[1]});	
	});
	
	interfaceFinancialTaxReportSummary();
}

function interfaceFinancialTaxReportSummary(aParam)	
{	
	var sCategory = "revenue";
					
	ns1blankspace.financial.reportsummary = {
		"revenue": ["g1","g2","g3","g4","g5","g6","g7","g8","g9"],
		"expense": ["g10","g11","g12","g13","g14","g15","g16","g17","g18","g21"],
		"payroll": ["w1","w2"],
		"instalments": ["t1","t2","t3","t7","t9"]
	};
	
	if (aParam != undefined)
	{
		if (aParam.category != undefined) {sCategory = aParam.category}
	}
	
	$('#tdInterfaceMainTaxColumnReportType').html(gsLoadingSmallXHTML);
	
	var aHTML = [];
	var h = -1;
		
	aHTML[++h] = '<table id="tableReco" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
	aHTML[++h] = '<tbody>';
	
	$.each(ns1blankspace.financial.reportsummary[sCategory], function()
	{
		aHTML[++h] = '<tr class="interfaceMainRow">';
						
		aHTML[++h] = '<td id="tdBankAccount_type-' + this + '" class="interfaceMainRow interfaceMainRowSelect type" style="width:150px;">' +
								this + '</td>';
				
		aHTML[++h] = '<td id="interfaceBankAccount_amount-' + this + '" class="interfaceMainRow interfaceMainRowSelect type" style="width:90px;text-align:right;">' +
									'$' + goObjectContext[this] + '</td>';
																													
		aHTML[++h] = '</tr>';
	});

	aHTML[++h] = '</tbody></table>';
	
	$('#tdInterfaceMainTaxColumnReportType').html(aHTML.join(''));
	
	$('.type').click(function()
	{
		var aID = (event.target.id).split('-');
		interfaceFinancialTaxReportItems({item: aID[1]});
	});
}

function interfaceFinancialTaxReportItems(aParam)
{
	var iStep = 1;
	
	if (aParam != undefined)
	{
		if (aParam.step != undefined) {iStep = aParam.step}
	}
	else
	{
		aParam = {};
	}
	
	if (iStep == 1)
	{
		$.extend(true, aParam, {step: 2});
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainTax" class="interfaceMain">' +
					'<tr id="trInterfaceMainTaxRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainTaxColumnReportItemSubType" style="width: 120px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainTaxColumnReportItems" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';				
	
		$('#tdInterfaceMainTaxColumnReportItem').html(aHTML.join(''));
				
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<div id="interfaceMainTaxColumnSubType" style="width: 110px;margin-bottom:3px;">';
	
		aHTML[++h] = '<input style="width: 115px;" type="radio" id="interfaceMainTaxColumnSubType-1" name="radioSubType" checked="checked" /><label for="interfaceMainTaxColumnSubType-1" style="width: 115px;">Standard</label>';
	
		aHTML[++h] = '<input style="width: 115px;"  type="radio" id="interfaceMainTaxColumnSubType-2" name="radioSubType" /><label for="interfaceMainTaxColumnSubType-2" style="width: 115px;">Credit Notes</label>';
	
		aHTML[++h] = '<input style="width: 115px;"  type="radio" id="interfaceMainTaxColumnSubType-3" name="radioSubType" /><label for="interfaceMainTaxColumnSubType-3" style="width: 115px;">General Jounals (+ve)</label>';
	
		aHTML[++h] = '<input style="width: 115px;"  type="radio" id="interfaceMainTaxColumnSubType-4" name="radioSubType" /><label for="interfaceMainTaxColumnSubType-4" style="width: 115px;">General Jounals (-ve)</label>';
		
		aHTML[++h] = '</div>';

		$('#tdInterfaceMainTaxColumnReportItemSubType').html(aHTML.join(''));			
		
		$('#interfaceMainTaxColumnSubType').buttonset().css('font-size', '0.875em');
			
		$('#interfaceMainTaxColumnSubType :radio').click(function()
		{
			var aID = (event.target.id).split('-');
			$.extend(true, aParam, {subType: aID[1]});
			interfaceFinancialTaxReportItems(aParam);	
		});
	}
	
	if (iStep == 2)
	{
		$.extend(true, aParam, {step: 3});
		oSearch.method = 'FINANCIAL_TAX_REPORT_ITEM_SEARCH';
		oSearch.addField('description,amount,gst');
		oSearch.sort('transactiondate', 'desc');
		oSearch.addFilter('id', 'EQUAL_TO', giObjectContext);
		oSearch.addFilter('type', 'EQUAL_TO', iType);
		oSearch.addFilter('subtype', 'EQUAL_TO', iSubType);
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceFinancialBankAccountRecoItems(aParam, data)});
		
	//interfaceFinancialTaxReportItems();
	}
}

function interfaceFinancialTaxDetails(aParam, oResponse)
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
				'<td id="tdInterfaceMainTaxColumnRecoEdit" style="padding-right:15px;">' +
				'</td>' +
				'<td id="tdInterfaceMainTaxColumnRecoEdit2" class="interfaceMainColumn2" style="width: 250px">' +
				'</td>' +
				'</tr>' +
				'</table>';			
	
		$('#tdInterfaceMainTaxColumnReco2').html(aHTML.join(''));
			
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
		
		$('#tdInterfaceMainTaxColumnRecoEdit').html(aHTML.join(''));
		
		$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});
			
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em;">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainTaxColumnRecoEditSave">Save</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainTaxColumnRecoEdit2').html(aHTML.join(''));
		
		$('#spanInterfaceMainTaxColumnRecoEditSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			interfaceMasterStatusWorking();
					
			var sData = 'Tax=' + giObjectContext;
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
					interfaceFinancialTaxReconcile();
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
				success: function(data) {interfaceFinancialTaxRecoEdit(aParam, data)}
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