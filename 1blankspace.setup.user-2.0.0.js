/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.setup.user = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 22;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'user';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Users';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.user.init({showHome: true});',
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

						aHTML.push('<tr><td><div id="ns1blankspaceViewSetupUserLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');	
									
						aHTML.push('<tr><td id="ns1blankspaceControlInternal" class="ns1blankspaceControl">' +
									'Internal</td></tr>');			
								
						aHTML.push('<tr><td id="ns1blankspaceControlExternal" class="ns1blankspaceControl" style="padding-top:10px;">' +
									'Other User<br />Access</td></tr>');	

						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));
						
						$('#ns1blankspaceControlInternal').click(function(event)
						{
							ns1blankspace.show({refresh: true});
							ns1blankspace.setup.user.home();
						});

						$('#ns1blankspaceControlExternal').click(function(event)
						{
							ns1blankspace.show({refresh: true});
							ns1blankspace.setup.user.external.show();
						});

						$('#ns1blankspaceControlInternal').addClass('ns1blankspaceHighlight');

						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_USER_SEARCH';
						oSearch.addField('username,unrestrictedaccess');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(ns1blankspace.setup.user.home);
					}
					else
					{
						var aHTML = [];
						var sRestriction;

						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a user.</td></tr>' +
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
														'" class="ns1blankspaceMostLikely" style="width:250px;">' +
														this.username + 
														'</td>');

								if (this.unrestrictedaccess == 'Y')
								{
									sRestriction = "Access to everything"
								}
								else
								{
									sRestriction = "Restrictred access by role"
								}

								aHTML.push('<td id="ns1blankspaceMostLikely_restriction-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
														sRestriction + '</td>');

								aHTML.push('</tr>');

							});
							
							aHTML.push('</tbody></table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.setup.user.search.send(event.target.id, {source: 1});
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
										oSearch.method = 'SETUP_USER_SEARCH';
										oSearch.addField('username,contactpersontext,lastlogon,disabled,disabledreason,unrestrictedaccess');
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(data) {ns1blankspace.setup.user.show(data)});
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
											ns1blankspace.container.position({xhtmlElementID: sElementId});
											ns1blankspace.search.start(sElementId);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_USER_SEARCH';
											oSearch.addField('username');
											
											if (iSource == ns1blankspace.data.searchSource.browse)
											{
												oSearch.addFilter('username', 'TEXT_STARTS_WITH', sSearchText);
											}
											else
											{	
												oSearch.addFilter('username', 'TEXT_IS_LIKE', sSearchText);
											}	
											
											oSearch.getResults(ns1blankspace.setup.user.search.process);
										}
									};	
								},

					process:	function (oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var h = -1;
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
											
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'-' + this.id + '">' +
															this.username + '</td>');
											
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
										
										$('td.ns1blankspace').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.setup.user.search.send(event.target.id, 1);
										});
									}			
								}
				},				

	layout: 	function interfaceSetupUserViewport()
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
					}	

					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];
				
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAccess" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainMessaging" class="ns1blankspaceControlMain"></div>');
							
					$('#ns1blankspaceMain').html(aHTML.join(''));
						
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.setup.user.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.setup.user.details();
					});
					
					$('#ns1blankspaceControlAccess').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAccess'});
						ns1blankspace.setup.user.access.show();
					});

					$('#ns1blankspaceControlMessaging').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainMessaging'});
						ns1blankspace.setup.user.messaging();
					});
				},

	show:		function (oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.setup.user.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this user.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						var sContext = ns1blankspace.objectContextData.username;
						var aContext = sContext.split("@");
						
						sContext = aContext[0];
						
						for (var i = 1; i < aContext.length; i++)
						{
							sContext += '<br />@' + aContext[i];
						}

						$('#ns1blankspaceControlContext').html(sContext);

						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.user.init({showHome: false});ns1blankspace.setup.user.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							})
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.setup.user.summary()'})
					}		
				},	
		
	summary: 	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this user.</td></tr></table>');
								
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
						var sTmpClass = ''
						
						if (ns1blankspace.objectContextData.disabled == 'Y')
						{
							sTmpClass = ' ns1blankspaceDisabled';
						}
						

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">User Name</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryUserName" class="ns1blankspaceSummary' + sTmpClass + '">' +
										ns1blankspace.objectContextData.username +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Name</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryName" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.contactpersontext +
										'</td></tr>');
						
						if (ns1blankspace.objectContextData.lastlogon != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Last Logon</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryLastLogon" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.lastlogon +
										'</td></tr>');
						}
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<tableclass="ns1blankspaceColumn2" style="width:150px;">');
						
						aHTML.push('<tr><td id="ns1blankspaceResetPasswordContainer"><span style="font-size:0.75em;" id="ns1blankspaceResetPassword">' +
										'Reset Password</span></td></tr>');
						
						aHTML.push('</table>');								
						
						$('#tns1blankspaceSummaryColumn2').html(aHTML.join(''));
						
						$('#ns1blankspaceResetPassword').button(
						{
							
						})
						.click(function()
						{	
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('SETUP_USER_MANAGE'),
								data: 'password=&passwordexpiry=' + Date.today().add(-1).days().toString("dd-MMM-yyyy") +'&id=' + ns1blankspace.objectContext,
								dataType: 'json',
								async: false,
								success: function(data)
											{
												$('#ns1blankspaceResetPasswordContainer').html('New password is <strong>' + data.password + '</strong>.');
											}
							});
						})
					}	
				},

	details: 	function ()
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
										'User Name (Logon Name)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsUserName" class="ns1blankspaceText">' +
										'</td></tr>');			
					
						if (ns1blankspace.objectContext == -1)
						{
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
						}

						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Disabled' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioDisabledN" name="radioDisabled" value="N"/>No<br />' +
										'<input type="radio" id="radioDisabledY" name="radioDisabled" value="Y"/>Yes' +
										'</td></tr>');

						if (ns1blankspace.objectContext != -1)
						{		
							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Disabled Reason' +
										'</td></tr>' +
										'<tr class="ns1blankspaceTextMulti">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="10" cols="35" id="ns1blankspaceDetailsDisabledReason" class="ns1blankspaceTextMultiSmall"></textarea>' +
										'</td></tr>');
						}				
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsUserName').val(ns1blankspace.objectContextData.username);
							$('[name="radioDisabled"][value="' + ns1blankspace.objectContextData.disabled + '"]').attr('checked', true);
							$('#ns1blankspaceDetailsDisabledReason').val(ns1blankspace.objectContextData.disabledreason);
						}
						else
						{
							$('[name="radioDisabled"][value="N"]').attr('checked', true);
						}
					}	
				},

	access: 	{			
					layout:		function ()
								{
									var aHTML = [];

									if ($('#ns1blankspaceMainAccess').attr('data-loading') == '1')
									{
										$('#ns1blankspaceMainAccess').attr('data-loading', '');
										
										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceAccessColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
														'<td id="ns1blankspaceAccessColumn2" class="ns1blankspaceColumn2" style="width:250px;"></td>' +
														'</tr>' + 
														'</table>');
			
										$('#ns1blankspaceMainAccess').html(aHTML.join(''));
										
										var aHTML = [];
									
										aHTML.push('<table class="interfaceMain">');
									
										aHTML.push('<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceAccessUnrestricted" class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioAccessUnrestrictedY" name="radioAccessUnrestricted" value="Y"/>Access&nbsp;to&nbsp;everything<br />' +
														'<input type="radio" id="radioAccessUnrestrictedN" name="radioAccessUnrestricted" value="N"/>Restricted by role' +
														'</td></tr>');

										aHTML.push('<tr><td style="padding-top:10px;" id="ns1blankspaceRoles"></td></tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceAccessColumn1').html(aHTML.join(''));
											
										if (ns1blankspace.objectContextData != undefined)
										{
											$('[name="radioAccessUnrestricted"][value="' + ns1blankspace.objectContextData.unrestrictedaccess + '"]').attr('checked', true);
										}
										else
										{
											$('[name="radioAccessUnrestricted"][value="Y"]').attr('checked', true);
										}
									}	
								},

					show:		function (oParam, oResponse)
								{
									var aHTML = [];
																		
									ns1blankspace.setup.user.access.layout();

									if (ns1blankspace.objectContextData != undefined)
									{
										if (ns1blankspace.objectContextData.unrestrictedaccess == 'Y')
										{
											aHTML.push('<table class="ns1blankspaceColumn2">');

											aHTML.push('<tr>' +
															'<td class="ns1blankspaceNothing" style="font-weight:600;">This user can access all functions within this space.</td></tr>' +
															'<td class="ns1blankspaceNothing">If you select <em>restricted by role</em> and save, you can then allocate predefined <em>users roles</em> to them.</td></tr>');

											aHTML.push('</table>');

											$('#ns1blankspaceAccessColumn2').html(aHTML.join(''));			
										}
										else
										{
											if (oResponse == undefined)
											{
												$('#ns1blankspaceRoles').html(ns1blankspace.xhtml.loadingSmall);

												var oSearch = new AdvancedSearch();
												oSearch.method = 'SETUP_USER_ROLE_SEARCH';
												oSearch.addField('roletext,role');
												oSearch.addFilter('user', 'EQUAL_TO', ns1blankspace.objectContext)
												oSearch.rows = 50;
												oSearch.sort('roletext', 'asc');
												oSearch.getResults(function(data) {ns1blankspace.setup.user.access.show(oParam, data)})	
											}
											else
											{
												var aHTML = [];
											
												aHTML.push('<table class="ns1blankspaceColumn2">' +
																'<tr><td><span class="ns1blankspaceAction" id="ns1blankspaceUserAccessRolesAdd">' +
																'Add Role</span></td></tr>' +
																'</table>');					
												
												$('#ns1blankspaceAccessColumn2').html(aHTML.join(''));
												
												$('#ns1blankspaceUserAccessRolesAdd').button(
												{
													label: "Add Role"
												})
												.click(function() {
													ns1blankspace.container.position({xhtmlElementID: 'ns1blankspaceUserAccessRolesAdd', leftOffset: -252, topOffset: -42});
													ns1blankspace.setup.user.access.add(oParam);
												})
												.css('width', '75px')

												var aHTML = [];
												var h = -1;	
														
												aHTML.push('<table class="ns1blankspace">');
										
												if (oResponse.data.rows.length == 0)
												{
													aHTML.push('<tr><td class="ns1blankspaceNothing">' +
																	'This user has no roles and thus no functional access.</td></tr>');
												}

												$(oResponse.data.rows).each(function()
												{
													aHTML.push('<tr id="ns1blankspaceUserRole" class="ns1blankspaceRow">');
													
													aHTML.push('<td id="ns1blankspaceUserRole_title-' + this.id + '" class="ns1blankspaceRow">' +
																			this.roletext + '</td>');

													aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
																	'<span id="ns1blankspaceUserAccessRole_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>' +
																	'</td>');	

													aHTML.push('</tr>');
												});
											
												aHTML.push('</table>');
													
												$('#ns1blankspaceRoles').html(aHTML.join(''));

												$('.ns1blankspaceRowRemove').button(
												{
													text: false,
												 	icons: {primary: "ui-icon-close"}
												})
												.click(function() {
													ns1blankspace.setup.user.access.remove(this.id)
												})
												.css('width', '15px')
												.css('height', '20px')
											}
										}
									}
								},

					add:		function (oParam, oResponse)
								{
									var iUserType = 1;

									if (oParam != undefined)
									{
										if (oParam.userType != undefined) {iUserType = oParam.userType}
									}	
									else
									{
										oParam = {userType: 1}
									}
										
									if ($(ns1blankspace.xhtml.container).attr('data-initiator') == 'ns1blankspaceUserAccessRolesAdd')
									{
										$(ns1blankspace.xhtml.container).slideUp(500);
										$(ns1blankspace.xhtml.container).attr('data-initiator', '');
									}
									else
									{
										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_ROLE_SEARCH';
											oSearch.addField('title,notes')

											oSearch.getResults(function(data)
											{
												ns1blankspace.setup.user.access.add(oParam, data)
											});
										}
										else
										{
											$(ns1blankspace.xhtml.container).attr('data-initiator', 'ns1blankspaceUserAccessRolesAdd')
								
											var aHTML = [];
											
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table><tr><td class="ns1blankspaceNothing">' +
																'No roles.</td></tr></table>');

												$(ns1blankspace.xhtml.container).html(aHTML.join(''));
												$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
											}
											else
											{
												aHTML.push('<table id="ns1blankspaceUserRoles" class="ns1blankspaceSearchMedium" style="font-size:0.875em;">');
												
												$.each(oResponse.data.rows, function()
												{	
													aHTML.push('<tr class="ns1blankspaceRow">');
													
													aHTML.push('<td id="ns1blankspaceUserAccessRoles-title-' + this.id + '" class="ns1blankspaceRowSelect">' +
																			this.title + '</td>');
													
													aHTML.push('</tr>');
												});
												
												aHTML.push('</table>');;

												$(ns1blankspace.xhtml.container).html(aHTML.join(''));
												$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
												
												$('#ns1blankspaceUserRoles td.ns1blankspaceRowSelect').click(function(event)
												{
													oParam.xhtmlElementID = event.target.id;
													ns1blankspace.setup.user.access.select(oParam);
												});
											}
										}
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
										var iRole = aSearch[2];
										
										$('#' + sXHTMLElementID).fadeOut(500);
										
										var sData = 'user=' + iUser +
													'&role=' + iRole;
													
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('SETUP_USER_ROLE_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data)
											{
												if (iUserType == 1)
												{	
													ns1blankspace.setup.user.access.show()
												}
												else
												{	
													ns1blankspace.setup.user.external.show({step:3, user: iUser});
												}	
											}
										});
									}	
								},

					remove:		function (sXHTMLElementID)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									
									var sData = 'remove=1&id=' + sSearchContext;
												
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('SETUP_USER_ROLE_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
									});	
								}
				},

	xnew: 		function (oParam)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					interfaceSetupUserViewport();
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					ns1blankspaceMainViewportShow("#ns1blankspaceMainDetails");
					ns1blankspace.setup.user.details();
				},		

	save: 		{
					send: 		function (oResponse)
								{
									ns1blankspace.status.working();

									if (ns1blankspace.objectContext != -1)
									{
										ns1blankspace.setup.user.save.process();
									}
									else
									{
										if (oResponse == undefined)
										{	
											if ($('#inputInterfaceMainDetailsUserName').val() == '' ||
												$('#inputInterfaceMainDetailsFirstName').val() == '' ||
												$('#inputInterfaceMainDetailsLastName').val() == '')
											{
												ns1blankspace.status.error('Missing information.');
											}	
											else
											{
												var oSearch = new AdvancedSearch();
												oSearch.method = 'CONTACT_PERSON_SEARCH';
												oSearch.addField('firstname');
												oSearch.addFilter('contactbusiness', 'EQUAL_TO', ns1blankspace.contactBusiness);
												oSearch.addFilter('firstname', 'EQUAL_TO', $('#inputInterfaceMainDetailsFirstName').val());
												oSearch.addFilter('surname', 'EQUAL_TO', $('#inputInterfaceMainDetailsLastName').val());
												oSearch.getResults(ns1blankspace.setup.user.save.send);
											}
										}
										else	
										{
											if (oResponse.data.rows.length > 0)
											{
												ns1blankspace.setup.user.save.process(
												{
													contactPerson: oResponse.data.rows[0].contactperson,
													contactBusiness: ns1blankspace.contactBusiness
												});		
											}
											else
											{
												var sData = 'contactbusiness=' + ns1blankspace.contactBusiness;
												sData += '&firstname=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsFirstName').val());
												sData += '&surname=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsLastName').val());

												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURL('CONTACT_PERSON_MANAGE'),
													data: sData,
													dataType: 'json',
													success: function(data)
														{
															if (data.status == 'OK')
															{
																ns1blankspace.setup.user.save.process(
																{
																	contactPerson: data.id,
																	contactBusiness: ns1blankspace.contactBusiness
																});	
															}
															else
															{
																ns1blankspace.status.error('Could not add user.')
															}
														}
												});
											}	
										}
									}
								},

					process:	function (oParam)
								{
									var sData = '_=1';
									var iContactBusiness = ns1blankspace.contactBusiness;
									var iContactPerson;

									if (oParam != undefined)
									{
										if (oParam.contactBusiness != undefined) {iContactBusiness = oParam.contactBusiness}
										if (oParam.contactPerson != undefined) {iContactPerson = oParam.contactPerson}
									}		

									if (ns1blankspace.objectContext != -1)
									{
										sData += '&id=' + ns1blankspace.objectContext	
									}
									else
									{
										sData += '&contactbusiness=' + iContactBusiness;
										sData += '&contactperson=' + iContactPerson;
										sData += '&unrestrictedaccess=N';
									}
									
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&username=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsUserName').val());
										sData += '&disabled=' + $('input[name="radioDisabled"]:checked').val();
										sData += '&disabledreason=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsDisabledReason').val());
									};

									if ($('#ns1blankspaceMainAccess').html() != '')
									{
										sData += '&unrestrictedaccess=' + $('input[name="radioAccessUnrestricted"]:checked').val();
										ns1blankspace.objectContextData.unrestrictedaccess = $('input[name="radioAccessUnrestricted"]:checked').val();
										// ?? interfaceSetupUserAccessRoles();
									};

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('SETUP_USER_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data)
										{
											ns1blankspace.status.message('Saved.');
											if (ns1blankspace.objectContext == -1) {var bNew = true}
											ns1blankspace.objectContext = data.id;	
											if (bNew)
											{
												ns1blankspace.status.message('Initial password is ' + data.password);
												ns1blankspace.setup.user.search.send('-' + ns1blankspace.objectContext);
											}
											else
											{
												$('#ns1blankspaceMainAccess').is(":visible")
												{
													ns1blankspace.setup.user.access.show();
												}	
											}
										}	
									});		
								}
				},

	external:
				{					
					show:		function (oParam, oResponse)
								{
									var sXHTMLElementID = 'ns1blankspaceMain';
									var iStep = 1;
									var aXHTMLElementID = [];
									var iUser;

									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.step != undefined) {iStep = oParam.step}
										if (oParam.user != undefined) {iUser = oParam.user}
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
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_EXTERNAL_USER_ACCESS_SEARCH';
											oSearch.addField('userlogon,spacetext,usercontactpersontext,unrestrictedaccess,user');
											oSearch.rows = 50;
											oSearch.sort('userlogon', 'asc');
											oSearch.getResults(function(data) {ns1blankspace.setup.user.external.show(oParam, data)});
										}
										else
										{
											var aHTML = [];
											
											aHTML.push('<table id="ns1blankspaceSetupUserExternal" class="interfaceMain">' +
														'<tr>' +
														'<td id="ns1blankspaceSetupUserExternalColumn1" style="width:150px;border-right-style:solid;border-width:2px;border-color:#B8B8B8;padding-right:15px;"></td>' +
														'<td id="ns1blankspaceSetupUserExternalColumn2" class="ns1blankspaceColumn1Large" style="padding-left:15px;"></td>' +
														'<td id="ns1blankspaceSetupUserExternalColumn3" style="width: 100px;" class="ns1blankspaceColumn2Action"></td>' +
														'</tr>' +
														'</table>');				
											
											$('#ns1blankspaceMain').html(aHTML.join(''));
											
											var aHTML = [];
											
											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											aHTML.push('<tr><td>' +
															'<span id="ns1blankspaceSetupUserExternalAdd" class="ns1blankspaceAction">Add</span>' +
															'</td></tr>');
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceSetupUserExternalColumn3').html(aHTML.join(''));
											
											$('#ns1blankspaceSetupUserExternalAdd').button(
											{
												label: "Add"
											})
											.click(function()
											{
												oParam.step = 2;
												oParam.xhtmlElementID = '';
												ns1blankspace.setup.user.external.show(oParam);
											});

											var aHTML = [];
									
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table><tr><td valign="top">No external user access.</td></tr></table>');

												$('#ns1blankspaceSetupUserExternalColumn1').html(aHTML.join(''));
											}
											else
											{
												aHTML.push('<table>');
											
												$.each(oResponse.data.rows, function()
												{
													aHTML.push('<tr class="ns1blankspaceRow">');
													
													aHTML.push('<td id="ns1blankspaceUserExternal_title-' + this.id +
																			'" data-user="' + this.user +
																			'" data-usertext="' + this.userlogon +
																			'" data-unrestrictedaccess="' + this.unrestrictedaccess +	
																			'" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceSetupUserExternal">' +
																			this.userlogon);
													
													aHTML.push('<br /><span class="ns1blankspaceSub" id="ns1blankspaceSetupUserExternal_space-' + this.id + '">' +
									 										this.spacetext + '</span>');

													aHTML.push('<br /><span class="ns1blankspaceSub" id="ns1blankspaceSetupUserExternal_usercontactname-' + this.id + '">' +
									 										this.usercontactpersontext + '</span>');

									 				aHTML.push('</td>');						

									 				aHTML.push('<td style="width:30px;text-align:right;" class="interfaceMainRow">');
													aHTML.push('<span id="ns1blankspaceSetupUserExternal_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
													aHTML.push('</td>');		

													aHTML.push('</tr>');
												});
												
												aHTML.push('</table>');

												$('#ns1blankspaceSetupUserExternalColumn1').html(aHTML.join(''));
															
												$('td.ns1blankspaceSetupUserExternal').click(function(event)
												{
													oParam.step = 2;
													oParam.xhtmlElementID = event.target.id;
													ns1blankspace.setup.user.external.show(oParam);
												});

												$('.ns1blankspaceRowRemove').button(
												{
													text: false,
												 	icons: {primary: "ui-icon-close"}
												})
												.click(function()
												{
													oParam.step = 6;
													oParam.xhtmlElementID = this.id;
													ns1blankspace.setup.user.external.show(oParam);
												})
												.css('width', '15px')
												.css('height', '20px')
											}
										}
									}

									else if (iStep == 2)
									{
										if (oResponse == undefined)
										{
											var aHTML = [];
											
											aHTML.push('<table class="ns1blankspaceMain">');
											
											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'User' +
															'</td></tr>' +
															'<tr class="ns1blankspaceSelect">' +
															'<td class="ns1blankspaceText">' +
															'<input id="ns1blankspaceSetupUserExternalName" class="ns1blankspaceText">' +
															'</td></tr>');

											aHTML.push('<tr><td style="padding-bottom:10px;" class="ns1blankspaceNothing">You need to search by the surname<br />and enter at least 3 characters.</td></tr>');
									
											aHTML.push('<tr><td class="ns1blankspace">Access</td></tr>' +
															'<tr><td class="ns1blankspaceRadio">' +
															'<input type="radio" id="radioExternalAccessUnrestrictedY" name="radioExternalAccessUnrestricted" value="Y"/>Access&nbsp;to&nbsp;everything<br />' +
															'<input type="radio" id="radioExternalAccessUnrestrictedN" name="radioExternalAccessUnrestricted" value="N"/>Restricted by role' +
															'</td></tr>');
										
											aHTML.push('<tr><td style="padding-top:10px;" id="ns1blankspaceExternalRoles"></td></tr>');

											aHTML.push('</table>');					
											
											$('#ns1blankspaceSetupUserExternalColumn2').html(aHTML.join(''));
											
											$('#ns1blankspaceSetupUserExternalName').keyup(function()
											{
												if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
										        ns1blankspace.timer.delayCurrent = setTimeout("ns1blankspace.setup.user.external.search('ns1blankspaceSetupUserexternalname')", ns1blankspace.option.typingWait);
											});	
												
											$('#ns1blankspaceSetupUserexternalname').live('blur', function() 
											{
												$(this).removeClass('ns1blankspaceHighlight');
											});

											var aHTML = [];

											aHTML.push('<table class="ns1blankspaceColumn2">');
													
											if (aXHTMLElementID[1] && false)
											{
												aHTML.push('<tr><td class="ns1blankspaceNothing">To change this access you need to delete it and then re-add it.</td></tr>');
											}	
											else
											{	
												aHTML.push('<tr><td><span style="width:70px;" class="ns1blankspaceAction" id="ns1blankspaceSetupUserExternalEditSave">' +
																'Save</span></td></tr>');
											}

											aHTML.push('<tr><td><span style="width:70px;" class="ns1blankspaceAction" id="ns1blankspaceSetupUserExternalEditCancel">' +
																'Cancel</span></td></tr>');

											aHTML.push('<tr><td style="padding-top:20px;">' +
																'<span style="width:70px;" class="ns1blankspaceAction" id="ns1blankspaceSetupUserExternalEditRole">' +
																'Add Role</span></td></tr>');					
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceSetupUserExternalColumn3').html(aHTML.join(''));

											$('#ns1blankspaceSetupUserExternalEditSave').button(
											{
												text: "Save"
											})
											.click(function() 
											{
												ns1blankspace.status.working();

												var sData = 'id=' + ns1blankspace.util.fs(aXHTMLElementID[1]);
												sData += '&user=' + ns1blankspace.util.fs($('#ns1blankspaceSetupUserExternalName').attr("data-id"));
												sData += '&type=2';
												sData += '&unrestrictedaccess=' + ns1blankspace.util.fs($('input[name="radioExternalAccessUnrestricted"]:checked').val());

												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('SETUP_EXTERNAL_USER_ACCESS_MANAGE'),
													data: sData,
													dataType: 'json',
													success: function() {
														oParam.step = 1;
														ns1blankspace.setup.user.external.show(oParam);
														ns1blankspace.status.message('Saved');
													}
												});
											})
											
											$('#ns1blankspaceSetupUserExternalEditCancel').button(
											{
												text: "Cancel"
											})
											.click(function() 
											{
												oParam.step = 1;
												ns1blankspace.setup.user.external.show(oParam);
											})

											$('#ns1blankspaceSetupUserExternalEditRole').button(
											{
												text: "Add Role"
											})
											.click(function() 
											{
												ns1blankspace.container.position({xhtmlElementID: 'ns1blankspaceSetupUserExternalEditRole', leftOffset: -252, topOffset: -42});
												oParam.user = $('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-user");
												oParam.userType = 2;
												ns1blankspace.setup.user.access.add(oParam);
											})

											if (aXHTMLElementID[1])
											{
												$('#ns1blankspaceSetupUserExternalName').attr("data-id", $('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-user"))
												$('#ns1blankspaceSetupUserExternalName').val($('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-usertext"));
												$('[name="radioExternalAccessUnrestricted"][value="' + $('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-unrestrictedaccess") + '"]').attr('checked', true);

												oParam.user = $('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-user");
												oParam.step = 3;
												ns1blankspace.setup.user.external.show(oParam);
											}
											else
											{
												$('[name="radioExternalAccessUnrestricted"][value="N"]').attr('checked', true);
											}
										}
										else
										{

										}	
									}
									else if (iStep == 3)
									{	
										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_USER_ROLE_SEARCH';
											oSearch.addField('roletext,role');
											oSearch.addFilter('user', 'EQUAL_TO', iUser)
											oSearch.rows = 50;
											oSearch.sort('roletext', 'asc');
											oSearch.getResults(function(data) {ns1blankspace.setup.user.external.show(oParam, data)})
										}
										else
										{
											var aHTML = [];

											aHTML.push('<table id="ns1blankspaceExternalRoles">');

											$(oResponse.data.rows).each(function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
												
												aHTML.push('<td id="ns1blankspaceExternalRole_title-' + this.id + '" class="ns1blankspaceRow">' +
																this.roletext + '</td>');

												aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
																'<span id="ns1blankspaceExternalAccessRole_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span></td>');

												aHTML.push('</tr>');
											});
										
											if (aHTML.length != 1)
											{	
												aHTML.push('</table>');
												
												$('#ns1blankspaceExternalRoles').html(aHTML.join(''));

												$('#ns1blankspaceExternalRoles span.ns1blankspaceRowRemove').button(
												{
													text: false,
												 	icons: {primary: "ui-icon-close"}
												})
												.click(function() {
													ns1blankspace.setup.user.access.remove(this.id)
												})
												.css('width', '15px')
												.css('height', '20px')
											}	
										}		
									}			

									else if (iStep == 6)
									{	
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('SETUP_EXTERNAL_USER_ACCESS_MANAGE'),
											data: 'remove=1&id=' + aXHTMLElementID[1],
											dataType: 'json',
											success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
										});	
									}	
								},

					search: 	function (sXHTMLInputElementID, oResponse)
								{
									var aHTML = [];
									var sSearchText;
									var iXHTMLElementContextID;

									if (oResponse == undefined)
									{	
										sSearchText = $('#' + sXHTMLInputElementID).val();
										
										if (sSearchText.length > 3)
										{
											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('NETWORK_USER_SEARCH'),
												data: 'rows=10&scope=2&surname=' + ns1blankspace.util.fs(sSearchText),
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.user.external.search(sXHTMLInputElementID, data)}
											});
										}
									}
									else
									{	
										aHTML.push('<table style="width: 350px;">');

										$(oResponse.data.rows).each(function()
										{
											aHTML.push('<tr>' +
													'<td id="ns1blankspaceNetworkUser-' + this.user + '" data-usertext="' + this.usertext + '" class="ns1blankspaceSearch ns1blankspaceNetworkUser">' +
													this.firstname + ' ' + this.surname + ' (' + this.contactbusinesstext + ')' +
													'</td></tr>');
										});			
														
										aHTML.push('</table>');
										
										$(ns1blankspace.xhtml.container).html(aHTML.join(''));

										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										$(ns1blankspace.xhtml.container).offset({ top: $('#' + sXHTMLInputElementID).offset().top + $('#' + sXHTMLInputElementID).height(), left: $('#' + sXHTMLInputElementID).offset().left});

										$('.ns1blankspaceNetworkUser').click(function(event)
										{
											var aXHTMLElementID = (event.target.id).split('-');
											iXHTMLElementContextID = aXHTMLElementID[1];

											$('#' + sXHTMLInputElementID).val($('#' + event.target.id).attr("data-usertext"))
											$('#' + sXHTMLInputElementID).attr("data-id", iXHTMLElementContextID)
											$(ns1blankspace.xhtml.container).hide();
										});
									}	
								}
				}
}									
