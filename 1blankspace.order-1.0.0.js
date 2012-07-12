function interfaceOrderMasterViewport(aParam)
{
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}
	
	giObject = 43;
	gsObjectName = 'Order';
	goObjectContext = undefined;
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

function interfaceOrderHomeShow(oResponse)
{	
	$('#divInterfaceMain').html(gsLoadingXHTML);
	
	var aHTML = [];
	var h = -1;
				
	aHTML[++h] = '<table>';
	aHTML[++h] = '<tr>' +
					'<td id="interfaceMasterViewportOrderLarge" class="interfaceMasterViewportImageLarge">' +
					'&nbsp;' + 
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';		
	
	aHTML[++h] = '<table style="margin-top:15px;">';

	aHTML[++h] = '<tr id="trInterfaceViewportControlRecent" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlRecent" class="interfaceViewportControl">Recent</td>' +
					'</tr>';		
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlStatus" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlStatus-2" class="interfaceViewportControl orderStatus">To&nbsp;Be&nbsp;Submitted</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlStatus" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlStatus-7" class="interfaceViewportControl orderStatus">Processing</td>' +
					'</tr>';
						
	aHTML[++h] = '<tr id="trInterfaceViewportControlStatus" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlStatus-1" class="interfaceViewportControl orderStatus">Completed</td>' +
					'</tr>';
												
	aHTML[++h] = '</table>';
	
	$('#divInterfaceViewportControl').html(aHTML.join(''));	
	$('#tdInterfaceViewportControlRecent').addClass('interfaceViewportControlHighlight');
	interfaceOrderHomeRecentShow();
	
	$('#tdInterfaceViewportControlRecent').click(function(event)
	{
		interfaceOrderHomeRecentShow();
	});
	
	$('td.orderStatus').click(function(event)
	{
		var sID = this.id;
		var aID = sID.split('-');
		interfaceOrderHomeStatusShow({status: aID[1]});
	});
		
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
}

function interfaceOrderHomeRecentShow(oResponse)
{
	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'PRODUCT_ORDER_SEARCH';
		oSearch.addField('reference,orderbybusinesstext,orderbypersontext,orderdate');
		oSearch.rows = 30;
		oSearch.sort('orderdate', 'desc');
		oSearch.getResults(interfaceOrderHomeRecentShow);
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
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
		
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td style="width:100px;" id="interfaceOrderHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.reference +
										'</td>';
				
				aHTML[++h] = '<td style="width:100px;" id="interfaceOrderHomeMostLikely_OrderDate-' + this.id + '" class="interfaceHomeMostLikelySub">' +
										this.orderdate + '</td>';
										
				var sContact = this.orderbybusinesstext;
				if (sContact == '') {sContact = this.orderbypersontext}
										
				aHTML[++h] = '<td id="interfaceOrderHomeMostLikely_Contact-' + this.id + '" class="interfaceHomeMostLikelySub">' +
										sContact + '</td>';
										
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#divInterfaceMain').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceOrderSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceOrderHomeStatusShow(aParam, oResponse)
{
	var iStatus = 1;
	
	if (aParam != undefined)
	{
		if (aParam.status != undefined) {iStatus = aParam.status}	
	}
		
	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'PRODUCT_ORDER_SEARCH';
		oSearch.addField('reference,orderbybusinesstext,orderbypersontext,orderdate');
		oSearch.addFilter('status', 'EQUAL_TO', iStatus);
		oSearch.rows = 30;
		oSearch.sort('orderdate', 'desc');
		oSearch.getResults(function(data) {interfaceOrderHomeStatusShow(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
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
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = interfaceOrderHomeStatusRow(this)
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#divInterfaceMain').html(aHTML.join(''));
	
		interfaceMasterPaginationList(
		{
			xhtmlElementID: 'divInterfaceMain',
			xhtmlContext: 'OrderStatus',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: 30,
			functionShowRow: interfaceOrderHomeStatusRow,
			functionNewPage: 'interfaceOrderHomeStatusBind()',
			type: 'json'
		}); 
					
		interfaceOrderHomeStatusBind();
	}
}

function interfaceOrderHomeStatusRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td style="width:100px;" id="interfaceProjectHomeMostLikely_Title-' + oRow.id + 
							'" class="interfaceHomeMostLikely">' +
							oRow.reference +
							'</td>';
							
	aHTML[++h] = '<td style="width:100px;" id="interfaceOrderHomeMostLikely_OrderDate-' + oRow.id + '" class="interfaceHomeMostLikelySub">' +
							oRow.orderdate + '</td>';
							
	var sContact = oRow.orderbybusinesstext;
	if (sContact == '') {sContact = oRow.orderbypersontext}
							
	aHTML[++h] = '<td id="interfaceOrderHomeMostLikely_Contact-' + oRow.id + '" class="interfaceHomeMostLikelySub">' +
							sContact + '</td>';
							
	aHTML[++h] = '</tr>'

	return aHTML.join('');
}

function interfaceOrderHomeStatusBind()
{
	$('td.interfaceHomeMostLikely').click(function(event)
	{
		interfaceOrderSearch(event.target.id, {source: 1});
	});
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
							'notes,streetaddresscombined,streetaddress1,streetaddress2,streetsuburb,streetstate,streetpostcode,streetcountry,' +
							'mailingaddresscombined,mailingaddress1,mailingaddress2,mailingsuburb,mailingstate,mailingpostcode,mailingcountry,' +
							'createdusertext,createduser,createddate,modifiedusertext,modifieduser,modifieddate');
		oSearch.rf = 'json';
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
			oSearch.addField('reference,orderbybusinesstext');
			oSearch.rf = 'json';
			oSearch.addFilter('reference', 'STRING_IS_LIKE', sSearchText);
					
			oSearch.getResults(function(data) {interfaceOrderSearchShow(aParam, data)});
			
		}
	};	
}

function interfaceOrderSearchShow(aParam, oResponse)
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
		var oRow = oRoot.childNodes.item(0);
		
		aHTML[++h] = '<table class="interfaceSearchMedium">';
		aHTML[++h] = '<tbody>'
			
		$.each(oResponse.data.rows, function()
		{
			iColumn = iColumn + 1;
			
			if (iColumn == 1)
			{
				aHTML[++h] = '<tr class="interfaceSearch">';
			}
			
			aHTML[++h] = '<td class="interfaceContactType' + this.type + ' interfaceSearch">&nbsp;</td>';
			aHTML[++h] = '<td class="interfaceSearch" id="' +
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
	
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlAddress" class="interfaceViewportControl">Address</td>' +
						'</tr>';
		
		aHTML[++h] = '<tr id="trInterfaceViewportControlProducts" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlProducts" class="interfaceViewportControl">Items</td>' +
						'</tr>';
		
		/*
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
		*/								
	}
	
	aHTML[++h] = '</table>';					
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlInvoices" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlInvoices" class="interfaceViewportControl">Invoices</td>' +
					'</tr>';
					
	/*
	aHTML[++h] = '<tr id="trInterfaceViewportControlCredits" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlCredits" class="interfaceViewportControl">Credits</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControlSupplierOrders" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSupplierOrders" class="interfaceViewportControl">Supplier Orders</td>' +
					'</tr>';
	*/
					
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
		interfaceOrderProductItems();
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

function interfaceOrderShow(aParam, oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceOrderViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
	
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the order.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
				
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
				
		$('#divInterfaceViewportControlContext').html(goObjectContext.reference);

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
					'<td id="tdInterfaceMainSummaryColumn2Action" class="interfaceMainColumn2" style="width:175px;">' +
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';				
		
	$('#divInterfaceMainSummary').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find order.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryOrderDate" class="interfaceMainSummary">Order Date</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryOrderDateValue" class="interfaceMainSummaryValue">' +
						goObjectContext.orderdate +
						'</td></tr>';
						
		if (goObjectContext.deliverydate != '')
		{				
			var dDeliveryDate = new Date(goObjectContext.deliverydate);
			
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDeliveryDate" class="interfaceMainSummary">Delivery Date</td></tr>' +
							'<tr><td id="tdInterfaceMainSummaryDeliveryDateValue" class="interfaceMainSummaryValue">' +
							$.fullCalendar.formatDate(dDeliveryDate, "dd MMM yyyy HH:mm") +
							'</td></tr>';
		}					
			
		if (goObjectContext.streetaddresscombined != '')
		{				
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDeliveryAddress" class="interfaceMainSummary">Deliver To</td></tr>' +
							'<tr><td id="tdInterfaceMainSummaryDeliveryAddressValue" class="interfaceMainSummaryValue">' +
							goObjectContext.streetaddresscombined;
							
			if (goObjectContext.streetsuburb != '')
			{				
				aHTML[++h] = '<br />' +	goObjectContext.streetsuburb;
			}
							
			if (goObjectContext.streetstate != '')
			{				
				aHTML[++h] = '<br />' +	goObjectContext.streetstate;		
			}
			
			aHTML[++h] = '</td></tr>';
									
		}
					
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2" style="width: 100%">';
		
		if (goObjectContext.statustext != '')
		{	
			aHTML[++h] = '<tr><td class="interfaceMainSummary" style="padding-bottom:10px;">' +
						goObjectContext.statustext +
						'</td></tr>';				
		}
		
		if (goObjectContext.status == 7)
		{	
			aHTML[++h] = '<tr><td>' +
						'<span style="font-size:0.75em;" id="spanInterfaceMainOrderAction-7" class="orderAction">Unsubmit</span>' +
						'</td></tr>';
						
			aHTML[++h] = '<tr><td>' +
						'<span style="font-size:0.75em;" id="spanInterfaceMainOrderAction-8" class="orderAction">Finalise</span>' +
						'</td></tr>';			
		}
		
		if (goObjectContext.status == 2)
		{	
			aHTML[++h] = '<tr><td>' +
						'<span style="font-size:0.75em;" id="spanInterfaceMainOrderAction-2" class="orderAction">Submit</span>' +
						'</td></tr>';
		}
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
		
		$('span.orderAction').button(
		{
			
		})
		.click(function() {
			
			var sID = this.id;
			var aID = sID.split('-');
			var iAction = aID[1];
			
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/product/?method=PRODUCT_ORDER_MANAGE&action=' + iAction + '&id=' + giObjectContext,
				dataType: 'json',
				async: false,
				success: function(oResponse) {interfaceOrderSearch('-' + giObjectContext)}
			});
		})
		.css('width', '100px')
									
	}	
}

function interfaceOrderDetails()
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
					
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStartDate" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStartDate" class="interfaceMain">' +
						'Order Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStartDateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsStartDateValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsOrderDate" class="inputInterfaceMainDate">' +
						'</td></tr>';			
		/*				
		aHTML[++h] = '<tr id="trInterfaceMainDetailsEndDate" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsEndDate" class="interfaceMain">' +
						'Delivery/Pickup Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEndDateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsEndDateValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsEndDate" class="inputInterfaceMainDate">' +
						'</td></tr>';			
		*/
					
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
						'<td id="tdInterfaceMainDetailsSourceValue" class="interfaceMainRadio" style="height:33px;">' +
						'<input type="radio" id="radioSource1" name="radioSource" value="1"/>Manually Entered' +
						'&nbsp;&nbsp;<input type="radio" id="radioSource2" name="radioSource" value="2"/>Web Order' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsPurchaseOrderReference" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPurchaseOrderReference" class="interfaceMain" >' +
						'Purchase Order' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsPurchaseOrderReferenceValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsPurchaseOrderReferenceValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsPurchaseOrderReference" class="inputInterfaceMainText">' +
						'</td></tr>';	
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsNotes" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsNotes" class="interfaceMain">' +
						'Notes' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsNotesValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsNotesValue" class="interfaceMainTextMulti">' +
						'<textarea style="width:350px;height:120px;" rows="5" cols="35" id="inputInterfaceMainDetailsNotes" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
		
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsReference').val(goObjectContext.reference);
			$('#inputInterfaceMainDetailsOrderDate').val(goObjectContext.orderdate);
			
			$('[name="radioSource"][value="' + goObjectContext.source + '"]').attr('checked', true);
			$('#inputInterfaceMainDetailsPurchaseOrderReference').val(goObjectContext.purchaseorder);
			$('#inputInterfaceMainDetailsNotes').val(goObjectContext.notes);	
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
		
	if ($('#divInterfaceMainAddress').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainAddress').attr('onDemandLoading', '');
				
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
				
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetAddress1" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetAddress1" class="interfaceMain">' +
						'Delivery Address' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetAddress1Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetAddress1Value" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressStreetAddress1" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetAddress2" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetAddress2" class="interfaceMain">' +
						'' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetAddress2Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetAddress2Value" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressStreetAddress2" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetSuburb" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetSuburb" class="interfaceMain">' +
						'Suburb' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetSuburbValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetSuburbValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressStreetSuburb" class="inputInterfaceMainText inputInterfaceMainSelectAddress">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetState" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetState" class="interfaceMain">' +
						'State' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetStateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetStateValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressStreetState" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetPostCode" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetPostCode" class="interfaceMain">' +
						'Post Code' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetPostCodeValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetPostCodeValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressStreetPostCode" class="inputInterfaceMainText">' +
						'</td></tr>';				
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetCountry" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetCountry" class="interfaceMain">' +
						'Country' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetCountryValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetCountryValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressStreetCountry" class="inputInterfaceMainText">' +
						'</td></tr>';						
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainContactCopyToMailingAddress" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainContactCopyToMailingAddress">Copy to Mailing Address</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainAddressColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingAddress1" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingAddress1" class="interfaceMain">' +
						'Billing Address' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingAddress1Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingAddress1Value" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressMailingAddress1" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingAddress2" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingAddress2" class="interfaceMain">' +
						'' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingAddress2Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingAddress2Value" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressMailingAddress2" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingSuburb" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingSuburb" class="interfaceMain">' +
						'Suburb' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingSuburbValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingSuburbValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressMailingSuburb" class="inputInterfaceMainText inputInterfaceMainSelectAddress">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingState" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingState" class="interfaceMain">' +
						'State' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingStateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingStateValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressMailingState" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingPostCode" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingPostCode" class="interfaceMain">' +
						'Post Code' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingPostCodeValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingPostCodeValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressMailingPostCode" class="inputInterfaceMainText">' +
						'</td></tr>';				
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingCountry" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingCountry" class="interfaceMain">' +
						'Country' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingCountryValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingCountryValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressMailingCountry" class="inputInterfaceMainText">' +
						'</td></tr>';						
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainAddressColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainContactCopyToMailingAddress').button(
		{
			label: "Copy to Billing Address"
		})
		.click(function() {
		
			$('#inputInterfaceMainAddressMailingAddress1').val($('#inputInterfaceMainAddressStreetAddress1').val());
			$('#inputInterfaceMainAddressMailingAddress2').val($('#inputInterfaceMainAddressStreetAddress2').val());
			$('#inputInterfaceMainAddressMailingSuburb').val($('#inputInterfaceMainAddressStreetSuburb').val());
			$('#inputInterfaceMainAddressMailingState').val($('#inputInterfaceMainAddressStreetState').val());
			$('#inputInterfaceMainAddressMailingPostCode').val($('#inputInterfaceMainAddressStreetPostCode').val());
			$('#inputInterfaceMainAddressMailingCountry').val($('#inputInterfaceMainAddressStreetCountry').val());

		})

		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainAddressStreetAddress1').val((goObjectContext.streetaddress1).formatXHTML());
			$('#inputInterfaceMainAddressStreetAddress2').val((goObjectContext.streetaddress2).formatXHTML());
			$('#inputInterfaceMainAddressStreetSuburb').val((goObjectContext.streetsuburb).formatXHTML());
			$('#inputInterfaceMainAddressStreetState').val((goObjectContext.streetstate).formatXHTML());
			$('#inputInterfaceMainAddressStreetPostCode').val((goObjectContext.streetpostcode).formatXHTML());
			$('#inputInterfaceMainAddressStreetCountry').val((goObjectContext.streetcountry).formatXHTML());
			$('#inputInterfaceMainAddressMailingAddress1').val((goObjectContext.mailingaddress1).formatXHTML());
			$('#inputInterfaceMainAddressMailingAddress2').val((goObjectContext.mailingaddress2).formatXHTML());
			$('#inputInterfaceMainAddressMailingSuburb').val((goObjectContext.mailingsuburb).formatXHTML());
			$('#inputInterfaceMainAddressMailingState').val((goObjectContext.mailingstate).formatXHTML());
			$('#inputInterfaceMainAddressMailingPostCode').val((goObjectContext.mailingpostcode).formatXHTML());
			$('#inputInterfaceMainAddressMailingCountry').val((goObjectContext.mailingcountry).formatXHTML());
		}
	}	
}

function interfaceOrderProductItems(aParam, oResponse)
{
	var sXHTMLElementID = 'divInterfaceMainProducts';
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'PRODUCT_ORDER_ITEM_SEARCH';
		oSearch.addField('producttext,quantity,totalcost,totaltax');
		oSearch.addFilter('order', 'EQUAL_TO', giObjectContext);
		oSearch.sort('producttext', 'desc');
		oSearch.getResults(function(data){interfaceOrderProductItems(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainOrderProductItems" class="interfaceMain">' +
					'<tr id="trInterfaceMainOrderProductItemsRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainOrderProductItemsColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainOrderProductItemsColumn2" style="width: 200px;" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#' + sXHTMLElementID).html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainOrderProductItemsColumn2" class="interfaceMainColumn2">';
		
		if (goObjectContext.status == 2)
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainOrderProductItemsAdd" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainOrderProductItemsAdd">Add</span>' +
						'</td></tr>';
		}
		else
		{
			aHTML[++h] = '<tr><td class="interfaceViewportControlSub">' +
						'The order has been submitted, so items can not be added or removed.' +
					'</td></tr>';
		}				
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainOrderProductItemsColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainOrderProductItemsAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			interfaceOrderProductItemsAdd()
		})
		.css('width', '75px')
		
		var aHTML = [];
		var h = -1;

		if (oResponse.data.rows.length == 0)	
		{
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceActions">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">No items.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainOrderProductItemsColumn1').html(aHTML.join(''));		
		}
		else
		{
			aHTML[++h] = '<table id="tableOrderProductItemsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Product</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Quantity</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Price</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function() 
			{ 
				aHTML[++h] = interfaceOrderProductItemsRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';

			interfaceMasterPaginationList(
			{
				xhtmlElementID: 'tdInterfaceMainOrderProductItemsColumn1',
				xhtmlContext: 'OrderProductItems',
				xhtml: aHTML.join(''),
				showMore: (oResponse.morerows == "true"),
				more: oResponse.moreid,
				rows: giReturnRows,
				functionShowRow: interfaceOrderProductItemsRow,
				functionNewPage: 'interfaceOrderProductItemsBind()',
				type: 'json'
			}); 		
			interfaceOrderProductItemsBind();
		}
	}	
}	

function interfaceOrderProductItemsRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
	
	aHTML[++h] = '<td id="tdOrderProductItems_title-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.producttext + '</td>';	
							
	aHTML[++h] = '<td id="tdOrderProductItems_quantity-' + oRow.id + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							oRow.quantity + '</td>';						
								
	aHTML[++h] = '<td id="tdOrderProductItems_price-' + oRow.id + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							oRow.totalcost + '</td>';					
						
	aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';	
	aHTML[++h] = '<span id="spanOrderProductItems_options_remove-' + oRow.id + '" class="interfaceMainRowOptionsRemove"></span>';
	//aHTML[++h] = '<span id="spanOrderProductItems_options_view-' + oRow.id + '" class="interfaceMainRowOptionsView"></span>';
	aHTML[++h] = '</td>';
																	
	aHTML[++h] = '</tr>';	
	
	return aHTML.join('');
}

function interfaceOrderProductItemsBind()
{
	$('.interfaceMainRowOptionsView').button( {
				text: false,
				icons: {
					primary: "ui-icons"
				}
	})
	.click(function() {
		alert("View product");
	})
	.css('width', '15px')
	.css('height', '17px')
	
	if (goObjectContext.status == 2)
	{
		$('.interfaceMainRowOptionsRemove').button( {
			text: false,
			 icons: {
				 primary: "ui-icon-close"
			}
		})
		.click(function() {
			interfaceOrderProductItemsRemove({xhtmlElementID: this.id});
		})
		.css('width', '15px')
		.css('height', '17px')
	}	
}	

function interfaceOrderProductItemsRemove(aParam, oResponse)
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
		var sParam = 'method=PRODUCT_ORDER_ITEM_MANAGE&remove=1';
		var sData = 'id=' + sID;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/product/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceOrderProductItemsRemove(aParam, data)}
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

function interfaceOrderProductItemsAdd(aParam, oResponse)
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
					
			aHTML[++h] = '<table id="tableInterfaceMainProductAddColumn2">';
	
			aHTML[++h] = '<tr id="trInterfaceMainProductAddReference" class="interfaceMain">' +
							'<td id="tdInterfaceMainProductAddReference" class="interfaceMain">' +
							'Product' +
							'</td></tr>' +
							'<tr id="trInterfaceMainProductAddReferenceValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainProductAddReferenceValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainProductAddReference" class="inputInterfaceMainText">' +
							'</td></tr>';
			
			aHTML[++h] = '<tr id="trInterfaceMainProductAdd">' +
							'<td id="tdInterfaceMainProductAddSearch" style="font-size:0.75em;" title="Enter part of the title and click search.">' +
							'<span id="spanInterfaceMainOrderProductItemsAddSearch">Search</span>' +
							'</td></tr>';
											
			aHTML[++h] = '</table>';
			
			aHTML[++h] = '<table style="margin-top:15px;">';
			
			aHTML[++h] = '<tr>' +
							'<td id="tdInterfaceMainProductAddSearchResults">' +
							'</td></tr>';
											
			aHTML[++h] = '</table>';		
			
			$('#tdInterfaceMainOrderProductItemsColumn2').html(aHTML.join(''));

			$('#spanInterfaceMainOrderProductItemsAddSearch').button(
				{
					label: "Search"
				})
				.click(function() {
					interfaceOrderProductItemsAdd($.extend(true, aParam, {step: 2}))
				})
				
			$('#inputInterfaceMainProductAddReference').focus();
		}
		if (iStep == 2)
		{
			$('#tdInterfaceMainProductAddSearchResults').html(gsLoadingSmallXHTML);
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'PRODUCT_SEARCH';
			oSearch.addField('reference,title');
			oSearch.addFilter('title', 'STRING_IS_LIKE', $('#inputInterfaceMainProductAddReference').val());
			oSearch.sort('title', 'asc');
			oSearch.getResults(function(data){interfaceOrderProductItemsAdd($.extend(true, aParam, {step:3}), data)});
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
			aHTML[++h] = '<td class="interfaceMainRowNothing">No products.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainProductAddSearchResults').html(aHTML.join(''));		
		}
		else
		{	
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" >';
			aHTML[++h] = '<tbody>'
			
			$.each(oResponse.data.rows, function() 
			{ 
				aHTML[++h] = '<tr class="interfaceMainRow">';	
							
				aHTML[++h] = '<td id="tdOrderProductItems_title-' + this.id + '" class="interfaceMainRow productadd">' +
										this.title + '</td>';
										
				aHTML[++h] = '<td id="tdOrderProductItems_quantity-' + this.id + '" class="interfaceMainRow productadd">' +
								'<input style="width:25px;" id="inputOrderProductItems_title-quantity-' + this.id + '" class="inputInterfaceMainText productadd"></td>';						
						
				aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';	
				aHTML[++h] = '<span id="spanOrderProductItems_options_add-' + this.id + '" class="interfaceMainRowOptionsAdd"></span>';
				aHTML[++h] = '</td>';
				
				aHTML[++h] = '</tr>';	

			});
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainProductAddSearchResults').html(aHTML.join(''))
			
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
				var iProduct = aID[1];
				var iQuantity = $('#inputOrderProductItems_title-quantity-' + iProduct).val();
				if (iQuantity == '') {iQuantity = 1};
				
				var sData = 'order=' + giObjectContext;
				sData += '&product=' + iProduct;
				sData += '&quantity=' + iQuantity;
				
				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/product/?method=PRODUCT_ORDER_ITEM_MANAGE',
					data: sData,
					dataType: 'json',
					async: false,
					success: function(oResponse) {interfaceOrderProductItems()}
				});
			})
			.css('width', '20px')
			.css('height', '20px')
			
			$('input.productadd:first').focus();
		}
	}	
}

function interfaceOrderNew()
{
	goObjectContext = undefined
	giObjectContext = -1;
	interfaceOrderViewport();
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	interfaceOrderDetails();
}

function interfaceOrderSave()
{
	var sParam = 'method=PRODUCT_ORDER_MANAGE'
	var sData = 'id=' + ((giObjectContext == -1)?'':giObjectContext);
		
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&reference=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsReference').val());
		sData += '&orderdate=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsOrderDate').val());
		
		sData += '&purchaseorder=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsPurchaseOrderReference').val());
		sData += '&source=' + $('input[name="radioSource"]:checked').val();
		sData += '&notes=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsNotes').val());
	}
		
	if ($('#divInterfaceMainAddress').html() != '')
	{
		sData += '&streetaddress1=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressStreetAddress1').val());
		sData += '&streetaddress2=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressStreetAddress2').val());
		sData += '&streetsuburb=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressStreetSuburb').val());
		sData += '&streetstate=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressStreetState').val());
		sData += '&streetpostcode=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressStreetPostCode').val());
		sData += '&streetcountry=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressStreetCountry').val());
		
		sData += '&mailingaddress1=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressMailingAddress1').val());
		sData += '&mailingaddress2=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressMailingAddress2').val());
		sData += '&mailingsuburb=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressMailingSuburb').val());
		sData += '&mailingstate=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressMailingState').val());
		sData += '&mailingpostcode=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressMailingPostCode').val());
		sData += '&mailingcountry=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressMailingCountry').val());
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
		interfaceMasterStatus('Saved');
		if (giObjectContext == -1) {var bNew = true}
		giObjectContext = oResponse.id;	
	}
	else
	{
		interfaceMasterError(oResponse.error.errornotes);
	}
}

function interfaceOrderDelivery(aParam, oResponse)
{
	var sXHTMLElementID = 'divInterfaceMainDelivery';
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oResponse == undefined)
	{
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainOrderDelivery" class="interfaceMain">' +
					'<tr id="trInterfaceMainOrderDeliveryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainOrderDeliveryColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainOrderDeliveryColumn2" style="width: 200px;" class="interfaceMainColumn2Actionx">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#' + sXHTMLElementID).html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainOrderDeliveryColumn2" class="interfaceMainColumn2">';
		
		/*
		aHTML[++h] = '<tr><td id="tdInterfaceMainOrderDeliverysAdd" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainOrderDeliveryAdd">Add</span>' +
						'</td></tr>';
		*/
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainOrderDeliveryColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainOrderDeliveryAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			interfaceOrderDeliveryPick();
		})
		.css('width', '75px')
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'PRODUCT_ORDER_DELIVERY_SEARCH';
		oSearch.addField('reference,deliverydate,notes');
		oSearch.addFilter('order', 'EQUAL_TO', giObjectContext);
		oSearch.getResults(function(data) {interfaceOrderDelivery(aParam, data)});	
	}
	else
	{	
		var aHTML = [];
		var h = -1;
			
		if (oResponse.data.rows.length == 0)	
		{
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceOrderInvoicesPick">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">No deliveries.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainOrderDeliveryColumn1').html(aHTML.join(''));		
		}
		else
		{
		
			aHTML[++h] = '<table id="tableOrderOrderDelivery" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Notes</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
				
			$.each(oResponse.data.rows, function() 
			{
				aHTML[++h] = interfaceOrderDeliveryRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';

			interfaceMasterPaginationList(
			{
				xhtmlElementID: 'tdInterfaceMainOrderDeliveryColumn1',
				xhtmlContext: 'OrderDelivery',
				xhtml: aHTML.join(''),
				showMore: (oResponse.morerows == "true"),
				more: oResponse.moreid,
				rows: giReturnRows,
				functionShowRow: interfaceOrderDeliveryRow,
				type: 'json'
			}); 	
		
		}
	}	
}	

function interfaceOrderDeliveryRow(oRow)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
							
	aHTML[++h] = '<td id="tdOrderDelivery_deliverydate-' + oRow.id + '" class="interfaceMainRow"' +
							'>' +
							oRow.deliverydate + '</td>';						
								
	aHTML[++h] = '<td id="tdOrderDelivery_notes-' + oRow.id + '" class="interfaceMainRow"' +
							'>' +
							oRow.notes + '</td>';	
														
	aHTML[++h] = '<td id="tdOrderDelivery-' + oRow.id + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
							
	aHTML[++h] = '</tr>';	
	
	return aHTML.join('');
}

function interfaceOrderDeliveryPick(aParam, oResponse)
{
	
	var sXHTMLElementID = 'divInterfaceMainDeliveryPick';
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oResponse == undefined)
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
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'PRODUCT_ORDER_DELIVERY_ITEM_SEARCH';
		oSearch.addField('producttext,quantity');
		oSearch.addFilter('order', 'EQUAL_TO', giObjectContext);
		oSearch.getResults(function(data) {interfaceOrderDeliveryPick(aParam, data)});	
	}
	else
	{	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainOrderDeliveryPickColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainOrderstreetPickPrint" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainOrderstreetPickPrint">Print</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainOrderstreetPickColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainOrderstreetPickPrint').button(
		{
			label: "Print"
		})
		.click(function() {
			alert("Show delivery docket");
		})
		.css('width', '75px')
		
		var aHTML = [];
		var h = -1;
			
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceOrderstreetPick">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">Nothing to pick.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMaiOrderstreetPickColumn1').html(aHTML.join(''));	
		}
		else
		{
			aHTML[++h] = '<table id="tableOrderstreetPick" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Product</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Quantity Ordered</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Already Delivered</td>';
			aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">This street</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
				
			$.each(oResponse.data.rows, function() 
			{ 
				aHTML[++h] = interfaceOrderstreetPickRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';

			interfaceMasterPaginationList(
			{
				xhtmlElementID: 'tdInterfaceMainOrderDeliveryPickColumn1',
				xhtmlContext: 'OrderDeliveryPick',
				xhtml: aHTML.join(''),
				showMore: (oResponse.morerows == "true"),
				more: oResponse.moreid,
				rows: giReturnRows,
				functionShowRow: interfaceOrderDeliveryPickRow,
				type: 'json'
			}); 	
		}
	}	
}	

function interfaceOrderDeliveryPickRow(oRow)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
							
	aHTML[++h] = '<td id="tdOrderstreetPick_title-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.producttext + '</td>';
							
	aHTML[++h] = '<td id="tdOrderstreetPick_quantity-' + oRow.id + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							oRow.quantity + '</td>';						
								
	aHTML[++h] = '<td id="tdOrderstreetPick_price-' + oRow.id + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							'</td>';	

	aHTML[++h] = '<td id="tdOrderstreetPick_totalprice-' + oRow.id + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							'</td>';						
														
	aHTML[++h] = '<td id="tdOrderstreetPick-' + oRow.id + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
							
	aHTML[++h] = '</tr>';	
	
	return aHTML.join('');
}

function interfaceOrderInvoices(aParam, oResponse)
{
	var sXHTMLElementID = 'divInterfaceMainInvoices';
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainOrderInvoices" class="interfaceMain">' +
					'<tr id="trInterfaceMainOrderInvoicesRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainOrderInvoicesColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainOrderInvoicesColumn2" style="width: 100px;" class="interfaceMainColumn2Actionx">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#' + sXHTMLElementID).html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainOrderInvoicesColumn2" class="interfaceMainColumn2">';
		/*
		aHTML[++h] = '<tr><td id="tdInterfaceMainOrderInvoicesAdd" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainOrderInvoicesAdd">Add</span>' +
						'</td></tr>';
		*/				
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainOrderInvoicesColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainOrderInvoicesAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			alert("Add Invoice");
		})
		.css('width', '75px')
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'PRODUCT_ORDER_DELIVERY_SEARCH';
		oSearch.addField('reference');
		oSearch.addFilter('order', 'EQUAL_TO', giObjectContext);
		oSearch.getResults(function(oResponse)
		{	
			var aID = [];
			
			$.each(oResponse.data.rows, function() 
			{
				aID.push(this.id);
			});
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
			oSearch.addField('contactbusinesssenttotext,contactbusinesssentto,contactpersonsenttotext,contactpersonsentto,' +
								'projecttext,project,areatext,area,' +
								'reference,purchaseorder,sentdate,duedate,description,amount,tax,sent');
			oSearch.addFilter('object', 'EQUAL_TO', 51);
			oSearch.addFilter('objectcontext', 'IN_LIST', aID.join(','));
		
			oSearch.getResults(function(data) {interfaceOrderInvoices(aParam, data)});
		});	
	}
	else
	{	
		var aHTML = [];
		var h = -1;
			
		if (oResponse.data.rows.length == 0)	
		{
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceOrderInvoices">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">No invoices for this order.<br /><br />';
			
			if (goObjectContext.status == 2)
			{
				aHTML[++h] = 'Click <strong>submit</strong> and then <strong>finalise</strong> in the summary section to create the invoice.</td>';
			}
			else
			{
				aHTML[++h] = 'Click <strong>finalise</strong> in the summary section to create the invoice.</td>';
			}
				
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
				
			$.each(oResponse.data.rows, function() 
			{
				aHTML[++h] = interfaceOrderInvoicesRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';

			interfaceMasterPaginationList(
			{
				xhtmlElementID: 'tdInterfaceMainOrderInvoicesColumn1',
				xhtmlContext: 'OrderInvoices',
				xhtml: aHTML.join(''),
				showMore: (oResponse.morerows == "true"),
				more: oResponse.moreid,
				rows: giReturnRows,
				functionShowRow: interfaceOrderInvoicesRow,
				functionNewPage: 'interfaceOrderProductsBind()',
				type: 'json'
			}); 	
		
			interfaceOrderIvoicesBind();
		}
	}	
}	

function interfaceOrderInvoicesRow(oRow)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
							
	aHTML[++h] = '<td id="tdOrderInvoices_title-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.reference + '</td>';
							
	aHTML[++h] = '<td id="tdOrderInvoices_quantity-' + oRow.id + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							oRow.sentdate + '</td>';						
								
	aHTML[++h] = '<td id="tdOrderInvoices_price-' + oRow.id + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							oRow.amount + '</td>';	
														
	aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';	
	aHTML[++h] = '<span id="spanOrderInvoices_options_view-' + oRow.id + '" class="interfaceMainRowOptionsView"></span>';
	aHTML[++h] = '</td>';
																	
	aHTML[++h] = '</tr>';							
	
	return aHTML.join('');
}

function interfaceOrderIvoicesBind()
{
	$('.interfaceMainRowOptionsView').button( {
				text: false,
				icons: {
					primary: "ui-icon-play"
				}
	})
	.click(function() {
		var sID = this.id;
		var aID = sID.split('-');
			
		interfaceFinancialInvoiceMasterViewport({showHome: false});
		interfaceFinancialInvoiceSearch('-' + aID[1]);
	})
	.css('width', '15px')
	.css('height', '17px')
}	