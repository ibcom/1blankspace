/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.setup.financial = 
{
	init: 		function ()
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = -1;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'financial';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Financials';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.financial.init({showHome: true});',
							move: false
							});	
					}	
						
					if (ns1blankspace.financial == undefined) {ns1blankspace.financial = {}}	
					ns1blankspace.financial.init();
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);

					ns1blankspace.financial.editor.init({height: "500px"});
				},

	home:		function interfaceSetupFinancialHomeShow(oResponse)
				{
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					
					var aHTML = [];
					var h = -1;
								
					aHTML[++h] = '<table>';
					aHTML[++h] = '<tr>' +
									'<td id="ns1blankspaceViewportFinancialLarge" class="ns1blankspaceViewportImageLarge">' +
									'&nbsp;' + 
									'</td>' +
									'</tr>';
					aHTML[++h] = '</table>';		
						
					aHTML[++h] = '<table>';
					
					aHTML[++h] = '<tr id="trInterfaceViewportControlSummary" class="interfaceViewportControl">' +
								'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
								'</tr>';	
					
					aHTML[++h] = '<tr id="trInterfaceViewportControlGeneral" class="interfaceViewportControl">' +
								'<td id="tdInterfaceViewportControlGeneral" class="interfaceViewportControl">General</td>' +
								'</tr>';	
								
					aHTML[++h] = '<tr id="trInterfaceViewportControlBankAccount" class="interfaceViewportControl">' +
								'<td id="tdInterfaceViewportControlBankAccount" class="interfaceViewportControl">Bank Accounts</td>' +
								'</tr>';	
					
					aHTML[++h] = '</table>';		
					
					aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
					
					aHTML[++h] = '<tr id="trInterfaceViewportControlFinancialAccount" class="interfaceViewportControl">' +
								'<td id="tdInterfaceViewportControlFinancialAccount" class="interfaceViewportControl">Accounts</td>' +
								'</tr>';
								
					aHTML[++h] = '<tr id="trInterfaceViewportControlFinancialAccountDefault" class="interfaceViewportControl">' +
								'<td id="tdInterfaceViewportControlFinancialAccountDefault" class="interfaceViewportControl">Defaults</td>' +
								'</tr>';	
					
					aHTML[++h] = '</table>';		
					
					aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
					
					aHTML[++h] = '<tr id="trInterfaceViewportControlInvoicing" class="interfaceViewportControl">' +
								'<td id="tdInterfaceViewportControlInvoicing" class="interfaceViewportControl">Invoicing</td>' +
								'</tr>';	
					
					aHTML[++h] = '<tr id="trInterfaceViewportControlInvoicingTemplate" class="interfaceViewportControl">' +
								'<td id="tdInterfaceViewportControlInvoicingTemplate" class="interfaceViewportControl">Template</td>' +
								'</tr>';	
					
					aHTML[++h] = '</table>';

					aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
					
					aHTML[++h] = '<tr id="trInterfaceViewportControlTax" class="interfaceViewportControl">' +
								'<td id="tdInterfaceViewportControlTax" class="interfaceViewportControl">Tax</td>' +
								'</tr>';	
					
					aHTML[++h] = '<tr id="trInterfaceViewportControlPayroll" class="interfaceViewportControl">' +
								'<td id="tdInterfaceViewportControlPayroll" class="interfaceViewportControl">Payroll</td>' +
								'</tr>';	
					
					aHTML[++h] = '</table>';			

					$('#divInterfaceViewportControl').html(aHTML.join(''));	
					
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainGeneral" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainBankAccount" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainFinancialAccount" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainFinancialAccountDefault" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainInvoicing" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainInvoicingTemplate" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainTax" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainPayroll" class="divInterfaceViewportMain"></div>';

					$('#divInterfaceMain').html(aHTML.join(''));
					
					$('#tdInterfaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
						interfaceSetupFinancialSummary();
					});
					
					$('#tdInterfaceViewportControlGeneral').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainGeneral");
						interfaceSetupFinancialGeneral();
					});
					
					$('#tdInterfaceViewportControlBankAccount').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainBankAccount");
						interfaceSetupFinancialBankAccount();
					});
					
					$('#tdInterfaceViewportControlFinancialAccount').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainFinancialAccount");
						interfaceSetupFinancialAccount();
					});
					
					$('#tdInterfaceViewportControlFinancialAccountDefault').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainFinancialAccountDefault");
						interfaceSetupFinancialFinancialAccountDefault();
					});
					
					$('#tdInterfaceViewportControlInvoicing').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainInvoicing");
						interfaceSetupFinancialInvoicing();
					});

					$('#tdInterfaceViewportControlInvoicingTemplate').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainInvoicingTemplate");
						interfaceSetupFinancialInvoicingTemplate();
					});
					
					$('#tdInterfaceViewportControlTax').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainTax");
						interfaceSetupFinancialTax();
					});
					
					$('#tdInterfaceViewportControlPayroll').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainPayroll");
						interfaceSetupFinancialPayroll();
					});
					
					$.ajax(
					{
						type: 'GET',
						url: '/ondemand/setup/setup.asp?method=SETUP_FINANCIAL_SETTINGS_SEARCH&all=1&includefinancialaccounttext=1',
						dataType: 'json',
						success: function(data) {
													ns1blankspace.objectContextData = data;
													interfaceSetupFinancialSummary();
												}
					});
				},

	summary:	function interfaceSetupFinancialSummary()
				{
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find settings.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMainSummary').html(aHTML.join(''));
					}
					else
					{		
						aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
						aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
									'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
										ns1blankspace.xhtml.loading +
										'</td>' +
										'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2x">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainSummary').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
						
						var sTaxMethod = (ns1blankspace.objectContextData.taxreportcalculationmethod == "1") ? "Cash" : "Accrual";
						
						aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTaxationMethod" class="interfaceMainSummary">Taxation Method</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryTaxationMethod" class="interfaceMainSummaryValue">' +
										sTaxMethod +
										'</td></tr>';
						
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;	
						
						aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2">';
						
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));
					}	
				},

	general:	function interfaceSetupFinancialGeneral()
				{
					var aHTML = [];
					var h = -1;
						
					if ($('#divInterfaceMainGeneral').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainGeneral').attr('onDemandLoading', '');
						
						aHTML[++h] = '<table id="tableInterfaceMainGeneral" class="interfaceMainDetails">';
						aHTML[++h] = '<tr id="trInterfaceMainFinancialGeneralRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainGeneralColumn1" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainGeneralColumn2" class="interfaceMainColumn2x">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainGeneral').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tableInterfaceMainGeneralColumn1" class="interfaceMain">';
					
						aHTML[++h] = '<tr id="trInterfaceMainDetailsTaxationMethod" class="interfaceMain">' +
										'<td id="tdInterfaceMainGeneralTaxationMethod" class="interfaceMain">' +
										'Taxation Method' +
										'</td></tr>' +
										'<tr id="trInterfaceMainGeneralTaxationMethod" class="interfaceMainText">' +
										'<td id="tdInterfaceMainGeneralTaxationMethodValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioTaxationMethod1" name="radioTaxationMethod" value="1"/>Cash' +
										'<br /><input type="radio" id="radioTaxationMethod2" name="radioTaxationMethod" value="2"/>Accrual' +
										'</td></tr>';
						
						aHTML[++h] = '<tr id="trInterfaceMainGeneralAccountingYear" class="interfaceMain">' +
										'<td id="tdInterfaceMainGeneralAccountingYear" class="interfaceMain">' +
										'Accounting Year' +
										'</td></tr>' +
										'<tr id="trInterfaceMainGeneralAccountingYearValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainGeneralAccountingYearValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainGeneralAccountingYear" class="inputInterfaceMainText">' +
										'</td></tr>';
																		
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainGeneralColumn1').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('[name="radioTaxationMethod"][value="' + ns1blankspace.objectContextData.taxreportcalculationmethod + '"]').attr('checked', true);	
							$('#inputInterfaceMainGeneralAccountingYear').val(ns1blankspace.objectContextData.endoffinancialyear);
						}

					}	
				},

	bankAccounts:
				function interfaceSetupFinancialBankAccount(oParam, oResponse)
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
							oSearch.addField('title,notes');
							oSearch.sort('title', 'asc');
							oSearch.rows = ns1blankspace.messaging.defaultRows;
							oSearch.getResults(function(data) {interfaceSetupFinancialBankAccount(oParam, data)});
						}
						else
						{

							var aHTML = [];
							var h = -1;
						
							aHTML[++h] = '<table id="tableInterfaceMainBankAccount" class="interfaceMain" style="width:100%">' +
									'<tr id="trInterfaceMainBankAccountRow1" class="interfaceMainRow1">' +
									'<td id="tdInterfaceMainBankAccountColumn1" style="width:250px;" class="interfaceMainColumn1">' +
									ns1blankspace.xhtml.loading +
									'</td>' +
									'<td id="tdInterfaceMainBankAccountColumn2" class="interfaceMainColumn2">' +
									'<span id="spanBankAccount_options_add" class="interfaceMainRowOptionsAdd" style="font-size:0.75em;">Add</span>'
									'</td>' +
									'</tr>' +
									'</table>';				
						
							$('#divInterfaceMainBankAccount').html(aHTML.join(''));
						
							var aHTML = [];
							var h = -1;
							
							if (oResponse.data.rows.length == 0)
							{
								aHTML[++h] = '<table>';
								aHTML[++h] = '<tr>';
								aHTML[++h] = '<td class="interfaceMainRowNothing">No bank accounts have been set up.</td>';
								aHTML[++h] = '</tr>';
								aHTML[++h] = '</table>';

								$('#tdInterfaceMainBankAccountColumn1').html(aHTML.join(''));
							}
							else
							{			
								var aHTML = [];
								var h = -1;
							
								aHTML[++h] = '<table id="tableSetupFinancialBankAccount" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
								aHTML[++h] = '<tbody>'
						
								$(oResponse.data.rows).each(function() 
								{
									aHTML[++h] = '<tr class="interfaceMainRow">';
									
									aHTML[++h] = '<td id="interfaceSetupFinancialBankAccount_Title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect bankaccount "' +
															' title="' + this.notes + '">' +
															this.title + '</td>';
														
									aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
									
									aHTML[++h] = '<span id="spanBankAccount_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
										
									aHTML[++h] = '</td>';				
																					
									aHTML[++h] = '</tr>'
								});
								
								aHTML[++h] = '</tbody></table>';
							}
							
							$('#tdInterfaceMainBankAccountColumn1').html(aHTML.join(''));

							$('.interfaceMainRowOptionsRemove').button(
							{
								text: false,
								icons: {
									primary: "ui-icon-close"
								}
							})
							.click(function() {
								$.extend(true, oParam, {step: 4, xhtmlElementID: this.id});
								interfaceSetupFinancialBankAccount(oParam);
							})
							.css('width', '15px')
							.css('height', '17px');

							$('#spanBankAccount_options_add').button(
							{
								text: "Add"
							})
							.click(function() {
								$.extend(true, oParam, {step: 2, xhtmlElementID: ""});
								interfaceSetupFinancialBankAccount(oParam);
							})
							.css('font-size', '0.75em')

							$('.bankaccount').click(function() {
								$.extend(true, oParam, {step: 2, xhtmlElementID: event.target.id});
								interfaceSetupFinancialBankAccount(oParam);
							})
						}	
					}

					if (iStep == 2)
					{	
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tableInterfaceMainBankAccount" class="interfaceMain">' +
								'<tr id="trInterfaceMainBankAccountRow1" class="interfaceMainRow1">' +
								'<td id="tdInterfaceMainBankAccountEditColumn1"  class="interfaceMainColumn1" style="width:300px;padding-right:15px;">' +
								ns1blankspace.xhtml.loading +
								'</td>' +
								'<td id="tdInterfaceMainBankAccountEditColumn2" class="interfaceMainColumn2">' +
								'</td>' +
								'</tr>' +
								'</table>';				
					
						$('#tdInterfaceMainBankAccountColumn2').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;

						aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
									
						aHTML[++h] = '<tr id="trInterfaceMainBankAccountTitle" class="interfaceMain">' +
										'<td id="tdInterfaceMainBankAccountTitle" class="interfaceMain">' +
										'Title' +
										'</td></tr>' +
										'<tr id="trInterfaceMainBankAccountTitleValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainBankAccountTitleValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainBankAccountTitle" class="inputInterfaceMainText">' +
										'</td></tr>';
						
						aHTML[++h] = '<tr id="trInterfaceMainBankAccountFinancialAccount" class="interfaceMain">' +
										'<td id="tdInterfaceMainBankAccountFinancialAccount" class="interfaceMain">' +
										'Financial Account' +
										'</td></tr>' +
										'<tr id="trInterfaceMainBankAccountFinancialAccountValue" class="interfaceMainSelect">' +
										'<td id="tdInterfaceMainBankAccountFinancialAccountValue" class="interfaceMainSelect">' +
										'<input id="inputInterfaceMainBankAccountFinancialAccount" class="inputInterfaceMainSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>';

						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainBankAccountEditColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em">';
								
						aHTML[++h] = '<tr id="trInterfaceMainBankAccountEditSave" class="interfaceMainAction">' +
										'<td id="tdInterfaceMainBankAccountEditSave" class="interfaceMainAction">' +
										'<span style="width:70px;" id="spanInterfaceMainBankAccountEditSave">Save</span>' +
										'</td></tr>';
										
						aHTML[++h] = '<tr id="trInterfaceMainBankAccountEditCancel" class="interfaceMainAction">' +
										'<td id="tdInterfaceMainBankAccountEditCancel" class="interfaceMainAction">' +
										'<span style="width:70px;" id="spanInterfaceMainBankAccountEditCancel">Cancel</span>' +
										'</td></tr>';
														
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainBankAccountEditColumn2').html(aHTML.join(''));
						
						$('#spanInterfaceMainBankAccountEditSave').button(
						{
							text: "Save"
						})
						.click(function() 
						{
							ns1blankspaceStatusWorking();

							var sData = 'id=' + ns1blankspace.util.fs(sID);
							sData += '&title=' + ns1blankspace.util.fs($('#inputInterfaceMainBankAccountTitle').val());
							sData += '&financialaccount=' + ns1blankspace.util.fs($('#inputInterfaceMainBankAccountFinancialAccount').attr("data-id"));

							$.ajax(
							{
								type: 'POST',
								url: '/ondemand/setup/?method=SETUP_FINANCIAL_BANK_ACCOUNT_MANAGE',
								data: sData,
								dataType: 'json',
								success: function() {
									$.extend(true, oParam, {step: 1});
									interfaceSetupFinancialBankAccount(oParam);
									ns1blankspaceStatus('Saved');
								}
							});
						})
						
						$('#spanInterfaceMainBankAccountEditCancel').button(
						{
							text: "Cancel"
						})
						.click(function() 
						{
							$.extend(true, oParam, {step: 1});
							interfaceSetupFinancialBankAccount(oParam);
						})

						if (sID != undefined)
						{
							ns1blankspaceStatusWorking();

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
							oSearch.addField('title,financialaccount,financialaccounttext');
							oSearch.addFilter('id', 'EQUAL_TO', sID);
							oSearch.getResults(function(data) {
									$.extend(true, oParam, {step: 3});
									interfaceSetupFinancialBankAccount(oParam, data)
									});
						}
						else
						{
						}
					}
						
					if (iStep == 3 && oResponse)
					{
						var oObjectContext = oResponse.data.rows[0];
						$('#inputInterfaceMainBankAccountTitle').val(oObjectContext.title);
						$('#inputInterfaceMainBankAccountTitle').focus();
						$('#inputInterfaceMainBankAccountFinancialAccount').val(oObjectContext.financialaccounttext)
						$('#inputInterfaceMainBankAccountFinancialAccount').attr('data-id', ns1blankspace.objectContextData.financialaccount);

						ns1blankspaceStatus('');
					}

					if (iStep == 4)
					{			
						var sParam = 'method=SETUP_FINANCIAL_BANK_ACCOUNT_MANAGE&remove=1';
						var sData = 'id=' + sID;
						
						$.ajax(
						{
							type: 'POST',
							url: '/ondemand/setup/?' + sParam,
							data: sData,
							dataType: 'json',
							success: function(data)
							{
								if (data.status == 'OK')
								{
									$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
									$.extend(true, oParam, {step: 1});
									interfaceSetupFinancialBankAccount(oParam);
									ns1blankspaceStatus('Saved');
								}
								else
								{
									ns1blankspaceError(data.error.errornotes);
								}
							}
						});
					}		
				},

	accounts: 	{
					tree: 		function interfaceSetupFinancialAccountTree()
								{
									var oAccounts = ns1blankspace.financial.accounts;

								  	$(ns1blankspace.financial.accounts).each(function(i,k) 
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

					show:		function interfaceSetupFinancialAccount(oParam, oResponse)
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
										var h = -1;	
														
										aHTML[++h] = '<table id="tableInterfaceMainAccount" class="interfaceMain">' +
													'<tr id="trInterfaceMainSetupAccountRow1" class="interfaceMainRow1">' +
													'<td id="tdInterfaceMainSetupAccountColumnType" style="width:100px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
														ns1blankspace.xhtml.loading + '</td>' +
													'<td id="tdInterfaceMainSetupAccountColumnList" style="width:200px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn2">' +
													'</td>' +
													'<td id="tdInterfaceMainSetupAccountColumnEdit" style="width:280px;padding-right:15px;font-size:0.875em;" class="interfaceMainColumn2">' +
													'</td>' +
													'<td id="tdInterfaceMainSetupAccountColumnAction" class="interfaceMainColumn2">' +
													'</td>' +
													'</tr>' +
													'</table>';				
												
										$('#divInterfaceMainFinancialAccount').html(aHTML.join(''));
										
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
											if (oResponse == undefined)
											{
												var oSearch = new AdvancedSearch();
												oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
												oSearch.addField('title,parentaccount,parentaccounttext,postable');
												//oSearch.addFilter('parentaccount', 'EQUAL_TO', ns1blankspace.financial.rootAccount);
												oSearch.rows = 200;
												oSearch.sort('title', 'asc');
												oSearch.getResults(function(data) {interfaceSetupFinancialAccount(oParam, data)})	
											}
											else
											{
												var aHTML = [];
												var h = -1;	
												
												ns1blankspace.financial.accounts = oResponse.data.rows;
												ns1blankspace.financial.rootAccounts =  $.grep(ns1blankspace.financial.accounts, function (a) { return a.parentaccount == ns1blankspace.financial.rootAccount; })
												interfaceSetupFinancialAccountTree(ns1blankspace.financial.rootAccount); 

												aHTML[++h] = '<table id="tableInterfaceMainAccountType" class="interfaceMain">' +
																'<tr class="interfaceMainRow">' +
																'<td id="tdInterfaceMainSetupFinancialAccountType-1-'+ 
																($.grep(ns1blankspace.financial.rootAccounts, function (a) { return (a.title).indexOf('Expense') != -1; }))[0].id +
																'" class="interfaceMainRow interfaceMainRowSelect type">' +
																'Expenses</td>' +
																'</tr>' +
																'<tr class="interfaceMainRow">' +
																'<td id="tdInterfaceMainSetupFinancialAccountType-2-' +
																($.grep(ns1blankspace.financial.rootAccounts, function (a) { return (a.title).indexOf('Revenue') != -1; }))[0].id +
																'" class="interfaceMainRow interfaceMainRowSelect type">' +
																'Revenue</td>' +
																'</tr>' +
																'<tr class="interfaceMainRow">' +
																'<td id="tdInterfaceMainSetupFinancialAccountType-3-' +
																($.grep(ns1blankspace.financial.rootAccounts, function (a) { return (a.title).indexOf('Asset') != -1; }))[0].id +
																'" class="interfaceMainRow interfaceMainRowSelect type">' +
																'Asset</td>' +
																'</tr>' +
																'<tr class="interfaceMainRow">' +
																'<td id="tdInterfaceMainSetupFinancialAccountType-4-' +
																($.grep(ns1blankspace.financial.rootAccounts, function (a) { return (a.title).indexOf('Liability') != -1; }))[0].id +
																'" class="interfaceMainRow interfaceMainRowSelect type">' +
																'Liability</td>' +
																'</tr>' +
																'<tr class="interfaceMainRow">' +
																'<td id="tdInterfaceMainSetupFinancialAccountType-5-' +
																($.grep(ns1blankspace.financial.rootAccounts, function (a) { return (a.title).indexOf('Equity') != -1; }))[0].id +
																'" class="interfaceMainRow interfaceMainRowSelect type">' +
																'Equity</td>' +
																'</tr>' +
																'</table>';					
														
												$('#tdInterfaceMainSetupAccountColumnType').html(aHTML.join(''));

												$('td.type').click(function(event)
												{
													var sXHTMLElementId = event.target.id;
													var aId = sXHTMLElementId.split('-');
													
													interfaceSetupFinancialAccount({type: aId[1], parentAccount: aId[2], step: 2});
												});
											}
										}	
									}	
									else if (iStep == 2)
									{

										ns1blankspace.financial.currentAccount = iParentAccount;

										if (oResponse == undefined)
										{
											$('#tdInterfaceMainSetupAccountColumnList').html(ns1blankspace.xhtml.loadingSmall);
											$('#tdInterfaceMainSetupAccountColumnEdit').html("");

											var aHTML = [];
											var h = -1;	
											
											aHTML[++h] = '<table id="tableInterfaceMainAccountColumnAction" class="interfaceMainColumn2">';
											aHTML[++h] = '<tr><td id="tdInterfaceMainAccountAdd" class="interfaceMainAction">' +
															'<span id="spanInterfaceMainAccountAdd">Add</span>' +
															'</td></tr>';
																			
											aHTML[++h] = '</table>';					
											
											$('#tdInterfaceMainSetupAccountColumnAction').html(aHTML.join(''));
										
											$('#spanInterfaceMainAccountAdd').button(
											{
												label: "Add"
											})
											.click(function()
											{
												$.extend(true, oParam, {step: 4, xhtmlElementID: ""});
												interfaceSetupFinancialAccount(oParam);
											})

											var oItems = $.grep(ns1blankspace.financial.accounts, function (a) { return a.parentaccount == iParentAccount; });
											interfaceSetupFinancialAccount(oParam, oItems);
										}
										else
										{
											var aHTML = [];
											var h = -1;
										
										
											var aHTML = [];
											var h = -1;
									
											aHTML[++h] = '<table id="tableSetupFinancialFinancialAccount" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
											aHTML[++h] = '<tbody>';
										
											if (($.grep(ns1blankspace.financial.rootAccounts, function (a) { return a.id == iParentAccount; })).length == 0)
											{
												aHTML[++h] = '<tr class="interfaceMainCaption">';
												aHTML[++h] = '<td class="interfaceMainCaption" colspan=2>' +
																'<div style="float:left;""><span id="spanInterfaceMainAccountParent-' +
																($.grep(ns1blankspace.financial.accounts, function (a) { return a.id == iParentAccount; }))[0].parentaccount +
																 '" class="interfaceMainRow interfaceMainRowOptionsParent">Add</span></div>' +
																'<div style="float:left;margin-left:3px;margin-top:3px;">' + ($.grep(ns1blankspace.financial.accounts, function (a) { return a.id == iParentAccount; }))[0].title
																+ '</div></td>';
												aHTML[++h] = '</tr>';
											}
											
											if (oResponse.length == 0)
											{
												aHTML[++h] = '<tr class="interfaceMainCaption">' +
																'<td class="interfaceMainRowNothing">No sub-accounts.</td></tr>';
												aHTML[++h] = '</tbody></table>';
											}
											else
											{		

												$(oResponse).each(function()
												{

													aHTML[++h] = '<tr class="interfaceMainRow">';
													
													if (this.postable == 'Y')
													{
														aHTML[++h] = '<td id="interfaceFinancialAccount_Title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect account"' +
																			' title="">' +
																			this.title + '</td>';
													}
													else
													{	
														aHTML[++h] = '<td style="font-weight:600;" id="interfaceFinancialAccount_Title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect account"' +
																			' title="">' +
																			this.title + '</td>';
													}						
															
													aHTML[++h] = '<td class="interfaceMainRow" style="width:20px;">' +
																			'<span id="spanInterfaceMainAccountChildren-' + this.id + '" class="interfaceMainRow' +
																			(this.postable != 'Y' ? ' interfaceMainRowOptionsChildren">Next' : '">') + '</span>' +
																			'</td>';						
																																
													aHTML[++h] = '</tr>'
									
													//aHTML[++h] = interfaceSetupFinancialAccountRow(this);
												});
											
												aHTML[++h] = '</tbody></table>';
											}
										
											$('#tdInterfaceMainSetupAccountColumnList').html(aHTML.join(''));
										
											$('.interfaceMainRowOptionsParent').button(
											{
												text: false,
												icons: {
													primary: "ui-icon-triangle-1-w"
												}
											})
											.click(function() {
												var aId = (this.id).split('-');
												$.extend(true, oParam, {step: 2, parentAccount: aId[1]});
												interfaceSetupFinancialAccount(oParam);
											})
											.css('width', '15px')
											.css('height', '17px');

											$('.interfaceMainRowOptionsChildren').button(
											{
												text: false,
												icons: {
													primary: "ui-icon-triangle-1-e"
												}
											})
											.click(function() {
												var aId = (this.id).split('-');
												$.extend(true, oParam, {step: 2, parentAccount: aId[1]});
												interfaceSetupFinancialAccount(oParam);
											})
											.css('width', '15px')
											.css('height', '17px');

											$('td.account').click(function()
											{
												$.extend(true, oParam, {step: 4, xhtmlElementID: event.target.id});
												interfaceSetupFinancialAccount(oParam);
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
									
										var aHTML = [];
										var h = -1;

										aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
													
										aHTML[++h] = '<tr id="trInterfaceMainAccountTitle" class="interfaceMain">' +
														'<td id="tdInterfaceMainAccountTitle" class="interfaceMain">' +
														'Title' +
														'</td></tr>' +
														'<tr id="trInterfaceMainAccountAddTitleValue" class="interfaceMainText">' +
														'<td id="tdInterfaceMainAccountAddTitleValue" class="interfaceMainText">' +
														'<input id="inputInterfaceMainAccountAddTitle" class="inputInterfaceMainText">' +
														'</td></tr>';
										

										aHTML[++h] = '<tr id="trInterfaceMainAccountParent" class="interfaceMain">' +
														'<td id="tdInterfaceMainAccountParent" class="interfaceMain">' +
														'Parent' +
														'</td></tr>' +
														'<tr id="trInterfaceMainAccountParentValue" class="interfaceMainSelect">' +
														'<td id="tdInterfaceMainAccountParentValue" class="interfaceMainSelect">' +
														'<input id="inputInterfaceMainAccountParentAccount" class="inputInterfaceMainSelect"' +
															' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
															' data-columns="title">' +
														'</td></tr>';

										aHTML[++h] = '<tr id="trInterfaceMainAccountPostable" class="interfaceMain">' +
															'<td id="tdInterfaceMainAccountPostable" class="interfaceMain">' +
															'Can transactions be linked to this account?' +
															'</td></tr>' +
															'<tr id="trInterfaceMainAccountPostable" class="interfaceMainText">' +
															'<td id="tdInterfaceMainAccountPostableValue" class="interfaceMainRadio">' +
															'<input type="radio" id="radioPostableY" name="radioPostable" value="Y"/>Yes' +
															'<br /><input type="radio" id="radioPostableN" name="radioPostable" value="N"/>No (it is a header account)' +
														'</td></tr>';

										aHTML[++h] = '</table>';					
										
										$('#tdInterfaceMainSetupAccountColumnEdit').html(aHTML.join(''));
										
										$('#inputInterfaceMainAccountAddTitle').focus();

										var aHTML = [];
										var h = -1;
									
										aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em">';
												
										aHTML[++h] = '<tr id="trInterfaceMainAccountAddSave" class="interfaceMainAction">' +
														'<td id="tdInterfaceMainAccountAddSave" class="interfaceMainAction">' +
														'<span style="width:70px;" id="spanInterfaceMainAccountEditSave">Save</span>' +
														'</td></tr>';
														
										aHTML[++h] = '<tr id="trInterfaceMainBankAccountEditCancel" class="interfaceMainAction">' +
															'<td id="tdInterfaceMainBankAccountEditCancel" class="interfaceMainAction">' +
															'<span style="width:70px;" id="spanInterfaceMainAccountEditCancel">Cancel</span>' +
															'</td></tr>';
																			
										aHTML[++h] = '</table>';					
											
										$('#tdInterfaceMainSetupAccountColumnAction').html(aHTML.join(''));
										
										$('#spanInterfaceMainAccountEditSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											ns1blankspaceStatusWorking();

											var sData = 'type=' + iType;
											sData += '&id=' + ns1blankspace.util.fs(sID);
											sData += '&title=' + ns1blankspace.util.fs($('#inputInterfaceMainAccountAddTitle').val());
											sData += '&parentaccount=' + ns1blankspace.util.fs($('#inputInterfaceMainAccountParentAccount').attr("data-id"));
											sData += '&postable=' + ns1blankspace.util.fs($('input[name="radioPostable"]:checked').val());

											var oAdd =
													{
														"items": [], 
														"title": $('#inputInterfaceMainAccountAddTitle').val(),
														"parentaccount": $('#inputInterfaceMainAccountParentAccount').attr("data-id"),
														"postable": $('input[name="radioPostable"]:checked').val()
													}

											$.ajax(
											{
												type: 'POST',
												url: '/ondemand/setup/setup.asp?method=SETUP_FINANCIAL_ACCOUNT_MANAGE',
												data: sData,
												dataType: 'json',
												success: function(data) {
													if (data.status == "OK")
													{
														ns1blankspaceStatus('Saved');

														$.extend(true, oAdd, {id: data.id});
														
														var bNew = true;

														$(ns1blankspace.financial.accounts).each(function(i) 
														{
															if (this.id == data.id) {ns1blankspace.financial.accounts[i] = oAdd; bNew = false}
														});

														if (bNew) {(ns1blankspace.financial.accounts).unshift(oAdd)}

														$.extend(true, oParam, {step: 2});
														interfaceSetupFinancialAccount(oParam)
													}
													else
													{
														ns1blankspaceError(data.error.errornotes);
													}
												}
											});
										});

										$('#spanInterfaceMainAccountEditCancel').button(
										{
											text: "Cancel"
										})
										.click(function() 
										{
											$.extend(true, oParam, {step: 2});
											interfaceSetupFinancialAccount(oParam);
										});

										$('#spanInterfaceMainAccountAdd').button(
											{
												label: "Add"
											})
											.click(function()
											{
												$.extend(true, oParam, {step: 4, xhtmlElementID: ""});
												interfaceSetupFinancialAccount(oParam);
											})

										if (sID != undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
											oSearch.addField('title,description,parentaccount,parentaccounttext,postable');
											oSearch.addFilter('id', 'EQUAL_TO', sID);
											oSearch.getResults(function(data) {
													$.extend(true, oParam, {step: 5});
													interfaceSetupFinancialAccount(oParam, data)
													});
										}
										else
										{
											$('#inputInterfaceMainAccountParentAccount').val(($.grep(ns1blankspace.financial.accounts, function (a) { return a.id == ns1blankspace.financial.currentAccount; })[0].title).formatXHTML());
											$('#inputInterfaceMainAccountParentAccount').attr('data-id', ns1blankspace.financial.currentAccount);
											$('[name="radioPostable"][value="Y"]').attr('checked', true);
										}
									}
									else if (iStep == 5)
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];
											$('#inputInterfaceMainAccountAddTitle').val((oObjectContext.title).formatXHTML());
											$('#inputInterfaceMainAccountParentAccount').val(($.grep(ns1blankspace.financial.accounts, function (a) { return a.id == oObjectContext.parentaccount; })[0].title).formatXHTML());
											$('#inputInterfaceMainAccountParentAccount').attr('data-id', oObjectContext.parentaccount);
											$('[name="radioPostable"][value="' + oObjectContext.postable + '"]').attr('checked', true);
										}
									}	
								}

					row:		function interfaceSetupFinancialAccountRow(oRow)
								{
									var aHTML = [];
									var h = -1;

									aHTML[++h] = '<tr class="interfaceMainRow">';
												
									aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Title-' + oRow.id + '" class="interfaceMainRow interfaceMainRowSelect account"' +
															' title="' + oRow.notes + '-' + oRow.items.length + '">' +
															oRow.title + '</td>';
																						
									aHTML[++h] = '</tr>'
									
									return aHTML.join('');
								}
				},

	accountDefaults:			
				function interfaceSetupFinancialFinancialAccountDefault()
				{
					var aHTML = [];
					var h = -1;
						
					if ($('#divInterfaceMainFinancialAccountDefault').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainFinancialAccountDefault').attr('onDemandLoading', '');
						
						aHTML[++h] = '<table id="tableInterfaceMainFinancialAccount" class="interfaceMainDetails">';
						aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainFinancialAccountColumn1" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainFinancialAccountColumn2" class="interfaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainFinancialAccountDefault').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
					
						aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountCash" class="interfaceMain">' +
										'<td id="tdInterfaceMainFinancialAccountCash" class="interfaceMain">' +
										'Cash' +
										'</td></tr>' +
										'<tr id="trInterfaceMainFinancialAccountCashValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainFinancialAccountCashValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainFinancialAccountCash" class="inputInterfaceMainSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>';
						
						aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountCreditors" class="interfaceMain">' +
										'<td id="tdInterfaceMainFinancialAccountCreditors" class="interfaceMain">' +
										'Creditors' +
										'</td></tr>' +
										'<tr id="trInterfaceMainFinancialAccountCreditorsValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainFinancialAccountCreditorsValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainFinancialAccountCreditors" class="inputInterfaceMainSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>';
										
						aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountDebitors" class="interfaceMain">' +
										'<td id="tdInterfaceMainFinancialAccountDebitors" class="interfaceMain">' +
										'Debitors' +
										'</td></tr>' +
										'<tr id="trInterfaceMainFinancialAccountDebitorsValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainFinancialAccountDebitorsValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainFinancialAccountDebitors" class="inputInterfaceMainSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>';
										
						aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountCurrentProfit" class="interfaceMain">' +
										'<td id="tdInterfaceMainFinancialAccountCurrentProfit" class="interfaceMain">' +
										'Current Profit' +
										'</td></tr>' +
										'<tr id="trInterfaceMainFinancialAccountCurrentProfitValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainFinancialAccountCurrentProfitValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainFinancialAccountCurrentProfit" class="inputInterfaceMainSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>';	
										
						aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
										'<td id="tdInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
										'Retained Profit' +
										'</td></tr>' +
										'<tr id="trInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainFinancialAccountRetainedProfit" class="inputInterfaceMainText"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>';
										
						aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
										'<td id="tdInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
										'Tax Liabilities' +
										'</td></tr>' +
										'<tr id="trInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainFinancialAccountRetainedProfit" class="inputInterfaceMainSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>';																				
														
						aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
										'<td id="tdInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
										'Tax Credits' +
										'</td></tr>' +
										'<tr id="trInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainFinancialAccountRetainedProfit" class="inputInterfaceMainSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>';

						aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
										'<td id="tdInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
										'Tax Payroll' +
										'</td></tr>' +
										'<tr id="trInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainFinancialAccountRetainedProfit" class="inputInterfaceMainSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>';
										
						/*
						aHTML[++h] = '<tr id="trInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
										'<td id="tdInterfaceMainFinancialAccountRetainedProfit" class="interfaceMain">' +
										'Tax Instalments' +
										'</td></tr>' +
										'<tr id="trInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainFinancialAccountRetainedProfitValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainFinancialAccountRetainedProfit" class="inputInterfaceMainText">' +
										'</td></tr>';
						*/
																		
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainFinancialAccountColumn1').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputInterfaceMainFinancialAccountCash').val(ns1blankspace.objectContextData.financialaccountcashtext);
							$('#inputInterfaceMainFinancialAccountCash').attr("data-id", ns1blankspace.objectContextData.financialaccountcash);
							$('#inputInterfaceMainFinancialAccountCreditors').val(ns1blankspace.objectContextData.financialaccountcreditortext);
							$('#inputInterfaceMainFinancialAccountCreditors').attr("data-id", ns1blankspace.objectContextData.financialaccountcreditor);
							$('#inputInterfaceMainFinancialAccountDebitors').val(ns1blankspace.objectContextData.financialaccountdebitortext);
							$('#inputInterfaceMainFinancialAccountDebitors').attr("data-id", ns1blankspace.objectContextData.financialaccountdebitor);
							$('#inputInterfaceMainFinancialAccountCurrentProfit').val(ns1blankspace.objectContextData.financialaccountcurrentearningstext);
							$('#inputInterfaceMainFinancialAccountCurrentProfit').attr("data-id", ns1blankspace.objectContextData.financialaccountcurrentearnings);
							$('#inputInterfaceMainFinancialAccountRetainedProfit').val(ns1blankspace.objectContextData.financialaccountretainedearningstext);
							$('#inputInterfaceMainFinancialAccountRetainedProfit').attr("data-id", ns1blankspace.objectContextData.financialaccountretainedearnings);
						}
					}	
				},

	invoicing:	function interfaceSetupFinancialInvoicing()
				{
					var aHTML = [];
					var h = -1;
						
					if ($('#divInterfaceMainInvoicing').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainInvoicing').attr('onDemandLoading', '');
						
						aHTML[++h] = '<table id="tableInterfaceMainInvoicing" class="interfaceMainDetails">';
						aHTML[++h] = '<tr id="trInterfaceMainFinancialInvoicingRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainInvoicingColumn1" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainInvoicingColumn2" class="interfaceMainColumn2x">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainInvoicing').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tableInterfaceMainInvoicingColumn1" class="interfaceMain">';
					
						aHTML[++h] = '<tr id="trInterfaceMainInvoicingPaymentTermsNotes" class="interfaceMain">' +
										'<td id="tdInterfaceMainInvoicingPaymentTermsNotes" class="interfaceMain">' +
										'Payment Term Notes' +
										'</td></tr>' +
										'<tr id="trInterfaceMainInvoicingPaymentTermsNotesValue" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainInvoicingPaymentTermsNotesValue" class="interfaceMainTextMulti">' +
										'<textarea rows="3" cols="35" id="inputInterfaceMainInvoicingPaymentTermsNotes" class="inputInterfaceMainTextMultiSmall"></textarea>' +
										'</td></tr>';
						
						aHTML[++h] = '</table>';	
						
						$('#tdInterfaceMainInvoicingColumn1').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							//$('[name="radioLock"][value="' + ns1blankspace.objectContextData.taxlock + '"]').attr('checked', true);
						}
						else
						{
							//$('[name="radioLock"][value="Y"]').attr('checked', true);			
						}
					}	
				},

	invoiceTemplate:
				{
					show: 		function interfaceSetupFinancialInvoicingTemplate()
								{
									var aHTML = [];
									var h = -1;
									
									if ($('#divInterfaceMainInvoicingTemplate').attr('onDemandLoading') == '1')
									{
										$('#divInterfaceMainInvoicingTemplate').attr('onDemandLoading', '');
												
										for (edId in tinyMCE.editors) 
													tinyMCE.editors[edId].destroy(true);
												
										ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;		
												
										aHTML[++h] = '<table class="interfaceMain">';
										aHTML[++h] = '<tr id="trInterfaceMainEditRow1" class="interfaceMain">' +
														'<td id="tdInterfaceMainInvoicingTemplateColumn1" class="interfaceMain">' +
														'</td>' +
														'<td id="tdInterfaceMainInvoicingTemplateColumn2" style="width:100px;">' +
														'</td>' +
														'</tr>';
										aHTML[++h] = '</table>';					
										
										$('#divInterfaceMainInvoicingTemplate').html(aHTML.join(''));
										
										var aHTML = [];
										var h = -1;

										aHTML[++h] = '<table>';
															
										aHTML[++h] = '<tr><td class="interfaceMainCaption" style="font-size:0.75em;">Tags</td</tr>';

										$.each(gaFormatTags, function()
										{
											if (this.object == 5 && this.type == 1)
											{
												aHTML[++h] = '<tr><td class="interfaceMainRow interfaceMainRowSelect" style="font-size:0.75em;">';

												aHTML[++h] = '<span id="spanInterfaceFormatTag_' + (this.caption).replace(/ /g,'-') + '"' +
														  		 ' class="interfaceFormatTags" ' +
														   		' data-caption="[[' + (this.caption) + ']]" style="cursor: pointer;">' + this.caption + '</span>';

												aHTML[++h] = '</td></tr>';		   		
											}				
										});

										$.each(gaFormatTags, function()
										{
											if (this.object == 5 && this.type == 2)
											{
												aHTML[++h] = '<tr><td class="interfaceMainRow interfaceMainRowSelect" style="font-size:0.75em;">';

												aHTML[++h] = '<span id="spanInterfaceFormatTag_' + (this.caption).replace(/ /g,'-') + '"' +
														  		 ' class="interfaceFormatTags" ' +
														   		' data-caption="[[' + (this.caption) + ']]" style="cursor: pointer;">' + this.caption + '</span>';

												aHTML[++h] = '</td></tr>';		   		
											}				
										});
														
										aHTML[++h] = '</table>';			

										$('#tdInterfaceMainInvoicingTemplateColumn2').html(aHTML.join(''));

										var aHTML = [];
										var h = -1;
									
										aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
												
										aHTML[++h] = '<tr>' +
														'<td>' +
														'<textarea rows="30" cols="50" id="inputInterfaceMainInvoicingTemplateText' +
																	ns1blankspace.counter.editor + '" editorcount="' + ns1blankspace.counter.editor + '" class="inputInterfaceMainTextMulti"></textarea>' +
														'</td></tr>';
														
										aHTML[++h] = '</table>';					
										
										$('#tdInterfaceMainInvoicingTemplateColumn1').html(aHTML.join(''));
										
										if (ns1blankspace.financial.invoiceTemplateXHTML == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'DOCUMENT_SEARCH';
											oSearch.addField('title,content');
											oSearch.addFilter('type', 'EQUAL_TO', 11);

											oSearch.getResults(function(data)
											{
												var oResponse = data;

												if (oResponse.data.rows.length == 0)
												{
													ns1blankspace.financial.invoiceTemplateXHTML = '';

													if (ns1blankspace.financial.defaultInvoiceTemplateXHTML)
													{
														$.ajax(
														{
															type: 'GET',
															url: ns1blankspace.financial.defaultInvoiceTemplateXHTML,
															dataType: 'text',
															async: false,
															success: function(data)
															{
																ns1blankspace.financial.invoiceTemplateXHTML = data;
															}	
														});
													}	
												}
												else
												{
													ns1blankspace.financial.invoiceTemplateXHTML = (oResponse.data.rows[0].content).formatXHTML();
													ns1blankspace.financial.invoiceTemplateDocumentID = oResponse.data.rows[0].id;
												}

												$('#inputInterfaceMainInvoicingTemplateText' + ns1blankspace.counter.editor).val(ns1blankspace.financial.invoiceTemplateXHTML);

												if (ns1blankspace.option.richTextEditing)
												{
													tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainInvoicingTemplateText' + ns1blankspace.counter.editor);
												}	
											});		
										}
										else
										{
											$('#inputInterfaceMainInvoicingTemplateText' + ns1blankspace.counter.editor).val(ns1blankspace.financial.invoiceTemplateXHTML);



											tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainInvoicingTemplateText' + ns1blankspace.counter.editor);	
										}
									
										$('.interfaceFormatTags')
										.hover( function()
										{	
											oMCEBookmark = tinyMCE.get('inputInterfaceMainInvoicingTemplateText' + ns1blankspace.counter.editor).selection.getBookmark({type: 1, normalized: true});
										})
										.click( function()
										{
											ns1blankspaceEditorAddTag({xhtmlElementID: this.id,
																		  editorID: 'inputInterfaceMainInvoicingTemplateText' + ns1blankspace.counter.editor, 
																		  mceBookmark: oMCEBookmark})
										})
									}


					save:		function interfaceSetupFinancialSaveTemplate()
								{
									ns1blankspaceStatusWorking();

									var sData = 'id=' + (ns1blankspace.financial.invoiceTemplateDocumentID ? ns1blankspace.financial.invoiceTemplateDocumentID : '');
									sData += '&content=' + encodeURIComponent(tinyMCE.get('inputInterfaceMainInvoicingTemplateText' + ns1blankspace.counter.editor).getContent());
									sData += '&type=10';
									sData += '&title=' + ns1blankspace.util.fs('Invoice Template');

									$.ajax(
									{
										type: 'POST',
										url: '/ondemand/document/?method=DOCUMENT_MANAGE',
										data: sData,
										dataType: 'json',
										success: function(data)
											{
												ns1blankspaceStatus('Saved');
												ns1blankspace.financial.invoiceTemplateXHTML = tinyMCE.get('inputInterfaceMainInvoicingTemplateText' + ns1blankspace.counter.editor).getContent();
												if(ns1blankspace.financial.invoiceTemplateDocumentID == undefined) {ns1blankspace.financial.invoiceTemplateDocumentID = data.id};
											}
									});		

								}	
				},

	tax: 		function interfaceSetupFinancialTax()
				{
					var aHTML = [];
					var h = -1;
						
					if ($('#divInterfaceMainTax').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainTax').attr('onDemandLoading', '');
						
						aHTML[++h] = '<table id="tableInterfaceMainTax" class="interfaceMainDetails">';
						aHTML[++h] = '<tr id="trInterfaceMainFinancialTaxRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainTaxColumn1" class="interfaceMainColumn1x">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainTax').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tableInterfaceMainTaxColumn1" class="interfaceMain">';
					
						aHTML[++h] = '<tr id="trInterfaceMainTaxLock" class="interfaceMain">' +
										'<td id="tdInterfaceMainTaxLock" class="interfaceMain">' +
										'Lock transactions if in completed tax period.' +
										'</td></tr>' +
										'<tr id="trInterfaceMainGeneralTaxLock" class="interfaceMainText">' +
										'<td id="tdInterfaceMainGeneralTaxLockValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioTaxLockY" name="radioTaxLock" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioTaxLockN" name="radioTaxLock" value="N"/>No' +
										'</td></tr>';
										
						aHTML[++h] = '<tr id="trInterfaceMainTaxDefault" class="interfaceMain">' +
										'<td id="tdInterfaceMainTaxDefault" class="interfaceMain">' +
										'Includes tax default' +
										'</td></tr>' +
										'<tr id="trInterfaceMainGeneralTaxDefault" class="interfaceMainText">' +
										'<td id="tdInterfaceMainGeneralTaxDefaultValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioTaxDefaultY" name="radioTaxDefault" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioTaxDefaultN" name="radioTaxDefault" value="N"/>No' +
										'</td></tr>';
							
						aHTML[++h] = '<tr id="trInterfaceMainTaxReportingFrequency" class="interfaceMain">' +
										'<td id="tdInterfaceMainTaxReportingFrequency" class="interfaceMain">' +
										'Value Added Tax Reporting Frequencies (eg GST)' +
										'</td></tr>' +
										'<tr id="trInterfaceMainGeneralTaxTaxReportingFrequency" class="interfaceMainText">' +
										'<td id="tdInterfaceMainGeneralTaxReportingFrequencyValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioTaxReportingFrequency4" name="radioTaxReportingFrequency" value="4"/>Never' +
										'<br /><input type="radio" id="radioTaxReportingFrequency1" name="radioTaxReportingFrequency" value="1"/>Monthly' +
										'<br /><input type="radio" id="radioTaxReportingFrequency2" name="radioTaxReportingFrequency" value="2"/>Quarterly' +
										'<br /><input type="radio" id="radioTaxReportingFrequency3" name="radioTaxReportingFrequency" value="3"/>Annually' +
										'</td></tr>';
						
						aHTML[++h] = '<tr id="trInterfaceMainTaxPayrollReportingFrequency" class="interfaceMain">' +
										'<td id="tdInterfaceMainTaxPayrollReportingFrequency" class="interfaceMain">' +
										'Payroll Tax Reporting Frequencies' +
										'</td></tr>' +
										'<tr id="trInterfaceMainGeneralTaxPayrollReportingFrequency" class="interfaceMainText">' +
										'<td id="tdInterfaceMainGeneralTaxPayrollReportingFrequencyValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioTaxPayrollReportingFrequency4" name="radioTaxPayrollReportingFrequency" value="4"/>Never' +
										'<br /><input type="radio" id="radioTaxPayrollReportingFrequency1" name="radioTaxPayrollReportingFrequency" value="1"/>Monthly' +
										'<br /><input type="radio" id="radioTaxPayrollReportingFrequency2" name="radioTaxPayrollReportingFrequency" value="2"/>Quarterly' +
										'<br /><input type="radio" id="radioTaxPayrollReportingFrequency3" name="radioTaxPayrollReportingFrequency" value="3"/>Annually' +
										'</td></tr>';
						
						/*	
						aHTML[++h] = '<tr id="trInterfaceMainTaxBusinessReportingFrequency" class="interfaceMain">' +
										'<td id="tdInterfaceMainTaxBusinessReportingFrequency" class="interfaceMain">' +
										'Business Tax Reporting Frequencies' +
										'</td></tr>' +
										'<tr id="trInterfaceMainGeneralTaxBusinessReportingFrequency" class="interfaceMainText">' +
										'<td id="tdInterfaceMainGeneralTaxBusinessReportingFrequencyValue" class="interfaceMainText">' +
										'<input type="radio" id="radioTaxBusinessReportingFrequency4" name="radioTaxPayrollReportingFrequency" value="4"/>Never' +
										'<br /><input type="radio" id="radioTaxBusinessReportingFrequency1" name="radioTaxBusinessReportingFrequency" value="1"/>Monthly' +
										'<br /><input type="radio" id="radioTaxBusinessReportingFrequency2" name="radioTaxBusinessReportingFrequency" value="2"/>Quarterly' +
										'<br /><input type="radio" id="radioTaxBusinessReportingFrequency3" name="radioTaxBusinessReportingFrequency" value="3"/>Annually' +
										'</td></tr>';
						*/				
																																						
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainTaxColumn1').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('[name="radioTaxLock"][value="' + ns1blankspace.objectContextData.lockifincompletedtaxreport + '"]').attr('checked', true);
							$('[name="radioTaxReportingFrequency"][value="' + ns1blankspace.objectContextData.taxreportfrequency + '"]').attr('checked', true);
							$('[name="radioTaxPayrollReportingFrequency"][value="' + ns1blankspace.objectContextData.taxreportfrequencyemployee + '"]').attr('checked', true);
							$('[name="radioTaxDefault"][value="' + ns1blankspace.objectContextData.classicincludestax + '"]').attr('checked', true);	
						}
					}	
				},

	payroll:	function interfaceSetupFinancialPayroll()
				{
					var aHTML = [];
					var h = -1;
						
					if ($('#divInterfaceMainPayroll').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainPayroll').attr('onDemandLoading', '');
						
						aHTML[++h] = '<table id="tableInterfaceMainPayroll" class="interfaceMainDetails">';
						aHTML[++h] = '<tr id="trInterfaceMainFinancialPayrollRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainPayrollColumn1" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainPayrollColumn2" class="interfaceMainColumn2x">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainPayroll').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tableInterfaceMainPayrollColumn1" class="interfaceMain">';
					
						aHTML[++h] = '<tr id="trInterfaceMainPayrollPeriodDefault" class="interfaceMain">' +
										'<td id="tdInterfaceMainPayrollPeriodDefault" class="interfaceMain">' +
										'Default Pay Period.' +
										'</td></tr>' +
										'<tr id="trInterfaceMainPeriodDefault class="interfaceMainText">' +
										'<td id="tdInterfaceMainPeriodDefaultValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioPeriodDefault1" name="radioPeriodDefault" value="1"/>Weekly' +
										'<br /><input type="radio" id="radioPeriodDefault2" name="radioPeriodDefault" value="2"/>Fortnightly' +
										'<br /><input type="radio" id="radioPeriodDefault3" name="radioPeriodDefault" value="3"/>Monthly' +
										'<br /><input type="radio" id="radioPeriodDefault4" name="radioPeriodDefault" value="4"/>Bi-Monthly' +
										'</td></tr>';			
												
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainPayrollColumn1').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('[name="radioPeriodDefault"][value="' + ns1blankspace.objectContextData.payrollpayperiod + '"]').attr('checked', true);
						}
					}	
				},

	save: 		{			
					send:		function interfaceSetupFinancialSave()
								{
									var sParam = 'method=SETUP_FINANCIAL_SETTINGS_MANAGE';
									var sData = '_=1';
									
									ns1blankspaceStatusWorking();

									if ($('#divInterfaceMainFinancialAccount').html() != '')
									{
										sData += '&financialaccountcash=' + encodeURIComponent($('#inputInterfaceMainFinancialAccountCash').attr('data-id'));
										sData += '&financialaccountcreditor=' + encodeURIComponent($('#inputInterfaceMainFinancialAccountCreditors').attr('data-id'));
										sData += '&financialaccountdebitor=' + encodeURIComponent($('#inputInterfaceMainFinancialAccountDebitors').attr('data-id'));
										sData += '&financialaccountcurrentearnings=' + encodeURIComponent($('#inputInterfaceMainFinancialAccountCurrentProfit').attr('data-id'));
										sData += '&financialaccountretainedearnings=' + encodeURIComponent($('#inputInterfaceMainFinancialAccountRetainedProfit').attr('data-id'));		
									};

									if ($('#divInterfaceMainGeneral').html() != '')
									{
										sData += '&lockifincompletedtaxreport=' + $('input[name="radioTaxationMethod"]:checked').val();
										sData += '&endoffinancialyear=' + $('input[name="inputInterfaceMainGeneralAccountingYear"]:checked').val();
									};
									
									if ($('#divInterfaceMainTax').html() != '')
									{
										sData += '&lockifincompletedtaxreport=' + $('input[name="radioTaxLock"]:checked').val();
										sData += '&taxreportfrequency=' + $('input[name="radioTaxReportingFrequency"]:checked').val();
										sData += '&taxreportfrequencyemployee=' + $('input[name="radioTaxPayrollReportingFrequency"]:checked').val();
										sData += '&classicincludestax=' + $('input[name="radioTaxDefault"]:checked').val();
									};
									
									if ($('#divInterfaceMainPayroll').html() != '')
									{
										sData += '&payrollpayperiod=' + $('input[name="radioPeriodDefault"]:checked').val();
									};
									
									$.ajax(
									{
										type: 'POST',
										url: '/ondemand/setup/setup.asp?' + sParam,
										data: sData,
										dataType: 'json',
										success: function()
											{
												ns1blankspaceStatus('Saved');

												if ($('#divInterfaceMainInvoicingTemplate').html() != '') {interfaceSetupFinancialSaveTemplate()}

											}
									});		
								}
				},
}
