/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

function interfaceHelpURL()
{
	return 'http://community.mydigitalstructure.com';
}

function interfaceHelp()
{

	var aHTML = [];
	var h = -1;
	
	//OPTIONAL GET DOCUMENT
	
	aHTML[++h] = '<table id="tableInterfaceMainHome" class="interfaceMainHome">';
		
	aHTML[++h] = '<tr id="trInterfaceMainHome" class="interfaceMainHome">' +
						'<td id="tdInterfaceMainHome" class="interfaceMainHome">' +
						'Help Page' +
						'</td>' +
					'</tr>'
					
	aHTML[++h] = '</table>'
	
	return aHTML.join('');
}

function interfaceHelpMasterViewport()
{

	glObject = 32;
	ns1blankspace.objectContextDataXML = '';
	ns1blankspace.objectName = 'Help';
	glObjectContext = -1;
			
	$('#divns1blankspaceViewportControlSet').button(
	{
		label: "Help"
	});
	
	$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
	{
		interfaceHelpSearch('inputns1blankspaceViewportControlSearch');
	});
	
	$('#imgns1blankspaceViewportControlSearch').click(function(event)
	{
		interfaceHelpSearch('inputns1blankspaceViewportControlSearch');
	});
	
	$('#imgns1blankspaceViewportControlSearchOptions').click(function(event)
	{
		interfaceHelpSearchOptions();
	});
	
	$('#imgns1blankspaceViewportControlNew').click(function(event)
	{
		interfaceHelpNew();
	})
	
	$('#imgns1blankspaceViewportControlNewOptions').click(function(event)
	{
		interfaceHelpNewOptions();
	});
	
	$('#divns1blankspaceViewportControlAction').click(function(event)
	{
		interfaceHelpave();
	});
	
	$('#imgns1blankspaceViewportControlActionMore').click(function(event)
	{
		interfaceHelpSaveOptions();
	});
	
	$('#imgns1blankspaceViewportControlSetup').click(function(event)
	{
		interfaceHelpSetup();
	});
	
	$('#imgns1blankspaceViewportControlSetupOptions').click(function(event)
	{
		interfaceHelpSetupOptions();
	});
	
	$('#imgns1blankspaceViewportControlHelp').click(function(event)
	{
		interfaceHelpHelp();
	});
	
	$('#imgns1blankspaceViewportControlHelpOptions').click(function(event)
	{
		interfaceHelpHelpOptions();
	});
	
	$('.ns1blankspaceViewportControlBrowse').click(function(event)
	{
		interfaceHelpSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	$('#inputns1blankspaceViewportControlSearch').focus();
	
	interfaceHelpHomeShow();
	
}

function interfaceHelpHomeShow()
{

	$('#divInterfaceViewportControl').html('');

	var aHTML = [];
	var h = -1;
				
	aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
	aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
					'<td id="trInterfaceViewportMain" class="interfaceViewportMain">' +
					'<br /><br />Help/Support Issues...' + 
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';					
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);

}

function interfaceHelpSearch(sXHTMLElementId, oParam)
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
		
	if (sSearchContext != undefined)
	{
	
		$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
		
		glObjectContext = sSearchContext;
		var sParam = 'method=SUPPORT_ISSUE_SEARCH&select=' + glObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/directory/ondemand/support.asp?' + sParam,
			dataType: 'xml',
			success: function(data) {interfaceHelpShow(oParam, data)}
		});
	}
	else
	{
	
		var iMinimumLength = 3;
		var iMaximumColumns = 1;
	
		if (iSource == undefined)
		{
			iSource = ns1blankspace.data.searchSource.text;
		}	
		
		if (sSearchText == undefined)
		{
			sSearchText = $('#inputns1blankspaceViewportControlSearch').val();
		}	
		
		if (iSource == ns1blankspace.data.searchSource.browse)
		{
			iMinimumLength = 1;
			iMaximumColumns = 4;
			var aSearch = sSearch.split('-');
			sSearchText = aSearch[1];
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
		{
			
			ns1blankspaceOptionsSetPosition(sElementId);
			
			var sParam = 'method=SUPPORT_ISSUE_SEARCH&quicksearch=' + sSearchText + 
								'&xhtmlcontext=' + sXHTMLElementId;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/Help/?' + sParam,
				dataType: 'xml',
				success: function(data) {interfaceHelpSearchShow(oParam, data)}
			});
			
		}
	};	
}

function interfaceHelpSearchShow(oParam, oXML)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	var oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		$('#divns1blankspaceViewportControlOptions').hide();
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
		
		aHTML[++h] = '<table class="interfaceSearchMedium">';
		aHTML[++h] = '<tbody>'
			
		for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
		{
			
			var oRow = oRoot.childNodes.item(iRow);
			
			iColumn = iColumn + 1;
			
			if (iColumn == 1)
			{
				aHTML[++h] = '<tr class="interfaceSearch">';
			}
			
			aHTML[++h] = '<td class="interfaceContactType' + onDemandXMLGetData(oRow, "type") + ' interfaceSearch">&nbsp;</td>';
			aHTML[++h] = '<td class="interfaceSearch" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
							'-' + onDemandXMLGetData(oRow, "id") + '">' +
							onDemandXMLGetData(oRow, "reference") +
							'</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		}
    	
		aHTML[++h] = '</tbody></table>';

		$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
		$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
			$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
			interfaceHelpSearch(event.target.id, {source: 1});
		});
	}	
			
}

function interfaceHelpViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl1" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDescription" class="interfaceViewportControl">Description</td>' +
					'</tr>';

	aHTML[++h] = '</table>';					

	if (ns1blankspace.objectContext != -1)
	{
		aHTML[++h] = '<table id="tableInterfaceViewportControl2" class="interfaceViewportControl">';
		
		aHTML[++h] = '<tr id="trInterfaceViewportControlSuggestions" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlSuggestions" class="interfaceViewportControl">Suggestions</td>' +
						'</tr>';
						
		aHTML[++h] = '</table>';					
		
		
		aHTML[++h] = '<table id="tableInterfaceViewportControl3" class="interfaceViewportControl">';
							
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
						'</tr>';
						
		aHTML[++h] = '</table>';					
	}
	
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDescription" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainSuggestions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
		interfaceHelpSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
		interfaceHelpDetails();
	});
	
	$('#tdInterfaceViewportControlScheduling').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainDescription");
		interfaceHelpDescription("divInterfaceMainDescription", true);
	});
	
	$('#tdInterfaceViewportControlSuggestion').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainSuggestions", true);
		interfaceHelpSuggestions("divInterfaceMainSuggestions", true);
	});

	$('#tdInterfaceViewportControlAttachments').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainAttachments", true);
		ns1blankspaceAttachments("divInterfaceMainAttachments", ns1blankspace.data.object.contactperson, glObjectContext);
	});
}

function interfaceHelpShow(oParam, oXML)
{

	$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
	interfaceClientContactViewport();
	
	ns1blankspace.objectContextDataXML = oXML;
	
	var aHTML = [];
	var h = -1;
	
	oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find Help.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
				
		$('#divInterfaceViewportControlContext').html(onDemandXMLGetData(oRow, 'reference'));
		
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		interfaceHelpSummary();
	}	
}		
		
function interfaceHelpSummary()
{

	var aHTML = [];
	var h = -1;
	var oXML = ns1blankspace.objectContextDataXML;
	
	oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find Help.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'description') +
						'</td></tr>';
						
		aHTML[++h] =  '<tr><td id="tdInterfaceMainSummaryStatus" class="interfaceMainSummary">Status</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryStatusValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'statustext') +
						'</td>' +
						'</tr>';
		
		aHTML[++h] =  '<tr><td id="tdInterfaceMainSummarySeverity" class="interfaceMainSummary">Severity</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarySeverityValue" class="interfaceMainSeverityValue">' +
						onDemandXMLGetData(oRow, 'severitytext') +
						'</td>' +
						'</tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2">';
								
		//aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryViewAsTimeline" class="interfaceMainSummary">' +
		//				'<a href="#" id="aInterfaceMainSummaryViewAsTimeline">View As Timeline</a>' +
		//				'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));	
		
		$('#aInterfaceMainSummaryViewAsTimeline').click(function(event)
		{
			interfaceHelpViewAsTimeline();
		});
	}	
}

function interfaceHelpDetails()
{
	var aHTML = [];
	var h = -1;
	
	oRoot = ns1blankspace.objectContextDataXML.getElementsByTagName('ondemand').item(0);
	
	if ($('#divInterfaceMainDetails').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainDetails').attr('onDemandLoading', '');
		var oRow = oRoot.childNodes.item(0);
				
		aHTML[++h] = '<table id="tableInterfaceMainDetails" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainDetailsRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsColumn1" class="interfaceMain">' +
						'</td>' +
						'<td id="tdInterfaceMainDetailsColumn2" class="interfaceMain">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainDetails').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSubject" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSubject" class="interfaceMain">' +
						'Subject' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSubjectValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSubjectValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsSubject" class="inputInterfaceMainText">' +
						'</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceMainDetailsName" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsName" class="interfaceMain">' +
						'Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsNameValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsName" class="inputInterfaceMainText">' +
						'</td></tr>';								
				
		aHTML[++h] = '<tr id="trInterfaceMainDetailsEmail" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsEmail" class="interfaceMain">' +
						'Email' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEmailValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsEmailValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsEmail" class="inputInterfaceMainText">' +
						'</td></tr>';				
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsPhone" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPhone" class="interfaceMain">' +
						'Phone' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsPhoneValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsPhoneValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsPhone" class="inputInterfaceMainText">' +
						'</td></tr>';					
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSeverity" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSeverity" class="interfaceMain">' +
						'Severity' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSeverityValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsSeverityValue" class="interfaceMainSelect">' +
						'<input onDemandType="SELECT" id="inputInterfaceMainDetailsSeverity" class="inputInterfaceMainSelect"' +
							' onDemandMethod="SETUP_SUPPORT_ISSUES_SEVERITY_SEARCH">' +
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
						'<td id="tdInterfaceMainDetailsTypeValue" class="interfaceMainText">' +
						'<input type="radio" id="radioType1" name="radioType" value="1"/>Help Required' +
						'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Suggestion' +
						'<br /><input type="radio" id="radioType3" name="radioType" value="3"/>Comment' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSentTo" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSentTo" class="interfaceMain">' +
						'Send Issue To' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSentTo" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSentToValue" class="interfaceMainText">' +
						'<input type="radio" id="radioSentTo-1" name="radioSentTo" value="-1"/>Support' +
						'<br /><input type="radio" id="radioSentTo-2" name="radioSentTo" value="-2"/>John Smith' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (oRoot.childNodes.length != 0)
		{
			$('#inputInterfaceMainDetailsReference').val(onDemandXMLGetData(oRow, 'reference'));
			$('#inputInterfaceMainDetailsSubject').val(onDemandXMLGetData(oRow, 'subject'));
			$('#inputInterfaceMainDetailsStatus').attr('onDemandID', onDemandXMLGetData(oRow, 'status'));
			$('#inputInterfaceMainDetailsStatus').val(onDemandXMLGetData(oRow, 'statustext'));
		}
		
	}	
}

function interfaceHelpSave()
{

	var sParam = '/ondemand/Help/?method=SUPPORT_ISSUE_MANAGE'
	var sData = (glObjectContext == -1)?'':'&id=' + glObjectContext;
		
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&subject=' + $('#inputInterfaceMainDetailsSubject').val();
	}
	
	ns1blankspaceSave(sParam, sData, 'Support Issue Saved');
		
}