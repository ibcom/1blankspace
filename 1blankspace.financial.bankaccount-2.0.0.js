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
									'<td id="ns1blankspaceControlMapping" class="ns1blankspaceControl">Mappings</td>' +
									'</tr>');

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlImport" class="ns1blankspaceControl">Import</td>' +
									'</tr>');

					aHTML.push('</table>');

					aHTML.push('<table class="ns1blankspaceControl">');

					//aHTML.push('<tr>' +
					//				'<td class="ns1blankspaceCaption">Reconcile</td>' +
					//				'</tr>');

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlReconcile" class="ns1blankspaceControl">Reconcile</td>' +
									'</tr>');

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlReconciliations" class="ns1blankspaceControl">Completed</td>' +
									'</tr>');

					aHTML.push('</table>');					
							
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainImport" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainMapping" class="ns1blankspaceControlMain"></div>');
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
						ns1blankspace.financial.bankAccount.import.init();
					});

					$('#ns1blankspaceControlMapping').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainMapping'});
						ns1blankspace.financial.bankAccount.mapping.show();
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
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title +
							'<br /><span class="ns1blankspaceSubContext" id="ns1blankspaceControlSubContext_date">' + ns1blankspace.objectContextData.lastreconcileddate + '</span>' +
							'<br /><span class="ns1blankspaceSubContext" id="ns1blankspaceControlSubContext_amount">$' + ns1blankspace.objectContextData.lastreconciledamount + '</span>');
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.financial.bankAccount.init({id: ' + ns1blankspace.objectContext + '})',
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
				},

	mapping: 	{
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

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceMappingColumn1" class="ns1blankspaceColumn1Flexible">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspaceMappingColumn2" class="ns1blankspaceColumn2" style="width:300px;"></td>' +
														'</tr></table>');					
										
										$('#ns1blankspaceMainMapping').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
										
										
										aHTML.push('<tr><td class="ns1blankspaceAction">' +
														'<span id="ns1blankspaceMappingAdd">Add</span>' +
														'</td></tr>');
							
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceMappingColumn2').html(aHTML.join(''));
									
										$('#ns1blankspaceMappingAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											 ns1blankspace.financial.bankAccount.mapping.edit(oParam);
										});										
									
									}

									var oSearch = new AdvancedSearch();
									oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_MAPPING_SEARCH';
									oSearch.addField('description,descriptionmatchtype,descriptionmatchtypetext,mapfrom,mapfromdescription,mapfromtext,' +
														'maporder,maptodescription,maptofinancialaccount,maptofinancialaccounttext,' +
														'matchtype,matchtypetext,project,projecttext,status,statustext,' +
														'taxtype,taxtypeexpensetext,taxtyperevenuetext,type,typetext');
									oSearch.sort('description', 'asc');
									
									oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.mapping.show(oParam, data)});
								}
								else
								{
									var aHTML = [];
									
									if (oResponse.data.rows.length == 0)
									{
										aHTML.push('<table><tr><td class="ns1blankspaceNothing">' +
													'You can set up mappings to make it easier to create receipts' +
													' and payments with in this space.' +
													'<br /><br />' +
													'ie. if the bank transaction description contains <i>fees</i>,' +
													'then set the financial account as <i>Bank Charges</i>.' +
													'</td></tr></table>');

										$('#ns1blankspaceMappingColumn1').html(aHTML.join(''));
									}
									else
									{
										var sWhere;
										var sTo;

										aHTML.push('<table class="ns1blankspace" id="ns1blankspaceFinancialBankAccountMappings" style="font-size:0.875em;">');

										aHTML.push('<tr>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption">Where</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption">Set</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
										aHTML.push('</tr>');

										$.each(oResponse.data.rows, function()
										{
											sWhere = '';
											sTo = '';

											if (this.mapfromdescription != '')
											{	
												sWhere += '<span class="ns1blankspaceSub">Description ' + (this.descriptionmatchtype==1?'exactly matches':'contains') + '</span>';
												sWhere +=  '<br />' + this.mapfromdescription;
											}	

											if (this.mapfromtext != '')
											{	
												sWhere += '<br /><span class="ns1blankspaceSub">Type is</span>';
												sWhere += '<br />' + this.mapfromtext;
											}

											aHTML.push('<tr class="ns1blankspaceRow">');
																		
											aHTML.push('<td id="ns1blankspaceMapping_where-' + this.id + '" class="ns1blankspaceRow">' +
															sWhere + '</td>');
											
											if (this.maptofinancialaccounttext != '')
											{
												sTo += '<span class="ns1blankspaceSub">Account to</span>';
												sTo += '<br />' + this.maptofinancialaccounttext;
											}

											if (this.taxtype != '')
											{
												sTo += '<br /><span class="ns1blankspaceSub">' + ns1blankspace.option.taxVATCaption + ' type to</span>';
												sTo += '<br />' + (this.mapfrom==1?this.taxtyperevenuetext:this.taxtypeexpensetext);
											}

											aHTML.push('<td id="ns1blankspaceItem_to-' + this.id + '" class="ns1blankspaceRow">' +
															sTo + '</td>');

											aHTML.push('<td style="width:40px;text-align:right;" class="ns1blankspaceRow">');
											aHTML.push('<span id="ns1blankspaceRowMapping_options_remove-' + this.id + '" class="ns1blankspaceRemove"></span>');
											aHTML.push('<span id="ns1blankspaceRowMapping_options_edit-' + this.id + '" class="ns1blankspaceEdit"></span>');
											aHTML.push('</td></tr>');
										});
										
										aHTML.push('</table>');

										$('#ns1blankspaceMappingColumn1').html(aHTML.join(''));
										
										$('#ns1blankspaceFinancialBankAccountMappings .ns1blankspaceRemove').button( {
											text: false,
											icons: {
												primary: "ui-icon-close"
											}
										})
										.click(function() {
											oParam.xhtmlElementID = this.id;
											ns1blankspace.financial.bankAccount.mapping.remove(oParam);
										})
										.css('width', '15px')
										.css('height', '17px')
								
										$('#ns1blankspaceFinancialBankAccountMappings .ns1blankspaceEdit').button( {
											text: false,
											icons: {
												primary: "ui-icon-pencil"
											}
										})
										.click(function() {
											ns1blankspace.financial.bankAccount.mapping.edit({xhtmlElementID: this.id})
										})
										.css('width', '15px')
										.css('height', '17px')	
									}
								}	
							},

					remove:	function (oParam, oResponse)
							{								
								var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
								var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
								
								if (oResponse == undefined)
								{	
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MAPPING_MANAGE'),
										data: 'remove=1&id=' + sID,
										dataType: 'json',
										success: function(data)
										{
											ns1blankspace.financial.bankAccount.mapping.remove(oParam, data)
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
								var iStep = ns1blankspace.util.getParam(oParam, 'step', {default: 1}).value;
								var iType = ns1blankspace.util.getParam(oParam, 'type', {default: 1}).value;
								var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1, default: ''}).value;

								if (iStep == 1)
								{
									var aHTML = [];
									
									aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceMappingEditColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
														'<td id="ns1blankspaceMappingEditColumn2" class="ns1blankspaceColumn2" style="width:50px;font-size:0.875em;"></td>' +
														'</tr></table>');

									$('#ns1blankspaceMappingColumn2').html(aHTML.join(''));

									var aHTML = [];

									aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');
							
									aHTML.push('<tr><td class="ns1blankspaceCaption">' +
													'Where Type Is' +
													'</td></tr>' +
													'<tr><td class="ns1blankspaceRadio">' +
													'<input type="radio" id="radioType1" name="radioType" value="1"/>Credit' +
													'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Debit' +
													'</td></tr>');

									aHTML.push('<tr><td class="ns1blankspaceCaption">' +
													'& Description' +
													'</td></tr>' +
													'<tr><td class="ns1blankspaceRadio">' +
													'<input type="radio" id="radioMatch1" name="radioMatch" value="1"/>Exactly Matches' +
													'<br /><input type="radio" id="radioMatch2" name="radioMatch" value="2"/>Contains' +
													'</td></tr>');

									aHTML.push('<tr><td class="ns1blankspaceText">' +
													'<input id="ns1blankspaceFromMatchDescription" class="ns1blankspaceText">' +
													'</td></tr>');

									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Set ' + ns1blankspace.option.taxVATCaption + ' Type' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td id="ns1blankspaceFinancialTaxCodeMapping" class="ns1blankspaceRadio">' +
													ns1blankspace.xhtml.loadingSmall +
													'</td></tr>');	

									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Account' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceText">' +
													'<input id="ns1blankspaceItemAccount" class="ns1blankspaceText">' +
													'</td></tr>');
									
									aHTML.push('</table>');
									
									aHTML.push('<table class="ns1blankspaceColumn2">');
									
									aHTML.push('<tr><td style="padding-top:5px;" id="ns1blankspaceItemAddSearchResults"><span class="ns1blankspaceSub" style="font-size:0.75em;">Press <i>enter</i> to see all or<br />start typing part of the account title.</span></td></tr>');
																	
									aHTML.push('</table>');		
									
									$('#ns1blankspaceMappingEditColumn1').html(aHTML.join(''));
				
									ns1blankspace.financial.util.tax.codes(
									{
										xhtmlElementID: 'ns1blankspaceFinancialTaxCodeMapping',
										xhtmlElementName: 'radioTaxCodeMapping',
										type: iType
									});

									$('[name="radioType"]').click(function()
									{
										ns1blankspace.financial.util.tax.codes(
										{
											xhtmlElementID: 'ns1blankspaceFinancialTaxCodeMapping',
											xhtmlElementName: 'radioTaxCodeMapping',
											type: $('input[name="radioType"]:checked').val(),
											id: 1
										});

										oParam.type = $('input[name="radioType"]:checked').val();
									});

									$('#ns1blankspaceItemAccount').keyup(function()
									{
										oParam = ns1blankspace.util.setParam(oParam, 'step', 3);
										if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
								        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.bankAccount.mapping.edit(' + JSON.stringify(oParam) + ')', ns1blankspace.option.typingWait);
									});
					
									$('#ns1blankspaceItemAmount').focus();

									var iFinancialAccountType = (iType==1?2:1);
									var oData = $.grep(ns1blankspace.financial.data.accounts, function (a)
									{ 
										return (a.type == iFinancialAccountType && a.postable == 'Y')
									});

									var aHTML = [];
									
									aHTML.push('<table class="ns1blankspaceColumn2">');
											
									aHTML.push('<tr><td><span id="ns1blankspaceMappingEditSave" class="ns1blankspaceAction">' +
													'Save</span></td></tr>');

									aHTML.push('<tr><td><span id="ns1blankspaceMappingEditCancel" class="ns1blankspaceAction">' +
													'Cancel</span></td></tr>');
													
									aHTML.push('</table>');					
									
									$('#ns1blankspaceMappingEditColumn2').html(aHTML.join(''));
									
									$('#ns1blankspaceMappingEditSave').button(
									{
										text: "Save"
									})
									.click(function()
									{
										ns1blankspace.status.working();

										var oData = 
										{
											mapfrom: $('input[name="radioType"]:checked').val(),
											descriptionmatchtype: $('input[name="radioMatch"]:checked').val(),
											mapfromdescription: $('#ns1blankspaceFromMatchDescription').val(),
											maptofinancialaccount: $('#ns1blankspaceItemAccount').attr('data-id'),
											taxtype: $('input[name="radioTaxCodeMapping"]:checked').val(),
											id: sID
										}
											
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MAPPING_MANAGE'),
											data: oData,
											dataType: 'json',
											success: function(oResponse)
											{
												ns1blankspace.status.message('Saved');
												delete ns1blankspace.financial.bankAccount.reconcile.items.data.mappings;
												ns1blankspace.financial.bankAccount.mapping.show(oParam)
											}
										});
									})
									.css('width', '70px');

									$('#ns1blankspaceMappingEditCancel').button(
									{
										text: "Cancel"
									})
									.click(function()
									{
										ns1blankspace.financial.bankAccount.mapping.show();
									})
									.css('width', '70px');

									if (sID != '')
									{
										ns1blankspace.status.working();

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_MAPPING_SEARCH';
										oSearch.addField('description,descriptionmatchtype,descriptionmatchtypetext,mapfrom,mapfromdescription,mapfromtext,' +
														'maporder,maptodescription,maptofinancialaccount,maptofinancialaccounttext,' +
														'matchtype,matchtypetext,project,projecttext,status,statustext,' +
														'taxtype,taxtypeexpensetext,taxtyperevenuetext,type,typetext');
										oSearch.addFilter('id', 'EQUAL_TO', sID)
									
										oSearch.getResults(function(data)
										{
											oParam = ns1blankspace.util.setParam(oParam, 'step', 2);
											ns1blankspace.financial.bankAccount.mapping.edit(oParam, data);
										});
									}
									else
									{
										$('[name="radioType"][value="1"]').attr('checked', true);
										$('[name="radioMatch"][value="1"]').attr('checked', true);
										$('[name="radioTaxCodeMapping"][value="1"]').attr('checked', true);
									}

									if (oData.length < 21)
									{	
										oParam = ns1blankspace.util.setParam(oParam, 'step', 3);
										ns1blankspace.financial.bankAccount.mapping.edit(oParam, oData);
									}	
								}

								if (iStep == 2 && oResponse !== undefined)
								{	
									ns1blankspace.status.message('');

									var oRow = oResponse.data.rows[0];

									oParam = ns1blankspace.util.setParam(oParam, 'type', oRow.mapfrom);

									$('[name="radioType"][value="' + oRow.mapfrom + '"]').attr('checked', true);
									$('[name="radioMatch"][value="' + oRow.descriptionmatchtype + '"]').attr('checked', true);
									$('#ns1blankspaceFromMatchDescription').val(oRow.mapfromdescription);
									$('#ns1blankspaceItemAccount').val(oRow.maptofinancialaccounttext)
									$('#ns1blankspaceItemAccount').attr('data-id', oRow.maptofinancialaccount);
									$('[name="radioTaxCodeMapping"][value="' + oRow.taxtype + '"]').attr('checked', true);
								}

								if (iStep == 3)
								{	
									if (oResponse == undefined)
									{	
										ns1blankspace.status.working();

										var iFinancialAccountType = (iType==1?2:1);
										var sSearch = $('#ns1blankspaceItemAccount').val()

										if (sSearch == '')
										{
											var oData = $.grep(ns1blankspace.financial.data.accounts, function (a)
											{ 
												return (a.type == iFinancialAccountType && a.postable == 'Y')
											});
										}
										else
										{
											sSearch = sSearch.toLowerCase();
											var oData = $.grep(ns1blankspace.financial.data.accounts, function (a)
											{
												return (a.type == iFinancialAccountType && (a.title).toLowerCase().indexOf(sSearch) != -1 && a.postable == 'Y')
											});
										}	

										ns1blankspace.financial.bankAccount.mapping.edit(oParam, oData);
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
																'<td id="ns1blankspaceMappingAccount_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																this.title +
																'</td></tr>');	
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceItemAddSearchResults').html(aHTML.join(''))
											
											$('.ns1blankspaceRowSelect').click(function()
											{
												$('#ns1blankspaceItemAccount').val($(this).html())
												$('#ns1blankspaceItemAccount').attr('data-id',(this.id).split('-')[1]);
												$('#ns1blankspaceItemAddSearchResults').html('');
											});
										}
									}	
								}
							},

					apply:	{

								init: 		function (oParam, oResponse)
											{
												var iStep = ns1blankspace.util.getParam(oParam, 'step', {default: 1}).value;
												var iFileSource = ns1blankspace.util.getParam(oParam, 'fileSource').value;

												if (iStep == 1)
												{
													if (ns1blankspace.financial.bankAccount.reconcile.items.data.mappings === undefined)
													{
														ns1blankspace.status.working('Getting mappings...');

														var oSearch = new AdvancedSearch();
														oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_MAPPING_SEARCH';
														oSearch.addField('description,descriptionmatchtype,descriptionmatchtypetext,mapfrom,mapfromdescription,mapfromtext,' +
																		'maporder,maptodescription,maptofinancialaccount,maptofinancialaccounttext,' +
																		'matchtype,matchtypetext,project,projecttext,status,statustext,' +
																		'taxtype,taxtypeexpensetext,taxtyperevenuetext,type,typetext');

														oSearch.rows = 200;
														
														oSearch.getResults(function(oResponse)
														{
															ns1blankspace.status.message('');
															oParam = ns1blankspace.util.setParam(oParam, 'step', 2);
															ns1blankspace.financial.bankAccount.reconcile.items.data.mappings = oResponse.data.rows;
															ns1blankspace.financial.bankAccount.mapping.apply.init(oParam);
														});
													}
													else
													{
														oParam = ns1blankspace.util.setParam(oParam, 'step', 2);
														ns1blankspace.financial.bankAccount.mapping.apply.init(oParam);
													}
												}

												if (iStep == 2)
												{
													oParam = ns1blankspace.util.setParam(oParam, 'step', 3);
													ns1blankspace.financial.bankAccount.reconcile.items.data.items = [];

													var oSearch = new AdvancedSearch();
													oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
													oSearch.addField('amount,area,areatext,bankaccount,bankaccounttext,capital,category,categorytext,' +
																		'contactbusiness,contactbusinesstext,contactperson,contactpersontext,description,' +
																		'object,objectcontext,' +
																		'externalid,financialaccount,financialaccounttext,posteddate,project,projecttext,' +
																		'source,sourcetext,status,statustext,tax,taxtype,taxtypeexpensetext,taxtyperevenuetext,type,typetext');
													oSearch.sort('posteddate', 'desc');
													oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
													if (iFileSource) {oSearch.addFilter('source', 'EQUAL_TO', iFileSource);}
													oSearch.rows = 100;
													oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.mapping.apply.init(oParam, data)});
												}

												if (iStep == 3)
												{
													ns1blankspace.financial.bankAccount.reconcile.items.data.items =
																	ns1blankspace.financial.bankAccount.reconcile.items.data.items.concat(oResponse.data.rows)

													if (oResponse.morerows == 'true')
													{
														var sData =	'id=' + ns1blankspace.util.fs(oResponse.moreid) +
																		'&startrow=' + (parseInt(oResponse.rows) + parseInt(oResponse.startrow)) + 
																		'&rows=' + ns1blankspace.util.fs(oResponse.rows);
														
														$.ajax(
														{
															type: 'GET',
															url: ns1blankspace.util.endpointURI('CORE_SEARCH_MORE'),
															data: sData,
															dataType: 'json',
															success: function(data){ns1blankspace.financial.bankAccount.mapping.apply.init(oParam, data)}
														});
													}	
													else
													{
														oParam = ns1blankspace.util.setParam(oParam, 'step', 1);
														ns1blankspace.financial.bankAccount.mapping.apply.process(oParam);
													}	
												}	
											},

								match: 		function (oItem, oMapping)
											{
												var bMatch = false;

												if (oItem.status == 1 && (oItem.category == oMapping.mapfrom))
												{	
													if (oMapping.descriptionmatchtype == 1)
													{	
														if ((oItem.description).toUpperCase() == (oMapping.mapfromdescription).toUpperCase()) {bMatch = true};
													}	

													if (oMapping.descriptionmatchtype == 2 && oMapping.mapfromdescription != '')
													{	
														if ((oItem.description).toUpperCase().indexOf((oMapping.mapfromdescription).toUpperCase()) != -1) {bMatch = true};
													}
												}	

												return bMatch;
											},			

								process: 	function (oParam)
											{
												var iFileSourceID = ns1blankspace.util.getParam(oParam, 'fileSource').value;
												var iStep = ns1blankspace.util.getParam(oParam, 'step', {default: 0}).value;
												var iType = ns1blankspace.util.getParam(oParam, 'type', {default: 1}).value;
												var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1, default: ''}).value;
												var iIndex = ns1blankspace.util.getParam(oParam, 'index', {default: 0}).value;

												if (iStep == 0)
												{
													ns1blankspace.financial.bankAccount.mapping.apply.init(oParam);
												}	
												
												if (iStep == 1)
												{
													ns1blankspace.status.working('Matching...')

													$.each(ns1blankspace.financial.bankAccount.reconcile.items.data.items, function (i, v)
													{
														var aMatch = 
														$.grep(ns1blankspace.financial.bankAccount.reconcile.items.data.mappings, function (a)
														{
															return ns1blankspace.financial.bankAccount.mapping.apply.match(v, a);
														});  
														
														if (aMatch.length > 0)
														{
															oMatch = aMatch[0];
															v.mapping = oMatch;
														}
													});

													oParam = ns1blankspace.util.setParam(oParam, 'step', 2);
													ns1blankspace.financial.bankAccount.mapping.apply.process(oParam);
												}

												if (iStep == 2)
												{	
													if (iIndex < ns1blankspace.financial.bankAccount.reconcile.items.data.items.length)
													{
														ns1blankspace.status.working('Matching... (' + iIndex + '/' + ns1blankspace.financial.bankAccount.reconcile.items.data.items.length + ')');
														
														var oItem = ns1blankspace.financial.bankAccount.reconcile.items.data.items[iIndex];

														var oData =
														{
															id: oItem.id,
															status: 3
														}

														if (oItem.mapping != undefined)
														{	
															if (oItem.mapping.maptofinancialaccount != '') {oData.financialaccount = oItem.mapping.maptofinancialaccount}
															if (oItem.mapping.maptodescription != '') {oData.description = oItem.mapping.maptodescription}
															if (oItem.mapping.taxtype != '') {oData.taxtype = oItem.mapping.taxtype}
														}		

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE'),
															data: oData,
															dataType: 'json',
															global: false,
															success: 	function(data)
																		{
																			oParam = ns1blankspace.util.setParam(oParam, 'index', iIndex + 1);
																			ns1blankspace.financial.bankAccount.mapping.apply.process(oParam)
																		}
														});
													}
													else
													{
														ns1blankspace.status.message('Confirmation complete');
														ns1blankspace.financial.bankAccount.import.items.show(oParam);
													}
												}
											}
							}								
				},

	import: 	{		
					init: 		function (oParam)
								{
									ns1blankspace.financial.bankAccount.reconcile.current.refresh(
									{
										onComplete: ns1blankspace.financial.bankAccount.import.show
									});
								},

					show:		function (oParam, oResponse)
								{


									if (oResponse == undefined)
									{
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceBankAccountImportColumn1" style="width: 110px;padding-right:0px;font-size:0.875em;" class="ns1blankspaceColumn1">' +
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
										oSearch.rows = 10;
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
											aHTML.push('<table class="ns1blankspace" id="ns1blankspaceBankAccountImportSources">');
											
											$(oResponse.data.rows).each(function(i) 
											{
												aHTML.push(ns1blankspace.financial.bankAccount.import.row(this));
											});
											
											aHTML.push('</table>');
											
											$('#ns1blankspaceBankAccountImportColumn1').html(aHTML.join(''));
										}
											
										$('.ns1blankspaceBankAccountImportRowSelect').click(function()
										{
											$('#ns1blankspaceBankAccountImportSources td.ns1blankspaceRowShaded').removeClass('ns1blankspaceRowShaded');
											$('#' + this.id).addClass('ns1blankspaceRowShaded');
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

										aHTML.push('<td id="ns1blankspaceBankAccountImport_processeddate-' + oRow.id + '"' +
														' class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceBankAccountImportRowSelect"' +
														' style="text-align:right;">');
															
										if (oRow.startdate != '')
										{		
											aHTML.push(oRow.startdate + '<br />');	
										}

										if (oRow.enddate != oRow.startdate)
										{		
											aHTML.push(' to ' + oRow.enddate + '<br />');	
										}
									
										aHTML.push('<span class="ns1blankspaceSub">' + oRow.processeddate + '</span></td>');

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
										$('#ns1blankspaceBankAccountImportSources td.ns1blankspaceRowShaded').removeClass('ns1blankspaceRowShaded');

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
												success: function(data)
												{
													ns1blankspace.status.message('Transactions processed.')
													ns1blankspace.financial.bankAccount.import.show();
												}
											});	
										}
									}	
								},

					items:   	{
									data: 		{},

									show:		function(oParam, oResponse)
												{
													var iFileSource;
								
													if (oParam != undefined)
													{
														if (oParam.fileSource != undefined) {iFileSource = oParam.fileSource}
													}		

													if (oResponse === undefined)
													{	
														ns1blankspace.financial.bankAccount.import.items.data = {};

														var aHTML = [];

														aHTML.push('<table class="ns1blankspaceContainer">' +
																		'<tr class="ns1blankspaceContainer">' +
																		'<td id="ns1blankspaceImportItemsColumn1">' + ns1blankspace.xhtml.loading + '</td>' +
																		'<td id="ns1blankspaceImportItemsColumn2" style="width:100px;"></td>' +
																		'</tr>' +
																		'</table>');				
														
														$('#ns1blankspaceBankAccountImportColumn2').html(aHTML.join(''));

														var oSearch = new AdvancedSearch();
														oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
														oSearch.addField('amount,area,areatext,bankaccount,bankaccounttext,capital,category,categorytext,' +
																			'contactbusiness,contactbusinesstext,contactperson,contactpersontext,description,' +
																			'externalid,financialaccount,financialaccounttext,posteddate,project,projecttext,' +
																			'source,sourcetext,status,statustext,tax,taxtype,taxtypeexpensetext,taxtyperevenuetext,type,typetext');
														oSearch.sort('posteddate', 'asc');
														oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
														if (iFileSource) {oSearch.addFilter('source', 'EQUAL_TO', iFileSource);}
														oSearch.rows = 200;
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
															var bNeedConfirm = false;

															aHTML.push('<tr class="ns1blankspaceCaption">');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Status</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
															aHTML.push('</tr>');
															
															$(oResponse.data.rows).each(function()
															{
																if (this.status == 1) {bNeedConfirm = true}
																aHTML.push(ns1blankspace.financial.bankAccount.import.items.row(this));
															});	
														}
															
														aHTML.push('</table>');
													
														$('#ns1blankspaceImportItemsColumn1').html(aHTML.join(''));

														if (ns1blankspace.financial.data.settings.taxreportcalculationmethod == 1)
														{
															$('#ns1blankspaceFinancialBankImportItems .ns1blankspaceRowEdit').button(
															{
																text: false,
															 	icons: {primary: "ui-icon-plus"}
															})
															.click(function()
															{
																ns1blankspace.financial.bankAccount.import.items.edit({xhtmlElementID: this.id})
															})
															.css('width', '15px')
															.css('height', '20px');
														}	

														var aHTML = [];
														
														aHTML.push('<table class="ns1blankspaceColumn2">');
																
														if (bNeedConfirm)
														{			
															aHTML.push('<tr><td><span id="ns1blankspaceBankAccountImportMappingsApply" class="ns1blankspaceAction">' +
																		'Confirm & apply mappings</span></td></tr>');

															aHTML.push('<tr><td id="ns1blankspaceBankAccountImportMappingsApplyStatus" style="padding-top:5px; padding-bottom:12px; font-size:0.75em;" class="ns1blankspaceSub">' +
																		'Confirm uploaded bank transactions and apply any configured mappings.</td></tr>');
														}	

														else
														{	
															if (ns1blankspace.financial.data.settings.taxreportcalculationmethod == 1)
															{	
																aHTML.push('<tr><td style="padding-top:5px; padding-bottom:12px; font-size:0.75em;" class="ns1blankspaceSub">' +
																				'Use the "+" button to create payments and receipts within this space.<br /><br />If you have already created invoices, expenses, payments or receipts, then click Reconcile.</td></tr>');
															}
															else
															{
																aHTML.push('<tr><td style="padding-top:5px; padding-bottom:12px; font-size:0.75em;" class="ns1blankspaceSub">' +
																				'You can now reconcile these bank transactions by clicking Reconcile.</td></tr>');
															}	

															//aHTML.push('<tr><td><span id="ns1blankspaceBankAccountImportNew" class="ns1blankspaceAction">' +
															//				'New Import</span></td></tr>');

														}

														aHTML.push('</table>');					
														
														$('#ns1blankspaceImportItemsColumn2').html(aHTML.join(''));

														$('#ns1blankspaceBankAccountImportNew').button(
														{
															label: "New Import"
														})
														.click(function() {
															ns1blankspace.financial.bankAccount.import.add();
														})
														.css('width', '70px');
														
														$('#ns1blankspaceBankAccountImportMappingsApply').button(
														{
															label: 'Confirm & apply mappings',
														})
														.click(function()
														{	
															ns1blankspace.financial.bankAccount.mapping.apply.init(oParam)
														})
														.css('width', '100px');

														$('#ns1blankspaceBankAccountImportCreateItems').button(
														{
															label: 'Create payments & receipts',
														})
														.click(function()
														{	
															ns1blankspace.financial.bankAccount.mapping.apply.init(oParam)
														}).
														css('width', '100px');
													}
												},

									row:		function (oRow)
												{
													var aHTML = [];

													if (oRow.processeddate != '')
													{
														aHTML.push('<tr id="ns1blankspaceFinancialImportItem_container-' + oRow.id + '" class="ns1blankspaceRow">');

														aHTML.push('<td id="ns1blankspaceFinancialImportItem_Date-' + oRow.id + '" class="ns1blankspaceRow">' +
																						oRow.posteddate + '</td>');
																							
														aHTML.push('<td id="ns1blankspaceFinancialImportItem_Description-' + oRow.id + '" class="ns1blankspaceRow">' +
																				oRow.description + '</td>');

														aHTML.push('<td id="ns1blankspaceFinancialImportItem_Amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																				 parseFloat(Math.abs((oRow.amount).parseCurrency())).formatMoney() +
																				 '<br /><span class="ns1blankspaceSub">' + oRow.categorytext + '</span></td>');						
																		
														aHTML.push('<td class="ns1blankspaceRow" id="ns1blankspaceFinancialImportItem_status-' + oRow.id + '">');

														aHTML.push((oRow.status==3?'Confirmed':oRow.statustext));

														if (oRow.status == 3)
														{	
															if (oRow.financialaccounttext != '')
															{
																aHTML.push('<br /><span class="ns1blankspaceSub">Financial account is</span><br />' + oRow.financialaccounttext);
															}

															if (this.taxtype != '')
															{
																aHTML.push('<br /><span class="ns1blankspaceSub">' + ns1blankspace.option.taxVATCaption + ' is</span>' +
																			'<br />' + (oRow.category==1?oRow.taxtyperevenuetext:oRow.taxtypeexpensetext));
															}
														}	

														aHTML.push('</td>');

														aHTML.push('<td class="ns1blankspaceRow" id="ns1blankspaceFinancialImportItem_options_edit_container-' + oRow.id + '">');

														if (oRow.status == 3)
														{	
															aHTML.push('<span id="ns1blankspaceFinancialImportItem_options_edit-' + oRow.id + '-' + (oRow.amount>0?1:2) + '" class="ns1blankspaceRowEdit"' +
																		' data-amount="' + Math.abs(oRow.amount) + '"' +
																		' data-type="' + (oRow.amount<0?1:2) + '"' +
																		' data-taxtype="' + oRow.taxtype + '"' +
																		' data-financialaccount="' + oRow.financialaccount + '"' +
																		' data-financialaccounttext="' + oRow.financialaccounttext + '"' +
																		' data-description="' + oRow.description + '"' +
																		' data-date="' + oRow.posteddate + '"' +
																		'></span>');
														}

														aHTML.push('</td></tr>');
													}
														
													return aHTML.join('');
												},

									refresh: 	function (oParam)
												{
													var iID = ns1blankspace.util.getParam(oParam, 'bankTransactionID').value;
													var iType = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 2}).value;

													$('#ns1blankspaceFinancialImportItem_options_edit_container-' + iID).html('');
													$('#ns1blankspaceFinancialImportItem_status-' + iID).html('Transferred To Financials');
													$('#ns1blankspaceFinancialImportItem_container_edit-' + iID).remove();
												},		

									edit: 		function (oParam)
												{
													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
													var sKey = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
													var iType = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 2}).value;
													var cAmount = ns1blankspace.util.getData(oParam, 'data-amount').value;
													var iTaxType = ns1blankspace.util.getData(oParam, 'data-taxtype').value;
													var iFinancialAccount = ns1blankspace.util.getData(oParam, 'data-financialaccount').value;
													var sFinancialAccountText = ns1blankspace.util.getData(oParam, 'data-financialaccounttext').value;
													var sDescription = ns1blankspace.util.getData(oParam, 'data-description').value;
													var dDate = ns1blankspace.util.getData(oParam, 'data-date').value;
													var bSplit = ns1blankspace.util.getParam(oParam, 'split', {default: false}).value;
												
													if ($('#ns1blankspaceFinancialImportItem_container_edit-' + sKey).length != 0)
													{
														$('#ns1blankspaceFinancialImportItem_container_edit-' + sKey).remove();
													}
													else
													{
														var aHTML = [];
									
														aHTML.push('<table class="ns1blankspaceContainer">' +
																			'<tr class="ns1blankspaceContainer">' +
																			'<td id="ns1blankspaceImportEditColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
																			'<td id="ns1blankspaceImportEditColumn2" class="ns1blankspaceColumn2" style="width:150px;"></td>' +
																			'</tr></table>');

														$('#ns1blankspaceFinancialImportItem_container-' + sKey).after('<tr id="ns1blankspaceFinancialImportItem_container_edit-' + sKey + '">' +
																		'<td colspan=5 class="ns1blankspaceRow"><div style="background-color: #F3F3F3; padding:5px; margin-bottom:15px;">' + aHTML.join('') + '</div></td></tr>');

														var aHTML = [];
									
														aHTML.push('<table>');
																
														aHTML.push('<tr><td id="ns1blankspaceImportEditSaveContainer" style="text-align:right;"><span id="ns1blankspaceImportEditSave" class="ns1blankspaceAction">' +
																		'Save</span></td></tr>');

														if (iType == 1 && !bSplit)
														{
															aHTML.push('<tr><td id="ns1blankspaceImportEditSplitContainer" style="text-align:right;"><span id="ns1blankspaceImportEditSplit" class="ns1blankspaceAction">' +
																		'Split</span></td></tr>');
														}	
						
														aHTML.push('<tr><td id="ns1blankspaceImportEditAmountContainer"></td></tr>');

														aHTML.push('</table>');					
														
														$('#ns1blankspaceImportEditColumn2').html(aHTML.join(''));
														
														$('#ns1blankspaceImportEditSave').button(
														{
															label: 'Create as ' + (iType==1?'receipt':'payment')
														})
														.click(function()
														{		
															$('#ns1blankspaceImportEditSaveContainer').html(ns1blankspace.xhtml.loadingSmall);

															var iObject = 3;
															if (iType == 2) {iObject = 6}  //RECEIPT
															
															ns1blankspace.financial.save.send(
															{
																bankTransactionID: sKey,
																date: dDate,
																amount: cAmount,
																description: $('#ns1blankspaceItemsEditDescription_' + sKey).val(),
																contactBusiness: $('#ns1blankspaceItemsEditContactBusiness_' + sKey).attr('data-id'),
																contactPerson: $('#ns1blankspaceItemsEditContactPerson_' + sKey).attr('data-id'),
																financialAccount: $('#ns1blankspaceFinancialAccount_' + sKey).attr('data-id'),
																object: iObject,
																bankAccount: ns1blankspace.objectContext,
																postSave: ns1blankspace.financial.bankAccount.import.items.save.process,
																showStatus: false
															});
														})
														.css('width', '70px');

														$('#ns1blankspaceImportEditSplit').button(
														{
															label: 'Split'
														})
														.click(function()
														{	
															$('#ns1blankspaceImportEditSplitContainer').html(ns1blankspace.xhtml.loadingSmall);

															var oSearch = new AdvancedSearch();
																	
															oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
															oSearch.addField('reference,amount,receiveddate,contactbusinessreceivedfromtext,contactpersonreceivedfromtext');
															oSearch.addFilter('sourcebanktransaction', 'EQUAL_TO', sKey);
															oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext)
															oSearch.rows = 200;
															oSearch.getResults(function(oResponse)
															{
																if (oResponse.data.rows.length == 0)
																{
																	var sHTML = 'There are no other receipts.'
																}	
																else if (oResponse.data.rows.length == 1)
																{
																	var sHTML = 'There is one other receipt.'
																}	
																else
																{
																	var sHTML = 'There are ' + oResponse.data.rows.length + ' other receipts.'
																}	

																$('#ns1blankspaceImportEditSplitContainer').html('<span class="ns1blankspaceSub">' + sHTML + '</span>');

																$('#ns1blankspaceFinancialAccountContainer_' + sKey).after('<tr><td class="ns1blankspaceCaption">' +
																		'Amount' +
																		'</td></tr>' +
																		'<tr><td class="ns1blankspaceText">' +
																		'<input id="ns1blankspaceItemAmount_' + sKey + '" class="ns1blankspaceText">' +
																		'</td></tr>');
															});
														})
														.css('width', '70px');

														var aHTML = [];

														aHTML.push('<table class="ns1blankspace">');							
															
														aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																		'Business' +
																		'</td></tr>' +
																		'<tr><td class="ns1blankspaceSelect">' +
																		'<input id="ns1blankspaceItemsEditContactBusiness_' + sKey + '" class="ns1blankspaceSelect"' +
																			' data-method="CONTACT_BUSINESS_SEARCH"' +
																			' data-columns="tradename">' +
																		'</td></tr>');
																	
														aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																		'Person' +
																		'</td></tr>' +
																		'<tr><td class="ns1blankspaceSelect">' +
																		'<input id="ns1blankspaceItemsEditContactPerson_' + sKey + '" class="ns1blankspaceSelect"' +
																			' data-method="CONTACT_PERSON_SEARCH"' +
																			' data-columns="surname"' +
																			' data-parent="ns1blankspaceItemsEditContactBusiness_' + sKey + '"' +
																			' data-parent-search-id="contactbusiness"' +
																			' data-parent-search-text="tradename">' +
																		'</td></tr>');

														aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																		'Financial Account' +
																		'</td></tr>' +
																		'<tr id="ns1blankspaceFinancialAccountContainer_' + sKey + '"><td class="ns1blankspaceSelect">' +
																		'<input id="ns1blankspaceFinancialAccount_' + sKey + '" class="ns1blankspaceSelect"' +
																			' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
																			' data-columns="title">' +
																		'</td></tr>');							
																			
														aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																		ns1blankspace.option.taxVATCaption + ' Type' +
																		'</td></tr>' +
																		'<tr><td id="ns1blankspaceFinancialTaxCode_' + sKey + '" class="ns1blankspaceRadio">' +
																		ns1blankspace.xhtml.loadingSmall +
																		'</td></tr>');	

														aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																		ns1blankspace.option.taxVATCaption + ' Amount' +
																		'</td></tr>' +
																		'<tr><td class="ns1blankspaceText">' +
																		'<input id="ns1blankspaceItemTax_' + sKey + '" class="ns1blankspaceText">' +
																		'</td></tr>');
	
														aHTML.push('<tr><td class="ns1blankspaceCaption">' +
																		'Description' +
																		'</td></tr>' +
																		'<tr><td class="ns1blankspaceTextMulti">' +
																		'<textarea rows="2" cols="35" id="ns1blankspaceItemsEditDescription_' + sKey + '" class="ns1blankspaceTextMultiSmall"></textarea>' +
																		'</td></tr>');

														aHTML.push('</table>');	

														$('#ns1blankspaceImportEditColumn1').html(aHTML.join(''));

														$('#ns1blankspaceFinancialAccount_' + sKey).attr('data-id', iFinancialAccount);
														$('#ns1blankspaceFinancialAccount_' + sKey).val(sFinancialAccountText);
														$('#ns1blankspaceItemsEditDescription_' + sKey).val(sDescription);

														$('#ns1blankspaceItemsEditContactBusiness-' + sKey).focus();

														ns1blankspace.financial.util.tax.codes(
														{
															xhtmlElementID: 'ns1blankspaceFinancialTaxCode_' + sKey,
															xhtmlElementName: 'radioTaxCode_' + sKey,
															id: iTaxType,
															type: iType,
														});

														ns1blankspace.financial.util.tax.calculate(
														{
															amount: cAmount,
															taxXHTMLElementID: 'ns1blankspaceItemTax_' + sKey,
															taxTypeXHTMLElementName: 'radioTaxCode_' + sKey
														});

														$('[name="radioTaxCode_' + sKey + '"]').click(function()
														{
															ns1blankspace.financial.util.tax.calculate(
															{
																amount: cAmount,
																taxXHTMLElementID: 'ns1blankspaceItemTax_' + sKey,
																taxTypeXHTMLElementName: 'radioTaxCode_' + sKey
															});
														});
													}	
												},

									save: 		{
													process: 	function (oParam, oResponse)
																{
																	var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
																	var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext').value;
																	var iID = ns1blankspace.util.getParam(oParam, 'bankTransactionID').value;

																	var oData =
																	{
																		id: iID,
																		status: 4
																	}
																		
																	if (iObject !== undefined) {oData.object = iObject}
																	if (iObjectContext !== undefined) {oData.objectContext = iObjectContext}
	
																	$.ajax(
																	{
																		type: 'POST',
																		url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE'),
																		data: oData,
																		dataType: 'json',
																		global: false,
																		success: 	function(data)
																					{
																						ns1blankspace.financial.bankAccount.import.items.save.reconcile(oParam)
																					}
																	});
																},

													reconcile:  function (oParam)
																{
																	var iID = ns1blankspace.util.getParam(oParam, 'bankTransactionID').value;

																	if (ns1blankspace.financial.bankAccount.reconcile.current.data.id !== undefined)
																	{	
																		var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
																		var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext').value;

																		var oData =
																		{
																			reconciliation: ns1blankspace.financial.bankAccount.reconcile.current.data.id,
																			object: iObject,
																			objectcontext: iObjectContext,
																			sourcebanktransaction: iID
																		};

																		$.ajax(
																		{
																			type: 'POST',
																			url: ns1blankspace.util.endpointURI('FINANCIAL_RECONCILIATION_ITEM_MANAGE'),
																			data: oData,
																			dataType: 'json',
																			success: function(data)
																			{
																				ns1blankspace.financial.bankAccount.import.items.refresh(oParam);
																			}
																		});
																	}
																	else
																	{
																		ns1blankspace.financial.bankAccount.import.items.refresh(oParam);
																	}
																},

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
										oSearch.addFilter('status', 'EQUAL_TO', iMode)
										oSearch.sort('statementdate', 'desc');
										oSearch.rows = 12;
										oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.show(oParam, data)});
									}
									else
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspace">' +
														'<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceBankAccountColumnReconcile1" style="width: 100px;padding-right:5px;font-size:0.875em;" class="ns1blankspaceColumn1">' +
														ns1blankspace.xhtml.loading +
														'</td><td id="ns1blankspaceBankAccountColumnReconcile2" class="interfaceMainColumn2">' +
														'</td></tr></table>');				
										
										$('#ns1blankspaceMainReconcile').html(aHTML.join(''));		

										var aHTML = [];
											
										if (iMode == 1)
										{	
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table class="ns1blankspaceColumn2">' +
																'<tr><td class="ns1blankspaceNothing" style="width:300px;padding-right:20px;">All reconciliations are completed,<br />' +
																'press "Add" to create the next one.');

												aHTML.push('<td style="font-size:0.75em;"><table cellpadding=6 style="background-color:#F3F3F3;padding:6px;" >' +
															'<tr><td class="ns1blankspaceSub" colspan=2 style="font-weight:bold;">You have a number of options when reconciling a bank account:</td></tr>' + 
															'<tr><td class="ns1blankspaceCaption" style="width:15px;padding-bottom:10px;">1</td><td class="ns1blankspaceSub">' +
															'Use a printed or PDF bank statement directly.  In this case you skip the bank transactions import step and go straight to reconcile.' +
															' You can then add a reconciliation - selecting the date you want to balance up to.  You then search the system for matching payments or receipts that have already been entered or if not, add them as you go.' +
															'</td></tr>' + 
															'<tr><td class="ns1blankspaceCaption" style="width:15px;padding-top:10px;">2</td><td class="ns1blankspaceSub" style="padding-top:10px;">' +
															'You export a file from your bank and then import it.' +
															'  You can then add a reconciliation - selecting the date you want to balance up to.  The system will then help you then search the system for matching payments or receipts that have already been entered, based on imported bank transactions or if not, add them as you go.' +
															'</td></tr></table></td></tr>');
											}
											else
											{	
												aHTML.push('<table class="ns1blankspaceColumn2">' +
																'<tr><td class="ns1blankspaceNothing" style="width:300px;padding-right:20px;">All current reconciliations are shown.<br /><br />Click Completed to see past reconcilations.');
											}	

											aHTML.push('</table>');
										}
										else
										{
											aHTML.push('<table class="ns1blankspaceColumn2">' +
														'<tr><td class="ns1blankspaceNothing">The last twelve completed reconciliations are shown.</td></tr></table>')
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

										$('#ns1blankspaceBankAccountReco .ns1blankspaceFinancialBankAccountReconcileContainer')
										.click(function()
										{
											$('#ns1blankspaceBankAccountReco td.ns1blankspaceRowShaded').removeClass('ns1blankspaceRowShaded');
											$('td', $('#' + this.id).closest('tr')).addClass('ns1blankspaceRowShaded');

											$('#ns1blankspaceBankAccountColumnReconcile2').html('');

											var aID = (this.id).split('-');

											oParam.reconciliation = aID[1];
											oParam.status = aID[2];
											oParam.reconciliationEndDate = $(this).attr('data-date');

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
													' style="cursor: pointer;" id="ns1blankspaceFinancialBankAccountReconcile-' + oRow.id + '-' + oRow.status + '"' +
													' data-date="' + oRow.statementdate + '">');

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

					current: 	{
									data: 		{},

									refresh:	function (oParam, oResponse)
												{
													if (oResponse === undefined)
													{
														var oSearch = new AdvancedSearch();
														oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
														oSearch.addField('statementbalance,statementdate,statustext,status,previousbalance');
														oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
														oSearch.addFilter('status', 'EQUAL_TO', 1)
														oSearch.sort('statementdate', 'desc');
														oSearch.rows = 1;
														oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.current.refresh(oParam, data)});
													}
													else
													{
														ns1blankspace.financial.bankAccount.reconcile.current.data = {};

														if (oResponse.data.rows.length > 0)
														{	
															ns1blankspace.financial.bankAccount.reconcile.current.data = oResponse.data.rows[0];
														}	

														ns1blankspace.util.onComplete(oParam);
													}	
												}
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

										if (parseFloat((oResponse.outofbalance).parseCurrency()) !== 0)
										{	
											aHTML.push('<div style="margin-right:3px; margin-bottom:7px; font-size:0.875em;" class="ns1blankspaceSub">' +
															'$' + (oResponse.outofbalance).parseCurrency().formatMoney(2, ".", ",")  + '</div>')
										}	
	
										if (iStatus == 1 & iMode == 1)
										{	
											aHTML.push('<div style="width: 20px; margin-left:5px; margin-right:2px; margin-bottom:10px; float:right;" class="ns1blankspaceBankAccountRecoEdit" id="ns1blankspaceBankAccountRecoEdit-' + iReconciliation + '">' +
															'Edit</div>');
										}

										if (iMode == 1 && iStatus == 1 && parseFloat((oResponse.outofbalance).parseCurrency()) == 0)
										{	
											aHTML.push('<div style="width:20px; margin-left:5px; margin-right:2px; margin-bottom:10px; float:right;" class="ns1blankspaceBankAccountRecoLock" id="ns1blankspaceBankAccountRecoLock-' + iReconciliation + '">' +
															'Lock</div>');
										}

										if (iMode == 1)
										{	
											aHTML.push('<div style="text-align:right; margin-left:5px; margin-right:3px; margin-bottom:10px;" id="ns1blankspaceBankAccountColumnItemMode">');											
											aHTML.push('<input style="width: 100%;" type="radio" id="ns1blankspaceBankAccountColumnItemMode-1-' + iReconciliation + '" name="radioMode" checked="checked" /><label for="ns1blankspaceBankAccountColumnItemMode-1-' + iReconciliation + '" style="width: 90px;">' +
															'Unreconciled</label>');
											aHTML.push('<input style="width: 100%;" type="radio" id="ns1blankspaceBankAccountColumnItemMode-2-' + iReconciliation + '" name="radioMode" /><label for="ns1blankspaceBankAccountColumnItemMode-2-' + iReconciliation + '" style="width: 90px;">' +
															'Reconciled</label>');
											aHTML.push('</div>');
										}	

										aHTML.push('<div style="text-align:right; margin-left:5px; margin-right:3px; margin-bottom:5px;" id="ns1blankspaceBankAccountColumnItemType">');
										aHTML.push('<input style="width: 100%;" type="radio" id="ns1blankspaceBankAccountColumnItemType-1-' + iReconciliation + '" name="radioType" checked="checked" /><label for="ns1blankspaceBankAccountColumnItemType-1-' + iReconciliation + '" style="width: 90px;">' +
														'Debits</label>');
										aHTML.push('<input style="width: 100%;"  type="radio" id="ns1blankspaceBankAccountColumnItemType-2-' + iReconciliation + '" name="radioType" /><label for="ns1blankspaceBankAccountColumnItemType-2-' + iReconciliation + '" style="width: 90px;">' +
														'Credits</label>');
										aHTML.push('</div>');

										$('#ns1blankspaceControlContext_reco_summary-' + iReconciliation).html(aHTML.join(''));

										$('#ns1blankspaceBankAccountColumnItemType').buttonset().css('font-size', '0.75em');
										
										$('#ns1blankspaceBankAccountColumnItemType :radio').click(function()
										{
											var aID = (this.id).split('-');
											oParam = ns1blankspace.util.setParam(oParam, 'type', parseInt(aID[1]));
											oParam = ns1blankspace.util.setParam(oParam, 'reconciliation', parseInt(aID[2]));

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

										$('#ns1blankspaceBankAccountColumnItemMode').buttonset().css('font-size', '0.75em');

										$('#ns1blankspaceBankAccountColumnItemMode :radio').click(function()
										{
											var aID = (this.id).split('-');
											iMode = parseInt(aID[1]);

											oParam = ns1blankspace.util.setParam(oParam, 'mode', iMode);
											oParam = ns1blankspace.util.setParam(oParam, 'reconciliation', parseInt(aID[2]));

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
											text: false,
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
											text: false,
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
													ns1blankspace.financial.bankAccount.init({id: ns1blankspace.objectContext});
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
													var dReconciliationEndDate;
													var iType = 1;
													var iStatus = 2;
													
													if (oParam != undefined)
													{
														if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
														if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
														if (oParam.options != undefined) {oOptions = oParam.options}
														if (oParam.actions != undefined) {oActions = oParam.actions}
														if (oParam.reconciliation != undefined) {iReconciliation = oParam.reconciliation}
														if (oParam.reconciliationEndDate != undefined) {dReconciliationEndDate = oParam.reconciliationEndDate}
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
														
														$('#ns1blankspaceBankAccountReconcileColumnItem').html(ns1blankspace.xhtml.loadingSmall);
														
														var oSearch = new AdvancedSearch();
														
														oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
														oSearch.addField('description,amount,posteddate');
														oSearch.sort('posteddate', 'desc');
														oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
														oSearch.addFilter('status', 'EQUAL_TO', 3);
														oSearch.addFilter('category', 'EQUAL_TO', (iType==1?2:1));
														oSearch.addFilter('posteddate', 'LESS_THAN_OR_EQUAL_TO', dReconciliationEndDate);
														oSearch.rows = 200;
														oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.items.show(oParam, data)});		
													}
													else
													{		
														var aHTML = [];
															
														aHTML.push('<div class="ns1blankspaceHeaderCaption" style="width: 150px;margin-right:10px;margin-bottom:3px;">');
														aHTML.push('<span style="font-size:1.25em;">FROM BANK</span>');
														aHTML.push('</div>');

														aHTML.push('<div id="ns1blankspaceBankAccountReconcileItems" style="width: 150px;margin-bottom:3px;"></div>');
														
														$('#ns1blankspaceBankAccountReconcileColumnItem').html(aHTML.join(''));
														
														var aHTML = [];

														$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html('<span class="ns1blankspaceAction" id="ns1blankspaceShowAll"></span>');

														$('#ns1blankspaceShowAll').button({
															label: 'Show All Unreconciled ' + (iType==1?'Payments':'Receipts') + ' & Journals',
														})
														.click(function() {
															$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html('');
															oParam = ns1blankspace.util.setParam(oParam, 'step', 0);
															ns1blankspace.financial.bankAccount.reconcile.items.init(oParam);
														})	

														var aHTML = [];
													
														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<table id="ns1blankspaceReconcileItems"><tr class="ns1blankspace">');

															aHTML.push('<td class="ns1blankspaceNothing">There are no imported bank ' + (iType==1?'debit':'credit') +
																	' transactions.<br /><br />If you haven\'t aready, you can either import transactions from a file or reconcile from a statement.' +
																	'<br /><br /></td>');
																			
															aHTML.push('</tr></table>');

															$('#ns1blankspaceBankAccountReconcileItems').html(aHTML.join(''));							
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
																	aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																	aHTML.push('<span id="ns1blankspaceReconcileItems_options_search-' + this.id + '"' +
																					' data-searchDate="' + this.posteddate + '"' +
																					' data-searchAmount="' + Math.abs((this.amount).parseCurrency()).toFixed(2) + '"' +
																					' data-amount="' + Math.abs(this.amount) + '"' +
																					' data-type="' + (this.amount<0?1:2) + '"' +
																					' data-taxtype="' + this.taxtype + '"' +
																					' data-financialaccount="' + this.financialaccount + '"' +
																					' data-financialaccounttext="' + this.financialaccounttext + '"' +
																					' data-description="' + this.description + '"' +
																					' data-date="' + this.posteddate + '"' +
																					' class="ns1blankspaceReconcileItemsMatch"></span>');
																	aHTML.push('</td>');
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
																$.extend(true, oParam,
																{
																	sourceXHTMLElementID: this.id,
																	searchSourceID: aID[1],
																	searchDate: $(this).attr("data-searchDate"),
																	searchAmount: $(this).attr("data-searchAmount"),
																	searchReference: '',
																	step: 0
																});
																$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html('');
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
													var dReconciliationEndDate = ns1blankspace.util.getParam(oParam, 'reconciliationEndDate').value;

													if (iStep == 0)
													{
														var sClass = (iType == 1?'debits':'credits')
														var sType = (iType == 1?'payments':'receipts')

														if (ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass] === undefined)
														{
															ns1blankspace.status.working('Getting ' + sType + '...');
															oParam = ns1blankspace.util.setParam(oParam, 'step', iStep + 1);
															ns1blankspace.financial.bankAccount.reconcile.items.init(oParam);
														}
														else
														{
															oParam = ns1blankspace.util.setParam(oParam, 'step', undefined);
															ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
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
																oSearch.addFilter('paiddate', 'LESS_THAN_OR_EQUAL_TO', dReconciliationEndDate);
															}	
															else
															{
																oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
																oSearch.addField('reference,description,amount,receiveddate,reconciliation,contactbusinessreceivedfromtext,contactpersonreceivedfromtext');
																oSearch.addFilter('receiveddate', 'LESS_THAN_OR_EQUAL_TO', dReconciliationEndDate);
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

															$.each(ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sType], function (i, v)
															{
																v.type = (iType == 1?'payment':'receipt');
															});

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
																ns1blankspace.status.working('Getting journals...');

																var oSearch = new AdvancedSearch();
															
																oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_ITEM_SEARCH';
																oSearch.addField('taxcategory,creditamount,debitamount,reconciliation,generaljournalitem.generaljournal.reference,generaljournalitem.generaljournal.description,generaljournalitem.generaljournal.journaldate');
																oSearch.sort('generaljournalitem.generaljournal.journaldate', 'asc');
																oSearch.addFilter('reconciliation', 'IS_NULL');
																oSearch.addFilter('status', 'EQUAL_TO', 2);
																oSearch.addFilter('financialaccount', 'EQUAL_TO', ns1blankspace.financial.data.settings.financialaccountcash);
																oSearch.addFilter('generaljournalitem.generaljournal.journaldate', 'LESS_THAN_OR_EQUAL_TO', dReconciliationEndDate);
																oSearch.rows = 200;
																oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.items.init(oParam, data)});
															}
															else
															{	
																ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled['journals'] = oResponse.data.rows;
																$.each(ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled['journals'], function (i, v)
																{
																	v.type = 'journal';
																});

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
														oParam = ns1blankspace.util.setParam(oParam, 'source', undefined);
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
													var dSearchDate = '';
													var cSearchAmount = '';
													var sSearchReference = '';
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

														aHTML.push('<div class="ns1blankspaceHeaderCaption" style="width: 100%;margin-right:10px;margin-bottom:3px;">');
														aHTML.push('<span style="font-size:1.25em;">THIS SPACE</span>');
														aHTML.push('</div>');
														
														aHTML.push('<table class="ns1blankspaceContainer">' +
																		'<tr class="ns1blankspaceContainer">' +
																		'<td id="ns1blankspaceReconcileItemEdit1"></td>' +
																		'<td id="ns1blankspaceReconcileItemEdit2" style="width:90px; border-left-style:solid; border-width:0px; border-color:#B8B8B8; padding-left:7px;"></td>' +
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
		
														$('#ns1blankspaceReconcileItemEditOption').buttonset().css('font-size', '0.75em');
														
														$('#ns1blankspaceReconcileItemEditOption :radio').click(function()
														{
															var aID = (this.id).split('-');
															$.extend(true, oParam, {editAction: 1, source: parseInt(aID[1])});
															ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
														});
													}

													if (iEditAction == 1)  //SET UP SEARCH PAYMENT OR RECEIPT +++
													{
														var aHTML = [];
														
														aHTML.push('<table style="width:100%;" class="ns1blankspaceColumn2">');
														
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

														if ((iSource == 1 && ns1blankspace.financial.data.settings.taxreportcalculationmethod == 1) ||
																iSource == 2)
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
														.click(function() 
														{
															oParam.editAction = 1;
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
															oParam.editAction = 1;
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
																if (k.paiddate !== undefined) {k.date = k.paiddate}
																if (k.receiveddate !== undefined) {k.date = k.receiveddate}
																if (k['generaljournalitem.generaljournal.journaldate'] !== undefined) {k.date = k['generaljournalitem.generaljournal.journaldate']}
																if (k['generaljournalitem.generaljournal.reference'] !== undefined) {k.reference = k['generaljournalitem.generaljournal.reference']}

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

																var sDescription = k.description;

																if (iType === 1)
																{
																	if (k.contactbusinesspaidtotext !== '')
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

																k.dateSort = Date.parse(k.date);
																			
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
																		sHTML += '<br / >that closely match this bank transaction.';
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

																ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass + '-searched'].sort(ns1blankspace.util.sortBy('dateSort'));

																aHTML.push('<table id="ns1blankspaceReconcileItemsEdit">');
																
																$.each(ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass + '-searched'], function()
																{
																	aHTML.push(
																		'<tr class="ns1blankspaceRow">' +
																		'<td class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																		'<table cellspacing=0 cellpadding=0><tr>');
																					
																		aHTML.push('<td id="ns1blankspaceReconcileItems_date-' + this.id + '-1" class="recoitempayment">' +
																								this.date + '</td>');

																		aHTML.push('<td id="ns1blankspaceReconcileItems_amount-' + this.id + '" style="text-align:right;"' +
																								' class="recoitem">' +
																								this.amount + '</td>');																					
																		
																		var sDescription = this.description + ' (' + this.type + ')';

																		aHTML.push('</tr><tr><td colspan=2 id="ns1blankspaceReconcileItems_reference-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																							' class="recoitem" title="' + this.reference + '">' +
																							sDescription + '</td>');
																					
																	aHTML.push('</tr></table></td>');	
																		

																	if (iStatus == 1)
																	{					
																		aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																		aHTML.push('<span id="ns1blankspaceReconcileItems_options_add-' + this.id + '-' + this.type + '" class="ns1blankspaceReconcileItemsAdd" title="Mark as reconciled"></span>');
																		aHTML.push('</td>');
																		aHTML.push('</tr>');
																	}	
																});
																
																aHTML.push('</table>');

																$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));

																$('#ns1blankspaceReconcileItemsEdit .ns1blankspaceReconcileItemsAdd').button(
																{
																	text: false,
																	icons:
																	{
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
																	oSearch.addField('reference,description,amount,paymentduedate,outstandingamount,contactbusinesspaidtotext,contactpersonpaidtotext');
																	if (dSearchDate) {oSearch.addFilter('paymentduedate', 'LESS_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(7).toString("dd-MMM-yyyy"))}
																	oSearch.sort('paymentduedate', 'asc');
																}	
																else
																{
																	oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
																	oSearch.addField('reference,description,amount,duedate,outstandingamount,contactbusinesssenttotext,contactpersonsenttotext');
																	if (dSearchDate) {oSearch.addFilter('duedate', 'LESS_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(7).toString("dd-MMM-yyyy"))}
																	oSearch.sort('duedate', 'asc');
																}
															
																if (cSearchAmount) {oSearch.addFilter('amount', 'APPROX_EQUAL_TO', cSearchAmount)}
																if (sSearchReference) {oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchReference)}

																oSearch.addFilter('outstandingamount', 'NOT_EQUAL_TO', 0)
																
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
																									this.paymentduedate + '</td>');
																			}
																			else if (this.duedate)
																			{
																				aHTML.push('<td id="tdRecoItems_date-' + this.id + '-2" class="recoitemreceipt">' +
																									this.duedate + '</td>');
																			}							
																			
																			aHTML.push('<td id="ns1blankspaceReconcileItems_amount-' + this.id + '" style="text-align:right;"' +
																								' class="recoitem">' +
																								this.outstandingamount + '</td>');
																			
																			var sDescription = '';

																			if (this.description != '')
																			{
																				sDescription += this.description + '<br />';
																			}	

																			if (iType === 1)
																			{
																				if (this.contactbusinesspaidtotext !== '')
																				{
																					sDescription += this.contactbusinesspaidtotext + '<br />';
																				}

																				if (this.contactpersonpaidtotext !== '')
																				{
																					sDescription += this.contactpersonpaidtotext + '<br />';
																				}
																			}
																			else
																			{
																				if (this.contactbusinesssenttotext !== '')
																				{
																					sDescription += this.contactbusinesssenttotext + '<br />';
																				}

																				if (this.contactpersonsenttotext !== '')
																				{
																					sDescription += this.contactpersonsenttotext + '<br />';
																				}
																			}

																			sDescription += '$' + this.outstandingamount + ' / ' + this.reference;

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
													}	

													else if (iEditAction == 3)  //MARK PAYMENT / RECEIPT / JOURNAL AS RECONCILED
													{
														ns1blankspace.status.working();

														var aXHTMLElementID = sXHTMLElementID.split('-');
														var oData = {reconciliation: iReconciliation};

														if (iObject === undefined)
														{	
															if (aXHTMLElementID[2] == 'payment') {iObject = 3}
															if (aXHTMLElementID[2] == 'receipt') {iObject = 6}
															if (aXHTMLElementID[2] == 'journal') {iObject = 122}
														}
														
														oData.object = iObject;
														oData.objectcontext = aXHTMLElementID[1];
														oData.sourcebanktransaction = iSearchSourceID;	

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_RECONCILIATION_ITEM_MANAGE'),
															data: oData,
															dataType: 'json',
															success: function(data)
															{
																$('#' + sXHTMLElementID).parent().parent().fadeOut(500);

																if (iObject == 122)
																{
																	ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled['journals'] =
																		ns1blankspace.util.remove(ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled['journals'], 'id', aXHTMLElementID[1]);
																}	
																else
																{	
																	ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[(iObject==3?'payments':'receipts')] = 
																		ns1blankspace.util.remove(ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[(iObject==3?'payments':'receipts')], 'id', aXHTMLElementID[1]);
																}	

																if (iSearchSourceID !== undefined)
																{	
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
																	});
																}
																else
																{
																	ns1blankspace.status.message('Reconciled');
																}	
															}
														});
													}	
													
													else if (iEditAction == 4) //MANUALLY ADD PAYMENT OR RECEIPT
													{
														if (oResponse == undefined)
														{
															var aHTML = [];
															
															aHTML.push('<table class="ns1blankspace" style="width:270px;">');							
															
															aHTML.push('<tr class="ns1blankspaceCaption">' +
																			'<td class="ns1blankspaceCaption">' +
																			'Business' +
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceSelect">' +
																			'<input id="ns1blankspaceItemContactBusiness" class="ns1blankspaceSelect"' +
																				' data-method="CONTACT_BUSINESS_SEARCH"' +
																				' data-columns="tradename">' +
																			'</td></tr>');
																		
															aHTML.push('<tr class="ns1blankspaceCaption">' +
																			'<td class="ns1blankspaceCaption">' +
																			'Person' +
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceSelect">' +
																			'<input id="ns1blankspaceItemContactPerson" class="ns1blankspaceSelect"' +
																				' data-method="CONTACT_PERSON_SEARCH"' +
																				' data-columns="surname"' +
																				' data-parent="ns1blankspaceItemContactBusiness"' +
																				' data-parent-search-id="contactbusiness"' +
																				' data-parent-search-text="tradename">' +
																			'</td></tr>');		

															aHTML.push('<tr class="ns1blankspaceCaption">' +
																			'<td class="ns1blankspaceCaption">' +
																			'Date' +
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceText">' +
																			'<input id="ns1blankspaceItemDate" class="ns1blankspaceDate">' +
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
																			'<td id="ns1blankspaceItemTaxCode" class="ns1blankspaceRadio">' +
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
																			'<tr class="ns1blankspaceTextMulti">' +
																			'<td class="ns1blankspaceTextMulti">' +
																			'<textarea rows="3" cols="35" id="ns1blankspaceItemDescription" class="ns1blankspaceTextMultiSmall"></textarea>' +
																			'</td></tr>');
															
															aHTML.push('<tr class="ns1blankspaceCaption">' +
																			'<td class="ns1blankspaceCaption">' +
																			'Financial Account' +
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceSelect">' +
																			'<input id="ns1blankspaceItemFinancialAccount" class="ns1blankspaceSelect"' +
																				' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
																				' data-columns="title">' +
																			'</td></tr>');	

															aHTML.push('</table>');					
														
															$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));
														
															$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});

															$('#ns1blankspaceItemDate').val(dSearchDate);
															$('#ns1blankspaceItemAmount').val(cSearchAmount);

															var iTaxType = 1;
															var iType = 1;

															if (ns1blankspace.util.param(oParam, 'sourceXHTMLElementID').exists)
															{	
																$('#ns1blankspaceItemDescription').val(ns1blankspace.util.getData(oParam, 'data-description', {param: 'sourceXHTMLElementID'}));
																$('#ns1blankspaceFinancialAccount').val(ns1blankspace.util.getData(oParam, 'data-financialaccounttext', {param: 'sourceXHTMLElementID'}));
																$('#ns1blankspaceFinancialAccount').attr('data-id', ns1blankspace.util.getData(oParam, 'data-financialaccount', {param: 'sourceXHTMLElementID'}));
																iTaxType = ns1blankspace.util.getData(oParam, 'data-taxtype', {param: 'sourceXHTMLElementID'});
																iType = ns1blankspace.util.getData(oParam, 'data-type', {param: 'sourceXHTMLElementID'});
															}

															ns1blankspace.financial.util.tax.codes(
															{
																xhtmlElementID: 'ns1blankspaceFinancialTaxCode',
																id: iTaxType,
																type: iType,
																xhtmlElementName: 'radioItemTaxCode'
															});

															$('#ns1blankspaceItemAmount').keyup(function()
															{
																ns1blankspace.financial.util.tax.calculate(
																{
																	amountXHTMLElementID: 'ns1blankspaceItemAmount',
																	taxXHTMLElementID: 'ns1blankspaceItemTax',
																	taxTypeXHTMLElementName: 'radioItemTaxCode'
																});
															});

															$('[name="radioItemTaxCode"]').click(function()
															{
																ns1blankspace.financial.util.tax.calculate(
																{
																	amountXHTMLElementID: 'ns1blankspaceItemAmount',
																	taxXHTMLElementID: 'ns1blankspaceItemTax',
																	taxTypeXHTMLElementName: 'radioItemTaxCode'
																});
															});

															var aHTML = [];
															
															aHTML.push('<table class="ns1blankspaceColumn2">');
															
															aHTML.push('<tr><td id="ns1blankspaceReconcileItemsEditSave">' +
																			'<span id="ns1blankspaceReconcileItemsEditSave" class="ns1blankspaceAction">Save</span>' +
																			'</td></tr>');
															
															aHTML.push('</table>');					
															
															$('#ns1blankspaceReconcileItemEdit2').html(aHTML.join(''));
														
															$('#ns1blankspaceReconcileItemsEditSave').button(
															{
																label: 'Save'	
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
																		oParam.object = (iType==1?3:6)
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
													var iStatus = 2;
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
														if (oParam.status != undefined) {iStatus = oParam.status}
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
																		'Journals</label>');

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

																if (iStatus == 1)
																{					
																	aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																	aHTML.push('<span id="ns1blankspaceReconcileItems_options_remove-' + this.id + '-' + iType + '"' +
																					' data-amount="' + cAmount + '"' +
																					' class="ns1blankspaceReconcileItemsRemove"></span>');
																	aHTML.push('</td>');
																	aHTML.push('</tr>');
																}	
															});
															
															aHTML.push('</table>');

															$('#ns1blankspaceReconcileItemsLocked').html(aHTML.join(''));

															$('.ns1blankspaceReconcileItemsRemove').button(
															{
																text: false,
															 	icons: {primary: "ui-icon-close"}
															})
															.click(function()
															{
																var sXHTMLElementID = this.id;
																var aXHTMLElementID = sXHTMLElementID.split('-');
																var iSearchSourceID;
																var iObject = 122;

																if (aXHTMLElementID[2] == 1) {iObject = 3};
																if (aXHTMLElementID[2] == 2) {iObject = 6};

																ns1blankspace.status.working();

																var oData =
																{
																	reconciliation: iReconciliation,
																	remove: 1,
																	object: iObject,
																	objectcontext: aXHTMLElementID[1]
																}

																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('FINANCIAL_RECONCILIATION_ITEM_MANAGE'),
																	data: oData,
																	dataType: 'json',
																	success: function(data)
																	{
																		$('#' + sXHTMLElementID).parent().parent().fadeOut(500);

																		ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled['debits'] = undefined;
																		ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled['credits'] = undefined;

																		if (iSearchSourceID !== undefined)
																		{	
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
																			});
																		}
																		else
																		{
																			ns1blankspace.status.message('Unreconciled');
																		}	
																	}
																});
															})
															.css('width', '15px')
															.css('height', '20px');
														}	
													}

												}	
								}
				}				
}								
