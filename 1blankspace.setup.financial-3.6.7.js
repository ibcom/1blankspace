/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

ns1blankspace.setup.financial = 
{
	data: 	{},

	init: 	function (oParam)
				{
					var bShowHome = true
					var bInitialised = false;

					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}
					}

					ns1blankspace.app.reset();

					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'financial';
					ns1blankspace.viewName = 'Financials';
					
					if (ns1blankspace.financial == undefined) {ns1blankspace.financial = {}}

					if (!bInitialised)
					{
						ns1blankspace.financial.initData(oParam)
					}
					else
					{
						ns1blankspace.app.set(oParam);
					}
				},

	home:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlNew').button({disabled: true});
					
					var aHTML = [];
								
					aHTML.push('<table>');

					aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

					aHTML.push('</table>');		
						
					aHTML.push('<table class="ns1blankspaceControl" style="padding-top:10px;">');
					
					aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
									'Summary</td></tr>');
	
					aHTML.push('<tr><td id="ns1blankspaceControlGeneral" class="ns1blankspaceControl">' +
									'General</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlTax" class="ns1blankspaceControl">' +
									'Tax</td></tr>');

					aHTML.push('</table>');
	
					aHTML.push('<table class="ns1blankspaceControl">');
								
					aHTML.push('<tr><td class="ns1blankspaceSub" style="font-size:0.875em; border-bottom-style:solid; border-width: 0px; border-color: #D0D0D0;">' +
									'ACCOUNTS</td></tr>');
												
					aHTML.push('<tr><td id="ns1blankspaceControlBankAccount" class="ns1blankspaceControl">' +
									'Bank</td></tr>');	

					aHTML.push('<tr><td id="ns1blankspaceControlPaymentAccount" class="ns1blankspaceControl">' +
									'Payments</td></tr>');	
		
					aHTML.push('<tr><td id="ns1blankspaceControlFinancialAccount" class="ns1blankspaceControl">' +
									'Financial<br /><div class="ns1blankspaceSubNote">(COA)</div></td></tr>');
								
					aHTML.push('<tr><td id="ns1blankspaceControlFinancialAccountDefault" class="ns1blankspaceControl">' +
									'Defaults</td></tr>');	
					
					aHTML.push('</table>');

					aHTML.push('<table class="ns1blankspaceControl">');
								
					aHTML.push('<tr><td class="ns1blankspaceSub" style="font-size:0.875em; border-bottom-style:solid; border-width: 0px; border-color: #D0D0D0;">' +
									'PAYROLL</td></tr>');
					
					aHTML.push('<tr><td id="ns1blankspaceControlPayroll" class="ns1blankspaceControl">' +
									'Defaults</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlPayrollTypes" class="ns1blankspaceControl">' +
									'Pay Types</td></tr>');	

					aHTML.push('</table>');		
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					aHTML.push('<tr><td class="ns1blankspaceSub" style="font-size:0.875em; border-bottom-style:solid; border-width: 0px; border-color: #D0D0D0;">' +
									'TEMPLATES</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlInvoiceTemplate" class="ns1blankspaceControl">' +
									'Invoice</td></tr>');

					/*
					aHTML.push('<tr><td id="ns1blankspaceControlInvoiceScheduleTemplate" class="ns1blankspaceControl">' +
									'Invoice Schedule</td></tr>');
					*/

					aHTML.push('<tr><td id="ns1blankspaceControlStatementTemplate" class="ns1blankspaceControl">' +
									'Statement</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlPaySlipTemplate" class="ns1blankspaceControl">' +
									'Pay Slip</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlPaySummaryTemplate" class="ns1blankspaceControl">' +
									'Pay Summary</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlPaymentTemplate" class="ns1blankspaceControl">' +
									'Payment Remittance</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlReceiptTemplate" class="ns1blankspaceControl">' +
									'Receipt Confirmation</td></tr>');

					aHTML.push('<tr><td class="ns1blankspaceControl" style="padding-top:12px;"><div id="ns1blankspaceControlTemplateAttachments">' +
									'Attachments</div><div class="ns1blankspaceSubNote">ie logo image files</div></td></tr>');
					
					aHTML.push('</table>');

					$('#ns1blankspaceControl').html(aHTML.join(''));	
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainGeneral" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainBankAccount" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPaymentAccount" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainFinancialAccount" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainFinancialAccountDefault" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainInvoicing" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTemplate_invoice" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTemplate_invoiceschedule" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTemplate_statement" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTemplate_payslip" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTemplate_payroll" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTemplate_payment" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTemplate_receipt" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTemplateAttachments" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTax" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPayroll" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPayrollTypes" class="ns1blankspaceControlMain"></div>');

					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.setup.financial.summary();
					});

					$('#ns1blankspaceControlGeneral').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainGeneral'});
						ns1blankspace.setup.financial.general();
					});

					$('#ns1blankspaceControlBankAccount').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainBankAccount'});
						ns1blankspace.setup.financial.bankAccounts();
					});

					$('#ns1blankspaceControlPaymentAccount').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPaymentAccount'});
						ns1blankspace.setup.financial.paymentAccounts();
					});
					
					$('#ns1blankspaceControlFinancialAccount').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainFinancialAccount'});
						ns1blankspace.setup.financial.accounts.show();
					});
					
					$('#ns1blankspaceControlFinancialAccountDefault').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainFinancialAccountDefault'});
						ns1blankspace.setup.financial.accountDefaults();
					});
					
					$('#ns1blankspaceControlInvoicing').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainInvoicing'});
						ns1blankspace.setup.financial.invoicing();
					});
					
					$('#ns1blankspaceControlInvoiceTemplate').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTemplate_invoice', context: {inContext: false}});
						ns1blankspace.setup.financial.template.init({template: 'invoice', object: 5, refresh: true, variants: true});
					});

					$('#ns1blankspaceControlInvoiceScheduleTemplate').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTemplate_invoiceschedule', context: {inContext: false}});
						ns1blankspace.setup.financial.template.init({template: 'invoiceschedule', object: 5});
					});

					$('#ns1blankspaceControlStatementTemplate').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTemplate_statement', context: {inContext: false}});
						ns1blankspace.setup.financial.template.init({template: 'statement', object: 175, refresh: true});
					});

					$('#ns1blankspaceControlPaySlipTemplate').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTemplate_payslip', context: {inContext: false}});
						ns1blankspace.setup.financial.template.init({template: 'payslip', object: 371, refresh: true});
					});

					$('#ns1blankspaceControlPaySummaryTemplate').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTemplate_payroll', context: {inContext: false}});
						ns1blankspace.setup.financial.template.init({template: 'payroll', object: 37, refresh: true});
					});

					$('#ns1blankspaceControlPaymentTemplate').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTemplate_payment', context: {inContext: false}});
						ns1blankspace.setup.financial.template.init({template: 'payment', object: 3, refresh: true});
					});

					$('#ns1blankspaceControlReceiptTemplate').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTemplate_receipt', context: {inContext: false}});
						ns1blankspace.setup.financial.template.init({template: 'receipt', object: 6, refresh: true});
					});

					$('#ns1blankspaceControlTemplateAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTemplateAttachments', context: {inContext: false}});
						ns1blankspace.setup.financial.template.util.website()
					});

					$('#ns1blankspaceControlTax').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTax'});
						ns1blankspace.setup.financial.tax();
					});
					
					$('#ns1blankspaceControlPayroll').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPayroll'});
						ns1blankspace.setup.financial.payroll.init();
					});

					$('#ns1blankspaceControlPayrollTypes').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPayrollTypes', refresh: true});
						ns1blankspace.setup.financial.payroll.linetypes.init();
					});

					$.ajax(
					{
						type: 'GET',
						url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_SETTINGS_SEARCH'),
						data: 'all=1&includefinancialaccounttext=1',
						dataType: 'json',
						success: function(data)
						{
							ns1blankspace.setup.financial._settings = ns1blankspace.util.sortByKeys(data);
							delete ns1blankspace.setup.financial._settings.instance;
							delete ns1blankspace.setup.financial._settings.status;
							delete ns1blankspace.setup.financial._settings.xhtmlcontext;

							ns1blankspace.setup.financial.search.general(oParam)
						}
					});
				},

	check: 	function (oParam)
				{
					ns1blankspace.setup.financial.data.checkSettings = 
					{
						notExist: [],
						different: [],
						matched: []
					}

					_.each(ns1blankspace.setup.financial._settings, function (value, field)
					{
						if (ns1blankspace.setup.financial.settings[field] == undefined)
						{
							ns1blankspace.setup.financial.data.checkSettings.notExist.push(
							{
								field: field,
								existingvalue: value,
								newvalue: ns1blankspace.setup.financial.settings[field]
							})
						}
						else if (ns1blankspace.setup.financial.settings[field] != value)
						{
							ns1blankspace.setup.financial.data.checkSettings.different.push(
							{
								field: field,
								existingvalue: value,
								newvalue: ns1blankspace.setup.financial.settings[field]
							})
						}
						else
						{
							ns1blankspace.setup.financial.data.checkSettings.matched.push(
							{
								field: field,
								existingvalue: value,
								newvalue: ns1blankspace.setup.financial.settings[field]
							});
						}					
					});

					console.log('# DIFFERENT:')
					_.each(ns1blankspace.setup.financial.data.checkSettings.different, function (setting)
					{
						console.log(setting)
					});

					console.log('# NOT EXIST:')
					_.each(ns1blankspace.setup.financial.data.checkSettings.notExist, function (setting)
					{
						console.log(setting)
					});

					console.log('# MATCHED:')
					_.each(ns1blankspace.setup.financial.data.checkSettings.matched, function (setting)
					{
						console.log(setting)
					});
				},		

	search: 	{
					general: function (oParam, oResponse)
					{
						if (oResponse == undefined)
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_FINANCIAL_SETTINGS_SEARCH';
							oSearch.addField('notes,accrual,allowmanualcreditnoteassignment,collectbankdetailsall,collectbankdetailsbusiness,creditorsbalanceddate,debtorsbalanceddate,' +
													'defaultexpensestatus,defaultexpensestatustext,defaultinvoicesentvalue,defaultproject,defaultprojecttext,endoffinancialyear,' +
													'expensepayeemandatory,lockifincompletedtaxreport,lockinvoiceonsending,lockifreconciled,messagingaccount,messagingaccounttext,' +
													'overdueaccountalert,overdueaccountalertdays,segmentbyarea,timebillingrate,financialaccountcash,financialaccountcashtext,' +
													'financialaccountcreditors,financialaccountcreditorstext,financialaccountcurrentearnings,financialaccountcurrentearningstext,' +
													'financialaccountdebtors,financialaccountdebtorstext,financialaccountfinancialservicescommission,financialaccountfinancialservicescommissiontext,' +
													'financialaccountproductincome,financialaccountproductincometext,financialaccountproductinventory,financialaccountproductinventorytext,' +
													'financialaccountproductpurchases,financialaccountproductpurchasestext,financialaccountretainedearnings,financialaccountretainedearningstext,' +
													'financialaccountsalescommission,financialaccountsalescommissiontext,financialaccountwriteoff,financialaccountwriteofftext,' +
													'lockeddatecreditors,lockeddatedebtors,lockeddatejournals,payrollcreateexpenses,payrollexpensepaymentmethod,' +
													'payrollexpensepaymentmethodtext,payrollfinancialaccountallowance,payrollfinancialaccountallowancetext,payrollfinancialaccountsalary,' +
													'payrollfinancialaccountsalarytext,payrollfinancialaccountsuperannuation,payrollfinancialaccountsuperannuationtext,' +
													'payrollfinancialaccounttax,payrollfinancialaccounttaxtext,payrollonbreakhours,payrolloncosthourlyrate,payrollpayperiod,' +
													'payrollpayperiodtext,payrollproject,payrollprojecttext,payrollsetsalaryexpensestopaid,payrollsuperannuationcontactbusiness,' +
													'payrollsuperannuationcontactbusinesstext,payrollsuperannuationmonthlythreshold,calculationmethod,calculationmethodamount,' +
													'calculationmethodemployee,calculationmethodemployeetext,calculationmethodinstalmentamount,calculationmethodinstalmentrate,' +
													'calculationmethodtext,checkercontactperson,checkercontactpersontext,contactbusiness,contactbusinesstext,deferred,' +
													'financialaccountcredits,financialaccountcreditstext,financialaccountemployee,financialaccountemployeetext,' +
													'financialaccountinstalment,financialaccountinstalmenttext,financialaccountpayable,financialaccountpayabletext,frequency,frequencytext,' +
													'frequencyemployee,frequencyemployeetext,frequencyinstalments,frequencyinstalmentstext,segmenttaxbyarea,taxreportschedulingagentdays,' + 
													'taxreportschedulingreportdays,taxreportschedulingtaxofficedays');
							oSearch.rows = 1;
							oSearch.getResults(function(data) {ns1blankspace.setup.financial.search.general(oParam, data)});
						}
						else
						{
							if (oResponse.data.rows.length > 0)
							{
								ns1blankspace.objectContextData = oResponse.data.rows[0];
								ns1blankspace.setup.financial.settings = oResponse.data.rows[0];
							}

							ns1blankspace.setup.financial.search.tax(oParam);
						}
					},

					tax: function (oParam, oResponse)
					{
						if (oResponse == undefined)
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_FINANCIAL_SETTINGS_SEARCH';
							oSearch.addField('calculationmethod,calculationmethodamount,calculationmethodemployee,calculationmethodemployeetext,' +
													'calculationmethodinstalmentamount,calculationmethodinstalmentrate,calculationmethodtext,checkercontactperson,' +
													'checkercontactpersontext,contactbusiness,contactbusinesstext,deferred,financialaccountcredits,financialaccountcreditstext,' +
													'financialaccountemployee,financialaccountemployeetext,financialaccountinstalment,financialaccountinstalmenttext,financialaccountpayable,' +
													'financialaccountpayabletext,frequency,frequencytext,frequencyemployee,frequencyemployeetext,frequencyinstalments,' +
													'frequencyinstalmentstext,notes');
							oSearch.rows = 1;
							oSearch.getResults(function(data) {ns1blankspace.setup.financial.search.tax(oParam, data)});
						}
						else
						{
							if (oResponse.data.rows.length > 0)
							{
								$.each(oResponse.data.rows[0], function (key, value)
								{
									ns1blankspace.objectContextData['taxreport' + key] = value;
									ns1blankspace.setup.financial.settings['taxreport' + key] = value;
								});
							}

							ns1blankspace.objectContextData = ns1blankspace.util.sortByKeys(ns1blankspace.objectContextData);
							ns1blankspace.setup.financial.settings = ns1blankspace.util.sortByKeys(ns1blankspace.setup.financial.settings);

							ns1blankspace.setup.financial.summary();
						}
					}
				},

	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the settings.</td></tr></table>');
								
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{		
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:305px; padding-left:75px;">' +
									'<div id="ns1blankspaceSummaryColumn2AccountLinking"><div>' +
									'<div id="ns1blankspaceSummaryColumn2Unallocated"><div>' + 
									'</td>' +
									'</tr>' +
									'</table>');		
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));

						ns1blankspace.util.financial.bankAccounts.link.init(
						{
							xhtmlElementID: 'ns1blankspaceSummaryColumn2AccountLinking'
						});
						
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspace">');
						
						var sTaxMethod = (ns1blankspace.objectContextData.taxreportcalculationmethod == "1") ? "Cash" : "Accrual";
						
						aHTML.push('<tr><td class="ns1blankspaceHeaderCaption">ACCOUNTS LOCKING</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption" style="padding-top:10px;">Debtors</td></tr>' +
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

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						if (ns1blankspace.financial.data.settings.financialaccountunallocated.outgoing == undefined ||
								ns1blankspace.financial.data.settings.financialaccountunallocated.incoming == undefined)
						{
							var aHTML = [];
					
							aHTML.push('<table class="ns1blankspace">');

							aHTML.push('<tr><td class="ns1blankspaceHeaderCaption" style="color:red;">UNALLOCATED ACCOUNTS</td></tr>');

							aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-top:14px;">To assist with balancing your debtor and creditor lists with the ' +
												'corresponding financial control accounts, you need to set up two <i>Unallocated</i> financial accounts; ' +
												'one as an <i>Expense</i> type and the other as a <i>Revenue</i> type.' +
												'</td></tr>');

							aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-top:14px;">Any receipts that are received with no invoice to apply it to ' +
												'or payments made with no expense to apply it to, but most likely will be in the future, are then linked to the appropriate <i>Unallocated</i> account.' +
												'</td></tr>')

							aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-top:14px;">Then in the future once the expense or invoice is created, the unallocated proportion of the payment or ' +
												' receipt can be applied to it and moved to the creditor or debtor account - keeping them in balance at all times.' +
												'</td></tr>');

							aHTML.push('</table>');

							$('#ns1blankspaceSummaryColumn2Unallocated').html(aHTML.join(''));
						}
					}	
				},

	general:	function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainGeneral').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainGeneral').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceGeneralColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceGeneralColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');					
						
						$('#ns1blankspaceMainGeneral').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Accounting Method' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioAccrualN" name="radioAccrual" value="N"/>Cash' +
										'<br /><input type="radio" id="radioAccrualY" name="radioAccrual" value="Y"/>Accrual' +
										'</td></tr>');			

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Taxation Method' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioTaxationMethod1" name="radioTaxationMethod" value="1"/>Cash' +
										'<br /><input type="radio" id="radioTaxationMethod2" name="radioTaxationMethod" value="2"/>Accrual' +
										'</td></tr>');			

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Accounting Year <span class="ns1blankspaceSub" style="font-size:0.75em; vertical-align:middle; padding-left:3px;">eg 30 Jun</span>' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceGeneralAccountingYear" class="ns1blankspaceText">' +
										'</td></tr>' +
										'</tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Default Invoice Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioDefaultInvoiceSentValueY" name="radioDefaultInvoiceSentValue" value="Y"/>Mark as sent' +
										'<br /><input type="radio" id="radioDefaultInvoiceSentValue2" name="radioDefaultInvoiceSentValue" value="N"/>Leave as unsent' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Default Email Account' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceGeneralMessagingAccount" class="ns1blankspaceSelect"' +
											' data-method="SETUP_MESSAGING_ACCOUNT_SEARCH"' +
											' data-columns="email" data-methodFilter="type-EQUAL_TO-5|email-TEXT_IS_NOT_EMPTY">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Set up Notes' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea style="height: 100px;" rows="10" cols="80" id="ns1blankspaceGeneralNotes" class="ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');

						aHTML.push('</table>');			
						
						$('#ns1blankspaceGeneralColumn1').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Debtors Locked Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceGeneralLockedDateDebtors" class="ns1blankspaceDate">' +
										'</td></tr>' +
										'</tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Creditors Locked Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceGeneralLockedDateCreditors" class="ns1blankspaceDate">' +
										'</td></tr>' +
										'</tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Journals (General) Locked Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceGeneralLockedDateJournals" class="ns1blankspaceDate">' +
										'</td></tr>' +
										'</tr>');

						aHTML.push('</table>');			
						
						$('#ns1blankspaceGeneralColumn2').html(aHTML.join(''));

						ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

						if (ns1blankspace.objectContextData != undefined)
						{
							$('[name="radioAccrual"][value="' + ns1blankspace.objectContextData.accrual + '"]').attr('checked', true);	
							$('[name="radioTaxationMethod"][value="' + ns1blankspace.objectContextData.taxreportcalculationmethod + '"]').attr('checked', true);
							$('#ns1blankspaceGeneralAccountingYear').val(ns1blankspace.objectContextData.endoffinancialyear);
							$('[name="radioDefaultInvoiceSentValue"][value="' + ns1blankspace.objectContextData.defaultinvoicesentvalue + '"]').attr('checked', true);
							$('#ns1blankspaceGeneralLockedDateDebtors').val(ns1blankspace.objectContextData.lockeddatedebtors);
							$('#ns1blankspaceGeneralLockedDateCreditors').val(ns1blankspace.objectContextData.lockeddatecreditors);
							$('#ns1blankspaceGeneralLockedDateJournals').val(ns1blankspace.objectContextData.lockeddatejournals);
							$('#ns1blankspaceGeneralNotes').val(ns1blankspace.objectContextData.notes);
							$('#ns1blankspaceGeneralMessagingAccount').val(ns1blankspace.objectContextData.messagingaccounttext);
							$('#ns1blankspaceGeneralMessagingAccount').attr('data-id', ns1blankspace.objectContextData.messagingaccount);
						}
					}	
				},

	bankAccounts:
				function (oParam, oResponse)
				{
					var iStep = 1;
					var sID; 
					var sXHTMLElementID;
						
					if (oParam != undefined)
					{
						if (oParam.step != undefined) {iStep = oParam.step}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}
					else
					{
						oParam = {step: 1};
					}
					
					if (sXHTMLElementID != undefined)
					{
						var aXHTMLElementID = sXHTMLElementID.split('-');
						var sID = aXHTMLElementID[1];
					}	

					if (iStep == 1)
					{
						
						if (oResponse == undefined)
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
							oSearch.addField('title,lastreconciledamount,lastreconcileddate,notes,status,statustext,accountname,bsb,accountnumber,' +
												'defaultpaymentaccount,defaultreceiptaccount,financialaccount,bank');
							oSearch.sort('title', 'asc');
							oSearch.rows = ns1blankspace.option.defaultRows;
							oSearch.getResults(function(data) {ns1blankspace.setup.financial.bankAccounts(oParam, data)});
						}
						else
						{	
							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceBankAccountColumn1" class="ns1blankspaceColumn1Flexible" style="width: 300px;">' +
										ns1blankspace.xhtml.loading + '</td>' +
										'<td id="ns1blankspaceBankAccountColumn2" class="ns1blankspaceColumn2">' +
										'<table class="ns1blankspaceColumn2"><tr><td>' +
										'<span id="ns1blankspaceBankAccountAdd" class="ns1blankspaceAction">Add</span></td>' +
										'</td></tr>' +
										'</table>' +
										'</tr>' + 
										'</table>');

							$('#ns1blankspaceMainBankAccount').html(aHTML.join(''));
						
							$('#ns1blankspaceBankAccountAdd').button(
							{
								text: "Add"
							})
							.click(function() {
								$.extend(true, oParam, {step: 2, xhtmlElementID: ""});
								ns1blankspace.setup.financial.bankAccounts(oParam);
							})
							.css('font-size', '0.75em');

							ns1blankspace.financial.data.bankaccounts = [];

							var aHTML = [];

							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<table><tr><td class="ns1blankspaceNothing">No banks accounts have been set up.</td></tr></table>');

								$('#ns1blankspaceBankAccountColumn1').html(aHTML.join(''));
							}
							else
							{			
								var aHTML = [];

								aHTML.push('<table id="ns1blankspaceSetupFinancialBankAccount" class="ns1blankspace">');
						
								$(oResponse.data.rows).each(function() 
								{
									if (this.status == 1) {ns1blankspace.financial.data.bankaccounts.push(this)}

									aHTML.push('<tr class="ns1blankspaceRow">');
									
									aHTML.push('<td id="ns1blankspaceSetupFinancialBankAccount_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
															' title="' + this.notes + '">' +
															this.title + '</td>');

									aHTML.push('<td id="ns1blankspaceSetupFinancialBankAccount_status-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSub">' +
															this.statustext + '</td>');
														
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
									
									aHTML.push('<span id="ns1blankspaceBankAccount_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
										
									aHTML.push('</td>');				
																					
									aHTML.push('</tr>');
								});
								
								aHTML.push('</table>');
							}
							
							$('#ns1blankspaceBankAccountColumn1').html(aHTML.join(''));

							$('#ns1blankspaceSetupFinancialBankAccount span.ns1blankspaceRowRemove').button(
							{
								text: false,
								icons: {
									primary: "ui-icon-close"
								}
							})
							.click(function() {
								$.extend(true, oParam, {step: 4, xhtmlElementID: this.id});
								ns1blankspace.setup.financial.bankAccounts(oParam);
							})
							.css('width', '15px')
							.css('height', '17px');

							$('#ns1blankspaceSetupFinancialBankAccount td.ns1blankspaceRowSelect').click(function() {
								$.extend(true, oParam, {step: 2, xhtmlElementID: this.id});
								ns1blankspace.setup.financial.bankAccounts(oParam);
							})
						}	
					}

					if (iStep == 2)
					{	
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceBankAccountEditColumn1" class="ns1blankspaceColumn1" style="width:300px;padding-right:15px;">' +
										ns1blankspace.xhtml.loading + '</td>' +
										'<td id="ns1blankspaceBankAccountEditColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');

						$('#ns1blankspaceBankAccountColumn2').html(aHTML.join(''));

						var aHTML = [];
						

						aHTML.push('<table class="ns1blankspaceColumn2">');
									
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Title (Nickname)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceBankAccountTitle" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Account Name' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceBankAccountName" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'BSB' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceBankAccountBSB" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Account Number' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceBankAccountNumber" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Bank' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceBankAccountBank" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Financial Account' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceBankAccountFinancialAccount" class="ns1blankspaceSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Active' +
										'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Non-Active' +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Default Payment Account' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioDefaultPaymentY" name="radioDefaultPayment" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioDefaultPaymentN" name="radioDefaultPayment" value="N"/>No' +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Default Receipt Account' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioDefaultReceiptY" name="radioDefaultReceipt" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioDefaultReceiptN" name="radioDefaultReceipt" value="N"/>No' +
										'</td></tr>');
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceBankAccountEditColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
												
						aHTML.push('<tr><td>' +
										'<span class="ns1blankspaceAction" style="width:80px;" id="ns1blankspaceBankAccountEditSave">Save</span>' +
										'</td></tr>');
					
						aHTML.push('<tr><td>' +
										'<span class="ns1blankspaceAction" style="width:80px;" id="ns1blankspaceBankAccountEditCancel">Cancel</span>' +
										'</td></tr>');
										
						aHTML.push('</table>');		
												
						$('#ns1blankspaceBankAccountEditColumn2').html(aHTML.join(''));
						
						$('#ns1blankspaceBankAccountEditSave').button(
						{
							text: "Save"
						})
						.click(function() 
						{
							ns1blankspace.status.working();

							var oData = 
							{
								id: sID,
								title: $('#ns1blankspaceBankAccountTitle').val(),
								accountname: $('#ns1blankspaceBankAccountName').val(),
								bsb: $('#ns1blankspaceBankAccountBSB').val(),
								bank: $('#ns1blankspaceBankAccountBank').val(),
								accountnumber: $('#ns1blankspaceBankAccountNumber').val(),
								financialaccount: $('#ns1blankspaceBankAccountFinancialAccount').attr("data-id"),
								status: $('input[name="radioStatus"]:checked').val(),
								defaultpaymentaccount: $('input[name="radioDefaultPayment"]:checked').val(),
								defaultreceiptaccount: $('input[name="radioDefaultReceipt"]:checked').val()
							}	

							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_BANK_ACCOUNT_MANAGE'),
								data: oData,
								dataType: 'json',
								success: function()
								{
									$.extend(true, oParam, {step: 1});
									ns1blankspace.setup.financial.bankAccounts(oParam);
									ns1blankspace.status.message('Saved');
								}
							});
						});
						
						$('#ns1blankspaceBankAccountEditCancel').button(
						{
							text: "Cancel"
						})
						.click(function() 
						{
							$.extend(true, oParam, {step: 1});
							ns1blankspace.setup.financial.bankAccounts(oParam);
						});

						if (sID != undefined)
						{
							ns1blankspace.status.working();

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
							oSearch.addField('title,financialaccount,financialaccounttext,status,accountname,bsb,accountnumber,defaultpaymentaccount,defaultreceiptaccount,bank');
							oSearch.addFilter('id', 'EQUAL_TO', sID);
							oSearch.getResults(function(data) {
									$.extend(true, oParam, {step: 3});
									ns1blankspace.setup.financial.bankAccounts(oParam, data)
									});
						}
						else
						{
							$('[name="radioStatus"][value="1"]').attr('checked', true);
						}
					}
						
					if (iStep == 3 && oResponse)
					{
						var oObjectContext = oResponse.data.rows[0];
						$('#ns1blankspaceBankAccountTitle').val(oObjectContext.title);
						$('#ns1blankspaceBankAccountName').val(oObjectContext.accountname);
						$('#ns1blankspaceBankAccountBSB').val(oObjectContext.bsb);
						$('#ns1blankspaceBankAccountBank').val(oObjectContext.bank);
						$('#ns1blankspaceBankAccountNumber').val(oObjectContext.accountnumber);
						$('#ns1blankspaceBankAccountTitle').focus();
						$('#ns1blankspaceBankAccountFinancialAccount').val(oObjectContext.financialaccounttext)
						$('#ns1blankspaceBankAccountFinancialAccount').attr('data-id', oObjectContext.financialaccount);
						$('[name="radioStatus"][value="' + oObjectContext.status + '"]').attr('checked', true);
						$('[name="radioDefaultPayment"][value="' + oObjectContext.defaultpaymentaccount + '"]').attr('checked', true);
						$('[name="radioDefaultReceipt"][value="' + oObjectContext.defaultreceiptaccount + '"]').attr('checked', true);

						ns1blankspace.status.message('');
					}

					if (iStep == 4)
					{			
						var sParam = 'method=SETUP_FINANCIAL_BANK_ACCOUNT_MANAGE&remove=1';
						var sData = 'id=' + sID;
						
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_BANK_ACCOUNT_MANAGE'),
							data: 'remove=1&id=' + ns1blankspace.util.fs(sID),
							dataType: 'json',
							success: function(data)
							{
								if (data.status == 'OK')
								{
									$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
									$.extend(true, oParam, {step: 1});
									ins1blankspace.setup.financial.bankAccounts(oParam);
									ns1blankspace.status.message('Saved');
								}
								else
								{
									ns1blankspace.status.error(data.error.errornotes);
								}
							}
						});
					}		
				},

	paymentAccounts:
				function (oParam, oResponse)
				{
					var iStep = 1;
					var sID; 
					var sXHTMLElementID;
						
					if (oParam != undefined)
					{
						if (oParam.step != undefined) {iStep = oParam.step}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}
					else
					{
						oParam = {step: 1};
					}
					
					if (sXHTMLElementID != undefined)
					{
						var aXHTMLElementID = sXHTMLElementID.split('-');
						var sID = aXHTMLElementID[1];
					}	

					if (iStep == 1)
					{			
						if (oResponse == undefined)
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_FINANCIAL_FUNDS_TRANSFER_ACCOUNT_SEARCH';
							oSearch.addField('title,provider,providertext,status,statustext,takepayment,makepayment,urlcancel,urlsuccess,provideraccountkey,' +
												'apikey,apilogon');
							oSearch.sort('title', 'asc');
							oSearch.rows = ns1blankspace.option.defaultRows;
							oSearch.getResults(function(data) {ns1blankspace.setup.financial.paymentAccounts(oParam, data)});
						}
						else
						{	
							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspacePaymentAccountColumn1" class="ns1blankspaceColumn1Flexible" style="width: 300px;">' +
										ns1blankspace.xhtml.loading + '</td>' +
										'<td id="ns1blankspacePaymentAccountColumn2" class="ns1blankspaceColumn2">' +
										'<table class="ns1blankspaceColumn2"><tr><td>' +
										'<span id="ns1blankspacePaymentAccountAdd" class="ns1blankspaceAction">Add</span></td>' +
										'</td></tr></table>' +
										'</tr>' + 
										'</table>');

							$('#ns1blankspaceMainPaymentAccount').html(aHTML.join(''));
						
							$('#ns1blankspacePaymentAccountAdd').button(
							{
								text: "Add"
							})
							.click(function() {
								$.extend(true, oParam, {step: 2, xhtmlElementID: ""});
								ns1blankspace.setup.financial.paymentAccounts(oParam);
							})
							.css('font-size', '0.75em');

							ns1blankspace.financial.data.paymentaccounts = [];

							var aHTML = [];

							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<table><tr><td class="ns1blankspaceNothing">No payment accounts have been set up.</td></tr></table>');

								$('#ns1blankspacePaymentAccountColumn1').html(aHTML.join(''));
							}
							else
							{			
								var aHTML = [];

								aHTML.push('<table id="ns1blankspaceSetupFinancialPaymentAccount" class="ns1blankspace">');
						
								$(oResponse.data.rows).each(function() 
								{
									if (this.status == 1) {ns1blankspace.financial.data.paymentaccounts.push(this)}

									aHTML.push('<tr class="ns1blankspaceRow">');
									
									aHTML.push('<td id="ns1blankspaceSetupFinancialPaymentAccount_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
															' title="' + this.providertext + '" style="width:150px;">' +
															this.title + '</td>');

									aHTML.push('<td id="ns1blankspaceSetupFinancialPaymentAccount_status-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSubNote" style="font-size:0.75em;">' +
															this.providertext + '<br />' + this.statustext + '</td>');
														
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
									
									aHTML.push('<span id="ns1blankspacePaymentAccount_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
										
									aHTML.push('</td>');				
																					
									aHTML.push('</tr>');
								});
								
								aHTML.push('</table>');
							}
							
							$('#ns1blankspacePaymentAccountColumn1').html(aHTML.join(''));

							$('#ns1blankspaceSetupFinancialPaymentAccount span.ns1blankspaceRowRemove').button(
							{
								text: false,
								icons:
								{
									primary: "ui-icon-close"
								}
							})
							.click(function() {
								$.extend(true, oParam, {step: 4, xhtmlElementID: this.id});
								ns1blankspace.setup.financial.paymentAccounts(oParam);
							})
							.css('width', '15px')
							.css('height', '17px');

							$('#ns1blankspaceSetupFinancialPaymentAccount td.ns1blankspaceRowSelect').click(function() {
								$.extend(true, oParam, {step: 2, xhtmlElementID: this.id});
								ns1blankspace.setup.financial.paymentAccounts(oParam);
							})
						}	
					}

					if (iStep == 2)
					{	
						var aHTML = [];
						
						aHTML.push('<form autocomplete="off">');

						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspacePaymentAccountEditColumn1" class="ns1blankspaceColumn1" style="width:300px;padding-right:15px;">' +
										ns1blankspace.xhtml.loading + '</td>' +
										'<td id="ns1blankspacePaymentAccountEditColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');

						$('#ns1blankspacePaymentAccountColumn2').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
									
						aHTML.push('<tr class="ns1blankspaceCaption" data-provider="8">' +
										'<td class="ns1blankspaceCaption">' +
										'Title' +
										'</td></tr>' +
										'<tr class="ns1blankspace" data-provider="8">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspacePaymentAccountTitle" class="ns1blankspaceText">' +
										'</td></tr>');	

						aHTML.push('<tr data-provider="8"><td class="ns1blankspaceCaption">' +
										'Type' +
										'</td></tr>' +
										'<tr class="ns1blankspace" data-provider="8">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioPaymentAccountProvider8" name="radioPaymentAccountProvider" value="8"/>Stripe' +
										'<br /><input type="radio" id="radioPaymentAccountProvider1" name="radioPaymentAccountProvider" value="1"/>eWay' +
										'<br /><input type="radio" id="radioPaymentAccountProvider7" name="radioPaymentAccountProvider" value="7"/>PayPal' +
										'<br /><input type="radio" id="radioPaymentAccountProvider3" name="radioPaymentAccountProvider" value="3"/>ABA Direct Entry File' +
										'<br /><input type="radio" id="radioPaymentAccountProvider4" name="radioPaymentAccountProvider" value="4"/>IP Payments' +
										'<br /><input type="radio" id="radioPaymentAccountProvider5" name="radioPaymentAccountProvider" value="5"/>EziDebit' +
										'</td></tr>');

						aHTML.push('<tr data-provider="8"><td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace" data-provider="8">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioPaymentAccountStatus1" name="radioPaymentAccountStatus" value="1"/>Testing' +
										'<br /><input type="radio" id="radioPaymentAccountStatus1" name="radioPaymentAccountStatus" value="2"/>Active' +
										'<br /><input type="radio" id="radioPaymentAccountStatus2" name="radioPaymentAccountStatus" value="3"/>Non-Active' +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Use to make payments' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioPaymentAccountMakePaymentY" name="radioPaymentAccountMakePayment" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioPaymentAccountMakePaymentN" name="radioPaymentAccountMakePayment" value="N"/>No' +
										'</td></tr>');

						aHTML.push('<tr data-provider="8"><td class="ns1blankspaceCaption">' +
										'Use to collect payments' +
										'</td></tr>' +
										'<tr class="ns1blankspace" data-provider="8">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioPaymentAccountTakePaymentY" name="radioPaymentAccountTakePayment" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioPaymentAccountTakePaymentN" name="radioPaymentAccountTakePayment" value="N"/>No' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Bank Account' +
										'</td></tr>' +
										'<tr class="ns1blankspaceRadio">' +
										'<td id="ns1blankspacePaymentAccountBankAccount" class="ns1blankspaceRadio">');
						
						$.each(ns1blankspace.financial.data.bankaccounts, function()
						{
							aHTML.push('<input type="radio" id="radioPaymentAccountBankAccount' + this.id + '" name="radioPaymentAccountBankAccount" value="' + this.id + '"/>' +
												this.title + '<br />');				
						});
						
						aHTML.push('</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Success URL' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspacePaymentAccountURLSuccess" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Cancel URL' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspacePaymentAccountURLCancel" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'API Logon' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspacePaymentAccountAPILogon" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption" data-provider="8">' +
										'<td class="ns1blankspaceCaption">' +
										'API Key / Public Key' +
										'</td></tr>' +
										'<tr class="ns1blankspace" data-provider="8">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspacePaymentAccountAPIKey" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption" data-provider="8">' +
										'<td class="ns1blankspaceCaption">' +
										'API Password / Secret Key' +
										'</td></tr>' +
										'<tr class="ns1blankspace" data-provider="8">' +
										'<td class="ns1blankspaceText">' +
										'<input type="password" id="ns1blankspacePaymentAccountAPIPassword" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('</table>');

						aHTML.push('</form>');				
						
						$('#ns1blankspacePaymentAccountEditColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
												
						aHTML.push('<tr><td>' +
										'<span class="ns1blankspaceAction" style="width:80px;" id="ns1blankspacePaymentAccountEditSave">Save</span>' +
										'</td></tr>');
					
						aHTML.push('<tr><td>' +
										'<span class="ns1blankspaceAction" style="width:80px;" id="ns1blankspacePaymentAccountEditCancel">Cancel</span>' +
										'</td></tr>');
										
						aHTML.push('</table>');		
												
						$('#ns1blankspacePaymentAccountEditColumn2').html(aHTML.join(''));

						$('[name="radioPaymentAccountProvider"]').click(function()
						{
							if ($('input[name="radioPaymentAccountProvider"]:checked').val() == 8)
							{
								$('#ns1blankspacePaymentAccountEditColumn1 tr').hide();
								$('#ns1blankspacePaymentAccountEditColumn1 tr[data-provider*="8"]').show()
							}
							else
							{
								$('#ns1blankspacePaymentAccountEditColumn1 tr').show()
							}
						});
						
						$('#ns1blankspacePaymentAccountEditSave').button(
						{
							text: "Save"
						})
						.click(function() 
						{
							ns1blankspace.status.working();

							var oData = 
							{
								id: sID,
								title: $('#ns1blankspacePaymentAccountTitle').val(),
								provider: $('input[name="radioPaymentAccountProvider"]:checked').val(),
								status: $('input[name="radioPaymentAccountStatus"]:checked').val(),
								makepayment: $('input[name="radioPaymentAccountMakePayment"]:checked').val(),
								takepayment: $('input[name="radioPaymentAccountTakePayment"]:checked').val(),
								bankaccount: $('input[name="radioPaymentAccountBankAccount"]:checked').val(),
								urlsuccess: $('#ns1blankspacePaymentAccountURLSuccess').val(),
								urlcancel: $('#ns1blankspacePaymentAccountURLCancel').val(),
								apilogon: $('#ns1blankspacePaymentAccountAPILogon').val(),
								apipassword: $('#ns1blankspacePaymentAccountAPIPassword').val()
							}

							if ($('#ns1blankspacePaymentAccountAPIKey').val() != '')
							{
								oData.apikey = $('#ns1blankspacePaymentAccountAPIKey').val();
							}

							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_FUNDS_TRANSFER_ACCOUNT_MANAGE'),
								data: oData,
								dataType: 'json',
								success: function()
								{
									$.extend(true, oParam, {step: 1});
									ns1blankspace.setup.financial.paymentAccounts(oParam);
									ns1blankspace.status.message('Saved');
								}
							});
						})
						
						$('#ns1blankspacePaymentAccountEditCancel').button(
						{
							text: "Cancel"
						})
						.click(function() 
						{
							$.extend(true, oParam, {step: 1});
							ns1blankspace.setup.financial.paymentAccounts(oParam);
						})

						if (sID != undefined)
						{
							ns1blankspace.status.working();

							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_FINANCIAL_FUNDS_TRANSFER_ACCOUNT_SEARCH';
							oSearch.addField('title,provider,providertext,status,statustext,takepayment,makepayment,urlcancel,urlsuccess,provideraccountkey,' +
												'apikey,apilogon');
							oSearch.addFilter('id', 'EQUAL_TO', sID);
							oSearch.getResults(function(data)
							{
								$.extend(true, oParam, {step: 3});
								ns1blankspace.setup.financial.paymentAccounts(oParam, data)
							});
						}
						else
						{
							$('[name="radioPaymentAccountStatus"][value="1"]').attr('checked', true);
							$('[name="radioPaymentAccountMakePayment"][value="N"]').attr('checked', true);
							$('[name="radioPaymentAccountTakePayment"][value="N"]').attr('checked', true);	
						}
					}
						
					if (iStep == 3 && oResponse)
					{
						var oObjectContext = oResponse.data.rows[0];
						$('#ns1blankspacePaymentAccountTitle').val(oObjectContext.title);
						$('#ns1blankspacePaymentAccountTitle').focus();
						$('[name="radioPaymentAccountProvider"][value="' + oObjectContext.provider + '"]').attr('checked', true);
						$('[name="radioPaymentAccountStatus"][value="' + oObjectContext.status + '"]').attr('checked', true);
						$('[name="radioPaymentAccountMakePayment"][value="' + oObjectContext.makepayment + '"]').attr('checked', true);
						$('[name="radioPaymentAccountTakePayment"][value="' + oObjectContext.takepayment + '"]').attr('checked', true);
						$('[name="radioPaymentAccountBankAccount"][value="' + oObjectContext.bankaccount + '"]').attr('checked', true);
						$('#ns1blankspacePaymentAccountURLSuccess').val(oObjectContext.urlsuccess);
						$('#ns1blankspacePaymentAccountURLCancel').val(oObjectContext.urlcancel);
						$('#ns1blankspacePaymentAccountAPILogon').val(oObjectContext.apilogon);
						$('#ns1blankspacePaymentAccountAPIPassword').val(oObjectContext.apipassword);
						$('#ns1blankspacePaymentAccountAPIKey').val(oObjectContext.apikey);

						if (oObjectContext.provider == 10)
						{
							$('#ns1blankspacePaymentAccountEditColumn1 tr').hide();
							$('#ns1blankspacePaymentAccountEditColumn1 tr[data-provider*="10"]').show()
						}
						else
						{
							$('#ns1blankspacePaymentAccountEditColumn1 tr').show()
						}

						ns1blankspace.status.message('');

						if ($('input[name="radioPaymentAccountProvider"]:checked').val() == 8)
						{
							$('#ns1blankspacePaymentAccountEditColumn1 tr').hide();
							$('#ns1blankspacePaymentAccountEditColumn1 tr[data-provider*="8"]').show()
						}
						else
						{
							$('#ns1blankspacePaymentAccountEditColumn1 tr').show()
						}
					}

					if (iStep == 4)
					{									
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_FUNDS_TRANSFER_ACCOUNT_MANAGE'),
							data: 'remove=1&id=' + ns1blankspace.util.fs(sID),
							dataType: 'json',
							success: function(data)
							{
								if (data.status == 'OK')
								{
									$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
									$.extend(true, oParam, {step: 1});
									ns1blankspace.setup.financial.paymentAccounts(oParam);
									ns1blankspace.status.message('Saved');
								}
								else
								{
									ns1blankspace.status.error(data.error.errornotes);
								}
							}
						});
					}		
				},

	accounts: 	
				{
					tree: 	function ()
								{
									var oAccounts = ns1blankspace.financial.data.accounts;

								  	$(ns1blankspace.financial.data.accounts).each(function(i,k) 
									{
										var oItems = $.grep(oAccounts, function (a) { return parseInt(a.parentaccount) == parseInt(k.id); })	
										this.items = oItems;

										if ((this.title).indexOf('[Outgoing (Expense)]') != -1) {this.title = 'Expenses'};
										if ((this.title).indexOf('[Revenue (Income)]') != -1) {this.title = 'Revenue'};
										if ((this.title).indexOf('[Asset]') != -1) {this.title = 'Assets'};
										if ((this.title).indexOf('[Equity]') != -1) {this.title = 'Equity'};
										if ((this.title).indexOf('[Liability]') != -1) {this.title = 'Liability'};
									});
								},

					show:		function (oParam, oResponse)
								{
									var iStep = 1;
									var iType;
									var iParentAccount;

									if (oParam != undefined)
									{
										if (oParam.step != undefined) {iStep = oParam.step}
										if (oParam.type != undefined) {iType = oParam.type}
										if (oParam.parentAccount != undefined) {iParentAccount = oParam.parentAccount}
									}
										
									if (iStep == 1)
									{
										var aHTML = [];
														
										aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceSetupAccountColumnType" style="width:100px;padding-right:5px;font-size:0.875em;" class="ns1blankspaceColumn1">' +
														ns1blankspace.xhtml.loading + '</td>' +
													'<td id="ns1blankspaceSetupAccountColumnList" style="width:200px;padding-right:5px;font-size:0.875em;" class="ns1blankspaceColumn2">' +
													'</td>' +
													'<td id="ns1blankspaceSetupAccountColumnEdit" style="width:280px;padding-right:15px;font-size:0.875em;" class="ns1blankspaceColumn2">' +
													'</td>' +
													'<td id="ns1blankspaceSetupAccountColumnAction" class="ns1blankspaceColumn2">' +
													'</td>' +
													'</tr>' +
													'</table>');				
												
										$('#ns1blankspaceMainFinancialAccount').html(aHTML.join(''));
										
										if (ns1blankspace.financial.rootAccount == undefined)
										{	
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
											oSearch.addField('title');
											oSearch.addFilter('parentaccount', 'IS_NULL');
											oSearch.async = false;
											oSearch.rows = 1;
											
											oSearch.getResults(function(oResponse)
											{
												if (oResponse.data.rows.length != 0)
												{
													ns1blankspace.financial.rootAccount = oResponse.data.rows[0].id;
												}
												else
												{
													ns1blankspace.financial.rootAccount = -1;
												}	
											});	
										}

										if (ns1blankspace.financial.rootAccount == -1)
										{
											//Set up default
										}
										else
										{
											if (oResponse == undefined && ns1blankspace.financial.data.accounts === undefined)
											{
												var oSearch = new AdvancedSearch();
												oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
												oSearch.addField('title,parentaccount,parentaccounttext,postable,type,class');
												oSearch.rows = 200;
												oSearch.sort('title', 'asc');
												oSearch.getResults(function(data) {ns1blankspace.setup.financial.accounts.show(oParam, data)})	
											}
											else
											{
												var aHTML = [];
													
												if (oResponse !== undefined) {ns1blankspace.financial.data.accounts = oResponse.data.rows};
												ns1blankspace.financial.data.rootAccounts =  $.grep(ns1blankspace.financial.data.accounts, function (a) { return a.parentaccount == ns1blankspace.financial.rootAccount; })
												ns1blankspace.setup.financial.accounts.tree(ns1blankspace.financial.rootAccount); 

												aHTML.push('<table id="ns1blankspaceAccountType" class="ns1blankspace">' +
																'<tr class="ns1blankspaceRow">' +
																'<td id="ns1blankspaceSetupFinancialAccountType-1-'+ 
																($.grep(ns1blankspace.financial.data.rootAccounts, function (a) { return (a.title).indexOf('Expense') != -1; }))[0].id +
																'" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																'Expenses</td>' +
																'</tr>' +
																'<tr class="ns1blankspaceRow">' +
																'<td id="ns1blankspaceSetupFinancialAccountType-2-' +
																($.grep(ns1blankspace.financial.data.rootAccounts, function (a) { return (a.title).indexOf('Revenue') != -1; }))[0].id +
																'" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																'Revenue</td>' +
																'</tr>' +
																'<tr class="ns1blankspaceRow">' +
																'<td id="ns1blankspaceSetupFinancialAccountType-3-' +
																($.grep(ns1blankspace.financial.data.rootAccounts, function (a) { return (a.title).indexOf('Asset') != -1; }))[0].id +
																'" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																'Asset</td>' +
																'</tr>' +
																'<tr class="ns1blankspaceRow">' +
																'<td id="ns1blankspaceSetupFinancialAccountType-4-' +
																($.grep(ns1blankspace.financial.data.rootAccounts, function (a) { return (a.title).indexOf('Liability') != -1; }))[0].id +
																'" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																'Liability</td>' +
																'</tr>' +
																'<tr class="ns1blankspaceRow">' +
																'<td id="ns1blankspaceSetupFinancialAccountType-5-' +
																($.grep(ns1blankspace.financial.data.rootAccounts, function (a) { return (a.title).indexOf('Equity') != -1; }))[0].id +
																'" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																'Equity</td>' +
																'</tr>' +
																'</table>');					
														
												$('#ns1blankspaceSetupAccountColumnType').html(aHTML.join(''));

												$('#ns1blankspaceAccountType td.ns1blankspaceRowSelect').click(function(event)
												{
													var sXHTMLElementId = this.id;
													var aId = sXHTMLElementId.split('-');
													
													ns1blankspace.setup.financial.accounts.show({type: aId[1], parentAccount: aId[2], step: 2});
												});
											}
										}	
									}	
									else if (iStep == 2)
									{
										ns1blankspace.financial.currentAccount = iParentAccount;

										if (oResponse == undefined)
										{
											$('#ns1blankspaceSetupAccountColumnList').html(ns1blankspace.xhtml.loadingSmall);
											$('#ns1blankspaceSetupAccountColumnEdit').html('');
											$('#ns1blankspaceSetupAccountColumnAction').html('');

											var aHTML = [];

											aHTML.push('<table class="ns1blankspaceColumn2">' +
															'<tr><td>' +
															'<span id="ns1blankspaceAccountAdd" class="ns1blankspaceAction">Add</span>' +
															'</td></tr>' +
															'</table>');					
											
											$('#ns1blankspaceSetupAccountColumnEdit').html(aHTML.join(''));
										
											$('#ns1blankspaceAccountAdd').button(
											{
												label: "Add"
											})
											.click(function()
											{
												$.extend(true, oParam, {step: 4, xhtmlElementID: ""});
												ns1blankspace.setup.financial.accounts.show(oParam);
											})

											var oItems = $.grep(ns1blankspace.financial.data.accounts, function (a) { return a.parentaccount == iParentAccount; });
											ns1blankspace.setup.financial.accounts.show(oParam, oItems);
										}
										else
										{
											var aHTML = [];

											aHTML.push('<table id="ns1blankspaceSetupFinancialFinancialAccount" class="ns1blankspaceColumn2">');
										
											if (($.grep(ns1blankspace.financial.data.rootAccounts, function (a) { return a.id == iParentAccount; })).length == 0)
											{
												aHTML.push('<tr class="ns1blankspaceCaption">');
												aHTML.push('<td class="ns1blankspaceCaption" colspan=2>' +
																'<div style="float:left;""><span id="ns1blankspaceAccountParent-' +
																($.grep(ns1blankspace.financial.data.accounts, function (a) { return a.id == iParentAccount; }))[0].parentaccount +
																 '" class="ns1blankspaceRow ns1blankspaceRowOptionsParent"></span></div>' +
																'<div style="float:left;margin-left:3px;margin-top:3px;">' + ($.grep(ns1blankspace.financial.data.accounts, function (a) { return a.id == iParentAccount; }))[0].title
																+ '</div></td>');
												aHTML.push('</tr>');
											}
											
											if (oResponse.length == 0)
											{
												aHTML.push('<tr><td class="ns1blankspaceNothing">No sub-accounts.</td></tr></table>');
											}
											else
											{		
												$(oResponse).each(function()
												{
													aHTML.push('<tr class="ns1blankspaceRow">');
													
													if (this.postable == 'Y')
													{
														aHTML.push('<td id="ns1blankspaceFinancialAccount_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
																			' title="">' +
																			this.title + '</td>');
													}
													else
													{	
														aHTML.push('<td style="font-weight:600;" id="ns1blankspaceFinancialAccount_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
																			' title="">' +
																			this.title + '</td>');
													}						
															
													aHTML.push('<td class="ns1blankspaceRow" style="width:20px;">' +
																			'<span id="ns1blankspaceAccountChildren-' + this.id + '" class="ns1blankspaceRow' +
																			(this.postable != 'Y' ? ' ns1blankspaceRowOptionsChildren">' : '">') + '</span>' +
																			'</td>');						
																																
													aHTML.push('</tr>');
												});
											
												aHTML.push('</table>');
											}
										
											$('#ns1blankspaceSetupAccountColumnList').html(aHTML.join(''));
										
											$('#ns1blankspaceSetupFinancialFinancialAccount .ns1blankspaceRowOptionsParent').button(
											{
												text: false,
												icons: {
													primary: "ui-icon-triangle-1-w"
												}
											})
											.click(function() {
												var aId = (this.id).split('-');
												$.extend(true, oParam, {step: 2, parentAccount: aId[1]});
												ns1blankspace.setup.financial.accounts.show(oParam);
											})
											.css('width', '15px')
											.css('height', '17px');

											$('#ns1blankspaceSetupFinancialFinancialAccount .ns1blankspaceRowOptionsChildren').button(
											{
												text: false,
												icons: {
													primary: "ui-icon-play"
												}
											})
											.click(function() {
												var aId = (this.id).split('-');
												$.extend(true, oParam, {step: 2, parentAccount: aId[1]});
												ns1blankspace.setup.financial.accounts.show(oParam);
											})
											.css('width', '15px')
											.css('height', '17px');

											$('#ns1blankspaceSetupFinancialFinancialAccount td.ns1blankspaceRowSelect').click(function()
											{
												$.extend(true, oParam, {step: 4, xhtmlElementID: this.id});
												ns1blankspace.setup.financial.accounts.show(oParam);
											})
										}
									}
									else if (iStep == 4)
									{
										var sID; 
										var iType;
										var sXHTMLElementID;

										if (oParam != undefined)
										{
											if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
											if (oParam.type != undefined) {iType = oParam.type}
										}
										
										if (sXHTMLElementID != undefined)
										{
											var aXHTMLElementID = sXHTMLElementID.split('-');
											var sID = aXHTMLElementID[1];
										}	
									
										var iTaxType = (iType==1?2:1)

										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
						
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Code' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceFinancialAccountCode" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Title' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceFinancialAccountTitle" class="ns1blankspaceText">' +
														'</td></tr>');		

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Parent' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceSelect">' +
														'<input id="ns1blankspaceFinancialAccountParentAccount" class="ns1blankspaceSelect"' +
															' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
															' data-columns="title">' +
														'</td></tr>');	
										
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Can transactions be linked to this account?' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioPostableY" name="radioPostable" value="Y"/>Yes' +
															'<br /><input type="radio" id="radioPostableN" name="radioPostable" value="N"/>No (it is a header account)' +
														'</td></tr>');

										if (iType == 1 || iType == 2)
										{ 
											if (iTaxType == 2)
											{	
												aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Cost of sale' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceRadio">' +
															'<input type="radio" id="radioCOSY" name="radioCOS" value="Y"/>Yes' +
															'<br /><input type="radio" id="radioCOSN" name="radioCOS" value="N"/>No' +
															'</td></tr>');
											}	

											if (iTaxType == 1 || iTaxType == 2)
											{
												aHTML.push('<tr class="ns1blankspaceCaption">' +
																'<td class="ns1blankspaceCaption">' +
																ns1blankspace.option.taxVATCaption + ' Type' +
																'</td></tr>' +
																'<tr class="ns1blankspace">' +
																'<td id="ns1blankspaceFinancialTaxCode" class="ns1blankspaceRadio">' +
																ns1blankspace.xhtml.loadingSmall +
																'</td></tr>');
											}

											aHTML.push('<tr class="ns1blankspaceCaption">' +
																'<td class="ns1blankspaceCaption">' +
																'"Other" Expense' +
																'</td></tr>' +
																'<tr class="ns1blankspace">' +
																'<td class="ns1blankspaceRadio">' +
																'<input type="radio" id="radioOtherExpense2" name="radioOtherExpense" value="2"/>Yes' +
																'<br /><input type="radio" id="OtherExpense1" name="radioOtherExpense" value="1"/>No' +
																'</td></tr>');
										}	

										aHTML.push('</table>');					
										
										$('#ns1blankspaceSetupAccountColumnEdit').html(aHTML.join(''));
										
										$('#ns1blankspaceFinancialAccountTitle').focus();

										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2" style="font-size:0.875em">');
												
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceFinancialAccountEditSave" class="ns1blankspaceAction" style="width:70px;">' +
														'Save</span></td></tr>');
									
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceFinancialAccountEditRemove" class="ns1blankspaceAction" style="width:70px;">' +
														'Delete</span></td></tr>');

										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceFinancialAccountEditCancel" class="ns1blankspaceAction" style="width:70px;">' +
														'Cancel</span></td></tr>');
														
										aHTML.push('</table>');		
	
										$('#ns1blankspaceSetupAccountColumnAction').html(aHTML.join(''));
										
										$('#ns1blankspaceFinancialAccountEditSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											ns1blankspace.status.working();

											var sData = 'type=' + iType;
											sData += '&id=' + ns1blankspace.util.fs(sID);
											sData += '&code=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialAccountCode').val());
											sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialAccountTitle').val());
											sData += '&parentaccount=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialAccountParentAccount').attr("data-id"));
											sData += '&postable=' + ns1blankspace.util.fs($('input[name="radioPostable"]:checked').val());
											
											if ($('input[name="radioCOS"]').length != 0)
											{
												sData += '&expensecostofsale=' + ns1blankspace.util.fs($('input[name="radioCOS"]:checked').val());
											}

											if ($('input[name="radioOtherExpense"]').length != 0)
											{
												sData += '&class=' + ns1blankspace.util.fs($('input[name="radioOtherExpense"]:checked').val());
											}		

											if ($('input[name="radioTaxCode"]:checked').length != 0)
											{	
												sData += '&taxtype=' + ns1blankspace.util.fs($('input[name="radioTaxCode"]:checked').val());
											}

											var oAdd =
											{
												"items": [], 
												"code": $('#ns1blankspaceFinancialAccountCode').val(),
												"title": $('#ns1blankspaceFinancialAccountTitle').val(),
												"parentaccount": $('#ns1blankspaceFinancialAccountParentAccount').attr("data-id"),
												"postable": $('input[name="radioPostable"]:checked').val(),
												"taxtype": $('input[name="radioTaxCode"]:checked').val(),
												"class": $('input[name="radioOtherExpense"]:checked').val()
											}
														
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_ACCOUNT_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == "OK")
													{
														ns1blankspace.status.message('Saved');

														$.extend(true, oAdd, {id: data.id});
														
														var bNew = true;

														$(ns1blankspace.financial.data.accounts).each(function(i) 
														{
															if (this.id == data.id) {ns1blankspace.financial.data.accounts[i] = oAdd; bNew = false}
														});

														if (bNew) {(ns1blankspace.financial.data.accounts).unshift(oAdd)}

														$.extend(true, oParam, {step: 2});
														ns1blankspace.setup.financial.accounts.show(oParam)
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});
										});

										$('#ns1blankspaceFinancialAccountEditRemove').button(
										{
											text: "Delete"
										})
										.click(function() 
										{
											ns1blankspace.status.working();

											var oData =
											{
												remove: 1,
												id: sID
											}
												
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_ACCOUNT_MANAGE'),
												data: oData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														ns1blankspace.status.message('Removed');

														ns1blankspace.financial.data.accounts =
																		ns1blankspace.util.remove(ns1blankspace.financial.data.accounts, 'id', sID);
														
														$.extend(true, oParam, {step: 2});
														ns1blankspace.setup.financial.accounts.show(oParam)
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});
										});

										$('#ns1blankspaceFinancialAccountEditCancel').button(
										{
											text: "Cancel"
										})
										.click(function() 
										{
											$.extend(true, oParam, {step: 2});
											ns1blankspace.setup.financial.accounts.show(oParam);
										});

										if (sID != undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
											oSearch.addField('title,description,parentaccount,parentaccounttext,postable,expensecostofsale,taxtype,code,class');
											oSearch.addFilter('id', 'EQUAL_TO', sID);
											oSearch.getResults(function(data) {
													$.extend(true, oParam, {step: 5});
													ns1blankspace.setup.financial.accounts.show(oParam, data)
													});
										}
										else
										{
											$('#ns1blankspaceFinancialAccountParentAccount').val(($.grep(ns1blankspace.financial.data.accounts, function (a) { return a.id == ns1blankspace.financial.currentAccount; })[0].title).formatXHTML());
											$('#ns1blankspaceFinancialAccountParentAccount').attr('data-id', ns1blankspace.financial.currentAccount);
											$('[name="radioPostable"][value="Y"]').attr('checked', true);
											$('[name="radioCOS"][value="N"]').attr('checked', true);

											if (iType == 1 || iType == 2)
											{
												ns1blankspace.financial.util.tax.codes(
												{
													xhtmlElementID: 'ns1blankspaceFinancialTaxCode',
													id: 1,
													type: iType
												});
											}	
										}
									}
									else if (iStep == 5)
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];
											$('#ns1blankspaceFinancialAccountCode').val((oObjectContext.code).formatXHTML());
											$('#ns1blankspaceFinancialAccountTitle').val((oObjectContext.title).formatXHTML());
											$('#ns1blankspaceFinancialAccountParentAccount').val(($.grep(ns1blankspace.financial.data.accounts, function (a) { return a.id == oObjectContext.parentaccount; })[0].title).formatXHTML());
											$('#ns1blankspaceFinancialAccountParentAccount').attr('data-id', oObjectContext.parentaccount);
											$('[name="radioPostable"][value="' + oObjectContext.postable + '"]').attr('checked', true);
											$('[name="radioCOS"][value="' + oObjectContext.expensecostofsale + '"]').attr('checked', true);
											$('[name="radioOtherExpense"][value="' + oObjectContext.class + '"]').attr('checked', true);

											var iTaxType = (iType==1?2:1)

											if (iTaxType == 1 || iTaxType == 2)
											{
												ns1blankspace.financial.util.tax.codes(
												{
													xhtmlElementID: 'ns1blankspaceFinancialTaxCode',
													id: oObjectContext.taxtype,
													type: iTaxType
												});
											}	
										}
									}	
								},

					row:		function (oRow)
								{
									var aHTML = [];

									aHTML.push('<tr class="ns1blankspaceRow">' +
													'<td id="ins1blankspaceFinancialAccount_title-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
													' title="' + oRow.notes + '-' + oRow.items.length + '">' +
													oRow.title + '</td>');
																						
									aHTML.push('</tr>');
									
									return aHTML.join('');
								}
				},

	accountDefaults:			
				function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainFinancialAccountDefault').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainFinancialAccountDefault').attr('data-loading', '');

						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceFinancialAccountDefaultColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceFinancialAccountDefaultColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');

						$('#ns1blankspaceMainFinancialAccountDefault').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Cash' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceFinancialAccountCash" class="ns1blankspaceSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Creditors' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceFinancialAccountCreditors" class="ns1blankspaceSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>');	
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Debtors' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceFinancialAccountDebtors" class="ns1blankspaceSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Current Profit' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceFinancialAccountCurrentProfit" class="ns1blankspaceSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Retained Profit' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceFinancialAccountRetainedProfit" class="ns1blankspaceSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Product Sales' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceFinancialAccountProductSales" class="ns1blankspaceSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>');	
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Tax Liabilities' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceFinancialAccountTaxLiabilities" class="ns1blankspaceSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>');	
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Tax Credits' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceFinancialAccountTaxCredits" class="ns1blankspaceSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>');																	
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Tax Employee (Withheld)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceFinancialAccountTaxPayroll" class="ns1blankspaceSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>');
												
						aHTML.push('</table>');					
						
						$('#ns1blankspaceFinancialAccountDefaultColumn1').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceFinancialAccountCash').val(ns1blankspace.objectContextData.financialaccountcashtext);
							$('#ns1blankspaceFinancialAccountCash').attr("data-id", ns1blankspace.objectContextData.financialaccountcash);
							$('#ns1blankspaceFinancialAccountCreditors').val(ns1blankspace.objectContextData.financialaccountcreditorstext);
							$('#ns1blankspaceFinancialAccountCreditors').attr("data-id", ns1blankspace.objectContextData.financialaccountcreditors);
							$('#ns1blankspaceFinancialAccountDebtors').val(ns1blankspace.objectContextData.financialaccountdebtorstext);
							$('#ns1blankspaceFinancialAccountDebtors').attr("data-id", ns1blankspace.objectContextData.financialaccountdebtors);
							$('#ns1blankspaceFinancialAccountCurrentProfit').val(ns1blankspace.objectContextData.financialaccountcurrentearningstext);
							$('#ns1blankspaceFinancialAccountCurrentProfit').attr("data-id", ns1blankspace.objectContextData.financialaccountcurrentearnings);
							$('#ns1blankspaceFinancialAccountRetainedProfit').val(ns1blankspace.objectContextData.financialaccountretainedearningstext);
							$('#ns1blankspaceFinancialAccountRetainedProfit').attr("data-id", ns1blankspace.objectContextData.financialaccountretainedearnings);
							$('#ns1blankspaceFinancialAccountTaxLiabilities').val(ns1blankspace.objectContextData.taxreportfinancialaccountpayabletext);
							$('#ns1blankspaceFinancialAccountTaxLiabilities').attr("data-id", ns1blankspace.objectContextData.taxreportfinancialaccountpayable);
							$('#ns1blankspaceFinancialAccountTaxCredits').val(ns1blankspace.objectContextData.taxreportfinancialaccountcreditstext);
							$('#ns1blankspaceFinancialAccountTaxCredits').attr("data-id", ns1blankspace.objectContextData.taxreportfinancialaccountcredits);
							$('#ns1blankspaceFinancialAccountTaxPayroll').val(ns1blankspace.objectContextData.payrollfinancialaccounttaxtext);
							$('#ns1blankspaceFinancialAccountTaxPayroll').attr("data-id", ns1blankspace.objectContextData.payrollfinancialaccounttax);
							$('#ns1blankspaceFinancialAccountProductSales').val(ns1blankspace.objectContextData.financialaccountproductincometext);
							$('#ns1blankspaceFinancialAccountProductSales').attr("data-id", ns1blankspace.objectContextData.financialaccountproductincome);
						}
					}	
				},

	invoicing:	function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainInvoicing').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainInvoicing').attr('data-loading', '');

						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceInvoicingColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceInvoicingColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');
		
						$('#ns1blankspaceMainInvoicing').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table id="ns1blankspaceInvoicing" class="ns1blankspace">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Payment Term Notes' +
										'</td></tr>' +
										'<tr class="ns1blankspaceTextMulti">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="3" cols="35" id="ns1blankspaceInvoicingPaymentTermsNotes" class="ns1blankspaceTextMultiSmall"></textarea>' +
										'</td></tr>');
						
						aHTML.push('</table>');	
						
						$('#ns1blankspaceInvoicingColumn1').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceInvoicingPaymentTermsNotes').val(ns1blankspace.objectContextData.paymentterms);		
						}
					}	
				},

	template:
				{
					init: 	function (oParam)
								{
									var bNew = ns1blankspace.util.getParam(oParam, 'new', {"default": false}).value;

									if (bNew)
									{
										delete oParam.document;
										delete oParam.new;
										oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.setup.financial.template.show);
										ns1blankspace.format.templates.new(oParam);
									}
									else
									{	
										oParam = ns1blankspace.util.setParam(oParam, 'template', 'invoice', {onlyIfMissing: true});
										oParam = ns1blankspace.util.setParam(oParam, 'object', 5, {onlyIfMissing: true});
										oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.format.templates.init);
										oParam = ns1blankspace.util.setParam(oParam, 'onCompleteWhenCan', ns1blankspace.setup.financial.template.show);

										ns1blankspace.format.templates.convert(oParam);
									}	
								},

					show: 	function (oParam)
								{
									var sTemplate = ns1blankspace.util.getParam(oParam, 'template', {"default": 'invoice'}).value;
									var iObject = ns1blankspace.util.getParam(oParam, 'object', {"default": 5}).value;
									var iDocument = ns1blankspace.util.getParam(oParam, 'document').value;
									var bVariants = ns1blankspace.util.getParam(oParam, 'variants', {"default": false}).value;
									var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": false}).value;

									var aHTML = [];
									
									if ($('#ns1blankspaceMainTemplate_' + sTemplate).attr('data-loading') == '1' || bRefresh)
									{
										$('#ns1blankspaceMainTemplate_' + sTemplate).attr('data-loading', '');
												
										ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;		
												
										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceTemplateColumn1_' + sTemplate + '" class="ns1blankspaceColumn1Flexible"></td>' +
														'<td id="ns1blankspaceTemplateColumn2_' + sTemplate + '" class="ns1blankspaceColumn2Action" style="width:100px; padding-left:12px;"></td>' +
														'</tr>' + 
														'</table>');
													
										$('#ns1blankspaceMainTemplate_' + sTemplate).html(aHTML.join(''));
										
										var aHTML = [];

										aHTML.push('<table id="ns1blankspaceTemplate_variants_' + sTemplate + '">');											

										aHTML.push('<tr><td>' +
														'<div id="ns1blankspaceTemplate_variants_container">' +
														'<span id="ns1blankspaceTemplate_variants_save_' + sTemplate + '" class="ns1blankspaceAction"></span>' +
														(bVariants?'<span id="ns1blankspaceTemplate_variants_remove_' + sTemplate + '" class="ns1blankspaceAction">&nbsp;</span>':'') +
														(bVariants?'<span id="ns1blankspaceTemplate_variants_add_' + sTemplate + '" class="ns1blankspaceAction">&nbsp;</span>':'') +
														'</div>' +
														'</td></tr>');

										if (bVariants)
										{	
											$.each(ns1blankspace.format.templates.data[iObject], function(t, template)
											{
												if ((iDocument == undefined) && (t==0))
												{
													iDocument = template.id;
													oParam = ns1blankspace.util.setParam(oParam, 'document', iDocument)
												}

												aHTML.push('<tr><td style="font-size:0.75em;" ');

												aHTML.push('id="ns1blankspaceTemplate_variants-' + template.id + '"' +
														  		' class="ns1blankspaceRow ns1blankspaceRowSelect' + (template.id==iDocument?' ns1blankspaceHighlight':'') + '" ' +
														   		' data-caption="' + (template.title) + '" style="cursor: pointer;">' + template.title);

												aHTML.push('</td></tr>');		   		
											});
										}
										else
										{
											iDocument = ns1blankspace.format.templates.data[iObject][0].id;
											oParam = ns1blankspace.util.setParam(oParam, 'document', iDocument)
										}
									
										aHTML.push('</table>');
										
										aHTML.push('<table style="margin-top:10px;">');
															
										aHTML.push('<tr><td class="ns1blankspaceCaption" style="font-size:0.825em;">TAGS</td</tr>');

										$.each(ns1blankspace.format.tags, function()
										{
											if (this.object == iObject && this.type == 1)
											{
												aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceRowSelect" style="font-size:0.75em;">');

												aHTML.push('<span id="spanInterfaceFormatTag_' + (this.caption).replace(/ /g,'-') + '"' +
														  		' class="interfaceFormatTags" ' +
														   		' data-caption="[[' + (this.caption) + ']]" style="cursor: pointer;">' + this.caption + '</span>');

												aHTML.push('</td></tr>');		   		
											}				
										});

										$.each(ns1blankspace.format.tags, function()
										{
											if (this.object == iObject && this.type == 2)
											{
												aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceRowSelect" style="font-size:0.75em;">');

												aHTML.push('<span id="spanInterfaceFormatTag_' + (this.caption).replace(/ /g,'-') + '"' +
														  		 ' class="interfaceFormatTags" ' +
														   		' data-caption="[[' + (this.caption) + ']]" style="cursor: pointer;">' + this.caption + '</span>');

												aHTML.push('</td></tr>');		   		
											}				
										});
														
										aHTML.push('</table>');			

										$('#ns1blankspaceTemplateColumn2_' + sTemplate).html(aHTML.join(''));

										$('#ns1blankspaceTemplate_variants_save_' + sTemplate)
										.button(
										{
											label: "Save"
										})
										.click(function()
										{
											ns1blankspace.setup.financial.template.save(oParam);
										})
										.css('width', (bVariants?'38px':'54px'))
										.css('padding-left', (bVariants?'4px':'12px'))
										.css('height', '28px')
										.next()
											.button(
											{
												text: false,
												icons:
												{
													primary: "ui-icon-close"
												}
											})
											.click(function()
											{
												if (confirm('Click OK to delete this template, else click Cancel.'))
												{
													ns1blankspace.setup.financial.template.remove(oParam);
												}	
											})
											.css('font-size', '0.725em')
											.css('width', '23px')
											.css('height', '28px')
											.css('margin-left', '2px')
											.css('padding-top', '7px')	
											.css('padding-left', '5px')	
										.next()
											.button(
											{
												text: false,
												icons:
												{
													primary: "ui-icon-plus"
												}
											})
											.click(function()
											{
												if (confirm('Click OK to add a new template, else click Cancel.'))
												{
													oParam = ns1blankspace.util.setParam(oParam, 'new', true);
													ns1blankspace.setup.financial.template.init(oParam);
												}	
											})
											.css('font-size', '0.725em')
											.css('width', '23px')
											.css('height', '28px')
											.css('margin-left', '2px')
											.css('padding-top', '7px')	
											.css('padding-left', '5px')
											.parent()
												.buttonset();	

										$('#ns1blankspaceTemplate_variants_save_' + sTemplate).find('span').css('padding-left', '4px')		

										$('#ns1blankspaceTemplate_variants_' + sTemplate + ' .ns1blankspaceRowSelect').click(function ()
										{
											oParam = ns1blankspace.util.setParam(oParam, 'document', this.id.split('-')[1]);
											ns1blankspace.setup.financial.template.init(oParam);
										});

										var aHTML = [];
										
										aHTML.push('<table id="ns1blankspaceColumn1" class="ns1blankspaceTemplateText_' + sTemplate + '" data-editorcount="' + ns1blankspace.counter.editor + '"">');

										if (bVariants)
										{
											aHTML.push('<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceText">' +
															'<input id="ns1blankspaceTemplateTitle_' + sTemplate + ns1blankspace.counter.editor + '" class="ns1blankspaceText">' +
															'</td></tr>');
										}	
												
										aHTML.push('<tr><td>' +
														'<textarea rows="30" cols="50" id="ns1blankspaceTemplateText_' + sTemplate +
															ns1blankspace.counter.editor + '" data-editorcount="' + ns1blankspace.counter.editor +
															'" class="ns1blankspaceTextMulti"></textarea>' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceTemplateColumn1_' + sTemplate).html(aHTML.join(''));

										var oTemplate = ns1blankspace.format.templates.get(oParam);
										
										$('#ns1blankspaceTemplateText_' + sTemplate + ns1blankspace.counter.editor).val(oTemplate.xhtml);
										$('#ns1blankspaceTemplateTitle_' + sTemplate + ns1blankspace.counter.editor).val(oTemplate.title);

										ns1blankspace.format.editor.init(
										{
											height: '500px',
											selector: '#ns1blankspaceTemplateText_' + sTemplate + ns1blankspace.counter.editor
										});

										$('.interfaceFormatTags')
										.hover( function()
										{	
											oMCEBookmark = tinyMCE.get('ns1blankspaceTemplateText_' + sTemplate + ns1blankspace.counter.editor).selection.getBookmark({type: 1, normalized: true});
										})
										.click( function()
										{
											ns1blankspace.format.editor.addTag(
											{
												xhtmlElementID: this.id,
												editorID: 'ns1blankspaceTemplateText_' + sTemplate + ns1blankspace.counter.editor, 
												mceBookmark: oMCEBookmark
											});
										});
									}
								},	

					save:		function (oParam)
								{
									var sTemplate = ns1blankspace.util.getParam(oParam, 'template', {"default": 'invoice'}).value;
									var sCounter = $('table.ns1blankspaceTemplateText_' + sTemplate).attr('data-editorcount');
									var iDocument = ns1blankspace.util.getParam(oParam, 'document').value;
									var sTitle = ns1blankspace.util.getParam(oParam, 'title', {"default": sTemplate.toUpperCase() + ' TEMPLATE'}).value 

									ns1blankspace.status.working();

									if ($('#ns1blankspaceTemplateTitle_' + sTemplate + sCounter).length > 0)
									{
										sTitle = $('#ns1blankspaceTemplateTitle_' + sTemplate + sCounter).val();
									}	

									var oData = {id: iDocument};
									oData.content = tinyMCE.get('ns1blankspaceTemplateText_' + sTemplate + sCounter).getContent();
									oData.type = 10;
									oData.title = sTitle;

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('DOCUMENT_MANAGE'),
										data: oData,
										dataType: 'json',
										success: function(data)
										{
											var sCounter = $('table.ns1blankspaceTemplateText_' + sTemplate).attr('data-editorcount');
											$('#ns1blankspaceTemplate_variants-' + iDocument).text(sTitle);
											ns1blankspace.status.message('Saved');
											ns1blankspace.inputDetected = false;
											ns1blankspace.format.templates.data = []
										}
									});
								},

					remove:	function (oParam)
								{
									var iDocument = ns1blankspace.util.getParam(oParam, 'document').value;
									
									ns1blankspace.status.working();

									var oData = {id: iDocument, remove: 1};
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('DOCUMENT_MANAGE'),
										data: oData,
										dataType: 'json',
										success: function(data)
										{
											ns1blankspace.status.message('Removed');
											delete oParam.document;
											ns1blankspace.setup.financial.template.init(oParam);
										}
									});
								},

					util: 	{
									website:	function (oParam, oResponse)
									{
										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_SITE_SEARCH';
											oSearch.addField('title');
											oSearch.sort('id', 'asc');
											oSearch.addFilter('title', 'EQUAL_TO', 'Public Template Files')
											oSearch.rows = 1;
											
											oSearch.getResults(function(oResponse)
											{
												ns1blankspace.setup.financial.template.util.website(oParam, oResponse)
											});
										}
										else
										{
											if (oResponse.data.rows.length == 0)
											{
												ns1blankspace.setup.financial.template.util.create()
											}
											else
											{
												ns1blankspace.setup.financial.template.util.attach(
												{
													objectContext: oResponse.data.rows[0].id
												})
											}
										}
									},

									create:	function (oParam, oResponse)
									{
										if (oResponse == undefined)
										{
											ns1blankspace.status.working();
										
											var oData = {};
											
											oData.title = 'Public Template Files';
											oData.email = ns1blankspace.user.email;
											oData.status = 2
											oData.notes = 'Automatically created to hold public image files for financial templates.'
											oData.headerheight = $('#ns1blankspaceLayoutHeaderHeight').val();
											oData.footerheight = $('#ns1blankspaceLayoutFooterHeight').val();
											oData.columns = $('#ns1blankspaceLayoutColumns').val();
											oData.layout = 3
											oData.cssattachment = 0
											oData.templatedocument = '';
											oData.ondemandstatus = 1	
												
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_SITE_MANAGE'),
												data: oData,
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.financial.template.util.create(oParam, data)}
											});
										}
										else
										{
											ns1blankspace.status.clear();

											ns1blankspace.setup.financial.template.util.attach(
											{
												objectContext: oResponse.id
											})
										}
									},

									attach: function (oParam, oResponse)
									{
										var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext').value;

										ns1blankspace.attachments.show(
										{
											object: 40,
											objectContext: iObjectContext,
											xhtmlElementID: 'ns1blankspaceMainTemplateAttachments',
											label: 'Select the files to attach for use in templates...',
											maxFiles: 1,
											helpNotes: '<div style="font-weight:bold; padding-bottom:12px;">Uploaded image files, along with any other image files attached to any of your public websites, are available using the Insert Image toolbar option when editing your templates.</div><div>If you upload a file with the same name as an existing attachment it will automatically be replaced.</div>'
										});
									}
								}				
				},

	tax: 		function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainTax').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainTax').attr('data-loading', '');
												
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceTaxColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
										'<td id="ns1blankspaceTaxColumn2" class="ns1blankspaceColumn2" style="width:50px;"></td>' +
										'</tr>' + 
										'</table>');

						$('#ns1blankspaceMainTax').html(aHTML.join(''));
						
						var aHTML = [];
						
					
						aHTML.push('<table id="tablens1blankspaceTaxColumn1" class="ns1blankspace">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Lock transactions if in completed tax period' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioTaxLockY" name="radioTaxLock" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioTaxLockN" name="radioTaxLock" value="N"/>No' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Includes tax as default' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioTaxDefaultY" name="radioTaxDefault" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioTaxDefaultN" name="radioTaxDefault" value="N"/>No' +
										'</td></tr>');
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										ns1blankspace.option.taxVATCaption + ' frequency' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioTaxReportingFrequency4" name="radioTaxReportingFrequency" value="4"/>Never' +
										'<br /><input type="radio" id="radioTaxReportingFrequency1" name="radioTaxReportingFrequency" value="1"/>Monthly' +
										'<br /><input type="radio" id="radioTaxReportingFrequency2" name="radioTaxReportingFrequency" value="2"/>Quarterly' +
										'<br /><input type="radio" id="radioTaxReportingFrequency3" name="radioTaxReportingFrequency" value="3"/>Annually' +
										'</td></tr>');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Employee tax reporting frequency' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioTaxPayrollReportingFrequency4" name="radioTaxPayrollReportingFrequency" value="4"/>Never' +
										'<br /><input type="radio" id="radioTaxPayrollReportingFrequency1" name="radioTaxPayrollReportingFrequency" value="1"/>Monthly' +
										'<br /><input type="radio" id="radioTaxPayrollReportingFrequency2" name="radioTaxPayrollReportingFrequency" value="2"/>Quarterly' +
										'<br /><input type="radio" id="radioTaxPayrollReportingFrequency3" name="radioTaxPayrollReportingFrequency" value="3"/>Annually' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Tax Expense Description<br /><span class="ns1blankspaceSub" style="font-size:0.75em; vertical-align:middle; padding-left:3px;">When a tax report is completed, the tax payable expense will be created with this description.</span>' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceTaxExpenseDescription" class="ns1blankspaceText">' +
										'</td></tr>' +
										'</tr>');
																																			
						aHTML.push('</table>');					
						
						$('#ns1blankspaceTaxColumn1').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('[name="radioTaxLock"][value="' + ns1blankspace.objectContextData.lockifincompletedtaxreport + '"]').attr('checked', true);
							$('[name="radioTaxReportingFrequency"][value="' + ns1blankspace.objectContextData.taxreportfrequency + '"]').attr('checked', true);
							$('[name="radioTaxPayrollReportingFrequency"][value="' + ns1blankspace.objectContextData.taxreportfrequencyemployee + '"]').attr('checked', true);
							//$('[name="radioTaxDefault"][value="' + ns1blankspace.objectContextData.classicincludestax + '"]').attr('checked', true);
							$('#ns1blankspaceTaxExpenseDescription').val(ns1blankspace.financial.data.settings.taxexpensedescription);
						}
					}	
				},

	payroll:	{
					data: 	{},

					init: 	function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'CORE_SPACE_PROFILE_SEARCH';
										oSearch.addField('attribute,value');
										oSearch.addFilter('attribute', 'IN_LIST', '526,283');
										oSearch.getResults(function(data) {ns1blankspace.setup.financial.payroll.init(oParam, data)});
									}
									else
									{
										ns1blankspace.objectContextData.payrollfinancialsexpenseonly = 'N';

										var oProfile = _.find(oResponse.data.rows, function (row) {return row.attribute == '526'})
										if (oProfile != undefined)
										{
											ns1blankspace.objectContextData.payrollfinancialsexpenseonly = oProfile.value;
										}

										var oProfile = _.find(oResponse.data.rows, function (row) {return row.attribute == '283'})
										if (oProfile != undefined)
										{
											ns1blankspace.objectContextData.payrollfinancialspayments = oProfile.value;
										}

										ns1blankspace.setup.financial.payroll.show(oParam);
									}
								},

					show: 	function (oParam, oResponse)
								{
									var aHTML = [];
									
									if (oResponse == undefined)
									{
										if ($('#ns1blankspaceMainPayroll').attr('data-loading') == '1')
										{
										
											$('#ns1blankspaceMainPayroll').attr('data-loading', '');
																	
											aHTML.push('<table class="ns1blankspaceContainer">' +
															'<tr class="ns1blankspaceContainer">' +
															'<td id="ns1blankspacePayrollColumn1" class="ns1blankspaceColumn1" style="width:420px;"></td>' +
															'<td id="ns1blankspacePayrollColumn2" class="ns1blankspaceColumn2"></td>' +
															'</tr>' + 
															'</table>');	

											$('#ns1blankspaceMainPayroll').html(aHTML.join(''));
											
											var aHTML = [];
											
											aHTML.push('<table class="ns1blankspace">');
										
											aHTML.push('<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceCaption">' +
															'Default Pay Period' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceRadio">' +
															'<input type="radio" id="radioPeriodDefault1" name="radioPeriodDefault" value="1"/>Weekly' +
															'<br /><input type="radio" id="radioPeriodDefault2" name="radioPeriodDefault" value="2"/>Fortnightly' +
															'<br /><input type="radio" id="radioPeriodDefault3" name="radioPeriodDefault" value="3"/>Monthly' +
															'<br /><input type="radio" id="radioPeriodDefault4" name="radioPeriodDefault" value="4"/>Bi-Monthly' +
															'</td></tr>');

											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Default Superannuation Fund' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceSelect">' +
															'<input id="ns1blankspacePayrollSuperannuationBusiness" class="ns1blankspaceSelect"' +
																' data-method="CONTACT_BUSINESS_SEARCH"' +
																' data-columns="tradename">' +
															'</td></tr>');

											aHTML.push(
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceCaption">' +
															'On completion of the payroll period, financial items are created for each of the employees as' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceRadio">' +
															'<input type="radio" id="radioPayrollFinancialsExpenseOnlyN" name="radioPayrollFinancialsExpenseOnly" value="N"/>an expense for wages (P/L) and journal for tax (B/S)' +
															'<br /><input type="radio" id="radioPayrollFinancialsExpenseOnlyY" name="radioPayrollFinancialsExpenseOnly" value="Y"/>one expense for wages & tax (P/L)' +
															'</td></tr>');

											aHTML.push(
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceCaption">' +
															'Create payments when creating the expenses' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceRadio">' +
															'<input type="radio" id="radioPayrollFinancialsPaymentsN" name="radioPayrollFinancialsPayments" value="N"/>No' +
															'<br /><input type="radio" id="radioPayrollFinancialsPaymentsY" name="radioPayrollFinancialsPayments" value="Y"/>Yes' +
															'</td></tr>');

											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Payroll Superannuation Monthly Threshold<br /><span class="ns1blankspaceSub" style="font-size:0.75em; vertical-align:middle; padding-left:3px;">Gross salary amount that superannuation becomes mandatory, based on regulations.</span>' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceText">' +
															'<input id="ns1blankspacePayrollSuperannuationMonthlyThreshold" class="ns1blankspaceText">' +
															'</td></tr>' +
															'</tr>');	
					
											aHTML.push('</table>');					
											
											$('#ns1blankspacePayrollColumn1').html(aHTML.join(''));

											if (ns1blankspace.objectContextData != undefined)
											{
												$('[name="radioPeriodDefault"][value="' + ns1blankspace.objectContextData.payrollpayperiod + '"]').attr('checked', true);
												$('[name="radioPayrollFinancialsExpenseOnly"][value="' + ns1blankspace.objectContextData.payrollfinancialsexpenseonly + '"]').attr('checked', true);
												$('#ns1blankspacePayrollSuperannuationBusiness').attr('data-id', ns1blankspace.objectContextData.payrollsuperannuationcontactbusiness);
												$('[name="radioPayrollFinancialsPayments"][value="' + ns1blankspace.objectContextData.payrollfinancialspayments + '"]').attr('checked', true);
												$('#ns1blankspacePayrollSuperannuationMonthlyThreshold').val(ns1blankspace.objectContextData.payrollsuperannuationmonthlythreshold);
												
												if (ns1blankspace.objectContextData.payrollsuperannuationcontactbusiness != '')
												{
													var oSearch = new AdvancedSearch();
													oSearch.method = 'CONTACT_BUSINESS_SEARCH';
													oSearch.addField('tradename');
													oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContextData.payrollsuperannuationcontactbusiness);
													oSearch.getResults(function(data) {ns1blankspace.setup.financial.payroll.show(oParam, data)});
												}	
											}
										}
									}	
									else
									{
										if (oResponse.data.rows.length > 0)
										{
											$('#ns1blankspacePayrollSuperannuationBusiness').val(oResponse.data.rows[0].tradename);
										}	
									}	
								},
							
				linetypes: 	{
									init:		function (oParam)
												{
													if (ns1blankspace.setup.financial.payroll.data.linetypes != undefined)
													{
														ns1blankspace.setup.financial.payroll.linetypes.show(oParam);
													}
													else
													{	
														var oSearch = new AdvancedSearch();
														oSearch.method = 'SETUP_FINANCIAL_PAYROLL_LINE_TYPE_SEARCH';		
														oSearch.addField('includeinallowancesnontaxable,includeinallowancestaxable,includeindeductions,includeingrosssalary,' +
																			'includeinleave,includeinleaveloading,includeinleavetype,includeinleavetypetext,includeinposttaxsuper,' +
																			'includeinsalarysacrificesuper,includeinstandardhours,includeinsuper,includeintaxadjustments,notes,title,fixed');
														oSearch.rows = 100;
														oSearch.sort('title', 'asc');
														oSearch.getResults(function(oResponse)
														{
															ns1blankspace.setup.financial.payroll.data.linetypes = oResponse.data.rows;
															ns1blankspace.setup.financial.payroll.linetypes.show(oParam);
														});
													}	
												},

									show:		function (oParam)
												{
													var bShowFixed = ns1blankspace.util.getParam(oParam, 'showFixed', {"default": false}).value;
													var iID = ns1blankspace.util.getParam(oParam, 'id').value;

													if (ns1blankspace.setup.financial.payroll.data.linetypes == undefined)
													{
														ns1blankspace.setup.financial.payroll.linetypes.init(oParam);
													}
													else
													{	
														$vq.clear({queue: 'types'});

														$vq.add('<table>' +
																	'<tr class="ns1blankspaceContainer">' +
																	'<td id="ns1blankspacePayrollTypesColumn1" class="ns1blankspaceColumn1" style="width:200px;"></td>' +
																	'<td id="ns1blankspacePayrollTypesColumn2" class="ns1blankspaceColumn2" style="width:350px;"></td>' +
																	'<td id="ns1blankspacePayrollTypesColumn3" class="ns1blankspaceColumn2"></td>' +
																	'</tr>' + 
																	'</table>', {queue: 'types'});	

														$vq.render('#ns1blankspaceMainPayrollTypes', {queue: 'types'});

														var aLineTypes = ns1blankspace.setup.financial.payroll.data.linetypes;

														if (!bShowFixed)
														{
															aLineTypes = $.grep(aLineTypes, function (type) {return type.fixed == 'N'})
														}	

														if (aLineTypes == 0)
														{
															$vq.add('<div class="ns1blankspaceSubNote" style=" margin-top:4px;"' +
																		'>No pay types set up.</div>', {queue: 'types'});
														}
														else
														{	
															$.each(aLineTypes, function (t, type)
															{
																$vq.add('<div class="ns1blankspaceRow ns1blankspaceRowSelect" style="border-width: 1px;"' +
																			' id="ns1blankspaceSetupPayrollType-' + type.id + '">' + type.title + '</div>', {queue: 'types'});
															});
														}	

														if (!bShowFixed)
														{
															$vq.add('<div class="ns1blankspaceSubNote" style="margin-top:12px; cursor:pointer;"' +
																		' id="ns1blankspaceSetupPayrollTypeShowFixed">Show standard pay types</div>', {queue: 'types'});
														}
														else
														{
															$vq.add('<div class="ns1blankspaceSubNote" style="margin-top:12px; cursor:pointer;"' +
																		' id="ns1blankspaceSetupPayrollTypeHideFixed">Hide standard pay types</div>', {queue: 'types'});
														}	
	
														$vq.render('#ns1blankspacePayrollTypesColumn1', {queue: 'types'});

														$('#ns1blankspacePayrollTypesColumn1 .ns1blankspaceRowSelect').click(function ()
														{
															ns1blankspace.setup.financial.payroll.linetypes.edit({xhtmlElementID: this.id})
														});

														$('#ns1blankspaceSetupPayrollTypeShowFixed').click(function ()
														{
															oParam = ns1blankspace.util.setParam(oParam, 'showFixed', true);
															ns1blankspace.setup.financial.payroll.linetypes.show(oParam)
														});

														$('#ns1blankspaceSetupPayrollTypeHideFixed').click(function ()
														{
															oParam = ns1blankspace.util.setParam(oParam, 'showFixed', false);
															ns1blankspace.setup.financial.payroll.linetypes.show(oParam)
														});

														$vq.init('<table class="ns1blankspaceColumn2"><tr><td>' +
																	'<span id="ns1blankspaceSetupPayrollTypeAdd" class="ns1blankspaceAction">New</span></td>' +
																	'</td></tr></table>', {queue: 'type-add'});

														$vq.render('#ns1blankspacePayrollTypesColumn2', {queue: 'type-add'});

														$('#ns1blankspaceSetupPayrollTypeAdd').button()
														.click(function()
														{
															ns1blankspace.setup.financial.payroll.linetypes.add();
														});

														if (iID != undefined)
														{
															ns1blankspace.setup.financial.payroll.linetypes.edit({xhtmlElementID: 'ns1blankspaceSetupPayrollType-' + iID})
														}	
													}	
												},

									add: 		function (oParam)
												{
													var oData = {title: '[New Type]', includeinstandardhours: 'Y'}
														
													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_PAYROLL_LINE_TYPE_MANAGE'),
														data: oData,
														dataType: 'json',
														success: function(oResponse)
														{
															ns1blankspace.status.message('Added');
															oParam = ns1blankspace.util.setParam(oParam, 'showFixed', false);
															oParam = ns1blankspace.util.setParam(oParam, 'id', oResponse.id);
															ns1blankspace.setup.financial.payroll.data.linetypes = undefined
															ns1blankspace.setup.financial.payroll.linetypes.show(oParam);
														}
													});
												},			

									edit: 		function (oParam)
												{
													var iLineType = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
													var oLineType = ns1blankspace.financial.payroll.util.linetypes.get(
																		{
																			id: iLineType,
																			lineTypes: ns1blankspace.setup.financial.payroll.data.linetypes
																		});

													var aIncludeIn = ns1blankspace.financial.payroll.util.linetypes.includeIn(
																		{
																			id: iLineType,
																			selectableOnly: true
																		});
													
													$vq.init('<table class="ns1blankspaceColumn2">', {queue: 'type-edit'});

													if (oLineType.fixed == 'Y')
													{	
														$vq.add('<tr><td class="ns1blankspaceSub">This is standard type; it can not be edited.</td></tr>', {queue: 'type-edit'});

														$vq.add('<tr><td class="ns1blankspaceCaption" style="padding-top:8px;">' +
																		'Included in' +
																		'</td></tr>', {queue: 'type-edit'});

														$vq.add('<tr><td>', {queue: 'type-edit'});

														$.each(aIncludeIn, function (i, include)
														{
															$vq.add('<div class="ns1blankspaceRow" style="border-width: 0px;"' +
																			' id="ns1blankspaceSetupPayrollTypeInclude-' + include.key + '">' + include.title + '</div>', {queue: 'type-edit'});
														});

														$vq.add('</td></tr>', {queue: 'type-edit'});
													}
													else
													{
														$vq.add('<tr><td class="ns1blankspaceCaption">' +
																		'Title' +
																		'</td></tr>' +
																		'<tr class="ns1blankspace">' +
																		'<td class="ns1blankspaceText">' +
																		'<input id="ns1blankspaceSetupPayrollTypeTitle" class="ns1blankspaceText" style="width:90%;">' +
																		'</td></tr>' +
																		'</tr>', {queue: 'type-edit'});

														$vq.add('<tr><td class="ns1blankspaceCaption">' +
																		'Include In' +
																		'</td></tr>', {queue: 'type-edit'});

														$vq.add('<tr><td id="ns1blankspaceSetupPayrollTypeIncludeContainer">', {queue: 'type-edit'});

														$.each($.grep(ns1blankspace.financial.payroll.util.linetypes.data, function (include) {return include.selectable && !include.dependant}), function (i, include)
														{
															if (include.options == undefined)
															{	
																$vq.add('<div class="ns1blankspaceRow" style="border-width: 0px;"' +
																			' id="ns1blankspaceSetupPayrollTypeIncludeContainer-' + include.key + '">' +
																			'<input type="radio" style="margin-right:8px;"' +
																			($.grep(aIncludeIn, function (i) {return i.key == include.key}).length==0?'':' checked="checked"') +
																			' id="ns1blankspaceSetupPayrollTypeInclude-' + include.key + '"' +
																			' name="ns1blankspaceSetupPayrollTypeInclude"' +
																			' data-dependant="false"' + 
																			' value="' + include.key + '" />' +
																			include.title + '</div>', {queue: 'type-edit'});
															}	
														});

														$vq.add('</td></tr>', {queue: 'type-edit'});

														$vq.add('<tr><td class="ns1blankspaceCaption">' +
																		'and' +
																		'</td></tr>', {queue: 'type-edit'});

														$vq.add('<tr><td id="ns1blankspaceSetupPayrollTypeIncludeDependantContainer">', {queue: 'type-edit'});

														$.each($.grep(ns1blankspace.financial.payroll.util.linetypes.data, function (include) {return include.selectable && include.dependant}), function (i, include)
														{
															if (include.options == undefined)
															{	
																$vq.add('<div class="ns1blankspaceRow" style="border-width: 0px;"' +
																			' id="ns1blankspaceSetupPayrollTypeIncludeContainer-' + include.key + '">' +
																			'<input type="checkbox" style="margin-right:8px;"' +
																			($.grep(aIncludeIn, function (i) {return i.key == include.key}).length==0?'':' checked="checked"') +
																			' id="ns1blankspaceSetupPayrollTypeInclude-' + include.key + '"' +
																			' value="' + include.key + '" />' +
																			include.title + '</div>', {queue: 'type-edit'});
															}	
														});

														$vq.add('</td></tr>', {queue: 'type-edit'});

														$vq.init('<table class="ns1blankspaceColumn2"><tr><td>' +
																	'<span id="ns1blankspaceSetupPayrollTypeAdd" class="ns1blankspaceAction" style="width:65px;">New</span></td>' +
																	'</td></tr>', {queue: 'type-edit-actions'});

														$vq.add('<tr><td><span id="ns1blankspaceSetupPayrollTypeEditDelete" class="ns1blankspaceAction" style="width:65px;">Delete</span></td></tr>' +
																	'<tr><td class="ns1blankspaceSubNote" style="padding-top:8px;">Changes are saved automatically.</td></tr>' +
																	'</table>', {queue: 'type-edit-actions'});

														$vq.render('#ns1blankspacePayrollTypesColumn3', {queue: 'type-edit-actions'});

														$('#ns1blankspaceSetupPayrollTypeEditDelete').button()
														.click(function()
														{
															if (confirm('Are you sure you want to delete this type?'))
															{
																var oData = {id: oLineType.id, remove: 1}
															
																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_PAYROLL_LINE_TYPE_MANAGE'),
																	data: oData,
																	dataType: 'json',
																	success: function(data)
																	{
																		if (data.status == 'OK')
																		{	
																			ns1blankspace.status.message('Deleted');
																			ns1blankspace.setup.financial.payroll.data.linetypes = undefined
																			ns1blankspace.setup.financial.payroll.linetypes.show(oParam);
																		}	
																	}
																});
															}	
														});
													}

													$vq.add('</table>', {queue: 'type-edit'});

													$vq.render('#ns1blankspacePayrollTypesColumn2', {queue: 'type-edit'});
	
													$('#ns1blankspaceSetupPayrollTypeTitle').keyup(function()
													{
														ns1blankspace.setup.financial.payroll.data.editType = {id: iLineType, title: $('#ns1blankspaceSetupPayrollTypeTitle').val()}
													});

													$('#ns1blankspaceSetupPayrollTypeAdd').button()
														.click(function()
														{
															ns1blankspace.setup.financial.payroll.linetypes.add();
														});

													$('#ns1blankspaceSetupPayrollTypeTitle').val(oLineType.title);

													$('#ns1blankspacePayrollTypesColumn2 input').click(function ()
													{
														var sKey = this.id.split('-')[1];

														var oData = {id: oLineType.id}
														oData['includein' + sKey] = ($(this).prop('checked')?'Y':'N');
														oLineType['includein' + sKey] = oData['includein' + this.id.split('-')[1]]

														if ($(this).prop('checked') && sKey == 'leave' && oData['includeinleavetype'] == undefined)
														{
															oData['includeinleavetype'] = '1';
															oLineType['includeinleavetype'] = '1'
														}

														if ($(this).attr('data-dependant') == 'false')
														{	
															var aIncludeInOthers = $.grep(ns1blankspace.financial.payroll.util.linetypes.data, function (include)
																							{return include.selectable && !include.dependant && include.key != sKey})

															$.each(aIncludeInOthers, function (i, include)
															{
																oData['includein' + include.key] = 'N';
																oLineType['includein' + include.key] = 'N';
															});
														}	

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_PAYROLL_LINE_TYPE_MANAGE'),
															data: oData,
															dataType: 'json',
															success: function()
															{
																ns1blankspace.status.message('Pay type updated');
															}
														});
													});

													$('#ns1blankspaceSetupPayrollTypeTitle').focusout(function()
													{
														oLineType.title = ns1blankspace.setup.financial.payroll.data.editType.title;
														$('#ns1blankspaceSetupPayrollType-' + oLineType.id).text(oLineType.title);

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('SETUP_FINANCIAL_PAYROLL_LINE_TYPE_MANAGE'),
															data: ns1blankspace.setup.financial.payroll.data.editType,
															dataType: 'json',
															success: function(data)
															{
																if (data.status == 'OK')
																{
																	ns1blankspace.status.message('Pay type updated');
																}	
															}
														});	

													});
												}			
								}
				},

	save: 	{			
					send:		function ()
								{
									var sData = '_=1';
		
									ns1blankspace.status.working();

									if (ns1blankspace.objectContextData != undefined)
									{
										sData += '&id=' + ns1blankspace.objectContextData.id
									}

									if ($('#ns1blankspaceMainFinancialAccountDefault').html() != '')
									{
										sData += '&financialaccountcash=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialAccountCash').attr('data-id'));
										sData += '&financialaccountcreditors=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialAccountCreditors').attr('data-id'));
										sData += '&financialaccountdebtors=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialAccountDebtors').attr('data-id'));
										sData += '&financialaccountcurrentearnings=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialAccountCurrentProfit').attr('data-id'));
										sData += '&financialaccountretainedearnings=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialAccountRetainedProfit').attr('data-id'));
										sData += '&financialaccountpayable=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialAccountTaxLiabilities').attr('data-id'));
										sData += '&financialaccountcredits=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialAccountTaxCredits').attr('data-id'));
										sData += '&financialaccountemployee=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialAccountTaxPayroll').attr('data-id'));
										sData += '&financialaccountproductincome=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialAccountProductSales').attr('data-id'));
										sData += '&payrollfinancialaccounttax=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialAccountTaxPayroll').attr('data-id'));
									};

									if ($('#ns1blankspaceMainGeneral').html() != '')
									{
										sData += '&accrual=' + ns1blankspace.util.fs($('input[name="radioAccrual"]:checked').val());
										sData += '&calculationmethod=' + ns1blankspace.util.fs($('input[name="radioTaxationMethod"]:checked').val());
										sData += '&endoffinancialyear=' + ns1blankspace.util.fs($('#ns1blankspaceGeneralAccountingYear').val());
										sData += '&defaultinvoicesentvalue=' + ns1blankspace.util.fs($('input[name="radioDefaultInvoiceSentValue"]:checked').val());

										sData += '&lockeddatedebtors=' + ns1blankspace.util.fs($('#ns1blankspaceGeneralLockedDateDebtors').val());
										sData += '&lockeddatecreditors=' + ns1blankspace.util.fs($('#ns1blankspaceGeneralLockedDateCreditors').val());
										sData += '&lockeddatejournals=' + ns1blankspace.util.fs($('#ns1blankspaceGeneralLockedDateJournals').val());

										sData += '&notes=' + ns1blankspace.util.fs($('#ns1blankspaceGeneralNotes').val());
										sData += '&messagingaccount=' + ns1blankspace.util.fs($('#ns1blankspaceGeneralMessagingAccount').attr('data-id'));

									/*	if ($('#ns1blankspaceGeneralLockedDateDebtors').val() != ns1blankspace.objectContextData.lockeddatedebtors)
										{
											ns1blankspace.setup.financial.save.profile({attribute: 233, value: $('#ns1blankspaceGeneralLockedDateDebtors').val()})
										}

										if ($('#ns1blankspaceGeneralLockedDateCreditors').val() != ns1blankspace.objectContextData.lockeddatecreditors)
										{
											ns1blankspace.setup.financial.save.profile({attribute: 264, value: $('#ns1blankspaceGeneralLockedDateCreditors').val()})
										}

										if ($('#ns1blankspaceGeneralLockedDateJournals').val() != ns1blankspace.objectContextData.lockeddatejournals)
										{
											ns1blankspace.setup.financial.save.profile({attribute: 265, value: $('#ns1blankspaceGeneralLockedDateJournals').val()})
										}*/
									};
									
									if ($('#ns1blankspaceMainTax').html() != '')
									{
										sData += '&lockifincompletedtaxreport=' + ns1blankspace.util.fs($('input[name="radioTaxLock"]:checked').val());
										sData += '&frequency=' + ns1blankspace.util.fs($('input[name="radioTaxReportingFrequency"]:checked').val());
										sData += '&frequencyemployee=' + ns1blankspace.util.fs($('input[name="radioTaxPayrollReportingFrequency"]:checked').val());
										//sData += '&classicincludestax=' + ns1blankspace.util.fs($('input[name="radioTaxDefault"]:checked').val());

										//how set? ns1blankspace.setup.financial.save.profile({attribute: 528, value: $('#ns1blankspaceTaxExpenseDescription').val()});
										ns1blankspace.financial.data.settings.taxexpensedescription = $('#ns1blankspaceTaxExpenseDescription').val();
									};
									
									if ($('#ns1blankspaceMainPayroll').html() != '')
									{
										sData += '&payrollpayperiod=' + ns1blankspace.util.fs($('input[name="radioPeriodDefault"]:checked').val());
										sData += '&payrollsuperannuationcontactbusiness=' + ns1blankspace.util.fs($('#ns1blankspacePayrollSuperannuationBusiness').attr('data-id'));
										sData += '&payrollsuperannuationmonthlythreshold=' + ns1blankspace.util.fs($('#ns1blankspacePayrollSuperannuationMonthlyThreshold').val());

										//? payrollcreateexpeenses? sData += '&payrollfinancialsexpenseonly=' + ns1blankspace.util.fs($('input[name="radioPayrollFinancialsExpenseOnly"]:checked').val());
										
										//ns1blankspace.setup.financial.save.profile({attribute: 526, value: $('input[name="radioPayrollFinancialsExpenseOnly"]:checked').val()});
										//ns1blankspace.setup.financial.save.profile({attribute: 283, value: $('input[name="radioPayrollFinancialsPayments"]:checked').val()});
									};

									$.ajax(
									{
										type: 'POST',
										url: '/rpc/setup/?method=SETUP_FINANCIAL_SETTINGS_MANAGE',
										data: sData,
										dataType: 'json',
										success: function()
											{
												ns1blankspace.status.message('Saved');
												ns1blankspace.inputDetected = false;
												ns1blankspace.financial.data = undefined;
											}
									});		
								},

					profile: 	function (oParam)
								{
									//debtors: 233, creditors: 264, journals: 265

									/*var iAttribute = ns1blankspace.util.getParam(oParam, 'attribute').value;
									var sValue = ns1blankspace.util.getParam(oParam, 'value').value;

									var oData =
									{
										attribute: iAttribute,
										value: sValue,
										context: ns1blankspace.space
									}

									$.ajax(
									{
										type: 'POST',
										url: '/rpc/core/?method=CORE_PROFILE_MANAGE',
										data: oData,
										dataType: 'json'
									});*/
								}			
				}
}


