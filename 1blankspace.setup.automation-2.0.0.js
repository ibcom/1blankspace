/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.setup.automation = 
{
	init: 		function ()
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = -1;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'automation';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Automation';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.automation.init({showHome: true});',
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
										'<td id="ns1blankspaceMostLikelyColumn2" class="ins1blankspaceMain">' +
										'</td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table>');
						
						aHTML.push('<tr><td class="interfaceMainColumn2Action" style="width:175px;">' +
										'<a href="http://mydigitalstructure.com/gettingstarted_automation"' +
										' target="_blank">Automation Getting Started</a>' +
										'</td></tr>');
														
						aHTML.push('</table>');					

						$('#ns1blankspaceMostLikelyColumn2').html(aHTML.join(''));

						var aHTML = [];
									
						aHTML.push('<table>');

						aHTML.push('<tr><td id="ns1blankspaceViewMessagingAutomationLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');
								
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	

						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('SETUP_AUTOMATION_SEARCH'),
							dataType: 'json',
							success: ns1blankspace.setup.automation.home
						});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a automation rule.</td></tr>' +
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
							ns1blankspace.setup.automation.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function (sXHTMLElementId, oParam)
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
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('SETUP_AUTOMATION_SEARCH'),
											data: 'id=' + ns1blankspace.objectContext,
											dataType: 'json',
											success: function(data) {ns1blankspace.setup.automation.show(oParam, data)}
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
											sElementId = 'tableInterfaceViewportMasterBrowse';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspaceOptionsSetPosition(sElementId);
											ns1blankspaceSearchStart(sElementId);
											
											var sParam = 'method=SETUP_AUTOMATION_SEARCH&quicksearch=' + sSearchText;

											$.ajax(
											{
												type: 'GET',
												url: '/ondemand/setup/?' + sParam,
												dataType: 'json',
												success: function(data) {interfaceSetupAutomationSearchShow(oParam, data)}
											});
										}
									};	
								}

					process:	function interfaceSetupAutomationSearchShow(oParam, oResponse)
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
										aHTML.push('<table class="interfaceSearchMedium">';
										aHTML.push('<tbody>'
											
										$.each(oResponse.data.rows, function()
										{
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML.push('<tr class="interfaceSearch">';
											}
											
											aHTML.push('<td class="interfaceSearch" id="' +
															'-' + this.id + '">' +
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
										
										$('td.interfaceSearch').click(function(event)
										{
											$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
											$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
											interfaceSetupAutomationSearch(event.target.id, 1);
										});
									}	
											
								}
				},

	layout: 	function interfaceSetupAutomationViewport()
				{
					
					var aHTML = [];
					

					aHTML.push('<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
					
					aHTML.push('<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
					
					aHTML.push('<tr id="trInterfaceViewportControlSummary" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
									'</tr>';
									
					aHTML.push('<tr id="trInterfaceViewportControlDetails" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
									'</tr>';
					
					aHTML.push('<tr id="trInterfaceViewportControlSchedule" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlSchedule" class="interfaceViewportControl">Schedule</td>' +
									'</tr>';
					
					aHTML.push('<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlResponse" class="interfaceViewportControl">Response Action</td>' +
									'</tr>';
					
					aHTML.push('<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlFormat" class="interfaceViewportControl">Formatting</td>' +
									'</tr>';
							
					aHTML.push('<tr><td id="tdInterfaceViewportControlFormat" class="interfaceViewportControl">&nbsp;</td></tr>';

					// aHTML.push('<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
									// '<td id="tdInterfaceViewportControlRun" class="interfaceViewportControl">Test Run</td>' +
									// '</tr>';					
							
					aHTML.push('</table>';					
								
					$('#divInterfaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					

					aHTML.push('<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
					aHTML.push('<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
					aHTML.push('<div id="divInterfaceMainSchedule" class="divInterfaceViewportMain"></div>';
					aHTML.push('<div id="divInterfaceMainResponse" class="divInterfaceViewportMain"></div>';
					aHTML.push('<div id="divInterfaceMainFormat" class="divInterfaceViewportMain"></div>';
					aHTML.push('<div id="divInterfaceMainRun" class="divInterfaceViewportMain"></div>';
					
					$('#divInterfaceMain').html(aHTML.join(''));
						
					$('#tdInterfaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
						interfaceSetupAutomationSummary();
					});
					
					$('#tdInterfaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
						interfaceSetupAutomationDetails();
					});
					
					$('#tdInterfaceViewportControlSchedule').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainSchedule");
						interfaceSetupAutomationSchedule();
					});
					
					$('#tdInterfaceViewportControlResponse').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainResponse", true);
						interfaceSetupAutomationResponse();
					});
					
					$('#tdInterfaceViewportControlFormat').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainFormat");
						interfaceSetupAutomationFormat();
					});
					
					$('#tdInterfaceViewportControlRun').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainRun");
						interfaceSetupAutomationRun();
					});
				},

	show:		function interfaceSetupAutomationShow(oParam, oResponse)
				{
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
					interfaceSetupAutomationViewport();
					
					var aHTML = [];
					
					
					if (oResponse.data.rows.length == 0)
					{
					
						ns1blankspace.objectContextData = undefined;
					
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find automation rule.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{		
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#divInterfaceViewportControlContext').html(ns1blankspace.objectContextData.title);
						
						aHTML.push('<table id="tableInterfaceMainSummary" class="interfaceMain">';
						aHTML.push('<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
									'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divInterfaceMainSummary').html(aHTML.join(''));
						
						$('#spanns1blankspaceViewportControlAction').button({disabled: false});
						$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});
						
						interfaceSetupAutomationSummary();
					}	
				},		
		
	summary:	function interfaceSetupAutomationSummary()
				{
					var aHTML = [];
					
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find automation.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
						
						aHTML.push('<tr><td id="tdInterfaceMainSummaryID" class="interfaceMainSummary">Automation ID</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryID" class="interfaceMainSummaryValue">' +
										ns1blankspace.objectContextData.id +
										'</td></tr>';
										
						aHTML.push('<tr><td id="tdInterfaceMainSummaryAutomationEndpoint" class="interfaceMainSummary">Endpoint</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryAutomationEndpoint" class="interfaceMainSummaryValue">' +
										ns1blankspace.objectContextData.endpoint +
										'</td></tr>';
										
						aHTML.push('</table>';					
						
						$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
							
						
						aHTML.push('<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2">';
						
						aHTML.push('<tr><td id="tdInterfaceMainSummaryTask3" class="interfaceRowSelect">' +
										'<a href="/ondemand/setup/?method=SETUP_AUTOMATION_RUN&ct=text/html&id=' + ns1blankspace.objectContext + '"' +
										' target="_blank" id="aInterfaceMainSummaryAutomationTestRun">Test Run</a>' +
										'</td></tr>';
														
						aHTML.push('</table>';					
						
						$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));		
					}	
				},

	details:	function interfaceSetupAutomationDetails()
				{
					var aHTML = [];
					
					
					if ($('#divInterfaceMainDetails').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainDetails').attr('onDemandLoading', '');
						
						aHTML.push('<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
					
						aHTML.push('<tr id="trInterfaceMainDetailsTitle" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
										'Title' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainText">' +
										'</td></tr>';
						
						aHTML.push('<tr id="trInterfaceMainDetailsStatus" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsStatus" class="interfaceMain">' +
										'Status' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsStatus" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsStatusValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Disabled' +
										'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Enabled' +
										'</td></tr>';
						
						aHTML.push('<tr id="trInterfaceMainDetailsEndpoint" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsEndpoint" class="interfaceMain">' +
										'Endpoint' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsEndpointValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsEndpointValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsEndpoint" class="inputInterfaceMainText">' +
										'</td></tr>';
						
						aHTML.push('<tr id="trInterfaceMainDetailsURL" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsURL" class="interfaceMain">' +
										'URL' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsURL" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainDetailsURLValue" class="interfaceMainTextMulti">' +
										'<textarea style="height: 50px;" rows="3" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMainDetailsURL"' +
										' class="inputInterfaceMainTextMultiLarge"></textarea>' +
										'</td></tr>';
									
						aHTML.push('<tr id="trInterfaceMainDetailsURLMethod" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsURLMethod" class="interfaceMain">' +
										'URL Method' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsURLMethodValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsURLMethodValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsURLMethod" class="inputInterfaceMainText">' +
										'</td></tr>';
										
						aHTML.push('<tr id="trInterfaceMainDetailsPostData" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsPostData" class="interfaceMain">' +
										'POST Data' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsPostData" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainDetailsPostDataValue" class="interfaceMainTextMulti">' +
										'<textarea style="height: 250px;" rows="10" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMainDetailsPostData"' +
										' class="inputInterfaceMainTextMultiLarge"></textarea>' +
										'</td></tr>';
										
						aHTML.push('<tr id="trInterfaceMainDetailsInContext" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsInContext" class="interfaceMain">' +
										'In context of user' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsInContextValue" class="interfaceMainSelect">' +
										'<td id="tdInterfaceMainDetailsInContextValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioInContextN" name="radioInContext" value="N"/>No' +
										'<br /><input type="radio" id="radioInContextY" name="radioInContext" value="Y"/>Yes' +
										'</td></tr>';
										
						aHTML.push('</table>';					
						
						$('#divInterfaceMainDetails').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData == undefined)
						{	
							$('#inputInterfaceMainDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#inputInterfaceMainDetailsEndpoint').val(ns1blankspace.objectContextData.endpoint);
							$('#inputInterfaceMainDetailsURL').val(ns1blankspace.objectContextData.url);
							$('#inputInterfaceMainDetailsURLMethod').val(ns1blankspace.objectContextData.urlmethod);
							$('#inputInterfaceMainDetailsPostData').val(ns1blankspace.objectContextData.postdata);
							
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
							$('[name="radioInContext"][value="' + ns1blankspace.objectContextData.incontext + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioStatus"][value="2"]').attr('checked', true);
							$('[name="radioInContext"][value="N"]').attr('checked', true);
						}	
					}	
				},

	schedule:	function interfaceSetupAutomationSchedule()
				{
					var aHTML = [];
					
					
					if ($('#divInterfaceMainSchedule').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainSchedule').attr('onDemandLoading', '');
						
						aHTML.push('<table id="tableInterfaceMainSchedule" class="interfaceMainDetails">';
						aHTML.push('<tr id="trInterfaceMainScheduleRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainScheduleColumn1" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainScheduleColumn2" class="interfaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divInterfaceMainSchedule').html(aHTML.join(''));
						
						var aHTML = [];
						
					
						aHTML.push('<table id="tableInterfaceMainScheduleColumn1" class="interfaceMain">';
					
						aHTML.push('<tr id="trInterfaceMainScheduleTimeHour" class="interfaceMain">' +
										'<td id="tdInterfaceMainScheduleTimeHour" class="interfaceMain">' +
										'Time (24 Hour)' +
										'</td></tr>' +
										'<tr id="trInterfaceMainScheduleTimeHourValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainScheduleTimeHourValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainScheduleTimeHour" class="inputInterfaceMainText">' +
										'</td></tr>';
					
						aHTML.push('<tr id="trInterfaceMainScheduleTimeMinute" class="interfaceMain">' +
										'<td id="tdInterfaceMainScheduleTimeMinute" class="interfaceMain">' +
										'Time (Minute)' +
										'</td></tr>' +
										'<tr id="trInterfaceMainScheduleTimeMinuteValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainScheduleTimeMinuteValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainScheduleTimeMinute" class="inputInterfaceMainText">' +
										'</td></tr>';
						
										
						aHTML.push('</table>';					
						
						$('#tdInterfaceMainScheduleColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						
							
						aHTML.push('<table id="tableInterfaceMainScheduleColumn2" class="interfaceMain">';

						aHTML.push('<tr id="trInterfaceMainScheduleType" class="interfaceMain">' +
										'<td id="tdInterfaceMainScheduleType" class="interfaceMain">' +
										'Type (When)' +
										'</td></tr>' +
										'<tr id="trInterfaceMainScheduleType" class="interfaceMainText">' +
										'<td id="tdInterfaceMainScheduleTypeValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioScheduleType8" name="radioScheduleType" value="8"/>Every day' +
										'<br /><input type="radio" id="radioScheduleType7" name="radioScheduleType" value="7"/>Weekdays' +
										'<br /><input type="radio" id="radioScheduleType0" name="radioScheduleType" value="0"/>Sunday' +
										'<br /><input type="radio" id="radioScheduleType1" name="radioScheduleType" value="1"/>Monday' +
										'<br /><input type="radio" id="radioScheduleType2" name="radioScheduleType" value="2"/>Tuesday' +
										'<br /><input type="radio" id="radioScheduleType3" name="radioScheduleType" value="3"/>Wednesday' +
										'<br /><input type="radio" id="radioScheduleType4" name="radioScheduleType" value="4"/>Thursday' +
										'<br /><input type="radio" id="radioScheduleType5" name="radioScheduleType" value="5"/>Friday' +
										'<br /><input type="radio" id="radioScheduleType6" name="radioScheduleType" value="6"/>Saturday' +
										'</td></tr>';
						
						aHTML.push('</table>';					
						
						$('#tdInterfaceMainScheduleColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData == undefined)
						{
							$('#inputInterfaceMainScheduleTimeHour').val(ns1blankspace.objectContextData.scheduletimehour);
							$('#inputInterfaceMainScheduleTimeMinute').val(ns1blankspace.objectContextData.scheduletimeminute);
							$('[name="radioScheduleType"][value="' + ns1blankspace.objectContextData.scheduletype + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioScheduleType"][value="8"]').attr('checked', true);
						}
					}	
				},

	response: 	function interfaceSetupAutomationResponse()
				{
					var aHTML = [];
					

					if ($('#divInterfaceMainResponse').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainResponse').attr('onDemandLoading', '');
								
						aHTML.push('<table id="tableInterfaceMainResponse" class="interfaceMainDetails">';
						aHTML.push('<tr id="trInterfaceMainResponseRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainResponseColumn1" class="interfaceMainColumn1Large">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divInterfaceMainResponse').html(aHTML.join(''));
						
						var aHTML = [];
						
					
						aHTML.push('<table id="tableInterfaceMainResponseColumn1" class="interfaceMain">';
					
						aHTML.push('<tr id="trInterfaceMainResponseAction" class="interfaceMain">' +
										'<td id="tdInterfaceMainResponseAction" class="interfaceMain">' +
										'Response Action' +
										'</td></tr>' +
										'<tr id="trInterfaceMainResponseActionValue" class="interfaceMainSelect">' +
										'<td id="tdInterfaceMainResponseActionValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioResponseAction1" name="radioResponseAction" value="1"/>Email to network group' +
										'<br /><input type="radio" id="radioResponseAction3" name="radioResponseAction" value="3"/>' +
												'Send to URL' +
										'</td></tr>';
										
						aHTML.push('<tr id="trInterfaceMainResponseActionContext" class="interfaceMain">' +
										'<td id="tdInterfaceMainResponseActionContext" class="interfaceMain">' +
										'Action Context (eg Network Group ID' +
										'</td></tr>' +
										'<tr id="trInterfaceMainResponseActionContextValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainResponseActionContextValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainResponseActionContext" class="inputInterfaceMainText">' +
										'</td></tr>';

						aHTML.push('<tr id="trInterfaceMainResponseActionFrom" class="interfaceMain">' +
										'<td id="tdInterfaceMainResponseActionFrom" class="interfaceMain">' +
										'Action From (email)' +
										'</td></tr>' +
										'<tr id="trInterfaceMainResponseActionFromValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainResponseActionFromValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainResponseActionFrom" class="inputInterfaceMainText">' +
										'</td></tr>';
										
						aHTML.push('<tr id="trInterfaceMainResponseActionURL" class="interfaceMain">' +
										'<td id="tdInterfaceMainResponseActionURL" class="interfaceMain">' +
										'Response Action URL' +
										'</td></tr>' +
										'<tr id="trInterfaceMainResponseActionURL" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainResponseActionURLValue" class="interfaceMainTextMulti">' +
										'<textarea style="height: 50px;" rows="3" cols="35" id="inputInterfaceMainResponseActionURL"' +
										' class="inputInterfaceMainTextMultiLarge"></textarea>' +
										'</td></tr>';	
										
						aHTML.push('</table>';					
						
						$('#tdInterfaceMainResponseColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData == undefined)
						{
							$('[name="radioResponseAction"][value="' + ns1blankspace.objectContextData.responseaction + '"]').attr('checked', true);
							$('#inputInterfaceMainResponseActionContext').val(ns1blankspace.objectContextData.responseactioncontext);
							$('#inputInterfaceMainResponseActionFrom').val(ns1blankspace.objectContextData.responseactionfrom);
							$('#inputInterfaceMainResponseActionURL').val(ns1blankspace.objectContextData.responseactionurl);
						}
						else
						{
							$('[name="radioResponseAction"][value="1"]').attr('checked', true);
						}
					}	
				},

	format:		function interfaceSetupAutomationFormat()
				{
					var aHTML = [];
					

					if ($('#divInterfaceMainFormat').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainFormat').attr('onDemandLoading', '');
					
						aHTML.push('<table id="tableInterfaceMainFormatColumn1" class="interfaceMain">';
						
						aHTML.push('<tr id="trInterfaceMainFormatCaption" class="interfaceMain">' +
										'<td id="tdInterfaceMainFormatCaption" class="interfaceMain">' +
										'Captions' +
										'</td></tr>' +
										'<tr id="trInterfaceMainFormatCaption" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainFormatCaptionValue" class="interfaceMainTextMulti">' +
										'<textarea style="height: 50px;" rows="3" cols="35" id="inputInterfaceMainFormatCaption"' +
										' class="inputInterfaceMainTextMultiLarge"></textarea>' +
										'</td></tr>';			
						
						aHTML.push('<tr id="trInterfaceMainFormatCSSClass" class="interfaceMain">' +
										'<td id="tdInterfaceMainFormatCSSClass" class="interfaceMain">' +
										'CSS Class' +
										'</td></tr>' +
										'<tr id="trInterfaceMainFormatCSSClassValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainFormatCSSClassValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainFormatCSSClass" class="inputInterfaceMainText">' +
										'</td></tr>';
								
						aHTML.push('<tr id="trInterfaceMainFormatXHTMLStyle" class="interfaceMain">' +
										'<td id="tdInterfaceMainFormatXHTMLStyle" class="interfaceMain">' +
										'XHTML Style' +
										'</td></tr>' +
										'<tr id="trInterfaceMainFormatXHTMLStyle" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainFormatXHTMLStyleValue" class="interfaceMainTextMulti">' +
										'<textarea style="height: 50px;" rows="3" cols="35" id="inputInterfaceMainFormatXHTMLStyle"' +
										' class="inputInterfaceMainTextMultiLarge"></textarea>' +
										'</td></tr>';		

						aHTML.push('<tr id="trInterfaceMainFormatXHTMLAHref" class="interfaceMain">' +
										'<td id="tdInterfaceMainFormatXHTMLAHref" class="interfaceMain">' +
										'XHTML Href' +
										'</td></tr>' +
										'<tr id="trInterfaceMainFormatXHTMLAHref" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainFormatXHTMLAHrefValue" class="interfaceMainTextMulti">' +
										'<textarea style="height: 50px;" rows="3" cols="35" id="inputInterfaceMainFormatXHTMLAHref"' +
										' class="inputInterfaceMainTextMultiLarge"></textarea>' +
										'</td></tr>';	
										
						aHTML.push('</table>';					
						
						$('#divInterfaceMainFormat').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData == undefined)
						{
							$('#inputInterfaceMainFormatCaption').val(ns1blankspace.objectContextData.caption);
							$('#inputInterfaceMainFormatCSSClass').val(ns1blankspace.objectContextData.cssclass);
							$('#inputInterfaceMainFormatXHTMLStyle').val(ns1blankspace.objectContextData.xhtmlstyle);
							$('#inputInterfaceMainFormatXHTMLAHref').val(ns1blankspace.objectContextData.xhtmlahref);
						}
					}	
				}

	save: 		{
					send:		function interfaceSetupAutomationSave(oResponse)
								{
									if (oResponse == undefined)
									{
										var sParam = 'method=SETUP_AUTOMATION_MANAGE';
										var sData = '';
										
										if (giSetupContext != -1)
										{
											sParam += '&id=' + giSetupContext	
										}	
										
										if ($('#divInterfaceMainDetails').html() != '')
										{
											sData += '&title=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsTitle').val());
											sData += '&endpoint=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsEndpoint').val());
											sData += '&url=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsURL').val());
											sData += '&urlmethod=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsURLMethod').val());
											sData += '&postdata=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsPostData').val());
											sData += '&status=' + $('input[name="radioStatus"]:checked').val();
											sData += '&incontext=' + $('input[name="radioInContext"]:checked').val();
										};

										if ($('#divInterfaceMainSchedule').html() != '')
										{
											sData += '&scheduletimehour=' + ns1blankspace.util.fs($('#inputInterfaceMainScheduleTimeHour').val());
											sData += '&scheduletimeminute=' + ns1blankspace.util.fs($('#inputInterfaceMainScheduleTimeMinute').val());
											sData += '&scheduletype=' + $('input[name="radioScheduleType"]:checked').val();
										};
										
										if ($('#divInterfaceMainResponse').html() != '')
										{
											sData += '&responseactioncontext=' + ns1blankspace.util.fs($('#inputInterfaceMainResponseActionContext').val());
											sData += '&responseactionurl=' + ns1blankspace.util.fs($('#inputInterfaceMainResponseActionURL').val());
											sData += '&responseactionfrom=' + ns1blankspace.util.fs($('#inputInterfaceMainResponseActionFrom').val());
											sData += '&responseaction=' + $('input[name="radioResponseAction"]:checked').val();
											
										};

										if ($('#divInterfaceMainFormat').html() != '')
										{
											sData += '&caption=' + ns1blankspace.util.fs($('#inputInterfaceMainFormatCaption').val());
											sData += '&cssclass=' + ns1blankspace.util.fs($('#inputInterfaceMainFormatCSSClass').val());
											sData += '&xhtmlstyle=' + ns1blankspace.util.fs($('#inputInterfaceMainFormatXHTMLStyle').val());
											sData += '&xhtmlahref=' + ns1blankspace.util.fs($('#inputInterfaceMainFormatXHTMLAHref').val());
										};

										if (sData != '')
										{
											if (sData.slice(0,1) == '&') {sData = sData.replace('&', '')}
										
											$.ajax(
											{
												type: 'POST',
												url: '/ondemand/setup/?' + sParam,
												data: sData,
												dataType: 'json',
												success: interfaceSetupAutomationSave
											});
											
										}
										else
										{
											ns1blankspaceStatus('Saved');
										}	
									}	
									else
									{
										ns1blankspaceStatus('Saved')
										
										if (giSetupContext == -1)
										{
											giSetupContext = oResponse.id;
											ns1blankspace.inputDetected = false;
											interfaceSetupAutomationSearch('-' + giSetupContext, {source: 1});
										}	
									}
								}
				},				

	new: 		function interfaceSetupAutomationNew()
				{
					giSetupContext = -1;
					goSetupContextXML = undefined;
					interfaceSetupAutomationViewport();
					ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
					interfaceSetupAutomationDetails();
				}