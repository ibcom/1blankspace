/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.setup.websiteForm = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 40;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'websiteForm';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Website Forms';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.websiteForm.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
					ns1blankspace.setup.websiteForm.bind();
				},

	bind:		function ()
				{
					$('#ns1blankspaceActionOptionsRemove').click(function(event)
					{
						ns1blankspace.setup.websiteForm.remove();
					});
				},

	home: 		function (oResponse)
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
							
						aHTML.push('<table>' +
							'<tr><td><div id="ns1blankspaceViewSetupWebsiteLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>' +
							'</table>');	
						
						$('#ns1blankspaceControl').html(aHTML.join(''));
	
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('SETUP_SITE_FORM_SEARCH'),
							data: 'recent=1',
							dataType: 'json',
							success: ns1blankspace.setup.websiteForm.home
						});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							
							aHTML.push('<table id="ns1blankspaceMostLikely">' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a website form.</td></tr>' +
											'</table>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceCaption">MOST LIKELY</td></tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
														'" class="ns1blankspaceMostLikely">' +
														this.title+
														'</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.setup.websiteFormsearch.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function (sXHTMLElementID, oParam)
								{	
									var aSearch = sXHTMLElementID.split('-');
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
											url: ns1blankspace.util.endpointURI('SETUP_SITE_FORM_SEARCH'),
											data: 'id=' + ns1blankspace.objectContext,
											dataType: 'json',
											success: function(data) {ns1blankspace.setup.websiteForm.show(oParam, data)}
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
											ns1blankspace.container.position('ns1blankspaceViewControlSearch');
											ns1blankspace.search.start();

											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('SETUP_SITE_FORM_SEARCH'),
												data: 'quicksearch=' + ns1blankspace.util.fs(SearchText),
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.websiteForm.search.process(oParam, data)}
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
											
											sTitle = this.title;
											if (sTitle == '') {sTitle = this.message}
											if (sTitle == '') {sTitle = this.typetext}
											sTitle = sTitle + ' (' + this.id + ')';
												
											aHTML.push('<td class="ns1blankspaceSearch" id="title' +
															'-' + this.id + '">' +
															sTitle + '</td>');
											
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
											ns1blankspace.setup.websiteForm.search.send(event.target.id, {source: 1});
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
									
						aHTML.push('<tr><td id="ns1blankspaceControlLayout" class="ns1blankspaceControl">' +
										'Layout</td></tr>');
					}
					
					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainStructure" class="ns1blankspaceControlMain"></div>');
						
					$('#ns1blankspaceMain').html(aHTML.join(''));
						
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.setup.websiteForm.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.setup.websiteForm.details();
					});
					
					$('#ns1blankspaceControlStructure').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainStructure'});
						ns1blankspace.setup.websiteForm.structures.init();
					});
				},

	show:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.setup.websiteForm.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this website form.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];

						var sContext = ns1blankspace.objectContextData.title;
						if (sContext == '') {sContext = 'Form ' + ns1blankspace.objectContextData.id}
						
						$('#ns1blankspaceControlContext').html(sContext +
								'<br /><br /><span class="ns1blankspaceSub">' + ns1blankspace.objectContextData.sitetext + '</span>');
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.websiteForm.init({showHome: false});ns1blankspace.setup.websiteForm.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.setup.websiteForm.summary()'});
					}
				},		
		
	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this website form.</td></tr></table>');
								
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
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Type</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryType" class="ns1blankspaceSummary">' +
									ns1blankspace.objectContextData.typetext +
									'</td></tr>');
						

						if (ns1blankspace.objectContextData.message != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Message</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryMessage" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.message +
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
										'Title' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsTitle" class="ns1blankspaceText">' +
										'</td></tr>');			
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Email' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsEmail" class="ns1blankspaceText">' +
										'</td></tr>');	
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						var aHTML = [];
							
						aHTML.push('<table class="ns1blankspaceColumn2">');
					
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption">' +
										'Type' +
										'</td></tr>' +
										'<tr>' +
										'<tdclass="ns1blankspaceRadio">' +
										'<input type="radio" id="radioType1" name="radioType" value="1"/>Standard' +
										'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Simple' +
										'<br /><input type="radio" id="radioType3" name="radioType" value="3"/>Advanced' +
										'<br /><input type="radio" id="radioType4" name="radioType" value="4"/>Customised' +
										'<br /><input type="radio" id="radioType5" name="radioType" value="5"/>Newsletter' +
										'<br /><input type="radio" id="radioType6" name="radioType" value="6"/>Suggestion' +
										'</td></tr>');
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#ns1blankspaceDetailsEmail').val(ns1blankspace.objectContextData.email);
							$('[name="radioType"][value="' + ns1blankspace.objectContextData.type + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioType"][value="1"]').attr('checked', true);	
						}
					}	
				},

	new:		function (oParam)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspace.setup.websiteForm.init();
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlActionOptions').button({disabled: true});
					ns1blankspace.setup.websiteForm.details();
				},

	save:     	{
					send:		function (oParam, oResponse)
								{
									var sData = 'site=' + ns1blankspace.websiteForm.site;
									
									if (ns1blankspace.objectContext != -1)
									{
										sParam += '&id=' + ns1blankspace.objectContext	
									}	
									
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTitle').val());
										sData += '&email=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEmail').val());
										sData += '&type=' + ns1blankspace.util.fs($('input[name="radioType"]:checked').val());	
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('SETUP_SITE_FORM_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data) {ns1blankspace.SetupWebsiteFormSave(oParam, data)}
									});	
								},

					process:	function (oParam, oResponse)
								{					
									if (oResponse.status == 'OK')
									{	
										ns1blankspace.status.message('Saved');
										
										if (ns1blankspace.objectContext == -1)
										{
											ns1blankspace.objectContext = oResponse.id;
											ns1blankspace.inputDetected = false;
											ns1blankspace.setup.websiteForm.search('-' + ns1blankspace.objectContext, {source: 1});
										}	
									}
									else
									{
										ns1blankspace.status.error('Could not save!');
									}
								}
				},				

	structure: {
					init: 		function (oParam)
								{
									if (ns1blankspace.objectContextData.structure == '')
									{
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('SETUP_SITE_FORM_MANAGE'),
											data: 'createstructure=1&id=' + ns1blankspace.objectContext,
											dataType: 'json',
											success: function(data) 
												{
													ns1blankspace.objectContextData.structure = data.structure;
													ns1blankspace.objectContextData.structurecategory = data.structurecategory;
													ns1blankspace.setup.websiteForm.structure.show(oParam)
												}
										});
									}
									else
									{
										ns1blankspace.setup.websiteForm.structure.show(oParam);
									}
								},

					show:		function (oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.objectContext;
									var sXHTMLElementID = 'ns1blankspaceMainStructure';
									var oOptions = {view: true, remove: true};
									var oActions = {add: true};
									
									if (oParam != undefined)
									{
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementId = oParam.xhtmlElementID}
										if (oParam.options != undefined) {oOptions = oParam.options}
										if (oParam.actions != undefined) {oActions = oParam.actions}
									}		
										
									if (oResponse == undefined)
									{	
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_ELEMENT_SEARCH'),
											data: 'structure=' + ns1blankspace.objectContextData.structure + '&category=' + ns1blankspace.objectContextData.structurecategory,
											dataType: 'json',
											success: function(data) {ns1blankspace.setup.websiteForm.structure.show(oParam, data)}
										});

									}
									else
									{
										if (oActions != undefined)
										{
											var aHTML = [];
												
											aHTML.push('<table class="ns1blankspaceContainer">' +
															'<tr class="ns1blankspaceContainer">' +
															'<td id="ns1blankspaceStructureColumn1" class="ns1blankspaceColumn1"></td>' +
															'<td id="ns1blankspaceStructureColumn2" class="ns1blankspaceColumn2"></td>' +
															'</tr>' + 
															'</table>');	

											$('#' + sXHTMLElementID).html(aHTML.join(''));
											
											var aHTML = [];
												
											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											if (oActions.add)
											{
												aHTML.push('<tr><td>' +
															'<span id="ns1blankspaceStructureAdd" class="ns1blankspaceAction">Add</span>' +
															'</td></tr>');
											}
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceStructureColumn2').html(aHTML.join(''));
										
											$('#ns1blankspaceStructureAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												 ns1blankspace.setup.websiteForm.structure.add(oParam);
											})
										}	
									
										var aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">No layout elements.</td></tr></table>');

											$('#ns1blankspaceStructureColumn1').html(aHTML.join(''));
										
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceWebsiteFormStructure" class="ns1blankspaceContainer">');
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Title</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Type</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceWebsiteFormStructure_title-' + this.id + '" class="ns1blankspaceRow">' +
																		this.title + '</td>');
																		
												aHTML.push('<td id="ns1blankspaceWebsiteFormStructure_type-' + this.id + '" class="ns1blankspaceRow">' +
																		this.datatypetext + '</td>');
																		
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceWebsiteFormStructure_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
												};	
													
												if (oOptions.view)
												{	
													aHTML.push('<span id="ns1blankspaceWebsiteFormStructure_view-' + this.id + '" class="ns1blankspaceRowView"></span>');
												};	
													
												aHTML.push('</td>');
																
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceStructureColumn1').html(aHTML.join(''));
											
											if (oOptions.view) 
											{
												$('#ns1blankspaceWebsiteFormStructure span.ns1blankspaceRowRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspace.setup.websiteForm.structure.remove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px');
											}
											
											if (oOptions.remove) 
											{
												$('#ns1blankspaceWebsiteFormStructure  span.ns1blankspaceRowView').button( {
													text: false,
													icons: {
														primary: "ui-icon-play"
													}
												})
												.click(function() {
													ns1blankspace.setup.websiteForm.structure.add({xhtmlElementID: this.id})
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
										

										aHTML.push('<table id="ns1blankspaceMainColumn1" class="ns1blankspace">');
												
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Title' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceStructureTitle" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Data Type' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioDataType4" name="radioDataType" value="4"/>Text (Single Line)' +
														'<br /><input type="radio" id="radioDataType1" name="radioDataType" value="1"/>Text (Multi Line)' +
														'<br /><input type="radio" id="radioDataType3" name="radioDataType" value="3"/>Date' +
														'<br /><input type="radio" id="radioDataType2" name="radioDataType" value="2"/>Numeric' +
														'</td></tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceStructureColumn1').html(aHTML.join(''));
										
										var aHTML = [];
										
									
										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceStructureSave" class="ns1blankspaceAction" style="width:80px;">Save</span>' +
														'</td></tr>');

										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceStructureCancel" class="ns1blankspaceAction" style="width:80px;">Cancel</span>' +
														'</td></tr>');
												
										aHTML.push('</table>');					
										
										$('#ns1blankspaceStructureColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceStructureSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											var sData = 'structure=' + ns1blankspace.objectContextData.structure;
											sData += '&category=' + ns1blankspace.objectContextData.structurecategory;
											sData += '&id=' + ns1blankspace.util.fs(sID);
											sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceStructureTitle').val());
											sData += '&datatype=' + ns1blankspace.util.fs($('input[name="radioDataType"]:checked').val());	
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_ELEMENT_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function() {
													ns1blankspace.setup.websiteForm.structure.show();
												}
											});
										});
										
										$('#ns1blankspaceStructureCancel').button(
										{
											text: "Cancel"
										})
										.click(function() 
										{			
											ns1blankspace.setup.websiteForm.structure.show();
										});
										
										if (sID != undefined)
										{
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_ELEMENT_SEARCH'),
												data: 'id=' + sID,
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.websiteForm.structure.add(oParam, data)}
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
											$('#ins1blankspaceStructureTitle').val(oObjectContext.title)
											$('[name="radioDataType"][value="' + oObjectContext.datatype + '"]').attr('checked', true);
											$('#ns1blankspaceStructureTitle').focus();
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
											data: 'remove=1&id=' + ns1blankspace.util.fs(sID),
											dataType: 'json',
											success: function(data){ns1blankspace.setup.websiteForm.structure.remove(oParam, data)}
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