/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
function interfaceSetupProjectMasterViewport(aParam)
{
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}
	
	giObject = 1;	
	gsObjectName = 'Project Template';
	goObjectContext = undefined;
	giObjectContext = -1;
			
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Project Templates"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		interfaceSetupProjectSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#imgInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceSetupProjectSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#imgInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupProjectSearchOptions();
	});
	
	$('#imgInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceSetupProjectNew();
	})
	
	$('#imgInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceSetupProjectNewOptions();
	});
	
	$('#divInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceSetupProjectSave();
	});
	
	$('#imgInterfaceMasterViewportControlActionMore').click(function(event)
	{
		interfaceSetupProjectSaveOptions();
	});
	
	$('#imgInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceSetupProjectSetup();
	});
	
	$('#imgInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupProjectSetupOptions();
	});
	
	$('#imgInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceSetupProjectHelp();
	});
	
	$('#imgInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupProjectHelpOptions();
	});
	
	$('.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupProjectSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupProjectSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	
	if (bShowHome) {interfaceSetupProjectHomeShow()};
	
}

function interfaceSetupProjectHomeShow(oResponse)
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
		
		var sParam = 'method=PROJECT_SEARCH';
		sParam += '&template=1';
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/project/?' + sParam,
			dataType: 'json',
			success: interfaceSetupProjectHomeShow
		});
		
	}
	else
	{
		var aHTML = [];
		var h = -1;

		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceSetupProjectHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceSetupProjectHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceSetupProjectHomeMostLikelyNothing">Click New to create a project template.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
			aHTML[++h] = '<table id="tableInterfaceSetupProjectHomeMostLikely">';
			aHTML[++h] = '<tr>';
			aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
			aHTML[++h] = '</tr>';

			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceSetupProjectHomeMostLikely_Title-' + this.id + '" class="interfaceHomeMostLikely">' +
										this.reference + '</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceSetupProjectHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceSetupProjectSearch(event.target.id, {source: 1});
		});
	}
}
function interfaceSetupProjectSearch(sXHTMLElementId, aParam)
{
	
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	var iMinimumLength = 3;
	var iSource = giSearchSource_TEXT_INPUT;
	var sSearchText;
	var iMaximumColumns = 1;
	var iRows = 10;
	var sQuickSearchType = '';
	
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
		sParam += '&template=1';
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/project/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceSetupProjectShow(aParam, data)}
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
			sSearchText = aSearch[1];
			sElementId = 'tableInterfaceViewportMasterBrowse';
			sQuickSearchType = 'start';
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == giSearchSource_BROWSE)
		{
			interfaceMasterOptionsSetPosition(sElementId);
			
			var sParam = 'method=PROJECT_SEARCH&quicksearch' + sQuickSearchType + '=' + sSearchText + 
								'&xhtmlcontext=' + sXHTMLElementId;
								sParam += '&template=1';

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/project/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceSetupProjectSearchShow(aParam, data)}
			});
			
		}
	};	
}

function interfaceSetupProjectSearchShow(aParam, oResponse)
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
			aHTML[++h] = '<tr class="interfaceSearch">';

			aHTML[++h] = '<td class="interfaceContactType' + this.type + ' interfaceSearch">&nbsp;</td>';
			aHTML[++h] = '<td class="interfaceSearch" id="' +
							'-' + this.id + '">' +
							this.reference +
							'</td>';
			
			aHTML[++h] = '</tr>'
		});
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceSetupProjectSearch(event.target.id, {source: 1});
		});
	}	
			
}

function interfaceSetupProjectViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl1" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlDescription" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDescription" class="interfaceViewportControl">Description</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlTasks" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlTasks" class="interfaceViewportControl">Tasks</td>' +
					'</tr>';
	
	aHTML[++h] = '</table>';					

	aHTML[++h] = '<table id="tableInterfaceViewportControl3" class="interfaceViewportControl">';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
					'</tr>';
					
	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDescription" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainTasks" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainTaskDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceSetupProjectSummary();
	});
	
	$('#tdInterfaceViewportControlDescription').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDescription");
		interfaceSetupProjectDescription();
	});
	
	$('#tdInterfaceViewportControlTasks').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainTasks", true);
		interfaceSetupProjectTasks();
	});
	
	$('#tdInterfaceViewportControlActions').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainActions", true);
		interfaceMasterActions("divInterfaceMainActions", giObjectPerson, giObjectContext);
	});

	$('#tdInterfaceViewportControlAttachments').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAttachments", true);
		interfaceMasterAttachments("divInterfaceMainAttachments", giObjectPerson, giObjectContext);
	});
}

function interfaceSetupProjectShow(aParam, oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceSetupProjectViewport();
	
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
				
		var sContext = goObjectContext.reference;
		sContext += '<br /><span id="spanInterfaceViewportControlSubContext">(Template)</span>';		
		
		$('#divInterfaceViewportControlContext').html(sContext);
		
		interfaceSetupProjectSummary();
	}	
}		
		
function interfaceSetupProjectSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find project template.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
						goObjectContext.description +
						'</td></tr>';

		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		$('#aInterfaceMainSummaryViewAsTimeline').click(function(event)
		{
			interfaceSetupProjectViewAsTimeline();
		});
	}	
}

function interfaceSetupProjectDescription()
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
			$('#inputInterfaceMainDescription').val(goObjectContext.description);
		}
	
		//tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainDescription');
	}	
}

function interfaceSetupProjectTasks(aParam, oResponse)
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
		var sParam = 'method=PROJECT_TASK_SEARCH&rows=' + giReturnRows +
						'&project=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/project/?',
			data: sParam,
			dataType: 'json',
			success: function(data){interfaceSetupProjectTasks(aParam, data)}
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
								
		aHTML[++h] = '<tr><td id="tdInterfaceMainTasksAdd" class="interfaceMain">' +
						'&nbsp;' +
						'</td></tr>';
								
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainTasksColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainTasksAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			interfaceSetupProjectTaskDetailsAdd();
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
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Title</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = interfaceSetupProjectTasksRow(this)
			});
			
			aHTML[++h] = '</tbody></table>';

			interfaceMasterPaginationList(
			{
				xhtmlElementID: 'tdInterfaceMainTasksColumn1',
				xhtmlContext: 'SetupProjectTasks',
				xhtml: aHTML.join(''),
				showMore: (oResponse.morerows == "true"),
				more: oResponse.moreid,
				rows: giReturnRows,
				functionShowRow: interfaceSetupProjectTasksRow,
				functionNewPage: 'interfaceSetupProjectTasksBind()',
				type: 'json'
			}); 	

			$('#tdInterfaceMainTasksColumn1').html(aHTML.join(''));
			
			interfaceSetupProjectTasksBind();
		}
	}	
}	

function interfaceSetupProjectTasksRow(oRow)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td id="tdSetupProjectTasks_title-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.title + '</td>';
							
	aHTML[++h] = '<td class="interfaceMainRow" style="width: 40px;text-align:right;"><span id="tdSetupProjectTasks_delete-' +
						oRow.id + '" class="interfaceMainRowOptionsDelete">&nbsp;</span>';
	aHTML[++h] = '<span id="tdSetupProjectTasks_select-' + oRow.id + '" class="interfaceMainRowOptionsSelect">&nbsp;</span></td>';
	
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
}	

function interfaceSetupProjectTasksBind()
{
	$('.interfaceMainRowOptionsDelete').button({
				text: false,
				 icons: {
					 primary: "ui-icon-close"
				}
			})
			.click(function() {
				interfaceSetupProjectTasksRemove(this.id)
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
		interfaceSetupProjectTaskMasterViewport({showHome: false});
		interfaceSetupProjectTaskSearch(this.id);
	})
	.css('width', '15px')
	.css('height', '20px')
}

function interfaceSetupProjectSave()
{

	var sParam = '/ondemand/project/?method=PROJECT_MANAGE'
	var sData = (giObjectContext == -1)?'':'&id=' + giObjectContext;
		
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&description=' + interfaceMasterFormatSave($('#inputInterfaceMainDescription').val());
	}
	
	interfaceMasterSave(sParam, sData, 'Project Template Saved');
		
}

function interfaceSetupProjectTaskDetailsAdd(aParam, oResponse)
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
			url: '/ondemand/project/?',
			data: sParam,
			dataType: 'json',
			success: function(data){interfaceSetupProjectTaskDetailsAdd(aParam, data)}
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
			interfaceSetupProjectTaskAddSave(aParam);
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
							'<textarea rows="10" cols="50" style="width:100%;" onDemandType="TEXTMULTI" id="inputInterfaceMainProjectTaskDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
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
	
		aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsTaskDependsOn" class="interfaceMain">' +
							'<td id="tdInterfaceMainProjectTaskDetailsTaskDependsOn" class="interfaceMain">' +
							'Depends On Task' +
							'</td></tr>' +
							'<tr id="trInterfaceMainProjectTaskDetailsTaskDependsOnValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceMainProjectTaskDetailsTaskDependsOnValue" class="interfaceMainSelect">' +
							'<input id="inputInterfaceMainProjectTaskDetailsTaskDependsOn" class="inputInterfaceMainSelect"' +
								' onDemandMethod="/ondemand/project/?rf=XML&method=PROJECT_TASK_SEARCH&project=' + giObjectContext + '">' +
							'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsStartBasedOn" class="interfaceMain">' +
							'<td id="tdInterfaceMainProjectTaskDetailsStartBasedOn" class="interfaceMain">' +
							'Start Date Is Based On' +
							'</td></tr>' +
							'<tr id="trInterfaceMainProjectTaskDetailsStartBasedOnValue" class="interfaceMainRadio">' +
							'<td id="tdInterfaceMainProjectTaskDetailsStartBasedOnValue" class="interfaceMainRadio">' +
							'<input type="radio" id="radioStartBasedOn1" name="radioStartBasedOn" value="1"/>When Dependant Task Completed' +
								'&nbsp;&nbsp;<input type="radio" id="radioStartBasedOn2" name="radioStartBasedOn" value="2"/>Project Start Date<br /><br />';
							'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsStartDays" class="interfaceMain">' +
							'<td id="tdInterfaceMainProjectTaskDetailsStartDays" class="interfaceMain">' +
							'Days Before Start' +
							'</td></tr>' +
							'<tr id="trInterfaceMainProjectTaskDetailsStartDaysValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainProjectTaskDetailsStartDaysValue" class="interfaceMainText">' +
							'<input onDemandType="TEXT" id="inputInterfaceMainProjectTaskDetailsStartDays" class="inputInterfaceMainText">' +
							'</td></tr>';				
	
		aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsDurationDays" class="interfaceMain">' +
							'<td id="tdInterfaceMainProjectTaskDetailsDurationDays" class="interfaceMain">' +
							'Duration (Elapsed Days)' +
							'</td></tr>' +
							'<tr id="trInterfaceMainProjectTaskDetailsDurationDaysValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainProjectTaskDetailsDurationDaysValue" class="interfaceMainText">' +
							'<input onDemandType="TEXT" id="inputInterfaceMainProjectTaskDetailsDurationDays" class="inputInterfaceMainText">' +
							'</td></tr>';
		
	aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsDisplayOrder" class="interfaceMain">' +
							'<td id="tdInterfaceMainProjectTaskDetailsDisplayOrder" class="interfaceMain">' +
							'Display Order' +
							'</td></tr>' +
							'<tr id="trInterfaceMainProjectTaskDetailsDisplayOrderValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainProjectTaskDetailsDisplayOrderValue" class="interfaceMainText">' +
							'<input onDemandType="TEXT" id="inputInterfaceMainProjectTaskDetailsDisplayOrder" class="inputInterfaceMainText">' +
							'</td></tr>';				
		
		aHTML[++h] = '</table>';						
	
		$('#tdInterfaceMainProjectTaskDetailsColumn1').html(aHTML.join(''));
		
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

function interfaceSetupProjectTaskAddSave()
{
	var sParam = '/ondemand/project/?method=PROJECT_TASK_MANAGE'
	var sData = 'project=' + giObjectContext;
	
	sData += '&title=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsTitle').val());
	sData += '&type=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsType').attr('onDemandID'));
	sData += '&taskbyuser=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsTaskBy').attr('onDemandID'));
	sData += '&taskdependson=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsTaskDependsOn').attr('onDemandID'));
	sData += '&taskstartbasedon=' + $('input[name="radioStartBasedOn"]:checked').val();
	sData += '&daysbeforestart=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsStartDays').val());
	sData += '&durationdays=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsDurationDays').val());
	sData += '&displayorder=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsDisplayOrder').val());
	sData += '&description=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsDescription').val());
	
	interfaceMasterSave(sParam, sData, 'Template Task Added');
	interfaceMasterMainViewportShow("#divInterfaceMainTasks", true);
	interfaceSetupProjectTasks();	
}

function interfaceSetupProjectTasksRemove(sXHTMLElementId)
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


