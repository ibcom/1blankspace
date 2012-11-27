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
						
						aHTML.push('<tr><td><div id="ns1blankspaceViewEventLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');	
						
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
														'</td>');
								
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
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.event.layout();

					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this event.</td></tr></table>');
								
						$('ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{		
						ns1blankspace.objectContextData = oResponse.data.rows[0];
					
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.reference);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.event.init({showHome: false});ns1blankspace.event.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});

						ns1blankspace.history.control({functionDefault: 'ns1blankspace.event.summary()'});
					}	
				},		
		
	summary: 	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this contact.</td></tr></table>');
								
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
				
						aHTML.push('<table class="ns1blankspaceMainColumn1">');
				
						if (ns1blankspace.objectContextData.startdate != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Start Date</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryStartDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.startdate +
										'</td></tr>');
						}

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>');
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainSummaryColumn1').html(aHTML.join(''));
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
										'Reference' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsReference" class="ns1blankspaceText">' +
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
										'Sharing' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioPublicY" name="radioPublic" value="Y"/>Public' +
										'<br /><input type="radio" id="radioPublicN" name="radioPublic" value="N"/>Private' +
										'</td></tr>');						

						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));

						var aHTML = [];
							
						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						aHTML.push('<tr><td class="ns1blankspace">' +
										'Status' +
										'</td></tr>' +
										'<tr>' +
										'<td class="ns1blankspaceText">' +
										'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Planning' +
										'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>In Progress' +
										'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Completed' +
										'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>Cancelled' +
										'<br /><input type="radio" id="radioStatus5" name="radioStatus" value="5"/>Confirmed' +
										'</td></tr>');
						
						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						$('input.ns1blankspaceDate').datepicker({ dateFormat: 'dd M yy' });
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#ns1blankspaceDetailsStartDate').val(ns1blankspace.objectContextData.startdate);
							$('#ns1blankspaceDetailsEndDate').val(ns1blankspace.objectContextData.enddate);
							$('#ns1blankspaceDetailsFromEmail').val(ns1blankspace.objectContextData.fromemail);
							$('#ns1blankspaceDetailsSummary').val(ns1blankspace.objectContextData.summary);
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
							$('[name="radioPublic"][value="' + ns1blankspace.objectContextData.public + '"]').attr('checked', true);
						}
					}	
				},

	description: function ()
				{
					if ($('#ns1blankspaceMainDescripton').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDescripton').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDescriptonColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceDescriptonColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');					
						
						$('#ns1blankspaceMainDescripton').html(aHTML.join(''));
						
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspaceMain">');
								
						aHTML.push('<tr><td class="ns1blankspaceMainTextMulti">' +
										'<textarea id="ns1blankspaceDescription" class="ns1blankspaceTextMulti" rows="30" cols="50" ></textarea>' +
										'</td></tr>');
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDescriptionColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDescription').val(unescape(ns1blankspace.objectContextData.description));
						}
					
						tinyMCE.execCommand('mceAddControl', false, 'ns1blankspaceDescription');
					}	
				},

	attendees: 	{
					show: 		function ()
								{
									if ($('#ns1blankspaceMainAttendees').attr('data-loading') == '1')
									{
										$('#ns1blankspaceMainAttendees').attr('data-loading', '');
										
										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceAttendeesColumn1" class="ns1blankspaceColumn2" style="width: 70px;"></td>' +
														'<td id="ns1blankspaceAttendeesColumn2" class="ns1blankspaceColumn1Flexible"></td>' +
														'</tr>' + 
														'</table>');					
										
										$('#ns1blankspaceMainAttendees').html(aHTML.join(''));
	
										var aHTML = [];
									
										aHTML.push('<table id="ns1blankspaceMainAtteendeesAtoZ" class="ns1blankspace">');
										
										aHTML.push('<tr id="ns1blankspaceMainAtteendeesAtoE" class="ns1blankspaceMain">' +
														'<td id="ns1blankspaceMainAtteendees-AtoE" class="ns1blankspaceRowSelect">' +
														'<span id="ns1blankspaceAtteendees-A" class="ns1blankspaceAtoZ">A</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-B" class="ns1blankspaceAtoZ">B</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-C" class="ns1blankspaceAtoZ">C</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-D" class="ns1blankspaceAtoZ">D</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-E" class="ns1blankspaceAtoZ">E</span>' +
														'</td></tr>');
										
										aHTML.push('<tr id="ns1blankspaceMainAtteendeesFtoJ" class="ns1blankspaceMain">' +
														'<td id="ns1blankspaceMainAtteendees-FtoJ" class="ns1blankspaceRowSelect">' +
														'<span id="ns1blankspaceAtteendees-F" class="ns1blankspaceAtoZ">F</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-G" class="ns1blankspaceAtoZ">G</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-H" class="ns1blankspaceAtoZ">H</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-I" class="ns1blankspaceAtoZ">I</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-J" class="ns1blankspaceAtoZ">J</span>' +
														'</td></tr>');
														
										aHTML.push('<tr id="ns1blankspaceMainAtteendeesKtoO" class="ns1blankspaceMain">' +
														'<td id="ts1blankspaceMainAtteendees-KtoO" class="ns1blankspaceRowSelect">' +
														'<span id="ns1blankspaceAtteendees-K" class="ns1blankspaceAtoZ">K</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-L" class="ns1blankspaceAtoZ">L</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-M" class="ns1blankspaceAtoZ">M</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-N" class="ns1blankspaceAtoZ">N</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-O" class="ns1blankspaceAtoZ">O</span>' +
														'</td></tr>');
														
										aHTML.push('<tr id="ns1blankspaceMainAtteendeesPtoT" class="ns1blankspaceMain">' +
														'<td id="ns1blankspaceMainAtteendees-PtoT" class="ns1blankspaceRowSelect">' +
														'<span id="ns1blankspaceAtteendees-P" class="ns1blankspaceAtoZ">P</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-Q" class="ns1blankspaceAtoZ">Q</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-R" class="ns1blankspaceAtoZ">R</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-S" class="ns1blankspaceAtoZ">S</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-T" class="ns1blankspaceAtoZ">T</span>' +
														'</td></tr>');
										
										aHTML.push('<tr id="ns1blankspaceMainAtteendeesUtoZ" class="ns1blankspaceMain">' +
														'<td id="ns1blankspaceMainAtteendees-UtoZ" class="ns1blankspaceRowSelect">' +
														'<span id="ns1blankspaceAtteendees-U" class="ns1blankspaceAtoZ">U</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-V" class="ns1blankspaceAtoZ">V</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-W" class="ns1blankspaceAtoZ">W</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-X" class="ns1blankspaceAtoZ">X</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-Y" class="ns1blankspaceAtoZ">Y</span>' +
														'</td></tr>');
										
										aHTML.push('<tr id="ns1blankspaceMainAtteendeesZ0to9" class="ns1blankspaceMain">' +
														'<td id="ns1blankspaceMainAtteendees-Z0to9" class="ns1blankspaceRowSelect">' +
														'<span id="ns1blankspaceAtteendees-Z" class="ns1blankspaceAtoZ">Z</span>&nbsp;' +
														'<span id="ns1blankspaceAtteendees-#" class="ns1blankspaceAtoZ">0 to 9</span>&nbsp;' +
														'</td></tr>');
												
										aHTML.push('</table>');

										$('#s1blankspaceAttendeesColumn1').html(aHTML.join(''));	
										
										$('span.ns1blankspaceAtoZ').click(function(event)
										{
											var sXHTMLElementID = event.target.id;
											var aID = sXHTMLElementID.split('-');
											
											ns1blankspace.event.attendees.search({quicksearch: aID[1]});	
										});
									}	
								},

					row: 		function (oRow)
								{
									var aHTML = [];
									
									aHTML.push('<tr><td id="ns1blankspaceAttendee-firstname" class="ns1blankspaceRow">' + oRow.firstname + '</td>' +
													'<td id="ns1blankspaceAttendee-surname" class="ns1blankspaceRow">' + oRow.surname + '</td>');
									
									var sPhone = oRow.phone
									if (sPhone == '') {if (oRow.homephone != '') {sPhone = '(H) ' + oRow.homephone}}
									
									aHTML.push('<td id="ns1blankspaceAttendee-phone" class="ns1blankspaceRow">' + sPhone + '</td>' +
													'<td id="ns1blankspaceAttendee-email" class="ns1blankspaceMainRow">' + oRow.mobile + '</td>' +
													'<td id="ns1blankspaceAttendee-options-' + oRow.id + '"' +
														' class="ns1blankspaceMainRowOptions">&nbsp;</td>');
									aHTML.push('</tr>');
									
									return aHTML.join('');
								},

					search:		function (oParam, oResponse)
								{
									var sXHTMLElementID = 'ns1blankspaceAttendeesColumn1';
									var sQuickSearch;
									
									if (oParam != undefined)
									{
										if (oParam.quicksearch != undefined) {sQuickSearch = oParam.quicksearch}
									}
									
									if (sQuickSearch != undefined)
									{
										if (oResponse == undefined)
										{	
											$('#ns1blankspaceAttendeesColumn2').html(ns1blankspace.xhtml.loading);
											
											var aID = sXHTMLElementID.split('-');
											var sParam = 'method=EVENT_ATTENDEE_SEARCH' +
															'&quicksearch=' + ns1blankspace.util.fs(sQuickSearch);

											$.ajax(
											{
												type: 'GET',
												url: '/ondemand/event/?' + sParam,
												dataType: 'json',
												success: function(data) {ns1blankspace.event.attendees.search(oParam, data)}
											});
										
										}
										else
										{
											var aHTML = [];
											
											if (oResponse.data.rows.length != 0)
											{	
												aHTML.push('<table class="ns1blankspace">');
											
												aHTML.push('<tr class="ns1blankspaceCaption">');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">First Name</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Surname</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Phone</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Mobile</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption"></td>');
												aHTML.push('</tr>');

												$.each(oResponse.data.rows, function()
												{
													aHTML.push(ns1blankspace.event.attendees.row(this));
												});
												
												aHTML.push('</table>');
												
												ns1blankspacePaginationList(
												{
													xhtmlElementID: 's1blankspaceAttendeesColumn2',
													xhtmlContext: 'EventAttendees',
													xhtml: aHTML.join(''),
													showMore: (oResponse.morerows == "true"),
													more: oResponse.moreid,
													rows: ns1blankspace.option.defaultRows,
													functionShowRow: ns1blankspaceEventAttendeesSearchRow,
													functionNewPage: 'ns1blankspace.event.attendees.search.bind()',
													type: 'json'
												}); 	
												
											}
											else
											{
												aHTML.push('<table style="margin-top:15px; margin-bottom:15px;">');
												aHTML.push('<tr><td class="ns1blankspaceNothing">None.</td></tr>');
												aHTML.push('</table>');
												
												$('#ns1blankspaceAttendeesColumn2').html(aHTML.join(''));
											}	
										}
									}
								}
				},				

	new:		function ()
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspace.event.init();
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlActionOptions').button({disabled: true});
					ns1blankspace.event.details();
				},

	save:		{	
					send:		function ()
								{
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
										
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + encodeURIComponent($('#ns1blankspaceMainDetailsReference').val());
										sData += '&public=' + $("input[@name='radioPublic']:checked").val();
										
										//sData += '&url=' + encodeURIComponent($('#inputns1blankspaceMainDetailsURL').val());
										//sData += '&summary=' + encodeURIComponent($('#inputns1blankspaceMainDetailsSummary').val());
									}
									
									if ($('#ns1blankspaceMainDescription').html() != '')
									{
										sData += '&description=' + escape(tinyMCE.get('ns1blankspaceMainDescriptionText').getContent());
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
