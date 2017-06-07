/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

ns1blankspace.financial.credit = 
{
	init: 		function (oParam)
				{
					var bInitialised = false;
					
					if (oParam != undefined)
					{
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}	
					}

					ns1blankspace.app.reset();

					ns1blankspace.object = 69;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'credit';
					ns1blankspace.objectMethod = 'FINANCIAL_CREDIT_NOTE';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Credits';

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
						$('#ns1blankspaceControlContext_tobeapplied').html(ns1blankspace.xhtml.loadingSmall);
							
						var oSearch = new AdvancedSearch();
										
						if (ns1blankspace.objectContextData.type == '1')
						{	
							oSearch.method = 'FINANCIAL_INVOICE_CREDIT_NOTE_SEARCH';
						}
						else
						{
							oSearch.method = 'FINANCIAL_EXPENSE_CREDIT_NOTE_SEARCH';
						}	

						oSearch.addField('amount');
						oSearch.rows = 0;
						oSearch.addSummaryField('sum(amount) totalamount');
						oSearch.addSummaryField('sum(tax) totaltax');
						oSearch.addFilter('credit', 'EQUAL_TO', ns1blankspace.objectContext);
						oSearch.getResults(function(data) {ns1blankspace.financial.credit.refresh(data)});
											
					}
					else
					{
						ns1blankspace.objectContextData.appliedamount = (oResponse.summary.totalamount).parseCurrency();
						ns1blankspace.objectContextData.appliedtax = (oResponse.summary.totaltax).parseCurrency();
						
						ns1blankspace.objectContextData.tobeappliedamount =
								(ns1blankspace.objectContextData.amount).parseCurrency() - ns1blankspace.objectContextData.appliedamount;

						ns1blankspace.objectContextData.tobeappliedtax =
								(ns1blankspace.objectContextData.tax).parseCurrency() - ns1blankspace.objectContextData.appliedtax;		

						var sHTML = '<span style="background-color:#CCCCCC; color:white;">' +
												'$' + (ns1blankspace.objectContextData.tobeappliedamount).formatMoney(2, ".", ",") + '</span>';

						sHTML += '<br /><span class="ns1blankspaceSub" style="font-size:0.75em;">' +
												ns1blankspace.option.taxVATCaption + '</span> ';

						sHTML += '<span style="background-color:#CCCCCC; color:white;">' +
									'$' + (ns1blankspace.objectContextData.tobeappliedtax).formatMoney(2, ".", ",") + '</span>';

						$('#ns1blankspaceControlContext_tobeapplied').html(sHTML);

						$('#ns1blankspaceAppliedToColumn1 .ns1blankspaceAppliedToSelect')[(ns1blankspace.objectContextData.tobeappliedamount == 0?'hide':'show')]();
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
						oSearch.method = 'FINANCIAL_CREDIT_NOTE_SEARCH';
						oSearch.addField('reference,contactbusinesstext,amount,notes,type,typetext,creditdate');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(function(data) {ns1blankspace.financial.credit.home(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceNothing">Click New to add a credit (note).</td></tr>');
							aHTML.push('</table>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceCaption" colspan="4">MOST LIKELY</td></tr>');
							
							$.each(oResponse.data.rows, function()
							{					
								aHTML.push('<tr class="ns1blankspaceRow">');
									
								aHTML.push('<td id="ns1blankspaceMostLikely_Title-' + this.id + '" class="ns1blankspaceMostLikely" style="width:60px;">' +
														this.reference + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_Type-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:150px; padding-left:10px;">' +
														this.typetext + '</td>');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Amount-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:50px;text-align:right;">' +
														'$' + this.amount + '</td>');
																		
								aHTML.push('<td id="ns1blankspaceMostLikely_Date-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;">' +
														this.creditdate + '</td>');
																										
								var sContact = this.contactbusinesstext;
								//if (sContact == '') {sContact = this.contactpersonreceivedfromtext}
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Contact-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
														sContact + '</td>');
									
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							 ns1blankspace.financial.credit.search.send(event.target.id, {source: 1});
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
										oSearch.method = 'FINANCIAL_CREDIT_NOTE_SEARCH';
										oSearch.addField('amount,area,areatext,contactbusiness,contactbusinesstext,contactperson,contactpersontext,' +
															'creditdate,financialaccount,financialaccounttext,notes,' +
															'object,objectcontext,objecttext,project,projecttext,reason,reasontext,' +
															'reference,store,storetext,tax,taxtype,taxtypeexpensetext,taxtyperevenuetext,type,typetext');

										oSearch.addField(ns1blankspace.option.auditFields);
										
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										
										oSearch.getResults(function(data) {ns1blankspace.financial.credit.show(oParam, data)});
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
											oSearch.method = 'FINANCIAL_CREDIT_NOTE_SEARCH';
											oSearch.addField('contactbusiness,contactbusinesstext,contactperson,contactpersontext,' +
																'reference,creditdate,notes,amount');

											oSearch.addBracket('(');
											oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('contactbusinesstext', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('contactpersontext', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addBracket(')');

											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.getResults(function(data) {ns1blankspace.financial.credit.search.process(oParam, data)});	
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var	iMaximumColumns = 1;
									var sContact;
										
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
														'search-' + this.id + '">' +
														this.reference +
														'</td>');

											if (this.contactbusinesstext != '')
											{
												sContact = this.contactbusinesstext;
											}
											else
											{
												sContact = this.contactpersontext;
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
											ns1blankspace.financial.credit.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'reference',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.financial.credit.search.send
										}); 
									}				
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
					
						aHTML.push('<table class="ns1blankspaceControl">');
						
						aHTML.push('<tr><td id="ns1blankspaceControlAppliedTo" class="ns1blankspaceControl">' +
										'Applied To</td></tr>');
											
						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');
													
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
					aHTML.push('<div id="ns1blankspaceMainAppliedTo" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTransaction" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.financial.credit.summary();
					});

					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.financial.credit.details();
					});
					
					$('#ns1blankspaceControlAppliedTo').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAppliedTo', refresh: true});
						ns1blankspace.financial.credit.appliedTo.show();
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
					ns1blankspace.financial.credit.layout();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this credit (note).</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
								
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.reference +
							'<br /><span id="ns1blankspaceControlContext_date" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.creditdate + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_amount" class="ns1blankspaceSub">$' + ns1blankspace.objectContextData.amount + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_tobeapplied" class="ns1blankspaceSub"></span>');
							
						ns1blankspace.financial.credit.refresh();
														
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.financial.credit.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.credit.summary()'});
					}	
				},		

	summary: function (oParam)
				{
					var aHTML = [];
					var bUseTemplate = false;
					
					if (oParam)
					{
						if (oParam.useTemplate != undefined) {bUseTemplate = oParam.useTemplate}
					}

					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the credit (note).</td></tr></table>');
								
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceRow">' +
										'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
										'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:300px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
						
						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');
											
						if (ns1blankspace.objectContextData.contactbusinesstext != '')
						{

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Business</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryBusiness" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.contactbusinesstext +
											'</td></tr>');
						}
						
						if (ns1blankspace.objectContextData.contactpersontext != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Person</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryPerson" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.contactpersontext +
											'</td></tr>');
						}
					
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Credit Date</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryReceivedDate" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.creditdate +
											'</td></tr>');
						
						if (ns1blankspace.objectContextData.notes != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Notes</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryNotes" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.notes +
											'</td></tr>');
						}
						
						aHTML.push('</table>');		

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption" style="padding-bottom:10px;">' +
										ns1blankspace.objectContextData.typetext +
										'</td></tr>');				
				
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));	
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
										'Credit Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsCreditDate" class="ns1blankspaceDate">' +
										'</td></tr>');		

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Business' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsContactBusiness" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_BUSINESS_SEARCH"' +
											' data-columns="tradename">' +
										'</td></tr>');	
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Person' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsContactPerson" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_PERSON_SEARCH"' +
											' data-columns="surname"' +
											' data-parent="ns1blankspaceDetailsContactBusiness"' +
											' data-parent-search-id="contactbusiness"' +
											' data-parent-search-text="tradename">' +
										'</td></tr>');							
								
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
										'Financial Account' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceDetailsFinancialAccount" class="ns1blankspaceSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
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

						ns1blankspace.financial.util.tax.codes({xhtmlElementID: 'ns1blankspaceDetailsTaxCode', id: 1});
						$('[name="radioType"][value="1"]').attr('checked', true);
						$('[name="radioTaxCategory"][value="1"]').attr('checked', true);

						$('[name="radioTaxCategory"]').click(function()
						{
							ns1blankspace.financial.util.tax.codes(
							{
								xhtmlElementID: 'ns1blankspaceDetailsTaxCode',
								id: 1,
								type: (this.id).split('-')[1]
							});

							ns1blankspace.financial.util.tax.calculate(
							{
								amountXHTMLElementID: 'ns1blankspaceDetailsAmount',
								taxXHTMLElementID: 'ns1blankspaceDetailsTax'
							});

							$('[name="radioTaxCode"]').click(function()
							{
								ns1blankspace.financial.util.tax.calculate(
								{
									amountXHTMLElementID: 'ns1blankspaceDetailsAmount',
									taxXHTMLElementID: 'ns1blankspaceDetailsTax'
								});
							});
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
										'Type' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioType1" name="radioType" value="1"/>You owe customer' +
										'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Supplier owes you' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Notes' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="10" cols="35" id="ns1blankspaceDetailsNotes" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');		
										
						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference.formatXHTML());
							$('#ns1blankspaceDetailsCreditDate').val(ns1blankspace.objectContextData.creditdate);
							$('#ns1blankspaceDetailsContactBusiness').attr('data-id', ns1blankspace.objectContextData.contactbusiness);
							$('#ns1blankspaceDetailsContactBusiness').val(ns1blankspace.objectContextData.contactbusinesstext.formatXHTML());
							$('#ns1blankspaceDetailsContactPerson').attr('data-id', ns1blankspace.objectContextData.contactperson);
							$('#ns1blankspaceDetailsContactPerson').val(ns1blankspace.objectContextData.contactpersontext.formatXHTML());	
							$('#ns1blankspaceDetailsAmount').val(ns1blankspace.objectContextData.amount);		
							$('#ns1blankspaceDetailsNotes').val(ns1blankspace.objectContextData.notes);
							$('[name="radioType"][value="' + ns1blankspace.objectContextData.type + '"]').attr('checked', true);
							$('#ns1blankspaceDetailsFinancialAccount').val(ns1blankspace.objectContextData.financialaccounttext.formatXHTML())
							$('#ns1blankspaceDetailsFinancialAccount').attr('data-id', ns1blankspace.objectContextData.financialaccount);
							$('[name="radioTaxCode"][value="' + ns1blankspace.objectContextData.taxtype + '"]').attr('checked', true);
							$('#ns1blankspaceDetailsTax').val(ns1blankspace.objectContextData.tax);
						}
						else
						{
							$('#ns1blankspaceDetailsCreditDate').val(Date.today().toString("dd MMM yyyy"));
							$('[name="radioType"][value="1"]').attr('checked', true);
						}
					}	
				},

	new2:		function (oParam)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspace.financial.credit.init();
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					ns1blankspace.financial.credit.details();
				},		

	save: 		{
					send:		function (oParam, oResponse)
								{
									ns1blankspace.status.working();
									
									var sData = (ns1blankspace.objectContext == -1)?'':'id=' + ns1blankspace.objectContext;
										
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsReference').val());
										sData += '&creditdate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsCreditDate').val());
										sData += '&notes=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsNotes').val());
										sData += '&contactbusiness=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsContactBusiness').attr("data-id"));
										sData += '&contactperson=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsContactPerson').attr("data-id"));
										sData += '&amount=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsAmount').val());
										sData += '&type=' + $('input[name="radioType"]:checked').val();
										sData += '&financialaccount=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFinancialAccount').attr('data-id'));
										sData += '&taxtype=' + $('input[name="radioTaxCode"]:checked').val();
										sData += '&tax=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTax').val());
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_CREDIT_NOTE_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data) {ns1blankspace.financial.credit.save.process(data)}
									});
								},

					process:	function (oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;
										ns1blankspace.inputDetected = false;
										ns1blankspace.financial.credit.search.send('-' + ns1blankspace.objectContext, {source: 1});
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								},

				},				

	appliedTo: 	
				{
					show: 	function (oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.util.getParam(oParam, 'readOnly', {'default': ns1blankspace.objectContext}).value;
									var oOptions = ns1blankspace.util.getParam(oParam, 'options', {'default': {view: true, remove: true}}).value;
									var oActions = ns1blankspace.util.getParam(oParam, 'actions', {'default': {add: true}}).value;
									
									if (oParam == undefined) {oParam = {}}
									if (oOptions.view == undefined) {oOptions.view = true}
									if (oOptions.remove == undefined) {oOptions.remove = true}
									if (oActions.add == undefined) {oActions.add = true}
										
									if (oResponse == undefined)
									{	
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">');
										aHTML.push('<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceAppliedToColumn1" class="ns1blankspaceColumn1Flexible">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspaceAppliedToColumn2" class="ns1blankspaceColumn2" style="width: 200px;"></td>' +
														'</tr>');
										aHTML.push('</table>');					
														
										$('#ns1blankspaceMainAppliedTo').html(aHTML.join(''));
											
										if (oActions.add && ns1blankspace.objectContextData.tobeappliedamount != 0)
										{	
											var aHTML = [];
															
											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											aHTML.push('<tr><td class="ns1blankspaceAction">' +
															'<span id="ns1blankspaceApplyToAdd">Apply</span>' +
															'</td></tr>');

											aHTML.push('</table>');					
											
											$('#ns1blankspaceAppliedToColumn2').html(aHTML.join(''));
										
											$('#ns1blankspaceApplyToAdd').button(
											{
												label: "Apply"
											})
											.click(function()
											{
												 ns1blankspace.financial.credit.appliedTo.edit(oParam);
											})
										}	
										
										var oSearch = new AdvancedSearch();
										
										if (ns1blankspace.objectContextData.type == '1')
										{	
											oSearch.method = 'FINANCIAL_INVOICE_CREDIT_NOTE_SEARCH';
											oSearch.addField('appliesdate,amount,invoicetext,invoice');
										}
										else
										{
											oSearch.method = 'FINANCIAL_EXPENSE_CREDIT_NOTE_SEARCH';
											oSearch.addField('appliesdate,amount,expensetext,expense');
										}

										oSearch.addSummaryField('sum(amount) totalamount');

										oSearch.addFilter('credit', 'EQUAL_TO', iObjectContext);
										oSearch.sort('appliesdate', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.financial.credit.appliedTo.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table class="ns1blankspace">' +
															'<tr><td class="ns1blankspaceNothing">Hasn\'t been applied.</td></tr>' + 
															'</table>');

											$('#ns1blankspaceAppliedToColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceCreditAppliedTo" class="ns1blankspace">');

											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');

											var iID;
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																			
												aHTML.push('<td id="ns1blankspaceCreditAppliedTo_date-' + this.id + '" class="ns1blankspaceRow">' +
																this[(ns1blankspace.objectContextData.type=='1'?'invoice':'expense') + 'text'] + '</td>');

												aHTML.push('<td id="ns1blankspaceCreditAppliedTo_date-' + this.id + '" class="ns1blankspaceRow">' +
																ns1blankspace.util.fd(this.appliesdate) + '</td>');
												
												aHTML.push('<td id="ns1blankspaceCreditAppliedTo_amount-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																this.amount + '</td>');
						
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
																	
												iID = this[(ns1blankspace.objectContextData.type=='1'?'invoice':'expense')];
													
												if (oOptions.remove)
												{			
													aHTML.push('<span id="ns1blankspaceCreditAppliedTo_options_remove-' + this.id + '" class="ns1blankspaceAppliedToRemove"></span>');
												}

												if (oOptions.view)
												{
													aHTML.push('<span id="ns1blankspaceCreditAppliedTo_options_view-' + iID + '" class="ns1blankspaceAppliedToView"></span>');
												}	
													
												aHTML.push('</td></tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceAppliedToColumn1').html(aHTML.join(''));
										
											$('#ns1blankspaceCreditAppliedTo .ns1blankspaceAppliedToRemove').button( {
												text: false,
												icons:
												{
													primary: "ui-icon-close"
												}
											})
											.click(function()
											{
												var sMethod = 'FINANCIAL_' + (ns1blankspace.objectContextData.type == '1'?'INVOICE':'EXPENSE') + '_CREDIT_NOTE_MANAGE';
												
												ns1blankspace.remove(
												{
													xhtmlElementID: this.id,
													method: sMethod,
													ifNoneMessage: 'Not applied.',
													onComplete: ns1blankspace.financial.credit.refresh
												});
											})
											.css('width', '15px')
											.css('height', '17px');
											
											$('#ns1blankspaceCreditAppliedTo .ns1blankspaceAppliedToView').button( {
												text: false,
												icons:
												{
													primary: "ui-icon-play"
												}
											})
											.click(function()
											{
												if (ns1blankspace.objectContextData.type == '1')
												{
													ns1blankspace.financial.invoice.init({id: (this.id).split('-')[1]})
												}
												else
												{
													ns1blankspace.financial.expense.init({id: (this.id).split('-')[1]})
												}	
											})
											.css('width', '15px')
											.css('height', '17px');	
										}
									}	
								},

					edit: 	function(oParam, oResponse)
								{
									if (oResponse === undefined)
									{
										$('#ns1blankspaceAppliedToColumn1').html(ns1blankspace.xhtml.loading);
										$('#ns1blankspaceAppliedToColumn2').html('');

										var oSearch = new AdvancedSearch();

										if (ns1blankspace.objectContextData.type == '1')
										{
											oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
											oSearch.addField('invoice.lineitem.InvoiceOutstandingAmount,reference,sentdate,amount,outstandingamount,tax,invoice.lineitem.id,invoice.lineitem.description,invoice.lineitem.amount,invoice.lineitem.tax');

											if (ns1blankspace.objectContextData.contactbusiness !== '')
												{oSearch.addFilter('contactbusinesssentto', 'EQUAL_TO', ns1blankspace.objectContextData.contactbusiness)};

											if (ns1blankspace.objectContextData.contactperson !== '')
												{oSearch.addFilter('contactpersonsentto', 'EQUAL_TO', ns1blankspace.objectContextData.contactperson)};
										}
										else
										{
											oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
											oSearch.addField('expense.lineitem.ExpenseOutstandingAmount,reference,accrueddate,amount,outstandingamount,tax,expense.lineitem.id,expense.lineitem.description,expense.lineitem.amount,expense.lineitem.tax');

											if (ns1blankspace.objectContextData.contactbusiness !== '')
												{oSearch.addFilter('contactbusinesspaidto', 'EQUAL_TO', ns1blankspace.objectContextData.contactbusiness)};

											if (ns1blankspace.objectContextData.contactperson !== '')
												{oSearch.addFilter('contactpersonpaidto', 'EQUAL_TO', ns1blankspace.objectContextData.contactperson)};
										}	
										
										oSearch.addFilter('outstandingamount', 'NOT_EQUAL_TO', 0);
										oSearch.sort('reference', 'asc');
										oSearch.rows = 200;
										oSearch.getResults(function(data) {ns1blankspace.financial.credit.appliedTo.edit(oParam, data)});
									}
									else
									{
										var aHTML = [];
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table class="ns1blankspace">' +
															'<tr><td class="ns1blankspaceNothing">Nothing to apply this too.</td></tr>' + 
															'</table>');

											$('#ns1blankspaceAppliedToColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceCreditAppliedTo" class="ns1blankspace">');
		
											var sLastReference = '';
											var sReference = '';
											var sObject;

											$.each(oResponse.data.rows, function()
											{
												sObject = (ns1blankspace.objectContextData.type == '1'?'invoice':'expense')

												if (parseInt((this[sObject + '.lineitem.amount']).parseCurrency()) !== 0)
												{	
													sReference = '';

													if (sLastReference != this.reference)
													{
														sReference = this.reference;
														sLastReference = this.reference;

														aHTML.push('<tr class="ns1blankspaceRow">');						
																				
														aHTML.push('<td class="ns1blankspaceRow1" style="font-size:0.875em; width:100px; background-color:#f3f3f3; font-weight:600;">' +
																	sReference + '</td>');

														if (ns1blankspace.objectContextData.type == '1')
														{
															aHTML.push('<td style="font-size:0.875em; background-color:#f3f3f3;">' +
																		this.sentdate + '</td>');
														}
														else
														{
															aHTML.push('<td style="font-size:0.875em; background-color:#f3f3f3;">' +
																		ns1blankspace.util.fd(this.accrueddate) + '</td>');
														}

														aHTML.push('<td style="text-align:right;font-size:0.875em; background-color:#f3f3f3; padding-right:8px;">' +
																		this["outstandingamount"] + '</td>');

														aHTML.push('<td style="width:30px;text-align:right;font-size:0.875em; background-color:#f3f3f3;"></td>');

														aHTML.push('</td></tr>');
													}

													
													aHTML.push('<tr class="ns1blankspaceRow">');
													
													if (ns1blankspace.objectContextData.type == '1')
													{
														aHTML.push('<td colspan=2 id="ns1blankspaceCreditAppliedTo_notes-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																	this["invoice.lineitem.description"] + '</td>');

														aHTML.push('<td id="ns1blankspaceCreditAppliedTo_amount-' + this.id + '"' +
																	' class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' +
																	this["invoice.lineitem.invoiceoutstandingamount"] + '</td>');
													}	
													else	
													{
														aHTML.push('<td colspan=2 id="ns1blankspaceCreditAppliedTo_notes-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																	this["expense.lineitem.description"] + '</td>');

														aHTML.push('<td id="ns1blankspaceCreditAppliedTo_amount-' + this.id + '"' +
																	' class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' +
																	this["expense.lineitem.amount"] + '</td>');
													}

													if (ns1blankspace.objectContextData.tobeappliedamount != 0)
													{	
														var sObject = (ns1blankspace.objectContextData.type == '1'?'invoice':'expense')
														var cOutstandingAmount = _.toNumber(this[sObject + '.lineitem.' + sObject + 'outstandingamount'].replace(',', ''));
														var cAmount = _.toNumber(this[sObject + '.lineitem.amount'].replace(',', ''));
														var cTax = _.toNumber(this[sObject + '.lineitem.tax'].replace(',', ''));
														var cOutstandingTax = cOutstandingAmount * (cTax / cAmount);

														if (cOutstandingTax > ns1blankspace.objectContextData.tobeappliedtax)
														{
															cOutstandingTax = ns1blankspace.objectContextData.tobeappliedtax;
														}

														aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
															
														if (ns1blankspace.objectContextData.type == '1')
														{						
															aHTML.push('<span id="ns1blankspaceCreditAppliedTo_options_select-' + this["invoice.lineitem.id"]  + '"' +
																			' data-amount="' + cOutstandingAmount + '"' +
																			' data-tax="' + cOutstandingTax + '"' +
																			' class="ns1blankspaceAppliedToSelect"></span>');
														}
														else
														{						
															aHTML.push('<span id="ns1blankspaceCreditAppliedTo_options_select-' + this["expense.lineitem.id"]  + '"' +
																			' data-amount="' + cOutstandingAmount + '"' +
																			' data-tax="' + cOutstandingTax + '"' +
																			' class="ns1blankspaceAppliedToSelect"></span>');
														}

														aHTML.push('</td>');
													}	

													aHTML.push('</tr>');
												}	
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceAppliedToColumn1').html(aHTML.join(''));

											$('.ns1blankspaceAppliedToSelect').button(
											{
												text: false,
												label: "Apply",
												icons:
												{
													 primary: "ui-icon-check"
												}
											})
											.click(function()
											{	
												var sMethod = 'FINANCIAL_INVOICE_CREDIT_NOTE_MANAGE'
												var sXHTMLElementID = this.id;

												if (ns1blankspace.objectContextData.type == '2')
												{
													sMethod = 'FINANCIAL_EXPENSE_CREDIT_NOTE_MANAGE'
												}

												var cAmount = accounting.unformat($(this).attr("data-amount"));
												if (cAmount > ns1blankspace.objectContextData.tobeappliedamount)
														{cAmount = ns1blankspace.objectContextData.tobeappliedamount}

												var cTax = accounting.unformat($(this).attr("data-tax"));
												if (cTax > ns1blankspace.objectContextData.tobeappliedtax)
														{cTax = ns1blankspace.objectContextData.tobeappliedtax}

												var oData =
												{
													lineitem: ns1blankspace.util.getID(this.id),
													credit: ns1blankspace.objectContext,
													amount: cAmount,
													tax: cTax
												}	

												if (cAmount !=0 || cTax !=0)
												{	
													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI(sMethod),
														data: oData,
														dataType: 'json',
														success: function(oResponse)
														{
															$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
															ns1blankspace.financial.credit.refresh();
															ns1blankspace.financial.credit.appliedTo.show();
														}
													});
												}	
												
											})
											.css('width', '15px')
											.css('height', '20px');
										}	
									}	
								}			
				}				
}				