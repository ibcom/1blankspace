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
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.financial.init();

					ns1blankspace.object = 37;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'payroll';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Payroll';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.financial.payroll.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);	
				},

	home:		function (oParam, oResponse)
				{		
					if (oResponse == undefined)
					{
						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceMain">');
						aHTML.push('<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ins1blankspaceMain">' +
										ns1blankspace.xhtml.loading +
										'</td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						var aHTML = [];
									
						aHTML.push('<table>');

						aHTML.push('<tr><td id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');
								
						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlPayRuns" class="ns1blankspaceControl">Pays</td>' +
										'</tr>');			
								
						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlEmployees" class="ns1blankspaceControl">Employees</td>' +
										'</tr>');	
									
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						$('#ns1blankspaceControlPayRuns').click(function(event)
						{
							ns1blankspace.show(selector: '#ns1blankspaceMainPayRun', refresh: true});
							ns1blankspace.financial.payroll.home();
						});
					
						$('#ns1blankspaceControlEmployees').click(function(event)
						{
							ns1blankspace.show(selector: '#ns1blankspaceMainEmployee', refresh: true});
							ns1blankspace.financial.payroll.emplyees.show();
						});
						
						var aHTML = [];
						var h = -1;
						
						aHTML[++h] = '<div id="ns1blankspaceMainPayRun" class="divInterfaceViewportMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainEmployee" class="divInterfaceViewportMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainNew" class="divInterfaceViewportMain"></div>';

						$('#divInterfaceMain').html(aHTML.join(''));
					
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
							ns1blankspace.financial.payroll.search.show(event.target.id, {source: 1});
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
										oSearch.addField('startdate,paydate,statustext,status,notes,modifieddate');
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
											ns1blankspace.dialog.position({xhtmlElementID: sElementId});
											
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
									
						aHTML.push('<tr><td id="ns1blankspaceDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePays" class="ns1blankspaceControl">' +
										'Pays</td></tr>');
					
						aHTML.push('</table>');					
							
					$('#divInterfaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="ns1blankspaceMainContext" class="divInterfaceViewportMainContext"></div>';
					aHTML[++h] = '<div id="ns1blankspaceMainSummary" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="ns1blankspaceMainDetails" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="ns1blankspaceMainPays" class="divInterfaceViewportMain"></div>';
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceSummary'});
						ns1blankspace.financial.payroll.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceDetails'});
						ns1blankspace.financial.payroll.details();
					});
					
					$('#ns1blankspaceControlAddress').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspacePays'});
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
							'<br /><span id="ns1blankspaceControlSubContext_status" class="ns1blankspaceControlSubContext">' + ns1blankspace.objectContextData.statustext + '</span>');
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.financial.payroll.init({showHome: false});ns1blankspace.financial.payroll.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							})
						
						ns1blankspace.history.object({functionDefault: 'ns1blankspace.financial.payroll.summary()'})
					}
				},

	summary: 	function interfaceFinancialPayrollSummary(oParam, oResponse)
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
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:100px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
					
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspaceColumn1">';

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Phone</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryStartDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.startdate +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Phone</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryStartDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.paydate +
										'</td></tr>');
				
						aHTML.push('</table>');					

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2" style="width: 100%">');
						
						if (ns1blankspace.objectContextData.statustext != '')
						{	
							aHTML[++h] = '<tr><td class="ns1blankspaceSummary" style="padding-bottom:10px;">' +
										ns1blankspace.objectContextData.statustext +
										'</td></tr>';				
						}
						
						if (ns1blankspace.objectContextData.status == 1)
						{	
							aHTML[++h] = '<tr><td>' +
										'<span style="font-size:0.75em;" id="ns1blankspaceStatusComplete">Complete</span>' +
										'</td></tr>';			
						}
						
						aHTML[++h] = '</table>';					
						
						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));	

						$('#ns1blankspaceStatusComplete').button(
						{
						})
						.click(function()
							{
								$.ajax(
								{
									type: 'POST',
									url: ns1blankspaceEndpointURL('FINANCIAL_PAYROLL_PAY_PERIOD_MANAGE'),
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
										'Pay Date' +
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
										aHTML.push('<table class="ns1blankspace" style="padding-right:15px;">';

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
													ns1blankspace.financial.payroll.new..process(
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
																ns1blankspace.financial.payroll.new..process(
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
											ns1blankspace.show(selector: '#divInterfaceMainEmployee'});
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
															
										$('#ns1blankspaceEmployee').html(aHTML.join(''));
										
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
										
											ns1blankspace.pagination.list(
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
												$('#ns1blankspacePayrollEmployees td.Highlight').removeClass('Highlight');
												$('#' + event.target.id).addClass('Highlight');
												var aID = (event.target.id).split('-');
												$.extend(true, oParam, {step: 2, employee: parseInt(aID[1])});
												ns1blankspace.financial.payroll.employees.show(oParam);
											});	
										}
									}

									if (iStep == 11)
									{
										var aHTML = [];
										var h = -1;

										aHTML[++h] = '<table style="width:100%">' +
														'<tr>' +
														'<td id="tdInterfaceMainPayrollEmployeeDetailsEditColumn1" style="font-size:0.875em;padding-right:15px;>' +
														ns1blankspace.xhtml.loading +
														'</td>' +
														'<td id="tdInterfaceMainPayrollEmployeeDetailsEditColumn2" class="interfaceMainColumn2" style="width:75px;font-size:0.875em;">' +
														'<span style="width:60px;font-size:0.75em;" id="spanPayrollEmployeeEdit_options_save">Save</span>' +
														'</td>' +
														'</tr></table>';				
											
										$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										$('#spanPayrollEmployeeEdit_options_save').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											ns1blankspaceStatusWorking();
										});	

									}	
									
									//EMPLOYEE DETAILS
									if (iStep == 2)
									{
										if (oResponse == undefined)
										{
											$('#tdInterfaceMainPayrollEmployeeColumn2').html(ns1blankspace.xhtml.loadingSmall);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
											oSearch.addField('*');
											oSearch.addFilter('id', 'EQUAL_TO', iEmployee);
											oSearch.getResults(function(data) {interfaceFinancialPayrollEmployees(oParam, data)});
										}
										else
										{
											ns1blankspace.financial.employee = oResponse.data.rows[0];
										
											var aHTML = [];
											var h = -1;
											
											aHTML[++h] = '<table class="interfaceMainPayrollEmployeeDetails" cellspacing=0 cellpadding=0>' +
													'<tr id="trInterfaceMainPayrollEmployeeDetailsRow1" class="interfaceMainRow1">' +
													'<td id="tdInterfaceMainPayrollEmployeeDetailsColumn1" style="width:50px;font-size:0.875em;padding-right:10px;">' +
													'</td>' +
													'<td id="tdInterfaceMainPayrollEmployeeDetailsColumn2" class="interfaceMainColumn2">' +
													'</td>' +
													'</tr>' +
													'</table>';			
										
											$('#tdInterfaceMainPayrollEmployeeColumn2').html(aHTML.join(''));
											
											var aHTML = [];
											var h = -1;

											aHTML[++h] = '<table id="tableEmployeeDetails" cellpadding=6>';

											aHTML[++h] = '<tr class="interfaceMainRow">';		
											aHTML[++h] = '<td id="interfaceFinancialEmployee_details-11" class="interfaceMainRow interfaceMainRowSelect employeedetails">' +
																	'Details</td>';
											aHTML[++h] = '</tr>';

											aHTML[++h] = '<tr class="interfaceMainRow">';
											aHTML[++h] = '<td id="interfaceFinancialEmployee_details-12" class="interfaceMainRow interfaceMainRowSelect employeedetails">' +
																	'Payroll</td>';																					
											aHTML[++h] = '</tr>';

											aHTML[++h] = '<tr class="interfaceMainRow">';
											aHTML[++h] = '<td id="interfaceFinancialEmployee_details-13" class="interfaceMainRow interfaceMainRowSelect employeedetails">' +
																	'Pay Rates</td>';																					
											aHTML[++h] = '</tr>';

											aHTML[++h] = '<tr class="interfaceMainRow">';
											aHTML[++h] = '<td id="interfaceFinancialEmployee_details-14" class="interfaceMainRow interfaceMainRowSelect employeedetails">' +
																	'Bank&nbsp;Accounts</td>';																					
											aHTML[++h] = '</tr>';


											aHTML[++h] = '<tr class="interfaceMainRow">';
											aHTML[++h] = '<td id="interfaceFinancialEmployee_details-15" class="interfaceMainRow interfaceMainRowSelect employeedetails">' +
																	'Superannuation</td>';																					
											aHTML[++h] = '</tr>';


											aHTML[++h] = '<tr class="interfaceMainRow">';
											aHTML[++h] = '<td id="interfaceFinancialEmployee_details-16" class="interfaceMainRow interfaceMainRowSelect employeedetails">' +
																	'Role</td>';																					
											aHTML[++h] = '</tr>';

											aHTML[++h] = '<tr class="interfaceMainRow">';
											aHTML[++h] = '<td id="interfaceFinancialEmployee_details-17" class="interfaceMainRow interfaceMainRowSelect employeedetails">' +
																	'Induction</td>';																					
											aHTML[++h] = '</tr>';

											aHTML[++h] = '</table>';

											$('#tdInterfaceMainPayrollEmployeeDetailsColumn1').html(aHTML.join(''));
										
											$('.employeedetails').click(function()
											{
												$('#tableEmployeeDetails td.Highlight').removeClass('Highlight');
												$('#' + event.target.id).addClass('Highlight');
												var aID = (event.target.id).split('-');
												$.extend(true, oParam, {step: parseInt(aID[1]), stepAction: 1});
												interfaceFinancialPayrollEmployees(oParam);
											});

											$('#interfaceFinancialEmployee_details-11').addClass('Highlight');
											$.extend(true, oParam, {step: 11});
											interfaceFinancialPayrollEmployees(oParam);
										}
									}
									
									if (iStep == 11)
									{
										var aHTML = [];
										var h = -1;
											
										aHTML[++h] = '<table id="tableInterfaceMainEmployeeDetails" class="interfaceMain">';
										
										aHTML[++h] = '<tr id="trInterfaceMainEmployeeDetailsStatus" class="interfaceMain">' +
														'<td id="tdInterfaceMainEmployeeDetailsStatus" class="interfaceMain">' +
														'Status' +
														'</td></tr>' +
														'<tr id="trInterfaceMainEmployeeDetailsStatus" class="interfaceMainText">' +
														'<td id="tdInterfaceMainEmployeeDetailsStatusValue" class="interfaceMainRadio">' +
														'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Proposed' +
														'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Active' +
														'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>In-active' +
														'</td></tr>';
										
										aHTML[++h] = '<tr id="trInterfaceMainEmployeeDetailsNotes" class="interfaceMain">' +
														'<td id="tdInterfaceMainEmployeeDetailsNotes" class="interfaceMain">' +
														'Notes' +
														'</td></tr>' +
														'<tr id="trInterfaceMainEmployeeDetailsNotesValue" class="interfaceMainTextMulti">' +
														'<td id="tdInterfaceMainEmployeeDetailsNotesValue" class="interfaceMainTextMulti">' +
														'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsNotes" class="inputInterfaceMainTextMultiSmall"></textarea>' +
														'</td></tr>';
										
										aHTML[++h] = '</table>';					
											
										$('#tdInterfaceMainPayrollEmployeeDetailsEditColumn1').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('[name="radioStatus"][value="' + ns1blankspace.financial.employee["employee.status"] + '"]').attr('checked', true);
											$('#inputInterfaceMainEmployeeDetailsNotes').val(ns1blankspace.financial.employee["employee.description"]);
										}
										else
										{
											$('[name="radioStatus"][value="1"]').attr('checked', true);
										}
									}
									
									if (iStep == 12)
									{
										var aHTML = [];
										var h = -1;
											
										aHTML[++h] = '<table id="tableInterfaceMainEmployeeDetails" class="interfaceMain">';
										
										aHTML[++h] = '<tr><td class="interfaceMain">Frequency</td></tr>' +
														'<tr><td class="interfaceMainRadio">' +
														'<input type="radio" id="radioFrequency1" name="radioFrequency" value="1"/>Weekly' +
														'<br /><input type="radio" id="radioFrequency2" name="radioFrequency" value="2"/>Fortnightly' +
														'<br /><input type="radio" id="radioFrequency3" name="radioFrequency" value="3"/>Monthly' +
														'<br /><input type="radio" id="radioFrequency4" name="radioFrequency" value="4"/>Bi/Semi Monthly' +
														'</td></tr>';
										
										aHTML[++h] = '<tr><td class="interfaceMain">Allowance Amount</td></tr>' +
														'<tr><td class="interfaceMainText">' +
														'<input id="inputInterfaceMainDetailsAllowance" class="inputInterfaceMainText">' +
														'</td></tr>';

										aHTML[++h] = '<tr><td class="interfaceMain">Allowance Description</td></tr>' +
														'<tr><td class="interfaceMainText">' +
														'<input id="inputInterfaceMainDetailsAllowanceDescription" class="inputInterfaceMainText">' +
														'</td></tr>';				
										
										aHTML[++h] = '<tr><td class="interfaceMain">Standard Deduction Amount</td></tr>' +
														'<tr><td class="interfaceMainText">' +
														'<input id="inputInterfaceMainDetailsDeduction" class="inputInterfaceMainText">' +
														'</td></tr>';

										aHTML[++h] = '<tr><td class="interfaceMain">Standard Deduction Description</td></tr>' +
														'<tr><td class="interfaceMainText">' +
														'<input id="inputInterfaceMainDetailsDeductionDescription" class="inputInterfaceMainText">' +
														'</td></tr>';

										aHTML[++h] = '<tr><td class="interfaceMain">Medicare</td></tr>' +
														'<tr><td class="interfaceMainRadio">' +
														'<input type="radio" id="radioMedicare1" name="radioMedicare" value="1"/>Pay Medicare' +
														'<br /><input type="radio" id="radioMedicare2" name="radioMedicare" value="2"/>Full Exemption' +
														'<br /><input type="radio" id="radioMedicare3" name="radioMedicare" value="3"/>Half Exemption' +
														'</td></tr>';

										aHTML[++h] = '<tr><td class="interfaceMain">Tax File Number</td></tr>' +
														'<tr><td class="interfaceMainText">' +
														'<input id="inputInterfaceMainDetailsTaxNumber" class="inputInterfaceMainText">' +
														'</td></tr>';

										aHTML[++h] = '</table>';					
											
										$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('[name="radioMedicare"][value="' + ns1blankspace.financial.employee["employee.status"] + '"]').attr('checked', true);
											$('[name="radioFrequency"][value="' + ns1blankspace.financial.employee["employee.payfrequency"] + '"]').attr('checked', true);
											$('#inputInterfaceMainDetailsAllowanceDescription').val(ns1blankspace.financial.employee["employee.allowancedescription"]);
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
										var h = -1;
											
										aHTML[++h] = '<table id="tableInterfaceMainEmployeeDetails" class="interfaceMain">';
										
										aHTML[++h] = '<tr><td class="interfaceMain">Fund Name</td></tr>' +
														'<tr><td class="interfaceMainText">' +
														'<input id="inputInterfaceMainDetailsEmployerFundName" class="inputInterfaceMainText">' +
														'</td></tr>';

										aHTML[++h] = '<tr><td class="interfaceMain">Fund Member Number</td></tr>' +
														'<tr><td class="interfaceMainText">' +
														'<input id="inputInterfaceMainDetailsEmployerFundMemberName" class="inputInterfaceMainText">' +
														'</td></tr>';				
										
										aHTML[++h] = '<tr><td class="interfaceMain">Superannuation %</td></tr>' +
														'<tr><td class="interfaceMainText">' +
														'<input id="inputInterfaceMainDetailsEmployerSuperannuationRate" class="inputInterfaceMainText">' +
														'</td></tr>';

										aHTML[++h] = '<tr><td class="interfaceMain">Salary Sacrifice Contribution</td></tr>' +
														'<tr><td class="interfaceMainRadio">' +
														'<input type="radio" id="radioEmployerType1" name="radioEmployer" value="1"/>Dollar amount per pay' +
														'<br /><input type="radio" id="radioEmployerType2" name="radioEmployer" value="2"/>Percentage of pay' +
														'</td></tr>';				

										aHTML[++h] = '</table>';					
											
										$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('[name="radioEmployerType1"][value="' + ns1blankspace.financial.employee["employee.status"] + '"]').attr('checked', true);
											$('#inputInterfaceMainDetailsAllowanceDescription').val(ns1blankspace.financial.employee["employee.allowancedescription"]);
										}
										else
										{
											$('[name="radioMedicare"][value="1"]').attr('checked', true);
										}
									}	

									//ROLE
									if (iStep == 16)
									{
										var aHTML = [];
										var h = -1;
											
										aHTML[++h] = '<table id="tableInterfaceMainEmployeeDetails" class="interfaceMain">';
										
										aHTML[++h] = '<tr><td class="interfaceMain">Description</td></tr>' +
														'<tr><td class="interfaceMainTextMulti">' +
														'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsJobDetails" class="inputInterfaceMainTextMultiSmall"></textarea>' +
														'</td></tr>';

										aHTML[++h] = '<tr><td class="interfaceMain">Reports To</td></tr>' +
														'<tr><td class="interfaceMainTextMulti">' +
														'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsInternalRelationships" class="inputInterfaceMainTextMultiSmall"></textarea>' +
														'</td></tr>';

										aHTML[++h] = '<tr><td class="interfaceMain">KPIs</td></tr>' +
														'<tr><td class="interfaceMainTextMulti">' +
														'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsKPI" class="inputInterfaceMainTextMultiSmall"></textarea>' +
														'</td></tr>';

										aHTML[++h] = '<tr><td class="interfaceMain">Responsibilities</td></tr>' +
														'<tr><td class="interfaceMainTextMulti">' +
														'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsResponsibilities" class="inputInterfaceMainTextMultiSmall"></textarea>' +
														'</td></tr>';

										aHTML[++h] = '<tr><td class="interfaceMain">Tasks</td></tr>' +
														'<tr><td class="interfaceMainTextMulti">' +
														'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsTasks" class="inputInterfaceMainTextMultiSmall"></textarea>' +
														'</td></tr>';

										aHTML[++h] = '</table>';					
											
										$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#inputInterfaceMainDetailsJobDetails').val(ns1blankspace.financial.employee["employee.jobdetails"]);
										}
									}	

									//INDUCTION
									if (iStep == 17)
									{
										var aHTML = [];
										var h = -1;
											
										aHTML[++h] = '<table id="tableInterfaceMainEmployeeDetails" class="interfaceMain">';
										
										aHTML[++h] = '<tr><td class="interfaceMain">Induction Date</td></tr>' +
														'<tr><td class="interfaceMainText">' +
														'<input id="inputInterfaceMainDetailsInductionDate" class="inputInterfaceMainDate">' +
														'</td></tr>';

										aHTML[++h] = '<tr><td class="interfaceMain">Workers Compensation Insurance Completed</td></tr>' +
														'<tr><td class="interfaceMainRadio">' +
														'<input type="radio" id="radioWorkersCompensationY" name="radioWorkersCompensation" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioWorkersCompensationN" name="radioWorkersCompensation" value="N"/>No' +
														'</td></tr>';				

										aHTML[++h] = '</table>';					
											
										$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('[name="radioWorkersCompensation"][value="' + ns1blankspace.financial.employee["employee.workerscompform"] + '"]').attr('checked', true);
										}
										else
										{
											$('[name="radioMedicare"][value="1"]').attr('checked', true);
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
												url: '/ondemand/financial/?method=FINANCIAL_PAYROLL_EMPLOYEE_PAYRATE_MANAGE',
												data: 'remove=1&id=' + aXHTMLElementID[1],
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
														$.extend(true, oParam, {stepAction: 1});
														interfaceFinancialPayrollEmployees(oParam);
														ns1blankspaceStatus('Removed');
													}
													else
													{
														ns1blankspaceError(data.error.errornotes);
													}
												}
											});

										}
										else
										{
											if ((iStepAction == 1 || iStepAction == 2) && (oResponse == undefined))
											{
												$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html(ns1blankspace.xhtml.loadingSmall);

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

												oSearch.getResults(function(data){interfaceFinancialPayrollEmployees(oParam, data)});
											}
											else
											{
												var aHTML = [];
												var h = -1;
											
												aHTML[++h] = '<table style="width:100%">' +
																'<tr>' +
																'<td id="tdInterfaceMainPayrollEmployeeDetailsPayRateColumn1" style="font-size:0.875em;>' +
																ns1blankspace.xhtml.loading +
																'</td>' +
																'<td id="tdInterfaceMainPayrollEmployeeDetailsPayRateColumn2" class="interfaceMainColumn2" style="width:75px;">' +
																'</td>' +
																'</tr></table>';				
											
												$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html(aHTML.join(''));
											
												var aHTML = [];
												var h = -1;

												if (iStepAction == 1)
												{
													$('#tdInterfaceMainPayrollEmployeeDetailsPayRateColumn2').html('<span id="spanPayrollEmployee_options_add" class="interfaceMainRowOptionsAdd" style="font-size:0.75em;">Add</span>');

													$('#spanPayrollEmployee_options_add').button(
													{
														text: "Add"
													})
													.click(function() {
														$.extend(true, oParam, {stepAction: 3, xhtmlElementID: "", id: ""});
														interfaceFinancialPayrollEmployees(oParam);
													})
													.css('font-size', '0.75em');
												
													if (oResponse.data.rows.length == 0)
													{
														aHTML[++h] = '<table>';
														aHTML[++h] = '<tr>';
														aHTML[++h] = '<td class="interfaceMainRowNothing">No pay rates.</td>';
														aHTML[++h] = '</tr>';
														aHTML[++h] = '</table>';

														$('#ttdInterfaceMainPayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));
													}
													else
													{			
														aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
														aHTML[++h] = '<tbody>'
												
														aHTML[++h] = '<tr class="interfaceMainCaption">';
														aHTML[++h] = '<td class="interfaceMainCaption">Start Date</td>';
														aHTML[++h] = '<td class="interfaceMainCaption">End Date</td>';
														aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Rate</td>';
														aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
														aHTML[++h] = '</tr>';

														$(oResponse.data.rows).each(function() 
														{
															aHTML[++h] = '<tr class="interfaceMainRow">';
															
															aHTML[++h] = '<td id="interfacePayrollEmployeeDetailsPayRate_StartDate-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect payrate">' +
																					this.startdate + '</td>';
																				
															aHTML[++h] = '<td id="interfacePayrollEmployeeDetailsPayRate_EndDate-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect payrate">' +
																					this.enddate + '</td>';
																	
															aHTML[++h] = '<td id="interfacePayrollEmployeeDetailsPayRate_EndDate-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect payrate" style="text-align:right;">' +
																					this.rate + '</td>';
																																
															aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
															
															aHTML[++h] = '<span id="spanSubscription_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
																
															aHTML[++h] = '</td>';				
																											
															aHTML[++h] = '</tr>'
														});
														
														aHTML[++h] = '</tbody></table>';
													}
													
													$('#tdInterfaceMainPayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));

													$('.interfaceMainRowOptionsRemove').button(
													{
														text: false,
														icons: {
															primary: "ui-icon-close"
														}
													})
													.click(function() {
														$.extend(true, oParam, {stepAction: 4, xhtmlElementID: this.id});
														interfaceFinancialPayrollEmployees(oParam);
													})
													.css('width', '15px')
													.css('height', '17px');

													$('.payrate').click(function() {
														$.extend(true, oParam, {stepAction: 2, xhtmlElementID: event.target.id});
														interfaceFinancialPayrollEmployees(oParam);
													})
												}
												else
												{
													aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain" style="padding-right:15px;">';
										
													aHTML[++h] = '<tr><td class="interfaceMain">Start Date</td></tr>' +
																	'<tr><td>' +
																	'<input id="inputInterfacePayrollEmployeeDetailsPayRateStartDate" class="inputInterfaceMainDate">' +
																	'</td></tr>';	

													aHTML[++h] = '<tr><td class="interfaceMain">End Date</td></tr>' +
																	'<tr><td>' +
																	'<input id="inputInterfacePayrollEmployeeDetailsPayRateEndDate" class="inputInterfaceMainDate">' +
																	'</td></tr>';

													aHTML[++h] = '<tr><td class="interfaceMain">Rate Amount</td></tr>' +
																	'<tr><td>' +
																	'<input id="inputInterfacePayrollEmployeeDetailsPayRateAmount" class="inputInterfaceMainText">' +
																	'</td></tr>';				

													aHTML[++h] = '</table>';

													$('#tdInterfaceMainPayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));

													$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});

													var aHTML = [];
													var h = -1;

													aHTML[++h] = '<table class="interfaceMain" style="font-size:0.875em">' +
																	'<tr iclass="interfaceMainAction">' +
																	'<td class="interfaceMainAction">' +
																	'<span style="width:70px;" id="spanPayrollEmployee_options_save">Save</span>' +
																	'</td></tr>' +
																	'<tr class="interfaceMainAction">' +
																	'<td class="interfaceMainAction">' +
																	'<span style="width:70px;" id="spanPayrollEmployee_options_cancel">Cancel</span>' +
																	'</td></tr>' +
																	'</table>';	

													$('#tdInterfaceMainPayrollEmployeeDetailsPayRateColumn2').html(aHTML.join(''));

													$('#spanPayrollEmployee_options_save').button(
													{
														text: "Save"
													})
													.click(function() 
													{
														ns1blankspaceStatusWorking();

														var sData = 'id=' + ns1blankspace.util.fs(iID);
														if (iID == '')
														{
															sData += '&employee=' + ns1blankspace.util.fs(iEmployee);
														}	
														sData += '&startdate=' + ns1blankspace.util.fs($('#inputInterfacePayrollEmployeeDetailsPayRateStartDate').val());
														sData += '&enddate=' + ns1blankspace.util.fs($('#inputInterfacePayrollEmployeeDetailsPayRateEndDate').val());
														sData += '&rate=' + ns1blankspace.util.fs($('#inputInterfacePayrollEmployeeDetailsPayRateAmount').val());

														$.ajax(
														{
															type: 'POST',
															url: '/ondemand/financial/?method=FINANCIAL_PAYROLL_EMPLOYEE_PAYRATE_MANAGE',
															data: sData,
															dataType: 'json',
															success: function(data) {
																if (data.status == "OK")
																{
																	ns1blankspaceStatus('Saved');
																	$.extend(true, oParam, {stepAction: 1, id: ''});
																	interfaceFinancialPayrollEmployees(oParam);
																}
																else
																{
																	ns1blankspaceError(data.error.errornotes);
																}
															}
														});
													});

													$('#spanPayrollEmployee_options_cancel').button(
													{
														text: "Cancel"
													})
													.click(function() 
													{
														$.extend(true, oParam, {stepAction: 1});
														interfaceFinancialPayrollEmployees(oParam);
													});
													
													if (oResponse != undefined)
													{	
														if (oResponse.data.rows.length != 0)
														{
															var oObjectContext = oResponse.data.rows[0];
															
															$('#inputInterfacePayrollEmployeeDetailsPayRateStartDate').val(oObjectContext.startdate);
															$('#inputInterfacePayrollEmployeeDetailsPayRateEndDate').val(oObjectContext.enddate);
															$('#inputInterfacePayrollEmployeeDetailsPayRateAmount').val(oObjectContext.rate);
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
												url: '/ondemand/financial/?method=FINANCIAL_PAYROLL_EMPLOYEE_BANK_ACCOUNT_MANAGE',
												data: 'remove=1&id=' + aXHTMLElementID[1],
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
														$.extend(true, oParam, {stepAction: 1});
														interfaceFinancialPayrollEmployees(oParam);
														ns1blankspaceStatus('Removed');
													}
													else
													{
														ns1blankspaceError(data.error.errornotes);
													}
												}
											});

										}
										else
										{
											if ((iStepAction == 1 || iStepAction == 2) && (oResponse == undefined))
											{
												$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html(ns1blankspace.xhtml.loadingSmall);

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

												oSearch.getResults(function(data){interfaceFinancialPayrollEmployees(oParam, data)});
											}
											else
											{
												var aHTML = [];
												var h = -1;
											
												aHTML[++h] = '<table style="width:100%">' +
																'<tr>' +
																'<td id="tdInterfaceMainPayrollEmployeeDetailsBankAccountColumn1" style="font-size:0.875em;>' +
																ns1blankspace.xhtml.loading +
																'</td>' +
																'<td id="tdInterfaceMainPayrollEmployeeDetailsBankAccountColumn2" class="interfaceMainColumn2" style="width:75px;">' +
																'</td>' +
																'</tr></table>';				
											
												$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html(aHTML.join(''));
											
												var aHTML = [];
												var h = -1;

												if (iStepAction == 1)
												{
													$('#tdInterfaceMainPayrollEmployeeDetailsBankAccountColumn2').html('<span id="spanPayrollEmployee_options_add" class="interfaceMainRowOptionsAdd" style="font-size:0.75em;">Add</span>');

													$('#spanPayrollEmployee_options_add').button(
													{
														text: "Add"
													})
													.click(function() {
														$.extend(true, oParam, {stepAction: 3, xhtmlElementID: "", id: ""});
														interfaceFinancialPayrollEmployees(oParam);
													})
													.css('font-size', '0.75em');
												
													if (oResponse.data.rows.length == 0)
													{
														aHTML[++h] = '<table>';
														aHTML[++h] = '<tr>';
														aHTML[++h] = '<td class="interfaceMainRowNothing">No bank accounts.</td>';
														aHTML[++h] = '</tr>';
														aHTML[++h] = '</table>';

														$('#ttdInterfaceMainPayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));
													}
													else
													{			
														aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
														aHTML[++h] = '<tbody>'
												
														aHTML[++h] = '<tr class="interfaceMainCaption">';
														aHTML[++h] = '<td class="interfaceMainCaption">Name</td>';
														aHTML[++h] = '<td class="interfaceMainCaption">BSB</td>';
														aHTML[++h] = '<td class="interfaceMainCaption">Number</td>';
														aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">%</td>';
														aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
														aHTML[++h] = '</tr>';

														$(oResponse.data.rows).each(function() 
														{
															aHTML[++h] = '<tr class="interfaceMainRow">';
															
															aHTML[++h] = '<td id="interfacePayrollEmployeeDetailsBankAccount_Name-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect bankaccount">' +
																					this.accountname + '</td>';
																				
															aHTML[++h] = '<td id="interfacePayrollEmployeeDetailsBankAccount_BSB-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect bankaccount">' +
																					this.bsb + '</td>';
																	
															aHTML[++h] = '<td id="interfacePayrollEmployeeDetailsBankAccount_Number-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect bankaccount">' +
																					this.accountnumber + '</td>';

															aHTML[++h] = '<td id="interfacePayrollEmployeeDetailsBankAccount_Percentage-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect payrate" style="text-align:right;">' +
																					this.percentage + '</td>';						
																																
															aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
															
															aHTML[++h] = '<span id="spanBankAccount_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
																
															aHTML[++h] = '</td>';				
																											
															aHTML[++h] = '</tr>'
														});
														
														aHTML[++h] = '</tbody></table>';
													}
													
													$('#tdInterfaceMainPayrollEmployeeDetailsBankAccountColumn1').html(aHTML.join(''));

													$('.interfaceMainRowOptionsRemove').button(
													{
														text: false,
														icons: {
															primary: "ui-icon-close"
														}
													})
													.click(function() {
														$.extend(true, oParam, {stepAction: 4, xhtmlElementID: this.id});
														interfaceFinancialPayrollEmployees(oParam);
													})
													.css('width', '15px')
													.css('height', '17px');

													$('.bankaccount').click(function() {
														$.extend(true, oParam, {stepAction: 2, xhtmlElementID: event.target.id});
														interfaceFinancialPayrollEmployees(oParam);
													})
												}
												else
												{
													aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain" style="padding-right:15px;">';
										
													aHTML[++h] = '<tr><td class="interfaceMain">Account Name</td></tr>' +
																	'<tr><td>' +
																	'<input id="inputInterfacePayrollEmployeeDetailsBankAccountName" class="inputInterfaceMainText">' +
																	'</td></tr>';	

													aHTML[++h] = '<tr><td class="interfaceMain">BSB</td></tr>' +
																	'<tr><td>' +
																	'<input id="inputInterfacePayrollEmployeeDetailsBankAccountBSB" class="inputInterfaceMainText">' +
																	'</td></tr>';

													aHTML[++h] = '<tr><td class="interfaceMain">Account Number</td></tr>' +
																	'<tr><td>' +
																	'<input id="inputInterfacePayrollEmployeeDetailsBankAccountNumber" class="inputInterfaceMainText">' +
																	'</td></tr>';				

													aHTML[++h] = '<tr><td class="interfaceMain">% Split</td></tr>' +
																	'<tr><td>' +
																	'<input id="inputInterfacePayrollEmployeeDetailsBankAccountPercentage" class="inputInterfaceMainText">' +
																	'</td></tr>';

													aHTML[++h] = '</table>';

													$('#tdInterfaceMainPayrollEmployeeDetailsBankAccountColumn1').html(aHTML.join(''));

													$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});

													var aHTML = [];
													var h = -1;

													aHTML[++h] = '<table class="interfaceMain" style="font-size:0.875em">' +
																	'<tr iclass="interfaceMainAction">' +
																	'<td class="interfaceMainAction">' +
																	'<span style="width:70px;" id="spanPayrollEmployee_options_save">Save</span>' +
																	'</td></tr>' +
																	'<tr class="interfaceMainAction">' +
																	'<td class="interfaceMainAction">' +
																	'<span style="width:70px;" id="spanPayrollEmployee_options_cancel">Cancel</span>' +
																	'</td></tr>' +
																	'</table>';	

													$('#tdInterfaceMainPayrollEmployeeDetailsBankAccountColumn2').html(aHTML.join(''));

													$('#spanPayrollEmployee_options_save').button(
													{
														text: "Save"
													})
													.click(function() 
													{
														ns1blankspaceStatusWorking();

														var sData = 'id=' + ns1blankspace.util.fs(iID);
														if (iID == '')
														{
															sData += '&employee=' + ns1blankspace.util.fs(iEmployee);
														}	
														sData += '&accountname=' + ns1blankspace.util.fs($('#inputInterfacePayrollEmployeeDetailsBankAccountName').val());
														sData += '&bsb=' + ns1blankspace.util.fs($('#inputInterfacePayrollEmployeeDetailsBankAccountBSB').val());
														sData += '&accountnumber=' + ns1blankspace.util.fs($('#inputInterfacePayrollEmployeeDetailsBankAccountNumber').val());
														sData += '&percentage=' + ns1blankspace.util.fs($('#inputInterfacePayrollEmployeeDetailsBankAccountPercentage').val());

														$.ajax(
														{
															type: 'POST',
															url: '/ondemand/financial/?method=FINANCIAL_PAYROLL_EMPLOYEE_BANK_ACCOUNT_MANAGE',
															data: sData,
															dataType: 'json',
															success: function(data) {
																if (data.status == "OK")
																{
																	ns1blankspaceStatus('Saved');
																	$.extend(true, oParam, {stepAction: 1, id: ''});
																	interfaceFinancialPayrollEmployees(oParam);
																}
																else
																{
																	ns1blankspaceError(data.error.errornotes);
																}
															}
														});
													});

													$('#spanPayrollEmployee_options_cancel').button(
													{
														text: "Cancel"
													})
													.click(function() 
													{
														$.extend(true, oParam, {stepAction: 1});
														interfaceFinancialPayrollEmployees(oParam);
													});
													
													if (oResponse != undefined)
													{	
														if (oResponse.data.rows.length != 0)
														{
															var oObjectContext = oResponse.data.rows[0];
															
															$('#inputInterfacePayrollEmployeeDetailsBankAccountName').val(oObjectContext.accountname);
															$('#inputInterfacePayrollEmployeeDetailsBankAccountBSB').val(oObjectContext.bsb);
															$('#inputInterfacePayrollEmployeeDetailsBankAccountNumber').val(oObjectContext.accountnumber);
															$('#inputInterfacePayrollEmployeeDetailsBankAccountPercentage').val(oObjectContext.percentage);
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

					row:		function interfaceFinancialPayrollEmployeesRow(oRow)
								{
									var aHTML = [];
									var h = -1;

									if (oRow.contactpersontext != '')
									{
										aHTML[++h] = '<tr class="interfaceMainRow">';
												
										aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Contact-' + oRow.id + '" class="interfaceMainRow interfaceMainRowSelect employee">' +
																oRow["employee.contactperson.firstname"] + ' ' + oRow["employee.contactperson.surname"] + '</td>';
									
										aHTML[++h] = '</tr>'
									}

									return aHTML.join('');
								}
				},				

	pays: 		function interfaceFinancialPayrollPays(oParam, oResponse)
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
						var h = -1;	
							
						if (oResponse == undefined)
						{
										
							aHTML[++h] = '<table class="interfaceMain">' +
										'<tr class="interfaceMainRow1">' +
										'<td id="tdInterfaceMainFinancialPayrollColumnList" style="width:150px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumnX">' +
										ns1blankspace.xhtml.loading + '</td>' +
										'<td id="tdInterfaceMainFinancialPayrollColumnListAction" class="interfaceMainColumn2">' +
										'</td>' +
										'</tr>' +
										'</table>';			
									
							$('#divInterfaceMainPays').html(aHTML.join(''));
						
							$('#tdInterfaceMainFinancialPayrollColumnList').html(ns1blankspace.xhtml.loadingSmall);
							$('#tdInterfaceMainFinancialPayrollColumnItem').html("");

							if (ns1blankspace.objectContextData.status == "1")
							{
								var aHTML = [];
								var h = -1;	
								
								aHTML[++h] = '<table id="tableInterfaceMainFinancialPayrollColumnAction" class="interfaceMainColumn2">';
								aHTML[++h] = '<tr><td id="tdInterfaceMainFinancialPayrollAdd" class="interfaceMainAction">' +
												'<span id="spanInterfaceMainFinancialPayrollAdd">Add</span>' +
												'</td></tr>';
																
								aHTML[++h] = '</table>';					
								
								$('#tdInterfaceMainFinancialPayrollColumnListAction').html(aHTML.join(''));
							
								$('#spanInterfaceMainFinancialPayrollAdd').button(
								{
									label: "Add"
								})
								.click(function()
								{
									$.extend(true, oParam, {step: 4, xhtmlElementID: ""});
									interfaceSetupFinancialPayrollPays(oParam);
								})
							}

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
							oSearch.addField('grosssalary,payrecord.employee.contactpersontext');
							oSearch.addFilter('period', 'EQUAL_TO', ns1blankspace.objectContext)
							oSearch.rows = 200;
							oSearch.sort('payrecord.employee.contactpersontext', 'asc');
							oSearch.getResults(function(data) {interfaceFinancialPayrollPays(oParam, data)})	
						}
						else
						{
							var aHTML = [];
							var h = -1;
					
							aHTML[++h] = '<table id="tablePays" border="0" cellspacing="0" cellpadding="0" class="interfaceMain" style="width:100%;">';
							aHTML[++h] = '<tbody>';
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML[++h] = '<tr class="interfaceMainCaption">' +
												'<td class="interfaceMainRowNothing">No pays.</td></tr>';
								aHTML[++h] = '</tbody></table>';
							}
							else
							{		
								$(oResponse.data.rows).each(function()
								{
									aHTML[++h] = '<tr class="interfaceMainRow">';
									
									aHTML[++h] = '<td id="interfaceFinancialPay_Name-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect pay"' +
															' data-employeeText="' + this["payrecord.employee.contactpersontext"] + '">' +
															this["payrecord.employee.contactpersontext"] + '</td>';
														
									aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
									aHTML[++h] = '<span id="spanFinancialPay_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
									aHTML[++h] = '</td>';					
																												
									aHTML[++h] = '</tr>'
								});
							
								aHTML[++h] = '</tbody></table>';
							}
						
							$('#tdInterfaceMainFinancialPayrollColumnList').html(aHTML.join(''));

							if (ns1blankspace.objectContextData.status == "1")
							{
								$('.interfaceMainRowOptionsRemove').button(
								{
									text: false,
								 	icons: {primary: "ui-icon-close"}
								})
								.click(function() {
									$.extend(true, oParam, {step: 5, xhtmlElementID: event.target.id});
									///interfaceSetupFinancialPayrollPays(this.id)
								})
								.css('width', '15px')
								.css('height', '20px')
							}

							$('td.pay').click(function()
							{
								$('#tablePays td.Highlight').removeClass('Highlight');
								$('#' + event.target.id).addClass('Highlight');
								var aXHTMLElementID = (event.target.id).split('-');
								var sData = $('#' + event.target.id).attr('data-employeeText');
								$.extend(true, oParam, {step: 2, pay: aXHTMLElementID[1], employeeText: sData});
								interfaceFinancialPayrollPays(oParam);
							})
						}
					}

					//PAY RECORD DETAILS
					else if (iStep == 2)
					{	
						if (oResponse == undefined)
						{
							var aHTML = [];
							var h = -1;

							aHTML[++h] = '<table class="interfaceMain">' +
										'<tr class="interfaceMainRow1">' +
										'<td id="tdInterfaceMainFinancialPayrollColumnPay" style="width:200px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn2x">' +
										ns1blankspace.xhtml.loadingSmall + '</td>' +
										'<td id="tdInterfaceMainFinancialPayrollColumnItem" style="width:200px;padding-right:15px;font-size:0.75em;" class="interfaceMainColumn2">' +
										'</td>' +
										'<td id="tdInterfaceMainFinancialPayrollColumnAction" class="interfaceMainColumn2">' +
										'</td>' +
										'</tr>' +
										'</table>';	

							$('#tdInterfaceMainFinancialPayrollColumnListAction').html(aHTML.join(''));
							
							var aHTML = [];
							var h = -1;
						
							if (ns1blankspace.objectContextData.status == "2") 
							{
								aHTML[++h] = '<div id="divInterfaceMainFinancialPayrollColumnItemType" style="width: 200px;margin-bottom:3px;">';
								aHTML[++h] = '<input style="width: 95px;" type="radio" id="interfaceMainFinancialPayrollColumnItemType-3" name="radioType" checked="checked" /><label for="interfaceMainFinancialPayrollColumnItemType-3" style="width: 95px;">Time</label>';
								aHTML[++h] = '<input style="width: 95px;"  type="radio" id="interfaceMainFinancialPayrollColumnItemType-5" name="radioType" /><label for="interfaceMainFinancialPayrollColumnItemType-5" style="width: 95px;">Expenses</label>';
								aHTML[++h] = '</div>';
							}

							aHTML[++h] = '<div id="divInterfaceMainFinancialPayrollColumnItem" style="width: 200px;margin-bottom:3px;"></div>';

							$('#tdInterfaceMainFinancialPayrollColumnItem').html(aHTML.join(''));

							$('#divInterfaceMainFinancialPayrollColumnItemType').buttonset().css('font-size', '0.75em');

							$('#divInterfaceMainFinancialPayrollColumnItemType :radio').click(function()
							{
								var aID = (event.target.id).split('-');
								$.extend(true, oParam, {step: aID[1]});
								interfaceFinancialPayrollPays(oParam);
							});

							var aHTML = [];
							var h = -1;	
							
							aHTML[++h] = '<table id="tableInterfaceMainFinancialPayrollColumnAction" class="interfaceMainColumn2">';

							if (ns1blankspace.objectContextData.status == "1")
							{
								aHTML[++h] = '<tr><td id="tdInterfaceMainFinancialPayrollAdd" class="interfaceMainAction">' +
											'<span id="spanInterfaceMainFinancialPayrollAdd">Add</span>' +
											'</td></tr>';
							}
							else
							{
								aHTML[++h] = '<tr class="interfaceMainCaption">' +
												'<td class="interfaceMainRowNothing">This pay has been completed.</td></tr>';
							}				
															
							aHTML[++h] = '</table>';					
							
							$('#tdInterfaceMainFinancialPayrollColumnAction').html(aHTML.join(''));
						
							$('#spanInterfaceMainFinancialPayrollAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								$.extend(true, oParam, {step: 4, xhtmlElementID: ""});
								interfaceFinancialPayrollPays(oParam);
							})

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
							oSearch.addFilter('id', 'EQUAL_TO', iPay)
							oSearch.addField('grosssalary,calculations,netsalary,deductions,superannuation,calculations,taxbeforerebate');
							oSearch.rows = 1;
							oSearch.getResults(function(data) {interfaceFinancialPayrollPays(oParam, data)})	
						}
						else
						{

							ns1blankspace.objectContextData.pay = oResponse.data.rows[0];

							$.extend(true, oParam, {step: 3});
							interfaceFinancialPayrollPays(oParam);

							var aHTML = [];
							var h = -1;
					
							aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" class="interfaceMain" style="padding-right:10px;">';
							aHTML[++h] = '<tbody>';
						
							if (oResponse.data.rows.length != 0)
							{
								var oRow = oResponse.data.rows[0];

								aHTML[++h] = '<tr><td class="interfaceMainRow interfaceMainCaption">Gross</td>' +
												'<td class="interfaceMainRow" style="text-align:right;">' +
												oRow["grosssalary"] +
												'</td></tr>';

								aHTML[++h] = '<tr><td class="interfaceMainRow interfaceMainCaption">Tax</td>' +
												'<td class="interfaceMainRow" style="text-align:right;">' +
												oRow["taxbeforerebate"] +
												'</td></tr>';

								aHTML[++h] = '<tr><td class="interfaceMainRow interfaceMainCaption">Superannuation</td>' +
												'<td class="interfaceMainRow" style="text-align:right;">' +
												oRow["superannuation"] +
												'</td></tr>';

								aHTML[++h] = '<tr><td class="interfaceMainRow interfaceMainCaption">Net</td>' +
												'<td class="interfaceMainRow" style="text-align:right;">' +
												oRow["netsalary"] +
												'</td></tr>';
												
								aHTML[++h] = '<tr><td class="interfaceMainRow interfaceMainCaption">Deductions</td>' +
												'<td class="interfaceMainRow" style="text-align:right;">' +
												oRow["deductions"] +
												'</td></tr>';								

								aHTML[++h] = '<tr><td colspan=2 class="interfaceMainCaption">Calculations</td></tr>' +
												'<tr><td style="padding-left:3px;" colspan=2 class="interfaceMainRowNothing">' +
												(oRow["calculations"]).replace(/\r\n/g, "<br />") +
												'</td></tr>';							
							}
								
							aHTML[++h] = '</tbody></table>';
						
							$('#tdInterfaceMainFinancialPayrollColumnPay').html(aHTML.join(''));
						}
					}

					//TIME
					else if (iStep == 3)
					{	
						if (oResponse == undefined)
						{
							$('#divInterfaceMainFinancialPayrollColumnItem').html(ns1blankspace.xhtml.loadingSmall);
							
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';
							oSearch.addField('type,typetext,hours');
							oSearch.addFilter('id', 'EQUAL_TO', iPay);
							oSearch.rows = 100;
							oSearch.getResults(function(data) {interfaceFinancialPayrollPays(oParam, data)})	
						}
						else
						{
							var aHTML = [];
							var h = -1;
					
							aHTML[++h] = '<table id="tableSetupFinancialFinancialAccount" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
							aHTML[++h] = '<tbody>';
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML[++h] = '<tr class="interfaceMainCaption">' +
												'<td class="interfaceMainRowNothing">No times.</td></tr>';
								aHTML[++h] = '</tbody></table>';
							}
							else
							{		
								aHTML[++h] = '<tr class="interfaceMainCaption">';
								aHTML[++h] = '<td class="interfaceMainCaption">Type</td>';
								aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Hours</td>';
								aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
								aHTML[++h] = '</tr>';
								
								$(oResponse.data.rows).each(function()
								{
									aHTML[++h] = '<tr class="interfaceMainRow">';
										
									aHTML[++h] = '<td id="interfaceFinancialPayPeriodItem_Type-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect payitem">' +
															this["typetext"] + '</td>';

									var cHours = parseFloat(this["hours"]);
									aHTML[++h] = '<td id="interfaceFinancialPayPeriodItem_Hours-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect payitem" style="text-align:right;">' +
															 cHours.toFixed(2) + '</td>';						
													
									aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
									aHTML[++h] = '<span id="spanFinancialPay_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
									aHTML[++h] = '</td>';					
																												
									aHTML[++h] = '</tr>'
								});	
							}
								
							aHTML[++h] = '</tbody></table>';
						
							$('#divInterfaceMainFinancialPayrollColumnItem').html(aHTML.join(''));

							if (ns1blankspace.objectContextData.status == "1")
							{
								$('.interfaceMainRowOptionsRemove').button(
								{
									text: false,
								 	icons: {primary: "ui-icon-close"}
								})
								.click(function() {
									$.extend(true, oParam, {step: 5, xhtmlElementID: event.target.id});
									///interfaceSetupFinancialPayrollPays(this.id)
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
						var h = -1;

						aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain" style="width:200px;">';
									
						aHTML[++h] = '<tr><td class="interfaceMain">Hours</td></tr>' +
										'<tr><td>' +
										'<input id="inputInterfaceMainPayrollItemHours" class="inputInterfaceMainText">' +
										'</td></tr>';
						
						aHTML[++h] = '<tr><td id="tdInterfaceMainAccountPostable" class="interfaceMain">' +
											'Type' +
											'</td></tr>' +
											'<tr><td class="interfaceMainRadio">' +
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
										'</td></tr>';

						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainFinancialPayrollColumnItem').html(aHTML.join(''));
						
						$('#inputInterfaceMainPayrollItemHours').focus();

						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em">';
								
						aHTML[++h] = '<tr id="trInterfaceMainAccountAddSave" class="interfaceMainAction">' +
										'<td id="tdInterfaceMainAccountAddSave" class="interfaceMainAction">' +
										'<span style="width:70px;" id="spanInterfaceMainAccountEditSave">Save</span>' +
										'</td></tr>';
										
						aHTML[++h] = '<tr id="trInterfaceMainBankAccountEditCancel" class="interfaceMainAction">' +
											'<td id="tdInterfaceMainBankAccountEditCancel" class="interfaceMainAction">' +
											'<span style="width:70px;" id="spanInterfaceMainAccountEditCancel">Cancel</span>' +
											'</td></tr>';
															
						aHTML[++h] = '</table>';					
							
						$('#tdInterfaceMainFinancialPayrollColumnAction').html(aHTML.join(''));
						
						$('#spanInterfaceMainAccountEditSave').button(
						{
							text: "Save"
						})
						.click(function() 
						{
							ns1blankspaceStatusWorking();

							var sData = 'type=' + iType;
							sData += '&id=' + ns1blankspace.util.fs(sID);
							sData += '&title=' + ns1blankspace.util.fs($('#inputInterfaceMainAccountAddTitle').val());
							sData += '&parentaccount=' + ns1blankspace.util.fs($('#inputInterfaceMainAccountParentAccount').attr("data-id"));
							sData += '&postable=' + ns1blankspace.util.fs($('input[name="radioPostable"]:checked').val());

							var oAdd =
									{
										"items": [], 
										"title": $('#inputInterfaceMainAccountAddTitle').val(),
										"parentaccount": $('#inputInterfaceMainAccountParentAccount').attr("data-id"),
										"postable": $('input[name="radioPostable"]:checked').val()
									}

							$.ajax(
							{
								type: 'POST',
								url: '/ondemand/setup/setup.asp?method=SETUP_FINANCIAL_ACCOUNT_MANAGE',
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
										interfaceFinancialPayrollPays(oParam)
									}
									else
									{
										ns1blankspaceError(data.error.errornotes);
									}
								}
							});
						});

						$('#spanInterfaceMainAccountEditCancel').button(
						{
							text: "Cancel"
						})
						.click(function() 
						{
							$.extend(true, oParam, {step: 2});
							interfaceSetupFinancialAccount(oParam);
						});

						if (sID != undefined)
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
							oSearch.addField('title,description,parentaccount,parentaccounttext,postable');
							oSearch.addFilter('id', 'EQUAL_TO', sID);
							oSearch.getResults(function(data) {
									$.extend(true, oParam, {step: 5});
									interfaceSetupFinancialAccount(oParam, data)
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
							$('#divInterfaceMainFinancialPayrollColumnItem').html(ns1blankspace.xhtml.loadingSmall);
							
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
							oSearch.addField('description,amount');
							oSearch.addFilter('object', 'EQUAL_TO', '37');
							oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContextData.id);
							oSearch.addFilter('contactpersonpaidto', 'EQUAL_TO', ns1blankspace.objectContextData.pay["contactperson"]);
							oSearch.getResults(function(data) {interfaceFinancialPayrollPays(oParam, data)})	
						}
						else
						{
							var aHTML = [];
							var h = -1;
					
							aHTML[++h] = '<table id="tableSetupFinancialFinancialAccount" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
							aHTML[++h] = '<tbody>';
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML[++h] = '<tr class="interfaceMainCaption">' +
												'<td class="ingterfaceMainRowNothing">No expenses.</td></tr>';
								aHTML[++h] = '</tbody></table>';
							}
							else
							{		
								aHTML[++h] = '<tr class="interfaceMainCaption">';
								aHTML[++h] = '<td class="interfaceMainCaption">Description</td>';
								aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Amount</td>';
								aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
								aHTML[++h] = '</tr>';
								
								$(oResponse.data.rows).each(function()
								{
									aHTML[++h] = '<tr class="interfaceMainRow">';
										
									aHTML[++h] = '<td id="interfaceFinancialPayPeriodExpenseItem_Description-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect expenseitem">' +
															this["description"] + '</td>';

									aHTML[++h] = '<td id="interfaceFinancialPayPeriodExpenseItem_Amount-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect expenseitem" style="text-align:right;">' +
															 parseFloat(this["amount"]).toFixed(2) + '</td>';						
													
									aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
									aHTML[++h] = '<span id="spanFinancialPayExpenseItem_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
									aHTML[++h] = '</td>';					
																												
									aHTML[++h] = '</tr>'
								});	
							}
								
							aHTML[++h] = '</tbody></table>';
						
							$('#divInterfaceMainFinancialPayrollColumnItem').html(aHTML.join(''));

							if (ns1blankspace.objectContextData.status == "1")
							{
								$('.interfaceMainRowOptionsRemove').button(
								{
									text: false,
								 	icons: {primary: "ui-icon-close"}
								})
								.click(function() {
									$.extend(true, oParam, {step: 5, xhtmlElementID: event.target.id});
									///interfaceSetupFinancialPayrollPays(this.id)
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
							$('#inputInterfaceMainAccountAddTitle').val((oObjectContext.title).formatXHTML());
							$('#inputInterfaceMainAccountParentAccount').val(($.grep(ns1blankspace.financial.accounts, function (a) { return a.id == oObjectContext.parentaccount; })[0].title).formatXHTML());
							$('#inputInterfaceMainAccountParentAccount').attr('data-id', oObjectContext.parentaccount);
							$('[name="radioPostable"][value="' + oObjectContext.postable + '"]').attr('checked', true);
						}
					}	
				}
}
