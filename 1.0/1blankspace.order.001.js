
$(function()
{
})

function interfaceOrderMasterViewport(aParam)
{
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}
	
	giObject = 43;
	goObjectContextXML = '';
	gsObjectName = 'Order';
	giObjectContext = -1;
	
	interfaceMasterReset();
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Orders"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceOrderSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceOrderSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceOrderSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceOrderNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceOrderNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceOrderave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceOrderSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceOrderSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceOrderSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceOrderHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceOrderHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceOrderSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceOrderSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	
	if (bShowHome) {interfaceOrderHomeShow()};
	
}

function interfaceOrderHomeShow(oXML)
{

	if (oXML == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceOrderHomeMostLikely" class="interfaceViewportMain">' +
						gsLoadingXHTML + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportOrderLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'product';
		oSearch.method = 'PRODUCT_SEARCH';
		
		oSearch.addField('reference,title');
		oSearch.async = false;
		oSearch.rf = 'xml';
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		
		//oSearch.getResults(interfaceProductHomeShow);
		
		sParam = 'method=PRODUCT_ORDER_SEARCH&rows=10';
		sParam += '&hourssincecreated=500';

		$.ajax(
		{
			type: 'GET',
			url: '/directory/ondemand/product.asp?rf=XML&' + sParam,
			dataType: 'xml',
			success: interfaceOrderHomeShow
		});
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		var oRoot = oXML.getElementsByTagName("ondemand").item(0);
		
		if (oRoot.childNodes.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceOrderHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceOrderHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceOrderHomeMostLikelyNothing">Click New to create a order.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceOrderHomeMostLikely">';
			aHTML[++h] = '<tr>';
			aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
			aHTML[++h] = '</tr>';
			
			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceProjectHomeMostLikely_Title-' + onDemandXMLGetData(oRow, "id") + 
										'" class="interfaceHomeMostLikely">' +
										onDemandXMLGetData(oRow, "reference") +
										'</td>';
				
				aHTML[++h] = '</tr>'
			}
			
				aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceOrderHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceOrderSearch(event.target.id, {source: 1});
		});
	}
}


function interfaceOrderSearch(sXHTMLElementId, aParam)
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
		var sParam = 'method=ORDER_SEARCH&id=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/directory/ondemand/object.asp?' + sParam,
			dataType: 'xml',
			success: function(data){interfaceOrderShow(aParam, data)}
		});
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
			sSearchText = aSearch[1];
			if (sSearchText == '#') {sSearchText = '[0-9]'}
			sElementId = 'tableInterfaceViewportMasterBrowse';
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == giSearchSource_BROWSE)
		{
			
			interfaceMasterOptionsSetPosition(sElementId);
			interfaceMasterSearchStart(sElementId);
			
			var sParam = 'method=ORDER_SEARCH&quicksearch=' + sSearchText + 
								'&xhtmlcontext=' + sXHTMLElementId;

			$.ajax(
			{
				type: 'GET',
				url: '/directory/ondemand/object.asp?' + sParam,
				dataType: 'xml',
				success: function(data) {interfaceOrderSearchShow(aParam, data)}
			});
			
		}
	};	
}

function interfaceOrderSearchShow(aParam, oXML)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	var oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		$('#divInterfaceMasterViewportControlOptions').hide();
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
		
		aHTML[++h] = '<table class="interfaceSearchMedium">';
		aHTML[++h] = '<tbody>'
			
		for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
		{
			
			var oRow = oRoot.childNodes.item(iRow);
			
			iColumn = iColumn + 1;
			
			if (iColumn == 1)
			{
				aHTML[++h] = '<tr class="interfaceSearch">';
			}
			
			aHTML[++h] = '<td class="interfaceContactType' + onDemandXMLGetData(oRow, "type") + ' interfaceSearch">&nbsp;</td>';
			aHTML[++h] = '<td class="interfaceSearch" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
							'-' + onDemandXMLGetData(oRow, "id") + '">' +
							onDemandXMLGetData(oRow, "reference") +
							'</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		}
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		var oElement = $('#inputInterfaceMasterViewportControlSearch');
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceOrderSearch(event.target.id, {source: 1});
		});
	}	
			
}

function interfaceOrderViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlAddress" class="interfaceViewportControl">Addresses</td>' +
					'</tr>';
		
	aHTML[++h] = '<tr id="trInterfaceViewportControlProducts" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlProducts" class="interfaceViewportControl">Items</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlStatus" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlStatus" class="interfaceViewportControl">Status</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlDelivery" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDelivery" class="interfaceViewportControl">Delivery</td>' +
					'</tr>';
	
	aHTML[++h] = '</table>';					
	
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlInvoices" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlInvoices" class="interfaceViewportControl">Invoices</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControlCredits" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlCredits" class="interfaceViewportControl">Credits</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControlSupplierOrders" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSupplierOrders" class="interfaceViewportControl">Supplier Orders</td>' +
					'</tr>';
					
	aHTML[++h] = '</table>';					
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlActions" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlActions" class="interfaceViewportControl">Actions</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControlAttachments" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
					'</tr>';
					
	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAddress" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainProducts" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainStatus" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDelivery" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainInvoices" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainCredits" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainSupplierOrders" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceOrderSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceOrderDetails();
	});
	
	$('#tdInterfaceViewportControlPricing').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAddress");
		interfaceOrderAddress("divInterfaceMainAddress", true);
	});
	
	$('#tdInterfaceViewportControlSupplier').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainProducts");
		interfaceOrderProducts("divInterfaceMainProducts", true);
	});
	
	$('#tdInterfaceViewportControlStock').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainStatus");
		interfaceOrderStatus("divInterfaceMainStatus", true);
	});
	
	$('#tdInterfaceViewportControlDelivery').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDelivery");
		interfaceOrderDelivery("divInterfaceMainDelivery", true);
	});
	
	$('#tdInterfaceViewportControlInvoices').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainInvoices");
		interfaceOrderInvoices("divInterfaceMainInvoices", true);
	});
	
	$('#tdInterfaceViewportControlCredits').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainCredits");
		interfaceOrderCredits("divInterfaceMainCreditNotes", true);
	});
	
	$('#tdInterfaceViewportControlSupplierOrders').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSupplierOrders");
		interfaceOrderSupplierOrders("divInterfaceMainSupplierOrders", true);
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

function interfaceOrderShow(aParam, oXML)
{

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceOrderViewport();
	
	goObjectContextXML = oXML;
	
	var aHTML = [];
	var h = -1;
	
	oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the order.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
				
		$('#divInterfaceViewportControlContext').html(onDemandXMLGetData(oRow, 'reference'));

		interfaceOrderSummary();
	}	
}		
		
function interfaceOrderSummary()
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
	
	var oXML = goObjectContextXML;
	
	oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	var aHTML = [];
	var h = -1;
	
	if (oRoot.childNodes.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find order.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryOrderDate" class="interfaceMainSummary">Order Date</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryOrderDateValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'orderdate') +
						'</td></tr>';
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDeliveryDate" class="interfaceMainSummary">Delivery Date</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDeliveryDateValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'deliverydate') +
						'</td></tr>';
					
		if (onDemandXMLGetData(oRow, 'sourcetext') != '')
		{	
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySource" class="interfaceMainSummary">Source</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarySourceValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'sourcetext') +
						'</td></tr>';				
		}
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
								
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryApproveOrder" class="interfaceMainColumn2Action">' +
						'<a href="#" id="aInterfaceMainSummaryApproveOrder">Approve&nbsp;Order</a>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
		
		$('#aInterfaceMainSummaryApproveOrder').click(function(event)
		{
			interfaceOrderApproveOrder();
		});
	}	
}

function interfaceOrderDetails()
{
	var aHTML = [];
	var h = -1;
	
	oRoot = goObjectContextXML.getElementsByTagName('ondemand').item(0);
	
	if ($('#divInterfaceMainDetails').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainDetails').attr('onDemandLoading', '');
		
		var oRow = oRoot.childNodes.item(0);
				
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
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsReference" class="inputInterfaceMainText">' +
						'</td></tr>';			
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsPurchaseOrderReference" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPurchaseOrderReference" class="interfaceMain">' +
						'Purchase Order Number' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsPurchaseOrderReferenceValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsPurchaseOrderReferenceValue" class="interfaceMainSelect">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsPurchaseOrderReference" class="inputInterfaceMainText">' +
						'</td></tr>';							
				
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSource" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSource" class="interfaceMain">' +
						'Source' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSource" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSourceValue" class="interfaceMainText">' +
						'<input type="radio" id="radioSource1" name="radioSource" value="1"/>Manually Entered' +
						'<br /><input type="radio" id="radioSource2" name="radioSource" value="2"/>Web Order' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (oRoot.childNodes.length != 0)
		{
			$('#inputInterfaceMainDetailsReference').val(onDemandXMLGetData(oRow, 'reference'));
			$('#inputInterfaceMainDetailsPurchaseOrderReference').val(onDemandXMLGetData(oRow, 'purchaseorderreference'));
			$('[name="radioSource"][value="' + onDemandXMLGetData(oRow, 'source') + '"]').attr('checked', true);
		}
			else
		{
			$('[name="radioSource"][value="1"]').attr('checked', true);
		}
	}	
}

function interfaceOrderSave()
{

	var sParam = '/directory/ondemand/object.asp?method=ORDER_MANAGE'
	var sData = (glObjectContext == -1)?'':'&id=' + glObjectContext;
		
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&reference=' + $('#inputInterfaceMainDetailsReference').val();
	}
	
	interfaceMasterSave(sParam, sData, 'Order Saved');
		
}
