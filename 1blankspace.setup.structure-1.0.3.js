/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

function interfaceSetupStructureMasterViewport(oParam)
{
	gsSetupName = 'Website';
	giSetupContext = -1;
	ns1blankspace.objectContext = -1;
	ns1blankspace.object = 40;
	ns1blankspace.objectContextData = undefined;
	
	var bShowHome = true;
	var bNew = false;
	
	if (oParam != undefined)
	{
		if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
		if (oParam.showNew != undefined) {bNew = oParam.showNew}
		if (bNew) {interfaceSetupStructureNew()};
	}	
	
	if (bShowHome)
	{
		ns1blankspaceViewportDestination({
			newDestination: 'interfaceSetupStructureMasterViewport({showHome: true});',
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
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceSetupStructureSearch('inputns1blankspaceViewportControlSearch')", ns1blankspace.option.typingWait);
	});
	
	$('#spanns1blankspaceViewportControlSearch').click(function(event)
	{
		interfaceSetupStructureSearch('inputns1blankspaceViewportControlSearch');
	});
	
	$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupStructureSearchOptions();
	});
	
	$('#spanns1blankspaceViewportControlNew').click(function(event)
	{
		interfaceSetupStructureNew();
	})
	
	$('#spanns1blankspaceViewportControlNewOptions').click(function(event)
	{
		interfaceSetupStructureNewOptions();
	});
	
	$('#spanns1blankspaceViewportControlAction').click(function(event)
	{
		interfaceSetupStructureSave();
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

		ns1blankspaceViewportActionShow(this, aHTML.join(''), "interfaceSetupStructureActionOptionsBind()");
	});
	
	$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
		
	$('#spanns1blankspaceViewportControlSetup').click(function(event)
	{
		interfaceSetupStructureSetup();
	});
	
	$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupStructureSetupOptions();
	});
	
	$('#spanns1blankspaceViewportControlHelp').click(function(event)
	{
		interfaceSetupStructureHelp();
	});
	
	$('#spanns1blankspaceViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupStructureHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupStructureSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupStructureSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
	
	if (ns1blankspace.option.richTextEditing)
	{
	
		tinyMCE.init(
		{
			mode : "none",
			height : "200px", 
			width : "100%",
			theme : "advanced",

    		theme_advanced_buttons1 : "bold,italic,underline,link,unlink,bullist,blockquote,undo", 
    		theme_advanced_buttons2 : "", 
    		theme_advanced_buttons3 : "",
		
			font_size_style_values : "8pt,10pt,12pt,14pt,18pt,24pt,36pt",
			
			relative_urls : false, 
			remove_script_host : false, 
			convert_urls : false, 
			visual : true, 
			gecko_spellcheck : true,
			content_css : ns1blankspace.xhtml.editorCSS,
			
			external_link_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH", 
			external_image_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext, 
			media_external_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext, 
		});				
	}
	
	if (bShowHome) {interfaceSetupStructureHomeShow()};	
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
						ns1blankspace.xhtml.loading +
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
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_SEARCH&recent=1',
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

function interfaceSetupStructureSearch(sXHTMLElementId, oParam)
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
			url: '/ondemand/setup/setup_structure.asp?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceSetupStructureShow(oParam, data)}
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
				url: '/ondemand/setup/setup_structure.asp?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceSetupStructureSearchShow(oParam, data)}
			});
			
		}
	};	
}

function interfaceSetupStructureSearchShow(oParam, oResponse)
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
	
	if (ns1blankspace.objectContext == -1)
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
		/*					
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlAutomation" class="interfaceViewportControl">Automation</td>' +
						'</tr>';
		*/				
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
		ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
		interfaceSetupStructureSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupStructureDetails();
	});
	
	$('#tdInterfaceViewportControlCategory').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainCategory");
		interfaceSetupStructureCategory();
	});
	
	$('#tdInterfaceViewportControlElement').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainElement", true);
		interfaceSetupStructureElement();
	});
	
	$('#tdInterfaceViewportControlAutomation').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainAutomation", true);
		interfaceSetupStructureAutomation();
	});
	
	$('#tdInterfaceViewportControlGrouping').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainGrouping", true);
		interfaceSetupStructureGrouping();
	});
}

function interfaceSetupStructureShow(oParam, oResponse)
{

	$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
	interfaceSetupStructureViewport();
	
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
			newDestination: 'interfaceSetupStructureMasterViewport({showHome: false});interfaceSetupStructureSearch("-' + ns1blankspace.objectContext + '")',
			move: false
			})
		
		ns1blankspaceObjectViewportHistory({functionDefault: 'interfaceSetupStructureSummary()'})

		$('#divInterfaceViewportControlContext').html(ns1blankspace.objectContextData.title);
		$('#spanns1blankspaceViewportControlAction').button({disabled: false});
		$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});	
	}	
}		
		
function interfaceSetupStructureSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (ns1blankspace.objectContextData == undefined)
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
		
		if (ns1blankspace.objectContextData != undefined)
		{
			$('#inputInterfaceMainDetailsTitle').val(ns1blankspace.objectContextData.title);
			$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioStatus"][value="2"]').attr('checked', true);	
		}
	}	
}

function interfaceSetupStructureSave(oParam, oResponse)
{
	if (oResponse == undefined)
	{
		var sParam = 'method=SETUP_STRUCTURE_MANAGE';
		var sData = '_=1';
		
		if (ns1blankspace.objectContext != -1)
		{
			sParam += '&id=' + ns1blankspace.objectContext	
		}	
		
		if ($('#divInterfaceMainDetails').html() != '')
		{
			sData += '&title=' + ns1blankspaceFormatSave($('#inputInterfaceMainDetailsTitle').val());
			sData += '&status=' + ns1blankspaceFormatSave($('input[name="radioStatus"]:checked').val());	
		};
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/setup_structure.asp?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceSetupStructureSave(oParam, data)}
		});
		
	}
	else
	{			
		if (oResponse.status == 'OK')
		{	
			ns1blankspaceStatus('Saved');
			
			if (ns1blankspace.objectContext == -1)
			{
				ns1blankspace.objectContext = oResponse.id;
				ns1blankspace.inputDetected = false;
				interfaceSetupStructureSearch('-' + ns1blankspace.objectContext, {source: 1});
			}	
		}
		else
		{
			ns1blankspaceStatus('Could not save the structure!');
		}
	}
}

function interfaceSetupStructureCategory(oParam, oResponse)
{
	var iObjectContext = ns1blankspace.objectContext;
	var sXHTMLElementId = 'divInterfaceMainCategory';
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
			url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_CATEGORY_SEARCH&structure=' + ns1blankspace.objectContext,
			dataType: 'json',
			success: function(data) {interfaceSetupStructureCategory(oParam, data)}
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
						ns1blankspace.xhtml.loading +
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
				 ns1blankspaceSetupStructureCategoryAdd(oParam);
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
					ns1blankspaceSetupStructureCategoryRemove({xhtmlElementID: this.id});
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
					ns1blankspaceSetupStructureCategoryAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function ns1blankspaceSetupStructureCategoryAdd(oParam, oResponse)
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
			var sData = 'structure=' + ns1blankspace.objectContext;
			sData += '&id=' + ns1blankspaceFormatSave(sID);
			sData += '&title=' + ns1blankspaceFormatSave($('#inputInterfaceMainSetupStructureCategoryAddTitle').val());
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_CATEGORY_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					//ns1blankspaceMainViewportShow("#divInterfaceMainCategory");
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
			ns1blankspaceMainViewportShow("#divInterfaceMainCategory");
			interfaceSetupSetupStructureCategory();
		});
		
		if (sID != undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_CATEGORY_SEARCH',
				data: 'id=' + sID,
				dataType: 'json',
				success: function(data) {ns1blankspaceSetupStructureCategoryAdd(oParam, data)}
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

function ns1blankspaceSetupStructureCategoryRemove(oParam, oResponse)
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
		var sParam = 'method=SETUP_STRUCTURE_CATEGORY_MANAGE&remove=1';
		var sData = 'id=' + sID;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/setup_structure.asp?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){ns1blankspaceSetupStructureCategoryRemove(oParam, data)}
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

function interfaceSetupStructureElement(oParam, oResponse)
{
	var iObjectContext = ns1blankspace.objectContext;
	var sXHTMLElementId = 'divInterfaceMainElement';
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
			url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_CATEGORY_SEARCH&structure=' + ns1blankspace.objectContext,
			dataType: 'json',
			success: function(data) {interfaceSetupStructureElement(oParam, data)}
		});

	}
	else
	{
	
		var aHTML = [];
		var h = -1;	
					
		aHTML[++h] = '<table id="tableInterfaceMainPages" class="interfaceMain">' +
					'<tr id="trInterfaceMainSetupStructureElementRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSetupStructureElementColumnCategory" style="width:100px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
						ns1blankspace.xhtml.loading + '</td>' +
					'<td id="tdInterfaceMainSetupStructureElementColumnElement1" style="width:175px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn2">' +
					'</td>' +
					'<td id="tdInterfaceMainSetupStructureElementColumnElement2" style="width:305px;padding-right:15px;font-size:0.875em;" class="interfaceMainColumn2">' +
					'</td>' +
					'<td id="tdInterfaceMainSetupStructureElementColumnElement3" class="interfaceMainColumn2">' +
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
									
					aHTML[++h] = '<td id="tdStructureCategory_title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect category">' +
											this.title + '</td>';
											
					aHTML[++h] = '</tr>';
				});
				
				aHTML[++h] = '</tbody></table>';

				$('#tdInterfaceMainSetupStructureElementColumnCategory').html(aHTML.join(''));
	
				$('td.category').click(function(event)
				{
					var sXHTMLElementId = event.target.id;
					var aId = sXHTMLElementId.split('-');
					
					interfaceSetupStructureCategoryElements({xhtmlElementID: 'tdInterfaceMainSetupStructureElementColumnElement1', category: aId[1]});
					
				});
		}
	}	
}

function interfaceSetupStructureCategoryElements(oParam, oResponse)
{
	var iObjectContext = ns1blankspace.objectContext;
	var sXHTMLElementId = 'tdInterfaceMainSetupStructureElementColumnElement1';
	var oOptions = {view: true, remove: true, automation: true};
	var oActions = {add: true};
	var iCategory;
	
	if (oParam != undefined)
	{
		if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
		if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
		if (oParam.options != undefined) {oOptions = oParam.options}
		if (oParam.actions != undefined) {oActions = oParam.actions}
		if (oParam.category != undefined) {iCategory = oParam.category}
	}		
		
	if (oResponse == undefined)
	{	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_ELEMENT_SEARCH&category=' + iCategory,
			dataType: 'json',
			success: function(data) {interfaceSetupStructureCategoryElements(oParam, data)}
		});

	}
	else
	{
		var aHTML = [];
		var h = -1;	
			
		aHTML[++h] = '<table style="margin-top:20px;">';
			
		aHTML[++h] = '<tr><td class="interfaceViewportControlSub">' +
						'No element selected.' +
						'<br /><br/ >Click the gear icon to set up automation (issue creation) for an element.' +
					'</td></tr>';

		aHTML[++h] = '</table>';		
		
		$('#tdInterfaceMainSetupStructureElementColumnElement2').html(aHTML.join(''));
			
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
			
			$('#tdInterfaceMainSetupStructureElementColumnElement3').html(aHTML.join(''));
		
			$('#spanInterfaceMainSetupStructureAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				 ns1blankspaceSetupStructureElementAdd(oParam);
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

			$('#tdInterfaceMainSetupStructureElementColumnElement1').html(aHTML.join(''));
		
		}
		else
		{
			aHTML[++h] = '<table id="tableClientAudits" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdSetupStructureElement_title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect element">' +
										this.title + '</td>';				
										
				aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
				
				if (oOptions.automation)
				{	
					aHTML[++h] = '<span id="spanSetupStructureElement_options_view-' + this.id + '" class="interfaceMainRowOptionsAutomation"></span>';
				};	
					
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

			$('#tdInterfaceMainSetupStructureElementColumnElement1').html(aHTML.join(''));
			
			if (oOptions.remove) 
			{
				$('.interfaceMainRowOptionsRemove').button( {
					text: false,
					icons: {
						primary: "ui-icon-close"
					}
				})
				.click(function() {
					ns1blankspaceSetupStructureElementRemove({xhtmlElementID: this.id});
				})
				.css('width', '15px')
				.css('height', '17px')
			}
			
			if (oOptions.view) 
			{
				$('td.element').click(function() {
					ns1blankspaceSetupStructureElementAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
			
			if (oOptions.automation) 
			{
				$('.interfaceMainRowOptionsAutomation').button( {
					text: false,
					icons: {
						primary: "ui-icon-gear"
					}
				})
				.click(function() {
					interfaceSetupStructureAutomation({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function ns1blankspaceSetupStructureElementAdd(oParam, oResponse)
{
	var sID; 
	var iDefaultCategory;
	
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
	
		for (edId in tinyMCE.editors) 
					tinyMCE.editors[edId].destroy(true);
					
		ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;
	
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupSetupStructureElementTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainSetupSetupStructureElementTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainSetupSetupStructureElementAddTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupSetupStructureElementAddTitleValue" class="interfaceMainText">' +
						'<textarea rows="3" cols="35"  id="inputInterfaceMainSetupStructureElementAddTitle" class="inputInterfaceMainTextMultiSmall" style="height: 80px;"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainSetupSetupStructureElementDescription" class="interfaceMain">' +
						'<td id="tdInterfaceMainSetupSetupStructureElementDescription" class="interfaceMain">' +
						'Description' +
						'</td></tr>' +
						'<tr id="trInterfaceMainSetupSetupStructureElementAddDescriptionValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupSetupStructureElementAddDescriptionValue" class="interfaceMainText">' +
						'<textarea rows="3" cols="35" id="inputInterfaceMainSetupStructureElementAddDescription' +
						 			ns1blankspace.counter.editor + '" data-editorcount="' + ns1blankspace.counter.editor + 
									'" class="inputInterfaceMainTextMultiLarge" style="height: 125px;"></textarea>' +
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
			url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_CATEGORY_SEARCH',
			data: 'structure=' + ns1blankspace.objectContext,
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
		
		$('#tdInterfaceMainSetupStructureElementColumnElement2').html(aHTML.join(''));
		
		if (ns1blankspace.option.richTextEditing)
		{
			tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainSetupStructureElementAddDescription' + ns1blankspace.counter.editor);
		}
	
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em;">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<span style="width:70px;" id="spanInterfaceMainSetupStructureElementAddSave">Save</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupStructureElementColumnElement3').html(aHTML.join(''));
		
		$('#spanInterfaceMainSetupStructureElementAddSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			var sData = 'structure=' + ns1blankspace.objectContext;
			sData += '&id=' + ns1blankspaceFormatSave(sID);
			sData += '&title=' + ns1blankspaceFormatSave($('#inputInterfaceMainSetupStructureElementAddTitle').val());
			sData += '&datatype=' + ns1blankspaceFormatSave($('input[name="radioDataType"]:checked').val());
			sData += '&category=' + ns1blankspaceFormatSave($('input[name="radioCategory"]:checked').val());
			sData += '&textcolour=' + ns1blankspaceFormatSave($('#inputInterfaceMainSetupSetupStructureElementAddTextColour').val());
			sData += '&backgroundcolour=' + ns1blankspaceFormatSave($('#inputInterfaceMainSetupSetupStructureElementAddBackgroundColour').val());
			sData += '&displayorder=' + ns1blankspaceFormatSave($('#inputInterfaceMainSetupSetupStructureElementAddDisplayOrder').val());
			sData += '&description=' + ns1blankspaceFormatSave(tinyMCE.get('inputInterfaceMainSetupStructureElementAddDescription' + ns1blankspace.counter.editor).getContent());
				
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_ELEMENT_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					$('#tdSetupStructureElement_title-' + sID).html($('#inputInterfaceMainSetupStructureElementAddTitle').val());
					$('#tdInterfaceMainSetupStructureElementColumnElement2').html('Element has been saved.');
				}
			});
		});
		
		if (sID != undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_ELEMENT_SEARCH',
				data: 'id=' + sID,
				dataType: 'json',
				success: function(data) {ns1blankspaceSetupStructureElementAdd(oParam, data)}
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
			$('#inputInterfaceMainSetupStructureElementAddTitle').val(oObjectContext.title);
			
			var sHTML = ns1blankspaceFormatXHTML(oObjectContext.description);
			
			tinyMCE.get('inputInterfaceMainSetupStructureElementAddDescription' + ns1blankspace.counter.editor).setContent(sHTML)
			
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

function ns1blankspaceSetupStructureElementRemove(oParam, oResponse)
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
		var sParam = 'method=SETUP_STRUCTURE_ELEMENT_MANAGE&remove=1';
		var sData = 'id=' + sID;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/setup_structure.asp?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){ns1blankspaceSetupStructureElementRemove(oParam, data)}
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

function interfaceSetupStructureNew(oParam)
{
	ns1blankspace.objectContextData = undefined
	ns1blankspace.objectContext = -1;
	interfaceSetupStructureViewport();
	$('#spanns1blankspaceViewportControlAction').button({disabled: false});
	ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
	interfaceSetupStructureDetails();
}

function interfaceSetupStructureElementOptionsShow(oParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	
	var iStructureElementID = -1;

	if (oParam != undefined)
	{
		if (oParam.structureElementID != undefined) {iStructureElementID = oParam.structureElementID}
	}
	
	if (oResponse == undefined)
	{	
		var sParam = 'method=SETUP_STRUCTURE_ELEMENT_OPTION_SEARCH';
		var sData = 'element=' + iStructureElementID;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/setup_structure.asp?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceSetupStructureElementOptionsShow(oParam, data)}
		});
	}	
	else
	{	
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table style="width:100%" border="0" cellspacing="0" cellpadding="0" id="tableInterfaceElementOption"' +
							' data-structureElement="' + iStructureElementID + '"' +
							' data-method="SETUP_STRUCTURE_ELEMENT_OPTION">';
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
						
				aHTML[++h] = '<td id="tdElementOption_title-' + this.id + '" class="interfaceMainRow interfaceElementOption" style="width:100%">' +
								this.title + '</td>';
					
				if (this.points == '')
				{
					aHTML[++h] = '<td id="tdElementOption_points-' + this.id + '" class="interfaceMainRow interfaceElementOption" style="width:40px;">' +
									'</td>';
				}	
				else
				{		
					aHTML[++h] = '<td id="tdElementOption_points-' + this.id + '" class="interfaceMainRow interfaceElementOption" style="width:40px;">' +
								this.points + '</td>';
				}							
			
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
			interfaceSetupElementOptionEditStart(event.target.id);
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
						
	aHTML[++h] = '<td id="tdElementOption_title-" class="interfaceMainRow interfaceElementOption"></td>';
	
	aHTML[++h] = '<td id="tdElementOption_points-" class="interfaceMainRow interfaceElementOption" style="width:40px;">' +
									'</td>';

	aHTML[++h] = '<td style="width:23px;text-align:right;" id="tdElementOption_delete-' + 
					'" class="interfaceMainRowOptionsDelete"></td>';
	
	aHTML[++h] = '</tr>'
			
	$('#tableInterfaceElementOption tr:first').after(aHTML.join(''));	
	$('#spanns1blankspaceViewportControlNew').button({disabled: true});
	$('#spanInterfaceElementOptionAdd').button({disabled: true});
	
	interfaceSetupElementOptionEditStart("tdElementOption_title-")
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
		var sParam = '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_OPTION_MANAGE&remove=1_vfrt3';
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
	
	sHTML = '<input style="width:100%;" onDemandType="TEXT" id="' + sElementInputId + '" class="inputInterfaceMainValue" ' +
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
	
	//interfaceSetupElementOptionEditSave(sElementId);
	
	var aSearch = sElementId.split('-');
	var sHTML = $('#' + sElementId.replace('td', 'input')).val();

	$('#' + sElementId).html(sHTML);

	interfaceSetupElementOptionEditSave(sElementId);

}

function interfaceSetupElementOptionEditSave(sElementId)
{
	var aElement = sElementId.split('-');
	var sParam = '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_ELEMENT_OPTION_MANAGE'
	
	var sData = 'id=' + aElement[1];
	sData += '&element=' + $('#tableInterfaceElementOption').attr('data-structureElement');
	sData += '&title=' + ns1blankspaceFormatSave($('#tdElementOption_title-' + aElement[1]).html());
	sData += '&points=' + ns1blankspaceFormatSave($('#tdElementOption_points-' + aElement[1]).html());

	if (aElement[1] == '' && $('#' + sElementId).html() == '')
	{
		$('#tableInterfaceElementOption tr:first').next().fadeOut(500);	
		$('#spanns1blankspaceViewportControlNew').button({disabled: false});
		$('#spanInterfaceElementOptionAdd').button({disabled: false});
	}
	else
	{
		$.ajax(
		{
			type: 'POST',
			url: sParam,
			data: sData,
			dataType: 'json',
			success: function(data) 
					{
						if (data.notes == 'ADDED')
						{
							$('#tdElementOption_title-').attr('id','tdElementOption_title-' + data.id);
							$('#tdElementOption_points-').attr('id','tdElementOption_points-' + data.id);
							
							$('td.interfaceElementOption').unbind('click');
								
							$('td.interfaceElementOption').click(function(event)
								{
									interfaceSetupElementOptionEditStart(event.target.id);
								});

							$('#tdElementOption_delete-').attr('id','tdElementOption_delete-' + data.id);
							
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
						ns1blankspaceStatus('Saved')
						$('#spanns1blankspaceViewportControlNew').button({disabled: false});
						$('#spanInterfaceElementOptionAdd').button({disabled: false});
					}
		});
	}			
}

function interfaceSetupStructureAutomation(oParam, oResponse)
{
	var sXHTMLElementID;	
	var iObjectContext = ns1blankspace.objectContext;
	var oOptions = {view: true, remove: true};
	var oActions = {add: true};
	var iElementID;
	
	if (oParam != undefined)
	{
		if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		if (oParam.options != undefined) {oOptions = oParam.options}
		if (oParam.actions != undefined) {oActions = oParam.actions}
		if (oParam.element != undefined) {iElementID = oParam.element}
	}		
	
	if (sXHTMLElementID != undefined)
	{
		var aXHTMLElementID = sXHTMLElementID.split('-');
		iElementID = aXHTMLElementID[1];
		$.extend(true, oParam, {element: iElementID});
	}		
		
	if (oResponse == undefined)
	{	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_AUTOMATION_SEARCH&element=' + iElementID,
			dataType: 'json',
			success: function(data) {interfaceSetupStructureAutomation(oParam, data)}
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
						ns1blankspace.xhtml.loading +
						'</td>' +
						'<td id="tdInterfaceMainSetupStructureAutomationColumn2" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';	
			
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
			
			$('#tdInterfaceMainSetupStructureElementColumnElement3').html(aHTML.join(''));
		
			$('#spanInterfaceMainSetupStructureAutomationAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				 ns1blankspaceSetupStructureAutomationAdd({element: iElementID});
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

			$('#tdInterfaceMainSetupStructureElementColumnElement2').html(aHTML.join(''));
		}
		else
		{
			aHTML[++h] = '<table id="tableSetupStructureCategory" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Automation</td>';
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

			$('#tdInterfaceMainSetupStructureElementColumnElement2').html(aHTML.join(''));
			
			if (oOptions.remove) 
			{
				$('.interfaceMainRowOptionsRemove').button( {
					text: false,
					icons: {
						primary: "ui-icon-close"
					}
				})
				.click(function() {
					ns1blankspaceSetupStructureAutomationRemove({xhtmlElementID: this.id});
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
					ns1blankspaceSetupStructureAutomationAdd({xhtmlElementID: this.id, element: iElementID})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function ns1blankspaceSetupStructureAutomationAdd(oParam, oResponse)
{
	var sID; 
	var iElementID;
	
	if (oResponse == undefined)
	{
		var sXHTMLElementID;

		if (oParam != undefined)
		{
			if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
			if (oParam.element != undefined) {iElementID = oParam.element}
		}
		
		if (sXHTMLElementID != undefined)
		{
			var aXHTMLElementID = sXHTMLElementID.split('-');
			var sID = aXHTMLElementID[1];
		}	
	
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
		
		aHTML[++h] = '<tr class="interfaceMainCaption">';
		aHTML[++h] = '<td class="interfaceMainCaption">Automation</td>';
		aHTML[++h] = '</tr>';
					
		aHTML[++h] = '<tr id="trInterfaceMainSetupSetupStructureAutomationTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainSetupSetupStructureAutomationTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainSetupSetupStructureAutomationAddTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupSetupStructureAutomationAddTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainSetupStructureAutomationAddTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupStructureElementColumnElement2').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<span style="width:70px;" id="spanInterfaceMainSetupStructureAutomationAddSave">Save</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupStructureElementColumnElement3').html(aHTML.join(''));
		
		$('#spanInterfaceMainSetupStructureAutomationAddSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			var sData = 'structure=' + ns1blankspace.objectContext;
			sData += '&element=' + iElementID;
			sData += '&id=' + ns1blankspaceFormatSave(sID);
			sData += '&title=' + ns1blankspaceFormatSave($('#inputInterfaceMainSetupStructureAutomationAddTitle').val());
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_AUTOMATION_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					interfaceSetupStructureAutomation({element: iElementID});
				}
			});
		});
		
		if (sID != undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_AUTOMATION_SEARCH',
				data: 'id=' + sID,
				dataType: 'json',
				success: function(data) {ns1blankspaceSetupStructureAutomationAdd(oParam, data)}
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

function ns1blankspaceSetupStructureAutomationRemove(oParam, oResponse)
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
		var sParam = 'method=SETUP_STRUCTURE_AUTOMATION_MANAGE&remove=1';
		var sData = 'id=' + sID;
		
		$.ajax(
		{
			type: 'DELETE',
			url: '/ondemand/setup/setup_structure.asp?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){ns1blankspaceSetupStructureAutomationRemove(oParam, data)}
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

function interfaceSetupStructureGrouping(oParam, oResponse)
{
	var iObjectContext = ns1blankspace.objectContext;
	var sXHTMLElementId = 'divInterfaceMainGrouping';
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
			url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_DATA_GROUP_SEARCH&structure=' + ns1blankspace.objectContext,
			dataType: 'json',
			success: function(data) {interfaceSetupStructureGrouping(oParam, data)}
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
						ns1blankspace.xhtml.loading +
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
				 ns1blankspaceSetupStructureGroupingAdd(oParam);
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
					ns1blankspaceSetupStructureGroupingRemove({xhtmlElementID: this.id});
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
					ns1blankspaceSetupStructureGroupingAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function ns1blankspaceSetupStructureGroupingAdd(oParam, oResponse)
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
			var sData = 'structure=' + ns1blankspace.objectContext;
			sData += '&id=' + ns1blankspaceFormatSave(sID);
			sData += '&title=' + ns1blankspaceFormatSave($('#inputInterfaceMainSetupStructureGroupingAddTitle').val());
			
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
			ns1blankspaceMainViewportShow("#divInterfaceMainGrouping");
			interfaceSetupSetupStructureGrouping();
		});
		
		if (sID != undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_DATA_GROUP_SEARCH',
				data: 'id=' + sID,
				dataType: 'json',
				success: function(data) {ns1blankspaceSetupStructureGroupingAdd(oParam, data)}
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

function ns1blankspaceSetupStructureGroupingRemove(oParam, oResponse)
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
		var sParam = 'method=SETUP_STRUCTURE_DATA_MANAGE_MANAGE&remove=1';
		var sData = 'id=' + sID;
		
		$.ajax(
		{
			type: 'DELETE',
			url: '/ondemand/setup/setup_structure.asp?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){ns1blankspaceSetupStructureGroupingRemove(oParam, data)}
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

