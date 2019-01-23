/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

// ns1blankspace.setup.home({viewName: 'Action Types', method: 'SETUP_ACTION_TYPE', search: {fields: 'title', sort: [{name: 'title'}], filters: [{name: 'fixed', comparison: 'EQUAL_TO', value1: 'N'}]}});	

ns1blankspace.setup.action = 
{
	init: 	function (oParam)
				{
					var bShowHome = true
					var bInitialised = false;

					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}
					}

					ns1blankspace.app.reset();

					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'action';
					ns1blankspace.viewName = 'Actions';
					
					ns1blankspace.app.set(oParam);
				},

	home:		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlNew').button({disabled: true});
						
						var aHTML = [];
									
						aHTML.push('<table>');

						aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

						aHTML.push('</table>');		
							
						aHTML.push('<table class="ns1blankspaceControl" style="padding-top:10px;">');
						
						aHTML.push('<tr><td id="ns1blankspaceControlTypes" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Types</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlActionTemplate" class="ns1blankspaceControl">' +
										'Templates</td></tr>');

						aHTML.push('</table>');		

						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						var aHTML = [];
						
						aHTML.push('<div id="ns1blankspaceMainTypes" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainTemplate_action" class="ns1blankspaceControlMain"></div>');
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						$('#ns1blankspaceControlTypes').click(function(event)
						{
							ns1blankspace.setup.action.home()
						});

						$('#ns1blankspaceControlActionTemplate').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainTemplate_action'});
							ns1blankspace.format.templates.edit.init({template: 'action', object: 17, refresh: true, variants: true, useSource: true});
						});

						//ns1blankspace.format.templates.edit.init({template: 'action', object: 17, refresh: true, variants: true});

						ns1blankspace.show({selector: '#ns1blankspaceMainTypes'});

						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_ACTION_TYPE_SEARCH';		
						oSearch.addField('backgroundcolour,displayorder,document,fixed,internalreference,notes,showincalendar,systemtype,systemtypetext,textcolour,title');					
						oSearch.rows = 99999;
						oSearch.addFilter('fixed', 'EQUAL_TO', 'N');
						oSearch.sort('title', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.setup.action.home(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">Click New to add an action type.</td></tr>' +
											'</table>');
						}
						else
						{
							aHTML.push('<table>');
						
							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');

								aHTML.push('<td id="ns1blankspaceSetupAction_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect" style="width:200px;">' +
														this.title + '</td>');
								
								aHTML.push('</tr>');
							});
	
							aHTML.push('</table>');
						}

						$('#ns1blankspaceMainTypes').html(aHTML.join(''));
					}			
				},

	search: 	{
					send: 	function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
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
										oSearch.method = 'SETUP_ACTION_TYPE_SEARCH';		
										oSearch.addField('backgroundcolour,displayorder,document,fixed,internalreference,notes,showincalendar,systemtype,systemtypetext,textcolour,title');
										oSearch.addField(ns1blankspace.option.auditFields);
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										
										oSearch.getResults(function(data) {ns1blankspace.setup.action.show(oParam, data)});
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
											oSearch.method = 'SETUP_ACTION_TYPE_SEARCH';		
											oSearch.addField('title');
											oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
										
											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.sort('title', 'desc');
											
											oSearch.getResults(function(data) {ns1blankspace.setup.action.search.process(oParam, data)});
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var iMaximumColumns = 1;

									ns1blankspace.search.stop();

									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
									}
									else
									{	
										aHTML.push('<table class="ns1blankspaceSearchMedium">');
										
										var sClass = '';

										$.each(oResponse.data.rows, function()
										{	
											iColumn = iColumn + 1;

											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">');
											}
											
											aHTML.push('<td class="ns1blankspaceSearch" id="ns1blankspaceSearch-' +
															this.id + '">' +
															this.title + 
															'</td>');

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
											ns1blankspace.setup.action.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'title',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.setup.action.search.send
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
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Details</td></tr>');		
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');
					}	
					
					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
							
					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.setup.action.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.setup.action.details();
					});
				},

	show:		function (oParam, oResponse)
				{
					ns1blankspace.app.clean();
					ns1blankspace.setup.action.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this action type.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
					
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.setup.action.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.setup.action.summary()'});

						ns1blankspace.util.onComplete(oParam);
					}	
				},

	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this action type.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:0px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Title</td></tr>' +
											'<tr><td class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.title +
											'</td></tr>');

						aHTML.push('</table>');								

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
					}	
				},

	details: function ()
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

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
							//$('[name="radioPrivate"][value="' + ns1blankspace.objectContextData.private + '"]').attr('checked', true);
						}
						else
						{
							//$('[name="radioPrivate"][value="Y"]').attr('checked', true);
						}
					}	
				},

	save: 	{
					send:		function (oParam)
								{
									ns1blankspace.status.working();

									var oData = {}

									if (ns1blankspace.objectContext != -1)
									{
										oData.id = ns1blankspace.objectContext;
									} 
							
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										oData.title = $('#ns1blankspaceDetailsTitle').val();
									}

									if (!ns1blankspace.util.isEmpty(oData))
									{									
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('SETUP_ACTION_TYPE_MANAGE'),
											data: oData,
											dataType: 'json',
											success: function (data) {ns1blankspace.setup.action.save.process(data, oData)}
										});
										
									}
									else
									{
										ns1blankspace.status.message('Saved');
									}
								},

					process:	function (oResponse, oData)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');

										var bNew = (ns1blankspace.objectContext == -1)
										ns1blankspace.objectContext = oResponse.id;	
										ns1blankspace.inputDetected = false;

										ns1blankspace.setup.action.init(
										{
											id: ns1blankspace.objectContext
										});
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}
				}			
}