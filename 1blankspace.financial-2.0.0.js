/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.financial.init = function (oParam)
					{
						var bInitialised = false;

						if (oParam != undefined)
						{
							if (oParam.initialised != undefined) {bInitialised = oParam.initialised}
						}

						ns1blankspace.app.reset();

						ns1blankspace.object = -1;
						ns1blankspace.objectName = 'financial';
						ns1blankspace.viewName = 'Financials';

						if (!bInitialised)
						{
							ns1blankspace.financial.initData(oParam)
						}
						else
						{														
							ns1blankspace.app.set(oParam);
						}

						$('#ns1blankspaceViewControlNew').button({disabled: true});
					}

ns1blankspace.financial.initData = function (oParam, oResponse)
					{
						var bRefresh = false;
						var iStep = 0;
						
						if (oParam == undefined) {oParam = {}}

						if (oParam != undefined)
						{
							if (oParam.refresh != undefined) {bRefresh = oParam.refresh}
							if (oParam.step != undefined) {iStep = oParam.step}
						}

						if (ns1blankspace.financial.data == undefined)
						{
							ns1blankspace.status.working();	
							ns1blankspace.financial.data = {};
							ns1blankspace.financial.initStatus = undefined;
						}
						
						ns1blankspace.financial.initWhenDataInitalised(oParam);

						if (ns1blankspace.financial.initStatus != 2 || bRefresh)
						{
							if (iStep == 0)
							{
								if (oResponse == undefined)
								{
									$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
									ns1blankspace.status.message(ns1blankspace.xhtml.loadingSmall + ' initalising financials')
									$('#ns1blankspaceMain').html('');
									$('#ns1blankspaceControl').html('');

									$.ajax(
									{
										type: 'GET',
										url: '/ondemand/setup/setup.asp?method=SETUP_FINANCIAL_SETTINGS_MANAGE&setdefault=1',
										dataType: 'json',
										global: false,
										success: function(data) {ns1blankspace.financial.initData(oParam, data)}
									});
								}
								else
								{
									ns1blankspace.financial.initStatus = 1;
									ns1blankspace.financial.initData($.extend(true, oParam, {step: 1}))
								}
							}

							if (iStep == 1)
							{
								if (oResponse == undefined)
								{
									if (ns1blankspace.financial.data.bankaccounts == undefined || bRefresh)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
										oSearch.addField('title,lastreconciledamount,lastreconcileddate,notes,status');
										oSearch.rows = 100;
										oSearch.getResults(function(data) {ns1blankspace.financial.initData(oParam, data)});
									}
									else
									{
										ns1blankspace.financial.initData($.extend(true, oParam, {step: 2}));
									}
								}
								else
								{
									ns1blankspace.financial.data.bankaccounts = oResponse.data.rows;
									ns1blankspace.financial.initData($.extend(true, oParam, {step: 2}));
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
											success: function(data) {ns1blankspace.financial.initData(oParam, data)}
										});
									}
									else
									{
										ns1blankspace.financial.initData($.extend(true, oParam, {step: 3}));
									}
								}
								else
								{
									ns1blankspace.financial.data.settings = oResponse;
									ns1blankspace.financial.initData($.extend(true, oParam, {step: 3}));
								}
							}
							
							if (iStep == 3)
							{
								if (oResponse == undefined)
								{
									if (ns1blankspace.financial.data.accounts == undefined || bRefresh)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
										oSearch.addField('area,areatext,class,classtext,code,description,expensecostofsale,expensepayroll,' +
															'parentaccount,parentaccounttext,postable,title,taxtype,taxtypeincomingtext,taxtypeoutgoingtext,type,typetext');

										oSearch.sort('title', 'asc')
										oSearch.rows = 500;
										oSearch.getResults(function(data) {ns1blankspace.financial.initData(oParam, data)})	
									}
									else
									{
										ns1blankspace.financial.initStatus = 2;
										ns1blankspace.status.message('&nbsp;');
									}
								}
								else
								{
									if (oResponse.morerows == "true")
									{
										alert("There is an issue with this report");
									}
									else
									{
										ns1blankspace.financial.data.accounts = oResponse.data.rows;

										var oItem = $.grep(ns1blankspace.financial.data.accounts, function (a) { return a.parentaccount == ''; })

										if (oItem.length != 0)
										{	
											ns1blankspace.financial.rootAccount = oItem[0].id;
										}	

										ns1blankspace.setup.financial.accounts.tree(ns1blankspace.financial.accounts[ns1blankspace.financial.rootaccount],ns1blankspace.financial.accounts); 
										ns1blankspace.financial.data.rootAccounts = $.grep(ns1blankspace.financial.data.accounts, function (a) {return parseInt(a.parentaccount) == parseInt(ns1blankspace.financial.rootAccount);})
				
										ns1blankspace.financial.initStatus = 2;
										ns1blankspace.status.message('&nbsp;');
									}	
								}
							}
						}	
					}

ns1blankspace.financial.initWhenDataInitalised = function (oParam)
					{
						if (ns1blankspace.financial.initStatus == 2 || ns1blankspace.timer.initWhenDataInitalisedCount > 250)
						{	
							ns1blankspace.timer.initWhenDataInitalisedCount = undefined;
							window.clearInterval(ns1blankspace.timer.initWhenDataInitalised);
							ns1blankspace.timer.initWhenDataInitalised = undefined;

							var oNS;

							if (ns1blankspace.objectParentName)
							{
								oNS = ns1blankspace[ns1blankspace.objectParentName][ns1blankspace.objectName];
							}
							else
							{
								oNS = ns1blankspace[ns1blankspace.objectName];
							}

							if (oNS)
							{	
								if (oParam == undefined) {oParam = ns1blankspace.timer.initWhenDataInitalisedParam}
								if (oParam == undefined) {oParam = {}}
								oParam.initialised = true;
								ns1blankspace.timer.initWhenDataInitalisedParam = undefined;
								oNS.init(oParam)
							}	
						}
						else
						{	
							if (ns1blankspace.timer.initWhenDataInitalisedCount == undefined)
							{
								ns1blankspace.timer.initWhenDataInitalisedCount = 0;
							}
							else
							{
								ns1blankspace.timer.initWhenDataInitalisedCount++;
							}

							if (ns1blankspace.timer.initWhenDataInitalised == undefined)
							{	
								ns1blankspace.timer.initWhenDataInitalisedParam = oParam;
								ns1blankspace.timer.initWhenDataInitalised = window.setInterval('ns1blankspace.financial.initWhenDataInitalised()', 100);
							}
						}	
					}		

ns1blankspace.financial.home = function ()
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

						aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

						aHTML.push('</table>');		
						
						aHTML.push('<table class="ns1blankspaceControl" style="padding-top: 5px;">');
						
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlSummary" class="ns1blankspaceControl">Summary</td>' +
									'</tr>');	
						
						aHTML.push('<tr class="interfaceViewportControl">' +
									'<td id="ns1blankspaceControlBankAccount" class="ns1blankspaceControl">Bank Accounts</td>' +
									'</tr>');	
						
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlInvoicing" class="ns1blankspaceControl">Invoicing</td>' +
									'</tr>');	

						aHTML.push('</table>');		

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlDebtors" class="ns1blankspaceControl">Debtors</td>' +
									'</tr>');	
						
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlCreditors" class="ns1blankspaceControl">Creditors</td>' +
									'</tr>');	
						
						aHTML.push('</table>');		
						
						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlPL" class="ns1blankspaceControl">Profit & Loss</td>' +
									'</tr>');	
						
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlBS" class="ns1blankspaceControl">Balance Sheet</td>' +
									'</tr>');	
						
						aHTML.push('</table>');		
						
						aHTML.push('<table class="ns1blankspaceControl">');

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
						
						aHTML[++h] = '<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainBankAccount" class="ns1blankspaceControlMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainDebtors" class="ns1blankspaceControlMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainCreditors" class="ns1blankspaceControlMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainPL" class="ns1blankspaceControlMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainBS" class="ns1blankspaceControlMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainAccounts" class="ns1blankspaceControlMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainUnallocated" class="ns1blankspaceControlMain"></div>';
						aHTML[++h] = '<div id="ns1blankspaceMainInvoicing" class="ns1blankspaceControlMain"></div>';
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						$('#ns1blankspaceControlSummary').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
							ns1blankspace.financial.summary();
						});
						
						$('#ns1blankspaceControlBankAccount').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainBankAccount'});
							ns1blankspace.financial.bankAccounts.show();
						});	
						
						$('#ns1blankspaceControlDebtors').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainDebtors'});
							ns1blankspace.financial.debtors.show();
						});	
							
						$('#ns1blankspaceControlCreditors').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainCreditors'});
							ns1blankspace.financial.creditors.show();
						});	
						
						$('#ns1blankspaceControlPL').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainPL'});
							ns1blankspace.financial.profitLoss.show();
						});	
						
						$('#ns1blankspaceControlBS').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainBS'});
							ns1blankspace.financial.balanceSheet.show();
						});	
						
						$('#ns1blankspaceControlAccounts').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainAccounts'});
							ns1blankspace.financial.accounts.show();
						});	
						
						$('#ns1blankspaceControlUnallocated').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainUnallocated'});
							ns1blankspace.financial.unallocated.show();
						});	

						$('#ns1blankspaceControlInvoicing').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainInvoicing'});
							ns1blankspace.financial.invoicing.show();
						});	
						
						$('#ns1blankspaceControlSummary').addClass('ns1blankspaceHighlight');

						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.summary()'});
					}

ns1blankspace.financial.summary = function (oParam, oResponse)
				{
					if (ns1blankspace.financial.data == undefined) {ns1blankspace.financial.data = {}}
							
					var aHTML = [];
					
					aHTML.push('<table class="ns1blankspaceContainer">' +
									'<tr class="ns1blankspaceContainer">' +
									'<td id="ns1blankspaceSummaryColumn1"' +
									' style="width:95px; text-align:right;"><div style="float:right; width:50px; height:50px; background: url(/jscripts/images/1blankspace.icons.50-2.0.0.png) -250px -200px;"></div>' +
									'</td>' +
									'<td id="ns1blankspaceSummaryColumn2">' +
									'</td>' +
									'</tr>' +
									'</table>');				
					
					$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
					
					var aHTML = [];
				
					aHTML.push('<table class="ns1blankspaceColumn2" style="margin-left:5px;">');
					
					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Creditors</td></tr>' +
									'<tr><td class="ns1blankspaceSummary">' +
									ns1blankspace.financial.data.settings.lockeddatecreditors +
									'</td></tr>');
					
					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Debtors</td></tr>' +
									'<tr><td class="ns1blankspaceSummary">' +
									ns1blankspace.financial.data.settings.lockeddatedebtors +
									'</td></tr>');
					
					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">General Journals</td></tr>' +
									'<tr><td class="ns1blankspaceSummary">' +
									ns1blankspace.financial.data.settings.lockeddatejournals +
									'</td></tr>');
					
					aHTML.push('</table>');					
					
					$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''))
					
				}


ns1blankspace.financial.summaryPL = function (oParam, oResponse)
				{
					if (ns1blankspace.financial.data == undefined) {ns1blankspace.financial.data = {}}
						
					if (oResponse == undefined)
					{
						$('#ns1blankspaceMainSummary').html(ns1blankspace.xhtml.loading);

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
										(oResponse.totalsales).formatMoney(2, '.', ',') +
										'</td></tr>');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Cost of Sales</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryTotalCostOfSales" class="ns1blankspaceSummary">' +
										(oResponse.totalcostofsales).formatMoney(2, '.', ',') +
										'</td></tr>');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Gross Margin</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryGrossMargin" class="ns1blankspaceSummary">' +
										(oResponse.grossmargin).formatMoney(2, '.', ',') +
										'</td></tr>');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Operating Expenses</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryTotalOperationalExpenses" class="ns1blankspaceSummary">' +
										(oResponse.totaloperationalexpenses).formatMoney(2, '.', ',') +
										'</td></tr>');
										
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Net Margin</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryNetMargin" class="ns1blankspaceSummary">' +
										(oResponse.netmargin).formatMoney(2, '.', ',') +
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
							success: function(data) {ns1blankspace.financial.debtors.show(oParam, data)}
						});			
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.status == 'ER')
						{
							aHTML.push('<table><tbody>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceNothing">No debtors.</td>' +
										'</tr>' +
										'</tbody></table>');
						}
						else
						{
							if (oResponse.data.rows.length == 0 )
							{
								aHTML.push('<table><tbody>' +
												'<tr class="ns1blankspace">' +
												'<td class="ns1blankspaceNothing">No debtors.</td>' +
												'</tr>' +
												'</tbody></table>');
							}
							else
							{
								aHTML.push('<table id="ns1blankspaceMainDebtors" class="ns1blankspace">' +
												'<tr class="ns1blankspaceCaption">' +
												'<td class="ns1blankspaceHeaderCaption">Debtor</td>' +
												'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount Owed</td>' +
												'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">Last Receipt Date</td>' +
												'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">Last Receipt $</td>' +
												'<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
												'</tr>');
								
								$(oResponse.data.rows).each(function() 
								{
									aHTML.push(ns1blankspace.financial.debtors.row(this));
								});
								
								aHTML.push('</table>');
							}
						}

						ns1blankspace.render.page.show(
					   	{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceMainDebtors',
							xhtmlContext: 'Debtors',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: ns1blankspace.option.defaultRows,
							functionShowRow: ns1blankspace.financial.debtors.row,
							functionOpen: undefined,
							functionNewPage: 'ns1blankspace.financial.debtors.bind()',
					   	});

						ns1blankspace.financial.debtors.bind();
							    	
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
									'<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
									'<span id="ns1blankspaceDebtors_contactBusiness-' + oRow.id + '" class="ns1blankspaceRowSelect"></span>' +
									'</td>' +			
									'</tr>');
					
					return aHTML.join('');
				},

	bind: 		function ()
				{
					$('#ns1blankspaceMainDebtors .ns1blankspaceRowSelect').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-play"
						}
					})
					.click(function() {
						ns1blankspace.contactBusiness.init({id: (this.id).split('-')[1]});
					})
					.css('width', '15px')
					.css('height', '20px')
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
						
						if (oResponse.status == 'ER')
						{
							aHTML.push('<table><tbody>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceNothing">No creditors.</td>' +
										'</tr>' +
										'</tbody></table>');
						}
						else
						{

							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<table><tbody>' +
												'<tr class="ns1blankspace">' +
												'<td class="ns1blankspaceNothing">No creditors</td>' +
												'</tr>' +
												'</tbody></table>');
							}
							else
							{
								aHTML.push('<table id="ns1blankspaceMainCreditors" class="ns1blankspace">' +
												'<tbody>' +
												'<tr class="ns1blankspaceCaption">' +
												'<td class="ns1blankspaceHeaderCaption">Creditor</td>' +
												'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount To Be Paid</td>' +
												'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">Last Paid Date</td>' +
												'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">Last Paid $</td>' +
												'<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
												'</tr>');	
								
								$(oResponse.data.rows).each(function() 
								{
									aHTML.push(ns1blankspace.financial.creditors.row(this));
								});
								
								aHTML.push('</tbody></table>');
							}
						}	
						
						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceMainCreditors',
							xhtmlContext: 'Creditors',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: ns1blankspace.option.defaultRows,
							functionShowRow: ns1blankspace.financial.creditors.row,
							functionOpen: undefined,
							functionNewPage: 'ns1blankspace.financial.creditors.bind()',
						}); 

						ns1blankspace.financial.creditors.bind();
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
									'<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
									'<span id="ns1blankspaceDebtors_contactBusiness-' + oRow.id + '" class="ns1blankspaceRowSelect"></span>' +
									'</td>' +
									'</tr>');

					return aHTML.join('');
				},

	bind: 		function ()
				{
					$('#ns1blankspaceMainCreditors .ns1blankspaceRowSelect').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-play"
						}
					})
					.click(function() {
						ns1blankspace.contactBusiness.init({id: (this.id).split('-')[1]});
					})
					.css('width', '15px')
					.css('height', '20px')
				}
}

ns1blankspace.financial.profitLoss =
{
	show: 		function (oParam, oResponse)
				{
					var sStartDate;
					var sEndDate;

					if (oParam != undefined)
					{
						if (oParam.startDate != undefined) {sStartDate = oParam.startDate}
						if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
					}		

					if (oResponse == undefined)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
								'<tr>' +
								'<td id="ns1blankspacePLColumn1" class="ns1blankspaceColumn1Divider" style="width:100px; font-size: 0.875em; padding-right:10px;"></td>' +
								'<td id="ns1blankspacePLColumn2" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
								'</tr>' +
								'</table>');	

						$('#ns1blankspaceMainPL').html(aHTML.join(''));	

						var aHTML = [];
						
						aHTML.push('<table>');
						
						aHTML.push('<tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePLStartDate" class="ns1blankspaceDate">' +
										'</td></tr>');
							
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
										'To' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePLEndDate" class="ns1blankspaceDate">' +
										'</td></tr>');
														
						aHTML.push('<tr><td style="padding-top:5px;">' +
										'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspacePLRefresh">Refresh</span>' +
										'</td></tr>');
						
						aHTML.push('</table>');					
						
						$('#ns1blankspacePLColumn1').html(aHTML.join(''));

						$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});

						$('#ns1blankspacePLRefresh').button(
						{
							label: 'Refresh',
							icons: {
								primary: "ui-icon-arrowrefresh-1-e"
							}
						})
						.click(function() {
							ns1blankspace.financial.profitLoss.show(
							{
								startDate: $('#ns1blankspacePLStartDate').val(),
								endDate: $('#ns1blankspacePLEndDate').val()
							})
						});

						var sData = 'rows=500'

						if (sStartDate != undefined)
						{
							sData += '&startdate=' + ns1blankspace.util.fs(sStartDate);
							$('#ns1blankspacePLStartDate').val(sStartDate);
						}
							
						if (sEndDate != undefined)
						{
							sData += '&enddate=' + ns1blankspace.util.fs(sEndDate);
							$('#ns1blankspacePLEndDate').val(sEndDate);
						}
							
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('FINANCIAL_PROFIT_LOSS_SEARCH'),
							data: sData,
							dataType: 'json',
							success: function(data) {ns1blankspace.financial.profitLoss.show(oParam, data)}
						});
					}
					else
					{
						if (oResponse.morerows == "true")
						{
							alert("There is an issue with this report");
						}
						else
						{
							var oParam = {};
							oParam.dataTree = ns1blankspace.financial.data.accounts;
							oParam.dataBranch = oResponse.data.rows;
							oParam.branchDetailName = 'total';
							oParam.xhtmlElementID = 'ns1blankspacePLColumn2';
							oParam.xhtmlElementContext = 'PL';

							oParam.dataRoot =
							[
								{
									title: 'Sales',
									id: $.grep(ns1blankspace.financial.data.rootAccounts, function (a) {return parseInt(a.type) == 2})[0]['id'],
									xhtml: '<span class="ns1blankspaceHeaderLarge">Sales</span><br /><span class="ns1blankspaceSub" style="color:#999999;">' + (oResponse.totalsales).formatMoney(2, '.', ',') + '</span>'
								},
								{
									title: 'Cost of Sales',
									id: $.grep(ns1blankspace.financial.data.rootAccounts, function (a) {return parseInt(a.type) == 1})[0]['id'],
									filter: function (a) {return a.expensecostofsale == 'Y'},
									xhtml: '<span class="ns1blankspaceHeaderLarge">Cost&nbsp;of&nbsp;Sales</span><br /><span class="ns1blankspaceSub" style="color:#999999;">' + (oResponse.totalcostofsales).formatMoney(2, '.', ',') + '</span>' +
												'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.totalcostofsalespercentage).formatMoney(2, '.', ',') + '%</span>' 
								},
								{
									xhtml: '<span class="ns1blankspaceHeaderLarge">Gross&nbsp;Margin</span><br /><span class="ns1blankspaceSub" style="color:#999999;">' + (oResponse.grossmargin).formatMoney(2, '.', ',') + '</span>' +
												'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.grossmarginpercentage).formatMoney(2, '.', ',') + '%</span>',
									class: 'ns1blankspaceRowShaded'
								},
								{
									title: 'Expenses',
									id: $.grep(ns1blankspace.financial.data.rootAccounts, function (a) {return parseInt(a.type) == 1})[0]['id'],
									filter: function (a) {return a.expensecostofsale != 'Y'},
									xhtml: '<span class="ns1blankspaceHeaderLarge">Expenses</span><br /><span class="ns1blankspaceSub" style="color:#999999;">' + (oResponse.totaloperationalexpenses).formatMoney(2, '.', ',') + '</span>' +
											'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.totaloperationalexpensespercentage).formatMoney(2, '.', ',') + '%</span>' 
								}
							]	

							if (parseInt(oResponse.TotalOtherIncome) == 0 && parseInt(oResponse.TotalOtherExpenses) == 0)
							{
								oParam.dataRoot.push(
								{
									xhtml: '<span class="ns1blankspaceHeaderLarge">Margin</span><br /><span class="ns1blankspaceSub" style="color:#999999;">' + (oResponse.netmargin).formatMoney(2, '.', ',') + '</span>' +
												'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.netmarginpercentage).formatMoney(2, '.', ',') + '%</span>',
									class: 'ns1blankspaceRowShaded'
								});
							}
							else
							{
								oParam.dataRoot.push(
								{
									xhtml: '<span class="ns1blankspaceHeaderLarge">Net&nbsp;Margin</span><br /><span class="ns1blankspaceSub" style="color:#999999;"> ' + (oResponse.operatingmargin).formatMoney(2, '.', ',') + '</span>' +
												'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.operatingmarginpercentage).formatMoney(2, '.', ',') + '%</span>',
									class: 'ns1blankspaceRowShaded'
								});

								
								if (parseInt(oResponse.totalotherincome) != 0)
								{
									oParam.dataRoot.push(
									{
										xhtml: '<span class="ns1blankspaceHeaderLarge">Other&nbsp;Income</span><br /><span class="ns1blankspaceSub" style="color:#999999;">' + (oResponse.totalotherincome).formatMoney(2, '.', ',') + '</span>' +
													'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.totalotherincomepercentage).formatMoney(2, '.', ',') + '%</span>',
										class: 'ns1blankspaceRowShaded'
									});
								}
									
								if (parseInt(oResponse.totalotherincome) != 0)
								{
									oParam.dataRoot.push(
									{
										xhtml: '<span class="ns1blankspaceHeaderLarge">Other&nbsp;Expenses</span><br /><span class="ns1blankspaceSub" style="color:#999999;">' + (oResponse.totalotherexpenses).formatMoney(2, '.', ',') + '</span>' +
													'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.totalotherexpensespercentage).formatMoney(2, '.', ',') + '%</span>',
										class: 'ns1blankspaceRowShaded'
									});
								}	

								oParam.dataRoot.push(
								{
									xhtml: '<span class="ns1blankspaceHeaderLarge">Margin</span><br /><span class="ns1blankspaceSub" style="color:#999999;">' + (oResponse.netmargin).formatMoney(2, '.', ',') + '</span>' +
												'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.netmarginpercentage).formatMoney(2, '.', ',') + '%</span>',
									class: 'ns1blankspaceRowShaded'
								});
							}
							
							ns1blankspace.format.tree.init(oParam);
						}	
					}	
				}
}

ns1blankspace.financial.balanceSheet =
{
	show: 		function (oParam, oResponse)
				{
					var sStartDate;
					var sEndDate;

					if (oParam != undefined)
					{
						if (oParam.startDate != undefined) {sStartDate = oParam.startDate}
						if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
					}		

					if (oResponse == undefined)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
								'<tr>' +
								'<td id="ns1blankspaceBSColumn1" class="ns1blankspaceColumn1Divider" style="width:100px; font-size: 0.875em; padding-right:10px;"></td>' +
								'<td id="ns1blankspaceBSColumn2" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
								'</tr>' +
								'</table>');	

						$('#ns1blankspaceMainBS').html(aHTML.join(''));	

						var aHTML = [];
						
						aHTML.push('<table>');
						
						aHTML.push('<tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceBSStartDate" class="ns1blankspaceDate">' +
										'</td></tr>');
							
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
										'To' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceBSEndDate" class="ns1blankspaceDate">' +
										'</td></tr>');
														
						aHTML.push('<tr><td style="padding-top:5px;">' +
										'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspaceBSRefresh">Refresh</span>' +
										'</td></tr>');
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceBSColumn1').html(aHTML.join(''));

						$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});

						$('#ns1blankspaceBSRefresh').button(
						{
							label: 'Refresh',
							icons: {
								primary: "ui-icon-arrowrefresh-1-e"
							}
						})
						.click(function() {
							ns1blankspace.financial.profitLoss.show(
							{
								startDate: $('#ns1blankspaceBSStartDate').val(),
								endDate: $('#ns1blankspaceBSEndDate').val()
							})
						});

						var sData = 'rows=500'

						if (sStartDate != undefined)
						{
							sData += '&startdate=' + ns1blankspace.util.fs(sStartDate);
							$('#ns1blankspaceBSStartDate').val(sStartDate);
						}
							
						if (sEndDate != undefined)
						{
							sData += '&enddate=' + ns1blankspace.util.fs(sEndDate);
							$('#ns1blankspaceBSEndDate').val(sEndDate);
						}
							
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('FINANCIAL_BALANCE_SHEET_SEARCH'),
							data: sData,
							dataType: 'json',
							success: function(data) {ns1blankspace.financial.balanceSheet.show(oParam, data)}
						});
					}
					else
					{
						if (oResponse.morerows == "true")
						{
							alert("There is an issue with this report");
						}
						else
						{
							var oParam = {};
							oParam.dataTree = ns1blankspace.financial.data.accounts;
							oParam.dataBranch = oResponse.data.rows;
							oParam.xhtmlElementID = 'ns1blankspaceBSColumn2';
							oParam.xhtmlElementContext = 'BS';

							oParam.dataRoot =
							[
								{
									title: 'Assets',
									id: $.grep(ns1blankspace.financial.data.rootAccounts, function (a) {return parseInt(a.type) == 3})[0]['id'],
									xhtml: '<span class="ns1blankspaceHeaderLarge">Assets</span><br /><span class="ns1blankspaceSub" style="color:#999999;">' + (oResponse.assettotal).formatMoney(2, '.', ',') + '</span>'
								},
								{
									title: 'Liability',
									id: $.grep(ns1blankspace.financial.data.rootAccounts, function (a) {return parseInt(a.type) == 4})[0]['id'],
									xhtml: '<span class="ns1blankspaceHeaderLarge">Liability</span><br /><span class="ns1blankspaceSub" style="color:#999999;">' + (oResponse.liabilitytotal).formatMoney(2, '.', ',') + '</span>'
								},
								{
									title: 'Equity',
									id: $.grep(ns1blankspace.financial.data.rootAccounts, function (a) {return parseInt(a.type) == 5})[0]['id'],
									xhtml: '<span class="ns1blankspaceHeaderLarge">Equity</span><br /><span class="ns1blankspaceSub" style="color:#999999;">' + (oResponse.equitytotal).formatMoney(2, '.', ',') + '</span>'
								}
							]	
	
							ns1blankspace.format.tree.init(oParam);
						}	
					}	
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
						oSearch.addField('title,lastreconciledamount,lastreconcileddate,notes,status');
						oSearch.sort('title', 'asc');
						oSearch.rows = ns1blankspace.option.defaultRows;
						oSearch.getResults(function(data) {ns1blankspace.financial.bankAccounts.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceBankAccountsColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
										'<td id="ns1blankspaceBankAccountsColumn2" class="ns1blankspaceColumn2" style="width: 1px;"></td>' +
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
							aHTML.push('<table id="ns1blankspaceMainBankAccounts" class="ns1blankspace">' +
											'<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceHeaderCaption">Name</td>' +
											'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Reconciled Amount</td>' +
											'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Last Reconciled</td>' +
											'<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
											'</tr>');	
							
							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.financial.bankAccounts.row(this));
							});
							
							aHTML.push('</table>');
						}
						
						ns1blankspace.render.page.show(
						   {
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceBankAccountsColumn1',
							xhtmlContext: 'BankAccount',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.financial.bankAccounts.row,
							functionOpen: undefined,
							functionNewPage: 'ns1blankspace.financial.bankAccounts.bind()'
						   });
						
						ns1blankspace.financial.bankAccounts.bind()
					}
				},

	row:		function (oRow)
				{
					var aHTML = [];
					
					var sClass = '';
					if (oRow.status == 2) {sClass = ' ns1blanksapceSub'}

					aHTML.push('<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceBalanceSheet_Title-" class="ns1blankspaceRow' + sClass + '" title="' + oRow.notes + '">' +
									oRow.title + '</td>' +
									'<td id="ns1blankspaceBalanceSheet_Balance-" class="ns1blankspaceRow' + sClass + '" style="text-align:right;">' +
									oRow.lastreconciledamount + '</td>' +
									'<td id="ns1blankspaceBalanceSheet_Date-" class="ns1blankspaceRow' + sClass + '" style="text-align:right;">' +
									oRow.lastreconcileddate + '</td>' +
									'<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
									'<span id="ns1blankspaceBankAccounts-' + oRow.id + '" class="ns1blankspaceRowSelect"></span>' +
									'</td>' +				
									'</tr>');

					return aHTML.join('');
				},

	bind: 		function ()
				{
					$('#ns1blankspaceMainBankAccounts .ns1blankspaceRowSelect').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-play"
						}
					})
					.click(function() {
						ns1blankspace.financial.bankAccount.init({id: (this.id).split('-')[1]});
					})
					.css('width', '15px')
					.css('height', '20px')
				}
}

ns1blankspace.financial.accounts =
{
	show: 		function (oParam, oResponse)
				{
					var iStep = 1;
					var iFinancialAccount = -1;
					var iType;
					
					if (oParam != undefined)
					{
						if (oParam.type != undefined) {iType = oParam.type};
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
										'<td id="ns1blankspaceAccountColumn1" style="width:100px;font-size:0.75em;"></td>' +
										'<td id="ns1blankspaceAccountColumn2"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainAccounts').html(aHTML.join(''));
							
						var aHTML = [];

						aHTML.push('<div id="ns1blankspaceAccountColumnCategory" style="width:100px; margin-top:3px; text-align:right;">');
						aHTML.push('<input type="radio" id="ns1blankspaceBankAccountColumnCategory-0" name="radioCategory" /><label for="ns1blankspaceBankAccountColumnCategory-0" style="width: 100px; margin-bottom:1px;">All</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceBankAccountColumnCategory-1" name="radioCategory" /><label for="ns1blankspaceBankAccountColumnCategory-1" style="width: 100px; margin-bottom:1px;">Sales</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceBankAccountColumnCategory-2" name="radioCategory" /><label for="ns1blankspaceBankAccountColumnCategory-2" style="width: 100px; margin-bottom:1px;">Purchases</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceBankAccountColumnCategory-3" name="radioCategory" /><label for="ns1blankspaceBankAccountColumnCategory-3" style="width: 100px; margin-bottom:1px;">Assets</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceBankAccountColumnCategory-4" name="radioCategory" /><label for="ns1blankspaceBankAccountColumnCategory-4" style="width: 100px; margin-bottom:1px;">Liability</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceBankAccountColumnCategory-5" name="radioCategory" /><label for="ns1blankspaceBankAccountColumnCategory-5" style="width: 100px; margin-bottom:1px;">Equity</label>');
						aHTML.push('</div>');

						$('#ns1blankspaceAccountColumn1').html(aHTML.join(''));
					
						$('#ns1blankspaceAccountColumnCategory').buttonset().css('font-size', '0.875em');
						
						$('#ns1blankspaceAccountColumnCategory :radio').click(function()
						{
							var aID = (event.target.id).split('-');
							$.extend(true, oParam, {step: 2, type: parseInt(aID[1])});
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
							if (iType != 0) {oSearch.addFilter('type', 'EQUAL_TO', iType)};
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
										'<td id="ns1blankspaceAccountTransactionsColumn1" style="width: 70px;font-size:0.875em;"></td>' +
										'<td id="ns1blankspaceAccountTransactionsColumn2"></td>' +
										'</tr>' +
										'</table>');

								$('#ns1blankspaceAccountColumn2').html(aHTML.join(''));
						
								var aHTML = [];
								
								aHTML.push('<table id="ns1blankspaceReco" class="ns1blankspaceColumn2" style="padding-right: 10px;">');
							
								$(oResponse.data.rows).each(function(i) 
								{
									if (i==0 && iType == 0)
									{
										aHTML.push('<tr><td><span id="ns1blankspaceAccountTransactionsAll" style="font-size:0.75em;width:100%;">All</span></td></tr>');
									}
								
									aHTML.push('<tr><td id="ns1blankspaceAccountTransactions_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceFinancialAccountRowSelect"' +
													'>' + this.title + '</td></tr>');
								});
							
								aHTML.push('</table>');
							
								$('#ns1blankspaceAccountTransactionsColumn1').html(aHTML.join(''));
								
								$('#ns1blankspaceAccountTransactionsAll').button(
								{
									label: "All"
								})
								.click(function() {
										$.extend(true, oParam, {step: 3, financialAccount: -1});
										ns1blankspace.financial.accounts.show(oParam);
								})
								.css("width", "100%");
								
								$('.ns1blankspaceFinancialAccountRowSelect').click(function() {
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
							$('#ns1blankspaceAccountTransactionsColumn2').html('<table class="ns1blankspaceColumn2">' +
											'<tr><td>' + ns1blankspace.xhtml.loading + '</td></tr></table>');
							
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
								aHTML.push('<table class="ns1blankspaceColumn2">' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceNothing">No transactions.</td>' +
											'</tr>' +
											'</table>');
								
								$('#ns1blankspaceAccountTransactionsColumn2').html(aHTML.join(''));
							}
							else
							{
								var aHTML = [];
						
								aHTML.push('<table class="ns1blankspaceColumn2" style="font-size:0.875em;">');
							
								aHTML.push('<tr>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">TOTAL</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">' + (oResponse.summary.sumamount).parseCurrency().formatMoney(2, '.', ',') + '</td>');
								aHTML.push('</tr>');
								
								$(oResponse.data.rows).each(function(i) 
								{
									aHTML.push('<tr><td id="ns1blankspaceFinancialAccountTransactions_date-' + this.id + '" class="ns1blankspaceRow"' +
													'>' + this.date + '</td>');
									
									aHTML.push('<td id="ns1blankspaceFinancialAccountTransactions_description-' + this.id + '" class="ns1blankspaceRow"' +
													'>' + this.description + '</td>');
													
									aHTML.push('<td id="ns1blankspaceFinancialAccountTransactions_amount-' + this.id + '" class="ns1blankspaceRow"' +
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

ns1blankspace.financial.unallocated =
{
	show: 		function (oParam, oResponse)
				{
					var iStep = 1;
					var iType = 1;
					
					if (oParam != undefined)
					{
						if (oParam.step != undefined) {iStep = oParam.step};
						if (oParam.type != undefined) {iType = oParam.type};
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
										'<td id="ns1blankspaceUnallocatedColumn1" style="width:100px; font-size:0.75em;"></td>' +
										'<td id="ns1blankspaceUnallocatedColumn2"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainUnallocated').html(aHTML.join(''));
							
						var aHTML = [];

						aHTML.push('<div id="ns1blankspaceUnallocatedColumnType" style="width:85px; margin-top:3px; text-align:right;">');
						aHTML.push('<input type="radio" id="ns1blankspaceUnallocatedColumnType-3" name="radioType" /><label for="ns1blankspaceUnallocatedColumnType-3" style="width: 85px; margin-bottom:1px;">Expenses</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceUnallocatedColumnType-4" name="radioType" /><label for="ns1blankspaceUnallocatedColumnType-4" style="width: 85px; margin-bottom:1px;">Payments</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceUnallocatedColumnType-1" name="radioType" /><label for="ns1blankspaceUnallocatedColumnType-1" style="width: 85px; margin-bottom:1px;">Invoices</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceUnallocatedColumnType-2" name="radioType" /><label for="ns1blankspaceUnallocatedColumnType-2" style="width: 85px; margin-bottom:1px;">Receipts</label>');
						aHTML.push('</div>');

						$('#ns1blankspaceUnallocatedColumn1').html(aHTML.join(''));
					
						$('#ns1blankspaceUnallocatedColumnType').buttonset().css('font-size', '0.875em');
						
						$('#ns1blankspaceUnallocatedColumnType :radio').click(function()
						{
							var aID = (event.target.id).split('-');
							$.extend(true, oParam, {step: 2, type: parseInt(aID[1])});
							ns1blankspace.financial.unallocated.show(oParam);
						});
					}
					
					if (iStep == 2)
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
								$('#ns1blankspaceUnallocatedColumn1').html('<span class="ns1blankspaceNothing">No unallocated account set up.</span>');
							}
							else
							{	
								$('#ns1blankspaceUnallocatedColumn2').html(ns1blankspace.xhtml.loading);

								var oSearch = new AdvancedSearch();

								if (iType == 1)
								{
									oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
									oSearch.addField('reference,sentdate,invoice.lineitem.amount,invoice.lineitem.description,invoice.lineitem.id');
									oSearch.addFilter('invoice.lineitem.financialaccount', 'EQUAL_TO', ns1blankspace.financial.unallocatedAccount);
									oSearch.addFilter('invoice.sent', 'EQUAL_TO', 'N');

									ns1blankspace.financial.unallocated.row = function (oRow)
									{
										var aHTML = [];
										
										aHTML.push('<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceUnallocated_reference-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["reference"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_date-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["sentdate"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["invoice.lineitem.description"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
														oRow["invoice.lineitem.amount"] + '</td>'); 

										aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
										aHTML.push('<span id="ns1blankspaceReconcileItems_options_search-' + oRow["invoice.lineitem.id"] + '-1"' +
														' class="ns1blankspaceUnallocatedEdit"></span></td>');
										aHTML.push('</tr>');

										return aHTML.join('');
									}
								}
								else if (iType == 2)
								{
									oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
									oSearch.addField('reference,receivedate,receipt.lineitem.amount,receipt.lineitem.description,receipt.lineitem.id');
									oSearch.addFilter('receipt.lineitem.financialaccount', 'EQUAL_TO', ns1blankspace.financial.unallocatedAccount);

									ns1blankspace.financial.unallocated.row = function (oRow)
									{
										var aHTML = [];
										
										aHTML.push('<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceUnallocated_reference-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["reference"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_date-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["sentdate"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["invoice.lineitem.description"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
														oRow["invoice.lineitem.amount"] + '</td>'); 

										aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
										aHTML.push('<span id="ns1blankspaceReconcileItems_options_search-' + oRow["invoice.lineitem.id"] + '-1"' +
														' class="ns1blankspaceUnallocatedEdit"></span></td>');
										aHTML.push('</tr>');

										return aHTML.join('');
									}
								}
								else if (iType == 3)
								{
									oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
									oSearch.addField('reference,accrueddate,expense.lineitem.amount,expense.lineitem.description,expense.lineitem.id');
									oSearch.addFilter('expense.lineitem.financialaccount', 'EQUAL_TO', ns1blankspace.financial.unallocatedAccount);

									ns1blankspace.financial.unallocated.row = function (oRow)
									{
										var aHTML = [];

										aHTML.push('<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceUnallocated_reference-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["reference"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_date-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["accrueddate"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["expense.lineitem.description"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
														oRow["expense.lineitem.amount"] + '</td>'); 

										aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
										aHTML.push('<span id="ns1blankspaceReconcileItems_options_search-' + oRow["expense.lineitem.id"] + '-2"' +
														' class="ns1blankspaceUnallocatedEdit"></span></td>');
										aHTML.push('</tr>');

										return aHTML.join('');
									}
								}
								else if (iType == 4)
								{
									oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
									oSearch.addField('reference,paiddate,payment.lineitem.amount,payment.lineitem.description,payment.lineitem.id');
									oSearch.addFilter('payment.lineitem.financialaccount', 'EQUAL_TO', ns1blankspace.financial.unallocatedAccount);

									ns1blankspace.financial.unallocated.row = function (oRow)
									{
										var aHTML = [];

										aHTML.push('<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceUnallocated_reference-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["reference"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_date-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["paiddate"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["payment.lineitem.description"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
														oRow["payment.lineitem.amount"] + '</td>'); 

										aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
										aHTML.push('<span id="ns1blankspaceReconcileItems_options_search-' + oRow["payment.lineitem.id"] + '-2"' +
														' class="ns1blankspaceUnallocatedEdit"></span></td>');
										aHTML.push('</tr>');

										return aHTML.join('');
									}
								}
								oSearch.rows = 20;
								oSearch.getResults(function(data) {ns1blankspace.financial.unallocated.show(oParam, data)});
							}	
						}
						else
						{
							var aHTML = [];
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<span class="ns1blankspaceSub">No unallocated items.</span>');
							}
							else
							{
								aHTML.push('<table class="ns1blankspaceColumn2" id="ns1blankspaceUnallocatedItems">' +
											'<tr class="ns1blankspaceHeaderCaption">' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditReference" style="width:100px;">Reference</td>' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditDate" style="width:100px;">Date</td>' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditDescription">Description</td>' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditAmount" style="width:100px; text-align:right;">Amount</td>' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditallocated" class="2"></td>' +
											'</tr>');

								$(oResponse.data.rows).each(function() 
								{
									aHTML.push(ns1blankspace.financial.unallocated.row(this));
								});
								
								aHTML.push('</table>');
							}
							
							ns1blankspace.render.page.show(
							{
								type: 'JSON',
								xhtmlElementID: 'ns1blankspaceUnallocatedColumn2',
								xhtmlContext: 'Unallocated',
								xhtml: aHTML.join(''),
								showMore: (oResponse.morerows == "true"),
								more: oResponse.moreid,
								rows: 100,
								functionShowRow: ns1blankspace.financial.unallocated.row,
								functionOpen: undefined,
								functionNewPage: 'ns1blankspace.financial.unallocated.bind()'
							}); 

							ns1blankspace.financial.unallocated.bind();   	
						}
					}	
				},

	bind: 		function()
				{
					$('#ns1blankspaceUnallocatedItems .ns1blankspaceUnallocatedEdit').button(
					{
						text: false,
						icons: {
							primary: "ui-icon-pencil"
						}
					})
					.click(function() {
						ns1blankspace.financial.unallocated.edit({xhtmlElementID: this.id});
					})
					.css('width', '15px')
					.css('height', '17px');
				},

	edit: 		function(oParam, oResponse)
				{
					var iType = 1;
					var sXHTMLElementID;
					var iItemID = '';

					if (oParam != undefined)
					{
						if (oParam.type != undefined) {iType = oParam.type};
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID};
					}

					var aXHTMLElementID = sXHTMLElementID.split('-');
					if (aXHTMLElementID[2]) {iType = aXHTMLElementID[2]}

					if (oResponse === undefined)
					{	
						if ($(ns1blankspace.xhtml.container).attr('data-source') == sXHTMLElementID)
						{
							$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
							$(ns1blankspace.xhtml.container).attr('data-source', '');
						}
						else
						{	
							$(ns1blankspace.xhtml.container).attr('data-source', sXHTMLElementID);
							ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: -255, topOffset: -17})
							$(ns1blankspace.xhtml.container).html('<table class="ns1blankspaceSearchMedium"><tr><td>' + ns1blankspace.xhtml.loadingSmall + '</td></tr></table>');
							$(ns1blankspace.xhtml.container).show();

							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
							oSearch.addField('title');
							oSearch.addFilter('type', 'EQUAL_TO', iType);
							oSearch.addFilter('id', 'NOT_EQUAL_TO', ns1blankspace.financial.unallocatedAccount);
							oSearch.rows = 100;
							oSearch.sort('title', 'asc');
							oSearch.getResults(function(data) {ns1blankspace.financial.unallocated.edit(oParam, data)});
						}		
					}
					else
					{
						if (aXHTMLElementID[1]) {iItemID = aXHTMLElementID[1]}

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceSearchMedium">');

						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<td class="ns1blankspaceNothing">No accounts</td>');
						}
						else
						{			
							$.each(oResponse.data.rows, function()
							{		
								aHTML.push('<tr class="ns1blankspaceSearch">');
							
								aHTML.push('<td class="ns1blankspaceSearch" id="' +
												'search-' + iItemID + '-' + this.id + '">' +
												this.title +
												'</td>');

								aHTML.push('</tr>');
							});
						}				

						aHTML.push('</table>');
	
						$(ns1blankspace.xhtml.container).html(aHTML.join(''));

						$('td.ns1blankspaceSearch').click(function(event)
						{
							$(ns1blankspace.xhtml.container).hide();

							ns1blankspace.status.working();

							var sID = event.target.id;
							var aID = sID.split('-');

							var sData = 'id=' + ns1blankspace.util.fs(aID[1]);
							sData += '&financialaccount=' + ns1blankspace.util.fs(aID[2]);

							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
								data: sData,
								dataType: 'json',
								success: function(data)
								{
									if (data.status == 'OK')
									{
										ns1blankspace.status.message('Allocated');
										$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
									}
									else
									{
										ns1blankspace.status.error(data.error.errornotes);
									}
								}
							});

						});
					}		
				}													
}


ns1blankspace.financial.invoicing =
{
	data: 		{},

	unsent: 	function ()
				{
					//look for where unsent = N
					
				},

	create: 	{
					//Get invocies old than their set frequency x 100
					//Set .data.create = 
					//Loop through and create invoices - alter data and then just send back in .ajax
				},		

	show: 		function (oParam, oResponse)
				{
					var iStep = 1;
					var iType = 1;
					
					if (oParam != undefined)
					{
						if (oParam.step != undefined) {iStep = oParam.step};
						if (oParam.type != undefined) {iType = oParam.type};
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
										'<td id="ns1blankspaceInvoicingColumn1" style="width:100px; font-size:0.75em;"></td>' +
										'<td id="ns1blankspaceInvoicingColumn2"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainInvoicing').html(aHTML.join(''));
							
						var aHTML = [];

						aHTML.push('<div id="ns1blankspaceInvoicingOption" style="width:85px; margin-top:3px; text-align:right;">');
						aHTML.push('<input type="radio" id="ns1blankspaceInvoicingOption-1" name="radioType" /><label for="ns1blankspaceInvoicingOption-1" style="width: 85px; margin-bottom:1px;">' +
											'Unsent</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceInvoicingOption-2" name="radioType" /><label for="ns1blankspaceInvoicingOption-2" style="width: 85px; margin-bottom:1px;">' +
											'Create</label>');
						aHTML.push('</div>');

						$('#ns1blankspaceInvoicingColumn1').html(aHTML.join(''));
					
						$('#ns1blankspaceInvoicingOption').buttonset().css('font-size', '0.875em');
						
						$('#ns1blankspaceInvoicingOption :radio').click(function()
						{
							var aID = (event.target.id).split('-');
							$.extend(true, oParam, {step: 2, type: parseInt(aID[1])});
							ns1blankspace.financial.unallocated.show(oParam);
						});
					}
					
					if (iStep == 2)
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
								$('#ns1blankspaceUnallocatedColumn1').html('<span class="ns1blankspaceNothing">No unallocated account set up.</span>');
							}
							else
							{	
								$('#ns1blankspaceUnallocatedColumn2').html(ns1blankspace.xhtml.loading);

								var oSearch = new AdvancedSearch();

								if (iType == 1)
								{
									oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
									oSearch.addField('reference,sentdate,invoice.lineitem.amount,invoice.lineitem.description,invoice.lineitem.id');
									oSearch.addFilter('invoice.lineitem.financialaccount', 'EQUAL_TO', ns1blankspace.financial.unallocatedAccount);
									oSearch.addFilter('invoice.sent', 'EQUAL_TO', 'N');

									ns1blankspace.financial.unallocated.row = function (oRow)
									{
										var aHTML = [];
										
										aHTML.push('<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceUnallocated_reference-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["reference"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_date-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["sentdate"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["invoice.lineitem.description"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
														oRow["invoice.lineitem.amount"] + '</td>'); 

										aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
										aHTML.push('<span id="ns1blankspaceReconcileItems_options_search-' + oRow["invoice.lineitem.id"] + '-1"' +
														' class="ns1blankspaceUnallocatedEdit"></span></td>');
										aHTML.push('</tr>');

										return aHTML.join('');
									}
								}
							}	
						}
						else
						{
							var aHTML = [];
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<span class="ns1blankspaceSub">No unallocated items.</span>');
							}
							else
							{
								aHTML.push('<table class="ns1blankspaceColumn2" id="ns1blankspaceUnallocatedItems">' +
											'<tr class="ns1blankspaceHeaderCaption">' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditReference" style="width:100px;">Reference</td>' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditDate" style="width:100px;">Date</td>' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditDescription">Description</td>' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditAmount" style="width:100px; text-align:right;">Amount</td>' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditallocated" class="2"></td>' +
											'</tr>');

								$(oResponse.data.rows).each(function() 
								{
									aHTML.push(ns1blankspace.financial.unallocated.row(this));
								});
								
								aHTML.push('</table>');
							}
							
							ns1blankspace.render.page.show(
							{
								type: 'JSON',
								xhtmlElementID: 'ns1blankspaceUnallocatedColumn2',
								xhtmlContext: 'Unallocated',
								xhtml: aHTML.join(''),
								showMore: (oResponse.morerows == "true"),
								more: oResponse.moreid,
								rows: 100,
								functionShowRow: ns1blankspace.financial.unallocated.row,
								functionOpen: undefined,
								functionNewPage: 'ns1blankspace.financial.unallocated.bind()'
							}); 

							ns1blankspace.financial.unallocated.bind();   	
						}
					}	
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
											'<tr class="ns1blankspaceHeaderCaption">' +
											'<td class="ns1blankspaceHeaderCaption" style="width:150px;">Account</td>' +
											'<td class="ns1blankspaceHeaderCaption" style="width:125px;">Date</td>' +
											'<td class="ns1blankspaceHeaderCaption">Description</td>' +
											'<td class="ns1blankspaceHeaderCaption" style="width:100px; text-align:right;">Amount</td>' +
											'<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
											'</tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push(ns1blankspace.financial.transactions.row(this));
							});
							
							aHTML.push('</table>');

							ns1blankspace.render.page.show(
							{
								xhtmlElementID: sXHTMLElementID,
								xhtmlContext: 'Transaction',
								xhtml: aHTML.join(''),
								showMore: (oResponse.morerows == "true"),
								more: oResponse.moreid,
								rows: 20,
								functionShowRow: ns1blankspace.financial.transactions.row,
								functionNewPage: 'ns1blankspace.financial.transactions.bind()',	
							}); 	
								
							ns1blankspace.financial.transactions.bind();
						}
					}	
				},

	row: 		function(oRow)
				{
					var aHTML = [];
					
					aHTML.push('<tr class="ns1blankspaceRow">');
												
					aHTML.push('<td id="ns1blankspaceFinancialTransaction_financialaccounttext-' + oRow.id + '" class="ns1blankspaceRow">' +
											oRow.financialaccounttext + '</td>');
											
					aHTML.push('<td id="ns1blankspaceFinancialTransaction_date-' + oRow.id + '" class="ns1blankspaceRow">' +
											oRow.date + '</td>');
													
					aHTML.push('<td id="ns1blankspaceFinancialTransaction_description-' + oRow.id + '" class="ns1blankspaceRow">' +
											oRow.description + '</td>');
										
					aHTML.push('<td id="ns1blankspaceFinancialTransaction_amount-' + oRow.id + '" style="text-align:right;" class="ns1blankspaceRow">' +
											oRow.amount + '</td>');
																							
					aHTML.push('</td></tr>');

					return aHTML.join('');
				},

	bind: 		function()
				{

				},			
}

ns1blankspace.financial.item =
{
	show:	function (oParam, oResponse)
			{
				var iObject = ns1blankspace.object;
				var iObjectContext = ns1blankspace.objectContext;
				var sNamespace;
				var bRefresh = false;
				
				if (oParam != undefined)
				{
					if (oParam.object != undefined) {iObject = oParam.object}
					if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
					if (oParam.namespace != undefined) {sNamespace = oParam.namespace}
					if (oParam.refresh != undefined) {bRefresh = oParam.refresh}		
				}
				else
				{
					oParam = {}
				}	
					
				if (oResponse == undefined)
				{	
					if (!bRefresh)
					{	
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceContainer">');

						aHTML.push('<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceItemColumn1" class="ns1blankspaceColumn1Flexible">' +
										ns1blankspace.xhtml.loading + '</td>' +
										'<td id="ns1blankspaceItemColumn2" class="ns1blankspaceColumn2" style="width:200px;"></td>' +
										'</tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainItem').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						
						aHTML.push('<tr><td class="ns1blankspaceAction">' +
										'<span id="ns1blankspaceItemAdd">Add</span>' +
										'</td></tr>');
			
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceItemColumn2').html(aHTML.join(''));
					
						$('#ns1blankspaceItemAdd').button(
						{
							label: "Add"
						})
						.click(function() {
							 ns1blankspace.financial.item.edit(oParam);
						});										
					
					}

					var oSearch = new AdvancedSearch();
					oSearch.method = 'FINANCIAL_ITEM_SEARCH';
					oSearch.addField('financialaccounttext,tax,issuedamount,amount,description');
					oSearch.addFilter('object', 'EQUAL_TO', iObject);
					oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext);
					oSearch.sort('financialaccounttext', 'asc');
					
					oSearch.getResults(function(data) {ns1blankspace.financial.item.show(oParam, data)});
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
						aHTML.push('<table class="ns1blankspace">');

						aHTML.push('<tr>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption style="width:125px;">Account</td>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">' +
										ns1blankspace.option.taxVATCaption + '</td>');

						aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
						aHTML.push('</tr>');

						$.each(oResponse.data.rows, function()
						{
							aHTML.push('<tr class="ns1blankspaceRow">');
														
							aHTML.push('<td id="ns1blankspaceItem_financialaccounttext-' + this.id + '" class="ns1blankspaceRow">' +
											this["financialaccounttext"] + '</td>');
							
							aHTML.push('<td id="ns1blankspaceItem_description-' + this.id + '" class="ns1blankspaceRow">' +
											this["description"] + '</td>');

							aHTML.push('<td id="ns1blankspaceItem_amount-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
											this["amount"] + '</td>');

							aHTML.push('<td id="ns1blankspaceItem_tax-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' +
											this["tax"] + '</td>');

							aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
							aHTML.push('<span id="ns1blankspaceRowItem_options_remove-' + this.id + '" class="ns1blankspaceItemRemove"></span>');
							aHTML.push('</td></tr>');
						});
						
						aHTML.push('</table>');

						$('#ns1blankspaceItemColumn1').html(aHTML.join(''));
						
						$('.ns1blankspaceItemRemove').button( {
							text: false,
							icons: {
								primary: "ui-icon-close"
							}
						})
						.click(function() {
							oParam.xhtmlElementID = this.id;
							ns1blankspace.financial.item.remove(oParam);
						})
						.css('width', '15px')
						.css('height', '17px')
				
						$('.ins1blankspaceItemView').button( {
							text: false,
							icons: {
								primary: "ui-icon-play"
							}
						})
						.click(function() {
							ns1blankspace.financial[sNamespace].item.edit({xhtmlElementID: this.id})
						})
						.css('width', '15px')
						.css('height', '17px')	
					}
				}	
			},

	remove:	function (oParam, oResponse)
			{
				var sXHTMLElementID;
				var sNamespace;
				var iObject = ns1blankspace.object;
				var iObjectContext = ns1blankspace.objectContext;
				var sNamespace;
				
				if (oParam != undefined)
				{
					if (oParam.object != undefined) {iObject = oParam.object}
					if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
					if (oParam.namespace != undefined) {sNamespace = oParam.namespace}
					if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
				}		

				var aXHTMLElementID = sXHTMLElementID.split('-');
				var sID = aXHTMLElementID[1];
				
				if (oResponse == undefined)
				{	
					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
						data: 'remove=1&id=' + sID,
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
								success: function(data){ns1blankspace.financial[sNamespace].refresh()}
							});
							
							ns1blankspace.financial[sNamespace].remove(oParam, data)
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

	edit:	function (oParam, oResponse)
			{
				var iStep = 1;
				var sNamespace;
				var iType = 1;
				
				if (oParam != undefined)
				{
					if (oParam.step != undefined) {iStep = oParam.step}	
					if (oParam.namespace != undefined) {sNamespace = oParam.namespace}	
				}
				
				if (sNamespace === 'expense' || sNamespace === 'payment') {iType = 2}

				if (oResponse == undefined)
				{
					if (iStep == 1)
					{
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');
				
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

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea id="ns1blankspaceItemDescription" class="ns1blankspaceTextMulti" style="height:50px; width:200px;" rows="3" cols="35" ></textarea>' +
										'</td></tr>');		

						if (sNamespace === 'expense' || sNamespace === 'invoice')
						{
							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Account' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceItemAccount" class="ns1blankspaceText">' +
										'</td></tr>');
						}	

						aHTML.push('</table>');
						
						aHTML.push('<table class="ns1blankspaceColumn2" style="margin-top:15px;">');
						
						aHTML.push('<tr><td id="ns1blankspaceItemAddSearchResults"></td></tr>');
														
						aHTML.push('</table>');		
						
						$('#ns1blankspaceItemColumn2').html(aHTML.join(''));
	
						ns1blankspace.financial.util.tax.codes(
						{
							xhtmlElementID: 'ns1blankspaceFinancialTaxCode',
							id: 1,
							type: iType
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
							$.extend(true, oParam, {step: 2});
							if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
					        ns1blankspace.timer.delayCurrent = setTimeout(ns1blankspace.financial.item.edit(oParam), ns1blankspace.option.typingWait);
						});	
							
						$('#ns1blankspaceItemAmount').focus();
					}

					if (iStep == 2)
					{	
						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
						oSearch.addField('title');
						oSearch.addFilter('title', 'TEXT_IS_LIKE', $('#ns1blankspaceItemAccount').val());
						oSearch.addFilter('postable', 'EQUAL_TO', 'Y');
						oSearch.sort('title', 'asc');
						oSearch.getResults(function(data){ns1blankspace.financial.item.edit($.extend(true, oParam, {step:3}), data)});
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
							var cTax = $('#ns1blankspaceItemTax').val();
							if (cTax == '') {cTax = 0};
							
							var sData = 'object=' + ns1blankspace.object;
							sData += '&objectcontext=' + ns1blankspace.objectContext;
							sData += '&financialaccount=' + iAccount;
							sData += '&amount=' + cAmount;
							sData += '&tax=' + cTax;
							sData += '&taxtype=' + ns1blankspace.util.fs($('input[name="radioTaxCode"]:checked').val());
							sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceItemDescription').val());
								
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
								data: sData,
								dataType: 'json',
								success: function(oResponse)
								{
									ns1blankspace.status.message('Added.');

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
											oParam.refresh = true;
											ns1blankspace.financial.item.show(oParam);
											ns1blankspace.financial[sNamespace].refresh();
										}
									});
								}
							});
						})
						.css('width', '20px')
						.css('height', '20px');
					}
				}	
			}
}				

ns1blankspace.financial.save =
{
	send: 		function (oParam, oResponse)
				{
					var sReference;
					var sDate;
					var sDescription;
					var iContactBusiness;
					var iContactPerson;
					var iObject;
					var iBankAccount;
					var iID;
					var sMethod;
					var sSuffix = '';

					if (oParam != undefined)
					{
						if (oParam.reference != undefined) {sReference = oParam.reference}
						if (oParam.date != undefined) {sDate = oParam.date}
						if (oParam.description != undefined) {sDescription = oParam.description}
						if (oParam.contactBusiness != undefined) {iContactBusiness = oParam.contactBusiness}
						if (oParam.contactPerson != undefined) {iContactPerson = oParam.contactPerson}
						if (oParam.object != undefined) {iObject = oParam.object}
						if (oParam.method != undefined) {sMethod = oParam.method}
						if (oParam.id != undefined) {iID = oParam.id}
						if (oParam.bankAccount != undefined) {iBankAccount = oParam.bankAccount}
					}

					ns1blankspace.status.working();

					if (iObject == 3)
					{
						sSuffix = 'paidto';
						sMethod = 'FINANCIAL_PAYMENT_MANAGE';
					}

					if (iObject == 6)
					{
						sSuffix = 'receivedfrom';
						sMethod = 'FINANCIAL_RECEIPT_MANAGE';
					}

					if (iObject == 2)
					{
						sSuffix = 'paidto';
						sMethod = 'FINANCIAL_EXPENSE_MANAGE';
					}

					if (iObject == 5)
					{
						sSuffix = 'receivedfrom';
						sMethod = 'FINANCIAL_INVOICE_MANAGE';
					}

					oParam.method = sMethod;

					var sData = (iID == undefined) ? '' : 'id=' + iID;
						
					sData += '&reference=' + ns1blankspace.util.fs(sReference);
					sData += '&paiddate=' + ns1blankspace.util.fs(sDate);
					sData += '&description=' + ns1blankspace.util.fs(sDescription);
					sData += '&contactbusiness' + sSuffix + '=' + ns1blankspace.util.fs(iContactBusiness);
					sData += '&contactperson' + sSuffix + '=' + ns1blankspace.util.fs(iContactPerson);
					sData += '&bankaccount=' + ns1blankspace.util.fs(iBankAccount);
				
					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI(sMethod),
						data: sData,
						dataType: 'json',
						success: function(data) {ns1blankspace.financial.save.process(oParam, data)}
					});	
				},

	process:	function (oParam, oResponse)
				{
					var iID;

					if (oParam != undefined)
					{
						if (oParam.id != undefined) {iID = oParam.id}
					}

					if (oResponse.status == 'OK')
					{
						if (!iID) {oParam.objectContext = oResponse.id}
						
						ns1blankspace.financial.save.amount(oParam);
					}
					else
					{
						ns1blankspace.status.error(oResponse.error.errornotes);
					}
				},

	amount:		function (oParam)
				{
					var iAccount;
					var cAmount;
					var iObject;
					var iObjectContext;
					var sItemDescription;
					var bComplete = true;
					var bRefresh = false;
					var fPostSave;

					if (oParam != undefined)
					{
						if (oParam.account != undefined) {iAccount = oParam.account}
						if (oParam.amount != undefined) {cAmount = oParam.amount}
						if (oParam.object != undefined) {iObject = oParam.object}
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.itemDescription != undefined) {sItemDescription = oParam.itemDescription}
						if (oParam.complete != undefined) {bComplete = oParam.complete}
						if (oParam.refresh != undefined) {bRefresh = oParam.refresh}
						if (oParam.postSave != undefined) {fPostSave = oParam.postSave}		
					}

					if (!iAccount)
					{
						if (iObject == 3) {iAccount = ns1blankspace.financial.data.settings.financialaccountcreditor}
						if (iObject == 6) {iAccount = ns1blankspace.financial.data.settings.financialaccountdebtor}
					}

					if (cAmount == '') {cAmount = 0};

					if (cAmount == 0 || iAccount == undefined)
					{
						if (iAccount == undefined) {ns1blankspace.status.error('No account set.')}
					}
					else
					{
						var sData = 'object=' + ns1blankspace.util.fs(iObject);
						sData += '&objectcontext=' + ns1blankspace.util.fs(iObjectContext);
						sData += '&financialaccount=' + ns1blankspace.util.fs(iAccount);
						sData += '&amount=' + ns1blankspace.util.fs(cAmount);
						sData += '&description=' + ns1blankspace.util.fs(sItemDescription);
						
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
							data: sData,
							dataType: 'json',
							success: function(oResponse)
							{
								if (bComplete)
								{	
									var sData = 'object=' + iObject;
									sData += '&objectcontext=' + iObjectContext;
								
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_COMPLETE'),
										data: sData,
										dataType: 'json',
										success: function(oResponse)
										{
											if (bRefresh)
											{
												var aMethod = sMethod.split('_');
												ns1blankspace.financial[aMethod[1].toLowerCase()].refresh()
											};

											if (fPostSave) {fPostSave(oParam, oResponse)}

											ns1blankspace.status.message('Saved');
										}
									});
								}
								else
								{
									ns1blankspace.status.message('Saved');
								}
							}
						});
					}	
				}
}

ns1blankspace.financial.util =
{
	tax: 		{
					codes: 		function (oParam)
								{
									var iType = 1;
									var sXHTMLElementID;
									var iID;
								
									if (oParam != undefined)
									{
										if (oParam.type != undefined) {iType = oParam.type}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.id != undefined) {iID = oParam.id}
									}

									if (iType == 1)  //Sales
									{	
										var sHTML = '<input type="radio" id="radioTaxCode1" name="radioTaxCode" value="1" data-rate="10"/>Applies' +
													'<br /><input type="radio" id="radioTaxCode2" name="radioTaxCode" value="2" data-rate="0"/>Export' +
													'<br /><input type="radio" id="radioTaxCode3" name="radioTaxCode" value="3" data-rate="0"/>Free' +
													'<br /><input type="radio" id="radioTaxCode4" name="radioTaxCode" value="4" data-rate="0"/>Input Taxed' +
													'<br /><input type="radio" id="radioTaxCode5" name="radioTaxCode" value="5" data-rate="0"/>Excluded';
									}

									if (iType == 2)  //Purchases
									{	
										var sHTML = '<input type="radio" id="radioTaxCode1" name="radioTaxCode" value="1" data-rate="10"/>Applies' +
													'<br /><input type="radio" id="radioTaxCode2" name="radioTaxCode" value="2" data-rate="0"/>Input Taxed' +
													'<br /><input type="radio" id="radioTaxCode3" name="radioTaxCode" value="3" data-rate="0"/>Free' +
													'<br /><input type="radio" id="radioTaxCode4" name="radioTaxCode" value="4" data-rate="0"/>Entertainment' +
													'<br /><input type="radio" id="radioTaxCode5" name="radioTaxCode" value="5" data-rate="0"/>Excluded';
									}

									if (sXHTMLElementID)
									{
										$('#' + sXHTMLElementID).html(sHTML)

										if (iID)
										{
											$('[name="radioTaxCode"][value="' + iID + '"]').attr('checked', true);
										}	
									}	
									else
									{
										return sHTML;
									}
								},

					calculate: 	function (oParam)
								{
									var cAmount;
									var sAmountXHTMLElementID;
									var cTax;
									var sTaxXHTMLElementID;
									var cRate;
									var sRateXHTMLElementName = 'radioTaxCode';
									var bTaxIncludedInAmount = true;
									
									if (oParam != undefined)
									{
										if (oParam.amount != undefined) {cAmount = oParam.amount}
										if (oParam.amountXHTMLElementID != undefined) {sAmountXHTMLElementID = oParam.amountXHTMLElementID}
										if (oParam.tax != undefined) {cTax = oParam.tax}
										if (oParam.taxXHTMLElementID != undefined) {sTaxXHTMLElementID = oParam.taxXHTMLElementID}
										if (oParam.taxIncludedInAmount != undefined) {bTaxIncludedInAmount = oParam.taxIncludedInAmount}	
									}

									if (cRate === undefined)
									{
										cRate = parseFloat($('input[name="' + sRateXHTMLElementName + '"]:checked').attr("data-rate"))
									}

									if (cAmount === undefined)
									{
										cAmount = parseFloat($('#' + sAmountXHTMLElementID).val());
									}

									if (cRate == 0)
									{
										cTax = 0;
									}
									else
									{
										if (bTaxIncludedInAmount)
										{
											cTax = (cAmount - (cAmount / (1 + cRate / 100)));
										}	
										else
										{
											cTax = CurrencyDefault((cRate / 100) * cTax)
										}
									}

									if (sTaxXHTMLElementID)
									{
										$('#' + sTaxXHTMLElementID).val((cTax).toFixed(2))
									}
								}
				},

	credit: 	{
					show:	function (oParam, oResponse)
							{
								var iObject = ns1blankspace.object;
								var iObjectContext = ns1blankspace.objectContext;
								var sNamespace;
								var bRefresh = false;
								
								if (oParam != undefined)
								{
									if (oParam.object != undefined) {iObject = oParam.object}
									if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
									if (oParam.namespace != undefined) {sNamespace = oParam.namespace}
									if (oParam.refresh != undefined) {bRefresh = oParam.refresh}		
								}
								else
								{
									oParam = {}
								}	
									
								if (oResponse == undefined)
								{	
									if (!bRefresh)
									{	
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">');

										aHTML.push('<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceCreditColumn1" class="ns1blankspaceColumn1Flexible">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspaceCreditColumn2" class="ns1blankspaceColumn2" style="width:200px;"></td>' +
														'</tr>');

										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainCredit').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
										
										
										aHTML.push('<tr><td class="ns1blankspaceAction">' +
														'<span id="ns1blankspaceCreditAdd">Add</span>' +
														'</td></tr>');
							
										aHTML.push('</table>');					
										
										$('#ns1blankspaceCreditColumn2').html(aHTML.join(''));
									
										$('#ns1blankspaceCreditAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											 ns1blankspace.financial.util.credit.edit(oParam);
										});										
									
									}

									var oSearch = new AdvancedSearch();
									oSearch.method = 'FINANCIAL_CREDIT_NOTE_SEARCH';
									oSearch.addField('creditdate,notes,amount,tax,type,typetext');
									oSearch.addFilter('object', 'EQUAL_TO', iObject);
									oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext);
									oSearch.sort('creditdate', 'desc');
									
									oSearch.getResults(function(data) {ns1blankspace.financial.util.credit.show(oParam, data)});
								}
								else
								{
									var aHTML = [];
									var h = -1;
									
									if (oResponse.data.rows.length == 0)
									{
										aHTML.push('<table><tr><td class="ns1blankspaceNothing">No credit (notes).</td></tr></table>');

										$('#ns1blankspaceCreditColumn1').html(aHTML.join(''));
									}
									else
									{
										aHTML.push('<table class="ns1blankspace">');

										aHTML.push('<tr>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption style="width:125px;">Date</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption">Notes</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">' +
														ns1blankspace.option.taxVATCaption + '</td>');

										aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
										aHTML.push('</tr>');

										$.each(oResponse.data.rows, function()
										{
											aHTML.push('<tr class="ns1blankspaceRow">');
																		
											aHTML.push('<td id="ns1blankspaceCredit_date-' + this.id + '" class="ns1blankspaceRow">' +
															this['creditdate'] + '</td>');
											
											aHTML.push('<td id="ns1blankspaceCredit_description-' + this.id + '" class="ns1blankspaceRow">' +
															this["notes"] + '</td>');

											aHTML.push('<td id="ns1blankspaceCredit_amount-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
															this["amount"] + '</td>');

											aHTML.push('<td id="ns1blankspaceCredit_tax-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' +
															this["tax"] + '</td>');

											aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
											aHTML.push('<span id="ns1blankspaceRowItem_options_remove-' + this.id + '" class="ns1blankspaceCreditRemove"></span>');
											aHTML.push('</td></tr>');
										});
										
										aHTML.push('</table>');

										$('#ns1blankspaceCreditColumn1').html(aHTML.join(''));
										
										$('.ns1blankspaceCreditRemove').button( {
											text: false,
											icons: {
												primary: "ui-icon-close"
											}
										})
										.click(function() {
											oParam.xhtmlElementID = this.id;
											ns1blankspace.financial.credit.remove(oParam);
										})
										.css('width', '15px')
										.css('height', '17px')
								
										$('.ns1blankspaceCreditView').button( {
											text: false,
											icons: {
												primary: "ui-icon-play"
											}
										})
										.click(function() {
											//ns1blankspace.financial.util.credit.edit({xhtmlElementID: this.id})
										})
										.css('width', '15px')
										.css('height', '17px')	
									}
								}	
							}
				}											
}					
