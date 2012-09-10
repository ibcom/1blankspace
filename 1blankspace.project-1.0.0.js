
/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

function interfaceProjectMasterViewport(aParam)
{
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}
	
	giObject = 1;
	gsObjectName = 'Project';
	goObjectContext = undefined;
	giObjectContext = -1;

	interfaceMasterReset();
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceProjectMasterViewport({showHome: true});',
			move: false
			})		
	}
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Projects"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceProjectSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);	
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceProjectSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceProjectSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceProjectNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceProjectNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceProjectSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceProjectSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceProjectSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceProjectSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceProjectHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceProjectHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceProjectSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceProjectSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	if (bShowHome) {interfaceProjectHomeShow()};
}

function interfaceProjectHomeShow(oResponse)
{

	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceProjectHomeMostLikely" class="interfaceViewportMain">' +
						gsLoadingXHTML + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportProjectLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'PROJECT_SEARCH';
		
		oSearch.addField('reference,description');
		oSearch.async = false;
		oSearch.rf = 'json';
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		
		oSearch.getResults(interfaceProjectHomeShow);
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceProjectHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceProjectHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceProjectHomeMostLikelyNothing">Click New to create a project.</td>';
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
				
				aHTML[++h] = '<td id="interfaceProjectHomeMostLikely_Title-' +
										this.id + '" class="interfaceHomeMostLikely">' +
										this.reference + '</td>';
				
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';
		};
		
		$('#tdInterfaceProjectHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceProjectSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceProjectSearch(sXHTMLElementId, aParam)
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
		var sParam = 'method=PROJECT_SEARCH&id=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/project/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceProjectShow(aParam, data)}
		});
	}
	else
	{
	
		var iMinimumLength = 3;
		var iMaximumColumns = 1;
	
		if (iSource == undefined)
		{
			iSource = giSearchSource_TEXT_INPUT;
		}	
		
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
			
			var sParam = 'method=PROJECT_SEARCH&quicksearch=' + sSearchText + 
								'&xhtmlcontext=' + sXHTMLElementId;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/project/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceProjectSearchShow(aParam, data)}
			});
		}
	};	
}

function interfaceProjectSearchShow(aParam, oResponse)
{
	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
			
	if (oResponse.data.rows.length == 0)
	{
		$('#divInterfaceMasterViewportControlOptions').hide();
		interfaceMasterSearchStop();
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
							this.reference +
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
		
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceProjectSearch(event.target.id, {source: 1});
		});
	}	
			
}

function interfaceProjectViewport()
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
	
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDescription" class="interfaceViewportControl">Description</td>' +
						'</tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportControlTasks" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlTasks" class="interfaceViewportControl">Tasks</td>' +
						'</tr>';
	
		aHTML[++h] = '</table>';					

		/* aHTML[++h] = '<table id="tableInterfaceViewportControl2" class="interfaceViewportControl">';
	
		aHTML[++h] = '<tr id="trInterfaceViewportControlFinancials" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlFinancials" class="interfaceViewportControl">Financials</td>' +
						'</tr>';
					
		aHTML[++h] = '</table>';*/				
	
		aHTML[++h] = '<table id="tableInterfaceViewportControl3" class="interfaceViewportControl">';
	
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
	aHTML[++h] = '<div id="divInterfaceMainDescription" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainTasks" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainTaskDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainFinancials" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceProjectSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceProjectDetails();
	});
	
	$('#tdInterfaceViewportControlDescription').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDescription");
		interfaceProjectDescription();
	});
	
	$('#tdInterfaceViewportControlTasks').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainTasks", true);
		interfaceProjectTasks();
	});
	
	$('#tdInterfaceViewportControlFinancials').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainFinancials", true);
		interfaceProjectFinancials();
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

function interfaceProjectShow(aParam, oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceProjectViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find project.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];

		$('#divInterfaceViewportControlContext').html(goObjectContext.reference);
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceProjectMasterViewport({showHome: false});interfaceProjectSearch("-' + giObjectContext + '")',
			move: false
			})
			
		interfaceProjectSummary();
	}	
}		
		
function interfaceProjectSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find project.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1Large" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2Action" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
	
		var aHTML = [];
		var h = -1;	
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
						goObjectContext.description +
						'</td></tr>';
						
		aHTML[++h] =  '<tr><td id="tdInterfaceMainSummaryStartDate" class="interfaceMainSummary">Start Date</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryStartDateValue" class="interfaceMainSummaryValue">' +
						goObjectContext.startdate +
						'</td>' +
						'</tr>';
		
		aHTML[++h] =  '<tr><td id="tdInterfaceMainSummaryStartDate" class="interfaceMainSummary">End Date</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryEndDateValue" class="interfaceMainSummaryValue">' +
						goObjectContext.enddate +
						'</td>' +
						'</tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action" cellspacing=0>';
								
		//aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryViewAsTimeline" class="interfaceMainColumn2Action">' +
		//				'<a href="#" id="aInterfaceMainSummaryViewAsTimeline">View As Timeline</a>' +
		//				'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
		
		$('#aInterfaceMainSummaryViewAsTimeline').click(function(event)
		{
			interfaceProjectViewAsTimeline();
		});
	}	
}

function interfaceProjectDetails()
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

		aHTML[++h] = '<tr id="trInterfaceMainDetailsStartDate" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStartDate" class="interfaceMain">' +
						'Start Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStartDateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsStartDateValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsStartDate" class="inputInterfaceMainDate">' +
						'</td></tr>';			
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsEndDate" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsEndDate" class="interfaceMain">' +
						'End Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEndDateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsEndDateValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsEndDate" class="inputInterfaceMainDate">' +
						'</td></tr>';			
				
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		$('input.inputInterfaceMainDate').datepicker({ dateFormat: 'dd M yy' });
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStatus" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStatus" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStatus" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsStatusValue" class="interfaceMainText">' +
						'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Not Started' +
						'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>In Progress' +
						'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>Ongoing' +
						'<br /><input type="radio" id="radioStatus6" name="radioStatus" value="6"/>On Hold' +
						'<br /><input type="radio" id="radioStatus7" name="radioStatus" value="7"/>Cancelled' +
						'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Completed' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsReference').val(goObjectContext.reference);
			$('[name="radioStatus"][value="' + goObjectContext.status + '"]').attr('checked', true);
			$('#inputInterfaceMainDetailsStartDate').val(goObjectContext.startdate);
			$('#inputInterfaceMainDetailsEndDate').val(goObjectContext.enddate);
		}
		else
		{
			$('[name="radioStatus"][value="1"]').attr('checked', true);
		}
	}	
}

function interfaceProjectDescription()
{
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainDescription').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainDescription').attr('onDemandLoading', '');
				
		aHTML[++h] = '<table id="tableInterfaceMainDescription" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainDescriptionRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainDescriptionColumn1" class="interfaceMain">' +
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
						'<textarea rows="30" cols="50" id="inputInterfaceMainDescription" class="inputInterfaceMainTextMulti inputInterfaceMainTextMultiLarge"></textarea>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDescriptionColumn1').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDescription').val(unescape(goObjectContext.description));
		}
	}	
}

function interfaceProjectTasks(aParam, oResponse)
{
	
	var sXHTMLElementId = 'divInterfaceMainTasks';
	var sLabel = "Tasks";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
	}

	if (oResponse == undefined)
	{
		var sParam = 'method=PROJECT_TASK_SEARCH&rows=100' +
						'&project=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/project/',
			data: sParam,
			dataType: 'json',
			success: function(data){interfaceProjectTasks(aParam, data)}
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainTasks" class="interfaceMain">' +
					'<tr id="trInterfaceMainTasksRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainTasksColumn1" class="interfaceMainColumn1Large">' +
					'</td>' +
					'<td id="tdInterfaceMainTasksColumn2" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divInterfaceMainTasks').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainTasksColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainTasksAdd" class="interfaceMain">' +
						'<span id="spanInterfaceMainTasksAdd">Add</span>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainTasksColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainTasksAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			interfaceProjectTaskDetailsAdd();
		})
		
		var aHTML = [];
		var h = -1;
	
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableSetupProjectTasks" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No tasks.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainTasksColumn1').html(aHTML.join(''));
		}
		else
		{
			aHTML[++h] = '<table id="tableSetupProjectTasks" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';

				aHTML[++h] = '<td style="width: 22px;" id="tdSetupProjectTasks_color-' + this.id + 
									'" class="interfaceProjectTaskType' + this.typetext + 'BG interfaceProjectTaskTypeBG">&nbsp;</td>';
				
				aHTML[++h] = '<td style="width: 420px;" id="tdSetupProjectTasks_title-' + this.id + '" class="interfaceMainRow">' +
										this.title + '</td>';
										
				aHTML[++h] = '<td style="width: 23px;" id="tdSetupProjectTasks_delete-' + this.id + '" class="interfaceMainRowOptionsDelete">&nbsp;</td>';
				aHTML[++h] = '<td style="width: 25px;" id="tdSetupProjectTasks_select-' + this.id + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainTasksColumn1').html(aHTML.join(''));
			
			$('.interfaceMainRowOptionsDelete').button({
				text: false,
				 icons: {
					 primary: "ui-icon-close"
				}
			})
			.click(function() {
				interfaceProjectTasksRemove(this.id)
			})
			.css('width', '15px')
			.css('height', '20px')
			
			$('.interfaceMainRowOptionsSelect').button({
				text: false,
				 icons: {
					 primary: "ui-icon-play"
				}
			})
			.click(function() {
				interfaceProjectTaskMasterViewport({showHome: false});
				interfaceProjectTaskSearch(this.id);
			})
			.css('width', '15px')
			.css('height', '20px')
		}
	}	
}	

function interfaceProjectNew()
{
	goObjectContext = undefined
	giObjectContext = -1;
	interfaceProjectViewport();
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	interfaceProjectDetails();
}

function interfaceProjectSave()
{
	var sData = 'id=' + ((giObjectContext == -1)?'':giObjectContext);
		
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&reference=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsReference').val());
		sData += '&startdate=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsStartDate').val());
		sData += '&enddate=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsEndDate').val());
		sData += '&status=' + $('input[name="radioStatus"]:checked').val();
	}
	
	if ($('#divInterfaceMainDescription').html() != '')
	{
		sData += '&description=' + interfaceMasterFormatSave($('#inputInterfaceMainDescription').val());
	}
		
	$.ajax(
	{
		type: 'POST',
		url: interfaceMasterEndpointURL('PROJECT_MANAGE'),
		data: sData,
		dataType: 'json',
		success: interfaceProjectSaveProcess
	});
}

function interfaceProjectSaveProcess(oResponse)
{
	
	if (oResponse.status == 'OK')
	{
		interfaceMasterStatus('Project saved');
		if (giObjectContext == -1) {var bNew = true}
		giObjectContext = oResponse.id;	
	}
	else
	{
		interfaceMasterStatus(oResponse.error.errornotes);
		interfaceMasterConfirm( {html: [oResponse.error.errornotes]
								   , title: 'Save error!'});
	}
}

function interfaceProjectTasksSlide()
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = ' <div id="slideshow"><div id="slidesContainer">'
	
		aHTML[++h] = '<div class="slide">'
		aHTML[++h] = '<h2>SLIDE 1</h2>' +
							'<p>Slide1</p>';
		aHTML[++h] = '</div>'
		
		aHTML[++h] = '<div class="slide">'
		aHTML[++h] = '<h2>SLIDE 2</h2>' +
							'<p>Slide2</p>';
		aHTML[++h] = '</div>'
		
		aHTML[++h] = '<div class="slide">'
		aHTML[++h] = '<h2>SLIDE 3</h2>' +
							'<p>Slide3</p>';
		aHTML[++h] = '</div>'					
		
		aHTML[++h] = '<div class="slide">'
		aHTML[++h] = '<h2>SLIDE 4</h2>' +
							'<p>Slide4</p>';
		
		aHTML[++h] = '</div>'
	
    aHTML[++h] = '</div></div>'

	$('#divInterfaceMainProjects').html(aHTML.join(''));	
	
	interfaceMasterSetupSlide('slideshow','slidesContainer');
}

function interfaceProjectTaskDetailsAdd(aParam, oResponse)
{
	var sXHTMLElementId = "divInterfaceMainTaskDetails";
	var sXHTMLElementContextId;
	var lProjectTask;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
		if (aParam.xhtmlElementContextId != undefined) {sXHTMLElementContextId = aParam.xhtmlElementContextId}
		if (aParam.projectTask != undefined) {lProjectTask = aParam.projectTask}
	}

	if (sXHTMLElementContextId != undefined)
	{
		var aSearch = sXHTMLElementContextId.split('-');
		var sElementId = aSearch[0];
		var lProjectTask = aSearch[1];
	}	
		
	interfaceMasterMainViewportShow("#divInterfaceMainTaskDetails");	
		
	var aHTML = [];
	var h = -1;
		
	aHTML[++h] = '<table id="tableInterfaceMainProjectTaskDetails" class="interfaceMain">' +
					'<tr id="trInterfaceMainProjectTaskDetailsRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainProjectTaskDetailsColumn1" class="interfaceMainColumn1Large">' +
					'</td>' +
					'<td id="tdInterfaceMainProjectTaskDetailsColumn2" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
	$('#' + sXHTMLElementId).html(aHTML.join(''));
			
	if (oResponse == undefined && lProjectTask != undefined)
	{
		var sParam = 'method=PROJECT_TASK_SEARCH' +
						'&id=' + lProjectTask;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/project/',
			data: sParam,
			dataType: 'xml',
			success: function(data){interfaceProjectTaskDetailsAdd(aParam, data)}
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainTaskDetailsColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainTaskDetailsSave" class="interfaceMain">' +
						'<span id="spanInterfaceMainTaskDetailsSave">Save</span>' +
						'</td></tr>';
								
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainProjectTaskDetailsColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainTaskDetailsSave').button(
		{
			label: "Save"
		})
		.click(function() {
			interfaceProjectTaskAddSave(aParam);
		})
		
		var aHTML = [];
		var h = -1;
							
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';					
							
		aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsTitle" class="interfaceMain">' +
							'<td id="tdInterfaceMainProjectTaskDetailsTitle" class="interfaceMain">' +
							'Title' +
							'</td></tr>' +
							'<tr id="trInterfaceMainProjectTaskDetailsTitleValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainProjectTaskDetailsTitleValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainProjectTaskDetailsTitle" class="inputInterfaceMainText">' +
							'</td></tr>';							
	
		aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsDescriptionValue" class="interfaceMainTextMulti">' +
							'<td id="tdInterfaceMainProjectTaskDetailsDescriptionValue" class="interfaceMainTextMulti">' +
							'<textarea rows="10" cols="50" style="width:100%;" id="inputInterfaceMainProjectTaskDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
							'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsType" class="interfaceMain">' +
							'<td id="tdInterfaceMainProjectTaskDetailsType" class="interfaceMain">' +
							'Type' +
							'</td></tr>' +
							'<tr id="trInterfaceMainProjectTaskDetailsTypeValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceMainProjectTaskDetailsTypeValue" class="interfaceMainSelect">' +
							'<input id="inputInterfaceMainProjectTaskDetailsType" class="inputInterfaceMainSelect"' +
								' onDemandMethod="/ondemand/setup/?rf=XML&method=SETUP_PROJECT_TASK_TYPE_SEARCH">' +
							'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsTaskBy" class="interfaceMain">' +
							'<td id="tdInterfaceMainProjectTaskDetailsTaskBy" class="interfaceMain">' +
							'Task By' +
							'</td></tr>' +
							'<tr id="trInterfaceMainProjectTaskDetailsTaskByValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceMainProjectTaskDetailsTaskByValue" class="interfaceMainSelect">' +
							'<input id="inputInterfaceMainProjectTaskDetailsTaskBy" class="inputInterfaceMainSelect"' +
								' onDemandMethod="/ondemand/setup/?method=SETUP_USER_SEARCH&rf=XML" onDemandColumns="username">' +
							'</td></tr>';
	
							
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStartDate" class="interfaceMain">' +
							'<td id="tdInterfaceMainDetailsStartDate" class="interfaceMain">' +
							'Start Date' +
							'</td></tr>' +
							'<tr id="trInterfaceMainDetailsStartDateValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainDetailsStartDateValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainProjectTaskDetailsStartDate" class="inputInterfaceMainDate">' +
							'</td></tr>';			
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsEndDate" class="interfaceMain">' +
							'<td id="tdInterfaceMainDetailsEndDate" class="interfaceMain">' +
							'End Date' +
							'</td></tr>' +
							'<tr id="trInterfaceMainDetailsEndDateValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainDetailsEndDateValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainProjectTaskDetailsEndDate" class="inputInterfaceMainDate">' +
							'</td></tr>';			
	
		aHTML[++h] = '</table>';						
	
		$('#tdInterfaceMainProjectTaskDetailsColumn1').html(aHTML.join(''));
		
		$('input.inputInterfaceMainDate').datepicker({ dateFormat: 'dd M yy' });
		
		if (oResponse != undefined)
		{	
			if (oResponse.data.rows.length == 0)
			{	
				$('#inputInterfaceMainProjectTaskDetailsReference').val(oResponse.data.rows[0].reference);
				$('#inputInterfaceMainProjectTaskDetailsTitle').val(oResponse.data.rows[0].title);		
			}
		}	
	}	
}	

function interfaceProjectTaskAddSave()
{
	var sParam = '/ondemand/project/?method=PROJECT_TASK_MANAGE'
	var sData = 'project=' + giObjectContext;
	
	sData += '&title=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsTitle').val());
	sData += '&type=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsType').attr('onDemandID'));
	sData += '&taskbyuser=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsTaskBy').attr('onDemandID'));
	sData += '&description=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsDescription').val());
	sData += '&startdate=' + interfaceMasterFormatSave($('#inputInterfaceMainProjectTaskDetailsStartDate').val());
	sData += '&enddate=' + interfaceMasterFormatSave($('#inputInterfaceMainProjectTaskDetailsEndDate').val());
		
	interfaceMasterSave(sParam, sData, 'Task Added');
	interfaceMasterMainViewportShow("#divInterfaceMainTasks", true);
	interfaceProjectTasks();	
}

function interfaceProjectTasksRemove(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	
	var sParam = 'method=PROJECT_TASK_MANAGE&remove=1';
	var sData = 'id=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/project/?' + sParam,
			data: sData,
			dataType: 'text',
			success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
		});
		
}


