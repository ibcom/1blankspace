/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
function interfaceStructureMasterViewport(oParam)
{
	ns1blankspace.objectName = 'Structure';
	ns1blankspace.objectContext = -1;
	ns1blankspace.object = 26;
	ns1blankspace.objectContextData = undefined;
	
	var bShowHome = true;
	var bNew = false;
	
	if (oParam != undefined)
	{
		if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
		if (oParam.showNew != undefined) {bNew = oParam.showNew}
		if (bNew) {interfaceStructureNew()};
	}	
	
	if (bShowHome)
	{
		ns1blankspaceViewportDestination({
			newDestination: 'interfaceStructureMasterViewport({showHome: true});',
			move: false
			})		
	}
	
	ns1blankspaceReset();		
			
	$('#divns1blankspaceViewportControlSet').button(
	{
		label: "Structure"
	});
	
	$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceStructureSearch('inputns1blankspaceViewportControlSearch')", ns1blankspace.option.typingWait);
	});
	
	$('#spanns1blankspaceViewportControlSearch').click(function(event)
	{
		interfaceStructureSearch('inputns1blankspaceViewportControlSearch');
	});
	
	$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
	{
		interfaceStructureSearchOptions();
	});
	
	$('#spanns1blankspaceViewportControlNew').click(function(event)
	{
		interfaceStructureNew();
	})
	
	$('#spanns1blankspaceViewportControlNewOptions').click(function(event)
	{
		interfaceStructureNewOptions();
	});
	
	$('#spanns1blankspaceViewportControlAction').click(function(event)
	{
		interfaceStructureSave();
	});
	
	$('#spanns1blankspaceViewportControlAction').button({disabled: true});
	
	$('#spanns1blankspaceViewportControlActionOptions').click(function(event)
	{
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableinterfaceActionOptions" class="interfaceActionOptions">';
						
		aHTML[++h] = '<tr id="trinterfaceActionOptions" class="interfaceActionOptions">' +
						'<td id="tdinterfaceActionOptionsRemove" class="interfaceActionOptions">' +
						'Remove' +
						'</td>' +
						'</tr>';

		aHTML[++h] = '</table>';

		ns1blankspaceViewportActionShow(this, aHTML.join(''), "interfaceStructureActionOptionsBind()");
	});
	
	$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
		
	$('#spanns1blankspaceViewportControlSetup').click(function(event)
	{
		interfaceStructureSetup();
	});
	
	$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
	{
		interfaceStructureSetupOptions();
	});
	
	$('#spanns1blankspaceViewportControlHelp').click(function(event)
	{
		interfaceStructureHelp();
	});
	
	$('#spanns1blankspaceViewportControlHelpOptions').click(function(event)
	{
		interfaceStructureHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceStructureSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceStructureSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	$('#inputns1blankspaceViewportControlSearch').focus();
	
	interfaceStructureHomeShow();
	
}

function interfaceStructureActionOptionsBind()
{
	$('#tdinterfaceActionOptionsRemove').click(function(event)
	{
		interfaceStructureRemove();
	});
}

function interfaceStructureHomeShow(oResponse)
{

	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceWebsiteHomeMostLikely" class="interfaceMainColumn1Large">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2Action" style="width:175px;">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
						
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" cellspacing=0>';
										
		aHTML[++h] = '</td></tr></table>';					

		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="ns1blankspaceViewportSetupLarge" class="ns1blankspaceViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_STRUCTURE_SEARCH';
		oSearch.addField('title');
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		oSearch.getResults(interfaceStructureHomeShow)		
	}
	else
	{
		var aHTML = [];
		var h = -1;
	
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceWebsiteHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceWebsiteHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceWebsiteHomeMostLikelyNothing">Click New to create a structure.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{	
			aHTML[++h] = '<table id="tableInterfaceWebsiteHomeMostLikely">';
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceWebsiteHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.title +
										'</td>';
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceWebsiteHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceStructureSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceStructureSearch(sXHTMLElementId, oParam)
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
		
	if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
	{
	
		$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
		
		giSetupContext = sSearchContext;
		ns1blankspace.objectContext = sSearchContext;
		var sParam = 'method=SETUP_STRUCTURE_SEARCH&id=' + giSetupContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceStructureShow(oParam, data)}
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
			
			var sParam = 'method=SETUP_STRUCTURE_SEARCH&quicksearch=' + sSearchText;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceStructureSearchShow(oParam, data)}
			});
			
		}
	};	
}

function interfaceStructureSearchShow(oParam, oResponse)
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
		aHTML[++h] = '<table class="interfaceSearchMedium">';
		aHTML[++h] = '<tbody>'
			
		$.each(oResponse.data.rows, function()
		{	
			iColumn = iColumn + 1;
			
			if (iColumn == 1)
			{
				aHTML[++h] = '<tr class="interfaceSearch">';
			}
			
			aHTML[++h] = '<td class="interfaceSearch" id="title' +
							'-' + this.id + '">' +
							this.title + '</td>';
			
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
			interfaceStructureSearch(event.target.id, 1);
		});
	}	
			
}

function interfaceStructureViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (ns1blankspace.objectContext == -1)
	{
	}
	else
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControlSummary" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
						'</tr>';
						
		aHTML[++h] = '<tr><td>&nbsp;</td></tr>';
			
		aHTML[++h] = '<tr id="trInterfaceViewportControlData" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlData" class="interfaceViewportControl">Data</td>' +
						'</tr>';
			
		aHTML[++h] = '<tr id="trInterfaceViewportControlReporting" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlReporting" class="interfaceViewportControl">Reporting</td>' +
						'</tr>';
	}
	
	aHTML[++h] = '</table>';					
				
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainData" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainReporting" class="divInterfaceViewportMain"></div>';
		
	$('#divInterfaceMain').html(aHTML.join(''));
		
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
		interfaceStructureSummary();
	});
	
	$('#tdInterfaceViewportControlData').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainData");
		interfaceStructureData();
	});
	
	$('#tdInterfaceViewportControlReporting').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainReporting");
		interfaceStructureReporting();
	});
}

function interfaceStructureShow(oParam, oResponse)
{
	$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
	interfaceStructureViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		ns1blankspace.objectContextData = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this structure.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		ns1blankspace.objectContextData = oResponse.data.rows[0];
					
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2x">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		ns1blankspaceViewportDestination({
			newDestination: 'interfaceStructureMasterViewport({showHome: false});interfaceStructureSearch("-' + ns1blankspace.objectContext + '")',
			move: false
			})
		
		ns1blankspaceObjectViewportHistory({functionDefault: 'interfaceStructureSummary()'})

		$('#divInterfaceViewportControlContext').html(ns1blankspace.objectContextData.title);
		$('#spanns1blankspaceViewportControlAction').button({disabled: false});
		$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});	
	}	
}		
		
function interfaceStructureSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (ns1blankspace.objectContextData == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the structure.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryStructureID" class="interfaceMainSummary">Structure ID</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryStructureID" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.id +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2" cellpadding=6>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));	
	}	
}
				
function interfaceStructureData(oParam, oResponse)
{
	var iObjectContext = ns1blankspace.objectContext;
	var sXHTMLElementId = 'divInterfaceMainData';
	var oOptions = {view: true, remove: true};
	var oActions = {add: true};
	
	if (oParam != undefined)
	{
		if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
		if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
		if (oParam.options != undefined) {oOptions = oParam.options}
		if (oParam.actions != undefined) {oActions = oParam.actions}
	}		
		
	if (oResponse == undefined)
	{	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/decision/?method=DECISION_DATA_SEARCH&structure=' + ns1blankspace.objectContext,
			dataType: 'json',
			success: function(data) {interfaceStructureData(oParam, data)}
		});

	}
	else
	{
		if (oActions != undefined)
		{
			var aHTML = [];
			var h = -1;	
						
			aHTML[++h] = '<table id="tableInterfaceMainData" class="interfaceMain">' +
						'<tr id="trInterfaceMainStructureDataRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainStructureDataColumn1" class="interfaceMainColumn1Large">' +
						ns1blankspace.xhtml.loading +
						'</td>' +
						'<td id="tdInterfaceMainStructureDataColumn2" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';					
				
			$('#' + sXHTMLElementId).html(aHTML.join(''));
			sXHTMLElementId = 'tdInterfaceMainStructureDataColumn1';
			
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainStructureDataColumn2" class="interfaceMainColumn2">';
			
			if (oActions.add)
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainStructureDataAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainStructureDataAdd">Add</span>' +
							'</td></tr>';
			}
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainStructureDataColumn2').html(aHTML.join(''));
		
			$('#spanInterfaceMainStructureDataAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				 ns1blankspaceStructureDataAdd(oParam);
			})
			
		}	
	
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableStructureData" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No data.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
		
		}
		else
		{
			aHTML[++h] = '<table id="tableStructureData" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Title</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Last Updated</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdStructureCategory_title-' + this.id + '" class="interfaceMainRow">' +
										this.title + '</td>';
										
				aHTML[++h] = '<td id="tdStructureCategory_last_updated-' + this.id + '" class="interfaceMainRow">' +
										this.lastupdated + '</td>';						
										
				aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
					
				if (oOptions.remove)
				{	
					aHTML[++h] = '<span id="spanStructureDataoptions_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				};	
					
				if (oOptions.view)
				{	
					aHTML[++h] = '<span id="spanStructureData_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
				};	
					
				aHTML[++h] = '</td>';
								
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			
			if (oOptions.remove) 
			{
				$('.interfaceMainRowOptionsRemove').button( {
					text: false,
					icons: {
						primary: "ui-icon-close"
					}
				})
				.click(function() {
					ns1blankspaceStructureDataRemove({xhtmlElementID: this.id});
				})
				.css('width', '15px')
				.css('height', '17px')
			}
			
			if (oOptions.view) 
			{
				$('.interfaceMainRowOptionsView').button( {
					text: false,
					icons: {
						primary: "ui-icon-play"
					}
				})
				.click(function() {
					interfaceStructureDataMasterViewport({showHome: false});
					interfaceStructureDataSearch(this.id);
					//ns1blankspaceStructureDataAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function ns1blankspaceStructureDataAdd(oParam, oResponse)
{
	var sID; 
	
	if (oResponse == undefined)
	{
		var sXHTMLElementID;

		if (oParam != undefined)
		{
			if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		}
		
		if (sXHTMLElementID != undefined)
		{
			var aXHTMLElementID = sXHTMLElementID.split('-');
			var sID = aXHTMLElementID[1];
		}	
	
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureDataTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainSetupStructureDataTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainSetupStructureDataAddTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupStructureDataAddTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainStructureDataAddTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainStructureDataColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainStructureDataAddSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainStructureDataAddSave" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainStructureDataAddSave">Save</span>' +
						'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainStructureDataAddCancel" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainStructureDataAddCancel" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainStructureDataAddCancel">Cancel</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainStructureDataColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainStructureDataAddSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			var sData = 'structure=' + ns1blankspace.objectContext;
			sData += '&id=' + ns1blankspaceFormatSave(sID);
			sData += '&title=' + ns1blankspaceFormatSave($('#inputInterfaceMainStructureDataAddTitle').val());
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/decision/?method=STRUCTURE_DATA_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					interfaceStructureData();
				}
			});
		});
		
		$('#spanInterfaceMainStructureDataAddCancel').button(
		{
			text: "Cancel"
		})
		.click(function() 
		{
			ns1blankspaceMainViewportShow("#divInterfaceMainData");
			interfaceSetupStructureData();
		});
		
		if (sID != undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/descision/?method=DECISION_DATA_SEARCH',
				data: 'id=' + sID,
				dataType: 'json',
				success: function(data) {ns1blankspaceStructureDataAdd(oParam, data)}
			});
		}
		else
		{
			
		}
	}
	else
	{
		if (oResponse.data.rows.length != 0)
		{
			var oObjectContext = oResponse.data.rows[0];
			$('#inputInterfaceMainSetupStructureDataAddTitle').val(oObjectContext.title)
			$('#inputInterfaceMainSetupStructureDataAddTitle').focus();
		}
	}		
}

function ns1blankspaceStructureDataRemove(oParam, oResponse)
{
	var sXHTMLElementID;

	if (oParam != undefined)
	{
		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
	}
	
	var aXHTMLElementID = sXHTMLElementID.split('-');
	var sID = aXHTMLElementID[1];
	
	if (oResponse == undefined)
	{	
		var sParam = 'method=DECISION_DATA_MANAGE&remove=1';
		var sData = 'id=' + sID;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/decision/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){ns1blankspaceStructureDataRemove(oParam, data)}
		});
	}	
	else
	{
		if (oResponse.status == 'OK')
		{
			$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
		}	
	}	
	
}

function interfaceStructureReporting(oParam)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMainReporting" class="interfaceMain">' +
				'<tr id="trInterfaceMainReportingRow1" class="interfaceMainRow1">' +
				'<td id="tdInterfaceMainReportingColumn1" style="width: 100px;" class="interfaceMainColumn1">' +
				ns1blankspace.xhtml.loading +
				'</td>' +
				'<td id="tdInterfaceMainBankAccountColumn2" class="interfaceMainColumn2">' +
				'</td>' +
				'</tr>' +
				'</table>';				
	
	$('#divInterfaceMainReporting').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="">';
	
	aHTML[++h] = '<tr><td id="tdInterfaceMainReport1" class="interfaceMainRow">Report 1</td></tr>';
	aHTML[++h] = '<tr><td id="tdInterfaceMainReport2" class="interfaceMainRow">Report 2</td></tr>';			
					
	aHTML[++h] = '</table>';					
	
	$('#tdInterfaceMainReportingColumn1').html(aHTML.join(''));
	
}

function interfaceStructureNew()
{
	alert('You need to be system administrator to add a strucuture.  If you are a system adminstrator then go to the setup section.');
}