/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.setup.userRole = 
{
	init: 	function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 22;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'userRole';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'User Roles';
					ns1blankspace.objectMethod = 'SETUP_ROLE';

					ns1blankspace.app.set(oParam);


				},

	home: 		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
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
							'<tr><td><div id="ns1blankspaceViewSetupUserLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>' +
							'</table>');	
						
						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlInitialise" class="ns1blankspaceControl"><div>Templates</div>' +
							'<div class="ns1blankspaceSubNote">import a common user role</div>' +
							'</td></tr>');

						aHTML.push('</table>');

						$('#ns1blankspaceControl').html(aHTML.join(''));

						$('#ns1blankspaceControlInitialise').click(function(event)
						{
							//ns1blankspace.show({selector: '#ns1blankspaceMainInitialise', context: {inContext: false}});
							ns1blankspace.setup.userRole.initialise.init();
						});
						
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_ROLE_SEARCH';
						oSearch.addField('title,selfsignupavailable,notes,contactbusinessgrouptype');
						oSearch.rows = 50;
						oSearch.sort('title', 'asc');
						oSearch.getResults(function (data) {ns1blankspace.setup.userRole.home(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">' +
											'<tr><td class="ns1blankspaceNothing">Click New or Templates to create a user role.</td></tr>' +
											'</table>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceCaption">RECENT</td></tr>');
							
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
							ns1blankspace.setup.userRole.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function (sXHTMLElementID, oParam)
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
										oSearch.method = 'SETUP_ROLE_SEARCH';
										oSearch.addField('title,notes,modifieddate,selfsignupavailable,contactbusinessgrouptype');
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(data) {ns1blankspace.setup.userRole.show(data)});
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
											oSearch.method = 'SETUP_ROLE_SEARCH';
											oSearch.addField('title');
											
											if (iSource == ns1blankspace.data.searchSource.browse)
											{
												oSearch.addFilter('title', 'TEXT_STARTS_WITH', sSearchText);
											}
											else
											{	
												oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
											}	
											
											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.getResults(ns1blankspace.setup.userRole.search.process);
										}
									};	
								},

					process:	function (oResponse)
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
											
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
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
											ns1blankspace.setup.userRole.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'title',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.setup.userRole.search.send
										});   
									}			
								}
				},

	layout:	function ()
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
													
						aHTML.push('</table>');
									
						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlAccess" class="ns1blankspaceControl">' +
										'Access</td></tr>');

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlUsers" class="ns1blankspaceControl">' +
										'Users<br /><span class="ns1blankspaceSubNote">assigned this role</span></td></tr>');
					}	

					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];
				
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAccess" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainUsers" class="ns1blankspaceControlMain"></div>');
							
					$('#ns1blankspaceMain').html(aHTML.join(''));
						
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.setup.userRole.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.setup.userRole.details();
					});
					
					$('#ns1blankspaceControlAccess').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAccess', refresh: true });
						ns1blankspace.setup.userRole.access.show();
					});

					$('#ns1blankspaceControlUsers').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainUsers'});
						ns1blankspace.setup.userRole.users.show();
					});
				},

	show:		function (oResponse)
				{
					ns1blankspace.app.clean();
					ns1blankspace.setup.userRole.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this user role.</td></tr></table>');
								
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
							newDestination: 'ns1blankspace.setup.userRole.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.setup.userRole.summary()'})
					}	
				},	
		
	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this user role.</td></tr></table>');
								
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

						aHTML.push('<table>');
									
						if (ns1blankspace.objectContextData.notes != '')
						{				
							aHTML.push('<tr><td class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.notes +
										'</td></tr>');
						}	

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Last Updated</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryLastUpdated" class="ns1blankspaceSummary">' +
										Date.parse(ns1blankspace.objectContextData.modifieddate).toString("dd MMM yyyy") +
										'</td></tr>');	
						
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
						
						aHTML.push('<table class="ns1blankspaceContainer">');
						aHTML.push('<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>');
						aHTML.push('</table>');					
						
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
										'Notes' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceMultiText">' +
										'<textarea rows="10" cols="35" id="ns1blankspaceDetailsNotes" class="ns1blankspaceTextMultiSmall"></textarea>' +
										'</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));

						$('#ns1blankspaceDetailsTitle').focus();
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#ns1blankspaceDetailsNotes').val(ns1blankspace.objectContextData.notes);
						}
					}	
				},

	save: 		{
					send: 		function ()
								{
									ns1blankspace.status.working();

									var sData = '_=1';
									
									if (ns1blankspace.objectContext != -1)
									{
										sData += '&id=' + ns1blankspace.util.fs(ns1blankspace.objectContext);	
									}	
									
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTitle').val());
										sData += '&notes=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsNotes').val());
									};

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('SETUP_ROLE_MANAGE'),
										data: sData,
										dataType: 'json',
										success: this.process
									});		
								},

					process: 	function (oResponse)
								{	
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');
										ns1blankspace.inputDetected = false;
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
										
										if (bNew) {ns1blankspace.setup.userRole.search.send('-' + ns1blankspace.objectContext)}
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}			
				},				

	access: 	{
					show: 		function(oParam, oResponse)
								{
									var sAccessType = ns1blankspace.util.getParam(oParam, 'accessType', {"default": 'methods'}).value;

									$vq.clear({queue: 'access'});

									$vq.add('<table class="ns1blankspaceContainer">', {queue: 'access'});

									$vq.add('<tr class="ns1blankspaceContainer">' +
												'<td id="ns1blankspaceAccessColumn1Container" class="ns1blankspaceColumn1Flexible">', {queue: 'access'});

										$vq.add('<table>', {queue: 'access'});

										$vq.add('<tr><td id="ns1blankspaceAccessColumnType">', {queue: 'access'});

										$vq.add('<div style="width:380px;"><div id="ns1blankspaceAccessType" style="margin-left:0px; margin-right:3px; margin-bottom:5px; width:360px; float:left;">' +
												'<input style="width: 100%;" type="radio" id="ns1blankspaceAccessType-methods" name="radioAccessType" />' +
													'<label for="ns1blankspaceAccessType-methods" style="width:80px; font-size:0.75em;">' +
													'Methods</label>' +
												'<input style="width: 100%;" type="radio" id="ns1blankspaceAccessType-parameters" name="radioAccessType" />' +
													'<label for="ns1blankspaceAccessType-parameters" style="width:90px; font-size:0.75em;">' +
													'Properties</label>' +
												'<input style="width: 100%;" type="radio" id="ns1blankspaceAccessType-data" name="radioAccessType" />' +
													'<label for="ns1blankspaceAccessType-data" style="width:75px; font-size:0.75em;">' +
													'Data</label>' +	
												'</div>', {queue: 'access'});

										$vq.add('</td></tr>', {queue: 'access'})

										$vq.add('<tr><td id="ns1blankspaceAccessColumn1" class="ns1blankspaceColumn1Flexible">' +
													 '</td></tr>', {queue: 'access'});

										$vq.add('</table>', {queue: 'access'});

									$vq.add('</td>', {queue: 'access'});	
													
									$vq.add('<td id="ns1blankspaceAccessColumn2" class="ns1blankspaceColumn2" style="width:175px;"></td>' +
													'</tr>', {queue: 'access'});

									$vq.add('</table>', {queue: 'access'});					
									
									$vq.render('#ns1blankspaceMainAccess', {queue: 'access'});

									$('#ns1blankspaceAccessType-' + sAccessType).attr('checked', true);

									$('#ns1blankspaceAccessType').buttonset();
														
									$('#ns1blankspaceAccessType :radio').click(function()
									{
										ns1blankspace.setup.userRole.access[(this.id).split('-')[1]].show();
									});

									ns1blankspace.setup.userRole.access.methods.show();
								},

					data: 		{
									show: 		function (oParam, oResponse)
												{
													if (oResponse == undefined)
													{
														$vq.init('<table class="ns1blankspaceColumn2">');
														/*
														$vq.add('<tr><td>' +
																		'<span id="ns1blankspaceUserRoleAccessEdit" class="ns1blankspaceAction">Edit</span>' +
																		'</td></tr>');

														$vq.add('<tr><td style="padding-top:12px;" class="ns1blankspaceSubNote">' +
																		'Set up restricted access to data.' +
																		'</td></tr>');
														*/				

														$vq.add('<tr><td style="padding-top:12px;" class="ns1blankspaceSubNote">' +
																		'<a href="http://docs.mydigitalstructure.com/gettingstarted_responsive_controls" target="_blank">More on data access control.</a>' +
																		'</td></tr>');
																		
														$vq.add('</table>');					
														
														$vq.render('#ns1blankspaceAccessColumn2');

														$('#ns1blankspaceUserRoleAccessEdit').button(
														{
															label: "Edit"
														})
														.click(function()
														{
															 ns1blankspace.setup.userRole.access.data.edit();
														})

														var oSearch = new AdvancedSearch();
														oSearch.method = 'SETUP_ROLE_OBJECT_ACCESS_SEARCH';
														oSearch.addField('canremove,cansearch,canupdate,notes,object,objecttext,objectcontext,createduser,createdusertext,createddate');
														oSearch.addFilter('role', 'EQUAL_TO', ns1blankspace.objectContext);
														oSearch.rows = ns1blankspace.option.defaultRows;
														oSearch.sort('createddate', 'desc');
														oSearch.getResults(function(data) {ns1blankspace.setup.userRole.access.data.show(oParam, data)});
													}
													else
													{
														var aHTML = [];
										
														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<table><tr><td class="ns1blankspaceNothing">No data access set up.</td></tr></table>');

															aHTML.push('</table>');

															$('#ns1blankspaceAccessColumn1').html(aHTML.join(''));
														}
														else
														{		
															aHTML.push('<table id="ns1blankspaceUserRoleAccess" class="ns1blankspaceContainer" style="font-size:0.875em;">');
															
															aHTML.push('<tr class="ns1blankspaceCaption">');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Context</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Notes</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Search</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Update</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Remove</td>');
															aHTML.push('</tr>');

															$.each(oResponse.data.rows, function()
															{
																aHTML.push(ns1blankspace.setup.userRole.access.data.row(this));
															});
																
															aHTML.push('</table>');
															
															ns1blankspace.render.page.show(
															{
																xhtmlElementID: 'ns1blankspaceAccessColumn1',
																xhtmlContext: 'UserRoleAccess',
																xhtml: aHTML.join(''),
																showMore: (oResponse.morerows == "true"),
																more: oResponse.moreid,
																rows: ns1blankspace.option.defaultRows,
																functionShowRow: ns1blankspace.setup.userRole.access.data.row,
																functionOnNewPage: ns1blankspace.setup.userRole.access.data.bind,
																headerRow: true,
															});
														}
													}
												},		

									row:		function (oRow)
												{
													var aHTML = [];

													aHTML.push('<tr class="ns1blankspaceRow">');
													aHTML.push('<td id="ns1blankspaceUserRoleAccess_object-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
																			' data-object="' + oRow.object + '"' +
																			' data-objectcontext="' + oRow.objectcontext + '">' +
																			'...</td>');
													aHTML.push('<td id="ns1blankspaceUserRoleAccess_object-' + oRow.id + '" class="ns1blankspaceRow">' +
																			oRow.notes + '</td>');
													aHTML.push('<td id="ns1blankspaceUserRoleAccess_search-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:center;">' +
																			(oRow.cansearch=='N'?'No':'Yes') + '</td>');
													aHTML.push('<td id="ns1blankspaceUserRoleAccess_update-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:center;">' +
																			(oRow.canupdate=='N'?'No':'Yes') + '</td>');
													aHTML.push('<td id="ns1blankspaceUserRoleAccess_remove-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:center;">' +
																			(oRow.canremove=='N'?'No':'Yes') + '</td>');

													aHTML.push('</tr>');

													return aHTML.join('');						
												},

									bind:  		function (oParam)
												{
													var aObjectContextIDs = $.map($('#ns1blankspaceUserRoleAccess td[data-objectcontext]'),
																				function (s) {return $(s).attr('data-objectcontext')});

													var oSearch = new AdvancedSearch();
													oSearch.method = 'STRUCTURE_DATA_SEARCH';
													oSearch.addField('reference,title,structuretext,completedbyusertext,contactbusinesstext,contactpersontext,referencedate,modifieddate');
													oSearch.addFilter('id', 'IN_LIST', aObjectContextIDs.join(','));
													oSearch.rows = 100;
													oSearch.getResults(function (oResponse)
													{
														$.each(oResponse.data.rows, function (r, row)
														{
															if (row.contactbusinesstext != '' || row.contactpersontext != '')
															{	
																var sObject = row.contactbusinesstext;
																if (sObject != '') {sObject += ' '}
																sObject += row.contactpersontext;
																$('#ns1blankspaceRenderPage_UserRoleAccess-0 td[data-objectcontext="' + row.id + '"]').html(sObject);
															}
														})
													});

													$('#ns1blankspaceUserRoleAccess .ns1blankspaceRowSelect').click(function ()
													{
														ns1blankspace.structureData.init({id: $(this).attr('data-objectcontext')})
													});
												}			
								},							
						
					methods: 	{
									show: 		function (oParam, oResponse)
												{
													if (oResponse == undefined)
													{
														$vq.init('<table class="ns1blankspaceColumn2">');
														
														$vq.add('<tr><td>' +
																		'<span id="ns1blankspaceUserRoleAccessEdit" class="ns1blankspaceAction">Edit</span>' +
																		'</td></tr>');

														$vq.add('<tr><td style="padding-top:12px;" class="ns1blankspaceSubNote">' +
																		'Set up restricted access to functions/methods.' +
																		'</td></tr>');

														$vq.add('<tr><td style="padding-top:12px;" class="ns1blankspaceSubNote">' +
																		'<a href="http://mydigitalstructure.com/gettingstarted_access_control" target="_blank">More on access control.</a>' +
																		'</td></tr>');
																		
														$vq.add('</table>');					
														
														$vq.render('#ns1blankspaceAccessColumn2');

														$('#ns1blankspaceUserRoleAccessEdit').button(
														{
															label: "Edit"
														})
														.click(function()
														{
															 ns1blankspace.setup.userRole.access.methods.edit();
														})

														var oSearch = new AdvancedSearch();
														oSearch.method = 'SETUP_ROLE_METHOD_ACCESS_SEARCH';
														oSearch.addField('access,accesstext,accessmethod,accessmethodtext,canadd,canremove,canupdate,canuse,guidmandatory');
														oSearch.addFilter('role', 'EQUAL_TO', ns1blankspace.objectContext);
														oSearch.rows = ns1blankspace.option.defaultRows;
														oSearch.sort('accessmethodtext', 'asc');
														oSearch.getResults(function(data) {ns1blankspace.setup.userRole.access.methods.show(oParam, data)});
													}
													else
													{
														var aHTML = [];
										
														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<table><tr><td class="ns1blankspaceNothing">No access set up.</td></tr></table>');

															aHTML.push('</table>');

															$('#ns1blankspaceAccessColumn1').html(aHTML.join(''));
														}
														else
														{		
															aHTML.push('<table id="ns1blankspaceUserRoleAccess" class="ns1blankspaceContainer" style="font-size:0.875em;">');
															
															aHTML.push('<tr class="ns1blankspaceCaption">');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Title</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Search</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:center;">(GUID)</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Add</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Update</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Remove</td>');
															aHTML.push('</tr>');

															$.each(oResponse.data.rows, function()
															{
																aHTML.push(ns1blankspace.setup.userRole.access.methods.row(this));
															});
																
															aHTML.push('</table>');
															
															ns1blankspace.render.page.show(
															{
																xhtmlElementID: 'ns1blankspaceAccessColumn1',
																xhtmlContext: 'UserRoleAccess',
																xhtml: aHTML.join(''),
																showMore: (oResponse.morerows == "true"),
																more: oResponse.moreid,
																rows: ns1blankspace.option.defaultRows,
																functionShowRow: ns1blankspace.setup.userRole.access.methods.row,
																headerRow: true,
															});
														}
													}
												},		

									row:		function (oRow)
												{
													var aHTML = [];

													aHTML.push('<tr class="ns1blankspaceRow">');
													aHTML.push('<td id="ns1blankspaceUserRoleAccess_method-' + oRow.id + '" class="ns1blankspaceRow">' +
																			oRow.accessmethodtext + '</td>');
													aHTML.push('<td id="ns1blankspaceUserRoleAccess_search-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:center;">' +
																			(oRow.canuse=='N'?'-':'Yes') + '</td>');

													aHTML.push('<td id="ns1blankspaceUserRoleAccess_guid-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceSub" style="text-align:center;">' +
																			(oRow.guidmandatory=='Y'?'Yes':'No') + '</td>');
													aHTML.push('<td id="ns1blankspaceUserRoleAccess_add-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:center;">' +
																			(oRow.canadd=='N'?'-':'Yes') + '</td>');
													aHTML.push('<td id="ns1blankspaceUserRoleAccess_update-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:center;">' +
																			(oRow.canupdate=='N'?'-':'Yes') + '</td>');
													aHTML.push('<td id="ns1blankspaceUserRoleAccess_remove-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:center;">' +
																			(oRow.canremove=='N'?'-':'Yes') + '</td>');

													aHTML.push('</tr>');

													return aHTML.join('');						
												},			

									edit: 		function (oParam, oResponse)
												{
													var iStep = 1;
													var iEndpoint;
													var oMethods;

													if (oParam != undefined)
													{
														if (oParam.step != undefined) {iStep = oParam.step}
														if (oParam.endpoint != undefined) {iEndpoint = oParam.endpoint}
														if (oParam.methods != undefined) {oMethods = oParam.methods}
													}
														
													if (iStep == 1)
													{
														var aHTML = [];
														
														aHTML.push('<table class="ns1blankspaceContainer">' +
																		'<tr class="ns1blankspaceContainer">' +
																		'<td id="ns1blankspaceAccessColumnEndpoint" class="ns1blankspaceColumn1" style="width:100px;padding-right:5px;font-size:0.875em;">' +
																			ns1blankspace.xhtml.loading + '</td>' +
																		'<td id="ns1blankspaceAccessColumnMethod" class="ns1blankspaceColumn2" style="width:200px;padding-right:5px;font-size:0.875em;"></td>' +
																		'<td id="ns1blankspaceAccessColumnEdit" class="ns1blankspaceColumn2" style="width:280px;padding-right:15px;font-size:0.875em;"></td>' +
																		'<td id="ns1blankspaceAccessColumnAction" class="ns1blankspaceColumn2"></td>' +
																		'</tr>' + 
																		'</table>');			
																
														$('#ns1blankspaceMainAccess').html(aHTML.join(''));

														if (oResponse == undefined)
														{
															var oSearch = new AdvancedSearch();
															oSearch.method = 'SETUP_ENDPOINT_SEARCH';
															oSearch.addField('title');
															oSearch.rows = 1000;
															oSearch.sort('title', 'asc');
															oSearch.getResults(function(data) {ns1blankspace.setup.userRole.access.methods.edit(oParam, data)})	
														}
														else
														{
															var aHTML = [];
														
															ns1blankspace.endpoints = oResponse.data.rows;
													
															aHTML.push('<table id="ns1blankspaceUserAccessEndpoints">');
															
															if (oResponse.data.rows.length == 0)
															{
																aHTML.push('<tr><td class="ns1blankspaceNothing">' +
																				'No access to endpoints has been setup.<br /><br / >You need to subscribe to at least one membership.</td></tr>');
															}
															else
															{		
																$(oResponse.data.rows).each(function()
																{
																	aHTML.push('<tr class="ns1blankspaceRow">');
																	
																	aHTML.push('<td id="ns1blankspaceUserRoleEndpoint_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
																							' title="">' +
																							(this.title).toUpperCase() + '</td>');

																	aHTML.push('</tr>');

																});
															}	
														
															aHTML.push('</table>');
																
															$('#ns1blankspaceAccessColumnEndpoint').html(aHTML.join(''));

															$('#ns1blankspaceUserAccessEndpoints td.ns1blankspaceRowSelect').click(function(event)
															{
																var sXHTMLElementId = event.target.id;
																var aID = sXHTMLElementId.split('-');
																
																ns1blankspace.setup.userRole.access.methods.edit({endpoint: aID[1], step: 3});
															});
														}
													}	
													else if (iStep == 2)
													{
														if (oResponse == undefined)
														{
															var oSearch = new AdvancedSearch();
															oSearch.method = 'SETUP_METHOD_SEARCH';
															oSearch.addField('title,useavailable,addavailable,updateavailable,removeavailable');
															oSearch.addFilter('endpoint', 'EQUAL_TO', iEndpoint)
															oSearch.rows = 500;
															oSearch.sort('title', 'asc');
															oSearch.getResults(function(data) {ns1blankspace.setup.userRole.access.methods.edit(oParam, data)})	
														}
														else
														{
															$.extend(true, oParam, {step: 3, methods: oResponse.data.rows});
															ins1blankspace.setup.userRole.access.methods.edit(oParam);	
														}
													}

													else if (iStep == 3)
													{
														if (oResponse == undefined)
														{
															$('#ns1blankspaceAccessColumnMethod').html(ns1blankspace.xhtml.loadingSmall);
															$('#ns1blankspaceAccessColumnEdit').html("");

															var aHTML = [];
															
															aHTML.push('<table class="ns1blankspaceColumn2">' +
																			'<tr><td><span id="ns1blankspaceUserAccessAdd" class="ns1blankspaceAction">' +
																			'Add</span></td></tr>' +
																			'</table>');									
															
															//$('#ns1blankspaceAccessColumnAction').html(aHTML.join(''));
															$('#ns1blankspaceAccessColumnAction').html('');
														
															$('#ns1blankspaceUserAccessAdd').button(
															{
																label: "Add"
															})
															.click(function()
															{
																$.extend(true, oParam, {step: 4, xhtmlElementID: ""});
																ns1blankspace.setup.userRole.access.methods.edit(oParam);
															})

															var oSearch = new AdvancedSearch();
															oSearch.method = 'SETUP_METHOD_SEARCH';
															oSearch.addField('title,useavailable,addavailable,updateavailable,removeavailable');
															oSearch.addFilter('endpoint', 'EQUAL_TO', iEndpoint)
															oSearch.rows = 1000;
															oSearch.sort('title', 'asc');
															oSearch.getResults(function(data) {ns1blankspace.setup.userRole.access.methods.edit(oParam, data)})	
														}
														else
														{
															var aHTML = [];
													
															aHTML.push('<table id="ns1blankspaceUserAccessMethods" class="ns1blankspaceColumn2">');
														
															if (oResponse.data.rows.length == 0)
															{
																aHTML.push('<tr><td class="ns1blankspaceNothing">' +
																				'No functional rights available.</td></tr>');
															}
															else
															{		
																$(oResponse.data.rows).each(function()
																{
																	aHTML.push('<tr class="ns1blankspaceRow">');

																	aHTML.push('<td id="ns1blankspaceUserAccessMethod_title-' + this.id +
																						'-' + this.addavailable +
																						'-' + this.removeavailable +
																						'-' + this.updateavailable +
																						'-' + this.useavailable +
																						'" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
																						' title="">' +
																							this.title + '</td>');
															
																	aHTML.push('</tr>');
																});
															
																aHTML.push('</table>');
															}
														
															$('#ns1blankspaceAccessColumnMethod').html(aHTML.join(''));

															$('#ns1blankspaceUserAccessMethods td.ns1blankspaceRowSelect').click(function()
															{
																$.extend(true, oParam, {step: 4, xhtmlElementID: this.id});
																ns1blankspace.setup.userRole.access.methods.edit(oParam);
															})
														}
													}

													else if (iStep == 4)
													{
														var sXHTMLElementID;
														
														if (oParam != undefined)
														{
															if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
														}
														
														if (sXHTMLElementID != undefined)
														{
															var aXHTMLElementID = sXHTMLElementID.split('-');
														}	

														var oSearch = new AdvancedSearch();
														oSearch.method = 'SETUP_ROLE_METHOD_ACCESS_SEARCH';
														oSearch.addField('canadd,canremove,canupdate,canuse,guidmandatory');
														oSearch.addFilter('role', 'EQUAL_TO', ns1blankspace.objectContext);
														oSearch.addFilter('accessmethod', 'EQUAL_TO', aXHTMLElementID[1]);

														oSearch.getResults(function(data) {
																$.extend(true, oParam, {step: 5});
																ns1blankspace.setup.userRole.access.methods.edit(oParam, data)
																});
													}

													else if (iStep == 5)
													{
														var sID; 
														var sXHTMLElementID;
														var aXHTMLElementID;
														var aHTML = [];
														var h = -1;
														var bCan = false;

														if (oParam != undefined)
														{
															if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
														}
														
														if (sXHTMLElementID != undefined)
														{
															aXHTMLElementID = sXHTMLElementID.split('-');
														}	
													
														aHTML.push('<table id="ns1blankspaceUserAccessMethods" class="ns1blankspaceColumn2">');

														if (oResponse != undefined)
														{
															if (oResponse.data.rows.length > 0)
															{
																sID = oResponse.data.rows[0].id;
															}
															else
															{
																aHTML.push('<tr><td class="ns1blankspaceNothing">' +
																				'This role doesn\'t have access to this method.  Click Save to add it.</td></tr>');
															}
														}

														if (aXHTMLElementID[5] == 'Y')
														{
															bCan = true;			
															aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																			'Search?' +
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceRadio">' +
																			'<input type="radio" id="radioCanUseY" name="radioCanUse" value="Y"/>Yes' +
																			'<br /><input type="radio" id="radioCanUseN" name="radioCanUse" value="N"/>No' +
																			'</td></tr>');

															aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																			'GUID is required?' +
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceRadio">' +
																			'<input type="radio" id="radioNeedGUIDY" name="radioNeedGUID" value="Y"/>Yes' +
																			'<br /><input type="radio" id="radioNeedGUIDN" name="radioNeedGUID" value="N"/>No' +
																			'</td></tr>');
														}

														if (aXHTMLElementID[2] == 'Y')
														{		
															bCan = true;	
															aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																			'Add?' +
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceRadio">' +
																			'<input type="radio" id="radioCanAddY" name="radioCanAdd" value="Y"/>Yes' +
																			'<br /><input type="radio" id="radioCanAddN" name="radioCanAdd" value="N"/>No' +
																			'</td></tr>');
														}
															
														if (aXHTMLElementID[4] == 'Y')
														{	
															bCan = true;		
															aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																			'Update?' +
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceRadio">' +
																			'<input type="radio" id="radioCanUpdateY" name="radioCanUpdate" value="Y"/>Yes' +
																			'<br /><input type="radio" id="radioCanUpdateN" name="radioCanUpdate" value="N"/>No' +
																			'</td></tr>');
														}
															
														if (aXHTMLElementID[3] == 'Y')
														{		
															bCan = true;	
															aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																			'Remove?' +
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceRadio">' +
																			'<input type="radio" id="radioCanRemoveY" name="radioCanRemove" value="Y"/>Yes' +
																			'<br /><input type="radio" id="radioCanRemoveN" name="radioCanRemove" value="N"/>No' +
																			'</td></tr>');
														}
		
														if (!bCan)
														{
															aHTML.push('<tr><td class="ns1blankspaceNothing">' +
																				'Can not set any access to this functionality.</td></tr>');

														}

														aHTML.push('</table>');					
														
														$('#ns1blankspaceAccessColumnEdit').html(aHTML.join(''));
														
														var aHTML = [];
														
														aHTML.push('<table class="ns1blankspace" style="font-size:0.875em">');
																
														aHTML.push('<tr><td>' +
																		'<span style="width:70px;" id="ns1blankspaceUserAccessSave" class="ns1blankspaceAction">Save</span>' +
																		'</td></tr>');
																		
														aHTML.push('<tr><td>' +
																		'<span style="width:70px;" id="ns1blankspaceUserAccessCancel" class="ns1blankspaceAction">Cancel</span>' +
																		'</td></tr>');
																							
														aHTML.push('</table>');					
															
														$('#ns1blankspaceAccessColumnAction').html(aHTML.join(''));
														
														$('#ns1blankspaceUserAccessSave').button(
														{
															text: "Save"
														})
														.click(function() 
														{
															ns1blankspace.status.working();

															var sData = 'id=' + ns1blankspace.util.fs(sID);
															sData += '&role=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
															sData += '&accessmethod=' + ns1blankspace.util.fs(aXHTMLElementID[1]);
															sData += '&canadd=' + (ns1blankspace.util.fs($('input[name="radioCanAdd"]:checked').val()) != '' ? ns1blankspace.util.fs($('input[name="radioCanAdd"]:checked').val()) : 'N');
															sData += '&canremove=' + (ns1blankspace.util.fs($('input[name="radioCanRemove"]:checked').val()) != '' ? ns1blankspace.util.fs($('input[name="radioCanRemove"]:checked').val()) : 'N');
															sData += '&canupdate=' + (ns1blankspace.util.fs($('input[name="radioCanUpdate"]:checked').val()) != '' ? ns1blankspace.util.fs($('input[name="radioCanUpdate"]:checked').val()) : 'N');
															sData += '&canuse=' + (ns1blankspace.util.fs($('input[name="radioCanUse"]:checked').val()) != '' ? ns1blankspace.util.fs($('input[name="radioCanUse"]:checked').val()) : 'N');
															sData += '&guidmandatory=' + (ns1blankspace.util.fs($('input[name="radioNeedGUID"]:checked').val()) != '' ? ns1blankspace.util.fs($('input[name="radioNeedGUID"]:checked').val()) : 'N');

															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI('SETUP_ROLE_METHOD_ACCESS_MANAGE'),
																data: sData,
																dataType: 'json',
																success: function(data)
																{
																	if (data.status == "OK")
																	{
																		ns1blankspace.status.message('Saved');
																	}
																	else
																	{
																		ns1blankspace.status.error(data.error.errornotes);
																	}
																}
															});
														});

														$('#ns1blankspaceUserAccessCancel').button(
														{
															text: "Cancel"
														})
														.click(function() 
														{
															$.extend(true, oParam, {step: 2});
															ins1blankspace.setup.userRole.access.methods.edit(oParam);
														});

														if (oResponse.data.rows.length != 0)
														{
															var oObjectContext = oResponse.data.rows[0];
															
															$('[name="radioCanAdd"][value="' + oObjectContext.canadd + '"]').attr('checked', true);
															$('[name="radioCanRemove"][value="' + oObjectContext.canremove + '"]').attr('checked', true);
															$('[name="radioCanUpdate"][value="' + oObjectContext.canupdate + '"]').attr('checked', true);
															$('[name="radioCanUse"][value="' + oObjectContext.canuse + '"]').attr('checked', true);
															$('[name="radioNeedGUID"][value="' + oObjectContext.guidmandatory + '"]').attr('checked', true);
														}
														else
														{
															$('[name="radioCanAdd"][value="Y"]').attr('checked', true);
															$('[name="radioCanRemove"][value="Y"]').attr('checked', true);
															$('[name="radioCanUpdate"][value="Y"]').attr('checked', true);
															$('[name="radioCanUse"][value="Y"]').attr('checked', true);
															$('[name="radioCanUse"][value="N"]').attr('checked', true);
														}
													}
												}
								},

					parameters: {
									show: 		function (oParam, oResponse)
												{
													var iAccessMethod = ns1blankspace.util.getParam(oParam, 'accessmethod').value;

													if (oResponse == undefined)
													{
														$vq.init('<table class="ns1blankspaceColumn2">');
														
														$vq.add('<tr><td>' +
																		'<span id="ns1blankspaceUserRoleAccessParametersAdd" class="ns1blankspaceAction">Add</span>' +
																		'</td></tr>');

														$vq.add('<tr><td style="padding-top:12px;" class="ns1blankspaceSubNote">' +
																		'Set up restricted access to function/method based on property value.' +
																		'</td></tr>');

														$vq.add('<tr><td style="padding-top:12px;" class="ns1blankspaceSubNote">' +
																		'<a href="http://mydigitalstructure.com/gettingstarted_access_control" target="_blank">More on access control.</a>' +
																		'</td></tr>');

														$vq.add('<tr><td style="padding-top:12px;" class="ns1blankspaceSubNote">' +
																		'i.e. restrict access to PRODUCT_ORDER_MANAGE where status=6 (Requires Approval)' +
																		'</td></tr>');
																		
														$vq.add('</table>');					
														
														$vq.render('#ns1blankspaceAccessColumn2');
													
														$('#ns1blankspaceUserRoleAccessParametersAdd').button(
														{
															label: "Add"
														})
														.click(function()
														{
															 ns1blankspace.setup.userRole.access.parameters.edit();
														})

														var oSearch = new AdvancedSearch();
														oSearch.method = 'SETUP_ROLE_PARAMETER_ACCESS_SEARCH';
														oSearch.addField('accessmethod,accessmethodtext,allowedvalues,disallowedvalues,id,notes,parameter,type');
														
														if (iAccessMethod != undefined)
														{	
															oSearch.addFilter('accessmethod', 'EQUAL_TO', iAccessMethod);
														}

														oSearch.addFilter('role', 'EQUAL_TO', ns1blankspace.objectContext);
														oSearch.rows = 100;
														oSearch.sort('accessmethodtext', 'asc');
														oSearch.getResults(function(data) {ns1blankspace.setup.userRole.access.parameters.show(oParam, data)});
													}
													else
													{
														var aHTML = [];
										
														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<table><tr><td class="ns1blankspaceNothing">No property value based access set up.</td></tr></table>');

															aHTML.push('</table>');

															$('#ns1blankspaceAccessColumn1').html(aHTML.join(''));
														}
														else
														{		
															aHTML.push('<table id="ns1blankspaceUserRoleAccess" class="ns1blankspaceContainer" style="font-size:0.875em;">');
															
															aHTML.push('<tr class="ns1blankspaceCaption">');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="vertical-align:bottom;">Method</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="vertical-align:bottom;">Property</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Values<br />Allowed</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="vertical-align:bottom;">Disallowed</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
															aHTML.push('</tr>');

															$.each(oResponse.data.rows, function()
															{
																aHTML.push(ns1blankspace.setup.userRole.access.parameters.row(this));
															});
																
															aHTML.push('</table>');
															
															ns1blankspace.render.page.show(
															{
																xhtmlElementID: 'ns1blankspaceAccessColumn1',
																xhtmlContext: 'UserRoleAccess',
																xhtml: aHTML.join(''),
																showMore: (oResponse.morerows == "true"),
																more: oResponse.moreid,
																rows: ns1blankspace.option.defaultRows,
																functionShowRow: ns1blankspace.setup.userRole.access.parameters.row,
																functionOnNewPage: ns1blankspace.setup.userRole.access.parameters.bind,
																headerRow: true,
															});
														}
													}
												},

									row: 		function (oRow)
												{
													$vq.init('<tr class="ns1blankspaceRow">');
																				
													$vq.add('<td id="ns1blankspaceAccessParameters_method-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																			(oRow.accessmethodtext==''?'[All]':oRow.accessmethodtext) + '</td>');
													$vq.add('<td id="ns1blankspaceAccessParameters_parameter-' + oRow.id + '" class="ns1blankspaceRow">' +
																			oRow.parameter + '</td>');
													$vq.add('<td id="ns1blankspaceAccessParameters_allowedvalues-' + oRow.id + '" class="ns1blankspaceRow">' +
																			oRow.allowedvalues + '</td>');
													$vq.add('<td id="ns1blankspaceAccessParameters_disallowedvalues-' + oRow.id + '" class="ns1blankspaceRow">' +
																			oRow.disallowedvalues + '</td>');
																											
													$vq.add('<td style="width:30px; text-align:right;" class="ns1blankspaceRow">');
													
													$vq.add('<span id="ns1blankspaceAccessParameters_remove-' + oRow.id + '" class="ns1blankspaceRowRemove"></span>');
																		
													$vq.add('</td></tr>');

													return $vq.get('');
												},

									bind: 		function (oParam)
												{
													$('#ns1blankspaceUserRoleAccess .ns1blankspaceRowRemove').button(
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
															method: 'SETUP_ROLE_PARAMETER_ACCESS_MANAGE',
															ifNoneMessage: 'No property value based access set up.'
														});
													})
													.css('width', '15px')
													.css('height', '17px');

													$('#ns1blankspaceUserRoleAccess td.ns1blankspaceRowSelect')
													.click(function()
													{
														ns1blankspace.setup.userRole.access.parameters.edit({xhtmlElementID: this.id})
													});
												},
												
									edit: 		function (oParam, oResponse)
												{
													var sID; 
									
													if (oResponse == undefined)
													{
														var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

														if (sXHTMLElementID != undefined)
														{
															sID = sXHTMLElementID.split('-')[1];
														}	
													
														$vq.init('<table class="ns1blankspace" style="width:450px;">');
																
														$vq.add('<tr class="ns1blankspaceCaption">' +
																'<td class="ns1blankspaceCaption">' +
																'Method' +
																'</td></tr>' +
																'<tr class="ns1blankspaceSelect">' +
																'<td class="ns1blankspaceSelect">' +
																'<input id="ns1blankspaceSetupAccessMethod" class="ns1blankspaceSelect"' +
																	' data-method="SETUP_METHOD_SEARCH">' +
																'</td></tr>');	
												
														$vq.add('<tr><td class="ns1blankspaceCaption">' +
																'Property' +
																'</td></tr>' +
																'<tr class="ns1blankspaceText">' +
																'<td class="ns1blankspaceText">' +
																'<input id="ns1blankspaceSetupAccessParameter" class="ns1blankspaceText">' +
																'</td></tr>');

														$vq.add('<tr><td class="ns1blankspaceCaption">' +
																'Allowed Values' +
																'</td></tr>' +
																'<tr class="ns1blankspaceText">' +
																'<td class="ns1blankspaceText">' +
																'<input id="ns1blankspaceSetupAccessAllowedValues" class="ns1blankspaceText">' +
																'</td></tr>');

														$vq.add('<tr><td class="ns1blankspaceCaption">' +
																'Disallowed Values' +
																'</td></tr>' +
																'<tr class="ns1blankspaceText">' +
																'<td class="ns1blankspaceText">' +
																'<input id="ns1blankspaceSetupAccessDisallowedValues" class="ns1blankspaceText">' +
																'</td></tr>');
																		
														$vq.add('</table>');					
														
														$vq.render('#ns1blankspaceAccessColumn1');

														$vq.init('<table class="ns1blankspaceColumn2">');
																
														$vq.add('<tr><td>' +
																		'<span class="ns1blankspaceAction" style="width:70px;" id="ns1blankspaceAccessParameterSave">Save</span>' +
																		'</td></tr>');
													
														$vq.add('<tr><td>' +
																		'<span class="ns1blankspaceAction" style="width:70px;" id="ns1blankspaceAccessParameterCancel">Cancel</span>' +
																		'</td></tr>');

														$vq.add('<tr><td class="ns1blankspaceSubNote" style="padding-top:12px;">Leave method blank to set for all methods.</td></tr>');

														$vq.add('<tr><td id="ns1blankspaceAccessParameterAbout" class="ns1blankspaceSubNote" style="padding-top:12px;"></td></tr>');
																		
														$vq.add('</table>');	
					
														$vq.render('#ns1blankspaceAccessColumn2');
														
														$('#ns1blankspaceAccessParameterSave').button(
														{
															text: "Save"
														})
														.click(function() 
														{
															var oData =
															{
																id: sID,
																role: ns1blankspace.objectContext,
																type: 1,
																accessmethod: $('#ns1blankspaceSetupAccessMethod').attr('data-id'),
																parameter: $('#ns1blankspaceSetupAccessParameter').val(),
																allowedvalues: $('#ns1blankspaceSetupAccessAllowedValues').val(),
																disallowedvalues: $('#ns1blankspaceSetupAccessDisallowedValues').val()
															}

															ns1blankspace.status.working();

															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI('SETUP_ROLE_PARAMETER_ACCESS_MANAGE'),
																data: oData,
																dataType: 'json',
																success: function(data)
																{
																	if (data.status == 'OK')
																	{	
																		ns1blankspace.status.message('Access added.')
																		ns1blankspace.setup.userRole.access.parameters.show();
																	}
																}
															});
														});
														
														$('#ns1blankspaceAccessParameterCancel').button(
														{
															text: "Cancel"
														})
														.click(function() 
														{
															ns1blankspace.setup.userRole.access.parameters.show();
														});
														
														if (sID != undefined)
														{
															var oSearch = new AdvancedSearch();
															oSearch.method = 'SETUP_ROLE_PARAMETER_ACCESS_SEARCH';
															oSearch.addField('accessmethod,accessmethodtext,allowedvalues,disallowedvalues,notes,parameter,role,roletext,type');
															oSearch.addFilter('id', 'EQUAL_TO', sID)
															
															oSearch.getResults(function(oResponse)
															{
																ns1blankspace.setup.userRole.access.parameters.edit(oParam, oResponse)
															});
														}
													}
													else
													{
														if (oResponse.data.rows.length != 0)
														{
															var oObjectContext = oResponse.data.rows[0];
															$('#ns1blankspaceSetupAccessMethod').attr('data-id', oObjectContext.accessmethod);
															$('#ns1blankspaceSetupAccessMethod').val(oObjectContext.accessmethodtext);
															$('#ns1blankspaceSetupAccessParameter').val(oObjectContext.parameter);
															$('#ns1blankspaceSetupAccessAllowedValues').val(oObjectContext.allowedvalues);
															$('#ns1blankspaceSetupAccessDisallowedValues').val(oObjectContext.disallowedvalues);

															$('#ns1blankspaceAccessParameterAbout').html('<a href="http://mydigitalstructure.com/' + oObjectContext.accessmethodtext + '"' +
																											' target="_blank">About this method</a>'); 
														}
													}
												}								
								},						
				},

	users: 	{
					show:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_USER_ROLE_SEARCH';
										oSearch.addField('usertext,user,userrole.user.lastlogon,userrole.user.disabled,userrole.user.contactbusinesstext,' +
																'userrole.user.contactperson.firstname,userrole.user.contactperson.surname,' +
																'userrole.user.contactbusiness');

										oSearch.addFilter('role', 'EQUAL_TO', ns1blankspace.objectContext)
										oSearch.rows = 200;
										oSearch.sort('usertext', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.setup.userRole.users.show(oParam, data)});
									}
									else
									{
										if (oResponse.data.rows.length == 0)
										{
											$vq.init('<table>' +
														'<tr><td class="ns1blankspaceNothing">No users have been assigned to this role.</td></tr>' +
														'<tr><td class="ns1blankspaceNothing">Go to Users and then use the Access section to add.</td></tr>' +
														'</table>');

											$vq.render('#ns1blankspaceMainUsers');
										}
										else
										{		
											$vq.init('<table id="ns1blankspaceUserRoleAccessUsers" class="ns1blankspace">');
											
											$vq.add('<tr class="ns1blankspaceCaption">');
											$vq.add('<td class="ns1blankspaceHeaderCaption">Logon name</td>');
											$vq.add('<td class="ns1blankspaceHeaderCaption">First name</td>');
											$vq.add('<td class="ns1blankspaceHeaderCaption">Last name</td>');
											$vq.add('<td class="ns1blankspaceHeaderCaption">Status</td>');
											$vq.add('<td class="ns1blankspaceHeaderCaption">Business</td>');			
											$vq.add('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											$vq.add('</tr>');

											$.each(oResponse.data.rows, function()
											{
												$vq.add(ns1blankspace.setup.userRole.users.row(this));
											});
												
											$vq.add('</table>');
											
											ns1blankspace.render.page.show(
											{
												xhtmlElementID: 'ns1blankspaceMainUsers',
												xhtmlContext: 'UserRoleUsers',
												xhtml: $vq.get(),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: 200,
												functionShowRow: ns1blankspace.setup.userRole.users.row,
												functionOnNewPage: ns1blankspace.setup.userRole.users.bind,
												headerRow: true,
											});
										}
									}
								},

					row: 		function (oRow)
								{
									$vq.add('<tr class="ns1blankspaceRow">');
																
									$vq.add('<td id="ns1blankspaceUsers_logonname-' + oRow.user + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
															oRow.usertext + '</td>');

									var sContactBusiness = oRow['userrole.user.contactbusinesstext'];
									if (ns1blankspace.spaceContactBusiness == oRow['userrole.user.contactbusiness'])
									{
										sContactBusiness = '<div class="ns1blankspaceSub">Internal</div>'
									}

									$vq.add('<td id="ns1blankspaceUsers_firstname-' + oRow.user + '" class="ns1blankspaceRow">' +
															oRow['userrole.user.contactperson.firstname'] + '</td>');

									$vq.add('<td id="ns1blankspaceUsers_firstname-' + oRow.user + '" class="ns1blankspaceRow">' +
															oRow['userrole.user.contactperson.surname'] + '</td>');

									$vq.add('<td id="ns1blankspaceUsers_disabled-' + oRow.user + '" class="ns1blankspaceRow">' +
															(oRow['userrole.user.disabled']=='Y'?'Disabled':'Enabled') + '</td>');

									$vq.add('<td id="ns1blankspaceUsers_contactbusiness-' + oRow.user + '" class="ns1blankspaceRow">' +
															sContactBusiness + '</td>');
												
									$vq.add('<td style="width:30px; text-align:right;" class="ns1blankspaceRow">');
									
									$vq.add('<span id="ns1blankspaceUsersremove-' + oRow.id + '" class="ns1blankspaceRowRemove"></span>');
														
									$vq.add('</td></tr>');

									return $vq.get('');
								},

					bind: 	function (oParam)
								{
									$('#ns1blankspaceUserRoleAccessUsers td.ns1blankspaceRowSelect')
									.click(function()
									{
										ns1blankspace.setup.user.init({id: (this.id).split('-')[1]})
									});
								}		
				},

	initialise:
				{
					init: function (param)
					{
						ns1blankspace.setup.space.initialise.init({type: 2, xhtmlElementID: 'ns1blankspaceMain'})
					}
				}						
}				