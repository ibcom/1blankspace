
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

	home: 		function interfaceProjectHomeShow(oResponse)
				{

					if (oResponse == undefined)
					{
						var aHTML = [];
						var h = -1;
									
						aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
						aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
										'<td id="tdInterfaceProjectHomeMostLikely" class="interfaceViewportMain">' +
										ns1blankspace.xhtml.loading + 
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMain').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
									
						aHTML[++h] = '<table>';
						aHTML[++h] = '<tr>' +
										'<td id="ns1blankspaceViewportProjectLarge" class="ns1blankspaceViewportImageLarge">' +
										'&nbsp;' + 
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';		
						
						$('#divInterfaceViewportControl').html(aHTML.join(''));	
						
						$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'PROJECT_SEARCH';
						
						oSearch.addField('reference,description');
						oSearch.async = false;
						oSearch.rf = 'json';
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(interfaceProjectHomeShow);
						
					}
					else
					{
						var aHTML = [];
						var h = -1;
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML[++h] = '<table id="tableInterfaceProjectHomeMostLikely">';
							aHTML[++h] = '<tr class="trInterfaceProjectHomeMostLikelyNothing">';
							aHTML[++h] = '<td class="tdInterfaceProjectHomeMostLikelyNothing">Click New to create a project.</td>';
							aHTML[++h] = '</tr>';
							aHTML[++h] = '</table>';
						}
						else
						{
							aHTML[++h] = '<table id="tableInterfaceProjectHomeMostLikely">';
							aHTML[++h] = '<tr>';
							aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
							aHTML[++h] = '</tr>';
							
							$.each(oResponse.data.rows, function()
							{	
								aHTML[++h] = '<tr class="interfaceMainRow">';
								
								aHTML[++h] = '<td id="interfaceProjectHomeMostLikely_Title-' +
														this.id + '" class="interfaceHomeMostLikely">' +
														this.reference + '</td>';
								
								aHTML[++h] = '</tr>';
							});
							
							aHTML[++h] = '</tbody></table>';
						};
						
						$('#tdInterfaceProjectHomeMostLikely').html(aHTML.join(''));
					
						$('td.interfaceHomeMostLikely').click(function(event)
						{
							interfaceProjectSearch(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function interfaceProjectSearch(sXHTMLElementId, oParam)
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
										var sParam = 'method=PROJECT_SEARCH&id=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/project/?' + sParam,
											dataType: 'json',
											success: function(data) {interfaceProjectShow(oParam, data)}
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
											sSearchText = $('#inputns1blankspaceViewportControlSearch').val();
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
											
											var sParam = 'method=PROJECT_SEARCH&quicksearch=' + sSearchText + 
																'&xhtmlcontext=' + sXHTMLElementId;

											$.ajax(
											{
												type: 'GET',
												url: '/ondemand/project/?' + sParam,
												dataType: 'json',
												success: function(data) {interfaceProjectSearchShow(oParam, data)}
											});
										}
									};	
								},

					process:	function interfaceProjectSearchShow(oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
											
									if (oResponse.data.rows.length == 0)
									{
										$('#divns1blankspaceViewportControlOptions').hide();
										ns1blankspaceSearchStop();
									}
									else
									{
										aHTML[++h] = '<table class="interfaceSearchMedium">';
										aHTML[++h] = '<tbody>'
											
										$.each(oResponse.data.rows, function()
										{
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML[++h] = '<tr class="interfaceSearch">';
											}
											
											aHTML[++h] = '<td class="interfaceContactType' + this.type + ' interfaceSearch">&nbsp;</td>';
											aHTML[++h] = '<td class="interfaceSearch" id="' +
															'-' + this.id + '">' +
															this.reference +
															'</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML[++h] = '</tr>'
												iColumn = 0;
											}	
										});
								    	
										aHTML[++h] = '</tbody></table>';

										$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
										$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
										
										ns1blankspaceSearchStop();
										
										$('td.interfaceSearch').click(function(event)
										{
											$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
											$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
											interfaceProjectSearch(event.target.id, {source: 1});
										});
									}	
											
								}
				},
								
	layout: 	function interfaceProjectViewport()
				{
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
					
					aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
										'</tr>';
					}
					else
					{
						aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
										'</tr>';
									
						aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
										'</tr>';
					
						aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlDescription" class="interfaceViewportControl">Description</td>' +
										'</tr>';
					
						aHTML[++h] = '<tr id="trInterfaceViewportControlTasks" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlTasks" class="interfaceViewportControl">Tasks</td>' +
										'</tr>';
					
						aHTML[++h] = '</table>';					

						/* aHTML[++h] = '<table id="tableInterfaceViewportControl2" class="interfaceViewportControl">';
					
						aHTML[++h] = '<tr id="trInterfaceViewportControlFinancials" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlFinancials" class="interfaceViewportControl">Financials</td>' +
										'</tr>';
									
						aHTML[++h] = '</table>';*/				
					
						aHTML[++h] = '<table id="tableInterfaceViewportControl3" class="interfaceViewportControl">';
					
						aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlActions" class="interfaceViewportControl">Actions</td>' +
										'</tr>';
									
						aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
										'</tr>';
					}
									
					aHTML[++h] = '</table>';					
							
					$('#divInterfaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainDescription" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainTasks" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainTaskDetails" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainFinancials" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
					
					$('#divInterfaceMain').html(aHTML.join(''));
					
					$('#tdInterfaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
						interfaceProjectSummary();
					});
					
					$('#tdInterfaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
						interfaceProjectDetails();
					});
					
					$('#tdInterfaceViewportControlDescription').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainDescription");
						interfaceProjectDescription();
					});
					
					$('#tdInterfaceViewportControlTasks').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainTasks", true);
						interfaceProjectTasks();
					});
					
					$('#tdInterfaceViewportControlFinancials').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainFinancials", true);
						interfaceProjectFinancials();
					});
					
					$('#tdInterfaceViewportControlActions').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainActions", true);
						ns1blankspaceActions({xhtmlElementID: 'divInterfaceMainActions'});
					});

					$('#tdInterfaceViewportControlAttachments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainAttachments", true);
						ns1blankspaceAttachments({xhtmlElementID: 'divInterfaceMainAttachments'});
					});
				},

	show: 		function interfaceProjectShow(oParam, oResponse)
				{
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
					interfaceProjectViewport();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find project.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];

						$('#divInterfaceViewportControlContext').html(ns1blankspace.objectContextData.reference);
						$('#spanns1blankspaceViewportControlAction').button({disabled: false});
						$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});
						
						ns1blankspaceViewportDestination({
							newDestination: 'interfaceProjectMasterViewport({showHome: false});interfaceProjectSearch("-' + ns1blankspace.objectContext + '")',
							move: false
							})
							
						interfaceProjectSummary();
					}	
				},

	summary: 	function interfaceProjectSummary()
				{
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find project.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
						aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
									'<td id="tdInterfaceMainSummaryColumn1Large" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainSummaryColumn2Action" class="interfaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainSummary').html(aHTML.join(''));
					
						var aHTML = [];
						var h = -1;	
					
						aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
						
						aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>';
										
						aHTML[++h] =  '<tr><td id="tdInterfaceMainSummaryStartDate" class="interfaceMainSummary">Start Date</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryStartDateValue" class="interfaceMainSummaryValue">' +
										ns1blankspace.objectContextData.startdate +
										'</td>' +
										'</tr>';
						
						aHTML[++h] =  '<tr><td id="tdInterfaceMainSummaryStartDate" class="interfaceMainSummary">End Date</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryEndDateValue" class="interfaceMainSummaryValue">' +
										ns1blankspace.objectContextData.enddate +
										'</td>' +
										'</tr>';
						
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;	
						
						aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action" cellspacing=0>';
												
						//aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryViewAsTimeline" class="interfaceMainColumn2Action">' +
						//				'<a href="#" id="aInterfaceMainSummaryViewAsTimeline">View As Timeline</a>' +
						//				'</td></tr>';
										
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
						
						$('#aInterfaceMainSummaryViewAsTimeline').click(function(event)
						{
							interfaceProjectViewAsTimeline();
						});
					}	
				},

	details: 	function interfaceProjectDetails()
				{
					var aHTML = [];
					var h = -1;
					
					if ($('#divInterfaceMainDetails').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainDetails').attr('onDemandLoading', '');
								
						aHTML[++h] = '<table id="tableInterfaceMainDetails" class="interfaceMainDetails">';
						aHTML[++h] = '<tr id="trInterfaceMainDetailsRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsColumn1" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainDetailsColumn2" class="interfaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainDetails').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
						
						aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
						
						aHTML[++h] = '<tr id="trInterfaceMainDetailsReference" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsReference" class="interfaceMain">' +
										'Reference' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsReference" class="inputInterfaceMainText">' +
										'</td></tr>';			

						aHTML[++h] = '<tr id="trInterfaceMainDetailsStartDate" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsStartDate" class="interfaceMain">' +
										'Start Date' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsStartDateValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsStartDateValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsStartDate" class="inputInterfaceMainDate">' +
										'</td></tr>';			
										
						aHTML[++h] = '<tr id="trInterfaceMainDetailsEndDate" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsEndDate" class="interfaceMain">' +
										'End Date' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsEndDateValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsEndDateValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsEndDate" class="inputInterfaceMainDate">' +
										'</td></tr>';			
								
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
						
						$('input.inputInterfaceMainDate').datepicker({ dateFormat: 'dd M yy' });
						
						var aHTML = [];
						var h = -1;
							
						aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
						
						aHTML[++h] = '<tr id="trInterfaceMainDetailsStatus" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsStatus" class="interfaceMain">' +
										'Status' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsStatus" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsStatusValue" class="interfaceMainText">' +
										'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Not Started' +
										'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>In Progress' +
										'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>Ongoing' +
										'<br /><input type="radio" id="radioStatus6" name="radioStatus" value="6"/>On Hold' +
										'<br /><input type="radio" id="radioStatus7" name="radioStatus" value="7"/>Cancelled' +
										'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Completed' +
										'</td></tr>';
						
						aHTML[++h] = '</table>';					
							
						$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputInterfaceMainDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
							$('#inputInterfaceMainDetailsStartDate').val(ns1blankspace.objectContextData.startdate);
							$('#inputInterfaceMainDetailsEndDate').val(ns1blankspace.objectContextData.enddate);
						}
						else
						{
							$('[name="radioStatus"][value="1"]').attr('checked', true);
						}
					}	
				},

	description: 
				function interfaceProjectDescription()
				{
					var aHTML = [];
					var h = -1;
					
					if ($('#divInterfaceMainDescription').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainDescription').attr('onDemandLoading', '');
								
						aHTML[++h] = '<table id="tableInterfaceMainDescription" class="interfaceMain">';
						aHTML[++h] = '<tr id="trInterfaceMainDescriptionRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainDescriptionColumn1" class="interfaceMain">' +
										'</td>' +
										'<td id="tdInterfaceMainDescriptionColumn2" class="interfaceMain">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainDescription').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tableInterfaceMainDescriptionColumn1" class="interfaceMain">';
								
						aHTML[++h] = '<tr id="trInterfaceMainDescriptionValue" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainDescriptionValue" class="interfaceMainTextMulti">' +
										'<textarea rows="30" cols="50" id="inputInterfaceMainDescription" class="inputInterfaceMainTextMulti inputInterfaceMainTextMultiLarge"></textarea>' +
										'</td></tr>';
										
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainDescriptionColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputInterfaceMainDescription').val(unescape(ns1blankspace.objectContextData.description));
						}
					}	
				},

	tasks: 		{
					show: 		function interfaceProjectTasks(oParam, oResponse)
								{
									
									var sXHTMLElementId = 'divInterfaceMainTasks';
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
											success: function(data){interfaceProjectTasks(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										aHTML[++h] = '<table id="tableInterfaceMainTasks" class="interfaceMain">' +
													'<tr id="trInterfaceMainTasksRow1" class="interfaceMainRow1">' +
													'<td id="tdInterfaceMainTasksColumn1" class="interfaceMainColumn1Large">' +
													'</td>' +
													'<td id="tdInterfaceMainTasksColumn2" class="interfaceMainColumn2Action">' +
													'</td>' +
													'</tr>' +
													'</table>';				
										
										$('#divInterfaceMainTasks').html(aHTML.join(''));
										
										var aHTML = [];
										var h = -1;
										
										aHTML[++h] = '<table id="tableInterfaceMainTasksColumn2" class="interfaceMainColumn2">';
										
										aHTML[++h] = '<tr><td id="tdInterfaceMainTasksAdd" class="interfaceMain">' +
														'<span id="spanInterfaceMainTasksAdd">Add</span>' +
														'</td></tr>';
										
										aHTML[++h] = '</table>';					
										
										$('#tdInterfaceMainTasksColumn2').html(aHTML.join(''));
										
										$('#spanInterfaceMainTasksAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											interfaceProjectTaskDetailsAdd();
										})
										
										var aHTML = [];
										var h = -1;
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML[++h] = '<table id="tableSetupProjectTasks" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
											aHTML[++h] = '<tbody>'
											aHTML[++h] = '<tr class="interfaceMainCaption">' +
															'<td class="interfaceMainRowNothing">No tasks.</td></tr>';
											aHTML[++h] = '</tbody></table>';

											$('#tdInterfaceMainTasksColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML[++h] = '<table id="tableSetupProjectTasks" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
											aHTML[++h] = '<tbody>'
											
											$.each(oResponse.data.rows, function()
											{
												aHTML[++h] = '<tr class="interfaceMainRow">';

												aHTML[++h] = '<td style="width: 22px;" id="tdSetupProjectTasks_color-' + this.id + 
																	'" class="interfaceProjectTaskType' + this.typetext + 'BG interfaceProjectTaskTypeBG">&nbsp;</td>';
												
												aHTML[++h] = '<td style="width: 420px;" id="tdSetupProjectTasks_title-' + this.id + '" class="interfaceMainRow">' +
																		this.title + '</td>';
																		
												aHTML[++h] = '<td style="width: 23px;" id="tdSetupProjectTasks_delete-' + this.id + '" class="interfaceMainRowOptionsDelete">&nbsp;</td>';
												aHTML[++h] = '<td style="width: 25px;" id="tdSetupProjectTasks_select-' + this.id + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
												
												aHTML[++h] = '</tr>'
											});
											
											aHTML[++h] = '</tbody></table>';

											$('#tdInterfaceMainTasksColumn1').html(aHTML.join(''));
											
											$('.interfaceMainRowOptionsDelete').button({
												text: false,
												 icons: {
													 primary: "ui-icon-close"
												}
											})
											.click(function() {
												interfaceProjectTasksRemove(this.id)
											})
											.css('width', '15px')
											.css('height', '20px')
											
											$('.interfaceMainRowOptionsSelect').button({
												text: false,
												 icons: {
													 primary: "ui-icon-play"
												}
											})
											.click(function() {
												interfaceProjectTaskMasterViewport({showHome: false});
												interfaceProjectTaskSearch(this.id);
											})
											.css('width', '15px')
											.css('height', '20px')
										}
									}	
								},

					add:		function interfaceProjectTaskDetailsAdd(oParam, oResponse)
								{
									var sXHTMLElementId = "divInterfaceMainTaskDetails";
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
										
									ns1blankspaceMainViewportShow("#divInterfaceMainTaskDetails");	
										
									var aHTML = [];
									var h = -1;
										
									aHTML[++h] = '<table id="tableInterfaceMainProjectTaskDetails" class="interfaceMain">' +
													'<tr id="trInterfaceMainProjectTaskDetailsRow1" class="interfaceMainRow1">' +
													'<td id="tdInterfaceMainProjectTaskDetailsColumn1" class="interfaceMainColumn1Large">' +
													'</td>' +
													'<td id="tdInterfaceMainProjectTaskDetailsColumn2" class="interfaceMainColumn2Action">' +
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
											success: function(data){interfaceProjectTaskDetailsAdd(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										aHTML[++h] = '<table id="tableInterfaceMainTaskDetailsColumn2" class="interfaceMainColumn2">';
										
										aHTML[++h] = '<tr><td id="tdInterfaceMainTaskDetailsSave" class="interfaceMain">' +
														'<span id="spanInterfaceMainTaskDetailsSave">Save</span>' +
														'</td></tr>';
																
										aHTML[++h] = '</table>';					
										
										$('#tdInterfaceMainProjectTaskDetailsColumn2').html(aHTML.join(''));
										
										$('#spanInterfaceMainTaskDetailsSave').button(
										{
											label: "Save"
										})
										.click(function() {
											interfaceProjectTaskAddSave(oParam);
										})
										
										var aHTML = [];
										var h = -1;
															
										aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';					
															
										aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsTitle" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTitle" class="interfaceMain">' +
															'Title' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsTitleValue" class="interfaceMainText">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTitleValue" class="interfaceMainText">' +
															'<input id="inputInterfaceMainProjectTaskDetailsTitle" class="inputInterfaceMainText">' +
															'</td></tr>';							
									
										aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsDescriptionValue" class="interfaceMainTextMulti">' +
															'<td id="tdInterfaceMainProjectTaskDetailsDescriptionValue" class="interfaceMainTextMulti">' +
															'<textarea rows="10" cols="50" style="width:100%;" id="inputInterfaceMainProjectTaskDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
															'</td></tr>';
									
										aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsType" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsType" class="interfaceMain">' +
															'Type' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsTypeValue" class="interfaceMainSelect">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTypeValue" class="interfaceMainSelect">' +
															'<input id="inputInterfaceMainProjectTaskDetailsType" class="inputInterfaceMainSelect"' +
																' onDemandMethod="/ondemand/setup/?rf=XML&method=SETUP_PROJECT_TASK_TYPE_SEARCH">' +
															'</td></tr>';
									
										aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsTaskBy" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTaskBy" class="interfaceMain">' +
															'Task By' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsTaskByValue" class="interfaceMainSelect">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTaskByValue" class="interfaceMainSelect">' +
															'<input id="inputInterfaceMainProjectTaskDetailsTaskBy" class="inputInterfaceMainSelect"' +
																' onDemandMethod="/ondemand/setup/?method=SETUP_USER_SEARCH&rf=XML" onDemandColumns="username">' +
															'</td></tr>';
									
															
										aHTML[++h] = '<tr id="trInterfaceMainDetailsStartDate" class="interfaceMain">' +
															'<td id="tdInterfaceMainDetailsStartDate" class="interfaceMain">' +
															'Start Date' +
															'</td></tr>' +
															'<tr id="trInterfaceMainDetailsStartDateValue" class="interfaceMainText">' +
															'<td id="tdInterfaceMainDetailsStartDateValue" class="interfaceMainText">' +
															'<input id="inputInterfaceMainProjectTaskDetailsStartDate" class="inputInterfaceMainDate">' +
															'</td></tr>';			
														
										aHTML[++h] = '<tr id="trInterfaceMainDetailsEndDate" class="interfaceMain">' +
															'<td id="tdInterfaceMainDetailsEndDate" class="interfaceMain">' +
															'End Date' +
															'</td></tr>' +
															'<tr id="trInterfaceMainDetailsEndDateValue" class="interfaceMainText">' +
															'<td id="tdInterfaceMainDetailsEndDateValue" class="interfaceMainText">' +
															'<input id="inputInterfaceMainProjectTaskDetailsEndDate" class="inputInterfaceMainDate">' +
															'</td></tr>';			
									
										aHTML[++h] = '</table>';						
									
										$('#tdInterfaceMainProjectTaskDetailsColumn1').html(aHTML.join(''));
										
										$('input.inputInterfaceMainDate').datepicker({ dateFormat: 'dd M yy' });
										
										if (oResponse != undefined)
										{	
											if (oResponse.data.rows.length == 0)
											{	
												$('#inputInterfaceMainProjectTaskDetailsReference').val(oResponse.data.rows[0].reference);
												$('#inputInterfaceMainProjectTaskDetailsTitle').val(oResponse.data.rows[0].title);		
											}
										}	
									}	
								},

					save:		function interfaceProjectTaskAddSave()
								{
									var sParam = '/ondemand/project/?method=PROJECT_TASK_MANAGE'
									var sData = 'project=' + ns1blankspace.objectContext;
									
									sData += '&title=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsTitle').val());
									sData += '&type=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsType').attr('onDemandID'));
									sData += '&taskbyuser=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsTaskBy').attr('onDemandID'));
									sData += '&description=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsDescription').val());
									sData += '&startdate=' + ns1blankspace.util.fs($('#inputInterfaceMainProjectTaskDetailsStartDate').val());
									sData += '&enddate=' + ns1blankspace.util.fs($('#inputInterfaceMainProjectTaskDetailsEndDate').val());
										
									ns1blankspaceSave(sParam, sData, 'Task Added');
									ns1blankspaceMainViewportShow("#divInterfaceMainTasks", true);
									interfaceProjectTasks();	
								},

					remove:		function interfaceProjectTasksRemove(sXHTMLElementId)
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

	new: 		function interfaceProjectNew()
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					interfaceProjectViewport();
					ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
					interfaceProjectDetails();
				},

	save: 		{
					send:		function interfaceProjectSave()
								{
									var sData = 'id=' + ((ns1blankspace.objectContext == -1)?'':ns1blankspace.objectContext);
										
									if ($('#divInterfaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsReference').val());
										sData += '&startdate=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsStartDate').val());
										sData += '&enddate=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsEndDate').val());
										sData += '&status=' + $('input[name="radioStatus"]:checked').val();
									}
									
									if ($('#divInterfaceMainDescription').html() != '')
									{
										sData += '&description=' + ns1blankspace.util.fs($('#inputInterfaceMainDescription').val());
									}
										
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspaceEndpointURL('PROJECT_MANAGE'),
										data: sData,
										dataType: 'json',
										success: interfaceProjectSaveProcess
									});
								},

					process:	function interfaceProjectSaveProcess(oResponse)
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
