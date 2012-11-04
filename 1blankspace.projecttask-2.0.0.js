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
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 11;
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectName = 'projectTask';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Project Tasks';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.projectTask.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
				},

	home:		function ns1blankspaceProjectTaskHomeShow(oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
						var h = -1;
									
						aHTML.push('<table id="tablens1blankspaceViewportMain" class="ns1blankspaceViewportMain">';
						aHTML.push('<tr id="trns1blankspaceViewportMain" class="ns1blankspaceViewportMain">' +
										'<td id="tdns1blankspaceProjectTaskHomeMostLikely" class="ns1blankspaceViewportMain">' +
										ns1blankspace.xhtml.loading + 
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divns1blankspaceMain').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
									
						aHTML.push('<table>';
						aHTML.push('<tr>' +
										'<td id="ns1blankspaceViewportProjectLarge" class="ns1blankspaceViewportImageLarge">' +
										'&nbsp;' + 
										'</td>' +
										'</tr>';
						aHTML.push('</table>';		
						
						$('#divns1blankspaceViewportControl').html(aHTML.join(''));	
						
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'PROJECT_TASK_SEARCH';
						oSearch.addField('reference,description');
						oSearch.async = false;
						oSearch.rf = 'json';
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(ns1blankspaceProjectTaskHomeShow);
						
					}
					else
					{
						var aHTML = [];
						var h = -1;
								
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="tablens1blankspaceProjectTaskHomeMostLikely">';
							aHTML.push('<tr class="trns1blankspaceProjectTaskHomeMostLikelyNothing">';
							aHTML.push('<td class="tdns1blankspaceProjectTaskHomeMostLikelyNothing">Click New to create a project task.</td>';
							aHTML.push('</tr>';
							aHTML.push('</table>';
						}
						else
						{
							aHTML.push('<table id="tablens1blankspaceProjectTaskHomeMostLikely">';
							aHTML.push('<tr>';
							aHTML.push('<td class="ns1blankspaceMain">MOST LIKELY</td>';
							aHTML.push('</tr>';
							
							$.each(oResponse.data.rows, function()
							{	
								aHTML.push('<tr class="ns1blankspaceMainRow">';
								
								aHTML.push('<td id="ns1blankspaceProjectTaskHomeMostLikely_Title-' +
													this.id + '" class="ns1blankspaceHomeMostLikely">' +
													this.description + '</td>';
								
								aHTML.push('</tr>';
							});
							
							aHTML.push('</tbody></table>';
						}
						
						$('#tdns1blankspaceProjectTaskHomeMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceHomeMostLikely').click(function(event)
						{
							ns1blankspaceProjectTaskSearch(event.target.id, {source: 1});
						});
					}
				},

	search: 	{			
					send: 		function ns1blankspaceProjectTaskSearch(sXHTMLElementId, oParam)
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
										$('#divns1blankspaceViewportControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										var sParam = 'method=PROJECT_TASK_SEARCH&id=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/project/?' + sParam,
											dataType: 'json',
											success: function(data) {ns1blankspaceProjectTaskShow(oParam, data)}
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
											sElementId = 'tablens1blankspaceViewportMasterBrowse';
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
												success: function(data) {ns1blankspaceProjectTaskSearchShow(oParam, data)}
											});
										}
									};	
								}

					process:	function ns1blankspaceProjectTaskSearchShow(oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
										
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspaceSearchStop();
										$(ns1blankspace.xhtml.container).hide();
									}
									else
									{
										aHTML.push('<table class="ns1blankspaceSearchMedium">';
										aHTML.push('<tbody>'
											
										$.each(oResponse.data.rows, function()
										{	
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">';
											}
											
											aHTML.push('<td class="ns1blankspaceContactType' + this.type + ' ns1blankspaceSearch">&nbsp;</td>';
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'-' + this.id + '">' +
															this.reference +
															'</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>'
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</tbody></table>';

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										ns1blankspaceSearchStop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspaceProjectTaskSearch(event.target.id, {source: 1});
										});
									}	
											
								}
				},

	layout: 	function ns1blankspaceProjectTaskViewport()
				{
					
					var aHTML = [];
					var h = -1;

					aHTML.push('<div id="divns1blankspaceViewportControlContext" class="ns1blankspaceViewportControlContext"></div>';
					
					aHTML.push('<table id="tablens1blankspaceViewportControl1" class="ns1blankspaceViewportControl">';
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlDetails" class="ns1blankspaceViewportControl ns1blankspaceViewportControlHighlight">Details</td>' +
										'</tr>';
						aHTML.push('<tr id="trns1blankspaceViewportControl3" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlAddress" class="ns1blankspaceViewportControl">Address</td>' +
									'</tr>';				
					}
					else
					{
						aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlSummary" class="ns1blankspaceViewportControl ns1blankspaceViewportControlHighlight">Summary</td>' +
										'</tr>';
									
						aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlDetails" class="ns1blankspaceViewportControl">Details</td>' +
										'</tr>';
					
						aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlDescription" class="ns1blankspaceViewportControl">Description</td>' +
										'</tr>';
					
						aHTML.push('</table>';					
					
						aHTML.push('<table id="tablens1blankspaceViewportControl3" class="ns1blankspaceViewportControl">';
					
						aHTML.push('<tr id="trns1blankspaceViewportControl" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlActions" class="ns1blankspaceViewportControl">Actions</td>' +
										'</tr>';
									
						aHTML.push('<tr id="trns1blankspaceViewportControl" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlAttachments" class="ns1blankspaceViewportControl">Attachments</td>' +
										'</tr>';
					}
									
					aHTML.push('</table>';					
							
					$('#divns1blankspaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;

					aHTML.push('<div id="divns1blankspaceMainSummary" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainDetails" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainDescription" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainScheduling" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainActions" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainAttachments" class="divns1blankspaceViewportMain"></div>';
					
					$('#divns1blankspaceMain').html(aHTML.join(''));
					
					$('#tdns1blankspaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainSummary");
						ns1blankspaceProjectTaskSummary();
					});
					
					$('#tdns1blankspaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainDetails");
						ns1blankspaceProjectTaskDetails();
					});
					
					$('#tdns1blankspaceViewportControlDescription').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainDescription");
						ns1blankspaceProjectTaskDescription();
					});
					
					$('#tdns1blankspaceViewportControlScheduling').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainScheduling");
						ns1blankspaceProjectTaskScheduling("divns1blankspaceMainScheduling", true);
					});
					
					$('#tdns1blankspaceViewportControlActions').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainActions", true);
						ns1blankspaceActions({xhtmlElementID: 'divns1blankspaceMainActions'});
					});

					$('#tdns1blankspaceViewportControlAttachments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainAttachments", true);
						ns1blankspaceAttachments({xhtmlElementID: 'divns1blankspaceMainAttachments'});
					});
				},

	show: 		function ns1blankspaceProjectTaskShow(oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspaceProjectTaskViewport();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
					
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find ProjectTask.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
					
						$('#divns1blankspaceViewportControlContext').html(ns1blankspace.objectContextData.reference);
						$('#spanns1blankspaceViewportControlAction').button({disabled: false});
						$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});
						
						ns1blankspaceViewportDestination({
							newDestination: 'ns1blankspaceProjectTaskMasterViewport({showHome: false});ns1blankspaceProjectTaskSearch("-' + ns1blankspace.objectContext + '")',
							move: false
							})
							
						ns1blankspaceProjectTaskSummary();
					}	
				},	
		
	summary: 	function ns1blankspaceProjectTaskSummary()
				{
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find ProjectTask.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table id="tablens1blankspaceMainSummary" class="ns1blankspaceMain">';
						aHTML.push('<tr id="trns1blankspaceMainSummaryRow1" class="ns1blankspaceMainRow1">' +
									'<td id="tdns1blankspaceMainSummaryColumn1Large" class="ns1blankspaceMainColumn1">' +
										'</td>' +
										'<td id="tdns1blankspaceMainSummaryColumn2Action" class="ns1blankspaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divns1blankspaceMainSummary').html(aHTML.join(''));
					
						var aHTML = [];
						var h = -1;
					
						aHTML.push('<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMainColumn1">';
						
						aHTML.push('<tr><td id="tdns1blankspaceMainSummaryDescription" class="ns1blankspaceMainSummary">Description</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummaryDescriptionValue" class="ns1blankspaceMainSummaryValue">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>';
									
						if (ns1blankspace.objectContextData.statustext != '')
						{	
							aHTML.push( '<tr><td id="tdns1blankspaceMainSummaryStatus" class="ns1blankspaceMainSummary">Status</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummaryStatusValue" class="ns1blankspaceMainSummaryValue">' +
										ns1blankspace.objectContextData.statustext +
										'</td>' +
										'</tr>';
						}
						
						if (ns1blankspace.objectContextData.percentagecomplete != '')
						{
							aHTML.push( '<tr><td id="tdns1blankspaceMainSummaryPercentageComplete" class="ns1blankspaceMainSummary">Percentage Complete</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummaryPercentageCompleteValue" class="ns1blankspaceMainSummaryValue">' +
										ns1blankspace.objectContextData.percentagecomplete +
										'</td>' +
										'</tr>';
						}
						
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainSummaryColumn1Large').html(aHTML.join(''));
		
						$('#ans1blankspaceMainSummaryViewAsTimeline').click(function(event)
						{
							ns1blankspaceProjectTaskViewAsTimeline();
						});
					}	
				},

	details:	function ns1blankspaceProjectTaskDetails()
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

						aHTML.push('<tr id="trns1blankspaceMainDetailsPercentageComplete" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsPercentageComplete" class="ns1blankspaceMain">' +
										'Percentage Complete' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsPercentageCompleteValue" class="ns1blankspaceMainSelect">' +
										'<td id="tdns1blankspaceMainDetailsPercentageCompleteValue" class="ns1blankspaceMainSelect">' +
										'<input id="inputns1blankspaceMainDetailsPercentageComplete" class="inputns1blankspaceMainText">' +
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
										'<br /><input type="radio" id="radioStatus5" name="radioStatus" value="5"/>On Hold' +
										'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>Cancelled' +
										'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Completed' +
										'</td></tr>';
						
						aHTML.push('</table>';					
							
						$('#tdns1blankspaceMainDetailsColumn2').html(aHTML.join(''));
								
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputns1blankspaceMainDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#inputns1blankspaceMainDetailsTitle').val(ns1blankspace.objectContextData.surname);
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
							$('#inputns1blankspaceMainDetailsPercentageComplete').val(ns1blankspace.objectContextData.percentagecomplete);
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
				function ns1blankspaceProjectTaskDescription()
				{
					
					var aHTML = [];
					var h = -1;
					
					if ($('#divns1blankspaceMainDescription').attr('onDemandLoading') == '1')
					{
						$('#divns1blankspaceMainDescription').attr('onDemandLoading', '');
								
						aHTML.push('<table id="tablens1blankspaceMainDescription" class="ns1blankspaceMain">';
						aHTML.push('<tr id="trns1blankspaceMainDescriptionRow1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDescriptionColumn1" class="ns1blankspaceMainColumn1Large">' +
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

	new:		function ns1blankspaceProjectTaskNew()
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspaceProjectTaskViewport();
					ns1blankspaceMainViewportShow("#divns1blankspaceMainDetails");
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
					ns1blankspaceProjecttaskDetails();	
				},

	save 		{
					send:		function ns1blankspaceProjectTaskSave()
								{
									var sData = 'id=' + ((ns1blankspace.objectContext == -1)?'':ns1blankspace.objectContext);
										
									if ($('#divns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsReference').val());
										sData += '&startdate=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsStartDate').val());
										sData += '&enddate=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsEndDate').val());
										sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
									}
									
									if ($('#divns1blankspaceMainDescription').html() != '')
									{
										sData += '&description=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDescription').val());
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspaceEndpointURL('PROJECT_TASK_MANAGE'),
										data: sData,
										dataType: 'json',
										success: ns1blankspaceProjectTaskSaveProcess
									});
								},


					process: 	function ns1blankspaceProjectTaskSaveProcess(oResponse)
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