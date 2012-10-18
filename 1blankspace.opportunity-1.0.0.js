/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
var gaOpportuntityProcessingStatus;

function interfaceOpportunityMasterViewport(aParam)
{
	ns1blankspace.object = ns1blankspace.data.object.opportunity;
	ns1blankspace.objectName = 'Opportunity';
	ns1blankspace.objectContextData = undefined;
	ns1blankspace.objectContext = -1;
		
	var bShowHome = true;
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
	}	
	
	interfaceMasterReset();		
		
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceOpportunityMasterViewport({showHome: true});',
			move: false
			})		
	}	
		
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Opportunities"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceOpportunitySearch('inputInterfaceMasterViewportControlSearch')", ns1blankspace.option.typingWait);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceOpportunitySearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceOpportunitySearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceOpportunityNew();
	})
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceOpportunitySave();
	});
	
	$('#spanInterfaceMasterViewportControlAction').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableinterfaceActionOptions" class="interfaceActionOptions">';
						
		aHTML[++h] = '<tr id="trinterfaceActionOptions" class="interfaceActionOptions">' +
						'<td id="tdinterfaceActionOptionsDelete" class="interfaceActionOptions">' +
						'Delete' +
						'</td>' +
						'</tr>';

		aHTML[++h] = '</table>';

		interfaceMasterViewportActionShow(this, aHTML.join(''), "interfaceOpportunityActionOptionsBind()");
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceOpportunitySetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceOpportunitySetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceOpportunityHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceOpportunityHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceOpportunitySearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceOpportunitySearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	if (ns1blankspace.option.setFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	
	if (bShowHome) {interfaceOpportunityHomeShow()};
	
}

function interfaceOpportunityHomeShow(oResponse)
{
	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceOpportunityHomeMostLikely" class="interfaceViewportMain">' +
						ns1blankspace.xhtml.loading + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportOpportunityLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'opportunity';
		oSearch.method = 'OPPORTUNITY_SEARCH';
		
		oSearch.addField('description,reference');
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		
		oSearch.getResults(interfaceOpportunityHomeShow);
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceOpportunityHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceOpportunityHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceOpportunityHomeMostLikelyNothing">Click New to create a opportunity.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceOpportunityHomeMostLikely">';
			aHTML[++h] = '<tr>';
			aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{			
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceProjectHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">';
										
				if (this.description != '')
				{
					aHTML[++h] = this.description;
				}
				else
				{	
					aHTML[++h] = this.reference;
				}
				
				aHTML[++h] = '</td></tr>';
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceOpportunityHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceOpportunitySearch(event.target.id, {source: 1});
		});
	}
}

function interfaceOpportunitySearch(sXHTMLElementId, aParam)
{
		
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	var iMinimumLength = 3;
	var iSource = ns1blankspace.data.searchSource.text;
	var sSearchText;
	var sClientFilter = '';
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
		
	if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
	{
	
		$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
		
		ns1blankspace.objectContext = sSearchContext;
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'OPPORTUNITY_SEARCH';
		
		oSearch.addField('reference,businessname,firstname,surname,' +
									'requestbybusiness,requestbybusinesstext,' +
									'requestbyperson,requestbypersontext,type,typetext,' +
									'lodgeddate,source,sourcetext,sourcetext,manageruser,managerusertext,' +
									'status,statustext,processingstatus,processingstatustext,' +
									'processingdate,description,' +
									'mailingaddress1,mailingsuburb,mailingstate,mailingpostcode,mailingcountry,' +
									'email,mobile,phone,createddate,createdusertext');
									
		oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
		oSearch.rf = 'json';
	
		oSearch.getResults(function(data){interfaceOpportunityShow(aParam, data)}) 
	}
	else
	{
		if (sSearchText == undefined)
		{
			sSearchText = $('#inputInterfaceMasterViewportControlSearch').val();
		}	
		
		if (iSource == ns1blankspace.data.searchSource.browse)
		{
			iMinimumLength = 1;
			iMaximumColumns = 4;
			sSearchText = aSearch[1];
			sElementId = 'tableInterfaceViewportMasterBrowse';
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
		{
			
			interfaceMasterOptionsSetPosition(sElementId);
			interfaceMasterSearchStart(sElementId);
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'OPPORTUNITY_SEARCH';
			
			oSearch.addField('businessname,firstname,surname,requestbytextbusiness,status,statustext');
			
			if (iSource == ns1blankspace.data.searchSource.text)
			{	
				oSearch.addFilter('quicksearch', 'STRING_IS_LIKE', sSearchText);
			}
			else
			{
				oSearch.addFilter('quicksearch', 'STRING_STARTS_WITH', sSearchText);
			}
			
			oSearch.rf = 'json';
			
			oSearch.getResults(function(data){interfaceOpportunitySearchShow(aParam, data)}) 

		}
	};	
}

function interfaceOpportunitySearchShow(aParam, oResponse)
{
	var iColumn = 0;
	var aHTML = [];
	var h = -1;
		
	if (oResponse.data.rows.length == 0)
	{
		interfaceMasterSearchStop();	
		$('#divInterfaceMasterViewportControlOptions').hide();
	}
	else
	{
		var iStartRow = parseInt($(oRoot).attr('startrow'));
		var iRows = parseInt($(oRoot).attr('rows'));
		var bMore = ($(oRoot).attr('morerows') == "true");
		var iMore = $(oRoot).attr('moreid')

		aHTML[++h] = '<table class="interfaceSearchMedium">';
		aHTML[++h] = '<tbody>'
			
		$.each(oResponse.data.rows, function()
		{	
			aHTML[++h] = '<tr class="interfaceSearch">';
			
			aHTML[++h] = '<td class="interfaceSearch';
			
			aHTML[++h] = ' interfaceOpportunity' + this.statustext;
			
			aHTML[++h] = '" id=-' + this.id + '">' +
							this.businessname + '</td>';
							
			aHTML[++h] = '<td class="interfaceSearch';
			
			aHTML[++h] = ' interfaceOpportunity' + this.statustext;
			
			aHTML[++h] = '" id=-' + this.id + '">' +
							this.firstname + ' ' + this.surname + '</td>';
			
			aHTML[++h] = '</tr>'
		});
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(
		interfaceMasterPagination(
		   {
			html: aHTML.join(''),
			more: (oResponse.morerows == "true"),
			type: 'json'
		   }) 
		);		
		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
			interfaceOpportunitySearch(event.target.id, {source: 1});
		});
		
		interfaceMasterPaginationBind(
		{
			columns: 'businessname-firstname-surname',
			more: oResponse.moreid,
			rows: 20,
			startRow: 20,
			startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
			functionSearch: interfaceOpportunitySearch,
		});   
	}	
}

function interfaceOpportunityViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (ns1blankspace.objectContext != -1)
	{	
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
						'</tr>';	
	
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
	}
	else
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
					'</tr>';
	}					
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlContact" class="interfaceViewportControl">Contact</td>' +
					'</tr>';
						
	aHTML[++h] = '</table>';					
	
	if (ns1blankspace.objectContext != -1)
	{	
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
		
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlActions" class="interfaceViewportControl">Actions</td>' +
					'</tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
	}
		
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainContact" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
		
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceOpportunitySummary();
	});	
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceOpportunityDetails();
	});
	
	$('#tdInterfaceViewportControlContact').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainContact");
		interfaceOpportunityContact();
	});

	$('#tdInterfaceViewportControlActions').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainActions");
		interfaceMasterActions({xhtmlElementID: 'divInterfaceMainActions'});
	});
	
	$('#tdInterfaceViewportControlAttachments').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAttachments");
		interfaceMasterAttachments({xhtmlElementID: 'divInterfaceMainAttachments'});
	});
	
}

function interfaceOpportunityShow(aParam, oResponse)
{

	$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
	interfaceOpportunityViewport();
	interfaceMasterStatus('');

	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		ns1blankspace.objectContextData = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this opportunity.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		ns1blankspace.objectContextData = oResponse.data.rows[0];
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceOpportunityMasterViewport({showHome: false});interfaceOpportunitySearch("-' + ns1blankspace.objectContext + '")',
			move: false
			})
	
		
		var sContext = ns1blankspace.objectContextData.reference;
		
		if (ns1blankspace.objectContextData.businessname != '')
		{
			sContext += '<br /><span id="spanInterfaceViewportControlSubContext">' + ns1blankspace.objectContextData.businessname + '</span>';
		}
		
		if (ns1blankspace.objectContextData.firstname != '')
		{
			sContext += '<br /><span id="spanInterfaceViewportControlSubContext">' + ns1blankspace.objectContextData.firstname + '</span>';
		}
		
		if (ns1blankspace.objectContextData.surname != '')
		{
			sContext += '<br /><span id="spanInterfaceViewportControlSubContext">' + ns1blankspace.objectContextData.surname + '</span>';
		}
		
		$('#divInterfaceViewportControlContext').html(sContext);
		
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
		
		interfaceOpportunitySummary();
	}	
}		
		
function interfaceOpportunitySummary()
{
	var aHTML = [];
	var h = -1;

	if (ns1blankspace.objectContextData == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this opportunity.</td></tr>';
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
		
		if (ns1blankspace.objectContextData.businessname != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryBusiness" class="interfaceMainSummary">Business</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryBusinessValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.businessname +
						'</td></tr>';
		}				
						
		if (ns1blankspace.objectContextData.firstname != '' || ns1blankspace.objectContextData.surname != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryContact" class="interfaceMainSummary">Contact</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryContactValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.firstname + ' ' + ns1blankspace.objectContextData.surname +
						'</td></tr>';
		}				
			
		if (ns1blankspace.objectContextData.processingstatustext != '')
		{	
			aHTML[++h] = '<tr><td id="trInterfaceMainSummaryProcessingStatus" class="interfaceMainSummary">Processing Status</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryProcessingStatusValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.processingstatustext +
						'</td></tr>';											
		}
		
		if (ns1blankspace.objectContextData.statustext != '')
		{	
			aHTML[++h] = '<tr><td id="trInterfaceMainSummaryStatus" class="interfaceMainSummary">Status</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryStatusValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.statustext +
						'</td></tr>';											
		}
		
		var sDate = new Date(ns1blankspace.objectContextData.createddate);	
		sDate = $.fullCalendar.formatDate(sDate, 'd MMM yyyy h:mm TT');
				
		aHTML[++h] = '<tr><td id="trInterfaceMainSummaryDateLodged" class="interfaceMainSummary">Date Lodged</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryProcessingDateLogdgedValue" class="interfaceMainSummaryValue">' +
						sDate +
						'</td></tr>';		
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.description +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));
			
		var aHTML = [];
		var h = -1;	
			
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action" cellspacing=0>';
		
		if (ns1blankspace.objectContextData.requestbyperson == '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryCreateContact" class="interfaceMainColumn2Action">' +
							'<a href="#" id="aInterfaceMainSummaryCreateContact">Create&nbsp;Person&nbsp;Contact</a></td></tr>';
		}
		else
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryViewContact" class="interfaceMainColumn2Action">' +
							'<a href="#" id="aInterfaceMainSummaryViewContact">View&nbsp;Person&nbsp;Contact</a></td></tr>';
		}	
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
		
		$('#aInterfaceMainSummaryViewContact').click(function(event)
		{
			var iContactPerson = ns1blankspace.objectContextData.requestbyperson;	
			interfaceContactPersonMasterViewport({showHome: false});
			interfaceContactPersonSearch('-' + iContactPerson)
		});
		
		$('#aInterfaceMainSummaryCreateContact').click(function(event)
		{
			interfaceOpportunityCreateContact();
		});
		
		$('#aInterfaceMainSummarySendEmail').click(function(event)
		{
			interfaceMessagingSendEmail();
		});
	}	
}

function interfaceOpportunityDetails()
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
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDateReceived" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDateReceived" class="interfaceMain">' +
						'Date Received' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDateReceivedValue" class="interfaceMainDate">' +
						'<td id="tdInterfaceMainDetailsDateReceivedValue" class="interfaceMainDate">' +
						'<input id="inputInterfaceMainDetailsDateReceived" class="inputInterfaceMainDate">' +
						'</td></tr>';						
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSourceOfContact" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSourceOfContact" class="interfaceMain">' +
						'Source of Contact' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSourceOfContactValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsSourceOfContactValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsSourceOfContact" class="inputInterfaceMainSelect"' +
							' onDemandMethod="SETUP_OPPORTUNITY_SOURCE_OF_CONTACT_SEARCH">' +
						'</td></tr>';	
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSourceOfContactOther" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSourceOfContactOther" class="interfaceMain">' +
						'Source of Contact - Other Details' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSourceOfContactOtherValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSourceOfContactOtherValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsSourceOfContactOther" class="inputInterfaceMainText">' +
						'</td></tr>';				
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsManagedBy" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsManagedBy" class="interfaceMain">' +
						'Managed By' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsManagedByValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsManagedByValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsManagedBy" class="inputInterfaceMainSelect"' +
							' onDemandMethod="/ondemand/core/?method=CORE_USER_SEARCH&rf=xml"'+ 
														' onDemandColumns="firstname-space-surname">' +
						'</td></tr>';			
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStatus" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStatus" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStatusValue" class="interfaceMainRadio">' +
						'<td id="tdInterfaceMainDetailsStatusValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Open' +
						'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Closed' +
						'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Cancelled' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';

		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
						'Description' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<textarea rows="9" cols="35" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';

		aHTML[++h] = '</table>';		
		
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
		
		$('input.inputInterfaceMainDate').datepicker({ dateFormat: 'dd M yy' });
		
		if (ns1blankspace.objectContextData != undefined)
		{
			$('#inputInterfaceMainDetailsDateReceived').val(ns1blankspace.objectContextData.lodgeddate);
			$('#inputInterfaceMainDetailsSourceOfContact').attr(ns1blankspace.objectContextData.source);
			$('#inputInterfaceMainDetailsSourceOfContact').val(ns1blankspace.objectContextData.sourcetext);
			$('#inputInterfaceMainDetailsSourceOfContactOther').val(ns1blankspace.objectContextData.sourcetext);
			$('#inputInterfaceMainDetailsManagedBy').attr('onDemandID', ns1blankspace.objectContextData.manageruser);
			$('#inputInterfaceMainDetailsManagedBy').val(ns1blankspace.objectContextData.managerusertext);
			$('#inputInterfaceMainDetailsDescription').val(ns1blankspace.objectContextData.description);
			$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
		}
		else
		{
			var dDate = new Date();
			var dToday;
			dToday = dDate.format('d mmm yyyy');
			$('#inputInterfaceMainDetailsDateReceived').val(dToday);
			$('#inputInterfaceMainDetailsManagedBy').attr('onDemandID', gsUserID);
			$('#inputInterfaceMainDetailsManagedBy').val(ns1blankspace.user.commonname);
			$('[name="radioStatus"][value="1"]').attr('checked', true);
		}
	}	
}

function interfaceOpportunityContact()
{
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainContact').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainContact').attr('onDemandLoading', '');
		
		aHTML[++h] = '<table id="tableInterfaceMainContact" class="interfaceMain">' +
						'<tr id="trInterfaceMainContactRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainContactColumn1" class="interfaceMainColumn1Large">' +
						'</td>' +
						'<td id="tdInterfaceMainContactColumn2" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';					
				
		$('#divInterfaceMainContact').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainContactActionColumn1" class="interfaceMain">';
		aHTML[++h] = '<tbody>';
		
		if (ns1blankspace.objectContextData != undefined)
		{
			if (ns1blankspace.objectContextData.requestbybusiness != '')
			{	
				GetCurrentContactStatus('', 'business', ns1blankspace.objectContextData.requestbybusiness);

				aHTML[++h] = '<tr><td id="tdInterfaceMainContactProspectBusiness" class="interfaceMainSummaryAction">';
				aHTML[++h] = '<a href="#" id="aInterfaceMainContactProspectBusiness">Update&nbsp;Contact';
				aHTML[++h] = '</a></td></tr>';
			}	
			else
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainContactProspectBusiness" class="interfaceMainSummaryAction">';
				aHTML[++h] = '<a href="#" id="aInterfaceMainContactProspectBusiness">Create Contact</a></td></tr>';
			}
		}	
		aHTML[++h] = '</tbody></table>';
		
		$('#tdInterfaceMainContactColumn2').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainContactDetailColumn1" class="interfaceMain">';
						
		aHTML[++h] = '<tr id="trInterfaceMainContactBusinessName" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactBusinessName" class="interfaceMain">' +
						'Business Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactBusinessNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactBusinessNameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactBusinessName" class="inputInterfaceMainText">' +
						'</td></tr>';				

		aHTML[++h] = '<tr id="trInterfaceMainContactFirstName" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactFirstName" class="interfaceMain">' +
						'First Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactFirstNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactFirstNameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactFirstName" class="inputInterfaceMainText">' +
						'</td></tr>';			

		aHTML[++h] = '<tr id="trInterfaceMainContactSurname" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactSurname" class="interfaceMain">' +
						'Surname' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactSurnameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactSurnameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactSurname" class="inputInterfaceMainText">' +
						'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainContactPhone" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactPhone" class="interfaceMain">' +
						'Phone' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactPhoneValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactPhoneValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactPhone" class="inputInterfaceMainText">' +
						'</td></tr>';						
	
		aHTML[++h] = '<tr id="trInterfaceMainContactMobile" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactMobile" class="interfaceMain">' +
						'Mobile' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactMobileValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactMobileValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactMobile" class="inputInterfaceMainText">' +
						'</td></tr>';			
		
		aHTML[++h] = '<tr id="trInterfaceMainContactEmail" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactEmail" class="interfaceMain">' +
						'Email' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactEmailValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactEmailValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactEmail" class="inputInterfaceMainText">' +
						'</td></tr>';			
		
		aHTML[++h] = '<tr id="trInterfaceMainContactMailingAddress1" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactMailingAddress1" class="interfaceMain">' +
						'Mailing Address' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactMailingAddress1Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactMailingAddress1Value" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactMailingAddress1" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainContactMailingSuburb" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactMailingSuburb" class="interfaceMain">' +
						'Suburb' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactMailingSuburbValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactMailingSuburbValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainContactMailingSuburb" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainContactMailingState" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactMailingState" class="interfaceMain">' +
						'State' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactMailingStateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactMailingStateValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactMailingState" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainContactMailingPostCode" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactMailingPostCode" class="interfaceMain">' +
						'Post Code' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactMailingPostCodeValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactMailingPostCodeValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactMailingPostCode" class="inputInterfaceMainText">' +
						'</td></tr>';				
						
		aHTML[++h] = '<tr id="trInterfaceMainContactMailingCountry" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactMailingCountry" class="interfaceMain">' +
						'Country' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactMailingCountryValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactMailingCountryValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactMailingCountry" class="inputInterfaceMainText">' +
						'</td></tr>';						
						
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainContactColumn1').html(aHTML.join(''));
		
		if (ns1blankspace.objectContextData != undefined)
		{
			$('#inputInterfaceMainContactBusinessName').val(ns1blankspace.objectContextData.businessname);
			$('#inputInterfaceMainContactFirstName').val(ns1blankspace.objectContextData.firstname);
			$('#inputInterfaceMainContactSurname').val(ns1blankspace.objectContextData.surname);
			$('#inputInterfaceMainContactPhone').val(ns1blankspace.objectContextData.phone);
			$('#inputInterfaceMainContactMobile').val(ns1blankspace.objectContextData.mobile);
			$('#inputInterfaceMainContactEmail').val(ns1blankspace.objectContextData.email);
			$('#inputInterfaceMainContactMailingAddress1').val(ns1blankspace.objectContextData.mailingaddress1);
			$('#inputInterfaceMainContactMailingSuburb').val(ns1blankspace.objectContextData.mailingsuburb);
			$('#inputInterfaceMainContactMailingState').val(ns1blankspace.objectContextData.mailingstate);
			$('#inputInterfaceMainContactMailingPostCode').val(ns1blankspace.objectContextData.mailingpostcode);
			$('#inputInterfaceMainContactMailingCountry').val(ns1blankspace.objectContextData.mailingcountry);
			if ((ns1blankspace.objectContextData.requestbybusiness != '') || (ns1blankspace.objectContextData.requestbybusiness != ''))
			{
				$('#aInterfaceMainContactProspectBusiness').click(function(event)
				{
					interfaceOpportunityManageProspect();
				});
			}
		}
	}	
}

function interfaceOpportunityNew(oXML)
{
	ns1blankspace.objectContextData = unefined;
	ns1blankspace.objectContext = -1;
	interfaceOpportunityViewport(true);
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	interfaceOpportunityDetails();	
}

function interfaceOpportunitySave()
{
	var sParam = '/ondemand/opportunity/?method=OPPORTUNITY_MANAGE';
	var sData = (ns1blankspace.objectContext == -1)?'':'&id=' + ns1blankspace.objectContext;
	var sPreviousValue;
	var sSavedProcessStatus = '';
	var iFound = -1;
	var iProcessingStatusCancelled;
	var dDate = new Date();
	var dToday;
	dToday = dDate.format('d mmm yyyy');

	iFound = $.inArray(gaOpportunityProcessingStatus, 'Opportunity Cancelled', 1)
	if (iFound >= 0)  { iProcessingStatusCancelled = gaOpportunityProcessingStatus[iFound][0]}

	if (ns1blankspace.objectContextData != undefined)	
	{		
		sSavedProcessStatus = ns1blankspace.objectContextData.processingstatus;
	}
	
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&type=' + giOpportunityTypeOpportunity;
		sData += '&startdate=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDateReceived').val());
		
		if ($('#inputInterfaceMainDetailsSourceOfContact').attr('onDemandID') != undefined)
		{	sData += '&source=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsSourceOfContact').attr('onDemandID'));}
		
		sData += '&sourcenote=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsSourceOfContactOther').val());
		
		if ($('#inputInterfaceMainDetailsManagedBy').attr('onDemandID'))
		{	sData += '&manageruser=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsManagedBy').attr('onDemandID'));}
		else
		{	
			if (ns1blankspace.objectContextData != undefined)	
			{	
				sData += '&manageruser=' + ns1blankspace.objectContextData.manageruser;	
				$('#inputInterfaceMainDetailsManagedBy').attr('onDemandID', ns1blankspace.objectContextData.manageruser);
				$('#inputInterfaceMainDetailsManagedBy').val(ns1blankspace.objectContextData.managerusertext)
			}
			else
			{
				sData += '&manageruser='+ gsUserID;
			}
		}

		if ($('#inputInterfaceMainDetailsStatus').attr('onDemandID') == giOpportunityStatusCancelled )
		{	 
			if	( 
				  ( $('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') != undefined &&
				    $('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') != iProcessingStatusCancelled 
				  )
				||
				  ( $('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') == undefined && 
				    sSavedProcessStatus != iProcessingStatusCancelled
				  ) 
			    )
			{
				$('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') = iProcessingStatusCancelled;
				$('#inputInterfaceMainDetailsNewProcessingStatus').val('Opportunity Cancelled');
				$('#inputInterfaceMainDetailsNewProcessingDate').val(dToday);
				$('#inputInterfaceMainDetailsNewProcessingNote').val('System update. User changed Opportunity Status to Cancelled.');
				$('#tdInterfaceMainDetailsCurrentProcessingStatusValue').html('Opportunity Cancelled');
			}
		}
		
		if ($('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') == iProcessingStatusCancelled )
		{	 
			if	( 
				  ( $('#inputInterfaceMainDetailsStatus').attr('onDemandID') != undefined &&
				    $('#inputInterfaceMainDetailsStatus').attr('onDemandID') != giOpportunityStatusCancelled 
				  )
			    )
			{
				$('#inputInterfaceMainDetailsStatus').attr('onDemandID')  = giOpportunityStatusCancelled;
				$('#inputInterfaceMainDetailsStatus').val('Cancelled');
			}
			
		}

		if ($('#inputInterfaceMainDetailsStatus').attr('onDemandID') != undefined)
		{			
			sData += '&status=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsStatus').attr('onDemandID'));
		}
		else
		{	
			if (ns1blankspace.objectContextData != undefined)	
			{	
				sData += '&status=' + ns1blankspace.objectContextData.status;	
				$('#inputInterfaceMainDetailsStatus').attr('onDemandID', ns1blankspace.objectContextData.status);
				$('#inputInterfaceMainDetailsStatus').val(ns1blankspace.objectContextData.statustext);
			}
			else
			{	sData += '&status=' + giOpportunityStatusOpen;	}
		}
		
		sData += '&description=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDescription').val());
		
		if ($('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') != undefined)
		{	if (ns1blankspace.objectContext != -1)
			{
				if (ns1blankspace.objectContextData != undefined)	
				{
					sPreviousValue = ns1blankspace.objectContextData.processingstatus;	
					$('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID', ns1blankspace.objectContextData.processingstatus);
				}
				else 
				{	sPreviousValue = '';	}
				
				if (sPreviousValue != $('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID'))
				{	
					sData += '&updateprocessingstatus=1' + 
						'&processingstatus=' + $('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') +
						'&processingdate=' + $('#inputInterfaceMainDetailsNewProcessingDate').val() +
						'&processingnote=' + $('#inputInterfaceMainDetailsNewProcessingNote').val() ;	
				}
			}
			else
			{	
				iFound = interfaceOpportuntityProcessingStatus('New Opportunity')
				if (iFound != -1) {sData += '&processingstatus=' + iFound;}
			}
		}
		else
		{	
			iFound = interfaceOpportuntityProcessingStatus('New Opportunity')
			if (iFound != -1) {sData += '&processingstatus=' + iFound;}
			
			iFound = ArrayFind(gaOpportunityProcessingStatus, 'New Opportunity', 1)
			if (iFound >= 0)  {sData += '&processingstatus=' + gaOpportunityProcessingStatus[iFound][0]; }
		}
	}
		
	if ($('#divInterfaceMainContact').html() != '')
	{
		if ($('#inputInterfaceMainContactFirstName') != '' && $('#inputInterfaceMainContactSurname') == '')
		{	
			alert('Surname is mandatory for a Contact.');
			return '';	}
			
		sData += '&businessname=' + interfaceMasterFormatSave($('#inputInterfaceMainContactBusinessName').val());
		sData += '&firstname=' + interfaceMasterFormatSave($('#inputInterfaceMainContactFirstName').val());
		sData += '&surname=' + interfaceMasterFormatSave($('#inputInterfaceMainContactSurname').val());
		sData += '&phone=' + interfaceMasterFormatSave($('#inputInterfaceMainContactPhone').val());
		sData += '&mobile=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMobile').val());
		sData += '&email=' + interfaceMasterFormatSave($('#inputInterfaceMainContactEmail').val());
		sData += '&mailingaddress1=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingAddress1').val());
		sData += '&mailingsuburb=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingSuburb').val());
		sData += '&mailingstate=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingState').val());
		sData += '&mailingpostcode=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingPostCode').val());
		sData += '&mailingcountry=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingCountry').val());
	}
	
	interfaceMasterSave(sParam, sData, 'Opportunity Saved');
	
	if (glObjectSaveId != -1)
	{	
		if (ns1blankspace.objectContext == -1)
		{	
			ns1blankspace.objectContext = glObjectSaveId;
			interfaceOpportunitySearch('opporunity-' + ns1blankspace.objectContext);
		}
	}
}

function interfaceOpportunityManageProspect()
{
	var sParam = '';
	var sData = '';
	var sReturn = '';
	var iContactBusiness = '';
	var iContactPerson = '';
	var sSuccessMessage = '';
	
	var aHTML = [];
	var h = -1;
	
	if (ns1blankspace.objectContextData != undefined)	
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Opportunity must be saved before prospect can be created.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		iContactPerson = ns1blankspace.objectContextData.requestbyperson;
		iContactBusiness = ns1blankspace.objectContextData.requestbybusiness;
	}

	if ($('#inputInterfaceMainContactBusinessName').val() != '' || ns1blankspace.objectContextData.businessname != '' )
	{
		sParam = 'method=CONTACT_BUSINESS_MANAGE';
		sData = '';
		
		if ($('#inputInterfaceMainContactBusinessName').val() != undefined)
		{
			sData += '&tradename=' + interfaceMasterFormatSave($('#inputInterfaceMainContactBusinessName').val());
			sData += '&mailingaddress1=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingAddress1').val());
			sData += '&mailingsuburb=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingSuburb').val());
			sData += '&mailingstate=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingState').val());
			sData += '&mailingpostcode=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingPostCode').val());
			sData += '&mailingcountry=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingCountry').val());
			sData += '&phonenumber=' + interfaceMasterFormatSave($('#inputInterfaceMainContactPhone').val());
			sData += '&faxnumber=' + interfaceMasterFormatSave($('#inputInterfaceMainContactFax').val());
		}
		else
		{
			sData += '&tradename=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'businessname'));
			sData += '&mailingaddress1=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'mailingaddress1'));
			sData += '&mailingsuburb=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'mailingsuburb'));
			sData += '&mailingstate=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'mailingstate'));
			sData += '&mailingpostcode=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'mailingpostcode'));
			sData += '&mailingcountry=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'mailingcountry'));
			sData += '&phonenumber=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'phone'));
		}
		
		sData += '&customerstatus=' + ns1blankspace.objectStatusProspect;
		
		if (iContactBusiness != '')	
		{
			sData += '&id=' + iContactBusiness;
			sSuccessMessage = 'updated';
		}
		else {sSuccessMessage = 'added'}

		interfaceMasterSave('/ondemand/contact/?' + sParam, sData, 'Prospect Business ' + sSuccessMessage + '.');
		if (glObjectSaveId != -1)
		{
			sReturn = glObjectSaveId;
			interfaceMasterSave('/ondemand/opportunity/?method=OPPORTUNITY_MANAGE'
								, '&id=' + ns1blankspace.objectContext + 
								  '&requestbybusiness=' + sReturn +
								  '&updatecontactid=1'
								, '' );
			
			if (sSuccessMessage == 'added')
			{
				ns1blankspace.objectContext = glObjectSaveId;
				sParam = '/ondemand/contact/?method=CONTACT_BUSINESS_GROUP_MANAGE';
				sData += '&contactbusiness=' + sReturn + '&group=' + giGroupBusinessClient;
				interfaceMasterSave(sParam, sData, '');
			}

		}
	}

	if ( $('#inputInterfaceMainContactSurname').val() != '' || onDemandXMLGetData(oRow, 'surname') != '' ) 
	{
		sParam = 'method=CONTACT_PERSON_MANAGE';
		iContactBusiness = (iContactBusiness == '' && sReturn != '')?sReturn:iContactBusiness;
		sData = (iContactBusiness != '')?'&contactbusiness=' + iContactBusiness + '&primarycontact=1':'';
		
		if ($('#inputInterfaceMainContactSurname').val() != undefined)
		{
			sData += '&firstname=' + interfaceMasterFormatSave($('#inputInterfaceMainContactFirstName').val());
			sData += '&surname=' + interfaceMasterFormatSave($('#inputInterfaceMainContactSurname').val());
			sData += '&jobtitle=' + interfaceMasterFormatSave($('#inputInterfaceMainContactJobTitle').val());
			sData += '&streetaddress1=' + interfaceMasterFormatSave($('#inputInterfaceMainContactStreetAddress1').val());
			sData += '&streetsuburb=' + interfaceMasterFormatSave($('#inputInterfaceMainContactStreetSuburb').val());
			sData += '&streetstate=' + interfaceMasterFormatSave($('#inputInterfaceMainContactStreetState').val());
			sData += '&streetpostcode=' + interfaceMasterFormatSave($('#inputInterfaceMainContactStreetPostCode').val());
			sData += '&streetcountry=' + interfaceMasterFormatSave($('#inputInterfaceMainContactStreetCountry').val());
			sData += '&mailingaddress1=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingAddress1').val());
			sData += '&mailingsuburb=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingSuburb').val());
			sData += '&mailingstate=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingState').val());
			sData += '&mailingpostcode=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingPostCode').val());
			sData += '&mailingcountry=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingCountry').val());
			sData += '&phone=' + interfaceMasterFormatSave($('#inputInterfaceMainContactPhone').val());
			sData += '&mobile=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMobile').val());
			sData += '&email=' + interfaceMasterFormatSave($('#inputInterfaceMainContactEmail').val());
			sData += '&faxnumber=' + interfaceMasterFormatSave($('#inputInterfaceMainContactFax').val());
		}
		else
		{
			sData += '&firstname=' + interfaceMasterFormatSave(ns1blankspace.objectContextData.firstname);
			sData += '&surname=' + interfaceMasterFormatSave(ns1blankspace.objectContextData.surname);
			sData += '&mailingaddress1=' + interfaceMasterFormatSave(ns1blankspace.objectContextData.mailingaddress1);
			sData += '&mailingsuburb=' + interfaceMasterFormatSave(ns1blankspace.objectContextData.mailingsuburb);
			sData += '&mailingstate=' + interfaceMasterFormatSave(ns1blankspace.objectContextData.mailingstate);
			sData += '&mailingpostcode=' + interfaceMasterFormatSave(ns1blankspace.objectContextData.mailingpostcode);
			sData += '&mailingcountry=' + interfaceMasterFormatSave(ns1blankspace.objectContextData.mailingcountry);
			sData += '&phone=' + interfaceMasterFormatSave(ns1blankspace.objectContextData.phone);
			sData += '&mobile=' + interfaceMasterFormatSave(ns1blankspace.objectContextData.mobile);
			sData += '&email=' + interfaceMasterFormatSave(ns1blankspace.objectContextData.email);
		}
		sData += '&customerstatus=' + ns1blankspace.objectStatusProspect;
		
		if (iContactPerson != '')	
		{
			sData += '&idt=' + iContactPerson;
			sSuccessMessage = 'updated';
		}
		else {sSuccessMessage = 'added'}
		
		interfaceMasterSave('/ondemand/contact/?' + sParam, sData, 'Prospect Contact ' + sSuccessMessage + '!');
		if (glObjectSaveId != -1)
		{
			sReturn = glObjectSaveId;
			interfaceMasterSave('/ondemand/opportunity/?method=OPPORTUNITY_MANAGE'
								, '&select=' + ns1blankspace.objectContext + 
								  '&requestbyperson=' + sReturn +
								  '&updatecontactid=1'
								, '' );
		}

	}

	if (sReturn != -1)
	{	interfaceOpportunitySearch('opportunity-' + ns1blankspace.objectContext);	}
	
}

function interfaceOpportunityViewProspect(asId)
{
	interfaceProspectMasterViewport();
	interfaceProspectSearch('prospectid-' + asId);
	
}

function interfaceOpportunityChangeProcessingStatus()
{

	var dDate = new Date();
	var dToday;
	dToday= dDate.format('d mmm yyyy');
	
	$('#interfaceMainDetailsProcessingStatusUpdate').show();
	$('#inputInterfaceMainDetailsNewProcessingDate').val(dToday);
	
	$('#tdInterfaceMainDetailsProcessingStatusButtonLabel').html('Cancel');
	$('#tdInterfaceMainDetailsProcessingStatusButtonLabel').bind('click', function() {
		interfaceOpportunityCancelOpportunityStatusUpdate();	
	});
	
	$('.interfaceMainOptionsSelectProcessingStatus').button( {
		text: false,
		icons: {
			primary: "ui-icon-circle-cancel"
		}
	})
	.click(function() {
		interfaceOpportunityCancelProcessingStatusUpdate();
	})
	.css('width', '15px')
	.css('height', '16px')
}

function interfaceOpportunityCancelProcessingStatusUpdate()
{
	$('#interfaceMainDetailsProcessingStatusUpdate').hide();

	$('#inputInterfaceMainDetailsNewProcessing').val('');
	$('#inputInterfaceMainDetailsNewProcessing').attr('onDemandID','');
	$('#inputInterfaceMainDetailsNewProcessingDate').val('');
	$('#inputInterfaceMainDetailsNewProcessingNote').val('');

	$('#tdInterfaceMainDetailsProcessingStatusButtonLabel').html('Update');
	$('#tdInterfaceMainDetailsProcessingStatusButtonLabel').bind('click', function() {
		 interfaceOpportunityChangeProcessingStatus();
	});
	
	$('.interfaceMainOptionsSelectProcessingStatus').button( {
		text: false,
		icons: {
			primary: "ui-icon-circle-plus"
		}
	})
	.click(function() {
		interfaceOpportunityChangeProcessingStatus();
	})
	.css('width', '15px')
	.css('height', '16px')
}

function GetCurrentContactStatus(oResponse, asContactType, aiContactId)
{
	if (oResponse == undefined) {oResponse = '';}
	if (asContactType == undefined) { asContactType = '';}
	if (aiContactId == undefined) {aiContactId = -1;}
	
	if (oResponse == '' || oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'CONTACT_' + asContactType.toUpperCase() + '_SEARCH';
		oSearch.addField( 'customerstatus');
		oSearch.addFilter('id', 'EQUAL_TO', aiContactId);
		oSearch.rf = 'json';
		oSearch.getResults(GetCurrentContactStatus) 
	}
	else
	{	
		if (oResponse.data.rows.length == 0)
		{
			giCurrentObjectStatus = oResponse.data.rows[0].customerstatus;
		}
		else
		{	giCurrentObjectStatus = -1;	}	
	}	
}

function interfaceOpportuntityProcessingStatus(aParam)
{

	var sFind;
	var iFind = -1;
	
	if (aParam != undefined)
	{
		if (aParam.find != undefined) {sFind = aParam.find}
	}	

	if (gaOpportuntityProcessingStatus == undefined)
	{
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?method=SETUP_OPPORTUNITY_PROCESSING_STATUS_SEARCH&rf=JSON',
			dataType: 'json',
			async: false,
			success: function(oJSON) {gaOpportuntityProcessingStatus = oJSON.data.rows}
		})
	}

	if (sFind != undefined)
	{
		$.each(gaOpportuntityProcessingStatus, function() {
			if (sFind.toUpperCase() == (this.title).toUpperCase()) {iFind = parseInt(this.id); return false}
		});
	}

	return iFind;
}
