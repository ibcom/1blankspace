/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.setup.space = 
{
	notes: 	{
					passwordStrengthScoring:
					[
						'Length = 6, 1 point.',
						'Length >= 8, plus 1 point.',
						'Length >= 12, plus 1 point.',
						'Special character, plus 1 point.',
						'Lower case, plus 1 point.',
						'Upper case, plus 1 point.',
						'A number, plus 1 point.'
					],

					passwordStrength:
					{
						1: 'Very weak',
						2: 'Weak',
						3: 'Weak',
						4: 'Medium',
						5: 'Strong',
						6: 'Strong',
						7: 'Very strong'
					}
					
				},

	init: 	function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 24;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'space';
					ns1blankspace.viewName = 'My Space / Account';
			
					ns1blankspace.app.set(oParam);

					$('#ns1blankspaceViewControlNew').button({disabled: true});
					$('#ns1blankspaceViewControlAction').button({disabled: false});
				},

	home:		function (oParam, oResponse)
				{
					if (oResponse === undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_SPACE_SETTINGS_SEARCH';
						oSearch.addField('lostpassword,lostpasswordtext,minimumpasswordlength,minimumpasswordstrength,notes,' +
											'passwordexpiredays,passwordlockifwrongcount,passwordlockduration,passwordunlockduration,' +
											(ns1blankspace.session.preGenerallyAvailableInstance?'spaceadministratoremail,spaceadministratormobile,spaceadministratorname,spaceadministratornotes,spaceadministratorphone':''));


						oSearch.getResults(function (data)
						{
							ns1blankspace.setup.space.home(oParam, data);
						});
					}
					else
					{
						if (oResponse.data.rows.length > 0)
						{	
							ns1blankspace.objectContextData = oResponse.data.rows[0];
							ns1blankspace.objectContext = ns1blankspace.objectContextData.id;
						}	

						var aHTML = [];
										
						aHTML.push('<table class="ns1blankspace">' +
										'<tr><td id="ns1blankspaceMostLikely" class="ns1blankspace">' +
										ns1blankspace.xhtml.loading +
										'</td></tr>' +
										'</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						var aHTML = [];

						aHTML.push('<table>' +
										'<tr><td><div id="ns1blankspaceViewSetupSpaceLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>' +
										'</table>');

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlSummary" class="ns1blankspaceControl">Summary</td>' +
										'</tr>');

						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">Details' +
										'<br /><span class="ns1blankspaceSub" style="font-size:0.75em;">password settings</span></td>' +
										'</tr>');

						aHTML.push('</table>');	

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlSubscriptions" class="ns1blankspaceControl">Subscriptions</td>' +
										'</tr>');

						aHTML.push('</table>');	

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlInitialise" class="ns1blankspaceControl">Initialise<br />This Space</td>' +
										'</tr>');						
							
						aHTML.push('</table>');	

						aHTML.push('<table class="ns1blankspaceControl">');
							
						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlStorage" class="ns1blankspaceControl">Storage<br />Accounts' +
										'<br /><span class="ns1blankspaceSub" style="font-size:0.75em;">AWS S3</span></td>' +
										'</tr>');

						aHTML.push('</table>');	

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlAdvanced" class="ns1blankspaceControl">Advanced</td>' +
										'</tr>');							
											
						if (ns1blankspace.option.advancedAccess)
						{	
							aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlAccess" class="ns1blankspaceControl">Access</td>' +
										'</tr>');
						}
			
						aHTML.push('</table>');	
						
						$('#ns1blankspaceControl').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<div id="ns1blankspaceMainSubscription" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainInitialise" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainStorage" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainAccess" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainAdvanced" class="ns1blankspaceControlMain"></div>');
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						$('#ns1blankspaceControlSummary').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainSummary', refresh: true});
							ns1blankspace.setup.space.summary();
						});

						$('#ns1blankspaceControlDetails').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
							ns1blankspace.setup.space.details();
						});

						$('#ns1blankspaceControlSubscriptions').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainSubscription', refresh: true});
							ns1blankspace.setup.space.subscriptions();
						});

						$('#ns1blankspaceControlInitialise').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainInitialise', refresh: true});
							ns1blankspace.setup.space.initialise.init();
						});

						$('#ns1blankspaceControlStorage').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainStorage'});
							ns1blankspace.setup.space.storage.show();
						});

						$('#ns1blankspaceControlAccess').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainAccess', refresh: true});
							ns1blankspace.setup.space.access();
						});

						$('#ns1blankspaceControlAdvanced').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainAdvanced'});
							ns1blankspace.setup.space.advanced.show();
						});
						
						$('#ns1blankspaceControlSummary').addClass('ns1blankspaceHighlight');

						ns1blankspace.show({selector: '#ns1blankspaceMainSummary', refresh: true});
						ns1blankspace.setup.space.summary();
					}	
				},

	summary: 	function (oParam, oResponse)
				{
					if (oResponse === undefined)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:250px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));	

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Enabled Users</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryUsers" class="ns1blankspaceSummary">' +
										ns1blankspace.xhtml.loadingSmall +
										'</td></tr>');

						if (ns1blankspace.objectContextData !== undefined)
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Minimum Password Length</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryMinimumPasswordLength" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.minimumpasswordlength +
										'</td></tr>');

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Minimum Password Strength</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryMinimumPasswordStrength" class="ns1blankspaceSummary">' +
										ns1blankspace.setup.space.notes.passwordStrength[ns1blankspace.objectContextData.minimumpasswordstrength] +
										'</td></tr>');

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Forgotten Password</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryForgottenPassword" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.lostpasswordtext +
										'</td></tr>');


							ns1blankspace.setup.space
						}	
						
						aHTML.push('</table>');

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						aHTML.push('<tr><td style="font-size:0.875em;">' +
										'<a href="http://mydigitalstructure.com/gettingstarted_authentication" target="_blank">' +
										'Getting started with authentication</a></td></tr>');
						
						aHTML.push('</table>');								
						
						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));

						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_USER_SEARCH';
						oSearch.addField('username');
						oSearch.rows = 1;
						oSearch.addFilter('disabled', 'NOT_EQUAL_TO', 'Y');
						oSearch.addSummaryField('count(*) count')
						oSearch.getResults(function (data) {ns1blankspace.setup.space.summary(oParam, data)});
					}	
					else
					{
						$('#ns1blankspaceSummaryUsers').html(oResponse.summary.count);
					}	
				},

	details: 	function (oParam)
				{
					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceMain">' +
											'<tr class="ns1blankspace">' +
											'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1Large" style="width:250px;"></td>' +
											'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2Large" style="width:250px;"></td>' +
											'<td id="ns1blankspaceDetailsColumn3" class="ns1blankspaceColumnAction" style="width:150px;"></td>' +
											'</tr>' +
											'</table>');

					$('#ns1blankspaceMainDetails').html(aHTML.join(''));							

					aHTML = [];
					
					aHTML.push('<table class="ns1blankspace" style="width:275px;">');
					
					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Minimum Password Length' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceDetailsMinimumPasswordLength" class="ns1blankspaceText" style="width:200px;">' +
									'</td></tr>');			
				
					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Forgotten Password' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceRadio">' +
									'<input type="radio" id="radioLostPassword1" name="radioLostPassword" value="1"/>Send<br />' +
									'<input type="radio" id="radioLostPassword2" name="radioLostPassword" value="2"/>Reset & Send' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Password Expiry (days)' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceDetailsPasswordExpireDays" class="ns1blankspaceText" style="width:200px;">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Minimum Password Strength' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceRadio" style="padding-bottom:12px;">' +
									'<input type="radio" id="radioMinimumStrength1" name="radioMinimumStrength" value="1"/>Very Weak <span class="ns1blankspaceSubNote">(1)</span><br />' +
									'<input type="radio" id="radioMinimumStrength3" name="radioMinimumStrength" value="3"/>Weak <span class="ns1blankspaceSubNote">(3)</span><br />' +
									'<input type="radio" id="radioMinimumStrength4" name="radioMinimumStrength" value="4"/>Medium <span class="ns1blankspaceSubNote">(4)</span><br />' +
									'<input type="radio" id="radioMinimumStrength6" name="radioMinimumStrength" value="6"/>Strong <span class="ns1blankspaceSubNote">(6)</span><br />' +
									'<input type="radio" id="radioMinimumStrength7" name="radioMinimumStrength" value="7"/>Very Strong <span class="ns1blankspaceSubNote">(7)</span>' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<tr class="ns1blankspace"><td style="padding:10px;" class="ns1blankspaceSubNote ns1blankspaceRowShaded">' +
									'<b>The password strength points (in brackets) are calculated as follows...</b><br/>' +
									ns1blankspace.setup.space.notes.passwordStrengthScoring.join('<br/>') +
									'</td></tr>');

					aHTML.push('</table>');

					$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));

					aHTML = [];

					aHTML.push('<table class="ns1blankspaceColumn2" style="width:275px;">');

					aHTML.push('<tr>' +
									'<td class="ns1blankspaceCaption">' +
									'<div>Disable User Access</div><div class="ns1blankspaceSubNote" style="padding-top:4px;">If password entered incorrectly this many times</div>' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceDetailsPasswordLockIfWrongCount" class="ns1blankspaceText" style="width:200px;">' +
									'</td></tr>');

					aHTML.push('<tr>' +
									'<td >' +
									'<div class="ns1blankspaceSubNote">within this many minutes</div>' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceDetailsPasswordLockDuration" class="ns1blankspaceText" style="width:200px;">' +
									'</td></tr>');

					aHTML.push('<tr>' +
									'<td class="ns1blankspaceCaption" style="padding-top:16px;">' +
									'<div>Re-enable User Access</div><div class="ns1blankspaceSubNote" style="padding-top:4px;">After this many minutes</div>' +
									'<div class="ns1blankspaceSubNote"></div>' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceDetailsPasswordUnlockDuration" class="ns1blankspaceText" style="width:200px;">' +
									'</td></tr>' +
									'<tr>' +
									'<td class="ns1blankspaceSubNote">' +
									'<i>If set to 0 it never unlocks.</i>' +
									'</td></tr>');

					aHTML.push('</table>');																

					$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

					aHTML = [];

					aHTML.push('<table class="ns1blankspaceColumn" style="width:150px;">');

					aHTML.push('<tr>' +
									'<td class="ns1blankspaceSubNote ns1blankspaceRowShaded" style="padding:8px;">' +
									'<div><b>If no values entered...</b></div>' +
									'<div style="padding-top:12px;">User access is disabled if the password is entered incorrectly 5 times within a 10 minute duration.</div>' +
									'<div style="padding-top:12px;">User access is automatically re-enabled after 30 minutes.</div>' +
									'</td></tr>');

					aHTML.push('</table>');																

					$('#ns1blankspaceDetailsColumn3').html(aHTML.join(''));

					if (ns1blankspace.objectContextData !== undefined)
					{
						$('#ns1blankspaceDetailsMinimumPasswordLength').val(ns1blankspace.objectContextData.minimumpasswordlength);
						$('[name="radioMinimumStrength"][value="' + ns1blankspace.objectContextData.minimumpasswordstrength + '"]').attr('checked', true);
						$('[name="radioLostPassword"][value="' + ns1blankspace.objectContextData.lostpassword + '"]').attr('checked', true);
						$('#ns1blankspaceDetailsPasswordExpireDays').val(ns1blankspace.objectContextData.passwordexpiredays);
						$('#ns1blankspaceDetailsPasswordLockIfWrongCount').val(ns1blankspace.objectContextData.passwordlockifwrongcount);
						$('#ns1blankspaceDetailsPasswordLockDuration').val(ns1blankspace.objectContextData.passwordlockduration);
						$('#ns1blankspaceDetailsPasswordUnlockDuration').val(ns1blankspace.objectContextData.passwordunlockduration);
					}
					else
					{
						$('#ns1blankspaceDetailsMinimumPasswordLength').val('6');
						$('[name="radioMinimumStrength"][value="1"]').attr('checked', true);
						$('[name="radioLostPassword"][value="1"]').attr('checked', true);
					}
				},

	save: 	{
					send: 	function ()
								{
									ns1blankspace.status.working();
									
									var oData = {}

									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										oData.minimumpasswordlength = $('#ns1blankspaceDetailsMinimumPasswordLength').val();
										oData.minimumpasswordstrength = $('input[name="radioMinimumStrength"]:checked').val();
										oData.lostpassword = $('input[name="radioLostPassword"]:checked').val();							
										
										if ($('#ns1blankspaceDetailsPasswordExpireDays').val() != '')
											{oData.passwordexpiredays = $('#ns1blankspaceDetailsPasswordExpireDays').val()}

										if ($('#ns1blankspaceDetailsPasswordLockIfWrongCount').val() != '')
											{oData.passwordlockifwrongcount = $('#ns1blankspaceDetailsPasswordLockIfWrongCount').val()}

										if ($('#ns1blankspaceDetailsPasswordLockDuration').val() != '')
											{oData.passwordlockduration = $('#ns1blankspaceDetailsPasswordLockDuration').val()}

										if ($('#ns1blankspaceDetailsPasswordUnlockDuration').val() != '')
											{oData.passwordunlockduration = $('#ns1blankspaceDetailsPasswordUnlockDuration').val()}
									}

									if ($('#ns1blankspaceMainAdvanced').html() != '')
									{
										oData.spaceadministratorname = $('#ns1blankspaceAdvancedSpaceAdministratorName').val();
										oData.spaceadministratoremail = $('#ns1blankspaceAdvancedSpaceAdministratorEmail').val()
										oData.spaceadministratormobile = $('#ns1blankspaceAdvancedSpaceAdministratorMobile').val()
										oData.spaceadministratorphone = $('#ns1blankspaceAdvancedSpaceAdministratorPhone').val()
										oData.spaceadministratornotes = $('#ns1blankspaceAdvancedSpaceAdministratorNotes').val()
									}

									if (ns1blankspace.objectContext !== undefined && ns1blankspace.objectContext !== -1) {oData.id = ns1blankspace.objectContext}

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('SETUP_SPACE_SETTINGS_MANAGE'),
										data: oData,
										dataType: 'json',
										success: function (data)
										{
											ns1blankspace.status.message('Settings saved');
											ns1blankspace.inputDetected = false;

											if ($('#ns1blankspaceMainAdvanced').html() != '')
											{
												var oData = 
												{
													attribute: 473,
													value: $('input[name="radioDataBasedSecurity"]:checked').val()
												}

												$.ajax(
												{
													type: 'POST',
													url: '/rpc/core/?method=CORE_PROFILE_MANAGE',
													data: oData,
													dataType: 'json',
													success: function (data)
													{
														ns1blankspace.setup.space.init();
													}
												});	
											}
											else
											{
												ns1blankspace.setup.space.init();
											}	
										}
									});
								}	
				},				
							
	subscriptions:			
				function (oParam, oResponse)
				{
					var iStep = 1;
					var sID; 
					var sXHTMLElementID;
						
					if (oParam != undefined)
					{
						if (oParam.step != undefined) {iStep = oParam.step}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}
					else
					{
						oParam = {step: 1};
					}
					
					if (sXHTMLElementID != undefined)
					{
						var aXHTMLElementID = sXHTMLElementID.split('-');
						var sID = aXHTMLElementID[1];
					}	

					if (iStep == 1)
					{
						if (oResponse == undefined)
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'ADMIN_MEMBERSHIP_SUBSCRIPTION_SEARCH';
							oSearch.addField('membershiptext,startdate,enddate,statustext,subscription.registration.registrationspacetext');
							oSearch.addCustomOption('spacesyouregistered', 'N');
							oSearch.rows = 9999;
							oSearch.getResults(function(data){ns1blankspace.setup.space.subscriptions(oParam, data)});
						}
						else
						{
							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspaceMain">' +
											'<tr class="ns1blankspace">' +
											'<td id="ns1blankspaceSubscriptionColumn1" class="ns1blankspaceColumn1Large">' +
											ns1blankspace.xhtml.loading + '</td>' +
											'<td id="ns1blankspaceSubscriptionColumn2" class="ns1blankspaceColumn2Action" style="width:0px;"></td>' +
											'</tr>' +
											'</table>');	
						
							$('#ns1blankspaceMainSubscription').html(aHTML.join(''));
						
							var aHTML = [];
							
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<table><tr><td valign="top" class="ns1blankspaceSub">You have no subscriptions.</td></tr></table>');

								$('#ns1blankspaceSubscriptionColumn1').html(aHTML.join(''));
							}
							else
							{			
								var aHTML = [];
								
								aHTML.push('<table id="ns1blankspaceSetupSpaceSubscriptions" class="ns1blankspace">');

								aHTML.push('<tr class="ns1blankspaceCaption">');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Membership</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Start Date</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">End Date</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Status</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Managed By</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp</td>');
								aHTML.push('</tr>');
						
								$(oResponse.data.rows).each(function() 
								{
									aHTML.push('<tr class="ns1blankspaceRow">');
									
									aHTML.push('<td id="ns1blankspaceSetupSpaceSubscription_membership-' + this.id + '" class="ns1blankspaceRow">' +
															this.membershiptext + '</td>');

									aHTML.push('<td id="ns1blankspaceSetupSpaceSubscription_startdate-' + this.id + '" class="ns1blankspaceRow">' +
															this.startdate + '</td>');

									aHTML.push('<td id="ns1blankspaceSetupSpaceSubscription_enddate-' + this.id + '" class="ns1blankspaceRow">' +
															this.enddate + '</td>');

									aHTML.push('<td id="ns1blankspaceSetupSpaceSubscription_status-' + this.id + '" class="ns1blankspaceRow">' +
															this.statustext + '</td>');

									aHTML.push('<td id="ns1blankspaceSetupSpaceSubscription_managedby-' + this.id + '" class="ns1blankspaceRow">' +
															this['subscription.registration.registrationspacetext'] + '</td>');
														
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspaceSetupSpaceSubscription_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span></td>');				
																					
									aHTML.push('</tr>');
								});
								
								aHTML.push('</table>');
							}
							
							$('#ns1blankspaceSubscriptionColumn1').html(aHTML.join(''));

							$('ns1blankspaceSetupSpaceSubscriptions span.ns1blankspaceRowOptionsRemoveX').button(
							{
								text: false,
								icons: {
									primary: "ui-icon-close"
								}
							})
							.click(function() {
								$.extend(true, oParam, {step: 4, xhtmlElementID: this.id});
								ns1blankspace.setup.space.subscriptions(oParam);
							})
							.css('width', '15px')
							.css('height', '17px');

							$('ns1blankspaceSetupSpaceSubscriptions td.ns1blankspaceRowSelect').click(function() {
								$.extend(true, oParam, {step: 2, xhtmlElementID: event.target.id});
								ns1blankspace.setup.space.subscriptions(oParam);
							})
						}	
					}

					if (iStep == 2)
					{	
						//EDIT SUBSCRIPTION
					}
					
					if (iStep == 4)
					{			
						//REMOVE SUBSCRIPTION
					}		
				},

	initialise: {
					data: 	{},

					init: 	function (oParam)
								{
									if (ns1blankspace.setup.space.initialise.data.template == undefined && ns1blankspace.option.initialiseSpaceTemplate)
									{
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.option.initialiseSpaceTemplate,
											dataType: 'json',
											global: false,
											success: function(data)
											{
												ns1blankspace.setup.space.initialise.data.template = data.template;
												ns1blankspace.setup.space.initialise.show(oParam);
											},
											error: function ()
											{
												$('#ns1blankspaceInitialiseColumn1').html('<table><tr><td class="ns1blankspaceNothing">' +
													'Can\'t find initialise information.' +
													'<br />You need to contact the developer of this app.' +
													'</td></tr></table>');
											}
										});
									}
									else
									{
										ns1blankspace.setup.space.initialise.show(oParam);
									}	
								},

					show: 	function (oParam)
								{
									var aHTML = [];
									var oTemplate = ns1blankspace.setup.space.initialise.data.template;
									var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": -1}).value;
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceMainInitialise'}).value;

									if (oTemplate.memberships.length == 0 && oTemplate.roles.length == 0)
									{
										aHTML.push('<table><tr><td class="ns1blankspaceNothing">' +
													'Nothing to initialise.' +
													'</td></tr></table>');
									}
									else
									{
										aHTML.push('<table><tr>' +
														'<td id="ns1blankspaceInitialiseColumn1" style="width:120px;"></td>' +
														'<td id="ns1blankspaceInitialiseColumn2"></td>' +
														'</tr></table>');				
										
										$('#' + sXHTMLElementID).html(aHTML.join(''));

										var aHTML = [];

										aHTML.push('<div id="ns1blankspaceInitaliseOption" style="width:110px; margin-bottom:10px;">');

										if (oTemplate.memberships.length != 0 && (iType == 1 || iType == -1))
										{	
											aHTML.push('<input type="radio" id="ns1blankspaceInitaliseOption-memberships" name="radioObject" />' +
														'<label for="ns1blankspaceInitaliseOption-memberships" style="width: 110px; margin-bottom:3px;">' +
														'Memberships</label>');
										}		
										
										if (oTemplate.roles.length != 0 && (iType == 2 || iType == -1))
										{
											aHTML.push('<input type="radio" id="ns1blankspaceInitaliseOption-roles" name="radioObject" />' +
														'<label for="ns1blankspaceInitaliseOption-roles" style="width: 110px; margin-bottom:3px;">' +
														'User Roles</label>');
										}	

										if (oTemplate["import"].length != 0 && (iType == 3 || iType == -1))
										{
											aHTML.push('<input type="radio" id="ns1blankspaceInitaliseOption-import" name="radioObject" />' +
														'<label for="ns1blankspaceInitaliseOption-import" style="width: 110px; margin-bottom:3px;">' +
														'Data</label>');
										}	

										aHTML.push('</div>');

										$('#ns1blankspaceInitialiseColumn1').html(aHTML.join(''));
									
										$('#ns1blankspaceInitaliseOption').buttonset().css('font-size', '0.625em');
										
										$('#ns1blankspaceInitaliseOption :radio').click(function()
										{
											var aID = (event.target.id).split('-');
											ns1blankspace.setup.space.initialise[aID[1]].show(oParam);
										});
									}
								},			

					memberships:
								{
									show:		function (oParam, oResponse)
												{
													if (oResponse == undefined)
													{
														$('#ns1blankspaceInitialiseColumn2').html(ns1blankspace.xhtml.loading);

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SUBSCRIPTION_SEARCH'),
															data: '',
															dataType: 'json',
															success: function(data){ns1blankspace.setup.space.initialise.memberships.show(oParam, data)}
														});
													}
													else
													{	
														var aMembershipsRequired = ns1blankspace.setup.space.initialise.data.template.memberships;
														var aMembershipsExisting = oResponse.data.rows;
														var aHTML = [];

														aHTML.push('<table id="ns1blankspaceSetupSpaceInitialiseMemberships" class="ns1blankspaceColumn2">');
												
														$(aMembershipsRequired).each(function(i, v) 
														{
															aHTML.push('<tr class="ns1blankspaceRow">');
															
															var aMembership = $.grep(aMembershipsExisting, function (a) { return a.title == v.title});

															aHTML.push('<td id="ns1blankspaceSetupSpaceInitialiseMemberships_title-' + i + '" class="ns1blankspaceRow"' +
																			'data-membership="' + this.title + '">' +
																					this.title + '</td>');

															if (aMembership.length == 0)
															{
																aHTML.push('<td style="width:350px;font-size:0.75em;" class="ns1blankspaceRow ns1blankspaceSub">' +
																			'You don\'t have this membership.<br />You need to contact the supplier of this app.</td>');	
															}
															else
															{
																aHTML.push('<td style="width:350px;font-size:0.75em;" class="ns1blankspaceRow ns1blankspaceSub">' +
																			'Exists</td>');
															}		
														
															aHTML.push('</tr>');
														});
														
														aHTML.push('</table>');
													
														$('#ns1blankspaceInitialiseColumn2').html(aHTML.join(''));
													}
												}		
								},

					roles: 	{
									show:		function (oParam, oResponse)
												{
													$('#ns1blankspaceInitialiseColumn2').html(ns1blankspace.xhtml.loading);

													if (oResponse == undefined)
													{
														var oSearch = new AdvancedSearch();
														oSearch.method = 'SETUP_ROLE_SEARCH';
														oSearch.addField('title');
														oSearch.rows = 100;
														oSearch.getResults(function(data){ns1blankspace.setup.space.initialise.roles.show(oParam, data)});
													}
													else
													{	
														var aRolesRequired = ns1blankspace.setup.space.initialise.data.template.roles;
														var aRolesExisting = oResponse.data.rows;
														var aHTML = [];

														aHTML.push('<table id="ns1blankspaceSetupSpaceInitialiseRoles" class="ns1blankspaceColumn2">');
												
														aHTML.push('<tr><td style="padding-bottom:12px;" class="ns1blankspaceSubNote">Import a user role template...</td></tr>');

														$(aRolesRequired).each(function(i, v) 
														{
															aHTML.push('<tr class="ns1blankspaceRow">');
															
															var aRole = $.grep(aRolesExisting, function (a) { return a.title == v.title});

															aHTML.push('<td id="ns1blankspaceSetupSpaceInitialiseRoles_title-' + i + '" class="ns1blankspaceRow">' +
																					this.title + '</td>');

															if (aRole.length == 0)
															{
																aHTML.push('<td style="width:350px;" class="ns1blankspaceRow">' +
																			'<span id="ns1blankspaceSetupSpaceInitialiseRoles_options_add-' + i + '" class="ns1blankspaceRowAdd" data-title="' + this.title + '"></span></td>');	
															}
															else
															{
																aHTML.push('<td style="width:350px;font-size:0.75em;" class="ns1blankspaceRow ns1blankspaceSub">' +
																			'This role already exists.</td>');
															}							
																											
															aHTML.push('</tr>');
														});
														
														aHTML.push('<tr><td style="padding-top:18px;" class="ns1blankspaceSubNote">Add a new user role template stored in a file...</td></tr>');

														aHTML.push('<tr><td>');

														aHTML.push(ns1blankspace.attachments.upload.show(
														{	
															object: 29,
															objectContext: -1,
															label: '',
															showUpload: false
														}));

														aHTML.push('</td></tr>');

														aHTML.push('</table>');
									
														$('#ns1blankspaceInitialiseColumn2').html(aHTML.join(''));

														$('#ns1blankspaceSetupSpaceInitialiseRoles .ns1blankspaceRowAdd').button(
														{
															label: 'Import Role'
														})
														.click(function()
														{
															ns1blankspace.setup.space.initialise.roles.add({xhtmlElementID: this.id})
														})
														.css('font-size', '0.725em')
														.css('height', '28px');

														$('#ns1blankspaceUpload').button(
														{
															label: "Add"
														})
														.click(function()
														{
															if ($('#oFile0').val() == '')
															{
																ns1blankspace.status.error("Need to select a file.");
															}
															else
															{
																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('CORE_IMPORT_MANAGE'),
																	success: function(data)
																	{
																		if (data.status == 'OK')
																		{	
																			$('#objectcontext').val(data.id);	
																			ns1blankspace.attachments.upload.submit({submit: true, functionPostUpdate: ns1blankspace.setup.space.initialise.roles.import});
																		}
																	}
																});
															}
														});
													}
												},

									import: 	function(oParam)
												{
													if (oParam.attachments.length > 0)
													{
														var iID = oParam.attachments[0].attachmentlink;

														var oData =
														{
															id: iID
														}
													}

													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('CORE_FILE_READ'),
														data: oData,
														dataType: 'json',
														success: function(data)
														{
															var oRoleTemplate = JSON.parse(data.filedata);
															ns1blankspace.setup.space.initialise.data.template.roles =
															ns1blankspace.setup.space.initialise.data.template.roles.concat(oRoleTemplate.template.roles)
															ns1blankspace.setup.space.initialise.roles.show()
														}
													});
												},

									add: 		function(oParam, oResponse)
												{
													var iStep = 1;
													var sXHTMLElementID;
													var iRole;
													var sRoleTitle;
													var aRoleMethods;
													var iRoleMethod = 0;

													if (oParam == undefined) {oParam = {}}
													if (oParam.step != undefined) {iStep = oParam.step}
													if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
													if (oParam.role != undefined) {iRole = oParam.role}
													if (oParam.roleTitle != undefined) {sRoleTitle = oParam.roleTitle}
													if (oParam.roleMethods != undefined) {aRoleMethods = oParam.roleMethods}
													if (oParam.roleMethod != undefined) {iRoleMethod = oParam.roleMethod}

													if (iStep == 1)
													{
														ns1blankspace.status.working();

														var sTitle = $('#' + sXHTMLElementID).attr('data-title');

														var sData = 'title=' + ns1blankspace.util.fs(sTitle);
														
														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('SETUP_ROLE_MANAGE'),
															data: sData,
															dataType: 'json',
															success: function (data)
															{
																if (data.status == 'OK')
																{
																	oParam.step = 2;
																	oParam.role = data.id;
																	oParam.roleTitle = sTitle;
																	ns1blankspace.setup.space.initialise.roles.add(oParam);
																}
																else
																{}
															}
														});
													}

													if (iStep == 2)
													{
														var aMethods = $.grep(ns1blankspace.setup.space.initialise.data.template.roles, function (a) { return a.title == sRoleTitle})[0].methods;
														var aMethodTitles = [];

														$(aMethods).each(function() 
														{
															aMethodTitles.push(this.title);
														});

														if (aMethodTitles.length == 0)
														{
															$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
															ns1blankspace.status.message('Role added');
														}
														else
														{
															var oSearch = new AdvancedSearch();
															oSearch.method = 'SETUP_METHOD_SEARCH';
															oSearch.addField('title,useavailable,addavailable,updateavailable,removeavailable');
															oSearch.addFilter('title', 'IN_LIST', aMethodTitles.join(','))
															oSearch.rows = 200;
															oSearch.getResults(function(oResponse)
															{
																oParam.step = 3;
																oParam.roleMethods = oResponse.data.rows;
																ns1blankspace.setup.space.initialise.roles.add(oParam)
															});
														}
													}	

													if (iStep == 3)
													{
														if (iRoleMethod < aRoleMethods.length)
														{
															ns1blankspace.status.working('Adding method ' + (iRoleMethod + 1) + ' of ' + aRoleMethods.length);

															var oData = 
															{
																role: iRole,
																accessmethod: aRoleMethods[iRoleMethod].id,
																canuse: aRoleMethods[iRoleMethod].useavailable,
																canadd: aRoleMethods[iRoleMethod].addavailable,
																canupdate: aRoleMethods[iRoleMethod].updateavailable,
																canremove: aRoleMethods[iRoleMethod].removeavailable
															}	

															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI('SETUP_ROLE_METHOD_ACCESS_MANAGE'),
																data: oData,
																dataType: 'json',
																success: function(data)
																{
																	if (data.status == "OK")
																	{
																		oParam.roleMethod = iRoleMethod + 1;
																		ns1blankspace.setup.space.initialise.roles.add(oParam)
																	}
																	else
																	{
																		ns1blankspace.status.error(data.error.errornotes);
																	}
																}
															});
														}
														else
														{
															$('#' + sXHTMLElementID).parent().html('This role was just imported.')
																	.css('font-size', '0.75em')
																	.addClass('ns1blankspaceSub');
															
															ns1blankspace.status.message('Role added');
														}	
													}	
												}				
								},

					"import": 	{
									show:		function (oParam)
												{
													var aData = ns1blankspace.setup.space.initialise.data.template["import"];
													var aHTML = [];

													aHTML.push('<table id="ns1blankspaceSetupSpaceInitialiseImport" class="ns1blankspaceColumn2">');
											
													aHTML.push('<tr>');
													aHTML.push('<td class="ns1blankspaceHeaderCaption">Items</td>');
													aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">' +
																	'<span id="ns1blankspaceSetupSpaceInitialiseImport_options_add"></span></td>');

													$(aData).each(function(i, v) 
													{
														aHTML.push('<tr class="ns1blankspaceRow">');
														
														aHTML.push('<td id="ns1blankspaceSetupSpaceInitialiseImport_title-' + i + '" class="ns1blankspaceRow">' +
																				this.title + '</td>');

														aHTML.push('<td style="width:250px;" class="ns1blankspaceRow ns1blankspaceSub"' +
																		' id="ns1blankspaceSetupSpaceInitialiseImport_status-' + this.reference + '"></td>');	
																									
														aHTML.push('</tr>');
													});
													
													aHTML.push('</table>');
												
													$('#ns1blankspaceInitialiseColumn2').html(aHTML.join(''));

													$('#ns1blankspaceSetupSpaceInitialiseImport_options_add').button(
													{
														label: 'Import',
													})
													.click(function()
													{
														ns1blankspace.setup.space.initialise["import"].add(oParam)
													})
													.css('font-size', '0.75em')
													.css('height', '24px');
												},

									add: 		function(oParam, oResponse)
												{
													var iStep = 1;
													var sXHTMLElementID;
													var iDataIndex = 0;

													if (oParam == undefined) {oParam = {}}
													if (oParam.step != undefined) {iStep = oParam.step}
													if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
													if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
										
													if (iDataIndex < ns1blankspace.setup.space.initialise.data.template["import"].length)
													{
														var oImport = ns1blankspace.setup.space.initialise.data.template["import"][iDataIndex];

														var oData = oImport.data;
														
														var oImportAlready = $.grep(ns1blankspace.setup.space.initialise.data.template["import"], function (a) {return a.response != undefined});

														$(oImportAlready).each(function(i, v) 
														{
															for (var key in oData)
															{					
																oData[key] = (oData[key]).replace('[[' + v.reference + '.id]]', v.response.id);
															}	
														});

														$('#ns1blankspaceSetupSpaceInitialiseImport_status-' + oImport.reference).html(ns1blankspace.xhtml.loadingSmall)

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI(oImport.method),
															data: oData,
															dataType: 'json',
															global: false,
															success: function (data)
															{
																if (data.status == 'OK')
																{
																	$('#ns1blankspaceSetupSpaceInitialiseImport_status-' + oImport.reference).html('Done');
																	oImport.response = data;
																	oParam.step = 1;
																	oParam.dataIndex = iDataIndex + 1;
																	ns1blankspace.setup.space.initialise["import"].add(oParam);
																}
																else
																{
																	$('#ns1blankspaceSetupSpaceInitialiseImport_status-' + oImport.reference).html(data.error.errornotes);
																}
															}
														});
													}

												}			
								}									
				},			

	access: 	function (oParam, oResponse)
				{
					var iStep = 1;
					var iID;
					var sXHTMLElementID;

					if (oParam != undefined)
					{
						if (oParam.step != undefined) {iStep = oParam.step}
						if (oParam.id != undefined) {iID = oParam.id}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}
						
					if (iStep == 1)
					{
						var aHTML = [];
	
						if (oResponse == undefined)
						{
							aHTML.push('<table class="ns1blankspaceMain">' +
											'<tr class="ns1blankspace">' +
											'<td id="ns1blankspaceSetupAccessColumnAccess" class="ns1blankspaceColumn1Large" style="width:450px;padding-right:5px;font-size:0.75em;">' +
											ns1blankspace.xhtml.loading + '</td>' +
											'<td id="ns1blankspaceSetupAccessColumnAction" class="ns1blankspaceColumn2Action"></td>' +
											'</tr>' +
											'</table>');

							$('#ns1blankspaceMainAccess').html(aHTML.join(''));

							var aHTML = [];

							aHTML.push('<table class="ns1blankspaceColumn2">' +
											'<tr><td class="ns1blankspaceAction">' +
											'<span id="ns1blankspaceAccessAdd">Add</span>' +
											'</td></tr>' +
											'</table>');					
							
							$('#ns1blankspaceSetupAccessColumnAction').html(aHTML.join(''));
						
							$('#ns1blankspaceAccessAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								$.extend(true, oParam, {step: 4, id: ""});
								ns1blankspace.setup.space.access(oParam);
							})
						
							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_METHOD_ACCESS_SEARCH';
							oSearch.addField('title,accessmethod,accessmethodtext,addavailable,removeavailable,updateavailable,useavailable');
							oSearch.rows = 50;
							oSearch.sort('accessmethodtext', 'asc');
							oSearch.addFilter('accessmethodtext', 'TEXT_IS_NOT_EMPTY')
							oSearch.getResults(function(data) {ns1blankspace.setup.space.access(oParam, data)})	
						}
						else
						{
							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspaceContainer">');

							aHTML.push('<tr class="ns1blankspaceCaption">');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">Method</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:35px;text-align:center;">Search</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:35px;text-align:center;">Add</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:35px;text-align:center;">Update</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:35px;text-align:center;">Remove</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
							aHTML.push('</tr>');

							$(oResponse.data.rows).each(function()
							{

								aHTML.push('<tr id="ns1blankspaceSetupSpaceAccess" class="ns1blankspaceRow">');
								
								if (this.accessmethodtext != '')
								{
									aHTML.push('<td id="ns1blankspaceSetupSpaceAccess_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
														' title="">' +
														this.accessmethodtext + '</td>');

									aHTML.push('<td style="width:35px;text-align:center;" ' +
													'id="ns1blankspaceSetupSpaceAccess_useavailable-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowEdit' +
														((this.useavailable == 'Y') ? ' ticked' : '') + '">&nbsp;' +
													'</td>');		

									aHTML.push('<td style="width:35px;text-align:center;" ' +
													'id="ns1blankspaceSetupSpaceAccess_addavailable-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowEdit' +
														((this.addavailable == 'Y') ? ' ticked' : '') + '">&nbsp;' +
													'</td>');

									aHTML.push('<td style="width:35px;text-align:center;" ' +
													'id="ns1blankspaceSetupSpaceAccess_updateavailable-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowEdit' +
														((this.updateavailable == 'Y') ? ' ticked' : '') + '">&nbsp;' +
													'</td>');

									aHTML.push('<td style="width:35px;text-align:right;" ' +
													'id="ns1blankspaceSetupSpaceAccess_removeavailable-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowEdit' +
														((this.removeavailable == 'Y') ? ' ticked' : '') + '">&nbsp;' +
													'</td>');									

									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspaceSetupSpaceAccess_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>' +
													'</td>');		
								}

								aHTML.push('</tr>');

							});
						
							aHTML.push('</table>');
								
							$('#ns1blankspaceSetupAccessColumnAccess').html(aHTML.join(''));

							$('#ns1blankspaceSetupSpaceAccess > td.ns1blankspaceRowSelect').click(function(event)
							{
								var sXHTMLElementId = event.target.id;
								var aId = sXHTMLElementId.split('-');
								
								ns1blankspace.setup.space.access({id: aId[1], step: 3});
							});

							$('#ns1blankspaceSetupSpaceAccess > span.ns1blankspaceRowOptionsRemove').button(
							{
								text: false,
								icons: {
									primary: "ui-icon-close"
								}
							})
							.click(function() {
								$.extend(true, oParam, {step: 5, xhtmlElementID: this.id});
								ns1blankspace.setup.space.access(oParam);
							})
							.css('width', '15px')
							.css('height', '17px');
						}
						
					}	
					else if (iStep == 3)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_METHOD_ACCESS_SEARCH';
						oSearch.addField('title,accessmethod,accessmethodtext,addavailable,removeavailable,updateavailable,useavailable');
						oSearch.addFilter('id', 'EQUAL_TO', iID);

						oSearch.getResults(function(data) {
								$.extend(true, oParam, {step: 4});
								ns1blankspace.setup.space.access(oParam, data)
								});
					}

					else if (iStep == 4)
					{
						var aHTML = [];

						if (iID == '')
						{
							aHTML.push('<table class="ns1blankspace">');
							
							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'Method' +
											'</td></tr>' +
											'<tr class="ns1blankspaceSelect">' +
											'<td class="ns1blankspaceSelect">' +
											'<input id="ns1blankspaceAccessMethod" class="ns1blankspaceSelectCustom">' +
											'</td></tr>');

							aHTML.push('</table>');					
						}

						aHTML.push('<table class="ns1blankspaceContainer">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Search?' +
										'</td></tr>' +
										'<tr class="ns1blankspaceRadio">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioCanUseY" name="radioCanUse" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioCanUseN" name="radioCanUse" value="N"/>No' +
									'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Add?' +
										'</td></tr>' +
										'<tr class="ns1blankspaceRadio">' +
										'<td id="ns1blankspaceAccessCanAddValue" class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioCanAddY" name="radioCanAdd" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioCanAddN" name="radioCanAdd" value="N"/>No' +
										'</td></tr>');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Remove?' +
										'</td></tr>' +
										'<tr class="ns1blankspaceRadio">' +
										'<td id="ns1blankspaceAccessCanRemoveValue" class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioCanRemoveY" name="radioCanRemove" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioCanRemoveN" name="radioCanRemove" value="N"/>No' +
									'</td></tr>');
					
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Update?' +
										'</td></tr>' +
										'<tr class="ns1blankspaceRadio">' +
										'<td id="ns1blankspaceAccessCanUpdateValue" class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioCanUpdateY" name="radioCanUpdate" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioCanUpdateN" name="radioCanUpdate" value="N"/>No' +
									'</td></tr>');
					
						aHTML.push('</table>');					
						
						aHTML.push('<table class="ns1blankspaceContainer" style="font-size:0.875em">');
								
						aHTML.push('<tr class="ns1blankspaceAction">' +
										'<td id="ns1blankspaceAccessSave" class="ns1blankspaceAction">' +
										'<span style="width:70px;" id="ns1blankspaceAccessSave">Save</span>' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspaceAction">' +
											'<td id="tdns1blankspaceMethodAccessCancel" class="ns1blankspaceAction">' +
											'<span style="width:70px;" id="ns1blankspaceAccessCancel">Cancel</span>' +
											'</td></tr>');
															
						aHTML.push('</table>');					
							
						$('#ns1blankspaceSetupAccessColumnAction').html(aHTML.join(''));

						$('#ns1blankspaceAccessMethod').keyup(function()
						{
							if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
					        ns1blankspace.timer.delayCurrent = setTimeout("ns1blankspace.setup.space.methods.show('ns1blankspaceAccessMethod')", ns1blankspace.option.typingWait);
						});	
							
						$('#ns1blankspaceAccessMethod').live('blur', function() 
						{
							$(this).removeClass('ns1blankspaceHighlight');
						});
						
						$('#ns1blankspaceAccessSave').button(
						{
							text: "Save"
						})
						.click(function() 
						{
							ns1blankspace.status.working();

							var sData = 'id=' + ns1blankspace.util.fs(iID);
							if (iID == '')
							{
								sData += '&accessmethod=' + ns1blankspace.util.fs($('#ns1blankspaceAccessMethod').attr('data-id'));
							}	
							sData += '&addavailable=' + ns1blankspace.util.fs($('input[name="radioCanAdd"]:checked').val());
							sData += '&removeavailable=' + ns1blankspace.util.fs($('input[name="radioCanRemove"]:checked').val());
							sData += '&updateavailable=' + ns1blankspace.util.fs($('input[name="radioCanUpdate"]:checked').val());
							sData += '&useavailable=' + ns1blankspace.util.fs($('input[name="radioCanUse"]:checked').val());

							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('SETUP_METHOD_ACCESS_MANAGE'),
								data: sData,
								dataType: 'json',
								success: function(data) {
									if (data.status == "OK")
									{
										ns1blankspace.status.message('Saved');
										$.extend(true, oParam, {step: 1});
										ns1blankspace.setup.space.access(oParam);
									}
									else
									{
										ns1blankspace.status.error(data.error.errornotes);
									}
								}
							});
						});

						$('#ns1blankspaceAccessCancel').button(
						{
							text: "Cancel"
						})
						.click(function() 
						{
							$.extend(true, oParam, {step: 1});
							ns1blankspace.setup.space.access(oParam);
						});

						if (iID != '')
						{	
							if (oResponse.data.rows.length != 0)
							{
								var oObjectContext = oResponse.data.rows[0];
								
								$('[name="radioCanAdd"][value="' + oObjectContext.addavailable + '"]').attr('checked', true);
								$('[name="radioCanRemove"][value="' + oObjectContext.removeavailable + '"]').attr('checked', true);
								$('[name="radioCanUpdate"][value="' + oObjectContext.updateavailable + '"]').attr('checked', true);
								$('[name="radioCanUse"][value="' + oObjectContext.useavailable + '"]').attr('checked', true);
							}
							else
							{
								$('[name="radioCanAdd"][value="Y"]').attr('checked', true);
								$('[name="radioCanRemove"][value="Y"]').attr('checked', true);
								$('[name="radioCanUpdate"][value="Y"]').attr('checked', true);
								$('[name="radioCanUse"][value="Y"]').attr('checked', true);
							}
						}	
					}

					else if (iStep == 5)
					{
						var aSearch = sXHTMLElementID.split('-');
						var sData = 'remove=1&id=' + aSearch[1];
									
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('SETUP_METHOD_ACCESS_MANAGE'),
							data: sData,
							dataType: 'json',
							success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
						});	
					}
				},

	methods: 	{
					show: 		function (sXHTMLInputElementID, oResponse)
								{
									var aHTML = [];
									var sSearchText;
									var iXHTMLElementContextID;

									if (oResponse == undefined)
									{	
										sSearchText = $('#' + sXHTMLInputElementID).val();
										
										if (sSearchText.length > 2)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_METHOD_SEARCH';
											oSearch.addField('title');
											oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText)
											oSearch.rows = 10;
											oSearch.sort('title', 'asc');
											oSearch.getResults(function(data) {ns1blankspace.setup.space.methods.show(sXHTMLInputElementID, data)})	
										}
									}
									else
									{	
										aHTML.push('<table style="width: 350px;" class="ns1blankspaceSearchMedium">');

										$(oResponse.data.rows).each(function()
										{
											
											aHTML.push('<tr>' +
												'<td id="ns1blankspaceMethod-' + this.id + '" data-methodtext="' + this.title + '" class="ns1blankspaceSearch ns1blankspaceMethod">' +
												this.title +
												'</td></tr>');
												
										});			
														
										aHTML.push('</table>');
										
										$(ns1blankspace.xhtml.container).html(aHTML.join(''));

										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										$(ns1blankspace.xhtml.container).offset({ top: $('#' + sXHTMLInputElementID).offset().top + $('#' + sXHTMLInputElementID).height(), left: $('#' + sXHTMLInputElementID).offset().left});

										$('.ns1blankspaceMethod').click(function(event)
										{
											var aXHTMLElementID = (event.target.id).split('-');
											iXHTMLElementContextID = aXHTMLElementID[1];

											$('#' + sXHTMLInputElementID).val($('#' + event.target.id).attr("data-methodtext"))
											$('#' + sXHTMLInputElementID).attr("data-id", iXHTMLElementContextID)
											$(ns1blankspace.xhtml.container).hide();
										});
									}	
								}
				},

	storage:  	
				{
					show:		function (oParam, oResponse)
								{	
									if (oResponse == undefined)
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_AWS_ACCOUNT_SEARCH';
										oSearch.addField('accessid,modifieddate,notes');
										oSearch.rows = 100;
										oSearch.sort('accessid', 'asc');
										oSearch.getResults(function(data)
										{
											ns1blankspace.setup.space.storage.show(oParam, data)
										});
									}
									else
									{	
										var aHTML = [];
											
										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceSpaceStorageColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
														'<td id="ns1blankspaceSpaceStorageColumn2" class="ns1blankspaceColumn2" style="width:200px;"></td>' +
														'</tr>' + 
														'</table>');

										$('#ns1blankspaceMainStorage').html(aHTML.join(''));
										
										var aHTML = [];
											
										aHTML.push('<table class="ns1blankspaceColumn2">');
										
										aHTML.push('<tr><td class="ns1blankspaceAction">' +
													'<span id="ns1blankspaceSpaceStorageAdd">Add</span>' +
													'</td></tr>');
													
										aHTML.push('<tr><td style="padding-top:20px;">' +
													'<a href="https://aws.amazon.com/s3/" target="_blank">What is AWS S3?</a>' +
													'</td></tr>');	

										aHTML.push('<tr><td style="padding-top:16px;" class="ns1blankspaceSubNote">' +
													'You can optionally save your files to your own AWS S3 Bucket.' +
													'<br /><br />If you create a bucket with <i>1blankspace-attachments</i>' +
													' in its name and add it here; all files you attach will be saved to it.' +
													'</td></tr>');	

										aHTML.push('<tr><td style="padding-top:16px;" class="ns1blankspaceSubNote">' +
													'The AWS user associated with the <i>Access ID</i> will need a security policy allowing access to the S3 bucket,' +
													' <a href="http://docs.mydigitalstructure.com/gettingstarted_export_aws_s3" target="_blank">more..</a>' + 
													'</td></tr>');

										aHTML.push('</table>');					
										
										$('#ns1blankspaceSpaceStorageColumn2').html(aHTML.join(''));
									
										$('#ns1blankspaceSpaceStorageAdd').button(
										{
											label: "Add"
										})
										.click(function()
										{
											 ns1blankspace.setup.space.storage.add(oParam);
										})
											
										var aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">No storage set up.</td></tr></table>');
	
											$('#ns1blankspaceSpaceStorageColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceSetupSpaceStorage">');
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Access ID</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Added</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');
		
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceSpaceStorage_accessid-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																		this.accessid + '</td>');

												aHTML.push('<td id="ns1blankspaceSpaceStorage_added-' + this.modifieddate + '" class="ns1blankspaceRow">' +
																		this.modifieddate + '</td>');
																		
												aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
													
												aHTML.push('<span id="ns1blankspaceSpaceStorage_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
														
												aHTML.push('</td>');
																
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceSpaceStorageColumn1').html(aHTML.join(''));
													
											$('#ns1blankspaceSetupSpaceStorage span.ns1blankspaceRowRemove').button(
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
													method: 'SETUP_AWS_ACCOUNT_MANAGE',
													parentLevel: 2,
													ifNoneMessage: 'No storage set up.'
												});
											})
											.css('width', '15px')
											.css('height', '17px');
											
											$('#ns1blankspaceSetupSpaceStorage .ns1blankspaceRowSelect')
											.click(function()
											{
												ns1blankspace.setup.space.storage.add({xhtmlElementID: this.id})
											});
										}
									}
								},

					add:		function (oParam, oResponse)
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
	
										aHTML.push('<table class="ns1blankspace">');
												
										aHTML.push('<tr><td class="ns1blankspaceCaption">' +
														'Access ID' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupSpaceStorageAccessID" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr><td class="ns1blankspaceCaption">' +
														'Access Key (Secret/Password)' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupSpaceStorageAccessKey" class="ns1blankspaceText" type="password">' +
														'</td></tr>');

										aHTML.push('<tr><td class="ns1blankspaceCaption">' +
														'Bucket Name' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupSpaceStorageBucketTitle" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Notes' +
														'</td></tr>' +
														'<tr class="ns1blankspaceTextMulti">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<textarea rows="4" cols="35" style="width:100%; height:140px;" id="ns1blankspaceSetupSpaceStorageNotes" class="ns1blankspaceTextMulti"></textarea>' +
														'</td></tr>');
														
										aHTML.push('</table>');	

										if (sID != undefined)
										{
											aHTML.push('<table class="ns1blankspace">');
													
											aHTML.push('<tr><td class="ns1blankspaceCaption">' +
															'Copy all attachments to this AWS Bucket' +
															'</td></tr>' +
															'<tr><td class="ns1blankspaceSubNote">' +
															'This will copy all attachment files that have not already been copied to an AWS bucket.' +
															'<br />After clicking Copy it will confirm the number of attachments and you can then continue or cancel.' +
															'</td></tr>' +
															'<tr class="ns1blankspaceText">' +
															'<td class="ns1blankspaceText" style="padding-top:6px;" id="ns1blankspaceSetupSpaceStorageBucketAttachmentCopyContainer">' +
															'<div id="ns1blankspaceSetupSpaceStorageBucketAttachmentCopy" class="ns1blankspaceAction"></div>' +
															'</td></tr>');

											aHTML.push('<tr><td class="ns1blankspaceCaption ns1blankspaceAttachmentIndex" style="padding-top:12px;">' +
															'Download an index of attachments copied to this AWS Bucket' +
															'</td></tr>' +
															'<tr><td class="ns1blankspaceSubNote ns1blankspaceAttachmentIndex">' +
															'This will down a CSV file of all the attachment files that have been copied to an AWS bucket.' +
															'</td></tr>' +
															'<tr class="ns1blankspaceText">' +
															'<td class="ns1blankspaceText ns1blankspaceAttachmentIndex" style="padding-top:6px;" id="ns1blankspaceSetupSpaceStorageBucketAttachmentIndexContainer">' +
															'<div id="ns1blankspaceSetupSpaceStorageBucketAttachmentIndex" class="ns1blankspaceAction"></div>' +
															'</td></tr>');

											aHTML.push('</table>');	
										}	
										
										$('#ns1blankspaceSpaceStorageColumn1').html(aHTML.join(''));

										$('#ns1blankspaceSetupSpaceStorageBucketAttachmentCopy').button(
										{
											label: 'Copy to AWS',
										})
										.click(function()
										{
											if (_.isFunction(ns1blankspace.setup.space.storage.prepareCopy))
											{
												ns1blankspace.setup.space.storage.prepareCopy(oParam)
											}
											else
											{
												ns1blankspace.setup.space.storage.copy(oParam)
											}
										})
										.css('width', '140px');

										$('#ns1blankspaceSetupSpaceStorageBucketAttachmentIndex').button(
										{
											label: 'Download Index',
										})
										.click(function()
										{
											ns1blankspace.setup.space.storage.index.process(oParam);
										})
										.css('width', '140px');

										$('#ns1blankspaceSetupSpaceStorageAccessID').focus();
										
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr><td>' +
														'<span class="ns1blankspaceAction" style="width:80px;" id="ns1blankspaceSpaceStorageSave">Save</span>' +
														'</td></tr>');
									
										aHTML.push('<tr><td>' +
														'<span class="ns1blankspaceAction" style="width:80px;" id="ns1blankspaceSpaceStorageCancel">Cancel</span>' +
														'</td></tr>');
														
										aHTML.push('</table>');	
	
										$('#ns1blankspaceSpaceStorageColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceSpaceStorageSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											var oData =
											{
												accessid: $('#ns1blankspaceSetupSpaceStorageAccessID').val(),
												id: sID,
												notes: $('#ns1blankspaceSetupSpaceStorageNotes').val()
											}

											if ($('#ns1blankspaceSetupSpaceStorageAccessKey').val() != '')
											{
												oData.accesskey = $('#ns1blankspaceSetupSpaceStorageAccessKey').val()
											}	
											
											ns1blankspace.status.working();

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_AWS_ACCOUNT_MANAGE'),
												data: oData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{	
														if ($('#ns1blankspaceSetupSpaceStorageBucketTitle').val() != '')
														{	
															var sAccount = data.id;

															var oData =
															{
																id: $('#ns1blankspaceSetupSpaceStorageBucketTitle').attr('data-id'),
																account: sAccount,
																title: $('#ns1blankspaceSetupSpaceStorageBucketTitle').val(),
																notes: $('#ns1blankspaceSetupSpaceStorageNotes').val()	
															}

															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI('SETUP_AWS_S3_BUCKET_MANAGE'),
																data: oData,
																dataType: 'json',
																success: function(data)
																{
																	if (data.status == 'OK')
																	{	
																		ns1blankspace.status.message('Saved.')
																		ns1blankspace.show({selector: '#ns1blankspaceMainStorage', refresh: true});
																		ns1blankspace.setup.space.storage.show();
																	}
																	else
																	{
																		ns1blankspace.status.error(data.error.errornotes);
																	}	
																}
															});
														}
														else
														{
															ns1blankspace.status.message('Saved.')
															ns1blankspace.show({selector: '#ns1blankspaceMainStorage', refresh: true});
															ns1blankspace.setup.space.storage.show();
														}	
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}	
												}
											});
										});
										
										$('#ns1blankspaceSpaceStorageCancel').button(
										{
											text: "Cancel"
										})
										.click(function() 
										{
											ns1blankspace.show({selector: '#ns1blankspaceMainStorage'});
											ns1blankspace.setup.space.storage.show();
										});
										
										if (sID != undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_AWS_ACCOUNT_SEARCH';
											oSearch.addField('accessid,modifieddate,notes');
											oSearch.addFilter('id', 'EQUAL_TO', sID)
											oSearch.rf = 'json';
											oSearch.getResults(function(data)
											{
												ns1blankspace.setup.space.storage.add(oParam, data)
											});
										}
									}
									else
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];
											$('#ns1blankspaceSetupSpaceStorageAccessID').val(oObjectContext.accessid);
											$('#ns1blankspaceSetupSpaceStorageNotes').val(oObjectContext.notes);

											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_AWS_S3_BUCKET_SEARCH';
											oSearch.addField('title,modifieddate');
											oSearch.addFilter('account', 'EQUAL_TO', oObjectContext.id)
											oSearch.getResults(function(oResponse)
											{
												if (oResponse.data.rows.length != 0)
												{	
													$('#ns1blankspaceSetupSpaceStorageBucketTitle').val(oResponse.data.rows[0].title)
													$('#ns1blankspaceSetupSpaceStorageBucketTitle').attr('data-id', oResponse.data.rows[0].id)
												}	
											});
										}
									}		
								},

					_example_1_prepareCopy: function (oParam, oResponse)
								{
									//Example only - this should be webapp specific control file as "ns1blankspace.setup.space.storage.prepareCopy" function.

									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'ACTION_SEARCH';		
										oSearch.addField('id');
										
										oSearch.addFilter('actiontype', 'EQUAL_TO', 1445);
	
										oSearch.rows = 500;				
										oSearch.getResults(function(data) {ns1blankspace.setup.space.storage.prepareCopy(oParam, data)});
									}
									else
									{
										var aIDs = $.map(oResponse.data.rows, function (row) {return row.id})
										var aFilters = [];
										
										if (aIDs.length != 0)
										{
											aFilters.push('object-equal_to-17');
											aFilters.push('objectcontext-in_list-' + aIDs.join(','));

											oParam.filters = aFilters.join('|');
											ns1blankspace.setup.space.storage.copy(oParam)
										}
										else
										{
											ns1blankspace.status.error('Nothing to copy')
										}
									}
								},

					_example_2_prepareCopy: function (oParam, oResponse)
								{
									var aFilters = [];
										
									aFilters.push('object-IN_LIST-107');
									
									oParam.filters = aFilters.join('|');
									ns1blankspace.setup.space.storage.copy(oParam)
								},			

					copy: 	function (oParam, oResponse)
								{
									var iAWSS3BucketId = $('#ns1blankspaceSetupSpaceStorageBucketTitle').attr('data-id');
									var bTest = ns1blankspace.util.getParam(oParam, 'test', {"default": false}).value;
									var sFilters = ns1blankspace.util.getParam(oParam, 'filters').value;
									var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": false}).value;

									if (oResponse == undefined)
									{
										$('.ns1blankspaceAttachmentIndex').hide();

										var aFilters = ns1blankspace.util.getParam(oParam, 'filters', {"default": []}).value;

										var sNotes = $('#ns1blankspaceSetupSpaceStorageNotes').val();
										
										if (sNotes.indexOf('filter:') != -1)
										{
											sFilters = sNotes.replace('filter:', '')
											aFilters = sFilters.split('|');
										}

										if (sFilters != undefined)
										{
											aFilters = sFilters.split('|');
										}

										var oSearch = new AdvancedSearch();
										oSearch.method = 'CORE_ATTACHMENT_SEARCH';		
										oSearch.addField('id');
										oSearch.addSummaryField('count(id) count')
										
										if (!bRefresh)
										{
											oSearch.addFilter('bucketfilename', 'IS_NULL');
										}	

										if (aFilters.length != 0)
										{
											$.each(aFilters, function (f, filter)
											{
												var aFilter = filter.split('-');
												if (aFilter[0] == '(' || aFilter[0] == ')')
												{
													oSearch.addBracket(aFilter[0])
												}
												else if (aFilter[0] == 'or' || aFilter[0] == 'and')
												{
													oSearch.addOperator(aFilter[0])
												}
												else
												{
													oSearch.addFilter(aFilter[0], aFilter[1], aFilter[2]);
												}	
											})
										}

										oSearch.rows = (bTest?1:99999);				
										oSearch.getResults(function(data) {ns1blankspace.setup.space.storage.copy(oParam, data)});
									}
									else
									{
										if (oResponse.instance == 'DBG' || oResponse.instance == 'lab-001')
										{
											var iCount = oResponse.summary.count;
											if (oResponse.data.rows != undefined)
											{
												iCount = oResponse.data.rows.length
											}

											$('#ns1blankspaceSetupSpaceStorageBucketAttachmentCopyContainer').html(
												'<div class="ns1blankspaceSubNote" style="margin-bottom:6px;">' +
												iCount + ' attachment(s) will be copied to this AWS Bucket.' +
												'</div>' +
												'<div id="ns1blankspaceSetupSpaceStorageBucketAttachmentCopyContinue" class="ns1blankspaceAction"></div>');

											$('#ns1blankspaceSetupSpaceStorageBucketAttachmentCopyContinue').button(
											{
												label: 'Continue',
											})
											.click(function()
											{
												$('#ns1blankspaceSetupSpaceStorageBucketAttachmentCopyContainer').html(
													'<div class="ns1blankspaceSubNote" id="ns1blankspaceSetupSpaceStorageBucketAttachmentCopyStatus">Copying...</div>');

												var oCopyParam =
												{
													awsS3BucketID: iAWSS3BucketId,
													xhtmlElementID: 'ns1blankspaceSetupSpaceStorageBucketAttachmentCopyStatus',
													filters: oParam.filters
												}

												if (bTest)
												{
													oCopyParam.attachmentLinkID = oResponse.data.rows[0].id
												}

												oCopyParam.onProcessingComplete = ns1blankspace.setup.space.storage.index.init;
												ns1blankspace.util.attachment.s3.copy(oCopyParam);
											});
										}
										else
										{
											alert('This can not be run in production.')
										}
									}
								},

					index: 	
								{
									init: function (oParam, oResponse)
									{
										$('#ns1blankspaceSetupSpaceStorageBucketAttachmentCopyContainer').html(
												'<div class="ns1blankspaceSubNote" style="margin-bottom:6px;">' +
												'Download index of attachment(s) copied to this AWS Bucket, including previous copies.' +
												'</div>' +
												'<div id="ns1blankspaceSetupSpaceStorageBucketAttachmentIndex" class="ns1blankspaceAction"></div>');

										$('#ns1blankspaceSetupSpaceStorageBucketAttachmentIndex').button(
										{
											label: 'Download Index',
										})
										.click(function()
										{
											ns1blankspace.setup.space.storage.index.process(oParam);
										})
										.css('width', '140px');
									},

									process: function (oParam, oResponse)
									{
										var iAWSS3BucketId = $('#ns1blankspaceSetupSpaceStorageBucketTitle').attr('data-id');
										var bTest = ns1blankspace.util.getParam(oParam, 'test', {"default": true}).value;

										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'CORE_ATTACHMENT_SEARCH';		
											oSearch.addField('bucketfilename,filename,objecttext,objectcontext,createddate,attachment,guid');
											oSearch.addSummaryField('count(id) count')
											//oSearch.addFilter('bucket', 'EQUAL_TO', iAWSS3BucketId)
											oSearch.addFilter('bucket', 'EQUAL_TO', 0)
											oSearch.addFilter('bucketfilename', 'IS_NOT_NULL')
											oSearch.rows = 999999;				
											oSearch.getResults(function(data) {ns1blankspace.setup.space.storage.index.process(oParam, data)});
										}
										else
										{
											if (ns1blankspace.data == undefined) {ns1blankspace.data = {}}
											if (ns1blankspace.data.render == undefined) {ns1blankspace.data.render = {}}

											ns1blankspace.data.render['attachment.s3.copy.index'] = oResponse;

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
															{value: 'Bucket File Name'},
															{value: 'Original File Name'},
															{value: 'Object'},
															{value: 'Object Context'},
															{value: 'Date'},
															{value: 'ID'},
															{value: 'GUID'}

														]
													}	
												],

												item:
												[
													{
														fields:
														[
															{field: 'bucketfilename'},
															{field: 'filename'},
															{field: 'objecttext'},
															{field: 'objectcontext'},
															{field: 'createddate'},
															{field: 'attachment'},
															{field: 'guid'}
														]
													}		
												]
											}]

											ns1blankspace.setup.file['export'].data.get(
											{
												xhtmlContext: 'attachment.s3.copy.index',
												saveToFile: true,
												format: oFormat,
												open: true
											})
										}
									}
								}
				},

	advanced: 	
				{
					show:		function (oResponse)
								{		
									var aHTML = [];
									
									aHTML.push('<table class="ns1blankspace" style="width:310px;">');
									
									aHTML.push('<tr><td class="ns1blankspaceCaption">' +
													'Enable user role based data access' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceRadio">' +
													'<input type="radio" id="radioDataBasedSecurityN" name="radioDataBasedSecurity" value="N"/>No<br />' +
													'<input type="radio" id="radioDataBasedSecurityY" name="radioDataBasedSecurity" value="Y"/>Yes' +
													'</td></tr>');

									// aHTML.push('<tr><td class="ns1blankspaceCaption">' +
									// 				'Contact Name Order' +
									// 				'</td></tr>' +
									// 				'<tr class="ns1blankspace">' +
									// 				'<td class="ns1blankspaceRadio">' +
									// 				'<input type="radio" id="radioDataBasedContactNameOrder1" name="radioDataBasedContactNameOrder" value="1"/>Surname, First Name<br />' +
									// 				'<input type="radio" id="radioDataBasedContactNameOrder2" name="radioDataBasedContactNameOrder" value="2"/>First Name Surname' +
									// 				'</td></tr>');

									aHTML.push('<tr><td class="ns1blankspaceHeaderCaption" style="padding-top:18px; width:300px;">SPACE ADMINISTRATOR</td></tr>');

									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Name' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceText">' +
													'<input id="ns1blankspaceAdvancedSpaceAdministratorName" class="ns1blankspaceText" style="width:300px;">' +
													'</td></tr>');

									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Email' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceText">' +
													'<input id="ns1blankspaceAdvancedSpaceAdministratorEmail" class="ns1blankspaceText" style="width:300px;">' +
													'</td></tr>');

									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Mobile' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceText">' +
													'<input id="ns1blankspaceAdvancedSpaceAdministratorMobile" class="ns1blankspaceText" style="width:300px;">' +
													'</td></tr>');

									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Phone' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceText">' +
													'<input id="ns1blankspaceAdvancedSpaceAdministratorPhone" class="ns1blankspaceText" style="width:300px;">' +
													'</td></tr>');

									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Notes' +
													'</td></tr>' +
													'<tr class="ns1blankspaceTextMulti">' +
													'<td class="ns1blankspaceTextMulti">' +
													'<textarea rows="4" cols="35" style="width:300px; height:100px;" id="ns1blankspaceAdvancedSpaceAdministratorNotes" class="ns1blankspaceTextMulti"></textarea>' +
													'</td></tr>');

									aHTML.push('</table>');					
											
									$('#ns1blankspaceMainAdvanced').html(aHTML.join(''));

									if (ns1blankspace.objectContextData !== undefined)
									{
										$('#ns1blankspaceAdvancedSpaceAdministratorName').val(ns1blankspace.objectContextData.spaceadministratorname);
										$('#ns1blankspaceAdvancedSpaceAdministratorEmail').val(ns1blankspace.objectContextData.spaceadministratoremail);
										$('#ns1blankspaceAdvancedSpaceAdministratorMobile').val(ns1blankspace.objectContextData.spaceadministratormobile);
										$('#ns1blankspaceAdvancedSpaceAdministratorPhone').val(ns1blankspace.objectContextData.spaceadministratorphone);
										$('#ns1blankspaceAdvancedSpaceAdministratorNotes').val(ns1blankspace.objectContextData.spaceadministratornotes);
									}

									ns1blankspace.setup.space.advanced.security();
								},	

					security:	function (oResponse)
								{	
									if (oResponse == undefined)
									{	
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('CORE_PROFILE_SEARCH'),
											data: 'attribute=473',
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.setup.space.advanced.security(data);
											}
										});
									}	
									else
									{	
										if (oResponse.data == '') {oResponse.data = 'N'}
										$('[name="radioDataBasedSecurity"][value="' +
													oResponse.data + '"]').attr('checked', true);
									}
								},

					contactNameOrder:	function (oResponse)
								{	
									if (oResponse == undefined)
									{	
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('CORE_PROFILE_SEARCH'),
											data: 'attribute=220',
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.setup.space.advanced.contactNameOrder(data);
											}
										});
									}	
									else
									{	
										if (oResponse.data == '') {oResponse.data = '1'}
										$('[name="radioDataBasedContactNameOrder"][value="' +
													oResponse.data + '"]').attr('checked', true);
									}
								},			
				}		
}								


ns1blankspace.setup.space.export =
{
	roles:
	{
		data: {},

		init: function (oParam, oResponse)
		{
			var iRole = ns1blankspace.util.getParam(oParam, 'role').value

			if (iRole != undefined)
			{
				if (oResponse == undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'SETUP_ROLE_SEARCH';
					oSearch.addField('title,notes,modifieddate,selfsignupavailable');
					oSearch.addFilter('id', 'EQUAL_TO', iRole);
					oSearch.getResults(function(data) {ns1blankspace.setup.space.export.roles.init(oParam, data)});
				}
				else
				{
					if (oResponse.data.rows.length != 0)
					{
						ns1blankspace.setup.space.export.roles.data.role = oResponse.data.rows[0];
						ns1blankspace.setup.space.export.roles.process(oParam);
					}
					else
					{

					}
				}
			}
		},

		process: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_ROLE_METHOD_ACCESS_SEARCH';
				oSearch.addField('accessmethod,accessmethodtext,canadd,canremove,canupdate,canuse,guidmandatory');
				oSearch.addFilter('role', 'EQUAL_TO', ns1blankspace.setup.space.export.roles.data.role.id);
				oSearch.rows = 99999;
				oSearch.sort('accessmethodtext', 'asc');
				oSearch.getResults(function(data) {ns1blankspace.setup.space.export.roles.process(oParam, data)});
			}
			else
			{
				ns1blankspace.setup.space.export.roles.data.methods = oResponse.data.rows;
				ns1blankspace.setup.space.export.roles.data.file = [];
				var aFile = ns1blankspace.setup.space.export.roles.data.file;

				aFile.push('{');
				aFile.push('\t"template":');
				aFile.push('\t{');
				aFile.push('\t\t"roles":');
				aFile.push('\t\t[');
				aFile.push('\t\t\t{');
				aFile.push('\t\t\t\t"title": "' + ns1blankspace.setup.space.export.roles.data.role.title + '",');

				aFile.push('\t\t\t\t"methods":');
				aFile.push('\t\t\t\t[');

				var aFileMethods = [];

				$.each(ns1blankspace.setup.space.export.roles.data.methods, function (m, method)
				{
					aFileMethods.push('\t\t\t\t\t{"title": "' + method.accessmethodtext + '", "canuse": "' + method.canuse + '",' +
												' "canadd": "' + method.canadd + '",' +
												' "canupdate": "' + method.canupdate + '",' +
												' "canremove": "' + method.canremove + '",' +
												' "guidmandatory": "' + method.guidmandatory + '"' +
												'}');
				});

				aFile.push(aFileMethods.join(',\r\n'));

				aFile.push('\t\t\t\t]');
				aFile.push('\t\t\t}');
				aFile.push('\t\t]');
				aFile.push('\t}');
				aFile.push('}');

				ns1blankspace.setup.file.export.saveToFile(
				{
					data: aFile.join('\r\n'),
					filename: 'setup-role-access.json'
				});
			}
		}
	}
}





