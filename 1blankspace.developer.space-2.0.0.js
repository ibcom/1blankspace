/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

if (ns1blankspace.developer == undefined) {ns1blankspace.developer = {}}

ns1blankspace.developer.space = 
{
	init: 		function ()
				{

					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = -1;
					ns1blankspace.objectParentName = 'developer';
					ns1blankspace.objectName = 'space';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Spaces';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.developer.space.init({showHome: true});',
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
							url: ns1blankspace.util.endpointURI('ADMIN_REGISTRATION_SEARCH'),
							dataType: 'json',
							success: s1blankspace.developer.space.home
						});
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
							ns1blankspace.developer.space.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function (sXHTMLElementID, aParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
									var sSearchContext = aSearch[1];
									var iMinimumLength = 3;
									var iSource = ns1blankspace.data.searchSource.text;
									var sSearchText;
									var iMaximumColumns = 1;
									var iRows = 10;
									
									if (aParam != undefined)
									{
										if (aParam.source != undefined) {iSource = aParam.source}
										if (aParam.searchText != undefined) {sSearchText = aParam.searchText}
										if (aParam.rows != undefined) {iRows = aParam.rows}
										if (aParam.searchContext != undefined) {sSearchContext = aParam.searchContext}
										if (aParam.minimumLength != undefined) {iMinimumLength = aParam.minimumLength}
										if (aParam.maximumColumns != undefined) {iMaximumColumns = aParam.maximumColumns}
									}
										
									if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
									{
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;

										var sParam = 'method=ADMIN_REGISTRATION_SEARCH&id=' + giObjectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('ADMIN_REGISTRATION_SEARCH'),
											data: 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
											dataType: 'json',
											success: function(data) {ns1blankspace.developer.space.show(aParam, data)}
										});
									}
									else
									{	
										if (sSearchText == undefined)
										{
											sSearchText = $('#ns1blankspaceViewpControlSearch').val();
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
											ns1blankspace.container.position({xhtmlElementID: sElementID});
											ns1blankspace.search.start(sElementID);
											
											var sData = 'contactbusinesstext=' + sSearchText;

											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('ADMIN_REGISTRATION_SEARCH'),
												data: sData,
												dataType: 'json',
												success: function(data) {ns1blankspace.developer.space.search.process(aParam, data)}
											});
										}
									};	
								},

					process:	function (aParam, oResponse)
								{
									var iColumn = 0;
									var	iMaximumColumns = 1;
									var aHTML = [];
										
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
											
											aHTML.push('<td class="ns1blankspaceSearch" id="registration-' +
															this.id + '">' +
															this.contactbusinesstext + '</td>');
											
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
											ns1blankspace.developer.space.search(event.target.id, {source: 1});
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
						aHTML.push('<tr><td id="ns1blankspaceControlFromNew" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'From New</td></tr>');		
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSubscriptions" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Subscriptions</td></tr>');

						aHTML.push('</table>');
					}				
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainFromNew" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainFromContact" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainSubscriptions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainUsers" class="ns1blankspaceControlMain"></div>');

					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlFromNew').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainFromNew'});
						ns1blankspace.developer.membership.new.fromNew();
					});

					$('#ns1blankspaceControlFromContact').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainFromContact'});
						ns1blankspace.developer.membership.new.fromContact();
					});
					
					$('#ns1blankspaceControlSubscriptions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSubscriptions'});
						ns1blankspace.developer.membership.subscriptions();
					});
				},							
				
	show:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.developer.space.layout();
					
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
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.developer.space.init({showHome: false});ns1blankspace.developer.space.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.developer.space.summary()'});
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
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:100px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));

						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Space ID</td></tr>' +
										'<tr><td id="ns1blankspaceSummarySpaceID" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.space +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Initial Logon Name</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryInitialLogonName" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.initiallogonname +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Initial Password</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryInitialPassword" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.initialpassword +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Creation Date</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryCreationDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.registrationdate +
										'</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
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
					
					if (ns1blankspace.objectContext == undefined)
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

							$('#ns1blankspaceMainFromContact').html(aHTML.join(''));		
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
											'<input id="ns1blankspaceDetailsEnterpriseName" class="ns1blankspaceText">' +
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
						
							$('#divns1blankspaceMainFromNew').html(aHTML.join(''));
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
						
						$('#divns1blankspaceMainDetails').html(aHTML.join(''));
						
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspaceMain">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Space Name (Business, group name, school etc)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsEnterpriseName" class="ns1blankspaceText">' +
										'</td></tr>');		
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContext != undefined)
						{
							$('#ns1blankspaceDetailsEnterpriseName').val(goObjectContext.spacename);
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
							$.ajax(
							{
								type: 'GET',
								url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SUBSCRIPTION_SEARCH'),
								data: 'other=1&registration=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
								dataType: 'json',
								success: function(data) {ns1blankspace.developer.space.subscriptions(aParam, data)}
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

							aHTML.push('<table>');
							
							aHTML.push('<tr><td><span id="ns1blankspaceSpaceSubscriptionsAdd">Add</span>' +
															'</td></tr>');

							aHTML.push('</table>');					
							
							$('#tdns1blankspaceMainSpaceSubscriptionsColumn2').html(aHTML.join(''));
							
							$('#ns1blankspaceSubscriptionsColumn2').button(
							{
								label: "Add"
							})
							.click(function()
							{
								if ($(ns1blankspace.xhtml.container).attr('data-initiator') == 'ns1blankspaceSubscriptionsColumn2')
								{
									$(ns1blankspace.xhtml.container).slideUp(500);
									$(ns1blankspace.xhtml.container).attr('data-initiator', '');
								}
								else
								{
									ns1blankspaceMasterOptionsSetPosition({xhtmlElementID: 'ns1blankspaceSubscriptionsColumn2', leftOffset: -50, rightOffset: -280});
									$.extend(true, aParam, {step: 2});
									ns1blankspace.developer.space.subscriptions(aParam);
								}	
							});

							var aHTML = [];
									
							aHTML.push('<table id="ns1blankspaceSpaceSubscriptions" class="ns1blankspaceContainer">');

							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<tr><td class="ns1blankspaceNothing">No subscriptions.</td></tr>');
							}

							$(oResponse.data.rows).each(function()
							{

								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceSpaceSubscriptions_Title-' + this.id + '" class="ns1blankspaceMainRow ns1blankspaceMainRowSelect"' +
														' title="">' +
														this.membershiptext + '</td>');

								aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceMainRow">');
								aHTML.push('<span id="ns1blankspaceSpaceSubscriptions_remove-' + this.id + '" class="ns1blankspacenRowRemove"></span>');
								aHTML.push('</td>');	

								aHTML.push('</tr>');
							});
						
							aHTML.push('</table>');
								
							$('#ns1blankspaceSubscriptionsColumn1').html(aHTML.join(''));

							$('#ns1blankspaceSpaceSubscriptions > td.ns1blankspacenRowRemove').button(
							{
								text: false,
							 	icons: {primary: "ui-icon-close"}
							})
							.click(function()
							{
								aParam.step = 4;
								aParam.xhtmlElementID = this.id;
								ns1blankspace.developer.space.subscriptions(aParam)
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
								success: function(data) {ns1blankspace.developer.space.subscriptions(aParam, data)}
							});
						}
						else
						{
							$(ns1blankspace.xhtml.container).attr('data-initiator', 'ns1blankspaceSpaceSubscriptionsAdd')
							
							var aHTML = [];
							var h = -1;
							
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
								
								$('#s1blankspaceSpaceSubscriptionsSelect > td.ns1blankspaceRowSelect').click(function(event)
								{
									aParam.step = 3;
									aParam.xhtmlElementID = event.target.id;
									ns1blankspace.developer.space.subscriptions(aParam);
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
							url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SUBSCRIPTION_MANAGE'),
							data: sData,
							dataType: 'json',
							success: function(data){ns1blankspace.developer.space.subscriptions()}
						});
					}

					else if (iStep == 4)
					{
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SUBSCRIPTION_MANAGE'),
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
							success: function(data) {ns1blankspace.developer.space.users(aParam, data)}
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

	new:		function (aParam)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspace.developer.membership.init();
				},

	save:		{
					send:		function ()
								{
									if (giObjectContext != -1)
									{
										
									}	
									else
									{
										var iContactBusinessId = ''; 

										if ($('#ns1blankspaceMainFromContact').html() != '')
										{
											iContactBusinessId = $('#ns1blankspaceDetailsContactBusiness').attr('data-id');
											iContactPersonId = $('#ns1blankspaceDetailsContactPerson').attr('data-id');
										}

										if ($('#ns1blankspaceMainFromNew').html() != '' && (iContactBusinessId == '' || iContactPersonId == ''))
										{
											ns1blankspace.status.working();

											var sData = 'firstname=' + ns1blankspace.util.fs(($('#ns1blankspaceDetailsFirstName').val()) +
																'&surname=' + ns1blankspace.util.fs(($('#ns1blankspaceDetailsSurname').val()) +
																'&email=' + ns1blankspace.util.fs(($('#ns1blankspaceDetailsEmail').val()) +
																'&spacename=' + ns1blankspace.util.fs(($('#ns1blankspaceDetailsEnterpriseName').val());

											$.ajax(
											{
												type: 'POST',
												url: '/directory/ondemand/register.asp?method=REGISTER_SPACE',
												data: sData,
												dataType: 'text',
												success: function(data)
												{
													var aResponse = data.split('|');

													if (aResponse[0] == "OK")
													{
														ns1blankspace.status.message('Space created');

														if (aResponse.length > 3)	
														{
															ns1blankspace.objectContext = aResponse[3]
														}
														ns1blankspace.inputDetected = false;
														ns1blankspace.developer.space.search.send('-' + ns1blankspace.objectContext, {source: 1});
													}
													else
													{
														ns1blankspace.status.error(aResponse[1]);
													}
												}
											});
										}
									}
								}
				}				
}				