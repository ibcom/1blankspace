/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.projectTask = 
{
	init: 		function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 11;
					ns1blankspace.objectName = 'projectTask';
					ns1blankspace.objectMethod = 'PROJECT_TASK';
					ns1blankspace.viewName = 'Project Tasks';
					
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
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));

						var aHTML = [];
									
						aHTML.push('<table>');

						aHTML.push('<tr><td><div id="ns1blankspaceViewProjectLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
									
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	

						var oSearch = new AdvancedSearch();
						oSearch.method = 'PROJECT_TASK_SEARCH';
						oSearch.addField('reference,title');
						oSearch.rf = 'json';
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(ns1blankspace.projectTask.home);
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
							aHTML.push('<tr><td class="ns1blankspaceCaption" colspan=2>MOST LIKELY</td></tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
														'" class="ns1blankspaceMostLikely" style="width: 90px;">' +
														this.reference +
														'</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
																		this.title + '</td>');

								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');			
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.projectTask.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{			
					send: 		function (sXHTMLElementID, oParam)
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
										
									if (sSearchContext != undefined  && iSource != ns1blankspace.data.searchSource.browse)
									{	
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'PROJECT_TASK_SEARCH';

										oSearch.addField('actualenddate,criticaldate,dependsontask,dependsontasktext,description,enddate,' +
															'expectedduration,milestone,percentagecomplete,priority,prioritytext,prioritynumber,project,projecttext,' +
															'reassignmentnotes,reference,schedulingnotes,startdate,status,statustext,taskby,taskbytext,tasktype,' +
															'tasktypetext,timespent,title,tobecheckedby,tobecheckedbytext');
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										
										oSearch.getResults(function(data) {ns1blankspace.projectTask.show(oParam, data)});
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
											ns1blankspace.container.position({xhtmlElementID: sElementID});
											ns1blankspace.search.start(sElementID);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'PROJECT_TASK_SEARCH';
											oSearch.addField('reference,title');
											oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
											oSearch.getResults(function(data) {ns1blankspace.projectTask.search.process(oParam, data)});
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var	iMaximumColumns = 1;
									var aHTML = [];

									if (oResponse.data.rows.length == 0)
									{
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
															'reference-' + this.id + '">' +
															this.reference +
															'</td>');

											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'title-' + this.id + '">' +
															this.title +
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
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.projectTask.search.send(event.target.id, {source: 1});
										});
									}

									ns1blankspace.search.stop();			
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
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.projectTask.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.projectTask.details();
					});

					$('#ns1blankspaceControlDescription').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDescription'});
						ns1blankspace.projectTask.description();
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
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.projectTask.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this project task.</td></tr></table>');
								
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
							newDestination: 'ns1blankspace.projectTask.init({id:' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.projectTask.summary()'});
					}	
				},	
		
	summary: 	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this project task.</td></tr></table>');
								
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
										'<tr><td id="ns1blankspaceSummaryEmail" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>');
						}	

						if (ns1blankspace.objectContextData.statustext != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Status</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryStatus" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.statustext +
										'</td></tr>');	
						}

						if (ns1blankspace.objectContextData.percentagecomplete != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Percentage Complete</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryPercentageComplete" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.percentagecomplete + '%' +
										'</td></tr>');
						}											
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
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
										'Percentage Complete' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPercentageComplete" class="ns1blankspaceText">' +
										'</td></tr>');												
							
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						$('input.ns1blankspaceDate').datepicker({ dateFormat: 'dd M yy' });
						
						var aHTML = [];
							
						aHTML.push('<table class="ns1blankspaceMain">');
						
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr>' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Not Started' +
										'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>In Progress' +
										'<br /><input type="radio" id="radioStatus5" name="radioStatus" value="5"/>On Hold' +
										'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>Cancelled' +
										'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Completed' +
										'</td></tr>');
						
						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));
								
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.surname);
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
							$('#ns1blankspaceDetailsStartDate').val(ns1blankspace.objectContextData.startdate);
							$('#ns1blankspaceDetailsEndDate').val(ns1blankspace.objectContextData.enddate);
							$('#ns1blankspaceDetailsPercentageComplete').val(ns1blankspace.objectContextData.percentagecomplete);
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

	new:		function ()
				{
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.projectTask.layout();
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					$('#ns1blankspaceViewportControlAction').button({disabled: false});
					$('#ns1blankspaceViewportControlActionOptions').button({disabled: true});
					ns1blankspace.projectTask.details();
				},

	save:		{
					send:		function ()
								{
									ns1blankspace.status.working();
									
									var sData = 'id=' + ((ns1blankspace.objectContext == -1) ? '' : ns1blankspace.objectContext);
										
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsReference').val());
										sData += '&startdate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsStartDate').val());
										sData += '&enddate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEndDate').val());
										sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
										sData += '&percentagecomplete=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPercentageComplete').val());
									}
									
									if ($('#ns1blankspaceMainDescription').html() != '')
									{
										sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceDescription').val());
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('PROJECT_TASK_MANAGE'),
										data: sData,
										dataType: 'json',
										success: ns1blankspace.projectTask.save.process
									});
								},


					process: 	function (oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Project task saved');
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