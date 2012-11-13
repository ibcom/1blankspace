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
									
						aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ins1blankspaceMain">' +
										ns1blankspace.xhtml.loading + '</td></tr></table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						var aHTML = [];
									
						aHTML.push('<table><tr><td id="ns1blankspaceViewProjectLarge"' +
										' class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>' +
										'</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.fs('PROJECT_SEARCH'),
							data: 'template=1',
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
							aHTML.push('<table><tr><td class="ns1blankspaceCaption">MOST LIKELY</td></tr>');

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
					send: 		function (sXHTMLElementID, oParam)
								{						
									var aSearch = sXHTMLElementID.split('-');
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
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('PROJECT_SEARCH'),
											data: 'id=' + ns1blankspace.objectContext & '&template=1',
											dataType: 'json',
											success: function(data) {ns1blankspace.setup.project.search.process(oParam, data)}
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
											sSearchText = aSearch[1];
											sElementId = 'ns1blankspaceViewControlBrowse';
											sQuickSearchType = 'start';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.containter.position(sElementId);
											
											var sData = 'quicksearch' + sQuickSearchType + '=' + sSearchText;
											sData += '&template=1';

											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('PROJECT_SEARCH'),
												data: sData,
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.project.search.process(oParam, data)}
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
									}
									else
									{
										aHTML.push('<table class="ns1blankspaceSearchMedium">');
											
										$.each(oResponse.data.rows, function()
										{
											aHTML.push('<tr class="ns1blankspaceSearch">');
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'-' + this.id + '">' +
															this.reference +
															'</td>');
											
											aHTML.push('</tr>');
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.setup.project.search.send(event.target.id, {source: 1});
										});
									}			
								}
				},				

	layout:		function ()
				{
					var aHTML = [];

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
					
						aHTML.push('<tr><td id="ns1blankspaceControlTasks" class="ns1blankspaceControl">' +
										'Tasks</td></tr>');

						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');
									
						aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');		
					}
					
					aHTML.push('</table>');	

					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDescription" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTasks" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
	
					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.setup.project.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.setup.project.details();
					});

					$('#ns1blankspaceControlDescription').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDescription'});
						ns1blankspace.setup.project.description();
					});
					
					$('#ns1blankspaceControlTasks').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTasks'});
						ns1blankspace.setup.project.tasks();
					});
					
					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
					});			
				},

	show:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.setup.project.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this project template.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];

						var sContext = ns1blankspace.objectContextData.reference;
						sContext += '<br /><span id="ns1blankspaceSubContext">(Template)</span>';
							
						$('#ns1blankspaceControlContext').html(sContext);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.project.init({showHome: false});ns1blankspace.setup.project.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.setup.project.summary()'});
					}	
				},

	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this project template.</td></tr></table>');
								
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
					
						aHTML.push('<table class="ns1blankspaceColumn1">');
							
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>');
						
						aHTML.push('</table>';					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
					}	
				},

	descriptions:
				function ()
				{
					
					var aHTML = [];
					var h = -1;
					
					if ($('#ns1blankspaceMainDescription').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDescription').attr('data-loading', '');
								
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceDescriptionColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
									'<td id="ns1blankspaceDescriptionColumn2" class="ns1blankspaceColumn2" style="width:100px;"></td>' +
									'</tr></table>');
			
						$('#ns1blankspaceMainDescription').html(aHTML.join(''));
						
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspace">');
								
						aHTML.push('<tr class="ns1blankspaceTextMulti">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="30" cols="50" id="ns1blankspaceDescription' +
													ns1blankspace.counter.editor + '" editorcount="' + ns1blankspace.counter.editor + '" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');
										
						aHTML.push('</table>');	
	
						$('#ns1blankspaceDescriptionColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceMainDescription').val(ns1blankspace.objectContextData.description);
						}
					}	
				},

	tasks:		{
					show: 		function (oParam, oResponse)
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
										var sParam = 'method=PROJECT_TASK_SEARCH&rows=' + ns1blankspace.option.defaultRows +
														'&project=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/project/?',
											data: sParam,
											dataType: 'json',
											success: function(data){ns1blankspaceSetupProjectTasks(oParam, data)}
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
																
										aHTML.push('<tr><td id="tdns1blankspaceMainTasksAdd" class="ns1blankspaceMain">' +
														'&nbsp;' +
														'</td></tr>';
																
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainTasksColumn2').html(aHTML.join(''));
										
										$('#spanns1blankspaceMainTasksAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											ns1blankspaceSetupProjectTaskDetailsAdd();
										})
										
										var aHTML = [];
										var h = -1;
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="tableSetupProjectTasks" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceMainCaption">' +
															'<td class="ns1blankspaceMainRowNothing">No tasks.</td></tr>';
											aHTML.push('</table>';

											$('#tdns1blankspaceMainTasksColumn1').html(aHTML.join(''));
											
										}
										else
										{
											aHTML.push('<table id="tableSetupProjectTasks" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceMainCaption">';
											aHTML.push('<td class="ns1blankspaceMainCaption">Title</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption">&nbsp;</td>';
											aHTML.push('</tr>';
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspaceSetupProjectTasksRow(this)
											});
											
											aHTML.push('</table>';

											ns1blankspacePaginationList(
											{
												xhtmlElementID: 'tdns1blankspaceMainTasksColumn1',
												xhtmlContext: 'SetupProjectTasks',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspaceSetupProjectTasksRow,
												functionNewPage: 'ns1blankspaceSetupProjectTasksBind()',
												type: 'json'
											}); 	

											$('#tdns1blankspaceMainTasksColumn1').html(aHTML.join(''));
											
											ns1blankspaceSetupProjectTasksBind();
										}
									}	
								},

					row:		function ns1blankspaceSetupProjectTasksRow(oRow)
								{
									var aHTML = [];
									var h = -1;
									
									aHTML.push('<tr class="ns1blankspaceMainRow">';
												
									aHTML.push('<td id="tdSetupProjectTasks_title-' + oRow.id + '" class="ns1blankspaceMainRow">' +
															oRow.title + '</td>';
															
									aHTML.push('<td class="ns1blankspaceMainRow" style="width: 40px;text-align:right;"><span id="tdSetupProjectTasks_delete-' +
														oRow.id + '" class="ns1blankspaceMainRowOptionsDelete">&nbsp;</span>';
									aHTML.push('<span id="tdSetupProjectTasks_select-' + oRow.id + '" class="ns1blankspaceMainRowOptionsSelect">&nbsp;</span></td>';
									
									aHTML.push('</tr>'
									
									return aHTML.join('');
								},

					bind:		function ns1blankspaceSetupProjectTasksBind()
								{
									$('.ns1blankspaceMainRowOptionsDelete').button({
												text: false,
												 icons: {
													 primary: "ui-icon-close"
												}
											})
											.click(function() {
												ns1blankspaceSetupProjectTasksRemove(this.id)
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
										ns1blankspaceSetupProjectTaskMasterViewport({showHome: false});
										ns1blankspaceSetupProjectTaskSearch(this.id);
									})
									.css('width', '15px')
									.css('height', '20px')
								},

					add:		function ns1blankspaceSetupProjectTaskDetailsAdd(oParam, oResponse)
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
											url: '/ondemand/project/?',
											data: sParam,
											dataType: 'json',
											success: function(data){ns1blankspaceSetupProjectTaskDetailsAdd(oParam, data)}
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
											ns1blankspaceSetupProjectTaskAddSave(oParam);
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
															'<textarea rows="10" cols="50" style="width:100%;" onDemandType="TEXTMULTI" id="inputns1blankspaceMainProjectTaskDetailsDescription" class="inputns1blankspaceMainTextMulti"></textarea>' +
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
									
										aHTML.push('<tr id="trns1blankspaceMainProjectTaskDetailsTaskDependsOn" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsTaskDependsOn" class="ns1blankspaceMain">' +
															'Depends On Task' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainProjectTaskDetailsTaskDependsOnValue" class="ns1blankspaceMainSelect">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsTaskDependsOnValue" class="ns1blankspaceMainSelect">' +
															'<input id="inputns1blankspaceMainProjectTaskDetailsTaskDependsOn" class="inputns1blankspaceMainSelect"' +
																' onDemandMethod="/ondemand/project/?rf=XML&method=PROJECT_TASK_SEARCH&project=' + ns1blankspace.objectContext + '">' +
															'</td></tr>';
									
										aHTML.push('<tr id="trns1blankspaceMainProjectTaskDetailsStartBasedOn" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsStartBasedOn" class="ns1blankspaceMain">' +
															'Start Date Is Based On' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainProjectTaskDetailsStartBasedOnValue" class="ns1blankspaceMainRadio">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsStartBasedOnValue" class="ns1blankspaceMainRadio">' +
															'<input type="radio" id="radioStartBasedOn1" name="radioStartBasedOn" value="1"/>When Dependant Task Completed' +
																'&nbsp;&nbsp;<input type="radio" id="radioStartBasedOn2" name="radioStartBasedOn" value="2"/>Project Start Date<br /><br />';
															'</td></tr>';
									
										aHTML.push('<tr id="trns1blankspaceMainProjectTaskDetailsStartDays" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsStartDays" class="ns1blankspaceMain">' +
															'Days Before Start' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainProjectTaskDetailsStartDaysValue" class="ns1blankspaceMainText">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsStartDaysValue" class="ns1blankspaceMainText">' +
															'<input onDemandType="TEXT" id="inputns1blankspaceMainProjectTaskDetailsStartDays" class="inputns1blankspaceMainText">' +
															'</td></tr>';				
									
										aHTML.push('<tr id="trns1blankspaceMainProjectTaskDetailsDurationDays" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsDurationDays" class="ns1blankspaceMain">' +
															'Duration (Elapsed Days)' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainProjectTaskDetailsDurationDaysValue" class="ns1blankspaceMainText">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsDurationDaysValue" class="ns1blankspaceMainText">' +
															'<input onDemandType="TEXT" id="inputns1blankspaceMainProjectTaskDetailsDurationDays" class="inputns1blankspaceMainText">' +
															'</td></tr>';
										
									aHTML.push('<tr id="trns1blankspaceMainProjectTaskDetailsDisplayOrder" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsDisplayOrder" class="ns1blankspaceMain">' +
															'Display Order' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainProjectTaskDetailsDisplayOrderValue" class="ns1blankspaceMainText">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsDisplayOrderValue" class="ns1blankspaceMainText">' +
															'<input onDemandType="TEXT" id="inputns1blankspaceMainProjectTaskDetailsDisplayOrder" class="inputns1blankspaceMainText">' +
															'</td></tr>';				
										
										aHTML.push('</table>';						
									
										$('#tdns1blankspaceMainProjectTaskDetailsColumn1').html(aHTML.join(''));
										
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

					save:		{
									send:		function ()
												{
													var sParam = '/ondemand/project/?method=PROJECT_TASK_MANAGE'
													var sData = 'project=' + ns1blankspace.objectContext;
													
													sData += '&title=' + ns1blankspace.util.fs($('#inputns1blankspaceMainProjectTaskDetailsTitle').val());
													sData += '&type=' + ns1blankspace.util.fs($('#inputns1blankspaceMainProjectTaskDetailsType').attr('onDemandID'));
													sData += '&taskbyuser=' + ns1blankspace.util.fs($('#inputns1blankspaceMainProjectTaskDetailsTaskBy').attr('onDemandID'));
													sData += '&taskdependson=' + ns1blankspace.util.fs($('#inputns1blankspaceMainProjectTaskDetailsTaskDependsOn').attr('onDemandID'));
													sData += '&taskstartbasedon=' + $('input[name="radioStartBasedOn"]:checked').val();
													sData += '&daysbeforestart=' + ns1blankspace.util.fs($('#inputns1blankspaceMainProjectTaskDetailsStartDays').val());
													sData += '&durationdays=' + ns1blankspace.util.fs($('#inputns1blankspaceMainProjectTaskDetailsDurationDays').val());
													sData += '&displayorder=' + ns1blankspace.util.fs($('#inputns1blankspaceMainProjectTaskDetailsDisplayOrder').val());
													sData += '&description=' + ns1blankspace.util.fs($('#inputns1blankspaceMainProjectTaskDetailsDescription').val());
													
													ns1blankspaceSave(sParam, sData, 'Template Task Added');
													ns1blankspaceMainViewportShow("#divns1blankspaceMainTasks", true);
													ns1blankspaceSetupProjectTasks();	
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
										
									if ($('#divns1blankspaceMainDetails').html() != '')
									{
										sData += '&description=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDescription').val());
									}
									
									ns1blankspaceSave(sParam, sData, 'Project Template Saved');	
								}
				},				
}
