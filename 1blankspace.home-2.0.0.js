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
					ns1blankspace.object = -1;
					ns1blankspace.objectName = 'home';

					ns1blankspace.history.view(
					{
						newDestination: 'ns1blankspace.home.show();',
						move: false
					});

					if (ns1blankspace.setupView)
					{	
						$('#ns1blankspaceViewControlSetup').attr('checked', false);
						$('#ns1blankspaceViewControlSetup').button('refresh');
						ns1blankspace.setup.switch({viewScript: 'ns1blankspace.home.show()'});
					}	

					$('#ns1blankspaceViewControlAction').button({disabled: true});
					$('#ns1blankspaceViewControlNew').button({disabled: true});
					$('#ns1blankspaceViewControlActionOptions').button({disabled: true});

					$('#ns1blankspaceViewControlViewContainer').button(
						{
							label: 'Select...'
						});

					var aHTML = [];
					
					aHTML.push('<table id="ns1blankspaceHomeContainer">');
					
					aHTML.push('<tr><td><div id="ns1blankspaceViewActionLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
						
					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlActionToday" class="ns1blankspaceControl ns1blankspaceControlHome">' +
										'Today</td>' +
									'</tr>');

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlActionTomorrow" class="ns1blankspaceControl ns1blankspaceControlHome">' +
										'Tomorrow</td>' +
									'</tr>');
					
					aHTML.push('<tr><td>&nbsp;</td></tr>');
						
					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlActionFuture" class="ns1blankspaceControl ns1blankspaceControlHome">' +
										'Future</td>' +
									'</tr>');
					
					aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
									'<td id="ns1blankspaceControlActionOverdue" class="ns1blankspaceControl ns1blankspaceControlHome">' +
										'Overdue</td>' +
									'</tr>');
									
					aHTML.push('</table>');					
							
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					ns1blankspace.home.bind();

					var aHTML = [];
					
					aHTML.push('<table id="ns1blankspaceHomeContainer">');
					aHTML.push('<tr><td id="ns1blankspaceHomeColumn1" class="ns1blankspaceColumn1Flexible"></td>');
					aHTML.push('<td id="ns1blankspaceHomeColumn2" class="ns1blankspaceColumn2" style="width:100px;">');
					aHTML.push('</td></tr></table>');	

					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceHomeColumn2').html(ns1blankspace.xhtml.homeNotes);

					if (ns1blankspace.xhtml.defaultElementID != '')
					{
						$('#' + ns1blankspace.xhtml.defaultElementID).addClass('ns1blankspaceHighlight');
						$('#' + ns1blankspace.xhtml.defaultElementID).click();
					};
				},

	bind: 		function ()
				{
					
					$('#ns1blankspaceControlActionToday').click(function(event)
					{
						$('#ns1blankspaceHomeColumn1').html(ns1blankspace.xhtml.loading);
						ns1blankspace.xhtml.defaultElementID = this.id;
						
						ns1blankspace.home.actions.show({
							show: false,
							xhtmlElementID: 'ns1blankspaceHomeColumn1',
							day: 0
							})
					});

					$('#ns1blankspaceControlActionTomorrow').click(function(event)
					{
						$('#ns1blankspaceHomeColumn1').html(ns1blankspace.xhtml.loading);
						ns1blankspace.xhtml.defaultElementID = this.id;
						
						ns1blankspace.home.actions.show({
							show: false,
							xhtmlElementID: 'ns1blankspaceHomeColumn1',
							day: 1
							})
					});
					
					$('#ns1blankspaceControlActionFuture').click(function(event)
					{
						$('#ns1blankspaceHomeColumn1').html(ns1blankspace.xhtml.loading);
						ns1blankspace.xhtml.defaultElementID = this.id;
						
						ns1blankspace.home.actions.show({
							show: false,
							xhtmlElementID: 'ns1blankspaceHomeColumn1',
							future: true
							})
					});

					$('#ns1blankspaceControlActionOverdue').click(function(event)
					{
						$('#ns1blankspaceHomeColumn1').html(ns1blankspace.xhtml.loading);
						ns1blankspace.xhtml.defaultElementID = this.id;
						
						ns1blankspace.home.actions.show({
							show: false,
							xhtmlElementID: 'ns1blankspaceHomeColumn1',
							overdue: true
							})
					});
				}
}	

ns1blankspace.home.options = 
{
	show: 		function (oElement)
				{
					var aHTML = [];
					
					aHTML.push('<table id="ns1blankspaceHomeOptions" class="ns1blankspaceViewControlContainer" style="width:190px;">');
									
					aHTML.push('<tr><td id="ns1blankspaceHomeOptionsCalendar" class="ns1blankspaceRowSelect">' +
											'Calendar</td></tr>');

					var sLink = window.location.protocol + '//' + window.location.host + '/#/' +
									(ns1blankspace.objectParentName !== undefined ? ns1blankspace.objectParentName + '.' : '') +
									ns1blankspace.objectName +
									(ns1blankspace.objectContext !== undefined && ns1blankspace.objectContext !== -1 ? '/' + ns1blankspace.objectContext : '');

					aHTML.push('<tr><td id="ns1blankspaceHomeOptionsNewWindow" class="ns1blankspaceRowSelect">' +
									'<a href="' + sLink + '" target="_blank">' +
											'Open In New Window</a></td></tr>');

					if (ns1blankspace.option.classic)
					{	
						aHTML.push('<tr><td id="ns1blankspaceHomeOptionsMyStartPage" class="ns1blankspaceRowSelect">' +
											'<a href="/index.asp?Site=475&p=asms%2Fmystartpage.asp" target="_blank">' +
											'Classic</a></td></tr>');
					}	

					aHTML.push('</table>');
						
					if ($(ns1blankspace.xhtml.container).attr('data-initiator') == oElement.id)
					{
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						$(ns1blankspace.xhtml.container).attr('data-initiator', '');
					}
					else
					{	
						$(ns1blankspace.xhtml.container).attr('data-initiator', oElement.id);
						$(ns1blankspace.xhtml.container).html("&nbsp;");
						$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
						$(ns1blankspace.xhtml.container).offset({ top: $(oElement).offset().top + $(oElement).height() + 0, left: $(oElement).offset().left });
						$(ns1blankspace.xhtml.container).html(aHTML.join(''));
						ns1blankspace.home.options.bind();
					}
				},

	bind:		function ()
				{
					$('#ns1blankspaceHomeOptionsCalendar').click(function(event)
					{
						$(ns1blankspace.xhtml.container).attr('data-initiator', '');
						ns1blankspace.action.init({calendar: true});
					});

					$('#ns1blankspaceHomeOptionsNewWindow').click(function(event)
					{
						$(ns1blankspace.xhtml.container).attr('data-initiator', '');
						$(ns1blankspace.xhtml.container).hide();
					});

					$('#ns1blankspaceHomeOptionsMyStartPage').click(function(event)
					{
						$(ns1blankspace.xhtml.container).attr('data-initiator', '');
						$(ns1blankspace.xhtml.container).hide();
					});
				}
}				

ns1blankspace.home.actions = 
{
	show: 		function (oParam, oResponse)
				{					
					var bShow = false;
					var sXHTMLElementID = 'ns1blankspaceHomeColumn1';
					var iDay = 0;
					var sLabel = 'Actions';
					var bOverdue = false;
					var bFuture = false;
					
					if (oParam != undefined)
					{
						if (oParam.show != undefined) {bShow = oParam.show}
						if (oParam.overdue != undefined) {bOverdue = oParam.overdue}
						if (oParam.future != undefined) {bFuture = oParam.future}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.day != undefined) {iDay = oParam.day}
						if (oParam.label != undefined) {sLabel = oParam.label}
					}

					var aHTML = [];
					
					if (oResponse == undefined)
					{						
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
							aHTML.push('<tr><td class="ns1blankspaceNothing">No ' + sLabel + '</td></tr>');
							aHTML.push('</table>');

							$('#' + sXHTMLElementID).html(aHTML.join(''));
							if (bShow) {$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeedOptions)}	
						}
						else
						{
							if (bShow)
							{
								aHTML.push('<table id="ns1blankspaceHomeActions" class="ns1blankspace">');

								aHTML.push('<tr><td class="ns1blankspaceCaption">' + sLabel + '</td>' + 
												'<td id="ns1blankspaceHomeTodayActions" class="ns1blankspaceHomeOptionClose">Close</td>' +
												'</tr></table>');
								
								aHTML.push('<table id="ns1blankspaceHomeActions" class="ns1blankspace">');
							}
							else
							{
								aHTML.push('<table id="ns1blankspaceHomeActions' + iDay + '" class="ns1blankspace">');
							}	
							
							aHTML.push('<tr class="ns1blankspaceCaption">');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">Subject</td>');
							
							if (bOverdue || bFuture)
							{
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
							}
							
							aHTML.push('<td class="ns1blankspaceHeaderCaption">Time</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">Contact</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
							aHTML.push('</tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push(ns1blankspace.home.actions.row(this, oParam));
							});
							
							aHTML.push('</table>');

							if (bShow) {$('#' + sXHTMLElementId).show(ns1blankspace.option.showSpeedOptions)}	
							
							ns1blankspace.render.page.show(
							{
								xhtmlElementID: sXHTMLElementID,
								xhtmlContext: 'HomeTodayAction',
								xhtml: aHTML.join(''),
								showMore: (oResponse.morerows == 'true'),
								more: oResponse.moreid,
								rows: 20,
								functionShowRow: ns1blankspace.home.actions.row,
								functionNewPage: 'ns1blankspace.home.actions.bind()',
								type: 'json'
							}); 	
							
							ns1blankspace.home.actions.bind();
						}
					}
				},

	row:		function (oRow, oParam)
				{
					var aHTML = [];
					var bOverdue = ns1blankspace.util.getParam(oParam, 'overdue', {default: false}).value;
					var bFuture = ns1blankspace.util.getParam(oParam, 'future', {default: false}).value;

					aHTML.push('<tr class="ns1blankspaceRow">');
								
					aHTML.push('<td id="ns1blankspaceHomeActions_subject-' + oRow.id + '" class="ns1blankspaceRow">' +
											oRow.subject + '</td>');
						
					var oDate = new Date(oRow.date);
					sDate = oDate.toString("ddd, dd MMM yyyy");
							
					if (bOverdue || bFuture)
					{
						aHTML.push('<td id="ns1blankspaceHomeActions_date-' + oRow.id + '" class="ns1blankspaceRow">' +
											sDate + '</td>');
					}
					
					if (oDate.toString("h") != 0 || oDate.toString("m") != '0')
					{
						sDate = oDate.toString("h:mm tt");
					}
					else
					{
						sDate = '&nbsp;';
					}	
											
					aHTML.push('<td id="ns1blankspaceHomeActions_time-' + oRow.id + '" class="ns1blankspaceRow">' +
											sDate + '</td>');
											
					aHTML.push('<td id="ns1blankspaceHomeActions_contact-' + oRow.contactperson + '" class="ns1blankspaceRow ns1blankspaceRowContact">' +
											oRow.contactpersontext + '</td>');
					
					aHTML.push('<td id="ns1blankspaceHomeActions-' + oRow.id + '" class="ns1blankspaceRow" style="width:65px;">');
					
					aHTML.push('<span id="ns1blankspaceHomeActions_cancel-' + oRow.id + '" class="ns1blankspaceRowCancel"></span>');
					aHTML.push('<span id="ns1blankspaceHomeActions_complete-' + oRow.id + '" class="ns1blankspaceRowComplete"></span>');
					aHTML.push('<span id="ns1blankspaceHomeActions-' + oRow.id + '" class="ns1blankspaceRowSelect"></span>');
					
					aHTML.push('</td></tr>');
					
					return aHTML.join('');
				},
					
	bind:		function ()	
				{
					$('td.ns1blankspaceRowContact').click(function() {
						ns1blankspace.contactPerson.init();
						ns1blankspace.contactPerson.searchsend(this.id);
					})

					$('span.ns1blankspaceRowSelect:not("ui-button")').button( {
						text: false,
						icons: {
							primary: "ui-icon-play"
						}
					})
					.click(function()
					{
						ns1blankspace.action.init({id: (this.id).split('-')[1]});
					})
					.css('width', '15px')
					.css('height', '18px');

					$('span.ns1blankspaceRowCancel:not("ui-button")').button(
					{
						text: false,
						label: "Cancel",
						icons: {
							 primary: "ui-icon-close"
						}
					})
					.click(function() {
						ns1blankspace.home.actions.status(this.id, 3)
					})
					.css('width', '15px')
					.css('height', '18px')
						
						
					$('span.ns1blankspaceRowComplete:not("ui-button")').button({
						text: false,
						label: "Complete",
						icons: {
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