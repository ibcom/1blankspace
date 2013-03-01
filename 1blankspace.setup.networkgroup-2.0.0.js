/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.setup.networkGroup = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.app.reset();

					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'networkGroup';
					ns1blankspace.viewName = 'Network Groups';
					
					ns1blankspace.app.set(oParam);
				},

	home:		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ins1blankspaceMain">' +
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
						oSearch.method = 'SETUP_NETWORK_GROUP_SEARCH';
						oSearch.addField('title');
						oSearch.rows = 10;
						oSearch.addSummaryField('count networkgroupcount')
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(function(data) {ns1blankspace.setup.networkGroup.home(oParam, data)});	
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a tdInterfaceNetworkGroupHomeMostLikely.</td></tr>' +
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
							ns1blankspace.setup.networkGroup.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function (sXHTMLElementId, iSource, sSearchText, sSearchContext)
								{
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
										
									if (iSource == undefined)
									{
										iSource = ns1blankspace.data.searchSource.text;
									}	
										
									if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
									{
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_NETWORK_GROUP_SEARCH';
										oSearch.addField('title,notes');
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(data) {ns1blankspace.setup.networkGroup.show(data)});
									}
									else
									{
										var iMinimumLength = 3;
										var iMaximumColumns = 1;
										
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
											
											var sParam = 'method=SETUP_NETWORK_GROUP_SEARCH&quicksearch=' + sSearchText;

											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('SETUP_NETWORK_GROUP_SEARCH'),
												data: 'quicksearch=' + sSearchText,
												dataType: 'json',
												success: ns1blankspace.setup.networkGroup.search.process
											});
										}
									};	
								},

					process:	function (oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									
									var	iMaximumColumns = 1;
										
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspace.search.start();
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

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										ns1blankspace.search.stop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											interface.setup.networkGroup.search.send(event.target.id, 1);
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

						aHTML.push('</table>');	
						
						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlUsers" class="ns1blankspaceControl">' +
										'Users</td></tr>');
					}	
					
					aHTML.push('</table>');			
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainUsers" class="ns1blankspaceControlMain"></div>');
						
					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.setup.networkGroup.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.setup.networkGroup.details();
					});
						
					$('#ns1blankspaceControlUsers').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainUsers'});
						ns1blankspace.setup.networkGroup.users.show();
					});
				},

	show:		function (oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.setup.networkGroup.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this network group.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
					
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.networkGroup.init({showHome: false});ns1blankspace.setup.networkGroup.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.setup.networkGroup.summary()'});
					}	
				},		
						
	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this network group.</td></tr></table>');
								
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:100px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));

						aHTML.push('<table class="ns1blankspace">');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">');
						
						if (ns1blankspace.objectContextData.notes == '')
						{
							aHTML.push(ns1blankspace.objectContextData.notes);
						}
				
						aHTML.push('</td></tr>');

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

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<textarea rows="10" cols="35" id="ns1blankspaceDetailsDescription" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');
					
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.notes);
						}
					}	
				},

	users:		{
					show:		function ()
								{
									var aHTML = [];
									
									if ($('#ns1blankspaceMainUsers').attr('data-loading') == '1')
									{
										$('#ns1blankspaceMainUsers').attr('data-loading', '');

										aHTML.push('<table class="ns1blankspaceContainer">');

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceUsersColumn1" class="ns1blankspaceColumn1Flexible" ></td>' +
														'<td id="ns1blankspaceUsersColumn2" class="ns1blankspaceColumn2" style="width: 100px"></td>' +
														'</tr>' + 
														'</table>');

										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainUsers').html(aHTML.join(''));
											
										$('#ns1blankspaceUsersColumn1').html(ns1blankspace.xhtml.loading);

										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceUsersAdd" class="ns1blankspaceAction">Add</span>' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceUsersColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceUsersAdd').button(
										{
											text: "Add"
										})
										.click(function() {
											ns1blankspace.setup.networkGroup.users.add();
										})
										
									}	
								},

					add:		function (oResponse)
								{
									if (oResponse == undefined)
									{
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceContainer">');
												
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Select the space (business) from which to add users' +					
														'</td></tr>' +
														'<tr class="ns1blankspaceSelect">' +
														'<td class="ns1blankspaceSelect">' +
														'<input id="ns1blankspaceUsersAddContactBusiness" class="ns1blankspaceSelect"' +
															' data-method="/ondemand/contact?&method=CONTACT_BUSINESS_SEARCH' +
															' data-columns="tradename">' +
														'</td></tr>');
										
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'User (logon name) to send updates to' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceUsersAddSyncUser" class="ns1blankspaceText">' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceUsersColumn1').html(aHTML.join(''));
										
										var aHTML = [];										
									
										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceUsersEditAdd">Add</span>' +
														'</td></tr>');
									
										aHTML.push('</table>');					
										
										$('#ns1blankspaceUsersColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceUsersEditAdd').button(
										{
											text: "Add"
										})
										.click(function() 
										{
											var sData = 'rows=2&quicksearch=Auto&contactbusiness=' + $('#ns1blankspaceUsersAddContactBusiness').attr("data-id");
										
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('CONTACT_PERSON_SEARCH'),
												data: sData,
												dataType: 'json',
												success: ns1blankspace.setup.networkGroup.users.add
											});
										});
									}
									else
									{
										if (oResponse.data.rows.length == 0)
										{
											
										}
										else
										{
											var aHTML = [];
											
											aHTML.push('<table>');
													
											aHTML.push('<tr><td class="ns1blankspaceCaption">' +
															ns1blankspace.xhtml.loadingSmall +
															' &nbsp;Adding userss...' +
															'</td></tr>');
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceUsersColumn1').html(aHTML.join(''));
											
											$.each(oResponse.data.rows, function()
											{
												var sData = 'networkgroup=' + ns1blankspace.objectContext;
												sData += '&usercontactperson=' +  this.id;
												
												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('SETUP_NETWORK_GROUP_MEMBER_MANAGE'),
													data: sData,
													async: false,
													dataType: 'json',
												});
											});
											
											$('#ns1blankspaceUsersColumn1').html('Users add to network group!');
											
											if ($('#ns1blankspaceUsersAddSyncUser').val() != '')
											{
												var sData = '_=1';
												
												sData += '&networkgroup=' + glSetupContext
												sData += '&userlogonname=' + encodeURIComponent($('#inputInterfaceMainMembersAddSyncUser').val());
												sData += '&sendalertwhenmemberupdated=Y';
												
												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('SETUP_NETWORK_GROUP_MEMBER_MANAGE'),
													data: sData,
													dataType: 'json',
													success: ns1blankspace.status.message('Users added.')
												});
											}
										}	
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
										sParam += '&id=' + ns1blankspace.objectContext;
									}	
									
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&title=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsTitle').val());
										sData += '&contactsynchronisation=' + ns1blankspace.util.fs($('input[name="radioContactSync"]:checked').val());
									};

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('SETUP_NETWORK_GROUP_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data) 
													{ 
														var aReturn = data.split('|');
														ns1blankspace.objectContext = oResponse.id;
														ns1blankspace.status.message('Saved.');
														
														if ($('input[name="radioContactSync"]:checked').val() == 'Y')
														{
															//interfaceSetupNetworkGroupMembersAddSyncProcess(gsParentWebMasterLogonName);
														}
													}
									});	
								}
				},				
					
	new:		function ()
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspace.setup.networkGroup.layout();
					ns1blankspace.show({selector: '#divInterfaceMainDetails'});
					$('#sns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlActionOptions').button({disabled: true});
					ns1blankspace.setup.networkGroup.details();
				}
}				