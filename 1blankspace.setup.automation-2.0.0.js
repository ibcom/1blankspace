/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.setup.automation = 
{
	init: 		function (oParam)
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
						
						aHTML.push('<tr><td class="ns1blankspaceMainColumn2Action" style="width:175px;">' +
										'<a href="http://mydigitalstructure.com/gettingstarted_automation"' +
										' target="_blank">Automation Getting Started</a>' +
										'</td></tr>');
														
						aHTML.push('</table>');					

						$('#ns1blankspaceMostLikelyColumn2').html(aHTML.join(''));

						var aHTML = [];
									
						aHTML.push('<table>' +
										'<tr><td id="ns1blankspaceViewSetupAutomationLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>' +
										'</table>');		
						
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
											sElementId = 'ns1blankspaceViewBrowse';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.container.position(sElementId);
											ns1blankspace.search.start(sElementId);

											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('SETUP_AUTOMATION_SEARCH'),
												data: 'quicksearch=' + sSearchText,
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.automation.search.process(oParam, data)}
											});
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

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										ns1blankspaceSearchStop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.setup.automation.search.send(event.target.id, {source: 1});
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

						aHTML.push('<tr><td id="ns1blankspaceControlSchedule" class="ns1blankspaceControl">' +
										'Schedule</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlResponse" class="ns1blankspaceControl">' +
										'Response</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlFormatting" class="ns1blankspaceControl">' +
										'Formatting</td></tr>');
					}	
	
					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
				
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainSchedule" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainResponse" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainFormat" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainRun" class="ns1blankspaceControl"></div>');
					
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
				
					$('#ns1blankspaceControlSchedule').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSchedule'});
						ns1blankspace.setup.messaging.schedule();
					});	
					
					$('#ns1blankspaceControlSchedule').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainResponse'});
						ns1blankspace.setup.messaging.response();
					});	
					
					$('#ns1blankspaceControlFormat').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainFormat'});
						ns1blankspace.setup.messaging.format();
					});	
				
					$('#ns1blankspaceControlRun').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainRun'});
						ns1blankspace.setup.messaging.run();
					});
				},

	show:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.setup.automation.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
					
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this automation rule.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{		
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						
						$('#ns1blankspaceViewportControlAction').button({disabled: false});
						$('#ns1blankspaceViewportControlActionOptions').button({disabled: false});
						
						ns1blankspace.setup.automation.summary();
					}	
				},		
		
	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find automation.</td></tr>');
						aHTML.push('<tr>&nbsp;</tr></table>');
								
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

						aHTML.push('<table class="ns1blankspaceColumn1">');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Automation ID</td></tr>' +
										'<tr><td class="ns1blankspaceMainSummary">' +
										ns1blankspace.objectContextData.id +
										'</td></tr>');
										
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Endpoint</td></tr>' +
										'<tr><td class="ns1blankspaceMainSummary">' +
										ns1blankspace.objectContextData.endpoint +
										'</td></tr>');
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
							
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						aHTML.push('<tr><td class="ns1blankspace">' +
										'<a href="/ondemand/setup/?method=SETUP_AUTOMATION_RUN&ct=text/html&id=' + ns1blankspace.objectContext + '"' +
										' target="_blank" id="ns1blankspaceMainSummaryAutomationTestRun">Test Run</a>' +
										'</td></tr>');
														
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));		
					}	
				},

	details:	function ()
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
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Disabled' +
										'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Enabled' +
										'</td></tr>');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Endpoint' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input id="ins1blankspaceDetailsEndpoint" class="ns1blankspaceText">' +
										'</td></tr>');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'URL' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea style="height: 50px;" rows="3" cols="35" id="ns1blankspaceDetailsURL"' +
										' class="ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'URL Method' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsURLMethod" class="ns1blankspaceMainText">' +
										'</td></tr>');
									
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'POST Data' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea style="height: 50px;" rows="3" cols="35" id="ns1blankspaceDetailsPostData"' +
										' class="ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'In context of user' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioInContextN" name="radioInContext" value="N"/>No' +
										'<br /><input type="radio" id="radioInContextY" name="radioInContext" value="Y"/>Yes' +
										'</td></tr>');
														
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainDetails').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData == undefined)
						{	
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#ns1blankspaceDetailsEndpoint').val(ns1blankspace.objectContextData.endpoint);
							$('#ns1blankspaceDetailsURL').val(ns1blankspace.objectContextData.url);
							$('#ns1blankspaceDetailsURLMethod').val(ns1blankspace.objectContextData.urlmethod);
							$('#ns1blankspaceDetailsPostData').val(ns1blankspace.objectContextData.postdata);
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

	schedule:	function ()
				{
					if ($('#ns1blankspaceMainSchedule').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainSchedule').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceScheduleColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceScheduleColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');					
						
						$('#ns1blankspaceMainSchedule').html(aHTML.join(''));
										
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceContainer">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Time (24 Hour)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceScheduleTimeHour" class="ns1blankspaceMainText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Time (Minute)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceScheduleTimeMinute" class="ns1blankspaceMainText">' +
										'</td></tr>');
					
						aHTML.push('</table>');					
						
						$('#s1blankspaceScheduleColumn1').html(aHTML.join(''));
						
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceContainer ns1blankspaceColumn2">');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Type (When)' +
										'</td></tr>' +
										'<tr class="ns1blankspaceRadio">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioScheduleType8" name="radioScheduleType" value="8"/>Every day' +
										'<br /><input type="radio" id="radioScheduleType7" name="radioScheduleType" value="7"/>Weekdays' +
										'<br /><input type="radio" id="radioScheduleType0" name="radioScheduleType" value="0"/>Sunday' +
										'<br /><input type="radio" id="radioScheduleType1" name="radioScheduleType" value="1"/>Monday' +
										'<br /><input type="radio" id="radioScheduleType2" name="radioScheduleType" value="2"/>Tuesday' +
										'<br /><input type="radio" id="radioScheduleType3" name="radioScheduleType" value="3"/>Wednesday' +
										'<br /><input type="radio" id="radioScheduleType4" name="radioScheduleType" value="4"/>Thursday' +
										'<br /><input type="radio" id="radioScheduleType5" name="radioScheduleType" value="5"/>Friday' +
										'<br /><input type="radio" id="radioScheduleType6" name="radioScheduleType" value="6"/>Saturday' +
										'</td></tr>');
						
						aHTML.push('</table>');					
						
						$('#tdns1blankspaceMainScheduleColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData == undefined)
						{
							$('#ns1blankspaceMainScheduleTimeHour').val(ns1blankspace.objectContextData.scheduletimehour);
							$('#ns1blankspaceMainScheduleTimeMinute').val(ns1blankspace.objectContextData.scheduletimeminute);
							$('[name="radioScheduleType"][value="' + ns1blankspace.objectContextData.scheduletype + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioScheduleType"][value="8"]').attr('checked', true);
						}
					}	
				},

	response: 	function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainResponse').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainResponse').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceResponseColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceResponseColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceContainer">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Response Action' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioResponseAction1" name="radioResponseAction" value="1"/>' +
												'Email to network group' +
										'<br /><input type="radio" id="radioResponseAction3" name="radioResponseAction" value="3"/>' +
												'Send to URL' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Action Context (eg Network Group ID)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceResponseActionContext" class="ns1blankspaceMainText">' +
										'</td></tr>');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Action From (email)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceResponseActionFrom" class="ns1blankspaceMainText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Response Action URL' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceResponseActionURL" class="ns1blankspaceMainText">' +
										'</td></tr>');
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceResponseColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData == undefined)
						{
							$('[name="radioResponseAction"][value="' + ns1blankspace.objectContextData.responseaction + '"]').attr('checked', true);
							$('#ns1blankspaceResponseActionContext').val(ns1blankspace.objectContextData.responseactioncontext);
							$('#ns1blankspaceResponseActionFrom').val(ns1blankspace.objectContextData.responseactionfrom);
							$('#ns1blankspaceResponseActionURL').val(ns1blankspace.objectContextData.responseactionurl);
						}
						else
						{
							$('[name="radioResponseAction"][value="1"]').attr('checked', true);
						}
					}	
				},

	format:		function ns1blankspaceSetupAutomationFormat()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainFormat').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainFormat').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceFormatColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceFormatColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceContainer">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Caption' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea style="height: 50px;" rows="3" cols="35" id="ns1blankspaceFormatCaption"' +
												' class="ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'CSS Class' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceFormatCSSClass" class="ns1blankspaceMainText">' +
										'</td></tr>');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'XHTML Style' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea style="height: 50px;" rows="3" cols="35" id="ns1blankspaceFormatXHTMLStyle"' +
												' class="ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'XHTML Href' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea style="height: 50px;" rows="3" cols="35" id="ns1blankspaceFormatXHTMLAHref"' +
												' class="ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceFormat').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData == undefined)
						{
							$('#ns1blankspaceFormatCaption').val(ns1blankspace.objectContextData.caption);
							$('#ns1blankspaceFormatCSSClass').val(ns1blankspace.objectContextData.cssclass);
							$('#ns1blankspaceFormatXHTMLStyle').val(ns1blankspace.objectContextData.xhtmlstyle);
							$('#ns1blankspaceFormatXHTMLAHref').val(ns1blankspace.objectContextData.xhtmlahref);
						}
					}	
				},

	new: 		function ns1blankspaceSetupAutomationNew()
				{
					ns1blankspace.objectContext = -1;
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.setup.automation.layout();
					ns1blankspace.show({selector: '#divns1blankspaceMainDetails'});
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlActionOptions').button({disabled: true});
					ns1blankspace.setup.automation.details();
				},
							
	save: 		{
					send:		function (oResponse)
								{
									if (oResponse == undefined)
									{
										var sData = 'id=' + (ns1blankspace.objectContext != -1 ? ns1blankspace.objectContext : '');	
										
										if ($('#ns1blankspaceMainDetails').html() != '')
										{
											sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceMainDetailsTitle').val());
											sData += '&endpoint=' + ns1blankspace.util.fs($('#ns1blankspaceMainDetailsEndpoint').val());
											sData += '&url=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsURL').val());
											sData += '&urlmethod=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsURLMethod').val());
											sData += '&postdata=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPostData').val());
											sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
											sData += '&incontext=' + ns1blankspace.util.fs($('input[name="radioInContext"]:checked').val());
										};

										if ($('#ns1blankspaceMainSchedule').html() != '')
										{
											sData += '&scheduletimehour=' + ns1blankspace.util.fs($('#ns1blankspaceScheduleTimeHour').val());
											sData += '&scheduletimeminute=' + ns1blankspace.util.fs($('#ns1blankspaceScheduleTimeMinute').val());
											sData += '&scheduletype=' + ns1blankspace.util.fs($('input[name="radioScheduleType"]:checked').val());
										};
										
										if ($('#ns1blankspaceMainResponse').html() != '')
										{
											sData += '&responseactioncontext=' + ns1blankspace.util.fs($('#ns1blankspaceResponseActionContext').val());
											sData += '&responseactionurl=' + ns1blankspace.util.fs($('#ns1blankspaceResponseActionURL').val());
											sData += '&responseactionfrom=' + ns1blankspace.util.fs($('#ns1blankspaceResponseActionFrom').val());
											sData += '&responseaction=' + ns1blankspace.util.fs($('input[name="radioResponseAction"]:checked').val());
											
										};

										if ($('#ns1blankspaceMainFormat').html() != '')
										{
											sData += '&caption=' + ns1blankspace.util.fs($('#ns1blankspaceFormatCaption').val());
											sData += '&cssclass=' + ns1blankspace.util.fs($('#ns1blankspaceFormatCSSClass').val());
											sData += '&xhtmlstyle=' + ns1blankspace.util.fs($('#ns1blankspaceFormatXHTMLStyle').val());
											sData += '&xhtmlahref=' + ns1blankspace.util.fs($('#ns1blankspaceFormatXHTMLAHref').val());
										};

										if (sData != '')
										{
											if (sData.slice(0,1) == '&') {sData = sData.replace('&', '')}
										
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_AUTOMATION_MANAGE'),
												data: sData,
												dataType: 'json',
												success: ns1blankspace.setup.automation.save.send
											});	
										}
										else
										{
											ns1blankspace.status.message('Saved');
										}	
									}	
									else
									{
										ns1blankspace.status.message('Saved')
										
										if (ns1blankspace.objectContext == -1)
										{
											ns1blankspace.objectContext = oResponse.id;
											ns1blankspace.inputDetected = false;
											ns1blankspace.setup.automation.search.send('-' + ns1blankspace.objectContext, {source: 1});
										}	
									}
								}
				}
}				