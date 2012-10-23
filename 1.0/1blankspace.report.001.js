var gsReportEndpoint;
var gsReportMethod;
var gfReportSearchFunction;
var gsReportScriptOpen;
var gsReportScriptNewPage;
var goFixedParameters;

var gaReportList =
		[ 
			{
				name: "Businesses",
				method: "CONTACT_BUSINESS_SEARCH",
				scriptOpen: 'interfaceContactPersonMasterViewport({showHome: false});interfaceContactPersonSearch(this.id)'
			},
			{
				name: "People",
				method: "CONTACT_PERSON_SEARCH",
				scriptOpen: 'interfaceContactBusinessMasterViewport({showHome: false});interfaceContactSearch(this.id)'
			}
		]		

var gaReportDictionary =
		[ 
			{name: "business.tradename", caption: "Trading Name"},
			{name: "business.legalname", caption: "Company Name"},
			{name: "business.abn", caption: "ABN"},
			{name: "business.webaddress", caption: "Website"},
			{name: "business.phonenumber", caption: "Phone"},
			{name: "business.faxnumber", caption: "Fax"},
			{name: "business.contactsourcetext", caption: "Source of Contact"},
			{name: "business.otherinfo", caption: "Source of Contact Notes"},
			{name: "business.customerstatustext", caption: "Status"},
			{name: "business.industrytext", caption: "Industry"},
			{name: "business.streetaddresscombined", caption: "Street Address"},
			{name: "business.streetaddress1", caption: "Street Address 1"},
			{name: "business.streetaddress2", caption: "Street Address 2"},
			{name: "business.streetsuburb", caption: "Street Suburb"},
			{name: "business.streetstate", caption: "Street State"},
			{name: "business.streetpostcode", caption: "Street Postcode"},
			{name: "business.streetcountry", caption: "Street Country"},
			{name: "business.mailingaddresscombined", caption: "Mailing Address"},
			{name: "business.mailingaddress1", caption: "Mailing Address 1"},
			{name: "business.mailingaddress2", caption: "Mailing Address 2"},
			{name: "business.mailingsuburb", caption: "Mailing Suburb"},
			{name: "business.mailingstate", caption: "Mailing State"},
			{name: "business.mailingpostcode", caption: "Mailing Postcode"},
			{name: "business.mailingcountry", caption: "Mailing Country"},
			{name: "business.notes", caption: "Scope"},
			{name: "business.reference", caption: "Client Number"},
			{name: "business.areatext", caption: "Area"},
			{name: "business.primarycontactpersontext", caption: "Primary Contact"},
			{name: "business.businessgrouptext", caption: "Business Group"},
			{name: "business.businessgroupdescription", caption: "Business Group Description"},
			{name: "person.surname", caption: "Surname"},
			{name: "person.titletext", caption: "Title"},
			{name: "person.gendertext", caption: "Gender"},
			{name: "person.contactbusinesstext", caption: "Client"},
			{name: "person.firstname", caption: "First Name"},
			{name: "person.position", caption: "Position"},
			{name: "person.workphone", caption: "Work Phone"},
			{name: "person.fax", caption: "Fax"},
			{name: "person.mobile", caption: "Mobile"},
			{name: "person.email", caption: "Email"},
			{name: "person.streetaddresscombined", caption: "Street Address"},
			{name: "person.streetaddress1", caption: "Street Address 1"},
			{name: "person.streetaddress2", caption: "Street Address 2"},
			{name: "person.streetsuburb", caption: "Street Suburb"},
			{name: "person.streetstate", caption: "Street State"},
			{name: "person.streetpostcode", caption: "Street Postcode"},
			{name: "person.streetcountry", caption: "Street Country"},
			{name: "person.mailingtitle", caption: "Mailing Name"},
			{name: "person.mailingaddresscombined", caption: "Mailing Address"},
			{name: "person.mailingaddress1", caption: "Mailing Address 1"},
			{name: "person.mailingaddress2", caption: "Mailing Address 2"},
			{name: "person.mailingsuburb", caption: "Mailing Suburb"},
			{name: "person.mailingstate", caption: "Mailing State"},
			{name: "person.mailingpostcode", caption: "Mailing Postcode"},
			{name: "person.mailingcountry", caption: "Mailing Country"},
			{name: "person.customerstatustext", caption: "Status"},
			{name: "person.persongrouptext", caption: "Person Group"},
			{name: "person.primarycontactfor", caption: "Primary Contact For"},
			{name: "issue.reference", caption: "Reference"},
			{name: "issue.title", caption: "Title"},
			{name: "issue.statustext", caption: "Status"},
			{name: "issue.raiseddate", caption: "Raised Date"},
			{name: "issue.target", caption: "Due Date"},
			{name: "issue.completeddate", caption: "Closed Date"},
			{name: "issue.issuetypetext", caption: "Severity"},
			{name: "issue.causedescription", caption: "CAR Description"},
			{name: "issue.otherobjecttext", caption: "Standard"},
			{name: "issue.responsiblecontactpersontext", caption: "Responsible Contact"},
			{name: "issue.objecttitle", caption: "Audit Reference"},
			{name: "opportunity.requestbybusinesstext", caption: "Business"},
			{name: "opportunity.requestbypersontext", caption: "Person"},
			{name: "opportunity.phone", caption: "Phone"},
			{name: "opportunity.mobile", caption: "Mobile"},
			{name: "opportunity.email", caption: "Email"},
			{name: "opportunity.contactstreetaddresscomplete", caption: "Contact Street Address (All)"},
			{name: "opportunity.contactstreetaddresscombined", caption: "Contact Street Address"},
			{name: "opportunity.contactstreetaddress1", caption: "Contact Street Address 1"},
			{name: "opportunity.contactstreetaddress2", caption: "Contact Street Address 2"},
			{name: "opportunity.contactstreetsuburb", caption: "Contact Street Address Suburb"},
			{name: "opportunity.contactstreetstate", caption: "Contact Street Address State"},
			{name: "opportunity.contactstreetpostcode", caption: "Contact Street Address Postcode"},
			{name: "opportunity.contactmailingaddresscomplete", caption: "Contact Mailing Address (All)"},
			{name: "opportunity.contactmailingaddresscombined", caption: "Contact Mailing Address"},
			{name: "opportunity.contactmailingaddress1", caption: "Contact Mailing Address 1"},
			{name: "opportunity.contactmailingaddress2", caption: "Contact Mailing Address 2"},
			{name: "opportunity.contactmailingsuburb", caption: "Contact Mailing Address Suburb"},
			{name: "opportunity.contactmailingstate", caption: "Contact Mailing Address State"},
			{name: "opportunity.contactmailingpostcode", caption: "Contact Mailing Address Postcode"},
			{name: "opportunity.lodgeddate", caption: "Lodged Date"},
			{name: "opportunity.typetext", caption: "Type"},
			{name: "opportunity.managerusertext", caption: "Manager"},
			{name: "opportunity.sourcetext", caption: "Source"},
			{name: "opportunity.sourcenote", caption: "Source Notes"},
			{name: "opportunity.description", caption: "Description"},
			{name: "opportunity.amount", caption: "Amount"},
			{name: "opportunity.statustext", caption: "Status"},
			{name: "opportunity.processingstatustext", caption: "Processing Status"},
			{name: "opportunity.processingdate", caption: "Processing Date"},
			{name: "opportunity.closedate", caption: "Closed Date"},
			{name: "opportunity.actionreference", caption: "Action Reference"},
			{name: "opportunity.actiondate", caption: "Action Date"},
			{name: "opportunity.actionstatustext", caption: "Action Status"},
			{name: "opportunity.areatext", caption: "Area"},
			{name: "opportunity.businessname", caption: "Business Name"},
			{name: "opportunity.firstname", caption: "First Name"},
			{name: "opportunity.surname", caption: "Surname"},
			{name: "opportunity.mailingaddress1", caption: "Mailing Address 1"},
			{name: "opportunity.mailingaddress2", caption: "Mailing Address 2"},
			{name: "opportunity.mailingsuburb", caption: "Mailing Address Suburb"},
			{name: "opportunity.mailingstate", caption: "Mailing State"},
			{name: "opportunity.mailingpostcode", caption: "Mailing  Postcode"},
			{name: "opportunity.mailingcountry", caption: "Mailing Country"}
		];
		
$(function()
{
})

function interfaceReportMasterViewport(aParam)
{
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}

	giObject = 5;
	goObjectContextXML = '';
	gsObjectName = 'Reporting';
	giObjectContext = -1;
	
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
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceReportingSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
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
		interfaceReportSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceReportSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	if (bShowHome) {interfaceReportHomeShow()};	
}

function interfaceReportHomeShow(aParam, oXML)
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

function interfaceReportViewport(aParam, oJSON)
{

	var aHTML = [];
	var h = -1;
	var sCaption;
	var sComparison;
	var sComparisonValue;
	var aDefault = [];
	var sJSONSearch;
	var oSelectableParameters = {};
	var aSelectableParameterList = [];
	var aSelectableParameters = [];
	var oFixedParameters = {};
	var bShowSelect = true;
	var bShowFixedParameters = true;
	var sSummary;
	
	gsReportMethod = undefined;
	gsReportEndpoint = undefined;
	gfReportSearchFunction = undefined;
	gsReportScriptOpen = undefined;
	gsReportScriptNewPage = undefined;
	
	if (aParam != undefined)
	{
		if (aParam.endPoint != undefined) {gsReportEndpoint = aParam.endPoint}
		if (aParam.method != undefined) {gsReportMethod = aParam.method}
		if (aParam.jsonSearch != undefined) {sJSONSearch = aParam.jsonSearch}
		if (aParam.functionSearch != undefined) {gfReportSearchFunction = aParam.functionSearch}
		if (aParam.scriptOpen != undefined) {gsReportScriptOpen = aParam.scriptOpen}
		if (aParam.scriptNewPage != undefined) {gsReportScriptNewPage = aParam.scriptNewPage}
		if (aParam.selectableParameters != undefined) {oSelectableParameters = aParam.selectableParameters}
		if (aParam.fixedParameters != undefined) {oFixedParameters = aParam.fixedParameters}
		if (aParam.showSelect != undefined) {bShowSelect = aParam.showSelect}
		if (aParam.showFixedParameters != undefined) {bShowFixedParameters = aParam.showFixedParameters}
		if (aParam.summary != undefined) {sSummary = aParam.summary}
	}
	
	if (gsReportEndpoint == undefined && gsReportMethod != undefined)
	{
		var aMethod = gsReportMethod.split('_');
		gsReportEndpoint = (aMethod[0]).toLowerCase();
	}
	
	goFixedParameters = oFixedParameters;
	
	if (!bShowSelect)
	{
		aHTML[++h] = '<div id="divInterfaceMainReportHeader"></div>';
		aHTML[++h] = '<div style="display:none;" id="divInterfaceMainReportResults"></div>';
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
		if (oJSON == undefined)
		{
			aHTML[++h] = '<div id="divInterfaceMainReportHeader"></div>';
			aHTML[++h] = '<div id="divInterfaceMainReportSearch"></div>';
			aHTML[++h] = '<div style="display:none;" id="divInterfaceMainReportResults">No results.</div>';
			$('#divInterfaceMainReport').html(aHTML.join(''));	
		}
		
		if (oJSON == undefined && sJSONSearch != undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.returnParameters = true;
			oSearch.rf = 'json';
			oSearch.getResults(sJSONSearch, function(data) {interfaceReportViewport(aParam, data)}) ;	
		}
		
		else if (oJSON == undefined && gsReportMethod != undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.endPoint = gsReportEndpoint;
			oSearch.method = gsReportMethod;
			oSearch.returnParameters = true;
			oSearch.rf = 'json';
			oSearch.getResults(function(data) {interfaceReportViewport(aParam, data)}) ;
		}
		
		else if (oJSON != undefined)
		{
			if (oSelectableParameters.fields != undefined)
			{
				$.each(oSelectableParameters.fields, function() 
				{ 
					aSelectableParameterList.push(this.name);
					aSelectableParameters.push(this);
				});	
			}
			
			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<table style="margin-bottom:0px;border-bottom-style:solid;border-width: 1px;border-color:#E8E8E8;" id="tableInterfaceReport" class="interfaceMain">';
			aHTML[++h] = '<tr><td style="vertical-alignment:bottom;padding-top:10px;"><span id="spanReportHeaderSearch">Search</span>' +
							'<span style="color:#B8B8B8;">&nbsp;|&nbsp;</span><span id="spanReportHeaderResults" style="cursor: pointer;">Results</span></td>';
			aHTML[++h] = '<td style="text-align:right;font-size:0.75em;"><span id="spanInterfaceReportSearch">Search</span></td></tr>';
			aHTML[++h] = '</table>';
			
			$('#divInterfaceMainReportHeader').html(aHTML.join(''))
			
			$('#spanReportHeaderSearch').addClass('Highlight')
			
			$('#spanReportHeaderSearch').click(function(event)
			{
				$('#divInterfaceMainReportSearch').show();
				$('#divInterfaceMainReportResults').hide();
				$('#spanReportHeaderSearch').css('cursor', 'auto');
				$('#spanReportHeaderResults').css('cursor', 'pointer');
				$('#spanReportHeaderSearch').addClass('Highlight');
				$('#spanReportHeaderResults').removeClass('Highlight');
			});
			
			$('#spanReportHeaderResults').click(function(event)
			{
				$('#divInterfaceMainReportSearch').hide();
				$('#divInterfaceMainReportResults').show();
				$('#spanReportHeaderSearch').css('cursor', 'pointer');
				$('#spanReportHeaderResults').css('cursor', 'auto');
				$('#spanReportHeaderSearch').removeClass('Highlight');
				$('#spanReportHeaderResults').addClass('Highlight');
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
			
			$.each(oJSON.data.parameters, function() 
			{ 
				sCaption = interfaceReportDictionaryGet({name: this.name})
				
				var iSelectableIndex = $.inArray(this.name, aSelectableParameterList)
				
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
				}	
				
				if (sCaption != undefined && (iSelectableIndex != -1 || aSelectableParameterList.length == 0))
				{
					var sName = (this.name).replace(/\./g,'_');
				
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
										' data-searchEndpoint="' + this.searchendpoint + '"' +
										' data-searchMethod="' + this.searchmethod + '"' +
										' data-inputType="' + this.inputtype + '"' +
										'  class="interfaceMainReportComparison"></td>';
										
					aHTML[++h] = '<td id="tdInterfaceMainReport_input-' + sName + '-' + this.datatype + '" class="interfaceMainReport"></td>';
					
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

			aHTML[++h] = '</table>';			
			
			$('#divInterfaceMainReportSearch').html(aHTML.join(''))
			
			$('input.inputInterfaceMainDate').datepicker({ dateFormat: 'dd M yyyy', changeYear: true });
			
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
			if (sHTML == 'None') {sHTML = ''};
			
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
				
			interfaceReportSetInput(
			{
				xhtmlElementID: sXHTMLElementInputID, 
				dataType: sDataType,
				inputType: sInputType,
				inputCount: iInputCount,
				searchEndpoint: sSearchEndpoint,
				searchMethod: sSearchMethod
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
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.dataType != undefined) {sDataType = aParam.dataType}
		if (aParam.inputType != undefined) {sInputType = aParam.inputType}
		if (aParam.inputCount != undefined) {iInputCount = aParam.inputCount}
		if (aParam.searchEndpoint != undefined) {sSearchEndpoint = aParam.searchEndpoint}
		if (aParam.searchMethod != undefined) {sSearchMethod = aParam.searchMethod}
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
				
				if (sInputType == 'textbox' || sInputType == 'textarea')
				{
					sXHTMLInputElementID = sXHTMLInputElementID.replace(/-/g, '_');
					sXHTMLInputElementID = sXHTMLInputElementID + '_' + i
					
					if (sDataType == 'text' || sDataType == 'numeric')
					{
						aHTML[++h] = '<input id="' + sXHTMLInputElementID +  '" class="inputInterfaceMainText">';
					}	
					
					if (sDataType == 'date')
					{
						aHTML[++h] = '<input id="' + sXHTMLInputElementID + '" class="inputInterfaceMainDate">';
					}	
				}
				
				if (sInputType == 'select')
				{
					if (sSearchEndpoint != undefined && sSearchMethod != undefined)
					{
						sXHTMLInputElementID = sXHTMLInputElementID.replace(/-/g, '_');
						sXHTMLInputElementID = sXHTMLInputElementID + '_' + i
						aHTML[++h] = '<input id="' + sXHTMLInputElementID + '"' +
									' onDemandMethod="/ondemand/' + sSearchEndpoint + '/?method=' + sSearchMethod + '" class="inputInterfaceMainSelect">';
					}
					else
					{
						aHTML[++h] = 'Report configuration error!'
					}	
				}	
			}
			
			$('#' + sXHTMLElementID).html(aHTML.join(''));
			$('#' + sXHTMLInputElementID).focus();
			
		}	
	}	
}

function interfaceReportSearch(aParam, oJSON)
{ 
	var sXHTMLElementID;
	var aHTML = [];
	var h = -1;
	var sReturnFormat = 'json';
	var iRows = giReturnRows;
	var sParameterList
	var oSearchParameters;
	var sExtraIDColumnBefore = '';
	var sExtraIDColumnHeader = '';
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.returnFormat != undefined) {sReturnFormat = aParam.returnFormat}
		if (aParam.rows != undefined) {iRows = aParam.rows}
		if (aParam.parameterList != undefined) {sParameterList = aParam.parameterList}
		if (aParam.searchParameters != undefined) {oSearchParameters = aParam.searchParameters}
		if (aParam.extraIDColumnBefore != undefined) {sExtraIDColumnBefore = aParam.extraIDColumnBefore}
		if (aParam.extraIDColumnHeader != undefined) {sExtraIDColumnHeader = aParam.extraIDColumnHeader}
		if (aParam.searchParameters == undefined)
		{
			if (aParam.fixedParameters != undefined) {oSearchParameters = aParam.fixedParameters}
		}	
	}	
	
	if (oJSON == undefined)
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
			$('#divInterfaceMainReportResults').html(gsLoadingXHTML);
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
				var sName = (aID[1]).replace('_','.');
				aParameterList.push(sName);
				aFields.push(sName);
			});	
			
			var sFields = '';
			for (var i = 0; i < aFields.length; i++)
			{
				if (aFields[i] != 'business.id')
				{
					sFields += aFields[i] + ',';	}
			}
			if (sFields != '') 	{sFields = sFields.substr(0, sFields.length - 1); }
			oSearch.addField(sFields);
			//aParam.parameterList = sFields;
			//oSearch.addField(aFields.join(','));
			aParam.parameterList = aFields.join(',');
			
			oSearch.endPoint = gsReportEndpoint;
			oSearch.method = gsReportMethod;
			
			var aFilters = [];
			
			if (oSearchParameters != undefined)
			{
				$.each(oSearchParameters.filters, function()
				{
					aFilters.push(this);
				});
			}
			
			$('td.interfaceMainReportComparison[data-code]').each(function() 
			{ 
				var sID = this.id
				var aID = sID.split('-')
				
				var sInputID  = sID.replace('_comparison', '_input');
				sInputID  = sInputID.replace('td', 'input');
				sInputID = sInputID.replace(/-/g, '_');
				sInputID = sInputID + '_1';
				
				var sName = aID[1];
				var sComparison = $(this).attr('data-code');
				
				if (sComparison != '')
				{
					var sInputType = $('#' + sID).attr('data-inputType');
					
					if (sInputType == 'select')
					{
						var sValue = $('#' + sInputID).attr('ondemandid');
					}
					else
					{
						var sValue = $('#' + sInputID).val();
					}
					
					aFilters.push(
					{
						name: sName,
						comparison: sComparison,
						value1: sValue,
						value2: ""
					});
				}	
			});	
			
			$.each(aFilters, function()
			{
				oSearch.addFilter(this.name, this.comparison, this.value1, this.value2);
			});
			
			oSearch.rows = iRows;
			oSearch.rf = sReturnFormat;
			oSearch.getResults(function(data){interfaceReportSearch(aParam, data)}) ;	
		}	
			
	}
	else
	{
	
		if (oJSON.data.rows.length == 0)
		{
			aHTML[++h] = '<table class="interfaceMain"">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">Nothing to show.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#divInterfaceMainReportResults').html(aHTML.join(''));
		}
		else
		{
			aHTML[++h] = '<table class="interfaceMain"">';
			aHTML[++h] = '<tbody>'
		
			aParameter = sParameterList.split(',');
			
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			
			$.each(aParameter, function()
			{
				if (this == sExtraIDColumnBefore)
				{
					aHTML[++h] = '<td class="interfaceMainCaption">' + sExtraIDColumnHeader + '</td>';
				}
					
				var sCaption = interfaceReportDictionaryGet({name: this})
				aHTML[++h] = '<td class="interfaceMainCaption">' + sCaption + '</td>';
			});
			
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>'

			$.each(oJSON.data.rows, function(index) 
			{ 
				aHTML[++h] = interfaceReportSearchRow(this, aParam);
			});
			
			aHTML[++h] = '</tbody></table>';
			
			interfaceMasterPaginationList(
			   {
				xhtmlElementID: 'divInterfaceMainReportResults',
				xhtmlContext: '',
				xhtml: aHTML.join(''),
				showMore: ($(oJSON).attr('morerows') == "true"),
				columns: aParameter.join('-'),
				more: $(oJSON).attr('moreid'),
				rows: giReturnRows,
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
			//functionSearch: interfaceMasterActions,	
			//functionOpen: 'interfaceActionMasterViewport({showHome: false});interfaceActionSearch(this.id)',
			//functionNewPage: 'interfaceMasterAttachmentsShowBind()'	
			//interfaceMasterAttachmentsShowBind();	
		}		
	}	
}

function interfaceReportSearchRow(oJSON, aParam)
{
	var aHTML = [];
	var h = -1;
	var oFixedParameters = goFixedParameters;
	var aFixedName = [];
	var	aFixedValue = [];
	var i;
	var sExtraIDColumnBefore;
	var sExtraIDColumnValue
	
	if (aParam != undefined)
	{
		if (aParam.fixedParameters != undefined) {oFixedParameters = aParam.fixedParameters}
		if (aParam.extraIDColumnBefore != undefined) {sExtraIDColumnBefore = aParam.extraIDColumnBefore}
		if (aParam.extraIDColumnValue != undefined) {sExtraIDColumnValue = aParam.extraIDColumnValue}
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
	
	aHTML[++h] = '<tr class="interfaceMainRow">';

	var sLastExtraID;
	$.each(oJSON, function(key, value) 
	{ 
		var sValue = value;
		
		if (key != 'id')
		{
			var i = $.inArray(key, aFixedName)
			if (i != -1) {sValue = aFixedValue[i]}
		
			var sKey = (key).replace(/\./g,'_')
			if (key == sExtraIDColumnBefore)
			{	
				sLastExtraID = Math.floor(Math.random() * 10000000001);
				aHTML[++h] = '<td class="interfaceMainRow extraID" ' + 
								 'id="' + sLastExtraID + '">' + 
							  sExtraIDColumnValue + '</td>';
			}
			aHTML[++h] = '<td class="interfaceMainRow ' + sKey + '" ' + 
							 'id="' + value + '">' + 
						  sValue + '</td>';
		}
		else
		{
			aHTML[++h] = '<td class="interfaceMainRowOptionsSelect id" ' +
							 'id="id-' + sValue + '"' +
							 'data-extraid="' + sLastExtraID + '"></td>';
			
		}
		
	});

	aHTML[++h] = '</tr>'; 
	
	return aHTML.join('');
	
}

function interfaceReportNewPage(aParam, oJSON)
{
	var sEndpoint;
	var sMethod;
	var sName;
	var sSourceName;
	var sCompareColumn = 'id';
	var oMoreFilters;
	
	if (aParam != undefined)
	{
		if (aParam.endpoint != undefined) {sEndpoint = aParam.endpoint}	
		if (aParam.method != undefined) {sMethod = aParam.method}	
		if (aParam.name != undefined) {sName = aParam.name}	
		if (aParam.sourceName != undefined) {sSourceName = aParam.sourceName}	
		if (aParam.compareColumn != undefined) {sCompareColumn = aParam.compareColumn}	
		if (aParam.moreFilters != undefined) {oMoreFilters = aParam.moreFilters}
	}
	
	if (oJSON == undefined)
	{
	
		if (sEndpoint == undefined && sMethod != undefined)
		{
			var aMethod = sMethod.split('_');
			sEndpoint = (aMethod[0]).toLowerCase();
		}
		if (sSourceName == "extraID")
		{
			var aID = '';
			$('td.id').each(function()
			{
				aID = ($(this).attr('id')).split('-');
				$('#' + $(this).attr('data-extraid')).attr('id', aID[1]);
			});	
		}
		
		var aSourceIDs = [];
		
		$('td.' + (sSourceName).replace(/\./g,'_')).each(function()
		{
			aSourceIDs.push($(this).attr('id'))
		});
		
		var sFields = sName;
		if 	(sCompareColumn != 'id')
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
				oAdvancedSearch.addFilter( this.name, this.comparison, this.value1, this.value2);
			});
		}
		
		if (sCompareColumn != 'id')
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
		$.each(oJSON.data.rows, function(index) 
		{ 
			if (sCompareColumn != 'id')
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

