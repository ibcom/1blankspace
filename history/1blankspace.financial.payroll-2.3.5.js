/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 */

ns1blankspace.financial.payroll = 
{
	data: 	{
					context: 'pays',
					payPeriods: ['Not Set', 'Weekly', 'Fortnightly', 'Monthly', 'Bi-Monthly']
				},

	init: 	function (oParam)
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
						if (ns1blankspace.financial.payroll.data.linetypes == undefined)
						{
							oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.payroll.init)
							ns1blankspace.financial.payroll.util.linetypes.init(oParam);
						}
						else
						{	
							oParam.bind = ns1blankspace.financial.payroll.bind;

							oParam.xhtml = '<table id="ns1blankspaceOptions" class="ns1blankspaceViewControlContainer">' +	
												'<tr class="ns1blankspaceOptions">' +
												'<td id="ns1blankspaceControlActionOptionsRemove" class="ns1blankspaceViewControl">' +
												'Delete' +
												'</td></tr>' +
												'<tr class="ns1blankspaceOptions">' +
												'<td id="ns1blankspaceControlActionOptionsComplete" class="ns1blankspaceViewControl">' +
												'Complete' +
												'</td></tr>' +
												'</table>';

							ns1blankspace.app.set(oParam);					

							$('#ns1blankspaceViewControlNew').unbind('click');

							$('#ns1blankspaceViewControlNew').click(function(event)
							{
								ns1blankspace.financial.payroll["new"].show()
							});
						}	
					}
				},

	bind: 	function (oParam)
				{
					$('#ns1blankspaceControlActionOptionsRemove')
					.click(function() 
					{
						ns1blankspace.app.options.remove(oParam)
					});

					$('#ns1blankspaceControlActionOptionsComplete')
					.click(function() 
					{
						ns1blankspace.app.options.hide();
						ns1blankspace.financial.payroll.complete({step: 1});
					});
				},			

	home:		{
					show: function (oParam, oResponse)
								{		
									var bNew = ns1blankspace.util.getParam(oParam, 'new', {"default": false}).value;

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
													'<td id="ns1blankspaceControl_totals" class="ns1blankspaceControl">Totals' +
													'<br /><div class="ns1blankspaceSubNote">pay summaries</div></td>' +
													'</tr>');

										aHTML.push('<tr class="ns1blankspaceControl">' +
													'<td id="ns1blankspaceControl_superannuation" class="ns1blankspaceControl" style="padding-top:6px;">Superannuation' +
													'<br /><div class="ns1blankspaceSubNote">to be paid</div></td>' +
													'</tr>');

										aHTML.push('<tr class="ns1blankspaceControl">' +
													'<td id="ns1blankspaceControl_insurance" class="ns1blankspaceControl" style="padding-top:6px;">Insurance' +
													'<br /><div class="ns1blankspaceSubNote">workers compensation</div></td>' +
													'</tr>');

										aHTML.push('<tr class="ns1blankspaceControl">' +
													'<td id="ns1blankspaceControl_dashboard" class="ns1blankspaceControl" style="padding-top:6px;">Summary' +
													'<br /><div class="ns1blankspaceSubNote">for analysis</div></td>' +
													'</tr>');
																						
										aHTML.push('</table>');
										
										$('#ns1blankspaceControl').html(aHTML.join(''));
					
										$('#ns1blankspaceControl-pays').click(function(event)
										{
											$('#ns1blankspaceViewControlNew').button({disabled: false});
											ns1blankspace.show({selector: '#ns1blankspaceMainPayRun', refresh: true, context: {inContext: false, action: true, actionOptions: true}});
											ns1blankspace.financial.payroll.home.show();
										});
									
										$('#ns1blankspaceControl-employees').click(function(event)
										{
											ns1blankspace.show({selector: '#ns1blankspaceMainEmployee', refresh: true, context: {inContext: false, action: true, actionOptions: true}});
											ns1blankspace.financial.payroll.employees.show();
										});

										$('#ns1blankspaceControl_totals').click(function(event)
										{
											ns1blankspace.show({selector: '#ns1blankspaceMainTotals', refresh: true});
											ns1blankspace.financial.payroll.totals.show();
										});

										$('#ns1blankspaceControl_superannuation').click(function(event)
										{
											ns1blankspace.show({selector: '#ns1blankspaceMainSuperannuation', refresh: true});
											ns1blankspace.financial.payroll.superannuation.init();
										});

										$('#ns1blankspaceControl_insurance').click(function(event)
										{
											ns1blankspace.show({selector: '#ns1blankspaceMainInsurance', refresh: true});

											ns1blankspace.financial.payroll.superannuation.urls(
											{
												onComplete: ns1blankspace.financial.payroll.insurance.init
											});
										});

										$('#ns1blankspaceControl_dashboard').click(function(event)
										{
											ns1blankspace.show({selector: '#ns1blankspaceMainDashboard', refresh: true});
											ns1blankspace.financial.payroll.dashboard.init();
										});
										
										var aHTML = [];
										
										aHTML.push('<div id="ns1blankspaceMainPayRun" class="ns1blankspaceControlMain"></div>');
										aHTML.push('<div id="ns1blankspaceMainEmployee" class="ns1blankspaceControlMain"></div>');
										aHTML.push('<div id="ns1blankspaceMainTotals" class="ns1blankspaceControlMain"></div>');
										aHTML.push('<div id="ns1blankspaceMainSuperannuation" class="ns1blankspaceControlMain"></div>');
										aHTML.push('<div id="ns1blankspaceMainNew" class="ns1blankspaceControlMain"></div>');
										aHTML.push('<div id="ns1blankspaceMainInsurance" class="ns1blankspaceControlMain"></div>');
										aHTML.push('<div id="ns1blankspaceMainDashboard" class="ns1blankspaceControlMain"></div>');

										$('#ns1blankspaceMain').html(aHTML.join(''));
									
										if (bNew)
										{
											ns1blankspace.financial.payroll["new"].show();
										}	
										else
										{
											ns1blankspace.financial.payroll.data.context = 'pays';

											$('#ns1blankspaceMainPayRun').html(ns1blankspace.xhtml.loading);

											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
											oSearch.addField('startdate,paydate,statustext');
											oSearch.sort('paydate', 'desc');
											oSearch.getResults(function(data){ns1blankspace.financial.payroll.home.show(oParam, data)});
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

											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:100px;">Pay Date</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:120px;">Start Date</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Status</td>');
											aHTML.push('<tr>')
	
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.financial.payroll.home.row(this, oParam));
											});
											
											aHTML.push('</table>');
										}
									
										ns1blankspace.render.page.show(
										{
											type: 'JSON',
											xhtmlElementID: 'ns1blankspaceMainPayRun',
											xhtmlContext: 'MostLikely',
											xhtml: aHTML.join(''),
											showMore: (oResponse.morerows == "true"),
											more: oResponse.moreid,
											rows: ns1blankspace.option.defaultRows,
											functionShowRow: ns1blankspace.financial.payroll.home.row,
											functionOpen: undefined,
											functionOnNewPage: ns1blankspace.financial.payroll.home.bind,
											headerRow: true
										});		
									}	
								},

					row: 		function (oRow, oParam)	
								{
									var aHTML = [];
									aHTML.push('<tr class="ns1blankspaceRow">');
									aHTML.push('<td id="ns1blankspaceMostLikely_paydate-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect" style="width:150px;">' +
																		oRow["paydate"] + '</td>');

									aHTML.push('<td id="ns1blankspaceMostLikely_startdate-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																		oRow["startdate"] + '</td>');
												
									aHTML.push('<td id="ns1blankspaceMostLikely_status-' + this.id + '" class="ns1blankspaceRow  ns1blankspaceSub">' +
																		oRow.statustext + '</td>');

									aHTML.push('</tr>');

									return aHTML.join('');
								},

					bind: 	function (oRow, oParam)	
								{
									$('.ns1blankspaceRowSelect').click(function(event)
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

											var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
  											if (oSearchDate.isValid())
											{
												oSearch.addOperator('or');
												oSearch.addBracket('(');
												oSearch.addFilter('startdate', 'LESS_THAN_OR_EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
												oSearch.addOperator('and');
												oSearch.addFilter('paydate', 'GREATER_THAN_OR_EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
												oSearch.addBracket(')');
											}

											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.sort('paydate', 'DESC');
											oSearch.rows = ns1blankspace.option.defaultRowsSmall;
											
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
											columns: 'paydate',
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
										'Financials<br /><div class="ns1blankspaceSubNote">Expenses & journals</div></td></tr>' +
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
						ns1blankspace.show({selector: '#ns1blankspaceMainPays', refresh: true});
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
						ns1blankspace.financial.payroll.financials.show();
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

						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.paydate +
							'<br /><span class="ns1blankspaceSub" style="font-weight:300">' + ns1blankspace.objectContextData.startdate  + '</span>' +
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

						$('#ns1blankspaceStatusComplete').button()
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
												ns1blankspace.inputDetected = false;
											}	
										});		
									}	
								}
				},				

	"new": 	{
					show: 	function (oParam)
								{
									var bJustSave = ns1blankspace.util.getParam(oParam, 'justSave', {"default": (ns1blankspace.financial.payroll.data.context == 'pays')}).value;

									if (bJustSave)
									{
										ns1blankspace.financial.payroll["new"].save();
									}
									else
									{
										var aHTML = [];
								
										ns1blankspace.show({selector: '#ns1blankspaceMainNew'});

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceNewColumn1" class="ns1blankspaceColumn1" style="width:50%"></td>' +
														'<td id="ns1blankspaceNewColumn2" class="ns1blankspaceColumn2"></td>' +
														'</tr>' + 
														'</table>');		

										$('#ns1blankspaceMainNew').html(aHTML.join(''));

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2">' +
															'<tr><td>' +
															'<span style="width:70px;" id="ns1blankspacePayrollNew_options_save" class="ns1blankspaceAction">Next</span>' +
															'</td></tr>' +
															'<tr><td>' +
															'<span style="width:70px;" id="ns1blankspacePayrollNew_options_cancel" class="ns1blankspaceAction">Cancel</span>' +
															'</td></tr>');

										if (ns1blankspace.financial.payroll.data.context == 'employees')
										{
											aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-top:16px;">' +
															'When you click next the employee will be created as a new contact or linked to the existing one, if it exists.' +
															'</td></tr>');
										}

										aHTML.push('</table>');	

										$('#ns1blankspaceNewColumn2').html(aHTML.join(''));

										$('#ns1blankspacePayrollNew_options_save').button(
										{
											text: "Next"
										})
										.click(function() 
										{
											ns1blankspace.financial.payroll["new"].save();
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
															'<input id="ns1blankspaceDetailsFirstName" data-1blankspace="ignore" class="ns1blankspaceText">' +
															'</td></tr>');

											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Last Name' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceText">' +
															'<input id="ns1blankspaceDetailsLastName" data-1blankspace="ignore" class="ns1blankspaceText">' +
															'</td></tr>');			
											
											aHTML.push('</table>');					
										}

										$('#ns1blankspaceNewColumn1').html(aHTML.join(''));
									}
								},

					save: 	function (oParam, oResponse)
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

									ns1blankspace.status.working();

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
										var iContactBusiness = ns1blankspace.spaceContactBusiness;
										if (iContactBusiness == undefined) {iContactBusiness = ns1blankspace.user.contactBusiness};

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
													oSearch.addFilter('contactbusiness', 'EQUAL_TO', iContactBusiness);
													oSearch.addFilter('firstname', 'EQUAL_TO', $('#ns1blankspaceDetailsFirstName').val());
													oSearch.addFilter('surname', 'EQUAL_TO', $('#ns1blankspaceDetailsLastName').val());

													oSearch.getResults(function(data) {ns1blankspace.financial.payroll["new"].save(oParam, data)});
												}
											}
											else	
											{
												if (oResponse.data.rows.length > 0)
												{
													ns1blankspace.financial.payroll["new"].process(
													{
														contactPerson: oResponse.data.rows[0].id,
														contactBusiness: iContactBusiness
													});		
												}
												else
												{
													var sData = 'contactbusiness=' + ns1blankspace.util.fs(iContactBusiness);
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
																ns1blankspace.status.message('Employee added.')

																ns1blankspace.financial.payroll["new"].process(
																{
																	contactPerson: data.id,
																	contactBusiness: iContactBusiness
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

					process: function (oParam)
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
									sData += '&pretaxsupertype=1';
									sData += '&superannuationrate=9.5';
									sData += '&employmentstartdate=' + Date.today().toString("dd MMM yyyy");
									
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
											ns1blankspace.financial.payroll.employees.show({filterEmployee: data.id});
										}	
									});		
								}
				},				

	employees: 	
				{
					show: 	function (oParam, oResponse)
								{
									var iStep = 1;
									var iStepAction = 1;
									var iEmployee;
									var iFilterEmployee;
									var iID = '';
									var sXHTMLElementID;
									var bShowAll = ns1blankspace.util.getParam(oParam, 'showAll', {"default": false}).value;

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
													'<td id="ns1blankspacePayrollEmployeeColumn1Container" class="ns1blankspaceColumn1" style="width:125px;padding-right:10px;">' +
													'<div id="ns1blankspacePayrollEmployeeColumn1" style="font-size:0.875em;"></div>' +
													'<div id="ns1blankspacePayrollEmployeeColumn1ShowAllContainer"></div>' +
													'</td>' +
													'<td id="ns1blankspacePayrollEmployeeColumn2" class="ns1blankspaceColumn2">' + 
													'<table class="ns1blankspaceColumn2"><tr><td class="ns1blankspaceSubNote">' +
													'Click New to add an employee' +
													'</td></tr></table>' +	
													'</td>' +
													'</tr>' + 
													'</table>');		
															
										$('#ns1blankspaceMainEmployee').html(aHTML.join(''));

										$('#ns1blankspacePayrollEmployeeColumn1').html(ns1blankspace.xhtml.loading);
										
										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
											oSearch.addField('contactpersontext,employmentstartdate,employmentenddate,statustext,employeenumber,employee.contactperson.firstname,employee.contactperson.surname,employee.taxfilenumber');
											
											if (!bShowAll)
											{	
												oSearch.addFilter('status', 'EQUAL_TO', '2')
											}	

											if (iFilterEmployee !== undefined)
											{
												oSearch.addFilter('id', 'EQUAL_TO', iFilterEmployee);
											}	

											oSearch.rows = 100;
											oSearch.sort('employeenumber', 'asc');
											oSearch.sort('employee.contactperson.firstname', 'asc');
											oSearch.getResults(function(data) {ns1blankspace.financial.payroll.employees.show(oParam, data)});
										}
										else
										{
											$('#ns1blankspacePayrollEmployeeColumn1ShowAllContainer').html(
												'<div class="ns1blankspaceSubNote" style="margin-top:12px; cursor:pointer;"' +
												' id="ns1blankspacePayrollEmployeeColumn1ShowAll">Show ' +
												(bShowAll?'only active':'all employees') +
												'</div>');
											
											var aHTML = [];

											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table><tr>' + 
														'<td class="ns1blankspaceNothing">There are no active employees.</td>' + 
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
												rows: 100,
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
												$.extend(true, oParam, {step: 2, employee: iFilterEmployee});
												ns1blankspace.financial.payroll.employees.show(oParam);
											}

											$('#ns1blankspacePayrollEmployeeColumn1ShowAll').click(function()
											{
												oParam.showAll = !bShowAll;
												oParam.step = 1;
												delete oParam.filterEmployee;
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
																'inductionprogram,medicalreport,medicalreportdate,programdate,registrationnumber,workerscompform,workhoursform,' +
																'employee.contactperson.firstname,employee.contactperson.surname,employee.contactperson.email,employee.contactperson.dateofbirth');
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
																	'Standard Pay</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-14" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Bank&nbsp;Accounts</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-15" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Superannuation</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-18" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Leave</td></tr>');

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
														'First name' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsFirstName" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Surname' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsSurname" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Email' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsEmail" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Date of Birth' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceDate">' +
														'<input id="ns1blankspaceDetailsDateOfBirth" class="ns1blankspaceDate">' +
														'</td></tr>');	

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
														'Employee Number' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsEmployeeNumber" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Start Date' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceDate">' +
														'<input id="ns1blankspaceDetailsStartDate" class="ns1blankspaceDate">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'End Date' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceDate">' +
														'<input id="ns1blankspaceDetailsEndDate" class="ns1blankspaceDate">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Notes' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceMultiSmall">' +
														'<textarea rows="20" cols="35" id="ns1blankspaceDetailsNotes" class="ns1blankspaceTextMulti" style="width:97%;"></textarea>' +
														'</td></tr>');
										
										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetails11Column1').html(aHTML.join(''));

										$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#ns1blankspaceDetailsFirstName').val(ns1blankspace.financial.employee["employee.contactperson.firstname"]);
											$('#ns1blankspaceDetailsSurname').val(ns1blankspace.financial.employee["employee.contactperson.surname"]);
											$('#ns1blankspaceDetailsEmail').val(ns1blankspace.financial.employee["employee.contactperson.email"]);
											$('#ns1blankspaceDetailsDateOfBirth').val(ns1blankspace.financial.employee["employee.contactperson.dateofbirth"]);
											$('[name="radioStatus"][value="' + ns1blankspace.financial.employee["status"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsNotes').val(ns1blankspace.financial.employee["notes"]);
											$('#ns1blankspaceDetailsStartDate').val(ns1blankspace.financial.employee["employmentstartdate"]);
											$('#ns1blankspaceDetailsEndDate').val(ns1blankspace.financial.employee["employmentenddate"]);
											$('#ns1blankspaceDetailsEmployeeNumber').val(ns1blankspace.financial.employee["employeenumber"]);
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

											var oData =
											{
												id: iEmployee,
												status: $('input[name="radioStatus"]:checked').val(),
												employmentstartdate: $('#ns1blankspaceDetailsStartDate').val(),
												employmentenddate: $('#ns1blankspaceDetailsEndDate').val(),
												employeenumber: $('#ns1blankspaceDetailsEmployeeNumber').val(),
												notes: $('#ns1blankspaceDetailsNotes').val()
											}	

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
												data: oData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{				
														var oData =
														{
															id: ns1blankspace.financial.employee.contactperson,
															firstname: $('#ns1blankspaceDetailsFirstName').val(),
															surname: $('#ns1blankspaceDetailsSurname').val(),
															email: $('#ns1blankspaceDetailsEmail').val(),
															dateofbirth: $('#ns1blankspaceDetailsDateOfBirth').val()
														}	

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('CONTACT_PERSON_MANAGE'),
															data: oData,
															dataType: 'json',
															success: function(data)
															{
																if (data.status == 'OK')
																{
																	ns1blankspace.status.message('Saved');
																	oParam.step = 2;
																	ns1blankspace.financial.payroll.employees.show(oParam);
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
														'Medicare' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioMedicare1" name="radioMedicare" value="1"/>Pay Medicare' +
														'<br /><input type="radio" id="radioMedicare2" name="radioMedicare" value="2"/>Full Exemption' +
														'<br /><input type="radio" id="radioMedicare3" name="radioMedicare" value="3"/>Half Exemption' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Tax File Number<br /><span class="ns1blankspaceSubNote">If left blank, tax will be calculated at the highest rate.</span>' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsTaxNumber" class="ns1blankspaceText">' +
														'</td></tr>');	

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Tax File Number Declaration Completed' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioTaxFileNumberDeclarationY" name="radioTaxFileNumberDeclaration" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioTaxFileNumberDeclarationN" name="radioTaxFileNumberDeclaration" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Tax Threshold' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioTaxFreeThresholdY" name="radioTaxFreeThreshold" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioTaxFreeThresholdN" name="radioTaxFreeThreshold" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Foreign Resident' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioForeignResidentY" name="radioForeignResident" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioForeignResidentN" name="radioForeignResident" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Leaving Loading Rate' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsLeaveLoadingRate" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Rebates Amount ($)' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsRebatesAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Special Tax Rate (%)' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsSpecialTaxRate" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption" style="padding-top:14px;">' +
														'ALLOWANCES' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Amount ($)<br /><span class="ns1blankspaceSubNote">Per Pay</span>' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsAllowanceAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Description' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsAllowanceDescription" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Include In Superannuation Contribution Calculation' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioAllowanceIncludeInSuperY" name="radioAllowanceIncludeInSuper" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioAllowanceIncludeInSuperN" name="radioAllowanceIncludeInSuper" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Taxable' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioAllowanceTaxableY" name="radioAllowanceTaxable" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioAllowanceTaxableN" name="radioAllowanceTaxable" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption" style="padding-top:14px;">' +
														'DEDUCATIONS' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Amount ($)<br /><span class="ns1blankspaceSubNote">Per Pay</span>' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsDeductionAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Description' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsDeductionDescription" class="ns1blankspaceText">' +
														'</td></tr>');

											aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Deduction for HELP<br /><span class="ns1blankspaceSubNote">Higher Education Loan Program</span>' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioDeductHELPY" name="radioDeductHELP" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioDeductHELPN" name="radioDeductHELP" value="N"/>No' +
														'</td></tr>');


										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption" style="padding-top:14px;">' +
														'TAX ADJUSTMENTS' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Amount ($)<br /><span class="ns1blankspaceSubNote">Per Pay</span>' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsTaxAdjustmentAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Description' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsTaxAdjustmentDescription" class="ns1blankspaceText">' +
														'</td></tr>');	

										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetails12Column1').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('[name="radioFrequency"][value="' + ns1blankspace.financial.employee["payfrequency"] + '"]').attr('checked', true);
											$('[name="radioMedicare"][value="' + ns1blankspace.financial.employee["medicare"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsTaxNumber').val(ns1blankspace.financial.employee["taxfilenumber"]);
											$('[name="radioTaxFileNumberDeclaration"][value="' + ns1blankspace.financial.employee["taxfilenumberdeclaration"] + '"]').attr('checked', true);
											$('[name="radioTaxFreeThreshold"][value="' + ns1blankspace.financial.employee["taxfreethreshold"] + '"]').attr('checked', true);
											$('[name="radioForeignResident"][value="' + ns1blankspace.financial.employee["foreignresident"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsLeaveLoadingRate').val(ns1blankspace.financial.employee["leaveloadingrate"]);
											$('#ns1blankspaceDetailsRebatesAmount').val(ns1blankspace.financial.employee["rebates"]);
											$('#ns1blankspaceDetailsSpecialTaxRate').val(ns1blankspace.financial.employee["specialtaxrate"]);

											$('#ns1blankspaceDetailsAllowanceAmount').val(ns1blankspace.financial.employee["allowance"]);
											$('#ns1blankspaceDetailsAllowanceDescription').val(ns1blankspace.financial.employee["allowancedescription"]);
											$('[name="radioAllowanceIncludeInSuper"][value="' + ns1blankspace.financial.employee["allowanceincludeinsuper"] + '"]').attr('checked', true);
											$('[name="radioAllowanceTaxable"][value="' + ns1blankspace.financial.employee["allowancetaxable"] + '"]').attr('checked', true);

											$('#ns1blankspaceDetailsDeductionAmount').val(ns1blankspace.financial.employee["deduction"]);
											$('#ns1blankspaceDetailsDeductionDescription').val(ns1blankspace.financial.employee["deductiondescription"]);
											$('[name="radioDeductHELP"][value="' + ns1blankspace.financial.employee["deducthelp"] + '"]').attr('checked', true);
											
											$('#ns1blankspaceDetailsTaxAdjustmentAmount').val(ns1blankspace.financial.employee["taxadjustment"]);
											$('#ns1blankspaceDetailsTaxAdjustmentDescription').val(ns1blankspace.financial.employee["taxadjustmentdescription"]);
										}
										else
										{
											$('[name="radioFrequency"][value="1"]').attr('checked', true);
											$('[name="radioMedicare"][value="1"]').attr('checked', true);
											$('[name="radioTaxFileNumberDeclaration"][value="N"]').attr('checked', true);
											$('[name="radioTaxFreeThreshold"][value="N"]').attr('checked', true);
											$('[name="radioForeignResident"][value="N"]').attr('checked', true);
											$('[name="radioAllowanceIncludeInSuper"][value="N"]').attr('checked', true);
											$('[name="radioAllowanceTaxable"][value="N"]').attr('checked', true);
											$('[name="radioDeductHELP"][value="N"]').attr('checked', true);
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
											sData += '&taxfilenumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTaxNumber').val());
											sData += '&taxfilenumberdeclaration=' + ns1blankspace.util.fs($('input[name="radioTaxFileNumberDeclaration"]:checked').val());
											sData += '&taxfreethreshold=' + ns1blankspace.util.fs($('input[name="radioTaxFreeThreshold"]:checked').val());
											sData += '&foreignresident=' + ns1blankspace.util.fs($('input[name="radioForeignResident"]:checked').val());
											sData += '&leaveloadingrate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsLeaveLoadingRate').val());
											sData += '&rebates=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsRebatesAmount').val());
											sData += '&specialtaxrate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSpecialTaxRate').val());

											sData += '&allowance=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsAllowanceAmount').val());
											sData += '&allowancedescription=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsAllowanceDescription').val());
											sData += '&allowanceincludeinsuper=' + ns1blankspace.util.fs($('input[name="radioAllowanceIncludeInSuper"]:checked').val());
											sData += '&allowancetaxable=' + ns1blankspace.util.fs($('input[name="radioAllowanceTaxable"]:checked').val());

											sData += '&deduction=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDeductionAmount').val());
											sData += '&deductiondescription=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDeductionDescription').val());
											sData += '&deducthelp=' + ns1blankspace.util.fs($('input[name="radioDeductHELP"]:checked').val());

											sData += '&taxadjustment=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTaxAdjustmentAmount').val());
											sData += '&taxadjustmentdescription=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTaxAdjustmentDescription').val());

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
														oParam.step = 2;
														ns1blankspace.financial.payroll.employees.show(oParam)
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

										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption">' +
														'EMPLOYER CONTRIBUTION' +
														'</td></tr>')

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Name' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsFundName" class="ns1blankspaceText">' +
														'</td></tr>');
											
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Member Number' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsFundMemberNumber" class="ns1blankspaceText">' +
														'</td></tr>');
								
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Manager<br /><span class="ns1blankspaceSubNote">A business contact used when creating the superannuation expenses. The default fund will be used if no alternate employee choice of fund.</span>' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceSelect">' +
														'<input id="ns1blankspacePayrollSuperannuationBusiness" class="ns1blankspaceSelect"' +
															' data-method="CONTACT_BUSINESS_SEARCH"' +
															' data-columns="tradename">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Superannuation %' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsEmployerSuperannuationRate" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption" style="padding-top:14px;">' +
														'SALARY SACRIFICE CONTRIBUTION' +
														'</td></tr>')

										//'<input type="radio" id="radioPreTaxSuperContributionType" name="radioPreTaxSuperContributionType" value=""/><i>Not Set</i><br />' +

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Type' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioPreTaxSuperContributionType1" name="radioPreTaxSuperContributionType" value="1"/>$ amount per pay' +
														'<br /><input type="radio" id="radioPreTaxSuperContributionType2" name="radioPreTaxSuperContributionType" value="2"/>Percentage of pay' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'$ Amount or %' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsPreTaxSuperContributionAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Name' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsPreTaxSuperFundName" class="ns1blankspaceText">' +
														'</td></tr>');
											
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Member Number' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsPreTaxSuperFundMemberNumber" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Manager<br /><span class="ns1blankspaceSubNote">A business contact used when creating the superannuation expenses. The default fund will be used if no alternate employee choice of fund.</span>' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceSelect">' +
														'<input id="ns1blankspacePayrollPreTaxSuperContributionBusiness" class="ns1blankspaceSelect"' +
															' data-method="CONTACT_BUSINESS_SEARCH"' +
															' data-columns="tradename">' +
														'</td></tr>');

										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption" style="padding-top:14px;">' +
														'EMPLOYEE VOLUNTARY CONTRIBUTION' +
														'</td></tr>');

										//'<input type="radio" id="radioPostTaxSuperContributionType" name="radioPostTaxSuperContributionType" value=""/><i>Not Set</i><br />' +

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Type' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioPostTaxSuperContributionType1" name="radioPostTaxSuperContributionType" value="1"/>$ amount per pay' +
														'<br /><input type="radio" id="radioPostTaxSuperContributionType2" name="radioPostTaxSuperContributionType" value="2"/>Percentage of pay' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'$ Amount or %' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsPostTaxSuperContributionAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Name' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsPostTaxSuperFundName" class="ns1blankspaceText">' +
														'</td></tr>');
											
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Member Number' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsPostTaxSuperFundMemberNumber" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Manager<br /><span class="ns1blankspaceSubNote">A business contact used when creating the superannuation expenses. The default fund will be used if no alternate employee choice of fund.</span>' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceSelect">' +
														'<input id="ns1blankspacePayrollPostTaxSuperContributionBusiness" class="ns1blankspaceSelect"' +
															' data-method="CONTACT_BUSINESS_SEARCH"' +
															' data-columns="tradename">' +
														'</td></tr>');																	

										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetails15Column1').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#ns1blankspaceDetailsFundName').val(ns1blankspace.financial.employee["superfundname"]);
											$('#ns1blankspaceDetailsFundMemberNumber').val(ns1blankspace.financial.employee["supermembernumber"]);
											$('#ns1blankspaceDetailsEmployerSuperannuationRate').val(ns1blankspace.financial.employee["superannuationrate"]);	
											$('#ns1blankspacePayrollSuperannuationBusiness').attr('data-id', ns1blankspace.financial.employee["supercontactbusiness"]);
											$('#ns1blankspacePayrollSuperannuationBusiness').val(ns1blankspace.financial.employee["supercontactbusinesstext"]);

											$('[name="radioPreTaxSuperContributionType"][value="' + ns1blankspace.financial.employee["pretaxsupertype"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsPreTaxSuperContributionAmount').val(ns1blankspace.financial.employee["pretaxsuperamount"]);
											$('#ns1blankspacePayrollPreTaxSuperContributionBusiness').attr('data-id', ns1blankspace.financial.employee["pretaxsupercontactbusiness"]);
											$('#ns1blankspacePayrollPreTaxSuperContributionBusiness').val(ns1blankspace.financial.employee["pretaxsupercontactbusinesstext"]);
											$('#ns1blankspaceDetailsPreTaxSuperFundName').val(ns1blankspace.financial.employee["pretaxsuperfundname"]);
											$('#ns1blankspaceDetailsPreTaxSuperFundMemberNumber').val(ns1blankspace.financial.employee["pretaxsupermembernumber"]);
											
											$('[name="radioPostTaxSuperContributionType"][value="' + ns1blankspace.financial.employee["posttaxsupertype"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsPostTaxSuperContributionAmount').val(ns1blankspace.financial.employee["posttaxsuperamount"]);
											$('#ns1blankspacePayrollPostTaxSuperContributionBusiness').attr('data-id', ns1blankspace.financial.employee["posttaxsupercontactbusiness"]);
											$('#ns1blankspacePayrollPostTaxSuperContributionBusiness').val(ns1blankspace.financial.employee["posttaxsupercontactbusinesstext"]);
											$('#ns1blankspaceDetailsPostTaxSuperFundName').val(ns1blankspace.financial.employee["posttaxsuperfundname"]);
											$('#ns1blankspaceDetailsPostTaxSuperFundMemberNumber').val(ns1blankspace.financial.employee["posttaxsupermembernumber"]);
										}
										else
										{
											$('[name="radioSuperContributionType"][value="1"]').attr('checked', true);
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
											
											sData += '&superfundname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFundName').val());
											sData += '&supermembernumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFundMemberNumber').val());
											sData += '&superannuationrate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEmployerSuperannuationRate').val());
											sData += '&supercontactbusiness=' + ns1blankspace.util.fs($('#ns1blankspacePayrollSuperannuationBusiness').attr('data-id'));

											sData += '&pretaxsuperfundname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPreTaxSuperFundName').val());
											sData += '&pretaxsupermembernumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPreTaxSuperFundMemberNumber').val());
											sData += '&pretaxsupertype=' + ns1blankspace.util.fs($('input[name="radioPreTaxSuperContributionType"]:checked').val());
											sData += '&pretaxsuperamount=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPreTaxSuperContributionAmount').val());
											sData += '&pretaxsupercontactbusiness=' + ns1blankspace.util.fs($('#ns1blankspacePayrollPreTaxSuperContributionBusiness').attr('data-id'));

											sData += '&posttaxsuperfundname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPostTaxSuperFundName').val());
											sData += '&posttaxsupermembernumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPostTaxSuperFundMemberNumber').val());
											sData += '&posttaxsupertype=' + ns1blankspace.util.fs($('input[name="radioPostTaxSuperContributionType"]:checked').val());
											sData += '&posttaxsuperamount=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPostTaxSuperContributionAmount').val());
											sData += '&posttaxsupercontactbusiness=' + ns1blankspace.util.fs($('#ns1blankspacePayrollPostTaxSuperContributionBusiness').attr('data-id'));

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
														oParam.step = 2
														ns1blankspace.financial.payroll.employees.show(oParam);
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

									//LEAVE
									if (iStep == 18)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspacePayrollEmployeeDetails18Column1" style="font-size:0.875em;">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspacePayrollEmployeeDetails18Column2" style="width:75px;">' +
														'</td>' +
														'</tr>' + 
														'</table>');	

										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Annual Leave<br /><span class="ns1blankspaceSubNote">Hours Per Pay</span>' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsAnnualLeaveEntitlement" class="ns1blankspaceText">' +
														'</td></tr>');
											
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Long Service Leave<br /><span class="ns1blankspaceSubNote">Hours Per Pay</span>' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsLongServiceEntitlement" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Sick Leave<br /><span class="ns1blankspaceSubNote">Hours Per Pay</span>' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsSickLeaveEntitlement" class="ns1blankspaceText">' +
														'</td></tr>');
															
										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetails18Column1').html(aHTML.join(''));

										$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#ns1blankspaceDetailsAnnualLeaveEntitlement').val(ns1blankspace.financial.employee["annualleaveentitlement"]);
											$('#ns1blankspaceDetailsLongServiceEntitlement').val(ns1blankspace.financial.employee["longserviceentitlement"]);
											$('#ns1blankspaceDetailsSickLeaveEntitlement').val(ns1blankspace.financial.employee["sickleaveentitlement"]);
										}

										var aHTML = [];
						
										aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>' +
														'<span id="ns1blankspacePayrollEmployee_options_save" class="ns1blankspaceAction">' +
														'Save</span></td></tr></table>');					
										
										$('#ns1blankspacePayrollEmployeeDetails18Column2').html(aHTML.join(''));

										$('#ns1blankspacePayrollEmployee_options_save').button(
										{
											text: "Save"
										})
										.click(function()
										{
											ns1blankspace.status.working();

											var sData = 'id=' + ns1blankspace.util.fs(iEmployee);							
											sData += '&annualleaveentitlement=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsAnnualLeaveEntitlement').val());
											sData += '&longserviceentitlement=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsLongServiceEntitlement').val());
											sData += '&sickleaveentitlement=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSickLeaveEntitlement').val());
											
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
														ns1blankspace.status.message('Leave saved');
														oParam.step = 2;
														ns1blankspace.financial.payroll.employees.show(oParam);
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
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsJobDescription" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');
										
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Reports To' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsInternalRelationships" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'KPIs' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsKPI" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Responsibilities' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsResponsibilities" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');


										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Must Do Tasks' +
														'</td></tr>' +
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
														oParam.step = 2;
														ns1blankspace.financial.payroll.employees.show(oParam);
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
														'<tr><td class=""ns1blankspaceText">' +
														'<input type="radio" id="radioWorkersCompensationY" name="radioWorkersCompensation" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioWorkersCompensationN" name="radioWorkersCompensation" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Work Contract Completed' +
														'</td></tr>' +
														'<tr><td class=""ns1blankspaceText">' +
														'<input type="radio" id="radioWorkHoursContractY" name="radioWorkHoursContract" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioWorkHoursContractN" name="radioWorkHoursContract" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Medical Report Received' +
														'</td></tr>' +
														'<tr><td class=""ns1blankspaceText">' +
														'<input type="radio" id="radioMedicalReportY" name="radioMedicalReport" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioMedicalReportN" name="radioMedicalReport" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption" style="padding-top:14px;">' +
														'WORKING WITH CHILDREN (SUITABILITY) CHECK' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Certificate / Copy of Suitability Card Received' +
														'</td></tr>' +
														'<tr><td class=""ns1blankspaceText">' +
														'<input type="radio" id="radioSuitabilityCopyReceivedY" name="radioSuitabilityCopyReceived" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioSuitabilityCopyReceivedN" name="radioSuitabilityCopyReceived" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Registration Number' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsRegistrationNumber" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Expiry Date' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceDate">' +
														'<input id="ns1blankspaceSuitabilityDate" class="ns1blankspaceDate">' +
														'</td></tr>');

															
										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetails17Column1').html(aHTML.join(''));

										$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#ns1blankspaceDetailsInductionDate').val(ns1blankspace.financial.employee["programdate"]);
											$('[name="radioWorkersCompensation"][value="' + ns1blankspace.financial.employee["workerscompform"] + '"]').attr('checked', true);
											$('[name="radioWorkHoursContract"][value="' + ns1blankspace.financial.employee["workhoursform"] + '"]').attr('checked', true);
											$('[name="radioMedicalReport"][value="' + ns1blankspace.financial.employee["medicalreport"] + '"]').attr('checked', true);
											$('[name="radioSuitabilityCopyReceived"][value="' + ns1blankspace.financial.employee["copyreceived"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsRegistrationNumber').val(ns1blankspace.financial.employee["registrationnumber"]);
											$('#ns1blankspaceSuitabilityDate').val(ns1blankspace.financial.employee["expirydate"]);
										}
										else
										{
											$('[name="radioWorkersCompensation"][value="N"]').attr('checked', true);
											$('[name="radioWorkHoursContract"][value="N"]').attr('checked', true);
											$('[name="radioMedicalReport"][value="N"]').attr('checked', true);
											$('[name="radioSuitabilityCopyReceived"][value="N"]').attr('checked', true);
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
											sData += '&workhoursform=' + ns1blankspace.util.fs($('input[name="radioWorkHoursContract"]:checked').val());
											sData += '&medicalreport=' + ns1blankspace.util.fs($('input[name="radioMedicalReport"]:checked').val());		
											sData += '&copyreceived=' + ns1blankspace.util.fs($('input[name="radioSuitabilityCopyReceived"]:checked').val());	
											sData += '&registrationnumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsRegistrationNumber').val());
											sData += '&expirydate=' + ns1blankspace.util.fs($('#ns1blankspaceSuitabilityDate').val());
									
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
														oParam.step = 2;
														ns1blankspace.financial.payroll.employees.show(oParam);
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

									if (iStep == 18)
									{
										var sSearch = ns1blankspace.util.getParam(oParam, 'searchText', {"default": ''}).value;
										var bAll = ns1blankspace.util.getParam(oParam, 'all', {"default": false}).value;

										var aData = $.grep(ns1blankspace.financial.payroll.data.linetypes, function (type)
										{ 
											var aIncludeIn = ns1blankspace.financial.payroll.util.linetypes.includeIn({id: type.id});
											var bInclude = ($.grep(aIncludeIn, function (include) {return !include.selectable}).length == 0)

											if (bInclude && sSearch != '' && !bAll) {bInclude = ((type.title).toLowerCase().indexOf(sSearch.toLowerCase()) != -1)}

											return bInclude
										});
										
										$vq.clear({queue: 'type'});

										if (aData.length == 0)
										{
											$vq.add('<table class="ns1blankspace">' +
															'<tr><td class="ns1blankspaceSubNote">No pay types.</td></tr>' + 
															'</table>', {queue: 'type'});

											$vq.render('#ns1blankspacePayrollEmployeeDetailsPayRateLineTypeSearchResults', {queue: 'type'});		
										}
										else
										{	
											$vq.add('<table class="ns1blankspace">', {queue: 'type'});
											
											$.each(aData, function(d, data) 
											{ 
												$vq.add('<tr class="ns1blankspaceRow">'+ 
																'<td id="ns1blankspaceTypeem_title-' + data.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																data.title + '</td></tr>', {queue: 'type'});	
											});
											
											$vq.add('</table>');

											$vq.render('#ns1blankspacePayrollEmployeeDetailsPayRateLineTypeSearchResults', {queue: 'type'});
											
											$('.ns1blankspaceRowSelect')
											.click(function()
											{
												var sID = this.id;
												var aID = sID.split('-');

												$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').attr('data-id', aID[1]);
												$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').val($(this).html());
												$('#ns1blankspacePayrollEmployeeDetailsPayRateLineTypeSearchResults').html('');

												ns1blankspace.financial.payroll.util.linetypes.showHide({lineType: aID[1]});
											});
										}
									}

									//STANDARD PAY
									if (iStep == 13)
									{
										if (iStepAction == 4)
										{
											if (confirm('Click OK to delete this standard pay.'))
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
										}
										else
										{
											if ((iStepAction == 1 || iStepAction == 2) && (oResponse == undefined))
											{
												$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(ns1blankspace.xhtml.loadingSmall);

												var oSearch = new AdvancedSearch();
												oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_PAYRATE_SEARCH';		
												oSearch.addField('employmenttype,employmenttypetext,enddate,notes,rate,startdate,linetype,linetypetext,units');

												if (iStepAction == 1)
												{	
													oSearch.addFilter('employee', 'EQUAL_TO', iEmployee)
													oSearch.rows = 50;
													oSearch.sort('startdate', 'desc');
												}
												else
												{
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
																'<td id="ns1blankspacePayrollEmployeeDetailsPayRateColumn2" style="width:0px;">' +
																'</td>' +
																'</tr>' + 
																'</table>');				
											
												$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));
											
												var aHTML = [];
												var sAmount;

												if (iStepAction == 1)
												{
													var aHTML = [];

													if (oResponse.data.rows.length == 0)
													{
														aHTML.push('<table class="ns1blankspaceColumn2">' +
																		'<tr><td><span id="ns1blankspacePayrollEmployee_options_add" class="ns1blankspaceAction">' +
																			'</span></td></tr>' + 
																		'</table>');

														$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));
													}
													else
													{	
														aHTML.push('<table class="ns1blankspaceColumn2">');
														aHTML.push('<tr class="ns1blankspaceCaption">');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">Start Date</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">End Date</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:left;">Type</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:left; width:100px;">' +
															ns1blankspace.financial.payroll.data.payPeriods[ns1blankspace.financial.data.settings.payrollpayperiod] +
															' Amount</td>');
																
														aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:30px;text-align:right;"><span id="ns1blankspacePayrollEmployee_options_add" class="ns1blankspaceAction"></span></td>');
														aHTML.push('</tr>');

														$(oResponse.data.rows).each(function() 
														{
															aHTML.push('<tr class="ns1blankspaceRow">');
																			
															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPayRate_startdate-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetailsPayRate">' +
																			this.startdate + '</td>');

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPayRate_enddate-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsPayRate">' +
																			this.enddate + '</td>');

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPayRate_type-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsPayRate" style="text-align:left;">' +
																			this.linetypetext + '</td>');

															//var oLineType = ns1blankspace.financial.payroll.util.linetypes.get({title: this.linetypetext});

															var aIncludeIn = ns1blankspace.financial.payroll.util.linetypes.includeIn({id: this.linetype});
															var oIncludeIn = $.grep(aIncludeIn, function (i) {return !i.dependant})[0];

															var bHours = (oIncludeIn!==undefined?$.grep(aIncludeIn, function (i) {return !i.dependant})[0].hours:false);
											
															if (bHours)
															{	
																sAmount = this.units + ' hours @ ' + ns1blankspace.option.currencySymbol + this.rate + '/hour';
															}
															else
															{
																sAmount = ns1blankspace.option.currencySymbol + this.rate;
															}	

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPayRate_amount-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsPayRate" style="text-align:left;">' +
																			sAmount + '</td>');

															aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
																			'<span id="ns1blankspacePayrollEmployeeDetailsPayRate_options_remove-' + this.id + '" class="ns1blankspacePayrollEmployeeDetailsPayRateRemove"></span></td>');
										
															aHTML.push('</tr>');
														});
														
														aHTML.push('</table>');
													}
													
													$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));

													$('#ns1blankspacePayrollEmployee_options_add').button(
													{
														text: false,
														icons:
														{
															primary: "ui-icon-plus"
														}
													})
													.click(function()
													{
														$.extend(true, oParam, {stepAction: 3, xhtmlElementID: "", id: ""});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
													.css('width', '15px')
													.css('height', '17px');

													$('.ns1blankspacePayrollEmployeeDetailsPayRateRemove').button(
													{
														text: false,
														icons: {
															primary: "ui-icon-close"
														}
													})
													.click(function()
													{
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
																	'<tr><td class="ns1blankspaceText">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateStartDate" class="ns1blankspaceDate">' +
																	'</td></tr>');	

													aHTML.push('<tr><td class="ns1blankspaceCaption">End Date</td></tr>' +
																	'<tr><td class="ns1blankspaceText">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateEndDate" class="ns1blankspaceDate">' +
																	'</td></tr>');

													var aNotSelectable = $.map($.grep(ns1blankspace.financial.payroll.data.linetypes, function (type) {return !type.selectable}), function (type) {return type.id});

													aHTML.push('<tr class="ns1blankspaceCaption">' +
																	'<td class="ns1blankspaceCaption">' +
																	'Type' +
																	'</td></tr>' +
																	'<tr>' +
																	'<td class="ns1blankspaceSelect">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateLineType" class="ns1blankspaceText">' +
																	'</td></tr>');

													aHTML.push('<tr><td style="padding-bottom:5px;" id="ns1blankspacePayrollEmployeeDetailsPayRateLineTypeSearchResults">' +
																		'<span class="ns1blankspaceSub" style="font-size:0.75em;">Press <i>enter</i> to see all pay types<br />or just start typing.</span></td></tr>');

													aHTML.push('<tr><td class="ns1blankspaceCaption includein includeinhoursY">' +
																	ns1blankspace.financial.payroll.data.payPeriods[ns1blankspace.financial.data.settings.payrollpayperiod] +
																	' Hours</td></tr>' +
																	'<tr><td class="includein includeinhoursY ns1blankspaceText">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateUnits" class="ns1blankspaceText">' +
																	'</td></tr>');	

													aHTML.push('<tr><td class="ns1blankspaceCaption includein includeinhoursY">' +
																	ns1blankspace.option.currencySymbol +
																	'/Hour</td></tr>' +
																	'<tr><td class="ns1blankspaceCaption includein includeinhoursN">' +
																	ns1blankspace.option.currencySymbol +
																	'</td></tr>' +
																	'<tr><td class="ns1blankspaceText">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateAmount" class="ns1blankspaceText">' +
																	'</td></tr>');

													aHTML.push('</table>');

													$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));

													$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').keyup(function(e)
													{
														$.extend(true, oParam, {step: 18, searchText: $(this).val(), all: (e.which === 13)});
														ns1blankspace.financial.payroll.employees.show(oParam)
													});

													var aHTML = [];
												
													aHTML.push('<table class="ns1blankspaceColumn2" style="font-size:0.875em">' +
																	'<tr><td>' +
																	'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsPayRate_options_save" class="ns1blankspaceAction">Save</span>' +
																	'</td></tr>' +
																	'<tr><td>' +
																	'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsPayRate_options_cancel" class="ns1blankspaceAction">Cancel</span>' +
																	'</td></tr>' +
																	'</table>');

													aHTML.push('<table class="ns1blankspaceColumn2 includein includeinhoursY" style="font-size:0.75em; background-color:#F3F3F3; margin-top:25px; border:0px; padding-left:5px;">' +
																	'<tr><td class="ns1blankspaceCaption" style="padding-top:8px;">' +
																	'Calculate<br />hourly rate..' +
																	'</td></tr>' +
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

													$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

													$('#ns1blankspacePayrollEmployeeDetailsPayRateStartDate').val(Date.today().toString("dd MMM yyyy"));

													$('.includein').hide();

													var oLineType = ns1blankspace.financial.payroll.util.linetypes.get({title: 'Normal'});

													if (oLineType != undefined)
													{	
														$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').attr('data-id', oLineType.id);
														$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').val(oLineType.title);
														$('.includeinhoursY').show();
													}	

													$('#ns1blankspacePayrollEmployeeDetailsPayRateAnnualAmount, #ns1blankspacePayrollEmployeeDetailsPayRateHoursPerWeek').keyup(function ()
													{
														var cAnnual = $('#ns1blankspacePayrollEmployeeDetailsPayRateAnnualAmount').val();
														var cHoursWeek = $('#ns1blankspacePayrollEmployeeDetailsPayRateHoursPerWeek').val();

														if (cHoursWeek == '') {cHoursWeek = 0}

														if (cHoursWeek != 0)
														{
															$('#ns1blankspacePayrollEmployeeDetailsPayRateUnits').val(cHoursWeek);
															$('#ns1blankspacePayrollEmployeeDetailsPayRateAmount').val(ns1blankspace.util.toFixed(cAnnual / (52 * cHoursWeek)));
														}	
													});

													$('#ns1blankspacePayrollEmployeeDetailsPayRate_options_save').button(
													{
														text: "Save"
													})
													.click(function() 
													{
														ns1blankspace.status.working();

														var oData = {id: iID, units: 1};
														if (iID == '')
														{
															oData.employee = iEmployee;
														}	
														oData.startdate = $('#ns1blankspacePayrollEmployeeDetailsPayRateStartDate').val();
														oData.enddate = $('#ns1blankspacePayrollEmployeeDetailsPayRateEndDate').val();
														oData.linetype = $('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').attr('data-id');

														oData.rate = $('#ns1blankspacePayrollEmployeeDetailsPayRateAmount').val();
													
														if ($('#ns1blankspacePayrollEmployeeDetailsPayRateUnits').is(':visible'))
														{	
															oData.units = $('#ns1blankspacePayrollEmployeeDetailsPayRateUnits').val();
															if (oData.units == '') {oData.units = 0}
														}

														if (oData.rate == '') {oData.rate = 0}

														if (oData.linetype == '' || oData.startdate == '')
														{
															ns1blankspace.status.error('Start Date or Type missing')
														}
														else
														{
															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_PAYRATE_MANAGE'),
																data: oData,
																dataType: 'json',
																success: function(data) {
																	if (data.status == "OK")
																	{
																		ns1blankspace.status.message('Saved');
																		$.extend(true, oParam, {step: 13});
																		$.extend(true, oParam, {stepAction: 1, id: ''});
																		ns1blankspace.financial.payroll.employees.show(oParam);
																	}
																	else
																	{
																		ns1blankspace.status.error(data.error.errornotes);
																	}
																}
															});
														}	
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
															$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').attr('data-id', oObjectContext.linetype);
															$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').val(oObjectContext.linetypetext);
															$('#ns1blankspacePayrollEmployeeDetailsPayRateUnits').val(oObjectContext.units);

															ns1blankspace.financial.payroll.util.linetypes.showHide({lineType: oObjectContext.linetype});
														}
														else
														{
															var oLineType = ns1blankspace.financial.payroll.util.linetypes.get({title: 'Normal'});

															if (oLineType != undefined)
															{	
																$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').attr('data-id', oLineType.id);
																$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').val(oLineType.title);

																ns1blankspace.financial.payroll.util.linetypes.showHide({lineType: oLineType.id});
															}	
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

										if (oRow["employeenumber"] != '' || oRow["statustext"] != '')
										{
											aHTML.push('<br />');

											if (oRow["employeenumber"] != '')
											{
												aHTML.push('<span class="ns1blankspaceSub">' + oRow["employeenumber"]);
											}

											if (oRow["statustext"] != '')
											{
												if (oRow["employeenumber"] != '')
												{
													aHTML.push(', ')
												}

												aHTML.push('<span class="ns1blankspaceSub">' + oRow["statustext"]);
											}
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
						
							$('#ns1blankspacePayrollPayColumn1').html(ns1blankspace.xhtml.loading);

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
							oSearch.addField('payrecord.employee.contactperson,payrecord.employee.employeenumber,payrecord.employee.contactperson.firstname,payrecord.employee.contactperson.surname,payrecord.employee.taxfilenumber');
							oSearch.addFilter('period', 'EQUAL_TO', ns1blankspace.objectContext)
							oSearch.rows = 200;
							oSearch.sort('payrecord.employee.employeenumber', 'asc');
							oSearch.sort('payrecord.employee.contactperson.firstname', 'asc');
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

									if (this["payrecord.employee.employeenumber"] != '...' && this["payrecord.employee.employeenumber"] != '')
									{
										aHTML.push('<br /><span class="ns1blankspaceSub">' + this["payrecord.employee.employeenumber"] + '</span>');
									}

									if (this["payrecord.employee.taxfilenumber"] == '')
									{
										aHTML.push('<br /><span class="ns1blankspaceSub">No tax file number, so taxed at highest rate.</span>');
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
							oSearch.addField('grosssalary,calculations,netsalary,deductions,superannuation,calculations,taxbeforerebate,notes,' +
													'payrecord.employee.contactperson,hecs,leaveloading,posttaxsuper,pretaxsuper,rebate,studentloandeduction,taxadjustments,taxafterrebate,taxbeforerebate,payrecord.employee.superannuationrate');
							oSearch.rows = 1;
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)})	
						}
						else
						{
							ns1blankspace.objectContextData.pay = oResponse.data.rows[0];

							$.extend(true, oParam, {step: 3});
							ns1blankspace.financial.payroll.pays(oParam);

							var aHTML = [];
							
							if (oResponse.data.rows.length != 0)
							{
								var oRow = oResponse.data.rows[0];

								aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:10px;">');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">Gross</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["grosssalary"] +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">Tax</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["taxbeforerebate"] +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">Net</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["netsalary"] +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">Superannuation</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["superannuation"] +
												'</td></tr>');

								aHTML.push('<tr><td colspan=2 class="ns1blankspaceCaption" style="font-size:0.875em;">' +
												 'Note</td></tr>');

								aHTML.push('<tr><td colspan=2 id="ns1blankspaceFinancialPayrollPayNoteContainer" style="display:table-cell; text-align:right; border-width:0px;" class="ns1blankspaceRow">' +
												'<textarea rows="10" cols="35" id="ns1blankspaceFinancialPayrollPayNote" class="ns1blankspaceTextMulti"'+
												' style="width:100%; height:100px;">' + oRow["notes"] + '</textarea>' +
												'</td></tr>');	
											
								aHTML.push('<tr><td colspan=2 class="ns1blankspaceSubNote ns1blankspaceRowSelect" id="ns1blankspaceFinancialPayrollShowCalcs">Show Calculations</td></tr>');

								aHTML.push('<tr><td colspan=2 id="ns1blankspaceFinancialPayrollCalcsContainer" class="ns1blankspaceSub" style="color:#444444;"></td></tr>');

								aHTML.push('<tr><td colspan=2 class="ns1blankspaceSubNote ns1blankspaceRowSelect" id="ns1blankspaceFinancialPayrollRecalculate">Recalculate</td></tr>');

								aHTML.push('<tr><td colspan=2 class="ns1blankspaceSubNote" style="padding-top:8px;">' +
									'Employee current superannuation rate is ' + oRow["payrecord.employee.superannuationrate"] + '%.' +
									'</td></tr>');

								aHTML.push('</table>');																
							}
								
							$('#ns1blankspacePayrollPayRunColumn1').html(aHTML.join(''));

							$('#ns1blankspaceFinancialPayrollPayNote').keyup(function()
							{
								ns1blankspace.financial.payroll.data.itemNotes = $('#ns1blankspaceFinancialPayrollPayNote').val()
							});

							$('#ns1blankspaceFinancialPayrollPayNote').focusout(function()
							{
								var oData =
								{
									id: ns1blankspace.objectContextData.pay.id,
									notes: ns1blankspace.financial.payroll.data.itemNotes
								}

								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_RECORD_MANAGE'),
									data: oData,
									dataType: 'json',
									success: function(data)
									{
										if (data.status != 'OK')
										{
											ns1blankspace.status.message('Note could not be saved.');
										}	
									}
								});	
							});

							$('#ns1blankspaceFinancialPayrollShowCalcs').click(function ()
							{
								$('#ns1blankspaceFinancialPayrollShowCalcs').hide();

								var oSearch = new AdvancedSearch();
								oSearch.method = 'FINANCIAL_PAYROLL_PAY_PROCESS_LOG_SEARCH';
								oSearch.addField('notes');
								oSearch.addFilter('payrecord', 'EQUAL_TO', ns1blankspace.objectContextData.pay.id);
								oSearch.rows = 100;
								
								oSearch.getResults(function(oResponse)
								{
									var sHTML;

									if (oResponse.data.rows.length == 0)
									{	
										sHTML = 'No calculations';
									}
									else
									{
										sHTML = $.map(oResponse.data.rows, function (log)
										{
											var sReturn;

											if (log.notes.indexOf('Scale:') == -1)
											{
												sReturn = '<div class="ns1blankspaceSubNote" style="padding-top:6px; color:#444444;">' + log.notes + '</div>';
											}
											else
											{
												sReturn = $.map(log.notes.split(','), function (scale) {return '<div class="ns1blankspaceSubNote" style="padding-top:6px; color:#444444;">' + scale + '</div>'});
											}

											return sReturn
										});
									}

									$('#ns1blankspaceFinancialPayrollCalcsContainer').html(sHTML);
								});
							});

							$('#ns1blankspaceFinancialPayrollRecalculate').click(function ()
							{
								ns1blankspace.status.working('Recalculating')
			
								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_PROCESS'),
									data: 'type=4&record=' + ns1blankspace.objectContextData.pay.id,
									dataType: 'json',
									success: function(data)
									{
										ns1blankspace.status.message('Updated');
										$.extend(true, oParam, {step: 2});
										ns1blankspace.financial.payroll.pays(oParam);
									}
								});
							});
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
								label: "Show Salary Expense"
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
							oSearch.addField('type,typetext,hours,rate,total,includeinsuper,manuallyupdated,notes,standardline,standardlinetext,taxable');
							oSearch.addFilter('record', 'EQUAL_TO', iPay);
							oSearch.rows = 100;
							oSearch.sort('typetext', 'asc')
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)})	
						}
						else
						{
							var sClass = (ns1blankspace.objectContextData.status == 2?'':' ns1blankspaceRowSelect');

							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceFinancialPayrollItem" class="ns1blankspaceColumn2">');
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<tr><td class="ns1blankspaceNothing">No items.</td></tr></table>');
							}
							else
							{		
								$(oResponse.data.rows).each(function(i, item)
								{
									aHTML.push('<tr class="ns1blankspaceRow">');
										
									aHTML.push('<td id="ns1blankspaceFinancialPayPeriodItem_type-' + item.id + '" class="ns1blankspaceRow' + sClass + '">' +
															item.typetext + '</td>');

									var aIncludeIn = ns1blankspace.financial.payroll.util.linetypes.includeIn({id: item.type});
									var oIncludeIn = $.grep(aIncludeIn, function (i) {return !i.dependant})[0];

									var bHours = (oIncludeIn!==undefined?$.grep(aIncludeIn, function (i) {return !i.dependant})[0].hours:false);
									var cAmount = numeral((bHours?item.hours:item.rate)).value();
									
									if (bHours)
									{
										aHTML.push('<td id="ns1blankspaceFinancialPayPeriodItem_amount-' + item.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
															numeral(cAmount).format('(0,0.00)') + 
															'<br /><span class="ns1blankspaceSubNote">' + (bHours?'hours&nbsp;@&nbsp;' + ns1blankspace.option.currencySymbol + 
															numeral(item.rate).format('(0,0.00)'):ns1blankspace.option.currencySymbol) + '</span>' +
															'<br /><span class="ns1blankspaceSubNote">' + ns1blankspace.option.currencySymbol +
															numeral(item.total).format('(0,0.00)') + '</span></td>');
									}
									else
									{
										aHTML.push('<td id="ns1blankspaceFinancialPayPeriodItem_amount-' + item.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
															numeral(cAmount).format('(0,0.00)') +
															'<br /><span class="ns1blankspaceSubNote">' + ns1blankspace.option.currencySymbol + 
																numeral(item.total).format('(0,0.00)') + '</span> ' + 
															'</td>');					 			
									}

									if (ns1blankspace.objectContextData.status == "1")
									{
										aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspaceFinancialPay_remove-' + item.id + '" class="ns1blankspaceRowRemove"></span></td>');
									}							
																												
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

					else if (iStep == 13)
					{
						var sSearch = ns1blankspace.util.getParam(oParam, 'searchText', {"default": ''}).value;
						var bAll = ns1blankspace.util.getParam(oParam, 'all', {"default": false}).value;

						var aData = $.grep(ns1blankspace.financial.payroll.data.linetypes, function (type)
						{ 
							var aIncludeIn = ns1blankspace.financial.payroll.util.linetypes.includeIn({id: type.id});
							var bInclude = ($.grep(aIncludeIn, function (include) {return !include.selectable}).length == 0)

							if (bInclude && sSearch != '' && !bAll) {bInclude = ((type.title).toLowerCase().indexOf(sSearch.toLowerCase()) != -1)}

							return bInclude
						});
						
						$vq.clear({queue: 'type'});

						if (aData.length == 0)
						{
							$vq.add('<table class="ns1blankspace">' +
											'<tr><td class="ns1blankspaceSubNote">No pay types.</td></tr>' + 
											'</table>', {queue: 'type'});

							$vq.render('#ns1blankspacePayrollItemTypeSearchResults', {queue: 'type'});		
						}
						else
						{	
							$vq.add('<table class="ns1blankspace">', {queue: 'type'});
							
							$.each(aData, function(d, data) 
							{ 
								$vq.add('<tr class="ns1blankspaceRow">'+ 
												'<td id="ns1blankspaceTypeem_title-' + data.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
												data.title + '</td></tr>', {queue: 'type'});	
							});
							
							$vq.add('</table>');

							$vq.render('#ns1blankspacePayrollItemTypeSearchResults', {queue: 'type'});
							
							$('.ns1blankspaceRowSelect')
							.click(function()
							{
								var sID = this.id;
								var aID = sID.split('-');

								$('#ns1blankspacePayrollItemType').attr('data-id', aID[1]);
								$('#ns1blankspacePayrollItemType').val($(this).html());
								$('#ns1blankspacePayrollItemTypeSearchResults').html('');

								ns1blankspace.financial.payroll.util.linetypes.showHide({lineType: aID[1]});
							});
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
									
						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Type' +
										'</td></tr>' +
										'<tr>' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspacePayrollItemType" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-bottom:5px;" id="ns1blankspacePayrollItemTypeSearchResults">' +
										'<span class="ns1blankspaceSub" style="font-size:0.75em;">Press <i>enter</i> to see all pay types<br />or just start typing.</span></td></tr>');
													
						aHTML.push('<tr><td class="ns1blankspaceCaption includein includeinhoursY">' +
										ns1blankspace.financial.payroll.data.payPeriods[ns1blankspace.financial.data.settings.payrollpayperiod] +
										' Hours</td></tr>' +
										'<tr><td class="includein includeinhoursY ns1blankspaceText">' +
										'<input id="ns1blankspacePayrollItemHours" class="ns1blankspaceText">' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceCaption includein includeinhoursY">' +
										'Pay Rate</td></tr>' +
										'<tr><td class="includein includeinhoursY ns1blankspaceText">' +
										'<input id="ns1blankspacePayrollItemPayRate" class="ns1blankspaceText">' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceSubNote">Leave this blank to use the employee\'s default pay rate.</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceCaption includein includeinhoursX">' +
										ns1blankspace.option.currencySymbol +
										'/Hour</td></tr>' +
										'<tr><td class="ns1blankspaceCaption includein includeinhoursN">' +
										ns1blankspace.option.currencySymbol +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceText includein includeinhoursN">' +
										'<input id="ns1blankspacePayrollItemAmount" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspacePayrollPayRunColumn2').html(aHTML.join(''));

						$('#ns1blankspacePayrollItemType').keyup(function(e)
						{
							$.extend(true, oParam, {step: 13, searchText: $(this).val(), all: (e.which === 13)});
							ns1blankspace.financial.payroll.pays(oParam)
						});
						
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');
								
						aHTML.push('<tr><td>' +
										'<span style="width:70px;" id="ns1blankspaceItemEditSave" class="ns1blankspaceAction">Save</span>' +
										'</td></tr>');
										
						aHTML.push('<tr><td>' +
											'<span style="width:70px;" id="ns1blankspaceItemEditCancel" class="ns1blankspaceAction">Cancel</span>' +
											'</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceItemEditAbout"></td></tr>');
															
						aHTML.push('</table>');					
							
						$('#ns1blankspacePayrollPayRunColumn3').html(aHTML.join(''));
						
						$('#ns1blankspaceItemEditSave').button(
						{
							text: "Save"
						})
						.click(function()
						{
							ns1blankspace.status.working();

							var iHours = ($('#ns1blankspacePayrollItemHours').is(':visible')?$('#ns1blankspacePayrollItemHours').val():1)

							var oData =
							{
								record: iPay,
								type: $('#ns1blankspacePayrollItemType').attr('data-id'),
								hours: iHours,
								id: sID
							};

							if ($('#ns1blankspacePayrollItemAmount').is(':visible'))
							{	
								oData.rate = $('#ns1blankspacePayrollItemAmount').val();
							}

							if ($('#ns1blankspacePayrollItemPayRate').is(':visible'))
							{	
								if ($('#ns1blankspacePayrollItemPayRate').val() != '')
								{
									oData.rate = $('#ns1blankspacePayrollItemPayRate').val();
								}	
							}

							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_RECORD_ITEM_MANAGE'),
								data: oData,
								dataType: 'json',
								success: function(data)
								{
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

						$('#ns1blankspaceItemEditCancel').button(
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
							$('#ns1blankspacePayrollItemHours').focus();

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';
							oSearch.addField('hours,type,typetext,rate,total');
							oSearch.addFilter('id', 'EQUAL_TO', sID);
							oSearch.getResults(function(data) {
									$.extend(true, oParam, {step: 5});
									ns1blankspace.financial.payroll.pays(oParam, data)
									});
						}
						else
						{
							$('#ns1blankspacePayrollItemType').focus();
							$('[name="radioItemType"][value="1"]').attr('checked', true);

							ns1blankspace.financial.payroll.util.linetypes.showHide();

							$.extend(true, oParam, {step: 13, searchText: ''});
							ns1blankspace.financial.payroll.pays(oParam);
						}
					}

					else if (iStep == 5)
					{
						if (oResponse.data.rows.length != 0)
						{
							var oObjectContext = oResponse.data.rows[0];
							$('#ns1blankspacePayrollItemHours').val(numeral(oObjectContext.hours).format('(0,0.00)'));
							$('#ns1blankspacePayrollItemAmount').val(numeral(oObjectContext.rate).format('(0,0.00)'));
							$('#ns1blankspacePayrollItemType').val(oObjectContext.typetext);
							$('#ns1blankspacePayrollItemType').attr('data-id', oObjectContext.type);
							$('#ns1blankspacePayrollItemPayRate').val(numeral(oObjectContext.rate).format('(0,0.00)'));

							ns1blankspace.financial.payroll.util.linetypes.showHide({lineType: oObjectContext.type});
							$('.includein :visible:first').focus().select();
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
															 parseFloat(this["amount"].replace(',', '')).toFixed(2) + '</div></td>');

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
							oSearch.addField('contactpersontext,employmentstartdate,statustext,employeenumber,employee.contactperson.firstname,employee.contactperson.surname');
							oSearch.addFilter('status', 'EQUAL_TO', '2')
							oSearch.rows = 50;
							oSearch.sort('employeenumber', 'asc');
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
												'<td id="ns1blankspaceEmployee_name-' + this.id + '" class="ns1blankspaceRow">' +
												this.employeenumber + '</td>' +
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

					var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1}).value;

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

	financials:
				{
					show: 	function (oParam)
								{
									$vq.clear({queue: 'financials'});

									$vq.add('<table>' +
												'<tr>' +
												'<td class="ns1blankspaceCaption">Expenses</td>' +
												'</tr>' +
												'<tr>' +
												'<td id="ns1blankspacePayrollFinancialsExpenses" style="padding-bottom:14px;">' + ns1blankspace.xhtml.loadingSmall + '</td>' +
												'</tr>' +
												'<tr>' +
												'<td class="ns1blankspaceCaption">Journals</td>' +
												'</tr>' +
												'<tr class="ns1blankspaceContainer">' +
												'<td id="ns1blankspacePayrollFinancialsJournals">' + ns1blankspace.xhtml.loadingSmall + '</td>' +
												'</tr>' +
												'</table>', {queue: 'financials'});	

									$vq.render('#ns1blankspaceMainExpenses', {queue: 'financials'});

									ns1blankspace.financial.payroll.expenses.show()
								}
				},

	expenses: 	
				{
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

											$('#ns1blankspacePayrollFinancialsExpenses').html(aHTML.join(''));		
										}
										else
										{
										
											aHTML.push('<table>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.financial.payroll.expenses.row(this));
											});
											
											aHTML.push('</table>');
											
											ns1blankspace.render.page.show(
											{
												xhtmlElementID: 'ns1blankspacePayrollFinancialsExpenses',
												xhtmlContext: 'FinancialPayrollExpense',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspace.financial.payroll.expenses.row,
												functionOnNewPage: ns1blankspace.financial.payroll.expenses.bind,
												type: 'json',
												headerRow: false
											});
										}

										ns1blankspace.financial.payroll.journals.show()
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
				},

	journals: 	
				{
					show:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_SEARCH';
										oSearch.addField('id,journaldate,description,sum(generaljournal.generaljournalitem.creditamount) totalamount');
										oSearch.addFilter('object', 'EQUAL_TO', '37');
										oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContextData.id);
										oSearch.getResults(function(data) {ns1blankspace.financial.payroll.journals.show(oParam, data)})	
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table>');
											aHTML.push('<tr>');
											aHTML.push('<td class="ns1blankspaceNothing">No journals.</td>');
											aHTML.push('</tr>');
											aHTML.push('</table>');

											$('#ns1blankspacePayrollFinancialsJournals').html(aHTML.join(''));		
										}
										else
										{
										
											aHTML.push('<table>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.financial.payroll.journals.row(this));
											});
											
											aHTML.push('</table>');
											
											ns1blankspace.render.page.show(
											{
												xhtmlElementID: 'ns1blankspacePayrollFinancialsJournals',
												xhtmlContext: 'FinancialPayrollJournal',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspace.financial.payroll.journals.row,
												functionOnNewPage: ns1blankspace.financial.payroll.journals.bind,
												type: 'json',
												headerRow: false
											});
										}
									}	
								},

					row: 		function (oRow)
								{
									var aHTML = [];
									
									aHTML.push('<tr class="ns1blankspaceRow">');
															
									aHTML.push('<td id="ns1blankspaceFinancialPayrollJournal_description-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.description + '</td>');
															
									aHTML.push('<td id="ns1blankspaceFinancialPayrollJournal_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
															numeral(oRow.totalamount).format('(0,0.00)') + '</td>');						
																																													
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspaceFinancialPayrollJournal_view-' + oRow.id +
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
										ns1blankspace.financial.journal.init({id: (this.id).split('-')[1]});
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
					var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
					var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;

					if (oParam == undefined)
					{	
						oParam = {}
					}	

					if (sStartDate === undefined)
					{
						sStartDate = Date.today().moveToMonth(6, -1).moveToFirstDayOfMonth().toString("dd MMM yyyy");
					}

					oParam.startDate = sStartDate;

					if (sEndDate === undefined)
					{
						sEndDate = Date.today().toString("dd MMM yyyy");
					}

					oParam.endDate = sEndDate;
					
					ns1blankspace.financial.payroll.data.startDate = sStartDate;
					ns1blankspace.financial.payroll.data.endDate = sEndDate;

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
										'<input id="ns1blankspacePayrollStartDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
							
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
										'To' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePayrollEndDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
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
						oSearch.addField('payrecord.employee.contactperson,payrecord.employee.contactpersontext,payrecord.employee.employeenumber,' +
											'sum(grosssalary) grosssalary,sum(netsalary) netsalary,sum(deductions) deductions,sum(superannuation) superannuation,sum(taxbeforerebate) taxbeforerebate');
						oSearch.addSummaryField('sum(grosssalary) grosssalary');
						oSearch.addSummaryField('sum(netsalary) netsalary');
						oSearch.addSummaryField('sum(superannuation) superannuation');
						oSearch.addSummaryField('sum(taxbeforerebate) taxbeforerebate');
						oSearch.addSummaryField('sum(deductions) deductions');

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
						ns1blankspace.financial.payroll.data.payrecords = oResponse;

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">' +
							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Gross Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.grosssalary).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Net Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.netsalary).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Tax</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.taxbeforerebate).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Deductions</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.deductions).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Superannuation</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.superannuation).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Total Payroll</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							numeral(numeral(oResponse.summary.grosssalary).value() + numeral(oResponse.summary.superannuation).value()).format('(0,0.00)') + 
							'</td></tr>' +
							'</table>');

						$('#ns1blankspacePayrollSummary').html(aHTML.join(''));

						ns1blankspace.financial.payroll.totals.employees.show(oParam);
					}	
				},

	employees: 	
				{
					show: 	function (oParam, oResponse)
								{
									var bShowAsList = ns1blankspace.util.getParam(oParam, 'showAsList', {"default": true}).value;
									var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;

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
															'employee.contactperson.streetstate,employee.contactperson.streetpostcode,employee.contactperson.dateofbirth,' +
															'employee.contactbusiness.tradename,employee.contactbusiness.abn,employee.contactbusiness.streetaddress1,employee.contactbusiness.streetaddress2,' +
															'employee.contactbusiness.streetsuburb,employee.contactbusiness.streetstate,employee.contactbusiness.streetpostcode');

										if (sStartDate != undefined)
										{
											oSearch.addBracket('(');
											oSearch.addFilter('employee.employmentenddate', 'IS_NULL');
											oSearch.addOperator('or');
											oSearch.addFilter('employee.employmentenddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
											oSearch.addBracket(')');
										}

										oSearch.rows = 999;
										oSearch.sort('employee.employeenumber', 'asc');
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
															'<td class="ns1blankspaceHeaderCaption">Employee</td>');

											if (bShowAsList)
											{
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em;">Gross<br />'+ 
																'<span style="font-size:0.75em;">' + (ns1blankspace.financial.payroll.data.payrecords.summary.grosssalary).parseCurrency().formatMoney(2, '.', ',') +
																'</span></td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em;">Tax<br />'+ 
																'<span style="font-size:0.75em;">' + (ns1blankspace.financial.payroll.data.payrecords.summary.taxbeforerebate).parseCurrency().formatMoney(2, '.', ',') +
																'</span></td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em;">Net<br />'+ 
																'<span style="font-size:0.75em;">' + (ns1blankspace.financial.payroll.data.payrecords.summary.netsalary).parseCurrency().formatMoney(2, '.', ',') +
																'</span></td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em;">Super.<br />'+ 
																'<span style="font-size:0.75em;">' + (ns1blankspace.financial.payroll.data.payrecords.summary.superannuation).parseCurrency().formatMoney(2, '.', ',') +
																'</span></td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em;">Ded.<br />'+ 
																'<span style="font-size:0.75em;">' + (ns1blankspace.financial.payroll.data.payrecords.summary.deductions).parseCurrency().formatMoney(2, '.', ',') +
																'</span></td>');
											}
											else
											{
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Pay</td>');
											}	

											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
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
												rows: 200,
												functionShowRow: ns1blankspace.financial.payroll.totals.employees.row,
												functionOpen: undefined,
												functionOnNewPage: ns1blankspace.financial.payroll.totals.employees.bind,
										   });

											var aHTML = [];
																	
											aHTML.push('<table class="ns1blankspaceColumn2" style="margin-right:0px;">');
				
											aHTML.push('<tr><td id="ns1blankspacePayrollTotalsPreviewStatus" style="padding-top:4px; padding-bottom:2px; font-size:0.75em;" class="ns1blankspaceSub">' +
															'Create summaries for selected employees</td></tr>');
																	
											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsPreview" class="ns1blankspaceAction" style="text-align:left;">' +
															'Show</span></td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsEmail" class="ns1blankspaceAction" style="text-align:left;">' +
															'Email</span></td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsPDF" class="ns1blankspaceAction" style="text-align:left;">' +
															'PDF</span></td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollTotalsEmailStatus" style="padding-top:4px; font-size:0.75em;" class="ns1blankspaceSub"></td></tr>');

											aHTML.push('<tr>' +
															'<td class="ns1blankspaceSubNote" style="padding-top:14px;">' +
															'Export totals as</td></tr>');
											
											aHTML.push('<tr><td style="padding-top:4px;"><span id="ns1blankspacePayrollTotalsDownload" class="ns1blankspaceAction" style="text-align:left;">' +
															'CSV</span></td></tr>');

											aHTML.push('<tr><td style="padding-top:4px;"><span class="ns1blankspaceAction" id="ns1blankspacePayrollCreatePDF"  style="text-align:left; width:95px;">' +
															'PDF</span></td></tr>');

											aHTML.push('<tr>' +
														'<td class="ns1blankspaceSubNote" style="padding-top:14px;">' +
														ns1blankspace.option.taxOffice + ' reporting</td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsFile" class="ns1blankspaceAction" style="text-align:left;">' +
															'File</span></td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsFileTest" class="ns1blankspaceAction" style="text-align:left;">' +
															'Test File</span></td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsFileSample" class="ns1blankspaceAction" style="text-align:left;">' +
															'Sample File</span></td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollTotalsFileStatus" style="padding-top:10px; font-size:0.75em;" class="ns1blankspaceSub"></td></tr>');

											aHTML.push('</table>');					
											
											$('#ns1blankspacePayrollEmployeeTotalsColumn2').html(aHTML.join(''));
											
											$('#ns1blankspacePayrollTotalsPreview').button(
											{
												label: 'Show',
												icons:
												{
													primary: "ui-icon-document"
												}
											})
											.click(function()
											{	
												delete oParam.step;
												delete oParam.dataIndex;
												delete oParam.dataItemIndex;
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

											$('#ns1blankspacePayrollTotalsPDF').button(
											{
												label: 'PDF',
												icons:
												{
													primary: "ui-icon-print"
												}
											})
											.click(function()
											{	
												ns1blankspace.financial.payroll.totals.employees.pdf.process(oParam);
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
												ns1blankspace.financial.payroll.totals.employees.file.data = {fileMode: 'P', sample: false}
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
												ns1blankspace.financial.payroll.totals.employees.file.data = {fileMode: 'T', sample: false}
												oParam.fileMode = 'T';
												oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.totals.employees.file.init};
												ns1blankspace.financial.payroll.totals.employees.preview.init(oParam);
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollTotalsFileSample').button(
											{
												label: 'Show Data',
												icons:
												{
													primary: "ui-icon-document"
												}
											})
											.click(function()
											{	
												ns1blankspace.financial.payroll.totals.employees.file.data = {fileMode: 'T', sample: true}
												oParam.fileMode = 'T';
												oParam.sample = true;
												oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.totals.employees.file.init};
												ns1blankspace.financial.payroll.totals.employees.preview.init(oParam);
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollTotalsDownload').button(
											{
												label: 'CSV',
												icons:
												{
													primary: "ui-icon-arrowthickstop-1-s"
												}
											})
											.click(function()
											{	
												var oData =
												{
													more: ns1blankspace.financial.payroll.data.payrecords.moreid,
													filename: 'payroll-totals.csv'
												}

												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('CORE_MORE_FILE_MANAGE'),
													data: oData,
													dataType: 'json',
													success: function(data)
													{
														ns1blankspace.status.message('File created');
														window.open(data.link, '_self');
													}
												});
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollCreatePDF').button(
											{
												label: 'PDF',
												icons:
												{
													primary: "ui-icon-arrowthickstop-1-s"
												}
											})
											.click(function(event)
											{
												var sHTML = '<style>.ui-button, input {display:none;} td.ns1blankspaceRowSelect {color:#000000;}</style>' +
																$('#ns1blankspacePayrollEmployeeTotalsColumn1').html();

												var sURL = document.location.protocol + '//' + document.location.host;
												var aHeaderHTML =
												[
													'<div style="margin-bottom:20px;">',
													'<div style="font-size:2em;">' + ns1blankspace.user.contactBusinessText + '</div>',
													'<div style="font-size:1.6em;">PAYROLL</div>',
												];

												aHeaderHTML.push('<div>');

												aHeaderHTML.push('<div>');

												if ($('#ns1blankspacePayrollStartDate').val() != '')
												{
													aHeaderHTML.push($('#ns1blankspacePayrollStartDate').val());
												}

												if ($('#ns1blankspacePayrollEndDate').val() != '')
												{
													aHeaderHTML.push(' to ' + $('#ns1blankspacePayrollEndDate').val());
												}

												aHeaderHTML.push('</div>');

												aHeaderHTML.push('</div><hr>');

												ns1blankspace.pdf.create(
												{
													xhtmlContent: aHeaderHTML.join('') + sHTML,
													filename: 'payroll.pdf',
													open: true,
													leftmargin: 45,
													topmargin: 1,
													headerheight: 15,
													footerheight: 15,
													baseURLBody: sURL,
													object: 12,
													objectContext: ns1blankspace.spaceContactBusiness
												});
											})
											.css('width', '90px');
										}	    	
									}
								},

					row: 		function (oRow, oParam)
								{
									var bShowAsList = ns1blankspace.util.getParam(oParam, 'showAsList', {"default": true}).value;

									var sKey = oRow.id;									
									var aHTML = [];

									var oPayRecord = $.grep(ns1blankspace.financial.payroll.data.payrecords.data.rows,
															function (payrecord) {return payrecord['payrecord.employee.contactperson'] == oRow['employee.contactperson']})[0];

									if (oPayRecord==undefined && oRow["employee.statustext"] == 'Inactive')
									{}
									else
									{		
										aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspacePayrollTotals_container-' + sKey + '">' +
																		'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspacePayrollTotals_selectContainer-' + sKey + '">' +
																		'<input type="checkbox" checked="checked" id="ns1blankspacePayrollTotals_select-' + sKey + '" /></td>');

										aHTML.push('<td id="ns1blankspacePayrollTotals_employee" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
													(oRow["employee.contactperson.firstname"] != ''?'<div>' + oRow["employee.contactperson.firstname"] + '</div>':'') +
													'<div>' + oRow["employee.contactperson.surname"] + '</div>' +
													'<div class="ns1blankspaceSub">' + oRow["employee.employeenumber"] + '</div>' + 
													'</td>');

										if (bShowAsList)
										{	
											aHTML.push('<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right; font-size:0.75em;">' +
											 					(oPayRecord==undefined?'-':oPayRecord["grosssalary"]) + '</td>' +
											 			'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right; font-size:0.75em;">' +
											 					(oPayRecord==undefined?'-':oPayRecord["taxbeforerebate"]) + '</td>' +
											 			'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right; font-size:0.75em;">' +
											 					(oPayRecord==undefined?'-':oPayRecord["netsalary"]) + '</td>' +
											 			'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right; font-size:0.75em;">' +
											 					(oPayRecord==undefined?'-':oPayRecord["superannuation"]) + '</td>' +
											 			'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right; font-size:0.75em;">' +
											 					(oPayRecord==undefined?'-': oPayRecord["deductions"]) + '</td>');				
										}
										else
										{
											aHTML.push('<td id="ns1blankspacePayrollTotals_pay" class="ns1blankspaceRow ns1blankspaceSubNote" style="padding-bottom:6px;">')

											if (oPayRecord == undefined)
											{
												aHTML.push('<div class="ns1blankspaceSubNote">-<div>');
											}
											else
											{
												aHTML.push('<table>' +
															 '<tr><td class="ns1blankspaceRow">Gross</td><td class="ns1blankspaceRow"style="text-align:right;">$' + oPayRecord["grosssalary"] + '</td></tr>' +
															 '<tr><td class="ns1blankspaceRow">Tax</td><td class="ns1blankspaceRow" style="text-align:right;">$' + oPayRecord["taxbeforerebate"] + '</td></tr>' +
															 '<tr><td class="ns1blankspaceRow">Net</td><td class="ns1blankspaceRow" style="text-align:right;">$' + oPayRecord["netsalary"] + '</td></tr>' +
															 '<tr><td class="ns1blankspaceRow">Superannuation</td><td class="ns1blankspaceRow" style="text-align:right;">$' + oPayRecord["superannuation"] + '</td></tr>' +
															 '<tr><td class="ns1blankspaceRow" style="border-width:0px;">Deductions</td><td class="ns1blankspaceRow" style="border-width:0px; text-align:right;">$' + oPayRecord["deductions"] + '</td></tr>' +
															 '</table>');
											}

											aHTML.push('</td>');
										}	
									
										aHTML.push('<td style="width:20px;text-align:right;" class="ns1blankspaceRow">' +
														'<span style="margin-right:5px;" id="ns1blankspacePayrollTotals_option_preview-' + sKey + '"' +
																		' class="ns1blankspaceRowPreview"></span>' +
														'</td></tr>');
										
										return aHTML.join('');
									}
								},

					bind: 		function ()
								{
									$('#ns1blankspacePayrollEmployeeTotals .ns1blankspaceRowSelect')
									.click(function()
									{
										$('#ns1blankspaceViewControlNew').button({disabled: false});
										ns1blankspace.show({selector: '#ns1blankspaceMainEmployee', refresh: true});
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

					preview: {
									init: 	function (oParam)
												{
													oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.payroll.totals.employees.preview.show);
													oParam = ns1blankspace.util.setParam(oParam, 'template', 'payroll');
													oParam = ns1blankspace.util.setParam(oParam, 'object', ns1blankspace.object);
													ns1blankspace.format.templates.init(oParam);
												},

									show:		function (oParam)
												{
													var iStep = 1
													var iDataIndex = 0;
													var iDataItemIndex = 0;
													var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default": ns1blankspace.financial.payroll.data.startDate}).value;
													var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default": ns1blankspace.financial.payroll.data.endDate}).value;
													var bShow;

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

																	bShow = (oResponse.data.rows.length != 0)
																	if (bShow) {bShow = (parseFloat((oResponse.summary.grosssalary).parseCurrency()) != 0)}

																	if (bShow)
																	{	
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].pay = oResponse.data.rows;
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].grosssalary = (oResponse.summary.grosssalary).parseCurrency().formatMoney(0, '.', ',');
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].netsalary = (oResponse.summary.netsalary).parseCurrency().formatMoney(0, '.', ',');
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].superannuation = (oResponse.summary.superannuation).parseCurrency().formatMoney(0, '.', ',');
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].taxbeforerebate = (oResponse.summary.taxbeforerebate).parseCurrency().formatMoney(0, '.', ',');
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].allowances = (oResponse.summary.allowances).parseCurrency().formatMoney(0, '.', ',');
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].contactbusinesstext = ns1blankspace.financial.payroll.data.summaries[iDataIndex]['employee.contactbusiness.tradename'];
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].year = Date.parse(oResponse.summary.paydate).getFullYear();
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].startdate = sStartDate;
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].enddate = sEndDate;

																		$('#ns1blankspacePayrollTotals_option_preview-' + oData.id).html('');
																		
																		$('#ns1blankspacePayrollTotals_option_preview-' + oData.id).button(
																		{
																			text: false,
																			icons:
																			{
																				primary: "ui-icon-document"
																			}
																		})
																		.click(function()
																		{
																			oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', this.id);
																			ns1blankspace.financial.payroll.totals.employees.preview.showHide(oParam);
																		})
																		.css('width', '15px')
																		.css('height', '20px');
																	}
																	else
																	{
																		$('#ns1blankspacePayrollTotals_option_preview-' + oData.id).html('<span class="ns1blankspaceSubNote">None</span>');
																		$('#ns1blankspacePayrollTotals_select-' + oData.id).attr('checked', false);
																	}	

																	$('#ns1blankspacePayrollTotals_option_preview-' + oData.id).addClass('ns1blankspaceRowPreviewDone');
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
															var oTemplate = ns1blankspace.format.templates.get(oParam);

															if (oTemplate == undefined)
															{
																ns1blankspace.status.error('No pay summary template')
															}
															else
															{
																sHTML = ns1blankspace.format.render(
																{
																	object: 37,
																	objectContext: -1,
																	xhtmlTemplate: oTemplate.xhtml,
																	objectData: oSummary,
																	objectOtherData: oSummary.pay
																});

																oSummary.xhtml = sHTML;
															
																$('#ns1blankspacePayrollTotals_container-' + sKey).after('<tr id="ns1blankspacePayrollTotals_container_preview-' + sKey + '">' +
																'<td colspan=8><div style="background-color: #F3F3F3; padding:8px;" class="ns1blankspaceScale85">' + sHTML + '</div></td></tr>');
															}	
														}
													}
												}			
								},

					email: 	{
									init: 	function (oParam, oResponse)
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
																	var oTemplate = ns1blankspace.format.templates.get({object: 37});

																	oSummary.xhtml = ns1blankspace.format.render(
																	{
																		object: 37,
																		objectContext: -1,
																		xhtmlTemplate: oTemplate.xhtml,
																		objectData: oSummary,
																		objectOtherData: oSummary.pay
																	});
																}	

																var oData = 
																{
																	subject: ns1blankspace.user.contactBusinessText + ' Pay Summary',
																	message: oSummary.xhtml,
																	to: oSummary['employee.contactperson.email'],
																	object: 37,
																	objectContext: oSummary.id,
																	fromemail: ns1blankspace.user.email
																}

																//

																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND'),
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

					pdf: 		{
									process: function (oParam, oResponse)
												{
													oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.totals.employees.pdf.init};
													ns1blankspace.financial.payroll.totals.employees.preview.init(oParam);
												},

									init: 	function (oParam, oResponse)
												{
													ns1blankspace.financial.payroll.totals.employees.pdf.create({dataIndex: 0})
												},

									create:	function (oParam)
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
														ns1blankspace.debug.message(ns1blankspace.financial.payroll.data.summaries[iDataIndex]);

														var oSummary = ns1blankspace.financial.payroll.data.summaries[iDataIndex];

														if (oSummary !== undefined)
														{
															if (oSummary.xhtml === undefined)
															{
																var oTemplate = ns1blankspace.format.templates.get({object: 37});

																oSummary.xhtml = ns1blankspace.format.render(
																{
																	object: 37,
																	objectContext: -1,
																	xhtmlTemplate: oTemplate.xhtml,
																	objectData: oSummary,
																	objectOtherData: oSummary.pay
																});
															}

															oParam.dataIndex = iDataIndex + 1;
															ns1blankspace.financial.payroll.totals.employees.pdf.create(oParam);
														}														
													}
													else
													{
														var sHTML = '<style>div.summary {font-size: 125%;} td {padding:8px;}</style>' +
																			_.join(_.map(ns1blankspace.financial.payroll.data.summaries, 'xhtml'), '<div style="page-break-after:always;"></div>');

														var sURL = document.location.protocol + '//' + document.location.host;

														ns1blankspace.pdf.create(
														{
															xhtmlContent: sHTML,
															filename: 'payroll-payment-summaries.pdf',
															open: true,
															leftmargin: 45,
															topmargin: 45,
															headerheight: 15,
															footerheight: 15,
															baseURLBody: sURL,
															object: 12,
															objectContext: ns1blankspace.spaceContactBusiness
														});
													}	
												}																	
								},			

					file: 	{
									init: 		function (oParam, oResponse)
												{
													if (oParam === undefined) {oParam = {fileMode: 'T'}}

													var oSearch = new AdvancedSearch();
													oSearch.method = 'CONTACT_BUSINESS_SEARCH';		
													oSearch.addField('tradename,legalname,abn,phonenumber,faxnumber,email,streetaddress1,streetaddress2,streetsuburb,streetstate,streetpostcode,' +
																			'mailingaddress1,mailingaddress2,mailingsuburb,mailingstate,mailingpostcode');
													oSearch.rows = 1;
													oSearch.addFilter('id', 'EQUAL_TO', (ns1blankspace.spaceContactBusiness || ns1blankspace.user.contactBusiness))
													
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
															oParam.tradeName = oRow.tradename;
															oParam.contactPersonText = ns1blankspace.user.commonName;
															oParam.legalName = oRow.legalname;
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

															oParam.fileMode = ns1blankspace.financial.payroll.totals.employees.file.data.fileMode;
															oParam.sample = ns1blankspace.financial.payroll.totals.employees.file.data.sample;
																
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
															var oItem = _.clone(this);
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
															'<td class="ns1blankspaceAction" id="ns1blankspaceFileDownload" style="padding-top:8px;"' +
															'</td></tr>' +
															'<tr>' +
															'<td class="ns1blankspace" id="ns1blankspaceFileSpecification" style="padding-top:8px;"' +
															'</td></tr></table>');		

														oParam.totalRows = oItems.length;
														oParam.items = oItems;
														oParam.fileName = 'atopsar.txt';

														if (oParam.sample)
														{
															oParam.saveToFile = false;
														}

														oParam.remote = true;
													
														var sFile = ns1blankspace.setup.file["export"].process(oParam);

														ns1blankspace.status.clear();

														if (oParam.sample)
														{
															ns1blankspace.financial.payroll.totals.employees.file.specification();
														}
														else
														{
															$('#ns1blankspaceFileContents').html(sFile);
														}
													}	
												},

									specification: function (oParam)
												{
													var aHTML = [];

													aHTML.push('<table class="ns1blankspace" style="width:550px;">')
													aHTML.push('<tr class="ns1blankspaceCaption">');
													aHTML.push('<td class="ns1blankspaceHeaderCaption">Start</td>');
													aHTML.push('<td class="ns1blankspaceHeaderCaption">End</td>');
													aHTML.push('<td class="ns1blankspaceHeaderCaption">Text</td>');
													aHTML.push('<td class="ns1blankspaceHeaderCaption">Actual End</td>');
													aHTML.push('</tr>');

													$.each(ns1blankspace.setup.file.export._data.file, function (l, line)
													{
														sStyle = '';
														if (line.start == 1)
														{
															aHTML.push('<tr class="ns1blankspaceRow"><td colspan=4 style="background-color:#f5f5f5;"></td></tr>');
															sStyle = ' style="padding-top:8px;"'
														}

														aHTML.push('<tr class="ns1blankspaceRow">');
															
														aHTML.push('<td id="ns1blankspaceFileSpec_start-' + line.start + '" class="ns1blankspaceRow"' + sStyle + '>' +
																				line.start + '</td>');

														aHTML.push('<td id="ns1blankspaceFileSpec_end-' + line.start + '" class="ns1blankspaceRow"' + sStyle + '>' +
																				line.end + '</td>');

														aHTML.push('<td id="ns1blankspaceFileSpec_text-' + line.start + '" class="ns1blankspaceRow ns1blankspaceSub"' + sStyle + '>' +
																				line.text + '</td>');

														aHTML.push('<td id="ns1blankspaceFileSpec_textend-' + line.start + '" class="ns1blankspaceRow ns1blankspaceSub"' + sStyle + '>' +
																				line.textEnd + 
																				(line.end!=line.textEnd?' !!':'') + '</td>');
																						
														aHTML.push('</tr>');

													});

													aHTML.push('</table>');

													$('#ns1blankspaceFileSpecification').html(aHTML.join(''))
												}			
								}						
				}
}

ns1blankspace.financial.payroll.pays.totals =
{
	show: 	function (oParam, oResponse)
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
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Superannuation</td></tr>' +
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
															'payrecord.employee.contactperson,payrecord.employee.contactperson.firstname,payrecord.employee.contactperson.surname,payrecord.employee.contactperson.email,' +
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

											aHTML.push('<tr><td id="ns1blankspacePayrollPayTotalsPreviewStatus" style="padding-left:2px; padding-top:12px; padding-bottom:4px; font-size:0.75em;" class="ns1blankspaceSub">' +
																'<div style="border-left-style:solid; border-left-width:1px; border-left-color:red;">' +
																'&nbsp;= no email</div></td></tr>');

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
																	'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspacePayrollPayTotals_selectContainer-' + sKey + '"');

									if (oRow["payrecord.employee.contactperson.email"] == '')
									{
										aHTML.push('style="border-left-style:solid; border-left-width:1px; border-left-color:red;"')
									}	

									aHTML.push('><input type="checkbox" checked="checked" id="ns1blankspacePayrollPayTotals_select-' + sKey + '" /></td>');

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

					bind: 	function ()
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
													oParam = ns1blankspace.util.setParam(oParam, 'object', 371);
													ns1blankspace.format.templates.init(oParam);
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
																	.click(function()
																	{
																		oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', this.id);
																		ns1blankspace.financial.payroll.pays.totals.slips.preview.showHide(oParam);
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
															delete oParam.dataIndex;
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
															var oTemplate = ns1blankspace.format.templates.get(oParam);

															sHTML = ns1blankspace.format.render(
															{
																object: 371,
																objectContext: -1,
																xhtmlTemplate: oTemplate.xhtml,
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
													oParam = ns1blankspace.util.setParam(oParam, 'dataIndex', 0)
													ns1blankspace.financial.payroll.pays.totals.slips.preview.init(
													{
														onCompleteWhenCan: ns1blankspace.financial.payroll.pays.totals.slips.email.send
													})
													
													//ns1blankspace.financial.payroll.pays.totals.slips.email.send({dataIndex: 0})
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
														oParam = {dataIndex: 0}
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
															if (oSlip['payrecord.employee.contactperson.email'] == '')
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
																	var oTemplate = ns1blankspace.format.templates.get(oParam);

																	oSlip.xhtml = ns1blankspace.format.render(
																	{
																		object: 371,
																		objectContext: -1,
																		xhtmlTemplate: oTemplate.xhtml,
																		objectData: oSlip,
																		objectOtherData: oSlip.items
																	});
																}	

																var oData = 
																{
																	subject: ns1blankspace.user.contactBusinessText + ' Pay Slip - ' + ns1blankspace.objectContextData.paydate,
																	message: oSlip.xhtml,
																	to: oSlip['payrecord.employee.contactperson'],
																	object: 37,
																	objectContext: ns1blankspace.objectContext,
																	fromemail: ns1blankspace.user.email
																}

																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND'),
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

ns1blankspace.financial.payroll.util = 
{
	linetypes: 	{
					data: 		[
									{
										key: 'allowancesnontaxable',
										title: 'Allowances (Non-taxable)',
										selectable: true,
										dependant: false,
										hours: false
									},
									{
										key: 'allowancestaxable',
										title: 'Allowances (Taxable)',
										selectable: true,
										dependant: false,
										hours: false
									},
									{
										key: 'deductions',
										title: 'Deductions',
										selectable: true,
										dependant: false,
										hours: false
									},
									{
										key: 'grosssalary',
										title: 'Gross Salary',
										selectable: true,
										dependant: true,
										hours: false
									},
									{
										key: 'leave',
										title: 'Leave',
										selectable: true,
										dependant: true,
										hours: false
									},
									{
										key: 'leaveloading',
										title: 'Leave Loading',
										selectable: false,
										dependant: true,
										hours: false
									},
									{
										key: 'leavetype',
										title: 'Leave Type',
										selectable: true,
										dependant: true,
										options:
										[
											{
												id: 1,
												title: 'Annual'
											},
											{
												id: 2,
												title: 'Sick'
											},
											{
												id: 3,
												title: 'Long Service'
											},
											{
												id: 4,
												title: 'Leave Without Pay'
											},
										]
									},
									{
										key: 'posttaxsuper',
										title: 'Post Tax Superannuation',
										selectable: false,
										dependant: true
									},
									{
										key: 'salarysacrificesuper',
										title: 'Salary Sacrificed Superannuation',
										selectable: false,
										dependant: true
									},
									{
										key: 'standardhours',
										title: 'Standard Hours',
										selectable: true,
										dependant: false,
										hours: true
									},
									{
										key: 'super',
										title: 'Superannuation',
										selectable: true,
										dependant: true
									},
									{
										key: 'taxadjustments',
										title: 'Tax Adjustments',
										selectable: true,
										dependant: false,
										hours: false
									}
								],

					init:		function (oParam)
								{
									if (ns1blankspace.financial.payroll.data.linetypes != undefined)
									{
										ns1blankspace.util.onComplete(oParam);
									}
									else
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_FINANCIAL_PAYROLL_LINE_TYPE_SEARCH';		
										oSearch.addField('includeinallowancesnontaxable,includeinallowancestaxable,includeindeductions,includeingrosssalary,' +
															'includeinleave,includeinleaveloading,includeinleavetype,includeinleavetypetext,includeinposttaxsuper,' +
															'includeinsalarysacrificesuper,includeinstandardhours,includeinsuper,includeintaxadjustments,notes,title');
										oSearch.rows = 100;
										oSearch.sort('title', 'asc');
										oSearch.getResults(function(oResponse)
										{
											ns1blankspace.financial.payroll.data.linetypes = oResponse.data.rows;
											ns1blankspace.util.onComplete(oParam);
										});
									}	
								},

					search:		function (oParam)
								{
									var sIncludeIn = ns1blankspace.util.getParam(oParam, 'includeIn').value;
									var aLineType = ns1blankspace.financial.payroll.data.linetypes;

									if (sIncludeIn != undefined)
									{	
										var aLineType = $.grep(aLineType, function (linetype) {return linetype['includein' + sIncludeIn.toLowerCase()] == 'Y'});
									}	

									return aLineType
								},					

					get:		function (oParam)
								{
									var sTitle = ns1blankspace.util.getParam(oParam, 'title').value;
									var sID = ns1blankspace.util.getParam(oParam, 'id').value;
									var aLineTypes = ns1blankspace.util.getParam(oParam, 'lineTypes', {"default": ns1blankspace.financial.payroll.data.linetypes}).value;
									if (aLineTypes == undefined) {aLineTypes = ns1blankspace.setup.financial.payroll.data.linetypes}

									if (sTitle != undefined)
									{	
										aLineTypes = $.grep(aLineTypes, function (linetype) {return linetype.title == sTitle});
									}

									if (sID != undefined)
									{	
										aLineTypes = $.grep(aLineTypes, function (linetype) {return linetype.id == sID});										
									}	

									return aLineTypes[0]
								},

					showHide:	function (oParam)
								{
									var iLineType = ns1blankspace.util.getParam(oParam, 'lineType').value;
									if (iLineType==undefined) {iLineType = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value};

									$('.includein').hide();
									$vq.show('#ns1blankspaceItemEditAbout', '');

									if (iLineType != undefined)
									{	
										var oLineType = ns1blankspace.financial.payroll.util.linetypes.get({id: iLineType});
										var aIncludeIn = ns1blankspace.financial.payroll.util.linetypes.includeIn({id: iLineType});
										var aIncludeInInDependant = $.grep(aIncludeIn, function (i) {return !i.dependant});
										var sHours = 'N';

										if (aIncludeInInDependant.length > 0)
										{	
											sHours = (aIncludeInInDependant[0].hours?'Y':'N');					
										}

										$('.includeinhours' + sHours).show();
										$('.includein :visible :first').focus();

										if ($('#ns1blankspaceItemEditAbout').length != 0)
										{
											$vq.clear({queue: 'edit-about'});

											$vq.add('<div class="ns1blankspaceCaption" style="padding-top:22px; padding-left:0px;">Included in</div>', {queue: 'edit-about'});

											$.each(aIncludeIn, function (i, include)
											{
												$vq.add('<div class="ns1blankspaceSubNote" style="font-size:0.75em; padding-left:0px; padding-top:4px;"' +
																' id="ns1blankspaceItemEditAbout-' + include.key + '">' + include.title + '</div>', {queue: 'edit-about'});
											});

											$vq.render('#ns1blankspaceItemEditAbout', {queue: 'edit-about'});
										}	
									}	
								},

					includeIn:	function (oParam)
								{
									var iLineType = ns1blankspace.util.getParam(oParam, 'id').value;
									var bSelectableOnly = ns1blankspace.util.getParam(oParam, 'selectableOnly', {"default": true}).value;

									var oLineType = ns1blankspace.financial.payroll.util.linetypes.get({id: iLineType});
									var aIncludeIn = [];
									var oKey;

									if (oLineType != undefined)
									{
										for (var key in oLineType)
								  		{
								     		if (oLineType.hasOwnProperty(key))
								     		{
								     			if (oLineType[key] == 'Y')
								     			{
								     				oKey = $.grep(ns1blankspace.financial.payroll.util.linetypes.data, function (type) {return type.key == key.replace('includein', '')})[0];
								     				if (oKey != undefined)
								     				{	
								     					aIncludeIn.push(oKey);
								     				}	
								     			}	
								     		}
								     	}
									}

									return aIncludeIn
								}
				}			
}							

ns1blankspace.financial.payroll.superannuation =
{
	data: 	{searchText: undefined},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.financial.payroll.superannuation.urls(
					{
						onComplete: ns1blankspace.financial.payroll.superannuation.providers,
						onCompleteWhenCan: ns1blankspace.financial.payroll.superannuation.expenses
					});
				},

	summary:	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						ns1blankspace.financial.payroll.superannuation.data.summary = [];

						var aContactBusiness = _.map(ns1blankspace.financial.payroll.superannuation.data.providers, 'supercontactbusiness');
						aContactBusiness.push(ns1blankspace.financial.data.settings.payrollsuperannuationcontactbusiness);

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
						oSearch.addField('reference,amount,outstandingamount,description');
						oSearch.addFilter('paystatus', 'EQUAL_TO', 1);
						oSearch.addFilter('outstandingamount', 'NOT_EQUAL_TO', 0);
						oSearch.addFilter('contactbusinesspaidto', 'IN_LIST', aContactBusiness.join(','));

						var sSearchText = ns1blankspace.financial.payroll.superannuation.data.searchText;
						var sSearchDate = ns1blankspace.financial.payroll.superannuation.data.searchDate;

						if (sSearchText != undefined)
						{
							oSearch.addBracket('(');
							oSearch.addFilter('contactpersonpaidtotext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('contactbusinesspaidtotext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addBracket(')');
						}

						if (sSearchDate != undefined)
						{
							oSearch.addFilter('accrueddate', 'LESS_THAN_OR_EQUAL_TO', sSearchDate);
						}

						oSearch.rows = 10000;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.superannuation.summary(oParam, data)});
					}
					else
					{
						ns1blankspace.financial.payroll.superannuation.data.summary = oResponse.data.rows;

						ns1blankspace.financial.payroll.superannuation.data.summaryReduced = _.groupBy(
								ns1blankspace.financial.payroll.superannuation.data.summary, function (summary)
								{
									return _.last(_.split(_.first(_.split(summary.description, ' -')), 'for '))
								})

						var aHTML = [];

						_.each(ns1blankspace.financial.payroll.superannuation.data.summaryReduced, function (values, key)
						{
							if (key != '')
							{
								aHTML.push('<div class="ns1blankspaceSubNote">' + key + '</div>' + 
												'<div class="ns1blankspaceSubNote" style="font-weight:600; padding-bottom:6px;">' + numeral(_.sum(_.map(values, function (v) {return numeral(v.outstandingamount).value()}))).format('(0,0.00)') + '</div>');
							}
						});

						$('#ns1blankspacePayrollSuperannuationExpenseTotals').html(aHTML.join(''));
					}	
				},			

	expenses:	function (oParam, oResponse)
				{
					var iSearchBankAccount = ns1blankspace.util.getParam(oParam, 'searchBankAccount', {"default": -1}).value;
					var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
					var sSearchText;
					var oSearchDate = ns1blankspace.util.getParam(oParam, 'searchDate');
					var sSearchDate;

					if (oSearchText.exists)
					{
						sSearchText = oSearchText.value;
						ns1blankspace.financial.payroll.superannuation.data.searchText = sSearchText;
					}
					else
					{	
						sSearchText = ns1blankspace.financial.payroll.superannuation.data.searchText;
					}

					if (oSearchDate.exists)
					{
						sSearchDate = oSearchDate.value;
						ns1blankspace.financial.payroll.superannuation.data.searchDate = sSearchDate;
					}
					else
					{	
						sSearchDate = ns1blankspace.financial.payroll.superannuation.data.searchDate;
					}	

					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspacePayrollSuperannuationExpenseColumn1"></td>' +
										'<td id="ns1blankspacePayrollSuperannuationExpenseColumn2" style="width:115px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainSuperannuation').html(aHTML.join(''));

						$('#ns1blankspacePayrollSuperannuationExpenseColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.financial.payroll.superannuation.data.expenses = [];

						var aContactBusiness = _.map(ns1blankspace.financial.payroll.superannuation.data.providers, 'supercontactbusiness');
						aContactBusiness.push(ns1blankspace.financial.data.settings.payrollsuperannuationcontactbusiness);

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
						oSearch.addField('reference,amount,outstandingamount,description,contactbusinesspaidto,contactbusinesspaidtotext,contactpersonpaidto,contactpersonpaidtotext,accrueddate');
						oSearch.addFilter('paystatus', 'EQUAL_TO', 1);
						oSearch.addFilter('outstandingamount', 'NOT_EQUAL_TO', 0);
						oSearch.addFilter('contactbusinesspaidto', 'IN_LIST', aContactBusiness.join(','));

						if (sSearchText != undefined)
						{
							oSearch.addBracket('(');
							oSearch.addFilter('contactpersonpaidtotext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('contactbusinesspaidtotext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addBracket(')');
						}

						if (iSearchBankAccount != -1)
						{
							oSearch.addFilter('bankaccount', 'EQUAL_TO', iSearchBankAccount);
						}

						if (sSearchDate != undefined)
						{
							oSearch.addFilter('accrueddate', 'LESS_THAN_OR_EQUAL_TO', sSearchDate);
						}

						oSearch.addSummaryField('sum(amount) totalamount');
						oSearch.addSummaryField('min(accrueddate) startdate');
						oSearch.addSummaryField('max(accrueddate) enddate');

						oSearch.rows = 100;
						oSearch.sort('accrueddate', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.superannuation.expenses(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceInvoicingUnsent">' +
											'<tr><td class="ns1blankspaceSub">No outstanding superannuation expenses.</td></tr></table>');

							$('#ns1blankspacePayrollSuperannuationExpenseColumn1').html('');
						}
						else
						{
							var iPaymentAccount = ns1blankspace.util.getParam(oParam, 'paymentAccount').value;

							$('#ns1blankspacePayrollSuperannuationExpenseColumn2').html(aHTML.join(''));
						
							var aHTML = [];

							aHTML.push('<table id="ns1blankspacePayrollSuperannuationExpense" class="ns1blankspace" style="font-size:0.875em;">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption" style="width:100px;">Contact</td>' +
										'<td class="ns1blankspaceHeaderCaption">Description</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:50px; text-align:right;">Amount</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:70px; text-align:right;">Due Date</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:25px; text-align:right;">&nbsp;</td>' +
										'</tr>');

							//'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspacePayrollSuperannuationExpenseSelectAll"></span></td>' +

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.financial.payroll.superannuation.row(this));
							});
							
							aHTML.push('</table>');
						}

						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspacePayrollSuperannuationExpenseColumn1',
							xhtmlContext: 'PayrollSuperannuationExpense',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.financial.payroll.superannuation.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.financial.payroll.superannuation.bind
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceSubNote" style="padding-top:6px;">' +
											'Description contains' +
											'</td></tr>' +
											'<tr><td class="ns1blankspaceText" style="padding-top:0px;">' +
											'<input id="ns1blankspacePayrollSuperannuationExpenseSearchText" data-1blankspace="ignore" class="ns1blankspaceText" style="width:130px;">' +
											'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceSubNote">' +
											'Due date on or before' +
											'</td></tr>' +
											'<tr><td class="ns1blankspaceDate" style="padding-top:0px;">' +
											'<input id="ns1blankspacePayrollSuperannuationExpenseSearchDate" data-1blankspace="ignore" class="ns1blankspaceDate" style="width:130px;">' +
											'</td></tr>');
																			
						aHTML.push('<tr><td style="padding-top:0px;">' +
										'<span id="ns1blankspacePayrollSuperannuationExpenseSearch" class="ns1blankspaceAction">Search</span>' +
										'');

						if (sSearchText != undefined)
						{	
							aHTML.push('' +
										' <span id="ns1blankspacePayrollSuperannuationExpenseSearchClear" class="ns1blankspaceAction">Clear</span>' +
										'</td></tr>');
						}

						aHTML.push('<tr><td style="padding-top:15px; padding-bottom:0px; font-size:0.75em;" class="ns1blankspaceSub">' +
										'Expenses total</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseTotal" style="padding-top:0px; font-size:1.2em; padding-bottom:0px;" class="ns1blankspaceSub">' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:6px; padding-bottom:0px; font-size:0.75em;" class="ns1blankspaceSub">' +
										'Start date</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseStartDate" style="padding-top:0px; font-size:1.2em; padding-bottom:0px;" class="ns1blankspaceSub">' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:6px; padding-bottom:0px; font-size:0.75em;" class="ns1blankspaceSub">' +
										'End date</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseEndDate" style="padding-top:0px; font-size:1.2em; padding-bottom:16px;" class="ns1blankspaceSub">' +
										'</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseTotals" style="padding-top:0px; padding-bottom:12px;" class="ns1blankspaceSub">' +
										'</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseURLs" style="padding-top:0px; font-size:1em; padding-bottom:12px;" class="ns1blankspaceSub">' +
										'</td></tr>');

							aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseBanks" style="padding-top:0px; font-size:1em; padding-bottom:12px;" class="ns1blankspaceSub">' +
										'</td></tr>');
						
						aHTML.push('</table>');

						if ($('#ns1blankspacePayrollSuperannuationExpenseColumn2 table').length == 0)
						{
							$('#ns1blankspacePayrollSuperannuationExpenseColumn2').html(aHTML.join(''));
						}
						else
						{
							$('#ns1blankspacePayrollSuperannuationExpenseColumn2 table').before(aHTML.join(''));
						}

						$('#ns1blankspacePayrollSuperannuationExpenseSearchDate').datepicker({dateFormat: 'dd M yy'});

						$('#ns1blankspacePayrollSuperannuationExpenseSearch').button(
						{
							label: 'Search'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspacePayrollSuperannuationExpenseSearchText').val());
							oParam = ns1blankspace.util.setParam(oParam, 'searchDate', $('#ns1blankspacePayrollSuperannuationExpenseSearchDate').val());
							ns1blankspace.financial.payroll.superannuation.expenses(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspacePayrollSuperannuationExpenseSearchClear').button(
						{
							label: 'Clear'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', undefined);
							oParam = ns1blankspace.util.setParam(oParam, 'searchDate', $('#ns1blankspacePayrollSuperannuationExpenseSearchDate').val());
							ns1blankspace.financial.payroll.superannuation.expenses(oParam);
						})
						.css('width', '57px');

						$('#ns1blankspacePayrollSuperannuationExpenseSearchText').keyup(function(e)
						{
							if (e.which === 13)
					    	{
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspacePayrollSuperannuationExpenseSearchText').val());
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchDate', $('#ns1blankspacePayrollSuperannuationExpenseSearchDate').val());
					    		ns1blankspace.financial.payroll.superannuation.expenses(oParam);
					    	}
						});				

						$('#ns1blankspacePayrollSuperannuationExpenseSearchText').val(sSearchText);
						$('#ns1blankspacePayrollSuperannuationExpenseSearchDate').val(sSearchDate);

						if (ns1blankspace.financial.payroll.data.urls.superannuation.length != 0)
						{
							$('#ns1blankspacePayrollSuperannuationExpenseURLs').html(
								'<div style="font-size:0.75em;">Submit using...</div>' +
								_.join(_.map(ns1blankspace.financial.payroll.data.urls.superannuation, function (provider)
								{
									return '<div><a style="font-size:0.875em;" href="' + (provider.url.indexOf('http')==-1?'http://':'') + provider.url + '" target="_blank" title="' + provider.urllogon + '">' +
										 provider.title + '</a></div>'
								}), '')
							)
						}

						ns1blankspace.financial.payroll.superannuation.summary();
						ns1blankspace.financial.payroll.superannuation.refresh(
						{
							total: oResponse.summary.totalamount,
							startdate: oResponse.summary.startdate,
							enddate: oResponse.summary.enddate
						});

						ns1blankspace.financial.payroll.superannuation.banks();
					}
				},

	banks:	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var bankAccounts = _.filter(ns1blankspace.financial.data.bankaccounts, function (bankAccount)
						{
							return (bankAccount.bank != '')
						});

						bankAccounts = _.map(bankAccounts, function (bankAccount)
						{
							return bankAccount.bank
						});

						if (bankAccounts.length != 0)
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'CORE_URL_SEARCH';		
							oSearch.addField('title,url');
							oSearch.addFilter('title', 'IN_LIST', bankAccounts.join(','));
							oSearch.addFilter('url', 'TEXT_IS_NOT_EMPTY');
							oSearch.sort('private', 'desc');
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.superannuation.banks(oParam, data)});
						}	
					}
					else
					{
						var aHTML = [];

						if (oResponse.data.rows.length != 0)
						{
							aHTML.push('<table style="margin-top:0px;">');

							aHTML.push('<tr><td class="ns1blankspaceSub" style="padding-top:10px; font-size:0.75em;">Pay using ...</td></tr>')
										
							$.each(oResponse.data.rows, function (r, oRow)
							{
								aHTML.push('<tr><td style="font-size:0.825em;padding-top:6px;"><a href="' + (oRow.url.indexOf('http')==-1?'http://':'') + oRow.url + '" target="_blank">' +
										 oRow.title + '</a></td></tr>');
							});

							aHTML.push('</table>')

							$('#ns1blankspacePayrollSuperannuationExpenseBanks').html(aHTML.join(''));
						}
					}
				},						

	refresh: function (oParam)
				{
					var cTotal = ns1blankspace.util.getParam(oParam, 'total').value;
					var sStartDate = ns1blankspace.util.getParam(oParam, 'startdate').value;
					var sEndDate = ns1blankspace.util.getParam(oParam, 'enddate').value;

					var sTotal = ns1blankspace.option.currencySymbol + numeral(cTotal).format('(0,0.00)');
					$('#ns1blankspacePayrollSuperannuationExpenseTotal').html(sTotal);

					$('#ns1blankspacePayrollSuperannuationExpenseStartDate').html(moment(sStartDate, ns1blankspace.option.dateFormats).format('D MMM YYYY'));
					$('#ns1blankspacePayrollSuperannuationExpenseEndDate').html(moment(sEndDate, ns1blankspace.option.dateFormats).format('D MMM YYYY'));
				},						

	row: 		function (oRow)	
				{
					var aHTML = [];

					oRow.hasEmail = false;
					
					var sContact = oRow['contactbusinesspaidtotext'];
					if (sContact == '') {sContact = oRow['contactpersonpaidtotext']}

					ns1blankspace.financial.payroll.superannuation.data.expenses.push(oRow);

					aHTML.push('<tr class="ns1blankspaceRow">');

					/*				'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspacePayrollSuperannuationExpense_selectContainer-' + oRow["id"] + '">' +
									'<input type="checkbox" checked="checked" id="ns1blankspacePayrollSuperannuationExpense_select-' + oRow["id"] + '"' + 
									' title="' + oRow["reference"] + '"' +
									' data-outstandingamount="' + oRow["outstandingamount"].replace(',', '') + '" /></td>');
					*/

					aHTML.push('<td id="ns1blankspacePayrollSuperannuationExpense_contact-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										sContact + '</td>');

					aHTML.push('<td id="ns1blankspacePayrollSuperannuationExpense_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
									'<div>' + oRow["description"] + '</div><div class="ns1blankspaceSubNote">' + oRow["reference"] + '</div></td>');

					aHTML.push('<td id="ns1blankspacePayrollSuperannuationExpense_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
									oRow["outstandingamount"] + '</td>'); 

					aHTML.push('<td id="ns1blankspacePayrollSuperannuationExpense_paymentduedate-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' +
									ns1blankspace.util.fd(oRow["accrueddate"]) + '</td>');

					aHTML.push('<td style="text-align:right;" class="ns1blankspaceRow">');

					aHTML.push('<span style="margin-right:5px;" id="ns1blankspacePayrollSuperannuationExpense_option_preview-' + oRow['id'] + '"' +
									' class="ns1blankspaceRowPreview"></span>');

					aHTML.push('<span id="ns1blankspacePayrollSuperannuationExpense_option-' + oRow['id'] + '-1"' +
									' class="ns1blankspaceRowView"></span></td>');
					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function ()
				{
					$('#ns1blankspacePayrollSuperannuationExpense .ns1blankspaceRowView').button(
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

					$('.ns1blankspacePayrollSuperannuationExpenseSelectAll').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-check"
						}
					})
					.click(function()
					{	
						$('#ns1blankspacePayrollSuperannuationExpense input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
						ns1blankspace.financial.payroll.superannuation.refresh();
					})
					.css('width', '14px');

					$('#ns1blankspacePayrollSuperannuationExpense input:checked').click(function()
					{	
						ns1blankspace.financial.payroll.superannuation.refresh();
						ns1blankspace.financial.payroll.superannuation.summary();
					})

					//ns1blankspace.financial.payroll.superannuation.refresh();			
				},

	urls:		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_URL_SEARCH';		
						oSearch.addField('title,notes,url,urllogon');
						oSearch.addBracket('(')
						oSearch.addFilter('title', 'TEXT_IS_LIKE', 'Superannuation');
						oSearch.addOperator('or')
						oSearch.addFilter('notes', 'TEXT_IS_LIKE', 'Superannuation');
						oSearch.addOperator('or')
						oSearch.addFilter('title', 'TEXT_IS_LIKE', 'Workers Insurance');
						oSearch.addOperator('or')
						oSearch.addFilter('notes', 'TEXT_IS_LIKE', 'Workers Insurance');
						oSearch.addBracket(')')
						oSearch.sort('private', 'desc');
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.superannuation.urls(oParam, data)});
					}
					else
					{
						ns1blankspace.financial.payroll.data.urls = 
						{
							superannuation: _.filter(oResponse.data.rows, function (row)
							{
								return (_.includes(row.title.toLowerCase(), 'superannuation') || _.includes(row.notes.toLowerCase(), 'superannuation'))
							}),

							insurance: _.filter(oResponse.data.rows, function (row)
							{
								return (_.includes(row.title.toLowerCase(), 'workers insurance') || _.includes(row.notes.toLowerCase(), 'workers insurance'))
							})
						}

						ns1blankspace.util.onComplete(oParam);
					}
				},

	providers:	
				function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
						oSearch.addField('supercontactbusiness');
						oSearch.addFilter('supercontactbusiness', 'IS_NOT_NULL');
						oSearch.rows = 1000;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.superannuation.providers(oParam, data)});
					}
					else
					{
						ns1blankspace.financial.payroll.superannuation.data.providers = oResponse.data.rows;
						ns1blankspace.util.onComplete(oParam);
					}
				}			
}

ns1blankspace.financial.payroll.insurance =
{
	data: 	{},

	init: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.endPoint = 'contact';
						oSearch.method = 'CONTACT_BUSINESS_SEARCH';
						oSearch.addField( 'tradename,legalname,abn,streetcountry');						
						oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.user.contactBusiness);
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.insurance.init(oParam, data)}) 
					}
					else
					{
						ns1blankspace.financial.payroll.insurance.data.contactBusiness = oResponse.data.rows[0];
						ns1blankspace.financial.payroll.insurance.show(oParam)
					}
				},

	show: 	function (oParam, oResponse)
				{
					var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
					var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;

					if (oParam == undefined)
					{	
						oParam = {}
					}	

					if (sStartDate === undefined)
					{
						sStartDate = Date.today().moveToMonth(6, -1).moveToFirstDayOfMonth().toString("dd MMM yyyy");
					}

					oParam.startDate = sStartDate;

					if (sEndDate === undefined)
					{
						sEndDate = Date.today().toString("dd MMM yyyy");
					}

					oParam.endDate = sEndDate;
					
					ns1blankspace.financial.payroll.data.startDate = sStartDate;
					ns1blankspace.financial.payroll.data.endDate = sEndDate;

					ns1blankspace.financial.payroll.data.context = 'totals';

					if (oResponse == undefined)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
								'<tr>' +
								'<td id="ns1blankspacePayrollInsuranceColumn1" class="ns1blankspaceColumn1Divider" style="width:100px; font-size: 0.875em; padding-right:10px;"></td>' +
								'<td id="ns1blankspacePayrollInsuranceColumn2" class="ns1blankspaceColumn1Divider" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
								'<td id="ns1blankspacePayrollInsuranceColumn3" class="ns1blankspaceColumn1Divider" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
								'<td id="ns1blankspacePayrollInsuranceColumn4" style="font-size: 0.925em; padding-left:10px; width:100px;"></td>' +
								'</tr>' +
								'</table>');	

						$('#ns1blankspaceMainInsurance').html(aHTML.join(''));	

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace" style="width:100%;">');
						
						aHTML.push('<tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePayrollInsuranceStartDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
							
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
										'To' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePayrollInsuranceEndDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
														
						aHTML.push('<tr><td style="padding-top:5px;">' +
										'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspacePayrollInsuranceRefresh">Refresh</span>' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:26px;" id="ns1blankspacePayrollInsuranceNotes">' +
										'</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspacePayrollInsuranceColumn1').html(aHTML.join(''));

						$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});

						$('#ns1blankspacePayrollInsuranceRefresh').button(
						{
							label: 'Refresh',
							icons:
							{
								primary: "ui-icon-arrowrefresh-1-e"
							}
						})
						.click(function()
						{
							ns1blankspace.financial.payroll.insurance.init(
							{
								startDate: $('#ns1blankspacePayrollInsuranceStartDate').val(),
								endDate: $('#ns1blankspacePayrollInsuranceEndDate').val()
							})
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">')
						
						if (ns1blankspace.financial.payroll.insurance.data.contactBusiness.tradename != '')
						{
							aHTML.push('<tr><td style="text-align:left;" class="ns1blankspaceCaption">Trade Name</td></tr>' +
								'<tr><td style="text-align:left;" data-id="' + ns1blankspace.financial.payroll.insurance.data.contactBusiness.id + '" data-object="contactBusiness" class="ns1blankspaceViewLink">' +
								ns1blankspace.financial.payroll.insurance.data.contactBusiness.tradename +
								'</td></tr>');
						}

						if (ns1blankspace.financial.payroll.insurance.data.contactBusiness.legalname != '')
						{
							aHTML.push('<tr><td style="text-align:left;  padding-top:10px;" class="ns1blankspaceCaption">Legal Name</td></tr>' +
								'<tr><td style="text-align:left;">' +
								ns1blankspace.financial.payroll.insurance.data.contactBusiness.legalname + 
								'</td></tr>');
						}

						if (ns1blankspace.financial.payroll.insurance.data.contactBusiness.abn != '')
						{
							aHTML.push('<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">ABN</td></tr>' +
								'<tr><td style="text-align:left;">' +
								ns1blankspace.financial.payroll.insurance.data.contactBusiness.abn +
								'</td></tr>');
						}

						aHTML.push('</table>');

						$('#ns1blankspacePayrollInsuranceColumn2').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">')

						if (ns1blankspace.option.employeeInsuranceURL != undefined && ns1blankspace.financial.payroll.insurance.data.contactBusiness.streetcountry.toLowerCase() != '')
						{
							if (ns1blankspace.option.employeeInsuranceURL[ns1blankspace.financial.payroll.insurance.data.contactBusiness.streetcountry.toLowerCase()] != undefined)
							{	
								aHTML.push('<tr><td style="text-align:left;">' +
									'<a href="' + ns1blankspace.option.employeeInsuranceURL[ns1blankspace.financial.payroll.insurance.data.contactBusiness.streetcountry.toLowerCase()] + '" target="_blank">' +
									'<span style="font-size:0.825em;">Find out more about employee insurance obligations...</span></a>' +
									'</td></tr>');
							}
						}

						if (ns1blankspace.financial.payroll.data.urls.insurance.length != 0)
						{
							aHTML.push('<tr><td style="text-align:left; padding-top:16px;">' +
								'<div class="ns1blankspaceSubNote">Manage your insurance using...</div>' +
								_.join(_.map(ns1blankspace.financial.payroll.data.urls.insurance, function (provider)
								{
									return '<div><a style="font-size:0.875em;" href="' + (provider.url.indexOf('http')==-1?'http://':'') + provider.url + '" target="_blank" title="' + provider.urllogon + '">' +
										 provider.title + '</a></div>'
								}), '')
							);

							aHTML.push('</td></tr>');
						}

						aHTML.push('</table>');

						$('#ns1blankspacePayrollInsuranceColumn4').html(aHTML.join(''));
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
						oSearch.addField('payrecord.employee.contactperson,payrecord.employee.contactpersontext,payrecord.employee.employeenumber,' +
											'sum(grosssalary) grosssalary,sum(netsalary) netsalary,sum(deductions) deductions,sum(superannuation) superannuation,sum(taxbeforerebate) taxbeforerebate');
						oSearch.addSummaryField('sum(grosssalary) grosssalary');
						oSearch.addSummaryField('sum(superannuation) superannuation');
						
						if (sStartDate != undefined)
						{
							oSearch.addFilter('payrecord.payperiod.paydate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
							$('#ns1blankspacePayrollInsuranceStartDate').val(sStartDate);
						}
							
						if (sEndDate != undefined)
						{
							oSearch.addFilter('payrecord.payperiod.paydate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
							$('#ns1blankspacePayrollInsuranceEndDate').val(sEndDate);
						}

						oSearch.sort('payrecord.employee.contactperson', 'asc');
						oSearch.rows = 200;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.insurance.show(oParam, data)});	
					}
					else
					{
						ns1blankspace.financial.payroll.insurance.data.payrecords = oResponse;

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">' +
							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Gross Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.grosssalary).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +		
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Superannuation</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.superannuation).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Total Payroll</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							numeral(numeral(oResponse.summary.grosssalary).value() + numeral(oResponse.summary.superannuation).value()).format('(0,0.00)') + 
							'</td></tr>' +
							'</table>');

						$('#ns1blankspacePayrollInsuranceColumn3').html(aHTML.join(''));
					}	
				}
}

ns1blankspace.financial.payroll.dashboard =
{
	data: 	{},

	init: 	function (oParam)
				{	
					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
							'<tr>' +
							'<td id="ns1blankspacePayrollDashboardColumn1" class="ns1blankspaceColumn1Divider" style="width:100px; font-size: 0.875em; padding-right:10px;"></td>' +
							'<td id="ns1blankspacePayrollDashboardColumn2" class="ns1blankspaceColumn1Divider" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
							'<td id="ns1blankspacePayrollDashboardColumn3" class="ns1blankspaceColumn1Divider" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
							'<td id="ns1blankspacePayrollDashboardColumn4" style="font-size: 0.925em; padding-left:10px; width:100px;"></td>' +
							'</tr>' +
							'</table>');	

					$('#ns1blankspaceMainDashboard').html(aHTML.join(''));	

					var aHTML = [];
					
					aHTML.push('<table class="ns1blankspace" style="width:100%;">');
					
					aHTML.push('<tr>' +
									'<tr><td class="ns1blankspaceDate">' +
									'<input id="ns1blankspacePayrollDashboardStartDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
									'</td></tr>');
						
					aHTML.push('<tr>' +
									'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
									'To' +
									'</td></tr>' +
									'<tr><td class="ns1blankspaceDate">' +
									'<input id="ns1blankspacePayrollDashboardEndDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
									'</td></tr>');
													
					aHTML.push('<tr><td style="padding-top:5px;">' +
									'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspacePayrollDashboardRefresh">Refresh</span>' +
									'</td></tr>');

					aHTML.push('<tr><td style="padding-top:26px;" id="ns1blankspacePayrollDashboardNotes">' +
									'</td></tr>');

					aHTML.push('</table>');					
					
					$('#ns1blankspacePayrollDashboardColumn1').html(aHTML.join(''));

					$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});

					$('#ns1blankspacePayrollDashboardRefresh').button(
					{
						label: 'Refresh',
						icons:
						{
							primary: "ui-icon-arrowrefresh-1-e"
						}
					})
					.click(function()
					{
						ns1blankspace.financial.payroll.dashboard.refresh(
						{
							startDate: $('#ns1blankspacePayrollDashboardStartDate').val(),
							endDate: $('#ns1blankspacePayrollDashboardEndDate').val()
						})
					});

					var sContractorAccountText = ns1blankspace.option.payrollContractorAccountText;
					if (sContractorAccountText == undefined) {sContractorAccountText = 'contract'}

					var aHTML = [];
						
					ns1blankspace.financial.payroll.dashboard.data._contractorAccounts = $.grep(ns1blankspace.financial.data.accounts, function (account)
					{
						return (account.title.toLowerCase().indexOf(sContractorAccountText) != -1 && account.type == 1)
					});

					aHTML.push('<table class="ns1blankspace" style="width:100%;">');
					
					aHTML.push('<tr>' +
									'<tr><td class="ns1blankspaceSubNote">' +
									'Contacting amounts are based on expenses or payments with items linked to "' +
									$.map(ns1blankspace.financial.payroll.dashboard.data._contractorAccounts, function (account)
									{
										return account.title
									}).join(', ') + '", ' +
									' as they contain the text "' + sContractorAccountText + '".' +
									'</td></tr>');
			
					aHTML.push('</table>');					
					
					$('#ns1blankspacePayrollDashboardColumn4').html(aHTML.join(''));

					ns1blankspace.financial.payroll.dashboard.data.contractorAccounts =
							$.map(ns1blankspace.financial.payroll.dashboard.data._contractorAccounts, function (account)
							{
								return account.id
							});

					oParam = ns1blankspace.util.setParam(oParam, 'refresh', false);
					ns1blankspace.financial.payroll.dashboard.refresh(oParam);
				},			

	refresh: function (oParam, oResponse)
				{	
					var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
					var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;

					if (oParam == undefined)
					{	
						oParam = {}
					}	

					if (sStartDate === undefined)
					{
						sStartDate = Date.today().moveToMonth(6, -1).moveToFirstDayOfMonth().toString("dd MMM yyyy");
					}

					oParam.startDate = sStartDate;

					if (sEndDate === undefined)
					{
						sEndDate = Date.today().toString("dd MMM yyyy");
					}

					oParam.endDate = sEndDate;
					
					ns1blankspace.financial.payroll.data.startDate = sStartDate;
					ns1blankspace.financial.payroll.data.endDate = sEndDate;

					if (ns1blankspace.financial.payroll.dashboard.data.contractorAccounts.length == 0)
					{
						ns1blankspace.financial.payroll.dashboard.employees(oParam)
					}
					else
					{
						ns1blankspace.financial.payroll.dashboard.contractor.expenses(oParam);
					}
				},

	employees: function (oParam, oResponse)
				{
					var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;

					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
						oSearch.addField('employee.contactpersontext,employee.employmentenddate,employee.statustext,employee.contactperson.firstname,employee.contactperson.surname');

						if (sStartDate != undefined)
						{
							oSearch.addBracket('(');
							oSearch.addFilter('employee.employmentenddate', 'IS_NULL');
							oSearch.addOperator('or');
							oSearch.addFilter('employee.employmentenddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
							oSearch.addBracket(')');
						}

						oSearch.rows = 999;
						oSearch.sort('employee.contactperson.firstname', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.dashboard.employees(oParam, data)});
					}
					else
					{
						ns1blankspace.financial.payroll.dashboard.data.employees = oResponse.data.rows;
						ns1blankspace.financial.payroll.dashboard.show(oParam)
					}	
				},		

	contractor:
				{
					expenses: function (oParam, oResponse)
					{
						var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
						var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;

						if (oResponse == undefined)
						{
							ns1blankspace.status.working('Contractor Expenses');

							ns1blankspace.financial.payroll.dashboard.data.contractorIDs = $.map($('#ns1blankspacePayrollDashboardContractors input:checked'), function (input) {return input.id.split('-')[1]});

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_ITEM_SEARCH';
							oSearch.addField('lineitem.expense.contactbusinesspaidtotext,lineitem.expense.contactbusinesspaidto,sum(amount) totalamount,sum(tax) totaltax');
							oSearch.addFilter('financialaccount', 'IN_LIST', ns1blankspace.financial.payroll.dashboard.data.contractorAccounts.join(','));
							oSearch.addFilter('object', 'EQUAL_TO', 2)

							if (sStartDate != undefined)
							{
								oSearch.addFilter('lineitem.expense.accrueddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
							}
								
							if (sEndDate != undefined)
							{
								oSearch.addFilter('lineitem.expense.accrueddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
							}

							if (ns1blankspace.financial.payroll.dashboard.data.contractorIDs.length > 0)
							{
								oSearch.addFilter('lineitem.expense.contactbusinesspaidto', 'IN_LIST', ns1blankspace.financial.payroll.dashboard.data.contractorIDs.join(','));
							}

							oSearch.rows = 9999;
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.dashboard.contractor.expenses(oParam, data)});	
						}
						else
						{
							$.each(oResponse.data.rows, function (r, row)
							{
								row.contactbusinesstext = row['lineitem.expense.contactbusinesspaidtotext'];
								row.contactbusiness = row['lineitem.expense.contactbusinesspaidto'];
							});

							ns1blankspace.financial.payroll.dashboard.data.contractors = oResponse.data.rows;
							ns1blankspace.financial.payroll.dashboard.data.contractorExpenses = numeral(_.sumBy(oResponse.data.rows, function (row) {return numeral(row.totalamount).value()})).value();
							ns1blankspace.financial.payroll.dashboard.data.contractorExpensesTax = numeral(_.sumBy(oResponse.data.rows, function (row) {return numeral(row.totaltax).value()})).value();
							ns1blankspace.financial.payroll.dashboard.contractor.payments(oParam);
						}
					},

					payments: function (oParam, oResponse)
					{
						var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
						var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;

						if (oResponse == undefined)
						{
							ns1blankspace.status.working('Contractor Expenses');

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_ITEM_SEARCH';
							oSearch.addField('lineitem.payment.contactbusinesspaidtotext,lineitem.payment.contactbusinesspaidto,sum(amount) totalamount,sum(tax) totaltax');
							oSearch.addFilter('financialaccount', 'IN_LIST', ns1blankspace.financial.payroll.dashboard.data.contractorAccounts.join(','));
							oSearch.addFilter('object', 'EQUAL_TO', 3)

							if (sStartDate != undefined)
							{
								oSearch.addFilter('lineitem.payment.paiddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
							}
								
							if (sEndDate != undefined)
							{
								oSearch.addFilter('lineitem.payment.paiddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
							}

							if (ns1blankspace.financial.payroll.dashboard.data.contractorIDs.length > 0)
							{
								oSearch.addFilter('lineitem.payment.contactbusinesspaidto', 'IN_LIST', ns1blankspace.financial.payroll.dashboard.data.contractorIDs.join(','));
							}

							oSearch.rows = 9999;
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.dashboard.contractor.payments(oParam, data)});	
						}
						else
						{
							ns1blankspace.financial.payroll.dashboard.data.contractorExpenses = 
								ns1blankspace.financial.payroll.dashboard.data.contractorExpenses + numeral(_.sumBy(oResponse.data.rows, function (row) {return numeral(row.totalamount).value()})).value();

							ns1blankspace.financial.payroll.dashboard.data.contractorExpensesTax = 
								ns1blankspace.financial.payroll.dashboard.data.contractorExpensesTax + numeral(_.sumBy(oResponse.data.rows, function (row) {return numeral(row.totaltax).value()})).value();

							$.each(oResponse.data.rows, function (r, row)
							{
								row.contactbusinesstext = row['lineitem.payment.contactbusinesspaidtotext'];
								row.contactbusiness = row['lineitem.payment.contactbusinesspaidto'];
							});

							ns1blankspace.financial.payroll.dashboard.data.contractors =
								_.concat(ns1blankspace.financial.payroll.dashboard.data.contractors, oResponse.data.rows);
							
							ns1blankspace.financial.payroll.dashboard.employees(oParam);
						}
					}
				},		

	show: 	function (oParam, oResponse)
				{
					var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default": ns1blankspace.financial.data.defaults.startdate}).value;
					var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default": ns1blankspace.financial.data.defaults.enddate}).value;
					var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": true}).value;

					ns1blankspace.financial.payroll.data.context = 'totals';

					if (oResponse == undefined)
					{
						ns1blankspace.status.working('Payroll');

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
						oSearch.addField('payrecord.employee.contactperson,payrecord.employee.contactpersontext,payrecord.employee.employeenumber,payrecord.employee.id,' +
											'sum(grosssalary) grosssalary,sum(netsalary) netsalary,sum(deductions) deductions,sum(superannuation) superannuation,sum(taxbeforerebate) taxbeforerebate');
						oSearch.addSummaryField('sum(grosssalary) grosssalary');
						oSearch.addSummaryField('sum(superannuation) superannuation');
						
						if (sStartDate != undefined)
						{
							oSearch.addFilter('payrecord.payperiod.paydate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
							$('#ns1blankspacePayrollDashboardStartDate').val(sStartDate);
						}
							
						if (sEndDate != undefined)
						{
							oSearch.addFilter('payrecord.payperiod.paydate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
							$('#ns1blankspacePayrollDashboardEndDate').val(sEndDate);
						}

						if ($('#ns1blankspacePayrollDashboardEmployees').length != 0)
						{
							ns1blankspace.financial.payroll.dashboard.data.employeeIDs = $.map($('#ns1blankspacePayrollDashboardEmployees input:checked'), function (input) {return input.id.split('-')[1]});
							
							if (ns1blankspace.financial.payroll.dashboard.data.employeeIDs.length > 0)
							{
								oSearch.addFilter('payrecord.employee.id', 'IN_LIST', ns1blankspace.financial.payroll.dashboard.data.employeeIDs.join(','));
							}
						}

						oSearch.sort('payrecord.employee.contactperson', 'asc');
						oSearch.rows = 200;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.dashboard.show(oParam, data)});	
					}
					else
					{
						ns1blankspace.status.clear();

						ns1blankspace.financial.payroll.dashboard.data.payrecords = oResponse;

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">' +
							'<tr><td class="ns1blankspaceHeaderCaption">PAYROLL</td></tr>' +
							
							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Total Amount</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							numeral(numeral(oResponse.summary.grosssalary).value() + numeral(oResponse.summary.superannuation).value()).format('(0,0.00)') + 
							'</td></tr>' +

							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Superannuation</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.superannuation).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +

							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Gross Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.grosssalary).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +		

							'<tr><td id="ns1blankspacePayrollDashboardEmployees"><td></tr>' +
							'</table>');

						$('#ns1blankspacePayrollDashboardColumn2').html(aHTML.join(''));

						var aHTML = [];

						var cSuperannuationPercentage = ns1blankspace.option.PayrollSuperannuationPercentage;
						if (cSuperannuationPercentage == undefined) {cSuperannuationPercentage = 9.5}

						var cTotalExGST = numeral(ns1blankspace.financial.payroll.dashboard.data.contractorExpenses).value() -
									numeral(ns1blankspace.financial.payroll.dashboard.data.contractorExpensesTax).value()

						aHTML.push('<table class="ns1blankspace" style="width:100%;">' +
							'<tr><td class="ns1blankspaceHeaderCaption">CONTRACTING</td></tr>' +
							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Total including ' + ns1blankspace.option.taxVATCaption + '</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							numeral(ns1blankspace.financial.payroll.dashboard.data.contractorExpenses).format('(0,0.00)') + 
							'</td></tr>' +	

							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Total ' + ns1blankspace.option.taxVATCaption + 
							'</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							numeral(ns1blankspace.financial.payroll.dashboard.data.contractorExpensesTax).format('(0,0.00)') + 
							'</td></tr>' +

							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Total excluding ' + ns1blankspace.option.taxVATCaption + '</td></tr>' +

							//'<br /><span class="ns1blankspaceSubNote">minus addition of nominal ' + cSuperannuationPercentage + '% for superannuation<br />for comparison to payroll.</span></td></tr>' +
							//numeral(numeral(cTotalExGST).value() - (numeral(cTotalExGST).value() * numeral(cSuperannuationPercentage/100).value())).format('(0,0.00)') + 

							'<tr><td style="text-align:left;">$' +
							numeral(numeral(cTotalExGST).value()).format('(0,0.00)') + 
							'</td></tr>' +

							'<tr><td id="ns1blankspacePayrollDashboardContractors"><td></tr>' +

							'</table>');

						//'<br /><span class="ns1blankspaceSubNote">minus addition of nominal ' + cSuperannuationPercentage + '% for superannuation<br />for comparison to payroll.</span>' +
						//numeral(numeral(cTotalExGST).value() - (numeral(cTotalExGST).value() * numeral(cSuperannuationPercentage/100).value())).format('(0,0.00)') + 

						$('#ns1blankspacePayrollDashboardColumn3').html(aHTML.join(''));

						var aHTML = [];

						if (ns1blankspace.financial.payroll.dashboard.data.employees.length < 20)
						{
							aHTML.push('<table id="ns1blankspacePayrollDashboardEmployees" class="ns1blankspace" style="margin-top:16px;">' +
												'<tr class="ns1blankspaceCaption">' +
												'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspacePayrollDashboardEmployeesSelectAll"></span></td>' +
												'<td class="ns1blankspaceHeaderCaption">Employees</td>');

							$.each(ns1blankspace.financial.payroll.dashboard.data.employees, function (e, employee)
							{
								aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspaceDashboardEmployees_container-' + employee.id + '">' +
													'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspaceDashboardEmployees_selectContainer-' + employee.id + '">' +
													'<input type="checkbox" id="ns1blankspaceDashboardEmployees_select-' + employee.id + '" /></td>');

								aHTML.push('<td id="ns1blankspaceDashboardEmployees_employee" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
													(employee["employee.contactperson.firstname"] != ''?'<div>' + employee["employee.contactperson.firstname"] + '</div>':'') +
													'<div>' + employee["employee.contactperson.surname"] + '</div>' +
													'</td></tr>');
							});

							aHTML.push('</table>');

							$('#ns1blankspacePayrollDashboardEmployees').html(aHTML.join(''));

							if (ns1blankspace.financial.payroll.dashboard.data.employeeIDs == undefined)
							{
								$('#ns1blankspacePayrollDashboardEmployees input').prop('checked', true);
							}
							else if (ns1blankspace.financial.payroll.dashboard.data.employeeIDs.length == 0)
							{
								$('#ns1blankspacePayrollDashboardEmployees input').prop('checked', true);
							}
							else
							{
								$.each(ns1blankspace.financial.payroll.dashboard.data.employeeIDs, function (i, sID)
								{
									$('#ns1blankspaceDashboardEmployees_select-' + sID).prop('checked', true);
								});	
							}

							$('.ns1blankspacePayrollDashboardEmployeesSelectAll').button(
							{
								text: false,
								icons:
								{
									primary: "ui-icon-check"
								}
							})
							.click(function()
							{	
								$('#ns1blankspacePayrollDashboardEmployees input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
							})
							.css('width', '14px');	
						}

						var aHTML = [];

						if (ns1blankspace.financial.payroll.dashboard.data.contractors.length < 20)
						{
							aHTML.push('<table id="ns1blankspacePayrollDashboardContractors" class="ns1blankspace" style="margin-top:16px;">' +
												'<tr class="ns1blankspaceCaption">' +
												'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspacePayrollDashboardContractorsSelectAll"></span></td>' +
												'<td class="ns1blankspaceHeaderCaption">Contractors</td>');

							$.each(ns1blankspace.financial.payroll.dashboard.data.contractors, function (c, contractor)
							{
								aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspaceDashboardContractors_container-' + contractor.contactbusiness + '">' +
													'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspaceDashboardContractors_selectContainer-' + contractor.contactbusiness + '">' +
													'<input type="checkbox" id="ns1blankspaceDashboardContractors_select-' + contractor.contactbusiness + '" /></td>');

								aHTML.push('<td id="ns1blankspaceDashboardContractors_business" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
													'<div>' + contractor["contactbusinesstext"] + '</div>' +
													'</td></tr>');
							});

							aHTML.push('</table>');

							$('#ns1blankspacePayrollDashboardContractors').html(aHTML.join(''));

							if (ns1blankspace.financial.payroll.dashboard.data.contactorIDs == undefined)
							{
								$('#ns1blankspacePayrollDashboardContractors input').prop('checked', true);
							}
							else if (ns1blankspace.financial.payroll.dashboard.data.contractorIDs.length == 0)
							{
								$('#ns1blankspacePayrollDashboardContractors input').prop('checked', true);
							}
							else
							{
								$.each(ns1blankspace.financial.payroll.dashboard.data.contractorIDs, function (i, sID)
								{
									$('#ns1blankspaceDashboardContractors_select-' + sID).prop('checked', true);
								});	
							}

							$('.ns1blankspacePayrollDashboardContractorsSelectAll').button(
							{
								text: false,
								icons:
								{
									primary: "ui-icon-check"
								}
							})
							.click(function()
							{	
								$('#ns1blankspacePayrollDashboardContractors input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
							})
							.css('width', '14px');	
						}
					}	
				}
}

ns1blankspace.financial.payroll.util.superannuation =
{
	data: {},

	init: function (oParam, oResponse)
	{
		ns1blankspace.financial.payroll.util.superannuation.pays()
	},

	pays: function (oParam, oResponse)
	{
		var iPeriodID = ns1blankspace.util.getParam(oParam, 'period', {"default": ns1blankspace.objectContext});

		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
			oSearch.addField('payrecord.employee.contactperson,payrecord.employee.employeenumber,payrecord.employee.contactperson.firstname,payrecord.employee.contactperson.surname,payrecord.employee.id,superannuation,payrecord.employee.superannuationrate');
			oSearch.addFilter('period', 'EQUAL_TO', ns1blankspace.objectContext)
			oSearch.rows = 200;
			oSearch.sort('id', 'asc');
			oSearch.getResults(function(data) {ns1blankspace.financial.payroll.util.superannuation.pays(oParam, data)})	
		}
		else
		{
			ns1blankspace.financial.payroll.util.superannuation.data.pays = oResponse.data.rows;
			ns1blankspace.financial.payroll.util.superannuation.data.payIDs = $.map(ns1blankspace.financial.payroll.util.superannuation.data.pays, function(pay) {return pay.id});

			ns1blankspace.financial.payroll.util.superannuation.expenses()
		}
	},

	expenses: function (oParam, oResponse)
	{
		var iFinancialAccountSuperannuationID = ns1blankspace.financial.data.settings.payrollfinancialaccountsuperannuation;

		if (ns1blankspace.financial.payroll.util.superannuation.data.payIDs.length != 0)
		{
			if (oResponse == undefined )
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
				oSearch.addField('reference,amount');
				oSearch.addFilter('object', 'EQUAL_TO', 37);
				oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
				oSearch.rows = 9999;
				oSearch.sort('objectcontext', 'asc');
				oSearch.getResults(function(data) {ns1blankspace.financial.payroll.util.superannuation.expenses(oParam, data)})	
			}
			else
			{
				ns1blankspace.financial.payroll.util.superannuation.data.expenses = oResponse.data.rows;
				ns1blankspace.financial.payroll.util.superannuation.data.expenseIDs = $.map(ns1blankspace.financial.payroll.util.superannuation.data.expenses, function(expense) {return expense.id})
				if (ns1blankspace.financial.payroll.util.superannuation.data.expenses.length == 0)
				{
					console.log('! No Expenses');
				}
				else
				{
					ns1blankspace.financial.payroll.util.superannuation.financialItems();
				}	
			}
		}	
	},

	financialItems: function (oParam, oResponse)
	{
		var iFinancialAccountSuperannuationID = ns1blankspace.financial.data.settings.payrollfinancialaccountsuperannuation;

		if (ns1blankspace.financial.payroll.util.superannuation.data.payIDs.length != 0)
		{
			if (oResponse == undefined )
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_ITEM_SEARCH';
				oSearch.addField('otherobject, otherobjectcontext,amount');
				oSearch.addFilter('otherobject', 'EQUAL_TO', 131);
				oSearch.addFilter('object', 'EQUAL_TO', 2);
				oSearch.addFilter('objectcontext', 'IN_LIST', ns1blankspace.financial.payroll.util.superannuation.data.expenseIDs.join(','));
				oSearch.addFilter('financialaccount', 'EQUAL_TO', iFinancialAccountSuperannuationID);
				oSearch.rows = 9999;
				oSearch.sort('otherobjectcontext', 'asc');
				oSearch.getResults(function(data) {ns1blankspace.financial.payroll.util.superannuation.financialItems(oParam, data)})	
			}
			else
			{
				ns1blankspace.financial.payroll.util.superannuation.data.financialItems = oResponse.data.rows;
				ns1blankspace.financial.payroll.util.superannuation.data.financialItemsIDs = $.map(ns1blankspace.financial.payroll.util.superannuation.data.financialItems, function(item) {return item.id});
				ns1blankspace.financial.payroll.util.superannuation.process();	
			}
		}	
	},

	process: function (oParam, oResponse)
	{
		$.each(ns1blankspace.financial.payroll.util.superannuation.data.financialItems, function (i, item)
		{
			item._pay = $.grep(ns1blankspace.financial.payroll.util.superannuation.data.pays, function (pay)
			{
				return (pay['payrecord.employee.id'] == item['otherobjectcontext'])
			})[0];

			item.superannuationdue = 0;

			if (item._pay != undefined)
			{
				item.superannuationdue = numeral(item._pay.superannuation).value()
			}

			item.superannuationpaid = numeral(item.amount).value();
			item.superannuationtopaid = item.superannuationdue - item.superannuationpaid;
		});

		$.each(ns1blankspace.financial.payroll.util.superannuation.data.pays, function (p, pay)
		{
			pay._item = $.grep(ns1blankspace.financial.payroll.util.superannuation.data.financialItems, function (item)
			{
				return (pay['payrecord.employee.id'] == item['otherobjectcontext'])
			})[0];

			pay.superannuationpaid = 0;

			if (pay._item != undefined)
			{
				pay.superannuationpaid = numeral(pay._item.amount).value();
			}

			pay.superannuationdue = numeral(pay.superannuation).value();
			pay.superannuationtopay = pay.superannuationdue - pay.superannuationpaid;
		});

		ns1blankspace.financial.payroll.util.superannuation.data.paysSuperannuationToPay =
			$.grep(ns1blankspace.financial.payroll.util.superannuation.data.pays, function(pay) {return pay.superannuationtopay != 0});
	}
} 



