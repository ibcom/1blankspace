/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
function interfaceProductMasterViewport(aParam)
{
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}
	
	giObject = 16;
	gsObjectName = 'Product';
	goObjectContext = undefined;
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
		interfaceProductSave();
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

function interfaceProductHomeShow(oResponse)
{
	if (oResponse == undefined)
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
		oSearch.method = 'PRODUCT_SEARCH';
		oSearch.addField('reference,title');
		oSearch.rf = 'json';
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		
		oSearch.getResults(interfaceProductHomeShow);
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
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
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceProjectHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.title +
										'</td>';
				
				aHTML[++h] = '</tr>'
			});
			
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
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'PRODUCT_SEARCH';
		oSearch.addField('reference,title,trackinventory,status,statustext,description,' +
							'unittype,unittypetext,units,category,categorytext,currentretailprice,type,minimumstocklevel');
		oSearch.rf = 'json';
		oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
		oSearch.getResults(function(data){interfaceProductShow(aParam, data)});
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
			oSearch.method = 'PRODUCT_SEARCH';
			oSearch.addField('reference,title');
			oSearch.rf = 'json';
		
			if (iSource == giSearchSource_BROWSE)
			{
				oSearch.addFilter('title', 'STRING_STARTS_WITH', sSearchText);
			}
			else
			{	
				oSearch.addFilter('title', 'STRING_IS_LIKE', sSearchText);
			}	
		
			oSearch.getResults(function(data){interfaceProductSearchShow(aParam, data)});
		}
	};	
}

function interfaceProductSearchShow(aParam, oResponse)
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
			
			aHTML[++h] = '<td class="interfaceContactType' + this.type + ' interfaceSearch">&nbsp;</td>';
			aHTML[++h] = '<td class="interfaceSearch" id="' +
							'-' + this.id + '">' +
							this.title +
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
					
		aHTML[++h] = '<tr id="trInterfaceViewportControlPricing" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlPricing" class="interfaceViewportControl">Pricing</td>' +
						'</tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportControlCategory" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlCategory" class="interfaceViewportControl">Category</td>' +
						'</tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportControlStock" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlStock" class="interfaceViewportControl">Stock</td>' +
						'</tr>';
	
		aHTML[++h] = '</table>';					

/* 
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
		aHTML[++h] = '<tr id="trInterfaceViewportControlSupplier" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlSupplier" class="interfaceViewportControl">Supplier</td>' +
						'</tr>';
	 
		aHTML[++h] = '<tr id="trInterfaceViewportControlFinancials" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlFinancials" class="interfaceViewportControl">Financials</td>' +
						'</tr>';
					
		aHTML[++h] = '</table>';					
*/	
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlActions" class="interfaceViewportControl">Actions</td>' +
						'</tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
						'</tr>';
	}
					
	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainPricing" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainCategory" class="divInterfaceViewportMain"></div>';
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
		interfaceProductPricing();
	});
	
	$('#tdInterfaceViewportControlCategory').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainCategory");
		interfaceProductCategory();
	});
	
	$('#tdInterfaceViewportControlSupplier').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSupplier");
		interfaceProductSupplier();
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

function interfaceProductShow(aParam, oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceProductViewport();

	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the product.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
				
		aHTML[++h] = goObjectContext.title;
		
		if (goObjectContext.categorytext != '')
		{
			aHTML[++h] = '<span id="spanInterfaceViewportControlSubContext">' + goObjectContext.categorytext + '</span>'
		}
		
		if (goObjectContext.currentretailprice != '')
		{
			aHTML[++h] = '<span id="spanInterfaceViewportControlSubContext">' + goObjectContext.currentretailprice + '</span>'
		}
				
		$('#divInterfaceViewportControlContext').html(aHTML.join('<br />'));
		
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceProductMasterViewport({showHome: false});interfaceProductSearch("-' + giObjectContext + '")',
			move: false
			})
			
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceProductSummary()'});
	}	
}		
		
function interfaceProductSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find Product.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMainSummary').html(aHTML.join(''));
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
		
		if (goObjectContext.currentretailprice != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPrice" class="interfaceMainSummary">Retail Price</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPriceValue" class="interfaceMainSummaryValue" style="font-size:1.5em;font-weight:bold;">';
			aHTML[++h] = '$' + goObjectContext.currentretailprice;
			aHTML[++h] = '</td></tr>';
		}	
		
		if (goObjectContext.units != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryQuantity" class="interfaceMainSummary">Units</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryQuantityValue" class="interfaceMainSummaryValue" style="font-size:1.5em;font-weight:bold;">';
			aHTML[++h] = goObjectContext.units;
			aHTML[++h] = '</td></tr>';
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

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action" cellspacing=0>';
						
		if (goObjectContext.imageurl && goObjectContext.imageurl != '')
		{	
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryImage class="interfaceMainColumn2Action">' +
						'<img border=0 src="' + goObjectContext.imageurl + '">' +
						'</td></tr>';
		}						
						
		if (false && goObjectContext.trackinventory != 'Y')
		{	
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryAdjustStock" class="interfaceMainColumn2Action">' +
						'<a href="#" id="aInterfaceMainSummaryAdjustStock">Adjust&nbsp;Stock</a>' +
						'</td></tr>';
		}				
						
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
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTitleValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsTitleValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainText">' +
						'</td></tr>';							
			
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
						'Description' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<textarea style="width:320px;" rows="10" cols="35" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
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
						'<td id="tdInterfaceMainDetailsStatusValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Coming Soon' +
						'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Available Now' +
						'<br /><input type="radio" id="radioStatus6" name="radioStatus" value="6"/>Discontinued' +
						'<br /><input type="radio" id="radioStatus7" name="radioStatus" value="7"/>Internal' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsProductType" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsProductTypeStock" class="interfaceMain">' +
						'Product Type' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsProductType" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsProductTypeValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioProductType1" name="radioProductType" value="1"/>Standard' +
						'</td></tr>';
						
		//'<br /><input type="radio" id="radioProductType2" name="radioProductType" value="2"/>Grouped' +
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (goObjectContext != undefined)
		{
			var iStatus = goObjectContext.status;
			if (iStatus == '') {iStatus = 1}
		
			$('#inputInterfaceMainDetailsReference').val(goObjectContext.reference);
			$('#inputInterfaceMainDetailsTitle').val(goObjectContext.title);
			$('#inputInterfaceMainDetailsDescription').val(goObjectContext.description);
			$('[name="radioStatus"][value="' + iStatus + '"]').attr('checked', true);
			$('[name="radioProductType"][value="' + goObjectContext.type + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioStatus"][value="2"]').attr('checked', true);
			$('[name="radioProductType"][value="1"]').attr('checked', true);
		}	
	}	
}

function interfaceProductPricing()
{
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainPricing').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainPricing').attr('onDemandLoading', '');
				
		aHTML[++h] = '<table id="tableInterfaceMainPricing" class="interfaceMainPricing">';
		aHTML[++h] = '<tr id="trInterfaceMainPricingRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainPricingColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainPricingColumn2" class="interfaceMainColumn2x">' +
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
						'<input id="inputInterfaceMainPricingPriceRetail" class="inputInterfaceMainText">' +
						'</td></tr>';			
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainPricingColumn1').html(aHTML.join(''));
			
		interfaceProductPricingGroup({xhtmlElemendID: 'tdInterfaceMainPricingColumn2'})

		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainPricingPriceRetail').val(goObjectContext.currentretailprice);
		}
		else
		{
			$('[name="radioPriceGroup"][value="-1"]').attr('checked', true);
		}	
	}	
}

function interfaceProductPricingGroup(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	var sXHTMLElementID = 'tdInterfaceMainPricingColumn2';
	
	if (oResponse == undefined)
	{
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?rows=999&method=SETUP_PRODUCT_PRICING_GROUP_SEARCH',
			dataType: 'json',
			async: false,
			success: function(data) {interfaceProductPricingGroup(aParam, data)}
		});
	}
	else
	{
		
		if (aParam != undefined)
		{
			if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		}	
		
		var aHTML = [];
		var h = -1;
				
		aHTML[++h] = '<table id="tableInterfaceMainPricingColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainPricingGroup" class="interfaceMain">' +
						'<td id="tdInterfaceMainPricingGroup" class="interfaceMain">' +
						'Group' +
						'</td></tr>' +
						'<tr id="trInterfaceMainPricingGroup" class="interfaceMain">' +
						'<td id="tdInterfaceMainPricingGroupValue" class="interfaceMainText" style="font-size:0.875em">' +
						'<input type="radio" id="radioPricingGroup-1" name="radioPricingGroup" value="-1"/>' +
						'All<br />';
		
		if (oResponse.data.rows.length != 0)	
		{
			$.each(oResponse.data.rows, function() 
			{ 
				if (this.title != '')
				{
					aHTML[++h] = '<input type="radio" id="radioPricingGroup' + this.id + '" name="radioPricingGroup" value="' + this.id + ' "/>' +
								this.title + '<br />';
				}				
			});
		}
		
		aHTML[++h] = '</td></tr>';
		
		$('#' + sXHTMLElementID).html(aHTML.join(''));
	}	
}

function interfaceProductCategory(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainCategory').attr('onDemandLoading') == '1')
	{
		if (oResponse == undefined)
		{	
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_PRODUCT_CATEGORY_SEARCH';
			oSearch.addField('title');
			oSearch.getResults(function(data) {
					interfaceProductCategory(aParam, data)
					});
		}
		else
		{
			$('#divInterfaceMainCategory').attr('onDemandLoading', '');
			
			var aHTML = [];
			var h = -1;
				
			aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';

			if (oResponse.data.rows == 0)
			{
				aHTML[++h] = '<tr>';
				aHTML[++h] = '<td class="interfaceMainRowNothing">No categories have been set up.</td>';
				aHTML[++h] = '</tr>';
			}
			else
			{
				aHTML[++h] = '<tr id="trInterfaceMainCategory" class="interfaceMain">' +
								'<td id="tdInterfaceMainCategoryValue" class="interfaceMainText" style="font-size:0.875em">';
					
				$.each(oResponse.data.rows, function() 
				{ 
					aHTML[++h] = '<input type="radio" id="radioCategory' + this.id + '" name="radioCategory" value="' + this.id + '"/>' +
									this.title + '<br />';
				});
		
				aHTML[++h] = '</td></tr>';
			}
			
			$('#divInterfaceMainCategory').html(aHTML.join(''));

			if (oResponse.data.rows.length != 0)
			{
				$('[name="radioCategory"][value="' + goObjectContext.category + '"]').attr('checked', true);
			}
		}	
	}	
}

function interfaceProductStock()
{
	var aHTML = [];
	var h = -1;

	if ($('#divInterfaceMainStock').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainStock').attr('onDemandLoading', '');
				
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
						'<input id="inputInterfaceMainDetailsQuantity" class="inputInterfaceMainText">' +
						'</td></tr>';			
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsMinimumStockLevel" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsMinimumStockLevel" class="interfaceMain">' +
						'Minimum Stock Level' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsMinimumStockLevelValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsMinimumStockLevelValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsMinimumStockLevel" class="inputInterfaceMainText">' +
						'</td></tr>';			
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainStockColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStockUnit" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStockUnit" class="interfaceMain">' +
						'Stock Type' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStockUnit" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsStockUnitValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioStockUnit1" name="radioStockUnit" value="1"/>Each' +
						'<br /><input type="radio" id="radioStockUnit2" name="radioStockUnit" value="2"/>Packet' +
						'<br /><input type="radio" id="radioStockUnit6" name="radioStockUnit" value="3"/>Metre' +
						'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="4"/>Box' +
						'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="5"/>kg' +
						'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="6"/>Thousand' +
						'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="7"/>Unit' +
						'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="8"/>Hour' +
						'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="9"/>Pair' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsTrackStock" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTrackStock" class="interfaceMain">' +
						'Track Stock' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTrackStock" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTrackStockValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioTrackStockN" name="radioTrackStock" value="N"/>No' +			
						'</td></tr>';
		//'<br /><input type="radio" id="radioTrackStockY" name="radioTrackStock" value="Y"/>Yes' +
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainStockColumn2').html(aHTML.join(''));

		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsQuantity').val(goObjectContext.units);
			$('#inputInterfaceMainDetailsMinimumStockLevel').val(goObjectContext.minimumstocklevel);
			$('[name="radioStockUnit"][value="' + goObjectContext.unittype + '"]').attr('checked', true);
			$('[name="radioTrackStock"][value="' + goObjectContext.trackinventory + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioStockUnit"][value="1"]').attr('checked', true);
			$('[name="radioTrackStock"][value="N"]').attr('checked', true);
		}	
	}	
}

function interfaceProductNew()
{
	goObjectContext = undefined
	giObjectContext = -1;
	interfaceProductViewport();
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	interfaceProductDetails();
}

function interfaceProductSave()
{
	interfaceMasterStatusWorking();

	var sData = 'id=' + ((giObjectContext == -1)?'':giObjectContext);
			
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&reference=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsReference').val());
		sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsTitle').val());
		sData += '&description=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDescription').val());
		
		var iStatus = $('input[name="radioStatus"]:checked').val()
		if (iStatus == '') {iStatus = 1}
		
		sData += '&status=' + iStatus;
		sData += '&type=' + $('input[name="radioProductType"]:checked').val();
	}
	
	if ($('#divInterfaceMainStock').html() != '')
	{
		sData += '&minimumstocklevel=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsMinimumStockLevel').val());
		sData += '&unittype=' + $('input[name="radioStockUnit"]:checked').val();
		sData += '&trackinventory=' + $('input[name="radioTrackStock"]:checked').val();
	}
	
	if ($('#divInterfaceMainCategory').html() != '')
	{
		var iCategory = $('input[name="radioCategory"]:checked').val()
		if (iCategory == '') {iCategory = $('input[name="radioCategory"]:first').val()}
	
		sData += '&category=' + interfaceMasterFormatSave(iCategory);
	}
	
	$.ajax(
	{
		type: 'POST',
		url: interfaceMasterEndpointURL('PRODUCT_MANAGE'),
		data: sData,
		dataType: 'json',
		success: interfaceProductSaveProcess
	});
}

function interfaceProductSaveProcess(oResponse)
{
	if (oResponse.status == 'OK')
	{
		interfaceMasterStatus('Saved');
		if (giObjectContext == -1) {var bNew = true}
		giObjectContext = oResponse.id;	
		
		if ($('#divInterfaceMainPricing').html() != '')
		{
			interfaceProductPriceSave();
		}
			
		if ($('#divInterfaceMainStock').html() != '')
		{
			interfaceProductQuantitySave();
		}	
	}
	else
	{
		interfaceMasterError(oResponse.error.errornotes);
	}
}

function interfaceProductPriceSave(aParam)
{
	var sParam = 'method=PRODUCT_PRICE_MANAGE&rf=JSON';
	var sData = 'price=' + interfaceMasterFormatSave($('#inputInterfaceMainPricingPriceRetail').val());
	sData += '&product=' + giObjectContext;
	
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/product/?' + sParam,
		data: sData,
		dataType: 'json'
	});
}

function interfaceProductQuantitySave(aParam)
{
	var sParam = 'method=PRODUCT_STOCK_MANAGE&rf=JSON';
	var sData = 'units=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsQuantity').val());
	sData += '&product=' + giObjectContext;
	sData += '&type=3';
	sData += '&effectivedate=' + Date.today().toString("dd-MMM-yyyy");
	
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/product/?' + sParam,
		data: sData,
		dataType: 'json'
	});
}
	
function interfaceProductStockHistory(aParam, oResponse)
{
	var sXHTMLElementID = 'divInterfaceMainStock';
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'product';
		oSearch.method = 'PRODUCT_STOCK_SEARCH';
		
		oSearch.addField('adjustmenttext,effectivedate,units');
		oSearch.async = false;
		oSearch.rf = 'json';
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		
		oSearch.getResults(interfaceProductHomeShow);
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
			
		if (oResponse.data.rows.length == 0)
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
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = interfaceOrderProductsRow(oRow);
			});
			
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
				functionNewPage: 'interfaceOrderProductsBind()',
				type: 'json'
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
	
	aHTML[++h] = '<td id="tdOrderProducts_title-' + oRow.id + '" class="interfaceMainRow">' +
							'<img border=0 style="width:45px;" src="' + oRow.imageurl + '"></td>';	
							
	aHTML[++h] = '<td id="tdOrderProducts_title-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.title + '</td>';
							
	aHTML[++h] = '<td id="tdOrderProducts_quantity-' + oRow.id + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							oRow.quantity + '</td>';						
								
	aHTML[++h] = '<td id="tdOrderProducts_price-' + oRow.id + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							oRow.price + '</td>';	

	aHTML[++h] = '<td id="tdOrderProducts_totalprice-' + oRow.id + '" class="interfaceMainRow"' +
							' style="text-align:right;">' +
							oRow.totalprice + '</td>';						
														
	aHTML[++h] = '<td id="tdContactBusinessPeople-' + oRow.id + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
							
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

