/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.websiteFormSite;

function interfaceSetupWebsiteFormMasterViewport(oParam)
{
	ns1blankspace.objectContext = -1;
	ns1blankspace.object = 40;
	ns1blankspace.objectContextData = undefined;
	
	var bShowHome = true;
	var bNew = false;
	
	if (oParam != undefined)
	{
		if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
		if (oParam.showNew != undefined) {bNew = oParam.showNew}
		if (oParam.site != undefined) {ns1blankspace.websiteFormSite = oParam.site}
		if (bNew) {interfaceSetupWebsiteFormNew()};
	}	
	
	if (bShowHome)
	{
		ns1blankspaceViewportDestination({
			newDestination: 'interfaceSetupWebsiteFormMasterViewport({showHome: true});',
			move: false
			})		
	}
	
	ns1blankspaceReset();		
			
	$('#divns1blankspaceViewportControlSet').button(
	{
		label: "Website Forms"
	});
	
	$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceSetupWebsiteFormSearch('inputns1blankspaceViewportControlSearch')", ns1blankspace.option.typingWait);
	});
	
	$('#spanns1blankspaceViewportControlSearch').click(function(event)
	{
		interfaceSetupWebsiteFormSearch('inputns1blankspaceViewportControlSearch');
	});
	
	$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupWebsiteFormSearchOptions();
	});
	
	$('#spanns1blankspaceViewportControlNew').click(function(event)
	{
		interfaceSetupWebsiteFormNew();
	})
	
	$('#spanns1blankspaceViewportControlNewOptions').click(function(event)
	{
		interfaceSetupWebsiteFormNewOptions();
	});
	
	$('#spanns1blankspaceViewportControlAction').click(function(event)
	{
		interfaceSetupWebsiteFormSave();
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

		ns1blankspaceViewportActionShow(this, aHTML.join(''), "interfaceSetupWebsiteFormActionOptionsBind()");
	});
	
	$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
		
	$('#spanns1blankspaceViewportControlSetup').click(function(event)
	{
		interfaceSetupWebsiteFormSetup();
	});
	
	$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupWebsiteFormSetupOptions();
	});
	
	$('#spanns1blankspaceViewportControlHelp').click(function(event)
	{
		interfaceSetupWebsiteFormHelp();
	});
	
	$('#spanns1blankspaceViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupWebsiteFormHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupWebsiteFormSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupWebsiteFormSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
	
	interfaceSetupWebsiteFormHomeShow();
	
}

function interfaceSetupWebsiteFormActionOptionsBind()
{
	$('#tdinterfaceActionOptionsRemove').click(function(event)
	{
		interfaceSetupWebsiteFormRemove();
	});
}

function interfaceSetupWebsiteFormHomeShow(oResponse)
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
						'<td id="ns1blankspaceViewportSetupWebsiteLarge" class="ns1blankspaceViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?method=SETUP_SITE_FORM_SEARCH&recent=1',
			dataType: 'json',
			success: interfaceSetupWebsiteFormHomeShow
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
			aHTML[++h] = '<td class="tdInterfaceWebsiteHomeMostLikelyNothing">Click New to create a website form.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceWebsiteHomeMostLikely">';
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				sTitle = this.title;
				if (sTitle == '') {sTitle = this.message}
				if (sTitle == '') {sTitle = this.typetext}
				sTitle = sTitle + ' (' + this.id + ')';
				
				aHTML[++h] = '<td id="interfaceWebsiteHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										sTitle +
										'</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceWebsiteHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceSetupWebsiteFormSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceSetupWebsiteFormSearch(sXHTMLElementId, oParam)
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
		var sParam = 'method=SETUP_SITE_FORM_SEARCH&id=' + giSetupContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceSetupWebsiteFormShow(oParam, data)}
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
			
			var sParam = 'method=SETUP_SITE_FORM_SEARCH&quicksearch=' + sSearchText;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceSetupWebsiteFormSearchShow(oParam, data)}
			});			
		}
	};	
}

function interfaceSetupWebsiteFormSearchShow(oParam, oResponse)
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
			
			sTitle = this.title;
			if (sTitle == '') {sTitle = this.message}
			if (sTitle == '') {sTitle = this.typetext}
			sTitle = sTitle + ' (' + this.id + ')'
				
			aHTML[++h] = '<td class="interfaceSearch" id="title' +
							'-' + this.id + '">' +
							sTitle + '</td>';
			
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
			interfaceSetupWebsiteFormSearch(event.target.id, 1);
		});
	}	
			
}

function interfaceSetupWebsiteFormViewport()
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
		
		aHTML[++h] = '<tr id="trInterfaceViewportControlLayout" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlLayout" class="interfaceViewportControl">Layout</td>' +
						'</tr>';
	}
	
	aHTML[++h] = '</table>';					
				
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainStructure" class="divInterfaceViewportMain"></div>';
		
	$('#divInterfaceMain').html(aHTML.join(''));
		
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
		interfaceSetupWebsiteFormSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupWebsiteFormDetails();
	});
	
	$('#tdInterfaceViewportControlLayout').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainStructure");
		interfaceSetupWebsiteFormStructureCheck();
	});
}

function interfaceSetupWebsiteFormShow(oParam, oResponse)
{

	$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
	interfaceSetupWebsiteFormViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		ns1blankspace.objectContextData = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find website.</td></tr>';
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
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		ns1blankspaceViewportDestination({
			newDestination: 'interfaceSetupWebsiteFormMasterViewport({showHome: false});interfaceSetupWebsiteFormSearch("-' + ns1blankspace.objectContext + '")',
			move: false
			})
		
		ns1blankspaceObjectViewportHistory({functionDefault: 'interfaceSetupWebsiteFormSummary()'})

		var sContext = ns1blankspace.objectContextData.title;
		if (sContext == '') {sContext = 'Form ' + ns1blankspace.objectContextData.id}
		
		$('#divInterfaceViewportControlContext').html(sContext +
				'<br /><br /><span id="spanInterfaceViewportControlSubContext">' + ns1blankspace.objectContextData.sitetext + '</span>');
		$('#spanns1blankspaceViewportControlAction').button({disabled: false});
		$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});

		$('#divInterfaceViewportControlContext').click(function(event)
		{
			interfaceSetupWebsiteMasterViewport({showHome: false});
			interfaceSetupWebsiteSearch('-' + ns1blankspace.websiteFormSite);
		});		
	}	
}		
		
function interfaceSetupWebsiteFormSummary()
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
	
		ns1blankspace.websiteFormSite = ns1blankspace.objectContextData.site;
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryFormType" class="interfaceMainSummary">Type</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryFormType" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.typetext +
						'</td></tr>';
						
		if (ns1blankspace.objectContextData.message != '')
		{	
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryFormMessage" class="interfaceMainSummary">Message</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryFormMessage" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.message +
						'</td></tr>';
		}				
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2" cellpadding=6>';
							
		//aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTask2" class="interfaceMainColumn2Action" style="width:175px;">' +
		//				'<a href="#" id="aInterfaceMainSummarySetupWebApp">Set up website as a jQuery or jQuery webapp.</a>' +
		//				'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));
		
		$('#aInterfaceMainSummaryAddAttachment').click(function(event)
		{
 			ns1blankspaceMainViewportShow("#divInterfaceMainAddAttachment");
			interfaceSetupWebsiteFormAddAttachment();
		});
		
	}	
}

function interfaceSetupWebsiteFormDetails()
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
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsEmail" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsEmail" class="interfaceMain">' +
						'Email' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEmailValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsEmailValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsEmail" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsType" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsType" class="interfaceMain">' +
						'Type' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsType" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTypeValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioType1" name="radioType" value="1"/>Standard' +
						'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Simple' +
						'<br /><input type="radio" id="radioType3" name="radioType" value="3"/>Advanced' +
						'<br /><input type="radio" id="radioType4" name="radioType" value="4"/>Customised' +
						'<br /><input type="radio" id="radioType5" name="radioType" value="5"/>Newsletter' +
						'<br /><input type="radio" id="radioType6" name="radioType" value="6"/>Suggestion' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
		
		if (ns1blankspace.objectContextData != undefined)
		{
			$('#inputInterfaceMainDetailsTitle').val(ns1blankspace.objectContextData.title);
			$('#inputInterfaceMainDetailsEmail').val(ns1blankspace.objectContextData.email);
			$('[name="radioType"][value="' + ns1blankspace.objectContextData.type + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioType"][value="1"]').attr('checked', true);	
		}
	}	
}

function interfaceSetupWebsiteFormLayout()
{
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainLayout').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainLayout').attr('onDemandLoading', '');
				
		aHTML[++h] = '<table id="tableInterfaceMainLayout" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainLayoutRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainLayoutColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainLayoutColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainLayout').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainLayoutColumn1" class="interfaceMain">';
	
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainLayoutColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainlayoutColumn2" class="interfaceMain">';

		aHTML[++h] = '<tr id="trInterfaceMainLayout" class="interfaceMain">' +
						'<td id="tdInterfaceMainLayout" class="interfaceMain">' +
						'The form includes the following standard attributes:' +
						'</td></tr>' +
						'<tr id="trInterfaceMainLayout" class="interfaceMainText">' +
						'<td id="tdInterfaceMainLayoutValue" class="interfaceMainRadio">' +
						'Organisation Name' +
						'<br />First Name' +
						'<br />Surname' +
						'<br />Email' +
						'<br />Phone' +
						'<br />Mobile' +
						'<br />Mailing Address 1' +
						'<br />Mailing Address 2' +
						'<br />Mailing Suburb' +
						'<br />Mailing Post Code' +
						'<br />Mailing State' +
						'<br />Mailing Country' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainLayoutColumn2').html(aHTML.join(''));
		
		if (ns1blankspace.objectContextData != undefined)
		{
			$('#inputInterfaceMainLayoutHeaderHeight').val(ns1blankspace.objectContextData.headerheight);
			$('#inputInterfaceMainLayoutFooterHeight').val(ns1blankspace.objectContextData.footerheight);
			$('#inputInterfaceMainLayoutColumns').val(ns1blankspace.objectContextData.columns);
			$('[name="radioLayout"][value="' + ns1blankspace.objectContextData.layout + '"]').attr('checked', true);
		}
	
	}	
}

function interfaceSetupWebsiteFormSave(oParam, oResponse)
{
	if (oResponse == undefined)
	{
		var sParam = 'method=SETUP_SITE_FORM_MANAGE';
		var sData = 'site=' + ns1blankspace.websiteFormSite;
		
		if (ns1blankspace.objectContext != -1)
		{
			sParam += '&id=' + ns1blankspace.objectContext	
		}	
		
		if ($('#divInterfaceMainDetails').html() != '')
		{
			sData += '&title=' + ns1blankspaceFormatSave($('#inputInterfaceMainDetailsTitle').val());
			sData += '&email=' + ns1blankspaceFormatSave($('#inputInterfaceMainDetailsEmail').val());
			sData += '&type=' + ns1blankspaceFormatSave($('input[name="radioType"]:checked').val());	
		};

		if ($('#divInterfaceMainLayout').html() != '')
		{
			sData += '&headerheight=' + ns1blankspaceFormatSave($('#inputInterfaceMainLayoutHeaderHeight').val());
			sData += '&footerheight=' + ns1blankspaceFormatSave($('#inputInterfaceMainLayoutFooterHeight').val());
			sData += '&columns=' + ns1blankspaceFormatSave($('#inputInterfaceMainLayoutColumns').val());
			sData += '&layout=' + ns1blankspaceFormatSave($('input[name="radioLayout"]:checked').val());	
		};	
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceSetupWebsiteFormSave(oParam, data)}
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
				interfaceSetupWebsiteFormSearch('-' + ns1blankspace.objectContext, {source: 1});
			}	
		}
		else
		{
			ns1blankspaceStatus('Could not save the website form!');
		}
	}
}

function interfaceSetupWebsiteFormNew(oParam)
{
	ns1blankspace.objectContextData = undefined
	ns1blankspace.objectContext = -1;
	interfaceSetupWebsiteFormViewport();
	$('#spanns1blankspaceViewportControlAction').button({disabled: false});
	ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
	interfaceSetupWebsiteFormDetails();
}

function interfaceSetupWebsiteFormRemove(oParam, oResponse)
{		
	var sVerifyCode;
	var sUserVerifyCode;
	
	if (oParam != undefined)
	{
		if (oParam.verifyCode != undefined) {sVerifyCode = oParam.verifyCode}
		if (oParam.userVerifyCode != undefined) {sUserVerifyCode = oParam.userVerifyCode}
	}
	
	if (sVerifyCode == undefined && ns1blankspace.objectContext != -1)
	{	
		
		var sParam = 'method=SETUP_SITE_MANAGE&remove=1';
		var sData = 'id=' + ns1blankspace.objectContext;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceSetupWebsiteFormRemove({verifyCode: data.verifycode})}
		});
			
	}
	else if (sVerifyCode != undefined && sUserVerifyCode == undefined)
	{
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceActionOptions">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupWebsiteFormRemove" class="interfaceMain">' +
						'<td id="tdInterfaceMainSetupWebsiteFormRemove" class="interfaceMain">' +
						'Enter verification code: ' + sVerifyCode +
						'</td></tr>' +
						'<tr id="trInterfaceMainSetupWebsiteFormRemoveVerifyValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupWebsiteFormRemoveVerifyValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainSetupWebsiteFormRemoveVerify" class="inputInterfaceMainText">' +
						'</td></tr>' +
						'<tr class="interfaceMainText">' +
						'<td class="interfaceMainText">' +
						'<span id="spanInterfaceMainSetupWebsiteFormRemoveVerify">Remove</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
		
		$('#spanInterfaceMainSetupWebsiteFormRemoveVerify').button(
		{
			text: "Remove"
		})
		.click(function() 
		{
			interfaceSetupWebsiteFormRemove({verifyCode: sVerifyCode, userVerifyCode: $('#inputInterfaceMainSetupWebsiteFormRemoveVerify').val()})
		});
	
	}
	else if (sVerifyCode != undefined && sUserVerifyCode != undefined && oResponse == undefined)
	{
		var sParam = 'method=SETUP_SITE_MANAGE&remove=1';
		var sData = 'id=' + ns1blankspace.objectContext + '&verifycode=' + sUserVerifyCode;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceSetupWebsiteFormRemove(oParam, data)}
		});

	}
	else if (oResponse != undefined)
	{
		if (oResponse.notes == 'REMOVED')
		{
			alert("Website removed");
		}
		else
		{
			alert('Cannot remove website!')
		}
	}	
	else
	{
		alert('Cannot remove website!')
	}	
	
}

function interfaceSetupWebsiteFormStructureCheck(oParam)
{

	if (ns1blankspace.objectContextData.structure == '')
	{
		var sParam = 'method=SETUP_SITE_FORM_MANAGE';
		var sData = 'createstructure=1&id=' + ns1blankspace.objectContext
	
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data) 
				{
					ns1blankspace.objectContextData.structure = data.structure;
					ns1blankspace.objectContextData.structurecategory = data.structurecategory;
					interfaceSetupWebsiteFormStructure(oParam)
				}
		});
	}
	else
	{
		interfaceSetupWebsiteFormStructure(oParam);
	}
}

function interfaceSetupWebsiteFormStructure(oParam, oResponse)
{
	var iObjectContext = ns1blankspace.objectContext;
	var sXHTMLElementId = 'divInterfaceMainStructure';
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
			url: '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_SEARCH&structure=' + ns1blankspace.objectContextData.structure + '&category=' + ns1blankspace.objectContextData.structurecategory,
			dataType: 'json',
			success: function(data) {interfaceSetupWebsiteFormStructure(oParam, data)}
		});

	}
	else
	{
		if (oActions != undefined)
		{
			var aHTML = [];
			var h = -1;	
						
			aHTML[++h] = '<table id="tableInterfaceMainPages" class="interfaceMain">' +
						'<tr id="trInterfaceMainWebsiteFormStructureRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainWebsiteFormStructureColumn1" class="interfaceMainColumn1Large">' +
						ns1blankspace.xhtml.loading +
						'</td>' +
						'<td id="tdInterfaceMainWebsiteFormStructureColumn2" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';					
				
			$('#' + sXHTMLElementId).html(aHTML.join(''));
			sXHTMLElementId = 'tdInterfaceMainWebsiteFormStructureColumn1';
			
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainWebsiteFormStructureColumn2" class="interfaceMainColumn2">';
			
			if (oActions.add)
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainFormStructureAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainFormStructureAdd">Add</span>' +
							'</td></tr>';
			}
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainWebsiteFormStructureColumn2').html(aHTML.join(''));
		
			$('#spanInterfaceMainFormStructureAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				 ns1blankspaceWebsiteFormStructureAdd(oParam);
			})
			
		}	
	
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableWebsiteFormStructure" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
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
								
				aHTML[++h] = '<td id="tdWebsiteFormStructure_title-' + this.id + '" class="interfaceMainRow">' +
										this.title + '</td>';
										
				aHTML[++h] = '<td id="tdWebsiteFormStructure_type-' + this.id + '" class="interfaceMainRow">' +
										this.datatypetext + '</td>';
										
				aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
					
				if (oOptions.remove)
				{	
					aHTML[++h] = '<span id="spanWebsiteFormStructureoptions_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				};	
					
				if (oOptions.view)
				{	
					aHTML[++h] = '<span id="spanWebsiteFormStructure_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
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
					ns1blankspaceWebsiteFormStructureRemove({xhtmlElementID: this.id});
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
					ns1blankspaceWebsiteFormStructureAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function ns1blankspaceWebsiteFormStructureAdd(oParam, oResponse)
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
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupWebsiteFormStructureTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainSetupWebsiteFormStructureTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainSetupWebsiteFormStructureAddTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupWebsiteFormStructureAddTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainSetupWebsiteFormStructureAddTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
		
	aHTML[++h] = '<tr id="trInterfaceMainDetailsDataType" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDataType" class="interfaceMain">' +
						'Data Type' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDataType" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsDataTypeValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioDataType4" name="radioDataType" value="4"/>Text (Single Line)' +
						'<br /><input type="radio" id="radioDataType1" name="radioDataType" value="1"/>Text (Multi Line)' +
						'<br /><input type="radio" id="radioDataType3" name="radioDataType" value="3"/>Date' +
						'<br /><input type="radio" id="radioDataType2" name="radioDataType" value="2"/>Numeric' +
						'</td></tr>';
		
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainWebsiteFormStructureColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainWebsiteFormStructureAddSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainWebsiteFormStructureAddSave" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainWebsiteFormStructureAddSave">Save</span>' +
						'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainWebsiteFormStructureAddCancel" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainWebsiteFormStructureAddCancel" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainWebsiteFormStructureAddCancel">Cancel</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainWebsiteFormStructureColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainWebsiteFormStructureAddSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			var sData = 'structure=' + ns1blankspace.objectContextData.structure;
			sData += '&category=' + ns1blankspace.objectContextData.structurecategory;
			sData += '&id=' + ns1blankspaceFormatSave(sID);
			sData += '&title=' + ns1blankspaceFormatSave($('#inputInterfaceMainSetupWebsiteFormStructureAddTitle').val());
			sData += '&datatype=' + ns1blankspaceFormatSave($('input[name="radioDataType"]:checked').val());	
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					ns1blankspaceMainViewportShow("#divInterfaceMainStructure");
					interfaceSetupWebsiteFormStructure();
				}
			});
		});
		
		$('#spanInterfaceMainWebsiteFormStructureAddCancel').button(
		{
			text: "Cancel"
		})
		.click(function() 
		{
			ns1blankspaceMainViewportShow("#divInterfaceMainStructure");
			interfaceSetupWebsiteFormStructure();
		});
		
		if (sID != undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_SEARCH',
				data: 'id=' + sID,
				dataType: 'json',
				success: function(data) {ns1blankspaceWebsiteFormStructureAdd(oParam, data)}
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
			$('#inputInterfaceMainSetupWebsiteFormStructureAddTitle').val(oObjectContext.title)
			$('[name="radioDataType"][value="' + oObjectContext.datatype + '"]').attr('checked', true);
			$('#inputInterfaceMainSetupWebsiteFormStructureAddTitle').focus();
		}
	}		
}

function ns1blankspaceWebsiteFormStructureRemove(oParam, oResponse)
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
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){ns1blankspaceWebsiteFormStructureRemove(oParam, data)}
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