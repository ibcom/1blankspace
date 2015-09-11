/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.financial.expense = 
{
	init: 		function (oParam)
				{
					var bInitialised = false;

					if (oParam != undefined)
					{
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}	
					}
				
					ns1blankspace.app.reset();

					ns1blankspace.object = 2;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'expense';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Expenses';
					
					if (!bInitialised)
					{
						ns1blankspace.financial.initData(oParam)
					}
					else
					{
						oParam.bind = ns1blankspace.financial.expense.bind;
						oParam.xhtml = '<table id="ns1blankspaceOptions" class="ns1blankspaceViewControlContainer">' +	
											'<tr class="ns1blankspaceOptions">' +
											'<td id="ns1blankspaceControlActionOptionsRemove" class="ns1blankspaceViewControl">' +
											'Delete' +
											'</td></tr>' +
											'<tr class="ns1blankspaceOptions">' +
											'<td id="ns1blankspaceControlActionOptionsCopy" class="ns1blankspaceViewControl">' +
											'Copy' +
											'</td></tr>' +
											'</table>';

						ns1blankspace.app.set(oParam);
					}	
				},

	bind: 		function (oParam)
				{
					$('#ns1blankspaceControlActionOptionsRemove')
					.click(function() 
					{
						ns1blankspace.app.options.remove(oParam)
					});

					$('#ns1blankspaceControlActionOptionsCopy')
					.click(function() 
					{
						ns1blankspace.financial.expense.copy.init(oParam)
					});
				},			

	refresh: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						$('#ns1blankspaceControlSubContext_amount').html(ns1blankspace.xhtml.loadingSmall);
							
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
						oSearch.addField('accrueddate,amount,tax');
						oSearch.rf = 'json';
						oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
						oSearch.getResults(function(data) {ns1blankspace.financial.expense.refresh(oParam, data)});
					}
					else
					{
						var oObjectContext = oResponse.data.rows[0];
								
						ns1blankspace.objectContextData.accrueddate = oObjectContext.accrueddate;
						ns1blankspace.objectContextData.amount = oObjectContext.amount;
								
						$('#ns1blankspaceControlContext_accrueddate').html(oObjectContext.accrueddate);
						$('#ns1blankspaceControlContext_amount').html(oObjectContext.amount);

						ns1blankspace.financial.expense.payment.refresh();
					}
				},

	copy: 		{			
					init: 		function (oParam, oResponse)
								{		
									ns1blankspace.container.hide({force: true});

									if (oResponse == undefined)
									{
										ns1blankspace.status.working('Copying...');

										var oData = ns1blankspace.objectContextData;
										delete oData.id;
										delete oData.reference;

										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_EXPENSE_MANAGE'),
											data: oData,
											dataType: 'json',
											success: function(data){ns1blankspace.financial.expense.copy.init(oParam, data)}
										});

									}
									else
									{
										if (oResponse.status == 'OK')
										{
											oParam = ns1blankspace.util.setParam(oParam, 'id', oResponse.id);
											ns1blankspace.financial.expense.copy.process(oParam);
										}
										else
										{
											ns1blankspace.status.error('Cannot copy expense')
										}
									}	
								},

					process: 	function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_ITEM_SEARCH';
										oSearch.addField('financialaccount,taxtype,tax,amount,description');
										oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
										oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.sort('financialaccounttext', 'asc');
					
										oSearch.getResults(function(data) {ns1blankspace.financial.expense.copy.process(oParam, data)});
									}	
									else
									{
										if (oParam.index == undefined) {oParam.index = 0} else {oParam.index = oParam.index + 1}

										if (oParam.index < oResponse.data.rows.length)
										{
											var oData = oResponse.data.rows[oParam.index];
											delete oData.id;
											oData.object = ns1blankspace.object;
											oData.objectContext = oParam.id;

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
												data: oData,
												dataType: 'json',
												success: function(oItemResponse)
												{
													ns1blankspace.financial.expense.copy.process(oParam, oResponse)
												}
											});	
										}
										else
										{
											ns1blankspace.status.message("Copied");
											ns1blankspace.objectContext = oParam.id;
											ns1blankspace.inputDetected = false;
											ns1blankspace.financial.expense.search.send('-' + ns1blankspace.objectContext, {source: 1});
										}
									}
								}		
				},			

	home: 		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
						var h = -1;
									
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

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td style="padding-top:15px;" id="ns1blankspaceControlOutstanding" class="ns1blankspaceControl">To Be Paid<br /><span class="ns1blankspaceSub" style="font-size:0.75em;">Create a file<br />for payment</span></td>' +
									'</tr>');

						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));

						$('#ns1blankspaceControlOutstanding').click(function(event)
						{
							ns1blankspace.financial.expense.outstanding.init();
						});			
						
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
						oSearch.addField('reference,description,amount,accrueddate,contactbusinesspaidtotext,contactpersonpaidtotext,object,objectcontext');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(function (data) {ns1blankspace.financial.expense.home(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceNothing">Click New to create an expense.</td></tr>');
							aHTML.push('</table>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceCaption" colspan="4">MOST LIKELY</td></tr>');
							
							$.each(oResponse.data.rows, function()
							{				
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + '" class="ns1blankspaceMostLikely" style="width:50px;">' +
														this.reference + '</td>');	

								aHTML.push('<td id="ns1blankspaceMostLikely_amount-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:50px;text-align:right;padding-left:10px;padding-right:10px;">' +
														'$' + this.amount + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_date-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;text-align:right;padding-right:15px;">' +
														this.accrueddate + '</td>');

								var sContact = this.contactbusinesspaidtotext
								if (sContact == '') {sContact = this.contactpersonpaidtotext}
								
								aHTML.push('<td id="ns1blankspaceMostLikely_contact-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
														sContact + '</td>');
									
								aHTML.push('</tr>');
							});
							
							aHTML.push('</tbody></table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.financial.expense.search.send(event.target.id, {source: 1});
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
										$('#ns1blankspaceViewportControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
										oSearch.addField('contactbusinesspaidtotext,contactbusinesspaidto,contactpersonpaidtotext,contactpersonpaidto,projecttext,project,projecttext,areatext,' +
																'area,reference,accrueddate,description,amount,tax,object,objectcontext,paymentduedate,payeereference');

										oSearch.addField(ns1blankspace.option.auditFields);
										
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										
										oSearch.getResults(function(data) {ns1blankspace.financial.expense.show(oParam, data)});
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
											oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
											oSearch.addField('reference,accrueddate,amount,contactbusinesspaidtotext,contactpersonpaidtotext');
											
											oSearch.addBracket('(');
											oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('expense.contactbusinesspaidto.tradename', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('expense.contactpersonpaidto.surname', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('expense.contactpersonpaidto.firstname', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addBracket(')');

											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.sort('accrueddate', 'DESC');
											
											oSearch.getResults(function(data) {ns1blankspace.financial.expense.search.process(oParam, data)});	
										}
									};	
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
										$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
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
															this.reference +
															'</td>');

											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'search-' + this.id + '">' +
															this.accrueddate +
															'</td>');

											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'search-' + this.id + '">' +
															this.amount +
															'</td>');

											if (this.contactbusinesspaidtotext != '')
											{
												sContact = this.contactbusinesspaidtotext;
											}
											else
											{
												sContact = this.contactpersonpaidtotext;
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
											ns1blankspace.financial.expense.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'reference-accrueddate-amount',
											more: oResponse.moreid,
											width: 400,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.financial.expense.search.send
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
						
						aHTML.push('<tr><td id="ns1blankspaceControlItem" class="ns1blankspaceControl">' +
										'Items</td></tr>');
					
						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');
						
						aHTML.push('<tr><td id="ns1blankspaceControlPayments" class="ns1blankspaceControl">' +
										'Payments</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlCredit" class="ns1blankspaceControl">' +
										'Credits</td></tr>');
													
						aHTML.push('<tr><td id="ns1blankspaceControlGL" class="ns1blankspaceControl">' +
										'GL</td></tr>');
									
						aHTML.push('</table>');					
					
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
					aHTML.push('<div id="ns1blankspaceMainCredit" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPayment" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTransaction" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.financial.expense.summary();
					});

					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.financial.expense.details();
					});
					
					$('#ns1blankspaceControlItem').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainItem', refresh: true});
						ns1blankspace.financial.item.show({namespace: 'expense'});
					});
					
					$('#ns1blankspaceControlCredit').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainCredit', refresh: true});
						ns1blankspace.financial.util.credit.show();
					});
					
					$('#ns1blankspaceControlPayments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPayment', refresh: true});
						ns1blankspace.financial.expense.payment.show();
					});
					
					$('#ns1blankspaceControlGL').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTransaction', refresh: true});
						ns1blankspace.financial.transactions.show();
					});

					$('#ns1blankspaceControlActions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainActions', refresh: true});
						ns1blankspace.actions.show({xhtmlElementID: 'ns1blankspaceMainActions'});
					});

					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
						ns1blankspace.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments'});
					});			
				},

	show:		function (oParam, oResponse)
				{
					ns1blankspace.app.clean();
					ns1blankspace.financial.expense.layout();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the expense.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.financial.expense.payment.refresh();

						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});

						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.reference +
							'<br /><span id="ns1blankspaceControlContext_accrueddate" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.accrueddate + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_amount" class="ns1blankspaceSub">$' + ns1blankspace.objectContextData.amount + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_outstanding" class="ns1blankspaceSub"></span>');
							
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.financial.expense.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.expense.summary()'});
					}	
				},		

	summary: 	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the invoice.</td></tr></table>');
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceRow">' +
										'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
										'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:290px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
						
						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');
												
						if (ns1blankspace.objectContextData.contactbusinesspaidtotext != '')
						{

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Business</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryBusiness" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.contactbusinesspaidtotext +
											'</td></tr>');
						}
						
						if (ns1blankspace.objectContextData.contactpersonpaidtotext != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Person</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryPerson" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.contactpersonpaidtotext +
											'</td></tr>');
						}
						
						if (ns1blankspace.objectContextData.description != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.description +
											'</td></tr>');
						}

						if (ns1blankspace.objectContextData.payeereference != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Supplier Reference</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.payeereference +
											'</td></tr>');
						}
						
						aHTML.push('</table>');		

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						if (ns1blankspace.objectContextData.paid == 'Y')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Paid Date</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryPaidDate" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.paiddate +
											'</td></tr>');
						}
						else
						{	
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">' +
											'Expense hasn\'t been paid.</td></tr>');			
						}

						aHTML.push('</table>');		

						//$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));
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
										'Reference' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsReference" class="ns1blankspaceText">' +
										'</td></tr>');			
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Business' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsContactBusinessPaidTo" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_BUSINESS_SEARCH"' +
											' data-columns="tradename">' +
										'</td></tr>');	
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Person' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsContactPersonPaidTo" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_PERSON_SEARCH"' +
											' data-columns="firstname-space-surname"' +
											' data-parent="ns1blankspaceDetailsContactBusinessPaidTo"' +
											' data-parent-search-id="contactbusiness"' +
											' data-parent-search-text="tradename">' +
										'</td></tr>');							
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Accrued Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsAccruedDate" class="ns1blankspaceDate">' +
										'</td></tr>');		
											
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Due Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsDueDate" class="ns1blankspaceDate">' +
										'</td></tr>');		
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea id="ns1blankspaceDetailsDescription" class="ns1blankspaceTextMulti" rows="10" cols="35" style="height:150px;"></textarea>' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Supplier Reference' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPayeeReference" class="ns1blankspaceText" style="width:250px;">' +
										'</td></tr>');		
										
						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#ns1blankspaceDetailsContactBusinessPaidTo').attr('data-id', ns1blankspace.objectContextData.contactbusinesspaidto);
							$('#ns1blankspaceDetailsContactBusinessPaidTo').val(ns1blankspace.objectContextData.contactbusinesspaidtotext);
							$('#ns1blankspaceDetailsContactPersonPaidTo').attr('data-id', ns1blankspace.objectContextData.contactpersonpaidto);
							$('#ns1blankspaceDetailsContactPersonPaidTo').val(ns1blankspace.objectContextData.contactpersonpaidtotext);	
							$('#ns1blankspaceDetailsAccruedDate').val(ns1blankspace.objectContextData.accrueddate);
							$('#ns1blankspaceDetailsDueDate').val(ns1blankspace.objectContextData.paymentduedate);
							$('[name="radioPaid"][value="' + ns1blankspace.objectContextData.paid + '"]').attr('checked', true);
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.description);
							$('#ns1blankspaceDetailsPayeeReference').val(ns1blankspace.objectContextData.payeereference);
						}
						else
						{
							$('[name="radioPaid"][value="N"]').attr('checked', true);
							$('#ns1blankspaceDetailsAccruedDate').val(Date.today().toString("dd MMM yyyy"));
						}
					}	
				},
			
	save: 		{
					send: 		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										ns1blankspace.status.working();
										
										var sData = (ns1blankspace.objectContext == -1)?'':'id=' + ns1blankspace.objectContext;
											
										if ($('#ns1blankspaceMainDetails').html() != '')
										{
											sData += '&reference=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsReference').val());
											sData += '&accrueddate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsAccruedDate').val());
											sData += '&paymentduedate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDueDate').val());
											sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDescription').val());
											sData += '&contactbusinesspaidto=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsContactBusinessPaidTo').attr("data-id"));
											sData += '&contactpersonpaidto=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsContactPersonPaidTo').attr("data-id"));
											sData += '&payeereference=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPayeeReference').val());
										}
										
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_EXPENSE_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data) {ns1blankspace.financial.expense.save.send(oParam, data)}
										});
										
									}
									else
									{			
										if (oResponse.status == 'OK')
										{	
											ns1blankspace.status.message('Saved');
											
											if (ns1blankspace.objectContext == -1)
											{
												ns1blankspace.objectContext = oResponse.id;
												ns1blankspace.inputDetected = false;
												ns1blankspace.financial.expense.search.send('-' + ns1blankspace.objectContext, {source: 1});
											}	
										}
										else
										{
											ns1blankspace.status.error('Could not save the Expense!');
										}
									}	
								}
				},				

	payment: 	{
					refresh:	function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										$('#ns1blankspaceControlContext_outstanding').html(ns1blankspace.xhtml.loadingSmall);
											
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_PAYMENT_EXPENSE_SEARCH';
										oSearch.addField('amount');
										oSearch.addSummaryField('sum(amount) sumamount');
										oSearch.addFilter('expense', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.rows = 1;
										oSearch.getResults(function(data){ns1blankspace.financial.expense.payment.refresh(oParam, data)});
									}
									else
									{
										ns1blankspace.objectContextData.outstanding = oResponse.summary.sumamount;
										$('#ns1blankspaceControlContext_outstanding').html('<span style="background-color:#CCCCCC; color: white;">' +
												'$' + ((ns1blankspace.objectContextData.amount).parseCurrency() -
												(oResponse.summary.sumamount).parseCurrency()).formatMoney(2, ".", ",") + '</span>');
									}
								},

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
														'<td id="ns1blankspacePaymentColumn1" class="ns1blankspaceColumn1Flexible">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspacePaymentColumn2" class="ns1blankspaceColumn2" style="width: 350px;"></td>' +
														'</tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainPayment').html(aHTML.join(''));	
										
										if (oActions != undefined)
										{	
											var aHTML = [];
											
											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											if (oActions.add)
											{
												aHTML.push('<tr><td>' +
															'<span id="ns1blankspacePaymentAdd" class="ns1blankspaceAction">Add</span>' +
															'</td></tr>');
											}
											
											aHTML.push('</table>');					
											
											//$('#ns1blankspacePaymentColumn2').html(aHTML.join(''));
										
											$('#ns1blankspacePaymentAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												 ns1blankspace.financial.expense.payment.edit(oParam);
											})
										}
										
										ns1blankspace.financial.expense.payment.edit(oParam);

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_PAYMENT_EXPENSE_SEARCH';
										oSearch.addField('appliesdate,amount,paymentexpense.payment.reference,paymentexpense.payment.amount,paymentexpense.payment.id');
										oSearch.addFilter('expense', 'EQUAL_TO', iObjectContext);
										oSearch.sort('appliesdate', 'asc');
										oSearch.rows = 1000;
										oSearch.getResults(function(data) {ns1blankspace.financial.expense.payment.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table class="ns1blankspace">' +
															'<tr><td class="ns1blankspaceNothing">No payments.</td></tr>' + 
															'</table>');

											$('#ns1blankspacePaymentColumn1').html(aHTML.join(''));
										}
										else
										{
											//var oPayments = ns1blankspace.util.unique({key: 'paymentexpense.payment.reference', data: oResponse.data.rows});
											var oPayments = oResponse.data.rows;

											aHTML.push('<table class="ns1blankspace" id="ns1blankspaceFinancialExpensePayments">');
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');

											$.each(oPayments, function(p, payment)
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																			
												aHTML.push('<td id="ns1blankspaceReceipt_date-' + this.id + '" class="ns1blankspaceRow">' +
																this['appliesdate'] + '</td>');

												
												aHTML.push('<td id="ns1blankspaceReceipt_amount-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																this['amount'] + '</td>');
						
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
													
												aHTML.push('<span id="ns1blankspacePayment_options_remove-' + this.id + '" class="ns1blankspaceRemove"></span>');
												aHTML.push('<span id="ns1blankspacePayment_options_view-' + payment['paymentexpense.payment.id'] + '" class="ns1blankspaceView"></span>');
													
												aHTML.push('</td></tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspacePaymentColumn1').html(aHTML.join(''));
											
											$('#ns1blankspaceFinancialExpensePayments .ns1blankspaceRemove').button(
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
													method: 'FINANCIAL_PAYMENT_EXPENSE_MANAGE',
													ifNoneMessage: 'No payments.',
													onComplete: ns1blankspace.financial.expense.refresh
												});
											})
											.css('width', '15px')
											.css('height', '17px');

											$('#ns1blankspaceFinancialExpensePayments .ns1blankspaceView').button(
											{
												text: false,
												icons:
												{
													primary: "ui-icon-play"
												}
											})
											.click(function()
											{
												ns1blankspace.financial.payment.init({id: (this.id).split('-')[1]})
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
										success: function(data)
										{
											ns1blankspace.financial.expense.payment.show();
											ns1blankspace.financial.expense.refresh();
										}
									});
										
								},			

					edit:		function (oParam, oResponse)
								{
									var iStep = 1;
									var cPaymentAmount = 0;
									var cPaidAmount = 0;

									if (oParam != undefined)
									{
										if (oParam.step != undefined) {iStep = oParam.step}
										if (oParam.paymentAmount != undefined) {cPaymentAmount = oParam.paymentAmount}
										if (oParam.paidAmount != undefined) {cPaidAmount = oParam.paidAmount}	
									}
									
									if (ns1blankspace.financial.data.bankaccounts.length == 0) {alert("No bank accounts set up.");return;}
									
									if (iStep == 1)
									{	
										$('#ns1blankspacePaymentColumn2').html(ns1blankspace.xhtml.loadingSmall)
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_PAYMENT_EXPENSE_SEARCH';
										oSearch.addField('amount');
										oSearch.addSummaryField('sum(amount) sumamount');
										oSearch.addFilter('expense', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.rows = 1;
										oSearch.getResults(function(data){ns1blankspace.financial.expense.payment.edit($.extend(true, oParam, {step:2}), data)});
									}
										
									if (iStep == 2)
									{
										cPaidAmount = oResponse.summary.sumamount;
										if (cPaidAmount == '') {cPaidAmount = "0"}
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
										
										aHTML.push('<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceSub"' +
														' data-receiptedamount="' + cPaidAmount + '">' +
														'$' + parseFloat(cPaidAmount).formatMoney(2, ".", ",") + ' has been paid so far.' +
														'</td></tr>');
														
										aHTML.push('<tr class="ns1blankspace">' +
														'<td id="ns1blankspaceReceiptEditAmount" class="ns1blankspaceSub"' +
														'">' +
														'$' + (parseFloat((ns1blankspace.objectContextData.amount).replace(",","")) - cPaidAmount).formatMoney(2, ".", ",") + ' remaining.' +
														'</td></tr>');
																						
										aHTML.push('<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceCaption">' +
														'Bank Account' +
														'</td></tr>' +
														'<tr class="ns1blankspaceRadio">' +
														'<td id="ns1blankspacePaymentEditBankAccount" class="ns1blankspaceRadio">');
									
										var iDefaultBankAccount;
										
										$.each(ns1blankspace.financial.data.bankaccounts, function()
										{
											if (iDefaultBankAccount == undefined) {iDefaultBankAccount = this.id}
											aHTML.push('<input type="radio" id="radioBankAccount' + this.id + '" name="radioBankAccount" value="' + this.id + '"/>' +
																this.title + '<br />');				
										});
										
										aHTML.push('</td></tr>');				
														
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Amount' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspacePaymentAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Date' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceDate">' +
														'<input id="ns1blankspacePaymentDate" class="ns1blankspaceDate">' +
														'</td></tr>');
																		
										aHTML.push('<tr class="ns1blankspace">' +
														'<td id="ns1blankspacePaymentAddContainer">' +
														'<span id="ns1blankspacePaymentAdd" class="ns1blankspaceAction">Pay</span>' +
														'</td></tr>');
										
										aHTML.push('</table>');
												
										$('#ns1blankspacePaymentColumn2').html(aHTML.join(''));
												
										$('[name="radioBankAccount"][value="' + iDefaultBankAccount + '"]').attr('checked', true);
									
										$('#ns1blankspacePaymentAmount').val((ns1blankspace.objectContextData.amount).parseCurrency() - (cPaidAmount).parseCurrency());

										$('#ns1blankspacePaymentAmount').focus();
										$('#ns1blankspacePaymentAmount').select();

										$('#ns1blankspacePaymentDate').val(Date.today().toString("d MMM yyyy"));
										$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

										$('#ns1blankspacePaymentAdd').button(
										{
											label: "Add Payment"
										})
										.click(function() {
											ns1blankspace.financial.expense.payment.edit($.extend(true, oParam,
													{	step: 4,
														paidAmount: cPaidAmount,
														paymentAmount: $('#ns1blankspacePaymentAmount').val(),
														date: $('#ns1blankspacePaymentDate').val()
													}))
										});
									}
									
									if (iStep == 3)
									{
										//NOT USED
										$('#ns1blankspacePaymentEditFullResults').html(ns1blankspace.xhtml.loadingSmall);
												
										var cAmount = ns1blankspace.objectContextData.amount - cPaidAmount;
										
										var sData = 'bankaccount=' + ns1blankspace.util.fs($('input[name="radioBankAccount"]:checked').val());
										sData += '&amount=' + ns1blankspace.util.fs(cAmount);
										sData += '&receiveddate=' + ns1blankspace.util.fs(Date.today().toString("dd-MMM-yyyy"));
										sData += '&paymentmethod=3'; //todo
										sData += '&contactbusinessreceivedfrom=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.contactbusinesssentto);	
										sData += '&contactpersonreceivedfrom=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.contactpersonsentto);
												
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_PAYMENT_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.financial.expense.payment.edit($.extend(true, oParam, {step: 4, amount: cAmount}), data)
											}
										});	
									}
									
									if (iStep == 4)
									{
										var cAmount = cPaymentAmount;
										var dDate = Date.today().toString("dd-MMM-yyyy");
										
										if (oParam != undefined)
										{
											if (oParam.amount != undefined) {cAmount = oParam.amount}
											if (oParam.date != undefined) {dDate = oParam.date}	
										}
										
										var sData = 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
										sData += '&amount=' + ns1blankspace.util.fs(cAmount);
										sData += '&paymentdate=' + ns1blankspace.util.fs(dDate);
										sData += '&paymentmethod=3';
										sData += '&bankaccount=' + ns1blankspace.util.fs($('input[name="radioBankAccount"]:checked').val());

										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_AUTO_PAYMENT'),
											data: sData,
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.financial.expense.payment.edit($.extend(true, oParam, {step: 5}), data)
											}
										});	
									}

									if (iStep == 5)
									{
										ns1blankspace.status.message('Payment added');
										ns1blankspace.financial.expense.payment.show();
										ns1blankspace.financial.expense.payment.refresh();
									}
								}
				}
}								

ns1blankspace.financial.expense.outstanding =
{
	data: 		{},

	init: 		function (oParam, oResponse)
				{
					if (oResponse === undefined)
					{	
						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_FINANCIAL_FUNDS_TRANSFER_ACCOUNT_SEARCH';
						oSearch.addField('title,provider,providertext,status,statustext,takepayment,makepayment,urlcancel,urlsuccess,provideraccountkey,' +
											'apikey,apilogon');
						oSearch.addFilter('provider', 'EQUAL_TO', 3);
						oSearch.addFilter('makepayment', 'EQUAL_TO', 'Y');
						oSearch.addFilter('status', 'EQUAL_TO', 2);
						oSearch.rows = 100;
						oSearch.getResults(function(data) {ns1blankspace.financial.expense.outstanding.init(oParam, data)});
					}	
					else
					{
						if (oParam === undefined) {oParam = {}}

						if (oResponse.status == 'OK')
						{
							if (oResponse.data.rows.length > 0)
							{
								oParam.paymentAccount = oResponse.data.rows[0].id;
							}							
						}	

						ns1blankspace.financial.expense.outstanding.show(oParam)
					}	
				},

	show:		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceExpenseOutstandingColumn1"></td>' +
										'<td id="ns1blankspaceExpenseOutstandingColumn2" style="width:115px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMain').html(aHTML.join(''));

						$('#ns1blankspaceExpenseOutstandingColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.financial.expense.outstanding.data.expenses = [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
						oSearch.addField('reference,amount,outstandingamount,description,contactbusinesspaidto,contactbusinesspaidtotext,contactpersonpaidto,contactpersonpaidtotext');
						oSearch.addFilter('PayStatus', 'EQUAL_TO', 1);
						oSearch.addFilter('outstandingamount', 'GREATER_THAN', 0);
						oSearch.rows = 100;
						oSearch.sort('paymentduedate', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.financial.expense.outstanding.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceInvoicingUnsent" class="ns1blankspaceColumn2">' +
											'<tr><td class="ns1blankspaceSub">No outstanding expenses.</td></tr></table>');

							$('#ns1blankspaceExpenseOutstandingColumn1').html('');
						}
						else
						{
							var iPaymentAccount = ns1blankspace.util.getParam(oParam, 'paymentAccount').value;

							if (iPaymentAccount === undefined)
							{
								aHTML.push('<table class="ns1blankspaceColumn2">' +
											'<tr><td class="ns1blankspaceNothing">If you set up a ABA Direct Entry File payments account you can make bulk payments.</td></tr>' +
											'</table>');

								$('#ns1blankspaceExpenseOutstandingColumn2').html(aHTML.join(''));
							}
							else
							{
								var aHTML = [];
										
								aHTML.push('<table class="ns1blankspaceColumn2">');
										
								aHTML.push('<tr><td><span id="ns1blankspaceFinancialOutstandingFile-' + iPaymentAccount + '" class="ns1blankspaceAction ns1blankspaceFinancialOutstandingFile">' +
												'Create file</span></td></tr>');

								aHTML.push('<tr><td id="ns1blankspaceFinancialOutstandingFileStatus" style="padding-top:5px; padding-bottom:12px; font-size:0.75em;" class="ns1blankspaceSub">' +
												'Create a bank file for payments</td></tr>');

								aHTML.push('<tr><td id="ns1blankspaceFinancialOutstandingMark_container-' + iPaymentAccount + '"></td></tr>');

								aHTML.push('</table>');					
								
								$('#ns1blankspaceExpenseOutstandingColumn2').html(aHTML.join(''));
												
								$('span.ns1blankspaceFinancialOutstandingFile').button(
								{
									label: 'Create file',
									icons:
									{
										primary: "ui-icon-document"
									}
								})
								.click(function()
								{	
									oParam.step = 1;
									ns1blankspace.financial.expense.outstanding.file(oParam)
								})
								.css('width', '130px');
							}	

							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceExpenseOutstanding" class="ns1blankspace" style="font-size:0.875em;">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspaceExpenseOutstandingSelectAll"></span></td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:100px;">Contact</td>' +
										'<td class="ns1blankspaceHeaderCaption">Description</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:60px; text-align:right;">Amount</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:50px; text-align:right;">&nbsp;</td>' +
										'</tr>');

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.financial.expense.outstanding.row(this));
							});
							
							aHTML.push('</table>');
						}
											
						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceExpenseOutstandingColumn1',
							xhtmlContext: 'ExpenseOutstanding',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.financial.expense.outstanding.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.financial.expense.outstanding.bind
						}); 

						//ns1blankspace.financial.invoicing.unsent.bind();   	
					}
				},	

	row: 		function (oRow)	
				{
					var aHTML = [];

					oRow.hasEmail = false;
					
					var sContact = oRow['contactbusinesspaidtotext'];
					if (sContact == '') {sContact = oRow['contactpersonpaidtotext']}

					ns1blankspace.financial.expense.outstanding.data.expenses.push(oRow);

					aHTML.push('<tr class="ns1blankspaceRow">' +
									'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspaceExpenseOutstanding_selectContainer-' + oRow["id"] + '">' +
									'<input type="checkbox" checked="checked" id="ns1blankspaceExpenseOutstanding_select-' + oRow["id"] + '"' + 
									' title="' + oRow["reference"] + '" /></td>');

					aHTML.push('<td id="ns1blankspaceExpenseOutstanding_contact-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										sContact + '</td>');

					aHTML.push('<td id="ns1blankspaceExpenseOutstanding_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
									oRow["description"] + '</td>'); 

					aHTML.push('<td id="ns1blankspaceExpenseOutstanding_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
									oRow["outstandingamount"] + '</td>'); 

					aHTML.push('<td style="text-align:right;" class="ns1blankspaceRow">');

					aHTML.push('<span style="margin-right:5px;" id="ns1blankspaceExpenseOutstanding_option_preview-' + oRow['id'] + '"' +
									' class="ns1blankspaceRowPreview"></span>');

					aHTML.push('<span id="ns1blankspaceExpenseOutstanding_option-' + oRow['id'] + '-1"' +
									' class="ns1blankspaceRowView"></span></td>');
					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 		function ()
				{
					$('#ns1blankspaceExpenseOutstanding .ns1blankspaceRowView').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-play"
						}
					})
					.click(function() {
						ns1blankspace.financial.expense.init({id: (this.id).split('-')[1]});
					})
					.css('width', '15px')
					.css('height', '20px');

					$('.ns1blankspaceExpenseOutstandingSelectAll').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-check"
						}
					})
					.click(function()
					{	
						$('#ns1blankspaceExpenseOutstanding input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
					})
					.css('width', '14px');			
				},

	file: 		function (oParam)
				{
					var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1}).value;
					var iDataIndex = ns1blankspace.util.getParam(oParam, 'dataIndex', {"default": 0}).value;
					var iDataItemIndex = ns1blankspace.util.getParam(oParam, 'dataItemIndex', {"default": 0}).value;
					var iPaymentAccount = ns1blankspace.util.getParam(oParam, 'paymentAccount').value;
					var iFundsTransfer = ns1blankspace.util.getParam(oParam, 'fundsTransfer').value;

					if (oParam === undefined)
					{	
						oParam = {}
					}			

					if (iStep == 1)
					{	
						ns1blankspace.status.working('Creating file...');
						ns1blankspace.financial.expense.outstanding.data.toBePaid = [];

						if ($('#ns1blankspaceExpenseOutstanding input:checked').length > 0)
						{	
							$('#ns1blankspaceFinancialOutstandingFileStatus').html('<span style="font-size:2.25em;" class="ns1blankspaceSub">' +
										'<span id="ns1blankspaceFinancialOutstandingFileStatusIndex">1</span>/' + $('#ns1blankspaceExpenseOutstanding input:checked').length + 
										'</span>');
						}
						else
						{
							ns1blankspace.status.error('No expenses selected')
						}	

						$('#ns1blankspaceExpenseOutstanding input:checked').each(function() 
						{
							var iID = (this.id).split('-')[1]

							var oData = $.grep(ns1blankspace.financial.expense.outstanding.data.expenses, function (a) {return a.id == iID;})[0]

							if (oData)
							{
								ns1blankspace.financial.expense.outstanding.data.toBePaid.push(oData);
							}
						});

						oParam.step = 2;
						ns1blankspace.financial.expense.outstanding.file(oParam);
					}			

					if (iStep == 2)
					{
						var oData =
						{
							fundstransferaccount: iPaymentAccount
						}
						
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_TRANSFER_MANAGE'),
							data: oData,
							dataType: 'json',
							success: function(data)
							{
								oParam.fundsTransfer = data.id;
								oParam.step = 3;
								ns1blankspace.financial.expense.outstanding.file(oParam, data)
							}
						});
					}	

					if (iStep == 3)
					{
						if (iDataIndex < ns1blankspace.financial.expense.outstanding.data.toBePaid.length)
						{	
							$('#ns1blankspaceFinancialOutstandingFileStatusIndex').html(iDataIndex + 1);

							var oData = ns1blankspace.financial.expense.outstanding.data.toBePaid[iDataIndex];

							$('#ns1blankspaceExpenseOutstanding_option_preview-' + oData.id).html(ns1blankspace.xhtml.loadingSmall)

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_ITEM_SEARCH';
							oSearch.addField('financialaccounttext,tax,issuedamount,amount,expenseoutstandingamount,description,object');
							oSearch.addFilter('object', 'EQUAL_TO', 2);
							oSearch.addFilter('objectcontext', 'EQUAL_TO', oData.id);
							oSearch.addFilter('expenseoutstandingamount', 'GREATER_THAN', 0);

							oSearch.sort('id', 'asc');
							oSearch.getResults(function(oResponse)
							{
								$('#ns1blankspaceExpenseOutstanding_option_preview-' + oData.id).html('');
								$('#ns1blankspaceExpenseOutstanding_option_preview-' + oData.id).addClass('ns1blankspaceRowPreviewDone');

								$('#TODOns1blankspaceExpenseOutstanding_option_preview-' + oData.id).button(
								{
									text: false,
									icons:
									{
										primary: "ui-icon-document"
									}
								})
								.click(function() {
									ns1blankspace.financial.expense.outstanding.file.showHide({xhtmlElementID: this.id});
								})
								.css('width', '15px')
								.css('height', '20px');

								ns1blankspace.financial.expense.outstanding.data.toBePaid[iDataIndex].items = oResponse.data.rows;

								oParam.dataIndex = iDataIndex + 1;
								ns1blankspace.financial.expense.outstanding.file(oParam);
							});
						}
						else
						{
							delete oParam.dataIndex;
							oParam.step = 4;
							ns1blankspace.financial.expense.outstanding.file(oParam);
						}	
					}

					if (iStep == 4)
					{
						var aItems = [];

						$.each(ns1blankspace.financial.expense.outstanding.data.toBePaid, function (i, v)
						{
							$.each(v.items, function (j, k)
							{
								aItems.push(k.id);
							});
						});

						var oData =
						{
							transfer: iFundsTransfer,
							lineitem: aItems.join(',')
						}
						
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_TRANSFER_EXPENSE_MANAGE'),
							data: oData,
							dataType: 'json',
							success: function(data)
							{
								oParam.step = 5;
								ns1blankspace.financial.expense.outstanding.file(oParam);
							}	
						});
					}

					if (iStep == 5)
					{
						var oData =
						{
							id: iFundsTransfer,
						}
						
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_TRANSFER_CREATE_FILE'),
							data: oData,
							dataType: 'json',
							success: function(data)
							{	
								ns1blankspace.status.message('File created');
								$('#ns1blankspaceFinancialOutstandingFileStatus').html('<a target="_blank" href="/download/' + data.attachmentlink + '"">Download</a>');

								$('#ns1blankspaceFinancialOutstandingMark_container-' + iPaymentAccount).html(
									'<span id="ns1blankspaceFinancialOutstandingMark-' + iPaymentAccount + '" class="ns1blankspaceAction ns1blankspaceFinancialOutstandingMark">' +
												'Mark as paid</span><br />' + 
												'<div style="padding-top:5px; font-size:0.75em;" class="ns1blankspaceSub">' +
												'Create payments for the expenses in the file.</div>');

								$('span.ns1blankspaceFinancialOutstandingMark').button(
								{
									label: 'Mark as paid',
									icons:
									{
										primary: "ui-icon-check"
									}
								})
								.click(function()
								{	
									if (confirm('Have you downloaded the file? Cancel to do it now.'))
									{
										oParam.step = 6;
										ns1blankspace.financial.expense.outstanding.file(oParam)
									}
								})
								.css('width', '130px');
							}	
						});
					}

					if (iStep == 6)
					{
						ns1blankspace.status.working('Creating payments...');

						var oData =
						{
							id: iFundsTransfer,
						}
						
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_TRANSFER_CREATE_PAYMENTS'),
							data: oData,
							dataType: 'json',
							success: function(data)
							{	
								

								ns1blankspace.status.message(data.count + ' payment' + (data.count=1?'':'s') + ' created');
								ns1blankspace.financial.expense.outstanding.init();
							}	
						});
					}	
				}												
}				