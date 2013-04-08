/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.financial.invoice = 
{
	init: 		function (oParam)
				{
					var bInitialised = false;

					if (oParam != undefined)
					{
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}	
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
						ns1blankspace.app.set(oParam);
					}		
				},

	refresh:	function (oResponse)
				{
					if (oResponse == undefined)
					{
						$('#ns1blankspaceControlContext_amount').html(ns1blankspace.xhtml.loadingSmall);
							
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
						oSearch.addField('sentdate,amount,tax');
						oSearch.rf = 'json';
						oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
						oSearch.getResults(function(data) {ns1blankspace.financial.invoice.refresh(data)});
					}
					else
					{
						var oObjectContext = oResponse.data.rows[0];
							
						ns1blankspace.objectContextData.sentdate = oObjectContext.sentdate;
						ns1blankspace.objectContextData.amount = oObjectContext.amount;
								
						$('#ns1blankspaceControlContext_sentdate').html(oObjectContext.sentdate);
						$('#ns1blankspaceControlContext_amount').html('$' + oObjectContext.amount);

						ns1blankspace.financial.invoice.receipt.refresh();
					}
				},

	home: 		function (oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceMain">' + 
										'<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ins1blankspaceMain">' +
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
						oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
						oSearch.addField('reference,description,contactbusinesssenttotext,contactpersonsenttotext,duedate,amount');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(ns1blankspace.financial.invoice.home);
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
							aHTML.push('<tr><td class="ns1blankspaceCaption" colspan="4">MOST LIKELY</td></tr>');
							
							$.each(oResponse.data.rows, function()
							{					
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Title-' + this.id + '" class="ns1blankspaceMostLikely" style="width:50px;">' +
														this.reference + '</td>');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Amount-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:50px;text-align:right;padding-left:10px;padding-right:10px;">' +
														'$' + this.amount + '</td>');
																		
								aHTML.push('<td id="ns1blankspaceMostLikely_DueDate-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;text-align:right;padding-right:15px;">' +
														this.duedate + '</td>');
																										
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
					send: 		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
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
										oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
										oSearch.addField('contactbusinesssenttotext,contactbusinesssentto,contactpersonsenttotext,contactpersonsentto,' +
																'projecttext,project,projecttext,areatext,' +
																'object,objectcontext,' +
																'area,reference,purchaseorder,sentdate,duedate,description,amount,tax,sent,frequency');
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
											oSearch.addField('contactbusinesssenttotext,contactbusinesssentto,contactpersonsenttotext,contactpersonsentto,projecttext,project,projecttext,areatext,' +
																'area,reference,purchaseorder,sentdate,duedate,description,amount,tax,sent');
											oSearch.rf = 'json';
											oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('invoice.contactbusinesssentto.tradename', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('invoice.contactpersonsentto.surname', 'TEXT_IS_LIKE', sSearchText);
											
											oSearch.getResults(function(data) {ns1blankspace.financial.invoice.search.process(oParam, data)});	
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
										
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
														'search-' + this.id + '">' +
														this.reference +
														'</td>');

											if (this.contactbusinesssenttotext != '')
											{
												sContact = this.contactbusinesssenttotext;
											}
											else
											{
												sContact = this.contactpersonsenttotext;
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

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.financial.invoice.search.send(event.target.id, {source: 1});
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
						ns1blankspace.financial.util.credit.show();
					});
					
					$('#ns1blankspaceControlReceipts').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainReceipt', refresh: true});
						ns1blankspace.financial.invoice.receipt.show();
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
						
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
								
						$('#ns1blankspaceControlContext').html(
							'<span id="ns1blankspaceControlContext_reference">' + ns1blankspace.objectContextData.reference + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_sentdate" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.sentdate + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_amount" class="ns1blankspaceSub">$' + ns1blankspace.objectContextData.amount + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_outstanding" class="ns1blankspaceSub"></span>');
							
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.financial.invoice.init({showHome: false, id: ' + ns1blankspace.objectContext + '})',
							move: false
							})
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.invoice.summary.show()'});
					}	
				},		
		
	summary: 	{
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
										if (ns1blankspace.financial.summaryUseTemplate || bUseTemplate)
										{	
											oParam.onComplete = ns1blankspace.financial.invoice.summary.default;
											ns1blankspace.util.initTemplate(oParam);
										}	
										else
										{
											ns1blankspace.financial.invoice.summary.default(oParam);
										}
									}	
								},

					default:	function (oParam)
								{
									var aHTML = [];
									var bUseTemplate = false;
									
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
										aHTML.push('<table class="ns1blankspaceMain">' +
														'<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
														'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:80px;"></td>' +
														'</tr>' +
														'</table>');				
						
										$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
				
										var aHTML = [];
									
										if (ns1blankspace.xhtml.templates['invoice'] != '' && (ns1blankspace.financial.summaryUseTemplate || bUseTemplate))
										{
											aHTML.push(ns1blankspace.format.render({object: 5, xhtmlTemplate: ns1blankspace.xhtml.templates['invoice']}));
										}
										else
										{
											aHTML.push('<table class="ns1blankspace">');
											
											if (ns1blankspace.objectContextData.contactbusinesssenttotext != '')
											{

												aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Business</td></tr>' +
																'<tr><td id="ns1blankspaceSummaryBusiness" class="ns1blankspaceSummary">' +
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
														
										if (ns1blankspace.xhtml.templates['invoice'] != '')
										{
											if (ns1blankspace.financial.summaryUseTemplate || bUseTemplate)
											{
												aHTML.push('<tr><td>' +
																'<span id="ns1blankspaceSummaryCreatePDF" class="ns1blankspaceAction" style="width:75px;">' +
																'PDF</span></td></tr>');

												aHTML.push('<tr><td>' +
																'<span id="ns1blankspaceSummaryEmail" class="ns1blankspaceAction" style="width:75px;">' +
																'Email</span></td></tr>');
											}
											else
											{				
												aHTML.push('<tr><td>' +
																'<span id="ns1blankspaceSummaryView" class="ns1blankspaceAction" style="width:75px;">' +
																'View</span></td></tr>');

												aHTML.push('<tr><td>' +
																'<span id="ns1blankspaceSummaryEmail" class="ns1blankspaceAction" style="width:75px;">' +
																'Email</span></td></tr>');
											}

											if (ns1blankspace.objectContextData.sent == 'N')
											{	
												aHTML.push('<tr><td style="padding-top:15px; color:#cc0000;">Not sent</td></tr>');			
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
													ns1blankspace.pdf.create({
															xhtmlContent: $('#ns1blankspaceSummaryColumn1').html(),
															filename: ns1blankspace.objectContextData.reference + '.pdf',
															open: true
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
													ns1blankspace.financial.invoice.summary.show({useTemplate: true});
												});
											}

											$('#ns1blankspaceSummaryEmail').button(
											{
												label: 'Email'
											})
											.click(function(event)
											{
												ns1blankspace.financial.invoice.email.init();
											});
										}	
									}	
								}
				},

	email: 		{
					init: 		function (oParam)
								{
									oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.invoice.email.send);
									ns1blankspace.util.initTemplate(oParam);
								},

					send:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_ITEM_SEARCH';
										oSearch.addField('financialaccounttext,tax,issuedamount,amount,description,object');
										oSearch.addFilter('object', 'EQUAL_TO', 5);
										oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectcontext);
										oSearch.sort('id', 'asc');
										oSearch.getResults(function(data)
										{
											ns1blankspace.financial.invoice.email.send(oParam, data);
										});
									}	
									else
									{
										ns1blankspace.objectContextData.xhtml = ns1blankspace.format.render(
										{
											object: 5,
											xhtmlTemplate: ns1blankspace.xhtml.templates['invoice'],
											objectOtherData: oResponse.data.rows
										});

										if (ns1blankspace.objectContextData.xhtml = '')
										{
											ns1blankspace.status.error('Nothing to email');
										}	
										else
										{
											var oData = 
											{
												subject: ns1blankspace.objectContextData.reference,
												message: ns1blankspace.objectContextData.xhtml,
												to: ns1blankspace.objectContextData.contactpersonsentto,
												object: 5,
												objectContext: ns1blankspace.objectcontext
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
															data: 'sent=Y&id=' + ns1blankspace.objectcontext,
															dataType: 'json',
															global: false,
															success: function (data)
															{
																ns1blankspace.status.message('Emailed');
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
										'Purchase Order Number' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPurchaseOrderReference" class="ns1blankspaceText">' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Business' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsSentToBusiness" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_BUSINESS_SEARCH"' +
											' data-columns="tradename">' +
										'</td></tr>');	
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Person' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsSentToPerson" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_PERSON_SEARCH"' +
											' data-columns="surname"' +
											' data-parent="ns1blankspaceDetailsSentToBusiness"' +
											' data-parent-search-id="contactbusiness"' +
											' data-parent-search-text="tradename">' +
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
							
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
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
								data: 'override_LockedSent=Y&sent=N&id=' + ns1blankspace.objectContext,
								dataType: 'json',
								success: function(oResponse) {ns1blankspace.financial.invoice.search.send('-' + ns1blankspace.objectContext)}
							});
						});

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#ns1blankspaceDetailsPurchaseOrderReference').val(ns1blankspace.objectContextData.purchaseorder);
							$('#ns1blankspaceDetailsSentToBusiness').attr('data-id', ns1blankspace.objectContextData.contactbusinesssentto);
							$('#ns1blankspaceDetailsSentToBusiness').val(ns1blankspace.objectContextData.contactbusinesssenttotext);
							$('#ns1blankspaceDetailsSentToPerson').attr('data-id', ns1blankspace.objectContextData.contactpersonsentto);
							$('#ns1blankspaceDetailsSentToPerson').val(ns1blankspace.objectContextData.contactpersonsenttotext);	
							$('[name="radioSent"][value="' + ns1blankspace.objectContextData.sent + '"]').prop('checked', true);
							$('#ns1blankspaceDetailsSentDate').val(ns1blankspace.objectContextData.sentdate);
							$('#ns1blankspaceDetailsDueDate').val(ns1blankspace.objectContextData.duedate);
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.description);
							$('[name="radioFrequency"][value="' + ns1blankspace.objectContextData.frequency + '"]').prop('checked', true);
						}
						else
						{
							$('[name="radioSent"][value="N"]').prop('checked', true);
							$('[name="radioFrequency"][value="9"]').prop('checked', true);
						}
					}	
				},

	new:		function (oParam)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspace.financial.invoice.init();
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					ns1blankspace.financial.invoice.details();
				},

	remove: 	function (aParam, oResponse)
				{		
					if (oResponse == undefined)
					{
						ns1blankspace.status.message(ns1blankspace.xhtml.loadingSmall);

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('SETUP_SITE_MANAGE'),
							data: 'remove=1&id=' + ns1blankspace.objectContext,
							dataType: 'json',
							success: function(data){ns1blankspace.financial.invoice.remove(aParam, data)}
						});

					}
					else if (oResponse != undefined)
					{
						if (oResponse.notes == 'REMOVED')
						{
							ns1blankspace.status.message("Removed");
						}
						else
						{
							ns1blankspace.status.error('Cannot remove website!')
						}
					}	
					else
					{
						ns1blankspace.status.error('Cannot remove website!')
					}	
				},

	save:		{		
					send:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										ns1blankspace.status.working();
										
										var sData = (ns1blankspace.objectContext == -1)?'':'id=' + ns1blankspace.objectContext;
											
										if ($('#ns1blankspaceMainDetails').html() != '')
										{
											sData += '&reference=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsReference').val());
											sData += '&purchaseorder=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPurchaseOrderReference').val());
											sData += '&sentdate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSentDate').val());
											sData += '&duedate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDueDate').val());
											sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDescription').val());
											sData += '&contactbusinesssentto=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSentToBusiness').attr("data-id"));
											sData += '&contactpersonsentto=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSentToPerson').attr("data-id"));
											sData += '&sent=' + $('input[name="radioSent"]:checked').val();
											sData += '&frequency=' + $('input[name="radioFrequency"]:checked').val();
										}
										
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_INVOICE_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data) {ns1blankspace.financial.invoice.save.send(oParam, data)}
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
												ns1blankspace.financial.invoice.search.send('-' + ns1blankspace.objectContext, {source: 1});
											}	
										}
										else
										{
											ns1blankspace.status.error('Could not save the invoice!');
										}
									}	
								}
				},

	receipt: 	{
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

					show: 		function (oParam, oResponse)
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
														'<td id="ns1blankspaceReceiptColumn1" class="ns1blankspaceColumn1Flexible">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspaceReceiptColumn2" class="ns1blankspaceColumn2" style="width: 350px;"></td>' +
														'</tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainReceipt').html(aHTML.join(''));	
									
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
										
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceReceiptAdd" class="ns1blankspaceAction">Add</span>' +
														'</td></tr>');
										
										aHTML.push('</table>');					
										
										//$('#ns1blankspaceReceiptColumn2').html(aHTML.join(''));
									
										$('#ns1blankspaceReceiptAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											 ns1blankspace.financial.invoice.receipt.edit(oParam);
										})		
									
										ns1blankspace.financial.invoice.receipt.edit(oParam);

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_RECEIPT_INVOICE_SEARCH';
										oSearch.addField('appliesdate,amount,receiptinvoice.receipt.reference,receiptinvoice.receipt.amount');
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
											var oReceipts = ns1blankspace.util.unique({key: 'receiptinvoice.receipt.reference', data: oResponse.data.rows});
									
											aHTML.push('<table class="ns1blankspace">');
											aHTML.push('<tr>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');

											$.each(oReceipts, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																			
												aHTML.push('<td id="ns1blankspaceReceipt_date-' + this.id + '" class="ns1blankspaceRow">' +
																this['appliesdate'] + '</td>');

												
												aHTML.push('<td id="ns1blankspaceReceipt_amount-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																this['receiptinvoice.receipt.amount'] + '</td>');
						
												aHTML.push('<td style="width:30px; text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceReceipt_options_remove-' + this.id + '" class="ns1blankspaceReceiptRemove"></span>');
												};	
													
												aHTML.push('</td></tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceReceiptColumn1').html(aHTML.join(''));
											
											if (oOptions.remove) 
											{
												$('.ns1blankspaceReceiptRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspace.financial.invoice.receipt.remove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px')
											}
										}
									}	
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
													{	step: 4,
														receiptedAmount: cReceiptedAmount,
														receiptAmount: $('#ns1blankspaceReceiptAmount').val(),
														date: $('#ns1blankspaceReceiptDate').val()
													}))
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

