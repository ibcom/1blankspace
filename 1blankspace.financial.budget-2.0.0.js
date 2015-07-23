/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.financial.budget =
{
	init: 		function (oParam)
				{
					var bInitialised = ns1blankspace.util.getParam(oParam, 'initialised', {"default": true})

					ns1blankspace.app.reset();

					ns1blankspace.object = 284;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'budget';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Budget';
					
					if (!bInitialised)
					{
						
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
						oSearch.method = 'FINANCIAL_BUDGET_SEARCH';
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
						aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	

						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_BUDGET_SEARCH';
						oSearch.addField('reference,notes,startdate,enddate');
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
							
								aHTML.push('<td id="ns1blankspaceMostLikely_startdate-' + row.id + '" class="ns1blankspaceMostLikely" style="width:50px;">' +
														row.startdate + '</td>');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Amount-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:50px;text-align:right;">' +
														row.enddate + '</td>');
																		
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

							aHTML.push('<tr><td id="ns1blankspaceControlItem" class="ns1blankspaceControl">' +
										'Items</td></tr>');

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
					aHTML.push('<div id="ns1blankspaceMainItem" class="ns1blankspaceControlMain"></div>');
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
					
					$('#ns1blankspaceControlItem').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainItem', refresh: true});
						ns1blankspace.financial.budget.item.show({namespace: 'payment'});
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
								
						$('#ns1blankspaceControlContext').html('<br /><span id="ns1blankspaceControlContext_startdate" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.startdate + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_enddate" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.enddate + '</span>');
							
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.financial.budget.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.budget.summary()'});
					}	
				},		
		
	summary: 	function ()
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

						if (ns1blankspace.objectContextData.notes != '')
						{
							$vq.add('<tr><td class="ns1blankspaceSummaryCaption">Notes</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryNotes" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.notes +
											'</td></tr>', {queue: 'summary'});
						}
						
						$vq.add('</table>', {queue: 'summary'});

						$vq.render('#ns1blankspaceSummaryColumn1', {queue: 'summary'});
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

						$vq.add('</table>', {queue: 'details'});									
						
						$vq.render('#ns1blankspaceMainDetails', {queue: 'details'});	
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

						ns1blankspace.financial.util.tax.codes(
						{
							xhtmlElementID: 'ns1blankspaceDetailsTaxCode',
							id: 1,
							type: 2
						});

						$('#ns1blankspaceDetailsAmount').keyup(function()
						{
							ns1blankspace.financial.util.tax.calculate(
							{
								amountXHTMLElementID: 'ns1blankspaceDetailsAmount',
								taxXHTMLElementID: 'ns1blankspaceDetailsTax'
							});
						});

						$('[name="radioTaxCode"]').click(function()
						{
							ns1blankspace.financial.util.tax.calculate(
							{
								amountXHTMLElementID: 'ns1blankspaceDetailsAmount',
								taxXHTMLElementID: 'ns1blankspaceDetailsTax'
							});
						});

						$('#ns1blankspaceItemAccount').keyup(function()
						{
							if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
					        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.item.edit({step: 2, type: 2})', ns1blankspace.option.typingWait);
						});
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea id="ns1blankspaceDetailsDescription" class="ns1blankspaceTextMulti" rows="10" cols="35" ></textarea>' +
										'</td></tr>');		
										
						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#ns1blankspaceDetailsPaidDate').val(ns1blankspace.objectContextData.paiddate);
							$('#ns1blankspaceDetailsContactBusinessPaidTo').attr('data-id', ns1blankspace.objectContextData.contactbusinesspaidto);
							$('#ns1blankspaceDetailsContactBusinessPaidTo').val(ns1blankspace.objectContextData.contactbusinesspaidtotext);
							$('#ns1blankspaceDetailsContactPersonPaidTo').attr('data-id', ns1blankspace.objectContextData.contactpersonpaidto);
							$('#ns1blankspaceDetailsContactPersonPaidTo').val(ns1blankspace.objectContextData.contactpersonpaidtotext);	
							$('#ns1blankspaceDetailsAmount').val(ns1blankspace.objectContextData.amount);
							$('[name="radioTaxCode"][value="' + ns1blankspace.objectContextData.taxtype + '"]').attr('checked', true);
							$('#ns1blankspaceDetailsTax').val(ns1blankspace.objectContextData.tax);	
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.description);
						}
						else
						{
							$('#ns1blankspaceDetailsPaidDate').val(Date.today().toString("dd MMM yyyy"));
						}
					}	
				},

	save: 		{
					send: 		function (oParam, oResponse)
								{
									ns1blankspace.status.working();
										
									var sData = (ns1blankspace.objectContext == -1)?'':'id=' + ns1blankspace.objectContext;
										
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsReference').val());
										sData += '&paiddate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPaidDate').val());
										sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDescription').val());
										sData += '&contactbusinesspaidto=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsContactBusinessPaidTo').attr("data-id"));
										sData += '&contactpersonpaidto=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsContactPersonPaidTo').attr("data-id"));
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_PAYMENT_MANAGE'),
										data: sData,
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
										
										if ($('#ns1blankspaceMainDetails').html() != '')
										{
											ns1blankspace.financial.budget.save.amount(oParam);
										}
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
				},

	expense: 	{
					show:		function (oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.objectContext;
									var oOptions = {view: true, remove: true};
									var oActions = {add: true};
									
									if (oParam != undefined)
									{
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.options != undefined) {oOptions = oParam.options}
										if (oParam.actions != undefined) {oActions = oParam.actions}
									}		
										
									if (oResponse == undefined)
									{	
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">');
										aHTML.push('<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceExpenseColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
														'<td id="ns1blankspaceExpenseColumn2" class="ns1blankspaceColumn2" style="width: 200px;></td>' +
														'</tr>');
										aHTML.push('</table>');					
														
										$('#ns1blankspaceMainExpense').html(aHTML.join(''));
										
										if (oActions != undefined)
										{
											var aHTML = [];
																			
											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											if (oActions.add)
											{
												aHTML.push('<tr><td class="ns1blankspaceAction">' +
															'<span id="ns1blankspaceExpenseAdd">Add</span>' +
															'</td></tr>');
											}
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceExpenseColumn2').html(aHTML.join(''));
										
											$('#ns1blankspaceExpenseAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												 ns1blankspace.financial.budget.expense.edit(oParam);
											})
										}
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_PAYMENT_EXPENSE_SEARCH';
										oSearch.addField('expense,expensetext,appliesdate,amount,tax');
										oSearch.addFilter('payment', 'EQUAL_TO', iObjectContext);
										oSearch.sort('appliesdate', 'asc');
										oSearch.rows = 100;
										oSearch.getResults(function(data) {ns1blankspace.financial.budget.expense.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
													
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table class="ns1blankspace">' +
															'<tr><td class="ns1blankspaceNothing">No expenses.</td></tr>' + 
															'</table>');

											$('#ns1blankspaceExpenseColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table class="ns1blankspace">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Tax</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																							
												aHTML.push('<td id="ns1blankspaceReceipt_reference-' + this.id + '" class="ns1blankspaceRow">' +
																this.expensetext + '</td>');
																											
												aHTML.push('<td id="ns1blankspaceReceipt_date-' + this.id + '" class="ns1blankspaceRow">' +
																this.appliesdate + '</td>');

												aHTML.push('<td id="ns1blankspaceReceipt_amount-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																this.amount + '</td>');

												aHTML.push('<td id="ns1blankspaceReceipt_tax-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																this.tax + '</td>');

												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceExpense_options_remove-' + this.id + '" class="ns1blankspaceExpenseRemove"></span>');
												};

												aHTML.push('<span id="ns1blankspaceExpense_options_view-' + this.expense + '" class="ns1blankspaceExpenseView"></span>');
													
												aHTML.push('</td></tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceExpenseColumn1').html(aHTML.join(''));
											
											if (oOptions.remove) 
											{
												$('.ns1blankspaceExpenseRemove').button(
												{
													text: false,
													icons:
													{
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspace.financial.budget.expense.remove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px')
											}
									
											$('span.ns1blankspaceExpenseView').button(
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
											.css('height', '17px');
										}
									}	
								},

					remove: 	function (oParam)
								{
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
									var sData = 'remove=1&id=' + ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
												
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_PAYMENT_EXPENSE_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
									});
										
								}
				}														
}
