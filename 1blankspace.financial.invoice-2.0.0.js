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
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.financial.init();

					ns1blankspace.object = 5;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'invoice';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Invoices';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.financial.invoice.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);	
				},

	refresh:	function (oResponse)
				{
					if (oResponse == undefined)
					{
						$('#ns1blankspaceControlSubContext_amount').html(ns1blankspace.xhtml.loadingSmall);
							
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
								
						$('#nns1blankspaceControlSubContext_sentdate').html(oObjectContext.sentdate);
						$('#ns1blankspaceControlSubContext_amount').html(oObjectContext.amount);
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
						aHTML.push('<tr><td id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');				
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
													
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
						oSearch.addField('reference,description,contactbusinesssenttotext,contactpersonsenttotext,duedate,amount');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(ns1blankspace.financial.invoice.home());
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
							aHTML.push('<tr><td class="ns1blankspaceMain" colspan="4">MOST LIKELY</td></tr>');
							
							$.each(oResponse.data.rows, function()
							{					
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Title-' + this.id + '" class="ns1blankspaceMostLikely" style="width:50px;">' +
														this.reference + '</td>');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Amount-' + this.id + '" class="ins1blankspaceMostLikelySub" style="width:50px;text-align:right;">' +
														'$' + this.amount + '</td>');
																		
								aHTML.push('<td id="ns1blankspaceMostLikely_DueDate-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;">' +
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
					send: 		function (sXHTMLElementId, oParam)
								{
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
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
																'area,reference,purchaseorder,sentdate,duedate,description,amount,tax,sent');
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
											ns1blankspace.dialog.position({xhtmlElementID: sElementId});
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
											oSearch.addField('contactbusinesssenttotext,contactbusinesssentto,contactpersonsenttotext,contactpersonsentto,projecttext,project,projecttext,areatext,' +
																'area,reference,purchaseorder,sentdate,duedate,description,amount,tax,sent');
											oSearch.rf = 'json';
											oSearch.addFilter('quicksearch', 'STRING_IS_LIKE', sSearchText);
											
											oSearch.getResults(function(data) {ns1blankspace.financial.invoice.search.process(oParam, data)});	
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var	iMaximumColumns = 1;
									var aHTML = [];
										
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
												aHTML[++h] = '<tr class="ns1blankspaceSearch">';
											}
										
											aHTML[++h] = '<td class="ns1blankspaceSearch" id="' + +
															'-' + this.id + '">' +
															this.reference +
															'</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML[++h] = '</tr>'
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
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">"' +
										'Summary</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');
						
						aHTML.push('<tr><td id="ns1blankspaceControlItem" class="ns1blankspaceControl">' +
										'Items</td></tr>');
					
						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');
						
						aHTML.push('<tr><td id="ns1blankspaceControlReceipts" class="ns1blankspaceControl">' +
										'Receipts</td></tr>');
													
						aHTML.push('<tr><td id="ns1blankspaceControlGL" class="ns1blankspaceControl">' +
										'GL</td></tr>');
									
						aHTML.push('</table>');					
					
						aHTML.push('<table class="interfaceViewportControl">');
					
						aHTML.push('<tr><td id="ns1blankspaceControlActions" class="ns1blankspaceControl">' +
										'Actions</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');
					}
									
					aHTML.push('</table>');					
							
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainItem" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainCredit" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainReceipt" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTransaction" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#divInterfaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainSummary'});
						ns1blankspace.financial.invoice.summary.show();
					});

					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainDetails'});
						ns1blankspace.financial.invoice.details();
					});
					
					$('#ns1blankspaceControlItem').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainItem', refresh: true});
						ns1blankspace.financial.invoice.item.show();
					});
					
					$('#ns1blankspaceControlCredits').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainCredits'}, refresh: true});
						ns1blankspace.financial.invoice.credit();
					});
					
					$('#ns1blankspaceControlReceipts').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainReceipt', refresh: true});
						ns1blankspace.financial.invoice.receipt();
					});
					
					$('#ns1blankspaceControlGL').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainTransaction', refresh: true});
						ns1blankspace.financial.transaction();
					});

					$('#ns1blankspaceControlActions').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainActions', refresh: true});
						ns1blankspace.actions.show({xhtmlElementID: 'divInterfaceMainActions'});
					});

					$('#ns1blankspaceControlControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainAttachments', refresh: true});
						ns1blankspace.attachments.show({xhtmlElementID: 'divInterfaceMainAttachments'});
					});			
				},

	show:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.financial.invoice.layout();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the invoice.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#ns1blankspaceViewControlAction').button({disabled: false});
								
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.reference +
							'<br /><span id="ns1blankspaceControlContext_sentdate" class="ns1blankspaceControlSubContext">' + ns1blankspace.objectContextData.sentdate + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_amount" class="ns1blankspaceControlSubContext">$' + ns1blankspace.objectContextData.amount + '</span>');
							
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.financial.invoice.init({showHome: false});ins1blankspace.financial.invoice.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							})
						
						ns1blankspace.history.object({functionDefault: 'ns1blankspace.financial.invoice.summary()'});
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

									if (ns1blankspace.objectContextData == undefined)
									{
										aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the invoice.</td></tr></table>');
												
										$('#ns1blankspaceMainSummary').html(aHTML.join(''));
									}
									else
									{

										if (ns1blankspace.financial.invoiceTemplateXHTML == undefined && (ns1blankspace.financial.summaryUseTemplate || bUseTemplate))
										{
											$('#ns1blankspaceMainSummary').html(ns1blankspace.xhtml.loadingSmall);

											var oSearch = new AdvancedSearch();
											oSearch.method = 'DOCUMENT_SEARCH';
											oSearch.addField('title,content');
											oSearch.addFilter('type', 'EQUAL_TO', 10);

											oSearch.getResults(function(data)
											{
												var oResponse = data;

												if (oResponse.data.rows.length == 0)
												{
													ns1blankspace.financial.invoiceTemplateXHTML = '';
												}
												else
												{
													ns1blankspace.financial.invoiceTemplateXHTML = (oResponse.data.rows[0].content).formatXHTML();
													ns1blankspace.financial.invoiceTemplateDocumentID = oResponse.data.rows[0].id;
												}

												ns1blankspace.financial.invoice.summary.default(oParam);

											});		
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
									var h = -1;
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
														'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
														'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:100px;"></td>' +
														'</tr>' +
														'</table>');				
						
										$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
				
										var aHTML = [];
									
										if (ns1blankspace.financial.invoiceTemplateXHTML != '' && (ns1blankspace.financial.summaryUseTemplate || bUseTemplate))
										{
											aHTML[++h] = ns1blankspace.format.render({object: 5, xhtmlTemplate: ns1blankspace.financial.invoiceTemplateXHTML});
										}
										else
										{
											aHTML[++h] = '<table class="ns1blankspaceColumn1">';
											
											if (ns1blankspace.objectContextData.amount != '')
											{
												aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Phone</td></tr>' +
																'<tr><td id="ns1blankspaceSummaryAmount" class="ns1blankspaceSummary">' +
																'$' + ns1blankspace.objectContextData.amount +
																'</td></tr>');
											}	
											
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
												aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Send Date</td></tr>' +
																'<tr><td id="ns1blankspaceSummarySentDate" class="ns1blankspaceSummary">' +
																ns1blankspace.objectContextData.sentdate +
																'</td></tr>');

												aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Due Date</td></tr>' +
																'<tr><td id="ns1blankspaceSummaryDueDate" class="ns1blankspaceSummary">' +
																ns1blankspace.objectContextData.duedate +
																'</td></tr>');	
											}
											else
											{	
												aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Invoice hasn\'t been sent.</td></tr>');			
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

										aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
														
										if (ns1blankspace.financial.invoiceTemplateXHTML != '')
										{
											if (ns1blankspace.financial.summaryUseTemplate || bUseTemplate)
											{
												aHTML.push('<tr><td id="ns1blankspaceSummaryViewPDF" class="ns1blankspaceColumn2Action">' +
															'<a href="#" id="ns1blankspaceSummaryViewPDF">Create&nbsp;PDF</a>' +
															'</td></tr>');
											}
											else
											{				
												aHTML.push('<tr><td id="ns1blankspaceSummaryView" class="interfaceMainColumn2Action">' +
															'<a href="#" id="ns1blankspaceSummaryView">View</a>' +
															'</td></tr>');
											}

											aHTML[++h] = '</table>';					
											
											$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));	
											
											if (ns1blankspace.financial.summaryUseTemplate || bUseTemplate)
											{
												$('#ns1blankspaceSummaryViewPDF').click(function(event)
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
												$('#ns1blankspaceSummaryView').click(function(event)
												{
													ns1blankspace.financial.invoice.summary.show({useTemplate: true});
												});

											}	
										}	
									}	
								}
				},				

details: 		function ()
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
										'Sent Date' +
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

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Send' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioSentN" name="radioSent" value="N"/>No' +
										'&nbsp;&nbsp;<input type="radio" id="radioSentY" name="radioSent" value="Y"/>Yes' +
										'</td></tr>');	
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<input id="ns1blankspaceDetailsDescription" class="ns1blankspaceTextMulti">' +
										'</td></tr>');		
										
						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#ns1blankspaceDetailsPurchaseOrderReference').val(ns1blankspace.objectContextData.purchaseorder);
							$('#ns1blankspaceDetailsSentToBusiness').attr('data-id', ns1blankspace.objectContextData.contactbusinesssentto);
							$('#ns1blankspaceDetailsSentToBusiness').val(ns1blankspace.objectContextData.contactbusinesssenttotext);
							$('#ns1blankspaceDetailsSentToPerson').attr('data-id', ns1blankspace.objectContextData.contactpersonsentto);
							$('#ns1blankspaceMainDetailsSentToPerson').val(ns1blankspace.objectContextData.contactpersonsenttotext);	
							$('[name="radioSent"][value="' + ns1blankspace.objectContextData.sent + '"]').attr('checked', true);
							$('#ns1blankspaceDetailsSentDate').val(ns1blankspace.objectContextData.sentdate);
							$('#ns1blankspaceDetailsDueDate').val(ns1blankspace.objectContextData.duedate);
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.description);
						}
						else
						{
							$('[name="radioSent"][value="N"]').attr('checked', true);
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

	save:		{		
					send:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										ns1blankspace.status.working();
										
										var sData = (ns1blankspace.objectContext == -1)?'':'id=' + ns1blankspace.objectContext;
											
										if ($('#ns1blankspaceMainDetails').html() != '')
										{
											sData += '&reference=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsReference').val());
											sData += '&purchaseorder=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsPurchaseOrderReference').val());
											sData += '&sentdate=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsSentDate').val());
											sData += '&duedate=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsDueDate').val());
											sData += '&description=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsDescription').val());
											sData += '&contactbusinesssentto=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsSentToBusiness').attr("data-id"));
											sData += '&contactpersonsentto=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsSentToPerson').attr("data-id"));
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

	item: 		{
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
														'<td id="ns1blankspaceItemColumn1" class="ns1blankspaceColumn1"></td>' +
														'<td id="ns1blankspaceItemColumn2" class="ns1blankspaceColumn2"></td>' +
														'</tr>');

										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainItem').html(aHTML.join(''));	
								
										if (oActions != undefined)
										{
											var aHTML = [];
											
											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											if (oActions.add)
											{
												aHTML.push('<tr><td class="ns1blankspaceAction">' +
																'<span id="ns1blankspaceItemAdd">Add</span>' +
																'</td></tr>');
											}
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceItemColumn2').html(aHTML.join(''));
										
											$('#ns1blankspaceItemAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												 ns1blankspace.financial.invoice.item.edit(oParam);
											});										
										}
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_ITEM_SEARCH';
										oSearch.addField('financialaccounttext,tax,issuedamount,amount,description');
										oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
										oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.sort('financialaccounttext', 'asc');
										
										oSearch.getResults(function(data) {ns1blankspace.financial.invoice.item.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">No items.</td></tr></table>');

											$('#ns1blankspaceItemColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceCaption style="width:125px;">Account</td>');
											aHTML.push('<td class="ns1blankspaceCaption">Description</td>');
											aHTML.push('<td class="ns1blankspaceCaption" style="text-align:right;">Amount</td>');
											aHTML.push('<td class="ns1blankspaceCaption">&nbsp;</td>');
											aHTML.push('</tr>');

											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																			
												aHTML.push('<td id="ns1blankspaceItem_financialaccounttext-' + oRow.id + '" class="ns1blankspaceRow">' +
																this["financialaccounttext"] + '</td>');
												
												aHTML.push('<td id="ns1blankspaceItem_description-' + oRow.id + '" class="ns1blankspaceRow">' +
																this["description"] + '</td>');

												aHTML.push('<td id="ns1blankspaceItem_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;"' +
																' title="' + this["tax"] + '">' +
																this["amount"] + '</td>');
	
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML[++h] = '<span id="ns1blankspaceRowItem_options_remove-' + this.id + '" class="ns1blankspaceItemRemove"></span>';
												};	
													
												if (oOptions.view)
												{	
													aHTML[++h] = '<span id="ns1blankspaceRowItemItem_options_view-' + this.id + '" class="ns1blankspaceItemView"></span>';
												};	
													
												aHTML.push('</td></tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceItemColumn1').html(aHTML.join(''));
											
											if (oOptions.remove) 
											{
												$('.ns1blankspaceItemRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspace.financial.invoice.item.remove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px')
											}
											
											if (oOptions.view) 
											{
												$('.ins1blankspaceItemView').button( {
													text: false,
													icons: {
														primary: "ui-icon-play"
													}
												})
												.click(function() {
													ns1blankspace.financial.invoice.item.edit({xhtmlElementID: this.id})
												})
												.css('width', '15px')
												.css('height', '17px')
											}	
										}
									}	
								},

					remove:		function (oParam, oResponse)
								{
									var sXHTMLElementID;

									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}
									
									var aXHTMLElementID = sXHTMLElementID.split('-');
									var sID = aXHTMLElementID[1];
									
									if (oResponse == undefined)
									{	
										var sData = 'remove=1&id=' + sID;
										
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data)
											{
												var sData = 'object=' + ns1blankspace.object;
												sData += '&objectcontext=' + ns1blankspace.objectContext;
												
												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_COMPLETE'),
													data: sData,
													dataType: 'json',
													success: function(data){ns1blankspace.financial.invoice.refresh()}
												});
												
												ns1blankspace.financial.invoice.remove(oParam, data)
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
								},

					edit:		function (oParam, oResponse)
								{
									var iStep = 1;
									
									if (oParam != undefined)
									{
										if (oParam.step != undefined) {iStep = oParam.step}	
									}
									
									if (oResponse == undefined)
									{
										if (iStep == 1)
										{
											var aHTML = [];
											
											aHTML.push('<table class="ns1blankspace">');
									
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
															'Description' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceText">' +
															'<input id="ns1blankspaceItemDescription" class="ns1blankspaceText">' +
															'</td></tr>');

											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Account' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceText">' +
															'<input id="ns1blankspaceItemAccount" class="ns1blankspaceText">' +
															'</td></tr>');

											aHTML.push('<tr class="ns1blankspace">' +
															'<td class="ns1blankspace" title="Enter a code or title and click search">' +
															'<span id="ns1blankspaceItemAddSearch">Search</span>' +
															'</td></tr>');
											
											aHTML.push('</table>');
											
											aHTML.push('<table style="margin-top:15px;">');
											
											aHTML.push('<tr><td id="ns1blankspaceItemAddSearchResults"></td></tr>';
																			
											aHTML.push('</table>');		
											
											$('#ns1blankspaceItemColumn2').html(aHTML.join(''));

											$('#ns1blankspaceItemAddSearch').button(
											{
												label: "Search"
											})
											.click(function() {
												ns1blankspace.financial.invoice.item.edit($.extend(true, oParam, {step: 2}))
											})
												
											$('#ns1blankspaceItemAmount').focus();
										}

										if (iStep == 2)
										{	
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
											oSearch.addField('title');
											oSearch.addFilter('title', 'STRING_IS_LIKE', $('#ns1blankspaceItemAccount').val());
											oSearch.sort('title', 'asc');
											oSearch.getResults(function(data){ns1blankspace.financial.invoice.item.edit($.extend(true, oParam, {step:3}), data)});
										}
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)	
										{
											aHTML.push('<table class="ns1blankspace">' +
															'<tr><td class="ns1blankspaceNothing">No accounts.</td></tr>' + 
															'</table>');

											$('#ns1blankspaceItemAddSearchResults').html(aHTML.join(''));		
										}
										else
										{	
											aHTML.push('<table class="ns1blankspace">');
											
											$.each(oResponse.data.rows, function() 
											{ 
												aHTML.push('<tr class="ns1blankspaceRow">'+ 
																'<td id="ns1blankspaceItem_title-' + this.id + '" class="ns1blankspaceRow">' +
																this.title + '</td>' +
																'<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
																'<span id="ns1blankspaceItem_options_add-' + this.id + '" class="ns1blankspaceItemAdd"></span>' +
																'</td></tr>');	
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceItemAddSearchResults').html(aHTML.join(''))
											
											$('.ns1blankspaceItemAdd').button({
												text: false,
												icons: {
													primary: "ui-icon-plus"
												}
											})
											.click(function()
											{
												ns1blankspace.status.working();

												var sID = this.id;
												var aID = sID.split('-');
												var iAccount = aID[1];
												var cAmount = $('#ns1blankspaceItemAmount').val();
												if (cAmount == '') {cAmount = 0};
												
												var sData = 'object=' + ns1blankspace.object;
												sData += '&objectcontext=' + ns1blankspace.objectContext;
												sData += '&financialaccount=' + iAccount;
												sData += '&amount=' + cAmount;
												sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceItemDescription').val());
													
												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
													data: sData,
													dataType: 'json',
													success: function(oResponse)
													{
														ns1blankspaceStatus('Added.');

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
																ns1blankspace.financial.invoice.refresh();
																ns1blankspace.financial.invoice.show();
															}
														});
													}
												});
											})
											.css('width', '20px')
											.css('height', '20px')
											
											$('input.ns1blankspaceText:first').focus();
										}
									}	
								}
				},				

	receipt: 	{
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
														'<td id="ns1blankspaceReceiptColumn1" class="ns1blankspaceColumn1"></td>' +
														'<td id="ns1blankspaceReceiptColumn2" class="ns1blankspaceColumn2" style="width: 300px;></td>' +
														'</tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainReceipt').html(aHTML.join(''));	
										
										if (oActions != undefined)
										{	
											var aHTML = [];
											
											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											if (oActions.add)
											{
												aHTML.push('<tr><td class="ns1blankspaceAction">' +
															'<span id="ns1blankspaceReceiptAdd">Add</span>' +
															'</td></tr>');
											}
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceReceiptColumn2').html(aHTML.join(''));
										
											$('#ns1blankspaceReceiptAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												 ns1blankspace.financial.invoice.receipt.edit(oParam);
											})		
										}
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_RECEIPT_INVOICE_SEARCH';
										oSearch.addField('appliesdate,amount');
										oSearch.addFilter('invoice', 'EQUAL_TO', iObjectContext);
										oSearch.sort('appliesdate', 'asc');
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
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceCaption">Date</td>');
											aHTML.push('<td class="ns1blankspaceCaption" style="text-align:right;">Amount</td>');
											aHTML.push('<td class="ns1blankspaceCaption">&nbsp;</td>');
											aHTML.push('</tr>');

											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																			
												aHTML.push('<td id="ns1blankspaceReceipt_date-' + oRow.id + '" class="ns1blankspaceRow">' +
																this.appliesdate + '</td>');

												
												aHTML.push('<td id="ns1blankspaceReceipt_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																this.amount + '</td>');
						
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceReceipt_options_remove-' + this.id + '" class="ns1blankspaceReceiptRemove"></span>');
												};	
													
												aHTML[++h] = '</td></tr>');
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
									
									if (oParam != undefined)
									{
										if (oParam.step != undefined) {iStep = oParam.step}	
									}
									
									if (ns1blankspace.financial.bankaccounts.length == 0) {alert("No bank accounts set up.");return;}
									
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
										cReceiptedAmount = oResponse.summary.sumamount;
										if (cReceiptedAmount == '') {cReceiptedAmount = 0}
										
										var aHTML = [];
										
										aHTML.push('<table id="ns1blankspace">');
										
										aHTML.push('<tr class="ns1blankspace">' +
														'<td class="ns1blankspace"' +
														' data-receiptedamount="' + cReceiptedAmount + '">' +
														'$' + (cReceiptedAmount).formatMoney(2, ".", ",") + ' has been receipted so far.'
														'</td></tr>');
														
										aHTML.push('<tr class="ns1blankspace">' +
														'<td id="ns1blankspaceReceiptEditAmount" class="ns1blankspace"' +
														'">' +
														'$' + (parseFloat((ns1blankspace.objectContextData.amount).replace(",","")) - cReceiptedAmount).formatMoney(2, ".", ",") + ' remaining.'
														'</td></tr>');
																						
										aHTML.push('<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceCaption">' +
														'Bank Account' +
														'</td></tr>' +
														'<tr class="ns1blankspaceRadio">' +
														'<td id="ns1blankspaceReceiptEditBankAccount" class="ns1blankspaceRadio">');
									
										var iDefaultBankAccount;
										
										$.each(ns1blankspace.financial.bankaccounts, function()
										{
											if (iDefaultBankAccount == undefined) {iDefaultBankAccount = this.id}
											aHTML.push('<input type="radio" id="radioBankAccount' + this.id + '" name="radioBankAccount" value="' + this.id + '"/>' +
																this.title + '<br />');				
										});
										
										aHTML.push('</td></tr>');				
														
										aHTML.push('<tr class="ns1blankspace">' +
														'<td class="ns1blankspace">' +
														'<span id="ns1blankspaceReceiptEditFull">Receipt</span>' +
														'</td></tr>');
										
										aHTML.push('</table>');
										
										aHTML.push('<table style="margin-top:15px;">');
										
										aHTML.push('<tr><td id="ns1blankspaceReceiptEditFullResults"></td></tr>');
																		
										aHTML.push('</table>');		
											
										$('#ns1blankspaceReceiptColumn2').html(aHTML.join(''));

										$('[name="radioBankAccount"][value="' + iDefaultBankAccount + '"]').attr('checked', true);
									
										$('#ns1blankspaceReceiptEditFull').button(
										{
											label: "Receipt Full Amount"
										})
										.click(function() {
											ns1blankspace.financial.invoice.receipt.edit($.extend(true, oParam, {step: 3, receiptedamount: cReceiptedAmount}))
										});
									}
									
									if (iStep == 3)
									{
										$('#ns1blankspaceReceiptEditFullResults').html(ns1blankspace.xhtml.loadingSmall);
												
										var cAmount = ns1blankspace.objectContextData.amount - cReceiptedAmount;
										
										var sData = 'bankaccount=' + ns1blankspace.util.fs($('input[name="radioBankAccount"]:checked').val());
										sData += '&amount=' + ns1blankspace.util.fs(cAmount);
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
												ns1blankspace.financial.invoice.receipt.edit($.extend(true, oParam, {step: 4, amount: cAmount}), data)
											}
										});	
									}
									
									if (iStep == 4)
									{
										var cAmount = 0;
										
										if (oParam != undefined)
										{
											if (oParam.amount != undefined) {cAmount = oParam.amount}	
										}
										
										var iReceiptID = oResponse.id;
										
										var sData = 'invoice=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
										sData += '&amount=' + ns1blankspace.util.fs(cAmount);
										sData += '&appliesdate=' + ns1blankspace.util.fs(Date.today().toString("dd-MMM-yyyy"));
										sData += '&receipt=' + ns1blankspace.util.fs(iReceiptID);
												
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_RECEIPT_INVOICE_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.financial.invoice.receipt.edit($.extend(true, oParam, {step: 5}), data)
											}
										});	
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

