function interfaceFinancialExpenseMasterViewport(aParam)
{
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}

	interfaceFinancialMasterInitialise();

	giObject = 5;
	gsObjectName = 'Financial Expense';
	goObjectContext = undefined;
	giObjectContext = -1;
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialExpenseMasterViewport({showHome: true});',
			move: false
			})		
	}	
			
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Expenses"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceFinancialExpenseSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceFinancialExpenseSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceFinancialExpenseSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceFinancialExpenseNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceFinancialExpenseNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceFinancialExpenseSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceFinancialExpenseSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceFinancialExpenseSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceFinancialExpenseSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceFinancialExpenseHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceFinancialExpenseHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceFinancialExpenseSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceFinancialExpenseSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	if (bShowHome) {interfaceFinancialExpenseHomeShow()};	
}

function interfaceFinancialExpenseHomeShow(oResponse)
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
		oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
		oSearch.addField('reference,description,contactbusinesspaidtotext,contactpersonpaidtotext');
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		oSearch.getResults(interfaceFinancialExpenseHomeShow);
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialExpenseHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialExpenseHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialExpenseHomeMostLikelyNothing">Click New to create a expense.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialExpenseHomeMostLikely">';
			
			$.each(oResponse.data.rows, function()
			{					
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceFinancialExpenseHomeMostLikely_Title-' + this.id + '" class="interfaceHomeMostLikely" style="width:50px;">' +
										this.reference + '</td>';
				
				var sContact = this.contactbusinesspaidtotext
				if (sContact == '') {sContact = this.contactpersonpaidtotext}
				
				aHTML[++h] = '<td id="interfaceFinancialExpenseHomeMostLikely_Contact-' + this.id + '" class="interfaceHomeMostLikelySub">' +
										sContact + '</td>';
					
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceProjectHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceFinancialExpenseSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceFinancialExpenseSearch(sXHTMLElementId, aParam)
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
		oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
		oSearch.addField('contactbusinesspaidtotext,contactbusinesspaidto,contactpersonpaidtotext,contactpersonpaidto,projecttext,project,projecttext,areatext,' +
								'area,reference,accrueddate,description,amount,tax');
		oSearch.rf = 'json';
		oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
		
		oSearch.getResults(function(data) {interfaceFinancialExpenseShow(aParam, data)});
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
			oSearch.endPoint = 'financial';
			oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
			oSearch.addField('contactbusinesspaidtotext,contactbusinesspaidto,contactpersonpaidtotext,contactpersonpaidto,' +
								'reference,accrueddate,amount');
			oSearch.rf = 'json';
			oSearch.addFilter('quicksearch', 'STRING_IS_LIKE', sSearchText);
			
			oSearch.getResults(function(data) {interfaceFinancialExpenseSearchShow(aParam, data)});	
		}
	};	
}

function interfaceFinancialExpenseSearchShow(aParam, oResponse)
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
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceFinancialExpenseSearch(event.target.id, {source: 1});
		});
	}	
			
}

function interfaceFinancialExpenseViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (giObjectContext == -1)
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
		
		aHTML[++h] = '<tr id="trInterfaceViewportControlItem" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlItem" class="interfaceViewportControl">Items</td>' +
						'</tr>';
	
		aHTML[++h] = '</table>';					
	
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
		/*
		aHTML[++h] = '<tr id="trInterfaceViewportControlCredits" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlCredits" class="interfaceViewportControl">Credits</td>' +
						'</tr>';
		*/
					
		aHTML[++h] = '<tr id="trInterfaceViewportControlPayments" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlPayments" class="interfaceViewportControl">Payments</td>' +
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
	aHTML[++h] = '<div id="divInterfaceMainCredit" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainPayment" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainTransaction" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceFinancialExpenseSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceFinancialExpenseDetails();
	});
	
	$('#tdInterfaceViewportControlItem').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainItem", true);
		interfaceFinancialExpenseItem();
	});
	
	$('#tdInterfaceViewportControlCredits').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainCredits", true);
		interfaceFinancialExpenseCredit();
	});
	
	$('#tdInterfaceViewportControlPayments').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainPayment", true);
		interfaceFinancialExpensePayment();
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

function interfaceFinancialExpenseShow(aParam, oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceFinancialExpenseViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the Expense.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
				
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
					
		$('#divInterfaceViewportControlContext').html(goObjectContext.reference +
			'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_accrueddate">' + goObjectContext.accrueddate + '</span>' +
			'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_amount">' + goObjectContext.amount + '</span>');
			
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialExpenseMasterViewport({showHome: false});interfaceFinancialExpenseSearch("-' + giObjectContext + '")',
			move: false
			})
		
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceFinancialExpenseSummary()'});
	}	
}		
		
function interfaceFinancialExpenseSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the Expense.</td></tr>';
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
		
		if (goObjectContext.amount != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryAmountValue" class="interfaceMainSummaryValue" style="font-size:1.5em;font-weight:bold;">';
			aHTML[++h] = '$' + goObjectContext.amount;
			aHTML[++h] = '</td></tr>';
		}	
		
		if (goObjectContext.contactbusinesspaidtotext != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryBusiness" class="interfaceMainSummary">Business</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryBusinessValue" class="interfaceMainSummaryValue">' +
						goObjectContext.contactbusinesspaidtotext +
						'</td></tr>';
		}
		
		if (goObjectContext.contactpersonpaidtotext != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPerson" class="interfaceMainSummary">Person</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPersonValue" class="interfaceMainSummaryValue">' +
						goObjectContext.contactpersonpaidtotext +
						'</td></tr>';
		}
		
		if (goObjectContext.paid == 'Y')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummarypaidDate" class="interfaceMainSummary">Date Paid</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarypaidDateValue" class="interfaceMainSummaryValue">' +
						goObjectContext.paiddate +
						'</td></tr>';			
		}
		else
		{	
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPaidDate" class="interfaceMainSummary">Date Paid</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPaidDateValue" class="interfaceMainSummaryValue">' +
						'Has not been paid.' +
						'</td></tr>';				
		}
		
		if (goObjectContext.description != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
						goObjectContext.description +
						'</td></tr>';
		}
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));
	}	
}

function interfaceFinancialExpenseDetails()
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
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsContactPersonPaidTo" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsContactPersonPaidTo" class="interfaceMain">' +
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
							
		aHTML[++h] = '<tr id="trInterfaceMainDetailsAccruedDate" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsAccruedDate" class="interfaceMain">' +
						'Accrued Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsAccruedDateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsAccruedDateValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsAccruedDate" class="inputInterfaceMainDate">' +
						'</td></tr>';			
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDueDate" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDueDate" class="interfaceMain">' +
						'Due Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDueDateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsDueDateValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsDueDate" class="inputInterfaceMainDate">' +
						'</td></tr>';	
											
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		/*
		aHTML[++h] = '<tr id="trInterfaceMainDetailsPaid" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPaid" class="interfaceMain">' +
						'Paid' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsPaid" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsPaidValue" class="interfaceMainRadio" style="height:33px;">' +
						'<input type="radio" id="radioPaidN" name="radioPaid" value="N"/>No' +
						'&nbsp;&nbsp;<input type="radio" id="radioPaidY" name="radioPaid" value="Y"/>Yes' +
						'</td></tr>';
		*/
		
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

		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsReference').val(goObjectContext.reference);
			$('#inputInterfaceMainDetailsContactBusinessPaidTo').attr('data-id', goObjectContext.contactbusinesspaidto);
			$('#inputInterfaceMainDetailsContactBusinessPaidTo').val(goObjectContext.contactbusinesspaidtotext);
			$('#inputInterfaceMainDetailsContactPersonPaidTo').attr('data-id', goObjectContext.contactpersonpaidto);
			$('#inputInterfaceMainDetailsContactPersonPaidTo').val(goObjectContext.contactpersonpaidtotext);	
			$('#inputInterfaceMainDetailsAccruedDate').val(goObjectContext.accrueddate);
			$('#inputInterfaceMainDetailsDueDate').val(goObjectContext.duedate);
			$('[name="radioPaid"][value="' + goObjectContext.paid + '"]').attr('checked', true);
			$('#inputInterfaceMainDetailsDescription').val(goObjectContext.description);
		}
		else
		{
			$('[name="radioPaid"][value="N"]').attr('checked', true);
		}
	}	
}

function interfaceFinancialExpenseSave(aParam, oResponse)
{
	if (oResponse == undefined)
	{
		interfaceMasterStatusWorking();
		
		var sData = (giObjectContext == -1)?'':'id=' + giObjectContext;
			
		if ($('#divInterfaceMainDetails').html() != '')
		{
			sData += '&reference=' + $('#inputInterfaceMainDetailsReference').val();
			sData += '&paiddate=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsPaidDate').val());
			sData += '&duedate=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDueDate').val());
			sData += '&description=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDescription').val());
			sData += '&contactbusinesssentto=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsSentToBusiness').attr("data-id"));
			sData += '&contactpersonsentto=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsSentToPerson').attr("data-id"));
		}
		
		$.ajax(
		{
			type: 'POST',
			url: interfaceMasterEndpointURL('FINANCIAL_EXPENSE_MANAGE'),
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceFinancialExpenseSave(aParam, data)}
		});
		
	}
	else
	{			
		if (oResponse.status == 'OK')
		{	
			interfaceMasterStatus('Saved');
			
			if (giObjectContext == -1)
			{
				giObjectContext = oResponse.id;
				gbInputDetected = false;
				interfaceFinancialExpenseSearch('-' + giObjectContext, {source: 1});
			}	
		}
		else
		{
			interfaceMasterError('Could not save the Expense!');
		}
	}	
}

function interfaceFinancialExpenseNew(aParam)
{
	goObjectContext = undefined
	giObjectContext = -1;
	interfaceFinancialExpenseViewport();
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	interfaceFinancialExpenseDetails();
}

function interfaceFinancialExpenseItem(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
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
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainItemColumn2" class="interfaceMainColumn2Action" style="width: 300px;">' +
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
				 interfaceFinanicalExpenseItemAdd(aParam);
			})
			
		}
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_ITEM_SEARCH';
		oSearch.addField('financialaccounttext,tax,issuedamount,amount,description');
		oSearch.addFilter('object', 'EQUAL_TO', giObject);
		oSearch.addFilter('objectcontext', 'EQUAL_TO', giObjectContext);
		oSearch.sort('financialaccounttext', 'asc');
		
		oSearch.getResults(function(data) {interfaceFinancialExpenseItem(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableFinancialExpenseItem" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No items.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainItemColumn1').html(aHTML.join(''));
		}
		else
		{
			aHTML[++h] = '<table id="tableFinancialItems" border="0" cellspacing="0" cellpadding="0" class="interfaceMain" style="font-size:0.875em;">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption" style="width:125px;">Account</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Description</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Amount</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" class="interfaceMainRow">' +
										this["financialaccounttext"] + '</td>';
														
				aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" class="interfaceMainRow">' +
										this["description"] + '</td>';
											
				aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" style="text-align:right;" class="interfaceMainRow"' +
										' title="' + this["tax"] + '">' +
										this["amount"] + '</td>';
										
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

			$('#tdInterfaceMainItemColumn1').html(aHTML.join(''));
			
			if (oOptions.remove) 
			{
				$('.interfaceMainRowOptionsRemove').button( {
					text: false,
					icons: {
						primary: "ui-icon-close"
					}
				})
				.click(function() {
					interfaceFinancialExpenseItemRemove({xhtmlElementID: this.id});
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
					interfaceFinancialExpenseItemAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function interfaceFinancialExpenseItemRemove(aParam, oResponse)
{
	var sXHTMLElementID;

	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}
	
	var aXHTMLElementID = sXHTMLElementID.split('-');
	var sID = aXHTMLElementID[1];
	
	if (oResponse == undefined)
	{	
		var sParam = 'method=FINANCIAL_ITEM_MANAGE&remove=1';
		var sData = 'id=' + sID;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/financial/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data)
			{
				var sData = 'object=' + giObject;
				sData += '&objectcontext=' + giObjectContext;
				
				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/financial/?method=FINANCIAL_ITEM_COMPLETE',
					data: sData,
					dataType: 'json',
					success: function(data){interfaceFinancialExpenseRefresh()}
				});
				
				interfaceFinancialExpenseItemRemove(aParam, data)
			}
		});
	}	
	else
	{
		if (oResponse.status == 'OK')
		{
			$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
		}
		else
		{
			interfaceMasterError(oResponse.error.errornotes);
		}
	}	
	
}

function interfaceFinanicalExpenseItemAdd(aParam, oResponse)
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
					
			aHTML[++h] = '<table id="tableInterfaceMainExpenseItemAddColumn2">';
	
			aHTML[++h] = '<tr id="trInterfaceMainExpenseItemAddAmount" class="interfaceMain">' +
							'<td id="tdInterfaceMainExpenseItemAddAmount" class="interfaceMain">' +
							'Amount' +
							'</td></tr>' +
							'<tr id="trInterfaceMainExpenseItemAddAmountValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainExpenseItemAddAmountValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainExpenseItemAddAmount" class="inputInterfaceMainText">' +
							'</td></tr>';
			
			aHTML[++h] = '<tr id="trInterfaceMainExpenseItemAddDescription" class="interfaceMain">' +
							'<td id="tdInterfaceMainExpenseItemAddDescription" class="interfaceMain">' +
							'Description' +
							'</td></tr>' +
							'<tr id="trInterfaceMainExpenseItemAddDescriptionValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainExpenseItemAddDescriptionValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainExpenseItemAddDescription" class="inputInterfaceMainText">' +
							'</td></tr>';
											
			aHTML[++h] = '<tr id="trInterfaceMainExpenseItemAddReference" class="interfaceMain">' +
							'<td id="tdInterfaceMainExpenseItemAddReference" class="interfaceMain">' +
							'Account' +
							'</td></tr>' +
							'<tr id="trInterfaceMainExpenseItemAddReferenceValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainExpenseItemAddReferenceValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainExpenseItemAddReference" class="inputInterfaceMainText">' +
							'</td></tr>';
			
			aHTML[++h] = '<tr id="trInterfaceMainExpenseItemAdd" class="interfaceMain">' +
							'<td id="tdInterfaceMainExpenseItemAddSearch" class="interfaceMain" title="Enter a code or title and click search">' +
							'<span id="spanInterfaceMainExpenseItemAddSearch">Search</span>' +
							'</td></tr>';
			
			aHTML[++h] = '</table>';
			
			aHTML[++h] = '<table style="margin-top:15px;">';
			
			aHTML[++h] = '<tr>' +
							'<td id="tdInterfaceMainExpenseItemAddSearchResults">' +
							'</td></tr>';
											
			aHTML[++h] = '</table>';		
			
			$('#tdInterfaceMainItemColumn2').html(aHTML.join(''));

			$('#spanInterfaceMainExpenseItemAddSearch').button(
			{
				label: "Search"
			})
			.click(function() {
				interfaceFinanicalExpenseItemAdd($.extend(true, aParam, {step: 2}))
			})
				
			$('#inputInterfaceMainExpenseItemAddAmount').focus();
		}
		if (iStep == 2)
		{	
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
			oSearch.addField('title');
			oSearch.addFilter('title', 'STRING_IS_LIKE', $('#inputInterfaceMainExpenseItemAddReference').val());
			oSearch.sort('title', 'asc');
			oSearch.getResults(function(data){interfaceFinanicalExpenseItemAdd($.extend(true, aParam, {step:3}), data)});
		}
	}
	else
	{
		var aHTML = [];
		var h = -1;

		if (oResponse.data.rows.length == 0)	
		{
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" style="margin-top:15px; margin-bottom:15px;">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceActions">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">No accounts.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainOrderProductsColumn1').html(aHTML.join(''));		
		}
		else
		{	
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;">';
			aHTML[++h] = '<tbody>'
			
			$.each(oResponse.data.rows, function() 
			{ 
				aHTML[++h] = '<tr class="interfaceMainRow">';	
							
				aHTML[++h] = '<td id="tdExpenseItems_title-' + this.id + '" class="interfaceMainRow">' +
										this.title + '</td>';						
						
				aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';	
				aHTML[++h] = '<span id="spanExpenseItems_options_add-' + this.id + '" class="interfaceMainRowOptionsAdd"></span>';
				aHTML[++h] = '</td>';
														
				aHTML[++h] = '</tr>';	
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainExpenseItemAddSearchResults').html(aHTML.join(''))
			
			$('.interfaceMainRowOptionsAdd').button({
				text: false,
				icons: {
					primary: "ui-icon-plus"
				}
			})
			.click(function()
			{
				var sID = this.id;
				var aID = sID.split('-');
				var iAccount = aID[1];
				var cAmount = $('#inputInterfaceMainExpenseItemAddAmount').val();
				if (cAmount == '') {cAmount = 0};
				
				var sData = 'object=' + giObject;
				sData += '&objectcontext=' + giObjectContext;
				sData += '&financialaccount=' + iAccount;
				sData += '&amount=' + cAmount;
				sData += '&description=' + $('#inputInterfaceMainExpenseItemAddDescription').val();
					
				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/financial/?method=FINANCIAL_ITEM_MANAGE',
					data: sData,
					dataType: 'json',
					success: function(oResponse)
					{
						var sData = 'object=' + giObject;
						sData += '&objectcontext=' + giObjectContext;
						
						$.ajax(
						{
							type: 'POST',
							url: '/ondemand/financial/?method=FINANCIAL_ITEM_COMPLETE',
							data: sData,
							dataType: 'json',
							success: function(oResponse)
							{
								interfaceFinancialExpenseRefresh();
								interfaceFinancialExpenseItem();
							}
						});
					}
				});
			})
			.css('width', '20px')
			.css('height', '20px')
			
			$('input.itemadd:first').focus();
		}
	}	
}

function interfaceFinancialExpensePayment(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'divInterfaceMainPayment';
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
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainPaymentColumn2" class="interfaceMainColumn2Action" style="width: 300px;">' +
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
				 interfaceFinancialExpensePaymentAdd(aParam);
			})
			
		}
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_PAYMENT_EXPENSE_SEARCH';
		oSearch.addField('appliesdate,amount');
		oSearch.addFilter('expense', 'EQUAL_TO', iObjectContext);
		oSearch.sort('appliesdate', 'asc');
		oSearch.getResults(function(data) {interfaceFinancialExpensePayment(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableFinancialExpensePayment" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No Payments.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainPaymentColumn1').html(aHTML.join(''));
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
								
				aHTML[++h] = '<td id="tdFinancialLinePayment_date-' + this.id + '" class="interfaceMainRow">' +
										this.appliesdate + '</td>';
										
				aHTML[++h] = '<td id="tdFinancialLinePayment_amount-' + this.id + '" style="text-align:right;" class="interfaceMainRow">' +
										this.amount + '</td>';
										
				aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
					
				if (oOptions.remove)
				{	
					aHTML[++h] = '<span id="spanExpensePayment_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
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
					//interfaceFinancialExpensePaymentRemove({xhtmlElementID: this.id});
				})
				.css('width', '15px')
				.css('height', '17px')
			}
		}
	}	
}

function interfaceFinancialExpensePaymentAdd(aParam, oResponse)
{
	var iStep = 1;
	
	if (aParam != undefined)
	{
		if (aParam.step != undefined) {iStep = aParam.step}	
	}
	
	if (ns1blankspace.financial.bankaccounts.length == 0) {alert("No bank accounts set up.");return;}
	
	if (iStep == 1)
	{	
		$('#tdInterfaceMainPaymentColumn2').html(gsLoadingSmallXHTML)
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_PAYMENT_EXPENSE_SEARCH';
		oSearch.addField('amount');
		oSearch.addSummaryField('sum(amount) sumamount');
		oSearch.addFilter('expense', 'EQUAL_TO', giObjectContext);
		oSearch.rows = 1;
		oSearch.getResults(function(data){interfaceFinancialExpensePaymentAdd($.extend(true, aParam, {step:2}), data)});
	}
		
	if (iStep == 2)
	{
		cPaidAmount = oResponse.summary.sumamount;
		if (cPaidAmount == '') {cPaidAmount = 0}
		
		var aHTML = [];
		var h = -1;
				
		aHTML[++h] = '<table id="tableInterfaceMainExpensePaymentAddColumn2">';
		
		aHTML[++h] = '<tr id="trInterfaceMainExpensePaymentAdd" class="interfaceMain">' +
						'<td id="tdInterfaceMainExpensePaymentAddPaidAmount" class="interfaceMain"' +
						' data-paidamount="' + cPaidAmount + '">' +
						'$' + (cPaidAmount).formatMoney(2, ".", ",") + ' has been paid so far.'
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainExpensePaymentAdd" class="interfaceMain">' +
						'<td id="tdInterfaceMainExpensePaymentAddPaymentAmount" class="interfaceMain"' +
						'">' +
						'$' + (parseFloat((goObjectContext.amount).replace(",","")) - cPaidAmount).formatMoney(2, ".", ",") + ' remaining.'
						'</td></tr>';
														
		aHTML[++h] = '<tr class="interfaceMain">' +
						'<td id="tdInterfaceMainExpensePaymentAddBankAccount" class="interfaceMain">' +
						'Bank Account' +
						'</td></tr>' +
						'<tr id="trInterfaceMainExpensePaymentAddBankAccount" class="interfaceMainText">' +
						'<td id="tdInterfaceMainExpensePaymentAddBankAccountValue" class="interfaceMainRadio">';
	
		var iDefaultBankAccount;
		
		$.each(ns1blankspace.financial.bankaccounts, function()
		{
			if (iDefaultBankAccount == undefined) {iDefaultBankAccount = this.id}
			aHTML[++h] = '<input type="radio" id="radioBankAccount' + this.id + '" name="radioBankAccount" value="' + this.id + '"/>' +
								this.title + '<br />';				
		});
		
		aHTML[++h] = '</td></tr>';				
						
						
		aHTML[++h] = '<tr id="trInterfaceMainExpensePaymentAdd" class="interfaceMain">' +
						'<td id="tdInterfaceMainExpensePaymentAddFull" class="interfaceMain">' +
						'<span id="spanInterfaceMainExpensePaymentAddFull">Payment</span>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';
		
		aHTML[++h] = '<table style="margin-top:15px;">';
		
		aHTML[++h] = '<tr>' +
						'<td id="tdInterfaceMainExpensePaymentAddFullResults">' +
						'</td></tr>';
										
		aHTML[++h] = '</table>';		
			
		$('#tdInterfaceMainPaymentColumn2').html(aHTML.join(''));

		$('[name="radioBankAccount"][value="' + iDefaultBankAccount + '"]').attr('checked', true);
	
		$('#spanInterfaceMainExpensePaymentAddFull').button(
		{
			label: "Pay Full Amount"
		})
		.click(function() {
			interfaceFinancialExpensePaymentAdd($.extend(true, aParam, {step: 3, paidamount: cPaidAmount}))
		});
	}
	
	if (iStep == 3)
	{
		$('#tdInterfaceMainExpensePaymentAddFull').html(gsLoadingSmallXHTML);
				
		var cAmount = goObjectContext.amount - cPaidAmount;
		
		var sData = 'bankaccount=' + interfaceMasterFormatSave($('input[name="radioBankAccount"]:checked').val());
		sData += '&amount=' + cAmount;
		sData += '&receiveddate=' + Date.today().toString("dd-MMM-yyyy");
		sData += '&paymentmethod=3'; //todo
		sData += '&contactbusinessreceivedfrom=' + goObjectContext.contactbusinesssentto;	
		sData += '&contactpersonreceivedfrom=' + goObjectContext.contactpersonsentto;
				
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/financial/?method=FINANCIAL_PAYMENT_MANAGE',
			data: sData,
			dataType: 'json',
			success: function(data)
			{
				interfaceFinancialExpensePaymentAdd($.extend(true, aParam, {step: 4, amount: cAmount}), data)
			}
		});	
	}
	
	if (iStep == 4)
	{
		var cAmount = 0;
		
		if (aParam != undefined)
		{
			if (aParam.amount != undefined) {cAmount = aParam.amount}	
		}
		
		var iRecieptID = oResponse.id;
		
		var sData = 'expense=' + giObjectContext;
		sData += '&amount=' + cAmount;
		sData += '&appliesdate=' + Date.today().toString("dd-MMM-yyyy");
		sData += '&payment=' + iPaymentID;
				
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/financial/?method=FINANCIAL_PAYMENT_EXPENSE_MANAGE',
			data: sData,
			dataType: 'json',
			success: function(data)
			{
				interfaceFinancialExpensePaymentAdd($.extend(true, aParam, {step: 5}), data)
			}
		});	
	}
}

function interfaceFinancialExpenseRefresh(oResponse)
{
	if (oResponse == undefined)
	{
		$('#spanInterfaceViewportControlSubContext_amount').html(gsLoadingSmallXHTML);
			
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
		oSearch.addField('accrueddate,amount,tax');
		oSearch.rf = 'json';
		oSearch.addFilter('id', 'EQUAL_TO', giObjectContext);
		
		oSearch.getResults(function(data) {interfaceFinancialExpenseRefresh(data)});
	}
	else
	{
		var oObjectContext = oResponse.data.rows[0];
				
		goObjectContext.accrueddate = oObjectContext.accrueddate;
		goObjectContext.amount = oObjectContext.amount;
				
		$('#spanInterfaceViewportControlSubContext_accrueddate').html(oObjectContext.accrueddate);
		$('#spanInterfaceViewportControlSubContext_amount').html(oObjectContext.amount);
	}
}