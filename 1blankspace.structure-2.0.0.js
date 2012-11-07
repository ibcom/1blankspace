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
										aHTML.push('<table class="ns1blankspaceSearchMedium">');
											
										$.each(oResponse.data.rows, function()
										{	
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">');
											}
											
											aHTML.push('<td class="ns1blankspaceSearch" id="title' +
															'-' + this.id + '">' +
															this.title + '</td>');
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');

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
					
					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainData" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainReporting" class="ns1blankspaceControl"></div>');
							
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

	show:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					interfaceStructureViewport();
					
					var aHTML = [];
					
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this structure.</td></tr>');
						aHTML.push('<tr>&nbsp;</tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];

						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});

						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.structure.init({showHome: false});ns1blankspace.structure.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.structure.summary()'});
					}	
				},		
		
	summary:	function ()
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
					show:		function (oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.objectContext;
									var oOptions = {view: true, remove: true};
									var oActions = {add: true};
									
									if (oParam != undefined)
									{
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.options != undefined) {oOptions = oParam.options}
										if (oParam.actions != undefined) {oActions = oParam.actions}
									}		
										
									if (oResponse == undefined)
									{	
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_SEARCH'),
											data: 'structure=' + ns1blankspace.objectContext,
											dataType: 'json',
											success: function(data) {ns1blankspace.structure.data.show(oParam, data)}
										});

									}
									else
									{
										if (oActions != undefined)
										{
											var aHTML = [];
															
											aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceStructureDataColumn1" class="ns1blankspaceColumn1Large">' +
														ns1blankspace.xhtml.loading +
														'</td>' +
														'<td id="ns1blankspaceStructureDataColumn2" class="ns1blankspaceColumn2Action"></td>' +
														'</tr>' +
														'</table>');					
												
											$('#ns1blankspaceMainData').html(aHTML.join(''));
											
											var aHTML = [];
												
											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											if (oActions.add)
											{
												aHTML.push('<tr><td class="ns1blankspaceAction">' +
															'<span id="ns1blankspaceStructureDataAdd">Add</span>' +
															'</td></tr>');
											}
											
											aHTML.push('</table>');					
											
											$('#tdns1blankspaceStructureDataColumn2').html(aHTML.join(''));
										
											$('#ns1blankspaceStructureDataAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												 ns1blankspace.structure.data.edit(oParam);
											})
											
										}	
									
										var aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td valign="top">No data.</td></tr></table>');

											$('#ns1blankspaceStructureDataColumn1').html(aHTML.join(''));
										
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceStructureData" class="ns1blankspaceContainer">');
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceCaption">Title</td>');
											aHTML.push('<td class="ns1blankspaceCaption">Last Updated</td>');
											aHTML.push('<td class="ns1blankspaceCaption">&nbsp;</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceStructureData_title-' + this.id + '" class="ns1blankspaceRow">' +
																		this.title + '</td>');
																		
												aHTML.push('<td id="ns1blankspaceStructureData_last_updated-' + this.id + '" class="ns1blankspaceRow">' +
																		this.lastupdated + '</td>');						
																		
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceStructureData_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
												};	
													
												if (oOptions.view)
												{	
													aHTML.push('<span id="ns1blankspaceStructureData_options_view-' + this.id + '" class="ns1blankspaceRowView"></span>');
												};	
													
												aHTML.push('</td>');
																
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceStructureDataColumn1').html(aHTML.join(''));
											
											if (oOptions.remove) 
											{
												$('#ns1blankspaceStructureData > .ns1blankspaceRowRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspace.structure.data.remove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px')
											}
											
											if (oOptions.view) 
											{
												$('#ns1blankspace.structure.data > .ns1blankspaceRowView').button( {
													text: false,
													icons: {
														primary: "ui-icon-play"
													}
												})
												.click(function() {
													ns1blankspace.structureData.init({showHome: false});
													ns1blankspace.structureData.search.send(this.id);
												})
												.css('width', '15px')
												.css('height', '17px');
											}	
										}
									}	
								},

					edit:		function (oParam, oResponse)
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
										
										aHTML.push('<table class="ns1blankspaceContainer">');
												
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Title' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<tdclass="ns1blankspaceText">' +
														'<input id="ns1blankspaceStructureDataTitle" class="inputns1blankspaceText">' +
														'</td></tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceStructureDataColumn1').html(aHTML.join(''));
										
										var aHTML = [];
										
									
										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr class="ns1blankspaceAction">' +
														'<td class="ns1blankspaceAction">' +
														'<span style="width:80px;" id="ns1blankspaceStructureDataSave">Save</span>' +
														'</td></tr>');
									
										aHTML.push('<tr class="ns1blankspaceAction">' +
														'<td class="ns1blankspaceAction">' +
														'<span style="width:80px;" id="ns1blankspaceStructureDataCancel">Cancel</span>' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceStructureDataColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceStructureDataSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											var sData = 'structure=' + ns1blankspace.objectContext;
											sData += '&id=' + ns1blankspace.util.fs(sID);
											sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceStructureDataTitle').val());
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function() {
													ns1blankspace.structure.data.show();
												}
											});
										});
										
										$('#ns1blankspaceStructureDataCancel').button(
										{
											text: "Cancel"
										})
										.click(function() 
										{
											ns1blankspace.show({selector: '#divns1blankspaceData'});
											ns1blankspace.structure.data.show();
										});
										
										if (sID != undefined)
										{
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_SEARCH'),
												data: 'id=' + ns1blankspace.util.fs(sID),
												dataType: 'json',
												success: function(data) {ns1blankspace.structure.data.edit(oParam, data)}
											});
										}
									}
									else
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];
											$('#ns1blankspaceSetupStructureDataTitle').val(oObjectContext.title)
											$('#ns1blankspaceSetupStructureDataTitle').focus();
										}
									}		
								},

					remove:		function (oParam, oResponse)
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
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_MANAGE'),
											data: 'remove=1&id=' + ns1blankspace.util.fs(sID),
											dataType: 'json',
											success: function(data){ns1blankspace.structure.data.remove(oParam, data)}
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
						
	reporting:	function (oParam)
				{
					var aHTML = [];
					
					aHTML.push('<table class="ns1blankspaceContainer">' +
									'<tr class="ns1blankspaceContainer"">' +
									'<td id="ns1blankspaceReportingColumn1" style="width: 100px;" class="ns1blankspaceColumn1">' +
									ns1blankspace.xhtml.loading + '</td>' +
									'<td id="ns1blankspaceReportingColumn2" class="ns1blankspaceColumn2">' +
									'</td>' +
									'</tr>' +
									'</table>');				
					
					$('#ns1blankspaceReporting').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<table id="ns1blankspaceColumn1" class="">');
					
					aHTML.push('<tr><td id="tdns1blankspaceReport1" class="ns1blankspaceRow">No reports</td></tr>');	
									
					aHTML.push('</table>');					
					
					$('#ns1blankspaceReportingColumn1').html(aHTML.join(''));
					
				},

	new:		function ()
				{
					alert('You need to be system administrator to add a strucuture.  If you are a system adminstrator then click the setup gear toolbar icon.');
				}
}				
