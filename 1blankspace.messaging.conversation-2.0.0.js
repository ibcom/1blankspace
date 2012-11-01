/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
if (ns1blankspace.messaging === undefined) {ns1blankspace.messaging = {}}
 
ns1blankspace.messaging.conversation = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 50;
					ns1blankspace.objectParentName = 'messaging';
					ns1blankspace.objectName = 'conversation';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Conversations';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.messaging.conversation.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);

					if (ns1blankspace.option.richTextEditing)
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
							content_css : ns1blankspace.xhtml.editorCSS,
							
							external_link_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH", 
							external_image_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext, 
							media_external_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext, 
						});				
					}
				},

	home: 		function (oResponse)
				{
					if (oResponse == undefined)
					{
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceMain">');
						aHTML.push('<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ins1blankspaceMain">' +
										ns1blankspace.xhtml.loading +
										'</td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));

						var aHTML = [];
									
						aHTML.push('<table>');

						aHTML.push('<tr><td id="ns1blankspaceViewMessagingConversationLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');
								
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	

						var oSearch = new AdvancedSearch();
						oSearch.method = 'MESSAGING_CONVERSATION_SEARCH';
						oSearch.addField('title');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'asc');
						oSearch.getResults(ns1blankspace.messaging.conversation.home);
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a conversation.</td></tr>' +
											'</table>');
						}
						else
						{
							aHTML.push('<table>');
							aHTML.push('<tr><td class="ns1blankspaceCaption">MOST LIKELY</td></tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
														'" class="ns1blankspaceMostLikely">' +
														this.title +
														'</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');			
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.messaging.conversation.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function (sXHTMLElementId, oParam)
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
									
									if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
									{
										$('#divns1blankspaceViewportControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
									
										var oSearch = new AdvancedSearch();
										oSearch.method = 'MESSAGING_CONVERSATION_SEARCH';
										oSearch.addField('*');
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext)
										oSearch.rows = 10;
										oSearch.sort('modifieddate', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.messaging.conversation.show(oParam, data));
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
											oSearch.method = 'MESSAGING_CONVERSATION_SEARCH';
											oSearch.addField('title');
											oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
											oSearch.rows = 10;
											oSearch.sort('title', 'asc');
											oSearch.getResults(function(data) {ns1blankspace.messaging.conversation.search.process(oParam, data)});
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
											
									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.container).hide();
									}
									else
									{	
										aHTML.push('<table class="ns1blankspaceSearchMedium">');
									
										$.each(oResponse.data.rows, function()
										{
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">');
											}
											
											aHTML.push('<td class="ns1blankspaceSearch" id="-' + this.id + '">' +
																this.title + '</td>');
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										ns1blankspace.search.stop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.messaging.conversation.search.send(event.target.id, {source: 1});
										});
									}	
								}
				},

	layout: 	function ()
				{
					if (tinyMCE.getInstanceById('inputns1blankspaceMainEditText'))
					{
						tinyMCE.get('inputns1blankspaceMainEditText').remove();
						$('#inputns1blankspaceMainEditText').remove();
					}

					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
					
					aHTML.push('<table class="ns1blankspaceControlContainer">');
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Details</td></tr>');		
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');

						aHTML.push('</table>';
						
						aHTML.push('<table class="ns1blankspaceControlContainer">';

						aHTML.push('<tr><td id="ns1blankspaceControlParticipants" class="ns1blankspaceControl">' +
										'Participants</td></tr>');

						aHTML.push('</table>';
						
						aHTML.push('<table class="ns1blankspaceControlContainer">';

						aHTML.push('<tr><td id="ns1blankspaceControlPosts" class="ns1blankspaceControl">' +
										'Posts</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlComments" class="ns1blankspaceControl">' +
										'Comments</td></tr>');

						aHTML.push('</table>';
						
						aHTML.push('<table class="ns1blankspaceControlContainer">';

						aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');
					}	
					
					aHTML.push('</table>';					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainParticipants" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainParticipantsAdd" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainPosts" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainPostDetails" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainComments" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControl"></div>');
						
					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.setup.messaging.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.setup.messaging.details();
					});

					$('#ns1blankspaceControlParticipants').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainParticipants'});
						ns1blankspace.setup.messaging.participants();
					});

					$('#ns1blankspaceControlPosts').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPosts'});
						ns1blankspace.setup.messaging.posts();
					});
				
					$('#ns1blankspaceControlComments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainComments'});
						ns1blankspace.setup.messaging.comments();
					});

					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments'});
						ns1blankspace.setup.messaging.attachments();
					});
				},

	show: 		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.messaging.conversation.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this conversation.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));

						ns1blankspace.messaging.ConversationOwner = false;
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						ns1blankspace.messaging.ConversationOwner = (ns1blankspace.user == ns1blankspace.objectContextData.user)

						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.messaging.conversation.init({showHome: false});ns1blankspace.messaging.conversation.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.object({functionDefault: 'ns1blankspace.messaging.conversation.summary()'});
					}	
				},	
		
	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this conversation.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:100px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));

						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Owner</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryOwner" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.ownerusertext +
										'</td></tr>');

 						if (ns1blankspace.objectContextData.description != '')
						{	
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
										(ns1blankspace.objectContextData.description).formatXHTML() +
										'</td></tr>');
						}						
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainSummaryColumn1').html(aHTML.join(''));
				
						var aHTML = [];
			
						aHTML.push('<tableclass="ns1blankspaceColumn2Action" cellspacing=0>');
						
						if (ns1blankspace.messaging.ConversationOwner)
						{
							aHTML.push('<tr><td class="ns1blankspaceColumn2Action">' +
										'<a href="#" id="ns1blankspaceConversationAddParticipant">Add&nbsp;Participant</a>' +
										'</td></tr>');
						}
						else
						{
							aHTML.push('<tr><td class="ns1blankspaceColumn2Action">' +
										'<a href="#" id="ns1blankspaceConversationRemoveParticipant">Leave</a>' +
										'</td></tr>');
						}	
								
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainSummaryColumn2').html(aHTML.join(''));	
						
						$('#ns1blankspaceConversationAddParticipant').click(function(event)
						{
							ns1blankspace.messaging.conversation.participants.add();
						});

						$('#ns1blankspaceConversationRemoveParticipant').click(function(event)
						{
							ns1blankspace.messaging.conversation.participants.remove();
						});
					}	
				},

	details: 	function ()
				{
					if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDetails').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');					
						
						$('#ns1blankspaceMainDetails').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
							
						if (ns1blankspace.messaging.ConversationOwner)
						{
							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'Title' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceText">' +
											'<input id="ns1blankspaceDetailsTitle" class="ns1blankspaceText">' +
											'</td></tr>');			

							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'Sharing' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceRadio">' +
											'<input type="radio" id="radioSharingY" name="radioSharing" value="1"/>Added Participants & Network Groups' +
											'<br /><input type="radio" id="radioSharingN" name="radioSharing" value="2"/>Everyone (Public)' +
											'<br /><input type="radio" id="radioSharingN" name="radioSharing" value="3"/>Internal' +
											'</td></tr>');	

							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'Participant Can' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceRadio">' +
											'<input type="radio" id="radioParticipantCan1" name="radioParticipantCan" value="1"/>Add Posts & Comments' +
											'<br /><input type="radio" id="radioParticipantCan2" name="radioParticipantCan" value="2"/>Add Comments Only' +
											'<br /><input type="radio" id="radioParticipantCan3" name="radioParticipantCan" value="3"/>View Only' +
											'<br /><input type="radio" id="radioParticipantCan4" name="radioParticipantCan" value="4"/>Add Posts Only' +
											'</td></tr>');

							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'URL For Email Alerts' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceText">' +
											'<input id="ns1blankspaceDetailsAlertURL" class="ns1blankspaceText">' +
											'</td></tr>');					
						}			
						else
						{
							aHTML.push('<tr><td class="ns1blankspaceNothing">Only the owner can change the conversation details.</td></tr>');
						}
						
						aHTML.push('</table>';					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.messaging.ConversationOwner)
						{
							var aHTML = [];
						
							aHTML.push('<table id="tablens1blankspaceMainDetailsColumn2" class="ns1blankspaceMain">';
							
							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'Description' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceText">' +
											'<textarea id="ns1blankspaceDetailsDescription" rows="5" cols="35" class="ns1blankspaceTextMulti"></textarea>' +
											'</td></tr>');	

							aHTML.push('</table>');					
								
							$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));
						}	
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.description);
							$('#ns1blankspaceDetailsAlertURL').val(ns1blankspace.objectContextData.alerturl);
							
							$('[name="radioSharing"][value="' + ns1blankspace.objectContextData.sharing + '"]').attr('checked', true);
							$('[name="radioParticipantCan"][value="' + ns1blankspace.objectContextData.participantcan + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioSharing"][value="1"]').attr('checked', true);
							$('[name="radioParticipantCan"][value="1"]').attr('checked', true);
						}		
					}	
				},

	participants: {
					init:		function (oParam)
								{
									var aHTML = [];
									
									aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceParticipantsColumn1" class="ns1blankspaceColumn1Large"></td>' +
													'<td id="ns1blankspaceParticipantsColumn2" class="ns1blankspaceColumn2Action"></td>' +
													'</tr>' + 
													'</table>');
													
									$('#ns1blankspaceMainParticipants').html(aHTML.join(''));	
									
									if (ns1blankspace.messaging.ConversationOwner)
									{	
										var aHTML = [];1;	
										
										aHTML.push('<table class="ns1blankspaceMainColumn2Action">';
																		
										aHTML.push('<tr><td class="ns1blankspaceMainAction">' +
															'<span id="ns1blankspaceParticipantsAdd">Add</span>' +
															'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceParticipantsColumn2').html(aHTML.join(''));	
									
										$('#ns1blankspaceParticipantsAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												ns1blankspace.messaging.conversation.participants.add();
											})
									}		
									
									ns1blankspace.messaging.conversation.participants.show();
								},		

					show: 	function (oParam, oResponse)
								{
									var sLabel = "Participants";
									var iOption = 1;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
									}

									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'MESSAGING_CONVERSATION_PARTICIPANT_SEARCH';
										oSearch.addField('*');
										oSearch.addFilter('conversation', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(data) {ns1blankspace.messaging.conversation.participants.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">No participants.</td></tr></table>');

											$('#ns1blankspaceParticipantsColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceConversationParticipants" class="ns1blankspace">');

											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceConversationParticipants_userlogonname-' + this.user + '" class="ns1blankspaceMainRow">' +
																		this.userlogonname + '</td>');
																		
												aHTML.push('<td id="ns1blankspaceConversationParticipants-' + this.user + '" class="ns1blankspaceRowSelect">&nbsp;</td>');
																		
												aHTML.push('</tr>');		
											})
											
											aHTML.push('</table>');

											$('#ns1blankspaceParticipantsColumn1').html(aHTML.join(''));
											
											if (ns1blankspace.messaging.ConversationOwner)
											{
												$('#ns1blankspaceConversationParticipants > td.ns1blankspaceRowSelect').button(
												{
													text: false,
													icons: 
													{
														 primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspace.messaging.conversation.participants.remove(this.id)
												})
												.css('width', '15px')
												.css('height', '20px');
											}		
										}
									}	
								},	

					add: 		function (oParam, oResponse)
								{
									var oSearch;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.search != undefined) {oSearch = oParam.search}
									}
									
									if (oResponse == undefined)
									{		
										if (oSearch == undefined)
										{
											ns1blankspace.show({selector: '#ns1blankspaceMainParticipantsAdd'});
											
											var aHTML = [];
			
											aHTML.push('<table class="ns1blankspaceContainer">' +
															'<tr class="ns1blankspaceContainer">' +
															'<td id="ns1blankspaceParticipantsAddColumn1" class="ns1blankspaceColumn1Large"></td>' +
															'<td id="ns1blankspaceParticipantsAddColumn2" class="ns1blankspaceColumn2Action"></td>' +
															'</tr>' + 
															'</table>');		
															
											$('#ns1blankspaceMainParticipantsAdd').html(aHTML.join(''));	
											
											var aHTML = [];
											
											aHTML.push('<table class="ns1blankspaceContainer">';
											
											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'First Name' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceText">' +
															'<input id="ns1blankspaceDetailsFirstName" class="ns1blankspaceText">' +
															'</td></tr>');	

											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Last Name' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceText">' +
															'<input id="ns1blankspaceDetailsLastName" class="ns1blankspaceText">' +
															'</td></tr>');	
														

											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Email' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceText">' +
															'<input id="ns1blankspaceDetailsEmail" class="ns1blankspaceText">' +
															'</td></tr>');
										
											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Logon Name' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceText">' +
															'<input id="ns1blankspaceDetailsLogonName" class="ns1blankspaceText">' +
															'</td></tr>');
														
											aHTML.push('</table>');		
											
											aHTML.push('<table class="ns1blankspaceMainColumn2Action">';
												
											aHTML.push('<tr><td  class="ns1blankspaceAction">' +
															'<span id="ns1blankspaceParticipantsAddSearch">Search</span>' +
															'</td></tr>');
														
											aHTML.push('</table>');					
										
											$('#ns1blankspaceParticipantsAddColumn1').html(aHTML.join(''))
											
											$('#ns1blankspaceParticipantsAddSearch').button(
											{
												label: "Search"
											})
											.click(function() {
											
												var oSearchSet = {}

												if ($('#ns1blankspaceDetailsFirstName').val() != '')
												{
													oSearchSet.firstName = $('#ns1blankspaceDetailsFirstName').val()
												}
												if ($('#ns1blankspaceDetailsSurname').val() != '')
												{
													oSearchSet.surname = $('#ns1blankspaceDetailsSurname').val()
												}
												if ($('#ins1blankspaceDetailsEmail').val() != '')
												{
													oSearchSet.email = $('#ns1blankspaceDetailsEmail').val()
												}
												if ($('#ns1blankspaceDetailsLogonName').val() != '')
												{
													oSearchSet.userText = $('#ns1blankspaceDetailsLogonName').val()
												}

												if (oParam == undefined) {oParam = {}}
												oParam.search = oSearchSet;
												ns1blankspace.messaging.conversation.participants.add(oParam);
											})
										}
										else
										{
											var sData = 'rf=json';
										
											if (oSearch.firstName != undefined) 
											{
												sData += '&firstname=' + ns1blankspace.util.fs(oSearch.firstName);
											}	
											if (oSearch.surname != undefined)
											{
												sData += '&surname=' +ns1blankspace.util.fs(oSearch.surname);
											}
											if (oSearch.email != undefined)
											{
												sData += '&email=' + ns1blankspace.util.fs(oSearch.email);
											}
											if (oSearch.userText != undefined)
											{
												sData += '&usertext=' + ns1blankspace.util.fs(oSearch.userText);
											}
										
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('NETWORK_USER_SEARCH'),
												data: sData,
												dataType: 'json',
												success: function(data){ns1blankspace.messaging.conversation.participants.add(oParam, data)}
											});
										}	
									}
									else
									{
										if (oResponse.status == 'ER')
										{
											var aHTML = [];

											ns1blankspace.status.error('Not a valid request.');
										}
										else
										{
											var aHTML = [];
											var h = -1;
											
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table><tr><td class="ns1blankspaceNothing">No matching users.</td></tr></table>');

												$('#ns1blankspaceParticipantsAddColumn2').html(aHTML.join(''));
											}
											else
											{
												aHTML.push('<table id="tableMessagingConversationParticpantsAddSelect" class="ns1blankspaceMain">';
												aHTML.push('<tbody>'
												
												$.each(oResponse.data.rows, function()
												{	
													aHTML.push('<tr class="ns1blankspaceMainRow">';
													aHTML.push('<td id="tdMessagingConversationParticpantsAddSelect-title-' +
																			this.user + '" class="ns1blankspaceMainRow">' +
																			this.usertext + '</td>';
													
													aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceMainRow">' +
																	'<span id="spanMessagingConversationParticipantAddSelect-' + this.user + '" class="ns1blankspaceMainRowSelect"></span>' +
																	'</td></tr>';
													
												});
												
												aHTML.push('</table>';

												$('#tdns1blankspaceMainParticipantsAddColumn2').html(aHTML.join(''));
												
												$('.ns1blankspaceMainRowSelect').button({
													text: false,
													label: "Add",
													icons: {
														 primary: "ui-icon-check"
													}
												})
												.click(function() {
													ns1blankspaceMessagingConversationParticipantsAddSelect(this.id);
												})
												.css('width', '15px')
												.css('height', '20px')
											}
										}	
									}
								},

					select:		function (sXHTMLElementId)
								{
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sContext = aSearch[1];
									
									var sData = 'user=' + sContext + '&conversation=' + ns1blankspace.objectContext;
												
									$.ajax(
									{
										type: 'POST',
										url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_PARTICIPANT_MANAGE',
										data: sData,
										dataType: 'text',
										success: function(data){$('#' + sXHTMLElementId).parent().parent().fadeOut(500)}
									});	
								},
									
					remove:		function (sXHTMLElementId)
								{
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sContext = aSearch[1];
									
									var sData = 'user=' + sContext + '&conversation=' + ns1blankspace.objectContext;
												
									$.ajax(
									{
										type: 'POST',
										url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_PARTICIPANT_MANAGE&remove=1',
										data: sData,
										dataType: 'text',
										success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
									});	
								}
				},

	posts: 		{
					show: 		function ns1blankspaceMessagingConversationPosts(oParam, oResponse)
								{
									var sXHTMLElementId = 'divns1blankspaceMainPosts';
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
									}

									if (oResponse == undefined)
									{
										var sData = 'includeme=1&dontencode=1&conversation=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_POST_SEARCH',
											data: sData,
											dataType: 'json',
											success: function(data) {ns1blankspaceMessagingConversationPosts(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
										var h = -1;	
														
										aHTML.push('<table id="tablens1blankspaceMainPosts" class="ns1blankspaceMain">' +
														'<tr id="trns1blankspaceMainPostsRow1" class="ns1blankspaceMainRow1">' +
														'<td id="tdns1blankspaceMainPostsColumn1" class="ns1blankspaceMainColumn1Large">' +
														ns1blankspace.xhtml.loading +
														'</td>' +
														'<td id="tdns1blankspaceMainPostsColumn2" class="ns1blankspaceMainColumn2Action">' +
														'</td>' +
														'</tr>' +
														'</table>';					
														
										$('#divns1blankspaceMainPosts').html(aHTML.join(''));	
									
										var aHTML = [];
										var h = -1;	
										
										aHTML.push('<table id="tablens1blankspaceMainColumn2" class="ns1blankspaceMainColumn2Action">';
												
										aHTML.push('<tr><td id="tdns1blankspaceMainSend" class="ns1blankspaceMainAction">' +
															'<span id="spanns1blankspaceMainAdd">Add</span>' +
															'</td></tr>';
														
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainPostsColumn2').html(aHTML.join(''));	
									
										$('#spanns1blankspaceMainAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											ns1blankspaceMessagingConversationPostsAdd(false);
										})
										
										var aHTML = [];
										var h = -1;
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="tablens1blankspaceMessagingConversationHomeMostLikely">';
											aHTML.push('<tr class="ns1blankspaceMainCaption">' +
																'<td class="ns1blankspaceMainRowNothing">No posts.</td></tr>';
											aHTML.push('</table>';
										}
										else
										{		
											aHTML.push('<table id="tablens1blankspaceMainDetailsColumn1" class="ns1blankspaceMain">';
												
											aHTML.push('<table id="tableMessagingConversationPostsList" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push('<tbody>'
											
											aHTML.push('<tr class="ns1blankspaceMainCaption">';
											aHTML.push('<td class="ns1blankspaceMainCaption">Subject</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption">By</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption">Date</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption">&nbsp;</td>';
											aHTML.push('</tr>';
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceMainRow">';
																
												var sSubject = this.subject;
												if (sSubject == '') {sSubject = (this.message).substring(0, 50) + '...'}		
																
												aHTML.push('<td id="tdMessagingConversationPostsList_subject-' + this.id + '" class="ns1blankspaceMainRow">' +
																		sSubject + '</td>';
																		
												aHTML.push('<td id="tdMessagingConversationPostsList_usertext-' + this.id + '" class="ns1blankspaceMainRow">' +
																		this.usertext + '</td>';
																		
												aHTML.push('<td id="tdMessagingConversationPostsList_date-' + this.id + '" class="ns1blankspaceMainRow">' +
																		this.datetime + '</td>';
																
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceMainRow">' +
																	'<span id="spanMessagingConversationPostsComment-' + this.id + '" class="ns1blankspaceMainRowSelect ns1blankspaceMainRowSelectAddComment"></span>' +
																	'</td></tr>';
													
											});
												
											aHTML.push('</table>';

											$('#tdns1blankspaceMainPostsColumn1').html(aHTML.join(''));
										
											$('.ns1blankspaceMainRowSelectAddComment').button({
												text: false,
												label: "Comment",
												icons: {
													 primary: "ui-icon-comment"
												}
											})
											.click(function() {
												ns1blankspaceMessagingConversationCommentsOptions({xhtmlElementID: this.id});
											})
											.css('width', '15px')
											.css('height', '20px')
										}
									}	
								}	

								function ns1blankspaceMessagingConversationCommentsOptions(oParam)
								{
									var aHTML = [];
									var h = -1;
									var iStep = 1;
									var sXHTMLElementID;
									
									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.step != undefined) {iStep = oParam.step}
									}
									
									if (iStep == 1) 
									{
										aHTML.push('<table id="tableMessagingConversationCommentsOptions" style="width:75px;" class="ns1blankspaceDropDown">';
										
										aHTML.push('<tr><td id="tdns1blankspaceMessagingConversationCommentsOptionsView" class="ns1blankspaceMainAction">' +
														'<span id="spanns1blankspaceMessagingConversationCommentsOptionsView">View</span>' +
														'</td></tr>';
														
										aHTML.push('<tr><td id="tdns1blankspaceMessagingConversationCommentsOptionsAdd" class="ns1blankspaceMainAction">' +
														'<span id="spanns1blankspaceMessagingConversationCommentsOptionsAdd">Add</span>' +
														'</td></tr>';				
										
										aHTML.push('</table>';					

										ns1blankspaceViewportOptionsShow({
											xhtmlElementID: sXHTMLElementID,
											offsetLeft: -75,
											offsetTop: 6,
											xhtml: aHTML.join('')
										});
										
										$('#spanns1blankspaceMessagingConversationCommentsOptionsView').button(
										{
											label: "View"
										})
										.click(function() {
											ns1blankspaceViewportOptionsHide();
											ns1blankspaceMainViewportShow("#divns1blankspaceMainComments");
											var aXHTMLElementID = sXHTMLElementID.split('-');
											ns1blankspaceMessagingConversationComments({post: aXHTMLElementID[1]});
										})
										.css('width', '75px')
										
										$('#spanns1blankspaceMessagingConversationCommentsOptionsAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											ns1blankspaceMessagingConversationCommentsOptions({xhtmlElementID: sXHTMLElementID, step: 2});
										})
										.css('width', '75px')
									}

									if (iStep == 2)
									{
										var aHTML = [];
										var h = -1;
															
										aHTML.push('<table id="tablens1blankspaceMainDetailsColumn1" class="ns1blankspaceDropDown">';									
									
										aHTML.push('<tr id="trns1blankspaceMainPostDetailsMessageValue" class="ns1blankspaceMainTextMulti">' +
															'<td id="tdns1blankspaceMainPostDetailsMessageValue" class="ns1blankspaceMainTextMulti">' +
															'<textarea name="message" rows="15" cols="10" id="inputns1blankspaceMainCommentMessage"' +
																	' class="inputns1blankspaceMainTextMulti"></textarea>' +
															'</td></tr>';
										
										aHTML.push('<tr><td id="tdns1blankspaceMainCommentsSend" class="ns1blankspaceMainAction" style="text-align:right;">' +
														'<span id="spanns1blankspaceMainCommentsSend">Send</span>' +
														'</td></tr>';
																
										aHTML.push('</table>';

										ns1blankspaceViewportOptionsShow({
											xhtmlElementID: sXHTMLElementID,
											offsetLeft: -251,
											offsetTop: 6,
											xhtml: aHTML.join(''),
											forceShow: true
										});
										
										$('#spanns1blankspaceMainCommentsSend').button(
										{
											label: "Send"
										})
										.click(function() {
											ns1blankspaceMessagingConversationCommentsOptions({xhtmlElementID: sXHTMLElementID, step: 3});
										})
										.css('width', '75px')
									}
									
									if (iStep == 3)
									{
										$('#spanns1blankspaceMainCommentsSend').html(ns1blankspace.xhtml.loadingSmall);
										
										var sData = 'message=' + ns1blankspace.util.fs($('#inputns1blankspaceMainCommentMessage').val())
										
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
														ns1blankspaceViewportOptionsHide();
													}
													else
													{
														alert ('Comment could not be sent.');
													}	
												}
										});	
									
									}
									
								}

								function ns1blankspaceMessagingConversationPostsAdd(oParam, oResponse)
								{
									var sXHTMLElementId = "divns1blankspaceMainPostDetails";
									var sXHTMLElementContextId;
									var iPost;
									
									for (edId in tinyMCE.editors) 
													tinyMCE.editors[edId].destroy(true);
												
									ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;		
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
										if (oParam.xhtmlElementContextId != undefined) {sXHTMLElementContextId = oParam.xhtmlElementContextId}
										if (oParam.post != undefined) {iPost = oParam.post}
									}

									if (sXHTMLElementContextId != undefined)
									{
										var aSearch = sXHTMLElementContextId.split('-');
										var sElementId = aSearch[0];
										var lProjectTask = aSearch[1];
									}	
										
									ns1blankspaceMainViewportShow("#divns1blankspaceMainPostDetails");	
										
									var aHTML = [];
									var h = -1;
										
									aHTML.push('<table id="tablens1blankspaceMainPostDetails" class="ns1blankspaceMain">' +
													'<tr id="trns1blankspaceMainPostDetailsRow1" class="ns1blankspaceMainRow1">' +
													'<td id="tdns1blankspaceMainPostDetailsColumn1" class="ns1blankspaceMainColumn1Large">' +
													'</td>' +
													'<td id="tdns1blankspaceMainPostDetailsColumn2" class="ns1blankspaceMainColumn2Action">' +
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
											success: function(data) {ns1blankspaceMessagingConversationPostsAdd(oParam, data)}
										});
									}
									else
									{
										
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tablens1blankspaceMainTaskDetailsColumn2" class="ns1blankspaceMainColumn2Action">';
										
										aHTML.push('<tr><td id="tdns1blankspaceMainPostDetailsSend" class="ns1blankspaceMainAction">' +
														'<span id="spanns1blankspaceMainPostDetailsSend">Send</span>' +
														'</td></tr>';
																
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainPostDetailsColumn2').html(aHTML.join(''));
										
										$('#spanns1blankspaceMainPostDetailsSend').button(
										{
											label: "Send"
										})
										.click(function() {
											if ($('#oFile0').val() == '')
											{
												ns1blankspaceMessagingConversationPostDetailsSend()
											}
											else
											{
												ns1blankspaceAttachmentsUploadProcess({functionPostUpdate: ns1blankspaceMessagingConversationPostsShow});
											}	
										})
										
										var aHTML = [];
										var h = -1;
															
										aHTML.push('<table id="tablens1blankspaceMainDetailsColumn1" class="ns1blankspaceMain">';					
															
										aHTML.push('<tr id="trns1blankspaceMainPostDetailsSubject" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainPostDetailsSubject" class="ns1blankspaceMain">' +
															'Subject' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainPostDetailsSubjectValue" class="ns1blankspaceMainText">' +
															'<td id="tdns1blankspaceMainPostDetailsSubjectValue" class="ns1blankspaceMainText">' +
															'<input name="subject" id="inputns1blankspaceMainPostDetailsSubject" class="inputns1blankspaceMainText">' +
															'</td></tr>';							
									
										aHTML.push('<tr id="trns1blankspaceMainPostDetailsMessageValue" class="ns1blankspaceMainTextMulti">' +
															'<td id="tdns1blankspaceMainPostDetailsMessageValue" class="ns1blankspaceMainTextMulti">' +
															'<textarea name="message" rows="25" cols="50" id="inputns1blankspaceMainPostDetailsMessage' +
																	ns1blankspace.counter.editor + '" editorcount="' + ns1blankspace.counter.editor + '" class="inputns1blankspaceMainTextMulti"></textarea>' +
																	
															'</td></tr>';
									
										aHTML.push('</table>';						
									
										$('#tdns1blankspaceMainPostDetailsColumn1').html(
											ns1blankspaceAttachmentsUpload(
												{
													xhtml: aHTML.join(''),
													label: ''
												})
										);
										
										if (ns1blankspace.option.richTextEditing)
										{
											tinyMCE.execCommand('mceAddControl', false, 'inputns1blankspaceMainPostDetailsMessage' + ns1blankspace.counter.editor);
										}	
										
										if (oResponse != undefined)
										{	
											if (oResponse.data.rows.length != 0)
											{
												$('#inputns1blankspaceMainPostDetailsSubject').val(oResponse.data.rows[0].subject);
												$('#inputns1blankspaceMainPostDetailsMessage').val(oResponse.data.rows[0].message);		
											}
										}	
									}	
								}	

								function ns1blankspaceMessagingConversationPostDetailsSend()
								{
									var sParam = '/ondemand/messaging/?method=MESSAGING_CONVERSATION_POST_MANAGE'
									var sData = 'conversation=' + ns1blankspace.objectContext;
									
									sData += '&subject=' + encodeURIComponent($('#inputns1blankspaceMainPostDetailsSubject').val());
									sData += '&message=' + encodeURIComponent(tinyMCE.get('inputns1blankspaceMainPostDetailsMessage' + ns1blankspace.counter.editor).getContent()) 
										
									ns1blankspaceSave(sParam, sData, 'Post Sent');
									ns1blankspaceMainViewportShow("#divns1blankspaceMainPosts", true);
									ns1blankspaceMessagingConversationPosts();	
								}

								function ns1blankspaceMessagingConversationPostsShow()
								{
									ns1blankspaceMainViewportShow("#divns1blankspaceMainPosts", true);
									ns1blankspaceMessagingConversationPosts();	
								}
				},

	comments: 	function ns1blankspaceMessagingConversationComments(oParam, oResponse)
				{
					var sXHTMLElementId = 'divns1blankspaceMainComments';
					var iPost;
					
					if (oParam != undefined)
					{
						if (oParam.post != undefined) {iPost = oParam.post}
						if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
					}

					if (oResponse == undefined)
					{
						var sData = 'includeme=1&conversation=' + ns1blankspace.objectContext;
						
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
							success: function(data) {ns1blankspaceMessagingConversationComments(oParam, data)}
						});
					}
					else
					{
						var aHTML = [];
						var h = -1;	
										
						aHTML.push('<table id="tablens1blankspaceMainComments" class="ns1blankspaceMain">' +
										'<tr id="trns1blankspaceMainCommentsRow1" class="ns1blankspaceMainRow1">' +
										'<td id="tdns1blankspaceMainCommentsColumn1" class="ns1blankspaceMainColumn1Large">' +
										ns1blankspace.xhtml.loading +
										'</td>' +
										'<td id="tdns1blankspaceMainCommentsColumn2" class="ns1blankspaceMainColumn2Action">' +
										'</td>' +
										'</tr>' +
										'</table>';					
										
						$('#divns1blankspaceMainComments').html(aHTML.join(''));	
					
						var aHTML = [];
						var h = -1;	
						
						aHTML.push('<table id="tablens1blankspaceMainColumn2" class="ns1blankspaceMainColumn2Action">';
								
						aHTML.push('<tr><td id="tdns1blankspaceMainCommentAdd" class="ns1blankspaceMainAction">' +
											'<span id="spanns1blankspaceMainCommentsAdd">Add</span>' +
											'</td></tr>';
										
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainCommentsColumn2').html(aHTML.join(''));	
					
						$('#spanns1blankspaceMainCommentsAdd').button(
						{
							label: "Add"
						})
						.click(function() {
							ns1blankspaceMessagingConversationCommentsAdd(false);
						})
						
						var aHTML = [];
						var h = -1;
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="tablens1blankspaceMessagingConversationHomeMostLikely">';
							aHTML.push('<tr class="ns1blankspaceMainCaption">' +
												'<td class="ns1blankspaceMainRowNothing">No comments.</td></tr>';
							aHTML.push('</table>';
						}
						else
						{		
							aHTML.push('<table id="tablens1blankspaceMainDetailsColumn1" class="ns1blankspaceMain">';
								
							aHTML.push('<table id="tableMessagingConversationCommentsList" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
							aHTML.push('<tbody>'
							
							aHTML.push('<tr class="ns1blankspaceMainCaption">';
							if (iPost == undefined)
							{
								aHTML.push('<td class="ns1blankspaceMainCaption">Post</td>';
							}
							aHTML.push('<td class="ns1blankspaceMainCaption">Comment</td>';
							aHTML.push('<td class="ns1blankspaceMainCaption">By</td>';
							aHTML.push('<td class="ns1blankspaceMainCaption">Date</td>';
							aHTML.push('<td class="ns1blankspaceMainCaption">&nbsp;</td>';
							aHTML.push('</tr>';
							
							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceMainRow">';
													
								if (iPost == undefined)
								{
									aHTML.push('<td id="tdMessagingConversationCommentsList_postsubject-' + this.id + '" class="ns1blankspaceMainRow">' +
														this.postsubject + '</td>';	
								}
								
								aHTML.push('<td id="tdMessagingConversationCommentsList_message-' + this.id + '" class="ns1blankspaceMainRow">' +
														this.message + '</td>';
														
								aHTML.push('<td id="tdMessagingConversationCommentsList_usertext-' + this.id + '" class="ns1blankspaceMainRow">' +
														this.usertext + '</td>';
														
								aHTML.push('<td id="tdMessagingConversationCommentsList_date-' + this.id + '" class="ns1blankspaceMainRow">' +
														this.datetime + '</td>';
									
								aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceMainRow">' +
													'<span id="spanMessagingConversationPostsComment-' + this.post + '" class="ns1blankspaceMainRowSelect ns1blankspaceMainRowSelectAddComment"></span>' +
													'</td></tr>';
										
								aHTML.push('</tr>'
								
							});
							
							aHTML.push('</table>';	
						}
						
						$('#divns1blankspaceMainComments').html(aHTML.join(''));
						
						$('.ns1blankspaceMainRowSelectAddComment').button({
							text: false,
							label: "Comment",
							icons: {
								 primary: "ui-icon-comment"
							}
						})
						.click(function() {
							ns1blankspaceMessagingConversationCommentsOptions({xhtmlElementID: this.id});
						})
						.css('width', '15px')
						.css('height', '20px')
						
					}	
				},

	save: 		{
					send:		function ()
								{
									var sData = '_=1';
									
									if (ns1blankspace.objectContext != -1)
									{
										sData += '&id=' + ns1blankspace.objectContext	
									}	
									
									if ($('#divns1blankspaceMainDetails').html() != '')
									{
										sData += '&title=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsTitle').val());
										sData += '&description=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsDescription').val());
										sData += '&sharing=' + $('input[name="radioSharing"]:checked').val();
										sData += '&participantcan=' + $('input[name="radioParticipantCan"]:checked').val();
										sData += '&alerturl=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsAlertURL').val());
									}
									
									$.ajax(
									{
										type: 'POST',
										url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_MANAGE',
										data: sData,
										dataType: 'json',
										success: ns1blankspaceMessagingConversationSaveProcess
									});		
								}

					process:	function (oResponse)
								{		
									if (oResponse.status == 'OK')
									{
										ns1blankspaceStatus('Saved');
										if (ns1blankspace.objectContext == -1) {ns1blankspace.objectContext = oResponse.id};	
										ns1blankspace.inputDetected = false;
										ns1blankspaceMessagingConversationSearch('-' + ns1blankspace.objectContext, {source: 1});
									}
									else
									{
										ns1blankspaceStatus(oResponse.error.errornotes);
										ns1blankspaceConfirm( {html: [oResponse.error.errornotes]
																   , title: 'Save error!'});
									}
								}
				}				
}
