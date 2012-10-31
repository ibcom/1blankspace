/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.stucture = 
{
	init: 		function interfaceStructureMasterViewport(oParam)
				{
						var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 154;
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectName = 'structure';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Structures';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.structure.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
				},

	bind:		function ()
				{
					$('#ns1blankspaceViewControlActionOptionsRemove').click(function(event)
					{
						ns1blankspace.structure.remove();
					});
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

						aHTML.push('<tr><td id="ns1blankspaceViewMessagingEmailLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');
								
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_STRUCTURE_SEARCH';
						oSearch.addField('title');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(ns1blankspace.structure.home)		
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a structure.</td></tr>' +
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
														this.title +
														'</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');			
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.structure.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{				
					send:		function (sXHTMLElementId, oParam)
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
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_SEARCH'),
											data: 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
											dataType: 'json',
											success: function(data) { ns1blankspace.structure.show(oParam, data)}
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
											iMaximumColumns = 4;
											sSearchText = aSearch[1];
											if (sSearchText == '#') {sSearchText = '[0-9]'}
											sElementId = 'ns1blankspaceViewControlBrowse';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.container.position(sElementId);
											ns1blankspace.search.start(sElementId);

											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_SEARCH'),
												data: 'quicksearch=' + sSearchText,
												dataType: 'json',
												success: function(data) {interfaceStructureSearchShow(oParam, data)}
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
											
											aHTML.push('<td class="ns1blankspaceSearch" id="title' +
															'-' + this.id + '">' +
															this.title + '</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>'
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</tbody></table>';

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										ns1blankspace.search.stop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.structure.search.send(event.target.id, 1);
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
						aHTML.push('<tr><td id="ns1blankspaceControlData" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Data</td></tr>');		
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlData" class="ns1blankspaceControl">' +
										'Data</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlReporting" class="ns1blankspaceControl">' +
										'Reporting</td></tr>');
					}	
					
					aHTML.push('</table>';					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControl"></div>';
					aHTML.push('<div id="ns1blankspaceMainData" class="ns1blankspaceControl"></div>';
					aHTML.push('<div id="ns1blankspaceMainReporting" class="ns1blankspaceControl"></div>';
							
					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.structure.summary();
					});

					$('#ns1blankspaceControlData').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainData'});
						ns1blankspace.structure.data();
					});

					$('#ns1blankspaceControlReporting').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainReporting'});
						ns1blankspace.structure.reporting();
					});
				},

	show:		function interfaceStructureShow(oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					interfaceStructureViewport();
					
					var aHTML = [];
					
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find this structure.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
									
						aHTML.push('<table id="tableInterfaceMainSummary" class="interfaceMain">';
						aHTML.push('<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
									'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2x">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divInterfaceMainSummary').html(aHTML.join(''));
						
						ns1blankspaceViewportDestination({
							newDestination: 'interfaceStructureMasterViewport({showHome: false});interfaceStructureSearch("-' + ns1blankspace.objectContext + '")',
							move: false
							})
						
						ns1blankspaceObjectViewportHistory({functionDefault: 'interfaceStructureSummary()'})

						$('#divInterfaceViewportControlContext').html(ns1blankspace.objectContextData.title);
						$('#spanns1blankspaceViewportControlAction').button({disabled: false});
						$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});	
					}	
				},		
		
	summary:	function interfaceStructureSummary()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this structure.</td></tr></table>');
								
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
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Structure ID</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryStructureID" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.id +
										'</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainSummaryColumn1').html(aHTML.join(''));
					}	
				},

	data: 		{
					show:		function interfaceStructureData(oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.objectContext;
									var sXHTMLElementId = 'divInterfaceMainData';
									var oOptions = {view: true, remove: true};
									var oActions = {add: true};
									
									if (oParam != undefined)
									{
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
										if (oParam.options != undefined) {oOptions = oParam.options}
										if (oParam.actions != undefined) {oActions = oParam.actions}
									}		
										
									if (oResponse == undefined)
									{	
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/decision/?method=DECISION_DATA_SEARCH&structure=' + ns1blankspace.objectContext,
											dataType: 'json',
											success: function(data) {interfaceStructureData(oParam, data)}
										});

									}
									else
									{
										if (oActions != undefined)
										{
											var aHTML = [];
												
														
											aHTML.push('<table id="tableInterfaceMainData" class="interfaceMain">' +
														'<tr id="trInterfaceMainStructureDataRow1" class="interfaceMainRow1">' +
														'<td id="tdInterfaceMainStructureDataColumn1" class="interfaceMainColumn1Large">' +
														ns1blankspace.xhtml.loading +
														'</td>' +
														'<td id="tdInterfaceMainStructureDataColumn2" class="interfaceMainColumn2Action">' +
														'</td>' +
														'</tr>' +
														'</table>';					
												
											$('#' + sXHTMLElementId).html(aHTML.join(''));
											sXHTMLElementId = 'tdInterfaceMainStructureDataColumn1';
											
											var aHTML = [];
												
											
											aHTML.push('<table id="tableInterfaceMainStructureDataColumn2" class="interfaceMainColumn2">';
											
											if (oActions.add)
											{
												aHTML.push('<tr><td id="tdInterfaceMainStructureDataAdd" class="interfaceMainAction">' +
															'<span id="spanInterfaceMainStructureDataAdd">Add</span>' +
															'</td></tr>';
											}
											
											aHTML.push('</table>';					
											
											$('#tdInterfaceMainStructureDataColumn2').html(aHTML.join(''));
										
											$('#spanInterfaceMainStructureDataAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												 ns1blankspaceStructureDataAdd(oParam);
											})
											
										}	
									
										var aHTML = [];
										
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="tableStructureData" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="interfaceMainCaption">' +
															'<td class="interfaceMainRowNothing">No data.</td></tr>';
											aHTML.push('</tbody></table>';

											$('#' + sXHTMLElementId).html(aHTML.join(''));
										
										}
										else
										{
											aHTML.push('<table id="tableStructureData" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="interfaceMainCaption">';
											aHTML.push('<td class="interfaceMainCaption">Title</td>';
											aHTML.push('<td class="interfaceMainCaption">Last Updated</td>';
											aHTML.push('<td class="interfaceMainCaption">&nbsp;</td>';
											aHTML.push('</tr>';
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="interfaceMainRow">';
																
												aHTML.push('<td id="tdStructureCategory_title-' + this.id + '" class="interfaceMainRow">' +
																		this.title + '</td>';
																		
												aHTML.push('<td id="tdStructureCategory_last_updated-' + this.id + '" class="interfaceMainRow">' +
																		this.lastupdated + '</td>';						
																		
												aHTML.push('<td style="width:60px;text-align:right;" class="interfaceMainRow">';
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="spanStructureDataoptions_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
												};	
													
												if (oOptions.view)
												{	
													aHTML.push('<span id="spanStructureData_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
												};	
													
												aHTML.push('</td>';
																
												aHTML.push('</tr>';
											});
											
											aHTML.push('</tbody></table>';

											$('#' + sXHTMLElementId).html(aHTML.join(''));
											
											if (oOptions.remove) 
											{
												$('.interfaceMainRowOptionsRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspaceStructureDataRemove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px')
											}
											
											if (oOptions.view) 
											{
												$('.interfaceMainRowOptionsView').button( {
													text: false,
													icons: {
														primary: "ui-icon-play"
													}
												})
												.click(function() {
													interfaceStructureDataMasterViewport({showHome: false});
													interfaceStructureDataSearch(this.id);
													//ns1blankspaceStructureDataAdd({xhtmlElementID: this.id})
												})
												.css('width', '15px')
												.css('height', '17px')
											}	
										}
									}	
								},

					add:		function ns1blankspaceStructureDataAdd(oParam, oResponse)
								{
									var sID; 
									
									if (oResponse == undefined)
									{
										var sXHTMLElementID;

										if (oParam != undefined)
										{
											if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										}
										
										if (sXHTMLElementID != undefined)
										{
											var aXHTMLElementID = sXHTMLElementID.split('-');
											var sID = aXHTMLElementID[1];
										}	
									
										var aHTML = [];
										

										aHTML.push('<table id="tableInterfaceMainColumn1" class="interfaceMain">';
												
										aHTML.push('<tr id="trInterfaceMainSetupStructureDataTitle" class="interfaceMain">' +
														'<td id="tdInterfaceMainSetupStructureDataTitle" class="interfaceMain">' +
														'Title' +
														'</td></tr>' +
														'<tr id="trInterfaceMainSetupStructureDataAddTitleValue" class="interfaceMainText">' +
														'<td id="tdInterfaceMainSetupStructureDataAddTitleValue" class="interfaceMainText">' +
														'<input id="inputInterfaceMainStructureDataAddTitle" class="inputInterfaceMainText">' +
														'</td></tr>';
										
										aHTML.push('</table>';					
										
										$('#tdInterfaceMainStructureDataColumn1').html(aHTML.join(''));
										
										var aHTML = [];
										
									
										aHTML.push('<table id="tableInterfaceMainColumn2" class="interfaceMain">';
												
										aHTML.push('<tr id="trInterfaceMainStructureDataAddSave" class="interfaceMainAction">' +
														'<td id="tdInterfaceMainStructureDataAddSave" class="interfaceMainAction">' +
														'<span style="width:80px;" id="spanInterfaceMainStructureDataAddSave">Save</span>' +
														'</td></tr>';
									
										aHTML.push('<tr id="trInterfaceMainStructureDataAddCancel" class="interfaceMainAction">' +
														'<td id="tdInterfaceMainStructureDataAddCancel" class="interfaceMainAction">' +
														'<span style="width:80px;" id="spanInterfaceMainStructureDataAddCancel">Cancel</span>' +
														'</td></tr>';
														
										aHTML.push('</table>';					
										
										$('#tdInterfaceMainStructureDataColumn2').html(aHTML.join(''));
										
										$('#spanInterfaceMainStructureDataAddSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											var sData = 'structure=' + ns1blankspace.objectContext;
											sData += '&id=' + ns1blankspace.util.fs(sID);
											sData += '&title=' + ns1blankspace.util.fs($('#inputInterfaceMainStructureDataAddTitle').val());
											
											$.ajax(
											{
												type: 'POST',
												url: '/ondemand/decision/?method=STRUCTURE_DATA_MANAGE',
												data: sData,
												dataType: 'json',
												success: function() {
													interfaceStructureData();
												}
											});
										});
										
										$('#spanInterfaceMainStructureDataAddCancel').button(
										{
											text: "Cancel"
										})
										.click(function() 
										{
											ns1blankspaceMainViewportShow("#divInterfaceMainData");
											interfaceSetupStructureData();
										});
										
										if (sID != undefined)
										{
											$.ajax(
											{
												type: 'POST',
												url: '/ondemand/descision/?method=DECISION_DATA_SEARCH',
												data: 'id=' + sID,
												dataType: 'json',
												success: function(data) {ns1blankspaceStructureDataAdd(oParam, data)}
											});
										}
										else
										{
											
										}
									}
									else
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];
											$('#inputInterfaceMainSetupStructureDataAddTitle').val(oObjectContext.title)
											$('#inputInterfaceMainSetupStructureDataAddTitle').focus();
										}
									}		
								},

					remove:		function ns1blankspaceStructureDataRemove(oParam, oResponse)
								{
									var sXHTMLElementID;

									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}
									
									var aXHTMLElementID = sXHTMLElementID.split('-');
									var sID = aXHTMLElementID[1];
									
									if (oResponse == undefined)
									{	
										var sParam = 'method=DECISION_DATA_MANAGE&remove=1';
										var sData = 'id=' + sID;
										
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/decision/?' + sParam,
											data: sData,
											dataType: 'json',
											success: function(data){ns1blankspaceStructureDataRemove(oParam, data)}
										});
									}	
									else
									{
										if (oResponse.status == 'OK')
										{
											$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
										}	
									}	
									
								}
				},
						
	reporting:	function interfaceStructureReporting(oParam)
				{
					var aHTML = [];
					
					
					aHTML.push('<table id="tableInterfaceMainReporting" class="interfaceMain">' +
								'<tr id="trInterfaceMainReportingRow1" class="interfaceMainRow1">' +
								'<td id="tdInterfaceMainReportingColumn1" style="width: 100px;" class="interfaceMainColumn1">' +
								ns1blankspace.xhtml.loading +
								'</td>' +
								'<td id="tdInterfaceMainBankAccountColumn2" class="interfaceMainColumn2">' +
								'</td>' +
								'</tr>' +
								'</table>';				
					
					$('#divInterfaceMainReporting').html(aHTML.join(''));
					
					var aHTML = [];
					
					
					aHTML.push('<table id="tableInterfaceMainColumn1" class="">';
					
					aHTML.push('<tr><td id="tdInterfaceMainReport1" class="interfaceMainRow">Report 1</td></tr>';
					aHTML.push('<tr><td id="tdInterfaceMainReport2" class="interfaceMainRow">Report 2</td></tr>';			
									
					aHTML.push('</table>';					
					
					$('#tdInterfaceMainReportingColumn1').html(aHTML.join(''));
					
				},

	new:		function interfaceStructureNew()
				{
					alert('You need to be system administrator to add a strucuture.  If you are a system adminstrator then go to the setup section.');
				}
}				
