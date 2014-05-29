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
					}
				},

	init: 		function (oParam)
				{
					if (oParam === undefined) {oParam = {}}

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
							
					ns1blankspace.app.set(oParam);
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
						ns1blankspace.connect.send(oParam);
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

						aHTML.push('</table>');

						$('#ns1blankspaceHomeAction').html(aHTML.join(''));	

						var aHTML = [];
									
						aHTML.push('<table><tr><td><div id="ns1blankspaceViewFileLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControl-1" class="ns1blankspaceControl" style="padding-top:15px;">' +
										'Personal</td></tr>');			
								
						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControl-2" class="ns1blankspaceControl">' +
										'Everyone</td></tr>');	

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
							oSearch.addFilter('public', 'EQUAL_TO', 'Y');
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

								aHTML.push('<td id="ns1blankspaceMostLikely_Title-' + this.id + '" class="ns1blankspaceMostLikely" style="width:100px;">' +
														this.title + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_URL-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
														ns1blankspace.connect.url.asXHTML({title: this.url, url: this.url})  + '</td>');
									
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');			
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.connect.search.send(event.target.id, {source: 1});
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
											
											oSearch.getResults(function(data) {ns1blankspace.connect.search.show(oParam, data)});
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
															this.url + '</td>');

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
					}	
					
					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
							
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
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:100px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));

						aHTML.push('<table class="ns1blankspace">');
						
						if (ns1blankspace.objectContextData.title != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Title</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryTitle" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.title +
											'</td></tr>');

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">URL</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryURL" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.url +
											'</td></tr>');	

							if (ns1blankspace.objectContextData.urllogon != '')
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Logon / Username</td></tr>' +
												'<tr><td id="ns1blankspaceSummaryURLLogon" class="ns1blankspaceSummary">' +
												ns1blankspace.objectContextData.urllogon +
												'</td></tr>');
							}		

							if (ns1blankspace.objectContextData.description != '')
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
												'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
												ns1blankspace.objectContextData.description +
												'</td></tr>');
							}											
						}

						aHTML.push('</table>');								

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
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
										'Access within this space by' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioPrivateY" name="radioPrivate" value="Y"/>Just Me' +
										'<br /><input type="radio" id="radioPrivateN" name="radioPrivate" value="N"/>All Users' +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Accessed by external users?' +
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

	save: 		{
					send:		function ()
								{
									ns1blankspace.status.working();
									
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

										sHTML = '<a href="' + sHTML + '" target="_blank">' + sTitle + '</a>';
									}	
								
									return sHTML;
								}
				}						
}					
