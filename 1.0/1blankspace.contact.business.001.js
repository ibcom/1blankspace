var gsContactBusinessText;

$(function()
{
})

function interfaceContactBusinessMasterViewport(aParam)
{

	giObject = 12;
	gsObjectName = 'Business';
	goObjectContextXML = '';
	giObjectContext = -1;
	bShowHome = true;
			
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
	}	
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceContactBusinessMasterViewport({showHome: true});',
			move: false
			})		
	}
	
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Businesses"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		interfaceContactBusinessSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceContactBusinessSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceContactBusinessSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceContactBusinessNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceContactBusinessNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceContactBusinessSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceContactBusinessSaveOptions();
	});
		
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
		
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceContactBusinessSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceContactBusinessHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceContactBusinessHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceContactBusinessSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceContactBusinessSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	$('#divInterfaceViewportControl').html('');	
	
	if (bShowHome) {interfaceContactBusinessHomeShow()};
}

function interfaceContactBusinessHomeShow(oXML)
{

	if (oXML == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceContactBusinessHomeMostLikely" class="interfaceViewportMain">' +
						gsLoadingXHTML + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportContactLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlByGroup" class="interfaceViewportControl">Groups</td>' +
					'</tr>';	
					
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#tdInterfaceViewportControlByGroup').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMain", true);
			interfaceContactBusinessByGroup("divInterfaceMain");
		});
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'contact';
		oSearch.method = 'CONTACT_BUSINESS_SEARCH';
		
		oSearch.addField('tradename');
		oSearch.async = false;
		oSearch.rf = 'xml';
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		
		oSearch.getResults(interfaceContactBusinessHomeShow);
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		var oRoot = oXML.getElementsByTagName("ondemand").item(0);
		
		if (oRoot.childNodes.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceContactBusinessHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceContactBusinessHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceContactBusinessHomeMostLikelyNothing">Click New to create a business contact.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceContactBusinessHomeMostLikely">';
			aHTML[++h] = '<tr>';
			aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
			aHTML[++h] = '</tr>';

			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceContactBusinessHomeMostLikely_Title-' + onDemandXMLGetData(oRow, "id") + 
										'" class="interfaceHomeMostLikely">' +
										onDemandXMLGetData(oRow, "tradename") +
										'</td>';
				
				aHTML[++h] = '</tr>'
			}
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceContactBusinessHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceContactBusinessSearch(event.target.id, {source: 1});
		});
	}
}


function interfaceContactBusinessSearch(sXHTMLElementId, aParam)
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
	
	if (sSearchContext != undefined && iSource != giSearchSource_BROWSE)
	{
	
		$('#divInterfaceViewportControl').html(gsLoadingXHTML);
		
		giObjectContext = sSearchContext;
		
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'contact';
		oSearch.method = 'CONTACT_BUSINESS_SEARCH';
		oSearch.addField( 'reference,tradename,legalname,phonenumber,faxnumber,industry,industrytext,' +
							'createddate,abn,customerstatus,customerstatustext' + 
							',webaddress,area,areatext,' +
							'streetaddress1,streetaddress2,streetsuburb,streetpostcode,streetstate,streetcountry' + 
							',mailingaddress1,mailingaddress2,mailingsuburb,mailingpostcode,mailingstate,mailingcountry,' +
							'notes,primarycontactperson');
		oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
		oSearch.rf = 'XML';
		oSearch.getResults(function(data) {interfaceContactBusinessShow(aParam, data)}) 
		
	}
	else
	{
	
		var iMinimumLength = 3;
		var iMaximumColumns = 1;

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
			oSearch.endPoint = 'contact';
			oSearch.method = 'CONTACT_BUSINESS_SEARCH';
			oSearch.addField('tradename');
			
			if (iSource == giSearchSource_BROWSE)
			{
				oSearch.addFilter('tradename', 'STRING_STARTS_WITH', sSearchText);
			}
			else
			{	
				oSearch.addFilter('tradename', 'STRING_IS_LIKE', sSearchText);
			}	
			
			oSearch.rf = 'XML';
			oSearch.getResults(function(data) {interfaceContactBusinessSearchShow(aParam, data)}) 
			
			
			/* var sParam = 'method=BUSINESS_SEARCH&rf=XML&basic=1&quicksearch=' + sSearchText + 
								'&xhtmlcontext=' + sElementId;
								
			$.ajax(
			{
				type: 'GET',
				url: '/directory/ondemand/object.asp?' + sParam,
				dataType: 'xml',
				success: function(data) {interfaceContactBusinessSearchShow(aParam, data)}
			}); */
			
		}
	};	
}

function interfaceContactBusinessSearchShow(aParam, oXML)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	var oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		interfaceMasterSearchStop();
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
			
			aHTML[++h] = '<td class="interfaceSearch" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
							'-' + onDemandXMLGetData(oRow, "id") + '">' +
							onDemandXMLGetData(oRow, "tradename") + '</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		}
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(
			interfaceMasterPagination(
			{
				html: aHTML.join(''),
				more: ($(oRoot).attr('morerows') == "true")
			}) 
		);		
		
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceContactBusinessSearch(event.target.id, {source: 1});
		});
		
		interfaceMasterPaginationBind(
		{
			columns: 'tradename',
			more: $(oRoot).attr('moreid'),
			rows: 15,
			startRow: parseInt($(oRoot).attr('startrow')) + parseInt($(oRoot).attr('rows')),
			functionSearch: interfaceContactBusinessSearch
		});   
		
	}	
}

function interfaceContactBusinessViewport()
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
					
	aHTML[++h] = '<tr id="trInterfaceViewportControl3" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlAddress" class="interfaceViewportControl">Address</td>' +
					'</tr>';
	
	aHTML[++h] = '</table>';					
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlGroups" class="interfaceViewportControl">Groups</td>' +
					'</tr>';
					
	aHTML[++h] = '</table>';		
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlPeople" class="interfaceViewportControl">People</td>' +
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
	aHTML[++h] = '<div id="divInterfaceMainAddress" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainGroups" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainPeople" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceContactBusinessSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceContactBusinessDetails();
	});
	
	
	$('#tdInterfaceViewportControlAddress').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAddress");
		interfaceContactBusinessAddress();
	});
	
	$('#tdInterfaceViewportControlGroups').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainGroups", true);
		interfaceContactBusinessGroups();
	});
	
	$('#tdInterfaceViewportControlPeople').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainPeople", true);
		interfaceContactBusinessPeople();
	});
	
	$('#tdInterfaceViewportControlActions').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainActions", true);
		interfaceMasterActions({xhtmlElementID: 'divInterfaceMainActions', contactBusiness: giObjectContext, object: '', objectContext: ''});
	});
	
	$('#tdInterfaceViewportControlAttachments').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAttachments", true);
		interfaceMasterAttachments({xhtmlElementID: 'divInterfaceMainAttachments'});
	});
	
}

function interfaceContactBusinessShow(aParam, oXML)
{

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceContactBusinessViewport();
	
	goObjectContextXML = oXML;
	
	var aHTML = [];
	var h = -1;
	
	oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find ContactBusiness.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
		gsContactBusinessText = onDemandXMLGetData(oRow, 'tradename');
				
		$('#divInterfaceViewportControlContext').html(onDemandXMLGetData(oRow, 'tradename'));
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceContactBusinessMasterViewport({showHome: false});interfaceContactBusinessSearch("-' + giObjectContext + '")',
			move: false
			})
		
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceContactBusinessSummary()'})
	}	
}		
		
function interfaceContactBusinessSummary()
{

	var aHTML = [];
	var h = -1;
	var oXML = goObjectContextXML;
	
	oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this contact.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
	
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
		
		if (onDemandXMLGetData(oRow, 'phone') != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPhone" class="interfaceMainSummary">Phone</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPhoneValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'phone') +
						'</td></tr>';
		}

		if (onDemandXMLGetData(oRow, 'customerstatustext') != '')
		{
			aHTML[++h] =  '<tr><td id="tdInterfaceMainSummaryMobile" class="interfaceMainSummary">Status</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryMobileValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'customerstatustext') +
						'</td>' +
						'</tr>';
		}
			
		if (onDemandXMLGetData(oRow, 'notes') != '')
		{
			aHTML[++h] =  '<tr><td id="tdInterfaceMainSummaryNotes" class="interfaceMainSummary">Notes</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryNotesValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'notes') +
						'</td>' +
						'</tr>';
		}
			
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
								
		if (onDemandXMLGetData(oRow, 'webaddress') != '')
		{ 
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryWebAddress" class="interfaceMainColumn2Action">' +
						'<a href="' + onDemandXMLGetData(oRow, 'webaddress') + '" id="aInterfaceMainSummaryWebAddress"' +
							' target="_blank">' + onDemandXMLGetData(oRow, 'webaddress') + '</a>' +
						'</td></tr>';
		}				
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
		
	}	
}

function interfaceContactBusinessDetails()
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
		
	aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMainColumn1 interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsReference" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsReference" class="interfaceMain">' +
						'Reference' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsReference" class="inputInterfaceMainText">' +
						'</td></tr>';			

		aHTML[++h] = '<tr id="trInterfaceMainDetailsLegalName" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsLegalName" class="interfaceMain">' +
						'Legal Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsLegalNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsLegalNameValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsLegalName" class="inputInterfaceMainText">' +
						'</td></tr>';			

		aHTML[++h] = '<tr id="trInterfaceMainDetailsTradingName" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTradingName" class="interfaceMain">' +
						'Trading Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTradingNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTradingNameValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsBusinessTradingName" class="inputInterfaceMainText">' +
						'</td></tr>';			
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsIndustry" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsIndustry" class="interfaceMain">' +
						'Industry' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsIndustryValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsIndustryValue" class="interfaceMainSelect">' +
						'<input onDemandType="SELECT" id="inputInterfaceMainDetailsIndustry" onDemandGoTo="interfaceClientGoTo1()" class="inputInterfaceMainSelect"' +
							' onDemandMethod="SETUP_CONTACT_INDUSTRY_SEARCH">' +
						'</td></tr>';				
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsABN" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsABN" class="interfaceMain">' +
						'ABN' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsABNValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsABNValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsABN" class="inputInterfaceMainText">' +
						'</td></tr>';				
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsPhone" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPhone" class="interfaceMain">' +
						'Phone' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsPhoneValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsPhoneValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsPhone" class="inputInterfaceMainText">' +
						'</td></tr>';				
				
		aHTML[++h] = '<tr id="trInterfaceMainDetailsFax" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsFax" class="interfaceMain">' +
						'Fax' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsFaxValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsFaxValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsFax" class="inputInterfaceMainText">' +
						'</td></tr>';
				
		aHTML[++h] = '<tr id="trInterfaceMainDetailsWebAddress" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsWebAddress" class="interfaceMain">' +
						'Website' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsWebAddressValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsWebAddressValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsWebAddress" class="inputInterfaceMainText">' +
						'</td></tr>';
						
/* 		aHTML[++h] = '<tr id="trInterfaceMainDetailsArea" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsArea" class="interfaceMain">' +
						'Area' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsAreaValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsAreaValue" class="interfaceMainSelect">' +
						'<input onDemandType="SELECT" id="inputInterfaceMainDetailsArea" class="inputInterfaceMainSelect"' +
							' onDemandMethod="SETUP_AREA_SEARCH">' +
						'</td></tr>';					
 */			
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStatus" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStatus" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStatusValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsStatusValue" class="interfaceMainSelect">' +
						'<input onDemandType="SELECT" id="inputInterfaceMainDetailsStatus" class="inputInterfaceMainSelect"' +
							' onDemandMethod="SETUP_CONTACT_STATUS_SEARCH">' +
						'</td></tr>';			
			
		aHTML[++h] = '</table>';					
				
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
						'Description / Notes' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (oRoot.childNodes.length != 0)
		{
			$('#inputInterfaceMainDetailsReference').val(onDemandXMLGetData(oRow, 'reference'));
			$('#inputInterfaceMainDetailsLegalName').val(onDemandXMLGetData(oRow, 'legalname'));
			$('#inputInterfaceMainDetailsBusinessTradingName').val(onDemandXMLGetData(oRow, 'tradename'));
			$('#inputInterfaceMainDetailsIndustry').attr('onDemandID', onDemandXMLGetData(oRow, 'industry'));
			$('#inputInterfaceMainDetailsIndustry').val(onDemandXMLGetData(oRow, 'industrytext'));
			$('#inputInterfaceMainDetailsABN').val(onDemandXMLGetData(oRow, 'abn'));
			$('#inputInterfaceMainDetailsPhone').val(onDemandXMLGetData(oRow, 'phonenumber'));
			$('#inputInterfaceMainDetailsFax').val(onDemandXMLGetData(oRow, 'faxnumber'));
			$('#inputInterfaceMainDetailsWebAddress').val(onDemandXMLGetData(oRow, 'webaddress'));
			$('#inputInterfaceMainDetailsStatus').attr("onDemandID", onDemandXMLGetData(oRow, 'customerstatus'));
			$('#inputInterfaceMainDetailsStatus').val(onDemandXMLGetData(oRow, 'customerstatustext'));
			$('#inputInterfaceMainDetailsDescription').val(onDemandXMLGetData(oRow, 'notes'));
		}
	
	}	
}

function interfaceContactBusinessAddress()
{

	var aHTML = [];
	var h = -1;
	
	oRoot = goObjectContextXML.getElementsByTagName('ondemand').item(0);
	
	if ($('#divInterfaceMainAddress').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainAddress').attr('onDemandLoading', '');
		
		var oRow = oRoot.childNodes.item(0);
				
		aHTML[++h] = '<table id="tableInterfaceMainAddress" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainAddressRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressColumn1" class="interfaceMain">' +
						'</td>' +
						'<td id="tdInterfaceMainAddressColumn2" class="interfaceMain">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainAddress').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreet" class="interfaceMainSectionLabel">' +
						'<td id="tdInterfaceMainAddressStreet" class="interfaceMainSectionLabel">' +
						'Street' +
						'</td></tr>';
				
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetAddress1" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetAddress1" class="interfaceMain">' +
						'Address' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetAddress1Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetAddress1Value" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetAddress1" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetSuburb" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetSuburb" class="interfaceMain">' +
						'Suburb' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetSuburbValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetSuburbValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetSuburb" class="inputInterfaceMainText">' +
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
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainAddressColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailing" class="interfaceMainSectionLabel">' +
						'<td id="tdInterfaceMainAddressMailing" class="interfaceMainSectionLabel">' +
						'Mailing' +
						'</td></tr>';
				
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingAddress1" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingAddress1" class="interfaceMain">' +
						'Address' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingAddress1Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingAddress1Value" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetAddress1" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingSuburb" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingSuburb" class="interfaceMain">' +
						'Suburb' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingSuburbValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingSuburbValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressMailingSuburb" class="inputInterfaceMainText">' +
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
		
		if (oRoot.childNodes.length != 0)
		{
			$('#inputInterfaceMainAddressStreetAddress1').val(onDemandXMLGetData(oRow, 'streetaddress1'));
			$('#inputInterfaceMainAddressStreetSuburb').val(onDemandXMLGetData(oRow, 'streetsuburb'));
			$('#inputInterfaceMainAddressStreetState').val(onDemandXMLGetData(oRow, 'streetstate'));
			$('#inputInterfaceMainAddressStreetPostCode').val(onDemandXMLGetData(oRow, 'streetpostcode'));
			$('#inputInterfaceMainAddressStreetCountry').val(onDemandXMLGetData(oRow, 'streetcountry/'));
			$('#inputInterfaceMainAddressMailingAddress1').val(onDemandXMLGetData(oRow, 'mailingaddress1'));
			$('#inputInterfaceMainAddressMailingSuburb').val(onDemandXMLGetData(oRow, 'mailingsuburb'));
			$('#inputInterfaceMainAddressMailingState').val(onDemandXMLGetData(oRow, 'mailingstate'));
			$('#inputInterfaceMainAddressMailingPostCode').val(onDemandXMLGetData(oRow, 'mailingpostcode'));
			$('#inputInterfaceMainAddressMailingCountry').val(onDemandXMLGetData(oRow, 'mailingcountry'));
		}
	}	
}

function interfaceContactBusinessSave()
{

	var sParam = 'method=CONTACT_BUSINESS_MANAGE'
	var sData = 'id=';
	
	if (giObjectContext != -1)
	{
		sData += giObjectContext;
	} 
	
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&reference=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsReference').val());
		sData += '&legalname=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsLegalName').val());
		sData += '&tradename=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsBusinessTradingName').val());
		sData += '&industry=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsIndustry').attr('onDemandID'));
		sData += '&abn=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsABN').val());
		sData += '&phonenumber=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsPhone').val());
		sData += '&faxnumber=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsFax').val());
		sData += '&webaddress=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsWebAddress').val());
		//sData += '&area=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsArea').val());
		sData += '&customerstatus=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsStatus').attr('onDemandID'));
		sData += '&notes=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDescription').val());
	}
	
	if ($('#divInterfaceMainAddress').html() != '')
	{
		sData += '&streetaddress1=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressStreetAddress1').val());
		sData += '&streetsuburb=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressStreetSuburb').val());
		sData += '&streetstate=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressStreetState').val());
		sData += '&streetpostcode=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressStreetPostCode').val());
		sData += '&streetcountry=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressStreetCountry').val());
		sData += '&mailingaddress1=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressMailingAddress1').val());
		sData += '&mailingsuburb=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressMailingSuburb').val());
		sData += '&mailingstate=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressMailingState').val());
		sData += '&mailingpostcode=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressMailingPostCode').val());
		sData += '&mailingcountry=' + interfaceMasterFormatSave($('#inputInterfaceMainAddressMailingCountry').val());
	}
	
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/contact/?' + sParam,
		data: sData,
		dataType: 'json',
		success: interfaceContactBusinessSaveProcess
	});
		
}

function interfaceContactBusinessSaveProcess(oResponse)
{
	//oResponse = eval('(' + data + ')');
	
	if (oResponse.status == 'OK')
	{
		interfaceMasterStatus('Saved');
		if (giObjectContext == -1) {var bNew = true}
		giObjectContext = oResponse.id;	
		
		if (bNew) {interfaceContactBusinessSearch('-' + giObjectContext)}
	}
	else
	{
		interfaceMasterStatus(oResponse.error.errornotes);
		interfaceMasterConfirm( {html: [oResponse.error.errornotes]
								   , title: 'Save error!'});
	}
}

function interfaceContactBusinessGroups(aParam, oXML)
{
	
	var sXHTMLElementID = 'divInterfaceMainGroups';
	var sLabel = "groups";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oXML == undefined)
	{
		var sParam = 'method=CONTACT_BUSINESS_GROUP_SEARCH&rows=100' +
						'&contactbusiness=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/directory/ondemand/contact.asp?rf=XML',
			data: sParam,
			dataType: 'xml',
			success: function(data){interfaceContactBusinessGroups(aParam, data)}
		});
	}
	else
	{
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainContactBusinessGroups" class="interfaceMain">' +
					'<tr id="trInterfaceMainContactBusinessGroupsRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainContactBusinessGroupsColumn1" class="interfaceMainColumn1Large">' +
					'</td>' +
					'<td id="tdInterfaceMainContactBusinessGroupsColumn2" style="width: 100px;" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divInterfaceMainGroups').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainBusinessGroupsColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainContactBusinessGroupsAdd" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainContactBusinessGroupsAdd">Add Group</span>' +
						'</td></tr>';
		
		aHTML[++h] = '<tr><td>' +
						'&nbsp;' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainContactBusinessGroupsColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainContactBusinessGroupsAdd').button(
		{
			label: "Add Group"
		})
		.click(function() {
			interfaceMasterOptionsSetPosition('spanInterfaceMainContactBusinessGroupsAdd', -50, -280);
			interfaceContactBusinessGroupsAdd(aParam);
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
			aHTML[++h] = '<td class="interfaceMainRowNothing">No groups.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainContactBusinessGroupsColumn1').html(aHTML.join(''));		
		}
		else
		{
		
			aHTML[++h] = '<table id="tableContactBusinessGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				
				if (onDemandXMLGetData(oRow, "grouptext") != '')
				{
					aHTML[++h] = '<tr class="interfaceMainRow">';
									
					aHTML[++h] = '<td id="tdContactBusinessGroupsList-title-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow">' +
											onDemandXMLGetData(oRow, "grouptext") + '</td>';
											
											
					aHTML[++h] = '<td id="tdContactBusinessGroupsList-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
											
					aHTML[++h] = '</tr>';
				}					
			}
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainContactBusinessGroupsColumn1').html(aHTML.join(''));
			
			$('.interfaceMainRowOptionsSelect').button( {
				text: false,
				 icons: {
					 primary: "ui-icon-close"
				}
			})
			.click(function() {
				interfaceContactBusinessGroupsAddRemove(this.id)
			})
			.css('width', '15px')
			.css('height', '20px')
		
		}
		
	}	
}	

function interfaceContactBusinessGroupsAdd(aParam, oXML)
{
		
	if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == 'spanInterfaceMainContactPersonGroupsAdd')
	{
		$('#divInterfaceMasterViewportControlOptions').slideUp(500);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{
		if (oXML == undefined)
		{
			var sParam = 'method=SETUP_CONTACT_BUSINESS_GROUP_SEARCH';
		
			$.ajax(
			{
				type: 'GET',
				url: '/directory/ondemand/setup.asp?rf=XML',
				data: sParam,
				dataType: 'xml',
				success: function(data){interfaceContactBusinessGroupsAdd(aParam, data)}
			});
		}
		else
		{
			
			$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', 'spanInterfaceMainContactPersonGroupsAdd')
			
			var aHTML = [];
			var h = -1;
			
			oRoot = oXML.getElementsByTagName("ondemand").item(0);
			
			if (oRoot.childNodes.length == 0)
			{
				aHTML[++h] = '<table id="tableContactBusinessGroupsAddSelect" border="0" cellspacing="0" cellpadding="0" class="interfaceSearchMedium">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No groups.</td></tr>';
				aHTML[++h] = '</tbody></table>';

				$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
				$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
			}
			else
			{
				aHTML[++h] = '<table id="tableContactBusinessGroupsAddSelect" class="interfaceSearchMedium" style="font-size:0.725em;">';
				aHTML[++h] = '<tbody>'
				
				for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
				{
					var oRow = oRoot.childNodes.item(iRow);
					
					aHTML[++h] = '<tr class="interfaceMainRow">';
					
					aHTML[++h] = '<td id="tdContactBusinessGroupsAddSelect-title-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRowSelect">' +
											onDemandXMLGetData(oRow, "title") + '</td>';
					
					aHTML[++h] = '</tr>'
				}
				
				aHTML[++h] = '</tbody></table>';

				$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
				$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
				
				$('td.interfaceMainRowSelect').click(function(event)
				{
					interfaceContactBusinessGroupsAddSelect(event.target.id);
				});
			}
		}
	}	
}
	
function interfaceContactBusinessGroupsAddSelect(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[2];
	
	$('#' + sXHTMLElementId).fadeOut(500);
	
	var sParam = 'method=CONTACT_BUSINESS_GROUP_MANAGE';
	var sData = 'contactbusiness=' + giObjectContext +
				'&group=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/contact/?' + sParam,
			data: sData,
			dataType: 'text',
			success: function(data){interfaceContactBusinessGroups()}
		});
		
}

function interfaceContactBusinessGroupsAddRemove(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	
	var sParam = 'method=CONTACT_BUSINESS_GROUP_MANAGE&remove=1';
	var sData = 'id=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/contact/?' + sParam,
			data: sData,
			dataType: 'text',
			success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
		});
		
}

function interfaceContactBusinessPeople(aParam, oXML)
{
	
	var sXHTMLElementID = 'divInterfaceMainPeople';
	var sLabel = "people";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oXML == undefined)
	{
	
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'contact';
		oSearch.method = 'CONTACT_PERSON_SEARCH';
		
		oSearch.addField('firstname,surname,position,workphone,fax,mobile,email');
		oSearch.async = false;
		oSearch.rf = 'xml';
		oSearch.rows = giReturnRows;
		oSearch.addFilter('contactbusiness', 'EQUAL_TO', giObjectContext);
		oSearch.sort('modifieddate', 'desc');
		
		oSearch.getResults(function(data) {interfaceContactBusinessPeople(aParam, data)});
		
	}
	else
	{
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainContactBusinessPeople" class="interfaceMain">' +
					'<tr id="trInterfaceMainContactBusinessPeopleRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainContactBusinessPeopleColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainContactBusinessPeopleColumn2" style="width: 100px;" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#' + sXHTMLElementID).html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainBusinessPeopleColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainContactBusinessPeopleAdd" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainContactBusinessPeopleAdd">Add</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainContactBusinessPeopleColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainContactBusinessPeopleAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			interfaceContactPersonMasterViewport({
				showHome: false,
				contactBusiness: giObjectContext,
				contactBusinessText: gsContactBusinessText,
				showNew: true});
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
			aHTML[++h] = '<td class="interfaceMainRowNothing">No people.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainContactBusinessPeopleColumn1').html(aHTML.join(''));		
		}
		else
		{
		
			aHTML[++h] = '<table id="tableContactBusinessGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">First Name</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Surname</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Position</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Mobile</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Email</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				aHTML[++h] = interfaceContactBusinessPeopleRow(oRow);
			}
			
			aHTML[++h] = '</tbody></table>';

			//$('#tdInterfaceMainContactBusinessPeopleColumn1').html(aHTML.join(''));
			
			interfaceMasterPaginationList(
			{
				xhtmlElementID: 'tdInterfaceMainContactBusinessPeopleColumn1',
				xhtmlContext: 'ContactBusinessPeople',
				xhtml: aHTML.join(''),
				showMore: ($(oRoot).attr('morerows') == "true"),
				more: $(oRoot).attr('moreid'),
				rows: giReturnRows,
				functionShowRow: interfaceContactBusinessPeopleRow,
				functionNewPage: 'interfaceContactBusinessPeopleBind()'
			}); 	
			
			interfaceContactBusinessPeopleBind();
		}
	}	
}	

function interfaceContactBusinessPeopleRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
							
	aHTML[++h] = '<td id="tdContactBusinessPeople_firstname-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow">' +
							onDemandXMLGetData(oRow, "firstname") + '</td>';
							
	aHTML[++h] = '<td id="tdContactBusinessPeople_surname-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow">' +
							onDemandXMLGetData(oRow, "surname") + '</td>';						
								
	aHTML[++h] = '<td id="tdContactBusinessPeople_position-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow">' +
							onDemandXMLGetData(oRow, "position") + '</td>';	

	aHTML[++h] = '<td id="tdContactBusinessPeople_mobile-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow">' +
							onDemandXMLGetData(oRow, "mobile") + '</td>';	

	aHTML[++h] = '<td id="tdContactBusinessPeople_email-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow">' +
							onDemandXMLGetData(oRow, "email") + '</td>';												
														
	aHTML[++h] = '<td id="tdContactBusinessPeople-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
							
	aHTML[++h] = '</tr>';	
	
	return aHTML.join('');
}

function interfaceContactBusinessPeopleBind()
{
	$('.interfaceMainRowOptionsSelect').button( {
				text: false,
				icons: {
					primary: "ui-icon-play"
				}
	})
	.click(function() {
		interfaceContactPersonMasterViewport({showHome: false});
		interfaceContactPersonSearch(this.id)
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
		interfaceContactBusinessPeopleRemove(this.id)
	})
	.css('width', '15px')
	.css('height', '20px')
	
}	

function interfaceContactBusinessNew(oXML)
{
	if (oXML == undefined)
	{
		var sParam = 'method=CORE_GET_NEW&rf=XML';

		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/core/?' + sParam,
			dataType: 'xml',
			success: interfaceContactBusinessNew
		});
	}	
	else	
	{
		giObjectContext = -1;
		goObjectContextXML = oXML;
		interfaceContactBusinessViewport();
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	
		interfaceContactBusinessDetails();
	}	
}

function interfaceContactBusinessByGroup(aParam, oXML)
{
	
	var sXHTMLElementID = 'divInterfaceMain';
	var sLabel = "groups";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oXML == undefined)
	{
		var sParam = 'method=SETUP_CONTACT_BUSINESS_GROUP_SEARCH';
		
		$.ajax(
		{
			type: 'GET',
			url: '/directory/ondemand/setup.asp?rf=XML',
			data: sParam,
			dataType: 'xml',
			success: function(data) {interfaceContactBusinessByGroup(aParam, data)}
		});
	}
	else
	{
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainContactBusinessByGroup" class="interfaceMain">' +
					'<tr id="trInterfaceMainContactBusinessByGroupRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainContactBusinessByGroupColumn1" style="width:150px;border-right-style:solid;border-width:2px;border-color:#B8B8B8;padding-right:15px;">' +
					'</td>' +
					'<td id="tdInterfaceMainContactBusinessByGroupColumn2" class="interfaceMainColumn1Large" style="padding-left:15px;">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		oRoot = oXML.getElementsByTagName("ondemand").item(0);
		
		if (oRoot.childNodes.length == 0)
		{
			aHTML[++h] = '<table id="tableContactBusinessByGroupSelect" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No groups.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainContactBusinessByGroupColumn1').html(aHTML.join(''));
		}
		else
		{
			aHTML[++h] = '<table id="tableContactBusinessByGroupSelect">';
			aHTML[++h] = '<tbody>'
			
			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="tdNewsGroupsAddSelect_title-' + onDemandXMLGetData(oRow, "id") +
										'-' + onDemandXMLGetData(oRow, "title") +
										'" class="interfaceRowSelect interfaceContactBusinessByGroup">' +
										onDemandXMLGetData(oRow, "title") + '</td>';
				
				aHTML[++h] = '</tr>'
			}
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainContactBusinessByGroupColumn1').html(aHTML.join(''));
						
			$('td.interfaceContactBusinessByGroup').click(function(event)
			{
				interfaceContactBusinessByGroupContacts({xhtmlElementID: event.target.id});
			});
		}
	}	
}	

function interfaceContactBusinessByGroupContacts(aParam, oXML)
{
	var sXHTMLElementID;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	var aXHTMLElementId = sXHTMLElementID.split('-')
	
	if (oXML == undefined)
	{
	
		$('#tdInterfaceMainContactBusinessByGroupColumn2').html(gsLoadingXHTML);
		
		var sParam = 'method=CONTACT_BUSINESS_GROUP_SEARCH&rows=' + giReturnRows +
						'&group=' + aXHTMLElementId[1];
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/contact/?rf=XML&' + sParam,
			dataType: 'xml',
			success: function(data){interfaceContactBusinessByGroupContacts(aParam, data)}
		});
	}
	else
	{
	
		var aHTML = [];
		var h = -1;
	
		var oRoot = oXML.getElementsByTagName("ondemand").item(0);
		
		if (oRoot.childNodes.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceNewsHomeMostLikely">';
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No contacts.</td></tr>';
			aHTML[++h] = '</tbody></table>';
		}
		else
		{		
			aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
				
			aHTML[++h] = '<table id="tableNewsGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td colspan=2 class="interfaceMainCaption">' + aXHTMLElementId[2] + '</td>';
			aHTML[++h] = '</tr>';
			
			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				aHTML[++h] = interfaceContactBusinessByGroupContactsRow(oRow);
			}
			
			aHTML[++h] = '</tbody></table>';
		}
		
		interfaceMasterPaginationList(
		{
			xhtmlElementID: "tdInterfaceMainContactBusinessByGroupColumn2",
			xhtmlContext: 'ContactBusinessGroupsContacts',
			xhtml: aHTML.join(''),
			showMore: ($(oRoot).attr('morerows') == "true"),
			more: $(oRoot).attr('moreid'),
			rows: giReturnRows,
			functionShowRow: interfaceContactBusinessByGroupContactsRow,
			functionNewPage: 'interfaceContactBusinessByGroupContactsBind()'
		}); 	
		
		interfaceContactBusinessByGroupContactsBind();
		
	}	
}	

function interfaceContactBusinessByGroupContactsRow(oRow)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
							
	aHTML[++h] = '<td id="tdContactBusinessGroupsContacts_contact-' + onDemandXMLGetData(oRow, "contactbusiness") + '" class="interfaceMainRow">' +
							onDemandXMLGetData(oRow, "contactbusinesstext") + '</td>';
							
	aHTML[++h] = '<td id="tdContactBusinessGroupsContacts-' + onDemandXMLGetData(oRow, "contactbusiness") + '" class="interfaceMainRowOptionsSelect interfaceContactBusinessGroupsContactsSelect">&nbsp;</td>';						
							
	aHTML[++h] = '</tr>';
				
	return aHTML.join('');
}	

function interfaceContactBusinessByGroupContactsBind()
{
	$('.interfaceContactBusinessGroupsContactsSelect').button( {
				text: false,
				icons: {
					primary: "ui-icon-play"
				}
	})
	.click(function() {
		interfaceContactBusinessMasterViewport({showHome: false});
		interfaceContactBusinessSearch(this.id)
	})
	.css('width', '15px')
	.css('height', '20px')
	
}	