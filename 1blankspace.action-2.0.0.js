/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.action = 
{
	data: 		{},

	init: 		function (oParam)
				{
					ns1blankspace.app.reset();
					
					ns1blankspace.objectContext = -1;
					ns1blankspace.object = 17;
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectName = 'action';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Actions';

					var bShowHome = true
					var bNew = false
					
					if (ns1blankspace.action === undefined) {ns1blankspace.action = {}}

					ns1blankspace.action.today = new Date();
					ns1blankspace.action.currentMonth = (ns1blankspace.action.today).getMonth() + 1;
					ns1blankspace.action.currentYear = (ns1blankspace.action.today).getFullYear();
					ns1blankspace.action.contactperson;
					ns1blankspace.action.contactbusiness;
					ns1blankspace.action.contactpersontext;
					ns1blankspace.action.contactbusinesstext;
					ns1blankspace.action.calendarUsers = [];
					ns1blankspace.action.user = ns1blankspace.user.id;
					ns1blankspace.action.calendarParam = '';

					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
						if (oParam.showNew != undefined) {bNew = oParam.showNew}
						if (oParam.contactPerson != undefined) {ns1blankspace.action.contactperson = oParam.contactPerson}
						if (oParam.contactBusiness != undefined) {ns1blankspace.action.contactbusiness = oParam.contactBusiness}
						if (oParam.contactPersonText != undefined) {ns1blankspace.action.contactpersontext = oParam.contactPersonText}
						if (oParam.contactBusinessText != undefined) {ns1blankspace.action.contactbusinesstext = oParam.contactBusinessText}
					}
							
					ns1blankspace.app.set(oParam);
				},

	home:		function (oParam, oResponse)
				{
					var bCalendar = false;
					
					if (oParam != undefined)
					{
						if (oParam.calendar != undefined) {bCalendar = oParam.calendar}
					}	
					
					var aHTML = [];

					aHTML.push('<table>');

					aHTML.push('<tr><td><div id="ns1blankspaceViewActionLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
	
					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlNext10" class="ns1blankspaceControl">Coming Up</td>' +
									'</tr>');		

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlCalendar" class="ns1blankspaceControl">Calendar</td>' +
									'</tr>');

					aHTML.push('</table>');		
					
					$('#ns1blankspaceControl').html(aHTML.join(''));	

					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

					$('#ns1blankspaceMain').html(ns1blankspace.xhtml.loading);
				
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainCalendar" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainNext10" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlCalendar').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainCalendar'});
						ns1blankspace.action.calendar.show();
					});
					
					$('#ns1blankspaceControlNext10').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainNext10'});
						ns1blankspace.action.next10();
					});
						
					if (bCalendar)
					{
						$('#ns1blankspaceControlCalendar').addClass('ns1blankspaceHighlight');
						ns1blankspace.show({selector: '#ns1blankspaceMainCalendar'});
						ns1blankspace.action.calendar.show();
					}
					else
					{
						$('#ns1blankspaceControlNext10').addClass('ns1blankspaceHighlight');
						ns1blankspace.show({selector: '#ns1blankspaceMainNext10'});
						ns1blankspace.action.next10();
					}	

				},

	new:		function (oParam)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspace.action.init();
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					ns1blankspace.action.details();
				},

	search: 	{
					send: 		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									var iMinimumLength = 3;
									var iSource = ns1blankspace.data.searchSource.text;
									var sSearchText;
									var iMaximumColumns = 1;
									var iRows = 10;
									
									if (oParam != undefined)
									{
										if (oParam.source != undefined) {iSource = oParam.source}
										if (oParam.searchText != undefined) {sSearchText = oParam.searchText}
										if (oParam.rows != undefined) {iRows = oParam.rows}
										if (oParam.searchContext != undefined) {sSearchContext = oParam.searchContext}
										if (oParam.minimumLength != undefined) {iMinimumLength = oParam.minimumLength}
										if (oParam.maximumColumns != undefined) {iMaximumColumns = oParam.maximumColumns}
									}
									
									if (sSearchContext != undefined  && iSource != ns1blankspace.data.searchSource.browse)
									{
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'ACTION_SEARCH';
										oSearch.addField('actiontype,contactperson,actionby,actionbytext,' +
															'actiontype,actiontypetext,billingstatus,billingstatustext,' +
															'completed,completedtime,contactbusiness,contactbusinesstext,contactperson,' +
															'contactpersontext,date,description,duedate,duedatetime,object,objectcontext,' +
															'objecttext,priority,private,prioritytext,status,statustext,subject,text,totaltimehrs,totaltimemin');
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);	
										oSearch.getResults(function(data) {ns1blankspace.action.show(oParam, data)});
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
											oSearch.method = 'ACTION_SEARCH';
											oSearch.addField('subject,date,contactbusinesstext,contactpersontext');
											
											oSearch.addFilter('subject', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('action.contactperson.surname', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('action.contactperson.firstname', 'TEXT_IS_LIKE', sSearchText);

											oSearch.sort('subject', 'asc');

											oSearch.getResults(function(data) {ns1blankspace.action.search.process(oParam, data)});
										}
									}	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var	iMaximumColumns = 1;
									var aHTML = [];
									var sContact;
									
									ns1blankspace.search.stop();
										
									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.container).hide();
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
														'search-' + this.id + '">' +
														this.subject +
														'</td>');

											sContact = '';

											if (this.contactbusinesstext != '')
											{
												sContact = this.contactbusinesstext;
											}
											else
											{
												sContact = this.contactpersontext;
											}	
											
											aHTML.push('<td class="ns1blankspaceSearchSub" id="' +
															'searchContact-' + this.id + '">' +
															sContact +
															'</td>');

											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.action.search.send(event.target.id, {source: 1});
										});
									}			
								}
				},				

	layout: 	function ()
				{
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Details</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlDescription" class="ns1blankspaceControl">' +
										'Description</td></tr>');
					}
					else
					{	
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');

						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlDescription" class="ns1blankspaceControl">' +
										'Description</td></tr>');

						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');
										
						aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');
					}
								
					aHTML.push('</table>');						
							
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDescription" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
						
					$('#ns1blankspaceMain').html(aHTML.join(''));
	
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.action.summary();
					});

					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.action.details();
					});
					
					$('#ns1blankspaceControlDescription').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDescription', refresh: true});
						ns1blankspace.action.description();
					});

					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
						ns1blankspace.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments'});
					});
				},

	show:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.action.layout();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this action.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						var iMessageActionID;
						
						if (ns1blankspace.objectContextData.type == ns1blankspace.data.actionTypes.emailSent.id || ns1blankspace.objectContextData.type == ns1blankspace.data.actionTypes.emailReceived.id)
								{iMessageActionID = ns1blankspace.objectContextData.id}
						
						if (ns1blankspace.objectContextData.type == ns1blankspace.data.actionTypes.fileNote.id && ns1blankspace.objectContextData.object == 17)
								{iMessageActionID = ns1blankspace.objectContextData.objectcontext}
								
						if (iMessageActionID != undefined)
						{
							ns1blankspace.messaging.imap.nit({autoShow: false});
							ns1blankspace.messaging.imap.search.send(
							{
								xhtmlElementID: '-' + iMessageActionID
							});	
						}
						else
						{
							$('#ns1blankspaceViewControlAction').button({disabled: false});
							$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
								
							var oDate = Date.parse(ns1blankspace.objectContextData.duedatetime);
								
							var sHTML = '';
														
							if (oDate.getHours() != 0 || oDate.getMinutes() != 0)
							{
								sHTML = '<br /><span id="ns1blankspaceControlContext_time" class="ns1blankspaceSub">' + 
											oDate.toString("h:mm tt")  + '</span>';
							}		
								
							$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.subject +
								'<br /><span id="ns1blankspaceControlContext_date" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.duedate + '</span>' + sHTML);
									
							ns1blankspace.history.view(
							{
								newDestination: 'ns1blankspace.action.init({id: ' + ns1blankspace.objectContext + '})',
								move: false
							});
							
							ns1blankspace.history.control({functionDefault: 'ns1blankspace.action.summary()'});		
						}
						
						if (ns1blankspace.objectContext != -1) {ns1blankspace.action.summary()}
					}	
				},	
		
	summary: 	function ()
				{
					var aHTML = [];

					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the action.</td></tr></table>');
								
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceRow">' +
										'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
										'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:350px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
						
						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');
					
						if (ns1blankspace.objectContextData.contactbusinesstext != '')
						{

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Business</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryBusiness" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.contactbusinesstext +
											'</td></tr>');
						}
						
						if (ns1blankspace.objectContextData.contactpersontext != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Person</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryPerson" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.contactpersontext +
											'</td></tr>');
						}
					
						if (ns1blankspace.objectContextData.duedatetime != '')
						{
							var oDate = Date.parse(ns1blankspace.objectContextData.duedatetime);
								
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Date</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryDate" class="ns1blankspaceSummary">' +
											oDate.toString("ddd, dd MMM yyyy") +
											'</td></tr>');
						
							if (oDate.getHours() != 0 || oDate.getMinutes() != 0)
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Time</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryTime" class="ns1blankspaceSummary">' +
											oDate.toString("h:mm tt") +
											'</td></tr>');
							}					
						
						}

						if (ns1blankspace.objectContextData.actiontypetext != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Type</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.actiontypetext +
										'</td></tr>');
						}		
						
						if (ns1blankspace.objectContextData.statustext != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Status</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.statustext +
										'</td></tr>');
						}	
			
						aHTML.push('</table>');		

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');

						if (ns1blankspace.objectContextData.description != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.description +
											'</td></tr>');
						}

						aHTML.push('</table>');		

						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));
					}	
				},
	
	details: 	function ()
				{
					var aHTML = [];
				
					if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDetails').attr('data-loading', '');
								
						aHTML.push('<table class="ns1blankspaceContainer">');
						aHTML.push('<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainDetails').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Subject' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsSubject" class="ns1blankspaceText">' +
										'</td></tr>');			
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsDate" class="ns1blankspaceDate">' +
										'</td></tr>');		
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Type' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceDetailsType" class="ns1blankspaceSelect"' +
												' data-method="SETUP_ACTION_TYPE_SEARCH"' +
												' data-cache="true">' +
										'</td></tr>');		
												
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Action By' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceDetailsActionBy" class="ns1blankspaceSelect"' +
												' data-method="CORE_USER_SEARCH"' +
												' data-columns="firstname-space-surname">' +
										'</td></tr>');	
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Business' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsBusiness" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_BUSINESS_SEARCH"' +
											' data-columns="tradename">' +
										'</td></tr>');	
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Person' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPerson" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_PERSON_SEARCH"' +
											' data-columns="firstname-space-surname"' +
											' data-parent="ns1blankspaceDetailsBusiness"' +
											' data-parent-search-id="contactbusiness"' +
											' data-parent-search-text="tradename">' +
										'</td></tr>');							
								
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						$('input.ns1blankspaceDate').datetimepicker({ 
							dateFormat: 'dd M yy',
							timeFormat: 'h:mm TT',
							stepMinute: 5,
							ampm: true
							});
						
						var aHTML = [];
							
						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Not Started' +
											'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>In Progress' +
											'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Cancelled' +
											'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Completed' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Duration (Minutes)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsDurationMinutes" class="ns1blankspaceText" style="width:120px;">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Billing' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioBillingStatus3" name="radioBillingStatus" value="3"/>Not sure' +
											'<br  /><input type="radio" id="radioBillingStatus2" name="radioBillingStatus" value="2"/>Don\'t bill' +
											'<br /><input type="radio" id="radioBillingStatus1" name="radioBillingStatus" value="1"/>Billable' +		
											'<br /><input type="radio" id="radioBillingStatus4" name="radioBillingStatus" value="4"/>Approved for billing' +
											'<br /><input type="radio" id="radioBillingStatus5" name="radioBillingStatus" value="5"/>Has been billed' +
										'</td></tr>');

						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsSubject').val(ns1blankspace.objectContextData.subject);
							
							var sDate = new Date(ns1blankspace.objectContextData.duedatetime);
							sDate = $.fullCalendar.formatDate(sDate, 'dd MMM yyyy h:mm TT')
							$('#ns1blankspaceDetailsDate').val(sDate);
							
							$('#ns1blankspaceDetailsType').attr("data-id", ns1blankspace.objectContextData.actiontype);
							$('#ns1blankspaceDetailsType').val(ns1blankspace.objectContextData.actiontypetext);
							$('#ns1blankspaceDetailsActionBy').attr("data-id", ns1blankspace.objectContextData.actionby);
							$('#ns1blankspaceDetailsActionBy').val(ns1blankspace.objectContextData.actionbytext);
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
							$('[name="radioBillingStatus"][value="' + ns1blankspace.objectContextData.billingstatus + '"]').attr('checked', true);
							
							$('#ns1blankspaceDetailsBusiness').attr("data-id", ns1blankspace.objectContextData.contactbusiness);
							$('#ns1blankspaceDetailsBusiness').val(ns1blankspace.objectContextData.contactbusinesstext);
							
							$('#ns1blankspaceDetailsPerson').attr("data-id", ns1blankspace.objectContextData.contactperson);
							$('#ns1blankspaceDetailsPerson').val(ns1blankspace.objectContextData.contactpersontext);

							$('#ns1blankspaceDetailsDurationMinutes').val(ns1blankspace.objectContextData.totaltimemin);
						}
						else
						{
							$('#ns1blankspaceDetailsDate').val(Date.today().toString("dd MMM yyyy"));

							$('[name="radioStatus"][value="1"]').attr('checked', true);
							$('[name="radioBillingStatus"][value="3"]').attr('checked', true);
							
							if (ns1blankspace.data.contactbusiness != undefined)
							{$('#ns1blankspaceDetailsBusiness').attr("data-id", ns1blankspace.action.contactbusiness);}
							
							if (ns1blankspace.data.contactbusinesstext != undefined)
							{$('#ns1blankspaceDetailsBusiness').val(ns1blankspace.action.contactbusinesstext);}
							
							if (ns1blankspace.data.contactperson != undefined)
							{$('#ns1blankspaceDetailsPerson').attr("data-id", ns1blankspace.action.contactperson);}
							
							if (ns1blankspace.data.contactpersontext != undefined)
							{$('#ns1blankspaceDetailsPerson').val(ns1blankspace.action.contactpersontext);}

							$('#ns1blankspaceDetailsActionBy').attr("data-id", ns1blankspace.user.id);
							$('#ns1blankspaceDetailsActionBy').val(ns1blankspace.user.logonName);
						}
					}	
				},

	description:
				function ()
				{	
					var aHTML = [];
					
					if ($('#ns1blankspaceMainDescription').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDescription').attr('data-loading', '');
							
						aHTML.push('<table class="ns1blankspaceContainer">');
						aHTML.push('<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDescriptionColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceDescriptionColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainDescription').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="interfaceMain">');
								
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="30" cols="50" id="ns1blankspaceDescription" class="ns1blankspaceTextMulti ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDescriptionColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDescription').val(unescape(ns1blankspace.objectContextData.description));
						}
					}	
				},

	save: 		{			
					send:		function (oParam, oResponse)
								{
									var iType = ns1blankspace.data.actionTypes.meeting;
									
									if (oResponse == undefined)
									{
										if (oParam != undefined)
										{
											if (oParam.type != undefined) {iType = oParam.type}
											if (oParam.object == undefined) {oParam.object = ns1blankspace.object}
											if (oParam.objectContext == undefined) {oParam.objectContext = ns1blankspace.objectContext}

											var sData = 'object=' + ns1blankspace.util.fs(oParam.object);
											sData += '&objectcontext=' + ns1blankspace.util.fs(oParam.objectContext);
											sData += '&subject=' + ns1blankspace.util.fs(oParam.subject);
											sData += '&description=' + ns1blankspace.util.fs(oParam.description);
											sData += '&priority=' + ns1blankspace.util.fs(oParam.description);
											sData += '&status=' + ns1blankspace.util.fs(oParam.status);
											sData += '&type=' + ns1blankspace.util.fs(iType);
											sData += '&date=' + ns1blankspace.util.fs(oParam.date);
											sData += '&enddate=' + ns1blankspace.util.fs(oParam.endDate);
											sData += '&actionby=' + ns1blankspace.util.fs(oParam.actionBy);
											sData += '&contactbusiness=' + ns1blankspace.util.fs(oParam.contactBusiness);
											sData += '&contactperson=' + ns1blankspace.util.fs(oParam.contactPerson);
											
											sData += (oParam.otherData == undefined ? '' : oParam.otherData)
										}	
										else	  
										{
											if (ns1blankspace.objectContext != -1)
											{
												var sData = 'id=' + ns1blankspace.objectContext;
											}
											else
											{
												var sData = 'id=';
											}
											
											if ($('#ns1blankspaceMainDetails').html() != '')
											{
												sData += '&subject=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSubject').val());
												sData += '&priority=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPriority').attr('data-id'));				
												sData += '&type=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsType').attr('data-id'));
												sData += '&date=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDate').val());
												sData += '&contactbusiness=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsBusiness').attr("data-id"));
												sData += '&contactperson=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPerson').attr("data-id"));
												sData += '&actionby=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsActionBy').attr("data-id"));
												sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
												sData += '&billingstatus=' + ns1blankspace.util.fs($('input[name="radioBillingStatus"]:checked').val());
												sData += '&totaltimemin=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDurationMinutes').val());		
											}
											
											if ($('#ns1blankspaceMainDescription').html() != '')
											{
												sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceDescription').val());
											}
										}
										  
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data) {ns1blankspace.action.save.process(oParam, data);}
										});
									}
								},	

					process: 	function (oParam, oResponse)
								{

									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');
										ns1blankspace.objectContext = oResponse.id;	
									
										var dStartDate = new Date;
										var dEndDate = dStartDate;
										var sTitle = '';
										var sCalendarXHTMLElementID;
										
										if (oParam != undefined)
										{
											if (oParam.date != undefined) {sStartDate = oParam.date}
											if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
											if (oParam.title != undefined) {sTitle = oParam.title}
											if (oParam.calendarXHTMLElementID != undefined) {sCalendarXHTMLElementID = oParam.calendarXHTMLElementID}
										}	
									
										if (sCalendarXHTMLElementID != undefined)
										{
											$('#' + sCalendarXHTMLElementID).fullCalendar('renderEvent',
											{
												id: ns1blankspace.objectContext,
												title: sTitle,
												start: sStartDate, 
												end: sEndDate, 
												allDay: false},
												true
											);
										}
										
										ns1blankspace.inputDetected = false;
										ns1blankspace.action.search.send('-' + ns1blankspace.objectContext, {source: 1});
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}
				},

	list: 		{
					show:		function (oParam)
								{
									var iObject = ns1blankspace.object;
									var iObjectContext = ns1blankspace.objectContext;
									var iActionType;

									if (oParam != undefined)
									{
										if (oParam.object != undefined) {iObject = oParam.object}
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.actionType != undefined) {iActionType = oParam.actionType}
									}

									if (lObjectContext != -1)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
										oSearch.addField('subject,description,actiondate');

										if (bAll && (iObject == 32 || iObject == 12))
										{
											if (iObject == 32)
											{
												oSearch.addFilter('contactperson', 'EQUAL_TO', iObjectContext);
											}	
											else if (iObject == 12)
											{
												oSearch.addFilter('contactbusiness', 'EQUAL_TO', iObjectContext);
											}	
										}
										else
										{
											oSearch.addFilter('object', 'EQUAL_TO', iObject);
											oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext);
										}	
										
										switch (iActionType)
										{
											case ns1blankspace.data.actionType.fileNote:
												oSearch.addFilter('type', 'EQUAL_TO', 4);
												break;
											
											case ns1blankspace.data.actionType.emailSent:
												oSearch.addFilter('type', 'IN_LIST', '5,9,10');
												break;
											
											default:
												oSearch.addFilter('type', 'EQUAL_TO', iActionType);
										}

										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										
										oSearch.getResults(function(data) {ns1blankspace.financial.payment.refresh(data)});
									}
								},

					process:	function (oResponse, oParam)
								{	
									var iObject = ns1blankspace.object;
									var iObjectContext = ns1blankspace.objectContext;
									var sXHTMLElementID = ns1blankspace.xhtml.container;
									var bAll = false;
									var iActionType;

									if (oParam != undefined)
									{
										if (oParam.object != undefined) {iObject = oParam.object}
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.all != undefined) {bAll = oParam.all}
										if (oParam.actionType != undefined) {iActionType = oParam.actionType}
									}

									var aHTML = [];
									
									if (oResponse.data.rows.length == 0)
									{
										aHTML.push('<table id="ns1blankspaceMostLikely">');
										aHTML.push('<tr><td class="ns1blankspaceNothing">No actions.</td></tr>');
										aHTML.push('</table>');
										
										$('#' + sXHTMLElementID).html(aHTML.join(''));
										$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
									}
									else
									{
										aHTML.push('<table class="ns1blankspace ns1blankspaceActionList">');
										aHTML.push('<tr class="ns1blankspaceCaption">');

										switch (sActionType)
										{
											case ns1blankspace.data.actionType.fileNote:

												aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Who</td>');
												break;

											case ns1blankspace.data.actionType.emailSent:

												aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Subject</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
												break;
												
											case ns1blankspace.data.actionType.meeting:

												aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Type</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Who</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Hours</td>');
												break;

											default:

												aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Time</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Subject</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
										}

										aHTML.push('</tr>');

										$.each(oResponse.data.rows, function()
										{
											
											aHTML[++h] = '<tr class="interfaceActions">';

											switch (iActionType)
											{
												case ns1blankspace.data.actionType.fileNote:

													aHTML.push('<td id="ns1blankspaceAction_date-' + this.id + '" class="ns1blankspaceRow">' +
																	this.actiondate + '</td>');
													aHTML.push('<td id="ns1blankspaceAction_description-' + this.id + '" class="ns1blankspaceRow">' +
																	this.description + '</td>');
													aHTML.push('<td id="ns1blankspaceAction_actionby-' + this.id + '" class="ns1blankspaceRow">' +
																	this.actionbyfirstname + ' ' + this.actionbysurname + '</td>');
													break;
												
												case ns1blankspace.data.actionType.emailSent:

													aHTML.push('<td id="ns1blankspaceAction-date-' + this.id + '" class="ns1blankspaceRow">' +
																	this.actiondate + '</td>');
													aHTML.push('<td id="ns1blankspacedAction-subject-' + this.id + '" class="ns1blankspaceRow">' +
																	this.subject + '</td>');
													aHTML.push('<td id="tns1blankspaceAction-description-' + this.id + '" class="ns1blankspaceRow">' +
																	this.description + '</td>');
													break;
												
												case ns1blankspace.data.actionType.meeting:

													aHTML.push('<td id="ns1blankspaceAction-date-' + this.id + '" class="ns1blankspaceRow">' +
																	this.actiondate + '</td>');
													aHTML.push('<td id="ns1blankspaceAction-type-' + this.id + '" class="ns1blankspaceRow">' +
																	this.typetext + '</td>');
													aHTML.push('<td id="ns1blankspaceAction-actionby-' + this.id + '" class="ns1blankspaceRow">' +
																	this.actionby + '</td>');
													aHTML.push('<td id="ns1blankspaceAction-hours-' + this.id + '" class="ns1blankspaceRow">' +
																	this.hours + '</td>');
													break;
												
												default:

													aHTML.push('<td id="ns1blankspaceAction_date-' + this.id + '" class="ns1blankspaceRow">' +
																		this.actiondate + '</td>');
													
													var oDate = new Date.parse(ns1blankspace.objectContextData.actiondate);
															
													if (oDate.getHours() != 0 && oDate.getMinutes() != 0)
													{
														aHTML.push('<td id="ns1blankspaceAction_time-' + this.id + '" class="ns1blankspaceRow">' +
																		oDate.toString('h:mm TT') + '</td>');
													}
													
													aHTML.push('<td id="ns1blankspaceAction-subject-' + this.id + '" class="ns1blankspaceRow">' +
																	this.subject + '</td>');
													aHTML.push('<td id="ns1blankspaceAction-description-' + this.id + '" class="ns1blankspaceRow">' +
																	this.description + '</td>');
											}

											aHTML.push('<td id="tdAction-options-' + this.id + '" class="ns1blankspaceRow">&nbsp;</td>');
											aHTML.push('</tr>');
										});
								    	
										aHTML.push('</table>');

										$('#' + sXHTMLElementID).html(aHTML.join(''));
										$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
										
										$('ns1blankspaceActionList > td.ns1blankspaceRow').click(function(event)
										{
											ns1blankspace.edit.start(event.target.id);
										});
									}
								},
				},				

	snapshot: 	{
					show: 		function (oParam)
								{
									var sXHTMLElementID;
									var iObject;
									var iObjectContext;

									if (oParam != undefined)
									{
										if (oParam.object != undefined) {iObject = oParam.object}
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
									}
											
									var oSearch = new AdvancedSearch();
									oSearch.method = 'ACTION_SEARCH';
									oSearch.addField('reference,date,hours');

									if (iObject != undefined)
									{		
										oSearch.addFilter('object', 'EQUAL_TO', iObject);
									}
										
									if (iObjectContext != undefined)
									{		
										oSearch.addFilter('objectContext', 'EQUAL_TO', iObjectContext);
									}
										
									oSearch.addFilter('status', 'EQUAL_TO', giActionStatusInProgress);
									oSearch.rows = 5;	
									oSearch.sort('actiondate', 'desc');

									oSearch.getResults(function(data) {ns1blankspace.action.snapshot.process(oParam, data)});
								},

					process:	function (oParam, oResponse)
								{
									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}
											
									var aHTML = [];
									
									if (oResponse.data.rows.length > 0)
									{
										aHTML.push('<table class="ns1blankspace">');
									
										$.each(oResponse.data.rows, function()
										{
											aHTML.push('<tr><td class="ns1blankspaceRow');
											
											if (this.priority == ns1blankspace.action.data.priority.high) 
												{ aHTML.push(' ns1blankspaceImportant'); }
												
											aHTML.push('" id="ns1blankspacedAction_date-' + this.id + '" class="ns1blankspaceRow">' +
															this.actiondate + '</td>');

											aHTML.push('<td id="ns1blankspaceAction_description-' + this.id + '"class="ns1blankspaceRow" >' +
															this.description + '</td>');

											aHTML.push('</tr>');
										});
										
										aHTML.push('<table>');

										$('#'+ sXHTMLElementID).html(aHTML.join(''));
									}
									
								}
				},				

	calendar: 	{

					show:		function (oParam)
								{	
									var sXHTMLElementID = 'ns1blankspaceMainCalendar';		
									var bEventFetch = true;
									var iSourceObject = 17;
									
									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.eventFetch != undefined) {bEventFetch = oParam.eventFetch}
										if (oParam.sourceObject != undefined) {iSourceObject = oParam.sourceObject}
									}
									
									$('#' + sXHTMLElementID).html('');
									
									if (!ns1blankspace.action.data.calendarUsers) {ns1blankspace.action.data.calendarUsers = []}

									if (ns1blankspace.action.data.calendarUsers.length == 0 && bEventFetch)
									{
										if (ns1blankspace.action.data.user != undefined)
										{
											ns1blankspace.action.data.calendarUsers.push(ns1blankspace.action.user);
										}
										else
										{	
											ns1blankspace.action.data.calendarUsers.push(ns1blankspace.user.id);
										}	
									}	
									
									$(ns1blankspace.xhtml.container).hide(0);
									
									$('#' + sXHTMLElementID).css('font-size', '0.825em');

									$('#' + sXHTMLElementID).fullCalendar(
									{
										theme: true,
										defaultView: 'agendaWeek',
										header: {
											left: 'prev,next',
											center: 'title',
											right: 'today month,agendaWeek,agendaDay'
										},
										
										titleFormat: 	{
															month: 'MMMM yyyy',
															week: "MMMM yyyy",
															day: 'MMMM yyyy'
														},

										timeFormat: 'h(:mm)tt',
										
										editable: true,
										firstHour: 7,
										minTime: 7,
										droppable: true,
										selectable: true,
										allDaySlot: false,				
										selectHelper: true,
										unselectCancel: '#ns1blankspaceActionDialogEdit *',
										
										drop: 	function(date, allDay) 
														{ 
															var originalEventObject = $(this).data('eventObject');
															var copiedEventObject = $.extend({}, originalEventObject);

															copiedEventObject.start = date;
															copiedEventObject.allDay = allDay;
															
															ns1blankspace.action.dialog.show(
															{
																startDate: date
															});
															
														},	
										
										columnFormat: 	{	
															month: 'ddd',    
															week: 'ddd d/M', 
															day: 'dddd d/M'
														},
										
										select: 		function(startDate, endDate, allDay, jsEvent, view )
														{
															ns1blankspace.action.dialog.show(
															{
																startDate: startDate,
																endDate: endDate
															});
														},
												
										eventClick: 	function(calEvent, jsEvent, view) 
														{
															if (calEvent.editable ? calEvent.editable : true)
															{
																ns1blankspace.action.dialog.show(
																{
																	actionID: calEvent.id,
																	startDate: calEvent.start,
																	endDate: calEvent.end,
																	calEvent: calEvent
																});
															};		
														},
										
										dayClick: 		function(date, allDay, jsEvent, view) 
														{
														    if (allDay) 
															{
																//alert('Clicked on the entire day: ' + date);
															}
															else
															{
																
															}
														},
										
										eventDrop: 		function(event,dayDelta,minuteDelta,allDay,revertFunc) 
														{
															if (event.sequence > 1 || event.hoursremaining > 0) 
															{
																alert('You can not drag a multi-day event. Click on the event and edit the date and time as required.');
																revertFunc();
															}
															else
															{
																var sParam = '/ondemand/action/?rf=JSON&method=ACTION_MANAGE';
																var sData = 'id=' + event.id;
																
																sData += '&actionby=' + event.user;
																sData += '&daydelta=' + ns1blankspace.util.fs(dayDelta);
																sData += '&minutedelta=' + ns1blankspace.util.fs(minuteDelta);
																
																$.ajax(
																{
																	type: 'POST',
																	url: sParam,
																	data: sData,
																	dataType: 'json',
																	success: $('#divInterfaceMainCalendar').fullCalendar('refetchEvents')
																});
															}
														},
										
										eventMouseover: function( event, jsEvent, view ) 
														{
															if (event.contactBusinessText !== undefined)
															{	
																ns1blankspace.status.message(event.contactBusinessText);
															}	
														},
										
										eventMouseout: 	function( event, jsEvent, view ) 
														{
															ns1blankspace.status.message('');
														},
														
										eventResize: 	function(event,dayDelta,minuteDelta,revertFunc) 
														{
															if (event.sequence > 1 || event.hoursremaining > 0) 
															{
																alert('You can not resize a multi-day event. Click on the event and edit the date and time as required.');
																revertFunc();
															}
															else
															{
																var sData = 'id=' + event.id;
																
																sData += '&actionby=' + event.user;
																sData += '&enddaydelta=' + ns1blankspace.util.fs(dayDelta);
																sData += '&endminutedelta=' + ns1blankspace.util.fs(minuteDelta);
																
																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
																	data: sData,
																	dataType: 'json',
																});
															}	
														},
										
										viewDisplay: 	function(view) 
														{
															ns1blankspace.action.calendar.unavailable();	
														}
									});	
									
									$.each(ns1blankspace.action.data.calendarUsers, function() 
									{ 
										$('#' + sXHTMLElementID).fullCalendar('addEventSource', 
										{
											url: ns1blankspace.util.endpointURI('ACTION_CALENDAR_SEARCH') + ns1blankspace.action.calendarParam +
														'&rf=JSON&diary=1&usercolours=1&titleoption=1&actionby=' + this
										})
									});
									
								},

					unavailable:			
								function ()
								{
									var aDays = [];
									var iStartHour = 0;
									var iEndHour = 24;
									var sNotAvailableDayClasses = aDays.join(' ')
									var bAvailable = true;

									if (ns1blankspace.action.calendarUsers.length > 0) 
									{ 
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('SETUP_USER_SEARCH'),
											data: 'profile=445-446-447&users=' + ns1blankspace.action.calendarUsers.toString('-'),
											dataType: 'json',
											success: function (data) 
											{
												$(data.profile445).each(function()
												{
													var aDaysTmp = $(this).split(',')
													
													$.each(aDaysTmp, function() 
													{
														if ($.inArray(this, aDays) == -1)
														{
															aDays.push(String(this))
														}	
													});	
												});

												$(data.profile446).each(function()
												{
													if (parseInt(this) > iStartHour) {iStartHour = parseInt(this)}
												});

												$(data.profile447).each(function()
												{
													if (parseInt(this) < iEndHour) {iEndHour = parseInt(this)}
												});
												
												$('td.ui-widget-content').each(function()
												{ 
													var aClass = ($(this).attr('class')).split(' ');
													
													bAvailable = true;				
													
													$.each(aClass, function() 
													{ 
														if ($.inArray((this).replace('fc-',''), aDays) != -1)
														{
															bAvailable = false;
														}	
													});
												 
													if (!bAvailable)
													{  
														$(this).css({ 'background':'none', 'background-color' : '#E0E0E0' });
													} 
												});  
								 
												$('.fc-agenda-axis').each(function()
												{
													var sTime = $.trim(($(this).text()).toLowerCase());
													
													if (sTime != '')
													{
														bAvailable = true;	
														var sTimeHour = sTime;
														sTimeHour = sTimeHour.replace('am', '');
														sTimeHour = sTimeHour.replace('pm', '');
														var iTimeHour = parseInt(sTimeHour);
														if (sTime.indexOf('pm') > 0 && iTimeHour < 12) {iTimeHour += 12}
														if (iTimeHour < iStartHour) {bAvailable = false}
														if (iTimeHour >= iEndHour) {bAvailable = false}
													}
													
													if (!bAvailable)
													{
														$(this).parent().css('background-color','#E0E0E0');
													}	
												});
											}
										});
									}
								}
				},				

	dialog: 	{
					show:		function (oParam, oResponse)
								{
									var iActionID = -1;
									var dStartDate = new Date();
									var dEndDate = dStartDate;
									var oCalEvent;
									
									if (oParam != undefined)
									{
										if (oParam.actionID != undefined) {iActionID = oParam.actionID};
										if (oParam.startDate != undefined) {dStartDate = oParam.startDate};
										if (oParam.endDate != undefined) {dEndDate = oParam.endDate};
										if (oParam.calEvent != undefined) {oCalEvent = oParam.calEvent};
									}	

									dStartDate = $.fullCalendar.formatDate(dStartDate, "dd MMM yyyy") + 
													' ' + $.fullCalendar.formatDate(dStartDate, "hh:mm TT")

									dEndDate = $.fullCalendar.formatDate(dEndDate, "dd MMM yyyy") + 
													' ' + $.fullCalendar.formatDate(dEndDate, "hh:mm TT")

									if (iActionID != -1 && oResponse == undefined)
									{
										ns1blankspace.status.working();

										var oSearch = new AdvancedSearch();
										oSearch.method = 'ACTION_SEARCH';
										oSearch.addField('subject,description,actionby,contactperson,contactpersontext,contactbusiness,contactbusinesstext,date');
										oSearch.addFilter('id', 'EQUAL_TO', iActionID);
										oSearch.getResults(function(data) {ns1blankspace.action.dialog.show(oParam, data)});
									}
									else
									{
										ns1blankspace.status.message('');

										var aHTML = [];
										
										aHTML.push('<table id="ns1blankspaceActionDialogEdit" class="ns1blankspaceSearchMedium" style="margin-bottom:0px;">');
										
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Subject</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceActionCalendarSubject" class="ns1blankspaceText">');

										aHTML.push('</td></tr>');
										
										aHTML.push('<tr><td class="ns1blankspaceText">' +
															'<textarea rows="5" cols="35" id="ns1blankspaceActionCalendarDescription"' +
															' class="ns1blankspaceTextMultiSmall"></textarea>');
										
										aHTML.push('</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Business' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceActionCalendarBusiness" class="ns1blankspaceSelect"' +
															' data-method="CONTACT_BUSINESS_SEARCH"' +
															' data-columns="tradename">' +
														'</td></tr>');	
											
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Person' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceActionCalendarPerson" class="ns1blankspaceSelect"' +
															' data-method="CONTACT_PERSON_SEARCH"' +
															' data-columns="firstname-space-surname"' +
															' data-parent="ns1blankspaceActionCalendarBusiness"' +
															' data-parent-search-id="contactbusiness"' +
															' data-parent-search-text="tradename">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Start</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceActionCalendarStart" class="ns1blankspaceDate">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'End</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceActionCalendarEnd" class="ns1blankspaceDate">');
				
										//aHTML.push('<tr><td class="ns1blankspace">' +
										//					'<input type="checkbox" id="ns1blankspaceActionCalendarHighPriority"/>&nbsp;High Priority?<td></tr>');

										aHTML.push('<tr><td>');

										aHTML.push('</table>');	
									
										aHTML.push('<table style="background-color:#E8E8E8;"><tr>');
										
										if (iActionID != -1)
										{	
											aHTML.push('<td style="text-align:left; padding:4px;">' +
															'<span id="ns1blankspaceActionCalendarMore" class="ns1blankspaceAction">More</span>' +
															'<td>');
										}

										aHTML.push('<td style="text-align:right; padding:4px;">' +
															'<span id="ns1blankspaceActionCalendarSave" class="ns1blankspaceAction" style="margin-right:3px;">Save</span>' +
															'<span id="ns1blankspaceActionCalendarCancel" class="ns1blankspaceAction">Cancel</span>' +
															'<td></tr>');
										
										aHTML.push('</table>');						

									
										var oElement = $('#ns1blankspaceMain')
										
										$('#ns1blankspaceMultiUseDialog').html('');
										$('#ns1blankspaceMultiUseDialog').show();
										$('#ns1blankspaceMultiUseDialog').offset({ top: $(oElement).offset().top - 2 , left: $(oElement).offset().left - 160 });
										$('#ns1blankspaceMultiUseDialog').html(aHTML.join(''));

										$('input.ns1blankspaceDate').datetimepicker(
										{ 
											dateFormat: 'dd M yy',
											timeFormat: 'h:mm TT',
											stepMinute: 5,
											ampm: true
										});
										
										$('#ns1blankspaceActionCalendarCancel').button(
										{
											label: 'Cancel'
										})
										.click(function()
										{
											$('#ns1blankspaceMultiUseDialog').slideUp(500);
											$('#ns1blankspaceMultiUseDialog').html('');
										});

										$('#ns1blankspaceActionCalendarMore').button(
										{
											label: 'More'
										})
										.click(function()
										{
											$('#ns1blankspaceMultiUseDialog').slideUp(500);
											$('#ns1blankspaceMultiUseDialog').html('');
											ns1blankspace.action.init({id: iActionID})
										});

										$('#ns1blankspaceActionCalendarSave').button(
										{
											label: 'Save'
										})
										.click(function()
										{
											ns1blankspace.action.dialog.save(
											{
												id: iActionID,
												date: $('#ns1blankspaceActionCalendarStart').val(),
												endDate: $('#ns1blankspaceActionCalendarEnd').val(),
												subject: $('#ns1blankspaceActionCalendarSubject').val(),
												description: $('#ns1blankspaceActionCalendarDescription').val(),
												priority: ($('#ns1blankspaceActionCalendarHighPriority').attr('checked')?3:2),
												calendarXHTMLElementID: 'ns1blankspaceMainCalendar',
												contactPerson: $('#ns1blankspaceActionCalendarPerson').attr('data-id'),
												contactPersonText: $('#ns1blankspaceActionCalendarPerson').val(),
												contactBusiness: $('#ns1blankspaceActionCalendarBusiness').attr('data-id'),
												contactBusinessText: $('#ns1blankspaceActionCalendarBusiness').val(),
												calEvent: oCalEvent
											});
											
											$('#ns1blankspaceMultiUseDialog').slideUp(500);
											$('#ns1blankspaceMultiUseDialog').html('');
										})
										
										if (oResponse != undefined)
										{	
											if (oResponse.data.rows.length != 0)
											{	
												var oRow = oResponse.data.rows[0];
												$('#ns1blankspaceActionCalendarSubject').val(oRow.subject);
												$('#ns1blankspaceActionCalendarDescription').val(oRow.description);
												$('#ns1blankspaceActionCalendarBusiness').attr('data-id', oRow.contactbusiness);
												$('#ns1blankspaceActionCalendarBusiness').val(oRow.contactbusinesstext);
												$('#ns1blankspaceActionCalendarPerson').attr('data-id', oRow.contactperson);
												$('#ns1blankspaceActionCalendarPerson').val(oRow.contactpersontext);
												$('#ns1blankspaceActionCalendarStart').val(dStartDate);
												$('#ns1blankspaceActionCalendarEnd').val(dEndDate);
											}	
										}
										else
										{
											$('#ns1blankspaceActionCalendarStart').val(dStartDate);
											$('#ns1blankspaceActionCalendarEnd').val(dEndDate);
										}
									}
								},

				save: 			function (oParam, oResponse)
								{	
									var oData = {};
									var iType = ns1blankspace.data.actionTypes.meeting.id;
									var bAsync = true;
									var iHours;
									var sEndDate;
									var iActionBy = ns1blankspace.user.id;
									var oCalEvent;
									var sContactBusinessText = '';
									
									if (oParam != undefined)
									{
										if (oParam.type != undefined) {iType = oParam.type}
										if (oParam.async != undefined) {bAsync = oParam.async}
										if (oParam.hours != undefined) {iHours = oParam.hours}
										if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
										if (oParam.actionBy != undefined) {iActionBy = oParam.actionBy}
										if (oParam.calEvent != undefined) {oCalEvent = oParam.calEvent};
										if (oParam.contactBusinessText != undefined) {sContactBusinessText = oParam.contactBusinessText};
									}	
										
									if (oResponse == undefined)
									{
										if (oParam.id != -1) {oData.id = oParam.id}
										oData.object = oParam.object;
										oData.objectcontext = oParam.objectContext;
										oData.subject = oParam.subject;
										oData.description = oParam.description;
										oData.priority = oParam.priority;
										oData.status = oParam.status;
										oData.type = iType;
										oData.date = oParam.date;
										oData.actionby = iActionBy;
										oData.contactbusiness = oParam.contactBusiness;
										oData.contactperson = oParam.contactPerson;
										
										if (iHours != undefined)
										{
											oData.totaltimehours = iHours;
										}
										
										if (sEndDate != undefined)
										{
											oData.enddate = sEndDate;
										}
																					  
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
											data: oData,
											dataType: 'json',
											async: bAsync,
											success: function(data) {ns1blankspace.action.dialog.save(oParam, data);}
										});
									}
									else	
									{
										if (oResponse.status == 'OK')
										{
											ns1blankspace.status.message('Saved');

											var iActionID = oResponse.id;	
										
											var dStartDate = new Date;
											var dEndDate = dStartDate;
											var sTitle = '';
											var sXHTMLElementID = 'ns1blankspaceMainCalendar';
											
											if (oParam != undefined)
											{
												if (oParam.date != undefined) {sStartDate = oParam.date}
												if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
												if (oParam.subject != undefined) {sTitle = oParam.subject}
												if (oParam.xhtmlElementID != undefined) { sXHTMLElementID = oParam.xhtmlElementID}
											}	
											
											if (sXHTMLElementID != undefined)
											{
												if (oCalEvent !== undefined)
												{
													oCalEvent.title = sTitle + ' - ' + sContactBusinessText;
													oCalEvent.start = sStartDate;
													oCalEvent.end = sEndDate;
														
													$('#' + sXHTMLElementID).fullCalendar('updateEvent', oCalEvent);
												}	
												else
												{	
													$('#' + sXHTMLElementID).fullCalendar('renderEvent',
													{
														id: 	iActionID,
														title: 	sTitle + ' - ' + sContactBusinessText,
														start: 	sStartDate, 
														end: 	sEndDate, 
														allDay: false
													});
												}	
											}
										}
										else
										{
											ns1blankspace.status.error(oResponse.error.errornotes);
										}
									}
								},					

					quickNote:	function (iObject, iObjectContext)
								{
									var aHTML = [];
									
									aHTML.push('<table id="ns1blankspace">');
									
									aHTML.push('<tr><td class="ns1blankspaceCaption">' +
														'Note<td></tr>' +
														'<tr><td class="ns1blankspaceTextMulti">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceActionNoteDescription" class="ns1blankspaceTextMulti"></textarea>' +
														'</td></tr>');
														
									aHTML.push('<tr><td class="ns1blankspaceCheck">' +
														'<input type="checkbox" id="ns1blankspaceActionNoteDescription"/>&nbsp;High Priority?<td></tr>');
														
									aHTML.push('</table>');						
									
									$('#ns1blankspaceMultiUseDialog').html(aHTML.join(''));
									
									$('#ns1blankspaceMultiUseDialog').dialog(
										{
											width: 300,
											resizable: false,
											modal: true,
											title: 'Add Note',
											buttons: 
											{
												"Cancel": 	function() 
															{
																$(this).dialog( "close" );
															},
												"Add Note": function() 
															{
																ns1blankspace.action.dialog.save(
																{
																	reference: '',
																	description: $('#ns1blankspaceActionNoteDescription').val(),
																	type: ns1blankspace.data.actionType.fileNote,
																	priority: ($('#ns1blankspaceActionNoteDescription').attr('checked') ? 3 : 2)
																});

																$(this).dialog("close");
															}
											}
										});
								}
				},

	next10: 	function (oParam, oResponse)
				{	
					var sXHTMLElementID = 'ns1blankspaceMainNext10';
					var sDate;

					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined)
						{
							sXHTMLElementID = oParam.xhtmlElementID;
						}	
					}	
					
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
						oSearch.addFilter('duedate', 'GREATER_THAN_OR_EQUAL_TO', 'hour', '0', 'start_of_today');

						oSearch.rows = 20
						oSearch.sort('duedate', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.action.next10(oParam, data)});
					}
					else
					{
						var aHTML = [];
					
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table class="ns1blankspace"><tr><td class="ns1blankspaceNothing">Nothing scheduled.</td></tr></table>');
							
							$('#' + sXHTMLElementID).html(aHTML.join(''));
							$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
						}
						else
						{
							aHTML.push('<table>');
							
							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr>');
													
								aHTML.push('<td id="ns1blankspaceAction_reference-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
													this.subject + '</td>');
								
								aHTML.push('<td id="tdAction_date-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRow">' +
													this.duedate + '</td>');

								sDate = '&nbsp;';
								var oDate = Date.parse(this.duedate);
										
								if (oDate != null)
								{ 			
									if (oDate.getHours() != 0 && oDate.getMinutes() != 0)
									{
										sDate = oDate.toString('h:mm TT');
									}
								}
								
								aHTML.push('<td id="ns1blankspaceAction_time-' + this.id + '" class="ns1blankspaceRow" >' +
												sDate + '</td>');
								
								aHTML.push('<td id="ns1blankspaceAction_contact-' + this.contactperson + '" class="ns1blankspaceRow ns1blankspaceRowSelectContact">' +
												this.contactpersontext + '</td>');
								
								aHTML.push('<td id="ns1blankspaceAction_description-' + this.id + '" class="ns1blankspaceRow">' +
												this.description + '</td>');
								
								aHTML.push('<td id="tdAction_options-' + this.id + '" class="ns1blankspaceRows" >&nbsp;</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');

							$('#' + sXHTMLElementID).html(aHTML.join(''));
							$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
							
							$('td.ns1blankspaceRowSelect').click(function(event)
							{
								ns1blankspace.action.search.send(event.target.id, {source: 1});
							});
							
							$('td.ns1blankspaceRowSelectContact').click(function(event)
							{
								ns1blankspace.contactPerson.search.init();
								ns1blankspace.contactPerson.search.send(event.target.id, {source: 1});
							});
							
						}
					}	
				}
}
