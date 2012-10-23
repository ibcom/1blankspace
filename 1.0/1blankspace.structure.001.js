
function interfaceStructureMasterViewport(aParam)
{

	gsObjectName = 'Structure';
	giObjectContext = -1;
	giObject = 26;
	goObjectContext = undefined;
	
	var bShowHome = true;
	var bNew = false;
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
		if (aParam.showNew != undefined) {bNew = aParam.showNew}
		if (bNew) {interfaceStructureNew()};
	}	
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceStructureMasterViewport({showHome: true});',
			move: false
			})		
	}
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Structure"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceStructureSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceStructureSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceStructureSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceStructureNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceStructureNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceStructureSave();
	});
	
	$('#spanInterfaceMasterViewportControlAction').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
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

		interfaceMasterViewportActionShow(this, aHTML.join(''), "interfaceStructureActionOptionsBind()");
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
		
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceStructureSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceStructureSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceStructureHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceStructureHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceStructureSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceStructureSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('#inputInterfaceMasterViewportControlSearch').focus();
	
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
						'<td id="interfaceMasterViewportSetupLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?method=SETUP_STRUCTURE_SEARCH&recent=1',
			dataType: 'json',
			success: interfaceStructureHomeShow
		});
		
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

function interfaceStructureSearch(sXHTMLElementId, aParam)
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
		giObjectContext = sSearchContext;
		var sParam = 'method=SETUP_STRUCTURE_SEARCH&id=' + giSetupContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceStructureShow(aParam, data)}
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
			
			var sParam = 'method=SETUP_STRUCTURE_SEARCH&quicksearch=' + sSearchText;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceStructureSearchShow(aParam, data)}
			});
			
		}
	};	
}

function interfaceStructureSearchShow(aParam, oResponse)
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

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
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
	
	if (giObjectContext == -1)
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
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceStructureSummary();
	});
	
	$('#tdInterfaceViewportControlData').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainData");
		interfaceStructureData();
	});
	
	$('#tdInterfaceViewportControlReporting').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainReporting");
		interfaceStructureReporting();
	});
}

function interfaceStructureShow(aParam, oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceStructureViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this structure.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
					
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceStructureMasterViewport({showHome: false});interfaceStructureSearch("-' + giObjectContext + '")',
			move: false
			})
		
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceStructureSummary()'})

		$('#divInterfaceViewportControlContext').html(goObjectContext.title);
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});	
	}	
}		
		
function interfaceStructureSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
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
						goObjectContext.id +
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
				
function interfaceStructureData(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'divInterfaceMainData';
	var oOptions = {view: true, remove: true};
	var oActions = {add: true};
	
	if (aParam != undefined)
	{
		if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
		if (aParam.options != undefined) {oOptions = aParam.options}
		if (aParam.actions != undefined) {oActions = aParam.actions}
	}		
		
	if (oResponse == undefined)
	{	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/decision/?method=DECISION_DATA_SEARCH&structure=' + giObjectContext,
			dataType: 'json',
			success: function(data) {interfaceStructureData(aParam, data)}
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
						gsLoadingXHTML +
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
				 interfaceMasterStructureDataAdd(aParam);
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
					interfaceMasterStructureDataRemove({xhtmlElementID: this.id});
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
					//interfaceMasterStructureDataAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function interfaceMasterStructureDataAdd(aParam, oResponse)
{
	var sID; 
	
	if (oResponse == undefined)
	{
		var sXHTMLElementID;

		if (aParam != undefined)
		{
			if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
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
			var sData = 'structure=' + giObjectContext;
			sData += '&id=' + interfaceMasterFormatSave(sID);
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainStructureDataAddTitle').val());
			
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
			interfaceMasterMainViewportShow("#divInterfaceMainData");
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
				success: function(data) {interfaceMasterStructureDataAdd(aParam, data)}
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

function interfaceMasterStructureDataRemove(aParam, oResponse)
{
	var sXHTMLElementID;

	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
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
			success: function(data){interfaceMasterStructureDataRemove(aParam, data)}
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

function interfaceStructureNew()
{
	alert('You need to be system administrator to add a strucuture.  If you are a system adminstrator then go to the setup section.');
}