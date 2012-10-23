$(function()
{
})

function interfaceEventMasterViewport(aParam)
{

	giObject = 39;
	gsObjectName = 'Event';
	goObjectContextXML = '';
	giObjectContext = -1;
			
	var bShowHome = true;
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
	}	
	
	interfaceMasterReset();		
		
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceEventMasterViewport({showHome: true});',
			move: false
			})		
	}
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Events"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceEventSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceEventSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceEventSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceEventNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceEventNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceEventSave();
	});
	
	$('#spanInterfaceMasterViewportControlAction').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableinterfaceActionOptions" class="interfaceActionOptions">';
						
		aHTML[++h] = '<tr id="trinterfaceActionOptions" class="interfaceActionOptions">' +
						'<td id="tdinterfaceActionOptionsDelete" class="interfaceActionOptions">' +
						'Delete' +
						'</td>' +
						'</tr>';

		aHTML[++h] = '</table>';

		interfaceMasterViewportActionShow(this, aHTML.join(''), "interfaceEventActionOptionsBind()");
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceEventSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceEventSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceEventHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceEventHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceEventSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceEventSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	
	$('#divInterfaceViewportControl').html('');	
		
	tinyMCE.init(
	{
        mode : "none",
		height : "370px", 
		width : "100%",
		theme : "advanced",

		plugins : "table,advimage,advlink,emotions,iespell,insertdatetime,templateFields,preview,media,fullscreen,print,visualchars,nonbreaking,pagebreak,style,paste,searchreplace,print,contextmenu", 

		theme_advanced_buttons1_add_before : "forecolor,backcolor", 
		theme_advanced_buttons1_add : "fontselect,fontsizeselect", 
 
		theme_advanced_buttons2_add : "separator,insertdate,inserttime,preview,zoom,separator,nonbreaking,pagebreak,visualchars", 
		theme_advanced_buttons2_add_before: "cut,copy,paste,pasteword,separator,search,replace,separator", 
		
		theme_advanced_buttons3_add_before : "tablecontrols,separator", 
		theme_advanced_buttons3_add : "emotions,iespell,fullscreen,print,templateFields,media,selectall,advhr",
 
		
		plugin_insertdate_dateFormat : "%d-%m-%y", 
		plugin_insertdate_timeFormat : "%H:%M:%S", 
	
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_resizing : true,
	
		font_size_style_values : "8pt,10pt,12pt,14pt,18pt,24pt,36pt",
		
		extended_valid_elements : "style,input[accept|accesskey|align<bottom?left?middle?right?top|alt|checked<checked|class|dir<ltr?rtl|disabled<disabled|id|ismap<ismap|lang|maxlength|name|onblur|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onselect|readonly<readonly|size|src|style|tabindex|title|type<button?checkbox?file?hidden?image?password?radio?reset?submit?text|usemap|value],select[class|dir<ltr?rtl|disabled<disabled|id|lang|multiple<multiple|name|onblur|onchange|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|size|style|tabindex|title],ol[class|compact<compact|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|start|style|title|type],div[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title],li[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title|type|value],iframe[src|width|height|name|align|frameborder|scrolling|marginheight|marginwidth]",

		fullscreen_new_window : true, 
		fullscreen_settings : 
		{ 
			theme_advanced_path_location : "top" 
		}, 
		relative_urls : false, 
		remove_script_host : false, 
		convert_urls : false, 
		visual : true, 
		gecko_spellcheck : true,
		TemplateLinkType : "32",
		content_css : gsEditorCSS
	});				
	
	if (bShowHome) {interfaceEventHomeShow()};	
}

function interfaceEventHomeShow(oXML)
{

	if (oXML == undefined)
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
						'<td id="interfaceMasterViewportEventLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		/* sParam = 'method=EVENT_SEARCH&rows=5&advanced=1';

		$.ajax(
		{
			type: 'GET',
			url: '/directory/ondemand/object.asp?' + sParam,
			dataType: 'xml',
			success: interfaceEventHomeShow
		}); */
		
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'event';
		oSearch.method = 'EVENT_SEARCH';
		
		oSearch.addField('description');
		//oSearch.async = false;
		oSearch.rf = 'xml';
		oSearch.rows = 10;
		oSearch.addSummaryField('count eventcount')
		oSearch.sort('modifieddate', 'desc');
		
		oSearch.getResults(interfaceEventHomeShow);
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		var oRoot = oXML.getElementsByTagName("ondemand").item(0);
		
		if (oRoot.childNodes.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceNewsHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceNewsHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceNewsHomeMostLikelyNothing">Click New to create an event.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceNewsHomeMostLikely">';
			aHTML[++h] = '<tr>';
			aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
			aHTML[++h] = '</tr>';
			
			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceNewsHomeMostLikely_Title-' + onDemandXMLGetData(oRow, "id") + 
										'" class="interfaceHomeMostLikely">' +
										onDemandXMLGetData(oRow, "description") +
										'</td>';
				
				aHTML[++h] = '</tr>'
			}
			
				aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceProjectHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceEventSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceEventSearch(sXHTMLElementId, aParam)
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
		var sParam = 'method=EVENT_SEARCH&advanced=1&select=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/directory/ondemand/object.asp?rf=XML&' + sParam,
			dataType: 'xml',
			success: function(data) {interfaceEventShow(aParam, data)}
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
				
			var sParam = 'method=EVENT_SEARCH&rf=XML&quicksearch=' + sSearchText + 
								'&xhtmlcontext=' + sXHTMLElementId;

			$.ajax(
			{
				type: 'GET',
				url: '/directory/ondemand/object.asp?' + sParam,
				dataType: 'xml',
				success: function(data) {interfaceEventSearchShow(aParam, data)}
			});
			
		}
	};	
}

function interfaceEventSearchShow(aParam, oXML)
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
							onDemandXMLGetData(oRow, "reference") + '</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		}
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceEventSearch(event.target.id, 1);
		});
	}	
			
}

function interfaceEventViewport()
{
	
	var aHTML = [];
	var h = -1;

	if (tinyMCE.getInstanceById('inputInterfaceMainDescriptionText'))
	{
		tinyMCE.get('inputInterfaceMainDescriptionText').remove();
		$('#inputInterfaceMainDescriptionText').remove();
	}	
				
	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlSummary" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControlDetails" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
				
	aHTML[++h] = '<tr id="trInterfaceViewportControlDescription" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDescription" class="interfaceViewportControl">Description</td>' +
					'</tr>';				
	
	aHTML[++h] = '</table>';					
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (giObjectContext != -1)
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControlAttendees" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlAttendees" class="interfaceViewportControl">Attendees</td>' +
					'</tr>';			
	}
	else
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControlStatus" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlStatus" class="interfaceViewportControl interfaceViewportControlStatus">' +
					'Once you save this event, you can then add & view attendees</td>' +
					'</tr>';			
	}
					
	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDescription" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttendees" class="divInterfaceViewportMain"></div>';
		
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary", true);
		interfaceEventSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceEventDetails();
	});
	
	$('#tdInterfaceViewportControlDescription').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDescription");
		interfaceEventDescription();
	});
	
	$('#tdInterfaceViewportControlAttendees').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAttendees", true);
		interfaceEventAttendees();
	});
	
}

function interfaceEventShow(aParam, oXML)
{

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceEventViewport();
	
	goObjectContextXML = oXML;
	
	var aHTML = [];
	var h = -1;
	
	oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find event.</td></tr>';
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
			newDestination: 'interfaceEventMasterViewport({showHome: false});interfaceEventSearch("-' + giObjectContext + '")',
			move: false
			})
	
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceEventSummary()'});
	}	
}		
		
function interfaceEventSummary()
{

	var aHTML = [];
	var h = -1;
	
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
	var oXML = goObjectContextXML;
	
	oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find event.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		var sTmp = onDemandXMLGetData(oRow, 'startdate');
		if (sTmp != '&nbsp;') 
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Start Date</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryTypeValue" class="interfaceMainStartDateValue">' +
						sTmp +
						'</td></tr>';
		}				
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySummary" class="interfaceMainSummary">&nbsp;</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarySummaryValue" class="interfaceMainSummaryValue">' +
						onDemandXMLGetData(oRow, 'description') +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action" cellspacing=0>';
								
		//aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryAllAttendees" class="interfaceMainColumn2Action">' +
		//				'<a href="#" id="aInterfaceMainSummaryAllAttendees">View&nbsp;All&nbsp;Attendees</a>' +
		//				'</td></tr>';
		
		// aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryLables" class="interfaceMainColumn2Action">' +
						// '<a href="#" id="aInterfaceMainSummaryLabels">Produce&nbsp;Labels</a>' +
						// '</td></tr>';
				
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
		
		$('#aInterfaceMainSummaryEdit').click(function(event)
		{
			interfaceEventEdit();
		});
	}	
}

function interfaceEventDetails()
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
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsReference" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsReference" class="interfaceMain">' +
						'Reference' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsReference" class="inputInterfaceMainText">' +
						'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStartDate" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStartDate" class="interfaceMain">' +
						'Start Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStartDateValue" class="interfaceMainDate">' +
						'<td id="tdInterfaceMainDetailsStartDateValue" class="interfaceMainDate">' +
						'<input onDemandType="DATE" id="inputInterfaceMainDetailsStartDate" class="inputInterfaceMainDate">' +
						'</td></tr>';			
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsEndDate" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsEndDate" class="interfaceMain">' +
						'End Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEndDateValue" class="interfaceMainDate">' +
						'<td id="tdInterfaceMainDetailsEndDateValue" class="interfaceMainDate">' +
						'<input onDemandType="DATE" id="inputInterfaceMainDetailsEndDate" class="inputInterfaceMainDate">' +
						'</td></tr>';			
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSharing" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSharing" class="interfaceMain">' +
						'Sharing' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSharing" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSharingValue" class="interfaceMainText">' +
						'<input type="radio" id="radioPublicY" name="radioPublic" value="Y"/>Public' +
						'<br /><input type="radio" id="radioPublicN" name="radioPublic" value="N"/>Private' +
						'</td></tr>';				

		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
			aHTML[++h] = '<tr id="trInterfaceMainDetailsStatus" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStatus" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStatus" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsStatusValue" class="interfaceMainText">' +
						'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Planning' +
						'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>In Progress' +
						'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Completed' +
						'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>Cancelled' +
						'<br /><input type="radio" id="radioStatus5" name="radioStatus" value="5"/>Confirmed' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		$('input.inputInterfaceMainDate').datepicker({ dateFormat: 'dd M yy' });
		
		if (oRoot.childNodes.length != 0)
		{
			$('#inputInterfaceMainDetailsReference').val(onDemandXMLGetData(oRow, 'reference'));
			
			var sTmp = onDemandXMLGetData(oRow, 'startdate');
			if (sTmp == '&nbsp;') {sTmp = ''};
			$('#inputInterfaceMainDetailsStartDate').val(sTmp);
			
			var sTmp = onDemandXMLGetData(oRow, 'enddate');
			if (sTmp == '&nbsp;') {sTmp = ''};
			$('#inputInterfaceMainDetailsEndDate').val(sTmp);
			
			$('#inputInterfaceMainDetailsFromEmail').val(onDemandXMLGetData(oRow, 'fromemail'));
			
			$('#inputInterfaceMainDetailsSummary').val(onDemandXMLGetData(oRow, 'summary'));
			
			$('[name="radioStatus"][value="' + onDemandXMLGetData(oRow, 'status') + '"]').attr('checked', true);
			$('[name="radioPublic"][value="' + onDemandXMLGetData(oRow, 'public') + '"]').attr('checked', true);

		}
		
	}	
}

function interfaceEventDescription()
{

	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainDescription').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainDescription').attr('onDemandLoading', '');
				
		aHTML[++h] = '<table id="tableInterfaceMainEdit" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainEditRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainDescriptionColumn1" class="interfaceMain">' +
						'</td>' +
						'<td id="tdInterfaceMainDescriptionColumn2" class="interfaceMain">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainDescription').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDescriptionTextValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDescriptionTextValue" class="interfaceMainTextMulti">' +
						'<textarea rows="30" cols="50" onDemandType="TEXTMULTI" id="inputInterfaceMainDescriptionText" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDescriptionColumn1').html(aHTML.join(''));
		
		if (oRoot.childNodes.length != 0)
		{
			var oRow = oRoot.childNodes.item(0);
			$('#inputInterfaceMainDescriptionText').val(unescape(onDemandXMLGetData(oRow, 'description')));
		}
	
		tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainDescriptionText');
	}	
}

function interfaceEventAttendees()
{

	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainAttendees').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainAttendees').attr('onDemandLoading', '');
	
		aHTML[++h] = '<table id="tableInterfaceMainEdit" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainEditRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainAttendeesColumn1" style="width: 70px" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainAttendeesColumn2" class="interfaceMainColumn1Large">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainAttendees').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainAtteendeesAtoZ" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainAtteendeesAtoE" class="interfaceMain">' +
						'<td id="tdInterfaceMainAtteendees-AtoE" class="interfaceRowSelect">' +
						'<span id="spanInterfaceMainAtteendees-A" class="interfaceMainAtoZ">A</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-B" class="interfaceMainAtoZ">B</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-C" class="interfaceMainAtoZ">C</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-D" class="interfaceMainAtoZ">D</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-E" class="interfaceMainAtoZ">E</span>' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainAtteendeesFtoJ" class="interfaceMain">' +
						'<td id="tdInterfaceMainAtteendees-FtoJ" class="interfaceRowSelect">' +
						'<span id="spanInterfaceMainAtteendees-F" class="interfaceMainAtoZ">F</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-G" class="interfaceMainAtoZ">G</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-H" class="interfaceMainAtoZ">H</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-I" class="interfaceMainAtoZ">I</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-J" class="interfaceMainAtoZ">J</span>' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAtteendeesKtoO" class="interfaceMain">' +
						'<td id="tdInterfaceMainAtteendees-KtoO" class="interfaceRowSelect">' +
						'<span id="spanInterfaceMainAtteendees-K" class="interfaceMainAtoZ">K</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-L" class="interfaceMainAtoZ">L</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-M" class="interfaceMainAtoZ">M</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-N" class="interfaceMainAtoZ">N</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-O" class="interfaceMainAtoZ">O</span>' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAtteendeesPtoT" class="interfaceMain">' +
						'<td id="tdInterfaceMainAtteendees-PtoT" class="interfaceRowSelect">' +
						'<span id="spanInterfaceMainAtteendees-P" class="interfaceMainAtoZ">P</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-Q" class="interfaceMainAtoZ">Q</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-R" class="interfaceMainAtoZ">R</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-S" class="interfaceMainAtoZ">S</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-T" class="interfaceMainAtoZ">T</span>' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainAtteendeesUtoZ" class="interfaceMain">' +
						'<td id="tdInterfaceMainAtteendees-UtoZ" class="interfaceRowSelect">' +
						'<span id="spanInterfaceMainAtteendees-U" class="interfaceMainAtoZ">U</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-V" class="interfaceMainAtoZ">V</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-W" class="interfaceMainAtoZ">W</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-X" class="interfaceMainAtoZ">X</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-Y" class="interfaceMainAtoZ">Y</span>' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainAtteendeesZ0to9" class="interfaceMain">' +
						'<td id="tdInterfaceMainAtteendees-Z0to9" class="interfaceRowSelect">' +
						'<span id="spanInterfaceMainAtteendees-Z" class="interfaceMainAtoZ">Z</span>&nbsp;' +
						'<span id="spanInterfaceMainAtteendees-#" class="interfaceMainAtoZ">0 to 9</span>&nbsp;' +
						'</td></tr>';
				
		aHTML[++h] = '</table>';

		$('#tdInterfaceMainAttendeesColumn1').html(aHTML.join(''));	
		
		$('span.interfaceMainAtoZ').click(function(event)
		{
			var sXHTMLElementId = event.target.id;
			var aId = sXHTMLElementId.split('-');
			
			interfaceEventAttendeesSearch({quicksearch: aId[1]});
			
		});
	}	
}

function interfaceEventAttendeesSearchRow(oRow)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
	aHTML[++h] = '<td id="tdEvent-firstname" class="interfaceMainRow">' + onDemandXMLGetData(oRow, "firstname") + '</td>';
	aHTML[++h] = '<td id="tdEvent-surname" class="interfaceMainRow">' + onDemandXMLGetData(oRow, "surname") + '</td>';
	
	var sPhone = onDemandXMLGetData(oRow, "phone")
	if (sPhone == '') {if (onDemandXMLGetData(oRow, "homephone") != '') {sPhone = '(H) ' + onDemandXMLGetData(oRow, "homephone")}}
	
	aHTML[++h] = '<td id="tdEvent-phone" class="interfaceMainRow">' + sPhone + '</td>';
	aHTML[++h] = '<td id="tdEvent-email" class="interfaceMainRow">' + onDemandXMLGetData(oRow, "mobile") + '</td>';
	aHTML[++h] = '<td id="tdEvent-options-' + onDemandXMLGetData(oRow, "id") + '"' +
						' class="interfaceMainRowOptions">&nbsp;</td>';
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
}	

function interfaceEventAttendeesSearch(aParam, oXML)
{
	var sXHTMLElementId = 'tdInterfaceMainAttendeesColumn1';
	var sQuickSearch;
	
	if (aParam != undefined)
	{
		if (aParam.quicksearch != undefined) {sQuickSearch = aParam.quicksearch}
	}
	
	if (sQuickSearch != undefined)
	{
	
		if (oXML == undefined)
		{	
			$('#tdInterfaceMainAttendeesColumn2').html(gsLoadingXHTML);
			
			var aId = sXHTMLElementId.split('-');
			var sParam = 'method=EVENT_ATTENDEE_SEARCH&rf=XML' +
							'&quicksearch=' + encodeURIComponent(sQuickSearch);

			$.ajax(
			{
				type: 'GET',
				url: '/directory/ondemand/object.asp?' + sParam,
				dataType: 'xml',
				success: function(data) {interfaceEventAttendeesSearch(aParam, data)}
			});
		
		}
		else
		{
			var aHTML = [];
			var h = -1;
			
			oRoot = oXML.getElementsByTagName("ondemand").item(0);
	
			if (oRoot.childNodes.length != 0)
			{
				
				aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
				aHTML[++h] = '<tbody>'
			
				aHTML[++h] = '<tr class="interfaceMainCaption">';
				aHTML[++h] = '<td class="interfaceMainCaption">First Name</td>';
				aHTML[++h] = '<td class="interfaceMainCaption">Surname</td>';
				aHTML[++h] = '<td class="interfaceMainCaption">Phone</td>';
				aHTML[++h] = '<td class="interfaceMainCaption">Mobile</td>';
				aHTML[++h] = '<td class="interfaceMainCaption"></td>';
				aHTML[++h] = '</tr>';

				for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
				{
					var oRow = oRoot.childNodes.item(iRow);
					aHTML[++h] = interfaceEventAttendeesSearchRow(oRow);
				}
				
				aHTML[++h] = '</tbody></table>';
				
				interfaceMasterPaginationList(
				{
					xhtmlElementID: 'tdInterfaceMainAttendeesColumn2',
					xhtmlContext: 'EventAttendees',
					xhtml: aHTML.join(''),
					showMore: ($(oRoot).attr('morerows') == "true"),
					more: $(oRoot).attr('moreid'),
					rows: giReturnRows,
					functionShowRow: interfaceEventAttendeesSearchRow,
					functionNewPage: 'interfaceEventAttendeesSearchBind()'
				}); 	
				
			}
			else
			{
				aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainRowNothing"><td>None.</td></tr>';
				aHTML[++h] = '</tbody></table>';
			}
			
		}	
		
	}
}	

function interfaceEventNew(oXML)
{
	if (oXML == undefined)
	{
		var sParam = 'method=CORE_GET_NEW&rf=XML';

		$.ajax(
		{
			type: 'GET',
			url: '/directory/ondemand/object.asp?' + sParam,
			dataType: 'xml',
			success: interfaceEventNew
		});
	}	
	else	
	{
		giObjectContext = -1;
		goObjectContextXML = oXML;
		interfaceEventViewport();
		$('#divInterfaceMainDetails').html(gsLoadingXHTML);
		$('#divInterfaceMainDetails').attr('onDemandLoading', '1');
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
		interfaceEventDetails();
	}	
}

function interfaceEventSave()
{

	var sParam;
	var sData = '_=1';
	
	if (giObjectContext != -1)
	{
		sParam = 'method=EVENT_UPDATE';
		sParam += '&select=' + giObjectContext	
	}
	else
	{
		sParam = 'method=EVENT_ADD';
	}
		
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&reference=' + encodeURIComponent($('#inputInterfaceMainDetailsReference').val());
		sData += '&public=' + $("input[@name='radioPublic']:checked").val();
		
		//sData += '&url=' + encodeURIComponent($('#inputInterfaceMainDetailsURL').val());
		//sData += '&summary=' + encodeURIComponent($('#inputInterfaceMainDetailsSummary').val());
	}
	
	if ($('#divInterfaceMainDescription').html() != '')
	{
		sData += '&description=' + escape(tinyMCE.get('inputInterfaceMainDescriptionText').getContent());
	}
	
	$.ajax(
	{
		type: 'POST',
		url: '/directory/ondemand/object.asp?' + sParam,
		data: sData,
		dataType: 'text',
		async: false,
		success: function(data) 
					{ 
						var aReturn = data.split('|');
						giObjectContext = aReturn[2];
						interfaceMasterStatus('Event saved.');
					}
	});
		
}
