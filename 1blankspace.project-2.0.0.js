
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
									
						aHTML.push('<table class="ns1blankspace">');
						aHTML.push('<tr class="ns1blankspace">' +
										'<td id="ns1blankspaceMostLikely" class="ins1blankspace">' +
										ns1blankspace.xhtml.loading +
										'</td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspace').html(aHTML.join(''));

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
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
									
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('PROJECT_SEARCH'),
											data: 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
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
											ns1blankspace.container.position({xhtmlElementID: sElementID});
											ns1blankspace.search.start(sElementID);

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
											
											aHTML.push('<td class="ns1blankspaceContactType' + this.type + ' ns1blankspaceSearch">&nbsp;</td>')
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
					
					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainDescription" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainTasks" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainTaskDetails" class="ns1blankspaceControl"></div>');			
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControl"></div>');
							
					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.project.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.project.details();
					});

					$('#ns1blankspaceControlDescription').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDescription'});
						ns1blankspace.project.description();
					});

					$('#ns1blankspaceControlTasks').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTasks'});
						ns1blankspace.project.tasks.show();
					});

					$('#ns1blankspaceControlActions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainActions', refresh: true});
						
						ns1blankspace.actions.show({xhtmlElementID: 'ns1blankspaceMainActions'});
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
					ns1blankspace.project.layout();
					
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
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.project.summary()'});
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
								
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspace">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:100px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));

						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryEmail" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>');

						if (ns1blankspace.objectContextData.startdate != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Start Date</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryStartDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.startdate +
										'</td></tr>');	
						}

						if (ns1blankspace.objectContextData.enddate != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">End Date</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryEndDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.enddate +
										'</td></tr>');
						}											
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
					}	
				},

	details: 	function ns1blankspaceProjectDetails()
				{
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

						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						$('input.ns1blankspaceDate').datepicker({ dateFormat: 'dd M yy' });
						
						var aHTML = [];
							
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Not Started' +
										'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>In Progress' +
										'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>Ongoing' +
										'<br /><input type="radio" id="radioStatus6" name="radioStatus" value="6"/>On Hold' +
										'<br /><input type="radio" id="radioStatus7" name="radioStatus" value="7"/>Cancelled' +
										'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Completed' +
										'</td></tr>');
						
						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
							$('#ns1blankspaceDetailsStartDate').val(ns1blankspace.objectContextData.startdate);
							$('#ns1blankspaceDetailsEndDate').val(ns1blankspace.objectContextData.enddate);
						}
						else
						{
							$('[name="radioStatus"][value="1"]').attr('checked', true);
						}
					}	
				},

	description: 
				function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainDescription').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDescription').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDescriptionColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceDescriptionColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');								
						
						$('#divns1blankspaceMainDescription').html(aHTML.join(''));
						
						var aHTML = [];
					
						aHTML.push('<table id="ns1blankspaceDescriptionColumn1" class="ns1blankspace">');
								
						aHTML.push('<tr class="ns1blankspaceTextMulti">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea id="ns1blankspaceDescription" rows="30" cols="50" class="ns1blankspaceTextMulti ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDescriptionColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDescription').val(unescape(ns1blankspace.objectContextData.description));
						}
					}	
				},

	tasks: 		{
					show: 		function (oParam, oResponse)
								{
									
									var sXHTMLElementId = 'ns1blankspaceMainTasks';
									var sLabel = "Tasks";
									var iOption = 1;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
									}

									if (oResponse == undefined)
									{									
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('PROJECT_TASK_SEARCH'),
											data: 'rows=100&project=' + ns1blankspace.objectContext,
											data: sParam,
											dataType: 'json',
											success: function(data){ns1blankspace.project.tasks.show(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceTasksColumn1" class="ns1blankspaceColumn1"></td>' +
														'<td id="ns1blankspaceTasksColumn2" class="ns1blankspaceColumn2"></td>' +
														'</tr>' + 
														'</table>');	
	
										$('#ns1blankspaceMainTasks').html(aHTML.join(''));
										
										var aHTML = [];
									
										aHTML.push('<table id="ns1blankspaceTasksColumn2" class="ns1blankspaceColumn2">');
										
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceTasksAdd">Add</span>' +
														'</td></tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceTasksColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceTasksAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											ns1blankspace.project.tasks.edit();
										})
										
										var aHTML = [];
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">No tasks.</td></tr></table>');

											$('#ns1blankspaceTasksColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceProjectTasks" class="ns1blankspace">');
										
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
					
												aHTML.push('<td id="ns1blankspaceSetupProjectTasks_title-' + this.id + '" class="ns1blankspaceRow" style="width: 420px;">' +
																		this.title + '</td>');
														
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceSetupProjectTasks_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
												};	
													
												if (oOptions.view)
												{	
													aHTML.push('<span id="ns1blankspaceSetupProjectTasks_view-' + this.id + '" class="ns1blankspaceRowView"></span>');
												};	
																		
												aHTML.push('</td>');
												
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceTasksColumn1').html(aHTML.join(''));
											
											$('#ns1blankspaceProjectTasks > .ns1blankspaceRowRemove').button({
												text: false,
												 icons: {
													 primary: "ui-icon-close"
												}
											})
											.click(function() {
												ns1blankspace.project.tasks.remove(this.id)
											})
											.css('width', '15px')
											.css('height', '20px')
											
											$('#ns1blankspaceProjectTasks > .ns1blankspaceRowSelect').button({
												text: false,
												 icons: {
													 primary: "ui-icon-play"
												}
											})
											.click(function() {
												ns1blankspace.project.task.init({showHome: false});
												ns1blankspace.project.task.search.show(this.id);
											})
											.css('width', '15px')
											.css('height', '20px');
										}
									}	
								},

					edit:		function (oParam, oResponse)
								{
									var sXHTMLElementID = "ns1blankspaceMainTaskDetails";
									var sXHTMLElementContextId;
									var lProjectTask;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementId = oParam.xhtmlElementID}
										if (oParam.xhtmlElementContextID != undefined) {sXHTMLElementContextId = oParam.xhtmlElementContextID}
										if (oParam.projectTask != undefined) {lProjectTask = oParam.projectTask}
									}

									if (sXHTMLElementContextID != undefined)
									{
										var aSearch = sXHTMLElementContextID.split('-');
										var sElementID = aSearch[0];
										var lProjectTask = aSearch[1];
									}	
										
									ns1blankspace.show({selector: '#divns1blankspaceMainTaskDetails'});	
										
									var aHTML = [];
									
									aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceTaskDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
														'<td id="ns1blankspaceTaskDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
														'</tr>' + 
														'</table>');			
										
									$('#' + sXHTMLElementID).html(aHTML.join(''));
											
									if (oResponse == undefined && lProjectTask != undefined)
									{
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('PROJECT_TASK_SEARCH'),
											data: 'id=' + ns1blankspace.util.fs(lProjectTask),
											dataType: 'json',
											success: function(data){ns1blankspace.project.task.edit(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspace">');
										
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceTaskDetailsSave">Save</span>' +
														'</td></tr>');
																
										aHTML.push('</table>');					
										
										$('#ns1blankspaceTaskDetailsColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceTaskDetailsSave').button(
										{
											label: "Save"
										})
										.click(function() {
											ns1blankspace.project.tasks.edit(oParam);
										})
										
										var aHTML = [];

										aHTML.push('<table class="ns1blankspace">');		

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Title' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceTaskDetailsTitle" class="ns1blankspaceText">' +
														'</td></tr>');					
											
										aHTML.push('<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<textarea id="ns1blankspaceTaskDetailsDescription" class="ns1blankspaceTextMulti" rows="10" cols="50" style="width:100%;"></textarea>' +
														'</td></tr>');
									
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Type' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceSelect">' +
														'<input id="ns1blankspaceTaskDetailsType" class="ns1blankspaceSelect"' +
																' data-method="SETUP_PROJECT_TASK_TYPE_SEARCH">' +
														'</td></tr>');	

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Task By' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceSelect">' +
														'<input id="ns1blankspaceTaskDetailsTaskBy" class="ns1blankspaceSelect"' +
																' data-method="SETUP_USER_SEARCH">' +
														'</td></tr>');	
									
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Start Date' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceTaskDetailsStartDate" class="ns1blankspaceDate">' +
														'</td></tr>');		
											
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'End Date' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceTaskDetailsEndDate" class="ns1blankspaceDate">' +
														'</td></tr>');		
								
										aHTML.push('</table>');						
									
										$('#ns1blankspaceTaskDetailsColumn1').html(aHTML.join(''));
										
										$('input.ns1blankspaceDate').datepicker({ dateFormat: 'dd M yy' });
										
										if (oResponse != undefined)
										{	
											if (oResponse.data.rows.length == 0)
											{	
												$('#ns1blankspaceTaskDetailsReference').val(oResponse.data.rows[0].reference);
												$('#ns1blankspaceTaskDetailsTitle').val(oResponse.data.rows[0].title);		
											}
										}	
									}	
								},

					save:		function ()
								{
									var sData = 'project=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
									
									sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceTaskDetailsTitle').val());
									sData += '&type=' + ns1blankspace.util.fs($('#ns1blankspaceTaskDetailsType').attr('data-id'));
									sData += '&taskbyuser=' + ns1blankspace.util.fs($('#ns1blankspaceTaskDetailsTaskBy').attr('data-id'));
									sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceTaskDetailsDescription').val());
									sData += '&startdate=' + ns1blankspace.util.fs($('#ns1blankspaceTaskDetailsStartDate').val());
									sData += '&enddate=' + ns1blankspace.util.fs($('#ns1blankspaceTaskDetailsEndDate').val());
										
									$.ajax(
									{
										type: 'GET',
										url: ns1blankspace.util.endpointURI('PROJECT_TASK_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data){
											ns1blankspace.show({selector: 'ns1blankspaceTasks', refresh: true});
											ns1blankspace.project.tasks.show();
										}
									});
								},

					remove:		function (sXHTMLElementID)
								{
									var aXHTMLElementID = sXHTMLElementID.split('-');
												
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('PROJECT_TASK_MANAGE'),
										data: 'remove=1&id=' + ns1blankspace.util.fs(aXHTMLElementID[1]),
										dataType: 'json',
										success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
									});
								}	
				},

	new: 		function ()
				{
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.project.layout();
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					$('#ns1blankspaceViewportControlAction').button({disabled: false});
					$('#ns1blankspaceViewportControlActionOptions').button({disabled: true});
					ns1blankspace.project.details();
				},

	save: 		{
					send:		function ()
								{
									var sData = 'id=' + ((ns1blankspace.objectContext == -1)?'':ns1blankspace.objectContext);
										
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#inputns1blankspaceDetailsReference').val());
										sData += '&startdate=' + ns1blankspace.util.fs($('#inputns1blankspaceDetailsStartDate').val());
										sData += '&enddate=' + ns1blankspace.util.fs($('#inputns1blankspaceDetailsEndDate').val());
										sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
									}
									
									if ($('#ns1blankspaceMainDescription').html() != '')
									{
										sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceDescription').val());
									}
										
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspaceEndpointURL('PROJECT_MANAGE'),
										data: sData,
										dataType: 'json',
										success: ns1blankspace.project.save.process
									});
								},

					process:	function (oResponse)
								{
									
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Project saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}
				}				
}
