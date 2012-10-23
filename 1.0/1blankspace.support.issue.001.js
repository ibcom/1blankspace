function interfaceSupportIssueMasterViewport(aParam)
{

	giObject = 8;
	gsObjectName = 'Support Issue';
	goObjectContextXML = '';
	giObjectContext = -1;
	
	var bShowHome = true;
	var bNew = false;
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
		if (aParam.showNew != undefined) {bNew = aParam.showNew}
		if (bNew) {interfaceSupportIssueNew()};
	}	
			
	interfaceMasterReset();
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceSupportIssueMasterViewport({showHome: true});',
			move: false
			})		
	}
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Support Issue"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceSupportIssueSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceSupportIssueSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceSupportIssueSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceSupportIssueNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceSupportIssueNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceSupportIssueSave();
	});
	
	$('#spanInterfaceMasterViewportControlAction').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
		
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceSupportIssueSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceSupportIssueHelp();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSupportIssueSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSupportIssueSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('#divInterfaceViewportControl').html('');	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	if (bNew) 
	{
		interfaceSupportIssueNew();
	}
	else
	{
		if (bShowHome) {interfaceSupportIssueHomeShow()};
	}
}

function interfaceSupportIssueHomeShow(oXML)
{

	if (oXML == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceHomeMostLikely" class="interfaceViewportMain">' +
						gsLoadingXHTML + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportHelpLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
				
		//aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
		//			'<td id="tdInterfaceViewportControlHistory" class="interfaceViewportControl">Past Issues</td>' +
		//			'</tr>';	
					
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#tdInterfaceViewportControlByHistory').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMain", true);
			interfaceSupportIssueHistory("divInterfaceMain");
		});
			
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		var sParam = 'method=SUPPORT_ISSUE_SEARCH&byme=1&rows=30';

		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/support/?rf=XML&' + sParam,
			dataType: 'xml',
			success: interfaceSupportIssueHomeShow
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		var oRoot = oXML.getElementsByTagName("ondemand").item(0);
		
		if (oRoot.childNodes.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceSupportIssueHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceHomeMostLikely">';
			aHTML[++h] = '<td class="tdInterfaceHomeMostLikelyNothing">Click New to create a support issue.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
			aHTML[++h] = '<table id="tableInterfaceSupportIssueHomeMostLikely">';
			aHTML[++h] = '<tr>';
			aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
			aHTML[++h] = '</tr>';

			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceHomeMostLikely_Title-' + onDemandXMLGetData(oRow, "id") + 
										'" class="interfaceHomeMostLikely">' +
										onDemandXMLGetData(oRow, "reference") + ', ' +
										onDemandXMLGetData(oRow, "subject") +
										'</td>';
				
				aHTML[++h] = '</tr>'
			}
			
				aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceSupportIssueSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceSupportIssueSearch(sXHTMLElementId, aParam)
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
		
		var sParam = 'method=SUPPORT_ISSUE_SEARCH&byme=1&&id=' + sSearchContext

		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/support/?rf=XML&' + sParam,
			dataType: 'xml',
			success: function(data) {interfaceSupportIssueShow(aParam, data)}
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
			
			var sParam = 'method=SUPPORT_ISSUE_SEARCH&byme=1&quicksearch=' + sSearchText

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/support/?rf=XML&' + sParam,
				dataType: 'xml',
				success: function(data) {interfaceSupportIssueSearchShow(aParam, data)}
			});
		}
	};	
}

function interfaceSupportIssueSearchShow(aParam, oXML)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	var oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		interfaceMasterSearchStop();
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
			
			aHTML[++h] = '<td class="interfaceSearch" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
							'-' + onDemandXMLGetData(oRow, "id") + '">' +
							onDemandXMLGetData(oRow, "reference") + 
							'</td>';
			
			aHTML[++h] = '<td class="interfaceSearch" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
							'-' + onDemandXMLGetData(oRow, "id") + '">' +
							onDemandXMLGetData(oRow, "subject") + '</td>';
							
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		}
    	
		aHTML[++h] = '</tbody></table>';
		
		$('#divInterfaceMasterViewportControlOptions').html(
			interfaceMasterPagination(
			{
				html: aHTML.join(''),
				more: ($(oRoot).attr('morerows') == "true")
			}) 
		);		
		
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceSupportIssueSearch(event.target.id, {source: 1});
		});
		
		interfaceMasterPaginationBind(
		{
			columns: 'firstname-surname',
			more: $(oRoot).attr('moreid'),
			rows: 15,
			startRow: parseInt($(oRoot).attr('startrow')) + parseInt($(oRoot).attr('rows')),
			functionSearch: interfaceSupportIssueSearch
		});   
		
	}	
}

function interfaceSupportIssueViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
		
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
					'</tr>';
	
	aHTML[++h] = '</table>';					
	
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceSupportIssueSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceSupportIssueDetails();
	});
	
	$('#tdInterfaceViewportControlAttachments').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAttachments", true);
		interfaceMasterAttachments({xhtmlElementID: 'divInterfaceMainAttachments'});
	});
	
}

function interfaceSupportIssueShow(aParam, oXML)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceSupportIssueViewport();
	
	goObjectContextXML = oXML;
	
	var aHTML = [];
	var h = -1;
	
	oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find support issue.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
		
		$('#divInterfaceViewportControlContext').html(onDemandXMLGetData(oRow, 'reference'));
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceSupportIssueMasterViewport({showHome: false});interfaceSupportIssueSearch("-' + giObjectContext + '")',
			move: false
			})
		
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceSupportIssueSummary()'})
	}	
}		
		
function interfaceSupportIssueSummary()
{

	var aHTML = [];
	var h = -1;
	var oXML = goObjectContextXML;
	
	oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this support issue.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
	
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1Large" class="interfaceMainColumn1Large">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2Action" style="width:100px;">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';				
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));	
	
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		if (onDemandXMLGetData(oRow, 'subject') != '')
		{
		
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryCreatedDate" class="interfaceMainSummary">Date Lodged</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryCreatedDateValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'createddate') +
						'</td></tr>';
						
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySubject" class="interfaceMainSummary">Subject</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarySubjectValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'subject') +
						'</td></tr>';
						
			if (onDemandXMLGetData(oRow, 'solution') != '')
			{	
				aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySolution" class="interfaceMainSummary">Solution</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarySolutionValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'solution') +
						'</td></tr>';			
			}				
						
			if (onDemandXMLGetData(oRow, 'description') != '')
			{	
				aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'description') +
						'</td></tr>';			
			}			
		}	
				
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
								
		/* aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySendEmail" class="interfaceMainSummary">' +
						'<a class="linkedin-profileinsider-popup" href="http://www.linkedin.com/in/">LinkedIn</a>' +
						'</td></tr>'; */
	 
	 	/* aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySignUpUser" class="interfaceMainColumn2Action">' +
						'<a href="#" id="aInterfaceMainSummarySignUpUser">Set&nbsp;up&nbsp;logon</a>' +
						'</td></tr>'; */
		
		/* aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPDF" class="interfaceMainColumn2Action">' +
						 '<a href="#" id="aInterfaceMainSummaryPDF">PDF</a>' +
						'</td></tr>'; */
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
		
		/* $('#aInterfaceMainSummarySendEmail').click(function(event)
		{
			interfaceSupportIssueSendEmail();
		}); */
	
	}	
}

function interfaceSupportIssueDetails()
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
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSubject" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSubject" class="interfaceMain">' +
						'Subject' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSubjectValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSubjectValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsSubject" class="inputInterfaceMainText">' +
						'</td></tr>';
			
		aHTML[++h] = '<tr id="trInterfaceMainDetailsUser" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsUser" class="interfaceMain">' +
						'Send To' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsUserValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsUserValue" class="interfaceMainRadio">' +
						gsLoadingSmallXHTML +
						'</td></tr>';	
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
						'Description' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<textarea style="width: 100%;" rows="10" cols="35" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';	
			
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsName" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsName" class="interfaceMain">' +
						'Best Contact Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsNameValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsNameValue" class="interfaceMainTextMulti">' +
						'<input id="inputInterfaceMainDetailsName" class="inputInterfaceMainText">' +
						'</td></tr>';	
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsEmail" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsEmail" class="interfaceMain">' +
						'Email' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEmailValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsEmailValue" class="interfaceMainTextMulti">' +
						'<input id="inputInterfaceMainDetailsEmail" class="inputInterfaceMainText">' +
						'</td></tr>';	
			
		aHTML[++h] = '<tr id="trInterfaceMainDetailsPhone" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPhone" class="interfaceMain">' +
						'Phone' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsPhoneValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsPhoneValue" class="interfaceMainTextMulti">' +
						'<input id="inputInterfaceMainDetailsPhone" class="inputInterfaceMainText">' +
						'</td></tr>';		
	
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));

		interfaceSupportIssueGetUsers();
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsType" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsType" class="interfaceMain">' +
						'Type' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsType" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTypeValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioType1" name="radioType" value="1"/>Help Required' +
						'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Suggestion' +
						'<br /><input type="radio" id="radioType3" name="radioType" value="3"/>General Comment' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSeverity" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSeverity" class="interfaceMain">' +
						'Severity' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSeverity" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSeverityValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioSeverity0" name="radioSeverity" value="0"/>Critical' +
						'<br /><input type="radio" id="radioSeverity1" name="radioSeverity" value="1"/>Urgent' +
						'<br /><input type="radio" id="radioSeverity2" name="radioSeverity" value="2"/>Routine' +
						'<br /><input type="radio" id="radioSeverity3" name="radioSeverity" value="3"/>Non-Critical' +
						'<br /><input type="radio" id="radioSeverity4" name="radioSeverity" value="4"/>Not Sure' +
						'</td></tr>';
		
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (oRoot.childNodes.length != 0)
		{
			$('#inputInterfaceMainDetailsSubject').val(onDemandXMLGetData(oRow, 'subject'));
			$('#inputInterfaceMainDetailsDescription').val(onDemandXMLGetData(oRow, 'description'));
			$('#inputInterfaceMainDetailsName').val(onDemandXMLGetData(oRow, 'name'));
			$('#inputInterfaceMainDetailsEmail').val(onDemandXMLGetData(oRow, 'email'));
			$('#inputInterfaceMainDetailsPhone').val(onDemandXMLGetData(oRow, 'phone'));
			
			$('[name="radioType"][value="' + onDemandXMLGetData(oRow, 'type') + '"]').attr('checked', true);
			$('[name="radioSeverity"][value="' + onDemandXMLGetData(oRow, 'severity') + '"]').attr('checked', true);
			$('[name="radioUser"][value="' + onDemandXMLGetData(oRow, 'user') + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioType"][value="1"]').attr('checked', true);
			$('[name="radioSeverity"][value="0"]').attr('checked', true);
			$('[name="radioUser"]').first().attr('checked', true);
			interfaceSupportIssueGetContact();
		}
		
	}	
}

function interfaceSupportIssueSave()
{

	var sParam = 'method=SUPPORT_ISSUE_MANAGE'
	var sData = '';
	
	if (giObjectContext != -1)
	{
		sData += '&id=' + giObjectContext;
	} 
	
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&subject=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsSubject').val());
		sData += '&description=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDescription').val());
		sData += '&name=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsName').val());
		sData += '&email=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsEmail').val());
		sData += '&phone=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsPhone').val());
		sData += '&user=' + $('input[name="radioUser"]:checked').val();
		sData += '&type=' + $('input[name="radioType"]:checked').val();
		sData += '&severity=' + $('input[name="radioSeverity"]:checked').val();
	}
	
	if (sData != '')
	{
		if (sData.slice(0,1) == '&') {sData = sData.replace('&', '')}
	
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/support/?' + sParam,
			data: sData,
			dataType: 'json',
			success: interfaceSupportIssueSaveProcess
		});
		
	}
	else
	{
		interfaceMasterStatus('Saved');
	}	
		
}

function interfaceSupportIssueSaveProcess(oResponse)
{
	if (oResponse.status == 'OK')
	{
		interfaceMasterStatus('Saved');
		if (giObjectContext == -1) {var bNew = true}
		giObjectContext = oResponse.id;	
		
		if (bNew) {interfaceSupportIssueSearch('-' + giObjectContext)}
	}
	else
	{
		interfaceMasterStatus(oResponse.error.errornotes);
		interfaceMasterConfirm( {html: [oResponse.error.errornotes]
								   , title: 'Save error!'});
	}
}

function interfaceSupportIssueNew(oXML)
{
	if (oXML == undefined)
	{
		var sParam = 'method=CORE_GET_NEW&rf=XML';

		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/core/?' + sParam,
			dataType: 'xml',
			success: interfaceSupportIssueNew
		});
	}	
	else	
	{
		giObjectContext = -1;
		goObjectContextXML = oXML;
		interfaceSupportIssueViewport();
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
		interfaceSupportIssueDetails();
	}	
}

function interfaceSupportIssueGetUsers(aParam, oXML)
{
	var sXHTMLElementId = 'tdInterfaceMainDetailsUserValue';
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
	}

	if (oXML == undefined)
	{
		var sParam = 'method=SUPPORT_ISSUE_USER_SEARCH';
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/support/?rf=XML',
			data: sParam,
			dataType: 'xml',
			async: false,
			success: function(data){interfaceSupportIssueGetUsers(aParam, data)}
		});
	}
	else
	{
	
		var aHTML = [];
		var h = -1;
	
		var oRoot = oXML.getElementsByTagName("ondemand").item(0);
		
		if (oRoot.childNodes.length == 0)
		{
			aHTML[++h] = '<table>';
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No users to log issue against!</td></tr>';
			aHTML[++h] = '</tbody></table>';
		}
		else
		{		
			
			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
			
				aHTML[++h] = '<input type="radio" id="radioUser' + onDemandXMLGetData(oRow, "id") + '"' +
									' name="radioUser" value="' + onDemandXMLGetData(oRow, "id") + '">' +
									onDemandXMLGetData(oRow, "contactfirstname") + ' ' + onDemandXMLGetData(oRow, "contactsurname")	+ '<br />';
				
			}
			
		}
		
		$('#' + sXHTMLElementId).html(aHTML.join(''));
	}	
}	

function interfaceSupportIssueGetContact(aParam, oResponse)
{
	var sXHTMLElementNameID = 'inputInterfaceMainDetailsName';
	var sXHTMLElementEmailID = 'inputInterfaceMainDetailsEmail';
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementNameID != undefined) {sXHTMLElementNameID = aParam.xhtmlElementNameID}
		if (aParam.xhtmlElementEmailID != undefined) {sXHTMLElementEmailID = aParam.xhtmlElementEmailID}
	}

	if (oResponse == undefined)
	{
		var sParam = 'method=CORE_GET_USER_DETAILS';
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/core/?rf=JSON',
			data: sParam,
			dataType: 'json',
			success: function(data){interfaceSupportIssueGetContact(aParam, data)}
		});
	}
	else
	{
		$('#' + sXHTMLElementNameID).val(oResponse.firstname + ' ' + oResponse.surname);
		$('#' + sXHTMLElementEmailID).val(oResponse.email);
	}	
}	

