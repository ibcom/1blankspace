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
					aHTML.push('<div id="ns1blankspaceMainStateChannel" class="ns1blankspaceControlMain"></div>');


					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.setup.financial.summary();
					});

					$('#ns1blankspaceControlStateChannelStatus').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainStateChannel'});
						ns1blankspace.admin.stateChannel.status();
					});
				},

	summary:	function ()
				{
					var aHTML = [];
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
										success: function()
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
				}				
	}
