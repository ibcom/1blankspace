/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.connect = 
{
	data: 		{
					mode:
					{
						options:
						{
							user: 1,
							everyone: 2
						}
					},

					cryptoKeyReference: '1blankspace-connect-auth-key'
				},

	init: 		function (oParam)
				{
					if (oParam === undefined) {oParam = {}}

					var bInitialised = ns1blankspace.util.getParam(oParam, 'initialised', {"default": false}).value;

					ns1blankspace.app.reset();

					ns1blankspace.object = -8;
					ns1blankspace.objectName = 'connect';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Connections / URLs';

					if (ns1blankspace.connect.data.mode.value === undefined)
					{
						ns1blankspace.connect.data.mode.value = ns1blankspace.util.getParam(oParam, 'mode', {"default": 1}).value;
					}	
							
					oParam.bind = ns1blankspace.connect.bind;

					oParam.xhtml = '<table id="ns1blankspaceOptions" class="ns1blankspaceViewControlContainer">' +	
											'<tr class="ns1blankspaceOptions">' +
											'<td id="ns1blankspaceControlActionOptionsRemove" class="ns1blankspaceViewControl">' +
											'Delete' +
											'</td></tr>' +
											'<tr class="ns1blankspaceOptions">' +
											'<td id="ns1blankspaceControlActionOptionsRequest" class="ns1blankspaceViewControl">' +
											'Send Request' +
											'</td></tr>' +
											'</table>';

					if (!bInitialised)
					{	
						oParam = ns1blankspace.util.setParam(oParam, 'initialised', true);

						ns1blankspace.util.whenCan.execute(
						{
							now:
							{
								method: ns1blankspace.util.local.cache.search,
								param: {key: '1blankspace-connect-auth-key', persist: true, protect: true}
							},
							then:
							{
								comment: 'util.local.cache.search<>connect.init',
								method: ns1blankspace.connect.init,
								set: 'cryptoKey',
								param: oParam
							}
						});	
					}
					else
					{	
						var oCryptoKey = ns1blankspace.util.getParam(oParam, 'cryptoKey');

						if (oCryptoKey.exists)
						{	
							if (oCryptoKey.value) {ns1blankspace.util.protect.key.data[ns1blankspace.connect.data.cryptoKeyReference] = oCryptoKey.value;}
						}	

						ns1blankspace.app.set(oParam);
					}	
				},

	bind: 		function (oParam)
				{
					$('#ns1blankspaceControlActionOptionsRemove')
					.click(function() 
					{
						ns1blankspace.app.options.remove(oParam)
					});

					$('#ns1blankspaceControlActionOptionsRequest')
					.click(function() 
					{
						$(ns1blankspace.xhtml.container).hide();
						ns1blankspace.connect.url.send(oParam);
					});
				},			

	home: 		function (oParam, oResponse)
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
										'<td id="ns1blankspaceHomeAction" style="width:150px;"></td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');
						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceHomeActionProtectKey"></td></tr>');	
						aHTML.push('</table>');

						$('#ns1blankspaceHomeAction').html(aHTML.join(''));	

						var aHTML = [];
									
						aHTML.push('<table><tr><td><div id="ns1blankspaceViewFileLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControl-1" class="ns1blankspaceControl" style="padding-top:15px;">' +
										'Personal</td></tr>');			
								
						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControl-2" class="ns1blankspaceControl">' +
										'Everyone<br /><span class="ns1blankspaceSubNote">in this space</span>' +
										'</td></tr>');	

						aHTML.push('</table>');	
						
						$('#ns1blankspaceControl').html(aHTML.join(''));

						$('td.ns1blankspaceControl').click(function(event)
						{
							ns1blankspace.connect.data.mode.value = (this.id).split('-')[1];
							ns1blankspace.connect.home();
						});

						$('#ns1blankspaceControl-' + ns1blankspace.connect.data.mode.value).addClass("ns1blankspaceHighlight");

						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_URL_SEARCH';		
						oSearch.addField('description,private,public,title,type,typetext,url,urllogon');
						
						if (ns1blankspace.connect.data.mode.value == ns1blankspace.connect.data.mode.options.user)
						{
							oSearch.addFilter('private', 'EQUAL_TO', 'Y');
						}
						else
						{
							oSearch.addFilter('private', 'EQUAL_TO', 'N');
						}

						oSearch.rows = 30;
						oSearch.sort('description', 'desc');
						
						oSearch.getResults(function(data) {ns1blankspace.connect.home(oParam, data)});

					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">Click New to add a connection / URL.</td></tr>' +
											'</table>');
						}
						else
						{
							aHTML.push('<table>');
						
							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');

								aHTML.push('<td id="ns1blankspaceMostLikely_Title-' + this.id + '" class="ns1blankspaceMostLikely" style="width:200px;">' +
														this.title + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_URL-' + this.id + '" class="ns1blankspaceMostLikely">' +
														ns1blankspace.connect.url.asXHTML({title: 'Open', url: this.url}));

								aHTML.push('</td></tr>');
							});
							
							aHTML.push('</table>');			
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.connect.search.send(event.target.id, {source: 1});
						});

						ns1blankspace.connect.protect.init({xhtmlElementID: 'ns1blankspaceHomeActionProtectKey'});
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
										oSearch.method = 'CORE_URL_SEARCH';		
										oSearch.addField('description,private,public,title,type,typetext,url,urllogon');

										oSearch.addField(ns1blankspace.option.auditFields);

										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										
										oSearch.getResults(function(data) {ns1blankspace.connect.show(oParam, data)});
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
											oSearch.method = 'CORE_URL_SEARCH';		
											oSearch.addField('title,url');
											
											oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('url', 'TEXT_IS_LIKE', sSearchText);

											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.sort('title', 'desc');
											
											oSearch.getResults(function(data) {ns1blankspace.connect.search.process(oParam, data)});
										}
									};	
								},

					process:	function (oParam, oResponse)
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
										
										var sClass = '';

										$.each(oResponse.data.rows, function()
										{	
											iColumn = iColumn + 1;

											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">');
											}
											
											aHTML.push('<td class="ns1blankspaceSearch" id="ns1blankspaceSearch-' +
															this.id + '">' +
															this.title + 
															'</td>');

											aHTML.push('<td class="ns1blankspaceSearch" id="ns1blankspaceSearch-' +
															this.id + '">' +
															ns1blankspace.connect.url.asXHTML({title: this.url, url: this.url}) +
															'</td>');

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
											ns1blankspace.connect.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'title',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.connect.search.send
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

						aHTML.push('<tr><td id="ns1blankspaceControlLogon" class="ns1blankspaceControl">' +
										'Logon</td></tr>');
					}	
					
					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainLogon" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainResponse" class="ns1blankspaceControlMain"></div>');
							
					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.connect.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.connect.details();
					});

					$('#ns1blankspaceControlLogon').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainLogon'});
						ns1blankspace.connect.logon();
					});
				},

	show:		function (oParam, oResponse)
				{
					ns1blankspace.app.clean();
					ns1blankspace.connect.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this connection / URL.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
					
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.connect.init({id: ' + ns1blankspace.objectContext + ', mode: ' + ns1blankspace.connect.data.mode.value + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.connect.summary()'});

						ns1blankspace.util.onComplete(oParam);
					}	
				},	

	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this connection / URL</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:200px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');
						
						if (ns1blankspace.objectContextData.description != '')
						{
							aHTML.push('<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.description +
											'</td></tr>');
						}	

						if (ns1blankspace.objectContextData.url != '')
						{
							aHTML.push('<tr><td id="ns1blankspaceSummaryURL" class="ns1blankspaceSummary">' +
											ns1blankspace.connect.url.asXHTML() +
											'</td></tr>');

							if (ns1blankspace.objectContextData.urllogon != '')
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Username</td></tr>' +
												'<tr><td id="ns1blankspaceSummaryURLLogon" class="ns1blankspaceSummary">' +
												ns1blankspace.objectContextData.urllogon +
												'</td></tr>');
							
								aHTML.push('<tr><td style="padding-top:8px;">' +
												'<span id="ns1blankspaceConnectGetPassword" class="ns1blankspaceAction" style="font-size:0.75em;">Get Password</span>' +
												'</td></tr>');

								aHTML.push('<tr><td id="ns1blankspaceConnectPasswordShow" class="ns1blankspaceSubNote" style="padding-left: 4px; padding-top: 6px;"></td></tr>');
							}											
						}

						aHTML.push('</table>');								

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						$('#ns1blankspaceConnectGetPassword').button().click(function()
						{
							ns1blankspace.connect.password.get();
						});	
					}	
				},

	password: 	{
					get: 		function (oParam)
								{
									if (!ns1blankspace.util.getParam(oParam, 'urlpassword').exists)
									{
										$('#ns1blankspaceConnectPasswordShow').html(ns1blankspace.xhtml.loadingSmall);

										var oSearch = new AdvancedSearch();
										oSearch.method = 'CORE_URL_SEARCH';
										oSearch.addField('urlpassword');
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(oResponse)
										{
											oParam = ns1blankspace.util.setParam(oParam, 'urlpassword', '');

											if (oResponse.data.rows.length == 1)
											{
												oParam = ns1blankspace.util.setParam(oParam, 'urlpassword', oResponse.data.rows[0].urlpassword);	
											}
											
											if (oParam.urlpassword == '')
											{
												ns1blankspace.connect.password.show(oParam);
											}
											else
											{	
												ns1blankspace.connect.password.get(oParam);
											}										
										});
									}
									else
									{	
										ns1blankspace.util.whenCan.execute(
										{
											now:
											{
												method: ns1blankspace.util.protect.key.search,
												param:
												{
													cryptoKeyReference: ns1blankspace.connect.data.cryptoKeyReference,
													local: true,
													protect: true
												}
											},
											then:
											{
												comment: 'util.protect.key.search<>connect.password.show',
												method: ns1blankspace.connect.password.show,
												set: 'cryptoKey',
												param: oParam
											}	
										});
									}
								},

					show: 		function (oParam)
								{
									var oCryptoKey = ns1blankspace.util.getParam(oParam, 'cryptoKey');
									var oURLPassword = ns1blankspace.util.getParam(oParam, 'urlpassword');
									var bDecrypted = ns1blankspace.util.getParam(oParam, 'decrypted').value;

									if (oURLPassword.value == '')
									{
										$('#ns1blankspaceConnectPasswordShow').html('Not set');
									}
									else
									{
										if (oCryptoKey.exists && !bDecrypted)
										{
											oParam = ns1blankspace.util.setParam(oParam, 'decrypted', true);

											ns1blankspace.util.whenCan.execute(
											{
												now:
												{
													method: ns1blankspace.util.protect.decrypt,
													param:
													{
														cryptoKeyReference: ns1blankspace.connect.data.cryptoKeyReference,
														protectedData: oURLPassword.value
													}
												},

												then:
												{
													comment: 'util.protect.decrypt<>connect.password.show',
													method: ns1blankspace.connect.password.show,
													set: 'urlpassword',
													param: oParam
												}
											});	
										}	
										else
										{
											$('#ns1blankspaceConnectPasswordShow').html('<div id="ns1blankspaceConnectPassword">' + oURLPassword.value + '</div>');
											$('#ns1blankspaceConnectPassword').fadeOut(8000);
										}
									}
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
										'URL' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsURL" class="ns1blankspaceText">' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<textarea id="ns1blankspaceDetailsDescription" style="width: 100%; height:100px;" rows="5" cols="35" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');

						aHTML.push('</table>');					

						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceMain">');

						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Available to' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioPrivateY" name="radioPrivate" value="Y"/>Just Me' +
										'<br /><input type="radio" id="radioPrivateN" name="radioPrivate" value="N"/>All Users <span class="ns1blankspaceSubNote">(in this space)</span>' +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Available to external users?' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioPublic1" name="radioPublic" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioPublic2" name="radioPublic" value="N"/>No' +
										'</td></tr>');

						aHTML.push('</table>');					

						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.description);
							$('#ns1blankspaceDetailsURL').val(ns1blankspace.objectContextData.url);

							$('[name="radioPrivate"][value="' + ns1blankspace.objectContextData.private + '"]').attr('checked', true);
							$('[name="radioPublic"][value="' + ns1blankspace.objectContextData.public + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioPrivate"][value="Y"]').attr('checked', true);
							$('[name="radioPublic"][value="N"]').attr('checked', true);
						}
					}	
				},

	logon: 		function ()
				{
					var aHTML = [];

					if ($('#ns1blankspaceMainLogon').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainLogon').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceLogonColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceLogonColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');					
						
						$('#ns1blankspaceMainLogon').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Username' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceLogonUsername" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Password' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input type="password" id="ns1blankspaceLogonPassword" class="ns1blankspaceText">' +
										'</td></tr>');	

					
						aHTML.push('</table>');					

						$('#ns1blankspaceLogonColumn1').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceLogonUsername').val(ns1blankspace.objectContextData.urllogon);
						}
					}	
				},			

	save: 		{
					send:		function (oParam)
								{
									var sURLPassword = $('#ns1blankspaceLogonPassword') && $('#ns1blankspaceLogonPassword').val();

									var bURLPasswordExists = ns1blankspace.util.getParam(oParam, 'urlpassword').exists;

									if (bURLPasswordExists)
									{
										var sURLPassword = ns1blankspace.util.getParam(oParam, 'urlpassword').value;
									}	
									
									ns1blankspace.status.working();

									if (sURLPassword && ns1blankspace.util.protect.key.data[ns1blankspace.connect.data.cryptoKeyReference] && !bURLPasswordExists)
									{
										ns1blankspace.util.whenCan.execute(
										{
											now:
											{
												method: ns1blankspace.util.protect.encrypt,
												param:
												{
													cryptoKeyReference: ns1blankspace.connect.data.cryptoKeyReference,
													local: true,
													data: sURLPassword
												}
											},
											then:
											{
												comment: 'util.protect.encrypt<>connect.save.send',
												method: ns1blankspace.connect.save.send,
												set: 'urlpassword'
											}	
										});
									}
									else
									{	
										var oData = {}

										if (ns1blankspace.objectContext != -1)
										{
											oData.id = ns1blankspace.objectContext;
										} 
								
										if ($('#ns1blankspaceMainDetails').html() != '')
										{
											oData.title = $('#ns1blankspaceDetailsTitle').val();
											oData.description = $('#ns1blankspaceDetailsDescription').val();
											oData.url = $('#ns1blankspaceDetailsURL').val();
											oData.private = $('input[name="radioPrivate"]:checked').val();
											oData.public = $('input[name="radioPublic"]:checked').val();
										}

										if ($('#ns1blankspaceMainLogon').html() != '')
										{
											oData.urllogon = $('#ns1blankspaceLogonUsername').val();
											oData.urlpassword = sURLPassword;
										}

										if (!ns1blankspace.util.isEmpty(oData))
										{									
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('CORE_URL_MANAGE'),
												data: oData,
												dataType: 'json',
												success: function (data) {ns1blankspace.connect.save.process(data, oData)}
											});
											
										}
										else
										{
											ns1blankspace.status.message('Saved');
										}
									}		
								},

					process:	function (oResponse, oData)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');

										var bNew = (ns1blankspace.objectContext == -1)
										ns1blankspace.objectContext = oResponse.id;	
										ns1blankspace.inputDetected = false;

										ns1blankspace.connect.init(
										{
											id: ns1blankspace.objectContext
										});
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}
				},

	url: 		{
					match:   	/^(https?|ftp):\/\//,

					asXHTML:	function (oParam)
								{
									var bUseTitle = ns1blankspace.util.getParam(oParam, 'useTitle', {"default": false}).value;
									var sTitle = ns1blankspace.util.getParam(oParam, 'title').value;
									var sURL = ns1blankspace.util.getParam(oParam, 'url').value;

									if (ns1blankspace.objectContextData && sURL === undefined)
									{
										var sURL = ns1blankspace.objectContextData.url;
										var sTitle = (bUseTitle?ns1blankspace.objectContextData.title:sURL);
									}

									var sHTML = sTitle;
									
									if (sURL !== undefined && sURL !== '')
									{	
										sHTML = sURL;

										if (sHTML.toLowerCase().indexOf('http') == -1)
										{
											sHTML = 'http://' + sHTML;
										}

										sHTML = '<a href="' + sHTML + '" target="_blank">' + sTitle.replace(ns1blankspace.connect.url.match, '') + '</a>';
									}	
								
									return sHTML;
								},

					send: 		function (oParam, oResponse)
								{
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceMainResponse'}).value;

									if (ns1blankspace.objectContext.url == '')
									{
										ns1blankspace.status.error('No url set.');
									}
									else
									{	
										if (!oResponse)
										{
											if (sXHTMLElementID)
											{
												$('td.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');

												ns1blankspace.show({selector: '#ns1blankspaceMainResponse'});

												$('#' + sXHTMLElementID).html('<textarea class="ns1blankspaceConnectURLContainer" ' +
															'id="ns1blankspaceConnectURLContainer" style="width:100%; height:500px;"></textarea>' +
															'<div id="ns1blankspaceConnectResponseHeaders" class="ns1blankspaceNothing" style="margin-top:16px; margin-bottom:26px;"></div>');
											}	

											var oData =
											{
												url: ns1blankspace.objectContextData.url,
												headerall: 'Y'
											}

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('CORE_URL_GET'),
												data: oData,
												dataType: 'json',
												success: function (data)
												{
													ns1blankspace.connect.url.send(oParam, data)
												}
											});
										}
										else
										{
											if (sXHTMLElementID)
											{
												var aHeaders = [];

												$('#ns1blankspaceConnectURLContainer').val(oResponse.response);

												aHeaders.push('<table>');

												for (var key in oResponse)
										  		{
										     		if (key.indexOf('header_') !== -1)
										     		{
										     			aHeaders.push('<tr><td class="ns1blankspaceRow">' + (key).replace('header_', '') + '</td><td class="ns1blankspaceRow">' + oResponse[key] + '</td></tr>');
										     		}
										     	}

										     	aHeaders.push('</table>');

												$('#ns1blankspaceConnectResponseHeaders').html(aHeaders.join(''));
											}
											else
											{
												return ns1blankspace.util.whenCan.complete(oResponse, oParam)
											}
										}
									}
								}
				},

	protect: 	{
					init: 		function (oParam)
								{
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceHomeActionProtectKey'}).value;
									var bCryptoKeyExists = ns1blankspace.util.getParam(oParam, 'cryptoKey').exists;
									var sCryptoKey = ns1blankspace.util.getParam(oParam, 'cryptoKey').value;

									if (!bCryptoKeyExists)
									{
										ns1blankspace.util.whenCan.execute(
										{
											now:
											{
												method: ns1blankspace.util.local.cache.search,
												param: {key: '1blankspace-connect-auth-key', persist: true, protect: true}
											},
											then:
											{
												comment: 'util.local.cache.search<>connect.protect.init',
												method: ns1blankspace.connect.protect.init,
												set: 'cryptoKey',
												param: {}
											}
										});
									}
									else
									{	
										if (sCryptoKey)
										{
											ns1blankspace.util.protect.key.data['1blankspace-connect-auth-key'] = sCryptoKey;

											var aHTML = [];

											aHTML.push('<div class="ns1blankspaceSubNote">Protection key installed.</div>');

											aHTML.push('<div id="ns1blankspaceConnectProtectGet" class="ns1blankspaceAction" style="margin-top:10px; font-size:0.75em;">Get key</div>');

											$('#' + sXHTMLElementID).html(aHTML.join(''));

											$('#ns1blankspaceConnectProtectGet').button().click(function()
											{
												var aHTML = [];

												aHTML.push('<div class="ns1blankspaceSubNote" style="margin-top:10px;">' +
																'<textarea id="ns1blankspaceContectProtectKeyValue" style="width: 100%; height:100px;" rows="3" cols="35" class="ns1blankspaceTextMulti">' +
																'{{1blankspace-connect-auth-key}}' +
															 	'</textarea></div>');

												ns1blankspace.connect.protect.key.get(
												{
													xhtml: aHTML.join(''),
													xhtmlElementID: 'ns1blankspaceMostLikely'
												});
											});
										}
										else
										{
											var aHTML = [];

											aHTML.push('<div class="ns1blankspaceSubNote" style="font-weight: bold; margin-bottom: 8px;">PASSWORD ENCRYPTION</div>');
											aHTML.push('<div class="ns1blankspaceSubNote" style="margin-bottom: 8px;">If you plan to store passwords with your connections, it is highly recommended that you use an encryption key that only users within your space know.<br/ > <br />The key will be stored on this device and if you change to another device, you will need to install it there.</div>');
											aHTML.push('<div id="ns1blankspaceConnectProtectExisting" class="ns1blankspaceAction" style="margin-top:10px; font-size:0.75em;">I have existing key</div>');
											aHTML.push('<div id="ns1blankspaceConnectProtectCreate" class="ns1blankspaceAction" style="margin-top:10px; font-size:0.75em;">Create new key</div>');

											$('#' + sXHTMLElementID).html(aHTML.join(''));

											$('#ns1blankspaceConnectProtectExisting').button().click(function()
											{
												var aHTML = [];

												aHTML.push('<div class="ns1blankspaceSubNote">The key below will be stored on this device and all passwords you set on a connection / URL will be protected using it.</div>');

												aHTML.push('<div class="ns1blankspaceSubNote" style="margin-top:10px;">If this key is different to the key that was used to protect a password, you will not be able to get the password back.</div>');

												aHTML.push('<div class="ns1blankspaceSubNote" style="margin-top:10px;">Enter the key to be used:</div>');

												aHTML.push('<div class="ns1blankspaceSubNote" style="margin-top:10px;">' +
																'<textarea id="ns1blankspaceContectProtectKeyValue" style="width: 100%; height:100px;" rows="3" cols="35" class="ns1blankspaceTextMulti">' +
															 	'</textarea></div>');

												aHTML.push('<div id="ns1blankspaceConnectProtectInstall" class="ns1blankspaceAction" style="margin-top:10px; font-size:0.75em;">Install</div>');

												$('#ns1blankspaceMostLikely').html(aHTML.join(''));

												$('#ns1blankspaceConnectProtectInstall').button().click(function()
												{
													ns1blankspace.connect.protect.key.remove(oParam);

													ns1blankspace.util.whenCan.execute(
													{
														now:
														{
															method: ns1blankspace.util.local.cache.save,
															param:
															{
																key: '1blankspace-connect-auth-key',
																data: $('#ns1blankspaceContectProtectKeyValue').val(),
																persist: true
															}
														},
														then:
														{
															comment: 'util.local.cache.save<>connect.protect.init',
															method: ns1blankspace.connect.init
														}
													});
												});
											});	

											$('#ns1blankspaceConnectProtectCreate').button().click(function()
											{
												var aHTML = [];

												aHTML.push('<div class="ns1blankspaceSubNote">The key below has been stored on this device and all passwords you set on a connection / URL will be protected using it.</div>');

												aHTML.push('<div class="ns1blankspaceSubNote" style="margin-top:10px;">If you change the key, you will not be able to get the passwords back.</div>');

												aHTML.push('<div class="ns1blankspaceSubNote" style="margin-top:10px;">You should copy this key and keep it safe.</div>');

												aHTML.push('<div class="ns1blankspaceSubNote" style="margin-top:10px;">' +
																'<textarea style="width: 100%; height:100px;" rows="3" cols="35" class="ns1blankspaceTextMulti">' +
															 	'{{1blankspace-connect-auth-key}}</textarea></div>');

												var oParam =
												{
													xhtml: aHTML.join(''),
													xhtmlElementID: 'ns1blankspaceMostLikely'
												}

												ns1blankspace.connect.protect.key.create(oParam)

											})
											.css('width', '150px');
										}	
									}
								},

					key: 		{
									get: 		function (oParam)
												{
													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceHomeActionProtectKey'}).value;
													var sXHTML = ns1blankspace.util.getParam(oParam, 'xhtml', {"default": ''}).value;
													var bCryptoKeyExists = ns1blankspace.util.getParam(oParam, 'savedCryptoKey').exists;
													var sCryptoKey = ns1blankspace.util.getParam(oParam, 'savedCryptoKey').value;

													if (!bCryptoKeyExists)
													{	
														oParam.savedCryptoKey = '';

														ns1blankspace.util.whenCan.execute(
														{
															now:
															{
																method: ns1blankspace.util.local.cache.search,
																param: {key: '1blankspace-connect-auth-key', persist: true}
															},
															then:
															{
																comment: 'util.local.cache.search<>connect.protect.key.get',
																method: ns1blankspace.connect.protect.key.get,
																set: 'savedCryptoKey',
																param: oParam
															}
														});
													}
													else
													{
														$('#' + sXHTMLElementID).html(sXHTML.replace('{{1blankspace-connect-auth-key}}', sCryptoKey));
													}	

												},		

									create: 	function (oParam)
												{
													if (!oParam.connectCryptoKey)
													{
														if (ns1blankspace.connect.protect.key.value != undefined)
														{
															oParam.connectCryptoKey = ns1blankspace.connect.protect.key.value;
															ns1blankspace.connect.protect.key.create(oParam);
														}
														else
														{
															if (!oParam.create)
															{	
																oParam.create = true;
																ns1blankspace.util.whenCan.execute(
																{
																	now:
																	{
																		method: ns1blankspace.util.local.cache.search,
																		param: 
																		{
																			key: '1blankspace-connect-auth-key',
																			persist: true,
																			protect: true
																		}
																	},
																	then:
																	{
																		comment: 'util.local.cache.search<>connect.protect.key.create:true',
																		method: ns1blankspace.connect.protect.key.create,
																		set: 'connectCryptoKey',
																		param: oParam
																	}
																});
															}
															else
															{	
																oParam.create = false;
																ns1blankspace.util.whenCan.execute(
																{
																	now:
																	{
																		method: ns1blankspace.util.protect.key.create.single,
																		param: 
																		{
																			cryptoKeyReference: '1blankspace-connect-auth-key',
																			persist: true,
																			protect: true,
																			local: true
																		}
																	},
																	then:
																	{
																		comment: 'util.protect.key.create.single<>connect.protect.key.create:false',
																		method: ns1blankspace.connect.protect.key.create,
																		set: 'connectCryptoKey',
																		param: oParam
																	}
																});
															}
														}
													}
													else
													{
														ns1blankspace.connect.protect.key.value = oParam.key;
														$('#' + oParam.xhtmlElementID).html(oParam.xhtml.replace('{{1blankspace-connect-auth-key}}', oParam.connectCryptoKey));
													}	
												},

									remove: 	function (oParam)
												{
													ns1blankspace.connect.protect.key.value = undefined;
													ns1blankspace.util.local.cache.remove({key: '1blankspace-connect-auth-key', persist: true, protect: true})
												}			
								}								
				}								
}					
