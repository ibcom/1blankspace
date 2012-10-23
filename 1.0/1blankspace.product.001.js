$(function()
{
})

function interfaceProductMasterViewport(aParam)
{

	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}
	
	giObject = 16;
	goObjectContextXML = '';
	gsObjectName = 'Product';
	giObjectContext = -1;
		
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceProductMasterViewport({showHome: true});',
			move: false
			})		
	}
	
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Products"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceProductSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);	
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceProductSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceProductSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceProductNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceProductNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceProductave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceProductSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceProductSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceProductSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceProductHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceProductHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceProductSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceProductSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	
	if (bShowHome) {interfaceProductHomeShow()};
	
}

function interfaceProductHomeShow(oXML)
{

	if (oXML == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceProductHomeMostLikely" class="interfaceViewportMain">' +
						gsLoadingXHTML + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportProductLarge" class="interfaceMasterViewportImageLarge">' +
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
		
		oSearch.getResults(interfaceProductHomeShow);
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		var oRoot = oXML.getElementsByTagName("ondemand").item(0);
		
		if (oRoot.childNodes.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceProductHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceProductHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceProductHomeMostLikelyNothing">Click New to create a product.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceProjectHomeMostLikely">';
			aHTML[++h] = '<tr>';
			aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
			aHTML[++h] = '</tr>';
			
			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceProjectHomeMostLikely_Title-' + onDemandXMLGetData(oRow, "id") + 
										'" class="interfaceHomeMostLikely">' +
										onDemandXMLGetData(oRow, "title") +
										'</td>';
				
				aHTML[++h] = '</tr>'
			}
			
				aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceProductHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceProductSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceProductSearch(sXHTMLElementId, aParam)
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
		var sParam = 'method=PRODUCT_SEARCH&id=' + giObjectContext;
		
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'product';
		oSearch.method = 'PRODUCT_SEARCH';
		oSearch.addField('reference,title,trackinventory,shopstatus,description,quantity,quantitytype,quantitytypetext');
		oSearch.rf = 'xml';
		oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
		
		oSearch.getResults(function(data){interfaceProductShow(aParam, data)});
		
		/* $.ajax(
		{
			type: 'GET',
			url: '/directory/ondemand/product.asp?' + sParam,
			dataType: 'xml',
			success: function(data){interfaceProductShow(aParam, data)}
		}); */
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
			oSearch.method = 'PRODUCT_SEARCH';
			oSearch.addField('reference,title');
			oSearch.rf = 'xml';
		
			if (iSource == giSearchSource_BROWSE)
			{
				oSearch.addFilter('title', 'STRING_STARTS_WITH', sSearchText);
			}
			else
			{	
				oSearch.addFilter('title', 'STRING_IS_LIKE', sSearchText);
			}	
		
			oSearch.getResults(function(data){interfaceProductSearchShow(aParam, data)});
			
			/* var sParam = 'method=PRODUCT_SEARCH&quicksearch=' + sSearchText + 
								'&xhtmlcontext=' + sXHTMLElementId;

			$.ajax(
			{
				type: 'GET',
				url: '/directory/ondemand/product.asp?' + sParam,
				dataType: 'xml',
				success: function(data) {interfaceProductSearchShow(aParam, data)}
			}); */
			
		}
	};	
}

function interfaceProductSearchShow(aParam, oXML)
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
							onDemandXMLGetData(oRow, "title") +
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
			interfaceProductSearch(event.target.id, {source: 1});
		});
	}	
			
}

function interfaceProductViewport()
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
					
	aHTML[++h] = '<tr id="trInterfaceViewportControlPricing" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlPricing" class="interfaceViewportControl">Pricing</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlStock" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlStock" class="interfaceViewportControl">Stock</td>' +
					'</tr>';
	
	aHTML[++h] = '</table>';					

	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlSupplier" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSupplier" class="interfaceViewportControl">Supplier</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlFinancials" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlFinancials" class="interfaceViewportControl">Financials</td>' +
					'</tr>';
					
	aHTML[++h] = '</table>';					
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlActions" class="interfaceViewportControl">Actions</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
					'</tr>';
					
	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainPricing" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainSupplier" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainStock" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceProductSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceProductDetails();
	});
	
	$('#tdInterfaceViewportControlPricing').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainPricing");
		interfaceProductPricing("divInterfaceMainPricing", true);
	});
	
	$('#tdInterfaceViewportControlSupplier').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSupplier");
		interfaceProductSupplier("divInterfaceMainSupplier", true);
	});
	
	$('#tdInterfaceViewportControlStock').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainStock");
		interfaceProductStock("divInterfaceMainStock", true);
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

function interfaceProductShow(aParam, oXML)
{

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceProductViewport();
	
	goObjectContextXML = oXML;
	
	var aHTML = [];
	var h = -1;
	
	oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the product.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
				
		$('#divInterfaceViewportControlContext').html(onDemandXMLGetData(oRow, 'title'));
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceProductMasterViewport({showHome: false});interfaceProductSearch("-' + giObjectContext + '")',
			move: false
			})
			
		interfaceProductSummary();
	}	
}		
		
function interfaceProductSummary()
{

	var aHTML = [];
	var h = -1;
	var oXML = goObjectContextXML;
	
	oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find Product.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMainSummary').html(aHTML.join(''));
	}
	else
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
	
		var oRow = oRoot.childNodes.item(0);
	
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Title</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'title') +
						'</td></tr>';
						
		if (onDemandXMLGetData(oRow, 'description') != '')
		{	
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'description') +
						'</td></tr>';
		}
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action" cellspacing=0>';
								
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryAdjustStock" class="interfaceMainColumn2Action">' +
						'<a href="#" id="aInterfaceMainSummaryAdjustStock">Adjust&nbsp;Stock</a>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
		
		$('#aInterfaceMainSummaryAdjustStock').click(function(event)
		{
			interfaceProductStock();
		});
	}	
}

function interfaceProductDetails()
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
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTitleValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsTitleValue" class="interfaceMainSelect">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainText">' +
						'</td></tr>';							
			
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
						'Description' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<textarea style="width:320px;" rows="10" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';	
			
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStatus" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStatus" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStatus" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsStatusValue" class="interfaceMainText">' +
						'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Available Now' +
						'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Coming Soon' +
						'<br /><input type="radio" id="radioStatus6" name="radioStatus" value="6"/>Discontinued' +
						'<br /><input type="radio" id="radioStatus7" name="radioStatus" value="7"/>Internal' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsProductType" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsProductTypeStock" class="interfaceMain">' +
						'Product Type' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsProductType" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsProductTypeValue" class="interfaceMainText">' +
						'<input type="radio" id="radioProductType1" name="radioProductType" value="1"/>Standard' +
						'<br /><input type="radio" id="radioProductType2" name="radioProductType" value="2"/>Grouped' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (oRoot.childNodes.length != 0)
		{
			$('#inputInterfaceMainDetailsReference').val(onDemandXMLGetData(oRow, 'reference'));
			$('#inputInterfaceMainDetailsTitle').val(onDemandXMLGetData(oRow, 'title'));
			$('#inputInterfaceMainDetailsStatus').attr('onDemandID', onDemandXMLGetData(oRow, 'status'));
			$('#inputInterfaceMainDetailsStatus').val(onDemandXMLGetData(oRow, 'statustext'));
		}
		
	}	
}

function interfaceProductPricing()
{
	var aHTML = [];
	var h = -1;
	
	oRoot = goObjectContextXML.getElementsByTagName('ondemand').item(0);
	
	if ($('#divInterfaceMainStock').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainStock').attr('onDemandLoading', '');
		
		var oRow = oRoot.childNodes.item(0);
				
		aHTML[++h] = '<table id="tableInterfaceMainPricing" class="interfaceMainPricing">';
		aHTML[++h] = '<tr id="trInterfaceMainPricingRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainPricingColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainPricingColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainPricing').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainPricingColumn1" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsPriceRetail" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPriceRetail" class="interfaceMain">' +
						'Retail Price' +
						'</td></tr>' +
						'<tr id="trInterfaceMainPricingPriceRetailValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainPricingPriceRetailValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainPricingPriceRetail" class="inputInterfaceMainText">' +
						'</td></tr>';			
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainPricingColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainPricingColumn2').html(aHTML.join(''));

		if (oRoot.childNodes.length != 0)
		{
			$('#inputInterfaceMainDetailsReferenceXXX').val(onDemandXMLGetData(oRow, 'reference'));
		}
		
	}	
}

function interfaceProductStock()
{
	var aHTML = [];
	var h = -1;
	
	oRoot = goObjectContextXML.getElementsByTagName('ondemand').item(0);
	
	if ($('#divInterfaceMainStock').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainStock').attr('onDemandLoading', '');
		
		var oRow = oRoot.childNodes.item(0);
				
		aHTML[++h] = '<table id="tableInterfaceMainStock" class="interfaceMainStock">';
		aHTML[++h] = '<tr id="trInterfaceMainStockRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainStockColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainStockColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainStock').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainStockColumn1" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsQuantity" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsQuantity" class="interfaceMain">' +
						'Quantity' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsQuantityValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsQuantityValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsQuantity" class="inputInterfaceMainText">' +
						'</td></tr>';			
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainStockColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStockType" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStockType" class="interfaceMain">' +
						'Stock Type' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStockType" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsStockTypeValue" class="interfaceMainText">' +
						'<input type="radio" id="radioStockType1" name="radioStockType" value="1"/>Each' +
						'<br /><input type="radio" id="radioStockType2" name="radioStockType" value="2"/>Packet' +
						'<br /><input type="radio" id="radioStockType6" name="radioStockType" value="3"/>Metre' +
						'<br /><input type="radio" id="radioStockType7" name="radioStockType" value="4"/>Box' +
						'<br /><input type="radio" id="radioStockType7" name="radioStockType" value="5"/>kg' +
						'<br /><input type="radio" id="radioStockType7" name="radioStockType" value="6"/>Thousand' +
						'<br /><input type="radio" id="radioStockType7" name="radioStockType" value="7"/>Unit' +
						'<br /><input type="radio" id="radioStockType7" name="radioStockType" value="8"/>Hour' +
						'<br /><input type="radio" id="radioStockType7" name="radioStockType" value="9"/>Pair' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsTrackStock" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTrackStock" class="interfaceMain">' +
						'Track Stock' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTrackStock" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTrackStockValue" class="interfaceMainText">' +
						'<input type="radio" id="radioTrackStockN" name="radioStatus" value="N"/>No' +
						'<br /><input type="radio" id="radioTrackStockY" name="radioStatus" value="Y"/>Yes' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainStockColumn2').html(aHTML.join(''));

		if (oRoot.childNodes.length != 0)
		{
			$('#inputInterfaceMainDetailsReference').val(onDemandXMLGetData(oRow, 'reference'));
			$('#inputInterfaceMainDetailsTitle').val(onDemandXMLGetData(oRow, 'title'));
			$('#inputInterfaceMainDetailsStatus').attr('onDemandID', onDemandXMLGetData(oRow, 'status'));
			$('#inputInterfaceMainDetailsStatus').val(onDemandXMLGetData(oRow, 'statustext'));
		}
		
	}	
}


function interfaceProductSave()
{

	var sParam = '/directory/ondemand/product.asp?method=PRODUCT_MANAGE'
	var sData = (glObjectContext == -1)?'':'&id=' + glObjectContext;
		
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&reference=' + $('#inputInterfaceMainDetailsReference').val();
	}
	
	interfaceMasterSave(sParam, sData, 'Product Saved');
		
}


