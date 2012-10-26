/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 


ns1blankspace.financial.payment = 
{
	init: 		function interfaceActionMasterViewport(oParam)
				{
					ns1blankspace.objectContext = -1;
					ns1blankspace.object = 17;	
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
					ns1blankspace.action.user = ns1blankspace.action.user;
					ns1blankspace.action.calendarParam = '';

					ns1blankspace.data.actionType = {meeting: 3, fileNote: 4, emailSent: 5, emailReceived: 9};

					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
						if (oParam.showNew != undefined) {bNew = oParam.showNew}
						if (oParam.contactPerson != undefined) {ns1blankspace.action.contactperson = oParam.contactPerson}
						if (oParam.contactBusiness != undefined) {ns1blankspace.action.contactbusiness = oParam.contactBusiness}
						if (oParam.contactPersonText != undefined) {ns1blankspace.action.contactpersontext = oParam.contactPersonText}
						if (oParam.contactBusinessText != undefined) {ns1blankspace.action.contactbusinesstext = oParam.contactBusinessText}
					}
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.action.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
				}

	home:	function (oParam)
				{
					var bCalendar = false;
					
					if (oParam != undefined)
					{
						if (oParam.calendar != undefined) {bCalendar = oParam.calendar}
					}	
					
					var aHTML = [];

					aHTML.push('<table>');

					aHTML.push('<tr><td id="ns1blankspaceViewActionLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlNext10" class="ns1blankspaceControl">Next 10</td>' +
									'</tr>');		

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlCalendar" class="ns1blankspaceControl">Calendar</td>' +
									'</tr>');

					aHTML.push('</table>');		
					
					$('#ns1blankspaceControl').html(aHTML.join(''));	

					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

					$('#divInterfaceMain').html(ns1blankspace.xhtml.loading);
				
					var aHTML = [];
					var h = -1;
					
					aHTML[++h] = '<div id="ns1blankspaceMainCalendar" class="ns1blankspaceMain"></div>';
					aHTML[++h] = '<div id="ns1blankspaceMainNext10" class="ns1blankspaceMain"></div>';
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlCalendar').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainCalendar'});
						ns1blankspace.action.calendar();
					});
					
					$('#ns1blankspaceControlNext10').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceNext10'});
						ns1blankspace.action.next10();
					});
						
					if (bCalendar)
					{
						$('#ns1blankspaceControlCalendar').addClass('ns1blankspaceHighlight');
						ns1blankspace.action.calendar();
					}
					else
					{
						$('#ns1blankspaceControlNext10').addClass('ns1blankspaceHighlight');
						ns1blankspace.action.next10();
					}	

				},

search: 	{
					send: 		function (sXHTMLElementId, oParam)
								{
									var aSearch = sXHTMLElementId.split('-');
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
										
										var sData = 'id=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('ACTION_SEARCH'),
											data: sData,
											dataType: 'json',
											success: function(data) {ns1blankspace.action.show(oParam, data)}
										});
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
											ns1blankspace.dialog.position(sElementId);
											ns1blankspace.search.start(sElementId);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'ACTION_SEARCH';
											oSearch.addField('subject');
											oSearch.rf = 'json';
											oSearch.addFilter('quicksearch', 'EQUAL_TO', sSearchText);	
											oSearch.getResults(function(data) {ns1blankspace.action.search.process(oParam, data)});
										}
									}	
								},

					process: 	function (oParam, oResponse)
								{
									var iColumn = 0;
									var	iMaximumColumns = 1;
									var aHTML = [];
										
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspace.search.stop();
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
										
											aHTML.push('<td class="ns1blankspaceSearch" id="' + +
															'-' + this.id + '">' +
															this.subject +
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

	new:		function (oParam)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspace.action.init();
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					ns1blankspace.action.details();
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
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">"' +
										'Summary</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');

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

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDescription" class="ns1blankspaceMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceMain"></div>');
						
					$('#ns1blankspaceMainMain').html(aHTML.join(''));
	
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainSummary'});
						ns1blankspace.action.summary.show();
					});

					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainDetails'});
						ns1blankspace.action.details();
					});
					
					$('#ns1blankspaceControlDescription').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainDescription', refresh: true});
						ns1blankspace.action.description();
					});

					$('#ns1blankspaceControlControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainAttachments', refresh: true});
						ns1blankspace.attachments.show({xhtmlElementID: 'divInterfaceMainAttachments'});
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
						
						if (ns1blankspace.objectContextData.type == ns1blankspace.data.actionType.emailSent || ns1blankspace.objectContextData.type == ns1blankspace.data.actionType.emailReceived)
								{iMessageActionID = ns1blankspace.objectContextData.id}
						
						if (ns1blankspace.objectContextData.type == ns1blankspace.data.actionType.fileNote && ns1blankspace.objectContextData.object == 17)
								{iMessageActionID = ns1blankspace.objectContextData.objectcontext}
								
						if (iMessageActionID != undefined)
						{
							ns1blankspace.messaging.init({autoShow: false});
							ns1blankspace.messaging.search.send({
								xhtmlElementID: '-' + iMessageActionID
								})	
						}
						else
						{
							$('#ns1blankspaceViewControlAction').button({disabled: false});
							$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
								
							$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.reference +
								'<br /><span id="ns1blankspaceControlContext_date" class="ns1blankspaceControlSubContext">' + ns1blankspace.objectContextData.actiondate + '</span>');
								
							ns1blankspace.history.view({
								newDestination: 'ns1blankspace.action.init({showHome: false});ins1blankspace.action.search.send("-' + ns1blankspace.objectContext + '")',
								move: false
								})
							
							ns1blankspace.history.object({functionDefault: 'ns1blankspace.action.summary()'});		
						}
						
						if (ns1blankspace.objectContext != -1) {ns1blankspace.action.summary()}
					}	
				},	
		
summary: 		function interfaceFinancialPaymentSummary()
				{
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the action.</td></tr></table>');
								
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
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
						
						var aHTML = [];

						aHTML[++h] = '<table class="ns1blankspaceColumn1">';
					
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
					
						if (ns1blankspace.objectContextData.actiondate != '')
						{
							var oDate = new Date.parse(ns1blankspace.objectContextData.actiondate);
								
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Date</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryDate" class="ns1blankspaceSummary">' +
											oDate.toString("ddd, dd MMM yyyy h:mm TT") +
											'</td></tr>');
						
							if (oDate.getHours() != 0 && oDate.getMinutes() != 0)
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Time</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryTime" class="ns1blankspaceSummary">' +
											oDate.toString("h:mm TT") +
											'</td></tr>');
							}					
						
						}

						if (ns1blankspace.objectContextData.typetext != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Type</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.typetext +
										'</td></tr>');
						}		
						
						if (ns1blankspace.objectContextData.statustext != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Status</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.statustext +
										'</td></tr>');
						}	

						if (ns1blankspace.objectContextData.description != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.description +
											'</td></tr>');
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
												' data-method="SETUP_ACTION_TYPE_SEARCH">' +
										'</td></tr>');		
												
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Action By' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceDetailsType" class="ns1blankspaceSelect"' +
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
											' data-columns="surname"' +
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
							
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Not Started' +
											'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>In Progress' +
											'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Cancelled' +
											'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Completed' +
										'</td></tr>');	

						aHTML[++h] = '</table>';					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputInterfaceMainDetailsSubject').val(ns1blankspace.objectContextData.reference);
							
							var sDate = new Date(ns1blankspace.objectContextData.actiondatetime);
							sDate = $.fullCalendar.formatDate(sDate, 'dd MMM yyyy h:mm TT')
							$('#inputInterfaceMainDetailsDate').val(sDate);
							
							$('#ns1blankspaceDetailsType').attr("data-id", ns1blankspace.objectContextData.type);
							$('#ns1blankspaceDetailsType').val(ns1blankspace.objectContextData.typetext);
							$('#ns1blankspaceDetailsActionBy').attr("data-id", ns1blankspace.objectContextData.actionby);
							$('#ins1blankspaceDetailsActionBy').val(ns1blankspace.objectContextData.actionbyfirstname + ' ' +
											ns1blankspace.objectContextData.actionbysurname);
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
							
							$('#ns1blankspaceDetailsBusiness').attr("data-id", ns1blankspace.objectContextData.contactbusiness);
							$('#ns1blankspaceDetailsBusiness').val(ns1blankspace.objectContextData.contactbusinesstext);
							
							$('#ns1blankspaceDetailsPerson').attr("data-id", ns1blankspace.objectContextData.contactperson);
							$('#ns1blankspaceDetailsPerson').val(ns1blankspace.objectContextData.contactpersonfirstname + 
									' ' + ns1blankspace.objectContextData.contactpersonsurname);
						}
						else
						{
							$('[name="radioStatus"][value="1"]').attr('checked', true);
							
							if (ns1blankspace.action.contactbusiness != undefined)
							{$('#ns1blankspaceDetailsBusiness').attr("data-id", ns1blankspace.action.contactbusiness);}
							
							if (ns1blankspace.action.contactbusinesstext != undefined)
							{$('#ns1blankspaceDetailsBusiness').val(ns1blankspace.action.contactbusinesstext);}
							
							if (ns1blankspace.action.contactperson != undefined)
							{$('#ns1blankspaceDetailsPerson').attr("data-id", ns1blankspace.action.contactperson);}
							
							if (ns1blankspace.action.contactpersontext != undefined)
							{$('#ns1blankspaceDetailsPerson').val(ns1blankspace.action.contactpersontext);}
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
						
						$('#ns1blankspaceDescription').html(aHTML.join(''));
						
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
									var iType = ns1blankspace.data.actionType.meeting;
									
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
												sData += 'id=' + ns1blankspace.objectContext;
											}
											else
											{
												sData += 'id=';
											}
											
											if ($('#ns1blankspaceMainDetails').html() != '')
											{
												sData += '&subject=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsSubject').val());
												sData += '&priority=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsPriority').attr('onDemandID'));				
												sData += '&type=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsType').attr('onDemandID'));
												sData += '&date=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsDate').val());
												sData += '&contactbusiness=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsBusiness').attr("onDemandID"));
												sData += '&contactperson=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsPerson').attr("onDemandID"));
												sData += '&actionby=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsActionBy').attr("onDemandID"));
												sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
												
											}
											
											if ($('#ns1blankspaceeMainDescription').html() != '')
											{
												sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceMainDescription').val());
											}
										}
										  
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.endpointURI('ACTION_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data) {ns1blankspace.action.save.process(oParam, data);}
										});
									},

					process: 		function ()
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
									
								}
				),


function interfaceActionNext10()
{
	var aHTML = [];
	var h = -1;	
				
	aHTML[++h] = '<table id="tableInterfaceMainNext10" class="interfaceMain">' +
					'<tr id="trInterfaceMainNext10Row1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainNext10Column1">' +
					ns1blankspace.xhtml.loading +
					'</td>' +
					'</tr>' +
					'</table>';					
			
	$('#divInterfaceMainNext10').html(aHTML.join(''));
	
	interfaceActionNextSummary({xhtmlElement: 'tdInterfaceMainNext10Column1'});
	
}	

	list: 			{
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
												
												case gsActionTypeCorrespondence:
													oSearch.addFilter('type', 'IN_LIST', '5,9,10');
													break;
												
												default:
													oSearch.addFilter('type', 'EQUAL_TO', iActionType);
											}

											oSearch.rf = 'json';
											oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
											
											oSearch.getResults(function(data) {ns1blankspace.financial.payment.refresh(data)});

											$.ajax(
											{
												type: 'GET',
												url: '/ondemand/action/?' + sParam,
												dataType: 'json',
												success: function(data) {ns1blankspace.action.list.process(data, oParam)}
											});
										}
									},

						process:		
								function (oResponse, oParam)
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
										aHTML.push('<table class="ns1blankspace">';
										aHTML[++h] = '<tbody>'
									
										aHTML[++h] = '<tr class="interfaceMainCaption">';
										switch (sActionType)
										{
										case gsActionTypeFileNote:
											aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
											aHTML[++h] = '<td class="interfaceMainCaption">Description</td>';
											aHTML[++h] = '<td class="interfaceMainCaption">Who</td>';
											break;

										case gsActionTypeCorrespondence:
											aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
											aHTML[++h] = '<td class="interfaceMainCaption">Subject</td>';
											aHTML[++h] = '<td class="interfaceMainCaption">Description</td>';
											break;
											
										case gsActionTypeAppointment:
											aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
											aHTML[++h] = '<td class="interfaceMainCaption">Type</td>';
											aHTML[++h] = '<td class="interfaceMainCaption">Who</td>';
											aHTML[++h] = '<td class="interfaceMainCaption">Hours</td>';
											break;

										default:
											aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
											aHTML[++h] = '<td class="interfaceMainCaption">Time</td>';
											aHTML[++h] = '<td class="interfaceMainCaption">Subject</td>';
											aHTML[++h] = '<td class="interfaceMainCaption">Description</td>';

										}
										aHTML[++h] = '</tr>';

										$.each(oResponse.data.rows, function()
										{
											
											aHTML[++h] = '<tr class="interfaceActions">';
											switch (sActionType)
											{
											case gsActionTypeFileNote:
												aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-date-' + this.id + '" class="interfaceActions">' +
																this.actiondate + '</td>';
												aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-description-' + this.id + '" class="interfaceActions">' +
																this.description + '</td>';
												aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-actionby-' + this.id + '" class="interfaceActions">' +
																this.actionbyfirstname + ' ' + this.actionbysurname + '</td>';
												break;
											
											case gsActionTypeCorrespondence:
												aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-date-' + this.id + '" class="interfaceActions">' + this.actiondate + '</td>';
												aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-subject-' + this.id + '" class="interfaceActions">' + onDemandXMLGetData(oRow, "subject") + '</td>';
												aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-description-' + this.id + '" class="interfaceActions">' + this.description + '</td>';
												break;
											
											case gsActionTypeAppointment:
												aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-date-' + this.id + '" class="interfaceActions">' + this.actiondate + '</td>';
												aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-type-' + this.id + '" class="interfaceActions">' + this.typetext + '</td>';
												aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-actionby-' + this.id + '" class="interfaceActions">' + this.actionby + '</td>';
												aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-hours-' + this.id + '" class="interfaceActions">' + this.hours + '</td>';
												break;
											
											default:
												aHTML[++h] = '<td class="interfaceMainRow" id="tdAction_date-' + this.id + '" class="interfaceActions">' + this.actiondate + '</td>';
												
												var sDate = new Date(this.actiondatetime);
												
												if ($.fullCalendar.formatDate(sDate, 'H') != '0' && $.fullCalendar.formatDate(sDate, 'm') != '0')
												{
													sDate = $.fullCalendar.formatDate(sDate, 'h:mm TT')
													aHTML[++h] = '<td class="interfaceMainRow" id="tdAction_time-' + this.id + '" class="interfaceActions">' + sDate + '</td>';
												}
												
												aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-subject-' + this.id + '" class="interfaceActions">' + this.subject + '</td>';
												aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-description-' + this.id + '" class="interfaceActions">' + this.description + '</td>';
											}

											aHTML[++h] = '<td class="interfaceMainRowOptions" id="tdAction-options-' + this.id + '" class="interfaceActionsOptions">&nbsp;</td>';
											aHTML[++h] = '</tr>'
										});
								    	
										aHTML[++h] = '</tbody></table>';

										$('#' + sElementId).html(aHTML.join(''));
										$('#' + sElementId).show(ns1blankspace.option.showSpeed);
										
										$('td.interfaceActions').click(function(event)
										{
											ns1blankspaceElementEditStart(event.target.id);
										});
											
									}
									
								}

function interfaceActionsAddNote(iObject, iObjectContext)
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMainAddNote">';
	
	aHTML[++h] = '<tr><td id="tdInterfaceMainAddNoteDescription" class="interfaceMain">' +
						'Note<td></tr>' +
						'<tr><td id="tdInterfaceMainAddNoteDescriptionValue" class="interfaceMain">' +
						'<textarea rows="10" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMainAddNoteDescription" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
						
	aHTML[++h] = '<tr><td id="tdInterfaceMainAddNoteStatus" class="interfaceMain">' +
						'<input type="checkbox" id="inputInterfaceMainAddNoteStatus"/>&nbsp;Status Note?<td></tr>';

	aHTML[++h] = '<tr><td id="tdInterfaceMainAddNoteHighPriority" class="interfaceMain">' +
						'<input type="checkbox" id="inputInterfaceMainAddNoteHighPriority"/>&nbsp;High Priority?<td></tr>';
						
	aHTML[++h] = '</table>';						
	
	$('#divInterfaceDialog').html(aHTML.join(''));
	
	$('#divInterfaceDialog').dialog(
		{
			width: 300,
			resizable: false,
			modal: true,
			title: 'Add Note',
			buttons: 
			{
				"Cancel": function() 
				{
					$( this ).dialog( "close" );
				},
				"Add Note": function() 
				{
					interfaceActionQuickSave({
						reference: '',
						description: $('#inputInterfaceMainAddNoteDescription').val(),
						type: ($('#inputInterfaceMainAddNoteStatus').attr('checked')?ns1blankspace.data.actionType.fileNote:ns1blankspace.data.actionType.fileNote),
						priority: ($('#inputInterfaceMainAddNoteHighPriority').attr('checked')?3:2)
						});
					$( this ).dialog( "close" );
					
				}
			}
		});
}



function interfaceActionsSummaryActions(sElementId, iObject, iObjectContext)
{

	var sParam = '/ondemand/action/?method=ACTION_SEARCH' +
								 '&rf=xml' +
								 '&type=' + ns1blankspace.data.actionType.fileNote +
								 '&status=' + giActionStatusInProgress;

	if (iObject != undefined && iObjectContext != undefined)
	{
		sParam += '&object='+ iObject +
				  '&objectcontext='+ iObjectContext;
				  
		$.ajax(
		{
			type: 'GET',
			url: sParam,
			dataType: 'json',
			success: function(data) {interfaceActionsSummaryActionsShow(data, sElementId)}
		});
	}
	
}

function interfaceActionsSummaryActionsShow(oResponse, asElementId)
{
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length > 0)
	{
		aHTML[++h] = '<table class="interfaceMain">';
		aHTML[++h] = '<tbody>'
	
		$.each(oResponse.data.rows, function()
		{
			aHTML[++h] = '<tr class="interfaceActions">';
			aHTML[++h] = '<td class="interfaceMainRow';
			
			if (this.status == giActionStatusInProgress) 
				{ aHTML[++h] = ' interfaceImportant'; }
				
			aHTML[++h] = '" id="tdAction-date-' + this.id + '" class="interfaceActions">' + this.actiondate + '</td>';
			aHTML[++h] = '<td class="interfaceMainRow" id="tdAction-description-' + this.id + '" class="interfaceActions">' + this.description + '</td>';
			aHTML[++h] = '</tr>';
		});
		
		aHTML[++h] = '</tbody><table>';

		$('#'+ asElementId).html(aHTML.join(''));
	}
	
}

calendar: {

function interfaceActionCalendar(oParam)
{
			
	var sXHTMLElementID = 'divInterfaceMainCalendar';		
	var bEventFetch = true;
	var iSourceObject = 17;
	
	if (oParam != undefined)
	{
		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		if (oParam.eventFetch != undefined) {bEventFetch = oParam.eventFetch}
		if (oParam.sourceObject != undefined) {iSourceObject = oParam.sourceObject}
	}
	
	$('#' + sXHTMLElementID).html('');
	
	if (ns1blankspace.action.calendarUsers.length == 0 && bEventFetch)
	{
		if (ns1blankspace.action.user != undefined)
		{
			ns1blankspace.action.calendarUsers.push(ns1blankspace.action.user);
		}
		else
		{	
			ns1blankspace.action.calendarUsers.push(gsUserID);
		}	
	}	
	
	$('#divns1blankspaceViewportControlOptions').hide(0);
	
	$('#' + sXHTMLElementID).fullCalendar({
		theme: true,
		defaultView: 'agendaWeek',
		header: {
			left: 'prev,next',
			center: 'title',
			right: 'today month,agendaWeek,agendaDay'
		},
		
		titleFormat:
		{
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
		
		drop: function(date, allDay) 
			{ 

				var originalEventObject = $(this).data('eventObject');
				var copiedEventObject = $.extend({}, originalEventObject);

				copiedEventObject.start = date;
				copiedEventObject.allDay = allDay;
				
				giActionBookingContextID = copiedEventObject.id;
				giActionLastBookingContextID = copiedEventObject.id;

				interfaceActionCalendarAddShow({
						startDate: date
					});
				
			},	
		
		columnFormat: {	month: 'ddd',    
						week: 'ddd d/M', 
						day: 'dddd d/M'},
		
		select: function(startDate, endDate, allDay, jsEvent, view )
		{
			interfaceActionCalendarAddShow({
				startDate: startDate,
				endDate: endDate
			});
		},
		
		eventClick: function(calEvent, jsEvent, view) 
		{
			if (calEvent.editable)
			{
				interfaceActionCalendarAddShow(
					{
						actionID: calEvent.id,
					});
			};		
		},
		
		dayClick: function(date, allDay, jsEvent, view) 
		{
		    if (allDay) 
			{
				alert('Clicked on the entire day: ' + date);
			}
			else
			{
				
			}
		},
		
		eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc) 
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
			ns1blankspaceStatus(event.contactBusinessText);
		},
		
		eventMouseout: function( event, jsEvent, view ) 
		{
			ns1blankspaceStatus('');
		},
		
		eventResize: function(event,dayDelta,minuteDelta,revertFunc) 
		{
			if (event.sequence > 1 || event.hoursremaining > 0) 
			{
				alert('You can not resize a multi-day event. Click on the event and edit the date and time as required.');
				revertFunc();
			}
			else
			{
				var sParam = '/ondemand/action/?rf=JSON&method=ACTION_MANAGE';
				var sData = 'id=' + event.id;
				
				sData += '&actionby=' + event.user;
				sData += '&enddaydelta=' + ns1blankspace.util.fs(dayDelta);
				sData += '&endminutedelta=' + ns1blankspace.util.fs(minuteDelta);
				
				$.ajax(
				{
					type: 'POST',
					url: sParam,
					data: sData,
					dataType: 'json',
				});
			}	
		},
		
		viewDisplay: function(view) 
		{
			interfaceActionCalendarUnavailableShow();	
		}
	});	
	
	$.each(ns1blankspace.action.calendarUsers, function() 
	{ 
		$('#' + sXHTMLElementID).fullCalendar('addEventSource', 
		{
			url: '/ondemand/action/?method=ACTION_CALENDAR_SEARCH' + ns1blankspace.action.calendarParam + '&rf=JSON&diary=1&usercolours=1&titleoption=1&actionby=' + this
		})
	});
	
}

function interfaceActionCalendarUnavailableShow()
{
	var aDays = [];
	var iStartHour = 0;
	var iEndHour = 24;
	var sNotAvailableDayClasses = aDays.join(' ')
	var bAvailable = true;

	if (ns1blankspace.action.calendarUsers.length > 0) 
	{ 
		var sParam = 'method=SETUP_USER_SEARCH&profile=445-446-447&users=' + ns1blankspace.action.calendarUsers.toString('-');
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?rf=XML&' + sParam,
			dataType: 'xml',
			success: function (data) 
			{
				$(data).find('profile445').each(function()
				{
					var aDaysTmp = ($(this).text()).split(',')
					
					$.each(aDaysTmp, function() 
					{
						if ($.inArray(this, aDays) == -1)
						{
							aDays.push(String(this))
						}	
					});	
				});

				$(data).find('profile446').each(function()
				{
					if (parseInt($(this).text()) > iStartHour) {iStartHour = parseInt($(this).text())}
				});
				
				$(data).find('profile447').each(function()
				{
					if (parseInt($(this).text()) < iEndHour) {iEndHour = parseInt($(this).text())}
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

function interfaceActionCalendarAddShow(oParam, oResponse)
{
	var iActionID = -1;
	var dStartDate = new Date();
	var dEndDate = dStartDate;
	
	if (oParam != undefined)
	{
		if (oParam.actionID != undefined) {iActionID = oParam.actionID};
		if (oParam.startDate != undefined) {dStartDate = oParam.startDate};
		if (oParam.endDate != undefined) {dEndDate = oParam.endDate};
	}	

	if (iActionID != -1 && oResponse == undefined)
	{
		sParam = 'method=ACTION_SEARCH&rf=json&select=' + iActionID;
	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/action/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceActionCalendarAddShow(oParam, data)}
		});	
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceActionCalendarAdd" class="interfaceDialogMedium">';
		
		aHTML[++h] = '<tr id="trInterfaceActionCalendarAddSubjectValue" class="interfaceMainText">' +
							'<td id="tdInterfaceActionCalendarAddSubjectValue" class="interfaceMainText">' +
							'<input onDemandType="TEXT" id="inputActionCalendarAddSubject" class="inputInterfaceMainText';
							
		if (iActionID == -1)
		{	
			aHTML[++h] = ' ns1blankspaceWatermark" value="Subject">';
		}
		else
		{
			aHTML[++h] = '">'
		}
		
		aHTML[++h] = '</td></tr>';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainAddNoteDescriptionValue" class="interfaceMain">' +
							'<textarea rows="5" cols="35" onDemandType="TEXTMULTI" id="inputActionCalendarAddDescription" class="inputInterfaceMainTextMultiSmall';

		if (iActionID == -1)
		{	
			aHTML[++h] = ' ns1blankspaceWatermark">Add more text here, if required.</textarea>';
		}
		else
		{
			aHTML[++h] = '"></textarea>'
		}

		aHTML[++h] = '</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceActionCalendarAddBusiness" class="interfaceMain">' +
							'<td id="tdInterfaceActionCalendarAddBusiness" class="interfaceMain">' +
							'Business' +
							'</td></tr>' +
							'<tr id="trInterfaceActionCalendarAddBusinessValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceActionCalendarAddBusinessValue" class="interfaceMainSelect">' +
							'<input onDemandType="SELECT" id="inputInterfaceActionCalendarAddBusiness" class="inputInterfaceMainSelect"' +
								' onDemandMethod="/ondemand/contact/?rf=XML&method=CONTACT_BUSINESS_SEARCH"' +
								' onDemandColumns="tradename">' +
							'</td></tr>';
							
		
		aHTML[++h] = '<tr id="trInterfaceActionCalendarAddPerson" class="interfaceMain">' +
							'<td id="tdInterfaceActionCalendarAddPerson" class="interfaceMain">' +
							'Person' +
							'</td></tr>' +
							'<tr id="trInterfaceActionCalendarAddPersonValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceActionCalendarAddPersonValue" class="interfaceMainSelect">' +
							'<input onDemandType="SELECT" id="inputInterfaceActionCalendarAddPerson" class="inputInterfaceMainSelectContact"' +
								' onDemandMethod="/ondemand/contact/?rf=XML&method=CONTACT_PERSON_SEARCH"' +
								' onDemandParent="InterfaceActionCalendarAddBusiness">' +
							'</td></tr>';									
							
							
		aHTML[++h] = '<tr><td id="tdInterfaceActionCalendarAddHighPriority" class="interfaceMain">' +
							'<input type="checkbox" id="inputInterfaceMainAddNoteHighPriority"/>&nbsp;High Priority?<td></tr>';
							
						
		aHTML[++h] = '<tr><td>';
		
			aHTML[++h] = '<table class="interfaceSearchFooterMedium">';
			
			aHTML[++h] = '<tr><td style="text-align: right;">' +
								'<span id="spanSave">Save</span>' +
								'<span id="spanCancel">Cancel</span>' +
								'<td></tr>';
			
			aHTML[++h] = '</table>';						

		aHTML[++h] = '</td></tr>';	
			
		aHTML[++h] = '</table>';		
		
		var oElement = $('#ns1blankspaceViewportActionLarge')
		
		$('#divns1blankspaceDialog').html('');
		$('#divns1blankspaceDialog').show();
		$('#divns1blankspaceDialog').offset({ top: $(oElement).offset().top + $(oElement).height() + 5, left: $(oElement).offset().left });
		$('#divns1blankspaceDialog').html(aHTML.join(''));
		
		$('#spanCancel').button(
			{
				text: false,
				 icons: {
					 primary: "ui-icon-close"
				}
			})
			.click(function() {
				$('#divns1blankspaceDialog').slideUp(500);
				$('#divns1blankspaceDialog').html('');
			})
			.css('width', '20px')
			.css('height', '20px')

		$('#spanSave').button(
			{
				text: false,
				 icons: {
					 primary: "ui-icon-check"
				}
			})
			.click(function() {
				interfaceActionQuickSave({
						id: iActionID,
						date: $.fullCalendar.formatDate(dStartDate, "dd MMM yyyy") + 
									' ' + $.fullCalendar.formatDate(dStartDate, "HH:mm"),
						endDate: $.fullCalendar.formatDate(dEndDate, "dd MMM yyyy") + 
									' ' + $.fullCalendar.formatDate(dEndDate, "HH:mm"),
						subject: $('#inputActionCalendarAddSubject').val(),
						description: $('#inputActionCalendarAddDescription').val(),
						priority: ($('#inputActionCalendarAddHighPriority').attr('checked')?3:2),
						calendarXHTMLElementID: 'divInterfaceMainCalendar'
						});
				
				$('#divns1blankspaceDialog').slideUp(500);
				$('#divns1blankspaceDialog').html('');

			})
			.css('width', '30px')
			.css('height', '20px')
		
		if (oResponse != undefined)
		{	
			if (oResponse.data.rows.length != 0)
			{	
				$('#inputActionCalendarAddSubject').val(oResponse.data.rows[0].subject);
				$('#inputActionCalendarAddDescription').val(oResponse.data.rows[0].description);
				
				//$('#inputInterfaceMainDetailsStatus').attr("onDemandID", oResponse.data.rows[0].customerstatus);
				//$('#inputInterfaceMainDetailsStatus').val(oResponse.data.rows[0].customerstatustext);
			}	
		}	
	}
}

function ns1blankspaceHomeCalendarAction(iActionId, sActionTitle)
{

	sParam = 'method=ACTION_SEARCH&contactperson=ALL&select=' + iActionId + '&rf=XML';
	
	$.ajax(
	{
		type: 'GET',
		url: '/directory/ondemand/object.asp?' + sParam,
		dataType: 'xml',
		success: ns1blankspaceHomeCalendarActionShow()
	});	

	$('#divns1blankspaceViewportControlOptions').html(ns1blankspace.xhtml.loading);
	
	$('#divns1blankspaceViewportControlOptions').dialog({
		title: sActionTitle,	
		modal: true,
		stack: false,
		draggable: false,
		resizeable: false
	});
}

function interfaceActionNextSummary(oParam, oResponse)
{	
	var sElementId = 'divInterfaceMain';
	
	if (oParam != undefined)
	{
		if (oParam.xhtmlElement != undefined)
		{
			sElementId = oParam.xhtmlElement;
		}	
	}	
	
	if (oResponse == undefined)
	{
	
		var sParam = 'method=ACTION_SEARCH';
		sParam += '&rows=10';
		sParam += '&future=1';
		sParam += '&actionby=' + gsUserID;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/action/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceActionNextSummary(oParam, data)}
		});
	
	}
	else
	{
		var aHTML = [];
		var h = -1;
	
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceActionSummary">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">Nothing scheduled.</td>';
			aHTML[++h] = '</tr>';
			
			$('#' + sElementId).html(aHTML.join(''));
			$('#' + sElementId).show(ns1blankspace.option.showSpeed);
			
		}
		else
		{
			
			aHTML[++h] = '<table>';
			aHTML[++h] = '<tbody>'

			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr>';
									
				aHTML[++h] = '<td class="interfaceMainRow interfaceRowSelect" id="tdAction_reference-' + this.id + '" >' +
									this.reference + '</td>';
				
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction_date-' + this.id + '" >' +
									this.actiondate + '</td>';
									
				var sDate = new Date(this.actiondatetime);
				
				if ($.fullCalendar.formatDate(sDate, 'H') != '0' && $.fullCalendar.formatDate(sDate, 'm') != '0')
				{
					sDate = $.fullCalendar.formatDate(sDate, 'h:mm TT')
				}
				else
				{
					sDate = '&nbsp;';
				}	
				
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction_time-' + this.id + '" class="interfaceActions">' + sDate + '</td>';
				
				aHTML[++h] = '<td class="interfaceMainRow interfaceRowSelectContact" id="tdAction_contact-' + this.contactperson + '" >' +
									this.contactpersonfirstname + ' ' + this.contactpersonsurname + '</td>';
				
				aHTML[++h] = '<td class="interfaceMainRow" id="tdAction_description-' + this.id + '" >' +
									this.description + '</td>';
				
				aHTML[++h] = '<td class="interfaceMainRowOptions" id="tdAction_options-' + this.id + 
									'" class="interfaceActionsOptions">&nbsp;</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sElementId).html(aHTML.join(''));
			$('#' + sElementId).show(ns1blankspace.option.showSpeed);
			
			$('td.interfaceRowSelect').click(function(event)
			{
				interfaceActionSearch(event.target.id, {source: 1});
			});
			
			$('td.interfaceRowSelectContact').click(function(event)
			{
				interfaceContactPersonSearch(event.target.id, {source: 1});
			});
			
		}
	}	
}

function interfaceActionQuickSave(oParam, oResponse)
{

	if (oResponse == undefined)
	{
		var sParam = '/ondemand/action/?rf=JSON&method=ACTION_MANAGE';
		var sData = '';
		var iType = ns1blankspace.data.actionType.meeting;
		var bAsync = true;
		var iHours;
		var sEndDate;
		var iActionBy = ns1blankspace.action.user;
		
		if (oParam != undefined)
		{
			if (oParam.type != undefined) {iType = oParam.type}
			if (oParam.async != undefined) {bAsync = oParam.async}
			if (oParam.hours != undefined) {iHours = oParam.hours}
			if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
			if (oParam.actionBy != undefined) {iActionBy = oParam.actionBy}
		}	
		
		sData += 'object=' + ns1blankspace.util.fs(oParam.object);
		sData += '&objectcontext=' + ns1blankspace.util.fs(oParam.objectContext);
		sData += '&subject=' + ns1blankspace.util.fs(oParam.subject);
		sData += '&description=' + ns1blankspace.util.fs(oParam.description);
		sData += '&priority=' + ns1blankspace.util.fs(oParam.description);
		sData += '&status=' + ns1blankspace.util.fs(oParam.status);
		sData += '&type=' + ns1blankspace.util.fs(iType);
		sData += '&date=' + ns1blankspace.util.fs(oParam.date);
		sData += '&actionby=' + ns1blankspace.util.fs(iActionBy);
		sData += '&contactbusiness=' + ns1blankspace.util.fs(oParam.contactBusiness);
		sData += '&contactperson=' + ns1blankspace.util.fs(oParam.contactPerson);
		
		if (iHours != undefined)
		{
			sData += '&totaltimehours=' + iHours;
		}
		
		if (sEndDate != undefined)
		{
			sData += '&enddate=' + ns1blankspace.util.fs(sEndDate);
		}
		
		sData += (oParam.otherData==undefined?'':oParam.otherData)
			  
		$.ajax(
		{
			type: 'POST',
			url: sParam,
			data: sData,
			dataType: 'json',
			async: bAsync,
			success: function(data) {interfaceActionQuickSave(oParam, data);}
		});
	}
	else	
	{
		if (oResponse.status == 'OK')
		{
			ns1blankspaceStatus('Saved');
			var iActionID = oResponse.id;	
		
			var dStartDate = new Date;
			var dEndDate = dStartDate;
			var sTitle = '';
			var sCalendarXHTMLElementID;
			
			if (oParam != undefined)
			{
				if (oParam.date != undefined) {sStartDate = oParam.date}
				if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
				if (oParam.subject != undefined) {sTitle = oParam.subject}
				if (oParam.calendarXHTMLElementID != undefined) {sCalendarXHTMLElementID = oParam.calendarXHTMLElementID}
			}	
			
			if (sCalendarXHTMLElementID != undefined)
			{
			
				$('#' + sCalendarXHTMLElementID).fullCalendar('renderEvent',
				{
					id: iActionID,
					title: sTitle,
					start: sStartDate, 
					end: sEndDate, 
					allDay: false},
					true
				);
			}
		}
		else
		{
			ns1blankspaceStatus(oResponse.error.errornotes);
			ns1blankspaceConfirm( {html: [oResponse.error.errornotes]
									   , title: 'Save error!'});
		}
	}
}	
