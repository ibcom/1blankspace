/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 * http://mydigitalstructure.com/gettingstarted_messaging_email_caching
 */
 
ns1blankspace.setup.messaging = 
{
	data: 		{
					verificationText: {1: 'Not Verified', 2: 'Suspended', 3: 'Verified'}
				},

	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.app.reset();

					ns1blankspace.object = 154;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'messaging';
					ns1blankspace.viewName = 'Messaging';
					ns1blankspace.objectMethod = 'SETUP_MESSAGING_ACCOUNT';
					
					ns1blankspace.app.set(oParam);
				},

	home: 		function (oParam, oResponse)
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

						aHTML.push('<tr><td><div id="ns1blankspaceViewMessagingEmailLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
								
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	

						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
						oSearch.addField('email,usertext,verification');
						oSearch.addFilter('type', 'EQUAL_TO', 5);
						oSearch.rows = 50;
						oSearch.sort('email', 'asc');
						oSearch.getResults(function (data) {ns1blankspace.setup.messaging.home(oParam, data)});
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
														'" class="ns1blankspaceMostLikely" style="width:250px; padding-right:15px;">' +
														this.email +
														'</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_usertext-' + this.id + 
														'" class="ns1blankspaceSubNote" style="width:150px;">' +
														this.usertext +
														'</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_usertext-' + this.id + 
														'" class="ns1blankspaceSubNote">' +
														ns1blankspace.setup.messaging.data.verificationText[this.verification] +
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
										oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
										oSearch.addField('email,type,typetext,authtype,authtypetext,accountname,server,port,sslport,title,user,usertext,footer,smtpserver,smtpserver,smtpserverport,verification,verificationtext');
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(data) {ns1blankspace.setup.messaging.show(data)});
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
											sElementId = 'ns1blankspace.ViewControlBrowse';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{	
											ns1blankspace.search.start();
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
											oSearch.addField('email');
											oSearch.addFilter('type', 'EQUAL_TO', 5);

											if (iSource == ns1blankspace.data.searchSource.browse)
											{
												oSearch.addFilter('email', 'TEXT_STARTS_WITH', sSearchText);
											}
											else
											{	
												oSearch.addFilter('email', 'TEXT_IS_LIKE', sSearchText);
											}	
											
											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.getResults(ns1blankspace.setup.messaging.search.process);
										}
									};	
								},

					process:	function (oResponse)
								{
									var iColumn = 0;
									var	iMaximumColumns = 1;
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
											
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'-' + this.id + '">' +
															this.email + '</td>');
											
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
											ns1blankspace.setup.messaging.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'email',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.setup.messaging.search.send
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

						aHTML.push('</table>');	
						
						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlFooter" class="ns1blankspaceControl">' +
										'Footer</td></tr>');

						aHTML.push('</table>');	
						
						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlSharing" class="ns1blankspaceControl">' +
										'Sharing</td></tr>');
					}	
					
					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainFooter" class="ns1blankspaceControlMain"></div>');
							
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

					$('#ns1blankspaceControlFooter').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainFooter'});
						ns1blankspace.setup.messaging.footer();
					});
				},

	show:		function (oResponse)
				{
					ns1blankspace.app.clean();
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
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.setup.messaging.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.setup.messaging.summary()'});
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
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:230px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Email</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryEmail" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.email +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Incoming Server (IMAP)</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryServer" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.server +
										'</td></tr>');			
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						aHTML.push('<tr><td id="ns1blankspaceVerificationContainer" class="ns1blankspaceSummaryCaption">');

						if (ns1blankspace.objectContextData.verification == '2')
						{
							aHTML.push('SUSPENDED</td></tr><tr><td class="ns1blankspaceSubNote" style="padding-top:8px;">This messaging account has been suspended.</td></tr>')
						}
						
						if (ns1blankspace.objectContextData.verification == '3')
						{
							aHTML.push('VERIFIED</td></tr><tr><td class="ns1blankspaceSubNote" style="padding-top:8px;">This messaging account can<br />now send emails.</td></tr>')
						}
						
						if (ns1blankspace.objectContextData.verification == '1' || ns1blankspace.objectContextData.verification == undefined)
						{
							aHTML.push('NOT VERIFIED')
							aHTML.push('</td></tr>');
							aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-top:8px;">Send a request for verification to <a href="mailto:verify@ibcom.biz">verify@ibcom.biz</a>.</td></tr>');
						}		
						
						aHTML.push('</table>');								
						
						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));
					}	
				},

	details:	function ()
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
										'User' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceDetailsUser" class="ns1blankspaceSelect"' +
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
										'Incoming Server (IMAP)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsServer" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Incoming Port' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPort" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Incoming SSL Port' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsSSLPort" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSubNote">' +
										'If you leave incoming server, port or SSL port blank; defaults will be used.</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Outgoing Server (SMTP)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsSMTPServer" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Outgoing Port' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsSMTPPort" class="ns1blankspaceText">' +
										'</td></tr>');
		
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Type' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioType5" name="radioType" value="5"/>Email' +
										'</td></tr>');
	
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsUser').val(ns1blankspace.objectContextData.usertext);
							$('#ns1blankspaceDetailsUser').attr('data-id', ns1blankspace.objectContextData.user);
							$('#ns1blankspaceDetailsEmail').val(ns1blankspace.objectContextData.email);
							$('[name="radioType"][value="' + ns1blankspace.objectContextData.type + '"]').attr('checked', true);
							$('#ns1blankspaceDetailsAccountName').val(ns1blankspace.objectContextData.accountname);
							$('#ns1blankspaceDetailsServer').val(ns1blankspace.objectContextData.server);
							$('#ns1blankspaceDetailsPort').val(ns1blankspace.objectContextData.port);
							$('#ns1blankspaceDetailsSSLPort').val(ns1blankspace.objectContextData.sslport);
							$('#ns1blankspaceDetailsSMTPServer').val(ns1blankspace.objectContextData.smtpserver);
							$('#ns1blankspaceDetailsSMTPPort').val(ns1blankspace.objectContextData.smtpserverport);
						}
						else
						{
							$('[name="radioType"][value="5"]').attr('checked', true);
						}
					}	
				},

	footer:		function ()
				{
					var aHTML = [];

					if ($('#ns1blankspaceMainFooter').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainFooter').attr('data-loading', '');
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr><td class="ns1blankspaceTextMulti">' +
										'<textarea rows="50" cols="50" id="ns1blankspaceFooterText" class="ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');		
								
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainFooter').html(aHTML.join(''));
							
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceFooterText').val((ns1blankspace.objectContextData.footer).formatXHTML());
						}
					}	
				},

	save: 		{
					send:		function()
								{
									ns1blankspace.status.working();
									
									var sData = '_=1';
									
									if (ns1blankspace.objectContext != -1)
									{
										sData += '&id=' + ns1blankspace.objectContext	
									}	
									
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										var sServer = ns1blankspace.util.fs($('#ns1blankspaceDetailsServer').val());
										if (sServer == '') {sServer = 'imap.gmail.com'}

										var sSSLPort = $('#ns1blankspaceDetailsSSLPort').val();
										var sPort = $('#ns1blankspaceDetailsPort').val();
										if (sSSLPort == '' && sPort == '') {sSSLPort = '993'}	

										sData += '&user=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsUser').attr("data-id"));
										sData += '&email=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEmail').val());
										sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEmail').val());
										sData += '&address=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEmail').val());
										sData += '&type=' + ns1blankspace.util.fs($('input[name="radioType"]:checked').val());
										sData += '&accountname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsAccountName').val());
										sData += '&server=' + sServer;
										sData += '&cachetype=1';
										sData += '&sslport=' + sSSLPort;
										sData += '&port=' + sPort;
										sData += '&authtype=0';
										sData += '&smtpserver=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSMTPServer').val());
										sData += '&smtpserverport=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSMTPPort').val());
										
										if ($('#ns1blankspaceDetailsAccountPassword').val() != '')
										{
											sData += '&accountpassword=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsAccountPassword').val());
										}
									};

									if ($('#ns1blankspaceMainFooter').html() != '')
									{
										sData += '&footer=' + ns1blankspace.util.fs($('#ns1blankspaceFooterText').val());
									}	

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('SETUP_MESSAGING_ACCOUNT_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function()
										{
											ns1blankspace.inputDetected = false;
											ns1blankspace.status.message('Saved');
											ns1blankspace.setup.messaging.home();
										}
									});		
								}
				}
}								

