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
					var bShowHome = true
					var bInitialised = false;
					var iID;

					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}
						if (oParam.id != undefined) {iID = oParam.id}	
					}

					ns1blankspace.object = -1;
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
										
						ns1blankspace.app.reset();
						ns1blankspace.app.set(oParam);

						//ns1blankspace.financial.bankAccount.show({id: iID})
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
						}	
					}	
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
									'</tr>');
					
					aHTML.push('</table>');
					
					aHTML.push('<table class="ns1blankspaceControl">');

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlReconcile" class="ns1blankspaceControl">Reconcile</td>' +
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
						$('#ns1blankspaceViewControlAction').button({disabled: false});
							
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
				
					aHTML.push('<table class="ns1blankspace">' +
									'<tr><td class="ns1blankspaceSub">' +
									'This bank account was last reconciled on the ' +
									 ns1blankspace.objectContextData.lastreconcileddate + '.' +
									'</td></tr></table>');					

					$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
					
					var aHTML = [];
					
					aHTML.push('<table cellpadding=6 class="ns1blankspaceColumn2" style="font-size:0.75em;">' +
									'<tr><td class="ns1blankspaceSub" colspan=2>You have a number of options when reconciling a bank account.</td></tr>' + 
									'<tr><td class="ns1blankspaceCaption" style="width:15px;padding-bottom:10px;">1</td><td class="ns1blankspaceSub">' +
									'Use a printed or PDF bank statement directly.  In this case you skip the import step and go straight to reconcile.' +
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

										aHTML.push('<table class="ns1blankspace">' +
														'<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceBankAccountColumnReconcile1" style="width: 85px;padding-right:5px;font-size:0.875em;" class="ns1blankspaceColumn1">' +
														ns1blankspace.xhtml.loading +
														'</td>' +
														'<td id="ns1blankspaceBankAccountColumnReconcile2" class="interfaceMainColumn2">' +
														'</td></tr></table>');				
										
										$('#ns1blankspaceMainReconcile').html(aHTML.join(''));
												
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td style="font-size:0.75em;">' +
															'<span id="ns1blankspaceBankAccountRecoAdd">Add</span>' +
															'</td></tr></table>');
											
											$('#ns1blankspaceBankAccountColumnReconcile1').html(aHTML.join(''));	
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
														aHTML.push('<tr><td style="font-size:0.75em;"><span id="ns1blankspaceBankAccountRecoAdd">Add</span></td></tr>');
													}
												}
												
												aHTML.push(ns1blankspace.financial.bankAccount.reconcile.row(this));
											});
											
											aHTML.push('</table>');
											
											$('#ns1blankspaceBankAccountColumnReconcile1').html(aHTML.join(''));
										}
										
										$('#ns1blankspaceBankAccountRecoAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											 ns1blankspace.financial.bankAccount.reconcile.edit(oParam)
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
															'>' + oRow.statementdate + '<br />');
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
										
										aHTML.push('<table class="ns1blankspace"><tr>' +
														'<td id="ns1blankspaceBankAccountColumnReconcileEdit1" style="padding-right:15px;"></td>' +
														'<td id="ns1blankspaceBankAccountColumnReconcileEdit2" class="interfaceMainColumn2" style="width: 250px"></td>' +
														'</tr></table>');			
									
										$('#ns1blankspaceBankAccountColumnReconcile2').html(aHTML.join(''));
											
										var aHTML = [];

										aHTML.push('<table class="ns1blankspace">');
												
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
														'<td class="ins1blankspaceText">' +
														'<input id="ns1blankspaceReconcileEditStatementBalance" class="ns1blankspaceText">' +
														'</td></tr>');			
															
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Status' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>In Progress' +
														'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Completed' +
														'</td></tr>');
																																											
										aHTML.push('</table>');					
										
										$('#ns1blankspaceBankAccountColumnReconcileEdit1').html(aHTML.join(''));
										
										$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});
											
										var aHTML = [];
									
										aHTML.push('<table class="ns1blankspace" style="font-size:0.875em;">');
												
										aHTML.push('<tr class="ns1blankspaceAction">' +
														'<td class="ns1blankspaceAction">' +
														'<span id="ns1blankspaceReconcileEditSave">Save</span>' +
														'</td></tr>');
														
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
											sData += '&statementdate=' + ns1blankspace.util.fs($('#ns1blankspaceReconcileEditStatementDate').val());
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
													ns1blankspace.status.message('Reconciliation added.');
												}
											});
										});
										
										if (sID != undefined)
										{
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_RECONCILIATION_SEARCH'),
												data: 'id=' + sID,
												dataType: 'json',
												success: function(data) {ns1blankspace.financial.bankAccount.reconcile.edit(oParam, data)}
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
											$('#ns1blankspaceReconcileEditStatementDate').val(oObjectContext.statementdate);
											$('#ns1blankspaceReconcileEditStatementBalance').val(oObjectContext.statementbalance);
											$('[name="radioStatus"][value="' + oObjectContext.status + '"]').attr('checked', true);
										}
									}
								},

					items: 		{		
									show:		function (oParam, oResponse)
												{
													var sXHTMLElementID;
													var iObjectContext = ns1blankspace.objectContext;
													var oOptions = {view: true, remove: true, automation: true};
													var oActions = {add: true};
													var iReconciliation;
													var iType = 1;
													var iSource = 1;
													
													if (oParam != undefined)
													{
														if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
														if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
														if (oParam.options != undefined) {oOptions = oParam.options}
														if (oParam.actions != undefined) {oActions = oParam.actions}
														if (oParam.reconciliation != undefined) {iReconciliation = oParam.reconciliation}
														if (oParam.type != undefined) {iType = oParam.type}
														if (oParam.source != undefined) {iSource = oParam.source}
													}		
													
													$.extend(true, oParam, {source: iSource, type: iType});
														
													if (oResponse == undefined)
													{	
														if ($('#ns1blankspaceBankAccountColumnReconcile2').html() == '')
														{
														
															var aHTML = [];
															
															aHTML.push('<table class="ns1blankspaceContainer" style="font-size:0.875em;">' +
																			'<tr class="ns1blankspaceContainer">' +
																			'<td id="ns1blankspaceBankAccountReconcileColumnType" style="width: 75px;font-size:0.875em;text-align:right;padding-right:7px;"></td>' +
																			'<td id="ns1blankspaceBankAccountReconcileColumnItem" class="ns1blankspaceColumn2" style="width: 200px; font-size:0.875em; border-left-style:solid; border-width:1px; border-color:#B8B8B8; padding-left:7px;"></td>' +
																			'<td id="ns1blankspaceBankAccountReconcileColumnItemEdit" class="ns1blankspaceColumn2" style="font-size:0.875em; border-left-style:solid; border-width:1px; border-color:#B8B8B8; padding-left:7px;"></td>' +
																			'</tr></table>');			
														
															$('#ns1blankspaceBankAccountColumnReconcile2').html(aHTML.join(''));
															
															var aHTML = [];
															
															aHTML.push('<div id="ns1blankspaceBankAccountColumnItemType" style="width: 70px; margin-bottom:3px; border-left-style:solid; border-width:1px; border-color:#B8B8B8; padding-left: 7px;">');
															aHTML.push('<input style="width: 100px;" type="radio" id="ns1blankspaceBankAccountColumnItemType-1" name="radioType" checked="checked" /><label for="ns1blankspaceBankAccountColumnItemType-1" style="width: 70px;">' +
																			'Debits (Out)</label>');
															aHTML.push('<input style="width: 100px;"  type="radio" id="ns1blankspaceBankAccountColumnItemType-2" name="radioType" /><label for="ns1blankspaceBankAccountColumnItemType-2" style="width: 70px;">' +
																			'Credits (In)</label>');
															aHTML.push('</div>');
														
															$('#ns1blankspaceBankAccountReconcileColumnType').html(aHTML.join(''));
														
															var aHTML = [];
																
															aHTML.push('<div id="ns1blankspaceBankAccountColumnItemSource" style="width: 200px;;margin-bottom:3px;">');
															aHTML.push('<input style="width: 100px;" type="radio" id="ns1blankspaceBankAccountColumnItemSource-1" name="radioSource" checked="checked" /><label for="ns1blankspaceBankAccountColumnItemSource-1" style="width: 96px;">' +
																			'Reconciled</label>');
															aHTML.push('<input style="width: 100px;" type="radio" id="ns1blankspaceBankAccountColumnItemSource-2" name="radioSource" /><label for="ns1blankspaceBankAccountColumnItemSource-2" style="width: 96px;">' +
																			'Bank</label>');
															aHTML.push('</div>');
														
															aHTML.push('<div id="ns1blankspaceBankAccountReconcileItems" style="width: 200px;margin-bottom:3px;"></div>');
															
															$('#ns1blankspaceBankAccountReconcileColumnItem').html(aHTML.join(''));
															
															ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
														}
													
														$('#ns1blankspaceBankAccountColumnItemType').buttonset().css('font-size', '0.875em');
														$('#ns1blankspaceBankAccountColumnItemSource').buttonset().css('font-size', '0.875em');
														
														$('#ns1blankspaceBankAccountColumnItemType :radio').click(function()
														{
															var aID = (event.target.id).split('-');
															$.extend(true, oParam, {type: parseInt(aID[1])});
															ns1blankspace.financial.bankAccount.reconcile.items.show(oParam);	
														});

														$('#ns1blankspaceBankAccountColumnItemSource :radio').click(function()
														{
															var aID = (event.target.id).split('-');
															$.extend(true, oParam, {source: parseInt(aID[1])});
															ns1blankspace.financial.bankAccount.reconcile.items.show(oParam);
														});
	
														$('#ns1blankspaceBankAccountReconcileItems').html(ns1blankspace.xhtml.loadingSmall);
														
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
															oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.items.show(oParam, data)});
														}		
														else
														{
															oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
															oSearch.addField('description,amount,posteddate');
															oSearch.sort('posteddate', 'desc');
															oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
															oSearch.addFilter('status', 'EQUAL_TO', 1);
															oSearch.rows = ns1blankspace.option.defaultRows;
															oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.items.show(oParam, data)});
														}		
													}
													else
													{				
														var aHTML = [];
													
														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<table><tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceNothing">No items.</td>' +
																			'</tr></table>');

															$('#ns1blankspaceBankAccountReconcileItems').html(aHTML.join(''));							
														}
														else
														{
															aHTML.push('<table>');
															
															$.each(oResponse.data.rows, function()
															{
																aHTML.push(
																	'<tr class="ns1blankspaceRow">' +
																	'<td class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																	'<table cellspacing=0 cellpadding=0><tr>');
																				
																	if (this.paiddate)
																	{				
																		aHTML.push('<td id="ns1blankspaceRecocileItems_date-' + this.id + '" class="recoitempayment">' +
																							this.paiddate + '</td>');
																	}
																	else if (this.receiveddate)
																	{
																		aHTML.push('<td id="tdRecoItems_date-' + this.id + '" class="recoitemreceipt">' +
																							this.receiveddate + '</td>');
																	}							
																	else if (this.posteddate)
																	{
																		aHTML.push('<td id="ns1blankspaceRecocileItems_date-' + this.id + '" class="recoitemstatement">' +
																							this.posteddate + '</td>');
																	}
																
																	aHTML.push('<td id="ns1blankspaceRecocileItems_amount-' + this.id + '" style="text-align:right;"' +
																						' class="recoitem">' +
																						this.amount + '</td>');
																	
																	if (iSource == 1)
																	{
																		aHTML.push('</tr><tr><td colspan=2 id="ns1blankspaceRecocileItems_description-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																						' class="recoitem">' +
																						this.reference + '</td>');
																	}
																	else
																	{
																		aHTML.push('</tr><tr><td colspan=2 id="ns1blankspaceRecocileItems_description-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																						' class="recoitem">' +
																						this.description + '</td>');
																	}
																			
																aHTML.push('</tr></table></td>');	
																	
																if ((this.paiddate) || (this.receiveddate))
																{					
																	aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																	aHTML.push('<span id="ns1blankspaceReconcileItems_options_remove-' + this.id + '" class="ns1blankspaceReconcileItemsRemove"></span>');
																	aHTML.push('</td>');
																};	
																
																if (this.posteddate)
																{					
																	aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																	aHTML.push('<span id="spanRecoItems_options_search-' + this.id + '"' +
																					' data-searchDate="' + this.posteddate + '"' +
																					' data-searchAmount="' + this.amount + '"' +
																					' class="ns1blankspaceReconcileItemsMatch"></span>');
																	aHTML.push('</td>');
																};	
																		
																aHTML.push('</tr>');
															});
															
															aHTML.push('</table>');

															$('#ns1blankspaceBankAccountReconcileItems').html(aHTML.join(''));
														
															$('.ns1blankspaceReconcileItemsRemove').button( {
																text: false,
																icons: {
																	primary: "ui-icon-close"
																}
															})
															.click(function() {
																ns1blankspace.financial.bankAccount.items.remove({xhtmlElementID: this.id});
															})
															.css('width', '15px')
															.css('height', '17px')
															
															$('.ns1blankspaceReconcileItemsMatch').button( {
																text: false,
																icons: {
																	primary: "ui-icon-play"
																}
															})
															.click(function() {
																var aID = (this.id).split('-');
																$.extend(true, oParam, {searchSourceID: aID[1], searchDate: $(this).attr("data-searchDate"), searchAmount: $(this).attr("data-searchAmount")});
																ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
															})
															.css('width', '15px')
															.css('height', '17px')
														}
													}	
												},

									remove: 	function(oParam)
												{
													var sXHTMLElementID;

													if (oParam != undefined)
													{
														if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
														if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
													}
															
													var aXHTMLElementID = sXHTMLElementID.split('-');
													var sData = 'remove=1&reconcilition=' + ns1blankspace.util.fs(iReconciliation);

													if (aXHTMLElementID[2] == 1) {sData += '&linkype=3'}
													if (aXHTMLElementID[2] == 2) {sData += '&linkype=6'}

													sData += '&linkid=' + aXHTMLElementID[1];	

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

									edit:		function (oParam, oResponse)
												{
													var iObjectContext = ns1blankspace.objectContext;
													var sXHTMLElementID = '';
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
														if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
														if (oParam.options != undefined) {oOptions = oParam.options}
														if (oParam.actions != undefined) {oActions = oParam.actions}
														if (oParam.reconciliation != undefined) {iReconciliation = oParam.reconciliation}
														if (oParam.type != undefined) {iType = oParam.type}
														if (oParam.editAction != undefined) {iEditAction = oParam.editAction}
														if (oParam.searchDate != undefined) {dSearchDate = oParam.searchDate}
														if (oParam.searchAmount != undefined) {cSearchAmount = oParam.searchAmount}	
													}		
													
													$.extend(true, oParam, {editAction: iEditAction, type: iType});
															
													if ($('#ns1blankspaceBankAccountReconcileColumnItemEdit').html() == '')
													{
														var aHTML = [];
														
														aHTML.push('<table class="ns1blankspaceContainer">' +
																		'<tr class="ns1blankspaceContainer">' +
																		'<td id="ns1blankspaceReconcileItemEdit1" style="width:200px;"></td>' +
																		'<td id="ns1blankspaceReconcileItemEdit2" class="ns1blankspaceColumn2" style="width:50px; border-left-style:solid; border-width:1px; border-color:#B8B8B8; padding-left:7px;"></td>' +
																		'</tr>' +
																		'</table>');			
													
														$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html(aHTML.join(''));
														
														var aHTML = [];
														
														aHTML.push('<div id="ns1blankspaceReconcileItemEditOption" style="width: 196;margin-bottom:3px;text-align:left;">');
														aHTML.push('<input type="radio" id="ns1blankspaceReconcileItemEdit-1" name="radioEdit" checked="checked" /><label for="ns1blankspaceReconcileItemEdit-1" style="width: 112px;">' +
																		'Unreconciled</label>');
														aHTML.push('<input type="radio" id="ns1blankspaceReconcileItemEdit-2" name="radioEdit" /><label for="ns1blankspaceReconcileItemEdit-2" style="width: 50px;">' +
																		'Add</label>');
														aHTML.push('</div>');
													
														aHTML.push('<div id="ns1blankspaceReconcileItemsEdit"></div>');
														
														$('#ns1blankspaceReconcileItemEdit1').html(aHTML.join(''));
													}
												
													$('#ns1blankspaceReconcileItemEditOption').buttonset().css('font-size', '0.875em');
													
													$('#ns1blankspaceReconcileItemEditOption :radio').click(function()
													{
														var aID = (event.target.id).split('-');
														$.extend(true, oParam, {editAction: parseInt(aID[1])});
														ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
													});
													
													if (iEditAction == 1)
													{
														if (oResponse == undefined)
														{

															var aHTML = [];
															
															aHTML.push('<table>');
															
															aHTML.push('<tr>' +
																			'<td class="ns1blankspaceCaption">' +
																			'Date' +
																			'</td></tr>' +
																			'<tr class="ns1blankspaceText">' +
																			'<td class="ns1blankspaceText">' +
																			'<input id="ns1blankspaceItemsEditSearchDate" class="ns1blankspaceDate">' +
																			'</td></tr>');
																
															aHTML.push('<tr>' +
																			'<td class="ns1blankspaceCaption">' +
																			'Amount' +
																			'</td></tr>' +
																			'<tr class="ns1blankspaceText">' +
																			'<td class="ns1blankspaceText">' +
																			'<input id="ns1blankspaceItemsEditSearchAmount" class="ns1blankspaceText">' +
																			'</td></tr>');
																							
															aHTML.push('<tr><td class="ns1blankspaceAction">' +
																			'<span style="width:100%" id="ns1blankspaceItemsEditSearch">Search</span>' +
																			'</td></tr>');

															aHTML.push('<tr><td class="ns1blankspaceAction">' +
																			'<span style="width:100%" id="ns1blankspaceItemsEditClearSearch">Search</span>' +
																			'</td></tr>');
															
															aHTML.push('</table>');					
															
															$('#ns1blankspaceReconcileItemEdit2').html(aHTML.join(''));
														
															$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});
											
															$('#ns1blankspaceItemsEditSearchDate').val(dSearchDate);
															$('#ns1blankspaceItemsEditSearchAmount').val(cSearchAmount);
																	
															$('#ns1blankspaceItemsEditSearch').button( {
																label: 'Search',
																icons: {
																	primary: "ui-icon-search"
																}
															})
															.click(function() {
																oParam.searchDate = $('#ns1blankspaceItemsEditSearchDate').val();
																oParam.searchAmount = $('#ns1blankspaceItemsEditSearchAmount').val();
																ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
															})

															$('#ns1blankspaceItemsEditClearSearch').button( {
																label: 'Clear',
																icons: {
																	primary: "ui-icon-close"
																}
															})
															.click(function() {
																 ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
															})
															
															$('#ns1blankspaceReconcileItemsEdit').html(ns1blankspace.xhtml.loadingSmall);
														
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
															oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam, data)});
														}
														else
														{
															var aHTML = [];
													
															if (oResponse.data.rows.length == 0)
															{
																aHTML.push('<table><tr class="ns1blankspace">' +
																				'<td class="ns1blankspaceNothing">No items.</td>' +
																				'</tr></table>');

																$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));							
															}
															else
															{
																aHTML.push('<table>');
																
																$.each(oResponse.data.rows, function()
																{
																	aHTML.push(
																		'<tr class="ns1blankspaceRow">' +
																		'<td class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																		'<table cellspacing=0 cellpadding=0><tr>');
																					
																		if (this.paiddate)
																		{				
																			aHTML.push('<td id="ns1blankspaceRecocileItems_date-' + this.id + '-1" class="recoitempayment">' +
																								this.paiddate + '</td>');
																		}
																		else if (this.receiveddate)
																		{
																			aHTML.push('<td id="tdRecoItems_date-' + this.id + '-2" class="recoitemreceipt">' +
																								this.receiveddate + '</td>');
																		}							
																		else if (this.posteddate)
																		{
																			aHTML.push('<td id="ns1blankspaceRecocileItems_date-' + this.id + '" class="recoitemstatement">' +
																								this.posteddate + '</td>');
																		}
																	
																		aHTML.push('<td id="ns1blankspaceRecocileItems_amount-' + this.id + '" style="text-align:right;"' +
																							' class="recoitem">' +
																							this.amount + '</td>');
																		
																		aHTML.push('</tr><tr><td colspan=2 id="ns1blankspaceReconcileItems_reference-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																							' class="recoitem">' +
																							this.reference + '</td>');
																					
																	aHTML.push('</tr></table></td>');	
																						
																	aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																	aHTML.push('<span id="ns1blankspaceReconcileItems_options_add-' + this.id + '-' + iType + '" class="ns1blankspaceReconcileItemsAdd"></span>');
																	aHTML.push('</td>');
		
																	aHTML.push('</tr>');
																});
																
																aHTML.push('</table>');

																$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));

																$('.ns1blankspaceReconcileItemsAdd').button( {
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
													}

													else if (iEditAction == 3)  //add to reconciliation
													{
														var aXHTMLElementID = sXHTMLElementID.split('-');
														var sData = 'reconcilition=' + ns1blankspace.util.fs(iReconciliation);

														if (aXHTMLElementID[2] == 1) {sData += '&linkype=3'}
														if (aXHTMLElementID[2] == 2) {sData += '&linkype=6'}

														sData += '&linkid=' + aXHTMLElementID[1];	

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
													}

													else if (iEditAction == 2) //add item
													{
														var aHTML = [];
														
														aHTML.push('<table class="ns1blankspace" style="width:190px;">');							
														
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
																		'Amount' +
																		'</td></tr>' +
																		'<tr class="ns1blankspaceText">' +
																		'<td class="ns1blankspaceText">' +
																		'<input id="ns1blankspaceItemsEditAmount" class="ns1blankspaceText">' +
																		'</td></tr>');	
														
														aHTML.push('<tr class="ns1blankspaceCaption">' +
																		'<td class="ns1blankspaceCaption">' +
																		'Description' +
																		'</td></tr>' +
																		'<tr class="ns1blankspaceTextMulti">' +
																		'<td class="ns1blankspaceTextMulti">' +
																		'<textarea rows="5" cols="35" id="ns1blankspaceItemsEditDescription" class="ns1blankspaceTextMultiSmall"></textarea>' +
																		'</td></tr>');
																									
														aHTML.push('</table>');					
													
														$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));
													
														$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});

														$('#ns1blankspaceItemsEditDate').val(dSearchDate);
														$('#ns1blankspaceItemsEditAmount').val(cSearchAmount);
														$('#ns1blankspaceItemsEditContactBusiness').focus();
														
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
														.click(function() {
															 //Save based on iType
														})
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
													'<td id="ns1blankspaceBankAccountImportColumn1" style="width: 75px;padding-right:5px;font-size:0.875em;" class="ns1blankspaceColumn1">' +
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
										oSearch.sort('enddate', 'desc');
										oSearch.rows = ns1blankspace.option.defaultRows;
										oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.import.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="tableInterfaceFinancialHomeMostLikely">');
											
											aHTML.push('<tr><td style="font-size:0.75em;"><span id="ns1blankspaceBankAccountImportAdd">Add</span></td></tr>');

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
													aHTML.push('<tr><td style="font-size:0.75em;"><span id="ns1blankspaceBankAccountImportAdd">Add</span></td></tr>');
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
											var aID = (event.target.id).split('-');
											ns1blankspace.financial.bankAccount.import.transactions({fileSource: aID[1]});
										});
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
										var h = -1;
																		
										aHTML.push(ns1blankspace.attachments.upload.show(
														{	
															object: 28,
															objectContext: -1,
															label: ''
														}));
																				
										$('#ns1blankspaceBankAccountImportColumn2').html(aHTML.join(''));
										
										$('#spanInterfaceMainUpload').button(
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
										oSearch.getResults(function(data) {ins1blankspace.financial.bankAccount.import.process(data)});
									}
									else
									{
										if (oResponse.data.rows.length !=0)
										{	
											var sData = 'id=' + oResponse.data.rows[0].id;
									
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_PROCESS'),
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
