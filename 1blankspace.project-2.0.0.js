
/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.project = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 1;
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectName = 'project';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Projects';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.project.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
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

						aHTML.push('<tr><td id="ns1blankspaceViewMessagingProjectLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');
								
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	

						var oSearch = new AdvancedSearch();
						oSearch.method = 'PROJECT_SEARCH';
						
						oSearch.addField('reference,description');
						oSearch.async = false;
						oSearch.rf = 'json';
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(ns1blankspace.project.home);		
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a project.</td></tr>' +
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
														this.reference +
														'</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');			
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.project.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function (sXHTMLElementId, oParam)
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
										$('#ns1blankspaceViewControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
									
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('PROJECT_SEARCH'),
											data: 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
											dataType: 'json',
											success: function(data) {ns1blankspace.project.show(oParam, data)}
										});
									}
									else
									{
										var iMinimumLength = 3;
										var iMaximumColumns = 1;
									
										if (iSource == undefined)
										{
											iSource = ns1blankspace.data.searchSource.text;
										}	
										
										if (sSearchText == undefined)
										{
											sSearchText = $(ns1blankspace.xhtml.container).val();
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
											ns1blankspace.container.position({xhtmlElementID: sElementId});
											ns1blankspace.search.start(sElementId);

											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('PROJECT_SEARCH'),
												data: 'quicksearch=' + ns1blankspace.util.fs(sSearchText),
												dataType: 'json',
												success: function(data) {ns1blankspace.project.search.process(oParam, data)}
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
										$(ns1blankspace.xhtml.container).hide();
										ns1blankspace.search.stop();
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
											
											aHTML.push('<td class="ns1blankspaceContactType' + this.type + ' ns1blankspaceSearch">&nbsp;</td>';
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'-' + this.id + '">' +
															this.reference +
															'</td>');
											
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
											ns1blankspace.project.search.send(event.target.id, {source: 1});
										});
									}	
											
								}
				},
								
	layout: 	function n()
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

						aHTML.push('<tr><td id="ns1blankspaceControlDescription" class="ns1blankspaceControl">' +
										'Description</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlTasks" class="ns1blankspaceControl">' +
										'Tasks</td></tr>');

						aHTML.push('</table>');		
					
						aHTML.push('<table class="ns1blankspaceControl">');
					
						aHTML.push('<tr><td id="ns1blankspaceControlActions" class="ns1blankspaceControl">' +
										'Actions</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');
					}	
					
					aHTML.push('</table>';					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainDescription" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainTasks" class="ns1blankspaceControl"></div>');		
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
							
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

					$('#ns1blankspaceControlDescription').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDescription'});
						ns1blankspace.project.description();
					});

					$('#ns1blankspaceControlTasks').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTasks'});
						ns1blankspace.project.tasks();
					});

					$('#ns1blankspaceControlActions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceActions', refresh: true});
						
						ns1blankspace.actions.show({xhtmlElementID: 'ns1blankspaceActions'});
					});
					
					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
						ns1blankspace.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments'});
					});
				},

	show: 		function ns1blankspaceProjectShow(oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.setup.messaging.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this project.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
					
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.reference);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.project.init({showHome: false});ns1blankspace.project.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.object({functionDefault: 'ns1blankspace.project.summary()'});
					}	

					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspaceProjectViewport();
				},

	summary: 	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this project.</td></tr></table>');
								
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
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Email</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryEmail" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>');

						if (ns1blankspace.objectContextData.startdate != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Server</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryServer" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.startdate +
										'</td></tr>');	
						}

						if (ns1blankspace.objectContextData.enddate != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Server</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryServer" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.enddate +
										'</td></tr>');
						}											
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
					}	
				},

	details: 	function ns1blankspaceProjectDetails()
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
										'<tr id="trns1blankspaceMainDetailsStartDateValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsStartDateValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainDetailsStartDate" class="inputns1blankspaceMainDate">' +
										'</td></tr>';			
										
						aHTML.push('<tr id="trns1blankspaceMainDetailsEndDate" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsEndDate" class="ns1blankspaceMain">' +
										'End Date' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsEndDateValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsEndDateValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainDetailsEndDate" class="inputns1blankspaceMainDate">' +
										'</td></tr>';			
								
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainDetailsColumn1').html(aHTML.join(''));
						
						$('input.inputns1blankspaceMainDate').datepicker({ dateFormat: 'dd M yy' });
						
						var aHTML = [];
						var h = -1;
							
						aHTML.push('<table id="tablens1blankspaceMainDetailsColumn2" class="ns1blankspaceMain">';
						
						aHTML.push('<tr id="trns1blankspaceMainDetailsStatus" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsStatus" class="ns1blankspaceMain">' +
										'Status' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsStatus" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsStatusValue" class="ns1blankspaceMainText">' +
										'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Not Started' +
										'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>In Progress' +
										'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>Ongoing' +
										'<br /><input type="radio" id="radioStatus6" name="radioStatus" value="6"/>On Hold' +
										'<br /><input type="radio" id="radioStatus7" name="radioStatus" value="7"/>Cancelled' +
										'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Completed' +
										'</td></tr>';
						
						aHTML.push('</table>';					
							
						$('#tdns1blankspaceMainDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputns1blankspaceMainDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
							$('#inputns1blankspaceMainDetailsStartDate').val(ns1blankspace.objectContextData.startdate);
							$('#inputns1blankspaceMainDetailsEndDate').val(ns1blankspace.objectContextData.enddate);
						}
						else
						{
							$('[name="radioStatus"][value="1"]').attr('checked', true);
						}
					}	
				},

	description: 
				function ns1blankspaceProjectDescription()
				{
					var aHTML = [];
					var h = -1;
					
					if ($('#divns1blankspaceMainDescription').attr('onDemandLoading') == '1')
					{
						$('#divns1blankspaceMainDescription').attr('onDemandLoading', '');
								
						aHTML.push('<table id="tablens1blankspaceMainDescription" class="ns1blankspaceMain">';
						aHTML.push('<tr id="trns1blankspaceMainDescriptionRow1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDescriptionColumn1" class="ns1blankspaceMain">' +
										'</td>' +
										'<td id="tdns1blankspaceMainDescriptionColumn2" class="ns1blankspaceMain">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divns1blankspaceMainDescription').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML.push('<table id="tablens1blankspaceMainDescriptionColumn1" class="ns1blankspaceMain">';
								
						aHTML.push('<tr id="trns1blankspaceMainDescriptionValue" class="ns1blankspaceMainTextMulti">' +
										'<td id="tdns1blankspaceMainDescriptionValue" class="ns1blankspaceMainTextMulti">' +
										'<textarea rows="30" cols="50" id="inputns1blankspaceMainDescription" class="inputns1blankspaceMainTextMulti inputns1blankspaceMainTextMultiLarge"></textarea>' +
										'</td></tr>';
										
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainDescriptionColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputns1blankspaceMainDescription').val(unescape(ns1blankspace.objectContextData.description));
						}
					}	
				},

	tasks: 		{
					show: 		function ns1blankspaceProjectTasks(oParam, oResponse)
								{
									
									var sXHTMLElementId = 'divns1blankspaceMainTasks';
									var sLabel = "Tasks";
									var iOption = 1;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
									}

									if (oResponse == undefined)
									{
										var sParam = 'method=PROJECT_TASK_SEARCH&rows=100' +
														'&project=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/project/',
											data: sParam,
											dataType: 'json',
											success: function(data){ns1blankspaceProjectTasks(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tablens1blankspaceMainTasks" class="ns1blankspaceMain">' +
													'<tr id="trns1blankspaceMainTasksRow1" class="ns1blankspaceMainRow1">' +
													'<td id="tdns1blankspaceMainTasksColumn1" class="ns1blankspaceMainColumn1Large">' +
													'</td>' +
													'<td id="tdns1blankspaceMainTasksColumn2" class="ns1blankspaceMainColumn2Action">' +
													'</td>' +
													'</tr>' +
													'</table>';				
										
										$('#divns1blankspaceMainTasks').html(aHTML.join(''));
										
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tablens1blankspaceMainTasksColumn2" class="ns1blankspaceMainColumn2">';
										
										aHTML.push('<tr><td id="tdns1blankspaceMainTasksAdd" class="ns1blankspaceMain">' +
														'<span id="spanns1blankspaceMainTasksAdd">Add</span>' +
														'</td></tr>';
										
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainTasksColumn2').html(aHTML.join(''));
										
										$('#spanns1blankspaceMainTasksAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											ns1blankspaceProjectTaskDetailsAdd();
										})
										
										var aHTML = [];
										var h = -1;
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="tableSetupProjectTasks" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceMainCaption">' +
															'<td class="ns1blankspaceMainRowNothing">No tasks.</td></tr>';
											aHTML.push('</tbody></table>';

											$('#tdns1blankspaceMainTasksColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="tableSetupProjectTasks" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push('<tbody>'
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceMainRow">';

												aHTML.push('<td style="width: 22px;" id="tdSetupProjectTasks_color-' + this.id + 
																	'" class="ns1blankspaceProjectTaskType' + this.typetext + 'BG ns1blankspaceProjectTaskTypeBG">&nbsp;</td>';
												
												aHTML.push('<td style="width: 420px;" id="tdSetupProjectTasks_title-' + this.id + '" class="ns1blankspaceMainRow">' +
																		this.title + '</td>';
																		
												aHTML.push('<td style="width: 23px;" id="tdSetupProjectTasks_delete-' + this.id + '" class="ns1blankspaceMainRowOptionsDelete">&nbsp;</td>';
												aHTML.push('<td style="width: 25px;" id="tdSetupProjectTasks_select-' + this.id + '" class="ns1blankspaceMainRowOptionsSelect">&nbsp;</td>';
												
												aHTML.push('</tr>'
											});
											
											aHTML.push('</tbody></table>';

											$('#tdns1blankspaceMainTasksColumn1').html(aHTML.join(''));
											
											$('.ns1blankspaceMainRowOptionsDelete').button({
												text: false,
												 icons: {
													 primary: "ui-icon-close"
												}
											})
											.click(function() {
												ns1blankspaceProjectTasksRemove(this.id)
											})
											.css('width', '15px')
											.css('height', '20px')
											
											$('.ns1blankspaceMainRowOptionsSelect').button({
												text: false,
												 icons: {
													 primary: "ui-icon-play"
												}
											})
											.click(function() {
												ns1blankspaceProjectTaskMasterViewport({showHome: false});
												ns1blankspaceProjectTaskSearch(this.id);
											})
											.css('width', '15px')
											.css('height', '20px')
										}
									}	
								},

					add:		function ns1blankspaceProjectTaskDetailsAdd(oParam, oResponse)
								{
									var sXHTMLElementId = "divns1blankspaceMainTaskDetails";
									var sXHTMLElementContextId;
									var lProjectTask;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
										if (oParam.xhtmlElementContextId != undefined) {sXHTMLElementContextId = oParam.xhtmlElementContextId}
										if (oParam.projectTask != undefined) {lProjectTask = oParam.projectTask}
									}

									if (sXHTMLElementContextId != undefined)
									{
										var aSearch = sXHTMLElementContextId.split('-');
										var sElementId = aSearch[0];
										var lProjectTask = aSearch[1];
									}	
										
									ns1blankspaceMainViewportShow("#divns1blankspaceMainTaskDetails");	
										
									var aHTML = [];
									var h = -1;
										
									aHTML.push('<table id="tablens1blankspaceMainProjectTaskDetails" class="ns1blankspaceMain">' +
													'<tr id="trns1blankspaceMainProjectTaskDetailsRow1" class="ns1blankspaceMainRow1">' +
													'<td id="tdns1blankspaceMainProjectTaskDetailsColumn1" class="ns1blankspaceMainColumn1Large">' +
													'</td>' +
													'<td id="tdns1blankspaceMainProjectTaskDetailsColumn2" class="ns1blankspaceMainColumn2Action">' +
													'</td>' +
													'</tr>' +
													'</table>';				
										
									$('#' + sXHTMLElementId).html(aHTML.join(''));
											
									if (oResponse == undefined && lProjectTask != undefined)
									{
										var sParam = 'method=PROJECT_TASK_SEARCH' +
														'&id=' + lProjectTask;
										
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/project/',
											data: sParam,
											dataType: 'xml',
											success: function(data){ns1blankspaceProjectTaskDetailsAdd(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tablens1blankspaceMainTaskDetailsColumn2" class="ns1blankspaceMainColumn2">';
										
										aHTML.push('<tr><td id="tdns1blankspaceMainTaskDetailsSave" class="ns1blankspaceMain">' +
														'<span id="spanns1blankspaceMainTaskDetailsSave">Save</span>' +
														'</td></tr>';
																
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainProjectTaskDetailsColumn2').html(aHTML.join(''));
										
										$('#spanns1blankspaceMainTaskDetailsSave').button(
										{
											label: "Save"
										})
										.click(function() {
											ns1blankspaceProjectTaskAddSave(oParam);
										})
										
										var aHTML = [];
										var h = -1;
															
										aHTML.push('<table id="tablens1blankspaceMainDetailsColumn1" class="ns1blankspaceMain">';					
															
										aHTML.push('<tr id="trns1blankspaceMainProjectTaskDetailsTitle" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsTitle" class="ns1blankspaceMain">' +
															'Title' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainProjectTaskDetailsTitleValue" class="ns1blankspaceMainText">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsTitleValue" class="ns1blankspaceMainText">' +
															'<input id="inputns1blankspaceMainProjectTaskDetailsTitle" class="inputns1blankspaceMainText">' +
															'</td></tr>';							
									
										aHTML.push('<tr id="trns1blankspaceMainProjectTaskDetailsDescriptionValue" class="ns1blankspaceMainTextMulti">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsDescriptionValue" class="ns1blankspaceMainTextMulti">' +
															'<textarea rows="10" cols="50" style="width:100%;" id="inputns1blankspaceMainProjectTaskDetailsDescription" class="inputns1blankspaceMainTextMulti"></textarea>' +
															'</td></tr>';
									
										aHTML.push('<tr id="trns1blankspaceMainProjectTaskDetailsType" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsType" class="ns1blankspaceMain">' +
															'Type' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainProjectTaskDetailsTypeValue" class="ns1blankspaceMainSelect">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsTypeValue" class="ns1blankspaceMainSelect">' +
															'<input id="inputns1blankspaceMainProjectTaskDetailsType" class="inputns1blankspaceMainSelect"' +
																' onDemandMethod="/ondemand/setup/?rf=XML&method=SETUP_PROJECT_TASK_TYPE_SEARCH">' +
															'</td></tr>';
									
										aHTML.push('<tr id="trns1blankspaceMainProjectTaskDetailsTaskBy" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsTaskBy" class="ns1blankspaceMain">' +
															'Task By' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainProjectTaskDetailsTaskByValue" class="ns1blankspaceMainSelect">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsTaskByValue" class="ns1blankspaceMainSelect">' +
															'<input id="inputns1blankspaceMainProjectTaskDetailsTaskBy" class="inputns1blankspaceMainSelect"' +
																' onDemandMethod="/ondemand/setup/?method=SETUP_USER_SEARCH&rf=XML" onDemandColumns="username">' +
															'</td></tr>';
									
															
										aHTML.push('<tr id="trns1blankspaceMainDetailsStartDate" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainDetailsStartDate" class="ns1blankspaceMain">' +
															'Start Date' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainDetailsStartDateValue" class="ns1blankspaceMainText">' +
															'<td id="tdns1blankspaceMainDetailsStartDateValue" class="ns1blankspaceMainText">' +
															'<input id="inputns1blankspaceMainProjectTaskDetailsStartDate" class="inputns1blankspaceMainDate">' +
															'</td></tr>';			
														
										aHTML.push('<tr id="trns1blankspaceMainDetailsEndDate" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainDetailsEndDate" class="ns1blankspaceMain">' +
															'End Date' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainDetailsEndDateValue" class="ns1blankspaceMainText">' +
															'<td id="tdns1blankspaceMainDetailsEndDateValue" class="ns1blankspaceMainText">' +
															'<input id="inputns1blankspaceMainProjectTaskDetailsEndDate" class="inputns1blankspaceMainDate">' +
															'</td></tr>';			
									
										aHTML.push('</table>';						
									
										$('#tdns1blankspaceMainProjectTaskDetailsColumn1').html(aHTML.join(''));
										
										$('input.inputns1blankspaceMainDate').datepicker({ dateFormat: 'dd M yy' });
										
										if (oResponse != undefined)
										{	
											if (oResponse.data.rows.length == 0)
											{	
												$('#inputns1blankspaceMainProjectTaskDetailsReference').val(oResponse.data.rows[0].reference);
												$('#inputns1blankspaceMainProjectTaskDetailsTitle').val(oResponse.data.rows[0].title);		
											}
										}	
									}	
								},

					save:		function ns1blankspaceProjectTaskAddSave()
								{
									var sParam = '/ondemand/project/?method=PROJECT_TASK_MANAGE'
									var sData = 'project=' + ns1blankspace.objectContext;
									
									sData += '&title=' + encodeURIComponent($('#inputns1blankspaceMainProjectTaskDetailsTitle').val());
									sData += '&type=' + encodeURIComponent($('#inputns1blankspaceMainProjectTaskDetailsType').attr('onDemandID'));
									sData += '&taskbyuser=' + encodeURIComponent($('#inputns1blankspaceMainProjectTaskDetailsTaskBy').attr('onDemandID'));
									sData += '&description=' + encodeURIComponent($('#inputns1blankspaceMainProjectTaskDetailsDescription').val());
									sData += '&startdate=' + ns1blankspace.util.fs($('#inputns1blankspaceMainProjectTaskDetailsStartDate').val());
									sData += '&enddate=' + ns1blankspace.util.fs($('#inputns1blankspaceMainProjectTaskDetailsEndDate').val());
										
									ns1blankspaceSave(sParam, sData, 'Task Added');
									ns1blankspaceMainViewportShow("#divns1blankspaceMainTasks", true);
									ns1blankspaceProjectTasks();	
								},

					remove:		function ns1blankspaceProjectTasksRemove(sXHTMLElementId)
								{

									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									
									var sParam = 'method=PROJECT_TASK_MANAGE&remove=1';
									var sData = 'id=' + sSearchContext;
												
									$.ajax(
										{
											type: 'POST',
											url: '/ondemand/project/?' + sParam,
											data: sData,
											dataType: 'text',
											success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
										});
										
								}	
				},

	new: 		function ns1blankspaceProjectNew()
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspaceProjectViewport();
					ns1blankspaceMainViewportShow("#divns1blankspaceMainDetails");
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
					ns1blankspaceProjectDetails();
				},

	save: 		{
					send:		function ns1blankspaceProjectSave()
								{
									var sData = 'id=' + ((ns1blankspace.objectContext == -1)?'':ns1blankspace.objectContext);
										
									if ($('#divns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsReference').val());
										sData += '&startdate=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsStartDate').val());
										sData += '&enddate=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsEndDate').val());
										sData += '&status=' + $('input[name="radioStatus"]:checked').val();
									}
									
									if ($('#divns1blankspaceMainDescription').html() != '')
									{
										sData += '&description=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDescription').val());
									}
										
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspaceEndpointURL('PROJECT_MANAGE'),
										data: sData,
										dataType: 'json',
										success: ns1blankspaceProjectSaveProcess
									});
								},

					process:	function ns1blankspaceProjectSaveProcess(oResponse)
								{
									
									if (oResponse.status == 'OK')
									{
										ns1blankspaceStatus('Project saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
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
