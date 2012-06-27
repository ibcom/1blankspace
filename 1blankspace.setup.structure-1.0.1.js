function interfaceSetupStructureMasterViewport(aParam)
{

	gsSetupName = 'Website';
	giSetupContext = -1;
	giObjectContext = -1;
	giObject = 40;
	goObjectContext = undefined;
	
	var bShowHome = true;
	var bNew = false;
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
		if (aParam.showNew != undefined) {bNew = aParam.showNew}
		if (bNew) {interfaceSetupStructureNew()};
	}	
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceSetupStructureMasterViewport({showHome: true});',
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
        giKeyPressTimeoutId = setTimeout("interfaceSetupStructureSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceSetupStructureSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupStructureSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceSetupStructureNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceSetupStructureNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceSetupStructureSave();
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

		interfaceMasterViewportActionShow(this, aHTML.join(''), "interfaceSetupStructureActionOptionsBind()");
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
		
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceSetupStructureSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupStructureSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceSetupStructureHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupStructureHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupStructureSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupStructureSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('#inputInterfaceMasterViewportControlSearch').focus();
	
	interfaceSetupStructureHomeShow();
	
}

function interfaceSetupStructureActionOptionsBind()
{
	$('#tdinterfaceActionOptionsRemove').click(function(event)
	{
		interfaceSetupStructureRemove();
	});
}

function interfaceSetupStructureHomeShow(oResponse)
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
			success: interfaceSetupStructureHomeShow
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
			interfaceSetupStructureSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceSetupStructureSearch(sXHTMLElementId, aParam)
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
			success: function(data) {interfaceSetupStructureShow(aParam, data)}
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
				success: function(data) {interfaceSetupStructureSearchShow(aParam, data)}
			});
			
		}
	};	
}

function interfaceSetupStructureSearchShow(aParam, oResponse)
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
			interfaceSetupStructureSearch(event.target.id, 1);
		});
	}	
			
}

function interfaceSetupStructureViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (giObjectContext == -1)
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControlDetails" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
						'</tr>';
	}
	else
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControlSummary" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
						'</tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportControlDetails" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
						'</tr>';
		
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlGrouping" class="interfaceViewportControl">Grouping</td>' +
						'</tr>';		
						
		aHTML[++h] = '<tr><td>&nbsp;</td></tr>';
			
		aHTML[++h] = '<tr id="trInterfaceViewportControlCategory" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlCategory" class="interfaceViewportControl">Categories</td>' +
						'</tr>';

		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlElement" class="interfaceViewportControl">Elements</td>' +
						'</tr>';
							
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlAutomation" class="interfaceViewportControl">Automation</td>' +
						'</tr>';
	}
	
	aHTML[++h] = '</table>';					
				
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainCategory" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainElement" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAutomation" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainGrouping" class="divInterfaceViewportMain"></div>';
				
	$('#divInterfaceMain').html(aHTML.join(''));
		
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceSetupStructureSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupStructureDetails();
	});
	
	$('#tdInterfaceViewportControlCategory').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainCategory");
		interfaceSetupStructureCategory();
	});
	
	$('#tdInterfaceViewportControlElement').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainElement", true);
		interfaceSetupStructureElement();
	});
	
	$('#tdInterfaceViewportControlAutomation').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAutomation", true);
		interfaceSetupStructureAutomation();
	});
	
	$('#tdInterfaceViewportControlGrouping').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainGrouping", true);
		interfaceSetupStructureGrouping();
	});
}

function interfaceSetupStructureShow(aParam, oResponse)
{

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceSetupStructureViewport();
	
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
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2x">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceSetupStructureMasterViewport({showHome: false});interfaceSetupStructureSearch("-' + giObjectContext + '")',
			move: false
			})
		
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceSetupStructureSummary()'})

		$('#divInterfaceViewportControlContext').html(goObjectContext.title);
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});	
	}	
}		
		
function interfaceSetupStructureSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find website.</td></tr>';
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

function interfaceSetupStructureDetails()
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
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSharing" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSharing" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSharing" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSharingValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Enabled' +
						'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Disabled' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsTitle').val(goObjectContext.title);
			$('[name="radioStatus"][value="' + goObjectContext.status + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioStatus"][value="2"]').attr('checked', true);	
		}
	}	
}

function interfaceSetupStructureSave(aParam, oResponse)
{
	if (oResponse == undefined)
	{
		var sParam = 'method=SETUP_STRUCTURE_MANAGE';
		var sData = '_=1';
		
		if (giObjectContext != -1)
		{
			sParam += '&id=' + giObjectContext	
		}	
		
		if ($('#divInterfaceMainDetails').html() != '')
		{
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsTitle').val());
			sData += '&status=' + interfaceMasterFormatSave($('input[name="radioStatus"]:checked').val());	
		};
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceSetupStructureSave(aParam, data)}
		});
		
	}
	else
	{			
		if (oResponse.status == 'OK')
		{	
			interfaceMasterStatus('Saved');
			
			if (giObjectContext == -1)
			{
				giObjectContext = oResponse.id;
				gbInputDetected = false;
				interfaceSetupStructureSearch('-' + giObjectContext, {source: 1});
			}	
		}
		else
		{
			interfaceMasterStatus('Could not save the structure!');
		}
	}
}

function interfaceSetupStructureCategory(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'divInterfaceMainCategory';
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
			url: '/ondemand/setup/?method=SETUP_STRUCTURE_CATEGORY_SEARCH&structure=' + giObjectContext,
			dataType: 'json',
			success: function(data) {interfaceSetupStructureCategory(aParam, data)}
		});

	}
	else
	{
		if (oActions != undefined)
		{
			var aHTML = [];
			var h = -1;	
						
			aHTML[++h] = '<table id="tableInterfaceMainPages" class="interfaceMain">' +
						'<tr id="trInterfaceMainSetupStructureCategoryRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainSetupStructureCategoryColumn1" class="interfaceMainColumn1Large">' +
						gsLoadingXHTML +
						'</td>' +
						'<td id="tdInterfaceMainSetupStructureCategoryColumn2" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';					
				
			$('#' + sXHTMLElementId).html(aHTML.join(''));
			sXHTMLElementId = 'tdInterfaceMainSetupStructureCategoryColumn1';
			
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainSetupStructureCategoryColumn2" class="interfaceMainColumn2">';
			
			if (oActions.add)
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainSetupStructureCategoryAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainSetupStructureCategoryAdd">Add</span>' +
							'</td></tr>';
			}
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSetupStructureCategoryColumn2').html(aHTML.join(''));
		
			$('#spanInterfaceMainSetupStructureCategoryAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				 interfaceMasterSetupStructureCategoryAdd(aParam);
			})
			
		}	
	
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableSetupStructureCategory" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No layout category.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
		
		}
		else
		{
			aHTML[++h] = '<table id="tableSetupStructureCategory" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Title</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdSetupStructureCategory_title-' + this.id + '" class="interfaceMainRow">' +
										this.title + '</td>';
										
				aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
					
				if (oOptions.remove)
				{	
					aHTML[++h] = '<span id="spanSetupStructureCategoryoptions_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				};	
					
				if (oOptions.view)
				{	
					aHTML[++h] = '<span id="spanSetupStructureCategory_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
				};	
					
				aHTML[++h] = '</td>';
								
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			
			if (oOptions.view) 
			{
				$('.interfaceMainRowOptionsRemove').button( {
					text: false,
					icons: {
						primary: "ui-icon-close"
					}
				})
				.click(function() {
					interfaceMasterSetupStructureCategoryRemove({xhtmlElementID: this.id});
				})
				.css('width', '15px')
				.css('height', '17px')
			}
			
			if (oOptions.remove) 
			{
				$('.interfaceMainRowOptionsView').button( {
					text: false,
					icons: {
						primary: "ui-icon-play"
					}
				})
				.click(function() {
					interfaceMasterSetupStructureCategoryAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function interfaceMasterSetupStructureCategoryAdd(aParam, oResponse)
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
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupSetupStructureCategoryTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainSetupSetupStructureCategoryTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainSetupSetupStructureCategoryAddTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupSetupStructureCategoryAddTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainSetupStructureCategoryAddTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupStructureCategoryColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainSetupStructureCategoryAddSave">Save</span>' +
						'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddCancel" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSetupStructureElementAddCancel" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainSetupStructureCategoryAddCancel">Cancel</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupStructureCategoryColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainSetupStructureCategoryAddSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			var sData = 'structure=' + giObjectContext;
			sData += '&id=' + interfaceMasterFormatSave(sID);
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainSetupStructureCategoryAddTitle').val());
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_STRUCTURE_CATEGORY_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					//interfaceMasterMainViewportShow("#divInterfaceMainCategory");
					interfaceSetupStructureCategory();
				}
			});
		});
		
		$('#spanInterfaceMainSetupStructureCategoryAddCancel').button(
		{
			text: "Cancel"
		})
		.click(function() 
		{
			interfaceMasterMainViewportShow("#divInterfaceMainCategory");
			interfaceSetupSetupStructureCategory();
		});
		
		if (sID != undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_STRUCTURE_CATEGORY_SEARCH',
				data: 'id=' + sID,
				dataType: 'json',
				success: function(data) {interfaceMasterSetupStructureCategoryAdd(aParam, data)}
			});
		}
		else
		{
			$('[name="radioDataType"][value="4"]').attr('checked', true);	
		}
	}
	else
	{
		if (oResponse.data.rows.length != 0)
		{
			var oObjectContext = oResponse.data.rows[0];
			$('#inputInterfaceMainSetupStructureCategoryAddTitle').val(oObjectContext.title)
			$('#inputInterfaceMainSetupStructureCategoryAddTitle').focus();
		}
	}		
}

function interfaceMasterSetupStructureCategoryRemove(aParam, oResponse)
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
		var sParam = 'method=SETUP_STRUCTURE_CATEGORY_MANAGE&remove=1';
		var sData = 'id=' + sID;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceMasterSetupStructureCategoryRemove(aParam, data)}
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

function interfaceSetupStructureElement(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'divInterfaceMainElement';
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
			url: '/ondemand/setup/?method=SETUP_STRUCTURE_CATEGORY_SEARCH&structure=' + giObjectContext,
			dataType: 'json',
			success: function(data) {interfaceSetupStructureElement(aParam, data)}
		});

	}
	else
	{
	
		var aHTML = [];
		var h = -1;	
					
		aHTML[++h] = '<table id="tableInterfaceMainPages" class="interfaceMain">' +
					'<tr id="trInterfaceMainSetupStructureElementRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSetupStructureElementColumnCategory" style="width: 100px" class="interfaceMainColumn1">' +
						gsLoadingXHTML + '</td>' +
					'<td id="tdInterfaceMainSetupStructureElementColumnElement" class="interfaceMainColumn2">' +
					'</td>' +
					'<td id="tdInterfaceMainSetupStructureElementColumnEdit" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';					
			
		$('#' + sXHTMLElementId).html(aHTML.join(''));
			
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableSetupStructureElementCategory" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No categories.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainSetupStructureElementColumnCategory').html(aHTML.join(''));
		}
		else
		{
				aHTML[++h] = '<table id="tableStructureCategory" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
				aHTML[++h] = '<tbody>'
				
				$.each(oResponse.data.rows, function()
				{
					aHTML[++h] = '<tr class="interfaceMainRow">';
									
					aHTML[++h] = '<td id="tdStructureCategory_title-' + this.id + '" class="interfaceSearch">' +
											this.title + '</td>';
											
					aHTML[++h] = '</tr>';
				});
				
				aHTML[++h] = '</tbody></table>';

				$('#tdInterfaceMainSetupStructureElementColumnCategory').html(aHTML.join(''));
	
				$('td.interfaceSearch').click(function(event)
				{
					var sXHTMLElementId = event.target.id;
					var aId = sXHTMLElementId.split('-');
					
					interfaceSetupStructureCategoryElements({xhtmlElementID: 'tdInterfaceMainSetupStructureElementColumnElement', category: aId[1]});
					
				});
		}
	}	
}

function interfaceSetupStructureCategoryElements(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'divInterfaceMainElement';
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
			url: '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_SEARCH&structure=' + giObjectContext,
			dataType: 'json',
			success: function(data) {interfaceSetupStructureCategoryElements(aParam, data)}
		});

	}
	else
	{
		if (oActions != undefined)
		{	
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainSetupStructureElementColumn2" class="interfaceMainColumn2">';
			
			if (oActions.add)
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainFormStructureAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainSetupStructureAdd">Add</span>' +
							'</td></tr>';
			}
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSetupStructureElementColumnEdit').html(aHTML.join(''));
		
			$('#spanInterfaceMainSetupStructureAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				 interfaceMasterSetupStructureElementAdd(aParam);
			})
			
		}	
	
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableSetupStructureElement" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No layout elements.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
		
		}
		else
		{
			aHTML[++h] = '<table id="tableClientAudits" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Title</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Type</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdSetupStructureElement_title-' + this.id + '" class="interfaceMainRow">' +
										this.title + '</td>';
										
				aHTML[++h] = '<td id="tdSetupStructureElement_type-' + this.id + '" class="interfaceMainRow">' +
										this.datatypetext + '</td>';
										
				aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
					
				if (oOptions.remove)
				{	
					aHTML[++h] = '<span id="spanSetupStructureElementoptions_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				};	
					
				if (oOptions.view)
				{	
					aHTML[++h] = '<span id="spanSetupStructureElement_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
				};	
					
				aHTML[++h] = '</td>';
								
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainSetupStructureElementColumnElement').html(aHTML.join(''));
			
			if (oOptions.view) 
			{
				$('.interfaceMainRowOptionsRemove').button( {
					text: false,
					icons: {
						primary: "ui-icon-close"
					}
				})
				.click(function() {
					interfaceMasterSetupStructureElementRemove({xhtmlElementID: this.id});
				})
				.css('width', '15px')
				.css('height', '17px')
			}
			
			if (oOptions.remove) 
			{
				$('.interfaceMainRowOptionsView').button( {
					text: false,
					icons: {
						primary: "ui-icon-play"
					}
				})
				.click(function() {
					interfaceMasterSetupStructureElementAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function interfaceMasterSetupStructureElementAdd(aParam, oResponse)
{
	var sID; 
	var iDefaultCategory;
	
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
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupSetupStructureElementTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainSetupSetupStructureElementTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainSetupSetupStructureElementAddTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupSetupStructureElementAddTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainSetupSetupStructureElementAddTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsCategory" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsCategory" class="interfaceMain">' +
						'Category' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsCategory" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsCategoryValue" class="interfaceMainRadio">';
	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?method=SETUP_STRUCTURE_CATEGORY_SEARCH',
			data: 'structure=' + giObjectContext,
			dataType: 'json',
			async: false,
			success: function(oResponse)
			{
				$.each(oResponse.data.rows, function()
				{
					if (iDefaultCategory == undefined) {iDefaultCategory = this.id}
					aHTML[++h] = '<input type="radio" id="radioCategory' + this.id + '" name="radioCategory" value="' + this.id + '"/>' +
										this.title + '<br />';				
				});
			}
		});
		
		aHTML[++h] = '</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDataType" class="interfaceMain">' +
							'<td id="tdInterfaceMainDetailsDataType" class="interfaceMain">' +
							'Data Type' +
							'</td></tr>' +
							'<tr id="trInterfaceMainDetailsDataType" class="interfaceMainText">' +
							'<td id="tdInterfaceMainDetailsDataTypeValue" class="interfaceMainRadio">' +
							'<input type="radio" id="radioDataType4" name="radioDataType" value="4"/>Text (Single Line)' +
							'<br /><input type="radio" id="radioDataType1" name="radioDataType" value="1"/>Text (Multi Line)' +
							'<br /><input type="radio" id="radioDataType3" name="radioDataType" value="3"/>Date' +
							'<br /><input type="radio" id="radioDataType2" name="radioDataType" value="2"/>Select / Choice' +
						'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceMainSetupSetupStructureElementTextColour" class="interfaceMain">' +
							'<td id="tdInterfaceMainSetupSetupStructureElementTextColour" class="interfaceMain">' +
							'Text Colour' +
							'</td></tr>' +
							'<tr id="trInterfaceMainSetupStructureElementAddTextColourValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainSetupStructureElementAddTextColourValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainSetupSetupStructureElementAddTextColour" class="inputInterfaceMainText">' +
							'</td></tr>';			
							
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementBackgroundColour" class="interfaceMain">' +
							'<td id="tdInterfaceMainSetupStructureElementBackgroundColour" class="interfaceMain">' +
							'Background Colour' +
							'</td></tr>' +
							'<tr id="trInterfaceMainSetupStructureElementAddBackgroundColourValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainSetupStructureElementAddBackgroundColourValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainSetupStructureElementAddBackgroundColour" class="inputInterfaceMainText">' +
							'</td></tr>';
										
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementDisplayOrder" class="interfaceMain">' +
							'<td id="tdInterfaceMainSetupStructureElementDisplayOrder" class="interfaceMain">' +
							'Display Order' +
							'</td></tr>' +
							'<tr id="trInterfaceMainSetupStructureElementAddDisplayOrderValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainSetupStructureElementAddDisplayOrderValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainSetupStructureElementAddDisplayOrder" class="inputInterfaceMainText">' +
							'</td></tr>';
							
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddOptionsValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainSetupStructureElementAddOptionsValue" class="interfaceMainText">' +
							'</td></tr>';
																					
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupStructureElementColumnElement').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainSetupStructureElementAddSave">Save</span>' +
						'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddCancel" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSetupStructureElementAddCancel" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainSetupStructureElementAddCancel">Cancel</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupStructureElementColumnEdit').html(aHTML.join(''));
		
		$('#spanInterfaceMainSetupStructureElementAddSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			var sData = 'structure=' + giObjectContext;
			sData += '&id=' + interfaceMasterFormatSave(sID);
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainSetupSetupStructureElementAddTitle').val());
			sData += '&datatype=' + interfaceMasterFormatSave($('input[name="radioDataType"]:checked').val());
			sData += '&category=' + interfaceMasterFormatSave($('input[name="radioCategory"]:checked').val());
			sData += '&textcolour=' + interfaceMasterFormatSave($('#inputInterfaceMainSetupSetupStructureElementAddTextColour').val());
			sData += '&backgroundcolour=' + interfaceMasterFormatSave($('#inputInterfaceMainSetupSetupStructureElementAddBackgroundColour').val());
			sData += '&displayorder=' + interfaceMasterFormatSave($('#inputInterfaceMainSetupSetupStructureElementAddDisplayOrder').val());
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					//interfaceMasterMainViewportShow("#divInterfaceMainStructure");
					interfaceSetupStructureElement();
				}
			});
		});
		
		$('#spanInterfaceMainSetupStructureElementAddCancel').button(
		{
			text: "Cancel"
		})
		.click(function() 
		{
			interfaceMasterMainViewportShow("#divInterfaceMainStructure");
			interfaceSetupStructureElement();
		});
		
		if (sID != undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_SEARCH',
				data: 'id=' + sID,
				dataType: 'json',
				success: function(data) {interfaceMasterSetupStructureElementAdd(aParam, data)}
			});
		}
		else
		{
			$('[name="radioDataType"][value="4"]').attr('checked', true);
			$('[name="radioCategory"][value="' + iDefaultCategory + '"]').attr('checked', true);	
		}
	}
	else
	{
		if (oResponse.data.rows.length != 0)
		{
			var oObjectContext = oResponse.data.rows[0];
			$('#inputInterfaceMainSetupSetupStructureElementAddTitle').val(oObjectContext.title)
			$('[name="radioDataType"][value="' + oObjectContext.datatype + '"]').attr('checked', true);
			$('[name="radioCategory"][value="' + oObjectContext.category + '"]').attr('checked', true);
			$('#inputInterfaceMainSetupSetupStructureElementAddTextColour').val(oObjectContext.textcolour)
			$('#inputInterfaceMainSetupSetupStructureElementAddBackgroundColour').val(oObjectContext.backgroundcolour)
			$('#inputInterfaceMainSetupSetupStructureElementAddDisplayOrder').val(oObjectContext.displayorder)	
			$('#inputInterfaceMainSetupSetupStructureElementAddTitle').focus();
			interfaceSetupStructureElementOptionsShow({structureElementID: oObjectContext.id});
		}
	}
}

function interfaceMasterSetupStructureElementRemove(aParam, oResponse)
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
		var sParam = 'method=SETUP_STRUCTURE_ELEMENT_MANAGE&remove=1';
		var sData = 'id=' + sID;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceMasterSetupStructureElementRemove(aParam, data)}
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

function interfaceSetupStructureNew(aParam)
{
	goObjectContext = undefined
	giObjectContext = -1;
	interfaceSetupStructureViewport();
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	interfaceSetupStructureDetails();
}


function interfaceSetupStructureElementOptionsShow(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	
	var iStructureElementID = -1;

	if (aParam != undefined)
	{
		if (aParam.structureElementID != undefined) {iStructureElementID = aParam.structureElementID}
	}
	
	if (oResponse == undefined)
	{	
		var sParam = 'method=SETUP_STRUCTURE_ELEMENT_OPTION_SEARCH';
		var sData = 'element=' + iStructureElementID;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceSetupStructureElementOptionsShow(aParam, data)}
		});
	}	
	else
	{	
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table style="width:100%" border="0" cellspacing="0" cellpadding="0" id="tableInterfaceElementOption"' +
							' data-structureElement="' + iStructureElementID + '">';
		aHTML[++h] = '<tbody>'
		
		aHTML[++h] = '<tr class="interfaceMainRow">';
		aHTML[++h] = '<td class="interfaceMainCaption">Choices</td>';
		aHTML[++h] = '<td class="interfaceMainCaption">Points</td>';
		aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right"><span id="spanInterfaceElementOptionAdd">Add</span></td>';
		aHTML[++h] = '</tr>';
				
		if (oResponse.data.rows.length == 0)
		{
			//aHTML[++h] = '<tr><td>No choices.</td></tr>'
		}
		else
		{
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
						
				aHTML[++h] = '<td id="tdElementOption-' + this.id + '" class="interfaceMainRow interfaceElementOption">' +
								this.title + '</td>';
								
				aHTML[++h] = '<td id="tdElementOption-' + this.id + '" class="interfaceMainRow interfaceElementOption">' +
								this.points + '</td>';				
			
				aHTML[++h] = '<td style="width:23px;text-align:right;" id="tdElementOption_delete-' + this.id + 
								'" class="interfaceMainRowOptionsDelete"></td>';
			
				aHTML[++h] = '</tr>'
			});
    	}

		aHTML[++h] = '</tbody></table>';

		$('#tdInterfaceMainSetupStructureElementAddOptionsValue').html(aHTML.join(''));
		
		$('#spanInterfaceElementOptionAdd').button({
				text: false,
				 icons: {
					 primary: "ui-icon-plus"
				}
			})
			.click(function() {
				interfaceSetupElementOptionAdd()
			})
			.css('width', '15px')
			.css('height', '20px')	
		
		$('td.interfaceElementOption').click(function(event)
		{
			interfaceSetupElementEditStart(event.target.id);
		});
	
		$('.interfaceMainRowOptionsDelete').button(
			{
				text: false,
				 icons: {
					 primary: "ui-icon-close"
				}
			})
			.click(function() {
				interfaceSetupElementOptionRemove(this.id)
			})
			.css('width', '15px')
			.css('height', '20px')
	}	
}

function interfaceSetupElementOptionAdd()
{
	var aHTML = [];
	var h = -1;
		
	aHTML[++h] = '<tr class="interfaceMainRow">';
						
	aHTML[++h] = '<td id="tdElementOption-" class="interfaceMainRow interfaceElementOption"></td>';
	
	aHTML[++h] = '<td style="width:23px;text-align:right;" id="tdElementOption_delete-' + 
					'" class="interfaceMainRowOptionsDelete"></td>';
	
	aHTML[++h] = '</tr>'
			
	$('#tableInterfaceElementOption tr:first').after(aHTML.join(''));	
	$('#spanInterfaceMasterViewportControlNew').button({disabled: true});
	$('#spanInterfaceElementOptionAdd').button({disabled: true});
	
	interfaceSetupElementOptionEditStart("tdElementOption-")
}

function interfaceSetupElementOptionRemove(sXHTMLElementId)
{
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	
	if (confirm('Are you sure?'))
	{
		var aMethod = gsSetupMethod.split('_');
		var sEndpoint = aMethod[0];
		var sParam = '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_OPTION_MANAGE&remove=1';
		var sData = 'id=' + sSearchContext;
					
		$.ajax(
			{
				type: 'POST',
				url: sParam,
				data: sData,
				dataType: 'text',
				success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
			});
	}
}

function interfaceSetupElementOptionEditStart(sElementId)
{
	var aSearch = sElementId.split('-');
	var sActionElementId = '#' + aSearch[0] + '-options-' + aSearch[2];

	var sHTML = $('#' + sElementId).html();
	
	var sElementInputId = sElementId.replace('td', 'input');
	
	sHTML = '<input style="width:300px;" onDemandType="TEXT" id="' + sElementInputId + '" class="inputInterfaceMainValue" ' +
							'value="' + sHTML + '">'
	
	$('#' + sElementId).html(sHTML);
	$('#' + sElementInputId).focus();
	
	$('#' + sElementInputId).blur(function(event)
	{
		interfaceSetupElementOptionEditStop(sElementId);
	});
}

function interfaceSetupElementOptionEditStop(sElementId)
{
	
	interfaceSetupElementOptionEditSave(sElementId);
	
	var aSearch = sElementId.split('-');
	var sHTML = $('#' + sElementId.replace('td', 'input')).val();

	$('#' + sElementId).html(sHTML);

}

function interfaceSetupElementOptionEditSave(sElementId)
{
	var aMethod = gsSetupMethod.split('_');
	var sEndpoint = aMethod[0];
	var aElement = sElementId.split('-');
	var sParam = '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_OPTION_MANAGE'
	
	var sData = 'id=' + aElement[1];
	sData += '&element=' + $('#tableInterfaceElementOption').attr('data-structureElement');
	sData += '&title=' + $('#' + sElementId.replace('td', 'input')).val();
	
	if (aElement[1] == '' && $('#' + sElementId.replace('td', 'input')).val() == '')
	{
		$('#tableInterfaceElementOption tr:first').next().fadeOut(500);	
		$('#spanInterfaceMasterViewportControlNew').button({disabled: false});
		$('#spanInterfaceElementOptionAdd').button({disabled: false});
	}
	else
	{
		$.ajax(
		{
			type: 'POST',
			url: sParam,
			data: sData,
			dataType: 'text',
			success: function(data) 
					{
						var aReturn = data.split('|');
						if (aReturn[2] == 'ADDED')
						{
							$('#tdElementOption-').attr('id','tdElementOption-' + aReturn[3]);
							
							$('td.interfaceElementOption').unbind('click');
								
							$('td.interfaceElementOption').click(function(event)
								{
									interfaceSetupElementOptionEditStart(event.target.id);
								});

							$('#tdElementOption_delete-').attr('id','tdElementOption_delete-' + aReturn[3]);
							
							$('.interfaceMainRowOptionsDelete').button({
									text: false,
									 icons: {
										 primary: "ui-icon-close"
									}
								})
								.click(function() {
									interfaceSetupElementOptionRemove(this.id)
								})
								.css('width', '15px')
								.css('height', '20px')
						}
						interfaceMasterStatus('Saved')
						$('#spanInterfaceMasterViewportControlNew').button({disabled: false});
						$('#spanInterfaceElementOptionAdd').button({disabled: false});
					}
		});
	}			
}

function interfaceSetupStructureAutomation(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'divInterfaceMainAutomation';
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
			url: '/ondemand/setup/?method=SETUP_STRUCTURE_AUTOMATION_SEARCH&structure=' + giObjectContext,
			dataType: 'json',
			success: function(data) {interfaceSetupStructureAutomation(aParam, data)}
		});
	}
	else
	{
		if (oActions != undefined)
		{
			var aHTML = [];
			var h = -1;	
						
			aHTML[++h] = '<table id="tableInterfaceMainPages" class="interfaceMain">' +
						'<tr id="trInterfaceMainSetupStructureAutomationRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainSetupStructureAutomationColumn1" class="interfaceMainColumn1Large">' +
						gsLoadingXHTML +
						'</td>' +
						'<td id="tdInterfaceMainSetupStructureAutomationColumn2" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';					
				
			$('#' + sXHTMLElementId).html(aHTML.join(''));
			sXHTMLElementId = 'tdInterfaceMainSetupStructureAutomationColumn1';
			
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainSetupStructureAutomationColumn2" class="interfaceMainColumn2">';
			
			if (oActions.add)
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainSetupStructureAutomationAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainSetupStructureAutomationAdd">Add</span>' +
							'</td></tr>';
			}
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSetupStructureAutomationColumn2').html(aHTML.join(''));
		
			$('#spanInterfaceMainSetupStructureAutomationAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				 interfaceMasterSetupStructureAutomationAdd(aParam);
			})
			
		}	
	
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableSetupStructureAutomation" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No automation set up.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
		
		}
		else
		{
			aHTML[++h] = '<table id="tableSetupStructureCategory" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Title</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdSetupStructureCategory_title-' + this.id + '" class="interfaceMainRow">' +
										this.title + '</td>';
										
				aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
					
				if (oOptions.remove)
				{	
					aHTML[++h] = '<span id="spanSetupStructureCategoryoptions_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				};	
					
				if (oOptions.view)
				{	
					aHTML[++h] = '<span id="spanSetupStructureCategory_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
				};	
					
				aHTML[++h] = '</td>';
								
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			
			if (oOptions.view) 
			{
				$('.interfaceMainRowOptionsRemove').button( {
					text: false,
					icons: {
						primary: "ui-icon-close"
					}
				})
				.click(function() {
					interfaceMasterSetupStructureAutomationRemove({xhtmlElementID: this.id});
				})
				.css('width', '15px')
				.css('height', '17px')
			}
			
			if (oOptions.remove) 
			{
				$('.interfaceMainRowOptionsView').button( {
					text: false,
					icons: {
						primary: "ui-icon-play"
					}
				})
				.click(function() {
					interfaceMasterSetupStructureAutomationAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function interfaceMasterSetupStructureAutomationAdd(aParam, oResponse)
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
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupSetupStructureAutomationTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainSetupSetupStructureAutomationTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainSetupSetupStructureAutomationAddTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupSetupStructureAutomationAddTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainSetupStructureAutomationAddTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupStructureAutomationColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainSetupStructureAutomationAddSave">Save</span>' +
						'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddCancel" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSetupStructureElementAddCancel" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainSetupStructureAutomationAddCancel">Cancel</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupStructureAutomationColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainSetupStructureAutomationAddSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			var sData = 'structure=' + giObjectContext;
			sData += '&id=' + interfaceMasterFormatSave(sID);
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainSetupStructureAutomationAddTitle').val());
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_STRUCTURE_AUTOMATION_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					interfaceSetupStructureAutomation();
				}
			});
		});
		
		$('#spanInterfaceMainSetupStructureAutomationAddCancel').button(
		{
			text: "Cancel"
		})
		.click(function() 
		{
			interfaceMasterMainViewportShow("#divInterfaceMainAutomation");
			interfaceSetupSetupStructureAutomation();
		});
		
		if (sID != undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_STRUCTURE_AUTOMATION_SEARCH',
				data: 'id=' + sID,
				dataType: 'json',
				success: function(data) {interfaceMasterSetupStructureAutomationAdd(aParam, data)}
			});
		}
		else
		{
			$('[name="radioDataType"][value="4"]').attr('checked', true);	
		}
	}
	else
	{
		if (oResponse.data.rows.length != 0)
		{
			var oObjectContext = oResponse.data.rows[0];
			$('#inputInterfaceMainSetupStructureAutomationAddTitle').val(oObjectContext.title)
			$('#inputInterfaceMainSetupStructureAutomationAddTitle').focus();
		}
	}		
}

function interfaceMasterSetupStructureAutomationRemove(aParam, oResponse)
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
		var sParam = 'method=SETUP_STRUCTURE_AUTOMATION_MANAGE&remove=1';
		var sData = 'id=' + sID;
		
		$.ajax(
		{
			type: 'DELETE',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceMasterSetupStructureAutomationRemove(aParam, data)}
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

function interfaceSetupStructureGrouping(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'divInterfaceMainGrouping';
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
			url: '/ondemand/setup/?method=SETUP_STRUCTURE_DATA_GROUP_SEARCH&structure=' + giObjectContext,
			dataType: 'json',
			success: function(data) {interfaceSetupStructureGrouping(aParam, data)}
		});
	}
	else
	{
		if (oActions != undefined)
		{
			var aHTML = [];
			var h = -1;	
						
			aHTML[++h] = '<table id="tableInterfaceMainPages" class="interfaceMain">' +
						'<tr id="trInterfaceMainSetupStructureGroupingRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainSetupStructureGroupingColumn1" class="interfaceMainColumn1Large">' +
						gsLoadingXHTML +
						'</td>' +
						'<td id="tdInterfaceMainSetupStructureGroupingColumn2" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';					
				
			$('#' + sXHTMLElementId).html(aHTML.join(''));
			sXHTMLElementId = 'tdInterfaceMainSetupStructureGroupingColumn1';
			
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainSetupStructureGroupingColumn2" class="interfaceMainColumn2">';
			
			if (oActions.add)
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainSetupStructureGroupingAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainSetupStructureGroupingAdd">Add</span>' +
							'</td></tr>';
			}
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSetupStructureGroupingColumn2').html(aHTML.join(''));
		
			$('#spanInterfaceMainSetupStructureGroupingAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				 interfaceMasterSetupStructureGroupingAdd(aParam);
			})
			
		}	
	
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableSetupStructureGrouping" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No Grouping set up.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
		}
		else
		{
			aHTML[++h] = '<table id="tableSetupStructureCategory" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Title</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdSetupStructureCategory_title-' + this.id + '" class="interfaceMainRow">' +
										this.title + '</td>';
										
				aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
					
				if (oOptions.remove)
				{	
					aHTML[++h] = '<span id="spanSetupStructureCategoryoptions_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				};	
					
				if (oOptions.view)
				{	
					aHTML[++h] = '<span id="spanSetupStructureCategory_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
				};	
					
				aHTML[++h] = '</td>';
								
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			
			if (oOptions.view) 
			{
				$('.interfaceMainRowOptionsRemove').button( {
					text: false,
					icons: {
						primary: "ui-icon-close"
					}
				})
				.click(function() {
					interfaceMasterSetupStructureGroupingRemove({xhtmlElementID: this.id});
				})
				.css('width', '15px')
				.css('height', '17px')
			}
			
			if (oOptions.remove) 
			{
				$('.interfaceMainRowOptionsView').button( {
					text: false,
					icons: {
						primary: "ui-icon-play"
					}
				})
				.click(function() {
					interfaceMasterSetupStructureGroupingAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function interfaceMasterSetupStructureGroupingAdd(aParam, oResponse)
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
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupSetupStructureGroupingTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainSetupSetupStructureGroupingTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainSetupStructureGroupingAddTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupStructureGroupingAddTitleValue" class="interfaceMainText">' +
						'<tr id="trInterfaceMainSetupSetupStructureGroupingAddTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupSetupStructureGroupingAddTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainSetupStructureGroupingAddTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupStructureGroupingColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainSetupStructureGroupingAddSave">Save</span>' +
						'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddCancel" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSetupStructureElementAddCancel" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainSetupStructureGroupingAddCancel">Cancel</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupStructureGroupingColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainSetupStructureGroupingAddSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			var sData = 'structure=' + giObjectContext;
			sData += '&id=' + interfaceMasterFormatSave(sID);
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainSetupStructureGroupingAddTitle').val());
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_DATA_GROUP_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					interfaceSetupStructureGrouping();
				}
			});
		});
		
		$('#spanInterfaceMainSetupStructureGroupingAddCancel').button(
		{
			text: "Cancel"
		})
		.click(function() 
		{
			interfaceMasterMainViewportShow("#divInterfaceMainGrouping");
			interfaceSetupSetupStructureGrouping();
		});
		
		if (sID != undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_STRUCTURE_DATA_GROUP_SEARCH',
				data: 'id=' + sID,
				dataType: 'json',
				success: function(data) {interfaceMasterSetupStructureGroupingAdd(aParam, data)}
			});
		}
		else
		{
			$('[name="radioDataType"][value="4"]').attr('checked', true);	
		}
	}
	else
	{
		if (oResponse.data.rows.length != 0)
		{
			var oObjectContext = oResponse.data.rows[0];
			$('#inputInterfaceMainSetupStructureGroupingAddTitle').val(oObjectContext.title)
			$('#inputInterfaceMainSetupStructureGroupingAddTitle').focus();
		}
	}		
}

function interfaceMasterSetupStructureGroupingRemove(aParam, oResponse)
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
		var sParam = 'method=SETUP_STRUCTURE_DATA_MANAGE_MANAGE&remove=1';
		var sData = 'id=' + sID;
		
		$.ajax(
		{
			type: 'DELETE',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceMasterSetupStructureGroupingRemove(aParam, data)}
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

