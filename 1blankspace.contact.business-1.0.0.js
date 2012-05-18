var gsContactBusinessText;

$(function()
{
})

function interfaceContactBusinessMasterViewport(aParam)
{

	giObject = 12;
	gsObjectName = 'Business';
	goObjectContext = undefined;
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

function interfaceContactBusinessHomeShow(oResponse)
{
	if (oResponse == undefined)
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
		oSearch.rf = 'json';
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		
		oSearch.getResults(interfaceContactBusinessHomeShow);
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
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

			$.each(oResponse.data.rows, function()
			{		
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceContactBusinessHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.tradename +
										'</td>';
				
				aHTML[++h] = '</tr>'
			});
			
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
		oSearch.rf = 'json';
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
			
			oSearch.rf = 'json';
			oSearch.getResults(function(data) {interfaceContactBusinessSearchShow(aParam, data)}) 
		}
	};	
}

function interfaceContactBusinessSearchShow(aParam, oResponse)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
	
	if (oResponse.data.rows.length == 0)
	{
		interfaceMasterSearchStop();
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
			
			aHTML[++h] = '<td class="interfaceSearch" id="contactbusiness' +
							'-' + this.id + '">' +
							this.tradename + '</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		});
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(
			interfaceMasterPagination(
			{
				html: aHTML.join(''),
				more: (oResponse.morerows == "true")
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
			functionSearch: interfaceContactBusinessSearch,
			type: 'json'
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

function interfaceContactBusinessShow(aParam, oResponse)
{

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceContactBusinessViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find ContactBusiness.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
		
		gsContactBusinessText = goObjectContext.tradename;
				
		$('#divInterfaceViewportControlContext').html(goObjectContext.tradename);
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
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this contact.</td></tr>';
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
		
		if (goObjectContext.phonenumber != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPhone" class="interfaceMainSummary">Phone</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPhoneValue" class="interfaceMainSummaryValue">' +
						goObjectContext.phonenumber +
						'</td></tr>';
		}

		if (goObjectContext.customerstatustext != '')
		{
			aHTML[++h] =  '<tr><td id="tdInterfaceMainSummaryMobile" class="interfaceMainSummary">Status</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryMobileValue" class="interfaceMainSummaryValue">' +
						goObjectContext.customerstatustext +
						'</td>' +
						'</tr>';
		}
			
		if (goObjectContext.notes != '')
		{
			aHTML[++h] =  '<tr><td id="tdInterfaceMainSummaryNotes" class="interfaceMainSummary">Notes</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryNotesValue" class="interfaceMainSummaryValue">' +
						goObjectContext.notes +
						'</td>' +
						'</tr>';
		}
			
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
								
		if (goObjectContext.webaddress != '')
		{ 
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryWebAddress" class="interfaceMainColumn2Action">' +
						'<a href="' + goObjectContext.webaddress + '" id="aInterfaceMainSummaryWebAddress"' +
							' target="_blank">' + goObjectContext.webaddress + '</a>' +
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
		
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMainColumn1 interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsReference" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsReference" class="interfaceMain">' +
						'Reference' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsReference" class="inputInterfaceMainText">' +
						'</td></tr>';			

		aHTML[++h] = '<tr id="trInterfaceMainDetailsLegalName" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsLegalName" class="interfaceMain">' +
						'Legal Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsLegalNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsLegalNameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsLegalName" class="inputInterfaceMainText">' +
						'</td></tr>';			

		aHTML[++h] = '<tr id="trInterfaceMainDetailsTradingName" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTradingName" class="interfaceMain">' +
						'Trading Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTradingNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTradingNameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsBusinessTradingName" class="inputInterfaceMainText">' +
						'</td></tr>';			
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsIndustry" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsIndustry" class="interfaceMain">' +
						'Industry' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsIndustryValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsIndustryValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsIndustry" onDemandGoTo="interfaceClientGoTo1()" class="inputInterfaceMainSelect"' +
							' onDemandMethod="SETUP_CONTACT_INDUSTRY_SEARCH">' +
						'</td></tr>';				
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsABN" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsABN" class="interfaceMain">' +
						'ABN' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsABNValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsABNValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsABN" class="inputInterfaceMainText">' +
						'</td></tr>';				
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsPhone" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPhone" class="interfaceMain">' +
						'Phone' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsPhoneValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsPhoneValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsPhone" class="inputInterfaceMainText">' +
						'</td></tr>';				
				
		aHTML[++h] = '<tr id="trInterfaceMainDetailsFax" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsFax" class="interfaceMain">' +
						'Fax' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsFaxValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsFaxValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsFax" class="inputInterfaceMainText">' +
						'</td></tr>';
				
		aHTML[++h] = '<tr id="trInterfaceMainDetailsWebAddress" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsWebAddress" class="interfaceMain">' +
						'Website' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsWebAddressValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsWebAddressValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsWebAddress" class="inputInterfaceMainText">' +
						'</td></tr>';
						
/* 		aHTML[++h] = '<tr id="trInterfaceMainDetailsArea" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsArea" class="interfaceMain">' +
						'Area' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsAreaValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsAreaValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsArea" class="inputInterfaceMainSelect"' +
							' onDemandMethod="SETUP_AREA_SEARCH">' +
						'</td></tr>';					
 */			
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStatus" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStatus" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStatusValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsStatusValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsStatus" class="inputInterfaceMainSelect"' +
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
						'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsReference').val(goObjectContext.reference);
			$('#inputInterfaceMainDetailsLegalName').val(goObjectContext.legalname);
			$('#inputInterfaceMainDetailsBusinessTradingName').val(goObjectContext.tradename);
			$('#inputInterfaceMainDetailsIndustry').attr('onDemandID', goObjectContext.industry);
			$('#inputInterfaceMainDetailsIndustry').val(goObjectContext.industrytext);
			$('#inputInterfaceMainDetailsABN').val(goObjectContext.abn);
			$('#inputInterfaceMainDetailsPhone').val(goObjectContext.phonenumber);
			$('#inputInterfaceMainDetailsFax').val(goObjectContext.faxnumber);
			$('#inputInterfaceMainDetailsWebAddress').val(goObjectContext.webaddress);
			$('#inputInterfaceMainDetailsStatus').attr("onDemandID", goObjectContext.customerstatus);
			$('#inputInterfaceMainDetailsStatus').val(goObjectContext.customerstatustext);
			$('#inputInterfaceMainDetailsDescription').val(goObjectContext.notes);
		}
	
	}	
}

function interfaceContactBusinessAddress()
{

	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainAddress').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainAddress').attr('onDemandLoading', '');
				
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
						'<input id="inputInterfaceMainAddressStreetAddress1" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetSuburb" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetSuburb" class="interfaceMain">' +
						'Suburb' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetSuburbValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetSuburbValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressStreetSuburb" class="inputInterfaceMainText">' +
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
						'<input id="inputInterfaceMainAddressStreetAddress1" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingSuburb" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingSuburb" class="interfaceMain">' +
						'Suburb' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingSuburbValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingSuburbValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAddressMailingSuburb" class="inputInterfaceMainText">' +
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
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainAddressStreetAddress1').val(goObjectContext.streetaddress1);
			$('#inputInterfaceMainAddressStreetSuburb').val(goObjectContext.streetsuburb);
			$('#inputInterfaceMainAddressStreetState').val(goObjectContext.streetstate);
			$('#inputInterfaceMainAddressStreetPostCode').val(goObjectContext.streetpostcode);
			$('#inputInterfaceMainAddressStreetCountry').val(goObjectContext.streetcountry);
			$('#inputInterfaceMainAddressMailingAddress1').val(goObjectContext.mailingaddress1);
			$('#inputInterfaceMainAddressMailingSuburb').val(goObjectContext.mailingsuburb);
			$('#inputInterfaceMainAddressMailingState').val(goObjectContext.mailingstate);
			$('#inputInterfaceMainAddressMailingPostCode').val(goObjectContext.mailingpostcode);
			$('#inputInterfaceMainAddressMailingCountry').val(goObjectContext.mailingcountry);
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

function interfaceContactBusinessGroups(aParam, oResponse)
{	
	var sXHTMLElementID = 'divInterfaceMainGroups';
	var sLabel = "groups";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oResponse == undefined)
	{
		var sParam = 'contactbusiness=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/contact/?method=CONTACT_BUSINESS_GROUP_SEARCH&rows=100',
			data: sParam,
			dataType: 'json',
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
		
		if (oResponse.data.rows.length == 0)
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
			
			$.each(oResponse.data.rows, function()
			{
				if (this.grouptext != '')
				{
					aHTML[++h] = '<tr class="interfaceMainRow">';
									
					aHTML[++h] = '<td id="tdContactBusinessGroupsList-title-' + this.id + '" class="interfaceMainRow">' +
											this.grouptext + '</td>';
															
					aHTML[++h] = '<td id="tdContactBusinessGroupsList-' + this.id + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
											
					aHTML[++h] = '</tr>';
				}					
			});
			
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

function interfaceContactBusinessGroupsAdd(aParam, oResponse)
{
		
	if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == 'spanInterfaceMainContactPersonGroupsAdd')
	{
		$('#divInterfaceMasterViewportControlOptions').slideUp(500);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{
		if (oResponse == undefined)
		{
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?method=SETUP_CONTACT_BUSINESS_GROUP_SEARCH',
				dataType: 'json',
				success: function(data){interfaceContactBusinessGroupsAdd(aParam, data)}
			});
		}
		else
		{
			
			$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', 'spanInterfaceMainContactPersonGroupsAdd')
			
			var aHTML = [];
			var h = -1;
			
			if (oResponse.data.rows.length == 0)
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
				
				$.each(oResponse.data.rows, function()
				{
					aHTML[++h] = '<tr class="interfaceMainRow">';
					
					aHTML[++h] = '<td id="tdContactBusinessGroupsAddSelect-title-' + this.id + '" class="interfaceMainRowSelect">' +
											this.title + '</td>';
					
					aHTML[++h] = '</tr>'
				});
				
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
	
	var sData = 'contactbusiness=' + giObjectContext +
				'&group=' + sSearchContext;
				
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/contact/?method=CONTACT_BUSINESS_GROUP_MANAGE',
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
	
	var sData = 'id=' + sSearchContext;
				
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/contact/?method=CONTACT_BUSINESS_GROUP_MANAGE&remove=1',
		data: sData,
		dataType: 'text',
		success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
	});	
}

function interfaceContactBusinessPeople(aParam, oResponse)
{
	
	var sXHTMLElementID = 'divInterfaceMainPeople';
	var sLabel = "people";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oResponse == undefined)
	{
	
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'contact';
		oSearch.method = 'CONTACT_PERSON_SEARCH';
		
		oSearch.addField('firstname,surname,position,workphone,fax,mobile,email');
		oSearch.async = false;
		oSearch.rf = 'json';
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
		
		if (oResponse.data.rows.length == 0)
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
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = interfaceContactBusinessPeopleRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
			
			interfaceMasterPaginationList(
			{
				xhtmlElementID: 'tdInterfaceMainContactBusinessPeopleColumn1',
				xhtmlContext: 'ContactBusinessPeople',
				xhtml: aHTML.join(''),
				showMore: (oResponse.morerows == "true"),
				more: oResponse.moreid,
				rows: giReturnRows,
				functionShowRow: interfaceContactBusinessPeopleRow,
				functionNewPage: 'interfaceContactBusinessPeopleBind()',
				type: 'json'
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
							
	aHTML[++h] = '<td id="tdContactBusinessPeople_firstname-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.firstname + '</td>';
							
	aHTML[++h] = '<td id="tdContactBusinessPeople_surname-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.surname + '</td>';						
								
	aHTML[++h] = '<td id="tdContactBusinessPeople_position-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.position + '</td>';	

	aHTML[++h] = '<td id="tdContactBusinessPeople_mobile-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.mobile + '</td>';	

	aHTML[++h] = '<td id="tdContactBusinessPeople_email-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.email + '</td>';												
														
	aHTML[++h] = '<td id="tdContactBusinessPeople-' + oRow.id + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
							
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

function interfaceContactBusinessNew()
{
	goObjectContext = undefined
	giObjectContext = -1;
	interfaceContactBusinessViewport();
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	interfaceContactBusinessDetails();
}

function interfaceContactBusinessByGroup(aParam, oResponse)
{	
	var sXHTMLElementID = 'divInterfaceMain';
	var sLabel = "groups";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oResponse == undefined)
	{
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?method=SETUP_CONTACT_BUSINESS_GROUP_SEARCH',
			dataType: 'json',
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
		
		if (oResponse.data.rows.length == 0)
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
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="tdNewsGroupsAddSelect_title-' + tbis.id +
										'-' + this.title +
										'" class="interfaceRowSelect interfaceContactBusinessByGroup">' +
										this.title + '</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainContactBusinessByGroupColumn1').html(aHTML.join(''));
						
			$('td.interfaceContactBusinessByGroup').click(function(event)
			{
				interfaceContactBusinessByGroupContacts({xhtmlElementID: event.target.id});
			});
		}
	}	
}	

function interfaceContactBusinessByGroupContacts(aParam, oResponse)
{
	var sXHTMLElementID;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	var aXHTMLElementId = sXHTMLElementID.split('-')
	
	if (oResponse == undefined)
	{
		$('#tdInterfaceMainContactBusinessByGroupColumn2').html(gsLoadingXHTML);
		
		var sParam = 'method=CONTACT_BUSINESS_GROUP_SEARCH&rows=' + giReturnRows +
						'&group=' + aXHTMLElementId[1];
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/contact/?' + sParam,
			dataType: 'json',
			success: function(data){interfaceContactBusinessByGroupContacts(aParam, data)}
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
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
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = interfaceContactBusinessByGroupContactsRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		interfaceMasterPaginationList(
		{
			xhtmlElementID: "tdInterfaceMainContactBusinessByGroupColumn2",
			xhtmlContext: 'ContactBusinessGroupsContacts',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: giReturnRows,
			functionShowRow: interfaceContactBusinessByGroupContactsRow,
			functionNewPage: 'interfaceContactBusinessByGroupContactsBind()',
			type: 'json'
		}); 	
		
		interfaceContactBusinessByGroupContactsBind();
		
	}	
}	

function interfaceContactBusinessByGroupContactsRow(oRow)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
							
	aHTML[++h] = '<td id="tdContactBusinessGroupsContacts_contact-' + oRow.contactbusiness + '" class="interfaceMainRow">' +
							oRow.contactbusinesstext + '</td>';
							
	aHTML[++h] = '<td id="tdContactBusinessGroupsContacts-' + oRow.contactbusiness + '" class="interfaceMainRowOptionsSelect interfaceContactBusinessGroupsContactsSelect">&nbsp;</td>';						
							
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