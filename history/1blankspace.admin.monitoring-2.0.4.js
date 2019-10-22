/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

if (ns1blankspace.admin === undefined) {ns1blankspace.admin = {}}

ns1blankspace.admin.monitoring = 
{
	data: 	{lab: (window.location.host.indexOf('lab.ibcom.biz') != -1), superUser: false},

	init: 	function (oParam)
				{
					var bShowHome = true;
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
					}

					ns1blankspace.app.reset();

					ns1blankspace.objectParentName = 'admin';
					ns1blankspace.objectName = 'monitoring';
					ns1blankspace.viewName = 'Monitoring';

					ns1blankspace.admin.monitoring.data.superUser = ns1blankspace.user.super;

					ns1blankspace.app.set(oParam);
				},

	home:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlNew').button({disabled: true});
					
					var aHTML = [];
								
					aHTML.push('<table>');

					aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

					aHTML.push('</table>');		
						
					aHTML.push('<table class="ns1blankspaceControl" style="padding-top:10px;">');
					
					aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
									'Summary</td></tr>');

					aHTML.push('</table>');		
						
					aHTML.push('<table class="ns1blankspaceControl" style="padding-top:10px;">');
					
					aHTML.push('<tr><td id="ns1blankspaceControlServiceFaults" class="ns1blankspaceControl">' +
									'Service Faults</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlRequests" class="ns1blankspaceControl">' +
									'Requests</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlDebugLog" class="ns1blankspaceControl">' +
									'Debug Log</td></tr>');
				
					if (ns1blankspace.user.super)
					{
						aHTML.push('<tr><td id="ns1blankspaceControlNews" class="ns1blankspaceControl">' +
									'News</td></tr>');
					}					

					aHTML.push('</table>');		
					
					if (ns1blankspace.user.super)
					{
						aHTML.push('<table class="ns1blankspaceControl">');
						
						aHTML.push('<tr><td class="ns1blankspaceSub" style="font-size:0.875em; border-bottom-style:solid; border-width: 0px; border-color: #D0D0D0;">' +
										'STATE CHANNEL</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlStateChannelStatus" class="ns1blankspaceControl">' +
										'Status</td></tr>');

						aHTML.push('</table>');
					}	

					$('#ns1blankspaceControl').html(aHTML.join(''));	
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainServiceFaults" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainRequests" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDebugLog" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainNews" class="ns1blankspaceControlMain"></div>');

					aHTML.push('<div id="ns1blankspaceMainStateChannel" class="ns1blankspaceControlMain"></div>');

					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.admin.monitoring.summary();
					});

					$('#ns1blankspaceControlStateChannelStatus').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainStateChannel'});
						ns1blankspace.admin.monitoring.stateChannel.status();
					});

					$('#ns1blankspaceControlServiceFaults').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainServiceFaults'});
						ns1blankspace.admin.monitoring.serviceFaults.show();
					});

					$('#ns1blankspaceControlRequests').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainRequests'});
						ns1blankspace.admin.monitoring.requests.show();
					});

					$('#ns1blankspaceControlDebugLog').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDebugLog'});
						ns1blankspace.admin.monitoring.debugLog.show();
					});

					$('#ns1blankspaceControlNews').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainNews'});
						ns1blankspace.admin.monitoring.news.show();
					});

					ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
					ns1blankspace.admin.monitoring.summary();
				},

	summary:	function ()
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

					//aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Requests in last 24 hours</td></tr>' +
					//				'<tr><td id="ns1blankspaceSummaryRequests" class="ns1blankspaceSummary">' +
					//				ns1blankspace.xhtml.loadingSmall +
					//				'</td></tr>');

					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Service faults in last 24 hours' + 
									(ns1blankspace.admin.monitoring.data.superUser?' (All spaces)':'') + '</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryServiceFaults" class="ns1blankspaceSummary">' +
									ns1blankspace.xhtml.loadingSmall +
									'</td></tr>');

					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Debug logs in last 24 hours</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryDebugLog" class="ns1blankspaceSummary">' +
									ns1blankspace.xhtml.loadingSmall +
									'</td></tr>');

					if (ns1blankspace.user.super)
					{
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">News sent in last 24 hours (All spaces)</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryNews" class="ns1blankspaceSummary">' +
									ns1blankspace.xhtml.loadingSmall +
									'</td></tr>');
					}	

					aHTML.push('</table>');

					$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceColumn2">');

					if (ns1blankspace.user.super)
					{		
						aHTML.push('<tr><td><span id="ns1blankspaceSuperUserDebugKey" class="ns1blankspaceAction">' +
											'</span></td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceSuperUserDebugKeyContainer" style="padding-bottom:6px;" class="ns1blankspaceSubNote"></td></tr>');

						aHTML.push('<tr><td><span id="ns1blankspaceSuperUserDebugToggle" class="ns1blankspaceAction">' +
											'</span></td></tr>');
					}

					aHTML.push('</table>')

					$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));

					$('#ns1blankspaceSuperUserDebugKey').button(
					{
						text: true,
						label: 'Get Debug Key',
					})
					.click(function()
					{
						ns1blankspace.admin.monitoring.debug.key(
						{
							xhtmlElementID: 'ns1blankspaceSuperUserDebugKeyContainer'
						});
					})
					.css('width', '100px');

					$('#ns1blankspaceSuperUserDebugToggle').button(
					{
						text: true,
						label: 'Enable Debug',
					})
					.click(function()
					{
						if (ns1blankspace.admin.monitoring.debug.data.enabled)
						{
							ns1blankspace.admin.monitoring.debug.toggle();
						}
						else
						{
							ns1blankspace.admin.monitoring.debug.key(
							{
								xhtmlElementID: 'ns1blankspaceSuperUserDebugKeyContainer',
								onComplete: ns1blankspace.admin.monitoring.debug.toggle
							});
						}	
					})
					.css('width', '100px');

					ns1blankspace.admin.monitoring.serviceFaults.count();
					//ns1blankspace.admin.monitoring.requests.count();
					ns1blankspace.admin.monitoring.debugLog.count();

					if (ns1blankspace.user.super)
					{
						ns1blankspace.admin.monitoring.news.count();
					}	
				},

	stateChannel:
				{
					status: 	function (oParam, oResponse)
								{
									if (oResponse === undefined)
									{
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('ADMIN_MODEL_DATA_AUDIT_SYNC_STATUS'),
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.admin.monitoring.stateChannel.status(oParam, data);
											}
										});		
									}
									else
									{
										var aHTML = [];

										aHTML.push('<table>');

										aHTML.push('<tr><td class="ns1blankspaceHeader">TO BE PROCESSED</td>' +
														'<td class="ns1blankspaceHeader"></td></tr>');

										aHTML.push('<tr><td class="ns1blankspaceRow">Count</td>' +
														'<td class="ns1blankspaceRow">' + oResponse["tobeprocesssed-count"] + '</td></tr>');

										aHTML.push('<tr><td class="ns1blankspaceRow">Source Minimum Date (lag)</td>' +
														'<td class="ns1blankspaceRow">' + oResponse["tobeprocesssed-sourceminimumdate"] + '</td></tr>');

										aHTML.push('</table>');	

										$('#ns1blankspaceMainStateChannel').html(aHTML.join(''))	

										//{"status": "OK","notes": "COMPLETED","xhtmlcontext": "","tobeprocesssed-count": "136401","tobeprocesssed-minimumdate": "9 Feb 2014 22:45:53","tobeprocesssed-sourceminimumdate": "4 Feb 2014 22:29:33","tobeprocesssed-maximumdate": "9 Feb 2014 22:46:05","tobeprocesssed-sourcemaximumdate": "9 Feb 2014 22:36:14","processsed-count": "124717","processsed-maximumdate": "9 Feb 2014 22:46:05","processsed-sourcemaximumdate": "9 Feb 2014 22:42:34","processsed-last24h-count": "37502","processsed-last24h-maximumdate": "9 Feb 2014 22:46:05","processsed-last24h-sourcemaximumdate": "9 Feb 2014 22:42:34"}
									}	
								}
				}
}				

ns1blankspace.admin.monitoring.serviceFaults =
{
	data: 	{searchText: undefined},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.admin.monitoring.serviceFaults.show(oParam)
				},

	count: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'ADMIN_SERVICE_FAULT_SEARCH';
						oSearch.addField('id');
						oSearch.addFilter('createddate', 'GREATER_THAN_OR_EQUAL_TO', 'hour', '-24', '');
						oSearch.addSummaryField('count(id) count');
						oSearch.addCustomOption('allspaces', (ns1blankspace.user.super?'Y':'N'));
						oSearch.rows = 1;
						oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.serviceFaults.count(oParam, data)})	
					}
					else
					{
						$('#ns1blankspaceSummaryServiceFaults').html(oResponse.summary.count);
					}	
				},	

	show:		function (oParam, oResponse)
				{
					var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
					var sSearchText;

					if (oSearchText.exists)
					{
						sSearchText = oSearchText.value;
						ns1blankspace.admin.monitoring.serviceFaults.data.searchText = sSearchText;
					}
					else
					{	
						sSearchText = ns1blankspace.admin.monitoring.serviceFaults.data.searchText;
					}	

					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceAdminMonitoringServiceFaultsColumn1"></td>' +
										'<td id="ns1blankspaceAdminMonitoringServiceFaultsColumn2" style="width:115px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainServiceFaults').html(aHTML.join(''));

						$('#ns1blankspaceAdminMonitoringServiceFaultsColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.admin.monitoring.serviceFaults.data.details = [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'ADMIN_SERVICE_FAULT_SEARCH';
						
						if (ns1blankspace.user.super)
						{
							oSearch.addField('description,method,page,parameters,site,sitetext,space,spacetext,createddate,details');
						}
						else
						{
							oSearch.addField('description,method,parameters,site,sitetext,createddate');
						}	

						oSearch.addCustomOption('allspaces', (ns1blankspace.user.super?'Y':'N'));

						if (sSearchText != undefined)
						{
							oSearch.addBracket('(');
							oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('method', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('spacetext', 'TEXT_IS_LIKE', sSearchText);
							
							if (sSearchText != '')
							{	
								if (!_.isNaN(_.toNumber(sSearchText)))
								{
									oSearch.addOperator('or');
									oSearch.addFilter('id', 'EQUAL_TO', sSearchText);
								}

								var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
								if (oSearchDate.isValid())
								{
									oSearch.addOperator('or');
									oSearch.addFilter('createddate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
								}
							}

							oSearch.addBracket(')');
						}

						oSearch.rows = 100;
						oSearch.sort('createddate', 'desc');
						oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.serviceFaults.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceAdminMonitoringServiceFaults">' +
											'<tr><td class="ns1blankspaceSub">No service faults.</td></tr></table>');

							$('#ns1blankspaceAdminMonitoringServiceFaultsColumn1').html(aHTML.join(''));
						}
						else
						{
							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceAdminMonitoringServiceFaults" class="ns1blankspace" style="font-size:0.875em;">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption" style="width:40px;">ID</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:70px;">When</td>' +
										'<td class="ns1blankspaceHeaderCaption">Description</td>')

							if (ns1blankspace.user.super)
							{
								aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:50px;">Space</td>')
							}

							aHTML.push('</tr>');

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.admin.monitoring.serviceFaults.row(this));
							});
							
							aHTML.push('</table>');
						}

						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceAdminMonitoringServiceFaultsColumn1',
							xhtmlContext: 'AdminMonitoringServiceFaults',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.admin.monitoring.serviceFaults.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.admin.monitoring.serviceFaults.bind
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:14px;">' +
												'<input id="ns1blankspaceAdminMonitoringServiceFaultsSearchText" class="ns1blankspaceText" style="width:130px;">' +
												'</td></tr>');
																			
						aHTML.push('<tr><td style="padding-top:0px;">' +
										'<span id="ns1blankspaceAdminMonitoringServiceFaultsSearch" class="ns1blankspaceAction">Search</span>');

						if (sSearchText != undefined)
						{	
							aHTML.push(' <span id="ns1blankspaceAdminMonitoringServiceFaultsSearchClear" class="ns1blankspaceAction">Clear</span>');
						}

						aHTML.push('</td></tr>');

						if (ns1blankspace.user.super)
						{
							aHTML.push('<tr><td style="padding-top:12px;" class="ns1blankspaceSummaryCaption">All spaces</td></tr>');
						}

						aHTML.push('</table>');

						if ($('#ns1blankspaceAdminMonitoringServiceFaultsColumn2 table').length == 0)
						{
							$('#ns1blankspaceAdminMonitoringServiceFaultsColumn2').html(aHTML.join(''));
						}
						else
						{
							$('#ns1blankspaceAdminMonitoringServiceFaultsColumn2 table').before(aHTML.join(''));
						}

						$('#ns1blankspaceAdminMonitoringServiceFaultsSearch').button(
						{
							label: 'Search'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringServiceFaultsSearchText').val());
							ns1blankspace.admin.monitoring.serviceFaults.show(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspaceAdminMonitoringServiceFaultsSearchClear').button(
						{
							label: 'Clear'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', undefined);
							ns1blankspace.admin.monitoring.serviceFaults.show(oParam);
						})
						.css('width', '57px');

						$('#ns1blankspaceAdminMonitoringServiceFaultsSearchText').keyup(function(e)
						{
							if (e.which === 13)
					    	{
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringServiceFaultsSearchText').val())
					    		ns1blankspace.admin.monitoring.serviceFaults.show(oParam);
					    	}
						});				

						$('#ns1blankspaceAdminMonitoringServiceFaultsSearchText').val(sSearchText);
					}
				},	

	row: 		function (oRow)	
				{
					var aHTML = [];

					ns1blankspace.admin.monitoring.serviceFaults.data.details.push(oRow);

					aHTML.push('<tr id="ns1blankspaceAdminMonitoringServiceFaults_container-' + oRow["id"] + '">');

					if (ns1blankspace.user.super)
					{
						aHTML.push('<td id="ns1blankspaceAdminMonitoringServiceFaults_id-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
										oRow["id"] + '</td>');
					}
					else
					{
						aHTML.push('<td id="ns1blankspaceAdminMonitoringServiceFaults_id-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["id"] + '</td>');
					}	

					aHTML.push('<td id="ns1blankspaceAdminMonitoringServiceFaults_space-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["createddate"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringServiceFaults_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["description"] + '</td>');

					if (ns1blankspace.user.super)
					{
						aHTML.push('<td id="ns1blankspaceAdminMonitoringServiceFaults_space-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["spacetext"] + '</td>');
					}	

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function ()
				{
					if (ns1blankspace.user.super)
					{
						$('#ns1blankspaceAdminMonitoringServiceFaults .ns1blankspaceRowSelect').click(function()
						{
							ns1blankspace.admin.monitoring.serviceFaults.details({xhtmlElementID: this.id})
						});
					}			
				},

	details: 	
				function (oParam, oResponse)
				{
					var sXHTMLElementID;
					var sKey;

					if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
					{
						sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
						sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
					}

					if ($('#ns1blankspaceAdminMonitoringServiceFaults_container_details-' + sKey).length != 0)
					{
						$('#ns1blankspaceAdminMonitoringServiceFaults_container_details-' + sKey).remove();
					}
					else
					{
						if (oResponse == undefined)
						{
							ns1blankspace.status.message('Getting details');

							var oSearch = new AdvancedSearch();
							oSearch.method = 'ADMIN_SERVICE_FAULT_SEARCH';
							oSearch.addField('details');
							oSearch.addCustomOption('allspaces', (ns1blankspace.user.super?'Y':'N'));
							oSearch.addFilter('id', 'EQUAL_TO', sKey);
							oSearch.rows = 1;
							oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.serviceFaults.details(oParam, data)});
						}
						else
						{
							ns1blankspace.status.clear();
							
							var sHTML = 'No details';

							if (oResponse.status == 'OK')
							{
								var oDetail = $.grep(ns1blankspace.admin.monitoring.serviceFaults.data.details, function (a) {return a.id == sKey;})[0];

								if (oDetail != undefined)
								{
									oDetail.details = oResponse.data.rows[0].details;

									sHTML = (oDetail.details).formatXHTML();
					
									$('#ns1blankspaceAdminMonitoringServiceFaults_container-' + sKey).after('<tr id="ns1blankspaceAdminMonitoringServiceFaults_container_details-' + sKey + '">' +
									'<td colspan=4><div style="background-color:#F3F3F3; padding:8px; color:#444444; font-weight:100; font-size:0.75em; word-break: break-all;" class="ns1blankspaceSubNote"><pre>' + sHTML + '</pre></div></td></tr>');
								}
							}
						}
					}	
				}						
}

ns1blankspace.admin.monitoring.requests =
{
	data: 	{searchText: undefined},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.admin.monitoring.requests.show(oParam);
				},

	count: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'ADMIN_REQUEST_SEARCH';
						oSearch.addField('id');
						oSearch.addFilter('createddate', 'GREATER_THAN_OR_EQUAL_TO', 'hour', '-24', '');
						oSearch.addFilter('method', 'NOT_IN_LIST', (ns1blankspace.admin.monitoring.data.lab?986:'955,212,1075'));
						oSearch.addCustomOption('allspaces', (ns1blankspace.user.super?'Y':'N'));
						oSearch.addSummaryField('count(id) count');
						oSearch.rows = 1;
						oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.requests.count(oParam, data)})	
					}
					else
					{
						$('#ns1blankspaceSummaryRequests').html(oResponse.summary.count);
					}	
				},	
	
	show:		function (oParam, oResponse)
				{
					var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
					var sSearchText;

					if (oSearchText.exists)
					{
						sSearchText = oSearchText.value;
						ns1blankspace.admin.monitoring.requests.data.searchText = sSearchText;
					}
					else
					{	
						sSearchText = ns1blankspace.admin.monitoring.requests.data.searchText;
					}	

					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceAdminMonitoringRequestsColumn1"></td>' +
										'<td id="ns1blankspaceAdminMonitoringRequestsColumn2" style="width:115px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainRequests').html(aHTML.join(''));

						$('#ns1blankspaceAdminMonitoringRequestsColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.admin.monitoring.requests.data.details = [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'ADMIN_REQUEST_SEARCH';
						oSearch.addField('method,methodtext,postdata,querystring,returntext,sourcehost,version,createddate,createdusertext,modifieddate');
						oSearch.addCustomOption('allspaces', (ns1blankspace.user.super?'Y':'N'));
						oSearch.addFilter('method', 'NOT_IN_LIST', (ns1blankspace.admin.monitoring.data.lab?986:'955,212,1075'));

						if (sSearchText != undefined)
						{
							oSearch.addBracket('(');
							oSearch.addFilter('methodtext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							//oSearch.addFilter('postdata', 'TEXT_IS_LIKE', sSearchText);
							//oSearch.addOperator('or');
							oSearch.addFilter('sourcehost', 'TEXT_IS_LIKE', sSearchText);
							
							if (sSearchText != '')
							{	
								if (!_.isNaN(_.toNumber(sSearchText)))
								{
									oSearch.addOperator('or');
									oSearch.addFilter('id', 'EQUAL_TO', sSearchText);
								}

								var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
								if (oSearchDate.isValid())
								{
									oSearch.addOperator('or');
									oSearch.addFilter('createddate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
								}
							}

							oSearch.addBracket(')');
						}

						oSearch.rows = 100;
						oSearch.sort('createddate', 'desc');
						oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.requests.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceAdminMonitoringRequests">' +
											'<tr><td class="ns1blankspaceSub">No requests.</td></tr></table>');

							$('#ns1blankspaceAdminMonitoringRequestsColumn1').html(aHTML.join(''));
						}
						else
						{
							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceAdminMonitoringRequests" class="ns1blankspace" style="font-size:0.875em;">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption" style="width:65px;">When</td>' +
										'<td class="ns1blankspaceHeaderCaption">Method</td>' +
										'<td class="ns1blankspaceHeaderCaption">User</td>' +
										'<td class="ns1blankspaceHeaderCaption">Source</td>' +
										'</tr>');

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.admin.monitoring.requests.row(this));
							});
							
							aHTML.push('</table>');
						}

						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceAdminMonitoringRequestsColumn1',
							xhtmlContext: 'AdminMonitoringRequests',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.admin.monitoring.requests.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.admin.monitoring.requests.bind
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:14px;">' +
												'<input id="ns1blankspaceAdminMonitoringRequestsSearchText" class="ns1blankspaceText" style="width:130px;">' +
												'</td></tr>');
																			
						aHTML.push('<tr><td style="padding-top:0px;">' +
										'<span id="ns1blankspaceAdminMonitoringRequestsSearch" class="ns1blankspaceAction">Search</span>' +
										'');

						if (sSearchText != undefined)
						{	
							aHTML.push('' +
										' <span id="ns1blankspaceAdminMonitoringRequestsSearchClear" class="ns1blankspaceAction">Clear</span>' +
										'</td></tr>');
						}

						aHTML.push('</table>');

						if ($('#ns1blankspaceAdminMonitoringRequestsColumn2 table').length == 0)
						{
							$('#ns1blankspaceAdminMonitoringRequestsColumn2').html(aHTML.join(''));
						}
						else
						{
							$('#ns1blankspaceAdminMonitoringRequestsColumn2 table').before(aHTML.join(''));
						}

						$('#ns1blankspaceAdminMonitoringRequestsSearch').button(
						{
							label: 'Search'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringRequestsSearchText').val());
							ns1blankspace.admin.monitoring.requests.show(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspaceAdminMonitoringRequestsSearchClear').button(
						{
							label: 'Clear'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', undefined);
							ns1blankspace.admin.monitoring.requests.show(oParam);
						})
						.css('width', '57px');

						$('#ns1blankspaceAdminMonitoringRequestsSearchText').keyup(function(e)
						{
							if (e.which === 13)
					    	{
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringRequestsSearchText').val())
					    		ns1blankspace.admin.monitoring.requests.show(oParam);
					    	}
						});				

						$('#ns1blankspaceAdminMonitoringRequestsSearchText').val(sSearchText);
					}
				},	

	row: 		function (oRow)	
				{
					var aHTML = [];

					ns1blankspace.admin.monitoring.requests.data.details.push(oRow);

					aHTML.push('<tr id="ns1blankspaceAdminMonitoringRequests_container-' + oRow["id"] + '">');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringRequests_id-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
										oRow["createddate"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringRequests_space-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["methodtext"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringRequests_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["createdusertext"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringRequests_space-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["sourcehost"] + '</td>');

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function ()
				{
					$('#ns1blankspaceAdminMonitoringRequests .ns1blankspaceRowSelect').click(function()
					{
						ns1blankspace.admin.monitoring.requests.details({xhtmlElementID: this.id})
					});		
				},

	details: 	
				function (oParam)
				{
					var sXHTMLElementID;
					var sKey;

					if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
					{
						sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
						sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
					}

					if ($('#ns1blankspaceAdminMonitoringRequests_container_details-' + sKey).length != 0)
					{
						$('#ns1blankspaceAdminMonitoringRequests_container_details-' + sKey).remove();
					}
					else
					{
						var sHTML = 'No details';

						var oDetail = $.grep(ns1blankspace.admin.monitoring.requests.data.details, function (a) {return a.id == sKey;})[0];

						if (oDetail)
						{
							sHTML = '<div class="ns1blankspaceSummaryCaption">Query String:</div><div>' + oDetail.querystring + '</div>' +
										'<div class="ns1blankspaceSummaryCaption">Data:</div><div>' + oDetail.postdata + '</div>' +
										'<div class="ns1blankspaceSummaryCaption">Response:</div><div>' + oDetail.returntext + '</div>';
							
							$('#ns1blankspaceAdminMonitoringRequests_container-' + sKey).after('<tr id="ns1blankspaceAdminMonitoringRequests_container_details-' + sKey + '">' +
								'<td colspan=4><div style="background-color: #F3F3F3; padding:8px; color:#444444; font-weight:100; font-size:0.75em;">' + sHTML + '</div></td></tr>');	
						}
					}
				}						
}

ns1blankspace.admin.monitoring.debugLog =
{
	data: 	{searchText: undefined},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.admin.monitoring.debugLog.show(oParam);
				},

	count: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'ADMIN_DEBUG_LOG_SEARCH';
						oSearch.addField('id');
						oSearch.addFilter('createddate', 'GREATER_THAN_OR_EQUAL_TO', 'hour', '-24', '');
						oSearch.addSummaryField('count(id) count');
						oSearch.rows = 1;
						oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.debugLog.count(oParam, data)})	
					}
					else
					{
						$('#ns1blankspaceSummaryDebugLog').html(oResponse.summary.count);
					}	
				},	
	
	show:		function (oParam, oResponse)
				{
					var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
					var sSearchText;

					if (oSearchText.exists)
					{
						sSearchText = oSearchText.value;
						ns1blankspace.admin.monitoring.debugLog.data.searchText = sSearchText;
					}
					else
					{	
						sSearchText = ns1blankspace.admin.monitoring.debugLog.data.searchText;
					}	

					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceAdminMonitoringDebugLogColumn1"></td>' +
										'<td id="ns1blankspaceAdminMonitoringDebugLogColumn2" style="width:115px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainDebugLog').html(aHTML.join(''));

						$('#ns1blankspaceAdminMonitoringDebugLogColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.admin.monitoring.debugLog.data.details = [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'ADMIN_DEBUG_LOG_SEARCH';
						oSearch.addField('notes,data,site,sitetext,createddate,createdusertext,guid');

						if (sSearchText != undefined)
						{
							oSearch.addBracket('(');
							oSearch.addFilter('sitetext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('guid', 'TEXT_IS_LIKE', sSearchText);
							
							if (sSearchText != '')
							{	
								if (!_.isNaN(_.toNumber(sSearchText)))
								{
									oSearch.addOperator('or');
									oSearch.addFilter('id', 'EQUAL_TO', sSearchText);
								}

								var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
								if (oSearchDate.isValid())
								{
									oSearch.addOperator('or');
									oSearch.addFilter('createddate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
								}
							}

							oSearch.addBracket(')');
						}

						oSearch.rows = 100;
						oSearch.sort('createddate', 'desc');
						oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.debugLog.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceAdminMonitoringDebugLog">' +
											'<tr><td class="ns1blankspaceSub">No debug logs.</td></tr></table>');

							$('#ns1blankspaceAdminMonitoringDebugLogColumn1').html(aHTML.join(''));
						}
						else
						{
							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceAdminMonitoringDebugLog" class="ns1blankspace" style="font-size:0.875em;">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption" style="width:65px;">When</td>' +
										'<td class="ns1blankspaceHeaderCaption">Notes</td>' +
										'<td class="ns1blankspaceHeaderCaption">User</td>' +
										'<td class="ns1blankspaceHeaderCaption">Site</td>' +
										'</tr>');

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.admin.monitoring.debugLog.row(this));
							});
							
							aHTML.push('</table>');
						}

						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceAdminMonitoringDebugLogColumn1',
							xhtmlContext: 'AdminMonitoringDebugLog',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.admin.monitoring.debugLog.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.admin.monitoring.debugLog.bind
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:14px;">' +
												'<input id="ns1blankspaceAdminMonitoringDebugLogSearchText" class="ns1blankspaceText" style="width:130px;">' +
												'</td></tr>');
																			
						aHTML.push('<tr><td style="padding-top:0px;">' +
										'<span id="ns1blankspaceAdminMonitoringDebugLogSearch" class="ns1blankspaceAction">Search</span>' +
										'');

						if (sSearchText != undefined)
						{	
							aHTML.push('' +
										' <span id="ns1blankspaceAdminMonitoringDebugLogSearchClear" class="ns1blankspaceAction">Clear</span>' +
										'</td></tr>');
						}

						aHTML.push('</table>');

						if ($('#ns1blankspaceAdminMonitoringDebugLogColumn2 table').length == 0)
						{
							$('#ns1blankspaceAdminMonitoringDebugLogColumn2').html(aHTML.join(''));
						}
						else
						{
							$('#ns1blankspaceAdminMonitoringDebugLogColumn2 table').before(aHTML.join(''));
						}

						$('#ns1blankspaceAdminMonitoringDebugLogSearch').button(
						{
							label: 'Search'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringDebugLogSearchText').val());
							ns1blankspace.admin.monitoring.debugLog.show(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspaceAdminMonitoringDebugLogSearchClear').button(
						{
							label: 'Clear'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', '');
							ns1blankspace.admin.monitoring.debugLog.show(oParam);
						})
						.css('width', '57px');

						$('#ns1blankspaceAdminMonitoringDebugLogSearchText').keyup(function(e)
						{
							if (e.which === 13)
					    	{
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringDebugLogSearchText').val())
					    		ns1blankspace.admin.monitoring.debugLog.show(oParam);
					    	}
						});				

						$('#ns1blankspaceAdminMonitoringDebugLogSearchText').val(sSearchText);
					}
				},	

	row: 		function (oRow)	
				{
					var aHTML = [];

					ns1blankspace.admin.monitoring.debugLog.data.details.push(oRow);

					aHTML.push('<tr id="ns1blankspaceAdminMonitoringDebugLog_container-' + oRow["id"] + '">');

					aHTML.push('<td style="width:120px;" id="ns1blankspaceAdminMonitoringDebugLog_createddate-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
										oRow["createddate"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringDebugLog_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["notes"] + '</td>');

						aHTML.push('<td id="ns1blankspaceAdminMonitoringDebugLog_user-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["createdusertext"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringDebugLog_site-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["sitetext"] + '</td>');

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function ()
				{
					$('#ns1blankspaceAdminMonitoringDebugLog .ns1blankspaceRowSelect').click(function()
					{
						ns1blankspace.admin.monitoring.debugLog.details({xhtmlElementID: this.id})
					});		
				},

	details: 	
				function (oParam)
				{
					var sXHTMLElementID;
					var sKey;

					if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
					{
						sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
						sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
					}

					if ($('#ns1blankspaceAdminMonitoringDebugLog_container_details-' + sKey).length != 0)
					{
						$('#ns1blankspaceAdminMonitoringDebugLog_container_details-' + sKey).remove();
					}
					else
					{
						var sHTML = 'No details';

						var oDetail = $.grep(ns1blankspace.admin.monitoring.debugLog.data.details, function (a) {return a.id == sKey;})[0];

						if (oDetail)
						{
							sHTML = '<div class="ns1blankspaceSummaryCaption">Data:</div><div>' + (oDetail.data!=''?oDetail.data:'<i>No data</i>') + '</div>' +
										'<div class="ns1blankspaceSummaryCaption">GUID:</div><div>' + oDetail.guid + '</div>' +
										'<div class="ns1blankspaceSummaryCaption">Site:</div><div>' + oDetail.site + '</div>';
							
							$('#ns1blankspaceAdminMonitoringDebugLog_container-' + sKey).after('<tr id="ns1blankspaceAdminMonitoringDebugLog_container_details-' + sKey + '">' +
								'<td colspan=4><div style="background-color: #F3F3F3; padding:8px; color:#444444; font-weight:100; font-size:0.75em;">' + sHTML + '</div></td></tr>');	
						}
					}
				}						
}

ns1blankspace.admin.monitoring.news =
{
	data: 	{searchText: undefined},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.admin.monitoring.news.show(oParam);
				},

	count: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'ADMIN_NEWS_SCHEDULE_SEARCH';
						oSearch.addField('id');
						oSearch.addFilter('createddate', 'GREATER_THAN_OR_EQUAL_TO', 'hour', '-24', '');
						oSearch.addSummaryField('count(id) count');
						oSearch.rows = 1;
						oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.news.count(oParam, data)})	
					}
					else
					{
						if (oResponse.status == 'ER')
						{
							$('#ns1blankspaceSummaryNews').html(oResponse.error.errornotes)
						}
						else
						{
							$('#ns1blankspaceSummaryNews').html(oResponse.summary.count);
						}	
					}	
				},	
	
	show:		function (oParam, oResponse)
				{
					var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
					var sSearchText;

					if (oSearchText.exists)
					{
						sSearchText = oSearchText.value;
						ns1blankspace.admin.monitoring.news.data.searchText = sSearchText;
					}
					else
					{	
						sSearchText = ns1blankspace.admin.monitoring.news.data.searchText;
					}	

					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceAdminMonitoringNewsColumn1"></td>' +
										'<td id="ns1blankspaceAdminMonitoringNewsColumn2" style="width:115px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainNews').html(aHTML.join(''));

						$('#ns1blankspaceAdminMonitoringNewsColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.admin.monitoring.news.data.details = [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'ADMIN_NEWS_SCHEDULE_SEARCH';
						oSearch.addField('body,fromaccount,fromaccounttext,id,news,newstext,recipients,space,spacetext,subject');
	
						if (sSearchText != undefined)
						{
							oSearch.addBracket('(');
							oSearch.addFilter('subject', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('spacetext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('newstext', 'TEXT_IS_LIKE', sSearchText);
							
							if (sSearchText != '')
							{	
								if (!_.isNaN(_.toNumber(sSearchText)))
								{
									oSearch.addOperator('or');
									oSearch.addFilter('id', 'EQUAL_TO', sSearchText);
								}

								var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
								if (oSearchDate.isValid())
								{
									oSearch.addOperator('or');
									oSearch.addFilter('createddate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
								}
							}

							oSearch.addBracket(')');
						}

						oSearch.rows = 100;
						oSearch.sort('createddate', 'desc');
						oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.news.show(oParam, data)});
					}
					else
					{
						var aHTML = [];

						if (oResponse.status == 'ER')
						{
							aHTML.push('<table id="ns1blankspaceAdminMonitoringNews">' +
												'<tr><td class="ns1blankspaceSub">' + oResponse.error.errornotes + '</td></tr></table>');

							$('#ns1blankspaceAdminMonitoringNewsColumn1').html(aHTML.join(''));
						}
						else
						{
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<table id="ns1blankspaceAdminMonitoringNews">' +
												'<tr><td class="ns1blankspaceSub">No news sent.</td></tr></table>');

								$('#ns1blankspaceAdminMonitoringNewsColumn1').html(aHTML.join(''));
							}
							else
							{							
								var aHTML = [];

								aHTML.push('<table id="ns1blankspaceAdminMonitoringNews" class="ns1blankspace" style="font-size:0.875em;">' +
											'<tr class="ns1blankspaceHeaderCaption">' +
											'<td class="ns1blankspaceHeaderCaption" style="width:65px;">When</td>' +
											'<td class="ns1blankspaceHeaderCaption">News</td>' +
											'<td class="ns1blankspaceHeaderCaption">From Account</td>' +
											'<td class="ns1blankspaceHeaderCaption">Space</td>' +
											'</tr>');

								$(oResponse.data.rows).each(function() 
								{
									aHTML.push(ns1blankspace.admin.monitoring.news.row(this));
								});
								
								aHTML.push('</table>');
							}

							ns1blankspace.render.page.show(
							{
								type: 'JSON',
								xhtmlElementID: 'ns1blankspaceAdminMonitoringNewsColumn1',
								xhtmlContext: 'AdminMonitoringNews',
								xhtml: aHTML.join(''),
								showMore: (oResponse.morerows == "true"),
								more: oResponse.moreid,
								rows: 100,
								functionShowRow: ns1blankspace.admin.monitoring.news.row,
								functionOpen: undefined,
								functionOnNewPage: ns1blankspace.admin.monitoring.news.bind
							});

							var aHTML = [];

							aHTML.push('<table class="ns1blankspaceColumn2">');

							aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:14px;">' +
													'<input id="ns1blankspaceAdminMonitoringNewsSearchText" class="ns1blankspaceText" style="width:130px;">' +
													'</td></tr>');
																				
							aHTML.push('<tr><td style="padding-top:0px;">' +
											'<span id="ns1blankspaceAdminMonitoringNewsSearch" class="ns1blankspaceAction">Search</span>');

							if (sSearchText != undefined)
							{	
								aHTML.push(' <span id="ns1blankspaceAdminMonitoringNewsSearchClear" class="ns1blankspaceAction">Clear</span>');
							}

							aHTML.push('</td></tr>');

							aHTML.push('<tr><td style="padding-top:12px;" class="ns1blankspaceSummaryCaption">All spaces</td></tr>');

							aHTML.push('</table>');

							if ($('#ns1blankspaceAdminMonitoringNewsColumn2 table').length == 0)
							{
								$('#ns1blankspaceAdminMonitoringNewsColumn2').html(aHTML.join(''));
							}
							else
							{
								$('#ns1blankspaceAdminMonitoringNewsColumn2 table').before(aHTML.join(''));
							}

							$('#ns1blankspaceAdminMonitoringNewsSearch').button(
							{
								label: 'Search'
							})
							.click(function() 
							{
								oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringNewsSearchText').val());
								ns1blankspace.admin.monitoring.news.show(oParam);
							})
							.css('width', '65px');

							$('#ns1blankspaceAdminMonitoringNewsSearchClear').button(
							{
								label: 'Clear'
							})
							.click(function() 
							{
								oParam = ns1blankspace.util.setParam(oParam, 'searchText', undefined);
								ns1blankspace.admin.monitoring.news.show(oParam);
							})
							.css('width', '57px');

							$('#ns1blankspaceAdminMonitoringNewsSearchText').keyup(function(e)
							{
								if (e.which === 13)
						    	{
						    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringNewsSearchText').val())
						    		ns1blankspace.admin.monitoring.news.show(oParam);
						    	}
							});				

							$('#ns1blankspaceAdminMonitoringNewsSearchText').val(sSearchText);
						}	
					}
				},	

	row: 		function (oRow)	
				{
					var aHTML = [];

					ns1blankspace.admin.monitoring.news.data.details.push(oRow);

					aHTML.push('<tr id="ns1blankspaceAdminMonitoringNews_container-' + oRow["id"] + '">');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringNews_id-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
										oRow["createddate"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringNews_space-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["newstext"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringNews_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["fromaccounttext"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringNews_space-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["spacetext"] + '</td>');

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function ()
				{
					$('#ns1blankspaceAdminMonitoringNews .ns1blankspaceRowSelect').click(function()
					{
						ns1blankspace.admin.monitoring.news.details({xhtmlElementID: this.id})
					});		
				},

	details: 	
				function (oParam)
				{
					var sXHTMLElementID;
					var sKey;

					if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
					{
						sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
						sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
					}

					if ($('#ns1blankspaceAdminMonitoringNews_container_details-' + sKey).length != 0)
					{
						$('#ns1blankspaceAdminMonitoringNews_container_details-' + sKey).remove();
					}
					else
					{
						var sHTML = 'No details';

						var oDetail = $.grep(ns1blankspace.admin.monitoring.news.data.details, function (a) {return a.id == sKey;})[0];

						if (oDetail)
						{
							sHTML = '<div class="ns1blankspaceSummaryCaption">Subject:</div><div>' + oDetail.subject + '</div>' +
										'<div class="ns1blankspaceSummaryCaption">Message:</div><div>' + oDetail.body + '</div>' +
										'<div class="ns1blankspaceSummaryCaption">Recipients:</div><div>' + oDetail.recipients + '</div>';
							
							$('#ns1blankspaceAdminMonitoringNews_container-' + sKey).after('<tr id="ns1blankspaceAdminMonitoringNews_container_details-' + sKey + '">' +
								'<td colspan=4><div style="background-color: #F3F3F3; padding:8px; color:#444444; font-weight:100; font-size:0.75em;">' + sHTML + '</div></td></tr>');	
						}
					}
				}						
}

ns1blankspace.admin.monitoring.debug =
{
	data: 
	{
		enabled: false
	},

	show: function() {},

	toggle: function (oParam, oResponse)
	{
		var sKey = ns1blankspace.util.getParam(oParam, 'key').value;
		var oData = {}

		if (sKey != undefined)
		{
			oData.debugkey = sKey
		}
		else
		{
			oData.debugkey = ns1blankspace.admin.monitoring.debug.data.key
		}

		if (oResponse == undefined)
		{
			ns1blankspace.status.working();

			$.ajax(
			{
				type: 'POST',
				url: ns1blankspace.util.endpointURI('CORE_DEBUG_TOGGLE'),
				dataType: 'json',
				data: oData,
				success: function(data)
				{
					ns1blankspace.admin.monitoring.debug.toggle(oParam, data);
				}
			});	
		}
		else
		{
			if (oResponse.status == 'OK')
			{
				ns1blankspace.status.message('Debug ' + (oResponse.debugenabled == 'Y'?'Enabled':'Disabled'));
				ns1blankspace.admin.monitoring.debug.data.enabled = (oResponse.debugenabled == 'Y');

				$('#ns1blankspaceSuperUserDebugToggle').button(
				{
					text: true,
					label: (oResponse.debugenabled == 'Y'?'Disable':'Enable') + ' Debug',
				});
			}
			else
			{
				ns1blankspace.status.error(oResponse.error.errornotes)
			}
		}
	},

	key: function (oParam, oResponse)
	{
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

		if (oResponse == undefined)
		{
			ns1blankspace.status.working();

			$.ajax(
			{
				type: 'POST',
				url: ns1blankspace.util.endpointURI('CORE_DEBUG_GET_KEY'),
				dataType: 'json',
				success: function(data)
				{
					ns1blankspace.admin.monitoring.debug.key(oParam, data);
				}
			});	
		}
		else
		{
			if (oResponse.status == 'OK')
			{
				ns1blankspace.status.message('Key generated');

				if (sXHTMLElementID != undefined)
				{
					$('#' + sXHTMLElementID).html(oResponse.debugkey)
				}

				ns1blankspace.admin.monitoring.debug.data.key = oResponse.debugkey;

				if (sXHTMLElementID != undefined)
				{
					$('#' + sXHTMLElementID).html(ns1blankspace.admin.monitoring.debug.data.key)
				}

				ns1blankspace.util.onComplete(oParam);
			}
			else
			{
				ns1blankspace.status.error(oResponse.error.errornotes)
			}
		}
	}
}

