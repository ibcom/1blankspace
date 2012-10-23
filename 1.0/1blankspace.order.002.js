
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
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceOrderMasterViewport({showHome: true});',
			move: false
			})		
	}
	
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
		interfaceOrderSave();
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
		oSearch.method = 'PRODUCT_ORDER_SEARCH';
		
		oSearch.addField('reference');
		oSearch.async = false;
		oSearch.rf = 'xml';
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		
		oSearch.getResults(interfaceOrderHomeShow);
		
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
		
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'product';
		oSearch.method = 'PRODUCT_ORDER_SEARCH';
		
		oSearch.addField('reference,orderbybusinesstext,orderbybusiness,orderbypersontext,orderbyperson,billtobusinesstext,billtobusiness,billtoperson,' +
							'salespersontext,salesperson,projecttext,project,areatext,area,' +
							'purchaseorder,orderdate,deliverydate,statustext,status,processingstatustext,processingstatus,sourcetext,source,' +
							'notes,deliveryaddresscombined,deliveryaddress1,deliveryaddress2,deliverysuburb,deliverystate,deliverypostcode,deliverycountry,' +
							'billingaddresscombined,billingaddress1,billingaddress2,billingsuburb,billingstate,billingpostcode,billingcountry,' +
							'createdusertext,createduser,createddate,modifiedusertext,modifieduser,modifieddate');
		
		oSearch.rf = 'xml';
		oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
				
		oSearch.getResults(function(data){interfaceOrderShow(aParam, data)});
		
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
			
			var oSearch = new AdvancedSearch();
			oSearch.endPoint = 'product';
			oSearch.method = 'PRODUCT_ORDER_SEARCH';
			
			oSearch.addField('reference,orderbybusinesstext,orderbybusiness,orderbypersontext,orderbyerson,billtobusinesstext,billtobusiness,billtoperson,' +
								'salespersontext,salesperson,projecttext,project,areatext,area,' +
								'purchaseorder,orderdate,deliverydate,statustext,status,processingstatustext,processingstatus,sourcetext,source,' +
								'notes,deliveryaddresscombined,deliveryaddress1,deliveryaddress2,deliverysuburb,deliverystate,deliverypostcode,deliverycountry,' +
								'billingaddresscombined,billingaddress1,billingaddress2,billingsuburb,billingstate,billingpostcode,billingcountry,' +
								'createdusertext,createduser,createddate,modifiedusertext,modifieduser,modifieddate');
			
			oSearch.rf = 'xml';
			oSearch.addFilter('reference', 'STRING_IS_LIKE', sSearchText);
					
			oSearch.getResults(function(data) {interfaceOrderSearchShow(aParam, data)});
			
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
					'<td id="tdInterfaceViewportControlAddress" class="interfaceViewportControl">Address</td>' +
					'</tr>';
		
	aHTML[++h] = '<tr id="trInterfaceViewportControlProducts" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlProducts" class="interfaceViewportControl">Items</td>' +
					'</tr>';
	
	aHTML[++h] = '</table>';				
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlStatus" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlStatus" class="interfaceViewportControl">Status</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlDelivery" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDelivery" class="interfaceViewportControl">Deliveries</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControlDeliveryPick" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDeliveryPick" class="interfaceViewportControl">Pick</td>' +
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
	aHTML[++h] = '<div id="divInterfaceMainDeliveryPick" class="divInterfaceViewportMain"></div>';
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
	
	$('#tdInterfaceViewportControlAddress').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAddress");
		interfaceOrderAddress("divInterfaceMainAddress");
	});
	
	$('#tdInterfaceViewportControlProducts').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainProducts");
		interfaceOrderProducts();
	});
	
	$('#tdInterfaceViewportControlSupplier').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSupplier");
		interfaceOrderSupplier();
	});
	
	$('#tdInterfaceViewportControlStock').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainStatus");
		interfaceOrderStatus();
	});
	
	$('#tdInterfaceViewportControlDelivery').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDelivery");
		interfaceOrderDelivery();
	});
	
	$('#tdInterfaceViewportControlDeliveryPick').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDeliveryPick");
		interfaceOrderDeliveryPick();
	});
	
	$('#tdInterfaceViewportControlInvoices').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainInvoices");
		interfaceOrderInvoices();
	});
	
	$('#tdInterfaceViewportControlCredits').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainCredits");
		interfaceOrderCredits();
	});
	
	$('#tdInterfaceViewportControlSupplierOrders').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSupplierOrders");
		interfaceOrderSupplierOrders();
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

		interfaceMasterViewportDestination({
			newDestination: 'interfaceOrderMasterViewport({showHome: false});interfaceOrderSearch("-' + giObjectContext + '")',
			move: false
			})
		
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceOrderSummary()'});
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
						
		if (onDemandXMLGetData(oRow, 'deliverydate') != '')
		{				
			//var dDeliveryDate = new Date(onDemandXMLGetData(oRow, 'deliverydatetime'))
			var dDeliveryDate = new Date(onDemandXMLGetData(oRow, 'deliverydate'))
			
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDeliveryDate" class="interfaceMainSummary">Delivery Date</td></tr>' +
							'<tr><td id="tdInterfaceMainSummaryDeliveryDateValue" class="interfaceMainSummaryValue">' +
							$.fullCalendar.formatDate(dDeliveryDate, "dd MMM yyyy HH:mm") +
							'</td></tr>';
		}					
					
		if (onDemandXMLGetData(oRow, 'statustext') != '')
		{	
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryStatus" class="interfaceMainSummary">Status</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryStatusValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'statustext') +
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
					
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStartDate" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStartDate" class="interfaceMain">' +
						'Order Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStartDateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsStartDateValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsStartDate" class="inputInterfaceMainDate">' +
						'</td></tr>';			
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsEndDate" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsEndDate" class="interfaceMain">' +
						'Delivery/Pickup Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEndDateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsEndDateValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsEndDate" class="inputInterfaceMainDateTime">' +
						'</td></tr>';			
					
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		$('input.inputInterfaceMainDate').datepicker({ dateFormat: 'dd M yy' });
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSource" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSource" class="interfaceMain">' +
						'Source' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSource" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSourceValue" class="interfaceMainText" style="height:33px;">' +
						'<input type="radio" id="radioSource1" name="radioSource" value="1"/>Manually Entered' +
						'&nbsp;&nbsp;<input type="radio" id="radioSource2" name="radioSource" value="2"/>Web Order' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsPurchaseOrderReference" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPurchaseOrderReference" class="interfaceMain" >' +
						'Purchase Order' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsPurchaseOrderReferenceValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsPurchaseOrderReferenceValue" class="interfaceMainSelect">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsPurchaseOrderReference" class="inputInterfaceMainText">' +
						'</td></tr>';	
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsNotes" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsNotes" class="interfaceMain">' +
						'Notes' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsNotesValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsNotesValue" class="interfaceMainTextMulti">' +
						'<textarea style="width:350px;height:120px;" rows="5" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMainDetailsNotes" class="inputInterfaceMainTextMulti"></textarea>' +
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

function interfaceOrderAddress()
{

	var aHTML = [];
	var h = -1;
	
	gsApplicationContext = 'address';
	
	oRoot = goObjectContextXML.getElementsByTagName('ondemand').item(0);
		
	if ($('#divInterfaceMainAddress').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainAddress').attr('onDemandLoading', '');
		
		var oRow = oRoot.childNodes.item(0);
				
		aHTML[++h] = '<table id="tableInterfaceMainAddress" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainAddressRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainAddressColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainAddress').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		//aHTML[++h] = '<tr id="trInterfaceMainAddressStreet" class="interfaceMainSectionLabel">' +
		//				'<td id="tdInterfaceMainAddressStreet" class="interfaceMainSectionLabel">' +
		//				'Street' +
		//				'</td></tr>';
				
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetAddress1" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetAddress1" class="interfaceMain">' +
						'Site Address' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetAddress1Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetAddress1Value" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetAddress1" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetAddress2" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetAddress2" class="interfaceMain">' +
						'' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetAddress2Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetAddress2Value" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetAddress2" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetSuburb" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetSuburb" class="interfaceMain">' +
						'Suburb' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetSuburbValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetSuburbValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetSuburb" class="inputInterfaceMainText inputInterfaceMainSelectAddress">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetState" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetState" class="interfaceMain">' +
						'State' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetStateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetStateValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetState" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetPostCode" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetPostCode" class="interfaceMain">' +
						'Post Code' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetPostCodeValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetPostCodeValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetPostCode" class="inputInterfaceMainText">' +
						'</td></tr>';				
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetCountry" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetCountry" class="interfaceMain">' +
						'Country' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetCountryValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetCountryValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetCountry" class="inputInterfaceMainText">' +
						'</td></tr>';						
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainContactCopyToMailingAddress" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainContactCopyToMailingAddress">Copy to Mailing Address</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainAddressColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
		
		//aHTML[++h] = '<tr id="trInterfaceMainAddressMailing" class="interfaceMainSectionLabel">' +
		//				'<td id="tdInterfaceMainAddressMailing" class="interfaceMainSectionLabel">' +
		//				'Site' +
		//				'</td></tr>';
				
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingAddress1" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingAddress1" class="interfaceMain">' +
						'Mailing Address' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingAddress1Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingAddress1Value" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressMailingAddress1" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingAddress2" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingAddress2" class="interfaceMain">' +
						'' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingAddress2Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingAddress2Value" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressMailingAddress2" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingSuburb" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingSuburb" class="interfaceMain">' +
						'Suburb' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingSuburbValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingSuburbValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressMailingSuburb" class="inputInterfaceMainText inputInterfaceMainSelectAddress">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingState" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingState" class="interfaceMain">' +
						'State' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingStateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingStateValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressMailingState" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingPostCode" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingPostCode" class="interfaceMain">' +
						'Post Code' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingPostCodeValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingPostCodeValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressMailingPostCode" class="inputInterfaceMainText">' +
						'</td></tr>';				
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingCountry" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingCountry" class="interfaceMain">' +
						'Country' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingCountryValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingCountryValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressMailingCountry" class="inputInterfaceMainText">' +
						'</td></tr>';						
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainAddressColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainContactCopyToMailingAddress').button(
		{
			label: "Copy to Mailing Address"
		})
		.click(function() {
		
			$('#inputInterfaceMainAddressMailingAddress1').val($('#inputInterfaceMainAddressStreetAddress1').val());
			$('#inputInterfaceMainAddressMailingAddress2').val($('#inputInterfaceMainAddressStreetAddress2').val());
			$('#inputInterfaceMainAddressMailingSuburb').val($('#inputInterfaceMainAddressStreetSuburb').val());
			$('#inputInterfaceMainAddressMailingState').val($('#inputInterfaceMainAddressStreetState').val());
			$('#inputInterfaceMainAddressMailingPostCode').val($('#inputInterfaceMainAddressStreetPostCode').val());
			$('#inputInterfaceMainAddressMailingCountry').val($('#inputInterfaceMainAddressStreetCountry').val());

		})

		if (oRoot.childNodes.length != 0)
		{	
			$('#inputInterfaceMainAddressStreetAddress1').val(onDemandXMLGetData(oRow, 'streetaddress1').formatXHTML());
			$('#inputInterfaceMainAddressStreetAddress2').val(onDemandXMLGetData(oRow, 'streetaddress2').formatXHTML());
			$('#inputInterfaceMainAddressStreetSuburb').val(onDemandXMLGetData(oRow, 'streetsuburb').formatXHTML());
			$('#inputInterfaceMainAddressStreetState').val(onDemandXMLGetData(oRow, 'streetstate').formatXHTML());
			$('#inputInterfaceMainAddressStreetPostCode').val(onDemandXMLGetData(oRow, 'streetpostcode').formatXHTML());
			$('#inputInterfaceMainAddressStreetCountry').val(onDemandXMLGetData(oRow, 'streetcountry').formatXHTML());
			$('#inputInterfaceMainAddressMailingAddress1').val(onDemandXMLGetData(oRow, 'mailingaddress1').formatXHTML());
			$('#inputInterfaceMainAddressMailingAddress2').val(onDemandXMLGetData(oRow, 'mailingaddress2').formatXHTML());
			$('#inputInterfaceMainAddressMailingSuburb').val(onDemandXMLGetData(oRow, 'mailingsuburb').formatXHTML());
			$('#inputInterfaceMainAddressMailingState').val(onDemandXMLGetData(oRow, 'mailingstate').formatXHTML());
			$('#inputInterfaceMainAddressMailingPostCode').val(onDemandXMLGetData(oRow, 'mailingpostcode').formatXHTML());
			$('#inputInterfaceMainAddressMailingCountry').val(onDemandXMLGetData(oRow, 'mailingcountry').formatXHTML());
		}
	}	
}

function interfaceOrderProducts(aParam, oXML)
{
	
	var sXHTMLElementID = 'divInterfaceMainProducts';
	var sLabel = "people";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oXML == undefined)
	{
	
		var sParam = 'method=ORDER_PRODUCT_SEARCH&order=' + giObjectContext;
		sParam += '&includeimage=1';
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/order/?' + sParam,
			dataType: 'xml',
			success: function(data){interfaceOrderProducts(aParam, data)}
		});
		
	}
	else
	{
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainOrderProducts" class="interfaceMain">' +
					'<tr id="trInterfaceMainOrderProductsRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainOrderProductsColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainOrderProductsColumn2" style="width: 100px;" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#' + sXHTMLElementID).html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainOrderProductsColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainOrderProductsAdd" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainOrderProductsAdd">Add</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainOrderProductsColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainOrderProductsAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			alert("Add product");
			/* interfaceContactPersonMasterViewport({
				showHome: false,
				contactBusiness: giObjectContext,
				contactBusinessText: gsContactBusinessText,
				showNew: true}); */
		})
		.css('width', '75px')
		
		var aHTML = [];
		var h = -1;
			
		var oRoot = oXML.getElementsByTagName("ondemand").item(0);
		
		if (oRoot.childNodes.length == 0)
		{
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceActions">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">No items.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainOrderProductsColumn1').html(aHTML.join(''));		
		}
		else
		{
		
			aHTML[++h] = '<table id="tableOrderProductsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Product</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Quantity</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Price</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Total Price</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				aHTML[++h] = interfaceOrderProductsRow(oRow);
			}
			
			aHTML[++h] = '</tbody></table>';

			interfaceMasterPaginationList(
			{
				xhtmlElementID: 'tdInterfaceMainOrderProductsColumn1',
				xhtmlContext: 'OrderProducts',
				xhtml: aHTML.join(''),
				showMore: ($(oRoot).attr('morerows') == "true"),
				more: $(oRoot).attr('moreid'),
				rows: giReturnRows,
				functionShowRow: interfaceOrderProductsRow,
				functionNewPage: 'interfaceOrderProductsBind()'
			}); 	
			
			interfaceOrderProductsBind();
		}
	}	
}	

function interfaceOrderProductsRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
	
	aHTML[++h] = '<td id="tdOrderProducts_title-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow">' +
							'<img border=0 style="width:45px;" src="' + onDemandXMLGetData(oRow, "imageurl") + '"></td>';	
							
	aHTML[++h] = '<td id="tdOrderProducts_title-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow">' +
							onDemandXMLGetData(oRow, "title") + '</td>';
							
	aHTML[++h] = '<td id="tdOrderProducts_quantity-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							onDemandXMLGetData(oRow, "quantity") + '</td>';						
								
	aHTML[++h] = '<td id="tdOrderProducts_price-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							onDemandXMLGetData(oRow, "price") + '</td>';	

	aHTML[++h] = '<td id="tdOrderProducts_totalprice-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							onDemandXMLGetData(oRow, "totalprice") + '</td>';						
														
	aHTML[++h] = '<td id="tdContactBusinessPeople-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
							
	aHTML[++h] = '</tr>';	
	
	return aHTML.join('');
}

function interfaceOrderProductsBind()
{
	$('.interfaceMainRowOptionsSelect').button( {
				text: false,
				icons: {
					primary: "ui-icon-play"
				}
	})
	.click(function() {
		alert("View product");
	})
	.css('width', '15px')
	.css('height', '20px')
	
	$('.interfaceMainRowOptionsDelete').button( {
		text: false,
		 icons: {
			 primary: "ui-icon-close"
		}
	})
	.click(function() {
		//interfaceContactBusinessPeopleRemove(this.id)
		alert("Delete product");
	})
	.css('width', '15px')
	.css('height', '20px')
	
}	

function interfaceOrderNew(aParam, oXML)
{
	if (oXML == undefined)
	{
		var sParam = 'method=CORE_GET_NEW&rf=XML';

		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/core/?' + sParam,
			dataType: 'xml',
			success: function(data) {interfaceOrderNew(aParam, data)}
		});
	}	
	else	
	{
		goObjectContextXML = oXML
		giObjectContext = -1;
		interfaceOrderViewport();
		$('#divInterfaceMainDetails').html(gsLoadingXHTML);
		$('#divInterfaceMainDetails').attr('onDemandLoading', '1');
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
		interfaceOrderDetails();
	}	
}

function interfaceOrderSave()
{

	var sParam = 'method=PRODUCT_ORDER_MANAGE'
	var sData = 'id=' + ((giObjectContext == -1)?'':giObjectContext);
		
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&reference=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsReference').val());
		sData += '&purchaseorderreference=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsPurchaseOrderReference').val());
		sData += '&source=' + $('input[name="radioSource"]:checked').val();
	}
	
	if ($('#divInterfaceMainAddress').html() != '')
	{
		//sData += '&quantity=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsQuantity').val());
	}
	
	if ($('#divInterfaceMain').html() != '')
	{
		sData += '&quantity=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsQuantity').val());
		sData += '&minimumstocklevel=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsMinimumStockLevel').val());
		sData += '&unit=' + $('input[name="radioradioStockUnit"]:checked').val();
		sData += '&trackinventory=' + $('input[name="radioTrackStock"]:checked').val();
	}
	
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/product/?' + sParam,
		data: sData,
		dataType: 'json',
		success: interfaceOrderSaveProcess
	});
}

function interfaceOrderSaveProcess(oResponse)
{
	
	if (oResponse.status == 'OK')
	{
		interfaceMasterStatus('Product saved');
		if (giObjectContext == -1) {var bNew = true}
		giObjectContext = oResponse.id;	
	}
	else
	{
		interfaceMasterStatus(oResponse.error.errornotes);
		interfaceMasterConfirm( {html: [oResponse.error.errornotes]
								   , title: 'Save error!'});
	}
}

function interfaceOrderDeliveryPick(aParam, oXML)
{
	
	var sXHTMLElementID = 'divInterfaceMainDeliveryPick';
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oXML == undefined)
	{
	
		var sParam = 'method=PRODUCT_ORDER_DELIVERY_PRODUCT_SEARCH&order=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/product/?rf=XML&' + sParam,
			dataType: 'xml',
			success: function(data){interfaceOrderDeliveryPick(aParam, data)}
		});
		
	}
	else
	{
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainOrderDeliveryPick" class="interfaceMain">' +
					'<tr id="trInterfaceMainOrderDeliveryPickRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainOrderDeliveryPickColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainOrderDeliveryPickColumn2" style="width: 100px;" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#' + sXHTMLElementID).html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainOrderDeliveryPickColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainOrderDeliveryPickPrint" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainOrderDeliveryPickPrint">Print</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainOrderDeliveryPickColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainOrderDeliveryPickPrint').button(
		{
			label: "Print"
		})
		.click(function() {
			alert("Show delivery docket");
			/* interfaceContactPersonMasterViewport({
				showHome: false,
				contactBusiness: giObjectContext,
				contactBusinessText: gsContactBusinessText,
				showNew: true}); */
		})
		.css('width', '75px')
		
		var aHTML = [];
		var h = -1;
			
		var oRoot = oXML.getElementsByTagName("ondemand").item(0);
		
		if (oRoot.childNodes.length == 0)
		{
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceOrderDeliveryPick">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">Nothing to pick.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMaiOrderDeliveryPickColumn1').html(aHTML.join(''));
			
		}
		else
		{
		
			aHTML[++h] = '<table id="tableOrderDeliveryPick" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Product</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Quantity Ordered</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Already Delivered</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">This Delivery</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
				
			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				aHTML[++h] = interfaceOrderDeliveryPickRow(oRow);
			}
			
			aHTML[++h] = '</tbody></table>';

			interfaceMasterPaginationList(
			{
				xhtmlElementID: 'tdInterfaceMainOrderDeliveryPickColumn1',
				xhtmlContext: 'OrderDeliveryPick',
				xhtml: aHTML.join(''),
				showMore: ($(oRoot).attr('morerows') == "true"),
				more: $(oRoot).attr('moreid'),
				rows: giReturnRows,
				functionShowRow: interfaceOrderDeliveryPickRow
			}); 	
		
		}
	}	
}	

function interfaceOrderDeliveryPickRow(oRow)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
							
	aHTML[++h] = '<td id="tdOrderDeliveryPick_title-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow">' +
							onDemandXMLGetData(oRow, "producttext") + '</td>';
							
	aHTML[++h] = '<td id="tdOrderDeliveryPick_quantity-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							onDemandXMLGetData(oRow, "quantityordered") + '</td>';						
								
	aHTML[++h] = '<td id="tdOrderDeliveryPick_price-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							onDemandXMLGetData(oRow, "quantityalreadydelivered") + '</td>';	

	aHTML[++h] = '<td id="tdOrderDeliveryPick_totalprice-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							onDemandXMLGetData(oRow, "quantitythisdelivery") + '</td>';						
														
	aHTML[++h] = '<td id="tdOrderDeliveryPick-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
							
	aHTML[++h] = '</tr>';	
	
	return aHTML.join('');
}

function interfaceOrderInvoices(aParam, oXML)
{
	
	var sXHTMLElementID = 'divInterfaceMainInvoices';
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oXML == undefined)
	{
	
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'financial';
		oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
		oSearch.addField('senttobusinesstext,senttobusiness,senttopersontext,senttoperson,projecttext,project,areatext,' +
							'area,reference,purchaseorder,sentdate,duedate,description,amount,gst,sent');
		oSearch.rf = 'xml';
		oSearch.rows = 2
		//oSearch.addFilter('object', 'EQUAL_TO', 43);
		//oSearch.addFilter('objectcontext', 'EQUAL_TO', giObjectContext);
		
		oSearch.getResults(function(data) {interfaceOrderInvoices(aParam, data)});
		
	}
	else
	{
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainOrderInvoices" class="interfaceMain">' +
					'<tr id="trInterfaceMainOrderInvoicesRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainOrderInvoicesColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainOrderInvoicesColumn2" style="width: 100px;" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#' + sXHTMLElementID).html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainOrderInvoicesColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainOrderInvoicesAdd" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainOrderInvoicesAdd">Add</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainOrderInvoicesColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainOrderInvoicesAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			alert("Add Invoice");
			/* interfaceContactPersonMasterViewport({
				showHome: false,
				contactBusiness: giObjectContext,
				contactBusinessText: gsContactBusinessText,
				showNew: true}); */
		})
		.css('width', '75px')
		
		var aHTML = [];
		var h = -1;
			
		var oRoot = oXML.getElementsByTagName("ondemand").item(0);
		
		if (oRoot.childNodes.length == 0)
		{
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceOrderInvoicesPick">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">Nothing to pick.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainOrderInvoicesColumn1').html(aHTML.join(''));		
		}
		else
		{
		
			aHTML[++h] = '<table id="tableOrderOrderInvoices" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Reference</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Date</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Amount</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
				
			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				aHTML[++h] = interfaceOrderInvoicesRow(oRow);
			}
			
			aHTML[++h] = '</tbody></table>';

			interfaceMasterPaginationList(
			{
				xhtmlElementID: 'tdInterfaceMainOrderInvoicesColumn1',
				xhtmlContext: 'OrderInvoices',
				xhtml: aHTML.join(''),
				showMore: ($(oRoot).attr('morerows') == "true"),
				more: $(oRoot).attr('moreid'),
				rows: giReturnRows,
				functionShowRow: interfaceOrderInvoicesRow
			}); 	
		
		}
	}	
}	

function interfaceOrderInvoicesRow(oRow)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
							
	aHTML[++h] = '<td id="tdOrderInvoices_title-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow">' +
							onDemandXMLGetData(oRow, "reference") + '</td>';
							
	aHTML[++h] = '<td id="tdOrderInvoices_quantity-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							onDemandXMLGetData(oRow, "sentdate") + '</td>';						
								
	aHTML[++h] = '<td id="tdOrderInvoices_price-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							onDemandXMLGetData(oRow, "amount") + '</td>';	
														
	aHTML[++h] = '<td id="tdOrderInvoices-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
							
	aHTML[++h] = '</tr>';	
	
	return aHTML.join('');
}

