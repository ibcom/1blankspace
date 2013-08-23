/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.financial.payroll = 
{
	data: 		{context: 'pays'},

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
					ns1blankspace.objectMethod = 'FINANCIAL_PAYROLL_PAY_PERIOD';

					if (!bInitialised)
					{
						ns1blankspace.financial.initData(oParam)
					}
					else
					{		
						ns1blankspace.app.set(oParam);
					}

					$('#ns1blankspaceViewControlNew').unbind('click');

					$('#ns1blankspaceViewControlNew').click(function(event)
					{
						ns1blankspace.financial.payroll.home({new: true});
					});
				},

	home:		function (oParam, oResponse)
				{		
					var bNew = ns1blankspace.util.getParam(oParam, 'new', {default: false}).value;

					if (oResponse == undefined)
					{
						var aHTML = [];
									
						aHTML.push('<table>');

						aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
							
						aHTML.push('<tr><td id="ns1blankspaceControl-pays" class="ns1blankspaceControl" style="padding-top:12px;">' +
										'Pay Runs</td></tr>');			
								
						aHTML.push('<tr><td id="ns1blankspaceControl-employees" class="ns1blankspaceControl">' +
										'Employees</td></tr>');	
									
						aHTML.push('</table>');	

						aHTML.push('<table class="ns1blankspaceControl">');
						
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControl-totals" class="ns1blankspaceControl">Totals' +
									'<br /><div class="ns1blankspaceSubNote">& summaries</div></td>' +
									'</tr>');
																		
						aHTML.push('</table>');
						
						$('#ns1blankspaceControl').html(aHTML.join(''));
	
						$('#ns1blankspaceControl-pays').click(function(event)
						{
							$('#ns1blankspaceViewControlNew').button({disabled: false});
							ns1blankspace.show({selector: '#ns1blankspaceMainPayRun', refresh: true});
							ns1blankspace.financial.payroll.home();
						});
					
						$('#ns1blankspaceControl-employees').click(function(event)
						{
							$('#ns1blankspaceViewControlNew').button({disabled: false});
							ns1blankspace.show({selector: '#ns1blankspaceMainEmployee', refresh: true});
							ns1blankspace.financial.payroll.employees.show();
						});

						$('#ns1blankspaceControl-totals').click(function(event)
						{
							$('#ns1blankspaceViewControlNew').button({disabled: true});
							ns1blankspace.show({selector: '#ns1blankspaceMainTotals'});
							ns1blankspace.financial.payroll.totals.show();
						});
						
						var aHTML = [];
						
						aHTML.push('<div id="ns1blankspaceMainPayRun" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainEmployee" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainTotals" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainNew" class="ns1blankspaceControlMain"></div>');

						$('#ns1blankspaceMain').html(aHTML.join(''));
					
						if (bNew)
						{
							ns1blankspace.financial.payroll.new.show();
						}	
						else
						{
							ns1blankspace.financial.payroll.data.context = 'pays';

							$('#ns1blankspaceMainPayRun').html(ns1blankspace.xhtml.loading);

							$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
							
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
							oSearch.addField('startdate,paydate,statustext');
							oSearch.rows = 10;
							oSearch.sort('paydate', 'desc');
							oSearch.getResults(function(data){ns1blankspace.financial.payroll.home(oParam, data)});
						}

						$('#ns1blankspaceControl-' + ns1blankspace.financial.payroll.data.context).addClass('ns1blankspaceHighlight');
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

						$('.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.financial.payroll.search.send(this.id, {source: 1});
						});
					}	
				},

	search: 	{
					send:		function (sXHTMLElementId, oParam)
								{
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									var iMinimumLength = 0;
									var iSource = ns1blankspace.data.searchSource.text;
									var sSearchText;
									var iMaximumColumns = 1;
									
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
											sSearchText = $('#ns1blankspaceViewControlSearch').val();
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
											ns1blankspace.search.start();
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
											oSearch.addField('notes,paydate');
											oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);

											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.sort('paydate', 'DESC');
											
											oSearch.getResults(function(data) {ns1blankspace.financial.payroll.search.process(oParam, data)});	
										}
									};	
								},	

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var	iMaximumColumns = 1;
										
									ns1blankspace.search.stop();
										
									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
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
															'-' + this.id + '">' +
															this.paydate +
															'</td>');
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.searchContainer).html(
											ns1blankspace.render.init(
											{
												html: aHTML.join(''),
												more: (oResponse.morerows == "true"),
												header: false
											}) 
										);		
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
											$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.financial.payroll.search.send(this.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'notes',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.financial.payroll.search.send
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

					

					if (ns1blankspace.objectContext != -1)
					{
						if (ns1blankspace.objectContextData.status == 2)
						{
							aHTML.push('<tr><td id="ns1blankspaceControlExpenses" class="ns1blankspaceControl">' +
										'Expenses</td></tr>' +
										'</table>');

							aHTML.push('<table class="ns1blankspaceControl">' +
										'<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlTotals" class="ns1blankspaceControl">Totals' +
										'<br /><div class="ns1blankspaceSubNote">& pay slips</div></td>' +
										'</tr>');
						}
					}

					aHTML.push('</table>');

					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPays" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainExpenses" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPayTotals" class="ns1blankspaceControlMain"></div>');
					
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

					$('#ns1blankspaceControlTotals').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPayTotals'});
						ns1blankspace.financial.payroll.pays.totals.show();
					});

					$('#ns1blankspaceControlExpenses').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainExpenses'});
						ns1blankspace.financial.payroll.expenses.show();
					});
				},

	show: 		function (oParam, oResponse)
				{	
					ns1blankspace.app.clean();
						
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this pay run.</td></tr></table>');
								
						$('#ns1blankspaceControl').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						ns1blankspace.financial.payroll.layout();

						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.startdate +
							'<br />to ' + ns1blankspace.objectContextData.paydate +
							'<br /><span id="ns1blankspaceSub_frequency" class="ns1blankspaceSub">' + (ns1blankspace.objectContextData.frequencytext).toLowerCase() + ' pay</span>');
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.financial.payroll.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
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
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:270px;"></td>' +
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
							ns1blankspace.financial.payroll.complete({step: 1});
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
										ns1blankspace.status.working();
										
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
							
									ns1blankspace.show({selector: '#ns1blankspaceMainNew'});

									aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceNewColumn1" class="ns1blankspaceColumn1" style="width:50%"></td>' +
													'<td id="ns1blankspaceNewColumn2" class="ns1blankspaceColumn2" style="font-size:0.75em"></td>' +
													'</tr>' + 
													'</table>');		

									$('#ns1blankspaceMainNew').html(aHTML.join(''));

									var aHTML = [];

									aHTML.push('<table class="ns1blankspaceColumn2" style="font-size:0.875em">' +
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
										ns1blankspace.financial.payroll.new.save();
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

									if (ns1blankspace.financial.payroll.data.context == 'pays')
									{
										aHTML.push('<table><tr>' + 
														'<td class="ns1blankspaceNothing">Click <b>Next</b> to create the pay period.</td>' + 
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

									$('#ns1blankspaceNewColumn2').html(ns1blankspace.xhtml.loading);

									//PAYS
									if (ns1blankspace.financial.payroll.data.context == 'pays')
									{
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_PROCESS'),
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
									if (ns1blankspace.financial.payroll.data.context == 'employees')
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
													oSearch.addFilter('contactbusiness', 'EQUAL_TO', ns1blankspace.user.contactBusiness);
													oSearch.addFilter('firstname', 'EQUAL_TO', $('#ns1blankspaceDetailsFirstName').val());
													oSearch.addFilter('surname', 'EQUAL_TO', $('#ns1blankspaceDetailsLastName').val());

													oSearch.getResults(function(data) {ns1blankspace.financial.payroll.new.save(oParam, data)});
												}
											}
											else	
											{
												if (oResponse.data.rows.length > 0)
												{
													ns1blankspace.financial.payroll.new.process(
													{
														contactPerson: oResponse.data.rows[0].contactperson,
														contactBusiness: ns1blankspace.user.contactBusiness
													});		
												}
												else
												{
													var sData = 'contactbusiness=' + ns1blankspace.util.fs(ns1blankspace.user.contactBusiness);
													sData += '&firstname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFirstName').val());
													sData += '&surname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsLastName').val());

													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('CONTACT_PERSON_MANAGE'),
														data: sData,
														dataType: 'json',
														success: function(data)
														{
															if (data.status == 'OK')
															{
																ns1blankspace.financial.payroll.new.process(
																{
																	contactPerson: data.id,
																	contactBusiness: ns1blankspace.user.contactBusiness
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
									var iContactBusiness = ns1blankspace.user.contactBusiness;
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
										url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data)
										{
											ns1blankspace.status.message('Saved.');
											ns1blankspace.show({selector: '#ns1blankspaceMainEmployee'});
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
									var iFilterEmployee;
									var iID = '';
									var sXHTMLElementID;

									if (oParam != undefined)
									{
										if (oParam.step != undefined) {iStep = oParam.step};
										if (oParam.stepAction != undefined) {iStepAction = oParam.stepAction};
										if (oParam.employee != undefined) {iEmployee = oParam.employee};
										if (oParam.id != undefined) {iID = oParam.id};
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.filterEmployee != undefined) {iFilterEmployee = oParam.filterEmployee};
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
										ns1blankspace.financial.payroll.data.context = 'employees';

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

											if (iFilterEmployee !== undefined)
											{
												oSearch.addFilter('id', 'EQUAL_TO', iFilterEmployee);
											}	

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
											
											$('.employee').click(function()
											{
												$('#ns1blankspacePayrollEmployees td.ns1blankspaceRowShadedHighlight').removeClass('ns1blankspaceRowShadedHighlight');
												$('#' + this.id).addClass('ns1blankspaceRowShadedHighlight');

												var aID = (this.id).split('-');
												$.extend(true, oParam, {step: 2, employee: parseInt(aID[1])});
												ns1blankspace.financial.payroll.employees.show(oParam);
											});

											if (iFilterEmployee !== undefined)
											{
												$('#ns1blankspacePayrollEmployees td.ns1blankspaceRowShadedHighlight').removeClass('ns1blankspaceRowShadedHighlight');
												$('#ns1blankspaceEmployee_contact-' + iFilterEmployee).addClass('ns1blankspaceRowShadedHighlight');
												$.extend(true, oParam, {step: 2});
												ns1blankspace.financial.payroll.employees.show(oParam);
											}	
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
											oSearch.addField('area,areatext,contactbusiness,contactbusinesstext,contactperson,contactpersontext,employeenumber,employmentenddate,employmentstartdate,' +
																'notes,project,projecttext,status,statustext,allowance,allowancedescription,allowanceincludeinsuper,' +
																'allowancetaxable,deducthelp,deduction,deductiondescription,endtime,financialsupplementdebt,' +
																'foreignresident,highestlevel,highestleveltext,leaveloadingrate,medicare,medicaretext,' +
																'payfrequency,payfrequencytext,rebates,specialtaxrate,standardhours,starttime,' +
																'taxadjustment,taxadjustmentdescription,taxfilenumber,taxfilenumberdeclaration,' +
																'taxfreethreshold,contact1,contact1phone,contact2,contact2phone,emergencynotes,posttaxsuperamount,' +
																'posttaxsupercontactbusiness,posttaxsupercontactbusinesstext,posttaxsuperfundname,posttaxsupermembernumber,' +
																'posttaxsupertype,posttaxsupertypetext,pretaxsuperamount,pretaxsupercontactbusiness,pretaxsupercontactbusinesstext,' +
																'pretaxsuperfundname,pretaxsupermembernumber,pretaxsupertype,pretaxsupertypetext,' +
																'supercontactbusiness,supercontactbusinesstext,superannuationrate,superfundname,supermembernumber,' +
																'annualleaveentitlement,longserviceentitlement,sickleaveentitlement,' +
																'internalrelationships,jobdetails,kpi,responsibilities,tasks,copyreceived,expirydate,' +
																'inductionprogram,medicalreport,medicalreportdate,programdate,registrationnumber,workerscompform,workhoursform');
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
												$('#ns1blankspacePayrollEmployeeDetails td.ns1blankspaceRowShadedHighlight').removeClass('ns1blankspaceRowShadedHighlight');
												$('#' + this.id).addClass('ns1blankspaceRowShadedHighlight');

												var aID = (this.id).split('-');
												$.extend(true, oParam, {step: parseInt(aID[1]), stepAction: 1});
												ns1blankspace.financial.payroll.employees.show(oParam);
											});

											$('#ns1blankspaceFinancialEmployee_details-11').addClass('ns1blankspaceRowShadedHighlight');
											$.extend(true, oParam, {step: 11});
											ns1blankspace.financial.payroll.employees.show(oParam);
										}
									}
									
									if (iStep == 11)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
																'<tr class="ns1blankspaceContainer">' +
																'<td id="ns1blankspacePayrollEmployeeDetails11Column1" style="font-size:0.875em;">' +
																ns1blankspace.xhtml.loading + '</td>' +
																'<td id="ns1blankspacePayrollEmployeeDetails11Column2" style="width:75px;">' +
																'</td>' +
																'</tr>' + 
																'</table>');				
											
										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

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
											
										$('#ns1blankspacePayrollEmployeeDetails11Column1').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('[name="radioStatus"][value="' + ns1blankspace.financial.employee["status"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsNotes').val(ns1blankspace.financial.employee["notes"]);
										}
										else
										{
											$('[name="radioStatus"][value="1"]').attr('checked', true);
										}

										var aHTML = [];
						
										aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>' +
														'<span id="ns1blankspacePayrollEmployee_options_save" class="ns1blankspaceAction">' +
														'Save</span></td></tr></table>');					
										
										$('#ns1blankspacePayrollEmployeeDetails11Column2').html(aHTML.join(''));

										$('#ns1blankspacePayrollEmployee_options_save').button(
										{
											text: "Save"
										})
										.click(function()
										{
											ns1blankspace.status.working();

											var sData = 'id=' + ns1blankspace.util.fs(iEmployee);
											sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
											sData += '&notes=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsNotes').val());

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														ns1blankspace.status.message('Saved');
														ns1blankspace.financial.payroll.employees.show();
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});	

										})
										.css('font-size', '0.75em');
									}
									
									if (iStep == 12)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
																'<tr class="ns1blankspaceContainer">' +
																'<td id="ns1blankspacePayrollEmployeeDetails12Column1" style="font-size:0.875em;">' +
																ns1blankspace.xhtml.loading + '</td>' +
																'<td id="ns1blankspacePayrollEmployeeDetails12Column2" style="width:75px;">' +
																'</td>' +
																'</tr>' + 
																'</table>');				
											
										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

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
														'<input id="ns1blankspaceDetailsAllowanceDescription" class="ns1blankspaceText">' +
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

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Tax Threshold' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioTaxFreeThresholdY" name="radioTaxFreeThreshold" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioTaxFreeThresholdN" name="radioTaxFreeThreshold" value="N"/>No' +
														'</td></tr>');

										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetails12Column1').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('[name="radioMedicare"][value="' + ns1blankspace.financial.employee["medicare"] + '"]').attr('checked', true);
											$('[name="radioFrequency"][value="' + ns1blankspace.financial.employee["payfrequency"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsAllowance').val(ns1blankspace.financial.employee["allowance"]);
											$('#ns1blankspaceDetailsAllowanceDescription').val(ns1blankspace.financial.employee["allowancedescription"]);
											$('#ns1blankspaceDetailsDeduction').val(ns1blankspace.financial.employee["deduction"]);
											$('#ns1blankspaceDetailsDeductionDescription').val(ns1blankspace.financial.employee["deductiondescription"]);
											$('#ns1blankspaceDetailsTaxNumber').val(ns1blankspace.financial.employee["taxfilenumber"]);
											$('[name="radioTaxFreeThreshold"][value="' + ns1blankspace.financial.employee["taxfreethreshold"] + '"]').attr('checked', true);
										}
										else
										{
											$('[name="radioFrequency"][value="1"]').attr('checked', true);
											$('[name="radioMedicare"][value="1"]').attr('checked', true);
											$('[name="radioTaxFreeThreshold"][value="N"]').attr('checked', true);
										}

										var aHTML = [];
						
										aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>' +
														'<span id="ns1blankspacePayrollEmployee_options_save" class="ns1blankspaceAction">' +
														'Save</span></td></tr></table>');					
										
										$('#ns1blankspacePayrollEmployeeDetails12Column2').html(aHTML.join(''));

										$('#ns1blankspacePayrollEmployee_options_save').button(
										{
											text: "Save"
										})
										.click(function()
										{
											ns1blankspace.status.working();

											var sData = 'id=' + ns1blankspace.util.fs(iEmployee);
											sData += '&payfrequency=' + ns1blankspace.util.fs($('input[name="radioFrequency"]:checked').val());
											sData += '&medicare=' + ns1blankspace.util.fs($('input[name="radioMedicare"]:checked').val());
											sData += '&allowance=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsAllowance').val());
											sData += '&allowancedescription=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsAllowanceDescription').val());
											sData += '&deduction=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDeduction').val());
											sData += '&deductiondescription=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDeductionDescription').val());
											sData += '&taxfilenumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTaxNumber').val());
											sData += '&taxfreethreshold=' + ns1blankspace.util.fs($('input[name="radioTaxFreeThreshold"]:checked').val());

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														ns1blankspace.status.message('Saved');
														ns1blankspace.financial.payroll.employees.show();
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});	

										})
										.css('font-size', '0.75em');
									}

									//SUPERANNUATION
									if (iStep == 15)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
																'<tr class="ns1blankspaceContainer">' +
																'<td id="ns1blankspacePayrollEmployeeDetails15Column1" style="font-size:0.875em;">' +
																ns1blankspace.xhtml.loading + '</td>' +
																'<td id="ns1blankspacePayrollEmployeeDetails15Column2" style="width:75px;">' +
																'</td>' +
																'</tr>' + 
																'</table>');				
											
										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

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
											
										$('#ns1blankspacePayrollEmployeeDetails15Column1').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('[name="radioSuperContributionType"][value="' + ns1blankspace.financial.employee["pretaxsupertype"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsFundName').val(ns1blankspace.financial.employee["superfundname"]);
											$('#ns1blankspaceDetailsFundMemberNumber').val(ns1blankspace.financial.employee["supermembernumber"]);
											$('#ns1blankspaceDetailsEmployerSuperannuationRate').val(ns1blankspace.financial.employee["superannuationrate"]);
										}
										else
										{
											$('[name="radioEmployerType"][value="1"]').attr('checked', true);
										}

										var aHTML = [];
						
										aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>' +
														'<span id="ns1blankspacePayrollEmployee_options_save" class="ns1blankspaceAction">' +
														'Save</span></td></tr></table>');					
										
										$('#ns1blankspacePayrollEmployeeDetails15Column2').html(aHTML.join(''));

										$('#ns1blankspacePayrollEmployee_options_save').button(
										{
											text: "Save"
										})
										.click(function()
										{
											ns1blankspace.status.working();

											var sData = 'id=' + ns1blankspace.util.fs(iEmployee);
											sData += '&pretaxsupertype=' + ns1blankspace.util.fs($('input[name="radioSuperContributionType"]:checked').val());									
											sData += '&superfundname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFundName').val());
											sData += '&supermembernumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFundMemberNumber').val());
											sData += '&superannuationrate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEmployerSuperannuationRate').val());
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														ns1blankspace.status.message('Superannuation saved');
														ns1blankspace.financial.payroll.employees.show();
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});	

										})
										.css('font-size', '0.75em');
									}	

									//ROLE
									if (iStep == 16)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspacePayrollEmployeeDetails16Column1" style="font-size:0.875em;">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspacePayrollEmployeeDetails16Column2" style="width:75px;">' +
														'</td>' +
														'</tr>' + 
														'</table>');	

										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

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
											
										$('#ns1blankspacePayrollEmployeeDetails16Column1').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#ns1blankspaceDetailsJobDescription').val(ns1blankspace.financial.employee["jobdetails"]);
											$('#ns1blankspaceDetailsInternalRelationships').val(ns1blankspace.financial.employee["internalrelationships"]);
											$('#ns1blankspaceDetailsKPI').val(ns1blankspace.financial.employee["kpi"]);
											$('#ns1blankspaceDetailsResponsibilities').val(ns1blankspace.financial.employee["responsibilities"]);
											$('#ns1blankspaceDetailsTasks').val(ns1blankspace.financial.employee["tasks"]);
										}

										var aHTML = [];
						
										aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>' +
														'<span id="ns1blankspacePayrollEmployee_options_save" class="ns1blankspaceAction">' +
														'Save</span></td></tr></table>');					
										
										$('#ns1blankspacePayrollEmployeeDetails16Column2').html(aHTML.join(''));

										$('#ns1blankspacePayrollEmployee_options_save').button(
										{
											text: "Save"
										})
										.click(function()
										{
											ns1blankspace.status.working();

											var sData = 'id=' + ns1blankspace.util.fs(iEmployee);							
											sData += '&jobdetails=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsJobDescription').val());
											sData += '&internalrelationships=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsInternalRelationships').val());
											sData += '&kpi=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsKPI').val());
											sData += '&responsibilities=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsResponsibilities').val());
											sData += '&tasks=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTasks').val());
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														ns1blankspace.status.message('Role saved');
														ns1blankspace.financial.payroll.employees.show();
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});	

										})
										.css('font-size', '0.75em');
									}	

									//INDUCTION
									if (iStep == 17)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspacePayrollEmployeeDetails17Column1" style="font-size:0.875em;">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspacePayrollEmployeeDetails17Column2" style="width:75px;">' +
														'</td>' +
														'</tr>' + 
														'</table>');	

										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Induction Date' +
														'</td></tr>' +
														'<tr><td class="ns1blankspace">' +
														'<tr><td class="ns1blankspaceDate">' +
														'<input id="ns1blankspaceDetailsInductionDate" class="ns1blankspaceDate">' +
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
											
										$('#ns1blankspacePayrollEmployeeDetails17Column1').html(aHTML.join(''));

										$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#ns1blankspaceDetailsInductionDate').val(ns1blankspace.financial.employee["programdate"]);
											$('[name="radioWorkersCompensation"][value="' + ns1blankspace.financial.employee["workerscompform"] + '"]').attr('checked', true);
										}
										else
										{
											$('[name="radioWorkersCompensation"][value="N"]').attr('checked', true);
										}

										var aHTML = [];
						
										aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>' +
														'<span id="ns1blankspacePayrollEmployee_options_save" class="ns1blankspaceAction">' +
														'Save</span></td></tr></table>');					
										
										$('#ns1blankspacePayrollEmployeeDetails17Column2').html(aHTML.join(''));

										$('#ns1blankspacePayrollEmployee_options_save').button(
										{
											text: "Save"
										})
										.click(function()
										{
											ns1blankspace.status.working();

											var sData = 'id=' + ns1blankspace.util.fs(iEmployee);							
											sData += '&workerscompform=' + ns1blankspace.util.fs($('input[name="radioWorkersCompensation"]:checked').val());	
											sData += '&programdate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsInductionDate').val());
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														ns1blankspace.status.message('Induction saved');
														ns1blankspace.financial.payroll.employees.show();
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});	

										})
										.css('font-size', '0.75em');
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

												if (iStepAction == 1)
												{
													var aHTML = [];
						
													aHTML.push('<table class="ns1blankspaceColumn2">' +
																	'<tr><td><span id="ns1blankspacePayrollEmployee_options_add" class="ns1blankspaceAction">' +
																	'Add</span></td></tr></table>');					
													
													$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn2').html(aHTML.join(''));

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
																		'<tr><td class="ns1blankspaceNothing">No pays rates.</td></tr>' +
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

													$('.ns1blankspacePayrollEmployeeDetailsPayRate').click(function()
													{
														$.extend(true, oParam, {stepAction: 2, xhtmlElementID:this.id});
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

													aHTML.push('<tr><td class="ns1blankspaceCaption">Rate / Hour ($)</td></tr>' +
																	'<tr><td>' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateAmount" class="ns1blankspaceText">' +
																	'</td></tr>');				

													aHTML.push('</table>');

													$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));

													$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

													$('#ns1blankspacePayrollEmployeeDetailsPayRateStartDate').val(Date.today().toString("dd MMM yyyy"));

													var aHTML = [];
												
													aHTML.push('<table class="ns1blankspaceColumn2" style="font-size:0.875em">' +
																	'<tr><td>' +
																	'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsPayRate_options_save" class="ns1blankspaceAction">Save</span>' +
																	'</td></tr>' +
																	'<tr><td>' +
																	'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsPayRate_options_cancel" class="ns1blankspaceAction">Cancel</span>' +
																	'</td></tr>' +
																	'</table>');

													aHTML.push('<table class="ns1blankspaceColumn2" style="font-size:0.75em; background-color:#F3F3F3; margin-top:15px; border:0px; padding-left:5px;">' +
																	'<tr><td class="ns1blankspaceSub" style="padding-top:8px;">' +
																	'Annual Wage' +
																	'</td></tr>' +
																	'<tr><td style="padding-right:13px;">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateAnnualAmount" class="ns1blankspaceText">' +
																	'</td></tr>' +
																	'<tr><td class="ns1blankspaceSub" style="padding-top:5px;">' +
																	'Hours per week' +
																	'</td></tr>' +
																	'<tr><td style="padding-right:13px;">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateHoursPerWeek" class="ns1blankspaceText">' +
																	'</td></tr>' +
																	'</table>');			

													$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn2').html(aHTML.join(''));

													$('#ns1blankspacePayrollEmployeeDetailsPayRateAnnualAmount, #ns1blankspacePayrollEmployeeDetailsPayRateHoursPerWeek').keyup(function ()
													{
														var cAnnual = $('#ns1blankspacePayrollEmployeeDetailsPayRateAnnualAmount').val();
														var cHoursWeek = $('#ns1blankspacePayrollEmployeeDetailsPayRateHoursPerWeek').val();

														if (cHoursWeek == '') {cHoursWeek = 0}

														if (cHoursWeek != 0)
														{
															$('#ns1blankspacePayrollEmployeeDetailsPayRateAmount').val(ns1blankspace.util.toFixed(cAnnual / (52 * cHoursWeek)))
														}	
													});

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
														$.extend(true, oParam, {stepAction: 2, xhtmlElementID: this.id});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
												}
												else
												{
													aHTML.push('<table id="ns1blankspacePayrollEmployeeDetailsBankAccountEdit" class="ns1blankspaceColumn2" style="padding-right:15px;">');
										
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
																oRow["employee.contactperson.firstname"] + ' ' + oRow["employee.contactperson.surname"]);

										if (oRow["statustext"] != '')
										{
											aHTML.push('<br /><span class="ns1blankspaceSub">' + oRow["statustext"]);
										}
									
										aHTML.push('</td></tr>');
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
						ns1blankspace.financial.payroll.data.context = 'pays';

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
									$.extend(true, oParam, {step: 11, xhtmlElementID: ''});
									ns1blankspace.financial.payroll.pays(oParam);
								})
							}

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
							oSearch.addField('payrecord.employee.employeenumber,payrecord.employee.contactperson.firstname,payrecord.employee.contactperson.surname');
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
												'</tr></table>');
							}
							else
							{
								aHTML.push('<table id="ns1blankspacePayrollRuns" cellpadding=6>');

								$(oResponse.data.rows).each(function()
								{
									aHTML.push('<tr class="ns1blankspaceRow">');
									
									aHTML.push('<td id="ns1blankspacePayrollPay_name-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
															' data-employeeText="' + this["payrecord.employee.contactpersontext"] + '">' +
															this["payrecord.employee.contactperson.firstname"] + 
															' ' + this["payrecord.employee.contactperson.surname"]);

									if (this["payrecord.employee.employeenumber"] != '...')
									{
										aHTML.push('<br /><span class="ns1blankspaceSub">' + this["payrecord.employee.employeenumber"]);
									}
	
									aHTML.push('</td>');
													
									if (ns1blankspace.objectContextData.status == "1")
									{					
										aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspacePayrollPay_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>' +
													'</td>');
									}								
																												
									aHTML.push('</tr>');
								});
							
								aHTML.push('</table>');
							}
						
							$('#ns1blankspacePayrollPayColumn1').html(aHTML.join(''));
						
							$('#ns1blankspacePayrollRuns .ns1blankspaceRowRemove').button(
							{
								text: false,
							 	icons: {primary: "ui-icon-close"}
							})
							.click(function()
							{
								var aXHTMLElementID = (this.id).split('-');
								$.extend(true, oParam, {step: 12, pay: aXHTMLElementID[1]});
								ns1blankspace.financial.payroll.pays(oParam)
							})
							.css('width', '15px')
							.css('height', '20px')
						
							$('#ns1blankspacePayrollRuns td.ns1blankspaceRowSelect').click(function()
							{
								$('#ns1blankspacePayrollRuns td.ns1blankspaceRowShadedHighlight').removeClass('ns1blankspaceRowShadedHighlight');
								$('#' + this.id).parent().children().addClass('ns1blankspaceRowShadedHighlight');
								var aXHTMLElementID = (this.id).split('-');
								var sData = $('#' + this.id).attr('data-employeeText');
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
											'<td id="ns1blankspacePayrollPayRunColumn2" class="ns1blankspaceColumn2" style="width:200px;padding-right:15px;font-size:0.875em;"></td>' +
											'<td id="ns1blankspacePayrollPayRunColumn3" class="ns1blankspaceColumn2"></td>' +
											'</tr>' + 
											'</table>');	

							$('#ns1blankspacePayrollPayColumn2').html(aHTML.join(''));
							
							var aHTML = [];
							
							aHTML.push('<div id="ns1blankspaceFinancialPayrollColumnItem" style="width: 200px;margin-bottom:3px;"></div>');

							$('#ns1blankspacePayrollPayRunColumn1').html(aHTML.join(''));

							$('#ns1blankspaceFinancialPayrollColumnItemType').buttonset().css('font-size', '0.75em');

							$('#ns1blankspaceFinancialPayrollColumnItemType :radio').click(function()
							{
								var aID = (this.id).split('-');
								$.extend(true, oParam, {step: aID[1]});
								ns1blankspace.financial.payroll.pays(oParam);
							});

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
							oSearch.addFilter('id', 'EQUAL_TO', iPay)
							oSearch.addField('grosssalary,calculations,netsalary,deductions,superannuation,calculations,taxbeforerebate,payrecord.employee.contactperson');
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

								var sCalcs = (oRow["calculations"]!=''?(oRow["calculations"]).replace(/\r\n/g, "<br />"):'None.');

								aHTML.push('<tr><td colspan=2 class="ns1blankspaceCaption">Calculations</td></tr>' +
												'<tr><td style="padding-left:3px;" colspan=2 class="ns1blankspaceNothing">' +
												sCalcs +
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
								aHTML.push('<tr><td id="ns1blankspaceFinancialPayrollExpenses_container">' +
											'<span id="ns1blankspaceFinancialPayrollExpenses" class="ns1blankspaceAction">Expenses</span>' +
											'</td></tr>');
							}				
															
							aHTML.push('</table>');					
							
							$('#ns1blankspacePayrollPayRunColumn3').html(aHTML.join(''));						

							$('#ns1blankspaceFinancialPayrollExpenses').button(
							{
								label: "Show Expenses"
							})
							.click(function()
							{
								$('#ns1blankspacePayrollPayRunColumn3').html(ns1blankspace.xhtml.loadingSmall);
								$.extend(true, oParam, {step: 10, xhtmlElementID: ""});
								ns1blankspace.financial.payroll.pays(oParam);
							}).
							css('width', '90px');

							$('#ns1blankspaceFinancialPayrollAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								$.extend(true, oParam, {step: 4, xhtmlElementID: ""});
								ns1blankspace.financial.payroll.pays(oParam);
							})

							$('#ns1blankspacePayrollPayRunColumn2').html(ns1blankspace.xhtml.loadingSmall);
							
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';
							oSearch.addField('type,typetext,hours');
							oSearch.addFilter('record', 'EQUAL_TO', iPay);
							oSearch.rows = 100;
							oSearch.sort('type', 'asc')
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)})	
						}
						else
						{
							var sClass = (ns1blankspace.objectContextData.status == 2?'':' ns1blankspaceRowSelect');

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
										
									aHTML.push('<td id="ns1blankspaceFinancialPayPeriodItem_type-' + this.id + '" class="ns1blankspaceRow' + sClass + '">' +
															this["typetext"] + '</td>');

									var cHours = parseFloat(this["hours"]);
									aHTML.push('<td id="ns1blankspaceFinancialPayPeriodItem_hours-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
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
								$('#ns1blankspaceFinancialPayrollItem span.ns1blankspaceRowRemove').button(
								{
									text: false,
								 	icons: {primary: "ui-icon-close"}
								})
								.click(function()
								{
									$.extend(true, oParam, {step: 6, xhtmlElementID: this.id});
									ns1blankspace.financial.payroll.pays(oParam)
								})
								.css('width', '15px')
								.css('height', '20px');

								$('#ns1blankspaceFinancialPayrollItem td.ns1blankspaceRowSelect').click(function()
								{
									$.extend(true, oParam, {step: 4, xhtmlElementID: this.id});
									ns1blankspace.financial.payroll.pays(oParam)
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

							var sData = 'record=' + ns1blankspace.util.fs(iPay);
							sData += '&type=' + ns1blankspace.util.fs($('input[name="radioItemType"]:checked').val());
							sData += '&hours=' + ns1blankspace.util.fs($('#ns1blankspacePayrollItemHours').val());
							sData += '&id=' + ns1blankspace.util.fs(sID);

							
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_RECORD_ITEM_MANAGE'),
								data: sData,
								dataType: 'json',
								success: function(data) {
									if (data.status == "OK")
									{
										ns1blankspace.inputDetected = false;
										$.extend(true, oParam, {step: 7});
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
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';
							oSearch.addField('hours,type,typetext');
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

					else if (iStep == 5)
					{
						if (oResponse.data.rows.length != 0)
						{
							var oObjectContext = oResponse.data.rows[0];
							$('#ns1blankspacePayrollItemHours').val(ns1blankspace.util.toFixed(oObjectContext.hours));	
							$('[name="radioItemType"][value="' + oObjectContext.type + '"]').attr('checked', true);
							$('#ns1blankspacePayrollItemHours').focus();
							$('#ns1blankspacePayrollItemHours').select();
						}
					}

					else if (iStep == 6)
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
								
						if (oResponse == undefined)
						{	
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_RECORD_ITEM_MANAGE'),
								data: 'remove=1&id=' + sID,
								dataType: 'json',
								success: function(data)
								{
									$.extend(true, oParam, {step: 7});
									ns1blankspace.financial.payroll.pays(oParam, data);
								}
							});
						}	
						else
						{
							if (oResponse.status == 'OK')
							{
								$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
							}
							else
							{
								ns1blankspace.status.error(oResponse.error.errornotes);
							}
						}	
					}

					else if (iStep == 7)
					{
						var iType = 4;
						var sXHTMLElementID;
	
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_PROCESS'),
							data: 'type=' + iType + '&record=' + iPay,
							dataType: 'json',
							success: function(data)
							{
								ns1blankspace.status.message('Updated');
								$.extend(true, oParam, {step: 2});
								ns1blankspace.financial.payroll.pays(oParam);
							}
						});
					}

					//EXPENSES
					else if (iStep == 10)
					{	
						if (oResponse == undefined)
						{
							$('#ns1blankspaceFinancialPayrollColumnItem').html(ns1blankspace.xhtml.loadingSmall);
							
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
							oSearch.addField('description,amount');
							oSearch.addFilter('object', 'EQUAL_TO', '37');
							oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContextData.id);
							oSearch.addFilter('contactpersonpaidto', 'EQUAL_TO', ns1blankspace.objectContextData.pay["payrecord.employee.contactperson"]);
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)})	
						}
						else
						{
							var aHTML = [];
					
							aHTML.push('<table id="ns1blankspaceFinancialPayrollExpenses" class="ns1blankspaceColumn2" style="font-size:0.875em;">');
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<tr class="ns1blankspaceCaption">' +
												'<td class="ns1blankspaceSub">No expenses</td></tr>');
								aHTML.push('</table>');
							}
							else
							{		
								aHTML.push('<tr class="ns1blankspaceCaption">');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Expenses</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
								aHTML.push('</tr>');
								
								$(oResponse.data.rows).each(function()
								{
									aHTML.push('<tr class="ns1blankspaceRow">');
										
									aHTML.push('<td id="ns1blankspaceFinancialPayPeriodExpenseItem_Description-' + this.id + '" class="ns1blankspaceRow">' +
															this["description"]);

									aHTML.push('<div id="ns1blankspaceFinancialPayPeriodExpenseItem_Amount-' + this.id + '" class="ns1blankspaceSub">$' +
															 parseFloat(this["amount"]).toFixed(2) + '</div></td>');

									aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
													'<span id="ns1blankspacePayrollPayExpense_view-' + this.id + '" class="ns1blankspaceRowView"></span></td>');						 					
																																
									aHTML.push('</tr>');
								});	
							}
								
							aHTML.push('</table>');
						
							$('#ns1blankspacePayrollPayRunColumn3').html(aHTML.join(''));

							$('#ns1blankspaceFinancialPayrollExpenses .ns1blankspaceRowView')
							.button(
							{
								text: false,
								icons:
								{
									primary: "ui-icon-play"
								}
							})
							.click(function()
							{
								ns1blankspace.financial.expense.init({id: (this.id).split('-')[1]});
							})
							.css('width', '15px')
							.css('height', '20px');
						}
					}

					//ADD PAY RECORD
					else if (iStep == 11)
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
									success: function(data)
									{
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
							})
							.css('height', '18px');
						}
					}

					else if (iStep == 12)
					{
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_RECORD_MANAGE'),
							data: 'remove=1&id=' + iPay,
							dataType: 'json',
							success: function(data)
							{
								if (data.status == 'OK')
								{
									ns1blankspace.status.message('Removed');
									oParam.step = 1;
									oParam.pay = undefined;
									ns1blankspace.financial.payroll.pays(oParam);
								}
								else
								{
									ns1blankspace.status.error(data.error.errornotes);
								}
							}
						});
					}		
				},

	complete: 	function(oParam, oResponse)
				{
					ns1blankspace.status.working('Completing...');

					var iStep = ns1blankspace.util.getParam(oParam, 'step', {default: 1}).value;

					if (iStep == 1)
					{	
						if (ns1blankspace.financial.data.settings.payrollcreateexpenses == 'Y')
						{
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_CREATE_EXPENSES'),
								data: 'period=' + ns1blankspace.objectContext,
								dataType: 'json',
								success: function(data)
								{
									//if (data.status == 'OK')
									//{	
										ns1blankspace.financial.payroll.complete({step: 3})
									//}
								}	
							});
						}
						else
						{
							ns1blankspace.financial.payroll.complete({step: 3})
						}
					}

					if (iStep == 3)
					{
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_PERIOD_MANAGE'),
							data: 'status=2&id=' + ns1blankspace.objectContext,
							dataType: 'json',
							success: function()
							{	
								ns1blankspace.status.clear();
								ns1blankspace.financial.payroll.search.send('-' + ns1blankspace.objectContext);
							}
						});
					}	
				},

	expenses: 	{
					show:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
										oSearch.addField('description,amount');
										oSearch.addFilter('object', 'EQUAL_TO', '37');
										oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContextData.id);
										oSearch.getResults(function(data) {ns1blankspace.financial.payroll.expenses.show(oParam, data)})	
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table>');
											aHTML.push('<tr>');
											aHTML.push('<td class="ns1blankspaceNothing">No expenses.</td>');
											aHTML.push('</tr>');
											aHTML.push('</table>');

											$('#ns1blankspaceMainExpenses').html(aHTML.join(''));		
										}
										else
										{
										
											aHTML.push('<table>');
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.financial.payroll.expenses.row(this));
											});
											
											aHTML.push('</table>');
											
											ns1blankspace.render.page.show(
											{
												xhtmlElementID: 'ns1blankspaceMainExpenses',
												xhtmlContext: 'FinancialPayrollExpense',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspace.financial.payroll.expenses.row,
												functionOnNewPage: ns1blankspace.financial.payroll.expenses.bind,
												type: 'json'
											});
										}
									}	
								},

					row: 		function (oRow)
								{
									var aHTML = [];
									
									aHTML.push('<tr class="ns1blankspaceRow">');
															
									aHTML.push('<td id="ns1blankspaceFinancialPayrollExpense_description-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.description + '</td>');
															
									aHTML.push('<td id="ns1blankspaceFinancialPayrollExpense_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
															oRow.amount + '</td>');						
																																													
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspaceFinancialPayrollExpense_view-' + oRow.id +
													'" class="ns1blankspaceRow ns1blankspaceRowView"></span>' +
													'</td>');
																							
									aHTML.push('</tr>');	
									
									return aHTML.join('');
								},

					bind: 		function (oParam)
								{
									var sXHTMLContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlContainerID').value;

									$('#' + sXHTMLContainerID + ' span.ns1blankspaceRowView').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-play"
										}
									})
									.click(function()
									{
										ns1blankspace.financial.expense.init({id: (this.id).split('-')[1]});
									})
									.css('width', '15px')
									.css('height', '20px');
								}
				}
}

ns1blankspace.financial.payroll.totals =
{
	show: 		function (oParam, oResponse)
				{
					var sStartDate;
					var sEndDate;

					if (oParam != undefined)
					{
						if (oParam.startDate != undefined) {sStartDate = oParam.startDate}
						if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
					}
					else
					{
						oParam = {}
					}	

					if (sStartDate === undefined)
					{
						sStartDate = Date.today().moveToMonth(6, -1).moveToFirstDayOfMonth().toString("dd MMM yyyy");
						oParam.startDate = sStartDate;
					}

					if (sEndDate === undefined)
					{
						sEndDate = Date.today().toString("dd MMM yyyy");
						oParam.endDate = sEndDate;
					}	

					ns1blankspace.financial.payroll.data.context = 'totals';

					if (oResponse == undefined)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
								'<tr>' +
								'<td id="ns1blankspacePayrollTotalsColumn1" class="ns1blankspaceColumn1Divider" style="width:100px; font-size: 0.875em; padding-right:10px;"></td>' +
								'<td id="ns1blankspacePayrollTotalsColumn2" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
								'</tr>' +
								'</table>');	

						$('#ns1blankspaceMainTotals').html(aHTML.join(''));	

						var aHTML = [];
						
						aHTML.push('<table>');
						
						aHTML.push('<tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePayrollStartDate" class="ns1blankspaceDate">' +
										'</td></tr>');
							
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
										'To' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePayrollEndDate" class="ns1blankspaceDate">' +
										'</td></tr>');
														
						aHTML.push('<tr><td style="padding-top:5px;">' +
										'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspacePayrollRefresh">Refresh</span>' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:15px;" id="ns1blankspacePayrollSummary">' +
										'</td></tr>');
						
						aHTML.push('</table>');					
						
						$('#ns1blankspacePayrollTotalsColumn1').html(aHTML.join(''));

						$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});

						$('#ns1blankspacePayrollRefresh').button(
						{
							label: 'Refresh',
							icons:
							{
								primary: "ui-icon-arrowrefresh-1-e"
							}
						})
						.click(function()
						{
							ns1blankspace.financial.payroll.totals.show(
							{
								startDate: $('#ns1blankspacePayrollStartDate').val(),
								endDate: $('#ns1blankspacePayrollEndDate').val()
							})
						});

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
						oSearch.addField('grosssalary,netsalary,deductions,superannuation,taxbeforerebate,payrecord.employee.contactperson');
						oSearch.addSummaryField('sum(grosssalary) grosssalary');
						oSearch.addSummaryField('sum(netsalary) netsalary');
						oSearch.addSummaryField('sum(superannuation) superannuation');
						oSearch.addSummaryField('sum(taxbeforerebate) taxbeforerebate');

						if (sStartDate !== undefined)
						{
							oSearch.addFilter('payrecord.payperiod.paydate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
							$('#ns1blankspacePayrollStartDate').val(sStartDate);
						}
							
						if (sEndDate != undefined)
						{
							oSearch.addFilter('payrecord.payperiod.paydate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
							$('#ns1blankspacePayrollEndDate').val(sEndDate);
						}

						oSearch.sort('payrecord.employee.contactperson', 'asc');
						oSearch.rows = 200;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.totals.show(oParam, data)});	
					}
					else
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">' +
							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Gross Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.grosssalary).parseCurrency().formatMoney(0, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Net Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.netsalary).parseCurrency().formatMoney(0, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Tax</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.taxbeforerebate).parseCurrency().formatMoney(0, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Super.</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.superannuation).parseCurrency().formatMoney(0, '.', ',') + 
							'</td></tr>' +
							'</table>');

						$('#ns1blankspacePayrollSummary').html(aHTML.join(''));

						ns1blankspace.financial.payroll.totals.employees.show(oParam);
					}	
				},

	employees: 	{
					show: 		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										ns1blankspace.financial.data.employee = [];

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspacePayrollEmployeeTotalsColumn1">' + ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspacePayrollEmployeeTotalsColumn2" style="width:95px;"></td>' +
														'</tr></table>');				
										
										$('#ns1blankspacePayrollTotalsColumn2').html(aHTML.join(''));

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
										oSearch.addField('employee.contactpersontext,employee.employmentstartdate,employee.statustext,employee.employeenumber,employee.taxfilenumber,' +
															'employee.contactperson,employee.contactperson.firstname,employee.contactperson.surname,employee.contactperson.email,' +
															'employee.contactperson.streetaddress1,employee.contactperson.streetaddress2,employee.contactperson.streetsuburb,' +
															'employee.contactperson.streetstate,employee.contactperson.streetpostcode');
										//oSearch.addFilter('status', 'EQUAL_TO', '2') - use termination date
										oSearch.rows = 50;
										oSearch.sort('employee.contactperson.firstname', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.financial.payroll.totals.employees.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0 )
										{
											aHTML.push('<table><tr class="ns1blankspace">' +
															'<td class="ns1blankspaceNothing">No employees</td>' +
															'</tr></table>');

											$('#ns1blankspacePayrollEmployeeTotalsColumn1').html(aHTML.join(''));
										}
										else
										{
											ns1blankspace.financial.payroll.data.employees = oResponse.data.rows;

											aHTML.push('<table id="ns1blankspacePayrollEmployeeTotals" class="ns1blankspace">' +
															'<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspacePayrollEmployeeTotalsSelectAll"></span></td>' +
															'<td class="ns1blankspaceHeaderCaption">First Name</td>' +
															'<td class="ns1blankspaceHeaderCaption">Last Name</td>' +
															'<td class="ns1blankspaceHeaderCaption" style="color:#A0A0A0;">Number</td>' +
															'<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
															'</tr>');
											
											$(oResponse.data.rows).each(function() 
											{
												aHTML.push(ns1blankspace.financial.payroll.totals.employees.row(this));
											});
											
											aHTML.push('</table>');

											ns1blankspace.render.page.show(
										   	{
												type: 'JSON',
												xhtmlElementID: 'ns1blankspacePayrollEmployeeTotalsColumn1',
												xhtmlContext: 'Employees',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspace.financial.payroll.totals.employees.row,
												functionOpen: undefined,
												functionOnNewPage: ns1blankspace.financial.payroll.totals.employees.bind,
										   	});

											var aHTML = [];
																	
											aHTML.push('<table class="ns1blankspaceColumn2" style="margin-right:0px;">');
													
											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsPreview" class="ns1blankspaceAction" style="text-align:left;">' +
															'Summary</span></td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollTotalsPreviewStatus" style="padding-top:5px; padding-bottom:12px; font-size:0.75em;" class="ns1blankspaceSub">' +
														'Create summaries for selected employees</td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsEmail" class="ns1blankspaceAction" style="text-align:left;">' +
															'Email</span></td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollTotalsEmailStatus" style="padding-top:10px; font-size:0.75em;" class="ns1blankspaceSub"></td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsFile" class="ns1blankspaceAction" style="text-align:left;">' +
															'File</span></td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsFileTest" class="ns1blankspaceAction" style="text-align:left;">' +
															'Test File</span></td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollTotalsFileStatus" style="padding-top:10px; font-size:0.75em;" class="ns1blankspaceSub"></td></tr>');

											aHTML.push('</table>');					
											
											$('#ns1blankspacePayrollEmployeeTotalsColumn2').html(aHTML.join(''));
											
											$('#ns1blankspacePayrollTotalsPreview').button(
											{
												label: 'Summary',
												icons:
												{
													primary: "ui-icon-document"
												}
											})
											.click(function()
											{	
												ns1blankspace.financial.payroll.totals.employees.preview.init(oParam)
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollTotalsEmail').button(
											{
												label: 'Email',
												icons:
												{
													primary: "ui-icon-mail-open"
												}
											})
											.click(function()
											{	
												oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.totals.employees.email.init};
												ns1blankspace.financial.payroll.totals.employees.preview.init(oParam);
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollTotalsFile').button(
											{
												label: 'File',
												icons:
												{
													primary: "ui-icon-disk"
												}
											})
											.click(function()
											{	
												oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.totals.employees.file.init};
												oParam.fileMode = 'P';
												ns1blankspace.financial.payroll.totals.employees.preview.init(oParam);
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollTotalsFileTest').button(
											{
												label: 'Test File',
												icons:
												{
													primary: "ui-icon-disk"
												}
											})
											.click(function()
											{	
												oParam.fileMode = 'T';
												oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.totals.employees.file.init};
												ns1blankspace.financial.payroll.totals.employees.preview.init(oParam);
											})
											.css('width', '90px');
										}	    	
									}
								},

					row: 		function (oRow)
								{
									var sKey = oRow.id;									
									var aHTML = [];

									aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspacePayrollTotals_container-' + sKey + '">' +
																	'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspacePayrollTotals_selectContainer-' + sKey + '">' +
																	'<input type="checkbox" checked="checked" id="ns1blankspacePayrollTotals_select-' + sKey + '" /></td>');

									aHTML.push('<td id="ns1blankspacePayrollTotals_firstname" class="ns1blankspaceRow">' +
													oRow["employee.contactperson.firstname"] + '</td>');

									aHTML.push('<td id="ns1blankspacePayrollTotals_surname" class="ns1blankspaceRow">' +
													oRow["employee.contactperson.surname"] + '</td>');

									aHTML.push('<td id="ns1blankspacePayrollTotals_employeenumber" class="ns1blankspaceRow ns1blankspaceSub">' +
													oRow["employee.employeenumber"] + '</td>');

									aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">' +
													'<span style="margin-right:5px;" id="ns1blankspacePayrollTotals_option_preview-' + sKey + '"' +
																	' class="ns1blankspaceRowPreview"></span>' +
													'<span id="ns1blankspacePayrollTotals_contact-' + sKey + '" class="ns1blankspaceRowSelect"></span>' +				
													'</td></tr>');
									
									return aHTML.join('');
								},

					bind: 		function ()
								{
									$('#ns1blankspacePayrollEmployeeTotals .ns1blankspaceRowSelect').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-play"
										}
									})
									.click(function()
									{
										$('#ns1blankspaceViewControlNew').button({disabled: false});
										ns1blankspace.show({selector: '#ns1blankspaceMainEmployee', refresh: true});
										//$('td.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
										//$('#ns1blankspaceControl-employees').addClass('ns1blankspaceHighlight');
										ns1blankspace.financial.payroll.employees.show({filterEmployee: (this.id).split('-')[1]});	
									})
									.css('width', '15px')
									.css('height', '20px');

									$('.ns1blankspacePayrollEmployeeTotalsSelectAll').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-check"
										}
									})
									.click(function()
									{	
										$('#ns1blankspacePayrollEmployeeTotals input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
									})
									.css('width', '14px');		
								},

					preview: 	{
									init: 		function (oParam)
												{
													oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.payroll.totals.employees.preview.show);
													oParam = ns1blankspace.util.setParam(oParam, 'template', 'payroll');
													ns1blankspace.util.initTemplate(oParam)
												},

									show:		function (oParam)
												{
													var iStep = 1
													var iDataIndex = 0;
													var iDataItemIndex = 0;
													var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
													var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;

													if (oParam != undefined)
													{	
														if (oParam.step != undefined) {iStep = oParam.step}
														if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
														if (oParam.dataItemIndex != undefined) {iDataItemIndex = oParam.dataItemIndex}
													}
													else
													{
														oParam = {}
													}			

													if (iStep == 1)
													{	
														ns1blankspace.financial.payroll.data.summaries = [];

														if ($('#ns1blankspacePayrollEmployeeTotals input:checked').length > 0)
														{	
															$('#ns1blankspacePayrollTotalsPreviewStatus').html('<span style="font-size:2.25em;" class="ns1blankspaceSub">' +
																		'<span id="ns1blankspacePayrollTotalsPreviewStatusIndex">1</span>/' + $('#ns1blankspacePayrollEmployeeTotals input:checked').length + 
																		'</span>');
														}
														else
														{
															ns1blankspace.status.error('No employees selected')
														}	

														$('#ns1blankspacePayrollEmployeeTotals input:checked').each(function() 
														{
															var sKey = (this.id).split('-')[1];

															var oData = $.grep(ns1blankspace.financial.payroll.data.employees, function (a) {return a.id == sKey;})[0]

															if (oData)
															{
																ns1blankspace.financial.payroll.data.summaries.push(oData);
															}
														});

														oParam.step = 2;
														ns1blankspace.financial.payroll.totals.employees.preview.show(oParam);
													}			

													if (iStep == 2)
													{
														if (iDataIndex < ns1blankspace.financial.payroll.data.summaries.length)
														{	
															$('#ns1blankspacePayrollTotalsPreviewStatusIndex').html(iDataIndex + 1);

															var oData = ns1blankspace.financial.payroll.data.summaries[iDataIndex];

															if (oData.pay !== undefined)
															{
																oParam.step = 2;
																oParam.dataIndex = iDataIndex + 1;
																ns1blankspace.financial.payroll.totals.employees.preview.show(oParam);
															}	
															else
															{
																$('#ns1blankspacePayrollTotals_option_preview-' + oData.id).html(ns1blankspace.xhtml.loadingSmall)

																var oSearch = new AdvancedSearch();
																oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
																oSearch.addField('grosssalary,netsalary,deductions,superannuation,taxbeforerebate,payrecord.payperiod.paydate');
																oSearch.addSummaryField('sum(grosssalary) grosssalary');
																oSearch.addSummaryField('sum(netsalary) netsalary');
																oSearch.addSummaryField('sum(superannuation) superannuation');
																oSearch.addSummaryField('sum(taxbeforerebate) taxbeforerebate');
																oSearch.addSummaryField('sum(allowances) allowances');
																oSearch.addSummaryField('max(payrecord.payperiod.paydate) paydate');

																oSearch.addFilter('employee', 'EQUAL_TO', oData.id);

																if (sStartDate !== undefined)
																{
																	oSearch.addFilter('payrecord.payperiod.paydate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
																}
																	
																if (sEndDate != undefined)
																{
																	oSearch.addFilter('payrecord.payperiod.paydate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
																}

																oSearch.rows = 200;
																oSearch.sort('payrecord.payperiod.paydate', 'asc');

																oSearch.getResults(function(oResponse)
																{
																	oParam.step = 2;
																	oParam.dataIndex = iDataIndex + 1;
																	ns1blankspace.financial.payroll.data.summaries[iDataIndex].pay = oResponse.data.rows;
																	ns1blankspace.financial.payroll.data.summaries[iDataIndex].grosssalary = (oResponse.summary.grosssalary).parseCurrency().formatMoney(0, '.', ',');
																	ns1blankspace.financial.payroll.data.summaries[iDataIndex].netsalary = (oResponse.summary.netsalary).parseCurrency().formatMoney(0, '.', ',');
																	ns1blankspace.financial.payroll.data.summaries[iDataIndex].superannuation = (oResponse.summary.superannuation).parseCurrency().formatMoney(0, '.', ',');
																	ns1blankspace.financial.payroll.data.summaries[iDataIndex].taxbeforerebate = (oResponse.summary.taxbeforerebate).parseCurrency().formatMoney(0, '.', ',');
																	ns1blankspace.financial.payroll.data.summaries[iDataIndex].allowances = (oResponse.summary.allowances).parseCurrency().formatMoney(0, '.', ',');
																	ns1blankspace.financial.payroll.data.summaries[iDataIndex].contactbusinesstext = ns1blankspace.user.contactBusinessText;
																	ns1blankspace.financial.payroll.data.summaries[iDataIndex].year = Date.parse(oResponse.summary.paydate).getFullYear();

																	$('#ns1blankspacePayrollTotals_option_preview-' + oData.id).html('');
																	$('#ns1blankspacePayrollTotals_option_preview-' + oData.id).addClass('ns1blankspaceRowPreviewDone');

																	$('#ns1blankspacePayrollTotals_option_preview-' + oData.id).button(
																	{
																		text: false,
																		icons:
																		{
																			primary: "ui-icon-document"
																		}
																	})
																	.click(function() {
																		ns1blankspace.financial.payroll.totals.employees.preview.showHide({xhtmlElementID: this.id});
																	})
																	.css('width', '15px')
																	.css('height', '20px');

																	ns1blankspace.financial.payroll.totals.employees.preview.show(oParam);
																});
															}					
														}
														else
														{
															$('#ns1blankspacePayrollTotalsPreviewStatus').fadeOut(3000);
															ns1blankspace.util.onComplete(oParam);
														}	
													}						
												},

									showHide: 	function (oParam)
												{
													var sXHTMLElementID;
													var sKey;

													if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
													{
														sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
														sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
													}

													if ($('#ns1blankspacePayrollTotals_container_preview-' + sKey).length != 0)
													{
														$('#ns1blankspacePayrollTotals_container_preview-' + sKey).remove();
													}
													else
													{
														var sHTML = 'No preview';

														var oSummary = $.grep(ns1blankspace.financial.payroll.data.summaries, function (a) {return a.id == sKey;})[0];

														if (oSummary)
														{
															sHTML = ns1blankspace.format.render(
															{
																object: 37,
																objectContext: -1,
																xhtmlTemplate: ns1blankspace.xhtml.templates['payroll'],
																objectData: oSummary,
																objectOtherData: oSummary.pay
															});

															oSummary.xhtml = sHTML;
														}	

														$('#ns1blankspacePayrollTotals_container-' + sKey).after('<tr id="ns1blankspacePayrollTotals_container_preview-' + sKey + '">' +
																		'<td colspan=5><div style="background-color: #F3F3F3; padding:8px;" class="ns1blankspaceScale85">' + sHTML + '</div></td></tr>')
													}
												}			
								},

					email: 		{
									init: 		function (oParam, oResponse)
												{
													ns1blankspace.financial.payroll.totals.employees.email.send({dataIndex: 0})
												},

									send:		function (oParam)
												{		
													var iDataIndex = 0;

													if (oParam != undefined)
													{	
														if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
													}
													else
													{
														oParam = {}
													}			
																	
													if (iDataIndex < ns1blankspace.financial.payroll.data.summaries.length)
													{
														$('#ns1blankspacePayrollTotalsEmailStatus').html('<span style="font-size:2.25em;" class="ns1blankspaceSub">' +
															'<span id="ns1blankspacePayrollTotalsEmailStatusIndex">' + (iDataIndex + 1) + '</span>/' + ns1blankspace.financial.payroll.data.summaries.length + 
															'</span>');

														ns1blankspace.debug.message(ns1blankspace.financial.payroll.data.summaries[iDataIndex]);

														var oSummary = ns1blankspace.financial.payroll.data.summaries[iDataIndex];

														if (oSummary !== undefined)
														{
															if (oSummary['employee.contactperson.email'] == '')
															{
																$('#ns1blankspacePayrollTotals_selectContainer-' + oSummary.id).html('No Email');
																oParam.dataIndex = iDataIndex + 1;
																oParam.step = 2;
																ns1blankspace.financial.payroll.totals.employees.email.send(oParam);
															}	
															else
															{
																$('#ns1blankspacePayrollTotals_selectContainer-' + oSummary.id).html(ns1blankspace.xhtml.loadingSmall);

																if (oSummary.xhtml === undefined)
																{
																	oSummary.xhtml = ns1blankspace.format.render(
																	{
																		object: 37,
																		objectContext: -1,
																		xhtmlTemplate: ns1blankspace.xhtml.templates['payroll'],
																		objectData: oSummary,
																		objectOtherData: oSummary.pay
																	});
																}	

																var oData = 
																{
																	subject: ns1blankspace.user.contactBusinessText + ' Pay Summary',
																	message: oSummary.xhtml,
																	id: oSummary['employee.contactperson'],
																	to: oSummary['employee.contactperson.email'],
																	object: 37,
																	objectContext: oSummary.id
																}

																//ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND')

																$.ajax(
																{
																	type: 'POST',
																	url: '/ondemand/messaging/?method=MESSAGING_EMAIL_SEND',
																	data: oData,
																	dataType: 'json',
																	global: false,
																	success: function (data)
																	{
																		if (data.status == 'OK')
																		{
																			$('#ns1blankspacePayrollTotals_selectContainer-' + oSummary.id).html('Emailed');
																			oParam.dataIndex = iDataIndex + 1;
																			oParam.step = 2;
																			ns1blankspace.financial.payroll.totals.employees.email.send(oParam);
																		}
																		else
																		{
																			$('#ns1blankspacePayrollTotals_selectContainer-' + oSummary.id).html('Error');
																			$('#ns1blankspacePayrollTotals_selectContainer-' + oSummary.id).attr('title', data.error.errornotes);
																		}
																	}
																});
															}	
														}
													}
													else
													{
														$('#ns1blankspacePayrollTotalsEmailStatus').fadeOut(3000);
														ns1blankspace.util.onComplete(oParam);
													}	
												}																	
								},

					file: 		{
									init: 		function (oParam, oResponse)
												{
													if (oParam === undefined) {oParam = {fileMode: 'T'}}

													var oSearch = new AdvancedSearch();
													oSearch.method = 'CONTACT_BUSINESS_SEARCH';		
													oSearch.addField('tradename,legalname,abn,phonenumber,faxnumber,email,streetaddress1,streetaddress2,streetsuburb,streetstate,streetpostcode,' +
																			'mailingaddress1,mailingaddress2,mailingsuburb,mailingstate,mailingpostcode');
													oSearch.rows = 1;
													oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.user.contactBusiness)
													
													oSearch.getResults(function(oResponse)
													{
														if (oResponse.status == 'OK')
														{	
															var oRow =  oResponse.data.rows[0];

															oParam.name = 'Payment Summary - AU';
															oParam.saveToFile = true;
															oParam.xhtmlElementID = 'ns1blankspaceFileDownload';

															oParam.abn = oRow.abn;
															oParam.startDate = $('#ns1blankspacePayrollStartDate').val();
															oParam.endDate = $('#ns1blankspacePayrollEndDate').val();
															oParam.contactBusinessText = (oRow.tradname==''?oRow.legalname:oRow.tradename);
															oParam.phone = oRow.phonenumber;
															oParam.fax = oRow.faxnumber;
															oParam.email = oRow.email;
															oParam.streetAddress1 = oRow.streetaddress1;
															oParam.streetAddress2 = oRow.streetaddress2;
															oParam.streetSuburb = oRow.streetsuburb;
															oParam.streetState = oRow.streetstate;
															oParam.streetPostCode = oRow.streetpostcode;
															oParam.mailingAddress1 = oRow.mailingaddress1;
															oParam.mailingAddress2 = oRow.mailingaddress2;
															oParam.mailingSuburb = oRow.mailingsuburb;
															oParam.mailingState = oRow.mailingstate;
															oParam.mailingPostCode = oRow.mailingpostcode;
																
															ns1blankspace.financial.payroll.totals.employees.file.create(oParam);
														}	
													});	
												},

									create: 	function (oParam, oResponse)
												{
													if (ns1blankspace.financial.payroll.data.summaries.length == 0)
													{
														ns1blankspace.status.error('No employees selected');
													}	
													else
													{	
														ns1blankspace.status.working('Creating file...');

														var oItems = [];

														$.each(ns1blankspace.financial.payroll.data.summaries, function()
														{
															var oItem = this;
															delete oItem.pay;
															oItems.push(oItem);
														});

														$('#ns1blankspacePayrollTotalsColumn2').html('<table class="ns1blankspace">' +
															'<tr>' +
															'<td class="ns1blankspaceTextMulti">' +
															'<div id="ns1blankspaceFileContents" class="ns1blankspaceTextMulti" style="background-color:#F3F3F3; width:100%; font-family:Courier New; font-size:0.865em; white-space:pre; overflow:auto;">' +
																'</div>' +
															'</td></tr>' +
															'<tr>' +
															'<td class="ns1blankspaceTextMulti" id="ns1blankspaceFileDownload" style="padding-top:8px;"' +
															'</td></tr></table>');		

														oParam.totalRows = oItems.length;
														oParam.items = oItems;
														oParam.fileName = 'empdupe.a01';

														var sFile = ns1blankspace.setup.file.export.process(oParam);

														$('#ns1blankspaceFileContents').html(sFile);
													}	
												},
								}						
				}
}

ns1blankspace.financial.payroll.pays.totals =
{
	show: 		function (oParam, oResponse)
				{
					
					if (oResponse == undefined)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
								'<tr>' +
								'<td id="ns1blankspacePayrollPayTotalsColumn1" class="ns1blankspaceColumn1Divider" style="width:120px; font-size: 0.875em; padding-right:10px;"></td>' +
								'<td id="ns1blankspacePayrollPayTotalsColumn2" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
								'</tr>' +
								'</table>');	

						$('#ns1blankspaceMainPayTotals').html(aHTML.join(''));	

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
						oSearch.addField('grosssalary,netsalary,deductions,superannuation,taxbeforerebate,payrecord.employee.contactperson');
						oSearch.addSummaryField('sum(grosssalary) grosssalary');
						oSearch.addSummaryField('sum(netsalary) netsalary');
						oSearch.addSummaryField('sum(superannuation) superannuation');
						oSearch.addSummaryField('sum(taxbeforerebate) taxbeforerebate');
						oSearch.addFilter('period', 'EQUAL_TO', ns1blankspace.objectContext)
						oSearch.rows = 0;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays.totals.show(oParam, data)});	
					}
					else
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">' +
							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Gross Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.grosssalary).parseCurrency().formatMoney(0, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Net Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.netsalary).parseCurrency().formatMoney(0, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Tax</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.taxbeforerebate).parseCurrency().formatMoney(0, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Super.</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.superannuation).parseCurrency().formatMoney(0, '.', ',') + 
							'</td></tr>' +
							'</table>');

						$('#ns1blankspacePayrollPayTotalsColumn1').html(aHTML.join(''));

						ns1blankspace.financial.payroll.pays.totals.slips.show(oParam);
					}	
				},

	slips: 	{
					show: 		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										ns1blankspace.financial.data.pays = [];

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspacePayrollPaySlipTotalsColumn1">' + ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspacePayrollPaySlipTotalsColumn2" style="width:105px;"></td>' +
														'</tr></table>');				
										
										$('#ns1blankspacePayrollPayTotalsColumn2').html(aHTML.join(''));

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
										oSearch.addField('payrecord.grosssalary,payrecord.netsalary,payrecord.superannuation,payrecord.taxafterrebate,payrecord.taxbeforerebate,' +
															'payrecord.employee.taxfilenumber,payrecord.employee.employeenumber,' +
															'payrecord.employee.contactperson.firstname,payrecord.employee.contactperson.surname,payrecord.employee.contactperson.email,' +
															'payrecord.payperiod.startdate,payrecord.payperiod.paydate');
										oSearch.addFilter('period', 'EQUAL_TO', ns1blankspace.objectContext)
										oSearch.rows = 200;
										oSearch.sort('payrecord.employee.contactpersontext', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays.totals.slips.show(oParam, data)})	
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0 )
										{
											aHTML.push('<table><tr class="ns1blankspace">' +
															'<td class="ns1blankspaceNothing">No pays</td>' +
															'</tr></table>');

											$('#ns1blankspacePayrollPaySlipTotalsColumn1').html(aHTML.join(''));
										}
										else
										{
											ns1blankspace.financial.payroll.data.pays = oResponse.data.rows;

											aHTML.push('<table id="ns1blankspacePayrollPaySlipTotals" class="ns1blankspace">' +
															'<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspacePayrollPayTotalsSelectAll"></span></td>' +
															'<td class="ns1blankspaceHeaderCaption">First Name</td>' +
															'<td class="ns1blankspaceHeaderCaption">Last Name</td>' +
															'<td class="ns1blankspaceHeaderCaption" style="color:#A0A0A0;">Number</td>' +
															'<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
															'</tr>');
											
											$(oResponse.data.rows).each(function() 
											{
												aHTML.push(ns1blankspace.financial.payroll.pays.totals.slips.row(this));
											});
											
											aHTML.push('</table>');

											ns1blankspace.render.page.show(
										   	{
												type: 'JSON',
												xhtmlElementID: 'ns1blankspacePayrollPaySlipTotalsColumn1',
												xhtmlContext: 'Slips',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspace.financial.payroll.pays.totals.slips.row,
												functionOpen: undefined,
												functionOnNewPage: ns1blankspace.financial.payroll.pays.totals.slips.bind,
										   	});

											var aHTML = [];
																	
											aHTML.push('<table class="ns1blankspaceColumn2">');
													
											aHTML.push('<tr><td><span id="ns1blankspacePayrollPayTotalsPreview" class="ns1blankspaceAction" style="text-align:left;">' +
															'Pay Slips</span></td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollPayTotalsPreviewStatus" style="padding-top:5px; padding-bottom:12px; font-size:0.75em;" class="ns1blankspaceSub">' +
														'Create pay slips for selected employees</td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollPayTotalsEmail" class="ns1blankspaceAction">' +
															'Email</span></td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollPayTotalsEmailStatus" style="padding-top:10px; font-size:0.75em;" class="ns1blankspaceSub"></td></tr>');

											aHTML.push('</table>');					
											
											$('#ns1blankspacePayrollPaySlipTotalsColumn2').html(aHTML.join(''));
											
											$('#ns1blankspacePayrollPayTotalsPreview').button(
											{
												label: 'Pay Slips',
												icons:
												{
													primary: "ui-icon-document"
												}
											})
											.click(function()
											{	
												ns1blankspace.financial.payroll.pays.totals.slips.preview.init(oParam)
											})
											.css('width', '100px');

											$('#ns1blankspacePayrollPayTotalsEmail').button(
											{
												label: 'Email',
												icons:
												{
													primary: "ui-icon-mail-open"
												}
											})
											.click(function()
											{	
												oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.pays.totals.slips.email.init};
												ns1blankspace.financial.payroll.pays.totals.slips.preview.init(oParam);
											})
											.css('width', '100px')
											.css('text-align', 'left');	
										}	    	
									}
								},

					row: 		function (oRow)
								{
									var sKey = oRow.id;									
									var aHTML = [];

									aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspacePayrollPayTotals_container-' + sKey + '">' +
																	'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspacePayrollPayTotals_selectContainer-' + sKey + '">' +
																	'<input type="checkbox" checked="checked" id="ns1blankspacePayrollPayTotals_select-' + sKey + '" /></td>');

									aHTML.push('<td id="ns1blankspacePayrollPayTotals_firstname" class="ns1blankspaceRow">' +
													oRow["payrecord.employee.contactperson.firstname"] + '</td>');

									aHTML.push('<td id="ns1blankspacePayrollPayTotals_surname" class="ns1blankspaceRow">' +
													oRow["payrecord.employee.contactperson.surname"] + '</td>');

									aHTML.push('<td id="ns1blankspacePayrollPayTotals_employeenumber" class="ns1blankspaceRow ns1blankspaceSub">' +
													oRow["payrecord.employee.employeenumber"] + '</td>');

									aHTML.push('<td style="width:20px;text-align:right;" class="ns1blankspaceRow">' +
													'<span style="margin-right:5px;" id="ns1blankspacePayrollPayTotals_option_preview-' + sKey + '"' +
																	' class="ns1blankspaceRowPreview"></span>' +		
													'</td></tr>');
									
									return aHTML.join('');
								},

					bind: 		function ()
								{
									$('.ns1blankspacePayrollPayTotalsSelectAll').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-check"
										}
									})
									.click(function()
									{	
										$('#ns1blankspacePayrollPaySlipTotals input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
									})
									.css('width', '14px');		
								},

					preview: 	{
									init: 		function (oParam)
												{
													oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.payroll.pays.totals.slips.preview.show);
													oParam = ns1blankspace.util.setParam(oParam, 'template', 'payslip');
													ns1blankspace.util.initTemplate(oParam)
												},

									show:		function (oParam)
												{
													var iStep = 1
													var iDataIndex = 0;
													var iDataItemIndex = 0;

													if (oParam != undefined)
													{	
														if (oParam.step != undefined) {iStep = oParam.step}
														if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
														if (oParam.dataItemIndex != undefined) {iDataItemIndex = oParam.dataItemIndex}
													}
													else
													{
														oParam = {}
													}			

													if (iStep == 1)
													{	
														ns1blankspace.financial.payroll.data.slips = [];

														if ($('#ns1blankspacePayrollPaySlipTotals input:checked').length > 0)
														{	
															$('#ns1blankspacePayrollPayTotalsPreviewStatus').html('<span style="font-size:2.25em;" class="ns1blankspaceSub">' +
																		'<span id="ns1blankspacePayrollPayTotalsPreviewStatusIndex">1</span>/' + $('#ns1blankspacePayrollPaySlipTotals input:checked').length + 
																		'</span>');
														}
														else
														{
															ns1blankspace.status.error('No employees selected')
														}	

														$('#ns1blankspacePayrollPaySlipTotals input:checked').each(function() 
														{
															var sKey = (this.id).split('-')[1];

															var oData = $.grep(ns1blankspace.financial.payroll.data.pays, function (a) {return a.id == sKey;})[0]

															if (oData)
															{
																ns1blankspace.financial.payroll.data.slips.push(oData);
															}
														});

														oParam.step = 2;
														ns1blankspace.financial.payroll.pays.totals.slips.preview.show(oParam);
													}			

													if (iStep == 2)
													{
														if (iDataIndex < ns1blankspace.financial.payroll.data.slips.length)
														{	
															$('#ns1blankspacePayrollPayTotalsPreviewStatusIndex').html(iDataIndex + 1);

															var oData = ns1blankspace.financial.payroll.data.slips[iDataIndex];

															if (oData.items !== undefined)
															{
																oParam.step = 2;
																oParam.dataIndex = iDataIndex + 1;
																ns1blankspace.financial.payroll.pays.totals.slips.preview.show(oParam);
															}	
															else
															{
																$('#ns1blankspacePayrollPayTotals_option_preview-' + oData.id).html(ns1blankspace.xhtml.loadingSmall)

																var oSearch = new AdvancedSearch();
																oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';
																oSearch.addField('type,typetext,hours');
																oSearch.addSummaryField('sum(hours) hours');
																oSearch.addFilter('record', 'EQUAL_TO', oData.id);
																oSearch.rows = 100;
																oSearch.sort('type', 'asc')

																oSearch.getResults(function(oResponse)
																{
																	oParam.step = 2;
																	oParam.dataIndex = iDataIndex + 1;
																	ns1blankspace.financial.payroll.data.slips[iDataIndex].items = oResponse.data.rows;
																	ns1blankspace.financial.payroll.data.slips[iDataIndex].hours = oResponse.summary.hours;
																	ns1blankspace.financial.payroll.data.slips[iDataIndex].contactbusinesstext = ns1blankspace.user.contactBusinessText;
																	
																	$('#ns1blankspacePayrollPayTotals_option_preview-' + oData.id).html('');
																	$('#ns1blankspacePayrollPayTotals_option_preview-' + oData.id).addClass('ns1blankspaceRowPreviewDone');

																	$('#ns1blankspacePayrollPayTotals_option_preview-' + oData.id).button(
																	{
																		text: false,
																		icons:
																		{
																			primary: "ui-icon-document"
																		}
																	})
																	.click(function() {
																		ns1blankspace.financial.payroll.pays.totals.slips.preview.showHide({xhtmlElementID: this.id});
																	})
																	.css('width', '15px')
																	.css('height', '20px');

																	ns1blankspace.financial.payroll.pays.totals.slips.preview.show(oParam);
																});
															}					
														}
														else
														{
															$('#ns1blankspacePayrollPayTotalsPreviewStatus').fadeOut(3000);
															ns1blankspace.util.onComplete(oParam);
														}	
													}						
												},

									showHide: 	function (oParam)
												{
													var sXHTMLElementID;
													var sKey;

													if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
													{
														sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
														sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
													}

													if ($('#ns1blankspacePayrollPayTotals_container_preview-' + sKey).length != 0)
													{
														$('#ns1blankspacePayrollPayTotals_container_preview-' + sKey).remove();
													}
													else
													{
														var sHTML = 'No preview';

														var oSlip = $.grep(ns1blankspace.financial.payroll.data.slips, function (a) {return a.id == sKey;})[0];

														if (oSlip !== undefined)
														{
															sHTML = ns1blankspace.format.render(
															{
																object: 371,
																objectContext: -1,
																xhtmlTemplate: ns1blankspace.xhtml.templates['payslip'],
																objectData: oSlip,
																objectOtherData: oSlip.items
															});

															oSlip.xhtml = sHTML;
														}	

														$('#ns1blankspacePayrollPayTotals_container-' + sKey).after('<tr id="ns1blankspacePayrollPayTotals_container_preview-' + sKey + '">' +
																		'<td colspan=5><div style="background-color: #F3F3F3; padding:8px;" class="ns1blankspaceScale85">' + sHTML + '</div></td></tr>')
													}
												}			
								},

					email: 		{
									init: 		function (oParam, oResponse)
												{
													ns1blankspace.financial.payroll.pays.totals.slips.email.send({dataIndex: 0})
												},

									send:		function (oParam)
												{		
													var iDataIndex = 0;

													if (oParam != undefined)
													{	
														if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
													}
													else
													{
														oParam = {}
													}			
																	
													if (iDataIndex < ns1blankspace.financial.payroll.data.slips.length)
													{
														$('#ns1blankspacePayrollPayTotalsEmailStatus').html('<span style="font-size:2.25em;" class="ns1blankspaceSub">' +
															'<span id="ns1blankspacePayrollPayTotalsEmailStatusIndex">' + (iDataIndex + 1) + '</span>/' + ns1blankspace.financial.payroll.data.slips.length + 
															'</span>');

														ns1blankspace.debug.message(ns1blankspace.financial.payroll.data.slips[iDataIndex]);

														var oSlip = ns1blankspace.financial.payroll.data.slips[iDataIndex];

														if (oSlip !== undefined)
														{
															if (oSlip['payperiod.employee.contactperson.email'] == '')
															{
																$('#ns1blankspacePayrollPayTotals_selectContainer-' + oSlip.id).html('No Email');
																oParam.dataIndex = iDataIndex + 1;
																oParam.step = 2;
																ns1blankspace.financial.payroll.pays.totals.slips.email.send(oParam);
															}	
															else
															{
																$('#ns1blankspacePayrollPayTotals_selectContainer-' + oSlip.id).html(ns1blankspace.xhtml.loadingSmall);

																if (oSlip.xhtml === undefined)
																{
																	oSlip.xhtml = ns1blankspace.format.render(
																	{
																		object: 371,
																		objectContext: -1,
																		xhtmlTemplate: ns1blankspace.xhtml.templates['payslip'],
																		objectData: oSlip,
																		objectOtherData: oSlip.items
																	});
																}	

																var oData = 
																{
																	subject: ns1blankspace.user.contactBusinessText + ' Pay Slip - ' + ns1blankspace.objectContextData.paydate,
																	message: oSlip.xhtml,
																	id: oSlip['payrecord.employee.contactperson'],
																	to: oSlip['payrecord.employee.contactperson.email'],
																	object: 37,
																	objectContext: ns1blankspace.objectContext
																}

																//ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND')

																$.ajax(
																{
																	type: 'POST',
																	url: '/ondemand/messaging/?method=MESSAGING_EMAIL_SEND',
																	data: oData,
																	dataType: 'json',
																	global: false,
																	success: function (data)
																	{
																		if (data.status == 'OK')
																		{
																			$('#ns1blankspacePayrollPayTotals_selectContainer-' + oSlip.id).html('Emailed');
																			oParam.dataIndex = iDataIndex + 1;
																			oParam.step = 2;
																			ns1blankspace.financial.payroll.pays.totals.slips.email.send(oParam);
																		}
																		else
																		{
																			$('#ns1blankspacePayrollPayTotals_selectContainer-' + oSlip.id).html('Error');
																			$('#ns1blankspacePayrollPayTotals_selectContainer-' + oSlip.id).attr('title', data.error.errornotes);
																		}
																	}
																});
															}	
														}
													}
													else
													{
														$('#ns1blankspacePayrollPayTotalsEmailStatus').fadeOut(3000);
														ns1blankspace.util.onComplete(oParam);
													}	
												}																	
								}			
				}
}							
