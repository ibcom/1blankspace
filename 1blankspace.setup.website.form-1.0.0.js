/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
var lWebsiteFormSiteId;

function interfaceSetupWebsiteFormMasterViewport(aParam)
{
	ns1blankspace.objectContext = -1;
	ns1blankspace.object = 40;
	ns1blankspace.objectContextData = undefined;
	
	var bShowHome = true;
	var bNew = false;
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
		if (aParam.showNew != undefined) {bNew = aParam.showNew}
		if (aParam.site != undefined) {lWebsiteFormSiteId = aParam.site}
		if (bNew) {interfaceSetupWebsiteFormNew()};
	}	
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceSetupWebsiteFormMasterViewport({showHome: true});',
			move: false
			})		
	}
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Website Forms"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceSetupWebsiteFormSearch('inputInterfaceMasterViewportControlSearch')", ns1blankspace.option.typingWait);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceSetupWebsiteFormSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupWebsiteFormSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceSetupWebsiteFormNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceSetupWebsiteFormNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceSetupWebsiteFormSave();
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

		interfaceMasterViewportActionShow(this, aHTML.join(''), "interfaceSetupWebsiteFormActionOptionsBind()");
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
		
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceSetupWebsiteFormSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupWebsiteFormSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceSetupWebsiteFormHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
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
	
	if (ns1blankspace.option.setFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	
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
						'<td id="interfaceMasterViewportSetupWebsiteLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		
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

function interfaceSetupWebsiteFormSearch(sXHTMLElementId, aParam)
{
	
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	var iMinimumLength = 3;
	var iSource = ns1blankspace.data.searchSource.text;
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
			success: function(data) {interfaceSetupWebsiteFormShow(aParam, data)}
		});
	}
	else
	{
		
		if (sSearchText == undefined)
		{
			sSearchText = $('#inputInterfaceMasterViewportControlSearch').val();
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
			interfaceMasterOptionsSetPosition(sElementId);
			interfaceMasterSearchStart(sElementId);
			
			var sParam = 'method=SETUP_SITE_FORM_SEARCH&quicksearch=' + sSearchText;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceSetupWebsiteFormSearchShow(aParam, data)}
			});			
		}
	};	
}

function interfaceSetupWebsiteFormSearchShow(aParam, oResponse)
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

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
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
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceSetupWebsiteFormSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupWebsiteFormDetails();
	});
	
	$('#tdInterfaceViewportControlLayout').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainStructure");
		interfaceSetupWebsiteFormStructureCheck();
	});
}

function interfaceSetupWebsiteFormShow(aParam, oResponse)
{

	$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
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
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceSetupWebsiteFormMasterViewport({showHome: false});interfaceSetupWebsiteFormSearch("-' + ns1blankspace.objectContext + '")',
			move: false
			})
		
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceSetupWebsiteFormSummary()'})

		var sContext = ns1blankspace.objectContextData.title;
		if (sContext == '') {sContext = 'Form ' + ns1blankspace.objectContextData.id}
		
		$('#divInterfaceViewportControlContext').html(sContext +
				'<br /><br /><span id="spanInterfaceViewportControlSubContext">' + ns1blankspace.objectContextData.sitetext + '</span>');
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});

		$('#divInterfaceViewportControlContext').click(function(event)
		{
			interfaceSetupWebsiteMasterViewport({showHome: false});
			interfaceSetupWebsiteSearch('-' + lWebsiteFormSiteId);
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
	
		lWebsiteFormSiteId = ns1blankspace.objectContextData.site;
		
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
 			interfaceMasterMainViewportShow("#divInterfaceMainAddAttachment");
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

function interfaceSetupWebsiteFormSave(aParam, oResponse)
{
	if (oResponse == undefined)
	{
		var sParam = 'method=SETUP_SITE_FORM_MANAGE';
		var sData = 'site=' + lWebsiteFormSiteId;
		
		if (ns1blankspace.objectContext != -1)
		{
			sParam += '&id=' + ns1blankspace.objectContext	
		}	
		
		if ($('#divInterfaceMainDetails').html() != '')
		{
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsTitle').val());
			sData += '&email=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsEmail').val());
			sData += '&type=' + interfaceMasterFormatSave($('input[name="radioType"]:checked').val());	
		};

		if ($('#divInterfaceMainLayout').html() != '')
		{
			sData += '&headerheight=' + interfaceMasterFormatSave($('#inputInterfaceMainLayoutHeaderHeight').val());
			sData += '&footerheight=' + interfaceMasterFormatSave($('#inputInterfaceMainLayoutFooterHeight').val());
			sData += '&columns=' + interfaceMasterFormatSave($('#inputInterfaceMainLayoutColumns').val());
			sData += '&layout=' + interfaceMasterFormatSave($('input[name="radioLayout"]:checked').val());	
		};	
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceSetupWebsiteFormSave(aParam, data)}
		});
		
	}
	else
	{			
		if (oResponse.status == 'OK')
		{	
			interfaceMasterStatus('Saved');
			
			if (ns1blankspace.objectContext == -1)
			{
				ns1blankspace.objectContext = oResponse.id;
				ns1blankspace.inputDetected = false;
				interfaceSetupWebsiteFormSearch('-' + ns1blankspace.objectContext, {source: 1});
			}	
		}
		else
		{
			interfaceMasterStatus('Could not save the website form!');
		}
	}
}

function interfaceSetupWebsiteFormNew(aParam)
{
	ns1blankspace.objectContextData = undefined
	ns1blankspace.objectContext = -1;
	interfaceSetupWebsiteFormViewport();
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	interfaceSetupWebsiteFormDetails();
}

function interfaceSetupWebsiteFormRemove(aParam, oResponse)
{		
	var sVerifyCode;
	var sUserVerifyCode;
	
	if (aParam != undefined)
	{
		if (aParam.verifyCode != undefined) {sVerifyCode = aParam.verifyCode}
		if (aParam.userVerifyCode != undefined) {sUserVerifyCode = aParam.userVerifyCode}
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
		
		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		
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
			success: function(data){interfaceSetupWebsiteFormRemove(aParam, data)}
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

function interfaceSetupWebsiteFormStructureCheck(aParam)
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
					interfaceSetupWebsiteFormStructure(aParam)
				}
		});
	}
	else
	{
		interfaceSetupWebsiteFormStructure(aParam);
	}
}

function interfaceSetupWebsiteFormStructure(aParam, oResponse)
{
	var iObjectContext = ns1blankspace.objectContext;
	var sXHTMLElementId = 'divInterfaceMainStructure';
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
			url: '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_SEARCH&structure=' + ns1blankspace.objectContextData.structure + '&category=' + ns1blankspace.objectContextData.structurecategory,
			dataType: 'json',
			success: function(data) {interfaceSetupWebsiteFormStructure(aParam, data)}
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
				 interfaceMasterWebsiteFormStructureAdd(aParam);
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
					interfaceMasterWebsiteFormStructureRemove({xhtmlElementID: this.id});
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
					interfaceMasterWebsiteFormStructureAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function interfaceMasterWebsiteFormStructureAdd(aParam, oResponse)
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
			sData += '&id=' + interfaceMasterFormatSave(sID);
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainSetupWebsiteFormStructureAddTitle').val());
			sData += '&datatype=' + interfaceMasterFormatSave($('input[name="radioDataType"]:checked').val());	
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					interfaceMasterMainViewportShow("#divInterfaceMainStructure");
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
			interfaceMasterMainViewportShow("#divInterfaceMainStructure");
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
				success: function(data) {interfaceMasterWebsiteFormStructureAdd(aParam, data)}
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

function interfaceMasterWebsiteFormStructureRemove(aParam, oResponse)
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
			success: function(data){interfaceMasterWebsiteFormStructureRemove(aParam, data)}
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