/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.event = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 39;
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectName = 'event';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Events';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.event.init({showHome: true});',
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
							TemplateLinkType : "32",
							content_css : ns1blankspace.xhtml.editorCSS
						});
					}			
				},

	home: 		function (oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceViewportMain">');
						aHTML.push('<tr id="trns1blankspaceViewportMain" class="ns1blankspaceViewportMain">' +
										'<td id="tdns1blankspaceProjectHomeMostLikely" class="ns1blankspaceViewportMain">' +
										ns1blankspace.xhtml.loading + 
										'</td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						var aHTML = [];
									
						aHTML.push('<table><tr>' +
										'<td id="ns1blankspaceViewEventLarge" class="ns1blankspaceViewImageLarge">' +
										'&nbsp;</td></tr></table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'EVENT_SEARCH';
						oSearch.addField('description');
						oSearch.rf = 'json';
						oSearch.rows = 10;
						oSearch.addSummaryField('count eventcount')
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(ns1blankspace.event.home);	
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>');
							aHTML.push('<tr>');
							aHTML.push('<td class="ns1blankspaceNothing">Click New to create an event.</td>');
							aHTML.push('</tr>');
							aHTML.push('</table>');
						}
						else
						{
						
							aHTML.push('<table>');
							aHTML.push('<tr>');
							aHTML.push('<td class="ns1blankspaceCaption">MOST LIKELY</td>');
							aHTML.push('</tr>');
							
							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr>');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Title-' + this.id + 
														'" class="ns1blankspaceMostLikely">' +
														this.description +
														'</td>';
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.event.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
				
					send: 		function (sXHTMLElementId, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
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
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'EVENT_SEARCH';									
										oSearch.addField('reference,description,startdate,enddate,status,public');
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										
										oSearch.getResults(function(data) {ns1blankspace.event.show(oParam, data)});	
									
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
												
											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('EVENT_SEARCH'),
												data: 'quicksearch=' + ns1blankspace.util.fs(sSearchText),
												dataType: 'json',
												success: function(data) {ns1blankspace.event.search.process(oParam, data)}
											});
										}
									};	
								},

					process: 	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var	iMaximumColumns = 1;
										
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspaceSearchStop();
										$('#divns1blankspaceViewportControlOptions').hide();
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
															this.reference + '</td>');
											
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
											ns1blankspace.event.search.send(event.target.id, {source: 1});
										});
									}		
								}
				},
								
	layout: 	function ()
				{		
					var aHTML = [];

					if (tinyMCE.getInstanceById('ns1blankspaceMainDescriptionText'))
					{
						tinyMCE.get('ns1blankspaceMainDescriptionText').remove();
						$('#ns1blankspaceMainDescriptionText').remove();
					}	
						
					aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Details</td></tr>');
										
						aHTML.push('<tr><td id="ns1blankspaceControlDescription" class="ns1blankspaceControl">' +
										'Description</td></tr>');				
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlDescription" class="ns1blankspaceControl">' +
										'Description</td></tr>');
					
						aHTML.push('</table>');		
									
		
						aHTML.push('<table class="ns1blankspaceViewControl">');
					
						aHTML.push('<tr><td id="ns1blankspaceViewControlAttendees" class="ns1blankspaceControl">' +
									'Attendees</td>' +
									'</tr>');			
								
						aHTML.push('</table>');	
					}
							
					$('#ns1blankspaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDescription" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttendees" class="ns1blankspaceControlMain"></div>');
						
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.event.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.event.details();
					});
					
					$('#ns1blankspaceControlDescription').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDescription'});
						ns1blankspace.event.description();
					});

					$('#ns1blankspaceViewControlAttendees').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttendees'});
						ns1blankspace.event.attendees();
					});
				},

	show: 		function (oParam, oResponse)
				{
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspaceEventViewport();

					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find event.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{		
						ns1blankspace.objectContextData = oResponse.data.rows[0];
					
						$('#divns1blankspaceViewportControlContext').html(ns1blankspace.objectContextData.reference);
						$('#spanns1blankspaceViewportControlAction').button({disabled: false});
						$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});
						
						ns1blankspaceViewportDestination({
							newDestination: 'ns1blankspaceEventMasterViewport({showHome: false});ns1blankspaceEventSearch("-' + ns1blankspace.objectContext + '")',
							move: false
							})
					
						ns1blankspaceObjectViewportHistory({functionDefault: 'ns1blankspaceEventSummary()'});
					}	
				},		
		
	summary: 	function ns1blankspaceEventSummary()
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
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find event.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#tdns1blankspaceMainSummaryColumn1Large').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMainColumn1">';
						
						var sTmp = ns1blankspace.objectContextData.startdate;
						
						if (sTmp != '&nbsp;') 
						{
							aHTML.push('<tr><td id="tdns1blankspaceMainSummaryDescription" class="ns1blankspaceMainSummary">Start Date</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummaryTypeValue" class="ns1blankspaceMainStartDateValue">' +
										sTmp +
										'</td></tr>';
						}				
										
						aHTML.push('<tr><td id="tdns1blankspaceMainSummarySummary" class="ns1blankspaceMainSummary">&nbsp;</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummarySummaryValue" class="ns1blankspaceMainSummaryValue">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>';
										
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainSummaryColumn1Large').html(aHTML.join(''));
	
						$('#ans1blankspaceMainSummaryEdit').click(function(event)
						{
							ns1blankspaceEventEdit();
						});
					}	
				},

	details: 	function ns1blankspaceEventDetails()
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
						
						aHTML.push('<tr id="trns1blankspaceMainDetailsReference" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsReference" class="ns1blankspaceMain">' +
										'Reference' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsReferenceValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsReferenceValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainDetailsReference" class="inputns1blankspaceMainText">' +
										'</td></tr>';
					
						aHTML.push('<tr id="trns1blankspaceMainDetailsStartDate" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsStartDate" class="ns1blankspaceMain">' +
										'Start Date' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsStartDateValue" class="ns1blankspaceMainDate">' +
										'<td id="tdns1blankspaceMainDetailsStartDateValue" class="ns1blankspaceMainDate">' +
										'<input id="inputns1blankspaceMainDetailsStartDate" class="inputns1blankspaceMainDate">' +
										'</td></tr>';			
					
						aHTML.push('<tr id="trns1blankspaceMainDetailsEndDate" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsEndDate" class="ns1blankspaceMain">' +
										'End Date' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsEndDateValue" class="ns1blankspaceMainDate">' +
										'<td id="tdns1blankspaceMainDetailsEndDateValue" class="ns1blankspaceMainDate">' +
										'<input id="inputns1blankspaceMainDetailsEndDate" class="inputns1blankspaceMainDate">' +
										'</td></tr>';			
										
						aHTML.push('<tr id="trns1blankspaceMainDetailsSharing" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsSharing" class="ns1blankspaceMain">' +
										'Sharing' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsSharing" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsSharingValue" class="ns1blankspaceMainText">' +
										'<input type="radio" id="radioPublicY" name="radioPublic" value="Y"/>Public' +
										'<br /><input type="radio" id="radioPublicN" name="radioPublic" value="N"/>Private' +
										'</td></tr>';				

						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainDetailsColumn1').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;
							
						aHTML.push('<table id="tablens1blankspaceMainDetailsColumn2" class="ns1blankspaceMain">';
						
							aHTML.push('<tr id="trns1blankspaceMainDetailsStatus" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsStatus" class="ns1blankspaceMain">' +
										'Status' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsStatus" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsStatusValue" class="ns1blankspaceMainText">' +
										'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Planning' +
										'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>In Progress' +
										'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Completed' +
										'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>Cancelled' +
										'<br /><input type="radio" id="radioStatus5" name="radioStatus" value="5"/>Confirmed' +
										'</td></tr>';
						
						aHTML.push('</table>';					
							
						$('#tdns1blankspaceMainDetailsColumn2').html(aHTML.join(''));

						$('input.inputns1blankspaceMainDate').datepicker({ dateFormat: 'dd M yy' });
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputns1blankspaceMainDetailsReference').val(ns1blankspace.objectContextData.reference);
							
							var sTmp = ns1blankspace.objectContextData.startdate;
							if (sTmp == '&nbsp;') {sTmp = ''};
							$('#inputns1blankspaceMainDetailsStartDate').val(sTmp);
							
							var sTmp = ns1blankspace.objectContextData.enddate;
							if (sTmp == '&nbsp;') {sTmp = ''};
							$('#inputns1blankspaceMainDetailsEndDate').val(sTmp);
							
							$('#inputns1blankspaceMainDetailsFromEmail').val(ns1blankspace.objectContextData.fromemail);
							
							$('#inputns1blankspaceMainDetailsSummary').val(ns1blankspace.objectContextData.summary);
							
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
							$('[name="radioPublic"][value="' + ns1blankspace.objectContextData.public + '"]').attr('checked', true);
						}
					}	
				},

	description: function ns1blankspaceEventDescription()
				{
					var aHTML = [];
					var h = -1;
					
					if ($('#divns1blankspaceMainDescription').attr('onDemandLoading') == '1')
					{
						$('#divns1blankspaceMainDescription').attr('onDemandLoading', '');
								
						aHTML.push('<table id="tablens1blankspaceMainEdit" class="ns1blankspaceMain">';
						aHTML.push('<tr id="trns1blankspaceMainEditRow1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDescriptionColumn1" class="ns1blankspaceMain">' +
										'</td>' +
										'<td id="tdns1blankspaceMainDescriptionColumn2" class="ns1blankspaceMain">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divns1blankspaceMainDescription').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML.push('<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMain">';
								
						aHTML.push('<tr id="trns1blankspaceMainDetailsDescriptionTextValue" class="ns1blankspaceMainTextMulti">' +
										'<td id="tdns1blankspaceMainDetailsDescriptionTextValue" class="ns1blankspaceMainTextMulti">' +
										'<textarea rows="30" cols="50" id="inputns1blankspaceMainDescriptionText" class="inputns1blankspaceMainTextMulti"></textarea>' +
										'</td></tr>';
										
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainDescriptionColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputns1blankspaceMainDescriptionText').val(unescape(ns1blankspace.objectContextData.description));
						}
					
						tinyMCE.execCommand('mceAddControl', false, 'inputns1blankspaceMainDescriptionText');
					}	
				},

	attendees: 	{
					show: 		function ns1blankspaceEventAttendees()
								{

									var aHTML = [];
									var h = -1;
									
									if ($('#divns1blankspaceMainAttendees').attr('onDemandLoading') == '1')
									{
										$('#divns1blankspaceMainAttendees').attr('onDemandLoading', '');
									
										aHTML.push('<table id="tablens1blankspaceMainEdit" class="ns1blankspaceMain">';
										aHTML.push('<tr id="trns1blankspaceMainEditRow1" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainAttendeesColumn1" style="width: 70px" class="ns1blankspaceMainColumn1">' +
														'</td>' +
														'<td id="tdns1blankspaceMainAttendeesColumn2" class="ns1blankspaceMainColumn1Large">' +
														'</td>' +
														'</tr>';
										aHTML.push('</table>';					
										
										$('#divns1blankspaceMainAttendees').html(aHTML.join(''));
										
										var aHTML = [];
										var h = -1;
									
										aHTML.push('<table id="tablens1blankspaceMainAtteendeesAtoZ" class="ns1blankspaceMain">';
										
										aHTML.push('<tr id="trns1blankspaceMainAtteendeesAtoE" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainAtteendees-AtoE" class="ns1blankspaceRowSelect">' +
														'<span id="spanns1blankspaceMainAtteendees-A" class="ns1blankspaceMainAtoZ">A</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-B" class="ns1blankspaceMainAtoZ">B</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-C" class="ns1blankspaceMainAtoZ">C</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-D" class="ns1blankspaceMainAtoZ">D</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-E" class="ns1blankspaceMainAtoZ">E</span>' +
														'</td></tr>';
										
										aHTML.push('<tr id="trns1blankspaceMainAtteendeesFtoJ" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainAtteendees-FtoJ" class="ns1blankspaceRowSelect">' +
														'<span id="spanns1blankspaceMainAtteendees-F" class="ns1blankspaceMainAtoZ">F</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-G" class="ns1blankspaceMainAtoZ">G</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-H" class="ns1blankspaceMainAtoZ">H</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-I" class="ns1blankspaceMainAtoZ">I</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-J" class="ns1blankspaceMainAtoZ">J</span>' +
														'</td></tr>';
														
										aHTML.push('<tr id="trns1blankspaceMainAtteendeesKtoO" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainAtteendees-KtoO" class="ns1blankspaceRowSelect">' +
														'<span id="spanns1blankspaceMainAtteendees-K" class="ns1blankspaceMainAtoZ">K</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-L" class="ns1blankspaceMainAtoZ">L</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-M" class="ns1blankspaceMainAtoZ">M</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-N" class="ns1blankspaceMainAtoZ">N</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-O" class="ns1blankspaceMainAtoZ">O</span>' +
														'</td></tr>';
														
										aHTML.push('<tr id="trns1blankspaceMainAtteendeesPtoT" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainAtteendees-PtoT" class="ns1blankspaceRowSelect">' +
														'<span id="spanns1blankspaceMainAtteendees-P" class="ns1blankspaceMainAtoZ">P</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-Q" class="ns1blankspaceMainAtoZ">Q</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-R" class="ns1blankspaceMainAtoZ">R</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-S" class="ns1blankspaceMainAtoZ">S</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-T" class="ns1blankspaceMainAtoZ">T</span>' +
														'</td></tr>';
										
										aHTML.push('<tr id="trns1blankspaceMainAtteendeesUtoZ" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainAtteendees-UtoZ" class="ns1blankspaceRowSelect">' +
														'<span id="spanns1blankspaceMainAtteendees-U" class="ns1blankspaceMainAtoZ">U</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-V" class="ns1blankspaceMainAtoZ">V</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-W" class="ns1blankspaceMainAtoZ">W</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-X" class="ns1blankspaceMainAtoZ">X</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-Y" class="ns1blankspaceMainAtoZ">Y</span>' +
														'</td></tr>';
										
										aHTML.push('<tr id="trns1blankspaceMainAtteendeesZ0to9" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainAtteendees-Z0to9" class="ns1blankspaceRowSelect">' +
														'<span id="spanns1blankspaceMainAtteendees-Z" class="ns1blankspaceMainAtoZ">Z</span>&nbsp;' +
														'<span id="spanns1blankspaceMainAtteendees-#" class="ns1blankspaceMainAtoZ">0 to 9</span>&nbsp;' +
														'</td></tr>';
												
										aHTML.push('</table>';

										$('#tdns1blankspaceMainAttendeesColumn1').html(aHTML.join(''));	
										
										$('span.ns1blankspaceMainAtoZ').click(function(event)
										{
											var sXHTMLElementId = event.target.id;
											var aId = sXHTMLElementId.split('-');
											
											ns1blankspaceEventAttendeesSearch({quicksearch: aId[1]});	
										});
									}	
								}

					row: 		function ns1blankspaceEventAttendeesSearchRow(oRow)
								{
									var aHTML = [];
									var h = -1;
									
									aHTML.push('<tr class="ns1blankspaceMainRow">';
									aHTML.push('<td id="tdEvent-firstname" class="ns1blankspaceMainRow">' + oRow.firstname + '</td>';
									aHTML.push('<td id="tdEvent-surname" class="ns1blankspaceMainRow">' + oRow.surname + '</td>';
									
									var sPhone = oRow.phone
									if (sPhone == '') {if (oRow.homephone != '') {sPhone = '(H) ' + oRow.homephone}}
									
									aHTML.push('<td id="tdEvent-phone" class="ns1blankspaceMainRow">' + sPhone + '</td>';
									aHTML.push('<td id="tdEvent-email" class="ns1blankspaceMainRow">' + oRow.mobile + '</td>';
									aHTML.push('<td id="tdEvent-options-' + oRow.id + '"' +
														' class="ns1blankspaceMainRowOptions">&nbsp;</td>';
									aHTML.push('</tr>'
									
									return aHTML.join('');
								},

					search:		function ns1blankspaceEventAttendeesSearch(oParam, oResponse)
								{
									var sXHTMLElementId = 'tdns1blankspaceMainAttendeesColumn1';
									var sQuickSearch;
									
									if (oParam != undefined)
									{
										if (oParam.quicksearch != undefined) {sQuickSearch = oParam.quicksearch}
									}
									
									if (sQuickSearch != undefined)
									{
										if (oResponse == undefined)
										{	
											$('#tdns1blankspaceMainAttendeesColumn2').html(ns1blankspace.xhtml.loading);
											
											var aId = sXHTMLElementId.split('-');
											var sParam = 'method=EVENT_ATTENDEE_SEARCH' +
															'&quicksearch=' + encodeURIComponent(sQuickSearch);

											$.ajax(
											{
												type: 'GET',
												url: '/ondemand/event/?' + sParam,
												dataType: 'json',
												success: function(data) {ns1blankspaceEventAttendeesSearch(oParam, data)}
											});
										
										}
										else
										{
											var aHTML = [];
											var h = -1;
											
											if (oResponse.data.rows.length != 0)
											{	
												aHTML.push('<table border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
												aHTML.push('<tbody>'
											
												aHTML.push('<tr class="ns1blankspaceMainCaption">';
												aHTML.push('<td class="ns1blankspaceMainCaption">First Name</td>';
												aHTML.push('<td class="ns1blankspaceMainCaption">Surname</td>';
												aHTML.push('<td class="ns1blankspaceMainCaption">Phone</td>';
												aHTML.push('<td class="ns1blankspaceMainCaption">Mobile</td>';
												aHTML.push('<td class="ns1blankspaceMainCaption"></td>';
												aHTML.push('</tr>';

												$.each(oResponse.data.rows, function()
												{
													aHTML.push(ns1blankspaceEventAttendeesSearchRow(this);
												});
												
												aHTML.push('</tbody></table>';
												
												ns1blankspacePaginationList(
												{
													xhtmlElementID: 'tdns1blankspaceMainAttendeesColumn2',
													xhtmlContext: 'EventAttendees',
													xhtml: aHTML.join(''),
													showMore: (oResponse.morerows == "true"),
													more: oResponse.moreid,
													rows: ns1blankspace.option.defaultRows,
													functionShowRow: ns1blankspaceEventAttendeesSearchRow,
													functionNewPage: 'ns1blankspaceEventAttendeesSearchBind()',
													type: 'json'
												}); 	
												
											}
											else
											{
												aHTML.push('<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
												aHTML.push('<tbody>'
												aHTML.push('<tr class="ns1blankspaceMainRowNothing"><td>None.</td></tr>';
												aHTML.push('</tbody></table>';
												
												$('#tdns1blankspaceMainAttendeesColumn2').html(aHTML.join(''));
											}
											
										}	
										
									}
								}
				},				

	new:		function ns1blankspaceEventNew()
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspaceEventViewport();
					ns1blankspaceMainViewportShow("#divns1blankspaceMainDetails");
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
					ns1blankspaceEventDetails();
				},

	save:		{	
					send:		function ns1blankspaceEventSave()
								{

									var sParam;
									var sData = '_=1';
									
									if (ns1blankspace.objectContext != -1)
									{
										sParam = 'method=EVENT_UPDATE';
										sParam += '&select=' + ns1blankspace.objectContext	
									}
									else
									{
										sParam = 'method=EVENT_ADD';
									}
										
									if ($('#divns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + encodeURIComponent($('#inputns1blankspaceMainDetailsReference').val());
										sData += '&public=' + $("input[@name='radioPublic']:checked").val();
										
										//sData += '&url=' + encodeURIComponent($('#inputns1blankspaceMainDetailsURL').val());
										//sData += '&summary=' + encodeURIComponent($('#inputns1blankspaceMainDetailsSummary').val());
									}
									
									if ($('#divns1blankspaceMainDescription').html() != '')
									{
										sData += '&description=' + escape(tinyMCE.get('inputns1blankspaceMainDescriptionText').getContent());
									}
									
									$.ajax(
									{
										type: 'POST',
										url: '/ondemand/event/?' + sParam,
										data: sData,
										dataType: 'text',
										async: false,
										success: function(data) 
													{ 
														var aReturn = data.split('|');
														ns1blankspace.objectContext = aReturn[2];
														ns1blankspaceStatus('Event saved.');
													}
									});
										
								}
				}
}								
