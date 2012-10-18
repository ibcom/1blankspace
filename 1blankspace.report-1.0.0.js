/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
var gsReportEndpoint;
var gsReportMethod;
var gfReportSearchFunction;
var gsReportScriptOpen;
var gsReportScriptNewPage;
var goFixedParameters;
var goSelectableParameters;
var gaReportRowParam;
var gaAllParameterList;
var dToday = new Date();
var gsReturnParameters;
var gaReportList = [];
var gaReportDictionary = [];
var gaSelectAttributes = [];

function interfaceReportInitialise()
{
	gaReportList =
		[
			{
				name: "Businesses",
				method: "CONTACT_BUSINESS_SEARCH",
				returnParameters: 'contactbusiness,contactbusiness.relationshipbusiness,contactbusiness.customerstatuschange,contactbusiness.relationshipotherbusiness,contactbusiness.contactperson',
				functionSearch: interfaceContactBusinessSearch,
				scriptOpen: 'interfaceContactBusinessMasterViewport({showHome: false});interfaceContactBusinessSearch(this.id)',
			},
			{
				name: "People",
				method: "CONTACT_PERSON_SEARCH",
				returnParameters: 'contactperson,contactperson.contactbusiness,contactperson.contactbusiness.audititemtype',
				functionSearch: interfaceContactPersonSearch,
				scriptOpen: 'interfaceContactPersonMasterViewport({showHome: false});interfaceContactPersonSearch(this.id)',
				selectableParameters:
				{
					fields:
					[
						{name: "contactperson.surname", caption: "Surname"},
						{name: "contactperson.firstname", caption: "First Name"},
						{name: "contactperson.titletext", caption: "Title"},
						{name: "contactperson.gendertext", caption: "Gender"},
						{name: "contactperson.position", caption: "Position"},
						{name: "contactperson.workphone", caption: "Work Phone"},
						{name: "contactperson.fax", caption: "Fax"},
						{name: "contactperson.mobile", caption: "Mobile"},
						{name: "contactperson.email", caption: "Email"},
						{name: "contactperson.streetaddress1", caption: "Street Address 1"},
						{name: "contactperson.streetaddress2", caption: "Street Address 2"},
						{name: "contactperson.streetsuburb", caption: "Street Suburb"},
						{name: "contactperson.streetstate", caption: "Street State"},
						{name: "contactperson.streetpostcode", caption: "Street Postcode"},
						{name: "contactperson.streetcountry", caption: "Street Country"},
						{name: "contactperson.mailingtitle", caption: "Mailing Name"},
						{name: "contactperson.mailingaddress1", caption: "Mailing Address 1"},
						{name: "contactperson.mailingaddress2", caption: "Mailing Address 2"},
						{name: "contactperson.mailingsuburb", caption: "Mailing Suburb"},
						{name: "contactperson.mailingstate", caption: "Mailing State"},
						{name: "contactperson.mailingpostcode", caption: "Mailing Postcode"},
						{name: "contactperson.mailingcountry", caption: "Mailing Country"},
						{name: "contactperson.customerstatustext", caption: "Status"},
						{name: "contactperson.primarycontactfortext", caption: "Primary Contact For"},
						{name: "contactperson.contactbusiness.tradename", caption: "Business Trading Name"},
						{name: "contactperson.contactbusiness.legalname", caption: "Business Legal Name"},
						{name: "contactperson.contactbusiness.customerstatustext", caption: "Business Status"},
						{name: "contactperson.contactbusiness.mailingaddress1", caption: "Business Mailing Address 1"},
						{name: "contactperson.contactbusiness.mailingaddress2", caption: "Business Mailing Address 2"},
						{name: "contactperson.contactbusiness.mailingsuburb", caption: "Business Mailing Suburb"},
						{name: "contactperson.contactbusiness.mailingstate", caption: "Business Mailing State"},
						{name: "contactperson.contactbusiness.mailingpostcode", caption: "Business Mailing Postcode"},
						{name: "contactperson.contactbusiness.mailingcountry", caption: "Business Mailing Country"},
						{name: "contactperson.contactbusiness.streetaddress1", caption: "Business Street Address 1"},
						{name: "contactperson.contactbusiness.streetaddress2", caption: "Business Street Address 2"},
						{name: "contactperson.contactbusiness.streetsuburb", caption: "Business Street Suburb"},
						{name: "contactperson.contactbusiness.streetstate", caption: "Business Street State"},
						{name: "contactperson.contactbusiness.streetpostcode", caption: "Business Street Postcode"},
						{name: "contactperson.contactbusiness.streetcountry", caption: "Business Street Country"},
						{name: "contactperson.contactbusiness.areatext", caption: "Business Area"}
					]
				}
			},
			{
				name: "Opportunities",
				method: "OPPORTUNITY_SEARCH",
				returnParameters: 'opportunity.contactbusiness,opportunity.contactperson,opportunity.audititemtype,opportunity.processingstatushistory',
				functionSearch: interfaceOpportunitySearch,
				scriptOpen: 'interfaceOpportunityMasterViewport({showHome: false});interfaceOpportunitySearch(this.id)',
				selectableParameters:
				{
					fields:
					[
						{name: "opportunity.lodgeddate"},
						{name: "opportunity.managerusertext"},
						{name: "opportunity.sourcetext"},
						{name: "opportunity.sourcenote"},
						{name: "opportunity.description"},
						{name: "opportunity.amount"},
						{name: "opportunity.statustext"},
						{name: "opportunity.processingstatustext"},
						{name: "opportunity.processingdate"},
						{name: "opportunity.closedate"},
						{name: "opportunity.contactbusiness.tradename"},
						{name: "opportunity.contactbusiness.legalname"},
						{name: "opportunity.contactperson.firstname"},
						{name: "opportunity.contactperson.surname"},
						{name: "opportunity.contactperson.firstname"},
						{name: "opportunity.contactperson.phone"},
						{name: "opportunity.contactperson.mobile"},
						{name: "opportunity.contactperson.email"},
						{name: "opportunity.contactperson.streetaddress1"},
						{name: "opportunity.contactperson.streetaddress2"},
						{name: "opportunity.contactperson.streetsuburb"},
						{name: "opportunity.contactperson.streetstate"},
						{name: "opportunity.contactperson.streetpostcode"},
						{name: "opportunity.contactperson.mailingaddress1"},
						{name: "opportunity.contactperson.mailingaddress2"},
						{name: "opportunity.contactperson.mailingsuburb"},
						{name: "opportunity.contactperson.mailingstate"},
						{name: "opportunity.contactperson.mailingpostcode"}
					]
				}
			}
			
		]		

	gaReportDictionary =
		[ 
			{name: "contactbusiness.tradename", caption: "Trading Name"},
			{name: "contactbusiness.legalname", caption: "Company Name"},
			{name: "contactbusiness.abn", caption: "ABN"},
			{name: "contactbusiness.webaddress", caption: "Website"},
			{name: "contactbusiness.phonenumber", caption: "Phone"},
			{name: "contactbusiness.faxnumber", caption: "Fax"},
			{name: "contactbusiness.customerstatustext", caption: "Status"},
			{name: "contactbusiness.industrytext", caption: "Industry"},
			{name: "contactbusiness.streetaddresscombined", caption: "Street Address"},
			{name: "contactbusiness.streetaddress1", caption: "Street Address 1"},
			{name: "contactbusiness.streetaddress2", caption: "Street Address 2"},
			{name: "contactbusiness.streetsuburb", caption: "Street Suburb"},
			{name: "contactbusiness.streetstate", caption: "Street State"},
			{name: "contactbusiness.streetpostcode", caption: "Street Postcode"},
			{name: "contactbusiness.streetcountry", caption: "Street Country"},
			{name: "contactbusiness.mailingaddresscombined", caption: "Mailing Address"},
			{name: "contactbusiness.mailingaddress1", caption: "Mailing Address 1"},
			{name: "contactbusiness.mailingaddress2", caption: "Mailing Address 2"},
			{name: "contactbusiness.mailingsuburb", caption: "Mailing Suburb"},
			{name: "contactbusiness.mailingstate", caption: "Mailing State"},
			{name: "contactbusiness.mailingpostcode", caption: "Mailing Postcode"},
			{name: "contactbusiness.mailingcountry", caption: "Mailing Country"},
			{name: "contactbusiness.notes", caption: "Notes"},
			{name: "contactbusiness.reference", caption: "Reference"},
			{name: "contactbusiness.areatext", caption: "Business Area"},
			{name: "contactbusiness.primarycontactpersontext", caption: "Primary Contact"},
			{name: "contactbusiness.businessgrouptext", caption: "Type"},
			{name: "contactbusiness.relationshipbusiness.contactbusinesstext", caption: "Parent Group"},
			{name: "contactbusiness.relationshipbusiness.othercontactbusinesstext", caption: "Parent Group Child"},
			{name: "contactbusiness.customerstatuschange.tostatustext", caption: "Status History"},
			{name: "contactbusiness.customerstatuschange.changedate", caption: "Status History Effective Date"},
			{name: "contactbusiness.contactperson.firstname", caption: "Primary Contact First Name"},
			{name: "contactbusiness.contactperson.surname", caption: "Primary Contact Surname"},
			{name: "contactbusiness.contactperson.email", caption: "Primary Contact Email"},
			
			{name: "contactperson.surname", caption: "Surname"},
			{name: "contactperson.titletext", caption: "Title"},
			{name: "contactperson.gendertext", caption: "Gender"},
			{name: "contactperson.contactbusinesstext", caption: "Business Name"},
			{name: "contactperson.firstname", caption: "First Name"},
			{name: "contactperson.position", caption: "Position"},
			{name: "contactperson.workphone", caption: "Work Phone"},
			{name: "contactperson.fax", caption: "Fax"},
			{name: "contactperson.mobile", caption: "Mobile"},
			{name: "contactperson.email", caption: "Email"},
			{name: "contactperson.streetaddresscombined", caption: "Street Address"},
			{name: "contactperson.streetaddress1", caption: "Street Address 1"},
			{name: "contactperson.streetaddress2", caption: "Street Address 2"},
			{name: "contactperson.streetsuburb", caption: "Street Suburb"},
			{name: "contactperson.streetstate", caption: "Street State"},
			{name: "contactperson.streetpostcode", caption: "Street Postcode"},
			{name: "contactperson.streetcountry", caption: "Street Country"},
			{name: "contactperson.mailingtitle", caption: "Mailing Name"},
			{name: "contactperson.mailingaddresscombined", caption: "Mailing Address"},
			{name: "contactperson.mailingaddress1", caption: "Mailing Address 1"},
			{name: "contactperson.mailingaddress2", caption: "Mailing Address 2"},
			{name: "contactperson.mailingsuburb", caption: "Mailing Suburb"},
			{name: "contactperson.mailingstate", caption: "Mailing State"},
			{name: "contactperson.mailingpostcode", caption: "Mailing Postcode"},
			{name: "contactperson.mailingcountry", caption: "Mailing Country"},
			{name: "contactperson.customerstatustext", caption: "Business Contact Status"},
			{name: "contactperson.supplierstatustext", caption: "Auditor Status"},
			{name: "contactperson.persongrouptext", caption: "Contact Person Type"},
			{name: "contactperson.primarycontactfortext", caption: "Primary Contact For"},
			{name: "contactperson.contactbusiness.tradename", caption: "Business Trading Name"},
			{name: "contactperson.contactbusiness.legalname", caption: "Business Legal Name"},
			{name: "contactperson.contactbusiness.customerstatustext", caption: "Business Status"},
			{name: "contactperson.contactbusiness.mailingaddress1", caption: "Business Mailing Address 1"},
			{name: "contactperson.contactbusiness.mailingaddress2", caption: "Business Mailing Address 2"},
			{name: "contactperson.contactbusiness.mailingsuburb", caption: "Business Mailing Suburb"},
			{name: "contactperson.contactbusiness.mailingstate", caption: "Business Mailing State"},
			{name: "contactperson.contactbusiness.mailingpostcode", caption: "Business Mailing Postcode"},
			{name: "contactperson.contactbusiness.mailingcountry", caption: "Business Mailing Country"},
			{name: "contactperson.contactbusiness.streetaddress1", caption: "Business Street Address 1"},
			{name: "contactperson.contactbusiness.streetaddress2", caption: "Business Street Address 2"},
			{name: "contactperson.contactbusiness.streetsuburb", caption: "Business Street Suburb"},
			{name: "contactperson.contactbusiness.streetstate", caption: "Business Street State"},
			{name: "contactperson.contactbusiness.streetpostcode", caption: "Business Street Postcode"},
			{name: "contactperson.contactbusiness.streetcountry", caption: "Business Street Country"},
			{name: "contactperson.contactbusiness.areatext", caption: "Business Area"},
			{name: "contactperson.contactbusiness.audititemtype.itemtypetext", caption: "Business Standard"},
			{name: "contactperson.sq2016", caption: "Auditor Internal Manager "},
			{name: "contactperson.sq2015", caption: "Auditor Internal Manager Id"},
			{name: "contactperson.audititemtype.itemtypecategorytext", caption: "Choose code type"},
			{name: "contactperson.audititemtype.itemtypetext", caption: "Standard / Code"},
			{name: "contactperson.audititemtype.startdate", caption: "Eligible From"},
			{name: "contactperson.audititemtype.enddate", caption: "Expires On"},
			{name: "contactperson.audititemtype.approveddate", caption: "Expires On"},
			{name: "contactperson.audititemtype.reference", caption: "Registration Number"},
					
			{name: "opportunity.lodgeddate", caption: "Date Lodged"},
			{name: "opportunity.managerusertext", caption: "SciQual Manager"},
			{name: "opportunity.sourcetext", caption: "Source of Contact"},
			{name: "opportunity.sourcenote", caption: "Source of Contact - Other"},
			{name: "opportunity.description", caption: "Description"},
			{name: "opportunity.amount", caption: "Quoted Amount"},
			{name: "opportunity.statustext", caption: "Quote Status"},
			{name: "opportunity.processingstatustext", caption: "Processing Status"},
			{name: "opportunity.processingdate", caption: "Quote Processing Date"},
			{name: "opportunity.closedate", caption: "Date Closed"},
			{name: "opportunity.audititemtype.itemtypetext", caption: "Standard / Code"},
			{name: "opportunity.audititemtype.itemtypecategorytext", caption: "Please select a Standard / Code type"},
			{name: "opportunity.processingstatushistory.newstatus", caption: "Processing Status History"},
			{name: "opportunity.processingstatushistory.createddate", caption: "Processing Status History Effective Date"},
			
			{name: "opportunity.contactbusiness.tradename", caption: "Business Trading Name"},
			{name: "opportunity.contactbusiness.legalname", caption: "Business Legal Name"},
			{name: "opportunity.contactperson.firstname", caption: "Business Contact First Name"},
			{name: "opportunity.contactperson.surname", caption: "Business Contact Surname"},
			{name: "opportunity.contactperson.firstname", caption: "Business Contact First Name"},
			{name: "opportunity.contactperson.phone", caption: "Business Phone"},
			{name: "opportunity.contactperson.mobile", caption: "Mobile Phone"},
			{name: "opportunity.contactperson.email", caption: "Contact Email"},
			{name: "opportunity.contactperson.streetaddresscomplete", caption: "Street Address (All)"},
			{name: "opportunity.contactperson.streetaddresscombined", caption: "Street Address"},
			{name: "opportunity.contactperson.streetaddress1", caption: "Street Address 1"},
			{name: "opportunity.contactperson.streetaddress2", caption: "Street Address 2"},
			{name: "opportunity.contactperson.streetsuburb", caption: "Street Address Suburb"},
			{name: "opportunity.contactperson.streetstate", caption: "Street Address State"},
			{name: "opportunity.contactperson.streetpostcode", caption: "Street Address Postcode"},
			{name: "opportunity.contactperson.mailingaddresscomplete", caption: "Mailing Address (All)"},
			{name: "opportunity.contactperson.mailingaddresscombined", caption: "Mailing Address"},
			{name: "opportunity.contactperson.mailingaddress1", caption: "Mailing Address 1"},
			{name: "opportunity.contactperson.mailingaddress2", caption: "Mailing Address 2"},
			{name: "opportunity.contactperson.mailingsuburb", caption: "Mailing Address Suburb"},
			{name: "opportunity.contactperson.mailingstate", caption: "Mailing Address State"},
			{name: "opportunity.contactperson.mailingpostcode", caption: "Mailing Address Postcode"},

			{name: "opportunity.phone", caption: "Business Phone"},
			{name: "opportunity.mobile", caption: "Mobile Phone"},
			{name: "opportunity.email", caption: "Contact Email"},
			{name: "opportunity.businessname", caption: "Business Name"},
			{name: "opportunity.firstname", caption: "First Name"},
			{name: "opportunity.surname", caption: "Surname"},
			{name: "opportunity.mailingaddress1", caption: "Mailing Address 1"},
			{name: "opportunity.mailingaddress2", caption: "Mailing Address 2"},
			{name: "opportunity.mailingsuburb", caption: "Mailing Address Suburb"},
			{name: "opportunity.mailingstate", caption: "Mailing State"},
			{name: "opportunity.mailingpostcode", caption: "Mailing  Postcode"},
			{name: "opportunity.mailingcountry", caption: "Mailing Country"},
			{name: "opportunity.sq1967", caption: "Business Legal Name"},
			{name: "opportunity.sq1968", caption: "Street Address"}
		];

	gaSelectAttributes = 			
		[
			{
				name: "contact.businesstext", 
				addClass: "inputInterfaceMainSelectBusiness",
				onDemandColumns: "tradename-space-customerstatustext"
			},
			{
				name: "contactbusiness.primarycontactpersontext",
				addClass: "inputInterfaceMainSelectBusiness",
				onDemandColumns: "tradename-space-customerstatustext"
			},
			{
				name: "contactperson.contactbusinesstext",
				addClass: "inputInterfaceMainSelectBusiness",
				onDemandColumns: "tradename-space-customerstatustext"
			},
			{
				name: "contactperson.audititemtype.itemtypetext",
				onDemandColumns: "code-space-openbracket-categorytext-closebracket"
				
			}
		];
}

function interfaceReportMasterViewport(aParam)
{
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}

	ns1blankspace.object = 5;
	ns1blankspace.objectName = 'Reporting';
	ns1blankspace.objectContextData = undefined;
	ns1blankspace.objectContext = -1;
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceReportMasterViewport({showHome: true});',
			move: false
			})		
	}	
			
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Reporting"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceReportSearch('inputInterfaceMasterViewportControlSearch')", ns1blankspace.option.typingWait);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceReportSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceReportSearchOptions();
	});
		
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceReportSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceReportSetupOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceReportSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceReportSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	if (ns1blankspace.option.setFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	
	interfaceReportInitialise()
	
	if (bShowHome) {interfaceReportHomeShow()};	
}

function interfaceReportHomeShow(aParam, oResponse)
{
	
	var aHTML = [];
	var h = -1;
				
	aHTML[++h] = '<table>';
	aHTML[++h] = '<tr>' +
					'<td id="interfaceMasterViewportReportLarge" class="interfaceMasterViewportImageLarge">' +
					'&nbsp;' + 
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';		
	
	aHTML[++h] = '<table>';
	
	$.each(gaReportList, function()
	{
		var sName = (this.name).replace(/ /g,'')
		
		aHTML[++h] = '<tr id="trInterfaceViewportControl' + sName + '" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControl' + sName + '" class="interfaceViewportControl"' +
								' data-method="' + this.method + '">' + this.name + '</td>' +
						'</tr>';	
	});
	
	aHTML[++h] = '</table>';		
	
	$('#divInterfaceViewportControl').html(aHTML.join(''));	
	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<div id="divInterfaceMainReport" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$.each(gaReportList, function()
	{
		var sName = (this.name).replace(/ /g,'')
				
		$('#tdInterfaceViewportControl' + sName).data('param', this);
		
		$('#tdInterfaceViewportControl' + sName).click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMainReport");
			var sMethod = $(this).attr('data-method');
			interfaceReportViewport($(this).data('param'));
		});				
	});
	
	interfaceMasterMainViewportShow("#divInterfaceMainReport", false);
	
	var aHTML = [];
	var h = -1;
				
	aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
	aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
					'<td id="tdInterfaceReportHomeMostLikely" class="interfaceViewportMain">' +
					'Please select a report from the list to the left.' + 
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';					
	
	$('#divInterfaceMainReport').html(aHTML.join(''));
}

function interfaceReportDictionaryGet(aParam)
{
	var sName;
	var sReturn;
	var sDefaultReturn;
	var bOnlyIfExists = true
	
	if (aParam != undefined)
	{
		if (aParam.name != undefined) {sName = aParam.name}
		if (aParam.defaultReturn != undefined) {sDefaultReturn = aParam.defaultReturn}
		if (aParam.onlyIfExists != undefined) {bOnlyIfExists = aParam.onlyIfExists}
	}
	
	if (!bOnlyIfExists)
	{
		if (sDefaultReturn != undefined) {sReturn = sDefaultReturn}
		if (sReturn == undefined) {sReturn = sName}
	};
	
	$.each(gaReportDictionary, function()
	{
		if (this.name == sName)
		{
			sReturn = this.caption;
			return false;
		}
		else
		{
			return true;
		}	
	});

	return sReturn
} 

function interfaceReportViewport(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	var sCaption;
	var sComparison;
	var sComparisonValue;
	var aDefault = [];
	var sJSONSearch;
	var aSelectableParameterList = [];
	var aSelectableParameters = [];
	var oSelectableParameters = {};
	var oFixedParameters = {};
	var bShowSelect = true;
	var bShowFixedParameters = true;
	var sSummary;
	var iSurveyId;
	var iCategoryId;
	var sSearchFilter;
	var bShowSort = true;
	var bContainsContactPerson = false;
	
	gsReportMethod = undefined;
	gsReportEndpoint = undefined;
	gsReturnParameters = undefined;
	gfReportSearchFunction = undefined;
	gsReportScriptOpen = undefined;
	gsReportScriptNewPage = undefined;
	gaReportRowParam = undefined;
	goSelectableParameters = undefined;
	gaAllParameterList = [];

	if (aParam != undefined)
	{
		if (aParam.endPoint != undefined) {gsReportEndpoint = aParam.endPoint}
		if (aParam.method != undefined) {gsReportMethod = aParam.method}
		if (aParam.returnParameters != undefined) {gsReturnParameters = aParam.returnParameters}
		if (aParam.jsonSearch != undefined) {sJSONSearch = aParam.jsonSearch}
		if (aParam.functionSearch != undefined) {gfReportSearchFunction = aParam.functionSearch}
		if (aParam.scriptOpen != undefined) {gsReportScriptOpen = aParam.scriptOpen}
		if (aParam.scriptNewPage != undefined) {gsReportScriptNewPage = aParam.scriptNewPage}
		if (aParam.selectableParameters != undefined) {oSelectableParameters = aParam.selectableParameters}
		if (aParam.fixedParameters != undefined) {oFixedParameters = aParam.fixedParameters}
		if (aParam.showSelect != undefined) {bShowSelect = aParam.showSelect}
		if (aParam.showFixedParameters != undefined) {bShowFixedParameters = aParam.showFixedParameters}
		if (aParam.summary != undefined) {sSummary = aParam.summary}
		if (aParam.survey != undefined) {iSurveyId = aParam.survey}
		if (aParam.category != undefined) {iCategoryId = aParam.category}
		if (aParam.showSort != undefined) {bShowSort = aParam.showSort}
	}
	
	if (gsReportEndpoint == undefined && gsReportMethod != undefined)
	{
		var aMethod = gsReportMethod.split('_');
		gsReportEndpoint = (aMethod[0]).toLowerCase();
	}
	
	goFixedParameters = oFixedParameters;
	goSelectableParameters = oSelectableParameters;
	
	if (!bShowSelect)
	{
		aHTML[++h] = '<div id="divInterfaceMainReportHeader"></div>';
		aHTML[++h] = '<div style="display:none;" id="divInterfaceMainReportResults"></div>';
		aHTML[++h] = '<div style="display:none;" id="divInterfaceMainReportSend">No data.</div>';
		$('#divInterfaceMainReport').html(aHTML.join(''));	
			
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceReportSearch" class="interfaceMain" style="font-size:0.875em;">';

		if (sSummary != undefined)
		{
			aHTML[++h] = '<tr><td style="color:#B8B8B8;padding:2px;">' +
								sSummary +
								'</td></tr>';
		}	
		
		aHTML[++h] = '</table>';
			
		$('#divInterfaceMainReportHeader').html(aHTML.join(''))	
		
		interfaceReportSearch(aParam);
	}
	else
	{
		if (oResponse == undefined)
		{
			aHTML[++h] = '<div id="divInterfaceMainReportHeader">' + ns1blankspace.xhtml.loading + '</div>';
			aHTML[++h] = '<div id="divInterfaceMainReportSearch"></div>';
			aHTML[++h] = '<div style="display:none;" id="divInterfaceMainReportResults">No results.</div>';
			aHTML[++h] = '<div style="display:none;" id="divInterfaceMainReportSend">No data.</div>';
			$('#divInterfaceMainReport').html(aHTML.join(''));	
		}
		
		if (oResponse == undefined && sJSONSearch != undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.returnParameters = gsReturnParameters;
			oSearch.rf = 'json';
			oSearch.getResults(sJSONSearch, function(data) {interfaceReportViewport(aParam, data)}) ;	
		}
		
		else if (oResponse == undefined && gsReportMethod != undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.endPoint = gsReportEndpoint;
			oSearch.method = gsReportMethod;
			if (iSurveyId != undefined)
			{	oSearch.survey = iSurveyId;}
			if (iCategoryId != undefined)
			{	oSearch.categoryId = iCategoryId;}
			oSearch.returnParameters = gsReturnParameters;
			oSearch.rf = 'json';
			oSearch.getResults(function(data) {interfaceReportViewport(aParam, data)}) ;
		}
		
		else if (oResponse != undefined)
		{
			if (oSelectableParameters.fields != undefined)
			{
				$.each(oSelectableParameters.fields, function() 
				{ 
					aSelectableParameterList.push(this.name);
					aSelectableParameters.push(this);
					var sCaption = this.caption;
					if (sCaption == undefined)
					{	
						sCaption = interfaceReportDictionaryGet({name: this.name});
						if (sCaption == undefined) { sCaption = this.name;	}
					}
					gaAllParameterList.push({name: this.name, caption: sCaption})
					//this.name.toLowerCase().indexOf('contactperson') != -1 && 
				});	
			}
			
			if (bShowSort && goFixedParameters.fields != undefined)
			{
				$.each(goFixedParameters.fields, function()
				{
					gaAllParameterList.push({name: this.name});
					var sCaption = this.caption;
					if (sCaption == undefined)
					{	
						sCaption = interfaceReportDictionaryGet({name: this.name});
						if (sCaption == undefined) { sCaption = this.name;	}
					}
					gaAllParameterList.push({name: this.name, caption: sCaption})
				});
			}
			
			var aSelectAttributesList = []
			$.each(gaSelectAttributes, function()
			{	aSelectAttributesList.push(this.name);	});
			
			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<table style="margin-bottom:0px;border-bottom-style:solid;border-width: 1px;border-color:#E8E8E8;" id="tableInterfaceReport" class="interfaceMain">';
			aHTML[++h] = '<tr><td style="vertical-alignment:bottom;padding-top:10px;">' + 
								'<span id="spanReportHeaderSearch">Search</span>' +
								'<span style="color:#B8B8B8;">&nbsp;|&nbsp;</span>' + 
								'<span id="spanReportHeaderResults" style="cursor: pointer;">Results</span>' + 
								'<span style="color:#B8B8B8;">&nbsp;|&nbsp;</span>' + 
								'<span id="spanReportHeaderSend" style="cursor: pointer;">Send</span>' + 
						 '</td>';
			aHTML[++h] = '<td style="text-align:right;font-size:0.75em;"><span id="spanInterfaceReportSearch">Search</span></td>';
			aHTML[++h] = '<td style="text-align:right;font-size:0.75em;"><span id="spanInterfaceReportExport">&nbsp;</span></td></tr>';
			aHTML[++h] = '</table>';
			
			$('#divInterfaceMainReportHeader').html(aHTML.join(''))
			
			$('#spanReportHeaderSend').hide();
			$('#spanReportHeaderSearch').addClass('Highlight')
			
			$('#spanReportHeaderSearch').click(function(event)
			{
				$('#divInterfaceMainReportSearch').show();
				$('#divInterfaceMainReportResults').hide();
				$('#divInterfaceMainReportSend').hide();
				$('#spanReportHeaderSearch').css('cursor', 'auto');
				$('#spanReportHeaderResults').css('cursor', 'pointer');
				$('#spanReportHeaderSend').css('cursor', 'pointer');
				$('#spanReportHeaderSearch').addClass('Highlight');
				$('#spanReportHeaderResults').removeClass('Highlight');
				$('#spanReportHeaderSend').removeClass('Highlight');
				$('#spanInterfaceReportExport').button("destroy");
				$('#spanInterfaceReportExport').html("&nbsp;");
				$('#spanInterfaceReportExport').unbind("click");
			});
			
			$('#spanReportHeaderResults').click(function(event)
			{
				$('#divInterfaceMainReportSearch').hide();
				$('#divInterfaceMainReportResults').show();
				$('#divInterfaceMainReportSend').hide();
				$('#spanReportHeaderSearch').css('cursor', 'pointer');
				$('#spanReportHeaderResults').css('cursor', 'auto');
				$('#spanReportHeaderSend').css('cursor', 'pointer');
				$('#spanReportHeaderSearch').removeClass('Highlight');
				$('#spanReportHeaderResults').addClass('Highlight');
				$('#spanReportHeaderSend').removeClass('Highlight');
			});
			
			$('#spanReportHeaderSend').click(function(event)
			{
				$('#divInterfaceMainReportSearch').hide();
				$('#divInterfaceMainReportResults').hide();
				$('#divInterfaceMainReportSend').show();
				$('#spanReportHeaderSearch').css('cursor', 'pointer');
				$('#spanReportHeaderResults').css('cursor', 'pointer');
				$('#spanReportHeaderSend').css('cursor', 'auto');
				$('#spanReportHeaderSearch').removeClass('Highlight');
				$('#spanReportHeaderResults').removeClass('Highlight');
				$('#spanReportHeaderSend').addClass('Highlight');
			});
			
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table id="tableInterfaceReportSearch" class="interfaceMain" style="font-size:0.875em;">';

			if (sSummary != undefined)
			{
				aHTML[++h] = '<tr><td colspan=4 style="color:#B8B8B8;padding:2px;">' +
									sSummary +
									'</td></tr>';
			}
			
			if (oFixedParameters.fields != undefined && bShowFixedParameters)
			{
				$.each(oFixedParameters.fields, function() 
				{ 
					sCaption = interfaceReportDictionaryGet({name: this.name})
					var sName = (this.name).replace(/\./g,'_')
					
					aHTML[++h] = '<tr><td colspan=2 style="color:#B8B8B8;padding:2px;">' +
									sCaption +
									'</td>' +
									'<td colspan=2 style="color:#B8B8B8;padding:2px;"' +
									' id="reportHeaderComparison' + sName + '"></td></tr>';
				});	
			}
			
			aHTML[++h] = '<tr><td colspan=2 style="color:#B8B8B8;padding:4px;background-color:#F8F8F8;">Select</td>' +
							'<td colspan=2 style="color:#B8B8B8;padding:4px;background-color:#F8F8F8;">Comparison</td></tr>';
			
			$.each(oResponse.data.parameters, function() 
			{ 
				sCaption = interfaceReportDictionaryGet({name: this.name})
				
				var iSelectableIndex = $.inArray(this.name, aSelectableParameterList)
				var sSearchFilter = '';
				
				if (iSelectableIndex != -1)
				{
					if (aSelectableParameters[iSelectableIndex].caption != undefined)
					{
						sCaption = aSelectableParameters[iSelectableIndex].caption;
					}

					if (aSelectableParameters[iSelectableIndex].xhtmlBefore != undefined)
					{
						aHTML[++h] = '<tr><td colspan=4 class="interfaceMainReport">' +
										aSelectableParameters[iSelectableIndex].xhtmlBefore +
										'</td></tr>';
					}
					
					if (aSelectableParameters[iSelectableIndex].searchFilter != undefined)
					{
						sSearchFilter = aSelectableParameters[iSelectableIndex].searchFilter;
					}

				}	
				
				if (sCaption != undefined && (iSelectableIndex != -1 || aSelectableParameterList.length == 0))
				{
					var sName = (this.name).replace(/\./g,'_');
					var iSelectAttributes = $.inArray(this.name, aSelectAttributesList);
					var sClass = 'interfaceMainReport';
					var sMoreAttributes = "";
					gaAllParameterList.push({name: this.name, caption: sCaption})
					var bSelect = false;
					var sSearchEndPoint = this.searchendpoint;
					var sSearchMethod = this.searchmethod;
					var sSearchRelatedField = this.searchrelatedfield;
					
					if (iSelectAttributes >= 0)
					{	
						if (gaSelectAttributes[iSelectAttributes].addClass != undefined) {sMoreAttributes += ' data-selectClass="' + gaSelectAttributes[iSelectAttributes].addClass + '"';	}
						if (gaSelectAttributes[iSelectAttributes].onDemandColumns != undefined) {sMoreAttributes += ' data-onDemandColumns="' + gaSelectAttributes[iSelectAttributes].onDemandColumns + '"';	}
						if (gaSelectAttributes[iSelectAttributes].onDemandGroupFilter != undefined) {sMoreAttributes += ' data-onDemandGroupFilter="' + gaSelectAttributes[iSelectAttributes].onDemandGroupFilter + '"';	}
						if (gaSelectAttributes[iSelectAttributes].onDemandGroupType != undefined) {sMoreAttributes += ' data-onDemandGroupType="' + gaSelectAttributes[iSelectAttributes].onDemandGroupType + '"';	}
						if (sMoreAttributes != "") {sMoreAttributes += ' style="width:200px"';}
					}
					else
					{	
						if (iSelectableIndex != -1)
						{
							if (aSelectableParameters[iSelectableIndex].onDemandColumns != undefined) 
							{	sMoreAttributes += ' data-onDemandColumns="' + aSelectableParameters[iSelectableIndex].onDemandColumns + '"'; }

							if (aSelectableParameters[iSelectableIndex].onDemandClick != undefined) 
							{	sMoreAttributes += ' data-onDemandClick="' + aSelectableParameters[iSelectableIndex].onDemandClick + '"'; }
							
							if (aSelectableParameters[iSelectableIndex].searchmethod != undefined)
							{	
								bSelect = true;
								sSearchMethod = aSelectableParameters[iSelectableIndex].searchmethod; 
							}
							
							if (aSelectableParameters[iSelectableIndex].searchendpoint != undefined)
							{	sSearchEndPoint = aSelectableParameters[iSelectableIndex].searchendpoint; }
							
							if (aSelectableParameters[iSelectableIndex].searchrelatedfield != undefined)
							{	sSearchRelatedField = aSelectableParameters[iSelectableIndex].searchrelatedfield; }
							
						}
					}
				
					aHTML[++h] = '<tr><td style="width:15px;" id="tdInterfaceMainReport_include_' + sName + '">' +
								'<input type="checkbox" id="checkInterfaceMainReport_include-' + sName + '"' +
									' data-name="' + this.name + '"' +
									' class="interfaceMainReportInclude">' +
								'</td>';
				
					aHTML[++h] = '<td style="width:200px;" id="tdInterfaceMainReport_caption_' + sName + '" class="interfaceMainReport">' +
								sCaption +
								'</td>';
					
					aHTML[++h] = '<td style="width:200px;cursor: pointer;" id="tdInterfaceMainReport_comparison-' + sName + '-' + this.datatype + '"' +
										' data-dataType="' + this.datatype + '"' +
										' data-searchEndpoint="' + sSearchEndPoint + '"' +
										' data-searchMethod="' + sSearchMethod + sSearchFilter + '"' +
										' data-inputType="';
					if (bSelect)
					{	aHTML[++h] =  "select"; }
					else
					{	aHTML[++h] = this.inputtype; }
					aHTML[++h] =  '"' +
										' data-searchRelatedField="' + sSearchRelatedField + '"' +
										sMoreAttributes + 
										'  class="interfaceMainReportComparison"></td>';
										
					aHTML[++h] = '<td id="tdInterfaceMainReport_input-' + sName + '-' + this.datatype + '" class="' + sClass + '"></td>';
					
					aHTML[++h] = '</tr>';
					
				}
				
				if (iSelectableIndex != -1)
				{
					if (aSelectableParameters[iSelectableIndex].xhtmlAfter != undefined)
					{
						aHTML[++h] = '<tr><td colspan=4 class="interfaceMainReport">' +
										aSelectableParameters[iSelectableIndex].xhtmlAfter +
										'</td></tr>';
					}	
				}
			});

			if (bShowSort)
			{
				aHTML[++h] = '<tr><td colspan=2 style="color:#B8B8B8;padding:4px;background-color:#F8F8F8;">Sort by</td>' +
							 '<td colspan=2 style="color:#B8B8B8;padding:4px;background-color:#F8F8F8;" class="interfacemainSelect">' +
							 '<input onDemandType="SELECT" id="inputInterfaceReportSort" class="inputInterfaceMainSelect"' + 
							 'data-getSelectOptions="gaAllParameterList"></td></tr>';
			}
			
			aHTML[++h] = '</table>';			
			
			$('#divInterfaceMainReportSearch').html(aHTML.join(''))
			
			$('#spanInterfaceReportSearch').button(
			{
				label: "Search"
			})
			.click(function() 
			{
				interfaceReportSearch(aParam);
			});	
			
			$('td.interfaceMainReportComparison').click(function(event)
			{
				var sID = event.target.id
				interfaceReportComparisonShow({xhtmlElementID: sID})
			});
			
			$('td.interfaceMainReportComparison').mouseenter(function(event)
			{
				if ($(this).text() == '')
				{
					$(this).text('Click to set comparison.');
					$(this).css('color', 'grey');
				}
				
			});
			
			$('td.interfaceMainReportComparison').mouseleave(function(event)
			{
				if ($(this).text() == 'Click to set comparison.')
				{
					$(this).text('');
					$(this).css('color', '');
				}	
			});
			
		}
		else
		{
			alert('Missing report configuration.');
		}
	}	
}


function interfaceReportComparisonShow(aParam)
{ 
	var sXHTMLElementID;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}	
	
	if (sXHTMLElementID != undefined)
	{
		var aID = sXHTMLElementID.split('-');
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceReportComparison" class="interfaceSearchMedium">';
		aHTML[++h] = (advancedSearchComparisonGet({dataType: aID[2], returnFormat: 'xhtml'})).join('');
		aHTML[++h] = '</table>';		
		
		interfaceMasterOptionsPosition({xhtmlElementID: sXHTMLElementID})		
		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''))	
		
		$('td.interfaceMainReportComparisonType').click(function(event)
		{
			var sID = event.target.id;
			var sDataType = $('#' + sID).attr('data-dataType');
			var sInputType = $('#' + sID).attr('data-inputType');
			
			var sHTML = $('#' + sID).html();
			if (sHTML == 'None') 
			{	sHTML = ''
				if ($('td.interfaceMultiple').length > 0)
				{
					$('tr.interfaceMultiple').hide();
				}
			};
			
			$('#' + sXHTMLElementID).html(sHTML);
			$('#' + sXHTMLElementID).attr('data-code', $('#' + sID).attr('data-code'));
			//$('#' + sXHTMLElementID).attr('data-dataType', sDataType);
			//$('#' + sXHTMLElementID).attr('data-inputType', sInputType);
			$('#' + sXHTMLElementID).attr('data-inputCount', $('#' + sID).attr('data-inputcount'));
			
			$('#divInterfaceMasterViewportControlOptions').hide();
			
			var sXHTMLElementInputID  = sXHTMLElementID.replace('_comparison', '_input');
			var iInputCount = $('#' + sID).attr('data-inputCount');
			var sSearchEndpoint = $('#' + sXHTMLElementID).attr('data-searchEndpoint');
			var sSearchMethod = $('#' + sXHTMLElementID).attr('data-searchMethod');
			var sInputType = $('#' + sXHTMLElementID).attr('data-inputType');
			var sSelectClass = $('#' + sXHTMLElementID).attr('data-selectClass');
			var sOnDemandColumns = $('#' + sXHTMLElementID).attr('data-onDemandColumns');
			var sOnDemandGroupFilter = $('#' + sXHTMLElementID).attr('data-onDemandGroupFilter');
			var sOnDemandGroupType = $('#' + sXHTMLElementID).attr('data-onDemandGroupType');
			var sOnDemandClick = $('#' + sXHTMLElementID).attr('data-onDemandClick');
			var sSearchRelatedField = $('#' + sXHTMLElementID).attr('data-searchrelatedfield');
				
			interfaceReportSetInput(
			{
				xhtmlElementID: sXHTMLElementInputID, 
				dataType: sDataType,
				inputType: sInputType,
				inputCount: iInputCount,
				searchEndpoint: sSearchEndpoint,
				searchMethod: sSearchMethod,
				selectClass: sSelectClass,
				onDemandColumns: sOnDemandColumns,
				onDemandGroupFilter: sOnDemandGroupFilter,
				onDemandGroupType: sOnDemandGroupType,
				comparisonID: sID,
				onDemandClick: sOnDemandClick,
				searchrelatedfield: sSearchRelatedField
			});
			
		});
		
	}
}

function interfaceReportSetInput(aParam)
{ 
	var sXHTMLElementID;
	var sDataType;
	var sInputType;
	var aHTML = [];
	var h = -1;
	var iInputCount = 0;
	var sSearchEndpoint;
	var sSearchMethod;
	var sSelectClass;
	var sOnDemandColumns;
	var sOnDemandGroupFilter;
	var sOnDemandGroupType;
	var sFirstInputElementId;
	var sComparisonID;
	var sOnDemandClick;
	var sSearchRelatedField;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.dataType != undefined) {sDataType = aParam.dataType}
		if (aParam.inputType != undefined) {sInputType = aParam.inputType}
		if (aParam.inputCount != undefined) {iInputCount = aParam.inputCount}
		if (aParam.searchEndpoint != undefined) {sSearchEndpoint = aParam.searchEndpoint}
		if (aParam.searchMethod != undefined) {sSearchMethod = aParam.searchMethod}
		if (aParam.selectClass != undefined) {sSelectClass = aParam.selectClass}
		if (aParam.onDemandColumns != undefined) {sOnDemandColumns = aParam.onDemandColumns}		
		if (aParam.onDemandGroupFilter != undefined) {sOnDemandGroupFilter = aParam.onDemandGroupFilter}		
		if (aParam.onDemandGroupType != undefined) {sOnDemandGroupType = aParam.onDemandGroupType}		
		if (aParam.comparisonID != undefined) {sComparisonID = aParam.comparisonID}		
		if (aParam.onDemandClick != undefined) {sOnDemandClick = aParam.onDemandClick}		
		if (aParam.searchmethod != undefined) {sSearchMethod = aParam.searchmethod}		
		if (aParam.searchendpoint != undefined) {sSearchEndPoint = aParam.searchendpoint}		
		if (aParam.searchrelatedfield != undefined) {sSearchRelatedField = aParam.searchrelatedfield}		
	}	
		
	if (sXHTMLElementID != undefined)
	{
		if (iInputCount == 0) 
		{
			$('#' + sXHTMLElementID).html('');
		}
		else
		{	
			var sXHTMLInputElementID = sXHTMLElementID.replace('td', 'input');
		
			for (var i = 1; i <= iInputCount; i++) 
			{	
		
				if (i > 1) 
				{
					aHTML[++h] = '<br />';
				}
				
				var sThisElementId = sXHTMLInputElementID;
				if (sInputType == 'textbox' || sInputType == 'textarea')
				{
					sThisElementId = sThisElementId.replace(/-/g, '_');
					sThisElementId = sThisElementId + '_' + i
					if (i == 1)	{	sFirstInputElementId = sThisElementId;}
					
					if (sDataType == 'text' || sDataType == 'numeric')
					{
						aHTML[++h] = '<input id="' + sThisElementId +  '" class="inputInterfaceMainText">';
					}	
					
					if (sDataType == 'date')
					{
						aHTML[++h] = '<input id="' + sThisElementId + '" class="inputInterfaceMainDate">';
					}	
				}
				
				if (sInputType == 'select')
				{
					if (sSearchEndpoint != undefined && sSearchMethod != undefined)
					{
						if (sSearchEndpoint == "") 	{sSearchEndpoint = sSearchMethod.substr(0, sSearchMethod.indexOf("_")) }
						sThisElementId = sThisElementId.replace(/-/g, '_');
						sThisElementId = sThisElementId + '_' + i
						if (false && sComparisonID.indexOf("IN_LIST") >= 0)
						{	aHTML[++h] = '<select multiple="multiple" '; }
						else
						{	aHTML[++h] = '<input '; }
						
						aHTML[++h] = 'id="' + sThisElementId + '"';
						aHTML[++h] = ' onDemandMethod="/ondemand/' + sSearchEndpoint + '/?method=' + sSearchMethod + '" ' +
									'class="' ;
						if (sSelectClass != undefined)
						{	aHTML[++h] = sSelectClass;	}
						else
						{	aHTML[++h] = 'inputInterfaceMainSelect'}
						
						if (sComparisonID.indexOf("IN_LIST") >= 0)
						{
							aHTML[++h] = ' inputInterfaceMainMultiSelect';
						}
						aHTML[++h] = '"';
						
						if (sOnDemandColumns != undefined)
						{	aHTML[++h] = ' onDemandColumns="' + sOnDemandColumns + '"'	}
						
						if (sOnDemandGroupFilter != undefined)
						{	aHTML[++h] = ' onDemandGroupFilter="' + sOnDemandGroupFilter + '"'	}
						
						if (sOnDemandGroupType != undefined)
						{	aHTML[++h] = ' onDemandGroupType="' + sOnDemandGroupType + '"'	}
						
						if (sOnDemandClick != undefined)
						{	aHTML[++h] = ' onDemandClick="' + sOnDemandClick + '"'	}
						
						aHTML[++h] = '>';
						if (false && sComparisonID.indexOf("IN_LIST") >= 0)
						{
							aHTML[++h] = '</select>';
						}
					}
					else
					{
						aHTML[++h] = 'Report configuration error! Please contact Support.<br />No searchEndpoint and/or searchMethod defined.'
					}	
				}	
			}
			
			$('#' + sXHTMLElementID).html(aHTML.join(''));
			$('input.inputInterfaceMainDate').datepicker({ dateFormat: 'dd M yy', changeYear: true });
			$('#' + sFirstInputElementId).focus();
			
		}	
	}	
}

function interfaceReportSearch(aParam, oResponse)
{ 
	var sXHTMLElementID;
	var aHTML = [];
	var h = -1;
	var sReturnFormat = 'json';
	var iRows = ns1blankspace.option.defaultRows;
	var sParameterList
	var oSearchParameters;
	var sExtraIDColumnBefore = '';
	var sExtraIDColumnHeader = '';
	var aSelectableParameters;
	var aFixedParameters;
	var sIDColumn;
	var bContainsContactPerson = false;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.returnFormat != undefined) {sReturnFormat = aParam.returnFormat}
		if (aParam.rows != undefined) {iRows = aParam.rows}
		if (aParam.parameterList != undefined) {sParameterList = aParam.parameterList}
		if (aParam.searchParameters != undefined) {oSearchParameters = aParam.searchParameters}
		if (aParam.extraIDColumnBefore != undefined) {sExtraIDColumnBefore = aParam.extraIDColumnBefore}
		if (aParam.extraIDColumnHeader != undefined) {sExtraIDColumnHeader = aParam.extraIDColumnHeader}
		if (aParam.idColumn != undefined) {sIDColumn = aParam.idColumn}
		if (aParam.containsContactPerson != undefined) {bContainsContactPerson = aParam.containsContactPerson }
		if (aParam.searchParameters == undefined)
		{
			if (aParam.fixedParameters != undefined) {oSearchParameters = aParam.fixedParameters}
		}	
	}	
	
	if (bContainsContactPerson)
	{
		$('#spanReportHeaderSend').show();
	}
	
	if (oResponse == undefined)
	{
		var aParameterList = [];
		
		if ($("input.interfaceMainReportInclude:checked").length == 0 && oSearchParameters == undefined)
		{
			alert('You need to pick at least one column.');
		}
		else
		{
		
			$('#divInterfaceMainReportSearch').hide();
			$('#spanReportHeaderSearch').removeClass('Highlight')
			
			$('#divInterfaceMainReportResults').show();
			$('#divInterfaceMainReportResults').html(ns1blankspace.xhtml.loading);
			$('#spanReportHeaderResults').addClass('Highlight')
		
			$('#spanReportHeaderSearch').css('cursor', 'pointer');
			$('#spanReportHeaderResults').css('cursor', 'auto');
		
			var oSearch = new AdvancedSearch();
		
			var aFields = [];
			
			if (oSearchParameters != undefined)
			{
				if (oSearchParameters.fields != undefined)
				{
					$.each(oSearchParameters.fields, function()
					{
						aFields.push(this.name);	
					});
				}	
			}
			
			$("input.interfaceMainReportInclude:checked").each(function() 
			{ 
				var sID = this.id;
				var aID = sID.split('-');
				var sName = (aID[1]).replace(/_/g, '.');
				
				aParameterList.push(sName);
				aFields.push(sName);
				if (!bContainsContactPerson &&
				    (sName.toLowerCase().substr(sName.length - 13, 13) == "contactperson" ||
					 sName.toLowerCase().substr(sName.length - 17, 17) == "contactpersontext" ||
					 sName.toLowerCase().indexOf(".contactperson.") != -1  ||
					 gsReportMethod.toUpperCase() == "CONTACT_PERSON_SEARCH")
					)
				{	bContainsContactPerson = true;	}
				
			});	
			
			if (sIDColumn != undefined && $.inArray(sIDColumn, aFields) == -1)
			{
				aFields.push(sIDColumn);
			}
			
			aParam.parameterList = aFields.join(',');
			oSearch.addField(aFields.join(','));
			oSearch.endPoint = gsReportEndpoint;
			oSearch.method = gsReportMethod;
			
			var aFilters = [];
			
			if (oSearchParameters != undefined)
			{
				$.each(oSearchParameters.filters, function()
				{
					var bInclude = true;
					if (this.includeEval != undefined)
					{
						if (!eval(this.includeEval))
						{	bInclude = false;	}
					}
					
					if (bInclude)
					{	aFilters.push(this);	}
				});
			}
			
			$('td.interfaceMainReportComparison[data-code]').each(function() 
			{ 
				var sID = this.id
				var aID = sID.split('-')
				
				var sInputID  = sID.replace('_comparison', '_input');
				sInputID  = sInputID.replace('td', 'input');
				sInputID = sInputID.replace(/-/g, '_');
				
				var sName = aID[1].replace('_', '.');
				var sComparison = $(this).attr('data-code');
				
				if (sComparison != '')
				{
					var sInputType = $('#' + sID).attr('data-inputType');
					var sSearchRelatedField = $('#' + sID).attr('data-searchRelatedField');
					var aValues = ["","",""];
					
					if ( sInputType != "select" || 
					    (sInputType == "select" && sComparison.indexOf("IN_LIST") < 0) ||
					    (sInputType == "select" && sComparison.indexOf("IN_LIST") >= 0 && $('td.interfaceMultiple').length == 0)
					   ) 
					{
						for (var i = 0; i < $('#' + sID).attr('data-inputCount'); i++)
						{
							var sThisInputID = sInputID + '_' + (i + 1);
							var sValue = '';
							if (sInputType == 'select')
							{
								if ($('#' + sThisInputID).attr('ondemandid') == undefined)
								{	// User has typed something so compare the text field
									sValue = $('#' + sThisInputID).val();
								}
								else	// User has selected an id - search on the id
								{	
									sValue = $('#' + sThisInputID).attr('ondemandid'); 
									sName = sSearchRelatedField.replace('_', '.');	
								}
							}
							else
							{
								sValue = $('#' + sThisInputID).val();
							}
							
							aValues[i] = sValue;
						}
					}
					else	// IN_LIST processing
					{
						var aValueList = [];
						
						$('td.interfaceMultiple').each(function()
						{
							var sElementId = this.id;
							var aSearch = sElementId.split("-");
							aValueList.push(aSearch[aSearch.length - 1]);
						});
						
						if (aValueList.length == 0)
						{
							alert("You must choose at least one value.");
							return false;
						}
						else
						{	aValues[0] = aValueList.join(",");	}
						sName = sSearchRelatedField.replace('_', '.');	
					}
					
					aFilters.push(
					{
						name: sName,
						comparison: sComparison,
						value1: aValues[0],
						value2: aValues[1],
						value3: aValues[2]
					});
				}	
			});	
			
			$.each(aFilters, function()
			{
				if (this.bracketBefore != undefined)
				{	oSearch.addBracket(this.bracketBefore);	}
				if (this.operatorBefore != undefined)
				{	oSearch.addOperator(this.operatorBefore) }
				
				oSearch.addFilter( this.name, this.comparison, this.value1, this.value2, this.value3);
				
				if (this.bracketAfter != undefined)
				{	oSearch.addBracket(this.bracketAfter);	}
				if (this.operatorAfter != undefined)
				{	oSearch.addOperator(this.operatorAfter) }
			});
			
			if ($('#inputInterfaceReportSort').val() != undefined)
			{
				if ($('#inputInterfaceReportSort').attr('OnDemandID') != undefined)
				{	
					//var aAllParameters = interfaceReportGetAllParameterList();
					oSearch.sort(gaAllParameterList[$('#inputInterfaceReportSort').attr('OnDemandID')].name, 'asc');
				}
			}
			
			aParam.containsContactPerson = bContainsContactPerson;
			
			oSearch.addSummaryField("count(*) " + gsReportEndpoint);
			oSearch.rows = iRows;
			oSearch.rf = sReturnFormat;
			oSearch.getResults(function(data){interfaceReportSearch(aParam, data)}) ;	
		}	
			
	}
	else
	{
	
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table class="interfaceMain"">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">Nothing to show.</td></tr>' ;

			$('#divInterfaceMainReportResults').html(aHTML.join(''));
		}
		else
		{
			aHTML[++h] = '<table class="interfaceMain"">';
			aHTML[++h] = '<tbody>'
			var aColumns = [];
			aParameter = sParameterList.split(',');
			
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			
			$.each(aParameter, function()
			{
				if (this == sExtraIDColumnBefore)
				{
					aHTML[++h] = '<td class="interfaceMainCaption">' + sExtraIDColumnHeader + '</td>';
				}
				
				var sName = this;
				var sCaption;
				if (goSelectableParameters != undefined && goSelectableParameters.fields != undefined)
				{
					$.each(goSelectableParameters.fields, function()
					{
						if (this.name == sName && this.caption != undefined)
						{	sCaption = this.caption;	
							return false;
						}
						else
						{	return true;	}
					});
				}
				
				if (oSearchParameters != undefined && oSearchParameters.fields != undefined)
				{
					$.each(oSearchParameters.fields, function()
					{
						if (this.name == sName && this.caption != undefined)
						{	sCaption = this.caption;	
							return false;
						}
						else
						{	return true;	}
					});
				}
				
				{	sCaption = interfaceReportDictionaryGet({name: this})	}
				
				if (sName != sIDColumn)
				{	aHTML[++h] = '<td class="interfaceMainCaption">' + sCaption + '</td>';	}
				
				aColumns.push({name: sName, caption: sCaption});
				
			});
			
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>'

			$.each(oResponse.data.rows, function(index) 
			{ 
				aHTML[++h] = interfaceReportSearchRow(this, aParam);
			});
			gaReportRowParam = aParam;
			
			aHTML[++h] = '</tbody></table>';
			
			interfaceMasterPaginationList(
			   {
				xhtmlElementID: 'divInterfaceMainReportResults',
				xhtmlContext: '',
				xhtml: aHTML.join(''),
				showMore: ($(oResponse).attr('morerows') == "true"),
				columns: aParameter.join('-'),
				more: $(oResponse).attr('moreid'),
				rows: ns1blankspace.option.defaultRows,
				functionShowRow: interfaceReportSearchRow,
				functionSearch: gfReportSearchFunction,
				functionOpen: gsReportScriptOpen,
				functionNewPage: gsReportScriptNewPage,
				type: 'json'
			   }); 	
				
			$('.interfaceMainRowOptionsSelect' + '').unbind('click');
				
			if (gsReportScriptOpen != undefined)
			{
				$('.interfaceMainRowOptionsSelect' + '').button({
					text: false,
					icons: {
						primary: "ui-icon-play"
					}
				})
				.click(function() {
					eval(gsReportScriptOpen);
				})
				.css('width', '15px')
				.css('height', '20px')
			}
			
			eval(gsReportScriptNewPage);
			
			$('#spanInterfaceReportExport').button(
			{
				label: "Export (csv)"
			})
			.click(function() 
			{
				interfaceReportExportToCSV({moreId: $(oResponse).attr('moreid'),
											count: eval('oResponse.summary.' + gsReportEndpoint)
											});
			});	

			//functionSearch: interfaceMasterActions,	
			//functionOpen: 'interfaceActionMasterViewport({showHome: false});interfaceActionSearch(this.id)',
			//functionNewPage: 'interfaceMasterAttachmentsShowBind()'	
			//interfaceMasterAttachmentsShowBind();	
			
			if (bContainsContactPerson)
			{	// Show editor and template fields, buttons for preview & Sending
				interfaceMasterTinyMCEInit();
				for (edId in tinyMCE.editors) 
					tinyMCE.editors[edId].destroy(true);
				
				ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;
				$('#divInterfaceMainReportSend').attr('onDemandLoading', '');
				
				aHTML = [];
				h = -1;
				aHTML[++h] = '<table id="tableInterfaceMainReportSend" class="interfaceMain">';
				aHTML[++h] = '<tr id="trInterfaceMainReportSendRow1" class="interfaceMain">' +
								'<td id="tdInterfaceMainReportSendColumn1" class="interfaceMain">' +
								'</td>' +
								'<td id="tdInterfaceMainReportSendColumn2" class="interfaceMain">' +
								'</td>' +
								'</tr>';
				aHTML[++h] = '</table>';					
				
				$('#divInterfaceMainReportSend').html(aHTML.join(''));
				
				var aHTML = [];
				var h = -1;
				var oMCEBookmark;
			
				aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
				aHTML[++h] = '<tr id="trInterfaceMainDetailsReportDetails">';	
				aHTML[++h] = '<td id="tdInterfaceMainDetailsReportSendDetail">';			
				
				aHTML[++h] = '<table id="tdInterfaceMainReportDetail" class="interfaceMain">';
				aHTML[++h] = '<tr id="trInterfaceMainDetailsReportSendSubject" class="interfaceMain">';	
				aHTML[++h] = '<td id="tdInterfaceMainDetailsReportSendSubject" class="interfaceMain">' +
						'Subject' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsReportSendSubject" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsReportSendSubject" class="interfaceMainTextMulti">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsReportSendSubject"  class="inputInterfaceMainText">' +
						'</td></tr>';
						
				aHTML[++h] = '<tr id="trInterfaceMainDetailsReportSendText">';	
				aHTML[++h] = '<td id="tdInterfaceMainReportSendTextValue" class="interfaceMainTextMulti" width="550px">' +
								'<div rows="550" cols="400" onDemandType="TEXTMULTI" id="inputInterfaceMainReportSendText' +
									ns1blankspace.counter.editor + '" editorcount="' + ns1blankspace.counter.editor + '" class="inputInterfaceMainTextMulti"></textarea>' +
								'</td>';
				aHTML[++h] = '</td></tr></table>';					
				aHTML[++h] = '</td>';					
								
				aHTML[++h] = '<td id="tdInterfaceMainReportSendEmail" class="interfaceMain">';

				aHTML[++h] = '<table id="tdInterfaceMainReportOptions" class="interfaceMain">';
				aHTML[++h] = '<tr><td id="tdInterfacemainReportSendButtons" class="interfaceMain" style="text-align:right;">' +
							'<span id="spanInterfaceMainReportSendPreview">Preview</span>&nbsp;' +
							'<span id="spanInterfaceMainReportSendEmail">Email</span>' +
							'</td></tr>';		
				aHTML[++h] = '<tr><td>&nbsp;</td></tr>';
				
				aHTML[++h] = '<tr><td id="tdInterfaceManReportSendInstructions" class="interfaceMain" style="text-align:right;">' +
							'Click to insert fields..' +
							'</td></tr>';		
				aHTML[++h] = '<tr><td id="tdInterfaceMainReportMergeFields" class="interfaceMain" style="text-align:right;" colspan="2">';
				$.each(aColumns, function()
				{
					aHTML[++h] = '<span id="spanInterfaceMainReportColumn_' + this.name.replace(/\./g,'-') + '" ' +
								   'class="interfaceReportColumnSelect interfaceCalculated" ' +
								   'title="' + this.caption.replace(/ /g,'~') + '" style="cursor: pointer;">' + this.caption + '</span>' +
								'<br />';		
				});
						
				aHTML[++h] = '</td></tr></table>';					
				aHTML[++h] = '</td></tr></table>';					
				
				$('#tdInterfaceMainReportSendColumn1').html(aHTML.join(''));

				
				$('#spanInterfaceMainReportSendPreview').button({
					text: false,
					icons: {
						primary: "ui-icon-document"}
				})
				.click(function()
				{
					//var sText = interfaceReportReplaceMailMerge();
					var sText = interfaceReportReplaceMergeFields({columns: aColumns, 
																   replace: tinyMCE.get(('inputInterfaceMainReportSendText' + ns1blankspace.counter.editor)).getContent()});
					var iObject;
					if (aParam.method != undefined)
					{
						var aMethod = aParam.method.split('_');
						var sEndPoint = aMethod[0];
						if (sEndPoint == "CONTACT")
						{
							if (aMethod[1] == 'BUSINESS')
							{	iObject = ns1blankspace.data.object.contactbusiness;	}
							else if (aMethod[1] == "PERSON")
							{	iObject = ns1blankspace.data.object.contactperson;	}
						}
						else if (sEndPoint == 'AUDIT')
						{	
							if (aMethod[1] == "ITEM")
							{	iObject = ns1blankspace.objectAuditItemType;	}
							else
							{	iObject = ns1blankspace.objectAudit;	}
						}
						else if (sEndPoint == 'OPPORTUNITY')
						{	iObject = ns1blankspace.data.object.opportunity;	}
						else if (sEndPoint == "ISSUE")
						{	iObject = ns1blankspace.objectIssue;	}
						else
						{	
							alert('Report Error. Object cannot be determined.');
							return false;
						}
					}
					
					var aReportParam = {row: oResponse.data.rows[0],
										moreID: oResponse.moreid,
										parameters: aParameter,
										object: iObject,
										text: sText
									   }
					interfaceReportSendPreview(aReportParam);
				})
				.css('width', '30px')
				.css('height', '30px');
			
				$('#spanInterfaceMainReportSendEmail').button({
					text: false,
					icons: {
						primary: "ui-icon-mail-closed"}
				})
				.click(function()
				{
					var sText = interfaceReportReplaceMergeFields({columns: aColumns, 
																   replace: tinyMCE.get(('inputInterfaceMainReportSendText' + ns1blankspace.counter.editor)).getContent()});
					var sSubject = interfaceReportReplaceMergeFields({columns: aColumns, 
																   replace: $('#inputInterfaceMainDetailsReportSendSubject').val()});
					interfaceReportSendEmail({moreID: oResponse.moreid,
											  parameters: aParameter,
											  text: sText,
											  subject: sSubject
											  });
				})
				.css('width', '30px')
				.css('height', '30px');
				
				
				$('.interfaceReportColumnSelect')
				.hover( function()
				{	
					oMCEBookmark = tinyMCE.get('inputInterfaceMainReportSendText' + ns1blankspace.counter.editor).selection.getBookmark({type: 1, normalized: true});
				})
				.click( function()
				{
					interfaceMasterMCEAddElement({xhtmlElementId: this.id,
												  editorId: 'inputInterfaceMainReportSendText' + ns1blankspace.counter.editor, 
												  mceBookmark: oMCEBookmark})
				})
				
				tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainReportSendText' + ns1blankspace.counter.editor);
				
				//var sParam = 'method=DOCUMENT_GET_DOCUMENT&noformat=1&select=' + iDocument;

			}
		}
	}	
}

function interfaceReportReplaceMergeFields(aParam)
{
	var sText = "";
	var aColumns = [];
	
	if (aParam != undefined)
	{
		if (aParam.columns != undefined) {aColumns = aParam.columns;}
		if (aParam.replace != undefined) {sText = aParam.replace;}
	}
	
	$.each(aColumns, function()
	{
		while (sText.indexOf("[[" + this.caption + "]]") >= 0)
		{	sText = sText.replace("[[" + this.caption + "]]", "[[" + this.name + "]]")	}
	});
	
	return sText;
}

function interfaceReportSearchRow(oResponse, aParam)
{
	var aHTML = [];
	var h = -1;
	var oFixedParameters = goFixedParameters;
	var aFixedName = [];
	var	aFixedValue = [];
	var i;
	var sExtraIDColumnBefore;
	var sExtraIDColumnValue;
	var bExport = false;
	var sOutput = '';
	var sParameterList = '';
	var aParameters = [];

	if (aParam == undefined) {aParam = gaReportRowParam }
	
	
	if (aParam != undefined)
	{
		if (aParam.fixedParameters != undefined) {oFixedParameters = aParam.fixedParameters}
		if (aParam.extraIDColumnBefore != undefined) {sExtraIDColumnBefore = aParam.extraIDColumnBefore}
		if (aParam.extraIDColumnValue != undefined) {sExtraIDColumnValue = aParam.extraIDColumnValue}
		if (aParam.parameterList != undefined) {sParameterList = aParam.parameterList}
	}	
	
	if (oFixedParameters.fields != undefined)
	{
		$.each(oFixedParameters.fields, function() 
		{ 
			if (this.value != undefined) 
			{
				aFixedName.push(this.name)
				aFixedValue.push(this.value)
			}	
		});	
	}
	
	if (sParameterList != '')
	{	aParameters = sParameterList.split(',');	}
	
	aHTML[++h] = '<tr class="interfaceMainRow">';

	var sLastExtraID = '';
	sIDColumn = "id";
	if (aParam != undefined) 
	{	if (aParam.idColumn != undefined) {sIDColumn = aParam.idColumn}	}
	var aLastHTML = [];
	
	$.each(aParameters, function()
	{
		
		var sValue = eval('oResponse["' + this + '"]');
		var sKey = this;
		
		if (sKey != sIDColumn)
		{
			aHTML[++h] = '<td class="interfaceMainRow ' + sKey.replace(/\./g,'_') + '" ' + 
							 'id="' + sValue + '">' + 
						  sValue + '</td>';
			sOutput += '"' + sValue + '",';
		}
		else
		{
			if (sKey == sIDColumn)
			{	
				aLastHTML.push('<td class="interfaceMainRowOptionsSelect id" ' +
							 'id="id-' + sValue + '"' +
							 'data-extraid="' + sLastExtraID + '"></td>');
			}
		}
	});
	aHTML[++h] = aLastHTML.join('');
	aHTML[++h] = '</tr>'; 
	
	if (bExport)
	{	return sOutput.substr(0, sOutput.length - 1) + '%0D%0A';	}
	else
	{	return aHTML.join('');	}
	
}

function interfaceReportNewPage(aParam, oResponse)
{
	var sEndpoint;
	var sMethod;
	var sName;
	var sSourceName;
	var sCompareColumn = 'id';
	var oMoreFilters;
	var sIDColumn = 'id';
	
	if (aParam != undefined)
	{
		if (aParam.endpoint != undefined) {sEndpoint = aParam.endpoint}	
		if (aParam.method != undefined) {sMethod = aParam.method}	
		if (aParam.name != undefined) {sName = aParam.name}	
		if (aParam.sourceName != undefined) {sSourceName = aParam.sourceName}	
		if (aParam.compareColumn != undefined) {sCompareColumn = aParam.compareColumn}	
		if (aParam.moreFilters != undefined) {oMoreFilters = aParam.moreFilters}
		if (aParam.idColumn != undefined) {sIDColumn = aParam.idColumn}
	}
	
	if (oResponse == undefined)
	{
	
		if (sEndpoint == undefined && sMethod != undefined)
		{
			var aMethod = sMethod.split('_');
			sEndpoint = (aMethod[0]).toLowerCase();
		}
		if (sSourceName == "extraID")
		{
			var aID = '';
			$('td.id:visible').each(function()
			{
				aID = ($(this).attr('id')).split('-');
				$('#' + $(this).attr('data-extraid')).attr('id', aID[1]);
			});	
		}
		
		var aSourceIDs = [];
		
		$('td.' + (sSourceName).replace(/\./g,'_') + ':visible').each(function()
		{
			if ($.inArray($(this).attr('id'),aSourceIDs >= 0))
			{	aSourceIDs.push($(this).attr('id'))	}
		});
		
		var sFields = sName;
		if 	(sCompareColumn != sIDColumn)
		{	sFields += ',' + sCompareColumn;	}
		
		var oAdvancedSearch = new AdvancedSearch();
		oAdvancedSearch.endPoint = sEndpoint;
		oAdvancedSearch.method = sMethod;
		oAdvancedSearch.addField(sFields);
		oAdvancedSearch.async = false;
		oAdvancedSearch.addFilter( sCompareColumn, 'IN_LIST', aSourceIDs.join(','));
		if (oMoreFilters != undefined)
		{
			$.each(oMoreFilters.filters, function()
			{
				if (this.bracketBefore != undefined)
				{	oAdvancedSearch.addBracket(this.bracketBefore);	}
				if (this.operatorBefore != undefined)
				{	oAdvancedSearch.addOperator(this.operatorBefore) }
				
				oAdvancedSearch.addFilter( this.name, this.comparison, this.value1, this.value2);
				
				if (this.bracketAfter != undefined)
				{	oAdvancedSearch.addBracket(this.bracketAfter);	}
				if (this.operatorAfter != undefined)
				{	oAdvancedSearch.addOperator(this.operatorAfter) }
			});
		}
		
		if (sCompareColumn != sIDColumn)
		{	
			oAdvancedSearch.sort(sCompareColumn, 'asc');	
			oAdvancedSearch.rows = 200;
		}

		oAdvancedSearch.rf = 'JSON';

		oAdvancedSearch.getResults(function(data) {interfaceReportNewPage(aParam, data)}) 	
	}
	else
	{
		var sLastPrimaryId = '';
		var sLastId = '';
		var sHTML = '';
		$.each(oResponse.data.rows, function(index) 
		{ 
			if (sCompareColumn != sIDColumn)
			{
				if (sLastPrimaryId == $(this).attr(sCompareColumn))
				{
					sHTML = $('td.' + (sSourceName).replace(/\./g,'_') + '[id=' + sLastPrimaryId + ']').html();
					$('td.' + (sSourceName).replace(/\./g,'_') + '[id=' + sLastPrimaryId + ']').html(sHTML + '<br />' + $(this).attr(sName));
				}
				else
				{
					$('td.' + (sSourceName).replace(/\./g,'_') + '[id=' + $(this).attr(sCompareColumn) + ']').html($(this).attr(sName));
				}
				sLastPrimaryId = $(this).attr(sCompareColumn);
				sLastId = this.id;
			}
			else
			{
				$('td.' + (sSourceName).replace(/\./g,'_') + '[id=' + $(this).attr(sCompareColumn) + ']').html($(this).attr(sName));
			}
		});
			
	}
	

}

function interfaceReportFieldIsIncluded(sFieldList)
{
	var aFields = sFieldList.split('-');
	var bIncluded = false;
	
	$.each(aFields, function()
	{
		var sField = this.replace(/\./g,'_');
		if ($('#checkInterfaceMainReport_include-' + sField).attr('checked'))
		{
			bIncluded = true;
			return false;
		}
		else
		{	return true;	}
	});
	
	return bIncluded;
}

function interfaceReportAddSearchFilter(aParam)
{

	var sValue = $('#' + ns1blankspace.xhtml.divID).val();
	var sName;
	var sParameter = '';
	var sAttribute = '';
	var sSearchMethod = '';
	
	if (aParam != undefined)
	{
		if (aParam.name != undefined) {sName = aParam.name}
		if (aParam.parameter != undefined) {sParameter = aParam.parameter}
		if (aParam.attribute != undefined) {sAttribute = aParam.attribute}
	}
	
	if (sName != undefined)
	{
		sName = sName.replace(/\./g,'_');
		sSearchMethod = $("#tdInterfaceMainReport_comparison-" + sName + '-text').attr('data-searchMethod');
		if (sAttribute != '')
		{	sValue = $('#' + ns1blankspace.xhtml.divID).attr(sAttribute)	}
		
		$("#tdInterfaceMainReport_comparison-" + sName + '-text').attr('data-searchMethod', sSearchMethod + '&' + sParameter + '=' + sValue);
		
	}
	
}

function interfaceReportExportToCSV(aParam)
{
	var iMoreId;
	
	if (aParam != undefined)
	{
		if (aParam.count != undefined && aParam.count != "0") 
		{
			iMoreId = aParam.moreId;
			var sParam = '&method=CORE_MORE_FILE_MANAGE&more=' + iMoreId;
			$.ajax({
				type: 'POST',
				url: '/ondemand/core/?rf=json' + sParam,
				dataType: 'json',
				success: function(oResponse)
				{
					if (oResponse.link != '')
					{
						var aHTML = [];
						var h = -1;
						aHTML[++h] = '<table class="interfaceMain"">';
						aHTML[++h] = '<tbody>'
						aHTML[++h] = '<tr class="interfaceMainCaption">';
						aHTML[++h] = '<td class="interfaceMainCaption">File created..   ' + aParam.count + ' rows.</td></tr>';
						aHTML[++h] = '<tr class="interfaceMainCaption">';
						aHTML[++h] = '<td class="interfaceMainCaption"><a href="' + oResponse.link;
						aHTML[++h] = '" target="_blank">Click here</a> to download the file.</td></tr>';
						aHTML[++h] = '</tbody></table>';
						$('#divInterfaceMainReportResults').html(aHTML.join(''));
					}
				}
			});
			
		}
	}
	else
	{
		var aHTML = [];
		var h = -1;
		aHTML[++h] = '<table class="interfaceMain"">';
		aHTML[++h] = '<tbody>'
		aHTML[++h] = '<tr class="interfaceMainCaption">';
		aHTML[++h] = '<td class="interfaceMainCaption">No results. File not created.</td></tr>';
		aHTML[++h] = '</tbody></table>';
		$('#divInterfaceMainReportResults').html(aHTML.join(''));
	}
}

function interfaceReportSendPreview(aParam)
{
	var oRow;
	var iMoreId;
	var sText = "";
	var sParam = "";
	var aParameters = [];
	var sTags = "";
	var iObject;
	
	if (aParam != undefined)
	{
		if (aParam.row != undefined) {oRow = aParam.row}
		if (aParam.moreID != undefined) {iMoreId = aParam.moreID}		
		if (aParam.parameters != undefined) {aParameters = aParam.parameters}		
		if (aParam.text != undefined) {sText = aParam.text}		
		if (aParam.object != undefined) {iObject = aParam.object}		
	}
	else
	{
		interfaceMasterConfirm({html: ['Parameters not passed to interfaceReportSendPreview. <br /><br />Preview aborted.'], title: 'System Error!'})
		return false;
	}
	
	if (false && iObject == 32)
	{	sTags = aParameters.join('|');	}
	else
	{
		$.each(aParameters, function()
		{
			sTags = this + "|"  + sTags;
		});
		if (sTags.length > 0)
		{	sTags = sTags.substr(0, sTags.length - 1); 	}
	}
	
	sParam = "&more=" + iMoreId + 
			 "&object=" + iObject + "&objectcontext=" + oRow.id +
			 "&templatetext=" + FormatSave(sText) + 
			 "&tags=" + FormatSave(sTags);

	$.ajax(
	{
		type: 'POST',
		cache: false,
		url: "/ondemand/core/?method=CORE_MORE_APPLY_TEMPLATE",
		data: "rf=text" + sParam,
		dataType: 'text',
		async: false,
		success: function(data)
		{
			if (data.substr(0,12) == "OK|RETURNED|")
			{	
				interfaceMasterConfirm({html: [data.substring(12)], title: "Merged content."});	}
		}
	});
 
}

function interfaceReportSendEmail(aParam)
{
	var iMoreId;
	var sText = "";
	var sParam = "";
	var aParameters = [];
	var sTags = "";
	var sEmail = "";
	var sSubject = "";
	
	if (aParam != undefined)
	{
		if (aParam.moreID != undefined) {iMoreId = aParam.moreID}		
		if (aParam.parameters != undefined) {aParameters = aParam.parameters}		
		if (aParam.text != undefined) {sText = aParam.text}		
		if (aParam.subject != undefined) {sSubject = aParam.subject}		
	}
	else
	{
		interfaceMasterConfirm({html: ['Parameters not passed to interfaceReportSendEmail. <br /><br />Preview aborted.'], title: 'System Error!'})
		return false;
	}
	
	if (confirm("Are you sure you want to send an email to all of the Contacts in the report results?"))
	{
		sTags = aParameters.join('|');
		
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = "contact";
		oSearch.method = "CONTACT_PERSON_SEARCH";
		oSearch.addField("email");
		oSearch.addFilter("id", "EQUAL_TO", gsUserPersonId);
		oSearch.rf = "JSON";
		oSearch.async = false;
		oSearch.getResults(function(data)
		{
			if (data.data.rows.length > 0)
			{	sEmail = data.data.rows[0].email;	}
		});
		
		sParam = "&more=" + iMoreId + 
				 "&title=" + FormatSave(sSubject) +
				 "&status=1" + 
				 "&type=2" +
				 '&scheduletype=9' +
				 "&schedulemaximumcount=1" + 
				 "&responseactionfrom=" + FormatSave(sEmail) + 
				 "&templatetext=" + FormatSave(sText) + 
				 "&caption=" + FormatSave(sTags);

		$.ajax(
		{
			type: 'POST',
			cache: false,
			url: "/ondemand/setup/?method=SETUP_AUTOMATION_MANAGE",
			data: "rf=text" + sParam,
			dataType: 'text',
			async: false,
			success: function(data)
			{
				interfaceMasterConfirm({title: "Bulk Email", html: ["Email(s) sent"]});
			}
		});
	}
	else
	{	return false;	}

}
