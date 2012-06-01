//Based on using the mydigitalstructure caching.
//So primarily working of the cache object in the model.
// totals & get details for messages not fully cached.  Show part of message that have and then back fill attachments and message
// Back update flags for read.

var giMessagingAccountID = -1;
var gaMessagingEmailRead = [];
var gaMessagingEmailRemoved = [];
var gbMessagingEmailShowDeleted = false;
var gaMessagingEmailInbox = [];
var gaMessagingEmailInboxXHTML = [];
var gsMessagingLastMessageID = '';
var giMessagingLastInboxPageID = '';
var giMessagingActionID = -1;
var giMessagingRows = 25;
var giMessagingEmailCount = 0;
var giMessagingAccounts = [];
var giMessagingEmailSkippedCount;
var giMessagingEmailLastPage = 1;
var gsMessagingEmailLastPagination;
var giMessagingEmailNewCount;
var gbMessagingAutoCheck = false;

function interfaceMessagingIMAPMasterViewport(aParam)
{

	giObject = 10;
	gsObjectName = 'Message';
	goObjectContext = undefined;
	giObjectContext = -1;
	bShowHome = true;
			
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
	}	
			
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Email"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceMessagingSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceMessagingSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceMessagingSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainEdit");
		interfaceMessagingNew({xhtmlElementID: 'divInterfaceMainEdit', newEmail: true});
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceMessagingSendEmail();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceMessagingSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceMessagingSaveOptions();
	});
		
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceMessagingSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceMessagingHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceMessagingHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceMessagingSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceMessagingSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	$('#divInterfaceViewportControl').html('');	

	if (gbRichEdit)
	{
	
		tinyMCE.init(
		{
			mode : "none",
			height : "500px", 
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
			visual : false, 
			gecko_spellcheck : true,
			content_css : gsEditorCSS,
			
			external_link_list_url : "/jscripts/ibcom/linkList.asp", 
			external_image_list_url : "/jscripts/ibcom/imageList.asp?LinkType=19&LinkId=" + giObjectContext, 
			media_external_list_url : "/jscripts/ibcom/mediaList.asp?LinkType=19&LinkId=" + giObjectContext, 

		});				
	
	}
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainInbox" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainEdit" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainActionsSent" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	giMessagingAccounts.length = 0;
	
	if (bShowHome) {interfaceMessagingHomeShow(aParam)};
}

function interfaceMessagingCheckForNew(aParam, oResponse)
{
	if (oResponse == undefined)
	{
		var sParam = 'method=MESSAGING_EMAIL_CACHE_CHECK';
		sParam += '&account=' + giMessagingAccountID;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/messaging/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceMessagingCheckForNew(aParam, data)}
		});
	}
	else
	{
		giMessagingEmailNewCount = oResponse.newrows;
		$('#interfaceMainHeaderRefresh').html('Refresh (' + giMessagingEmailNewCount + ')')	
	}
}			

function interfaceMessagingHomeShow(aParam, oResponse)
{
	var bAutoShow = true;

	if (aParam != undefined)
	{
		if (aParam.autoShow != undefined) {bAutoShow = aParam.autoShow}
	}	
	
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	
	if (giMessagingAccounts.length == 0)
	{
		if (oResponse == undefined)
		{
			var aHTML = [];
			var h = -1;
						
			aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
			aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
							'<td id="tdInterfaceProjectHomeMostLikely" class="interfaceViewportMain">' +
							'' +  
							'</td>' +
							'</tr>';
			aHTML[++h] = '</table>';					
			
			$('#divInterfaceViewportControl').html(gsLoadingXHTML);
			
			var sParam = 'method=MESSAGING_EMAIL_ACCOUNT_SEARCH';
			
			if (gbMessagingEmailShowCount) {sParam += '&advanced=1'}
			sParam += '&account=' + gsMessagingEmailAccount;
			sParam += '&type=5';
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/messaging/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceMessagingHomeShow(aParam, data)}
			});
		}
		else
		{
			var aHTML = [];
			var h = -1;
						
			aHTML[++h] = '<table>';
			aHTML[++h] = '<tr>' +
							'<td id="interfaceMasterViewportMessagingEmailLarge" class="interfaceMasterViewportImageLarge">' +
							'&nbsp;' + 
							'</td>' +
							'</tr>';
			aHTML[++h] = '</table>';		
			
			giMessagingAccounts.length = 0;
			
			if (oResponse.data.rows.length != 0)
			{
				aHTML[++h] = '<table style="padding-top:0px;" id="tableInterfaceMessagingAccounts" class="interfaceViewportControl">';
				
				$.each(oResponse.data.rows, function(index)
				{
					giMessagingAccounts.push({
						id: this.id,
						footer: this.footer
					})		
					
					if (index == 0) 
					{
						giMessagingAccountID = this.id;
					}
					else
					{
						giMessagingAccountID = undefined;
					}
					
					var sDescription = this.description;
					var aDescription = sDescription.split("@");
						
					sDescription = aDescription[0];
					
					aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
						'<td id="interfaceMessaging-' + this.id + '" ' +
								'class="interfaceViewportControl"' +
								' title="' + this.description + '">' +
								sDescription +
								'</td>' +
						'</tr>';
						
					if (gbMessagingEmailShowCount)
					{	
						aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
						'<td id="tdInterfaceMessagingCount-' + this.id + '" ' +
								' class="interfaceViewportControl interfaceViewportControlSub" title="Including those marked to be removed.">' +
								this.count + ' emails<br />' +
								'</td>' +
						'</tr>';		
					}	
				});
				
				aHTML[++h] = '<tr>' +
						'<td>&nbsp;</td>' +
						'</tr>';		
				
				aHTML[++h] = '</tbody></table>';
				
				aHTML[++h] = '<table id="tableInterfaceMessagingEmailViewport" cellspacing=0 cellpadding=0>';
				aHTML[++h] = '<tr><td id="tdInterfaceMessagingEmailViewport"></td></tr>';
				aHTML[++h] = '</table>';
				
			}
			else
			{
				aHTML[++h] = '<table id="tableInterfaceMessagingEmailViewport">';
				aHTML[++h] = '<tr><td id="tdInterfaceMessagingEmailViewport">No accounts configured.</td></tr>';
				aHTML[++h] = '</table>';
			}
			
			$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
			$('td.interfaceViewportControl').click(function(event)
			{
				interfaceMasterMainViewportShow("#divInterfaceMainInbox");
				
				var sID = event.target.id
				var aID = sID.split('-');
				if (giMessagingAccountID != aID[1])
				{
					interfaceMessagingInboxSearch({xhtmlElementID: event.target.id, source: 1, newOnly: false, repaginate:true});
				}	
			});
			
			if (giMessagingAccountID != undefined && bAutoShow)
			{
				$('#interfaceMessaging-' + giMessagingAccountID).addClass('interfaceViewportControlHighlight');
				interfaceMasterMainViewportShow("#divInterfaceMainInbox");
				interfaceMessagingInboxSearch({xhtmlElementID: '-' + giMessagingAccountID, source: 1, newOnly: false, refreshInbox: true, repaginate: true})
			}	
		}
	}	
}

function interfaceMessagingInboxSearch(aParam, oResponse)
{
	var sXHTMLElementID;
	var bNew;
	var iStart;
	var bRefresh = false;
	var bRepaginate = true;
	
	if (aParam != undefined)
	{
		if (aParam.source != undefined) {iSource = aParam.source}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.newOnly != undefined) {bNew = aParam.newOnly}
		if (aParam.start != undefined) {iStart = aParam.start}
		if (aParam.refreshInbox != undefined) {bRefresh = aParam.refreshInbox}
		if (aParam.repaginate != undefined) {bRepaginate = aParam.repaginate}
	}
	else
	{
		aParam = {};
	}	
	
	if (iStart == undefined && bNew == undefined) {bNew = true}
	
	$('#tdInterfaceMessagingEmailViewport').html('');
	
	if (sXHTMLElementID != undefined)
	{
		var aXHTMLElementID = sXHTMLElementID.split('-');
		
		if (giMessagingAccountID != aXHTMLElementID[1]) 
		{
			bRefresh = true;
			aParam.refreshInbox = true;
		}
		giMessagingAccountID = aXHTMLElementID[1];
	}	
	
	if (bRefresh) {interfaceMessagingCheckForNew()}
	
	if (bRepaginate)
	{
		gsMessagingEmailLastPagination = undefined;
		giMessagingEmailLastPage = 1;
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
		aHTML[++h] = '<tbody>'
		aHTML[++h] = '<tr><td style="height:20px;" id="interfaceMessagingInboxHeader">' + gsLoadingXHTML + '</td></tr>';
		aHTML[++h] = '<tr><td id="interfaceMessagingInbox"></td></tr>';
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMainInbox').html(aHTML.join(''));
		
		if (giMessagingTimerID != 0) {clearInterval(giMessagingTimerID)};
        if (gbMessagingAutoCheck) {giMessagingTimerID = setInterval("interfaceMessagingCheckForNew()", giMessagingCheckForNew)};
	}	
		
	if (giMessagingAccountID != undefined && oResponse == undefined && bRefresh)
	{	
		var oSearch = new AdvancedSearch();
		oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
		oSearch.addField('messageid,to,cc,from,fromname,subject,date,' +
							'hasattachments,attachments,imapflags,detailscached');
		oSearch.addFilter('account', 'EQUAL_TO', giMessagingAccountID);
		oSearch.addSummaryField('count(*) cachecount');
		oSearch.sort('date', 'desc')
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceMessagingInboxSearch(aParam, data)});
	}
	else
	{
		giMessagingEmailCount = oResponse.summary.cachecount;
			
		if (bRepaginate) //bRefresh?
		{
			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="interfaceMainHeader">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainHeader">' +
					'<td class="interfaceMainHeader" id="interfaceMainHeaderRemovedEmails" style="text-align:left;">' +
					giMessagingEmailCount + ' emails';
					
			if (giMessagingEmailCount > 5000)
			{	
				aHTML[++h] = '&nbsp;<span style="font-size:0.75em;vertical-align:bottom;" class="interfaceMessagingHeader"> You should think about saving some emails.</span>';
			}	
			
			aHTML[++h] = '</td>';	
			
			aHTML[++h] = '<td class="interfaceMainHeader" id="interfaceMainHeaderRefresh">Refresh</td>';
			aHTML[++h] = '<td class="interfaceMainHeader" style="width:5px;">&nbsp;|&nbsp;</td>';
			
			aHTML[++h] = '<td class="interfaceMainHeader" id="interfaceMainHeaderRemovedEmails" style="width:90px;">';
							
			if (gbMessagingEmailShowDeleted)
			{	
				aHTML[++h] = '<span id="interfaceMainHeaderRemovedEmailsHide-' + giMessagingAccountID + '" class="interfaceMainHeaderRemovedEmailsHide" >Hide&nbsp;removed&nbsp;emails</span>';
			}
			else
			{
				aHTML[++h] = '<span id="interfaceMainHeaderRemovedEmailsShow-' + giMessagingAccountID + '" class="interfaceMainHeaderRemovedEmailsShow">Show&nbsp;removed&nbsp;emails</span>';
			}	
							
			aHTML[++h] = '</td>';
			
			aHTML[++h] = '<td class="interfaceMainHeader" style="width:5px;">&nbsp;|&nbsp;</td>';
			aHTML[++h] = '<td class="interfaceMainHeader" id="tdInterfaceMainHeaderSentEmails" style="width:70px;">';
			aHTML[++h] = '<span id="spanInterfaceMainHeaderSentEmails" class="interfaceMainHeaderSentEmails" >Sent&nbsp;emails</span>';
			
			aHTML[++h] = '</td>';
			aHTML[++h] = '</tr>';
			
			aHTML[++h] = '<tr class="interfaceMainHeader" id="trInterfaceMessagingInboxPages"><td colspan=2 id="tdInterfaceMessagingInboxPages"></td></tr>';
			aHTML[++h] = '</tbody></table>';
			
			$('#interfaceMessagingInboxHeader').html(aHTML.join(''));
			
			//$('#interfaceMessagingInbox').html('<div id="divInboxPage-0" class="interfaceMessagingInbox"></div>');
		}
	
		$('#interfaceMainHeaderRefresh').html('Refresh')
		
		$('.interfaceMainHeaderRemovedEmailsHide').click(function() {
			$('#interfaceMainHeaderRemovedEmailsHide').hide();
			$('#interfaceMainHeaderRemovedEmailsShow').show();
			gbMessagingEmailShowDeleted = false;
			interfaceMessagingInboxSearch({xhtmlElementID: this.id, source: 1, newOnly: false, refreshInbox: true, repaginate: true})
		})
		
		$('.interfaceMainHeaderRemovedEmailsShow').click(function() {
			$('#interfaceMainHeaderRemovedEmailsShow').hide();
			$('#interfaceMainHeaderRemovedEmailsHide').show();
			gbMessagingEmailShowDeleted = true;
			interfaceMessagingInboxSearch({xhtmlElementID: this.id, source: 1, newOnly: false, refreshInbox: true, repaginate: true})
		})
			
		$('#interfaceMainHeaderRefresh').click(function() {
			interfaceMessagingInboxSearch({xhtmlElementID: '-' + giMessagingAccountID, source: 1, newOnly: false, refreshInbox: true, repaginate: true})
		})
		
		$('#tdInterfaceMainHeaderSentEmails').click(function() {
			interfaceMasterOptionsPosition({xhtmlElementID: 'tdInterfaceMainHeaderSentEmails', leftOffset: -170, topOffset: -5});
			interfaceMessagingActions({xhtmlElementID: 'tdInterfaceMainHeaderSentEmails', type: 5})
		})
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableMessagingEmails" border="0" cellspacing="0" cellpadding="0" style="font-size:0.875em">';
		aHTML[++h] = '<tbody>'
		
		$.each(oResponse.data.rows, function()
		{
			aHTML[++h] = interfaceMessagingInboxSearchRow(this);
		});
		
		aHTML[++h] = '</tbody></table>';
		
		interfaceMasterPaginationList(
		{
			xhtmlElementID: 'interfaceMessagingInbox',
			xhtmlContext: 'EmailIMAPInbox',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: 50,
			functionShowRow: interfaceMessagingInboxSearchRow,
			functionNewPage: 'interfaceMessagingInboxSearchBind()',
			type: 'json'
		}); 	
			
		interfaceMessagingInboxSearchBind();
	}
}

function interfaceMessagingInboxSearchRow(oRow)
{
	var aHTML = [];
	var h = -1;

	var sID = oRow.id;
	//sID	= sID.replace(/\./g, '___');
	//For IMAP should always be a sequenced number.
	
	var sDate = new Date(oRow.date);	
	sDate = $.fullCalendar.formatDate(sDate, 'd MMM yyyy h:mm TT');
								
	var sClass = '';
	
	if ((oRow.imapflags).indexOf('\\SEEN') == -1)
	{
		sClass = " interfaceMainBold"
	}
	
	aHTML[++h] = '<tr class="interfaceMainRow' + sClass + '" data-cached="' + oRow.detailscached + '" id="trMessagingEmails_from_id_' + sID + '">';
	
	aHTML[++h] = '<td id="tdMessagingEmails_from_id_' + sID + 
						'" style="cursor: pointer;" class="interfaceMainRowOptionsSelect interfaceMainRow' + sClass + '"' +
						' title="' + oRow.fromEmail + '">' +
						oRow.fromname + '</td>';
						
	aHTML[++h] = '<td id="tdMessagingEmails_subject_id_' + sID + 
						'" style="cursor: pointer;" class="interfaceMainRowOptionsSelect interfaceMainRow' + sClass + '">' +
						oRow.subject + '</td>';
	
	aHTML[++h] = '<td style="width:220px;" id="tdMessagingEmails_date_id_' + sID + '" class="interfaceMainRow' + sClass + '">' +
							sDate + '</td>';
	
	aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
	aHTML[++h] = '<span id="spanMessagingEmails_reply_id_' + sID + '" class="interfaceMainRowOptionsReply"></span>';
	
	//if (this.removed == 'N')
	//{
	//	sRow += '<span id="spanMessagingEmails_delete_id_' + sID + '" class="interfaceMainRowOptionsDelete"></span>';
	//}
	//else
	//{
	//	sRow += '<span style="width: 23px;" id="tdMessagingEmails_delete_id_' + sID + '" class="interfaceMainRowOptionsDeleteDisabled">></span>';
	//}
	
	aHTML[++h] = '<span id="spanMessagingEmails_save_id_' + sID + '" class="interfaceMainRowOptionsSave"></span>';
	
	aHTML[++h] = '</td></tr>'
	
	return aHTML.join('');
}

function interfaceMessagingInboxSearchBind()
{
	$('.interfaceMainRowOptionsSelect').click(function() {
			$('td.interfaceViewportControl').removeClass('interfaceViewportControlHighlight');
			$('#' + this.id).parent().find('td').removeClass('interfaceMainBold');
			interfaceMessagingEmailRead(this.id);
			interfaceMessagingSearch(this.id);
		});
		
		$('.interfaceMainRowOptionsDelete').button({
			text: false,
			label: "Delete",
			icons: {
				 primary: "ui-icon-close"
			}
		})
		.click(function() {
			interfaceMessagingEmailRemove(this.id)
		})
		.css('width', '15px')
		.css('height', '20px')
	
		$('.interfaceMainRowOptionsDeleteDisabled').button({
			text: false,
			disabled: true,
			 icons: {
				 primary: "ui-icon-close"
			}
		})
		.css('width', '15px')
		.css('height', '20px')
		
		$('.interfaceMainRowOptionsReply').button({
			text: false,
			label: "Reply",
			icons: {
				 primary: "ui-icon-arrowreturnthick-1-w"
			}
		})
		.click(function() {
		
			$('td.interfaceViewportControl').removeClass('interfaceViewportControlHighlight');
			$('#' + this.id).parent().find('td').removeClass('interfaceMainBold');
			interfaceMessagingEmailRead(this.id);
			interfaceMessagingSearch(this.id, {reply: true});
		})
		.css('width', '15px')
		.css('height', '20px')
		
		$('.interfaceMainRowOptionsSave').button({
			text: false,
			label: "Save",
			icons: {
				 primary: "ui-icon-check"
			}
		})
		.click(function() {
		
			if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == this.id)
			{
				$('#divInterfaceMasterViewportControlOptions').slideUp(500);
				$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
			}
			else
			{
				interfaceMessagingEmailSave({xhtmlElementID: this.id})
			}	
		})
		.css('width', '15px')
		.css('height', '20px')
}	

function interfaceMessagingSearch(sXHTMLElementId, aParam)
{
	
	var aSearch = sXHTMLElementId.split('_id_');
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
		interfaceMasterMainViewportShow("#divInterfaceMainSummary", true);
		
		sSearchContext = sSearchContext.replace(/\___/g, '.');
		
		giObjectContext = sSearchContext;
		giMessagingActionID = -1;
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
		oSearch.addField('messageid,to,cc,from,fromname,subject,date,' +
							'body,hasattachments,attachments,imapflags,detailscached');
		oSearch.addFilter('account', 'EQUAL_TO', giMessagingAccountID);
		oSearch.addFilter('id', 'EQUAL_TO', giObjectContext);
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceMessagingShow(aParam, data)});	
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
			oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
			oSearch.addField('subject');
			oSearch.addFilter('account', 'EQUAL_TO', giMessagingAccountID);
			oSearch.addFilter('id', 'EQUAL_TO', giObjectContext);
			oSearch.rows = giMessagingRows;
			oSearch.getResults(function(data) {interfaceMessagingShow(aParam, data)});
		}
	};	
}

function interfaceMessagingSearchShow(aParam, oResponse)
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
			aHTML[++h] = '<tr class="interfaceSearch">';
			aHTML[++h] = '<td class="interfaceSearch" id="' +
							'-' + this.id + '">' +
							this.subject + '</td>';
			aHTML[++h] = '</tr>'
		});
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceMessagingSearch(event.target.id, {source: 1});
		});
	}	
}

function interfaceMessagingViewport(aParam)
{
	var aHTML = [];
	var h = -1;
	var bReply = false;
	
	if (aParam != undefined)
	{
		if (aParam.reply != undefined) {bReply = aParam.reply}
	}	
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (bReply) 
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl">Message</td>' +
					'</tr>';
	}
	else
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Message</td>' +
					'</tr>';
	}
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="interfaceMessagingAttachments" ' +
							' class="interfaceViewportControl interfaceViewportControlSub">' +
							'&nbsp;' +
							'</td>' +
					'</tr>';		
	
	if (bReply) 
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlReply" class="interfaceViewportControl interfaceViewportControlHighlight">Reply</td>' +
					'</tr>';
	}
	else
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlReply" class="interfaceViewportControl">Reply</td>' +
					'</tr>';
	}
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlReplyAll" class="interfaceViewportControl">Reply All</td>' +
					'</tr>';
		
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlForward" class="interfaceViewportControl">Forward</td>' +
					'</tr>';
					
	aHTML[++h] = '</table>';					
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '</table>';					
		
	$('#tdInterfaceMessagingEmailViewport').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceMessagingSummary();
	});
	
	$('#tdInterfaceViewportControlReply').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainEdit");
		interfaceMessagingSendEmail({xhtmlElementID: 'divInterfaceMainEdit'})
	});

	$('#tdInterfaceViewportControlReplyAll').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainEdit");
		interfaceMessagingSendEmail({xhtmlElementID: 'divInterfaceMainEdit', replyAll: true})
	});
	
	$('#tdInterfaceViewportControlForward').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainEdit");
		interfaceMessagingSendEmail({xhtmlElementID: 'divInterfaceMainEdit', forward: true})
	});
	
	$('#tdInterfaceViewportControlActions').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainActions", true);
		interfaceMasterActions({xhtmlElementID: 'divInterfaceMainActions'});
	});
	
	$('#interfaceMessagingAttachments').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAttachments", true);
		interfaceMessagingAttachments();
	});
	
}

function interfaceMessagingShow(aParam, oResponse)
{
	var bReply = false;
	var aHTML = [];
	var h = -1;
	var sHTML = '';
	
	if (aParam != undefined)
	{
		if (aParam.reply != undefined) {bReply = aParam.reply}
	}	
	
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	
	interfaceMessagingViewport(aParam);
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
	
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the email.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMainSummary').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
								
		$('#divInterfaceViewportControlContext').html('');
		
		if (goObjectContext.detailscached == 'Y')
		{
			if (goObjectContext.attachmentcount == 0)
			{
				sHTML = 'No attachments';
			}

			if (goObjectContext.attachmentcount == 1)
			{
				sHTML = '1 attachment';
			}

			if (goObjectContext.attachmentcount > 1)
			{
				sHTML = goObjectContext.attachmentcount + ' attachments';
			}
		
			sHTML += '<br /><br />';
		
			$('#interfaceMessagingAttachments').html(sHTML);
		
			var sAttachments = goObjectContext.attachments;
			var aAttachments = sAttachments.split('#');
			sAttachments = '';
		
			$.each(aAttachments, function() {
				aAttachment = this.split("|");
				sAttachments += '\r\n' + aAttachment[0];
			});
		
			$('#interfaceMessagingAttachments').attr('title', sAttachments)
		}
		else
		{
			$('#interfaceMessagingAttachments').html('');
			$('#interfaceMessagingAttachments').attr('title', '');
		}	
		
		//IF NOT CACHED THEN GET AND DO FOLLOWING ON PROMISE
		
		if (bReply)
		{
			interfaceMasterMainViewportShow("#divInterfaceMainEdit");
			interfaceMessagingSendEmail({xhtmlElementID: 'divInterfaceMainEdit'})
		}
		else
		{
			interfaceMessagingSummary();
		}	
	}	
}		
	
function interfaceMessagingSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this email.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMainSummary').html(aHTML.join(''));
	}
	else
	{
		aHTML[++h] = '<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="interfaceMainHeader">';
		aHTML[++h] = '<tbody>'
		
		aHTML[++h] = '<tr class="interfaceMainHeader">' +
						'<td style="text-align:left;font-weight:bold" class="interfaceMessagingHeader" id="interfaceMessagingHeader">' +
						goObjectContext.subject + '</td>';
		
		var sDate = new Date(goObjectContext.date);	
		sDate = $.fullCalendar.formatDate(sDate, 'd MMM yyyy h:mm TT');

		aHTML[++h] = '<td style="text-align:right;" class="interfaceMessagingSubHeader" id="interfaceMessagingHeaderDate">' +
						sDate + '</td>';
		aHTML[++h] = '</tr>';
		
		aHTML[++h] = '<tr class="interfaceMainHeader">' +
						'<td colspan=2 style="text-align:left;" class="interfaceMessagingSubHeader" id="interfaceMainHeaderFromEmail">' +
						goObjectContext.from + '</td>';
		
		aHTML[++h] = '</tr>';
		
		aHTML[++h] = '</tbody></table>';
		
		if (goObjectContext.to != '')
		{
			aHTML[++h] = '<table id="tableMessagingEmailsHeaderTo" border="0" cellspacing="0" cellpadding="0" class="interfaceMainHeader">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainHeaderTo">' +
							'<td style="text-align:left;" class="interfaceMainHeader" id="interfaceMainHeaderCC">';
							
			var sTo = goObjectContext.to;
			var aTo = sTo.split('#')
			sTo = '';
		
			$.each(aTo, function() {
				aTo = this.split("|");
				sTo += aTo[1] + '; ';
			});				
							
			aHTML[++h] = '<span class="interfaceMessagingHeader">To:</span> ' + sTo;

			aHTML[++h] = '</td></tr>';
			aHTML[++h] = '</tbody></table>';
		}
		
		if (goObjectContext.cc != '')
		{
			aHTML[++h] = '<table id="tableMessagingEmailsHeaderCC" border="0" cellspacing="0" cellpadding="0" class="interfaceMainHeader">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainHeaderCC">' +
							'<td style="text-align:left;" class="interfaceMainHeader" id="interfaceMainHeaderCC">';
							
			var sCC = goObjectContext.cc
			var aCC = sCC.split('#')
			sCC = '';
		
			$.each(aCC, function() {
				aCC = this.split("|");
				sCC += aCC[1] + '; ';
			});				
							
			aHTML[++h] = '<span class="interfaceMessagingHeader">Cc:</span> ' + sCC;

			aHTML[++h] = '</td></tr>';
			aHTML[++h] = '</tbody></table>';
		}
		
		if (goObjectContext.hasattachments == 'Y')
		{
			aHTML[++h] = '<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="interfaceMainHeader">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainHeader">' +
									'<td style="text-align:left;" class="interfaceMainHeader" id="interfaceMainHeaderAttachments">';
			aHTML[++h] = '</td></tr>';
			aHTML[++h] = '</tbody></table>';
		}
		
		aHTML[++h] = gsLoadingXHTML;
		
		aHTML[++h] = '<iframe style="display:block;height:10px;width:900px;" name="ifMessage" ' +
							'id="ifMessage" frameborder="0" border="0" scrolling="no"></iframe>';
						
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		if (goObjectContext.detailscached == 'Y')
		{
			setTimeout("interfaceMessagingShowMessage()", 300);
			interfaceMessagingShowAttachments();
		}
		else
		{
			var sParam = '/ondemand/messaging/?method=MESSAGING_EMAIL_CACHE_GET_DETAILS';
			var sData = 'id=' + giObjectContext;
		
			$.ajax(
			{
				type: 'POST',
				url: sParam,
				data: sData,
				dataType: 'json',
				success: function(data) 
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
					oSearch.addField('messageid,to,cc,from,fromname,subject,date,' +
										'body,hasattachments,attachments,imapflags,detailscached');
					oSearch.addFilter('account', 'EQUAL_TO', giMessagingAccountID);
					oSearch.addFilter('id', 'EQUAL_TO', giObjectContext);
					oSearch.getResults(function(oResponse) 
						{
							goObjectContext = oResponse.data.rows[0];
							interfaceMessagingShowAttachments();
							interfaceMessagingShowMessage();
						})	
				}
			});
			
		}	
	}	
}

function interfaceMessagingShowAttachments()
{
	if (goObjectContext.hasattachments == 'Y')
	{
		var aHTML = [];
		var h = -1;
		var sAttachments = goObjectContext.attachments;
		
		if (sAttachments != 'undefined')
		{	
			if (sAttachments.indexOf("/download/") == -1)
			{
				aHTML[++h] = '<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="interfaceMainHeader">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainHeader">' +
								'<td style="text-align:left;" class="interfaceMainHeader" id="interfaceMainHeaderAttachments">';
								
				var aAttachments = sAttachments.split('#')
				sAttachments = '';
			
				$.each(aAttachments, function(iIndex) 
				{
					var aAttachment = this.split('|');
					
					var sLink = '/ondemand/messaging/?';
					sLink += 'method=MESSAGING_EMAIL_ATTACHMENT_DOWNLOAD&attachmentindex=' + (iIndex);
					sLink += '&account=' + giMessagingAccountID;
					sLink += '&messageid=' + interfaceMasterFormatSave(giObjectContext);
					
					sAttachments +=	'<a href="' + sLink + '" target="_blank">' + aAttachment[0] + '</a>; ';
				});	
								
				aHTML[++h] = '<span class="interfaceMessagingHeader">Attachments:</span> ' + sAttachments;

				aHTML[++h] = '</td></tr>';
				aHTML[++h] = '</tbody></table>';
			}
			else
			{
				aHTML[++h] = '<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="interfaceMainHeader">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainHeader">' +
								'<td style="text-align:left;" class="interfaceMainHeader" id="interfaceMainHeaderAttachments">';
								
				var sAttachments = goObjectContext.attachments;
				var aAttachments = sAttachments.split('#')
				sAttachments = '';
			
				$.each(aAttachments, function(iIndex) 
				{
					var aAttachment = this.split('|');
					sAttachments +=	'<a href="' + aAttachment[1] + '" target="_blank">' + aAttachment[0] + '</a>; ';
				});	
								
				aHTML[++h] = '<span class="interfaceMessagingHeader">Attachments:</span> ' + sAttachments;

				aHTML[++h] = '</td></tr>';
				aHTML[++h] = '</tbody></table>';
			}
		}
	
		$('#interfaceMainHeaderAttachments').html(aHTML.join());
	}
}

function interfaceMessagingShowMessage()
{
	var sHTML = goObjectContext.body;
	sHTML = interfaceMasterFormatXHTML(sHTML);

	while ($('#ifMessage').length == 0)
	  {
	  }

	$('.interfaceLoading').remove()
		
	$('#ifMessage').contents().find('html').html(sHTML);
	
	if ($.browser.msie)
	{
	}
	else
	{	
		var newHeight = $('#ifMessage',top.document).contents().find('html').height() + 100;
	}

	if ($.browser.msie)
	{
		setTimeout("setHeight()", 100);
	}
	else
	{	
		$('#ifMessage').height($('#ifMessage',top.document).contents().find('html').height())
		$('#ifMessage').width($('#ifMessage',top.document).contents().find('html').width())
	}
	
}

function setHeight()
{
	$('#ifMessage').css('height', ($('#ifMessage').attr('scrollHeight') + 100) + 'px');
	$('#ifMessage').css('width', ($('#ifMessage').attr('scrollWidth') + 100) + 'px');
}

function interfaceMessagingEdit()
{
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainEdit').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainEdit').attr('onDemandLoading', '');
				
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainDetailsEditTextValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsEditTextValue" class="interfaceMainTextMulti">' +
						'<textarea rows="30" cols="50" onDemandType="TEXTMULTI" id="inputInterfaceMainEditText" class="inputInterfaceMainTextMultiLarge"></textarea>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainEdit').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			//tinyMCE.get('editor1').getContent()
			$('#inputInterfaceMainEditText').val(unescape(goObjectContext.body));
		}
	
		if (gbRichEdit)
		{
			tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainEditText');
		}	
	}	
}

function interfaceMessagingSave(aParam, oResponse)
{
	if (oResponse == undefined)
	{			
		var sParam = '/ondemand/messaging/?method=MESSAGING_EMAIL_DRAFT&rf=TEXT';
		
		if ($('#divInterfaceMainEdit').html() != '')
		{
			var sData = 'subject=' + interfaceMasterFormatSave($('#inputInterfaceMainActionsSendEmailSubject').val());
			sData += '&message=' + interfaceMasterFormatSave(tinyMCE.get('inputInterfaceMainActionsSendEmailMessage').getContent());
		}
		
		$.ajax(
		{
			type: 'POST',
			url: sParam,
			data: sData,
			dataType: 'text',
			success: function(data) 
			{
				interfaceMessagingSave(aParam, data)
			}
		});
		
	}
	else
	{	
		/* if (oResponse.status == 'OK')
		{
			interfaceMasterStatus('Draft saved');
			//if (giObjectContext == -1) {var bNew = true}
			//giObjectContext = oResponse.id;	
			//if (bNew) {interfaceMessagingSearch('-' + giObjectContext)}
		}
		else
		{
			interfaceMasterStatus(oResponse.error.errornotes);
			interfaceMasterConfirm( {html: [oResponse.error.errornotes]
									   , title: 'Save error!'});
		} */
	}
}

function interfaceMessagingAttachments()
{
	var aHTML = [];
	var h = -1;

	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this email.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMainAttachments').html(aHTML.join(''));
	}
	else
	{
		var iAttachmentCount = goObjectContext.attachmentcount;
		
		if (iAttachmentCount == 0)
		{
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceAttachments">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">No attachments.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</tbody></table>';
			
			$('#divInterfaceMainAttachments').html(aHTML.join(''));
		}
		else
		{
			var sAttachments = goObjectContext.attachments;
			var aAttachments = sAttachments.split('#')

			aHTML[++h] = '<table class="interfaceMain"">';
			aHTML[++h] = '<tbody>'
		
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Filename</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Size (kb)</td>';
			aHTML[++h] = '</tr>';
		
			$.each(aAttachments, function(iIndex) 
			{
				if (this != '')
				{
				
					var sLink = '/ondemand/messaging/?';
					sLink += 'method=MESSAGING_EMAIL_ATTACHMENT_DOWNLOAD&attachment=' + (iIndex);
					sLink += '&account=' + giMessagingAccountID;
					sLink += '&id=' + interfaceMasterFormatSave(giObjectContext);
					
					var aAttachment = this.split('|');
					sAttachments += '\r\n' + aAttachment[0];
				
					aHTML[++h] = '<tr class="interfaceAttachments">';
					aHTML[++h] = '<td id="tdAttachment_filename-' + (iIndex) + '" class="interfaceMainRow">' +
										'<a href="' + sLink + '" target="_blank">' + aAttachment[0] + '</a></td>';
					aHTML[++h] = '<td id="tdAttachment_size-' + (iIndex) + '" class="interfaceMainRow">' + (aAttachment[1] / 1000).toFixed(2) + '</td>';
									
					aHTML[++h] = '</tr>'
				}	
			});	
		   	
			aHTML[++h] = '</tbody></table>';
			$('#divInterfaceMainAttachments').html(aHTML.join(''));
		}
	}	
}

function interfaceMessagingSendEmail(aParam)
{

	var iObject = giObject;
	var iObjectContext = giObjectContext;
	var bShowTo = true;
	var bShowPriority = false;
	var bShowAll = false;
	var sXHTMLElementID = 'divInterfaceDialog';
	var bDialog = false;
	var iContactBusiness;
	var bReplyAll = false;
	var bForward = false;
	var bNewEmail = false;
	var sMessage = '';
	var sSubject = '';
	var iSource = 1;
	
	if (aParam != undefined)
	{
		if (aParam.object != undefined) {iObject = aParam.object}
		if (aParam.objectContext != undefined) {iObject = aParam.objectContext}
		if (aParam.showTo != undefined) {bShowTo = aParam.showTo}
		if (aParam.showPriority != undefined) {bShowPriority = aParam.showPriority}
		if (aParam.showAll != undefined) {bShowAll = aParam.showAll}
		if (aParam.dialog != undefined) {bDialog = aParam.dialog}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.contactBusiness != undefined) {iContactBusiness = aParam.contactBusiness}
		if (aParam.replyAll != undefined) {bReplyAll = aParam.replyAll}
		if (aParam.forward != undefined) {bForward = aParam.forward}
		if (aParam.newEmail != undefined) {bNewEmail = aParam.newEmail}
		if (aParam.message != undefined) {sMessage = aParam.message}
		if (aParam.subject != undefined) {sSubject = aParam.subject}
		if (aParam.source != undefined) {iSource = aParam.source}
	}

	if (bNewEmail)
	{
		giObjectContext = '';
		goObjectContext = undefined;
		
		var sParam = '/ondemand/messaging/?method=MESSAGING_EMAIL_DRAFT&new=1';
		
		$.ajax(
		{
			type: 'POST',
			url: sParam,
			dataType: 'text',
			async: false
		});
	}
	
	if (!bDialog)
	{
		
		var aHTML = [];
		var h = -1;	
					
		aHTML[++h] = '<table id="tableInterfaceMainSendEmail">' +
					'<tr id="trInterfaceMainSendEmailRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSendEmailColumn1" class="interfaceMainColumn1List">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainSendEmailColumn2" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';					
			
		$('#' + sXHTMLElementID).html(aHTML.join(''));
	}
	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMainActionsSendEmail">';
	
	if (bShowTo)
	{

		aHTML[++h] = '<tr><td id="tdInterfaceMainActionsSendEmail" class="interfaceMain">';
		
			aHTML[++h] = '<table id="tableInterfaceMainActionsSendEmailColumn" cellspacing=0 cellpadding=0>';
	
			aHTML[++h] = '<tr><td style="width:325px;font-size:0.875em;" id="tdInterfaceMainActionsSendEmailColumn1">';	
				
				aHTML[++h] = '<table id="tableInterfaceMainActionsSendEmailTo">';				
							
				aHTML[++h] = '<tr><td id="tdInterfaceMainActionsSendEmailTo" class="interfaceMain">' +
							'To:</td>';		
				
				aHTML[++h] = '<td id="tdInterfaceMainActionsSendEmailToContact">' +
							'<input id="inputInterfaceMainActionsSendEmailToContact" class="inputInterfaceMainSelectContactEmail interfaceMasterWatermark"' +
								' ondemandsetelementid="inputInterfaceMainActionsSendEmailTo" value="Search for contact here or type address below"';
							
				if (iContactBusiness != undefined)
				{
					aHTML[++h] = ' onDemandContactBusiness="' + iContactBusiness + '"'
				}

				aHTML[++h] = '></td></tr>';				

				aHTML[++h] = '<tr><td colspan=2 id="tdInterfaceMainActionsSendEmailToValue" >' +
							'<textarea style="height:30px" rows="3" cols="25" id="inputInterfaceMainActionsSendEmailTo" class="inputInterfaceMainText"></textarea>' +
							'</td></tr>';
			
				aHTML[++h] = '<tr><td id="tdInterfaceMainActionsSendEmailCc" class="interfaceMain">' +
							'Cc:</td>';		
				
				aHTML[++h] = '<td id="tdInterfaceMainActionsSendEmailCcContact">' +
							'<input id="inputInterfaceMainActionsSendEmailCcContact" class="inputInterfaceMainSelectContactEmail interfaceMasterWatermark"' +
								' ondemandsetelementid="inputInterfaceMainActionsSendEmailCc" value=""';
							
				if (iContactBusiness != undefined)
				{
					aHTML[++h] = ' onDemandContactBusiness="' + iContactBusiness + '"'
				}

				aHTML[++h] = '></td></tr>';				

				aHTML[++h] = '<tr><td colspan=2 id="tdInterfaceMainActionsSendEmailCcValue">' +
							'<textarea style="height:30px" rows="3" cols="25" onDemandType="TEXTMULTI" id="inputInterfaceMainActionsSendEmailCc" class="inputInterfaceMainText"></textarea>' +
							'</td></tr>';
			
				aHTML[++h] = '<tr><td id="tdInterfaceMainActionsSendEmailBcc" class="interfaceMain">' +
							'Bcc:</td>';		
				
				aHTML[++h] = '<td id="tdInterfaceMainActionsSendEmailBccContact">' +
							'<input onDemandType="TEXT" id="inputInterfaceMainActionsSendEmailBccContact" class="inputInterfaceMainSelectContactEmail interfaceMasterWatermark"' +
								' ondemandsetelementid="inputInterfaceMainActionsSendEmailBcc" value=""';
							
				if (iContactBusiness != undefined)
				{
					aHTML[++h] = ' onDemandContactBusiness="' + iContactBusiness + '"'
				}

				aHTML[++h] = '></td></tr>';				

				aHTML[++h] = '<tr><td colspan=2 id="tdInterfaceMainActionsSendEmailBccValue">' +
							'<textarea style="height:30px" rows="3" cols="25" onDemandType="TEXTMULTI" id="inputInterfaceMainActionsSendEmailBcc" class="inputInterfaceMainText"></textarea>' +
							'</td></tr>';
			
				aHTML[++h] = '</table>';				
				
			aHTML[++h] = '<td width="20px;">&nbsp;</td>';	

			aHTML[++h] = '<td id="tdInterfaceMainActionsSendEmailColumn2">';	

			aHTML[++h] = '<table id="tableInterfaceMainActionsSendEmailAttach">';				
							
				aHTML[++h] = '<tr><td id="tdInterfaceMainActionsSendEmailAttachCaption" class="interfaceMain">' +
							'Attachments</td>';		
			
				aHTML[++h] = '<td id="tdInterfaceMainActionsSendEmailMessageAttach" class="interfaceMainRight">';
			
				aHTML[++h] = '<div id="divInterfaceMainActionsSendEmailMessageAttach">' +
							'<input type="checkbox" id="spanInterfaceMainSendEmailAttach" class="interfaceMasterViewport"/>' +
							'<label style="font-size:0.875em;" for="spanInterfaceMainSendEmailAttach">&nbsp;</label>' +
							'</div>';
			
				aHTML[++h] = '</td></tr>';				

				aHTML[++h] = '<tr><td style="height:80px" colspan=2 id="tdInterfaceMainActionsSendEmailAttachments" class="interfaceMasterBorder">' +
							'</td></tr>';
			
				aHTML[++h] = '</table>';				
			
			aHTML[++h] = '</td></tr>';						
				
			aHTML[++h] = '</table>';					
				
		aHTML[++h] = '</td></tr>';				
	}
	
	aHTML[++h] = '<tr><td id="tdInterfaceMainActionsSendEmailSubjectValue">';
	
		aHTML[++h] = '<table id="tableInterfaceMainActionsSendEmailSubjectOptions">';				
							
			aHTML[++h] = '<tr><td id="tdInterfaceMainActionsSendEmailSubject" class="interfaceMain">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainActionsSendEmailSubject" class="inputInterfaceMainText interfaceMasterWatermark"' +
							' value="Subject">' +
						'</td>';	
			
			if (bShowPriority)
			{
				aHTML[++h] = '<td style="width:150px" id="tdInterfaceMainSendEmailHighPriority" class="interfaceMainRight">' +
								'&nbsp; <input type="checkbox" id="inputInterfaceMainSendEmailHighPriority"/>&nbsp;High Priority?<td>';
			}
		
			aHTML[++h] = '</tr>';				
				
		aHTML[++h] = '</table>';				
	
	aHTML[++h] = '</td></tr>';
	
	aHTML[++h] = '<tr><td id="tdInterfaceMainActionsSendEmailMessageValue" class="interfaceMain">' +
						'<textarea rows="10" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMainActionsSendEmailMessage" class="inputInterfaceMainTextMultiLarge"></textarea>' +
						'</td></tr>';
	
	aHTML[++h] = '</table>';						
	
	if (bDialog)
	{
	
		$('#' + sXHTMLElement).html(aHTML.join(''));
		$('#' + sXHTMLElement).dialog(
		{
			width: 400,
			resizable: false,
			modal: true,
			title: 'Send Email Message',
			buttons: 
			{
				"Cancel": function() 
				{
					$( this ).dialog( "close" );
				},
				"Send": function() 
				{
					interfaceMessagingSendEmailSend({
						subject: $('#inputInterfaceMainActionsSendEmailSubject').val(),
						message: $('#inputInterfaceMainActionsSendEmailMessage').val(),
						priority: ($('#inputInterfaceMainSendEmailHighPriority').attr('checked')?3:2),
						});
					$( this ).dialog( "close" );
					
				}
			}
		});
	}	
	else
	{
	
		if (tinyMCE.getInstanceById('inputInterfaceMainActionsSendEmailMessage'))
		{
			tinyMCE.get('inputInterfaceMainActionsSendEmailMessage').remove();
			$('#inputInterfaceMainActionsSendEmailMessage').remove();
		}	
	
		$('#tdInterfaceMainSendEmailColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainSendEmailColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSendEmailAdd" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainSendEmailAdd">Send</span>' +
						'</td></tr>';
								
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSendEmailColumn2').html(aHTML.join(''));
	
		$('#spanInterfaceMainSendEmailAdd').button(
		{
			label: "Send"
		})
		.click(function() {
		
			if (aParam != undefined)
			{
				aParam.subject = $('#inputInterfaceMainActionsSendEmailSubject').val();
				aParam.message = tinyMCE.get('inputInterfaceMainActionsSendEmailMessage').getContent();
				aParam.contactPersonTo = $('#inputInterfaceMainActionsSendEmailTo').attr('onDemandID');
				aParam.to = $('#inputInterfaceMainActionsSendEmailTo').val();
				aParam.cc = $('#inputInterfaceMainActionsSendEmailCc').val();
				aParam.bcc = $('#inputInterfaceMainActionsSendEmailBcc').val();
			}
			else
			{
				aParam = {
						subject: $('#inputInterfaceMainActionsSendEmailSubject').val(),
						message: tinyMCE.get('inputInterfaceMainActionsSendEmailMessage').getContent(),
						contactPersonTo: $('#inputInterfaceMainActionsSendEmailTo').attr('onDemandID'),
						to: $('#inputInterfaceMainActionsSendEmailTo').val(),
						cc: $('#inputInterfaceMainActionsSendEmailCc').val(),
						bcc: $('#inputInterfaceMainActionsSendEmailBcc').val(),
						xhtmlElementID: sXHTMLElementID
						}
			}
		
			 interfaceMessagingSendEmailSend(aParam);
		})
	
		$('#spanInterfaceMainSendEmailAttach').button(
		{
			text: false,
			icons:	{
						primary: "ui-icon-plus"
					}
		})
		.click(function() {
		
			interfaceMessagingSendEmailAttachShow(aParam);
		})
		.css('width', '20px')
		.css('height', '23px')
		.css('font-size', '0.75em')	
		
		if (goObjectContext != undefined && iSource == 1)
		{
			var sTo = '';
		
			var aHTML = [];
			var h = -1;	
		
			aHTML[++h] = '<br />';
			
			$.each(giMessagingAccounts, function() 
			{ 
				if (this.id == giMessagingAccountID)
				{
					aHTML[++h] = this.footer + '<br />';
				}
			});
				
			if (goObjectContext != undefined)
			{
				if (bForward)
				{
					$('#inputInterfaceMainActionsSendEmailSubject').val('Fw: ' + goObjectContext.subject)
				}
				else
				{
					$('#inputInterfaceMainActionsSendEmailSubject').val('Re: ' + goObjectContext.subject)
				}	
				
				$('#inputInterfaceMainActionsSendEmailSubject').removeClass('interfaceMasterWatermark');
				
				
				aHTML[++h] = '<br />---- Original Message ----<br />';
				aHTML[++h] = '<table style="background-color:#f5f5f5;width:100%;color:black;">';
				aHTML[++h] = '<tr><td><strong>From:</strong> ' + goObjectContext.from + '</td></tr>';
				
				aHTML[++h] = '<tr><td><strong>To:</strong> ';	
				
				var sOrgTo = goObjectContext.to;
				var aOrgTo = sOrgTo.split('#')
				
				sOrgTo = '';
		
				$.each(aOrgTo, function() {
					aOrgTo = this.split("|");
					sOrgTo += aOrgTo[1] + '; ';
				});				
				
				aHTML[++h] = sOrgTo + '</td></tr>';
				
				var sOrgCc = goObjectContext.cc;
				
				if (sOrgCc != '')
				{
					aHTML[++h] = '<tr><td><strong>CC:</strong> ';	
					var aOrgCc = sOrgCc.split('#')
					sOrgCc = '';
			
					$.each(aOrgCc, function() {
						aOrgCc = this.split("|");
						sOrgCc += aOrgCc[1] + '; ';
					});			
					
					aHTML[++h] = sOrgCc + '</td></tr>';
				}
				
				var sDate = new Date(goObjectContext.date);	
				sDate = $.fullCalendar.formatDate(sDate, 'd MMM yyyy h:mm TT');
		
				aHTML[++h] = '<tr><td><strong>Sent:</strong> ' + sDate + '</td></tr>';	
				aHTML[++h] = '<tr><td><strong>Subject:</strong> ' + goObjectContext.subject + '</td></tr>';	
				
				aHTML[++h] = '</table>';
				
				$('#inputInterfaceMainActionsSendEmailMessage').val(aHTML.join('') + goObjectContext.body)
		
				if (!bForward)
				{
					if (goObjectContext.from != '')
					{
						var sFrom = goObjectContext.from;
					}
		
					if (goObjectContext.to != '' && bReplyAll)
					{			
						sTo = goObjectContext.to;
						var aTo = sTo.split('#');
						sTo = '';
					
						$.each(aTo, function() {
						
							aTo = this.split("|");
							
							if (aTo[1] != gsUserEmail && aTo[1] != sFrom)
							{	
								sTo += aTo[1] + '; ';
							}	
						});
						
					}
		
					sTo = sFrom + '; ' + sTo;
				}	
	
				$('#inputInterfaceMainActionsSendEmailTo').val(sTo)
	
				if (goObjectContext.attachments != '' && bForward && giMessagingActionID == -1)
				{
					if (goObjectContext.sourcetypetext == "EMAIL")
					{
						var sParam = '/ondemand/messaging/?method=MESSAGING_EMAIL_ATTACHMENT_MANAGE&rf=TEXT';
						var sData = 'account=' + giMessagingAccountID;
						sData += '&id=' + interfaceMasterFormatSave(giObjectContext);
						
						$.ajax(
						{
							type: 'POST',
							url: sParam,
							data: sData,
							dataType: 'text',
							success: function(data) 
							{
								var aReturn = data.split('|');
								giMessagingActionID = aReturn[1];
								interfaceMessagingSendEmailAttachments();
							}
						});
					}
					
					if (goObjectContext.sourcetypetext == "ACTION")
					{
						var sParam = '/ondemand/messaging/?method=MESSAGING_EMAIL_DRAFT_MANAGE&new=1&rf=TEXT';
						var sData = 'copyaction=' + goObjectContext.id;
						
						$.ajax(
						{
							type: 'POST',
							url: sParam,
							data: sData,
							dataType: 'text',
							success: function(data) 
							{
								var aReturn = data.split('|');
								giMessagingActionID = aReturn[1];
								interfaceMessagingSendEmailAttachments();
							}
						});
					}
					
				}	
				else
				{
					interfaceMessagingSendEmailAttachments();
				}		
			}	
		}
		
		if (iSource == 2)
		{
			var sFooter = '<br />';
			
			$.each(giMessagingAccounts, function() 
			{ 
				if (this.id == giMessagingAccountID)
				{
					sFooter = this.footer + '<br />';
				}
			});
			
			$('#inputInterfaceMainActionsSendEmailMessage').val(sFooter + sMessage)
		}
		
		if (iSource == 3)
		{
			$('#inputInterfaceMainActionsSendEmailSubject').val(sSubject)
			$('#inputInterfaceMainActionsSendEmailSubject').removeClass('interfaceMasterWatermark');
			$('#inputInterfaceMainActionsSendEmailMessage').val(sMessage)
		}
		
		if (gbRichEdit)
		{
			tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainActionsSendEmailMessage');
		}	
	}
}

function interfaceMessagingSendEmailAttachShow(aParam, sReturn)
{
	
	sXHTMLElementID = "tdInterfaceMainActionsSendEmailAttachCaption";
	
	if (!$('#spanInterfaceMainSendEmailAttach').attr('checked'))
	{
		$('#divInterfaceMasterViewportControlOptions').hide()
	}
	else
	{	
		if (sReturn == undefined)
		{
			var sParam = '/ondemand/messaging/?method=MESSAGING_EMAIL_DRAFT&rf=TEXT';
		
			$.ajax(
			{
				type: 'POST',
				url: sParam,
				dataType: 'text',
				success: function(data) 
				{
					interfaceMessagingSendEmailAttachShow(aParam, data)
				}
			});
		
		}
		else
		{
			var aReturn = sReturn.split('|');
			
			var aHTML = [];
			var h = -1;
		
			interfaceMasterOptionsSetPosition(sXHTMLElementID)
		
			giMessagingActionID = aReturn[1];
		
			aHTML[++h] = '<table class="interfaceDropDown" style="width:287px;">';
			aHTML[++h] = '<tbody>';
			aHTML[++h] = '<tr><td id="tdInterfaceMainActionsSendEmailAttachmentsUpload" class="interfaceMain">' +
								interfaceMasterAttachmentsUpload({object: 17, objectContext: aReturn[1], label: ''})	
							'</td></tr>';
			aHTML[++h] = '</tbody></table>';			

			$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));	
			
			$('#spanInterfaceMainUpload').button(
			{
				label: "Upload"
			})
			.click(function() {
				 interfaceMasterAttachmentsUploadProcess({functionPostUpdate: interfaceMessagingSendEmailAttachments});
			})
			
		}					
	}	
}	

function interfaceMessagingSendEmailAttachments(aParam, oResponse)
{	
	var aHTML = [];
	var h = -1;
	var sXHTMLElementID = "tdInterfaceMainActionsSendEmailAttachments";
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.action != undefined) {giMessagingActionID = aParam.action}
	}
	
	$('#divInterfaceMasterViewportControlOptions').hide();
	
	$('#spanInterfaceMainSendEmailAttach').attr('checked', false)
	$('#spanInterfaceMainSendEmailAttach').button("refresh");
	
	if (giMessagingActionID != -1)
	{
		if (oResponse == undefined)
		{
			var sParam = 'method=CORE_ATTACHMENT_SEARCH' +
							'&object=17' + 
							'&objectcontext=' + giMessagingActionID;
			
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/core/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceMessagingSendEmailAttachments(aParam, data)}
			});
		}
		else
		{
			
			if (oResponse.data.rows.length == 0)
			{
				$('#' + sXHTMLElementID).html('');
			}
			else
			{
				aHTML[++h] = '<table style="width:100%">';
				aHTML[++h] = '<tbody>'
				
				$.each(oResponse.data.rows, function()
				{
					aHTML[++h] = '<tr class="interfaceAttachments">';
					aHTML[++h] = '<td style="font-size:0.75em;color:black;font-weight:normal;width:100%" id="tdAttachment-filename-' + this.id + '" class="interfaceMainRow">' + this.filename + '</td>';
					aHTML[++h] = '<td style="width:20px;" id="tdAttachment_delete-' + this.attachment + '" class="interfaceMainRowOptionDelete">&nbsp;</td>';
					aHTML[++h] = '</tr>'
				});
				
				aHTML[++h] = '</tbody></table>';

				$('#' + sXHTMLElementID).html(aHTML.join(''));
				
				$('.interfaceMainRowOptionDelete').button({
					text: false,
					 icons: {
						 primary: "ui-icon-close"
					}
				})
				.click(function() {
					interfaceMessagingSendEmailAttachmentsRemove(this.id)
				})
				.css('width', '15px')
				.css('height', '20px')
				
			}
		}
	}	
}

function interfaceMessagingSendEmailAttachmentsRemove(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	
	var sParam = 'method=CORE_ATTACHMENT_MANAGE&remove=1';
	var sData = 'id=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/core/?' + sParam,
			data: sData,
			dataType: 'text',
			success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
		});
		
}

function interfaceMessagingSendEmailSend(aParam)
{
	var sParam = '/ondemand/messaging/?method=MESSAGING_EMAIL_SEND';
	var sData = '';
	var fFunctionPostSend;
	var sXHTMLElementID = 'divInterfaceMainEdit';
	
	if (aParam.object == undefined) {aParam.object = giObject}
	if (aParam.objectContext == undefined) {aParam.objectContext = giObjectContext}
	
	if (aParam != undefined)
	{
		if (aParam.functionPostSend != undefined) {fFunctionPostSend = aParam.functionPostSend}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}	
	
	//sData += 'object=' + aParam.object;
	//sData += '&objectcontext=' + aParam.objectContext;
	sData += 'subject=' + encodeURIComponent((aParam.subject==undefined?'':aParam.subject));
	sData += '&message=' + encodeURIComponent((aParam.message==undefined?'':aParam.message));
	//sData += '&priority=' + inferfaceMasterFormatSave((aParam.priority==undefined?'':aParam.priority));
	sData += '&id=' + encodeURIComponent((aParam.contactPersonTo==undefined?'':aParam.contactPersonTo));
	sData += '&to=' + encodeURIComponent((aParam.to==undefined?'':aParam.to));
	sData += '&cc=' + encodeURIComponent((aParam.cc==undefined?'':aParam.cc));
	sData += '&bcc=' + encodeURIComponent((aParam.bcc==undefined?'':aParam.bcc));
	
	sData += (aParam.otherData==undefined?'':aParam.otherData)
		  
	$.ajax(
	{
		type: 'POST',
		url: sParam,
		data: sData,
		dataType: 'text',
		success: function(data) 
		{
			interfaceMasterStatus('Email sent');
			$('#' + sXHTMLElementID).html('<span><br />Email has been sent.</span>');
			$('#tdInterfaceMessagingEmailViewport').html('');
			if (fFunctionPostSend != undefined) {fFunctionPostSend()};
		}
	});
}


function interfaceMessagingEmailRemove(sXHTMLElementId)
{
	var aSearch = sXHTMLElementId.split('_id_');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
		
	sSearchContext = sSearchContext.replace(/\___/g, '.');	
		
	var sParam = 'method=MESSAGING_CACHE_EMAIL_MANAGE&remove=1';
	var sData = 'account=' + giMessagingAccountID;
	sData += '&messageid=' + interfaceMasterFormatSave(sSearchContext);
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/messaging/?' + sParam,
			data: sData,
			dataType: 'text',
			success: function(data)
						{
							if (gbMessagingEmailShowDeleted)
							{
									$('#' + sXHTMLElementId).button({disabled: true});
							}
							else
							{
								$('#' + sXHTMLElementId).parent().parent().fadeOut(500);
							}	
						}
		});
}

function interfaceMessagingEmailRead(sXHTMLElementId)
{
	var aSearch = sXHTMLElementId.split('_id_');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
		
	if ($('#' + sXHTMLElementId).parent().hasClass('interfaceMainBold'))	
	{
			
		sSearchContext = sSearchContext.replace(/\___/g, '.');	
		
		var sParam = 'method=MESSAGING_EMAIL_CACHE_MANAGE&flags=(\\SEEN)';
		var sData = 'account=' + giMessagingAccountID;
		sData += '&id=' + interfaceMasterFormatSave(sSearchContext);
				
		$.ajax(
			{
				type: 'POST',
				url: '/ondemand/messaging/?' + sParam,
				data: sData,
				dataType: 'text',
				success: function(data)
							{
								gaMessagingEmailRead.push(sSearchContext);
							}
			});
	}		
}

function interfaceMessagingNew(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	var sXHTMLElementID = 'divInterfaceMain';

	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}	
	
	$('#' + sXHTMLElementID).html(gsLoadingXHTML);
	$('#tdInterfaceMessagingEmailViewport').html('');
	
	if (oResponse == undefined)
	{
		var sParam = 'method=MESSAGING_EMAIL_DRAFT_SEARCH';

		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/messaging/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceMessagingNew(aParam, data)}
		});
	}	
	else	
	{		
		if (oResponse.data.rows.length == 0)
		{
			interfaceMessagingSendEmail(aParam);
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceMainNew" class="interfaceMain">';
			aHTML[++h] = '<tr id="trInterfaceMainNewRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainNewColumn1Large" class="interfaceMainColumn1Large">' +
						gsLoadingXHTML + '</td>' +
						'<td id="tdInterfaceMainNewColumn2Action" style="width:150px;" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>';
			aHTML[++h] = '</table>';				
		
			$('#' + sXHTMLElementID).html(aHTML.join(''));
		
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table id="tableInterfaceMainNewsGroupsColumn2" class="interfaceMainColumn2">';
					
			aHTML[++h] = '<tr><td id="tdInterfaceMainSend" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainBlank">Create Blank</span>' +
							'</td></tr>';
							
			aHTML[++h] = '</table>';					
		
			$('#tdInterfaceMainNewColumn2Action').html(aHTML.join(''));
		
			$('#spanInterfaceMainBlank').button(
			{
				label: "Blank"
			})
			.click(function() {
				interfaceMessagingSendEmail(aParam);
			})
			.css('width', '75px')
		
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table style="width:100%">';
			aHTML[++h] = '<tbody>';
			aHTML[++h] = '<tr><td class="interfaceMainCaption">Saved Drafts</td></tr>';
			
			aHTML[++h] = '<table style="width:100%">';
			aHTML[++h] = '<tbody>';
		
			oResponse.data.rows.each(function() {
			
				if (this.subject.text() != '')
				{
					aHTML[++h] = '<tr><td id="tdMessagingDrafts_subject-' + $(this).find('id').text() + 
								'"class="interfaceMainRow interfaceMainRowSelect">' + this.subject + '</td></tr>';
				}				
			})
			
			aHTML[++h] = '</tbody></table>';
			
			$('#tdInterfaceMainNewColumn1Large').html(aHTML.join(''));
		
			$('.interfaceMainRowSelect').click(function() {
			
				var sParam = 'method=MESSAGING_EMAIL_DRAFT_SEARCH&getmessage=1';
				sID = this.id;
				aID = sID.split('-');
				sParam += '&id=' + aID[1];

				$.ajax(
				{
					type: 'GET',
					url: '/ondemand/messaging/?' + sParam,
					dataType: 'json',
					success: function(oResponse) {
						aParam.message = oResponse.data.rows[0].body;
						aParam.subject = oResponse.data.rows[0].subject;
						aParam.source = 3;
						interfaceMessagingSendEmail(aParam);
					}
				});
			})
		}
	}	
}

function interfaceMessagingEmailSave(aParam)
{
	var iStep = 1;
	var sXHTMLElementID = '';
	var sMessageId;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.step != undefined) {iStep = aParam.step}
	}
	else
	{
		aParam = {};
	}
	
	var sID = sXHTMLElementID;
	sID = sID.replace(/\___/g, '.');
	
	var aID = sID.split('_id_');
	sMessageId = aID[1];
	
	$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', sXHTMLElementID)
	
	if (iStep == 1)
	{
	
		interfaceMasterOptionsPosition({xhtmlElementID: sXHTMLElementID, leftOffset:-75});
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableMessagingEmailSaveOption" style="width:75px;" class="interfaceDropDown">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMessagingEmailSaveOptionJustSave" class="interfaceMainAction">' +
						'<span id="spanInterfaceMessagingEmailSaveOptionJustSave">Save</span>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
	
		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''))
		
		$('#spanInterfaceMessagingEmailSaveOptionJustSave').button(
		{
			label: "Save"
		})
		.click(function() {
			$('#spanInterfaceMessagingEmailSaveOptionJustSave').html(gsLoadingSmallXHTML);
			aParam.step = 2
			interfaceMessagingEmailSave(aParam);
			
		})
		.css('width', '75px')
	
		$('#spanInterfaceMessagingEmailSaveOptionSaveAsToDo').button(
		{
			label: "To Do"
		})
		.click(function() {
			aParam.step = 3
			interfaceMessagingEmailSave(aParam);
		})
		.css('width', '75px')
	
	}

	if (iStep == 2)
	{
		var sParam = 'method=MESSAGING_EMAIL_ACTION_MANAGE';
		sParam += '&account=' + giMessagingAccountID;
		sParam += '&messageid=' + encodeURIComponent(sMessageId);
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/messaging/',
			data: sParam,
			dataType: 'json',
			success: function(data)
						{
							$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
							$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
						}
		});	
	}
	
}

function interfaceMessagingActions(aParam, oResponse)
{

	var sXHTMLElementID = 'divInterfaceMainActionsSent';
	
	var iType = 5 //Email Sent

	if (oResponse == undefined)
	{
		$('#spanInterfaceMainHeaderSentEmails').html(gsLoadingSmallXHTML);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'ACTION_SEARCH';
		oSearch.addField('actionreference,actiontypetext,duedate');
		oSearch.rf = 'json';
		oSearch.addFilter('actiontype', 'EQUAL_TO', iType);
		oSearch.sort('modifieddate', 'desc');
		oSearch.getResults(function(data) {interfaceMessagingActions(aParam, data)}); 
	}
	else
	{
		var aHTML = [];
		var h = -1;
			
		$('#spanInterfaceMainHeaderSentEmails').html('Sent&nbsp;emails');
		
		if (oResponse.data.rows.length == 0)
		{
		
		}
		else
		{
			aHTML[++h] = '<table border="0" class="interfaceSearchMedium">';
			aHTML[++h] = '<tbody>'
			
			$.each(oResponse.data.rows, function() 
			{
				aHTML[++h] = '<tr class="interfaceSearch">';
				aHTML[++h] = '<td id="tdAction_subject-' + this.id + '" class="interfaceSearch">' +
								this.actionreference + '</td>';
								
				aHTML[++h] = '<td id="tdAction_date-' + this.id + '" class="interfaceSearch">' +
								this.duedate + '</td>';
				
				aHTML[++h] = '</tr>'
			});
    	
			aHTML[++h] = '</tbody></table>';

			$('#divInterfaceMasterViewportControlOptions').html(interfaceMasterPagination(
				   {
					html: aHTML.join(''),
					more: (oResponse.morerows == "true")
				   }) );
		
			$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
			interfaceMasterPaginationBind(
			{
				columns: 'actionreference-duedate',
				more: oResponse.moreid,
				rows: 20,
				startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows)
			});   
		
			//functionSearch: interfaceMessagingActions
		}
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').hide();
			interfaceMessagingActionSearch({xhtmlElementID: event.target.id});
		});
	}
}

function interfaceMessagingActionSearch(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	var sXHTMLElementID;
	var sTargetXHTMLElementID = 'divInterfaceMainSummary';
	var bSetContext = true;

	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.targetXHTMLElementID != undefined) {sTargetXHTMLElementID = aParam.targetXHTMLElementID}
		if (aParam.setContext != undefined) {bSetContext = aParam.setContext}
	}	

	var aSearch = sXHTMLElementID.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	
	if (bSetContext) {interfaceMasterMainViewportShow("#divInterfaceMainSummary", true)};
	
	if (oResponse == undefined)
	{
		giMessagingActionID = -1;
		
		var sParam = 'method=MESSAGING_EMAIL_ACTION_SEARCH&advanced=1&includeattachments=1';
		sParam += '&id=' + sSearchContext;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/messaging/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceMessagingActionSearch(aParam, data)}
		});
	}
	else
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceMessagingMasterViewport({autoShow: false});interfaceMessagingActionSearch({xhtmlElementID: "-' + sSearchContext + '"})',
			move: false
			})
				
		if (bSetContext) {goObjectContext = oResponse.data.rows[0]};
		
		if (oResponse.data.rows.length != 0)
		{
		
			var oRow = oResponse.data.rows[0];
			
			aHTML[++h] = '<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="interfaceMainHeader">';
			aHTML[++h] = '<tbody>'
			
			aHTML[++h] = '<tr class="interfaceMainHeader">' +
							'<td style="text-align:left;font-weight:bold" class="interfaceMessagingHeader" id="interfaceMessagingHeader">' +
							oRow.subject + '</td>';
			
			var sDate = new Date(oRow.date);	
			sDate = $.fullCalendar.formatDate(sDate, 'd MMM yyyy h:mm TT');

			aHTML[++h] = '<td style="text-align:right;" class="interfaceMessagingSubHeader" id="interfaceMessagingHeaderDate">' +
							sDate + '</td>';
			aHTML[++h] = '</tr>';
			
			aHTML[++h] = '<tr class="interfaceMainHeader">' +
							'<td colspan=2 style="text-align:left;" class="interfaceMessagingSubHeader" id="interfaceMainHeaderFromEmail">' +
							oRow.fromemail + '</td>';
			
			aHTML[++h] = '</tr>';
			
			aHTML[++h] = '</tbody></table>';
			
			if (oRow.to != '')
			{
				aHTML[++h] = '<table id="tableMessagingEmailsHeaderTo" border="0" cellspacing="0" cellpadding="0" class="interfaceMainHeader">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainHeaderTo">' +
								'<td style="text-align:left;" class="interfaceMainHeader" id="interfaceMainHeaderCC">';
								
				var sTo = oRow.to;
				var aTo = sTo.split('#');
				sTo = '';
			
				$.each(aTo, function() {
					aTo = this.split("|");
					sTo += aTo[0] + '; ';
				});				
								
				aHTML[++h] = '<span class="interfaceMessagingHeader">To:</span> ' + sTo;

				aHTML[++h] = '</td></tr>';
				aHTML[++h] = '</tbody></table>';
			}
			
			if (oRow.cc != '')
			{
				aHTML[++h] = '<table id="tableMessagingEmailsHeaderCC" border="0" cellspacing="0" cellpadding="0" class="interfaceMainHeader">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainHeaderCC">' +
								'<td style="text-align:left;" class="interfaceMainHeader" id="interfaceMainHeaderCC">';
								
				var sCC = oRow.cc;
				var aCC = sCC.split('#');
				sCC = '';
			
				$.each(aCC, function() {
					aCC = this.split("|");
					sCC += aCC[0] + '; ';
				});				
								
				aHTML[++h] = '<span class="interfaceMessagingHeader">Cc:</span> ' + sCC;

				aHTML[++h] = '</td></tr>';
				aHTML[++h] = '</tbody></table>';
			}
			
			if (oRow.attachments != '')
			{
				aHTML[++h] = '<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="interfaceMainHeader">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainHeader">' +
								'<td style="text-align:left;" class="interfaceMainHeader" id="interfaceMainHeaderAttachments">';
								
				var sAttachments = oRow.attachments;
				var aAttachments = sAttachments.split('#');
				sAttachments = '';
				var i = 0;
				
				$.each(aAttachments, function(iIndex) 
				{
					i = i + 1
					if (i == 1)
					{
						sAttachments +=	'<a href="' + aAttachments[iIndex+i] + '" target="_blank">' + aAttachments[iIndex + i -1] + '</a>; ';
						i = -1;
					}	
				});	
								
				aHTML[++h] = '<span class="interfaceMessagingHeader">Attachments:</span> ' + sAttachments;

				aHTML[++h] = '</td></tr>';
				aHTML[++h] = '</tbody></table>';
			}
			
			aHTML[++h] = '<iframe style="display:block;height:10px;width:900px;" name="ifMessage" ' +
							'id="ifMessage" frameborder="0" border="0" scrolling="no"></iframe>';
							
			$('#' + sTargetXHTMLElementID).html(aHTML.join('')); 
			
			interfaceMessagingViewport(aParam);
				
			setTimeout("interfaceMessagingShowMessage()", 300);
			
		
		}
	}
}