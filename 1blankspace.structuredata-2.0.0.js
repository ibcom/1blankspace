/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.stuctureData = 
{
	init: 		function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 154;
					ns1blankspace.objectName = 'stuctureData';
					ns1blankspace.viewName = 'Structure Data';
				
					ns1blankspace.app.set(oParam);
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

						var aHTML = [];
									
						aHTML.push('<table>' +
							'<tr><td><div id="ns1blankspaceViewSetupLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>' +
							'</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'STRUCTURE_DATA_SEARCH';
						oSearch.addField('reference');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(ns1blankspace.structureData.home)
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">Click New to add data to the structure.</td></tr>' +
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
														this.email +
														'</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');			
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.structureData.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function (sXHTMLElementId, oParam)
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
											url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_SEARCH'),
											data: 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
											dataType: 'json',
											success: function(data) {ns1blankspace.structureData.show(oParam, data)}
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
												url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_SEARCH'),
												data: 'quicksearch=' + ns1blankspace.util.fs(sSearchText),
												dataType: 'json',
												success: function(data) {ns1blankspace.structureData.search.show(oParam, data)}
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
											ns1blankspace.structureData.search.send(event.target.id, 1);
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

						aHTML.push('<tr><td id="ns1blankspaceControlElement" class="ns1blankspaceControl">' +
										'Element</td></tr>');
					}	
					
					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainElement" class="ns1blankspaceControlMain"></div>');		
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
						
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.structureData.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.structureData.details();
					});

					$('#ns1blankspaceControlElement').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.structureData.elements();
					});
				},

	show: 		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.structureData.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this structure data.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
					
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.structureData.init({showHome: false});ns1blankspace.structureData.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.structureData.summary()'});
					}	
				},	
		
	summary: 	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this structure data.</td></tr></table>');
								
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
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Last Updated</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryEmail" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.modifieddate +
										'</td></tr>');

						if (ns1blankspace.objectContextData.contactbusinesstext != '')
						{	
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Contact (Business)</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryBusiness" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.contactbusinesstext +
										'</td></tr>');
						}						
						
						if (ns1blankspace.objectContextData.contactpersontext != '')
						{	
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Contact (Person)</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryPerson" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.contactpersontext +
										'</td></tr>');
						}		

						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainSummaryColumn1').html(aHTML.join(''));
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
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceDetailsTitle" class="ns1blankspaceMainText">' +
										'</td></tr>');			
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Business' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsBusiness" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_BUSINESS_SEARCH"' +
											' data-columns="tradename">' +
										'</td></tr>');	
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Person' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPerson" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_PERSON_SEARCH"' +
											' data-columns="surname"' +
											' data-parent="ns1blankspaceDetailsBusiness"' +
											' data-parent-search-id="contactbusiness"' +
											' data-parent-search-text="tradename">' +
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
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>In Progress' +
										'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Approved' +
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
					send: 		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var sData = '_=1';
										
										if (ns1blankspace.objectContext != -1)
										{
											sData += '&id=' + ns1blankspace.util.fs(ns1blankspace.objectContext);	
										}	
										
										if ($('#s1blankspaceMainDetails').html() != '')
										{
											sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceMainDetailsTitle').val());
											sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());	
										};
										
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data) {ns1blankspace.structureData.save.send(oParam, data)}
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
												ns1blankspace.structureData.search.send('-' + ns1blankspace.objectContext, {source: 1});
											}	
										}
										else
										{
											ns1blankspace.status.message('Could not save the data!');
										}
									}
								}
				},
				
	elements: 	{							
					init:		function (oParam, oResponse)
								{
									var aHTML = [];
									
									
									if (oResponse == undefined)
									{
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('SETUP_STRUCTURE_CATEGORY_SEARCH'),
											data: 'structure=' + ns1blankspace.objectContextData.structure,
											dataType: 'json',
											success: function(data) {ns1blankspace.structureData.elements.init(oParam, data)}
										});
									}
									else
									{
										if ($('#ns1blankspaceMainElement').attr('data-loading') == '1')
										{
											$('#ns1blankspaceMainElement').attr('data-loading', '');
										
											aHTML.push('<table class="ns1blankspaceContainer">' +
															'<tr class="ns1blankspaceContainer">' +
															'<td id="ns1blankspaceMainElementColumnCategory" style="width: 100px" class="ns1blankspaceColumn1"></td>' +
															'<td id="ns1blankspaceMainElementColumnElement" style="width: 300px" class="ns1blankspaceColumn2"></td>' +
															'<td id="ns1blankspaceMainElementColumnEdit" class="ns1blankspaceMainColumn2"></td>' +
															'</tr>' +
															'</table>');					
											
											$('#ns1blankspaceMainElement').html(aHTML.join(''));
											
											var aHTML = [];
											
											aHTML.push('<table id="ns1blankspaceElementCategories" class="ns1blankspaceMain">');
											
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table><tr><td valign="top">No categories</td></tr></table>');

												$('#ns1blankspaceMainElementColumn1').html(aHTML.join(''));
											}
											else
											{
												$.each(oResponse.data.rows, function()
												{
													aHTML.push('<tr class="ns1blankspaceRow">');
																	
													aHTML.push('<td id="ns1blankspaceStructureDataCategory_title-' + this.id + '" class="ns1blankspaceSearch">' +
																			this.title + '</td>');
																			
													aHTML.push('</tr>');
												});
												
												aHTML.push('</table>');

												$('#ns1blankspaceElementColumnCategory').html(aHTML.join(''));
									
												$('td.ns1blankspaceSearch').click(function(event)
												{
													var sXHTMLElementId = event.target.id;
													var aId = sXHTMLElementId.split('-');
													
													ns1blankspace.structureData.category.elements.show({xhtmlElementID: 'ns1blankspaceMainElementColumnElement', category: aId[1]});
												});
											}	
										}
									}	
								},

					show:		function (oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.objectContext;
									var oOptions = {edit: true, remove: true};
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
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('STRUCTURE_ELEMENT_DATA_VALUE_SEARCH'),
											data: 'data=' + ns1blankspace.util.fs(ns1blankspace.objectContext) + '&category=' + ns1blankspace.util.fs(iCategory),
											dataType: 'json',
											success: function(data) {ns1blankspace.structureData.elements.show(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td valign="top">No elements</td></tr></table>')

											$('#ns1blankspaceMainElementColumnElement').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table class="ns1blankspaceMainContainer" style="font-size:0.75em;background-color: #f8f8f8;padding:5px;">');

											aHTML.push('<tr class="ns1blankspaceMainHeader">' +
													'<td class="ns1blankspaceHeader" style="text-align:left;">&nbsp;</td>');	
											
											aHTML.push('<td class="ns1blankspaceMainHeaderX" id="ns1blankspaceMainHeaderAll" style="width:15px;">');
											aHTML.push('<span id="spanns1blankspaceMainHeaderAll" class="ns1blankspaceMainHeaderAll">All</span>');
											aHTML.push('</td>');
											
											aHTML.push('<td class="ns1blankspaceMainHeaderX" style="width:5px;">&nbsp;|&nbsp;</td>');
											aHTML.push('<td class="ns1blankspaceMainHeaderX" id="ns1blankspaceMainHeaderUnanswered" style="width:80px;">');
											aHTML.push('<span id="spanns1blankspaceMainHeaderUnanswered" class="ns1blankspaceMainHeaderUnanswered">Unanswered</span>');
											aHTML.push('</td>');
											
											aHTML.push('<td class="ns1blankspaceMainHeaderX" style="width:5px;">&nbsp;|&nbsp;</td>');
											aHTML.push('<td class="ns1blankspaceMainHeaderX" id="ns1blankspaceMainHeaderAnswered" style="width:60px;">');
											aHTML.push('<span id="spanns1blankspaceMainHeaderAnswered" class="ns1blankspaceMainHeaderAnswered">Answered</span>');
											aHTML.push('</td>');
											
											aHTML.push('</tr>');
											aHTML.push('</table>');
														
											aHTML.push('<tr class="ns1blankspaceMainHeader" id="trns1blankspaceMessagingInboxPages"><td colspan=2></td></tr>');
											aHTML.push('</table>');

											aHTML.push('<table id="tableStructureDataCategoryElements" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">');

											var sClass;
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												sClass = (this.text != '' || this.formatted != '') ? ' answered' : ''				
																
												aHTML.push('<td id="ns1blankspaceStructureDataCategoryElement_title-' + this.id + '" class="ns1blankspaceMainRow' + sClass + '">' +
																		this.elementtext + '</td>');
																		
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceMainRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceStructureDataCategoryoptions_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
												};	
													
												if (oOptions.edit)
												{	
													aHTML.push('<span id="ns1blankspacenStructureDataCategory_options_edit-' + this.id + '" class="ns1blankspaceRowEdit"></span>');
												};	
													
												aHTML.push('</td>');
																
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceElementColumnElement').html(aHTML.join(''));
											
											if (oOptions.remove) 
											{
												$('.ns1blankspaceMainRowOptionsRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspace.structureData.elements.remove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px');
											}
											
											if (oOptions.edit) 
											{
												$('.ns1blankspaceMainRowEdit').button( {
													text: false,
													icons: {
														primary: "ui-icon-pencil"
													}
												})
												.click(function() {
													ns1blankspace.structureData.category.elements.edit({xhtmlElementID: this.id})
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
										

										aHTML.push('<table style="font-size: 0.875px;">');
												
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceStructureDataElementSave">Save</span>' +
														'</td></tr>');
														
										aHTML.push('</table>');			
											
										aHTML.push('<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMain">');
												
										aHTML.push('<tr class="ns1blankspaceMain">' +
														'<td class="ns1blankspaceMain">' +
														'Title' +
														'</td></tr>' +
														'<tr class="ns1blankspaceMainText">' +
														'<td class="ns1blankspaceMainText">' +
														'<input id="ns1blankspaceStructureDataElementTitle" class="inputns1blankspaceMainText">' +
														'</td></tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainElementColumnEdit').html(aHTML.join(''));
										
										$('#ns1blankspaceStructureDataElementSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											var sData = 'structureData=' + ns1blankspace.objectContext;
											sData += '&id=' + ns1blankspace.util.fs(sID);
											sData += '&title=' + ns1blankspace.util.fs($('#inputns1blankspaceMainStructureDataCategoryAddTitle').val());
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_VALUE_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function() {
													$('#ns1blankspaceMainElementColumnEdit').html('');
													$('#ns1blankspaceStructureDataCategoryElement_title-' + sID).addClass('answered');
												}
											});
										});
										
										$('#ns1blankspaceStructureDataElementCancel').button(
										{
											text: "Cancel"
										})
										.click(function() 
										{
											$('#ns1blankspaceElementColumnEdit').html('');
										});
										
										if (sID != undefined)
										{
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_VALUE_SEARCH'),
												data: 'id=' + sID,
												dataType: 'json',
												success: function(data) {ns1blankspace.structureData.category.element.edit(oParam, data)}
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
											$('#ns1blankspaceMainSetupStructureDataElementTitle').val(oObjectContext.title)
											$('#ns1blankspaceMainSetupStructureDataElementTitle').focus();
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
											type: 'POST',
											url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_VALUE_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data){ns1blankspace.structureData.element.remove(oParam, data)}
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

	new:		function ns1blankspaceStructureDataNew(oParam)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspace.structureData.layout();
					$('#ns1blankspaceVieControlAction').button({disabled: false});
					ns1blankspace.show({selector: '#divns1blankspaceMainDetails'});
					ns1blankspace.structureData.details();
				},

	debug: 		{
					test: 		function ()
									{
										var oData = {
														"fields": 	[
																		{
																			"name": "contactbusiness"
																		}
																	],

														"filters": 	[],

														"options": 	{
																		"rf": "JSON",
																		"rows": "100"
																	}		
													}

										$.ajax({
											url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_SEARCH') + '&advanced=1',
											type: 'POST',
											cache: false,
											dataType: 'json',
											data: JSON.stringify(oData),
											success: function(response) {}
										});			

									}
				}
}									
