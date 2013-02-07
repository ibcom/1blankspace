/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.financial.payroll = 
{
	init: 		function (oParam)
				{
					var bInitialised = false;

					if (oParam != undefined)
					{
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}	
					}

					ns1blankspace.app.reset();

					ns1blankspace.object = 37;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'payroll';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Payroll';

					if (!bInitialised)
					{
						ns1blankspace.financial.initData(oParam)
					}
					else
					{		
						ns1blankspace.app.set(oParam);
					}	
				},

	home:		function (oParam, oResponse)
				{		
					if (oResponse == undefined)
					{
						var aHTML = [];
									
						aHTML.push('<table>');

						aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
							
						aHTML.push('<tr>' +
										'<td id="ns1blankspaceControlPayRuns" class="ns1blankspaceControl ns1blankspaceHighlight">Pay Runs</td>' +
										'</tr>');			
								
						aHTML.push('<tr>' +
										'<td id="ns1blankspaceControlEmployees" class="ns1blankspaceControl">Employees</td>' +
										'</tr>');	
									
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						$('#ns1blankspaceControlPayRuns').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainPayRun', refresh: true});
							ns1blankspace.financial.payroll.home();
						});
					
						$('#ns1blankspaceControlEmployees').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainEmployee', refresh: true});
							ns1blankspace.financial.payroll.employees.show();
						});
						
						var aHTML = [];
						
						aHTML.push('<div id="ns1blankspaceMainPayRun" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainEmployee" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainNew" class="ns1blankspaceControlMain"></div>');

						$('#ns1blankspaceMain').html(aHTML.join(''));
					
						$('#ns1blankspaceMainPayRun').html(ns1blankspace.xhtml.loading);

						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
						oSearch.addField('startdate,paydate,statustext');
						oSearch.rows = 10;
						oSearch.sort('paydate', 'desc');
						oSearch.getResults(function(data){ns1blankspace.financial.payroll.home(oParam, data)});		
					}
					else
					{
						var aHTML = [];
					
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceNothing">Click New to create a pay run.</td></tr>');
							aHTML.push('</table>');
						}
						else
						{	
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceCaption">MOST LIKELY</td></tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_date-' + this.id + '" class="ns1blankspaceMostLikely" style="width:150px;">' +
														this["paydate"] + '</td>');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_date-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
														this.statustext + '</td>');

								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
					
						$('#ns1blankspaceMainPayRun').html(aHTML.join(''));

						$('.ns1blankspaceMostLikely').click(function(event) {
							ns1blankspace.financial.payroll.search.send(event.target.id, {source: 1});
						});
					}	
				},

	search: 	{
					send:		function (sXHTMLElementId, oParam)
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
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
										oSearch.addField('startdate,paydate,statustext,status,notes,modifieddate,frequency,frequencytext');
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										
										oSearch.getResults(function(data) {ns1blankspace.financial.payroll.show(oParam, data)});
									}
									else
									{
										if (sSearchText == undefined)
										{
											sSearchText = $('#inputns1blankspaceViewportControlSearch').val();
										}	
										
										if (iSource == ns1blankspace.data.searchSource.browse)
										{
											iMinimumLength = 1;
											iMaximumColumns = 4;
											var aSearch = sSearch.split('-');
											sSearchText = aSearch[1];
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.container.position({xhtmlElementID: sElementId});
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
											oSearch.addField('notes,paydate');
											oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);
											
											oSearch.getResults(function(data) {ns1blankspace.financial.payroll.search.process(oParam, data)});	
										}
									};	
								},	

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
										
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
										
											aHTML.push('<td class="ns1blankspaceSearch" id="' + +
															'-' + this.id + '">' +
															this.notes +
															'</td>');
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML[++h] = '</table>';

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.financial.payroll.search.send(event.target.id, {source: 1});
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
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');

						aHTML.push('</table>');

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlPays" class="ns1blankspaceControl">' +
										'Pays</td></tr>');		
					}					
							
					aHTML.push('</table>');

					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPays" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.financial.payroll.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.financial.payroll.details();
					});
					
					$('#ns1blankspaceControlPays').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPays'});
						ns1blankspace.financial.payroll.pays();
					});
				},

	show: 		function (oParam, oResponse)
				{	
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.financial.payroll.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this pay run.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.paydate +
							'<br /><span id="ns1blankspaceSub_status" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.statustext + '</span>');
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.financial.payroll.init({showHome: false, id: ' + ns1blankspace.objectContext + '})',
							move: false
							})
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.payroll.summary()'})
					}
				},

	summary: 	function (oParam, oResponse)
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this contact.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:150px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
					
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspace">');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Start Date</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryStartDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.startdate +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">End Date</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryEndDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.paydate +
										'</td></tr>');
				
						aHTML.push('</table>');					

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2" style="width: 100%;">');
						
						if (ns1blankspace.objectContextData.statustext != '')
						{	
							aHTML.push('<tr><td class="ns1blankspaceCaption" style="padding-bottom:10px;">' +
										ns1blankspace.objectContextData.statustext +
										'</td></tr>');				
						}
						
						if (ns1blankspace.objectContextData.status == 1)
						{	
							aHTML.push('<tr><td>' +
										'<span style="font-size:0.75em;" id="ns1blankspaceStatusComplete">Complete</span>' +
										'</td></tr>');			
						}
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));	

						$('#ns1blankspaceStatusComplete').button(
						{
						})
						.click(function()
							{
								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_PERIOD_MANAGE'),
									data: 'status=2&id=' + ns1blankspace.objectContext,
									dataType: 'json',
									success: function() {ns1blankspace.financial.payroll.search.send('-' + ns1blankspace.objectContext)}
								});
						});
					}							
				},

	details: 	function (oParam)
				{	
					if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDetails').attr('data-loading', '');
						
						var aHTML = [];

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
										'Start Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsStartDate" class="ns1blankspaceDate">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Pay Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPayDate" class="ns1blankspaceDate">' +
										'</td></tr>');			

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>In Progress' +
										'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Completed' +
										'</td></tr>');		

					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Frequency' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioFrequency1" name="radioFrequency" value="1"/>Weekly' +
										'<br /><input type="radio" id="radioFrequency2" name="radioFrequency" value="2"/>Fortnightly' +
										'<br /><input type="radio" id="radioFrequency3" name="radioFrequency" value="3"/>Monthly' +
										'<br /><input type="radio" id="radioFrequency4" name="radioFrequency" value="4"/>Bi/Semi Monthly' +
										'</td></tr>');		
																																											
						aHTML.push('</table>');					
					
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
					
						$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});
					}	

					if (ns1blankspace.objectContextData != undefined)
					{
						$('#ns1blankspaceDetailsStartDate').val(ns1blankspace.objectContextData.startdate);
						$('#ns1blankspaceDetailsPayDate').val(ns1blankspace.objectContextData.paydate);
						$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
						$('[name="radioFrequency"][value="' + ns1blankspace.objectContextData.frequency + '"]').attr('checked', true);
						$('#ns1blankspaceDetailsDetailsNotes').val(ns1blankspace.objectContextData.notes);	
					}
				},

	save: 		{
					send: 		function (oParam)
								{
									if (ns1blankspace.objectContext != -1)
									{
										var sData = 'id=' + ns1blankspace.objectContext;
										
										if ($('#ns1blankspaceMainDetails').html() != '')
										{
											sData += '&startdate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsStartDate').val());
											sData += '&paydate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPayDate').val());
											sData += '&frequency=' + $('input[name="radioFrequency"]:checked').val();
											sData += '&status=' + $('input[name="radioStatus"]:checked').val();
										};

										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_PERIOD_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.status.message('Saved.');
											}	
										});		
									}	
								}
				},				

	new: 		{
					show: 		function ()
								{
									var aHTML = [];
							
									ns1blankspace.show({selector: '#divInterfaceMainNew'});

									aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceNewColumn1" class="ns1blankspaceColumn1" style="width:50%"></td>' +
													'<td id="ns1blankspaceNewColumn2" class="ns1blankspaceColumn2" style="font-size:0.75em"></td>' +
													'</tr>' + 
													'</table>');		

									$('#ns1blankspaceMainNew').html(aHTML.join(''));

									var aHTML = [];

									aHTML.push('<table class="ns1blankspace" style="font-size:0.875em">' +
														'<tr><td>' +
														'<span style="width:70px;" id="ns1blankspacePayrollNew_options_save">Next</span>' +
														'</td></tr>' +
														'<tr><td>' +
														'<span style="width:70px;" id="ns1blankspacePayrollNew_options_cancel">Cancel</span>' +
														'</td></tr>' +
														'</table>');	

									$('#ns1blankspaceNewColumn2').html(aHTML.join(''));

									$('#ns1blankspacePayrollNew_options_save').button(
									{
										text: "Next"
									})
									.click(function() 
									{
										ns1blankspace.financial.payroll.new.show();
									});

									$('#ns1blankspacePayrollNew_options_cancel').button(
									{
										text: "Cancel"
									})
									.click(function() 
									{
										$('td.ns1blankspaceHighlight :first').click();
									});

									var aHTML = [];
									var h = -1;

									if ($('#ns1blankspaceControlPayRuns').hasClass('ns1blankspaceHighlight'))
									{
										aHTML.push('<table><tr>' + 
														'<td class="ns1blankspaceNothing">Just check that you want to create the next pay period.<br /><br />If you do, then please click Next.</td>' + 
														'</tr>' +
														'</table>');
									}
									else
									{	
										aHTML.push('<table class="ns1blankspace" style="padding-right:15px;">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'First Name' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsFirstName" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Last Name' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsLastName" class="ns1blankspaceText">' +
														'</td></tr>');			
										
										aHTML.push('</table>');					
									}

									$('#ns1blankspaceNewColumn1').html(aHTML.join(''));

								},

					save: 		function (oParam, oResponse)
								{
									var iType;
									var iID;

									if (oParam != undefined)
									{
										if (oParam.type != undefined) {iType = oParam.type};
										if (oParam.id != undefined) {iType = oParam.id};
									}		

									if (iType == undefined)
									{	
										if ($('#ns1blankspaceControlPayRuns').hasClass('ns1blankspaceHighlight')) {iType = 1};
										if ($('#ns1blankspaceControlEmployees').hasClass('ns1blankspaceHighlight')) {iType = 2};
									}

									ns1blankspace.status.working();

									//PAYS
									if (iType == 1)
									{
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspaceEndpointURL('FINANCIAL_PAYROLL_PAY_PROCESS'),
											data: 'type=1',
											dataType: 'json',
											success: function(data) {
												if (data.status == 'OK')
												{	
													ns1blankspace.status.message('New pay period created.');
													ns1blankspace.objectContext = data.period;
													ns1blankspace.financial.payroll.search.send('-' + ns1blankspace.objectContext);
												}	
											}
										});
									}

									//EMPLOYEES
									if (iType == 2)
									{
										if (iID == undefined)
										{	
											if (oResponse == undefined)
											{	
												if ($('#ns1blankspaceDetailsFirstName').val() == '' ||
													$('#ns1blankspaceDetailsLastName').val() == '')
												{
													ns1blankspace.status.error('Missing information.');
												}	
												else
												{
													var oSearch = new AdvancedSearch();
													oSearch.method = 'CONTACT_PERSON_SEARCH';
													oSearch.addField('firstname');
													oSearch.addFilter('contactbusiness', 'EQUAL_TO', ns1blankspace.contactBusiness);
													oSearch.addFilter('firstname', 'EQUAL_TO', $('#ns1blankspaceDetailsFirstName').val());
													oSearch.addFilter('surname', 'EQUAL_TO', $('#ns1blankspaceDetailsLastName').val());

													oSearch.getResults(ns1blankspace.financial.payroll.new.save);
												}
											}
											else	
											{
												if (oResponse.data.rows.length > 0)
												{
													ns1blankspace.financial.payroll.new.process(
													{
														contactPerson: oResponse.data.rows[0].contactperson,
														contactBusiness: ns1blankspace.contactBusiness
													});		
												}
												else
												{
													var sData = 'contactbusiness=' + ns1blankspace.util.fs(ns1blankspace.contactBusiness);
													sData += '&firstname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFirstName').val());
													sData += '&surname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsLastName').val());

													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURL('CONTACT_PERSON_MANAGE'),
														data: sData,
														dataType: 'json',
														success: function(data)
														{
															if (data.status == 'OK')
															{
																ns1blankspace.financial.payroll.new.process(
																{
																	contactPerson: data.id,
																	contactBusiness: ns1blankspace.contactBusiness
																});	
															}
															else
															{
																ns1blankspace.status.error('Could not add employee.')
															}
														}
													});
												}	
											}
										}
										else
										{
											//save employee.
										}	
									}
								},

					process: 	function (oParam)
								{
									var iContactBusiness = ns1blankspace.contactBusiness;
									var iContactPerson;
									var iID;
									var sData;

									if (oParam != undefined)
									{
										if (oParam.contactBusiness != undefined) {iContactBusiness = oParam.contactBusiness}
										if (oParam.contactPerson != undefined) {iContactPerson = oParam.contactPerson}
									}		

									sData = 'id=' + ns1blankspace.util.fs(iID);
									sData += '&contactbusiness=' + ns1blankspace.util.fs(iContactBusiness);
									sData += '&contactperson=' + ns1blankspace.util.fs(iContactPerson);
									sData += '&status=2';
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURL('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data)
										{
											ns1blankspace.status.message('Saved.');
											ns1blankspace.show({selector: '#divInterfaceMainEmployee'});
											ns1blankspace.financial.payroll.employees.show();
										}	
									});		
								}
				},				

	employees: 	{
					show: 		function (oParam, oResponse)
								{
									var iStep = 1;
									var iStepAction = 1;
									var iEmployee;
									var iID = '';
									var sXHTMLElementID;

									if (oParam != undefined)
									{
										if (oParam.step != undefined) {iStep = oParam.step};
										if (oParam.stepAction != undefined) {iStepAction = oParam.stepAction};
										if (oParam.employee != undefined) {iEmployee = oParam.employee};
										if (oParam.id != undefined) {iID = oParam.id};
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}
									else
									{
										oParam = {step: 1};
									}
									
									if (sXHTMLElementID != undefined)
									{
										var aXHTMLElementID = sXHTMLElementID.split('-');
									}
										
									//EMPLOYEES LIST
									if (iStep == 1)	
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspacePayrollEmployeeColumn1" class="ns1blankspaceColumn1" style="width:125px;font-size:0.875em;padding-right:10px;"></td>' +
													'<td id="ns1blankspacePayrollEmployeeColumn2" class="ns1blankspaceColumn2"></td>' +
													'</tr>' + 
													'</table>');		
															
										$('#ns1blankspaceMainEmployee').html(aHTML.join(''));
										
										$('#ns1blankspacePayrollEmployeeColumn1').html(ns1blankspace.xhtml.loading);
										
										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
											oSearch.addField('contactpersontext,employmentstartdate,statustext,employee.contactperson.firstname,employee.contactperson.surname');
											oSearch.addFilter('status', 'EQUAL_TO', '2')
											oSearch.rows = 50;
											oSearch.sort('employee.contactperson.firstname', 'asc');
											oSearch.getResults(function(data) {ns1blankspace.financial.payroll.employees.show(oParam, data)});
										}
										else
										{
											var aHTML = [];

											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table><tr>' + 
														'<td class="ns1blankspaceNothing">No employees set up</td>' + 
														'</tr>' +
														'</table>');
											}
											else
											{
												aHTML.push('<table id="ns1blankspacePayrollEmployees" cellpadding=6>');
												
												var oRows = oResponse.data.rows;
											
												$(oRows).each(function() 
												{
													aHTML.push(ns1blankspace.financial.payroll.employees.row(this));
												});
											
												aHTML.push('</table>');
											}
										
											ns1blankspace.render.page.show(
											{
												type: 'JSON',
												xhtmlElementID: 'ns1blankspacePayrollEmployeeColumn1',
												xhtmlContext: 'PayrollEmployees',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: 50,
												functionShowRow: ns1blankspace.financial.payroll.employees.row,
												functionOpen: undefined,
												functionNewPage: ''
										   	}); 
											
											$('.employee').click(function() {
												$('#ns1blankspacePayrollEmployees td.ns1blankspaceHighlight').removeClass('ns1blankspaceHighlight');
												$('#' + event.target.id).addClass('ns1blankspaceHighlight');
												var aID = (event.target.id).split('-');
												$.extend(true, oParam, {step: 2, employee: parseInt(aID[1])});
												ns1blankspace.financial.payroll.employees.show(oParam);
											});	
										}
									}
									
									//EMPLOYEE DETAILS
									if (iStep == 2)
									{
										if (oResponse == undefined)
										{
											$('#ns1blankspacePayrollEmployeeColumn2').html(ns1blankspace.xhtml.loadingSmall);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
											oSearch.addField('*');
											oSearch.addFilter('id', 'EQUAL_TO', iEmployee);
											oSearch.getResults(function(data) {ns1blankspace.financial.payroll.employees.show(oParam, data)});
										}
										else
										{
											ns1blankspace.financial.employee = oResponse.data.rows[0];
										
											var aHTML = [];
										
											aHTML.push('<table class="ns1blankspaceContainer">' +
															'<tr class="ns1blankspaceContainer">' +
															'<td id="ns1blankspacePayrollEmployeeDetailsColumn1" class="ns1blankspaceColumn1" style="width:50px;font-size:0.875em;padding-right:10px;">' +
															ns1blankspace.xhtml.loading + '</td>' +
															'<td id="ns1blankspacePayrollEmployeeDetailsColumn2" class="ns1blankspaceColumn2">' +
															'</td>' +
															'</tr>' + 
															'</table>');		
			
											$('#ns1blankspacePayrollEmployeeColumn2').html(aHTML.join(''));
											
											var aHTML = [];

											aHTML.push('<table id="ns1blankspacePayrollEmployeeDetails" class="ns1blankspaceColumn2" cellpadding=6>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-11" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Details</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-12" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Payroll</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-13" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Pay Rates</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-14" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Bank&nbsp;Accounts</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-15" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Superannuation</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-16" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Role</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-17" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Induction</td></tr>');

											aHTML.push('</table>');

											$('#ns1blankspacePayrollEmployeeDetailsColumn1').html(aHTML.join(''));
										
											$('.ns1blankspacePayrollEmployeeDetails').click(function()
											{
												$('#ns1blankspacePayrollEmployeeDetails td.ns1blankspaceHighlight').removeClass('ns1blankspaceHighlight');
												$('#' + event.target.id).addClass('ns1blankspaceHighlight');
												var aID = (event.target.id).split('-');
												$.extend(true, oParam, {step: parseInt(aID[1]), stepAction: 1});
												ns1blankspace.financial.payroll.employees.show(oParam);
											});

											$('#ns1blankspaceFinancialEmployee_details-11').addClass('ns1blankspaceHighlight');
											$.extend(true, oParam, {step: 11});
											ns1blankspace.financial.payroll.employees.show(oParam);
										}
									}
									
									if (iStep == 11)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Status' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Proposed' +
														'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Active' +
														'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>In-active' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Notes' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceMultiSmall">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsNotes" class="inputInterfaceMainTextMultiSmall"></textarea>' +
														'</td></tr>');
										
										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('[name="radioStatus"][value="' + ns1blankspace.financial.employee["employee.status"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsNotes').val(ns1blankspace.financial.employee["employee.description"]);
										}
										else
										{
											$('[name="radioStatus"][value="1"]').attr('checked', true);
										}
									}
									
									if (iStep == 12)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Frequency' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioFrequency1" name="radioFrequency" value="1"/>Weekly' +
														'<br /><input type="radio" id="radioFrequency2" name="radioFrequency" value="2"/>Fortnightly' +
														'<br /><input type="radio" id="radioFrequency3" name="radioFrequency" value="3"/>Monthly' +
														'<br /><input type="radio" id="radioFrequency4" name="radioFrequency" value="4"/>Bi/Semi Monthly' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Allowance Amount' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsAllowance" class="ns1blankspaceText">' +
														'</td></tr>');
									
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Allowance Description' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsDescription" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Standard Deduction Amount' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="ins1blankspaceText">' +
														'<input id="ns1blankspaceDetailsDeduction" class="ns1blankspaceText">' +
														'</td></tr>');	

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Standard Deduction Description' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsDeductionDescription" class="ns1blankspaceText">' +
														'</td></tr>');	
										
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Medicare' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioMedicare1" name="radioMedicare" value="1"/>Pay Medicare' +
														'<br /><input type="radio" id="radioMedicare2" name="radioMedicare" value="2"/>Full Exemption' +
														'<br /><input type="radio" id="radioMedicare3" name="radioMedicare" value="3"/>Half Exemption' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Tax File Number' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsTaxNumber" class="ns1blankspaceText">' +
														'</td></tr>');	

										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('[name="radioMedicare"][value="' + ns1blankspace.financial.employee["employee.status"] + '"]').attr('checked', true);
											$('[name="radioFrequency"][value="' + ns1blankspace.financial.employee["employee.payfrequency"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsAllowanceDescription').val(ns1blankspace.financial.employee["employee.allowancedescription"]);
										}
										else
										{
											$('[name="radioMedicare"][value="1"]').attr('checked', true);
										}
									}

									//SUPERANNUATION
									if (iStep == 15)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Name' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsFundName" class="ns1blankspaceText">' +
														'</td></tr>');
											
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Member Number' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsFundMemberNumber" class="ns1blankspaceText">' +
														'</td></tr>');
								
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Superannuation %' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsEmployerSuperannuationRate" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Salary Sacrifice Contribution' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioSuperContributionType1" name="radioSuperContributionType" value="1"/>Dollar amount per pay' +
														'<br /><input type="radio" id="radioSuperContributionType2" name="radioSuperContributionType" value="2"/>Percentage of pay' +
														'</td></tr>');

										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('[name="radioSuperContributionType"][value="' + ns1blankspace.financial.employee["employee.pretaxsupertype"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsFundName').val(ns1blankspace.financial.employee["employee.superfundname"]);
											$('#ns1blankspaceDetailsFundMemberNumber').val(ns1blankspace.financial.employee["employee.superfundmembernumber"]);
											$('#ns1blankspaceDetailsEmployerSuperannuationRate').val(ns1blankspace.financial.employee["employee.superrate"]);
										}
										else
										{
											$('[name="radioEmployerType"][value="1"]').attr('checked', true);
										}
									}	

									//ROLE
									if (iStep == 16)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Description' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="ns1blankspaceText">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsJobDescription" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');
										
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Reports To' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="ns1blankspaceText">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsInternalRelationships" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'KPIs' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="ns1blankspaceText">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsKPI" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Responsibilities' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="ns1blankspaceText">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsResponsibilities" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');


										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Must Do Tasks' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="ns1blankspaceText">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsTasks" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');

										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#ns1blankspaceDetailsJobDescription').val(ns1blankspace.financial.employee["employee.jobdetails"]);
											$('#ns1blankspaceDetailsInternalRelationships').val(ns1blankspace.financial.employee["employee.jobinternalrelationships"]);
											$('#ns1blankspaceDetailsKPI').val(ns1blankspace.financial.employee["employee.jobkpis"]);
											$('#ns1blankspaceDetailsResponsibilities').val(ns1blankspace.financial.employee["employee.jobresponsibilities"]);
											$('#ns1blankspaceDetailsTasks').val(ns1blankspace.financial.employee["employee.jobtasks"]);
										}
									}	

									//INDUCTION
									if (iStep == 17)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Induction Date' +
														'</td></tr>' +
														'<tr><td class="ns1blankspace">' +
														'<tr><td class="ns1blankspaceDate">' +
														'<input id="ns1blankspaceDetailsEmployerInductionRate" class="ns1blankspaceDate">' +
														'</td></tr>');
											
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Workers Compensation Insurance Completed' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<tr><td class="interfaceMainText">' +
														'<input type="radio" id="radioWorkersCompensationY" name="radioWorkersCompensation" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioWorkersCompensationN" name="radioWorkersCompensation" value="N"/>No' +
														'</td></tr>');
															
										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#ns1blankspaceDetailsInductionDate').val(ns1blankspace.financial.employee["employee.inductiondate"]);
											$('[name="radioWorkersCompensation"][value="' + ns1blankspace.financial.employee["employee.workerscompform"] + '"]').attr('checked', true);
										}
										else
										{
											$('[name="radioWorkersCompensation"][value="N"]').attr('checked', true);
										}
									}	

									//PAYRATES
									if (iStep == 13)
									{
										if (iStepAction == 4)
										{
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_PAYRATE_MANAGE'),
												data: 'remove=1&id=' + aXHTMLElementID[1],
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
														$.extend(true, oParam, {stepAction: 1});
														ns1blankspace.financial.payroll.employees.show(oParam);
														ns1blankspace.status.message('Removed');
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});
										}
										else
										{
											if ((iStepAction == 1 || iStepAction == 2) && (oResponse == undefined))
											{
												$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(ns1blankspace.xhtml.loadingSmall);

												var oSearch = new AdvancedSearch();
												oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_PAYRATE_SEARCH';		
												
												if (iStepAction == 1)
												{	
													oSearch.addField('employmenttype,employmenttypetext,enddate,notes,rate,startdate');
													oSearch.addFilter('employee', 'EQUAL_TO', iEmployee)
													oSearch.rows = 50;
													oSearch.sort('startdate', 'desc');
												}
												else
												{
													oSearch.addField('employmenttype,employmenttypetext,enddate,notes,rate,startdate');
													oSearch.addFilter('id', 'EQUAL_TO', aXHTMLElementID[1]);
													oParam.id = aXHTMLElementID[1];
												}	

												oSearch.getResults(function(data){ns1blankspace.financial.payroll.employees.show(oParam, data)});
											}
											else
											{
												var aHTML = [];

												aHTML.push('<table class="ns1blankspaceContainer">' +
																'<tr class="ns1blankspaceContainer">' +
																'<td id="ns1blankspacePayrollEmployeeDetailsPayRateColumn1" style="font-size:0.875em;">' +
																ns1blankspace.xhtml.loading + '</td>' +
																'<td id="ns1blankspacePayrollEmployeeDetailsPayRateColumn2" style="width:75px;">' +
																'</td>' +
																'</tr>' + 
																'</table>');				
											
												$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));
											
												var aHTML = [];
												var h = -1;

												if (iStepAction == 1)
												{
													var aHTML = [];
						
													aHTML.push('<table class="ns1blankspaceColumn2">' +
																	'<tr><td >' +
																	'<span id="ns1blankspacePayrollEmployee_options_add" class="ns1blankspaceAction">Add</span>' +
																	'</td></tr>' +
																	'</table>');					
													
													$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn2').html(aHTML.join(''));

													$('#ns1blankspacePayrollEmployee_options_add').button(
													{
														text: "Add"
													})
													.click(function() {
														$.extend(true, oParam, {stepAction: 3, xhtmlElementID: "", id: ""});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
													.css('font-size', '0.875em');
												
													var aHTML = [];

													if (oResponse.data.rows.length == 0)
													{
														aHTML.push('<table style="width: 750px; margin-top:15px; margin-bottom:15px;">' +
																		'<tr><td class="ns1blankspaceNothing">No pays.</td></tr>' +
																		'</table>');

														$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));
													}
													else
													{	
														aHTML.push('<table class="ns1blankspaceColumn2">');
														aHTML.push('<tr class="ns1blankspaceCaption">');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">Start Date</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">End Date</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Rate</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
														aHTML.push('</tr>');

														$(oResponse.data.rows).each(function() 
														{
															aHTML.push('<tr class="ns1blankspaceRow">');
																			
															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPayRate_startdate-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsPayRate">' +
																			this.startdate + '</td>');

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPayRate_enddate-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsPayRate">' +
																			this.enddate + '</td>');

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPayRate_rate-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsPayRate" style="text-align:right;">' +
																			this.rate + '</td>');

															aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
																			'<span id="ns1blankspacePayrollEmployeeDetailsPayRate_options_remove-' + this.id + '" class="ns1blankspacePayrollEmployeeDetailsPayRateRemove"></span></td>');
										
															aHTML.push('</tr>');
														});
														
														aHTML.push('</table>');
													}
													
													$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));

													$('.ns1blankspacePayrollEmployeeDetailsPayRateRemove').button(
													{
														text: false,
														icons: {
															primary: "ui-icon-close"
														}
													})
													.click(function() {
														$.extend(true, oParam, {stepAction: 4, xhtmlElementID: this.id});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
													.css('width', '15px')
													.css('height', '17px');

													$('.ns1blankspacePayrollEmployeeDetailsPayRate').click(function() {
														$.extend(true, oParam, {stepAction: 2, xhtmlElementID: event.target.id});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
												}
												else
												{
													aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');
										
													aHTML.push('<tr><td class="ns1blankspaceCaption">Start Date</td></tr>' +
																	'<tr><td>' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateStartDate" class="ns1blankspaceDate">' +
																	'</td></tr>');	

													aHTML.push('<tr><td class="ns1blankspaceCaption">End Date</td></tr>' +
																	'<tr><td>' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateEndDate" class="ns1blankspaceDate">' +
																	'</td></tr>');

													aHTML.push('<tr><td class="ns1blankspaceCaption">Rate Amount</td></tr>' +
																	'<tr><td>' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateAmount" class="ns1blankspaceText">' +
																	'</td></tr>');				

													aHTML.push('</table>');

													$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));

													$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

													var aHTML = [];
												
													aHTML.push('<table class="ns1blankspaceColumn2" style="font-size:0.875em">' +
																	'<tr><td>' +
																	'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsPayRate_options_save" class="ns1blankspaceAction">Save</span>' +
																	'</td></tr>' +
																	'<tr><td>' +
																	'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsPayRate_options_cancel" class="ns1blankspaceAction">Cancel</span>' +
																	'</td></tr>' +
																	'</table>');	

													$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn2').html(aHTML.join(''));

													$('#ns1blankspacePayrollEmployeeDetailsPayRate_options_save').button(
													{
														text: "Save"
													})
													.click(function() 
													{
														ns1blankspace.status.working();

														var sData = 'id=' + ns1blankspace.util.fs(iID);
														if (iID == '')
														{
															sData += '&employee=' + ns1blankspace.util.fs(iEmployee);
														}	
														sData += '&startdate=' + ns1blankspace.util.fs($('#ns1blankspacePayrollEmployeeDetailsPayRateStartDate').val());
														sData += '&enddate=' + ns1blankspace.util.fs($('#ns1blankspacePayrollEmployeeDetailsPayRateEndDate').val());
														sData += '&rate=' + ns1blankspace.util.fs($('#ns1blankspacePayrollEmployeeDetailsPayRateAmount').val());

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_PAYRATE_MANAGE'),
															data: sData,
															dataType: 'json',
															success: function(data) {
																if (data.status == "OK")
																{
																	ns1blankspace.status.message('Saved');
																	$.extend(true, oParam, {stepAction: 1, id: ''});
																	ns1blankspace.financial.payroll.employees.show(oParam);
																}
																else
																{
																	ns1blankspace.status.rrror(data.error.errornotes);
																}
															}
														});
													});

													$('#ns1blankspacePayrollEmployeeDetailsPayRate_options_cancel').button(
													{
														text: "Cancel"
													})
													.click(function() 
													{
														$.extend(true, oParam, {stepAction: 1});
														ns1blankspace.financial.payroll.employees.show(oParam);
													});
													
													if (oResponse != undefined)
													{	
														if (oResponse.data.rows.length != 0)
														{
															var oObjectContext = oResponse.data.rows[0];
															
															$('#ns1blankspacePayrollEmployeeDetailsPayRateStartDate').val(oObjectContext.startdate);
															$('#ns1blankspacePayrollEmployeeDetailsPayRateEndDate').val(oObjectContext.enddate);
															$('#ns1blankspacePayrollEmployeeDetailsPayRateAmount').val(oObjectContext.rate);
														}
														else
														{
														}
													}	
												}
											}
										}			
									}
									
									//BANK ACCOUNTS
									if (iStep == 14)
									{
										if (iStepAction == 4)
										{	
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_BANK_ACCOUNT_MANAGE'),
												data: 'remove=1&id=' + aXHTMLElementID[1],
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
														$.extend(true, oParam, {stepAction: 1});
														ns1blankspace.financial.payroll.employees.show(oParam);
														ns1blankspace.status.message('Removed');
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});

										}
										else
										{
											if ((iStepAction == 1 || iStepAction == 2) && (oResponse == undefined))
											{
												$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(ns1blankspace.xhtml.loadingSmall);

												var oSearch = new AdvancedSearch();
												oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_BANK_ACCOUNT_SEARCH';		
												
												if (iStepAction == 1)
												{	
													oSearch.addField('accountname,accountnumber,bsb,percentage');
													oSearch.addFilter('employee', 'EQUAL_TO', iEmployee)
													oSearch.rows = 50;
													oSearch.sort('accountname', 'asc');
												}
												else
												{
													oSearch.addField('accountname,accountnumber,bsb,percentage');
													oSearch.addFilter('id', 'EQUAL_TO', aXHTMLElementID[1])
													oParam.id = aXHTMLElementID[1];
												}	

												oSearch.getResults(function(data){ns1blankspace.financial.payroll.employees.show(oParam, data)});
											}
											else
											{
												var aHTML = [];

												aHTML.push('<table class="ns1blankspaceContainer">' +
																'<tr class="ns1blankspaceContainer">' +
																'<td id="ns1blankspacePayrollEmployeeDetailsBankAccountColumn1" style="font-size:0.875em;">' +
																ns1blankspace.xhtml.loading + '</td>' +
																'<td id="ns1blankspacePayrollEmployeeDetailsBankAccountColumn2" style="width:75px;">' +
																'</td>' +
																'</tr>' + 
																'</table>');	

												$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));
											
												var aHTML = [];
											
												if (iStepAction == 1)
												{
													var aHTML = [];
						
													aHTML.push('<table class="ns1blankspaceColumn2">' +
																	'<tr><td >' +
																	'<span id="ns1blankspacePayrollEmployee_options_add" class="ns1blankspaceAction">Add</span>' +
																	'</td></tr>' +
																	'</table>');					
													
													$('#ns1blankspacePayrollEmployeeDetailsBankAccountColumn2').html(aHTML.join(''));

													$('#ns1blankspacePayrollEmployee_options_add').button(
													{
														text: "Add"
													})
													.click(function() {
														$.extend(true, oParam, {stepAction: 3, xhtmlElementID: "", id: ""});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
													.css('font-size', '0.75em');
												
													var aHTML = [];

													if (oResponse.data.rows.length == 0)
													{
														aHTML.push('<table class="ns1blankspaceColumn2">' +
																		'<tr><td class="ns1blankspaceNothing">No bank accounts.</td></tr>' +
																		'</table>');

														$('#ns1blankspacePayrollEmployeeDetailsBankAccountColumn1').html(aHTML.join(''));
													}
													else
													{	
														aHTML.push('<table id="ns1blankspacePayrollEmployeeDetailsBankAccount" class="ns1blankspaceColumn2">');
														aHTML.push('<tr class="ns1blankspaceCaption">');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">Name</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">BSB</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">Number</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">% of Pay</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
														aHTML.push('</tr>');

														$(oResponse.data.rows).each(function() 
														{
															aHTML.push('<tr class="ns1blankspaceRow">');
																			
															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsBankAccount_name-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsBankAccount">' +
																			this.accountname + '</td>');

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsBankAccount_bsb-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsBankAccount">' +
																			this.bsb + '</td>');

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsBankAccount_number-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsBankAccount" style="text-align:right;">' +
																			this.accountnumber + '</td>');

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsBankAccount_percentage-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsBankAccount" style="text-align:right;">' +
																			this.percentage + '</td>');

															aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
																			'<span id="ns1blankspacePayrollEmployeeDetailsBankAccount_options_remove-' + this.id + '" class="ns1blankspaceRemove"></span></td>');
										
															aHTML.push('</tr>');
														});
														
														aHTML.push('</table>');
													}
													
													$('#ns1blankspacePayrollEmployeeDetailsBankAccountColumn1').html(aHTML.join(''));

													$('#ns1blankspacePayrollEmployeeDetailsBankAccount .ns1blankspaceRemove').button(
													{
														text: false,
														icons: {
															primary: "ui-icon-close"
														}
													})
													.click(function() {
														$.extend(true, oParam, {stepAction: 4, xhtmlElementID: this.id});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
													.css('width', '15px')
													.css('height', '17px');

													$('#ns1blankspacePayrollEmployeeDetailsBankAccount td.ns1blankspaceRow').click(function() {
														$.extend(true, oParam, {stepAction: 2, xhtmlElementID: event.target.id});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
												}
												else
												{
													aHTML.push('<table id="ns1blankspacePayrollEmployeeDetailsBankAccountEdit" class="ns1blankspaceColumn2">');
										
													aHTML.push('<tr><td class="ns1blankspaceCaption">Account Name</td></tr>' +
																	'<tr><td>' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsBankAccountName" class="ns1blankspaceText">' +
																	'</td></tr>');

													aHTML.push('<tr><td class="ns1blankspaceCaption">BSB</td></tr>' +
																	'<tr><td>' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsBankAccountBSB" class="ns1blankspaceText">' +
																	'</td></tr>');	

													aHTML.push('<tr><td class="ns1blankspaceCaption">Account Number</td></tr>' +
																	'<tr><td>' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsBankAccountNumber" class="ns1blankspaceText">' +
																	'</td></tr>');	

													aHTML.push('<tr><td class="ns1blankspaceCaption">% of Wage</td></tr>' +
																	'<tr><td>' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsBankAccountPercentage" class="ns1blankspaceText">' +
																	'</td></tr>');	

													aHTML.push('</table>');

													$('#ns1blankspacePayrollEmployeeDetailsBankAccountColumn1').html(aHTML.join(''));

													var aHTML = [];

													aHTML.push('<table class="ns1blankspaceColumn2" style="font-size:0.875em">' +
																	'<tr><td>' +
																	'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsBankAccount_options_save" class="ns1blankspaceAction">Save</span>' +
																	'</td></tr>' +
																	'<tr><td>' +
																	'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsBankAccount_options_cancel" class="ns1blankspaceAction">Cancel</span>' +
																	'</td></tr>' +
																	'</table>');	

													$('#ns1blankspacePayrollEmployeeDetailsBankAccountColumn2').html(aHTML.join(''));

													$('#ns1blankspacePayrollEmployeeDetailsBankAccount_options_save').button(
													{
														text: "Save"
													})
													.click(function() 
													{
														ns1blankspace.status.working();

														var sData = 'id=' + ns1blankspace.util.fs(iID);
														if (iID == '')
														{
															sData += '&employee=' + ns1blankspace.util.fs(iEmployee);
														}	
														sData += '&accountname=' + ns1blankspace.util.fs($('#ns1blankspacePayrollEmployeeDetailsBankAccountName').val());
														sData += '&bsb=' + ns1blankspace.util.fs($('#ns1blankspacePayrollEmployeeDetailsBankAccountBSB').val());
														sData += '&accountnumber=' + ns1blankspace.util.fs($('#ns1blankspacePayrollEmployeeDetailsBankAccountNumber').val());
														sData += '&percentage=' + ns1blankspace.util.fs($('#ns1blankspacePayrollEmployeeDetailsBankAccountPercentage').val());

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_BANK_ACCOUNT_MANAGE'),
															data: sData,
															dataType: 'json',
															success: function(data) {
																if (data.status == "OK")
																{
																	ns1blankspace.status.message('Saved');
																	$.extend(true, oParam, {stepAction: 1, id: ''});
																	ns1blankspace.financial.payroll.employees.show(oParam);
																}
																else
																{
																	ns1blankspace.status.error(data.error.errornotes);
																}
															}
														});
													});

													$('#ns1blankspacePayrollEmployeeDetailsBankAccount_options_cancel').button(
													{
														text: "Cancel"
													})
													.click(function() 
													{
														$.extend(true, oParam, {stepAction: 1});
														ns1blankspace.financial.payroll.employees.show(oParam);
													});
													
													if (oResponse != undefined)
													{	
														if (oResponse.data.rows.length != 0)
														{
															var oObjectContext = oResponse.data.rows[0];
															
															$('#ns1blankspacePayrollEmployeeDetailsBankAccountName').val(oObjectContext.accountname);
															$('#ns1blankspacePayrollEmployeeDetailsBankAccountBSB').val(oObjectContext.bsb);
															$('#ns1blankspacePayrollEmployeeDetailsBankAccountNumber').val(oObjectContext.accountnumber);
															$('#ns1blankspacePayrollEmployeeDetailsBankAccountPercentage').val(oObjectContext.percentage);
														}
														else
														{
														}
													}	

												}
											}
										}			
									}
								},

					row:		function (oRow)
								{
									var aHTML = [];
								
									if (oRow.contactpersontext != '')
									{
										aHTML.push('<tr class="ns1blankspaceRow">');
												
										aHTML.push('<td id="ns1blankspaceEmployee_contact-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect employee">' +
																oRow["employee.contactperson.firstname"] + ' ' + oRow["employee.contactperson.surname"] + '</td>');
									
										aHTML.push('</tr>');
									}

									return aHTML.join('');
								}
				},				

	pays: 		function (oParam, oResponse)
				{
					var iStep = 1;
					var iEmployee;
					var iPay;
					var sEmployeeText;

					if (oParam != undefined)
					{
						if (oParam.step != undefined) {iStep = oParam.step};
						if (oParam.employee != undefined) {iEmployee = oParam.employee};
						if (oParam.pay != undefined) {iPay = oParam.pay};
						if (oParam.employeeText != undefined) {sEmployeeText = oParam.employeeText};
					}
					else
					{
						oParam = {};
					}	

					//PAY RECORDS
					if (iStep == 1)
					{
						var aHTML = [];
						
						if (oResponse == undefined)
						{
							aHTML.push('<table class="ns1blankspaceContainer">' +
											'<tr class="ns1blankspaceContainer">' +
											'<td id="ns1blankspacePayrollPayColumn1" class="ns1blankspaceColumn1" style="width:150px;padding-right:5px;font-size:0.875em;"></td>' +
											'<td id="ns1blankspacePayrollPayColumn2" class="ns1blankspaceColumn2"></td>' +
											'</tr>' + 
											'</table>');	
							
							$('#ns1blankspaceMainPays').html(aHTML.join(''));
						
							$('#ns1blankspacePayrollPayColumn1').html(ns1blankspace.xhtml.loadingSmall);

							if (ns1blankspace.objectContextData.status == "1")
							{
								var aHTML = [];
								
								aHTML.push('<table class="ns1blankspaceColumn2">' +
												'<tr><td class="ns1blankspaceAction">' +
												'<span id="ns1blankspaceFinancialPayrollPayAdd">Add</span>' +
												'</td></tr>' +
												'</table>');					
								
								$('#ns1blankspacePayrollPayColumn2').html(aHTML.join(''));
							
								$('#ns1blankspaceFinancialPayrollPayAdd').button(
								{
									label: "Add"
								})
								.click(function()
								{
									$.extend(true, oParam, {step: 7, xhtmlElementID: ''});
									ns1blankspace.financial.payroll.pays(oParam);
								})
							}

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
							oSearch.addField('grosssalary,payrecord.employee.contactpersontext');
							oSearch.addFilter('period', 'EQUAL_TO', ns1blankspace.objectContext)
							oSearch.rows = 200;
							oSearch.sort('payrecord.employee.contactpersontext', 'asc');
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)})	
						}
						else
						{
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<table><tr>' + 
										'<td class="ns1blankspaceNothing">No pay runs.</td>' + 
										'</tr>' +
										'</table>');
							}
							else
							{
								aHTML.push('<table id="ns1blankspacePayrollRuns" cellpadding=6>');

								$(oResponse.data.rows).each(function()
								{
									aHTML.push('<tr class="ns1blankspaceRow">');
									
									aHTML.push('<td id="ns1blankspacePayrollPay_name-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
															' data-employeeText="' + this["payrecord.employee.contactpersontext"] + '">' +
															this["payrecord.employee.contactpersontext"] + '</td>');
														
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspacePayrollPay_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>' +
													'</td>');					
																												
									aHTML.push('</tr>');
								});
							
								aHTML.push('</table>');
							}
						
							$('#ns1blankspacePayrollPayColumn1').html(aHTML.join(''));

							if (ns1blankspace.objectContextData.status == "1")
							{
								$('#ns1blankspacePayrollRuns .ns1blankspaceRowRemove').button(
								{
									text: false,
								 	icons: {primary: "ui-icon-close"}
								})
								.click(function() {
									$.extend(true, oParam, {step: 5, xhtmlElementID: event.target.id});
									ns1blankspace.financial.payroll.pays(this.id)
								})
								.css('width', '15px')
								.css('height', '20px')
							}

							$('#ns1blankspacePayrollRuns td.ns1blankspaceRowSelect').click(function()
							{
								$('#ns1blankspacePayrollRuns td.ns1blankspaceHighlight').removeClass('ns1blankspaceHighlight');
								$('#' + event.target.id).addClass('ns1blankspaceHighlight');
								var aXHTMLElementID = (event.target.id).split('-');
								var sData = $('#' + event.target.id).attr('data-employeeText');
								$.extend(true, oParam, {step: 2, pay: aXHTMLElementID[1], employeeText: sData});
								ns1blankspace.financial.payroll.pays(oParam);
							})
						}
					}

					//PAY RECORD DETAILS
					else if (iStep == 2)
					{	
						if (oResponse == undefined)
						{
							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspaceContainer">' +
											'<tr class="ns1blankspaceContainer">' +
											'<td id="ns1blankspacePayrollPayRunColumn1" class="ns1blankspaceColumn1" style="width:200px;padding-right:5px;font-size:0.875em;">' +
												ns1blankspace.xhtml.loadingSmall + '</td>' +
											'<td id="ns1blankspacePayrollPayRunColumn2" class="ns1blankspaceColumn2" style="width:200px;padding-right:15px;font-size:0.75em;"></td>' +
											'<td id="ns1blankspacePayrollPayRunColumn3" class="ns1blankspaceColumn2"></td>' +
											'</tr>' + 
											'</table>');	

							$('#ns1blankspacePayrollPayColumn2').html(aHTML.join(''));
							
							var aHTML = [];
							
							if (ns1blankspace.objectContextData.status == "2") 
							{
								aHTML.push('<div id="ns1blankspaceFinancialPayrollColumnItemType" style="width: 200px;margin-bottom:3px;">');
								aHTML.push('<input style="width: 95px;" type="radio" id="ns1blankspaceFinancialPayrollColumnItemType-3" name="radioType" checked="checked" />' +
												'<label for="ns1blankspaceFinancialPayrollColumnItemType-3" style="width: 95px;">Time</label>');
								aHTML.push('<input style="width: 95px;"  type="radio" id="ns1blankspaceFinancialPayrollColumnItemType-5" name="radioType" />' +
												'<label for="ns1blankspaceFinancialPayrollColumnItemType-5" style="width: 95px;">Expenses</label>');
								aHTML.push('</div>');
							}

							aHTML.push('<div id="ns1blankspaceFinancialPayrollColumnItem" style="width: 200px;margin-bottom:3px;"></div>');

							$('#ns1blankspacePayrollPayRunColumn1').html(aHTML.join(''));

							$('#ns1blankspaceFinancialPayrollColumnItemType').buttonset().css('font-size', '0.75em');

							$('#ns1blankspaceFinancialPayrollColumnItemType :radio').click(function()
							{
								var aID = (event.target.id).split('-');
								$.extend(true, oParam, {step: aID[1]});
								ns1blankspace.financial.payroll.pays(oParam);
							});

							var aHTML = [];
						
							aHTML.push('<table class="ns1blankspaceColumn2">');

							if (ns1blankspace.objectContextData.status == "1")
							{
								aHTML.push('<tr><td >' +
											'<span id="ns1blankspaceFinancialPayrollAdd" class="ns1blankspaceAction">Add</span>' +
											'</td></tr>');
							}
							else
							{
								aHTML.push('<tr class="ns1blankspaceCaption">' +
												'<td class="ns1blankspaceNothing">This pay has been completed.</td></tr>');
							}				
															
							aHTML.push('</table>');					
							
							$('#ns1blankspacePayrollPayRunColumn3').html(aHTML.join(''));
						
							$('#ns1blankspaceFinancialPayrollAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								$.extend(true, oParam, {step: 4, xhtmlElementID: ""});
								ns1blankspace.financial.payroll.pays(oParam);
							})

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
							oSearch.addFilter('id', 'EQUAL_TO', iPay)
							oSearch.addField('grosssalary,calculations,netsalary,deductions,superannuation,calculations,taxbeforerebate');
							oSearch.rows = 1;
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)})	
						}
						else
						{
							ns1blankspace.objectContextData.pay = oResponse.data.rows[0];

							$.extend(true, oParam, {step: 3});
							ns1blankspace.financial.payroll.pays(oParam);

							var aHTML = [];
						
							aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:10px;">');
							
							if (oResponse.data.rows.length != 0)
							{
								var oRow = oResponse.data.rows[0];

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">Gross</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["grosssalary"] +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">Tax</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["taxbeforerebate"] +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">Superannuation</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["superannuation"] +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">Net</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["netsalary"] +
												'</td></tr>');
												
								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">Deductions</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["deductions"] +
												'</td></tr>');								

								aHTML.push('<tr><td colspan=2 class="ns1blankspaceCaption">Calculations</td></tr>' +
												'<tr><td style="padding-left:3px;" colspan=2 class="ns1blankspaceNothing">' +
												(oRow["calculations"]).replace(/\r\n/g, "<br />") +
												'</td></tr>');							
							}
								
							aHTML.push('</table>');
						
							$('#ns1blankspacePayrollPayRunColumn1').html(aHTML.join(''));
						}
					}

					//TIME
					else if (iStep == 3)
					{	
						if (oResponse == undefined)
						{
							$('#ns1blankspacePayrollPayRunColumn2').html(ns1blankspace.xhtml.loadingSmall);
							
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';
							oSearch.addField('type,typetext,hours');
							oSearch.addFilter('id', 'EQUAL_TO', iPay);
							oSearch.rows = 100;
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)})	
						}
						else
						{
							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceFinancialPayrollItem" class="ns1blankspaceColumn2">');
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<tr><td class="ns1blankspaceNothing">No times.</td></tr></table>');
							}
							else
							{		
								aHTML.push('<tr class="ns1blankspaceCaption">');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Type</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Hours</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
								aHTML.push('</tr>');
								
								$(oResponse.data.rows).each(function()
								{
									aHTML.push('<tr class="ns1blankspaceRow">');
										
									aHTML.push('<td id="ns1blankspaceFinancialPayPeriodItem_type-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSelect">' +
															this["typetext"] + '</td>');

									var cHours = parseFloat(this["hours"]);
									aHTML.push('<td id="ns1blankspaceFinancialPayPeriodItem_hours-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect" style="text-align:right;">' +
															 cHours.toFixed(2) + '</td>');						
													
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspaceFinancialPay_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span></td>');				
																												
									aHTML.push('</tr>');
								});	
							}
								
							aHTML.push('</table>');
						
							$('#ns1blankspacePayrollPayRunColumn2').html(aHTML.join(''));

							if (ns1blankspace.objectContextData.status == "1")
							{
								$('ns1blankspaceFinancialPayrollItem > td.ns1blankspaceRowRemove').button(
								{
									text: false,
								 	icons: {primary: "ui-icon-close"}
								})
								.click(function() {
									$.extend(true, oParam, {step: 5, xhtmlElementID: event.target.id});
									ns1blankspace.financial.payroll.pays(this.id)
								})
								.css('width', '15px')
								.css('height', '20px')
							}
						}
					}

					// TIME DETAILS
					else if (iStep == 4)
					{
						var sID; 
						var iType;
						var sXHTMLElementID;

						if (oParam != undefined)
						{
							if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
							if (oParam.type != undefined) {iType = oParam.type}
						}
						
						if (sXHTMLElementID != undefined)
						{
							var aXHTMLElementID = sXHTMLElementID.split('-');
							var sID = aXHTMLElementID[1];
						}	
					
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');
									
						aHTML.push('<tr><td class="ns1blankspaceCaption">Hours</td></tr>' +
										'<tr><td>' +
										'<input id="ns1blankspacePayrollItemHours" class="ns1blankspaceText">' +
										'</td></tr>');
						
						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
											'Type' +
											'</td></tr>' +
											'<tr><td class="ns1blankspaceRadio">' +
											'<table id="tableItemType" style="width:180px;" cellspacing=2>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType1" name="radioItemType" value="1"/></td><td>Normal</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType2" name="radioItemType" value="2"/></td><td>Sick Leave</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType3" name="radioItemType" value="3"/></td><td>Annual Leave</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType4" name="radioItemType" value="4"/></td><td>Long Service Leave</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType5" name="radioItemType" value="5"/></td><td>Compensation</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType6" name="radioItemType" value="6"/></td><td>Overtime (Superannuation Exempt)</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType8" name="radioItemType" value="8"/></td><td>Allowance</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType9" name="radioItemType" value="9"/></td><td>Deduction</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType10" name="radioItemType" value="10"/></td><td>Tax Adjustment</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType11" name="radioItemType" value="11"/></td><td>Leave Loading</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType12" name="radioItemType" value="12"/></td><td>Leave Without Pay</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType14" name="radioItemType" value="14"/></td><td>Bonus</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType15" name="radioItemType" value="15"/></td><td>Rostered Day Off / Time in Lieu</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType16" name="radioItemType" value="16"/></td><td>Salary Sacrifice Superannuation</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType17" name="radioItemType" value="17"/></td><td>Additional Employee Superannuation</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType18" name="radioItemType" value="18"/></td><td>Public Holiday</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType19" name="radioItemType" value="19"/></td><td>Commission</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType20" name="radioItemType" value="20"/></td><td>Termination - Unused Annual Leave</td></tr>' +	
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType21" name="radioItemType" value="21"/></td><td>Termination - Unused Long Service Leave</td></tr>' +
											'<tr><td style="width:15px;"><input type="radio" id="radioItemType22" name="radioItemType" value="22"/></td><td>Paid Parental Leave (Superannuation Exempt)</td></tr>' +
											'</table>' + 
										'</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspacePayrollPayRunColumn2').html(aHTML.join(''));
						
						$('#ns1blankspacePayrollItemHours').focus();

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');
								
						aHTML.push('<tr><td>' +
										'<span style="width:70px;" id="ns1blankspaceAccountEditSave" class="ns1blankspaceAction">Save</span>' +
										'</td></tr>');
										
						aHTML.push('<tr><td>' +
											'<span style="width:70px;" id="ns1blankspaceAccountEditCancel" class="ns1blankspaceAction">Cancel</span>' +
											'</td></tr>');
															
						aHTML.push('</table>');					
							
						$('#ns1blankspacePayrollPayRunColumn3').html(aHTML.join(''));
						
						$('#ns1blankspaceAccountEditSave').button(
						{
							text: "Save"
						})
						.click(function() 
						{
							ns1blankspace.status.working();

							//TODO

							return;

							var sData = 'type=' +  ns1blankspace.util.fs(iType);
							sData += '&id=' + ns1blankspace.util.fs(sID);
							sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceAccountAddTitle').val());
							sData += '&parentaccount=' + ns1blankspace.util.fs($('#ns1blankspaceAccountParentAccount').attr("data-id"));
							sData += '&postable=' + ns1blankspace.util.fs($('input[name="radioPostable"]:checked').val());

							var oAdd =
									{
										"items": [], 
										"title": $('#ns1blankspaceAccountAddTitle').val(),
										"parentaccount": $('#ns1blankspaceAccountParentAccount').attr("data-id"),
										"postable": $('input[name="radioPostable"]:checked').val()
									}

							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_ACCOUNT_MANAGE'),
								data: sData,
								dataType: 'json',
								success: function(data) {
									if (data.status == "OK")
									{
										ns1blankspaceStatus('Saved');

										$.extend(true, oAdd, {id: data.id});
										
										var bNew = true;

										$(ns1blankspace.financial.accounts).each(function(i) 
										{
											if (this.id == data.id) {ns1blankspace.financial.accounts[i] = oAdd; bNew = false}
										});

										if (bNew) {(ns1blankspace.financial.accounts).unshift(oAdd)}

										$.extend(true, oParam, {step: 2});
										ns1blankspace.financial.payroll.pays(oParam)
									}
									else
									{
										ns1blankspace.status.error(data.error.errornotes);
									}
								}
							});
						});

						$('#ns1blankspaceAccountEditCancel').button(
						{
							text: "Cancel"
						})
						.click(function() 
						{
							$.extend(true, oParam, {step: 2});
							ns1blankspace.financial.payroll.pays(oParam);
						});

						if (sID != undefined)
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
							oSearch.addField('title,description,parentaccount,parentaccounttext,postable');
							oSearch.addFilter('id', 'EQUAL_TO', sID);
							oSearch.getResults(function(data) {
									$.extend(true, oParam, {step: 5});
									ns1blankspace.financial.payroll.pays(oParam, data)
									});
						}
						else
						{
							$('[name="radioItemType"][value="1"]').attr('checked', true);
						}
					}

					//EXPENSES
					else if (iStep == 5)
					{	
						if (oResponse == undefined)
						{
							$('#ns1blankspaceFinancialPayrollColumnItem').html(ns1blankspace.xhtml.loadingSmall);
							
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
							oSearch.addField('description,amount');
							oSearch.addFilter('object', 'EQUAL_TO', '37');
							oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContextData.id);
							oSearch.addFilter('contactpersonpaidto', 'EQUAL_TO', ns1blankspace.objectContextData.pay["contactperson"]);
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)})	
						}
						else
						{
							var aHTML = [];
					
							aHTML.push('<table id="ns1blankspaceFinancialPayrollExpenses" class="ns1blankspace">');
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<tr class="ns1blankspaceCaption">' +
												'<td class="ns1blankspaceNothing">No expenses.</td></tr>');
								aHTML.push('</table>');
							}
							else
							{		
								aHTML.push('<tr class="ns1blankspaceCaption">');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
								aHTML.push('</tr>');
								
								$(oResponse.data.rows).each(function()
								{
									aHTML.push('<tr class="ns1blankspaceRow">');
										
									aHTML.push('<td id="ns1blankspaceFinancialPayPeriodExpenseItem_Description-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
															this["description"] + '</td>');

									aHTML.push('<td id="ns1blankspaceFinancialPayPeriodExpenseItem_Amount-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect" style="text-align:right;">' +
															 parseFloat(this["amount"]).toFixed(2) + '</td>');						
													
									aHTML.push('<td style="width:30px;text-align:right;" class="interfaceMainRow">');
									aHTML.push('<span id="ns1blankspaceFinancialPayExpenseItem_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
									aHTML.push('</td>');					
																												
									aHTML.push('</tr>');
								});	
							}
								
							aHTML.push('</table>');
						
							$('#ns1blankspaceFinancialPayrollColumnItem').html(aHTML.join(''));

							if (ns1blankspace.objectContextData.status == "1")
							{
								$('#ns1blankspaceFinancialPayrollExpenses .ns1blankspaceRowRemove').button(
								{
									text: false,
								 	icons: {primary: "ui-icon-close"}
								})
								.click(function() {
									$.extend(true, oParam, {step: 5, xhtmlElementID: event.target.id});
									ns1blankspace.financial.payroll.pays(this.id)
								})
								.css('width', '15px')
								.css('height', '20px')
							}
						}
					}

					else if (iStep == 6)
					{
						if (oResponse.data.rows.length != 0)
						{
							var oObjectContext = oResponse.data.rows[0];
							$('#ns1blankspaceAccountAddTitle').val((oObjectContext.title).formatXHTML());
							$('#ns1blankspaceAccountParentAccount').val(($.grep(ns1blankspace.financial.accounts, function (a) { return a.id == oObjectContext.parentaccount; })[0].title).formatXHTML());
							$('#ns1blankspaceAccountParentAccount').attr('data-id', oObjectContext.parentaccount);
							$('[name="radioPostable"][value="' + oObjectContext.postable + '"]').attr('checked', true);
						}
					}

					//ADD PAY RECORD
					else if (iStep == 7)
					{	
						var aHTML = [];

						if (oResponse == undefined)
						{	
							aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspacePayrollPayAddEmployeeColumn1" style="font-size:0.875em;">' +
										ns1blankspace.xhtml.loading + '</td>' +
										'<td id="ns1blankspacePayrollPayAddEmployeeColumn2" style="width:100px;">' +
										'</td>' +
										'</tr>' + 
										'</table>');				
											
							$('#ns1blankspacePayrollPayColumn2').html(aHTML.join(''));

							$('#ns1blankspacePayrollPayAddEmployeeColumn1').html(ns1blankspace.xhtml.loading);

							var aHTML = [];

							aHTML.push('<table id="ns1blankspacePayrollPayAddEmployee" class="ns1blankspaceColumn2">'+ 
											'<tr><td><span style="width:70px;" id="ns1blankspacePayrollPayAddEmployeeCancel" class="ns1blankspaceAction">' +
												'Cancel</span></td></tr>');
																
							aHTML.push('</table>');					
								
							$('#ns1blankspacePayrollPayAddEmployeeColumn2').html(aHTML.join(''));
							
							$('#ns1blankspacePayrollPayAddEmployeeCancel').button(
							{
								text: "Cancel"
							})
							.click(function() 
							{
								$.extend(true, oParam, {step: 1});
								ns1blankspace.financial.payroll.pays(oParam);
							});

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
							oSearch.addField('contactpersontext,employmentstartdate,statustext,employee.contactperson.firstname,employee.contactperson.surname');
							oSearch.addFilter('status', 'EQUAL_TO', '2')
							oSearch.rows = 50;
							oSearch.sort('employee.contactperson.firstname', 'asc');
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)});

						}
						else
						{

							var aHTML = [];

							aHTML.push('<table class="ns1blankspace">');
							
							$.each(oResponse.data.rows, function() 
							{ 
								aHTML.push('<tr class="ns1blankspaceRow">'+ 
												'<td id="ns1blankspaceEmployee_name-' + this.id + '" class="ns1blankspaceRow">' +
												this.contactpersontext + '</td>' +
												'<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
												'<span id="ns1blankspaceEmployee_options_add-' + this.id + '" class="ns1blankspaceEmployeeAdd"></span>' +
												'</td></tr>');	
							});
							
							aHTML.push('</table>');

							$('#ns1blankspacePayrollPayAddEmployeeColumn1').html(aHTML.join(''));

							$('.ns1blankspaceEmployeeAdd').button(
							{	
								text: false,
								icons:
								{
									primary: "ui-icon-plus"
								}
							})
							.click(function() 
							{
								ns1blankspace.status.working();

								var iEmployee = (this.id).split('-')[1];

								var sData = 'period=' +  ns1blankspace.util.fs(ns1blankspace.objectContext);
								sData += '&employee=' + ns1blankspace.util.fs(iEmployee);

								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_RECORD_MANAGE'),
									data: sData,
									dataType: 'json',
									success: function(data) {
										if (data.status == "OK")
										{
											ns1blankspace.status.message('Saved');
											oParam.step = 1;
											ns1blankspace.financial.payroll.pays(oParam)
										}
										else
										{
											ns1blankspace.status.error(data.error.errornotes);
										}
									}
								});
							});
						}
					}		
				}
}
