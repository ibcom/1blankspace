/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.document = 
{
	data: 		{},

	init: 		function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 14;
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectName = 'document';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Documents';
					
					ns1blankspace.document.data.websiteContext = ((oParam?oParam:{}).websiteContext ? oParam.websiteContext : undefined);

					ns1blankspace.app.set(oParam);
				},

	home:		function (oParam, oResponse)
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

						aHTML.push('<tr><td><div id="ns1blankspaceViewDocumentLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
							
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	

						var oSearch = new AdvancedSearch();
						oSearch.method = 'DOCUMENT_SEARCH';
						oSearch.addField('title');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(function(data) {ns1blankspace.document.home(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a document.</td></tr>' +
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
							ns1blankspace.document.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
				
					send: 		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
									var sSearchContext = aSearch[1];
									var iMinimumLength = 0;
									var iSource = ns1blankspace.data.searchSource.text;
									var sSearchText;
									var iMaximumColumns = 1;
									var iRows = 10;
									var bWebsiteOnly = false;
									
									if (oParam != undefined)
									{
										if (oParam.source != undefined) {iSource = oParam.source}
										if (oParam.searchText != undefined) {sSearchText = oParam.searchText}
										if (oParam.rows != undefined) {iRows = oParam.rows}
										if (oParam.searchContext != undefined) {sSearchContext = oParam.searchContext}
										if (oParam.minimumLength != undefined) {iMinimumLength = oParam.minimumLength}
										if (oParam.maximumColumns != undefined) {iMaximumColumns = oParam.maximumColumns}
										if (oParam.websiteOnly != undefined) {bWebsiteOnly = oParam.websiteOnly}
									}
									
									if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
									{
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;

										var oSearch = new AdvancedSearch();
										oSearch.method = 'DOCUMENT_SEARCH';
										oSearch.addField('title,summary,keywords,url,status,statustext,public,website,websitetext,style,internal,content,type,typetext,modifieddate');

										oSearch.addField(ns1blankspace.option.auditFields);
										
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(data) {ns1blankspace.document.show(oParam, data)});
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
											ns1blankspace.search.start();

											var oSearch = new AdvancedSearch();
											oSearch.method = 'DOCUMENT_SEARCH';
											oSearch.addField('title');
											oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);

											if (ns1blankspace.document.data.websiteContext)
											{
												oSearch.addFilter('foldertitle', 'EQUAL_TO', '[My Website Documents]');
											}

											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.getResults(function(data) {ns1blankspace.document.search.process(oParam, data)});
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var	iMaximumColumns = 1;
											
									ns1blankspace.search.stop();
												
									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
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
											
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'-' + this.id + '">' +
															this.title + '</td>');
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.searchContainer).html(
											ns1blankspace.render.init(
											{
												html: aHTML.join(''),
												more: (oResponse.morerows == "true"),
												header: false
											}) 
										);	
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
											$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.document.search.send(event.target.id, 1);
										});

										ns1blankspace.render.bind(
										{
											columns: 'title',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.document.search.send
										});   
									}	
								}
				},

	layout: 	function ()
				{
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
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

						aHTML.push('</table>');	

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlEdit" class="ns1blankspaceControl">' +
										'Edit</td></tr>');
					}	
					
					aHTML.push('</table>');					
								
					if (ns1blankspace.objectContext != -1)
					{		
						aHTML.push('<table class="ns1blankspaceControl">');
									
						aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');

						aHTML.push('</table>');
					}	

					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainEdit" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
							
					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.document.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.document.details();
					});

					$('#ns1blankspaceControlEdit').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});
						ns1blankspace.document.edit();
					});

					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments'});
						ns1blankspace.attachments.show();
					});

					if (ns1blankspace.option.richTextEditing)
					{	
						if (tinyMCE.getInstanceById('ns1blankspaceDocumentEditText'))
						{
							tinyMCE.get('ns1blankspaceDocumentEditText').remove();
							$('#ns1blankspaceDocumentEditText').remove();
						}	
					}
				},

	show: 		function (oParam, oResponse)
				{
					ns1blankspace.app.clean();
					ns1blankspace.document.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this document.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.document.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.document.summary()'});
					}	
				},		
		
	summary: 	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this document.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:250px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');
						
						if (ns1blankspace.objectContextData.summary != '')
						{	
							aHTML.push('<tr><td id="ns1blankspaceSummarySummary" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.summary +
										'</td></tr>');
						}		
						
						var oDate = new Date(ns1blankspace.objectContextData.modifieddate);

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Last Updated</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryLastUpdated" class="ns1blankspaceSummary">' +
										oDate.toString("dd MMM yyyy") +
										'</td></tr>');	

						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption" style="padding-bottom:10px;">' +
										(ns1blankspace.objectContextData.public=='Y'?'<span style="color:#CC0000;">Public</span>':'Private') +
										'</td></tr>');

						if (ns1blankspace.objectContextData.internal != 'N')
						{	
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">' +
										'All internal users' +
										'</td></tr>');
						}	

						aHTML.push('</table>');					
					
						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));	
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
										'<input id="ns1blankspaceDetailsTitle" class="ns1blankspaceText">' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'URL' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsURL" class="ns1blankspaceText">' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Document Summary' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="10" cols="35" id="ns1blankspaceMainDetailsSummary" class="inputns1blankspaceMainTextMulti" style="width:100%;"></textarea>' +
										'</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						var aHTML = [];
							
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Share with internal users' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioInternalY" name="radioInternal" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioInternalN" name="radioInternal" value="N"/>No' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption" style="padding-top:10px;">' +
										'Share with external users' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioPublicY" name="radioPublic" value="Y"/>Yes&nbsp;<span class="ns1blankspaceSub">(Public)</span>' +
										'<br /><input type="radio" id="radioPublicN" name="radioPublic" value="N"/>No&nbsp;<span class="ns1blankspaceSub">(Private)</span>' +
										'</td></tr>');	
						
						aHTML.push('</table>');					
							
						aHTML.push('<table class="ns1blankspace" style="margin-top:10px;">' +
										'<tr>' + 
										'<td class="ns1blankspaceCaption" id="ns1blankspaceDocumentNetworkGroupsCaption">Shared With</td>' +
										'<td style="padding-right:10px; text-align:right;">' +
										'<span class="ns1blankspaceAction" id="ns1blankspaceDocumentNetworkGroupsAdd"></span></td>' +
										'</tr>');

						aHTML.push('<td colspan=2 class="ns1blankspaceText" id="ns1blankspaceDocumentNetworkGroups">' +
										'<table><tr><td class="ns1blankspaceNothing">No one.</td></tr></table> ' +
										'</td></tr>');

						aHTML.push('</table>');

						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#ns1blankspaceDetailsURL').val(ns1blankspace.objectContextData.url);
							$('#ns1blankspaceDetailsSummary').val(ns1blankspace.objectContextData.summary);
							$('[name="radioPublic"][value="' + ns1blankspace.objectContextData.public + '"]').attr('checked', true);
							$('[name="radioInternal"][value="' + ns1blankspace.objectContextData.internal + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioPublic"][value="N"]').attr('checked', true);
							$('[name="radioInternal"][value="Y"]').attr('checked', true);
						}

						if (ns1blankspace.objectContext != -1)
						{	
							ns1blankspace.setup.networkGroup.groups.init(
							{
								xhtmlElementContainerID: 'ns1blankspaceDocumentNetworkGroups',
								xhtmlElementAddID: 'ns1blankspaceDocumentNetworkGroupsAdd',
								object: 14,
								objectcontext: ns1blankspace.objectContext
							});
						}	
					}	
				},

	edit: 		function (sReturn)
				{	
					if ($('#ns1blankspaceMainEdit').attr('data-loading') == '1')
					{
						var aHTML = [];
						
							aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceEditColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceEditColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');		
							
						$('#ns1blankspaceMainEdit').html(aHTML.join(''));
							
						$('#ns1blankspaceEditPDF').click(function(event)
						{
							ns1blankspace.document.pdf();
						});
						
						if (sReturn == undefined)
						{
							if (ns1blankspace.objectContext != -1)
							{
								$.ajax(
								{
									type: 'GET',
									cache: false,
									url: ns1blankspace.util.endpointURI('DOCUMENT_CONTENT_SEARCH'),
									data: 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
									dataType: 'text',
									success: ns1blankspace.document.edit
								});
							}
							else
							{
								ns1blankspace.document.edit('');
							}
							
						}
						else
						{
							$('#ns1blankspaceMainEdit').attr('data-loading', '');
							
							var sHTML = sReturn;
							
							for (edId in tinyMCE.editors) 
													tinyMCE.editors[edId].destroy(true);
												
							ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;

							var aHTML = [];
						
							aHTML.push('<table class="ns1blankspace">');
									
							aHTML.push('<tr class="ns1blankspaceMainTextMulti">' +
											'<td class="ns1blankspaceMainTextMulti">' +
											'<textarea rows="10" cols="60" name="ns1blankspaceEditText"' + 
											' id="ns1blankspaceEditText' + ns1blankspace.counter.editor +
											'" class="ns1blankspaceTextMultiLarge tinymceAdvanced"></textarea>' +
											'</td></tr>');
											
							aHTML.push('</table>');					
							
							$('#ns1blankspaceEditColumn1').html(aHTML.join(''));

							$('#ns1blankspaceEditText' + ns1blankspace.counter.editor).val(sHTML);
								
							tinyMCE.init(
							{
								mode : "none",
								height : "415px", 
								width : "100%",
								theme : "advanced",

								theme_advanced_path : false,

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
								content_css : ns1blankspace.xhtml.editorCSS,
								
								external_link_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH", 
								external_image_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext, 
								media_external_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext,

								TemplateLinkType : "0"

							});				
							
							tinyMCE.execCommand('mceAddControl', false, 'ns1blankspaceEditText' + ns1blankspace.counter.editor);	
						}	
					}	
				},

	new2:		function ()
				{
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.document.layout();
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					$('#ns1blankspaceViewportControlAction').button({disabled: false});
					$('#ns1blankspaceViewportControlActionOptions').button({disabled: true});
					ns1blankspace.document.details();
				},

	save: 		{
					send: 		function ()
								{
									ns1blankspace.status.working();
									
									var sData = '_=1';
									
									if (ns1blankspace.objectContext != -1)
									{
										sData += '&id=' + ns1blankspace.objectContext	
									}	
										
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTitle').val());
										sData += '&url=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsURL').val());
										sData += '&public=' + ns1blankspace.util.fs($('input[name="radioPublic"]:checked').val());
										sData += '&summary=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSummary').val());
										sData += '&internal=' + ns1blankspace.util.fs($('input[name="radioInternal"]:checked').val());
									}
									
									if ($('#ns1blankspaceMainEdit').html() != '')
									{
										sData += '&details=' + ns1blankspace.util.fs(tinyMCE.get('ns1blankspaceEditText' + ns1blankspace.counter.editor).getContent());
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('DOCUMENT_MANAGE'),
										data: sData,
										dataType: 'json',
										success: ns1blankspace.document.save.process
									});	
								},

					process:	function (oResponse)
								{
									if (ns1blankspace.objectContext == -1) {var bNew = true}
									ns1blankspace.objectContext = oResponse.id;	
									ns1blankspace.inputDetected = false;

									if (ns1blankspace.objectContext == -1 && ns1blankspace.document.data.websiteContext)
									{
										ns1blankspace.objectContext = oResponse.id;

										var sData = 'foldertitle=' + ns1blankspace.util.endpointURI('[My Website Documents]');
										sData += '&document=' + ns1blankspace.objectContext;	
												
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('DOCUMENT_FOLDER_LINK_MANAGE'),
											data: sData,
											dataType: 'text',
											success: function (data)
											{
												ns1blankspace.status.message('Saved');
												if (bNew) {ns1blankspace.document.search.send('-' + ns1blankspace.objectContext)}
											}		
										});
									
									}	
									else
									{
										ns1blankspace.status.message('Saved');
										if (bNew) {ns1blankspace.document.search.send('-' + ns1blankspace.objectContext)}
									}	
								}
				},
	
	pdf:		function (oParam, sReturn)
				{
					var sFilename = 'document_' + ns1blankspace.objectContext + '.pdf'
					var sXHTMLElementID = '';
					var sXHTMLContent;
					
					if (oParam != undefined)
					{
						if (oParam.filename != undefined) {sFilename = oParam.filename}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.xhtmlContent != undefined) {sXHTMLContent = oParam.xhtmlContent}
					}		

					if (sXHTMLContent == undefined)
					{
						if ($('#ns1blankspaceMainEdit').html() != '')
						{
							sXHTMLContent = tinyMCE.get('ns1blankspaceEditText').getContent();
						}
					}
					
					if (sXHTMLContent == undefined)
					{
						alert('Nothing to PDF!')
					}
					else
					{	
						if (sReturn == undefined)
						{
							var sData = 'rf=TEXT&object=' + ns1blankspace.util.fs(ns1blankspace.object)
							sData += '&objectcontext=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
							sData += '&filename=' + ns1blankspace.util.fs(sFilename);
							sData += '&xhtmlcontent=' + ns1blankspace.util.fs(sXHTMLContent);
							
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('CORE_PDF_CREATE'),
								data: sData,
								dataType: 'text',
								success: function(data) {ns1blankspace.document.pdf(oParam, data)}
							});
						}	
						else	
						{
							var aReturn = sReturn.split('|');
							window.open('/download/' + aReturn[1]);
						}	
					}
				}
}