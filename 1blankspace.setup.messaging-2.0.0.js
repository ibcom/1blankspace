/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.setup.messaging = 
{
	init: 		function ()
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 154;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'messaging';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Messaging';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.messaging.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
				},

	home: 		function (oResponse)
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
									
						aHTML.push('<table>');

						aHTML.push('<tr><td id="ns1blankspaceViewMessagingEmailLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');
								
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	

						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
						oSearch.addField('email');
						oSearch.addFilter('type', 'EQUAL_TO', 5);
						oSearch.rows = 50;
						oSearch.sort('email', 'asc');
						oSearch.getResults(ns1blankspace.setup.messaging.home);
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">Click New to create an IMAP messaging account.</td></tr>' +
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
							ns1blankspace.setup.messaging.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:			
								function (sXHTMLElementId, iSource, sSearchText, sSearchContext)
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
										oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
										oSearch.addField('email,type,typetext,authtype,authtypetext,accountname,server,sslport,title,user,usertext');
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(data) {ns1blankspace.setup.messaging.show(data)});
									
									}
									else
									{
										var iMinimumLength = 3;
										var iMaximumColumns = 1;
										
										if (sSearchText == undefined)
										{
											sSearchText = $('#ins1blankspaceViewControlSearch').val();
										}	
										
										if (iSource == ns1blankspace.data.searchSource.browse)
										{
											iMinimumLength = 1;
											iMaximumColumns = 4;
											sSearchText = aSearch[1];
											if (sSearchText == '#') {sSearchText = '[0-9]'}
											sElementId = 'ns1blankspace.ViewControlBrowse';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{	
											ns1blankspace.container.position(sElementId);
											ns1blankspace.search.start(sElementId);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
											oSearch.addField('email');
											oSearch.addFilter('type', 'EQUAL_TO', 5);

											if (iSource == ns1blankspace.data.searchSource.browse)
											{
												oSearch.addFilter('email', 'STRING_STARTS_WITH', sSearchText);
											}
											else
											{	
												oSearch.addFilter('email', 'STRING_IS_LIKE', sSearchText);
											}	
											
											oSearch.getResults(ns1blankspace.setup.messaging.search.process);
											
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
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.setup.messaging.search.send(event.target.id, {source: 1});
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
					
					aHTML.push('</table>';					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControl"></div>');
							
					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.setup.messaging.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.setup.messaging.details();
					});
				},

	show:		function (oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.setup.messaging.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this messaging IMAP account.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
					
						var sContext = ns1blankspace.objectContextData.email;
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
							newDestination: 'ns1blankspace.setup.messaging.init({showHome: false});ns1blankspace.setup.messaging.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.object({functionDefault: 'ns1blankspace.setup.messaging.summary()'});
					}	
				},	
		
	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this messaging IMAP account.</td></tr></table>');
								
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
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Email</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryEmail" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.email +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Server</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryServer" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.server +
										'</td></tr>');			
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainSummaryColumn1').html(aHTML.join(''));
					}	
				},

	details:	function ns1blankspaceSetupMessagingDetails()
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
										'User' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceDetailsUser" class="ns1blankspaceMainSelect"' +
											' data-method="SETUP_USER_SEARCH"' +
											' data-columns="username">' +
										'</td></tr>');			

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Email' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsEmail" class="ns1blankspaceText">' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Account Name' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsAccountName" class="ns1blankspaceText">' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Account Password' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsAccountPassword" class="ns1blankspaceText" type="password">' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Server' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsServer" class="ns1blankspaceText">' +
										'</td></tr>');	
														
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainDetailsColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">';
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Type' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input type="radio" id="radioType5" name="radioType" value="5"/>IMAP' +
										'</td></tr>');
	
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainDetailsColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsUser').val(ns1blankspace.objectContextData.usertext);
							$('#ns1blankspaceDetailsUser').attr('data-id', ns1blankspace.objectContextData.user);
							$('#ns1blankspaceDetailsEmail').val(ns1blankspace.objectContextData.email);
							$('[name="radioType"][value="' + ns1blankspace.objectContextData.type + '"]').attr('checked', true);
							$('#ns1blankspaceDetailsAccountName').val(ns1blankspace.objectContextData.accountname);
							$('#ns1blankspaceDetailsServer').val(ns1blankspace.objectContextData.server);
						}
						else
						{
							$('[name="radioType"][value="5"]').attr('checked', true);
						}
					}	
				},

	new:		function ()
				{
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.setup.messaging.layput();
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					$('#ns1blankspaceViewportControlAction').button({disabled: false});
					$('#ns1blankspaceViewportControlActionOptions').button({disabled: true});
					ns1blankspace.setup.messaging.details();	
				},

	save: 		{
					send:		function ns1blankspaceSetupMessagingSave()
								{
									var sData = '_=1';
									
									if (ns1blankspace.objectContext != -1)
									{
										sParam += '&id=' + ns1blankspace.objectContext	
									}	
									
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&user=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsUser').attr("data-id"));
										sData += '&email=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsEmail').val());
										sData += '&title=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsEmail').val());
										sData += '&type=' + ns1blankspace.util.fs($('input[name="radioType"]:checked').val());
										sData += '&accountname=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsAccountName').val());
										sData += '&server=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsServer').val());
										sData += '&cachetype=1';
										sData += '&sslport=993';
										sData += '&authtype=0';
										
										if ($('#ns1blankspaceDetailsAccountPassword').val() != '')
										{
											sData += '&accountpassword=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsAccountPassword').val());
										}
									};

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('SETUP_MESSAGING_ACCOUNT_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function()
										{
												ns1blankspace.status.message('Saved');
												ns1blankspace.setup.messaging.home();
										}
									});		
								}
				}
}								

