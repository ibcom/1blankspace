function interfaceFinancialPayrollMasterViewport(aParam)
{
	interfaceFinancialMasterInitialise();
	
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}

	giObject = -1;
	goObjectContext = undefined;
	gsObjectName = 'Payroll';
	giObjectContext = -1;
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialPayrollMasterViewport({showHome: true});',
			move: false
			})		
	}	
			
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Payroll"
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
	if (bShowHome) {interfaceFinancialPayrollHomeShow()};	
}

function interfaceFinancialPayrollHomeShow(aParam, oResponse)
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
		oSearch.method = 'FINANCIAL_Payroll_REPORT_SEARCH';
		//oSearch.addField('Payrollstartdate,enddate,Payrollofficereference,statustext');
		oSearch.addField('*')
		oSearch.rows = 10;
		oSearch.sort('enddate', 'desc');
		oSearch.getResults(function(data){interfaceFinancialPayrollHomeShow(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableFinancialPayroll" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
		aHTML[++h] = '<tbody>'
	
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialPayrollHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialPayrollHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialPayrollHomeMostLikelyNothing">Click New to create a invoice.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{	
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
						
				aHTML[++h] = '<td id="tdPayroll_title-' + this.id + '" class="interfaceHomeMostLikely" style="width:150px;">' +
										this["enddate"] + '</td>';
				
				aHTML[++h] = '<td id="interfacePayroll_lastreconcileddate-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:90px;">' +
											this.statustext + '</td>';
													
				aHTML[++h] = '<td id="interfacePayroll_lastreconciledamount-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:90px;">' +
											this.Payrollofficereference + '</td>';
			
				aHTML[++h] = '<td>&nbsp;</td>';																	
				aHTML[++h] = '</tr>';
			});
	
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceMainItemColumn1').html(aHTML.join(''));
	
		$('#divInterfaceMain').html(aHTML.join(''));

		$('.interfaceHomeMostLikely').click(function(event) {
			interfaceFinancialPayrollSearch(event.target.id, {source: 1});
		});
	}	
}


function interfaceFinancialPayrollSearch(sXHTMLElementId, aParam)
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
		oSearch.method = 'FINANCIAL_Payroll_REPORT_SEARCH';
		oSearch.addField('*');
		oSearch.rf = 'json';
		oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
		
		oSearch.getResults(function(data) {interfaceFinancialPayrollShow(aParam, data)});
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
			oSearch.addField('enddate,Payrollofficereference');
			oSearch.addFilter('Payrollofficereference', 'STRING_IS_LIKE', sSearchText);
			
			oSearch.getResults(function(data) {interfaceFinancialPayrollSearchShow(aParam, data)});	
		}
	};	
}

function interfaceFinancialPayrollSearchShow(aParam, oResponse)
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
							this.enddate + ' - ' + this.Payrollofficereference +
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
			interfaceFinancialPayrollSearch(event.target.id, {source: 1});
		});
	}		
}

function interfaceFinancialPayrollViewport()
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
		interfaceFinancialPayrollSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceFinancialPayrollDetails();
	});
	
	$('#tdInterfaceViewportControlReporting').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainReport", true);
		interfaceFinancialPayrollReport();
	});
}

function interfaceFinancialPayrollShow(aParam, oResponse)
{	
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceFinancialPayrollViewport();
		
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
			
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this Payroll report.</td></tr>';
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
			newDestination: 'interfaceFinancialPayrollMasterViewport({showHome: false});interfaceFinancialPayrollSearch("-' + giObjectContext + '")',
			move: false
			})
	
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceFinancialPayrollSummary()'});
	}		
}	

function interfaceFinancialPayrollSummary(aParam, oResponse)
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
					'This Payroll report was last updated on the ' + goObjectContext.modifieddate + '.' +
					'</td></tr>';			
	
	aHTML[++h] = '</table>';					

	$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));		
}

function interfaceFinancialPayrollReport()
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMainPayroll" class="interfaceMain">' +
				'<tr id="trInterfaceMainPayrollRow1" class="interfaceMainRow1">' +
				'<td id="tdInterfaceMainPayrollColumnReportCategory" style="width: 120px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
				gsLoadingXHTML +
				'</td>' +
				'<td id="tdInterfaceMainPayrollColumnReportType" style="width: 125px;padding-right:5px;" class="interfaceMainColumn2">' +
				'</td>' +
				'<td id="tdInterfaceMainPayrollColumnReportItem" class="interfaceMainColumn2">' +
				'</td>' +
				'</tr>' +
				'</table>';				
	
	$('#divInterfaceMainReport').html(aHTML.join(''));
				
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="interfaceMainPayrollColumnCategory" style="width: 110px;margin-bottom:3px;">';
	aHTML[++h] = '<input style="width: 115px;" type="radio" id="interfaceMainPayrollColumnCategory-revenue" name="radioCategory" checked="checked" /><label for="interfaceMainPayrollColumnCategory-revenue" style="width: 115px;">Supplies (In)</label>';
	aHTML[++h] = '<input style="width: 115px;"  type="radio" id="interfaceMainPayrollColumnCategory-expense" name="radioCategory" /><label for="interfaceMainPayrollColumnCategory-expense" style="width: 115px;">Aquisitions (Out)</label>';
	aHTML[++h] = '</div>';

	$('#tdInterfaceMainPayrollColumnReportCategory').html(aHTML.join(''));			
		
	$('#interfaceMainPayrollColumnCategory').buttonset().css('font-size', '0.875em');
			
	$('#interfaceMainPayrollColumnCategory :radio').click(function()
	{
		var aID = (event.target.id).split('-');
		interfaceFinancialPayrollReportSummary({category: aID[1]});	
	});
	
	interfaceFinancialPayrollReportSummary();
}

function interfaceFinancialPayrollReportSummary(aParam)	
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
	
	$('#tdInterfaceMainPayrollColumnReportType').html(gsLoadingSmallXHTML);
	
	var aHTML = [];
	var h = -1;
	var sField;
		
	aHTML[++h] = '<table id="tableReco" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
	aHTML[++h] = '<tbody>';
	
	$.each(ns1blankspace.financial.reportsummary[sCategory], function()
	{
		sField = (this).toUpperCase();
		
		aHTML[++h] = '<tr class="interfaceMainRow">';
						
		aHTML[++h] = '<td id="tdBankAccount_type-' + sField + '" class="interfaceMainRow interfaceMainRowSelect type" style="width:150px;">' +
								sField + '</td>';
				
		aHTML[++h] = '<td id="interfaceBankAccount_amount-' + sField + '" class="interfaceMainRow interfaceMainRowSelect type" style="width:90px;text-align:right;">' +
									'$' + goObjectContext[this] + '</td>';
																													
		aHTML[++h] = '</tr>';
	});

	aHTML[++h] = '</tbody></table>';
	
	$('#tdInterfaceMainPayrollColumnReportType').html(aHTML.join(''));
	
	$('.type').click(function()
	{
		var aID = (event.target.id).split('-');
		interfaceFinancialPayrollReportItems({field: aID[1]});
	});
}

function interfaceFinancialPayrollReportItems(aParam, oResponse)
{
	var iStep = 1;
	var iType = 1;
	var iSubType = 1;
	var sField = 'G1';
	
	if (aParam != undefined)
	{
		if (aParam.step != undefined) {iStep = aParam.step}
		if (aParam.type != undefined) {iType = aParam.type}
		if (aParam.subType != undefined) {iSubType = aParam.subType}
		if (aParam.field != undefined) {sField = aParam.field}
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
	
		aHTML[++h] = '<table id="tableInterfaceMainPayroll" class="interfaceMain">' +
					'<tr id="trInterfaceMainPayrollRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainPayrollColumnReportItemSubType" style="width: 120px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainPayrollColumnReportItems" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';				
	
		$('#tdInterfaceMainPayrollColumnReportItem').html(aHTML.join(''));
				
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<div id="interfaceMainPayrollColumnSubType" style="width: 115px;margin-bottom:3px;">';
	
		aHTML[++h] = '<input style="width: 115px;" type="radio" id="interfaceMainPayrollColumnSubType-1" name="radioSubType" checked="checked" /><label for="interfaceMainPayrollColumnSubType-1" style="width: 115px;">Standard</label>';
	
		aHTML[++h] = '<input style="width: 115px;"  type="radio" id="interfaceMainPayrollColumnSubType-2" name="radioSubType" /><label for="interfaceMainPayrollColumnSubType-2" style="width: 115px;">Credit Notes</label>';
	
		aHTML[++h] = '<input style="width: 115px;"  type="radio" id="interfaceMainPayrollColumnSubType-3" name="radioSubType" /><label for="interfaceMainPayrollColumnSubType-3" style="width: 115px;">General Jounals (+ve)</label>';
	
		aHTML[++h] = '<input style="width: 115px;"  type="radio" id="interfaceMainPayrollColumnSubType-4" name="radioSubType" /><label for="interfaceMainPayrollColumnSubType-4" style="width: 115px;">General Jounals (-ve)</label>';
		
		aHTML[++h] = '</div>';

		$('#tdInterfaceMainPayrollColumnReportItemSubType').html(aHTML.join(''));			
		
		$('#interfaceMainPayrollColumnSubType').buttonset().css('font-size', '0.875em');
			
		$('#interfaceMainPayrollColumnSubType :radio').click(function()
		{
			var aID = (event.target.id).split('-');
			$.extend(true, aParam, {subType: aID[1], step: 2});
			interfaceFinancialPayrollReportItems(aParam);	
		});
		
		interfaceFinancialPayrollReportItems(aParam);
	}
	
	if (iStep == 2)
	{
		$.extend(true, aParam, {step: 3});
		
		var sData = 'id=' + giObjectContext +
					'&type=' + iType +
					'&subtype=' + iSubType +
					'&field=' + sField;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/financial/?method=FINANCIAL_Payroll_REPORT_ITEM_SEARCH',
			data: sData,
			dataType: 'json',
			success: function(data) {
				interfaceFinancialPayrollReportItems(aParam, data)
			}
		});
	}
	
	if (iStep == 3)
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableReportItems" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
		aHTML[++h] = '<tbody>'
		
		$.each(oResponse.data.rows, function()
		{
			aHTML[++h] = '<tr class="interfaceMainRow">';
							
			aHTML[++h] = '<td id="tdReportItems_reference-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect">' +
									this.reference + '</td>';
		
			aHTML[++h] = '<td id="spanReportItems_amount-' + this.id + '" style="text-align:right;" class="interfaceMainRow interfaceMainRowSelect">' +
									this.amount + '</td>';
			
			aHTML[++h] = '<td id="spanReportItems_Payroll-' + this.id + '" style="text-align:right;" class="interfaceMainRow interfaceMainRowSelect">' +
									this.gst + '</td>';
							
			aHTML[++h] = '</tr>';
		});
		
		aHTML[++h] = '</tbody></table>';

		$('#tdInterfaceMainPayrollColumnReportItems').html(aHTML.join(''));
	}	
}

function interfaceFinancialPayrollDetails(aParam)
{	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table class="interfaceMain" cellspacing=0 cellpadding=0>' +
			'<tr>' +
			'<td id="tdInterfaceMainDetails" style="padding-right:15px;width:200px;">' +
			'</td>' +
			'<td id="tdInterfaceMainDetails2" class="interfaceMainColumn2x">&nbsp;' +
			'</td>' +
			'</tr>' +
			'</table>';			

	$('#divInterfaceMainDetails').html(aHTML.join(''));
		
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<table class="interfaceMain">';
			
	aHTML[++h] = '<tr id="trInterfaceMainFinancialBanksAccountRecoStatementDate" class="interfaceMain">' +
					'<td id="tdInterfaceMainFinancialBanksAccountRecoStatementDate" class="interfaceMain">' +
					'End Date' +
					'</td></tr>' +
					'<tr id="trInterfaceMainFinancialBanksAccountRecoStatementDateValue" class="interfaceMainText">' +
					'<td id="tdInterfaceMainFinancialBanksAccountRecoStatementDateValue" class="interfaceMainText">' +
					'<input id="inputInterfaceMainFinancialBanksAccountRecoStatementDate" class="inputInterfaceMainDate">' +
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
	
	$('#tdInterfaceMainDetails').html(aHTML.join(''));
	
	$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});
}