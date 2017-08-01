/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

ns1blankspace.project = 
{
	init: 		function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 1;
					ns1blankspace.objectName = 'project';
					ns1blankspace.viewName = 'Projects';
					
					ns1blankspace.app.set(oParam);
				},

	home: 		function (oParam, oResponse)
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
						
						$('#ns1blankspaceMain').html(aHTML.join(''));

						var aHTML = [];
									
						aHTML.push('<table>');

						aHTML.push('<tr><td><div id="ns1blankspaceViewProjectLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
									
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	

						var oSearch = new AdvancedSearch();
						oSearch.method = 'PROJECT_SEARCH';
						oSearch.addField('reference,description,contactbusinesstext,contactpersontext,startdate');
						oSearch.rf = 'json';
						oSearch.rows = ns1blankspace.option.defaultRows;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(function (data) {ns1blankspace.project.home(oParam, data)});		
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
														'" class="ns1blankspaceMostLikely" style="width:90px;padding-right:15px;">' +
														this.reference +
														'</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_startdate-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:70px;padding-right:15px;">' +
														ns1blankspace.util.fd(this.startdate) + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_description-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
														this.description + '</td>');
								
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
					send:		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
									var sSearchContext = aSearch[1];
									var iMinimumLength = 0;
									var iSource = ns1blankspace.data.searchSource.text;
									var sSearchText;
									var iMaximumColumns = 1;
									
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
										oSearch.method = 'PROJECT_SEARCH';
										
										oSearch.addField('amount,contactbusiness,contactbusinesstext,description,enddate,id,notes,' +
															'paymentfrequency,paymentfrequencytext,percentagecomplete,contactperson,contactpersontext,' +
															'projectmanager,projectmanagertext,reference,startdate,' +
															'status,statustext,template,totaltime,type,typetext,modifieddate');

										oSearch.addField(ns1blankspace.option.auditFields);

										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										oSearch.getResults(function(data){ns1blankspace.project.show(oParam, data)});	
									}
									else
									{									
										if (iSource == undefined)
										{
											iSource = ns1blankspace.data.searchSource.text;
										}	
										
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
											ns1blankspace.search.start();

											var oSearch = new AdvancedSearch();
											oSearch.method = 'PROJECT_SEARCH';
											oSearch.addField('reference,description,contactpersontext,contactbusinesstext,startdate');
											oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);

											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.sort('reference', 'ASC');
											oSearch.rows = ns1blankspace.option.defaultRowsSmall;

											oSearch.getResults(function(data) {ns1blankspace.project.search.process(oParam, data)});
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var iMaximumColumns = 1;
											
									ns1blankspace.search.stop();
											
									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
									}
									else
									{
										aHTML.push('<table class="ns1blankspaceSearchMedium" style="width:520px;">');
											
										$.each(oResponse.data.rows, function()
										{
											aHTML.push(ns1blankspace.project.search.row(oParam, this));
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.searchContainer).html(
											ns1blankspace.render.init(
											{
												html: aHTML.join(''),
												more: (oResponse.morerows == "true"),
												header: false,
												width: 520
											}) 
										);		
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
											$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.project.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'reference',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.project.search.send,
											row: ns1blankspace.project.search.row,
											width: 520
										});   
									}	
											
								},

					row: 		function (oParam, oRow)
								{
									var aHTML = [];
									var sContact;
												
									aHTML.push('<tr class="ns1blankspaceSearch">');
								
									aHTML.push('<td class="ns1blankspaceSearch" id="' +
													'search-' + oRow.id + '">' +
													oRow.reference +
													'</td>');

									aHTML.push('<td class="ns1blankspaceSearch" id="' +
													'searchContact-' + oRow.id + '">' +
													ns1blankspace.util.fd(oRow.startdate) +
													'</td>');

									if (oRow.contactbusinesstext != '')
									{
										sContact = oRow.contactbusinesstext;
									}
									else
									{
										sContact = oRow.contactpersontext;
									}	
									
									aHTML.push('<td class="ns1blankspaceSearch ns1blankspaceSearchSub" id="' +
													'searchContact-' + oRow.id + '">' +
													sContact +
													'</td>');	

									aHTML.push('<td class="ns1blankspaceSearch ns1blankspaceSearchSub" id="' +
													'searchContact-' + oRow.id + '">' +
													oRow.description +
													'</td>');

									aHTML.push('</tr>');
									
									return aHTML.join('')
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

						aHTML.push('</table>');		
					
						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlDescription" class="ns1blankspaceControl">' +
										'Description</td></tr>');

						aHTML.push('</table>');		
					
						aHTML.push('<table class="ns1blankspaceControl">');
					
						aHTML.push('<tr><td id="ns1blankspaceControlActions" class="ns1blankspaceControl">' +
										'Actions</td></tr>');
									
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
					aHTML.push('<div id="ns1blankspaceMainTaskDetails" class="ns1blankspaceControlMain"></div>');			
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
							
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

	show: 		function (oParam, oResponse)
				{
					ns1blankspace.app.clean();
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
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.project.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.project.summary()'});
					}	
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
						
						if (ns1blankspace.objectContextData.description != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>');
						}	

						if (ns1blankspace.objectContextData.startdate != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Start Date</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryStartDate" class="ns1blankspaceSummary">' +
										ns1blankspace.util.fd(ns1blankspace.objectContextData.startdate) +
										'</td></tr>');	
						}

						if (ns1blankspace.objectContextData.enddate != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">End Date</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryEndDate" class="ns1blankspaceSummary">' +
										ns1blankspace.util.fd(ns1blankspace.objectContextData.enddate) +
										'</td></tr>');
						}											
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Last Updated</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryLastUpdated" class="ns1blankspaceSummary">' +
										Date.parse(ns1blankspace.objectContextData.modifieddate).toString("dd MMM yyyy") +
										'</td></tr>');	

						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
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

						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						$('input.ns1blankspaceDate').datepicker({ dateFormat: 'dd M yy' });
						
						var aHTML = [];
							
						aHTML.push('<table class="ns1blankspaceColumn2">');
						
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
							$('#ns1blankspaceDetailsStartDate').val(ns1blankspace.util.fd(ns1blankspace.objectContextData.startdate));
							$('#ns1blankspaceDetailsEndDate').val(ns1blankspace.util.fd(ns1blankspace.objectContextData.enddate));
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
						
						$('#ns1blankspaceMainDescription').html(aHTML.join(''));
						
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
										var oSearch = new AdvancedSearch();
										oSearch.method = 'PROJECT_TASK_SEARCH';
										oSearch.addField('reference,title');
										oSearch.rf = 'json';
										oSearch.addFilter('project', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.rows = 100;	
										oSearch.getResults(function(data) {ns1blankspace.project.tasks.show(oParam, data)});
									}
									else
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceTasksColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
														'<td id="ns1blankspaceTasksColumn2" class="ns1blankspaceColumn2" style="width:100px;"></td>' +
														'</tr>' + 
														'</table>');	
	
										$('#ns1blankspaceMainTasks').html(aHTML.join(''));
										
										var aHTML = [];
									
										aHTML.push('<table id="ns1blankspaceTasksColumn2" class="ns1blankspaceColumn2">');
										
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceTasksAdd" class="ns1blankspaceAction">Add</span>' +
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
													
												aHTML.push('<span id="ns1blankspaceSetupProjectTasks_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
											
												aHTML.push('<span id="ns1blankspaceSetupProjectTasks_view-' + this.id + '" class="ns1blankspaceRowView"></span>');
																		
												aHTML.push('</td>');
												
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceTasksColumn1').html(aHTML.join(''));
											
											$('#ns1blankspaceProjectTasks span.ns1blankspaceRowRemove').button({
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
											
											$('#ns1blankspaceProjectTasks span.ns1blankspaceRowView').button({
												text: false,
												 icons: {
													 primary: "ui-icon-play"
												}
											})
											.click(function() {
												ns1blankspace.projectTask.init({showHome: false});
												ns1blankspace.projectTask.search.send(this.id);
											})
											.css('width', '15px')
											.css('height', '20px');
										}
									}	
								},

					edit:		function (oParam, oResponse)
								{
									var sXHTMLElementID = "ns1blankspaceMainTasks";
									var sXHTMLElementContextID;
									var lProjectTask;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementId = oParam.xhtmlElementID}
										if (oParam.xhtmlElementContextID != undefined) {sXHTMLElementContextID = oParam.xhtmlElementContextID}
										if (oParam.projectTask != undefined) {lProjectTask = oParam.projectTask}
									}

									if (sXHTMLElementContextID != undefined)
									{
										var aSearch = sXHTMLElementContextID.split('-');
										var sElementID = aSearch[0];
										var lProjectTask = aSearch[1];
									}	
										
									//ns1blankspace.show({selector: '#ns1blankspaceMainTaskDetails'});	
										
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
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
										
										aHTML.push('<tr><td>' +
														'<span class="ns1blankspaceAction" id="ns1blankspaceTaskDetailsSave">Save</span>' +
														'</td></tr>');
																
										aHTML.push('</table>');					
										
										$('#ns1blankspaceTaskDetailsColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceTaskDetailsSave').button(
										{
											label: "Save"
										})
										.click(function() {
											ns1blankspace.project.tasks.save(oParam);
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
														'<textarea id="ns1blankspaceTaskDetailsDescription" class="ns1blankspaceTextMulti" rows="5" cols="50" style="width:100%; height:100px;"></textarea>' +
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
																' data-method="CORE_USER_SEARCH"' +
																' data-columns="firstname-space-surname">' +
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

										$('#ns1blankspaceTaskDetailsTitle').focus();
										
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
									ns1blankspace.status.working();

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
											ns1blankspace.status.message('Task added')
											//ns1blankspace.show({selector: 'ns1blankspaceMainTasks', refresh: true});
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
										success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
									});
								}	
				},

	save: 		{
					send:		function ()
								{
									var sData = 'id=' + ((ns1blankspace.objectContext == -1)?'':ns1blankspace.objectContext);
										
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsReference').val());
										sData += '&startdate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsStartDate').val());
										sData += '&enddate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEndDate').val());
										sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
									}
									
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
										success: ns1blankspace.project.save.process
									});
								},

					process:	function (oResponse)
								{
									
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');

										if (ns1blankspace.objectContext == -1)
										{
											ns1blankspace.objectContext = oResponse.id;
											ns1blankspace.inputDetected = false;
											ns1blankspace.project.search.send('-' + ns1blankspace.objectContext, {source: 1});
										}	
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}
				},

	util: 		{
					taskTypes: 	function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_PROJECT_TASK_TYPE_SEARCH';
										oSearch.addField('displayorder,projecttype,projecttypetext,title');
										oSearch.rf = 'json';
										oSearch.rows = 100;
										oSearch.sort('title', 'asc');
										oSearch.getResults(function (data) {ns1blankspace.project.util.taskTypes(oParam, data)});
									}		
									else
									{
										ns1blankspace.util.onComplete(oParam);
									}	
								}
				}			

}
