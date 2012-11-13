/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.setup.project = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 1;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'project';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Project Templates';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.project.init({showHome: true});',
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

						aHTML.push('<tr><td id="ns1blankspaceViewProjectLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');

						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var sParam = 'method=PROJECT_SEARCH';
						sParam += '&template=1';
						
						$.ajax(
						{
							type: 'GET',
							url: '/ondemand/project/?' + sParam,
							dataType: 'json',
							success: ns1blankspace.setup.project.home
						});
						
					}
					else
					{
						var aHTML = [];

						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a new project template.</td></tr>' +
											'</table>');
						}
						else
						{
							aHTML.push('<table>');
							aHTML.push('<tr>');
							aHTML.push('<td class="ns1blankspaceCaption">MOST LIKELY</td>');
							aHTML.push('</tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + '" class="ns1blankspaceMostLikely">' +
														this.reference + '</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.setup.project.search.send(event.target.id, {source: 1});
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
									var sQuickSearchType = '';
									
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
										sParam += '&template=1';
										
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/project/?' + sParam,
											dataType: 'json',
											success: function(data) {interfaceSetupProjectShow(oParam, data)}
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
											sSearchText = aSearch[1];
											sElementId = 'tableInterfaceViewportMasterBrowse';
											sQuickSearchType = 'start';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspaceOptionsSetPosition(sElementId);
											
											var sParam = 'method=PROJECT_SEARCH&quicksearch' + sQuickSearchType + '=' + sSearchText + 
																'&xhtmlcontext=' + sXHTMLElementId;
																sParam += '&template=1';

											$.ajax(
											{
												type: 'GET',
												url: '/ondemand/project/?' + sParam,
												dataType: 'json',
												success: function(data) {interfaceSetupProjectSearchShow(oParam, data)}
											});
											
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
										$('#divns1blankspaceViewportControlOptions').hide();
									}
									else
									{
										aHTML.push('<table class="interfaceSearchMedium">';
										aHTML.push('<tbody>'
											
										$.each(oResponse.data.rows, function()
										{
											aHTML.push('<tr class="interfaceSearch">';

											aHTML.push('<td class="interfaceContactType' + this.type + ' interfaceSearch">&nbsp;</td>';
											aHTML.push('<td class="interfaceSearch" id="' +
															'-' + this.id + '">' +
															this.reference +
															'</td>';
											
											aHTML.push('</tr>'
										});
								    	
										aHTML.push('</tbody></table>';

										$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
										$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
										
										$('td.interfaceSearch').click(function(event)
										{
											$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
											$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
											interfaceSetupProjectSearch(event.target.id, {source: 1});
										});
									}			
								}
				},				

	layout:		function interfaceSetupProjectViewport()
				{
					
					var aHTML = [];
					var h = -1;

					aHTML.push('<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
					
					aHTML.push('<table id="tableInterfaceViewportControl1" class="interfaceViewportControl">';
					
					aHTML.push('<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
									'</tr>';
					
					aHTML.push('<tr id="trInterfaceViewportControlDescription" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlDescription" class="interfaceViewportControl">Description</td>' +
									'</tr>';
					
					aHTML.push('<tr id="trInterfaceViewportControlTasks" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlTasks" class="interfaceViewportControl">Tasks</td>' +
									'</tr>';
					
					aHTML.push('</table>';					

					aHTML.push('<table id="tableInterfaceViewportControl3" class="interfaceViewportControl">';
									
					aHTML.push('<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
									'</tr>';
									
					aHTML.push('</table>';					
							
					$('#divInterfaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;

					aHTML.push('<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
					aHTML.push('<div id="divInterfaceMainDescription" class="divInterfaceViewportMain"></div>';
					aHTML.push('<div id="divInterfaceMainTasks" class="divInterfaceViewportMain"></div>';
					aHTML.push('<div id="divInterfaceMainTaskDetails" class="divInterfaceViewportMain"></div>';
					aHTML.push('<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
					aHTML.push('<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
					
					$('#divInterfaceMain').html(aHTML.join(''));
					
					$('#tdInterfaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
						interfaceSetupProjectSummary();
					});
					
					$('#tdInterfaceViewportControlDescription').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainDescription");
						interfaceSetupProjectDescription();
					});
					
					$('#tdInterfaceViewportControlTasks').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainTasks", true);
						interfaceSetupProjectTasks();
					});
					
					$('#tdInterfaceViewportControlActions').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainActions", true);
						ns1blankspaceActions("divInterfaceMainActions", ns1blankspace.data.object.contactperson, ns1blankspace.objectContext);
					});

					$('#tdInterfaceViewportControlAttachments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainAttachments", true);
						ns1blankspaceAttachments("divInterfaceMainAttachments", ns1blankspace.data.object.contactperson, ns1blankspace.objectContext);
					});
				},

	show:		function interfaceSetupProjectShow(oParam, oResponse)
				{
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
					interfaceSetupProjectViewport();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find project.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
								
						var sContext = ns1blankspace.objectContextData.reference;
						sContext += '<br /><span id="spanInterfaceViewportControlSubContext">(Template)</span>';		
						
						$('#divInterfaceViewportControlContext').html(sContext);
						
						interfaceSetupProjectSummary();
					}	
				},

	summary:	function interfaceSetupProjectSummary()
				{
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find project template.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table id="tableInterfaceMainSummary" class="interfaceMain">';
						aHTML.push('<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
										'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divInterfaceMainSummary').html(aHTML.join(''));
						
						aHTML.push('<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
						
						aHTML.push('<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>';

						aHTML.push('</table>';					
						
						$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

						$('#aInterfaceMainSummaryViewAsTimeline').click(function(event)
						{
							interfaceSetupProjectViewAsTimeline();
						});
					}	
				},

	descriptions:
				function interfaceSetupProjectDescription()
				{
					
					var aHTML = [];
					var h = -1;
					
					if ($('#divInterfaceMainDescription').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainDescription').attr('onDemandLoading', '');
								
						aHTML.push('<table id="tableInterfaceMainDescription" class="interfaceMain">';
						aHTML.push('<tr id="trInterfaceMainDescriptionRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainDescriptionColumn1" class="interfaceMain">' +
										'</td>' +
										'<td id="tdInterfaceMainDescriptionColumn2" class="interfaceMain">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divInterfaceMainDescription').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML.push('<table id="tableInterfaceMainDescriptionColumn1" class="interfaceMain">';
								
						aHTML.push('<tr id="trInterfaceMainDescriptionValue" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainDescriptionValue" class="interfaceMainTextMulti">' +
										'<textarea rows="30" cols="50" id="inputInterfaceMainDescription" class="inputInterfaceMainTextMulti inputInterfaceMainTextMultiLarge"></textarea>' +
										'</td></tr>';
										
						aHTML.push('</table>';					
						
						$('#tdInterfaceMainDescriptionColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputInterfaceMainDescription').val(ns1blankspace.objectContextData.description);
						}
					}	
				},

	tasks:		{
					show: 		function interfaceSetupProjectTasks(oParam, oResponse)
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
										var sParam = 'method=PROJECT_TASK_SEARCH&rows=' + ns1blankspace.option.defaultRows +
														'&project=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/project/?',
											data: sParam,
											dataType: 'json',
											success: function(data){interfaceSetupProjectTasks(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tableInterfaceMainTasks" class="interfaceMain">' +
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
										
										aHTML.push('<table id="tableInterfaceMainTasksColumn2" class="interfaceMainColumn2">';
										
										aHTML.push('<tr><td id="tdInterfaceMainTasksAdd" class="interfaceMain">' +
														'<span id="spanInterfaceMainTasksAdd">Add</span>' +
														'</td></tr>';
																
										aHTML.push('<tr><td id="tdInterfaceMainTasksAdd" class="interfaceMain">' +
														'&nbsp;' +
														'</td></tr>';
																
										aHTML.push('</table>';					
										
										$('#tdInterfaceMainTasksColumn2').html(aHTML.join(''));
										
										$('#spanInterfaceMainTasksAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											interfaceSetupProjectTaskDetailsAdd();
										})
										
										var aHTML = [];
										var h = -1;
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="tableSetupProjectTasks" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="interfaceMainCaption">' +
															'<td class="interfaceMainRowNothing">No tasks.</td></tr>';
											aHTML.push('</tbody></table>';

											$('#tdInterfaceMainTasksColumn1').html(aHTML.join(''));
											
										}
										else
										{
											aHTML.push('<table id="tableSetupProjectTasks" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="interfaceMainCaption">';
											aHTML.push('<td class="interfaceMainCaption">Title</td>';
											aHTML.push('<td class="interfaceMainCaption">&nbsp;</td>';
											aHTML.push('</tr>';
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(interfaceSetupProjectTasksRow(this)
											});
											
											aHTML.push('</tbody></table>';

											ns1blankspacePaginationList(
											{
												xhtmlElementID: 'tdInterfaceMainTasksColumn1',
												xhtmlContext: 'SetupProjectTasks',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: interfaceSetupProjectTasksRow,
												functionNewPage: 'interfaceSetupProjectTasksBind()',
												type: 'json'
											}); 	

											$('#tdInterfaceMainTasksColumn1').html(aHTML.join(''));
											
											interfaceSetupProjectTasksBind();
										}
									}	
								},

					row:		function interfaceSetupProjectTasksRow(oRow)
								{
									var aHTML = [];
									var h = -1;
									
									aHTML.push('<tr class="interfaceMainRow">';
												
									aHTML.push('<td id="tdSetupProjectTasks_title-' + oRow.id + '" class="interfaceMainRow">' +
															oRow.title + '</td>';
															
									aHTML.push('<td class="interfaceMainRow" style="width: 40px;text-align:right;"><span id="tdSetupProjectTasks_delete-' +
														oRow.id + '" class="interfaceMainRowOptionsDelete">&nbsp;</span>';
									aHTML.push('<span id="tdSetupProjectTasks_select-' + oRow.id + '" class="interfaceMainRowOptionsSelect">&nbsp;</span></td>';
									
									aHTML.push('</tr>'
									
									return aHTML.join('');
								},

					bind:		function interfaceSetupProjectTasksBind()
								{
									$('.interfaceMainRowOptionsDelete').button({
												text: false,
												 icons: {
													 primary: "ui-icon-close"
												}
											})
											.click(function() {
												interfaceSetupProjectTasksRemove(this.id)
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
										interfaceSetupProjectTaskMasterViewport({showHome: false});
										interfaceSetupProjectTaskSearch(this.id);
									})
									.css('width', '15px')
									.css('height', '20px')
								},

					add:		function interfaceSetupProjectTaskDetailsAdd(oParam, oResponse)
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
										
									aHTML.push('<table id="tableInterfaceMainProjectTaskDetails" class="interfaceMain">' +
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
											url: '/ondemand/project/?',
											data: sParam,
											dataType: 'json',
											success: function(data){interfaceSetupProjectTaskDetailsAdd(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tableInterfaceMainTaskDetailsColumn2" class="interfaceMainColumn2">';
										
										aHTML.push('<tr><td id="tdInterfaceMainTaskDetailsSave" class="interfaceMain">' +
														'<span id="spanInterfaceMainTaskDetailsSave">Save</span>' +
														'</td></tr>';
																
										aHTML.push('</table>';					
										
										$('#tdInterfaceMainProjectTaskDetailsColumn2').html(aHTML.join(''));
										
										$('#spanInterfaceMainTaskDetailsSave').button(
										{
											label: "Save"
										})
										.click(function() {
											interfaceSetupProjectTaskAddSave(oParam);
										})
										
										var aHTML = [];
										var h = -1;
															
										aHTML.push('<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';					
															
										aHTML.push('<tr id="trInterfaceMainProjectTaskDetailsTitle" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTitle" class="interfaceMain">' +
															'Title' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsTitleValue" class="interfaceMainText">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTitleValue" class="interfaceMainText">' +
															'<input id="inputInterfaceMainProjectTaskDetailsTitle" class="inputInterfaceMainText">' +
															'</td></tr>';							
									
										aHTML.push('<tr id="trInterfaceMainProjectTaskDetailsDescriptionValue" class="interfaceMainTextMulti">' +
															'<td id="tdInterfaceMainProjectTaskDetailsDescriptionValue" class="interfaceMainTextMulti">' +
															'<textarea rows="10" cols="50" style="width:100%;" onDemandType="TEXTMULTI" id="inputInterfaceMainProjectTaskDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
															'</td></tr>';
									
										aHTML.push('<tr id="trInterfaceMainProjectTaskDetailsType" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsType" class="interfaceMain">' +
															'Type' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsTypeValue" class="interfaceMainSelect">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTypeValue" class="interfaceMainSelect">' +
															'<input id="inputInterfaceMainProjectTaskDetailsType" class="inputInterfaceMainSelect"' +
																' onDemandMethod="/ondemand/setup/?rf=XML&method=SETUP_PROJECT_TASK_TYPE_SEARCH">' +
															'</td></tr>';
									
										aHTML.push('<tr id="trInterfaceMainProjectTaskDetailsTaskBy" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTaskBy" class="interfaceMain">' +
															'Task By' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsTaskByValue" class="interfaceMainSelect">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTaskByValue" class="interfaceMainSelect">' +
															'<input id="inputInterfaceMainProjectTaskDetailsTaskBy" class="inputInterfaceMainSelect"' +
																' onDemandMethod="/ondemand/setup/?method=SETUP_USER_SEARCH&rf=XML" onDemandColumns="username">' +
															'</td></tr>';
									
										aHTML.push('<tr id="trInterfaceMainProjectTaskDetailsTaskDependsOn" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTaskDependsOn" class="interfaceMain">' +
															'Depends On Task' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsTaskDependsOnValue" class="interfaceMainSelect">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTaskDependsOnValue" class="interfaceMainSelect">' +
															'<input id="inputInterfaceMainProjectTaskDetailsTaskDependsOn" class="inputInterfaceMainSelect"' +
																' onDemandMethod="/ondemand/project/?rf=XML&method=PROJECT_TASK_SEARCH&project=' + ns1blankspace.objectContext + '">' +
															'</td></tr>';
									
										aHTML.push('<tr id="trInterfaceMainProjectTaskDetailsStartBasedOn" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsStartBasedOn" class="interfaceMain">' +
															'Start Date Is Based On' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsStartBasedOnValue" class="interfaceMainRadio">' +
															'<td id="tdInterfaceMainProjectTaskDetailsStartBasedOnValue" class="interfaceMainRadio">' +
															'<input type="radio" id="radioStartBasedOn1" name="radioStartBasedOn" value="1"/>When Dependant Task Completed' +
																'&nbsp;&nbsp;<input type="radio" id="radioStartBasedOn2" name="radioStartBasedOn" value="2"/>Project Start Date<br /><br />';
															'</td></tr>';
									
										aHTML.push('<tr id="trInterfaceMainProjectTaskDetailsStartDays" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsStartDays" class="interfaceMain">' +
															'Days Before Start' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsStartDaysValue" class="interfaceMainText">' +
															'<td id="tdInterfaceMainProjectTaskDetailsStartDaysValue" class="interfaceMainText">' +
															'<input onDemandType="TEXT" id="inputInterfaceMainProjectTaskDetailsStartDays" class="inputInterfaceMainText">' +
															'</td></tr>';				
									
										aHTML.push('<tr id="trInterfaceMainProjectTaskDetailsDurationDays" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsDurationDays" class="interfaceMain">' +
															'Duration (Elapsed Days)' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsDurationDaysValue" class="interfaceMainText">' +
															'<td id="tdInterfaceMainProjectTaskDetailsDurationDaysValue" class="interfaceMainText">' +
															'<input onDemandType="TEXT" id="inputInterfaceMainProjectTaskDetailsDurationDays" class="inputInterfaceMainText">' +
															'</td></tr>';
										
									aHTML.push('<tr id="trInterfaceMainProjectTaskDetailsDisplayOrder" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsDisplayOrder" class="interfaceMain">' +
															'Display Order' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsDisplayOrderValue" class="interfaceMainText">' +
															'<td id="tdInterfaceMainProjectTaskDetailsDisplayOrderValue" class="interfaceMainText">' +
															'<input onDemandType="TEXT" id="inputInterfaceMainProjectTaskDetailsDisplayOrder" class="inputInterfaceMainText">' +
															'</td></tr>';				
										
										aHTML.push('</table>';						
									
										$('#tdInterfaceMainProjectTaskDetailsColumn1').html(aHTML.join(''));
										
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

					save:		{
									send:		function ()
												{
													var sParam = '/ondemand/project/?method=PROJECT_TASK_MANAGE'
													var sData = 'project=' + ns1blankspace.objectContext;
													
													sData += '&title=' + ns1blankspace.util.fs($('#inputInterfaceMainProjectTaskDetailsTitle').val());
													sData += '&type=' + ns1blankspace.util.fs($('#inputInterfaceMainProjectTaskDetailsType').attr('onDemandID'));
													sData += '&taskbyuser=' + ns1blankspace.util.fs($('#inputInterfaceMainProjectTaskDetailsTaskBy').attr('onDemandID'));
													sData += '&taskdependson=' + ns1blankspace.util.fs($('#inputInterfaceMainProjectTaskDetailsTaskDependsOn').attr('onDemandID'));
													sData += '&taskstartbasedon=' + $('input[name="radioStartBasedOn"]:checked').val();
													sData += '&daysbeforestart=' + ns1blankspace.util.fs($('#inputInterfaceMainProjectTaskDetailsStartDays').val());
													sData += '&durationdays=' + ns1blankspace.util.fs($('#inputInterfaceMainProjectTaskDetailsDurationDays').val());
													sData += '&displayorder=' + ns1blankspace.util.fs($('#inputInterfaceMainProjectTaskDetailsDisplayOrder').val());
													sData += '&description=' + ns1blankspace.util.fs($('#inputInterfaceMainProjectTaskDetailsDescription').val());
													
													ns1blankspaceSave(sParam, sData, 'Template Task Added');
													ns1blankspaceMainViewportShow("#divInterfaceMainTasks", true);
													interfaceSetupProjectTasks();	
												}
								},				

					remove:		function (sXHTMLElementId)
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

	save: 		{
					send:		function ()
								{
									var sParam = '/ondemand/project/?method=PROJECT_MANAGE'
									var sData = (ns1blankspace.objectContext == -1)?'':'&id=' + ns1blankspace.objectContext;
										
									if ($('#divInterfaceMainDetails').html() != '')
									{
										sData += '&description=' + ns1blankspace.util.fs($('#inputInterfaceMainDescription').val());
									}
									
									ns1blankspaceSave(sParam, sData, 'Project Template Saved');	
								}
				},				
}
