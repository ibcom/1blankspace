/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.setup.structure = 
{
	init: 		function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 26;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'structure';
					ns1blankspace.viewName = 'Structures';
					
					ns1blankspace.app.set(oParam);

					if (ns1blankspace.option.richTextEditing)
					{
						tinyMCE.init(
						{
							mode : "none",
							height : "200px", 
							width : "100%",
							theme : "advanced",

							theme_advanced_path : false,
							theme_advanced_statusbar_location : "bottom",

				    		theme_advanced_buttons1 : "bold,italic,underline,link,unlink,bullist,blockquote,undo", 
				    		theme_advanced_buttons2 : "", 
				    		theme_advanced_buttons3 : "",
						
							font_size_style_values : "8pt,10pt,12pt,14pt,18pt,24pt,36pt",
							
							relative_urls : false, 
							remove_script_host : false, 
							convert_urls : false, 
							visual : true, 
							gecko_spellcheck : true,
							content_css : ns1blankspace.xhtml.editorCSS,
							
							external_link_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH", 
							external_image_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext, 
							media_external_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext, 
						});				
					}
				},

	bind: 		function ()
				{
					$('#ns1blankspaceViewControlActionOptionsRemove').click(function(event)
					{
						ns1blankspace.setup.structure.remove();
					});
				},

	home: 		function (oResponse)
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
						oSearch.getResults(ns1blankspace.setup.structure.home);
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

										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_STRUCTURE_SEARCH';
										oSearch.addField('reference,title');
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
											ns1blankspace.container.position(sElementId);
											ns1blankspace.search.start(sElementId);
				
											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_SEARCH'),
												data: 'quicksearch=' + sSearchText,
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.structure.search.process(oParam, data)}
											});
											
										}
									};	
								},

					process: 	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									
									var	iMaximumColumns = 1;
									
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspace.search.stop();
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
											ns1blankspace.setup.structure.search.send(event.target.id, 1);
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

						aHTML.push('<tr><td>&nbsp;</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlGrouping" class="ns1blankspaceControl">' +
										'Grouping</td></tr>');

						aHTML.push('<tr><td>&nbsp;</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlCategory" class="ns1blankspaceControl">' +
										'Categories</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlElement" class="ns1blankspaceControl">' +
										'Elements</td></tr>');
					}	
					
					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainGrouping" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainCategory" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainElement" class="ns1blankspaceControlMain"></div>');
				
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
						ns1blankspace.show({selector: '#ns1blankspaceMainGrouping'});
						ns1blankspace.setup.structure.grouping.show();
					});

	
					$('#ns1blankspaceControlCategory').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainCategory'});
						ns1blankspace.setup.structure.category.show();
					});


					$('#ns1blankspaceControlElement').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainElement'});
						ns1blankspace.setup.structure.element.init();
					});
				},

	show:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
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
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.structure.init({showHome: false});ns1blankspace.setup.structure.search.send("-' + ns1blankspace.objectContext + '")',
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

	new:		function (oParam)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspace.setup.structure.layout();
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					ns1blankspace.setup.structure.details();
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
												ns1blankspace.setup.structure.search.send('-' + ns1blankspace.objectContext, {source: 1});
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
										oSearch.sort('title', 'asc');
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
											.click(function() {
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
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceSetupStructureGrouping_title-' + this.id + '" class="ns1blankspaceRow">' +
																		this.title + '</td>');
																		
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceSetupStructureGrouping_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
												};	
													
												if (oOptions.view)
												{	
													aHTML.push('<span id="ns1blankspaceSetupStructureGrouping_options_view-' + this.id + '" class="ns1blankspaceRowView"></span>');
												};	
													
												aHTML.push('</td>');
																
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceGroupingColumn1').html(aHTML.join(''));
											
											if (oOptions.view) 
											{
												$('#ns1blankspaceGroupingColumn .ns1blankspaceRowRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspace.setup.structure.grouping.remove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px');
											}
											
											if (oOptions.remove) 
											{
												$('#ns1blankspaceGroupingColumn .ns1blankspaceRowOptionsView').button( {
													text: false,
													icons: {
														primary: "ui-icon-play"
													}
												})
												.click(function() {
													ns1blankspace.setup.structure.grouping.add({xhtmlElementID: this.id})
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
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureGroupingTitle" class="inputns1blankspaceText">' +
														'</td></tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceSetupStructureGroupingColumn1').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspace">');
												
										aHTML.push('<tr class="ns1blankspaceAction">' +
														'<td class="ns1blankspaceAction">' +
														'<span style="width:80px;" id="ns1blankspaceSetupStructureGroupingSave">Save</span>' +
														'</td></tr>');
									
										aHTML.push('<trclass="ns1blankspaceAction">' +
														'<td class="ns1blankspaceAction">' +
														'<span style="width:80px;" id="ns1blankspaceSetupStructureGroupingCancel">Cancel</span>' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceSetupStructureGroupingColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceSetupStructureGroupingSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											var sData = 'structure=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
											sData += '&id=' + ns1blankspace.util.fs(sID);
											sData += '&title=' + ns1blankspace.util.fs($('#ins1blankspaceSetupStructureGroupingTitle').val());
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_DATA_GROUP_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function() {
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
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_DATA_GROUP_SEARCH'),
												data: 'id=' + sID,
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.structure.grouping.edit(oParam, data)}
											});
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
											url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_DATA_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data){ns1blankspaceSetupStructureGroupingRemove(oParam, data)}
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
										oSearch.getResults(function(data) {ns1blankspace.setup.structure.category.show(oParam, data)}) 
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
											
											if (oOptions.view) 
											{
												$('#ns1blankspaceSetupStructureCategory span.ns1blankspaceRowRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspace.setup.structure.category.remove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px')
											}
											
											if (oOptions.remove) 
											{
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
												.css('height', '17px')
											}	
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
									
										aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceSetupStructureElementColumnCategory" style="width:100px;padding-right:5px;font-size:0.875em;" class="ns1blankspaceColumn1">' +
														ns1blankspace.xhtml.loading + '</td>' +
													'<td id="ns1blankspaceSetupStructureElementColumnElement1" style="width:175px;padding-right:5px;font-size:0.875em;" class="ns1blankspaceColumn2"></td>' +
													'<td id="ns1blankspaceSetupStructureElementColumnElement2" style="width:305px;padding-right:15px;font-size:0.875em;" class="ns1blankspaceColumn2"></td>' +
													'<td id="ns1blankspaceSetupStructureElementColumnElement3" class="ns1blankspaceColumn2"></td>' +
													'</tr>' +
													'</table>');					
											
										$('#ns1blankspaceMainElement').html(aHTML.join(''));
											
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td valign="top">No categories.</td></tr></table>');

											$('#ns1blankspaceSetupStructureElementColumnCategory').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceSetupStructureCategory" class="ns1blankspaceContainer">');
										
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceSetupStructureCategory_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																this.title + '</td>');
																		
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceSetupStructureElementColumnCategory').html(aHTML.join(''));
								
											$('#ns1blankspaceSetupStructureCategory td.ns1blankspaceRowSelect').click(function(event)
											{
												var sXHTMLElementId = event.target.id;
												var aId = sXHTMLElementId.split('-');
												
												ns1blankspace.setup.structure.element.show({category: aId[1]});
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
										
									if (oResponse == undefined)
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_STRUCTURE_ELEMENT_SEARCH';
										oSearch.addField( 'backgroundcolour,caption,category,categorytext,datatype,datatypetext,' +
															'description,displayorder,hint,id,notes,notestype,notestypetext,' +
															'reference,structure,structuretext,textcolour,title');
										oSearch.addFilter('category', 'EQUAL_TO', iCategory);
										oSearch.getResults(function(data) {ns1blankspace.setup.structure.element.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
	
										aHTML.push('<table class="ns1blankspaceColumn2">');
											
										aHTML.push('<tr><td class="ns1blankspaceSub">' +
														'No element selected.' +
														'<br /><br/ >Click the gear icon to set up automation (issue creation) for an element.' +
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
											aHTML.push('<table id="ns1blankspaceSetupStructureElementColumnElement" class="ns1blankspaceColumn2">');
										
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceSetupStructureElement_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
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
												.click(function() {
													ns1blankspace.setup.structure.element.remove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px')
											}
											
											$('#ns1blankspaceSetupStructureElementColumnElement .ns1blankspaceRowSelect').click(function() {
												ns1blankspace.setup.structure.element.edit({xhtmlElementID: this.id})
											})
											.css('width', '15px')
											.css('height', '17px')
											
											if (oOptions.automation) 
											{
												$('#ns1blankspaceSetupStructureElementColumnElement span.ns1blankspaceRowAutomation').button( {
													text: false,
													icons: {
														primary: "ui-icon-gear"
													}
												})
												.click(function() {
													ns1blankspace.setup.structure.element.automation({xhtmlElementID: this.id})
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
									var iDefaultCategory;
									
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
									
										for (edId in tinyMCE.editors) 
													tinyMCE.editors[edId].destroy(true);
													
										ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;
									
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Title' +
														'</td></tr>' +
														'<tr class="ns1blankspaceTextMulti">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<textarea rows="3" cols="35" id="ns1blankspaceSetupStructureElementTitle" class="ns1blankspaceTextMultiSmall" style="height: 80px;"></textarea>' +
														'</td></tr>');
										
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Description' +
														'</td></tr>' +
														'<tr class="ns1blankspaceTextMulti">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<textarea rows="3" cols="35" id="ns1blankspaceSetupStructureElementDescription' +
														 			ns1blankspace.counter.editor + '" data-editorcount="' + ns1blankspace.counter.editor + 
																	'" class="ns1blankspaceTextMultiLarge" style="height: 125px;"></textarea>' +
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
											if (iDefaultCategory == undefined) {iDefaultCategory = this.id}
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
														'<br /><input type="radio" id="radioDataType2" name="radioDataType" value="2"/>Select / Choice' +
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
											tinyMCE.execCommand('mceAddControl', false, 'ns1blankspaceSetupStructureElementDescription' + ns1blankspace.counter.editor);
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
											sData += '&datatype=' + ns1blankspace.util.fs($('input[name="radioDataType"]:checked').val());
											sData += '&category=' + ns1blankspace.util.fs($('input[name="radioCategory"]:checked').val());
											sData += '&textcolour=' + ns1blankspace.util.fs($('#ns1blankspaceSetupSetupStructureElementTextColour').val());
											sData += '&backgroundcolour=' + ns1blankspace.util.fs($('#ns1blankspaceSetupSetupStructureElementBackgroundColour').val());
											sData += '&displayorder=' + ns1blankspace.util.fs($('#ns1blankspaceSetupSetupStructureElementDisplayOrder').val());
											sData += '&description=' + ns1blankspace.util.fs(tinyMCE.get('ns1blankspaceSetupStructureElementDescription' + ns1blankspace.counter.editor).getContent());
												
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_ELEMENT_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function() {
													$('#ns1blankspaceSetupStructureElement_title-' + sID).html($('#ns1blankspaceSetupStructureElementTitle').val());
													ns1blankspace.status.message('Element has been saved.');
												}
											});
										});
										
										if (sID != undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_STRUCTURE_ELEMENT_SEARCH';
											oSearch.addField( 'backgroundcolour,caption,category,categorytext,datatype,datatypetext,description,displayorder,' +
																	'hint,notes,notestype,notestypetext,reference,structure,structuretext,textcolour,title');
											oSearch.addFilter('id', 'EQUAL_TO', sID);
											oSearch.getResults(function(data) {ns1blankspace.setup.structure.element.edit(oParam, data)});
										}
										else
										{
											$('[name="radioDataType"][value="4"]').attr('checked', true);
											$('[name="radioCategory"][value="' + iDefaultCategory + '"]').attr('checked', true);	
										}
									}
									else
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];
											$('#ns1blankspaceSetupStructureElementTitle').val(oObjectContext.title);
											
											var sHTML = (oObjectContext.description).formatXHTML();
											
											tinyMCE.get('ns1blankspaceSetupStructureElementDescription' + ns1blankspace.counter.editor).setContent(sHTML)
											
											$('[name="radioDataType"][value="' + oObjectContext.datatype + '"]').attr('checked', true);
											$('[name="radioCategory"][value="' + oObjectContext.category + '"]').attr('checked', true);
											$('#ns1blankspaceSetupSetupStructureElementTextColour').val(oObjectContext.textcolour)
											$('#ns1blankspaceSetupSetupStructureElementBackgroundColour').val(oObjectContext.backgroundcolour)
											$('#ns1blankspaceSetupSetupStructureElementDisplayOrder').val(oObjectContext.displayorder)	
											$('#ns1blankspaceSetupSetupStructureElementTitle').focus();
											//ns1blankspace.setup.structure.element.options.show({structureElementID: oObjectContext.id});
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
											data: 'id=' + sID,
											dataType: 'json',
											success: function(data) {ns1blankspace.setup.structure.element.remove(oParam, data)}
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
														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_ELEMENT_OPTION_SEARCH'),
															data: 'element=' + iStructureElementID,
															dataType: 'json',
															success: function(data){ns1blankspace.setup.structure.element.show(oParam, data)}
														});
													}	
													else
													{	
														var aHTML = [];

														aHTML.push('<table id="ns1blankspaceElementOptions" style="width:100%"' +
																			' data-structureElement="' + iStructureElementID + '"' +
																			' data-method="SETUP_STRUCTURE_ELEMENT_OPTION">');
										
														aHTML.push('<tr class="ns1blankspaceRow">');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">Choices</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">Points</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right"><span id="ns1blankspaceElementOptionAdd">Add</span></td>');
														aHTML.push('</tr>');
																
														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<tr><td class="ns1blankspaceNothing">No choices.</td></tr>');
														}
														else
														{
															$.each(oResponse.data.rows, function()
															{
																aHTML.push('<tr class="ns1blankspaceRow">');
																		
																aHTML.push('<td id="ns1blankspaceElementOption_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceElementOption" style="width:100%">' +
																				this.title + '</td>');
																	
																if (this.points == '')
																{
																	aHTML.push('<td id="ns1blankspaceElementOption_points-' + this.id + '" class="ns1blankspaceRow ns1blankspaceElementOption" style="width:40px;">' +
																					'</td>');
																}	
																else
																{		
																	aHTML.push('<td id="ns1blankspaceElementOption_points-' + this.id + '" class="ns1blankspaceRow ns1blankspaceElementOption" style="width:40px;">' +
																				this.points + '</td>');
																}							
															
																aHTML.push('<td style="width:23px;text-align:right;" id="tdElementOption_delete-' + this.id + 
																				'" class="ns1blankspaceRowRemove"></td>');
															
																aHTML.push('</tr>');
															});
												    	}

														aHTML.push('</table>');

														$('#ns1blankspaceSetupStructureElementOptions').html(aHTML.join(''));
														
														$('#ns1blankspaceElementOptionAdd').button({
																text: false,
																 icons: {
																	 primary: "ui-icon-plus"
																}
															})
															.click(function() {
																ns1blankspace.setup.structure.element.options.add()
															})
															.css('width', '15px')
															.css('height', '20px');
														
														$('# ns1blankspaceElementOptions td.ns1blankspaceElementOption').click(function(event)
														{
															ns1blankspace.setup.structure.element.options.edit.start(event.target.id);
														});
													
														$('#ns1blankspaceElementOptions .ns1blankspaceRowRemove').button(
															{
																text: false,
																 icons: {
																	 primary: "ui-icon-close"
																}
															})
															.click(function() {
																ns1blankspace.setup.structure.element.options.remove(this.id)
															})
															.css('width', '15px')
															.css('height', '20px');
													}	
												},

									add:		function ()
												{
													var aHTML = [];
													
													aHTML.push('<tr class="ns1blankspaceRow">');
																		
													aHTML.push('<td id="tns1blankspacedElementOption_title-" class="ns1blankspaceRow ns1blankspacedElementOption"></td>');
													
													aHTML.push('<td id="ns1blankspacedElementOption_points-" class="ns1blankspaceRow ns1blankspacedElementOption" style="width:40px;">' +
																					'</td>');

													aHTML.push('<td style="width:23px;text-align:right;" id="tdElementOption_remove-' + 
																	'" class="ns1blankspaceRowRemove"></td>');
													
													aHTML.push('</tr>');
															
													$('#ns1blankspacedElementOptions tr:first').after(aHTML.join(''));	
													$('#ns1blankspaceViewControlNew').button({disabled: true});
													$('#ns1blankspaceElementOptionAdd').button({disabled: true});
													
													ns1blankspace.setup.structure.element.options.edit.start("ns1blankspaceElementOption_title-")
												},

									remove:		function (sXHTMLElementId)
												{
													var aSearch = sXHTMLElementId.split('-');
													var sElementId = aSearch[0];
													var sSearchContext = aSearch[1];
													
													if (confirm('Are you sure?'))
													{
														var aMethod = gsSetupMethod.split('_');
														var sEndpoint = aMethod[0];
														var sData = 'remove=1_vfrt3&id=' + sSearchContext;
																	
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
																	
																	$('#' + sElementId).html(sHTML);
																	$('#' + sElementInputID).focus();
																	
																	$('#' + sElementInputID).blur(function(event)
																	{
																		ns1blankspace.setup.structure.element.options.edit.stop(sElementId);
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
																	sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceElementOption_title-' + aElement[1]).html());
																	sData += '&points=' + ns1blankspace.util.fs($('#ns1blankspaceElementOption_points-' + aElement[1]).html());

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
																						if (data.notes == 'ADDED')
																						{
																							$('#ns1blankspaceElementOption_title-').attr('id','ns1blankspaceElementOption_title-' + data.id);
																							$('#ns1blankspaceElementOption_points-').attr('id','ns1blankspaceElementOption_points-' + data.id);
																							
																							$('td.ns1blankspaceElementOption').unbind('click');
																								
																							$('td.ns1blankspaceElementOption').click(function(event)
																								{
																									ns1blankspace.setup.structure.element.options.edit.start(event.target.id);
																								});

																							$('#ns1blankspaceElementOption_delete-').attr('id','ns1blankspaceElementOption_remove-' + data.id);
																							
																							$('.ns1blankspaceRowRemove').button({
																									text: false,
																									 icons: {
																										 primary: "ui-icon-close"
																									}
																								})
																								.click(function() {
																									ns1blankspace.setup.structure.element.options.remove(this.id)
																								})
																								.css('width', '15px')
																								.css('height', '20px')
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
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_AUTOMATION_SEARCH'),
											data: 'element=' + iElementID,
											dataType: 'json',
											success: function(data) {ns1blankspace.setup.structure.automation.show(oParam, data)}
										});
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
											.click(function() {
												 ns1blankspace.setup.structure.automation.add({element: iElementID});
											})
											
										}	
									
										var aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">No automation set up.</td></tr></table>');

											$('#ns1blankspaceSetupStructureElementColumnElement2').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceSetupStructureAutomation" class="ns1blankspaceContainer">');
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Automation</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceSetupStructureAutomation_title-' + this.id + '" class="ns1blankspaceRow">' +
																		this.title + '</td>');
																		
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceSetupStructureCategoryoptions_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
												};	
													
												if (oOptions.view)
												{	
													aHTML.push('<span id="ns1blankspaceSetupStructureCategory_options_view-' + this.id + '" class="ns1blankspaceRowView"></span>');
												};	
													
												aHTML.push('</td>');
																
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceSetupStructureElementColumnElement2').html(aHTML.join(''));
											
											if (oOptions.remove) 
											{
												$('#ns1blankspaceSetupStructureAutomation span.ns1blankspaceRowOptionsRemove').button( {
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
												$('#ns1blankspaceSetupStructureAutomation span.ns1blankspaceRowOptionsView').button( {
													text: false,
													icons: {
														primary: "ui-icon-play"
													}
												})
												.click(function() {
													ns1blankspace.setup.structure.automation.add({xhtmlElementID: this.id, element: iElementID})
												})
												.css('width', '15px')
												.css('height', '17px');
											}	
										}
									}	
								},

					add:		function (oParam, oResponse)
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

										aHTML.push('<table class="ns1blankspace">');
										
										aHTML.push('<tr class="ns1blankspaceCaption">');
										aHTML.push('<td class="ns1blankspaceHeaderCaption">Automation</td>');
										aHTML.push('</tr>');
													
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Title' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupStructureAutomationTitle" class="inputns1blankspaceText">' +
														'</td></tr>');
										
										aHTML.push('</table>');					
										
										$('#tns1blankspaceSetupStructureElementColumnElement2').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2" style="font-size:0.875em">');
												
										aHTML.push('<tr class="ns1blankspaceAction">' +
														'<td class="ns1blankspaceAction">' +
														'<span style="width:70px;" id="ns1blankspaceSetupStructureAutomationSave">Save</span>' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ts1blankspaceSetupStructureElementColumnElement3').html(aHTML.join(''));
										
										$('#ns1blankspaceSetupStructureAutomationSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											var sData = 'structure=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
											sData += '&element=' + ns1blankspace.util.fs(iElementID);
											sData += '&id=' + ns1blankspace.util.fs(sID);
											sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceSetupStructureAutomationTitle').val());
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_AUTOMATION_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function() {
													ns1blankspace.setup.structure.automation.automation.show({element: iElementID});
												}
											});
										});
										
										if (sID != undefined)
										{
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_AUTOMATION_SEARCH'),
												data: 'id=' + sID,
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.structure.automation.add(oParam, data)}
											});
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
											$('#ns1blankspaceSetupStructureAutomationTitle').val(oObjectContext.title)
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
				}
}				
