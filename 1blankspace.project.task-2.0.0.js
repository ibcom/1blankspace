/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.projectTask = 
{
	init: 		function interfaceProjectTaskMasterViewport(oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 11;
					ns1blankspace.objectName = 'Project Task';
					ns1blankspace.objectContext = -1;
					ns1blankspace.objectContextData = undefined;
						
					if (bShowHome)
					{
						ns1blankspaceViewportDestination({
							newDestination: 'interfaceProjectTaskMasterViewport({showHome: true});',
							move: false
							})		
					}
					
					ns1blankspaceReset();
					
					$('#divns1blankspaceViewportControlSet').button(
					{
						label: "Project Tasks"
					});
					
					$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
					{
						if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
				        ns1blankspace.timer.delayCurrent = setTimeout("interfaceProjectTaskSearch('inputns1blankspaceViewportControlSearch')", ns1blankspace.option.typingWait);	
					});
					
					$('#spanns1blankspaceViewportControlSearch').click(function(event)
					{
						interfaceProjectTaskSearch('inputns1blankspaceViewportControlSearch');
					});
					
					$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
					{
						interfaceProjectTaskSearchOptions();
					});
					
					$('#spanns1blankspaceViewportControlNew').click(function(event)
					{
						interfaceProjectTaskNew();
					})
					
					$('#spanns1blankspaceViewportControlNewOptions').click(function(event)
					{
						interfaceProjectTaskNewOptions();
					});
					
					$('#spanns1blankspaceViewportControlAction').click(function(event)
					{
						interfaceProjectTaskSave();
					});
					
					$('#spanns1blankspaceViewportControlActionOptions').click(function(event)
					{
						interfaceProjectTaskSaveOptions();
					});
					
					$('#spanns1blankspaceViewportControlSetup').click(function(event)
					{
						interfaceProjectTaskSetup();
					});
					
					$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
					{
						interfaceProjectTaskSetupOptions();
					});
					
					$('#spanns1blankspaceViewportControlHelp').click(function(event)
					{
						interfaceProjectTaskHelp();
					});
					
					$('#spanns1blankspaceViewportControlHelpOptions').click(function(event)
					{
						interfaceProjectTaskHelpOptions();
					});
					
					$('td.interfaceViewportMasterControlBrowse').click(function(event)
					{
						interfaceProjectTaskSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
					});
					
					$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
					{
						interfaceProjectTaskSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
					});
					
					if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
					if (bShowHome) {interfaceProjectTaskHomeShow()};
				},

	home:		function interfaceProjectTaskHomeShow(oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
						var h = -1;
									
						aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
						aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
										'<td id="tdInterfaceProjectTaskHomeMostLikely" class="interfaceViewportMain">' +
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
						oSearch.method = 'PROJECT_TASK_SEARCH';
						oSearch.addField('reference,description');
						oSearch.async = false;
						oSearch.rf = 'json';
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(interfaceProjectTaskHomeShow);
						
					}
					else
					{
						var aHTML = [];
						var h = -1;
								
						if (oResponse.data.rows.length == 0)
						{
							aHTML[++h] = '<table id="tableInterfaceProjectTaskHomeMostLikely">';
							aHTML[++h] = '<tr class="trInterfaceProjectTaskHomeMostLikelyNothing">';
							aHTML[++h] = '<td class="tdInterfaceProjectTaskHomeMostLikelyNothing">Click New to create a project task.</td>';
							aHTML[++h] = '</tr>';
							aHTML[++h] = '</table>';
						}
						else
						{
							aHTML[++h] = '<table id="tableInterfaceProjectTaskHomeMostLikely">';
							aHTML[++h] = '<tr>';
							aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
							aHTML[++h] = '</tr>';
							
							$.each(oResponse.data.rows, function()
							{	
								aHTML[++h] = '<tr class="interfaceMainRow">';
								
								aHTML[++h] = '<td id="interfaceProjectTaskHomeMostLikely_Title-' +
													this.id + '" class="interfaceHomeMostLikely">' +
													this.description + '</td>';
								
								aHTML[++h] = '</tr>';
							});
							
							aHTML[++h] = '</tbody></table>';
						}
						
						$('#tdInterfaceProjectTaskHomeMostLikely').html(aHTML.join(''));
					
						$('td.interfaceHomeMostLikely').click(function(event)
						{
							interfaceProjectTaskSearch(event.target.id, {source: 1});
						});
					}
				},

	search: 	{			
					send: 		function interfaceProjectTaskSearch(sXHTMLElementId, oParam)
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
										
									if (sSearchContext != undefined  && iSource != ns1blankspace.data.searchSource.browse)
									{	
										$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										var sParam = 'method=PROJECT_TASK_SEARCH&id=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/project/?' + sParam,
											dataType: 'json',
											success: function(data) {interfaceProjectTaskShow(oParam, data)}
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
											
											var sParam = 'method=PROJECT_TASK_SEARCH&quicksearch=' + sSearchText;

											$.ajax(
											{
												type: 'GET',
												url: '/ondemand/project/?' + sParam,
												dataType: 'json',
												success: function(data) {interfaceProjectTaskSearchShow(oParam, data)}
											});
										}
									};	
								}

					process:	function interfaceProjectTaskSearchShow(oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
										
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspaceSearchStop();
										$('#divns1blankspaceViewportControlOptions').hide();
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
											interfaceProjectTaskSearch(event.target.id, {source: 1});
										});
									}	
											
								}
				},

	layout: 	function interfaceProjectTaskViewport()
				{
					
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
					
					aHTML[++h] = '<table id="tableInterfaceViewportControl1" class="interfaceViewportControl">';
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
										'</tr>';
						aHTML[++h] = '<tr id="trInterfaceViewportControl3" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlAddress" class="interfaceViewportControl">Address</td>' +
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
					
						aHTML[++h] = '</table>';					
					
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
					aHTML[++h] = '<div id="divInterfaceMainScheduling" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
					
					$('#divInterfaceMain').html(aHTML.join(''));
					
					$('#tdInterfaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
						interfaceProjectTaskSummary();
					});
					
					$('#tdInterfaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
						interfaceProjectTaskDetails();
					});
					
					$('#tdInterfaceViewportControlDescription').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainDescription");
						interfaceProjectTaskDescription();
					});
					
					$('#tdInterfaceViewportControlScheduling').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainScheduling");
						interfaceProjectTaskScheduling("divInterfaceMainScheduling", true);
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

	show: 		function interfaceProjectTaskShow(oParam, oResponse)
				{
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
					interfaceProjectTaskViewport();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
					
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find ProjectTask.</td></tr>';
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
							newDestination: 'interfaceProjectTaskMasterViewport({showHome: false});interfaceProjectTaskSearch("-' + ns1blankspace.objectContext + '")',
							move: false
							})
							
						interfaceProjectTaskSummary();
					}	
				},	
		
	summary: 	function interfaceProjectTaskSummary()
				{
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find ProjectTask.</td></tr>';
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
									
						if (ns1blankspace.objectContextData.statustext != '')
						{	
							aHTML[++h] =  '<tr><td id="tdInterfaceMainSummaryStatus" class="interfaceMainSummary">Status</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryStatusValue" class="interfaceMainSummaryValue">' +
										ns1blankspace.objectContextData.statustext +
										'</td>' +
										'</tr>';
						}
						
						if (ns1blankspace.objectContextData.percentagecomplete != '')
						{
							aHTML[++h] =  '<tr><td id="tdInterfaceMainSummaryPercentageComplete" class="interfaceMainSummary">Percentage Complete</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryPercentageCompleteValue" class="interfaceMainSummaryValue">' +
										ns1blankspace.objectContextData.percentagecomplete +
										'</td>' +
										'</tr>';
						}
						
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));
		
						$('#aInterfaceMainSummaryViewAsTimeline').click(function(event)
						{
							interfaceProjectTaskViewAsTimeline();
						});
					}	
				},

	details:	function interfaceProjectTaskDetails()
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

						aHTML[++h] = '<tr id="trInterfaceMainDetailsPercentageComplete" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsPercentageComplete" class="interfaceMain">' +
										'Percentage Complete' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsPercentageCompleteValue" class="interfaceMainSelect">' +
										'<td id="tdInterfaceMainDetailsPercentageCompleteValue" class="interfaceMainSelect">' +
										'<input id="inputInterfaceMainDetailsPercentageComplete" class="inputInterfaceMainText">' +
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
										'<br /><input type="radio" id="radioStatus5" name="radioStatus" value="5"/>On Hold' +
										'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>Cancelled' +
										'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Completed' +
										'</td></tr>';
						
						aHTML[++h] = '</table>';					
							
						$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
								
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputInterfaceMainDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#inputInterfaceMainDetailsTitle').val(ns1blankspace.objectContextData.surname);
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
							$('#inputInterfaceMainDetailsPercentageComplete').val(ns1blankspace.objectContextData.percentagecomplete);
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
				function interfaceProjectTaskDescription()
				{
					
					var aHTML = [];
					var h = -1;
					
					if ($('#divInterfaceMainDescription').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainDescription').attr('onDemandLoading', '');
								
						aHTML[++h] = '<table id="tableInterfaceMainDescription" class="interfaceMain">';
						aHTML[++h] = '<tr id="trInterfaceMainDescriptionRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainDescriptionColumn1" class="interfaceMainColumn1Large">' +
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

	new:		function interfaceProjectTaskNew()
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					interfaceProjectTaskViewport();
					ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
					interfaceProjecttaskDetails();	
				},

	save 		{
					send:		function interfaceProjectTaskSave()
								{
									var sData = 'id=' + ((ns1blankspace.objectContext == -1)?'':ns1blankspace.objectContext);
										
									if ($('#divInterfaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsReference').val());
										sData += '&startdate=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsStartDate').val());
										sData += '&enddate=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsEndDate').val());
										sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
									}
									
									if ($('#divInterfaceMainDescription').html() != '')
									{
										sData += '&description=' + ns1blankspace.util.fs($('#inputInterfaceMainDescription').val());
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspaceEndpointURL('PROJECT_TASK_MANAGE'),
										data: sData,
										dataType: 'json',
										success: interfaceProjectTaskSaveProcess
									});
								},


					process: 	function interfaceProjectTaskSaveProcess(oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspaceStatus('Project task saved');
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