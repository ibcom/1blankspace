/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

ns1blankspace.financial.init = function (oParam)
					{
						var bInitialised = false;

						if (oParam != undefined)
						{
							if (oParam.initialised != undefined) {bInitialised = oParam.initialised}
						}

						ns1blankspace.app.reset();

						ns1blankspace.object = -2;
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

ns1blankspace.financial.search = {send: function () {}};

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
							ns1blankspace.financial.data = {defaults: {}};
							ns1blankspace.financial.initStatus = undefined;
							ns1blankspace.financial.data.types = 
							[
								{
									id: 1,
									name: 'Expense',
									object: 2
								},
								{
									id: 2,
									name: 'Income',
									object: 2
								},
								{
									id: 3,
									name: 'Asset'
								},
								{
									id: 4,
									name: 'Liability'
								},
								{
									id: 5,
									name: 'Equity'
								}
							]

							ns1blankspace.financial.data.objects = 
							[
								{
									id: 2,
									name: 'Expense'
								},
								{
									id: 5,
									name: 'Invoice'
								},
								{
									id: 3,
									name: 'Payment'
								},
								{
									id: 6,
									name: 'Receipt'
								},
								{
									id: 69,
									name: 'Credit'
								},
								{
									id: 122,
									name: 'Journal'
								}
							]
						}

						if (ns1blankspace.financial.initStatus != 2 || bRefresh)
						{
							if (iStep == 0)
							{
								if (oResponse == undefined)
								{
									$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
									ns1blankspace.status.working('initalising financials')
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
										oSearch.addField('title,lastreconciledamount,lastreconcileddate,notes,status,financialaccount,accountname,bsb,accountnumber,defaultpaymentaccount,defaultreceiptaccount,bank');
										oSearch.addFilter('status', 'EQUAL_TO', 1)
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
											url: '/ondemand/setup/?method=SETUP_FINANCIAL_SETTINGS_SEARCH&all=1&includefinancialaccounttext=1',
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
									var oSearch = new AdvancedSearch();
									oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
									oSearch.addField('title,type');
									oSearch.addFilter('title', 'TEXT_IS_LIKE', 'Unallocated');					
									oSearch.getResults(function(data) {ns1blankspace.financial.initData(oParam, data)});	
								}
								else
								{
									ns1blankspace.financial.data.settings.financialaccountunallocated = {incoming: undefined, outgoing: undefined};

									var oUnallocatedAccount = $.grep(oResponse.data.rows, function (account) {return account.type==2})[0];
									if (oUnallocatedAccount != undefined)
									{
										ns1blankspace.financial.data.settings.financialaccountunallocated.incoming = oUnallocatedAccount.id;
									}

									var oUnallocatedAccount = $.grep(oResponse.data.rows, function (account) {return account.type==1})[0];
									if (oUnallocatedAccount != undefined)
									{
										ns1blankspace.financial.data.settings.financialaccountunallocated.outgoing = oUnallocatedAccount.id;
									}
	
									ns1blankspace.financial.initData($.extend(true, oParam, {step: 4}));
								}
							}

							if (iStep == 4)
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
										ns1blankspace.financial.initData($.extend(true, oParam, {step: 5}));
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

										var oParentAccount;

										$.each(ns1blankspace.financial.data.accounts, function (a, account)
										{
											if (account.expensecostofsale == 'Y' && account.type == '1')
											{
												account._cos = 'Y';
												oParentAccount = $.grep(ns1blankspace.financial.data.accounts, function (pa) {return pa.id == account.parentaccount})[0];
												if (oParentAccount != undefined)
												{
													oParentAccount._cos = 'Y';
												}
											}
										});

										ns1blankspace.setup.financial.accounts.tree(ns1blankspace.financial.accounts[ns1blankspace.financial.rootaccount],ns1blankspace.financial.accounts); 
										ns1blankspace.financial.data.rootAccounts = $.grep(ns1blankspace.financial.data.accounts, function (a) {return parseInt(a.parentaccount) == parseInt(ns1blankspace.financial.rootAccount);})
				
										ns1blankspace.financial.initData($.extend(true, oParam, {step: 5}));
									}	
								}
							}

							if (iStep == 5)
							{
								//If no incoming Unallocated but Debtors then
								if (ns1blankspace.financial.data.settings.financialaccountunallocated.incoming == undefined
									&& ns1blankspace.financial.data.settings.financialaccountdebtor != undefined)
								{
									//need to create the unallocated account

									var oRootAccount = $.grep(ns1blankspace.financial.data.rootAccounts, function (ra) {return ra.type == 2})[0];

									var oData =
									{
										code: '-',
										title: 'Unallocated',
										parentaccount: oRootAccount.id,
										postable: 'Y',
										taxtype: 1,
										type: 2
									}

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_ACCOUNT_MANAGE'),
										data: oData,
										dataType: 'json',
										success: function(data)
										{
											ns1blankspace.financial.initData($.extend(true, oParam, {step: 3, refresh: true}));
										}
									});	
								}
								else
								{
									ns1blankspace.financial.initData($.extend(true, oParam, {step: 6}));
								}
							}

							if (iStep == 6)
							{
								//If no outgoing Unallocated but Creditors then
								if (ns1blankspace.financial.data.settings.financialaccountunallocated.outgoing == undefined
										&& ns1blankspace.financial.data.settings.financialaccountcreditor != undefined)
								{
									//need to create the unallocated account

									var oRootAccount = $.grep(ns1blankspace.financial.data.rootAccounts, function (ra) {return ra.type == 1})[0];

									var oData =
									{
										code: '-',
										title: 'Unallocated',
										parentaccount: oRootAccount.id,
										postable: 'Y',
										taxtype: 1,
										type: 1
									}

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_ACCOUNT_MANAGE'),
										data: oData,
										dataType: 'json',
										success: function(data)
										{
											ns1blankspace.financial.initData($.extend(true, oParam, {step: 3, refresh: true}));
										}
									});	
								}
								else
								{
									ns1blankspace.financial.initData($.extend(true, oParam, {step: 7}));
								}
							}

							if (iStep == 7)
							{	
								if (oResponse == undefined)
								{
									var oSearch = new AdvancedSearch();
									oSearch.method = 'CORE_SPACE_PROFILE_SEARCH';
									oSearch.addField('attribute,value');
									oSearch.addFilter('attribute', 'IN_LIST', '528');
									oSearch.getResults(function(data) {ns1blankspace.financial.initData(oParam, data)});
								}
								else
								{
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspace.setup.financial.save.profile({attribute: 528, value: 'Tax'});
										ns1blankspace.financial.data.settings.taxexpensedescription = 'Tax';
									}
									else
									{
										ns1blankspace.financial.data.settings.taxexpensedescription = oResponse.data.rows[0].value
									}

									ns1blankspace.financial.initData($.extend(true, oParam, {step: 8})); 
								}	
							}
							
							if (iStep == 8)
							{
								ns1blankspace.financial.initStatus = 2;
								ns1blankspace.status.message('&nbsp;');
								ns1blankspace.financial.initWhenDataInitalised(oParam);
							}
						}
						else
						{
							ns1blankspace.financial.initWhenDataInitalised(oParam);
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
								oParam.step = undefined;
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

ns1blankspace.financial.home = function (oParam)
					{	
						var sFunctionDefault = ns1blankspace.util.getParam(oParam, 'functionDefault', {"default": 'ns1blankspace.financial.summary()'}).value;
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
						
						aHTML.push('</table>');		

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlDebtors" class="ns1blankspaceControl">Debtors<br /><span class="ns1blankspaceSub" style="font-size:0.75em;">owed to you</span></td>' +
									'</tr>');	
						
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlCreditors" class="ns1blankspaceControl" style="padding-top:7px;">Creditors<br /><span class="ns1blankspaceSub" style="font-size:0.75em;">you owe</span></td>' +
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
									'<td id="ns1blankspaceControlTax" class="ns1blankspaceControl"><div>Tax</div>' +
									'<div class="ns1blankspaceSub" style="font-size:0.75em;">GST &</div>' +
									'<div class="ns1blankspaceSub" style="font-size:0.75em;">Employee</div></td>' +
									'</tr>');				
						
						aHTML.push('</table>');	

						aHTML.push('<table class="ns1blankspaceControl">');

						if (ns1blankspace.financial.compliance != undefined)
						{
							aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlCompliance" class="ns1blankspaceControl">Compliance<br /><span class="ns1blankspaceSub" style="font-size:0.75em;">for auditing</span></td>' +
									'</tr>');
						}
						
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlAccounts" class="ns1blankspaceControl">Accounts<br /><span class="ns1blankspaceSub" style="font-size:0.75em;">& transactions</span></td>' +
									'</tr>');
									
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlUnallocated" class="ns1blankspaceControl">Unallocated</td>' +
									'</tr>');

						aHTML.push('</table>');	

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlNotes" class="ns1blankspaceControl">Notes</td>' +
									'</tr>');

						aHTML.push('</table>');	

						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						var aHTML = [];
						
						aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainBankAccount" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainDebtors" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainCreditors" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainPL" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainBS" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainTax" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainAccounts" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainUnallocated" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainInvoicing" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainCompliance" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
						aHTML.push('<div id="ns1blankspaceMainNotes" class="ns1blankspaceControlMain"></div>');
						
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
							ns1blankspace.financial.profitLoss.show({showAll: false});
						});	
						
						$('#ns1blankspaceControlBS').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainBS'});
							ns1blankspace.financial.balanceSheet.show({showAll: false});
						});

						$('#ns1blankspaceControlTax').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainTax'});
							ns1blankspace.financial.taxSummary.show();
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

						$('#ns1blankspaceControlAttachments').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
							ns1blankspace.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments', object: 147, objectContext: 0});
						});

						$('#ns1blankspaceControlNotes').click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainNotes'});
							ns1blankspace.financial.notes.init();
						});	

						if (ns1blankspace.financial.compliance != undefined)
						{
							$('#ns1blankspaceControlCompliance').click(function(event)
							{
								ns1blankspace.show({selector: '#ns1blankspaceMainCompliance'});
								ns1blankspace.financial.compliance.init();
							});
						}	

						$('#ns1blankspaceControlSummary').addClass('ns1blankspaceHighlight');

						var oXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID');

						if (oXHTMLElementID.exists)
						{
							$('.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
							$('#' + oXHTMLElementID.value).addClass('ns1blankspaceHighlight');
							$('#' + oXHTMLElementID.value).click()
						}
						else
						{
							ns1blankspace.history.control({functionDefault: sFunctionDefault});
							ns1blankspace.history.control(oParam);
						}
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
									'<td id="ns1blankspaceSummaryColumn3">' +
									'</td>' +
									'</tr>' +
									'</table>');				
					
					$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
					
					var aHTML = [];
				
					aHTML.push('<table class="ns1blankspaceColumn2" style="margin-left:5px;">');
					
					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Debtors</td></tr>' +
									'<tr><td class="ns1blankspaceSummary">' +
									(ns1blankspace.financial.data.settings.lockeddatedebtors != ''?ns1blankspace.financial.data.settings.lockeddatedebtors:'Not locked') +
									'</td></tr>');

					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Creditors</td></tr>' +
									'<tr><td class="ns1blankspaceSummary">' +
									(ns1blankspace.financial.data.settings.lockeddatecreditors != ''?ns1blankspace.financial.data.settings.lockeddatecreditors:'Not locked')+
									'</td></tr>');
					
					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Journals (General)</td></tr>' +
									'<tr><td class="ns1blankspaceSummary">' +
									(ns1blankspace.financial.data.settings.lockeddatejournals != ''?ns1blankspace.financial.data.settings.lockeddatejournals:'Not locked') +
									'</td></tr>');
					
					aHTML.push('</table>');			
					
					$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));

					aHTML = [];

					aHTML.push('<table class="ns1blankspaceColumn2" style="margin-left:5px;">');
					
					/*
					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Bank Accounts</td></tr>' +
									'<tr><td class="ns1blankspaceSummary" id="ns1blankspaceFinancialSummaryBankAccounts">' +
									ns1blankspace.financial.data.bankaccounts.length +
									'</td></tr>');
					*/

					aHTML.push('<tr><td id="ns1blankspaceFinancialSummaryReceipts" class="ns1blankspaceSummaryCaption" style="cursor:pointer;">Receipts</td></tr>' +
									'<tr><td><table>' +
										'<tr><td class="ns1blankspaceHeaderCaption" style="font-size:0.875em;">Unallocated</td><td class="ns1blankspaceHeaderCaption" style="font-size:0.875em;">Unreconciled</td></tr>' + 
										'<tr><td class="ns1blankspaceSummary" id="ns1blankspaceFinancialSummaryUnallocatedReceipts">-</td>' +
												'<td class="ns1blankspaceSummary" id="ns1blankspaceFinancialSummaryUnreconciledReceipts">-</td></tr>' +
										'</table>' +
									'</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceFinancialSummaryPayments" class="ns1blankspaceSummaryCaption" style="cursor:pointer;">Payments</td></tr>' +
									'<tr><td><table>' +
										'<tr><td class="ns1blankspaceHeaderCaption" style="font-size:0.875em;">Unallocated</td><td class="ns1blankspaceHeaderCaption" style="font-size:0.875em;">Unreconciled</td></tr>' + 
										'<tr><td class="ns1blankspaceSummary" id="ns1blankspaceFinancialSummaryUnallocatedPayments">-</td>' +
												'<td class="ns1blankspaceSummary" id="ns1blankspaceFinancialSummaryUnreconciledPayments">-</td></tr>' +
										'</table>' +
									'</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceFinancialSummaryBankAccountTransactions" class="ns1blankspaceSummaryCaption" style="cursor:pointer;">Bank Account Transactions</td></tr>' +
									'<tr><td><table>' +
										'<tr><td class="ns1blankspaceHeaderCaption" style="font-size:0.875em;">Unconfirmed</td><td class="ns1blankspaceHeaderCaption" style="font-size:0.875em;">Unreconciled</td></tr>' + 
										'<tr><td class="ns1blankspaceSummary" id="ns1blankspaceFinancialSummaryUnconfirmedBankAccountTransactions">-</td><td class="ns1blankspaceSummary" id="ns1blankspaceFinancialSummaryUnreconciledBankAccountTransactions">-</td></tr>' +
										'</table>' +
									'</td></tr>');


					aHTML.push('</table>');

					$('#ns1blankspaceSummaryColumn3').html(aHTML.join(''));

					$('#ns1blankspaceFinancialSummaryReceipts').click(function(event)
					{
						ns1blankspace.financial.receipt.init();
					});

					$('#ns1blankspaceFinancialSummaryPayments').click(function(event)
					{
						ns1blankspace.financial.payment.init();
					});

					$('#ns1blankspaceFinancialSummaryBankAccountTransactions').click(function(event)
					{
						ns1blankspace.financial.bankAccount.init();
					});	

					ns1blankspace.financial.summaryData();
				}

ns1blankspace.financial.summaryData = function (oParam, oResponse)
				{
					var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1}).value

					if (iStep == 1)
					{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_ITEM_SEARCH';
							oSearch.addField('id');
							oSearch.addSummaryField('count(id) total');
							oSearch.addFilter('financialaccount', 'EQUAL_TO', ns1blankspace.financial.data.settings.financialaccountunallocated.incoming);
							oSearch.addFilter('amount', 'NOT_EQUAL_TO', 0);
							oSearch.rows = 0
							oSearch.getResults(function(oResponse)
							{
								$('#ns1blankspaceFinancialSummaryUnallocatedReceipts').html(oResponse.summary.total);
								ns1blankspace.financial.summaryData({step: 2})
							})
					}

					if (iStep == 2)
					{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_ITEM_SEARCH';
							oSearch.addField('id');
							oSearch.addSummaryField('count(id) total');
							oSearch.addFilter('financialaccount', 'EQUAL_TO', ns1blankspace.financial.data.settings.financialaccountunallocated.outgoing);
							oSearch.addFilter('amount', 'NOT_EQUAL_TO', 0);
							oSearch.rows = 0
							oSearch.getResults(function(oResponse)
							{
								$('#ns1blankspaceFinancialSummaryUnallocatedPayments').html(oResponse.summary.total);
								ns1blankspace.financial.summaryData({step: 3});
							})
					}

					if (iStep == 3)
					{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
							oSearch.addField('id');
							oSearch.addSummaryField('count(id) total');
							oSearch.addFilter('reconciliation', 'IS_NULL');
							oSearch.getResults(function(oResponse)
							{
								$('#ns1blankspaceFinancialSummaryUnreconciledReceipts').html(oResponse.summary.total);
								ns1blankspace.financial.summaryData({step: 4});
							})
					}

					if (iStep == 4)
					{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
							oSearch.addField('id');
							oSearch.addSummaryField('count(id) total');
							oSearch.addFilter('reconciliation', 'IS_NULL');
							oSearch.getResults(function(oResponse)
							{
								$('#ns1blankspaceFinancialSummaryUnreconciledPayments').html(oResponse.summary.total);
								ns1blankspace.financial.summaryData({step: 5});
							})
					}

					if (iStep == 5)
					{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
							oSearch.addField('bankaccounttext,count(id) bankaccounttotal');
							oSearch.addSummaryField('count(id) total');
							oSearch.addFilter('status', 'EQUAL_TO', 1);
							oSearch.addFilter('bankaccount', 'IS_NOT_NULL');
							oSearch.rows = 100;
							oSearch.getResults(function(oResponse)
							{
								$('#ns1blankspaceFinancialSummaryUnconfirmedBankAccountTransactions').html(oResponse.summary.total);
								ns1blankspace.financial.summaryData({step: 6});
							})
					}

					if (iStep == 6)
					{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
							oSearch.addField('bankaccounttext,count(id) bankaccounttotal');
							oSearch.addSummaryField('count(id) total');
							oSearch.addFilter('status', 'EQUAL_TO', 3);
							oSearch.addFilter('bankaccount', 'IS_NOT_NULL');
							oSearch.getResults(function(oResponse)
							{
								$('#ns1blankspaceFinancialSummaryUnreconciledBankAccountTransactions').html(oResponse.summary.total);
							})
					}
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

ns1blankspace.financial.optimise =
{
	start: 		function (oParam)
				{
					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('FINANCIAL_DEBTORSCREDITORS_PROCESSING_MANAGE'),
						dataType: 'json',
						global: false,
						success: function(oResponse)
						{
							if (oResponse.status == 'OK')
							{	
								ns1blankspace.status.message('Complete');
								ns1blankspace.util.onComplete(oParam);
							}	
						}
					});			
				}		
}

ns1blankspace.financial.debtors =
{
	data: 	{},

	show: 	function (oParam, oResponse)
				{
					var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": 1}).value;
					var iView = ns1blankspace.util.getParam(oParam, 'view', {"default": 1}).value;
					var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
					var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceMainDebtors'}).value;
					var bShowInvoices = ns1blankspace.util.getParam(oParam, 'showInvoices', {"default": true}).value;

					if (sEndDate == undefined)
					{
						if (ns1blankspace.financial.data.defaults.enddate != undefined)
						{
							sEndDate = ns1blankspace.financial.data.defaults.enddate;
						}
						else
						{
							sEndDate = Date.today().toString("dd MMM yyyy");
						}
					}

					if (sEndDate != Date.today().toString("dd MMM yyyy"))
					{
						bShowInvoices = false;
						oParam = ns1blankspace.util.setParam(oParam, 'showInvoices', false);
					}

					if (oParam == undefined) {oParam = {}}

					if (oResponse == undefined)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDebtors'});

						ns1blankspace.financial.data.debtors = [];

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDebtorsColumn1">' + ns1blankspace.xhtml.loading + '</td>' +
										'<td id="ns1blankspaceDebtorsColumn2" style="width:120px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#' + sXHTMLElementID).html(aHTML.join(''));

						var aHTML = [];
														
						aHTML.push('<table class="ns1blankspaceColumn2">');
							
						aHTML.push('<tr><td><div id="ns1blankspaceDebtorsType">');											
						aHTML.push('<input style="width: 100%;" type="radio" id="ns1blankspaceDebtorsType-1" data-1blankspace="ignore" name="radioType" checked="checked" /><label for="ns1blankspaceDebtorsType-1" style="margin-bottom:2px; font-size:0.875em; width:115px;">' +
										'Last Receipt</label>');
						aHTML.push('<input style="width: 100%;" type="radio" id="ns1blankspaceDebtorsType-4" data-1blankspace="ignore" name="radioType" /><label for="ns1blankspaceDebtorsType-4" style="font-size:0.875em; width:115px;">' +
										'30, 60, 90</label>');
						aHTML.push('</div></td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceDate" style="padding-bottom:4px;">' +
										'<input id="ns1blankspaceDebtorsEndDate" data-1blankspace="ignore" class="ns1blankspaceDate ns1blankspaceWatermark" style="padding-left:3px; width:113px; font-size:0.725em;" value="As at">' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:2px; padding-bottom:0px; font-size:0.75em;" class="ns1blankspaceSub">' +
										'Debtors total</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceFinancialDebtorsTotal" style="padding-top:0px; font-size:1.2em;" class="ns1blankspaceSub">' +
										'</td></tr>');
								
						aHTML.push('<tr><td style="padding-top:12px;"><span id="ns1blankspaceFinancialDebtorsPreview" class="ns1blankspaceAction">' +
										'Statements</span></td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceFinancialDebtorsPreviewStatus" style="padding-top:5px; padding-bottom:12px; font-size:0.75em;" class="ns1blankspaceSub">' +
										'Create statements for selected debtors</td></tr>');

						aHTML.push('<tr><td><span id="ns1blankspaceFinancialDebtorsEmail" class="ns1blankspaceAction">' +
										'Email</span></td></tr>');

						aHTML.push('<tr><td style="padding-top:14px;"><span class="ns1blankspaceAction" id="ns1blankspaceDebtorsCreatePDF"  style="width:95px;">' +
										'Create PDF</span></td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceFinancialDebtorsEmailStatus" style="padding-top:10px; font-size:0.75em;" class="ns1blankspaceSub"></td></tr>');

						aHTML.push('</table>');

						$('#ns1blankspaceDebtorsColumn2').html(aHTML.join(''));

						$('#ns1blankspaceDebtorsType-' + iType).attr('checked', true);	

						$('#ns1blankspaceDebtorsType').buttonset().css('font-size', '0.75em');
								
						$('#ns1blankspaceDebtorsType :radio').click(function()
						{
							var aID = (this.id).split('-');
							oParam = ns1blankspace.util.setParam(oParam, 'type', parseInt(aID[1]));
							ns1blankspace.financial.debtors.show(oParam);
						});

						ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

						$('#ns1blankspaceDebtorsEndDate').change(function()
						{
							oParam = ns1blankspace.util.setParam(oParam, 'endDate', $('#ns1blankspaceDebtorsEndDate').val());
							ns1blankspace.financial.debtors.show(oParam)
						});

						$('#ns1blankspaceFinancialDebtorsPreview').button(
						{
							label: 'Statements'
						})
						.click(function()
						{	
							ns1blankspace.financial.debtors.preview.init(oParam)
						})
						.css('width', '115px');

						$('#ns1blankspaceFinancialDebtorsEmail').button(
						{
							label: 'Email'
						})
						.click(function()
						{	
							oParam = {onCompleteWhenCan: ns1blankspace.financial.debtors.email.init};
							ns1blankspace.financial.debtors.preview.init(oParam);
						})
						.css('width', '115px');

						var oData = {reportby: iType, rows: 1000, view: iView}

						if (sEndDate !== undefined)
						{
							oParam.endDate = sEndDate;
							oData.enddate = sEndDate;
							$('#ns1blankspaceDebtorsEndDate').removeClass('ns1blankspaceWatermark').val(sEndDate);
						}

						$('#ns1blankspaceDebtorsCreatePDF').button(
						{
							label: 'Create PDF'
						})
						.click(function(event)
						{
							var sHTML = '<style>.ui-button, input {display:none;} td.ns1blankspaceRowSelect {color:#000000;}</style>' + $('#ns1blankspaceDebtorsColumn1').html();

							var sURL = document.location.protocol + '//' + document.location.host;
							var aHeaderHTML =
							[
								'<div style="margin-bottom:20px;">',
								'<div style="font-size:2em;">' + ns1blankspace.user.contactBusinessText + '</div>',
								'<div style="font-size:1.6em;">DEBTORS</div>',
							];

							aHeaderHTML.push('<div>');

							if ($('#ns1blankspaceDebtorsEndDate').val() != '')
							{
								var sDate = $('#ns1blankspaceDebtorsEndDate').val();
								if (sDate == 'As at') {sDate = Date.today().toString("dd MMM yyyy")}
								aHeaderHTML.push('As at ' + sDate);
							}

							aHeaderHTML.push('</div>');

							aHeaderHTML.push('</div><hr>');

							ns1blankspace.pdf.create(
							{
								xhtmlContent: aHeaderHTML.join('') + sHTML,
								filename: 'debtors.pdf',
								open: true,
								leftmargin: 45,
								topmargin: 1,
								headerheight: 15,
								footerheight: 15,
								baseURLBody: sURL,
								object: 12,
								objectContext: ns1blankspace.spaceContactBusiness
							});
						})
						.css('width', '115px');

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_DEBTOR_SEARCH'),
							dataType: 'json',
							data: oData,
							global: false,
							success: function(oResponse)
							{
								if (oResponse.status == 'OK')
								{	
									ns1blankspace.financial.debtors.show(oParam, oResponse);
								}
								else
								{
									if (oResponse.error.errorcode == '4')
									{	
										if (oResponse.error.errornotes.indexOf('FINANCIAL_DEBTORSCREDITORS_PROCESSING_MANAGE') != -1)
										{	
											ns1blankspace.status.working('Optimising debtors');
											oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.debtors.show)
											ns1blankspace.financial.optimise.start(oParam);
										}
									}
								}	
							}
						});			
					}
					else
					{
						if (oParam != undefined)
						{
							ns1blankspace.financial.data.defaults.enddate = oParam.endDate;
						}	

						var aHTML = [];

						$('#ns1blankspaceFinancialDebtorsTotal').html('-');
						
						if (oResponse.status == 'ER')
						{
							aHTML.push('<table>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceNothing">No debtors</td>' +
										'</tr></table>');

							$('#ns1blankspaceDebtorsColumn1').html(aHTML.join(''));
						}
						else
						{
							if (oResponse.data.rows.length == 0 )
							{
								aHTML.push('<table>' +
												'<tr class="ns1blankspace">' +
												'<td class="ns1blankspaceNothing">No debtors</td>' +
												'</tr></tbody></table>');

								$('#ns1blankspaceDebtorsColumn1').html(aHTML.join(''));
							}
							else
							{
								aHTML.push('<table id="ns1blankspaceFinancialDebtors" class="ns1blankspace" style="font-size:0.925em;">' +
												'<tr class="ns1blankspaceCaption">' +
												'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspaceDebtorsSelectAll"></span></td>' +
												'<td class="ns1blankspaceHeaderCaption" style="width:180px;">Debtor</td>' +
												'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount Owed</td>')

								if (iType == 1)
								{	
									aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">Last Receipt</td>');
								}
								else
								{
									aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">' +
													oResponse.CurrentDescription +
													'<br /><span style="font-size:0.625em;">(0&nbsp;to&nbsp;30)</span></td>' +
													'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">' +
													oResponse['31-60Description'] +
													'<br /><span style="font-size:0.625em;">(31&nbsp;to&nbsp;60)</span></td>' +
													'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">' +
													oResponse['61-90Description'] +
													'<br /><span style="font-size:0.625em;">(61&nbsp;to&nbsp;90)</span></td>' +
													'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">' +
													(oResponse['91Description']).replace(' or ', '<br />or&nbsp;') +
													'<br /><span style="font-size:0.625em;">(91&nbsp;+)</span></td>');	
								}				

								aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
												'</tr>');
								
								$(oResponse.data.rows).each(function() 
								{
									aHTML.push(ns1blankspace.financial.debtors.row(this, oParam));
								});
								
								aHTML.push('</table>');

								ns1blankspace.render.page.show(
							   {
									type: 'JSON',
									xhtmlElementID: 'ns1blankspaceDebtorsColumn1',
									xhtmlContext: 'Debtors',
									xhtml: aHTML.join(''),
									showMore: (oResponse.morerows == "true"),
									more: oResponse.moreid,
									rows: 50,
									functionShowRow: ns1blankspace.financial.debtors.row,
									functionOpen: undefined,
									functionOnNewPage: ns1blankspace.financial.debtors.bind,
									showInvoices: bShowInvoices
							   });

							   $('#ns1blankspaceFinancialDebtorsTotal').html(ns1blankspace.option.currencySymbol + oResponse.data.totals.total);
							}
						}	    	
					}
				},

	row: 		function (oRow, oParam)
				{
					var bShowInvoices = ns1blankspace.util.getParam(oParam, 'showInvoices', {"default": true}).value;
					var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": 1}).value;
					var sKey = oRow.debtortype + '_' + oRow.id;
					oRow.key = sKey;

					oRow.contactperson = '';
					if (oRow.debtortype == 'P') {oRow.contactperson == oRow.id} //FOR EMAILING LATER

					ns1blankspace.financial.data.debtors.push(oRow);

					var sLastReceipt = '&nbsp;';
					if (oRow.lastreceiptdate != '') {sLastReceipt = oRow.lastreceiptdate + '<br />' + oRow.lastreceiptamount}
					var aHTML = [];

					aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspaceDebtors_container-' + sKey + '">' +
													'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspaceDebtors_selectContainer-' + sKey + '">' +
													'<input type="checkbox" data-1blankspace="ignore" checked="checked" id="ns1blankspaceUnsent_select-' + sKey + '" /></td>');

					aHTML.push('<td id="ns1blankspaceDebtors_contact-' + sKey + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
									oRow.debtorname + '</td>' +
									'<td id="ns1blankspaceDebtors_total-" class="ns1blankspaceRow" style="text-align:right;">' +
									oRow.total + '</td>');

					if (iType == 1)
					{	
						aHTML.push('<td id="ns1blankspaceDebtors_lastreceipt-" class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;color:#A0A0A0;">' +
									sLastReceipt + '</td>');
					}
					else
					{
						aHTML.push('<td id="ns1blankspaceDebtors_current-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
									oRow.current + '</td>' +
									'<td id="ns1blankspaceDebtors_current-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
									oRow['31-60'] + '</td>' +
									'<td id="ns1blankspaceDebtors_current-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
									oRow['61-90'] + '</td>' +
									'<td id="ns1blankspaceDebtors_current-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
									oRow['91'] + '</td>');
					}

					aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">' +
									'<span style="margin-right:5px;" id="ns1blankspaceDebtors_option_preview-' + sKey + '"' +
													' class="ns1blankspaceRowPreview"></span>' +
									'<span id="ns1blankspaceDebtors_invoices-' + sKey + '" class="ns1blankspaceRowInvoices"></span>' +
									'</td>' +			
									'</tr>');
					
					return aHTML.join('');
				},

	bind: 	function (oParam)
				{
					var bShowInvoices = ns1blankspace.util.getParam(oParam, 'showInvoices', {"default": true}).value;

					$('#ns1blankspaceFinancialDebtors .ns1blankspaceRowSelect')
					.click(function()
					{
						var sKey =(this.id).split('-')[1];

						if (sKey.split('_')[0] == 'B')
						{	
							ns1blankspace.contactBusiness.init({id: sKey.split('_')[1]});
						}
						else
						{
							ns1blankspace.contactPerson.init({id: sKey.split('_')[1]});
						}	
					})
					.css('width', '15px')
					.css('height', '20px');

					$('#ns1blankspaceFinancialDebtors .ns1blankspaceDebtorsSelectAll').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-check"
						}
					})
					.click(function()
					{	
						$('#ns1blankspaceFinancialDebtors input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
					})
					.css('width', '14px');

					if (bShowInvoices)
					{	
						$(' .ns1blankspaceRowInvoices')
						.button(
						{
							text: false,
							icons:
							{
								primary: "ui-icon-arrowthickstop-1-s"
							}
						})
						.click(function()
						{
							ns1blankspace.financial.debtors.invoices.showHide({xhtmlElementID: this.id});
						})
						.css('width', '15px')
						.css('height', '20px');
					}		
				},

	preview: {
					init: 		function (oParam)
								{
									$('#ns1blankspaceFinancialDebtorsPreviewStatus').html(ns1blankspace.xhtml.loadingSmall);
									oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.debtors.preview.show);
									oParam = ns1blankspace.util.setParam(oParam, 'template', 'statement');
									//ns1blankspace.util.initTemplate(oParam)

									oParam = ns1blankspace.util.setParam(oParam, 'object', 175);
									ns1blankspace.format.templates.init(oParam);
								},

					show:		function (oParam)
								{
									var iStep = 1
									var iDataIndex = 0;
									var iDataItemIndex = 0;

									if (oParam != undefined)
									{	
										if (oParam.step != undefined) {iStep = oParam.step}
										if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
										if (oParam.dataItemIndex != undefined) {iDataItemIndex = oParam.dataItemIndex}
									}
									else
									{
										oParam = {}
									}			

									if (iStep == 1)
									{	
										ns1blankspace.financial.debtors.data.statements = [];

										if ($('#ns1blankspaceFinancialDebtors input:checked').length > 0)
										{	
											$('#ns1blankspaceFinancialDebtorsPreviewStatus').html('<span style="font-size:2.25em;" class="ns1blankspaceSub">' +
														'<span id="ns1blankspaceFinancialDebtorsPreviewStatusIndex">1</span>/' + $('#ns1blankspaceFinancialDebtors input:checked').length + 
														'</span>');
										}
										else
										{
											ns1blankspace.status.error('No debtors selected');
											$('#ns1blankspaceFinancialDebtorsPreviewStatus').html('');
										}	

										$('#ns1blankspaceFinancialDebtors input:checked').each(function() 
										{
											var sKey = (this.id).split('-')[1];

											var oData = $.grep(ns1blankspace.financial.data.debtors, function (a) {return a.key == sKey;})[0]

											if (oData)
											{
												ns1blankspace.financial.debtors.data.statements.push(oData);
											}
										});

										oParam.step = 2;
										ns1blankspace.financial.debtors.preview.show(oParam);
									}			

									if (iStep == 2)
									{
										if (iDataIndex < ns1blankspace.financial.debtors.data.statements.length)
										{	
											$('#ns1blankspaceFinancialDebtorsPreviewStatusIndex').html(iDataIndex + 1);

											var oData = ns1blankspace.financial.debtors.data.statements[iDataIndex];

											$('#ns1blankspaceDebtors_option_preview-' + oData.key).html(ns1blankspace.xhtml.loadingSmall)

											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
											oSearch.addField('invoice.reference,invoice.sentdate,invoice.amount,invoice.outstandingamount,invoice.duedate');

											if ((oData.key).split('_')[0] == 'B')
											{
												oSearch.addFilter('contactbusinesssentto', 'EQUAL_TO', (oData.key).split('_')[1]);
											}
											else
											{
												oSearch.addFilter('contactpersonsentto', 'EQUAL_TO', (oData.key).split('_')[1]);
											}	
											
											oSearch.addFilter('outstandingamount', 'NOT_EQUAL_TO', 0);
											//oSearch.addFilter('duedate', 'LESS_THAN_OR_EQUAL_TO', Date.today().toString("dd MMM yyyy"));
											oSearch.addFilter('sentdate', 'LESS_THAN_OR_EQUAL_TO', Date.today().toString("dd MMM yyyy"));
											oSearch.rows = 200;
											oSearch.sort('sentdate', 'asc');
											oSearch.getResults(function(oResponse)
											{
												oParam.step = 2;
												oParam.dataIndex = iDataIndex + 1;
												ns1blankspace.financial.debtors.data.statements[iDataIndex].invoices = oResponse.data.rows;

												$('#ns1blankspaceDebtors_option_preview-' + oData.key).html('');
												$('#ns1blankspaceDebtors_option_preview-' + oData.key).addClass('ns1blankspaceRowPreviewDone');

												$('#ns1blankspaceDebtors_option_preview-' + oData.key).button(
												{
													text: false,
													icons:
													{
														primary: "ui-icon-document"
													}
												})
												.click(function()
												{
													ns1blankspace.financial.debtors.preview.showHide({xhtmlElementID: this.id, object: 175});
												})
												.css('width', '15px')
												.css('height', '20px');

												ns1blankspace.financial.debtors.preview.show(oParam);
											});
										}
										else
										{
											$('#ns1blankspaceFinancialDebtorsPreviewStatus').fadeOut(3000);
											ns1blankspace.util.onComplete(oParam);
										}	
									}						
								},

					showHide: 	function (oParam)
								{
									var sXHTMLElementID;
									var sKey;

									if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
									{
										sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
										sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
									}

									if ($('#ns1blankspaceDebtors_container_preview-' + sKey).length != 0)
									{
										$('#ns1blankspaceDebtors_container_preview-' + sKey).remove();
									}
									else
									{
										var sHTML = 'No preview';

										var oStatement = $.grep(ns1blankspace.financial.debtors.data.statements, function (a) {return a.key == sKey;})[0];

										if (oStatement)
										{
											var oTemplate = ns1blankspace.format.templates.get(oParam);

											sHTML = ns1blankspace.format.render(
											{
												object: 175,
												objectContext: -1,
												xhtmlTemplate: oTemplate.xhtml,
												objectData: oStatement,
												objectOtherData: oStatement.invoices
											});

											oStatement.xhtml = sHTML;
										}	

										$('#ns1blankspaceDebtors_container-' + sKey).after('<tr id="ns1blankspaceDebtors_container_preview-' + sKey + '">' +
												'<td colspan=8><div style="background-color: #F3F3F3; padding:8px;" class="ns1blankspaceScale85">' + sHTML + '</div></td></tr>')
									}
								}			
				},

	invoices: 	{
					showHide: 	function (oParam, oResponse)
								{
									var sXHTMLElementID;
									var sKey;

									if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
									{
										sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
										sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
									}

									if ($('#ns1blankspaceDebtors_container_invoices-' + sKey).length != 0)
									{
										$('#' + sXHTMLElementID).button({icons: {primary: "ui-icon-arrowthickstop-1-s"}});
										$('#ns1blankspaceDebtors_container_invoices-' + sKey).remove();
									}
									else
									{
										if (oResponse == undefined)
										{
											$('#' + sXHTMLElementID).button({icons: {primary: "ui-icon-arrowthickstop-1-n"}})
											ns1blankspace.status.working();

											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
											oSearch.addField('reference,sentdate,amount,outstandingamount,duedate,creditamount,receiptamount');

											var aID = (sXHTMLElementID).split('-');

											if ((aID[1]).split('_')[0] == 'B')
											{
												oSearch.addFilter('contactbusinesssentto', 'EQUAL_TO', (aID[1]).split('_')[1]);
											}
											else
											{
												oSearch.addFilter('contactpersonsentto', 'EQUAL_TO', (aID[1]).split('_')[1]);
											}	
											
											oSearch.addFilter('outstandingamount', 'NOT_EQUAL_TO', 0);
											oSearch.addFilter('sentdate', 'LESS_THAN_OR_EQUAL_TO', Date.today().toString("dd MMM yyyy"));
											oSearch.rows = 200;
											oSearch.sort('sentdate', 'asc');
											oSearch.getResults(function(oResponse)
											{
												ns1blankspace.financial.debtors.invoices.showHide(oParam, oResponse);
											});
										}
										else
										{
											ns1blankspace.status.clear();

											$vq.clear({queue: 'invoices'});
											
											$vq.add('<table style="font-size:0.875em;">' +
														'<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceHeaderCaption">#</td>' +
														'<td class="ns1blankspaceHeaderCaption">Sent</td>' +
														'<td class="ns1blankspaceHeaderCaption">Due</td>' +
														'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>' +
														'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount Owed</td></tr>',
														{queue: 'invoices'});

											$.each(oResponse.data.rows, function (r, row)
											{
												$vq.add('<tr>' +
															'<td class="ns1blankspaceRow ns1blankspaceSubNote">' +
															row.reference +
															'</td>' +
															'<td class="ns1blankspaceRow ns1blankspaceSubNote">' +
															row.sentdate +
															'</td>' +
															'<td class="ns1blankspaceRow ns1blankspaceSubNote">' +
															row.duedate +
															'</td>' +
															'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right;">' +
															row.amount +
															'</td>' +
															'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right;">' +
															row.outstandingamount +
															'</td>' +
															'</tr>',
															{queue: 'invoices'});
											});

											$vq.add('</table>', {queue: 'invoices'});

											$('#ns1blankspaceDebtors_container-' + sKey).after('<tr id="ns1blankspaceDebtors_container_invoices-' + sKey + '">' +
												'<td colspan=8><div style="background-color: #F3F3F3; padding:8px;" class="ns1blankspaceScale85">' + 
													$vq.get({queue: 'invoices'}) + '</div></td></tr>');
										}	
									}
								}			
				},			

	email: 	{
					init: 		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var aIDs = [];

										$($.grep(ns1blankspace.financial.debtors.data.statements, function (a) {return a.debtortype == 'B';})).each(function ()
										{
											aIDs.push(this.id);
										});
										
										if (aIDs.length != 0)
										{	
											var oSearch = new AdvancedSearch();
											oSearch.method = 'CONTACT_BUSINESS_SEARCH';
											oSearch.addField('billtoperson,primarycontactperson,email');
											oSearch.addFilter('id', 'IN_LIST', aIDs.join(','));
											oSearch.getResults(function(data)
											{
												ns1blankspace.financial.debtors.email.init(oParam, data)
											});
										}
										else
										{
											ns1blankspace.financial.debtors.email.send({dataIndex: 0});
										}		
									}	
									else
									{
										var iContactPerson;

										$(oResponse.data.rows).each(function(i, v)
										{
											iContactPerson = this.billtoperson;
											if (iContactPerson == '') {iContactPerson = this.primarycontactperson}
											if (iContactPerson == '') {iContactPerson = this.email}

											if (iContactPerson != '')
											{
												var oStatement = $.grep(ns1blankspace.financial.debtors.data.statements, function (a) {return a.id == v.id;})[0];

												if (oStatement)
												{
													oStatement.contactperson = iContactPerson;
												}
											}	
										});

										ns1blankspace.financial.debtors.email.send({dataIndex: 0})
									}	
								},

					send:		function (oParam)
								{		
									var iDataIndex = 0;

									if (oParam != undefined)
									{	
										if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
									}
									else
									{
										oParam = {}
									}			

									$('#ns1blankspaceFinancialDebtorsEmailStatus').html('<span style="font-size:2.25em;" class="ns1blankspaceSub">' +
											'<span id="ns1blankspaceFinancialDebtorsPreviewStatusIndex">' + (iDataIndex + 1) + '</span>/' + ns1blankspace.financial.debtors.data.statements.length + 
											'</span>');
														
									if (iDataIndex < ns1blankspace.financial.debtors.data.statements.length)
									{
										ns1blankspace.debug.message(ns1blankspace.financial.debtors.data.statements[iDataIndex]);

										var sHTML = 'No preview';

										var oStatement = ns1blankspace.financial.debtors.data.statements[iDataIndex];

										if (oStatement)
										{
											if (oStatement.xhtml == undefined)
											{	
												var oTemplate = ns1blankspace.format.templates.get({object: 175});

												sHTML = ns1blankspace.format.render(
												{
													object: 175,
													objectContext: -1,
													xhtmlTemplate: oTemplate.xhtml,
													objectData: oStatement,
													objectOtherData: oStatement.invoices
												});

												oStatement.xhtml = sHTML;
											}	
										
											if (oStatement.contactperson == '')
											{
												$('#ns1blankspaceDebtors_selectContainer-' + oStatement.key).html('No Email');
											}	
											else
											{
												var oData = 
												{
													subject: ns1blankspace.user.spaceText + ' Statement',
													message: oStatement.xhtml,
													to: oStatement.contactperson,
													object: (oStatement.debtortype=='P'?32:12),
													objectContext: oStatement.id
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
															$('#ns1blankspaceDebtors_selectContainer-' + oStatement.key).html('Emailed');
															oParam.dataIndex = iDataIndex + 1;
															ns1blankspace.financial.debtors.email.send(oParam);
														}
														else
														{
															if (data.error.errornotes.indexOf('no email address') != -1)
															{
																$('#ns1blankspaceDebtors_selectContainer-' + oStatement.key).html('No email');
															}
															else
															{
																$('#ns1blankspaceDebtors_selectContainer-' + oStatement.key).html('Error');
																$('#ns1blankspaceDebtors_selectContainer-' + oStatement.key).attr('title', data.error.errornotes);
															}	
														}
													}
												});
											}	
										}
									}
									else
									{
										$('#ns1blankspaceFinancialDebtorsEmailStatus').fadeOut(3000);
										ns1blankspace.util.onComplete(oParam);
									}	
								}																	
				}
}				

ns1blankspace.financial.creditors =				
{
	data: {},

	show:		function (oParam, oResponse)
				{
					var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
					var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceMainCreditors'}).value;
					var bShowExpenses = ns1blankspace.util.getParam(oParam, 'showExpenses', {"default": true}).value;

					if (sEndDate == undefined)
					{
						if (ns1blankspace.financial.data.defaults.enddate != undefined)
						{
							sEndDate = ns1blankspace.financial.data.defaults.enddate;
						}
						else
						{
							sEndDate = Date.today().toString("dd MMM yyyy");
						}
					}

					if (sEndDate != Date.today().toString("dd MMM yyyy"))
					{
						bShowExpenses = false;
						oParam = ns1blankspace.util.setParam(oParam, 'showExpenses', false);
					}

					if (oParam == undefined) {oParam = {}}

					if (oResponse == undefined)
					{	
						ns1blankspace.show({selector: '#ns1blankspaceMainCreditors'});

						ns1blankspace.financial.data.creditors = [];

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceCreditorsColumn1">' + ns1blankspace.xhtml.loading + '</td>' +
										'<td id="ns1blankspaceCreditorsColumn2" style="width:120px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#' + sXHTMLElementID).html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');
							
						aHTML.push('<tr><td class="ns1blankspaceDate" style="padding-bottom:8px;">' +
										'<input id="ns1blankspaceCreditorsEndDate" data-1blankspace="ignore" class="ns1blankspaceDate ns1blankspaceWatermark" style="padding-left:3px; width:113px; font-size:0.725em;" value="As at">' +
										'</td></tr>');
								
						aHTML.push('<tr><td style="padding-top:2px;"><span class="ns1blankspaceAction" id="ns1blankspaceCreditorsCreatePDF"  style="width:95px;">' +
										'Create PDF</span></td></tr>');

						aHTML.push('<tr><td style="padding-top:15px; padding-bottom:0px; font-size:0.75em;" class="ns1blankspaceSub">' +
										'Creditors total</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceFinancialCreditorsTotal" style="padding-top:0px; font-size:1.2em;" class="ns1blankspaceSub">' +
										'</td></tr>');

						aHTML.push('</table>');

						$('#ns1blankspaceCreditorsColumn2').html(aHTML.join(''));

						ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

						$('#ns1blankspaceCreditorsEndDate').change(function()
						{
							oParam = ns1blankspace.util.setParam(oParam, 'endDate', $('#ns1blankspaceCreditorsEndDate').val());
							ns1blankspace.financial.creditors.show(oParam)
						});

						$('#ns1blankspaceCreditorsCreatePDF').button(
						{
							label: 'Create PDF'
						})
						.click(function(event)
						{
							var sHTML = '<style>.ui-button, input {display:none;} td.ns1blankspaceRowSelect {color:#000000;}</style>' + $('#ns1blankspaceCreditorsColumn1').html();

							var sURL = document.location.protocol + '//' + document.location.host;
							var aHeaderHTML =
							[
								'<div style="margin-bottom:20px;">',
								'<div style="font-size:2em;">' + ns1blankspace.user.contactBusinessText + '</div>',
								'<div style="font-size:1.6em;">CREDITORS</div>',
							];

							aHeaderHTML.push('<div>');

							if ($('#ns1blankspaceCreditorsEndDate').val() != undefined)
							{
								var sDate = $('#ns1blankspaceCreditorsEndDate').val();
								if (sDate == 'As at') {sDate = Date.today().toString("dd MMM yyyy")}
								aHeaderHTML.push('As at ' + sDate);
							}

							aHeaderHTML.push('</div>');

							aHeaderHTML.push('</div><hr>');

							ns1blankspace.pdf.create(
							{
								xhtmlContent: aHeaderHTML.join('') + sHTML,
								filename: 'creditors.pdf',
								open: true,
								leftmargin: 45,
								topmargin: 1,
								headerheight: 15,
								footerheight: 15,
								baseURLBody: sURL,
								object: 12,
								objectContext: ns1blankspace.spaceContactBusiness
							});
						})
						.css('width', '115px');

						var oData = {rows: 1000, view: 1}

						if (sEndDate !== undefined)
						{
							oParam.endDate = sEndDate;
							oData.enddate = sEndDate;
							$('#ns1blankspaceCreditorsEndDate').removeClass('ns1blankspaceWatermark').val(sEndDate);
						}

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_CREDITOR_SEARCH'),
							data: oData,
							dataType: 'json',
							global: false,
							success: function(oResponse)
							{
								if (oResponse.status == 'OK')
								{	
									ns1blankspace.financial.creditors.show(oParam, oResponse);
								}
								else
								{
									if (oResponse.error.errorcode == '4')
									{	
										if (oResponse.error.errornotes.indexOf('FINANCIAL_DEBTORSCREDITORS_PROCESSING_MANAGE') != -1)
										{	
											ns1blankspace.status.working('Optimising creditors');
											oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.creditors.show)
											ns1blankspace.financial.optimise.start(oParam);
										}
									}
								}
							}
						});
					}
					else
					{
						if (oParam != undefined)
						{
							ns1blankspace.financial.data.defaults.enddate = oParam.endDate;
						}	

						var aHTML = [];
						
						$('#ns1blankspaceFinancialCreditorsTotal').html('-');

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
								aHTML.push('<table id="ns1blankspaceMainCreditors" class="ns1blankspace" style="font-size:0.925em;">' +
												'<tbody>' +
												'<tr class="ns1blankspaceCaption">' +
												'<td class="ns1blankspaceHeaderCaption" style="width:180px;">Creditor</td>' +
												'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount To Be Paid</td>' +
												'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">Last Paid</td>' +
												'<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
												'</tr>');	
								
								$(oResponse.data.rows).each(function() 
								{
									aHTML.push(ns1blankspace.financial.creditors.row(this, oParam));
								});
								
								aHTML.push('</tbody></table>');
							}
						}	
						
						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceCreditorsColumn1',
							xhtmlContext: 'Creditors',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 50,
							functionShowRow: ns1blankspace.financial.creditors.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.financial.creditors.bind,
							showExpenses: bShowExpenses
						}); 

						//ns1blankspace.financial.creditors.bind(oParam);

						$('#ns1blankspaceFinancialCreditorsTotal').html(ns1blankspace.option.currencySymbol + oResponse.data.totals.total);
					}
				},

	row:		function (oRow, oParam)
				{
					var bShowExpenses = ns1blankspace.util.getParam(oParam, 'showExpenses', {"default": true}).value;
					var sLastPayment = '&nbsp;';
					if (oRow.lastpaymentdate != '') {sLastPayment = oRow.lastpaymentdate + '<br />' + oRow.lastpaymentamount}
					var sKey = oRow.creditortype + '_' + oRow.id;
					oRow.key = sKey;

					var aHTML = [];

					aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspaceCreditors_container-' + sKey + '">' +
									'<td id="ns1blankspaceCreditors_Contact-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
									oRow.creditorname + '</td>' +
									'<td id="ns1blankspaceCreditors_Total-" class="ns1blankspaceRow" style="text-align:right;">' +
									oRow.total + '</td>' +
									'<td id="ns1blankspaceCreditors_LastPaymentDate-" class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;color:#A0A0A0;">' +
									sLastPayment + '</td>' +	
									'<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
									'<span id="ns1blankspaceCreditors_expenses-' + sKey + '" class="ns1blankspaceRowExpenses"></span>' +
									'</td>' +			
									'</tr>');
					
					return aHTML.join('');
				},

	bind: 	function (oParam)
				{
					var bShowExpenses = ns1blankspace.util.getParam(oParam, 'showExpenses', {"default": true}).value;

					$('#ns1blankspaceMainCreditors .ns1blankspaceRowSelect')
					.click(function() {
						ns1blankspace.contactBusiness.init({id: (this.id).split('-')[1]});
					})
					.css('width', '15px')
					.css('height', '20px');

					if (bShowExpenses)
					{	
						$(' .ns1blankspaceRowExpenses')
						.button(
						{
							text: false,
							icons:
							{
								primary: "ui-icon-arrowthickstop-1-s"
							}
						})
						.click(function()
						{
							ns1blankspace.financial.creditors.expenses.showHide({xhtmlElementID: this.id});
						})
						.css('width', '15px')
						.css('height', '20px');
					}		
				},

	expenses: 	
				{
					showHide: 	function (oParam, oResponse)
								{
									var sXHTMLElementID;
									var sKey;

									if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
									{
										sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
										sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
									}

									if ($('#ns1blankspaceCreditors_container_expenses-' + sKey).length != 0)
									{
										$('#' + sXHTMLElementID).button({icons: {primary: "ui-icon-arrowthickstop-1-s"}});
										$('#ns1blankspaceCreditors_container_expenses-' + sKey).remove();
									}
									else
									{
										if (oResponse == undefined)
										{
											$('#' + sXHTMLElementID).button({icons: {primary: "ui-icon-arrowthickstop-1-n"}})
											ns1blankspace.status.working();

											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
											oSearch.addField('reference,accrueddate,amount,outstandingamount,paymentduedate,description');

											var aID = (sXHTMLElementID).split('-');

											if ((aID[1]).split('_')[0] == 'B')
											{
												oSearch.addFilter('contactbusinesspaidto', 'EQUAL_TO', (aID[1]).split('_')[1]);
											}
											else
											{
												oSearch.addFilter('contactpersonpaidto', 'EQUAL_TO', (aID[1]).split('_')[1]);
											}	
											
											oSearch.addFilter('outstandingamount', 'NOT_EQUAL_TO', 0);
											oSearch.addFilter('accrueddate', 'LESS_THAN_OR_EQUAL_TO', Date.today().toString("dd MMM yyyy"));
											oSearch.rows = 1000;
											oSearch.sort('accrueddate', 'asc');
											oSearch.getResults(function(oResponse)
											{
												ns1blankspace.financial.creditors.expenses.showHide(oParam, oResponse);
											});
										}
										else
										{
											ns1blankspace.status.clear();

											$vq.clear({queue: 'expenses'});
											
											$vq.add('<table style="font-size:0.875em;">' +
														'<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceHeaderCaption">#</td>' +
														'<td class="ns1blankspaceHeaderCaption">Description</td>' +
														'<td class="ns1blankspaceHeaderCaption">Payment Due</td>' +
														'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>' +
														'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount To Be Paid</td></tr>',
														{queue: 'expenses'});

											$.each(oResponse.data.rows, function (r, row)
											{
												$vq.add('<tr>' +
															'<td class="ns1blankspaceRow ns1blankspaceSubNote">' +
															row.reference +
															'</td>' +
															'<td class="ns1blankspaceRow ns1blankspaceSubNote">' +
															row.description +
															'</td>' +
															'<td class="ns1blankspaceRow ns1blankspaceSubNote">' +
															ns1blankspace.util.fd(row.paymentduedate) +
															'</td>' +
															'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right;">' +
															row.amount +
															'</td>' +
															'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right;">' +
															row.outstandingamount +
															'</td>' +
															'</tr>',
															{queue: 'expenses'});
											});

											$vq.add('</table>', {queue: 'expenses'});

											$('#ns1blankspaceCreditors_container-' + sKey).after('<tr id="ns1blankspaceCreditors_container_expenses-' + sKey + '">' +
												'<td colspan=4><div style="background-color: #F3F3F3; padding:8px;" class="ns1blankspaceScale85">' + 
													$vq.get({queue: 'expenses'}) + '</div></td></tr>');
										}	
									}
								}			
				}						
}

ns1blankspace.financial.profitLoss =
{
	data: 		{},

	show: 		function (oParam, oResponse)
				{
					var sStartDate;
					var sEndDate;
					var bPercentage = true;
					var bNoZero = false;
					var oProject = ns1blankspace.util.getParam(oParam, 'project').value;

					if (oParam != undefined)
					{
						if (oParam.startDate != undefined) {sStartDate = oParam.startDate}
						if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
						if (oParam.percentage != undefined) {bPercentage = oParam.percentage}
						if (oParam.noZero != undefined) {bNoZero = oParam.noZero}
					}
					else
					{
						oParam = {}
					}

					if (sStartDate == undefined)
					{
						if (ns1blankspace.financial.data.defaults.startdate != undefined)
						{
							sStartDate = ns1blankspace.financial.data.defaults.startdate;
						}
					}

					if (sEndDate == undefined)
					{
						if (ns1blankspace.financial.data.defaults.enddate != undefined)
						{
							sEndDate = ns1blankspace.financial.data.defaults.enddate;
						}
						else
						{
							sEndDate = Date.today().toString("dd MMM yyyy");
						}
					}

					if (oResponse == undefined)
					{
						if (oProject == undefined)
						{
							if (ns1blankspace.financial.data.defaults.project != undefined)
							{
								oProject = ns1blankspace.financial.data.defaults.project;
							}
						}
				
						if (oProject == -1) {oProject = undefined}

						var sProject = 'ALL PROJECTS';

						if (oProject != undefined)
						{
							sProject = '<div style="font-weight:600;">' + oProject.reference + '</div><div>' + oProject.description + '</div>'
						}	

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
								'<tr>' +
								'<td id="ns1blankspacePLColumn1" class="ns1blankspaceColumn1Divider" style="width:100px; font-size: 0.875em; padding-right:10px;"></td>' +
								'<td>' +
									'<table>' + 
									'<tr><td id="ns1blankspacePLColumn2Header" class="ns1blankspaceHeaderCaption" style="padding-left:20px; text-align:left; cursor:pointer;">' + sProject + '</td></tr>' + 
									'<tr><td id="ns1blankspacePLColumn2" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td></tr>' +
									'</table>' +
								'</td>' +
								'</tr>' +
								'</tr>' +
								'</table>');	

						$('#ns1blankspaceMainPL').html(aHTML.join(''));

						$('#ns1blankspacePLColumn2Header').click(function(event)
						{
							ns1blankspace.financial.profitLoss.projects.show(this);
						});

						var aHTML = [];
						
						aHTML.push('<table>');
						
						aHTML.push('<tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePLStartDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
							
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
										'To' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePLEndDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
														
						aHTML.push('<tr><td style="padding-top:5px;">' +
										'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspacePLRefresh">Refresh</span>' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:5px;">' +
										'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspacePLShowAll">Show All</span>' +
										'</td></tr>');

						if (bNoZero)
						{	
							aHTML.push('<tr><td style="padding-top:10px;">' +
										'<span class="ns1blankspaceSubNote" style="width:95px;">Accounts with zero values are not shown.</span>' +
										'</td></tr>');
						}	

						aHTML.push('<tr><td style="padding-top:14px;"><span class="ns1blankspaceAction" id="ns1blankspacePLCreatePDF"  style="width:95px;">' +
										'Create PDF</span></td></tr>');
						
						aHTML.push('</table>');					
						
						$('#ns1blankspacePLColumn1').html(aHTML.join(''));

						ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

						$('#ns1blankspacePLRefresh').button(
						{
							label: 'Refresh'
						})
						.click(function()
						{
							ns1blankspace.financial.profitLoss.show(
							{
								startDate: $('#ns1blankspacePLStartDate').val(),
								endDate: $('#ns1blankspacePLEndDate').val()
							})
						});

						$('#ns1blankspacePLShowAll').button(
						{
							label: 'Show All'
						})
						.click(function()
						{
							ns1blankspace.financial.profitLoss.show(
							{
								startDate: $('#ns1blankspacePLStartDate').val(),
								endDate: $('#ns1blankspacePLEndDate').val(),
								showAll: true
							})
						});

						$('#ns1blankspacePLCreatePDF').button(
						{
							label: 'Create PDF'
						})
						.click(function(event)
						{
							var sHTML =  $('#ns1blankspacePLColumn2').html();
							var sURL = document.location.protocol + '//' + document.location.host;
							var aHeaderHTML =
							[
								'<div style="margin-bottom:20px;">',
								'<div style="font-size:2em;">' + ns1blankspace.user.contactBusinessText + '</div>',
								'<div style="font-size:1.6em;">PROFIT & LOSS</div>',
							];

							aHeaderHTML.push('<div>');

							if ($('#ns1blankspacePLStartDate').val() != '')
							{
								aHeaderHTML.push($('#ns1blankspacePLStartDate').val());
							}

							if ($('#ns1blankspacePLEndDate').val() != '')
							{
								aHeaderHTML.push(' to ' + $('#ns1blankspacePLEndDate').val());
							}

							aHeaderHTML.push('</div>');

							aHeaderHTML.push('</div><hr>');

							ns1blankspace.pdf.create(
							{
								xhtmlContent: aHeaderHTML.join('') + sHTML,
								filename: 'profit-loss.pdf',
								open: true,
								leftmargin: 45,
								topmargin: 1,
								headerheight: 15,
								footerheight: 15,
								baseURLBody: sURL,
								object: 12,
								objectContext: ns1blankspace.spaceContactBusiness
							});
						});

						var sData = 'rows=500'

						if (sStartDate != undefined)
						{
							oParam.startDate = sStartDate;
							sData += '&startdate=' + ns1blankspace.util.fs(sStartDate);
							$('#ns1blankspacePLStartDate').val(sStartDate);
						}
							
						if (sEndDate != undefined)
						{
							oParam.endDate = sEndDate;
							sData += '&enddate=' + ns1blankspace.util.fs(sEndDate);
							$('#ns1blankspacePLEndDate').val(sEndDate);
						}

						if (oProject != undefined)
						{
							oParam.project = oProject;
							sData += '&project=' + ns1blankspace.util.fs(oProject.id);
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
							if (oParam == undefined) {oParam = {}};
							oParam.dataTree = ns1blankspace.financial.data.accounts;
							oParam.dataBranch = oResponse.data.rows;
							oParam.branchDetailName = 'total';
							oParam.xhtmlElementID = 'ns1blankspacePLColumn2';
							oParam.xhtmlElementContext = 'PL';
							oParam.startDate = oResponse.startdate;
							oParam.endDate = oResponse.enddate;

							if ($('#ns1blankspacePLStartDate').val() == '') {$('#ns1blankspacePLStartDate').val(oResponse.startdate)}
							if ($('#ns1blankspacePLEndDate').val() == '') {$('#ns1blankspacePLEndDate').val(oResponse.enddate)}

							oParam.dataRoot =
							[
								{
									title: 'Sales',
									id: $.grep(ns1blankspace.financial.data.rootAccounts, function (a) {return parseInt(a.type) == 2})[0]['id'],
									xhtml: '<span class="ns1blankspaceHeaderLarge">Sales</span><br /><span class="ns1blankspaceSub" style="color:black;">' + (oResponse.totalsales).formatMoney(2, '.', ',') + '</span>'
								},
								{
									title: 'Cost of Sales',
									id: $.grep(ns1blankspace.financial.data.rootAccounts, function (a) {return parseInt(a.type) == 1})[0]['id'],
									filter: function (a) {return a._cos == 'Y'},
									xhtml: '<span class="ns1blankspaceHeaderLarge">Cost&nbsp;of&nbsp;Sales</span><br /><span class="ns1blankspaceSub" style="color:black;">' + (oResponse.totalcostofsales).formatMoney(2, '.', ',') + '</span>' +
												(bPercentage?'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.totalcostofsalespercentage).formatMoney(2, '.', ',') + '%</span>':'')
								},
								{
									xhtml: '<span class="ns1blankspaceHeaderLarge">Gross&nbsp;Margin</span><br /><span class="ns1blankspaceSub" style="color:#999999;">' + (oResponse.grossmargin).formatMoney(2, '.', ',') + '</span>' +
												(bPercentage?'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.grossmarginpercentage).formatMoney(2, '.', ',') + '%</span>':''),
									"class": 'ns1blankspaceRowShaded'
								},
								{
									title: 'Expenses',
									id: $.grep(ns1blankspace.financial.data.rootAccounts, function (a) {return parseInt(a.type) == 1})[0]['id'],
									filter: function (a) {return a.expensecostofsale != 'Y' && (a.class == 1 || a.class == '')},
									xhtml: '<span class="ns1blankspaceHeaderLarge">Expenses</span><br /><span class="ns1blankspaceSub" style="color:black;">' + (oResponse.totaloperationalexpenses).formatMoney(2, '.', ',') + '</span>' +
												(bPercentage?'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.totaloperationalexpensespercentage).formatMoney(2, '.', ',') + '%</span>':'')
								}
							]	

							if (parseInt(oResponse.TotalOtherIncome) == 0 && parseInt(oResponse.TotalOtherExpenses) == 0)
							{
								oParam.dataRoot.push(
								{
									xhtml: '<span class="ns1blankspaceHeaderLarge">Margin</span><br /><span class="ns1blankspaceSub" style="color:black;">' + (oResponse.netmargin).formatMoney(2, '.', ',') + '</span>' +
												(bPercentage?'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.netmarginpercentage).formatMoney(2, '.', ',') + '%</span>':''),
									"class": 'ns1blankspaceRowShaded'
								});
							}
							else
							{
								oParam.dataRoot.push(
								{
									xhtml: '<span class="ns1blankspaceHeaderLarge">Net&nbsp;Margin</span><br /><span class="ns1blankspaceSub" style="color:black;"> ' + (oResponse.operatingmargin).formatMoney(2, '.', ',') + '</span>' +
												(bPercentage?'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.operatingmarginpercentage).formatMoney(2, '.', ',') + '%</span>':''),
									"class": 'ns1blankspaceRowShaded'
								});

								
								if (parseInt(oResponse.totalotherincome) != 0)
								{
									oParam.dataRoot.push(
									{
										title: 'Other Income',
										xhtml: '<span class="ns1blankspaceHeaderLarge">Other&nbsp;Income</span><br /><span class="ns1blankspaceSub" style="color:black;">' + (oResponse.totalotherincome).formatMoney(2, '.', ',') + '</span>' +
													(bPercentage?'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.totalotherincomepercentage).formatMoney(2, '.', ',') + '%</span>':''),
										"_class": 'ns1blankspaceRowShaded',
										filter: function (a) {return (a.class == 2 && a.type == 2)}
									});
								}
									
								if (parseInt(oResponse.totalotherexpenses) != 0)
								{
									oParam.dataRoot.push(
									{
										title: 'Other Expenses',
										xhtml: '<span class="ns1blankspaceHeaderLarge">Other&nbsp;Expenses</span><br /><span class="ns1blankspaceSub" style="color:black;">' + (oResponse.totalotherexpenses).formatMoney(2, '.', ',') + '</span>' +
													(bPercentage?'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.totalotherexpensespercentage).formatMoney(2, '.', ',') + '%</span>':''),
										"_class": 'ns1blankspaceRowShaded',
										filter: function (a) {return (a.expensecostofsale != 'Y' && a.class == 2 && a.type == 1)}
									});
								}	

								oParam.dataRoot.push(
								{
									xhtml: '<span class="ns1blankspaceHeaderLarge">Margin</span><br /><span class="ns1blankspaceSub" style="color:black;">' + (oResponse.netmargin).formatMoney(2, '.', ',') + '</span>' +
													(bPercentage?'<br /><span class="ns1blankspaceSub" style="color:#CCCCCC;">' + (oResponse.netmarginpercentage).formatMoney(2, '.', ',') + '%</span>':''),
									"class": 'ns1blankspaceRowShaded'
								});
							}
							
							oParam = ns1blankspace.util.setParam(oParam, 'onLastChild', ns1blankspace.financial.profitLoss.transactions);

							if (bNoZero)
							{
								var aDataTree = [];

								$.each(oParam.dataTree, function (a, account)
								{
									if ($.grep(oParam.dataBranch, function (data) {return data.financialaccount==account.id}).length > 0)
									{
										aDataTree.push(account);
									}
								});

								oParam.dataTree = aDataTree;
							}

							ns1blankspace.financial.profitLoss.data = 
							{
								amounts: oParam.dataBranch,
								accounts: oParam.dataTree,
								root: oParam.dataRoot,
								startdate: oParam.startDate,
								enddate: oParam.endDate
							}

							ns1blankspace.financial.data.defaults = 
							{
								startdate: oParam.startDate,
								enddate: oParam.endDate,
								project: oParam.project
							}
								
							ns1blankspace.format.tree.init(oParam);
						}	
					}	
				},

	transactions:	
				function (oParam, oResponse)
		 		{
		 			var iFinancialAccount = ns1blankspace.util.getParam(oParam, 'id').value;
		 			var aXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {split: '-'}).values;
		 			//var sXHTMLElementID = aXHTMLElementID[0] + '-' + aXHTMLElementID[1];
		 			var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
		 			var oXHTMLElement = $('#' + sXHTMLElementID);
		 			var oXHTMLElementTransactions = $('#' + sXHTMLElementID + '-transactions-container-' + iFinancialAccount);
		 			var bInline = ns1blankspace.util.getParam(oParam, 'inline', {"default": true}).value;
		 			var sClass = '';

		 			if (bInline)
		 			{
		 				if (oXHTMLElementTransactions.length == 0)
		 				{
		 					if (oXHTMLElement.hasClass('ns1blankspaceRowShaded'))
		 					{
		 						sClass = ' ns1blankspaceRowShaded';
		 					}

		 					var sFileName = 'export-profit-loss-' + _.kebabCase( oXHTMLElement.text()) + '.csv';

		 					oXHTMLElement.parent().after('<tr id="' + sXHTMLElementID + '-transactions-container-' + iFinancialAccount + '">' +
		 													'<td class="ns1blankspaceTreeColumn1' + sClass + '" style="' +
		 													' width:100%; padding:6px; opacity:1; font-size:0.875em; border-style:solid;' +
		 													' border-top-width:0px; border-top-color:white;' +
		 													' border-right-width:0px; border-right-color:white;' +
		 													' border-bottom-width:0px; border-bottom-color:white;"' +
		 													' colspan=2>' + 
		 													'<div id="' + sXHTMLElementID + '-transactions-' + iFinancialAccount + '" data-filename="' + sFileName + '">' + 
		 														ns1blankspace.xhtml.loadingSmall + '</div>' +
		 													'<div style="text-align:right; margin-right:8px; margin-bottom:4px; margin-top:2px; font-size:0.875em;">' + 
		 														'<span id="' + sXHTMLElementID + '-export-' + iFinancialAccount + '" style="cursor:pointer; color:#EE8F00;">Export</span></div>' +
		 													'</td></tr>');

		 					$('#' + sXHTMLElementID + '-export-' + iFinancialAccount)
							.click(function()
							{
								ns1blankspace.financial.accounts.export({xhtmlContext: (this.id).replace('-export-', '-transactions-')})
							});

		 					ns1blankspace.financial.transactions.show(
			 				{
			 					xhtmlElementID: sXHTMLElementID + '-transactions-' + iFinancialAccount,
			 					financialAccount: iFinancialAccount,
			 					setWidth: true,
			 					namespace: 'profitLoss',
			 					rows: 5,
			 					fileName: sFileName
			 				});
		 				}
		 				else
		 				{
		 					oXHTMLElementTransactions.remove()
		 				}
		 			}	
		 			else
		 			{		 			
		 				if (ns1blankspace.container.show(
		 				{
		 					xhtmlElement: oXHTMLElement,
		 					topOffset: 1,
		 					leftOffset: 3,
		 					xhtml: '<div id="ns1blankspaceFinancialTransactions" style="background-color:#F3F3F3; width:395px; padding:6px; ' +
		 								'opacity:0.95; font-size:0.75em; border-style:solid; border-width:4px; border-color:white;">' + ns1blankspace.xhtml.loadingSmall + '</div>',
		 					setWidth: true
		 				}))
		 				{	
			 				ns1blankspace.financial.transactions.show(
			 				{
			 					xhtmlElementID: 'ns1blankspaceFinancialTransactions',
			 					financialAccount: iFinancialAccount,
			 					setWidth: true,
			 					namespace: 'profitLoss'
			 				});
			 			}
			 		}	
	 			},

	projects:{					
					show:		function (oElement, oResponse)
								{
									var aHTML = [];

									if (oResponse == undefined)	
									{
										if ($(ns1blankspace.xhtml.container).attr('data-initiator') == oElement.id)
										{
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
											$(ns1blankspace.xhtml.container).attr('data-initiator', '');
										}
										else
										{	
											$(ns1blankspace.xhtml.container).attr('data-initiator', oElement.id);
											$(ns1blankspace.xhtml.container).html('<table style="width: 500px;" class="ns1blankspaceViewControlContainer"><tr><td>' + ns1blankspace.xhtml.loadingSmall + '</tr><td></table>');
											$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
											$(ns1blankspace.xhtml.container).offset({ top: $(oElement).offset().top + $(oElement).height() - 5, left: $(oElement).offset().left + 50});

											var oSearch = new AdvancedSearch();
											oSearch.method = 'PROJECT_SEARCH';
											oSearch.addField('id,reference,description');
											oSearch.addFilter('allowfinancialtransactions', 'EQUAL_TO', 'Y');
											oSearch.rows = 10;
											oSearch.sort('modifieddate', 'desc');
											oSearch.getResults(function(oResponse)
											{
												ns1blankspace.financial.profitLoss.projects.show(oElement, oResponse)
											});
										}
									}	
									else
									{
										aHTML.push('<table style="width:502px;" class="ns1blankspaceViewControlContainer">');

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<tr><td class="ns1blankspaceNothing">There are no projects that allow financial transactions.</td></tr>');
										}
										else
										{
											aHTML.push('<tr><td id="ns1blankspaceFinancialPLProjectSearchResults-all" class="ns1blankspaceRowSelect" style="padding-left:5px;padding-right:10px;">Show profit & loss for all projects</td></tr>' +
												'<tr><td class="ns1blankspaceSubNote" style="padding-left:5px;padding-right:10px;">Or search for a project ...</td></tr>' +
												'<tr><td class="ns1blankspaceNothing" style="padding-left:5px;padding-right:10px;">' +
												'<input id="ns1blankspaceFinancialPLProjectSearch" data-1blankspace="ignore" class="ns1blankspaceMainText" style="font-size:1.1em; width:100%; height:23px;"></td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialPLProjectSearchResults"></td></tr>');
										}	

										aHTML.push('</table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));

										var aHTML = [];

										aHTML.push('<table id="ns1blankspaceFinancialPLProjectSearchResultsContainer" style="width: 100%;" cellpadding=4>');

										$(oResponse.data.rows).each(function()
										{
											aHTML.push('<tr>' +
															'<td id="ns1blankspaceFinancialPLProjectSearchResults-' + this.id + '" class="ns1blankspaceRowSelect" style="font-size:0.875em;"' +
															' data-reference="' + this.reference + '"' +
															' data-description="' + this.description + '"' +
															'>' +
															this.reference + '</td>' +
															'<td class="ns1blankspaceSubNote">' + this.description + '</td>' +
															'</tr>');
										});			
														
										aHTML.push('</table>');
										
										$('#ns1blankspaceFinancialPLProjectSearchResults').html(aHTML.join(''));

										$('#ns1blankspaceFinancialPLProjectSearchResultsContainer td.ns1blankspaceRowSelect').click(function(event)
										{
											ns1blankspace.container.hide({force: true});

											var aID = (event.target.id).split('-')
											ns1blankspace.financial.profitLoss.show(
											{
												project: 
												{
													id: aID[1],
													reference: $(this).attr('data-reference'),
													description: $(this).attr('data-description')
												}	
											})
										});

										$('#ns1blankspaceFinancialPLProjectSearchResults-all').click(function(event)
										{
											ns1blankspace.container.hide({force: true});
											ns1blankspace.financial.profitLoss.show(
											{
												project: -1	
											})
										});

										$('#ns1blankspaceFinancialPLProjectSearch').focus();

										$('#ns1blankspaceFinancialPLProjectSearch').keyup(function(event)
										{
											if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
									        ns1blankspace.timer.delayCurrent = setTimeout("ns1blankspace.financial.profitLoss.projects.process('ns1blankspaceFinancialPLProjectSearch')", ns1blankspace.option.typingWait);
										});
									}
								},

					process:	function (sXHTMLElementID, oResponse)
								{	
									var aSearch = sXHTMLElementID.split('-');
									var sElementId = aSearch[0];
									var sSearchText = aSearch[1];
									var aHTML = [];

									if (oResponse == undefined)
									{	
										if (sSearchText == undefined)
										{
											sSearchText = $('#' + sXHTMLElementID).val();
										}

										var oSearch = new AdvancedSearch();
										oSearch.method = 'PROJECT_SEARCH';
										oSearch.addField('id,reference,description');
										oSearch.addFilter('allowfinancialtransactions', 'EQUAL_TO', 'Y');

										oSearch.addBracket('(');
										oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
										oSearch.addFilter('or');
										oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);
										oSearch.addBracket(')');

										oSearch.rows = 20;
										oSearch.sort('reference', 'asc');
										oSearch.getResults(function(oResponse)
										{
											ns1blankspace.financial.profitLoss.projects.show(sXHTMLElementID, oResponse)
										});	
									}
									/*else
									{	
										aHTML.push('<table id="ns1blankspaceFinancialPLProjectSearchResultsContainer" style="width: 100%;" cellpadding=4>');

										$(oResponse.data.rows).each(function()
										{
											aHTML.push('<tr>' +
															'<td id="ns1blankspaceFinancialPLProjectSearchResults-' + this.id + '" class="ns1blankspaceRowSelect" style="font-size: 0.75em;">' +
															this.reference + '</td>' +
															'<td class="ns1blankspaceSubNote">' + this.description + '</td>' +
															'</tr>');
										});

										aHTML.push('</table>');

										$('#ns1blankspaceFinancialPLProjectSearchResults').html(aHTML.join(''));

										$('#ns1blankspaceFinancialPLProjectSearchResultsContainer td.ns1blankspaceRowSelect').click(function(event)
										{
											ns1blankspace.container.hide({force: true});

											var aID = (event.target.id).split('-');
											ns1blankspace.financial.profitLoss.show(
											{
												project: 
												{
													id: aID[1],
													reference: $(this).attr('data-reference'),
													description: $(this).attr('data-description')
												}
											});
										});
									}	*/
								}				
				} 					
}

ns1blankspace.financial.balanceSheet =
{
	data: 		{},

	show: 		function (oParam, oResponse)
				{
					var sStartDate;
					var sEndDate;

					if (oParam != undefined)
					{
						if (oParam.startDate != undefined) {sStartDate = oParam.startDate}
						if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
					}
					else
					{
						oParam = {}
					}

					if (sStartDate == undefined)
					{
						if (ns1blankspace.financial.data.defaults.startdate != undefined)
						{
							sStartDate = ns1blankspace.financial.data.defaults.startdate;
						}
					}

					if (sEndDate == undefined)
					{
						if (ns1blankspace.financial.data.defaults.enddate != undefined)
						{
							sEndDate = ns1blankspace.financial.data.defaults.enddate;
						}
						else
						{
							sEndDate = Date.today().toString("dd MMM yyyy");
						}
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
										'<input id="ns1blankspaceBSStartDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
							
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
										'To' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceBSEndDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
														
						aHTML.push('<tr><td style="padding-top:5px;">' +
										'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspaceBSRefresh">Refresh</span>' +
										'</td></tr>');
						
						aHTML.push('<tr><td style="padding-top:5px;">' +
										'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspaceBSShowAll">Show All</span>' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:14px;"><span class="ns1blankspaceAction" id="ns1blankspaceBSCreatePDF"  style="width:95px;">' +
										'Create PDF</span></td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceBSColumn1').html(aHTML.join(''));

						ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

						$('#ns1blankspaceBSRefresh').button(
						{
							label: 'Refresh'
						})
						.click(function() {
							ns1blankspace.financial.balanceSheet.show(
							{
								startDate: $('#ns1blankspaceBSStartDate').val(),
								endDate: $('#ns1blankspaceBSEndDate').val()
							})
						});

						$('#ns1blankspaceBSShowAll').button(
						{
							label: 'Show All'
						})
						.click(function() {
							ns1blankspace.financial.balanceSheet.show(
							{
								startDate: $('#ns1blankspaceBSStartDate').val(),
								endDate: $('#ns1blankspaceBSEndDate').val(),
								showAll: true
							})
						});

						$('#ns1blankspaceBSCreatePDF').button(
						{
							label: 'Create PDF'
						})
						.click(function(event)
						{
							var sHTML =  $('#ns1blankspaceBSColumn2').html();
							var sURL = document.location.protocol + '//' + document.location.host;
							var aHeaderHTML =
							[
								'<div style="margin-bottom:20px;">',
								'<div style="font-size:2em;">' + ns1blankspace.user.contactBusinessText + '</div>',
								'<div style="font-size:1.6em;">BALANCE SHEET</div>',
							];

							aHeaderHTML.push('<div>');

							if ($('#ns1blankspaceBSStartDate').val() != '')
							{
								aHeaderHTML.push($('#ns1blankspaceBSStartDate').val());
							}

							if ($('#ns1blankspaceBSEndDate').val() != '')
							{
								aHeaderHTML.push(' to ' + $('#ns1blankspaceBSEndDate').val());
							}

							aHeaderHTML.push('</div>');

							aHeaderHTML.push('</div><hr>');

							ns1blankspace.pdf.create(
							{
								xhtmlContent: aHeaderHTML.join('') + sHTML,
								filename: 'balance-sheet.pdf',
								open: true,
								leftmargin: 45,
								topmargin: 1,
								headerheight: 15,
								footerheight: 15,
								baseURLBody: sURL,
								object: 12,
								objectContext: ns1blankspace.spaceContactBusiness
							});
						});

						var sData = 'rows=500'

						if (sStartDate != undefined && sStartDate != '1 Jul 1900')
						{
							oParam.startDate = sStartDate;
							sData += '&startdate=' + ns1blankspace.util.fs(sStartDate);
							$('#ns1blankspaceBSStartDate').val(sStartDate);
						}
							
						if (sEndDate != undefined)
						{
							oParam.endDate = sEndDate;
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
							if (oParam == undefined) {oParam = {}};
							oParam.dataTree = ns1blankspace.financial.data.accounts;
							oParam.dataBranch = oResponse.data.rows;
							oParam.xhtmlElementID = 'ns1blankspaceBSColumn2';
							oParam.xhtmlElementContext = 'BS';
							oParam.startDate = oResponse.startdate;
							oParam.endDate = oResponse.enddate;
							oParam.onLeaveClick = ns1blankspace.financial.balanceSheet.transactions;

							if ($('#ns1blankspaceBSEndDate').val() == '') {$('#ns1blankspaceBSEndDate').val(oResponse.enddate)}

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
	
							oParam = ns1blankspace.util.setParam(oParam, 'onLastChild', ns1blankspace.financial.balanceSheet.transactions);

							ns1blankspace.financial.balanceSheet.data = 
							{
								amounts: oParam.dataBranch,
								accounts: oParam.dataTree,
								root: oParam.dataRoot,
								startdate: oParam.startDate,
								enddate: oParam.endDate
							}

							ns1blankspace.financial.data.defaults = 
							{
								startdate: oParam.startDate,
								enddate: oParam.endDate
							}

							ns1blankspace.format.tree.init(oParam);
						}	
					}	
				},

	transactions:	
				function (oParam, oResponse)
		 		{
		 			var iFinancialAccount = ns1blankspace.util.getParam(oParam, 'id').value;
		 			var aXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {split: '-'}).values;
		 			//var sXHTMLElementID = aXHTMLElementID[0] + '-' + aXHTMLElementID[1];
		 			var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
		 			var oXHTMLElement = $('#' + sXHTMLElementID);
					var oXHTMLElementTransactions = $('#' + sXHTMLElementID + '-transactions-container-' + iFinancialAccount);
		 			var bInline = ns1blankspace.util.getParam(oParam, 'inline', {"default": true}).value;
		 			var sClass = '';

		 			var sXHTML = '<div id="ns1blankspaceFinancialTransactions" style="background-color:#F3F3F3; width:395px; padding:6px; opacity:1; font-size:0.75em; ' +
		 								' border-style:solid; border-width:4px; border-color:white ;">' + ns1blankspace.xhtml.loadingSmall + '</div>'
	 					
		 			if (bInline)
		 			{
		 				if (oXHTMLElementTransactions.length == 0)
		 				{
		 					if (oXHTMLElement.hasClass('ns1blankspaceRowShaded'))
		 					{
		 						sClass = ' ns1blankspaceRowShaded';
		 					}

		 					var sFileName = 'export-balance-sheet-' + _.kebabCase( oXHTMLElement.text()) + '.csv';

		 					oXHTMLElement.parent().after('<tr id="' + sXHTMLElementID + '-transactions-container-' + iFinancialAccount + '">' +
		 													'<td class="ns1blankspaceTreeColumn1' + sClass + '" style="' +
		 													' width:100%; padding:6px; opacity:1; font-size:0.875em; border-style:solid;' +
		 													' border-top-width:0px; border-top-color:white;' +
		 													' border-right-width:0px; border-right-color:white;' +
		 													' border-bottom-width:0px; border-bottom-color:white;"' +
		 													' colspan=2>' + 
		 													'<div id="' + sXHTMLElementID + '-transactions-' + iFinancialAccount + '" data-filename="' + sFileName + '">' + 
		 														ns1blankspace.xhtml.loadingSmall + '</div>' +
		 													'<div style="text-align:right; margin-right:8px; margin-bottom:4px; margin-top:2px; font-size:0.875em;">' + 
		 														'<span id="' + sXHTMLElementID + '-export-' + iFinancialAccount + '" style="cursor:pointer; color:#EE8F00;">Export</span></div>' +
		 													'</td></tr>');

		 					$('#' + sXHTMLElementID + '-export-' + iFinancialAccount)
							.click(function()
							{
								ns1blankspace.financial.accounts.export({xhtmlContext: (this.id).replace('-export-', '-transactions-')})
							});

		 					ns1blankspace.financial.transactions.show(
			 				{
			 					xhtmlElementID: sXHTMLElementID + '-transactions-' + iFinancialAccount,
			 					financialAccount: iFinancialAccount,
			 					setWidth: true,
			 					namespace: 'balanceSheet',
			 					rows: 5,
			 					fileName: sFileName
			 				});
		 				}
		 				else
		 				{
		 					oXHTMLElementTransactions.remove()
		 				}
		 			}	
		 			else
		 			{
		 				if (ns1blankspace.container.show(
		 				{
		 					xhtmlElement: oXHTMLElement,
		 					topOffset: 1,
		 					leftOffset: 3,
		 					xhtml: sXHTML,
		 					setWidth: true
		 				}))
		 				{	
			 				ns1blankspace.financial.transactions.show(
			 				{
			 					xhtmlElementID: 'ns1blankspaceFinancialTransactions',
			 					financialAccount: iFinancialAccount,
			 					setWidth: true,
			 					namespace: 'balanceSheet'
			 				});
			 			}
			 		}	
	 			}	
}

ns1blankspace.financial.bankAccounts =
{
	show: 		function (oParam)
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
				
					if (ns1blankspace.financial.data.bankaccounts.length == 0)
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
						
						$(ns1blankspace.financial.data.bankaccounts).each(function() 
						{
							aHTML.push(ns1blankspace.financial.bankAccounts.row(this));
						});
						
						aHTML.push('</table>');
					}
					
					$('#ns1blankspaceBankAccountsColumn1').html(aHTML.join(''));
					
					ns1blankspace.financial.bankAccounts.bind();
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
	show: 	function (oParam, oResponse)
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

					var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
					var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;

					if (sStartDate == undefined)
					{
						if (ns1blankspace.financial.data.defaults.startdate != undefined)
						{
							sStartDate = ns1blankspace.financial.data.defaults.startdate;
						}
						else
						{
							sStartDate = moment().subtract('year', 1).month('July').startOf('month').format('DD MMM YYYY');
						}
					}

					ns1blankspace.financial.data.defaults.startdate = sStartDate;

					if (sEndDate == undefined)
					{
						if (ns1blankspace.financial.data.defaults.enddate != undefined)
						{
							sEndDate = ns1blankspace.financial.data.defaults.enddate;
						}
						else
						{
							sEndDate = Date.today().toString("dd MMM yyyy");
						}
					}

					ns1blankspace.financial.data.defaults.enddate = sEndDate;
					
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
						aHTML.push('<input type="radio" id="ns1blankspaceAccountColumnCategory-0" name="radioCategory" data-1blankspace="ignore" /><label for="ns1blankspaceAccountColumnCategory-0" style="width: 100px; margin-bottom:1px;">All</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceAccountColumnCategory-2" name="radioCategory" data-1blankspace="ignore" /><label for="ns1blankspaceAccountColumnCategory-2" style="width: 100px; margin-bottom:1px;">Revenue<br><span style="font-weight:200">(Incoming)</span></label>');
						aHTML.push('<input type="radio" id="ns1blankspaceAccountColumnCategory-1" name="radioCategory" data-1blankspace="ignore" /><label for="ns1blankspaceAccountColumnCategory-1" style="width: 100px; margin-bottom:1px;">Expenses<br><span style="font-weight:200">(Outgoing)</span></label>');
						aHTML.push('<input type="radio" id="ns1blankspaceAccountColumnCategory-3" name="radioCategory" data-1blankspace="ignore" /><label for="ns1blankspaceAccountColumnCategory-3" style="width: 100px; margin-bottom:1px;">Assets</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceAccountColumnCategory-4" name="radioCategory" data-1blankspace="ignore" /><label for="ns1blankspaceAccountColumnCategory-4" style="width: 100px; margin-bottom:1px;">Liability</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceAccountColumnCategory-5" name="radioCategory" data-1blankspace="ignore" /><label for="ns1blankspaceAccountColumnCategory-5" style="width: 100px; margin-bottom:1px;">Equity</label>');
						aHTML.push('</div>');
						
						aHTML.push('<table style="margin-top:12px;">');

						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
										'From' +
										'</td></tr>' +
										'<tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceAccountStartDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
							
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
										'To' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceAccountEndDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:5px;">' +
										'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspaceAccountRefresh">Refresh</span>' +
										'</td></tr>');

						aHTML.push('</table>');

						$('#ns1blankspaceAccountColumn1').html(aHTML.join(''));

						ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});
						$('#ns1blankspaceAccountStartDate').val(sStartDate);
						$('#ns1blankspaceAccountEndDate').val(sEndDate);
					
						$('#ns1blankspaceAccountColumnCategory').buttonset().css('font-size', '0.875em');
						
						$('#ns1blankspaceAccountColumnCategory :radio').click(function()
						{
							var aID = (this.id).split('-');
							$.extend(true, oParam, {step: 2, type: parseInt(aID[1])});
							ns1blankspace.financial.accounts.show(oParam);
						});

						$('#ns1blankspaceAccountRefresh').button(
						{
							label: 'Refresh'
						})
						.click(function() {
							ns1blankspace.financial.accounts.show(
							{
								startDate: $('#ns1blankspaceAccountStartDate').val(),
								endDate: $('#ns1blankspaceAccountEndDate').val()
							})
						});
					}
					
					if (iStep == 2)
					{	
						if (oResponse == undefined)
						{	
							$('#ns1blankspaceAccountColumn2').html(ns1blankspace.xhtml.loadingSmall);
							
							var oData = $.grep(ns1blankspace.financial.data.accounts, function (a)
							{ 
								return ((iType!=0?a.type == iType:true) && a.postable == 'Y')
							});

							ns1blankspace.financial.accounts.show(oParam, oData);
						}
						else
						{
							$.extend(true, oParam, {step: 3});
							
							var aHTML = [];
						
							if (oResponse.length == 0)
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
										'<td id="ns1blankspaceAccountTransactionsColumn1" style="width: 65px;font-size:0.875em;"></td>' +
										'<td><div class="ns1blankspaceColumn2" id="ns1blankspaceAccountTransactionsColumn2" style="border-left-style:solid; border-width:1px; border-color:#B8B8B8; padding-left: 10px; margin-left:15px; margin-right:15px;"></div></td>' +
										'<td id="ns1blankspaceAccountTransactionsColumn3" style="width: 34px;font-size:0.875em; text-align:right;"></td>' +
										'</tr>' +
										'</table>');

								$('#ns1blankspaceAccountColumn2').html(aHTML.join(''));
						
								var aHTML = [];
								
								aHTML.push('<table id="ns1blankspaceReco" class="ns1blankspaceColumn2" style="padding-right: 10px;">');
							
								$(oResponse).each(function(i) 
								{
									if (i==0 && iType == 0)
									{
										aHTML.push('<tr><td><span id="ns1blankspaceAccountTransactionsAll" style="font-size:0.75em;">All</span></td></tr>');
									}
								
									aHTML.push('<tr><td id="ns1blankspaceAccountTransactions_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceFinancialAccountRowSelect"' +
													'><div>' + this.title + '</div><div class="ns1blankspaceSubNote">' + this.typetext + '</div></td></tr>');
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
								});
								
								$('.ns1blankspaceFinancialAccountRowSelect').click(function() {
										var aID = (this.id).split('-');
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
							$('#ns1blankspaceAccountTransactionsColumn2').html('<table id="ns1blankspaceAccountTransactions" class="ns1blankspaceColumn2">' +
											'<tr><td>' + ns1blankspace.xhtml.loading + '</td></tr></table>');
							
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
							oSearch.addField('date,description,amount');
							oSearch.addSummaryField('sum(amount) sumamount, count(id) count');
							oSearch.sort('date', 'desc');
							if (iFinancialAccount != -1) {oSearch.addFilter('financialaccount', 'EQUAL_TO', iFinancialAccount)};

							if (sStartDate != '' && sStartDate != undefined)
							{
								oSearch.addFilter('date', 'GREATER_THAN_OR_EQUAL_TO', sStartDate);
								$('#ns1blankspaceAccountStartDate').val(sStartDate);
							}
								
							if (sEndDate != '' && sEndDate != undefined)
							{
								oSearch.addFilter('date', 'LESS_THAN_OR_EQUAL_TO', sEndDate);
								$('#ns1blankspaceAccountEndDate').val(sEndDate);
							}

							oSearch.rows = 100;
							oSearch.getResults(function(data) {ns1blankspace.financial.accounts.show(oParam, data)});	
						}
						else
						{
							$.extend(true, oParam, {step: 3});
							
							var aHTML = [];
							var h = -1;
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<table>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceNothing">No transactions.</td>' +
											'</tr>' +
											'</table>');
								
								$('#ns1blankspaceAccountTransactionsColumn2').html(aHTML.join(''));
							}
							else
							{
								var aHTML = [];
						
								aHTML.push('<table style="font-size:0.875em;">');
							
								aHTML.push('<tr>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">TOTAL</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">' + (oResponse.summary.sumamount).parseCurrency().formatMoney(2, '.', ',') + '</td>');
								aHTML.push('</tr>');
								
								$(oResponse.data.rows).each(function() 
								{
									aHTML.push(ns1blankspace.financial.accounts.row(this));
								});
							
								aHTML.push('</table>');

								ns1blankspace.render.page.show(
							   	{
									type: 'JSON',
									xhtmlElementID: 'ns1blankspaceAccountTransactionsColumn2',
									xhtmlContext: 'FinancialAccountTransactions',
									xhtml: aHTML.join(''),
									showMore: (oResponse.morerows == "true"),
									more: oResponse.moreid,
									rows: 100,
									functionShowRow: ns1blankspace.financial.accounts.row,
									functionOpen: undefined,
									functionOnNewPage: undefined,
									summary: oResponse.summary
							   	});
								
								$('#ns1blankspaceAccountTransactionsColumn3').html('<span class="ns1blankspaceAction" id="ns1blankspaceAccountExport"></span>');
								$('#ns1blankspaceAccountExport').button(
								{
									label: 'Export'
								})
								.click(function()
								{
									ns1blankspace.financial.accounts.export()
								});
							}
						}
					}
				},

	row: 		function(oRow)
				{
					var aHTML = [];
					
					aHTML.push('<tr><td id="ns1blankspaceFinancialAccountTransactions_date-' + oRow.id + '" class="ns1blankspaceRow"' +
													'>' + oRow.date + '</td>');
									
					aHTML.push('<td id="ns1blankspaceFinancialAccountTransactions_description-' + oRow.id + '" class="ns1blankspaceRow"' +
									'>' + oRow.description + '</td>');
									
					aHTML.push('<td id="ns1blankspaceFinancialAccountTransactions_amount-' + oRow.id + '" class="ns1blankspaceRow"' +
									' style="text-align:right;">' + oRow.amount + '</td>');				
													
					aHTML.push('</tr>');

					return aHTML.join('');
				},

	"export":
				function (oParam)
				{
					var sXHTMLContext = ns1blankspace.util.getParam(oParam, 'xhtmlContext', {'default': 'FinancialAccountTransactions'}).value;

					var oFormat =
					[{
						options:
						{
							delimiter: ',',
							surroundWith: '"'
						},

						header:
						[
							{
								line: 1,
								fields:
								[
									{value: 'Date'},
									{value: 'Description'},
									{value: 'Amount'}
								]
							}	
						],

						item:
						[
							{
								fields:
								[
									{field: 'date'},
									{field: 'description'},
									{field: 'amount'}
								]
							}		
						]
					}]

					var sFileName = $('#' + sXHTMLContext).attr('data-filename');

					ns1blankspace.setup.file.export.data.get(
				   {
						xhtmlContext: sXHTMLContext,
						format: oFormat,
						saveToFile: true,
						open: true,
						fileName: sFileName
					});
				} 			
}

ns1blankspace.financial.unallocated =
{
	show: 	function (oParam, oResponse)
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

					var bShowAccrued = ns1blankspace.util.getParam(oParam, 'showAccrued', {"default": false}).value;
					
					if (iStep == 1)	
					{
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceUnallocatedColumn1" style="width:100px; font-size:0.75em;"></td>' +
										'<td id="ns1blankspaceUnallocatedColumn2" style="padding-top:4px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainUnallocated').html(aHTML.join(''));
							
						var aHTML = [];

						if (ns1blankspace.option.bootstrap)
						{
							aHTML.push('<div class="btn-group-vertical" role="group" data-toggle="buttons" id="ns1blankspaceUnallocatedColumnType" style="width:95px; margin-top:3px; text-align:right;">');
						
							if (bShowAccrued)
							{
								aHTML.push('<label class="btn btn-default" id="ns1blankspaceUnallocatedColumnType-3">' +
												'<input type="radio" name="radioType" data-1blankspace="ignore" />Expenses' +
												'</label>');
							}

							aHTML.push('<label class="btn btn-default" id="ns1blankspaceUnallocatedColumnType-4">' +
											'<input type="radio"  name="radioType" data-1blankspace="ignore" />Payments' +
											'</label>');

							if (bShowAccrued)
							{
								aHTML.push('<label class="btn btn-default" id="ns1blankspaceUnallocatedColumnType-1">' +
												'<input type="radio" name="radioType" data-1blankspace="ignore" />Invoices' +
												'</label>');
							}

							aHTML.push('<label class="btn btn-default" id="ns1blankspaceUnallocatedColumnType-2">' +
											'<input type="radio"  name="radioType" data-1blankspace="ignore" />Receipts' +
											'</label>');
							aHTML.push('</div>');

							$('#ns1blankspaceUnallocatedColumn1').html(aHTML.join(''));

							$('#ns1blankspaceUnallocatedColumnType label').click(function()
							{
								var aID = (this.id).split('-');
								$.extend(true, oParam, {step: 2, type: parseInt(aID[1])});
								ns1blankspace.financial.unallocated.show(oParam);
							});
						}
						else
						{
							aHTML.push('<div class="btn-group-vertical" id="ns1blankspaceUnallocatedColumnType" style="width:95px; margin-top:3px; text-align:right;">');
							if (bShowAccrued) {aHTML.push('<input type="radio" id="ns1blankspaceUnallocatedColumnType-3" name="radioType" data-1blankspace="ignore" /><label class="btn btn-default" for="ns1blankspaceUnallocatedColumnType-3" style="width: 95px; margin-bottom:2px;">Expenses</label>');}
							aHTML.push('<input type="radio" id="ns1blankspaceUnallocatedColumnType-4" name="radioType" data-1blankspace="ignore" /><label class="btn btn-default" for="ns1blankspaceUnallocatedColumnType-4" style="width: 95px; margin-bottom:2px;">Payments</label>');
							if (bShowAccrued) {aHTML.push('<input type="radio" id="ns1blankspaceUnallocatedColumnType-1" name="radioType" data-1blankspace="ignore" /><label class="btn btn-default" for="ns1blankspaceUnallocatedColumnType-1" style="width: 95px; margin-bottom:2px;">Invoices</label>');}
							aHTML.push('<input type="radio" id="ns1blankspaceUnallocatedColumnType-2" name="radioType" data-1blankspace="ignore" /><label class="btn btn-default" for="ns1blankspaceUnallocatedColumnType-2" style="width: 95px; margin-bottom:2px;">Receipts</label>');
							aHTML.push('</div>');

							$('#ns1blankspaceUnallocatedColumn1').html(aHTML.join(''));
					
							$('#ns1blankspaceUnallocatedColumnType').buttonset().css('font-size', '0.875em');
						}

						$('#ns1blankspaceUnallocatedColumnType :radio').click(function()
						{
							var aID = (this.id).split('-');
							$.extend(true, oParam, {step: 2, type: parseInt(aID[1])});
							ns1blankspace.financial.unallocated.show(oParam);
						});
					}
					
					if (iStep == 2)
					{	
						if (oResponse == undefined)
						{
							var iAccountType = 1;
							if (iType==1 || iType==2) {iAccountType = 2}

							ns1blankspace.financial.unallocatedAccount = ns1blankspace.financial.data.settings.financialaccountunallocated[(iAccountType==1?'outgoing':'incoming')];
								
							if (ns1blankspace.financial.unallocatedAccount == undefined)
							{
								$('#ns1blankspaceUnallocatedColumn2').html('<span class="ns1blankspaceNothing">No unallocated account set up.</span>');
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
									oSearch.addFilter('invoice.lineitem.amount', 'NOT_EQUAL_TO', 0);
									oSearch.addFilter('invoice.sent', 'EQUAL_TO', 'N');

									ns1blankspace.financial.unallocated.row = function (oRow)
									{
										var aHTML = [];
										
										aHTML.push('<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceUnallocated_reference-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["reference"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_date-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														ns1blankspace.util.fd(oRow["sentdate"]) + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["invoice.lineitem.description"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
														oRow["invoice.lineitem.amount"] + '</td>'); 

										aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
										aHTML.push('<span id="ns1blankspaceReconcileItems_options_search-' + oRow["invoice.lineitem.id"] + '-2"' +
														' class="ns1blankspaceUnallocatedEdit"></span></td>');
										aHTML.push('</tr>');

										return aHTML.join('');
									}
								}
								else if (iType == 2)
								{
									oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
									oSearch.addField('reference,receiveddate,receipt.lineitem.amount,receipt.lineitem.description,receipt.lineitem.id');
									oSearch.addFilter('receipt.lineitem.financialaccount', 'EQUAL_TO', ns1blankspace.financial.unallocatedAccount);
									oSearch.addFilter('receipt.lineitem.amount', 'NOT_EQUAL_TO', 0);

									ns1blankspace.financial.unallocated.row = function (oRow)
									{
										var aHTML = [];
										
										aHTML.push('<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceUnallocated_reference-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["reference"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_date-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														ns1blankspace.util.fd(oRow["receiveddate"]) + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["receipt.lineitem.description"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
														oRow["receipt.lineitem.amount"] + '</td>'); 

										aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
										aHTML.push('<span id="ns1blankspaceReconcileItems_options_search-' + oRow["receipt.lineitem.id"] + '-2"' +
														' data-amount="' + accounting.unformat(oRow["receipt.lineitem.amount"]) + '"' +
														' data-object="6"' +
														' data-objectcontext="' + oRow["id"] + '"' +
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
									oSearch.addFilter('expense.lineitem.amount', 'NOT_EQUAL_TO', 0);

									ns1blankspace.financial.unallocated.row = function (oRow)
									{
										var aHTML = [];

										aHTML.push('<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceUnallocated_reference-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["reference"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_date-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														ns1blankspace.util.fd(oRow["accrueddate"]) + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["expense.lineitem.description"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
														oRow["expense.lineitem.amount"] + '</td>'); 

										aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
										aHTML.push('<span id="ns1blankspaceReconcileItems_options_search-' + oRow["expense.lineitem.id"] + '-1"' +
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
									oSearch.addFilter('payment.lineitem.amount', 'NOT_EQUAL_TO', 0);

									ns1blankspace.financial.unallocated.row = function (oRow)
									{
										var aHTML = [];

										aHTML.push('<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceUnallocated_reference-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["reference"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_date-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														ns1blankspace.util.fd(oRow["paiddate"]) + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														oRow["payment.lineitem.description"] + '</td>'); 

										aHTML.push('<td id="ns1blankspaceUnallocated_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
														oRow["payment.lineitem.amount"] + '</td>'); 

										aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
										aHTML.push('<span id="ns1blankspaceReconcileItems_options_search-' + oRow["payment.lineitem.id"] + '-1"' +
														' data-amount="' + accounting.unformat(oRow["payment.lineitem.amount"]) + '"' +
														' data-object="3"' +
														' data-objectcontext="' + oRow["id"] + '"' +
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
								aHTML.push('<span class="ns1blankspaceSubNote">No unallocated items.</span>');
							}
							else
							{
								aHTML.push('<table class="ns1blankspaceColumn2" id="ns1blankspaceUnallocatedItems">' +
											'<tr class="ns1blankspaceHeaderCaption">' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditReference" style="width:100px;">Reference</td>' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditDate" style="width:100px;">Date</td>' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditDescription">Description</td>' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditAmount" style="width:100px; text-align:right;">Amount</td>' +
											'<td class="ns1blankspaceHeaderCaption" id="ns1blankspaceUnallocatedEditallocated" class="2">Account</td>' +
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

	bind: 	function()
				{
					$('#ns1blankspaceUnallocatedItems .ns1blankspaceUnallocatedEdit').button(
					{
						label: 'Allocate'
					})
					.click(function()
					{
						ns1blankspace.financial.unallocated.edit({xhtmlElementID: this.id});
					});
				},

	edit: 	function(oParam, oResponse)
				{
					var iType;
					var sXHTMLElementID;
					var iItemID = '';
					var bShowAll = ns1blankspace.util.getParam(oParam, 'showAll', {"default": false}).value;
					var bAllocate = ns1blankspace.util.getParam(oParam, 'allocate', {"default": false}).value;

					if (oParam != undefined)
					{
						if (oParam.type != undefined) {iType = oParam.type};
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID};
					}

					if (bShowAll)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceSearchMedium">');

						$.each(ns1blankspace.financial.data.types, function (t, type)
						{
							aHTML.push('<tr><td class="ns1blankspaceUnallocatedType ns1blankspaceRowSelect ns1blankspaceNothing"' +
											' id="ns1blankspaceUnallocatedType-' + type.id + '">' +
											type.name + '</td></tr>');
						});
										
						aHTML.push('</table>');

						$(ns1blankspace.xhtml.container).html(aHTML.join(''));
						$(ns1blankspace.xhtml.container).css(
						{
							width: $(ns1blankspace.xhtml.container + ' table').width()
						});

						$('.ns1blankspaceUnallocatedType').click(function ()
						{
							$(ns1blankspace.xhtml.container).attr('data-source', '');
							oParam = ns1blankspace.util.setParam(oParam, 'showAll', false);
							oParam = ns1blankspace.util.setParam(oParam, 'allocate', false);
							oParam = ns1blankspace.util.setParam(oParam, 'type', (this.id).split('-')[1]);
							ns1blankspace.financial.unallocated.edit(oParam);
						});

					}
					else if (bAllocate)
					{
						var aXHTMLElementID = sXHTMLElementID.split('-');
						if (iType==undefined && aXHTMLElementID[2]) {iType = aXHTMLElementID[2]}

						var sSearchText = ns1blankspace.util.getParam(oParam, 'searchText', {"default": ''}).value;

						var oSearch = new AdvancedSearch();
						
						if (iType == 1)
						{	
							oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
							oSearch.addField('reference,contactbusinesspaidtotext,contactbusinesspaidto,description,accrueddate,amount,outstandingamount');
						}	

						if (iType == 2)
						{	
							oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
							oSearch.addField('reference,contactbusinesssenttotext,contactbusinesssentto,description,sentdate,amount,outstandingamount');
						}	

						oSearch.addFilter('outstandingamount', 'NOT_EQUAL_TO', 0);

						if (sSearchText != '')
						{
							oSearch.addBracket('(');
							oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');

							if (iType == 1)
							{
								oSearch.addFilter('expense.contactbusinesspaidto.tradename', 'TEXT_IS_LIKE', sSearchText);
								oSearch.addOperator('or');
								oSearch.addFilter('expense.contactpersonpaidto.surname', 'TEXT_IS_LIKE', sSearchText);
								oSearch.addOperator('or');
								oSearch.addFilter('expense.contactpersonpaidto.firstname', 'TEXT_IS_LIKE', sSearchText);
							}

							if (iType == 2)
							{
								oSearch.addFilter('invoice.contactbusinesssentto.tradename', 'TEXT_IS_LIKE', sSearchText);
								oSearch.addOperator('or');
								oSearch.addFilter('invoice.contactpersonsentto.surname', 'TEXT_IS_LIKE', sSearchText);
								oSearch.addOperator('or');
								oSearch.addFilter('invoice.contactpersonsentto.firstname', 'TEXT_IS_LIKE', sSearchText);
							}

							oSearch.addBracket(')');
						}

						oSearch.sort('id', 'desc');
						oSearch.getResults(function(oResponse)
						{
							$vq.init('<table class="ns1blankspaceSearchMedium" id="ns1blankspaceUnallocatedExpenses">', {queue: 'allocate'});

							if (sSearchText != '')
							{
								$vq.add('<tr><td><input id="ns1blankspaceFinancialAllocateItem" data-1blankspace="ignore" class="ns1blankspaceText" value="' + sSearchText + '" style="width:97%;"></input></td></tr>', {queue: 'allocate'});
							}
							else if (oResponse.morerows=='true')
							{
								$vq.add('<tr><td><input id="ns1blankspaceFinancialAllocateItem" data-1blankspace="ignore" class="ns1blankspaceWatermark ns1blankspaceText" value="search" style="width:97%;"></input></td></tr>', {queue: 'allocate'});
								$vq.add('<tr><td class="ns1blankspaceSubNote">If not listed below, then you can search for it.</td></tr>', {queue: 'allocate'});
							}	

							if (oResponse.data.rows.length == 0)
							{
								$vq.add('<td class="ns1blankspaceNothing">Nothing outstanding.</td>', {queue: 'allocate'});
							}
							else
							{	
								$.each(oResponse.data.rows, function(r, row)
								{		
									$vq.add('<tr class="ns1blankspaceSearch">' + 
												'<td class="ns1blankspaceSearch ns1blankspaceRowSelect" id="' +
												'search-' + row.id + '-' + row['contactbusiness' + (iType==1?'paidto':'sentto')] + '">' +
												'<div style="color: #ee8f00; font-weight:bold;">' + row.reference + '</div>' +
												'<div>' + row[(iType==1?'contactbusinesspaidtotext':'contactbusinesssenttotext')] + '</div>' +
												'<div>' + row[(iType==1?'accrueddate':'sentdate')] + '</div>' +
												'<div>$' + row.outstandingamount + '</div>' +
												'<div>' + row.description + '</div>' +
												'</td></tr>', {queue: 'allocate'});
								});
							}				

							$vq.add('</table>', {queue: 'allocate'});
		
							$vq.render(ns1blankspace.xhtml.container, {queue: 'allocate'})

							$(ns1blankspace.xhtml.container).css(
							{
								width: $(ns1blankspace.xhtml.container + ' table').width()
							});

							$('#ns1blankspaceUnallocatedExpenses td.ns1blankspaceRowSelect').click(function()
							{
								ns1blankspace.financial.allocate.to(
								{
									allocateToObject: (iType==1?2:5),
									allocateToID: (this.id).split('-')[1],
									allocateFromItemID: sXHTMLElementID.split('-')[1],
									amount: $('#' + sXHTMLElementID).attr('data-amount'),
									allocateFromItemFinancialAccount: ns1blankspace.financial.data.settings[(iType==1?'financialaccountcreditor':'financialaccountdebtor')],
									allocateFromObject: $('#' + sXHTMLElementID).attr('data-object'),
									allocateFromObjectContext: $('#' + sXHTMLElementID).attr('data-objectcontext'),
									allocateToContactBusiness: (this.id).split('-')[2]
								});

								$(ns1blankspace.xhtml.container).attr('data-source', '');
								$(ns1blankspace.xhtml.container).hide();
								ns1blankspace.status.message('Allocated');
								$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
							});

							$('#ns1blankspaceFinancialAllocateItem').keyup(function(e)
							{
								if ($(this).val().length == 0) {$(this).attr('data-id', '')}

								if (e.which === 13)
						    	{
									ns1blankspace.search.show({xhtmlElementID: ns1blankspace.xhtml.divID, source: 4});
								}
								else
								{
									if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
								
									oParam = ns1blankspace.util.setParam(oParam, 'searchText', $(this).val());

									var sFunction = 'ns1blankspace.financial.unallocated.edit(' +
														JSON.stringify(oParam) + ');'
								
									ns1blankspace.timer.delayCurrent = setTimeout(sFunction, ns1blankspace.option.typingWait);
								}		
							});

							$('#ns1blankspaceFinancialAllocateItem').focus().val(sSearchText);
						});
					}	
					else
					{
						var aXHTMLElementID = sXHTMLElementID.split('-');
						if (iType==undefined && aXHTMLElementID[2]) {iType = aXHTMLElementID[2]}

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
								ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: -255, topOffset: -20})
								$(ns1blankspace.xhtml.container).html('<table class="ns1blankspaceSearchMedium"><tr><td>' + ns1blankspace.xhtml.loadingSmall + '</td></tr></table>');
								$(ns1blankspace.xhtml.container).show();

								var oData = $.grep(ns1blankspace.financial.data.accounts, function (a)
								{ 
									return (a.type == iType && a.postable == 'Y' && a.id != ns1blankspace.financial.unallocatedAccount)
								});

								ns1blankspace.financial.unallocated.edit(oParam, oData)
							}		
						}
						else
						{
							if (aXHTMLElementID[1]) {iItemID = aXHTMLElementID[1]}

							var aHTML = [];

							aHTML.push('<table class="ns1blankspaceSearchMedium">');

							if (oResponse.length == 0)
							{
								aHTML.push('<td class="ns1blankspaceNothing">No accounts</td>');
							}
							else
							{	
								if (aXHTMLElementID[2] == 1 || aXHTMLElementID[2] == 2)
								{	
									aHTML.push('<tr class="ns1blankspaceSearch"><td class="ns1blankspaceRowSelect" id="ns1blankspaceUnallocatedAllocate" style="cursor:pointer;">' +
										'Allocate to an ' + (aXHTMLElementID[2]==1?'expense':'invoice') + ' &raquo;</td></tr>');
								}

								aHTML.push('<tr class="ns1blankspaceSearch"><td class="ns1blankspaceRowSelect" id="ns1blankspaceUnallocatedShowAll" style="cursor:pointer;">Select a different account type &raquo;</td></tr>');

								$.each(oResponse, function()
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
							$(ns1blankspace.xhtml.container).css(
							{
								width: $(ns1blankspace.xhtml.container + ' table').width()
							});

							$('#ns1blankspaceUnallocatedAllocate').click(function ()
							{
								oParam = ns1blankspace.util.setParam(oParam, 'allocate', true);
								ns1blankspace.financial.unallocated.edit(oParam);
							});

							$('#ns1blankspaceUnallocatedShowAll').click(function ()
							{
								oParam = ns1blankspace.util.setParam(oParam, 'showAll', true);
								ns1blankspace.financial.unallocated.edit(oParam);
							});

							$('td.ns1blankspaceSearch').click(function(event)
							{
								$(ns1blankspace.xhtml.container).hide();

								ns1blankspace.status.working();

								var sID = this.id;
								var aID = sID.split('-');

								var sData = 'id=' + ns1blankspace.util.fs(aID[1]);
								sData += '&financialaccount=' + ns1blankspace.util.fs(aID[2]);
								sData += '&override=Y'

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
											var oData =
											{
												object: $('#' + sXHTMLElementID).attr('data-object'),
												objectcontext: $('#' + sXHTMLElementID).attr('data-objectcontext')
											};

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_COMPLETE'),
												data: oData,
												dataType: 'json',
												success: function(data)
												{
													ns1blankspace.status.message('Allocated');
													$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
												}
											});
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
}


ns1blankspace.financial.invoicing =
{
	data: 		{},

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
										'<td id="ns1blankspaceInvoicingColumn1" style="width:90px; font-size:0.75em;"></td>' +
										'<td id="ns1blankspaceInvoicingColumn2"></td>' +
										'<td id="ns1blankspaceInvoicingColumn3" style="width:100px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
							
						var aHTML = [];

						aHTML.push('<div id="ns1blankspaceInvoicingOption" style="width:85px; margin-top:3px; text-align:right;">');
						aHTML.push('<input type="radio" id="ns1blankspaceInvoicingOption-2" name="radioType" data-1blankspace="ignore" /><label for="ns1blankspaceInvoicingOption-2" style="width: 85px; margin-bottom:1px;">' +
											'Create</label>');
						aHTML.push('<input type="radio" id="ns1blankspaceInvoicingOption-1" name="radioType" data-1blankspace="ignore" /><label for="ns1blankspaceInvoicingOption-1" style="width: 85px; margin-bottom:1px;">' +
											'Send</label>');
						aHTML.push('</div>');

						$('#ns1blankspaceInvoicingColumn1').html(aHTML.join(''));
					
						$('#ns1blankspaceInvoicingOption').buttonset().css('font-size', '0.875em');
						
						$('#ns1blankspaceInvoicingOption :radio').click(function()
						{
							var aID = (this.id).split('-');
							
							if (aID[1] == 1)
							{	
								ns1blankspace.financial.invoicing.unsent.init(oParam);
							}
							
							if (aID[1] == 2)
							{	
								ns1blankspace.financial.invoicing.create.show(oParam);
							}		
						});
					}
				},

	unsent: 	{
					data: 	{
								fields: 'reference,amount,description,contactbusinesssentto,contactbusinesssenttotext,contactpersonsentto,contactpersonsenttotext,' +
										'invoice.contactpersonsentto.email,invoice.contactbusinesssentto.email'
							},

					init: 		function ()
								{
									$('#ns1blankspaceInvoicingColumn2').html(ns1blankspace.xhtml.loading);
									$('#ns1blankspaceInvoicingColumn3').html('');
									ns1blankspace.util.initTemplate({template: 'invoice', onComplete: ns1blankspace.financial.invoicing.unsent.show})
								},
 
					show:		function (oParam, oResponse)
								{
									if (ns1blankspace.xhtml.templates['invoice'] == '')
									{
										var aHTML = [];
											
										aHTML.push('<table id="ns1blankspaceInvoicingUnsent" class="ns1blankspaceColumn2">' +
																'<tr><td class="ns1blankspaceSub">No invoice template has been set up.</td></tr></table>');

										$('#ns1blankspaceInvoicingColumn2').html(aHTML.join(''));
									}	
									else
									{
										if (oResponse == undefined)
										{	
											$('#ns1blankspaceInvoicingColumn2').html(ns1blankspace.xhtml.loading);
											ns1blankspace.financial.invoicing.data.unsent = [];

											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
											oSearch.addField(ns1blankspace.financial.invoicing.unsent.data.fields);
											oSearch.addFilter('sent', 'EQUAL_TO', 'N');
											oSearch.rows = 100;
											oSearch.sort('reference', 'asc');
											oSearch.getResults(function(data) {ns1blankspace.financial.invoicing.unsent.show(oParam, data)});
										}
										else
										{
											var aHTML = [];
											
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table id="ns1blankspaceInvoicingUnsent" class="ns1blankspaceColumn2">' +
																'<tr><td class="ns1blankspaceSub">No unsent invoices.</td></tr></table>');

												$('#ns1blankspaceInvoicingColumn3').html('');
											}
											else
											{
												var aHTML = [];
														
												aHTML.push('<table class="ns1blankspaceColumn2">');
														
												aHTML.push('<tr><td><span id="ns1blankspaceFinancialUnsentPreview" class="ns1blankspaceAction">' +
																'Preview</span></td></tr>');

												aHTML.push('<tr><td id="ns1blankspaceFinancialUnsentPreviewStatus" style="padding-top:5px; padding-bottom:12px; font-size:0.75em;" class="ns1blankspaceSub">' +
																'If you wish, generate a preview on selected invoices before emailing</td></tr>');

												aHTML.push('<tr><td><span id="ns1blankspaceFinancialUnsentEmail" class="ns1blankspaceAction">' +
																'Email</span></td></tr>');

												aHTML.push('<tr><td id="ns1blankspaceFinancialUnsentEmailStatus" style="padding-top:10px; font-size:0.75em;" class="ns1blankspaceSub"></td></tr>');

												aHTML.push('</table>');					
												
												$('#ns1blankspaceInvoicingColumn3').html(aHTML.join(''));
												
												$('#ns1blankspaceFinancialUnsentPreview').button(
												{
													label: 'Preview',
													icons:
													{
														primary: "ui-icon-document"
													}
												})
												.click(function()
												{	
													ns1blankspace.financial.invoicing.unsent.preview.init(oParam)
												})
												.css('width', '90px');

												$('#ns1blankspaceFinancialUnsentEmail').button(
												{
													label: 'Email',
													icons:
													{
														primary: "ui-icon-mail-open"
													}
												})
												.click(function()
												{	
													oParam = {onComplete: ns1blankspace.financial.invoicing.unsent.email};
													ns1blankspace.financial.invoicing.unsent.preview.init(oParam)
												})
												.css('width', '90px');

												var aHTML = [];

												aHTML.push('<table id="ns1blankspaceInvoicingUnsent" class="ns1blankspaceColumn2" style="font-size:0.875em;">' +
															'<tr class="ns1blankspaceHeaderCaption">' +
															'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspaceInvoicingUnsentSelectAll"></span></td>' +
															'<td class="ns1blankspaceHeaderCaption" style="width:100px;">Contact</td>' +
															'<td class="ns1blankspaceHeaderCaption">Description</td>' +
															'<td class="ns1blankspaceHeaderCaption" style="width:60px; text-align:right;">Amount</td>' +
															'<td class="ns1blankspaceHeaderCaption" style="width:50px; text-align:right;">&nbsp;</td>' +
															'</tr>');

												$(oResponse.data.rows).each(function() 
												{
													aHTML.push(ns1blankspace.financial.invoicing.unsent.row(this));
												});
												
												aHTML.push('</table>');
											}
											
											ns1blankspace.render.page.show(
											{
												type: 'JSON',
												xhtmlElementID: 'ns1blankspaceInvoicingColumn2',
												xhtmlContext: 'InvoicingUnsent',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: 100,
												functionShowRow: ns1blankspace.financial.invoicing.unsent.row,
												functionOpen: undefined,
												functionNewPage: 'ns1blankspace.financial.invoicing.unsent.bind()'
											}); 

											ns1blankspace.financial.invoicing.unsent.bind();   	
										}
									}	
								},

					row: 		function (oRow)	
								{
									var aHTML = [];

									oRow.hasEmail = false;
									
									var sContact = oRow['contactbusinesssenttotext'];
									if (sContact == '') {sContact = oRow['contactpersonsenttotext']}

									if (oRow['invoice.contactpersonsentto.email'] != '')
									{
										oRow.hasEmail = true;
										sContact += '<br /><span style="font-size:0.725em;" class="ns1blankspaceSub">' + oRow['invoice.contactpersonsentto.email'] + '</span>';
									}
									else if (oRow['invoice.contactbusinesssentto.email'] != '')
									{
										oRow.hasEmail = true;
										sContact += '<br /><span style="font-size:0.725em;" class="ns1blankspaceSub">' + oRow['invoice.contactbusinesssentto.email'] + '</span>';
									}

									ns1blankspace.financial.invoicing.data.unsent.push(oRow);

									aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspaceUnsent_container-' + oRow["id"] + '">' +
													'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspaceUnsent_selectContainer-' + oRow["id"] + '">' +
													'<input type="checkbox" checked="checked" data-1blankspace="ignore" id="ns1blankspaceUnsent_select-' + oRow["id"] + '"' + 
													' title="' + oRow["reference"] + '" /></td>');

									aHTML.push('<td id="ns1blankspaceUnsent_contact-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														sContact + '</td>');

									aHTML.push('<td id="ns1blankspaceUnsent_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
													oRow["description"] + '</td>'); 

									aHTML.push('<td id="ns1blankspaceUnsent_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
													oRow["amount"] + '</td>'); 

									aHTML.push('<td style="text-align:right;" class="ns1blankspaceRow">');

									aHTML.push('<span style="margin-right:5px;" id="ns1blankspaceUnsent_option_preview-' + oRow['id'] + '"' +
													' class="ns1blankspaceRowPreview"></span>');

									aHTML.push('<span id="ns1blankspaceUnsent_option-' + oRow['id'] + '-1"' +
													' class="ns1blankspaceRowView"></span></td>');
									aHTML.push('</tr>');

									return aHTML.join('');
								},

					bind: 		function ()
								{
									$('#ns1blankspaceInvoicingUnsent .ns1blankspaceRowView').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-play"
										}
									})
									.click(function() {
										ns1blankspace.financial.invoice.init({id: (this.id).split('-')[1]});
									})
									.css('width', '15px')
									.css('height', '20px');

									$('.ns1blankspaceInvoicingUnsentSelectAll').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-check"
										}
									})
									.click(function()
									{	
										$('#ns1blankspaceInvoicingUnsent input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
									})
									.css('width', '14px');			
								},

					preview: 	{
									data: 	{
												fields: 'financialaccounttext,tax,issuedamount,amount,description,object'
											},

									init:		function (oParam)
												{
													var iStep = 1
													var iDataIndex = 0;
													var iDataItemIndex = 0;

													if (oParam != undefined)
													{	
														if (oParam.step != undefined) {iStep = oParam.step}
														if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
														if (oParam.dataItemIndex != undefined) {iDataItemIndex = oParam.dataItemIndex}
													}
													else
													{
														oParam = {}
													}			

													if (iStep == 1)
													{	
														ns1blankspace.financial.invoicing.data.unsentEmail = [];

														if ($('#ns1blankspaceInvoicingUnsent input:checked').length > 0)
														{	
															$('#ns1blankspaceFinancialUnsentPreviewStatus').html('<span style="font-size:2.25em;" class="ns1blankspaceSub">' +
																		'<span id="ns1blankspaceFinancialUnsentPreviewStatusIndex">1</span>/' + $('#ns1blankspaceInvoicingUnsent input:checked').length + 
																		'</span>');
														}
														else
														{
															ns1blankspace.status.error('No invoices selected')
														}	

														$('#ns1blankspaceInvoicingUnsent input:checked').each(function() 
														{
															var iID = (this.id).split('-')[1]

															var oData = $.grep(ns1blankspace.financial.invoicing.data.unsent, function (a) {return a.id == iID;})[0]

															if (oData)
															{
																ns1blankspace.financial.invoicing.data.unsentEmail.push(oData);
															}
														});

														oParam.step = 2;

														if ($.type(ns1blankspace.financial.invoicing.preview.preProcessing) == 'function')
														{
															ns1blankspace.financial.invoicing.preview.preProcessing(oParam)
														}
														else
														{
															ns1blankspace.financial.invoicing.unsent.preview.init(oParam);
														}	
													}			

													if (iStep == 2)
													{
														if (iDataIndex < ns1blankspace.financial.invoicing.data.unsentEmail.length)
														{	
															$('#ns1blankspaceFinancialUnsentPreviewStatusIndex').html(iDataIndex + 1);

															var oData = ns1blankspace.financial.invoicing.data.unsentEmail[iDataIndex];

															$('#ns1blankspaceUnsent_option_preview-' + oData.id).html(ns1blankspace.xhtml.loadingSmall)

															var oSearch = new AdvancedSearch();
															oSearch.method = 'FINANCIAL_ITEM_SEARCH';
															oSearch.addField(ns1blankspace.financial.invoicing.unsent.preview.data.fields);
															oSearch.addFilter('object', 'EQUAL_TO', 5);
															oSearch.addFilter('objectcontext', 'EQUAL_TO', oData.id);
															oSearch.sort('id', 'asc');
															oSearch.getResults(function(oResponse)
															{
																oParam.step = 2;
																oParam.dataIndex = iDataIndex + 1;
																ns1blankspace.financial.invoicing.data.unsentEmail[iDataIndex].items = oResponse.data.rows;

																$('#ns1blankspaceUnsent_option_preview-' + oData.id).html('');
																$('#ns1blankspaceUnsent_option_preview-' + oData.id).addClass('ns1blankspaceRowPreviewDone');

																$('#ns1blankspaceUnsent_option_preview-' + oData.id).button(
																{
																	text: false,
																	icons:
																	{
																		primary: "ui-icon-document"
																	}
																})
																.click(function() {
																	ns1blankspace.financial.invoicing.unsent.preview.showHide({xhtmlElementID: this.id});
																})
																.css('width', '15px')
																.css('height', '20px');

																ns1blankspace.financial.invoicing.unsent.preview.init(oParam);
															});
														}
														else
														{
															$('#ns1blankspaceFinancialUnsentPreviewStatus').fadeOut(3000);
															delete oParam.dataIndex;
															ns1blankspace.util.onComplete(oParam);
														}	
													}						
												},

									showHide: 	function (oParam)
												{
													var sXHTMLElementID;
													var sID;

													if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
													{
														sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
														sID = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
													}

													if ($('#ns1blankspaceUnsent_container_preview-' + sID).length != 0)
													{
														$('#ns1blankspaceUnsent_container_preview-' + sID).remove();
													}
													else
													{
														var sHTML = 'No preview';

														var oInvoice = $.grep(ns1blankspace.financial.invoicing.data.unsentEmail, function (a) {return a.id == sID;})[0];

														if (oInvoice)
														{
															sHTML = ns1blankspace.format.render(
															{
																object: 5,
																objectContext: oInvoice.id,
																xhtmlTemplate: ns1blankspace.xhtml.templates['invoice'],
																objectData: oInvoice,
																objectOtherData: oInvoice.items
															});

															oInvoice.xhtml = sHTML;
														}	

														$('#ns1blankspaceUnsent_container-' + sID).after('<tr id="ns1blankspaceUnsent_container_preview-' + sID + '">' +
																		'<td colspan=5><div style="background-color: #F3F3F3; padding:8px;" class="ns1blankspaceScale85">' + sHTML + '</div></td></tr>')
													}
												}			
								},				

					email: 	function (oParam)
								{		
									var iDataIndex = 0;
									var bCreatePDF = ns1blankspace.util.getParam(oParam, 'createPDF', {"default": false}).value;
									var iStep = ns1blankspace.util.getParam(oParam, 'emailSendStep', {"default": 1}).value;

									if (oParam != undefined)
									{	
										if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
									}
									else
									{
										oParam = {}
									}			
						
									if (iDataIndex < ns1blankspace.financial.invoicing.data.unsentEmail.length)
									{
										$('#ns1blankspaceFinancialUnsentEmailStatus').html('<span style="font-size:2.25em;" class="ns1blankspaceSub">' +
											'<span id="ns1blankspaceFinancialUnsentPreviewStatusIndex">' + (iDataIndex + 1) + '</span>/' + ns1blankspace.financial.invoicing.data.unsentEmail.length + 
											'</span>');

										var sHTML = 'No preview';
										var sTo;

										var oInvoice = ns1blankspace.financial.invoicing.data.unsentEmail[iDataIndex];

										if (oInvoice != undefined)
										{
											if (iStep == 1)
											{	
												sHTML = ns1blankspace.format.render(
												{
													object: 5,
													objectContext: oInvoice.id,
													xhtmlTemplate: ns1blankspace.xhtml.templates['invoice'],
													objectData: oInvoice,
													objectOtherData: oInvoice.items
												});	

												oInvoice.xhtml = sHTML;

												if (bCreatePDF)
												{
													//TODO
													var sHTML = oInvoice.xhtml;
													var sURL = window.location.protocol + '//' + window.location.host;

													oParam.emailSendStep = 2;
													$.extend(oParam, 
													{
														xhtmlContent: sHTML,
														filename: oInvoice.reference + '.pdf',
														open: false,
														object: 5,
														objectContext: oInvoice.id,
														onComplete: ns1blankspace.financial.invoicing.unsent.email,
														leftmargin: 1,
														rightmargin: 1,
														topmargin: 1,
														bottommargin: 1,
														baseURLBody: sURL
													});
													
													ns1blankspace.pdf.create(oParam);
												}
												else
												{
													iStep = 2
												}
											}	

											if (iStep == 2)	
											{
												sTo = oInvoice['invoice.contactpersonsentto.email'];
												if (sTo == '') {sTo = oInvoice['invoice.contactbusinesssentto.email']};

												if (bCreatePDF)
												{
													$('#ns1blankspaceUnsent_option_preview-' + oInvoice.id)
														.attr('data-attachmentlink', oParam.attachmentLink)
														.unbind('click')
														.on('click', function()
														{
															window.open('/download/' + $(this).attr('data-attachmentlink'));
														});
												}

												if (sTo != '')
												{	
													var oData = 
													{
														subject: oInvoice.reference,
		 												message: oInvoice.xhtml,
		 												to: sTo,
		 												object: 5,
		 												objectContext: oInvoice.id,
		 												copyattachmentsfromobject: 5,
														copyattachmentsfromobjectcontext: oInvoice.id,
														copyattachmentsfromobjectattachmentlink: oParam.attachmentLink.split('/').pop()
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
																	data: 'sent=Y&id=' + oInvoice.id,
																	dataType: 'json',
																	global: false,
																	success: function (data)
																	{
																		$('#ns1blankspaceUnsent_selectContainer-' + oInvoice.id).html('Emailed');
																		oParam.dataIndex = iDataIndex + 1;
																		oParam.emailSendStep = 1;
																		ns1blankspace.financial.invoicing.unsent.email(oParam);
																	}
																});
															}
															else
															{
																$('#ns1blankspaceUnsent_selectContainer-' + oInvoice.id).html('Error');
																$('#ns1blankspaceUnsent_selectContainer-' + oInvoice.id).attr('title', data.error.errornotes);
															}
														}
													});
												}
												else
												{
													$('#ns1blankspaceUnsent_selectContainer-' + oInvoice.id).html('No email');
													oParam.dataIndex = iDataIndex + 1;
													oParam.emailSendStep = 1
													ns1blankspace.financial.invoicing.unsent.email(oParam);
												}	
											}
										}
										else
										{
											oParam.dataIndex = iDataIndex + 1;
											oParam.emailSendStep = 1
											ns1blankspace.financial.invoicing.unsent.email(oParam);
										}	
									}
								}																			
				},

	create: 	{
					show:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{	
										$('#ns1blankspaceInvoicingColumn2').html(ns1blankspace.xhtml.loading);
										ns1blankspace.financial.invoicing.data.create = [];

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
										oSearch.addField('area,reference,sentdate,amount,description' +
															',contactbusinesssentto,contactbusinesssenttotext' +
															',contactpersonsentto,contactpersonsenttotext' +
															',contactbusinessdeliverto,contactpersondeliverto' +
															',object,objectcontext,project,purchaseorder,sentdate,frequency');

										oSearch.addBracket('(');
										oSearch.addFilter('sentdate', 'LESS_THAN_OR_EQUAL_TO', 'month', '-1');
										oSearch.addFilter('frequency', 'EQUAL_TO', 4);
										oSearch.addBracket(')');

										oSearch.addOperator('or');

										oSearch.addBracket('(');
										oSearch.addFilter('sentdate', 'LESS_THAN_OR_EQUAL_TO', 'month', '-3');
										oSearch.addFilter('frequency', 'EQUAL_TO', 5);
										oSearch.addBracket(')');

										oSearch.addOperator('or');

										oSearch.addBracket('(');
										oSearch.addFilter('sentdate', 'LESS_THAN_OR_EQUAL_TO', 'year', '-1');
										oSearch.addFilter('frequency', 'EQUAL_TO', 7);
										oSearch.addBracket(')');

										oSearch.addFilter('sent', 'EQUAL_TO', 'Y');

										oSearch.rows = 100;
										oSearch.sort('reference', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.financial.invoicing.create.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="ns1blankspaceInvoicingCreate" class="ns1blankspaceColumn2">' +
															'<tr><td class="ns1blankspaceSub">No invoices to create.</td></tr></table>');

											$('#ns1blankspaceInvoicingColumn3').html('');
										}
										else
										{			
											aHTML.push('<table class="ns1blankspaceColumn2">');
													
											aHTML.push('<tr><td><span id="ns1blankspaceFinancialCreateCopy" class="ns1blankspaceAction">' +
															'Copy</span></td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialCreateCopyStatus" style="padding-top:10px; font-size:0.75em;" class="ns1blankspaceSub">' +
															'Selected invoices will be copied with todays date, ready for sending.</td></tr>');

											aHTML.push('</table>');					
											
											$('#ns1blankspaceInvoicingColumn3').html(aHTML.join(''));
											
											$('#ns1blankspaceFinancialCreateCopy').button(
											{
												text: 'Copy',
												icons:
												{
													primary: "ui-icon-copy"
												}
											})
											.click(function()
											{	
												ns1blankspace.financial.invoicing.create.copy()
											})
											.css('width', '80px');

											var aHTML = [];

											aHTML.push('<table id="ns1blankspaceInvoicingCreate" class="ns1blankspaceColumn2" style="font-size:0.875em;">' +
														'<tr class="ns1blankspaceHeaderCaption">' +
														'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspaceInvoicingCreateSelectAll"></span></td>' +
														'<td class="ns1blankspaceHeaderCaption" style="width:100px;">Last Sent</td>' +
														'<td class="ns1blankspaceHeaderCaption">Contact</td>' +
														'<td class="ns1blankspaceHeaderCaption">Description</td>' +
														'<td class="ns1blankspaceHeaderCaption" style="width:100px; text-align:right;">Amount</td>' +
														'<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
														'</tr>');

											$(oResponse.data.rows).each(function() 
											{
												aHTML.push(ns1blankspace.financial.invoicing.create.row(this));
											});
											
											aHTML.push('</table>');
										}
										
										ns1blankspace.render.page.show(
										{
											type: 'JSON',
											xhtmlElementID: 'ns1blankspaceInvoicingColumn2',
											xhtmlContext: 'InvoicingCreate',
											xhtml: aHTML.join(''),
											showMore: (oResponse.morerows == "true"),
											more: oResponse.moreid,
											rows: 100,
											functionShowRow: ns1blankspace.financial.invoicing.create.row,
											functionOpen: undefined,
											functionNewPage: 'ns1blankspace.financial.invoicing.create.bind()'
										}); 

										ns1blankspace.financial.invoicing.create.bind();
									}
								},

					row: 		function (oRow)	
								{
									ns1blankspace.financial.invoicing.data.create.push(oRow);

									var aHTML = [];
									
									aHTML.push('<tr class="ns1blankspaceRow">' +
													'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspaceCreate_selectContainer-' + oRow["id"] + '">' +
													'<input type="checkbox" checked="checked" data-1blankspace="ignore" id="ns1blankspaceCreate_select-' + oRow["id"] + '"'+ 
													' title="' + oRow["reference"] + '" /></td>');

									var sFrequency = 'Monthly';
									if (oRow['frequency'] == 5) {sFrequency = 'Quarterly'}
									if (oRow['frequency'] == 7) {sFrequency = 'Yearly'}

									aHTML.push('<td id="ns1blankspaceCreate_sentdate-' + oRow["id"] + '" class="ns1blankspaceRow">' +
													oRow["sentdate"] + '<br /><span class="ns1blankspaceSub">' + sFrequency + '</span></td>'); 

									var sContact = oRow['contactbusinesssenttotext'];
									if (sContact == '') {sContact = oRow['contactpersonsenttotext']}
								
									aHTML.push('<td id="ns1blankspaceCreate_contact-' + oRow["id"] + '" class="ns1blankspaceRow">' +
														sContact + '</td>');

									aHTML.push('<td id="ns1blankspaceCreate_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
													oRow["description"] + '</td>'); 

									aHTML.push('<td id="ns1blankspaceCreate_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
													oRow["amount"] + '</td>'); 

									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
									aHTML.push('<span id="ns1blankspaceCreate_view-' + oRow['id'] + '"' +
													' data-id="' + oRow['id'] + '"' +
													' class="ns1blankspaceRowView"></span></td>');
									aHTML.push('</tr>');

									return aHTML.join('');
								},

					bind: 		function ()
								{
									$('#ns1blankspaceInvoicingCreate .ns1blankspaceRowView').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-play"
										}
									})
									.click(function() {
										ns1blankspace.financial.invoice.init({id: $(this).attr('data-id')});
									})
									.css('width', '15px')
									.css('height', '20px');

									$('.ns1blankspaceInvoicingCreateSelectAll').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-check"
										}
									})
									.click(function()
									{	
										$('#ns1blankspaceInvoicingCreate input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
									})
									.css('width', '14px');			
								},

					copy: 		function (oParam)
								{
									var iStep = 1
									var iDataIndex = 0;
									var iDataItemIndex = 0;

									if (oParam != undefined)
									{	
										if (oParam.step != undefined) {iStep = oParam.step}
										if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
										if (oParam.dataItemIndex != undefined) {iDataItemIndex = oParam.dataItemIndex}
									}
									else
									{
										oParam = {}
									}			

									if (iStep == 1)
									{	
										ns1blankspace.financial.invoicing.data.createCopy = [];

										if ($('#ns1blankspaceInvoicingCreate input:checked').length > 0)
										{	
											$('#ns1blankspaceFinancialCreateCopyStatus').html('<span id="ns1blankspaceImportStatus" style="font-size:2.25em;" class="ns1blankspaceSub">' +
														'<span id="ns1blankspaceFinancialCreateCopyStatusIndex">1</span>/' + $('#ns1blankspaceInvoicingCreate input:checked').length + 
														'</span>');
										}
										else
										{
											ns1blankspace.status.error('No invoices selected')
										}	

										$($('#ns1blankspaceInvoicingCreate input:checked')).each(function() 
										{
											var iID = (this.id).split('-')[1]

											var oData = $.grep(ns1blankspace.financial.invoicing.data.create, function (a) {return a.id == iID;})[0]

											if (oData)
											{
												oData.sentdate = Date.today().toString("dd-MMM-yyyy");
												oData.sent = 'N';
												oData.source = oData.id;
												delete oData.reference;
												delete oData.id;
												delete oData.amount;
												delete oData.contactbusinesssenttotext;
												delete oData.contactpersonsenttotext;

												ns1blankspace.financial.invoicing.data.createCopy.push(oData);
											}
										});

										oParam.step = 2;
										ns1blankspace.financial.invoicing.create.copy(oParam);
									}			

									if (iStep == 2)
									{
										if (iDataIndex < ns1blankspace.financial.invoicing.data.createCopy.length)
										{	
											$('#ns1blankspaceFinancialCreateCopyStatusIndex').html(iDataIndex + 1);

											var oData = ns1blankspace.financial.invoicing.data.createCopy[iDataIndex];

											$('#ns1blankspaceCreate_selectContainer-' + oData.source).html(ns1blankspace.xhtml.loadingSmall)

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_INVOICE_MANAGE'),
												data: oData,
												dataType: 'json',
												global: false,
												success: function (data)
												{
													if (data.status == 'OK')
													{
														$('#ns1blankspaceCreate_sentdate-' + oData.source).html('')
														$('#ns1blankspaceCreate_view-' + oData.source).attr('data-id', data.id)
														//oData.response = data;
														oData.id = data.id;

														oParam.step = 3;  // LINE ITEMS
														ns1blankspace.financial.invoicing.create.copy(oParam);
													}
													else
													{
														$('#ns1blankspaceCreate_selectContainer-' + oData.source).html('Error');
														$('#ns1blankspaceCreate_selectContainer-' + oData.source).attr('title', data.error.errornotes);
													}
												}
											});
										}
										else
										{
											$('#ns1blankspaceFinancialCreateCopyStatus').fadeOut(3000);
										}
									}

									if (iStep == 3 && (iDataIndex < ns1blankspace.financial.invoicing.data.createCopy.length))
									{
										var oData = ns1blankspace.financial.invoicing.data.createCopy[iDataIndex];

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_ITEM_SEARCH';
										oSearch.addField('financialaccounttext,tax,issuedamount,amount,description,object');
										oSearch.addFilter('object', 'EQUAL_TO', 5);
										oSearch.addFilter('objectcontext', 'EQUAL_TO', oData.source);
										oSearch.sort('id', 'asc');
										oSearch.getResults(function(oResponse)
										{
											oParam.step = 4;
											oParam.dataItemIndex = 0;
											ns1blankspace.financial.invoicing.data.createCopyItems = oResponse.data.rows;
											ns1blankspace.financial.invoicing.create.copy(oParam);
										});
									}		

									if (iStep == 4)
									{
										var oData = ns1blankspace.financial.invoicing.data.createCopy[iDataIndex]

										if (iDataItemIndex < ns1blankspace.financial.invoicing.data.createCopyItems.length)
										{
											var oDataItem = ns1blankspace.financial.invoicing.data.createCopyItems[iDataItemIndex];

											oDataItem.objectContext = oData.id;
											delete oDataItem.id;

											if (ns1blankspace.option.financialOverride)
											{
												oDataItem.override = 'Y'
											}	

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
												data: oDataItem,
												dataType: 'json',
												success: function(oResponse)
												{
													oParam.dataItemIndex = iDataItemIndex + 1;
													ns1blankspace.financial.invoicing.create.copy(oParam);
												}
											});
										}
										else
										{
											var sData = 'object=5&objectcontext=' + oData.id;

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_COMPLETE'),
												data: sData,
												dataType: 'json',
												success: function(oResponse)
												{	
													$('#ns1blankspaceCreate_selectContainer-' + oData.source).html('Copied');

													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('FINANCIAL_INVOICE_MANAGE'),
														data: 'override_LockedSent=Y&override_LockedDate=Y&frequency=9&id=' + oData.source,
														dataType: 'json',
														global: false,
														success: function (data)
														{
															oParam.dataIndex = iDataIndex + 1;
															oParam.step = 2;  // NEXT INVOICE
															ns1blankspace.financial.invoicing.create.copy(oParam);
														}
													});
												}
											});
										}
									}
								}													
				}
}				

ns1blankspace.financial.transactions =
{
	show: 	function (oParam, oResponse)
				{
					var iObject = ns1blankspace.object;
					var iObjectContext = ns1blankspace.objectContext;
					var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
					var iFinancialAccount;
					var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceMainTransaction'}).value;
					var sNamespace = ns1blankspace.util.getParam(oParam, 'namespace').value;
					var iRows = ns1blankspace.util.getParam(oParam, 'rows', {"default": 20}).value;

					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.financialAccount != undefined) {iFinancialAccount = oParam.financialAccount}
					}		
						
					if (oResponse == undefined)
					{			
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
						
						if (iFinancialAccount)
						{	
							oSearch.addField('amount,date,description');
							oSearch.addFilter('financialaccount', 'EQUAL_TO', iFinancialAccount);
							oSearch.addSummaryField('count(id) count');
							oSearch.rows = iRows;
							oSearch.sort('date', 'desc');
						}
						else
						{	
							oSearch.addField('financialaccounttext,amount,date,description');
							oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
							oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
							oSearch.sort('financialaccounttext', 'asc');
						}

						if (sNamespace!=undefined)
						{	
							if (ns1blankspace.financial[sNamespace].data.startdate!='') {oSearch.addFilter('date', 'GREATER_THAN_OR_EQUAL_TO', ns1blankspace.financial[sNamespace].data.startdate)};
							if (ns1blankspace.financial[sNamespace].data.enddate!='') {oSearch.addFilter('date', 'LESS_THAN_OR_EQUAL_TO', ns1blankspace.financial[sNamespace].data.enddate)};
						}

						if (iProject != undefined)
						{
							oSearch.addFilter('project', 'EQUAL_TO', iProject);
						}

						oSearch.addFilter('amount', 'NOT_EQUAL_TO', 0);

						oSearch.getResults(function(data) {ns1blankspace.financial.transactions.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							if (sXHTMLElementID.indexOf('-transactions-') != -1)
							{
								$('#' + sXHTMLElementID.replace('-transactions-', '-export-')).hide();
							}	
							
							aHTML.push('<table><tbody>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceNothing">No financial transactions.</td>' +
											'</tr>' +
											'</tbody></table>');

							$('#' + sXHTMLElementID).html(aHTML.join(''));

						}
						else
						{
							aHTML.push('<table class="ns1blankspace">');

						/*	aHTML.push('<tr class="ns1blankspaceHeaderCaption">');

							if (iFinancialAccount == undefined)
							{
								aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:150px;">Account</td>');
							}

							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:75px;">Date</td>' +
											'<td class="ns1blankspaceHeaderCaption">Description</td>' +
											'<td class="ns1blankspaceHeaderCaption" style="width:100px; text-align:right;">Amount</td>' +
											'</tr>');*/

							$.each(oResponse.data.rows, function()
							{
								aHTML.push(ns1blankspace.financial.transactions.row(this));
							});
							
							aHTML.push('</table>');

							ns1blankspace.render.page.show(
							{
								xhtmlElementID: sXHTMLElementID,
								xhtmlContext: sXHTMLElementID,
								xhtml: aHTML.join(''),
								showMore: (oResponse.morerows == "true"),
								more: oResponse.moreid,
								rows: iRows,
								functionShowRow: ns1blankspace.financial.transactions.row,
								functionNewPage: 'ns1blankspace.financial.transactions.bind()',
								headerRow: false,
								summary: oResponse.summary
							}); 	
								
							ns1blankspace.financial.transactions.bind();
						}
					}	
				},

	row: 		function(oRow)
				{
					var aHTML = [];
					
					aHTML.push('<tr class="ns1blankspaceRow">');
						
					if (oRow.financialaccounttext)
					{							
						aHTML.push('<td id="ns1blankspaceFinancialTransaction_financialaccounttext-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666; width:65px;">' +
											oRow.financialaccounttext + '</td>');
					}	
											
					aHTML.push('<td id="ns1blankspaceFinancialTransaction_date-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666; text-align:right;">' +
											oRow.date + '</td>');
													
					aHTML.push('<td id="ns1blankspaceFinancialTransaction_description-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' +
											oRow.description + '</td>');
										
					aHTML.push('<td id="ns1blankspaceFinancialTransaction_amount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
											oRow.amount + '</td>');
																							
					aHTML.push('</td></tr>');

					return aHTML.join('');
				},

	bind: 	function()
				{

				}			
}

ns1blankspace.financial.item =
{
	show:	function (oParam, oResponse)
			{
				var oOptions = ns1blankspace.util.getParam(oParam, 'options', {"default": {view: true, remove: true}}).value;
				var oActions = ns1blankspace.util.getParam(oParam, 'actions', {"default": {add: true}}).value;
				
				if (oOptions.view == undefined) {oOptions.view = true}
				if (oOptions.remove == undefined) {oOptions.remove = true}
				if (oActions.add == undefined) {oActions.add = true}

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
										'<td id="ns1blankspaceItemColumn2" class="ns1blankspaceColumn2" style="width:275px;"></td>' +
										'</tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainItem').html(aHTML.join(''));
						
						if (oActions.add)
						{
							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspaceColumn2">' +
											'<tr><td class="ns1blankspaceAction">' +
											'<span id="ns1blankspaceItemAdd">Add</span>' +
											'</td></tr></table>');					
							
							$('#ns1blankspaceItemColumn2').html(aHTML.join(''));
						
							$('#ns1blankspaceItemAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', undefined);
								oParam = ns1blankspace.util.setParam(oParam, 'step', 1);
								ns1blankspace.financial.item.edit(oParam);
							});							
						}				
					}

					var sOutstanding = 'expense';
					if (iObject == 5 || iObject == 6) {sOutstanding = 'invoice'}

					var oSearch = new AdvancedSearch();
					oSearch.method = 'FINANCIAL_ITEM_SEARCH';
					oSearch.addField('otherobjectcontext,objectcontext,object,otherobject,financialaccount,financialaccounttext,taxtype,tax,issuedamount,amount,description,' + sOutstanding + 'outstandingamount,preadjustmentamount,preadjustmenttax,capital');
					oSearch.addFilter('object', 'EQUAL_TO', iObject);
					oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext);
					oSearch.sort('id', 'desc');
					
					oSearch.getResults(function(data) {ns1blankspace.financial.item.show(oParam, data)});
				}
				else
				{
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">No items.<br /><br /><span style="font-weight:100">Once you have entered details for the first item,<br />click Save.</span></td></tr></table>');

						$('#ns1blankspaceItemColumn1').html(aHTML.join(''));

						oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', undefined);
						oParam = ns1blankspace.util.setParam(oParam, 'step', 1);
						ns1blankspace.financial.item.edit(oParam);
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
							aHTML.push(ns1blankspace.financial.item.row(this));
						});
						
						aHTML.push('</table>');

						$.extend(true, oParam,
						{
							xhtmlElementID: 'ns1blankspaceItemColumn1',
							xhtmlContext: '',
							xhtml: aHTML.join(''),
							showMore: ($(oResponse).attr('morerows') == "true"),
							more: $(oResponse).attr('moreid'),
							rows: ns1blankspace.option.defaultRows,
							functionShowRow: ns1blankspace.financial.item.row,
							functionOnNewPage: ns1blankspace.financial.item.bind
					   	});

						ns1blankspace.render.page.show(oParam); 	
					}
				}	
			},

	row: 	function(oRow, oParam)
			{
				var oOptions = ns1blankspace.util.getParam(oParam, 'options', {"default": {view: true, remove: true}}).value;
				var oActions = ns1blankspace.util.getParam(oParam, 'actions', {"default": {add: true}}).value;
				
				if (oOptions.view == undefined) {oOptions.view = true}
				if (oOptions.remove == undefined) {oOptions.remove = true}
				if (oActions.add == undefined) {oActions.add = true}

				var aHTML = [];

				aHTML.push('<tr class="ns1blankspaceRow">');
										
				aHTML.push('<td id="ns1blankspaceItem_financialaccounttext-' + oRow.id + '" class="ns1blankspaceRow">' +
								oRow.financialaccounttext + '</td>');

				aHTML.push('<td id="ns1blankspaceItem_description-' + oRow.id + '" class="ns1blankspaceRow">' +
								oRow.description + '</td>');
				
				aHTML.push('<td id="ns1blankspaceItem_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
								oRow.preadjustmentamount + '</td>');

				aHTML.push('<td id="ns1blankspaceItem_tax-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' +
								oRow.preadjustmenttax + '</td>');

				aHTML.push('<td style="width:70px;text-align:right;" class="ns1blankspaceRow">');

				if (oOptions.remove)
				{
					aHTML.push('<span id="ns1blankspaceRowItem_options_remove-' + oRow.id + '" class="ns1blankspaceItemRemove"></span>');
				}

				if (oActions.add)
				{
					aHTML.push('<span id="ns1blankspaceRowItem_options_edit-' + oRow.id + '" class="ns1blankspaceItemEdit"' +
								' data-amount="' + oRow.amount + '"' +
								' data-tax="' + oRow.tax + '"' +
								' data-taxtype="' + oRow.taxtype + '"' +
								' data-financialaccount="' + oRow.financialaccount + '"' +
								' data-financialaccounttext="' + oRow.financialaccounttext + '"' +
								' data-capital="' + oRow.capital + '"' +
								' data-description="' + oRow.description + '"' +
								'></span>');
				}
					
				aHTML.push('</td></tr>');

				return aHTML.join('');
			},

	bind: function(oParam)
			{	
				var sXHTMLContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlContainerID').value;
				var sNamespace = ns1blankspace.util.getParam(oParam, 'namespace').value;

				$('#' + sXHTMLContainerID + ' .ns1blankspaceItemRemove').button(
				{
					text: false,
					icons:
					{
						primary: "ui-icon-close"
					}
				})
				.click(function()
				{
					ns1blankspace.remove(
					{
						xhtmlElementID: this.id,
						method: 'FINANCIAL_ITEM_MANAGE',
						ifNoneMessage: 'No items.',
						onComplete: ns1blankspace.financial.item.remove,
						namespace: sNamespace
					});
				})
				.css('width', '15px')
				.css('height', '17px');

				$('#' + sXHTMLContainerID + ' .ns1blankspaceItemEdit').button(
				{
					text: false,
					icons:
					{
						primary: "ui-icon-pencil"
					}
				})
				.click(function()
				{
					oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', this.id);
					oParam = ns1blankspace.util.setParam(oParam, 'step', 1);
					ns1blankspace.financial.item.edit(oParam)
				})
				.css('width', '15px')
				.css('height', '17px');
			},

	remove:
			function (oParam, oResponse)
			{
				var sNamespace = ns1blankspace.util.getParam(oParam, 'namespace').value;

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_COMPLETE'),
					data: {object: ns1blankspace.object, objectcontext: ns1blankspace.objectContext},
					dataType: 'json',
					success: function(data)
					{
						ns1blankspace.financial[sNamespace].refresh()
					}
				});
			},

	edit:	function (oParam, oResponse)
			{
				var iFinancialAccountType;

				var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": 1}).value;		
				var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1}).value;
				var sNamespace = ns1blankspace.util.getParam(oParam, 'namespace').value;
				var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
				var bShowAccount = ns1blankspace.util.getParam(oParam, 'showAccount',
					{"default": (ns1blankspace.financial.data.settings.taxreportcalculationmethod == 1 || ns1blankspace.option.financialsStrict != true)}).value;
				
				if (sNamespace === 'expense' || sNamespace === 'payment') {iType = 2}

				if (oResponse == undefined)
				{
					if (iStep == 1)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceContainer">');

						aHTML.push('<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceItemEditColumn1"></td>' +
										'<td id="ns1blankspaceItemEditColumn2" style="width:50px;"></td>' +
										'</tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceItemColumn2').html(aHTML.join(''));

						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceColumn2a">' +
										'<tr><td><span id="ns1blankspaceItemEditSave" class="ns1blankspaceAction">' +
										'Save</span></td></tr>' +
										'<tr><td><span id="ns1blankspaceItemEditCancel" class="ns1blankspaceAction">' +
										'Cancel</span></td></tr>' +
										'</table>');					
						
						$('#ns1blankspaceItemEditColumn2').html(aHTML.join(''));
						
						$('#ns1blankspaceItemEditSave').button(
						{
							text: "Save"
						})
						.click(function()
						{
							ns1blankspace.financial.item.save(oParam)
						})
						.css('width', '65px');

						$('#ns1blankspaceItemEditCancel').button(
						{
							text: "Cancel"
						})
						.click(function()
						{
							var aHTML = [];
						
							aHTML.push('<table class="ns1blankspaceColumn2">' +
											'<tr><td class="ns1blankspaceAction">' +
											'<span id="ns1blankspaceItemAdd">Add</span>' +
											'</td></tr></table>');					
							
							$('#ns1blankspaceItemColumn2').html(aHTML.join(''));
						
							$('#ns1blankspaceItemAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', undefined);
								oParam = ns1blankspace.util.setParam(oParam, 'step', 1);
								ns1blankspace.financial.item.edit(oParam);
							});						
						})
						.css('width', '65px');

						var aHTML = [];
						// v2.0.4a Now allows user to see all account types
						var sAccountType = '';
						if (sNamespace === 'payment') {sAccountType = 'expense'}
						else if (sNamespace === 'expense') {sAccountType = 'expense'}
						else if (sNamespace === 'invoice') {sAccountType = 'revenue'}
						else if (sNamespace === 'receipt') {sAccountType = 'revenue'}						
						aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');
				
						if (bShowAccount || sNamespace === 'expense' || sNamespace === 'invoice')
						{
							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'<div style="float:left;" class="ns1blankspaceCaption">Account&nbsp;</div>' +
										'<div style="float:right; margin-top:11px;">' +
											'<span style="font-weight:normal; font-size:0.625em; text-align:right; margin-right:4px;">All</span>' +
											'<input type="checkbox" id="ns1blankspaceItemShowAll" style="margin:0px; padding:0px; border: 0px; margin-top:2px;">' +
										'</div>'	+
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceItemAccount" class="ns1blankspaceText">' +
										'</td></tr>');
							
							aHTML.push('<tr><td style="padding-bottom:5px;" id="ns1blankspaceItemAddSearchResults">' +
											'<span class="ns1blankspaceSub" style="font-size:0.75em;">Press <i>enter</i> to see all ' + sAccountType + ' accounts<br />or just start typing.</span></td></tr>');
						}	

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

						if (ns1blankspace.option.financialShowProjects)
						{
							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Project' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceItemProject" class="ns1blankspaceSelect"' +
											' data-method="PROJECT_SEARCH"' +
											' data-columns="reference-space-description"' +
											' data-methodFilter="reference-TEXT_IS_LIKE|description-TEXT_IS_LIKE">' +
										'</td></tr>');
						}

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea id="ns1blankspaceItemDescription" class="ns1blankspaceTextMulti" style="height:50px; width:200px;" rows="3" cols="35" ></textarea>' +
										'</td></tr>');	

						if (sAccountType == 'expense')
						{
							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Capital' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioCapitalN" name="radioCapital" value="N"/>No' +
										'<br /><input type="radio" id="radioCapitalY" name="radioCapital" value="Y"/>Yes' +
										'</td></tr>');
						}
		
						aHTML.push('</table>');		
						
						$('#ns1blankspaceItemEditColumn1').html(aHTML.join(''));

						var iTaxType = 1;

						if (iID !== undefined)
						{
							iTaxType = ns1blankspace.util.getData(oParam, 'data-taxtype').value
							$('#ns1blankspaceItemAmount').val(ns1blankspace.util.getData(oParam, 'data-amount').value);
							$('#ns1blankspaceItemTax').val(ns1blankspace.util.getData(oParam, 'data-tax').value);
							$('#ns1blankspaceItemDescription').val(ns1blankspace.util.getData(oParam, 'data-description').value);
							$('#ns1blankspaceItemAccount').val(ns1blankspace.util.getData(oParam, 'data-financialaccounttext').value);
							$('#ns1blankspaceItemAccount').attr('data-id', ns1blankspace.util.getData(oParam, 'data-financialaccount').value);
							$('#ns1blankspaceItemProject').val(ns1blankspace.util.getData(oParam, 'data-projecttext').value);
							$('#ns1blankspaceItemProject').attr('data-id', ns1blankspace.util.getData(oParam, 'data-project').value);
							$('[name="radioCapital"][value="' + ns1blankspace.util.getData(oParam, 'data-capital').value + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioCapital"][value="N"]').attr('checked', true);
						}
	
						ns1blankspace.financial.util.tax.codes(
						{
							xhtmlElementID: 'ns1blankspaceFinancialTaxCode',
							id: iTaxType,
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
							oParam = ns1blankspace.util.setParam(oParam, 'step', 2);
							if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
					        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.item.edit(' + JSON.stringify(oParam) + ')', ns1blankspace.option.typingWait);
						});
		
						$('#ns1blankspaceItemAccount').focus();

						if (iID === undefined)
						{
							var iFinancialAccountType = (iType==1?2:1);
							var oData = $.grep(ns1blankspace.financial.data.accounts, function (a)
							{ 
								if ($('#ns1blankspaceItemShowAll').prop('checked') == true)
								{
									return (a.postable == 'Y')
								}
								else
								{
									return (a.type == iFinancialAccountType && a.postable == 'Y')
								}
							});

							if (oData.length < 21)
							{	
								oParam = ns1blankspace.util.setParam(oParam, 'step', 3);
								ns1blankspace.financial.item.edit(oParam, oData);
							}	
						}	
					}

					if (iStep == 2)
					{	
						ns1blankspace.status.working();

						var iFinancialAccountType = (iType==1?2:1);
						var sSearch = $('#ns1blankspaceItemAccount').val()

						if (sSearch == '')
						{
							var oData = $.grep(ns1blankspace.financial.data.accounts, function (a)
							{ 
								// v2.0.4a Removes filter on account type if requested
								if ($('#ns1blankspaceItemShowAll').prop('checked') == true)
								{
									return (a.postable == 'Y')
								}
								else
								{
									return (a.type == iFinancialAccountType && a.postable == 'Y')
								}
							});
						}
						else
						{
							sSearch = sSearch.toLowerCase();
							var oData = $.grep(ns1blankspace.financial.data.accounts, function (a)
							{
								// v2.0.4a Removes filter on account type if requested
								if ($('#ns1blankspaceItemShowAll').prop('checked') == true)
								{
									return ((a.title).toLowerCase().indexOf(sSearch) != -1 && a.postable == 'Y')
								}
								else
								{
									return (a.type == iFinancialAccountType && (a.title).toLowerCase().indexOf(sSearch) != -1 && a.postable == 'Y')
								}
							});
						}	

						oParam = ns1blankspace.util.setParam(oParam, 'step', 3);
						ns1blankspace.financial.item.edit(oParam, oData);
					}
				}
				else
				{
					ns1blankspace.status.message('');

					var aHTML = [];
					
					if (oResponse.length == 0)	
					{
						aHTML.push('<table class="ns1blankspace">' +
										'<tr><td class="ns1blankspaceNothing">No accounts.</td></tr>' + 
										'</table>');

						$('#ns1blankspaceItemAddSearchResults').html(aHTML.join(''));		
					}
					else
					{	
						aHTML.push('<table class="ns1blankspace" style="font-size:0.875em;">');
						
						$.each(oResponse, function() 
						{ 
							aHTML.push('<tr class="ns1blankspaceRow">'+ 
											'<td id="ns1blankspaceItem_title-' + this.id + '-' + this.taxtype + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
											this.title + '</td></tr>');	
						});
						
						aHTML.push('</table>');

						$('#ns1blankspaceItemAddSearchResults').html(aHTML.join(''))
						
						$('.ns1blankspaceRowSelect')
						.click(function()
						{
							var sID = this.id;
							var aID = sID.split('-');

							$('#ns1blankspaceItemAccount').attr('data-id', aID[1]);
							$('#ns1blankspaceItemAccount').val($(this).html());
							$('#ns1blankspaceItemAddSearchResults').html('');

							if (aID[2] != '')
							{
								$('[name="radioTaxCode"][value="' + aID[2] + '"]').attr('checked', true);

								ns1blankspace.financial.util.tax.calculate(
								{
									amountXHTMLElementID: 'ns1blankspaceItemAmount',
									taxXHTMLElementID: 'ns1blankspaceItemTax'
								});

								$('#ns1blankspaceItemAmount').focus();
							}

						});
					}
				}	
			},

	save: function(oParam)
			{
				var sNamespace = ns1blankspace.util.getParam(oParam, 'namespace').value;

				ns1blankspace.status.working();

				var iAccount = ns1blankspace.util.getParam(oParam, 'account').value;
				var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
				var cAmount = $('#ns1blankspaceItemAmount').val();
				if (cAmount == '') {cAmount = 0};
				var cTax = $('#ns1blankspaceItemTax').val();
				if (cTax == '') {cTax = 0};

				var oData = {}
				
				if (iID !== undefined) {oData.id = iID}
				if (iAccount === undefined) {iAccount = $('#ns1blankspaceItemAccount').attr('data-id')}

				oData.object = ns1blankspace.object;
				oData.objectcontext = ns1blankspace.objectContext;
				oData.financialaccount = iAccount;
				oData.amount = cAmount;
				oData.tax = cTax;
				oData.taxtype = $('input[name="radioTaxCode"]:checked').val();
				oData.description = $('#ns1blankspaceItemDescription').val();
				oData.capital = $('input[name="radioCapital"]:checked').val()
					
				if (ns1blankspace.option.financialShowProjects)
				{
					oData.project = $('#ns1blankspaceItemProject').attr('data-id');
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
					success: function(oResponse)
					{
						ns1blankspace.status.message('Saved');
						ns1blankspace.inputDetected = false;

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
								if (iID === undefined)
								{	
									$('#ns1blankspaceItemAmount').val('');
									$('#ns1blankspaceItemTax').val('');
									$('#ns1blankspaceItemDescription').val('');
								}
								else
								{
									var aHTML = [];
								
									aHTML.push('<table class="ns1blankspaceColumn2">' +
													'<tr><td class="ns1blankspaceAction">' +
													'<span id="ns1blankspaceItemAdd">Add</span>' +
													'</td></tr></table>');					
									
									$('#ns1blankspaceItemColumn2').html(aHTML.join(''));
								
									$('#ns1blankspaceItemAdd').button(
									{
										label: "Add"
									})
									.click(function()
									{
										oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', undefined);
										oParam = ns1blankspace.util.setParam(oParam, 'step', 1);
										ns1blankspace.financial.item.edit(oParam);
									});						
								}	
							}
						});
					}
				});
			},

	finalise: function(oParam)
			{
				var oData =
				{
					object: ns1blankspace.object,
					objectcontext: ns1blankspace.objectContext
				};

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_COMPLETE'),
					data: oData,
					dataType: 'json',
					success: function(data)
					{
						ns1blankspace.status.message('Finalised');
						ns1blankspace.financial[ns1blankspace.objectName].init({id: ns1blankspace.objectContext});
					}
				});
			}	
}				

ns1blankspace.financial.save =
{
	send: 	function (oParam, oResponse)
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
					var bShowStatus = true;
					var sDateField;
					var iBankTransactionID = ns1blankspace.util.getParam(oParam, 'bankTransactionID').value;

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
						if (oParam.showStatus != undefined) {bShowStatus = oParam.showStatus} 
					}

					if (bShowStatus) {ns1blankspace.status.working();}

					if (iObject == 3)
					{
						sDateField = 'paiddate';
						sSuffix = 'paidto';
						sMethod = 'FINANCIAL_PAYMENT_MANAGE';
					}

					if (iObject == 6)
					{
						sDateField = 'receiveddate';
						sSuffix = 'receivedfrom';
						sMethod = 'FINANCIAL_RECEIPT_MANAGE';
					}

					if (iObject == 2)
					{
						sDateField = 'accrueddate';
						sSuffix = 'paidto';
						sMethod = 'FINANCIAL_EXPENSE_MANAGE';
					}

					if (iObject == 5)
					{
						sDateField = 'sentdate';
						sSuffix = 'sentto';
						sMethod = 'FINANCIAL_INVOICE_MANAGE';
					}

					oParam.method = sMethod;

					var sData = (iID == undefined) ? '' : 'id=' + iID;
						
					sData += '&reference=' + ns1blankspace.util.fs(sReference);
					sData += '&' + sDateField + '=' + ns1blankspace.util.fs(sDate);
					sData += '&description=' + ns1blankspace.util.fs(sDescription);
					sData += '&contactbusiness' + sSuffix + '=' + ns1blankspace.util.fs(iContactBusiness);
					sData += '&contactperson' + sSuffix + '=' + ns1blankspace.util.fs(iContactPerson);
					sData += '&bankaccount=' + ns1blankspace.util.fs(iBankAccount);
					
					if (iBankTransactionID != undefined)
					{
						sData += '&sourcebanktransaction=' + ns1blankspace.util.fs(iBankTransactionID);
					}

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
					var fPostSave = ns1blankspace.util.getParam(oParam, 'postSave').value;
					var bShowStatus = ns1blankspace.util.getParam(oParam, 'showStatus').value;

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
						if (fPostSave) {fPostSave(oParam, oResponse)}
						if (bShowStatus) {ns1blankspace.status.error(oResponse.error.errornotes)};
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
					var bShowStatus = true;
					var iTaxType;

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
						if (oParam.showStatus != undefined) {bShowStatus = oParam.showStatus} 
						if (oParam.taxType != undefined) {iTaxType = oParam.taxType} 	
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
						var oData = 
						{
							object: iObject,
							objectcontext: iObjectContext,
							financialaccount: iAccount,
							amount: cAmount,
							description: sItemDescription,
							taxtype: iTaxType
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

											if (bShowStatus) {ns1blankspace.status.message('Saved')}
										}
									});
								}
								else
								{
									if (bShowStatus) {ns1blankspace.status.message('Saved')}
								}
							}
						});
					}	
				}
}

ns1blankspace.financial.allocate =
{
	data: 	{},

	to:		function (oParam)
			{
				var iAllocateToItemID = ns1blankspace.util.getParam(oParam, 'allocateToItemID').value;
				var iAllocateToID = ns1blankspace.util.getParam(oParam, 'allocateToID').value;
				var iAllocateToObject = ns1blankspace.util.getParam(oParam, 'allocateToObject').value;

				if (iAllocateToObject != undefined)
				{	
					ns1blankspace.status.working();

					var oSearch = new AdvancedSearch();
					oSearch.method = 'FINANCIAL_ITEM_SEARCH';

					if (iAllocateToObject == 2)
					{
						oSearch.addField('amount,expenseoutstandingamount,paymentamount');
						oSearch.addFilter('expenseoutstandingamount', 'NOT_EQUAL_TO', 0);
					}

					if (iAllocateToObject == 5)
					{
						oSearch.addField('amount,invoiceoutstandingamount,receiptamount');
						oSearch.addFilter('invoiceoutstandingamount', 'NOT_EQUAL_TO', 0);
					}

					oSearch.addFilter('object', 'EQUAL_TO', iAllocateToObject);
					oSearch.addFilter('objectcontext', 'EQUAL_TO', iAllocateToID);

					if (iAllocateToItemID != undefined)
					{
						oSearch.addFilter('id', 'EQUAL_TO', iAllocateToItemID);
					}	

					oSearch.sort('id', 'desc');
					oSearch.getResults(function(oResponse)
					{
						oParam = ns1blankspace.util.setParam(oParam, 'items', oResponse.data.rows)
						ns1blankspace.financial.allocate.process(oParam);
					});
				}	
			},
			
	process: function (oParam)
			{
				var aItems = ns1blankspace.util.getParam(oParam, 'items').value;
				var iItemIndex = ns1blankspace.util.getParam(oParam, 'itemIndex', {"default": 0}).value;
				var cAmount = accounting.unformat(ns1blankspace.util.getParam(oParam, 'amount', {"default": 0}).value);
				var iAllocateFromItemID = ns1blankspace.util.getParam(oParam, 'allocateFromItemID').value;
				var iAllocateFromItemFinancialAccount = ns1blankspace.util.getParam(oParam, 'allocateFromItemFinancialAccount').value;
				var iAllocateToObject = ns1blankspace.util.getParam(oParam, 'allocateToObject').value;
				var iAllocateFromObject = ns1blankspace.util.getParam(oParam, 'allocateFromObject').value;
				var iAllocateFromObjectContext = ns1blankspace.util.getParam(oParam, 'allocateFromObjectContext').value;
				var iAllocateToContactBusiness = ns1blankspace.util.getParam(oParam, 'allocateToContactBusiness').value;

				var sMethod;

				if (iItemIndex < aItems.length && cAmount > 0)
				{	
					var oItem = aItems[iItemIndex];
					var cItemOutstandingAmount = accounting.unformat(oItem.amount) - accounting.unformat((iAllocateToObject==2?oItem.paymentamount:oItem.receiptamount))
					if (cAmount > cItemOutstandingAmount) {cAmount = cItemOutstandingAmount}

					oParam = ns1blankspace.util.setParam(oParam, 'amount', cAmount - cItemOutstandingAmount)

					var oData =
					{
						id: iAllocateFromObjectContext
					}

					if (iAllocateToObject == 2)
					{
						oData.contactbusinesspaidto = iAllocateToContactBusiness;						
						sMethod = 'FINANCIAL_PAYMENT_MANAGE';
					}	

					if (iAllocateToObject == 5)
					{
						oData.contactbusinessreceivedfrom = iAllocateToContactBusiness;	
						sMethod = 'FINANCIAL_RECEIPT_MANAGE';
					}	

					$.ajax(
					{
						type: 'POST',
						url: '/rpc/financial/?method=' + sMethod,
						dataType: 'json',
						data: oData,
						success: function (data)
						{
							if (data.status == 'OK')
							{	
								var oData =
								{
									amount: cAmount
								}

								if (iAllocateToObject == 2)
								{
									oData.paymentlineitem = iAllocateFromItemID;
									oData.expenselineitem = oItem.id;
									sMethod = 'FINANCIAL_PAYMENT_EXPENSE_MANAGE';
								}	

								if (iAllocateToObject == 5)
								{
									oData.receiptlineitem = iAllocateFromItemID;
									oData.invoicelineitem = oItem.id;
									sMethod = 'FINANCIAL_RECEIPT_INVOICE_MANAGE';
								}

								$.ajax(
								{
									type: 'POST',
									url: '/rpc/financial/?method=' + sMethod,
									dataType: 'json',
									data: oData,
									success: function (data)
									{
										if (data.status == 'OK')
										{	
											iItemIndex +=
											oParam = ns1blankspace.util.setParam(oParam, 'indexIndex', iItemIndex)

											if (iAllocateFromItemFinancialAccount != undefined)
											{
												var oData =
												{
													id: iAllocateFromItemID,
													override: 'Y',
													financialaccount: iAllocateFromItemFinancialAccount
												};
												
												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
													data: oData,
													dataType: 'json',
													success: function(data)
													{
														if (data.status == 'OK')
														{
															var oData =
															{
																object: iAllocateFromObject,
																objectcontext: iAllocateFromObjectContext
															};

															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_COMPLETE'),
																data: oData,
																dataType: 'json',
																success: function(data)
																{
																	if (data.status == 'OK')
																	{
																		ns1blankspace.financial.allocate.process(oParam);
																	}
																}
															});
														}
													}
												});
											}
											else
											{
												ns1blankspace.financial.allocate.process(oParam);
											}
										}	
									}
								});
							}
						}
					});
				}
				else
				{
					ns1blankspace.status.clear();
					ns1blankspace.util.onComplete(oParam);
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
									var sXHTMLElementName = 'radioTaxCode';
									var bLink = ns1blankspace.util.getParam(oParam, 'link', {"default": false}).value;
								
									if (oParam != undefined)
									{
										if (oParam.type != undefined) {iType = oParam.type}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.id != undefined) {iID = oParam.id}
										if (oParam.xhtmlElementName != undefined) {sXHTMLElementName = oParam.xhtmlElementName}		
									}

									if (iType == 1)  //Sales
									{	
										if (bLink)
										{
											var sHTML = '<div id="' + sXHTMLElementName + '-1" data-id="1" data-rate="10" class="ns1blankspaceViewLink">Applies</div>' +
													'<div id="' + sXHTMLElementName + '-2" data-id="2" data-rate="0" class="ns1blankspaceViewLink">Export</div>' +
													'<div id="' + sXHTMLElementName + '-3" data-id="3" data-rate="0" class="ns1blankspaceViewLink">Free</div>' +
													'<div id="' + sXHTMLElementName + '-4" data-id="4" data-rate="0" class="ns1blankspaceViewLink">Input Taxed</div>' +
													'<div id="' + sXHTMLElementName + '-5" data-id="5" data-rate="0" class="ns1blankspaceViewLink">Excluded</div>';
										}
										else
										{
											var sHTML = '<input type="radio" id="' + sXHTMLElementName + '1" name="' + sXHTMLElementName + '" value="1" data-rate="10"/>Applies' +
													'<br /><input type="radio" id="' + sXHTMLElementName + '2" name="' + sXHTMLElementName + '" value="2" data-rate="0"/>Export' +
													'<br /><input type="radio" id="' + sXHTMLElementName + '3" name="' + sXHTMLElementName + '" value="3" data-rate="0"/>Free' +
													'<br /><input type="radio" id="' + sXHTMLElementName + '4" name="' + sXHTMLElementName + '" value="4" data-rate="0"/>Input Taxed' +
													'<br /><input type="radio" id="' + sXHTMLElementName + '5" name="' + sXHTMLElementName + '" value="5" data-rate="0"/>Excluded';
										}			
									}

									if (iType == 2)  //Purchases
									{	
										if (bLink)
										{
											var sHTML = '<div id="' + sXHTMLElementName + '-1" data-id="1" data-rate="10" class="ns1blankspaceViewLink">Applies</div>' +
													'<div id="' + sXHTMLElementName + '-2" data-id="2" data-rate="0" class="ns1blankspaceViewLink">Input Taxed</div>' +
													'<div id="' + sXHTMLElementName + '-3" data-id="3" data-rate="0" class="ns1blankspaceViewLink">Free</div>' +
													'<div id="' + sXHTMLElementName + '-4" data-id="4" data-rate="0" class="ns1blankspaceViewLink">Entertainment</div>' +
													'<div id="' + sXHTMLElementName + '-5" data-id="5" data-rate="0" class="ns1blankspaceViewLink">Excluded</div>';
										}
										else
										{
											var sHTML = '<input type="radio" id="' + sXHTMLElementName + '1" name="' + sXHTMLElementName + '" value="1" data-rate="10"/>Applies' +
													'<br /><input type="radio" id="' + sXHTMLElementName + '2" name="' + sXHTMLElementName + '" value="2" data-rate="0"/>Input Taxed' +
													'<br /><input type="radio" id="' + sXHTMLElementName + '3" name="' + sXHTMLElementName + '" value="3" data-rate="0"/>Free' +
													'<br /><input type="radio" id="' + sXHTMLElementName + '4" name="' + sXHTMLElementName + '" value="4" data-rate="0"/>Entertainment' +
													'<br /><input type="radio" id="' + sXHTMLElementName + '5" name="' + sXHTMLElementName + '" value="5" data-rate="0"/>Excluded';
										}			
									}

									if (sXHTMLElementID !== undefined)
									{
										$('#' + sXHTMLElementID).html(sHTML)

										if (iID !== undefined)
										{
											$('[name="' + sXHTMLElementName + '"][value="' + iID + '"]').attr('checked', true);
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
										if (oParam.taxTypeXHTMLElementName != undefined) {sRateXHTMLElementName = oParam.taxTypeXHTMLElementName}	
									}

									if (cRate === undefined)
									{
										cRate = parseFloat($('input[name="' + sRateXHTMLElementName + '"]:checked').attr("data-rate"))
									}

									if ($('#' + sAmountXHTMLElementID).length == 1)
									{
										if ($('#' + sAmountXHTMLElementID).val() !== '')
										{	
											cAmount = accounting.unformat($('#' + sAmountXHTMLElementID).val());
										}	
									}	
									
									if (cAmount === undefined)
									{	
										if (sTaxXHTMLElementID !== undefined)
										{
											$('#' + sTaxXHTMLElementID).val('');
										}
									}
									else
									{	
										cAmount = parseFloat(cAmount);

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
												cTax = CurrencyDefault((cRate / 100) * cAmount)
											}
										}

										if (sTaxXHTMLElementID !== undefined && cTax !== undefined)
										{
											$('#' + sTaxXHTMLElementID).val((cTax).toFixed(2))
										}
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
										
										if (false)
										{
										aHTML.push('<tr><td class="ns1blankspaceAction">' +
														'<span id="ns1blankspaceCreditAdd">Add</span>' +
														'</td></tr>');
										}

										aHTML.push('</table>');					
										
										$('#ns1blankspaceCreditColumn2').html(aHTML.join(''));
									
										$('#ns1blankspaceCreditAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											 ns1blankspace.financial.credit.init();
										});						
									}

									if (sNamespace != undefined)
									{	
										var oSearch = new AdvancedSearch();
											
										oSearch.method = 'FINANCIAL_' + sNamespace.toUpperCase() + '_CREDIT_NOTE_SEARCH';
										oSearch.addField('appliesdate,amount,tax,credittext,credit');
									
										oSearch.addFilter(sNamespace, 'EQUAL_TO', iObjectContext);
										oSearch.sort('appliesdate', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.financial.util.credit.show(oParam, data)});
									}
									else
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_CREDIT_NOTE_SEARCH';
										oSearch.addField('creditdate,notes,amount,tax,type,typetext');
										oSearch.addFilter('object', 'EQUAL_TO', iObject);
										oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext);
										oSearch.sort('creditdate', 'desc');
										
										oSearch.getResults(function(data) {ns1blankspace.financial.util.credit.show(oParam, data)});
									}	
								}
								else
								{
									var aHTML = [];
									var h = -1;
									
									if (oResponse.data.rows.length == 0)
									{
										aHTML.push('<table><tr><td class="ns1blankspaceNothing">No credits.</td></tr></table>');

										$('#ns1blankspaceCreditColumn1').html(aHTML.join(''));
									}
									else
									{
										aHTML.push('<table class="ns1blankspace">');

										aHTML.push('<tr>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption style="width:125px;">Date</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">' +
														ns1blankspace.option.taxVATCaption + '</td>');

										aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
										aHTML.push('</tr>');

										$.each(oResponse.data.rows, function()
										{
											aHTML.push('<tr class="ns1blankspaceRow">');
																		
											aHTML.push('<td id="ns1blankspaceCredit_date-' + this.id + '" class="ns1blankspaceRow">' +
															this['appliesdate'] + '</td>');
											
											aHTML.push('<td id="ns1blankspaceCredit_description-' + this.id + '" class="ns1blankspaceRow">' +
															this["credittext"] + '</td>');

											aHTML.push('<td id="ns1blankspaceCredit_amount-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
															this["amount"] + '</td>');

											aHTML.push('<td id="ns1blankspaceCredit_tax-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' +
															this["tax"] + '</td>');

											aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
											aHTML.push('<span id="ns1blankspaceRowItem_options_view-' + this.credit + '" class="ns1blankspaceCreditView"></span>');
											//aHTML.push('<span id="ns1blankspaceRowItem_options_remove-' + this.id + '" class="ns1blankspaceCreditRemove"></span>');
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
											ns1blankspace.financial.credit.init({id: (this.id).split('-')[1]})
										})
										.css('width', '15px')
										.css('height', '17px')	
									}
								}	
							}
				}											
}

ns1blankspace.financial.taxSummary =
{
	data: 	{},

	show: 	function (oParam, oResponse)
				{
					var sStartDate;
					var sEndDate;

					if (oParam != undefined)
					{
						if (oParam.startDate != undefined) {sStartDate = oParam.startDate}
						if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
					}
					else
					{
						oParam = {}
					}

					if (sStartDate == undefined)
					{
						if (ns1blankspace.financial.data.defaults.startdate != undefined)
						{
							sStartDate = ns1blankspace.financial.data.defaults.startdate;
						}
					}

					if (sEndDate == undefined)
					{
						if (ns1blankspace.financial.data.defaults.enddate != undefined)
						{
							sEndDate = ns1blankspace.financial.data.defaults.enddate;
						}
						else
						{
							sEndDate = Date.today().toString("dd MMM yyyy");
						}
					}

					if (oResponse == undefined)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
								'<tr>' +
								'<td id="ns1blankspaceTaxColumn1" class="ns1blankspaceColumn1Divider" style="width:100px; font-size: 0.875em; padding-right:10px;"></td>' +
								'<td id="ns1blankspaceTaxColumn2" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
								'</tr>' +
								'</table>');	

						$('#ns1blankspaceMainTax').html(aHTML.join(''));	

						var aHTML = [];
						
						aHTML.push('<table>');
						
						aHTML.push('<tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceTaxStartDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
							
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
										'To' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceTaxEndDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
														
						aHTML.push('<tr><td style="padding-top:5px;">' +
										'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspaceTaxRefresh">Refresh</span>' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:15px;" id="ns1blankspaceTaxTotals">' +
										'</td></tr>');

						//aHTML.push('<tr><td style="padding-top:14px;"><span class="ns1blankspaceAction" id="ns1blankspaceTaxCreatePDF"  style="width:95px;">' +
						//				'Create PDF</span></td></tr>');
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceTaxColumn1').html(aHTML.join(''));

						ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

						$('#ns1blankspaceTaxRefresh').button(
						{
							label: 'Refresh'
						})
						.click(function()
						{
							ns1blankspace.financial.taxSummary.show(
							{
								startDate: $('#ns1blankspaceTaxStartDate').val(),
								endDate: $('#ns1blankspaceTaxEndDate').val()
							})
						});

						$('#ns1blankspaceTaxCreatePDF').button(
						{
							label: 'Create PDF'
						})
						.click(function(event)
						{
							var sHTML =  $('#ns1blankspaceTaxColumn2').html();
							var sURL = document.location.protocol + '//' + document.location.host;
							var aHeaderHTML =
							[
								'<div style="margin-bottom:20px;">',
								'<div style="font-size:2em;">' + ns1blankspace.user.contactBusinessText + '</div>',
								'<div style="font-size:1.6em;">TAX</div>',
							];

							aHeaderHTML.push('<div>');

							if ($('#ns1blankspaceTaxStartDate').val() != '')
							{
								aHeaderHTML.push($('#ns1blankspaceTaxStartDate').val());
							}

							if ($('#ns1blankspaceTaxEndDate').val() != '')
							{
								aHeaderHTML.push(' to ' + $('#ns1blankspaceTaxEndDate').val());
							}

							aHeaderHTML.push('</div>');

							aHeaderHTML.push('</div><hr>');

							ns1blankspace.pdf.create(
							{
								xhtmlContent: aHeaderHTML.join('') + sHTML,
								filename: 'tax.pdf',
								open: true,
								leftmargin: 45,
								topmargin: 1,
								headerheight: 15,
								footerheight: 15,
								baseURLBody: sURL,
								object: 12,
								objectContext: ns1blankspace.spaceContactBusiness
							});
						});

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_TAX_REPORT_SEARCH';
						oSearch.addField('enddate,statustext,typetext,' +
											'g9,g20,w2,salesadjustment,purchasesadjustment,reference,' +
											'createdusertext,createduser,createddate,modifiedusertext,modifieduser,modifieddate');
						oSearch.addSummaryField('sum(g9) totalg9');
						oSearch.addSummaryField('sum(g20) totalg20');
						oSearch.addSummaryField('sum(w2) totalw2');

						if (sStartDate != undefined && sStartDate != '')
						{
							oParam.startDate = sStartDate;
							oSearch.addFilter('enddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate);
							$('#ns1blankspaceTaxStartDate').val(sStartDate);
						}
							
						if (sEndDate != undefined && sEndDate != '')
						{
							oParam.endDate = sEndDate;
							oSearch.addFilter('enddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate);
							$('#ns1blankspaceTaxEndDate').val(sEndDate);
						}

						oSearch.sort('enddate', 'desc')
						oSearch.rows = 20;
						oSearch.getResults(function(data) {ns1blankspace.financial.taxSummary.show(oParam, data)});
					}
					else
					{	
						if ($('#ns1blankspaceTaxStartDate').val() == '') {$('#ns1blankspaceTaxStartDate').val(oResponse.startdate)}
						if ($('#ns1blankspaceTaxEndDate').val() == '') {$('#ns1blankspaceTaxEndDate').val(oResponse.enddate)}

						ns1blankspace.financial.taxSummary.data = 
						{
							rows: oResponse.data.rows,
							startdate: oParam.startDate,
							enddate: oParam.endDate
						}

						ns1blankspace.financial.data.defaults = 
						{
							startdate: oParam.startDate,
							enddate: oParam.endDate
						}

						var aHTML = [];

						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceNothing">Nothing to show.</td>' +
										'</tr></table>');

							$('#ns1blankspaceTaxColumn2').html(aHTML.join(''));
						}
						else
						{
					
							aHTML.push('<table id="ns1blankspaceFinancialTaxSummary">');
						
							aHTML.push('<tr>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">GST on<br/>Sales</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">GST on<br/>Purchases</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">GST<br/>Payable</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Employee<br/>Tax Payable</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Total<br/>Tax Payable</td>');
							aHTML.push('</tr>');
							
							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.financial.taxSummary.row(this));
							});
						
							aHTML.push('</table>');

							ns1blankspace.render.page.show(
						   {
								type: 'JSON',
								xhtmlElementID: 'ns1blankspaceTaxColumn2',
								xhtmlContext: 'FinancialTaxSummary',
								xhtml: aHTML.join(''),
								showMore: (oResponse.morerows == "true"),
								more: oResponse.moreid,
								rows: 20,
								functionShowRow: ns1blankspace.financial.taxSummary.row,
								functionOpen: undefined,
								functionOnNewPage: ns1blankspace.financial.taxSummary.bind
						   });
						}   

						var aHTML = [];

						var cTaxVATSales = (oResponse.summary.totalg9).parseCurrency();
						var cTaxVATCredit = (oResponse.summary.totalg20).parseCurrency();
						var cTaxVATPayable = cTaxVATSales - cTaxVATCredit;

						var cTaxEmployeePayable = (oResponse.summary.totalw2).parseCurrency();
						var cTaxPayable = cTaxVATPayable + cTaxEmployeePayable;

						aHTML.push('<table class="ns1blankspace" style="width:100%;">' +
							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">GST on Sales</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							cTaxVATSales.formatMoney(0, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">GST on Purchases</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							cTaxVATCredit.formatMoney(0, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">GST Payable</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							cTaxVATPayable.formatMoney(0, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Employee Tax Payable</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							cTaxEmployeePayable.formatMoney(0, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Total Tax Payable</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							cTaxPayable.formatMoney(0, '.', ',') + 
							'</td></tr>' +
							'</table>');

						$('#ns1blankspaceTaxTotals').html(aHTML.join(''));
					}	
				},

	row: 		function(oRow)
				{
					var aHTML = [];
					
					oRow.taxVATSales = (oRow['g9']).parseCurrency();
					oRow.taxVATCredit = (oRow['g20']).parseCurrency();
					oRow.taxVATPayable = oRow.taxVATSales - oRow.taxVATCredit;
					oRow.taxEmployeePayable = (oRow['w2']).parseCurrency();
					oRow.taxPayable = oRow.taxVATPayable + oRow.taxEmployeePayable;

					aHTML.push('<tr><td id="ns1blankspaceFinancialTaxSummary_EndDate-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
													'>' + oRow.enddate + '</td>');

					aHTML.push('<td id="ns1blankspaceFinancialTaxSummary_TaxPayable-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;"' +
													'>' + oRow.taxVATSales.formatMoney(0, '.', ',') + '</td>');

					aHTML.push('<td id="ns1blankspaceFinancialTaxSummary_TaxCredit-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;"' +
													'>' + oRow.taxVATCredit.formatMoney(0, '.', ',') + '</td>');

					aHTML.push('<td id="ns1blankspaceFinancialTaxSummary_TaxVATPayable-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;"' +
													'>' + oRow.taxVATPayable.formatMoney(0, '.', ',') + '</td>');
									
					aHTML.push('<td id="ns1blankspaceFinancialTaxSummary_TaxEmployeePayable-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;"' +
													'>' + oRow.taxEmployeePayable.formatMoney(0, '.', ',') + '</td>');
													
					aHTML.push('<td id="ns1blankspaceFinancialTaxSummary_TaxPayable-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;"' +
													'>' + oRow.taxPayable.formatMoney(0, '.', ',') + '</td>');
																									
					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function(oParam)
				{
					$('#ns1blankspaceFinancialTaxSummary .ns1blankspaceRowSelect:visible').click(function(event) {
						ns1blankspace.financial.tax.init({id: event.target.id.split('-')[1]});
					});
				}					
}

ns1blankspace.financial.util.financialYear = function (sDate)
{
	var oReturn = {}
	var oDate;

	if (sDate != undefined)
	{
		if (moment(sDate, ns1blankspace.option.dateFormats).isValid())
		{
			oDate = moment(sDate, ns1blankspace.option.dateFormats)
		}
	}

	if (oDate == undefined || oDate == null)
	{
		oDate = moment();
	}
	
	if (oDate.quarter() > 2)
	{
	  oReturn.start = oDate.month('July').startOf('month').format('DD MMM YYYY');
	  oReturn.end = oDate.add(1, 'year').month('June').endOf('month').format('DD MMM YYYY');
	  oReturn._start = oDate.month('July').startOf('month');
	  oReturn._end = oDate.add(1, 'year').month('June').endOf('month')
	}
	else
	{
	  oReturn.start = oDate.subtract(1, 'year').month('July').startOf('month').format('DD MMM YYYY');
	  oReturn.end = oDate.month('June').endOf('month').format('DD MMM YYYY');
	  oReturn._start = oDate.subtract(1, 'year').month('July').startOf('month');
	  oReturn._end = oDate.month('June').endOf('month');
	}

	return oReturn
}

ns1blankspace.financial.notes =
{
	data: {},

	init: function (oParam, oResponse)
	{
		if (oResponse == undefined)
		{
			ns1blankspace.financial.notes.data.document = undefined;

			var oSearch = new AdvancedSearch();
			oSearch.method = 'DOCUMENT_SEARCH';
			oSearch.addField('content');
			oSearch.sort('id', 'asc');
			oSearch.addFilter('title', 'EQUAL_TO', 'FINANCIAL NOTES (' + ns1blankspace.user.commonName + ')');
			oSearch.addFilter('internal', 'EQUAL_TO', 'N')
			oSearch.rows = 1;
			
			oSearch.getResults(function(oResponse)
			{
				ns1blankspace.financial.notes.init(oParam, oResponse)
			});
		}
		else
		{
			if (oResponse.data.rows.length != 0)
			{
				ns1blankspace.financial.notes.data.document = oResponse.data.rows[0]; 
			}

			ns1blankspace.financial.notes.show()
		}
	},

	show: function ()
	{
		var oDocument = ns1blankspace.financial.notes.data.document;

		ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;

		var aHTML = [];

		aHTML.push('<table class="ns1blankspaceContainer">' +
							'<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspaceFinancialNotesColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
							'<td id="ns1blankspaceFinancialNotesColumn2" class="ns1blankspaceColumn2Action" style="width:100px; padding-left:12px;"></td>' +
							'</tr>' + 
							'</table>');

		$('#ns1blankspaceMainNotes').html(aHTML.join(''));	

		var aHTML = [];

		aHTML.push('<table id="ns1blankspaceColumn1" class="ns1blankspace ns1blankspaceFinancialNotes" data-editorcount="' + ns1blankspace.counter.editor + '"">');

		aHTML.push('<tr><td>' +
						'<textarea rows="30" cols="40" id="ns1blankspaceFinancialNotes' +
							ns1blankspace.counter.editor + '" data-editorcount="' + ns1blankspace.counter.editor +
							'" class="ns1blankspaceTextMulti"></textarea>' +
						'</td></tr>');
						
		aHTML.push('</table>');					
		
		$('#ns1blankspaceFinancialNotesColumn1').html(aHTML.join(''));		
	
		if (oDocument != undefined)
		{
			$('#ns1blankspaceFinancialNotes' + ns1blankspace.counter.editor).val(oDocument.content.formatXHTML());
		}

		ns1blankspace.format.editor.init(
		{
			height: '400px',
			selector: '#ns1blankspaceFinancialNotes' + ns1blankspace.counter.editor
		});

		var aHTML = [];
			
		aHTML.push('<table class="ns1blankspaceColumn2">');

		aHTML.push('<tr><td style="padding-top:0px; padding-bottom:5px;"><span id="ns1blankspaceFinancialNotesSave" class="ns1blankspaceAction">' +
								'Save</span></td></tr>');

		aHTML.push('</table>');	

		$('#ns1blankspaceFinancialNotesColumn2').html(aHTML.join(''));

		$('#ns1blankspaceFinancialNotesSave').button(
		{
			label: 'Save'
		})
		.click(function()
		{
			ns1blankspace.financial.notes.save()
		});
	},

	save: function (oParam)
	{
		var sCounter = $('table.ns1blankspaceFinancialNotes').attr('data-editorcount');
		var oDocument = ns1blankspace.financial.notes.data.document;

		ns1blankspace.status.working();

		var oData =
		{
			content: tinyMCE.get('ns1blankspaceFinancialNotes' + sCounter).getContent(),
		};

		if (oDocument == undefined)
		{
			oData.internal = 'N';
			oData.title = 'FINANCIAL NOTES (' + ns1blankspace.user.commonName + ')';
		}

		$.ajax(
		{
			type: 'POST',
			url: ns1blankspace.util.endpointURI('DOCUMENT_MANAGE'),
			data: oData,
			dataType: 'json',
			success: function(data)
			{
				ns1blankspace.status.message('Saved');
				ns1blankspace.inputDetected = false;
				ns1blankspace.financial.notes.data.document = {id: data.id}
			}
		});
	}
}




