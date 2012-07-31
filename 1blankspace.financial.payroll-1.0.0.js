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
		
		aHTML[++h] = '<table>';
		
		aHTML[++h] = '<tr id="trInterfaceViewportControlPayRuns" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlPayRuns" class="interfaceViewportControl interfaceViewportControlHighlight">Pay Runs</td>' +
						'</tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportControlEmployees" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlEmployees" class="interfaceViewportControl">Employees</td>' +
						'</tr>';	
							
		aHTML[++h] = '</table>';
	
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#tdInterfaceViewportControlPayRuns').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMainPayRun");
			interfaceFinancialPayrollHomeShow();
		});
	
		$('#tdInterfaceViewportControlEmployees').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMainEmployee");
			interfaceFinancialPayrollEmployees();
		});
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<div id="divInterfaceMainPayRun" class="divInterfaceViewportMain"></div>';
		aHTML[++h] = '<div id="divInterfaceMainEmployee" class="divInterfaceViewportMain"></div>';
	
		$('#divInterfaceMain').html(aHTML.join(''));
	
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_PAYROLL_SEARCH';
		//oSearch.addField('startdate,enddate,statustext');
		oSearch.addField('*')
		oSearch.rows = 10;
		oSearch.sort('enddate', 'desc');
		//oSearch.getResults(function(data){interfaceFinancialPayrollHomeShow(aParam, data)});
		var oData = {
					"status": "OK","notes": "RETURNED","data": {"rows":
					[
						{
							"startdate": "01 Jul 2012",
							"enddate": "15 Jul 2012",
							"statustext": "Completed"
						},
						{
							"startdate": "15 Jun 2012",
							"enddate": "30 Jun 2012",
							"statustext": "Completed"
						}
					]
				}}
				
		interfaceFinancialPayrollHomeShow(aParam, oData)				
	}
	else
	{
		var aHTML = [];
		var h = -1;

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
			aHTML[++h] = '<table id="tableFinancialPayroll" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
		
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
						
				aHTML[++h] = '<td id="tdPayroll_enddate-' + this.id + '" class="interfaceHomeMostLikely" style="width:150px;">' +
										this["enddate"] + '</td>';
				
				aHTML[++h] = '<td id="interfacePayroll_lastreconcileddate-' + this.id + '" class="interfaceHomeMostLikelySub">' +
											this.statustext + '</td>';
																			
				aHTML[++h] = '</tr>';
			});
	
			aHTML[++h] = '</tbody></table>';
		}
	
		$('#divInterfaceMainPayRun').html(aHTML.join(''));

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

function interfaceFinancialPayrollEmployees(aParam, oResponse)
{
	
	var iStep = 1;
	var iEmployee;
	
	if (aParam != undefined)
	{
		if (aParam.step != undefined) {iStep = aParam.step};
		if (aParam.employee != undefined) {iEmployee = aParam.employee};
	}
	else
	{
		aParam = {};
	}
	
	if (iStep == 1)	
	{
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table class="interfaceMainAccount" cellspacing=0 cellpadding=0>' +
				'<tr id="trInterfaceMainPayrollEmployeeRow1" class="interfaceMainRow1">' +
				'<td id="tdInterfaceMainPayrollEmployeeColumn1" style="width:100px;font-size:0.75em;">' +
				'</td>' +
				'<td id="tdInterfaceMainPayrollEmployeeColumn2" class="interfaceMainColumn2">' +
				'</td>' +
				'</tr>' +
				'</table>';			
		
		$('#divInterfaceMainEmployee').html(aHTML.join(''));
		
		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
			oSearch.addField('contactpersontext,employmentstartdate');
			oSearch.rows = 50;
			oSearch.sort('contactpersontext', 'asc');
			oSearch.getResults(function(data) {interfaceFinancialPayrollEmployees(aParam, data)});
		}
		else
		{
			var aHTML = [];
			var h = -1;
		
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
				aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
				aHTML[++h] = '<td class="tdInterfaceFinancialHomeMostLikelyNothing">No employees set up.</td>';
				aHTML[++h] = '</tr>';
				aHTML[++h] = '</table>';
			}
			else
			{
				aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			
				aHTML[++h] = '<table id="tablePayrollEmployees" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
				aHTML[++h] = '<tbody>'
			
				var oRows = oResponse.data.rows;
			
				$(oRows).each(function() 
				{
					aHTML[++h] = interfaceFinancialPayrollEmployeesRow(this);
				});
			
				aHTML[++h] = '</tbody></table>';
			}
		
			interfaceMasterPaginationList(
			{
				type: 'JSON',
				xhtmlElementID: 'tdInterfaceMainPayrollEmployeeColumn1',
				xhtmlContext: 'PayrollEmployees',
				xhtml: aHTML.join(''),
				showMore: (oResponse.morerows == "true"),
				more: oResponse.moreid,
				rows: 50,
				functionShowRow: interfaceFinancialPayrollEmployeesRow,
				functionOpen: undefined,
				functionNewPage: ''
		   	}); 
			
			$('.employee').click(function() {
				$('.Highlight').removeClass('Highlight');
				$('#' + event.target.id).addClass('Highlight');
				var aID = (event.target.id).split('-');
				$.extend(true, aParam, {step: 2, employee: parseInt(aID[1])});
				interfaceFinancialPayrollEmployees(aParam);
			});	
		}
	}
	
	if (iStep == 2)
	{
		if (oResponse == undefined)
		{
			$('#tdInterfaceMainPayrollEmployeeColumn2').html(gsLoadingSmallXHTML);
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
			oSearch.addField('*');
			oSearch.rows = 50;
			oSearch.addFilter('id', 'EQUAL_TO', iEmployee);
			oSearch.getResults(function(data) {interfaceFinancialPayrollEmployees(aParam, data)});
		}
		else
		{
			ns1blankspace.financial.employee = oResponse.data.rows[0];
		
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table class="interfaceMainPayrollEmployeeDetails" cellspacing=0 cellpadding=0>' +
					'<tr id="trInterfaceMainPayrollEmployeeDetailsRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainPayrollEmployeeDetailsColumn1" style="width:100px;font-size:0.75em;">' +
					'</td>' +
					'<td id="tdInterfaceMainPayrollEmployeeDetailsColumn2" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';			
		
			$('#tdInterfaceMainPayrollEmployeeColumn2').html(aHTML.join(''));
			
			var aHTML = [];
			var h = -1;

			aHTML[++h] = '<div id="interfaceMainPayrollEmployeeDetails" style="width: 125px;margin-bottom:3px;text-align:right;">';
			aHTML[++h] = '<input type="radio" id="interfaceMainPayrollEmployeeDetails-11" name="radioDetails" /><label for="interfaceMainPayrollEmployeeDetails-11" style="width: 125px;text-align:left;">Details</label>';

			aHTML[++h] = '<input type="radio" id="interfaceMainPayrollEmployeeDetails-12" name="radioDetails" /><label for="interfaceMainPayrollEmployeeDetails-12" style="width: 125px;text-align:left;">Payroll</label>';
	
			aHTML[++h] = '<input type="radio" id="interfaceMainPayrollEmployeeDetails-13" name="radioDetails" /><label for="interfaceMainPayrollEmployeeDetails-13" style="width: 125px;text-align:left;">Pay Rates</label>';
	
			aHTML[++h] = '<input type="radio" id="interfaceMainPayrollEmployeeDetails-14" name="radioDetails" /><label for="interfaceMainPayrollEmployeeDetails-14" style="width: 125px;text-align:left;">Bank&nbsp;Accounts</label>';
		
			aHTML[++h] = '<input type="radio" id="interfaceMainPayrollEmployeeDetails-15" name="radioDetails" /><label for="interfaceMainPayrollEmployeeDetails-15" style="width: 125px;text-align:left;">Superannuation</label>';
			
			aHTML[++h] = '<input type="radio" id="interfaceMainPayrollEmployeeDetails-16" name="radioDetails" /><label for="interfaceMainPayrollEmployeeDetails-16" style="width: 125px;text-align:left;">Leave</label>';
			
			aHTML[++h] = '<input type="radio" id="interfaceMainPayrollEmployeeDetails-17" name="radioDetails" /><label for="interfaceMainPayrollEmployeeDetails-17" style="width: 125px;text-align:left;">Role</label>';
				
			aHTML[++h] = '<input type="radio" id="interfaceMainPayrollEmployeeDetails-18" name="radioDetails" /><label for="interfaceMainPayrollEmployeeDetails-18" style="width: 125px;text-align:left;">Induction</label>';
				
			aHTML[++h] = '</div>';

			$('#tdInterfaceMainPayrollEmployeeDetailsColumn1').html(aHTML.join(''));
	
			$('#interfaceMainPayrollEmployeeDetails').buttonset().css('font-size', '0.8em');
		
			$('#interfaceMainPayrollEmployeeDetails :radio').click(function()
			{
				var aID = (event.target.id).split('-');
				$.extend(true, aParam, {step: parseInt(aID[1])});
				interfaceFinancialPayrollEmployees(aParam);
			});
		}
	}
	
	if (iStep == 11)
	{
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainEmployeeDetails" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainEmployeeDetailsStatus" class="interfaceMain">' +
						'<td id="tdInterfaceMainEmployeeDetailsStatus" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainEmployeeDetailsStatus" class="interfaceMainText">' +
						'<td id="tdInterfaceMainEmployeeDetailsStatusValue" class="interfaceMainRadio" style="height:33px;">' +
						'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Proposed' +
						'&nbsp;&nbsp;<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Active' +
						'&nbsp;&nbsp;<input type="radio" id="radioStatus3" name="radioStatus" value="3"/>In-active' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainEmployeeDetailsNotes" class="interfaceMain">' +
						'<td id="tdInterfaceMainEmployeeDetailsNotes" class="interfaceMain">' +
						'Notes' +
						'</td></tr>' +
						'<tr id="trInterfaceMainEmployeeDetailsNotesValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainEmployeeDetailsNotesValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsNotes" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html(aHTML.join(''));

		if (ns1blankspace.financial.employee != undefined)
		{
			$('[name="radioStatus"][value="' + ns1blankspace.financial.employee.status + '"]').attr('checked', true);
			$('#inputInterfaceMainEmployeeDetailsNotes').val(ns1blankspace.financial.employee.description);
		}
		else
		{
			$('[name="radioStatus"][value="1"]').attr('checked', true);
		}
	}
	
	if (iStep == 13)
	{
		$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html('FINANCIAL_PAYROLL_EMPLOYEE_PAYRATE_SEARCH');
	}
	
	if (iStep == 14)
	{
		$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html('FINANCIAL_PAYROLL_EMPLOYEE_BANK_ACCOUNT_SEARCH');
	}	
}

function interfaceFinancialPayrollEmployeesRow(oRow)
{
	var aHTML = [];
	var h = -1;

	if (oRow.contactpersontext != '')
	{
		aHTML[++h] = '<tr class="interfaceMainRow">';
				
		aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Contact-' + oRow.id + '" class="interfaceMainRow interfaceMainRowSelect employee">' +
								oRow.contactpersontext + '</td>';
	
		aHTML[++h] = '</tr>'
	}
	return aHTML.join('');
	
}
