/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.financial.bankAccount = 
{
	init: 		function (oParam)
				{
					ns1blankspace.app.reset();

					var bShowHome = true
					var bInitialised = false;
					var iID;

					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}
						if (oParam.id != undefined) {iID = oParam.id}
					}

					ns1blankspace.object = -3;
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'bankAccount';
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Bank Accounts';
					
					if (!bInitialised)
					{
						ns1blankspace.financial.initData(oParam)
					}
					else
					{
						if (bShowHome)
						{
							ns1blankspace.history.view({
								newDestination: 'ns1blankspace.financial.bankAccount.init({showHome: true});',
								move: false
								})		
						}	
										
						ns1blankspace.app.set(oParam);
						$('#ns1blankspaceViewControlNew').button({disabled: true});
					}	
				},

	home: 		function ()
				{
					if (ns1blankspace.timer.initData == undefined)
					{	
						$('#ns1blankspaceMain').html(ns1blankspace.xhtml.loading);
						ns1blankspace.timer.initData = window.setInterval('ns1blankspace.financial.bankAccount.home()', 100);
					}
					else
					{	
						if (ns1blankspace.financial.data.bankaccounts)
						{
							window.clearInterval(ns1blankspace.timer.initData);
							
							var aHTML = [];
							
							aHTML.push('<table>');

							aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
	
							aHTML.push('</table>');		
							
							$('#ns1blankspaceControl').html(aHTML.join(''));	

							$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
							
							var aHTML = [];
										
							aHTML.push('<table id="ns1blankspaceMostLikely" class="ns1blankspace">');

							$.each(ns1blankspace.financial.data.bankaccounts, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">' +
												'<td id="ns1blankspaceBankAccount_title-' + this.id + '" class="ns1blankspaceMostLikely" style="width:200px;">' +
												this["title"] + '</td>' + 
												'<td id="ns1blankspaceBankAccount_lastreconcileddate-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;text-align:right;">' +
												this.lastreconcileddate + '</td>' +
												'<td id="ns1blankspaceBankAccount_lastreconciledamount-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;text-align:right;">' +
												'$' + this.lastreconciledamount + '</td>' + 	
												'<td>&nbsp;</td></tr>');
							});
							
							aHTML.push('</table>');
				
							$('#ns1blankspaceMain').html(aHTML.join(''));

							$('#ns1blankspaceMostLikely .ns1blankspaceMostLikely').click(function(event) {
								var aID = (this.id).split('-');
								ns1blankspace.financial.bankAccount.show({id: aID[1]});
							});
						}	
					}	
				},		

	search: 	{send: function (sID) {ns1blankspace.financial.bankAccount.show({id: (sID).split('-')[1]})}},
				
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
									'</tr>');

					aHTML.push('</table>');
					
					aHTML.push('<table class="ns1blankspaceControl">');

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlReconcile" class="ns1blankspaceControl">Unreconciled</td>' +
									'</tr>');

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlReconciliations" class="ns1blankspaceControl">Reconciled</td>' +
									'</tr>');

					aHTML.push('</table>');					
							
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainImport" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainReconcile" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.financial.bankAccount.summary();
					});
					
					$('#ns1blankspaceControlImport').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainImport'});
						ns1blankspace.financial.bankAccount.import.show();
					});
					
					$('#ns1blankspaceControlReconcile').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainReconcile', refresh: true});
						ns1blankspace.financial.bankAccount.reconcile.show();
					});

					$('#ns1blankspaceControlReconciliations').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainReconcile', refresh: true});
						ns1blankspace.financial.bankAccount.reconcile.show({mode: 2});
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
					ns1blankspace.objectContextData = ($.grep(ns1blankspace.financial.data.bankaccounts, function (a) { return a.id == ns1blankspace.objectContext; }))[0];
					
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the bank account.</td></tr></table>');
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						//$('#ns1blankspaceViewControlAction').button({disabled: false});
						//$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
							
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title +
							'<br /><span class="ns1blankspaceSubContext" id="ns1blankspaceControlSubContext_date">' + ns1blankspace.objectContextData.lastreconcileddate + '</span>' +
							'<br /><span class="ns1blankspaceSubContext" id="ns1blankspaceControlSubContext_amount">$' + ns1blankspace.objectContextData.lastreconciledamount + '</span>');
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.financial.bankAccount.init({showHome: false, id: ' + ns1blankspace.objectContext + '})',
							move: false
							})
					
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.bankAccount.summary()'});
					}		
				},

	summary:	function (oParam, oResponse)
				{
					var aHTML = [];

					aHTML.push('<table class="ns1blankspace"><tbody>' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:400px;"></td>' +
									'</tr>' +
									'</tbody></table>');				
						
					$('#ns1blankspaceMainSummary').html(aHTML.join(''));

					var aHTML = [];
				
					if (ns1blankspace.objectContextData.lastreconcileddate == '')
					{
						aHTML.push('<table class="ns1blankspace">' +
									'<tr><td class="ns1blankspaceSub">' +
									'This bank account has never been reconciled.' +
									'</td></tr></table>');
					}
					else
					{	
						aHTML.push('<table class="ns1blankspace">' +
									'<tr><td class="ns1blankspaceSub">' +
									'This bank account was last reconciled on the ' +
									 ns1blankspace.objectContextData.lastreconcileddate + ', with an account balance of $' +
									 ns1blankspace.objectContextData.lastreconciledamount +
									'.</td></tr></table>');
					}								

					$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
					
					var aHTML = [];
					
					aHTML.push('<table cellpadding=6 class="ns1blankspaceColumn2" style="font-size:0.75em;">' +
									'<tr><td class="ns1blankspaceSub" colspan=2>You have a number of options when reconciling a bank account.</td></tr>' + 
									'<tr><td class="ns1blankspaceCaption" style="width:15px;padding-bottom:10px;">1</td><td class="ns1blankspaceSub">' +
									'Use a printed or PDF bank statement directly.  In this case you skip the bank transactions import step and go straight to reconcile.' +
									' You can then add a reconciliation - selecting the date you want to balance up to.  You then search the system for matching payments or receipts that have already been entered or if not, add them as you go.' +
									'</td></tr>' + 
									'<tr><td class="ns1blankspaceCaption" style="width:15px;padding-top:10px;">2</td><td class="ns1blankspaceSub" style="padding-top:10px;">' +
									'You export a file from your bank and then import it.' +
									'  You can then add a reconciliation - selecting the date you want to balance up to.  The system will then help you then search the system for matching payments or receipts that have already been entered, based on these transactions or if not, add them as you go.' +
									'</td></tr>' + 
									'</table>');
					
					$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''))	
				},

	reconcile: 	{
					show: 		function (oParam, oResponse)
								{
									var iMode = 1;
									
									if (oParam === undefined) {oParam = {}}

									if (oParam != undefined)
									{
										if (oParam.mode != undefined) {iMode = oParam.mode}
									}	

									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
										oSearch.addField('statementbalance,statementdate,statustext,status,previousbalance');
										oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
										if (iMode == 1) {oSearch.addFilter('status', 'EQUAL_TO', 1)}

										oSearch.sort('statementdate', 'desc');
										oSearch.rows = 12;
										oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.show(oParam, data)});
									}
									else
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspace">' +
														'<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceBankAccountColumnReconcile1" style="width: 85px;padding-right:5px;font-size:0.875em;" class="ns1blankspaceColumn1">' +
														ns1blankspace.xhtml.loading +
														'</td><td id="ns1blankspaceBankAccountColumnReconcile2" class="interfaceMainColumn2">' +
														'</td></tr></table>');				
										
										$('#ns1blankspaceMainReconcile').html(aHTML.join(''));		

										var aHTML = [];
											
										if (iMode == 1)
										{	
											aHTML.push('<table class="ns1blankspaceColumn2">' +
														'<tr><td class="ns1blankspaceNothing">All open reconciliations are shown for your information.' +
														'<br /><br />To reconcile this bank account, select the appropriate reconcilation<br />or if all completed, press "Add" to add a new one.' +
														'<br /><br />Once selected you can press "Edit" to change the reconcilation details,<br />ie bank statement balance amount.</td></tr>' +
														'</table>');
										}
										else
										{
											aHTML.push('<table class="ns1blankspaceColumn2">' +
														'<tr><td class="ns1blankspaceNothing">The last twelve reconciliations are shown for your information.</td></tr></table>')
										}	

										$('#ns1blankspaceBankAccountColumnReconcile2').html(aHTML.join(''));
																
										var aHTML = [];
										
										if (iMode == 1 && oResponse.data.rows.length == 0)
										{	
											aHTML.push('<table style="margin-bottom:7px;"><tr><td style="text-align:right;">' +
															'<span id="ns1blankspaceBankAccountRecoAdd" class="ns1blankspaceAction">Add</span>' +
															'</td></tr></table>');
										}
											
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('</table>');
											
											$('#ns1blankspaceBankAccountColumnReconcile1').html(aHTML.join(''));
										}
										else
										{		
											aHTML.push('<table id="ns1blankspaceBankAccountReco" class="ns1blankspace">');
											
											var oRows = oResponse.data.rows;
											
											$(oRows).each(function(i) 
											{
												aHTML.push(ns1blankspace.financial.bankAccount.reconcile.row(this));
											});
											
											aHTML.push('</table>');
											
											$('#ns1blankspaceBankAccountColumnReconcile1').html(aHTML.join(''));
										}
										
										$('#ns1blankspaceBankAccountRecoAdd').button(
										{
											label: 'Add',
											icons:
											{
												primary: "ui-icon-plus"
											}
										})
										.click(function() {
											 ns1blankspace.financial.bankAccount.reconcile.edit(oParam)
										})
										.css("width", "60px;");

										$('#ns1blankspaceBankAccountReco .ns1blankspaceFinancialBankAccountReconcileContainer').click(function()
										{
											$('#ns1blankspaceBankAccountReco td.ns1blankspaceRowShaded').removeClass('ns1blankspaceRowShaded');
											$('td', $('#' + this.id).closest('tr')).addClass('ns1blankspaceRowShaded');

											$('#ns1blankspaceBankAccountColumnReconcile2').html('');

											var aID = (this.id).split('-');

											oParam.reconciliation = aID[1];
											oParam.status = aID[2];

											if (iMode == 1)
											{	
												ns1blankspace.financial.bankAccount.reconcile.items.show(oParam);
											}
											else
											{	
												ns1blankspace.financial.bankAccount.reconcile.items.locked(oParam);
											}
												
											ns1blankspace.financial.bankAccount.reconcile.refresh(oParam);
										});
									}
								},

					row:		function (oRow)
								{
									var aHTML = [];
								
									aHTML.push('<tr class="ns1blankspaceRow">');
									
									aHTML.push('<td class="ns1blankspaceRow" id="ns1blankspaceFinancialBankAccountReconcileRow-' + oRow.id + '">');

									aHTML.push('<div class="ns1blankspaceFinancialBankAccountReconcileContainer"' +
													' style="cursor: pointer;" id="ns1blankspaceFinancialBankAccountReconcile-' + oRow.id + '-' + oRow.status + '">');

									aHTML.push('<table class="ns1blankspace">');

									if (oRow.status == 2)
									{			
										aHTML.push('<td id="ns1blankspaceFinancialBankAccountReconcile_title-' + oRow.id + '" class="ns1blankspaceRowSelect ns1blankspaceBankAccountReconcileRowSelect"' +
														' style="text-align:right;">' +
														'<span id="ns1blankspaceFinancialBankAccountReconcile_date-' +
														oRow.id  + '" class="ns1blankspaceSub">' + oRow.statementdate + '</span><br />');

										aHTML.push('<span id="ns1blankspaceFinancialBankAccountReconcile_balance-' + '-' + oRow.id + '" class="ns1blankspaceSub">$' +
									 					oRow.statementbalance + '</span>');
									}
									else
									{
										aHTML.push('<td id="ns1blankspaceFinancialBankAccountReconcile_title-' + oRow.id + '" class="ns1blankspaceRowSelect ns1blankspaceBankAccountReconcileRowSelect"' +
															' style="text-align:right; color:black;"' +
															'>' + oRow.statementdate + '<br />');

										aHTML.push('<span id="ns1blankspaceFinancialBankAccountReconcile_balance-' + oRow.id + '">$' +
									 					oRow.statementbalance + '</span>');
									}						
									
									aHTML.push('</td></tr>');
									aHTML.push('</table>');
									aHTML.push('</div>');
										
									aHTML.push('<div class="ns1blankspaceControlContext_reco_summary"' +
													' style="text-align:right;"' +
													' id="ns1blankspaceControlContext_reco_summary-' + oRow.id + '"></div>');
												
									aHTML.push('</td></tr>');
									
									return aHTML.join('');
								},

					refresh:	function (oParam, oResponse)
								{
									var iReconciliation;
									var iStatus = 2;
									var iMode = 1;
									
									if (oParam != undefined)
									{
										if (oParam.reconciliation != undefined) {iReconciliation = oParam.reconciliation}
										if (oParam.status != undefined) {iStatus = oParam.status}
										if (oParam.mode != undefined) {iMode = oParam.mode}
									}		

									if (oResponse == undefined)
									{
										$('div.ns1blankspaceControlContext_reco_summary').html('');
										$('#ns1blankspaceControlContext_reco_summary-' + iReconciliation).html(ns1blankspace.xhtml.loadingSmall);
										
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_RECONCILIATION_OUT_OF_BALANCE'),
											data: 'reconciliation=' + iReconciliation,
											dataType: 'json',
											success: function(data) {ns1blankspace.financial.bankAccount.reconcile.refresh(oParam, data)}
										});					
									}
									else
									{
										var aHTML = [];

										if (parseInt((oResponse.outofbalance).parseCurrency()) !== 0)
										{	
											aHTML.push('<div style="margin-right:3px; margin-bottom:5px; font-size:0.875em;" class="ns1blankspaceSub">' +
																'$' + (oResponse.outofbalance).parseCurrency().formatMoney(2, ".", ",")  + '</div>')
										}	
	
										aHTML.push('<div style="text-align:right; margin-left:5px; margin-right:3px; margin-bottom:5px;" id="ns1blankspaceBankAccountColumnItemType">');
										aHTML.push('<input style="width: 100%;" type="radio" id="ns1blankspaceBankAccountColumnItemType-1-' + iReconciliation + '" name="radioType" checked="checked" /><label for="ns1blankspaceBankAccountColumnItemType-1-' + iReconciliation + '" style="width: 70px;">' +
														'Debits</label>');
										aHTML.push('<input style="width: 100%;"  type="radio" id="ns1blankspaceBankAccountColumnItemType-2-' + iReconciliation + '" name="radioType" /><label for="ns1blankspaceBankAccountColumnItemType-2-' + iReconciliation + '" style="width: 70px;">' +
														'Credits</label>');
										aHTML.push('</div>');

										if (iStatus == 1 & iMode == 1)
										{	
											aHTML.push('<div style="width: 70px; margin-left:5px; margin-right:2px; margin-bottom:5px;" class="ns1blankspaceBankAccountRecoEdit" id="ns1blankspaceBankAccountRecoEdit-' + iReconciliation + '">' +
															'Edit</div>');
										}
											
										if (iMode == 1 && iStatus == 1 && parseInt((oResponse.outofbalance).parseCurrency()) == 0)
										{	
											aHTML.push('<div style="width: 70px; margin-left:5px; margin-right:2px; margin-bottom:5px;" class="ns1blankspaceBankAccountRecoLock" id="ns1blankspaceBankAccountRecoLock-' + iReconciliation + '">' +
															'Lock</div>');
										}
												
										$('#ns1blankspaceControlContext_reco_summary-' + iReconciliation).html(aHTML.join(''));

										$('#ns1blankspaceBankAccountColumnItemType').buttonset().css('font-size', '0.75em');
										
										$('#ns1blankspaceBankAccountColumnItemType :radio').click(function()
										{
											var aID = (this.id).split('-');
											$.extend(true, oParam, {type: parseInt(aID[1]), reconciliation: parseInt(aID[2])});

											if (iMode == 1)
											{	
												oParam.editAction = undefined;
												ns1blankspace.financial.bankAccount.reconcile.items.show(oParam);
											}
											else
											{	
												ns1blankspace.financial.bankAccount.reconcile.items.locked(oParam);
											}
										});

										$('div.ns1blankspaceBankAccountRecoEdit').button(
										{
											label: 'Edit',
											icons:
											{
												primary: "ui-icon-pencil"
											}
										})
										.click(function()
										{
											if ($('#ns1blankspaceBankAccountReco .ns1blankspaceRowShaded :first').length == 1)
											{
												if (oParam === undefined) {var oParam = {}}
												$.extend(true, oParam, {xhtmlElementID: $('#ns1blankspaceBankAccountReco .ns1blankspaceRowShaded :first').attr('id')});
											 	ns1blankspace.financial.bankAccount.reconcile.edit(oParam);
											}	
										})
										.css('font-size', '0.75em');

										$('div.ns1blankspaceBankAccountRecoLock').button(
										{
											label: 'Lock',
											icons:
											{
												primary: "ui-icon-locked"
											}
										})
										.click(function()
										{
											ns1blankspace.status.working();
												
											var aID = (this.id).split('-');
												
											var oData = 
											{	
												id: aID[1],
												status: 2
											}	
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_RECONCILIATION_MANAGE'),
												data: oData,
												dataType: 'json',
												success: function() {
													ns1blankspace.financial.bankAccount.reconcile.show();
													ns1blankspace.status.message('Reconciliation locked.');
												}
											});
										})
										.css('font-size', '0.75em');
									}
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
										
										aHTML.push('<table class="ns1blankspace"><tr>' +
														'<td id="ns1blankspaceBankAccountColumnReconcileEdit1" class="ns1blankspaceColumn1Flexible" ></td>' +
														'<td id="ns1blankspaceBankAccountColumnReconcileEdit2" class="ns1blankspaceColumn2" style="width: 250px"></td>' +
														'</tr></table>');			
									
										$('#ns1blankspaceBankAccountColumnReconcile2').html(aHTML.join(''));
											
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Bank Statement Date' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceReconcileEditStatementDate" class="ns1blankspaceDate">' +
														'</td></tr>');
													
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Bank Statement Balance' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceReconcileEditStatementBalance" class="ns1blankspaceText">' +
														'</td></tr>');			
															
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Status' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Open <span class="ns1blankspaceSub">(In Progress)</span>' +
														'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Locked <span class="ns1blankspaceSub">(Completed)</span>' +
														'</td></tr>');
																																											
										aHTML.push('</table>');					
										
										$('#ns1blankspaceBankAccountColumnReconcileEdit1').html(aHTML.join(''));
										
										$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});
											
										var aHTML = [];
									
										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr><td><span id="ns1blankspaceReconcileEditSave" class="ns1blankspaceAction">' +
														'Save</span></td></tr>');

										aHTML.push('<tr><td><span id="ns1blankspaceReconcileEditCancel" class="ns1blankspaceAction">' +
														'Cancel</span></td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceBankAccountColumnReconcileEdit2').html(aHTML.join(''));
										
										$('#ns1blankspaceReconcileEditSave').button(
										{
											text: "Save"
										})
										.click(function()
										{
											ns1blankspace.status.working();
													
											var sData = 'bankaccount=' + ns1blankspace.objectContext;
											sData += '&id=' + ns1blankspace.util.fs(sID);
											if ($('#ns1blankspaceReconcileEditStatementDate').val() != '') {sData += '&statementdate=' + ns1blankspace.util.fs($('#ns1blankspaceReconcileEditStatementDate').val())}
											sData += '&statementbalance=' + ns1blankspace.util.fs($('#ns1blankspaceReconcileEditStatementBalance').val());
											sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_RECONCILIATION_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function() {
													ns1blankspace.financial.bankAccount.reconcile.show();
													ns1blankspace.status.message('Reconciliation saved.');
												}
											});
										})
										.css('width', '70px');

										$('#ns1blankspaceReconcileEditCancel').button(
										{
											text: "Cancel"
										})
										.click(function()
										{
											ns1blankspace.financial.bankAccount.reconcile.show();
										})
										.css('width', '70px');
										
										if (sID != undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
											oSearch.addField('statementbalance,statementdate,statustext,status,previousbalance');
											oSearch.addFilter('id', 'EQUAL_TO', sID);
											oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.edit(oParam, data)});
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
											$('#ns1blankspaceReconcileEditStatementDate').val(oObjectContext.statementdate);
											$('#ns1blankspaceReconcileEditStatementBalance').val(oObjectContext.statementbalance);
											$('[name="radioStatus"][value="' + oObjectContext.status + '"]').attr('checked', true);
										}
									}
								},

					items: 		{	
									data: 		{unreconciled: {}},

									show:		function (oParam, oResponse)
												{
													var sXHTMLElementID;
													var iObjectContext = ns1blankspace.objectContext;
													var oOptions = {view: true, remove: true, automation: true};
													var oActions = {add: true};
													var iReconciliation;
													var iType = 1;
													var iStatus = 2;
													
													if (oParam != undefined)
													{
														if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
														if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
														if (oParam.options != undefined) {oOptions = oParam.options}
														if (oParam.actions != undefined) {oActions = oParam.actions}
														if (oParam.reconciliation != undefined) {iReconciliation = oParam.reconciliation}
														if (oParam.type != undefined) {iType = oParam.type}
														if (oParam.status != undefined) {iStatus = oParam.status}
													}		
													
													$.extend(true, oParam, {type: iType});
														
													if (oResponse == undefined)
													{	
														var aHTML = [];
														
														aHTML.push('<table class="ns1blankspaceContainer" style="font-size:0.875em;">' +
																		'<tr class="ns1blankspaceContainer">' +
																		'<td id="ns1blankspaceBankAccountReconcileColumnItem" class="ns1blankspaceColumn2" style="width:150px; font-size:0.875em; border-left-style:solid; border-width:1px; border-color:#B8B8B8; padding-left:7px;"></td>' +
																		'<td id="ns1blankspaceBankAccountReconcileColumnItemEdit" class="ns1blankspaceColumn2" style="font-size:0.875em; border-left-style:solid; border-width:1px; border-color:#B8B8B8; padding-left:7px;"></td>' +
																		'</tr></table>');			
													
														$('#ns1blankspaceBankAccountColumnReconcile2').html(aHTML.join(''));
														
														var aHTML = [];
															
														aHTML.push('<div class="ns1blankspaceHeaderCaption" style="width: 150px;margin-right:10px;margin-bottom:3px;">');
														aHTML.push('<span style="font-size:1.25em;">BANK</span>');
														aHTML.push('</div>');
													
														aHTML.push('<div id="ns1blankspaceBankAccountReconcileItems" style="width: 150px;margin-bottom:3px;"></div>');
														
														$('#ns1blankspaceBankAccountReconcileColumnItem').html(aHTML.join(''));
														
														$('#ns1blankspaceBankAccountReconcileItems').html(ns1blankspace.xhtml.loadingSmall);
														
														var oSearch = new AdvancedSearch();
														
														oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
														oSearch.addField('description,amount,posteddate');
														oSearch.sort('posteddate', 'desc');
														oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
														oSearch.addFilter('status', 'EQUAL_TO', 1);
														oSearch.addFilter('category', 'EQUAL_TO', (iType==1?2:1));
														oSearch.rows = ns1blankspace.option.defaultRows;
														oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.items.show(oParam, data)});		
													}
													else
													{				
														var aHTML = [];
													
														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<table id="ns1blankspaceReconcileItems"><tr class="ns1blankspace">');

															aHTML.push('<td class="ns1blankspaceNothing">There are no imported bank ' + (iType==1?'debit':'credit') +
																	' transactions.<br /><br />If you haven\'t aready, you can either import transactions from a file or reconcile from a statement.' +
																	'<br /><br /></td>');
																			
															aHTML.push('</tr></table>');

															$('#ns1blankspaceBankAccountReconcileItems').html(aHTML.join(''));	

															$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html('<span class="ns1blankspaceAction" id="ns1blankspaceShowAll"></span>');

															$('#ns1blankspaceShowAll').button({
																label: 'Show All Unreconciled ' + (iType==1?'Payments':'Receipts'),
															})
															.click(function() {
																$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html('');
																ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
															})
																
														}
														else
														{
															aHTML.push('<table id="ns1blankspaceReconcileItems">');
															
															$.each(oResponse.data.rows, function()
															{
																aHTML.push(
																	'<tr class="ns1blankspaceRow">' +
																	'<td class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																	'<table cellspacing=0 cellpadding=0><tr>');
																				
																aHTML.push('<td id="ns1blankspaceReconcileItems_date-' + this.id + '" class="recoitemstatement">' +
																							this.posteddate + '</td>');
																	
																
																aHTML.push('<td id="ns1blankspaceReconcileItems_amount-' + this.id + '" style="text-align:right;"' +
																						' class="recoitem">' +
																						Math.abs((this.amount).parseCurrency()).formatMoney(2, ".", ",") + '</td>');
																	
																aHTML.push('</tr><tr><td colspan=2 id="ns1blankspaceRecocileItems_description-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																						' class="recoitem">' +
																						this.description + '</td>');
																			
																aHTML.push('</tr></table></td>');	
																	
																if (iStatus == 1)
																{
																	if (this.posteddate)
																	{					
																		aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																		aHTML.push('<span id="ns1blankspaceReconcileItems_options_search-' + this.id + '"' +
																						' data-searchDate="' + this.posteddate + '"' +
																						' data-searchAmount="' + Math.abs((this.amount).parseCurrency()).toFixed(2) + '"' +
																						' class="ns1blankspaceReconcileItemsMatch"></span>');
																		aHTML.push('</td>');
																	};	
																}	
																		
																aHTML.push('</tr>');
															});
															
															aHTML.push('</table>');

															$('#ns1blankspaceBankAccountReconcileItems').html(aHTML.join(''));
														
															$('#ns1blankspaceReconcileItems .ns1blankspaceReconcileItemsRemove').button( {
																text: false,
																icons: {
																	primary: "ui-icon-close"
																}
															})
															.click(function() {
																oParam.xhtmlElementID = this.id;
																ns1blankspace.financial.bankAccount.reconcile.items.remove(oParam);
															})
															.css('width', '15px')
															.css('height', '17px')
															
															$('#ns1blankspaceReconcileItems .ns1blankspaceReconcileItemsMatch').button( {
																text: false,
																icons: {
																	primary: "ui-icon-play"
																}
															})
															.click(function() {
																$('#ns1blankspaceReconcileItems td.ns1blankspaceRowShaded').removeClass('ns1blankspaceRowShaded');
																$('td', $('#' + this.id).closest('tr')).addClass('ns1blankspaceRowShaded');
																var aID = (this.id).split('-');
																$.extend(true, oParam, {searchSourceID: aID[1], searchDate: $(this).attr("data-searchDate"), searchAmount: $(this).attr("data-searchAmount")});
																ns1blankspace.financial.bankAccount.reconcile.items.init(oParam);  //.edit
															})
															.css('width', '15px')
															.css('height', '17px')
														}
													}	
												},

									remove: 	function(oParam)
												{
													var sXHTMLElementID;
													var iReconciliation;

													if (oParam != undefined)
													{
														if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
														if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
														if (oParam.reconciliation != undefined) {iReconciliation = oParam.reconciliation}
													}
															
													var aXHTMLElementID = sXHTMLElementID.split('-');
													var sData = 'remove=1&reconciliation=' + ns1blankspace.util.fs(iReconciliation);

													if (aXHTMLElementID[2] == 1) {sData += '&object=3'}
													if (aXHTMLElementID[2] == 2) {sData += '&object=6'}

													sData += '&objectcontext=' + aXHTMLElementID[1];	

													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('FINANCIAL_RECONCILIATION_ITEM_MANAGE'),
														data: sData,
														dataType: 'json',
														success: function(data) {
															$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
														}
													});
												},

									init: 		function(oParam, oResponse)
												{
													var iStep = ns1blankspace.util.getParam(oParam, 'step', {default: 0}).value;
													var iType = ns1blankspace.util.getParam(oParam, 'type', {default: 1}).value;

													if (iStep == 0)
													{
														var sClass = (iType == 1?'debits':'credits')

														if (ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass] === undefined)
														{
															ns1blankspace.status.working('First time initalise');
															ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled = {};
															oParam = ns1blankspace.util.setParam(oParam, 'step', iStep + 1);
															ns1blankspace.financial.bankAccount.reconcile.items.init(oParam);
														}
														else
														{
															ns1blankspace.financial.bankAccount.reconcile.show(oParam)
														}
													}

													if (iStep == 1)
													{
														if (oResponse == undefined)
														{
															var oSearch = new AdvancedSearch();
																	
															if (iType == 1)
															{
																oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
																oSearch.addField('reference,description,amount,paiddate,reconciliation,contactbusinesspaidtotext,contactpersonpaidtotext');
															}	
															else
															{
																oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
																oSearch.addField('reference,description,amount,receiveddate,reconciliation,contactbusinessreceivedfromtext,contactpersonreceivedfromtext');
															}
														
															oSearch.addFilter('reconciliation', 'IS_NULL');
															oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext)
															oSearch.rows = 200;
															oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.items.init(oParam, data)});
														}
														else
														{
															var sType = (iType == 1?'payments':'receipts')
															ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sType] = oResponse.data.rows;
															oParam = ns1blankspace.util.setParam(oParam, 'step', iStep + 1);
															ns1blankspace.financial.bankAccount.reconcile.items.init(oParam);
														}	
													}	

													if (iStep == 2)
													{
														if (ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled['journals'] === undefined)
														{	
															if (oResponse == undefined)
															{
																var oSearch = new AdvancedSearch();
															
																oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_ITEM_SEARCH';
																oSearch.addField('taxcategory,creditamount,debitamount,generaljournalitem.generaljournal.reference,generaljournalitem.generaljournal.description,generaljournalitem.generaljournal.journaldate');
																oSearch.sort('generaljournalitem.generaljournal.journaldate', 'asc');
																oSearch.addFilter('reconciliation', 'IS_NULL');
																oSearch.rows = 200;
																oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.items.init(oParam, data)});
															}
															else
															{	
																ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled['journals'] = oResponse.data.rows;
																oParam = ns1blankspace.util.setParam(oParam, 'step', iStep + 1);
																ns1blankspace.financial.bankAccount.reconcile.items.init(oParam);
															}
														}
														else
														{
															oParam = ns1blankspace.util.setParam(oParam, 'step', iStep + 1);
															ns1blankspace.financial.bankAccount.reconcile.items.init(oParam);
														}	
													}

													if (iStep == 3)
													{
														ns1blankspace.status.message('');
														ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
													}
												},			

									edit:		function (oParam, oResponse)
												{
													var iObjectContext = ns1blankspace.objectContext;
													var sXHTMLElementID = '';
													var oOptions = {view: true, remove: true, automation: true};
													var oActions = {add: true};
													var iReconciliation;
													var iType = 1;
													var iSource = 1;
													var iEditAction = 1;
													var dSearchDate;
													var cSearchAmount;
													var sSearchReference;
													var iSearchSourceID;
													var iStatus = 2;
													var sXHTMLElementContainerID = 'ns1blankspaceBankAccountReconcileColumnItemEdit';
													var iObject;

													if (oParam != undefined)
													{
														if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
														if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
														if (oParam.options != undefined) {oOptions = oParam.options}
														if (oParam.actions != undefined) {oActions = oParam.actions}
														if (oParam.reconciliation != undefined) {iReconciliation = oParam.reconciliation}
														if (oParam.type != undefined) {iType = oParam.type}
														if (oParam.editAction != undefined) {iEditAction = oParam.editAction}
														if (oParam.searchDate != undefined) {dSearchDate = oParam.searchDate}
														if (oParam.searchAmount != undefined) {cSearchAmount = oParam.searchAmount}
														if (oParam.searchReference != undefined) {sSearchReference = oParam.searchReference}
														if (oParam.searchSourceID != undefined) {iSearchSourceID = oParam.searchSourceID}
														if (oParam.status != undefined) {iStatus = oParam.status}
														if (oParam.source != undefined) {iSource = oParam.source}
														if (oParam.xhtmlElementContainerID != undefined) {sXHTMLElementContainerID = oParam.xhtmlElementContainerID}
														if (oParam.object != undefined) {iObject = oParam.object}
													}		
													
													$.extend(true, oParam, {editAction: iEditAction, source: iSource, type: iType});
															
													if ($('#' + sXHTMLElementContainerID).html() == '')
													{
														var aHTML = [];
														
														aHTML.push('<table class="ns1blankspaceContainer">' +
																		'<tr class="ns1blankspaceContainer">' +
																		'<td id="ns1blankspaceReconcileItemEdit1"></td>' +
																		'<td id="ns1blankspaceReconcileItemEdit2" style="width:90px; border-left-style:solid; border-width:1px; border-color:#B8B8B8; padding-left:7px;"></td>' +
																		'</tr>' +
																		'</table>');			
													
														$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html(aHTML.join(''));
														
														var aHTML = [];

														aHTML.push('<div id="ns1blankspaceReconcileItemEditOption" style="width: 196;margin-bottom:3px;text-align:left;">');

														if (iType == 1)  //DEBITS (OUT)
														{	
															aHTML.push('<input type="radio" id="ns1blankspaceReconcileItemEdit-1" name="radioEdit" checked="checked" /><label for="ns1blankspaceReconcileItemEdit-1" style="width: 150px;">' +
																			'Payments & Journals</label>');

															aHTML.push('<input type="radio" id="ns1blankspaceReconcileItemEdit-2" name="radioEdit" /><label for="ns1blankspaceReconcileItemEdit-2" style="width: 80px;">' +
																			'Expenses</label>');
														}
														else if (iType == 2) //CREDITS (IN)
														{
															aHTML.push('<input type="radio" id="ns1blankspaceReconcileItemEdit-1" name="radioEdit" checked="checked" /><label for="ns1blankspaceReconcileItemEdit-1" style="width: 150px;">' +
																			'Receipts & Journals</label>');

															aHTML.push('<input type="radio" id="ns1blankspaceReconcileItemEdit-2" name="radioEdit" /><label for="ns1blankspaceReconcileItemEdit-2" style="width: 80px;">' +
																			'Invoices</label>');
														}

														aHTML.push('</div>');
													
														aHTML.push('<div id="ns1blankspaceReconcileItemsEdit"></div>');
														
														$('#ns1blankspaceReconcileItemEdit1').html(aHTML.join(''));
													}
												
													$('#ns1blankspaceReconcileItemEditOption').buttonset().css('font-size', '0.75em');
													
													$('#ns1blankspaceReconcileItemEditOption :radio').click(function()
													{
														var aID = (this.id).split('-');
														$.extend(true, oParam, {editAction: 1, source: parseInt(aID[1])});
														ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
													});
													
													if (iEditAction == 1)  //SET UP SEARCH PAYMENT OR RECEIPT +++
													{
														var aHTML = [];
														
														aHTML.push('<table style="width:100%;">');
														
														aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																		'Date' +
																		'</td></tr>' +
																		'<tr class="ns1blankspaceText">' +
																		'<td class="ns1blankspaceText">' +
																		'<input id="ns1blankspaceItemsEditSearchDate" class="ns1blankspaceDate">' +
																		'</td></tr>');
															
														aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																		'Amount' +
																		'</td></tr>' +
																		'<tr class="ns1blankspaceText">' +
																		'<td class="ns1blankspaceText">' +
																		'<input id="ns1blankspaceItemsEditSearchAmount" class="ns1blankspaceText">' +
																		'</td></tr>');

														aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																		'Reference' +
																		'</td></tr>' +
																		'<tr class="ns1blankspaceText">' +
																		'<td class="ns1blankspaceText">' +
																		'<input id="ns1blankspaceItemsEditSearchReference" class="ns1blankspaceText">' +
																		'</td></tr>');
																						
														aHTML.push('<tr><td class="ns1blankspaceAction">' +
																		'<span style="width:75px;" id="ns1blankspaceItemsEditSearch">Search</span>' +
																		'</td></tr>');

														aHTML.push('<tr><td class="ns1blankspaceAction">' +
																		'<span style="width:75px;" id="ns1blankspaceItemsEditClearSearch">Clear</span>' +
																		'</td></tr>');

														if (iSource == 1 || iSource == 2)
														{	
															aHTML.push('<tr><td class="ns1blankspaceAction" style="padding-top: 15px;">' +
																		'<span style="width:75px;" id="ns1blankspaceItemsEditAdd">Add</span>' +
																		'</td></tr>');
														}	
														
														aHTML.push('</table>');					
														
														$('#ns1blankspaceReconcileItemEdit2').html(aHTML.join(''));
													
														$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});
										
														$('#ns1blankspaceItemsEditSearchDate').val(dSearchDate);
														$('#ns1blankspaceItemsEditSearchAmount').val(cSearchAmount);
														$('#ns1blankspaceItemsEditSearchReference').val(sSearchReference);
																
														$('#ns1blankspaceItemsEditSearch').button( {
															label: 'Search',
															icons: {
																primary: "ui-icon-search"
															}
														})
														.click(function() {
															oParam.searchDate = $('#ns1blankspaceItemsEditSearchDate').val();
															oParam.searchAmount = $('#ns1blankspaceItemsEditSearchAmount').val();
															oParam.searchReference = $('#ns1blankspaceItemsEditSearchReference').val();
															ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
														})

														$('#ns1blankspaceItemsEditClearSearch').button( {
															label: 'Clear',
															icons: {
																primary: "ui-icon-close"
															}
														})
														.click(function()
														{
															oParam.searchDate = '';
															oParam.searchAmount = '';
															oParam.searchReference = '';
															ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
														})

														$('#ns1blankspaceItemsEditAdd').button( {
															label: 'Add',
															icons: {
																primary: "ui-icon-plus"
															}
														})
														.click(function()
														{
															$.extend(true, oParam, {editAction: 4});
															ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
														})
														
														$('#ns1blankspaceReconcileItemsEdit').html(ns1blankspace.xhtml.loadingSmall);
													}
													
													if (iEditAction == 1)  
													{
														if (iSource == 1) //SHOW PAYMENT/RECEIPT & JOURNALS
														{	
															var iTaxCategory = (iType==1?2:1);
															var sClass = (iType == 1?'debits':'credits')
															var sType = (iType == 1?'payments':'receipts')

															var oJournals = $.grep(ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled.journals,
																				function (a) {return a.taxcategory == iTaxCategory;});

															ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass] =
																	ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sType].concat(oJournals);

															$.each(ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass], function(i,k) 
															{
																if (k.paiddate) {k.date = k.paiddate}
																if (k.receiveddate) {k.date = k.receiveddate}
																if (k['generaljournalitem.generaljournal.journaldate'] !== undefined) {k.date = k['generaljournalitem.generaljournal.journaldate']}

																if (k['creditamount'] !== undefined)
																{
																	if (k['creditamount'] != 0)
																	{	
																		k.amount = k['creditamount'];
																	}	
																}

																if (k['debitamount'] !== undefined)
																{
																	if (k['debitamount'] != 0)
																	{	
																		k.amount = k['debitamount'];
																	}	
																}

																if (k.amount == undefined) {k.amount = 0}

																k.searchAmount = (k.amount).toString().parseCurrency();

																if (k['generaljournalitem.generaljournal.description'] !== undefined) {k.description = k['generaljournalitem.generaljournal.description']}
															});	

															if (cSearchAmount !== '' || sSearchReference !== '' || dSearchDate !== '')
															{
																ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass + '-searched'] = 
																	$.grep(ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass],
																	function (a)
																	{
																		return ((cSearchAmount !== ''?a.searchAmount == cSearchAmount:false) ||
																					(sSearchReference !== ''?a.reference == sSearchReference:false) ||
																					(dSearchDate !== ''?a.date == dSearchDate:false));
																	});  
															}
															else
															{
																ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass + '-searched'] =
																	ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass]
															}		

															var aHTML = [];
													
															if (ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass + '-searched'].length == 0)
															{
																if (iType == 1)
																{
																	var sHTML = 'There are no unreconciled payments or journals';

																	if (iSearchSourceID)
																	{	
																		sHTML += '<br / >that match this bank transaction.';
																		sHTML += '<br /><br />You can search for an existing expense<br / >or click Add';
																	}	
																}
																else if (iType == 2)
																{
																	var sHTML = 'There are no unreconciled receipts or journals';

																	if (iSearchSourceID)
																	{
																		sHTML += '<br / >that match this bank transaction.';
																		sHTML += '<br /><br />You can search for an existing invoice<br / >or click Add';
																	}	
																}	

																aHTML.push('<table><tr class="ns1blankspace">' +
																				'<td class="ns1blankspaceNothing">' + sHTML + '.</td>' +
																				'</tr></table>');

																$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));							
															}
															else
															{
																aHTML.push('<table id="ns1blankspaceReconcileItemsEdit">');
																
																$.each(ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass + '-searched'], function()
																{
																	aHTML.push(
																		'<tr class="ns1blankspaceRow">' +
																		'<td class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																		'<table cellspacing=0 cellpadding=0><tr>');
																					
																		if (this.paiddate)
																		{				
																			aHTML.push('<td id="ns1blankspaceReconcileItems_date-' + this.id + '-1" class="recoitempayment">' +
																								this.paiddate + '</td>');
																		}
																		else if (this.receiveddate)
																		{
																			aHTML.push('<td id="tdRecoItems_date-' + this.id + '-2" class="recoitemreceipt">' +
																								this.receiveddate + '</td>');
																		}							
																		else if (this.posteddate)
																		{
																			aHTML.push('<td id="ns1blankspaceReconcileItems_date-' + this.id + '" class="recoitemstatement">' +
																								this.posteddate + '</td>');
																		}
																	
																		aHTML.push('<td id="ns1blankspaceReconcileItems_amount-' + this.id + '" style="text-align:right;"' +
																							' class="recoitem">' +
																							this.amount + '</td>');
																		
																		var sDescription = this.description;

																		if (iType === 1)
																		{
																			if (this.contactbusinesspaidtotext !== '')
																			{
																				sDescription += '<br />' + this.contactbusinesspaidtotext
																			}

																			if (this.contactpersonpaidtotext !== '')
																			{
																				sDescription += '<br />' + this.contactpersonpaidtotext
																			}
																		}
																		else
																		{
																			if (this.contactbusinessreceivedfromtext !== '')
																			{
																				sDescription += '<br />' + this.contactbusinessreceivedfromtext
																			}

																			if (this.contactpersonreceivedfromtext !== '')
																			{
																				sDescription += '<br />' + this.contactpersonreceivedfromtext
																			}
																		}

																		aHTML.push('</tr><tr><td colspan=2 id="ns1blankspaceReconcileItems_reference-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																							' class="recoitem" title="' + this.reference + '">' +
																							sDescription + '</td>');
																					
																	aHTML.push('</tr></table></td>');	
																		

																	if (iStatus == 1)
																	{					
																		aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																		aHTML.push('<span id="ns1blankspaceReconcileItems_options_add-' + this.id + '-' + iType + '" class="ns1blankspaceReconcileItemsAdd"></span>');
																		aHTML.push('</td>');
																		aHTML.push('</tr>');
																	}	
																});
																
																aHTML.push('</table>');

																$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));

																$('#ns1blankspaceReconcileItemsEdit .ns1blankspaceReconcileItemsAdd').button( {
																text: false,
																icons: {
																	primary: "ui-icon-check"
																}
																})
																.click(function() {
																	oParam.editAction = 3;
																	oParam.xhtmlElementID = this.id;
																	ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
																})
																.css('width', '15px')
																.css('height', '17px')
															}			
														}

														else if (iSource == 2)  //SHOW EXPENSE OR INVOICE
														{
															if (oResponse == undefined)
															{
																var oSearch = new AdvancedSearch();
															
																if (iType == 1)
																{
																	oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
																	oSearch.addField('reference,description,amount,paymentduedate,contactbusinesspaidtotext,contactpersonpaidtotext');
																	if (dSearchDate) {oSearch.addFilter('paymentduedate', 'LESS_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-7).toString("dd-MMM-yyyy"))}
																	oSearch.sort('paymentduedate', 'asc');
																}	
																else
																{
																	oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
																	oSearch.addField('reference,description,amount,duedate,contactbusinesssenttotext,contactpersonsenttotext');
																	if (dSearchDate) {oSearch.addFilter('duedate', 'LESS_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-7).toString("dd-MMM-yyyy"))}
																	oSearch.sort('duedate', 'asc');
																}
															
																if (cSearchAmount) {oSearch.addFilter('amount', 'APPROX_EQUAL_TO', cSearchAmount)}
																if (sSearchReference) {oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchReference)}

																oSearch.rows = ns1blankspace.option.defaultRows;
																oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam, data)});
															}
															else
															{
																var aHTML = [];
														
																if (oResponse.data.rows.length == 0)
																{
																	aHTML.push('<table><tr class="ns1blankspace">' +
																					'<td class="ns1blankspaceNothing">No ' + (iType==1?'expenses':'invoices') + '.</td>' +
																					'</tr></table>');

																	$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));							
																}
																else
																{
																	aHTML.push('<table id="ns1blankspaceReconcileItemsEdit">');
																	
																	$.each(oResponse.data.rows, function()
																	{
																		aHTML.push(
																			'<tr class="ns1blankspaceRow">' +
																			'<td class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																			'<table cellspacing=0 cellpadding=0><tr>');
																						
																			if (this.paymentduedate)
																			{				
																				aHTML.push('<td id="ns1blankspaceReconcileItems_date-' + this.id + '-1" class="recoitempayment">' +
																									this.paymentduedate + ' / ' + this.reference + '</td>');
																			}
																			else if (this.duedate)
																			{
																				aHTML.push('<td id="tdRecoItems_date-' + this.id + '-2" class="recoitemreceipt">' +
																									this.duedate + ' / ' + this.reference + '</td>');
																			}							
																			else if (this.journaldate)
																			{
																				aHTML.push('<td id="ns1blankspaceReconcileItems_date-' + this.id + '-3" class="recoitemstatement">' +
																									this.journaldate + '</td>');
																			}
																		
																			aHTML.push('<td id="ns1blankspaceReconcileItems_amount-' + this.id + '" style="text-align:right;"' +
																								' class="recoitem">' +
																								this.amount + '</td>');
																			
																			var sDescription = this.description;

																			if (iType === 1)
																			{
																				if (this.contactbusinesspaidtotext !== '')
																				{
																					sDescription += '<br />' + this.contactbusinesspaidtotext
																				}

																				if (this.contactpersonpaidtotext !== '')
																				{
																					sDescription += '<br />' + this.contactpersonpaidtotext
																				}
																			}
																			else
																			{
																				if (this.contactbusinesssenttotext !== '')
																				{
																					sDescription += '<br />' + this.contactbusinesssenttotext
																				}

																				if (this.contactpersonsenttotext !== '')
																				{
																					sDescription += '<br />' + this.contactpersonsenttotext
																				}
																			}

																			aHTML.push('</tr><tr><td colspan=2 id="ns1blankspaceReconcileItems_reference-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																								' class="recoitem" title="' + this.reference + '">' +
																								sDescription + '</td>');
																						
																		aHTML.push('</tr></table></td>');	
																			

																		if (iStatus == 1)
																		{					
																			aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																			aHTML.push('<span id="ns1blankspaceReconcileItems_options_add-' + this.id + '-' + iType + '"' +
																							' data-amount="' + this.amount + '"' +
																							' class="ns1blankspaceReconcileItemsAdd"></span>');
																			aHTML.push('</td>');
																			aHTML.push('</tr>');
																		}	
																	});
																	
																	aHTML.push('</table>');

																	$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));

																	$('#ns1blankspaceReconcileItemsEdit .ns1blankspaceReconcileItemsAdd').button( {
																	text: false,
																	icons: {
																		primary: "ui-icon-check"
																	}
																	})
																	.click(function() {
																		oParam.editAction = 5;
																		oParam.xhtmlElementID = this.id;
																		oParam.accruedAmount = $(this).attr('data-amount');
																		oParam.object = undefined;
																		ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
																	})
																	.css('width', '15px')
																	.css('height', '17px')
																}		
															}	
														}

														else if (iSource == 3)  //JOURNAL
														{
															if (oResponse == undefined)
															{
																var oSearch = new AdvancedSearch();
															
																oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_ITEM_SEARCH';
																oSearch.addField('creditamount,debitamount,generaljournalitem.generaljournal.reference,generaljournalitem.generaljournal.description,generaljournalitem.generaljournal.journaldate');
																//oSearch.addSummaryField('sum(generaljournal.generaljournalitem.creditamount) amount');
																if (dSearchDate) {oSearch.addFilter('journaldate', 'LESS_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-7).toString("dd-MMM-yyyy"))}
																oSearch.sort('generaljournalitem.generaljournal.journaldate', 'asc');
																oSearch.addFilter('reconciliation', 'IS_NULL');

																oSearch.addFilter('taxcategory', 'EQUAL_TO', (iType==1?2:1));

																if (cSearchAmount) {oSearch.addFilter('creditamount', 'APPROX_EQUAL_TO', cSearchAmount)}
																if (sSearchReference) {oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchReference)}

																oSearch.rows = ns1blankspace.option.defaultRows;
																oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam, data)});
															}
															else
															{
																var aHTML = [];
														
																if (oResponse.data.rows.length == 0)
																{
																	aHTML.push('<table><tr class="ns1blankspace">' +
																					'<td class="ns1blankspaceNothing">No general journals</td>' +
																					'</tr></table>');

																	$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));							
																}
																else
																{
																	aHTML.push('<table id="ns1blankspaceReconcileItemsEdit">');
																	
																	$.each(oResponse.data.rows, function()
																	{
																		aHTML.push(
																			'<tr class="ns1blankspaceRow">' +
																			'<td class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																			'<table cellspacing=0 cellpadding=0><tr>');

																		aHTML.push('<td id="ns1blankspaceReconcileItems_date-' + this.id + '-3" class="recoitemstatement">' +
																								this['generaljournalitem.generaljournal.journaldate'] + '</td>');
																		
																		var cAmount = this.debitamount;

																		if (iType == 1) {cAmount = this.creditamount};

																		aHTML.push('<td id="ns1blankspaceReconcileItems_amount-' + this.id + '" style="text-align:right;"' +
																							' class="recoitem">' +
																							cAmount + '</td>');
																		
																		var sDescription = this['generaljournalitem.generaljournal.description'];

																		aHTML.push('</tr><tr><td colspan=2 id="ns1blankspaceReconcileItems_reference-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																							' class="recoitem" title="' + this['generaljournalitem.generaljournal.reference'] + '">' +
																							sDescription + '</td>');
																						
																		aHTML.push('</tr></table></td>');	
																			
																		if (iStatus == 1)
																		{					
																			aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																			aHTML.push('<span id="ns1blankspaceReconcileItems_options_add-' + this.id + '-3"' +
																							' data-amount="' + cAmount + '"' +
																							' class="ns1blankspaceReconcileItemsAdd"></span>');
																			aHTML.push('</td>');
																			aHTML.push('</tr>');
																		}	
																	});
																	
																	aHTML.push('</table>');

																	$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));

																	$('#ns1blankspaceReconcileItemsEdit .ns1blankspaceReconcileItemsAdd').button( {
																	text: false,
																	icons: {
																		primary: "ui-icon-check"
																	}
																	})
																	.click(function() {
																		oParam.editAction = 3;
																		oParam.xhtmlElementID = this.id;
																		oParam.object = 122;
																		ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
																	})
																	.css('width', '15px')
																	.css('height', '17px')
																}		
															}	
														}
													}

													else if (iEditAction == 3)  //MARK PAYMENT / RECEIPT / JOURNAL AS RECONCILED
													{
														ns1blankspace.status.working();

														var aXHTMLElementID = sXHTMLElementID.split('-');
														var sData = 'reconciliation=' + ns1blankspace.util.fs(iReconciliation);

														if (iObject === undefined)
														{	
															if (iType == 1) {sData += '&object=3'}
															if (iType == 2) {sData += '&object=6'}
														}
														else
														{
															sData += '&object=' + ns1blankspace.util.fs(iObject);
														}	

														sData += '&objectcontext=' + aXHTMLElementID[1];	

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_RECONCILIATION_ITEM_MANAGE'),
															data: sData,
															dataType: 'json',
															success: function(data)
															{
																$('#' + sXHTMLElementID).parent().parent().fadeOut(500);

																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE'),
																	data: 'status=2&id=' + iSearchSourceID,
																	dataType: 'json',
																	success: function(data)
																	{
																		$('#ns1blankspaceReconcileItems_options_search-' + iSearchSourceID).parent().parent().fadeOut(500);
																		ns1blankspace.status.message('Reconciled');
																	}
																})
															}
														});
													}	
													
													else if (iEditAction == 4) //MANUALLY ADD PAYMENT OR RECEIPT
													{
														if (oResponse == undefined)
														{
															var aHTML = [];
															
															aHTML.push('<table class="ns1blankspace" style="width:290px;">');							
															
															aHTML.push('<tr class="ns1blankspaceCaption">' +
																			'<td class="ns1blankspaceCaption">' +
																			'Date' +
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceText">' +
																			'<input id="ns1blankspaceItemsEditDate" class="ns1blankspaceDate">' +
																			'</td></tr>');

															aHTML.push('<tr class="ns1blankspaceCaption">' +
																			'<td class="ns1blankspaceCaption">' +
																			'Amount' +
																			'</td></tr>' +
																			'<tr class="ns1blankspaceText">' +
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
																			'Business' +
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceSelect">' +
																			'<input id="ns1blankspaceItemsEditContactBusiness" class="ns1blankspaceSelect"' +
																				' data-method="CONTACT_BUSINESS_SEARCH"' +
																				' data-columns="tradename">' +
																			'</td></tr>');
																		
															aHTML.push('<tr class="ns1blankspaceCaption">' +
																			'<td class="ns1blankspaceCaption">' +
																			'Person' +
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceSelect">' +
																			'<input id="ns1blankspaceItemsEditContactPerson" class="ns1blankspaceSelect"' +
																				' data-method="CONTACT_PERSON_SEARCH"' +
																				' data-columns="surname"' +
																				' data-parent="ns1blankspaceItemsEditContactBusiness"' +
																				' data-parent-search-id="contactbusiness"' +
																				' data-parent-search-text="tradename">' +
																			'</td></tr>');		
														
															aHTML.push('<tr class="ns1blankspaceCaption">' +
																			'<td class="ns1blankspaceCaption">' +
																			'Description' +
																			'</td></tr>' +
																			'<tr class="ns1blankspaceTextMulti">' +
																			'<td class="ns1blankspaceTextMulti">' +
																			'<textarea rows="3" cols="35" id="ns1blankspaceItemsEditDescription" class="ns1blankspaceTextMultiSmall"></textarea>' +
																			'</td></tr>');
															
															aHTML.push('<tr class="ns1blankspaceCaption">' +
																			'<td class="ns1blankspaceCaption">' +
																			'Financial Account' +
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceSelect">' +
																			'<input id="ns1blankspaceFinancialAccount" class="ns1blankspaceSelect"' +
																				' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
																				' data-columns="title">' +
																			'</td></tr>');	

															aHTML.push('</table>');					
														
															$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));
														
															$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});

															$('#ns1blankspaceItemsEditDate').val(dSearchDate);
															$('#ns1blankspaceItemsEditAmount').val(cSearchAmount);

															if (cSearchAmount)
															{	
																$('#ns1blankspaceItemsEditContactBusiness').focus();
															}	

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

															var aHTML = [];
															
															aHTML.push('<table>');
															
															aHTML.push('<tr><td id="ns1blankspaceReconcileItemsEditSave" class="interfaceMainAction">' +
																			'<span id="ns1blankspaceReconcileItemsEditSave">Save</span>' +
																			'</td></tr>');
															
															aHTML.push('</table>');					
															
															$('#ns1blankspaceReconcileItemEdit2').html(aHTML.join(''));
														
															$('#ns1blankspaceReconcileItemsEditSave').button( {
																text: false,
																icons: {
																	primary: "ui-icon-check"
																}
															})
															.click(function()
															{
																if (iType == 1 && iSource == 1) {iObject = 3}  //PAYMENT
																if (iType == 1 && iSource == 2) {iObject = 2}  //EXPENSE
																if (iType == 2 && iSource == 1) {iObject = 6}  //RECEIPT
																if (iType == 2 && iSource == 2) {iObject = 5}  //INVOICE

																ns1blankspace.financial.save.send(
																{
																	date: $('#ns1blankspaceItemsEditDate').val(),
																	description: $('#ns1blankspaceItemsEditDescription').val(),
																	contactBusiness: $('#ns1blankspaceItemsEditContactBusiness').attr('data-id'),
																	contactPerson: $('#ns1blankspaceItemsEditContactPerson').attr('data-id'),
																	financialAccount: $('#ns1blankspaceFinancialAccount').attr('data-id'),
																	object: iObject,
																	bankAccount: ns1blankspace.objectContext,
																	amount: $('#ns1blankspaceItemAmount').val(),
																	postSave: ns1blankspace.financial.bankAccount.reconcile.items.edit
																});
															})
														}
														else
														{
															if (iSource == 1)
															{
																oParam.editAction = 3;
																ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
															}
															else
															{	
																oParam.xhtmlElementID = '-' + (oResponse.id);
																oParam.editAction = 5;
																ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
															}	
														}
													}

													else if (iEditAction == 5)  //PAY EXISTING EXPENSE OR RECEIPT INVOICE & THEN RECONCILE
													{
														ns1blankspace.status.working((iType==1?'creating payment':'creating receipt') + '..');

														var cAccruedAmount;

														if (oParam != undefined)
														{
															if (oParam.accruedAmount != undefined) {cAccruedAmount = oParam.accruedAmount}
														}		

														var aXHTMLElementID = sXHTMLElementID.split('-');
														
														if (iSearchSourceID)
														{
															var oSearchSource = $('#ns1blankspaceReconcileItems_options_search-' + iSearchSourceID);
															//var dDate = oSearchSource.attr('data-searchDate');  
															//NEED TO KNOW LOCKED ENDDATE
															var dDate = Date.today().toString("dd-MMM-yyyy");
															var cAmount = oSearchSource.attr('data-searchAmount');
														}
														else
														{
															var dDate = Date.today().toString("dd-MMM-yyyy");
															var cAmount = cAccruedAmount;
														}

														if ((cAmount).parseCurrency() > (cAccruedAmount).parseCurrency())
														{
															ns1blankspace.status.error('Bank transaction amount is to large!')
														}
														else
														{
															if (oParam != undefined)
															{
																if (oParam.amount != undefined) {cAmount = oParam.amount}
																if (oParam.date != undefined) {dDate = oParam.date}	
															}
																
															var sData = 'id=' + ns1blankspace.util.fs(aXHTMLElementID[1]);
															sData += '&amount=' + ns1blankspace.util.fs(cAmount);
															sData += '&receiptdate=' + ns1blankspace.util.fs(dDate);
															sData += '&paymentmethod=3';
															sData += '&bankaccount=' + ns1blankspace.objectContext;
																	
															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI((iType==1?'FINANCIAL_AUTO_PAYMENT':'FINANCIAL_AUTO_RECEIPT')),
																data: sData,
																dataType: 'json',
																success: function(data)
																{
																	if (data.status == 'OK')
																	{	
																		oParam.xhtmlElementID = '-' + (iType==1?data.payment:data.receipt);
																		oParam.editAction = 3;
																		ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
																	}
																	else
																	{
																		ns1blankspace.status.error(data.error.errornotes);
																	}	
																}
															});
														}	
													}	
												},

									locked: 	function(oParam, oResponse)
												{
													var iType = 1;
													var iSource = 1;
													var dSearchDate;
													var cSearchAmount;
													var sSearchReference;
													
													if (oParam != undefined)
													{
														if (oParam.reconciliation != undefined) {iReconciliation = oParam.reconciliation}
														if (oParam.type != undefined) {iType = oParam.type}
														if (oParam.source != undefined) {iSource = oParam.source}
														if (oParam.searchDate != undefined) {dSearchDate = oParam.searchDate}
														if (oParam.searchAmount != undefined) {cSearchAmount = oParam.searchAmount}
														if (oParam.searchReference != undefined) {sSearchReference = oParam.searchReference}
													}		

													if (oResponse === undefined)
													{	
														var aHTML = [];
											
														aHTML.push('<div style="font-size:0.75em;"><table class="ns1blankspaceColumn2">' +
																		'<tr class="ns1blankspaceContainer">' +
																		'<td id="ns1blankspaceReconcileItemLocked1"></td>' +
																		'<td id="ns1blankspaceReconcileItemLocked2" style="width:90px; border-left-style:solid; border-width:1px; border-color:#B8B8B8; padding-left:7px;"></td>' +
																		'</tr>' +
																		'</table></div>');			
													
														$('#ns1blankspaceBankAccountColumnReconcile2').html(aHTML.join(''));
														
														var aHTML = [];

														aHTML.push('<div id="ns1blankspaceReconcileItemLockedOption" style="width: 196;margin-bottom:3px;text-align:left;">');

														if (iType == 1)  //DEBITS (OUT)
														{	
															aHTML.push('<input type="radio" id="ns1blankspaceReconcileItemLocked-1" value="1" name="radioLockedSource"/><label for="ns1blankspaceReconcileItemLocked-1" style="width: 80px;">' +
																			'Payments</label>');
														}
														else if (iType == 2) //CREDITS (IN)
														{
															aHTML.push('<input type="radio" id="ns1blankspaceReconcileItemLocked-1" value="1" name="radioLockedSource" /><label for="ns1blankspaceReconcileItemLocked-1" style="width: 80px;">' +
																			'Receipts</label>');
														}

														aHTML.push('<input type="radio" id="ns1blankspaceReconcileItemLocked-3" value="3" name="radioLockedSource" /><label for="ns1blankspaceReconcileItemLocked-3" style="width: 80px;">' +
																		'Journal</label>');

														aHTML.push('</div>');
													
														aHTML.push('<div id="ns1blankspaceReconcileItemsLocked"></div>');
														
														$('#ns1blankspaceReconcileItemLocked1').html(aHTML.join(''));

														$('[name="radioLockedSource"][value="' + iSource + '"]').attr('checked', 'checked');

														$('#ns1blankspaceReconcileItemLockedOption').buttonset().css('font-size', '0.75em');
														
														$('#ns1blankspaceReconcileItemLockedOption :radio').click(function()
														{
															var aID = (this.id).split('-');
															$.extend(true, oParam, {source: parseInt(aID[1])});
															ns1blankspace.financial.bankAccount.reconcile.items.locked(oParam);
														});
										
														var aHTML = [];
																
														aHTML.push('<table style="width:100%;">');
														
														aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																		'Date' +
																		'</td></tr>' +
																		'<tr class="ns1blankspaceText">' +
																		'<td class="ns1blankspaceText">' +
																		'<input id="ns1blankspaceItemsLockedSearchDate" class="ns1blankspaceDate">' +
																		'</td></tr>');
															
														aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																		'Amount' +
																		'</td></tr>' +
																		'<tr class="ns1blankspaceText">' +
																		'<td class="ns1blankspaceText">' +
																		'<input id="ns1blankspaceItemsLockedSearchAmount" class="ns1blankspaceText">' +
																		'</td></tr>');

														aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																		'Reference' +
																		'</td></tr>' +
																		'<tr class="ns1blankspaceText">' +
																		'<td class="ns1blankspaceText">' +
																		'<input id="ns1blankspaceItemsLockedSearchReference" class="ns1blankspaceText">' +
																		'</td></tr>');
																						
														aHTML.push('<tr><td class="ns1blankspaceAction">' +
																		'<span style="width:75px;" id="ns1blankspaceItemsLockedSearch">Search</span>' +
																		'</td></tr>');

														aHTML.push('<tr><td class="ns1blankspaceAction">' +
																		'<span style="width:75px;" id="ns1blankspaceItemsLockedClearSearch">Clear</span>' +
																		'</td></tr>');

														aHTML.push('</table>');					
														
														$('#ns1blankspaceReconcileItemLocked2').html(aHTML.join(''));
													
														$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});
										
														$('#ns1blankspaceItemsLockedSearchDate').val(dSearchDate);
														$('#ns1blankspaceItemsLockedSearchAmount').val(cSearchAmount);
														$('#ns1blankspaceItemsLockedSearchReference').val(sSearchReference);
																
														$('#ns1blankspaceItemsLockedSearch').button( {
															label: 'Search',
															icons: {
																primary: "ui-icon-search"
															}
														})
														.click(function() {
															oParam.searchDate = $('#ns1blankspaceItemsLockedSearchDate').val();
															oParam.searchAmount = $('#ns1blankspaceItemsLockedSearchAmount').val();
															oParam.searchReference = $('#ns1blankspaceItemsLockedSearchReference').val();
															ns1blankspace.financial.bankAccount.reconcile.items.locked(oParam);
														})

														$('#ns1blankspaceItemsLockedClearSearch').button( {
															label: 'Clear',
															icons: {
																primary: "ui-icon-close"
															}
														})
														.click(function()
														{
															oParam.searchDate = undefined;
															oParam.searchAmount = undefined;
															oParam.searchReference = undefined;
															ns1blankspace.financial.bankAccount.reconcile.items.locked(oParam);
														})
													
														$('#ns1blankspaceReconcileItemsLocked').html(ns1blankspace.xhtml.loadingSmall);

														var oSearch = new AdvancedSearch();

														if (iSource == 1)
														{	
															if (iType == 1)
															{
																oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
																oSearch.addField('reference,description,amount,paiddate,reconciliation,contactbusinesspaidtotext,contactpersonpaidtotext');
																if (dSearchDate) {oSearch.addFilter('paiddate', 'GREATER_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-7).toString("dd-MMM-yyyy"))}
																oSearch.sort('paiddate', 'asc');
															}	
															else
															{
																oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
																oSearch.addField('reference,description,amount,receiveddate,reconciliation,contactbusinessreceivedfromtext,contactpersonreceivedfromtext');
																if (dSearchDate) {oSearch.addFilter('receiveddate', 'GREATER_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-7).toString("dd-MMM-yyyy"))}
																oSearch.sort('receiveddate', 'asc');
															}

															if (cSearchAmount) {oSearch.addFilter('amount', 'APPROX_EQUAL_TO', cSearchAmount)}
														}
														else
														{
															oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_ITEM_SEARCH';
															oSearch.addField('creditamount,debitamount,generaljournalitem.generaljournal.reference,generaljournalitem.generaljournal.description,generaljournalitem.generaljournal.journaldate');
															
															if (dSearchDate) {oSearch.addFilter('journaldate', 'LESS_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-7).toString("dd-MMM-yyyy"))}
															
															if (cSearchAmount) {oSearch.addFilter((iType==1?'creditamount':'debitamount'), 'APPROX_EQUAL_TO', cSearchAmount)}
															
															oSearch.addFilter('taxcategory', 'EQUAL_TO', (iType==1?2:1));

															oSearch.sort('generaljournalitem.generaljournal.journaldate', 'asc');
														}	

														if (sSearchReference) {oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchReference)}
														oSearch.addFilter('reconciliation', 'EQUAL_TO', iReconciliation);

														oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.items.locked(oParam, data)});
													}
													else
													{
														var aHTML = [];
														
														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<table><tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceNothing">No items</td>' +
																			'</tr></table>');

															$('#ns1blankspaceReconcileItemsLocked').html(aHTML.join(''));							
														}
														else
														{
															aHTML.push('<table id="ns1blankspaceReconcileItemsEdit">');
															
															$.each(oResponse.data.rows, function()
															{
																aHTML.push(
																	'<tr class="ns1blankspaceRow">' +
																	'<td class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																	'<table cellspacing=0 cellpadding=0><tr>');

																var dDate;
																var cAmount = this.amount;
																var sDescription = this.description;

																if (iSource == 1 && iType == 1)  //PAYMENT
																{	
																	dDate = this.paiddate;
																}
																	
																if (iSource == 1 && iType == 2)  //RECEIPT
																{	
																	dDate = this.receiveddate
																}

																if (iSource == 3)  //JOURNAL
																{	
																	dDate = this['generaljournalitem.generaljournal.journaldate'];
																	cAmount = this.debitamount;

																	if (iType == 1) {cAmount = this.creditamount};
																	var sDescription = this['generaljournalitem.generaljournal.description'];
																}

																aHTML.push('<td id="ns1blankspaceReconcileItems_date-' + this.id + '-3" class="recoitemstatement">' +
																						dDate + '</td>');
																
																aHTML.push('<td id="ns1blankspaceReconcileItems_amount-' + this.id + '" style="text-align:right;"' +
																					' class="recoitem">' +
																					cAmount + '</td>');
																
																aHTML.push('</tr><tr><td colspan=2 id="ns1blankspaceReconcileItems_reference-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																					' class="recoitem" title="' + this.reference + '">' +
																					sDescription + '</td>');
																				
																aHTML.push('</tr></table></td>');	

																if (false)
																{					
																	aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																	aHTML.push('<span id="ns1blankspaceReconcileItems_options_remove-' + this.id + '-3"' +
																					' data-amount="' + cAmount + '"' +
																					' class="ns1blankspaceReconcileItemsRemove"></span>');
																	aHTML.push('</td>');
																	aHTML.push('</tr>');
																}	
															});
															
															aHTML.push('</table>');

															$('#ns1blankspaceReconcileItemsLocked').html(aHTML.join(''));
														}	
													}

												}	
								}
				},

	import: 	{
					show:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceBankAccountImportColumn1" style="width: 100px;padding-right:5px;font-size:0.875em;" class="ns1blankspaceColumn1">' +
													ns1blankspace.xhtml.loading +
													'</td>' +
													'<td id="ns1blankspaceBankAccountImportColumn2" class="ns1blankspaceColumn2">' +
													'</td>' +
													'</tr>' +
													'</table>');				
										
										$('#ns1blankspaceMainImport').html(aHTML.join(''));

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_SEARCH';
										oSearch.addField('startdate,enddate,processeddate');
										oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.sort('processeddate', 'desc');
										oSearch.rows = ns1blankspace.option.defaultRows;
										oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.import.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="tableInterfaceFinancialHomeMostLikely">');
											
											aHTML.push('<tr><td class="ns1blankspaceNothing">No existing imports.</td></tr>');

											aHTML.push('</table>');
											
											$('#ns1blankspaceBankAccountImportColumn1').html(aHTML.join(''));	
										}
										else
										{		
											aHTML.push('<table class="ns1blankspace">');
											
											$(oResponse.data.rows).each(function(i) 
											{
												if (i==0)
												{
													//aHTML.push('<tr><td style="font-size:0.75em;"><span id="ns1blankspaceBankAccountImportAdd">Import</span></td></tr>');
												}
												
												aHTML.push(ns1blankspace.financial.bankAccount.import.row(this));
											});
											
											aHTML.push('</table>');
											
											$('#ns1blankspaceBankAccountImportColumn1').html(aHTML.join(''));
										}
											
										$('#ns1blankspaceBankAccountImportAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											ns1blankspace.financial.bankAccount.import.add();
										})
										.css("width", "75px");
										
										$('.ns1blankspaceBankAccountImportRowSelect').click(function()
										{
											var aID = (this.id).split('-');
											ns1blankspace.financial.bankAccount.import.items.show({fileSource: aID[1]});
										});

										ns1blankspace.financial.bankAccount.import.add();
									}
								},

					row:		function (oRow)
								{
									var aHTML = [];

									if (oRow.processeddate != '')
									{
										aHTML.push('<tr class="ns1blankspaceRow">');

										aHTML.push('<td id="ns1blankspaceBankAccountImport_processeddate-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceBankAccountImportRowSelect"' +
																'">' + oRow.processeddate + '<br />');
															
										if (oRow.startdate != '')
										{		
											aHTML.push('<span class="ns1blankspaceSub" id="ns1blankspaceBankAccountImport_startdate-' + oRow.id + '">' +
																oRow.startdate + '</span><br />');	
										}

										if (oRow.enddate != oRow.startdate)
										{		
											aHTML.push('<span class="ns1blankspaceSub" id="ns1blankspaceBankAccountImport_enddate-' + oRow.id + '">' +
																oRow.enddate + '</span><br />');	
										}
									
										aHTML.push('</tr>');
									}
										
									return aHTML.join('');
								},

					add:		function (oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.objectContext;
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
										
										aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>');							
										aHTML.push(ns1blankspace.attachments.upload.show(
														{	
															object: 28,
															objectContext: -1,
															label: ''
														}));
										
										aHTML.push('</td></tr></table>');

										$('#ns1blankspaceBankAccountImportColumn2').html(aHTML.join(''));
										
										$('input.ns1blankspaceUpload').change(function()
										{
											if ($(this).val() != '')
											{
												$('#ns1blankspaceUpload').button(
												{
													label: "Upload Bank File"
												})
												.click(function()
												{
													if ($('#oFile0').val() == '')
													{
														ns1blankspace.status.error("Need to select a file.");
													}
													else
													{
														var sData = 'processeddate=' + Date.today().toString("dd-MMM-yyyy");
														sData += '&bankaccount=' + ns1blankspace.objectContext;
														
														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_MANAGE'),
															data: sData,
															dataType: 'json',
															success: function(data) {
																ns1blankspace.financial.bankAccount.import.add(oParam, data);
															}
														});
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
											ns1blankspace.attachments.upload.process({functionPostUpdate: ns1blankspace.financial.bankAccount.import.process});
										}	
									}	
								},

					process:	function (oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'CORE_ATTACHMENT_SEARCH';
										oSearch.addField('type,filename,description,download,modifieddate');
										oSearch.addFilter('object', 'EQUAL_TO', 28);
										oSearch.addFilter('objectcontext', 'EQUAL_TO', $('#objectcontext').val());
										oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.import.process(data)});
									}
									else
									{
										if (oResponse.data.rows.length !=0)
										{	
											var sData = 'id=' + oResponse.data.rows[0].id;
									
											ns1blankspace.status.working();

											$('#ns1blankspaceUploadStatus').html('Processing file transactions...');

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_PROCESS'),
												data: sData,
												dataType: 'json',
												success: function(data) {
													ns1blankspace.status.message('Transactions processed.')
													ns1blankspace.financial.bankAccount.import.show();
												}
											});	
										}
									}	
								},

					items:   	{
									show:		function(oParam, oResponse)
												{
													var iFileSource;
								
													if (oParam != undefined)
													{
														if (oParam.fileSource != undefined) {iFileSource = oParam.fileSource}
													}		

													if (oResponse === undefined)
													{	
														$('#ns1blankspaceBankAccountImportColumn2').html(ns1blankspace.xhtml.loading);

														var oSearch = new AdvancedSearch();
														oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
														oSearch.addField('amount,area,areatext,bankaccount,bankaccounttext,capital,category,categorytext,' +
																			'contactbusiness,contactbusinesstext,contactperson,contactpersontext,description,' +
																			'externalid,financialaccount,financialaccounttext,posteddate,project,projecttext,' +
																			'source,sourcetext,status,statustext,tax,taxtype,taxtypeexpensetext,taxtyperevenuetext,type,typetext');
														oSearch.sort('posteddate', 'desc');
														oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
														if (iFileSource) {oSearch.addFilter('source', 'EQUAL_TO', iFileSource);}
														oSearch.rows = ns1blankspace.option.defaultRows;
														oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.import.items.show(oParam, data)});
													}
													else
													{
														var aHTML = [];
					
														aHTML.push('<table id="ns1blankspaceFinancialBankImportItems" class="ns1blankspaceColumn2" style="font-size:0.875em;">');
													
														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<tr><td class="ns1blankspaceNothing">No transactions.</td></tr>');
															aHTML.push('</table>');
														}
														else
														{		
															aHTML.push('<tr class="ns1blankspaceCaption">');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Status</td>');
															aHTML.push('</tr>');
															
															$(oResponse.data.rows).each(function()
															{
																aHTML.push('<tr class="ns1blankspaceRow">');
																	
																aHTML.push('<td id="ns1blankspaceFinancialImportItem_Date-' + this.id + '" class="ns1blankspaceRow">' +
																						this["posteddate"] + '</td>');
																							
																aHTML.push('<td id="ns1blankspaceFinancialImportItem_Description-' + this.id + '" class="ns1blankspaceRow">' +
																						this["description"] + '</td>');

																aHTML.push('<td id="ns1blankspaceFinancialImportItem_Amount-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																						 parseFloat(this["amount"]).toFixed(2) + '</td>');						
																				
																aHTML.push('<td class="ns1blankspaceRow">');

																if (this.status == 1)
																{	
																	aHTML.push('<span id="ns1blankspaceFinancialImportItem_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
																}
																else
																{
																	aHTML.push(this.statustext);
																}

																aHTML.push('</td>');					
																																			
																aHTML.push('</tr>');
															});	
														}
															
														aHTML.push('</table>');
													
														$('#ns1blankspaceBankAccountImportColumn2').html(aHTML.join(''));

														$('#ns1blankspaceFinancialBankImportItems .ns1blankspaceRowRemove').button(
														{
															text: false,
														 	icons: {primary: "ui-icon-close"}
														})
														.click(function() {
															$.extend(true, oParam, {step: 5, xhtmlElementID: this.id});
															ns1blankspace.financial.bankAccount.import.items.remove({xhtmlElementID: this.id})
														})
														.css('width', '15px')
														.css('height', '20px')

													}
												},

									remove: 	function (oParam)
												{
													var sID;
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
															
													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE'),
														data: 'remove=1&id=' + sID,
														dataType: 'json',
														success: function(data)
														{
															if (data.status == 'OK')
															{
																$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
															}
															else
															{
																ns1blankspace.status.error(oResponse.error.errornotes);
															}
														}
													});
												}			
								}									
				}
}								
