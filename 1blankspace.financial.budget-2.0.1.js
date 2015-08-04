/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.financial.budget =
{
	data: 		{process: {}, planned: [], actual: [], totals: {}},

	init: 		function (oParam)
				{
					var bInitialised = ns1blankspace.util.getParam(oParam, 'initialised', {"default": false}).value;

					ns1blankspace.app.reset();

					ns1blankspace.object = 284;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'budget';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Budget';
					
					if (!bInitialised)
					{
						ns1blankspace.financial.initData(oParam)
					}
					else
					{
						ns1blankspace.app.set(oParam);
					}	
				},

	refresh: 	function (oResponse)
				{
					if (oResponse == undefined)
					{
					var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_BUDGET_PROCESS_SEARCH';
						oSearch.addField('enddate');
						oSearch.rf = 'json';
						oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
						oSearch.getResults(function(data) {ns1blankspace.financial.budget.refresh(data)});
					}
					else
					{
						var oObjectContext = oResponse.data.rows[0];
						ns1blankspace.objectContextData.enddate = oObjectContext.enddate;	
						$vq.show('#ns1blankspaceControlContext_enddate', oObjectContext.enddate);
					}
				},			

	home: 		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						$vq.clear({queue: 'home'});
									
						$vq.add('<table class="ns1blankspaceMain">' + 
										'<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ns1blankspaceMain">' +
										ns1blankspace.xhtml.loading +
										'</td></tr></table>', {queue: 'home'});					
						
						$vq.render('#ns1blankspaceMain', {queue: 'home'});
											
						$vq.add('<table>' +
									'<tr><td><div id="ns1blankspaceViewReportLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>' +
									'</table>', {queue: 'home'});		
						
						$vq.render('#ns1blankspaceControl', {queue: 'home'});	

						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_BUDGET_SEARCH';
						oSearch.addField('notes,startdate,enddate');
						oSearch.rows = 10;
						oSearch.sort('enddate', 'desc');
						oSearch.getResults(function (data) {ns1blankspace.financial.budget.home(oParam, data)});
					}
					else
					{
						$vq.clear({queue: 'home'});
				
						if (oResponse.data.rows.length == 0)
						{
							$vq.add('<table id="ns1blankspaceMostLikely">' +
										'<tr><td class="ns1blankspaceNothing">Click New to add a budget.</td></tr>' +
										'</table>', {queue: 'home'});
						}
						else
						{
							$vq.add('<table id="ns1blankspaceMostLikely">' +
										'<tr><td class="ns1blankspaceCaption" colspan="4">MOST LIKELY</td></tr>', {queue: 'home'});
							
							$.each(oResponse.data.rows, function(r, row)
							{					
								$vq.add('<tr class="ns1blankspaceRow">', {queue: 'home'});
							
								$vq.add('<td id="ns1blankspaceMostLikely_startdate-' + row.id + '" class="ns1blankspaceMostLikely" style="width:125px;">' +
														row.startdate + '</td>', {queue: 'home'});

								$vq.add('<td id="ns1blankspaceMostLikely_enddate-' + row.id + '" class="ns1blankspaceMostLikely" style="width:125px;">' +
														row.enddate + '</td>', {queue: 'home'});
								
								$vq.add('<td id="ns1blankspaceMostLikely_notes-' + row.id + '" class="ns1blankspaceMostLikelySub" style="">' +
														row.notes + '</td>', {queue: 'home'});
																		
								$vq.add('</tr>', {queue: 'home'});
							});
							
							$vq.add('</table>', {queue: 'home'});
						}
						
						$vq.render('#ns1blankspaceMostLikely', {queue: 'home'});
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							 ns1blankspace.financial.budget.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function (sXHTMLElementId, oParam)
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
										$vq.show('#ns1blankspaceControl', ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_BUDGET_SEARCH';
										oSearch.addField('startdate,enddate,notes');
										oSearch.addField(ns1blankspace.option.auditFields);
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										oSearch.getResults(function(data) {ns1blankspace.financial.budget.show(oParam, data)});
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
											oSearch.method = 'FINANCIAL_BUDGET_SEARCH';
											oSearch.addField('startdate,enddate,notes');
											oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);
											
											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.sort('enddate', 'desc');
											oSearch.getResults(function(data) {ns1blankspace.financial.budget.search.process(oParam, data)});	
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
										$vq.clear({queue: 'search-process'});

										$vq.add('<table class="ns1blankspaceSearchMedium" style="width:400px;">', {queue: 'search-process'});
											
										$.each(oResponse.data.rows, function()
										{	
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												$vq.add('<tr class="ns1blankspaceSearch">', {queue: 'search-process'});
											}
										
											$vq.add('<td class="ns1blankspaceSearch" id="' +
															'search-' + this.id + '">' +
															this.notes + '</td>', {queue: 'search-process'});

											$vq.add('<td class="ns1blankspaceSearch" id="' +
														'search-' + this.id + '">' +
														this.enddate + '</td>', {queue: 'search-process'});
		
											if (iColumn == iMaximumColumns)
											{
												$vq.add('</tr>', {queue: 'search-process'});
												iColumn = 0;
											}	
										});
								    	
										$vq.add('</table>', {queue: 'search-process'});

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
											ns1blankspace.financial.budget.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'reference',
											more: oResponse.moreid,
											width: 400,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.financial.budget.search.send
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
					
						if (ns1blankspace.objectContext != -1)
						{
							aHTML.push('<table class="ns1blankspaceControl">');

							aHTML.push('<tr><td id="ns1blankspaceControlPlan" class="ns1blankspaceControl">' +
										'Plan</td></tr>');
							/*
							aHTML.push('<tr><td id="ns1blankspaceControlActual" class="ns1blankspaceControl" style="padding-top:8px;">' +
										'Actual</td></tr>');
							*/
							aHTML.push('<tr><td id="ns1blankspaceControlToday" class="ns1blankspaceControl" style="padding-top:8px;">' +
											'Today</td></tr>');

							aHTML.push('<tr><td id="ns1blankspaceControlProgress" class="ns1blankspaceControl" style="padding-top:8px;">' +
											'Month&nbsp;By<br />Month</td></tr>');
										
							aHTML.push('<table class="ns1blankspaceControl">');
						
							aHTML.push('<tr><td id="ns1blankspaceControlActions" class="ns1blankspaceControl">' +
											'Actions</td></tr>');
										
							aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');
						}
					}
									
					aHTML.push('</table>');					
							
					$('#ns1blankspaceControl').html(aHTML.join(''));

					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPlan" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActual" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainToday" class="ns1blankspaceControlMain" style="overflow:auto;"></div>');
					aHTML.push('<div id="ns1blankspaceMainProgress" class="ns1blankspaceControlMain" style="overflow:auto;"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary', refresh: true});
						ns1blankspace.financial.budget.summary();
					});

					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.financial.budget.details();
					});
					
					$('#ns1blankspaceControlPlan').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPlan', refresh: true});
						ns1blankspace.financial.budget.plan.show();
					});

					$('#ns1blankspaceControlActual').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainActual', refresh: true});
						ns1blankspace.financial.budget.actual.show();
					});

					$('#ns1blankspaceControlToday').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainToday', refresh: true});
						ns1blankspace.financial.budget.today.show();
					});

					$('#ns1blankspaceControlProgress').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainProgress', refresh: true});
						ns1blankspace.financial.budget.progress.show();
					});

					$('#ns1blankspaceControlActions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainActions', refresh: true});
						ns1blankspace.actions.show({xhtmlElementID: 'ns1blankspaceMainActions'});
					});

					$('#ns1blankspaceControlControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
						ns1blankspace.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments'});
					});
				},

	show:		function (oParam, oResponse)
				{
					ns1blankspace.app.clean();
					ns1blankspace.financial.budget.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this payment.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
								
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.startdate +
							'<br />' + ns1blankspace.objectContextData.enddate);
							
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.financial.budget.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.budget.summary()'});
					}	
				},

	process: 	{	
					init: 		function (oParam)
								{
									var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1, set: true}).value;
									
									if (iStep==1)
									{
										ns1blankspace.status.message('Refreshing...');
										oParam.step = 2;
										ns1blankspace.financial.budget.process.asat(oParam);
									}

									if (iStep==2)
									{
										oParam.step = 3
										ns1blankspace.financial.budget.process.totals(oParam);
									}

									if (iStep==3)
									{
										oParam.step = 4
										oParam.asat = ns1blankspace.objectContextData.enddate;
										oParam.namespace = 'end';
										oParam.refresh = true;
										ns1blankspace.financial.budget.process.asat(oParam);
									}

									if (iStep==4)
									{
										oParam.step = 5
										ns1blankspace.financial.budget.process.totals(oParam);
									}

									if (iStep==5)
									{
										oParam.step = 6
										ns1blankspace.financial.budget.process.planned(oParam);
									}

									if (iStep==6)
									{
										oParam.step = 7
										oParam.namespace = 'today';
										ns1blankspace.financial.budget.process.items(oParam);
									}

									if (iStep==7)
									{
										oParam.step = 8
										ns1blankspace.financial.budget.process.complete(oParam);
									}

									if (iStep==8)
									{
										ns1blankspace.status.clear();
										ns1blankspace.util.onComplete(oParam);
									}
								},

					asat:		function (oParam, oResponse)
								{
									var dAsAt = ns1blankspace.util.getParam(oParam, 'asat', {"default": Date.today().toString("dd MMM yyyy")}).value;
									var bAnyBefore = ns1blankspace.util.getParam(oParam, 'anyBefore', {"default": false}).value;
									var sNamespace = ns1blankspace.util.getParam(oParam, 'namespace', {"default": 'today'}).value;
									var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": true}).value;
									var iMonthIndex = ns1blankspace.util.getParam(oParam, 'monthIndex').value;

									if (iMonthIndex !== undefined)
									{
										dAsAt = ns1blankspace.financial.budget.data.months[iMonthIndex].end;
									}	

									var oSearch = new AdvancedSearch();
									oSearch.method = 'FINANCIAL_BUDGET_PROCESS_SEARCH';
									oSearch.addField('asat,budget,budgettext,periodpercentage,title');
									oSearch.addFilter('budget', 'EQUAL_TO', ns1blankspace.objectContext);
									oSearch.addFilter('asat', (bAnyBefore?'LESS_THAN_OR_EQUAL_TO':'EQUAL_TO'), dAsAt);
									oSearch.sort('asat', 'desc');
									
									oSearch.getResults(function(oResponse)
									{
										var oData =
										{
											budget: ns1blankspace.objectContext,
											asat: dAsAt,
											calculate: 'Y'
										}	

										if (oResponse.data.rows.length !== 0)
										{
											if (iMonthIndex != undefined)
											{
												ns1blankspace.financial.budget.data.months[iMonthIndex].process = oResponse.data.rows[0];
												oData.id = ns1blankspace.financial.budget.data.months[iMonthIndex].process.id;
											}
											else
											{
												ns1blankspace.financial.budget.data.process[sNamespace] = oResponse.data.rows[0];
												oData.id = ns1blankspace.financial.budget.data.process[sNamespace].id;
											}	
										}

										if (bRefresh)
										{
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_BUDGET_PROCESS_MANAGE'),
												data: oData,
												dataType: 'json',
												success: function(oResponse)
												{
													oParam.refresh = false;
													ns1blankspace.financial.budget.process.asat(oParam);
												}
											});
										}
										else	
										{	
											delete oParam.refresh;

											if (iMonthIndex != undefined && ns1blankspace.util.getParam(oParam, 'onComplete') != undefined)
											{
												ns1blankspace.util.onComplete(oParam);
											}	
											else
											{	
												ns1blankspace.financial.budget.process.init(oParam);
											}	
										}
									});
								},

					totals:		function (oParam, oResponse)
								{
									var sNamespace = ns1blankspace.util.getParam(oParam, 'namespace', {"default": 'today'}).value;
									var iMonthIndex = ns1blankspace.util.getParam(oParam, 'monthIndex').value;
									var iProcessID;

									var oNamespace = (iMonthIndex != undefined?ns1blankspace.financial.budget.data.months[iMonthIndex]:ns1blankspace.financial.budget.data.process[sNamespace])
									
									var oSearch = new AdvancedSearch();
									oSearch.method = 'FINANCIAL_BUDGET_PROCESS_ITEM_SEARCH';
									oSearch.addField('sum(plannedamount) totalplannedamount');
									oSearch.addField('sum(actualamount) totalactualamount');
									oSearch.addFilter('process', 'EQUAL_TO', oNamespace.id);
									oSearch.getResults(function(oResponse)
									{
										if (oResponse.data.rows.length !== 0)
										{	
											
											oNamespace = $.extend(true, oNamespace, oResponse.data.rows[0]);	
										}

										ns1blankspace.financial.budget.process.init(oParam);
									});
								},

					planned: 	function (oParam)
								{
									var oSearch = new AdvancedSearch();
									oSearch.method = 'FINANCIAL_BUDGET_ITEM_SEARCH';
									oSearch.addField('amount,budget,budgettext,id,financialaccount,financialaccounttext,month,monthtext,notes,' +
														'budgetitem.financialaccount.type');
									oSearch.addFilter('budget', 'EQUAL_TO', ns1blankspace.objectContext);
									oSearch.sort('month', 'asc');
									
									oSearch.getResults(function(oResponse)
									{
										ns1blankspace.financial.budget.data.planned = oResponse.data.rows;
										ns1blankspace.financial.budget.process.init(oParam);
									});
								},	

					items: 		function (oParam)
								{
									var sNamespace = ns1blankspace.util.getParam(oParam, 'namespace', {"default": 'today'}).value;
									var iMonthIndex = ns1blankspace.util.getParam(oParam, 'monthIndex').value;

									var oNamespace = (iMonthIndex != undefined?ns1blankspace.financial.budget.data.months[iMonthIndex].process:ns1blankspace.financial.budget.data.process[sNamespace])

									var oSearch = new AdvancedSearch();
									oSearch.method = 'FINANCIAL_BUDGET_PROCESS_ITEM_SEARCH';
									oSearch.addField('actualamount,financialaccount,financialaccounttext,plannedamount,process,processtext,' +
														'budgetprocessitem.financialaccount.type');

									oSearch.addFilter('process', 'EQUAL_TO', oNamespace.id);
									oSearch.addFilter('budgetprocessitem.financialaccount.type', 'IN_LIST', '1,2');

									oSearch.addBracket('(');
									oSearch.addFilter('plannedamount', 'NOT_EQUAL_TO', 0);
									oSearch.addOperator('or');
									oSearch.addFilter('actualamount', 'NOT_EQUAL_TO', 0);
									oSearch.addBracket(')');

									oSearch.sort('financialaccounttext', 'asc');
									oSearch.getResults(function(oResponse)
									{
										oNamespace.items = oResponse.data.rows;

										if (iMonthIndex != undefined && ns1blankspace.util.getParam(oParam, 'onComplete').exists)
										{
											ns1blankspace.util.onComplete(oParam);
										}
										else
										{	
											ns1blankspace.financial.budget.process.init(oParam);
										}	
									});
								},

					months: 	function (oParam)
								{
									var iMonthIndex = ns1blankspace.util.getParam(oParam, 'monthIndex', {"default": -1}).value;

									if (ns1blankspace.financial.budget.data.months==undefined)
									{	
										ns1blankspace.financial.budget.data.months = 
										ns1blankspace.visualise.util.months(
										{
											startDate: ns1blankspace.objectContextData.startdate,
											endDate: ns1blankspace.objectContextData.enddate
										});
									}

									++iMonthIndex;
									
									if (iMonthIndex < ns1blankspace.financial.budget.data.months.length)
									{
										ns1blankspace.status.message(ns1blankspace.financial.budget.data.months[iMonthIndex].name +
													' ' + ns1blankspace.financial.budget.data.months[iMonthIndex].year);

										oParam = ns1blankspace.util.setParam(oParam, 'monthIndex', iMonthIndex)
										oParam.month = ns1blankspace.financial.budget.data.months[iMonthIndex];
										oParam.refresh = true;
										oParam.onCompleteWhenCan = ns1blankspace.financial.budget.process.months;
										oParam.onComplete = ns1blankspace.financial.budget.process.items;
										ns1blankspace.financial.budget.process.asat(oParam);
									}
									else
									{
										var oPlannedAccumulatedTotal = {planned: {revenue: 0, expenses: 0}, actual: {revenue: 0, expenses: 0}} ;

										$.each(ns1blankspace.financial.budget.data.months, function (m, budgetmonth)
										{
											budgetmonth.process.totals = {month: {planned: {}, actual: {}}};

											var aAccounts = $.grep(budgetmonth.process.items, function (account) {return account['budgetprocessitem.financialaccount.type'] == 2});
											budgetmonth.process.totals.month.planned.revenue = _.reduce($.map(aAccounts, function (p) {return accounting.unformat(p.plannedamount)}), function(memo, num) {return memo + num;}, 0);
											budgetmonth.process.totals.month.actual.revenue = _.reduce($.map(aAccounts, function (p) {return accounting.unformat(p.actualamount)}), function(memo, num) {return memo + num;}, 0);

											var aAccounts = $.grep(budgetmonth.process.items, function (account) {return account['budgetprocessitem.financialaccount.type'] == 1});
											budgetmonth.process.totals.month.planned.expenses = _.reduce($.map(aAccounts, function (p) {return accounting.unformat(p.plannedamount)}), function(memo, num) {return memo + num;}, 0);
											budgetmonth.process.totals.month.actual.expenses = _.reduce($.map(aAccounts, function (p) {return accounting.unformat(p.actualamount)}), function(memo, num) {return memo + num;}, 0);
	
											oPlannedAccumulatedTotal.planned.revenue = budgetmonth.process.totals.month.planned.revenue;
											oPlannedAccumulatedTotal.planned.expenses = budgetmonth.process.totals.month.planned.expenses;
											oPlannedAccumulatedTotal.actual.revenue = budgetmonth.process.totals.month.actual.revenue;
											oPlannedAccumulatedTotal.actual.expenses = budgetmonth.process.totals.month.actual.expenses;

											budgetmonth.process.totals.accumulated = $.extend(true, {}, oPlannedAccumulatedTotal);
										});

										oParam.onComplete = oParam.onCompleteAtEnd;
										delete oParam.onCompleteAtEnd;
										ns1blankspace.util.onComplete(oParam);
									}
								},			

					complete: 	function (oParam)
								{
									ns1blankspace.financial.budget.data.months = 
										ns1blankspace.visualise.util.months(
										{
											startDate: ns1blankspace.objectContextData.startdate,
											endDate: ns1blankspace.objectContextData.enddate
										});

									var oPlannedAccumulatedTotal = {revenue: 0, expenses: 0};

									$.each(ns1blankspace.financial.budget.data.months, function (m, budgetmonth)
									{
										budgetmonth.data.totals = {month: {}, accumulated: {}};

										budgetmonth.data.planned = $.extend(true, [], $.grep(ns1blankspace.financial.budget.data.planned, function (planned) {return planned.month==budgetmonth.month}));
										budgetmonth.data.planned = budgetmonth.data.planned.concat($.grep(ns1blankspace.financial.budget.data.planned, function (planned) {return planned.month==-1}));

										budgetmonth.data.totals.month.planned = {}

										//Revenue
										var aAccounts = $.grep(budgetmonth.data.planned, function (account) {return account['budgetitem.financialaccount.type'] == 2});
										budgetmonth.data.totals.month.planned.revenue = _.reduce($.map(aAccounts, function (p) {return accounting.unformat(p.amount)}), function(memo, num) {return memo + num;}, 0);

										//Expenses
										var aAccounts = $.grep(budgetmonth.data.planned, function (account) {return account['budgetitem.financialaccount.type'] == 1});
										budgetmonth.data.totals.month.planned.expenses = _.reduce($.map(aAccounts, function (p) {return accounting.unformat(p.amount)}), function(memo, num) {return memo + num;}, 0);

										oPlannedAccumulatedTotal.revenue += budgetmonth.data.totals.month.planned.revenue;
										oPlannedAccumulatedTotal.expenses += budgetmonth.data.totals.month.planned.expenses;

										budgetmonth.data.totals.accumulated.planned = $.extend(true, {}, oPlannedAccumulatedTotal);
									});

									ns1blankspace.financial.budget.process.init(oParam);
								}										
				},						
	
	totals: 	{
					planned: 	function (oParam, oResponse)
								{
									var oData = ns1blankspace.financial.budget.data;
									
									var aAccounts;
									oData.totals = {planned: {revenue: 0, expenses: 0}}
									
									$.each(oData.months, function (m, month)
									{
										aAccounts = $.grep(month.data.planned, function (account) {return account['budgetitem.financialaccount.type'] == 2});
										oData.totals.planned.revenue += _.reduce($.map(aAccounts, function (p) {return accounting.unformat(p.amount)}), function(memo, num) {return memo + num;}, 0);

										aAccounts = $.grep(month.data.planned, function (account) {return account['budgetitem.financialaccount.type'] == 1});
										oData.totals.planned.expenses += _.reduce($.map(aAccounts, function (p) {return accounting.unformat(p.amount)}), function(memo, num) {return memo + num;}, 0);
									});

									oParam = ns1blankspace.util.setParam(oParam, 'refresh', false);
									ns1blankspace.util.onComplete(oParam);									
								}
				},		

	summary: 	function (oParam)
				{
					var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default":true}).value;

					if (bRefresh)
					{
						oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.budget.totals.planned)
						oParam = ns1blankspace.util.setParam(oParam, 'onCompleteWhenCan', ns1blankspace.financial.budget.summary)
						ns1blankspace.financial.budget.process.init(oParam);
					}
					else
					{
						$vq.clear({queue: 'summary'});

						if (ns1blankspace.objectContextData == undefined)
						{
							$vq.add('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the budget.</td></tr></table>', {queue: 'summary'});
									
							$vq.render('#ns1blankspaceMainSummary', {queue: 'summary'});
						}
						else
						{
							$vq.add('<table class="ns1blankspaceMain">' +
											'<tr class="ns1blankspaceRow">' +
											'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
											'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:350px;"></td>' +
											'</tr>' +
											'</table>', {queue: 'summary'});				
							
							$vq.render('#ns1blankspaceMainSummary', {queue: 'summary'});
							
							$vq.add('<table class="ns1blankspace">', {queue: 'summary'});

							$vq.add('<tr><td class="ns1blankspaceSummaryCaption">Planned Revenue</td></tr>' +
												'<tr><td id="ns1blankspaceSummaryNotes" class="ns1blankspaceSummary">$' +
												ns1blankspace.financial.budget.data.totals.planned.revenue +
												'</td></tr>', {queue: 'summary'});

							$vq.add('<tr><td class="ns1blankspaceSummaryCaption">Planned Expenses</td></tr>' +
												'<tr><td id="ns1blankspaceSummaryNotes" class="ns1blankspaceSummary">$' +
												ns1blankspace.financial.budget.data.totals.planned.expenses +
												'</td></tr>', {queue: 'summary'});

							$vq.add('</table>', {queue: 'summary'});

							$vq.render('#ns1blankspaceSummaryColumn1', {queue: 'summary'});

							$vq.add('<table class="ns1blankspaceColumn2">', {queue: 'summary'});

							$vq.add('<tr><td class="ns1blankspaceSummaryCaption">As At</td></tr>' +
												'<tr><td id="ns1blankspaceSummaryProcessAsAt" class="ns1blankspaceSummary">' +
												ns1blankspace.financial.budget.data.process.today.asat +
												'</td></tr>' +
												'<tr><td id="ns1blankspaceSummaryProcessAsAtPercentage" class="ns1blankspaceSubNote" style="padding-bottom:10px;">' +
												ns1blankspace.financial.budget.data.process.today.periodpercentage + '% through the budget.' +
												'</td></tr>', {queue: 'summary'});

							$vq.add('<tr><td class="ns1blankspaceSummaryCaption">Planned</td></tr>' +
												'<tr><td id="ns1blankspaceSummaryProcessTotalPlanned" class="ns1blankspaceSummary">$' +
												ns1blankspace.financial.budget.data.process.today.totalplannedamount +
												'</td></tr>', {queue: 'summary'});

							$vq.add('<tr><td class="ns1blankspaceSummaryCaption">Actual</td></tr>' +
												'<tr><td id="ns1blankspaceSummaryProcessTotalActual" class="ns1blankspaceSummary">$' +
												ns1blankspace.financial.budget.data.process.today.totalactualamount +
												'</td></tr>', {queue: 'summary'});

							$vq.add('<tr><td style="padding-top:8px;" class="ns1blankspaceAction">' +
												'<span id="ns1blankspaceSummaryRefresh" class="ns1blankspaceAction" style="font-size:0.875em; width:80px;">Refresh</span>' +
												'</td></tr>', {queue: 'summary'});

							$vq.add('</table>', {queue: 'summary'});

							$vq.render('#ns1blankspaceSummaryColumn2', {queue: 'summary'});

							$('#ns1blankspaceSummaryRefresh').button({})
							.click(function()
							{
								ns1blankspace.status.working('Refreshing...');

								var oData = {budget: ns1blankspace.objectContext}

								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('FINANCIAL_BUDGET_PROCESS_MANAGE'),
									data: oData,
									dataType: 'json',
									success: function(oResponse)
									{
										ns1blankspace.status.message('Processed');
										ns1blankspace.financial.budget.summary({refresh: false});
									}
								});
							});
						}	
					}	
				},

	details: 	function ()
				{
					$vq.clear({queue: 'details'});
				
					if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDetails').attr('data-loading', '');
								
						$vq.add('<table class="ns1blankspaceContainer">' +
									'<tr class="ns1blankspaceContainer">' +
									'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
									'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
									'</tr></table>', {queue: 'details'});

						$vq.render('#ns1blankspaceMainDetails', {queue: 'details'});							
						
						$vq.add('<table class="ns1blankspace">', {queue: 'details'});
						
						$vq.add('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Start Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsStartDate" class="ns1blankspaceDate">' +
										'</td></tr>', {queue: 'details'});

						$vq.add('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'End Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsEndDate" class="ns1blankspaceDate">' +
										'</td></tr>', {queue: 'details'});

						$vq.add('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea id="ns1blankspaceDetailsNotes" class="ns1blankspaceTextMulti" style="height:125px; width:100%;"></textarea>' +
										'</td></tr>', {queue: 'details'});		

						$vq.add('</table>', {queue: 'details'});									
						
						$vq.render('#ns1blankspaceDetailsColumn1', {queue: 'details'});	

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsStartDate').val(ns1blankspace.objectContextData.startdate);
							$('#ns1blankspaceDetailsEndDate').val(ns1blankspace.objectContextData.enddate);
							$('#ns1blankspaceDetailsNotes').val(ns1blankspace.objectContextData.notes);
						}
						else
						{
							$('#ns1blankspaceDetailsStartDate').val(Date.today().toString("dd MMM yyyy"));
						}
					}	
				},

	save: 		{
					send: 		function (oParam, oResponse)
								{
									ns1blankspace.status.working();
										
									var oData = {}

									if (ns1blankspace.objectContext != -1) {oData.id = ns1blankspace.objectContext};
										
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										oData.startdate = $('#ns1blankspaceDetailsStartDate').val();
										oData.enddate = $('#ns1blankspaceDetailsEndDate').val();
										oData.notes = $('#ns1blankspaceDetailsNotes').val();
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_BUDGET_MANAGE'),
										data: oData,
										dataType: 'json',
										success: function(data) {ns1blankspace.financial.budget.save.process(oParam, data)}
									});	
								},

					process:	function (oParam, oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');
										oParam = ns1blankspace.util.setParam(oParam, 'new', (ns1blankspace.objectContext == -1));
										ns1blankspace.objectContext = oResponse.id;	
										
										ns1blankspace.inputDetected = false;
										ns1blankspace.financial.budget.search.send('-' + ns1blankspace.objectContext, {source: 1});
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								},

					amount:		function (oParam)
								{
									var iAccount = $('#ns1blankspaceItemAccount').attr('data-id');
									if (iAccount === undefined) {iAccount = ns1blankspace.financial.data.settings.financialaccountcreditor};

									var cAmount = $('#ns1blankspaceDetailsAmount').val();
									if (cAmount == '') {cAmount = 0};

									var cTax = $('#ns1blankspaceDetailsTax').val();
									if (cTax == '') {cTax = 0};

									if (ns1blankspace.objectContextData)
									{	
										cAmount = (cAmount - ns1blankspace.objectContextData.amount);
										cTax = (cTax - ns1blankspace.objectContextData.tax);
									}	

									if ((cAmount == 0 && cTax == 0) || iAccount == undefined)
									{
										if (iAccount == undefined) {alert('No creditor account set up.')}
									}
									else
									{
										var sData = 'object=' + ns1blankspace.util.fs(ns1blankspace.object);
										sData += '&objectcontext=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
										sData += '&financialaccount=' + ns1blankspace.util.fs(iAccount);
										sData += '&amount=' + ns1blankspace.util.fs(cAmount);
										sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDescription').val());
										
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(oResponse)
											{
												var sData = 'object=' + ns1blankspace.object;
												sData += '&objectcontext=' + ns1blankspace.objectContext;
											
												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_COMPLETE'),
													data: sData,
													dataType: 'json',
													success: function(oResponse)
													{
														if (ns1blankspace.util.getParam(oParam, 'new').value)
														{
															ns1blankspace.inputDetected = false;
															ns1blankspace.financial.budget.search.send('-' + ns1blankspace.objectContext, {source: 1});
														}
														else
														{	
															ns1blankspace.financial.budget.refresh();
														}	
													}
												});
											}
										});
									}	
								}
				}													
}

ns1blankspace.financial.budget.plan =
{
	data: 	{},

	show:	function (oParam, oResponse)
			{
				var iBudget = ns1blankspace.objectContext;
				var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": false}).value;

				if (oResponse == undefined)
				{	
					if (!bRefresh)
					{	
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceContainer">');

						aHTML.push('<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspacePlanColumn1" class="ns1blankspaceColumn1Flexible">' +
										ns1blankspace.xhtml.loading + '</td>' +
										'<td id="ns1blankspacePlanColumn2" class="ns1blankspaceColumn2" style="width:275px;"></td>' +
										'</tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainPlan').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">' +
										'<tr><td class="ns1blankspaceAction">' +
										'<span id="ns1blankspacePlanAdd">Add</span>' +
										'</td></tr></table>');					
						
						$('#ns1blankspacePlanColumn2').html(aHTML.join(''));
					
						$('#ns1blankspacePlanAdd').button(
						{
							label: "Add"
						})
						.click(function()
						{
							oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', undefined);
							oParam = ns1blankspace.util.setParam(oParam, 'step', 1);
							ns1blankspace.financial.budget.plan.edit(oParam);
						});										
					}

					var oSearch = new AdvancedSearch();
					oSearch.method = 'FINANCIAL_BUDGET_ITEM_SEARCH';
					oSearch.addField('amount,budget,budgettext,id,financialaccount,financialaccounttext,month,monthtext,notes');
					oSearch.addFilter('budget', 'EQUAL_TO', iBudget);
					oSearch.sort('month', 'asc');
					
					oSearch.getResults(function(data) {ns1blankspace.financial.budget.plan.show(oParam, data)});
				}
				else
				{
					var aHTML = [];
				
					ns1blankspace.financial.budget.data.planned = oResponse.data.rows;
					
					if (oResponse.data.rows.length == 0)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">No plan.</td></tr></table>');

						$('#ns1blankspacePlanColumn1').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspace">');

						aHTML.push('<tr>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption">Month</td>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption style="width:125px;">Account</td>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
						aHTML.push('</tr>');

						$.each(oResponse.data.rows, function(r, row)
						{
							aHTML.push('<tr class="ns1blankspaceRow">');
													
							aHTML.push('<td id="ns1blankspaceItem_month-' + row.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePlanEdit">' +
											row.monthtext.replace('[All Months]', 'Every Month') + '</td>');
																		
							aHTML.push('<td id="ns1blankspaceItem_financialaccounttext-' + row.id + '" class="ns1blankspaceRow">' +
											row.financialaccounttext + '</td>');
							
							aHTML.push('<td id="ns1blankspaceItem_amount-' + row.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
											row.amount + '</td>');

							aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
							aHTML.push('<span id="ns1blankspaceRowPlan_options_remove-' + row.id + '" class="ns1blankspacePlanRemove"></span>');
							aHTML.push('</td></tr>');
						});
						
						aHTML.push('</table>');

						$('#ns1blankspacePlanColumn1').html(aHTML.join(''));
						
						$('.ns1blankspacePlanRemove').button(
						{
							text: false,
							icons: {
								primary: "ui-icon-close"
							}
						})
						.click(function()
						{
							ns1blankspace.remove(
							{
								xhtmlElementID: this.id,
								method: 'FINANCIAL_BUDGET_ITEM_MANAGE',
								ifNoneMessage: 'No plan items.'
							});
						})
						.css('width', '15px')
						.css('height', '17px');
				
						$('.ns1blankspacePlanEdit').click(function()
						{
							oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', this.id);
							oParam = ns1blankspace.util.setParam(oParam, 'step', 1);
							ns1blankspace.financial.budget.plan.edit(oParam)
						});
					}
				}	
			},

	edit:	function (oParam, oResponse)
			{
				var iFinancialAccountType;

				var iType = ns1blankspace.util.getParam(oParam, 'type').value;		
				var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1}).value;
				var sNamespace = ns1blankspace.util.getParam(oParam, 'namespace').value;
				var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
				
				if (oResponse == undefined)
				{
					if (iStep == 1)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceContainer">');

						aHTML.push('<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspacePlanEditColumn1"></td>' +
										'<td id="ns1blankspacePlanEditColumn2" style="width:50px;"></td>' +
										'</tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspacePlanColumn2').html(aHTML.join(''));

						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceColumn2a">' +
										'<tr><td><span id="ns1blankspacePlanEditSave" class="ns1blankspaceAction">' +
										'Save</span></td></tr>' +
										'<tr><td><span id="ns1blankspacePlanEditCancel" class="ns1blankspaceAction">' +
										'Cancel</span></td></tr>' +
										'</table>');					
						
						$('#ns1blankspacePlanEditColumn2').html(aHTML.join(''));
						
						$('#ns1blankspacePlanEditSave').button(
						{
							text: "Save"
						})
						.click(function()
						{
							ns1blankspace.financial.budget.plan.save(oParam)
						})
						.css('width', '65px');

						$('#ns1blankspacePlanEditCancel').button(
						{
							text: "Cancel"
						})
						.click(function()
						{
							var aHTML = [];
						
							aHTML.push('<table class="ns1blankspaceColumn2">' +
											'<tr><td class="ns1blankspaceAction">' +
											'<span id="ns1blankspacePlanAdd">Add</span>' +
											'</td></tr></table>');					
							
							$('#ns1blankspacePlanColumn2').html(aHTML.join(''));
						
							$('#ns1blankspacePlanAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', undefined);
								oParam = ns1blankspace.util.setParam(oParam, 'step', 1);
								ns1blankspace.financial.budget.plan.edit(oParam);
							});						
						})
						.css('width', '65px');

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');
				
						aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Account' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspacePlanAccount" class="ns1blankspaceText">' +
									'</td></tr>');
						
						aHTML.push('<tr><td style="padding-bottom:5px;" id="ns1blankspacePlanAddSearchResults">' +
											'<span class="ns1blankspaceSub" style="font-size:0.75em;">Press <i>enter</i> to see all<br />or just start typing.</span></td></tr>');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Amount' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspacePlanAmount" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Month' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioMonth-1" name="radioMonth" value="-1"/>Every Month' +
										'<br /><input type="radio" id="radioMonth1" name="radioMonth" value="1"/>January' +
										'<br /><input type="radio" id="radioMonth2" name="radioMonth" value="2"/>February' +
										'<br /><input type="radio" id="radioMonth3" name="radioMonth" value="3"/>March' +
										'<br /><input type="radio" id="radioMonth4" name="radioMonth" value="4"/>April' +
										'<br /><input type="radio" id="radioMonth5" name="radioMonth" value="5"/>May' +
										'<br /><input type="radio" id="radioMonth6" name="radioMonth" value="6"/>June' +
										'<br /><input type="radio" id="radioMonth7" name="radioMonth" value="7"/>July' +
										'<br /><input type="radio" id="radioMonth8" name="radioMonth" value="8"/>August' +
										'<br /><input type="radio" id="radioMonth9" name="radioMonth" value="9"/>September' +
										'<br /><input type="radio" id="radioMonth10" name="radioMonth" value="10"/>October' +
										'<br /><input type="radio" id="radioMonth11" name="radioMonth" value="11"/>November' +
										'<br /><input type="radio" id="radioMonth12" name="radioMonth" value="12"/>December' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Notes' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea id="ns1blankspacePlanNotes" class="ns1blankspaceTextMulti" style="height:50px; width:200px;" rows="3" cols="35" ></textarea>' +
										'</td></tr>');		
		
						aHTML.push('</table>');		
						
						$('#ns1blankspacePlanEditColumn1').html(aHTML.join(''));

						if (iID !== undefined)
						{
							var oItem = $.grep(ns1blankspace.financial.budget.data.planned, function (item) {return item.id == iID})[0];

							$('#ns1blankspacePlanAmount').val(oItem.amount);
							$('#ns1blankspacePlanNotes').val(oItem.notes);
							$('#ns1blankspacePlanAccount').val(oItem.financialaccounttext);
							$('#ns1blankspacePlanAccount').attr('data-id', oItem.financialaccount);
							$('[name="radioMonth"][value="' + oItem.month + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioMonth"][value="-1"]').attr('checked', true);
						}
	
						$('#ns1blankspacePlanAccount').keyup(function()
						{
							oParam = ns1blankspace.util.setParam(oParam, 'step', 2);
							if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
					        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.budget.plan.edit(' + JSON.stringify(oParam) + ')', ns1blankspace.option.typingWait);
						});
		
						$('#ns1blankspacePlanAccount').focus();

						if (iID === undefined)
						{
							var iFinancialAccountType = (iType==1?2:1);
							var oData = $.grep(ns1blankspace.financial.data.accounts, function (a)
							{ 
								return ((iType?a.type == (iType==1?2:1):true) && a.postable == 'Y')
							});

							if (oData.length < 21)
							{	
								oParam = ns1blankspace.util.setParam(oParam, 'step', 3);
								ns1blankspace.financial.budget.plan.edit(oParam, oData);
							}	
						}	
					}

					if (iStep == 2)
					{	
						ns1blankspace.status.working();

						var sSearch = $('#ns1blankspacePlanAccount').val()

						if (sSearch == '')
						{
							var oData = $.grep(ns1blankspace.financial.data.accounts, function (a)
							{ 
								return ((iType?a.type == (iType==1?2:1):true) && a.postable == 'Y')
							});
						}
						else
						{
							sSearch = sSearch.toLowerCase();
							var oData = $.grep(ns1blankspace.financial.data.accounts, function (a)
							{
								return (((iType?a.type == (iType==1?2:1):true) && a.postable == 'Y') && (a.title).toLowerCase().indexOf(sSearch) != -1)
							});
						}	

						oParam = ns1blankspace.util.setParam(oParam, 'step', 3);
						ns1blankspace.financial.budget.plan.edit(oParam, oData);
					}
				}
				else
				{
					ns1blankspace.status.message('');

					var aHTML = [];
					
					if (oResponse.length == 0)	
					{
						aHTML.push('<table class="ns1blankspace">' +
										'<tr><td class="ns1blankspaceNothing">No accounts.</td></tr>' + 
										'</table>');

						$('#ns1blankspacePlanAddSearchResults').html(aHTML.join(''));		
					}
					else
					{	
						aHTML.push('<table class="ns1blankspace" style="font-size:0.875em;">');
						
						$.each(oResponse, function() 
						{ 
							aHTML.push('<tr class="ns1blankspaceRow">'+ 
											'<td id="ns1blankspacePlan_title-' + this.id + '-' + this.taxtype + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
											this.title + '</td></tr>');	
						});
						
						aHTML.push('</table>');

						$('#ns1blankspacePlanAddSearchResults').html(aHTML.join(''))
						
						$('.ns1blankspaceRowSelect')
						.click(function()
						{
							var sID = this.id;
							var aID = sID.split('-');

							$('#ns1blankspacePlanAccount').attr('data-id', aID[1]);
							$('#ns1blankspacePlanAccount').val($(this).html());
							$('#ns1blankspacePlanAddSearchResults').html('');

							if (aID[2] != '')
							{
								$('#ns1blankspacePlanAmount').focus();
							}
						});
					}
				}	
			},

	save:	function(oParam)
			{
				var sNamespace = ns1blankspace.util.getParam(oParam, 'namespace').value;

				ns1blankspace.status.working();

				var iAccount = ns1blankspace.util.getParam(oParam, 'account').value;
				var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
				var cAmount = $('#ns1blankspacePlanAmount').val();
				if (cAmount == '') {cAmount = 0};
				
				var oData = {}
				
				if (iID !== undefined) {oData.id = iID}
				if (iAccount === undefined) {iAccount = $('#ns1blankspacePlanAccount').attr('data-id')}

				oData.budget = ns1blankspace.objectContext;
				oData.financialaccount = iAccount;
				oData.amount = cAmount;
				oData.notes = $('#ns1blankspacePlanNotes').val();
				oData.month = $('input[name="radioMonth"]:checked').val();
					
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('FINANCIAL_BUDGET_ITEM_MANAGE'),
					data: oData,
					dataType: 'json',
					success: function(oResponse)
					{
						ns1blankspace.status.message('Saved');
						ns1blankspace.financial.budget.plan.show({refresh: false});
					}
				});
			}	
}				

ns1blankspace.financial.budget.actual = 
{
	data: 	{},

	show:	function (oParam, oResponse)
			{
				var iBudget = ns1blankspace.objectContext;
				var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": false}).value;

				if (oResponse == undefined)
				{	
					if (!bRefresh)
					{	
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceContainer">');

						aHTML.push('<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceActualColumn1" class="ns1blankspaceColumn1Flexible">' +
										ns1blankspace.xhtml.loading + '</td>' +
										'<td id="ns1blankspaceActualColumn2" class="ns1blankspaceColumn2" style="width:175px;"></td>' +
										'</tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainActual').html(aHTML.join(''));
					}

					$vq.clear({queue: 'actual'});
						
					$vq.add('<table class="ns1blankspaceColumn2">', {queue: 'actual'});
					
					$vq.add('<tr><td class="ns1blankspaceSubNote" id="ns1blankspaceFinancialBudgetActualAsAt"></td></tr>', {queue: 'actual'});

					$vq.add('<tr><td style="padding-top:8px;" class="ns1blankspaceAction">' +
									'<span id="ns1blankspaceActualRefresh" class="ns1blankspaceAction" style="font-size:0.875em; width:100px;">Refresh</span>' +
									'</td></tr>', {queue: 'actual'});

					$vq.add('</table>', {queue: 'actual'});					

					$vq.render('#ns1blankspaceActualColumn2', {queue: 'actual'});

					$('#ns1blankspaceActualRefresh').button({})
					.click(function()
					{
						ns1blankspace.status.working('Refreshing...');

						var oData = {budget: ns1blankspace.objectContext}

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_BUDGET_PROCESS_MANAGE'),
							data: oData,
							dataType: 'json',
							success: function(oResponse)
							{
								ns1blankspace.status.message('Processed');
								ns1blankspace.financial.budget.actual.show({refresh: false});
							}
						});
					});

					$vq.show('#ns1blankspaceFinancialBudgetActualAsAt', 'As as ' + ns1blankspace.financial.budget.data.process.today.asat);

					var oSearch = new AdvancedSearch();
					oSearch.method = 'FINANCIAL_BUDGET_PROCESS_ITEM_SEARCH';
					oSearch.addField('actualamount,financialaccount,financialaccounttext,plannedamount,process,processtext,' +
										'budgetprocessitem.financialaccount.type');
					oSearch.addFilter('process', 'EQUAL_TO', ns1blankspace.financial.budget.data.process.today.id);
					oSearch.addFilter('plannedamount', 'NOT_EQUAL_TO', 0);
					oSearch.sort('financialaccounttext', 'asc');
					oSearch.getResults(function(oResponse)
					{
						ns1blankspace.financial.budget.actual.show(oParam, oResponse)
					});
				}
				else
				{
					var aHTML = [];

					ns1blankspace.financial.budget.data.today = oResponse.data.rows;
					
					if (oResponse.data.rows.length == 0)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">No actuals.</td></tr></table>');

						$('#ns1blankspaceActualColumn1').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspace">');

						aHTML.push('<tr>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption style="width:125px;">Account</td>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Planned Amount</td>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Actual Amount</td>');
						aHTML.push('</tr>');

						$.each(oResponse.data.rows, function(r, row)
						{
							aHTML.push('<tr class="ns1blankspaceRow">');
																		
							aHTML.push('<td id="ns1blankspaceItem_financialaccounttext-' + row.id + '" class="ns1blankspaceRow">' +
											row.financialaccounttext + '</td>');
							
							aHTML.push('<td id="ns1blankspaceItem_amount-' + row.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
											row.plannedamount + '</td>');

							aHTML.push('<td id="ns1blankspaceItem_amount-' + row.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
											row.actualamount + '</td>');

							aHTML.push('</tr>');
						});
						
						aHTML.push('</table>');

						$('#ns1blankspaceActualColumn1').html(aHTML.join(''));
					}
				}	
			}
}

ns1blankspace.financial.budget.today = 
{
	data: 	{
				type:
				{
					expenses: 1,
					revenue: 2,
					margin: 3
				}	
			},

	show: 	function (oParam)
			{
				var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": ns1blankspace.financial.budget.today.data.type.revenue}).value;
			
				$vq.clear({queue: 'today-show'});
	
				$vq.add('<div id="ns1blankspaceTodayType" style="overflow:auto;"></div>', {queue: 'progress-show'});
				$vq.add('<div id="ns1blankspaceTodayMain" style="overflow:auto;"></div>', {queue: 'progress-show'});			
							
				$vq.render('#ns1blankspaceMainToday', {queue: 'progress-show'});

				$vq.add('<div id="ns1blankspaceProgressType" style="margin-left:0px; margin-right:3px; margin-bottom:5px;">' +
							'<input style="width: 100%;" type="radio" id="ns1blankspaceProgressType-2" name="radioType" /><label for="ns1blankspaceProgressType-2" style="width:85px; font-size:0.75em;">' +
								'Revenue</label>' +
							'<input style="width: 100%;" type="radio" id="ns1blankspaceProgressType-1" name="radioType" /><label for="ns1blankspaceProgressType-1" style="width:95px; font-size:0.75em;">' +
								'Expenses</label>' +
							'</div>', {queue: 'progress-show'});
														
				$vq.render('#ns1blankspaceTodayType', {queue: 'progress-show'});

				$('#ns1blankspaceProgressType-' + iType).attr('checked', true);

				$('#ns1blankspaceProgressType').buttonset();
										
				$('#ns1blankspaceProgressType :radio').click(function()
				{
					oParam = ns1blankspace.util.setParam(oParam, 'type', (this.id).split('-')[1]);
					ns1blankspace.financial.budget.today.show(oParam);
				});

				var aLabels = [];
				var aDataSets = [{label: 'Planned'}, {label: 'Actual'}];
				$.each(aDataSets, function (ds, dataset) {dataset.data = []});

				var aToday = $.grep(ns1blankspace.financial.budget.data.process.today.items, function(today) {return today['budgetprocessitem.financialaccount.type'] == iType})

				$.each(aToday, function (t, today)
				{
					aLabels.push(today.financialaccounttext);

					aDataSets[0].data.push(accounting.unformat(today.plannedamount));
					aDataSets[1].data.push(accounting.unformat(today.actualamount));
				});

				if (oParam == undefined) {oParam = {}}

				oParam.xhtmlElementContainerID = 'ns1blankspaceTodayMain';
				oParam.width = '700px;'
				oParam.height = String(aLabels.length * 75) + 'px;'
				oParam.legend = true;
				oParam.datasets = aDataSets;
				oParam.labels = aLabels;
				oParam.type = 'HorizontalBar';
				oParam.options = {}

				ns1blankspace.visualise.provider.chartjs.render(oParam);
			}
}				

ns1blankspace.financial.budget.progress = 
{
	data: 	{
				format:
				{
					overview: 1,
					detailed: 2
				}	
			},

	show: 	function (oParam)
			{
				var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": true}).value;

				if (bRefresh)
				{
					oParam = ns1blankspace.util.setParam(oParam, 'refresh', false);
					oParam = ns1blankspace.util.setParam(oParam, 'onCompleteAtEnd', ns1blankspace.financial.budget.progress.show);
					ns1blankspace.financial.budget.process.months(oParam);
				}
				else
				{	
					var iFormat = ns1blankspace.util.getParam(oParam, 'format', {"default": ns1blankspace.financial.budget.progress.data.format.overview}).value;
				
					$vq.clear({queue: 'progress-show'});
		
					$vq.add('<div id="ns1blankspaceProgressColumn2" style="overflow:auto;"></div>', {queue: 'progress-show'});
					$vq.add('<div id="ns1blankspaceProgressColumn1" style="overflow:auto;"></div>', {queue: 'progress-show'});			
								
					$vq.render('#ns1blankspaceMainProgress', {queue: 'progress-show'});

					$vq.add('<div id="ns1blankspaceProgressFormat" style="margin-left:0px; margin-right:3px; margin-bottom:5px;">' +
								'<input style="width: 100%;" type="radio" id="ns1blankspaceProgressFormat-1" name="radioFormat" checked="checked" /><label for="ns1blankspaceProgressFormat-1" style="width:95px; margin-bottom:4px; font-size:0.75em;">' +
									'Overview</label>' +
								'<input style="width: 100%;" type="radio" id="ns1blankspaceProgressFormat-2" name="radioFormat" /><label for="ns1blankspaceProgressFormat-2" style="width:80px; font-size:0.75em;">' +
									'Detailed</label>' +
								'</div>', {queue: 'progress-show'});
															
					$vq.render('#ns1blankspaceProgressColumn2', {queue: 'progress-show'});

					$('#ns1blankspaceProgressFormat-' + iFormat).attr('checked', true);

					$('#ns1blankspaceProgressFormat').buttonset();
											
					$('#ns1blankspaceProgressFormat :radio').click(function()
					{
						oParam = ns1blankspace.util.setParam(oParam, 'format', (this.id).split('-')[1]);
						ns1blankspace.financial.budget.progress.show(oParam);
					});

					var aMonths = $.extend(true, [], ns1blankspace.financial.budget.data.months);

					if (iFormat == ns1blankspace.financial.budget.progress.data.format.overview)
					{	
						var aLabels = [];
						var aDataSets = [{label: 'Planned Revenue'}, {label: 'Planned Expenses'}, {label: 'Planned Margin'}];
						$.each(aDataSets, function (ds, dataset) {dataset.data = []});

						$.each(aMonths, function (i, month)
						{
							aLabels.push(month.shortName);
							aDataSets[0].data.push(month.data.totals.accumulated.planned.revenue);
							aDataSets[1].data.push(month.data.totals.accumulated.planned.expenses);
							aDataSets[2].data.push(month.data.totals.accumulated.planned.revenue - month.data.totals.accumulated.planned.expenses);
						});

						if (oParam == undefined) {oParam = {}}

						oParam.xhtmlElementContainerID = 'ns1blankspaceProgressColumn1';
						oParam.width = '700px;'
						oParam.height = '500px;'
						oParam.legend = true;
						oParam.datasets = aDataSets;
						oParam.labels = aLabels;
						oParam.type = 'Line';
						oParam.options = {datasetFill: false, scaleBeginAtZero: true, bezierCurve: false}

						ns1blankspace.visualise.provider.chartjs.render(oParam);
					}
					else
					{
						$vq.add('<table class="ns1blankspaceMain" style="font-size:0.75em;">' +
								'<tr><td class="ns1blankspaceHeaderCaption ns1blankspaceRowShadedHighlight">REVENUE</td>', {queue: 'progress-show'});

						$.each(aMonths, function (i, month)
						{
							$vq.add('<td class="ns1blankspaceHeaderCaption ns1blankspaceRowShadedHighlight" style="text-align:right;">' + month.shortName + '</td>', {queue: 'progress-show'});
						});

						$vq.add('</tr>', {queue: 'progress-show'});

						//Revenue
						var oRootAccount = $.grep(ns1blankspace.financial.data.rootAccounts, function (account) {return account.type == 2})[0];
						var aAccounts = $.grep(ns1blankspace.financial.data.accounts, function (account) {return account.type == 2 && account.parentaccount == oRootAccount.id});
						aAccounts.sort(ns1blankspace.util.sortBy('title', 'asc'));

						$.each(aAccounts, function (a, account)
						{
							var oAccumulatedTotal = {planned: 0, expenses:0}

							$vq.add('<tr><td class="ns1blankspaceHeaderCaption" style="border-width:0px;">' + account.title + '</td>', {queue: 'progress-show'});

							$.each(aMonths, function (i, month)
							{
								var aMonthAccountsPlanned = $.grep(month.process.items, function (item) {return item.financialaccount == account.id});
								var cAmountPlanned = _.reduce($.map(aMonthAccountsPlanned, function (p) {return accounting.unformat(p.plannedamount)}), function(memo, num) {return memo + num;}, 0);

								oAccumulatedTotal.planned = cAmountPlanned;

								$vq.add('<td class="ns1blankspaceRowx ns1blankspaceSub" style="text-align:right; padding-right:8px; font-size:0.875em; color:#46BFBD;">' +
										(cAmountPlanned==0?'':(cAmountPlanned).formatMoney(0)) +
										'</td>', {queue: 'progress-show'});
							});

							$vq.add('</tr>', {queue: 'progress-show'});

							$vq.add('<tr><td class="ns1blankspaceHeaderCaption">&nbsp;</td>', {queue: 'progress-show'});

							$.each(aMonths, function (i, month)
							{
								var aMonthAccountsActual = $.grep(month.process.items, function (item) {return item.financialaccount == account.id});
								var cAmountActual = _.reduce($.map(aMonthAccountsActual, function (p) {return accounting.unformat(p.actualamount)}), function(memo, num) {return memo + num;}, 0);

								oAccumulatedTotal.actual = cAmountActual;

								if (!moment(month.start, "DD MMM YYYY").isAfter())
								{
									$vq.add('<td class="ns1blankspaceRow" style="text-align:right;">' +
										(cAmountActual==0?'':(cAmountActual).formatMoney(0)) +
										'</td>', {queue: 'progress-show'});
								}	
								else
								{
									$vq.add('<td class="ns1blankspaceRow" style="text-align:right;"></td>', {queue: 'progress-show'});
								}
							});

							$vq.add('</tr>', {queue: 'progress-show'});
						});

						$vq.add('<tr><td class="ns1blankspaceHeaderCaptionx" style="font-weight:bold;">Total Revenue</td>', {queue: 'progress-show'});

						$.each(aMonths, function (i, month)
						{
							$vq.add('<td class="ns1blankspaceHeaderCaptionx" style="text-align:right; color:#46BFBD; font-weight:bold;">' +
										(month.process.totals.accumulated.planned.revenue).formatMoney(0) +
										'</td>', {queue: 'progress-show'});
						});

						$vq.add('</tr>', {queue: 'progress-show'});

						$vq.add('<tr><td class="ns1blankspaceHeaderCaption">&nbsp;</td>', {queue: 'progress-show'});

						$.each(aMonths, function (i, month)
						{
							if (!moment(month.start, "DD MMM YYYY").isAfter())
							{
								$vq.add('<td class="ns1blankspaceRow" style="text-align:right; font-weight:bold;">' +
										(month.process.totals.accumulated.actual.revenue).formatMoney(0) +
										'</td>', {queue: 'progress-show'});
							}
							else
							{
								$vq.add('<td class="ns1blankspaceRow" style="text-align:right;"></td>', {queue: 'progress-show'});
							}	
						});

						$vq.add('</tr>', {queue: 'progress-show'});

						//Expenses
						var oRootAccount = $.grep(ns1blankspace.financial.data.rootAccounts, function (account) {return account.type == 1})[0];
						var aAccounts = $.grep(ns1blankspace.financial.data.accounts, function (account) {return account.type == 1 && account.parentaccount == oRootAccount.id});
						aAccounts.sort(ns1blankspace.util.sortBy('title', 'asc'));

						$vq.add('<tr><td class="ns1blankspaceHeaderCaption ns1blankspaceRowShadedHighlight">EXPENSES</td>', {queue: 'progress-show'});

						$.each(aMonths, function (i, month)
						{
							$vq.add('<td class="ns1blankspaceHeaderCaption ns1blankspaceRowShadedHighlight">&nbsp;</td>', {queue: 'progress-show'});
						});

						$vq.add('</tr>');

						$.each(aAccounts, function (a, account)
						{
							var oAccumulatedTotal = {planned: 0, expenses:0}

							$vq.add('<tr><td class="ns1blankspaceHeaderCaption" style="border-width:0px;">' + account.title + '</td>', {queue: 'progress-show'});

							$.each(aMonths, function (i, month)
							{
								var aMonthAccountsPlanned = $.grep(month.process.items, function (item) {return item.financialaccount == account.id});
								var cAmountPlanned = _.reduce($.map(aMonthAccountsPlanned, function (p) {return accounting.unformat(p.plannedamount)}), function(memo, num) {return memo + num;}, 0);

								oAccumulatedTotal.planned += cAmountPlanned;

								$vq.add('<td class="ns1blankspaceRowx ns1blankspaceSub" style="text-align:right; padding-right:8px; font-size:0.875em; color:#46BFBD;">' +
										(cAmountPlanned==0?'':(cAmountPlanned).formatMoney(0)) +
										'</td>', {queue: 'progress-show'});
							});

							$vq.add('</tr>', {queue: 'progress-show'});

							$vq.add('<tr><td class="ns1blankspaceHeaderCaption">&nbsp;</td>', {queue: 'progress-show'});

							$.each(aMonths, function (i, month)
							{
								var aMonthAccountsActual = $.grep(month.process.items, function (item) {return item.financialaccount == account.id});
								var cAmountActual = _.reduce($.map(aMonthAccountsActual, function (p) {return accounting.unformat(p.actualamount)}), function(memo, num) {return memo + num;}, 0);

								if (!moment(month.start, "DD MMM YYYY").isAfter())
								{
									$vq.add('<td class="ns1blankspaceRow" style="text-align:right;">' +
										(cAmountActual==0?'':(cAmountActual).formatMoney(0)) +
										'</td>', {queue: 'progress-show'});
								}	
								else
								{
									$vq.add('<td class="ns1blankspaceRow" style="text-align:right;"></td>', {queue: 'progress-show'});
								}
							});

							$vq.add('</tr>', {queue: 'progress-show'});
						});

						$vq.add('<tr><td class="ns1blankspaceHeaderCaptionx" style="font-weight:bold;">Total Expenses</td>', {queue: 'progress-show'});

						$.each(aMonths, function (i, month)
						{
							$vq.add('<td class="ns1blankspaceHeaderCaptionx" style="text-align:right; color:#46BFBD; font-weight:bold;">' +
										(month.process.totals.accumulated.planned.expenses).formatMoney(0) +
										'</td>', {queue: 'progress-show'});
						});

						$vq.add('</tr>', {queue: 'progress-show'});

						$vq.add('<tr><td class="ns1blankspaceHeaderCaption">&nbsp;</td>', {queue: 'progress-show'});

						$.each(aMonths, function (i, month)
						{
							if (!moment(month.start, "DD MMM YYYY").isAfter())
							{
								$vq.add('<td class="ns1blankspaceRow" style="text-align:right; font-weight:bold;">' +
										(month.process.totals.accumulated.actual.expenses).formatMoney(0) +
										'</td>', {queue: 'progress-show'});
							}
							else
							{
								$vq.add('<td class="ns1blankspaceRow" style="text-align:right;"></td>', {queue: 'progress-show'});
							}	
						});

						$vq.add('</tr>', {queue: 'progress-show'});


						$vq.add('<tr><td class="ns1blankspaceHeaderCaptionx ns1blankspaceRowShadedHighlight">MARGIN</td>', {queue: 'progress-show'});

						$.each(aMonths, function (i, month)
						{
							$vq.add('<td class="ns1blankspaceHeaderCaptionx ns1blankspaceRowShadedHighlight" style="text-align:right; color:#46BFBD;">' +
										(month.process.totals.accumulated.planned.revenue - month.process.totals.accumulated.planned.expenses).formatMoney(0) +
										'</td>', {queue: 'progress-show'});
						});

						$vq.add('</tr>', {queue: 'progress-show'});

						$vq.add('<tr><td class="ns1blankspaceHeaderCaption ns1blankspaceRowShadedHighlight"></td>', {queue: 'progress-show'});

						$.each(aMonths, function (i, month)
						{
							$vq.add('<td class="ns1blankspaceHeaderCaption ns1blankspaceRowShadedHighlight" style="text-align:right;">' +
										(month.process.totals.accumulated.actual.revenue - month.process.totals.accumulated.actual.expenses).formatMoney(0) +
										'</td>', {queue: 'progress-show'});
						});

						$vq.add('</tr>', {queue: 'progress-show'});

						$vq.add('</table>', {queue: 'progress-show'});

						$vq.render('#ns1blankspaceProgressColumn1', {queue: 'progress-show'});
					}	
				}
			}		
}


