/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.news = 
{
	init: 		function (oParam)
				{
					ns1blankspace.object = 19;
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectName = 'news';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'News';
					
					var bShowHome = true
					var bNew = false;
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
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

	home:		function (oResponse)
				{

					if (oResponse == undefined)
					{
						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceMain">');
						aHTML.push('<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ns1blankspaceMain">' +
										ns1blankspace.xhtml.loading + 
										'</td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						var aHTML = [];
									
						aHTML.push('<table>');
						aHTML.push('<tr>' +
										'<td id="ns1blankspaceViewNewsLarge" class="ns1blankspaceViewImageLarge">' +
										'&nbsp;' + 
										'</td>' +
										'</tr>');
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						sParam = '&rows=10';

						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('NEWS_SEARCH') + sParam,
							dataType: 'json',
							success: ns1blankspace.news.home
						});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr>');
							aHTML.push('<td class="ns1blankspaceNothing">Click New to create a news item.</td>');
							aHTML.push('</tr>');
							aHTML.push('</table>');
						}
						else
						{
						
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr>');
							aHTML.push('<td class="ns1blankspaceMain">MOST LIKELY</td>');
							aHTML.push('</tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
														'" class="ns1blankspaceMostLikely">' +
														this.subject + 
														'</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.news.search.send(event.target.id, {source: 1});
						});
						
					}
				},

search: 		{
					send: function (sXHTMLElementId, oParam)
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
										$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var sParam = '&advanced=1&select=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('NEWS_SEARCH') + sParam,
											dataType: 'json',
											success: function(data) {ns1blankspace.news.show(oParam, data)}
										});
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
											sElementId = 'ns1blankspaceViewBrowse';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.container.position({xhtmlElementID: sElementId});
											ns1blankspace.search.start();
											
											var sParam = '&advanced=1&quicksearch=' + sSearchText;

											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('NEWS_SEARCH') + sParam,
												dataType: 'json',
												success: function(data) {ns1blankspace.search.process(oParam, data)}
											});
										}
									}
								}

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
										aHTML.push('');
											
										$.each(oResponse.data.rows, function()
										{
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">');
											}
											
											aHTML.push('<td class="ns1blankspaceSearch" id="contactperson' +
															'-' + this.id + '">' +
															this.subject + 
															'</td>');
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');
										
										$(ns1blankspace.xhtml.container).html(
											ns1blankspace.render.init(
											{
												html: aHTML.join(''),
												more: (oResponse.morerows == "true")
											}) 
										);		
										
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										ns1blankspace.search.stop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.news.search(event.target.id, {source: 1});
										});
										
										ns1blankspace.pagination.bind(
										{
											columns: 'subject',
											more: oResponse.moreid,
											rows: 15,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: oResponse.news.search.send
										});   
										
									}	
								}
				},

	layout: 	function ()
				{	
					if (tinyMCE.getInstanceById('ns1blankspaceEditText'))
					{
						tinyMCE.get('ns1blankspaceEditText').remove();
						$('#ns1blankspaceEditText').remove();
					}	
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">Details</td></tr>');
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">Summary</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">Details</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlEdit" class="ns1blankspaceControl">Edit</td></tr>');
					
						aHTML.push('<tr><td id="ns1blankspaceControlSendTo" class="ns1blankspaceControl">Send To</td></tr>');
											
						aHTML.push('</table>');		
					
						aHTML.push('<table class="ns1blankspaceControl">');
					
						aHTML.push('<tr><td id="ns1blankspaceControlTracking" class="ns1blankspaceControl">Tracking</td></tr>');
					}
							
					aHTML.push('</table>');					
						
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>';
					aHTML[++h] = '<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>';
					aHTML[++h] = '<div id="ns1blankspaceMainEdit" class="ns1blankspaceControlMain"></div>';
					aHTML[++h] = '<div id="ns1blankspaceMainSendTo" class="ns1blankspaceControlMain"></div>';
					aHTML[++h] = '<div id="ns1blankspaceMainTracking" class="ns1blankspaceControlMain"></div>';
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show("#ns1blankspaceMainSummary", true);
						ns1blankspace.news.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show("#ns1blankspaceMainDetails");
						ns1blankspace.news.details();
					});
					
					$('#ns1blankspaceControlEdit').click(function(event)
					{
						ns1blankspace.show("#ns1blankspaceMainEdit");
						ns1blankspace.news.edit();
					});

					$('#ns1blankspaceControlSendTo').click(function(event)
					{
						ns1blankspace.show("#ns1blankspaceMainSendTo", true);
						ns1blankspace.news.sendTo();
					});
					
					$('#ns1blankspaceControlTracking').click(function(event)
					{
						ns1blankspace.show("#ns1blankspaceMainTracking");
						ns1blankspace.news.tracking();
					});
					
				},

	show: 		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.contactPerson.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find news item.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.subject);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.news.init({showHome: false});ns1blankspace.news.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.news.summary()'});
					}	
				},		
		
	summary: 	function ()
				{

					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this news item.</td></tr></table>');
								
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
					
						var aHTML = [];
						var sTmp = ns1blankspace.objectContextData.startdate;
						if (sTmp == '&nbsp;') {sTmp = 'Not set.'};
					
						aHTML.push('<table class="ns1blankspaceColumn1">');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Start Date</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryTypeValue" class="ns1blankspaceSummary">' +
										sTmp +
										'</td></tr>');
										
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">&nbsp;</td></tr>' +
										'<tr><td id="ns1blankspaceSummarySummaryValue" class="ns1blankspaceSummary">' +
										ns1blankspaceFormatXHTML(ns1blankspace.objectContextData.news) +
										'</td></tr>');
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2Action" cellspacing=0>');
						
						aHTML.push('<tr><td class="ns1blankspaceColumn2Action">' +
										'<span id="ns1blankspaceSummarySendPreviewEmail">Send&nbsp;preview&nbsp;email&nbsp;to&nbsp;me</a>' +
										'</td></tr>');
						
						aHTML.push('<tr><td class="ns1blankspaceColumn2Action">' +
										'<span id="ns1blankspaceSummarySendAsEmail">Send&nbsp;as&nbsp;email</a>' +
										'</td></tr>');
						
						aHTML.push('<tr><td class="ns1blankspaceColumn2Action">' +
										'<span id="ns1blankspaceSummaryCopy">Copy</a>' +
										'</td></tr>');
								
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));	
						
						$('#ns1blankspaceSummarySendPreviewEmail').click(function(event)
						{
							ns1blankspace.news.sendAsEmail(true);
						});
						
						$('#ns1blankspaceSummarySendAsEmail').click(function(event)
						{
							ns1blankspace.news.sendAsEmail(false);
						});
						
						$('#ns1blankspaceSummaryCopy').click(function(event)
						{
							ns1blankspace.news.copy();
						});
					}	
				},

	details: 	function ()
				{
					var aHTML = [];
					
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
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Title' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsSubject" class="ns1blankspaceText">' +
										'</td></tr>');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Start Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsStartDate" class="ns1blankspaceDate">' +
										'</td></tr>');			
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'End Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsEndDate" class="ns1blankspaceDate">' +
										'</td></tr>');			
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'From Email' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsFromEmail" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Sharing' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input type="radio" id="radioPublicY" name="radioPublic" value="Y"/>Public' +
										'<br /><input type="radio" id="radioPublicN" name="radioPublic" value="N"/>Private' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Tracking' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioTracking1" name="radioTracking" value="1"/>No Tracking' +
										'<br /><input type="radio" id="radioTracking2" name="radioTracking" value="2"/>When viewed' +
										'<br /><input type="radio" id="radioTracking3" name="radioTracking" value="3"/>When a link is clicked' +
										'<br /><input type="radio" id="radioTracking4" name="radioTracking" value="4"/>When viewed &/or a link is clicked' +
										'</td></tr>');
								
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;
							
						aHTML.push('<tableclass="ns1blankspaceCaption">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'News Summary' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="10" cols="35" id="ns1blankspaceDetailsSummary" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');
						
						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						$('input.ns1blankspaceDate').datepicker({ dateFormat: ns1blankspace.option.dateFormat });
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsSubject').val(ns1blankspace.objectContextData.subject);
							
							var sTmp = ns1blankspace.objectContextData.startdate;
							if (sTmp == '&nbsp;') {sTmp = ''};
							$('#ns1blankspaceDetailsStartDate').val(sTmp);
							
							var sTmp = ns1blankspace.objectContextData.enddate;
							if (sTmp == '&nbsp;') {sTmp = ''};
							$('#ns1blankspaceDetailsEndDate').val(sTmp);
							
							$('#ns1blankspaceDetailsFromEmail').val(ns1blankspace.objectContextData.fromemail);
							$('#ns1blankspaceDetailsSummary').val(ns1blankspace.objectContextData.summary);
							
							$('[name="radioPublic"][value="' + ns1blankspace.objectContextData.public + '"]').attr('checked', true);
							$('[name="radioTracking"][value="' + ns1blankspace.objectContextData.tracking + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioPublic"][value="N"]').attr('checked', true);
							$('[name="radioTracking"][value="4"]').attr('checked', true);
							var ns1blankspace.report.today = new Date()
							$('#ns1blankspaceDetailsStartDate').val($.fullCalendar.formatDate(ns1blankspace.report.today, "dd MMM yyyy"));
						}
						
					}	
				},

	edit: 		function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainEdit').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainEdit').attr('data-loading', '');

						for (edId in tinyMCE.editors) 
									tinyMCE.editors[edId].destroy(true);
								
						ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;		
								
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceEditColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceEditColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' +
										'</table>');					
						
						$('#ns1blankspaceMainEdit').html(aHTML.join(''));
						
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspace">');
								
						aHTML.push('<tr class="ns1blankspaceTextMulti">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="30" cols="50" onDemandType="TEXTMULTI" id="ns1blankspaceEditText' +
													ns1blankspace.counter.editor + '" editorcount="' + ns1blankspace.counter.editor + '" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceEditColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							var sHTML = ns1blankspaceFormatXHTML(ns1blankspace.objectContextData.news);
							$('#ns1blankspaceEditText' + ns1blankspace.counter.editor).val(sHTML);
						}
					
						if (ns1blankspace.option.richTextEditing)
						{
							tinyMCE.execCommand('mceAddControl', false, 'ns1blankspaceEditText' + ns1blankspace.counter.editor);
						}	
					}	
				},

	new: 		function ()
				{
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.news.init();
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlActionOptions').button({disabled: true});
					ns1blankspace.news.details();
				},

	copy:		function (oParam, oResponse)
				{
					if (ns1blankspace.objectContext != -1)
					{
						if (oReponse == undefined)
						{
							var sParam = '&id=' + ns1blankspace.objectContext;

							$.ajax(
							{
								type: 'GET',
								url: ns1blankspace.util.endpointURI('NEWS_COPY'),
								dataType: 'json',
								success: function(data) {ns1blankspace.news.copy(oParam, data)}
							});
						}	
						else	
						{
							ns1blankspace.objectContext = oResponse.data.rows[0].id;
							ns1blankspace.news.show(oParam, oResponse)
							ns1blankspace.status.message('Copied');
							$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
							$(ns1blankspace.xhtml.container).attr('data-initiator', '');
						}	
					}	
				},

	groups: 	{
					show: 		function (oParam)
								{
									var aHTML = [];
													
									aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceGroupsColumn1" class="ns1blankspaceColumn1"></td>' +
													'<td id="ns1blankspaceGroupsColumn2" class="ns1blankspaceColumn2"></td>' +
													'</tr>' +
													'</table>');					
									
									$('#ns1blankspaceMainGroups').html(aHTML.join(''));
									
									var aHTML = [];
									
									aHTML.push('<table class="ns1blankspaceColumn2Action">');
														
									aHTML.push('<tr><td class="ns1blankspaceColumn2Action">' +
													'<span id="ns1blankspaceGroupsManage">Show Groups</a>' +
													'</td></tr>');
									
									aHTML.push('<tr><td>&nbsp;' +
													'</td></tr>');		
													
									aHTML.push('<tr><td class="ns1blankspaceColumn2Action">' +
													'<span id="ns1blankspaceGroupsContacts">Show Contacts</a>' +
													'</td></tr>');
											
									aHTML.push('<tr><td>&nbsp;' +
													'</td></tr>');		
											
									aHTML.push('<tr><td class="ns1blankspaceColumn2Action">' +
														'<span id="ns1blankspaceGroupsSend">Send</span>' +
														'</td></tr>');
													
									aHTML.push('</table>');					
									
									$('#ns1blankspaceGroupsColumn2').html(aHTML.join(''));	
									
									$('#ns1blankspaceGroupsManage').click(function(event)
									{
										ns1blankspace.news.groups.save({xhtmlElementId: 'ns1blankspaceGroupsColumn1'});
									});
									
									$('#ns1blankspaceGroupsContacts').click(function(event)
									{
										ns1blankspace.news.groups.save({xhtmlElementId: 'ns1blankspaceGroupsColumn1'});
									});
									
									$('#ns1blankspaceGroupsSend').button(
										{
											label: "Send"
										})
										.click(function() {
											ns1blankspaceOptionsSetPosition('ns1blankspaceNewsGroupsAdd');
											1blankspace.news.sendAsEmail(false);
										})
										.css('width', '75px')
									
									ns1blankspace.news.groups.save({xhtmlElementId: 'ns1blankspaceGroupsColumn1'});
								},		

					search:		function (oParam, oResponse)
								{	
									var sXHTMLElementId = 'ns1blankspaceMainGroups';
									var sLabel = "groups";
									var iOption = 1;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
									}

									if (oResponse == undefined)
									{
										var sData = '&rows=30&id=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('NEWS_CONTACT_PERSON_SEARCH'),
											data: sData,
											dataType: 'json',
											success: function(data){ns1blankspace.news.groups.search(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">' +
															'<tr><td class="ns1blankspaceNothing">No contacts.</td></tr>' +
															'</table>');
										}
										else
										{		
											aHTML.push('<table class="ns1blankspace" border="0" cellspacing="0" cellpadding="0" >');
											
											aHTML.push('<tr>');
											aHTML.push('<td class="ns1blankspaceCaption">First Name</td>');
											aHTML.push('<td class="ns1blankspaceCaption">Surname</td>');
											aHTML.push('<td class="ns1blankspaceCaption">Email</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.news.groups.row(this));
											});
											
											aHTML.push('</table>');
										}
										
										$('#' + sXHTMLElementId).html(aHTML.join(''));
										
										ns1blankspacePaginationList(
										{
											xhtmlElementID: sXHTMLElementId,
											xhtmlContext: 'NewsGroupsContacts',
											xhtml: aHTML.join(''),
											showMore: (oResponse.morerows == "true"),
											more: oResponse.moreid,
											rows: ns1blankspace.option.defaultRows,
											functionShowRow: ns1blankspace.news.groups.row,
											type: 'json'
										}); 	
										
										$('#ns1blankspaceGroupsManageActions').html('');
									}	
								},	

					row:		function (oRow)
								{
									var aHTML = [];
									var h = -1;
									
									aHTML[++h] = '<tr class="ns1blankspaceRow">';
															
									aHTML[++h] = '<td id="ns1blankspaceNewsGroupsContacts_contact-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.firstname + '</td>';
															
									aHTML[++h] = '<td id="ns1blankspaceNewsGroupsContacts_activity-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.surname + '</td>';
															
									aHTML[++h] = '<td id="ns1blankspaceNewsGroupsList_link-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.email + '</td>';
															
									aHTML[++h] = '</tr>';
												
									return aHTML.join('');
								},	


					save:		function (oParam, oResponse)
								{
									var sXHTMLElementId = 'ns1blankspaceMainGroups';
									var sLabel = "groups";
									var iOption = 1;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
									}

									if (oResponse == undefined)
									{
										var sParam = 'rows=20&news=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('NEWS_PERSON_GROUP_SEARCH'),
											data: sParam,
											dataType: 'json',
											success: function(data){ns1blankspace.news.groups.save(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2Action">');
										
										aHTML.push('<tr><td>' +
														'&nbsp;' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceGroupsManageActions').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table border="0" cellspacing="0" cellpadding="0" class="ns1blankspace">');
										aHTML.push('<tr class="ns1blankspaceCaption"><td id="ns1blankspaceNewsGroupsColumn1Options">&nbsp;</td></tr>');
										aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td id="ns1blankspaceNewsGroupsColumn1Groups"></td></tr>');
										aHTML.push('</table>');

										$('#ns1blankspaceGroupsColumn1').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspace">');
										
										aHTML.push('<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioEmailTo1" name="radioEmailTo" value="1"/>No one' +
														'&nbsp;&nbsp;<input type="radio" id="radioEmailTo2" name="radioEmailTo" value="2"/>Everyone' +
														'&nbsp;&nbsp;<input type="radio" id="radioEmailTo3" name="radioEmailTo" value="3"/>Selected Groups' +
														'&nbsp;&nbsp;<span id="ns1blankspaceNewsGroupsAdd">Add</span>' +
														'</td></tr>');

										aHTML.push('<tr><td colspan=2>&nbsp;</td></tr>');

										aHTML.push('</table>');					
										
										$('#ns1blankspaceNewsGroupsColumn1Options').html(aHTML.join(''));
										
										$('#ns1blankspaceNewsGroupsAdd').button(
										{
												text: false,
												icons: {
													 primary: "ui-icon-plus"
												}
										})
										.click(function() {
											ns1blankspaceOptionsSetPosition('ns1blankspaceNewsGroupsAdd', -28, 32);
											ns1blankspace.news.groups.add(oParam);
										})
										.css('width', '25px')
										.css('font-size', '0.75em')
										
										var aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											iOption = 1;
										}
										else
										{
											iOption = 3;
											
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" class="ns1blankspace">');
											
											$.each(oResponse.data.rows, function()
											{
												if (parseInt(this.group) == -1) 
												{
													iOption = 2
												}
												else
												{
													if (this.grouptext != '')
													{
														aHTML.push('<tr class="ns1blankspaceRow">');
																		
														aHTML.push('<td id="ns1blankspaceNewsGroupsList-title-' + this.group + '" class="ns1blankspaceRow">' +
																				this.grouptext + '</td>');
																									
														aHTML.push('<td id="ns1blankspaceNewsGroupsList-' + this.group + '" class="ns1blankspaceRow ns1blankspaceRowRemove">&nbsp;</td>');
																				
														aHTML.push('</tr>');
													}	
												}		
												
											});
											
											aHTML[++h] = '</table>';

											$('#ns1blankspaceNewsGroupsColumn1Groups').html(aHTML.join(''));
											
											$('.ns1blankspaceRowRemove').button( {
												text: false,
												 icons: {
													 primary: "ui-icon-close"
												}
											})
											.click(function() {
												ns1blankspace.news.groups.remove(this.id)
											})
											.css('width', '15px')
											.css('height', '20px')
										}
										
										$('[name="radioEmailTo"][value="' + iOption + '"]').attr('checked', true);
									}	
								},

					add:		function (oParam, oResponse)
								{		
									if ($(ns1blankspace.xhtml.container).attr('data-initiator') == 'ns1blankspaceNewsGroupsAdd')
									{
										$(ns1blankspace.xhtml.container).slideUp(500);
										$(ns1blankspace.xhtml.container).attr('data-initiator', '');
									}
									else
									{
										if (oResponse == undefined)
										{
											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('SETUP_CONTACT_PERSON_GROUP_SEARCH'),
												dataType: 'xml',
												success: function(data){ns1blankspace.news.groups.add(oParam, data)}
											});
										}
										else
										{
											$(ns1blankspace.xhtml.container).attr('data-initiator', 'ns1blankspaceNewsGroupsAdd')
											
											
											var aHTML = [];
											
											if (oResponse.data.rows.length == 0)
											{	
												aHTML.push('<table class="ns1blankspaceSearchMedium">' + 
																'<tr><td class="ns1blankspaceNothing">No groups.</td></tr>' + 
																'</table>');

												$(ns1blankspace.xhtml.container).html(aHTML.join(''));
												$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);

												$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
												$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
											}
											else
											{
												aHTML.push('<table class="ns1blankspaceSearchMedium" style="font-size:0.725em;">');
												
												$.each(oResponse.data.rows, function()
												{	
													aHTML.push('<tr class="ns1blankspaceRow">' +
																	'<td id="ns1blankspaceGroupsAdd-title-' + this.id + '" class="ns1blankspaceRowSelect ns1blankspaceGroupsAddRowSelect">' +
																			this.title + '</td>');
													
													aHTML.push('</tr>');
												});
												
												aHTML.push('</table>');

												$(ns1blankspace.xhtml.container).html(aHTML.join(''));
												$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
												
												$('td.ns1blankspaceGroupsAddRowSelect').click(function(event)
												{
													ns1blankspace.news.groups.select(event.target.id);
												});
											}
										}
									}	
								},
										
					select:		function (sXHTMLElementId)
								{

									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[2];
									
									$('#' + sXHTMLElementId).fadeOut(500);
									
									var sData = 'news=' + ns1blankspace.objectContext +
												'&group=' + sSearchContext;
												
									$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('NEWS_PERSON_GROUP_MANAGE'),
											data: sData,
											dataType: 'text',
											success: function(data){ns1blankspace.news.groups.show()}
										});
										
								},

					remove:		function (sXHTMLElementId)
								{

									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									
									var sData = 'remove=1' + 
												'&news=' + ns1blankspace.objectContext +
												'&group=' + sSearchContext;
												
									$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('NEWS_PERSON_GROUP_MANAGE'),
											data: sData,
											dataType: 'text',
											success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
										});
										
								}
				},				

	tracking: 	{
					show: 	function (oParam)
								{
									var aHTML = [];
									aHTML.push('<table class="ns1blankspaceContainer">' +
												'<tr class="ns1blankspaceContainer">' +
												'<td id="ns1blankspaceNewsTrackingColumn1" class="ns1blankspaceColumn1Large">' +
												ns1blankspace.xhtml.loading +
												'</td>' +
												'<td id="ns1blankspaceNewsTrackingColumn2" style="width: 100px;" class="ns1blankspaceColumn2Action">' +
												'</td>' +
												'</tr>' +
												'</table>');				
													
									$('#ns1blankspaceMainTracking').html(aHTML.join(''));	
									
									var aHTML = [];
									
									aHTML.push('<table class="ns1blankspaceColumn2Action">');
															
									aHTML.push('<tr><td class="ns1blankspaceSummary">' +
													'<span id="ns1blankspaceTrackingSummary">Summary</a>' +
													'</td></tr>');
									
									aHTML.push('<tr><td class="ns1blankspaceSummary">' +
													'<span id="ns1blankspaceTrackingDetails">Details</a>' +
													'</td></tr>');
											
									aHTML.push('</table>');					
									
									$('#ns1blankspaceNewsTrackingColumn2').html(aHTML.join(''));	
									
									$('#ns1blankspaceTrackingSummary').click(function(event)
									{
										ns1blankspace.news.tracking.summary({xhtmlElementId: 'ns1blankspaceNewsTrackingColumn1'});
									});
									
									$('#ns1blankspaceTrackingDetails').click(function(event)
									{
										ns1blankspace.news.tracking.details({xhtmlElementId: 'ns1blankspaceNewsTrackingColumn1'});
									});
									
									ns1blankspace.news.tracking.summary({xhtmlElementId: 'ns1blankspaceNewsTrackingColumn1'});
								},		

					summary:	function (oParam, oResponse)
								{
									
									var sXHTMLElementId = 'ns1blankspaceMainTracking';
									var sLabel = "groups";
									var iOption = 1;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
									}

									if (oResponse == undefined)
									{
										var sParam = '&rows=20' +
														'&news=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('NEWS_TRACKING_SUMMARY') + sParam,
											dataType: 'json',
											success: function(data){ns1blankspace.news.tracking.summary(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
											
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table>');
											aHTML.push('<tr class="ns1blankspaceCaption">' +
																'<td class="ns1blankspaceNothing">No tracking information available.</td></tr>');
											aHTML.push('</table>');
										}
										else
										{
											aHTML.push('<table class="ns1blankspace">');
												
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" class="ns1blankspace">');
											aHTML.push(''
											
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceCaption">Activity</td>');
											aHTML.push('<td class="ns1blankspaceCaption">Link</td>');
											aHTML.push('<td class="ns1blankspaceCaption">Count</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																		
												aHTML.push('<td id="ns1blankspaceNewsGroupsList_activity-' + this.id + '" class="ns1blankspaceRow">' +
																		this.activity + '</td>');
																		
												aHTML.push('<td id="ns1blankspaceNewsGroupsList_link-' + this.id + '" class="ns1blankspaceRow">' +
																		this.link + '</td>');
												
												aHTML.push('<td id="ns1blankspaceNewsGroupsList_link-' + this.id + '" class="ns1blankspaceRow">' +
																		this.count + '</td>');
																		
												aHTML.push('</tr>'
											});
											
											aHTML.push('</table>');
										}
										
										$('#' + sXHTMLElementId).html(aHTML.join(''));
									}	
								}	

					details:	function (oParam, oResponse)
								{
									
									var sXHTMLElementId = 'ns1blankspaceMainTracking';
									var sLabel = "groups";
									var iOption = 1;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
									}

									if (oResponse == undefined)
									{
										var sParam = '&rows=20' +
														'&news=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('NEWS_TRACKING_SEARCH') + sParam,
											dataType: 'json',
											success: function(data){ns1blankspace.news.tracking.details(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
								
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table>' +
															'<tr><td class="ns1blankspaceNothing">No tracking information available.</td></tr>' +
															'</table>');
										}
										else
										{		
											aHTML.push('<table class="ns1blankspace">');
												
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" class="ns1blankspace">');
											
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceCaption">Contact</td>');
											aHTML.push('<td class="ns1blankspaceCaption">Activity</td>');
											aHTML.push('<td class="ns1blankspaceCaption">Link</td>');
											aHTML.push('<td class="ns1blankspaceCaption">Date & Time</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceNewsGroupsList_contact-' + this.contactperson + '" class="ns1blankspaceRow">' +
																		this.contactpersontext + '</td>');
																		
												aHTML.push('<td id="ns1blankspaceNewsGroupsList_activity-' + this.id + '" class="ns1blankspaceRow">' +
																		this.activity + '</td>');
																		
												aHTML.push('<td id="ns1blankspaceNewsGroupsList_link-' + this.id + '" class="ns1blankspaceRow">' +
																		this.link + '</td>');
												
												aHTML.push('<td id="ns1blankspaceNewsGroupsList_link-' + this.id + '" class="ns1blankspaceRow">' +
																		this.datetime + '</td>');
																		
												aHTML.push('</tr>');	
											});
											
											aHTML.push('</table>');
										}
										$('#' + sXHTMLElementId).html(aHTML.join(''));
									}	
								}
				},				

	save: 		{
					send: 		function ()
								{
									var sParam = 'method=NEWS_MANAGE';
									var sData = '_=1';
									
									if (ns1blankspace.objectContext != -1)
									{
										sParam += '&select=' + ns1blankspace.objectContext	
									}	
									
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&subject=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSubject').val());
										sData += '&startdate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsStartDate').val());
										sData += '&stopdate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEndDate').val());
										sData += '&fromemail=' + $('#ns1blankspaceDetailsFromEmail').val();
										sData += '&public=' + $('input[name="radioPublic"]:checked').val();
										sData += '&summary=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSummary').val());
										sData += '&tracking=' + $('input[name="radioTracking"]:checked').val();
									}
									
									if ($('#ns1blankspaceMainEdit').html() != '')
									{
										sData += '&news=' + ns1blankspace.util.fs((tinyMCE.get('ns1blankspaceEditText' + ns1blankspace.counter.editor).getContent());
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('NEWS_MANAGE'),
										data: sData,
										dataType: 'json',
										success: ns1blankspace.news.save.process
									});	
								},

					process:	function (oResponse)
								{

									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
											
										if ($('#ns1blankspaceMainGroups').html() != '')
										{
											if ($('input[name="radioEmailTo"]:checked').val() == '1')
											{
											
												var sParam = '&remove=2';
												var sData = 'news=' + ns1blankspace.objectContext;
													
												$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('NEWS_PERSON_GROUP_MANAGE') + sParam,
														data: sData,
														dataType: 'text',
														success: function(data){ns1blankspace.news.groups()}
													});
												
											}
											
											if ($('input[name="radioEmailTo"]:checked').val() == '2')
											{
											
												var sData = 'news=' + ns1blankspace.objectContext +
															'&group=-1';
													
												$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('NEWS_PERSON_GROUP_MANAGE'),
														data: sData,
														dataType: 'text',
														success: function(data){ns1blankspace.news.groups()}
													});
													
											}

											if (bNew) {
												ns1blankspace.news.search('-' + ns1blankspace.objectContext)
											}
										}	
										
										// ToDo: These lines may be required if MANAGE method doesn't return JSON
										//var aResponse = sResponse.split('|');
										//if (aResponse.length == 4)	
										//{ns1blankspace.objectContext = aResponse[3]};
										//ns1blankspace.inputDetected = false;
										//ns1blankspace.news.search('-' + ns1blankspace.objectContext, {source: 1});
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}
				},					

	sendAsEmail: function (bPreview)
				{
					var sMessage = 'News sent as email to contacts.';
					
					if (bPreview)
					{
						sMessage = 'News sent as email to you.';
						sParam += '&preview=1';	
					}	
					
					if (ns1blankspace.objectContext != -1)
					{
						
						sParam += '&select=' + ns1blankspace.objectContext	
					
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('NEWS_SEND'),
							dataType: 'text',
							success: ns1blankspace.status.message(sMessage)
						});
					}		
					
				}
}