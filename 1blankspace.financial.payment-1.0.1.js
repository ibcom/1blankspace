/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
function interfaceFinancialPaymentMasterViewport(aParam)
{
	interfaceFinancialMasterInitialise();
	
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}

	ns1blankspace.object = 3;
	ns1blankspace.objectName = 'Payment';
	ns1blankspace.objectContextData = undefined;
	ns1blankspace.objectContext = -1;
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialPaymentMasterViewport({showHome: true});',
			move: false
			})		
	}	
			
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Payments"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceFinancialPaymentSearch('inputInterfaceMasterViewportControlSearch')", ns1blankspace.option.typingWait);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceFinancialPaymentSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceFinancialPaymentSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceFinancialPaymentNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceFinancialPaymentNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceFinancialPaymentSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceFinancialPaymentSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceFinancialPaymentSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceFinancialPaymentSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceFinancialPaymentHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceFinancialPaymentHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceFinancialPaymentSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceFinancialPaymentSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	if (ns1blankspace.option.setFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	if (bShowHome) {interfaceFinancialPaymentHomeShow()};	
}

function interfaceFinancialPaymentHomeShow(oResponse)
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
						'<td id="interfaceMasterViewportFinancialLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
		oSearch.addField('reference,description,contactbusinesspaidtotext,contactpersonpaidtotext,paiddate,amount');
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		oSearch.getResults(interfaceFinancialPaymentHomeShow);
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialPaymentHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialPaymentHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialPaymentHomeMostLikelyNothing">Click New to create a expense.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialPaymentHomeMostLikely">';
			
			$.each(oResponse.data.rows, function()
			{					
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceFinancialPaymentHomeMostLikely_Title-' + this.id + '" class="interfaceHomeMostLikely" style="width:50px;">' +
										this.reference + '</td>';
				
				aHTML[++h] = '<td id="interfaceFinancialPaymentHomeMostLikely_Amount-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:50px;text-align:right;">' +
										'$' + this.amount + '</td>';
														
				aHTML[++h] = '<td id="interfaceFinancialPaymentHomeMostLikely_DueDate-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:90px;">' +
										this.paiddate + '</td>';
										
				var sContact = this.contactbusinesspaidtotext
				if (sContact == '') {sContact = this.contactpersonpaidtotext}
				
				aHTML[++h] = '<td id="interfaceFinancialPaymentHomeMostLikely_Contact-' + this.id + '" class="interfaceHomeMostLikelySub">' +
										sContact + '</td>';
					
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceProjectHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceFinancialPaymentSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceFinancialPaymentSearch(sXHTMLElementId, aParam)
{
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	var iMinimumLength = 3;
	var iSource = ns1blankspace.data.searchSource.text;
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
	
	if (sSearchContext != undefined  && iSource != ns1blankspace.data.searchSource.browse)
	{
		$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
		
		ns1blankspace.objectContext = sSearchContext;
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
		oSearch.addField('contactbusinesspaidtotext,contactbusinesspaidto,contactpersonpaidtotext,' +
								'contactpersonpaidto,projecttext,project,areatext,' +
								'area,reference,paiddate,description,amount,tax');
		oSearch.rf = 'json';
		oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
		
		oSearch.getResults(function(data) {interfaceFinancialPaymentShow(aParam, data)});
	}
	else
	{
		if (sSearchText == undefined)
		{
			sSearchText = $('#inputInterfaceMasterViewportControlSearch').val();
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
			interfaceMasterOptionsSetPosition(sElementId);
			
			var oSearch = new AdvancedSearch();
			oSearch.endPoint = 'financial';
			oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
			oSearch.addField('contactbusinesspaidtotext,contactbusinesspaidto,contactpersonpaidtotext,contactpersonpaidto,' +
								'reference,paiddate,amount');
			oSearch.rf = 'json';
			oSearch.addFilter('quicksearch', 'STRING_IS_LIKE', sSearchText);
			
			oSearch.getResults(function(data) {interfaceFinancialPaymentSearchShow(aParam, data)});	
		}
	};	
}

function interfaceFinancialPaymentSearchShow(aParam, oResponse)
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
							this.reference +
							'</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		});
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
			interfaceFinancialPaymentSearch(event.target.id, {source: 1});
		});
	}	
			
}

function interfaceFinancialPaymentViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (ns1blankspace.objectContext == -1)
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
						'</tr>';
	}
	else
	{	
		aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
						'</tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
						'</tr>';
		
		/*
		aHTML[++h] = '<tr id="trInterfaceViewportControlItem" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlItem" class="interfaceViewportControl">Items</td>' +
						'</tr>';
		*/
						
		aHTML[++h] = '</table>';					
	
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
					
		aHTML[++h] = '<tr id="trInterfaceViewportControlExpenses" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlExpenses" class="interfaceViewportControl">Expenses</td>' +
						'</tr>';
					
		aHTML[++h] = '</table>';					

		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
		aHTML[++h] = '<tr id="trInterfaceViewportControlGL" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlGL" class="interfaceViewportControl">GL</td>' +
						'</tr>';
					
		aHTML[++h] = '</table>';					
	
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
		aHTML[++h] = '<tr id="trInterfaceViewportControlActions" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlActions" class="interfaceViewportControl">Actions</td>' +
						'</tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportControlAttachments" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
						'</tr>';
	}
					
	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainContext" class="divInterfaceViewportMainContext"></div>';
	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainItem" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainExpense" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainTransaction" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceFinancialPaymentSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceFinancialPaymentDetails();
	});
	
	$('#tdInterfaceViewportControlItem').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainItem", true);
		interfaceFinancialPaymentItem();
	});
	
	$('#tdInterfaceViewportControlExpenses').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainExpense", true);
		interfaceFinancialPaymentExpense();
	});
	
	$('#tdInterfaceViewportControlGL').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainTransaction", true);
		interfaceFinancialTransaction();
		//You'll find this in 1blankspace.financial-[].js
	});

	$('#tdInterfaceViewportControlActions').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainActions", true);
		interfaceMasterActions({xhtmlElementID: 'divInterfaceMainActions'});
	});

	$('#tdInterfaceViewportControlAttachments').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAttachments", true);
		interfaceMasterAttachments({xhtmlElementID: 'divInterfaceMainAttachments'});
	});
	
}

function interfaceFinancialPaymentShow(aParam, oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
	interfaceFinancialPaymentViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		ns1blankspace.objectContextData = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the payment.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		ns1blankspace.objectContextData = oResponse.data.rows[0];
		
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
					
		$('#divInterfaceViewportControlContext').html(ns1blankspace.objectContextData.reference +
			'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_paiddate">' +
			 		ns1blankspace.objectContextData.paiddate + '</span>' +
			'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_amount">' +
					ns1blankspace.objectContextData.amount + '</span>');
			
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialPaymentMasterViewport({showHome: false});interfaceFinancialPaymentSearch("-' + ns1blankspace.objectContext + '")',
			move: false
			})
		
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceFinancialPaymentSummary()'});
	}	
}		
		
function interfaceFinancialPaymentSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (ns1blankspace.objectContextData == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the payment.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
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
		
		if (ns1blankspace.objectContextData.amount != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryAmountValue" class="interfaceMainSummaryValue" style="font-size:1.5em;font-weight:bold;">';
			aHTML[++h] = '$' + ns1blankspace.objectContextData.amount;
			aHTML[++h] = '</td></tr>';
		}	
		
		if (ns1blankspace.objectContextData.contactbusinesspaidtotext != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryBusiness" class="interfaceMainSummary">Business</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryBusinessValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.contactbusinesspaidtotext +
						'</td></tr>';
		}
		
		if (ns1blankspace.objectContextData.contactpersonpaidtotext != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPerson" class="interfaceMainSummary">Person</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPersonValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.contactpersonpaidtotext +
						'</td></tr>';
		}
		
		if (ns1blankspace.objectContextData.paid == 'Y')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummarypaidDate" class="interfaceMainSummary">Date Paid</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarypaidDateValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.paiddate +
						'</td></tr>';			
		}
		else
		{	
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPaidDate" class="interfaceMainSummary">Date Paid</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPaidDateValue" class="interfaceMainSummaryValue">' +
						'Has not been paid.' +
						'</td></tr>';				
		}
		
		if (ns1blankspace.objectContextData.description != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.description +
						'</td></tr>';
		}
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));
	}	
}

function interfaceFinancialPaymentDetails()
{
	var aHTML = [];
	var h = -1;
		
	if ($('#divInterfaceMainDetails').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainDetails').attr('onDemandLoading', '');
				
		aHTML[++h] = '<table id="tableInterfaceMainDetails" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainDetailsRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainDetailsColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainDetails').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsReference" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsReference" class="interfaceMain">' +
						'Reference' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsReference" class="inputInterfaceMainText">' +
						'</td></tr>';								
			
		aHTML[++h] = '<tr id="trInterfaceMainDetailsPaidDate" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPaidDate" class="interfaceMain">' +
						'Paid Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsPaidDateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsPaidDateValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsPaidDate" class="inputInterfaceMainDate">' +
						'</td></tr>';						
			
		aHTML[++h] = '<tr id="trInterfaceMainDetailsContactBusinessPaidTo" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsContactBusinessPaidTo" class="interfaceMain">' +
						'Business' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsContactBusinessPaidToValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsContactBusinessPaidToValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsContactBusinessPaidTo" class="inputInterfaceMainSelect"' +
							' data-method="CONTACT_BUSINESS_SEARCH"' +
							' data-columns="tradename">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsContactPersonReceivedFrom" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsContactPersonReceivedFrom" class="interfaceMain">' +
						'Person' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsContactPersonPaidToValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsContactPersonPaidToValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsContactPersonPaidTo" class="inputInterfaceMainSelect"' +
							' data-method="CONTACT_PERSON_SEARCH"' +
							' data-columns="surname"' +
							' data-parent="inputInterfaceMainDetailsContactBusinessPaidTo"' +
							' data-parent-search-id="contactbusiness"' +
							' data-parent-search-text="tradename">' +
						'</td></tr>';		
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsAmount" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsAmount" class="interfaceMain">' +
						'Amount' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsAmountValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsAmountValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsAmount" class="inputInterfaceMainText">' +
						'</td></tr>';	
											
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
						'Description' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (ns1blankspace.objectContextData != undefined)
		{
			$('#inputInterfaceMainDetailsReference').val(ns1blankspace.objectContextData.reference);
			$('#inputInterfaceMainDetailsPaidDate').val(ns1blankspace.objectContextData.paiddate);
			$('#inputInterfaceMainDetailsContactBusinessPaidTo').attr('data-id', ns1blankspace.objectContextData.contactbusinesspaidto);
			$('#inputInterfaceMainDetailsContactBusinessPaidTo').val(ns1blankspace.objectContextData.contactbusinesspaidtotext);
			$('#inputInterfaceMainDetailsContactPersonPaidTo').attr('data-id', ns1blankspace.objectContextData.contactpersonpaidto);
			$('#inputInterfaceMainDetailsContactPersonPaidTo').val(ns1blankspace.objectContextData.contactpersonpaidtotext);	
			$('#inputInterfaceMainDetailsAmount').val(ns1blankspace.objectContextData.amount);		
			$('#inputInterfaceMainDetailsDescription').val(ns1blankspace.objectContextData.description);
		}
	}	
}

function interfaceFinancialPaymentSave(aParam, oResponse)
{
	interfaceMasterStatusWorking();
		
	var sData = (ns1blankspace.objectContext == -1)?'':'id=' + ns1blankspace.objectContext;
		
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&reference=' + $('#inputInterfaceMainDetailsReference').val();
		sData += '&paiddate=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsPaidDate').val());
		sData += '&description=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDescription').val());
		sData += '&contactbusinesspaidfrom=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsContactBusinessPaidFrom').attr("data-id"));
		sData += '&contactpersonpaidfrom=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsContactPersonPaidFrom').attr("data-id"));
	}
	
	$.ajax(
	{
		type: 'POST',
		url: interfaceMasterEndpointURL('FINANCIAL_PAYMENT_MANAGE'),
		data: sData,
		dataType: 'json',
		success: function(data) {interfaceFinancialPaymentSaveProcess(data)}
	});	
}

function interfaceFinancialPaymentSaveProcess(oResponse)
{
	if (oResponse.status == 'OK')
	{
		interfaceMasterStatus('Saved');
		if (ns1blankspace.objectContext == -1) {var bNew = true}
		ns1blankspace.objectContext = oResponse.id;	
		
		if ($('#divInterfaceMainDetails').html() != '')
		{
			interfaceFinancialPaymentAmountSave();
		}
	}
	else
	{
		interfaceMasterError(oResponse.error.errornotes);
	}
}

function interfaceFinancialPaymentAmountSave(aParam)
{
	var iAccount = ns1blankspace.financial.settings.financialaccountcreditor;
	var cAmount = $('#inputInterfaceMainDetailsAmount').val();
	if (cAmount == '') {cAmount = 0};
	cAmount = (cAmount - ns1blankspace.objectContextData.amount)
	
	if (cAmount == 0 || iAccount == undefined)
	{
		if (iAccount == undefined) {alert('No creditor account set up.')}
	}
	else
	{
		var sData = 'object=' + ns1blankspace.object;
		sData += '&objectcontext=' + ns1blankspace.objectContext;
		sData += '&financialaccount=' + iAccount;
		sData += '&amount=' + cAmount;
		sData += '&description=' + $('#inputInterfaceMainDetailsDescription').val();
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/financial/?method=FINANCIAL_ITEM_MANAGE',
			data: sData,
			dataType: 'json',
			success: function(oResponse)
			{
				var sData = 'object=' + ns1blankspace.object;
				sData += '&objectcontext=' + ns1blankspace.objectContext;
			
				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/financial/?method=FINANCIAL_ITEM_COMPLETE',
					data: sData,
					dataType: 'json',
					success: function(oResponse)
					{
						interfaceFinancialPaymentRefresh();
					}
				});
			}
		});
	}	
}

function interfaceFinancialPaymentNew(aParam)
{
	ns1blankspace.objectContextData = undefined
	ns1blankspace.objectContext = -1;
	interfaceFinancialPaymentViewport();
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	interfaceFinancialPaymentDetails();
}

function interfaceFinancialPaymentItem(aParam, oResponse)
{
	var iObjectContext = ns1blankspace.objectContext;
	var sXHTMLElementId = 'divInterfaceMainItem';
	var oOptions = {view: true, remove: true};
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
					
		aHTML[++h] = '<table id="tableInterfaceMainItem" class="interfaceMain">' +
					'<tr id="trInterfaceMainItemRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainItemColumn1" class="interfaceMainColumn1Large">' +
					ns1blankspace.xhtml.loading +
					'</td>' +
					'<td id="tdInterfaceMainItemColumn2" class="interfaceMainColumn2Action" style="width: 200px;">' +
					'</td>' +
					'</tr>' +
					'</table>';					
			
		$('#' + sXHTMLElementId).html(aHTML.join(''));
		
		if (oActions != undefined)
		{
				
			sXHTMLElementId = 'tdInterfaceMainItemColumn1';
			
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainItemColumn2" class="interfaceMainColumn2">';
			
			if (oActions.add)
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainItemAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainItemAdd">Add</span>' +
							'</td></tr>';
			}
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainItemColumn2').html(aHTML.join(''));
		
			$('#spanInterfaceMainItemAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				 interfaceMasterFinanicalExpenseItemAdd(aParam);
			})
			
		}
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_ITEM_SEARCH';
		oSearch.addField('financialaccounttext,tax,issuedamount');
		oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
		oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
		oSearch.sort('financialaccounttext', 'asc');
		
		oSearch.getResults(function(data) {interfaceFinancialPaymentItem(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableFinancialPaymentItem" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No items.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
		}
		else
		{
			aHTML[++h] = '<table id="tableClientAudits" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Financial Account</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">GST</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Amount</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" class="interfaceMainRow">' +
										this["financialaccounttext"] + '</td>';
										
				aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" style="text-align:right;" class="interfaceMainRow">' +
										this["tax"] + '</td>';
										
				aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" style="text-align:right;" class="interfaceMainRow">' +
										this["issuedamount"] + '</td>';
										
				aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
					
				if (oOptions.remove)
				{	
					aHTML[++h] = '<span id="spanExpenseItem_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				};	
					
				if (oOptions.view)
				{	
					aHTML[++h] = '<span id="spanExpenseItem_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
				};	
					
				aHTML[++h] = '</td>';				
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			
			if (oOptions.remove) 
			{
				$('.interfaceMainRowOptionsRemove').button( {
					text: false,
					icons: {
						primary: "ui-icon-close"
					}
				})
				.click(function() {
					interfaceMasterExpenseItemRemove({xhtmlElementID: this.id});
				})
				.css('width', '15px')
				.css('height', '17px')
			}
			
			if (oOptions.view) 
			{
				$('.interfaceMainRowOptionsView').button( {
					text: false,
					icons: {
						primary: "ui-icon-play"
					}
				})
				.click(function() {
					interfaceMasterExpenseItemAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function interfaceMasterFinancialPaymentItemAdd(aParam, oResponse)
{
	var iStep = 1;
	
	if (aParam != undefined)
	{
		if (aParam.step != undefined) {iStep = aParam.step}	
	}
	
	if (oResponse == undefined)
	{
		if (iStep == 1)
		{
			var aHTML = [];
			var h = -1;
					
			aHTML[++h] = '<table id="tableInterfaceMainExpenseItemAddColumn2" class="interfaceMain">';
	
			aHTML[++h] = '<tr id="trInterfaceMainExpenseItemAddReference" class="interfaceMain">' +
							'<td id="tdInterfaceMainExpenseItemAddReference" class="interfaceMain">' +
							'Account' +
							'</td></tr>' +
							'<tr id="trInterfaceMainExpenseItemAddReferenceValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainExpenseItemAddReferenceValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainExpenseItemAddReference" class="inputInterfaceMainText">' +
							'</td></tr>';
			
			aHTML[++h] = '<tr id="trInterfaceMainExpenseItemAdd" class="interfaceMain">' +
							'<td id="tdInterfaceMainExpenseItemAddSearch" class="interfaceMain">' +
							'<span id="spanInterfaceMainExpenseItemAddSearch">Search</span>' +
							'</td></tr>';
			
			aHTML[++h] = '<tr id="trInterfaceMainExpenseItemAdd" class="interfaceMain">' +
							'<td id="tdInterfaceMainExpenseItemAddSearchResults" class="interfaceMain">' +
							'Enter a code or title and click search.' +
							'</td></tr>';
											
			aHTML[++h] = '</tbody></table>';		
			
			$('#tdInterfaceMainItemColumn2').html(aHTML.join(''));

			$('#spanInterfaceMainExpenseItemAddSearch').button(
				{
					label: "Search"
				})
				.click(function() {
					interfaceMasterFinanicalExpenseItemAdd($.extend(true, aParam, {step: 2}))
				})
				.css('width', '75px')
		}
		if (iStep == 2)
		{
			var sParam = 'method=SETEP_FINANCIAL_ITEM_SEARCH&title=' + $('inputInterfaceMainExpenseItemAddReference').val();
			sParam += '&includeimage=1';
	
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?' + sParam,
				dataType: 'json',
				success: function(data){interfaceMasterFinanicalExpenseItemAdd($.extend(true, aParam, {step:3}), data)}
			});	
		}
	}
	else
	{
		var aHTML = [];
		var h = -1;

		if (oResponse.data.rows.length == 0)	
		{
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceActions">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">No accounts.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainOrderProductsColumn1').html(aHTML.join(''));		
		}
		else
		{	
			$.each(oResponse.data.rows, function() 
			{ 
				aHTML[++h] = '<tr class="interfaceMainRow">';	
							
				aHTML[++h] = '<td id="tdExpenseItems_title-' + this.id + '" class="interfaceMainRow">' +
										this.reference + '</td>';
														
				aHTML[++h] = '</tr>';	

			});
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainExpenseItemAddSearchResults').html(aHTML.join(''))
			
			//bind rows to add product to order column 1
		}
	}	
}

function interfaceFinancialPaymentExpense(aParam, oResponse)
{
	var iObjectContext = ns1blankspace.objectContext;
	var sXHTMLElementId = 'divInterfaceMainExpense';
	var oOptions = {view: true, remove: true};
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
					
		aHTML[++h] = '<table id="tableInterfaceMainPayment" class="interfaceMain">' +
					'<tr id="trInterfaceMainPaymentRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainPaymentColumn1" class="interfaceMainColumn1Large">' +
					ns1blankspace.xhtml.loading +
					'</td>' +
					'<td id="tdInterfaceMainPaymentColumn2" class="interfaceMainColumn2Action" style="width: 200px;">' +
					'</td>' +
					'</tr>' +
					'</table>';					
			
		$('#' + sXHTMLElementId).html(aHTML.join(''));
		
		if (oActions != undefined)
		{
				
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainPaymentColumn2" class="interfaceMainColumn2">';
			
			if (oActions.add)
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainPaymentAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainPaymentAdd">Add</span>' +
							'</td></tr>';
			}
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainPaymentColumn2').html(aHTML.join(''));
		
			$('#spanInterfaceMainPaymentAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				 interfaceFinancialPaymentPaymentAdd(aParam);
			})
			
		}
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_PAYMENT_EXPENSE_SEARCH';
		oSearch.addField('appliesdate,amount');
		oSearch.addFilter('payment', 'EQUAL_TO', iObjectContext);
		oSearch.sort('appliesdate', 'asc');
		oSearch.getResults(function(data) {interfaceFinancialPaymentExpense(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableFinancialPaymentPayment" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No expenses.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
		}
		else
		{
			aHTML[++h] = '<table id="tableClientAudits" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Amount</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdWebsiteLinePayment_financialaccounttext-' + this.id + '" class="interfaceMainRow">' +
										this.appliesdate + '</td>';
										
				aHTML[++h] = '<td id="tdWebsiteLinePayment_financialaccounttext-' + this.id + '" style="text-align:right;" class="interfaceMainRow">' +
										this.amount + '</td>';
										
				aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
					
				if (oOptions.remove)
				{	
					aHTML[++h] = '<span id="spanExpensePayment_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				};	
					
				if (oOptions.view)
				{	
					aHTML[++h] = '<span id="spanExpensePayment_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
				};	
					
				aHTML[++h] = '</td>';				
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainPaymentColumn1').html(aHTML.join(''));
			
			if (oOptions.remove) 
			{
				$('.interfaceMainRowOptionsRemove').button( {
					text: false,
					icons: {
						primary: "ui-icon-close"
					}
				})
				.click(function() {
					interfaceMasterExpensePaymentRemove({xhtmlElementID: this.id});
				})
				.css('width', '15px')
				.css('height', '17px')
			}
			
			if (oOptions.view) 
			{
				$('.interfaceMainRowOptionsView').button( {
					text: false,
					icons: {
						primary: "ui-icon-play"
					}
				})
				.click(function() {
					interfaceMasterExpensePaymentAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function interfaceFinancialPaymentRefresh(oResponse)
{
	if (oResponse == undefined)
	{
		$('#spanInterfaceViewportControlSubContext_amount').html(ns1blankspace.xhtml.loadingSmall);
			
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
		oSearch.addField('paiddate,amount,tax');
		oSearch.rf = 'json';
		oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
		
		oSearch.getResults(function(data) {interfaceFinancialPaymentRefresh(data)});
	}
	else
	{
		var oObjectContext = oResponse.data.rows[0];
		
		ns1blankspace.objectContextData.paiddate = oObjectContext.paiddate;
		ns1blankspace.objectContextData.amount = oObjectContext.amount;
				
		$('#spanInterfaceViewportControlSubContext_paiddate').html(oObjectContext.receiveddate);
		$('#spanInterfaceViewportControlSubContext_amount').html(oObjectContext.amount);
	}
}