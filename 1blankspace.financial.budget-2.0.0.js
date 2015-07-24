/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.financial.budget =
{
	data: 		{},

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
						//$('#ns1blankspaceControlSubContext_amount').html(ns1blankspace.xhtml.loadingSmall);
							
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
								
						$('#ns1blankspaceControlContext_enddate').html(oObjectContext.enddate);
					}
				},			

	home: 		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceMain">' + 
										'<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ns1blankspaceMain">' +
										ns1blankspace.xhtml.loading +
										'</td></tr>' + 
										'</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
											
						var aHTML = [];

						aHTML.push('<table>');
						aHTML.push('<tr><td><div id="ns1blankspaceViewReportLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	

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
						var aHTML = [];
				
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceNothing">Click New to add a budget.</td></tr>');
							aHTML.push('</table>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceCaption" colspan="4">MOST LIKELY</td></tr>');
							
							$.each(oResponse.data.rows, function(r, row)
							{					
								aHTML.push('<tr class="ns1blankspaceRow">');
							
								aHTML.push('<td id="ns1blankspaceMostLikely_startdate-' + row.id + '" class="ns1blankspaceMostLikely" style="width:125px;">' +
														row.startdate + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_enddate-' + row.id + '" class="ns1blankspaceMostLikely" style="width:125px;">' +
														row.enddate + '</td>');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_notes-' + row.id + '" class="ns1blankspaceMostLikelySub" style="">' +
														row.notes + '</td>');
																		
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
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
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
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
										aHTML.push('<table class="ns1blankspaceSearchMedium" style="width:400px;">');
											
										$.each(oResponse.data.rows, function()
										{	
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">');
											}
										
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'search-' + this.id + '">' +
															this.notes +
															'</td>');

											aHTML.push('<td class="ns1blankspaceSearch" id="' +
													'search-' + this.id + '">' +
													this.enddate +
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

							aHTML.push('<tr><td id="ns1blankspaceControlActual" class="ns1blankspaceControl">' +
										'Actual</td></tr>');

							aHTML.push('</table>');
						}	

						aHTML.push('<table class="ns1blankspaceControl">');
					
						aHTML.push('<tr><td id="ns1blankspaceControlActions" class="ns1blankspaceControl">' +
										'Actions</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');
					}
									
					aHTML.push('</table>');					
							
					$('#ns1blankspaceControl').html(aHTML.join(''));

					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPlan" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActual" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
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
	
	totals: 	{
					planned: 	function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_BUDGET_ITEM_SEARCH';
										oSearch.addField('sum(amount) totalamount');
										oSearch.addFilter('budget', 'EQUAL_TO', ns1blankspace.objectContext);
										
										oSearch.getResults(function(data) {ns1blankspace.financial.budget.totals.planned(oParam, data)});
									}
									else
									{
										ns1blankspace.financial.budget.data.totals = {planned: oResponse.data.rows[0].totalamount}

										oParam = ns1blankspace.util.setParam(oParam, 'refresh', false);
										ns1blankspace.util.onComplete(oParam);
									}
								}
				},		

	summary: 	function (oParam)
				{
					var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default":true}).value;

					if (bRefresh)
					{
						oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.budget.summary)
						ns1blankspace.financial.budget.totals.planned(oParam);
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
											'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:250px;"></td>' +
											'</tr>' +
											'</table>');				
							
							$vq.render('#ns1blankspaceMainSummary', {queue: 'summary'});
							
							$vq.add('<table class="ns1blankspace">', {queue: 'summary'});

							$vq.add('<tr><td class="ns1blankspaceSummaryCaption">Planned Total</td></tr>' +
												'<tr><td id="ns1blankspaceSummaryNotes" class="ns1blankspaceSummary">$' +
												ns1blankspace.financial.budget.data.totals +
												'</td></tr>', {queue: 'summary'});
						
							$vq.add('</table>', {queue: 'summary'});

							$vq.render('#ns1blankspaceSummaryColumn1', {queue: 'summary'});
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
					var h = -1;

					ns1blankspace.financial.budget.plan.data.items = oResponse.data.rows;
					
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
							oParam.xhtmlElementID = this.id;

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
							var oItem = $.grep(ns1blankspace.financial.budget.plan.data.items, function (item) {return item.id == iID})[0];

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

					var aHTML = [];
						
					aHTML.push('<table class="ns1blankspaceColumn2">');
					
					aHTML.push('<tr><td style="padding-top:2px;" class="ns1blankspaceAction">' +
									'<span id="ns1blankspaceSummaryRefresh" class="ns1blankspaceAction" style="font-size:0.875em; width:100px;">Refresh</span>' +
									'</td></tr>');

					aHTML.push('</table>');					

					$('#ns1blankspaceActualColumn2').html(aHTML.join(''));

					$('#ns1blankspaceSummaryRefresh').button({})
					.click(function()
					{
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

					var oSearch = new AdvancedSearch();
					oSearch.method = 'FINANCIAL_BUDGET_PROCESS_SEARCH';
					oSearch.addField('asat,budget,budgettext,periodpercentage,title');
					oSearch.addFilter('budget', 'EQUAL_TO', iBudget);
					oSearch.sort('id', 'desc');
					
					oSearch.getResults(function(oResponse)
					{
						if (oResponse.data.rows.length == 0)
						{
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
									//ns1blankspace.financial.budget.plan.show({refresh: false});
								}
							});
						}
						else	
						{	
							ns1blankspace.financial.budget.actual.data.process = oResponse.data.rows[0];

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_BUDGET_PROCESS_ITEM_SEARCH';
							oSearch.addField('actualamount,financialaccount,financialaccounttext,plannedamount,process,processtext');
							oSearch.addFilter('process', 'EQUAL_TO', ns1blankspace.financial.budget.actual.data.process.id);
							oSearch.addFilter('plannedamount', 'NOT_EQUAL_TO', 0);
							oSearch.sort('financialaccounttext', 'asc');
							oSearch.getResults(function(oResponse)
							{
								ns1blankspace.financial.budget.actual.show(oParam, oResponse)
							});
						}	
					});
				}
				else
				{
					var aHTML = [];
					var h = -1;

					ns1blankspace.financial.budget.actual.data.items = oResponse.data.rows;
					
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

						$('#ns1blankspaceActualColumn2').html(ns1blankspace.financial.budget.actual.data.process.asat);
					}
				}	
			}
}


