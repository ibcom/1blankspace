
/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

// Based on using the mydigitalstructure caching.
// So primarily working of the cache object in the model.
// totals & get details for messages not fully cached.  Show part of message that have and then back fill attachments and message
// Back update flags for read.

//var ns1blankspace.messaging.lastMessageID = '';
//var giMessagingLastInboxPageID = '';
//var giMessagingEmailSkippedCount;

if (ns1blankspace.messaging === undefined) {ns1blankspace.messaging = {}}

ns1blankspace.messaging.imap = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 39;
					ns1blankspace.objectParentName = 'messaging';
					ns1blankspace.objectName = 'imap';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Email';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.messaging.imap.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);

					ns1blankspace.messaging.autoCheck = false;
					ns1blankspace.messaging.emailAccounts = [];
					ns1blankspace.messaging.defaultRows = 25;
					ns1blankspace.messaging.account = -1;
					ns1blankspace.messaging.emailRead = [];
					ns1blankspace.messaging.emailRemoved = [];
					ns1blankspace.messaging.showRemoved = false;
					ns1blankspace.messaging.EmailInbox = [];
					ns1blankspace.messaging.EmailInboxXHTML = [];
					ns1blankspace.messaging.emailCount = 0;
					ns1blankspace.messaging.emailLastPage = 1;
					ns1blankspace.messaging.emailLastPagination;
					ns1blankspace.messaging.emailNewCount;
					ns1blankspace.messaging.action = -1;

					if (ns1blankspace.option.richTextEditing)
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
							content_css : ns1blankspace.xhtml.editorCSS,
							
							external_link_list_url : "/jscripts/ibcom/linkList.asp", 
							external_image_list_url : "/jscripts/ibcom/imageList.asp?LinkType=19&LinkId=" + ns1blankspace.objectContext, 
							media_external_list_url : "/jscripts/ibcom/mediaList.asp?LinkType=19&LinkId=" + ns1blankspace.objectContext, 

						});				
					
					}
					
					var aHTML = [];
					
					aHTML.push('<div id="divns1blankspaceMainInbox" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainSummary" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainEdit" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainActions" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainAttachments" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainActionsSent" class="divns1blankspaceViewportMain"></div>';
					
					$('#divns1blankspaceMain').html(aHTML.join(''));
					
					ns1blankspace.messaging.emailAccounts.length = 0;
					
					if (bShowHome) {ns1blankspaceMessagingHomeShow(oParam)};
				},

	check:		function ns1blankspaceMessagingCheckForNew(oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var sParam = 'method=MESSAGING_EMAIL_CACHE_CHECK';
						sParam += '&account=' + ns1blankspace.messaging.account;
						
						$.ajax(
						{
							type: 'POST',
							url: '/ondemand/messaging/?' + sParam,
							dataType: 'json',
							success: function(data) {ns1blankspaceMessagingCheckForNew(oParam, data)}
						});
					}
					else
					{
						ns1blankspace.messaging.emailNewCount = oResponse.newrows;
						$('#ns1blankspaceMainHeaderRefresh').html('Refresh (' + ns1blankspace.messaging.emailNewCount + ')')	
					}
				},			

	home:		function ns1blankspaceMessagingHomeShow(oParam, oResponse)
				{
					var bAutoShow = true;

					if (oParam != undefined)
					{
						if (oParam.autoShow != undefined) {bAutoShow = oParam.autoShow}
					}	
					
					ns1blankspaceViewportDestination({
							newDestination: 'ns1blankspaceMessagingIMAPMasterViewport();',
							move: false
							})		
							
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					
					if (ns1blankspace.messaging.emailAccounts.length == 0)
					{
						if (oResponse == undefined)
						{
							var aHTML = [];
							
										
							aHTML.push('<table id="tablens1blankspaceViewportMain" class="ns1blankspaceViewportMain">';
							aHTML.push('<tr id="trns1blankspaceViewportMain" class="ns1blankspaceViewportMain">' +
											'<td id="tdns1blankspaceProjectHomeMostLikely" class="ns1blankspaceViewportMain">' +
											'' +  
											'</td>' +
											'</tr>';
							aHTML.push('</table>';					
							
							$('#divns1blankspaceViewportControl').html(ns1blankspace.xhtml.loading);
							
							var sParam = 'method=MESSAGING_EMAIL_ACCOUNT_SEARCH';
							
							if (ns1blankspace.option.messagingEmailShowCount) {sParam += '&advanced=1'}
							sParam += '&account=' + gsMessagingEmailAccount;
							sParam += '&type=5';
							
							$.ajax(
							{
								type: 'POST',
								url: '/ondemand/messaging/?' + sParam,
								dataType: 'json',
								success: function(data) {ns1blankspaceMessagingHomeShow(oParam, data)}
							});
						}
						else
						{
							var aHTML = [];
							
										
							aHTML.push('<table>';
							aHTML.push('<tr>' +
											'<td id="ns1blankspaceViewportMessagingEmailLarge" class="ns1blankspaceViewportImageLarge">' +
											'&nbsp;' + 
											'</td>' +
											'</tr>';
							aHTML.push('</table>';		
							
							ns1blankspace.messaging.emailAccounts.length = 0;
							
							if (oResponse.data.rows.length != 0)
							{
								aHTML.push('<table style="padding-top:0px;" id="tablens1blankspaceMessagingAccounts" class="ns1blankspaceViewportControl">';
								
								$.each(oResponse.data.rows, function(index)
								{
									ns1blankspace.messaging.emailAccounts.push({
										id: this.id,
										footer: ns1blankspaceFormatXHTML(this.footer)
									})		
									
									if (index == 0) 
									{
										ns1blankspace.messaging.account = this.id;
									}
									else
									{
										ns1blankspace.messaging.account = undefined;
									}
									
									var sDescription = this.email;
									var aDescription = sDescription.split("@");
										
									if (aDescription.length > 0) {sDescription = aDescription[0]}	
									
									
									aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
										'<td id="ns1blankspaceMessaging-' + this.id + '" ' +
												'class="ns1blankspaceViewportControl"' +
												' title="' + this.email + '">' +
												sDescription +
												'</td>' +
										'</tr>';
										
									if (ns1blankspace.option.messagingEmailShowCount)
									{	
										aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceMessagingCount-' + this.id + '" ' +
												' class="ns1blankspaceViewportControl ns1blankspaceViewportControlSub" title="Including those marked to be removed.">' +
												this.count + ' emails<br />' +
												'</td>' +
										'</tr>';		
									}	
								});
								
								aHTML.push('<tr>' +
										'<td>&nbsp;</td>' +
										'</tr>';		
								
								aHTML.push('</tbody></table>';
								
								aHTML.push('<table id="tablens1blankspaceMessagingEmailViewport" cellspacing=0 cellpadding=0>';
								aHTML.push('<tr><td id="tdns1blankspaceMessagingEmailViewport"></td></tr>';
								aHTML.push('</table>';
								
							}
							else
							{
								aHTML.push('<table id="tablens1blankspaceMessagingEmailViewport">';
								aHTML.push('<tr><td id="tdns1blankspaceMessagingEmailViewport">No accounts configured.</td></tr>';
								aHTML.push('</table>';
							}
							
							$('#divns1blankspaceViewportControl').html(aHTML.join(''));	
						
							$('td.ns1blankspaceViewportControl').click(function(event)
							{
								ns1blankspaceMainViewportShow("#divns1blankspaceMainInbox");
								
								var sID = event.target.id
								var aID = sID.split('-');
								if (ns1blankspace.messaging.account != aID[1])
								{
									ns1blankspaceMessagingInboxSearch({xhtmlElementID: event.target.id, source: 1, newOnly: false, repaginate:true});
								}	
							});
							
							if (ns1blankspace.messaging.account != undefined && bAutoShow)
							{
								$('#ns1blankspaceMessaging-' + ns1blankspace.messaging.account).addClass('ns1blankspaceViewportControlHighlight');
								ns1blankspaceMainViewportShow("#divns1blankspaceMainInbox");
								ns1blankspaceMessagingInboxSearch({xhtmlElementID: '-' + ns1blankspace.messaging.account, source: 1, newOnly: false, refreshInbox: true, repaginate: true})
							}	
						}
					}	
				},

	inbox: 		{				
					show:		function ns1blankspaceMessagingInboxSearch(oParam, oResponse)
								{
									var sXHTMLElementID;
									var bNew;
									var iStart;
									var bRefresh = false;
									var bRepaginate = true;
									
									if (oParam != undefined)
									{
										if (oParam.source != undefined) {iSource = oParam.source}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.newOnly != undefined) {bNew = oParam.newOnly}
										if (oParam.start != undefined) {iStart = oParam.start}
										if (oParam.refreshInbox != undefined) {bRefresh = oParam.refreshInbox}
										if (oParam.repaginate != undefined) {bRepaginate = oParam.repaginate}
									}
									else
									{
										oParam = {};
									}	
									
									if (iStart == undefined && bNew == undefined) {bNew = true}
									
									$('#tdns1blankspaceMessagingEmailViewport').html('');
									
									if (sXHTMLElementID != undefined)
									{
										var aXHTMLElementID = sXHTMLElementID.split('-');
										
										if (ns1blankspace.messaging.account != aXHTMLElementID[1]) 
										{
											bRefresh = true;
											oParam.refreshInbox = true;
										}
										ns1blankspace.messaging.account = aXHTMLElementID[1];
									}	
									
									if (bRefresh) {ns1blankspaceMessagingCheckForNew()}
									
									if (bRepaginate)
									{
										ns1blankspace.messaging.emailLastPagination = undefined;
										ns1blankspace.messaging.emailLastPage = 1;
										
										var aHTML = [];
										
									
										aHTML.push('<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
										aHTML.push('<tbody>'
										aHTML.push('<tr><td style="height:20px;" id="ns1blankspaceMessagingInboxHeader">' + ns1blankspace.xhtml.loading + '</td></tr>';
										aHTML.push('<tr><td id="ns1blankspaceMessagingInbox"></td></tr>';
										aHTML.push('</tbody></table>';

										$('#divns1blankspaceMainInbox').html(aHTML.join(''));
										
										if (ns1blankspace.timer.messaging != 0) {clearInterval(ns1blankspace.timer.messaging)};
								        if (ns1blankspace.messaging.autoCheck) {ns1blankspace.timer.messaging = setInterval("ns1blankspaceMessagingCheckForNew()", ns1blankspace.option.messagingCheckForNew)};
									}	
										
									if (ns1blankspace.messaging.account != undefined && oResponse == undefined && bRefresh)
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
										oSearch.addField('messageid,to,cc,from,fromname,subject,date,' +
															'hasattachments,attachments,imapflags,detailscached');
										oSearch.addFilter('account', 'EQUAL_TO', ns1blankspace.messaging.account);
										oSearch.addSummaryField('count(*) cachecount');
										oSearch.sort('date', 'desc')
										oSearch.rows = ns1blankspace.messaging.defaultRows;
										oSearch.getResults(function(data) {ns1blankspaceMessagingInboxSearch(oParam, data)});
									}
									else
									{
										ns1blankspace.messaging.emailCount = oResponse.summary.cachecount;
											
										if (bRepaginate) //bRefresh?
										{
											var aHTML = [];
											
										
											aHTML.push('<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMainHeader">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceMainHeader">' +
													'<td class="ns1blankspaceMainHeader" id="ns1blankspaceMainHeaderRemovedEmails" style="text-align:left;">' +
													ns1blankspace.messaging.emailCount + ' emails';
													
											if (ns1blankspace.messaging.emailCount > 5000)
											{	
												aHTML.push('&nbsp;<span style="font-size:0.75em;vertical-align:bottom;" class="ns1blankspaceMessagingHeader"> You should think about saving some emails.</span>';
											}	
											
											aHTML.push('</td>';	
											
											aHTML.push('<td class="ns1blankspaceMainHeader" id="ns1blankspaceMainHeaderRefresh">Refresh</td>';
											aHTML.push('<td class="ns1blankspaceMainHeader" style="width:5px;">&nbsp;|&nbsp;</td>';
											
											aHTML.push('<td class="ns1blankspaceMainHeader" id="ns1blankspaceMainHeaderRemovedEmails" style="width:90px;">';
															
											if (ns1blankspace.messaging.showRemoved)
											{	
												aHTML.push('<span id="ns1blankspaceMainHeaderRemovedEmailsHide-' + ns1blankspace.messaging.account + '" class="ns1blankspaceMainHeaderRemovedEmailsHide" >Hide&nbsp;removed&nbsp;emails</span>';
											}
											else
											{
												aHTML.push('<span id="ns1blankspaceMainHeaderRemovedEmailsShow-' + ns1blankspace.messaging.account + '" class="ns1blankspaceMainHeaderRemovedEmailsShow">Show&nbsp;removed&nbsp;emails</span>';
											}	
															
											aHTML.push('</td>';
											
											aHTML.push('<td class="ns1blankspaceMainHeader" style="width:5px;">&nbsp;|&nbsp;</td>';
											aHTML.push('<td class="ns1blankspaceMainHeader" id="tdns1blankspaceMainHeaderSentEmails" style="width:70px;">';
											aHTML.push('<span id="spanns1blankspaceMainHeaderSentEmails" class="ns1blankspaceMainHeaderSentEmails" >Sent&nbsp;emails</span>';
											
											aHTML.push('</td>';
											aHTML.push('</tr>';
											
											aHTML.push('<tr class="ns1blankspaceMainHeader" id="trns1blankspaceMessagingInboxPages"><td colspan=2 id="tdns1blankspaceMessagingInboxPages"></td></tr>';
											aHTML.push('</tbody></table>';
											
											$('#ns1blankspaceMessagingInboxHeader').html(aHTML.join(''));
											
											//$('#ns1blankspaceMessagingInbox').html('<div id="divInboxPage-0" class="ns1blankspaceMessagingInbox"></div>');
										}
									
										$('#ns1blankspaceMainHeaderRefresh').html('Refresh')
										
										$('.ns1blankspaceMainHeaderRemovedEmailsHide').click(function() {
											$('#ns1blankspaceMainHeaderRemovedEmailsHide').hide();
											$('#ns1blankspaceMainHeaderRemovedEmailsShow').show();
											ns1blankspace.messaging.showRemoved = false;
											ns1blankspaceMessagingInboxSearch({xhtmlElementID: this.id, source: 1, newOnly: false, refreshInbox: true, repaginate: true})
										})
										
										$('.ns1blankspaceMainHeaderRemovedEmailsShow').click(function() {
											$('#ns1blankspaceMainHeaderRemovedEmailsShow').hide();
											$('#ns1blankspaceMainHeaderRemovedEmailsHide').show();
											ns1blankspace.messaging.showRemoved = true;
											ns1blankspaceMessagingInboxSearch({xhtmlElementID: this.id, source: 1, newOnly: false, refreshInbox: true, repaginate: true})
										})
											
										$('#ns1blankspaceMainHeaderRefresh').click(function() {
											ns1blankspaceMessagingInboxSearch({xhtmlElementID: '-' + ns1blankspace.messaging.account, source: 1, newOnly: false, refreshInbox: true, repaginate: true})
										})
										
										$('#tdns1blankspaceMainHeaderSentEmails').click(function() {
											ns1blankspaceOptionsPosition({xhtmlElementID: 'tdns1blankspaceMainHeaderSentEmails', leftOffset: -170, topOffset: -5});
											ns1blankspaceMessagingActions({xhtmlElementID: 'tdns1blankspaceMainHeaderSentEmails', type: 5})
										})
										
										var aHTML = [];
										
										
										aHTML.push('<table id="tableMessagingEmails" border="0" cellspacing="0" cellpadding="0" style="font-size:0.875em">';
										aHTML.push('<tbody>'
										
										$.each(oResponse.data.rows, function()
										{
											aHTML.push(ns1blankspaceMessagingInboxSearchRow(this);
										});
										
										aHTML.push('</tbody></table>';
										
										ns1blankspacePaginationList(
										{
											xhtmlElementID: 'ns1blankspaceMessagingInbox',
											xhtmlContext: 'EmailIMAPInbox',
											xhtml: aHTML.join(''),
											showMore: (oResponse.morerows == "true"),
											more: oResponse.moreid,
											rows: 50,
											functionShowRow: ns1blankspaceMessagingInboxSearchRow,
											functionNewPage: 'ns1blankspaceMessagingInboxSearchBind()',
											type: 'json'
										}); 	
											
										ns1blankspaceMessagingInboxSearchBind();
									}
								},

								function ns1blankspaceMessagingInboxSearchRow(oRow)
								{
									var aHTML = [];
									

									var sID = oRow.id;
									//sID	= sID.replace(/\./g, '___');
									//For IMAP should always be a sequenced number.
									
									var sDate = new Date(oRow.date);	
									sDate = $.fullCalendar.formatDate(sDate, 'd MMM yyyy h:mm TT');
																
									var sClass = '';
									
									if ((oRow.imapflags).indexOf('\\SEEN') == -1)
									{
										sClass = " ns1blankspaceMainBold"
									}
									
									aHTML.push('<tr class="ns1blankspaceMainRow' + sClass + '" data-cached="' + oRow.detailscached + '" id="trMessagingEmails_from_id_' + sID + '">';
									
									aHTML.push('<td style="padding-right:5px;" id="tdMessagingEmails_from_id_' + sID + 
														'" style="cursor: pointer;" class="ns1blankspaceMainRowOptionsSelect ns1blankspaceMainRow' + sClass + '"' +
														' title="' + oRow.fromEmail + '">' +
														oRow.fromname + '</td>';
														
									aHTML.push('<td style="padding-right:5px;" id="tdMessagingEmails_subject_id_' + sID + 
														'" style="cursor: pointer;" class="ns1blankspaceMainRowOptionsSelect ns1blankspaceMainRow' + sClass + '">' +
														oRow.subject + '</td>';
									
									aHTML.push('<td style="width:150px;" id="tdMessagingEmails_date_id_' + sID + '" class="ns1blankspaceMainRow' + sClass + '">' +
															sDate + '</td>';
									
									aHTML.push('<td style="width:70px;text-align:right;" class="ns1blankspaceMainRow">';
									aHTML.push('<span id="spanMessagingEmails_reply_id_' + sID + '" class="ns1blankspaceMainRowOptionsReply"></span>';
									
									if ((oRow.imapflags).indexOf('\\DELETED') == -1)
									{
										aHTML.push('<span id="spanMessagingEmails_delete_id_' + sID + '" class="ns1blankspaceMainRowOptionsDelete"></span>';
									}
									else
									{
										aHTML.push('<span style="width: 23px;" id="tdMessagingEmails_delete_id_' + sID +
														'" class="ns1blankspaceMainRowOptionsDeleteDisabled"></span>';
									}

									aHTML.push('<span id="spanMessagingEmails_save_id_' + sID + '" class="ns1blankspaceMainRowOptionsSave"></span>';
									
									aHTML.push('</td></tr>';
									
									return aHTML.join('');
								}

								function ns1blankspaceMessagingInboxSearchBind()
								{
									$('.ns1blankspaceMainRowOptionsSelect').click(function() {
											$('td.ns1blankspaceViewportControl').removeClass('ns1blankspaceViewportControlHighlight');
											$('#' + this.id).parent().find('td').removeClass('ns1blankspaceMainBold');
											ns1blankspaceMessagingEmailRead(this.id);
											ns1blankspaceMessagingSearch(this.id);
										});
										
										$('.ns1blankspaceMainRowOptionsDelete').button({
											text: false,
											label: "Delete",
											icons: {
												 primary: "ui-icon-close"
											}
										})
										.click(function() {
											ns1blankspaceMessagingEmailRemove(this.id)
										})
										.css('width', '15px')
										.css('height', '20px')
									
										$('.ns1blankspaceMainRowOptionsDeleteDisabled').button({
											text: false,
											disabled: true,
											 icons: {
												 primary: "ui-icon-close"
											}
										})
										.css('width', '15px')
										.css('height', '20px')
										
										$('.ns1blankspaceMainRowOptionsReply').button({
											text: false,
											label: "Reply",
											icons: {
												 primary: "ui-icon-arrowreturnthick-1-w"
											}
										})
										.click(function() {
										
											$('td.ns1blankspaceViewportControl').removeClass('ns1blankspaceViewportControlHighlight');
											$('#' + this.id).parent().find('td').removeClass('ns1blankspaceMainBold');
											ns1blankspaceMessagingEmailRead(this.id);
											ns1blankspaceMessagingSearch(this.id, {reply: true});
										})
										.css('width', '15px')
										.css('height', '20px')
										
										$('.ns1blankspaceMainRowOptionsSave').button({
											text: false,
											label: "Save",
											icons: {
												 primary: "ui-icon-check"
											}
										})
										.click(function() {
										
											if ($(ns1blankspace.xhtml.container).attr('data-initiator') == this.id)
											{
												$(ns1blankspace.xhtml.container).slideUp(500);
												$(ns1blankspace.xhtml.container).attr('data-initiator', '');
											}
											else
											{
												ns1blankspaceMessagingEmailSave({xhtmlElementID: this.id})
											}	
										})
										.css('width', '15px')
										.css('height', '20px')
								}	
				},

	search: 	{
					send:		function ns1blankspaceMessagingSearch(sXHTMLElementId, oParam)
								{
									
									var aSearch = sXHTMLElementId.split('_id_');
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
										ns1blankspaceMainViewportShow("#divns1blankspaceMainSummary", true);
										
										sSearchContext = sSearchContext.replace(/\___/g, '.');
										
										ns1blankspace.objectContext = sSearchContext;
										ns1blankspace.messaging.action = -1;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
										oSearch.addField('messageid,to,cc,from,fromname,subject,date,' +
															'message,hasattachments,attachments,imapflags,detailscached');
										oSearch.addFilter('account', 'EQUAL_TO', ns1blankspace.messaging.account);
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.rows = ns1blankspace.messaging.defaultRows;
										oSearch.getResults(function(data) {ns1blankspaceMessagingShow(oParam, data)});	
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
											sElementId = 'tablens1blankspaceViewportMasterBrowse';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspaceOptionsSetPosition(sElementId);
											ns1blankspaceSearchStart(sElementId);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
											oSearch.addField('subject');
											oSearch.addFilter('account', 'EQUAL_TO', ns1blankspace.messaging.account);
											oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
											oSearch.rows = ns1blankspace.messaging.defaultRows;
											oSearch.getResults(function(data) {ns1blankspaceMessagingShow(oParam, data)});
										}
									};	
								},

					process:	function ns1blankspaceMessagingSearchShow(oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									
									var	iMaximumColumns = 1;
									
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspaceSearchStop();
										$(ns1blankspace.xhtml.container).hide();
									}
									else
									{
										aHTML.push('<table class="ns1blankspaceSearchMedium">';
										aHTML.push('<tbody>'
											
										$.each(oResponse.data.rows, function()
										{
											aHTML.push('<tr class="ns1blankspaceSearch">';
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'-' + this.id + '">' +
															this.subject + '</td>';
											aHTML.push('</tr>'
										});
								    	
										aHTML.push('</tbody></table>';

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										ns1blankspaceSearchStop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspaceMessagingSearch(event.target.id, {source: 1});
										});
									}	
								}
				},
						
	layout: 	function ns1blankspaceMessagingViewport(oParam)
				{
					var aHTML = [];
					
					var bReply = false;
					
					if (oParam != undefined)
					{
						if (oParam.reply != undefined) {bReply = oParam.reply}
					}	
					
					aHTML.push('<table id="tablens1blankspaceViewportControl" class="ns1blankspaceViewportControl">';
					
					if (bReply) 
					{
						aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlSummary" class="ns1blankspaceViewportControl">Message</td>' +
									'</tr>';
					}
					else
					{
						aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlSummary" class="ns1blankspaceViewportControl ns1blankspaceViewportControlHighlight">Message</td>' +
									'</tr>';
					}
					
					/*
					aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
									'<td id="ns1blankspaceMessagingAttachments" ' +
											' class="ns1blankspaceViewportControl ns1blankspaceViewportControlSub">' +
											'&nbsp;' +
											'</td>' +
									'</tr>';		
					*/
					
					if (bReply) 
					{
						aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlReply" class="ns1blankspaceViewportControl ns1blankspaceViewportControlHighlight">Reply</td>' +
									'</tr>';
					}
					else
					{
						aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlReply" class="ns1blankspaceViewportControl">Reply</td>' +
									'</tr>';
					}
					
					aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlReplyAll" class="ns1blankspaceViewportControl">Reply All</td>' +
									'</tr>';
						
					aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlForward" class="ns1blankspaceViewportControl">Forward</td>' +
									'</tr>';
									
					aHTML.push('</table>';					
					
					aHTML.push('<table id="tablens1blankspaceViewportControl" class="ns1blankspaceViewportControl">';
					
					aHTML.push('</table>';					
						
					$('#tdns1blankspaceMessagingEmailViewport').html(aHTML.join(''));
					
					var aHTML = [];
					

					$('#tdns1blankspaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainSummary");
						ns1blankspaceMessagingSummary();
					});
					
					$('#tdns1blankspaceViewportControlReply').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainEdit");
						ns1blankspaceMessagingSendEmail({xhtmlElementID: 'divns1blankspaceMainEdit'})
					});

					$('#tdns1blankspaceViewportControlReplyAll').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainEdit");
						ns1blankspaceMessagingSendEmail({xhtmlElementID: 'divns1blankspaceMainEdit', replyAll: true})
					});
					
					$('#tdns1blankspaceViewportControlForward').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainEdit");
						ns1blankspaceMessagingSendEmail({xhtmlElementID: 'divns1blankspaceMainEdit', forward: true})
					});
					
					$('#tdns1blankspaceViewportControlActions').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainActions", true);
						ns1blankspaceActions({xhtmlElementID: 'divns1blankspaceMainActions'});
					});
					
					$('#ns1blankspaceMessagingAttachments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainAttachments", true);
						ns1blankspaceMessagingAttachments();
					});
				},

	show: 		function ns1blankspaceMessagingShow(oParam, oResponse)
				{
					var bReply = false;
					var aHTML = [];
					
					var sHTML = '';
					
					if (oParam != undefined)
					{
						if (oParam.reply != undefined) {bReply = oParam.reply}
					}	
					
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					
					ns1blankspaceMessagingViewport(oParam);
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
					
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find the email.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
												
						$('#divns1blankspaceViewportControlContext').html('');
						
						if (ns1blankspace.objectContextData.detailscached == 'Y')
						{
							if (ns1blankspace.objectContextData.attachmentcount == 0)
							{
								sHTML = 'No attachments';
							}

							if (ns1blankspace.objectContextData.attachmentcount == 1)
							{
								sHTML = '1 attachment';
							}

							if (ns1blankspace.objectContextData.attachmentcount > 1)
							{
								sHTML = ns1blankspace.objectContextData.attachmentcount + ' attachments';
							}
						
							sHTML += '<br /><br />';
						
							$('#ns1blankspaceMessagingAttachments').html(sHTML);
						
							var sAttachments = ns1blankspace.objectContextData.attachments;
							var aAttachments = sAttachments.split('#');
							sAttachments = '';
						
							$.each(aAttachments, function() {
								aAttachment = this.split("|");
								sAttachments += '\r\n' + aAttachment[0];
							});
						
							$('#ns1blankspaceMessagingAttachments').attr('title', sAttachments)
						}
						else
						{
							$('#ns1blankspaceMessagingAttachments').html('');
							$('#ns1blankspaceMessagingAttachments').attr('title', '');
						}	
						
						//IF NOT CACHED THEN GET AND DO FOLLOWING ON PROMISE
						
						if (bReply)
						{
							ns1blankspaceMainViewportShow("#divns1blankspaceMainEdit");
							ns1blankspaceMessagingSendEmail({xhtmlElementID: 'divns1blankspaceMainEdit'})
						}
						else
						{
							ns1blankspaceMessagingSummary();
						}	
					}	
				},		
	
	summary:	function ns1blankspaceMessagingSummary()
				{
					var aHTML = [];
					
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find this email.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMainHeader">';
						aHTML.push('<tbody>'
						
						aHTML.push('<tr class="ns1blankspaceMainHeader">' +
										'<td style="text-align:left;font-weight:bold" class="ns1blankspaceMessagingHeader" id="ns1blankspaceMessagingHeader">' +
										ns1blankspace.objectContextData.subject + '</td>';
						
						var sDate = new Date(ns1blankspace.objectContextData.date);	
						sDate = $.fullCalendar.formatDate(sDate, 'd MMM yyyy h:mm TT');

						aHTML.push('<td style="text-align:right;" class="ns1blankspaceMessagingSubHeader" id="ns1blankspaceMessagingHeaderDate">' +
										sDate + '</td>';
						aHTML.push('</tr>';
						
						aHTML.push('<tr class="ns1blankspaceMainHeader">' +
										'<td colspan=2 style="text-align:left;" class="ns1blankspaceMessagingSubHeader" id="ns1blankspaceMainHeaderFromEmail">' +
										ns1blankspace.objectContextData.from + '</td>';
						
						aHTML.push('</tr>';
						
						aHTML.push('</tbody></table>';
						
						if (ns1blankspace.objectContextData.to != '')
						{
							aHTML.push('<table id="tableMessagingEmailsHeaderTo" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMainHeader">';
							aHTML.push('<tbody>'
							aHTML.push('<tr class="ns1blankspaceMainHeaderTo">' +
											'<td style="text-align:left;" class="ns1blankspaceMainHeader" id="ns1blankspaceMainHeaderCC">';
											
							var sTo = ns1blankspace.objectContextData.to;
							var aTo = sTo.split('|')
							sTo = '';
						
							$.each(aTo, function(i)
							{	
								if (i % 2 !== 0) {sTo += this + '; ';}
							});				
											
							aHTML.push('<span class="ns1blankspaceMessagingHeader">To:</span> ' + sTo;

							aHTML.push('</td></tr>';
							aHTML.push('</tbody></table>';
						}
						
						if (ns1blankspace.objectContextData.cc != '')
						{
							aHTML.push('<table id="tableMessagingEmailsHeaderCC" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMainHeader">';
							aHTML.push('<tbody>'
							aHTML.push('<tr class="ns1blankspaceMainHeaderCC">' +
											'<td style="text-align:left;" class="ns1blankspaceMainHeader" id="ns1blankspaceMainHeaderCC">';
											
							var sCC = ns1blankspace.objectContextData.cc
							var aCC = sCC.split('|')
							sCC = '';
						
							$.each(aCC, function(i)
							{
								if (i % 2 !== 0) {sCC += this + '; ';}
							});				
											
							aHTML.push('<span class="ns1blankspaceMessagingHeader">Cc:</span> ' + sCC;

							aHTML.push('</td></tr>';
							aHTML.push('</tbody></table>';
						}
						
						//if (ns1blankspace.objectContextData.hasattachments == 'Y')
						//{
							aHTML.push('<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMainHeader">';
							aHTML.push('<tbody>'
							aHTML.push('<tr class="ns1blankspaceMainHeader">' +
													'<td style="text-align:left;" class="ns1blankspaceMainHeader" id="ns1blankspaceMainHeaderAttachments">';
							aHTML.push('</td></tr>';
							aHTML.push('</tbody></table>';
						//}
						
						aHTML.push(ns1blankspace.xhtml.loading;
						
						aHTML.push('<iframe style="display:block;height:10px;width:900px;" name="ifMessage" ' +
											'id="ifMessage" frameborder="0" border="0" scrolling="no"></iframe>';
										
						$('#divns1blankspaceMainSummary').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData.detailscached == 'Y')
						{
							setTimeout("ns1blankspaceMessagingShowMessage()", 300);
							ns1blankspaceMessagingShowAttachments();
						}
						else
						{
							var sParam = '/ondemand/messaging/?method=MESSAGING_EMAIL_CACHE_GET_DETAILS';
							var sData = 'id=' + ns1blankspace.objectContext;
						
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
														'message,hasattachments,attachments,imapflags,detailscached');
									oSearch.addFilter('account', 'EQUAL_TO', ns1blankspace.messaging.account);
									oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
									oSearch.getResults(function(oResponse) 
										{
											ns1blankspace.objectContextData = oResponse.data.rows[0];
											ns1blankspaceMessagingShowAttachments();
											ns1blankspaceMessagingShowMessage();
										})	
								}
							});
							
						}	
					}	
				},

	message: 	{
					attachments: function ns1blankspaceMessagingShowAttachments()
								{
									if (ns1blankspace.objectContextData.hasattachments == 'Y')
									{
										var aHTML = [];
										
										var sAttachments = ns1blankspace.objectContextData.attachments;
										
										if (sAttachments != 'undefined')
										{	
											if (sAttachments.indexOf("/download/") == -1)
											{					
												var aAttachments = sAttachments.split('#')
												sAttachments = '';
											
												$.each(aAttachments, function(iIndex) 
												{
													var aAttachment = this.split('|');
													
													var sLink = '/ondemand/messaging/?';
													sLink += 'method=MESSAGING_EMAIL_ATTACHMENT_DOWNLOAD&attachmentindex=' + (iIndex);
													sLink += '&account=' + ns1blankspace.messaging.account;
													sLink += '&messageid=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.messageid);
													
													sAttachments +=	'<a href="' + sLink + '" target="_blank">' + aAttachment[0] + '</a>; ';
												});	
																
												aHTML.push('<span class="ns1blankspaceMessagingHeader">Attachments:</span> ' + sAttachments;
											}
											else
											{								
												var sAttachments = ns1blankspace.objectContextData.attachments;
												var aAttachments = sAttachments.split('#')
												sAttachments = '';
											
												$.each(aAttachments, function(iIndex) 
												{
													var aAttachment = this.split('|');
													sAttachments +=	'<a href="' + aAttachment[1] + '" target="_blank">' + aAttachment[0] + '</a>; ';
												});	
																
												aHTML.push('<span class="ns1blankspaceMessagingHeader">Attachments:</span> ' + sAttachments;
											}
										}
									
										$('#ns1blankspaceMainHeaderAttachments').html(aHTML.join());
									}
									else
									{
										$('#ns1blankspaceMainHeaderAttachments').html('No attachments.');
									}
								},

					show:		function ns1blankspaceMessagingShowMessage()
								{
									var sHTML = ns1blankspace.objectContextData.message;
									sHTML = ns1blankspaceFormatXHTML(sHTML);

									while ($('#ifMessage').length == 0)
									  {
									  }

									$('.ns1blankspaceLoading').remove()
										
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

					setHeight:	function setHeight()
								{
									$('#ifMessage').css('height', ($('#ifMessage').attr('scrollHeight') + 100) + 'px');
									$('#ifMessage').css('width', ($('#ifMessage').attr('scrollWidth') + 100) + 'px');
								}

					edit:		function ns1blankspaceMessagingEdit()
								{
									var aHTML = [];
									
									
									if ($('#divns1blankspaceMainEdit').attr('onDemandLoading') == '1')
									{
										$('#divns1blankspaceMainEdit').attr('onDemandLoading', '');
												
										aHTML.push('<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMain">';
												
										aHTML.push('<tr id="trns1blankspaceMainDetailsEditTextValue" class="ns1blankspaceMainTextMulti">' +
														'<td id="tdns1blankspaceMainDetailsEditTextValue" class="ns1blankspaceMainTextMulti">' +
														'<textarea rows="30" cols="50" onDemandType="TEXTMULTI" id="inputns1blankspaceMainEditText" class="inputns1blankspaceMainTextMultiLarge"></textarea>' +
														'</td></tr>';
														
										aHTML.push('</table>';					
										
										$('#divns1blankspaceMainEdit').html(aHTML.join(''));
										
										if (ns1blankspace.objectContextData != undefined)
										{
											//tinyMCE.get('editor1').getContent()
											$('#inputns1blankspaceMainEditText').val(unescape(ns1blankspace.objectContextData.message));
										}
									
										if (ns1blankspace.option.richTextEditing)
										{
											tinyMCE.execCommand('mceAddControl', false, 'inputns1blankspaceMainEditText');
										}	
									}	
								}
				},

	save: 		{
					send: 		function ns1blankspaceMessagingSave(oParam, oResponse)
								{
									if (oResponse == undefined)
									{			
										var sParam = '/ondemand/messaging/?method=MESSAGING_EMAIL_DRAFT&rf=TEXT';
										
										if ($('#divns1blankspaceMainEdit').html() != '')
										{
											var sData = 'subject=' + ns1blankspace.util.fs($('#inputns1blankspaceMainActionsSendEmailSubject').val());
											sData += '&message=' + ns1blankspace.util.fs(tinyMCE.get('inputns1blankspaceMainActionsSendEmailMessage').getContent());
										}
										
										$.ajax(
										{
											type: 'POST',
											url: sParam,
											data: sData,
											dataType: 'text',
											success: function(data) 
											{
												ns1blankspaceMessagingSave(oParam, data)
											}
										});
										
									}
									else
									{	
										/* if (oResponse.status == 'OK')
										{
											ns1blankspaceStatus('Draft saved');
											//if (ns1blankspace.objectContext == -1) {var bNew = true}
											//ns1blankspace.objectContext = oResponse.id;	
											//if (bNew) {ns1blankspaceMessagingSearch('-' + ns1blankspace.objectContext)}
										}
										else
										{
											ns1blankspaceStatus(oResponse.error.errornotes);
											ns1blankspaceConfirm( {html: [oResponse.error.errornotes]
																	   , title: 'Save error!'});
										} */
									}
								}
				},

	attachments: function ns1blankspaceMessagingAttachments()
				{
					var aHTML = [];
					

					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find this email.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divns1blankspaceMainAttachments').html(aHTML.join(''));
					}
					else
					{
						var iAttachmentCount = ns1blankspace.objectContextData.attachmentcount;
						
						if (iAttachmentCount == 0)
						{
							aHTML.push('<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
							aHTML.push('<tbody>'
							aHTML.push('<tr class="ns1blankspaceAttachments">';
							aHTML.push('<td class="ns1blankspaceMainRowNothing">No attachments.</td>';
							aHTML.push('</tr>';
							aHTML.push('</tbody></table>';
							
							$('#divns1blankspaceMainAttachments').html(aHTML.join(''));
						}
						else
						{
							var sAttachments = ns1blankspace.objectContextData.attachments;
							var aAttachments = sAttachments.split('#')

							aHTML.push('<table class="ns1blankspaceMain"">';
							aHTML.push('<tbody>'
						
							aHTML.push('<tr class="ns1blankspaceMainCaption">';
							aHTML.push('<td class="ns1blankspaceMainCaption">Filename</td>';
							aHTML.push('<td class="ns1blankspaceMainCaption">Size (kb)</td>';
							aHTML.push('</tr>';
						
							$.each(aAttachments, function(iIndex) 
							{
								if (this != '')
								{
								
									var sLink = '/ondemand/messaging/?';
									sLink += 'method=MESSAGING_EMAIL_ATTACHMENT_DOWNLOAD&attachment=' + (iIndex);
									sLink += '&account=' + ns1blankspace.messaging.account;
									sLink += '&id=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
									
									var aAttachment = this.split('|');
									sAttachments += '\r\n' + aAttachment[0];
								
									aHTML.push('<tr class="ns1blankspaceAttachments">';
									aHTML.push('<td id="tdAttachment_filename-' + (iIndex) + '" class="ns1blankspaceMainRow">' +
														'<a href="' + sLink + '" target="_blank">' + aAttachment[0] + '</a></td>';
									aHTML.push('<td id="tdAttachment_size-' + (iIndex) + '" class="ns1blankspaceMainRow">' + (aAttachment[1] / 1000).toFixed(2) + '</td>';
													
									aHTML.push('</tr>'
								}	
							});	
						   	
							aHTML.push('</tbody></table>';
							$('#divns1blankspaceMainAttachments').html(aHTML.join(''));
						}
					}	
				},

	send: 		{
					show: 		function ns1blankspaceMessagingSendEmail(oParam)
								{

									var iObject = ns1blankspace.object;
									var iObjectContext = ns1blankspace.objectContext;
									var bShowTo = true;
									var bShowPriority = false;
									var bShowAll = false;
									var sXHTMLElementID = 'divns1blankspaceDialog';
									var bDialog = false;
									var iContactBusiness;
									var bReplyAll = false;
									var bForward = false;
									var bNewEmail = false;
									var sMessage = '';
									var sSubject = '';
									var iSource = 1;
									
									if (oParam != undefined)
									{
										if (oParam.object != undefined) {iObject = oParam.object}
										if (oParam.objectContext != undefined) {iObject = oParam.objectContext}
										if (oParam.showTo != undefined) {bShowTo = oParam.showTo}
										if (oParam.showPriority != undefined) {bShowPriority = oParam.showPriority}
										if (oParam.showAll != undefined) {bShowAll = oParam.showAll}
										if (oParam.dialog != undefined) {bDialog = oParam.dialog}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.contactBusiness != undefined) {iContactBusiness = oParam.contactBusiness}
										if (oParam.replyAll != undefined) {bReplyAll = oParam.replyAll}
										if (oParam.forward != undefined) {bForward = oParam.forward}
										if (oParam.newEmail != undefined) {bNewEmail = oParam.newEmail}
										if (oParam.message != undefined) {sMessage = oParam.message}
										if (oParam.subject != undefined) {sSubject = oParam.subject}
										if (oParam.source != undefined) {iSource = oParam.source}
									}

									if (bNewEmail)
									{
										ns1blankspace.objectContext = '';
										ns1blankspace.objectContextData = undefined;
										
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
											
													
										aHTML.push('<table id="tablens1blankspaceMainSendEmail">' +
													'<tr id="trns1blankspaceMainSendEmailRow1" class="ns1blankspaceMainRow1">' +
													'<td id="tdns1blankspaceMainSendEmailColumn1" class="ns1blankspaceMainColumn1List">' +
													ns1blankspace.xhtml.loading +
													'</td>' +
													'<td id="tdns1blankspaceMainSendEmailColumn2" class="ns1blankspaceMainColumn2Action">' +
													'</td>' +
													'</tr>' +
													'</table>';					
											
										$('#' + sXHTMLElementID).html(aHTML.join(''));
									}
									
									var aHTML = [];
									
									
									aHTML.push('<table id="tablens1blankspaceMainActionsSendEmail">';
									
									if (bShowTo)
									{

										aHTML.push('<tr><td id="tdns1blankspaceMainActionsSendEmail" class="ns1blankspaceMain">';
										
											aHTML.push('<table id="tablens1blankspaceMainActionsSendEmailColumn" cellspacing=0 cellpadding=0>';
									
											aHTML.push('<tr><td style="width:325px;font-size:0.875em;" id="tdns1blankspaceMainActionsSendEmailColumn1">';	
												
												aHTML.push('<table id="tablens1blankspaceMainActionsSendEmailTo">';				
															
												aHTML.push('<tr><td id="tdns1blankspaceMainActionsSendEmailTo" class="ns1blankspaceMain">' +
															'To:</td>';		
												
												aHTML.push('<td id="tdns1blankspaceMainActionsSendEmailToContact">' +
															'<input id="inputns1blankspaceMainActionsSendEmailToContact" class="inputns1blankspaceMainSelectContactEmail ns1blankspaceWatermark"' +
																' ondemandsetelementid="inputns1blankspaceMainActionsSendEmailTo" value="Search for contact here or type address below"';
															
												if (iContactBusiness != undefined)
												{
													aHTML.push(' onDemandContactBusiness="' + iContactBusiness + '"'
												}

												aHTML.push('></td></tr>';				

												aHTML.push('<tr><td colspan=2 id="tdns1blankspaceMainActionsSendEmailToValue" >' +
															'<textarea style="height:30px" rows="3" cols="25" id="inputns1blankspaceMainActionsSendEmailTo" class="inputns1blankspaceMainText"></textarea>' +
															'</td></tr>';
											
												aHTML.push('<tr><td id="tdns1blankspaceMainActionsSendEmailCc" class="ns1blankspaceMain">' +
															'Cc:</td>';		
												
												aHTML.push('<td id="tdns1blankspaceMainActionsSendEmailCcContact">' +
															'<input id="inputns1blankspaceMainActionsSendEmailCcContact" class="inputns1blankspaceMainSelectContactEmail ns1blankspaceWatermark"' +
																' ondemandsetelementid="inputns1blankspaceMainActionsSendEmailCc" value=""';
															
												if (iContactBusiness != undefined)
												{
													aHTML.push(' onDemandContactBusiness="' + iContactBusiness + '"'
												}

												aHTML.push('></td></tr>';				

												aHTML.push('<tr><td colspan=2 id="tdns1blankspaceMainActionsSendEmailCcValue">' +
															'<textarea style="height:30px" rows="3" cols="25" onDemandType="TEXTMULTI" id="inputns1blankspaceMainActionsSendEmailCc" class="inputns1blankspaceMainText"></textarea>' +
															'</td></tr>';
											
												aHTML.push('<tr><td id="tdns1blankspaceMainActionsSendEmailBcc" class="ns1blankspaceMain">' +
															'Bcc:</td>';		
												
												aHTML.push('<td id="tdns1blankspaceMainActionsSendEmailBccContact">' +
															'<input id="inputns1blankspaceMainActionsSendEmailBccContact" class="inputns1blankspaceMainSelectContactEmail ns1blankspaceWatermark"' +
																' ondemandsetelementid="inputns1blankspaceMainActionsSendEmailBcc" value=""';
															
												if (iContactBusiness != undefined)
												{
													aHTML.push(' onDemandContactBusiness="' + iContactBusiness + '"'
												}

												aHTML.push('></td></tr>';				

												aHTML.push('<tr><td colspan=2 id="tdns1blankspaceMainActionsSendEmailBccValue">' +
															'<textarea style="height:30px" rows="3" cols="25" onDemandType="TEXTMULTI" id="inputns1blankspaceMainActionsSendEmailBcc" class="inputns1blankspaceMainText"></textarea>' +
															'</td></tr>';
											
												aHTML.push('</table>';				
												
											aHTML.push('<td width="20px;">&nbsp;</td>';	

											aHTML.push('<td id="tdns1blankspaceMainActionsSendEmailColumn2">';	

											aHTML.push('<table id="tablens1blankspaceMainActionsSendEmailAttach">';				
															
												aHTML.push('<tr><td id="tdns1blankspaceMainActionsSendEmailAttachCaption" class="ns1blankspaceMain">' +
															'Attachments</td>';		
											
												aHTML.push('<td id="tdns1blankspaceMainActionsSendEmailMessageAttach" class="ns1blankspaceMainRight">';
											
												aHTML.push('<div id="divns1blankspaceMainActionsSendEmailMessageAttach">' +
															'<input type="checkbox" id="spanns1blankspaceMainSendEmailAttach" class="ns1blankspaceViewport"/>' +
															'<label style="font-size:0.875em;" for="spanns1blankspaceMainSendEmailAttach">&nbsp;</label>' +
															'</div>';
											
												aHTML.push('</td></tr>';				

												aHTML.push('<tr><td style="height:80px" colspan=2 id="tdns1blankspaceMainActionsSendEmailAttachments" class="ns1blankspaceBorder">' +
															'</td></tr>';
											
												aHTML.push('</table>';				
											
											aHTML.push('</td></tr>';						
												
											aHTML.push('</table>';					
												
										aHTML.push('</td></tr>';				
									}
									
									aHTML.push('<tr><td id="tdns1blankspaceMainActionsSendEmailSubjectValue">';
									
										aHTML.push('<table id="tablens1blankspaceMainActionsSendEmailSubjectOptions">';				
															
											aHTML.push('<tr><td id="tdns1blankspaceMainActionsSendEmailSubject" class="ns1blankspaceMain">' +
														'<input onDemandType="TEXT" id="inputns1blankspaceMainActionsSendEmailSubject" class="inputns1blankspaceMainText ns1blankspaceWatermark"' +
															' value="Subject">' +
														'</td>';	
											
											if (bShowPriority)
											{
												aHTML.push('<td style="width:150px" id="tdns1blankspaceMainSendEmailHighPriority" class="ns1blankspaceMainRight">' +
																'&nbsp; <input type="checkbox" id="inputns1blankspaceMainSendEmailHighPriority"/>&nbsp;High Priority?<td>';
											}
										
											aHTML.push('</tr>';				
												
										aHTML.push('</table>';				
									
									aHTML.push('</td></tr>';
									
									aHTML.push('<tr><td id="tdns1blankspaceMainActionsSendEmailMessageValue" class="ns1blankspaceMain">' +
														'<textarea rows="10" cols="35" onDemandType="TEXTMULTI" id="inputns1blankspaceMainActionsSendEmailMessage" class="inputns1blankspaceMainTextMultiLarge"></textarea>' +
														'</td></tr>';
									
									aHTML.push('</table>';						
									
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
													ns1blankspaceMessagingSendEmailSend({
														subject: $('#inputns1blankspaceMainActionsSendEmailSubject').val(),
														message: $('#inputns1blankspaceMainActionsSendEmailMessage').val(),
														priority: ($('#inputns1blankspaceMainSendEmailHighPriority').attr('checked')?3:2),
														});
													$( this ).dialog( "close" );
													
												}
											}
										});
									}	
									else
									{
									
										if (tinyMCE.getInstanceById('inputns1blankspaceMainActionsSendEmailMessage'))
										{
											tinyMCE.get('inputns1blankspaceMainActionsSendEmailMessage').remove();
											$('#inputns1blankspaceMainActionsSendEmailMessage').remove();
										}	
									
										$('#tdns1blankspaceMainSendEmailColumn1').html(aHTML.join(''));
										
										var aHTML = [];
											
										
										aHTML.push('<table id="tablens1blankspaceMainSendEmailColumn2" class="ns1blankspaceMainColumn2">';
										
										aHTML.push('<tr><td id="tdns1blankspaceMainSendEmailAdd" class="ns1blankspaceMainAction">' +
														'<span id="spanns1blankspaceMainSendEmailAdd">Send</span>' +
														'</td></tr>';
																
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainSendEmailColumn2').html(aHTML.join(''));
									
										$('#spanns1blankspaceMainSendEmailAdd').button(
										{
											label: "Send"
										})
										.click(function() {
										
											if (oParam != undefined)
											{
												oParam.subject = $('#inputns1blankspaceMainActionsSendEmailSubject').val();
												oParam.message = tinyMCE.get('inputns1blankspaceMainActionsSendEmailMessage').getContent();
												oParam.contactPersonTo = $('#inputns1blankspaceMainActionsSendEmailTo').attr('onDemandID');
												oParam.to = $('#inputns1blankspaceMainActionsSendEmailTo').val();
												oParam.cc = $('#inputns1blankspaceMainActionsSendEmailCc').val();
												oParam.bcc = $('#inputns1blankspaceMainActionsSendEmailBcc').val();
											}
											else
											{
												oParam = {
														subject: $('#inputns1blankspaceMainActionsSendEmailSubject').val(),
														message: tinyMCE.get('inputns1blankspaceMainActionsSendEmailMessage').getContent(),
														contactPersonTo: $('#inputns1blankspaceMainActionsSendEmailTo').attr('onDemandID'),
														to: $('#inputns1blankspaceMainActionsSendEmailTo').val(),
														cc: $('#inputns1blankspaceMainActionsSendEmailCc').val(),
														bcc: $('#inputns1blankspaceMainActionsSendEmailBcc').val(),
														xhtmlElementID: sXHTMLElementID
														}
											}
										
											 ns1blankspaceMessagingSendEmailSend(oParam);
										})
									
										$('#spanns1blankspaceMainSendEmailAttach').button(
										{
											text: false,
											icons:	{
														primary: "ui-icon-plus"
													}
										})
										.click(function() {
										
											ns1blankspaceMessagingSendEmailAttachShow(oParam);
										})
										.css('width', '20px')
										.css('height', '23px')
										.css('font-size', '0.75em')	
										
										if (ns1blankspace.objectContextData != undefined && iSource == 1)
										{
											var sTo = '';
										
											var aHTML = [];
												
										
											aHTML.push('<br />';
											
											$.each(ns1blankspace.messaging.emailAccounts, function() 
											{ 
												if (this.id == ns1blankspace.messaging.account)
												{
													aHTML.push(this.footer + '<br />';
												}
											});
												
											if (ns1blankspace.objectContextData != undefined)
											{
												if (bForward)
												{
													$('#inputns1blankspaceMainActionsSendEmailSubject').val('Fw: ' + ns1blankspace.objectContextData.subject)
												}
												else
												{
													$('#inputns1blankspaceMainActionsSendEmailSubject').val('Re: ' + ns1blankspace.objectContextData.subject)
												}	
												
												$('#inputns1blankspaceMainActionsSendEmailSubject').removeClass('ns1blankspaceWatermark');
												
												
												aHTML.push('<br />---- Original Message ----<br />';
												aHTML.push('<table style="background-color:#f5f5f5;width:100%;color:black;">';
												aHTML.push('<tr><td><strong>From:</strong> ' + ns1blankspace.objectContextData.from + '</td></tr>';
												
												aHTML.push('<tr><td><strong>To:</strong> ';	
												
												var sOrgTo = ns1blankspace.objectContextData.to;
												var aOrgTo = sOrgTo.split('|')
												
												sOrgTo = '';
										
												$.each(aOrgTo, function(i)
												{
													if (i % 2 !== 0) {sOrgTo += this + '; '}		
												});				
												
												aHTML.push(sOrgTo + '</td></tr>';
												
												var sOrgCc = ns1blankspace.objectContextData.cc;
												
												if (sOrgCc != '')
												{
													aHTML.push('<tr><td><strong>CC:</strong> ';	
													var aOrgCc = sOrgCc.split('|')
													sOrgCc = '';
											
													$.each(aOrgCc, function()
													{
														if (i % 2 !== 0) {sOrgCc += this + '; '}	
													});			
													
													aHTML.push(sOrgCc + '</td></tr>';
												}
												
												var sDate = new Date(ns1blankspace.objectContextData.date);	
												sDate = $.fullCalendar.formatDate(sDate, 'd MMM yyyy h:mm TT');
										
												aHTML.push('<tr><td><strong>Sent:</strong> ' + sDate + '</td></tr>';	
												aHTML.push('<tr><td><strong>Subject:</strong> ' + ns1blankspace.objectContextData.subject + '</td></tr>';	
												
												aHTML.push('</table>';
												
												$('#inputns1blankspaceMainActionsSendEmailMessage').val(aHTML.join('') + ns1blankspaceFormatXHTML(ns1blankspace.objectContextData.message));
										
												if (!bForward)
												{
													if (ns1blankspace.objectContextData.from != '')
													{
														var sFrom = ns1blankspace.objectContextData.from;
													}
										
													if (ns1blankspace.objectContextData.to != '' && bReplyAll)
													{			
														sTo = ns1blankspace.objectContextData.to;
														var aTo = sTo.split('|');
														sTo = '';
													
														$.each(aTo, function(i)
														{
															if (i % 2 !== 0) 
															{
																if (this != ns1blankspace.user.email && this != sFrom)
																{	
																	sTo += this + '; ';
																}
															}		
														});	
													}
										
													sTo = sFrom + '; ' + sTo;
												}	
									
												$('#inputns1blankspaceMainActionsSendEmailTo').val(sTo)
									
												if (ns1blankspace.objectContextData.attachments != '' && bForward && ns1blankspace.messaging.action == -1)
												{
													if (ns1blankspace.objectContextData.sourcetypetext == "EMAIL")
													{
														var sParam = '/ondemand/messaging/?method=MESSAGING_EMAIL_ATTACHMENT_MANAGE&rf=TEXT';
														var sData = 'account=' + ns1blankspace.messaging.account;
														sData += '&id=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
														
														$.ajax(
														{
															type: 'POST',
															url: sParam,
															data: sData,
															dataType: 'text',
															success: function(data) 
															{
																var aReturn = data.split('|');
																ns1blankspace.messaging.action = aReturn[1];
																ns1blankspaceMessagingSendEmailAttachments();
															}
														});
													}
													
													if (ns1blankspace.objectContextData.sourcetypetext == "ACTION")
													{
														var sParam = '/ondemand/messaging/?method=MESSAGING_EMAIL_DRAFT_MANAGE&new=1&rf=TEXT';
														var sData = 'copyaction=' + ns1blankspace.objectContextData.id;
														
														$.ajax(
														{
															type: 'POST',
															url: sParam,
															data: sData,
															dataType: 'text',
															success: function(data) 
															{
																var aReturn = data.split('|');
																ns1blankspace.messaging.action = aReturn[2];
																ns1blankspaceMessagingSendEmailAttachments();
															}
														});
													}
													
												}	
												else
												{
													ns1blankspaceMessagingSendEmailAttachments();
												}		
											}	
										}
										
										if (iSource == 2)
										{
											var sFooter = '<br />';
											
											$.each(ns1blankspace.messaging.emailAccounts, function() 
											{ 
												if (this.id == ns1blankspace.messaging.account)
												{
													sFooter = this.footer + '<br />';
												}
											});
											
											$('#inputns1blankspaceMainActionsSendEmailMessage').val(sFooter + sMessage)
										}
										
										if (iSource == 3)
										{
											$('#inputns1blankspaceMainActionsSendEmailSubject').val(sSubject)
											$('#inputns1blankspaceMainActionsSendEmailSubject').removeClass('ns1blankspaceWatermark');
											$('#inputns1blankspaceMainActionsSendEmailMessage').val(sMessage)
										}
										
										if (ns1blankspace.option.richTextEditing)
										{
											tinyMCE.execCommand('mceAddControl', false, 'inputns1blankspaceMainActionsSendEmailMessage');
										}	
									}
								},

					attachments: {
									attach:		function ns1blankspaceMessagingSendEmailAttachShow(oParam, sReturn)
												{
													
													sXHTMLElementID = "tdns1blankspaceMainActionsSendEmailAttachCaption";
													
													if (!$('#spanns1blankspaceMainSendEmailAttach').attr('checked'))
													{
														$(ns1blankspace.xhtml.container).hide()
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
																	ns1blankspaceMessagingSendEmailAttachShow(oParam, data)
																}
															});
														
														}
														else
														{
															var aReturn = sReturn.split('|');
															
															var aHTML = [];
															
														
															ns1blankspaceOptionsSetPosition(sXHTMLElementID)
														
															ns1blankspace.messaging.action = aReturn[1];
														
															aHTML.push('<table class="ns1blankspaceDropDown" style="width:287px;">';
															aHTML.push('<tbody>';
															aHTML.push('<tr><td id="tdns1blankspaceMainActionsSendEmailAttachmentsUpload" class="ns1blankspaceMain">' +
																				ns1blankspaceAttachmentsUpload({object: 17, objectContext: aReturn[1], label: ''})	
																			'</td></tr>';
															aHTML.push('</tbody></table>';			

															$(ns1blankspace.xhtml.container).html(aHTML.join(''));	
															
															$('#spanns1blankspaceMainUpload').button(
															{
																label: "Upload"
															})
															.click(function() {
																 ns1blankspaceAttachmentsUploadProcess({functionPostUpdate: ns1blankspaceMessagingSendEmailAttachments});
															})
															
														}					
													}	
												}

									show: 		function ns1blankspaceMessagingSendEmailAttachments(oParam, oResponse)
												{	
													var aHTML = [];
													
													var sXHTMLElementID = "tdns1blankspaceMainActionsSendEmailAttachments";
													
													if (oParam != undefined)
													{
														if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
														if (oParam.action != undefined) {ns1blankspace.messaging.action = oParam.action}
													}
													
													$(ns1blankspace.xhtml.container).hide();
													
													$('#spanns1blankspaceMainSendEmailAttach').attr('checked', false)
													$('#spanns1blankspaceMainSendEmailAttach').button("refresh");
													
													if (ns1blankspace.messaging.action != -1)
													{
														if (oResponse == undefined)
														{
															var sParam = 'method=CORE_ATTACHMENT_SEARCH' +
																			'&object=17' + 
																			'&objectcontext=' + ns1blankspace.messaging.action;
															
															$.ajax(
															{
																type: 'GET',
																url: '/ondemand/core/?' + sParam,
																dataType: 'json',
																success: function(data) {ns1blankspaceMessagingSendEmailAttachments(oParam, data)}
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
																aHTML.push('<table style="width:100%">';
																aHTML.push('<tbody>'
																
																$.each(oResponse.data.rows, function()
																{
																	aHTML.push('<tr class="ns1blankspaceAttachments">';
																	aHTML.push('<td style="font-size:0.75em;color:black;font-weight:normal;width:100%" id="tdAttachment-filename-' + this.id + '" class="ns1blankspaceMainRow">' + this.filename + '</td>';
																	aHTML.push('<td style="width:20px;" id="tdAttachment_delete-' + this.attachment + '" class="ns1blankspaceMainRowOptionDelete">&nbsp;</td>';
																	aHTML.push('</tr>'
																});
																
																aHTML.push('</tbody></table>';

																$('#' + sXHTMLElementID).html(aHTML.join(''));
																
																$('.ns1blankspaceMainRowOptionDelete').button({
																	text: false,
																	 icons: {
																		 primary: "ui-icon-close"
																	}
																})
																.click(function() {
																	ns1blankspaceMessagingSendEmailAttachmentsRemove(this.id)
																})
																.css('width', '15px')
																.css('height', '20px')
																
															}
														}
													}	
												},

									remove: 	function ns1blankspaceMessagingSendEmailAttachmentsRemove(sXHTMLElementId)
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
														
												},

									send:		function ns1blankspaceMessagingSendEmailSend(oParam)
												{
													var sParam = '/ondemand/messaging/?method=MESSAGING_EMAIL_SEND';
													var sData = '';
													var fFunctionPostSend;
													var sXHTMLElementID = 'divns1blankspaceMainEdit';
													
													if (oParam.object == undefined) {oParam.object = ns1blankspace.object}
													if (oParam.objectContext == undefined) {oParam.objectContext = ns1blankspace.objectContext}
													
													if (oParam != undefined)
													{
														if (oParam.functionPostSend != undefined) {fFunctionPostSend = oParam.functionPostSend}
														if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
													}	
													
													//sData += 'object=' + oParam.object;
													//sData += '&objectcontext=' + oParam.objectContext;
													sData += 'subject=' + encodeURIComponent((oParam.subject==undefined?'':oParam.subject));
													sData += '&message=' + encodeURIComponent((oParam.message==undefined?'':oParam.message));
													//sData += '&priority=' + inferfaceMasterFormatSave((oParam.priority==undefined?'':oParam.priority));
													sData += '&id=' + encodeURIComponent((oParam.contactPersonTo==undefined?'':oParam.contactPersonTo));
													sData += '&to=' + encodeURIComponent((oParam.to==undefined?'':oParam.to));
													sData += '&cc=' + encodeURIComponent((oParam.cc==undefined?'':oParam.cc));
													sData += '&bcc=' + encodeURIComponent((oParam.bcc==undefined?'':oParam.bcc));
													
													sData += (oParam.otherData==undefined?'':oParam.otherData)
														  
													$.ajax(
													{
														type: 'POST',
														url: sParam,
														data: sData,
														dataType: 'text',
														success: function(data) 
														{
															ns1blankspaceStatus('Email sent');
															$('#' + sXHTMLElementID).html('<span><br />Email has been sent.</span>');
															$('#tdns1blankspaceMessagingEmailViewport').html('');
															if (fFunctionPostSend != undefined) {fFunctionPostSend()};
														}
													});
												}
								}
				},
								
	remove: 	function ns1blankspaceMessagingEmailRemove(sXHTMLElementId)
				{
					var aSearch = sXHTMLElementId.split('_id_');
					var sElementId = aSearch[0];
					var sSearchContext = aSearch[1];
						
					sSearchContext = sSearchContext.replace(/\___/g, '.');	
						
					var sParam = 'method=MESSAGING_EMAIL_CACHE_MANAGE&remove=1';
					var sData = 'id=' + ns1blankspace.util.fs(sSearchContext);
								
					$.ajax(
						{
							type: 'POST',
							url: '/ondemand/messaging/?' + sParam,
							data: sData,
							dataType: 'text',
							success: function(data)
										{
											if (ns1blankspace.messaging.showRemoved)
											{
													$('#' + sXHTMLElementId).button({disabled: true});
											}
											else
											{
												$('#' + sXHTMLElementId).parent().parent().fadeOut(500);
											}	
										}
						});
				},

	markAsRead: function ns1blankspaceMessagingEmailRead(sXHTMLElementId)
				{
					var aSearch = sXHTMLElementId.split('_id_');
					var sElementId = aSearch[0];
					var sSearchContext = aSearch[1];
						
					if ($('#' + sXHTMLElementId).parent().hasClass('ns1blankspaceMainBold'))	
					{
							
						sSearchContext = sSearchContext.replace(/\___/g, '.');	
						
						var sParam = 'method=MESSAGING_EMAIL_CACHE_MANAGE&flags=(\\SEEN)';
						var sData = 'account=' + ns1blankspace.messaging.account;
						sData += '&id=' + ns1blankspace.util.fs(sSearchContext);
								
						$.ajax(
							{
								type: 'POST',
								url: '/ondemand/messaging/?' + sParam,
								data: sData,
								dataType: 'text',
								success: function(data)
											{
												ns1blankspace.messaging.emailRead.push(sSearchContext);
											}
							});
					}		
				},

	new: 		function ns1blankspaceMessagingNew(oParam, oResponse)
				{
					var aHTML = [];
					
					var sXHTMLElementID = 'divns1blankspaceMain';

					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}	
					
					$('#' + sXHTMLElementID).html(ns1blankspace.xhtml.loading);
					$('#tdns1blankspaceMessagingEmailViewport').html('');
					
					if (oResponse == undefined)
					{
						var sParam = 'method=MESSAGING_EMAIL_DRAFT_SEARCH';

						$.ajax(
						{
							type: 'GET',
							url: '/ondemand/messaging/?' + sParam,
							dataType: 'json',
							success: function(data) {ns1blankspaceMessagingNew(oParam, data)}
						});
					}	
					else	
					{		
						if (oResponse.data.rows.length == 0)
						{
							ns1blankspaceMessagingSendEmail(oParam);
						}
						else
						{
						
							aHTML.push('<table id="tablens1blankspaceMainNew" class="ns1blankspaceMain">';
							aHTML.push('<tr id="trns1blankspaceMainNewRow1" class="ns1blankspaceMainRow1">' +
										'<td id="tdns1blankspaceMainNewColumn1Large" class="ns1blankspaceMainColumn1Large">' +
										ns1blankspace.xhtml.loading + '</td>' +
										'<td id="tdns1blankspaceMainNewColumn2Action" style="width:150px;" class="ns1blankspaceMainColumn2Action">' +
										'</td>' +
										'</tr>';
							aHTML.push('</table>';				
						
							$('#' + sXHTMLElementID).html(aHTML.join(''));
						
							var aHTML = [];
							
							
							aHTML.push('<table id="tablens1blankspaceMainNewsGroupsColumn2" class="ns1blankspaceMainColumn2">';
									
							aHTML.push('<tr><td id="tdns1blankspaceMainSend" class="ns1blankspaceMainAction">' +
											'<span id="spanns1blankspaceMainBlank">Create Blank</span>' +
											'</td></tr>';
											
							aHTML.push('</table>';					
						
							$('#tdns1blankspaceMainNewColumn2Action').html(aHTML.join(''));
						
							$('#spanns1blankspaceMainBlank').button(
							{
								label: "Blank"
							})
							.click(function() {
								ns1blankspaceMessagingSendEmail(oParam);
							})
							.css('width', '75px')
						
							var aHTML = [];
							
							
							aHTML.push('<table style="width:100%">';
							aHTML.push('<tbody>';
							aHTML.push('<tr><td class="ns1blankspaceMainCaption">Saved Drafts</td></tr>';
							
							aHTML.push('<table style="width:100%">';
							aHTML.push('<tbody>';
						
							oResponse.data.rows.each(function() {
							
								if (this.subject.text() != '')
								{
									aHTML.push('<tr><td id="tdMessagingDrafts_subject-' + $(this).find('id').text() + 
												'"class="ns1blankspaceMainRow ns1blankspaceMainRowSelect">' + this.subject + '</td></tr>';
								}				
							})
							
							aHTML.push('</tbody></table>';
							
							$('#tdns1blankspaceMainNewColumn1Large').html(aHTML.join(''));
						
							$('.ns1blankspaceMainRowSelect').click(function() {
							
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
										oParam.message = oResponse.data.rows[0].message;
										oParam.subject = oResponse.data.rows[0].subject;
										oParam.source = 3;
										ns1blankspaceMessagingSendEmail(oParam);
									}
								});
							})
						}
					}	
				},

	save: 		function ns1blankspaceMessagingEmailSave(oParam)
				{
					var iStep = 1;
					var sXHTMLElementID = '';
					var sMessageId;
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.step != undefined) {iStep = oParam.step}
					}
					else
					{
						oParam = {};
					}
					
					var sID = sXHTMLElementID;
					sID = sID.replace(/\___/g, '.');
					
					var aID = sID.split('_id_');
					sMessageId = aID[1];
					
					$(ns1blankspace.xhtml.container).attr('data-initiator', sXHTMLElementID)
					
					if (iStep == 1)
					{
					
						ns1blankspaceOptionsPosition({xhtmlElementID: sXHTMLElementID, leftOffset:-75});
						
						var aHTML = [];
						
						
						aHTML.push('<table id="tableMessagingEmailSaveOption" style="width:75px;" class="ns1blankspaceDropDown">';
						
						aHTML.push('<tr><td id="tdns1blankspaceMessagingEmailSaveOptionJustSave" class="ns1blankspaceMainAction">' +
										'<span id="spanns1blankspaceMessagingEmailSaveOptionJustSave">Save</span>' +
										'</td></tr>';
						
						aHTML.push('</table>';					
					
						$(ns1blankspace.xhtml.container).html(aHTML.join(''))
						
						$('#spanns1blankspaceMessagingEmailSaveOptionJustSave').button(
						{
							label: "Save"
						})
						.click(function() {
							$('#spanns1blankspaceMessagingEmailSaveOptionJustSave').html(ns1blankspace.xhtml.loadingSmall);
							oParam.step = 2
							ns1blankspaceMessagingEmailSave(oParam);
							
						})
						.css('width', '75px')
					
						$('#spanns1blankspaceMessagingEmailSaveOptionSaveAsToDo').button(
						{
							label: "To Do"
						})
						.click(function() {
							oParam.step = 3
							ns1blankspaceMessagingEmailSave(oParam);
						})
						.css('width', '75px')
					
					}

					if (iStep == 2)
					{
						var sParam = 'method=MESSAGING_EMAIL_ACTION_MANAGE';
						sParam += '&account=' + ns1blankspace.messaging.account;
						sParam += '&messageid=' + encodeURIComponent(sMessageId);
						
						$.ajax(
						{
							type: 'GET',
							url: '/ondemand/messaging/',
							data: sParam,
							dataType: 'json',
							success: function(data)
										{
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
											$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
										}
						});	
					}
				},

	actions: 	{
					show: 		function ns1blankspaceMessagingActions(oParam, oResponse)
								{

									var sXHTMLElementID = 'divns1blankspaceMainActionsSent';
									
									var iType = 5 //Email Sent

									if (oResponse == undefined)
									{
										$('#spanns1blankspaceMainHeaderSentEmails').html(ns1blankspace.xhtml.loadingSmall);
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'ACTION_SEARCH';
										oSearch.addField('actionreference,actiontypetext,duedate');
										oSearch.rf = 'json';
										oSearch.addFilter('actiontype', 'EQUAL_TO', iType);
										oSearch.sort('modifieddate', 'desc');
										oSearch.getResults(function(data) {ns1blankspaceMessagingActions(oParam, data)}); 
									}
									else
									{
										var aHTML = [];
										
											
										$('#spanns1blankspaceMainHeaderSentEmails').html('Sent&nbsp;emails');
										
										if (oResponse.data.rows.length == 0)
										{
										
										}
										else
										{
											aHTML.push('<table border="0" class="ns1blankspaceSearchMedium">';
											aHTML.push('<tbody>'
											
											$.each(oResponse.data.rows, function() 
											{
												aHTML.push('<tr class="ns1blankspaceSearch">';
												aHTML.push('<td id="tdAction_subject-' + this.id + '" class="ns1blankspaceSearch">' +
																this.actionreference + '</td>';
																
												aHTML.push('<td id="tdAction_date-' + this.id + '" class="ns1blankspaceSearch">' +
																this.duedate + '</td>';
												
												aHTML.push('</tr>'
											});
								    	
											aHTML.push('</tbody></table>';

											$(ns1blankspace.xhtml.container).html(ns1blankspacePagination(
												   {
													html: aHTML.join(''),
													more: (oResponse.morerows == "true")
												   }) );
										
											$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
											ns1blankspacePaginationBind(
											{
												columns: 'actionreference-duedate',
												more: oResponse.moreid,
												rows: 20,
												startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows)
											});   
										
											//functionSearch: ns1blankspaceMessagingActions
										}
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).hide();
											ns1blankspaceMessagingActionSearch({xhtmlElementID: event.target.id});
										});
									}
								},

				send:			function ns1blankspaceMessagingActionSearch(oParam, oResponse)
								{
									var aHTML = [];
									
									var sXHTMLElementID;
									var sTargetXHTMLElementID = 'divns1blankspaceMainSummary';
									var bSetContext = true;

									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.targetXHTMLElementID != undefined) {sTargetXHTMLElementID = oParam.targetXHTMLElementID}
										if (oParam.setContext != undefined) {bSetContext = oParam.setContext}
									}	

									var aSearch = sXHTMLElementID.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									
									if (bSetContext) {ns1blankspaceMainViewportShow("#divns1blankspaceMainSummary", true)};
									
									if (oResponse == undefined)
									{
										ns1blankspace.messaging.action = -1;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'ACTION_SEARCH';
										oSearch.addField('actionreference,duedatetime,text');
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										oSearch.addFilter('actiontype', 'EQUAL_TO', 5);				
										oSearch.getResults(function(data) {ns1blankspaceMessagingActionSearch(oParam, data)});
									}
									else
									{
										ns1blankspaceViewportDestination({
											newDestination: 'ns1blankspaceMessagingMasterViewport({autoShow: false});ns1blankspaceMessagingActionSearch({xhtmlElementID: "-' + sSearchContext + '"})',
											move: false
											})
												
										if (bSetContext) {ns1blankspace.objectContextData = oResponse.data.rows[0]};
										
										if (oResponse.data.rows.length != 0)
										{
										
											var oRow = oResponse.data.rows[0];
											
											goObjectContact = {};
											
											ns1blankspace.objectContextData.id = sSearchContext;
											ns1blankspace.objectContextData.subject = oRow.actionreference;
											ns1blankspace.objectContextData.date = oRow.duedatetime;
											ns1blankspace.objectContextData.message = oRow.text;
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'ACTION_EMAIL_RECIPIENT_SEARCH';
											oSearch.addField('type,email,name');
											oSearch.rf = 'json';
											oSearch.addFilter('action', 'EQUAL_TO', sSearchContext);		
											oSearch.getResults(function(data) {ns1blankspaceMessagingActionSearchShow(oParam, data)});
										}
									}
								},
									
				process:		function ns1blankspaceMessagingActionSearchShow(oParam, oResponse)
								{	
									var aHTML = [];
									
									var sXHTMLElementID;
									var sTargetXHTMLElementID = 'divns1blankspaceMainSummary';
									var bSetContext = true;

									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.targetXHTMLElementID != undefined) {sTargetXHTMLElementID = oParam.targetXHTMLElementID}
										if (oParam.setContext != undefined) {bSetContext = oParam.setContext}
									}	
									
									var aTo = [];
									var aCC = [];
									
									$.each(oResponse.data.rows, function(index)
									{	
										if (this.type == 1) {ns1blankspace.objectContextData.from = this.email; ns1blankspace.objectContextData.fromname = this.name;}
										if (this.type == 2) {aTo.push(this.name); aTo.push(this.email)}
										if (this.type == 3) {aCC.push(this.name); aCC.push(this.email)}
									});
									
									ns1blankspace.objectContextData.to = aTo.join('|');
									ns1blankspace.objectContextData.cc = aCC.join('|');
									ns1blankspace.objectContextData.attachments = '';
										
									aHTML.push('<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMainHeader">';
									aHTML.push('<tbody>'
									
									aHTML.push('<tr class="ns1blankspaceMainHeader">' +
													'<td style="text-align:left;font-weight:bold" class="ns1blankspaceMessagingHeader" id="ns1blankspaceMessagingHeader">' +
													ns1blankspace.objectContextData.subject + '</td>';
									
									var sDate = new Date(ns1blankspace.objectContextData.date);	
									sDate = $.fullCalendar.formatDate(sDate, 'd MMM yyyy h:mm TT');

									aHTML.push('<td style="text-align:right;" class="ns1blankspaceMessagingSubHeader" id="ns1blankspaceMessagingHeaderDate">' +
													sDate + '</td>';
									aHTML.push('</tr>';
									
									aHTML.push('<tr class="ns1blankspaceMainHeader">' +
													'<td colspan=2 style="text-align:left;" class="ns1blankspaceMessagingSubHeader" id="ns1blankspaceMainHeaderFromEmail">' +
													ns1blankspace.objectContextData.from + '</td>';
									
									aHTML.push('</tr>';
									
									aHTML.push('</tbody></table>';
									
									if (ns1blankspace.objectContextData.to != '')
									{
										aHTML.push('<table id="tableMessagingEmailsHeaderTo" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMainHeader">';
										aHTML.push('<tbody>'
										aHTML.push('<tr class="ns1blankspaceMainHeaderTo">' +
														'<td style="text-align:left;" class="ns1blankspaceMainHeader" id="ns1blankspaceMainHeaderCC">';
														
										var sTo = ns1blankspace.objectContextData.to;
										var aTo = sTo.split('|');
										sTo = '';
									
										$.each(aTo, function(i)
										{
											if (i % 2 !== 0) {sTo += this + '; ';}
										});				
														
										aHTML.push('<span class="ns1blankspaceMessagingHeader">To:</span> ' + sTo;

										aHTML.push('</td></tr>';
										aHTML.push('</tbody></table>';
									}
									
									if (ns1blankspace.objectContextData.cc != '')
									{
										aHTML.push('<table id="tableMessagingEmailsHeaderCC" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMainHeader">';
										aHTML.push('<tbody>'
										aHTML.push('<tr class="ns1blankspaceMainHeaderCC">' +
														'<td style="text-align:left;" class="ns1blankspaceMainHeader" id="ns1blankspaceMainHeaderCC">';
														
										var sCC = ns1blankspace.objectContextData.cc;
										var aCC = sCC.split('#');
										sCC = '';
									
										$.each(aCC, function(i)
										{
											if (i % 2 !== 0) {sCC += this + '; ';}
										});				
														
										aHTML.push('<span class="ns1blankspaceMessagingHeader">Cc:</span> ' + sCC;

										aHTML.push('</td></tr>';
										aHTML.push('</tbody></table>';
									}
									
									if (ns1blankspace.objectContextData.attachments != '')
									{
										aHTML.push('<table id="tableMessagingEmailsHeader" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMainHeader">';
										aHTML.push('<tbody>'
										aHTML.push('<tr class="ns1blankspaceMainHeader">' +
														'<td style="text-align:left;" class="ns1blankspaceMainHeader" id="ns1blankspaceMainHeaderAttachments">';
														
										var sAttachments = ns1blankspace.objectContextData.attachments;
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
														
										aHTML.push('<span class="ns1blankspaceMessagingHeader">Attachments:</span> ' + sAttachments;

										aHTML.push('</td></tr>';
										aHTML.push('</tbody></table>';
									}
									
									aHTML.push('<iframe style="display:block;height:10px;width:900px;" name="ifMessage" ' +
													'id="ifMessage" frameborder="0" border="0" scrolling="no"></iframe>';
													
									$('#' + sTargetXHTMLElementID).html(aHTML.join('')); 
									
									ns1blankspaceMessagingViewport(oParam);
										
									setTimeout("ns1blankspaceMessagingShowMessage()", 300);
								}
				}
}								