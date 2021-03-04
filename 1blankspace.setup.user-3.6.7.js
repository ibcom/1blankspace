/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

ns1blankspace.setup.user = 
{
	init: 	function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 22;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'user';
					ns1blankspace.viewName = 'Users';
					
					ns1blankspace.app.set(oParam);
				},

	home: 
				{
					show:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{			
										var aHTML = [];
													
										aHTML.push('<table class="ns1blankspaceMain">' +
												'<tr class="ns1blankspaceRow">' +
												'<td id="ns1blankspaceHomeColumn1" class="ns1blankspaceColumn1Flexible">' + ns1blankspace.xhtml.loading + '</td>' +
												'<td id="ns1blankspaceHomeColumn2" class="ns1blankspaceColumn2" style="width:150px;"></td>' +
												'</tr>' +
												'</table>');	
													
										$('#ns1blankspaceMain').html(aHTML.join(''));
										
										var aHTML = [];
													
										aHTML.push('<table>');

										aHTML.push('<tr><td><div id="ns1blankspaceViewSetupUserLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');	
													
										aHTML.push('<tr><td id="ns1blankspaceControlInternal" class="ns1blankspaceControl">' +
													'Internal</td></tr>');			
												
										aHTML.push('<tr><td id="ns1blankspaceControlExternal" class="ns1blankspaceControl" style="padding-top:10px;">' +
													'Switch in<br />access</td></tr>');

										aHTML.push('</table>');		
										
										$('#ns1blankspaceControl').html(aHTML.join(''));
										
										$('#ns1blankspaceControlInternal').click(function(event)
										{
											ns1blankspace.show({refresh: true});
											ns1blankspace.inputDetected = false;
											ns1blankspace.setup.user.home.show();
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
										oSearch.addField('username,unrestrictedaccess,lastlogon,disabled');
										oSearch.rows = 20;
										oSearch.sort('disabled', 'asc');
										oSearch.sort('username', 'asc');
										oSearch.getResults(function (data) {ns1blankspace.setup.user.home.show(oParam, data)});
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
											aHTML.push('<div class="ns1blankspaceCaption" style="padding-left:8px;">USERS</div>');
											aHTML.push('<table id="ns1blankspaceMostLikely" class="table">');
														
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.setup.user.home.row(this));
											});
											
											aHTML.push('</tbody></table>');
										}
										
										$('#ns1blankspaceHomeColumn1').html(aHTML.join(''));
									
										ns1blankspace.render.page.show(
										{
											xhtmlElementID: 'ns1blankspaceHomeColumn1',
											xhtmlContext: 'SetupUser',
											xhtml: aHTML.join(''),
											showMore: (oResponse.morerows == "true"),
											more: oResponse.moreid,
											rows: 30,
											functionShowRow: ns1blankspace.setup.user.home.row,
											functionOnNewPage: ns1blankspace.setup.user.home.bind,
											type: 'json',
											headerRow: false,
											bodyClass: 'table'
										});

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2">' +
															'<tr><td style="padding-top:16px;">' +
																	'<span id="ns1blankspaceUserAccessExport" class="ns1blankspaceAction"></span>' +
																	'</td></tr>' +
															'<tr><td style="padding-top:12px;" class="ns1blankspaceSubNote">' +
																	'Export a list of user details and access for security auditing.' +
																	'</td></tr>' +
														'</table>');					
										
										$('#ns1blankspaceHomeColumn2').html(aHTML.join(''));

										$('#ns1blankspaceUserAccessExport').button(
										{
											label: "Export"
										})
										.click(function()
										{
											 ns1blankspace.setup.user.export.init();
										})
									}
								},


					row:		function (oRow)
								{
									var aHTML = [];

									aHTML.push('<tr class="ns1blankspaceRow">');
												
									aHTML.push('<td id="ns1blankspaceMostLikely_title-' + oRow.id + 
															'" class="ns1blankspaceMostLikely" style="width:250px;">' +
															ns1blankspace.setup.user.util.getUsername({username: oRow.username}) + 
															'</td>');

									if (oRow.unrestrictedaccess == 'Y')
									{
										sRestriction = "Access to everything"
									}
									else
									{
										sRestriction = "Restrictred access by role"
									}

									aHTML.push('<td id="ns1blankspaceMostLikely_restriction-' + oRow.id + '" class="ns1blankspaceMostLikelySub">' +
															sRestriction + '</td>');

									aHTML.push('<td id="ns1blankspaceMostLikely_disabled-' + oRow.id + '" class="ns1blankspaceMostLikelySub">' +
															(oRow.disabled=='Y'?'Disabled':'') + '</td>');

									aHTML.push('</tr>');

									return aHTML.join('');
								},

					bind:		function ()
								{
									$('td.ns1blankspaceMostLikely').click(function(event)
									{
										ns1blankspace.setup.user.search.send(event.target.id, {source: 1});
									});
								}	
				},

	search: 	{
					send: 	function (sXHTMLElementId, iSource, sSearchText, sSearchContext)
								{
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									var iMinimumLength = 0;
									var iMaximumColumns = 1;
										
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
										oSearch.addField('username,contactpersontext,contactperson,lastlogon,disabled,disabledreason,unrestrictedaccess,authenticationlevel,' +
															'authenticationdelivery,authenticationusingaccesstoken,timezoneoffset,passwordexpiry,contactbusinesstext,contactbusiness,guid,' +
															'sessiontimeout,relationshipmanagersecuritytype,supportcontactlist' +
															',user.contactperson.email,user.contactperson.mobile,user.contactperson.firstname,user.contactperson.surname');

										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(data) {ns1blankspace.setup.user.show(data)});
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
											oSearch.method = 'SETUP_USER_SEARCH';
											oSearch.addField('username,user.contactperson.firstname,user.contactperson.surname');
											
											if (iSource == ns1blankspace.data.searchSource.browse)
											{
												oSearch.addFilter('username', 'TEXT_STARTS_WITH', sSearchText);
											}
											else
											{	
												oSearch.addFilter('username', 'TEXT_IS_LIKE', sSearchText);
												oSearch.addFilter('or');
												oSearch.addFilter('contactpersontext', 'TEXT_IS_LIKE', sSearchText); 
											}	

											ns1blankspace.search.advanced.addFilters(oSearch);
											
											oSearch.getResults(ns1blankspace.setup.user.search.process);
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
															ns1blankspace.setup.user.util.getUsername({username: this.username}) + '</td>');

											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'-' + this.id + '">' +
															this['user.contactperson.firstname'] + '</td>');

											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'-' + this.id + '">' +
															this['user.contactperson.surname'] + '</td>');
											
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
											ns1blankspace.setup.user.search.send(event.target.id, 1);
										});

										ns1blankspace.render.bind(
										{
											columns: 'username',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.setup.user.search.send
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

						aHTML.push('<tr><td id="ns1blankspaceControlAccess" class="ns1blankspaceControl">' +
										'Access</td></tr>');

						aHTML.push('</table>');

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlNetwork" class="ns1blankspaceControl">' +
										'Network</td></tr>');
					}	

					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];
				
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAccess" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainNetwork" class="ns1blankspaceControlMain"></div>');
							
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

					$('#ns1blankspaceControlNetwork').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainNetwork'});
						ns1blankspace.setup.user.network.show();
					});
				},

	show:		function (oResponse)
				{
					ns1blankspace.app.clean();
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
						
						var sContext = ns1blankspace.setup.user.util.getUsername({username: ns1blankspace.objectContextData.username});

						var aContext = sContext.split("@");
						
						sContext = aContext[0];
						
						for (var i = 1; i < aContext.length; i++)
						{
							sContext += '<br />@' + aContext[i];
						}

						$('#ns1blankspaceControlContext').html(sContext);

						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.setup.user.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.setup.user.summary()'})
					}		
				},	
		
	summary: function ()
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
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:250px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
					
						var aHTML = [];
						var sTmpClass = ''
						
						if (ns1blankspace.objectContextData.disabled == 'Y')
						{
							sTmpClass = ' ns1blankspaceDisabled';
						}

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Logon Name</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryUserName" class="ns1blankspaceSummary' + sTmpClass + '">' +
										ns1blankspace.setup.user.util.getUsername({username: ns1blankspace.objectContextData.username}) +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Name</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryName" class="ns1blankspaceSummary">' +
										'<div data-id="' + ns1blankspace.objectContextData.contactperson + '" data-object="contactPerson" class="ns1blankspaceViewLink">' +
											ns1blankspace.objectContextData['user.contactperson.firstname'] + ' ' +
											ns1blankspace.objectContextData['user.contactperson.surname'] + '</div>');


						if (ns1blankspace.objectContextData['user.contactperson.email'] != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Email</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryEmail" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData['user.contactperson.email'] +
										'</td></tr>');
						}

						if (ns1blankspace.objectContextData['user.contactperson.mobile'] != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Mobile</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryMobile" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData['user.contactperson.mobile'] +
										'</td></tr>');
						}
						
						if (ns1blankspace.objectContextData.contactbusiness != ns1blankspace.user.contactBusiness)
						{
							aHTML.push('<div class="ns1blankspaceSubNote">' +
										ns1blankspace.objectContextData.contactbusinesstext +
										'<div>');
						}

						aHTML.push('</td></tr>');

						if (ns1blankspace.objectContextData.lastlogon == '')
						{
							ns1blankspace.objectContextData.lastlogon = '<i>Never</i>';
						}
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Last Logon (UTC)</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryLastLogon" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.lastlogon +
										'</td></tr>');

						if (ns1blankspace.objectContextData.passwordexpiry != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Password Expiry</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryPasswordExpiry" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.passwordexpiry +
										'</td></tr>');
						}
						
						if (ns1blankspace.objectContextData.timezoneoffset != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Time Zone From UTC (hours)</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryTimeZoneOffset" class="ns1blankspaceSummary">' +
										(ns1blankspace.objectContextData.timezoneoffset) +
										'</td></tr>');
						}

						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');
						
						aHTML.push('<tr><td id="ns1blankspaceResetPasswordContainer"><span style="font-size:0.75em;" id="ns1blankspaceResetPassword">' +
										'Reset Password</span></td></tr>');

						aHTML.push('<tr class="ns1blankspaceUserGenerateTOTP"><td class="ns1blankspaceSubNote" style="padding-top:10px;">' +
										'Generate a random password that the user will be prompted to reset when they use it to log on.' +
										'</td></tr>');

						if (ns1blankspace.objectContextData.authenticationdelivery == 3) //TOTP
						{
							aHTML.push('<tr class="ns1blankspaceUserGenerateTOTP"><td style="padding-top:20px">' +
												'<span class="ns1blankspaceAction" id="ns1blankspaceUserGenerateTOTP"></span>' +
												'</td></tr>' +
												'<tr class="ns1blankspaceUserGenerateTOTP"><td class="ns1blankspaceSubNote">' +
												'<p>Generate a new random key/QR code that can be used to setup a TOTP client, ie like Google Authenticator.</p>' +
												'<p>If the user already has a TOTP client setup then clicking this will disable it and it will need to be reset up using the new key.</p>' +
												'</td></tr>' +
												'<tr><td id="ns1blankspaceUserGenerateTOTPContainer" style="padding-top:10px;">' +
												'</td></tr>')
						}
						
						aHTML.push('</table>');								
						
						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));

						$('#ns1blankspaceUserGenerateTOTP').button(
						{
							label: "Generate TOTP Key"
						})
						.click(function()
						{	
							ns1blankspace.setup.user.util.generateTOTPKey(
							{
								xhtmlElementID: 'ns1blankspaceUserGenerateTOTPContainer'
							});
						});
						
						$('#ns1blankspaceResetPassword').button()
						.click(function()
						{	
							ns1blankspace.status.working();

							var sPassword = ns1blankspace.setup.user.util.generatePassword();

							sPassword += (ns1blankspace.option.passwordSuffix!=undefined?ns1blankspace.option.passwordSuffix:'')

							var oData =
							{
								userpassword: sPassword,
								passwordexpiry: Date.today().add(-1).days().toString("dd-MMM-yyyy"),
								id: ns1blankspace.objectContext
							}

							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('SETUP_USER_MANAGE'),
								data: oData,
								dataType: 'json',
								async: false,
								success: function(data)
											{
												ns1blankspace.status.clear();
												if (data.password != undefined) {sPassword = data.password}

												$('#ns1blankspaceResetPasswordContainer').html('New password is <strong>' +
														ns1blankspace.setup.user.util.getPassword({password: sPassword}) + '</strong>');
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
										'Logon Name' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsUserName" class="ns1blankspaceText">' +
										'</td></tr>');			
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Password' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPassword" class="ns1blankspaceText" type="password" autocomplete="new-password">' +
										'</td></tr>');

						if (ns1blankspace.objectContext == -1)
						{
							aHTML.push('<tr"><td class="ns1blankspaceSubNote">' +
										'Leave the password blank to have it auto-generated.' +
										'</td></tr>')
						}

						aHTML.push('<tr><td class="ns1blankspaceSubNote ns1blankspaceRadio" style="font-size:0.75em;">' +
											'<input type="checkbox" id="ns1blankspaceDetailsPasswordExpired" />' +
											'Prompt user to change password on next logon.</td>');
							
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

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Authentication' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioAuthenticationLevel1" name="radioAuthenticationLevel" value="1"/>Standard ' +
													'<span class="ns1blankspaceSubNote">(Only if trusted client, ie other service)</span><br />' +
										'<input type="radio" id="radioAuthenticationLevel2" name="radioAuthenticationLevel" value="2"/>With Logon Key ' +
												'<span class="ns1blankspaceSubNote">(Only if can\'t do 2nd Factor)</span><br />' +
										'<input type="radio" id="radioAuthenticationLevel3" name="radioAuthenticationLevel" value="3"/>With 2nd Factor Token ' +
													'<span class="ns1blankspaceSubNote">(Best)</span>' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'2nd Factor Token Type' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioAuthenticationDelivery1" name="radioAuthenticationDelivery" value="1"/>Send Email<br />' +
										'<input type="radio" id="radioAuthenticationDelivery2" name="radioAuthenticationDelivery" value="2"/>Send SMS')

						if (ns1blankspace.option.logonTOTP != undefined)
						{
							if (ns1blankspace.option.logonTOTP.enabled)
							{
								aHTML.push('<br /><input type="radio" id="radioAuthenticationDelivery3" name="radioAuthenticationDelivery" value="3"/>TOTP Client' +
											' <a href="https://docs.mydigitalstructure.com/gettingstarted_authentication_totp" target="_blank"><span class="ns1blankspaceSubNote">(What is this?)</span></a>');
							}	
						}

						aHTML.push('</td></tr>');

						if (ns1blankspace.option.logonAccessToken)
						{
							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Logon using an Access Token' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioAuthenticationAccessToken1" name="radioAuthenticationAccessToken" value="1"/>Disabled' +
										'<br /><input type="radio" id="radioAuthenticationAccessToken2" name="radioAuthenticationAccessToken" value="2"/>Can be used as 2nd factor token' +
										'<br /><input type="radio" id="radioAuthenticationAccessToken3" name="radioAuthenticationAccessToken" value="3"/>Can be used to authenticate' +
										' <a href="https://docs.mydigitalstructure.com/gettingstarted_authentication" target="_blank"><span class="ns1blankspaceSubNote">(What is this?)</span></a>' +
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
						else
						{								
							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Alternate business contact' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceSetupUserBusiness" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_BUSINESS_SEARCH"' +
											' data-columns="tradename">' +
										'</td></tr>');	

							aHTML.push('<tr><td class="ns1blankspaceSub" style="font-size:0.75em;">' +
										'Defaults to internal contacts. Only change this if sure know why you are.' +
										'</td></tr>');												
						}

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Time Zone From UTC (hours)' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsTimezoneOffset" class="ns1blankspaceText">' +
										'</td></tr>');

						if (ns1blankspace.objectContext != -1)
						{	
							if (ns1blankspace.objectContextData.authenticationdelivery == 3) //TOTP
							{
								aHTML.push('<tr class="ns1blankspaceUserGenerateTOTP">' +
												'<td class="ns1blankspaceCaption" style="padding-top:12px;">' +
												'TOTP Client Set up' +
												'</td></tr>' +
												'<tr class="ns1blankspaceUserGenerateTOTP"><td>' +
													'<span class="ns1blankspaceAction" id="ns1blankspaceUserDetailsGenerateTOTP"></span>' +
													'</td></tr>' +
												'<tr><td id="ns1blankspaceUserDetailsGenerateTOTPContainer">' +
													'</td></tr>')
							}
						}

						aHTML.push('<tr><td id="ns1blankspaceSetupUserNotes" style="padding-top:10px;"></td></tr>')
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsUserName').val(ns1blankspace.setup.user.util.getUsername({username: ns1blankspace.objectContextData.username}));
							$('[name="radioDisabled"][value="' + ns1blankspace.objectContextData.disabled + '"]').attr('checked', true);
							$('[name="radioAuthenticationLevel"][value="' + ns1blankspace.objectContextData.authenticationlevel  + '"]').attr('checked', true);
							$('[name="radioAuthenticationDelivery"][value="' + ns1blankspace.objectContextData.authenticationdelivery + '"]').attr('checked', true);
							$('[name="radioAuthenticationAccessToken"][value="' + ns1blankspace.objectContextData.authenticationusingaccesstoken + '"]').attr('checked', true);
							$('#ns1blankspaceDetailsDisabledReason').val(ns1blankspace.objectContextData.disabledreason);
							$('#ns1blankspaceDetailsTimezoneOffset').val(ns1blankspace.objectContextData.timezoneoffset);
						}
						else
						{
							$('[name="radioDisabled"][value="N"]').attr('checked', true);
							$('[name="radioAuthenticationLevel"][value="2"]').attr('checked', true);
							$('[name="radioAuthenticationDelivery"][value="1"]').attr('checked', true);
							$('[name="radioAuthenticationAccessToken"][value="1"]').attr('checked', true);

						}

						$('#ns1blankspaceUserDetailsGenerateTOTP').button(
						{
							label: "Generate Key"
						})
						.click(function()
						{	
							ns1blankspace.setup.user.util.generateTOTPKey(
							{
								xhtmlElementID: 'ns1blankspaceUserDetailsGenerateTOTPContainer'
							});
						})
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
									
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td>' +
														'<div class="ns1blankspaceCaption">Functional</div>' +
														'<div class="ns1blankspaceSubNote" style="padding-left:2px;">What the user can do</div>' +
														'</td></tr>' +
														'<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceAccessUnrestricted" class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioAccessUnrestrictedY" name="radioAccessUnrestricted" value="Y"/>Access&nbsp;to&nbsp;everything<br />' +
														'<input type="radio" id="radioAccessUnrestrictedN" name="radioAccessUnrestricted" value="N"/>Restricted by role' +
														'</td></tr>');

										aHTML.push('<tr><td style="padding-top:10px;" id="ns1blankspaceRoles"></td></tr>');

											if (ns1blankspace.option.userRelationshipManagerBasedAccess)
											{	
												aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption" style="padding-top:12px;">' +
													'<div class="ns1blankspaceCaption">Relational</div>' +
													'<div class="ns1blankspaceSubNote" style="padding-left:2px;">Access to data is based on a users relationships via their linked contact\'s relationships.</div>' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceRadio">' +
													'<div style="margin-top:10px;"><input type="radio" id="radioRelationshipManagerBasedAccessLevel1" name="radioRelationshipManagerBasedAccessLevel" value="1"/>Disabled</div><div style="margin-bottom:10px; margin-top:-6px;"><span class="ns1blankspaceSubNote">Access to all data based on functional access.</div>' +
													'<div><input type="radio" id="radioRelationshipManagerBasedAccessLevel2" name="radioRelationshipManagerBasedAccessLevel" value="2"/>Standard</div><div style="margin-bottom:10px; margin-top:-6px;"><span class="ns1blankspaceSubNote">Can only see data if has relationship with contact that data is linked to, and contacts that are users.</span></div>' +
													'<div><input type="radio" id="radioRelationshipManagerBasedAccessLevel3" name="radioRelationshipManagerBasedAccessLevel" value="3"/>Tight</div><div style="margin-bottom:10px; margin-top:-6px;"><span class="ns1blankspaceSubNote">Can only see data if has relationship with contact that data is linked to.</span></div>' +
													'</td></tr>');
											}	
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceAccessColumn1').html(aHTML.join(''));
											
										if (ns1blankspace.objectContextData != undefined)
										{
											$('[name="radioAccessUnrestricted"][value="' + ns1blankspace.objectContextData.unrestrictedaccess + '"]').attr('checked', true);
											$('[name="radioRelationshipManagerBasedAccessLevel"][value="' + ns1blankspace.objectContextData.relationshipmanagersecuritytype + '"]').attr('checked', true);

										}
										else
										{
											$('[name="radioAccessUnrestricted"][value="Y"]').attr('checked', true);
											$('[name="radioRelationshipManagerBasedAccessLevel"][value="1"]').attr('checked', true);

										}
									}	
								},

					show:		function (oParam, oResponse)
								{
									var aHTML = [];
																		
									ns1blankspace.setup.user.access.layout();

									if (ns1blankspace.objectContextData != undefined)
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

											if (ns1blankspace.objectContextData.unrestrictedaccess == 'Y')
											{
												aHTML.push('<table class="ns1blankspaceColumn2">');

												aHTML.push('<tr>' +
																'<td class="ns1blankspaceNothing" style="font-weight:600;">This user can access all functions within this space.</td></tr>' +
																'<tr><td class="ns1blankspaceNothing" style="padding-bottom:15px;">If you select <em>restricted by role</em>, the user will be restricted to any predefined <em>user roles</em> assigned to them.</td></tr>');	
											}
										
											aHTML.push('<table class="ns1blankspaceColumn2">' +
															'<tr><td><span class="ns1blankspaceAction" id="ns1blankspaceUserAccessRolesAdd">' +
															'</span></td></tr>');

											aHTML.push('</table>');				
											
											$('#ns1blankspaceAccessColumn2').html(aHTML.join(''));
											
											$('#ns1blankspaceUserAccessRolesAdd').button(
											{
												label: "Add Role"
											})
											.click(function()
											{
												ns1blankspace.setup.user.access.add(oParam);
											})
											.css('width', '75px')

											var aHTML = [];
											var h = -1;	
													
											aHTML.push('<table class="ns1blankspace" id="ns1blankspaceUserUserRoles">');
									
											if (oResponse.data.rows.length == 0)
											{
												if (ns1blankspace.objectContextData.unrestrictedaccess == 'N')
												{
													aHTML.push('<tr><td class="ns1blankspaceNothing">' +
																'This user has no roles and thus no functional access.</td></tr>');
												}
												else
												{
													aHTML.push('<tr><td class="ns1blankspaceNothing">' +
																'This user has no roles assigned to them.</td></tr>');
												}	
											}

											$(oResponse.data.rows).each(function()
											{
												aHTML.push('<tr id="ns1blankspaceUserRole" class="ns1blankspaceRow">');
												
												aHTML.push('<td id="ns1blankspaceUserRole_title-' + this.role + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
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
											.click(function()
											{
												ns1blankspace.setup.user.access.remove(this.id)
											})
											.css('width', '15px')
											.css('height', '20px');

											$('#ns1blankspaceUserUserRoles td.ns1blankspaceRowSelect')
											.click(function()
											{
												ns1blankspace.setup.userRole.init({id: (this.id).split('-')[1]})
											});
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

									var sXHTMLElementID = 'ns1blankspaceUserAccessRolesAdd';
									if (iUserType == 2) {sXHTMLElementID = 'ns1blankspaceSetupUserExternalEditRole'}
										
									if ($(ns1blankspace.xhtml.container).attr('data-initiator') == sXHTMLElementID)
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
											oSearch.rows = 100;
											oSearch.sort('title', 'asc');
											oSearch.getResults(function(data)
											{
												ns1blankspace.setup.user.access.add(oParam, data)
											});
										}
										else
										{
											ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: -252, topOffset: -42});
	
											var aHTML = [];
											
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table class="ns1blankspaceSearchMedium" style="font-size:0.875em;"><tr><td class="ns1blankspaceNothing">' +
																'No roles.</td></tr>' +
																'<tr><td class="ns1blankspaceNothing">' +
																'To add a user role select User Roles from the main menu.</td></tr></table>');

												$(ns1blankspace.xhtml.container).html(aHTML.join(''));
												$(ns1blankspace.xhtml.container).css('width', $(ns1blankspace.xhtml.container + ' table').width() + 'px');
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
												$(ns1blankspace.xhtml.container).css('width', $(ns1blankspace.xhtml.container + ' table').width() + 'px');
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
													ns1blankspace.container.hide({force: true});
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


	network: 	{
					show:		function (oResponse)
								{	
									var aHTML = [];
									
									aHTML.push('<table class="ns1blankspaceContainer">');
									aHTML.push('<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceNetworkColumn1" class="ns1blankspaceColumn1"></td>' +
													'<td id="ns1blankspaceNetworkColumn2" class="ns1blankspaceColumn2"></td>' +
													'</tr>');
									aHTML.push('</table>');					
									
									$('#ns1blankspaceMainNetwork').html(aHTML.join(''));
									
									var aHTML = [];
									
									aHTML.push('<table class="ns1blankspace">');
									
									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Can switch into other spaces' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceRadio">' +
													'<input type="radio" id="radioSwitchN" name="radioSwitch" value="N"/>No<br />' +
													'<input type="radio" id="radioSwitchY" name="radioSwitch" value="Y"/>Yes' +
													'</td></tr>');

									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Can participate in conversations' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceRadio" id="ns1blankspaceUserConversations" data-id="">' +
													'<input type="radio" id="radioConversationsN" name="radioConversations" value="N"/>No<br />' +
													'<input type="radio" id="radioConversationsY" name="radioConversations" value="Y"/>Yes' +
													'</td></tr>');

									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Can accept support issues' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceRadio" id="ns1blankspaceUserSupportContact" data-id="">' +
													'<input type="radio" id="radioSupportContactN" name="radioSupportContact" value="N"/>No<br />' +
													'<input type="radio" id="radioSupportContactY" name="radioSupportContact" value="Y"/>Yes' +
													'</td></tr>');

									aHTML.push('</table>');					
									
									$('#ns1blankspaceNetworkColumn1').html(aHTML.join(''));

									if (ns1blankspace.objectContextData != undefined)
									{
										$('[name="radioSupportContact"][value="' + ns1blankspace.objectContextData.supportcontactlist + '"]').attr('checked', true);
									}
									else
									{
										$('[name="radioSupportContact"][value="N"]').attr('checked', true);
									}

									ns1blankspace.setup.user.network.spaces();
									ns1blankspace.setup.user.network.conversations();
								},	

					spaces:	function (oResponse)
								{	
									if (oResponse == undefined)
									{	
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('NETWORK_USER_SEARCH'),
											data: 'scope=3&contactperson=' + ns1blankspace.objectContextData.contactperson,
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.setup.user.network.spaces(data);
											}
										});
									}	
									else
									{	
										if (oResponse.data.rows.length > 0)
										{
											$('[name="radioSwitch"][value="Y"]').attr('checked', true);
											
										}
										else
										{
											$('[name="radioSwitch"][value="N"]').attr('checked', true);
										}
									}
								},

					conversations:
								function (oResponse)
								{	
									if (oResponse == undefined)
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
										oSearch.addField('user');
										oSearch.addFilter('type', 'EQUAL_TO', 4);
										oSearch.addFilter('user', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.rows = 1;
										oSearch.getResults(function (data) {ns1blankspace.setup.user.network.conversations(data)});
									}	
									else
									{	
										if (oResponse.data.rows.length > 0)
										{
											$('[name="radioConversations"][value="Y"]').attr('checked', true);
											$('#ns1blankspaceUserConversations').attr('data-id', oResponse.data.rows[0].id)
										}
										else
										{
											$('[name="radioConversations"][value="N"]').attr('checked', true);
											$('#ns1blankspaceUserConversations').attr('data-id', '');
										}
									}
								}										
				},	

	save: 	{
					send: 	function (oResponse)
								{
									ns1blankspace.status.working();

									if (ns1blankspace.objectContext != -1)
									{
										ns1blankspace.setup.user.save.process();
									}
									else
									{
										var iContactBusiness = ns1blankspace.spaceContactBusiness;
										if (iContactBusiness == undefined) {iContactBusiness = ns1blankspace.user.contactBusiness};

										if ($('#ns1blankspaceSetupUserBusiness').attr('data-id') != ''
												&& $('#ns1blankspaceSetupUserBusiness').attr('data-id') != undefined)
										{iContactBusiness = $('#ns1blankspaceSetupUserBusiness').attr('data-id')}

										if (oResponse == undefined)
										{	
											if ($('#ns1blankspaceDetailsUserName').val() == '' ||
												$('#ns1blankspaceDetailsFirstName').val() == '' ||
												$('#ns1blankspaceDetailsLastName').val() == '')
											{
												ns1blankspace.status.error('Missing information.');
											}	
											else
											{
												var oSearch = new AdvancedSearch();
												oSearch.method = 'CONTACT_PERSON_SEARCH';
												oSearch.addField('firstname');
												oSearch.addFilter('contactbusiness', 'EQUAL_TO', iContactBusiness);
												oSearch.addFilter('firstname', 'EQUAL_TO', $('#ns1blankspaceDetailsFirstName').val());
												oSearch.addFilter('surname', 'EQUAL_TO', $('#ns1blankspaceDetailsLastName').val());
												oSearch.getResults(ns1blankspace.setup.user.save.send);
											}
										}
										else	
										{
											if (oResponse.data.rows.length > 0)
											{
												ns1blankspace.setup.user.save.process(
												{
													contactPerson: oResponse.data.rows[0].id,
													contactBusiness: iContactBusiness
												});		
											}
											else
											{
												var sData = 'contactbusiness=' + iContactBusiness;
												sData += '&firstname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFirstName').val());
												sData += '&surname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsLastName').val());

												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('CONTACT_PERSON_MANAGE'),
													data: sData,
													dataType: 'json',
													success: function(data)
														{
															if (data.status == 'OK')
															{
																ns1blankspace.setup.user.save.process(
																{
																	contactPerson: data.id,
																	contactBusiness: iContactBusiness
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
									var iContactBusiness = ns1blankspace.user.contactBusiness;
									var iContactPerson;

									if (oParam != undefined)
									{
										if (oParam.contactBusiness != undefined) {iContactBusiness = oParam.contactBusiness}
										if (oParam.contactPerson != undefined) {iContactPerson = oParam.contactPerson}
									}		

									if (ns1blankspace.objectContext != -1)
									{
										sData += '&id=' + ns1blankspace.objectContext;
									}
									else
									{
										sData += '&sessiontimeout=20';
										sData += '&contactbusiness=' + iContactBusiness;
										sData += '&contactperson=' + iContactPerson;
										sData += '&unrestrictedaccess=N';
										sData += '&newsalerts=N';
										//sData += '&disabled=N';
									}
									
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&username=' + ns1blankspace.util.fs(ns1blankspace.setup.user.util.setUsername({username: $('#ns1blankspaceDetailsUserName').val()}));
										sData += '&disabled=' + $('input[name="radioDisabled"]:checked').val();
										sData += '&disabledreason=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDisabledReason').val());
										sData += '&authenticationlevel=' + $('input[name="radioAuthenticationLevel"]:checked').val();
										sData += '&authenticationdelivery=' + $('input[name="radioAuthenticationDelivery"]:checked').val();
										sData += '&authenticationusingaccesstoken=' + $('input[name="radioAuthenticationAccessToken"]:checked').val();

										var sPassword = $('#ns1blankspaceDetailsPassword').val();

										if (ns1blankspace.objectContext == -1 && sPassword == '')
										{
											var sPassword = ns1blankspace.setup.user.util.generatePassword();
										}

										if (sPassword != '')
										{	
											sData += '&userpassword=' + ns1blankspace.util.fs(ns1blankspace.setup.user.util.setPassword({password: sPassword}));
										}

										if ($('#ns1blankspaceDetailsPasswordExpired:checked').length!=0)
										{
											sData += '&passwordexpiry=' + ns1blankspace.util.fs(Date.today().add(-1).days().toString("dd-MMM-yyyy"));
										}
										else
										{
											sData += '&passwordexpiry=' + ns1blankspace.util.fs(Date.today().add(365).days().toString("dd-MMM-yyyy"));
										}
									};

									if ($('#ns1blankspaceMainAccess').html() != '')
									{
										sData += '&unrestrictedaccess=' + $('input[name="radioAccessUnrestricted"]:checked').val();
										ns1blankspace.objectContextData.unrestrictedaccess = $('input[name="radioAccessUnrestricted"]:checked').val();

										if (ns1blankspace.option.userRelationshipManagerBasedAccess)
										{
											sData += '&relationshipmanagersecuritytype=' + $('input[name="radioRelationshipManagerBasedAccessLevel"]:checked').val();
											ns1blankspace.objectContextData.relationshipmanagersecuritytype = $('input[name="radioRelationshipManagerBasedAccessLevel"]:checked').val();
										}
									};

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('SETUP_USER_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data)
										{
											if (data.status == 'OK')
											{
												if (ns1blankspace.objectContext == -1) {var bNew = true}
												ns1blankspace.objectContext = data.id;
											
												if (bNew)
												{
													if (data.password != undefined) {sPassword = data.password};
													ns1blankspace.status.message('Initial password is ' + sPassword, {timeout: false});
												}
												else
												{
													ns1blankspace.status.message('Saved.');

													$('#ns1blankspaceMainAccess').is(":visible")
													{
														ns1blankspace.setup.user.access.show();
													}	
												}

												ns1blankspace.inputDetected = false;
												ns1blankspace.setup.user.search.send('-' + ns1blankspace.objectContext);
											}
											else
											{
												var sErrorNotes = _.upperFirst(data.error.errornotes);

												if (ns1blankspace.setup.space != undefined)
												{
													if (_.includes(sErrorNotes, 'Password not strong enough.'))
													{
														sErrorNotes = _.split(sErrorNotes, 'Password not strong enough. ')[1];
														var oErrorNotes = _.split(sErrorNotes, ',');
														var sCurrentStrength = ns1blankspace.setup.space.notes.passwordStrength[oErrorNotes[0].split(' ').pop()];
														var sMiniumStrength = ns1blankspace.setup.space.notes.passwordStrength[oErrorNotes[1].split(' ').pop()];
														sErrorNotes = 'Password not strong enough. ' +
																			'Strength is <i>' + sCurrentStrength + '</i> (' + oErrorNotes[0].split(' ').pop() + '), ' +
																			'but it needs to be at least <i>' + sMiniumStrength + '</i> (' + oErrorNotes[1].split(' ').pop() + ').';

														$('#ns1blankspaceSetupUserNotes').html(
															'<div style="padding:10px; background-color: #F3F3F3;" class="ns1blankspaceSubNote ns1blankspaceRowShaded">' +
															'<div style="font-weight:600; color:red; margin-bottom:6px;">' + sErrorNotes + '</div>' +
															'<div style="font-weight:600;">Password strength points (in the brackets) are calculated as follows...</div>' +
															'<div>' + ns1blankspace.setup.space.notes.passwordStrengthScoring.join('<br/>') + '</div>')
													}
													else
													{
														$('#ns1blankspaceSetupUserNotes').html('');
													}
												}
												
												ns1blankspace.status.error(sErrorNotes)
											}	
										}	
									});

									if ($('#ns1blankspaceMainNetwork').html() != '')
									{

										var oData = 
										{
											id: ns1blankspace.objectContext,
											supportcontactlist: $('input[name="radioSupportContact"]:checked').val()
										}

										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('SETUP_USER_MANAGE'),
											data: oData,
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.status.message('Updated')
											}
										});	

										var sData = 'canswitch=' + ns1blankspace.util.fs($('input[name="radioSwitch"]:checked').val()) +
														'&contactperson=' + ns1blankspace.objectContextData.contactperson

										//ns1blankspace.util.endpointURI('NETWORK_USER_MANAGE'),

										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/network/?method=NETWORK_USER_MANAGE',
											data: sData,
											dataType: 'json'
										});

										var iID = $('#ns1blankspaceUserConversations').attr('data-id');
										var bCan = ($('input[name="radioConversations"]:checked').val() == 'Y');
										oData = undefined;

										if (bCan && iID != '') {}
										else
										{
											if (bCan && iID == '')
											{
												var oData =
												{
													user: ns1blankspace.objectContext,
													type: 4,
													accountname: ns1blankspace.setup.user.util.getUsername({username: ns1blankspace.objectContextData.username}),
													title: ns1blankspace.setup.user.util.getUsername({username: ns1blankspace.objectContextData.username}),
												}
											}
											else if (!bCan && iID != '')
											{
												var oData =
												{
													id: iID,
													remove: 1
												}
											}

											if (oData !== undefined)
											{
												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('SETUP_MESSAGING_ACCOUNT_MANAGE'),
													data: oData,
													dataType: 'json'
												});
											}	
										}
									};	
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
											oSearch.addField('userlogon,spacetext,usercontactpersontext,unrestrictedaccess,user,targetuser,targetusertext,createddate,authenticationlevelminimum,type,typetext');
											oSearch.rows = 50;
											oSearch.sort('userlogon', 'asc');
											oSearch.getResults(function(data) {ns1blankspace.setup.user.external.show(oParam, data)});
										}
										else
										{
											var aHTML = [];
											
											aHTML.push('<table id="ns1blankspaceSetupUserExternal" class="interfaceMain">' +
														'<tr>' +
														'<td id="ns1blankspaceSetupUserExternalColumn1" style="width:300px;border-right-style:solid;border-width:2px;border-color:#B8B8B8;padding-right:15px;"></td>' +
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
												aHTML.push('<table><tr><td class="ns1blankspaceSub">No external user access.</td></tr></table>');

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
																			'" data-targetuser="' + this.targetuser +
																			'" data-targetusertext="' + this.targetusertext +
																			'" data-created="' + this.createddate +
																			'" data-type="' + this.type +
																			'" data-authenticationlevelminimum="' + this.authenticationlevelminimum +
																			'" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceSetupUserExternal">' +
																			this.userlogon);
													
													aHTML.push('<br /><span class="ns1blankspaceSub" id="ns1blankspaceSetupUserExternal_space-' + this.id + '">' +
									 										this.spacetext + '</span>');

													this._usercontactpersontext = _.split(this.usercontactpersontext, ', ');

													if (this._usercontactpersontext.length == 2)
													{
														this.usercontactpersontext = this._usercontactpersontext[0] + ' ' + this._usercontactpersontext[1];
													}

													aHTML.push('<br /><span class="ns1blankspaceSub" id="ns1blankspaceSetupUserExternal_usercontactname-' + this.id + '">' +
									 										this.usercontactpersontext + '</span>');

													if (this.type == 2) {this.typetext = 'Switch In'}

													aHTML.push('<br /><span class="ns1blankspaceSub" id="ns1blankspaceSetupUserExternal_type-' + this.id + '">' +
									 										this.typetext + '</span>');

													if (this.authenticationlevelminimum == 3)
													{
														aHTML.push('<br /><span class="ns1blankspaceSub">' +
									 										'<span class="glyphicon glyphicon-phone" aria-hidden="true" style="font-size: 1.2em;"></span> 2FA Required</span>');
													}

									 				aHTML.push('</td>');						

									 				aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
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

											aHTML.push('<tr><td style="padding-bottom:10px;" class="ns1blankspaceNothing">You need to enter all the surname for the search to work.</td></tr>');
									
											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Target User' +
															'</td></tr>' +
															'<tr class="ns1blankspaceSelect">' +
															'<td class="ns1blankspaceSelect">' +
															'<input id="ns1blankspaceSetupUserExternalTargetUser" class="ns1blankspaceSelect"' +
																' data-method="SETUP_USER_SEARCH"' +
																' data-columns="username">' +
															'</td></tr>');

											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption" style="padding-top:10px;">' +
															'Type' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceRadio">' +
															'<input type="radio" id="radioType2" name="radioType" value="2"/>Switch In<br />' +
															'<input type="radio" id="radioType3" name="radioType" value="3"/>Support<br />' +
															'</td></tr>');

											aHTML.push('<tr><td class="ns1blankspaceCaption" style="padding-top:10px;">Access <span class="ns1blankspaceNothing" style="font-weight:300;" id="ns1blankspaceExternalCreated"></span></td></tr>' +
															'<tr><td class="ns1blankspaceRadio">' +
															'<input type="radio" id="radioExternalAccessUnrestrictedY" name="radioExternalAccessUnrestricted" value="Y"/>Access&nbsp;to&nbsp;everything<br />' +
															'<input type="radio" id="radioExternalAccessUnrestrictedN" name="radioExternalAccessUnrestricted" value="N"/>Restricted by role' +
															'</td></tr>');

											aHTML.push('<tr><td style="padding-top:10px;" id="ns1blankspaceExternalRoles"></td></tr>');

											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Minimum Authentication Level' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceRadio">' +
															'<input type="radio" id="radioExternalAccessAuthenticationLevel1" name="radioExternalAccessAuthenticationLevel" value="1"/>Standard<br />' +
															'<input type="radio" id="radioExternalAccessAuthenticationLevel2" name="radioExternalAccessAuthenticationLevel" value="2"/>With Logon Key<br />' +
															'<input type="radio" id="radioExternalAccessAuthenticationLevel3" name="radioExternalAccessAuthenticationLevel" value="3"/>With 2nd Factor Token' +
															'</td></tr>');
										
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceSetupUserExternalColumn2').html(aHTML.join(''));
											
											$('#ns1blankspaceSetupUserExternalName').keyup(function()
											{
												if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
										        ns1blankspace.timer.delayCurrent = setTimeout("ns1blankspace.setup.user.external.search('ns1blankspaceSetupUserExternalName')", ns1blankspace.option.typingWait);
											});	
												
											$(document).on('blur', '#ns1blankspaceSetupUserexternalname', function() 
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
												sData += '&type=' + ns1blankspace.util.fs($('input[name="radioType"]:checked').val());
												sData += '&unrestrictedaccess=' + ns1blankspace.util.fs($('input[name="radioExternalAccessUnrestricted"]:checked').val());
												sData += '&targetuser=' + ns1blankspace.util.fs($('#ns1blankspaceSetupUserExternalTargetUser').attr("data-id"));
												sData += '&authenticationlevelminimum=' + ns1blankspace.util.fs($('input[name="radioExternalAccessAuthenticationLevel"]:checked').val());

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
												oParam.user = $('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-user");
												oParam.userType = 2;
												ns1blankspace.setup.user.access.add(oParam);
											})

											if (aXHTMLElementID[1])
											{
												$('#ns1blankspaceSetupUserExternalName').attr("data-id", $('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-user"))
												$('#ns1blankspaceSetupUserExternalName').val($('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-usertext"));
												
												$('[name="radioExternalAccessUnrestricted"][value="' + $('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-unrestrictedaccess") + '"]').attr('checked', true);

												$('#ns1blankspaceSetupUserExternalTargetUser').attr('data-id', $('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-targetuser"));
												$('#ns1blankspaceSetupUserExternalTargetUser').val($('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-targetusertext"));
												
												$('#ns1blankspaceExternalCreated').html(' (granted ' + ns1blankspace.util.formatDate($('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-created"), {format:'DD MMM YYYY HH:mm'}) + ')')

												var iExternalAccessAuthenticationLevel = $('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-authenticationlevelminimum");
												$('[name="radioExternalAccessAuthenticationLevel"][value="' + iExternalAccessAuthenticationLevel + '"]').attr('checked', true);

												var iType = $('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-type");
												$('[name="radioType"][value="' + iType + '"]').attr('checked', true);

												oParam.user = $('#ns1blankspaceUserExternal_title-' + aXHTMLElementID[1]).attr("data-user");
												oParam.step = 3;
												ns1blankspace.setup.user.external.show(oParam);
											}
											else
											{
												$('[name="radioExternalAccessUnrestricted"][value="N"]').attr('checked', true);
												$('[name="radioType"][value="2"]').attr('checked', true);
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
										
										if (sSearchText.length > 2)
										{
											ns1blankspace.status.working();

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
										if (oResponse.data.rows.length == 0)
										{
											ns1blankspace.status.message('No users found');
										}
										else	
										{
											ns1blankspace.status.message('');

											aHTML.push('<table class="ns1blankspaceSearchMedium" style="width: 350px;">');

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
											$(ns1blankspace.xhtml.container).offset({ top: $('#' + sXHTMLInputElementID).offset().top + $('#' + sXHTMLInputElementID).height() + 8, left: $('#' + sXHTMLInputElementID).offset().left});

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
				},

	util: 	{
					getUsername: 	function (oParam)
									{
										var sUsername = ns1blankspace.util.getParam(oParam, 'username').value;

										if (ns1blankspace.option.logonSuffix != undefined)
										{	
											sUsername = sUsername.replace(ns1blankspace.option.logonSuffix, '');
										}

										return sUsername
									},

					setUsername: 	function (oParam)
									{
										var sUsername = ns1blankspace.util.getParam(oParam, 'username').value;

										if (ns1blankspace.option.logonSuffix != undefined)
										{	
											sUsername = sUsername + ns1blankspace.option.logonSuffix;
										}

										return sUsername
									},

					getPassword: 	function (oParam)
									{
										var sPassword = ns1blankspace.util.getParam(oParam, 'password').value;

										if (ns1blankspace.option.passwordSuffix != undefined)
										{	
											sPassword = sPassword.replace(ns1blankspace.option.passwordSuffix, '');
										}

										return sPassword
									},

					setPassword: 	function (oParam)
									{
										var sPassword = ns1blankspace.util.getParam(oParam, 'password').value;

										if (ns1blankspace.option.passwordSuffix != undefined)
										{	
											sPassword = sPassword + ns1blankspace.option.passwordSuffix;
										}

										return sPassword
									},				

					generatePassword:
									function (oParam)
									{
							            var length = ns1blankspace.util.getParam(oParam, 'length', {"default": 8}).value;
							            var string = "abcdefghijklmnopqrstuvwxyz";
							            var numeric = '0123456789';
							            var punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
							            var password = "";
							            var character = "";
							            var crunch = true;

							            while( password.length<length ) {
							                entity1 = Math.ceil(string.length * Math.random()*Math.random());
							                entity2 = Math.ceil(numeric.length * Math.random()*Math.random());
							                entity3 = Math.ceil(punctuation.length * Math.random()*Math.random());
							                hold = string.charAt( entity1 );
							                hold = (entity1%2==0)?(hold.toUpperCase()):(hold);
							                character += hold;
							                character += numeric.charAt( entity2 );
							                character += punctuation.charAt( entity3 );
							                password = character;
							            }

							          	return password;
        							},

        			setRelationshipManagerRestriction:
        							function (oParam)
        							{
        								
        							},

        			generateTOTPKey:
        							function (oParam)
        							{
        								var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceUserDetailsGenerateTOTPContainer'}).value;

        								ns1blankspace.status.working();

        								$('.ns1blankspaceUserGenerateTOTP').hide();

										var sIssuer = (ns1blankspace.option.siteName!=undefined?ns1blankspace.option.siteName:'1blankspace')

										var oData =
										{
											user: ns1blankspace.objectContext,
											issuer: sIssuer
										}

										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('SETUP_LOGON_GENERATE_TOKEN'),
											data: oData,
											dataType: 'json',
											async: false,
											success: function(data)
											{
												ns1blankspace.status.clear();

												if (data.status == 'OK')
												{
													var aHTML = [];

													aHTML.push('<div data-key="' + data.manualentrycode + '" class="ns1blankspaceSummaryCaption" style="margin-bottom:6px;">TOTP Key</div>' +
														'<div style="font-size:0.625em; width:200px; word-wrap:break-word;">' + data.manualentrycode + '</div>' +
														'<div data-qrurl="' + data.qrurl + '"><img style="width:200px;" src="' + data.qrurl + '"></div>');
													aHTML.push('<div class="ns1blankspaceSubNote">' +
														'<p>The user now needs to open their TOTP client (ie Google Authenticator, Auth) and either enter the key manually or scan the QR code.</p>' +
														'</div>')

													if (ns1blankspace.objectContextData['user.contactperson.mobile'] != '')
													{
														aHTML.push('<span class="ns1blankspaceAction" id="ns1blankspaceUserTOTPSendSMS"></span>');
														aHTML.push('<div class="ns1blankspaceSubNote" style="width:140px; text-align: center;">(' + ns1blankspace.objectContextData['user.contactperson.mobile'] + ')</div>')
													}

													if (ns1blankspace.objectContextData['user.contactperson.email'] != '')
													{
														aHTML.push('<div style="margin-top:10px;"><span class="ns1blankspaceAction" id="ns1blankspaceUserTOTPSendEmail"></span>');
														aHTML.push('<div class="ns1blankspaceSubNote" style="width:140px; text-align: center;">(' + ns1blankspace.objectContextData['user.contactperson.email'] + ')</div></div>')
													}

													$('#' + sXHTMLElementID).html(aHTML.join(''));

													$('#ns1blankspaceUserTOTPSendSMS').button(
													{
														label: "Send as SMS"
													})
													.click(function()
													{	
														ns1blankspace.status.working('Sending SMS...');

														var sMessage = 'Hello ' + ns1blankspace.objectContextData['user.contactperson.firstname'] + ', ' +
																			'please open your TOTP Client (ie Google Authenticator, authy), select add new account and enter the following key manually (copy & paste): ' +
																				data.manualentrycode

														var oData =
														{
															contactperson: ns1blankspace.objectContextData.contactperson,
															message: sMessage
														}

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('MESSAGING_SMS_SEND'),
															data: oData,
															dataType: 'json',
															success: function(data) 
															{
																ns1blankspace.status.message('SMS Sent');
															}
														});
													})
													.css('width', '140px');

													$('#ns1blankspaceUserTOTPSendEmail').button(
													{
														label: "Send as Email"
													})
													.click(function()
													{	
														ns1blankspace.status.working('Sending Email...');

														var sMessage = '<p>Hello ' + ns1blankspace.objectContextData['user.contactperson.firstname'] + ',</p>' +
																			'<p>Please open your TOTP Client (ie Google Authenticator, authy), select add new account and enter the following key manually (copy & paste):</p>' +
																			'<p>'	+ data.manualentrycode + '</p>' +
																			'<p><b>OR</b> scan the following QR code:</p>' +
																			'<p><img style="width:200px;" src="' + data.qrurl + '">' +
																			'<p>Thank you,</p>' +
																			'<p>' + ns1blankspace.user.commonName + '</p>'

														var oData = 
														{
															subject: 'TOTP client set up',
															message: sMessage,
															to: ns1blankspace.objectContextData.contactperson,
															send: 'Y',
															applysystemtemplate: 'Y',
															fromemail: ns1blankspace.user.email
														}

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND'),
															data: oData,
															dataType: 'json',
															success: function(data) 
															{
																ns1blankspace.status.message('Email Sent');
															}
														});
													})
													.css('width', '140px')
												}
												else
												{
													ns1blankspace.status.error(data.error.errornotes)
												}
											}
										});
        							}
        																			
				}			
}									


ns1blankspace.setup.user.export =
{	
	data: {},

	init: function (oParam, oResponse)
	{
		if (oResponse == undefined)
		{
			ns1blankspace.status.message('Exporting...');

			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_USER_ROLE_SEARCH';
			oSearch.addField('notes,role,roletext,user,usertext');
			oSearch.rows = 99999;
			oSearch.getResults(function(data) {ns1blankspace.setup.user.export.init(oParam, data)});
		}
		else
		{	
			ns1blankspace.setup.user.export.data.userRoles = oResponse.data.rows;
			ns1blankspace.setup.user.export.users(oParam);
		}
	},

	users: function (oParam, oResponse)
	{	
		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_USER_SEARCH';

			oSearch.addField('authenticationdeliverytext,authenticationleveltext,authenticationusingaccesstokentext,' +
									'contactbusinesstext,disabled,disableddate,disabledreason,' +
									'lastlogon,passwordexpiry,typetext,unrestrictedaccess,username,' +
									'user.contactperson.email,user.contactperson.firstname,user.contactperson.surname,' +
									'user.contactperson.mobile');
			oSearch.rows = 99999;
			oSearch.getResults(function(data) {ns1blankspace.setup.user.export.users(oParam, data)});
		}
		else
		{
			ns1blankspace.setup.user.export.data.users = oResponse.data.rows;

			_.each(ns1blankspace.setup.user.export.data.users, function (oUser)
			{
				oUser._roles = _.filter(ns1blankspace.setup.user.export.data.userRoles, function (oUserRole)
				{
					return oUser.id == oUserRole.user
				});

				oUser.roles = _.join(_.map(oUser._roles, 'roletext'), '; ')
				oUser.access = (oUser.unrestrictedaccess=='Y'?'Unrestricted':'Restricted by role')
				oUser.status = (oUser.disabled=='Y'?'Disabled':'Enabled')

				oUser.disableddatetext = (oUser.disabled=='Y'?oUser.disableddate:'');
				oUser.disabledreasontext = (oUser.disabled=='Y'?oUser.disabledreason:'')
			})

			ns1blankspace.setup.user.export.saveToFile(oParam);
		}
	},

	saveToFile: function (oParam, oResponse)
	{
		var oFormat =
		[{
			options:
			{
				delimiter: ',',
				surroundWith: '"'
			},

			header:
			[
				{
					line: 1,
					fields:
					[
						{value: 'Username'},
						{value: 'Status'},
						{value: 'Disabled Date'},
						{value: 'Disabled Reason'},
						{value: 'Access'},
						{value: 'Roles'},
						{value: 'Password Expiry'},
						{value: 'Authentication Type'},
						{value: 'Authentication Token Delivery'},
						{value: 'Authentication Access Token Use'},
						{value: 'First Name'},
						{value: 'Last Name'},
						{value: 'Email'},
						{value: 'Mobile'},
						{value: 'Contact Business'},
						{value: 'Last Logon'}
					]
				}	
			],

			item:
			[
				{
					fields:
					[
						{field: 'username'},
						{field: 'status'},
						{field: 'disableddatetext'},
						{field: 'disabledreasontext'},
						{field: 'access'},
						{field: 'roles'},
						{field: 'passwordexpiry'},
						{field: 'authenticationleveltext'},
						{field: 'authenticationdeliverytext'},
						{field: 'authenticationusingaccesstokentext'},
						{field: 'user.contactperson.firstname'},
						{field: 'user.contactperson.surname'},
						{field: 'user.contactperson.email'},
						{field: 'user.contactperson.mobile'},
						{field: 'contactbusinesstext'},
						{field: 'lastlogon'}
					]
				}		
			]
		}]

		ns1blankspace.status.clear()

		var sFileName = 'user-access-' + _.kebabCase(ns1blankspace.spaceText) + '.csv'

		ns1blankspace.setup.file.export.process(
	   {
	   	items: ns1blankspace.setup.user.export.data.users,
			format: oFormat,
			saveToFile: true,
			open: true,
			fileName: sFileName
		});
	}
}