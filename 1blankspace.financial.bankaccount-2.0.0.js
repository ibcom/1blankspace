/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.financial.bankAccount = 
{
	init: 		function interfaceFinancialBankAccountMasterViewport(oParam)
				{
					ns1blankspace.financial.init();
					
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = -1;
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectName = 'financial.bankaccount';
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Bank Accounts';
					
					if (bShowHome)
					{
						ns1blankspaceViewportDestination({
							newDestination: 'interfaceFinancialBankAccountMasterViewport({showHome: true});',
							move: false
							})		
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
				},

	home: 		function ()
				{	
					var aHTML = [];
					
					aHTML.push('<table><tr><td id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr></table>';		
					
					$('#ns1blankspaceControl').html(aHTML.join(''));	

					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					
					var aHTML = [];
								
					aHTML.push('<table id="ns1blankspaceMostLikely" class="ns1blankspace">');

					$.each(ns1blankspace.financial.bankaccounts, function()
					{
						aHTML.push('<tr class="ns1blankspaceRow">' +
										'<td id="ns1blankspaceBankAccount_title-' + this.id + '" class="ns1blankspaceMostLikely" style="width:150px;">' +
										this["title"] + '</td>' + 
										'<td id="ns1blankspaceBankAccount_lastreconcileddate-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;text-align:right;">' +
										this.lastreconcileddate + '</td>' +
										'<td id="ns1blankspaceBankAccount_lastreconciledamount-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;text-align:right;">' +
										'$' + this.lastreconciledamount + '</td>' + 	
										'<td>&nbsp;</td></tr>');
					});
					
					aHTML.push('</table>');
		
					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('.ns1blankspaceMostLikely').click(function(event) {
						var aID = (event.target.id).split('-');
						ns1blankspace.financial.bankAccount.show({id: aID[1]});
					});
				},

	layout: 	function ()
				{	
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">Summary</td>' +
									'</tr>');
					
					aHTML.push('</table>');
					
					aHTML.push('<table class="ns1blankspaceControl">');
								
					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlImport" class="ns1blankspaceControl">Import</td>' +
									'</tr>';
					
					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlReconcile" class="ns1blankspaceControl">Reconcile</td>' +
									'</tr>';

					aHTML.push('</table>');					
							
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainImport" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainReconcile" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceControlMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainSummary'});
						ns1blankspace.financial.bankAccount.Summary();
					});
					
					$('#ns1blankspaceControlImport').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainImport'});
						ns1blankspace.financial.bankAccount.import();
					});
					
					$('#ns1blankspaceControlReconcile').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainReconcile', refresh: true});
						ns1blankspace.financial.bankAccount.reconcile();
					});
				},

	show: 		function (oParam, oResponse)
				{
					if (oParam != undefined)
					{
						if (oParam.id != undefined) {ns1blankspace.objectContext = oParam.id}	
					}
					
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.financial.bankAccount.layout();
					
					ns1blankspace.objectContextData == undefined;
					ns1blankspace.objectContextData = ($.grep(ns1blankspace.financial.bankaccounts, function (a) { return a.id == ns1blankspace.objectContext; }))[0];
					
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the bank account.</td></tr></table>');
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						$('#ns1blankspaceViewControlAction').button({disabled: false});
							
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title +
							'<br /><span class="ns1blankspaceSubContext" id="ns1blankspaceControlSubContext_date">' + ns1blankspace.objectContextData.lastreconcileddate + '</span>' +
							'<br /><span class="ns1blankspaceSubContext" id="ns1blankspaceControlSubContext_amount">$' + ns1blankspace.objectContextData.lastreconciledamount + '</span>');
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.financial.bankAccount.init({showHome: false});ns1blankspace.financial.bankAccount.show({id: ' + ns1blankspace.objectContext + '})',
							move: false
							})
					
						ns1blankspace.history.object({functionDefault: 'ns1blankspace.financial.bankAccount.summary()'});
					}		
				},

	summary:	function (oParam, oResponse)
				{
					var aHTML = [];

					aHTML.push('<table class="ns1blankspace"><tbody>' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:100px;"></td>' +
									'</tr>' +
									'</tbody></table>');				
						
					$('#ns1blankspaceMainSummary').html(aHTML.join(''));

					var aHTML = [];
				
					aHTML.push('<table class="ns1blankspace">' +
									'<tr><td class="ns1blankspace">' +
									'This bank account was last reconciled on the ' +
									 ns1blankspace.objectContextData.lastreconcileddate + '.' +
									'</td></tr></table>');					

					$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
					
					var aHTML = [];
					
					aHTML.push('<table cellpadding=6>' +
									'<tr><td class="ns1blankspaceSummary" colspan=2>You have a number of options when reconciling a bank account.</td></tr>' + 
									'<tr><td class="ns1blankspaceSummary" style="width:15px;padding-bottom:10px;">1</td><td class="ns1blankspaceSub">' +
									'Use a printed or PDF bank statement directly.  In this case you skip the import step and go straight to reconcile.' +
									' You can then add a reconilication - selecting the date you want to balance up to.  You then search the system for matching payments or receipts that have already been entered or if not, add them as you go.' +
									'</td></tr>' + 
									'<tr><td class="ns1blankspaceSummary" style="width:15px;">2</td><td class="ns1blankspaceSub">' +
									'You export a file from your internet banking and then import it.' +
									'  You can then add a reconilication - selecting the date you want to balance up to.  The system will then help you then search the system for matching payments or receipts that have already been entered, based on these transactions or if not, add them as you go.' +
									'</td></tr>' + 
									'</table>');
					
					$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''))	
				},

	reconcile: 	{
					show: 		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
										oSearch.addField('statementbalance,statementdate,statustext,status');
										oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.sort('statementdate', 'desc');
										oSearch.rows = 12;
										oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.show(oParam, data)});
									}
									else
									{
										var aHTML = [];

										aHTML.push('<table class="interfaceMain">' +
														'<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceBankAccountColumnReco1" style="width: 85px;padding-right:5px;font-size:0.875em;" class="ns1blankspaceColumn1">' +
														ns1blankspace.xhtml.loading +
														'</td>' +
														'<td id="ns1blankspaceBankAccountColumnReco2" class="interfaceMainColumn2">' +
														'</td>' +
														'</tr>' +
														'</table>';				
										
										$('#ns1blankspaceMainReconcile').html(aHTML.join(''));
												
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td style="font-size:0.75em;">' +
															'<span id="ns1blankspaceBankAccountRecoAdd">Add</span>' +
															'</td></tr></table>';
											
											$('#ns1blankspaceBankAccountColumnReco1').html(aHTML.join(''));	
										}
										else
										{		
											aHTML.push('<table class="ns1blankspace">');
											
											var oRows = oResponse.data.rows;
											
											$(oRows).each(function(i) 
											{
												if (i==0)
												{
													if (this.status == 2)
													{
														aHTML.push('<tr><td style="font-size:0.75em;"><span id="ns1blankspaceBankAccountRecoAdd">Add</span></td></tr>';
													}
												}
												
												aHTML.push(ns1blankspace.financial.bankAccount.reconcile.row(this));
											});
											
											aHTML.push('</table>');
											
											$('#ns1blankspaceBankAccountColumnReco1').html(aHTML.join(''));
										}
										
										$('#ns1blankspaceBankAccountRecoAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											 ns1blankspace.financial.bankAccount.reconcile.edit()
										})
										.css("width", "75px");
										
										$('.ns1blankspaceBankAccountReconcileRowSelect').click(function()
										{
											var aID = (event.target.id).split('-');
											ns1blankspace.financial.bankAccount.reconcile.items.show({reconciliation: aID[1]});
										});
									}
								},

					row:		function (oRow)
								{
									var aHTML = [];
								
									aHTML.push('<tr class="ns1blankspaceRow">');
										
									if (oRow.status == 2)
									{			
										aHTML.push('<td id="ns1blankspaceFinancialBankAccountReconcile_title-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceBankAccountReconcileRowSelect"' +
														' style="text-align:right;">' +
														'<span id="ns1blankspaceFinancialBankAccountReconcile_date-' +
														oRow.id + '" class="ns1blankspaceSub">' + oRow.statementdate + '</span><br />');
									}
									else
									{
										aHTML.push('<td id="ns1blankspaceFinancialBankAccountReconcile_title-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceBankAccountReconcileRowSelect"' +
															' style="text-align:right;"' +
															'>' + oRow.statementdate + '<br />)';
									}						
									
									aHTML.push('<span id="ns1blankspaceFinancialBankAccountReconcile_balance-' + oRow.id + '" class="ns1blankspaceSub">$' +
									 					oRow.statementbalance + '</span>');
												
									aHTML.push('</td></tr>');
									
									return aHTML.join('');
								},

					edit:		function (oParam, oResponse)
								{
									var sID; 
									var iDefaultCategory;
									
									if (oResponse == undefined)
									{
										var sXHTMLElementID;

										if (oParam != undefined)
										{
											if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										}
										
										if (sXHTMLElementID != undefined)
										{
											var aXHTMLElementID = sXHTMLElementID.split('-');
											var sID = aXHTMLElementID[1];
										}	
									
										var aHTML = [];
										var h = -1;
										
										aHTML[++h] = '<table class="interfaceMain" cellspacing=0 cellpadding=0>' +
												'<tr>' +
												'<td id="tdInterfaceMainBankAccountColumnRecoEdit" style="padding-right:15px;">' +
												'</td>' +
												'<td id="tdInterfaceMainBankAccountColumnRecoEdit2" class="interfaceMainColumn2" style="width: 250px">' +
												'</td>' +
												'</tr>' +
												'</table>';			
									
										$('#tdInterfaceMainBankAccountColumnReco2').html(aHTML.join(''));
											
										var aHTML = [];
										var h = -1;

										aHTML[++h] = '<table class="interfaceMain">';
												
										aHTML[++h] = '<tr id="trInterfaceMainFinancialBanksAccountRecoStatementDate" class="interfaceMain">' +
														'<td id="tdInterfaceMainFinancialBanksAccountRecoStatementDate" class="interfaceMain">' +
														'Bank Statement Date' +
														'</td></tr>' +
														'<tr id="trInterfaceMainFinancialBanksAccountRecoStatementDateValue" class="interfaceMainText">' +
														'<td id="tdInterfaceMainFinancialBanksAccountRecoStatementDateValue" class="interfaceMainText">' +
														'<input id="inputInterfaceMainFinancialBanksAccountRecoStatementDate" class="inputInterfaceMainDate">' +
														'</td></tr>';
													
										aHTML[++h] = '<tr id="trInterfaceMainFinancialBanksAccountRecoStatementBalance" class="interfaceMain">' +
														'<td id="tdInterfaceMainFinancialBanksAccountRecoStatementBalance" class="interfaceMain">' +
														'Bank Statement Balance' +
														'</td></tr>' +
														'<tr id="trInterfaceMainFinancialBanksAccountRecoStatementBalanceValue" class="interfaceMainText">' +
														'<td id="tdInterfaceMainFinancialBanksAccountRecoStatementBalanceValue" class="interfaceMainText">' +
														'<input id="inputInterfaceMainFinancialBanksAccountRecoStatementBalance" class="inputInterfaceMainText">' +
														'</td></tr>';			
															
										aHTML[++h] = '<tr id="trInterfaceMainFinancialBanksAccountRecoStatus" class="interfaceMain">' +
														'<td id="tdInterfaceMainFinancialBanksAccountRecoStatus" class="interfaceMain">' +
														'Status' +
														'</td></tr>' +
														'<tr id="trInterfaceMainFinancialBanksAccountRecoStatusValue">' +
														'<td id="tdInterfaceMainFinancialBanksAccountRecoStatusValue" class="interfaceMainRadio">' +
														'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>In Progress' +
														'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Completed' +
														'</td></tr>';
																																											
										aHTML[++h] = '</table>';					
										
										$('#tdInterfaceMainBankAccountColumnRecoEdit').html(aHTML.join(''));
										
										$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});
											
										var aHTML = [];
										var h = -1;
									
										aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em;">';
												
										aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
														'<td id="tdInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
														'<span id="spanInterfaceMainBankAccountColumnRecoEditSave">Save</span>' +
														'</td></tr>';
														
										aHTML[++h] = '</table>';					
										
										$('#tdInterfaceMainBankAccountColumnRecoEdit2').html(aHTML.join(''));
										
										$('#spanInterfaceMainBankAccountColumnRecoEditSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											ns1blankspaceStatusWorking();
													
											var sData = 'bankaccount=' + ns1blankspace.objectContext;
											sData += '&id=' + ns1blankspace.util.fs(sID);
											sData += '&statementdate=' + ns1blankspace.util.fs($('#inputInterfaceMainFinancialBanksAccountRecoStatementDate').val());
											sData += '&statementbalance=' + ns1blankspace.util.fs($('#inputInterfaceMainFinancialBanksAccountRecoStatementBalance').val());
											sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspaceEndpointURL('FINANCIAL_RECONCILIATION_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function() {
													interfaceFinancialBankAccountReconcile();
													ns1blankspaceStatus('Reconciliation added.');
												}
											});
										});
										
										if (sID != undefined)
										{
											$.ajax(
											{
												type: 'POST',
												url: '/ondemand/financial/?method=FINANCIAL_RECONCILIATION_SEARCH',
												data: 'id=' + sID,
												dataType: 'json',
												success: function(data) {interfaceFinancialBankAccountRecoEdit(oParam, data)}
											});
										}
										else
										{
											$('[name="radioStatus"][value="1"]').attr('checked', true);	
										}
									}
									else
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];
											$('#inputInterfaceMainFinancialBanksAccountRecoStatementDate').val(oObjectContext.statementdate);
											$('#inputInterfaceMainFinancialBanksAccountRecoStatementBalance').val(oObjectContext.statementbalance);
											$('[name="radioStatus"][value="' + oObjectContext.status + '"]').attr('checked', true);
										}
									}
								},

					items: 		{		
									show:		function interfaceFinancialBankAccountRecoItems(oParam, oResponse)
												{
													var iObjectContext = ns1blankspace.objectContext;
													var sXHTMLElementId = 'tdInterfaceMainSetupStructureElementColumnElement1';
													var oOptions = {view: true, remove: true, automation: true};
													var oActions = {add: true};
													var iReconciliation;
													var iType = 1;
													var iSource = 1;
													
													if (oParam != undefined)
													{
														if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
														if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
														if (oParam.options != undefined) {oOptions = oParam.options}
														if (oParam.actions != undefined) {oActions = oParam.actions}
														if (oParam.reconciliation != undefined) {iReconciliation = oParam.reconciliation}
														if (oParam.type != undefined) {iType = oParam.type}
														if (oParam.source != undefined) {iSource = oParam.source}
													}		
													
													$.extend(true, oParam, {source: iSource, type: iType});
														
													if (oResponse == undefined)
													{	
														if ($('#tdInterfaceMainBankAccountColumnReco2').html() == '')
														{
														
															var aHTML = [];
															var h = -1;
															
															aHTML[++h] = '<table class="interfaceMain" cellspacing=0 cellpadding=0 style="font-size:0.875em;">' +
																	'<tr id="trInterfaceMainBankAccountRow1" class="interfaceMainRow1">' +
																	'<td id="tdInterfaceMainBankAccountColumnType" style="width: 75px;font-size:0.875em;text-align:right;padding-right:7px;">' +
																	'</td>' +
																	'<td id="tdInterfaceMainBankAccountColumnItem" class="interfaceMainColumn2" style="width: 200px;font-size:0.875em;">' +
																	'</td>' +
																	'<td id="tdInterfaceMainBankAccountColumnItemEdit" class="interfaceMainColumn2" style="font-size:0.875em;">' +
																	'</td>' +
																	'</tr>' +
																	'</table>';			
														
															$('#tdInterfaceMainBankAccountColumnReco2').html(aHTML.join(''));
															
															var aHTML = [];
															var h = -1;
														
															aHTML[++h] = '<div id="interfaceMainBankAccountColumnItemType" style="width: 70px;margin-bottom:3px;">';
															aHTML[++h] = '<input style="width: 100px;" type="radio" id="interfaceMainBankAccountColumnItemType-1" name="radioType" checked="checked" /><label for="interfaceMainBankAccountColumnItemType-1" style="width: 70px;">Debits (Out)</label>';
															aHTML[++h] = '<input style="width: 100px;"  type="radio" id="interfaceMainBankAccountColumnItemType-2" name="radioType" /><label for="interfaceMainBankAccountColumnItemType-2" style="width: 70px;">Credits (In)</label>';
															aHTML[++h] = '</div>';
														
															$('#tdInterfaceMainBankAccountColumnType').html(aHTML.join(''));
														
															var aHTML = [];
															var h = -1;
															
															aHTML[++h] = '<div id="interfaceMainBankAccountColumnItemSource" style="width: 200px;;margin-bottom:3px;">';
															aHTML[++h] = '<input style="width: 100px;" type="radio" id="interfaceMainBankAccountColumnItemSource-1" name="radioSource" checked="checked" /><label for="interfaceMainBankAccountColumnItemSource-1" style="width: 96px;">Reconciled</label>';
															aHTML[++h] = '<input style="width: 100px;" type="radio" id="interfaceMainBankAccountColumnItemSource-2" name="radioSource" /><label for="interfaceMainBankAccountColumnItemSource-2" style="width: 96px;">Statement</label>';
															aHTML[++h] = '</div>';
														
															aHTML[++h] = '<div id="divInterfaceMainRecoItems" style="width: 200px;margin-bottom:3px;"></div>';
															
															$('#tdInterfaceMainBankAccountColumnItem').html(aHTML.join(''));
															
															interfaceFinancialBankAccountRecoItemsEdit(oParam);
														}
													
														$('#interfaceMainBankAccountColumnItemType').buttonset().css('font-size', '0.875em');
														$('#interfaceMainBankAccountColumnItemSource').buttonset().css('font-size', '0.875em');
														
														$('#interfaceMainBankAccountColumnItemSource :radio').click(function()
														{
															var aID = (event.target.id).split('-');
															$.extend(true, oParam, {source: parseInt(aID[1])});
															interfaceFinancialBankAccountRecoItems(oParam);
														});
														
														$('#interfaceMainBankAccountColumnItemType :radio').click(function()
														{
															var aID = (event.target.id).split('-');
															$.extend(true, oParam, {type: parseInt(aID[1])});
															interfaceFinancialBankAccountRecoItems(oParam);	
														});
														
														$('#divInterfaceMainRecoItems').html(ns1blankspace.xhtml.loadingSmall);
														
														var oSearch = new AdvancedSearch();
														
														if (iSource == 1)
														{
															if (iType == 1)
															{
																oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
																oSearch.addField('reference,amount,paiddate,reconciliation');
																oSearch.sort('paiddate', 'desc');
															}	
															else
															{
																oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
																oSearch.addField('reference,amount,receiveddate,reconciliation');
																oSearch.sort('receiveddate', 'desc');
															}
															
															oSearch.addFilter('reconciliation', 'EQUAL_TO', iReconciliation);
															oSearch.rows = ns1blankspace.option.defaultRows;
															oSearch.getResults(function(data) {interfaceFinancialBankAccountRecoItems(oParam, data)});
														}		
														else
														{
															oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
															oSearch.addField('description,amount,posteddate');
															oSearch.sort('posteddate', 'desc');
															oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
															oSearch.addFilter('status', 'EQUAL_TO', 1);
															oSearch.rows = ns1blankspace.option.defaultRows;
															oSearch.getResults(function(data) {interfaceFinancialBankAccountRecoItems(oParam, data)});
														}		
													}
													else
													{
																		
														var aHTML = [];
														var h = -1;
														
														if (oResponse.data.rows.length == 0)
														{
															aHTML[++h] = '<table id="tableSetupStructureElement" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
															aHTML[++h] = ''
															aHTML[++h] = '<tr class="interfaceMainCaption">' +
																			'<td class="interfaceMainRowNothing">No items.</td></tr>';
															aHTML[++h] = '</table>';

															$('#divInterfaceMainRecoItems').html(aHTML.join(''));
														
														}
														else
														{
															aHTML[++h] = '<table id="tableRecoItems" border="0" cellspacing="0" cellpadding="0">';
															aHTML[++h] = ''
															
															$.each(oResponse.data.rows, function()
															{
																aHTML[++h] = '<tr class="interfaceMainRow"><td class="interfaceMainRow interfaceMainRowSelect">' +
																	'<table cellspacing=0 cellpadding=0><tr>';
																				
																	if (this.paiddate)
																	{				
																		aHTML[++h] = '<td id="tdRecoItems_date-' + this.id + '" class="recoitempayment">' +
																							this.paiddate + '</td>';
																	}
																	else if (this.receiveddate)
																	{
																		aHTML[++h] = '<td id="tdRecoItems_date-' + this.id + '" class="recoitemreceipt">' +
																							this.receiveddate + '</td>';
																	}							
																	else if (this.posteddate)
																	{
																		aHTML[++h] = '<td id="tdRecoItems_date-' + this.id + '" class="recoitemstatement">' +
																							this.posteddate + '</td>';
																	}
																
																	aHTML[++h] = '<td id="spanRecoItems_amount-' + this.id + '" style="text-align:right;"' +
																						' class="recoitem">' +
																						this.amount + '</td>';
																	
																	if (iSource == 1)
																	{
																		aHTML[++h] = '</tr><tr><td colspan=2 id="spanRecoItems_description-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																						' class="recoitem">' +
																						this.reference + '</td>';
																	}
																	else
																	{
																		aHTML[++h] = '</tr><tr><td colspan=2 id="spanRecoItems_description-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																						' class="recoitem">' +
																						this.description + '</td>';
																	}
																			
																aHTML[++h] = '</tr></table></td>';	
																	
																if ((this.paiddate) || (this.receiveddate))
																{					
																	aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
																	aHTML[++h] = '<span id="spanRecoItems_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
																	aHTML[++h] = '</td>';
																};	
																
																if (this.posteddate)
																{					
																	aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
																	aHTML[++h] = '<span id="spanRecoItems_options_search-' + this.id + '"' +
																					' data-searchDate="' + this.posteddate + '"' +
																					' data-searchAmount="' + this.amount + '"' +
																					' class="interfaceMainRowOptionsMatch"></span>';
																	aHTML[++h] = '</td>';
																};	
																		
																aHTML[++h] = '</tr>';
																
															});
															
															aHTML[++h] = '</table>';

															$('#divInterfaceMainRecoItems').html(aHTML.join(''));
														
															$('.interfaceMainRowOptionsRemove').button( {
																text: false,
																icons: {
																	primary: "ui-icon-close"
																}
															})
															.click(function() {
																//ns1blankspaceSetupStructureElementRemove({xhtmlElementID: this.id});
															})
															.css('width', '15px')
															.css('height', '17px')
															
															$('.interfaceMainRowOptionsMatch').button( {
																text: false,
																icons: {
																	primary: "ui-icon-play"
																}
															})
															.click(function() {
																var aID = (this.id).split('-');
																$.extend(true, oParam, {searchSourceID: aID[1], searchDate: $(this).attr("data-searchDate"), searchAmount: $(this).attr("data-searchAmount")});
																interfaceFinancialBankAccountRecoItemsEdit(oParam);
															})
															.css('width', '15px')
															.css('height', '17px')
															
														}
													}	
												},

									edit:		function interfaceFinancialBankAccountRecoItemsEdit(oParam, oResponse)
												{
													var iObjectContext = ns1blankspace.objectContext;
													var sXHTMLElementId = 'tdInterfaceMainBankAccountColumnEdit';
													var oOptions = {view: true, remove: true, automation: true};
													var oActions = {add: true};
													var iReconciliation;
													var iType = 1;
													var iEditAction = 1;
													var dSearchDate;
													var cSearchAmount;
													
													if (oParam != undefined)
													{
														if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
														if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
														if (oParam.options != undefined) {oOptions = oParam.options}
														if (oParam.actions != undefined) {oActions = oParam.actions}
														if (oParam.reconciliation != undefined) {iReconciliation = oParam.reconciliation}
														if (oParam.type != undefined) {iType = oParam.type}
														if (oParam.editAction != undefined) {iEditAction = oParam.editAction}
														if (oParam.searchDate != undefined) {dSearchDate = oParam.searchDate}
														if (oParam.searchAmount != undefined) {cSearchAmount = oParam.searchAmount}	
													}		
													
													$.extend(true, oParam, {editAction: iEditAction, type: iType});
														
													if (oResponse == undefined)
													{	
														if ($('#tdInterfaceMainBankAccountColumnItemEdit').html() == '')
														{
														
															var aHTML = [];
															var h = -1;
															
															aHTML[++h] = '<table class="interfaceMainRecoItemEdit" cellspacing=0 cellpadding=0>' +
																	'<tr id="trInterfaceMainBankAccountRow1" class="interfaceMainRow1">' +
																	'<td id="tdInterfaceMainBankAccountColumnRecoItemEdit1" style="width:200px;">' +
																	'</td>' +
																	'<td id="tdInterfaceMainBankAccountColumnRecoItemEdit2" class="interfaceMainColumn2" style="width:50px;">' +
																	'</td>' +
																	'</tr>' +
																	'</table>';			
														
															$('#tdInterfaceMainBankAccountColumnItemEdit').html(aHTML.join(''));
															
															var aHTML = [];
															var h = -1;
														
															aHTML[++h] = '<div id="interfaceMainBankAccountColumnItemEdit" style="width: 196;margin-bottom:3px;text-align:right;">';
															aHTML[++h] = '<input type="radio" id="interfaceMainBankAccountColumnItemEdit-1" name="radioEdit" checked="checked" /><label for="interfaceMainBankAccountColumnItemEdit-1" style="width: 112px;">Unreconciled</label>';
														
															aHTML[++h] = '<input type="radio" id="interfaceMainBankAccountColumnItemEdit-2" name="radioEdit" /><label for="interfaceMainBankAccountColumnItemEdit-2" style="width: 50px;">Add</label>';
															aHTML[++h] = '</div>';
														
															aHTML[++h] = '<div id="divInterfaceMainRecoItemsEdit"></div>';
															
															$('#tdInterfaceMainBankAccountColumnRecoItemEdit1').html(aHTML.join(''));
														}
													
														$('#interfaceMainBankAccountColumnItemEdit').buttonset().css('font-size', '0.875em');
														
														$('#interfaceMainBankAccountColumnItemEdit :radio').click(function()
														{
															var aID = (event.target.id).split('-');
															$.extend(true, oParam, {editAction: parseInt(aID[1])});
															interfaceFinancialBankAccountRecoItemsEdit(oParam);
														});
														
														if (iEditAction == 1)
														{
															var aHTML = [];
															var h = -1;	
															
															aHTML[++h] = '<table>';
															
															aHTML[++h] = '<tr id="trInterfaceMainItemsEditSearchDate">' +
																			'<td id="tdInterfaceMainItemsEditDate" class="interfaceMain">' +
																			'Date' +
																			'</td></tr>' +
																			'<tr id="trInterfaceMainItemsSearchDateValue" class="interfaceMainText">' +
																			'<td id="tdInterfaceMainItemsSearchDateValue" class="interfaceMainText">' +
																			'<input id="inputInterfaceMainItemsEditSearchDate" class="inputInterfaceMainDate">' +
																			'</td></tr>';
																
															aHTML[++h] = '<tr id="trInterfaceMainItemsEditSearchAmount">' +
																			'<td id="tdInterfaceMainItemsEditAmount" class="interfaceMain">' +
																			'Amount' +
																			'</td></tr>' +
																			'<tr id="trInterfaceMainItemsSearchAmountValue" class="interfaceMainText">' +
																			'<td id="tdInterfaceMainItemsSearchAmountValue" class="interfaceMainText">' +
																			'<input id="inputInterfaceMainItemsEditSearchAmount" class="inputInterfaceMainText">' +
																			'</td></tr>';
																							
															aHTML[++h] = '<tr><td id="tdInterfaceMainRecoItemsEditSearch" class="interfaceMainAction">' +
																			'<span style="width:100%" id="spanInterfaceMainRecoItemsEditSearch">Search</span>' +
																			'</td></tr>';
															
															aHTML[++h] = '</table>';					
															
															$('#tdInterfaceMainBankAccountColumnRecoItemEdit2').html(aHTML.join(''));
														
															$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});
														
															if (dSearchDate) {$('#inputInterfaceMainItemsEditSearchDate').val(dSearchDate)}
															if (cSearchAmount) {$('#inputInterfaceMainItemsEditSearchAmount').val(cSearchAmount)}
																
															$('#spanInterfaceMainRecoItemsEditSearch').button( {
																label: 'Search',
																icons: {
																	primary: "ui-icon-search"
																}
															})
															.click(function() {
																 //Search based on date and amount
															})
															
															$('#divInterfaceMainRecoItemsEdit').html(ns1blankspace.xhtml.loadingSmall);
														
															var oSearch = new AdvancedSearch();
														
															if (iType == 1)
															{
																oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
																oSearch.addField('reference,amount,paiddate,reconciliation');
																if (dSearchDate) {oSearch.addFilter('paiddate', 'GREATER_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-7).toString("dd-MMM-yyyy"))}
																oSearch.sort('paiddate', 'desc');
															}	
															else
															{
																oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
																oSearch.addField('reference,amount,receiveddate,reconciliation');
																if (dSearchDate) {oSearch.addFilter('receiveddate', 'GREATER_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-7).toString("dd-MMM-yyyy"))}
																oSearch.sort('receiveddate', 'desc');
															}
														
															if (cSearchAmount) {oSearch.addFilter('amount', 'APPROX_EQUAL_TO', cSearchAmount)}
															
															oSearch.addFilter('reconciliation', 'IS_NULL');
															oSearch.rows = ns1blankspace.option.defaultRows;
															oSearch.getResults(function(data) {interfaceFinancialBankAccountRecoItemsEdit(oParam, data)});
														}
														else
														{
															var aHTML = [];
															var h = -1;
															
															aHTML[++h] = '<table class="interfaceMain" style="width:190px;">';							
															
															aHTML[++h] = '<tr id="trInterfaceMainItemsEditDate" class="interfaceMain">' +
																			'<td id="tdInterfaceMainItemsEditDate" class="interfaceMain">' +
																			'Date' +
																			'</td></tr>' +
																			'<tr id="trInterfaceMainItemsEditDateValue" class="interfaceMainText">' +
																			'<td id="tdInterfaceMainItemsEditDateValue" class="interfaceMainText">' +
																			'<input id="inputInterfaceMainItemsEditDate" class="inputInterfaceMainDate">' +
																			'</td></tr>';						
															
															aHTML[++h] = '<tr id="trInterfaceMainItemsEditContactBusiness" class="interfaceMain">' +
																			'<td id="tdInterfaceMainItemsEditContactBusiness" class="interfaceMain">' +
																			'Business' +
																			'</td></tr>' +
																			'<tr id="trInterfaceMainItemsEditContactBusinessValue" class="interfaceMainSelect">' +
																			'<td id="tdInterfaceMainItemsEditContactBusinessValue" class="interfaceMainSelect">' +
																			'<input id="inputInterfaceMainItemsEditContactBusiness" class="inputInterfaceMainSelect"' +
																				' data-method="CONTACT_BUSINESS_SEARCH"' +
																				' data-columns="tradename">' +
																			'</td></tr>';
																		
															aHTML[++h] = '<tr id="trInterfaceMainItemsEditContactPerson" class="interfaceMain">' +
																			'<td id="tdInterfaceMainItemsEditContactPerson" class="interfaceMain">' +
																			'Person' +
																			'</td></tr>' +
																			'<tr id="trInterfaceMainItemsEditContactPersonValue" class="interfaceMainSelect">' +
																			'<td id="tdInterfaceMainItemsEditContactPersonValue" class="interfaceMainSelect">' +
																			'<input id="inputInterfaceMainItemsEditContactPerson" class="inputInterfaceMainSelect"' +
																				' data-method="CONTACT_PERSON_SEARCH"' +
																				' data-columns="surname"' +
																				' data-parent="inputInterfaceMainItemsEditContactBusiness"' +
																				' data-parent-search-id="contactbusiness"' +
																				' data-parent-search-text="tradename">' +
																			'</td></tr>';		
														
															aHTML[++h] = '<tr id="trInterfaceMainItemsEditAmount" class="interfaceMain">' +
																			'<td id="tdInterfaceMainItemsEditAmount" class="interfaceMain">' +
																			'Amount' +
																			'</td></tr>' +
																			'<tr id="trInterfaceMainItemsEditAmountValue" class="interfaceMainText">' +
																			'<td id="tdInterfaceMainItemsEditAmountValue" class="interfaceMainText">' +
																			'<input id="inputInterfaceMainItemsEditAmount" class="inputInterfaceMainText">' +
																			'</td></tr>';	
															
															aHTML[++h] = '<tr id="trInterfaceMainItemsEditDescription" class="interfaceMain">' +
																		'<td id="tdInterfaceMainItemsEditDescription" class="interfaceMain">' +
																		'Description' +
																		'</td></tr>' +
																		'<tr id="trInterfaceMainItemsEditDescriptionValue" class="interfaceMainTextMulti">' +
																		'<td id="tdInterfaceMainItemsEditDescriptionValue" class="interfaceMainTextMulti">' +
																		'<textarea rows="5" cols="35" id="inputInterfaceMainItemsEditDescription" class="inputInterfaceMainTextMultiSmall"></textarea>' +
																		'</td></tr>';
																										
															aHTML[++h] = '</table>';					
														
															$('#divInterfaceMainRecoItemsEdit').html(aHTML.join(''));
														
															$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});
														
															var aHTML = [];
															var h = -1;	
															
															aHTML[++h] = '<table>';
															
															aHTML[++h] = '<tr><td id="tdInterfaceMainRecoItemsEditSave" class="interfaceMainAction">' +
																			'<span id="spanInterfaceMainRecoItemsEditSave">Save</span>' +
																			'</td></tr>';
															
															aHTML[++h] = '</table>';					
															
															$('#tdInterfaceMainBankAccountColumnRecoItemEdit2').html(aHTML.join(''));
														
															$('#spanInterfaceMainRecoItemsEditSave').button( {
																text: false,
																icons: {
																	primary: "ui-icon-check"
																}
															})
															.click(function() {
																 //Save based on iType
															})
														}	
													}
													else
													{
														var aHTML = [];
														var h = -1;	
															
														aHTML[++h] = '<table style="margin-top:20px;">';
															
														aHTML[++h] = '<tr><td class="interfaceViewportControlSub">' +
																		'No element selected.' +
																		'<br /><br/ >Click the gear icon to set up automation (issue creation) for an element.' +
																	'</td></tr>';

														aHTML[++h] = '</table>';		
														
														$('#tdInterfaceMainSetupStructureElementColumnElement2').html(aHTML.join(''));
															
														if (oActions != undefined)
														{	
															var aHTML = [];
															var h = -1;	
															
															aHTML[++h] = '<table id="tableInterfaceMainSetupStructureElementColumn2" class="interfaceMainColumn2">';
															
															if (oActions.add)
															{
																aHTML[++h] = '<tr><td id="tdInterfaceMainFormStructureAdd" class="interfaceMainAction">' +
																			'<span id="spanInterfaceMainSetupStructureAdd">Add</span>' +
																			'</td></tr>';
															}
															
															aHTML[++h] = '</table>';					
															
															$('#tdInterfaceMainSetupStructureElementColumnElement3').html(aHTML.join(''));
														
															$('#spanInterfaceMainSetupStructureAdd').button(
															{
																label: "Add"
															})
															.click(function() {
																 ns1blankspaceSetupStructureElementAdd(oParam);
															})
														}	
													
														var aHTML = [];
														var h = -1;
														
														if (oResponse.data.rows.length == 0)
														{
															aHTML[++h] = '<table id="tableSetupStructureElement" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
															aHTML[++h] = ''
															aHTML[++h] = '<tr class="interfaceMainCaption">' +
																			'<td class="interfaceMainRowNothing">No items.</td></tr>';
															aHTML[++h] = '</table>';

															$('#divInterfaceMainRecoItemsEdit').html(aHTML.join(''));
														
														}
														else
														{
															aHTML[++h] = '<table id="tableRecoItems" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
															aHTML[++h] = ''
															
															$.each(oResponse.data.rows, function()
															{
																aHTML[++h] = '<tr class="interfaceMainRow">';
																				
																if (this.paiddate)
																{				
																	aHTML[++h] = '<td id="tdRecoItems_date-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect recoitempayment">' +
																						this.paiddate + '</td>';
																}
																else
																{
																	aHTML[++h] = '<td id="tdRecoItems_date-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect recoitemreceipt">' +
																						this.receiveddate + '</td>';
																}							
																
																aHTML[++h] = '<td id="spanRecoItems_amount-' + this.id + '" style="text-align:right;" class="interfaceMainRow interfaceMainRowSelect recoitem">' +
																						this.amount + '</td>';
																
																						
																aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
																	
																aHTML[++h] = '<span id="spanSetupStructureElement_options_view-' + this.id + '" class="interfaceMainRowOptionsItemAdd"></span>';
														
																aHTML[++h] = '</td>';
																				
																aHTML[++h] = '</tr>';
															});
															
															aHTML[++h] = '</table>';

															$('#divInterfaceMainRecoItemsEdit').html(aHTML.join(''));
															
															$('.interfaceMainRowOptionsItemAdd').button( {
																text: false,
																icons: {
																	primary: "ui-icon-check"
																}
															})
															.click(function() {
																//ns1blankspaceSetupStructureElementRemove({xhtmlElementID: this.id});
															})
															.css('width', '15px')
															.css('height', '17px')
														}
													}	
												}
								}
				},

	import: 	{
					show:		function interfaceFinancialBankAccountImport(oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_SEARCH';
										oSearch.addField('startdate,enddate,processeddate');
										oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.sort('enddate', 'desc');
										oSearch.rows = ns1blankspace.option.defaultRows;
										oSearch.getResults(function(data) {interfaceFinancialBankAccountImport(oParam, data)});
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										aHTML[++h] = '<table id="tableInterfaceMainBankAccountImport" class="interfaceMain">' +
													'<tr id="trInterfaceMainBankAccountRow1" class="interfaceMainRow1">' +
													'<td id="tdInterfaceMainBankAccountColumnImport1" style="width: 75px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
													ns1blankspace.xhtml.loading +
													'</td>' +
													'<td id="tdInterfaceMainBankAccountColumnImport2" class="interfaceMainColumn2">' +
													'</td>' +
													'</tr>' +
													'</table>';				
										
										$('#divInterfaceMainImport').html(aHTML.join(''));
										
										var aHTML = [];
										var h = -1;
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
											
											aHTML[++h] = '<tr><td style="font-size:0.75em;"><span id="spanInterfaceBankAccountImportAdd">Add</span></td></tr>';

											aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
											aHTML[++h] = '<td class="trInterfaceFinancialHomeMostLikelyNothing">No existing imports.</td>';
											aHTML[++h] = '</tr>';
											aHTML[++h] = '</table>';
											
											$('#tdInterfaceMainBankAccountColumnImport1').html(aHTML.join(''));	
										}
										else
										{		
											aHTML[++h] = '<table id="tableImport" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
											aHTML[++h] = ''
									
											var oRows = oResponse.data.rows;
											
											$(oRows).each(function(i) 
											{
												if (i==0)
												{
													aHTML[++h] = '<tr><td style="font-size:0.75em;"><span id="spanInterfaceBankAccountImportAdd">Add</span></td></tr>';
												}
												
												aHTML[++h] = interfaceFinancialBankAccountImportRow(this);
											});
											
											aHTML[++h] = '</table>';
											
											$('#tdInterfaceMainBankAccountColumnImport1').html(aHTML.join(''));
										}
											
										$('#spanInterfaceBankAccountImportAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											interfaceFinancialBankAccountImportAdd();
										})
										.css("width", "75px");
										
										$('.import').click(function()
										{
											var aID = (event.target.id).split('-');
											interfaceFinancialBankAccountImportTransactions({fileSource: aID[1]});
										});
									}
								},

					row:		function interfaceFinancialBankAccountImportRow(oRow)
								{
									var aHTML = [];
									var h = -1;

									if (oRow.processeddate != '')
									{
										aHTML[++h] = '<tr class="interfaceMainRow">';

										aHTML[++h] = '<td id="interfaceFinancialBankAccountImport_processeddate-' + oRow.id + '" class="interfaceMainRow interfaceMainRowSelect import"' +
																'">' + oRow.processeddate + '<br />';
															
										if (oRow.startdate != '')
										{		
											aHTML[++h] = '<span class="interfaceViewportControlSubContext" id="spanInterfaceFinancialBankAccountImport_enddate-' + oRow.id + '">' +
																oRow.startdate + '</span><br />';	
										}
									
										aHTML[++h] = '</tr>';
									}
										
									return aHTML.join('');
								},

					add:		function interfaceFinancialBankAccountImportAdd(oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.objectContext;
									var sXHTMLElementId = 'tdInterfaceMainBankAccountColumnImport21';
									var oOptions = {view: true, remove: true, automation: true};
									var oActions = {add: true};

									if (oParam != undefined)
									{
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
										if (oParam.options != undefined) {oOptions = oParam.options}
										if (oParam.actions != undefined) {oActions = oParam.actions}
									}		
										
									if (oResponse == undefined)
									{	
										var aHTML = [];
										var h = -1;
																		
										aHTML[++h] = ns1blankspaceAttachmentsUpload(
														{	
															object: 28,
															objectContext: -1,
															label: ''
														});
																				
										$('#tdInterfaceMainBankAccountColumnImport2').html(aHTML.join(''));
										
										$('#spanInterfaceMainUpload').button(
										{
											label: "Upload Bank File"
										})
										.click(function()
										{
											if ($('#oFile0').val() == '')
											{
												ns1blankspaceError("Need to select a file.");
											}
											else
											{
												var sData = 'processeddate=' + Date.today().toString("dd-MMM-yyyy");
												sData += '&bankaccount=' + ns1blankspace.objectContext;
												
												$.ajax(
												{
													type: 'POST',
													url: '/ondemand/financial/?method=FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_MANAGE',
													data: sData,
													dataType: 'json',
													success: function(data) {
														interfaceFinancialBankAccountImportAdd(oParam, data);
													}
												});
											}
										});
									}
									else
									{
										if (oResponse.status == 'OK')
										{
											$('#objectcontext').val(oResponse.id);	
											ns1blankspaceAttachmentsUploadProcess({functionPostUpdate: interfaceFinancialBankAccountImportAddProcess});
										}	
									}	
								},

					process:	function interfaceFinancialBankAccountImportAddProcess(oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'CORE_ATTACHMENT_SEARCH';
										oSearch.addField('type,filename,description,download,modifieddate');
										oSearch.addFilter('object', 'EQUAL_TO', 28);
										oSearch.addFilter('objectcontext', 'EQUAL_TO', $('#objectcontext').val());
										oSearch.getResults(function(data) {interfaceFinancialBankAccountImportAddProcess(data)});
									}
									else
									{
										if (oResponse.data.rows.length !=0)
										{	
											var sData = 'id=' + oResponse.data.rows[0].id;
									
											$.ajax(
											{
												type: 'POST',
												url: '/ondemand/financial/?method=FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_PROCESS',
												data: sData,
												dataType: 'json',
												success: function(data) {
													alert("done");
												}
											});	
										}
									}	
								}
				}
}								
