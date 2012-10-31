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
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 154;
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectName = 'stuctureData';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Structure Data';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.stuctureData.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
				},

	bind:		function ()
				{
					$('#tdns1blankspaceActionOptionsRemove').click(function(event)
					{
						ns1blankspaceStructureDataRemove();
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

							var aHTML = [];
									
						aHTML.push('<table>');

						aHTML.push('<tr><td id="ns1blankspaceViewSetupLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');
								
						aHTML.push('</table>');		
						
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
								    	
										aHTML.push('</tbody></table>';

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

						aHTML.push('<tr><td>&nbsp;</td></tr>';

						aHTML.push('<tr><td id="ns1blankspaceControlElement" class="ns1blankspaceControl">' +
										'Element</td></tr>');
					}	
					
					aHTML.push('</table>';					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainElement" class="ns1blankspaceControl"></div>');		
					
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
						
						ns1blankspace.history.object({functionDefault: 'ns1blankspace.structureData.summary()'});
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
				
	element: 	{							
					layout:		function ns1blankspaceStructureDataElements(oParam, oResponse)
								{
									var aHTML = [];
									
									
									if (oResponse == undefined)
									{
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/setup/?method=SETUP_STRUCTURE_CATEGORY_SEARCH&structure=' + ns1blankspace.objectContextData.structure,
											dataType: 'json',
											success: function(data) {ns1blankspaceStructureDataElements(oParam, data)}
										});
									}
									else
									{
										if ($('#divns1blankspaceMainElement').attr('onDemandLoading') == '1')
										{
											$('#divns1blankspaceMainElement').attr('onDemandLoading', '');
										
											aHTML.push('<table id="tablens1blankspaceMainElement" class="ns1blankspaceMain">';
											aHTML.push('<tr id="trns1blankspaceMainElementRow1" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainElementColumnCategory" style="width: 100px" class="ns1blankspaceMainColumn1">' +
															'</td>' +
															'<td id="tdns1blankspaceMainElementColumnElement" style="width: 300px" class="ns1blankspaceMainColumn2">' +
															'</td>' +
															'<td id="tdns1blankspaceMainElementColumnEdit" class="ns1blankspaceMainColumn2">' +
															'</td>' +
															'</tr>';
											aHTML.push('</table>';					
											
											$('#divns1blankspaceMainElement').html(aHTML.join(''));
											
											var aHTML = [];
											
										
											aHTML.push('<table id="tablens1blankspaceMainElementCategories" class="ns1blankspaceMain">';
											
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table id="tableStructureDataCategory" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
												aHTML.push('<tbody>'
												aHTML.push('<tr class="ns1blankspaceMainCaption">' +
																'<td class="ns1blankspaceMainRowNothing">No categories.</td></tr>';
												aHTML.push('</tbody></table>';

												$('#tdns1blankspaceMainElementColumn1').html(aHTML.join(''));
											
											}
											else
											{
												aHTML.push('<table id="tableStructureDataCategory" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
												aHTML.push('<tbody>'
												
												$.each(oResponse.data.rows, function()
												{
													aHTML.push('<tr class="ns1blankspaceMainRow">';
																	
													aHTML.push('<td id="tdStructureDataCategory_title-' + this.id + '" class="ns1blankspaceSearch">' +
																			this.title + '</td>';
																			
													aHTML.push('</tr>';
												});
												
												aHTML.push('</tbody></table>';

												$('#tdns1blankspaceMainElementColumnCategory').html(aHTML.join(''));
									
												$('td.ns1blankspaceSearch').click(function(event)
												{
													var sXHTMLElementId = event.target.id;
													var aId = sXHTMLElementId.split('-');
													
													ns1blankspaceStructureDataCategoryElements({xhtmlElementID: 'tdns1blankspaceMainElementColumnElement', category: aId[1]});
													
												});
											}	
										}
									}	
								},

					show:		function ns1blankspaceStructureDataCategoryElements(oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.objectContext;
									var sXHTMLElementId = 'tdns1blankspaceMainElementColumnElement';
									var oOptions = {edit: true, remove: true};
									var oActions = {add: true};
									var iCategory;
									
									if (oParam != undefined)
									{
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementId = oParam.xhtmlElementID}
										if (oParam.options != undefined) {oOptions = oParam.options}
										if (oParam.actions != undefined) {oActions = oParam.actions}
										if (oParam.category != undefined) {iCategory = oParam.category}
									}		
										
									if (oResponse == undefined)
									{	
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/structure/structure.asp?method=STRUCTURE_ELEMENT_DATA_VALUE_SEARCH' +
														'&data=' + ns1blankspace.objectContext + '&category=' + iCategory,
											dataType: 'json',
											success: function(data) {ns1blankspaceStructureDataCategoryElements(oParam, data)}
										});
									}
									else
									{
										var aHTML = [];
										
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="tableStructureDataCategoryElements" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceMainCaption">' +
															'<td class="ns1blankspaceMainRowNothing">No elements</td></tr>';
											aHTML.push('</tbody></table>';

											$('#' + sXHTMLElementId).html(aHTML.join(''));
										
										}
										else
										{
											aHTML.push('<table id="tableStructureDataValueHeader" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMainHeader" style="font-size:0.75em;background-color: #F8F8F8;padding:5px;">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceMainHeader">' +
													'<td class="ns1blankspaceMainHeaderX" id="ns1blankspaceMainHeaderRemovedEmails" style="text-align:left;">&nbsp;</td>';	
											
											aHTML.push('<td class="ns1blankspaceMainHeaderX" id="tdns1blankspaceMainHeaderAll" style="width:15px;">';
											aHTML.push('<span id="spanns1blankspaceMainHeaderAll" class="ns1blankspaceMainHeaderAll">All</span>';
											aHTML.push('</td>';
											
											aHTML.push('<td class="ns1blankspaceMainHeaderX" style="width:5px;">&nbsp;|&nbsp;</td>';
											aHTML.push('<td class="ns1blankspaceMainHeaderX" id="tdns1blankspaceMainHeaderUnanswered" style="width:80px;">';
											aHTML.push('<span id="spanns1blankspaceMainHeaderUnanswered" class="ns1blankspaceMainHeaderUnanswered">Unanswered</span>';
											aHTML.push('</td>';
											
											aHTML.push('<td class="ns1blankspaceMainHeaderX" style="width:5px;">&nbsp;|&nbsp;</td>';
											aHTML.push('<td class="ns1blankspaceMainHeaderX" id="tdns1blankspaceMainHeaderAnswered" style="width:60px;">';
											aHTML.push('<span id="spanns1blankspaceMainHeaderAnswered" class="ns1blankspaceMainHeaderAnswered">Answered</span>';
											aHTML.push('</td>';
											
											aHTML.push('</tr>';
											aHTML.push('</table>';
														
											aHTML.push('<tr class="ns1blankspaceMainHeader" id="trns1blankspaceMessagingInboxPages"><td colspan=2 id="tdns1blankspaceMessagingInboxPages"></td></tr>';
											aHTML.push('</tbody></table>';
											aHTML.push('<table id="tableStructureDataCategoryElements" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push('<tbody>'

											var sClass;
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceMainRow">';
																
												sClass = (this.text != '' || this.formatted != '') ? ' answered' : ''				
																
												aHTML.push('<td id="tdStructureDataCategoryElement_title-' + this.id + '" class="ns1blankspaceMainRow' + sClass + '">' +
																		this.elementtext + '</td>';
																		
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceMainRow">';
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="spanStructureDataCategoryoptions_remove-' + this.id + '" class="ns1blankspaceMainRowOptionsRemove"></span>';
												};	
													
												if (oOptions.edit)
												{	
													aHTML.push('<span id="spanStructureDataCategory_options_edit-' + this.id + '" class="ns1blankspaceMainRowOptionsEdit"></span>';
												};	
													
												aHTML.push('</td>';
																
												aHTML.push('</tr>';
											});
											
											aHTML.push('</tbody></table>';

											$('#' + sXHTMLElementId).html(aHTML.join(''));
											
											if (oOptions.remove) 
											{
												$('.ns1blankspaceMainRowOptionsRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspaceStructureDataCategoryRemove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px')
											}
											
											if (oOptions.edit) 
											{
												$('.ns1blankspaceMainRowOptionsEdit').button( {
													text: false,
													icons: {
														primary: "ui-icon-pencil"
													}
												})
												.click(function() {
													ns1blankspaceStructureDataCategoryElementEdit({xhtmlElementID: this.id})
												})
												.css('width', '15px')
												.css('height', '17px')
											}	
										}
									}	
								},

					edit:		function ns1blankspaceStructureDataCategoryElementEdit(oParam, oResponse)
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
										

										aHTML.push('<table style="font-size: 0.875px;">';
												
										aHTML.push('<tr id="trns1blankspaceMainStructureDataElementAddSave">' +
														'<td>' +
														'<span id="spanns1blankspaceMainStructureDataCategoryElementEditSave">Save</span>' +
														'</td></tr>';
										/*
										aHTML.push('<td id="tdns1blankspaceMainStructureDataElementAddCancel" class="ns1blankspaceMainAction">' +
														'<span id="spanns1blankspaceMainStructureDataCategoryElementEditCancel">Cancel</span>' +
														'</td></tr>';
										*/
														
										aHTML.push('</table>';			
											
										aHTML.push('<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMain">';
												
										aHTML.push('<tr id="trns1blankspaceMainSetupStructureDataCategoryTitle" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainSetupStructureDataCategoryTitle" class="ns1blankspaceMain">' +
														'Title' +
														'</td></tr>' +
														'<tr id="trns1blankspaceMainSetupStructureDataCategoryAddTitleValue" class="ns1blankspaceMainText">' +
														'<td id="tdns1blankspaceMainSetupStructureDataCategoryAddTitleValue" class="ns1blankspaceMainText">' +
														'<input id="inputns1blankspaceMainStructureDataCategoryAddTitle" class="inputns1blankspaceMainText">' +
														'</td></tr>';
										
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainElementColumnEdit').html(aHTML.join(''));
										
										$('#spanns1blankspaceMainStructureDataCategoryElementEditSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											var sData = 'StructureData=' + ns1blankspace.objectContext;
											sData += '&id=' + ns1blankspace.util.fs(sID);
											sData += '&title=' + ns1blankspace.util.fs($('#inputns1blankspaceMainStructureDataCategoryAddTitle').val());
											
											$.ajax(
											{
												type: 'POST',
												url: '/ondemand/structure/structure.asp?method=STRUCTURE_DATA_VALUE_MANAGE',
												data: sData,
												dataType: 'json',
												success: function() {
													$('#tdns1blankspaceMainElementColumnEdit').html('');
													$('#tdStructureDataCategoryElement_title-' + sID).addClass('answered');
												}
											});
										});
										
										$('#spanns1blankspaceMainStructureDataCategoryElementEditCancel').button(
										{
											text: "Cancel"
										})
										.click(function() 
										{
											$('#tdns1blankspaceMainElementColumnEdit').html('');
										});
										
										if (sID != undefined)
										{
											$.ajax(
											{
												type: 'POST',
												url: '/ondemand/structure/structure.asp?method=STRUCTURE_DATA_VALUE_SEARCH',
												data: 'id=' + sID,
												dataType: 'json',
												success: function(data) {ns1blankspaceStructureDataCategoryElementEdit(oParam, data)}
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
											$('#inputns1blankspaceMainSetupStructureDataElementAddTitle').val(oObjectContext.title)
											$('#inputns1blankspaceMainSetupStructureDataElementAddTitle').focus();
										}
									}		
								},

					remove:		function ns1blankspaceStructureDataCategoryElementRemove(oParam, oResponse)
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
										var sParam = 'method=STRUCTURE_DATA_VALUE_MANAGE&remove=1';
										var sData = 'id=' + sID;
										
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/structure/structure.asp?' + sParam,
											data: sData,
											dataType: 'json',
											success: function(data){ns1blankspaceStructureDataCategoryElementRemove(oParam, data)}
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
					ns1blankspaceStructureDataViewport();
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					ns1blankspaceMainViewportShow("#divns1blankspaceMainDetails");
					ns1blankspaceStructureDataDetails();
				},

	debug: 		{
					search: 		function ns1blankspaceStructureTest()
									{
										var oData = {"fields":
														[
															{
																"name": "contactbusiness"
															}
														],
														"filters":
														[],
														"options":
														{
															"rf": "JSON",
															"rows": "100"
														}
													}

										$.ajax({
											url: "/rpc/structure/?method=STRUCTURE_DATA_SEARCH&advanced=1",
											type: 'POST',
											cache: false,
											dataType: 'json',
											data: JSON.stringify(oData),
											success: function(response)
											{
														
											}
										});			

									}
				}
}									
