/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.financial.payment =
{
	init: 	function (oParam)
				{
					var bInitialised = false;

					if (oParam != undefined)
					{
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}	
					}

					ns1blankspace.app.reset();

					ns1blankspace.object = 3;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'payment';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Payments';
					
					if (!bInitialised)
					{
						ns1blankspace.financial.initData(oParam)
					}
					else
					{
						ns1blankspace.app.set(oParam);
					}	
				},

	refresh: function (oResponse)
				{
					if (oResponse == undefined)
					{
						$('#ns1blankspaceControlSubContext_amount').html(ns1blankspace.xhtml.loadingSmall);
							
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
						oSearch.addField('paiddate,amount,tax');
						oSearch.rf = 'json';
						oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
						
						oSearch.getResults(function(data) {ns1blankspace.financial.payment.refresh(data)});
					}
					else
					{
						var oObjectContext = oResponse.data.rows[0];
						
						ns1blankspace.objectContextData.paiddate = ns1blankspace.util.fd(oObjectContext.paiddate);
						ns1blankspace.objectContextData.amount = oObjectContext.amount;
								
						$('#ns1blankspaceControlContext_paiddate').html(ns1blankspace.objectContextData.paiddate);
						$('#ns1blankspaceControlContext_amount').html(ns1blankspace.option.currencySymbol + oObjectContext.amount);
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

						if (ns1blankspace.option.paymentShowImages)
						{
							aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td style="padding-top:15px;" id="ns1blankspaceControlPaymentImages" class="ns1blankspaceControl">' +
											'Payment<br />Receipts<br /><span class="ns1blankspaceSub" style="font-size:0.75em;">photos</span></td>' +
									'</tr>');
						}

						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));

						$('#ns1blankspaceControlPaymentImages').click(function(event)
						{
							ns1blankspace.financial.payment.images.show();
						});		

						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
						oSearch.addField('reference,description,contactbusinesspaidtotext,contactpersonpaidtotext,paiddate,amount');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(function (data) {ns1blankspace.financial.payment.home(oParam, data)});
					}
					else
					{
						var aHTML = [];
				
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceNothing">Click New to add a payment.</td></tr>');
							aHTML.push('</table>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceCaption" colspan="4">MOST LIKELY</td></tr>');
							
							$.each(oResponse.data.rows, function()
							{					
								aHTML.push('<tr class="ns1blankspaceRow">');
							
								aHTML.push('<td id="ns1blankspaceMostLikely_Title-' + this.id + '" class="ns1blankspaceMostLikely" style="width:50px;">' +
														this.reference + '</td>');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Amount-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:50px;text-align:right;">' +
														'$' + this.amount + '</td>');
																		
								aHTML.push('<td id="ns1blankspaceMostLikely_Date-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;">' +
														ns1blankspace.util.fd(this.paiddate) + '</td>');
																										
								var sContact = this.contactbusinesspaidtotext;
								if (sContact == '') {sContact = this.contactpersonpaidtotext}
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Contact-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
														sContact + '</td>');
									
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							 ns1blankspace.financial.payment.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 	function (sXHTMLElementId, oParam)
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
										oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
										oSearch.addField('contactbusinesspaidtotext,contactbusinesspaidto,contactpersonpaidtotext,' +
																			'contactpersonpaidto,projecttext,project,areatext,' +
																			'area,reference,paiddate,description,amount,tax,bankaccount,' +
																			'reconciliation,reconciliationtext,sourcebanktransaction,sourcebanktransactiontext,' +
																			'payment.contactpersonpaidto.email',
																			'payment.contactbusinesspaidto.email');

										oSearch.addField(ns1blankspace.option.auditFields);
										
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										
										oSearch.getResults(function(data) {ns1blankspace.financial.payment.show(oParam, data)});
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
											oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
											oSearch.addField('contactbusinesspaidtotext,contactbusinesspaidto,contactpersonpaidtotext,contactpersonpaidto,' +
																'reference,paiddate,amount,reconciliation,reconciliationtext');

											oSearch.addBracket('(');
											oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('payment.contactbusinesspaidto.tradename', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('payment.contactpersonpaidto.surname', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addBracket(')');
											
											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.sort('paiddate', 'desc');

											oSearch.getResults(function(data) {ns1blankspace.financial.payment.search.process(oParam, data)});	
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
															this.reference +
															'</td>');

											aHTML.push('<td class="ns1blankspaceSearch" id="' +
													'search-' + this.id + '">' +
													ns1blankspace.util.fd(this.paiddate) +
													'</td>');

											aHTML.push('<td class="ns1blankspaceSearch" id="' +
													'search-' + this.id + '" style="text-align:right;">' +
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
											ns1blankspace.financial.payment.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'reference',
											more: oResponse.moreid,
											width: 400,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.financial.payment.search.send
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
						
						aHTML.push('<tr><td id="ns1blankspaceControlExpenses" class="ns1blankspaceControl">' +
										'Expenses</td></tr>');
													
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
					aHTML.push('<div id="ns1blankspaceMainExpense" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainCredit" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTransaction" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.financial.payment.summary();
					});

					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.financial.payment.details();
					});
					
					$('#ns1blankspaceControlItem').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainItem', refresh: true});
						ns1blankspace.financial.item.show({namespace: 'payment'});
					});

					$('#ns1blankspaceControlCredit').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainCredit', refresh: true});
						ns1blankspace.financial.util.credit.show({namespace: 'payment'});
					});

					$('#ns1blankspaceControlExpenses').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainExpense', refresh: true});
						ns1blankspace.financial.payment.expense.show();
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
					ns1blankspace.financial.payment.layout();
					
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
						ns1blankspace.objectContextData.paiddate = ns1blankspace.util.fd(ns1blankspace.objectContextData.paiddate);
						
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
								
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.reference +
							'<br /><span id="ns1blankspaceControlContext_paiddate" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.paiddate + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_amount" class="ns1blankspaceSub">$' + ns1blankspace.objectContextData.amount + '</span>');
							
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.financial.payment.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.payment.summary()'});
					}	
				},		
		
	summary: function (oParam)
				{
					var aHTML = [];
					var bUseTemplate = ns1blankspace.util.getParam(oParam, 'useTemplate').value;
					var bTemplateInitialised = ns1blankspace.util.getParam(oParam, 'templateInitialised').value;

					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the payment.</td></tr></table>');
								
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceRow">' +
										'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
										'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:80px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
						
						var aHTML = [];

						if (!bTemplateInitialised)
						{	
							oParam = ns1blankspace.util.setParam(oParam, 'object', ns1blankspace.object);
							oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.payment.summary);
							ns1blankspace.format.templates.init(oParam);
						}
						else
						{
							var oTemplate = ns1blankspace.format.templates.get({object: ns1blankspace.object});

							if (oTemplate != undefined && (ns1blankspace.financial.summaryUseTemplate || bUseTemplate))
							{
								aHTML.push(ns1blankspace.format.render(
								{
									object: 3,
									xhtmlTemplate: oTemplate.xhtml,
									objectOtherData: oParam.objectOtherData
								}));
							}
							else
							{
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
								
								aHTML.push('</table>');
							}	

							$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

							var aHTML = [];

							aHTML.push('<table class="ns1blankspaceColumn2">');

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Date Paid</td></tr>' +
												'<tr><td id="ns1blankspaceSummaryPaidDate" class="ns1blankspaceSummary">' +
												ns1blankspace.objectContextData.paiddate + 
												'</td></tr>');

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Remittance</td></tr>');

							if (bUseTemplate && oTemplate != undefined)
							{
								aHTML.push('<tr><td><span id="ns1blankspaceSummaryCreatePDF" class="ns1blankspaceAction" style="width:75px;">' +
												'PDF</span></td></tr>');
							}
							else
							{				
								aHTML.push('<tr><td>' +
												'<span id="ns1blankspaceSummaryView" class="ns1blankspaceAction" style="width:75px;">' +
												'View</span></td></tr>');
							}

							aHTML.push('<tr><td>' +
										'<span id="ns1blankspaceSummaryEmail" class="ns1blankspaceAction" style="width:75px;">' +
										'Email</span></td></tr>');

							if (ns1blankspace.objectContextData.paid == 'N')
							{	
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Not paid</td></tr>');			
							}

							aHTML.push('<tr><td class="ns1blankspaceSub" style="padding-top:12px;">');
							
							if (ns1blankspace.objectContextData.reconciliation == '')
							{
									aHTML.push('This payment is yet to be reconciled.');
							}
							else
							{
									aHTML.push('This payment has been reconciled!');
							}
							
							aHTML.push('</td></tr>');

							if (ns1blankspace.financial.data.bankaccounts.length == 0)
							{
								aHTML.push('<tr><td class="ns1blankspaceSub" style="color:red;">' +
													'No bank accounts set up!' +
													'</td></tr>');
							}
		
							aHTML.push('</table>');		

							$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));

							if (ns1blankspace.financial.summaryUseTemplate || bUseTemplate)
							{
								$('#ns1blankspaceSummaryCreatePDF').button(
								{
									label: 'PDF'
								})
								.click(function(event)
								{
									var sHTML = $('#ns1blankspaceSummaryColumn1').html();
									var sURL = document.location.protocol + '//' + document.location.host;

									$('#ns1blankspaceSummaryCreatePDF').unbind('click');

									ns1blankspace.pdf.create(
									{
										xhtmlElementID: 'ns1blankspaceSummaryCreatePDF',
										xhtmlContent: sHTML,
										filename: ns1blankspace.objectContextData.reference + '.pdf',
										open: false,
										leftmargin: 45,
										baseURLBody:  sURL
									});
								});
							}		
							else		
							{	
								$('#ns1blankspaceSummaryView').button(
								{
									label: 'View'
								})
								.click(function(event)
								{
									ns1blankspace.financial.payment.summary({useTemplate: true});
								});
							}

							$('#ns1blankspaceSummaryEmail').button(
							{
								label: 'Email'
							})
							.click(function(event)
							{
								if (ns1blankspace.financial.summaryUseTemplate || bUseTemplate)
								{
									$('#ns1blankspaceSummaryColumn1').html('');
									delete(ns1blankspace.objectContextData.xhtml);
								}
								ns1blankspace.financial.payment.email.init();
							});
						}	
					}	
				},

	details: function ()
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
										'Paid Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsPaidDate" class="ns1blankspaceDate">' +
										'</td></tr>');

						if (ns1blankspace.financial.data.settings.taxreportcalculationmethod == 1
									&& ns1blankspace.objectContext == -1)
						{	
							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Account' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceItemAccount" class="ns1blankspaceText">' +
										'</td></tr>');
							
							aHTML.push('<tr><td style="padding-bottom:5px;" id="ns1blankspaceItemAddSearchResults">' +
											'<span class="ns1blankspaceSub" style="font-size:0.75em;">Press <i>enter</i> to see all or just start typing.<br />If left it bank, it will default to the creditors account.</span></td></tr>');																			
						}
								
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Amount' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsAmount" class="ns1blankspaceText">' +
										'</td></tr>');			
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										ns1blankspace.option.taxVATCaption + ' Type' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td id="ns1blankspaceDetailsTaxCode" class="ns1blankspaceRadio">' +
										ns1blankspace.xhtml.loadingSmall +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										ns1blankspace.option.taxVATCaption + ' Amount' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsTax" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('</table>');									
						
						
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
										
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Bank Account' +
										'</td></tr>' +
										'<tr class="ns1blankspaceRadio">' +
										'<td id="ns1blankspaceDetailsBankAccount" class="ns1blankspaceRadio">');
										
										$.each(ns1blankspace.financial.data.bankaccounts, function()
										{
											if (_.isObject(ns1blankspace.objectContextData))
											{
												if (ns1blankspace.objectContextData.bankaccount == undefined) {ns1blankspace.objectContextData.bankaccount = this.id}
											}		
													
											aHTML.push('<input type="radio" id="radioBankAccount' + this.id + '" name="radioBankAccount" value="' + this.id + '"/>' +
																this.title + '<br />');				
										});
										
						aHTML.push('</td></tr>');				

						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference.formatXHTML());
							$('#ns1blankspaceDetailsPaidDate').val(ns1blankspace.objectContextData.paiddate);
							$('#ns1blankspaceDetailsContactBusinessPaidTo').attr('data-id', ns1blankspace.objectContextData.contactbusinesspaidto);
							$('#ns1blankspaceDetailsContactBusinessPaidTo').val(ns1blankspace.objectContextData.contactbusinesspaidtotext.formatXHTML());
							$('#ns1blankspaceDetailsContactPersonPaidTo').attr('data-id', ns1blankspace.objectContextData.contactpersonpaidto);
							$('#ns1blankspaceDetailsContactPersonPaidTo').val(ns1blankspace.objectContextData.contactpersonpaidtotext.formatXHTML());	
							$('#ns1blankspaceDetailsAmount').val(ns1blankspace.objectContextData.amount);
							$('[name="radioTaxCode"][value="' + ns1blankspace.objectContextData.taxtype + '"]').attr('checked', true);
							$('#ns1blankspaceDetailsTax').val(ns1blankspace.objectContextData.tax);	
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.description.formatXHTML());
							iDefaultBankAccount = ns1blankspace.objectContextData.bankaccount;
						}
						else
						{
							iDefaultBankAccount = _.find(ns1blankspace.financial.data.bankaccounts, function (ba) {return ba.defaultpaymentaccount == 'Y'});

							if (_.isUndefined(iDefaultBankAccount))
							{
								iDefaultBankAccount = _.first(ns1blankspace.financial.data.bankaccounts).id;
							}	

							$('#ns1blankspaceDetailsPaidDate').val(Date.today().toString("dd MMM yyyy"));
						}

						$('[name="radioBankAccount"][value="' + iDefaultBankAccount + '"]').attr('checked', true);
					}	
				},

	save: 	{
					send: 	function (oParam, oResponse)
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
										sData += '&bankaccount=' + $('[name="radioBankAccount"]:checked').val();
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_PAYMENT_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data) {ns1blankspace.financial.payment.save.process(oParam, data)}
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
											ns1blankspace.financial.payment.save.amount(oParam);
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
										ns1blankspace.inputDetected = false;
										ns1blankspace.financial.payment.init({id: ns1blankspace.objectContext});
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
															ns1blankspace.financial.payment.search.send('-' + ns1blankspace.objectContext, {source: 1});
														}
														else
														{	
															ns1blankspace.financial.payment.refresh();
														}	
													}
												});
											}
										});
									}	
								}
				},

	expense: {
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
												 ns1blankspace.financial.payment.expense.edit(oParam);
											})
										}
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_PAYMENT_EXPENSE_SEARCH';
										oSearch.addField('expense,expensetext,appliesdate,amount,tax');
										oSearch.addFilter('payment', 'EQUAL_TO', iObjectContext);
										oSearch.sort('appliesdate', 'asc');
										oSearch.rows = 100;
										oSearch.getResults(function(data) {ns1blankspace.financial.payment.expense.show(oParam, data)});
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
												aHTML.push(ns1blankspace.financial.payment.expense.row(this, oParam));
											});

											aHTML.push('</table>');

											ns1blankspace.render.page.show(
											{
												type: 'JSON',
												xhtmlElementID: 'ns1blankspaceExpenseColumn1',
												xhtmlContext: 'PaymentExpense',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: 100,
												functionShowRow: ns1blankspace.financial.payment.expense.row,
												functionOpen: undefined,
												functionOnNewPage: ns1blankspace.financial.payment.expense.bind
											}); 
										}
									}	
								},

					row: 		function (oRow, oParam)
								{
									var oOptions = {view: true, remove: true};
																		
									if (oParam != undefined)
									{
										if (oParam.options != undefined) {oOptions = oParam.options}
									}

									var aHTML = []

									aHTML.push('<tr class="ns1blankspaceRow">');
																							
									aHTML.push('<td id="ns1blankspaceReceipt_reference-' + oRow.id + '" class="ns1blankspaceRow">' +
													oRow.expensetext + '</td>');
																								
									aHTML.push('<td id="ns1blankspaceReceipt_date-' + oRow.id + '" class="ns1blankspaceRow">' +
													oRow.appliesdate + '</td>');

									aHTML.push('<td id="ns1blankspaceReceipt_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
													oRow.amount + '</td>');

									aHTML.push('<td id="ns1blankspaceReceipt_tax-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
													oRow.tax + '</td>');

									aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
										
									if (oOptions.remove)
									{	
										aHTML.push('<span id="ns1blankspaceExpense_options_remove-' + oRow.id + '" class="ns1blankspaceExpenseRemove"></span>');
									};

									if (oOptions.view)
									{	
										aHTML.push('<span id="ns1blankspaceExpense_options_view-' + oRow.expense + '" class="ns1blankspaceExpenseView"></span>');
									}	
										
									aHTML.push('</td></tr>');

									return aHTML.join('');
								},

					bind: 	function (oParam)
								{
									var oOptions = {view: true, remove: true};
																		
									if (oParam != undefined)
									{
										if (oParam.options != undefined) {oOptions = oParam.options}
									}

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
											ns1blankspace.financial.payment.expense.remove({xhtmlElementID: this.id});
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
				},

	email: 	{
					init: 	function (oParam)
								{								
									oParam = ns1blankspace.util.setParam(oParam, 'object', ns1blankspace.object);
									oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.payment.email.render);
			
									ns1blankspace.format.templates.init(oParam);
								},

					render: 	function (oParam, oResponse)
								{
									ns1blankspace.status.working('Creating...');

									var iMode = ns1blankspace.util.getParam(oParam, 'mode', {"default": 1}).value;
									var fPreProcess = ns1blankspace.util.getParam(oParam, 'preProcess').value;

									//1=Show, 2=Just Send

									var iFormat = ns1blankspace.util.getParam(oParam, 'format', {"default": 1}).value;

									//1=HTML, 2=PDF
		
									var oTemplate = ns1blankspace.format.templates.get(oParam);

									ns1blankspace.objectContextData.xhtml = ns1blankspace.format.render(
									{
										object: ns1blankspace.object,
										xhtmlTemplate: oTemplate.xhtml,
										objectData: ns1blankspace.objectContextData
									});

									ns1blankspace.status.clear();

									if (iMode == 1)
									{
										ns1blankspace.financial.payment.email.show(oParam);
									}
									else
									{
										ns1blankspace.financial.payment.email.send(oParam);
									}	
								},		

					show: 	function (oParam)
								{
									ns1blankspace.format.editor.init();

									var aHTML = [];

									aHTML.push('<table class="ns1blankspace" cellspacing=0 cellpadding=0>');
						
									aHTML.push('<tr><td>')

										aHTML.push('<table class="ns1blankspace" style="width:100%;" cellspacing=0 cellpadding=0>');

										aHTML.push('<tr><td class="ns1blankspaceCaption">' +
														'To</td>' +
														'<td class="ns1blankspaceCaption">' +
														'From</td></tr>' +
														'<tr>' +
														'<td class="ns1blankspaceText" style="padding-right:15px; padding-left:0px;">' +
														'<input id="ns1blankspaceEmailTo" class="ns1blankspaceText">' +
														'</td><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceEmailFrom" class="ns1blankspaceSelect"' +
																	' data-method="SETUP_MESSAGING_ACCOUNT_SEARCH"' +
																	' data-methodFilter="type-EQUAL_TO-5"' +
																	' data-customOption="hasaccess-Y"' +
																	' data-columns="email">' +
													'</td></tr>');

										aHTML.push('</table>');											

									aHTML.push('</td></tr>')

									aHTML.push('<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceText">' +
													'<input id="ns1blankspaceEmailSubject" class="ns1blankspaceText" style="width:100%;">' +
													'</td></tr>');	
									//' <div style="font-size:0.875em; color:#999999; float:right; margin-top:6px;"><input type="checkbox" id="ns1blankspaceEmailAttachPDF">Attach a PDF</div>' +
			
									ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;		

									aHTML.push('<tr class="ns1blankspaceTextMulti">' +
													'<td class="ns1blankspaceTextMulti">' +
													'<textarea rows="30" cols="50" id="ns1blankspaceMessageText' +
														ns1blankspace.counter.editor + '" editorcount="' + ns1blankspace.counter.editor + '" class="ns1blankspaceTextMulti"></textarea>' +
													'</td></tr>');

									aHTML.push('</table>');					
						
									$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

									var sMessage = ns1blankspace.objectContextData.xhtml;
									
									$('#ns1blankspaceMessageText' + ns1blankspace.counter.editor).val(sMessage);

									ns1blankspace.format.editor.init({selector: '#ns1blankspaceMessageText' + ns1blankspace.counter.editor});

									var aHTML = [];
									
									aHTML.push('<table class="ns1blankspaceColumn2">' +
													'<tr><td><span id="ns1blankspaceEmailSend" class="ns1blankspaceAction">' +
													'Send</span></td></tr>' +
													'<tr><td><span id="ns1blankspaceEmailCancel" class="ns1blankspaceAction">' +
													'Cancel</span></td></tr>' +
													'</table>');					
									
									$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));
									
									$('#ns1blankspaceEmailSend').button(
									{
										text: "Send"
									})
									.click(function()
									{
										if ($('#ns1blankspaceEmailAttachPDF:checked').length == 0)
										{
											ns1blankspace.financial.invoice.email.send(oParam)
										}
										else
										{
											oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.invoice.email.send);
											oParam = ns1blankspace.util.setParam(oParam, 'xhtmlContent', ns1blankspace.objectContextData.xhtml);
											oParam = ns1blankspace.util.setParam(oParam, 'filename', ns1blankspace.objectContextData.reference + '.pdf');
											oParam = ns1blankspace.util.setParam(oParam, 'open', false);
											oParam = ns1blankspace.util.setParam(oParam, 'leftmargin', 45);
											oParam.baseURLBody = window.location.protocol + '/' + window.location.host;

											ns1blankspace.pdf.create(oParam);
										}	
									})
									.css('width', '65px');

									$('#ns1blankspaceEmailCancel').button(
									{
										text: "Cancel"
									})
									.click(function()
									{
										ns1blankspace.financial.payment.summary();
									})
									.css('width', '65px');

									$('#ns1blankspaceEmailFrom').val(ns1blankspace.user.email);
									var emailTo = ns1blankspace.objectContextData['payment.contactpersonpaidto.email'];
									if (emailTo == '') {emailTo = ns1blankspace.objectContextData['payment.contactbusinesspaidto.email']}
									$('#ns1blankspaceEmailTo').val(emailTo);
									$('#ns1blankspaceEmailSubject').val(ns1blankspace.user.contactBusinessText + ' Payment Remittance ' + ns1blankspace.objectContextData['reference']);

									if (ns1blankspace.objectContextData['payment.contactpersonpaidto.email'] == '')
									{
										$('#ns1blankspaceEmailTo').focus();
									}
								},	

					send:		function (oParam, oResponse)
								{
									var iMode = ns1blankspace.util.getParam(oParam, 'mode', {"default": 1}).value;

									//1=Show, 2=Just Send

									var iFormat = ns1blankspace.util.getParam(oParam, 'format', {"default": 1}).value;

									//1=HTML, 2=PDF

									var iAttachmentLink = ns1blankspace.util.getParam(oParam, 'attachmentLink').value;

									if (iMode == 1)
									{
										var sTo = $('#ns1blankspaceEmailTo').val();
										var sSubject = $('#ns1blankspaceEmailSubject').val();
										var sMessage = tinyMCE.get('ns1blankspaceMessageText' + ns1blankspace.counter.editor).getContent();
									}	
									else
									{	
										var sTo = ns1blankspace.objectContextData['invoice.contactpersonsentto.email'];
										var sSubject = ns1blankspace.objectContextData.reference;
										var sMessage = ns1blankspace.objectContextData.xhtml;
									}	

									if (sTo == '')
									{
										ns1blankspace.status.error('No email address')
									}
									else
									{	
										ns1blankspace.status.working('Emailing...');

										if (ns1blankspace.objectContextData.xhtml == '')
										{
											ns1blankspace.status.error('Nothing to email');
										}	
										else
										{
											var oData = 
											{
												subject: sSubject,
												message: sMessage,
												to: sTo,
												saveagainstobject: 5,
												saveagainstobjectcontext: ns1blankspace.objectContext,
												send: 'Y',
												applysystemtemplate: 'Y'
											}

											if (iAttachmentLink !== undefined)
											{
												oData.copyattachmentsfromobject = 5;
												oData.copyattachmentsfromobjectcontext = ns1blankspace.objectContext;
												oData.copyattachmentsfromobjectattachmentlink = iAttachmentLink
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
														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_INVOICE_MANAGE'),
															data: 'sent=Y&id=' + ns1blankspace.objectContext,
															dataType: 'json',
															global: false,
															success: function (data)
															{
																ns1blankspace.status.message('Emailed');
																ns1blankspace.financial.invoice.summary.show();
															}
														});
													}
													else
													{
														ns1blankspace.status.error('Could not send email')
													}
												}
											});
										}
									}	
								}		
				}																			
}

ns1blankspace.financial.payment.images =
{
	show:		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspacePaymentImagesColumn1" style="width:100px;"></td>' +
										'<td id="ns1blankspacePaymentImagesColumn2" ></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMain').html(aHTML.join(''));

						$('#ns1blankspacePaymentImagesColumn1').html(ns1blankspace.xhtml.loading);

						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_ATTACHMENT_SEARCH';
						oSearch.addField('type,filename,title,description,download,modifieddate,attachment,bucket,createddate,createdusertext,object,objectcontext');
						oSearch.addFilter('title', 'EQUAL_TO', '_upload.expense.image');
						oSearch.rows = 50;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(function(data) {ns1blankspace.financial.payment.images.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceSubNote">No upload payment receipt photos.</td></tr></table>');

							$('#ns1blankspacePaymentImagesColumn1').html('');
						}
						else
						{
							var aHTML = [];

							aHTML.push('<table id="ns1blankspacePaymentImages" class="ns1blankspace" style="font-size:0.875em;">');

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.financial.payment.images.row(this));
							});
							
							aHTML.push('</table>');
						}
											
						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspacePaymentImagesColumn1',
							xhtmlContext: 'PaymentImages',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.financial.payment.images.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.financial.payment.images.bind
						}); 
					}
				},	

	row: 		function (oRow)	
				{
					var aHTML = [];

					aHTML.push('<tr class="ns1blankspaceRow">');

					aHTML.push('<td id="ns1blankspacePaymentImages_modifieddate-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
										' data-id="' + oRow["id"] + '"' +
										' data-object="' + oRow["object"] + '"' +
										' data-objectcontext="' + oRow["objectcontext"] + '"' +
										'>' +
										oRow["modifieddate"] + '</td>');

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function ()
				{
					$('#ns1blankspacePaymentImages .ns1blankspaceRowSelect')
					.click(function()
					{
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceColumn2">' +
										'<tr>' +
										'<td id="ns1blankspacePaymentImageDetailsColumn1">' +
										'<canvas id="ns1blankspacePaymentImageDetailsColumn1_canvas">' +
										'</td>' +
										'<td id="ns1blankspacePaymentImageDetailsColumn2" style="width:150px; padding-left:10px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspacePaymentImagesColumn2').html(aHTML.join(''));

						var sURL = '/rpc/core/?method=CORE_IMAGE_SHOW&id=' + $(this).attr('data-id');

						ns1blankspace.visualise.util.imageToCanvas(
						{
							imageSource: sURL,
							xhtmlElementCanvasID: 'ns1blankspacePaymentImageDetailsColumn1_canvas',
							autoRotation: 90,
							autoScale: true
						});

						var iObject = $(this).attr('data-object');
						var iObjectContext = $(this).attr('data-objectcontext');

						if (iObject != '' && iObjectContext != '')
						{
							ns1blankspace.financial.payment.images.object(
							{
								object: iObject,
								objectContext: iObjectContext
							});
						}
					});
				},

	object: 	function (oParam, oResponse)
				{
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
					var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext').value;

					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CONTACT_BUSINESS_SEARCH';
						oSearch.addField('tradename');
						oSearch.addFilter('id', 'EQUAL_TO', iObjectContext);
						oSearch.rows = 1;
						oSearch.getResults(function(data) {ns1blankspace.financial.payment.images.object(oParam, data)});
					}
					else
					{
						var aHTML = [];

						if (oResponse.data.rows.length != 0 && (iObjectContext != ns1blankspace.user.contactBusiness))
						{	
							aHTML.push('<div class="ns1blankspaceSub">' + oResponse.data.rows[0].tradename + '</div>');
						}

						$('#ns1blankspacePaymentImageDetailsColumn2').html(aHTML.join(''))
					}
				}
}			