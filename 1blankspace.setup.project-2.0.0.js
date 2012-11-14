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
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');
					
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

					$('#ns1blankspaceControlDetails').click(function(event)
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
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this project template.</td></tr></table>');
								
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

	description:
				function ()
				{	
					var aHTML = [];
					
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
											ns1blankspace.counter.editor + '" data-editorcount="' + ns1blankspace.counter.editor + '" class="ns1blankspaceTextMulti"></textarea>' +
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
									var sXHTMLElementID = 'ns1blankspaceMainTasks';
									var sLabel = "Tasks";
									var iOption = 1;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}

									if (oResponse == undefined)
									{
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('PROJECT_TASK_SEARCH'),
											data: 'project=' + ns1blankspace.objectContext,
											dataType: 'json',
											success: function(data){ns1blankspace.setup.project.tasks(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceMain">' +
											'<tr class="ns1blankspaceRow">' +
											'<td id="ns1blankspaceTasksColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
											'<td id="ns1blankspaceTasksColumn2" class="ns1blankspaceColumn2" style="width:100px;"></td>' +
											'</tr></table>');		
										
										$('#ns1blankspaceMainTasks').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
										
										aHTML.push('<tr><td>' +
														'<span id=ns1blankspaceTasksAdd" class="ns1blankspaceAction">Add</span>' +
														'</td></tr>');
																																
										aHTML.push('</table>');					
										
										$('#ns1blankspaceTasksColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceTasksAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											ns1blankspace.setup.project.tasks.add();
										})
										
										var aHTML = [];
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table class="ns1blankspace">' +
															'<tr><td class="ns1blankspaceNothing">No tasks.</td></tr>' +
															'</table>');

											$('#ns1blankspaceTasksColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceSetupProjectTasks" class="ns1blankspaceContainer">');
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceCaption">Title</td>');
											aHTML.push('<td class="ns1blankspaceCaption">&nbsp;</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.setup.project.tasks.row(this)
											});
											
											aHTML.push('</table>');

											ns1blankspace.render.page(
											{
												xhtmlElementID: 'ns1blankspaceTasksColumn1',
												xhtmlContext: 'SetupProjectTasks',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspace.setup.project.tasks.row,
												functionNewPage: 'ns1blankspace.setup.project.tasks.bind()',
												type: 'json'
											}); 	

											$('#ns1blankspaceTasksColumn1').html(aHTML.join(''));
											
											ns1blankspace.setup.project.tasks.bind();
										}
									}	
								},

					row:		function (oRow)
								{
									var aHTML = [];
									
									aHTML.push('<tr class="ns1blankspaceRow">');
												
									aHTML.push('<td id="ns1blankspaceSetupProjectTasks_title-' + oRow.id + '" class="ns1blankspaceMainRow">' +
															oRow.title + '</td>';
															
									aHTML.push('<td class="ns1blankspaceRow" style="width: 60px;text-align:right;">' +
													'<span id="ns1blankspaceSetupProjectTasks_remove-' +
														oRow.id + '" class="ns1blankspaceRowRemove">&nbsp;</span>';

									aHTML.push('<span id="ns1blankspaceSetupProjectTasks_select-' + oRow.id + '" class="ns1blankspaceRowSelect">&nbsp;</span></td>';
									
									aHTML.push('</tr>');
									
									return aHTML.join('');
								},

					bind:		function ()
								{
									$('ns1blankspaceSetupProjectTasks span.ns1blankspaceRowRemove').button({
												text: false,
												 icons: {
													 primary: "ui-icon-close"
												}
											})
											.click(function() {
												ns1blankspace.setup.project.tasks.remove(this.id)
											})
											.css('width', '15px')
											.css('height', '20px');
											
									$('ns1blankspaceSetupProjectTasks span.ns1blankspaceRowSelect').button({
										text: false,
										 icons: {
											 primary: "ui-icon-play"
										}
									})
									.click(function() {
										ns1blankspaces.setup.projectTask.init({showHome: false});
										ns1blankspaces.setup.projectTask.search.send(this.id);
									})
									.css('width', '15px')
									.css('height', '20px');
								},

					add:		function (oParam, oResponse)
								{
									var sXHTMLElementID = "ns1blankspaceTasksColumn1";
									var sXHTMLElementContextID;
									var lProjectTask;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.xhtmlElementContextID != undefined) {sXHTMLElementContextID = oParam.xhtmlElementContextID}
										if (oParam.projectTask != undefined) {lProjectTask = oParam.projectTask}
									}

									if (sXHTMLElementContextID != undefined)
									{
										var aSearch = sXHTMLElementContextID.split('-');
										var lProjectTask = aSearch[1];
									}	
										
									var aHTML = [];
													
									if (oResponse == undefined && lProjectTask != undefined)
									{
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('PROJECT_TASK_SEARCH'),
											data: 'id=' + lProjectTask,
											dataType: 'json',
											success: function(data){ns1blankspace.setup.projectTask.add(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
									
										aHTML.push('<table class="ns1blankspaceColumn2">';
										
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceTaskSave" class="ns1blankspaceAction">Save</span>' +
														'</td></tr>');
																
										aHTML.push('</table>');					
										
										$('#ns1blankspaceTasksColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceTaskSave').button(
										{
											label: "Save"
										})
										.click(function() {
											ns1blankspace.setup.projectTask.save.send(oParam);
										})
										
										var aHTML = [];
											
										aHTML.push('<table class="ns1blankspaceMain">';					
												
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Title' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceTaskTitle" class="ns1blankspaceText">' +
														'</td></tr>');			

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Description' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<textarea id="ns1blankspaceTaskDescription" class="ns1blankspaceMainTextMulti" rows="10" cols="50" style="width:100%;"></textarea>' +
														'</td></tr>');		
									
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Type' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceTaskType" class="ns1blankspaceSelect"' +
															' data-method="SETUP_PROJECT_TASK_TYPE_SEARCH">' +
														'</td></tr>');		
									
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Task By' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceTaskTaskBy" class="ns1blankspaceSelect"' +
															' data-method="SETUP_USER_SEARCH" data-columns="username">' +
														'</td></tr>');	
									
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Depends On Task' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceTaskDependsOn" class="ns1blankspaceSelect"' +
															' data-method="PROJECT_TASK_SEARCH&project=' + ns1blankspace.objectContext + '" data-columns="username">' +
														'</td></tr>');	
								
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Start Date Is Based On' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioStartBasedOn1" name="radioStartBasedOn" value="1"/>When Dependant Task Completed' +
																'<br /><input type="radio" id="radioStartBasedOn2" name="radioStartBasedOn" value="2"/>Project Start Date' +
														'</td></tr>');	
										
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Days Before Start' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceTaskStartDays" class="ns1blankspaceText">' +
														'</td></tr>');	
									
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Duration (Elapsed Days)' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceTaskDurationDays" class="ns1blankspaceText">' +
														'</td></tr>');	
												
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Display Order' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceTaskDisplayOrder" class="ns1blankspaceText">' +
														'</td></tr>');	
												
										aHTML.push('</table>');						
									
										$('#ns1blankspaceTaskColumn1').html(aHTML.join(''));
										
										if (oResponse != undefined)
										{
											if (oResponse.data.rows.length == 0)
											{
												$('#ns1blankspaceMainProjectTaskTitle').val(oResponse.data.rows[0].title);		
											}
										}	
									}	
								},	

					save:		{
									send:		function ()
												{
													var sData = 'project=' + ns1blankspace.objectContext;
													
													sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceTaskTitle').val());
													sData += '&type=' + ns1blankspace.util.fs($('#ns1blankspaceTaskType').attr('data-id'));
													sData += '&taskbyuser=' + ns1blankspace.util.fs($('#ins1blankspaceTaskTaskBy').attr('data-id'));
													sData += '&taskdependson=' + ns1blankspace.util.fs($('#ns1blankspaceTaskTaskDependsOn').attr('data-id'));
													sData += '&taskstartbasedon=' + $('input[name="radioStartBasedOn"]:checked').val();
													sData += '&daysbeforestart=' + ns1blankspace.util.fs($('#ns1blankspaceTaskStartDays').val());
													sData += '&durationdays=' + ns1blankspace.util.fs($('#ns1blankspaceTaskDurationDays').val());
													sData += '&displayorder=' + ns1blankspace.util.fs($('#ns1blankspaceTaskDisplayOrder').val());
													sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceTaskDescription').val());
													
													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('PROJECT_TASK_MANAGE'),
														data: sData,
														dataType: 'json',
														success: function ()
														[

														]
													});

													ns1blankspace.setup.project.tasks();	
												}
								},				

					remove:		function (sXHTMLElementID)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sSearchContext = aSearch[1];
												
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('PROJECT_TASK_MANAGE'),
										data: 'remove=1&id=' + sSearchContext,
										dataType: 'json',
										success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
									});		
								}
				},				

	save: 		{
					send:		function ()
								{
									var sData = 'id=' + ns1blankspace.objectContext;
										
									if ($('#ns1blankspaceMainDescription').html() != '')
									{
										sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceDescription').val());
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('PROJECT_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data){ns1blankspace.status.message('Saved')}
									});	
								}
				},				
}
