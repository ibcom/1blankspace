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

					aHTML.push('<tr><td><div style="background: url(/jscripts/images/1blankspace.icons.65-2.0.0.png) -130px 0px;" class="ns1blankspaceViewImageLarge"></div></td></tr>');

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

					aHTML.push('<tr><td id="ns1blankspaceControlBilling" class="ns1blankspaceControl">' +
									'Billing</td></tr>');
				
					if (ns1blankspace.user.super)
					{
						aHTML.push('<tr><td id="ns1blankspaceControlNews" class="ns1blankspaceControl">' +
									'News</td></tr>');
					}					

					aHTML.push('</table>');		
					
					if (ns1blankspace.user.super)
					{
						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td class="ns1blankspaceSub" style="font-size:0.875em; border-bottom-style:solid; ' +
										'border-width: 0px; border-color: #D0D0D0; padding-right: 0px;">SERVICES</td></tr>')
						
						aHTML.push('<tr><td id="ns1blankspaceControlInstances" class="ns1blankspaceControl">' +
										'Instances</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlInstancesLog" class="ns1blankspaceControl">' +
										'Log</td></tr>');

						aHTML.push('</table>');

					//	aHTML.push('<table class="ns1blankspaceControl">');

					//	aHTML.push('<tr><td id="ns1blankspaceControlStateChannelStatus" class="ns1blankspaceControl">' +
					//					'State Channel</td></tr>');

					//	aHTML.push('</table>');
					}	

					$('#ns1blankspaceControl').html(aHTML.join(''));	
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainServiceFaults" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainRequests" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDebugLog" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainBilling" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainNews" class="ns1blankspaceControlMain"></div>');

					aHTML.push('<div id="ns1blankspaceMainInstances" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainInstancesLog" class="ns1blankspaceControlMain"></div>');

					aHTML.push('<div id="ns1blankspaceMainStateChannel" class="ns1blankspaceControlMain"></div>');
					

					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.admin.monitoring.summary();
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

					$('#ns1blankspaceControlBilling').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainBilling'});
						ns1blankspace.admin.monitoring.billing.show();
					});

					$('#ns1blankspaceControlNews').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainNews'});
						ns1blankspace.admin.monitoring.news.show();
					});

					$('#ns1blankspaceControlInstances').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainInstances'});
						ns1blankspace.admin.monitoring.instances.services.show();
					});

					$('#ns1blankspaceControlInstancesLog').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainInstancesLog'});
						ns1blankspace.admin.monitoring.instances.log.show();
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

					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Service faults' + 
									(ns1blankspace.admin.monitoring.data.superUser?' (All spaces)':'') + '</td></tr>' +
									'<tr><td><div id="ns1blankspaceSummaryServiceFaults">' +
									ns1blankspace.xhtml.loadingSmall +
									'</div><div class="ns1blankspaceSubNote">in last 24 hours</div></td></tr>');

					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption" style="padding-top:16px;">Debug logs</td></tr>' +
									'<tr><td><div id="ns1blankspaceSummaryDebugLog">' +
									ns1blankspace.xhtml.loadingSmall +
									'</div><div class="ns1blankspaceSubNote">in last 24 hours</div></td></tr>');

					//aHTML.push('<tr><td class="ns1blankspaceSummaryCaption" style="padding-top:16px;">SMS messages in last 24 hours</td></tr>' +
					//				'<tr><td><div id="ns1blankspaceSummaryBillingSMS">' +
					//				ns1blankspace.xhtml.loadingSmall +
					//				'</div><div class="ns1blankspaceSubNote">in last 24 hours</div></td></tr>');

					if (ns1blankspace.user.super)
					{
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption" style="padding-top:16px;">News sent (All spaces)</td></tr>' +
									'<tr><td><div id="ns1blankspaceSummaryNews">' +
									ns1blankspace.xhtml.loadingSmall +
									'</div><div class="ns1blankspaceSubNote">in last 24 hours</div></td></tr>');
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
					//ns1blankspace.admin.monitoring.billing.count.sms();

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
							oSearch.addField('description,method,page,parameters,site,sitetext,space,spacetext,createddate');
						}
						else
						{
							oSearch.addField('method,parameters,site,sitetext,createddate');
						}	

						oSearch.addCustomOption('allspaces', (ns1blankspace.user.super?'Y':'N'));

						if (sSearchText != undefined)
						{
							oSearch.addBracket('(');

							if (ns1blankspace.user.super)
							{
								oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);
								oSearch.addOperator('or');
							}	
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
										'<td class="ns1blankspaceHeaderCaption" style="width:70px;">When</td>');

							if (ns1blankspace.user.super)
							{
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>' +
													'<td class="ns1blankspaceHeaderCaption" style="width:30px;">Instance</td>' +
													'<td class="ns1blankspaceHeaderCaption" style="width:50px;">Space</td>');
							}
							else
							{
								aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:50px;">Parameters</td>');
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

					var aInstance = _.split(oRow.details, 'Server Code=');

					if (aInstance.length != 1)
					{
						oRow.instance = _.split(aInstance[1], '&')[0];
					}
					else
					{
						aInstance = _.split(oRow.details, 'ServerCode&lt;/B&gt;&#39; =');
						oRow.instance = _.split(aInstance[1], ' (')[0];
					}

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

					if (ns1blankspace.user.super)
					{
						aHTML.push('<td id="ns1blankspaceAdminMonitoringServiceFaults_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["description"] + '</td>');

						aHTML.push('<td id="ns1blankspaceAdminMonitoringServiceFaults_instance-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["instance"] + '</td>');

						aHTML.push('<td id="ns1blankspaceAdminMonitoringServiceFaults_space-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["spacetext"] + '</td>');
					}
					else
					{
						aHTML.push('<td id="ns1blankspaceAdminMonitoringServiceFaults_parameters-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["parameters"] + '</td>');
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

									var aInstance = _.split(oDetail.details, 'Server Code=');

									if (aInstance.length != 1)
									{
										oDetail.instance = _.split(aInstance[1], '&')[0];
									}
									else
									{
										aInstance = _.split(oDetail.details, 'ServerCode&lt;/B&gt;&#39; =');
										oDetail.instance = _.split(aInstance[1], ' (')[0];
									}

									$('#ns1blankspaceAdminMonitoringServiceFaults_instance-' + sKey).html(oDetail.instance);

									sHTML = filterXSS((oDetail.details).formatXHTML());

									var sContainerHTML = 
										'<tr id="ns1blankspaceAdminMonitoringServiceFaults_container_details-' + sKey + '"><td colspan=5>' +
											'<div style="width:100%">';

									if (oDetail.method != '')
									{
										sContainerHTML = sContainerHTML +
											'<div style="font-weight:600; background-color:#F5F5F5; font-size:0.75em; padding:6px;">' + oDetail.method + '</div>' +
											'<div style="font-weight:300; background-color:#F5F5F5; font-size:0.65em; padding:6px; font-family: monospace;">' + oDetail.parameters + '</div>'
									}

									sContainerHTML = sContainerHTML +
												'<div style="font-weight:600; background-color:#F5F5F5; font-size:0.75em; padding:6px;">' + oDetail.instance + '</div>' +
												'<iframe name="ns1blankspaceAdminMonitoringServiceFaults_details" ' +
													'id="ns1blankspaceAdminMonitoringServiceFaults_details-' + sKey + '" frameborder="0" border="0" scrolling="auto" sandbox="allow-same-origin"' +
													' style="min-height:300px; width:100%; background-color:#F5F5F5;">' +
												'</iframe>' +
											'</div>' +

										'</td></tr>'

										$('#ns1blankspaceAdminMonitoringServiceFaults_container-' + sKey).after(sContainerHTML);

									while ($('#ns1blankspaceAdminMonitoringServiceFaults_details-' + sKey).length == 0) {}

									$('#ns1blankspaceAdminMonitoringServiceFaults_details-' + sKey).contents().find('html').html('<div style="font-size:0.75em; font-family: monospace;">' + sHTML + '</div>');
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

ns1blankspace.admin.monitoring.instances =
{
	data: {},

	information:
	{
		get: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('ADMIN_INSTANCE_INFORMATION_SEARCH'),
					dataType: 'json',
					success: function(data)
					{
						ns1blankspace.admin.monitoring.instances.information.get(oParam, data);
					}
				});
			}
			else
			{
				ns1blankspace.admin.monitoring.instances.data._information = oResponse.contents

				try
				{
					ns1blankspace.admin.monitoring.instances.data.information = JSON.parse(oResponse.contents)
				}
				catch(error)
				{
					ns1blankspace.status.error(error);
				}

				ns1blankspace.util.onComplete(oParam)			
			}
		},

		show: function (oParam)
		{
			var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

			if (sXHTMLElementID != undefined)
			{
				$('#' + sXHTMLElementID).html(ns1blankspace.admin.monitoring.instances.data.information.codereleasedate)
			}
		}
	},

	services:
	{
		data: {},

		get: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_ADMIN_SERVER_SEARCH';
				oSearch.addField('notes,space,spacetext,title,type,typetext,category,categorytext,reference,serviceinstanceid,lastrevieweddate,lastchangedate,managed');
				
				oSearch.rows = 9999;
				oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.instances.services.get(oParam, data)})		
			}
			else
			{
				ns1blankspace.admin.monitoring.instances.services.data = oResponse.data.rows
			}
		},

		show:	function (oParam, oResponse)
		{
			var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
			var sSearchText;

			if (oSearchText.exists)
			{
				sSearchText = oSearchText.value;
				ns1blankspace.admin.monitoring.instances.services.data.searchText = sSearchText;
			}
			else
			{	
				sSearchText = ns1blankspace.admin.monitoring.instances.services.data.searchText;
			}	

			if (oResponse == undefined)
			{	
				var aHTML = [];

				aHTML.push('<table class="ns1blankspaceContainer">' +
								'<tr class="ns1blankspaceContainer">' +
								'<td id="ns1blankspaceAdminMonitoringInstancesColumn1"></td>' +
								'<td id="ns1blankspaceAdminMonitoringInstancesColumn2" style="width:115px;"></td>' +
								'</tr>' +
								'</table>');				
				
				$('#ns1blankspaceMainInstances').html(aHTML.join(''));

				$('#ns1blankspaceAdminMonitoringInstancesColumn1').html(ns1blankspace.xhtml.loading);

				ns1blankspace.admin.monitoring.instances.services.data.details = [];

				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_ADMIN_SERVER_SEARCH';
				oSearch.addField('notes,space,spacetext,title,type,typetext,guid,modifieddate,managed,category,categorytext,reference,serviceinstanceid,lastreviewdate,lastchangedate');

				if (sSearchText != undefined)
				{
					oSearch.addBracket('(');
					oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addFilter('guid', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addBracket(')');
				}

				oSearch.rows = 9999;
				oSearch.sort('title', 'asc');
				oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.instances.services.show(oParam, data)});
			}
			else
			{
				var aHTML = [];
				
				if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<table id="ns1blankspaceAdminMonitoringInstances">' +
									'<tr><td class="ns1blankspaceSub">No instances.</td></tr></table>');

					$('#ns1blankspaceAdminMonitoringInstancesColumn1').html(aHTML.join(''));
				}
				else
				{
					var aHTML = [];

					aHTML.push('<table id="ns1blankspaceAdminMonitoringInstances" class="ns1blankspace" style="font-size:0.875em;">' +
								'<tr class="ns1blankspaceHeaderCaption">' +
								'<td class="ns1blankspaceHeaderCaption" style="width:65px;">Name</td>' +
								'<td class="ns1blankspaceHeaderCaption">Type</td>' +
								'<td class="ns1blankspaceHeaderCaption">Last Review</td>' +
								'<td class="ns1blankspaceHeaderCaption">Last Change</td>' +
								'<td class="ns1blankspaceHeaderCaption">Management</td>' +
								'<td class="ns1blankspaceHeaderCaption"></td>' +
								'</tr>');

					$(oResponse.data.rows).each(function() 
					{
						aHTML.push(ns1blankspace.admin.monitoring.instances.services.row(this));
					});
					
					aHTML.push('</table>');
				}

				ns1blankspace.render.page.show(
				{
					type: 'JSON',
					xhtmlElementID: 'ns1blankspaceAdminMonitoringInstancesColumn1',
					xhtmlContext: 'AdminMonitoringInstances',
					xhtml: aHTML.join(''),
					showMore: (oResponse.morerows == "true"),
					more: oResponse.moreid,
					rows: 100,
					functionShowRow: ns1blankspace.admin.monitoring.instances.services.row,
					functionOpen: undefined,
					functionOnNewPage: ns1blankspace.admin.monitoring.instances.services.bind
				});

				var aHTML = [];

				aHTML.push('<table class="ns1blankspaceColumn2">');

				aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:14px;">' +
										'<input id="ns1blankspaceAdminMonitoringInstancesSearchText" class="ns1blankspaceText" style="width:130px;">' +
										'</td></tr>');
																	
				aHTML.push('<tr><td style="padding-top:0px;">' +
								'<span id="ns1blankspaceAdminMonitoringInstancesSearch" class="ns1blankspaceAction">Search</span>' +
								'');

				if (sSearchText != undefined)
				{	
					aHTML.push('' +
								' <span id="ns1blankspaceAdminMonitoringInstancesSearchClear" class="ns1blankspaceAction">Clear</span>' +
								'</td></tr>');
				}

				aHTML.push('<tr><td style="padding-top:16px;">' +
										'<span id="ns1blankspaceAdminMontoringInstancesAdd" class="ns1blankspaceAction">Add</span>');

				aHTML.push('</table>');

				if ($('#ns1blankspaceAdminMonitoringInstancesColumn2 table').length == 0)
				{
					$('#ns1blankspaceAdminMonitoringInstancesColumn2').html(aHTML.join(''));
				}
				else
				{
					$('#ns1blankspaceAdminMonitoringInstancesColumn2 table').before(aHTML.join(''));
				}

				$('#ns1blankspaceAdminMonitoringInstancesSearch').button(
				{
					label: 'Search'
				})
				.click(function() 
				{
					oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringInstancesSearchText').val());
					ns1blankspace.admin.monitoring.instances.services.search.show(oParam);
				})
				.css('width', '65px');

				$('#ns1blankspaceAdminMonitoringInstancesSearchClear').button(
				{
					label: 'Clear'
				})
				.click(function() 
				{
					oParam = ns1blankspace.util.setParam(oParam, 'searchText', '');
					ns1blankspace.admin.monitoring.instances.services.show(oParam);
				})
				.css('width', '57px');

				$('#ns1blankspaceAdminMonitoringInstancesSearchText').keyup(function(e)
				{
					if (e.which === 13)
			    	{
			    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringInstancesSearchText').val())
			    		ns1blankspace.admin.monitoring.instances.services.show(oParam);
			    	}
				});				

				$('#ns1blankspaceAdminMonitoringInstancesSearchText').val(sSearchText);

				$('#ns1blankspaceAdminMontoringInstancesAdd').button(
				{
					label: "Add"
				})
				.click(function()
				{
					ns1blankspace.admin.monitoring.instances.services.edit({xhtmlElementID: this.id})
				})
				.css('width', '57px');
			}
		},	

		row: function (oRow)	
		{
			var aHTML = [];

			ns1blankspace.admin.monitoring.instances.services.data.details.push(oRow);

			aHTML.push('<tr id="ns1blankspaceAdminMonitoringInstances_container-' + oRow["id"] + '">');

			aHTML.push('<td style="width:120px;" id="ns1blankspaceAdminMonitoringInstances_title-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
								oRow["title"] + '</td>');

			aHTML.push('<td id="ns1blankspaceAdminMonitoringInstances_typetext-' + oRow["id"] + '" class="ns1blankspaceRow">' +
								oRow["typetext"] + '</td>');

			aHTML.push('<td id="ns1blankspaceAdminMonitoringInstances_lastreviewdate-' + oRow["id"] + '" class="ns1blankspaceRow">' +
								oRow["lastreviewdate"] + '</td>');

			aHTML.push('<td id="ns1blankspaceAdminMonitoringInstances_lastchangedate-' + oRow["id"] + '" class="ns1blankspaceRow">' +
								oRow["lastchangedate"] + '</td>');

			aHTML.push('<td id="ns1blankspaceAdminMonitoringInstances_managed-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceSubNote">' +
								(oRow["managed"]=='N'?'Information only':'Used by the service to operate.') + '</td>');

			aHTML.push('<td style="width:70px;text-align:right;" class="ns1blankspaceRow">')

			if (oRow["managed"]=='N')
			{
				aHTML.push('<span id="ns1blankspaceAdminMonitoringInstances_remove-' + oRow.id + '" class="ns1blankspaceInstanceRemove" style="margin-right:2px;"></span>')
			}

			aHTML.push('<span id="ns1blankspaceAdminMonitoringInstances_edit-' + oRow.id + '" class="ns1blankspaceInstanceEdit"' +
								' data-title="' + oRow["title"] + '"' +
								' data-type="' + oRow["type"] + '"' +
								' data-reference="' + oRow["reference"] + '"' +
								' data-serviceinstanceid="' + oRow["serviceinstanceid"] + '"' +
								' data-category="' + oRow["category"] + '"' +
								' data-lastreviewdate="' + oRow["lastreviewdate"] + '"' +
								' data-lastchangedate="' + oRow["lastchangedate"] + '"' +
								' data-managed="' + oRow["managed"] + '"' +
								' data-notes="' + window.btoa(oRow["notes"]) + '"' +
								'></span></td>');

			aHTML.push('</tr>');

			return aHTML.join('');
		},

		bind: function ()
		{
			$('#ns1blankspaceAdminMonitoringInstances .ns1blankspaceRowSelect').click(function()
			{
				ns1blankspace.admin.monitoring.instances.services.details({xhtmlElementID: this.id})
			});

			$('#ns1blankspaceAdminMonitoringInstances .ns1blankspaceInstanceEdit').button(
			{
				text: false,
				icons:
				{
					primary: "ui-icon-pencil"
				}
			})
			.click(function()
			{
				ns1blankspace.admin.monitoring.instances.services.edit({xhtmlElementID: this.id})
			})
			.css('width', '15px')
			.css('height', '17px');

			$('#ns1blankspaceAdminMonitoringInstances .ns1blankspaceInstanceRemove').button(
			{
				text: false,
				icons:
				{
					primary: "ui-icon-close"
				}
			})
			.click(function()
			{
				ns1blankspace.admin.monitoring.instances.services.remove(
				{
					server: $('#' + this.id).attr('data-server'),
					xhtmlElementID: this.id
				})
				
			})
			.css('width', '15px')
			.css('height', '17px');
		},

		remove: function (oParam, oResponse)
		{
			var iServerID = ns1blankspace.util.getParam(oParam, 'server').value;
			var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_ADMIN_SERVER_LOG_SEARCH';
				oSearch.addField('id');
				oSearch.addFilter('server', 'EQUAL_TO', iServerID)
				oSearch.rows = 1;
				oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.instances.services.remove(oParam, data)});
			}
			else
			{
				if (oResponse.data.rows.length != 0)
				{
					ns1blankspace.status.error('You can not delete this instance as their are logs associated with it.')
				}
				else
				{
					ns1blankspace.remove(
					{
						xhtmlElementID: sXHTMLElementID,
						method: 'SETUP_ADMIN_SERVER_MANAGE',
						ifNoneMessage: 'No instances.'
					});
				}
			}
		},

		details: function (oParam)
		{
			var sXHTMLElementID;
			var sKey;

			if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
			{
				sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
				sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
			}

			if ($('#ns1blankspaceAdminMonitoringInstances_container_details-' + sKey).length != 0)
			{
				$('#ns1blankspaceAdminMonitoringInstances_container_details-' + sKey).remove();
			}
			else
			{
				var sHTML = 'No details';

				var oDetail = $.grep(ns1blankspace.admin.monitoring.instances.services.data.details, function (a) {return a.id == sKey;})[0];

				if (oDetail)
				{
					sHTML = '<div class="ns1blankspaceSummaryCaption">GUID:</div><div>' + oDetail.guid + '</div>' +
								'<div class="ns1blankspaceSummaryCaption">Managed:</div><div>' + oDetail.managed + '</div>' +
								'<div class="ns1blankspaceSummaryCaption">Category:</div><div>' + oDetail.categorytext + '</div>' +
								'<div class="ns1blankspaceSummaryCaption">Reference:</div><div>' + oDetail.reference + '</div>' +
								'<div class="ns1blankspaceSummaryCaption">Service Instance ID (AWS):</div><div>' + oDetail.serviceinstanceid + '</div>' +
								'<div class="ns1blankspaceSummaryCaption">Last Updated:</div><div>' + oDetail.modifieddate + '</div>' +
								'<div class="ns1blankspaceSummaryCaption">Notes:</div><div>' + oDetail.notes + '</div>';
					
					sHTML = sHTML + '<div style="margin-top:14px;" id="ns1blankspaceAdminMonitoringInstancesLog-' + oDetail.id + '"' +
											' data-title="' + oDetail.title + '" class="ns1blankspaceViewLink">Log</div>';

					$('#ns1blankspaceAdminMonitoringInstances_container-' + sKey).after('<tr id="ns1blankspaceAdminMonitoringInstances_container_details-' + sKey + '">' +
						'<td colspan=6><div style="background-color: #F3F3F3; padding:8px; color:#444444; font-weight:100; font-size:0.875em;">' + sHTML + '</div></td></tr>');	
				
					$('#ns1blankspaceAdminMonitoringInstancesLog-' + oDetail.id).click().click(function ()
					{
						$('.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
						$('#ns1blankspaceControlInstancesLog').addClass('ns1blankspaceHighlight');
						ns1blankspace.show({selector: '#ns1blankspaceMainInstancesLog'});
						ns1blankspace.admin.monitoring.instances.log.show({searchText: $(this).attr('data-title')})
					});
				}
			}
		},

		edit: function (oParam, oResponse)
		{
			var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
			if (iID == undefined) {iID = ''}

			var aHTML = [];

			aHTML.push('<table class="ns1blankspaceContainer">');

			aHTML.push('<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspaceAdminMonitoringInstancesEditColumn1"></td>' +
							'<td id="ns1blankspaceAdminMonitoringInstancesEditColumn2" style="width:50px;"></td>' +
							'</tr>');

			aHTML.push('</table>');					
			
			$('#ns1blankspaceAdminMonitoringInstancesColumn2').html(aHTML.join(''));

			var aHTML = [];
						
			aHTML.push('<table class="ns1blankspaceColumn2a">' +
							'<tr><td><span id="ns1blankspaceAdminMonitoringInstancesEditSave" data-id="' + iID + '" class="ns1blankspaceAction">' +
							'Save</span></td></tr>' +
							'<tr><td><span id="ns1blankspaceAdminMonitoringInstancesEditCancel" class="ns1blankspaceAction">' +
							'Cancel</span></td></tr>' +
							'</table>');					
			
			$('#ns1blankspaceAdminMonitoringInstancesEditColumn2').html(aHTML.join(''));
			 
			$('#ns1blankspaceAdminMonitoringInstancesEditSave').button(
			{
				text: "Save"
			})
			.click(function()
			{
				ns1blankspace.admin.monitoring.instances.services.save({id: $(this).attr('data-id')})
			})
			.css('width', '65px');

			$('#ns1blankspaceAdminMonitoringInstancesEditCancel').button(
			{
				text: "Cancel"
			})
			.click(function()
			{
				ns1blankspace.admin.monitoring.instances.services.show();
			})
			.css('width', '65px');

			var aHTML = [];

			aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Title' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAdminMonitoringInstancesEditTitle" class="ns1blankspaceText">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Reference' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAdminMonitoringInstancesEditReference" class="ns1blankspaceText">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Service Instance ID (eg AWS ID)' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAdminMonitoringInstancesEditServiceInstanceID" class="ns1blankspaceText">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Category' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioCategory1" name="radioCategory" value="1"/>Shared' +
							'<br /><input type="radio" id="radioCategory2" name="radioCategory" value="2"/>Isolated' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Service Type' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioType1" name="radioType" value="1"/>Database' +
							'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Application' +
							'<br /><input type="radio" id="radioType3" name="radioType" value="3"/>Secure File' +
							'<br /><input type="radio" id="radioType4" name="radioType" value="4"/>Public File' +
							'<br /><input type="radio" id="radioType5" name="radioType" value="5"/>Website File' +
							'<br /><input type="radio" id="radioType6" name="radioType" value="6"/>Load Balancer' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Management' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioManagedY" name="radioManaged" value="Y"/>Used by the service to operate' +
							'<br /><input type="radio" id="radioManagedN" name="radioManaged" value="N"/>Information only' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Last Review Date' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceDate">' +
							'<input id="ns1blankspaceDetailsLastReviewDate" class="ns1blankspaceDate">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Last Change Date' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceDate">' +
							'<input id="ns1blankspaceDetailsLastChangeDate" class="ns1blankspaceDate">' +
							'</td></tr>');				

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Notes' +
							'</td></tr>' +
							'<tr class="ns1blankspaceTextMulti">' +
							'<td class="ns1blankspaceTextMulti">' +
							'<textarea rows="10" cols="35" id="ns1blankspaceAdminMonitoringInstancesEditNotes" class="ns1blankspaceTextMulti"></textarea>' +
							'</td></tr>');

			aHTML.push('</table>');		

			$('#ns1blankspaceAdminMonitoringInstancesEditColumn1').html(aHTML.join(''));

			ns1blankspace.util.initDatePicker(
			{
				select: 'input.ns1blankspaceDate',
				time: false
			});

			if (iID != '')
			{
				$('#ns1blankspaceAdminMonitoringInstancesEditTitle').val(ns1blankspace.util.getData(oParam, 'data-title').value);
				$('#ns1blankspaceAdminMonitoringInstancesEditReference').val(ns1blankspace.util.getData(oParam, 'data-reference').value);
				$('#ns1blankspaceAdminMonitoringInstancesEditServiceInstanceID').val(ns1blankspace.util.getData(oParam, 'data-serviceinstanceid').value);
				$('#ns1blankspaceDetailsLastReviewDate').val(ns1blankspace.util.getData(oParam, 'data-lastreviewdate').value);
				$('#ns1blankspaceDetailsLastChangeDate').val(ns1blankspace.util.getData(oParam, 'data-lastchangedate').value);
				$('[name="radioCategory"][value="' + ns1blankspace.util.getData(oParam, 'data-category').value + '"]').attr('checked', true);
				$('[name="radioType"][value="' + ns1blankspace.util.getData(oParam, 'data-type').value + '"]').attr('checked', true);
				$('[name="radioManaged"][value="' + ns1blankspace.util.getData(oParam, 'data-managed').value + '"]').attr('checked', true);
				$('#ns1blankspaceAdminMonitoringInstancesEditNotes').val(window.atob(ns1blankspace.util.getData(oParam, 'data-notes').value));	 
			}
		},

		save: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				var iID = ns1blankspace.util.getParam(oParam, 'id').value;

				var oData =
				{
					id: iID,
					title: $('#ns1blankspaceAdminMonitoringInstancesEditTitle').val(),
					lastreviewdate: $('#ns1blankspaceDetailsLastReviewDate').val(),
					lastchangedate: $('#ns1blankspaceDetailsLastChangeDate').val(),
					reference: $('#ns1blankspaceAdminMonitoringInstancesEditReference').val(),
					serviceinstanceid: $('#ns1blankspaceAdminMonitoringInstancesEditServiceInstanceID').val(),
					category: $('input[name="radioCategory"]:checked').val(),
					type: $('input[name="radioType"]:checked').val(),
					managed: $('input[name="radioManaged"]:checked').val(),
					notes: $('#ns1blankspaceAdminMonitoringInstancesEditNotes').val()
				}

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('SETUP_ADMIN_SERVER_MANAGE'),
					data: oData,
					dataType: 'json',
					success: function(data) 
					{
						if (data.status == 'OK')
						{
							ns1blankspace.status.message('Saved');
							ns1blankspace.admin.monitoring.instances.services.show()
						}
					}
				});
			}
		}		
	},

	log:
	{
		data: {},

		show:	function (oParam, oResponse)
		{
			var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
			var sSearchText;

			if (oSearchText.exists)
			{
				sSearchText = oSearchText.value;
				ns1blankspace.admin.monitoring.instances.log.data.searchText = sSearchText;
			}
			else
			{	
				sSearchText = ns1blankspace.admin.monitoring.instances.log.data.searchText;
			}	

			if (oResponse == undefined)
			{	
				var aHTML = [];

				aHTML.push('<table class="ns1blankspaceContainer">' +
								'<tr class="ns1blankspaceContainer">' +
								'<td id="ns1blankspaceAdminMonitoringInstancesLogColumn1"></td>' +
								'<td id="ns1blankspaceAdminMonitoringInstancesLogColumn2" style="width:115px;"></td>' +
								'</tr>' +
								'</table>');				
				
				$('#ns1blankspaceMainInstancesLog').html(aHTML.join(''));

				$('#ns1blankspaceAdminMonitoringInstancesLogColumn1').html(ns1blankspace.xhtml.loading);

				ns1blankspace.admin.monitoring.instances.log.data.details = [];

				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_ADMIN_SERVER_LOG_SEARCH';
				oSearch.addField('category,categorytext,id,notes,server,servertext,source,sourcereference,sourcetext,' +
										'subject,versionreference,type,typetext,createddate,createduser,guid');

				if (sSearchText != undefined)
				{
					oSearch.addBracket('(');
					oSearch.addFilter('subject', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addFilter('guid', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addFilter('servertext', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addBracket(')');
				}

				oSearch.rows = 9999;
				oSearch.sort('createddate', 'desc');
				oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.instances.log.show(oParam, data)});
			}
			else
			{
				var aHTML = [];
				
				if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<table id="ns1blankspaceAdminMonitoringInstancesLog">' +
									'<tr><td class="ns1blankspaceSub">No instance logs.</td></tr></table>');

					$('#ns1blankspaceAdminMonitoringInstancesLogColumn1').html(aHTML.join(''));
				}
				else
				{
					var aHTML = [];

					aHTML.push('<table id="ns1blankspaceAdminMonitoringInstancesLog" class="ns1blankspace" style="font-size:0.875em;">' +
								'<tr class="ns1blankspaceHeaderCaption">' +
								'<td class="ns1blankspaceHeaderCaption" style="width:65px;">Subject</td>' +
								'<td class="ns1blankspaceHeaderCaption">Instance</td>' +
								'<td class="ns1blankspaceHeaderCaption">Type</td>' +
								'<td class="ns1blankspaceHeaderCaption">Category</td>' +
								'<td class="ns1blankspaceHeaderCaption">Log Date</td>' +
								'<td class="ns1blankspaceHeaderCaption"></td>' +
								'</tr>');

					$(oResponse.data.rows).each(function() 
					{
						aHTML.push(ns1blankspace.admin.monitoring.instances.log.row(this));
					});
					
					aHTML.push('</table>');
				}

				ns1blankspace.render.page.show(
				{
					type: 'JSON',
					xhtmlElementID: 'ns1blankspaceAdminMonitoringInstancesLogColumn1',
					xhtmlContext: 'AdminMonitoringInstancesLog',
					xhtml: aHTML.join(''),
					showMore: (oResponse.morerows == "true"),
					more: oResponse.moreid,
					rows: 100,
					functionShowRow: ns1blankspace.admin.monitoring.instances.log.row,
					functionOpen: undefined,
					functionOnNewPage: ns1blankspace.admin.monitoring.instances.log.bind
				});

				var aHTML = [];

				aHTML.push('<table class="ns1blankspaceColumn2">');

				aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:14px;">' +
										'<input id="ns1blankspaceAdminMonitoringInstancesLogSearchText" class="ns1blankspaceText" style="width:130px;">' +
										'</td></tr>');
																	
				aHTML.push('<tr><td style="padding-top:0px;">' +
								'<span id="ns1blankspaceAdminMonitoringInstancesLogSearch" class="ns1blankspaceAction">Search</span>' +
								'');

				if (sSearchText != undefined)
				{	
					aHTML.push('' +
								' <span id="ns1blankspaceAdminMonitoringInstancesLogSearchClear" class="ns1blankspaceAction">Clear</span>' +
								'</td></tr>');
				}

				aHTML.push('<tr><td style="padding-top:16px;">' +
										'<span id="ns1blankspaceAdminMontoringInstancesLogAdd" class="ns1blankspaceAction">Add</span>');

				aHTML.push('</table>');

				if ($('#ns1blankspaceAdminMonitoringInstancesLogColumn2 table').length == 0)
				{
					$('#ns1blankspaceAdminMonitoringInstancesLogColumn2').html(aHTML.join(''));
				}
				else
				{
					$('#ns1blankspaceAdminMonitoringInstancesLogColumn2 table').before(aHTML.join(''));
				}

				$('#ns1blankspaceAdminMonitoringInstancesLogSearch').button(
				{
					label: 'Search'
				})
				.click(function() 
				{
					oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringInstancesLogSearchText').val());
					ns1blankspace.admin.monitoring.instances.log.show(oParam);
				})
				.css('width', '65px');

				$('#ns1blankspaceAdminMonitoringInstancesLogSearchClear').button(
				{
					label: 'Clear'
				})
				.click(function() 
				{
					oParam = ns1blankspace.util.setParam(oParam, 'searchText', '');
					ns1blankspace.admin.monitoring.instances.log.show(oParam);
				})
				.css('width', '57px');

				$('#ns1blankspaceAdminMonitoringInstancesLogSearchText').keyup(function(e)
				{
					if (e.which === 13)
			    	{
			    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringInstancesLogSearchText').val())
			    		ns1blankspace.admin.monitoring.instances.log.show(oParam);
			    	}
				});				

				$('#ns1blankspaceAdminMonitoringInstancesLogSearchText').val(sSearchText);

				$('#ns1blankspaceAdminMontoringInstancesLogAdd').button(
				{
					label: "Add"
				})
				.click(function()
				{
					ns1blankspace.admin.monitoring.instances.log.edit({xhtmlElementID: this.id})
				})
				.css('width', '57px');
			}
		},	

		row: function (oRow)	
		{
			var aHTML = [];

			ns1blankspace.admin.monitoring.instances.log.data.details.push(oRow);

			aHTML.push('<tr id="ns1blankspaceAdminMonitoringInstancesLog_container-' + oRow["id"] + '">');

			aHTML.push('<td style="width:120px;" id="ns1blankspaceAdminMonitoringInstancesLog_subject-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
								oRow["subject"] + '</td>');

			aHTML.push('<td id="ns1blankspaceAdminMonitoringInstancesLog_instance-' + oRow["id"] + '" class="ns1blankspaceRow">' +
								oRow["servertext"] + '</td>');

			aHTML.push('<td id="ns1blankspaceAdminMonitoringInstancesLog_typetext-' + oRow["id"] + '" class="ns1blankspaceRow">' +
								oRow["typetext"] + '</td>');

			aHTML.push('<td id="ns1blankspaceAdminMonitoringInstancesLog_category-' + oRow["id"] + '" class="ns1blankspaceRow">' +
								oRow["categorytext"] + '</td>');

			aHTML.push('<td id="ns1blankspaceAdminMonitoringInstancesLog_createddate-' + oRow["id"] + '" class="ns1blankspaceRow">' +
								oRow["createddate"] + '</td>');

			aHTML.push('<td style="width:70px;text-align:right;" class="ns1blankspaceRow">')

			if (oRow["source"] == 2)
			{
				aHTML.push('<span id="ns1blankspaceAdminMonitoringInstancesLog_remove-' + oRow.id + '" class="ns1blankspaceInstanceLogRemove" style="margin-right:2px;"></span>')
				aHTML.push('<span id="ns1blankspaceAdminMonitoringInstancesLog_edit-' + oRow.id + '" class="ns1blankspaceInstanceLogEdit"' +
								' data-subject="' + oRow["subject"] + '"' +
								' data-type="' + oRow["type"] + '"' +
								' data-server="' + oRow["server"] + '"' +
								' data-servertext="' + oRow["servertext"] + '"' +
								' data-source="' + oRow["source"] + '"' +
								' data-sourcereference="' + oRow["sourcereference"] + '"' +
								' data-category="' + oRow["category"] + '"' +
								' data-versionreference="' + oRow["versionreference"] + '"' +
								' data-createddate="' + oRow["createddate"] + '"' +
								' data-createduser="' + oRow["createduser"] + '"' +
								' data-notes="' + window.btoa(oRow["notes"]) + '"' +
								'></span></td>');
			}

			aHTML.push('</tr>');

			return aHTML.join('');
		},

		bind: function ()
		{
			$('#ns1blankspaceAdminMonitoringInstancesLog .ns1blankspaceRowSelect').click(function()
			{
				ns1blankspace.admin.monitoring.instances.log.details({xhtmlElementID: this.id})
			});

			$('#ns1blankspaceAdminMonitoringInstancesLog .ns1blankspaceInstanceLogEdit').button(
			{
				text: false,
				icons:
				{
					primary: "ui-icon-pencil"
				}
			})
			.click(function()
			{
				ns1blankspace.admin.monitoring.instances.log.edit({xhtmlElementID: this.id})
			})
			.css('width', '15px')
			.css('height', '17px');

			$('#ns1blankspaceAdminMonitoringInstancesLog .ns1blankspaceInstanceLogRemove').button(
			{
				text: false,
				icons:
				{
					primary: "ui-icon-close"
				}
			})
			.click(function()
			{
				ns1blankspace.admin.monitoring.instances.log.remove(
				{
					createduser: $('#' + this.id).attr('data-createduser'),
					source: $('#' + this.id).attr('data-source'),
					xhtmlElementID: this.id
				})
				
			})
			.css('width', '15px')
			.css('height', '17px');
		},

		remove: function (oParam, oResponse)
		{
			var iCreatedUser = ns1blankspace.util.getParam(oParam, 'createduser').value;
			var iSource = ns1blankspace.util.getParam(oParam, 'source').value;
			var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

			if (iCreatedUser != ns1blankspace.user.id && iSource == 2)
			{
				ns1blankspace.status.error('You can not delete this log as you did not create it.')
			}
			else
			{
				ns1blankspace.remove(
				{
					xhtmlElementID: sXHTMLElementID,
					method: 'SETUP_ADMIN_SERVER_LOG_MANAGE',
					ifNoneMessage: 'No instance logs.'
				});
			}
		},

		details: function (oParam)
		{
			var sXHTMLElementID;
			var sKey;

			if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
			{
				sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
				sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
			}

			if ($('#ns1blankspaceAdminMonitoringInstancesLog_container_details-' + sKey).length != 0)
			{
				$('#ns1blankspaceAdminMonitoringInstancesLog_container_details-' + sKey).remove();
			}
			else
			{
				var sHTML = 'No details';

				var oDetail = $.grep(ns1blankspace.admin.monitoring.instances.log.data.details, function (a) {return a.id == sKey;})[0];

				if (oDetail)
				{
					sHTML = '<div class="ns1blankspaceSummaryCaption">GUID:</div><div>' + oDetail.guid + '</div>' +
								'<div class="ns1blankspaceSummaryCaption">Server:</div><div>' + oDetail.servertext + '</div>' +
								'<div class="ns1blankspaceSummaryCaption">Category:</div><div>' + oDetail.categorytext + '</div>' +
								'<div class="ns1blankspaceSummaryCaption">Type:</div><div>' + oDetail.typetext + '</div>' +
								'<div class="ns1blankspaceSummaryCaption">Version Reference:</div><div>' + oDetail.versionreference + '</div>' +
								'<div class="ns1blankspaceSummaryCaption">Source:</div><div>' + oDetail.sourcetext + '</div>' +
								'<div class="ns1blankspaceSummaryCaption">Source Reference:</div><div>' + oDetail.sourcereference + '</div>' +
								'<div class="ns1blankspaceSummaryCaption">Notes:</div><div>' + oDetail.notes + '</div>';
			
					sHTML = sHTML + '<div class="ns1blankspaceSummaryCaption">Attachments:</div><div id="ns1blankspaceInstancesLogAttachmentContainer" style="background-color:white; padding:12px;"></div>';

					$('#ns1blankspaceAdminMonitoringInstancesLog_container-' + sKey).after('<tr id="ns1blankspaceAdminMonitoringInstancesLog_container_details-' + sKey + '">' +
						'<td colspan=6><div style="background-color: #F3F3F3; padding:8px; color:#444444; font-weight:100; font-size:0.875em;">' + sHTML + '</div></td></tr>');

					ns1blankspace.attachments.show(
					{
						xhtmlElementID: 'ns1blankspaceInstancesLogAttachmentContainer',
						object: '387',
						objectContext: oDetail.id
					});
				}
			}
		},

		edit: function (oParam, oResponse)
		{
			var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
			if (iID == undefined) {iID = ''}

			var aHTML = [];

			aHTML.push('<table class="ns1blankspaceContainer">');

			aHTML.push('<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspaceAdminMonitoringInstancesLogEditColumn1"></td>' +
							'<td id="ns1blankspaceAdminMonitoringInstancesLogEditColumn2" style="width:50px;"></td>' +
							'</tr>');

			aHTML.push('</table>');					
			
			$('#ns1blankspaceAdminMonitoringInstancesLogColumn2').html(aHTML.join(''));

			var aHTML = [];
						
			aHTML.push('<table class="ns1blankspaceColumn2a">' +
							'<tr><td><span id="ns1blankspaceAdminMonitoringInstancesLogEditSave" data-id="' + iID + '" class="ns1blankspaceAction">' +
							'Save</span></td></tr>' +
							'<tr><td><span id="ns1blankspaceAdminMonitoringInstancesLogEditCancel" class="ns1blankspaceAction">' +
							'Cancel</span></td></tr>' +
							'</table>');					
			
			$('#ns1blankspaceAdminMonitoringInstancesLogEditColumn2').html(aHTML.join(''));
			 
			$('#ns1blankspaceAdminMonitoringInstancesLogEditSave').button(
			{
				text: "Save"
			})
			.click(function()
			{
				ns1blankspace.admin.monitoring.instances.log.save({id: $(this).attr('data-id')})
			})
			.css('width', '65px');

			$('#ns1blankspaceAdminMonitoringInstancesLogEditCancel').button(
			{
				text: "Cancel"
			})
			.click(function()
			{
				ns1blankspace.admin.monitoring.instances.log.show();
			})
			.css('width', '65px');

			var aHTML = [];

			aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Subject' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAdminMonitoringInstancesLogEditSubject" class="ns1blankspaceText">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Server' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAdminMonitoringInstancesLogEditServer" class="ns1blankspaceSelect"' +
								' data-method="SETUP_ADMIN_SERVER_SEARCH"' +
								' data-columns="title">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Category' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioCategory1" name="radioCategory" value="1"/>Code' +
							'<br /><input type="radio" id="radioCategory2" name="radioCategory" value="2"/>File System' +
							'<br /><input type="radio" id="radioCategory3" name="radioCategory" value="3"/>Performance' +
							'<br /><input type="radio" id="radioCategory4" name="radioCategory" value="4"/>Protection' +
							'<br /><input type="radio" id="radioCategory5" name="radioCategory" value="5"/>Operating System' +
							'<br /><input type="radio" id="radioCategory6" name="radioCategory" value="6"/>Other' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Type' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioType1" name="radioType" value="1"/>Review' +
							'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Change' +
							'<br /><input type="radio" id="radioType3" name="radioType" value="3"/>Issue' +
							'<br /><input type="radio" id="radioType4" name="radioType" value="4"/>Alert' +
							'<br /><input type="radio" id="radioType5" name="radioType" value="5"/> Other' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Source' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioSource1" name="radioSource" value="1"/>Machine' +
							'<br /><input type="radio" id="radioSource2" name="radioSource" value="2"/>Human' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Source Reference' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAdminMonitoringInstancesLogEditSourceReference" class="ns1blankspaceText">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Version Reference' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAdminMonitoringInstancesLogEditVersionReference" class="ns1blankspaceText">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Notes' +
							'</td></tr>' +
							'<tr class="ns1blankspaceTextMulti">' +
							'<td class="ns1blankspaceTextMulti">' +
							'<textarea rows="10" cols="35" id="ns1blankspaceAdminMonitoringInstancesLogEditNotes" class="ns1blankspaceTextMulti"></textarea>' +
							'</td></tr>');

			aHTML.push('</table>');		

			$('#ns1blankspaceAdminMonitoringInstancesLogEditColumn1').html(aHTML.join(''));

			if (iID != '')
			{
				$('#ns1blankspaceAdminMonitoringInstancesLogEditSubject').val(ns1blankspace.util.getData(oParam, 'data-subject').value);
				$('#ns1blankspaceAdminMonitoringInstancesLogEditServer').val(ns1blankspace.util.getData(oParam, 'data-servertext').value);
				$('#ns1blankspaceAdminMonitoringInstancesLogEditServer').attr('data-id', ns1blankspace.util.getData(oParam, 'data-server').value);
				$('#ns1blankspaceAdminMonitoringInstancesLogEditSourceReference').val(ns1blankspace.util.getData(oParam, 'data-sourcereference').value);
				$('#ns1blankspaceAdminMonitoringInstancesLogEditVersionReference').val(ns1blankspace.util.getData(oParam, 'data-versionreference').value);
				$('[name="radioCategory"][value="' + ns1blankspace.util.getData(oParam, 'data-category').value + '"]').attr('checked', true);
				$('[name="radioType"][value="' + ns1blankspace.util.getData(oParam, 'data-type').value + '"]').attr('checked', true);
				$('[name="radioSource"][value="' + ns1blankspace.util.getData(oParam, 'data-source').value + '"]').attr('checked', true);
				$('#ns1blankspaceAdminMonitoringInstancesLogEditNotes').val(window.atob(ns1blankspace.util.getData(oParam, 'data-notes').value)); 
			}
		},

		save: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				var iID = ns1blankspace.util.getParam(oParam, 'id').value;

				var oData =
				{
					id: iID,
					subject: $('#ns1blankspaceAdminMonitoringInstancesLogEditSubject').val(),
					sourcereference: $('#ns1blankspaceAdminMonitoringInstancesLogEditSourceReference').val(),
					versionreference: $('#ns1blankspaceAdminMonitoringInstancesLogEditVersionReference').val(),
					category: $('input[name="radioCategory"]:checked').val(),
					type: $('input[name="radioType"]:checked').val(),
					source: $('input[name="radioSource"]:checked').val(),
					notes: $('#ns1blankspaceAdminMonitoringInstancesLogEditNotes').val(),
					server: $('#ns1blankspaceAdminMonitoringInstancesLogEditServer').attr('data-id'),
				}

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('SETUP_ADMIN_SERVER_LOG_MANAGE'),
					data: oData,
					dataType: 'json',
					success: function(data) 
					{
						if (data.status == 'OK')
						{
							ns1blankspace.status.message('Saved');
							ns1blankspace.admin.monitoring.instances.log.show()
						}
					}
				});
			}
		}
	}
}

ns1blankspace.admin.monitoring.billing =
{
	data: 	{searchText: undefined},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.admin.monitoring.billing.show(oParam);
				},

	count:
	{
		sms: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_ADMIN_BILLING_TRANSACTION_SEARCH';
						oSearch.addField('id');
						oSearch.addFilter('createddate', 'GREATER_THAN_OR_EQUAL_TO', 'hour', '-24', '');
						oSearch.addSummaryField('count(id) count');
						oSearch.addCustomOption('allspaces', (ns1blankspace.user.super?'Y':'N'));
						oSearch.rows = 1;
						oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.billing.count.sms(oParam, data)})	
					}
					else
					{
						$('#ns1blankspaceSummaryBillingSMS').html(oResponse.summary.count);
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
						ns1blankspace.admin.monitoring.billing.data.searchText = sSearchText;
					}
					else
					{	
						sSearchText = ns1blankspace.admin.monitoring.billing.data.searchText;
					}	

					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceAdminMonitoringBillingColumn1"></td>' +
										'<td id="ns1blankspaceAdminMonitoringBillingColumn2" style="width:115px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainBilling').html(aHTML.join(''));

						$('#ns1blankspaceAdminMonitoringBillingColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.admin.monitoring.billing.data.details = [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_ADMIN_BILLING_TRANSACTION_SEARCH';
						oSearch.addField('accounttext,description,objecttext,units,usertext,createddate,space,spacetext');

						if (sSearchText != undefined)
						{
							oSearch.addBracket('(');
							oSearch.addFilter('usertext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('guid', 'TEXT_IS_LIKE', sSearchText);

							if (ns1blankspace.user.super)
							{
								oSearch.addOperator('or');
								oSearch.addFilter('spacetext', 'TEXT_IS_LIKE', sSearchText);
							}
							
							if (sSearchText != '')
							{	
								var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
								if (oSearchDate.isValid())
								{
									oSearch.addOperator('or');
									oSearch.addFilter('createddate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
								}
							}

							oSearch.addBracket(')');
						}

						if (ns1blankspace.user.super)
						{
							oSearch.addCustomOption('allspaces', 'Y');
						}

						oSearch.rows = 100;
						oSearch.sort('createddate', 'desc');
						oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.billing.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceAdminMonitoringBilling">' +
											'<tr><td class="ns1blankspaceSub">No billing transactions.</td></tr></table>');

							$('#ns1blankspaceAdminMonitoringBillingColumn1').html(aHTML.join(''));
						}
						else
						{
							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceAdminMonitoringBilling" class="ns1blankspace" style="font-size:0.875em;">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption" style="width:65px;">Date</td>' +
										'<td class="ns1blankspaceHeaderCaption">User</td>' +
										'<td class="ns1blankspaceHeaderCaption">Account</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Units</td>' +
										'<td class="ns1blankspaceHeaderCaption">Send To & Status</td>' +
										'</tr>');

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.admin.monitoring.billing.row(this));
							});
							
							aHTML.push('</table>');
						}

						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceAdminMonitoringBillingColumn1',
							xhtmlContext: 'AdminMonitoringBilling',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.admin.monitoring.billing.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.admin.monitoring.billing.bind
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:14px;">' +
												'<input id="ns1blankspaceAdminMonitoringBillingSearchText" class="ns1blankspaceText" style="width:130px;">' +
												'</td></tr>');
																			
						aHTML.push('<tr><td style="padding-top:0px;">' +
										'<span id="ns1blankspaceAdminMonitoringBillingSearch" class="ns1blankspaceAction">Search</span>' +
										'');

						if (sSearchText != undefined)
						{	
							aHTML.push('' +
										' <span id="ns1blankspaceAdminMonitoringBillingSearchClear" class="ns1blankspaceAction">Clear</span>' +
										'</td></tr>');
						}

						aHTML.push('</table>');

						if ($('#ns1blankspaceAdminMonitoringBillingColumn2 table').length == 0)
						{
							$('#ns1blankspaceAdminMonitoringBillingColumn2').html(aHTML.join(''));
						}
						else
						{
							$('#ns1blankspaceAdminMonitoringBillingColumn2 table').before(aHTML.join(''));
						}

						$('#ns1blankspaceAdminMonitoringBillingSearch').button(
						{
							label: 'Search'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringBillingSearchText').val());
							ns1blankspace.admin.monitoring.billing.show(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspaceAdminMonitoringBillingSearchClear').button(
						{
							label: 'Clear'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', '');
							ns1blankspace.admin.monitoring.billing.show(oParam);
						})
						.css('width', '57px');

						$('#ns1blankspaceAdminMonitoringBillingSearchText').keyup(function(e)
						{
							if (e.which === 13)
					    	{
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminMonitoringBillingSearchText').val())
					    		ns1blankspace.admin.monitoring.billing.show(oParam);
					    	}
						});				

						$('#ns1blankspaceAdminMonitoringBillingSearchText').val(sSearchText);
					}
				},	

	row: 		function (oRow)	
				{
					var aHTML = [];

					ns1blankspace.admin.monitoring.billing.data.details.push(oRow);

					aHTML.push('<tr id="ns1blankspaceAdminMonitoringBilling_container-' + oRow["id"] + '">');

					aHTML.push('<td style="width:120px;" id="ns1blankspaceAdminMonitoringBilling_createddate-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
										oRow["createddate"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringBilling_user-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										'<div>' + oRow["usertext"] + '</div>');

					if (ns1blankspace.user.super)
					{
						aHTML.push('<div class="ns1blankspaceSubNote">' + oRow["spacetext"] + '</div>');
					}

					aHTML.push('</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringBilling_account-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["accounttext"] + '</td>');

						aHTML.push('<td id="ns1blankspaceAdminMonitoringBilling_units-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:center;">' +
										oRow["units"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringBilling_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["description"] + '</td>');

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function ()
				{
					$('#ns1blankspaceAdminMonitoringBilling .ns1blankspaceRowSelect').click(function()
					{
						ns1blankspace.admin.monitoring.billing.details({xhtmlElementID: this.id})
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

					if ($('#ns1blankspaceAdminMonitoringBilling_container_details-' + sKey).length != 0)
					{
						$('#ns1blankspaceAdminMonitoringBilling_container_details-' + sKey).remove();
					}
					else
					{
						var sHTML = 'No details';

						var oDetail = $.grep(ns1blankspace.admin.monitoring.billing.data.details, function (a) {return a.id == sKey;})[0];

						if (oDetail)
						{
							sHTML = '<div class="ns1blankspaceSummaryCaption">XXX:</div><div>' + (oDetail.xxx!=''?oDetail.xxx:'<i>No data</i>') + '</div>';
									
							
							$('#ns1blankspaceAdminMonitoringBilling_container-' + sKey).after('<tr id="ns1blankspaceAdminMonitoringBilling_container_details-' + sKey + '">' +
								'<td colspan=4><div style="background-color: #F3F3F3; padding:8px; color:#444444; font-weight:100; font-size:0.75em;">' + sHTML + '</div></td></tr>');	
						}
					}
				}						
}

//https://superuser.com/questions/226828/how-to-monitor-a-folder-and-trigger-a-command-line-action-when-a-file-is-created
//https://gallery.technet.microsoft.com/scriptcenter/18c5d6b8-565e-4ab9-8e1f-7daefcc10545

