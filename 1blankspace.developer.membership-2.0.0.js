/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.developer.membership = 
{
	init: 		function ns1blankspaceDeveloperMembershipMasterViewport()
				{

					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = -1;
					ns1blankspace.objectParentName = 'developer';
					ns1blankspace.objectName = 'membership';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Apps (Memberships)';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.developer.membership.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
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
									
						aHTML.push('<table>' +
									'<tr><td id="ns1blankspaceViewDeveloperSpaceLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>' +
									'</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SEARCH'),
							data: 'rows=100&me=1',
							dataType: 'json',
							success: ns1blankspace.developer.membership.home
						});		
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table><tr><td class="ns1blankspaceNothing">Click New to create an app membership.</td></tr>' +
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
							ns1blankspace.developer.membership.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
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
										$('#ns1blankspaceViewControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SEARCH'),
											data: 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
											dataType: 'json',
											success: function(data) {ns1blankspace.developer.membership.show(oParam, data)}
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
												url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SEARCH'),
												data: 'title=' + sSearchText,
												dataType: 'json',
												success: function(data) {ns1blankspace.developer.membership.search.show(oParam, data)}
											});
											
										}
									};	
								}

								function (oParam, oResponse)
								{

									var iColumn = 0;
									var aHTML = [];
									var	iMaximumColumns = 1;
									
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspaceMasterSearchStop();
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
											
											aHTML.push('<td class="ns1blankspaceSearch" id="membership-' + this.id + '">' +
															this.title + '</td>');
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(giShowSpeedOptions);
										ns1blankspace.search.stop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(giHideSpeedOptions)
											ns1blankspace.developer.membership.search.send(event.target.id, {source: 1});
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

						aHTML.push('<tr><td id="ns1blankspaceControlEndpoints" class="ns1blankspaceControl">' +
										'Endpoints</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlSubscriptions" class="ns1blankspaceControl">' +
										'Subscriptions</td></tr>');

						aHTML.push('</table>';
					}				
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainEndpoints" class="ns1blankspaceControl"></div>';
					aHTML.push('<div id="ns1blankspaceMainSubscriptions" class="ns1blankspaceControl"></div>';

					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.developer.membership.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.developer.membership.details();
					});

					$('#ns1blankspaceControlEndpoints').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainEndpoints'});
						ns1blankspace.developer.membership.endpoints();
					});

					$('#ns1blankspaceControlSubscriptions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSubscriptions'});
						ns1blankspace.developer.membership.subscriptions();
					});
				},							

	show:		function ns1blankspaceDeveloperMembershipShow(oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.developer.membership.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this app membership.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.developer.membership.init({showHome: false});ns1blankspace.developer.membership.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.object({functionDefault: 'ns1blankspace.developer.membership.summary()'});
					}	
					}	
				},

	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this app membership.</td></tr></table>');
								
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
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Membership ID</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryMembershipID" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.id +
										'</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
					}	
				},
	
	details:	function ()
				{
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
										'Reference' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsReference" class="ns1blankspaceText">' +
										'</td></tr>');			

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<textarea id="ns1blankspaceDetailsDescription" rows="10" cols="35" class="ns1blankspaceTextMultiSmall"></textarea>' +
										'</td></tr>');		
	
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Based On Subscription' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td id="ns1blankspaceBasedOnSubscription" class="ns1blankspaceRadio">' +
										ns1blankspace.loadingSmallXHTML +
										'</td></tr>');	

						aHTML.push('</table>');					
		
						ns1blankspace.developer.membership.mySubscriptions();

						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						if (goObjectContext != undefined)
						{
							$('#inputns1blankspaceMainDetailsTitle').val(goObjectContext.title);
							$('#inputns1blankspaceMainDetailsReference').val(goObjectContext.reference);
							$('#inputns1blankspaceMainDetailsDescription').val(goObjectContext.description);
						}
					}	
				},

	mySubscriptions:

				function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{	
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SUBSCRIPTION_SEARCH'),
							dataType: 'json',
							success: function(data) {ns1blankspace.developer.membership.myubscriptions(oParam, data)
							}
						});
					}
					else
					{
						var aHTML = [];

						if (oResponse.data.rows == 0)
						{
							aHTML.push('No subscriptions';
						}
						else
						{		
							$.each(oResponse.data.rows, function() 
							{ 
								aHTML.push('<input type="radio" id="radioBasedOnSubscription' + this.id + '" name="radioBasedOnSubscription" value="' + this.id + '"/>' +
												this.membershiptext + '<br />');
							});
						}
						
						$('#ns1blankspaceBasedOnSubscription').html(aHTML.join(''));

						if (goObjectContext != undefined)
						{
							$('[name="radioBasedOnSubscription"][value="' + goObjectContext.basedonsubscription + '"]').attr('checked', true);
						}
					}
				},

	endpoints: 	{
					show:		function (oParam, oResponse)
								{
									var aHTML = [];
									
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'ADMIN_MEMBERSHIP_ENDPOINT_SEARCH';
										oSearch.addField('endpointtext,endpoint');
										oSearch.addFilter('membership', 'EQUAL_TO', ns1blankspace.objectContext)
										oSearch.rows = 50;
										oSearch.sort('endpointtext', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.developer.membership.endpoints.show(oParam, data)})	
									}
									else
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceEndpointsColumn1" class="ns1blankspaceColumn1"></td>' +
														'<td id="ns1blankspaceEndpointsColumn2" class="ns1blankspaceColumn2"></td>' +
														'</tr>' + 
														'</table>');		

										$('#ns1blankspaceEndpoints').html(aHTML.join(''));

										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceMainColumn2">');
										
										aHTML.push('<tr><td class="ns1blankspaceAction">' +
														'<span id="ns1blankspaceMembershipEndpointsAdd">Add Endpoint</span>' +
														'</td></tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceEndpointsColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceMembershipEndpointsAdd').button(
										{
											label: "Add Endpoint"
										})
										.click(function() {
											ns1blankspace.container.position({xhtmlElementID: 'ns1blankspaceMembershipEndpointsAdd', leftOffset: -50, topOffset: -280});
											ns1blankspace.developer.membership.endpoints.add(oParam);
										});

										var aHTML = [];
								
										aHTML.push('<table id="ns1blankspaceDeveloperMembershipEndpoints" class="ns1blankspaceMain">');

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<tr><td class="ns1blankspaceNothing">No endpoints.</td></tr>');
										}

										$(oResponse.data.rows).each(function()
										{
											aHTML.push('<tr class="ns1blankspaceRow">');
											
											aHTML.push('<td id="ns1blankspaceDeveloperMembershipEndpoints_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																this.endpointtext + '</td>';

											aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
															'<span id="ns1blankspaceDeveloperMembershipEndpoints_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
															'</td>' +																
															'</tr>');
										});
									
										aHTML.push('</table>');
											
										$('#ns1blankspaceEndpointsColumn2').html(aHTML.join(''));

										$('#ns1blankspaceDeveloperMembershipEndpoints > td.ns1blankspaceRowSelect').click(function(event)
										{
											var sXHTMLElementID = event.target.id;
											var aId = sXHTMLElementID.split('-');
											
											ns1blankspace.developer.membership.endpoints.add({endpoint: aId[1], step: 2});
										});

										$('ns1blankspaceDeveloperMembershipEndpoints > td.ns1blankspaceRowRemove').button(
										{
											text: false,
										 	icons: {primary: "ui-icon-close"}
										})
										.click(function() {
											ns1blankspace.developer.membership.endpoints.remove(this.id)
										})
										.css('width', '15px')
										.css('height', '20px');
									}
								},

					add:		function (oParam, oResponse)
								{
										
									if ($(ns1blankspace.xhtml.container).attr('data-initiator') == 'ns1blankspaceMembershipEndpointsAdd')
									{
										$(ns1blankspace.xhtml.container).slideUp(500);
										$(ns1blankspace.xhtml.container).attr('data-initiator', '');
									}
									else
									{
										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_ENDPOINT_SEARCH';
											oSearch.addField('title');
											oSearch.sort('title', 'ASC');
											oSearch.rows = 50;

											oSearch.getResults(function(data)
											{
												ns1blankspace.developer.membership.endpoints.add(oParam, data)
											});
										}
										else
										{
											
											$(ns1blankspace.xhtml.container).attr('data-initiator', 'ns1blankspaceMembershipEndpointsAdd')
											
											var aHTML = [];
											var h = -1;
											
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table>' +
																'<tr><td class="ns1blankspaceNothing">No endpoints.</td></tr>' +
																'</table>');

												$(ns1blankspace.xhtml.container).html(aHTML.join(''));
												$(ns1blankspace.xhtml.container).show(giShowSpeedOptions);
											}
											else
											{
												aHTML.push('<table id="ns1blankspaceMembershipEndpointAdd" class="ns1blankspaceSearchMedium" style="font-size:0.725em;">');
												
												$.each(oResponse.data.rows, function()
												{	
													aHTML.push('<tr class="ns1blankspaceRow">');
													
													aHTML.push('<td id="ns1blankspaceMembershipEndpointAdd_title-' + this.id + '" class="ns1blankspaceRowSelect">' +
																			this.title + '</td>');
													
													aHTML.push('</tr>');
												});
												
												aHTML.push('</table>');

												$(ns1blankspace.xhtml.container).html(aHTML.join(''));
												$(ns1blankspace.xhtml.container).show(giShowSpeedOptions);
												
												$('td.ns1blankspaceMainRowSelect').click(function(event)
												{
													ns1blankspace.developer.membership.endpoints.select(event.target.id);
												});
											}
										}
									}	
								},
	
					select:		function (sXHTMLElementID)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
									var sSearchContext = aSearch[2];
									
									$('#' + sXHTMLElementID).fadeOut(500);
																
									$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_ENDPOINT_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data){ns1blankspaceDeveloperMembershipEndpoints()}
										});
										
								},

					remove:		function (sXHTMLElementId)
								{
									var aSearch = sXHTMLElementId.split('-');
									
									var sData = 'id=' + ns1blankspace.util.fs(aSearch[1]);
												
									$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_ENDPOINT_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data){$('#' + sXHTMLElementId).parent().parent().fadeOut(500)}
										});	
								}
				},				

	subscriptions:
				{
					show: 		function (oParam, oResponse)
								{
									var sXHTMLElementID = 'ns1blankspaceMainSubscriptions';
									var iStep = 1;
									var aXHTMLElementID = [];

									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.step != undefined) {iStep = oParam.step}
									}
									else
									{
										oParam = {step: 1}
									}

									aXHTMLElementID = sXHTMLElementID.split('-');

									if (iStep == 1)
									{
										if (oResponse == undefined)
										{
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SUBSCRIPTION_SEARCH'),
												data: 'other=1&advanced=1&membership=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
												dataType: 'json',
												success: function(data){ns1blankspace.developer.membership.subscriptions.show(oParam, data)}
											});	
										}
										else
										{
											var aHTML = [];
											
											aHTML.push('<table class="ns1blankspaceContainer">' +
															'<tr class="ns1blankspaceContainer">' +
															'<td id="ns1blankspaceSubscriptionsColumn1" class="ns1blankspaceColumn1" style="width:150px;border-right-style:solid;border-width:2px;border-color:#B8B8B8;padding-right:15px;"></td>' +
															'<td id="ns1blankspaceSubscriptionsColumn2" class="ns1blankspaceColumn2" style="padding-left:15px;"></td>' +
															'<td id="ns1blankspaceSubscriptionsColumn3" class="ns1blankspaceColumn2" style="width: 100px;"></td>' +
															'</tr>' + 
															'</table>');	
								
											$('#ns1blankspaceMainSubscriptions').html(aHTML.join(''));
											
											var aHTML = [];
											var h = -1;
											
											aHTML.push('<table>');
											
											aHTML.push('<tr><td>' +
															'<span id="ns1blankspaceMembershipSubscriptionsAdd">Add</span>' +
															'</td></tr>');
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceSubscriptionsColumn3').html(aHTML.join(''));
											
											$('#ns1blankspaceMembershipSubscriptionsAdd').button(
											{
												label: "Add"
											})
											.click(function()
											{
												oParam.step = 2;
												oParam.xhtmlElementID = '';
												ns1blankspace.developer.membership.subscriptions.show(oParam);
											});

											var aHTML = [];
											var h = -1;
											
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table><td class="ns1blankspaceMainRowNothing">No subscriptions.</td></tr></table>');

												$('#ns1blankspaceSubscriptionsColumn1').html(aHTML.join(''));
											}
											else
											{
												aHTML.push('<table id="ns1blankspaceMembershipSubscriptions">');
												
												$.each(oResponse.data.rows, function()
												{
													aHTML.push('<tr class="ns1blankspaceRow">');
													
													aHTML.push('<td id="ns1blankspaceMembershipSubscriptions_title-' + this.id +
																			'" data-contactbusinesstext="' + this.contactbusinesstext +
																			'" class="ns1blankspaceMainRow ns1blankspaceRowSelect">' +
																			this.contactbusinesstext;
													
													aHTML.push('<br /><span class="ns1blankspaceSub" id="ns1blankspaceMembershipSubscriptions_startdate-' + this.id + '">' +
									 										this.startdate + '</span>');

									 				aHTML.push('</td>');						

									 				aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
													aHTML.push('<span id="ns1blankspaceMembershipSubscriptions_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
													aHTML.push('</td>');		

													aHTML.push('</tr>');
												});
												
												aHTML.push('</table>');

												$('#ns1blankspaceSubscriptionsColumn1').html(aHTML.join(''));
															
												$('#ns1blankspaceMembershipSubscriptions > td.ns1blankspaceRowSelect').click(function(event)
												{
													oParam.step = 2;
													oParam.xhtmlElementID = event.target.id;
													ns1blankspace.developer.membership.subscriptions.show(oParam);
												});

												$('ns1blankspaceMembershipSubscriptions > span.ns1blankspaceRowRemove').button(
												{
													text: false,
												 	icons: {primary: "ui-icon-close"}
												})
												.click(function()
												{
													oParam.step = 6;
													oParam.xhtmlElementID = this.id;
													ns1blankspace.developer.membership.subscriptions.show(oParam);
												})
												.css('width', '15px')
												.css('height', '20px');
											}
										}
									}

									else if (iStep == 2)
									{
										if (oResponse == undefined)
										{
											var aHTML = [];
											var h = -1;

											aHTML.push('<table class="ns1blankspaceContainer">');
											
											aHTML.push('<tr><td class="ns1blankspaceCaption">' +
															'Space' +
															'</td></tr>' +
															'<tr><td class="ns1blankspaceMainSelectCustom">' +
															'<input id="ns1blankspaceMembershipSubscriptionsRegistration" class="ns1blankspaceSelectCustom">' +
															'</td></tr>');

											aHTML.push('<tr><td class="ns1blankspaceSub">You need to enter at least 3 characters.</td></tr>' +
																'<td class="ns1blankspaceNothing">It will only show spaces that you have signed up.</td></tr>');

											aHTML.push('</table>');					
											
											$('#ns1blankspaceSubscriptionsColumn2').html(aHTML.join(''));
											
											$('#ns1blankspaceMembershipSubscriptionsRegistration').keyup(function()
											{
												if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
										        ns1blankspace.timer.delayCurrent = setTimeout("ns1blankspace.developer.membership.subscriptions.search('ns1blankspaceMembershipSubscriptionsRegistration')", giWaitForStop);
											});	
												
											$('#ns1blankspaceMembershipSubscriptionsRegistration').live('blur', function() 
											{
												$(this).removeClass('ns1blankspaceMasterHighlight');
											});

											var aHTML = [];
											var h = -1;
										
											aHTML.push('<table id="tablens1blankspaceMainColumn2" class="ns1blankspaceMain" style="font-size:0.875em">';
													
											if (aXHTMLElementID[1])
											{
												aHTML.push('<tr class="ns1blankspaceMainCaption">' +
																	'<td class="ns1blankspaceMainRowNothing">To change this access you need to delete it and then re-add it.</td></tr>';

											}	
											else
											{	
												aHTML.push('<tr class="ns1blankspaceMainAction">' +
																'<td class="ns1blankspaceMainAction">' +
																'<span style="width:70px;" id="spanns1blankspaceMainMembershipSubscriptionEditSave">Save</span>' +
																'</td></tr>';
											}

											aHTML.push('<tr class="ns1blankspaceMainAction">' +
																'<td class="ns1blankspaceMainAction">' +
																'<span style="width:70px;" id="spanns1blankspaceMainMembershipSubscriptionEditCancel">Cancel</span>' +
																'</td></tr>';
											
											aHTML.push('</table>';					
											
											$('#tdns1blankspaceMainMembershipSubscriptionsColumn3').html(aHTML.join(''));

											$('#spanns1blankspaceMainMembershipSubscriptionEditSave').button(
											{
												text: "Save"
											})
											.click(function() 
											{
												ns1blankspaceMasterStatusWorking();

												var sData = 'id=' + ns1blankspaceMasterFormatSave(aXHTMLElementID[1]);
												sData += '&registration=' + ns1blankspaceMasterFormatSave($('#inputns1blankspaceMainMembershipSubscriptionsRegistration').attr("data-id"));
												sData += '&membership=' + giObjectContext;

												$.ajax(
												{
													type: 'POST',
													url: '/ondemand/admin/?method=ADMIN_MEMBERSHIP_SUBSCRIPTION_MANAGE',
													data: sData,
													dataType: 'json',
													success: function() {
														oParam.step = 1;
														ns1blankspaceDeveloperMembershipSubscriptions(oParam);
														ns1blankspaceMasterStatus('Saved');
													}
												});
											})
											
											$('#spanns1blankspaceMainMembershipSubscriptionEditCancel').button(
											{
												text: "Cancel"
											})
											.click(function() 
											{
												oParam.step = 1;
												ns1blankspaceDeveloperMembershipSubscriptions(oParam);
											})

											if (aXHTMLElementID[1])
											{
												$('#inputns1blankspaceMainMembershipSubscriptionsRegistration').attr("data-id", aXHTMLElementID[1])
												$('#inputns1blankspaceMainMembershipSubscriptionsRegistration').val($('#tdMembershipSubscriptions_title-' + aXHTMLElementID[1]).attr("data-contactbusinesstext"));
											}
										}
										else
										{
										}	
									}
									else if (iStep == 6)
									{	
										$.ajax(
											{
												type: 'POST',
												url: '/ondemand/admin/?method=ADMIN_MEMBERSHIP_SUBSCRIPTION_MANAGE&remove=1',
												data: 'id=' + aXHTMLElementID[1],
												dataType: 'json',
												success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
											});	
										}	
								}	


function ns1blankspaceMembershipSubscriptionsRegistrationSearch(sXHTMLInputElementID, oResponse)
{
	var aHTML = [];
	var sSearchText;
	var iXHTMLElementContextID;

	if (oResponse == undefined)
	{	
		sSearchText = $('#' + sXHTMLInputElementID).val();
		
		if (sSearchText.length > 2)
		{
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/admin/?method=ADMIN_REGISTRATION_SEARCH&rows=10&status=2&contactbusinesstext=' + ns1blankspaceMasterFormatSave(sSearchText),
				dataType: 'json',
				success: function(data) {ns1blankspaceMembershipSubscriptionsRegistrationSearch(sXHTMLInputElementID, data)}
			});
		}
	}
	else
	{	
		aHTML.push('<table style="width: 350px;" class="ns1blankspaceViewportMasterControl" cellpadding=4>');

		$(oResponse.data.rows).each(function()
		{
			if (this.contactbusinesstext != '')
			{
				aHTML.push('<tr>' +
					'<td id="tdns1blankspaceMasterRegistration-' + this.id + '" data-usertext="' + this.contactbusinesstext + '" class="ns1blankspaceSearch ns1blankspaceMasterNetworkUser">' +
					this.contactbusinesstext +
					'</td></tr>');
			}	
		});			
						
		aHTML.push('</table>');
		
		$(ns1blankspace.xhtml.container).html(aHTML.join(''));

		$(ns1blankspace.xhtml.container).show(giShowSpeedOptions);
		$(ns1blankspace.xhtml.container).offset({ top: $('#' + sXHTMLInputElementID).offset().top + $('#' + sXHTMLInputElementID).height(), left: $('#' + sXHTMLInputElementID).offset().left});

		$('.ns1blankspaceMasterNetworkUser').click(function(event)
		{
			var aXHTMLElementID = (event.target.id).split('-');
			iXHTMLElementContextID = aXHTMLElementID[1];

			$('#' + sXHTMLInputElementID).val($('#' + event.target.id).attr("data-usertext"))
			$('#' + sXHTMLInputElementID).attr("data-id", iXHTMLElementContextID)
			$(ns1blankspace.xhtml.container).hide();
		});
	}	
}	

function ns1blankspaceDeveloperMembershipSave()
{

	var sParam = 'method=ADMIN_MEMBERSHIP_MANAGE';
	var sData = 'id=' + (giObjectContext != -1 ? giObjectContext : '');
		
	if ($('#divns1blankspaceMainDetails').html() != '')
	{
		sData += '&title=' + encodeURIComponent($('#inputns1blankspaceMainDetailsTitle').val());
		sData += '&reference=' + encodeURIComponent($('#inputns1blankspaceMainDetailsReference').val());
		sData += '&description=' + encodeURIComponent($('#inputns1blankspaceMainDetailsDescription').val());
		sData += '&basedonsubscription=' + ns1blankspaceMasterFormatSave($('input[name="radioBasedOnSubscription"]:checked').val());
	};

	ns1blankspaceMasterStatusWorking();

	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/admin/?' + sParam,
		data: sData,
		dataType: 'json',
		success: function(oResponse)
		{
			if (oResponse.status == 'OK')
			{	
				ns1blankspaceMasterStatus('Saved');
				
				if (giObjectContext == -1)
				{
					giObjectContext = oResponse.id;
					gbInputDetected = false;
					ns1blankspaceDeveloperMembershipSearch('-' + giObjectContext, {source: 1});
				}	
			}
			else
			{
				ns1blankspaceMasterError(oResponse.error.errornotes);;
			}
		}
	});
		
}

function ns1blankspaceDeveloperMembershipNew(oParam)
{
	goObjectContext = undefined
	giObjectContext = -1;
	ns1blankspaceDeveloperMembershipViewport();
	$('#spanns1blankspaceMasterViewportControlAction').button({disabled: false});
	ns1blankspaceMasterMainViewportShow("#divns1blankspaceMainDetails");
	ns1blankspaceDeveloperMembershipDetails();
}
