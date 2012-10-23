var gbMessagingConversationOwner

function interfaceMessagingConversationMasterViewport(aParam)
{
	giObject = 50;
	gsObjectName = 'Messaging Conversation';
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
			newDestination: 'interfaceMessagingConversationMasterViewport({showHome: true});',
			move: false
			})		
	}
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Conversations"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceMessagingConversationSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceMessagingConversationSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceMessagingConversationSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceMessagingConversationNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOption').click(function(event)
	{
		interfaceMessagingConversationNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceMessagingConversationSave();
	});
	
	$('#spanInterfaceMasterViewportControlAction').button({disabled: true});
		
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceMessagingConversationSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceMessagingConversationSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceMessagingConversationHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceMessagingConversationHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceMessagingConversationSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceMessagingConversationSearch(event.target.id, {source: giSearchSource_BROWSE});
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
	
	if (bShowHome) {interfaceMessagingConversationHomeShow()};
	
}

function interfaceMessagingConversationHomeShow(oResponse)
{

	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceMessagingConversationHomeMostLikely" class="interfaceViewportMain">' +
						gsLoadingXHTML + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportMessagingConversationLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		sParam = 'method=MESSAGING_CONVERSATION_SEARCH&rows=10';

		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/messaging/?' + sParam,
			dataType: 'json',
			success: interfaceMessagingConversationHomeShow
		});
		
	}
	else
	{
		var aHTML = [];
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML.push('<table id="tableInterfaceMessagingConversationHomeMostLikely">');
			aHTML.push('<tr class="trInterfaceMessagingConversationHomeMostLikelyNothing">');
			aHTML.push('<td class="tdInterfaceMessagingConversationHomeMostLikelyNothing">Click New to create a MessagingConversation item.</td>');
			aHTML.push('</tr>');
			aHTML.push('</table>');
		}
		else
		{
		
			aHTML.push('<table id="tableInterfaceBewsHomeMostLikely">');
			aHTML.push('<tr>');
			aHTML.push('<td class="interfaceMain">MOST LIKELY</td>');
			aHTML.push('</tr>');
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML.push('<tr class="interfaceMainRow">');
				aHTML.push('<td id="interfaceMessagingConversationHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.title +
										'</td>');
				aHTML.push('</tr>');
			});
			
			aHTML.push('</tbody></table>');
			
			aHTML.push('<table id="tableInterfaceMessagingConversationHomeMostLikelyMore">');
			aHTML.push('<tr><td id="tdInterfaceMessagingConversationHomeMostLikelyMore">' +
						'<a href="#" id="aInterfaceMessagingConversationHomeMostLikelyMore">more...</a>' +
						'</td></tr>');
			aHTML.push('</tbody></table>');
		}
		
		$('#tdInterfaceMessagingConversationHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceMessagingConversationSearch(event.target.id, {source: 1});
		});
		
		$('#aInterfaceMessagingConversationHomeMostLikelyMore').click(function(event)
		{
			interfaceMessagingConversationSearch('tdInterfaceViewportMasterControlBrowse-', {source: giSearchSource_BROWSE});
		});
	}
}

function interfaceMessagingConversationSearch(sXHTMLElementId, aParam)
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
		var sData = 'id=' + giObjectContext;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_SEARCH',
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceMessagingConversationShow(aParam, data)}
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
			
			var oSearch = new AdvancedSearch();
			oSearch.endPoint = 'messaging';
			oSearch.method = 'MESSAGING_CONVERSATION_SEARCH';
			oSearch.addField('title');
			oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
			oSearch.rows = 10;
			oSearch.sort('title', 'asc');
			//oSearch.getResults(function(data) {interfaceMessagingConversationSearchShow(aParam, data)});
			
			var sData = 'quicksearch=' + sSearchText;

			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_SEARCH',
				data: sData,
				dataType: 'json',
				success: function(data) {interfaceMessagingConversationSearchShow(aParam, data)}
			});
			
		}
	};	
}

function interfaceMessagingConversationSearchShow(aParam, oResponse)
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
			
			aHTML[++h] = '<td class="interfaceSearch" id="-' + this.id + '">' +
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
			interfaceMessagingConversationSearch(event.target.id, {source: 1});
		});
	}	
}

function interfaceMessagingConversationViewport()
{	
	var aHTML = [];
	var h = -1;

	if (tinyMCE.getInstanceById('inputInterfaceMainEditText'))
	{
		tinyMCE.get('inputInterfaceMainEditText').remove();
		$('#inputInterfaceMainEditText').remove();
	}	
	
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
						'<td id="tdInterfaceViewportControlParticipants" class="interfaceViewportControl">Participants</td>' +
						'</tr>';			
		
		aHTML[++h] = '</table>';
		
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
		
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlPosts" class="interfaceViewportControl">Posts</td>' +
						'</tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlComments" class="interfaceViewportControl">Comments</td>' +
						'</tr>';				
						
		aHTML[++h] = '</table>';
		
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
		
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
	aHTML[++h] = '<div id="divInterfaceMainParticipants" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainParticipantsAdd" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainPosts" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainComments" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainPostDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary", true);
		interfaceMessagingConversationSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceMessagingConversationDetails();
	});
	
	$('#tdInterfaceViewportControlParticipants').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainParticipants", true);
		interfaceMessagingConversationParticipants();
	});
	
	$('#tdInterfaceViewportControlPosts').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainPosts");
		interfaceMessagingConversationPosts();
	});
	
	$('#tdInterfaceViewportControlComments').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainComments");
		interfaceMessagingConversationComments();
	});
	
	$('#tdInterfaceViewportControlAttachments').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAttachments", true);
		interfaceMasterAttachments({xhtmlElementID: 'divInterfaceMainAttachments'});
	});
}

function interfaceMessagingConversationShow(aParam, oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceMessagingConversationViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find conversation.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		goObjectContext = undefined;
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		gbMessagingConversationOwner = false;
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceMessagingConversationMasterViewport({showHome: false});interfaceMessagingConversationSearch("-' + giObjectContext + '")',
			move: false
			})
				
		$('#divInterfaceViewportControlContext').html(goObjectContext.title);
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
		
		gbMessagingConversationOwner = (gsUserID == goObjectContext.user)
		
		interfaceMessagingConversationSummary();
	}
}		
		
function interfaceMessagingConversationSummary()
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
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find conversation.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
					
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryOwner" class="interfaceMainSummary">Owner</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryOwnerValue" class="interfaceMainSummaryValue">' +
						goObjectContext.ownerusertext +
						'</td></tr>';	
						
		if (goObjectContext.description != '')
		{	
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
						 interfaceMasterFormatXHTML(goObjectContext.description) +
						'</td></tr>';
		}				
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action" cellspacing=0>';
		
		if (gbMessagingConversationOwner)
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryAddParticipant" class="interfaceMainColumn2Action">' +
						'<a href="#" id="aInterfaceMainSummaryAddParticipant">Add&nbsp;Participant</a>' +
						'</td></tr>';
		}
		else
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryRemoveParticipant" class="interfaceMainColumn2Action">' +
						'<a href="#" id="aInterfaceMainSummaryRemoveParticipant">Leave</a>' +
						'</td></tr>';
		}	
				
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
		
		$('#aInterfaceMainSummaryAddParticipant').click(function(event)
		{
			interfaceMessagingConversationParticipantsAdd();
		});
		
	}	
}

function interfaceMessagingConversationActionOptionsBind()
{
}	

function interfaceMessagingConversationDetails()
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
			
		if (gbMessagingConversationOwner)
		{
			aHTML[++h] = '<tr id="trInterfaceMainDetailsTitle" class="interfaceMain">' +
							'<td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
							'Title' +
							'</td></tr>' +
							'<tr id="trInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
							'<input onDemandType="TEXT" id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainText">' +
							'</td></tr>';
							
			aHTML[++h] = '<tr id="trInterfaceMainDetailsSharing" class="interfaceMain">' +
							'<td id="tdInterfaceMainDetailsSharing" class="interfaceMain">' +
							'Sharing' +
							'</td></tr>' +
							'<tr id="trInterfaceMainDetailsSharing" class="interfaceMainText">' +
							'<td id="tdInterfaceMainDetailsSharingValue" class="interfaceMainText">' +
							'<input type="radio" id="radioSharingY" name="radioSharing" value="1"/>Added Participants & Network Groups' +
							'<br /><input type="radio" id="radioSharingN" name="radioSharing" value="2"/>Everyone (Public)' +
							'<br /><input type="radio" id="radioSharingN" name="radioSharing" value="3"/>Internal' +
							'</td></tr>';

			aHTML[++h] = '<tr id="trInterfaceMainDetailsParticipantCan" class="interfaceMain">' +
							'<td id="tdInterfaceMainDetailsParticipantCan" class="interfaceMain">' +
							'Participant Can' +
							'</td></tr>' +
							'<tr id="trInterfaceMainDetailsParticipantCan" class="interfaceMainText">' +
							'<td id="tdInterfaceMainDetailsParticipantCanValue" class="interfaceMainText">' +
							'<input type="radio" id="radioParticipantCan1" name="radioParticipantCan" value="1"/>Add Posts & Comments' +
							'<br /><input type="radio" id="radioParticipantCan2" name="radioParticipantCan" value="2"/>Add Comments Only' +
							'<br /><input type="radio" id="radioParticipantCan3" name="radioParticipantCan" value="3"/>View Only' +
							'<br /><input type="radio" id="radioParticipantCan4" name="radioParticipantCan" value="4"/>Add Posts Only' +
							'</td></tr>';
							
			aHTML[++h] = '<tr id="trInterfaceMainDetailsAlertURL" class="interfaceMain">' +
							'<td id="tdInterfaceMainDetailsAlertURL" class="interfaceMain">' +
							'URL For Alerts' +
							'</td></tr>' +
							'<tr id="trInterfaceMainDetailsURLValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainDetailsURLValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainDetailsAlertURL" class="inputInterfaceMainText">' +
							'</td></tr>';
							
		}			
		else
		{
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">Only the owner can change the conversation details.</td></tr>';
		}
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		if (gbMessagingConversationOwner)
		{
			var aHTML = [];
			var h = -1;
					
			aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
			
			aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
							'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
							'Description' +
							'</td></tr>' +
							'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
							'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
							'<textarea rows="5" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
							'</td></tr>';
			
			aHTML[++h] = '</table>';					
				
			$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
		}	
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsTitle').val(goObjectContext.title);
			$('#inputInterfaceMainDetailsDescription').val(goObjectContext.description);
			$('#inputInterfaceMainDetailsAlertURL').val(goObjectContext.alerturl);
			
			$('[name="radioSharing"][value="' + goObjectContext.sharing + '"]').attr('checked', true);
			$('[name="radioParticipantCan"][value="' + goObjectContext.participantcan + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioSharing"][value="1"]').attr('checked', true);
			$('[name="radioParticipantCan"][value="1"]').attr('checked', true);
		}		
	}	
}

function interfaceMessagingConversationParticipants(aParam)
{
	var aHTML = [];
	var h = -1;	
					
	aHTML[++h] = '<table id="tableInterfaceMainParticipants" class="interfaceMain">' +
					'<tr id="trInterfaceMainParticipantsRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainParticipantsColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainParticipantsColumn2" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';					
					
	$('#divInterfaceMainParticipants').html(aHTML.join(''));	
	
	if (gbMessagingConversationOwner)
	{	
		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
										
		aHTML[++h] = '<tr><td id="tdInterfaceMainSend" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainParticipantsAdd">Add</span>' +
							'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainParticipantsColumn2').html(aHTML.join(''));	
	
		$('#spanInterfaceMainParticipantsAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				interfaceMessagingConversationParticipantsAdd();
			})
	}		
	
	interfaceMessagingConversationParticipantsManage({xhtmlElementId: 'tdInterfaceMainParticipantsColumn1'});
}		

function interfaceMessagingConversationParticipantsManage(aParam, oResponse)
{
	
	var sXHTMLElementId = 'divInterfaceMainParticipants';
	var sLabel = "Participants";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
	}

	if (oResponse == undefined)
	{
		var sData = 'conversation=' + giObjectContext;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_PARTICIPANT_SEARCH',
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceMessagingConversationParticipantsManage(aParam, data)}
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceMessagingConversationHomeMostLikely">';
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No participants.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainParticipantsColumn1').html(aHTML.join(''));
		}
		else
		{
			aHTML[++h] = '<table id="tableMessagingConversationParticipantsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdMessagingConversationParticipantsList_userlogonname-' + this.user + '" class="interfaceMainRow">' +
										this.userlogonname + '</td>';
										
				aHTML[++h] = '<td id="tdMessagingConversationParticipantsList-' + this.user + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
										
				aHTML[++h] = '</tr>';		
			})
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			
			if (gbMessagingConversationOwner)
			{
				$('.interfaceMainRowOptionsSelect').button( {
					text: false,
					 icons: {
						 primary: "ui-icon-close"
					}
				})
				.click(function() {
					interfaceMessagingConversationParticipantsRemove(this.id)
				})
				.css('width', '15px')
				.css('height', '20px')
			}		
		}
	}	
}	

function interfaceMessagingConversationParticipantsAdd(aParam, oResponse)
{
	var sXHTMLElementId = 'divInterfaceMainParticipantsAdd';
	var oSearch;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
		if (aParam.search != undefined) {oSearch = aParam.search}
	}
	
	if (oResponse == undefined)
	{		
		if (oSearch == undefined)
		{
			interfaceMasterMainViewportShow('#' + sXHTMLElementId);
			
			var aHTML = [];
			var h = -1;	
						
			aHTML[++h] = '<table id="tableInterfaceMainParticipantsAdd" class="interfaceMain">' +
							'<tr id="trInterfaceMainParticipantsAddRow1" class="interfaceMainRow1">' +
							'<td id="tdInterfaceMainParticipantsAddColumn1" class="interfaceMainColumn1">' +
							gsLoadingXHTML +
							'</td>' +
							'<td id="tdInterfaceMainParticipantsAddColumn2" class="interfaceMainColumn2Action" style="width:50%;">' +
							'</td>' +
							'</tr>' +
							'</table>';					
							
			$('#divInterfaceMainParticipantsAdd').html(aHTML.join(''));	
			
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainParticipantsAdd" class="interfaceMain">';
			
			aHTML[++h] = '<tr id="trInterfaceMainParticipantsAddFirstName" class="interfaceMain">' +
						'<td id="tdInterfaceMainParticipantsAddFirstName" class="interfaceMain">' +
						'First Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainParticipantsAddFirstNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainParticipantsAddFirstNameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainParticipantsAddFirstName" class="inputInterfaceMainText">' +
						'</td></tr>';							

			aHTML[++h] = '<tr id="trInterfaceMainParticipantsAddSurname" class="interfaceMain">' +
						'<td id="tdInterfaceMainParticipantsAddSurname" class="interfaceMain">' +
						'Surname' +
						'</td></tr>' +
						'<tr id="trInterfaceMainParticipantsAddSurnameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainParticipantsAddSurnameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainParticipantsAddSurname" class="inputInterfaceMainText">' +
						'</td></tr>';
						
			aHTML[++h] = '<tr id="trInterfaceMainParticipantsAddEmail" class="interfaceMain">' +
						'<td id="tdInterfaceMainParticipantsAddEmail" class="interfaceMain">' +
						'Email' +
						'</td></tr>' +
						'<tr id="trInterfaceMainParticipantsAddEmailValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainParticipantsAddEmailValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainParticipantsAddEmail" class="inputInterfaceMainText">' +
						'</td></tr>';
						
			aHTML[++h] = '<tr id="trInterfaceMainParticipantsAddUserText" class="interfaceMain">' +
						'<td id="tdInterfaceMainParticipantsAddUserText" class="interfaceMain">' +
						'Logon Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainParticipantsAddUserTextValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainParticipantsAddUserTextValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainParticipantsAddUserText" class="inputInterfaceMainText">' +
						'</td></tr>';
						
			aHTML[++h] = '</table>';		
			
			aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
				
			aHTML[++h] = '<tr><td id="tdInterfaceParticipantsAddSearch" class="interfaceMainAction">' +
							'<span id="spanInterfaceParticipantsAddSearch">Search</span>' +
							'</td></tr>';
						
			aHTML[++h] = '</table>';					
		
			$('#tdInterfaceMainParticipantsAddColumn1').html(aHTML.join(''))
			
			$('#spanInterfaceParticipantsAddSearch').button(
			{
				label: "Search"
			})
			.click(function() {
			
				var oSearchSet = {}
				if ($('#inputInterfaceMainParticipantsAddFirstName').val() != '')
				{
					oSearchSet.firstName = $('#inputInterfaceMainParticipantsAddFirstName').val()
				}
				if ($('#inputInterfaceMainParticipantsAddSurname').val() != '')
				{
					oSearchSet.surname = $('#inputInterfaceMainParticipantsAddSurname').val()
				}
				if ($('#inputInterfaceMainParticipantsAddEmail').val() != '')
				{
					oSearchSet.email = $('#inputInterfaceMainParticipantsAddEmail').val()
				}
				if ($('#inputInterfaceMainParticipantsAddUserText').val() != '')
				{
					oSearchSet.userText = $('#inputInterfaceMainParticipantsAddUserText').val()
				}
				if (aParam == undefined) {aParam = {}}
				aParam.search = oSearchSet;
				interfaceMessagingConversationParticipantsAdd(aParam);
			})
		
		}
		else
		{
			var sData = 'rf=json';
		
			if (oSearch.firstName != undefined) 
			{
				sData += '&firstname=' + encodeURIComponent(oSearch.firstName);
			}	
			if (oSearch.surname != undefined)
			{
				sData += '&surname=' + encodeURIComponent(oSearch.surname);
			}
			if (oSearch.email != undefined)
			{
				sData += '&email=' + encodeURIComponent(oSearch.email);
			}
			if (oSearch.userText != undefined)
			{
				sData += '&usertext=' + encodeURIComponent(oSearch.userText);
			}
		
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/network/?method=NETWORK_USER_SEARCH',
				data: sData,
				dataType: 'json',
				success: function(data){interfaceMessagingConversationParticipantsAdd(aParam, data)}
			});
		}	
	}
	else
	{
		if (oResponse.status == 'ER')
		{
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table id="tableMessagingConversationParticpantsAddSelect" border="0" cellspacing="0" cellpadding="0">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">You need set the search criteria.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainParticipantsAddColumn2').html(aHTML.join(''));
		}
		else
		{
			var aHTML = [];
			var h = -1;
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<table id="tableMessagingConversationParticpantsAddSelect" border="0" cellspacing="0" cellpadding="0">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No matching users.</td></tr>';
				aHTML[++h] = '</tbody></table>';

				$('#tdInterfaceMainParticipantsAddColumn2').html(aHTML.join(''));
			}
			else
			{
				aHTML[++h] = '<table id="tableMessagingConversationParticpantsAddSelect" class="interfaceMain">';
				aHTML[++h] = '<tbody>'
				
				$.each(oResponse.data.rows, function()
				{	
					aHTML[++h] = '<tr class="interfaceMainRow">';
					aHTML[++h] = '<td id="tdMessagingConversationParticpantsAddSelect-title-' +
											this.user + '" class="interfaceMainRow">' +
											this.usertext + '</td>';
					
					aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">' +
									'<span id="spanMessagingConversationParticipantAddSelect-' + this.user + '" class="interfaceMainRowSelect"></span>' +
									'</td></tr>';
					
				});
				
				aHTML[++h] = '</tbody></table>';

				$('#tdInterfaceMainParticipantsAddColumn2').html(aHTML.join(''));
				
				$('.interfaceMainRowSelect').button({
					text: false,
					label: "Add",
					icons: {
						 primary: "ui-icon-check"
					}
				})
				.click(function() {
					interfaceMessagingConversationParticipantsAddSelect(this.id);
				})
				.css('width', '15px')
				.css('height', '20px')
			}
		}	
	}
}

function interfaceMessagingConversationParticipantsAddSelect(sXHTMLElementId)
{
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sContext = aSearch[1];
	
	var sData = 'user=' + sContext + '&conversation=' + giObjectContext;
				
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_PARTICIPANT_MANAGE',
		data: sData,
		dataType: 'text',
		success: function(data){$('#' + sXHTMLElementId).parent().parent().fadeOut(500)}
	});	
}
	
function interfaceMessagingConversationParticipantsRemove(sXHTMLElementId)
{
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sContext = aSearch[1];
	
	var sData = 'user=' + sContext + '&conversation=' + giObjectContext;
				
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_PARTICIPANT_MANAGE&remove=1',
		data: sData,
		dataType: 'text',
		success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
	});	
}

function interfaceMessagingConversationPosts(aParam, oResponse)
{
	var sXHTMLElementId = 'divInterfaceMainPosts';
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
	}

	if (oResponse == undefined)
	{
		var sData = 'includeme=1&dontencode=1&conversation=' + giObjectContext;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_POST_SEARCH',
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceMessagingConversationPosts(aParam, data)}
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;	
						
		aHTML[++h] = '<table id="tableInterfaceMainPosts" class="interfaceMain">' +
						'<tr id="trInterfaceMainPostsRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainPostsColumn1" class="interfaceMainColumn1Large">' +
						gsLoadingXHTML +
						'</td>' +
						'<td id="tdInterfaceMainPostsColumn2" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';					
						
		$('#divInterfaceMainPosts').html(aHTML.join(''));	
	
		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
				
		aHTML[++h] = '<tr><td id="tdInterfaceMainSend" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainAdd">Add</span>' +
							'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainPostsColumn2').html(aHTML.join(''));	
	
		$('#spanInterfaceMainAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			interfaceMessagingConversationPostsAdd(false);
		})
		
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceMessagingConversationHomeMostLikely">';
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No posts.</td></tr>';
			aHTML[++h] = '</tbody></table>';
		}
		else
		{		
			aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
				
			aHTML[++h] = '<table id="tableMessagingConversationPostsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Subject</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">By</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				var sSubject = this.subject;
				if (sSubject == '') {sSubject = (this.message).substring(0, 50) + '...'}		
								
				aHTML[++h] = '<td id="tdMessagingConversationPostsList_subject-' + this.id + '" class="interfaceMainRow">' +
										sSubject + '</td>';
										
				aHTML[++h] = '<td id="tdMessagingConversationPostsList_usertext-' + this.id + '" class="interfaceMainRow">' +
										this.usertext + '</td>';
										
				aHTML[++h] = '<td id="tdMessagingConversationPostsList_date-' + this.id + '" class="interfaceMainRow">' +
										this.datetime + '</td>';
								
				aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">' +
									'<span id="spanMessagingConversationPostsComment-' + this.id + '" class="interfaceMainRowSelect interfaceMainRowSelectAddComment"></span>' +
									'</td></tr>';
					
			});
				
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainPostsColumn1').html(aHTML.join(''));
		
			$('.interfaceMainRowSelectAddComment').button({
				text: false,
				label: "Comment",
				icons: {
					 primary: "ui-icon-comment"
				}
			})
			.click(function() {
				interfaceMessagingConversationCommentsOptions({xhtmlElementID: this.id});
			})
			.css('width', '15px')
			.css('height', '20px')
		}
	}	
}	

function interfaceMessagingConversationCommentsOptions(aParam)
{
	var aHTML = [];
	var h = -1;
	var iStep = 1;
	var sXHTMLElementID;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.step != undefined) {iStep = aParam.step}
	}
	
	if (iStep == 1) 
	{
		aHTML[++h] = '<table id="tableMessagingConversationCommentsOptions" style="width:75px;" class="interfaceDropDown">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMessagingConversationCommentsOptionsView" class="interfaceMainAction">' +
						'<span id="spanInterfaceMessagingConversationCommentsOptionsView">View</span>' +
						'</td></tr>';
						
		aHTML[++h] = '<tr><td id="tdInterfaceMessagingConversationCommentsOptionsAdd" class="interfaceMainAction">' +
						'<span id="spanInterfaceMessagingConversationCommentsOptionsAdd">Add</span>' +
						'</td></tr>';				
		
		aHTML[++h] = '</table>';					

		interfaceMasterViewportOptionsShow({
			xhtmlElementID: sXHTMLElementID,
			offsetLeft: -75,
			offsetTop: 6,
			xhtml: aHTML.join('')
		});
		
		$('#spanInterfaceMessagingConversationCommentsOptionsView').button(
		{
			label: "View"
		})
		.click(function() {
			interfaceMasterViewportOptionsHide();
			interfaceMasterMainViewportShow("#divInterfaceMainComments");
			var aXHTMLElementID = sXHTMLElementID.split('-');
			interfaceMessagingConversationComments({post: aXHTMLElementID[1]});
		})
		.css('width', '75px')
		
		$('#spanInterfaceMessagingConversationCommentsOptionsAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			interfaceMessagingConversationCommentsOptions({xhtmlElementID: sXHTMLElementID, step: 2});
		})
		.css('width', '75px')
	}

	if (iStep == 2)
	{
		var aHTML = [];
		var h = -1;
							
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceDropDown">';									
	
		aHTML[++h] = '<tr id="trInterfaceMainPostDetailsMessageValue" class="interfaceMainTextMulti">' +
							'<td id="tdInterfaceMainPostDetailsMessageValue" class="interfaceMainTextMulti">' +
							'<textarea name="message" rows="15" cols="10" id="inputInterfaceMainCommentMessage"' +
									' class="inputInterfaceMainTextMulti"></textarea>' +
							'</td></tr>';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainCommentsSend" class="interfaceMainAction" style="text-align:right;">' +
						'<span id="spanInterfaceMainCommentsSend">Send</span>' +
						'</td></tr>';
								
		aHTML[++h] = '</table>';

		interfaceMasterViewportOptionsShow({
			xhtmlElementID: sXHTMLElementID,
			offsetLeft: -251,
			offsetTop: 6,
			xhtml: aHTML.join(''),
			forceShow: true
		});
		
		$('#spanInterfaceMainCommentsSend').button(
		{
			label: "Send"
		})
		.click(function() {
			interfaceMessagingConversationCommentsOptions({xhtmlElementID: sXHTMLElementID, step: 3});
		})
		.css('width', '75px')
	}
	
	if (iStep == 3)
	{
		$('#spanInterfaceMainCommentsSend').html(gsLoadingSmallXHTML);
		
		var sData = 'message=' + interfaceMasterFormatSave($('#inputInterfaceMainCommentMessage').val())
		
		var aXHTMLElementID = sXHTMLElementID.split('-');
		sData += '&post=' + aXHTMLElementID[1];
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_POST_COMMENT_MANAGE',
			data: sData,
			dataType: 'json',
			success: function(data)
				{
					if (data.status == 'OK')
					{
						interfaceMasterViewportOptionsHide();
					}
					else
					{
						alert ('Comment could not be sent.');
					}	
				}
		});	
	
	}
	
}

function interfaceMessagingConversationPostsAdd(aParam, oResponse)
{
	var sXHTMLElementId = "divInterfaceMainPostDetails";
	var sXHTMLElementContextId;
	var iPost;
	
	for (edId in tinyMCE.editors) 
					tinyMCE.editors[edId].destroy(true);
				
	giEditorCounter = giEditorCounter + 1;		
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
		if (aParam.xhtmlElementContextId != undefined) {sXHTMLElementContextId = aParam.xhtmlElementContextId}
		if (aParam.post != undefined) {iPost = aParam.post}
	}

	if (sXHTMLElementContextId != undefined)
	{
		var aSearch = sXHTMLElementContextId.split('-');
		var sElementId = aSearch[0];
		var lProjectTask = aSearch[1];
	}	
		
	interfaceMasterMainViewportShow("#divInterfaceMainPostDetails");	
		
	var aHTML = [];
	var h = -1;
		
	aHTML[++h] = '<table id="tableInterfaceMainPostDetails" class="interfaceMain">' +
					'<tr id="trInterfaceMainPostDetailsRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainPostDetailsColumn1" class="interfaceMainColumn1Large">' +
					'</td>' +
					'<td id="tdInterfaceMainPostDetailsColumn2" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
	$('#' + sXHTMLElementId).html(aHTML.join(''));
			
	if (oResponse == undefined && iPost != undefined)
	{
		var sData = 'id=' + iPost;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_POST_SEARCH',
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceMessagingConversationPostsAdd(aParam, data)}
		});
	}
	else
	{
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainTaskDetailsColumn2" class="interfaceMainColumn2Action">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainPostDetailsSend" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainPostDetailsSend">Send</span>' +
						'</td></tr>';
								
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainPostDetailsColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainPostDetailsSend').button(
		{
			label: "Send"
		})
		.click(function() {
			if ($('#oFile0').val() == '')
			{
				interfaceMessagingConversationPostDetailsSend()
			}
			else
			{
				interfaceMasterAttachmentsUploadProcess({functionPostUpdate: interfaceMessagingConversationPostsShow});
			}	
		})
		
		var aHTML = [];
		var h = -1;
							
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';					
							
		aHTML[++h] = '<tr id="trInterfaceMainPostDetailsSubject" class="interfaceMain">' +
							'<td id="tdInterfaceMainPostDetailsSubject" class="interfaceMain">' +
							'Subject' +
							'</td></tr>' +
							'<tr id="trInterfaceMainPostDetailsSubjectValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainPostDetailsSubjectValue" class="interfaceMainText">' +
							'<input name="subject" id="inputInterfaceMainPostDetailsSubject" class="inputInterfaceMainText">' +
							'</td></tr>';							
	
		aHTML[++h] = '<tr id="trInterfaceMainPostDetailsMessageValue" class="interfaceMainTextMulti">' +
							'<td id="tdInterfaceMainPostDetailsMessageValue" class="interfaceMainTextMulti">' +
							'<textarea name="message" rows="25" cols="50" id="inputInterfaceMainPostDetailsMessage' +
									giEditorCounter + '" editorcount="' + giEditorCounter + '" class="inputInterfaceMainTextMulti"></textarea>' +
									
							'</td></tr>';
	
		aHTML[++h] = '</table>';						
	
		$('#tdInterfaceMainPostDetailsColumn1').html(
			interfaceMasterAttachmentsUpload(
				{
					xhtml: aHTML.join(''),
					label: ''
				})
		);
		
		if (gbRichEdit)
		{
			tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainPostDetailsMessage' + giEditorCounter);
		}	
		
		if (oResponse != undefined)
		{	
			if (oResponse.data.rows.length != 0)
			{
				$('#inputInterfaceMainPostDetailsSubject').val(oResponse.data.rows[0].subject);
				$('#inputInterfaceMainPostDetailsMessage').val(oResponse.data.rows[0].message);		
			}
		}	
	}	
}	

function interfaceMessagingConversationPostDetailsSend()
{
	var sParam = '/ondemand/messaging/?method=MESSAGING_CONVERSATION_POST_MANAGE'
	var sData = 'conversation=' + giObjectContext;
	
	sData += '&subject=' + encodeURIComponent($('#inputInterfaceMainPostDetailsSubject').val());
	sData += '&message=' + encodeURIComponent(tinyMCE.get('inputInterfaceMainPostDetailsMessage' + giEditorCounter).getContent()) 
		
	interfaceMasterSave(sParam, sData, 'Post Sent');
	interfaceMasterMainViewportShow("#divInterfaceMainPosts", true);
	interfaceMessagingConversationPosts();	
}

function interfaceMessagingConversationPostsShow()
{
	interfaceMasterMainViewportShow("#divInterfaceMainPosts", true);
	interfaceMessagingConversationPosts();	
}

function interfaceMessagingConversationComments(aParam, oResponse)
{
	var sXHTMLElementId = 'divInterfaceMainComments';
	var iPost;
	
	if (aParam != undefined)
	{
		if (aParam.post != undefined) {iPost = aParam.post}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
	}

	if (oResponse == undefined)
	{
		var sData = 'includeme=1&conversation=' + giObjectContext;
		
		if (iPost != undefined)
		{
			sData += '&post=' + iPost;
		}
		else
		{
			sData += '&includepost=1';
		}	
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_POST_COMMENT_SEARCH',
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceMessagingConversationComments(aParam, data)}
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;	
						
		aHTML[++h] = '<table id="tableInterfaceMainComments" class="interfaceMain">' +
						'<tr id="trInterfaceMainCommentsRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainCommentsColumn1" class="interfaceMainColumn1Large">' +
						gsLoadingXHTML +
						'</td>' +
						'<td id="tdInterfaceMainCommentsColumn2" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';					
						
		$('#divInterfaceMainComments').html(aHTML.join(''));	
	
		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
				
		aHTML[++h] = '<tr><td id="tdInterfaceMainCommentAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainCommentsAdd">Add</span>' +
							'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainCommentsColumn2').html(aHTML.join(''));	
	
		$('#spanInterfaceMainCommentsAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			interfaceMessagingConversationCommentsAdd(false);
		})
		
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceMessagingConversationHomeMostLikely">';
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No comments.</td></tr>';
			aHTML[++h] = '</tbody></table>';
		}
		else
		{		
			aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
				
			aHTML[++h] = '<table id="tableMessagingConversationCommentsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			if (iPost == undefined)
			{
				aHTML[++h] = '<td class="interfaceMainCaption">Post</td>';
			}
			aHTML[++h] = '<td class="interfaceMainCaption">Comment</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">By</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
									
				if (iPost == undefined)
				{
					aHTML[++h] = '<td id="tdMessagingConversationCommentsList_postsubject-' + this.id + '" class="interfaceMainRow">' +
										this.postsubject + '</td>';	
				}
				
				aHTML[++h] = '<td id="tdMessagingConversationCommentsList_message-' + this.id + '" class="interfaceMainRow">' +
										this.message + '</td>';
										
				aHTML[++h] = '<td id="tdMessagingConversationCommentsList_usertext-' + this.id + '" class="interfaceMainRow">' +
										this.usertext + '</td>';
										
				aHTML[++h] = '<td id="tdMessagingConversationCommentsList_date-' + this.id + '" class="interfaceMainRow">' +
										this.datetime + '</td>';
					
				aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">' +
									'<span id="spanMessagingConversationPostsComment-' + this.post + '" class="interfaceMainRowSelect interfaceMainRowSelectAddComment"></span>' +
									'</td></tr>';
						
				aHTML[++h] = '</tr>'
				
			});
			
			aHTML[++h] = '</tbody></table>';	
		}
		
		$('#divInterfaceMainComments').html(aHTML.join(''));
		
		$('.interfaceMainRowSelectAddComment').button({
			text: false,
			label: "Comment",
			icons: {
				 primary: "ui-icon-comment"
			}
		})
		.click(function() {
			interfaceMessagingConversationCommentsOptions({xhtmlElementID: this.id});
		})
		.css('width', '15px')
		.css('height', '20px')
		
	}	
}



function interfaceMessagingConversationSave()
{
	var sData = '_=1';
	
	if (giObjectContext != -1)
	{
		sData += '&id=' + giObjectContext	
	}	
	
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsTitle').val());
		sData += '&description=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDescription').val());
		sData += '&sharing=' + $('input[name="radioSharing"]:checked').val();
		sData += '&participantcan=' + $('input[name="radioParticipantCan"]:checked').val();
		sData += '&alerturl=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsAlertURL').val());
	}
	
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_MANAGE',
		data: sData,
		dataType: 'json',
		success: interfaceMessagingConversationSaveProcess
	});		
}

function interfaceMessagingConversationSaveProcess(oResponse)
{		
	if (oResponse.status == 'OK')
	{
		interfaceMasterStatus('Saved');
		if (giObjectContext == -1) {giObjectContext = oResponse.id};	
		gbInputDetected = false;
		interfaceMessagingConversationSearch('-' + giObjectContext, {source: 1});
	}
	else
	{
		interfaceMasterStatus(oResponse.error.errornotes);
		interfaceMasterConfirm( {html: [oResponse.error.errornotes]
								   , title: 'Save error!'});
	}
}	


function interfaceMessagingConversationSaveOptions()
{


}

