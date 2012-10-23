
$(function()
{
})

window.onbeforeunload = function() 
{
}

function interfaceHelpURL()
{
	return 'http://help.1blankspace.com';
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
	goObjectContextXML = '';
	gsObjectName = 'Help';
	glObjectContext = -1;
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Help"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		interfaceHelpSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#imgInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceHelpSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#imgInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceHelpSearchOptions();
	});
	
	$('#imgInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceHelpNew();
	})
	
	$('#imgInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceHelpNewOptions();
	});
	
	$('#divInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceHelpave();
	});
	
	$('#imgInterfaceMasterViewportControlActionMore').click(function(event)
	{
		interfaceHelpSaveOptions();
	});
	
	$('#imgInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceHelpSetup();
	});
	
	$('#imgInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceHelpSetupOptions();
	});
	
	$('#imgInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceHelpHelp();
	});
	
	$('#imgInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceHelpHelpOptions();
	});
	
	$('.InterfaceMasterViewportControlBrowse').click(function(event)
	{
		interfaceHelpSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('#inputInterfaceMasterViewportControlSearch').focus();
	
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
	
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);

}

function interfaceHelpSearch(sXHTMLElementId, aParam)
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
		
	if (sSearchContext != undefined)
	{
	
		$('#divInterfaceViewportControl').html(gsLoadingXHTML);
		
		glObjectContext = sSearchContext;
		var sParam = 'method=SUPPORT_ISSUE_SEARCH&select=' + glObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/directory/ondemand/support.asp?' + sParam,
			dataType: 'xml',
			success: function(data) {interfaceHelpShow(aParam, data)}
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
			var aSearch = sSearch.split('-');
			sSearchText = aSearch[1];
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == giSearchSource_BROWSE)
		{
			
			interfaceMasterOptionsSetPosition(sElementId);
			
			var sParam = 'method=SUPPORT_ISSUE_SEARCH&quicksearch=' + sSearchText + 
								'&xhtmlcontext=' + sXHTMLElementId;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/Help/?' + sParam,
				dataType: 'xml',
				success: function(data) {interfaceHelpSearchShow(aParam, data)}
			});
			
		}
	};	
}

function interfaceHelpSearchShow(aParam, oXML)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	var oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		$('#divInterfaceMasterViewportControlOptions').hide();
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

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
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

	if (giObjectContext != -1)
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
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceHelpSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceHelpDetails();
	});
	
	$('#tdInterfaceViewportControlScheduling').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDescription");
		interfaceHelpDescription("divInterfaceMainDescription", true);
	});
	
	$('#tdInterfaceViewportControlSuggestion').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSuggestions", true);
		interfaceHelpSuggestions("divInterfaceMainSuggestions", true);
	});

	$('#tdInterfaceViewportControlAttachments').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAttachments", true);
		interfaceMasterAttachments("divInterfaceMainAttachments", giObjectPerson, glObjectContext);
	});
}

function interfaceHelpShow(aParam, oXML)
{

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceClientContactViewport();
	
	goObjectContextXML = oXML;
	
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
	var oXML = goObjectContextXML;
	
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
	
	oRoot = goObjectContextXML.getElementsByTagName('ondemand').item(0);
	
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
	
	interfaceMasterSave(sParam, sData, 'Support Issue Saved');
		
}