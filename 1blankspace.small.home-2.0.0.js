/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.xhtml.defaultElementID = 'ns1blankspaceControlActionToday';

ns1blankspace.home = 
{
	init: 		function () {ns1blankspace.home.show()},

	show: 		function ()
				{	
					ns1blankspace.objectName = 'home';
					
					ns1blankspace.history.view(
					{
						newDestination: 'ns1blankspace.home.show();',
						move: false
					});

					$('#ns1blankspaceViewControlContext').html('');
					$('#ns1blankspaceViewControlContextImage').html('<div id="ns1blankspaceViewAction" class="ns1blankspaceViewImage"></div>');

					$('#ns1blankspaceViewControlViewContainer').button(
						{
							label: 'Select...'
						});

					var aHTML = [];
									
					aHTML.push('<div id="ns1blankspaceControlActionFuture"></div>');		
						
					$('#ns1blankspaceControl').html(aHTML.join(''));

					$('#ns1blankspaceViewControlContext').html('Coming up');

					ns1blankspace.home.actions.show(
					{
						future: true
					});

					$('#ns1blankspaceViewControlNew').button({disabled: true});

					//ns1blankspace.home.bind();
				},

	bind: 		function ()
				{
					$('#ns1blankspaceControlActionFuture')
					.button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-grip-dotted-horizontal"
						}
					})
					.click(function(event)
					{
						$('#ns1blankspaceHomeColumn1').html(ns1blankspace.xhtml.loading);
						ns1blankspace.xhtml.defaultElementID = this.id;
						
						ns1blankspace.home.actions.show(
						{
							future: true
						});
					})
					.css('width', '26px')
					.css('height', '26px');
				}
}	

ns1blankspace.home.options = 
{
	show: 		function (oElement)
				{
				},

	bind:		function ()
				{
				}
}				

ns1blankspace.home.actions = 
{
	show: 		function (oParam, oResponse)
				{					
					var sXHTMLElementID = 'ns1blankspaceMain';
					var iDay = 0;
					var sLabel = 'Actions';
					var bOverdue = false;
					var bFuture = false;
					
					if (oParam != undefined)
					{
						if (oParam.overdue != undefined) {bOverdue = oParam.overdue}
						if (oParam.future != undefined) {bFuture = oParam.future}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.day != undefined) {iDay = oParam.day}
						if (oParam.label != undefined) {sLabel = oParam.label}
					}

					var aHTML = [];
					
					if (oResponse == undefined)
					{			

						$('#' + sXHTMLElementID).html(ns1blankspace.xhtml.loading);

						var oSearch = new AdvancedSearch();
						oSearch.method = 'ACTION_SEARCH';
						oSearch.addField('contactperson,actionby,actionbytext,actionreference,actiontype,actiontypetext,billingstatus,' +
											'billingstatustext,completed,completedtime,contactbusiness,contactbusinesstext,contactperson,' +
											'contactpersontext,date,description,duedate,duedatetime,object,objectcontext,objecttext,' +
											'priority,prioritytext,status,statustext,subject,text,totaltimehrs,totaltimemin');
						oSearch.addFilter('actionby', 'EQUAL_TO', ns1blankspace.user.id);
						oSearch.addFilter('status', 'NOT_EQUAL_TO', 1);

						if (bOverdue)
						{
							oSearch.addFilter('duedate', 'LESS_THAN_OR_EQUAL_TO', 'hour', '0', 'start_of_today');
						}
						else if (bFuture)
						{
							oSearch.addFilter('duedate', 'GREATER_THAN_OR_EQUAL_TO', 'hour', '0', 'start_of_today');
						}
						else
						{
							oSearch.addFilter('duedate', 'GREATER_THAN_OR_EQUAL_TO', 'day', iDay, 'start_of_today');
							oSearch.addFilter('duedate', 'LESS_THAN_OR_EQUAL_TO', 'day', iDay, 'end_of_today');
						}	

						oSearch.rows = 20
						oSearch.sort('duedate', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.home.actions.show(oParam, data)});

					}
					else
					{
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table class="ns1blankspaceHomeActions">');
							aHTML.push('<tr><td class="ns1blankspaceNothing">Nothing.</td></tr>');
							aHTML.push('</table>');

							$('#' + sXHTMLElementID).html(aHTML.join(''));	
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceHomeActions' + iDay + '" class="ns1blankspace">');	

							$.each(oResponse.data.rows, function()
							{
								aHTML.push(ns1blankspace.home.actions.row(this, (bOverdue || bFuture)));
							});
							
							aHTML.push('</table>');
							
							ns1blankspace.render.page.show(
							{
								headerRow: false,
								xhtmlElementID: sXHTMLElementID,
								xhtmlContext: 'HomeTodayAction',
								xhtml: aHTML.join(''),
								showMore: (oResponse.morerows == 'true'),
								more: oResponse.moreid,
								rows: 20,
								functionShowRow: ns1blankspace.home.actions.row,
								functionOnNewPage: ns1blankspace.home.actions.bind,
								type: 'json'
							}); 	
						}
					}
				},

	row:		function (oRow, oParam)
				{
					var aHTML = [];
					var bShowDate = true;

					aHTML.push('<tr class="ns1blankspaceRow">');
								
					aHTML.push('<td id="ns1blankspaceHomeActions_subject-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
											oRow.subject);
						
					var oDate = new Date(oRow.date);
					sDate = oDate.toString("ddd, dd MMM yyyy");
							
					if (bShowDate)
					{
						aHTML.push('<div class="ns1blankspaceSub">' + sDate + '</div>');
					}
					
					if (oDate.toString("h") != 0 || oDate.toString("m") != '0')
					{
						sDate = oDate.toString("h:mm tt");

						aHTML.push('<div class="ns1blankspaceSub">' + sDate + '</div>');
					}
														
					aHTML.push('<div class="ns1blankspaceSub">' + oRow.contactpersontext + '</div>');
					
					aHTML.push('<td id="ns1blankspaceHomeActions-' + oRow.id + '" class="ns1blankspaceRow" style="width:30px;">');
					
					aHTML.push('<span id="ns1blankspaceHomeActions_complete-' + oRow.id + '" class="ns1blankspaceRowComplete"></span>');
					
					aHTML.push('</td></tr>');
					
					return aHTML.join('');
				},
					
	bind:		function ()	
				{
					$('td.ns1blankspaceRowSelect').click(function()
					{
						ns1blankspace.action.init({id: (this.id).split('-')[1]});
					});

					$('span.ns1blankspaceRowComplete:not("ui-button")').button({
						text: false,
						label: "Complete",
						icons:
						{
							 primary: "ui-icon-check"
						}
					})
					.click(function() {
						ns1blankspace.home.actions.status(this.id, 1)
					})
					.css('width', '15px')
					.css('height', '18px');
				},

	status:		function (sXHTMLElementID, iStatus)
				{
					var sData = '';
					
					if (iStatus == undefined) {iStatus = 1}
					
					if (sXHTMLElementID != undefined)
					{
						aXHTMLElementID = sXHTMLElementID.split('-');
						
						if (aXHTMLElementID[1] != undefined)
						{
							sData += 'id=' + ns1blankspace.util.fs(aXHTMLElementID[1]);
							sData += '&status=' + ns1blankspace.util.fs(iStatus);
							
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
								data: sData,
								dataType: 'json',
								success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
							});
						}
					}	
				}				
}