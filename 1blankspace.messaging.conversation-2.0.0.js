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

	home: 		function ns1blankspaceMessagingConversationHomeShow(oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
						var h = -1;
									
						aHTML.push('<table id="tablens1blankspaceViewportMain" class="ns1blankspaceViewportMain">';
						aHTML.push('<tr id="trns1blankspaceViewportMain" class="ns1blankspaceViewportMain">' +
										'<td id="tdns1blankspaceMessagingConversationHomeMostLikely" class="ns1blankspaceViewportMain">' +
										ns1blankspace.xhtml.loading + 
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divns1blankspaceMain').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
									
						aHTML.push('<table>';
						aHTML.push('<tr>' +
										'<td id="ns1blankspaceViewportMessagingConversationLarge" class="ns1blankspaceViewportImageLarge">' +
										'&nbsp;' + 
										'</td>' +
										'</tr>';
						aHTML.push('</table>';		
						
						$('#divns1blankspaceViewportControl').html(aHTML.join(''));	
						
						$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
						
						sParam = 'method=MESSAGING_CONVERSATION_SEARCH&rows=10';

						$.ajax(
						{
							type: 'GET',
							url: '/ondemand/messaging/?' + sParam,
							dataType: 'json',
							success: ns1blankspaceMessagingConversationHomeShow
						});		
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="tablens1blankspaceMessagingConversationHomeMostLikely">');
							aHTML.push('<tr class="trns1blankspaceMessagingConversationHomeMostLikelyNothing">');
							aHTML.push('<td class="tdns1blankspaceMessagingConversationHomeMostLikelyNothing">Click New to create a conversation.</td>');
							aHTML.push('</tr>');
							aHTML.push('</table>');
						}
						else
						{
							aHTML.push('<table id="tablens1blankspaceBewsHomeMostLikely">');
							aHTML.push('<tr>');
							aHTML.push('<td class="ns1blankspaceMain">MOST LIKELY</td>');
							aHTML.push('</tr>');
							
							$.each(oResponse.data.rows, function()
							{	
								aHTML.push('<tr class="ns1blankspaceMainRow">');
								aHTML.push('<td id="ns1blankspaceMessagingConversationHomeMostLikely_Title-' + this.id + 
														'" class="ns1blankspaceHomeMostLikely">' +
														this.title +
														'</td>');
								aHTML.push('</tr>');
							});
							
							aHTML.push('</tbody></table>');
							
							aHTML.push('<table id="tablens1blankspaceMessagingConversationHomeMostLikelyMore">');
							aHTML.push('<tr><td id="tdns1blankspaceMessagingConversationHomeMostLikelyMore">' +
										'<a href="#" id="ans1blankspaceMessagingConversationHomeMostLikelyMore">more...</a>' +
										'</td></tr>');
							aHTML.push('</tbody></table>');
						}
						
						$('#tdns1blankspaceMessagingConversationHomeMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceHomeMostLikely').click(function(event)
						{
							ns1blankspaceMessagingConversationSearch(event.target.id, {source: 1});
						});
						
						$('#ans1blankspaceMessagingConversationHomeMostLikelyMore').click(function(event)
						{
							ns1blankspaceMessagingConversationSearch('tdns1blankspaceViewportMasterControlBrowse-', {source: ns1blankspace.data.searchSource.browse});
						});
					}
				},

	search: 	{
					send:		function ns1blankspaceMessagingConversationSearch(sXHTMLElementId, oParam)
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
										var sData = 'id=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_SEARCH',
											data: sData,
											dataType: 'json',
											success: function(data) {ns1blankspaceMessagingConversationShow(oParam, data)}
										});
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
											oSearch.endPoint = 'messaging';
											oSearch.method = 'MESSAGING_CONVERSATION_SEARCH';
											oSearch.addField('title');
											oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
											oSearch.rows = 10;
											oSearch.sort('title', 'asc');
											//oSearch.getResults(function(data) {ns1blankspaceMessagingConversationSearchShow(oParam, data)});
											
											var sData = 'quicksearch=' + sSearchText;

											$.ajax(
											{
												type: 'POST',
												url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_SEARCH',
												data: sData,
												dataType: 'json',
												success: function(data) {ns1blankspaceMessagingConversationSearchShow(oParam, data)}
											});
										}
									};	
								},

					process:	function ns1blankspaceMessagingConversationSearchShow(oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
											
									if (oResponse.data.rows.length == 0)
									{
										$('#divns1blankspaceViewportControlOptions').hide();
									}
									else
									{	
										aHTML.push('<table class="ns1blankspaceSearchMedium">';
										aHTML.push('<tbody>'
											
										$.each(oResponse.data.rows, function()
										{
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">';
											}
											
											aHTML.push('<td class="ns1blankspaceSearch" id="-' + this.id + '">' +
																this.title + '</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>'
												iColumn = 0;
											}
											
										});
								    	
										aHTML.push('</tbody></table>';

										$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
										$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
										
										ns1blankspaceSearchStop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
											$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspaceMessagingConversationSearch(event.target.id, {source: 1});
										});
									}	
								}
				},

	layout: 	function ns1blankspaceMessagingConversationViewport()
				{	
					var aHTML = [];
					var h = -1;

					if (tinyMCE.getInstanceById('inputns1blankspaceMainEditText'))
					{
						tinyMCE.get('inputns1blankspaceMainEditText').remove();
						$('#inputns1blankspaceMainEditText').remove();
					}	
					
					aHTML.push('<div id="divns1blankspaceViewportControlContext" class="ns1blankspaceViewportControlContext"></div>';
					
					aHTML.push('<table id="tablens1blankspaceViewportControl" class="ns1blankspaceViewportControl">';
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlDetails" class="ns1blankspaceViewportControl ns1blankspaceViewportControlHighlight">Details</td>' +
										'</tr>';
					}
					else
					{
						aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlSummary" class="ns1blankspaceViewportControl ns1blankspaceViewportControlHighlight">Summary</td>' +
										'</tr>';
									
							
						aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlDetails" class="ns1blankspaceViewportControl">Details</td>' +
										'</tr>';
												
						aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlParticipants" class="ns1blankspaceViewportControl">Participants</td>' +
										'</tr>';			
						
						aHTML.push('</table>';
						
						aHTML.push('<table id="tablens1blankspaceViewportControl" class="ns1blankspaceViewportControl">';
						
						aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlPosts" class="ns1blankspaceViewportControl">Posts</td>' +
										'</tr>';
										
						aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlComments" class="ns1blankspaceViewportControl">Comments</td>' +
										'</tr>';				
										
						aHTML.push('</table>';
						
						aHTML.push('<table id="tablens1blankspaceViewportControl" class="ns1blankspaceViewportControl">';
						
						aHTML.push('<tr id="trns1blankspaceViewportControl" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlAttachments" class="ns1blankspaceViewportControl">Attachments</td>' +
										'</tr>';
								
						aHTML.push('</table>';				
					}
					
					$('#divns1blankspaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;

					aHTML.push('<div id="divns1blankspaceMainSummary" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainDetails" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainParticipants" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainParticipantsAdd" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainPosts" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainComments" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainPostDetails" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainAttachments" class="divns1blankspaceViewportMain"></div>';
					
					$('#divns1blankspaceMain').html(aHTML.join(''));
					
					$('#tdns1blankspaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainSummary", true);
						ns1blankspaceMessagingConversationSummary();
					});
					
					$('#tdns1blankspaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainDetails");
						ns1blankspaceMessagingConversationDetails();
					});
					
					$('#tdns1blankspaceViewportControlParticipants').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainParticipants", true);
						ns1blankspaceMessagingConversationParticipants();
					});
					
					$('#tdns1blankspaceViewportControlPosts').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainPosts");
						ns1blankspaceMessagingConversationPosts();
					});
					
					$('#tdns1blankspaceViewportControlComments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainComments");
						ns1blankspaceMessagingConversationComments();
					});
					
					$('#tdns1blankspaceViewportControlAttachments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainAttachments", true);
						ns1blankspaceAttachments({xhtmlElementID: 'divns1blankspaceMainAttachments'});
					});
				},

	show: 		function ns1blankspaceMessagingConversationShow(oParam, oResponse)
				{
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspaceMessagingConversationViewport();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find conversation.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						ns1blankspace.objectContextData = undefined;
						
						$('#divns1blankspaceMain').html(aHTML.join(''));
						
						ns1blankspace.messaging.ConversationOwner = false;
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						ns1blankspaceViewportDestination({
							newDestination: 'ns1blankspaceMessagingConversationMasterViewport({showHome: false});ns1blankspaceMessagingConversationSearch("-' + ns1blankspace.objectContext + '")',
							move: false
							})
								
						$('#divns1blankspaceViewportControlContext').html(ns1blankspace.objectContextData.title);
						$('#spanns1blankspaceViewportControlAction').button({disabled: false});
						$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});
						
						ns1blankspace.messaging.ConversationOwner = (gsUserID == ns1blankspace.objectContextData.user)
						
						ns1blankspaceMessagingConversationSummary();
					}
				},	
		
	summary:	function ns1blankspaceMessagingConversationSummary()
				{

					var aHTML = [];
					var h = -1;
					
					aHTML.push('<table id="tablens1blankspaceMainSummary" class="ns1blankspaceMain">';
					aHTML.push('<tr id="trns1blankspaceMainSummaryRow1" class="ns1blankspaceMainRow1">' +
								'<td id="tdns1blankspaceMainSummaryColumn1Large" class="ns1blankspaceMainColumn1Large">' +
									'</td>' +
									'<td id="tdns1blankspaceMainSummaryColumn2Action" style="width:100px;">' +
									'</td>' +
									'</tr>';
					aHTML.push('</table>';					
						
					$('#divns1blankspaceMainSummary').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find conversation.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
					
						aHTML.push('<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMainColumn1">';
									
						aHTML.push('<tr><td id="tdns1blankspaceMainSummaryOwner" class="ns1blankspaceMainSummary">Owner</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummaryOwnerValue" class="ns1blankspaceMainSummaryValue">' +
										ns1blankspace.objectContextData.ownerusertext +
										'</td></tr>';	
										
						if (ns1blankspace.objectContextData.description != '')
						{	
							aHTML.push('<tr><td id="tdns1blankspaceMainSummaryDescription" class="ns1blankspaceMainSummary">Description</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummaryDescriptionValue" class="ns1blankspaceMainSummaryValue">' +
										 ns1blankspaceFormatXHTML(ns1blankspace.objectContextData.description) +
										'</td></tr>';
						}				
										
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainSummaryColumn1Large').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;	
						
						aHTML.push('<table id="tablens1blankspaceMainColumn2" class="ns1blankspaceMainColumn2Action" cellspacing=0>';
						
						if (ns1blankspace.messaging.ConversationOwner)
						{
							aHTML.push('<tr><td id="tdns1blankspaceMainSummaryAddParticipant" class="ns1blankspaceMainColumn2Action">' +
										'<a href="#" id="ans1blankspaceMainSummaryAddParticipant">Add&nbsp;Participant</a>' +
										'</td></tr>';
						}
						else
						{
							aHTML.push('<tr><td id="tdns1blankspaceMainSummaryRemoveParticipant" class="ns1blankspaceMainColumn2Action">' +
										'<a href="#" id="ans1blankspaceMainSummaryRemoveParticipant">Leave</a>' +
										'</td></tr>';
						}	
								
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainSummaryColumn2Action').html(aHTML.join(''));	
						
						$('#ans1blankspaceMainSummaryAddParticipant').click(function(event)
						{
							ns1blankspaceMessagingConversationParticipantsAdd();
						});
					}	
				},

	details: 	function ns1blankspaceMessagingConversationDetails()
				{
					var aHTML = [];
					var h = -1;
					
					if ($('#divns1blankspaceMainDetails').attr('onDemandLoading') == '1')
					{
						$('#divns1blankspaceMainDetails').attr('onDemandLoading', '');
								
						aHTML.push('<table id="tablens1blankspaceMainDetails" class="ns1blankspaceMainDetails">';
						aHTML.push('<tr id="trns1blankspaceMainDetailsRow1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsColumn1" class="ns1blankspaceMainColumn1">' +
										'</td>' +
										'<td id="tdns1blankspaceMainDetailsColumn2" class="ns1blankspaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divns1blankspaceMainDetails').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;

						aHTML.push('<table id="tablens1blankspaceMainDetailsColumn1" class="ns1blankspaceMain">';
							
						if (ns1blankspace.messaging.ConversationOwner)
						{
							aHTML.push('<tr id="trns1blankspaceMainDetailsTitle" class="ns1blankspaceMain">' +
											'<td id="tdns1blankspaceMainDetailsTitle" class="ns1blankspaceMain">' +
											'Title' +
											'</td></tr>' +
											'<tr id="trns1blankspaceMainDetailsTitleValue" class="ns1blankspaceMainText">' +
											'<td id="tdns1blankspaceMainDetailsTitleValue" class="ns1blankspaceMainText">' +
											'<input onDemandType="TEXT" id="inputns1blankspaceMainDetailsTitle" class="inputns1blankspaceMainText">' +
											'</td></tr>';
											
							aHTML.push('<tr id="trns1blankspaceMainDetailsSharing" class="ns1blankspaceMain">' +
											'<td id="tdns1blankspaceMainDetailsSharing" class="ns1blankspaceMain">' +
											'Sharing' +
											'</td></tr>' +
											'<tr id="trns1blankspaceMainDetailsSharing" class="ns1blankspaceMainText">' +
											'<td id="tdns1blankspaceMainDetailsSharingValue" class="ns1blankspaceMainText">' +
											'<input type="radio" id="radioSharingY" name="radioSharing" value="1"/>Added Participants & Network Groups' +
											'<br /><input type="radio" id="radioSharingN" name="radioSharing" value="2"/>Everyone (Public)' +
											'<br /><input type="radio" id="radioSharingN" name="radioSharing" value="3"/>Internal' +
											'</td></tr>';

							aHTML.push('<tr id="trns1blankspaceMainDetailsParticipantCan" class="ns1blankspaceMain">' +
											'<td id="tdns1blankspaceMainDetailsParticipantCan" class="ns1blankspaceMain">' +
											'Participant Can' +
											'</td></tr>' +
											'<tr id="trns1blankspaceMainDetailsParticipantCan" class="ns1blankspaceMainText">' +
											'<td id="tdns1blankspaceMainDetailsParticipantCanValue" class="ns1blankspaceMainText">' +
											'<input type="radio" id="radioParticipantCan1" name="radioParticipantCan" value="1"/>Add Posts & Comments' +
											'<br /><input type="radio" id="radioParticipantCan2" name="radioParticipantCan" value="2"/>Add Comments Only' +
											'<br /><input type="radio" id="radioParticipantCan3" name="radioParticipantCan" value="3"/>View Only' +
											'<br /><input type="radio" id="radioParticipantCan4" name="radioParticipantCan" value="4"/>Add Posts Only' +
											'</td></tr>';
											
							aHTML.push('<tr id="trns1blankspaceMainDetailsAlertURL" class="ns1blankspaceMain">' +
											'<td id="tdns1blankspaceMainDetailsAlertURL" class="ns1blankspaceMain">' +
											'URL For Alerts' +
											'</td></tr>' +
											'<tr id="trns1blankspaceMainDetailsURLValue" class="ns1blankspaceMainText">' +
											'<td id="tdns1blankspaceMainDetailsURLValue" class="ns1blankspaceMainText">' +
											'<input id="inputns1blankspaceMainDetailsAlertURL" class="inputns1blankspaceMainText">' +
											'</td></tr>';
											
						}			
						else
						{
							aHTML.push('<tr class="ns1blankspaceMainCaption">' +
												'<td class="ns1blankspaceMainRowNothing">Only the owner can change the conversation details.</td></tr>';
						}
						
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainDetailsColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.messaging.ConversationOwner)
						{
							var aHTML = [];
							var h = -1;
									
							aHTML.push('<table id="tablens1blankspaceMainDetailsColumn2" class="ns1blankspaceMain">';
							
							aHTML.push('<tr id="trns1blankspaceMainDetailsDescription" class="ns1blankspaceMain">' +
											'<td id="tdns1blankspaceMainDetailsDescription" class="ns1blankspaceMain">' +
											'Description' +
											'</td></tr>' +
											'<tr id="trns1blankspaceMainDetailsDescriptionValue" class="ns1blankspaceMainTextMulti">' +
											'<td id="tdns1blankspaceMainDetailsDescriptionValue" class="ns1blankspaceMainTextMulti">' +
											'<textarea rows="5" cols="35" onDemandType="TEXTMULTI" id="inputns1blankspaceMainDetailsDescription" class="inputns1blankspaceMainTextMulti"></textarea>' +
											'</td></tr>';
							
							aHTML.push('</table>';					
								
							$('#tdns1blankspaceMainDetailsColumn2').html(aHTML.join(''));
						}	
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputns1blankspaceMainDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#inputns1blankspaceMainDetailsDescription').val(ns1blankspace.objectContextData.description);
							$('#inputns1blankspaceMainDetailsAlertURL').val(ns1blankspace.objectContextData.alerturl);
							
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
					show:		function ns1blankspaceMessagingConversationParticipants(oParam)
								{
									var aHTML = [];
									var h = -1;	
													
									aHTML.push('<table id="tablens1blankspaceMainParticipants" class="ns1blankspaceMain">' +
													'<tr id="trns1blankspaceMainParticipantsRow1" class="ns1blankspaceMainRow1">' +
													'<td id="tdns1blankspaceMainParticipantsColumn1" class="ns1blankspaceMainColumn1Large">' +
													ns1blankspace.xhtml.loading +
													'</td>' +
													'<td id="tdns1blankspaceMainParticipantsColumn2" class="ns1blankspaceMainColumn2Action">' +
													'</td>' +
													'</tr>' +
													'</table>';					
													
									$('#divns1blankspaceMainParticipants').html(aHTML.join(''));	
									
									if (ns1blankspace.messaging.ConversationOwner)
									{	
										var aHTML = [];
										var h = -1;	
										
										aHTML.push('<table id="tablens1blankspaceMainColumn2" class="ns1blankspaceMainColumn2Action">';
																		
										aHTML.push('<tr><td id="tdns1blankspaceMainSend" class="ns1blankspaceMainAction">' +
															'<span id="spanns1blankspaceMainParticipantsAdd">Add</span>' +
															'</td></tr>';
														
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainParticipantsColumn2').html(aHTML.join(''));	
									
										$('#spanns1blankspaceMainParticipantsAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												ns1blankspaceMessagingConversationParticipantsAdd();
											})
									}		
									
									ns1blankspaceMessagingConversationParticipantsManage({xhtmlElementId: 'tdns1blankspaceMainParticipantsColumn1'});
								},		

					search: 	function ns1blankspaceMessagingConversationParticipantsManage(oParam, oResponse)
								{
									var sXHTMLElementId = 'divns1blankspaceMainParticipants';
									var sLabel = "Participants";
									var iOption = 1;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
									}

									if (oResponse == undefined)
									{
										var sData = 'conversation=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/messaging/?method=MESSAGING_CONVERSATION_PARTICIPANT_SEARCH',
											data: sData,
											dataType: 'json',
											success: function(data) {ns1blankspaceMessagingConversationParticipantsManage(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="tablens1blankspaceMessagingConversationHomeMostLikely">';
											aHTML.push('<tr class="ns1blankspaceMainCaption">' +
																'<td class="ns1blankspaceMainRowNothing">No participants.</td></tr>';
											aHTML.push('</tbody></table>';

											$('#tdns1blankspaceMainParticipantsColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="tableMessagingConversationParticipantsList" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push('<tbody>'
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceMainRow">';
																
												aHTML.push('<td id="tdMessagingConversationParticipantsList_userlogonname-' + this.user + '" class="ns1blankspaceMainRow">' +
																		this.userlogonname + '</td>';
																		
												aHTML.push('<td id="tdMessagingConversationParticipantsList-' + this.user + '" class="ns1blankspaceMainRowOptionsSelect">&nbsp;</td>';
																		
												aHTML.push('</tr>';		
											})
											
											aHTML.push('</tbody></table>';

											$('#' + sXHTMLElementId).html(aHTML.join(''));
											
											if (ns1blankspace.messaging.ConversationOwner)
											{
												$('.ns1blankspaceMainRowOptionsSelect').button( {
													text: false,
													 icons: {
														 primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspaceMessagingConversationParticipantsRemove(this.id)
												})
												.css('width', '15px')
												.css('height', '20px')
											}		
										}
									}	
								},	

					add: 		function ns1blankspaceMessagingConversationParticipantsAdd(oParam, oResponse)
								{
									var sXHTMLElementId = 'divns1blankspaceMainParticipantsAdd';
									var oSearch;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
										if (oParam.search != undefined) {oSearch = oParam.search}
									}
									
									if (oResponse == undefined)
									{		
										if (oSearch == undefined)
										{
											ns1blankspaceMainViewportShow('#' + sXHTMLElementId);
											
											var aHTML = [];
											var h = -1;	
														
											aHTML.push('<table id="tablens1blankspaceMainParticipantsAdd" class="ns1blankspaceMain">' +
															'<tr id="trns1blankspaceMainParticipantsAddRow1" class="ns1blankspaceMainRow1">' +
															'<td id="tdns1blankspaceMainParticipantsAddColumn1" class="ns1blankspaceMainColumn1">' +
															ns1blankspace.xhtml.loading +
															'</td>' +
															'<td id="tdns1blankspaceMainParticipantsAddColumn2" class="ns1blankspaceMainColumn2Action" style="width:50%;">' +
															'</td>' +
															'</tr>' +
															'</table>';					
															
											$('#divns1blankspaceMainParticipantsAdd').html(aHTML.join(''));	
											
											var aHTML = [];
											var h = -1;	
											
											aHTML.push('<table id="tablens1blankspaceMainParticipantsAdd" class="ns1blankspaceMain">';
											
											aHTML.push('<tr id="trns1blankspaceMainParticipantsAddFirstName" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainParticipantsAddFirstName" class="ns1blankspaceMain">' +
														'First Name' +
														'</td></tr>' +
														'<tr id="trns1blankspaceMainParticipantsAddFirstNameValue" class="ns1blankspaceMainText">' +
														'<td id="tdns1blankspaceMainParticipantsAddFirstNameValue" class="ns1blankspaceMainText">' +
														'<input id="inputns1blankspaceMainParticipantsAddFirstName" class="inputns1blankspaceMainText">' +
														'</td></tr>';							

											aHTML.push('<tr id="trns1blankspaceMainParticipantsAddSurname" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainParticipantsAddSurname" class="ns1blankspaceMain">' +
														'Surname' +
														'</td></tr>' +
														'<tr id="trns1blankspaceMainParticipantsAddSurnameValue" class="ns1blankspaceMainText">' +
														'<td id="tdns1blankspaceMainParticipantsAddSurnameValue" class="ns1blankspaceMainText">' +
														'<input id="inputns1blankspaceMainParticipantsAddSurname" class="inputns1blankspaceMainText">' +
														'</td></tr>';
														
											aHTML.push('<tr id="trns1blankspaceMainParticipantsAddEmail" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainParticipantsAddEmail" class="ns1blankspaceMain">' +
														'Email' +
														'</td></tr>' +
														'<tr id="trns1blankspaceMainParticipantsAddEmailValue" class="ns1blankspaceMainText">' +
														'<td id="tdns1blankspaceMainParticipantsAddEmailValue" class="ns1blankspaceMainText">' +
														'<input id="inputns1blankspaceMainParticipantsAddEmail" class="inputns1blankspaceMainText">' +
														'</td></tr>';
														
											aHTML.push('<tr id="trns1blankspaceMainParticipantsAddUserText" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainParticipantsAddUserText" class="ns1blankspaceMain">' +
														'Logon Name' +
														'</td></tr>' +
														'<tr id="trns1blankspaceMainParticipantsAddUserTextValue" class="ns1blankspaceMainText">' +
														'<td id="tdns1blankspaceMainParticipantsAddUserTextValue" class="ns1blankspaceMainText">' +
														'<input id="inputns1blankspaceMainParticipantsAddUserText" class="inputns1blankspaceMainText">' +
														'</td></tr>';
														
											aHTML.push('</table>';		
											
											aHTML.push('<table id="tablens1blankspaceMainColumn2" class="ns1blankspaceMainColumn2Action">';
												
											aHTML.push('<tr><td id="tdns1blankspaceParticipantsAddSearch" class="ns1blankspaceMainAction">' +
															'<span id="spanns1blankspaceParticipantsAddSearch">Search</span>' +
															'</td></tr>';
														
											aHTML.push('</table>';					
										
											$('#tdns1blankspaceMainParticipantsAddColumn1').html(aHTML.join(''))
											
											$('#spanns1blankspaceParticipantsAddSearch').button(
											{
												label: "Search"
											})
											.click(function() {
											
												var oSearchSet = {}
												if ($('#inputns1blankspaceMainParticipantsAddFirstName').val() != '')
												{
													oSearchSet.firstName = $('#inputns1blankspaceMainParticipantsAddFirstName').val()
												}
												if ($('#inputns1blankspaceMainParticipantsAddSurname').val() != '')
												{
													oSearchSet.surname = $('#inputns1blankspaceMainParticipantsAddSurname').val()
												}
												if ($('#inputns1blankspaceMainParticipantsAddEmail').val() != '')
												{
													oSearchSet.email = $('#inputns1blankspaceMainParticipantsAddEmail').val()
												}
												if ($('#inputns1blankspaceMainParticipantsAddUserText').val() != '')
												{
													oSearchSet.userText = $('#inputns1blankspaceMainParticipantsAddUserText').val()
												}
												if (oParam == undefined) {oParam = {}}
												oParam.search = oSearchSet;
												ns1blankspaceMessagingConversationParticipantsAdd(oParam);
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
												success: function(data){ns1blankspaceMessagingConversationParticipantsAdd(oParam, data)}
											});
										}	
									}
									else
									{
										if (oResponse.status == 'ER')
										{
											var aHTML = [];
											var h = -1;
											
											aHTML.push('<table id="tableMessagingConversationParticpantsAddSelect" border="0" cellspacing="0" cellpadding="0">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceMainCaption">' +
															'<td class="ns1blankspaceMainRowNothing">You need set the search criteria.</td></tr>';
											aHTML.push('</tbody></table>';

											$('#tdns1blankspaceMainParticipantsAddColumn2').html(aHTML.join(''));
										}
										else
										{
											var aHTML = [];
											var h = -1;
											
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table id="tableMessagingConversationParticpantsAddSelect" border="0" cellspacing="0" cellpadding="0">';
												aHTML.push('<tbody>'
												aHTML.push('<tr class="ns1blankspaceMainCaption">' +
																'<td class="ns1blankspaceMainRowNothing">No matching users.</td></tr>';
												aHTML.push('</tbody></table>';

												$('#tdns1blankspaceMainParticipantsAddColumn2').html(aHTML.join(''));
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
												
												aHTML.push('</tbody></table>';

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
											aHTML.push('</tbody></table>';
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
												
											aHTML.push('</tbody></table>';

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
							aHTML.push('</tbody></table>';
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
							
							aHTML.push('</tbody></table>';	
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
