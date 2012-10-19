/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

function interfaceFinancialTaxMasterViewport(oParam)
{
	interfaceFinancialMasterInitialise();
	
	var bShowHome = true
	
	if (oParam != undefined)
	{
		if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
	}

	ns1blankspace.object = -1;
	ns1blankspace.objectContextData = undefined;
	ns1blankspace.objectName = 'Tax';
	ns1blankspace.objectContext = -1;
	
	if (bShowHome)
	{
		ns1blankspaceViewportDestination({
			newDestination: 'interfaceFinancialTaxMasterViewport({showHome: true});',
			move: false
			})		
	}	
			
	ns1blankspaceReset();
	
	$('#divns1blankspaceViewportControlSet').button(
	{
		label: "Tax"
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
	if (bShowHome) {interfaceFinancialTaxHomeShow()};	
}

function interfaceFinancialTaxHomeShow(oParam, oResponse)
{		
	if (oResponse == undefined)
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
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_TAX_REPORT_SEARCH';
		//oSearch.addField('taxstartdate,enddate,taxofficereference,statustext');
		oSearch.addField('*')
		oSearch.rows = 10;
		oSearch.sort('enddate', 'desc');
		oSearch.getResults(function(data){interfaceFinancialTaxHomeShow(oParam, data)});
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


function interfaceFinancialTaxSearch(sXHTMLElementId, oParam)
{
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	var iMinimumLength = 3;
	var iSource = ns1blankspace.data.searchSource.text;
	var sSearchText;
	var iMaximumColumns = 1;
	var iRows = 10;
	
	if (oParam != undefined)
	{
		if (oParam.source != undefined) {iSource = oParam.source}
		if (oParam.searchText != undefined) {sSearchText = oParam.searchText}
		if (oParam.rows != undefined) {iRows = oParam.rows}
		if (oParam.searchContext != undefined) {sSearchContext = oParam.searchContext}
		if (oParam.minimumLength != undefined) {iMinimumLength = oParam.minimumLength}
		if (oParam.maximumColumns != undefined) {iMaximumColumns = oParam.maximumColumns}
	}
	
	if (sSearchContext != undefined  && iSource != ns1blankspace.data.searchSource.browse)
	{
		$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
		
		ns1blankspace.objectContext = sSearchContext;
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_TAX_REPORT_SEARCH';
		oSearch.addField('*');
		oSearch.rf = 'json';
		oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
		
		oSearch.getResults(function(data) {interfaceFinancialTaxShow(oParam, data)});
	}
	else
	{
		if (sSearchText == undefined)
		{
			sSearchText = $('#inputns1blankspaceViewportControlSearch').val();
		}	
		
		if (iSource == ns1blankspace.data.searchSource.browse)
		{
			iMinimumLength = 1;
			iMaximumColumns = 4;
			var aSearch = sSearch.split('-');
			sSearchText = aSearch[1];
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
		{
			ns1blankspaceOptionsSetPosition(sElementId);
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
			oSearch.addField('enddate,taxofficereference');
			oSearch.addFilter('taxofficereference', 'STRING_IS_LIKE', sSearchText);
			
			oSearch.getResults(function(data) {interfaceFinancialTaxSearchShow(oParam, data)});	
		}
	};	
}

function interfaceFinancialTaxSearchShow(oParam, oResponse)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	if (oResponse.data.rows.length == 0)
	{
		$('#divns1blankspaceViewportControlOptions').hide();
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

		$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
		$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
			$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
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
		ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
		interfaceFinancialTaxSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
		interfaceFinancialTaxDetails();
	});
	
	$('#tdInterfaceViewportControlReporting').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainReport", true);
		interfaceFinancialTaxReport();
	});
}

function interfaceFinancialTaxShow(oParam, oResponse)
{	
	$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
	interfaceFinancialTaxViewport();
		
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		ns1blankspace.objectContextData = undefined;
			
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this tax report.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
			
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		ns1blankspace.objectContextData = oResponse.data.rows[0];
			
		$('#spanns1blankspaceViewportControlAction').button({disabled: false});
			
		$('#divInterfaceViewportControlContext').html(ns1blankspace.objectContextData.enddate+
			'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_status">' + ns1blankspace.objectContextData.statustext + '</span>');
		
		ns1blankspaceViewportDestination({
			newDestination: 'interfaceFinancialTaxMasterViewport({showHome: false});interfaceFinancialTaxSearch("-' + ns1blankspace.objectContext + '")',
			move: false
			})
	
		ns1blankspaceObjectViewportHistory({functionDefault: 'interfaceFinancialTaxSummary()'});
	}		
}	

function interfaceFinancialTaxSummary(oParam, oResponse)
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
					'This tax report was last updated on the ' + ns1blankspace.objectContextData.modifieddate + '.' +
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
				ns1blankspace.xhtml.loading +
				'</td>' +
				'<td id="tdInterfaceMainTaxColumnReportType" style="width: 125px;padding-right:5px;" class="interfaceMainColumn2">' +
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

function interfaceFinancialTaxReportSummary(oParam)	
{	
	var sCategory = "revenue";
					
	ns1blankspace.financial.reportsummary = {
		"revenue": ["g1","g2","g3","g4","g5","g6","g7","g8","g9"],
		"expense": ["g10","g11","g12","g13","g14","g15","g16","g17","g18","g21"],
		"payroll": ["w1","w2"],
		"instalments": ["t1","t2","t3","t7","t9"]
	};
	
	if (oParam != undefined)
	{
		if (oParam.category != undefined) {sCategory = oParam.category}
	}
	
	$('#tdInterfaceMainTaxColumnReportType').html(ns1blankspace.xhtml.loadingSmall);
	
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
									'$' + ns1blankspace.objectContextData[this] + '</td>';
																													
		aHTML[++h] = '</tr>';
	});

	aHTML[++h] = '</tbody></table>';
	
	$('#tdInterfaceMainTaxColumnReportType').html(aHTML.join(''));
	
	$('.type').click(function()
	{
		var aID = (event.target.id).split('-');
		interfaceFinancialTaxReportItems({field: aID[1]});
	});
}

function interfaceFinancialTaxReportItems(oParam, oResponse)
{
	var iStep = 1;
	var iType = 1;
	var iSubType = 1;
	var sField = 'G1';
	
	if (oParam != undefined)
	{
		if (oParam.step != undefined) {iStep = oParam.step}
		if (oParam.type != undefined) {iType = oParam.type}
		if (oParam.subType != undefined) {iSubType = oParam.subType}
		if (oParam.field != undefined) {sField = oParam.field}
	}
	else
	{
		oParam = {};
	}
	
	if (iStep == 1)
	{
		$.extend(true, oParam, {step: 2});
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainTax" class="interfaceMain">' +
					'<tr id="trInterfaceMainTaxRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainTaxColumnReportItemSubType" style="width: 120px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
					ns1blankspace.xhtml.loading +
					'</td>' +
					'<td id="tdInterfaceMainTaxColumnReportItems" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';				
	
		$('#tdInterfaceMainTaxColumnReportItem').html(aHTML.join(''));
				
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<div id="interfaceMainTaxColumnSubType" style="width: 115px;margin-bottom:3px;">';
	
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
			$.extend(true, oParam, {subType: aID[1], step: 2});
			interfaceFinancialTaxReportItems(oParam);	
		});
		
		interfaceFinancialTaxReportItems(oParam);
	}
	
	if (iStep == 2)
	{
		$.extend(true, oParam, {step: 3});
		
		var sData = 'id=' + ns1blankspace.objectContext +
					'&type=' + iType +
					'&subtype=' + iSubType +
					'&field=' + sField;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/financial/?method=FINANCIAL_TAX_REPORT_ITEM_SEARCH',
			data: sData,
			dataType: 'json',
			success: function(data) {
				interfaceFinancialTaxReportItems(oParam, data)
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
			
			aHTML[++h] = '<td id="spanReportItems_tax-' + this.id + '" style="text-align:right;" class="interfaceMainRow interfaceMainRowSelect">' +
									this.gst + '</td>';
							
			aHTML[++h] = '</tr>';
		});
		
		aHTML[++h] = '</tbody></table>';

		$('#tdInterfaceMainTaxColumnReportItems').html(aHTML.join(''));
	}	
}

function interfaceFinancialTaxDetails(oParam)
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