/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

ns1blankspace.financial.receipt = 
{
	init: 	function (oParam)
				{
					var bInitialised = false;
					
					if (oParam != undefined)
					{
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}	
					}

					ns1blankspace.app.reset();

					ns1blankspace.object = 6;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'receipt';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Receipts';

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
						oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
						oSearch.addField('receiveddate,amount,tax');
						oSearch.rf = 'json';
						oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
						oSearch.getResults(function(data) {ns1blankspace.financial.receipt.refresh(data)});
					}
					else
					{
						var oObjectContext = oResponse.data.rows[0];
						
						ns1blankspace.objectContextData.receiveddate = ns1blankspace.util.fd(oObjectContext.receiveddate);
						ns1blankspace.objectContextData.amount = oObjectContext.amount;
								
						$('#ns1blankspaceControlContext_receiveddate').html(ns1blankspace.objectContextData.receiveddate);
						$('#ns1blankspaceControlContext_amount').html(ns1blankspace.option.currencySymbol + oObjectContext.amount);
					}
				},	

	home: 	function (oParam, oResponse)
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

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td style="padding-top:18px;" id="ns1blankspaceControlUnallocated" class="ns1blankspaceControl">' +
										'Unallocated<br /><span class="ns1blankspaceSub" style="font-size:0.625em;">Receipt items that have been marked as unallocated and not applied to an invoice.</span></td>' +
									'</tr>');

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td style="padding-top:18px;" id="ns1blankspaceControlUnreconciled" class="ns1blankspaceControl">' +
										'Unreconciled<br /><span class="ns1blankspaceSub" style="font-size:0.625em;">Receipts that have not been reconciled against a bank account.</span></td>' +
									'</tr>');

						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));

						$('#ns1blankspaceControlUnallocated').click(function(event)
						{
							ns1blankspace.financial.receipt.unallocated.show();
						});

						$('#ns1blankspaceControlUnreconciled').click(function(event)
						{
							ns1blankspace.financial.receipt.unreconciled.show();
						});

						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
						oSearch.addField('reference,description,contactbusinessreceivedfromtext,contactpersonreceivedfromtext,receiveddate,amount');
						oSearch.rows = 20;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(function (data) {ns1blankspace.financial.receipt.home(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceNothing">Click New to add a receipt.</td></tr>');
							aHTML.push('</table>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceCaption" colspan="4">RECENT</td></tr>');
							
							$.each(oResponse.data.rows, function()
							{					
								aHTML.push('<tr class="ns1blankspaceRow">');
									
								aHTML.push('<td id="ns1blankspaceMostLikely_Title-' + this.id + '" class="ns1blankspaceMostLikely" style="width:50px;">' +
														this.reference + '</td>');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Amount-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:50px;text-align:right;">' +
														'$' + this.amount + '</td>');
																		
								aHTML.push('<td id="ns1blankspaceMostLikely_Date-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;">' +
														ns1blankspace.util.fd(this.receiveddate) + '</td>');
																										
								var sContact = this.contactbusinessreceivedfromtext;
								if (sContact == '') {sContact = this.contactpersonreceivedfromtext}
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Contact-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
														sContact + '</td>');
									
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							 ns1blankspace.financial.receipt.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
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
										oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
										oSearch.addField('contactbusinessreceivedfromtext,contactbusinessreceivedfrom,' +
																'contactpersonreceivedfromtext,contactpersonreceivedfrom,' +
																'projecttext,project,areatext,area,' +
																'receipt.sourcebanktransaction.amount,' +
																'receipt.sourcebanktransaction.posteddate,' +
																'receipt.sourcebanktransaction.notes,' +
																'reference,paymentmethodtext,paymentmethod,receiveddate,description,amount,tax,reconciliation,reconciliationtext');

										oSearch.addField(ns1blankspace.option.auditFields);
										
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										
										oSearch.getResults(function(data) {ns1blankspace.financial.receipt.show(oParam, data)});
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
											oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
											oSearch.addField('contactbusinessreceivedfromtext,contactbusinessreceivedfrom,' +
																'contactpersonreceivedfromtext,contactpersonreceivedfrom,' +
																'reference,receiveddate,description,amount');

											if (sSearchText != '')
											{	
												oSearch.addBracket('(');
												oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
												oSearch.addOperator('or');
												oSearch.addFilter('receipt.contactbusinessreceivedfrom.tradename', 'TEXT_IS_LIKE', sSearchText);
												oSearch.addOperator('or');
												oSearch.addFilter('receipt.contactpersonreceivedfrom.surname', 'TEXT_IS_LIKE', sSearchText);

												if (!_.isNaN(_.toNumber(sSearchText)))
												{
													oSearch.addOperator('or');
													oSearch.addFilter('receipt.amount', 'APPROX_EQUAL_TO', sSearchText);
												}

												var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
	  											if (oSearchDate.isValid())
												{
													oSearch.addOperator('or');
													oSearch.addFilter('receiveddate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
												}

												oSearch.addBracket(')');
											}	

											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.sort('receiveddate', 'desc');
											oSearch.rows = ns1blankspace.option.defaultRowsSmall;

											oSearch.getResults(function(data) {ns1blankspace.financial.receipt.search.process(oParam, data)});	
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var iMaximumColumns = 1;
									var sContact;
										
									ns1blankspace.search.stop();
										
									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
									}
									else
									{		
										aHTML.push('<table class="ns1blankspaceSearchMedium" style="width:520px;">');
											
										$.each(oResponse.data.rows, function()
										{	
											aHTML.push(ns1blankspace.financial.receipt.search.row(oParam, this));
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.searchContainer).html(
											ns1blankspace.render.init(
											{
												html: aHTML.join(''),
												more: (oResponse.morerows == "true"),
												header: false,
												width: 520
											}) 
										);	
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
											$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.financial.receipt.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'reference',
											more: oResponse.moreid,
											width: 520,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.financial.receipt.search.send,
											functionRow: ns1blankspace.financial.receipt.search.row
										});   
									}				
								},

						row: 	function (oParam, oRow)
								{
									var aHTML = [];
									var sContact;
												
									aHTML.push('<tr class="ns1blankspaceSearch">');
								
									aHTML.push('<td class="ns1blankspaceSearch" id="' +
													'search-' + oRow.id + '">' +
													oRow.reference +
													'</td>');

									aHTML.push('<td class="ns1blankspaceSearch" id="' +
													'searchContact-' + oRow.id + '">' +
													ns1blankspace.util.fd(oRow.receiveddate) +
													'</td>');

									aHTML.push('<td class="ns1blankspaceSearch" style="text-align:right;" id="' +
													'searchContact-' + oRow.id + '">' +
													oRow.amount +
													'</td>');

									if (oRow.contactbusinessreceivedfromtext != '')
									{
										sContact = oRow.contactbusinessreceivedfromtext;
									}
									else
									{
										sContact = oRow.contactpersonreceivedfromtext;
									}	
									
									aHTML.push('<td class="ns1blankspaceSearch ns1blankspaceSearchSub" id="' +
													'searchContact-' + oRow.id + '">' +
													sContact +
													'</td>');

									aHTML.push('<td class="ns1blankspaceSearch ns1blankspaceSearchSub" id="' +
													'searchContact-' + oRow.id + '">' +
													oRow.description +
													'</td>');

									aHTML.push('</tr>');
									
									return aHTML.join('')
								}					
				},		

	layout:		function ()
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
						
						aHTML.push('<tr><td id="ns1blankspaceControlInvoices" class="ns1blankspaceControl">' +
										'Invoices</td></tr>');
												
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
					aHTML.push('<div id="ns1blankspaceMainInvoice" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainItem" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainCredit" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTransaction" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.financial.receipt.summary();
					});

					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.financial.receipt.details();
					});
					
					$('#ns1blankspaceControlItem').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainItem', refresh: true});
						ns1blankspace.financial.item.show({namespace: 'receipt'});
					});

					$('#ns1blankspaceControlCredit').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainCredit', refresh: true});
						ns1blankspace.financial.util.credit.show({namespace: 'receipt'});
					});

					$('#ns1blankspaceControlInvoices').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainInvoice', refresh: true});
						ns1blankspace.financial.receipt.invoice.show();
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
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.financial.receipt.layout();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this receipt.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						ns1blankspace.objectContextData.receiveddate = ns1blankspace.util.fd(ns1blankspace.objectContextData.receiveddate);

						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
								
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.reference +
							'<br /><span id="ns1blankspaceControlContext_receiveddate" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.receiveddate + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_amount" class="ns1blankspaceSub">$' + ns1blankspace.objectContextData.amount + '</span>');
							
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.financial.receipt.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.receipt.summary()'});
					}	
				},		

	summary: 	function (oParam)
				{
					var aHTML = [];
					var bUseTemplate = false;
					
					if (oParam)
					{
						if (oParam.useTemplate != undefined) {bUseTemplate = oParam.useTemplate}
					}

					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the receipt.</td></tr></table>');
								
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceRow">' +
										'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
										'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:260px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
						
						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');
											
						if (ns1blankspace.objectContextData.contactbusinessreceivedfromtext != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Business</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryBusiness" data-id="' + ns1blankspace.objectContextData.contactbusinessreceivedfrom + '" data-object="contactBusiness" class="ns1blankspaceSummary ns1blankspaceViewLink">' +
											ns1blankspace.objectContextData.contactbusinessreceivedfromtext +
											'</td></tr>');
						}
						
						if (ns1blankspace.objectContextData.contactpersonreceivedfromtext != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Person</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryPerson" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.contactpersonreceivedfromtext +
											'</td></tr>');
						}
					
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Received Date</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryReceivedDate" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.receiveddate +
											'</td></tr>');
						
						if (ns1blankspace.objectContextData.description != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.description +
											'</td></tr>');
						}
						
						aHTML.push('</table>');		

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Date Received</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryReceivedDate" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.receiveddate + 
											'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">');
						
						if (ns1blankspace.objectContextData.reconciliation == '')
						{
								aHTML.push('This receipt is yet to be reconciled.');
						}
						else
						{
								aHTML.push('This receipt has been reconciled!');
						}

						aHTML.push('</td></tr>');

						if (ns1blankspace.objectContextData['receipt.sourcebanktransaction.posteddate'] != '')
						{
							aHTML.push('<tr><td id="ns1blankspaceSummaryBankTransaction" class="ns1blankspaceSummary ns1blankspaceSubNote">' +
											ns1blankspace.util.fd(ns1blankspace.objectContextData['receipt.sourcebanktransaction.posteddate'])+
											'<br />' +
											ns1blankspace.option.currencySymbol +
											Math.abs(ns1blankspace.objectContextData['receipt.sourcebanktransaction.amount'].replace(',', '')) +
											'<br />' +
											ns1blankspace.objectContextData['receipt.sourcebanktransaction.notes']+
											'</td></tr>');
						}
						
						if (ns1blankspace.financial.data.bankaccounts.length == 0)
						{
							aHTML.push('<tr><td class="ns1blankspaceSub" style="color:red;">' +
												'No bank accounts set up!' +
												'</td></tr>');
						}
	
						aHTML.push('</table>');		

						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));
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
										'<input id="ns1blankspaceDetailsContactBusinessReceivedFrom" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_BUSINESS_SEARCH"' +
											' data-columns="tradename">' +
										'</td></tr>');	
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Person' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsContactPersonReceivedFrom" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_PERSON_SEARCH"' +
											' data-columns="firstname-space-surname"' +
											' data-parent="ns1blankspaceDetailsContactBusinessReceivedFrom"' +
											' data-parent-search-id="contactbusiness"' +
											' data-parent-search-text="tradename">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Received Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsReceivedDate" class="ns1blankspaceDate">' +
										'</td></tr>');											
						
						if (ns1blankspace.objectContext == -1)
						{		
							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Amount' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsAmount" class="ns1blankspaceText">' +
										'</td></tr>');

							if (true || ns1blankspace.financial.data.settings.taxreportcalculationmethod == 1)
							{
								aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'Financial Account' +
											'</td></tr>' +
											'<tr class="ns1blankspace"><td class="ns1blankspaceSubNote">' +
												'Leave this financial account blank if you intend to apply it to an invoice or invoices.</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceSelect">' +
											'<input id="ns1blankspaceDetailsFinancialAccount" class="ns1blankspaceSelect"' +
												' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
												' data-columns="title">' +
											'</td></tr>');

								aHTML.push('<tr><td style="padding-bottom:5px;" id="ns1blankspaceItemAddSearchResults">' +
												'<span class="ns1blankspaceSub" style="font-size:0.75em;">Press <i>enter</i> to see all or just start typing.</td></tr>');
							}	

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
						}	

						aHTML.push('</table>');				
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});
						
						ns1blankspace.financial.util.tax.codes(
						{
							xhtmlElementID: 'ns1blankspaceDetailsTaxCode',
							id: 1,
							type: 1
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

						var iDefaultBankAccount;

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference.formatXHTML());
							$('#ns1blankspaceDetailsReceivedDate').val(ns1blankspace.objectContextData.receiveddate);
							$('#ns1blankspaceDetailsContactBusinessReceivedFrom').attr('data-id', ns1blankspace.objectContextData.contactbusinessreceivedfrom);
							$('#ns1blankspaceDetailsContactBusinessReceivedFrom').val(ns1blankspace.objectContextData.contactbusinessreceivedfromtext.formatXHTML());
							$('#ns1blankspaceDetailsContactPersonReceivedFrom').attr('data-id', ns1blankspace.objectContextData.contactpersonreceivedfrom);
							$('#ns1blankspaceDetailsContactPersonReceivedFrom').val(ns1blankspace.objectContextData.contactpersonreceivedfromtext.formatXHTML());	
							$('#ns1blankspaceDetailsAmount').val(ns1blankspace.objectContextData.amount);
							$('[name="radioTaxCode"][value="' + ns1blankspace.objectContextData.taxtype + '"]').attr('checked', true);
							$('#ns1blankspaceDetailsTax').val(ns1blankspace.objectContextData.tax);	
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.description.formatXHTML());
							iDefaultBankAccount = ns1blankspace.objectContextData.bankaccount;
						}
						else
						{
							$('#ns1blankspaceDetailsReceivedDate').val(Date.today().toString("dd MMM yyyy"));

							var oDefaultBankAccount = _.find(ns1blankspace.financial.data.bankaccounts, function (ba) {return ba.defaultreceiptaccount == 'Y'});

							if (_.isUndefined(oDefaultBankAccount))
							{
								iDefaultBankAccount = _.first(ns1blankspace.financial.data.bankaccounts).id;
							}
							else
							{
								iDefaultBankAccount = oDefaultBankAccount.id
							}

							$('#ns1blankspaceDetailsPaidDate').val(Date.today().toString("dd MMM yyyy"));
						}

						$('[name="radioBankAccount"][value="' + iDefaultBankAccount + '"]').attr('checked', true);
					}	
				},

	save: 	{
					send:		function (oParam, oResponse)
								{
									ns1blankspace.status.working();
									
									var sData = (ns1blankspace.objectContext == -1)?'':'id=' + ns1blankspace.objectContext;
										
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsReference').val());
										sData += '&receiveddate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsReceivedDate').val());
										sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDescription').val());
										sData += '&contactbusinessreceivedfrom=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsContactBusinessReceivedFrom').attr("data-id"));
										sData += '&contactpersonreceivedfrom=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsContactPersonReceivedFrom').attr("data-id"));
										sData += '&bankaccount=' + $('[name="radioBankAccount"]:checked').val();
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_RECEIPT_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data) {ns1blankspace.financial.receipt.save.process(oParam, data)}
									});
								},

					process:	function (oParam, oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');
										oParam = ns1blankspace.util.setParam(oParam, 'new', (ns1blankspace.objectContext == -1));
										ns1blankspace.objectContext = oResponse.id;	
										
										if ($('#ns1blankspaceMainDetails').html())
										{
											ns1blankspace.financial.receipt.save.amount(oParam);
										}
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								},

					amount:	function (oParam)
								{
									var iAccount = $('#ns1blankspaceDetailsFinancialAccount').attr('data-id');

									if (iAccount == undefined)
									{
										iAccount = ns1blankspace.financial.data.settings.financialaccountunallocated.incoming;

										if (iAccount == undefined)
										{
											iAccount = ns1blankspace.financial.data.settings.financialaccountdebtor
										}
									}

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
										if (iAccount == undefined) {ns1blankspace.status.error('No default unallocated or debitor account set up.')}
										ns1blankspace.inputDetected = false;
										ns1blankspace.financial.receipt.init({id: ns1blankspace.objectContext});
									}
									else
									{
										var sData = 'object=' + ns1blankspace.object;
										sData += '&objectcontext=' + ns1blankspace.objectContext;
										sData += '&financialaccount=' + iAccount;
										sData += '&amount=' + cAmount;
										sData += '&taxtype=' + 	$('input[name="radioTaxCode"]:checked').val();;
										sData += '&tax=' + cTax;
										sData += '&description=' + $('#ns1blankspaceDetailsDescription').val();

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
															ns1blankspace.financial.receipt.search.send('-' + ns1blankspace.objectContext, {source: 1});
														}
														else
														{	
															ns1blankspace.financial.receipt.refresh();
														}	
													}
												});
											}
										});
									}	
								}
				},				
								
	invoice: {
					data: 	{},

					show: 	function (oParam, oResponse)
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
														'<td id="ns1blankspaceInvoiceColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
														'<td id="ns1blankspaceInvoiceColumn2" class="ns1blankspaceColumn2" style="width:400px;"></td>' +
														'</tr>');
										aHTML.push('</table>');					
														
										$('#ns1blankspaceMainInvoice').html(aHTML.join(''));
										
										if (oActions != undefined)
										{	
											var aHTML = [];
															
											aHTML.push('<table class="ns1blankspaceColumn2">');

											aHTML.push('<tr><td style="padding-top:0px; padding-bottom:0px; font-size:0.75em;" class="ns1blankspaceSub">Unallocated amount</td>' +
																'<tr><td id="ns1blankspaceFinancialUnallocatedTotal" style="padding-top:0px; padding-bottom:14px; font-size:1.2em;" class="ns1blankspaceSub"></td></tr>');
											
											if (oActions.add)
											{
												aHTML.push('<tr><td class="ns1blankspaceAction" id="ns1blankspaceInvoiceApply">' +
															'<span id="ns1blankspaceInvoiceAdd">Add</span>' +
															'</td></tr>');
											}

											aHTML.push('</table>');					
											
											$('#ns1blankspaceInvoiceColumn2').html(aHTML.join(''));
										
											$('#ns1blankspaceInvoiceAdd').button(
											{
												label: "Allocate"
											})
											.click(function()
											{
												 ns1blankspace.financial.receipt.invoice.edit(oParam);
											})
										}

										ns1blankspace.financial.receipt.invoice.items(oParam);
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_RECEIPT_INVOICE_SEARCH';
										oSearch.addField('invoice,invoicetext,appliesdate,amount,tax,receiptlineitem');
										oSearch.addFilter('receipt', 'EQUAL_TO', iObjectContext);
										oSearch.sort('appliesdate', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.financial.receipt.invoice.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table class="ns1blankspace">' +
															'<tr><td class="ns1blankspaceNothing">No invoices.</td></tr>' + 
															'</table>');

											$('#ns1blankspaceInvoiceColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table class="ns1blankspace">');
											aHTML.push('<tr class="ns1blankspaceCaption">');
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
																this.invoicetext + '</td>');
																							
												aHTML.push('<td id="ns1blankspaceReceipt_date-' + this.id + '" class="ns1blankspaceRow">' +
																this.appliesdate + '</td>');

												aHTML.push('<td id="ns1blankspaceReceipt_amount-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																this.amount + '</td>');

												aHTML.push('<td id="ns1blankspaceReceipt_tax-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																this.tax + '</td>');
						
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceInvoice_options_remove-' + this.id + '-' + this.receiptlineitem + '" class="ns1blankspaceInvoiceRemove"></span>');
												};

												if (oOptions.view)
												{	
													aHTML.push('<span id="ns1blankspaceInvoice_options_view-' + this.invoice + '" class="ns1blankspaceInvoiceView"></span>');
												}

												aHTML.push('</td></tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceInvoiceColumn1').html(aHTML.join(''));
											
											if (oOptions.remove) 
											{
												$('.ns1blankspaceInvoiceRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspace.financial.receipt.invoice.remove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px')
											}
										
											if (oOptions.view) 
											{
												$('span.ns1blankspaceInvoiceView').button( {
													text: false,
													icons: {
														primary: "ui-icon-play"
													}
												})
												.click(function() {
													ns1blankspace.financial.invoice.init({id: (this.id).split('-')[1]})
												})
												.css('width', '15px')
												.css('height', '17px');
											}	
										}
									}	
								},

					edit: 	function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
										oSearch.addField('invoice.lineitem.invoiceoutstandingamount,reference,sentdate,amount,outstandingamount,tax,invoice.lineitem.id,invoice.lineitem.description,invoice.lineitem.amount,invoice.lineitem.tax');

										if (ns1blankspace.objectContextData.contactbusinessreceivedfrom != '')
										{
											oSearch.addFilter('contactbusinesssentto', 'EQUAL_TO', ns1blankspace.objectContextData.contactbusinessreceivedfrom);
										}
											
										if (ns1blankspace.objectContextData.contactpersonreceivedfrom != '')
										{
											oSearch.addFilter('contactpersonsentto', 'EQUAL_TO', ns1blankspace.objectContextData.contactpersonreceivedfrom);
										}
											
										oSearch.addFilter('invoice.lineitem.invoiceoutstandingamount', 'NOT_EQUAL_TO', 0);
										oSearch.addFilter('sent', 'EQUAL_TO', 'Y');
										oSearch.sort('sentdate', 'asc');
										oSearch.rows = 250;
										oSearch.getResults(function(data) {ns1blankspace.financial.receipt.invoice.edit(oParam, data)});
									}
									else
									{
										var aHTML = [];
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table class="ns1blankspaceColumn2">' +
															'<tr><td class="ns1blankspaceNothing ns1blankspaceSub"><b>There are no invoices to apply this receipt to.</b></br />You can only apply a receipt to invoices marked as sent.</td></tr>' + 
															'</table>');

											$('#ns1blankspaceInvoiceColumn2').html(aHTML.join(''));
										}
										else
										{
											ns1blankspace.financial.receipt.invoice.data.invoices = oResponse.data.rows;

											var oInvoices = _.groupBy(oResponse.data.rows, 'id')

											aHTML.push('<table>');
											
											$.each(oInvoices, function(i, aInvoices)
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
												aHTML.push('<td style="width:30%;" class="ns1blankspaceRow ns1blankspaceRowShaded">')

													aHTML.push('<table class="ns1blankspace">');

													aHTML.push('<tr><td id="ns1blankspaceInvoice_reference-' + aInvoices[0].id + '">' +
																aInvoices[0].reference + '</td></tr>');
																							
													aHTML.push('<tr><td id="ns1blankspaceInvoice_date-' + this.id + '" class="ns1blankspaceSubNote">' +
																aInvoices[0].sentdate + '</td></tr>');

													aHTML.push('<tr><td id="ns1blankspaceInvoice_amount-' + this.id + '" class="ns1blankspaceSubNote">' +
																aInvoices[0].amount + '</td></tr>');

													aHTML.push('</table>');

												aHTML.push('</td><td class="ns1blankspaceRow" style="padding-left:8px;">');

													aHTML.push('<table class="ns1blankspace">');
						
													$.each(aInvoices, function(j, oInvoice)
													{
														aHTML.push('<tr>');

														aHTML.push('<td id="ns1blankspaceInvoice_item_description-' + oInvoice['invoice.lineitem.id'] + '" class="ns1blankspace" style="text-align:left;">' +
																oInvoice['invoice.lineitem.description'] + '</td>');

														aHTML.push('<td id="ns1blankspaceInvoice_item_amount-' + oInvoice['invoice.lineitem.id'] + '" class="ns1blankspace" style="text-align:right;">' +
																oInvoice['invoice.lineitem.invoiceoutstandingamount'] + '</td>');

														aHTML.push('<td style="width:20px;text-align:right;" class="ns1blankspace">' +
																		'<span id="ns1blankspaceInvoice_options_apply-' + oInvoice['invoice.lineitem.id'] + '" class="ns1blankspaceInvoiceApply"></span>' +
																		'</td></tr>');
													});
														
													aHTML.push('</table>');

												aHTML.push('</td></tr>');	
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceInvoiceApply').html(aHTML.join(''));

											$('#ns1blankspaceInvoiceApply .ns1blankspaceInvoiceApply').button(
											{
												text: false,
												icons:
												{
													primary: "ui-icon-check"
												}
											})
											.click(function()
											{
												ns1blankspace.financial.receipt.invoice.apply.init({xhtmlElementID: this.id});
											})
											.css('width', '15px')
											.css('height', '17px');
										}	
									}
								},

					items: 	function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_ITEM_SEARCH';
										oSearch.addField('amount,invoiceoutstandingamount,preadjustmentamount');
										oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
										oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.addFilter('financialaccount', 'EQUAL_TO', ns1blankspace.financial.data.settings.financialaccountunallocated.incoming);
										oSearch.getResults(function(data) {ns1blankspace.financial.receipt.invoice.items(oParam, data)});
									}
									else
									{
										ns1blankspace.financial.receipt.invoice.data.items = oResponse.data.rows;

										$.each(ns1blankspace.financial.receipt.invoice.data.items, function (i, item)
										{
											item.outstandingamount = numeral(item['invoiceoutstandingamount']).value();
										});

										ns1blankspace.financial.receipt.invoice.data.receiptAmountToApply = 
														_.sum(_.map(ns1blankspace.financial.receipt.invoice.data.items, function (i) {return _.toNumber(numeral(i.invoiceoutstandingamount).value())}));

										var sTotal = ns1blankspace.option.currencySymbol + ns1blankspace.financial.receipt.invoice.data.receiptAmountToApply.formatMoney(2, '.', ',');
										$('#ns1blankspaceFinancialUnallocatedTotal').html(sTotal);
									}	
								},		

					apply: 	{
									init:		function (oParam)
												{		
													var iInvoiceLineItemID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;

													ns1blankspace.financial.receipt.invoice.data.receiptAmountToApply = 
															_.sum(_.map(ns1blankspace.financial.receipt.invoice.data.items, function (i) {return _.toNumber(numeral(i.outstandingamount).value())}));

													ns1blankspace.financial.receipt.invoice.data.receiptAmountApplied = 0;
												
													if (ns1blankspace.financial.receipt.invoice.data.invoices != undefined)
													{
														ns1blankspace.financial.receipt.invoice.data.invoiceItem = $.grep(ns1blankspace.financial.receipt.invoice.data.invoices,
																function (invoice) {return invoice['invoice.lineitem.id'] == iInvoiceLineItemID});

														if (ns1blankspace.financial.receipt.invoice.data.invoiceItem.length == 1)
														{
															ns1blankspace.financial.receipt.invoice.data.invoiceItem =
																ns1blankspace.financial.receipt.invoice.data.invoiceItem[0];

															ns1blankspace.financial.receipt.invoice.data.invoiceItemOutstandingAmount = 
															numeral(ns1blankspace.financial.receipt.invoice.data.invoiceItem['invoice.lineitem.invoiceoutstandingamount']).value();

															ns1blankspace.util.setParam(oParam, 'index', 0);

															ns1blankspace.status.working('Allocating...')

															ns1blankspace.financial.receipt.invoice.apply.process(oParam);
														}	
													}	
												},

									process:	function (oParam, oResponse)
												{												
													var iIndex = ns1blankspace.util.getParam(oParam, 'index').value;

													if (iIndex < ns1blankspace.financial.receipt.invoice.data.items.length &&
															ns1blankspace.financial.receipt.invoice.data.invoiceItemOutstandingAmount != 0)
													{
														ns1blankspace.financial.receipt.invoice.data.receiptItem = ns1blankspace.financial.receipt.invoice.data.items[iIndex];

														ns1blankspace.financial.receipt.invoice.data.receiptItemAmount =
															numeral(ns1blankspace.financial.receipt.invoice.data.receiptItem.invoiceoutstandingamount).value();

														ns1blankspace.financial.receipt.invoice.data.applyAmount = ns1blankspace.financial.receipt.invoice.data.receiptItemAmount;

														if (ns1blankspace.financial.receipt.invoice.data.applyAmount > ns1blankspace.financial.receipt.invoice.data.invoiceItemOutstandingAmount)
														{
															ns1blankspace.financial.receipt.invoice.data.applyAmount = ns1blankspace.financial.receipt.invoice.data.invoiceItemOutstandingAmount
														}

														ns1blankspace.financial.receipt.invoice.data.invoiceItemOutstandingAmount =
															ns1blankspace.financial.receipt.invoice.data.invoiceItemOutstandingAmount -
															ns1blankspace.financial.receipt.invoice.data.applyAmount;

														var oData =
														{
															id: ns1blankspace.financial.receipt.invoice.data.receiptItem.id
														}

														if ((ns1blankspace.financial.receipt.invoice.data.receiptItemAmount -
																			ns1blankspace.financial.receipt.invoice.data.applyAmount) == 0)
														{
															oData.remove = 1
														}
														else
														{
															oData.amount = ns1blankspace.financial.receipt.invoice.data.receiptItemAmount -
																			ns1blankspace.financial.receipt.invoice.data.applyAmount
														}

														if (ns1blankspace.option.financialOverride)
														{
															oData.override = 'Y'
														}

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
															data: oData,
															dataType: 'json',
															success: function(data)
															{
																var oData =
																{
																	financialaccount: ns1blankspace.financial.data.settings.financialaccountdebtor,
																	amount: ns1blankspace.financial.receipt.invoice.data.applyAmount,
																	object: ns1blankspace.object,
																	objectcontext: ns1blankspace.objectContext
																}

																if (ns1blankspace.option.financialOverride)
																{
																	oData.override = 'Y'
																}

																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
																	data: oData,
																	dataType: 'json',
																	success: function(data)
																	{
																		var iReceiptItemDebtorID = data.id;

																		var oData =
																		{
																			invoicelineitem: ns1blankspace.financial.receipt.invoice.data.invoiceItem['invoice.lineitem.id'],
																			receiptlineitem: iReceiptItemDebtorID,
																			amount: ns1blankspace.financial.receipt.invoice.data.applyAmount
																		}

																		if (ns1blankspace.option.financialOverride)
																		{
																			oData.override = 'Y'
																		}

																		$.ajax(
																		{
																			type: 'POST',
																			url: ns1blankspace.util.endpointURI('FINANCIAL_RECEIPT_INVOICE_MANAGE'),
																			data: oData,
																			dataType: 'json',
																			success: function(data)
																			{
																				ns1blankspace.util.setParam(oParam, 'index', iIndex + 1);
																				ns1blankspace.financial.receipt.invoice.apply.process(oParam);
																			}
																		});		
																	}
																});		
															}
														});				
													}
													else
													{
														ns1blankspace.status.message('Allocated');
														ns1blankspace.financial.receipt.invoice.show();
													}
												}
								},		
				
					remove: 	function (oParam)
								{
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
									var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
									var iReceiptItemID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 2}).value;

									var oData = 
									{
										remove: 1,
										id: iID
									}	
												
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_RECEIPT_INVOICE_MANAGE'),
										data: oData,
										dataType: 'json',
										success: function(data)
										{
											var oData = 
											{
												id: iReceiptItemID,
												financialaccount: ns1blankspace.financial.data.settings.financialaccountunallocated.incoming
											}

											if (ns1blankspace.option.financialOverride)
											{
												oData.override = 'Y'
											}
														
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
												data: oData,
												dataType: 'json',
												success: function(data)
												{
													ns1blankspace.financial.receipt.invoice.show()
												}
											});		
										}
									});
										
								}
				},

	unallocated:
				{
					show: function (oParam, oResponse)
					{
						if (oResponse == undefined)
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_ITEM_SEARCH';
							oSearch.addField('amount,lineitem.receipt.reference,lineitem.receipt.id,financialaccount,description,lineitem.receipt.contactbusinessreceivedfromtext,' +
													'lineitem.receipt.contactpersonreceivedfromtext');
							oSearch.addFilter('financialaccount', 'EQUAL_TO', ns1blankspace.financial.data.settings.financialaccountunallocated.incoming);
							oSearch.addFilter('lineitem.receipt.reference', 'TEXT_IS_NOT_EMPTY');
							oSearch.addFilter('amount', 'NOT_EQUAL_TO', 0);
							oSearch.getResults(function(data)
							{
								ns1blankspace.financial.receipt.unallocated.show(oParam, data)
							})
						}
						else
						{
							var aHTML = [];

							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<table><tr><td class="ns1blankspaceNothing">No unallocated receipts.</td></tr></table>');

								$('#ns1blankspaceMain').html(aHTML.join(''));
							}
							else
							{
								aHTML.push('<table id="ns1blankspaceFinancialReceiptsUnallocated">');
								aHTML.push('<tr class="ns1blankspaceCaption">');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Business</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Person</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
								aHTML.push('</tr>');

								$.each(oResponse.data.rows, function()
								{
									aHTML.push('<tr class="ns1blankspaceRow">');
													
									aHTML.push('<td id="ns1blankspaceFinancialReceiptsUnallocated_reference-' + this['lineitem.receipt.id'] + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
													this['lineitem.receipt.reference'] + '</td>');

									aHTML.push('<td id="ns1blankspaceFinancialReceiptsUnallocated_business-' + this['lineitem.receipt.id'] + '" class="ns1blankspaceRow">' +
													this['lineitem.receipt.contactbusinessreceivedfromtext'] + '</td>');

									aHTML.push('<td id="ns1blankspaceFinancialReceiptsUnallocated_person-' + this['lineitem.receipt.id'] + '" class="ns1blankspaceRow">' +
													this['lineitem.receipt.contactpersonreceivedfromtext'] + '</td>');

									aHTML.push('<td id="ns1blankspaceFinancialReceiptsUnallocated_description-' + this['id'] + '" class="ns1blankspaceRow">' +
													this['description'] + '</td>');
															
									aHTML.push('<td id="ns1blankspaceFinancialReceiptsUnallocated_amount-' + this['id'] + '" class="ns1blankspaceRow" style="text-align:right;">' +
													this['amount'] + '</td>');

									aHTML.push('</tr>');
								});
								
								aHTML.push('</table>');

								$('#ns1blankspaceMain').html(aHTML.join(''));
											
								$('#ns1blankspaceFinancialReceiptsUnallocated td.ns1blankspaceRowSelect').click(function()
								{
									ns1blankspace.financial.receipt.init({id: (this.id).split('-')[1]});
								})
							}
						}	
					}
				},

	unreconciled:
				{
					show: 		function (oParam, oResponse)
									{
										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
											oSearch.addField('amount,reference,receiveddate,notes,contactbusinessreceivedfromtext,contactpersonreceivedfromtext');
											oSearch.addFilter('reconciliation', 'IS_NULL');
											oSearch.rows = 25;
											oSearch.sort('receiveddate', 'desc');
											oSearch.getResults(function(data)
											{
												ns1blankspace.financial.receipt.unreconciled.show(oParam, data)
											})
										}
										else
										{
											var aHTML = [];

											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table><tr><td class="ns1blankspaceNothing">No unreconciled receipts.</td></tr></table>');

												$('#ns1blankspaceMain').html(aHTML.join(''));
											}
											else
											{
												aHTML.push('<table id="ns1blankspaceFinancialReceiptsUnreconciled">');
												aHTML.push('<tr class="ns1blankspaceCaption">');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Business</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Person</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
												aHTML.push('</tr>');

												$.each(oResponse.data.rows, function()
												{
													aHTML.push(ns1blankspace.financial.receipt.unreconciled.row(this, oParam));
												});
												
												aHTML.push('</table>');

												ns1blankspace.render.page.show(
												{
													type: 'JSON',
													xhtmlElementID: 'ns1blankspaceMain',
													xhtmlContext: 'FinancialReceiptsUnreconciled',
													xhtml: aHTML.join(''),
													showMore: (oResponse.morerows == "true"),
													more: oResponse.moreid,
													rows: 25,
													functionShowRow: ns1blankspace.financial.receipt.unreconciled.row,
													functionOpen: undefined,
													functionOnNewPage: ns1blankspace.financial.receipt.unreconciled.bind
												});									
											}
										}	
									},

					row: 			function (oRow, oParam)	
									{
										var aHTML = [];

										aHTML.push('<tr class="ns1blankspaceRow">');
																	
										aHTML.push('<td id="ns1blankspaceFinancialReceiptsUnreconciled_reference-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
														oRow.reference + '</td>');

										aHTML.push('<td id="ns1blankspaceFinancialReceiptsUnreconciled_business-' + oRow.id + '" class="ns1blankspaceRow">' +
														oRow.contactbusinessreceivedfromtext + '</td>');

										aHTML.push('<td id="ns1blankspaceFinancialReceiptsUnreconciled_person-' + oRow.id + '" class="ns1blankspaceRow">' +
														oRow.contactpersonreceivedfromtext + '</td>');

										aHTML.push('<td id="ns1blankspaceFinancialReceiptsUnreconciled_reference-' + oRow.id + '" class="ns1blankspaceRow">' +
														oRow.notes + '</td>');

										aHTML.push('<td id="ns1blankspaceFinancialReceiptsUnreconciled_reference-' + oRow.id + '" class="ns1blankspaceRow">' +
														ns1blankspace.util.fd(oRow.receiveddate) + '</td>');
																
										aHTML.push('<td id="ns1blankspaceFinancialReceiptsUnreconciled_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
														oRow.amount + '</td>');

										aHTML.push('</tr>');

										return aHTML.join('');
									},

					bind: 		function (oRow, oParam)	
									{
										$('#ns1blankspaceFinancialReceiptsUnreconciled td.ns1blankspaceRowSelect').click(function()
										{
											ns1blankspace.financial.receipt.init({id: (this.id).split('-')[1]});
										});
									}
				}																					
}				