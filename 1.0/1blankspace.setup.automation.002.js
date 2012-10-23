function interfaceSetupAutomationMasterViewport()
{
	gsSetupName = 'Automation';
	goSetupContext = undefined;
	giSetupContext = -1;
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Automation"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceSetupAutomationSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceSetupAutomationSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupAutomationSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceSetupAutomationNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceSetupAutomationNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceSetupAutomationSave();
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

		interfaceMasterViewportActionShow(this, aHTML.join(''), "interfaceSetupAutomationActionOptionsBind()");
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
		
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceSetupAutomationSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupAutomationSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceSetupAutomationHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupAutomationHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupAutomationSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupAutomationSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('#inputInterfaceMasterViewportControlSearch').focus();
	
	interfaceSetupAutomationHomeShow();
	
}

function interfaceSetupAutomationHomeShow(oResponse)
{

	if (oXML == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceHomeMostLikely" class="interfaceMainColumn1Large">' +
						'</td>' +
						'<td id="tdInterfaceHomeColumn2Action" style="width:175px;">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
						
		$('#divInterfaceMain').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" cellspacing=0>';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTask3" class="interfaceMainColumn2Action" style="width:175px;">' +
						'<a href="http://mydsondemand.com/gettingstarted_automation"' +
						' target="_blank">Automation Getting Started</a>' +
						'</td></tr>';
										
		aHTML[++h] = '</td></tr></table>';					

		$('#tdInterfaceHomeColumn2Action').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportAutomationLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		var sParam = 'method=SETUP_AUTOMATION_SEARCH';

		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?' + sParam,
			dataType: 'json',
			success: interfaceSetupAutomationHomeShow
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceHomeMostLikelyNothing">Click New to create a automation rule.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
			aHTML[++h] = '<table id="tableInterfaceHomeMostLikely">';
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.title +
										'</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceSetupAutomationSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceSetupAutomationSearch(sXHTMLElementId, aParam)
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
		
		giSetupContext = sSearchContext;
		
		var sParam = 'method=SETUP_AUTOMATION_SEARCH&id=' + giSetupContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceSetupAutomationShow(aParam, data)}
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
			
			var sParam = 'method=SETUP_AUTOMATION_SEARCH&quicksearch=' + sSearchText;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceSetupAutomationSearchShow(aParam, data)}
			});
		}
	};	
}

function interfaceSetupAutomationSearchShow(aParam, oResponse)
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
			
			aHTML[++h] = '<td class="interfaceSearch" id="' +
							'-' + this.id + '">' +
							this.title + '</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		}
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceSetupAutomationSearch(event.target.id, 1);
		});
	}	
			
}

function interfaceSetupAutomationViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlSummary" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControlDetails" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlSchedule" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSchedule" class="interfaceViewportControl">Schedule</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlResponse" class="interfaceViewportControl">Response Action</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlFormat" class="interfaceViewportControl">Formatting</td>' +
					'</tr>';
			
	aHTML[++h] = '<tr><td id="tdInterfaceViewportControlFormat" class="interfaceViewportControl">&nbsp;</td></tr>';

	// aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					// '<td id="tdInterfaceViewportControlRun" class="interfaceViewportControl">Test Run</td>' +
					// '</tr>';					
			
	aHTML[++h] = '</table>';					
				
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainSchedule" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainResponse" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainFormat" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainRun" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
		
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceSetupAutomationSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupAutomationDetails();
	});
	
	$('#tdInterfaceViewportControlSchedule').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSchedule");
		interfaceSetupAutomationSchedule();
	});
	
	$('#tdInterfaceViewportControlResponse').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainResponse", true);
		interfaceSetupAutomationResponse();
	});
	
	$('#tdInterfaceViewportControlFormat').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainFormat");
		interfaceSetupAutomationFormat();
	});
	
	$('#tdInterfaceViewportControlRun').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainRun");
		interfaceSetupAutomationRun();
	});
}

function interfaceSetupAutomationShow(aParam, oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceSetupAutomationViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find automation rule.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{			
		$('#divInterfaceViewportControlContext').html(onDemandXMLGetData(oRow, 'sitetitle'));
		
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
		
		interfaceSetupAutomationSummary();
	}	
}		
		
function interfaceSetupAutomationSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find automation.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryID" class="interfaceMainSummary">Automation ID</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryID" class="interfaceMainSummaryValue">' +
						goObjectContext.id +
						'</td></tr>';
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryAutomationEndpoint" class="interfaceMainSummary">Endpoint</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryAutomationEndpoint" class="interfaceMainSummaryValue">' +
						goObjectContext.endpoint +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTask3" class="interfaceRowSelect">' +
						'<a href="/ondemand/setup/?method=SETUP_AUTOMATION_RUN&ct=text/html&id=' + onDemandXMLGetData(oRow, 'id') + '"' +
						' target="_blank" id="aInterfaceMainSummaryAutomationTestRun">Test Run</a>' +
						'</td></tr>';
										
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));
		
		/* $('#aInterfaceMainSummaryAutomationTestRun').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMainRun");
			interfaceSetupAutomationRun();
		}); */
			
	}	
}

function interfaceSetupAutomationDetails()
{
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainDetails').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainDetails').attr('onDemandLoading', '');
		
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStatus" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStatus" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStatus" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsStatusValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Disabled' +
						'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Enabled' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsEndpoint" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsEndpoint" class="interfaceMain">' +
						'Endpoint' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEndpointValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsEndpointValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsEndpoint" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsURL" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsURL" class="interfaceMain">' +
						'URL' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsURL" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsURLValue" class="interfaceMainTextMulti">' +
						'<textarea style="height: 50px;" rows="3" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMainDetailsURL"' +
						' class="inputInterfaceMainTextMultiLarge"></textarea>' +
						'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceMainDetailsURLMethod" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsURLMethod" class="interfaceMain">' +
						'URL Method' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsURLMethodValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsURLMethodValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsURLMethod" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsPostData" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPostData" class="interfaceMain">' +
						'POST Data' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsPostData" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsPostDataValue" class="interfaceMainTextMulti">' +
						'<textarea style="height: 250px;" rows="10" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMainDetailsPostData"' +
						' class="inputInterfaceMainTextMultiLarge"></textarea>' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsInContext" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsInContext" class="interfaceMain">' +
						'In context of user' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsInContextValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsInContextValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioInContextN" name="radioInContext" value="N"/>No' +
						'<br /><input type="radio" id="radioInContextY" name="radioInContext" value="Y"/>Yes' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainDetails').html(aHTML.join(''));
		
		if (goObjectContext == undefined)
		{	
			$('#inputInterfaceMainDetailsTitle').val(goObjectContext.title);
			$('#inputInterfaceMainDetailsEndpoint').val(goObjectContext.endpoint);
			$('#inputInterfaceMainDetailsURL').val(goObjectContext.url);
			$('#inputInterfaceMainDetailsURLMethod').val(goObjectContext.urlmethod);
			$('#inputInterfaceMainDetailsPostData').val(goObjectContext.postdata);
			
			$('[name="radioStatus"][value="' + goObjectContext.status + '"]').attr('checked', true);
			$('[name="radioInContext"][value="' + goObjectContext.incontext + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioStatus"][value="2"]').attr('checked', true);
			$('[name="radioInContext"][value="N"]').attr('checked', true);
		}	
	}	
}

function interfaceSetupAutomationSchedule()
{
	var aHTML = [];
	var h = -1;
	
	oRoot = goSetupContextXML.getElementsByTagName('ondemand').item(0);
	
	if ($('#divInterfaceMainSchedule').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainSchedule').attr('onDemandLoading', '');
		
		aHTML[++h] = '<table id="tableInterfaceMainSchedule" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainScheduleRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainScheduleColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainScheduleColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSchedule').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainScheduleColumn1" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainScheduleTimeHour" class="interfaceMain">' +
						'<td id="tdInterfaceMainScheduleTimeHour" class="interfaceMain">' +
						'Time (24 Hour)' +
						'</td></tr>' +
						'<tr id="trInterfaceMainScheduleTimeHourValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainScheduleTimeHourValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainScheduleTimeHour" class="inputInterfaceMainText">' +
						'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainScheduleTimeMinute" class="interfaceMain">' +
						'<td id="tdInterfaceMainScheduleTimeMinute" class="interfaceMain">' +
						'Time (Minute)' +
						'</td></tr>' +
						'<tr id="trInterfaceMainScheduleTimeMinuteValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainScheduleTimeMinuteValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainScheduleTimeMinute" class="inputInterfaceMainText">' +
						'</td></tr>';
		
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainScheduleColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainScheduleColumn2" class="interfaceMain">';

		aHTML[++h] = '<tr id="trInterfaceMainScheduleType" class="interfaceMain">' +
						'<td id="tdInterfaceMainScheduleType" class="interfaceMain">' +
						'Type (When)' +
						'</td></tr>' +
						'<tr id="trInterfaceMainScheduleType" class="interfaceMainText">' +
						'<td id="tdInterfaceMainScheduleTypeValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioScheduleType8" name="radioScheduleType" value="8"/>Every day' +
						'<br /><input type="radio" id="radioScheduleType7" name="radioScheduleType" value="7"/>Weekdays' +
						'<br /><input type="radio" id="radioScheduleType0" name="radioScheduleType" value="0"/>Sunday' +
						'<br /><input type="radio" id="radioScheduleType1" name="radioScheduleType" value="1"/>Monday' +
						'<br /><input type="radio" id="radioScheduleType2" name="radioScheduleType" value="2"/>Tuesday' +
						'<br /><input type="radio" id="radioScheduleType3" name="radioScheduleType" value="3"/>Wednesday' +
						'<br /><input type="radio" id="radioScheduleType4" name="radioScheduleType" value="4"/>Thursday' +
						'<br /><input type="radio" id="radioScheduleType5" name="radioScheduleType" value="5"/>Friday' +
						'<br /><input type="radio" id="radioScheduleType6" name="radioScheduleType" value="6"/>Saturday' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainScheduleColumn2').html(aHTML.join(''));
		
		if (goObjectContext == undefined)
		{
			$('#inputInterfaceMainScheduleTimeHour').val(goObjectContext.scheduletimehour);
			$('#inputInterfaceMainScheduleTimeMinute').val(goObjectContext.scheduletimeminute);
			$('[name="radioScheduleType"][value="' + goObjectContext.scheduletype + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioScheduleType"][value="8"]').attr('checked', true);
		}
	}	
}

function interfaceSetupAutomationResponse()
{
	var aHTML = [];
	var h = -1;

	if ($('#divInterfaceMainResponse').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainResponse').attr('onDemandLoading', '');
				
		aHTML[++h] = '<table id="tableInterfaceMainResponse" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainResponseRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainResponseColumn1" class="interfaceMainColumn1Large">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainResponse').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainResponseColumn1" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainResponseAction" class="interfaceMain">' +
						'<td id="tdInterfaceMainResponseAction" class="interfaceMain">' +
						'Response Action' +
						'</td></tr>' +
						'<tr id="trInterfaceMainResponseActionValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainResponseActionValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioResponseAction1" name="radioResponseAction" value="1"/>Email to network group' +
						'<br /><input type="radio" id="radioResponseAction3" name="radioResponseAction" value="3"/>' +
								'Send to URL' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainResponseActionContext" class="interfaceMain">' +
						'<td id="tdInterfaceMainResponseActionContext" class="interfaceMain">' +
						'Action Context (eg Network Group ID' +
						'</td></tr>' +
						'<tr id="trInterfaceMainResponseActionContextValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainResponseActionContextValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainResponseActionContext" class="inputInterfaceMainText">' +
						'</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceMainResponseActionFrom" class="interfaceMain">' +
						'<td id="tdInterfaceMainResponseActionFrom" class="interfaceMain">' +
						'Action From (email)' +
						'</td></tr>' +
						'<tr id="trInterfaceMainResponseActionFromValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainResponseActionFromValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainResponseActionFrom" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainResponseActionURL" class="interfaceMain">' +
						'<td id="tdInterfaceMainResponseActionURL" class="interfaceMain">' +
						'Response Action URL' +
						'</td></tr>' +
						'<tr id="trInterfaceMainResponseActionURL" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainResponseActionURLValue" class="interfaceMainTextMulti">' +
						'<textarea style="height: 50px;" rows="3" cols="35" id="inputInterfaceMainResponseActionURL"' +
						' class="inputInterfaceMainTextMultiLarge"></textarea>' +
						'</td></tr>';	
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainResponseColumn1').html(aHTML.join(''));
		
		if (goObjectContext == undefined)
		{
			$('[name="radioResponseAction"][value="' + goObjectContext.responseaction + '"]').attr('checked', true);
			$('#inputInterfaceMainResponseActionContext').val(goObjectContext.responseactioncontext);
			$('#inputInterfaceMainResponseActionFrom').val(goObjectContext.responseactionfrom);
			$('#inputInterfaceMainResponseActionURL').val(goObjectContext.responseactionurl);
		}
		else
		{
			$('[name="radioResponseAction"][value="1"]').attr('checked', true);
		}
	}	
}

function interfaceSetupAutomationFormat()
{
	var aHTML = [];
	var h = -1;

	if ($('#divInterfaceMainFormat').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainFormat').attr('onDemandLoading', '');
	
		aHTML[++h] = '<table id="tableInterfaceMainFormatColumn1" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainFormatCaption" class="interfaceMain">' +
						'<td id="tdInterfaceMainFormatCaption" class="interfaceMain">' +
						'Captions' +
						'</td></tr>' +
						'<tr id="trInterfaceMainFormatCaption" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainFormatCaptionValue" class="interfaceMainTextMulti">' +
						'<textarea style="height: 50px;" rows="3" cols="35" id="inputInterfaceMainFormatCaption"' +
						' class="inputInterfaceMainTextMultiLarge"></textarea>' +
						'</td></tr>';			
		
		aHTML[++h] = '<tr id="trInterfaceMainFormatCSSClass" class="interfaceMain">' +
						'<td id="tdInterfaceMainFormatCSSClass" class="interfaceMain">' +
						'CSS Class' +
						'</td></tr>' +
						'<tr id="trInterfaceMainFormatCSSClassValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainFormatCSSClassValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainFormatCSSClass" class="inputInterfaceMainText">' +
						'</td></tr>';
				
		aHTML[++h] = '<tr id="trInterfaceMainFormatXHTMLStyle" class="interfaceMain">' +
						'<td id="tdInterfaceMainFormatXHTMLStyle" class="interfaceMain">' +
						'XHTML Style' +
						'</td></tr>' +
						'<tr id="trInterfaceMainFormatXHTMLStyle" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainFormatXHTMLStyleValue" class="interfaceMainTextMulti">' +
						'<textarea style="height: 50px;" rows="3" cols="35" id="inputInterfaceMainFormatXHTMLStyle"' +
						' class="inputInterfaceMainTextMultiLarge"></textarea>' +
						'</td></tr>';		

		aHTML[++h] = '<tr id="trInterfaceMainFormatXHTMLAHref" class="interfaceMain">' +
						'<td id="tdInterfaceMainFormatXHTMLAHref" class="interfaceMain">' +
						'XHTML Href' +
						'</td></tr>' +
						'<tr id="trInterfaceMainFormatXHTMLAHref" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainFormatXHTMLAHrefValue" class="interfaceMainTextMulti">' +
						'<textarea style="height: 50px;" rows="3" cols="35" id="inputInterfaceMainFormatXHTMLAHref"' +
						' class="inputInterfaceMainTextMultiLarge"></textarea>' +
						'</td></tr>';	
						
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainFormat').html(aHTML.join(''));
		
		if (goObjectContext == undefined)
		{
			$('#inputInterfaceMainFormatCaption').val(goObjectContext.caption);
			$('#inputInterfaceMainFormatCSSClass').val(goObjectContext.cssclass);
			$('#inputInterfaceMainFormatXHTMLStyle').val(goObjectContext.xhtmlstyle);
			$('#inputInterfaceMainFormatXHTMLAHref').val(goObjectContext.xhtmlahref);
		}
	}	
}

function interfaceSetupAutomationSave(oResponse)
{
	if (oResponse == undefined)
	{
		var sParam = 'method=SETUP_AUTOMATION_MANAGE';
		var sData = '';
		
		if (giSetupContext != -1)
		{
			sParam += '&id=' + giSetupContext	
		}	
		
		if ($('#divInterfaceMainDetails').html() != '')
		{
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsTitle').val());
			sData += '&endpoint=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsEndpoint').val());
			sData += '&url=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsURL').val());
			sData += '&urlmethod=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsURLMethod').val());
			sData += '&postdata=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsPostData').val());
			sData += '&status=' + $('input[name="radioStatus"]:checked').val();
			sData += '&incontext=' + $('input[name="radioInContext"]:checked').val();
		};

		if ($('#divInterfaceMainSchedule').html() != '')
		{
			sData += '&scheduletimehour=' + interfaceMasterFormatSave($('#inputInterfaceMainScheduleTimeHour').val());
			sData += '&scheduletimeminute=' + interfaceMasterFormatSave($('#inputInterfaceMainScheduleTimeMinute').val());
			sData += '&scheduletype=' + $('input[name="radioScheduleType"]:checked').val();
		};
		
		if ($('#divInterfaceMainResponse').html() != '')
		{
			sData += '&responseactioncontext=' + interfaceMasterFormatSave($('#inputInterfaceMainResponseActionContext').val());
			sData += '&responseactionurl=' + interfaceMasterFormatSave($('#inputInterfaceMainResponseActionURL').val());
			sData += '&responseactionfrom=' + interfaceMasterFormatSave($('#inputInterfaceMainResponseActionFrom').val());
			sData += '&responseaction=' + $('input[name="radioResponseAction"]:checked').val();
			
		};

		if ($('#divInterfaceMainFormat').html() != '')
		{
			sData += '&caption=' + interfaceMasterFormatSave($('#inputInterfaceMainFormatCaption').val());
			sData += '&cssclass=' + interfaceMasterFormatSave($('#inputInterfaceMainFormatCSSClass').val());
			sData += '&xhtmlstyle=' + interfaceMasterFormatSave($('#inputInterfaceMainFormatXHTMLStyle').val());
			sData += '&xhtmlahref=' + interfaceMasterFormatSave($('#inputInterfaceMainFormatXHTMLAHref').val());
		};

		if (sData != '')
		{
			if (sData.slice(0,1) == '&') {sData = sData.replace('&', '')}
		
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?' + sParam,
				data: sData,
				dataType: 'json',
				success: interfaceSetupAutomationSave
			});
			
		}
		else
		{
			interfaceMasterStatus('Saved');
		}	
	}	
	else
	{
		interfaceMasterStatus('Saved')
		
		if (giSetupContext == -1)
		{
			giSetupContext = oResponse.id;
			gbInputDetected = false;
			interfaceSetupAutomationSearch('-' + giSetupContext, {source: 1});
		}	
	}
}

function interfaceSetupAutomationNew()
{
	giSetupContext = -1;
	goSetupContextXML = undefined;
	interfaceSetupAutomationViewport();
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	interfaceSetupAutomationDetails();
}