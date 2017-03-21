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

										//{"status": "OK","notes": "COMPLETED","xhtmlcontext": "","tobeprocesssed-count": "136401","tobeprocesssed-minimumdate": "9 Feb 2014 22:45:53","tobeprocesssed-sourceminimumdate": "4 Feb 2014 22:29:33","tobeprocesssed-maximumdate": "9 Feb 2014 22:46:05","tobeprocesssed-sourcemaximumdate": "9 Feb 2014 22:36:14","processsed-count": "124717","processsed-maximumdate": "9 Feb 2014 22:46:05","processsed-sourcemaximumdate": "9 Feb 2014 22:42:34","processsed-last24h-count": "37502","processsed-last24h-maximumdate": "9 Feb 2014 22:46:05","processsed-last24h-sourcemaximumdate": "9 Feb 2014 22:42:34"}
									}	
								}
				},

	serviceFaults:
				{
					count: 	function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'ADMIN_SERVICE_FAULT_SEARCH';
										oSearch.addField('id');
										oSearch.addFilter('createddate', 'NOT_EQUAL_TO', '');
										oSearch.addFilter('createddate', 'GREATER_THAN_OR_EQUAL_TO', 'hour', '-24', 'now');
										oSearch.addSummaryField('count(id) count');
										oSearch.rows = 1;
										oSearch.getResults(function(data) {ns1blankspace.admin.serviceFaults.count(oParam, data)})	
									}
									else
									{
										$('#ns1blankspaceSummaryServiceFaults').html(oResponse.summary.count);
									}	
								}
				}										
	}
