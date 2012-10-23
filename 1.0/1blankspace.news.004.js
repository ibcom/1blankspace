$(function()
{
})

function interfaceNewsMasterViewport(aParam)
{

	giObject = 19;
	gsObjectName = 'News';
	goObjectContext = undefined;
	giObjectContext = -1;
			
	var bShowHome = true;
	var bNew = false;
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
		if (aParam.showNew != undefined) {bNew = aParam.showNew}
		if (bNew) {interfaceNewsNew()};	
	}	
		
	interfaceMasterReset();		
			
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceNewsMasterViewport({showHome: true});',
			move: false
			})		
	}
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "News"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceNewsSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceNewsSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceNewsSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceNewsNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOption').click(function(event)
	{
		interfaceNewsNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceNewsSave();
	});
	
	$('#spanInterfaceMasterViewportControlAction').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableinterfaceActionOptions" class="interfaceActionOptions">';
						
		aHTML[++h] = '<tr id="trinterfaceActionOptions" class="interfaceActionOptions">' +
						'<td id="tdinterfaceActionOptionsCopy" class="interfaceActionOptions">' +
						'Copy' +
						'</td>' +
						'</tr>';

		aHTML[++h] = '</table>';

		interfaceMasterViewportActionShow(this, aHTML.join(''), "interfaceNewsActionOptionsBind()");
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceNewsSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceNewsSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceNewsHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceNewsHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceNewsSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceNewsSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	$('#divInterfaceViewportControl').html('');	
	
	if (gbRichEdit)
	{
	
		tinyMCE.init(
		{
			mode : "none",
			height : "370px", 
			width : "100%",
			theme : "advanced",

			plugins : "table,advimage,advlink,emotions,iespell,insertdatetime,dynamicTags,preview,media,fullscreen,print,visualchars,nonbreaking,pagebreak,style,paste,searchreplace,print,contextmenu", 

			theme_advanced_buttons1_add_before : "forecolor,backcolor", 
			theme_advanced_buttons1_add : "fontselect,fontsizeselect", 
	 
			theme_advanced_buttons2_add : "separator,insertdate,inserttime,preview,zoom,separator,nonbreaking,pagebreak,visualchars", 
			theme_advanced_buttons2_add_before: "cut,copy,paste,pasteword,separator,search,replace,separator", 
			
			theme_advanced_buttons3_add_before : "tablecontrols,separator", 
			theme_advanced_buttons3_add : "emotions,iespell,fullscreen,print,dynamicTags,media,selectall,advhr",
	 
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
			content_css : gsEditorCSS,
			
			external_link_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH", 
			external_image_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + giObjectContext, 
			media_external_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + giObjectContext, 

		});				
	
	}
	
	if (bShowHome) {interfaceNewsHomeShow()};
	
}

function interfaceNewsHomeShow(oResponse)
{

	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceNewsHomeMostLikely" class="interfaceViewportMain">' +
						gsLoadingXHTML + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportNewsLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		sParam = 'method=NEWS_SEARCH&rows=10';

		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/news/?' + sParam,
			dataType: 'json',
			success: interfaceNewsHomeShow
		});
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceNewsHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceNewsHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceNewsHomeMostLikelyNothing">Click New to create a news item.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceBewsHomeMostLikely">';
			aHTML[++h] = '<tr>';
			aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceNewsHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.subject +
										'</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
			
			aHTML[++h] = '<table id="tableInterfaceNewsHomeMostLikelyMore">';
			aHTML[++h] = '<tr><td id="tdInterfaceNewsHomeMostLikelyMore">' +
						'<a href="#" id="aInterfaceNewsHomeMostLikelyMore">more...</a>' +
						'</td></tr>';
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceNewsHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceNewsSearch(event.target.id, {source: 1});
		});
		
		$('#aInterfaceNewsHomeMostLikelyMore').click(function(event)
		{
			interfaceNewsSearch('tdInterfaceViewportMasterControlBrowse-', {source: giSearchSource_BROWSE});
		});
	}
}

function interfaceNewsSearch(sXHTMLElementId, aParam)
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
		var sParam = 'method=NEWS_SEARCH&advanced=1&select=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/news/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceNewsShow(aParam, data)}
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
			
			var sParam = 'method=NEWS_SEARCH&advanced=1&quicksearch=' + sSearchText;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/news/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceNewsSearchShow(aParam, data)}
			});
			
		}
	};	
}

function interfaceNewsSearchShow(aParam, oResponse)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	if (oResponse.data.rows.length == 0)
	{
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
			
			aHTML[++h] = '<td class="interfaceSearch" id="' +
							'-' + this.id + '">' +
							this.subject + '</td>';
			
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
			interfaceNewsSearch(event.target.id, {source: 1});
		});
	}	
}

function interfaceNewsViewport()
{
	
	if (tinyMCE.getInstanceById('inputInterfaceMainEditText'))
	{
		tinyMCE.get('inputInterfaceMainEditText').remove();
		$('#inputInterfaceMainEditText').remove();
	}	
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (giObjectContext == -1)
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
						'</tr>';
	}
	else
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
						'</tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
						'</tr>';
				
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlEdit" class="interfaceViewportControl">Edit</td>' +
						'</tr>';			
		
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlGroups" class="interfaceViewportControl">Send To</td>' +
						'</tr>';			
	
		aHTML[++h] = '</table>';					
				
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
		
		aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlTracking" class="interfaceViewportControl">Tracking</td>' +
						'</tr>';
		
		aHTML[++h] = '</table>';					
	}
	
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainGroups" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainEdit" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainTracking" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary", true);
		interfaceNewsSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceNewsDetails();
	});
	
	$('#tdInterfaceViewportControlGroups').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainGroups", true);
		interfaceNewsGroups();
	});
	
	$('#tdInterfaceViewportControlEdit').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainEdit");
		interfaceNewsEdit();
	});

	$('#tdInterfaceViewportControlTracking').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainTracking");
		interfaceNewsTracking();
	});
	
}

function interfaceNewsShow(aParam, oResponse)
{

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceNewsViewport();

	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find news.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
				
		$('#divInterfaceViewportControlContext').html(goObjectContext.subject);
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceNewsMasterViewport({showHome: false});interfaceNewsSearch("-' + giObjectContext + '")',
			move: false
			})
			
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceNewsSummary()'})
	}	
}		
		
function interfaceNewsSummary()
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
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find news.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		var sTmp = goObjectContext.startdate;
		if (sTmp == '&nbsp;') {sTmp = 'Not set.'};
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Start Date</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryTypeValue" class="interfaceMainStartDateValue">' +
						sTmp +
						'</td></tr>'; */
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySummary" class="interfaceMainSummary">&nbsp;</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarySummaryValue" class="interfaceMainSummaryValue">' +
						goObjectContext.news) +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action" cellspacing=0>';
								
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySendPreviewEmail" class="interfaceMainColumn2Action">' +
						'<a href="#" id="aInterfaceMainSummarySendPreviewEmail">Send&nbsp;preview&nbsp;email&nbsp;to&nbsp;me</a>' +
						'</td></tr>';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySendAsEmail" class="interfaceMainColumn2Action">' +
						'<a href="#" id="aInterfaceMainSummarySendAsEmail" title="123|456">Send&nbsp;as&nbsp;email</a>' +
						'</td></tr>';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryCopy" class="interfaceMainColumn2Action">' +
						'<a href="#" id="aInterfaceMainSummaryCopy">Copy</a>' +
						'</td></tr>';
				
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
		
		$('#aInterfaceMainSummarySendPreviewEmail').click(function(event)
		{
			interfaceNewsSendAsEmail(true);
		});
		
		$('#aInterfaceMainSummarySendAsEmail').click(function(event)
		{
			interfaceNewsSendAsEmail(false);
		});
		
		$('#aInterfaceMainSummaryCopy').click(function(event)
		{
			interfaceNewsCopy();
		});
	}	
}

function interfaceNewsActionOptionsBind()
{
	$('#tdinterfaceActionOptionsCopy').click(function(event)
	{
		interfaceNewsCopy();
	});
}	

function interfaceNewsDetails()
{
	var aHTML = [];
	var h = -1;
	
	oRoot = goObjectContextXML.getElementsByTagName('ondemand').item(0);
	
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
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSubject" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSubject" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSubjectValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSubjectValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsSubject" class="inputInterfaceMainText">' +
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
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsFromEmail" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsFromEmail" class="interfaceMain">' +
						'From Email' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsFromEmailValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsFromEmailValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsFromEmail" class="inputInterfaceMainText">' +
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

		aHTML[++h] = '<tr id="trInterfaceMainDetailsTracking" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTracking" class="interfaceMain">' +
						'Tracking' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTracking" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTrackingValue" class="interfaceMainText">' +
						'<input type="radio" id="radioTracking1" name="radioTracking" value="1"/>No Tracking' +
						'<br /><input type="radio" id="radioTracking2" name="radioTracking" value="2"/>When viewed' +
						'<br /><input type="radio" id="radioTracking3" name="radioTracking" value="3"/>When a link is clicked' +
						'<br /><input type="radio" id="radioTracking4" name="radioTracking" value="4"/>When viewed &/or a link is clicked' +
						'</td></tr>';
				
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSummary" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSummary class="interfaceMain">' +
						'News Summary' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSummaryValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsSummaryValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMainDetailsSummary" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		$('input.inputInterfaceMainDate').datepicker({ dateFormat: 'dd M yy' });
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsSubject').val(goObjectContext.subject);
			
			var sTmp = goObjectContext.startdate;
			if (sTmp == '&nbsp;') {sTmp = ''};
			$('#inputInterfaceMainDetailsStartDate').val(sTmp);
			
			var sTmp = goObjectContext.enddate;
			if (sTmp == '&nbsp;') {sTmp = ''};
			$('#inputInterfaceMainDetailsEndDate').val(sTmp);
			
			$('#inputInterfaceMainDetailsFromEmail').val(goObjectContext.fromemail);
			$('#inputInterfaceMainDetailsSummary').val(goObjectContext.summary);
			
			$('[name="radioPublic"][value="' + goObjectContext.public + '"]').attr('checked', true);
			$('[name="radioTracking"][value="' + goObjectContext.tracking + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioPublic"][value="N"]').attr('checked', true);
			$('[name="radioTracking"][value="4"]').attr('checked', true);
			var dToday = new Date()
			$('#inputInterfaceMainDetailsStartDate').val($.fullCalendar.formatDate(dToday, "dd MMM yyyy"));
		}
		
	}	
}

function interfaceNewsEdit()
{

	
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainEdit').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainEdit').attr('onDemandLoading', '');
				
		for (edId in tinyMCE.editors) 
					tinyMCE.editors[edId].destroy(true);
				
		giEditorCounter = giEditorCounter + 1;		
				
		aHTML[++h] = '<table id="tableInterfaceMainEdit" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainEditRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainEditColumn1" class="interfaceMain">' +
						'</td>' +
						'<td id="tdInterfaceMainEditColumn2" class="interfaceMain">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainEdit').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainDetailsEditTextValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsEditTextValue" class="interfaceMainTextMulti">' +
						'<textarea rows="30" cols="50" onDemandType="TEXTMULTI" id="inputInterfaceMainConfirmationText' +
									giEditorCounter + '" editorcount="' + giEditorCounter + '" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainEditColumn1').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			var oRow = oRoot.childNodes.item(0);
			var sHTML = goObjectContext.news;
			$('#inputInterfaceMainEditText' + giEditorCounter).val(sHTML);
		}
	
		if (gbRichEdit)
		{
			tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainEditText' + giEditorCounter);
		}	
	}	
}

function interfaceNewsNew()
{
	goObjectContext = undefinded;
	giObjectContext = -1;
	interfaceNewsViewport();
	$('#divInterfaceMainDetails').html(gsLoadingXHTML);
	$('#divInterfaceMainDetails').attr('onDemandLoading', '1');
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	interfaceNewsDetails();	
}

function interfaceNewsCopy(aParam, oResponse)
{
	if (giObjectContext != -1)
	{
		if (oReponse == undefined)
		{
			var sParam = 'method=NEWS_COPY';
			sParam += '&id=' + giObjectContext;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/news/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceNewsCopy(aParam, data)}
			});
		}	
		else	
		{
			giObjectContext = oResponse.data.rows[0].id;
			interfaceNewsShow(aParam, oResponse)
			interfaceMasterStatus('Copied');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
			$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');			
		}	
	}	
}

function interfaceNewsGroups(aParam)
{
	var aHTML = [];
	var h = -1;	
					
	aHTML[++h] = '<table id="tableInterfaceMainGroups" class="interfaceMain">' +
					'<tr id="trInterfaceMainGroupsRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainGroupsColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainGroupsColumn2" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';					
					
	$('#divInterfaceMainGroups').html(aHTML.join(''));	
	
	var aHTML = [];
	var h = -1;	
	
	aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
						
	aHTML[++h] = '<tr><td id="tdInterfaceMainGroupsManage" class="interfaceMainSummary">' +
					'<a href="#" id="aInterfaceMainGroupsManage">Show Groups</a>' +
					'</td></tr>';
	
	aHTML[++h] = '<tr><td>&nbsp;' +
					'</td></tr>';		
					
	aHTML[++h] = '<tr><td id="tdInterfaceMainGroupsContacts" class="interfaceMainSummary">' +
					'<a href="#" id="aInterfaceMainGroupsContacts">Show Contacts</a>' +
					'</td></tr>';
			
	aHTML[++h] = '<tr><td>&nbsp;' +
					'</td></tr>';		
			
	aHTML[++h] = '<tr><td id="tdInterfaceMainSend" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainSend">Send</span>' +
						'</td></tr>';
					
	aHTML[++h] = '</table>';					
	
	$('#tdInterfaceMainGroupsColumn2').html(aHTML.join(''));	
	
	$('#aInterfaceMainGroupsManage').click(function(event)
	{
		interfaceNewsGroupsManage({xhtmlElementId: 'tdInterfaceMainGroupsColumn1'});
	});
	
	$('#aInterfaceMainGroupsContacts').click(function(event)
	{
		interfaceNewsGroupsContacts({xhtmlElementId: 'tdInterfaceMainGroupsColumn1'});
	});
	
	$('#spanInterfaceMainSend').button(
		{
			label: "Send"
		})
		.click(function() {
			interfaceMasterOptionsSetPosition('spanInterfaceMainNewsGroupsAdd');
			interfaceNewsSendAsEmail(false);
		})
		.css('width', '75px')
	
	interfaceNewsGroupsManage({xhtmlElementId: 'tdInterfaceMainGroupsColumn1'});
}		

function interfaceNewsGroupsContacts(aParam, oResponse)
{	
	var sXHTMLElementId = 'divInterfaceMainGroups';
	var sLabel = "groups";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
	}

	if (oResponse == undefined)
	{
		var sData = '&rows=30&id=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/news/?method=NEWS_CONTACT_PERSON_SEARCH',
			data: sData,
			dataType: 'json',
			success: function(data){interfaceNewsGroupsContacts(aParam, data)}
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;
	
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceNewsHomeMostLikely">';
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No contacts.</td></tr>';
			aHTML[++h] = '</tbody></table>';
		}
		else
		{		
			aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
				
			aHTML[++h] = '<table id="tableNewsGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">First Name</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Surname</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Email</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = interfaceNewsGroupsContactsRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#' + sXHTMLElementId).html(aHTML.join(''));
		
		interfaceMasterPaginationList(
		{
			xhtmlElementID: sXHTMLElementId,
			xhtmlContext: 'NewsGroupsContacts',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows) == "true"),
			more: oResponse.moreid,
			rows: giReturnRows,
			functionShowRow: interfaceNewsGroupsContactsRow,
			type: 'json'
		}); 	
		
		$('#tdInterfaceMainGroupsManageActions').html('');
	}	
}	

function interfaceNewsGroupsContactsRow(oRow)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
							
	aHTML[++h] = '<td id="tdNewsGroupsList_contact-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.firstname + '</td>';
							
	aHTML[++h] = '<td id="tdNewsGroupsList_activity-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.surname + '</td>';
							
	aHTML[++h] = '<td id="tdNewsGroupsList_link-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.email + '</td>';
							
	aHTML[++h] = '</tr>';
				
	return aHTML.join('');
}	


function interfaceNewsGroupsManage(aParam, oResponse)
{
	var sXHTMLElementId = 'divInterfaceMainGroups';
	var sLabel = "groups";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
	}

	if (oResponse == undefined)
	{
		var sParam = 'rows=20&news=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/news/?method=NEWS_PERSON_GROUP_SEARCH',
			data: sParam,
			dataType: 'json',
			success: function(data){interfaceNewsGroupsManage(aParam, data)}
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainNewsGroupsColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td>' +
						'&nbsp;' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainGroupsManageActions').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableNewsGroups" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
		aHTML[++h] = '<tbody>'
		aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td id="tdInterfaceMainNewsGroupsColumn1Options">&nbsp;</td></tr>';
		aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td id="tdInterfaceMainNewsGroupsColumn1Groups"></td></tr>';
		aHTML[++h] = '</tbody></table>';

		$('#tdInterfaceMainGroupsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainEmailTo" class="interfaceMainText">' +
						'<td id="tdInterfaceMainEmailToValue" class="interfaceMainText">' +
						'<input type="radio" id="radioEmailTo1" name="radioEmailTo" value="1"/>No one' +
						'&nbsp;&nbsp;<input type="radio" id="radioEmailTo2" name="radioEmailTo" value="2"/>Everyone' +
						'&nbsp;&nbsp;<input type="radio" id="radioEmailTo3" name="radioEmailTo" value="3"/>Selected Groups' +
						'&nbsp;&nbsp;<span id="spanInterfaceMainNewsGroupsAdd">Add</span>' +
						'</td></tr>';

		aHTML[++h] = '<tr><td colspan=2>&nbsp;</td></tr>';

		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainNewsGroupsColumn1Options').html(aHTML.join(''));
		
		$('#spanInterfaceMainNewsGroupsAdd').button(
		{
				text: false,
				icons: {
					 primary: "ui-icon-plus"
				}
		})
		.click(function() {
			interfaceMasterOptionsSetPosition('spanInterfaceMainNewsGroupsAdd', -28, 32);
			interfaceNewsGroupsAdd(aParam);
		})
		.css('width', '25px')
		.css('font-size', '0.75em')
		
		var aHTML = [];
		var h = -1;

		if (oResponse.data.rows.length == 0)
		{
			iOption = 1;
		}
		else
		{
			iOption = 3;
			
			aHTML[++h] = '<table id="tableNewsGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			$.each(oResponse.data.rows, function()
			{
				if (parseInt(onDemandXMLGetData(oRow, "group")) == -1) 
				{
					iOption = 2
				}
				else
				{
					if (this.grouptext != '')
					{
						aHTML[++h] = '<tr class="interfaceMainRow">';
										
						aHTML[++h] = '<td id="tdNewsGroupsList-title-' + this.group + '" class="interfaceMainRow">' +
												this.grouptext + '</td>';
																	
						aHTML[++h] = '<td id="tdNewsGroupsList-' + this.group + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
												
						aHTML[++h] = '</tr>';
					}	
				}		
				
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainNewsGroupsColumn1Groups').html(aHTML.join(''));
			
			$('.interfaceMainRowOptionsSelect').button( {
				text: false,
				 icons: {
					 primary: "ui-icon-close"
				}
			})
			.click(function() {
				interfaceNewsGroupsAddRemove(this.id)
			})
			.css('width', '15px')
			.css('height', '20px')
		}
		
		$('[name="radioEmailTo"][value="' + iOption + '"]').attr('checked', true);
	}	
}	

function interfaceNewsGroupsAdd(aParam, oResponse)
{		
	if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == 'spanInterfaceMainNewsGroupsAdd')
	{
		$('#divInterfaceMasterViewportControlOptions').slideUp(500);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{
		if (oResponse == undefined)
		{
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?method=SETUP_CONTACT_PERSON_GROUP_SEARCH',
				dataType: 'xml',
				success: function(data){interfaceNewsGroupsAdd(aParam, data)}
			});
		}
		else
		{
			$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', 'spanInterfaceMainNewsGroupsAdd')
			
			var aHTML = [];
			var h = -1;
			
			if (oResponse.data.rows.length == 0)
			{	
				aHTML[++h] = '<table id="tableNewsGroupsAddSelect" border="0" cellspacing="0" cellpadding="0" class="interfaceSearchMedium">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No groups.</td></tr>';
				aHTML[++h] = '</tbody></table>';

				$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
				$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
			}
			else
			{
				aHTML[++h] = '<table id="tableNewsGroupsAddSelect" class="interfaceSearchMedium" style="font-size:0.725em;">';
				aHTML[++h] = '<tbody>'
				
				$.each(oResponse.data.rows, function()
				{
					var oRow = oRoot.childNodes.item(iRow);
					
					aHTML[++h] = '<tr class="interfaceMainRow">';
					
					aHTML[++h] = '<td id="tdNewsGroupsAddSelect-title-' + this.id + '" class="interfaceMainRowSelect">' +
											this.title + '</td>';
					
					aHTML[++h] = '</tr>'
				});
				
				aHTML[++h] = '</tbody></table>';

				$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
				$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
				
				$('td.interfaceMainRowSelect').click(function(event)
				{
					interfaceNewsGroupsAddSelect(event.target.id);
				});
			}
		}
	}	
}
	
	
function interfaceNewsGroupsAddSelect(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[2];
	
	$('#' + sXHTMLElementId).fadeOut(500);
	
	var sParam = 'method=NEWS_PERSON_GROUP_MANAGE';
	var sData = 'news=' + giObjectContext +
				'&group=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/news/?' + sParam,
			data: sData,
			dataType: 'text',
			success: function(data){interfaceNewsGroups()}
		});
		
}

function interfaceNewsGroupsAddRemove(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	
	var sParam = 'method=NEWS_PERSON_GROUP_MANAGE&remove=1';
	var sData = 'news=' + giObjectContext +
				'&group=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/news/?' + sParam,
			data: sData,
			dataType: 'text',
			success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
		});
		
}

function interfaceNewsTracking(aParam)
{
	var aHTML = [];
	var h = -1;	
					
	aHTML[++h] = '<table id="tableInterfaceMainTracking" class="interfaceMain">' +
					'<tr id="trInterfaceMainTrackingRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainTrackingColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainTrackingColumn2" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';					
					
	$('#divInterfaceMainTracking').html(aHTML.join(''));	
	
	var aHTML = [];
	var h = -1;	
	
	aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
							
	aHTML[++h] = '<tr><td id="tdInterfaceMainTrackingSummary" class="interfaceMainSummary">' +
					'<a href="#" id="aInterfaceMainTrackingSummary">Summary</a>' +
					'</td></tr>';
	
	aHTML[++h] = '<tr><td id="tdInterfaceMainTrackingDetails" class="interfaceMainSummary">' +
					'<a href="#" id="aInterfaceMainTrackingDetails">Details</a>' +
					'</td></tr>';
			
	aHTML[++h] = '</table>';					
	
	$('#tdInterfaceMainTrackingColumn2').html(aHTML.join(''));	
	
	$('#aInterfaceMainTrackingSummary').click(function(event)
	{
		interfaceNewsTrackingSummary({xhtmlElementId: 'tdInterfaceMainTrackingColumn1'});
	});
	
	$('#aInterfaceMainTrackingDetails').click(function(event)
	{
		interfaceNewsTrackingDetails({xhtmlElementId: 'tdInterfaceMainTrackingColumn1'});
	});
	
	interfaceNewsTrackingSummary({xhtmlElementId: 'tdInterfaceMainTrackingColumn1'});
}		

function interfaceNewsTrackingSummary(aParam, oResponse)
{
	
	var sXHTMLElementId = 'divInterfaceMainTracking';
	var sLabel = "groups";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
	}

	if (oResponse == undefined)
	{
		var sParam = 'method=NEWS_TRACKING_SUMMARY&rows=20' +
						'&news=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/news/?' + sParam,
			dataType: 'json',
			success: function(data){interfaceNewsTrackingSummary(aParam, data)}
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;
			
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceNewsHomeMostLikely">';
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No tracking information available.</td></tr>';
			aHTML[++h] = '</tbody></table>';
		}
		else
		{
			aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
				
			aHTML[++h] = '<table id="tableNewsGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Activity</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Link</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Count</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
										
				aHTML[++h] = '<td id="tdNewsGroupsList_activity-' + this.id + '" class="interfaceMainRow">' +
										this.activity + '</td>';
										
				aHTML[++h] = '<td id="tdNewsGroupsList_link-' + this.id + '" class="interfaceMainRow">' +
										this.link + '</td>';
				
				aHTML[++h] = '<td id="tdNewsGroupsList_link-' + this."id + '" class="interfaceMainRow">' +
										this.count + '</td>';
										
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#' + sXHTMLElementId).html(aHTML.join(''));
	}	
}	


function interfaceNewsTrackingDetails(aParam, oResponse)
{
	
	var sXHTMLElementId = 'divInterfaceMainTracking';
	var sLabel = "groups";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
	}

	if (oResponse == undefined)
	{
		var sParam = 'method=NEWS_TRACKING_SEARCH&rows=20' +
						'&news=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/news/?' + sParam,
			dataType: 'json',
			success: function(data){interfaceNewsTrackingDetails(aParam, data)}
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;
	
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceNewsHomeMostLikely">';
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No tracking information available.</td></tr>';
			aHTML[++h] = '</tbody></table>';
		}
		else
		{		
			aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
				
			aHTML[++h] = '<table id="tableNewsGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Contact</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Activity</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Link</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Date & Time</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdNewsGroupsList_contact-' + this.contactperson + '" class="interfaceMainRow">' +
										this.contactpersontext + '</td>';
										
				aHTML[++h] = '<td id="tdNewsGroupsList_activity-' + this.id + '" class="interfaceMainRow">' +
										this.activity + '</td>';
										
				aHTML[++h] = '<td id="tdNewsGroupsList_link-' + this.id + '" class="interfaceMainRow">' +
										this.link + '</td>';
				
				aHTML[++h] = '<td id="tdNewsGroupsList_link-' + this.id + '" class="interfaceMainRow">' +
										this.datetime + '</td>';
										
				aHTML[++h] = '</tr>';	
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		$('#' + sXHTMLElementId).html(aHTML.join(''));
	}	
}	

function interfaceNewsSave()
{
	var sParam = 'method=NEWS_MANAGE';
	var sData = '_=1';
	
	if (giObjectContext != -1)
	{
		sParam += '&select=' + giObjectContext	
	}	
	
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&subject=' + encodeURIComponent($('#inputInterfaceMainDetailsSubject').val());
		sData += '&startdate=' + encodeURIComponent($('#inputInterfaceMainDetailsStartDate').val());
		sData += '&stopdate=' + encodeURIComponent($('#inputInterfaceMainDetailsEndDate').val());
		sData += '&fromemail=' + $('#inputInterfaceMainDetailsFromEmail').val();
		sData += '&public=' + $('input[name="radioPublic"]:checked').val();
		sData += '&summary=' + encodeURIComponent($('#inputInterfaceMainDetailsSummary').val());
		sData += '&tracking=' + $('input[name="radioTracking"]:checked').val();
	}
	
	if ($('#divInterfaceMainEdit').html() != '')
	{
		sData += '&news=' + encodeURIComponent(tinyMCE.get('inputInterfaceMainEditText' + giEditorCounter).getContent());
	}
	
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/news/?' + sParam,
		data: sData,
		dataType: 'text',
		success: interfaceNewsSaveProcess
	});
		
}

function interfaceNewsSaveProcess(sResponse)
{

	interfaceMasterStatus('Saved');
		
	if ($('#divInterfaceMainGroups').html() != '')
	{
		if ($('input[name="radioEmailTo"]:checked').val() == '1')
		{
		
			var sParam = 'method=NEWS_PERSON_GROUP_MANAGE&remove=2';
			var sData = 'news=' + giObjectContext;
				
			$.ajax(
				{
					type: 'POST',
					url: '/ondemand/news/?' + sParam,
					data: sData,
					dataType: 'text',
					success: function(data){interfaceNewsGroups()}
				});
			
		}
		
		if ($('input[name="radioEmailTo"]:checked').val() == '2')
		{
		
			var sParam = 'method=NEWS_PERSON_GROUP_MANAGE';
			var sData = 'news=' + giObjectContext +
						'&group=-1';
				
			$.ajax(
				{
					type: 'POST',
					url: '/ondemand/news/?' + sParam,
					data: sData,
					dataType: 'text',
					success: function(data){interfaceNewsGroups()}
				});
				
		}
	}	
	
	var aResponse = sResponse.split('|');
	if (aResponse.length == 4)	
	{giObjectContext = aResponse[3]};
	gbInputDetected = false;
	interfaceNewsSearch('-' + giObjectContext, {source: 1});
}	

function interfaceNewsSendAsEmail(bPreview)
{
	var sParam = 'method=NEWS_SEND';
	var sMessage = 'News sent as email to contacts.';
	
	if (bPreview)
	{
		sMessage = 'News sent as email to you.';
		sParam += '&preview=1';	
	}	
	
	if (giObjectContext != -1)
	{
		
		sParam += '&select=' + giObjectContext	
	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/news/?' + sParam,
			dataType: 'text',
			success: interfaceMasterStatus(sMessage)
		});
	}		
	
}

function interfaceNewsSaveOptions()
{
}