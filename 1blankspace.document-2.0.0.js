/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.document = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 14;
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectName = 'document';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Documents';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.document.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
				},

	home:		function (oResponse)
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

						aHTML.push('<tr><td id="ns1blankspaceViewMessagingEmailLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');
								
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	

						var oSearch = new AdvancedSearch();
						oSearch.method = 'DOCUMENT_SEARCH';
						oSearch.addField('title');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(ns1blankspace.document.home);
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
														this.email +
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
									var iMinimumLength = 3;
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
										oSearch.addField('title,summary,keywords,url,status,statustext,public,website,websitetext,style,internal,content,type,typetext');
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
											ns1blankspace.container.position({xhtmlElementID: sElementID});
											ns1blankspace.search.start(sElementID);

											var oSearch = new AdvancedSearch();
											oSearch.method = 'DOCUMENT_SEARCH';
											oSearch.addField('title');
											oSearch.addFilter('email', 'STRING_IS_LIKE', sSearchText);

											if (bWebsiteOnly)
											{
												oSearch.addFilter('foldertitle', 'EQUAL_TO', '[My Website Documents]');
											}	

											oSearch.getResults(function(data) {ns1blankspace.document.search.process(oParam, data)});
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
										aHTML[++h] = '<table class="ns1blankspaceSearchMedium">';
										aHTML[++h] = '<tbody>'
											
										$.each(oResponse.data.rows, function()
										{
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML[++h] = '<tr class="ns1blankspaceSearch">';
											}
											
											aHTML[++h] = '<td class="ns1blankspaceSearch" id="' +
															'-' + this.id + '">' +
															this.title + '</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML[++h] = '</tr>'
												iColumn = 0;
											}	
										});
								    	
										aHTML[++h] = '</tbody></table>';

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspaceDocumentSearch(event.target.id, 1);
										});
									}	
									
									ns1blankspaceSearchStop();	
								}
				},
								
	layout: 	function ns1blankspaceDocumentViewport()
				{
					
					var aHTML = [];
					var h = -1;

					if (ns1blankspace.option.richTextEditing)
					{	
						if (tinyMCE.getInstanceById('inputns1blankspaceMainEditText'))
						{
							tinyMCE.get('inputns1blankspaceMainEditText').remove();
							$('#inputns1blankspaceMainEditText').remove();
						}	
					}
					
					aHTML[++h] = '<div id="divns1blankspaceViewportControlContext" class="ns1blankspaceViewportControlContext"></div>';
					
					aHTML[++h] = '<table id="tablens1blankspaceViewportControl" class="ns1blankspaceViewportControl">';
					
					aHTML[++h] = '<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlSummary" class="ns1blankspaceViewportControl ns1blankspaceViewportControlHighlight">Summary</td>' +
									'</tr>';
									
					aHTML[++h] = '<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlDetails" class="ns1blankspaceViewportControl">Details</td>' +
									'</tr>';
								
					aHTML[++h] = '<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlEdit" class="ns1blankspaceViewportControl">Edit</td>' +
									'</tr>';			
									
					aHTML[++h] = '</table>';					
							
					if (ns1blankspace.objectContext != -1)
					{		
						aHTML[++h] = '<table id="tablens1blankspaceViewportControl" class="ns1blankspaceViewportControl">';
									
						aHTML[++h] = '<tr id="trns1blankspaceViewportControl" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlAttachments" class="ns1blankspaceViewportControl">Attachments</td>' +
										'</tr>';

						aHTML[++h] = '</table>';
					}	

					$('#divns1blankspaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divns1blankspaceMainSummary" class="divns1blankspaceViewportMain"></div>';
					aHTML[++h] = '<div id="divns1blankspaceMainDetails" class="divns1blankspaceViewportMain"></div>';
					aHTML[++h] = '<div id="divns1blankspaceMainEdit" class="divns1blankspaceViewportMain"></div>';
					aHTML[++h] = '<div id="divns1blankspaceMainAttachments" class="divns1blankspaceViewportMain"></div>';	

					$('#divns1blankspaceMain').html(aHTML.join(''));
					
					$('#tdns1blankspaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainSummary");
						ns1blankspaceDocumentSummary();
					});
					
					$('#tdns1blankspaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainDetails");
						ns1blankspaceDocumentDetails();
					});
					
					$('#tdns1blankspaceViewportControlEdit').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainEdit");
						ns1blankspaceDocumentEdit();
					});

					$('#tdns1blankspaceViewportControlAttachments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainAttachments", true);
						ns1blankspaceAttachments({xhtmlElementID: 'divns1blankspaceMainAttachments'});
					});
				},

	show: 		function ns1blankspaceDocumentShow(oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspaceDocumentViewport();

					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML[++h] = '<table><tbody><tr><td class="ns1blankspaceMainRowNothing" valign="top">Sorry can\'t find the document.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
								
						$('#divns1blankspaceViewportControlContext').html(ns1blankspace.objectContextData.title);
						$('#spanns1blankspaceViewportControlAction').button({disabled: false});
						$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});
						
						ns1blankspaceViewportDestination({
							newDestination: 'ns1blankspaceDocumentMasterViewport({showHome: false});ns1blankspaceDocumentSearch("-' + ns1blankspace.objectContext + '")',
							move: false
							})
							
						ns1blankspaceObjectViewportHistory({functionDefault: 'ns1blankspaceDocumentSummary()'});
					}	
				},		
		
	summary: 	function ns1blankspaceDocumentSummary()
				{
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML[++h] = '<table><tbody><tr><td valign="top" class="ns1blankspaceMainRowNothing">Sorry can\'t find document.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						aHTML[++h] = '<table id="tablens1blankspaceMainSummary" class="ns1blankspaceMain">';
						aHTML[++h] = '<tr id="trns1blankspaceMainSummaryRow1" class="ns1blankspaceMainRow1">' +
									'<td id="tdns1blankspaceMainSummaryColumn1" class="ns1blankspaceMainColumn1">' +
										'</td>' +
										'<td id="tdns1blankspaceMainSummaryColumn2" class="ns1blankspaceMainColumn2x">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divns1blankspaceMainSummary').html(aHTML.join(''));
					
						var aHTML = [];
						var h = -1;
					
						if (ns1blankspace.objectContextData.summary == '')
						{
							aHTML[++h] = '<table><tbody><tr><td valign="top" class="ns1blankspaceMainRowNothing">There is no document summary.</td></tr>';
							aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
						}
						else
						{	
							aHTML[++h] = '<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMainColumn1">';
						
							aHTML[++h] = '<tr><td id="tdns1blankspaceMainSummarySummary" class="ns1blankspaceMainSummary">&nbsp;</td></tr>' +
											'<tr><td id="tdns1blankspaceMainSummarySummaryValue" class="ns1blankspaceMainSummaryValue">' +
											ns1blankspace.objectContextData.summary +
											'</td></tr>';
											
							aHTML[++h] = '</table>';					
						}
						
						$('#tdns1blankspaceMainSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;	
						
						aHTML[++h] = '<table id="tablens1blankspaceMainColumn2" class="ns1blankspaceMainColumn2">';
												
						 aHTML[++h] = '<tr><td id="tdns1blankspaceMainSummaryPDF" class="ns1blankspaceMainColumn2Action">' +
										 '<a href="#" id="ans1blankspaceMainSummaryPDF">View as PDF</a>' +
										'</td></tr>';
						
										
						aHTML[++h] = '</table>';					
						
						//$('#tdns1blankspaceMainSummaryColumn2').html(aHTML.join(''));	
					
						$('#ans1blankspaceMainSummaryPDF').click(function(event)
						{
							ns1blankspaceDocumentPDF();
						});
					}	
				},

	details: 	function ns1blankspaceDocumentDetails()
				{
					var aHTML = [];
					var h = -1;
					
					if ($('#divns1blankspaceMainDetails').attr('onDemandLoading') == '1')
					{
						$('#divns1blankspaceMainDetails').attr('onDemandLoading', '');
						
						aHTML[++h] = '<table id="tablens1blankspaceMainDetails" class="ns1blankspaceMainDetails">';
						aHTML[++h] = '<tr id="trns1blankspaceMainDetailsRow1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsColumn1" class="ns1blankspaceMainColumn1">' +
										'</td>' +
										'<td id="tdns1blankspaceMainDetailsColumn2" class="ns1blankspaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divns1blankspaceMainDetails').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
						
						aHTML[++h] = '<table id="tablens1blankspaceMainDetailsColumn1" class="ns1blankspaceMain">';
						
						aHTML[++h] = '<tr id="trns1blankspaceMainDetailsTitle" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsTitle" class="ns1blankspaceMain">' +
										'Title' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsTitleValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsTitleValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainDetailsTitle" class="inputns1blankspaceMainText">' +
										'</td></tr>';
					
						aHTML[++h] = '<tr id="trns1blankspaceMainDetailsURL" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsURL" class="ns1blankspaceMain">' +
										'URL' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsURLValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsURLValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainDetailsURL" class="inputns1blankspaceMainText">' +
										'</td></tr>';
					
						aHTML[++h] = '<tr id="trns1blankspaceMainDetailsSharing" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsSharing" class="ns1blankspaceMain">' +
										'Sharing' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsSharing" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsFromEmailValue" class="ns1blankspaceMainText">' +
										'<input type="radio" id="radioPublicY" name="radioPublic" value="Y"/>Public' +
										'<br /><input type="radio" id="radioPublicN" name="radioPublic" value="N"/>Private' +
										'</td></tr>';
					
						aHTML[++h] = '</table>';					
						
						$('#tdns1blankspaceMainDetailsColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
							
						aHTML[++h] = '<table id="tablens1blankspaceMainDetailsColumn2" class="ns1blankspaceMain">';
						
						aHTML[++h] = '<tr id="trns1blankspaceMainDetailsSummary" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsSummary class="ns1blankspaceMain">' +
										'Document Summary' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsSummaryValue" class="ns1blankspaceMainTextMulti">' +
										'<td id="tdns1blankspaceMainDetailsSummaryValue" class="ns1blankspaceMainTextMulti">' +
										'<textarea rows="10" cols="35" id="inputns1blankspaceMainDetailsSummary" class="inputns1blankspaceMainTextMulti"></textarea>' +
										'</td></tr>';
						
						aHTML[++h] = '</table>';					
							
						$('#tdns1blankspaceMainDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputns1blankspaceMainDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#inputns1blankspaceMainDetailsURL').val(ns1blankspace.objectContextData.url);
							$('#inputns1blankspaceMainDetailsSummary').val(ns1blankspace.objectContextData.summary);
							$('[name="radioPublic"][value="' + ns1blankspace.objectContextData.public + '"]').attr('checked', true);
						}
						
					}	
				},

	edit: 		function ns1blankspaceDocumentEdit(sReturn)
				{	
					if ($('#divns1blankspaceMainEdit').attr('onDemandLoading') == '1')
					{
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tablens1blankspaceMainEdit" class="ns1blankspaceMain">';
						aHTML[++h] = '<tr id="trns1blankspaceMainEditRow1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainEditColumn1" class="ns1blankspaceMain">' +
										'</td>' +
										'<td id="tdns1blankspaceMainEditColumn2" class="ns1blankspaceMain">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
							
						$('#divns1blankspaceMainEdit').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMain">';
								
						aHTML[++h] = '<tr id="trns1blankspaceMainEditText" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainEditText" class="ns1blankspaceMain" style="text-align:right;">' +
										'<a href="#" id="ans1blankspaceMainEditPDF">View as PDF</a>' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsEditTextValue" class="ns1blankspaceMainTextMulti">' +
										'<td id="tdns1blankspaceMainDetailsEditTextValue" class="ns1blankspaceMainTextMulti">' +
										'<textarea rows="10" cols="60" onDemandType="TEXTMULTI" name="inputns1blankspaceMainEditText" id="inputns1blankspaceMainEditText" class="inputns1blankspaceMainTextMultiLarge tinymceAdvanced"></textarea>' +
										'</td></tr>';
										
						aHTML[++h] = '</table>';					
						
						$('#tdns1blankspaceMainEditColumn1').html(aHTML.join(''));
							
						$('#ans1blankspaceMainEditPDF').click(function(event)
						{
							ns1blankspaceDocumentPDF();
						});
						
						if (sReturn == undefined)
						{
							if (ns1blankspace.objectContext != -1)
							{
								sParam = 'method=DOCUMENT_CONTENT_SEARCH&id=' + ns1blankspace.objectContext;

								$.ajax(
								{
									type: 'GET',
									cache: false,
									url: '/ondemand/document/?' + sParam,
									dataType: 'text',
									success: ns1blankspaceDocumentEdit
								});
							}
							else
							{
								ns1blankspaceDocumentEdit("OK|");
							}
							
						}
						else
						{
						
							$('#divns1blankspaceMainEdit').attr('onDemandLoading', '');
							
							var sHTML = sReturn;
							
							$('#inputns1blankspaceMainEditText').val(sHTML);
								
							tinyMCE.init(
							{
								mode : "none",
								height : "415px", 
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
								content_css : ns1blankspace.xhtml.editorCSS,
								
								external_link_list_url : "/jscripts/ibcom/linkList.asp", 
								external_image_list_url : "/jscripts/ibcom/imageList.asp?LinkType=14&LinkId=" + ns1blankspace.objectContext, 
								media_external_list_url : "/jscripts/ibcom/mediaList.asp?LinkType=14&LinkId=" + ns1blankspace.objectContext,  TemplateLinkType : "0", 

							});				
							
							tinyMCE.execCommand('mceAddControl', false, 'inputns1blankspaceMainEditText');
									
						}	
					}	
				},

	new:		function ns1blankspaceDocumentNew(oXML)
				{
					ns1blankspace.objectContext = -1;
					ns1blankspace.objectContextData = undefined;
					ns1blankspaceDocumentViewport();
					$('#divns1blankspaceMainDetails').html(ns1blankspace.xhtml.loading);
					$('#divns1blankspaceMainDetails').attr('onDemandLoading', '1');
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
					ns1blankspaceDocumentDetails();	
				},

	save: 		{
					send: 		function ns1blankspaceDocumentSave()
								{
									var sData = '_=1';
									
									if (ns1blankspace.objectContext != -1)
									{
										sParam += '&id=' + ns1blankspace.objectContext	
									}	
										
									if ($('#divns1blankspaceMainDetails').html() != '')
									{
										sData += '&title=' + encodeURIComponent($('#inputns1blankspaceMainDetailsTitle').val());
										sData += '&url=' + encodeURIComponent($('#inputns1blankspaceMainDetailsURL').val());
										sData += '&public=' + $('input[name="radioPublic"]:checked').val();
										sData += '&summary=' + encodeURIComponent($('#inputns1blankspaceMainDetailsSummary').val());
									}
									
									if ($('#divns1blankspaceMainEdit').html() != '')
									{
										sData += '&details=' + encodeURIComponent(tinyMCE.get('inputns1blankspaceMainEditText').getContent());
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspaceEndpointURL('DOCUMENT_MANAGE'),
										data: sData,
										dataType: 'text',
										success: ns1blankspaceDocumentSaveProcess
									});	
								},

					process:	function ns1blankspaceDocumentSaveProcess(sReturn)
								{
									if (ns1blankspace.objectContext == -1)
									{

										var aReturn = sReturn.split('|');
										var sParam = 'method=DOCUMENT_FOLDER_LINK_MANAGE';
										var sData = 'foldertitle=' + encodeURIComponent('[My Website Documents]');

										ns1blankspace.objectContext = aReturn[3];
										sData += '&select=' + aReturn[3];	
												
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/document/?' + sParam,
											data: sData,
											dataType: 'text',
											success: ns1blankspaceStatus('Saved')
										});
									
									}	
									else
									{
										ns1blankspaceStatus('Saved');
									}	
									
								}
				},
	
	pdf:		function ns1blankspaceDocumentPDF(oParam, sReturn)
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
						if ($('#divns1blankspaceMainEdit').html() != '')
						{
							sXHTMLContent = tinyMCE.get('inputns1blankspaceMainEditText').getContent();
						}
						else
						{
						
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
							var sParam = 'method=CORE_PDF_CREATE&rf=TEXT';
							var sData = 'object=' + ns1blankspace.object
							sData += '&objectcontext=' + ns1blankspace.objectContext;
							sData += '&filename=' + encodeURIComponent(sFilename);
							sData += '&xhtmlcontent=' + encodeURIComponent(sXHTMLContent);
							
							$.ajax(
							{
								type: 'POST',
								url: '/ondemand/core/?' + sParam,
								data: sData,
								dataType: 'text',
								success: function(data) {ns1blankspaceDocumentPDF(oParam, data)}
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