/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

ns1blankspace.setup.structure = 
{
	data: 		{},

	init: 		function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 26;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'structure';
					ns1blankspace.viewName = 'Structures';
					
					ns1blankspace.app.set(oParam);
				},

	bind: 		function ()
				{
					$('#ns1blankspaceViewControlActionOptionsRemove').click(function(event)
					{
						ns1blankspace.setup.structure.remove();
					});
				},

	home: 		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspace">' +
										'<tr><td id="ns1blankspaceMostLikely" class="ns1blankspace">' +
										ns1blankspace.xhtml.loading +
										'</td></tr>' +
										'</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						var aHTML = [];
									
						aHTML.push('<table>' +
							'<tr><td><div id="ns1blankspaceViewSetupLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>' +
							'</table>');		

						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_STRUCTURE_SEARCH';
						oSearch.addField('reference,title');
						oSearch.sort('modifieddate', 'desc');
						oSearch.rows = 200;
						oSearch.getResults(function (data) {ns1blankspace.setup.structure.home(oParam, data)});
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
							ns1blankspace.setup.structure.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementId = aSearch[0];
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
										oSearch.method = 'SETUP_STRUCTURE_SEARCH';
										oSearch.addField('reference,title,status,statustext');
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext)
										oSearch.sort('modifieddate', 'desc');
										oSearch.getResults(function(data) {ns1blankspace.setup.structure.show(oParam, data)});
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
											ns1blankspace.search.start();
				
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_STRUCTURE_SEARCH';
											oSearch.addField('title');
											oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText)
											oSearch.sort('title', 'asc');
											oSearch.getResults(function(data) {ns1blankspace.setup.structure.search.process(oParam, data)});
										}
									};	
								},

					process: 	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var	iMaximumColumns = 1;
									
									ns1blankspace.search.stop();

									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
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

										$(ns1blankspace.xhtml.searchContainer).html(
											ns1blankspace.render.init(
											{
												html: aHTML.join(''),
												more: (oResponse.morerows == "true"),
												header: false
											}) 
										);	
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
											$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.setup.structure.search.send(event.target.id, 1);
										});

										ns1blankspace.render.bind(
										{
											columns: 'title',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.setup.structure.search.send
										});   
									}		
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

						aHTML.push('<tr><td id="ns1blankspaceControlElement" class="ns1blankspaceControl">' +
										'Elements' +
										'<div class="ns1blankspaceSubNote">Properties</div>' +
										'</td></tr>');

						aHTML.push('</table>');	

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlCategory" class="ns1blankspaceControl">' +
										'Categories</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlGrouping" class="ns1blankspaceControl">' +
										'Grouping</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlObject" class="ns1blankspaceControl">' +
										'Objects</td></tr>');

						aHTML.push('<tr><td>&nbsp;</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlData" class="ns1blankspaceControl">' +
										'Data</td></tr>');
					}	
					
					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainGrouping" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainCategory" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainElement" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainObject" class="ns1blankspaceControlMain"></div>');
				
					$('#ns1blankspaceMain').html(aHTML.join(''));
						
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.setup.structure.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.setup.structure.details();
					});
						
					$('#ns1blankspaceControlGrouping').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainGrouping', refresh: true});
						ns1blankspace.setup.structure.grouping.show();
					});

					$('#ns1blankspaceControlCategory').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainCategory', refresh: true});
						ns1blankspace.setup.structure.category.show();
					});

					$('#ns1blankspaceControlElement').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainElement', refresh: true});
						ns1blankspace.setup.structure.element.init();
					});

					$('#ns1blankspaceControlObject').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainObject', refresh: true});
						ns1blankspace.setup.structure.object.show();
					});

					$('#ns1blankspaceControlData').click(function(event)
					{
						ns1blankspace.structureData.init({structure: ns1blankspace.objectContext});
					});
				},

	show:		function (oParam, oResponse)
				{
					ns1blankspace.app.clean();
					ns1blankspace.setup.structure.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this structure.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						ns1blankspace.setup.structure.data.categories = undefined;
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.setup.structure.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.setup.structure.summary()'});
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
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Stucture ID</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryStuctureID" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.id +
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
										'Title' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsTitle" class="ns1blankspaceText">' +
										'</td></tr>');			
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						var aHTML = [];
							
						aHTML.push('<table class="ns1blankspaceColumn2">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Enabled' +
										'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Disabled' +
										'</td></tr>');	

						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioStatus"][value="2"]').attr('checked', true);	
						}
					}	
				},

	save: 		{
					send:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										ns1blankspace.status.working();
										
										var sData = '_=1';
										
										if (ns1blankspace.objectContext != -1)
										{
											sData += '&id=' + ns1blankspace.objectContext	
										}	
										
										if ($('#ns1blankspaceMainDetails').html() != '')
										{
											sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTitle').val());
											sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());	
										};
										
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data) {ns1blankspace.setup.structure.save.send(oParam, data)}
										});
										
									}
									else
									{			
										if (oResponse.status == 'OK')
										{	
											ns1blankspace.status.message('Saved');
											
											if (ns1blankspace.objectContext == -1)
											{
												ns1blankspace.objectContext = oResponse.id;
												ns1blankspace.inputDetected = false;

												var oData =
												{
													structure: ns1blankspace.objectContext,
													title: 'Default'
												};
													
												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_CATEGORY_MANAGE'),
													data: oData,
													dataType: 'json',
													success: function()
													{
														ns1blankspace.setup.structure.init({id: ns1blankspace.objectContext});
													}
												});
											}	
										}
										else
										{
											ns1blankspace.status.message('Could not save the structure!');
										}
									}
								}
				},

	grouping: 	{							
					show: 		function (oParam, oResponse)
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
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_STRUCTURE_DATA_GROUP_SEARCH';
										oSearch.addField('backgroundcolour,description,document,documenttext,groupingfactor,' +
															'maximumpoints,minimumpoints,structure,structuretext,textcolour,title,type,typetext');
										oSearch.addFilter('structure', 'EQUAL_TO', ns1blankspace.objectContext)
										oSearch.sort('minimumpoints', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.setup.structure.grouping.show(oParam, data)});
									}
									else
									{
										if (oActions != undefined)
										{
											var aHTML = [];
															
											aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceGroupingColumn1" class="ns1blankspaceColumn1Large">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspaceGroupingColumn2" class="ns1blankspaceColumn2Action"></td>' +
														'</tr>' +
														'</table>');					
												
											$('#ns1blankspaceMainGrouping').html(aHTML.join(''));
		
											var aHTML = [];
												
											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											if (oActions.add)
											{
												aHTML.push('<tr><td>' +
															'<span id="ns1blankspaceSetupStructureGroupingAdd" class="ns1blankspaceAction">Add</span>' +
															'</td></tr>');
											}
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceGroupingColumn2').html(aHTML.join(''));
										
											$('#ns1blankspaceSetupStructureGroupingAdd').button(
											{
												label: "Add"
											})
											.click(function()
											{
												 ns1blankspace.setup.structure.grouping.edit(oParam);
											})
										}	
									
										var aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">No grouping has been set up.</td></tr></table>');

											$('#ns1blankspaceGroupingColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceSetupStructureGrouping" class="ns1blankspace">');
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Title</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Minimum Points</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Maximum Points</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceSetupStructureGrouping_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																		this.title + '</td>');
																		
												aHTML.push('<td id="ns1blankspaceSetupStructureGrouping_minimumpoints-' + this.id + '" style="text-align:right;" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																		this.minimumpoints + '</td>');

												aHTML.push('<td id="ns1blankspaceSetupStructureGrouping_maximumpoints-' + this.id + '" style="text-align:right;" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																		this.maximumpoints + '</td>');
																								
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
													
												aHTML.push('<span id="ns1blankspaceSetupStructureGrouping_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
														
												aHTML.push('</td>');
																
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceGroupingColumn1').html(aHTML.join(''));
											
											$('#ns1blankspaceSetupStructureGrouping .ns1blankspaceRowRemove').button(
											{
												text: false,
												icons:
												{
													primary: "ui-icon-close"
												}
											})
											.click(function()
											{
												ns1blankspace.remove(
												{
													xhtmlElementID: this.id,
													method: 'SETUP_STRUCTURE_DATA_GROUP_MANAGE',
													ifNoneMessage: 'No grouping.'
												});

												//ns1blankspace.setup.structure.grouping.remove({xhtmlElementID: this.id});
											})
											.css('width', '15px')
											.css('height', '17px');
											
											$('#ns1blankspaceSetupStructureGrouping .ns1blankspaceRowSelect')
											.click(function()
											{
												ns1blankspace.setup.structure.grouping.edit({xhtmlElementID: this.id})
											});
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
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureGroupingTitle" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Minimum Points' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureGroupingMinimumPoints" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Maximum Points' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureGroupingMaximumPoints" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Grouping Factor' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureGroupingFactor" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Text Colour' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureGroupingTextColour" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Background Colour' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureGroupingBackgroundColour" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('</table>');					
										
										$('#ns1blankspaceGroupingColumn1').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr><td>' +
														'<span class="ns1blankspaceAction" style="width:70px;" id="ns1blankspaceSetupStructureGroupingSave">Save</span>' +
														'</td></tr>');
									
										aHTML.push('<tr><td>' +
														'<span class="ns1blankspaceAction" style="width:70px;" id="ns1blankspaceSetupStructureGroupingCancel">Cancel</span>' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceGroupingColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceSetupStructureGroupingSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											var oData =
											{
												structure: ns1blankspace.objectContext,
												id: sID,
												title: $('#ns1blankspaceSetupStructureGroupingTitle').val(),
												minimumpoints: $('#ns1blankspaceSetupStructureGroupingMinimumPoints').val(),
												maximumpoints: $('#ns1blankspaceSetupStructureGroupingMaximumPoints').val(),
												groupingfactor: $('#ns1blankspaceSetupStructureGroupingFactor').val(),
												textcolour: $('#ns1blankspaceSetupStructureGroupingTextColour').val(),
												backgroundcolour: $('#ns1blankspaceSetupStructureGroupingBackgroundColour').val()
											}	
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_DATA_GROUP_MANAGE'),
												data: oData,
												dataType: 'json',
												success: function()
												{
													ns1blankspace.setup.structure.grouping.show();
												}
											});
										});
										
										$('#ns1blankspaceSetupStructureGroupingCancel').button(
										{
											text: "Cancel"
										})
										.click(function() 
										{
											ns1blankspace.setup.structure.grouping.show();
										});
										
										if (sID != undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_STRUCTURE_DATA_GROUP_SEARCH';
											oSearch.addField('backgroundcolour,description,document,documenttext,groupingfactor,' +
																'maximumpoints,minimumpoints,structure,structuretext,textcolour,title,type,typetext');
											oSearch.addFilter('id', 'EQUAL_TO', sID)
											oSearch.sort('title', 'asc');
											oSearch.getResults(function(data) {ns1blankspace.setup.structure.grouping.edit(oParam, data)});
										}
										else
										{
											$('[name="radioDataType"][value="4"]').attr('checked', true);	
										}
									}
									else
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];
											$('#ns1blankspaceSetupStructureGroupingTitle').val(oObjectContext.title)
											$('#ns1blankspaceSetupStructureGroupingTitle').focus();
											$('#ns1blankspaceSetupStructureGroupingMinimumPoints').val(oObjectContext.minimumpoints)
											$('#ns1blankspaceSetupStructureGroupingMaximumPoints').val(oObjectContext.maximumpoints)
											$('#ns1blankspaceSetupStructureGroupingFactor').val(oObjectContext.groupingfactor)
											$('#ns1blankspaceSetupStructureGroupingTextColour').val(oObjectContext.textcolour)
											$('#ns1blankspaceSetupStructureGroupingBackgroundColour').val(oObjectContext.backgroundcolour);
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
										var sData = 'remove=1&id=' + sID;
										
										$.ajax(
										{
											type: 'DELETE',
											url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_DATA_GROUP_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data){ns1blankspace.setup.structure.grouping.remove(oParam, data)}
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
				
	category: 	{
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
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_STRUCTURE_CATEGORY_SEARCH';
										oSearch.addField( 'description,displayorder,id,structure,structuretext,title,type,typetext');
										oSearch.addFilter('structure', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(data) {ns1blankspace.setup.structure.category.show(oParam, data)});
									}
									else
									{
										if (oActions != undefined)
										{
											var aHTML = [];
												
											aHTML.push('<table class="ns1blankspaceContainer">' +
															'<tr class="ns1blankspaceContainer">' +
															'<td id="ns1blankspaceCategoryColumn1" class="ns1blankspaceColumn1Flexixble"></td>' +
															'<td id="ns1blankspaceCategoryColumn2" class="ns1blankspaceColumn2" style="width: 100px;"></td>' +
															'</tr>' + 
															'</table>');		

											$('#ns1blankspaceMainCategory').html(aHTML.join(''));
											
											var aHTML = [];

											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											if (oActions.add)
											{
												aHTML.push('<tr><td id="ns1blankspaceSetupStructureCategoryAdd" class="ns1blankspaceAction">' +
															'<span id="ns1blankspaceSetupStructureCategoryAdd">Add</span>' +
															'</td></tr>');
											}
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceCategoryColumn2').html(aHTML.join(''));
										
											$('#ns1blankspaceSetupStructureCategoryAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												 ns1blankspace.setup.structure.category.add(oParam);
											});
										}	
									
										var aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td valign="top">No categories</td></tr></table>');

											$('#ns1blankspaceCategoryColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceSetupStructureCategory" class="ns1blankspaceContainer">');
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Title</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceSetupStructureCategory_title-' + this.id + '" class="ns1blankspaceRow"' +
																' title="' + this.id + '">' +
																this.title + '</td>');
																		
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceSetupStructureCategoryoptions_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
												};	
													
												if (oOptions.view)
												{	
													aHTML.push('<span id="ns1blankspaceSetupStructureCategory_options_select-' + this.id + '" class="ns1blankspaceRowSelect"></span>');
												};	
													
												aHTML.push('</td>');
																
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceCategoryColumn1').html(aHTML.join(''));
											
											$('#ns1blankspaceSetupStructureCategory span.ns1blankspaceRowRemove').button( {
												text: false,
												icons: {
													primary: "ui-icon-close"
												}
											})
											.click(function()
											{
												ns1blankspace.remove(
												{
													xhtmlElementID: this.id,
													method: 'SETUP_STRUCTURE_CATEGORY_MANAGE',
													ifNoneMessage: 'No categories.'
												});

												//ns1blankspace.setup.structure.category.remove({xhtmlElementID: this.id});
											})
											.css('width', '15px')
											.css('height', '17px');
											
											$('#ns1blankspaceSetupStructureCategory span.ns1blankspaceRowSelect').button( {
												text: false,
												icons: {
													primary: "ui-icon-play"
												}
											})
											.click(function() {
												ns1blankspace.setup.structure.category.add({xhtmlElementID: this.id})
											})
											.css('width', '15px')
											.css('height', '17px');
										}
									}	
								},

					add:		function (oParam, oResponse)
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
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureCategoryTitle" class="ns1blankspaceText">' +
														'</td></tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceCategoryColumn1').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr><td>' +
														'<span class="ns1blankspaceAction" style="width:80px;" id="ns1blankspaceSetupStructureCategorySave">Save</span>' +
														'</td></tr>');
									
										aHTML.push('<tr><td>' +
														'<span class="ns1blankspaceAction" style="width:80px;" id="ns1blankspaceSetupStructureCategoryCancel">Cancel</span>' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceCategoryColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceSetupStructureCategorySave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											var sData = 'structure=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
											sData += '&id=' + ns1blankspace.util.fs(sID);
											sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceSetupStructureCategoryTitle').val());
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_CATEGORY_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function() {
													ns1blankspace.setup.structure.category.show();
												}
											});
										});
										
										$('#ns1blankspaceSetupStructureCategoryCancel').button(
										{
											text: "Cancel"
										})
										.click(function() 
										{
											ns1blankspace.show({selector: '#ns1blankspaceMainCategory'});
											ns1blankspace.setup.structure.category.show();
										});
										
										if (sID != undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_STRUCTURE_CATEGORY_SEARCH';
											oSearch.addField( 'description,displayorder,title,type,typetext');
											oSearch.addFilter('id', 'EQUAL_TO', sID);
											oSearch.getResults(function(data) {ns1blankspace.setup.structure.category.add(oParam, data)});
										}
										else
										{
											$('[name="radioDataType"][value="4"]').attr('checked', true);	
										}
									}
									else
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];
											$('#ns1blankspaceSetupStructureCategoryTitle').val(oObjectContext.title)
											$('#ns1blankspaceSetupStructureCategoryTitle').focus();
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
											url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_CATEGORY_MANAGE'),
											data: 'remove=1&id=' + ns1blankspace.util.fs(sID),
											dataType: 'json',
											success: function(data){ns1blankspace.setup.structure.category.remove(oParam, data)}
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
				
	element: 	{
					data: 		{},

					init:		function (oParam, oResponse)
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
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_STRUCTURE_CATEGORY_SEARCH';
										oSearch.addField('title');
										oSearch.addFilter('structure', 'EQUAL_TO', ns1blankspace.objectContext)
										oSearch.sort('title', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.setup.structure.element.init(oParam, data)});
									}
									else
									{
										var aHTML = [];

										ns1blankspace.setup.structure.element.data.categoryCount = oResponse.data.rows.length;
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td valign="top">No categories.</td></tr></table>');

											$('#ns1blankspaceMainElement').html(aHTML.join(''));
										}
										else
										{
											var aHTML = [];
									
											aHTML.push('<table class="ns1blankspaceContainer">' +
															'<tr class="ns1blankspaceContainer">')

											if (oResponse.data.rows.length == 1)
											{
												ns1blankspace.setup.structure.element.data.category = oResponse.data.rows[0].id;
												ns1blankspace.setup.structure.element.show({category: ns1blankspace.setup.structure.element.data.category});
											}
											else
											{	
												aHTML.push('<td id="ns1blankspaceSetupStructureElementColumnCategory" style="width:100px;padding-right:5px;font-size:0.875em;" class="ns1blankspaceColumn1"></td>')
											}

											aHTML.push('<td id="ns1blankspaceSetupStructureElementColumnElement1" style="width:175px;padding-right:5px;font-size:0.875em;" class="ns1blankspaceColumn2"></td>' +
															'<td id="ns1blankspaceSetupStructureElementColumnElement2" style="width:305px;padding-right:15px;font-size:0.875em;" class="ns1blankspaceColumn2"></td>' +
															'<td id="ns1blankspaceSetupStructureElementColumnElement3" class="ns1blankspaceColumn2"></td>' +
															'</tr>' +
															'</table>');					
											
											$('#ns1blankspaceMainElement').html(aHTML.join(''));

											var aHTML = [];

											aHTML.push('<table id="ns1blankspaceSetupStructureCategory" class="ns1blankspaceContainer">');
										
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceSetupStructureCategory_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
																' title="' + this.id + '">' +
																this.title + '</td>');
																		
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceSetupStructureElementColumnCategory').html(aHTML.join(''));
								
											$('#ns1blankspaceSetupStructureCategory td.ns1blankspaceRowSelect').click(function(event)
											{
												var sXHTMLElementID = event.target.id;
												var aID = sXHTMLElementID.split('-');
												
												ns1blankspace.setup.structure.element.show({category: aID[1]});
											});
										}
									}	
								},

					show:		function (oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.objectContext;
									var oOptions = {view: true, remove: true, automation: true};
									var oActions = {add: true};
									var iCategory;
									
									if (oParam != undefined)
									{
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.options != undefined) {oOptions = oParam.options}
										if (oParam.actions != undefined) {oActions = oParam.actions}
										if (oParam.category != undefined) {iCategory = oParam.category}
									}

									ns1blankspace.setup.structure.element.data.category = iCategory
										
									if (oResponse == undefined)
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_STRUCTURE_ELEMENT_SEARCH';
										oSearch.addField( 'backgroundcolour,caption,category,categorytext,datatype,datatypetext,' +
															'description,displayorder,hint,id,notes,notestype,notestypetext,' +
															'reference,structure,structuretext,textcolour,title,alias');
										oSearch.rows = 250;
										oSearch.addFilter('category', 'EQUAL_TO', iCategory);
										oSearch.getResults(function(data) {ns1blankspace.setup.structure.element.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
	
										aHTML.push('<table class="ns1blankspaceColumn2">');
											
										aHTML.push('<tr><td class="ns1blankspaceSub">' +
														'No element selected.' +
													'</td></tr>');

										aHTML.push('</table>');		
										
										$('#ns1blankspaceSetupStructureElementColumnElement2').html(aHTML.join(''));
											
										if (oActions != undefined)
										{	
											var aHTML = [];
												
											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											if (oActions.add)
											{
												aHTML.push('<tr><td>' +
															'<span class="ns1blankspaceAction" id="ns1blankspaceSetupStructureAdd">Add</span>' +
															'</td></tr>');
											}
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceSetupStructureElementColumnElement3').html(aHTML.join(''));
										
											$('#ns1blankspaceSetupStructureAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												 ns1blankspace.setup.structure.element.edit(oParam);
											});
										}	
									
										var aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td valign="top">No elements.</td></tr></table>');

											$('#ns1blankspaceSetupStructureElementColumnElement1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceSetupStructureElementColumnElement" ' +
															(ns1blankspace.setup.structure.element.data.categoryCount>1?'class="ns1blankspaceColumn2"':'') + '>');
										
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceSetupStructureElement_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
																' title="' + this.id + '">' +
																this.title + '</td>');				
																		
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
												
												if (oOptions.automation)
												{	
													aHTML.push('<span id="ns1blankspaceSetupStructureElement_options_view-' + this.id + '" class="ns1blankspaceRowAutomation"></span>');
												};	
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceSetupStructureElementoptions_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
												};	
													
												if (oOptions.view)
												{	
													aHTML.push('<span id="ns1blankspaceSetupStructureElement_options_view-' + this.id + '" class="ns1blankspaceRowView"></span>');
												};	
													
												aHTML.push('</td>');
																
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceSetupStructureElementColumnElement1').html(aHTML.join(''));
											
											if (oOptions.remove) 
											{
												$('#ns1blankspaceSetupStructureElementColumnElement span.ns1blankspaceRowRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function()
												{
													ns1blankspace.remove(
													{
														xhtmlElementID: this.id,
														method: 'SETUP_STRUCTURE_ELEMENT_MANAGE',
														ifNoneMessage: 'No elements.',
														minimumSiblings: 0
													});

													//ns1blankspace.setup.structure.element.remove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px')
											}
											
											$('#ns1blankspaceSetupStructureElementColumnElement .ns1blankspaceRowSelect').click(function()
											{
												oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', this.id);
												ns1blankspace.setup.structure.element.edit(oParam);
											})
											.css('width', '15px')
											.css('height', '17px')
											
											if (oOptions.automation) 
											{
												$('#ns1blankspaceSetupStructureElementColumnElement span.ns1blankspaceRowAutomation').button(
												{
													text: false,
													icons:
													{
														primary: "ui-icon-gear"
													}
												})
												.click(function()
												{
													ns1blankspace.setup.structure.automation.show({xhtmlElementID: this.id})
												})
												.css('width', '15px')
												.css('height', '17px')
											}	
										}
									}	
								},

					edit:		function (oParam, oResponse)
								{
									var sID; 
									var iCategory;
									
									if (oResponse == undefined)
									{
										var sXHTMLElementID;

										if (oParam != undefined)
										{
											if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
											if (oParam.category != undefined) {iCategory = oParam.category}
										}
										
										if (sXHTMLElementID != undefined)
										{
											var aXHTMLElementID = sXHTMLElementID.split('-');
											var sID = aXHTMLElementID[1];
										}	
									
										ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;
									
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Title' +
														'</td></tr>' +
														'<tr class="ns1blankspaceTextMulti">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<textarea rows="3" cols="35" id="ns1blankspaceSetupStructureElementTitle" class="ns1blankspaceTextMultiSmall" style="height: 50px;"></textarea>' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Caption' +
														'</td></tr>' +
														'<tr class="ns1blankspaceTextMulti">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<textarea rows="3" cols="35" id="ns1blankspaceSetupStructureElementCaption" class="ns1blankspaceTextMultiSmall" style="height: 50px;"></textarea>' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Reference' +
														'</td></tr>' +
														'<tr class="ns1blankspaceTextMulti">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<input id="ns1blankspaceSetupStructureElementReference" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Alias&nbsp;<div class="ns1blankspaceSubNote">(must start with "se" and be unique)</div>' +
														'</td></tr>' +
														'<tr class="ns1blankspaceTextMulti">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<input id="ns1blankspaceSetupStructureElementAlias" class="ns1blankspaceText">' +
														'</td></tr>');
										
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Description' +
														'</td></tr>' +
														'<tr class="ns1blankspaceTextMulti">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<textarea rows="3" cols="35" id="ns1blankspaceSetupStructureElementDescription' +
														 			ns1blankspace.counter.editor + '" data-editorcount="' + ns1blankspace.counter.editor + 
																	'" class="ns1blankspaceTextMultiLarge" style="height: 100px;"></textarea>' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Hint' +
														'</td></tr>' +
														'<tr class="ns1blankspaceTextMulti">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<input id="ns1blankspaceSetupStructureElementHint" class="ns1blankspaceText">' +
														'</td></tr>');
																		
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Category' +
														'</td></tr>' +
														'<tr class="ns1blankspaceRadio">' +
														'<td class="ns1blankspaceRadio">');
									
										if (ns1blankspace.setup.structure.data == undefined) {ns1blankspace.setup.structure.data = {}};

										if (ns1blankspace.setup.structure.data.categories == undefined)
										{	
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_STRUCTURE_CATEGORY_SEARCH';
											oSearch.addField( 'title');
											oSearch.addFilter('structure', 'EQUAL_TO', ns1blankspace.objectContext);
											oSearch.async = false;
											oSearch.getResults(function(oResponse)
											{
												ns1blankspace.setup.structure.data.categories = oResponse.data.rows;
											});
										}			
										
										$.each(ns1blankspace.setup.structure.data.categories, function()
										{
											if (iCategory == undefined) {iCategory = this.id}
											aHTML.push('<input type="radio" id="radioCategory' + this.id + '" name="radioCategory" value="' + this.id + '"/>' +
																this.title + '<br />');				
										});

										aHTML.push('</td></tr>');
										
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Data Type' +
														'</td></tr>' +
														'<tr class="ns1blankspaceRadio">' +
														'<td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioDataType4" name="radioDataType" value="4"/>Text (Single Line)' +
														'<br /><input type="radio" id="radioDataType1" name="radioDataType" value="1"/>Text (Multi Line)' +
														'<br /><input type="radio" id="radioDataType3" name="radioDataType" value="3"/>Date' +
														'<br /><input type="radio" id="radioDataType2" name="radioDataType" value="2"/>Select / Choice (Single)' +
														'<br /><input type="radio" id="radioDataType6" name="radioDataType" value="6"/>Select / Choice (Multi)' +
														'<br /><input type="radio" id="radioDataType5" name="radioDataType" value="5"/>Numeric' +
														'</td></tr>');
													
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Text Colour' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureElementTextColour" class="ns1blankspaceText">' +
														'</td></tr>');			
															
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Background Colour' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureElementBackgroundColour" class="ns1blankspaceText">' +
														'</td></tr>');
																		
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Display Order' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureElementDisplayOrder" class="ns1blankspaceText">' +
														'</td></tr>');
																			
										aHTML.push('<tr class="ns1blankspaceText">' +
														'<td id="ns1blankspaceSetupStructureElementOptions" class="ns1blankspaceText">' +
														'</td></tr>');
																																		
										aHTML.push('</table>');					
										
										$('#ns1blankspaceSetupStructureElementColumnElement2').html(aHTML.join(''));
										
										if (ns1blankspace.option.richTextEditing)
										{
											$('#ns1blankspaceSetupStructureElementDescription' + ns1blankspace.counter.editor).attr('data-id', sID);
											$('#ns1blankspaceSetupStructureElementDescription' + ns1blankspace.counter.editor).attr('data-category', iCategory);

											ns1blankspace.format.editor.init(
											{
												selector: '#ns1blankspaceSetupStructureElementDescription' + ns1blankspace.counter.editor,
												simple: true,
												onInit: ns1blankspace.setup.structure.element.search,
												height: '200px'
											});
										}
									
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr><td>' +
														'<span class="ns1blankspaceAction" id="ns1blankspaceSetupStructureElementSave">' +
														'Save</span></td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceSetupStructureElementColumnElement3').html(aHTML.join(''));
										
										$('#ns1blankspaceSetupStructureElementSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											ns1blankspace.status.working();

											var sData = 'structure=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
											sData += '&id=' + ns1blankspace.util.fs(sID);
											sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceSetupStructureElementTitle').val());
											sData += '&reference=' + ns1blankspace.util.fs($('#ns1blankspaceSetupStructureElementReference').val());
											sData += '&caption=' + ns1blankspace.util.fs($('#ns1blankspaceSetupStructureElementCaption').val());
											sData += '&alias=' + ns1blankspace.util.fs($('#ns1blankspaceSetupStructureElementAlias').val());
											sData += '&datatype=' + ns1blankspace.util.fs($('input[name="radioDataType"]:checked').val());
											sData += '&category=' + ns1blankspace.util.fs($('input[name="radioCategory"]:checked').val());
											sData += '&textcolour=' + ns1blankspace.util.fs($('#ns1blankspaceSetupStructureElementTextColour').val());
											sData += '&backgroundcolour=' + ns1blankspace.util.fs($('#ns1blankspaceSetupStructureElementBackgroundColour').val());
											sData += '&displayorder=' + ns1blankspace.util.fs($('#ns1blankspaceSetupStructureElementDisplayOrder').val());
											sData += '&description=' + ns1blankspace.util.fs(tinyMCE.get('ns1blankspaceSetupStructureElementDescription' + ns1blankspace.counter.editor).getContent());
											sData += '&hint=' + ns1blankspace.util.fs($('#ns1blankspaceSetupStructureElementHint').val());

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_ELEMENT_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(oResponse)
												{
													if (oResponse.status == 'OK')
													{	
														$('#ns1blankspaceSetupStructureElement_title-' + sID).html($('#ns1blankspaceSetupStructureElementTitle').val());
														ns1blankspace.status.message('Element has been saved.');
														ns1blankspace.setup.structure.element.show(oParam);
													}	
												}
											});
										});
									}
									else
									{
										/*
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];

											$('#ns1blankspaceSetupStructureElementTitle').val((oObjectContext.title).formatXHTML());
											$('#ns1blankspaceSetupStructureElementReference').val(oObjectContext.reference);
											
											var sHTML = (oObjectContext.description).formatXHTML();
											tinyMCE.get('ns1blankspaceSetupStructureElementDescription' + ns1blankspace.counter.editor).setContent(sHTML)
											
											$('[name="radioDataType"][value="' + oObjectContext.datatype + '"]').attr('checked', true);
											$('[name="radioCategory"][value="' + oObjectContext.category + '"]').attr('checked', true);
											$('#ns1blankspaceSetupStructureElementTextColour').val(oObjectContext.textcolour)
											$('#ns1blankspaceSetupStructureElementBackgroundColour').val(oObjectContext.backgroundcolour)
											$('#ns1blankspaceSetupStructureElementDisplayOrder').val(oObjectContext.displayorder)	
											$('#ns1blankspaceSetupStructureElementTitle').focus();
											ns1blankspace.setup.structure.element.options.show({structureElementID: oObjectContext.id});
										}
										*/
									}
								},

					search: 	function (oEditor, oResponse)
								{
									var sID = $('#' + oEditor.id).attr('data-id');
									var iCategory = $('#' + oEditor.id).attr('data-category');

									if (oResponse == undefined)
									{	
										if (sID != undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_STRUCTURE_ELEMENT_SEARCH';
											oSearch.addField( 'backgroundcolour,caption,category,categorytext,datatype,datatypetext,description,displayorder,' +
																	'hint,notes,notestype,notestypetext,reference,structure,structuretext,textcolour,title,alias');
											oSearch.addFilter('id', 'EQUAL_TO', sID);
											oSearch.getResults(function(data) {ns1blankspace.setup.structure.element.search(oEditor, data)});
										}
										else
										{
											$('#ns1blankspaceSetupStructureElementDescription' + ns1blankspace.counter.editor).attr('data-category');
											$('[name="radioDataType"][value="4"]').attr('checked', true);
											$('[name="radioCategory"][value="' + iCategory + '"]').attr('checked', true);	
										}
									}
									else
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];

											$('#ns1blankspaceSetupStructureElementTitle').val((oObjectContext.title).formatXHTML());
											$('#ns1blankspaceSetupStructureElementReference').val(oObjectContext.reference);
											$('#ns1blankspaceSetupStructureElementAlias').val(oObjectContext.alias);
											$('#ns1blankspaceSetupStructureElementHint').val(oObjectContext.hint);
											$('#ns1blankspaceSetupStructureElementCaption').val(oObjectContext.caption);

											var sHTML = (oObjectContext.description).formatXHTML();
											tinyMCE.get('ns1blankspaceSetupStructureElementDescription' + ns1blankspace.counter.editor).setContent(sHTML);
											
											$('[name="radioDataType"][value="' + oObjectContext.datatype + '"]').attr('checked', true);
											$('[name="radioCategory"][value="' + oObjectContext.category + '"]').attr('checked', true);
											$('#ns1blankspaceSetupStructureElementTextColour').val(oObjectContext.textcolour)
											$('#ns1blankspaceSetupStructureElementBackgroundColour').val(oObjectContext.backgroundcolour)
											$('#ns1blankspaceSetupStructureElementDisplayOrder').val(oObjectContext.displayorder)	
											$('#ns1blankspaceSetupStructureElementTitle').focus();

											ns1blankspace.setup.structure.element.options.show({structureElementID: oObjectContext.id});
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
											url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_ELEMENT_MANAGE'),
											data: 'remove=1&id=' + sID,
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.setup.structure.element.remove(oParam, data)
											}
										});
									}	
									else
									{
										if (oResponse.status == 'OK')
										{
											$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
										}	
									}	
									
								},

					options: 	{			
									show:		function (oParam, oResponse)
												{
													var aHTML = [];
													
													
													var iStructureElementID = -1;

													if (oParam != undefined)
													{
														if (oParam.structureElementID != undefined) {iStructureElementID = oParam.structureElementID}
													}
													
													if (oResponse == undefined)
													{	
														var oSearch = new AdvancedSearch();
														oSearch.method = 'SETUP_STRUCTURE_ELEMENT_OPTION_SEARCH';
														oSearch.addField('title,points');
														oSearch.addFilter('element', 'EQUAL_TO', iStructureElementID);
														oSearch.rows = 100;
														oSearch.getResults(function(data) {ns1blankspace.setup.structure.element.options.show(oParam, data)});
													}	
													else
													{	
														var aHTML = [];

														aHTML.push('<table id="ns1blankspaceElementOptions" style="width:100%;"' +
																			' data-structureElement="' + iStructureElementID + '"' +
																			' data-method="SETUP_STRUCTURE_ELEMENT_OPTION">');
										
														aHTML.push('<tr class="ns1blankspaceRow">');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">Choices</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">Points</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right"><span id="ns1blankspaceElementOptionAdd">Add</span></td>');
														aHTML.push('</tr>');
																
														if (oResponse.data.rows.length == 0)
														{
															//aHTML.push('<tr><td class="ns1blankspaceNothing">No choices.</td></tr>');
														}
														else
														{
															$.each(oResponse.data.rows, function()
															{
																aHTML.push('<tr class="ns1blankspaceRow">');
																		
																aHTML.push('<td id="td_ns1blankspaceElementOption_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceElementOption" style="width:100%">' +
																				this.title + '</td>');
																	
																if (this.points == '')
																{
																	aHTML.push('<td id="td_ns1blankspaceElementOption_points-' + this.id + '" class="ns1blankspaceRow ns1blankspaceElementOption" style="width:40px;">' +
																					'</td>');
																}	
																else
																{		
																	aHTML.push('<td id="td_ns1blankspaceElementOption_points-' + this.id + '" class="ns1blankspaceRow ns1blankspaceElementOption" style="width:40px;">' +
																				this.points + '</td>');
																}							
															
																aHTML.push('<td style="width:23px;text-align:right;" id="td_ElementOption_delete-' + this.id + 
																				'" class="ns1blankspaceRowRemove"></td>');
															
																aHTML.push('</tr>');
															});
												    	}

														aHTML.push('</table>');

														$('#ns1blankspaceSetupStructureElementOptions').html(aHTML.join(''));
														
														$('#ns1blankspaceElementOptionAdd').button(
														{
															text: false,
															icons:
															{
																primary: "ui-icon-plus"
															}
														})
														.click(function()
														{
															ns1blankspace.setup.structure.element.options.add()
														})
														.css('width', '15px')
														.css('height', '20px');
														
														$('#ns1blankspaceElementOptions td.ns1blankspaceElementOption').click(function(event)
														{
															ns1blankspace.setup.structure.element.options.edit.start(event.target.id);
														});
													
														$('#ns1blankspaceElementOptions .ns1blankspaceRowRemove').unbind('click');

														$('#ns1blankspaceElementOptions .ns1blankspaceRowRemove').button(
														{
															text: false,
															 icons: {
																 primary: "ui-icon-close"
															}
														})
														.click(function()
														{
															ns1blankspace.remove(
															{
																xhtmlElementID: this.id,
																method: 'SETUP_STRUCTURE_ELEMENT_OPTION_MANAGE',
																ifNoneMessage: 'No options.'
															});
														})
														.css('width', '15px')
														.css('height', '20px');
													}	
												},

									add:		function ()
												{
													var aHTML = [];
													
													aHTML.push('<tr class="ns1blankspaceRow">');
																		
													aHTML.push('<td id="td_ns1blankspaceElementOption_title-" class="ns1blankspaceRow ns1blankspacedElementOption"></td>');
													
													aHTML.push('<td id="td_ns1blankspaceElementOption_points-" class="ns1blankspaceRow ns1blankspacedElementOption" style="width:40px;">' +
																					'</td>');

													aHTML.push('<td style="width:23px;text-align:right;" id="ns1blankspaceElementOption_remove-' + 
																	'" class="ns1blankspaceRowRemove"></td>');
													
													aHTML.push('</tr>');
															
													$('#ns1blankspaceElementOptions tr:first').after(aHTML.join(''));	
													$('#ns1blankspaceViewControlNew').button({disabled: true});
													$('#ns1blankspaceElementOptionAdd').button({disabled: true});
													
													ns1blankspace.setup.structure.element.options.edit.start("td_ns1blankspaceElementOption_title-")
												},

									remove:		function (sXHTMLElementId)
												{
													var aSearch = sXHTMLElementId.split('-');
													var sElementId = aSearch[0];
													var sSearchContext = aSearch[1];
													
													if (confirm('Are you sure?'))
													{
														var sData = 'remove=1&id=' + sSearchContext;
																	
														$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_ELEMENT_OPTION_MANAGE'),
																data: sData,
																dataType: 'json',
																success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
															});
													}
												},

									edit: 		{
													start:		function (sElementID)
																{
																	var aSearch = sElementID.split('-');
																	var sActionElementID = '#' + aSearch[0] + '-options-' + aSearch[2];

																	var sHTML = $('#' + sElementID).html();
																	
																	var sElementInputID = sElementID.replace('td', 'input');
																	
																	sHTML = '<input style="width:100%;" id="' + sElementInputID + '" class="ns1blankspaceValue" ' +
																							'value="' + sHTML + '">'
																	
																	$('#' + sElementID).html(sHTML);
																	$('#' + sElementInputID).focus();
																	
																	$('#' + sElementInputID).focusout(function(event)
																	{
																		ns1blankspace.setup.structure.element.options.edit.stop(sElementID);
																	});
																},

													stop:		function (sElementID)
																{		
																	var aSearch = sElementID.split('-');
																	var sHTML = $('#' + sElementID.replace('td', 'input')).val();

																	$('#' + sElementID).html(sHTML);

																	ns1blankspace.setup.structure.element.options.edit.save(sElementID);
																},

													save:		function (sElementId)
																{
																	var aElement = sElementId.split('-');
																	var sData = 'id=' + aElement[1];

																	sData += '&element=' + $('#ns1blankspaceElementOptions').attr('data-structureElement');
																	sData += '&title=' + ns1blankspace.util.fs($('#td_ns1blankspaceElementOption_title-' + aElement[1]).html());
																	sData += '&points=' + ns1blankspace.util.fs($('#td_ns1blankspaceElementOption_points-' + aElement[1]).html());

																	if (aElement[1] == '' && $('#' + sElementId).html() == '')
																	{
																		$('#ns1blankspaceElementOption tr:first').next().fadeOut(500);	
																		$('#ns1blankspaceViewControlNew').button({disabled: false});
																		$('#ns1blankspaceElementOptionAdd').button({disabled: false});
																	}
																	else
																	{
																		$.ajax(
																		{
																			type: 'POST',
																			url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_ELEMENT_OPTION_MANAGE'),
																			data: sData,
																			dataType: 'json',
																			success: function(data) 
																					{
																						if (data.notes == 'saved')
																						{
																							$('#ns1blankspaceElementOption_title-').attr('id','ns1blankspaceElementOption_title-' + data.id);
																							$('#ns1blankspaceElementOption_points-').attr('id','ns1blankspaceElementOption_points-' + data.id);
																							
																							$('td.ns1blankspaceElementOption').unbind('click');
																								
																							$('td.ns1blankspaceElementOption').click(function(event)
																								{
																									ns1blankspace.setup.structure.element.options.edit.start(event.target.id);
																								});

																							$('#ns1blankspaceElementOption_remove-').attr('id','ns1blankspaceElementOption_remove-' + data.id);
																							
																							$('#ns1blankspaceElementOptions .ns1blankspaceRowRemove').button({
																									text: false,
																									 icons: {
																										 primary: "ui-icon-close"
																									}
																								})
																								.click(function()
																								{
																									ns1blankspace.remove(
																									{
																										xhtmlElementID: this.id,
																										method: 'SETUP_STRUCTURE_ELEMENT_OPTION_MANAGE',
																										ifNoneMessage: 'No options.'
																									});
																								})
																								.css('width', '15px')
																								.css('height', '20px');
																						}

																						ns1blankspace.status.message('Saved')
																						$('#ns1blankspaceViewControlNew').button({disabled: false});
																						$('#ns1blankspaceElementOptionAdd').button({disabled: false});
																					}
																		});
																	}			
																}
												}				
								}
				},				

	automation: {
					show: 		function (oParam, oResponse)
								{
									var sXHTMLElementID;	
									var iObjectContext = ns1blankspace.objectContext;
									var oOptions = {view: true, remove: true};
									var oActions = {add: true};
									var iElementID;
									
									if (oParam != undefined)
									{
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.options != undefined) {oOptions = oParam.options}
										if (oParam.actions != undefined) {oActions = oParam.actions}
										if (oParam.element != undefined) {iElementID = oParam.element}
									}		
									
									if (sXHTMLElementID != undefined)
									{
										var aXHTMLElementID = sXHTMLElementID.split('-');
										iElementID = aXHTMLElementID[1];
										$.extend(true, oParam, {element: iElementID});
									}		
										
									if (oResponse == undefined)
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_STRUCTURE_AUTOMATION_SEARCH';
										oSearch.addField('element,structure,backgroundcolour,daystocomplete,element,elementtext,' +
															'maximumpoints,minimumpoints,notes,severity,severitytext,status,statustext,structure,structuretext,' +
															'textcolour,title,type,typetext,category,categorytext');
										oSearch.sort('title', 'asc');
										oSearch.addFilter('element', 'EQUAL_TO', iElementID);
										oSearch.rows = 100;
										oSearch.getResults(function(data) {ns1blankspace.setup.structure.automation.show(oParam, data)});
									}
									else
									{
										if (oActions != undefined)
										{
											var aHTML = [];
														
											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											if (oActions.add)
											{
												aHTML.push('<tr><td class="ns1blankspaceAction">' +
															'<span id="ns1blankspaceSetupStructureAutomationAdd">Add</span>' +
															'</td></tr>');
											}
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceSetupStructureElementColumnElement3').html(aHTML.join(''));
										
											$('#ns1blankspaceSetupStructureAutomationAdd').button(
											{
												label: "Add"
											})
											.click(function()
											{
												 ns1blankspace.setup.structure.automation.edit({element: iElementID});
											})
											
										}	
									
										var aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table class="ns1blankspaceColumn2"><tr><td class="ns1blankspaceNothing">No automation set up.</td></tr></table>');

											$('#ns1blankspaceSetupStructureElementColumnElement2').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceSetupStructureAutomation" class="ns1blankspaceColumn2">');
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Automation</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Min.</td>')
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Max.</td>')
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceSetupStructureAutomation_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																		this.title + '</td>');

												aHTML.push('<td id="ns1blankspaceSetupStructureAutomation_minimumpoints-' + this.id + '" class="ns1blankspaceRow">' +
																		this.minimumpoints + '</td>');

												aHTML.push('<td id="ns1blankspaceSetupStructureAutomation_maximumpoints-' + this.id + '" class="ns1blankspaceRow">' +
																		this.maximumpoints + '</td>');
																		
												aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceSetupStructureCategoryoptions_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
												};	
		
												aHTML.push('</td>');
																
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceSetupStructureElementColumnElement2').html(aHTML.join(''));
											
											if (oOptions.remove) 
											{
												$('#ns1blankspaceSetupStructureAutomation span.ns1blankspaceRowRemove').button(
												{
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspace.setup.structure.automation.remove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px');
											}
											
											if (oOptions.view) 
											{
												$('#ns1blankspaceSetupStructureAutomation td.ns1blankspaceRowSelect')
												.click(function()
												{
													ns1blankspace.setup.structure.automation.edit({xhtmlElementID: this.id, element: iElementID})
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
									var iElementID;
									
									if (oResponse == undefined)
									{
										var sXHTMLElementID;

										if (oParam != undefined)
										{
											if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
											if (oParam.element != undefined) {iElementID = oParam.element}
										}
										
										if (sXHTMLElementID != undefined)
										{
											var aXHTMLElementID = sXHTMLElementID.split('-');
											var sID = aXHTMLElementID[1];
										}	
									
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2">');
										
										aHTML.push('<tr class="ns1blankspaceCaption">');
										aHTML.push('<td class="ns1blankspaceHeaderCaption">Automation (Issue creation)</td>');
										aHTML.push('</tr>');
													
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Title' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureAutomationTitle" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Minimum Points' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureAutomationMinimumPoints" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Maximum Points' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureAutomationMaximumPoints" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Background Colour' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureAutomationBackgroundColour" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Text Colour' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureAutomationTextColour" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Severity' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioSeverity1" name="radioSeverity" value="1"/>Critical' +
														'<br /><input type="radio" id="radioSeverity2" name="radioSeverity" value="2"/>High' +
														'<br /><input type="radio" id="radioSeverity3" name="radioSeverity" value="3"/>Medium' +
														'<br /><input type="radio" id="radioSeverity4" name="radioSeverity" value="4"/>Low' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Category' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureAutomationCategory" class="ns1blankspaceSelect"' +
															' data-method="SETUP_ISSUE_TYPE_CATEGORY_SEARCH">' +
														'</td></tr>');	

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Type' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureAutomationType" class="ns1blankspaceSelect"' +
															' data-method="SETUP_ISSUE_TYPE_SEARCH"' +
															' data-parent="ns1blankspaceSetupStructureAutomationCategory"' +
															' data-parent-search-id="category">' +
														'</td></tr>');	

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Notes' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<textarea rows="5" cols="35" id="ns1blankspaceSetupStructureAutomationNotes" class="ns1blankspaceTextMulti"></textarea>' +
														'</td></tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceSetupStructureElementColumnElement2').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr><td>' +
														'<span class="ns1blankspaceAction" id="ns1blankspaceSetupStructureAutomationSave">Save</span>' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceSetupStructureElementColumnElement3').html(aHTML.join(''));
										
										$('#ns1blankspaceSetupStructureAutomationSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											var oData =
											{
												id: sID,
												structure: ns1blankspace.objectContext,
												element: iElementID,
												title: $('#ns1blankspaceSetupStructureAutomationTitle').val(),
												minimumpoints: $('#ns1blankspaceSetupStructureAutomationMinimumPoints').val(),
												maximumpoints: $('#ns1blankspaceSetupStructureAutomationMaximumPoints').val(),
												backgroundcolour: $('#ns1blankspaceSetupStructureAutomationBackgroundColour').val(),
												textcolour: $('#ns1blankspaceSetupStructureAutomationTextColour').val(),
												notes: $('#ns1blankspaceSetupStructureAutomationNotes').val(),
												severity: $('[name="radioSeverity"]:checked').val(),
												category: $('#ns1blankspaceSetupStructureAutomationCategory').attr('data-id'),
												type: $('#ns1blankspaceSetupStructureAutomationType').attr('data-id')
											}	
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_AUTOMATION_MANAGE'),
												data: oData,
												dataType: 'json',
												success: function()
												{
													ns1blankspace.setup.structure.automation.show({element: iElementID});
												}
											});
										});
										
										if (sID != undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_STRUCTURE_AUTOMATION_SEARCH';
											oSearch.addField('element,structure,backgroundcolour,daystocomplete,element,elementtext,' +
																'maximumpoints,minimumpoints,notes,severity,severitytext,status,statustext,structure,structuretext,' +
																'textcolour,title,type,typetext,category,categorytext');
											oSearch.addFilter('id', 'EQUAL_TO', sID);
											oSearch.rows = 1;
											oSearch.getResults(function(data) {ns1blankspace.setup.structure.automation.edit(oParam, data)});
										}
										else
										{
											$('[name="radioSeverity"][value="1"]').attr('checked', true);	
										}
									}
									else
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];

											$('#ns1blankspaceSetupStructureAutomationTitle').val(oObjectContext.title);
											$('#ns1blankspaceSetupStructureAutomationMinimumPoints').val(oObjectContext.minimumpoints);
											$('#ns1blankspaceSetupStructureAutomationMaximumPoints').val(oObjectContext.maximumpoints);
											$('#ns1blankspaceSetupStructureAutomationBackgroundColour').val(oObjectContext.backgroundcolour);
											$('#ns1blankspaceSetupStructureAutomationTextColour').val(oObjectContext.textcolour);
											$('#ns1blankspaceSetupStructureAutomationNotes').val(oObjectContext.notes);
											$('[name="radioSeverity"][value="' + oObjectContext.severity + '"]').attr('checked', true);
											$('#ns1blankspaceSetupStructureAutomationCategory').val(oObjectContext.categorytext);
											$('#ns1blankspaceSetupStructureAutomationCategory').attr('data-id', oObjectContext.category);
											$('#ns1blankspaceSetupStructureAutomationType').val(oObjectContext.typetext);
											$('#ns1blankspaceSetupStructureAutomationType').attr('data-id', oObjectContext.type);

											$('#ns1blankspaceSetupStructureAutomationTitle').focus();
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
											url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_AUTOMATION_MANAGE'),
											data: 'remove=1&id=' + sID,
											dataType: 'json',
											success: function(data){ns1blankspace.setup.structure.automation.remove(oParam, data)}
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

	object: 	{			
					show:		function (oParam, oResponse)
								{
									var aHTML = [];
															
									aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceObjectColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
														'<td id="ns1blankspaceObjectColumn2" class="ns1blankspaceColumn2" style="width:250px;"></td>' +
														'</tr>' + 
														'</table>');
			
									$('#ns1blankspaceMainObject').html(aHTML.join(''));	

									if (oResponse == undefined)
									{
										$('#ns1blankspaceObjectColumn1').html(ns1blankspace.xhtml.loading);

										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_STRUCTURE_OBJECT_LINK_SEARCH';
										oSearch.addField('objecttext,categorytext,category,object');
										oSearch.addFilter('structure', 'EQUAL_TO', ns1blankspace.objectContext)
										oSearch.rows = 50;
										oSearch.sort('categorytext', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.setup.structure.object.show(oParam, data)})	
									}
									else
									{
										var aHTML = [];
									
										aHTML.push('<table class="ns1blankspaceColumn2">' +
														'<tr><td><span class="ns1blankspaceAction" id="ns1blankspaceSetupStructureObjectAdd">' +
														'Add Object</span></td></tr>' +
														'</table>');					
										
										$('#ns1blankspaceObjectColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceSetupStructureObjectAdd').button(
										{
											label: "Add Object"
										})
										.click(function() {
											ns1blankspace.container.position({xhtmlElementID: 'ns1blankspaceSetupStructureObjectAdd', leftOffset: -252, topOffset: -42});
											ns1blankspace.setup.structure.object.add(oParam);
										})
										.css('width', '75px');

										var aHTML = [];
										var h = -1;	
												
										aHTML.push('<table class="ns1blankspace" id="ns1blankspaceSetupStructureObject">');
								
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<tr><td class="ns1blankspaceNothing">' +
															'No objects linked to this structure.</td></tr>');
										}
										else
										{
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Category</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Object</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');

											$(oResponse.data.rows).each(function()
											{
												aHTML.push('<tr id="ns1blankspaceObject" class="ns1blankspaceRow">');
												
												aHTML.push('<td id="ns1blankspaceObject_category-' + this.id + '" class="ns1blankspaceRow">' +
																		this.categorytext + '</td>');

												aHTML.push('<td id="ns1blankspaceObject_object-' + this.id + '" class="ns1blankspaceRow">' +
																		this.objecttext + '</td>');

												aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
																'<span id="ns1blankspaceObject_options_remove-' + this.id + '-' + this.category + '" class="ns1blankspaceRowRemove"></span>' +
																'</td>');	

												aHTML.push('</tr>');
											});
										}

										aHTML.push('</table>');
											
										$('#ns1blankspaceObjectColumn1').html(aHTML.join(''));

										$('#ns1blankspaceSetupStructureObject .ns1blankspaceRowRemove').button(
										{
											text: false,
										 	icons: {primary: "ui-icon-close"}
										})
										.click(function()
										{
											ns1blankspace.remove(
											{
												xhtmlElementID: this.id,
												method: 'SETUP_STRUCTURE_OBJECT_LINK_MANAGE',
												ifNoneMessage: 'No linked objects.'
											});

											//ns1blankspace.setup.structure.object.remove(this.id)
										})
										.css('width', '15px')
										.css('height', '20px');
									}
								},

					add:		function (oParam, oResponse)
								{
									var iCategory;

									if (oParam != undefined)
									{
										if (oParam.category != undefined) {iCategory = oParam.category}
									}	
									else
									{
										oParam = {}
									}
										
									if (iCategory == undefined)
									{
										
										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_STRUCTURE_CATEGORY_SEARCH';
											oSearch.addField( 'title');
											oSearch.addFilter('structure', 'EQUAL_TO', ns1blankspace.objectContext);
											oSearch.getResults(function(data) {ns1blankspace.setup.structure.object.add(oParam, data)}) 
										}
										else
										{
											var aHTML = [];
											
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceNothing">' +
																'No categories.<br /><br />Need at least one category to link to.</td></tr></table>');

												$(ns1blankspace.xhtml.container).html(aHTML.join(''));
												$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
											}
											else
											{
												aHTML.push('<table id="ns1blankspaceObjectAddCategories" class="ns1blankspaceSearchMedium">');
												
												$.each(oResponse.data.rows, function()
												{	
													aHTML.push('<tr class="ns1blankspaceRow">');
													
													aHTML.push('<td id="ns1blankspaceObjectAddCategories_title-' + this.id + '" class="ns1blankspaceRowSelect">' +
																			this.title + '</td>');
													
													aHTML.push('</tr>');
												});
												
												aHTML.push('</table>');

												$(ns1blankspace.xhtml.container).html(aHTML.join(''));
												$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
												
												$('#ns1blankspaceObjectAddCategories td.ns1blankspaceRowSelect').click(function(event)
												{
													oParam.category = (event.target.id).split('-')[1];
													ns1blankspace.setup.structure.object.add(oParam);
												});
											}
										}	
									}
									else
									{
										var aHTML = [];
										
										aHTML.push('<table id="ns1blankspaceObjectAddObjects" class="ns1blankspaceSearchMedium">');
																				
										aHTML.push('<tr><td id="ns1blankspaceObjectAddCategories_title-' + iCategory + '-32" class="ns1blankspaceRowSelect">' +
																'Person</td></tr>');

										aHTML.push('<tr><td id="ns1blankspaceObjectAddCategories_title-' + iCategory + '-12" class="ns1blankspaceRowSelect">' +
																'Business</td></tr>');
										
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
											
										$('#ns1blankspaceObjectAddObjects td.ns1blankspaceRowSelect').click(function(event)
										{
											oParam.xhtmlElementID = event.target.id;
											ns1blankspace.setup.structure.object.select(oParam);
										});
									}	
								},
										
					select:		function (oParam)
								{
									var sXHTMLElementID;
									var iUser = ns1blankspace.objectContext;
									var iUserType = 1;

									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.user != undefined) {iUser = oParam.user}
										if (oParam.userType != undefined) {iUserType = oParam.userType}
									}		

									if (sXHTMLElementID)
									{
										var aSearch = sXHTMLElementID.split('-');
										var iCategory = aSearch[1];
										var iObject = aSearch[2];
										
										$('#' + sXHTMLElementID).fadeOut(500);
										
										var sData = 'category=' + iCategory +
													'&object=' + iObject;
													
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_OBJECT_LINK_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data)
											{		
												$(ns1blankspace.xhtml.container).hide();
												ns1blankspace.setup.structure.object.show();
											}
										});
									}	
								},

					remove:		function (sXHTMLElementID)
								{
									var aSearch = sXHTMLElementID.split('-');
									
									var sData = 'remove=1&id=' + aSearch[1];
												
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_OBJECT_LINK_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
									});	
								}
				}			
}				
