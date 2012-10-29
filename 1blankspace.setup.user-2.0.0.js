/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.setup.user = 
{
	init: 		function ()
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

						aHTML.push('<tr><td id="ns1blankspaceViewSetupLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlInternal" class="ns1blankspaceControl">' +
									'Internal</td></tr>');			
								
						aHTML.push('<tr><td id="ns1blankspaceControlExternal" class="ns1blankspaceControl" style="padding-top:10px;">' +
									'Other User Access</td></tr>');	

						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));
						
						$('#ns1blankspaceControlInternal').click(function(event)
						{
							ns1blankspace.show(refresh: true});
							ns1blankspace.setup.home();
						});

						$('#ns1blankspaceControlInternal').click(function(event)
						{
							ns1blankspace.show(refresh: true});
							ns1blankspace.setup.external.show();
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
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceNothing">Click New to create a user.</td></tr>');
							aHTML.push('</table>');
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
											ns1blankspace.dialog.position({xhtmlElementID: sElementId});
											ns1blankspace.search.start(sElementId);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_USER_SEARCH';
											oSearch.addField('username');
											
											if (iSource == ns1blankspace.data.searchSource.browse)
											{
												oSearch.addFilter('username', 'STRING_STARTS_WITH', sSearchText);
											}
											else
											{	
												oSearch.addFilter('username', 'STRING_IS_LIKE', sSearchText);
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
									
						aHTML.push('<tr><td id="ns1blankspaceDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceAccess" class="ns1blankspaceControl">' +
										'Access</td></tr>');
					}	

					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];
				
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>';
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>';
					aHTML.push('<div id="ns1blankspaceMainAccess" class="ns1blankspaceControlMain"></div>';
					aHTML.push('<div id="ns1blankspaceMainMessaging" class="ns1blankspaceControlMain"></div>';
							
					$('#divInterfaceMain').html(aHTML.join(''));
						
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
						ns1blankspace.setup.user.access();
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
						
						ns1blankspace.history.object({functionDefault: 'ns1blankspace.setup.user.summary()'})
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
						var h = -1;
							
						aHTML.push('<table class="ns1blankspaceColumn2">';
					
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
						
						aHTML.push('</table>';					
						
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
														'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
														'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
														'</tr>' + 
														'</table>');

										aHTML.push('<table id="tableInterfaceMainAccess" class="interfaceMainDetails">';
										aHTML.push('<tr id="trInterfaceMainAccessRow1" class="interfaceMain">' +
														'<td id="tdInterfaceMainAccessColumn1" class="interfaceMainColumn1" style="width:200px;">' +
														'</td>' +
														'<td id="tdInterfaceMainAccessColumn2" class="interfaceMainColumn2">' +
														'</td>' +
														'</tr>';
										aHTML.push('</table>';					
										
										$('#divInterfaceMainAccess').html(aHTML.join(''));
										
										var aHTML = [];
										var h = -1;
									
										aHTML.push('<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
									
										aHTML.push('<tr id="trInterfaceMainAccessUnrestricted" class="interfaceMainText">' +
														'<td id="tdInterfaceMainAccessUnrestrictedValue" class="interfaceMainRadio">' +
														'<input type="radio" id="radioAccessUnrestrictedY" name="radioAccessUnrestricted" value="Y"/>Access&nbsp;to&nbsp;everything<br />' +
														'<input type="radio" id="radioAccessUnrestrictedN" name="radioAccessUnrestricted" value="N"/>Restricted by role' +
														'</td></tr>';
										
										aHTML.push('</table>';					
										
										$('#tdInterfaceMainAccessColumn1').html(aHTML.join(''));
											
										interfaceSetupUserAccessRoles();

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

					show:		function interfaceSetupUserAccessRoles(oParam, oResponse)
								{
									var aHTML = [];
									var h = -1;
									
									if (ns1blankspace.objectContextData != undefined)
									{
										if (ns1blankspace.objectContextData.unrestrictedaccess == 'Y')
										{
											aHTML.push('<table lass="interfaceMain">';

											aHTML.push('<tr class="interfaceMainCaption">' +
															'<td class="interfaceMainRowNothing" style="font-weight:600;">This user can access all functions within this space.</td></tr>' +
															'<td class="interfaceMainRowNothing">If you select <em>restricted access</em> and save, you can then allocate predefined <em>users roles</em> to them.</td></tr>';

											aHTML.push('</table>';

											$('#tdInterfaceMainAccessColumn2').html(aHTML.join(''));			
										}
										else
										{
											if (oResponse == undefined)
											{
												var oSearch = new AdvancedSearch();
												oSearch.method = 'SETUP_USER_ROLE_SEARCH';
												oSearch.addField('roletext,role');
												oSearch.addFilter('user', 'EQUAL_TO', ns1blankspace.objectContext)
												oSearch.rows = 50;
												oSearch.sort('roletext', 'asc');
												oSearch.getResults(function(data) {interfaceSetupUserAccessRoles(oParam, data)})	
											}
											else
											{

												var aHTML = [];
												var h = -1;
												
												aHTML.push('<table class="interfaceMain">' +
															'<tr id="trInterfaceMainUserAccessRolesRow1" class="interfaceMainRow1">' +
															'<td id="tdInterfaceMainUserAccessRolesColumn1" class="interfaceMainColumn1Large">' +
															'</td>' +
															'<td id="tdInterfaceMainUserAccessRolesColumn2" style="width: 100px;" class="interfaceMainColumn2Action">' +
															'</td>' +
															'</tr>' +
															'</table>';				
												
												$('#tdInterfaceMainAccessColumn2').html(aHTML.join(''));

												var aHTML = [];
												var h = -1;
												
												aHTML.push('<table class="interfaceMainColumn2">';
												
												aHTML.push('<tr><td id="tdInterfaceMainUserAccessRolesAdd" class="interfaceMainAction">' +
																'<span id="spanInterfaceMainUserAccessRolesAdd">Add Role</span>' +
																'</td></tr>';
												
												aHTML.push('</table>';					
												
												$('#tdInterfaceMainUserAccessRolesColumn2').html(aHTML.join(''));
												
												$('#spanInterfaceMainUserAccessRolesAdd').button(
												{
													label: "Add Role"
												})
												.click(function() {
													ns1blankspaceOptionsSetPosition('spanInterfaceMainUserAccessRolesAdd', -50, -280);
													interfaceSetupUserAccessRoleAdd(oParam);
												})
												.css('width', '75px')

												var aHTML = [];
												var h = -1;	
														
												aHTML.push('<table cellspacing="0" cellpadding="0" class="interfaceMain">';
												aHTML.push('<tbody>';

												if (oResponse.data.rows.length == 0)
												{
													aHTML.push('<tr class="interfaceMainCaption">' +
															'<td class="interfaceMainRowNothing" >This user has no roles and thus no functional access.</td></tr>';
												}

												$(oResponse.data.rows).each(function()
												{

													aHTML.push('<tr class="interfaceMainRow">';
													
													aHTML.push('<td id="interfaceUserRole_Title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect role"' +
																			' title="">' +
																			this.roletext + '</td>';

													aHTML.push('<td style="width:30px;text-align:right;" class="interfaceMainRow">';
													aHTML.push('<span id="spanUserAccessRole_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
													aHTML.push('</td>';																	
													aHTML.push('</tr>';
												});
											
												aHTML.push('</tbody></table>';
													
												$('#tdInterfaceMainUserAccessRolesColumn1').html(aHTML.join(''));

												$('td.role').click(function(event)
												{
													var sXHTMLElementId = event.target.id;
													var aId = sXHTMLElementId.split('-');
													
													interfaceSetupUserRoleMethodAccess({endpoint: aId[1], step: 2});
												});

												$('.interfaceMainRowOptionsRemove').button(
												{
													text: false,
												 	icons: {primary: "ui-icon-close"}
												})
												.click(function() {
													interfaceSetupUserAccessRoleRemove(this.id)
												})
												.css('width', '15px')
												.css('height', '20px')
											}
										}
									}
								},

					add:		function interfaceSetupUserAccessRoleAdd(oParam, oResponse)
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
										
									if ($('#divns1blankspaceViewportControlOptions').attr('data-initiator') == 'spanInterfaceMainUserAccessRolesAdd')
									{
										$('#divns1blankspaceViewportControlOptions').slideUp(500);
										$('#divns1blankspaceViewportControlOptions').attr('data-initiator', '');
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
												interfaceSetupUserAccessRoleAdd(oParam, data)
											});
										}
										else
										{
											
											$('#divns1blankspaceViewportControlOptions').attr('data-initiator', 'spanInterfaceMainUserAccessRolesAdd')
											
											var aHTML = [];
											var h = -1;
											
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table border="0" cellspacing="0" cellpadding="0" class="interfaceSearchMedium">';
												aHTML.push('<tbody>'
												aHTML.push('<tr class="interfaceMainCaption">' +
																'<td class="interfaceMainRowNothing">No roles.</td></tr>';
												aHTML.push('</tbody></table>';

												$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
												$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
											}
											else
											{
												aHTML.push('<table id="tableContactPersonGroupsAddSelect" class="interfaceSearchMedium" style="font-size:0.725em;">';
												aHTML.push('<tbody>'
												
												$.each(oResponse.data.rows, function()
												{	
													aHTML.push('<tr class="interfaceMainRow">';
													
													aHTML.push('<td id="tdUserAccessRoleAddSelect-title-' + this.id + '" class="interfaceMainRowSelect">' +
																			this.title + '</td>';
													
													aHTML.push('</tr>'
												});
												
												aHTML.push('</tbody></table>';

												$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
												$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
												
												$('td.interfaceMainRowSelect').click(function(event)
												{
													oParam.xhtmlElementID = event.target.id;
													interfaceSetupUserAccessRoleSelect(oParam);
												});
											}
										}
									}	
								},
										
					select:		function interfaceSetupUserAccessRoleSelect(oParam)
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
											url: '/ondemand/setup/?method=SETUP_USER_ROLE_MANAGE',
											data: sData,
											dataType: 'json',
											success: function(data)
											{
												if (iUserType == 1)
												{	
													interfaceSetupUserAccessRoles()
												}
												else
												{	
													interfaceSetupUserExternal({step:3, user: iUser});
												}	
											}
										});
									}	
								},

					remove:		function interfaceSetupUserAccessRoleRemove(sXHTMLElementId)
								{

									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									
									var sParam = 'method=SETUP_USER_ROLE_MANAGE&remove=1';
									var sData = 'id=' + sSearchContext;
												
									$.ajax(
										{
											type: 'POST',
											url: '/ondemand/setup/setup.asp?' + sParam,
											data: sData,
											dataType: 'json',
											success: function(data){$('#' + sXHTMLElementId).parent().parent().fadeOut(500)}
										});	
								}
				},

	new: 		function interfaceSetupUserNew(oParam)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					interfaceSetupUserViewport();
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
					interfaceSetupUserDetails();
				},		

	save: 		{
					send: 		function interfaceSetupUserSave(oResponse)
								{
									ns1blankspaceStatusWorking();

									if (ns1blankspace.objectContext != -1)
									{
										interfaceSetupUserSaveProcess();
									}
									else
									{
										if (oResponse == undefined)
										{	
											if ($('#inputInterfaceMainDetailsUserName').val() == '' ||
												$('#inputInterfaceMainDetailsFirstName').val() == '' ||
												$('#inputInterfaceMainDetailsLastName').val() == '')
											{
												ns1blankspaceStatusError('Missing information.');
											}	
											else
											{
												var oSearch = new AdvancedSearch();
												oSearch.endPoint = 'contact';
												oSearch.method = 'CONTACT_PERSON_SEARCH';
												oSearch.addField('firstname');
												oSearch.addFilter('contactbusiness', 'EQUAL_TO', ns1blankspace.contactBusiness);
												oSearch.addFilter('firstname', 'EQUAL_TO', $('#inputInterfaceMainDetailsFirstName').val());
												oSearch.addFilter('surname', 'EQUAL_TO', $('#inputInterfaceMainDetailsLastName').val());
												oSearch.getResults(interfaceSetupUserSave);
											}
										}
										else	
										{
											if (oResponse.data.rows.length > 0)
											{
												interfaceSetupUserSaveProcess(
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
													url: ns1blankspaceEndpointURL('CONTACT_PERSON_MANAGE'),
													data: sData,
													dataType: 'json',
													success: function(data)
														{
															if (data.status == 'OK')
															{
																interfaceSetupUserSaveProcess(
																{
																	contactPerson: data.id,
																	contactBusiness: ns1blankspace.contactBusiness
																});	
															}
															else
															{
																ns1blankspaceStatusError('Could not add user.')
															}
														}
												});

											}	
										}
									}
								},

					process:	function interfaceSetupUserSaveProcess(oParam)
								{
									var sParam = 'method=SETUP_USER_MANAGE';
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
										sParam += '&id=' + ns1blankspace.objectContext	
									}
									else
									{
										sData += '&contactbusiness=' + iContactBusiness;
										sData += '&contactperson=' + iContactPerson;
										sData += '&unrestrictedaccess=N';
									}
									
									if ($('#divInterfaceMainDetails').html() != '')
									{
										sData += '&username=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsUserName').val());
										sData += '&disabled=' + $('input[name="radioDisabled"]:checked').val();
										sData += '&disabledreason=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsDisabledReason').val());
									};

									if ($('#divInterfaceMainAccess').html() != '')
									{
										sData += '&unrestrictedaccess=' + $('input[name="radioAccessUnrestricted"]:checked').val();
										ns1blankspace.objectContextData.unrestrictedaccess = $('input[name="radioAccessUnrestricted"]:checked').val();
										interfaceSetupUserAccessRoles();
									};

									$.ajax(
									{
										type: 'POST',
										url: '/ondemand/setup/setup.asp?' + sParam,
										data: sData,
										dataType: 'json',
										success: function(data)
										{
											ns1blankspaceStatus('Saved.');
											if (ns1blankspace.objectContext == -1) {var bNew = true}
											ns1blankspace.objectContext = data.id;	
											if (bNew)
											{
												ns1blankspaceStatus('Initial password is ' + data.password);
												interfaceSetupUserSearch('-' + ns1blankspace.objectContext);
											}
										}	
									});		
								}
				},

	externalUser:
				{					
					show:		function interfaceSetupUserExternal(oParam, oResponse)
								{
									var sXHTMLElementID = 'divInterfaceMain';
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
											oSearch.getResults(function(data) {interfaceSetupUserExternal(oParam, data)});
										}
										else
										{
											var aHTML = [];
											var h = -1;
											
											aHTML.push('<table id="tableInterfaceMainSetupUserExternal" class="interfaceMain">' +
														'<tr id="trInterfaceMainSetupUserExternalRow1" class="interfaceMainRow1">' +
														'<td id="tdInterfaceMainSetupUserExternalColumn1" style="width:150px;border-right-style:solid;border-width:2px;border-color:#B8B8B8;padding-right:15px;">' +
														'</td>' +
														'<td id="tdInterfaceMainSetupUserExternalColumn2" class="interfaceMainColumn1Large" style="padding-left:15px;">' +
														'</td>' +
														'<td id="tdInterfaceMainSetupUserExternalColumn3" style="width: 100px;" class="interfaceMainColumn2Action">' +
														'</td>' +
														'</tr>' +
														'</table>';				
											
											$('#divInterfaceMain').html(aHTML.join(''));
											
											var aHTML = [];
											var h = -1;
											
											aHTML.push('<table>';
											
											aHTML.push('<tr><td id="tdInterfaceMainSetupUserExternalAdd" class="interfaceMainAction">' +
															'<span id="spanInterfaceMainSetupUserExternalAdd">Add</span>' +
															'</td></tr>';
											
											aHTML.push('</table>';					
											
											$('#tdInterfaceMainSetupUserExternalColumn3').html(aHTML.join(''));
											
											$('#spanInterfaceMainSetupUserExternalAdd').button(
											{
												label: "Add"
											})
											.click(function()
											{
												oParam.step = 2;
												oParam.xhtmlElementID = '';
												interfaceSetupUserExternal(oParam);
											});

											var aHTML = [];
											var h = -1;
											
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
												aHTML.push('<tbody>'
												aHTML.push('<tr class="interfaceMainCaption">' +
																'<td class="interfaceMainRowNothing">No external user access.</td></tr>';
												aHTML.push('</tbody></table>';

												$('#tdInterfaceMainSetupUserExternalColumn1').html(aHTML.join(''));
											}
											else
											{
												aHTML.push('<table>';
												aHTML.push('<tbody>';
												
												$.each(oResponse.data.rows, function()
												{
													aHTML.push('<tr class="interfaceMainRow">';
													
													aHTML.push('<td id="tdSetupUserExternal_title-' + this.id +
																			'" data-user="' + this.user +
																			'" data-usertext="' + this.userlogon +
																			'" data-unrestrictedaccess="' + this.unrestrictedaccess +	
																			'" class="interfaceMainRow interfaceRowSelect interfaceSetupUserExternal">' +
																			this.userlogon;
													
													aHTML.push('<br /><span class="interfaceViewportControlSubContext" id="interfaceSetupUserExternal_space-' + this.id + '">' +
									 										this.spacetext + '</span>';

													aHTML.push('<br /><span class="interfaceViewportControlSubContext" id="interfaceSetupUserExternal_usercontactname-' + this.id + '">' +
									 										this.usercontactpersontext + '</span>';

									 				aHTML.push('</td>';						

									 				aHTML.push('<td style="width:30px;text-align:right;" class="interfaceMainRow">';
													aHTML.push('<span id="spanSetupUserExternal_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
													aHTML.push('</td>';		

													aHTML.push('</tr>';
												});
												
												aHTML.push('</tbody></table>';

												$('#tdInterfaceMainSetupUserExternalColumn1').html(aHTML.join(''));
															
												$('td.interfaceSetupUserExternal').click(function(event)
												{
													oParam.step = 2;
													oParam.xhtmlElementID = event.target.id;
													interfaceSetupUserExternal(oParam);
												});

												$('.interfaceMainRowOptionsRemove').button(
												{
													text: false,
												 	icons: {primary: "ui-icon-close"}
												})
												.click(function()
												{
													oParam.step = 6;
													oParam.xhtmlElementID = this.id;
													interfaceSetupUserExternal(oParam);
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
											var h = -1;

											aHTML.push('<table class="interfaceMain">';
											
											aHTML.push('<tr id="trInterfaceMainSetupUserExternalUsername" class="interfaceMain">' +
															'<td id="tdInterfaceMainSetupUserExternalUsername" class="interfaceMain">' +
															'User' +
															'</td></tr>' +
															'<tr id="trInterfaceMainSetupUserExternalUsernameValue" class="interfaceMainSelect">' +
															'<td id="tdInterfaceMainSetupUserExternalUsernameValue" class="interfaceMainSelect">' +
															'<input id="inputInterfaceMainSetupUserExternalUsername" class="inputInterfaceMainSelectCustom">' +
															'</td></tr>';

											aHTML.push('<tr class="interfaceMainCaption">' +
																	'<td style="padding-bottom:10px;" class="interfaceMainRowNothing">You need to search by the surname<br />and enter at least 3 characters.</td></tr>';
									
											aHTML.push('<tr><td class="interfaceMain">Access</td></tr>' +
															'<tr><td class="interfaceMainRadio">' +
															'<input type="radio" id="radioExternalAccessUnrestrictedY" name="radioExternalAccessUnrestricted" value="Y"/>Access&nbsp;to&nbsp;everything<br />' +
															'<input type="radio" id="radioExternalAccessUnrestrictedN" name="radioExternalAccessUnrestricted" value="N"/>Restricted by role' +
															'</td></tr>';
										
											aHTML.push('<tr>' +
															'<td style="padding-top:10px;" id="interfaceMainExternalUserRoles"></td></tr>';

											aHTML.push('</table>';					
											
											$('#tdInterfaceMainSetupUserExternalColumn2').html(aHTML.join(''));
											
											$('#inputInterfaceMainSetupUserExternalUsername').keyup(function()
											{
												if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
										        ns1blankspace.timer.delayCurrent = setTimeout("interfaceSetupUserExternalSearch('inputInterfaceMainSetupUserExternalUsername')", ns1blankspace.option.typingWait);
											});	
												
											$('#inputInterfaceMainSetupUserExternalUsername').live('blur', function() 
											{
												$(this).removeClass('ns1blankspaceHighlight');
											});

											var aHTML = [];
											var h = -1;
										
											aHTML.push('<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em">';
													
											if (aXHTMLElementID[1] && false)
											{
												aHTML.push('<tr class="interfaceMainCaption">' +
																	'<td class="interfaceMainRowNothing">To change this access you need to delete it and then re-add it.</td></tr>';

											}	
											else
											{	
												aHTML.push('<tr class="interfaceMainAction">' +
																'<td class="interfaceMainAction">' +
																'<span style="width:70px;" id="spanInterfaceMainSetupUserExternalEditSave">Save</span>' +
																'</td></tr>';
											}

											aHTML.push('<tr class="interfaceMainAction">' +
																'<td class="interfaceMainAction">' +
																'<span style="width:70px;" id="spanInterfaceMainSetupUserExternalEditCancel">Cancel</span>' +
																'</td></tr>';

											aHTML.push('<tr class="interfaceMainAction">' +
																'<td style="padding-top:20px;" class="interfaceMainAction">' +
																'<span style="width:70px;" id="spanInterfaceMainSetupUserExternalEditRole">Add Role</span>' +
																'</td></tr>';					
											
											aHTML.push('</table>';					
											
											$('#tdInterfaceMainSetupUserExternalColumn3').html(aHTML.join(''));

											$('#spanInterfaceMainSetupUserExternalEditSave').button(
											{
												text: "Save"
											})
											.click(function() 
											{
												ns1blankspaceStatusWorking();

												var sData = 'id=' + ns1blankspace.util.fs(aXHTMLElementID[1]);
												sData += '&user=' + ns1blankspace.util.fs($('#inputInterfaceMainSetupUserExternalUsername').attr("data-id"));
												sData += '&type=2';
												sData += '&unrestrictedaccess=' + $('input[name="radioExternalAccessUnrestricted"]:checked').val();

												$.ajax(
												{
													type: 'POST',
													url: '/ondemand/setup/?method=SETUP_EXTERNAL_USER_ACCESS_MANAGE',
													data: sData,
													dataType: 'json',
													success: function() {
														oParam.step = 1;
														interfaceSetupUserExternal(oParam);
														ns1blankspaceStatus('Saved');
													}
												});
											})
											
											$('#spanInterfaceMainSetupUserExternalEditCancel').button(
											{
												text: "Cancel"
											})
											.click(function() 
											{
												oParam.step = 1;
												interfaceSetupUserExternal(oParam);
											})

											$('#spanInterfaceMainSetupUserExternalEditRole').button(
											{
												text: "Add Role"
											})
											.click(function() 
											{
												ns1blankspaceOptionsSetPosition('spanInterfaceMainSetupUserExternalEditRole', -42, -258);
												oParam.user = $('#tdSetupUserExternal_title-' + aXHTMLElementID[1]).attr("data-user");
												oParam.userType = 2;
												interfaceSetupUserAccessRoleAdd(oParam);
											})

											if (aXHTMLElementID[1])
											{
												$('#inputInterfaceMainSetupUserExternalUsername').attr("data-id", $('#tdSetupUserExternal_title-' + aXHTMLElementID[1]).attr("data-user"))
												$('#inputInterfaceMainSetupUserExternalUsername').val($('#tdSetupUserExternal_title-' + aXHTMLElementID[1]).attr("data-usertext"));
												$('[name="radioExternalAccessUnrestricted"][value="' + $('#tdSetupUserExternal_title-' + aXHTMLElementID[1]).attr("data-unrestrictedaccess") + '"]').attr('checked', true);

												oParam.user = $('#tdSetupUserExternal_title-' + aXHTMLElementID[1]).attr("data-user");
												oParam.step = 3;
												interfaceSetupUserExternal(oParam);
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
											oSearch.getResults(function(data) {interfaceSetupUserExternal(oParam, data)})
										}
										else
										{
											var aHTML = [];
											var h = -1;

											aHTML.push('<table><tbody>';

											$(oResponse.data.rows).each(function()
											{
												aHTML.push('<tr class="interfaceMainRow">';
												
												aHTML.push('<td id="interfaceUserRole_Title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect role"' +
																		' title="">' +
																		this.roletext + '</td>';

												aHTML.push('<td style="width:30px;text-align:right;" class="interfaceMainRow">';
												aHTML.push('<span id="spanUserAccessRole_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
												aHTML.push('</td>';																	
												aHTML.push('</tr>';
											});
										
											if (h != 0)
											{	
												aHTML.push('</tbody></table>';
												
												$('#interfaceMainExternalUserRoles').html(aHTML.join(''));

												$('.interfaceMainRowOptionsRemove').button(
												{
													text: false,
												 	icons: {primary: "ui-icon-close"}
												})
												.click(function() {
													interfaceSetupUserAccessRoleRemove(this.id)
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
												url: '/ondemand/setup/?method=SETUP_EXTERNAL_USER_ACCESS_MANAGE&remove=1',
												data: 'id=' + aXHTMLElementID[1],
												dataType: 'json',
												success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
											});	
										}	
								},

					search: 	function interfaceSetupUserExternalSearch(sXHTMLInputElementID, oResponse)
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
												url: '/ondemand/network/?method=NETWORK_USER_SEARCH&rows=10&scope=2&surname=' + ns1blankspace.util.fs(sSearchText),
												dataType: 'json',
												success: function(data) {interfaceSetupUserExternalSearch(sXHTMLInputElementID, data)}
											});
										}
									}
									else
									{	
										aHTML.push('<table style="width: 350px;" class="interfaceViewportMasterControl" cellpadding=4>');

										$(oResponse.data.rows).each(function()
										{
											aHTML.push('<tr>' +
													'<td id="tdns1blankspaceNetworkUser-' + this.user + '" data-usertext="' + this.usertext + '" class="interfaceSearch ns1blankspaceNetworkUser">' +
													this.firstname + ' ' + this.surname + ' (' + this.contactbusinesstext + ')' +
													'</td></tr>');
										});			
														
										aHTML.push('</table>');
										
										$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));

										$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
										$('#divns1blankspaceViewportControlOptions').offset({ top: $('#' + sXHTMLInputElementID).offset().top + $('#' + sXHTMLInputElementID).height(), left: $('#' + sXHTMLInputElementID).offset().left});

										$('.ns1blankspaceNetworkUser').click(function(event)
										{
											var aXHTMLElementID = (event.target.id).split('-');
											iXHTMLElementContextID = aXHTMLElementID[1];

											$('#' + sXHTMLInputElementID).val($('#' + event.target.id).attr("data-usertext"))
											$('#' + sXHTMLInputElementID).attr("data-id", iXHTMLElementContextID)
											$('#divns1blankspaceViewportControlOptions').hide();
										});
									}	
								}
				}
}									
