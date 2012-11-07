/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.financial.init = function (oParam)
					{
						var bShowHome = true
						
						if (oParam != undefined)
						{
							if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
						}

						ns1blankspace.object = -1;
						ns1blankspace.objectContextData = undefined;
						ns1blankspace.objectParentName = undefined;
						ns1blankspace.objectName = 'Financials';
						ns1blankspace.objectContext = -1;
						
						interfaceFinancialMasterInitialise();
						
						if (bShowHome)
						{
							ns1blankspaceViewportDestination({
								newDestination: 'interfaceFinancialMasterViewport({showHome: true});',
								move: false
								})		
						}	
								
						ns1blankspaceReset();
						
						$('#divns1blankspaceViewportControlSet').button(
						{
							label: "Financials"
						});
						
						$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
						{
							if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
					        ns1blankspace.timer.delayCurrent = setTimeout("interfaceFinancialSearch('inputns1blankspaceViewportControlSearch')", ns1blankspace.option.typingWait);
						});
						
						$('#spanns1blankspaceViewportControlSearch').click(function(event)
						{
							interfaceFinancialSearch('inputns1blankspaceViewportControlSearch');
						});
						
						$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
						{
							interfaceFinancialSearchOptions();
						});
						
						$('#spanns1blankspaceViewportControlNew').click(function(event)
						{
							interfaceFinancialNew();
						})
						
						$('#spanns1blankspaceViewportControlNewOptions').click(function(event)
						{
							interfaceFinancialNewOptions();
						});
						
						$('#spanns1blankspaceViewportControlAction').click(function(event)
						{
							interfaceFinancialSave();
						});
						
						$('#spanns1blankspaceViewportControlActionOptions').click(function(event)
						{
							interfaceFinancialSaveOptions();
						});
						
						$('#spanns1blankspaceViewportControlSetup').click(function(event)
						{
							interfaceFinancialSetup();
						});
						
						$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
						{
							interfaceFinancialSetupOptions();
						});
						
						$('#spanns1blankspaceViewportControlHelp').click(function(event)
						{
							interfaceFinancialHelp();
						});
						
						$('#spanns1blankspaceViewportControlHelpOptions').click(function(event)
						{
							interfaceFinancialHelpOptions();
						});
						
						$('td.interfaceViewportMasterControlBrowse').click(function(event)
						{
							interfaceFinancialSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
						});
						
						$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
						{
							interfaceFinancialSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
						});
						
						if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
						if (bShowHome) {interfaceFinancialHomeShow()};	
					}

ns1blankspace.financial.initData = function (oParam, oResponse)
					{
						var bRefresh = false;
						var iStep = 0;
						
						if (oParam != undefined)
						{
							if (oParam.refresh != undefined) {bRefresh = oParam.refresh}
							if (oParam.step != undefined) {iStep = oParam.step}
						}

						if (ns1blankspace.financial == undefined)
						{
							ns1blankspaceStatusWorking();	
							ns1blankspace.financial = {};
							ns1blankspace.financial.status = 1;
						}
						
						if (iStep == 0)
						{
							if (oResponse == undefined)
							{
								$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
								ns1blankspaceStatus(ns1blankspace.xhtml.loadingSmall + ' initalising.')

								if (ns1blankspace.financial.init == undefined || bRefresh)
								{
									$.ajax(
									{
										type: 'GET',
										url: '/ondemand/setup/setup.asp?method=SETUP_FINANCIAL_SETTINGS_MANAGE&setdefault=1',
										dataType: 'json',
										async: false,
										success: function(data) {interfaceFinancialMasterInitialise(oParam, data)}
									});
								}
							}
							else
							{
								ns1blankspace.financial.init = 1;
								interfaceFinancialMasterInitialise($.extend(true, oParam, {step: 1}))
							}
						}

						if (iStep == 1)
						{
							if (oResponse == undefined)
							{
								if (ns1blankspace.financial.bankaccounts == undefined || bRefresh)
								{
									var oSearch = new AdvancedSearch();
									oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
									oSearch.addField('title,lastreconciledamount,lastreconcileddate,notes');
									oSearch.rows = 100;
									oSearch.async = false;
									oSearch.getResults(function(data) {interfaceFinancialMasterInitialise(oParam, data)});
								}
							}
							else
							{
								ns1blankspace.financial.bankaccounts = oResponse.data.rows;
								interfaceFinancialMasterInitialise($.extend(true, oParam, {step: 2}))
							}
						}
						
						if (iStep == 2)
						{
							if (oResponse == undefined)
							{
								if (ns1blankspace.financial.settings == undefined || bRefresh)
								{
									$.ajax(
									{
										type: 'GET',
										url: '/ondemand/setup/setup.asp?method=SETUP_FINANCIAL_SETTINGS_SEARCH&all=1&includefinancialaccounttext=1',
										dataType: 'json',
										async: false,
										success: function(data) {interfaceFinancialMasterInitialise(oParam, data)}
									});
								}
							}
							else
							{
								ns1blankspace.financial.settings = oResponse;
								//interfaceFinancialMasterInitialise($.extend(true, oParam, {step: 3}))
							}
						}
						
						if (iStep == 3)
						{
							if (oResponse == undefined)
							{
								if (ns1blankspace.financial.accounts == undefined || bRefresh)
								{
									var oSearch = new AdvancedSearch();
									oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
									oSearch.addField('title');
									oSearch.addFilter('parentaccount', 'EQUAL_TO', ns1blankspace.financial.rootAccount);
									oSearch.sort('parentaccount', 'asc')
									oSearch.getResults(function(data) {interfaceFinancialMasterInitialise(oParam, data)})	

									$.ajax(
									{
										type: 'GET',
										url: '/ondemand/setup/setup.asp?method=SETUP_FINANCIAL_ACCOUNTS_SEARCH&all=1&includefinancialaccounttext=1',
										dataType: 'json',
										async: false,
										success: function(data) {interfaceFinancialMasterInitialise(oParam, data)}
									});
								}
							}
							else
							{
								ns1blankspace.financial.accounts = oResponse.data.rows;
								ns1blankspace.financial.accountsTree = intefaceSetupFinancialAccountsTree(ns1blankspace.financial.accounts[ns1blankspace.financial.rootaccount],ns1blankspace.financial.accounts); 
								ns1blankspace.financial.status = 2;
							}
						}

						ns1blankspaceStatus('&nbsp;');
					}

ns1blankspace.financial.showHome = function interfaceFinancialHomeShow()
					{	
						var aHTML = [];
						
						aHTML.push('<table id="tableInterfaceViewportMain" class="interfaceViewportMain">');
						aHTML.push('<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
										'<td id="tdInterfaceProjectHomeMostLikely" class="interfaceViewportMain">' +
										ns1blankspace.xhtml.loading + 
										'</td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						var aHTML = [];
									
						aHTML.push('<table>');
						aHTML.push('<tr><td id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');
						aHTML.push('</table>');		
						
						aHTML.push('<table>');
						
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="tns1blankspaceControlSummary" class="ns1blankspaceControl">Summary</td>' +
									'</tr>');	
						
						aHTML.push('<tr class="interfaceViewportControl">' +
									'<td id="ns1blankspaceControlBankAccount" class="ns1blankspaceControl">Bank Accounts</td>' +
									'</tr>');	
						
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlDebtors" class="ns1blankspaceControl">Debtors</td>' +
									'</tr>');	
						
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlCreditors" class="ns1blankspaceControl">Creditors</td>' +
									'</tr>');	
						
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlPL" class="ns1blankspaceControl">Profit & Loss</td>' +
									'</tr>');	
						
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlBS" class="ns1blankspaceControl">Balance Sheet</td>' +
									'</tr>');	
						
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlAccounts" class="ns1blankspaceControl">Accounts</td>' +
									'</tr>');
									
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlUnallocated" class="ns1blankspaceControl">Unallocated</td>' +
									'</tr>');	
									
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						var aHTML = [];
						var h = -1;
						
						aHTML[++h] = '<div id="ns1blankspaceMainSummary" class="ns1blankspaceViewportMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainBankAccount" class="ns1blankspaceViewportMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainDebtors" class="ns1blankspaceViewportMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainCreditors" class="ns1blankspaceViewportMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainPL" class="ns1blankspaceViewportMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainBS" class="ns1blankspaceViewportMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainAccounts" class="ns1blankspaceViewportMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainUnallocated" class="ns1blankspaceViewportMain"></div>';
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						$('#ns1blankspaceControlSummary').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
							ns1blankspace.financial.summary.show();
						});
						
						$('#ns1blankspaceControlBankAccount').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainBankAccount'});
							ns1blankspace.financial.bankaccounts.show();
						});	
						
						$('#ns1blankspaceControlDebtors').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainDebtors'});
							ns1blankspace.financial.debtors.show()();
						});	
							
						$('#ns1blankspaceControlCreditors').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainCreditors'});
							ns1blankspace.financial.creditors.show()();
						});	
						
						$('#ns1blankspaceControlPL').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainPL'});
							ns1blankspace.financial.profitLoss.show()();
						});	
						
						$('#ns1blankspaceControlBS').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainBS'});
							ins1blankspace.financial.balancesheet.show();
						});	
						
						$('#ns1blankspaceControlAccounts').click(function(event)
						{
							nns1blankspace.show({selector: '#ns1blankspaceMainAccounts'});
							ns1blankspace.financial.accounts.show()();
						});	
						
						$('#ns1blankspaceControlUnallocated').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainUnallocated'});
							ns1blankspace.financial.unallocated.show();
						});	
						
						$('#ns1blankspaceControlSummary').addClass('interfaceViewportControlHighlight');
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.financial.summary.show();
					}

ns1blankspace.financial.summary = function (oParam, oResponse)
				{
					if (ns1blankspace.financial.data == undefined) {ns1blankspace.financial.data = {}}
						
					if (oResponse == undefined)
					{
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('FINANCIAL_PROFIT_LOSS_SEARCH'),
							data: 'rows=1',
							dataType: 'json',
							success: function(data) {ns1blankspace.financial.summary(oParam, data)}
						});
					}
					else
					{
						ns1blankspace.financial.data.summary = oResponse;
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large">' +
										'</td>' +
										'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:100px;">' +
										'</td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
						
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Sales</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryTotalSales" class="ns1blankspaceSummary">' +	
										(oResponse.TotalSales).formatMoney(2, '.', ',') +
										'</td></tr>');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Cost of Sales</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryTotalCostOfSales" class="ns1blankspaceSummary">' +
										(oResponse.TotalCostOfSales).formatMoney(2, '.', ',') +
										'</td></tr>');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Gross Margin</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryGrossMargin" class="ns1blankspaceSummary">' +
										(oResponse.GrossMargin).formatMoney(2, '.', ',') +
										'</td></tr>');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Operating Expenses</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryTotalOperationalExpenses" class="ns1blankspaceSummary">' +
										(oResponse.TotalOperationalExpenses).formatMoney(2, '.', ',') +
										'</td></tr>');
										
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Net Margin</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryNetMargin" class="ns1blankspaceSummary">' +
										(oResponse.NetMargin).formatMoney(2, '.', ',') +
										'</td></tr>');			
							
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''))
					}
				}

ns1blankspace.financial.debtors =
{
	show: 		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('FINANCIAL_DEBTOR_SEARCH'),
							dataType: 'json',
							success: function(data) {ns1blankspace.financial.debtors(oParam, data)}
						});			
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table><tbody>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceNothing">Good news and band news, in that no debtors.  So good that no one owes you money, but bad in that no one owes you money.</td>' +
											'</tr>' +
											'</tbody></table>');
						}
						else
						{
							aHTML.push('<table class="ns1blankspace">' +
											'<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">Debtor</td>' +
											'<td class="ns1blankspaceCaption" style="text-align:right;">Amount Owed</td>' +
											'<td class="ns1blankspaceCaption" style="text-align:right;color:#A0A0A0;">Last Receipt Date</td>' +
											'<td class="ns1blankspaceCaption" style="text-align:right;color:#A0A0A0;">Last Receipt Amount</td>' +
											'<td class="ns1blankspaceCaption">&nbsp;</td>' +
											'</tr>');
							
							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.financial.debtors.row(this));
							});
							
							aHTML.push('</table>');
						}
						
						ns1blankspace.pagination.list(
						   {
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceDebtors',
							xhtmlContext: 'Debtors',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: ns1blankspace.option.defaultRows,
							functionShowRow: ns1blankspace.financial.debtors.row,
							functionOpen: undefined,
							functionNewPage: ''
						   }); 	
					}
				},

	row: 		function (oRow)
				{
					var aHTML = [];

					aHTML.push('<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceDebtors_Contact-" class="ns1blankspaceRow">' +
									oRow.debtorname + '</td>' +
									'<td id="ns1blankspaceDebtors_Total-" class="ns1blankspaceRow" style="text-align:right;">' +
									oRow.total + '</td>' +
									'<td id="ns1blankspaceDebtors_LastReceiptDate-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
									oRow.lastreceiptdate + '</td>' +				
									'<td id="ns1blankspaceDebtors_LastReceiptAmount-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
									oRow.lastreceiptamount + '</td>' +				
									'</tr>');
					
					return aHTML.join('');
				}
}

ns1blankspace.financial.creditors =				
{
	show:		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{				
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('FINANCIAL_CREDITOR_SEARCH'),
							dataType: 'json',
							success: function(data) {ns1blankspace.financial.creditors.show(oParam, data)}
						});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table><tbody>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceNothing">You don\'t owe anyone any money.</td>' +
											'</tr>' +
											'</tbody></table>');
						}
						else
						{
							aHTML.push('<table class="ns1blankspace">' +
											'<tbody>' +
											'<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">Creditor</td>' +
											'<td class="ns1blankspaceCaption" style="text-align:right;">Amount To Be Paid</td>' +
											'<td class="ns1blankspaceCaption" style="text-align:right;color:#A0A0A0;">Last Payment Date</td>' +
											'<td class="ns1blankspaceCaption" style="text-align:right;color:#A0A0A0;">Last Payment Amoun</td>' +
											'<td class="ns1blankspaceCaption">&nbsp;</td>' +
											'</tr>');	
							
							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.financial.creditors.row(this));
							});
							
							aHTML.push('</tbody></table>');
						}
						
						ns1blankspace.pagination.list(
						   {
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceCreditors',
							xhtmlContext: 'Creditors',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: ns1blankspace.option.defaultRows,
							functionShowRow: ns1blankspace.financial.creditors.row,
							functionOpen: undefined,
							functionNewPage: ''
						   }); 	
					}
				},

	row:		function (oRow)
				{
					var aHTML = [];

					aHTML.push('<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceDebtors_Contact-" class="ns1blankspaceRow">' +
									oRow.creditorname + '</td>' +
									'<td id="ns1blankspaceDebtors_Total-" class="ns1blankspaceRow" style="text-align:right;">' +
									oRow.total + '</td>' +
									'<td id="ns1blankspaceDebtors_LastPaymentDate-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
									oRow.lastpaymentdate + '</td>' +				
									'<td id="ns1blankspaceDebtors_LastPaymentAmount-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
									oRow.lastpaymentamount + '</td>' +				
									'</tr>');

					return aHTML.join('');
				}
}

ns1blankspace.financial.profitLoss =
{
	show: 		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{		
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PROFIT_LOSS_SEARCH';
						oSearch.addField('financialaccounttext,total,percentage');
						oSearch.sort('financialaccounttext', 'asc');
						oSearch.rows = ns1blankspace.messaging.defaultRows;
						oSearch.getResults(function(data) {ns1blankspace.financial.profitLoss.show(oParam, data)});
					}
					else
					{
						var aHTML = [];

						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table><tbody>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceNothing">Sorry nothing to show, add an invoice or expense<br />and you will be able to see how you are going.</td>' +
											'</tr>' +
											'</tbody></table>');
						}
						else
						{
						
							aHTML.push('<table class="ns1blankspace">' +
											'<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">Account</td>' +
											'<td class="ns1blankspaceCaption" style="text-align:right;">Amount</td>' +
											'<td class="ns1blankspaceCaption" style="text-align:right;color:#A0A0A0;">Percentage</td>' +
											'<td class="ns1blankspaceCaption">&nbsp;</td>' +
											'</tr>');	
							
							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.financial.profitLoss.row(this));
							});
							
							aHTML.push('</table>');
						}
						
						ns1blankspace.pagination.list(
						   {
							type: 'JSON',
							xhtmlElementID: 'ns1blankspacePL',
							xhtmlContext: 'Creditors',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.financial.profitLoss.row,
							functionOpen: undefined,
							functionNewPage: ''
						   }); 	
					}
				},

	row:		function (oRow)
				{
					var aHTML = [];

					aHTML.push('<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceDebtors_Contact-" class="ns1blankspaceRow">' +
									oRow.financialaccounttext + '</td>' +
									'<td id="ns1blankspaceDebtors_Total-" class="ns1blankspaceRow" style="text-align:right;">' +
									oRow.total + '</td>' +
									'<td id="ns1blankspaceDebtors_Percentage-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
									oRow.percentage + '</td>' +							
									'</tr>');

					return aHTML.join('');
				}
}

ns1blankspace.financial.balanceSheet =
{
	show: 		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{	
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_BALANCE_SHEET_SEARCH';
						oSearch.addField('financialaccounttext,amount,subtotalcount,type');
						oSearch.sort('financialaccounttext', 'asc');
						oSearch.rows = 100;
						oSearch.getResults(function(data) {ns1blankspace.financial.balanceSheet.show(oParam, data)});	
					}
					else
					{
						var aHTML = [];
						var h = -1;
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table><tbody>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceNothing">Sorry nothing to show, add an invoice or expense<br />and you will be able to see how you are going.</td>' +
											'</tr>' +
											'</tbody></table>');

							$('#ns1blankspaceMainBS').html(aHTML.join(''));
						}
						else
						{
							aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceBalanceSheetColumn1" class="ns1blankspaceColumn1" style="width: 70px;">' +
										'</td>' +
										'<td id="ns1blankspaceBalanceSheetColumn2" class="ns1blankspaceColumn2">' +
										'</td>' +
										'</tr>' +
										'</table>');	

							$('#ns1blankspaceMainBS').html(aHTML.join(''));
						
							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspaceContainer">' +
											'<tr><td class="ns1blankspaceSummaryCaption">Assets</td></tr>' +
											'<tr><td id="ns1blankspaceBalanceSheetAssetTotal" class="ns1blankspaceSummary">' +	
											(oResponse.assettotal).formatMoney(2, '.', ',') +
											'</td></tr>' +
											'<tr><td class="ns1blankspaceSummaryCaption">Liabilities</td></tr>' +
											'<tr><td id="ns1blankspaceBalanceSheetLiabilityTotal" class="ns1blankspaceSummary">' +
											(oResponse.liabilitytotal).formatMoney(2, '.', ',') +
											'</td></tr>' +
											'<tr><td class="ns1blankspaceSummaryCaption">Equity</td></tr>' +
											'<tr><td id="ns1blankspaceBalanceSheetEquityTotal" class="ns1blankspaceSummary">' +
											(oResponse.equitytotal).formatMoney(2, '.', ',') +
											'</td></tr>');

							aHTML.push('</table>');							
							
							$('#ns1blankspaceBalanceSheetColumn1').html(aHTML.join(''));
						
							var aHTML = [];
							
							aHTML[++h] = '</tbody></table>';

							aHTML.push('<table class="ns1blankspace">' +
											'<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">Account</td>' +
											'<td class="ns1blankspaceCaption" style="text-align:right;">Amount</td>' +
											'<td class="ns1blankspaceCaption">&nbsp;</td>' +
											'</tr>');	
							
							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.financial.balancesheet.row(this));
							});
							
							aHTML.push('</table>');
						}
						
						ns1blankspace.pagination.list(
						   {
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceBalanceSheetColumn2',
							xhtmlContext: 'BalanceSheet',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.financial.balancesheet.row,
							functionOpen: undefined,
							functionNewPage: ''
						   }); 	
					}
				},

	row:		function (oRow)
				{
					var aHTML = [];

					aHTML.push('<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceDebtors_AccountText-" class="ns1blankspaceRow">' +
									oRow.financialaccounttext + '</td>' +
									'<td id="ns1blankspaceDebtors_Amount-" class="ns1blankspaceRow" style="text-align:right;">' +
									oRow.amount + '</td>' + 						
									'</tr>');

					return aHTML.join('');
				}
}

ns1blankspace.financial.bankAccounts =
{
	show: 		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
						oSearch.addField('title,lastreconciledamount,lastreconcileddate,notes');
						oSearch.sort('title', 'asc');
						oSearch.rows = ns1blankspace.option.defaultRows;
						oSearch.getResults(function(data) {interfaceFinancialBankAccount(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceBankAccountsColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceBankAccountsColumn2" class="ns1blankspaceColumn2" style="width: 150px;"></td>' +
										'</tr>' +
										'</table>');	

						$('#ns1blankspaceMainBankAccount').html(aHTML.join(''));
						
						var aHTML = [];
					
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table><tbody>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceNothing">No bank accounts set up.</td>' +
											'</tr>' +
											'</tbody></table>');
						}
						else
						{		
							aHTML.push('<table class="ns1blankspace">' +
											'<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">Name</td>' +
											'<td class="ns1blankspaceCaption" style="text-align:right;">Reconciled Amount</td>' +
											'<td class="ns1blankspaceCaption" style="text-align:right;">Last Reconciled</td>' +
											'<td class="ns1blankspaceCaption">&nbsp;</td>' +
											'</tr>');	
							
							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.financial.bankaccounts.row(this));
							});
							
							aHTML.push('</table>');
						}
						
						ns1blankspacePaginationList(
						   {
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceBankAccountsColumn1',
							xhtmlContext: 'BankAccount',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.financial.bankaccounts.row,
							functionOpen: undefined,
							functionNewPage: ''
						   });
						
						var aHTML = [];
						var h = -1;	
						
						aHTML[++h] = '<table class="ns1blankspace" cellpadding=6>';
											
						aHTML[++h] = '<tr><td class="ns1blankspace" style="width:175px;">' +
										'<a href="#" id="ns1blankspaceBankAccountReco">Reconcile & Import Transactions</a>' +
										'</td></tr>';
										
						aHTML[++h] = '<tr><td class="ns1blankspace" style="width:175px;">' +
										'<a href="#" id="ns1blankspaceBankAccountReceipt">Receipt an Invoice</a>' +
										'</td></tr>';
										
						aHTML[++h] = '<tr><td class="ns1blankspace" style="width:175px;">' +
										'<a href="#" id="ns1blankspaceBankAccountDeposit">Bulk Deposit</a>' +
										'</td></tr>';								
									
						aHTML[++h] = '</table>';					
								
						$('#ns1blankspaceBankAccountsColumn2').html(aHTML.join(''));
						
						$('#ns1blankspaceBankAccountReco').click(function()
						{
							ns1blankspace.financial.bankaccount.init();
						});	
						
						$('#ns1blankspaceBankAccountReceipt').click(function()
						{
							ns1blankspace.financial.receipt.init();
						});	
						
						$('#ans1blankspaceBankAccountDeposit').click(function()
						{
							alert("Depositing of the sweet sweet cash...")
						});	
					}
				},

	row:		function (oRow)
				{
					var aHTML = [];
					
					aHTML.push('<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceBalanceSheet_Title-" class="ns1blankspaceRow" title="' + oRow.notes + '">' +
									oRow.title + '</td>' +
									'<td id="ns1blankspaceBalanceSheet_Balance-" class="ns1blankspaceRow" style="text-align:right;">' +
									oRow.lastreconciledamount + '</td>' +
									'<td id="ns1blankspaceBalanceSheet_Date-" class="ns1blankspaceRow" style="text-align:right;">' +
									oRow.lastreconcileddate + '</td>' +					
									'</tr>');

					return aHTML.join('');
				}
}

ns1blankspace.financial.unallocated =
{
	show: 		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						if (ns1blankspace.financial.unallocatedAccount == undefined)
						{	
							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
							oSearch.addField('title');
							oSearch.addFilter('title', 'TEXT_IS_LIKE', 'Unallocated');
							oSearch.async = false;
							oSearch.rows = 1;
							
							oSearch.getResults(function(oResponse)
							{
								if (oResponse.data.rows.length != 0)
								{
									ns1blankspace.financial.unallocatedAccount = oResponse.data.rows[0].id;
								}
								else
								{
									ns1blankspace.financial.unallocatedAccount = -1;
								}	
							});	
						}
							
						if (ns1blankspace.financial.unallocatedAccount == -1)
						{
							$('#ns1blankspaceMainUnallocated').html("No unallocated account set up.");
						}
						else
						{	
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
							oSearch.addField('invoice.reference,invoice.amount');
							oSearch.addFilter('invoice.lineitem.financialaccount', 'EQUAL_TO', ns1blankspace.financial.unallocatedAccount);
							oSearch.rows = 20;
							oSearch.getResults(function(data) {ns1blankspace.financial.unallocated.show(oParam, data)});
						}	
					}
					else
					{
						var aHTML = [];
			
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceUnallocatedColumn1" class="ns1blankspaceColumn1" style="width: 70px"></td>' +
										'<td id="ns1blankspaceUnallocatedColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' +
										'</table>');	

						$('#ns1blankspaceMainUnallocated').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table><tbody>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceNothing">No unallocated accounts.</td>' +
											'</tr>' +
											'</tbody></table>');
						}
						else
						{
							aHTML.push('<table class="ns1blankspace">' +
											'<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">Invoice</td>' +
											'</tr>');

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.financial.unallocated.row(this));
							});
							
							aHTML.push('</table>');
						}
						
						ns1blankspace.pagination.list(
						   {
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceUnallocatedColumn1',
							xhtmlContext: 'Unallocated',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.financial.unallocated.row,
							functionOpen: undefined,
							functionNewPage: ''
						   }); 	
					}
				},

	row:		function (oRow)
				{
					var aHTML = [];
					
					aHTML.push('<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceBalanceSheet_Title-' + oRow["invoice.id"] + '" class="ns1blankspaceRow">' +
									oRow["invoice.reference"] + '<br />' + 
									'<span style="color: #808080;font-size: 0.75em;">' + oRow["invoice.amount"] + '</span>' +
									'</td></tr>');

					return aHTML.join('');
				}
}

ns1blankspace.financial.transactions =
{
	show: 		function (oParam, oResponse)
				{
					var iObject = ns1blankspace.object;
					var iObjectContext = ns1blankspace.objectContext;
					var sXHTMLElementID = 'ns1blankspaceMainTransaction';

					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}		
						
					if (oResponse == undefined)
					{			
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
						oSearch.addField('financialaccounttext,amount,date,description');
						oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
						oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
						oSearch.sort('financialaccounttext', 'asc');
						
						oSearch.getResults(function(data) {ns1blankspace.financial.transactions.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table><tbody>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceNothing">No financial transactions.</td>' +
											'</tr>' +
											'</tbody></table>');

							$('#' + sXHTMLElementID).html(aHTML.join(''));
						}
						else
						{
							aHTML.push('<table class="ns1blankspace">' +
											'<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption" style="width:150px;">Account</td>' +
											'<td class="ns1blankspaceCaption" style="width:100px;">Reconciled Amount</td>' +
											'<td class="ns1blankspaceCaption" style="text-align:right;width:125px;">Last Reconciled</td>' +
											'<td class="ns1blankspaceCaption">Description</td>' +
											'<td class="ns1blankspaceCaption">&nbsp;</td>' +
											'</tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="interfaceMainRow">');
												
								aHTML.push('<td id="tdFinancialTransaction_financialaccounttext-' + this.id + '" class="interfaceMainRow">' +
														this.financialaccounttext + '</td>');
														
								aHTML.push('<td id="tdFinancialTransaction_date-' + this.id + '" class="interfaceMainRow">' +
														this.date + '</td>');
														
								aHTML.push('<td id="tdFinancialTransaction_amount-' + this.id + '" style="text-align:right;" class="interfaceMainRow">' +
														this.amount + '</td>');
									
								aHTML.push('<td id="tdFinancialTransaction_description-' + this.id + '" class="interfaceMainRow">' +
														this.description + '</td>');
																				
								aHTML.push('</td></tr>');
							});
							
							aHTML.push('</table>');

							$('#' + sXHTMLElementId).html(aHTML.join(''));
						}
					}	
				}
}

ns1blankspace.financial.accounts =
{
	show: 		function (oParam, oResponse)
				{
					var iStep = 1;
					var iFinancialAccount = -1;
					
					if (oParam != undefined)
					{
						if (oParam.step != undefined) {iStep = oParam.step};
						if (oParam.financialAccount != undefined) {iFinancialAccount = oParam.financialAccount};
					}
					else
					{
						oParam = {};
					}
					
					if (iStep == 1)	
					{
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceAccountColumn1" class="ns1blankspaceColumn1" style="width:100px;font-size:0.75em;"></td>' +
										'<td id="ns1blankspaceAccountColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainAccounts').html(aHTML.join(''));
							
						var aHTML = [];

						aHTML.push('<div id="ns1blankspaceAccountColumnCategory" style="width: 100;margin-bottom:3px;text-align:right;">');
						aHTML.push('<input type="radio" id="ns1blankspaceBankAccountColumnCategory-1" name="radioCategory" /><label for="ns1blankspaceBankAccountColumnCategory-1" style="width: 100px;">All</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceBankAccountColumnCategory-2" name="radioCategory" /><label for="ns1blankspaceBankAccountColumnCategory-2" style="width: 100px;">Profit & Loss</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceBankAccountColumnCategory-3" name="radioCategory" /><label for="ns1blankspaceBankAccountColumnCategory-3" style="width: 100px;">Balance Sheet</label>');
						aHTML.push('</div>');

						$('#ns1blankspaceAccountColumn1').html(aHTML.join(''));
					
						$('#ns1blankspaceAccountColumnCategory').buttonset().css('font-size', '0.875em');
						
						$('#ns1blankspaceAccountColumnCategory :radio').click(function()
						{
							var aID = (event.target.id).split('-');
							$.extend(true, oParam, {step: 2, category: parseInt(aID[1])});
							ns1blankspace.financial.accounts.show(oParam);
						});
					}
					
					if (iStep == 2)
					{	
						if (oResponse == undefined)
						{	
							$('#ns1blankspaceAccountColumn2').html(ns1blankspace.xhtml.loadingSmall);
							
							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
							oSearch.addField('title');
							oSearch.sort('title', 'asc');
							//oSearch.addFilter('type', 'EQUAL_TO', iType);
							oSearch.rows = 200;
							oSearch.getResults(function(data) {ns1blankspace.financial.accounts.show(oParam, data)});	
						}
						else
						{
							$.extend(true, oParam, {step: 3});
							
							var aHTML = [];
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<table><tbody>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceNothing">No accounts.</td>' +
											'</tr>' +
											'</tbody></table>');
								
								$('#ns1blankspaceAccountColumn2').html(aHTML.join(''));
							}
							else
							{
								aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceAccountTransactionsColumn1" class="ns1blankspaceColumn1" style="width: 70px;font-size:0.875em;"></td>' +
										'<td id="ns1blankspaceAccountTransactionsColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' +
										'</table>');

								$('#ns1blankspaceAccountColumn2').html(aHTML.join(''));
						
								var aHTML = [];
								
								aHTML.push('<table id="ns1blankspaceReco" class="ns1blankspace"><tbody>');
							
								$(oResponse.data.rows).each(function(i) 
								{
									if (i==0)
									{
										aHTML.push('<tr><td style="font-size:0.75em;"><span id="ns1blankspaceAccountTransactionsAll">All</span></td></tr>');	
									}
								
									aHTML.push('<tr><td id="ns1blankspaceAccountTransactions_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceFinancialAccountRowSelect"' +
													'>' + this.title + '</td></tr>');
								});
							
								aHTML.push('</table>');
							
								$('#tdInterfaceMainFinancialAccountTransactionsColumn1').html(aHTML.join(''));
								
								$('#ns1blankspaceAccountTransactionsAll').button(
								{
									label: "All"
								})
								.click(function() {
										$.extend(true, oParam, {step: 3, financialAccount: -1});
										ns1blankspace.financial.accounts.show(oParam);
								})
								.css("width", "75px");
								
								$('.s1blankspaceFinancialAccountRowSelect').click(function() {
										var aID = (event.target.id).split('-');
										$.extend(true, oParam, {step: 3, financialAccount: parseInt(aID[1])});
										ns1blankspace.financial.accounts.show(oParam);
								});
							}
							
						}
					}
					
					if (iStep == 3)
					{	
						if (oResponse == undefined)
						{	
							$('#ns1blankspaceAccountTransactionsColumn2').html(ns1blankspace.xhtml.loadingSmall);
							
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
							oSearch.addField('date,description,amount');
							oSearch.addSummaryField('sum(amount) sumamount');
							oSearch.sort('date', 'desc');
							if (iFinancialAccount != -1) {oSearch.addFilter('financialaccount', 'EQUAL_TO', iFinancialAccount)};
							oSearch.rows = 200;
							oSearch.getResults(function(data) {ns1blankspace.financial.accounts.show(oParam, data)});	
						}
						else
						{
							$.extend(true, oParam, {step: 3});
							
							var aHTML = [];
							var h = -1;
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<table><tbody>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceNothing">No transactions.</td>' +
											'</tr>' +
											'</tbody></table>');
								
								$('#ns1blankspaceAccountTransactionsColumn2').html(aHTML.join(''));
							}
							else
							{
								var aHTML = [];
						
								aHTML.push('<table class="ns1blankspace">');
							
								aHTML.push('<tr class="ns1blankspaceCaption">');
								aHTML.push('<td class="ns1blankspaceCaption">TOTAL</td>');
								aHTML.push('<td class="ns1blankspaceCaption">&nbsp;</td>');
								aHTML.push('<td class="ns1blankspaceCaption" style="text-align:right;">' + oResponse.summary.sumamount + '</td>');
								aHTML.push('</tr>');
								
								$(oResponse.data.rows).each(function(i) 
								{
									aHTML.push('<tr><td id="ns1blankspaceFinancialAccountTransactions_date-' + this.id + '" class="ns1blankspaceMainRow ns1blankspaceRowSelect"' +
													'>' + this.date + '</td>');
									
									aHTML.push('<td id="ns1blankspaceFinancialAccountTransactions_description-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
													'>' + this.description + '</td>');
													
									aHTML.push('<td id="ns1blankspaceFinancialAccountTransactions_amount-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSelect"' +
													' style="text-align:right;">' + this.amount + '</td>');				
																	
									aHTML.push('</tr>');
								});
							
								aHTML.push('</table>');
							
								$('#ns1blankspaceAccountTransactionsColumn2').html(aHTML.join(''));		
							}
							
						}
					}
				}
}				
