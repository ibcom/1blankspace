/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 * Formerly developer.space
 */

if (ns1blankspace.admin == undefined) {ns1blankspace.admin = {}}

ns1blankspace.admin.space = 
{
	data: 		{superUser: false},

	init: 		function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = -5;
					ns1blankspace.objectParentName = 'admin';
					ns1blankspace.objectName = 'space';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Spaces';

					if (ns1blankspace.option.superUser == undefined)
					{
						ns1blankspace.option.superUser = (ns1blankspace.user.super)
					}
								
					ns1blankspace.app.set(oParam);
				},

	home:		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{	
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceMain">');
						aHTML.push('<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ns1blankspaceMain">' +
										ns1blankspace.xhtml.loading +
										'</td>' +
										'<td id="ns1blankspaceHomeColumn2" class="ns1blankspaceColumn2Action" style="width:240px;"></td>' +
										'</tr>');
						aHTML.push('</table>');	
											
						$('#ns1blankspaceMain').html(aHTML.join(''));

						var aHTML = [];
									
						aHTML.push('<table>' +
							'<tr><td><div id="ns1blankspaceViewDeveloperSpaceLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>' +
							'</table>');
												
						$('#ns1blankspaceControl').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						if (ns1blankspace.option.superUser && ns1blankspace.space == ns1blankspace.user.space)
						{		
							aHTML.push('<tr><td><span id="ns1blankspaceSuperUser" class="ns1blankspaceAction">' +
												'</span></td></tr>');

							aHTML.push('<tr><td><span id="ns1blankspaceSuperUserMonitoring" class="ns1blankspaceAction">' +
												'</span></td></tr>');
						}

						if (ns1blankspace.space != ns1blankspace.user.space)
						{
							aHTML.push('<tr><td><span id="ns1blankspaceSwitchBack" class="ns1blankspaceAction">' +
												'</span></td></tr>');
						}
						else
						{
							aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-top:18px;">' +
												'If you resell or support mydigitalstructure based apps you can set up your own memberships to contol access to endpoints.</td></tr>');

							aHTML.push('<tr><td><span id="ns1blankspaceDeveloperApps" class="ns1blankspaceAction">' +
												'</span></td></tr>');
						}

					
						aHTML.push('</table>')

						$('#ns1blankspaceHomeColumn2').html(aHTML.join(''));

						$('#ns1blankspaceSuperUser').button(
						{
							text: true,
							label: 'Show ' + (ns1blankspace.admin.space.data.superUser?'just my':'all') + ' spaces',
						})
						.click(function()
						{
							ns1blankspace.admin.space.data.superUser = !ns1blankspace.admin.space.data.superUser;
							$('#ns1blankspaceSuperUser').button({label: 'Show ' + (ns1blankspace.admin.space.data.superUser?'just mine':'all') + ' spaces'});
							ns1blankspace.admin.space.home()
						})
						.css('width', '100px');

						$('#ns1blankspaceSuperUserMonitoring').button(
						{
							text: true,
							label: 'Monitoring',
						})
						.click(function()
						{
							ns1blankspace.admin.monitoring.init()
						})
						.css('width', '100px');

						$('#ns1blankspaceSwitchBack').button(
						{
							text: true,
							label: 'Switch back to your space',
						})
						.click(function()
						{
							ns1blankspace.admin.space.switch.back();
						});
						
						$('#ns1blankspaceDeveloperApps').button(
						{
							text: true,
							label: 'Memberships',
						})
						.click(function()
						{
							ns1blankspace.developer.membership.init();
						})
						.css('width', '100px');

						var oSearch = new AdvancedSearch();
						oSearch.method = 'ADMIN_REGISTRATION_SEARCH';
						oSearch.addField('space,spacetext,status,statustext,registrationspace');
						oSearch.addFilter('space', 'NOT_EQUAL_TO', '');
						oSearch.rows = 50;
						oSearch.sort('modifieddate', 'desc');
						oSearch.addCustomOption('allregistrationspaces', (ns1blankspace.admin.space.data.superUser?'Y':'N'));
						oSearch.getResults(function(data) {ns1blankspace.admin.space.home(oParam, data)})	
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table><tr><td class="ns1blankspaceNothing">Click New to register a new space.</td></tr>' +
											'</table>');
						}
						else
						{
							aHTML.push('<table>');
							aHTML.push('<tr><td class="ns1blankspaceCaption">RECENT</td></tr>');

							$.each(oResponse.data.rows, function(r, row)
							{
								if (row.spacetext != '')
								{	
									aHTML.push('<tr class="ns1blankspaceRow">');
								
									aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
													'" class="ns1blankspaceMostLikely">' +
													row.spacetext +
													'</td>');
								}	
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');			
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.admin.space.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function (sXHTMLElementID, oParam)
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
										oSearch.method = 'ADMIN_REGISTRATION_SEARCH';
										oSearch.addField('initiallogon,initialpassword,registrationdate,registrationspace,registrationspacetext,space,spacetext,status,statustext');
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.addCustomOption('allregistrationspaces', (ns1blankspace.admin.space.data.superUser?'Y':'N'));
										oSearch.getResults(function(data) {ns1blankspace.admin.space.show(oParam, data)})	
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
											sElementId = 'ns1blankspaceViewpControlBrowse';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.search.start();
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'ADMIN_REGISTRATION_SEARCH';
											oSearch.addField('space,spacetext,status,statustext');
											oSearch.addBracket('(');
											oSearch.addFilter('spacetext', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('initiallogon', 'TEXT_IS_LIKE', sSearchText);

											if (!_.isNull(numeral(sSearchText).value()))
											{
												oSearch.addOperator('or');
												oSearch.addFilter('space', 'EQUAL_TO', sSearchText);
											}

											oSearch.addBracket(')');
											oSearch.addCustomOption('allregistrationspaces', (ns1blankspace.admin.space.data.superUser?'Y':'N'));
											oSearch.getResults(function(data) {ns1blankspace.admin.space.search.process(oParam, data)})	
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var iMaximumColumns = 1;
									var aHTML = [];
									
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
											
											aHTML.push('<td class="ns1blankspaceSearch" id="registration-' +
															this.id + '">' +
															this.spacetext + '</td>');
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.searchContainer).html(aHTML.join(''));
										$(ns1blankspace.xhtml.searchContainer).show();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide()
											ns1blankspace.admin.space.search.send(event.target.id, {source: 1});
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
						aHTML.push('<tr><td id="ns1blankspaceControlFromNew" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Details</td></tr>');		
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlBilling" class="ns1blankspaceControl">' +
										'Account</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlSubscriptions" class="ns1blankspaceControl">' +
										'Subscriptions</td></tr>');

						aHTML.push('</table>');
					}				
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainFromNew" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainSubscriptions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainUsers" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainBilling" class="ns1blankspaceControlMain"></div>');

					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.admin.space.details({source: 1});
					});

					$('#ns1blankspaceControlFromContact').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.admin.space.details({source: 2});
					});
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.admin.space.summary();
					});

					$('#ns1blankspaceControlSubscriptions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSubscriptions', refresh: true});
						ns1blankspace.admin.space.subscriptions();
					});

					$('#ns1blankspaceControlBilling').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainBilling'});
						ns1blankspace.admin.space.billing();
					});
				},							
				
	show:		function (oParam, oResponse)
				{
					ns1blankspace.app.clean();
					ns1blankspace.admin.space.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the space or you don\'t have rights to access it.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.spacetext);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						if (ns1blankspace.option.superUser)
						{
							ns1blankspace.objectContextData.canSwitchInto = true;
						}
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.admin.space.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.admin.space.summary()'});
					}		
				},

	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find the space or you don\'t have rights to access it.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						if (ns1blankspace.objectContextData.canSwitchInto == undefined)
						{
							ns1blankspace.admin.space.switch.check(
							{
								onComplete: ns1blankspace.admin.space.summary
							});
						}
						else
						{
							aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceRow">' +
										'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
										'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:250px;"></td>' +
										'</tr>' +
										'</table>');				
							
							$('#ns1blankspaceMainSummary').html(aHTML.join(''));

							var aHTML = [];

							aHTML.push('<table class="ns1blankspace">');
							
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Space ID</td></tr>' +
											'<tr><td id="ns1blankspaceSummarySpaceID" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.space +
											'</td></tr>');

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Initial Logon Name</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryInitialLogonName" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.initiallogon +
											'</td></tr>');

							if (ns1blankspace.objectContextData.initialpassword != '')
							{	
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Initial Password</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryInitialPassword" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.initialpassword +
											'</td></tr>');
							}

							if (ns1blankspace.objectContextData.registrationdate != '')
							{	
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Created Date</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryCreatedDate" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.registrationdate +
											'</td></tr>');
							}

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Created By</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryCreatedBy" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.registrationspacetext +
											'</td></tr>');
									
							aHTML.push('</table>');					
							
							$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspaceColumn2" style="width: 100%;">');
								
							if (ns1blankspace.objectContextData.canSwitchInto)
							{	
								aHTML.push('<tr><td>' +
											'<span style="font-size:0.75em;" id="ns1blankspaceSwitchInto">Switch Into</span>' +
											'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-top:10px;">' +
											 	'To switch back to your space, click the space name at the top right of the page.' +
												'</td></tr>');			
							}
							
							aHTML.push('</table>');					
							
							$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));	

							$('#ns1blankspaceSwitchInto').button().click(function()
							{
								ns1blankspace.admin.space.switch.into();
							});
						}	
					}	
				},	

	details:	function (aParam)
				{
					var aHTML = [];
					var iSource = 1;	

					if (aParam != undefined)
					{
						if (aParam.source != undefined) {iSource = aParam.source}
					}
					else
					{
						aParam = {}
					}
					
					if (ns1blankspace.objectContextData == undefined)
					{
						if (iSource == 2)
						{
							var aHTML = [];

							aHTML.push('<table class="ns1blankspace" style="width:300px;">');

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

							$('#ns1blankspaceMainDetails').html(aHTML.join(''));		
						}	
						else
						{
							var aHTML = [];
	
							aHTML.push('<table class="ns1blankspace" style="width:300px;">');
					
							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'Space Name (Business, group name, school etc)' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceText">' +
											'<input id="ns1blankspaceDetailsBusiness" class="ns1blankspaceText">' +
											'</td></tr>');		

							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'First Name' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceText">' +
											'<input id="ns1blankspaceDetailsFirstName" class="ns1blankspaceText">' +
											'</td></tr>');	
					
							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'Last Name' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceText">' +
											'<input id="ns1blankspaceDetailsLastName" class="ns1blankspaceText">' +
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
						
							$('#ns1blankspaceMainDetails').html(aHTML.join(''));
						}

					}
					else
					{
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');			
						
						$('#ns1blankspaceMainDetails').html(aHTML.join(''));
						
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspaceMain">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Space Name (Business, group name, school etc)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsBusiness" class="ns1blankspaceText">' +
										'</td></tr>');		
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContext != undefined)
						{
							$('#ns1blankspaceDetailsBusiness').val(ns1blankspace.objectContext.spacename);
						}
					}	
					
				},

	subscriptions:

				function (aParam, oResponse)
				{
					var aHTML = [];
					var iStep = 1;
					var sXHTMLElementID;
					var aXHTMLElementID = [];

					if (aParam != undefined)
					{
						if (aParam.step != undefined) {iStep = aParam.step}
						if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
					}
					else
					{
						aParam = {};
					}	
						
					if (sXHTMLElementID) {aXHTMLElementID = sXHTMLElementID.split('-')};
						
					if (iStep == 1)
					{
						if (oResponse == undefined)
						{					
							var oSearch = new AdvancedSearch();
							oSearch.method = 'ADMIN_MEMBERSHIP_SUBSCRIPTION_SEARCH';
							oSearch.addField('membershiptext');
							oSearch.addFilter('registration', 'EQUAL_TO', ns1blankspace.objectContext)
							oSearch.addCustomOption('spacesyouregistered', 'Y');
							oSearch.sort('membershiptext', 'ASC');
							oSearch.rows = 50;

							oSearch.getResults(function(data)
							{
								ns1blankspace.admin.space.subscriptions(aParam, data)
							});
						}
						else
						{
							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceSubscriptionsColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceSubscriptionsColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');		
							
							$('#ns1blankspaceMainSubscriptions').html(aHTML.join(''));

							var aHTML = [];

							aHTML.push('<table class="ns1blankspaceColumn2">');
							
							aHTML.push('<tr><td><span id="ns1blankspaceSpaceSubscriptionsAdd" class="ns1blankspaceAction">Add</span>' +
											'</td></tr>');

							aHTML.push('</table>');					
							
							$('#ns1blankspaceSubscriptionsColumn2').html(aHTML.join(''));
							
							$('#ns1blankspaceSpaceSubscriptionsAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								if ($(ns1blankspace.xhtml.container).attr('data-initiator') == 'ns1blankspaceSpaceSubscriptionsAdd')
								{
									$(ns1blankspace.xhtml.container).slideUp(500);
									$(ns1blankspace.xhtml.container).attr('data-initiator', '');
								}
								else
								{
									ns1blankspace.container.position({xhtmlElementID: 'ns1blankspaceSpaceSubscriptionsAdd', topOffset: -30, leftOffset: -255});
									$.extend(true, aParam, {step: 2});
									ns1blankspace.admin.space.subscriptions(aParam);
								}	
							})
							.css('font-size', '0.875em');

							var aHTML = [];
									
							aHTML.push('<table id="ns1blankspaceSpaceSubscriptions">');

							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<tr><td class="ns1blankspaceNothing">No subscriptions.</td></tr>');
							}

							$(oResponse.data.rows).each(function()
							{

								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceSpaceSubscriptions_Title-' + this.id + '" class="ns1blankspaceRow"' +
												' title="">' +
												this.membershiptext + '</td>');

								aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceMainRow">');
								aHTML.push('<span id="ns1blankspaceSpaceSubscriptions_remove-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowRemove"></span>');
								aHTML.push('</td>');	

								aHTML.push('</tr>');
							});
						
							aHTML.push('</table>');
								
							$('#ns1blankspaceSubscriptionsColumn1').html(aHTML.join(''));

							$('#ns1blankspaceSpaceSubscriptions span.ns1blankspaceRowRemove').button(
							{
								text: false,
							 	icons: {primary: "ui-icon-close"}
							})
							.click(function()
							{
								aParam.step = 4;
								aParam.xhtmlElementID = this.id;
								ns1blankspace.admin.space.subscriptions(aParam)
							})
							.css('width', '15px')
							.css('height', '20px');
						}
					}
					else if (iStep == 2)
					{
						if (oResponse == undefined)
						{
							$.ajax(
							{
								type: 'GET',
								url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SEARCH'),
								data: 'me=1',
								dataType: 'json',
								success: function(data) {ns1blankspace.admin.space.subscriptions(aParam, data)}
							});
						}
						else
						{
							$(ns1blankspace.xhtml.container).attr('data-initiator', 'ns1blankspaceSpaceSubscriptionsAdd')
							
							var aHTML = [];
							
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<table border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceSearchMedium">');
								aHTML.push('<tr><td class="ns1blankspaceNothing">No subscriptions.</td></tr>');
								aHTML.push('</table>');

								$(ns1blankspace.xhtml.container).html(aHTML.join(''));
								$(ns1blankspace.xhtml.container).show();
							}
							else
							{
								aHTML.push('<table id="ns1blankspaceSpaceSubscriptionsSelect" class="ns1blankspaceSearchMedium" style="font-size:0.725em;">');
								
								$.each(oResponse.data.rows, function()
								{	
									aHTML.push('<tr class="ns1blankspaceRow">');
									
									aHTML.push('<td id="ns1blankspaceSpaceSubscriptionsSelect_title-' + this.id + '" class="ns1blankspaceRowSelect">' +
															this.title + '</td>');
									
									aHTML.push('</tr>');
								});
								
								aHTML.push('</table>');

								$(ns1blankspace.xhtml.container).html(aHTML.join(''));
								$(ns1blankspace.xhtml.container).show();
								
								$('#ns1blankspaceSpaceSubscriptionsSelect td.ns1blankspaceRowSelect').click(function(event)
								{
									aParam.step = 3;
									aParam.xhtmlElementID = event.target.id;
									ns1blankspace.admin.space.subscriptions(aParam);
								});
							}
						}
					}
					else if (iStep == 3)
					{	
						$('#' + sXHTMLElementID).fadeOut(500);
						
						var sData = 'registration=' + ns1blankspace.util.fs(ns1blankspace.objectContext) +
										'&membership=' + ns1blankspace.util.fs(aXHTMLElementID[1]);
									
						$.ajax(
						{
							type: 'POST',
							url: '/rpc/admin/?method=ADMIN_MEMBERSHIP_SUBSCRIPTION_MANAGE',
							data: sData,
							dataType: 'json',
							success: function(data){ns1blankspace.admin.space.subscriptions()}
						});
					}

					else if (iStep == 4)
					{
						$.ajax(
						{
							type: 'POST',
							url: '/rpc/admin/?method=ADMIN_MEMBERSHIP_SUBSCRIPTION_MANAGE',
							data: 'remove=1&id=' + ns1blankspace.util.fs(aXHTMLElementID[1]),
							dataType: 'json',
							success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
						});	
					}
				},			

	users:		function (aParam, oResponse)
				{
					var iObjectContext = giObjectContext;
					var sXHTMLElementID = 'ns1blankspaceMainUsers';
					var oOptions = {view: true};
					var oActions = {};
					
					if (aParam != undefined)
					{
						if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
						if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
						if (aParam.options != undefined) {oOptions = aParam.options}
						if (aParam.actions != undefined) {oActions = aParam.actions}
					}		
						
					if (oResponse == undefined)
					{
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SUBSCRIPTION_MEMBER_SEARCH'),
							data: 'space=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
							dataType: 'json',
							success: function(data) {ns1blankspace.admin.space.users(aParam, data)}
						});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table class="ns1blankspace">');
							aHTML.push('<tr><td class="ns1blankspaceNothing">No users.</td></tr>');
							aHTML.push('<table>');

							$('#' + sXHTMLElementId).html(aHTML.join(''));
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceSpaceSubscriptionUsers" class="ns1blankspaceContainer">');
							aHTML.push('<tr class="ns1blankspaceCaption">');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">Logon Name</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">Last logged on</td>');
							aHTML.push('</tr>');
							
							$.each(oResponse.data.rows, function()
							{
								
								aHTML.push('<tr class="ns1blankspaceRow">');
												
								aHTML.push('<td id="ns1blankspaceSpaceSubscriptionUsers_title-' + this.id + '" class="ns1blankspaceRow">' +
														this.username + '</td>');
														
								aHTML.push('<td id="s1blankspaceSpaceSubscriptionUsers_lastlogon-' + this.id + '" class="ns1blankspaceRow">' +
														this.lastlogondatetime + '</td>');
														
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');

							$('#' + sXHTMLElementID).html(aHTML.join(''));
						}
					}	
				},

	billing: 	function (oParam, oResponse)
				{
					var aHTML = [];

					if (oResponse == undefined)
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceBillingColumn1" class="ns1blankspaceColumn1Large"></td>' +
									'<td id="ns1blankspaceBillingColumn2" class="ns1blankspaceColumn2Action" style="width:270px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainBilling').html(aHTML.join(''));

						var oSearch = new AdvancedSearch();
						oSearch.method = 'ADMIN_SPACE_SEARCH';
						oSearch.addField('datausagedate,datausagemegabytes,disabled,site,sitetext,status,statustext');
						oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContextData.space);
						oSearch.addCustomOption('allregistrationspaces', (ns1blankspace.admin.space.data.superUser?'Y':'N'));
						oSearch.getResults(function(data) {ns1blankspace.admin.space.billing(oParam, data)})	
					}	
					else
					{
						if (oResponse.data.rows.length > 0)
						{	
							ns1blankspace.objectContextData.billing = oResponse.data.rows[0];

							aHTML.push('<table class="ns1blankspace">');
							
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Signup Site</td></tr>' +
											'<tr><td id="ns1blankspaceBillingSignupSite" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.billing.sitetext +
											'</td></tr>');

							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Access' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Full<br />' +
										'<input type="radio" id="radioStatus2" name="radioStatus" value="3"/>Trial<br />' +
										'<input type="radio" id="radioStatus3" name="radioStatus" value="7"/>None<br />' +
										'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>' +
													'<span class="ns1blankspaceSub">Internal</span>' +
										'</td></tr>');

							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Space Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioDisabledN" name="radioDisabled" value="N"/>Enabled<br />' +
										'<input type="radio" id="radioDisabledY" name="radioDisabled" value="Y"/>Disabled' +
										'</td></tr>');

							aHTML.push('</table>');					
							
							$('#ns1blankspaceBillingColumn1').html(aHTML.join(''));

							var aHTML = [];
						
							if (ns1blankspace.objectContextData.billing.datausagemegabytes != '' || ns1blankspace.objectContextData.billing.status==3)
							{
								aHTML.push('<table class="ns1blankspaceColumn2">');
							
								if (ns1blankspace.objectContextData.billing.datausagemegabytes != '')
								{	
									aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Data usage as at</td></tr>' +
											'<tr><td id="ns1blankspaceBillingDataUsageAsAt" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.billing.datausagedate +
											'</td></tr>');

									aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Data usage (MB)</td></tr>' +
											'<tr><td id="ns1blankspaceBillingDataUsage" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.billing.datausagemegabytes +
											'</td></tr>');
								}	
													
								if (ns1blankspace.objectContextData.billing.status==3)
								{					
									aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Trail Access</td></tr>' +
												'<tr><td class="ns1blankspaceSubNote" style="padding-top:4px;">' +
												'All objects are limited to 50 records.' +
												'</td></tr>');
								}	

								aHTML.push('</table>');
							}				

							$('#ns1blankspaceBillingColumn2').html(aHTML.join(''));

							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.billing.status  + '"]').attr('checked', true);
							$('[name="radioDisabled"][value="' + ns1blankspace.objectContextData.billing.disabled  + '"]').attr('checked', true);
						}	
					}
				},			

	save:		{
					send:		function ()
								{
									if (ns1blankspace.objectContextData != undefined)
									{
										if (ns1blankspace.objectContextData.billing != undefined)
										{
											var oData =
											{
												id: ns1blankspace.objectContextData.billing.id,
												status: $('input[name="radioStatus"]:checked').val(),
												disabled: $('input[name="radioDisabled"]:checked').val()
											}

											$.ajax(
											{
												type: 'POST',
												url: '/rpc/admin/?method=ADMIN_SPACE_MANAGE',
												data: oData,
												dataType: 'json',
												success: function(response)
												{
													if (response.status == "OK")
													{
														ns1blankspace.status.message('Updated');
														ns1blankspace.inputDetected = false;
														ns1blankspace.admin.space.init({id: ns1blankspace.objectContext});
													}
													else
													{
														ns1blankspace.status.error(response.error.errornotes);
													}
												}
											});
										}	
									}	
									else
									{
										var iContactBusinessId = '';

										var oData =
										{
											site: ns1blankspace.user.site
										}	

										if ($('#ns1blankspaceMainFromContact').html() != '')
										{
											oData.registration_spacename = $('#ns1blankspaceDetailsBusiness').val();
											oData.registration_contactbusiness = $('#ns1blankspaceDetailsContactBusiness').attr('data-id');
											oData.registration_contactperson = $('#ns1blankspaceDetailsContactPerson').attr('data-id');
										}

										if ($('#ns1blankspaceMainDetails').html() != '')
										{
											oData.contactperson_firstname = $('#ns1blankspaceDetailsFirstName').val();
											oData.contactperson_surname = $('#ns1blankspaceDetailsLastName').val();
											oData.contactperson_email = $('#ns1blankspaceDetailsEmail').val();
											oData.registration_spacename = $('#ns1blankspaceDetailsBusiness').val();
										}
			
										ns1blankspace.status.working();

										$.ajax(
										{
											type: 'POST',
											url: '/rpc/register/?method=REGISTER_SPACE_MANAGE',
											data: oData,
											dataType: 'json',
											success: function(response)
											{
												if (response.status == "OK")
												{
													ns1blankspace.status.message('Space created');
													ns1blankspace.objectContext = response.registration;
													ns1blankspace.inputDetected = false;
													ns1blankspace.admin.space.init({id: ns1blankspace.objectContext});
												}
												else
												{
													ns1blankspace.status.error(response.error.errornotes);
												}
											}
										});
									}
								}
				},

	switch:	{
					into: 	function (oParam, oResponse)
								{
									var id = ns1blankspace.util.getParam(oParam, 'space').value;
									if (id == undefined) {id = ns1blankspace.objectContextData.space}

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CORE_SPACE_MANAGE'),
										data: 'superuseroverride=Y&switch=1&id=' + id,
										dataType: 'json',
										success: function(oResponse)
										{
											if (oResponse.status == 'OK')
											{	
												ns1blankspace.space = oResponse.TargetSpace;
												ns1blankspace.spaceText = oResponse.SpaceName;
												ns1blankspace.spaceContactBusiness = oResponse.TargetContactBusiness;
												ns1blankspace.financial.data = undefined;
												ns1blankspace.financial.initStatus = undefined;
												ns1blankspace.extend.structure = undefined;
												$('#ns1blankspaceSpaceText').html(ns1blankspace.spaceText);
												ns1blankspace.app.refresh();
											}	
										}
									});
								},

					back: 	function (oParam, oResponse)
								{
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CORE_SPACE_MANAGE'),
										data: 'superuseroverride=Y&switchback=1',
										dataType: 'json',
										success: function(data)
										{
											if (data.status == 'OK')
											{	
												ns1blankspace.space = ns1blankspace.user.space;
												ns1blankspace.spaceText = ns1blankspace.user.spaceText;
												ns1blankspace.spaceContactBusiness = ns1blankspace.user.contactBusiness;
												ns1blankspace.financial.data = undefined;
												ns1blankspace.financial.initStatus = undefined;
												ns1blankspace.extend.structure = undefined;
												$('#ns1blankspaceSpaceText').html(ns1blankspace.spaceText);
												ns1blankspace.app.refresh();
											}
										}
									});	
								},

					check: 	function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										ns1blankspace.objectContextData.canSwitchInto = false;

										var oSearch = new AdvancedSearch();
										oSearch.method = 'CORE_SPACE_SEARCH';
										oSearch.addField('space,spacetext,unrestrictedaccess');
										oSearch.addFilter('space', 'EQUAL_TO', ns1blankspace.objectContextData.space)
										oSearch.getResults(function(data) {ns1blankspace.admin.space.switch.check(oParam, data)});
									}
									else
									{
										if (oResponse.data.rows.length > 0) {ns1blankspace.objectContextData.canSwitchInto = true;}
										ns1blankspace.util.onComplete(oParam);
									}
								}				
				}
}				