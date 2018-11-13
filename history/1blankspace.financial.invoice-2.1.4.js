/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.financial.invoice = 
{
	data: 	{},

	init: 	function (oParam)
				{
					var bInitialised = false;

					if (oParam != undefined)
					{
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}	
					}
					else
					{
						oParam = {}
					}
				
					ns1blankspace.app.reset();

					ns1blankspace.object = 5;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'invoice';
					ns1blankspace.viewName = 'Invoices';
					
					if (!bInitialised)
					{
						ns1blankspace.financial.initData(oParam)
					}
					else
					{	
						oParam.bind = ns1blankspace.financial.invoice.bind;
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

	bind: 	function (oParam)
				{
					$('#ns1blankspaceControlActionOptionsRemove')
					.click(function() 
					{
						ns1blankspace.app.options.remove(oParam)
					});

					$('#ns1blankspaceControlActionOptionsCopy')
					.click(function() 
					{
						ns1blankspace.financial.invoice.copy(oParam)
					});
				},

	refresh:	function (oResponse)
				{
					if (oResponse == undefined)
					{
						$('#ns1blankspaceControlContext_amount').html(ns1blankspace.xhtml.loadingSmall);
							
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
						oSearch.addField('sentdate,amount,tax,creditamount,outstandingamount');
						oSearch.rf = 'json';
						oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
						oSearch.getResults(function(data) {ns1blankspace.financial.invoice.refresh(data)});
					}
					else
					{
						var oObjectContext = oResponse.data.rows[0];
							
						ns1blankspace.objectContextData.sentdate = ns1blankspace.util.fd(oObjectContext.sentdate);
						ns1blankspace.objectContextData.amount = oObjectContext.amount;
						ns1blankspace.objectContextData.outstandingamount = oObjectContext.outstandingamount;
						ns1blankspace.objectContextData.tax = oObjectContext.tax;
						ns1blankspace.objectContextData.preadjustmentamount =
							(_.toNumber(oObjectContext.amount.replace(',', '')) +
									_.toNumber(oObjectContext.creditamount.replace(',', ''))).formatMoney(2, ".", ",");
								
						$('#ns1blankspaceControlContext_sentdate').html(ns1blankspace.objectContextData.sentdate);
						$('#ns1blankspaceControlContext_amount').html('$' + ns1blankspace.objectContextData.preadjustmentamount);

						ns1blankspace.financial.invoice.receipt.refresh();
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

						if (ns1blankspace.option.bulkInvoicing)
						{
							aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td style="padding-top:15px;" id="ns1blankspaceControlInvoicing" class="ns1blankspaceControl">Bulk<br />' +
									'<span class="ns1blankspaceSub" style="font-size:0.75em;">Create &/or<br />send unsent<br />invoices</span></td>' +
									'</tr>');
						}	

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td style="padding-top:18px;" id="ns1blankspaceControlDebtors" class="ns1blankspaceControl">' +
										'Owed to you<br /><span class="ns1blankspaceSub" style="font-size:0.75em;">Debtors</span></td>' +
									'</tr>');

						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));

						$('#ns1blankspaceControlInvoicing').click(function(event)
						{
							ns1blankspace.financial.invoicing.show();
						});

						$('#ns1blankspaceControlDebtors').click(function(event)
						{
							ns1blankspace.financial.debtors.show({xhtmlElementID: 'ns1blankspaceMain'});
						});
													
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
						oSearch.addField('reference,description,contactbusinesssenttotext,contactpersonsenttotext,sentdate,amount');
						oSearch.rows = 20;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(function (data) {ns1blankspace.financial.invoice.home(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceNothing">Click New to add an invoice.</td></tr>');
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
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Amount-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:50px;text-align:right;padding-left:10px;padding-right:10px;">' +
														'$' + this.amount + '</td>');
																		
								aHTML.push('<td id="ns1blankspaceMostLikely_DueDate-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;text-align:right;padding-right:15px;">' +
														this.sentdate + '</td>');
																										
								var sContact = this.contactbusinesssenttotext;
								if (sContact == '') {sContact = this.contactpersonsenttotext}
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Contact-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
														sContact + '</td>');
									
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							 ns1blankspace.financial.invoice.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 	function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
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
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
										oSearch.addField('contactbusinesssenttotext,contactbusinesssentto,contactpersonsenttotext,contactpersonsentto,invoice.contactbusinesssentto.legalname,' +
														'projecttext,project,projecttext,area,areatext,object,objectcontext,' +
														'reference,purchaseorder,sentdate,duedate,description,amount,tax,sent,frequency,creditamount,receiptamount,outstandingamount,guid,' +
														'invoice.contactpersonsentto.email,' +
														'invoice.contactbusinesssentto.mailingaddress1,invoice.contactbusinesssentto.mailingaddress2,invoice.contactbusinesssentto.mailingpostcode,' +
														'invoice.contactbusinesssentto.mailingsuburb,invoice.contactbusinesssentto.mailingstate,invoice.contactbusinesssentto.mailingcountry,' +
														'invoice.contactbusinesssentto.streetaddress1,invoice.contactbusinesssentto.streetaddress2,invoice.contactbusinesssentto.streetpostcode,' +
														'invoice.contactbusinesssentto.streetsuburb,invoice.contactbusinesssentto.streetstate,invoice.contactbusinesssentto.streetcountry,' +
														'invoice.contactbusinesssentto.reference,invoice.contactpersonsentto.reference');

										oSearch.addField(ns1blankspace.option.auditFields);
										
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										
										oSearch.getResults(function(data) {ns1blankspace.financial.invoice.show(oParam, data)});
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
											oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
											oSearch.addField('contactbusinesssenttotext,contactbusinesssentto,contactpersonsenttotext,contactpersonsentto,' +
																'reference,purchaseorder,sentdate,description,amount');
											
											oSearch.addBracket('(');
											oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('invoice.contactbusinesssentto.tradename', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('invoice.contactpersonsentto.surname', 'TEXT_IS_LIKE', sSearchText);

											if (sSearchText != '')
											{
												if (!_.isNaN(_.toNumber(sSearchText)))
												{
													oSearch.addOperator('or');
													oSearch.addFilter('invoice.amount', 'APPROX_EQUAL_TO', sSearchText);
												}

												var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
	  											if (oSearchDate.isValid())
												{
													oSearch.addOperator('or');
													oSearch.addFilter('sentdate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
												}
											}	

											oSearch.addBracket(')');

											ns1blankspace.search.advanced.addFilters(oSearch);
											
											oSearch.sort('reference', 'desc');
											oSearch.rows = ns1blankspace.option.defaultRowsSmall;

											oSearch.getResults(function(data) {ns1blankspace.financial.invoice.search.process(oParam, data)});	
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var iMaximumColumns = 1;
									var aHTML = [];
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
											aHTML.push(ns1blankspace.financial.invoice.search.row(this, oParam));
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.searchContainer).html(
											ns1blankspace.render.init(
											{
												html: aHTML.join(''),
												more: (oResponse.morerows == "true"),
												width: 520,
												header: false
											}) 
										);		
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
											$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.financial.invoice.search.send(event.target.id, {source: 1});
										});
										
										ns1blankspace.render.bind(
										{
											columns: 'reference-contactbusinesssenttotext-sentdate-amount',
											more: oResponse.moreid,
											width: 520,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.financial.invoice.search.send,
											functionRow: ns1blankspace.financial.invoice.search.row
										});   				
									}			
								},

						row: 	function (oRow, oParam)
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
													ns1blankspace.util.fd(oRow.sentdate) +
													'</td>');

									aHTML.push('<td class="ns1blankspaceSearch" style="text-align:right;" id="' +
													'searchContact-' + oRow.id + '">' +
													oRow.amount +
													'</td>');

									if (oRow.contactbusinesssenttotext != '')
									{
										sContact = oRow.contactbusinesssenttotext;
									}
									else
									{
										sContact = oRow.contactpersonsenttotext;
									}	
									
									aHTML.push('<td class="ns1blankspaceSearch ns1blankspaceSearchSub" id="' +
													'searchContact-' + oRow.id + '">' +
													sContact +
													'</td>');

									aHTML.push('<td class=" ns1blankspaceSearch ns1blankspaceSearchSub" id="' +
													'searchContact-' + oRow.id + '">' +
													oRow.description +
													'</td>');

									aHTML.push('</tr>');
									
									return aHTML.join('')
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

						if (!ns1blankspace.option.quickInvoice)
						{
							aHTML.push('<tr><td style="padding-top:5px;">' +
											'<span class="ns1blankspaceSub" style="font-size:0.75em;">Enter these details and then click Save to enter the invoice items.</span></td></tr>');
						}	
					}
					else
					{	
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');
						
						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');
						
						aHTML.push('<tr><td id="ns1blankspaceControlItem" class="ns1blankspaceControl">' +
										'Items</td></tr>');
					
						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');
						
						aHTML.push('<tr><td id="ns1blankspaceControlReceipts" class="ns1blankspaceControl">' +
										'Receipts</td></tr>');
										
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
					aHTML.push('<div id="ns1blankspaceMainReceipt" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTransaction" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.financial.invoice.summary.show();
					});

					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.financial.invoice.details();
					});
					
					$('#ns1blankspaceControlItem').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainItem', refresh: true});
						ns1blankspace.financial.item.show({namespace: 'invoice'});
					});
					
					$('#ns1blankspaceControlCredit').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainCredit', refresh: true});
						ns1blankspace.financial.util.credit.show({namespace: 'invoice'});
					});
					
					$('#ns1blankspaceControlReceipts').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainReceipt', refresh: true});
						ns1blankspace.financial.invoice.receipt.init();
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
					var bShowItems = ns1blankspace.util.getParam(oParam, 'showItems', {"default": false}).value;

					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.financial.invoice.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the invoice.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.financial.invoice.receipt.refresh();

						ns1blankspace.objectContextData = oResponse.data.rows[0];
						ns1blankspace.objectContextData.preadjustmentamount =
							(_.toNumber(ns1blankspace.objectContextData.amount.replace(',', '')) +
								_.toNumber(ns1blankspace.objectContextData.creditamount.replace(',', ''))).formatMoney(2, ".", ",");
					
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
								
						$('#ns1blankspaceControlContext').html(
							'<span id="ns1blankspaceControlContext_reference">' + ns1blankspace.objectContextData.reference + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_sentdate" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.sentdate + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_amount" class="ns1blankspaceSub">$' + ns1blankspace.objectContextData.preadjustmentamount + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_outstanding" class="ns1blankspaceSub"></span>');
							
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.financial.invoice.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						if (bShowItems)
						{
							$('.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
							$('#ns1blankspaceControlItem').addClass('ns1blankspaceHighlight');
							$('#ns1blankspaceControlItem').click();
						}
						else
						{	
							ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.invoice.summary.show()'});
						}	
					}	
				},		
		
	summary: {
					show: 		function (oParam)
								{
									var aHTML = [];
									var bUseTemplate = false;
									
									if (oParam)
									{
										if (oParam.useTemplate != undefined) {bUseTemplate = oParam.useTemplate}
									}
									else
									{
										oParam = {}
									}

									if (ns1blankspace.objectContextData == undefined)
									{
										aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the invoice.</td></tr></table>');
												
										$('#ns1blankspaceMainSummary').html(aHTML.join(''));
									}
									else
									{
										delete ns1blankspace.financial.invoice.data.templateDocument;
										oParam = ns1blankspace.util.setParam(oParam, 'object', ns1blankspace.object);
										oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.invoice.summary["default"]);
										ns1blankspace.format.templates.init(oParam);
									}	
								},

					"default":	function (oParam)
								{
									var aHTML = [];
									var bUseTemplate = false;
									//var sXHTMLTemplate = ns1blankspace.util.getParam(oParam, 'xhtmlTemplate').value;
									var fPreProcess = ns1blankspace.util.getParam(oParam, 'preProcess').value;
									
									if (oParam)
									{
										if (oParam.useTemplate != undefined) {bUseTemplate = oParam.useTemplate}
									}

									if (ns1blankspace.objectContextData == undefined)
									{
										aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the invoice.</td></tr></table>');
												
										$('#ns1blankspaceMainSummary').html(aHTML.join(''));
									}
									else
									{
										if ($.type(fPreProcess) == 'function')
										{
											delete oParam.preProcess;
											oParam.onComplete = ns1blankspace.financial.invoice.summary["default"];
											fPreProcess(oParam);
										}
										else
										{
											aHTML.push('<table class="ns1blankspaceMain">' +
															'<tr class="ns1blankspaceRow">' +
															'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
															'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:80px;"></td>' +
															'</tr>' +
															'</table>');				
							
											$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
					
											var aHTML = [];

											var oTemplate = ns1blankspace.format.templates.get(oParam);
										
											if (oTemplate != undefined && (ns1blankspace.financial.summaryUseTemplate || bUseTemplate))
											{
												aHTML.push(ns1blankspace.format.render(
												{
													object: 5,
													xhtmlTemplate: oTemplate.xhtml,
													objectOtherData: oParam.objectOtherData
												}));

												$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
											}
											else
											{
												aHTML.push('<table class="ns1blankspace">' +
															'<tr class="ns1blankspaceRow">' +
															'<td id="ns1blankspaceSummaryColumn1A" class="ns1blankspaceColumn1Flexible"></td>' +
															'<td id="ns1blankspaceSummaryColumn1B" class="ns1blankspaceColumn1Flexible"></td>' +
															'</tr>' +
															'</table>');

												$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

												var aHTML = [];

												aHTML.push('<table class="ns1blankspace">');
												
												if (ns1blankspace.objectContextData.contactbusinesssenttotext != '')
												{

													aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Business</td></tr>' +
																	'<tr><td id="ns1blankspaceSummaryBusiness" data-id="' + ns1blankspace.objectContextData.contactbusinesssentto + '" data-object="contactBusiness" class="ns1blankspaceSummary ns1blankspaceViewLink">' +
																	ns1blankspace.objectContextData.contactbusinesssenttotext +
																	'</td></tr>');
												}
												
												if (ns1blankspace.objectContextData.contactpersonsenttotext != '')
												{
													aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Person</td></tr>' +
																	'<tr><td id="ns1blankspaceSummaryPerson" class="ns1blankspaceSummary">' +
																	ns1blankspace.objectContextData.contactpersonsenttotext +
																	'</td></tr>');
												}
												
												if (ns1blankspace.objectContextData.sent == 'Y')
												{
													aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Sent Date</td></tr>' +
																	'<tr><td id="ns1blankspaceSummarySentDate" class="ns1blankspaceSummary">' +
																	ns1blankspace.objectContextData.sentdate +
																	'</td></tr>');

													aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Due Date</td></tr>' +
																	'<tr><td id="ns1blankspaceSummaryDueDate" class="ns1blankspaceSummary">' +
																	ns1blankspace.objectContextData.duedate +
																	'</td></tr>');	
												}
													
												aHTML.push('</table>');			
											
												$('#ns1blankspaceSummaryColumn1A').html(aHTML.join(''));
/*
												$('.ns1blankspaceViewLink').click(function()
												{
													if ($(this).attr('data-id') != '' && $(this).attr('data-object') != '')
													{
														ns1blankspace[$(this).attr('data-object')].init({id: $(this).attr('data-id')});
													}	
												});
*/
												var aHTML = [];

												if (ns1blankspace.objectContextData.description != '')
												{
													aHTML.push('<table class="ns1blankspaceColumn2">');
													aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
																	'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
																	ns1blankspace.util.toBR(ns1blankspace.objectContextData.description) +
																	'</td></tr>');
													aHTML.push('</table>');
												}
												
												$('#ns1blankspaceSummaryColumn1B').html(aHTML.join(''));				
											
											}

											var aHTML = [];

											aHTML.push('<table class="ns1blankspaceColumn2">');
																		
											oParam = ns1blankspace.util.setParam(oParam, 'object', ns1blankspace.object);	
											var oTemplate = ns1blankspace.format.templates.get(oParam);

											if (oTemplate != undefined)
											{
												if (ns1blankspace.financial.summaryUseTemplate || bUseTemplate)
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

												if (ns1blankspace.objectContextData.sent == 'N')
												{	
													aHTML.push('<tr><td style="padding-top:15px;" class="ns1blankspaceSummaryCaption">Not sent</td></tr>');			
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
															baseURLBody: sURL
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
														ns1blankspace.financial.invoice.summary.templates();
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
													ns1blankspace.financial.invoice.email.init();
												});
											}
										}	
									}	
								},

					templates: 	function (oParam)
								{
									if (ns1blankspace.format.templates.data[ns1blankspace.object] == undefined)
									{
										oParam = ns1blankspace.util.setParam(oParam, 'object', ns1blankspace.object);
										oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.invoice.summary.templates);
										ns1blankspace.format.templates.init(oParam);
									}
									else
									{
										oParam = ns1blankspace.util.setParam(oParam, 'useTemplate', true);

										if (ns1blankspace.format.templates.data[ns1blankspace.object].length == 1)
										{
											oParam = ns1blankspace.util.setParam(oParam, 'object', ns1blankspace.object);
											ns1blankspace.financial.invoice.summary["default"](oParam)
										}
										else
										{
											if ($(ns1blankspace.xhtml.container).attr('data-initiator') == 'ns1blankspaceSummaryView')
											{
												$(ns1blankspace.xhtml.container).slideUp(500);
												$(ns1blankspace.xhtml.container).attr('data-initiator', '');
											}
											else
											{
												ns1blankspace.container.position(
												{
													xhtmlElementID: 'ns1blankspaceSummaryView',
													topOffset: -34,
													leftOffset: -195
												});

												$vq.clear({queue: 'templates'});

												$vq.add('<div class="ns1blankspaceViewControlContainer" id="ns1blankspaceViewTemplateContainer" style="font-size:0.875em;">', {queue: 'templates'});

												$.each(ns1blankspace.format.templates.data[ns1blankspace.object], function (t, template)
												{
													$vq.add('<div class="ns1blankspaceRow ns1blankspaceRowSelect" style="border-width: 0px;"' +
																' id="ns1blankspaceViewTemplate-' + template.id + '">' + template.title + '</div>', {queue: 'templates'});
												});	

												$vq.add('</div>', {queue: 'templates'});

												$vq.render(ns1blankspace.xhtml.container, {queue: 'templates', show: true});

												$('#ns1blankspaceViewTemplateContainer .ns1blankspaceRowSelect').click(function ()
												{
													oParam = ns1blankspace.util.setParam(oParam, 'document', this.id.split('-')[1]);
													ns1blankspace.financial.invoice.data.templateDocument = this.id.split('-')[1];
													oParam = ns1blankspace.util.setParam(oParam, 'object', ns1blankspace.object);
													ns1blankspace.financial.invoice.summary["default"](oParam);
													ns1blankspace.container.hide(
													{
														xhtmlElementID: 'ns1blankspaceSummaryView',
														fadeOutTime: 0
													});
												})
											}
										}	
									}
								}			
				},

	email: 	{
					init: 	function (oParam)
								{
									var iDocument = ns1blankspace.util.getParam(oParam, 'document', {"default": ns1blankspace.financial.invoice.data.templateDocument}).value;
									
									oParam = ns1blankspace.util.setParam(oParam, 'object', ns1blankspace.object);

									if (iDocument != undefined)
									{
										oParam = ns1blankspace.util.setParam(oParam, 'document', iDocument);
										oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.invoice.email.render);
									}
									else
									{
										oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.invoice.email.templates);
									}	

									ns1blankspace.format.templates.init(oParam);
								},

					templates: 	function (oParam)
								{
									if (ns1blankspace.format.templates.data[ns1blankspace.object] == undefined)
									{
										oParam = ns1blankspace.util.setParam(oParam, 'object', ns1blankspace.object);
										oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.invoice.email.templates);
										ns1blankspace.format.templates.init(oParam);
									}
									else
									{
										if (ns1blankspace.format.templates.data[ns1blankspace.object].length == 1)
										{
											ns1blankspace.financial.invoice.email.render(oParam)
										}
										else
										{
											if ($(ns1blankspace.xhtml.container).attr('data-initiator') == 'ns1blankspaceSummaryEmail')
											{
												ns1blankspace.container.hide(
												{
													xhtmlElementID: 'ns1blankspaceSummaryEmail'
												});
											}
											else
											{
												ns1blankspace.container.position(
												{
													xhtmlElementID: 'ns1blankspaceSummaryEmail',
													topOffset: -34,
													leftOffset: -195
												});

												$vq.clear({queue: 'templates'});

												$vq.add('<div class="ns1blankspaceViewControlContainer" id="ns1blankspaceEmailTemplateContainer" style="font-size:0.875em;">', {queue: 'templates'});

												$.each(ns1blankspace.format.templates.data[ns1blankspace.object], function (t, template)
												{
													$vq.add('<div class="ns1blankspaceRow ns1blankspaceRowSelect" style="border-width: 0px;"' +
																' id="ns1blankspaceEmailTemplate-' + template.id + '">' + template.title + '</div>', {queue: 'templates'});
												});	

												$vq.add('</div>', {queue: 'templates'});

												$vq.render(ns1blankspace.xhtml.container, {queue: 'templates', show: true});

												$('#ns1blankspaceEmailTemplateContainer .ns1blankspaceRowSelect').click(function ()
												{
													oParam = ns1blankspace.util.setParam(oParam, 'document', this.id.split('-')[1]);
													oParam = ns1blankspace.util.setParam(oParam, 'object', ns1blankspace.object);
													ns1blankspace.financial.invoice.email.render(oParam);
													ns1blankspace.container.hide(
													{
														xhtmlElementID: 'ns1blankspaceSummaryEmail',
														fadeOutTime: 0
													});
												})
											}
										}	
									}
								},			

					render: 	function (oParam, oResponse)
								{
									ns1blankspace.status.working('Creating...');

									var iMode = ns1blankspace.util.getParam(oParam, 'mode', {"default": 1}).value;
									var fPreProcess = ns1blankspace.util.getParam(oParam, 'preProcess').value;

									//1=Show, 2=Just Send

									var iFormat = ns1blankspace.util.getParam(oParam, 'format', {"default": 1}).value;

									//1=HTML, 2=PDF

									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_ITEM_SEARCH';
										oSearch.addField('lineitem.financialaccounttext,lineitem.tax,lineitem.issuedamount,lineitem.amount,lineitem.description,lineitem.object');
										oSearch.addFilter('object', 'EQUAL_TO', 5);
										oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.sort('id', 'asc');
										oSearch.rows = 500;
										oSearch.getResults(function(data)
										{
											if ($.type(fPreProcess) == 'function')
											{
												delete oParam.preProcess;
												oParam.onComplete = ns1blankspace.financial.invoice.email.render;
												fPreProcess(oParam, data);
											}
											else
											{
												ns1blankspace.financial.invoice.email.render(oParam, data);
											}	
										});
									}	
									else
									{
										var oTemplate = ns1blankspace.format.templates.get(oParam);

										ns1blankspace.objectContextData.xhtml = ns1blankspace.format.render(
										{
											object: 5,
											xhtmlTemplate: oTemplate.xhtml,
											objectData: ns1blankspace.objectContextData,
											objectOtherData: oResponse.data.rows
										});

										ns1blankspace.status.clear();

										if (iMode == 1)
										{
											ns1blankspace.financial.invoice.email.show(oParam);
										}
										else
										{
											ns1blankspace.financial.invoice.email.send(oParam);
										}
									}		
								},

					attachments: function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'CORE_ATTACHMENT_SEARCH';
										oSearch.addField('filename,title,description,download,createddate');
										oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
										oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.rows = 999;
										oSearch.sort('filename', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.financial.invoice.email.attachments(oParam, data)});
									}
									else
									{
										var aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<div class="ns1blankspaceSubNote" style="padding-top:12px;">If you attach files to this invoice, you will be able to select them to send with the email.</div>');
										}
										else
										{
											$.each(oResponse.data.rows, function (r, row)
											{
												aHTML.push('<div class="ns1blankspaceSubNote"><input type="checkbox" name="ns1blankspaceEmailAttachFile" data-id="' + row.id + '" id="ns1blankspaceEmailAttachFile-' + row.id + '">' +
													row.filename + 
													(row.filename.indexOf('INV')!=-1?' (' + ns1blankspace.util.formatDate(row.createddate, {format: 'DD MMM YYYY hh:mm a', fromNow: true}) + ')':'') +
													'</div>')
											});
										}

										$('#ns1blankspaceEmailAttachFiles').html(aHTML.join(''));
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
														'<input id="ns1blankspaceEmailTo" class="ns1blankspaceText" data-1blankspace="ignore">' +
														'</td><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceEmailFrom" class="ns1blankspaceSelect" data-1blankspace="ignore"' +
																	' data-method="SETUP_MESSAGING_ACCOUNT_SEARCH"' +
																	' data-methodFilter="type-EQUAL_TO-5"' +
																	' data-customOption="hasaccess-Y"' +
																	' data-columns="email">' +
													'</td></tr>');

										aHTML.push('</table>');											

									aHTML.push('</td></tr>')

									aHTML.push('<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceText">' +
													'<input id="ns1blankspaceEmailSubject" class="ns1blankspaceText" style="width:100%;" data-1blankspace="ignore">' +
													'</td></tr>');

									//80%
									//' <div style="font-size:0.875em; color:#999999; float:right; margin-top:6px;"><input type="checkbox" id="ns1blankspaceEmailAttachPDF">Attach a PDF</div>' +

									ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;		

									aHTML.push('<tr class="ns1blankspaceTextMulti">' +
													'<td class="ns1blankspaceTextMulti">' +
													'<textarea rows="20" cols="50" id="ns1blankspaceMessageText' +
														ns1blankspace.counter.editor + '" editorcount="' + ns1blankspace.counter.editor + '" class="ns1blankspaceTextMulti"></textarea>' +
													'</td></tr>');

									aHTML.push('</table>');

									aHTML.push('<table style="margin-bottom:16px;">' +
													'<tr>' +
													'<td class="ns1blankspaceCaption">Attach</td></tr>' +
													'<tr><td>' +
													'<div class="ns1blankspaceSubNote"><input type="checkbox" checked="checked" id="ns1blankspaceEmailAttachPDF">a PDF version of this invoice</div>' +
													'<div id="ns1blankspaceEmailAttachFiles"></div>' +
													'</td></tr></table>');		
						
									$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

									var sMessage = ns1blankspace.objectContextData.xhtml;
									
									$('#ns1blankspaceMessageText' + ns1blankspace.counter.editor).val(sMessage);

									ns1blankspace.format.editor.init({selector: '#ns1blankspaceMessageText' + ns1blankspace.counter.editor});

									ns1blankspace.financial.invoice.email.attachments();

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
										var aAttachmentLinks = [];

										$('input[name="ns1blankspaceEmailAttachFile"]:checked').each(function (a, attachment)
										{
											aAttachmentLinks.push($(attachment).attr('data-id'));
										});

										if (aAttachmentLinks.length > 0)
										{
											oParam = ns1blankspace.util.setParam(oParam, 'attachmentLink', aAttachmentLinks.join(','))
										}

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
										ns1blankspace.financial.invoice.summary.show();
									})
									.css('width', '65px');

									//$('#ns1blankspaceEmailFrom').val(ns1blankspace.user.email);
									$('#ns1blankspaceEmailTo').val(ns1blankspace.objectContextData['invoice.contactpersonsentto.email']);
									$('#ns1blankspaceEmailSubject').val(ns1blankspace.user.contactBusinessText + ' Invoice ' + ns1blankspace.objectContextData['reference']);
									$('#ns1blankspaceEmailFrom').val(ns1blankspace.user.email);

									if (ns1blankspace.objectContextData['invoice.contactpersonsentto.email'] == '')
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
												applysystemtemplate: 'Y',
												fromemail: $('#ns1blankspaceEmailFrom').val()
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
										'<input id="ns1blankspaceDetailsContactBusinessSentTo" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_BUSINESS_SEARCH"' +
											' data-columns="tradename">' +
										'</td></tr>');	
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Person' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsContactPersonSentTo" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_PERSON_SEARCH"' +
											' data-columns="firstname-space-surname"' +
											' data-parent="ns1blankspaceDetailsContactBusinessSentTo"' +
											' data-parent-search-id="contactbusiness"' +
											' data-parent-search-text="tradename">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Purchase Order Number' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPurchaseOrderReference" class="ns1blankspaceText">' +
										'</td></tr>');	
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsSentDate" class="ns1blankspaceDate">' +
										'</td></tr>');		
											
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Due Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsDueDate" class="ns1blankspaceDate">' +
										'</td></tr>');

						if (ns1blankspace.objectContext == -1 && ns1blankspace.option.quickInvoice)
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
											'<span class="ns1blankspaceSub" style="font-size:0.75em;">Press <i>enter</i> to see all or just start typing.</span></td></tr>');
					
							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Amount' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceItemAmount" class="ns1blankspaceText">' +
											'</td></tr>');

							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										ns1blankspace.option.taxVATCaption + ' Type' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td id="ns1blankspaceFinancialTaxCode" class="ns1blankspaceRadio">' +
										ns1blankspace.xhtml.loadingSmall +
										'</td></tr>');	

							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										ns1blankspace.option.taxVATCaption + ' Amount' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceItemTax" class="ns1blankspaceText">' +
										'</td></tr>');
						}

						aHTML.push('</table>');
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));

						ns1blankspace.financial.util.tax.codes(
						{
							xhtmlElementID: 'ns1blankspaceFinancialTaxCode',
							id: 1,
							type: 1
						});

						$('#ns1blankspaceItemAmount').keyup(function()
						{
							ns1blankspace.financial.util.tax.calculate(
							{
								amountXHTMLElementID: 'ns1blankspaceItemAmount',
								taxXHTMLElementID: 'ns1blankspaceItemTax'
							});
						});

						$('[name="radioTaxCode"]').click(function()
						{
							ns1blankspace.financial.util.tax.calculate(
							{
								amountXHTMLElementID: 'ns1blankspaceItemAmount',
								taxXHTMLElementID: 'ns1blankspaceItemTax'
							});
						});

						$('#ns1blankspaceItemAccount').keyup(function()
						{
							oParam = ns1blankspace.util.setParam(oParam, 'step', 2);
							if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
					        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.item.edit(' + JSON.stringify(oParam) + ')', ns1blankspace.option.typingWait);
						});
		
						$('#ns1blankspaceItemAccount').focus();
						
						$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');

						var bSent = false;

						if (ns1blankspace.objectContextData)
							{bSent = (ns1blankspace.objectContextData.sent == 'Y')}

						if (bSent)
						{	
							aHTML.push('<tr><td>' +
										'<span id="ns1blankspaceDetailUndoSend" class="ns1blankspaceAction">Mark as unsent</span>' +
										'</td></tr>');
						}
						else
						{	
							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Sent' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioSentN" name="radioSent" value="N"/>No' +
										'&nbsp;&nbsp;<input type="radio" id="radioSentY" name="radioSent" value="Y"/>Yes' +
										'</td></tr>');
						}	
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea id="ns1blankspaceDetailsDescription" class="ns1blankspaceTextMulti" rows="5" cols="35" style="height:150px;"></textarea>' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Create Copy' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioFrequency9" name="radioFrequency" value="9"/>Never' +
										'<br /><input type="radio" id="radioFrequency4" name="radioFrequency" value="4"/>Next Month' +
										'<br /><input type="radio" id="radioFrequency5" name="radioFrequency" value="5"/>In 3 Months' +
										'<br /><input type="radio" id="radioFrequency7" name="radioFrequency" value="7"/>In 1 Year' +
										'</td></tr>');					
										
						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						$('#ns1blankspaceDetailUndoSend').button().click(function()
						{
							var sID = this.id;
							var aID = sID.split('-');
							var iStatus = aID[1];
							
							$.ajax(
							{
								type: 'GET',
								url: ns1blankspace.util.endpointURI('FINANCIAL_INVOICE_MANAGE'),
								data: {override_LockedSent:'Y', sent:'N', id:ns1blankspace.objectContext},
								dataType: 'json',
								success: function(oResponse) {ns1blankspace.financial.invoice.search.send('-' + ns1blankspace.objectContext)}
							});
						});

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference.formatXHTML());
							$('#ns1blankspaceDetailsPurchaseOrderReference').val(ns1blankspace.objectContextData.purchaseorder);
							$('#ns1blankspaceDetailsContactBusinessSentTo').attr('data-id', ns1blankspace.objectContextData.contactbusinesssentto);
							$('#ns1blankspaceDetailsContactBusinessSentTo').val(ns1blankspace.objectContextData.contactbusinesssenttotext.formatXHTML());
							$('#ns1blankspaceDetailsContactPersonSentTo').attr('data-id', ns1blankspace.objectContextData.contactpersonsentto);
							$('#ns1blankspaceDetailsContactPersonSentTo').val(ns1blankspace.objectContextData.contactpersonsenttotext.formatXHTML());	
							$('[name="radioSent"][value="' + ns1blankspace.objectContextData.sent + '"]').prop('checked', true);
							$('#ns1blankspaceDetailsSentDate').val(ns1blankspace.objectContextData.sentdate);
							$('#ns1blankspaceDetailsDueDate').val(ns1blankspace.objectContextData.duedate);
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.description.formatXHTML());
							$('[name="radioFrequency"][value="' + ns1blankspace.objectContextData.frequency + '"]').prop('checked', true);
						}
						else
						{
							$('[name="radioSent"][value="' + ns1blankspace.financial.data.settings.defaultinvoicesentvalue + '"]').prop('checked', true);
							$('[name="radioFrequency"][value="9"]').prop('checked', true);
							$('#ns1blankspaceDetailsSentDate').val(Date.today().toString("dd MMM yyyy"));
						}
					}	
				},

	copy: 		function (aParam, oResponse)
				{		
					ns1blankspace.container.hide({force: true});

					if (oResponse == undefined)
					{
						ns1blankspace.status.working('Copying...');

						var oData = 
						{
							id: ns1blankspace.objectContext,
							sentdate: Date.today().toString("dd MMM yyyy"),
							sent: 'N'
						}

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_INVOICE_COPY'),
							data: oData,
							dataType: 'json',
							success: function(data){ns1blankspace.financial.invoice.copy(aParam, data)}
						});

					}
					else
					{
						if (oResponse.status == 'OK')
						{
							ns1blankspace.status.message("Copied");
							ns1blankspace.financial.invoice.search.send('-' + oResponse.id);
						}
						else
						{
							ns1blankspace.status.error('Cannot copy invoice')
						}
					}	
					
				},

	save:		{		
					send:		function (oParam, oResponse)
								{
									if (oParam == undefined) {oParam = {}}
									var oData = ns1blankspace.util.getParam(oParam, 'data', {'default': {}}).value;

									if (oResponse == undefined)
									{
										ns1blankspace.status.working();
										
										oData = (ns1blankspace.objectContext == -1) ? {} :{id: ns1blankspace.objectContext};
											
										if ($('#ns1blankspaceMainDetails').html() != '')
										{
											oData.reference = $('#ns1blankspaceDetailsReference').val();
											oData.purchaseorder = $('#ns1blankspaceDetailsPurchaseOrderReference').val();
											oData.sentdate = $('#ns1blankspaceDetailsSentDate').val();
											oData.duedate = $('#ns1blankspaceDetailsDueDate').val();
											oData.description = $('#ns1blankspaceDetailsDescription').val();
											oData.contactbusinesssentto = $('#ns1blankspaceDetailsContactBusinessSentTo').attr("data-id");
											oData.contactpersonsentto = $('#ns1blankspaceDetailsContactPersonSentTo').attr("data-id");
											oData.contactbusinesssenttotext = $('#ns1blankspaceDetailsContactBusinessSentTo').val();
											oData.contactpersonsenttotext = $('#ns1blankspaceDetailsContactPersonSentTo').val();
											oData.sent = $('input[name="radioSent"]:checked').val();
											oData.frequency = $('input[name="radioFrequency"]:checked').val();
										}

										oData.override_LockedDate = 'Y';
										
										oParam.data = oData;

										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_INVOICE_MANAGE'),
											data: oData,
											dataType: 'json',
											success: function(data) {ns1blankspace.financial.invoice.save.send(oParam, data)}
										});
										
									}
									else
									{			
										if (oResponse.status == 'OK')
										{	
											ns1blankspace.status.message('Saved');
											ns1blankspace.inputDetected = false;
											
											if (ns1blankspace.objectContext == -1)
											{
												ns1blankspace.objectContext = oResponse.id;
												ns1blankspace.financial.invoice.init({id: ns1blankspace.objectContext, showItems: true});
											}
											else
											{
												$.each(Object.keys(oData), function(index, key)
												{
													if (key != 'id')
													{ns1blankspace.objectContextData[key] = oData[key];}
												});
											}
										}
										else
										{
											ns1blankspace.status.error('Could not save the invoice!');
										}
									}	
								}
				},

	receipt: {
					refresh:	function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										$('#ns1blankspaceControlContext_outstanding').html(ns1blankspace.xhtml.loadingSmall);
											
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_RECEIPT_INVOICE_SEARCH';
										oSearch.addField('amount');
										oSearch.addSummaryField('sum(amount) sumamount');
										oSearch.addFilter('invoice', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.rows = 1;
										oSearch.getResults(function(data){ns1blankspace.financial.invoice.receipt.refresh(oParam, data)});
									}
									else
									{
										ns1blankspace.objectContextData.outstanding = oResponse.summary.sumamount;
										$('#ns1blankspaceControlContext_outstanding').html('<span style="background-color:#CCCCCC; color: white;">' +
												'$' + ((ns1blankspace.objectContextData.amount).parseCurrency() -
												(oResponse.summary.sumamount).parseCurrency()).formatMoney(2, ".", ",") + '</span>');
									}
								},

					init: 	function (oParam)
								{
									if (ns1blankspace.objectContextData.sent == 'N')
									{
										$('#ns1blankspaceMainReceipt').html('<table class="ns1blankspaceContainer">' +
														'<tr><td class="ns1blankspaceNothing">You need to mark this invoice as sent before receipting it.</td></tr>' +
														'</table>');
									}	
									else
									{
										ns1blankspace.financial.invoice.receipt.show(oParam);
									}
								},	

					show: 	function (oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext', {"default": ns1blankspace.objectContext}).value;
									var oOptions = ns1blankspace.util.getParam(oParam, 'options', {"default": {view: true, remove: true}}).value;
									var oActions = ns1blankspace.util.getParam(oParam, 'actions', {"default": {add: true}}).value;
									
									if (oParam == undefined) {oParam = {}}
									if (oOptions.view == undefined) {oOptions.view = true}
									if (oOptions.remove == undefined) {oOptions.remove = true}
									if (oActions.add == undefined) {oActions.add = true}
										
									if (oResponse == undefined)
									{	
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">');

										aHTML.push('<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceReceiptColumn1" class="ns1blankspaceColumn1Flexible">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspaceReceiptColumn2" class="ns1blankspaceColumn2" style="width: 350px;"></td>' +
														'</tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainReceipt').html(aHTML.join(''));	
									
										if (oActions.add)
										{

											var aHTML = [];
											
											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											aHTML.push('<tr><td>' +
															'<span id="ns1blankspaceReceiptAdd" class="ns1blankspaceAction">Add</span>' +
															'</td></tr>');
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceReceiptColumn2').html(aHTML.join(''));
									
											$('#ns1blankspaceReceiptAdd').button(
											{
												label: "Add"
											})
											.click(function()
											{
												 ns1blankspace.financial.invoice.receipt.edit(oParam);
											});

											ns1blankspace.financial.invoice.receipt.edit(oParam);
										}		

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_RECEIPT_INVOICE_SEARCH';
										oSearch.addField('appliesdate,amount,receiptinvoice.receipt.reference,receiptinvoice.receipt.amount,receiptinvoice.receipt.id');
										oSearch.addFilter('invoice', 'EQUAL_TO', iObjectContext);
										oSearch.sort('appliesdate', 'asc');
										oSearch.rows = 1000;
										oSearch.getResults(function(data) {ns1blankspace.financial.invoice.receipt.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table class="ns1blankspace">' +
															'<tr><td class="ns1blankspaceNothing">No receipts.</td></tr>' + 
															'</table>');

											$('#ns1blankspaceReceiptColumn1').html(aHTML.join(''));
										}
										else
										{
											//var oReceipts = ns1blankspace.util.unique({key: 'receiptinvoice.receipt.reference', data: oResponse.data.rows});
											var oReceipts = oResponse.data.rows;
									
											aHTML.push('<table class="ns1blankspace" id="ns1blankspaceFinancialInvoiceReceipts">');
											aHTML.push('<tr>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');

											$.each(oReceipts, function(r, receipt)
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																			
												aHTML.push('<td id="ns1blankspaceReceipt_date-' + receipt.id + '" class="ns1blankspaceRow">' +
																receipt['appliesdate'] + '</td>');

												
												aHTML.push('<td id="ns1blankspaceReceipt_amount-' + receipt.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																receipt['amount'] + '</td>');
						
												aHTML.push('<td style="width:60px; text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceReceipt_options_remove-' + this.id + '" class="ns1blankspaceReceiptRemove"></span>');
												}

												if (oOptions.view)
												{
													aHTML.push('<span id="view-' + receipt['receiptinvoice.receipt.id'] + '" class="ns1blankspaceView"></span>');
												};	
													
												aHTML.push('</td></tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceReceiptColumn1').html(aHTML.join(''));
											
											$('#ns1blankspaceFinancialInvoiceReceipts .ns1blankspaceReceiptRemove').button( {
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
													method: 'FINANCIAL_RECEIPT_INVOICE_MANAGE',
													ifNoneMessage: 'No receipts.',
													onComplete: ns1blankspace.financial.receipt.refresh
												});
											})
											.css('width', '15px')
											.css('height', '17px');

											$('#ns1blankspaceFinancialInvoiceReceipts .ns1blankspaceView').button(
											{
												text: false,
												icons:
												{
													primary: "ui-icon-play"
												}
											})
											.click(function()
											{
												ns1blankspace.financial.receipt.init({id: (this.id).split('-')[1]})
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
										url: ns1blankspace.util.endpointURI('FINANCIAL_RECEIPT_INVOICE_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data)
										{
											ns1blankspace.financial.invoice.receipt.show();
											ns1blankspace.financial.invoice.refresh();
										}
									});
								},	

					edit:		function (oParam, oResponse)
								{
									var iStep = 1;
									var cReceiptAmount = 0;
									var cReceiptedAmount = 0;
									
									if (oParam != undefined)
									{
										if (oParam.step != undefined) {iStep = oParam.step}
										if (oParam.receiptAmount != undefined) {cReceiptAmount = oParam.receiptAmount}
										if (oParam.receiptedAmount != undefined) {cReceiptedAmount = oParam.receiptedAmount}	
									}
									
									if (ns1blankspace.financial.data.bankaccounts.length == 0) {alert("No bank accounts set up.");return;}
									
									if (iStep == 1)
									{	
										$('#ns1blankspaceReceiptColumn2').html(ns1blankspace.xhtml.loadingSmall)
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_RECEIPT_INVOICE_SEARCH';
										oSearch.addField('amount');
										oSearch.addSummaryField('sum(amount) sumamount');
										oSearch.addFilter('invoice', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.rows = 1;
										oSearch.getResults(function(data){ns1blankspace.financial.invoice.receipt.edit($.extend(true, oParam, {step:2}), data)});
									}
										
									if (iStep == 2)
									{
										var cReceiptedAmount = oResponse.summary.sumamount;
										if (cReceiptedAmount == '') {cReceiptedAmount = "0"}
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
										
										aHTML.push('<tr><td class="ns1blankspaceSub"' +
														' data-receiptedamount="' + cReceiptedAmount + '">' +
														'$' + parseFloat(cReceiptedAmount).formatMoney(2, ".", ",") + ' has been receipted so far.' +
														'</td></tr>');
														
										aHTML.push('<tr>' +
														'<td id="ns1blankspaceReceiptEditAmount" class="ns1blankspaceSub">' +
														'$' + (parseFloat((ns1blankspace.objectContextData.amount).replace(",","")) - cReceiptedAmount).formatMoney(2, ".", ",") + ' remaining.' +
														'</td></tr>');
																						
										aHTML.push('<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceCaption" style="padding-top: 10px;">' +
														'Bank Account' +
														'</td></tr>' +
														'<tr class="ns1blankspaceRadio">' +
														'<td id="ns1blankspaceReceiptEditBankAccount" class="ns1blankspaceRadio">');
									
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
														'<input id="ns1blankspaceReceiptAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Date' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceDate">' +
														'<input id="ns1blankspaceReceiptDate" class="ns1blankspaceDate">' +
														'</td></tr>');		
																				
										aHTML.push('<tr class="ns1blankspace">' +
														'<td class="ns1blankspace" id="ns1blankspaceReceiptAddContainer">' +
														'<span id="ns1blankspaceReceiptAdd" class="ns1blankspaceAction">Receipt</span>' +
														'</td></tr>');
										
										aHTML.push('</table>');
													
										$('#ns1blankspaceReceiptColumn2').html(aHTML.join(''));

										$('[name="radioBankAccount"][value="' + iDefaultBankAccount + '"]').attr('checked', true);
									
										$('#ns1blankspaceReceiptAmount').val((ns1blankspace.objectContextData.amount).parseCurrency() - (cReceiptedAmount).parseCurrency());

										$('#ns1blankspaceReceiptAmount').focus();
										$('#ns1blankspacePaymentAmount').select();

										$('#ns1blankspaceReceiptDate').val(Date.today().toString("d MMM yyyy"));
										$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

										$('#ns1blankspaceReceiptAdd').button(
										{
											label: "Add Receipt"
										})
										.click(function() {
											ns1blankspace.financial.invoice.receipt.edit($.extend(true, oParam,
													{	
														step: 4,
														receiptedAmount: cReceiptedAmount,
														receiptAmount: $('#ns1blankspaceReceiptAmount').val(),
														date: $('#ns1blankspaceReceiptDate').val()
													}));
										});
									}
									
									if (iStep == 3)
									{
										//NOT USED

										$('#ns1blankspaceReceiptAddContainer').html(ns1blankspace.xhtml.loadingSmall);
												
										var sData = 'bankaccount=' + ns1blankspace.util.fs($('input[name="radioBankAccount"]:checked').val());
										sData += '&amount=' + ns1blankspace.util.fs(cReceiptAmount);
										sData += '&receiveddate=' + ns1blankspace.util.fs(Date.today().toString("dd-MMM-yyyy"));
										sData += '&paymentmethod=3'; //todo
										sData += '&contactbusinessreceivedfrom=' + ns1blankspace.objectContextData.contactbusinesssentto;	
										sData += '&contactpersonreceivedfrom=' + ns1blankspace.objectContextData.contactpersonsentto;
												
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_RECEIPT_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.financial.invoice.receipt.edit($.extend(true, oParam, {step: 4}), data)
											}
										});	
									}
								
									if (iStep == 4)
									{
										var cAmount = cReceiptAmount;
										var dDate = Date.today().toString("dd-MMM-yyyy");
										
										if (oParam != undefined)
										{
											if (oParam.amount != undefined) {cAmount = oParam.amount}
											if (oParam.date != undefined) {dDate = oParam.date}	
										}
											
										var sData = 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
										sData += '&amount=' + ns1blankspace.util.fs(cAmount);
										sData += '&receiptdate=' + ns1blankspace.util.fs(dDate);
										sData += '&paymentmethod=3';
										sData += '&bankaccount=' + ns1blankspace.util.fs($('input[name="radioBankAccount"]:checked').val());
												
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_AUTO_RECEIPT'),
											data: sData,
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.financial.invoice.receipt.edit($.extend(true, oParam, {step: 5}), data)
											}
										});	
									}

									if (iStep == 5)
									{
										ns1blankspace.status.message('Receipt added');
										ns1blankspace.financial.invoice.receipt.show();
										ns1blankspace.financial.invoice.receipt.refresh();
									}
								}
				},				

	debug: 		{
					sent:		function (sSent)
								{

									if (sSent == undefined) {sSent = "N"}

									var oData = {	"fields":
													[
														{
															"name": "reference"
														},
														{
															"name": "sent"
														},
														{
															"name": "sentdate"
														}
													],
													"filters":
													[
														{
															"name": "sent",
															"comparison": "EQUAL_TO",
															"value1": sSent,
															"value2": ""
														}
													],
													"sorts":
													[
														{
															"name": "reference",
															"direction": "asc"
														}
													],
													"options":
													{
														"rf": "JSON",
														"rows": "100"
													}
												}

									$.ajax({
										url: ns1blankspace.util.fs('FINANCIAL_INVOICE_SEARCH') + '&advanced=1',
										type: 'POST',
										cache: false,
										dataType: 'json',
										data: JSON.stringify(oData),
										success: function(response)
										{
													
										}
									});			

								}
				}
}								