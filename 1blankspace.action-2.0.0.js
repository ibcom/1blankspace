/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
if (ns1blankspace.action === undefined) {ns1blankspace.action = {}}

ns1blankspace.action.today = new Date();
ns1blankspace.action.currentMonth = (ns1blankspace.action.today).getMonth() + 1;
ns1blankspace.action.currentYear = (ns1blankspace.action.today).getFullYear();
ns1blankspace.action.contactperson;
ns1blankspace.action.contactbusiness;
ns1blankspace.action.contactpersontext;
ns1blankspace.action.contactbusinesstext;
ns1blankspace.action.calendarUsers = [];
ns1blankspace.action.user;
ns1blankspace.action.calendarParam = '';

ns1blankspace.data.actionType = {meeting: 3, fileNote: 4, emailSent: 5, emailReceived: 9};

function interfaceActionMasterViewport(oParam)
{
	ns1blankspace.objectContext = -1;
	ns1blankspace.object = 17;	
	ns1blankspace.objectName = 'Action';
	ns1blankspace.objectContextData = undefined;
	ns1blankspace.objectContext = -1;

	var bShowHome = true
	var bNew = false
	
	ns1blankspace.action.user = gsUserID;
	
	if (oParam != undefined)
	{
		if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
		if (oParam.showNew != undefined) {bNew = oParam.showNew}
		if (oParam.contactPerson != undefined) {ns1blankspace.action.contactperson = oParam.contactPerson}
		if (oParam.contactBusiness != undefined) {ns1blankspace.action.contactbusiness = oParam.contactBusiness}
		if (oParam.contactPersonText != undefined) {ns1blankspace.action.contactpersontext = oParam.contactPersonText}
		if (oParam.contactBusinessText != undefined) {ns1blankspace.action.contactbusinesstext = oParam.contactBusinessText}
	}
	
	ns1blankspaceReset();		
		
	if (bShowHome)
	{
		ns1blankspaceViewportDestination({
			newDestination: 'interfaceActionMasterViewport({showHome: true});',
			move: false
			})		
	}
		
	$('#divns1blankspaceViewportControlSet').button(
	{
		label: "Actions"
	});
	
	$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceActionSearch('inputns1blankspaceViewportControlSearch')", ns1blankspace.option.typingWait);
	});
	
	$('#spanns1blankspaceViewportControlSearch').click(function(event)
	{
		interfaceActionSearch('inputns1blankspaceViewportControlSearch');
	});
	
	$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
	{
		interfaceActionSearchOptions();
	});
	
	$('#spanns1blankspaceViewportControlNew').click(function(event)
	{
		interfaceActionNew();
	})
	
	$('#spanns1blankspaceViewportControlNewOptions').click(function(event)
	{
		interfaceActionNewOptions();
	});
	
	$('#spanns1blankspaceViewportControlAction').click(function(event)
	{
		interfaceActionSave();
	});
	
	$('#spanns1blankspaceViewportControlActionOptions').click(function(event)
	{
		interfaceActionSaveOptions();
	});
	
	$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
	
	$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
	{
		interfaceActionSetupOptions();
	});
	
	$('#spanns1blankspaceViewportControlHelp').click(function(event)
	{
		interfaceActionHelp();
	});
	
	$('#spanns1blankspaceViewportControlHelpOptions').click(function(event)
	{
		interfaceActionHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceActionSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceActionSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	$('#divInterfaceViewportControl').html('');	
	if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
	if (bNew)
	{
		interfaceActionNew()
	}
	else
	{
		if (bShowHome) {interfaceActionHomeShow(oParam)};
	}
}

function interfaceActionHomeShow(oParam)
{
	var bCalendar = false;
	
	if (oParam != undefined)
	{
		if (oParam.calendar != undefined) {bCalendar = oParam.calendar}
	}	
	
	$('#divInterfaceMain').html(ns1blankspace.xhtml.loading);
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<table>';

	aHTML[++h] = '<tr>' +
					'<td id="ns1blankspaceViewportActionLarge" class="ns1blankspaceViewportImageLarge">' +
					'&nbsp;' + 
					'</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlNext10" class="interfaceViewportControl">Next 10</td>' +
					'</tr>';		

	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlCalendar" class="interfaceViewportControl">Calendar</td>' +
					'</tr>';

	
	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<div id="divInterfaceMainCalendar" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainNext10" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlCalendar').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainCalendar");
		interfaceActionCalendar();
	});
	
	$('#tdInterfaceViewportControlNext10').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainNext10");
		interfaceActionNext10();
	});
	
	$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
	
	if (bCalendar)
	{
		$('#tdInterfaceViewportControlCalendar').addClass('interfaceViewportControlHighlight');
		interfaceActionCalendar();
	}
	else
	{
		$('#tdInterfaceViewportControlNext10').addClass('interfaceViewportControlHighlight');
		interfaceActionNext10();
	}	

}

function interfaceActionSearch(sXHTMLElementId, oParam)
{
	
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	var iMinimumLength = 3;
	var iSource = ns1blankspace.data.searchSource.text;
	var sSearchText;
	var iMaximumColumns = 1;
	var iRows = 10;
	
	if (oParam != undefined)
	{
		if (oParam.source != undefined) {iSource = oParam.source}
		if (oParam.searchText != undefined) {sSearchText = oParam.searchText}
		if (oParam.rows != undefined) {iRows = oParam.rows}
		if (oParam.searchContext != undefined) {sSearchContext = oParam.searchContext}
		if (oParam.minimumLength != undefined) {iMinimumLength = oParam.minimumLength}
		if (oParam.maximumColumns != undefined) {iMaximumColumns = oParam.maximumColumns}
	}
	
	if (sSearchContext != undefined  && iSource != ns1blankspace.data.searchSource.browse)
	{
	
		$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
		
		ns1blankspace.objectContext = sSearchContext;
		
		var sParam = 'method=ACTION_SEARCH' +
								 '&id=' + ns1blankspace.objectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/action/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceActionShow(oParam, data)}
		});
	}
	else
	{
		if (sSearchText == undefined)
		{
			sSearchText = $('#inputns1blankspaceViewportControlSearch').val();
		}	
		
		if (iSource == ns1blankspace.data.searchSource.browse)
		{
			iMinimumLength = 1;
			iMaximumColumns = 4;
			sSearchText = aSearch[1];
			if (sSearchText == '#') {sSearchText = '[0-9]'}
			sElementId = 'tableInterfaceViewportMasterBrowse';
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
		{
			ns1blankspaceOptionsSetPosition(sElementId);
			ns1blankspaceSearchStart(sElementId);
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'ACTION_SEARCH';
			oSearch.addField('subject');
			oSearch.rf = 'json';
			oSearch.addFilter('quicksearch', 'EQUAL_TO', sSearchText);	
			oSearch.getResults(function(data) {interfaceActionSearchShow(oParam, data)});
		}
	}	
}

function interfaceActionSearchShow(oParam, oResponse)
{
	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	if (oResponse.data.rows.length == 0)
	{
		ns1blankspaceSearchStop();
		$('#divns1blankspaceViewportControlOptions').hide();
	}
	else
	{
		aHTML[++h] = '<table border="0" class="interfaceSearchMedium">';
		aHTML[++h] = '<tbody>'
			
		$.each(oResponse.data.rows, function()
		{
			iColumn = iColumn + 1;
			
			if (iColumn == 1)
			{
				aHTML[++h] = '<tr class="interfaceSearch">';
			}
			
			aHTML[++h] = '<td class="interfaceSearch" id="' +
							'-' + this.id + '">' +
							this.subject + '</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		});
    	
		aHTML[++h] = '</tbody></table>';

		$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
		$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		
		ns1blankspaceSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
			$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
			interfaceActionSearch(event.target.id, 1);
		});
	}	
}

function interfaceActionNew()
{
	ns1blankspace.objectContextData = undefined
	ns1blankspace.objectContext = -1;
	interfaceActionMasterViewport();
	ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
	$('#spanns1blankspaceViewportControlAction').button({disabled: false});
	interfaceActionDetails();
}

function interfaceActionViewport()
{	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (ns1blankspace.objectContext != -1)
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
					'</tr>';
							
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportControl3" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDescription" class="interfaceViewportControl">Description</td>' +
					'</tr>';				

		aHTML[++h] = '<tr id="trInterfaceViewportControl3" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDescriptionExtended" class="interfaceViewportControl">Message</td>' +
					'</tr>';	
					
		aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="interfaceMessaging" ' +
							' class="interfaceViewportControl interfaceViewportControlSub">' +
							'&nbsp;' +
							'</td>' +
					'</tr>';		
					
		aHTML[++h] = '</table>';			
					
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
						
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
					'</tr>';
	}
	else
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
					'</tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportControl3" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDescription" class="interfaceViewportControl">Description</td>' +
					'</tr>';					
	}
				
	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDescription" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDescriptionExtended" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
		
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
		interfaceActionSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
		interfaceActionDetails();
	});
	
	$('#tdInterfaceViewportControlDescription').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainDescription");
		interfaceActionDescription();
	});
	
	$('#tdInterfaceViewportControlDescriptionExtended').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainDescriptionExtended");
		interfaceMessagingActionSearch({
			xhtmlElementID: '-' + ns1blankspace.objectContext,
			targetXHTMLElementID: 'divInterfaceMainDescriptionExtended',
			setContext: false
			})
	});
	
	$('#tdInterfaceViewportControlAttachments').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainAttachments", true);
		ns1blankspaceAttachments({xhtmlElementID: 'divInterfaceMainAttachments'});
	});
}

function interfaceActionShow(oParam, oResponse)
{
	$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
	interfaceActionViewport();
		
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		ns1blankspace.objectContextData = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find action.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		ns1blankspace.objectContextData = oResponse.data.rows[0];
				
		$('#divInterfaceViewportControlContext').html(onDemandXMLGetData(oRow, 'subject'));
		
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		var iMessageActionID;
		
		if (ns1blankspace.objectContextData.type == ns1blankspace.data.actionType.emailSent || ns1blankspace.objectContextData.type == ns1blankspace.data.actionType.emailReceived)
				{iMessageActionID = ns1blankspace.objectContextData.id}
		
		if (ns1blankspace.objectContextData.type == ns1blankspace.data.actionType.fileNote && ns1blankspace.objectContextData.object == 17)
				{iMessageActionID = ns1blankspace.objectContextData.objectcontext}
				
		if (iMessageActionID != undefined)
		{
			
			interfaceMessagingMasterViewport({autoShow: false});
			interfaceMessagingActionSearch({
				xhtmlElementID: '-' + iMessageActionID
				})	
		}
		else
		{
			ns1blankspaceViewportDestination({
				newDestination: 'interfaceActionMasterViewport({showHome: false});interfaceActionSearch("-' + ns1blankspace.objectContext + '")',
				move: false
			})
			
			$('#tdInterfaceViewportControlDescriptionExtended').hide();
			$('#tdInterfaceViewportControlDescription').show();
			$('#spanns1blankspaceViewportControlAction').button({disabled: false});
			$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});
			
		}
		
		if (ns1blankspace.objectContext != -1) {interfaceActionSummary()}
	}	
}		
		
function interfaceActionSummary()
{

	var aHTML = [];
	var h = -1;
	
	if (ns1blankspace.objectContextData == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find action.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
	
		if (ns1blankspace.objectContextData.contactbusinesstext != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryContactBusiness" class="interfaceMainSummary">Business</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryContactBusinessValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.contactbusinesstext + 
						'</td>' +
						'</tr>';
		}			
	
		if (ns1blankspace.objectContextData.contactpersontext != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryContactPerson" class="interfaceMainSummary">Person</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryContactPersonValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.contactpersonfirstname + ' ' + ns1blankspace.objectContextData.contactpersonsurname +
						'</td>' +
						'</tr>';
		}				
			
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDate" class="interfaceMainSummary">Date</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDateValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.actiondate +
						'</td></tr>';
	
		var sDate = new Date(ns1blankspace.objectContextData.actiondatetime);
	
		if ($.fullCalendar.formatDate(sDate, 'H') != '0' && $.fullCalendar.formatDate(sDate, 'm') != '0')
		{
		
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTime" class="interfaceMainSummary">Time</td></tr>' +
							'<tr><td id="tdInterfaceMainSummaryTimeValue" class="interfaceMainSummaryValue">' +
							$.fullCalendar.formatDate(sDate, 'h:mm TT') +
							'</td>' +
							'</tr>';
		}					
		
		if (ns1blankspace.objectContextData.typetext != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryType" class="interfaceMainSummary">Type</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryTypeValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.typetext +
						'</td>' +
						'</tr>';
		}		
		
		if (ns1blankspace.objectContextData.statustext != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryStatus" class="interfaceMainSummary">Status</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryStatusValue" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.statustext + 
						'</td>' +
						'</tr>';
		}	
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2">';
		
		//aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryMarkComplete" class="interfaceMainSummaryAction">' +
		//				'<a class="interfaceMainSummary" href="#" id="aInterfaceMainSummaryMarkComplete">Mark as complete</a>' +
		//				'</td></tr>';
								
		aHTML[++h] = '</table>';					
		
		//$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));
		
	}	
}

function interfaceActionDetails()
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
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSubject" class="interfaceMain">' +
							'<td id="tdInterfaceMainDetailsSubject" class="interfaceMain">' +
							'Subject' +
							'</td></tr>' +
							'<tr id="trInterfaceMainDetailsSubjectValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainDetailsSubjectValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainDetailsSubject" class="inputInterfaceMainText">' +
							'</td></tr>';			
			
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDate" class="interfaceMain">' +
							'<td id="tdInterfaceMainDetailsDate" class="interfaceMain">' +
							'Date' +
							'</td></tr>' +
							'<tr id="trInterfaceMainDetailsDateValue" class="interfaceMainDate">' +
							'<td id="tdInterfaceMainDetailsDateValue" class="interfaceMainDate">' +
							'<input id="inputInterfaceMainDetailsDate" class="inputInterfaceMainDate">' +
							'</td></tr>';				
			
		aHTML[++h] = '<tr id="trInterfaceMainDetailsType" class="interfaceMain">' +
							'<td id="tdInterfaceMainDetailsType" class="interfaceMain">' +
							'Type' +
							'</td></tr>' +
							'<tr id="trInterfaceMainDetailsTypeValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceMainDetailsTypeValue" class="interfaceMainSelect">' +
							'<input id="inputInterfaceMainDetailsType" class="inputInterfaceMainSelect"' +
								' onDemandMethod="/ondemand/setup/?rf=XML&method=SETUP_ACTION_TYPE_SEARCH">' +
							'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsTaskBy" class="interfaceMain">' +
							'<td id="tdInterfaceMainDetailsTaskBy" class="interfaceMain">' +
							'Action By' +
							'</td></tr>' +
							'<tr id="trInterfaceMainDetailsTaskByValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceMainDetailsTaskByValue" class="interfaceMainSelect">' +
							'<input id="inputInterfaceMainDetailsActionBy" class="inputInterfaceMainSelect"' +
								' onDemandMethod="/ondemand/core/?method=CORE_USER_SEARCH&rf=XML" onDemandColumns="firstname-space-surname">' +
							'</td></tr>';	
			
		aHTML[++h] = '<tr id="trInterfaceActionDetailsBusiness" class="interfaceMain">' +
							'<td id="tdInterfaceActionDetailsBusiness" class="interfaceMain">' +
							'Business' +
							'</td></tr>' +
							'<tr id="trInterfaceActionDetailsBusinessValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceActionDetailsBusinessValue" class="interfaceMainSelect">' +
							'<input onDemandType="SELECT" id="inputInterfaceMainDetailsBusiness" class="inputInterfaceMainSelect"' +
								' onDemandMethod="/ondemand/contact/?rf=XML&method=CONTACT_BUSINESS_SEARCH"' +
								' onDemandColumns="tradename">' +
							'</td></tr>';
							
		
		aHTML[++h] = '<tr id="trInterfaceActionCalendarAddPerson" class="interfaceMain">' +
							'<td id="tdInterfaceActionCalendarAddPerson" class="interfaceMain">' +
							'Person' +
							'</td></tr>' +
							'<tr id="trInterfaceActionDetailsPersonValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceActionDetailsPersonValue" class="interfaceMainSelect">' +
							'<input onDemandType="SELECT" id="inputInterfaceMainDetailsPerson" class="inputInterfaceMainSelectContact"' +
								' onDemandMethod="/ondemand/contact/?rf=XML&method=CONTACT_PERSON_SEARCH"' +
								' onDemandParent="inputInterfaceMainDetailsBusiness">' +
							'</td></tr>';										
			
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		$('input.inputInterfaceMainDate').datetimepicker({ 
			dateFormat: 'dd M yy',
			timeFormat: 'h:mm TT',
			stepMinute: 5,
			ampm: true
			});
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStatus" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStatus" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStatus" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsStatusValue" class="interfaceMainText">' +
						'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Not Started' +
						'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>In Progress' +
						'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Cancelled' +
						'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Completed' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (ns1blankspace.objectContextData != undefined)
		{
			$('#inputInterfaceMainDetailsSubject').val(ns1blankspace.objectContextData.reference);
			
			var sDate = new Date(ns1blankspace.objectContextData.actiondatetime);
			sDate = $.fullCalendar.formatDate(sDate, 'dd MMM yyyy h:mm TT')
			$('#inputInterfaceMainDetailsDate').val(sDate);
			
			$('#inputInterfaceMainDetailsType').attr("onDemandID", ns1blankspace.objectContextData.type);
			$('#inputInterfaceMainDetailsType').val(ns1blankspace.objectContextData.typetext);
			$('#inputInterfaceMainDetailsActionBy').attr("onDemandID", ns1blankspace.objectContextData.actionby);
			$('#inputInterfaceMainDetailsActionBy').val(ns1blankspace.objectContextData.actionbyfirstname + ' ' +
							ns1blankspace.objectContextData.actionbysurname);
			$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
			
			$('#inputInterfaceMainDetailsBusiness').attr("onDemandID", ns1blankspace.objectContextData.contactbusiness);
			$('#inputInterfaceMainDetailsBusiness').val(ns1blankspace.objectContextData.contactbusinesstext);
			
			$('#inputInterfaceMainDetailsPerson').attr("onDemandID", ns1blankspace.objectContextData.contactperson);
			$('#inputInterfaceMainDetailsPerson').val(ns1blankspace.objectContextData.contactpersonfirstname + 
					' ' + ns1blankspace.objectContextData.contactpersonsurname);
		}
		else
		{
			$('[name="radioStatus"][value="1"]').attr('checked', true);
			
			if (ns1blankspace.action.contactbusiness != undefined)
			{$('#inputInterfaceMainDetailsBusiness').attr("onDemandID", ns1blankspace.action.contactbusiness);}
			
			if (ns1blankspace.action.contactbusinesstext != undefined)
			{$('#inputInterfaceMainDetailsBusiness').val(ns1blankspace.action.contactbusinesstext);}
			
			if (ns1blankspace.action.contactperson != undefined)
			{$('#inputInterfaceMainDetailsPerson').attr("onDemandID", ns1blankspace.action.contactperson);}
			
			if (ns1blankspace.action.contactpersontext != undefined)
			{$('#inputInterfaceMainDetailsPerson').val(ns1blankspace.action.contactpersontext);}
		}
		
		$('#inputInterfaceMainDetailsStatus').keyup(function(event)
		{
			$('#divns1blankspaceViewportControlOptions').hide(200);
			ns1blankspaceElementOptionsSearch(event.target.id);
		});
		
	}	
}

function interfaceActionDescription()
{
	
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainDescription').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainDescription').attr('onDemandLoading', '');
				
		aHTML[++h] = '<table id="tableInterfaceMainDescription" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainDescriptionRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainDescriptionColumn1" class="interfaceMainColumn1Large">' +
						'</td>' +
						'<td id="tdInterfaceMainDescriptionColumn2" class="interfaceMain">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainDescription').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainDescriptionColumn1" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainDescriptionValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDescriptionValue" class="interfaceMainTextMulti">' +
						'<textarea rows="30" cols="50" onDemandType="TEXTMULTI" id="inputInterfaceMainDescription" class="inputInterfaceMainTextMulti inputInterfaceMainTextMultiLarge"></textarea>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDescriptionColumn1').html(aHTML.join(''));
		
		if (ns1blankspace.objectContextData != undefined)
		{
			$('#inputInterfaceMainDescription').val(unescape(ns1blankspace.objectContextData.description));
		}
	}	
}

function interfaceActionNext10()
{
	var aHTML = [];
	var h = -1;	
				
	aHTML[++h] = '<table id="tableInterfaceMainNext10" class="interfaceMain">' +
					'<tr id="trInterfaceMainNext10Row1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainNext10Column1">' +
					ns1blankspace.xhtml.loading +
					'</td>' +
					'</tr>' +
					'</table>';					
			
	$('#divInterfaceMainNext10').html(aHTML.join(''));
	
	interfaceActionNextSummary({xhtmlElement: 'tdInterfaceMainNext10Column1'});
	
}	
	
function interfaceActionsList(sElementId, iObject, lObjectContext, bAll, sActionType)
{

	if (iObject == undefined) {iObject = ns1blankspace.object};
	if (lObjectContext == undefined) {lObjectContext = ns1blankspace.objectContext};
	if (sElementId == undefined) {sElementId = "divns1blankspaceViewportControlOptions"};
	if (bAll == undefined) {bAll = false};
	if (sActionType == undefined) {sActionType = ''};

	if (lObjectContext != -1)
	{
		var sParam = 'method=ACTION_SEARCH';
		
		if (bAll && (iObject == 32 || iObject == 12))
		{
			if (iObject == 32)
			{
				sParam = sParam + '&contactperson=' + lObjectContext;
			}	
			else if (iObject == 12)
			{
				sParam = sParam + '&contactbusiness=' + lObjectContext;
			}	
		}
		else
		{
			sParam += '&object=' + iObject;
			sParam += '&objectcontext=' + lObjectContext;
		}	
		
		switch (sActionType)
		{
		case gsActionTypeFileNote:
			sParam += '&type=4';
			break;
		
		case gsActionTypeCorrespondence:
			sParam += '&type=5-9-10';
			// Email Sent, Email Received, SMS Sent
			break;
		
		case gsActionTypeAppointment:
			sParam += '&type=' + giActionTypeAudit;
			// Audit 
			break;
		
		default:
			sParam = sParam;
		}
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/action/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceActionsListShow(data, sElementId, sActionType)}
		});
	}

}

function interfaceActionsListShow(oResponse, sElementId, sActionType)
{	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		aHTML[++h] = '<table class="interfaceMain">';
		aHTML[++h] = '<tbody>'
		aHTML[++h] = '<tr class="interfaceActions">';
		aHTML[++h] = '<td class="interfaceMainRowNothing">No ' + sActionType + '.</td>';
		aHTML[++h] = '</tr>';
		
		$('#' + sElementId).html(aHTML.join(''));
		$('#' + sElementId).show(ns1blankspace.option.showSpeed);
	}
	else
	{
		
		aHTML[++h] = '<table class="interfaceMain">';
		aHTML[++h] = '<tbody>'
	
		aHTML[++h] = '<tr class="interfaceMainCaption">';
		switch (sActionType)
		{
		case gsActionTypeFileNote:
			aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Description</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Who</td>';
			break;

		case gsActionTypeCorrespondence:
			aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Subject</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Description</td>';
			break;
			
		case gsActionTypeAppointment:
			aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Type</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Who</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Hours</td>';
			break;

		default:
			aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Time</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Subject</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Description</td>';

		}
		aHTML[++h] = '</tr>';

		$.each(oResponse.data.rows, function()
		{
			
			aHTML[++h] = '<tr class="interfaceActions">';
			switch (sActionType)
			{
			case gsActionTypeFileNote:
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-date-' + this.id + '" class="interfaceActions">' +
								this.actiondate + '</td>';
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-description-' + this.id + '" class="interfaceActions">' +
								this.description + '</td>';
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-actionby-' + this.id + '" class="interfaceActions">' +
								this.actionbyfirstname + ' ' + this.actionbysurname + '</td>';
				break;
			
			case gsActionTypeCorrespondence:
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-date-' + this.id + '" class="interfaceActions">' + this.actiondate + '</td>';
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-subject-' + this.id + '" class="interfaceActions">' + onDemandXMLGetData(oRow, "subject") + '</td>';
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-description-' + this.id + '" class="interfaceActions">' + this.description + '</td>';
				break;
			
			case gsActionTypeAppointment:
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-date-' + this.id + '" class="interfaceActions">' + this.actiondate + '</td>';
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-type-' + this.id + '" class="interfaceActions">' + this.typetext + '</td>';
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-actionby-' + this.id + '" class="interfaceActions">' + this.actionby + '</td>';
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-hours-' + this.id + '" class="interfaceActions">' + this.hours + '</td>';
				break;
			
			default:
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction_date-' + this.id + '" class="interfaceActions">' + this.actiondate + '</td>';
				
				var sDate = new Date(this.actiondatetime);
				
				if ($.fullCalendar.formatDate(sDate, 'H') != '0' && $.fullCalendar.formatDate(sDate, 'm') != '0')
				{
					sDate = $.fullCalendar.formatDate(sDate, 'h:mm TT')
					aHTML[++h] = '<td class="interfaceMainRow" id="tdAction_time-' + this.id + '" class="interfaceActions">' + sDate + '</td>';
				}
				
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-subject-' + this.id + '" class="interfaceActions">' + this.subject + '</td>';
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-description-' + this.id + '" class="interfaceActions">' + this.description + '</td>';
			}

			aHTML[++h] = '<td class="interfaceMainRowOptions" id="tdAction-options-' + this.id + '" class="interfaceActionsOptions">&nbsp;</td>';
			aHTML[++h] = '</tr>'
		});
    	
		aHTML[++h] = '</tbody></table>';

		$('#' + sElementId).html(aHTML.join(''));
		$('#' + sElementId).show(ns1blankspace.option.showSpeed);
		
		$('td.interfaceActions').click(function(event)
		{
			ns1blankspaceElementEditStart(event.target.id);
		});
			
	}
	
}

function interfaceActionsAddNote(iObject, iObjectContext)
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMainAddNote">';
	
	aHTML[++h] = '<tr><td id="tdInterfaceMainAddNoteDescription" class="interfaceMain">' +
						'Note<td></tr>' +
						'<tr><td id="tdInterfaceMainAddNoteDescriptionValue" class="interfaceMain">' +
						'<textarea rows="10" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMainAddNoteDescription" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
						
	aHTML[++h] = '<tr><td id="tdInterfaceMainAddNoteStatus" class="interfaceMain">' +
						'<input type="checkbox" id="inputInterfaceMainAddNoteStatus"/>&nbsp;Status Note?<td></tr>';

	aHTML[++h] = '<tr><td id="tdInterfaceMainAddNoteHighPriority" class="interfaceMain">' +
						'<input type="checkbox" id="inputInterfaceMainAddNoteHighPriority"/>&nbsp;High Priority?<td></tr>';
						
	aHTML[++h] = '</table>';						
	
	$('#divInterfaceDialog').html(aHTML.join(''));
	
	$('#divInterfaceDialog').dialog(
		{
			width: 300,
			resizable: false,
			modal: true,
			title: 'Add Note',
			buttons: 
			{
				"Cancel": function() 
				{
					$( this ).dialog( "close" );
				},
				"Add Note": function() 
				{
					interfaceActionQuickSave({
						reference: '',
						description: $('#inputInterfaceMainAddNoteDescription').val(),
						type: ($('#inputInterfaceMainAddNoteStatus').attr('checked')?ns1blankspace.data.actionType.fileNote:ns1blankspace.data.actionType.fileNote),
						priority: ($('#inputInterfaceMainAddNoteHighPriority').attr('checked')?3:2)
						});
					$( this ).dialog( "close" );
					
				}
			}
		});
}

function interfaceActionSave(oParam, oResponse)
{
	var sData = '';
	var iType = ns1blankspace.data.actionType.meeting;
	
	if (oResponse == undefined)
	{
		if (oParam != undefined)
		{
			if (oParam.type != undefined) {iType = oParam.type}
			if (oParam.object == undefined) {oParam.object = ns1blankspace.object}
			if (oParam.objectContext == undefined) {oParam.objectContext = ns1blankspace.objectContext}

			sData += 'object=' + ns1blankspacens1blankspace.util.fs(oParam.object);
			sData += '&objectcontext=' + ns1blankspacens1blankspace.util.fs(oParam.objectContext);
			sData += '&subject=' + ns1blankspacens1blankspace.util.fs(oParam.subject);
			sData += '&description=' + ns1blankspacens1blankspace.util.fs(oParam.description);
			sData += '&priority=' + ns1blankspacens1blankspace.util.fs(oParam.description);
			sData += '&status=' + ns1blankspacens1blankspace.util.fs(oParam.status);
			sData += '&type=' + ns1blankspacens1blankspace.util.fs(iType);
			sData += '&date=' + ns1blankspacens1blankspace.util.fs(oParam.date);
			sData += '&enddate=' + ns1blankspacens1blankspace.util.fs(oParam.endDate);
			sData += '&actionby=' + ns1blankspacens1blankspace.util.fs(oParam.actionBy);
			sData += '&contactbusiness=' + ns1blankspacens1blankspace.util.fs(oParam.contactBusiness);
			sData += '&contactperson=' + ns1blankspacens1blankspace.util.fs(oParam.contactPerson);
			
			sData += (oParam.otherData==undefined?'':oParam.otherData)
		}	
		else	  
		{
			if (ns1blankspace.objectContext != -1)
			{
				sData += 'id=' + ns1blankspace.objectContext;
			}
			else
			{
				sData += 'id=';
			}
			
			if ($('#divInterfaceMainDetails').html() != '')
			{
				sData += '&subject=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsSubject').val());
				sData += '&priority=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsPriority').attr('onDemandID'));				
				sData += '&type=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsType').attr('onDemandID'));
				sData += '&date=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsDate').val());
				sData += '&contactbusiness=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsBusiness').attr("onDemandID"));
				sData += '&contactperson=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsPerson').attr("onDemandID"));
				sData += '&actionby=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsActionBy').attr("onDemandID"));
				sData += '&status=' + $('input[name="radioStatus"]:checked').val();
				
			}
			
			if ($('#divInterfaceMainDescription').html() != '')
			{
				sData += '&description=' + ns1blankspacens1blankspace.util.fs($('#inputInterfaceMainDescription').val());
			}
		}
		  
		$.ajax(
		{
			type: 'POST',
			url: ns1blankspaceEndpointURL('ACTION_MANAGE'),
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceActionSave(oParam, data);}
		});
	}	
	else
	{

		if (oResponse.status == 'OK')
		{
			ns1blankspaceStatus('Saved');
			ns1blankspace.objectContext = oResponse.id;	
		
			var dStartDate = new Date;
			var dEndDate = dStartDate;
			var sTitle = '';
			var sCalendarXHTMLElementID;
			
			if (oParam != undefined)
			{
				if (oParam.date != undefined) {sStartDate = oParam.date}
				if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
				if (oParam.title != undefined) {sTitle = oParam.title}
				if (oParam.calendarXHTMLElementID != undefined) {sCalendarXHTMLElementID = oParam.calendarXHTMLElementID}
			}	
		
			if (sCalendarXHTMLElementID != undefined)
			{
			
				$('#' + sCalendarXHTMLElementID).fullCalendar('renderEvent',
				{
					id: ns1blankspace.objectContext,
					title: sTitle,
					start: sStartDate, 
					end: sEndDate, 
					allDay: false},
					true
				);
			}
			
			ns1blankspace.inputDetected = false;
			interfaceActionSearch('-' + ns1blankspace.objectContext, {source: 1});
		
		}
		else
		{
			ns1blankspaceStatus(oResponse.error.errornotes);
			ns1blankspaceConfirm( {html: [oResponse.error.errornotes]
									   , title: 'Save error!'});
		}
	}
	
}

function interfaceActionsSummaryActions(sElementId, iObject, iObjectContext)
{

	var sParam = '/ondemand/action/?method=ACTION_SEARCH' +
								 '&rf=xml' +
								 '&type=' + ns1blankspace.data.actionType.fileNote +
								 '&status=' + giActionStatusInProgress;

	if (iObject != undefined && iObjectContext != undefined)
	{
		sParam += '&object='+ iObject +
				  '&objectcontext='+ iObjectContext;
				  
		$.ajax(
		{
			type: 'GET',
			url: sParam,
			dataType: 'json',
			success: function(data) {interfaceActionsSummaryActionsShow(data, sElementId)}
		});
	}
	
}

function interfaceActionsSummaryActionsShow(oResponse, asElementId)
{
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length > 0)
	{
		aHTML[++h] = '<table class="interfaceMain">';
		aHTML[++h] = '<tbody>'
	
		$.each(oResponse.data.rows, function()
		{
			aHTML[++h] = '<tr class="interfaceActions">';
			aHTML[++h] = '<td class="interfaceMainRow';
			
			if (this.status == giActionStatusInProgress) 
				{ aHTML[++h] = ' interfaceImportant'; }
				
			aHTML[++h] = '" id="tdAction-date-' + this.id + '" class="interfaceActions">' + this.actiondate + '</td>';
			aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-description-' + this.id + '" class="interfaceActions">' + this.description + '</td>';
			aHTML[++h] = '</tr>';
		});
		
		aHTML[++h] = '</tbody><table>';

		$('#'+ asElementId).html(aHTML.join(''));
	}
	
}

function interfaceActionCalendar(oParam)
{
			
	var sXHTMLElementID = 'divInterfaceMainCalendar';		
	var bEventFetch = true;
	var iSourceObject = 17;
	
	if (oParam != undefined)
	{
		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		if (oParam.eventFetch != undefined) {bEventFetch = oParam.eventFetch}
		if (oParam.sourceObject != undefined) {iSourceObject = oParam.sourceObject}
	}
	
	$('#' + sXHTMLElementID).html('');
	
	if (ns1blankspace.action.calendarUsers.length == 0 && bEventFetch)
	{
		if (ns1blankspace.action.user != undefined)
		{
			ns1blankspace.action.calendarUsers.push(ns1blankspace.action.user);
		}
		else
		{	
			ns1blankspace.action.calendarUsers.push(gsUserID);
		}	
	}	
	
	$('#divns1blankspaceViewportControlOptions').hide(0);
	
	$('#' + sXHTMLElementID).fullCalendar({
		theme: true,
		defaultView: 'agendaWeek',
		header: {
			left: 'prev,next',
			center: 'title',
			right: 'today month,agendaWeek,agendaDay'
		},
		
		titleFormat:
		{
			month: 'MMMM yyyy',
			week: "MMMM yyyy",
			day: 'MMMM yyyy'
		},

		timeFormat: 'h(:mm)tt',
		
		editable: true,
		firstHour: 7,
		minTime: 7,
		droppable: true,
		selectable: true,
		allDaySlot: false,				
		selectHelper: true,
		
		drop: function(date, allDay) 
			{ 

				var originalEventObject = $(this).data('eventObject');
				var copiedEventObject = $.extend({}, originalEventObject);

				copiedEventObject.start = date;
				copiedEventObject.allDay = allDay;
				
				giActionBookingContextID = copiedEventObject.id;
				giActionLastBookingContextID = copiedEventObject.id;

				interfaceActionCalendarAddShow({
						startDate: date
					});
				
			},	
		
		columnFormat: {	month: 'ddd',    
						week: 'ddd d/M', 
						day: 'dddd d/M'},
		
		select: function(startDate, endDate, allDay, jsEvent, view )
		{
			interfaceActionCalendarAddShow({
				startDate: startDate,
				endDate: endDate
			});
		},
		
		eventClick: function(calEvent, jsEvent, view) 
		{
			if (calEvent.editable)
			{
				interfaceActionCalendarAddShow(
					{
						actionID: calEvent.id,
					});
			};		
		},
		
		dayClick: function(date, allDay, jsEvent, view) 
		{
		    if (allDay) 
			{
				alert('Clicked on the entire day: ' + date);
			}
			else
			{
				
			}
		},
		
		eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc) 
		{
			if (event.sequence > 1 || event.hoursremaining > 0) 
			{
				alert('You can not drag a multi-day event. Click on the event and edit the date and time as required.');
				revertFunc();
			}
			else
			{
				var sParam = '/ondemand/action/?rf=JSON&method=ACTION_MANAGE';
				var sData = 'id=' + event.id;
				
				sData += '&actionby=' + event.user;
				sData += '&daydelta=' + ns1blankspace.util.fs(dayDelta);
				sData += '&minutedelta=' + ns1blankspace.util.fs(minuteDelta);
				
				$.ajax(
				{
					type: 'POST',
					url: sParam,
					data: sData,
					dataType: 'json',
					success: $('#divInterfaceMainCalendar').fullCalendar('refetchEvents')
				});
			}
		},
		
		eventMouseover: function( event, jsEvent, view ) 
		{
			ns1blankspaceStatus(event.contactBusinessText);
		},
		
		eventMouseout: function( event, jsEvent, view ) 
		{
			ns1blankspaceStatus('');
		},
		
		eventResize: function(event,dayDelta,minuteDelta,revertFunc) 
		{
			if (event.sequence > 1 || event.hoursremaining > 0) 
			{
				alert('You can not resize a multi-day event. Click on the event and edit the date and time as required.');
				revertFunc();
			}
			else
			{
				var sParam = '/ondemand/action/?rf=JSON&method=ACTION_MANAGE';
				var sData = 'id=' + event.id;
				
				sData += '&actionby=' + event.user;
				sData += '&enddaydelta=' + ns1blankspace.util.fs(dayDelta);
				sData += '&endminutedelta=' + ns1blankspace.util.fs(minuteDelta);
				
				$.ajax(
				{
					type: 'POST',
					url: sParam,
					data: sData,
					dataType: 'json',
				});
			}	
		},
		
		viewDisplay: function(view) 
		{
			interfaceActionCalendarUnavailableShow();	
		}
	});	
	
	$.each(ns1blankspace.action.calendarUsers, function() 
	{ 
		$('#' + sXHTMLElementID).fullCalendar('addEventSource', 
		{
			url: '/ondemand/action/?method=ACTION_CALENDAR_SEARCH' + ns1blankspace.action.calendarParam + '&rf=JSON&diary=1&usercolours=1&titleoption=1&actionby=' + this
		})
	});
	
}

function interfaceActionCalendarUnavailableShow()
{
	var aDays = [];
	var iStartHour = 0;
	var iEndHour = 24;
	var sNotAvailableDayClasses = aDays.join(' ')
	var bAvailable = true;

	if (ns1blankspace.action.calendarUsers.length > 0) 
	{ 
		var sParam = 'method=SETUP_USER_SEARCH&profile=445-446-447&users=' + ns1blankspace.action.calendarUsers.toString('-');
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?rf=XML&' + sParam,
			dataType: 'xml',
			success: function (data) 
			{
				$(data).find('profile445').each(function()
				{
					var aDaysTmp = ($(this).text()).split(',')
					
					$.each(aDaysTmp, function() 
					{
						if ($.inArray(this, aDays) == -1)
						{
							aDays.push(String(this))
						}	
					});	
				});

				$(data).find('profile446').each(function()
				{
					if (parseInt($(this).text()) > iStartHour) {iStartHour = parseInt($(this).text())}
				});
				
				$(data).find('profile447').each(function()
				{
					if (parseInt($(this).text()) < iEndHour) {iEndHour = parseInt($(this).text())}
				});

				$('td.ui-widget-content').each(function()
				{ 
					var aClass = ($(this).attr('class')).split(' ');
					
					bAvailable = true;				
					
					$.each(aClass, function() 
					{ 
						if ($.inArray((this).replace('fc-',''), aDays) != -1)
						{
							bAvailable = false;
						}	
					});
				 
					if (!bAvailable)
					{  
						$(this).css({ 'background':'none', 'background-color' : '#E0E0E0' });
					} 
				});  
 
				$('.fc-agenda-axis').each(function()
				{
					var sTime = $.trim(($(this).text()).toLowerCase());
					
					if (sTime != '')
					{
						bAvailable = true;	
						var sTimeHour = sTime;
						sTimeHour = sTimeHour.replace('am', '');
						sTimeHour = sTimeHour.replace('pm', '');
						var iTimeHour = parseInt(sTimeHour);
						if (sTime.indexOf('pm') > 0 && iTimeHour < 12) {iTimeHour += 12}
						if (iTimeHour < iStartHour) {bAvailable = false}
						if (iTimeHour >= iEndHour) {bAvailable = false}
					}
					
					if (!bAvailable)
					{
						$(this).parent().css('background-color','#E0E0E0');
					}	
				});
				
			}
		});
	}
}

function interfaceActionCalendarAddShow(oParam, oResponse)
{
	var iActionID = -1;
	var dStartDate = new Date();
	var dEndDate = dStartDate;
	
	if (oParam != undefined)
	{
		if (oParam.actionID != undefined) {iActionID = oParam.actionID};
		if (oParam.startDate != undefined) {dStartDate = oParam.startDate};
		if (oParam.endDate != undefined) {dEndDate = oParam.endDate};
	}	

	if (iActionID != -1 && oResponse == undefined)
	{
		sParam = 'method=ACTION_SEARCH&rf=json&select=' + iActionID;
	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/action/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceActionCalendarAddShow(oParam, data)}
		});	
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceActionCalendarAdd" class="interfaceDialogMedium">';
		
		aHTML[++h] = '<tr id="trInterfaceActionCalendarAddSubjectValue" class="interfaceMainText">' +
							'<td id="tdInterfaceActionCalendarAddSubjectValue" class="interfaceMainText">' +
							'<input onDemandType="TEXT" id="inputActionCalendarAddSubject" class="inputInterfaceMainText';
							
		if (iActionID == -1)
		{	
			aHTML[++h] = ' ns1blankspaceWatermark" value="Subject">';
		}
		else
		{
			aHTML[++h] = '">'
		}
		
		aHTML[++h] = '</td></tr>';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainAddNoteDescriptionValue" class="interfaceMain">' +
							'<textarea rows="5" cols="35" onDemandType="TEXTMULTI" id="inputActionCalendarAddDescription" class="inputInterfaceMainTextMultiSmall';

		if (iActionID == -1)
		{	
			aHTML[++h] = ' ns1blankspaceWatermark">Add more text here, if required.</textarea>';
		}
		else
		{
			aHTML[++h] = '"></textarea>'
		}

		aHTML[++h] = '</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceActionCalendarAddBusiness" class="interfaceMain">' +
							'<td id="tdInterfaceActionCalendarAddBusiness" class="interfaceMain">' +
							'Business' +
							'</td></tr>' +
							'<tr id="trInterfaceActionCalendarAddBusinessValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceActionCalendarAddBusinessValue" class="interfaceMainSelect">' +
							'<input onDemandType="SELECT" id="inputInterfaceActionCalendarAddBusiness" class="inputInterfaceMainSelect"' +
								' onDemandMethod="/ondemand/contact/?rf=XML&method=CONTACT_BUSINESS_SEARCH"' +
								' onDemandColumns="tradename">' +
							'</td></tr>';
							
		
		aHTML[++h] = '<tr id="trInterfaceActionCalendarAddPerson" class="interfaceMain">' +
							'<td id="tdInterfaceActionCalendarAddPerson" class="interfaceMain">' +
							'Person' +
							'</td></tr>' +
							'<tr id="trInterfaceActionCalendarAddPersonValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceActionCalendarAddPersonValue" class="interfaceMainSelect">' +
							'<input onDemandType="SELECT" id="inputInterfaceActionCalendarAddPerson" class="inputInterfaceMainSelectContact"' +
								' onDemandMethod="/ondemand/contact/?rf=XML&method=CONTACT_PERSON_SEARCH"' +
								' onDemandParent="InterfaceActionCalendarAddBusiness">' +
							'</td></tr>';									
							
							
		aHTML[++h] = '<tr><td id="tdInterfaceActionCalendarAddHighPriority" class="interfaceMain">' +
							'<input type="checkbox" id="inputInterfaceMainAddNoteHighPriority"/>&nbsp;High Priority?<td></tr>';
							
						
		aHTML[++h] = '<tr><td>';
		
			aHTML[++h] = '<table class="interfaceSearchFooterMedium">';
			
			aHTML[++h] = '<tr><td style="text-align: right;">' +
								'<span id="spanSave">Save</span>' +
								'<span id="spanCancel">Cancel</span>' +
								'<td></tr>';
			
			aHTML[++h] = '</table>';						

		aHTML[++h] = '</td></tr>';	
			
		aHTML[++h] = '</table>';		
		
		var oElement = $('#ns1blankspaceViewportActionLarge')
		
		$('#divns1blankspaceDialog').html('');
		$('#divns1blankspaceDialog').show();
		$('#divns1blankspaceDialog').offset({ top: $(oElement).offset().top + $(oElement).height() + 5, left: $(oElement).offset().left });
		$('#divns1blankspaceDialog').html(aHTML.join(''));
		
		$('#spanCancel').button(
			{
				text: false,
				 icons: {
					 primary: "ui-icon-close"
				}
			})
			.click(function() {
				$('#divns1blankspaceDialog').slideUp(500);
				$('#divns1blankspaceDialog').html('');
			})
			.css('width', '20px')
			.css('height', '20px')

		$('#spanSave').button(
			{
				text: false,
				 icons: {
					 primary: "ui-icon-check"
				}
			})
			.click(function() {
				interfaceActionQuickSave({
						id: iActionID,
						date: $.fullCalendar.formatDate(dStartDate, "dd MMM yyyy") + 
									' ' + $.fullCalendar.formatDate(dStartDate, "HH:mm"),
						endDate: $.fullCalendar.formatDate(dEndDate, "dd MMM yyyy") + 
									' ' + $.fullCalendar.formatDate(dEndDate, "HH:mm"),
						subject: $('#inputActionCalendarAddSubject').val(),
						description: $('#inputActionCalendarAddDescription').val(),
						priority: ($('#inputActionCalendarAddHighPriority').attr('checked')?3:2),
						calendarXHTMLElementID: 'divInterfaceMainCalendar'
						});
				
				$('#divns1blankspaceDialog').slideUp(500);
				$('#divns1blankspaceDialog').html('');

			})
			.css('width', '30px')
			.css('height', '20px')
		
		if (oResponse != undefined)
		{	
			if (oResponse.data.rows.length != 0)
			{	
				$('#inputActionCalendarAddSubject').val(oResponse.data.rows[0].subject);
				$('#inputActionCalendarAddDescription').val(oResponse.data.rows[0].description);
				
				//$('#inputInterfaceMainDetailsStatus').attr("onDemandID", oResponse.data.rows[0].customerstatus);
				//$('#inputInterfaceMainDetailsStatus').val(oResponse.data.rows[0].customerstatustext);
			}	
		}	
	}
}

function ns1blankspaceHomeCalendarAction(iActionId, sActionTitle)
{

	sParam = 'method=ACTION_SEARCH&contactperson=ALL&select=' + iActionId + '&rf=XML';
	
	$.ajax(
	{
		type: 'GET',
		url: '/directory/ondemand/object.asp?' + sParam,
		dataType: 'xml',
		success: ns1blankspaceHomeCalendarActionShow()
	});	

	$('#divns1blankspaceViewportControlOptions').html(ns1blankspace.xhtml.loading);
	
	$('#divns1blankspaceViewportControlOptions').dialog({
		title: sActionTitle,	
		modal: true,
		stack: false,
		draggable: false,
		resizeable: false
	});
}

function interfaceActionNextSummary(oParam, oResponse)
{	
	var sElementId = 'divInterfaceMain';
	
	if (oParam != undefined)
	{
		if (oParam.xhtmlElement != undefined)
		{
			sElementId = oParam.xhtmlElement;
		}	
	}	
	
	if (oResponse == undefined)
	{
	
		var sParam = 'method=ACTION_SEARCH';
		sParam += '&rows=10';
		sParam += '&future=1';
		sParam += '&actionby=' + gsUserID;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/action/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceActionNextSummary(oParam, data)}
		});
	
	}
	else
	{
		var aHTML = [];
		var h = -1;
	
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceActionSummary">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">Nothing scheduled.</td>';
			aHTML[++h] = '</tr>';
			
			$('#' + sElementId).html(aHTML.join(''));
			$('#' + sElementId).show(ns1blankspace.option.showSpeed);
			
		}
		else
		{
			
			aHTML[++h] = '<table>';
			aHTML[++h] = '<tbody>'

			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr>';
									
				aHTML[++h] = '<td class="interfaceMainRow interfaceRowSelect" id="tdAction_reference-' + this.id + '" >' +
									this.reference + '</td>';
				
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction_date-' + this.id + '" >' +
									this.actiondate + '</td>';
									
				var sDate = new Date(this.actiondatetime);
				
				if ($.fullCalendar.formatDate(sDate, 'H') != '0' && $.fullCalendar.formatDate(sDate, 'm') != '0')
				{
					sDate = $.fullCalendar.formatDate(sDate, 'h:mm TT')
				}
				else
				{
					sDate = '&nbsp;';
				}	
				
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction_time-' + this.id + '" class="interfaceActions">' + sDate + '</td>';
				
				aHTML[++h] = '<td class="interfaceMainRow interfaceRowSelectContact" id="tdAction_contact-' + this.contactperson + '" >' +
									this.contactpersonfirstname + ' ' + this.contactpersonsurname + '</td>';
				
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction_description-' + this.id + '" >' +
									this.description + '</td>';
				
				aHTML[++h] = '<td class="interfaceMainRowOptions" id="tdAction_options-' + this.id + 
									'" class="interfaceActionsOptions">&nbsp;</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sElementId).html(aHTML.join(''));
			$('#' + sElementId).show(ns1blankspace.option.showSpeed);
			
			$('td.interfaceRowSelect').click(function(event)
			{
				interfaceActionSearch(event.target.id, {source: 1});
			});
			
			$('td.interfaceRowSelectContact').click(function(event)
			{
				interfaceContactPersonSearch(event.target.id, {source: 1});
			});
			
		}
	}	
}

function interfaceActionQuickSave(oParam, oResponse)
{

	if (oResponse == undefined)
	{
		var sParam = '/ondemand/action/?rf=JSON&method=ACTION_MANAGE';
		var sData = '';
		var iType = ns1blankspace.data.actionType.meeting;
		var bAsync = true;
		var iHours;
		var sEndDate;
		var iActionBy = ns1blankspace.action.user;
		
		if (oParam != undefined)
		{
			if (oParam.type != undefined) {iType = oParam.type}
			if (oParam.async != undefined) {bAsync = oParam.async}
			if (oParam.hours != undefined) {iHours = oParam.hours}
			if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
			if (oParam.actionBy != undefined) {iActionBy = oParam.actionBy}
		}	
		
		sData += 'object=' + ns1blankspace.util.fs(oParam.object);
		sData += '&objectcontext=' + ns1blankspace.util.fs(oParam.objectContext);
		sData += '&subject=' + ns1blankspace.util.fs(oParam.subject);
		sData += '&description=' + ns1blankspace.util.fs(oParam.description);
		sData += '&priority=' + ns1blankspace.util.fs(oParam.description);
		sData += '&status=' + ns1blankspace.util.fs(oParam.status);
		sData += '&type=' + ns1blankspace.util.fs(iType);
		sData += '&date=' + ns1blankspace.util.fs(oParam.date);
		sData += '&actionby=' + ns1blankspace.util.fs(iActionBy);
		sData += '&contactbusiness=' + ns1blankspace.util.fs(oParam.contactBusiness);
		sData += '&contactperson=' + ns1blankspace.util.fs(oParam.contactPerson);
		
		if (iHours != undefined)
		{
			sData += '&totaltimehours=' + iHours;
		}
		
		if (sEndDate != undefined)
		{
			sData += '&enddate=' + ns1blankspace.util.fs(sEndDate);
		}
		
		sData += (oParam.otherData==undefined?'':oParam.otherData)
			  
		$.ajax(
		{
			type: 'POST',
			url: sParam,
			data: sData,
			dataType: 'json',
			async: bAsync,
			success: function(data) {interfaceActionQuickSave(oParam, data);}
		});
	}
	else	
	{
		if (oResponse.status == 'OK')
		{
			ns1blankspaceStatus('Saved');
			var iActionID = oResponse.id;	
		
			var dStartDate = new Date;
			var dEndDate = dStartDate;
			var sTitle = '';
			var sCalendarXHTMLElementID;
			
			if (oParam != undefined)
			{
				if (oParam.date != undefined) {sStartDate = oParam.date}
				if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
				if (oParam.subject != undefined) {sTitle = oParam.subject}
				if (oParam.calendarXHTMLElementID != undefined) {sCalendarXHTMLElementID = oParam.calendarXHTMLElementID}
			}	
			
			if (sCalendarXHTMLElementID != undefined)
			{
			
				$('#' + sCalendarXHTMLElementID).fullCalendar('renderEvent',
				{
					id: iActionID,
					title: sTitle,
					start: sStartDate, 
					end: sEndDate, 
					allDay: false},
					true
				);
			}
		}
		else
		{
			ns1blankspaceStatus(oResponse.error.errornotes);
			ns1blankspaceConfirm( {html: [oResponse.error.errornotes]
									   , title: 'Save error!'});
		}
	}
}	
