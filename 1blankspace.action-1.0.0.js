var aActions = [];
var d = new Date();
var iInterfaceActionCurrentMonth = d.getMonth() + 1;
var iInterfaceActionCurrentYear = d.getFullYear();

var giActionTypeMeeting = 3;
var giActionTypeFileNote = 4;
var giActionTypeEmailSent = 5;
var giActionTypeEmailReceived = 9;
var gsActionExtendedText = '';

var giActionContactPerson;
var giActionContactBusiness;
var gsActionContactPersonText;
var gsActionContactBusinessText;

var gaActionCalendarUsers = [];
var giActionUserID;
var gsCalendarParam = '';

function interfaceActionMasterViewport(aParam)
{
	giObjectContext = -1;
	giObject = 17;	
	gsObjectName = 'Action';
	goObjectContext = undefined;
	giObjectContext = -1;

	var bShowHome = true
	var bNew = false
	
	giActionUserID = gsUserID;
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
		if (aParam.showNew != undefined) {bNew = aParam.showNew}
		if (aParam.contactPerson != undefined) {giActionContactPerson = aParam.contactPerson}
		if (aParam.contactBusiness != undefined) {giActionContactBusiness = aParam.contactBusiness}
		if (aParam.contactPersonText != undefined) {gsActionContactPersonText = aParam.contactPersonText}
		if (aParam.contactBusinessText != undefined) {gsActionContactBusinessText = aParam.contactBusinessText}
	}
	
	interfaceMasterReset();		
		
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceActionMasterViewport({showHome: true});',
			move: false
			})		
	}
		
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Actions"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceActionSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceActionSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceActionSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceActionNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceActionNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceActionSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceActionSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceActionSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceActionHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceActionHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceActionSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceActionSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('#divInterfaceViewportControl').html('');	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	if (bNew)
	{
		interfaceActionNew()
	}
	else
	{
		if (bShowHome) {interfaceActionHomeShow(aParam)};
	}
}

function interfaceActionHomeShow(aParam)
{
	var bCalendar = false;
	
	if (aParam != undefined)
	{
		if (aParam.calendar != undefined) {bCalendar = aParam.calendar}
	}	
	
	$('#divInterfaceMain').html(gsLoadingXHTML);
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<table>';

	aHTML[++h] = '<tr>' +
					'<td id="interfaceMasterViewportActionLarge" class="interfaceMasterViewportImageLarge">' +
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
		interfaceMasterMainViewportShow("#divInterfaceMainCalendar");
		interfaceActionCalendar();
	});
	
	$('#tdInterfaceViewportControlNext10').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainNext10");
		interfaceActionNext10();
	});
	
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	
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

function interfaceActionSearch(sXHTMLElementId, aParam)
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
		
		var sParam = 'method=ACTION_SEARCH' +
								 '&id=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/action/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceActionShow(aParam, data)}
		});
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
			oSearch.method = 'ACTION_SEARCH';
			oSearch.addField('subject');
			oSearch.rf = 'json';
			oSearch.addFilter('quicksearch', 'EQUAL_TO', sSearchText);	
			oSearch.getResults(function(data) {interfaceActionSearchShow(aParam, data)});
		}
	}	
}

function interfaceActionSearchShow(aParam, oResponse)
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

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceActionSearch(event.target.id, 1);
		});
	}	
}

function interfaceActionNew()
{
	goObjectContext = undefined
	giObjectContext = -1;
	interfaceActionMasterViewport();
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	interfaceActionDetails();
}

function interfaceActionViewport()
{	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (giObjectContext != -1)
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
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceActionSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceActionDetails();
	});
	
	$('#tdInterfaceViewportControlDescription').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDescription");
		interfaceActionDescription();
	});
	
	$('#tdInterfaceViewportControlDescriptionExtended').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDescriptionExtended");
		interfaceMessagingActionSearch({
			xhtmlElementID: '-' + giObjectContext,
			targetXHTMLElementID: 'divInterfaceMainDescriptionExtended',
			setContext: false
			})
	});
	
	$('#tdInterfaceViewportControlAttachments').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAttachments", true);
		interfaceMasterAttachments({xhtmlElementID: 'divInterfaceMainAttachments'});
	});
}

function interfaceActionShow(aParam, oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceActionViewport();
		
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find action.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
				
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
		
		if (goObjectContext.type == giActionTypeEmailSent || goObjectContext.type == giActionTypeEmailReceived)
				{iMessageActionID = goObjectContext.id}
		
		if (goObjectContext.type == giActionTypeFileNote && goObjectContext.object == 17)
				{iMessageActionID = goObjectContext.objectcontext}
				
		if (iMessageActionID != undefined)
		{
			
			interfaceMessagingMasterViewport({autoShow: false});
			interfaceMessagingActionSearch({
				xhtmlElementID: '-' + iMessageActionID
				})	
		}
		else
		{
			interfaceMasterViewportDestination({
				newDestination: 'interfaceActionMasterViewport({showHome: false});interfaceActionSearch("-' + giObjectContext + '")',
				move: false
			})
			
			$('#tdInterfaceViewportControlDescriptionExtended').hide();
			$('#tdInterfaceViewportControlDescription').show();
			$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
			$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
			
		}
		
		if (giObjectContext != -1) {interfaceActionSummary()}
	}	
}		
		
function interfaceActionSummary()
{

	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find action.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
	
		if (goObjectContext.contactbusinesstext != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryContactBusiness" class="interfaceMainSummary">Business</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryContactBusinessValue" class="interfaceMainSummaryValue">' +
						goObjectContext.contactbusinesstext + 
						'</td>' +
						'</tr>';
		}			
	
		if (goObjectContext.contactpersontext != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryContactPerson" class="interfaceMainSummary">Person</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryContactPersonValue" class="interfaceMainSummaryValue">' +
						goObjectContext.contactpersonfirstname + ' ' + goObjectContext.contactpersonsurname +
						'</td>' +
						'</tr>';
		}				
			
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDate" class="interfaceMainSummary">Date</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDateValue" class="interfaceMainSummaryValue">' +
						goObjectContext.actiondate +
						'</td></tr>';
	
		var sDate = new Date(goObjectContext.actiondatetime);
	
		if ($.fullCalendar.formatDate(sDate, 'H') != '0' && $.fullCalendar.formatDate(sDate, 'm') != '0')
		{
		
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTime" class="interfaceMainSummary">Time</td></tr>' +
							'<tr><td id="tdInterfaceMainSummaryTimeValue" class="interfaceMainSummaryValue">' +
							$.fullCalendar.formatDate(sDate, 'h:mm TT') +
							'</td>' +
							'</tr>';
		}					
		
		if (goObjectContext.typetext != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryType" class="interfaceMainSummary">Type</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryTypeValue" class="interfaceMainSummaryValue">' +
						goObjectContext.typetext +
						'</td>' +
						'</tr>';
		}		
		
		if (goObjectContext.statustext != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryStatus" class="interfaceMainSummary">Status</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryStatusValue" class="interfaceMainSummaryValue">' +
						goObjectContext.statustext + 
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

		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsSubject').val(goObjectContext.reference);
			
			var sDate = new Date(goObjectContext.actiondatetime);
			sDate = $.fullCalendar.formatDate(sDate, 'dd MMM yyyy h:mm TT')
			$('#inputInterfaceMainDetailsDate').val(sDate);
			
			$('#inputInterfaceMainDetailsType').attr("onDemandID", goObjectContext.type);
			$('#inputInterfaceMainDetailsType').val(goObjectContext.typetext);
			$('#inputInterfaceMainDetailsActionBy').attr("onDemandID", goObjectContext.actionby);
			$('#inputInterfaceMainDetailsActionBy').val(goObjectContext.actionbyfirstname + ' ' +
							goObjectContext.actionbysurname);
			$('[name="radioStatus"][value="' + goObjectContext.status + '"]').attr('checked', true);
			
			$('#inputInterfaceMainDetailsBusiness').attr("onDemandID", goObjectContext.contactbusiness);
			$('#inputInterfaceMainDetailsBusiness').val(goObjectContext.contactbusinesstext);
			
			$('#inputInterfaceMainDetailsPerson').attr("onDemandID", goObjectContext.contactperson);
			$('#inputInterfaceMainDetailsPerson').val(goObjectContext.contactpersonfirstname + 
					' ' + goObjectContext.contactpersonsurname);
		}
		else
		{
			$('[name="radioStatus"][value="1"]').attr('checked', true);
			
			if (giActionContactBusiness != undefined)
			{$('#inputInterfaceMainDetailsBusiness').attr("onDemandID", giActionContactBusiness);}
			
			if (gsActionContactBusinessText != undefined)
			{$('#inputInterfaceMainDetailsBusiness').val(gsActionContactBusinessText);}
			
			if (giActionContactPerson != undefined)
			{$('#inputInterfaceMainDetailsPerson').attr("onDemandID", giActionContactPerson);}
			
			if (gsActionContactPersonText != undefined)
			{$('#inputInterfaceMainDetailsPerson').val(gsActionContactPersonText);}
		}
		
		$('#inputInterfaceMainDetailsStatus').keyup(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').hide(200);
			interfaceMasterElementOptionsSearch(event.target.id);
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
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDescription').val(unescape(goObjectContext.description));
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
					gsLoadingXHTML +
					'</td>' +
					'</tr>' +
					'</table>';					
			
	$('#divInterfaceMainNext10').html(aHTML.join(''));
	
	interfaceActionNextSummary({xhtmlElement: 'tdInterfaceMainNext10Column1'});
	
}	
	
function interfaceActionsList(sElementId, iObject, lObjectContext, bAll, sActionType)
{

	if (iObject == undefined) {iObject = giObject};
	if (lObjectContext == undefined) {lObjectContext = giObjectContext};
	if (sElementId == undefined) {sElementId = "divInterfaceMasterViewportControlOptions"};
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
		$('#' + sElementId).show(giShowSpeed);
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
		$('#' + sElementId).show(giShowSpeed);
		
		$('td.interfaceActions').click(function(event)
		{
			interfaceMasterElementEditStart(event.target.id);
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
						type: ($('#inputInterfaceMainAddNoteStatus').attr('checked')?giActionTypeFileNote:giActionTypeFileNote),
						priority: ($('#inputInterfaceMainAddNoteHighPriority').attr('checked')?3:2)
						});
					$( this ).dialog( "close" );
					
				}
			}
		});
}

function interfaceActionSave(aParam, oResponse)
{
	var sParam = '/ondemand/action/?rf=JSON&method=ACTION_MANAGE';
	var sData = '';
	var iType = giActionTypeMeeting;
	
	if (oResponse == undefined)
	{
		if (aParam != undefined)
		{
			if (aParam.type != undefined) {iType = aParam.type}
			if (aParam.object == undefined) {aParam.object = giObject}
			if (aParam.objectContext == undefined) {aParam.objectContext = giObjectContext}

			sData += 'object=' + interfaceMasterinterfaceMasterFormatSave(aParam.object);
			sData += '&objectcontext=' + interfaceMasterinterfaceMasterFormatSave(aParam.objectContext);
			sData += '&subject=' + interfaceMasterinterfaceMasterFormatSave(aParam.subject);
			sData += '&description=' + interfaceMasterinterfaceMasterFormatSave(aParam.description);
			sData += '&priority=' + interfaceMasterinterfaceMasterFormatSave(aParam.description);
			sData += '&status=' + interfaceMasterinterfaceMasterFormatSave(aParam.status);
			sData += '&type=' + interfaceMasterinterfaceMasterFormatSave(iType);
			sData += '&date=' + interfaceMasterinterfaceMasterFormatSave(aParam.date);
			sData += '&enddate=' + interfaceMasterinterfaceMasterFormatSave(aParam.endDate);
			sData += '&actionby=' + interfaceMasterinterfaceMasterFormatSave(aParam.actionBy);
			sData += '&contactbusiness=' + interfaceMasterinterfaceMasterFormatSave(aParam.contactBusiness);
			sData += '&contactperson=' + interfaceMasterinterfaceMasterFormatSave(aParam.contactPerson);
			
			sData += (aParam.otherData==undefined?'':aParam.otherData)
		}	
		else	  
		{
			if (giObjectContext != -1)
			{
				sData += 'id=' + giObjectContext;
			}
			else
			{
				sData += 'id=';
			}
			
			if ($('#divInterfaceMainDetails').html() != '')
			{
				sData += '&subject=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsSubject').val());
				sData += '&priority=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsPriority').attr('onDemandID'));				
				sData += '&type=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsType').attr('onDemandID'));
				sData += '&date=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDate').val());
				sData += '&contactbusiness=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsBusiness').attr("onDemandID"));
				sData += '&contactperson=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsPerson').attr("onDemandID"));
				sData += '&actionby=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsActionBy').attr("onDemandID"));
				sData += '&status=' + $('input[name="radioStatus"]:checked').val();
				
			}
			
			if ($('#divInterfaceMainDescription').html() != '')
			{
				sData += '&description=' + interfaceMasterinterfaceMasterFormatSave($('#inputInterfaceMainDescription').val());
			}
		}
		  
		$.ajax(
		{
			type: 'POST',
			url: sParam,
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceActionSave(aParam, data);}
		});
	}	
	else
	{

		if (oResponse.status == 'OK')
		{
			interfaceMasterStatus('Saved');
			giObjectContext = oResponse.id;	
		
			var dStartDate = new Date;
			var dEndDate = dStartDate;
			var sTitle = '';
			var sCalendarXHTMLElementID;
			
			if (aParam != undefined)
			{
				if (aParam.date != undefined) {sStartDate = aParam.date}
				if (aParam.endDate != undefined) {sEndDate = aParam.endDate}
				if (aParam.title != undefined) {sTitle = aParam.title}
				if (aParam.calendarXHTMLElementID != undefined) {sCalendarXHTMLElementID = aParam.calendarXHTMLElementID}
			}	
		
			if (sCalendarXHTMLElementID != undefined)
			{
			
				$('#' + sCalendarXHTMLElementID).fullCalendar('renderEvent',
				{
					id: giObjectContext,
					title: sTitle,
					start: sStartDate, 
					end: sEndDate, 
					allDay: false},
					true
				);
			}
			
			gbInputDetected = false;
			interfaceActionSearch('-' + giObjectContext, {source: 1});
		
		}
		else
		{
			interfaceMasterStatus(oResponse.error.errornotes);
			interfaceMasterConfirm( {html: [oResponse.error.errornotes]
									   , title: 'Save error!'});
		}
	}
	
}

function interfaceActionsSummaryActions(sElementId, iObject, iObjectContext)
{

	var sParam = '/ondemand/action/?method=ACTION_SEARCH' +
								 '&rf=xml' +
								 '&type=' + giActionTypeFileNote +
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

function interfaceActionCalendar(aParam)
{
			
	var sXHTMLElementID = 'divInterfaceMainCalendar';		
	var bEventFetch = true;
	var iSourceObject = 17;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.eventFetch != undefined) {bEventFetch = aParam.eventFetch}
		if (aParam.sourceObject != undefined) {iSourceObject = aParam.sourceObject}
	}
	
	$('#' + sXHTMLElementID).html('');
	
	if (gaActionCalendarUsers.length == 0 && bEventFetch)
	{
		if (giActionUserID != undefined)
		{
			gaActionCalendarUsers.push(giActionUserID);
		}
		else
		{	
			gaActionCalendarUsers.push(gsUserID);
		}	
	}	
	
	$('#divInterfaceMasterViewportControlOptions').hide(0);
	
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
				sData += '&daydelta=' + interfaceMasterFormatSave(dayDelta);
				sData += '&minutedelta=' + interfaceMasterFormatSave(minuteDelta);
				
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
			interfaceMasterStatus(event.contactBusinessText);
		},
		
		eventMouseout: function( event, jsEvent, view ) 
		{
			interfaceMasterStatus('');
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
				sData += '&enddaydelta=' + interfaceMasterFormatSave(dayDelta);
				sData += '&endminutedelta=' + interfaceMasterFormatSave(minuteDelta);
				
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
	
	$.each(gaActionCalendarUsers, function() 
	{ 
		$('#' + sXHTMLElementID).fullCalendar('addEventSource', 
		{
			url: '/ondemand/action/?method=ACTION_CALENDAR_SEARCH' + gsCalendarParam + '&rf=JSON&diary=1&usercolours=1&titleoption=1&actionby=' + this
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

	if (gaActionCalendarUsers.length > 0) 
	{ 
		var sParam = 'method=SETUP_USER_SEARCH&profile=445-446-447&users=' + gaActionCalendarUsers.toString('-');
		
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

function interfaceActionCalendarAddShow(aParam, oResponse)
{
	var iActionID = -1;
	var dStartDate = new Date();
	var dEndDate = dStartDate;
	
	if (aParam != undefined)
	{
		if (aParam.actionID != undefined) {iActionID = aParam.actionID};
		if (aParam.startDate != undefined) {dStartDate = aParam.startDate};
		if (aParam.endDate != undefined) {dEndDate = aParam.endDate};
	}	

	if (iActionID != -1 && oResponse == undefined)
	{
		sParam = 'method=ACTION_SEARCH&rf=json&select=' + iActionID;
	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/action/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceActionCalendarAddShow(aParam, data)}
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
			aHTML[++h] = ' interfaceMasterWatermark" value="Subject">';
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
			aHTML[++h] = ' interfaceMasterWatermark">Add more text here, if required.</textarea>';
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
		
		var oElement = $('#interfaceMasterViewportActionLarge')
		
		$('#divInterfaceMasterDialog').html('');
		$('#divInterfaceMasterDialog').show();
		$('#divInterfaceMasterDialog').offset({ top: $(oElement).offset().top + $(oElement).height() + 5, left: $(oElement).offset().left });
		$('#divInterfaceMasterDialog').html(aHTML.join(''));
		
		$('#spanCancel').button(
			{
				text: false,
				 icons: {
					 primary: "ui-icon-close"
				}
			})
			.click(function() {
				$('#divInterfaceMasterDialog').slideUp(500);
				$('#divInterfaceMasterDialog').html('');
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
				
				$('#divInterfaceMasterDialog').slideUp(500);
				$('#divInterfaceMasterDialog').html('');

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

function interfaceMasterHomeCalendarAction(iActionId, sActionTitle)
{

	sParam = 'method=ACTION_SEARCH&contactperson=ALL&select=' + iActionId + '&rf=XML';
	
	$.ajax(
	{
		type: 'GET',
		url: '/directory/ondemand/object.asp?' + sParam,
		dataType: 'xml',
		success: interfaceMasterHomeCalendarActionShow()
	});	

	$('#divInterfaceMasterViewportControlOptions').html(gsLoadingXHTML);
	
	$('#divInterfaceMasterViewportControlOptions').dialog({
		title: sActionTitle,	
		modal: true,
		stack: false,
		draggable: false,
		resizeable: false
	});
}

function interfaceActionNextSummary(aParam, oResponse)
{	
	var sElementId = 'divInterfaceMain';
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElement != undefined)
		{
			sElementId = aParam.xhtmlElement;
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
			success: function(data) {interfaceActionNextSummary(aParam, data)}
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
			$('#' + sElementId).show(giShowSpeed);
			
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
			$('#' + sElementId).show(giShowSpeed);
			
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

function interfaceActionQuickSave(aParam, oResponse)
{

	if (oResponse == undefined)
	{
		var sParam = '/ondemand/action/?rf=JSON&method=ACTION_MANAGE';
		var sData = '';
		var iType = giActionTypeMeeting;
		var bAsync = true;
		var iHours;
		var sEndDate;
		var iActionBy = giActionUserID;
		
		if (aParam != undefined)
		{
			if (aParam.type != undefined) {iType = aParam.type}
			if (aParam.async != undefined) {bAsync = aParam.async}
			if (aParam.hours != undefined) {iHours = aParam.hours}
			if (aParam.endDate != undefined) {sEndDate = aParam.endDate}
			if (aParam.actionBy != undefined) {iActionBy = aParam.actionBy}
		}	
		
		sData += 'object=' + interfaceMasterFormatSave(aParam.object);
		sData += '&objectcontext=' + interfaceMasterFormatSave(aParam.objectContext);
		sData += '&subject=' + interfaceMasterFormatSave(aParam.subject);
		sData += '&description=' + interfaceMasterFormatSave(aParam.description);
		sData += '&priority=' + interfaceMasterFormatSave(aParam.description);
		sData += '&status=' + interfaceMasterFormatSave(aParam.status);
		sData += '&type=' + interfaceMasterFormatSave(iType);
		sData += '&date=' + interfaceMasterFormatSave(aParam.date);
		sData += '&actionby=' + interfaceMasterFormatSave(iActionBy);
		sData += '&contactbusiness=' + interfaceMasterFormatSave(aParam.contactBusiness);
		sData += '&contactperson=' + interfaceMasterFormatSave(aParam.contactPerson);
		
		if (iHours != undefined)
		{
			sData += '&totaltimehours=' + iHours;
		}
		
		if (sEndDate != undefined)
		{
			sData += '&enddate=' + interfaceMasterFormatSave(sEndDate);
		}
		
		sData += (aParam.otherData==undefined?'':aParam.otherData)
			  
		$.ajax(
		{
			type: 'POST',
			url: sParam,
			data: sData,
			dataType: 'json',
			async: bAsync,
			success: function(data) {interfaceActionQuickSave(aParam, data);}
		});
	}
	else	
	{
		if (oResponse.status == 'OK')
		{
			interfaceMasterStatus('Saved');
			var iActionID = oResponse.id;	
		
			var dStartDate = new Date;
			var dEndDate = dStartDate;
			var sTitle = '';
			var sCalendarXHTMLElementID;
			
			if (aParam != undefined)
			{
				if (aParam.date != undefined) {sStartDate = aParam.date}
				if (aParam.endDate != undefined) {sEndDate = aParam.endDate}
				if (aParam.subject != undefined) {sTitle = aParam.subject}
				if (aParam.calendarXHTMLElementID != undefined) {sCalendarXHTMLElementID = aParam.calendarXHTMLElementID}
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
			interfaceMasterStatus(oResponse.error.errornotes);
			interfaceMasterConfirm( {html: [oResponse.error.errornotes]
									   , title: 'Save error!'});
		}
	}
}	
