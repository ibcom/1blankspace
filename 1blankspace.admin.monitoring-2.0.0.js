/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

if (ns1blankspace.admin === undefined) {ns1blankspace.admin = {}}

ns1blankspace.admin.monitoring = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
					}

					ns1blankspace.app.reset();

					ns1blankspace.objectParentName = 'admin';
					ns1blankspace.objectName = 'monitoring';
					ns1blankspace.viewName = 'Monitoring';
					
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
						
					aHTML.push('<tr><td id="ns1blankspaceControlServiceFaults" class="ns1blankspaceControl">' +
									'Service Faults</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlRequests" class="ns1blankspaceControl">' +
									'Requests</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlNews" class="ns1blankspaceControl">' +
									'News</td></tr>');

					aHTML.push('</table>');		
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					aHTML.push('<tr><td class="ns1blankspaceSub" style="font-size:0.875em; border-bottom-style:solid; border-width: 0px; border-color: #D0D0D0;">' +
									'STATE CHANNEL</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlStateChannelStatus" class="ns1blankspaceControl">' +
									'Status</td></tr>');

					aHTML.push('</table>');

					$('#ns1blankspaceControl').html(aHTML.join(''));	
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainServiceFaults" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainRequests" class="ns1blankspaceControlMain"></div>');
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

					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Service Faults (last 24 hours)</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryServiceFaults" class="ns1blankspaceSummary">' +
									ns1blankspace.xhtml.loadingSmall +
									'</td></tr>');

					aHTML.push('</table>');

					$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

					ns1blankspace.admin.monitoring.serviceFaults.count()
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
	data: 	{searchText: undefined, superUser: true},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.financial.payroll.superannuation.urls(
					{
						onComplete: ns1blankspace.financial.payroll.superannuation.providers,
						onCompleteWhenCan: ns1blankspace.financial.payroll.superannuation.expenses
					});
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
						oSearch.rows = 1;
						oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.serviceFaults.count(oParam, data)})	
					}
					else
					{
						$('#ns1blankspaceSummaryServiceFaults').html(oResponse.summary.count);
					}	
				},	

	summary:	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{}
					else
					{}	
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

						ns1blankspace.admin.monitoring.serviceFaults.data.rows = [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'ADMIN_SERVICE_FAULT_SEARCH';
						oSearch.addField('description,method,page,parameters,site,sitetext,space,spacetext,createddate');
						oSearch.addCustomOption('allspaces', (ns1blankspace.admin.monitoring.serviceFaults.data.superUser?'Y':'N'));

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

						//oSearch.addSummaryField('sum(amount) totalamount')

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

							$('#ns1blankspaceAdminMonitoringServiceFaultsColumn1').html('');
						}
						else
						{
							$('#ns1blankspaceAdminMonitoringServiceFaultsColumn2').html(aHTML.join(''));
						
							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceAdminMonitoringServiceFaults" class="ns1blankspace" style="font-size:0.875em;">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption" style="width:40px;">ID</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:70px;">When</td>' +
										'<td class="ns1blankspaceHeaderCaption">Description</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:50px;">Space</td>' +
										'</tr>');

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
										'<span id="ns1blankspaceAdminMonitoringServiceFaultsSearch" class="ns1blankspaceAction">Search</span>' +
										'');

						if (sSearchText != undefined)
						{	
							aHTML.push('' +
										' <span id="ns1blankspaceAdminMonitoringServiceFaultsSearchClear" class="ns1blankspaceAction">Clear</span>' +
										'</td></tr>');
						}

						//aHTML.push('<tr><td style="padding-top:15px; padding-bottom:0px; font-size:0.75em;" class="ns1blankspaceSub">' +
						//				'Selected expenses total</td></tr>');

						//aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseTotal" style="padding-top:0px; font-size:1.2em; padding-bottom:16px;" class="ns1blankspaceSub">' +
						//				'</td></tr>');

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

					ns1blankspace.admin.monitoring.serviceFaults.data.rows.push(oRow);

					aHTML.push('<td id="ns1blankspaceAdminMonitoringServiceFaults_id-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
										oRow["id"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringServiceFaults_space-' + oRow["description"] + '" class="ns1blankspaceRow">' +
										oRow["createddate"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringServiceFaults_description-' + oRow["description"] + '" class="ns1blankspaceRow">' +
										oRow["description"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminMonitoringServiceFaults_space-' + oRow["description"] + '" class="ns1blankspaceRow">' +
										oRow["spacetext"] + '</td>');

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 		function ()
				{
					$('#ns1blankspaceAdminMonitoringServiceFaults .ns1blankspaceRowSelect').click(function()
					{
						//ns1blankspace.financial.expense.init({id: (this.id).split('-')[1]});
					});		
				}	
}
