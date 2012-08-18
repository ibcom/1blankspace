function interfaceFinancialInvoiceMasterViewport(aParam)
{
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}

	interfaceFinancialMasterInitialise();

	giObject = 5;
	gsObjectName = 'Financial Invoice';
	goObjectContext = undefined;
	giObjectContext = -1;
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialInvoiceMasterViewport({showHome: true});',
			move: false
			})		
	}	
			
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Invoices"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceFinancialInvoiceSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceFinancialInvoiceSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceFinancialInvoiceSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceFinancialInvoiceNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceFinancialInvoiceNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceFinancialInvoiceSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceFinancialInvoiceSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceFinancialInvoiceSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceFinancialInvoiceSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceFinancialInvoiceHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceFinancialInvoiceHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceFinancialInvoiceSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceFinancialInvoiceSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	if (bShowHome) {interfaceFinancialInvoiceHomeShow()};	
}

function interfaceFinancialInvoiceHomeShow(oResponse)
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
		oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
		oSearch.addField('reference,description,contactbusinesssenttotext,contactpersonsenttotext,duedate,amount');
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		oSearch.getResults(interfaceFinancialInvoiceHomeShow);
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialInvoiceHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialInvoiceHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialInvoiceHomeMostLikelyNothing">Click New to create a invoice.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialInvoiceHomeMostLikely">';
			
			$.each(oResponse.data.rows, function()
			{					
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceFinancialInvoiceHomeMostLikely_Title-' + this.id + '" class="interfaceHomeMostLikely" style="width:50px;">' +
										this.reference + '</td>';
				
				aHTML[++h] = '<td id="interfaceFinancialInvoiceHomeMostLikely_Amount-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:50px;text-align:right;">' +
										'$' + this.amount + '</td>';
														
				aHTML[++h] = '<td id="interfaceFinancialInvoiceHomeMostLikely_DueDate-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:90px;">' +
										this.duedate + '</td>';
																						
				var sContact = this.contactbusinesssenttotext
				if (sContact == '') {sContact = this.contactpersonsenttotext}
				
				aHTML[++h] = '<td id="interfaceFinancialInvoiceHomeMostLikely_Contact-' + this.id + '" class="interfaceHomeMostLikelySub">' +
										sContact + '</td>';
					
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceProjectHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceFinancialInvoiceSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceFinancialInvoiceSearch(sXHTMLElementId, aParam)
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
		oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
		oSearch.addField('contactbusinesssenttotext,contactbusinesssentto,contactpersonsenttotext,contactpersonsentto,' +
								'projecttext,project,projecttext,areatext,' +
								'object,objectcontext,' +
								'area,reference,purchaseorder,sentdate,duedate,description,amount,tax,sent');
		oSearch.rf = 'json';
		oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
		
		oSearch.getResults(function(data) {interfaceFinancialInvoiceShow(aParam, data)});
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
			oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
			oSearch.addField('contactbusinesssenttotext,contactbusinesssentto,contactpersonsenttotext,contactpersonsentto,projecttext,project,projecttext,areatext,' +
								'area,reference,purchaseorder,sentdate,duedate,description,amount,tax,sent');
			oSearch.rf = 'json';
			oSearch.addFilter('quicksearch', 'STRING_IS_LIKE', sSearchText);
			
			oSearch.getResults(function(data) {interfaceFinancialInvoiceSearchShow(aParam, data)});	
		}
	};	
}

function interfaceFinancialInvoiceSearchShow(aParam, oResponse)
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
			interfaceFinancialInvoiceSearch(event.target.id, {source: 1});
		});
	}	
			
}

function interfaceFinancialInvoiceViewport()
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
					
		aHTML[++h] = '<tr id="trInterfaceViewportControlReceipts" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlReceipts" class="interfaceViewportControl">Receipts</td>' +
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
	aHTML[++h] = '<div id="divInterfaceMainReceipt" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainTransaction" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceFinancialInvoiceSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceFinancialInvoiceDetails();
	});
	
	$('#tdInterfaceViewportControlItem').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainItem", true);
		interfaceFinancialInvoiceItem();
	});
	
	$('#tdInterfaceViewportControlCredits').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainCredits", true);
		interfaceFinancialInvoiceCredit();
	});
	
	$('#tdInterfaceViewportControlReceipts').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainReceipt", true);
		interfaceFinancialInvoiceReceipt();
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

function interfaceFinancialInvoiceShow(aParam, oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceFinancialInvoiceViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the invoice.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
		
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
				
		$('#divInterfaceViewportControlContext').html(goObjectContext.reference +
			'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_sentdate">' + goObjectContext.sentdate + '</span>' +
			'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_amount">$' + goObjectContext.amount + '</span>');
			
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialInvoiceMasterViewport({showHome: false});interfaceFinancialInvoiceSearch("-' + giObjectContext + '")',
			move: false
			})
		
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceFinancialInvoiceSummary()'});
	}	
}		
		
function interfaceFinancialInvoiceSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the invoice.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{

		if (ns1blankspace.financial.invoiceTemplateXHTML == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'DOCUMENT_SEARCH';
			oSearch.addField('title,content');
			oSearch.addFilter('type', 'EQUAL_TO', 10);

			oSearch.getResults(function(data)
			{
				var oResponse = data;

				if (oResponse.data.rows.length == 0)
				{
					ns1blankspace.financial.invoiceTemplateXHTML = '';
				}
				else
				{
					ns1blankspace.financial.invoiceTemplateXHTML = (oResponse.data.rows[0].content).formatXHTML();
					ns1blankspace.financial.invoiceTemplateDocumentID = oResponse.data.rows[0].id;
				}

				interfaceFinancialInvoiceSummaryDefault();

			});		
		}
		else
		{
			interfaceFinancialInvoiceSummaryDefault();
		}
	}	
}

function interfaceFinancialInvoiceSummaryDefault(aParam)
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the invoice.</td></tr>';
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
	
		if (ns1blankspace.financial.invoiceTemplateXHTML != '')
		{
			aHTML[++h] = interfaceFormatRender({xhtmlTemplate: ns1blankspace.financial.invoiceTemplateXHTML});
			console.log(interfaceFormatRender({xhtmlTemplate: ns1blankspace.financial.invoiceTemplateXHTML}));
		}
		else
		{
			aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
			
			if (goObjectContext.amount != '')
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryAmountValue" class="interfaceMainSummaryValue" style="font-size:1.5em;font-weight:bold;">';
				aHTML[++h] = '$' + goObjectContext.amount;
				aHTML[++h] = '</td></tr>';
			}	
			
			if (goObjectContext.contactbusinesssenttotext != '')
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryBusiness" class="interfaceMainSummary">Business</td></tr>' +
							'<tr><td id="tdInterfaceMainSummaryBusinessValue" class="interfaceMainSummaryValue">' +
							goObjectContext.contactbusinesssenttotext +
							'</td></tr>';
			}
			
			if (goObjectContext.contactpersonsenttotext != '')
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPerson" class="interfaceMainSummary">Person</td></tr>' +
							'<tr><td id="tdInterfaceMainSummaryPersonValue" class="interfaceMainSummaryValue">' +
							goObjectContext.contactpersonsenttotext +
							'</td></tr>';
			}
			
			if (goObjectContext.sent == 'Y')
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySentDate" class="interfaceMainSummary">Sent Date</td></tr>' +
							'<tr><td id="tdInterfaceMainSummarySentDateValue" class="interfaceMainSummaryValue">' +
							goObjectContext.sentdate +
							'</td></tr>';		

				aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDueDate" class="interfaceMainSummary">Due Date</td></tr>' +
							'<tr><td id="tdInterfaceMainSummaryDueDateValue" class="interfaceMainSummaryValue">' +
							goObjectContext.duedate +
							'</td></tr>';		
			}
			else
			{	
				aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySentDate" class="interfaceMainSummary">Sent Date</td></tr>' +
							'<tr><td id="tdInterfaceMainSummarySentDateValue" class="interfaceMainSummaryValue">' +
							'Has not been sent.' +
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
		
		}

		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
								
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryViewPDF" class="interfaceMainColumn2Action">' +
						'<a href="#" id="aInterfaceMainSummaryViewPDF">View&nbsp;As&nbsp;PDF</a>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
		
		$('#aInterfaceMainSummaryViewPDF').click(function(event)
		{
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/core/?method=CORE_PDF_CREATE',
				data: 'object=' + giObject + '&objectcontext=' + giObjectContext,
				dataType: 'json',
				success: function(oResponse) {alert('PDF Created')}
			});
		});
	}	
}

function interfaceFinancialInvoiceDetails()
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
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsPurchaseOrderReference" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPurchaseOrderReference" class="interfaceMain">' +
						'Purchase Order Number' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsPurchaseOrderReferenceValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsPurchaseOrderReferenceValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsPurchaseOrderReference" class="inputInterfaceMainText">' +
						'</td></tr>';							
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSentToBusiness" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSentToBusiness" class="interfaceMain">' +
						'Business' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSentToBusinessValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsSentToBusinessValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsSentToBusiness" class="inputInterfaceMainSelect"' +
							' data-method="CONTACT_BUSINESS_SEARCH"' +
							' data-columns="tradename">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSentToPerson" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSentToPerson" class="interfaceMain">' +
						'Person' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSentToPersonValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsSentToPersonValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsSentToPerson" class="inputInterfaceMainSelect"' +
							' data-method="CONTACT_PERSON_SEARCH"' +
							' data-columns="surname"' +
							' data-parent="inputInterfaceMainDetailsSentToBusiness"' +
							' data-parent-search-id="contactbusiness"' +
							' data-parent-search-text="tradename">' +
						'</td></tr>';				
							
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSentDate" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSentDate" class="interfaceMain">' +
						'Sent Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSentDateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSentDateValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsSentDate" class="inputInterfaceMainDate">' +
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
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSent" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSent" class="interfaceMain">' +
						'Sent' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSent" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSentValue" class="interfaceMainRadio" style="height:33px;">' +
						'<input type="radio" id="radioSentN" name="radioSent" value="N"/>No' +
						'&nbsp;&nbsp;<input type="radio" id="radioSentY" name="radioSent" value="Y"/>Yes' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
						'Description' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsReference').val(goObjectContext.reference);
			$('#inputInterfaceMainDetailsPurchaseOrderReference').val(goObjectContext.purchaseorder);
			$('#inputInterfaceMainDetailsSentToBusiness').attr('data-id', goObjectContext.contactbusinesssentto);
			$('#inputInterfaceMainDetailsSentToBusiness').val(goObjectContext.contactbusinesssenttotext);
			$('#inputInterfaceMainDetailsSentToPerson').attr('data-id', goObjectContext.contactpersonsentto);
			$('#inputInterfaceMainDetailsSentToPerson').val(goObjectContext.contactpersonsenttotext);	
			$('[name="radioSent"][value="' + goObjectContext.sent + '"]').attr('checked', true);
			$('#inputInterfaceMainDetailsSentDate').val(goObjectContext.sentdate);
			$('#inputInterfaceMainDetailsDueDate').val(goObjectContext.duedate);
			$('#inputInterfaceMainDetailsDescription').val(goObjectContext.description);
		}
		else
		{
			$('[name="radioSent"][value="N"]').attr('checked', true);
		}
	}	
}

function interfaceFinancialInvoiceSave(aParam, oResponse)
{
	if (oResponse == undefined)
	{
		interfaceMasterStatusWorking();
		
		var sData = (giObjectContext == -1)?'':'id=' + giObjectContext;
			
		if ($('#divInterfaceMainDetails').html() != '')
		{
			sData += '&reference=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsReference').val());
			sData += '&purchaseorder=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsPurchaseOrderReference').val());
			sData += '&sentdate=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsSentDate').val());
			sData += '&duedate=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDueDate').val());
			sData += '&description=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDescription').val());
			sData += '&contactbusinesssentto=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsSentToBusiness').attr("data-id"));
			sData += '&contactpersonsentto=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsSentToPerson').attr("data-id"));
		}
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/financial/?method=FINANCIAL_INVOICE_MANAGE',
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceFinancialInvoiceSave(aParam, data)}
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
				interfaceFinancialInvoiceSearch('-' + giObjectContext, {source: 1});
			}	
		}
		else
		{
			interfaceMasterError('Could not save the invoice!');
		}
	}	
}

function interfaceFinancialInvoiceNew(aParam)
{
	goObjectContext = undefined
	giObjectContext = -1;
	interfaceFinancialInvoiceViewport();
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	interfaceFinancialInvoiceDetails();
}

function interfaceFinancialInvoiceItem(aParam, oResponse)
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
				 interfaceFinanicalInvoiceItemAdd(aParam);
			})
			
		}
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_ITEM_SEARCH';
		oSearch.addField('financialaccounttext,tax,issuedamount,amount,description');
		oSearch.addFilter('object', 'EQUAL_TO', giObject);
		oSearch.addFilter('objectcontext', 'EQUAL_TO', giObjectContext);
		oSearch.sort('financialaccounttext', 'asc');
		
		oSearch.getResults(function(data) {interfaceFinancialInvoiceItem(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableFinancialInvoiceItem" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
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
					aHTML[++h] = '<span id="spanInvoiceItem_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				};	
					
				if (oOptions.view)
				{	
					aHTML[++h] = '<span id="spanInvoiceItem_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
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
					interfaceFinancialInvoiceItemRemove({xhtmlElementID: this.id});
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
					interfaceFinancialInvoiceItemAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function interfaceFinancialInvoiceItemRemove(aParam, oResponse)
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
					success: function(data){interfaceFinancialInvoiceRefresh()}
				});
				
				interfaceFinancialInvoiceItemRemove(aParam, data)
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

function interfaceFinanicalInvoiceItemAdd(aParam, oResponse)
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
					
			aHTML[++h] = '<table id="tableInterfaceMainInvoiceItemAddColumn2">';
	
			aHTML[++h] = '<tr id="trInterfaceMainInvoiceItemAddAmount" class="interfaceMain">' +
							'<td id="tdInterfaceMainInvoiceItemAddAmount" class="interfaceMain">' +
							'Amount' +
							'</td></tr>' +
							'<tr id="trInterfaceMainInvoiceItemAddAmountValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainInvoiceItemAddAmountValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainInvoiceItemAddAmount" class="inputInterfaceMainText">' +
							'</td></tr>';
			
			aHTML[++h] = '<tr id="trInterfaceMainInvoiceItemAddDescription" class="interfaceMain">' +
							'<td id="tdInterfaceMainInvoiceItemAddDescription" class="interfaceMain">' +
							'Description' +
							'</td></tr>' +
							'<tr id="trInterfaceMainInvoiceItemAddDescriptionValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainInvoiceItemAddDescriptionValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainInvoiceItemAddDescription" class="inputInterfaceMainText">' +
							'</td></tr>';
											
			aHTML[++h] = '<tr id="trInterfaceMainInvoiceItemAddReference" class="interfaceMain">' +
							'<td id="tdInterfaceMainInvoiceItemAddReference" class="interfaceMain">' +
							'Account' +
							'</td></tr>' +
							'<tr id="trInterfaceMainInvoiceItemAddReferenceValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainInvoiceItemAddReferenceValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainInvoiceItemAddReference" class="inputInterfaceMainText">' +
							'</td></tr>';
			
			aHTML[++h] = '<tr id="trInterfaceMainInvoiceItemAdd" class="interfaceMain">' +
							'<td id="tdInterfaceMainInvoiceItemAddSearch" class="interfaceMain" title="Enter a code or title and click search">' +
							'<span id="spanInterfaceMainInvoiceItemAddSearch">Search</span>' +
							'</td></tr>';
			
			aHTML[++h] = '</table>';
			
			aHTML[++h] = '<table style="margin-top:15px;">';
			
			aHTML[++h] = '<tr>' +
							'<td id="tdInterfaceMainInvoiceItemAddSearchResults">' +
							'</td></tr>';
											
			aHTML[++h] = '</table>';		
			
			$('#tdInterfaceMainItemColumn2').html(aHTML.join(''));

			$('#spanInterfaceMainInvoiceItemAddSearch').button(
			{
				label: "Search"
			})
			.click(function() {
				interfaceFinanicalInvoiceItemAdd($.extend(true, aParam, {step: 2}))
			})
				
			$('#inputInterfaceMainInvoiceItemAddAmount').focus();
		}
		if (iStep == 2)
		{	
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
			oSearch.addField('title');
			oSearch.addFilter('title', 'STRING_IS_LIKE', $('#inputInterfaceMainInvoiceItemAddReference').val());
			oSearch.sort('title', 'asc');
			oSearch.getResults(function(data){interfaceFinanicalInvoiceItemAdd($.extend(true, aParam, {step:3}), data)});
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
							
				aHTML[++h] = '<td id="tdInvoiceItems_title-' + this.id + '" class="interfaceMainRow">' +
										this.title + '</td>';						
						
				aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';	
				aHTML[++h] = '<span id="spanInvoiceItems_options_add-' + this.id + '" class="interfaceMainRowOptionsAdd"></span>';
				aHTML[++h] = '</td>';
														
				aHTML[++h] = '</tr>';	
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainInvoiceItemAddSearchResults').html(aHTML.join(''))
			
			$('.interfaceMainRowOptionsAdd').button({
				text: false,
				icons: {
					primary: "ui-icon-plus"
				}
			})
			.click(function()
			{
				interfaceMasterStatusWorking();

				var sID = this.id;
				var aID = sID.split('-');
				var iAccount = aID[1];
				var cAmount = $('#inputInterfaceMainInvoiceItemAddAmount').val();
				if (cAmount == '') {cAmount = 0};
				
				var sData = 'object=' + giObject;
				sData += '&objectcontext=' + giObjectContext;
				sData += '&financialaccount=' + iAccount;
				sData += '&amount=' + cAmount;
				sData += '&description=' + interfaceMasterFormatSave($('#inputInterfaceMainInvoiceItemAddDescription').val());
					
				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/financial/?method=FINANCIAL_ITEM_MANAGE',
					data: sData,
					dataType: 'json',
					success: function(oResponse)
					{
						interfaceMasterStatus('Added.');

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
								interfaceFinancialInvoiceRefresh();
								interfaceFinancialInvoiceItem();
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

function interfaceFinancialInvoiceReceipt(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'divInterfaceMainReceipt';
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
					
		aHTML[++h] = '<table id="tableInterfaceMainReceipt" class="interfaceMain">' +
					'<tr id="trInterfaceMainReceiptRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainReceiptColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainReceiptColumn2" class="interfaceMainColumn2Action" style="width: 300px;">' +
					'</td>' +
					'</tr>' +
					'</table>';					
			
		$('#' + sXHTMLElementId).html(aHTML.join(''));
		
		if (oActions != undefined)
		{
				
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainReceiptColumn2" class="interfaceMainColumn2">';
			
			if (oActions.add)
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainReceiptAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainReceiptAdd">Add</span>' +
							'</td></tr>';
			}
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainReceiptColumn2').html(aHTML.join(''));
		
			$('#spanInterfaceMainReceiptAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				 interfaceFinancialInvoiceReceiptAdd(aParam);
			})
			
		}
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_RECEIPT_INVOICE_SEARCH';
		oSearch.addField('appliesdate,amount');
		oSearch.addFilter('invoice', 'EQUAL_TO', iObjectContext);
		oSearch.sort('appliesdate', 'asc');
		oSearch.getResults(function(data) {interfaceFinancialInvoiceReceipt(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableFinancialInvoiceReceipt" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No receipts.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainReceiptColumn1').html(aHTML.join(''));
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
								
				aHTML[++h] = '<td id="tdFinancialLineReceipt_date-' + this.id + '" class="interfaceMainRow">' +
										this.appliesdate + '</td>';
										
				aHTML[++h] = '<td id="tdFinancialLineReceipt_amount-' + this.id + '" style="text-align:right;" class="interfaceMainRow">' +
										this.amount + '</td>';
										
				aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
					
				if (oOptions.remove)
				{	
					aHTML[++h] = '<span id="spanInvoiceReceipt_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				};	
					
				aHTML[++h] = '</td>';				
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainReceiptColumn1').html(aHTML.join(''));
			
			if (oOptions.remove) 
			{
				$('.interfaceMainRowOptionsRemove').button( {
					text: false,
					icons: {
						primary: "ui-icon-close"
					}
				})
				.click(function() {
					//interfaceFinancialInvoiceReceiptRemove({xhtmlElementID: this.id});
				})
				.css('width', '15px')
				.css('height', '17px')
			}
		}
	}	
}

function interfaceFinancialInvoiceReceiptAdd(aParam, oResponse)
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
		oSearch.method = 'FINANCIAL_RECEIPT_INVOICE_SEARCH';
		oSearch.addField('amount');
		oSearch.addSummaryField('sum(amount) sumamount');
		oSearch.addFilter('invoice', 'EQUAL_TO', giObjectContext);
		oSearch.rows = 1;
		oSearch.getResults(function(data){interfaceFinancialInvoiceReceiptAdd($.extend(true, aParam, {step:2}), data)});
	}
		
	if (iStep == 2)
	{
		cReceiptedAmount = oResponse.summary.sumamount;
		if (cReceiptedAmount == '') {cReceiptedAmount = 0}
		
		var aHTML = [];
		var h = -1;
				
		aHTML[++h] = '<table id="tableInterfaceMainInvoiceReceiptAddColumn2">';
		
		aHTML[++h] = '<tr id="trInterfaceMainInvoiceReceiptAdd" class="interfaceMain">' +
						'<td id="tdInterfaceMainInvoiceReceiptAddReceiptedAmount" class="interfaceMain"' +
						' data-receiptedamount="' + cReceiptedAmount + '">' +
						'$' + (cReceiptedAmount).formatMoney(2, ".", ",") + ' has been receipted so far.'
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainInvoiceReceiptAdd" class="interfaceMain">' +
						'<td id="tdInterfaceMainInvoiceReceiptAddReceiptAmount" class="interfaceMain"' +
						'">' +
						'$' + (parseFloat((goObjectContext.amount).replace(",","")) - cReceiptedAmount).formatMoney(2, ".", ",") + ' remaining.'
						'</td></tr>';
														
		aHTML[++h] = '<tr class="interfaceMain">' +
						'<td id="tdInterfaceMainInvoiceReceiptAddBankAccount" class="interfaceMain">' +
						'Bank Account' +
						'</td></tr>' +
						'<tr id="trInterfaceMainInvoiceReceiptAddBankAccount" class="interfaceMainText">' +
						'<td id="tdInterfaceMainInvoiceReceiptAddBankAccountValue" class="interfaceMainRadio">';
	
		var iDefaultBankAccount;
		
		$.each(ns1blankspace.financial.bankaccounts, function()
		{
			if (iDefaultBankAccount == undefined) {iDefaultBankAccount = this.id}
			aHTML[++h] = '<input type="radio" id="radioBankAccount' + this.id + '" name="radioBankAccount" value="' + this.id + '"/>' +
								this.title + '<br />';				
		});
		
		aHTML[++h] = '</td></tr>';				
						
						
		aHTML[++h] = '<tr id="trInterfaceMainInvoiceReceiptAdd" class="interfaceMain">' +
						'<td id="tdInterfaceMainInvoiceReceiptAddFull" class="interfaceMain">' +
						'<span id="spanInterfaceMainInvoiceReceiptAddFull">Receipt</span>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';
		
		aHTML[++h] = '<table style="margin-top:15px;">';
		
		aHTML[++h] = '<tr>' +
						'<td id="tdInterfaceMainInvoiceReceiptAddFullResults">' +
						'</td></tr>';
										
		aHTML[++h] = '</table>';		
			
		$('#tdInterfaceMainReceiptColumn2').html(aHTML.join(''));

		$('[name="radioBankAccount"][value="' + iDefaultBankAccount + '"]').attr('checked', true);
	
		$('#spanInterfaceMainInvoiceReceiptAddFull').button(
		{
			label: "Receipt Full Amount"
		})
		.click(function() {
			interfaceFinancialInvoiceReceiptAdd($.extend(true, aParam, {step: 3, receiptedamount: cReceiptedAmount}))
		});
	}
	
	if (iStep == 3)
	{
		$('#tdInterfaceMainInvoiceReceiptAddFull').html(gsLoadingSmallXHTML);
				
		var cAmount = goObjectContext.amount - cReceiptedAmount;
		
		var sData = 'bankaccount=' + interfaceMasterFormatSave($('input[name="radioBankAccount"]:checked').val());
		sData += '&amount=' + cAmount;
		sData += '&receiveddate=' + Date.today().toString("dd-MMM-yyyy");
		sData += '&paymentmethod=3'; //todo
		sData += '&contactbusinessreceivedfrom=' + goObjectContext.contactbusinesssentto;	
		sData += '&contactpersonreceivedfrom=' + goObjectContext.contactpersonsentto;
				
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/financial/?method=FINANCIAL_RECEIPT_MANAGE',
			data: sData,
			dataType: 'json',
			success: function(data)
			{
				interfaceFinancialInvoiceReceiptAdd($.extend(true, aParam, {step: 4, amount: cAmount}), data)
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
		
		var sData = 'invoice=' + giObjectContext;
		sData += '&amount=' + cAmount;
		sData += '&appliesdate=' + Date.today().toString("dd-MMM-yyyy");
		sData += '&reciept=' + iReceiptID;
				
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/financial/?method=FINANCIAL_RECEIPT_INVOICE_MANAGE',
			data: sData,
			dataType: 'json',
			success: function(data)
			{
				interfaceFinancialInvoiceReceiptAdd($.extend(true, aParam, {step: 5}), data)
			}
		});	
	}
}

function interfaceFinancialInvoiceRefresh(oResponse)
{
	if (oResponse == undefined)
	{
		$('#spanInterfaceViewportControlSubContext_amount').html(gsLoadingSmallXHTML);
			
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
		oSearch.addField('sentdate,amount,tax');
		oSearch.rf = 'json';
		oSearch.addFilter('id', 'EQUAL_TO', giObjectContext);
		
		oSearch.getResults(function(data) {interfaceFinancialInvoiceRefresh(data)});
	}
	else
	{
		var oObjectContext = oResponse.data.rows[0];
			
		goObjectContext.sentdate = oObjectContext.sentdate;
		goObjectContext.amount = oObjectContext.amount;
				
		$('#spanInterfaceViewportControlSubContext_sentdate').html(oObjectContext.sentdate);
		$('#spanInterfaceViewportControlSubContext_amount').html(oObjectContext.amount);
	}
}

function interfaceInvoiceSent(sSent)
{

	if (sSent == undefined) {sSent = "N"}

	var oData = {	"fields":
					[
						{
							"name": "reference"
						},
						{
							"name": "sent"
						},
						{
							"name": "sentdate"
						}
					],
					"filters":
					[
						{
							"name": "sent",
							"comparison": "EQUAL_TO",
							"value1": sSent,
							"value2": ""
						}
					],
					"sorts":
					[
						{
							"name": "reference",
							"direction": "asc"
						}
					],
					"options":
					{
						"rf": "JSON",
						"rows": "100"
					}
				}

	$.ajax({
		url: "/rpc/financial/?method=FINANCIAL_INVOICE_SEARCH&advanced=1",
		type: 'POST',
		cache: false,
		dataType: 'json',
		data: JSON.stringify(oData),
		success: function(response)
		{
					
		}
	});			

}

