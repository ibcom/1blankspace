
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

					ns1blankspace.app.reset();

					ns1blankspace.object = 39;
					ns1blankspace.objectParentName = 'messaging';
					ns1blankspace.objectName = 'imap';
					ns1blankspace.viewName = 'Email';
					
					ns1blankspace.messaging.autoCheck = true;
					ns1blankspace.messaging.imap.emailAccounts = [];
					ns1blankspace.messaging.defaultRows = 25;
					ns1blankspace.messaging.imap.account = -1;
					ns1blankspace.messaging.emailRead = [];
					ns1blankspace.messaging.emailRemoved = [];
					ns1blankspace.messaging.showRemoved = false;
					ns1blankspace.messaging.emailInbox = [];
					ns1blankspace.messaging.emailInboxXHTML = [];
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
							height : "250px", 
							width : "100%",
							theme : "advanced",

							theme_advanced_path : false,
							theme_advanced_statusbar_location : "bottom",

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
							
							external_link_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH", 
							external_image_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext, 
							media_external_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext
						});				
					}
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainInbox" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainEdit" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActionsSent" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					ns1blankspace.messaging.imap.emailAccounts.length = 0;

					ns1blankspace.app.set(oParam);

					$('#ns1blankspaceViewControlNew').unbind('click');
					$('#ns1blankspaceViewControlNew').click(function(event)
					{
						ns1blankspace.messaging.imap.new();
					});

					var iAction;

					// 1 = Compose New

					if (oParam)
					{
						if (oParam.action !== undefined) {iAction = oParam.action}
					}

					if (iAction == 1)
					{
						ns1blankspace.messaging.imap.edit.show(oParam)
					}	

				},

	check:		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{	
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_CACHE_CHECK'),
							data: 'account=' + ns1blankspace.util.fs(ns1blankspace.messaging.imap.account),
							dataType: 'json',
							success: function(data) {ns1blankspace.messaging.imap.check(oParam, data)}
						});
					}
					else
					{
						if (oResponse.status == 'OK')
						{	
							ns1blankspace.messaging.emailNewCount = oResponse.newrows;

							if (ns1blankspace.messaging.emailNewCount != undefined)
							{
								$('#ns1blankspaceMessagingIMAPInboxRefresh').button(
								{
									label: 'Refresh (' + ns1blankspace.messaging.emailNewCount + ')'
								});
							}	
						}	
					}
				},			

	home:		function (oParam, oResponse)
				{
					var bAutoShow = true;

					if (oParam != undefined)
					{
						if (oParam.autoShow != undefined) {bAutoShow = oParam.autoShow}
					}	
					
					ns1blankspace.history.view({
							newDestination: 'ns1blankspace.messaging.imap.init({showHome: true});',
							move: false
							});	
			
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					
					if (ns1blankspace.messaging.imap.emailAccounts.length == 0)
					{
						if (oResponse == undefined)
						{
							var aHTML = [];
					
							$('#ns1blankspaceViewportControl').html(ns1blankspace.xhtml.loading);
							
							var sData = 'type=5';
							if (ns1blankspace.option.messagingEmailShowCount) {sData += '&advanced=1'}

							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_ACCOUNT_SEARCH'),
								data: sData,
								dataType: 'json',
								success: function(data) {ns1blankspace.messaging.imap.home(oParam, data)}
							});
						}
						else
						{
							var aHTML = [];
										
							aHTML.push('<table>');
							aHTML.push('<tr><td><div id="ns1blankspaceViewMessagingEmailLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
							aHTML.push('</table>');		
							
							ns1blankspace.messaging.imap.emailAccounts.length = 0;
							
							if (oResponse.data.rows.length != 0)
							{
								aHTML.push('<table style="padding-top:0px; padding-bottom:5px;" id="ns1blankspaceMessagingIMAPAccounts" class="ns1blankspaceControl">');
								
								$.each(oResponse.data.rows, function(index)
								{
									ns1blankspace.messaging.imap.emailAccounts.push({
										id: this.id,
										footer: (this.footer).formatXHTML()
									})		
									
									if (index == 0) 
									{
										ns1blankspace.messaging.imap.account = this.id;
									}
									else
									{
										ns1blankspace.messaging.imap.account = undefined;
									}
									
									var sDescription = this.email;
									var aDescription = sDescription.split("@");
										
									if (aDescription.length > 0) {sDescription = aDescription[0]}	
									
									aHTML.push('<tr><td id="ns1blankspaceMessaging-' + this.id + '" ' +
													'class="ns1blankspaceControl"' +
													' title="' + this.email + '">' +
													sDescription +
													'</td></tr>');
										
									if (ns1blankspace.option.messagingEmailShowCount)
									{	
										aHTML.push('<tr><td id="ns1blankspaceMessagingCount-' + this.id + '" ' +
														' class="ns1blankspaceControl ns1blankspaceSub">' +
														this.count + ' emails<br />' +
														'</td></tr>');		
									}	
								});
								
								aHTML.push('</table>');
								
								aHTML.push('<div id="ns1blankspaceMessagingMessageControlContainer"></div>');
								
								
							}
							else
							{
								aHTML.push('<table><tr><td class="ns1blankspaceNothing">No accounts set up.</td></tr></table>');
							}
							
							$('#ns1blankspaceControl').html(aHTML.join(''));	
						
							$('td.ns1blankspaceControl').click(function(event)
							{
								ns1blankspace.show({selector: '#ns1blankspaceMainInbox'});
								
								var sID = event.target.id
								var aID = sID.split('-');

								if (ns1blankspace.messaging.imap.account != aID[1])
								{
									ns1blankspace.messaging.imap.inbox.show({xhtmlElementID: event.target.id, source: 1, newOnly: false, repaginate:true});
								}	
							});
							
							if (ns1blankspace.messaging.imap.account != undefined && bAutoShow)
							{
								$('#ns1blankspaceMessaging-' + ns1blankspace.messaging.imap.account).addClass('ns1blankspaceHighlight');
								ns1blankspace.show({selector: '#ns1blankspaceMainInbox'});
								ns1blankspace.messaging.imap.inbox.show({xhtmlElementID: '-' + ns1blankspace.messaging.imap.account, source: 1, newOnly: false, refreshInbox: true, repaginate: true})
							}	
						}
					}	
				},

	inbox: 		{				
					show:		function (oParam, oResponse)
								{
									var sXHTMLElementID;
									var bNew;
									var iStart;
									var bRefresh = false;
									var bRebuild = true;
									
									if (oParam != undefined)
									{
										if (oParam.source != undefined) {iSource = oParam.source}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.newOnly != undefined) {bNew = oParam.newOnly}
										if (oParam.start != undefined) {iStart = oParam.start}
										if (oParam.refreshInbox != undefined) {bRefresh = oParam.refreshInbox}
										if (oParam.rebuild != undefined) {bRebuild = oParam.rebuild}
									}
									else
									{
										oParam = {};
									}	
									
									if (iStart == undefined && bNew == undefined) {bNew = true}
									
									$('#ns1blankspaceMessagingEmailViewport').html(''); //???
									
									if (sXHTMLElementID != undefined)
									{
										var aXHTMLElementID = sXHTMLElementID.split('-');
										
										if (ns1blankspace.messaging.imap.account != aXHTMLElementID[1]) 
										{
											bRefresh = true;
											oParam.refreshInbox = true;
										}
										ns1blankspace.messaging.imap.account = aXHTMLElementID[1];
									}	
									
									if (bRefresh) {ns1blankspace.messaging.imap.check()}
									
									if (bRebuild)
									{
										ns1blankspace.messaging.emailLastPagination = undefined;
										ns1blankspace.messaging.emailLastPage = 1;
										
										var aHTML = [];
										
										aHTML.push('<table id="ns1blankspaceMessagingIMAPHeaderContainer" class="ns1blankspaceContainer">');
										aHTML.push('<tr><td style="height:20px;" id="ns1blankspaceMessagingIMAPHeader">' + ns1blankspace.xhtml.loading + '</td></tr>');
										aHTML.push('<tr><td id="ns1blankspaceMessagingIMAPInboxContainer"></td></tr>');
										aHTML.push('</table>');

										$('#ns1blankspaceMainInbox').html(aHTML.join(''));
										
										if (ns1blankspace.timer.messaging != 0) {clearInterval(ns1blankspace.timer.messaging)};
								        if (ns1blankspace.messaging.autoCheck) {ns1blankspace.timer.messaging = setInterval("ns1blankspace.messaging.imap.check()", ns1blankspace.option.messagingCheckForNew)};
									}	
										
									if (ns1blankspace.messaging.imap.account != undefined && oResponse == undefined && bRefresh)
									{	
										ns1blankspace.status.working();

										var oSearch = new AdvancedSearch();
										oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
										oSearch.addField('messageid,to,cc,from,fromname,subject,date,' +
															'hasattachments,attachments,imapflags,detailscached');
										oSearch.addFilter('account', 'EQUAL_TO', ns1blankspace.messaging.imap.account);
										oSearch.addSummaryField('count(*) cachecount');
										oSearch.sort('date', 'desc')
										oSearch.rows = ns1blankspace.messaging.defaultRows;
										oSearch.getResults(function(data) {ns1blankspace.messaging.imap.inbox.show(oParam, data)});
									}
									else
									{
										ns1blankspace.status.message('Refreshed @ ' + Date.now().toString("h:mm tt"));

										ns1blankspace.messaging.emailCount = oResponse.summary.cachecount;
											
										if (bRebuild)
										{
											var aHTML = [];
											
											aHTML.push('<table class="ns1blankspace" style=>');
											aHTML.push('<tr>');

											aHTML.push('<td class="ns1blankspaceHeader">' +
															'<span id="ns1blankspaceMessagingIMAPInboxCount" class="ns1blankspaceSub">' +
																ns1blankspace.messaging.emailCount + ' emails</span>' +
																'</td>');
											
											aHTML.push('<td class="ns1blankspaceHeader" style="text-align:right;">' +
															'<span id="ns1blankspaceMessagingIMAPInboxRefresh" class="ns1blankspaceAction" style="margin-right:4px;">' +
																'Refresh</span>' +
															'<span id="ns1blankspaceMessagingInboxIMAPSentEmails" class="ns1blankspaceAction">' +
																'Sent&nbsp;emails</span></td>');

											aHTML.push('</tr>');
											aHTML.push('</table>');
											
											$('#ns1blankspaceMessagingIMAPHeader').html(aHTML.join(''));

											$('#ns1blankspaceMessagingIMAPInboxRefresh').button(
											{
													label: 'Refresh'
											})
											.click(function(event)
											{
												ns1blankspace.messaging.imap.inbox.show({xhtmlElementID: '-' + ns1blankspace.messaging.imap.account, source: 1, newOnly: false, refreshInbox: true, rebuild: false});
											});

											$('#ns1blankspaceMessagingInboxIMAPSentEmails').button(
											{
												label: 'Sent Emails'
											})
											.click(function(event)
											{
												ns1blankspace.container.position({xhtmlElementID: 'ns1blankspaceMessagingIMAPInboxSentEmails', leftOffset: -170, topOffset: -5});
												ns1blankspace.messaging.actions({xhtmlElementID: 'ns1blankspaceMessagingIMAPInboxSentEmails', type: 5})
											})

										}
				
										var aHTML = [];
										
										aHTML.push('<table id="ns1blankspaceMessagingIMAPInbox" class="ns1blankspaceMessagingIMAPInbox">');
										
										$.each(oResponse.data.rows, function()
										{
											aHTML.push(ns1blankspace.messaging.imap.inbox.row(this));
										});
										
										aHTML.push('</table>');
										
										ns1blankspace.render.page.show(
										{
											xhtmlElementID: 'ns1blankspaceMessagingIMAPInboxContainer',
											xhtmlContext: 'IMAPInbox',
											xhtml: aHTML.join(''),
											showMore: (oResponse.morerows == "true"),
											more: oResponse.moreid,
											rows: ns1blankspace.messaging.defaultRows,
											functionShowRow: ns1blankspace.messaging.imap.inbox.row,
											functionNewPage: 'ns1blankspace.messaging.imap.inbox.bind()',
											headerRow: false,
											bodyClass: 'ns1blankspaceMessagingIMAPInbox'
										}); 	
											
										ns1blankspace.messaging.imap.inbox.bind();
									}
								},

					row:		function (oRow)
								{
									var aHTML = [];
									
									var sID = oRow.id;
									
									var sDate = '';
									var sTime = '';

									var oDate = Date.parse(oRow.date);

									if (oDate != null)
									{ 
										var sDate = oDate.toString("d MMM yyyy");
										var sTime = oDate.toString("h:mm tt");
									}
										
									var sClass = '';
									
									if ((oRow.imapflags).indexOf('\\SEEN') == -1)
									{
										sClass = " ns1blankspaceNotSeen"
									}
									
									aHTML.push('<tr id="ns1blankspaceMessagingInbox_id-' + sID + '" class="ns1blankspaceRow' + sClass + '" data-cached="' + oRow.detailscached + '">');
									
									aHTML.push('<td id="ns1blankspaceMessagingInbox_from-' + sID + 
														'" style="cursor: pointer;" class="ns1blankspaceRow ns1blankspaceRowSelect' + sClass + '"' +
														' title="' + oRow.from + '" style="padding-right:5px;">' +
														oRow.fromname + '</td>');
														
									aHTML.push('<td id="ns1blankspaceMessagingInbox_subject-' + sID + 
														'" style="cursor: pointer; padding-right:5px;" class="ns1blankspaceRow ns1blankspaceMainRowSelect' + sClass + '">' +
														oRow.subject + '</td>');
									
									aHTML.push('<td id="ns1blankspaceMessagingInbox_date-' + sID + '" class="ns1blankspaceRow" style="width:85px; text-align:right;" >' +
															sDate + '<br /><span class="ns1blankspaceSub">' + sTime + '</span></td>');
									
									aHTML.push('<td class="ns1blankspaceRow" style="width:70px;text-align:right;">');

									aHTML.push('<span id="ns1blankspaceMessagingInbox_reply-' + sID + '" class="ns1blankspaceRowReply"></span>');
									
									if ((oRow.imapflags).indexOf('\\DELETED') == -1)
									{
										aHTML.push('<span id="ns1blankspaceMessagingInbox_remove-' + sID + '" class="ns1blankspaceRowRemove"></span>');
									}
									else
									{
										aHTML.push('<span style="width: 23px;" id="ns1blankspaceMessagingInbox_delete-' + sID +
														'" class="ns1blankspaceRowRemoveDisabled"></span>');
									}

									aHTML.push('<span id="ns1blankspaceMessagingInbox_save-' + sID + '" class="ns1blankspaceRowSave"></span>');
									
									aHTML.push('</td></tr>');
									
									return aHTML.join('');
								},

					bind:		function ()
								{
									$('td.ns1blankspaceRowSelect').click(function()
									{
										$('#ns1blankspaceMessagingInboxContainer td.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
										$('#' + this.id).parent().find('td').removeClass('ns1blankspaceNotSeen');
										ns1blankspace.messaging.imap.inbox.markAsRead(this.id);
										ns1blankspace.messaging.imap.search.send(this.id);
									});
										
									$('.ns1blankspaceRowRemove').button(
									{
										text: false,
										label: "Delete",
										icons: {
											 primary: "ui-icon-close"
										}
									})
									.click(function() {
										ns1blankspace.messaging.imap.remove(this.id)
									})
									.css('width', '15px')
									.css('height', '20px');
									
									$('.ns1blankspaceRowRemovedDisabled').button(
									{
										text: false,
										disabled: true,
										icons:
										{
											 primary: "ui-icon-close"
										}
									})
									.css('width', '15px')
									.css('height', '20px');
										
									$('.ns1blankspaceRowReply').button(
									{
										text: false,
										label: "Reply",
										icons: {
											 primary: "ui-icon-arrowreturnthick-1-w"
										}
									})
									.click(function() {
									
										$('td.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
										$('#' + this.id).parent().find('td').removeClass('ns1blankspaceBold');
										ns1blankspace.messaging.imap.read(this.id);
										ns1blankspace.messaging.imap.search.show(this.id, {reply: true});
									})
									.css('width', '15px')
									.css('height', '20px');
										
									$('.ns1blankspaceRowSave').button({
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
											ns1blankspace.messaging.imap.save({xhtmlElementID: this.id})
										}	
									})
									.css('width', '15px')
									.css('height', '20px');
								},

					remove: 	function (sXHTMLElementID)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
									var sSearchContext = aSearch[1];
										
									//sSearchContext = sSearchContext.replace(/\___/g, '.');	
																		
									$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_CACHE_MANAGE'),
											data: 'remove=1&id=' + ns1blankspace.util.fs(sSearchContext),
											dataType: 'text',
											success: function(data)
														{
															if (ns1blankspace.messaging.showRemoved)
															{
																	$('#' + sXHTMLElementID).button({disabled: true});
															}
															else
															{
																$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
															}	
														}
										});
								},

					markAsRead: function (sXHTMLElementID)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
									var sSearchContext = aSearch[1];
										
									if ($('#' + sXHTMLElementID).parent().hasClass('ns1blankspaceNotSeen'))	
									{
										//sSearchContext = sSearchContext.replace(/\___/g, '.');	
										
										var sData = '&imapflags=(\\SEEN)&account=' + ns1blankspace.messaging.imap.account;
										sData += '&id=' + ns1blankspace.util.fs(sSearchContext);
												
										$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_CACHE_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
															{
																ns1blankspace.messaging.emailRead.push(sSearchContext);
															}
											});
									}		
								},

					save: 		function (oParam)
								{
									var iStep = 1;
									var sXHTMLElementID = '';
									var sMessageID;
									
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
									//sID = sID.replace(/\___/g, '.');
									
									var aID = sID.split('-');
									sMessageId = aID[1];
									
									$(ns1blankspace.xhtml.container).attr('data-initiator', sXHTMLElementID)
									
									if (iStep == 1)
									{
										ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset:-75});
										
										var aHTML = [];
											
										aHTML.push('<table id="ns1blankspaceMessageSaveContainer" class="ns1blankspaceDropDown" style="width:75px;">');
										
										aHTML.push('<tr><td class="ns1blankspaceAction">' +
														'<span id="ns1blankspaceMessageJustSave">Save</span>' +
														'</td></tr>');
										
										aHTML.push('</table>');					
									
										$(ns1blankspace.xhtml.container).html(aHTML.join(''))
										
										$('#ns1blankspaceMessageJustSave').button(
										{
											label: "Save"
										})
										.click(function() {
											$('#ns1blankspaceMessageJustSave').html(ns1blankspace.xhtml.loadingSmall);
											oParam.step = 2
											ns1blankspace.messaging.imap.save(oParam);
											
										})
										.css('width', '75px');
									
										$('#ns1blankspaceMessageJustSave').button(
										{
											label: "To Do"
										})
										.click(function() {
											oParam.step = 3
											ns1blankspace.messaging.imap.save(oParam);
										})
										.css('width', '75px');
									}

									if (iStep == 2)
									{
										ns1blankspace.status.working();

										var sData = 'account=' + ns1blankspace.util.fs(ns1blankspace.messaging.imap.account);
										sData += '&messageid=' + ns1blankspace.util.fs(sMessageID);
										
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_ACTION_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.status.message('Saved')
												$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
												$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
											}
										});	
									}
								}						
				},

	search: 	{
					send:		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
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
										ns1blankspace.show({selector: '#ns1blankspaceMainSummary', refresh: true});
										
										ns1blankspace.objectContext = sSearchContext;
										ns1blankspace.messaging.action = -1;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
										oSearch.addField('messageid,to,cc,from,fromname,subject,date,' +
															'message,hasattachments,attachments,imapflags,detailscached');
										oSearch.addFilter('account', 'EQUAL_TO', ns1blankspace.messaging.imap.account);
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.rows = ns1blankspace.messaging.defaultRows;
										oSearch.getResults(function(data) {ns1blankspace.messaging.imap.show(oParam, data)});	
									}
									else
									{
										if (sSearchText == undefined)
										{
											sSearchText = $('#ns1blankspaceViewControlSearch').val();
										}	
										
										if (iSource == ns1blankspace.data.searchSource.browse)
										{
											iMinimumLength = 1;
											iMaximumColumns = 4;
											sSearchText = aSearch[1];
											if (sSearchText == '#') {sSearchText = '[0-9]'}
											sElementId = 'ns1blankspaceViewControlBrowse';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.container.position(sElementId);
											ns1blankspace.search.start(sElementId);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
											oSearch.addField('subject');
											oSearch.addFilter('account', 'EQUAL_TO', ns1blankspace.messaging.imap.account);
											oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
											oSearch.rows = ns1blankspace.messaging.defaultRows;
											oSearch.getResults(function(data) {ns1blankspace.messaging.imap.process(oParam, data)});
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									
									var	iMaximumColumns = 1;
									
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspace.search.stop();
										$(ns1blankspace.xhtml.container).hide();
									}
									else
									{
										aHTML.push('<table class="ns1blankspaceSearchMedium">');
											
										$.each(oResponse.data.rows, function()
										{
											aHTML.push('<tr class="ns1blankspaceSearch">');
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'-' + this.id + '">' +
															this.subject + '</td>');
											aHTML.push('</tr>');
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										ns1blankspace.search.stop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.messaging.search.send(event.target.id, {source: 1});
										});
									}	
								}
				},
						
	layout: 	function (oParam)
				{
					var aHTML = [];
					
					var bReply = false;
					
					if (oParam != undefined)
					{
						if (oParam.reply != undefined) {bReply = oParam.reply}
					}	
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					if (bReply) 
					{
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlSummary" class="ns1blankspaceControl">' +
									'Message</td>' +
									'</tr>');
					}
					else
					{
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
									'Message</td>' +
									'</tr>');
					}
					
					
					if (bReply) 
					{
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlReply" class="ns1blankspaceControl ns1blankspaceHighlight">' +
									'Reply</td>' +
									'</tr>');
					}
					else
					{
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlReply" class="ns1blankspaceControl">' +
									'Reply</td>' +
									'</tr>');
					}
					
					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlReplyAll" class="ns1blankspaceControl">' +
									'Reply All</td>' +
									'</tr>');	
					
					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlForward" class="ns1blankspaceControl">' +
									'Forward</td>' +
									'</tr>');
												
					aHTML.push('</table>');					
								
					$('#ns1blankspaceMessagingMessageControlContainer').html(aHTML.join(''));
					
					var aHTML = [];
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.messaging.imap.summary();
					});

					$('#ns1blankspaceControlReply').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});
						ns1blankspace.messaging.imap.message.edit.show({reply: true});
					});
					
					$('#ns1blankspaceControlReplyAll').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});
						ns1blankspace.messaging.imap.message.edit.show({replyAll: true});
					});

					$('#ns1blankspaceControlForward').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});
						ns1blankspace.messaging.imap.message.edit.show({forward: true});
					});
					
					$('#ns1blankspaceControlActions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainActions'});
						ns1blankspace.messaging.imap.actions();
					});
				
					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments'});
						ns1blankspace.messaging.imap.attachments();
					});
				},

	show: 		function (oParam, oResponse)
				{
					var bReply = false;
					var aHTML = [];
					var sHTML = '';
					
					if (oParam != undefined)
					{
						if (oParam.reply != undefined) {bReply = oParam.reply}
					}	
					
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					
					ns1blankspace.messaging.imap.layout(oParam);
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
					
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the email.</td></tr></table>');
								
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
												
						$('#ns1blankspaceControlContext').html('');
						
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
						
							$('#ns1blankspaceMessagingAttachments').html(sHTML); //???
						
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
							ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});
							ns1blankspace.messaging.send.show({xhtmlElementID: 'ns1blankspaceMainEdit'})
						}
						else
						{
							ns1blankspace.messaging.imap.summary();
						}	
					}	
				},		
	
	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this email message.</td></tr></table>');

						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table id="ns1blankspaceMessagingEmailContainer" class="ns1blankspace">');
					
						aHTML.push('<tr class="ns1blankspaceHeader">' +
										'<td id="ns1blankspaceMessagingEmailSubject" class="ns1blankspaceHeaderCaption" style="text-align:left;font-weight:bold;">' +
										ns1blankspace.objectContextData.subject + '</td>');
						
						var oDate = Date.parse(ns1blankspace.objectContextData.date);

						var sDate = '';

						if (oDate != null)
						{
							sDate = oDate.toString("ddd, dd MMM yyyy h:mm tt");
						}	

						aHTML.push('<td id="ns1blankspaceMessagingEmailDate" class="ns1blankspaceHeaderCaption" style="text-align:right;">' +
										sDate + '</td>');

						aHTML.push('</tr>');
						
						var sFrom = ns1blankspace.objectContextData.fromname;
						if (sFrom != ns1blankspace.objectContextData.from) {sFrom += ' (' + ns1blankspace.objectContextData.from + ')'}

						aHTML.push('<tr class="ns1blankspaceHeader">' +
										'<td id="ns1blankspaceMessagingEmailFromEmail" colspan=2 class="ns1blankspaceSub" style="padding-bottom:10px;">' +
										sFrom + '</td>');
						
						aHTML.push('</tr>');
						
						aHTML.push('</table>');
						
						if (ns1blankspace.objectContextData.to != '')
						{
							aHTML.push('<table id="ns1blankspaceMessagingEmailToContainer" class="ns1blankspaceHeader" style="background-color:#f3f3f3;">');
							aHTML.push('<tr class="ns1blankspaceHeader">' +
											'<td id="ns1blankspaceMessagingEmailTo" class="ns1blankspace">');
											
							var sTo = ns1blankspace.objectContextData.to;
							var aTo = sTo.split('|')
							sTo = '';
						
							$.each(aTo, function(i)
							{	
								if (i % 2 !== 0) {sTo += this + '; ';}
							});				
											
							aHTML.push('<span class="ns1blankspace">To:</span> ' + sTo);

							aHTML.push('</td></tr>');
							aHTML.push('</table>');
						}
						
						if (ns1blankspace.objectContextData.cc != '')
						{
							aHTML.push('<table id="ns1blankspaceMessagingEmailCCContainer" class="ns1blankspaceHeader" style="background-color:#f3f3f3;">');
							aHTML.push('<tr class="ns1blankspaceHeader">' +
											'<td id="ns1blankspaceMessagingEmailCC" class="ns1blankspace" style="text-align:left;">');
											
							var sCC = ns1blankspace.objectContextData.cc
							var aCC = sCC.split('|')
							sCC = '';
						
							$.each(aCC, function(i)
							{
								if (i % 2 !== 0) {sCC += this + '; ';}
							});				
											
							aHTML.push('<span class="ns1blankspace">Cc:</span> ' + sCC);

							aHTML.push('</td></tr>');
							aHTML.push('</table>');
						}
						
						//if (ns1blankspace.objectContextData.hasattachments == 'Y')
						//{
							aHTML.push('<table id="ns1blankspaceMessagingEmailAttachmentsContainer" class="ns1blankspaceHeader" style="background-color:#f3f3f3;">');
							aHTML.push('<tr class="ns1blankspaceHeader">' +
													'<td id="ns1blankspaceMessagingEmailAttachments" class="ns1blankspace"></td></tr>');
							aHTML.push('</table>');
						//}
						
						aHTML.push(ns1blankspace.xhtml.loading);
						
						aHTML.push('<iframe style="display:block;height:10px;width:900px;" name="ifMessage" ' +
											'id="ifMessage" frameborder="0" border="0" scrolling="no"></iframe>');
										
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData.detailscached == 'Y')
						{
							setTimeout("ns1blankspace.messaging.imap.message.show()", 300);
							ns1blankspace.messaging.imap.message.attachments();
						}
						else
						{						
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_CACHE_GET_DETAILS'),
								data: 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
								dataType: 'json',
								success: function(data) 
								{
									var oSearch = new AdvancedSearch();
									oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
									oSearch.addField('messageid,to,cc,from,fromname,subject,date,' +
														'message,hasattachments,attachments,imapflags,detailscached');
									oSearch.addFilter('account', 'EQUAL_TO', ns1blankspace.messaging.imap.account);
									oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
									oSearch.getResults(function(oResponse) 
										{
											ns1blankspace.objectContextData = oResponse.data.rows[0];
											ns1blankspace.messaging.imap.message.attachments();
											ns1blankspace.messaging.imap.message.show();
										})	
								}
							});
							
						}	
					}	
				},

	message: 	{
					show:		function ()
								{
									var sHTML = ns1blankspace.objectContextData.message;
									sHTML = (sHTML).formatXHTML();

									while ($('#ifMessage').length == 0) {}

									$('.ns1blankspaceLoading').remove()
										
									$('#ifMessage').contents().find('html').html(sHTML);
									
									if ($.browser.msie) {}
									else
									{	
										var newHeight = $('#ifMessage',top.document).contents().find('html').height() + 100;
									}

									if ($.browser.msie)
									{
										setTimeout("ns1blankspace.messaging.imap.message.setHeight()", 100);
									}
									else
									{	
										$('#ifMessage').height($('#ifMessage',top.document).contents().find('html').height())
										$('#ifMessage').width($('#ifMessage',top.document).contents().find('html').width())
									}
									
								},

					setHeight:	function ()
								{
									$('#ifMessage').css('height', ($('#ifMessage').attr('scrollHeight') + 100) + 'px');
									$('#ifMessage').css('width', ($('#ifMessage').attr('scrollWidth') + 100) + 'px');
								},

					attachments:
								function ()
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
													
													var sLink = ns1blankspace.util.endpointURI('MESSAGING_EMAIL_ATTACHMENT_DOWNLOAD');
													sLink += '&attachmentindex=' + (iIndex);
													sLink += '&account=' + ns1blankspace.util.fs(ns1blankspace.messaging.imap.account);
													sLink += '&messageid=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.messageid);
													
													sAttachments +=	'<a href="' + sLink + '" target="_blank">' + aAttachment[0] + '</a>; ';
												});	
																
												aHTML.push('<span class="ns1blankspace">Attachments:</span> ' + sAttachments);
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
																
												aHTML.push('<span class="ns1blankspace">Attachments:</span> ' + sAttachments);
											}
										}
									
										$('#ns1blankspaceMessagingEmailAttachments').html(aHTML.join());
									}
									else
									{
										$('#ns1blankspaceMessagingEmailAttachments').html('No attachments.');
									}
								},
												
					edit: 		{
									show: 		function (oParam)
												{

													var iObject = ns1blankspace.object;
													var iObjectContext = ns1blankspace.objectContext;
													var bShowTo = true;
													var bShowPriority = false;
													var bShowAll = false;
													var sXHTMLElementID = 'ns1blankspaceMain';
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
					
														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_DRAFT') + '&new=1',
															dataType: 'json',
															async: false
														});
													}
													
													if (!bDialog)
													{
														var aHTML = [];
																		
														aHTML.push('<table id="ns1blankspaceMessagingSendMessageContainer">' +
																	'<tr class="ns1blankspace">' +
																	'<td id="ns1blankspaceSendMessageColumn1" class="ns1blankspaceColumn1">' +
																	ns1blankspace.xhtml.loading +
																	'</td>' +	
																	'</tr>' +
																	'</table>');					
															
														//'<td id="ns1blankspaceSendMessageColumn2" class="ns1blankspaceColumn2">' +
														//			'</td>' +
																		
														$('#' + sXHTMLElementID).html(aHTML.join(''));
													}
													
													var aHTML = [];
													
													aHTML.push('<table>');
													
													if (bShowTo)
													{
														aHTML.push('<tr><td class="ns1blankspace">');
														
															aHTML.push('<table class="ns1blankspace">');
													
															aHTML.push('<tr><td style="width:320px;font-size:0.875em;">');	
																
																aHTML.push('<table class="ns1blankspace">');				
																			
																aHTML.push('<tr><td class="ns1blankspaceCaption" style="width:10px;">' +
																			'To:</td>');		
																
																aHTML.push('<td>' +
																			'<input id="ns1blankspaceEditMessageToContact" class="ns1blankspaceSelectContactEmail ns1blankspaceWatermark"' +
																				' data-setelementid="ns1blankspaceEditMessageTo" value="Search for contact" style="width:220px;"');
																			
																if (iContactBusiness != undefined)
																{
																	aHTML.push(' data-contactbusiness="' + iContactBusiness + '"')
																}

																aHTML.push('></td></tr>');				

																aHTML.push('<tr><td style="width:10px;"></td><td>' +
																			'<textarea id="ns1blankspaceEditMessageTo" style="height:30px; width:220px;" rows="3" cols="20" class="ns1blankspaceTextMulti"></textarea>' +
																			'</td></tr>');
															
																aHTML.push('<tr><td style="width:10px;" class="ns1blankspaceCaption">' +
																			'Cc:</td>');		
																
																aHTML.push('<td style="width:10px;">' +
																			'<input id="ns1blankspaceEditMessageCcContact" class="ns1blankspaceSelectContactEmail ns1blankspaceWatermark ns1blankspaceText"' +
																				' data-setelementid="ns1blankspaceEditMessageCc" value="" style="width:220px;"');
																			
																if (iContactBusiness != undefined)
																{
																	aHTML.push(' data-contactbusiness="' + iContactBusiness + '"')
																}

																aHTML.push('></td></tr>');				

																aHTML.push('<tr><td style="width:10px;"></td><td>' +
																			'<textarea id="ns1blankspaceEditMessageCc" style="height:30px; width:220px;" rows="3" cols="20" class="ns1blankspaceTextMulti"></textarea>' +
																			'</td></tr>');
															
																aHTML.push('<tr><td style="width:10px;" class="ns1blankspaceCaption">' +
																			'Bcc:</td>');		
																
																aHTML.push('<td>' +
																			'<input id="ns1blankspaceEditMessageBccContact" class="ns1blankspaceSelectContactEmail ns1blankspaceWatermark ns1blankspaceText"' +
																				' data-setelementid="ns1blankspaceEditMessageBcc" value="" style="width:220px;"');
																			
																if (iContactBusiness != undefined)
																{
																	aHTML.push(' data-contactbusiness="' + iContactBusiness + '"');
																}

																aHTML.push('></td></tr>');				

																aHTML.push('<tr><td style="width:10px;"></td><td>' +
																			'<textarea id="ns1blankspaceEditMessageBcc" style="height:30px; width:220px;" rows="3" cols="20" class="ns1blankspaceTextMulti"></textarea>' +
																			'</td></tr>');
															
																aHTML.push('</table>');				
																
															aHTML.push('<td width="15px;">&nbsp;</td>');	

															aHTML.push('<td style="width:275px;">');	

																aHTML.push('<table>');				
																			
																aHTML.push('<tr><td id="ns1blankspaceEditMessageAttachCaption" class="ns1blankspaceCaption">' +
																				'Attachments</td>');		
															
																aHTML.push('<td class="ns1blankspaceRight" style+"text-align:right;">');
															
																aHTML.push('<div id="ns1blankspaceEditMessageAttachContainer" style="font-size:0.75em;">' +
																				'<input type="checkbox" id="ns1blankspaceEditMessageAttach" class="ns1blankspaceAction"/>' +
																				'<label style="font-size:0.875em;" for="ns1blankspaceEditMessageAttach">&nbsp;</label>' +
																				'</div>');
															
																aHTML.push('</td></tr>');				

																aHTML.push('<tr><td style="height:80px" colspan=2 id="ns1blankspaceActionsEditEmailAttachments" class="ns1blankspaceBorder">' +
																			'</td></tr>');
															
																aHTML.push('</table>');				
															
															aHTML.push('</td>');

															aHTML.push('<td style="width:50px;">');	

																aHTML.push('<table class="ns1blankspaceColumn2">');
														
																aHTML.push('<tr><td>' +
																		'<span id="ns1blankspaceEditMessageSend" class="ns1blankspaceAction">Send</span>' +
																		'</td></tr>');
																				
																aHTML.push('</table>');					
														
															aHTML.push('</td></tr>');				
																
															aHTML.push('</table>');					
																
														aHTML.push('</td></tr>');				
													}
													
													aHTML.push('<tr><td>');
													
														aHTML.push('<table>');				
																			
															aHTML.push('<tr><td class="ns1blankspace">' +
																		'<input id="ns1blankspaceMessagingEditMessageSubject" class="ns1blankspaceText ns1blankspaceWatermark"' +
																			' value="Subject">' +
																		'</td>');	
															
															if (bShowPriority)
															{
																aHTML.push('<td style="width:150px; text-align:right;" class="ns1blankspaceRight">' +
																				'&nbsp; <input type="checkbox" id="ns1blankspaceMessagingEditdMessageHighPriority"/>&nbsp;High Priority?<td>');
															}
														
															aHTML.push('</tr>');				
																
														aHTML.push('</table>');				
													
													aHTML.push('</td></tr>');
													
													aHTML.push('<tr><td class="ns1blankspace">' +
																		'<textarea rows="10" cols="35" id="ns1blankspaceMessagingEditMessageText" class="ns1blankspaceTextMultiLarge"></textarea>' +
																		'</td></tr>');
													
													aHTML.push('</table>');						
													
													if (bDialog)
													{
														$('#' + sXHTMLElementID).html(aHTML.join(''));
														$('#' + sXHTMLElementID).dialog(
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
																	ns1blankspace.messaging.edit.send({
																		subject: $('#ns1blankspaceMessagingSendMessageSubject').val(),
																		message: $('#ns1blankspaceMessagingSendMessageMessage').val(),
																		priority: ($('#ns1blankspaceMessagingSendMessageHighPriority').attr('checked')?3:2),
																		});

																	$( this ).dialog( "close" );
																}
															}
														});
													}	
													else
													{
														if (tinyMCE.getInstanceById('ns1blankspaceMessagingMessageEdit'))
														{
															tinyMCE.get('ns1blankspaceMessagingMessageEdit').remove();
															$('#ns1blankspaceMessagingMessageEdit').remove();
														}	
													
														$('#ns1blankspaceSendMessageColumn1').html(aHTML.join(''));
														
														var aHTML = [];

														aHTML.push('<table class="ns1blankspaceColumn2">');
														
														aHTML.push('<tr><td class="ns1blankspaceMainAction">' +
																		'<span id="ns1blankspaceEditMessageSend">Send</span>' +
																		'</td></tr>');
																				
														aHTML.push('</table>');					
														
														//$('#ns1blankspaceSendMessageColumn2').html(aHTML.join(''));
													
														$('#ns1blankspaceEditMessageSend').button(
														{
															label: "Send"
														})
														.click(function() {
														
															if (oParam != undefined)
															{
																oParam = {};
															}

															oParam.subject = $('#ns1blankspaceMessagingEditMessageSubject').val();
															oParam.message = tinyMCE.get('ns1blankspaceMessagingEditMessageMessage').getContent();
															oParam.contactPersonTo = $('#ns1blankspaceMessagingEditMessageContactTo').attr('data-id');
															oParam.to = $('#ns1blankspaceMessagingEditMessageTo').val();
															oParam.cc = $('#ns1blankspaceMessagingEditMessageCc').val();
															oParam.bcc = $('#ns1blankspaceMessagingEditMessageBcc').val();
															
															ns1blankspace.messaging.imap.edit.Send(oParam);
														});

														$('#ns1blankspaceEditMessageAttach').button(
														{
															text: false,
															icons:	{
																		primary: "ui-icon-plus"
																	}
														})
														.click(function() {
														
															ns1blankspace.messaging.imap.edit.attach.show(oParam);
														})
														.css('width', '20px')
														.css('height', '23px')
														.css('font-size', '0.75em');
														
														if (ns1blankspace.objectContextData != undefined && iSource == 1)
														{
															var sTo = '';
														
															var aHTML = [];

															aHTML.push('<br />');
															
															$.each(ns1blankspace.messaging.imap.emailAccounts, function() 
															{ 
																if (this.id == ns1blankspace.messaging.imap.account)
																{
																	aHTML.push(this.footer + '<br />');
																}
															});
																
															if (ns1blankspace.objectContextData != undefined)
															{
																if (bForward)
																{
																	$('#ns1blankspaceMessagingEditMessageSubject').val('Fw: ' + ns1blankspace.objectContextData.subject)
																}
																else
																{
																	$('#ns1blankspaceMessagingEditMessageSubject').val('Re: ' + ns1blankspace.objectContextData.subject)
																}	
																
																$('#ns1blankspaceMessagingEditMessageSubject').removeClass('ns1blankspaceWatermark');
																
																
																aHTML.push('<br />---- Original Message ----<br />');
																aHTML.push('<table style="background-color:#f5f5f5;width:100%;color:black;">');
																aHTML.push('<tr><td><strong>From:</strong> ' + ns1blankspace.objectContextData.from + '</td></tr>');
																
																aHTML.push('<tr><td><strong>To:</strong> ');	
																
																var sOrgTo = ns1blankspace.objectContextData.to;
																var aOrgTo = sOrgTo.split('|')
																
																sOrgTo = '';
														
																$.each(aOrgTo, function(i)
																{
																	if (i % 2 !== 0) {sOrgTo += this + '; '}		
																});				
																
																aHTML.push(sOrgTo + '</td></tr>');
																
																var sOrgCc = ns1blankspace.objectContextData.cc;
																
																if (sOrgCc != '')
																{
																	aHTML.push('<tr><td><strong>CC:</strong> ');	
																	var aOrgCc = sOrgCc.split('|')
																	sOrgCc = '';
															
																	$.each(aOrgCc, function()
																	{
																		if (i % 2 !== 0) {sOrgCc += this + '; '}	
																	});			
																	
																	aHTML.push(sOrgCc + '</td></tr>');
																}
																
																var oDate = new Date.parse(ns1blankspace.objectContextData.date);
																sDate = oDate.toString("ddd, dd MMM yyyy h:mm TT") 
														
																aHTML.push('<tr><td><strong>Sent:</strong> ' + sDate + '</td></tr>');	
																aHTML.push('<tr><td><strong>Subject:</strong> ' + ns1blankspace.objectContextData.subject + '</td></tr>');	
																aHTML.push('</table>');
																
																$('#ns1blankspaceMessagingEditMessageText').val(aHTML.join('') + (ns1blankspace.objectContextData.message).formatXHTML());
														
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
													
																$('#ns1blankspaceMessagingEditMessageTo').val(sTo)
													
																if (ns1blankspace.objectContextData.attachments != '' && bForward && ns1blankspace.messaging.action == -1)
																{
																	if (ns1blankspace.objectContextData.sourcetypetext == "EMAIL")
																	{
																		var sParam = ns1blankspace.util.endpointURI('MESSAGING_EMAIL_ATTACHMENT_MANAGE') + '&rf=TEXT';
																		var sData = 'account=' + ns1blankspace.messaging.imap.account;
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
																				ns1blankspace.messaging.imap.edit.attachments();
																			}
																		});
																	}
																	
																	if (ns1blankspace.objectContextData.sourcetypetext == "ACTION")
																	{
																		var sParam = ns1blankspace.util.endpointURI('MESSAGING_EMAIL_DRAFT_MANAGE') + '&new=1&rf=TEXT';
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
																				ns1blankspace.messaging.imap.edit.attachments();
																			}
																		});
																	}
																	
																}	
																else
																{
																	//ns1blankspace.messaging.imap.edit.attachments();
																}		
															}	
														}
														
														if (iSource == 2)
														{
															var sFooter = '<br />';
															
															$.each(ns1blankspace.messaging.imap.emailAccounts, function() 
															{ 
																if (this.id == ns1blankspace.messaging.imap.account)
																{
																	sFooter = this.footer + '<br />';
																}
															});
															
															$('#ns1blankspaceMessagingEditMessageText').val(sFooter + sMessage)
														}
														
														if (iSource == 3)
														{
															$('#ns1blankspaceMessagingEditMessageSubject').val(sSubject)
															$('#ns1blankspaceMessagingEditMessageSubject').removeClass('ns1blankspaceWatermark');
															$('#ns1blankspaceMessagingEditMessageText').val(sMessage)
														}
														
														if (ns1blankspace.option.richTextEditing)
														{
															tinyMCE.execCommand('mceAddControl', false, 'ns1blankspaceMessagingEditMessageText');
														}	
													}
												},

									attach: 	{
													show:		function (oParam, oResponse)
																{
																	sXHTMLElementID = "ns1blankspaceEditMessageAttachCaption";
																	
																	if (!$('#ns1blankspaceEditMessageAttach').attr('checked'))
																	{
																		$(ns1blankspace.xhtml.container).hide()
																	}
																	else
																	{	
																		if (oResponse == undefined)
																		{					
																			$.ajax(
																			{
																				type: 'POST',
																				url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_DRAFT'),
																				dataType: 'json',
																				success: function(data) 
																				{
																					ns1blankspace.messaging.imap.edit.attach.show(oParam, data)
																				}
																			});
																		}
																		else
																		{															
																			var aHTML = [];
																			
																			ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID})
																		
																			ns1blankspace.messaging.action = oResponse.id;
																		
																			aHTML.push('<table style="width:287px;" class="ns1blankspaceViewControlContainer">');
																			aHTML.push('<tr><td id="ns1blankspaceMessageEditAttachmentUpload" class="ns1blankspace">' +
																								ns1blankspace.attachments.upload.show(
																								{
																									object: 17,
																									objectContext: oResponse.id,
																									label: '',
																									showUpload: true
																								}) +
																							'</td></tr>');
																			aHTML.push('</table>');			

																			$(ns1blankspace.xhtml.container).html(aHTML.join(''));	
																			
																			$('#ns1blankspaceUpload').button(
																			{
																				label: "Upload"
																			})
																			.click(function() {
																				 ns1blankspace.attachments.upload.process({functionPostUpdate: ns1blankspace.messaging.imap.edit.attach.process});
																			})
																		}					
																	}	
																},

													process: 	function (oParam, oResponse)
																{	
																	var aHTML = [];
																	
																	var sXHTMLElementID = "ns1blankspaceActionsEditEmailAttachments";
																	
																	if (oParam != undefined)
																	{
																		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
																		if (oParam.action != undefined) {ns1blankspace.messaging.action = oParam.action}
																	}
																	
																	$(ns1blankspace.xhtml.container).hide();
																	
																	$('#ns1blankspaceMessaageEditAttach').attr('checked', false)
																	$('#ns1blankspaceMessaageEditAttach').button("refresh");
																	
																	if (ns1blankspace.messaging.action != -1)
																	{
																		if (oResponse == undefined)
																		{
																			var oSearch = new AdvancedSearch();
																			oSearch.method = 'CORE_ATTACHMENT_SEARCH';
																			oSearch.addField('filename,description,download,modifieddate,attachment');
																			oSearch.addFilter('object', 'EQUAL_TO', 17);
																			oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.messaging.action);
																		
																			oSearch.sort('filename', 'asc');
																			oSearch.getResults(function(data) {ns1blankspace.messaging.imap.edit.attach.process(oParam, data)});
																		}
																		else
																		{
																			if (oResponse.data.rows.length == 0)
																			{
																				$('#' + sXHTMLElementID).html('');
																			}
																			else
																			{
																				aHTML.push('<table style="width:100%">');
																			
																				$.each(oResponse.data.rows, function()
																				{
																					aHTML.push('<tr class="ns1blankspaceAttachments">');
																					aHTML.push('<td id="ns1blankspaceAttachment_filename-' + this.id + '" style="font-size:0.75em;color:black;font-weight:normal;width:100%" class="ns1blankspaceRow">' + this.filename + '</td>');
																					aHTML.push('<td id="ns1blankspaceAttachmentAttachment_delete-' + this.attachment + '" style="width:20px;" class="ns1blankspaceRowRemove">&nbsp;</td>');
																					aHTML.push('</tr>');
																				});
																				
																				aHTML.push('</table>');

																				$('#' + sXHTMLElementID).html(aHTML.join(''));
																				
																				$('.ns1blankspaceRowRemove').button({
																					text: false,
																					 icons: {
																						 primary: "ui-icon-close"
																					}
																				})
																				.click(function() {
																					ns1blankspace.messaging.imap.edit.attach.remove(this.id)
																				})
																				.css('width', '15px')
																				.css('height', '20px')
																				
																			}
																		}
																	}	
																},

													remove: 	function (sXHTMLElementId)
																{
																	var aSearch = sXHTMLElementId.split('-');
																	var sElementId = aSearch[0];
																	var sSearchContext = aSearch[1];
						
																	$.ajax(
																		{
																			type: 'POST',
																			url: ns1blankspace.util.endpointURI('CORE_ATTACHMENT_MANAGE'),
																			data: 'remove=1&id=' + sSearchContext,
																			dataType: 'text',
																			success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
																		});	
																}
											}
								},

					send:		function (oParam)
								{
									var fFunctionPostSend;
									var sXHTMLElementID = 'ns1blankspaceMainEdit';
									
									if (oParam.object == undefined) {oParam.object = ns1blankspace.object}
									if (oParam.objectContext == undefined) {oParam.objectContext = ns1blankspace.objectContext}
									
									if (oParam != undefined)
									{
										if (oParam.functionPostSend != undefined) {fFunctionPostSend = oParam.functionPostSend}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}	
									
									//sData += 'object=' + oParam.object;
									//sData += '&objectcontext=' + oParam.objectContext;
									sData += 'subject=' + ns1blankspace.util.fs((oParam.subject == undefined ? '' : oParam.subject));
									sData += '&message=' + ns1blankspace.util.fs((oParam.message == undefined ?' ' : oParam.message));
									sData += '&priority=' + ns1blankspace.util.fs((oParam.priority == undefined ? '' : oParam.priority));
									sData += '&id=' + ns1blankspace.util.fs((oParam.contactPersonTo == undefined ? '' : oParam.contactPersonTo));
									sData += '&to=' + ns1blankspace.util.fs((oParam.to==undefined ? '' : oParam.to));
									sData += '&cc=' + ns1blankspace.util.fs((oParam.cc==undefined ? '' : oParam.cc));
									sData += '&bcc=' + ns1blankspace.util.fs((oParam.bcc==undefined ? '' : oParam.bcc));
									
									sData += (oParam.otherData == undefined ? '' : oParam.otherData)
									
									$('#' + sXHTMLElementID).html(ns1blankspace.xhtml.loading);

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND'),
										data: sData,
										dataType: 'text',
										success: function(data) 
										{
											ns1blankspace.status.message('Email sent');
											$('#' + sXHTMLElementID).html('<span><br />Email has been sent.</span>');
											$('#ns1blankspaceMessaging').html(''); //???
											if (fFunctionPostSend != undefined) {fFunctionPostSend()};
										}
									});

								},						

					edit2:		function ()
								{
									var aHTML = [];

									if ($('#ns1blankspaceMainEdit').attr('data-loading') == '1')
									{
										$('#ns1blankspaceMainEdit').attr('data-loading', '');
												
										aHTML.push('<table id="ns1blankspaceMessagingMessageEditContainer" class="ns1blankspaceMain">');
												
										aHTML.push('<tr class="ns1blankspaceTextMulti">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<textarea rows="30" cols="50" id="ns1blankspaceMessagingMessageEdit" class="ns1blankspaceTextMultiLarge"></textarea>' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainEdit').html(aHTML.join(''));
										
										if (ns1blankspace.objectContextData != undefined)
										{
											$('#ns1blankspaceMessagingMessageEdit').val(unescape(ns1blankspace.objectContextData.message));
										}
									
										if (ns1blankspace.option.richTextEditing)
										{
											tinyMCE.execCommand('mceAddControl', false, 'ns1blankspaceMessagingMessageEdit');
										}	
									}	
								}
				},

	save: 		{
					send: 		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{			
										var sData = 'rf=TEXT';
										
										if ($('#ns1blankspaceMainEdit').html() != '')
										{
											sData += '&subject=' + ns1blankspace.util.fs($('#ns1blankspaceMessagingSendMessageSubject').val());
											sData += '&message=' + ns1blankspace.util.fs(tinyMCE.get('ns1blankspaceMessagingSendMessage').getContent()); //???
										}
										
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_DRAFT'),
											data: sData,
											dataType: 'text',
											success: function(data) 
											{
												ns1blankspace.messaging.imap.save.send(oParam, data)
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

	attachments: 
				function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this email message.</td></tr></table>');
								
						$('#ns1blankspaceMainAttachments').html(aHTML.join(''));
					}
					else
					{
						var iAttachmentCount = ns1blankspace.objectContextData.attachmentcount;
						
						if (iAttachmentCount == 0)
						{
							aHTML.push('<table><tr><td class="ns1blankspaceNothing">No attachments.</td></tr></table>');

							$('#ns1blankspaceMainAttachments').html(aHTML.join(''));
						}
						else
						{
							var sAttachments = ns1blankspace.objectContextData.attachments;
							var aAttachments = sAttachments.split('#')

							aHTML.push('<table>');
						
							aHTML.push('<tr class="ns1blankspaceCaption">');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">Filename</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">Size (kb)</td>');
							aHTML.push('</tr>');
						
							$.each(aAttachments, function(iIndex) 
							{
								if (this != '')
								{
									var sLink = ns1blankspace.util.endpointURI('MESSAGING_EMAIL_ATTACHMENT_DOWNLOAD');
									sLink += '&attachment=' + ns1blankspace.util.fs(iIndex);
									sLink += '&account=' + ns1blankspace.util.fs(ns1blankspace.messaging.imap.account);
									sLink += '&id=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
									
									var aAttachment = this.split('|');
									sAttachments += '\r\n' + aAttachment[0];
								
									aHTML.push('<tr class="ns1blankspaceAttachments">');
									aHTML.push('<td id="ns1blankspaceMessagingAttachment_filename-' + (iIndex) + '" class="ns1blankspaceRow">' +
														'<a href="' + sLink + '" target="_blank">' + aAttachment[0] + '</a></td>');
									aHTML.push('<td id="ns1blankspaceMessagingAttachment_size-' + (iIndex) + '" class="ns1blankspaceRow">' + (aAttachment[1] / 1000).toFixed(2) + '</td>');
													
									aHTML.push('</tr>');
								}	
							});	
						   	
							aHTML.push('</table>');
							$('#ns1blankspaceMainAttachments').html(aHTML.join(''));
						}
					}	
				},
					
	new: 		function (oParam, oResponse)
				{
					var aHTML = [];
					
					var sXHTMLElementID = 'ns1blankspaceMain';

					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}	
					
					$('#' + sXHTMLElementID).html(ns1blankspace.xhtml.loading);
					//$('#tdns1blankspaceMessagingEmailViewport').html('');
					
					if (oResponse == undefined)
					{
						var sParam = 'method=MESSAGING_EMAIL_DRAFT_SEARCH';

						$.ajax(
						{
							type: 'GET',
							url: '/ondemand/messaging/?' + sParam,
							dataType: 'json',
							success: function(data) {ns1blankspace.messaging.imap.new(oParam, data)}
						});
					}	
					else	
					{		
						if (oResponse.data.rows.length == 0)
						{
							ns1blankspace.messaging.imap.message.edit.show(oParam);
						}
						else
						{	
							aHTML.push('<table class="ns1blankspaceMain">' +
											'<tr class="ns1blankspaceRow">' +
											'<td id="ns1blankspaceNewColumn1" class="ns1blankspaceColumn1Large">' +
											ns1blankspace.xhtml.loading + '</td>' +
											'<td id="ns1blankspaceNewColumn2" class="ns1blankspaceColumn2Action" style="width:150px;"></td>' +
											'</tr>' +
											'</table>');	
					
							$('#' + sXHTMLElementID).html(aHTML.join(''));
						
							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspaceColumn2">');
									
							aHTML.push('<tr><td >' +
											'<span id="ns1blankspaceMessagingNewBlank" class="ns1blankspaceAction">Create New</span>' +
											'</td></tr>');
											
							aHTML.push('</table>');					
						
							$('#ns1blankspaceNewColumn2').html(aHTML.join(''));
						
							$('#ns1blankspaceMessagingNewBlank').button(
							{
								label: "Blank"
							})
							.click(function() {
								s1blankspace.messaging.imap.message.edit.show(oParam);
							})
							.css('width', '75px')
						
							var aHTML = [];
	
							aHTML.push('<table style="width:100%">');
							aHTML.push('<tr><td class="ns1blankspaceCaption">Saved Drafts</td></tr>');
							
							aHTML.push('<table id="ns1blankspaceMessagingContainer" style="width:100%">');
						
							var sSubject;

							$.each(oResponse.data.rows, function() {
							
								sSubject = this.subject
								if (sSubject == '') {sSubject = 'No Subject'}
								
								aHTML.push('<tr><td id="ns1blankspaceMessagingNewDrafts_subject-' + this.id + 
												'"class="ns1blankspaceRow ns1blankspaceRowSelect">' + sSubject + '</td></tr>');				
							})
							
							aHTML.push('</table>');
							
							$('#ns1blankspaceNewColumn1').html(aHTML.join(''));
						
							$('#ns1blankspaceMessagingContainer td.ns1blankspaceRowSelect').click(function() {
							
								var sData = 'method=MESSAGING_EMAIL_DRAFT_SEARCH&getmessage=1';
								sID = this.id;
								aID = sID.split('-');
								sParam += '&id=' + aID[1];

								$.ajax(
								{
									type: 'GET',
									url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_DRAFT_SEARCH'),
									data: sData,
									dataType: 'json',
									success: function(oResponse) {
										oParam.message = oResponse.data.rows[0].message;
										oParam.subject = oResponse.data.rows[0].subject;
										oParam.source = 3;
										ns1blankspace.messaging.imap.edit.show(oParam);
									}
								});
							})
						}
					}	
				},

	actions: 	{
					show: 		function (oParam, oResponse)
								{
									var sXHTMLElementID = 'ns1blankspaceMainActions';
									
									var iType = 5 //Email Sent

									if (oResponse == undefined)
									{
										$('#ns1blankspaceMainHeaderSentEmails').html(ns1blankspace.xhtml.loadingSmall); //???
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'ACTION_SEARCH';
										oSearch.addField('actionreference,actiontypetext,duedate');
										oSearch.rf = 'json';
										oSearch.addFilter('actiontype', 'EQUAL_TO', iType);
										oSearch.sort('modifieddate', 'desc');
										oSearch.getResults(function(data) {ns1blankspace.messaging.imap.actions.show(oParam, data)}); 
									}
									else
									{
										var aHTML = [];
	
										$('#ns1blankspaceMainHeaderSentEmails').html('Sent&nbsp;emails');
										
										if (oResponse.data.rows.length == 0) {}
										else
										{
											aHTML.push('<table class="ns1blankspaceSearchMedium">');
								
											$.each(oResponse.data.rows, function() 
											{
												aHTML.push('<tr class="ns1blankspaceSearch">');
												aHTML.push('<td id="ns1blankspaceAction_subject-' + this.id + '" class="ns1blankspaceSearch">' +
																this.actionreference + '</td>');
																
												aHTML.push('<td id="ns1blankspaceAction_date-' + this.id + '" class="ns1blankspaceSearch">' +
																this.duedate + '</td>');
												
												aHTML.push('</tr>');
											});
								    	
											aHTML.push('</table>');

											$(ns1blankspace.xhtml.container).html(ns1blankspace.pagination(
												   {
													html: aHTML.join(''),
													more: (oResponse.morerows == "true")
												   }) );
										
											$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
											ns1blankspace.pagination.bind(
											{
												columns: 'actionreference-duedate',
												more: oResponse.moreid,
												rows: 20,
												startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows)
											});   
										}
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).hide();
											ns1blankspace.messaging.imap.actions.search.send({xhtmlElementID: event.target.id});
										});
									}
								},

					search: 	{				
									send:		function (oParam, oResponse)
												{
													var aHTML = [];
													var sXHTMLElementID;
													var sTargetXHTMLElementID = 'ns1blankspaceMainSummary';
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
													
													if (bSetContext) {ns1blankspaceMainViewportShow("#ns1blankspaceMainSummary", true)};
													
													if (oResponse == undefined)
													{
														ns1blankspace.messaging.action = -1;
														
														var oSearch = new AdvancedSearch();
														oSearch.method = 'ACTION_SEARCH';
														oSearch.addField('actionreference,duedatetime,text');
														oSearch.rf = 'json';
														oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
														oSearch.addFilter('actiontype', 'EQUAL_TO', 5);				
														oSearch.getResults(function(data) {ns1blankspace.messaging.imap.actions.search.send(oParam, data)});
													}
													else
													{
														ns1blankspace.history.view({
																newDestination: 'ns1blankspace.messaging.imap.init({showHome: false});ns1blankspace.messaging.imap.search.send("-' + ns1blankspace.objectContext + '")',
																move: false
																});
																
														if (bSetContext) {ns1blankspace.objectContextData = oResponse.data.rows[0]};
														
														if (oResponse.data.rows.length != 0)
														{
															var oRow = oResponse.data.rows[0];
															
															ns1blankspace.objectContextData.id = sSearchContext;
															ns1blankspace.objectContextData.subject = oRow.actionreference;
															ns1blankspace.objectContextData.date = oRow.duedatetime;
															ns1blankspace.objectContextData.message = oRow.text;
															
															var oSearch = new AdvancedSearch();
															oSearch.method = 'ACTION_EMAIL_RECIPIENT_SEARCH';
															oSearch.addField('type,email,name');
															oSearch.rf = 'json';
															oSearch.addFilter('action', 'EQUAL_TO', sSearchContext);		
															oSearch.getResults(function(data) {ns1blankspace.messaging.imap.actions.search.process(oParam, data)});
														}
													}
												},
													
								process:		function (oParam, oResponse)
												{	
													var aHTML = [];
													
													var sXHTMLElementID;
													var sTargetXHTMLElementID = 'ns1blankspaceMainSummary';
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
														
													aHTML.push('<table class="ns1blankspace">');
													
													aHTML.push('<tr class="ns1blankspaceHeader">' +
																	'<td id="ns1blankspaceMessagingActionSubject" style="text-align:left;font-weight:bold" class="ns1blankspaceHeader">' +
																	ns1blankspace.objectContextData.subject + '</td>');
													
													var oDate = new Date.parse(ns1blankspace.objectContextData.date);
													sDate = oDate.toString("ddd, dd MMM yyyy h:mm TT");

													aHTML.push('<td id="ns1blankspaceMessagingActionDate" style="text-align:right;" class="ns1blankspaceSub" >' +
																	sDate + '</td>');

													aHTML.push('</tr>');
													
													aHTML.push('<tr class="ns1blankspaceHeader">' +
																	'<td id="ns1blankspaceMessagingFromEmail" colspan=2 style="text-align:left;" class="ns1blankspaceSub" >' +
																	ns1blankspace.objectContextData.from + '</td>');
													
													aHTML.push('</tr>');
													
													aHTML.push('</table>');
													
													if (ns1blankspace.objectContextData.to != '')
													{
														aHTML.push('<table class="ns1blankspace">');
														aHTML.push('<tr class="ns1blankspaceHeader">' +
																		'<td id="ns1blankspaceMessagingActionTo" style="text-align:left;" class="ns1blankspaceMainHeader">');
																		
														var sTo = ns1blankspace.objectContextData.to;
														var aTo = sTo.split('|');
														sTo = '';
													
														$.each(aTo, function(i)
														{
															if (i % 2 !== 0) {sTo += this + '; ';}
														});				
																		
														aHTML.push('<span class="ns1blankspaceCaption">To:</span> ' + sTo);

														aHTML.push('</td></tr>');
														aHTML.push('</table>');
													}
													
													if (ns1blankspace.objectContextData.cc != '')
													{
														aHTML.push('<table>');
														aHTML.push('<tr class="ns1blankspaceHeader">' +
																		'<td id="ns1blankspaceMessagingActionCC" style="text-align:left;" class="ns1blankspaceHeader">');
																		
														var sCC = ns1blankspace.objectContextData.cc;
														var aCC = sCC.split('#');
														sCC = '';
													
														$.each(aCC, function(i)
														{
															if (i % 2 !== 0) {sCC += this + '; ';}
														});				
																		
														aHTML.push('<span class="ns1blankspaceMessagingHeader">Cc:</span> ' + sCC);

														aHTML.push('</td></tr>');
														aHTML.push('</table>');
													}
													
													if (ns1blankspace.objectContextData.attachments != '')
													{
														aHTML.push('<table>');
														aHTML.push('<tr class="ns1blankspaceMainHeader">' +
																		'<td style="text-align:left;" class="ns1blankspaceMainHeader" id="ns1blankspaceMainHeaderAttachments">');
																		
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
																		
														aHTML.push('<span class="ns1blankspaceMessagingHeader">Attachments:</span> ' + sAttachments);

														aHTML.push('</td></tr>');
														aHTML.push('</table>');
													}
													
													aHTML.push('<iframe style="display:block;height:10px;width:900px;" name="ifMessage" ' +
																	'id="ifMessage" frameborder="0" border="0" scrolling="no"></iframe>');
																	
													$('#' + sTargetXHTMLElementID).html(aHTML.join('')); 
													
													ns1blankspace.messaging.imap.layout(oParam);
														
													setTimeout("ns1blankspace.messaging.imap.message.show()", 300);
												}
								}
				}				
}								