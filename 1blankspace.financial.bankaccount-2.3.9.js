/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.financial.bankAccount = 
{
	data: 	{},

	init: 	function (oParam)
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

					ns1blankspace.object = 233;
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

	home: 	function ()
				{
					if (ns1blankspace.timer.initData == undefined)
					{	
						$('#ns1blankspaceMain').html(ns1blankspace.xhtml.loading);
						ns1blankspace.timer.initData = window.setInterval('ns1blankspace.financial.bankAccount.home()', 100);
					}
					else
					{	
						window.clearInterval(ns1blankspace.timer.initData);

						if (ns1blankspace.financial.data.bankaccounts)
						{
							if (ns1blankspace.financial.data.bankaccounts.length==1)
							{	
								if (ns1blankspace.financial.data.bankaccounts[0].id != ns1blankspace.objectContext)
								{	
									ns1blankspace.financial.bankAccount.init({id: ns1blankspace.financial.data.bankaccounts[0].id});
								}	
							}
							else
							{	
								var aHTML = [];
								
								aHTML.push('<table>');

								aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
		
								aHTML.push('<tr class="ns1blankspaceControl">' +
											'<td id="ns1blankspaceControlTransfer" class="ns1blankspaceControl" style="padding-top:15px;">Transfer</td>' +
											'</tr>');

								aHTML.push('</table>');		
								
								$('#ns1blankspaceControl').html(aHTML.join(''));

								$('#ns1blankspaceControlTransfer').click(function(event)
								{
									ns1blankspace.show({selector: '#ns1blankspaceMain'});
									ns1blankspace.financial.bankAccount.transfer.show({xhtmlElementID: 'ns1blankspaceMain'});
								});	

								$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
								
								var aHTML = [];
											
								aHTML.push('<table class="ns1blankspace">');

								aHTML.push('<tr><td class="ns1blankspaceHeaderCaption" style="vertical-align:bottom;">Name</td>' +
												'<td class="ns1blankspaceHeaderCaption">Last Reconciled</td>' +
												'<td class="ns1blankspaceHeaderCaption" style="width:110px;text-align:right;">Reconciled Amount</td>' +
												'<td class="ns1blankspaceHeaderCaption" style="width:110px;text-align:center;">Unconfirmed Transactions</td>')

								if (ns1blankspace.financial.data.settings.accountingmethod == 2)
								{
									aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:110px;text-align:center;">Unreconciled Transactions</td>')
								}

								aHTML.push('</tr>');

								$.each(ns1blankspace.financial.data.bankaccounts, function()
								{
									aHTML.push('<tr class="ns1blankspaceRow">' +
													'<td id="ns1blankspaceBankAccount_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
													this["title"] + '</td>' + 
													'<td id="ns1blankspaceBankAccount_lastreconcileddate-' + this.id + '" class="ns1blankspaceRow" style="width:90px;">' +
													this.lastreconcileddate + '</td>' +
													'<td id="ns1blankspaceBankAccount_lastreconciledamount-' + this.id + '" class="ns1blankspaceRow" style="width:100px;text-align:right;">' +
													this.lastreconciledamount + '</td>' +
													'<td id="ns1blankspaceBankAccount_unconfirmed-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSub" style="width:100px;text-align:center;">' +
													'-</td>')

									if (ns1blankspace.financial.data.settings.accountingmethod == 2)
									{
										aHTML.push('<td id="ns1blankspaceBankAccount_unreconciled-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSub" style="width:100px;text-align:center;">' +
													'-</td>');

										aHTML.push('<td>&nbsp;</td></tr>');
									}	
								});
								
								aHTML.push('</table>');
					
								$('#ns1blankspaceMain').html(aHTML.join(''));

								$('.ns1blankspaceRowSelect').click(function(event)
								{
									var aID = (this.id).split('-');
									ns1blankspace.financial.bankAccount.show({id: aID[1]});
								});

								ns1blankspace.financial.bankAccount.homeData();
							}	
						}	
					}	
				},	

	homeData: function (oParam)
				{
					var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1}).value;

					if (iStep == 1)
					{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
							oSearch.addField('bankaccount,bankaccounttext,count(id) bankaccounttotal');
							oSearch.addSummaryField('count(id) total');
							oSearch.addFilter('status', 'EQUAL_TO', 1);
							oSearch.addFilter('bankaccount', 'IS_NOT_NULL');
							oSearch.rows = 100;
							oSearch.getResults(function(oResponse)
							{
								ns1blankspace.financial.bankAccount.data.home = {unconfirmed: oResponse};
								ns1blankspace.financial.bankAccount.homeData({step: 2});
							})
					}

					if (iStep == 2)
					{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
							oSearch.addField('bankaccount,bankaccounttext,count(id) bankaccounttotal');
							oSearch.addSummaryField('count(id) total');
							oSearch.addFilter('status', 'EQUAL_TO', 3);
							oSearch.addFilter('bankaccount', 'IS_NOT_NULL');
							oSearch.getResults(function(oResponse)
							{
								ns1blankspace.financial.bankAccount.data.home.unreconciled = oResponse;

								$.each(ns1blankspace.financial.data.bankaccounts, function(ba, bankAccount)
								{
									var oUnconfirmed = $.grep(ns1blankspace.financial.bankAccount.data.home.unconfirmed.data.rows, function (row)
									{	
										return row.bankaccount == bankAccount.id
									})[0];

									if (oUnconfirmed != undefined)
									{
										$('#ns1blankspaceBankAccount_unconfirmed-' + this.id).html(numeral(oUnconfirmed.bankaccounttotal).format('0,0'))
									}

									var oUnreconciled = $.grep(ns1blankspace.financial.bankAccount.data.home.unreconciled.data.rows, function (row)
									{	
										return row.bankaccount == bankAccount.id
									})[0];

									if (oUnreconciled != undefined)
									{
										$('#ns1blankspaceBankAccount_unreconciled-' + this.id).html(numeral(oUnreconciled.bankaccounttotal).format('0,0'))
									}		
								});
							})
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
										oParam.id = sSearchContext;
										ns1blankspace.financial.bankAccount.show(oParam, data);
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

											var data = {data: {rows:
												$.grep(ns1blankspace.financial.data.bankaccounts, function (bankAccount)
												{ 
													return _.includes(bankAccount.title.toLowerCase(), sSearchText.toLowerCase());
												})}}

											ns1blankspace.financial.bankAccount.search.process(oParam, data);	
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var iMaximumColumns = 1;
									var sContact;
										
									ns1blankspace.search.stop();
										
									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
									}
									else
									{		
										aHTML.push('<table class="ns1blankspaceSearchMedium" style="width:520px;">');
											
										$.each(oResponse.data.rows, function()
										{	
											aHTML.push(ns1blankspace.financial.bankAccount.search.row(oParam, this));
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.searchContainer).html(
											ns1blankspace.render.init(
											{
												html: aHTML.join(''),
												more: (oResponse.morerows == "true"),
												width: 520,
												header: false
											}) 
										);
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
											$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.financial.bankAccount.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											more: oResponse.moreid,
											width: 520,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.financial.bankAccount.search.send,
											functionRow: ns1blankspace.financial.bankAccount.search.row
										});   
									}				
								},

						row: 	function (oParam, oRow)
								{
									var aHTML = [];
									var sContact;
												
									aHTML.push('<tr class="ns1blankspaceSearch">');
								
									aHTML.push('<td class="ns1blankspaceSearch" id="' +
													'search-' + oRow.id + '">' +
													oRow.title +
													'</td>');

									aHTML.push('</tr>');
									
									return aHTML.join('')
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
									'<td id="ns1blankspaceControlMapping" class="ns1blankspaceControl">Mappings</td>' +
									'</tr>');

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlImport" class="ns1blankspaceControl">Transactions' +
									'<br /><div class="ns1blankspaceSubNote">imported from<br /><span id="ns1blankspaceFinanialBankAccountBank">bank</span></div></td>' +
									'</tr>');

					aHTML.push('</table>');

					if (ns1blankspace.financial.data.settings.accountingmethod == 2)
					{	
						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlReconcile" style="padding-bottom:6px;" class="ns1blankspaceControl">Reconcile' +
										'<br /><div class="ns1blankspaceSubNote">with statements from<br /><span class="ns1blankspaceFinanialBankAccountBank">bank</span></div></td>' +
										'</tr>');

						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlReconciliations" class="ns1blankspaceControl">Completed' +
										'<br /><div class="ns1blankspaceSubNote">reconciliations</div></td>' +
										'</tr>');

						aHTML.push('</table>');	
					}	

					aHTML.push('<table class="ns1blankspaceControl">');
				
					aHTML.push('<tr><td id="ns1blankspaceControlActions" class="ns1blankspaceControl">' +
									'Actions</td></tr>');
								
					aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
									'Attachments</td></tr>');

					aHTML.push('</table>');					
							
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainImport" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainMapping" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainReconcile" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary', refresh: true});
						ns1blankspace.financial.bankAccount.summary();
					});
					
					$('#ns1blankspaceControlImport').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainImport'});
						ns1blankspace.financial.bankAccount["import"].init();
					});

					$('#ns1blankspaceControlMapping').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainMapping', refresh: true});
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

	show: 	function (oParam, oResponse)
				{
					if (oParam != undefined)
					{
						if (oParam.id != undefined) {ns1blankspace.objectContext = oParam.id}	
					}
					
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.financial.bankAccount.layout();
					
					ns1blankspace.objectContextData == undefined;
					ns1blankspace.objectContextData = ($.grep(ns1blankspace.financial.data.bankaccounts, function (a) { return a.id == ns1blankspace.objectContext; }))[0];

					var sBank = ns1blankspace.objectContextData.bank;
					if (sBank == '') {sBank = 'bank'}
					$('#ns1blankspaceFinanialBankAccountBank').html(sBank);
					$('.ns1blankspaceFinanialBankAccountBank').html(sBank);
					
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the bank account.</td></tr></table>');
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{							
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);

							//'<br /><span class="ns1blankspaceSubContext" id="ns1blankspaceControlSubContext_date">' + ns1blankspace.objectContextData.lastreconcileddate + '</span>' +
							//'<br /><span class="ns1blankspaceSubContext" id="ns1blankspaceControlSubContext_amount">$' + ns1blankspace.objectContextData.lastreconciledamount + '</span>');
						
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
						aHTML.push('<table class="ns1blankspaceColumn2">' +
									'<tr><td class="ns1blankspaceSub">' +
									'This bank account has never been reconciled.' +
									'</td></tr></table>');
					}
					else
					{	
						aHTML.push('<table class="ns1blankspaceColumn2">' +
									'<tr><td class="ns1blankspaceSummaryCaption">Last reconciled</td></tr>' +
									'<tr><td class="ns1blankspaceSummary">' +
									ns1blankspace.objectContextData.lastreconcileddate +
									'</td></tr>' + 
									'<tr><td class="ns1blankspaceSummaryCaption">with balance of</td></tr>' +
									'<tr><td class="ns1blankspaceSummary">$' +
									ns1blankspace.objectContextData.lastreconciledamount +
									'</td></tr></table>');
					}								

					$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));

					var aHTML = [];
				
					aHTML.push('<table class="ns1blankspace">');

					if (ns1blankspace.objectContextData.accountname != '')
					{
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Name</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryAccountName" class="ns1blankspaceSummary">' +
									ns1blankspace.objectContextData.accountname +
									'</td></tr>');
					}
						
					if (ns1blankspace.objectContextData.bsb != '')
					{
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">BSB</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryBSB" class="ns1blankspaceSummary">' +
									ns1blankspace.objectContextData.bsb +
									'</td></tr>');
					}

					if (ns1blankspace.objectContextData.accountnumber != '')
					{
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Number</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryAccountNumber" class="ns1blankspaceSummary">' +
									ns1blankspace.objectContextData.accountnumber +
									'</td></tr>');
					}

					if (ns1blankspace.objectContextData.bank != '')
					{
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Bank</td></tr>' +
									'<tr><td class="ns1blankspaceSummary ns1blankspaceSummaryBank">' +
									ns1blankspace.objectContextData.bank +
									'</td></tr>');
					}

					aHTML.push('</table>');

					$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

					ns1blankspace.financial.bankAccount.bank();
				},

	bank:		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						if (ns1blankspace.objectContextData.bank != '')
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'CORE_URL_SEARCH';		
							oSearch.addField('title,url,urllogon');
							oSearch.addFilter('title', 'EQUAL_TO', ns1blankspace.objectContextData.bank);
							oSearch.sort('private', 'desc');
							oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.bank(oParam, data)});
						}	
					}
					else
					{
						var sXHTMLElement = ns1blankspace.util.getParam(oParam, 'xhtmlElement', {"default": '.ns1blankspaceSummaryBank'}).value;

						if (oResponse.data.rows.length != 0)
						{
							var oRow = oResponse.data.rows[0];
							$(sXHTMLElement).html('<a href="' + (oRow.url.indexOf('http')==-1?'http://':'') + oRow.url + '" target="_blank" title="' + oRow.urllogon + '">' +
										 oRow.title + '</a>');
						}
					}
				},

	mapping: {
					show:	function (oParam, oResponse)
							{
								var iObject = ns1blankspace.object;
								var iObjectContext = ns1blankspace.objectContext;
								var sNamespace;
								var bRefresh = false;

								ns1blankspace.financial.bankAccount.mapping.searchText = ns1blankspace.util.getParam(oParam, 'searchText', {"default": ''}).value;
								
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

										aHTML.push('<tr><td style="padding-top:2px;">' +
														'<input id="ns1blankspaceMappingSearchText" class="ns1blankspaceText" data-1blankspace="ignore" style="width:130px;">' +
														'</td></tr>');

										aHTML.push('<tr><td style="padding-top:0px;">' +
														'<span style="width:75px;" id="ns1blankspaceMappingSearch" class="ns1blankspaceAction">Search</span>' +
														'</td></tr>');
												
										aHTML.push('<tr><td style="padding-top:6px;">' +
														'<span style="width:75px;" id="ns1blankspaceMappingAdd" class="ns1blankspaceAction">Add</span>' +
														'</td></tr>');
							
										aHTML.push('</table>');					
										
										$('#ns1blankspaceMappingColumn2').html(aHTML.join(''));

										$('#ns1blankspaceMappingSearch').button(
										{
											label: 'Search'
										})
										.click(function() 
										{
											oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceMappingSearchText').val());
											ns1blankspace.financial.bankAccount.mapping.show(oParam);
										});

										$('#ns1blankspaceMappingSearchText').keyup(function(e)
										{
											if (e.which === 13)
									    	{
									    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceMappingSearchText').val())
									    		ns1blankspace.financial.bankAccount.mapping.show(oParam);
									    	}
									    });	

										$('#ns1blankspaceMappingSearchText').val(ns1blankspace.financial.bankAccount.mapping.searchText)

										$('#ns1blankspaceMappingAdd').button(
										{
											label: "Add"
										})
										.click(function()
										{
											delete oParam.step;
											ns1blankspace.financial.bankAccount.mapping.edit(oParam);
										});																		
									}

									var oSearch = new AdvancedSearch();
									oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_MAPPING_SEARCH';
									oSearch.addField('description,descriptionmatchtype,descriptionmatchtypetext,mapfrom,mapfromdescription,mapfromtext,' +
														'maporder,maptodescription,maptofinancialaccount,maptofinancialaccounttext,' +
														'maptocontactbusiness,maptocontactbusinesstext,maptocontactperson,maptocontactpersontext,' +
														'matchtype,matchtypetext,project,projecttext,status,statustext,' +
														'taxtype,taxtypeexpensetext,taxtyperevenuetext,type,typetext');

									if (ns1blankspace.financial.bankAccount.import.items.searchText != '')
									{
										oSearch.addBracket('(')

										oSearch.addFilter('mapfromdescription', 'TEXT_IS_LIKE', ns1blankspace.financial.bankAccount.mapping.searchText);
										oSearch.addOperator('or');
										oSearch.addFilter('maptocontactbusinesstext', 'TEXT_IS_LIKE', ns1blankspace.financial.bankAccount.mapping.searchText);
										oSearch.addOperator('or');
										oSearch.addFilter('maptocontactpersontext', 'TEXT_IS_LIKE', ns1blankspace.financial.bankAccount.mapping.searchText);

										oSearch.addBracket(')');
									}

									oSearch.sort('description', 'asc');
									oSearch.rows = 1000;
									oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.mapping.show(oParam, data)});
								}
								else
								{
									var aHTML = [];
									
									if (oResponse.data.rows.length == 0)
									{
										if (ns1blankspace.financial.bankAccount.import.items.searchText != '')
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">' +
													'There are no mappings that match this search.' +
													'</td></tr></table>');
										}
										else
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">' +
													'You can set up mappings to make it easier to create receipts' +
													' and payments within this space.' +
													'<br /><br />' +
													'ie. if the bank transaction description contains <i>fees</i>, ' +
													'then set the financial account as <i>Bank Charges</i>.' +
													'</td></tr></table>');
										}	

										$('#ns1blankspaceMappingColumn1').html(aHTML.join(''));
									}
									else
									{
										var sWhere;
										var sTo;

										aHTML.push('<table class="ns1blankspace" id="ns1blankspaceFinancialBankAccountMappings" style="font-size:0.875em;">');

										aHTML.push('<tr>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption">When</td>');
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
												sWhere +=  '<br /><span style="font-weight:600;">' + this.mapfromdescription + '</span>';
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

											if (this.maptocontactbusinesstext != '')
											{
												sTo += '<br /><span class="ns1blankspaceSub">Business to</span>';
												sTo += '<br />' + this.maptocontactbusinesstext;
											}

											if (this.maptocontactpersontext != '')
											{
												sTo += '<br /><span class="ns1blankspaceSub">Person to</span>';
												sTo += '<br />' + this.maptocontactpersontext;
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
										.css('height', '17px');
								
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
								var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1}).value;
								var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": 1}).value;
								var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1, "default": ''}).value;

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
													'<input type="radio" id="radioType1" name="radioType" value="1"/>Credit <span class="ns1blankspaceSubNote">(receipt)</span>' +
													'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Debit <span class="ns1blankspaceSubNote">(payment)</span>' +
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
													'Business' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceText">' +
													'<input id="ns1blankspaceContactBusinessMapTo" class="ns1blankspaceSelect"' +
														' data-method="CONTACT_BUSINESS_SEARCH"' +
														' data-columns="tradename">' +
													'</td></tr>');	
							
									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Person' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceText">' +
													'<input id="ns1blankspaceContactPersonMapTo" class="ns1blankspaceSelect"' +
														' data-method="CONTACT_PERSON_SEARCH"' +
														' data-columns="firstname-space-surname"' +
														' data-parent="ns1blankspaceContactBusinessMapTo"' +
														' data-parent-search-id="contactbusiness"' +
														' data-parent-search-text="tradename">' +
													'</td></tr>');

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
									
									aHTML.push('</table>');
									
									aHTML.push('<table class="ns1blankspaceColumn2">');
									
									aHTML.push('<tr><td style="padding-top:5px;" id="ns1blankspaceItemAddSearchResults"><span class="ns1blankspaceSub" style="font-size:0.75em;">Press <i>enter</i> to see all or<br />start typing part of the account title.</span></td></tr>');
																	
									aHTML.push('</table>');		
									
									$('#ns1blankspaceMappingEditColumn1').html(aHTML.join(''));

									$('[name="radioType"]').click(function ()
									{
										$('#ns1blankspaceItemAddSearchResults').html('');
									});
				
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
										if ($('#ns1blankspaceItemShowAll').prop('checked') == true)
										{
											return (a.postable == 'Y')
										}
										else
										{
											return (a.type == iFinancialAccountType && a.postable == 'Y')
										}
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

										if (_.toNumber($('#ns1blankspaceContactBusinessMapTo').attr('data-id')) != 0)
										{
											oData.maptocontactbusiness = $('#ns1blankspaceContactBusinessMapTo').attr('data-id')
										}

										if (_.toNumber($('#ns1blankspaceContactPersonMapTo').attr('data-id')) != 0)
										{
											oData.maptocontactperson = $('#ns1blankspaceContactPersonMapTo').attr('data-id')
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
														'maptocontactbusiness,maptocontactbusinesstext,maptocontactperson,maptocontactpersontext,' +
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

										if (oData.length < 21)
										{	
											oParam = ns1blankspace.util.setParam(oParam, 'step', 3);
											ns1blankspace.financial.bankAccount.mapping.edit(oParam, oData);
										}	
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
									$('#ns1blankspaceContactBusinessMapTo').val(oRow.maptocontactbusinesstext)
									$('#ns1blankspaceContactBusinessMapTo').attr('data-id', oRow.maptocontactbusiness);
									$('#ns1blankspaceContactPersonMapTo').val(oRow.maptocontactpersontext)
									$('#ns1blankspaceContactPersonMapTo').attr('data-id', oRow.maptocontactperson);
								}

								if (iStep == 3)
								{	
									if (oResponse == undefined)
									{	
										ns1blankspace.status.working();

										var iFinancialAccountType = (iType==1?2:1);
										var sSearch = $('#ns1blankspaceItemAccount').val()

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
					
										if (sSearch != '')
										{
											sSearch = sSearch.toLowerCase();
											oData = $.grep(oData, function (a)
											{
												return (a.title).toLowerCase().indexOf(sSearch) != -1
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
												$('#ns1blankspaceItemAccount').val($(this).html().formatXHTML())
												$('#ns1blankspaceItemAccount').attr('data-id',(this.id).split('-')[1]);
												$('#ns1blankspaceItemAddSearchResults').html('');
											});
										}
									}	
								}
							},

					apply:	
							{
								init: 	function (oParam, oResponse)
											{
												var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1}).value;
												var iFileSource = ns1blankspace.util.getParam(oParam, 'fileSource').value;
												var iStatus = ns1blankspace.util.getParam(oParam, 'status').value;

												if (iStep == 1)
												{
													oParam = ns1blankspace.util.setParam(oParam, 'index', 0);

													if (ns1blankspace.financial.bankAccount.reconcile.items.data.mappings === undefined)
													{
														ns1blankspace.status.working('Getting mappings...');

														var oSearch = new AdvancedSearch();
														oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_MAPPING_SEARCH';
														oSearch.addField('description,descriptionmatchtype,descriptionmatchtypetext,mapfrom,mapfromdescription,mapfromtext,' +
																		'maptocontactbusiness,maptocontactperson,' +
																		'maporder,maptodescription,maptofinancialaccount,maptofinancialaccounttext,' +
																		'matchtype,matchtypetext,project,projecttext,status,statustext,' +
																		'taxtype,taxtypeexpensetext,taxtyperevenuetext,type,typetext');

														oSearch.rows = 1000;
														
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
													oSearch.sort('posteddate', 'asc');
													oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
													if (iFileSource != undefined) {oSearch.addFilter('source', 'EQUAL_TO', iFileSource);}
													if (iStatus != undefined) {oSearch.addFilter('status', 'EQUAL_TO', iStatus);}

													if (ns1blankspace.financial.bankAccount.import.items.searchText != '')
													{
														oSearch.addBracket('(')

														oSearch.addFilter('description', 'TEXT_IS_LIKE', ns1blankspace.financial.bankAccount.import.items.searchText);
															
														var oSearchDate = moment(ns1blankspace.financial.bankAccount.import.items.searchText, ns1blankspace.option.dateFormats, true)
														if (oSearchDate.isValid())
														{
															oSearch.addOperator('or');
															oSearch.addFilter('posteddate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
														}

														if (_.isNumber(numeral(ns1blankspace.financial.bankAccount.import.items.searchText).value()))
														{
															oSearch.addOperator('or');
															oSearch.addFilter('amount', 'EQUAL_TO', numeral(ns1blankspace.financial.bankAccount.import.items.searchText).value());
														}
														oSearch.addBracket(')');
													}

													oSearch.rows = 1000;
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

								match: 	function (oItem, oMapping, bReset)
											{
												var bMatch = false;
								
												if ((oItem.status == 1 || oItem.status == 3) && (oItem.category == oMapping.mapfrom))
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

								process: function (oParam)
											{
												var iFileSourceID = ns1blankspace.util.getParam(oParam, 'fileSource').value;
												var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 0}).value;
												var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": 1}).value;
												var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1, "default": ''}).value;
												var iIndex = ns1blankspace.util.getParam(oParam, 'index', {"default": 0}).value;
												var bReset = ns1blankspace.util.getParam(oParam, 'reset', {"default": false}).value;

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
															return ns1blankspace.financial.bankAccount.mapping.apply.match(v, a, bReset);
														});  
														
														if (aMatch.length > 0)
														{
															oMatch = aMatch[0];
															v.mapping = oMatch;
														}
														else
														{
															v.mapping = undefined;
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

														if (_.toNumber(oItem.amount) == 0)
														{
															oData.status = 2
														}

														if (oItem.mapping != undefined)
														{	
															if (oItem.mapping.maptofinancialaccount != '') {oData.financialaccount = oItem.mapping.maptofinancialaccount}
															if (oItem.mapping.maptodescription != '') {oData.description = oItem.mapping.maptodescription}
															if (oItem.mapping.taxtype != '') {oData.taxtype = oItem.mapping.taxtype}
															if (oItem.mapping.maptocontactbusiness != '' && oItem.mapping.maptocontactbusiness != 0) {oData.contactbusiness = oItem.mapping.maptocontactbusiness}
															if (oItem.mapping.maptocontactperson != '' && oItem.mapping.maptocontactperson != 0) {oData.contactperson = oItem.mapping.maptocontactperson}	
														}
														else if (bReset)
														{
															oData.financialaccount = '';
															oData.contactbusiness = '';
															oData.contactperson = '';	
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
														ns1blankspace.financial.bankAccount["import"].items.show(oParam);
													}
												}
											}
							},

				create:	
							{
								data: 	{},

								init: 	function (oParam, oResponse)
											{
												var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1}).value;
												var iFileSource = ns1blankspace.util.getParam(oParam, 'fileSource').value;
												var iStatus = ns1blankspace.util.getParam(oParam, 'status').value; //3

												if (iStep == 1)
												{
													oParam = ns1blankspace.util.setParam(oParam, 'step', 2);
													ns1blankspace.financial.bankAccount.mapping.create.data.transactions = [];

													var oSearch = new AdvancedSearch();
													oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
													oSearch.addField('amount,area,areatext,bankaccount,bankaccounttext,capital,category,categorytext,' +
																		'contactbusiness,contactbusinesstext,contactperson,contactpersontext,description,' +
																		'object,objectcontext,' +
																		'externalid,financialaccount,financialaccounttext,posteddate,project,projecttext,' +
																		'source,sourcetext,status,statustext,tax,taxtype,taxtypeexpensetext,taxtyperevenuetext,type,typetext');
													oSearch.sort('posteddate', 'asc');
													oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
													if (iFileSource != undefined) {oSearch.addFilter('source', 'EQUAL_TO', iFileSource);}
													if (iStatus != undefined) {oSearch.addFilter('status', 'EQUAL_TO', iStatus);}

													if (ns1blankspace.financial.bankAccount.import.items.searchText != '')
													{
														oSearch.addBracket('(')

														oSearch.addFilter('description', 'TEXT_IS_LIKE', ns1blankspace.financial.bankAccount.import.items.searchText);
															
														var oSearchDate = moment(ns1blankspace.financial.bankAccount.import.items.searchText, ns1blankspace.option.dateFormats, true)
														if (oSearchDate.isValid())
														{
															oSearch.addOperator('or');
															oSearch.addFilter('posteddate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
														}

														if (_.isNumber(numeral(ns1blankspace.financial.bankAccount.import.items.searchText).value()))
														{
															oSearch.addOperator('or');
															oSearch.addFilter('amount', 'EQUAL_TO', numeral(ns1blankspace.financial.bankAccount.import.items.searchText).value());
														}
														oSearch.addBracket(')');
													}

													oSearch.rows = 1000;
													oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.mapping.create.init(oParam, data)});
												}

												if (iStep == 2)
												{
													ns1blankspace.financial.bankAccount.mapping.create.data.transactions =
																	ns1blankspace.financial.bankAccount.mapping.create.data.transactions.concat(oResponse.data.rows)

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
															success: function(data){ns1blankspace.financial.bankAccount.mapping.create.init(oParam, data)}
														});
													}	
													else
													{
														oParam = ns1blankspace.util.setParam(oParam, 'step', 1);
														ns1blankspace.financial.bankAccount.mapping.create.process(oParam);
													}	
												}	
											},

								process: function (oParam, oResponse)
											{
												var iFileSourceID = ns1blankspace.util.getParam(oParam, 'fileSource').value;
												var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 0}).value;
												var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": 1}).value;
												var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1, "default": ''}).value;
												var iIndex = ns1blankspace.util.getParam(oParam, 'index', {"default": 0}).value;

												if (iStep == 0)
												{
													ns1blankspace.financial.bankAccount.mapping.create.init(oParam);
												}	
												
												if (iStep == 1)
												{	
													if (iIndex < ns1blankspace.financial.bankAccount.mapping.create.data.transactions.length)
													{
														ns1blankspace.status.working('Creating... (' + iIndex + '/' + ns1blankspace.financial.bankAccount.mapping.create.data.transactions.length + ')');
														
														var oTransaction = ns1blankspace.financial.bankAccount.mapping.create.data.transactions[iIndex];
	
														if (oTransaction.contactbusiness != '' || oTransaction.contactperson != '')
														{
															oTransaction.object = (oTransaction.type==1?6:3);
															oTransaction.createAmount = Math.abs((oTransaction.amount).parseCurrency()).toFixed(2);

															$.extend(true, oParam,
															{
																bankTransactionID: oTransaction.id,
																date: oTransaction.posteddate,
																amount: oTransaction.createAmount,
																description: oTransaction.description,
																contactBusiness: oTransaction.contactbusiness,
																contactPerson: oTransaction.contactperson,
																account: oTransaction.financialaccount,
																object: oTransaction.object,
																bankAccount: ns1blankspace.objectContext,
																postSave: ns1blankspace.financial.bankAccount.mapping.create.process,
																showStatus: false,
																bankTransactionStatus: 2,
																step: 2
															})

															ns1blankspace.financial.save.send(oParam);
														}
														else
														{
															oParam = ns1blankspace.util.setParam(oParam, 'index', iIndex + 1);
															oParam = ns1blankspace.util.setParam(oParam, 'step', 1);
															ns1blankspace.financial.bankAccount.mapping.create.process(oParam)
														}	
													}
													else
													{
														ns1blankspace.status.message('Confirmation complete');
														ns1blankspace.financial.bankAccount["import"].items.show(oParam);
													}
												}

												if (iStep == 2)
												{
													var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
													var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext').value;
													var iBankTransactionsID = ns1blankspace.util.getParam(oParam, 'bankTransactionID').value;
												
													var oTransaction = ns1blankspace.financial.bankAccount.mapping.create.data.transactions[iIndex];

													var oData =
													{
														id: iBankTransactionsID,
														status: 2,
														object: iObject,
														objectcontext: iObjectContext
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
															oParam = ns1blankspace.util.setParam(oParam, 'step', 1);
															ns1blankspace.financial.bankAccount.mapping.create.process(oParam)
														}
													})
												}
											}
							}															
				},

	"import": 	
				{		
					init: 	function (oParam)
								{
									ns1blankspace.financial.bankAccount.import.items.match.data.unmatched = {};

									ns1blankspace.financial.bankAccount.reconcile.current.refresh(
									{
										onComplete: ns1blankspace.financial.bankAccount["import"].show
									});
								},

					show:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceBankAccountImportColumn1" style="width: 110px;padding-right:0px;font-size:0.875em;" class="ns1blankspaceColumn1"><table class="ns1blankspace">' +
														'<tr><td id="ns1blankspaceBankAccountImport-unconfirmed" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceBankAccountImportRowSelect" style="padding-left:6px; padding-top:0px; padding-bottom:10px;">' +
															'New unconfirmed transactions</td></tr>' +
														'<tr><td id="ns1blankspaceBankAccountImport-confirmed" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceBankAccountImportRowSelect" style="padding-left:6px; padding-top:10px; padding-bottom:10px;">' +
															'Confirmed transactions ready for matching</td></tr>' +
														'<tr><td id="ns1blankspaceBankAccountImport-all" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceBankAccountImportRowSelect" style="padding-left:6px; padding-top:10px; padding-bottom:10px;">' +
															'All transactions</td></tr>' +
														'<tr><td class="ns1blankspaceSub" style="padding-left:6px; padding-top:8px; font-size:0.875em;">Transactions by import</td></tr>' +
														'<tr><td id="ns1blankspaceBankAccountImportColumn1Sources" >' +
														ns1blankspace.xhtml.loading +
														'</td></tr></table>' + 
													'</td>' +
													'<td id="ns1blankspaceBankAccountImportColumn2" class="ns1blankspaceColumn2">' +
													'</td>' +
													'</tr>' +
													'</table>');				
										
										$('#ns1blankspaceMainImport').html(aHTML.join(''));

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_SEARCH';
										oSearch.addField('startdate,enddate,processeddate,reference');
										oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.sort('processeddate', 'desc');
										oSearch.rows = 15;
										oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount["import"].show(oParam, data)});
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="tableInterfaceFinancialHomeMostLikely">');
											
											aHTML.push('<tr><td class="ns1blankspaceNothing">None.</td></tr>');

											aHTML.push('</table>');
											
											$('#ns1blankspaceBankAccountImportColumn1Sources').html(aHTML.join(''));	
										}
										else
										{	
											aHTML.push('<table class="ns1blankspace" id="ns1blankspaceBankAccountImportSources">');
											
											$(oResponse.data.rows).each(function(i) 
											{
												aHTML.push(ns1blankspace.financial.bankAccount["import"].row(this));
											});
											
											aHTML.push('</table>');
											
											ns1blankspace.render.page.show(
											{
												type: 'JSON',
												xhtmlElementID: 'ns1blankspaceBankAccountImportColumn1Sources',
												xhtmlContext: 'FinancialBankAccountImportSources',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: 15,
												functionShowRow: ns1blankspace.financial.bankAccount["import"].row,
												functionOpen: undefined,
												functionOnNewPage: ns1blankspace.financial.bankAccount["import"].bind,
												headerRow: false
											});					
										}
											
										ns1blankspace.financial.bankAccount["import"].add();
									}
								},

					row:		function (oRow)
								{
									var aHTML = [];

									if (oRow.processeddate != ''  && (oRow.startdate != '' || oRow.enddate != ''))
									{
										aHTML.push('<tr class="ns1blankspaceRow">');

										aHTML.push('<td id="ns1blankspaceBankAccountImport_processeddate-' + oRow.id + '"' +
														' class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceBankAccountImportRowSelect"' +
														' style="padding-left:6px; text-align:left;">');
										
										if (oRow.enddate != '')
										{		
											aHTML.push(oRow.enddate + '<br />');	
										}

										if (oRow.startdate != oRow.enddate)
										{		
											aHTML.push(' to ' + oRow.startdate + '<br />');	
										}
									
										aHTML.push('</tr>');
									}
										
									return aHTML.join('');
								},

					bind:		function (oRow)
								{
									$('.ns1blankspaceBankAccountImportRowSelect:visible').click(function()
									{
										$('#ns1blankspaceBankAccountImportColumn1 td.ns1blankspaceRowShaded').removeClass('ns1blankspaceRowShaded');
										$('#' + this.id).addClass('ns1blankspaceRowShaded');

										var aID = (this.id).split('-');
										var iID = aID[1];

										if (iID == 'all')
										{
											ns1blankspace.financial.bankAccount["import"].items.show({all: true});
										}
										else if (iID == 'unconfirmed')
										{
											ns1blankspace.financial.bankAccount["import"].items.show({status: 1});
										}
										else if (iID == 'confirmed')
										{
											ns1blankspace.financial.bankAccount["import"].items.match.initData();
										}
										else
										{
											ns1blankspace.financial.bankAccount["import"].items.show({fileSource: iID});
										}	
									});
								},			

					add:		function (oParam, oResponse)
								{
									ns1blankspace.financial.bankAccount["import"].items.latest(
									{
										onComplete: ns1blankspace.financial.bankAccount["import"].edit
									});
								},

					edit:		function (oParam, oResponse)
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
										
										aHTML.push('<table class="ns1blankspaceColumn2" style="width:98%;">')

										if (ns1blankspace.financial.bankAccount.data.latestBankTransaction != undefined)
										{
											var oTran = ns1blankspace.financial.bankAccount.data.latestBankTransaction;
											aHTML.push('<tr><td class="ns1blankspaceSubNote ns1blankspaceRowShaded" style="width:80%; padding:6px;">' +
																'The last transaction imported <span style="font-size:0.875em; font-style:italic;">"' + oTran.description + '"</span><br/ >was for $' + 
																parseFloat(Math.abs((oTran.amount).parseCurrency())).formatMoney() + ' on the ' + oTran.posteddate);

											if (ns1blankspace.objectContextData.bank != '')
											{
												aHTML.push(' from <span class="_ns1blankspaceBankAccountImportBank">' + ns1blankspace.objectContextData.bank + '</span>')
											}

											aHTML.push('.</td></tr>');		
										}

										aHTML.push('<tr><td style="padding-top:12px;">');

										var sBank = '<span class="ns1blankspaceBankAccountImportBank">' + ns1blankspace.objectContextData.bank + '</span>\'s website';
										if (sBank == '') {sBank = ' your banks website'}

										aHTML.push(ns1blankspace.attachments.upload.show(
										{	
											object: 28,
											objectContext: -1,
											label: 'If you have not enabled the Yodlee bank transaction importing service, then you can import transactions by selecting a QIF file that you have exported using ' + sBank  + '.',
											showUpload: false
										}));

										aHTML.push('<div style="margin-top:10px;" margin-left:3px;" class="ns1blankspaceSub" id="ns1blankspaceBankTransactionStatus"></div>')
										
										aHTML.push('</td></tr></table>');

										ns1blankspace.financial.bankAccount.bank(
										{
											xhtmlElement: '.ns1blankspaceBankAccountImportBank'
										});
										
										$('#ns1blankspaceBankAccountImportColumn2').html(aHTML.join(''));
										
										$('input.ns1blankspaceUpload').change(function()
										{
											if ($(this).val() != '')
											{
												$('#ns1blankspaceUpload').button(
												{
													label: 'Upload'
												})
												.css('font-size', '0.75em')
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
																ns1blankspace.financial.bankAccount["import"].edit(oParam, data);
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

											ns1blankspace.attachments.upload.submit(
											{
												submit: true,
												functionPostUpdate: ns1blankspace.financial.bankAccount["import"].process
											});
										}	
									}	
								},

					delete:	function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var sID = ns1blankspace.util.getParam(oParam, 'id').value;

										var oData = {remove: 1, id: sID};

										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_MANAGE'),
											data: oData,
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.financial.bankAccount["import"].delete(oParam, data);
											}
										});
									}
									else
									{
										ns1blankspace.status.message('Deleted')
										ns1blankspace.financial.bankAccount["import"].show();
									}
								},	

					process:	function (oParam, oResponse)
								{
									if (oResponse != undefined)
									{					
										var iID = oResponse.data.rows[0].attachmentlink;
										var sData = 'id=' + iID;
								
										ns1blankspace.status.working();

										$('#ns1blankspaceBankTransactionStatus').html('Processing file transactions...');

										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_PROCESS'),
											data: sData,
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.status.message('Transactions processed.')
												ns1blankspace.financial.bankAccount["import"].show();
											}
										});
									}	
								},

					move: 	{
									init:		function (oParam)
												{
													var iFileSource = ns1blankspace.util.getParam(oParam, 'fileSource').value;
													var iToBankAccount = ns1blankspace.util.getParam(oParam, 'toBankAccount').value;

													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_MANAGE'),
														data: {id: iFileSource, bankaccount: iToBankAccount},
														dataType: 'json',
														success: function(data)
														{
															if (data.status = 'OK')
															{
																var oSearch = new AdvancedSearch();
																oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
																oSearch.addField('status');
																if (iFileSource) {oSearch.addFilter('source', 'EQUAL_TO', iFileSource);}
																oSearch.rows = 1000;
																oSearch.getResults(function(oResponse)
																{
																	oParam.itemIDs = $.map(oResponse.data.rows, function (v) {return v.id});
																	oParam.itemIndex = 0;
																	ns1blankspace.financial.bankAccount["import"].move.items(oParam)
																});
															}	
														}
													});

												},

									items:	function (oParam)
												{
													var iFileSource = ns1blankspace.util.getParam(oParam, 'fileSource').value;
													var aItemIDs = ns1blankspace.util.getParam(oParam, 'itemIDs').value;
													var iItemIndex = ns1blankspace.util.getParam(oParam, 'itemIndex').value;
													var iToBankAccount = ns1blankspace.util.getParam(oParam, 'toBankAccount').value;

													if (iItemIndex < (aItemIDs.length))
													{
														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE'),
															data: {id: aItemIDs[iItemIndex], bankaccount: iToBankAccount},
															dataType: 'json',
															success: function(data)
															{
																if (data.status == 'OK')
																{
																	ns1blankspace.status.message('Moving (' + (iItemIndex + 1) + '/' + aItemIDs.length + ')');
																	oParam.itemIndex = oParam.itemIndex + 1;
																	ns1blankspace.financial.bankAccount["import"].move.items(oParam);
																}
															}
														});
													}
													else
													{
														ns1blankspace.status.message('Move completed');
														ns1blankspace.financial.bankAccount.init();
													}
												}				
								},					

					items:   {
									data: 		{},

									searchText: undefined,

									searchMissingOnly: false,

									latest: 	function (oParam, oResponse)
												{
													if (oResponse == undefined)
													{
														var oSearch = new AdvancedSearch();
														oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
														oSearch.addField('amount,posteddate,description');
														oSearch.sort('posteddate', 'desc');
														oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
														oSearch.rows = 1;
														oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount["import"].items.latest(oParam, data)});
													}
													else
													{
														if (ns1blankspace.financial.bankAccount.data == undefined) {ns1blankspace.financial.bankAccount.data = {}}
														if (oResponse.data.rows.length > 0)
														{
															ns1blankspace.financial.bankAccount.data.latestBankTransaction = oResponse.data.rows[0];
														}
														ns1blankspace.util.onComplete(oParam)
													}
												},	

									show:		function(oParam, oResponse)
												{
													var iFileSource;
													var iStatus = ns1blankspace.util.getParam(oParam, 'status').value;
													var bAll = ns1blankspace.util.getParam(oParam, 'all', {"default": false}).value;

													ns1blankspace.financial.bankAccount.import.items.searchMissingOnly = ns1blankspace.util.getParam(oParam, 'searchMissingOnly', {"default": false}).value;
								
													if (oParam != undefined)
													{
														if (oParam.fileSource != undefined) {iFileSource = oParam.fileSource}
													}		

													if (oResponse === undefined)
													{	
														var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');

														if (oSearchText.exists)
														{
															ns1blankspace.financial.bankAccount.import.items.searchText = oSearchText.value;
														}

														ns1blankspace.financial.bankAccount["import"].items.data = {};

														var aHTML = [];

														aHTML.push('<table class="ns1blankspaceContainer">' +
																		'<tr class="ns1blankspaceContainer">' +
																		'<td id="ns1blankspaceImportItemsColumn1">' + ns1blankspace.xhtml.loading + '</td>')

														aHTML.push('<td id="ns1blankspaceImportItemsColumn2" style="width:100px;"></td>');

														aHTML.push('</tr>' +
																		'</table>');				
														
														$('#ns1blankspaceBankAccountImportColumn2').html(aHTML.join(''));

														var oSearch = new AdvancedSearch();
														oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
														oSearch.addField('amount,area,areatext,bankaccount,bankaccounttext,capital,category,categorytext,' +
																			'contactbusiness,contactbusinesstext,contactperson,contactpersontext,description,' +
																			'externalid,financialaccount,financialaccounttext,posteddate,project,projecttext,' +
																			'source,sourcetext,status,statustext,tax,taxtype,taxtypeexpensetext,taxtyperevenuetext,type,typetext');
														oSearch.sort('posteddate', 'desc');
														oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
														if (iFileSource != undefined) {oSearch.addFilter('source', 'EQUAL_TO', iFileSource);}
														if (iStatus != undefined) {oSearch.addFilter('status', 'EQUAL_TO', iStatus);}

														if (ns1blankspace.financial.bankAccount.import.items.searchText != '')
														{
															oSearch.addBracket('(')

															oSearch.addFilter('description', 'TEXT_IS_LIKE', ns1blankspace.financial.bankAccount.import.items.searchText);
																
															var oSearchDate = moment(ns1blankspace.financial.bankAccount.import.items.searchText, ns1blankspace.option.dateFormats, true)
															if (oSearchDate.isValid())
															{
																oSearch.addOperator('or');
																oSearch.addFilter('posteddate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
															}

															if (_.isNumber(numeral(ns1blankspace.financial.bankAccount.import.items.searchText).value()))
															{
																oSearch.addOperator('or');
																oSearch.addFilter('amount', 'EQUAL_TO', numeral(ns1blankspace.financial.bankAccount.import.items.searchText).value());
															}
															oSearch.addBracket(')');
														}

														if (ns1blankspace.financial.bankAccount.import.items.searchMissingOnly)
														{
															oSearch.addBracket('(')
															oSearch.addFilter('contactbusiness', 'IS_NULL');
															oSearch.addOperator('and');
															oSearch.addFilter('contactperson', 'IS_NULL');
															oSearch.addBracket(')')
															oSearch.addOperator('or');
															oSearch.addFilter('financialaccount', 'IS_NULL');
														} 

														if (bAll)
														{
															oSearch.rows = 50;
														}
														else
														{
															oSearch.rows = 1000;
														}

														oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount["import"].items.show(oParam, data)});
													}
													else
													{
														var aHTML = [];
					
														aHTML.push('<table class="ns1blankspaceColumn2" style="font-size:0.875em;">' +
															'<tr><td id="ns1blankspaceFinancialBankImportItems"></td></tr></table>');
													
														$('#ns1blankspaceImportItemsColumn1').html(aHTML.join(''));

														var aHTML = [];

														aHTML.push('<table>')

														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<tr><td class="ns1blankspaceNothing">No transactions.</td></tr>');
															aHTML.push('</table>');
														}
														else
														{		
															var bNeedConfirm = false;
															
															$(oResponse.data.rows).each(function()
															{
																if (this.status == 1) {bNeedConfirm = true}
																aHTML.push(ns1blankspace.financial.bankAccount["import"].items.row(this));
															});	
														}
															
														aHTML.push('</table>');

														if (bAll)
														{
															ns1blankspace.render.page.show(
															{
																type: 'JSON',
																xhtmlElementID: 'ns1blankspaceFinancialBankImportItems',
																xhtmlContext: 'FinancialBankAccountImportItems',
																xhtml: aHTML.join(''),
																showMore: (oResponse.morerows == "true"),
																more: oResponse.moreid,
																rows: 50,
																functionShowRow: ns1blankspace.financial.bankAccount["import"].items.row,
																functionOpen: undefined,
																functionOnNewPage: ns1blankspace.financial.bankAccount["import"].items.bind
															});
														}
														else
														{		
															$('#ns1blankspaceFinancialBankImportItems').html(aHTML.join(''));
															ns1blankspace.financial.bankAccount["import"].items.bind();
														}

														ns1blankspace.financial.bankAccount.import.items.match.data.transactions = oResponse.data.rows;
														
														var aHTML = [];
														
														aHTML.push('<table class="ns1blankspaceColumn2" style="margin-right:0px;">');
																
														if (!bAll)
														{		
															if (oResponse.data.rows.length == 0)
															{
																if (iFileSource != undefined)
																{
																	aHTML.push('<tr><td style="padding-bottom:12px;"><span id="ns1blankspaceBankAccountImportDelete" data-id="' + iFileSource + '" class="ns1blankspaceAction">' +
																				'Delete</span></td></tr>');
																}	
															}		
															else if (bNeedConfirm)
															{			
																aHTML.push('<tr><td><span id="ns1blankspaceBankAccountImportMappingsApply" class="ns1blankspaceAction">' +
																			'Confirm & apply mappings</span></td></tr>');

																aHTML.push('<tr><td id="ns1blankspaceBankAccountImportMappingsApplyStatus" style="padding-top:5px; padding-bottom:16px; font-size:0.75em;" class="ns1blankspaceSub">' +
																			'Confirm uploaded bank transactions and apply any configured mappings.</td></tr>');
															}	
															else
															{	
																//ns1blankspace.financial.bankAccount.import.items.match.data.transactions = oResponse.data.rows;

																aHTML.push('<tr><td><span id="ns1blankspaceBankAccountImportMappingsReApply" class="ns1blankspaceAction">' +
																			'Apply mappings</span></td></tr>');

																aHTML.push('<tr><td style="padding-top:8px;">' +		
																				'<input type="checkbox" id="ns1blankspaceBankAccountImportMappingsReApply_reset" style="margin:0px; padding:0px; border: 0px; margin-top:1px;">' +
																				'<span style="font-weight:100; font-size:0.625em; margin-left:2px;" class="ns1blankspaceSub">Reset transactions</span>' +
																				'</td></tr>');

																aHTML.push('<tr><td style="padding-top:20px; font-size:0.75em;" class="ns1blankspaceSub">' +
																					'If you don\'t plan to reconcile against a bank statement then you can create payments and receipts for any transactions with contact and financial account information, else click Reconcile in the side menu.</td></tr>');

																aHTML.push('<tr><td style="padding-top:8px; padding-bottom:16px;"><span id="ns1blankspaceBankAccountImportCreateItems" class="ns1blankspaceAction">' +
																			'Create payments & receipts</span></td></tr>');

																//if (ns1blankspace.financial.data.settings.accountingmethod == 1)
																//{	
																	//aHTML.push('<tr><td style="padding-top:8px; padding-bottom:12px; font-size:0.75em;" class="ns1blankspaceSub">' +
																	//		'Use the "+" button to create payments and receipts within this space.<br /><br />If you have already created invoices, expenses, payments or receipts, then click Reconcile.</td></tr>');
																//}
																//else
																//{
																	//aHTML.push('<tr><td style="padding-top:8px; padding-bottom:16px; font-size:0.75em;" class="ns1blankspaceSub">' +
																	//		'Or you can reconcile these bank transactions against by clicking Reconcile.</td></tr>');
																//}
															}
														}

														aHTML.push('<tr><td style="padding-top:8px;">' +
																		'<input id="ns1blankspaceImportItemsSearchText" class="ns1blankspaceText" data-1blankspace="ignore" style="width:98px;">' +
																		'</td></tr>');

														aHTML.push('<tr><td style="padding-top:0px;">' +
																		'<span style="width:98px;" id="ns1blankspaceImportItemsSearch" class="ns1blankspaceAction">Search</span>' +
																		'</td></tr>');

														aHTML.push('<tr><td style="padding-top:14px;">' +
																		'<span style="width:98px;" id="ns1blankspaceImportItemsSearchMissingOnly" class="ns1blankspaceAction">If Missing</span>' +
																		'</td></tr>');
															
														aHTML.push('</table>');					
														
														$('#ns1blankspaceImportItemsColumn2').html(aHTML.join(''));

														$('#ns1blankspaceImportItemsSearchMissingOnly').button(
														{
															label: (ns1blankspace.financial.bankAccount.import.items.searchMissingOnly?'Show all':'Only show transactions missing information')
														})
														.click(function() 
														{
															oParam = ns1blankspace.util.setParam(oParam, 'searchMissingOnly', !ns1blankspace.financial.bankAccount.import.items.searchMissingOnly);
															ns1blankspace.financial.bankAccount.import.items.show(oParam);
														})
														.css('width', '98px');

														$('#ns1blankspaceImportItemsSearch').button(
														{
															label: 'Search'
														})
														.click(function() 
														{
															oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceImportItemsSearchText').val());
															ns1blankspace.financial.bankAccount.import.items.show(oParam);
														})
														.css('width', '98px');

														$('#ns1blankspaceImportItemsSearchText').keyup(function(e)
														{
															if (e.which === 13)
													    	{
													    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceImportItemsSearchText').val())
													    		ns1blankspace.financial.bankAccount.import.items.show(oParam);
													    	}
													    });	

														$('#ns1blankspaceImportItemsSearchText').val(ns1blankspace.financial.bankAccount.import.items.searchText)

														$('#ns1blankspaceBankAccountImportNew').button(
														{
															label: "New Import"
														})
														.click(function() {
															ns1blankspace.financial.bankAccount["import"].add();
														})
														.css('width', '100px');
														
														$('#ns1blankspaceBankAccountImportMappingsApply').button(
														{
															label: 'Confirm & apply mappings',
														})
														.click(function()
														{	
															ns1blankspace.financial.bankAccount.mapping.apply.init(oParam)
														})
														.css('width', '100px');

														$('#ns1blankspaceBankAccountImportMappingsReApply').button(
														{
															label: 'Apply mappings',
														})
														.click(function()
														{	
															oParam.reset = ($('#ns1blankspaceBankAccountImportMappingsReApply_reset').prop('checked') == true)
															ns1blankspace.financial.bankAccount.mapping.apply.init(oParam)
														})
														.css('width', '100px');

														$('#ns1blankspaceBankAccountImportCreateItems').button(
														{
															label: 'Create payments & receipts',
														})
														.click(function()
														{	
															ns1blankspace.financial.bankAccount.mapping.create.init(oParam)
														}).
														css('width', '100px');

														$('#ns1blankspaceBankAccountImportDelete').button(
														{
															label: 'Delete',
														})
														.click(function()
														{	

															ns1blankspace.financial.bankAccount["import"].delete({id: $(this).attr('data-id')})
														})
														.css('width', '100px');
													}
												},

									row:		function (oRow)
												{
													var aHTML = [];

													if (oRow.processeddate != '')
													{
														aHTML.push('<tr id="ns1blankspaceFinancialImportItem_container-' + oRow.id + '" data-externalid="' + oRow.externalid + '">');
														aHTML.push('<td style="font-size:0.875em; padding:6px;">');

															aHTML.push('<table>' +
																			'<tr><td id="ns1blankspaceFinancialImportItem_Description-' + oRow.id + '" style="font-weight:600;">' +
																				oRow.description + '</td></tr>');

															aHTML.push('<tr><td id="ns1blankspaceFinancialImportItem_Date-' + oRow.id + '">' +
																				oRow.posteddate + '</td></tr>');

															aHTML.push('<tr><td id="ns1blankspaceFinancialImportItem_Amount-' + oRow.id + '">' +
																				parseFloat(Math.abs((oRow.amount).parseCurrency())).formatMoney() +
																				'</td></tr>');

															aHTML.push('<tr><td id="ns1blankspaceFinancialImportItem_Type-' + oRow.id + '">' +
																				'<div>' + oRow.categorytext + '</div><div class="ns1blankspaceSubNote">' + (oRow.categorytext=='Credit'?'(Incoming)':'(Outgoing)') + '</div></td></tr>');						 					
																		
															aHTML.push('<tr><td class="ns1blankspaceViewLink ns1blankspaceFinancialImportItemStatus" id="ns1blankspaceFinancialImportItem_status-' + oRow.id + '">');

															var sStatusText = oRow.statustext;
															if (oRow.status==1) {sStatusText = 'Unconfirmed'};
															if (oRow.status==3) {sStatusText = 'Confirmed (Unmatched)'};
															if (oRow.status==2) {sStatusText = 'Matched & Reconciled'};
															if (oRow.status==4) {sStatusText = 'Matched'};
															if (oRow.status==7) {sStatusText = 'Part transferred to financials'};

															aHTML.push(sStatusText);
															
															aHTML.push('</td></tr>')

															aHTML.push('</table>');

													
														aHTML.push('</td><td style="width:240px; font-size:0.875em; padding:6px;">');

														var sValue;
	
														aHTML.push('<table>');

															var sColor = '#999999';

															if (oRow.contactbusinesstext == '' && oRow.contactpersontext == '')
															{
																sColor = '#c31d1d'
															}

															sValue = (oRow.contactbusinesstext!=''?oRow.contactbusinesstext:'<i style="color:' + sColor + ';">Not set</i>')
															aHTML.push('<tr><td id="ns1blankspaceFinancialImportItem-contactBusiness-' + oRow.id + '" class="ns1blankspaceFinancialImportItemEdit" style="cursor:pointer;">' +
																		'<span class="ns1blankspaceSub">Contact Business</span>' +
																		'<br /><span id="ns1blankspaceFinancialImportItem-contactBusiness-' + oRow.id + '_value">' + sValue + '</span></td></tr>');

															aHTML.push('<tr><td id="ns1blankspaceFinancialImportItem_edit_container-contactBusiness-' + oRow.id + '" style="display:none; font-size:1em;">' +
																		'<input id="ns1blankspaceFinancialImportItem_edit-contactBusiness-' + oRow.id + '" class="ns1blankspaceText">' +
																		'<div id="ns1blankspaceFinancialImportItem_edit-contactBusiness-' + oRow.id + '_search"><div class="ns1blankspaceSubNote">Start typing or press Enter to see all.</div></div>' +
																		'</td></tr>');

															sValue = (oRow.contactpersontext!=''?oRow.contactpersontext:'<i style="color:' + sColor + ';">Not set</i>')
															aHTML.push('<tr><td id="ns1blankspaceFinancialImportItem-contactPerson-' + oRow.id + '" class="ns1blankspaceFinancialImportItemEdit" style="cursor:pointer;">' +
																		'<span class="ns1blankspaceSub">Contact Person</span>' +
																		'<br /><span id="ns1blankspaceFinancialImportItem-contactPerson-' + oRow.id + '_value">' + sValue + '</span></td></tr>');

															aHTML.push('<tr><td id="ns1blankspaceFinancialImportItem_edit_container-contactPerson-' + oRow.id + '" style="display:none; font-size:1em;">' +
																		'<input id="ns1blankspaceFinancialImportItem_edit-contactPerson-' + oRow.id + '" class="ns1blankspaceText">' +
																		'<div id="ns1blankspaceFinancialImportItem_edit-contactPerson-' + oRow.id + '_search"><div class="ns1blankspaceSubNote">Start typing or press Enter to see all.</div></div>' +
																		'</td></tr>');

															sValue = (oRow.financialaccounttext!=''?oRow.financialaccounttext:'<i style="color:#c31d1d;">Not set</i>')
															aHTML.push('<tr><td id="ns1blankspaceFinancialImportItem-financialAccount-' + oRow.id + '" class="ns1blankspaceFinancialImportItemEdit" style="cursor:pointer;">' +
																			'<div style="float:left;" class="ns1blankspaceSub">Account&nbsp;</div>' +
																			'<div style="clear:both;" id="ns1blankspaceFinancialImportItem-financialAccount-' + oRow.id + '_value">' + sValue + '</div></td></tr>');

															aHTML.push('<tr><td id="ns1blankspaceFinancialImportItem_edit_container-financialAccount-' + oRow.id + '" style="display:none; font-size:1em;">' +
																			'<div><div style="float:left; width:80%;">' +
																				'<input id="ns1blankspaceFinancialImportItem_edit-financialAccount-' + oRow.id + '" class="ns1blankspaceText ns1blankspaceWatermark" value="search">' + 
																				'</div>' +
																			'<div style="float:left; margin-left:10px; margin-top:2px;" id="ns1blankspaceItemShowAll-' + oRow.id + '_container">' +		
																				'<input type="checkbox" id="ns1blankspaceItemShowAll-' + oRow.id + '" style="margin:0px; padding:0px; border: 0px; margin-top:0px;">' +
																				'<span style="font-weight:normal; font-size:0.625em; margin-left:2px;">All</span>' +
																			'</div></div>'	+
																		
																		'<div id="ns1blankspaceFinancialImportItem_edit-financialAccount-' + oRow.id + '_search" style="clear:both;"><div class="ns1blankspaceSubNote">Start typing or press Enter to see all.</div></div>' +
																		'</td></tr>');

															sValue = (oRow.taxtype!=''?(oRow.category==1?oRow.taxtyperevenuetext:oRow.taxtypeexpensetext):'<i style="color:#c31d1d;">Not set</i>')
															aHTML.push('<tr><td id="ns1blankspaceFinancialImportItem-tax-' + oRow.id + '" class="ns1blankspaceFinancialImportItemEdit" style="cursor:pointer;">' +
																		'<span class="ns1blankspaceSub">' + ns1blankspace.option.taxVATCaption + '</span>' +
																		'<br /><span id="ns1blankspaceFinancialImportItem-tax-' + oRow.id + '_value">' + sValue + '</span></td></tr>');

															aHTML.push('<tr><td id="ns1blankspaceFinancialImportItem_edit_container-tax-' + oRow.id + '" style="display:none; font-size:1em;">' +
																		'<div id="ns1blankspaceFinancialImportItem_edit-tax-' + oRow.id + '_search"></div>' +
																		'</td></tr>');

															aHTML.push('</table>');

															aHTML.push('</td><td style="padding:6px;">');

															if (oRow.status == 3 || oRow.status == 7)
															{	
																aHTML.push('<span id="ns1blankspaceFinancialImportItem_options_match-' + oRow.id + '" class="ns1blankspaceRowMatch"' +
																			' data-amount="' + Math.abs(numeral(oRow.amount).value()) + '"' +
																			' data-type="' + (numeral(oRow.amount).value()<0?1:2) + '"' +
																			' data-taxtype="' + oRow.taxtype + '"' +
																			' data-financialaccount="' + oRow.financialaccount + '"' +
																			' data-financialaccounttext="' + oRow.financialaccounttext + '"' +
																			' data-description="' + oRow.description + '"' +
																			' data-date="' + oRow.posteddate + '"' +
																			' data-status="' + oRow.status + '"' +
																			' data-contactbusiness="' + oRow.contactbusiness + '"' +
																			' data-contactbusinesstext="' + oRow.contactbusinesstext + '"' +
																			' data-contactperson="' + oRow.contactperson + '"' +
																			' data-contactpersontext="' + oRow.contactpersontext + '"' +
																			' data-id="' + oRow.id + '"' +
																			'></span>');
															}
															else if (oRow.status == 1)
															{
																aHTML.push('<span id="ns1blankspaceFinancialImportItem_options_remove-' + oRow.id + '" class="ns1blankspaceRemove"></span>');
															}
															else if (oRow.status == 2)
															{
																aHTML.push('<span id="ns1blankspaceFinancialImportItem_options_remove-' + oRow.id + '" class="ns1blankspaceMatchedTo"></span>');
															}
							
															aHTML.push('</td></tr>');

															aHTML.push('<tr id="ns1blankspaceFinancialImportItem_options_edit_container-' + oRow.id + '"><td colspan=3 class="ns1blankspaceRow" id="ns1blankspaceFinancialImportItem_container_match_search-' + oRow.id + '" style="padding:8px;"></div>' +
																				'</td></tr>');
													}
														
													return aHTML.join('');
												},

									bind: 	function ()
												{
													if (ns1blankspace.financial.data.settings.taxreportcalculationmethod == 1)
													{
														$('#ns1blankspaceFinancialBankImportItems .ns1blankspaceRowEdit:not(.ui-button)').button(
														{
															text: false,
														 	icons: {primary: "ui-icon-plus"}
														})
														.click(function()
														{
															ns1blankspace.financial.bankAccount["import"].items.edit({xhtmlElementID: this.id})
														})
														.css('width', '15px')
														.css('height', '20px');
													}

													if (ns1blankspace.financial.data.settings.taxreportcalculationmethod == 1)
													{
														$('#ns1blankspaceFinancialBankImportItems .ns1blankspaceRowMatch:not(.ui-button)').button(
														{
															text: false,
														 	icons: {primary: "ui-icon-arrowthickstop-1-s"}
														})
														.click(function()
														{
															ns1blankspace.financial.bankAccount.import.items.match.search.init({xhtmlElementID: this.id})
														})
														.css('width', '15px')
														.css('height', '20px');
													}

													$('#ns1blankspaceFinancialBankImportItems .ns1blankspaceRemove:not(.ui-button)').button(
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
															method: 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE',
															ifNoneMessage: 'No transactions.'
														});

														//ns1blankspace.financial.bankAccount["import"].items.remove(oParam);
													})
													.css('width', '15px')
													.css('height', '17px');

													$('td.ns1blankspaceFinancialImportItemStatus')
													.click(function()
													{
														ns1blankspace.financial.bankAccount["import"].items.status({xhtmlElementID: this.id});
													})

													$('#ns1blankspaceFinancialBankImportItems .ns1blankspaceMatchedTo:not(.ui-button)').button(
													{
														text: false,
														icons:
														{
															primary: "ui-icon-extlink"
														}
													})
													.click(function()
													{
														ns1blankspace.financial.bankAccount.import.items.matchedTo({xhtmlElementID: this.id})
													})
													.css('width', '15px')
													.css('height', '17px');

													$('td.ns1blankspaceFinancialImportItemEdit')
													.click(function()
													{
														var oParam = {xhtmlElementID: this.id};
														var aID = this.id.split('-');

														if ($('#ns1blankspaceFinancialImportItem_edit_container-' + aID[1] + '-' + aID[2]).is(':visible'))
														{
															$('#ns1blankspaceFinancialImportItem_edit_container-' + aID[1] + '-' + aID[2]).hide();
														}
														else
														{
															$('#ns1blankspaceFinancialImportItem_edit_container-' + aID[1] + '-' + aID[2]).show();

															if (aID[1] == 'tax')
															{
																ns1blankspace.financial.bankAccount.import.items.tax(oParam)
															}
															else
															{
																$('#ns1blankspaceFinancialImportItem_edit-' + aID[1] + '-' + aID[2])
																.focus();

																$('#ns1blankspaceFinancialImportItem_edit-' + aID[1] + '-' + aID[2])
																.keyup(function()
																{			
																	var oParam = {xhtmlElementID: this.id}
																	if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
																	ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.bankAccount.import.items.' + aID[1] + '(' + JSON.stringify(oParam) + ')', ns1blankspace.option.typingWait);
																});
															}
														}	
													});
												},

									matchedTo: function (oParam, oResponse)
												{
													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
													var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
													var iStep = ns1blankspace.util.getParam(oParam, 'matchedToStep', {"default": 1}).value;
													
													var oTransaction = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.transactions, function (transaction)
													{
														return transaction.id == sID
													});

													if (ns1blankspace.financial.bankAccount.import.items.data.objects == undefined)
													{
														ns1blankspace.financial.bankAccount.import.items.data.objects = {}
													}

													if (iStep == 1)
													{
														if ($(ns1blankspace.xhtml.container).attr('data-initiator') == sXHTMLElementID)
														{
															$(ns1blankspace.xhtml.container).slideUp(500);
															$(ns1blankspace.xhtml.container).attr('data-initiator', '');
														}
														else
														{
															ns1blankspace.container.position(
															{
																xhtmlElementID: sXHTMLElementID,
																topOffset: 0,
																leftOffset: -173
															});

															var oSearch = new AdvancedSearch();
															oSearch.method = (oTransaction.type==2?'FINANCIAL_PAYMENT_SEARCH':'FINANCIAL_RECEIPT_SEARCH');
															oSearch.addField('id,reference,amount');	
															oSearch.addFilter('sourcebanktransaction', 'EQUAL_TO', sID);
															oSearch.rows = 1000;
															oSearch.getResults(function(data)
															{
																oParam = ns1blankspace.util.setParam(oParam, 'matchedToStep', 2);
																ns1blankspace.financial.bankAccount.import.items.matchedTo(oParam, data)
															});
														}	
													}
													else if (iStep == 2)
													{
														ns1blankspace.financial.bankAccount.import.items.data.objects[sID] = oResponse.data.rows;

														$.each(ns1blankspace.financial.bankAccount.import.items.data.objects[sID], function (r, row)
														{
															row.object = (oTransaction.type==2?'payment':'receipt')
														});

														var oSearch = new AdvancedSearch();
														oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_ITEM_SEARCH';
														oSearch.addField('debitamount,creditamount,generaljournalitem.generaljournal.reference,generaljournalitem.generaljournal.id');
														oSearch.addFilter('sourcebanktransaction', 'EQUAL_TO', sID);
														oSearch.rows = 1000;
														oSearch.getResults(function(data)
														{
															oParam = ns1blankspace.util.setParam(oParam, 'matchedToStep', 3);
															ns1blankspace.financial.bankAccount.import.items.matchedTo(oParam, data)
														});
													}
													else if (iStep == 3)
													{
														$.each(oResponse.data.rows, function (r, row)
														{
															ns1blankspace.financial.bankAccount.import.items.data.objects[sID].push(
															{
																amount: row[(oTransaction.type==1?'credit':'debit') + 'amount'],
																reference: row['generaljournalitem.generaljournal.reference'],
																id: row['generaljournalitem.generaljournal.id'],
																object: 'journal'
															})
														});

														var oObjects = ns1blankspace.financial.bankAccount.import.items.data.objects[sID];

														if (oObjects.length == 1)
														{
															ns1blankspace.financial[oObjects[0].object].init({id: oObjects[0].id});
														}
														else
														{
															var aHTML = ['<div class="ns1blankspaceViewControlContainer" id="ns1blankspaceViewTemplateContainer" style="font-size:0.875em;">'];

															if (ns1blankspace.financial.bankAccount.import.items.data.objects[sID].length == 0)
															{
																aHTML.push('<div class="ns1blankspaceSubNote">Not matched</div>');
															}
															else
															{
																$.each(ns1blankspace.financial.bankAccount.import.items.data.objects[sID], function (o, object)
																{
																	aHTML.push('<div class="ns1blankspaceViewLink" data-object="' + object.object + '" data-id="' + object.id + '">' + object.reference + '</div>');
																});
															}

															aHTML.push('</div>');

															$(ns1blankspace.xhtml.container).html(aHTML.join(''));

															$('[data-initiator="' + sXHTMLElementID + '"] .ns1blankspaceViewLink').click(function (event)
															{
																var sObject = $(this).attr('data-object');
																var sID = $(this).attr('data-id');

																ns1blankspace.financial[sObject].init({id: sID});
															});
														}	
													}
												},		

									financialAccount: function (oParam)
												{
													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
													var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 2}).value;
													var sSearch = $('#' + sXHTMLElementID).val();
													var aHTML = [];

													var oTransaction = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.transactions, function (transaction)
													{
														return transaction.id == sID
													});

													if (_.isObject(oTransaction))
													{
														var iFinancialAccountType = (oTransaction.type==1?2:1);

														if (sSearch == '')
														{
															var oData = $.grep(ns1blankspace.financial.data.accounts, function (oAccount)
															{ 
																if ($('#ns1blankspaceItemShowAll-' + sID).prop('checked') == true)
																{
																	return (oAccount.postable == 'Y')
																}
																else
																{
																	return (oAccount.type == iFinancialAccountType && oAccount.postable == 'Y')
																}
															});
														}
														else
														{
															sSearch = sSearch.toLowerCase();
															var oData = $.grep(ns1blankspace.financial.data.accounts, function (oAccount)
															{
																if ($('#ns1blankspaceItemShowAll-' + sID).prop('checked') == true)
																{
																	return ((oAccount.title).toLowerCase().indexOf(sSearch) != -1 && oAccount.postable == 'Y')
																}
																else
																{
																	return (oAccount.type == iFinancialAccountType && (oAccount.title).toLowerCase().indexOf(sSearch) != -1 && oAccount.postable == 'Y')
																}
															});
														}

														if (oData.length == 0)
														{
															$('#ns1blankspaceFinancialImportItem_edit-financialAccount-' + sID + '_search').html('<div class="ns1blankspaceSubNote">Nothing to show.</div>');
														}
														else
														{
															aHTML.push('<table class="ns1blankspace" style="margin-bottom:14px;">');
															
															$.each(oData, function() 
															{ 
																aHTML.push('<tr class="ns1blankspaceRow">'+ 
																				'<td id="ns1blankspaceItem_title-' + sID + '-' + this.id + '-' + this.taxtype + '" class="ns1blankspaceViewLink">' +
																				this.title + '</td></tr>');	
															});
															
															aHTML.push('</table>');

															$('#ns1blankspaceFinancialImportItem_edit-financialAccount-' + sID + '_search').html(aHTML.join(''))

															$('#ns1blankspaceFinancialImportItem_edit-financialAccount-' + sID + '_search .ns1blankspaceViewLink')
															.click(function()
															{
																var sID = this.id;
																var aID = sID.split('-');

																$('#ns1blankspaceFinancialImportItem_edit_container-financialAccount-' + aID[1]).hide();
																$('#ns1blankspaceFinancialImportItem-financialAccount-' + aID[1] + '_value').attr('data-id', aID[2]);
																$('#ns1blankspaceFinancialImportItem-financialAccount-' + aID[1] + '_value').html($(this).html());
																$('#ns1blankspaceFinancialImportItem_edit-financialAccount-' + aID[1] + '_search').html('');

																oTransaction.financialaccount = aID[2];
																
																var oData =
																{
																	id: aID[1],
																	financialaccount: aID[2]
																}

																if (oTransaction.taxtype == '')
																{
																	var oAccount = $.grep(ns1blankspace.financial.data.accounts, function (oAccount)
																	{
																		return (oAccount.id == sID)
																	});

																	oTransaction.taxtype = oAccount.taxtype;
																	oData.taxtype = oAccount.taxtype;

																	if (oData.taxtype != '')
																	{
																		var sTaxText = oAccount['taxtype' + (oTransaction.type==1?'incoming':'outgoing') + 'text'];
																		$('#ns1blankspaceFinancialImportItem-tax-' + aID[1] + '_value').attr('data-id', oAccount.taxtype);
																		$('#ns1blankspaceFinancialImportItem-tax-' + aID[1] + '_value').html(sTaxText);
																	}
																}

																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE'),
																	data: oData,
																	dataType: 'json',
																	global: false,
																	success: function(data)
																	{
																		ns1blankspace.status.message('Updated')
																	}
																});
															});
														}	
													}	
												},

									tax: function (oParam, oResponse)
												{
													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
													var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 2}).value;

													var oTransaction = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.transactions, function (transaction)
													{
														return transaction.id == sID
													});

													ns1blankspace.financial.util.tax.codes(
													{
														xhtmlElementID: 'ns1blankspaceFinancialImportItem_edit-tax-' + sID + '_search',
														id: oTransaction.taxtype,
														type: oTransaction.type,
														link: true,
														xhtmlElementName: 'ns1blankspaceFinancialImportItem_edit_tax-' + sID
													});

													$('#ns1blankspaceFinancialImportItem_edit-tax-' + sID + '_search .ns1blankspaceViewLink')
													.click(function()
													{
														var sID = this.id;
														var aID = sID.split('-');

														$('#ns1blankspaceFinancialImportItem_edit_container-tax-' + aID[1]).hide();
														$('#ns1blankspaceFinancialImportItem-tax-' + aID[1] + '_value').attr('data-id', aID[2]);
														$('#ns1blankspaceFinancialImportItem-tax-' + aID[1] + '_value').html($(this).html());
														$('#ns1blankspaceFinancialImportItem_edit-tax-' + aID[1] + '_search').html('');

														oTransaction.taxtype = aID[2];

														var oData =
														{
															id: aID[1],
															taxtype: aID[2]
														}

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE'),
															data: oData,
															dataType: 'json',
															global: false,
															success: function(data)
															{
																ns1blankspace.status.message('Updated')
															}
														});
													});


												},

									contactBusiness: function (oParam, oResponse)
												{
													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
													var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 2}).value;
													var sContactType = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
													var sSearch = $('#' + sXHTMLElementID).val();

													if (oResponse == undefined)
													{
														var oSearch = new AdvancedSearch();
														oSearch.endPoint = 'contact';
														oSearch.method = 'CONTACT_BUSINESS_SEARCH';
														oSearch.addField('tradename,legalname');			
														oSearch.addFilter('tradename', 'TEXT_IS_LIKE', sSearch);
														oSearch.sort('tradename', 'asc');
														oSearch.rf = 'json';
														oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.import.items.contactBusiness(oParam, data)}) 
													}
													else
													{
														var aHTML = [];

														var oTransaction = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.transactions, function (transaction)
														{
															return transaction.id == sID
														});

														if (oResponse.data.rows.length == 0)
														{
															$('#ns1blankspaceFinancialImportItem_edit-contactBusiness-' + sID + '_search').html('<div class="ns1blankspaceSubNote">Nothing to show.</div>');
														}
														else
														{
															aHTML.push('<table class="ns1blankspace" style="margin-bottom:14px;">');
															
															$.each(oResponse.data.rows, function() 
															{ 
																aHTML.push('<tr class="ns1blankspaceRow">'+ 
																				'<td id="ns1blankspaceItem_title-' + sID + '-' + this.id + '" class="ns1blankspaceViewLink">' +
																				this.tradename + '</td></tr>');	
															});
															
															aHTML.push('</table>');

															$('#ns1blankspaceFinancialImportItem_edit-contactBusiness-' + sID + '_search').html(aHTML.join(''))

															$('#ns1blankspaceFinancialImportItem_edit-contactBusiness-' + sID + '_search .ns1blankspaceViewLink')
															.click(function()
															{
																var sID = this.id;
																var aID = sID.split('-');

																$('#ns1blankspaceFinancialImportItem_edit-contactBusiness-' + aID[1]).hide();
																$('#ns1blankspaceFinancialImportItem-contactBusiness-' + aID[1] + '_value').attr('data-id', aID[2]);
																$('#ns1blankspaceFinancialImportItem-contactBusiness-' + aID[1] + '_value').html($(this).html());
																oTransaction.contactbusiness = aID[2];
																$('#ns1blankspaceFinancialImportItem_edit-contactBusiness-' + aID[1] + '_search').html('');
																$('#ns1blankspaceFinancialImportItem-contactPerson-' + aID[1] + '_value').html('<i style="color:#c31d1d;">Not set</i>');
																oTransaction.contactperson = '';

																var oData =
																{
																	id: aID[1],
																	contactbusiness: aID[2],
																	contactperson: ''
																}

																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE'),
																	data: oData,
																	dataType: 'json',
																	global: false,
																	success: function(data)
																	{
																		ns1blankspace.status.message('Updated')
																	}
																});
															});
														}		
													}	
												},	

									contactPerson: function (oParam, oResponse)
												{
													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
													var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 2}).value;
													var sContactType = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
													var sSearch = $('#' + sXHTMLElementID).val();

													var oTransaction = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.transactions, function (transaction)
													{
														return transaction.id == sID
													});

													if (oResponse == undefined)
													{
														var oSearch = new AdvancedSearch();
														oSearch.endPoint = 'contact';
														oSearch.method = 'CONTACT_PERSON_SEARCH';
														oSearch.addField('firstname,surname');

														oSearch.addBracket('(')	
														oSearch.addFilter('firstname', 'TEXT_IS_LIKE', sSearch);
														oSearch.addOperator('or');
														oSearch.addFilter('surname', 'TEXT_IS_LIKE', sSearch);
														oSearch.addBracket(')')

														if (oTransaction.contactbusiness != '')
														{
															oSearch.addFilter('contactbusiness', 'EQUAL_TO', oTransaction.contactbusiness);
														}

														oSearch.rf = 'json';
														oSearch.sort('firstname', 'asc')
														oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.import.items.contactPerson(oParam, data)}) 
													}
													else
													{
														var aHTML = [];

														if (oResponse.data.rows.length == 0)
														{
															$('#ns1blankspaceFinancialImportItem_edit-contactPerson-' + sID + '_search').html('<div class="ns1blankspaceSubNote">Nothing to show.</div>');
														}
														else
														{
															aHTML.push('<table class="ns1blankspace" style="margin-bottom:14px;">');
															
															$.each(oResponse.data.rows, function() 
															{ 
																aHTML.push('<tr class="ns1blankspaceRow">'+ 
																				'<td id="ns1blankspaceItem_name-' + sID + '-' + this.id + '" class="ns1blankspaceViewLink">' +
																				this.firstname + ' ' + this.surname + '</td></tr>');	
															});
															
															aHTML.push('</table>');

															$('#ns1blankspaceFinancialImportItem_edit-contactPerson-' + sID + '_search').html(aHTML.join(''))

															$('#ns1blankspaceFinancialImportItem_edit-contactPerson-' + sID + '_search .ns1blankspaceViewLink')
															.click(function()
															{
																var sID = this.id;
																var aID = sID.split('-');

																$('#ns1blankspaceFinancialImportItem_edit-contactPerson-' + aID[1]).hide();
																$('#ns1blankspaceFinancialImportItem-contactPerson-' + aID[1] + '_value').attr('data-id', aID[2]);
																$('#ns1blankspaceFinancialImportItem-contactPerson-' + aID[1] + '_value').html($(this).html());
																$('#ns1blankspaceFinancialImportItem_edit-contactPerson-' + aID[1] + '_search').html('');

																oTransaction.contactperson = aID[2];

																var oData =
																{
																	id: aID[1],
																	contactperson: aID[2]
																}

																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE'),
																	data: oData,
																	dataType: 'json',
																	global: false,
																	success: function(data)
																	{
																		ns1blankspace.status.message('Updated')
																	}
																});

															});	
														}	
													}	
												},								

									status: 	function(oParam, oResponse)
												{
													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
													var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
													
													if ($(ns1blankspace.xhtml.container).attr('data-source') == sXHTMLElementID)
													{
														$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
														$(ns1blankspace.xhtml.container).attr('data-source', '');
													}
													else
													{	
														$(ns1blankspace.xhtml.container).attr('data-source', sXHTMLElementID);
														ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: 0, topOffset: 5})

														var aHTML = [];

														aHTML.push('<div id="ns1blankspaceImportEditStatus-1" class="ns1blankspaceImportEditStatus ns1blankspaceAction">Unconfirmed</div>');
														aHTML.push('<div id="ns1blankspaceImportEditStatus-3" class="ns1blankspaceImportEditStatus ns1blankspaceAction">Confirmed (Unmatched)</div>');
														aHTML.push('<div id="ns1blankspaceImportEditStatus-2" class="ns1blankspaceImportEditStatus ns1blankspaceAction">Matched & Reconciled</div>');
														aHTML.push('<div id="ns1blankspaceImportEditStatus-4" class="ns1blankspaceImportEditStatus ns1blankspaceAction">Matched</div>');

														$(ns1blankspace.xhtml.container).html(aHTML.join(''));
														$(ns1blankspace.xhtml.container).show();

														$('div.ns1blankspaceImportEditStatus').button().click(function(event)
														{
															$(ns1blankspace.xhtml.container).attr('data-source', '');
															$(ns1blankspace.xhtml.container).hide();

															$('#ns1blankspaceFinancialImportItem_status-' + iID).html($(this).html());

															ns1blankspace.status.working();

															var sID = this.id;
															var aID = sID.split('-');

															if (aID[1] != 1)
															{
																$('#ns1blankspaceFinancialImportItem_options_remove-' + iID).hide();
															}
															else
															{
																$('#ns1blankspaceFinancialImportItem_options_remove-' + iID).show();
															}

															var oData =
															{
																id: iID,
																status: (this.id).split('-')[1]
															}	

															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE'),
																data: oData,
																dataType: 'json',
																success: function(data)
																{
																	if (data.status == 'OK')
																	{
																		ns1blankspace.status.message('Updated');
																	}
																	else
																	{
																		ns1blankspace.status.error(data.error.errornotes);
																		ns1blankspace.financial.bankAccount["import"].items.show(oParam);
																	}
																}
															});
														});
													}		
												},		
			
									refresh: function (oParam)
												{
													var iID = ns1blankspace.util.getParam(oParam, 'bankTransactionID').value;
													var iItemStatus = ns1blankspace.util.getParam(oParam, 'itemStatus', {"default": 4}).value;

													$('#ns1blankspaceFinancialImportItem_options_edit-' + iID).attr('data-status', iItemStatus)

													if (iItemStatus == 4)
													{	
														$('#ns1blankspaceFinancialImportItem_status-' + iID).html('Transferred to financials');
														$('#ns1blankspaceFinancialImportItem_options_edit_container-' + iID).html('');
													}
													else if (iItemStatus == 7)
													{
														$('#ns1blankspaceFinancialImportItem_status-' + iID).html('Part transferred to financials');
													}	

													$('#ns1blankspaceFinancialImportItem_container_edit-' + iID).remove();
												},
//*NEW:2.2.3
									match: 	{
													data:
													{
														unmatched: 
														{
															credits: undefined,
															debits: undefined
														}
													},

													init: function (oParam)
													{
														//not used - go straight to search.init
													},

													initData: function(oParam, oResponse)
													{
														var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 0}).value;
														var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": 1}).value;
														var bThisBankAccountOnly = ns1blankspace.util.getParam(oParam, 'thisBankAccountOnly', {"default": false}).value;

														var sClass = (iType == 2?'debits':'credits')
						
														if (iStep == 0)
														{
															if (ns1blankspace.financial.bankAccount.import.items.match.data.unmatched[sClass] == undefined)
															{	
																oParam = ns1blankspace.util.setParam(oParam, 'step', iStep + 1);
																ns1blankspace.financial.bankAccount.import.items.match.initData(oParam);
															}
															else
															{
																ns1blankspace.financial.bankAccount["import"].items.show({status: 3});
															}
														}

														if (iStep == 1)  //GET UNMATCHED PAYMENTS OR RECEIPTS
														{
															var sType = (iType == 2?'payments':'receipts');
															ns1blankspace.status.working('Getting ' + sType + '...');

															if (oResponse == undefined)
															{
																var oSearch = new AdvancedSearch();
																		
																if (iType == 2)
																{
																	oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
																	oSearch.addField('reference,description,amount,paiddate,reconciliation,contactbusinesspaidtotext,contactpersonpaidtotext,contactbusinesspaidto,contactpersonpaidto');

																}	
																else
																{
																	oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
																	oSearch.addField('reference,description,amount,receiveddate,reconciliation,contactbusinessreceivedfromtext,contactpersonreceivedfromtext,contactbusinessreceivedfrom,contactpersonreceivedfrom');
																}
															
																oSearch.addFilter('sourcebanktransaction', 'IS_NULL');
																oSearch.addFilter('reconciliation', 'IS_NULL');
																oSearch.addFilter('amount', 'NOT_EQUAL_TO', 0);

																if (bThisBankAccountOnly)
																{
																	oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext)
																}

																oSearch.rows = 1000;
																oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.import.items.match.initData(oParam, data)});
															}
															else
															{
																$.each(oResponse.data.rows, function (i, v)
																{
																	v.type = (iType == 2?'payment':'receipt')
																	v.object = (iType == 2?3:6)
																	v.contactbusiness = v['contactbusiness' + (iType == 2?'paidto':'receivedfrom')];
																	v.contactperson = v['contactperson' + (iType == 2?'paidto':'receivedfrom')];
																	v.date = v[(iType == 2?'paid':'received') + 'date'];
																});

																ns1blankspace.financial.bankAccount.import.items.match.data.unmatched[sType] = oResponse.data.rows;
																ns1blankspace.financial.bankAccount.import.items.match.data.unmatched[sClass] = oResponse.data.rows;

																if (iType == 1)
																{
																	oParam = ns1blankspace.util.setParam(oParam, 'type', 2);
																}
																else
																{
																	delete oParam.type;
																	oParam = ns1blankspace.util.setParam(oParam, 'step', iStep + 1);
																}

																ns1blankspace.financial.bankAccount.import.items.match.initData(oParam);
															}	
														}

														if (iStep == 2)  //GET OUTSTANDING EXPENSES / INVOICES
														{
															var sType = (iType == 2?'expenses':'invoices')
															ns1blankspace.status.working('Getting ' + sType + '...');
															
															if (oResponse == undefined)
															{
																var oSearch = new AdvancedSearch();
																		
																if (iType == 2)
																{
																	oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
																	oSearch.addField('reference,description,amount,accrueddate,outstandingamount,contactbusinesspaidtotext,contactpersonpaidtotext,contactbusinesspaidto,contactpersonpaidto');

																}	
																else
																{
																	oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
																	oSearch.addField('reference,description,amount,sentdate,outstandingamount,contactbusinesssenttotext,contactpersonsenttotext,contactbusinesssentto,contactpersonsentto');
																}
															
																oSearch.addFilter('outstandingamount', 'NOT_EQUAL_TO', 0);
								
																if (bThisBankAccountOnly && iType == 2)
																{
																	oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext)
																}

																oSearch.rows = 1000;
																oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.import.items.match.initData(oParam, data)});
															}
															else
															{
																$.each(oResponse.data.rows, function (i, v)
																{
																	v.type = (iType == 2?'expense':'invoice');
																	v.object = (iType == 2?2:5);
																	v.contactbusiness = v['contactbusiness' + (iType == 2?'paidto':'sentto')];
																	v.contactperson = v['contactperson' + (iType == 2?'paidto':'sentto')];
																	v.date = v[(iType == 2?'accrued':'sent') + 'date'];
																});

																ns1blankspace.financial.bankAccount.import.items.match.data.unmatched[sType] = oResponse.data.rows;

																ns1blankspace.financial.bankAccount.import.items.match.data.unmatched[sClass] =
																	ns1blankspace.financial.bankAccount.import.items.match.data.unmatched[sClass].concat(oResponse.data.rows);

																if (iType == 1)
																{
																	oParam = ns1blankspace.util.setParam(oParam, 'type', 2);
																}
																else
																{
																	delete oParam.type;
																	oParam = ns1blankspace.util.setParam(oParam, 'step', iStep + 1);
																}

																ns1blankspace.financial.bankAccount.import.items.match.initData(oParam);
															}	
														}	
	
														if (iStep == 3)  //GET UNMATCHED JOURNALS
														{
															if (ns1blankspace.financial.bankAccount.import.items.match.data.unmatched['journals'] == undefined)
															{	
																if (oResponse == undefined)
																{
																	ns1blankspace.status.working('Getting journals...');

																	var oSearch = new AdvancedSearch();
																
																	oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_ITEM_SEARCH';
																	oSearch.addField('taxcategory,creditamount,debitamount,reconciliation,generaljournalitem.generaljournal.reference,generaljournalitem.generaljournal.description,generaljournalitem.generaljournal.journaldate');
																	oSearch.sort('generaljournalitem.generaljournal.journaldate', 'asc');
																	oSearch.addFilter('sourcebanktransaction', 'IS_NULL');
																	oSearch.addFilter('reconciliation', 'IS_NULL');
																	oSearch.addFilter('generaljournalitem.generaljournal.status', 'EQUAL_TO', 2);
																	oSearch.addFilter('financialaccount', 'EQUAL_TO', ns1blankspace.objectContextData.financialaccount);
																	//oSearch.addFilter('generaljournalitem.generaljournal.journaldate', 'LESS_THAN_OR_EQUAL_TO', dReconciliationEndDate);
																	oSearch.rows = 1000;
																	oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.import.items.match.initData(oParam, data)});
																}
																else
																{	
																	ns1blankspace.financial.bankAccount.import.items.match.data.unmatched['journals'] = oResponse.data.rows;
																	$.each(ns1blankspace.financial.bankAccount.import.items.match.data.unmatched['journals'], function (i, v)
																	{
																		v.type = 'journal';
																		v.object = 122;
																		v.date = v['generaljournalitem.generaljournal.journaldate'];
																	});

																	oParam = ns1blankspace.util.setParam(oParam, 'step', iStep + 1);
																	ns1blankspace.financial.bankAccount.import.items.match.initData(oParam);
																}
															}
															else
															{
																oParam = ns1blankspace.util.setParam(oParam, 'step', iStep + 1);
																ns1blankspace.financial.bankAccount.import.items.match.initData(oParam);
															}	
														}

														if (iStep == 99)  //GET ACTIONS - UPLOAD IMAGES //TODO
														{
															if (ns1blankspace.financial.bankAccount.import.items.match.data.images == undefined)
															{	
																if (oResponse == undefined)
																{
																	ns1blankspace.status.working('Getting upload images...');

																	var oSearch = new AdvancedSearch();
																	oSearch.method = 'CORE_ATTACHMENT_SEARCH';
																	oSearch.addField('type,filename,title,description,download,modifieddate,attachment,bucket,createddate,createdusertext,object,objectcontext');
																	oSearch.addFilter('title', 'EQUAL_TO', '_upload.expense.image');
																	oSearch.rows = 1000;
																	oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.import.items.match.initData(oParam, data)});
																}
																else
																{	
																	oParam = ns1blankspace.util.setParam(oParam, 'step', iStep + 1);
																	ns1blankspace.financial.bankAccount.import.items.match.initData(oParam);
																}
															}
															else
															{
																oParam = ns1blankspace.util.setParam(oParam, 'step', iStep + 1);
																ns1blankspace.financial.bankAccount.import.items.match.initData(oParam);
															}	
														}

														if (iStep == 4)  //CONVERGE TO CREDITS OR DEBITS TO MATCH TO BANK TRANSACTIONS (ITEMS)
														{
															$.each([1,2], function ()
															{
																var iType = this;

																var sJournalType = (iType==1?'credit':'debit');
																var sClass = (iType == 2?'debits':'credits')
																var sType = (iType == 2?'payments':'receipts')

																var oJournals = $.grep(ns1blankspace.financial.bankAccount.import.items.match.data.unmatched.journals,
																					function (a) {return a[sJournalType + 'amount'] != 0;});

																ns1blankspace.financial.bankAccount.import.items.match.data.unmatched[sClass] =
																		ns1blankspace.financial.bankAccount.import.items.match.data.unmatched[sClass].concat(oJournals);

																$.each(ns1blankspace.financial.bankAccount.import.items.match.data.unmatched[sClass], function(i,k) 
																{
																	//if (k.paiddate !== undefined) {k.date = k.paiddate}
																	//if (k.receiveddate !== undefined) {k.date = k.receiveddate}
																	//if (k['generaljournalitem.generaljournal.journaldate'] !== undefined) {k.date = k['generaljournalitem.generaljournal.journaldate']}
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

																	/*if (iType == 2)
																	{
																		k.contactbusiness = k.contactbusinesspaidto;
																		k.contactperson = k.contactpersonpaidto;
																	}
																	else
																	{
																		k.contactbusiness = k.contactbusinessreceivedfrom;
																		k.contactperson = k.contactpersonreceivedfrom;
																	}*/

																	k.dateSort = Date.parse(k.date);

																	k.searchkey = k.reference + ' ' + k.date + ' ' + k.searchAmount + ' ' + k.description;
																});
															});
																	
															ns1blankspace.status.message('');
															ns1blankspace.financial.bankAccount["import"].items.show({status: 3});
														}
													},

													search: 
													{
														init: function (oParam)
														{
															var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
															var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;

															if ($('#ns1blankspaceFinancialImportItem_container_match_search-' + sID).html() != '')
															{
																$('#ns1blankspaceFinancialImportItem_container_match_search-' + sID).html('');
																$('#ns1blankspaceFinancialImportItem_container_match_search-' + sID).css('background-color', 'transparent');
																$('#ns1blankspaceFinancialImportItem_container-' + sID).css('background-color', 'transparent');
															}
															else
															{
																$('#ns1blankspaceFinancialImportItem_container_match_search-' + sID).css('background-color', '#f5f5f5');
																$('#ns1blankspaceFinancialImportItem_container-' + sID).css('background-color', '#f5f5f5');

																var oTransaction = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.transactions, function (transaction)
																{
																	return transaction.id == sID
																});

																if (_.isObject(oTransaction))
																{
																	var bNeedInput = ((oTransaction.contactbusiness == '' && oTransaction.contactperson == '') || oTransaction.financialaccount == '');

																	var aHTML = [];
																
																	aHTML.push('<div style="margin-top:6px; margin-left:0px; margin-right:3px; margin-bottom:5px;" id="ns1blankspaceFinancialImportItemMode-' + sID + '">');

																	aHTML.push('<input style="width: 100%;" type="radio" id="ns1blankspaceFinancialImportItemMode-checkForAttachments-' + sID + '" name="radioMode" ' + (bNeedInput?' checked="checked"':'') + ' />' +
																					'<label for="ns1blankspaceFinancialImportItemMode-checkForAttachments-' + sID + '" style="font-size:0.75em; margin-right:1px;">' +
																					'Uploaded Images</label>');											
																	aHTML.push('<input style="width: 100%;" type="radio" id="ns1blankspaceFinancialImportItemMode-matchTo-' + sID + '" name="radioMode"' + (bNeedInput?'':' checked="checked"') + ' />' +
																					'<label for="ns1blankspaceFinancialImportItemMode-matchTo-' + sID + '" style="font-size:0.75em; margin-right:1px;">' +
																					'Match To</label>');
																	aHTML.push('<input style="width: 100%;" type="radio" id="ns1blankspaceFinancialImportItemMode-create-' + sID + '" name="radioMode"/>' +
																					'<label for="ns1blankspaceFinancialImportItemMode-create-' + sID + '" style="font-size:0.75em; margin-right:1px;">' +
																					'Create</label>');
																	
																	//aHTML.push('<input style="width: 100%;" type="radio" id="ns1blankspaceFinancialImportItemMode-checkForEmails-' + sID + '" name="radioMode" />' +
																	//				'<label for="ns1blankspaceFinancialImportItemMode-checkForEmails-' + sID + '" style="font-size:0.75em;">' +
																	//				'Emailed Images</label>');
																	aHTML.push('</div>');

																	aHTML.push('<div id="ns1blankspaceFinancialImportItem_container_match_search_container-' + sID + '" style="margin-bottom:14px;"></div>');

																	$('#ns1blankspaceFinancialImportItem_container_match_search-' + sID).html(aHTML.join(''));

																	$('#ns1blankspaceFinancialImportItemMode-' + sID).buttonset();

																	$('#ns1blankspaceFinancialImportItemMode-' + sID + ' :radio').click(function()
																	{
																		var aID = (this.id).split('-');
																		var sMode = aID[1];

																		ns1blankspace.financial.bankAccount.import.items.match.search[sMode](oParam);
																	});

																	ns1blankspace.financial.bankAccount.import.items.match.search[(bNeedInput?'checkForAttachments':'matchTo')](oParam);
																}
															}
														},

														checkForAttachments: function (oParam, oResponse)
														{
															var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;

															var oTransaction = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.transactions, function (transaction)
															{
																return transaction.id == sID
															});

															if (oResponse == undefined)
															{
																var oSearch = new AdvancedSearch();
																oSearch.method = 'CORE_ATTACHMENT_SEARCH';
																oSearch.addField('type,filename,title,description,download,modifieddate,attachment,bucket,createddate,createdusertext,object,objectcontext');
																oSearch.addFilter('title', 'EQUAL_TO', '_upload.expense.image');
																oSearch.addFilter('modifieddate', 'GREATER_THAN_OR_EQUAL_TO', oTransaction.posteddate);
																oSearch.addFilter('modifieddate', 'LESS_THAN_OR_EQUAL_TO', moment(oTransaction.posteddate, ns1blankspace.option.dateFormats, true).add(7, 'days').format('DD MMM YYYY'));
																oSearch.rows = 1000;
																oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.import.items.match.search.checkForAttachments(oParam, data)});
															}
															else
															{
																ns1blankspace.financial.bankAccount.import.items.match.data.images = oResponse.data.rows;

																var aHTML = [];

																if (ns1blankspace.financial.bankAccount.import.items.match.data.images.length == 0)
																{
																	aHTML.push('<table style="margin-top:8px;"><tr class="ns1blankspace">' +
																						'<td class="ns1blankspaceNothing">There are no upload images that are within a week of the transaction date.</td>' +
																						'</tr></table>');

																	$('#ns1blankspaceFinancialImportItem_container_match_search_container-' + sID).html(aHTML.join(''));
																}
																else
																{
																	aHTML.push('<table cellspacing=0 cellpadding=0 class="ns1blankspace">' +
																						'<tr><td width="50px;">');

																	aHTML.push('<table cellspacing=2 cellpadding=6 class="ns1blankspace">');

																	$.each(ns1blankspace.financial.bankAccount.import.items.match.data.images, function(i, oImage)
																	{				
																		aHTML.push('<tr><td style="background-color:#FFFFFF;" id="ns1blankspaceMatchItemsImages_filename-' + oTransaction.id + '" class="imageitem ns1blankspaceRow ns1blankspaceRowSelect"' +
																				' data-id="' + oImage.id + '">' +
																				oImage.filename + '</td>');
																										
																	});

																	aHTML.push('</table>');

																	aHTML.push('</td><td id="ns1blankspaceFinancialImportItem_image_container-' + sID + '"></tr></table>');

																	$('#ns1blankspaceFinancialImportItem_container_match_search_container-' + sID).html(aHTML.join(''));

																	$('#ns1blankspaceFinancialImportItem_container_match_search_container-' + sID + ' td.imageitem').click(function ()
																	{
																		var sURL = '/rpc/core/?method=CORE_IMAGE_SHOW&id=' + $(this).attr('data-id');

																		ns1blankspace.visualise.util.imageToCanvas(
																		{
																			imageSource: sURL,
																			xhtmlElementCanvasContainerID: 'ns1blankspaceFinancialImportItem_image_container-' + sID,
																			autoRotation: 90,
																			autoScale: true,
																			scaleFactor: 0.95
																		});
																	})	

																	$('#ns1blankspaceFinancialImportItem_container_match_search_container-' + sID + ' td.imageitem').first().click()
																}	
															}
														},

														checkForEmails: function (oParam)
														{

														},

														matchTo: function (oParam)
														{
															var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
															var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
															var bSearchFuzzy = ns1blankspace.util.getParam(oParam, 'fuzzy', {"default": false}).value;

															var oTransaction = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.transactions, function (transaction)
															{
																return transaction.id == sID
															});

															var iType = oTransaction.type;
															var iTaxCategory = (iType==1?2:1);
															var sJournalType = (iType==1?'credit':'debit');
															var sClass = (iType == 2?'debits':'credits');
															var bNeedInput = ((oTransaction.contactbusiness == '' && oTransaction.contactperson == '') && oTransaction.financialaccount == '');

															var aHTML = [];

															if (oTransaction.contactbusiness == '' && oTransaction.contactperson == '')
															{
																bSearchFuzzy = true
															}

															if (_.isUndefined(ns1blankspace.financial.bankAccount.import.items.match.data.matched))
															{
																ns1blankspace.financial.bankAccount.import.items.match.data.matched = {}
															}

															var cSearchAmount = Math.abs(oTransaction.amount);
															var sSearchReference;
															var dSearchDate = oTransaction.posteddate;
															var sSearchText;
																
															if (!bSearchFuzzy)
															{
																ns1blankspace.financial.bankAccount.import.items.match.data.matched[sID] = 
																	_.filter(ns1blankspace.financial.bankAccount.import.items.match.data.unmatched[sClass],
																	function (oItem)
																	{
																		var bMatch = 
																				numeral(oItem.searchAmount).value() <= Math.abs(numeral(oTransaction.amount).value()) &&
																				((oItem.contactbusiness==''?false:oItem.contactbusiness == oTransaction.contactbusiness) ||
																					(oItem.contactperson==''?false:oItem.contactperson==oTransaction.contactperson))
																					
																		return bMatch
																	});

																if (ns1blankspace.financial.bankAccount.import.items.match.data.matched[sID].length == 0)
																{
																	bSearchFuzzy = true;
																}	
															}	

															if (bSearchFuzzy)
															{
																var aSearch = 
																	_.filter(ns1blankspace.financial.bankAccount.import.items.match.data.unmatched[sClass],
																	function (oItem)
																	{
																		var bMatch = numeral(oItem.searchAmount).value() <= numeral(oTransaction.amount).value()
																					
																		return bMatch
																	});

																var fuse = new Fuse(aSearch,
																{
																	keys: ['description'],
																	threshold: 0.7,
																	shouldSort: true,
																	includeScore: false,
																	tokenize: false
																})

																sSearchText = oTransaction.posteddate + ' ' + oTransaction.amount + ' ' + oTransaction.description;
																ns1blankspace.financial.bankAccount.import.items.match.data.matched[sID] = fuse.search(sSearchText)
															} 

															if (ns1blankspace.financial.bankAccount.import.items.match.data.matched[sID].length == 0)
															{
																var sHTML = 'There are no unmatched payments, expenses, journals that closely match this bank transaction.'
																
																if (bNeedInput)
																{
																	sHTML = sHTML + ' There is not enough information to create a ' + (iType==2?'payment':'receipt') + ' automatically, so you need to click Create.';
																}
																else
																{
																	sHTML = sHTML + ' You can click <i>Create</i> to manually enter a ' + (iType==2?'payment':'receipt') + '. ';
																}

																aHTML.push('<table style="margin-top:8px;"><tr class="ns1blankspace">' +
																				'<td class="ns1blankspaceNothing">' + sHTML + '</td>' +
																				'</tr></table>');

																$('#ns1blankspaceFinancialImportItem_container_match_search_container-' + sID).html(aHTML.join(''));
															}
															else
															{
																ns1blankspace.financial.bankAccount.import.items.match.data.matched[sID].sort(ns1blankspace.util.sortBy('dateSort'));

																var aHTML = [];

																aHTML.push('<table cellspacing=2 cellpadding=6>');

																$.each(ns1blankspace.financial.bankAccount.import.items.match.data.matched[sID], function(i, oItem)
																{				
																	aHTML.push('<tr><td id="ns1blankspaceMatchItems_type-' + oItem.id + '" class="matchitem ns1blankspaceRow" style="background-color:#FFFFFF; padding:4px;">' +
																							_.capitalize(oItem.type) + '</td>');
																										
																	aHTML.push('<td id="ns1blankspaceMatchItems_date-' + oItem.id + '" class="matchitem ns1blankspaceRow" style="width:75px; background-color:#FFFFFF; padding:4px;">' +
																							ns1blankspace.util.fd(oItem.date) + '</td>');								
																	
																	aHTML.push('<td id="ns1blankspaceMatchItems_reference-' + oItem.id + '"' +
																						' class="matchitem ns1blankspaceRow" title="' + oItem.reference + '" style="background-color:#FFFFFF; padding:4px;">' +
																							oItem.description + '</td>');

																	aHTML.push('<td id="ns1blankspaceMatchItems_amount-' + oItem.id + '" style="text-align:right; background-color:#FFFFFF; padding:4px;"' +
																							' class="matchitem ns1blankspaceRow">' +
																							oItem.amount + '</td>');					
																			
																	aHTML.push('<td style="width:30px;text-align:right; background-color:#FFFFFF; padding:4px;" class="ns1blankspaceRow">' +
																						'<span data-id="' + oItem.id + '" data-transaction-id="' + sID + '" id="ns1blankspaceMatchItems_options_match-' + oItem.id + '-' + oItem.type + '" class="ns1blankspaceMatchItemsMatch" title="Mark as matched"></span>' +
																						'</td></tr>');
																});

																aHTML.push('</table>');

																$('#ns1blankspaceFinancialImportItem_container_match_search_container-' + sID).html(aHTML.join(''));
																
																$('#ns1blankspaceFinancialImportItem_container_match_search-' + sID + ' .ns1blankspaceMatchItemsMatch').button(
																{
																	text: false,
																	icons:
																	{
																		primary: "ui-icon-check"
																	}
																})
																.click(function()
																{
																	oParam.xhtmlElementID = this.id;
																	var sID = $(this).attr('data-id');
																	var sTransactionID = $(this).attr('data-transaction-id');

																	var oItem = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.matched[sTransactionID], function (item)
																	{
																		return item.id == sID
																	});

																	var oTransaction = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.transactions, function (transaction)
																	{
																		return transaction.id == sTransactionID
																	});

																	oParam.object = oItem.object
																	oParam.objectContext = oItem.id
																	oParam.bankTransactionID = sTransactionID;

																	if (oParam.object == 2)
																	{
																		sObject = 'payment';
																		oParam.object = 3;
																	}

																	if (oParam.object == 5)
																	{
																		sObject = 'receipt';
																		oParam.object = 6;
																	}

																	if (oParam.object == 2 || oParam.object == 5)
																	{
																		var oData =
																		{
																			id: oParam.objectContext,
																			paiddate: oTransaction.posteddate,
																			receiptdate: oTransaction.posteddate,
																			paymentmethod: 3
																		}

																		$.ajax(
																		{
																			type: 'POST',
																			url: ns1blankspace.util.endpointURI('FINANCIAL_AUTO_' + sObject),
																			data: oData,
																			dataType: 'json',
																			global: false,
																			success: function(oResponse)
																			{
																				if (oResponse.status == 'ER')
																				{
																					ns1blankspace.status.message('Error')
																				}
																				else
																				{
																					oParam.objectContext = oResponse[sObject];

																					var oData =
																					{
																						id: oResponse[sObject],
																						sourcebanktransaction: sTransactionID
																					}

																					$.ajax(
																					{
																						type: 'POST',
																						url: ns1blankspace.util.endpointURI('FINANCIAL_' + sObject + '_MANAGE'),
																						data: oData,
																						dataType: 'json',
																						global: false,
																						success: function(oResponse)
																						{
																							if (oResponse.status == 'ER')
																							{
																								ns1blankspace.status.message('Error')
																							}
																							else
																							{
																								oParam.xhtmlElementID = '-' + sTransactionID;
																								ns1blankspace.financial.bankAccount.import.items.match.create.finalise(oParam)
																							}	
																						}
																					});
																				}	
																			}
																		});
																	}
																	else
																	{
																		var sObject;

																		if (oParam.object == 3)
																		{
																			sObject = 'payment';
																		}

																		if (oParam.object == 6)
																		{
																			sObject = 'receipt';
																		}

																		var oData =
																		{
																			id: oParam.objectContext,
																			sourcebanktransaction: oParam.bankTransactionID
																		}

																		$.ajax(
																		{
																			type: 'POST',
																			url: ns1blankspace.util.endpointURI('FINANCIAL_' + sObject + '_MANAGE'),
																			data: oData,
																			dataType: 'json',
																			global: false,
																			success: function(oResponse)
																			{
																				if (oResponse.status == 'ER')
																				{
																					ns1blankspace.status.message('Error')
																				}
																				else
																				{
																					oParam.xhtmlElementID = '-' + oParam.bankTransactionID;
																					ns1blankspace.financial.bankAccount.import.items.match.create.finalise(oParam)
																				}	
																			}
																		});

																		//ns1blankspace.financial.bankAccount.import.items.match.create.finalise(oParam);
																	}	
																})
																.css('width', '15px')
																.css('height', '17px');
															}
														},

														create: function (oParam)
														{
															var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
															var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;

															var oTransaction = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.transactions, function (transaction)
															{
																return transaction.id == sID
															});

															var aHTML = [];

															//aHTML.push('<div class="ns1blankspaceSub">There is not enough information on the bank transaction to find a match.</div>');

															aHTML.push('<table style="margin-top:6px;">');

															if (oTransaction.type == 1)
															{
																aHTML.push('<tr><td id="ns1blankspaceMatchItems_options_create-' + oTransaction.id + '-invoice" class="ns1blankspaceMatchItemsCreate ns1blankspaceViewLink">Invoice</td></tr>' +
																	'<tr><td id="ns1blankspaceMatchItems_options_create-' + oTransaction.id + '-receipt" class="ns1blankspaceMatchItemsCreate ns1blankspaceViewLink">Receipt</td></tr>' +
																	(ns1blankspace.financial.data.bankaccounts.length>1?'<tr><td id="ns1blankspaceMatchItems_options_create-' + oTransaction.id + '-journal" class="ns1blankspaceMatchItemsCreate ns1blankspaceViewLink">Bank Transfer</td></tr>':''));	
															}
															else
															{
																aHTML.push('<tr><td id="ns1blankspaceMatchItems_options_create-' + oTransaction.id + '-expense" class="ns1blankspaceMatchItemsCreate ns1blankspaceViewLink">Expense</td></tr>' +
																	'<tr><td id="ns1blankspaceMatchItems_options_create-' + oTransaction.id + '-payment" class="ns1blankspaceMatchItemsCreate ns1blankspaceViewLink">Payment</td></tr>' +
																	(ns1blankspace.financial.data.bankaccounts.length>1?'<tr><td id="ns1blankspaceMatchItems_options_create-' + oTransaction.id + '-journal" class="ns1blankspaceMatchItemsCreate ns1blankspaceViewLink">Bank Transfer</td></tr>':''));	
															}
														
															aHTML.push('</table>');

															$('#ns1blankspaceFinancialImportItem_container_match_search_container-' + sID).html(aHTML.join(''));

															$('#ns1blankspaceFinancialImportItem_container_match_search_container-' + sID + ' .ns1blankspaceMatchItemsCreate')
															.click(function()
															{
																oParam.xhtmlElementID = this.id;
																ns1blankspace.financial.bankAccount.import.items.match.create.init(oParam);
															})
														}
													},

													create: 
													{
														init: function (oParam)
														{
															var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
															var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
															var sObject = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 2}).value;

															if (sObject == 'payment') {oParam.object = 3}
															if (sObject == 'expense') {oParam.object = 2}
															if (sObject == 'receipt') {oParam.object = 6}
															if (sObject == 'invoice') {oParam.object = 5}
															if (sObject == 'journal') {oParam.object = 122}

															var oTransaction = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.transactions, function (transaction)
															{
																return transaction.id == sID
															});

															//check have enough data
															var bNeedInput = false;

															if (sObject == 'journal')
															{
																bNeedInput = (ns1blankspace.financial.data.bankaccounts.length >= 2)
															}
															else
															{
																bNeedInput = ((oTransaction.contactbusiness == '' && oTransaction.contactperson == '') || oTransaction.financialaccount == '')
															}
															
															if (bNeedInput)
															{
																ns1blankspace.financial.bankAccount.import.items.match.create.show(oParam);
															}
															else
															{
																if (sObject == 'journal')
																{
																	//if only one other bank account just create the bank transfer journal - else ask.

																	if (ns1blankspace.financial.data.bankaccounts.length == 2)
																	{
																		oParam.bankAccountFrom = ns1blankspace.objectContext;
																		oParam.bankAccountTo = _.find(ns1blankspace.financial.data.bankaccounts, function (bankAccount) {return bankAccount.id != oParam.bankAccountFrom});
																		oParam.date = oTransaction.posteddate;
																		oParam.amount = Math.abs((oTransaction.amount).parseCurrency()).toFixed(2)

																		if (oTransaction.type == 1) //Credit
																		{
																			oParam.bankAccountTo = ns1blankspace.objectContext;
																			oParam.bankAccountFrom = _.find(ns1blankspace.financial.data.bankaccounts, function (bankAccount) {return bankAccount.id != oParam.bankAccountTo});
																		}

																		ns1blankspace.financial.bankAccount.import.items.match.create.transfer.send(oParam)
																	}
																}
																else
																{
																	//just create the receipt or payment
																	
																	oTransaction.createAmount = Math.abs((oTransaction.amount).parseCurrency()).toFixed(2)

																	var fPostSave = ns1blankspace.financial.bankAccount.import.items.match.create.finalise;

																	if (oParam.object == 2 || oParam.object == 5)
																	{
																		fPostSave = ns1blankspace.financial.bankAccount.import.items.match.create.process
																	}

																	oParam = $.extend(true, oParam,
																	{
																		date: oTransaction.posteddate,
																		amount: oTransaction.createAmount,
																		description: oTransaction.description,
																		contactBusiness: oTransaction.contactbusiness,
																		contactPerson: oTransaction.contactperson,
																		financialAccount: oTransaction.financialaccount,
																		account: oTransaction.financialaccount,
																		object: oTransaction.object,
																		bankAccount: ns1blankspace.objectContext,
																		showStatus: false,
																		postSave: fPostSave,
																		bankTransactionID: oTransaction.id,
																		bankTransactionStatus: 2
																	})

																	ns1blankspace.financial.save.send(oParam);
																}	
															}
														},

														process: function (oParam, oResponse)
														{
															var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
															var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext').value;
															var iBankTransactionID = ns1blankspace.util.getParam(oParam, 'bankTransactionID').value;
															var sObject;
															
															var oTransaction = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.transactions, function (transaction)
															{
																return transaction.id == iBankTransactionID
															});

															if (oParam.object == 2)
															{
																sObject = 'payment';
																oParam.object = 3;
															}

															if (oParam.object == 5)
															{
																sObject = 'receipt';
																oParam.object = 6;
															}
									
															var oData =
															{
																id: iObjectContext,
																paiddate: oTransaction.posteddate,
																receiptdate: oTransaction.posteddate,
																paymentmethod: 3
															}

															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI('FINANCIAL_AUTO_' + sObject),
																data: oData,
																dataType: 'json',
																global: false,
																success: function(oResponse)
																{
																	if (oResponse.status == 'ER')
																	{
																		ns1blankspace.status.message('Error')
																	}
																	else
																	{
																		oParam.objectContext = oResponse[sObject];

																		var oData =
																		{
																			id: oResponse[sObject],
																			sourcebanktransaction: iBankTransactionID
																		}

																		$.ajax(
																		{
																			type: 'POST',
																			url: ns1blankspace.util.endpointURI('FINANCIAL_' + sObject + '_MANAGE'),
																			data: oData,
																			dataType: 'json',
																			global: false,
																			success: function(oResponse)
																			{
																				if (oResponse.status == 'ER')
																				{
																					ns1blankspace.status.message('Error')
																				}
																				else
																				{
																					oParam.xhtmlElementID = '-' + iBankTransactionID;
																					ns1blankspace.financial.bankAccount.import.items.match.create.finalise(oParam)
																				}	
																			}
																		});
																	}	
																}
															});
														},

														finalise: function (oParam)
														{
															//all done - does the amount of matching transactions equal

															var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;

															//status: 2 - change to 4
															var oData =
															{
																id: sID,
																status: 4,
																object: oParam.object,
																objectcontext: oParam.objectContext
															}

															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE'),
																data: oData,
																dataType: 'json',
																global: false,
																success: function(data)
																{
																	$('#ns1blankspaceFinancialImportItem_container-' + sID).hide();
																	$('#ns1blankspaceFinancialImportItem_options_edit_container-' + sID).hide();
																}
															});
														},

														transfer:
														{
															send: 	function(oParam)
																		{
																			if (oParam.amount == '')
																			{
																				ns1blankspace.status.error('No amount')
																			}
																			else
																			{
																				var oBankAccountFrom = ($.grep(ns1blankspace.financial.data.bankaccounts, function (a) { return a.id == oParam.bankAccountFrom;}))[0];
																				var oBankAccountTo = ($.grep(ns1blankspace.financial.data.bankaccounts, function (a) { return a.id == oParam.bankAccountTo;}))[0];

																				oParam.financialAccountFrom = oBankAccountFrom.financialaccount;
																				oParam.financialAccountTo = oBankAccountTo.financialaccount;

																				var oData =
																				{
																					journaldate: oParam.date,
																					description: 'Bank transfer from ' + oBankAccountFrom.title + ' to ' + oBankAccountTo.title,
																				}

																				if (oParam.description != '' && oParam.description != undefined) {oData.description = oParam.description}
																				
																				$.ajax(
																				{
																					type: 'POST',
																					url: ns1blankspace.util.endpointURI('FINANCIAL_GENERAL_JOURNAL_MANAGE'),
																					data: oData,
																					dataType: 'json',
																					success: function(data) {ns1blankspace.financial.bankAccount.import.items.match.create.transfer.process(oParam, data)}
																				});
																			}
																		},

															process: function(oParam, oResponse)
																		{
																			if (oResponse.status == 'OK')
																			{
																				oParam.id = oResponse.id;
																				ns1blankspace.financial.bankAccount.import.items.match.create.transfer.item(oParam);
																			}
																			else
																			{
																				ns1blankspace.status.error(oResponse.error.errornotes);
																			}
																		},

															item: 	function(oParam)
																		{
																			var iJournalID = ns1blankspace.util.getParam(oParam, 'id').value;
																			var iItemType = ns1blankspace.util.getParam(oParam, 'itemType', {"default": 1}).value;
																			var iType = ns1blankspace.util.getParam(oParam, 'type').value;
																			var cAmount = ns1blankspace.util.getParam(oParam, 'amount').value;

																			var oData =
																			{
																				generaljournal: iJournalID,
																				taxtype: 5,
																				taxcategory: iItemType
																			}	

																			if (iItemType == 1)
																			{	
																				oData.financialaccount = ns1blankspace.util.getParam(oParam, 'financialAccountFrom').value;
																				oData.creditamount = cAmount;
																				oData.credittax = 0;	
																			}
																			else
																			{
																				oData.financialaccount = ns1blankspace.util.getParam(oParam, 'financialAccountTo').value;
																				oData.debitamount = cAmount;
																				oData.debittax = 0;
																			}	
																						
																			$.ajax(
																			{
																				type: 'POST',
																				url: ns1blankspace.util.endpointURI('FINANCIAL_GENERAL_JOURNAL_ITEM_MANAGE'),
																				data: oData,
																				dataType: 'json',
																				success: function(oResponse)
																				{
																					if (iItemType == 1)
																					{
																						oParam.itemType = 2;
																						ns1blankspace.financial.bankAccount.import.items.match.create.transfer.item(oParam)
																					}
																					else
																					{	
																						oParam.objectContext = iJournalID;
																						ns1blankspace.financial.bankAccount.import.items.match.create.transfer.finalise(oParam)
																					}	
																				}
																			});
																		},

															finalise: function(oParam)
																		{
																			var iJournalID = ns1blankspace.util.getParam(oParam, 'id').value;

																			var oData =
																			{
																				id: iJournalID,
																				status: 2
																			}
																			
																			$.ajax(
																			{
																				type: 'POST',
																				url: ns1blankspace.util.endpointURI('FINANCIAL_GENERAL_JOURNAL_MANAGE'),
																				data: oData,
																				dataType: 'json',
																				success: function(data)
																				{
																					ns1blankspace.status.message('Created & matched');
																					ns1blankspace.financial.bankAccount.import.items.match.create.finalise(oParam);
																				}
																			});
																		}								
														},								

														show: function (oParam)
														{
															var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
															var sObject = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 2}).value;
															var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": 1}).value;
															var sLabel = (iType==2?'to <i>' + ns1blankspace.objectContextData.title + '</i> from':'from <i>' + ns1blankspace.objectContextData.title + '</i> to');
	
															var aHTML = [];

															var oTransaction = _.find(ns1blankspace.financial.bankAccount.import.items.match.data.transactions, function (transaction)
															{
																return transaction.id == sID
															});

															if (sObject == 'journal')
															{
																aHTML.push('<div style="margin:6px;"><div>Transfer ' + sLabel + '</div>');
																aHTML.push('<div class="ns1blankspaceSub" style="margin:6px;">');

																var iDefaultBankAccountFrom;
																
																$.each(ns1blankspace.financial.data.bankaccounts, function(ba, oBankAccount)
																{
																	if (oBankAccount.financialaccount !== '' && oBankAccount.id != ns1blankspace.objectContext)
																	{	
																		aHTML.push('<input type="radio" id="radioBankAccount' + this.id + '" name="radioBankAccount" value="' + this.id + '"/>' +
																						this.title + '<br />');	
																	}								
																});
								
																aHTML.push('</div>');

																aHTML.push('<div class="ns1blankspaceAction" id="ns1blankspaceBankAccountTransferSave">Save</div></div>');

																$('#ns1blankspaceFinancialImportItem_container_match_search_container-' + sID).html(aHTML.join(''));

																$('[name="radioBankAccount"]:first').attr('checked', true);

																$('#ns1blankspaceBankAccountTransferSave').button(
																{
																	label: "Save"
																})
																.click(function() 
																{
																	oParam.date = oTransaction.posteddate;
																	oParam.amount = Math.abs((oTransaction.amount).parseCurrency()).toFixed(2);
																	oParam.bankAccountFrom = (iType==2?$('[name="radioBankAccount"]:checked').val():ns1blankspace.objectContext);
																	oParam.bankAccountTo = (iType==2?ns1blankspace.objectContext:$('[name="radioBankAccount"]:checked').val());

																	ns1blankspace.financial.bankAccount.import.items.match.create.transfer.send(oParam);
																});
															}
															else
															{
																aHTML.push('<table style="margin-top:8px;"><tr class="ns1blankspace">' +
																					'<td class="ns1blankspaceNothing">You need to update the transaction information by clicking <i style="color:#c31d1d;">Not set</i> above.' +
																					' Once updated click Create again.</td>' +
																					'</tr></table>');

																$('#ns1blankspaceFinancialImportItem_container_match_search_container-' + sID).html(aHTML.join(''));
															}
														}

													},

												},					

									edit: 	function (oParam)
												{
													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
													var sKey = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
													var cAmount = ns1blankspace.util.getData(oParam, 'data-amount').value;
													var iType = ns1blankspace.util.getData(oParam, 'data-type').value;
													var iTaxType = ns1blankspace.util.getData(oParam, 'data-taxtype').value;
													var iFinancialAccount = ns1blankspace.util.getData(oParam, 'data-financialaccount').value;
													var sFinancialAccountText = ns1blankspace.util.getData(oParam, 'data-financialaccounttext').value;
													var sDescription = ns1blankspace.util.getData(oParam, 'data-description').value;
													var dDate = ns1blankspace.util.getData(oParam, 'data-date').value;
													var bSplit = ns1blankspace.util.getParam(oParam, 'split', {"default": false}).value;
													var iStatus = ns1blankspace.util.getData(oParam, 'data-status').value;

													var iContactBusiness = ns1blankspace.util.getData(oParam, 'data-contactbusiness').value;
													var sContactBusinessText = ns1blankspace.util.getData(oParam, 'data-contactbusinesstext').value;

													var iContactPerson = ns1blankspace.util.getData(oParam, 'data-contactperson').value;
													var sContactPersonText = ns1blankspace.util.getData(oParam, 'data-contactpersontext').value;

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
									
														aHTML.push('<table style="margin-left:25px; width:100px;">');
																
														aHTML.push('<tr><td id="ns1blankspaceImportEditSaveContainer"><span id="ns1blankspaceImportEditSave" class="ns1blankspaceAction">' +
																		'Save</span></td></tr>');

														if (iType == 2 && !bSplit)
														{
															aHTML.push('<tr><td id="ns1blankspaceImportEditSplitContainer" style="padding-top:10px;"><span id="ns1blankspaceImportEditSplit" class="ns1blankspaceAction">' +
																		'Split</span></td></tr>');
														}	
						
														aHTML.push('<tr><td id="ns1blankspaceImportEditAmountContainer" style="padding-top:15px;"></td></tr>');

														aHTML.push('</table>');					
														
														$('#ns1blankspaceImportEditColumn2').html(aHTML.join(''));
														
														$('#ns1blankspaceImportEditSave').button(
														{
															label: 'Create ' + (iType==1?'payment':'receipt')
														})
														.click(function()
														{		
															var iObject = 3;
															if (iType == 2) {iObject = 6}  //RECEIPT

															var cAmountReceipt = cAmount;
															var cAmountAsReceipts = 0;

															if ($('#ns1blankspaceItemAmount_' + sKey).length != 0)
															{
																cAmountReceipt = parseFloat($('#ns1blankspaceItemAmount_' + sKey).val());
																cAmountAsReceipts = parseFloat($('#ns1blankspaceItemAmount_' + sKey).attr('data-amountasreceipts'));
															}
															
															var cAmountRemaining = cAmount - cAmountReceipt - cAmountAsReceipts;

															if (cAmountRemaining < 0)
															{
																ns1blankspace.status.error('Amount is to large.')
															}	
															else
															{	
																$('#ns1blankspaceImportEditSaveContainer').html(ns1blankspace.xhtml.loadingSmall);

																ns1blankspace.financial.save.send(
																{
																	bankTransactionID: sKey,
																	date: dDate,
																	amount: cAmountReceipt,
																	description: $('#ns1blankspaceItemsEditDescription_' + sKey).val(),
																	contactBusiness: $('#ns1blankspaceItemsEditContactBusiness_' + sKey).attr('data-id'),
																	contactPerson: $('#ns1blankspaceItemsEditContactPerson_' + sKey).attr('data-id'),
																	financialAccount: $('#ns1blankspaceFinancialAccount_' + sKey).attr('data-id'),
																	object: iObject,
																	bankAccount: ns1blankspace.objectContext,
																	postSave: ns1blankspace.financial.bankAccount["import"].items.save.process,
																	showStatus: false,
																	itemStatus: (cAmountRemaining==0?4:7)
																});
															}
														})
														.css('width', '110px');

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
															oSearch.rows = 1000;
															oSearch.getResults(function(oResponse)
															{
																var cAmountAsReceipts = 0;

																$.each(oResponse.data.rows, function ()
																{
																	cAmountAsReceipts += parseFloat((this.amount).parseCurrency())
																});

																if (oResponse.data.rows.length == 0)
																{
																	var sHTML = 'There are no other receipts'
																}	
																else if (oResponse.data.rows.length == 1)
																{
																	var sHTML = 'There is one other receipt'
																}	
																else
																{
																	var sHTML = 'There are ' + oResponse.data.rows.length + ' other receipts'
																}	

																sHTML += ' associated with this bank transaction.'

																$('#ns1blankspaceImportEditSplitContainer').html('<span class="ns1blankspaceSub">' + sHTML + '</span>');

																$('#ns1blankspaceFinancialAccountContainer_' + sKey).after('<tr><td class="ns1blankspaceCaption">' +
																		'Amount' +
																		'</td></tr>' +
																		'<tr><td class="ns1blankspaceText">' +
																		'<input id="ns1blankspaceItemAmount_' + sKey + '" class="ns1blankspaceText">' +
																		'</td></tr>');

																	$('#ns1blankspaceItemAmount_' + sKey).val((cAmount - cAmountAsReceipts).formatMoney());

																	$('#ns1blankspaceItemAmount_' + sKey).attr('data-amountasreceipts', cAmountAsReceipts);

																	$('#ns1blankspaceItemAmount_' + sKey).keyup(function()
																	{
																		ns1blankspace.financial.util.tax.calculate(
																		{
																			amountXHTMLElementID: 'ns1blankspaceItemAmount_' + sKey,
																			amount: cAmount,
																			taxXHTMLElementID: 'ns1blankspaceItemTax_' + sKey,
																			taxTypeXHTMLElementName: 'radioTaxCode_' + sKey
																		});
																	});

															});
														})
														.css('width', '110px');

														if (iStatus == 7) {$('#ns1blankspaceImportEditSplit').click()}

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

														$('#ns1blankspaceItemsEditContactBusiness_' + sKey).attr('data-id', iContactBusiness);
														$('#ns1blankspaceItemsEditContactBusiness_' + sKey).val(sContactBusinessText);

														$('#ns1blankspaceItemsEditContactPerson_' + sKey).attr('data-id', iContactPerson);
														$('#ns1blankspaceItemsEditContactPerson_' + sKey).val(sContactPersonText);

														ns1blankspace.financial.util.tax.codes(
														{
															xhtmlElementID: 'ns1blankspaceFinancialTaxCode_' + sKey,
															xhtmlElementName: 'radioTaxCode_' + sKey,
															id: iTaxType,
															type: iType,
														});

														ns1blankspace.financial.util.tax.calculate(
														{
															amountXHTMLElementID: 'ns1blankspaceItemAmount_' + sKey,
															amount: cAmount,
															taxXHTMLElementID: 'ns1blankspaceItemTax_' + sKey,
															taxTypeXHTMLElementName: 'radioTaxCode_' + sKey
														});

														$('[name="radioTaxCode_' + sKey + '"]').click(function()
														{
															ns1blankspace.financial.util.tax.calculate(
															{
																amountXHTMLElementID: 'ns1blankspaceItemAmount_' + sKey,
																amount: cAmount,
																taxXHTMLElementID: 'ns1blankspaceItemTax_' + sKey,
																taxTypeXHTMLElementName: 'radioTaxCode_' + sKey
															});
														});
													}	
												},

									save: 	{
													process: function (oParam, oResponse)
																{
																	var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
																	var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext').value;
																	var iID = ns1blankspace.util.getParam(oParam, 'bankTransactionID').value;
																	var iItemStatus = ns1blankspace.util.getParam(oParam, 'itemStatus', {"default": 4}).value;

																	var oData =
																	{
																		id: iID,
																		status: iItemStatus
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
																		success: function(data)
																		{
																			ns1blankspace.financial.bankAccount["import"].items.save.reconcile(oParam)
																		}
																	});
																},

													reconcile:  function (oParam)
																{
																	var iID = ns1blankspace.util.getParam(oParam, 'bankTransactionID').value;

																	if (iID != undefined)
																	{
																		ns1blankspace.status.error('No bank transaction selected.')
																	}
																	else if (ns1blankspace.financial.bankAccount.reconcile.current.data.id !== undefined)
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
																				ns1blankspace.financial.bankAccount["import"].items.refresh(oParam);
																			}
																		});
																	}
																	else
																	{
																		ns1blankspace.financial.bankAccount["import"].items.refresh(oParam);
																	}
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
														success: function(oResponse)
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
													});
												}			
								}									
				},			

	reconcile: 	
				{
					show: 	function (oParam, oResponse)
								{
									var iMode = 1;
									var dBeforeDate = ns1blankspace.util.getParam(oParam, 'beforeDate', {"default": ''}).value;
									
									if (oParam === undefined) {oParam = {}}

									if (oParam != undefined)
									{
										if (oParam.mode != undefined) {iMode = oParam.mode}
									}	

									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
										oSearch.addField('statementbalance,statementdate,statustext,status,previousbalance,notes,reference');
										oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.addFilter('status', 'EQUAL_TO', iMode);

										if (dBeforeDate != '')
										{
											oSearch.addFilter('statementdate', 'LESS_THAN_OR_EQUAL_TO', dBeforeDate);
										}

										oSearch.sort('statementdate', 'desc');
										oSearch.rows = 20;
										oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.show(oParam, data)});
									}
									else
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspace">');

										aHTML.push('<tr class="ns1blankspaceRow"><td id="ns1blankspaceBankAccountColumnReconcile1" style="width: 100px;padding-right:5px;font-size:0.875em;" class="ns1blankspaceColumn1">' +
														ns1blankspace.xhtml.loading +
														'</td><td id="ns1blankspaceBankAccountColumnReconcile2" class="ns1blankspaceMainColumn2">' +
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
												ns1blankspace.financial.bankAccount.reconcile.current.refresh();

												aHTML.push('<table class="ns1blankspaceColumn2">' +
																'<tr><td class="ns1blankspaceNothing" style="width:300px;padding-right:20px;">All current reconciliations are shown.<br /><br />Click Completed to see past reconcilations.');
											}	

											aHTML.push('</table>');
										}
										else
										{
											aHTML.push('<table class="ns1blankspaceColumn2">' +
														'<tr><td class="ns1blankspaceNothing">The last 20 completed reconciliations are shown.</td></tr></table>')
										}	

										$('#ns1blankspaceBankAccountColumnReconcile2').html(aHTML.join(''));
																
										var aHTML = [];
										
										if (iMode == 1 && oResponse.data.rows.length == 0)
										{	
											aHTML.push('<table style="margin-bottom:7px;"><tr><td style="text-align:right;">' +
															'<span id="ns1blankspaceBankAccountRecoAdd" class="ns1blankspaceAction">Add</span>' +
															'</td></tr></table>');

											$('#ns1blankspaceBankAccountColumnReconcile1').html(aHTML.join(''));

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

										}					
										else
										{		
											aHTML.push('<table id="ns1blankspaceBankAccountReco" class="ns1blankspace">');

											if (iMode == 2)
											{
												aHTML.push('<tr><td class="ns1blankspaceDate" style="padding-bottom:4px;">');

												if (dBeforeDate != '')
												{
													aHTML.push('<input id="ns1blankspaceReconcilationeBeforeDate" class="ns1blankspaceDate" style="padding-left:3px; width:113px; font-size:0.725em;" value="' + dBeforeDate + '">')
												}
												else
												{
													aHTML.push('<input id="ns1blankspaceReconcilationeBeforeDate" class="ns1blankspaceDate ns1blankspaceWatermark" style="padding-left:3px; width:113px; font-size:0.725em;" value="Show if before">');
												}	
												aHTML.push('</td></tr>');
											}
											
											var oRows = oResponse.data.rows;
											
											$(oRows).each(function(i) 
											{
												aHTML.push(ns1blankspace.financial.bankAccount.reconcile.row(this));
											});
											
											aHTML.push('</table>');
											
											$('#ns1blankspaceBankAccountColumnReconcile1').html(aHTML.join(''));

											ns1blankspace.util.initDatePicker({select: '#ns1blankspaceReconcilationeBeforeDate'});

											$('#ns1blankspaceReconcilationeBeforeDate').change(function()
											{
												oParam = ns1blankspace.util.setParam(oParam, 'beforeDate', $('#ns1blankspaceReconcilationeBeforeDate').val());
												ns1blankspace.financial.bankAccount.reconcile.show(oParam)
											});
										
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
												oParam.type = 2;

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

											if (oResponse.data.rows.length == 1)
											{
												$('#ns1blankspaceBankAccountReco td.ns1blankspaceRowShaded').removeClass('ns1blankspaceRowShaded');
												$('#ns1blankspaceFinancialBankAccountReconcileRow-' + oResponse.data.rows[0].id).addClass('ns1blankspaceRowShaded');
												oParam.reconciliation = oResponse.data.rows[0].id;
												oParam.status = oResponse.data.rows[0].status;
												oParam.reconciliationEndDate = oResponse.data.rows[0].statementdate;
												ns1blankspace.financial.bankAccount.reconcile.items.show(oParam);
												ns1blankspace.financial.bankAccount.reconcile.refresh(oParam);
											}
										}	
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
														' style="text-align:right;">');

										if (oRow.notes != '...')
										{	
											aHTML.push('<div style="margin-bottom:0px;" id="ns1blankspaceFinancialBankAccountReconcile_notes-' + '-' + oRow.id + '" class="ns1blankspaceSub">' +
									 					oRow.notes + '</div>');
										}
										
										aHTML.push('<div style="margin-bottom:2px; font-style:italic;" id="ns1blankspaceFinancialBankAccountReconcile_reference-' + '-' + oRow.id + '" class="ns1blankspaceSub">' +
									 					oRow.reference + '</div>');

										aHTML.push('<div id="ns1blankspaceFinancialBankAccountReconcile_date-' +
														oRow.id  + '" class="ns1blankspaceSub">' + oRow.statementdate + '</div>' +
														'<div id="ns1blankspaceFinancialBankAccountReconcile_balance-' + '-' + oRow.id + '" class="ns1blankspaceSub">$' +
									 					oRow.statementbalance + '</div>');
									}
									else
									{
										aHTML.push('<td id="ns1blankspaceFinancialBankAccountReconcile_title-' + oRow.id + '" class="ns1blankspaceRowSelect ns1blankspaceBankAccountReconcileRowSelect"' +
															' style="text-align:right; color:black;"' +
															'>');

										if (oRow.notes != '...')
										{	
											aHTML.push('<div style="margin-bottom:8px;" id="ns1blankspaceFinancialBankAccountReconcile_notes-' + '-' + oRow.id + '" class="ns1blankspaceSub">' +
									 					oRow.notes + '</div>');
										}

										aHTML.push(oRow.statementdate + '<br /><span id="ns1blankspaceFinancialBankAccountReconcile_balance-' + oRow.id + '">$' +
									 					oRow.statementbalance + '</span>');
									}						
									
									aHTML.push('</td></tr>');
									aHTML.push('</table>');
									aHTML.push('</div>');
										
									aHTML.push('<div class="ns1blankspaceControlContext_reco_summary"' +
													' style="text-align:right;"' +
													' id="ns1blankspaceControlContext_reco_summary-' + oRow.id + '"' +
													' data-statementdate="' + oRow.statementbalance + '"></div>');
												
									aHTML.push('</td></tr>');
									
									return aHTML.join('');
								},

					current: {
									data: 		{},

									refresh:	function (oParam, oResponse)
												{
													if (oResponse === undefined)
													{
														var oSearch = new AdvancedSearch();
														oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
														oSearch.addField('statementbalance,statementdate,statustext,status,previousbalance,statementbalancecredits,statementbalancedebits');
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
									var bReset = true;
									var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": 2}).value;
									
									if (oParam != undefined)
									{
										if (oParam.reconciliation != undefined) {iReconciliation = oParam.reconciliation}
										if (oParam.status != undefined) {iStatus = oParam.status}
										if (oParam.mode != undefined) {iMode = oParam.mode}
										if (oParam.reset != undefined) {bReset = oParam.reset}
									}		

									if (oResponse == undefined)
									{
										if (bReset) {ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled = {}};

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
										//XXX Stop response local - for adjustment - ie local: true =, passed amount/object,
										// get oResponse from local data and then adjust/set/use

										var aHTML = [];

										aHTML.push('<div style="font-style:italic; margin-top: 4px; margin-right:3px; margin-bottom:7px; font-size:0.875em;" class="ns1blankspaceSub">' +
															'minus</div>')

										aHTML.push('<div style=" margin-right:3px; margin-bottom:7px; font-size:0.875em;" class="ns1blankspaceSub" title="Previous balance">' +
															'$' + (oResponse.PreviousBalance).parseCurrency().formatMoney(2, ".", ",")  + '</div>')

										var cReceipts = (oResponse.Receipts).parseCurrency() + (oResponse.DebitGeneralJournals).parseCurrency();
										var sCSSColor = '';
										var sTitle = 'Receipts, journal credits';

										var cStatementCredits = (oResponse.StatementBalanceCredits).parseCurrency();

										if (cReceipts.toFixed(2) != cStatementCredits && !(cReceipts == 0 || cStatementCredits == 0))
										{
											sCSSColor = ' color:red;'
											sTitle = '$' + (cReceipts - cStatementCredits).formatMoney(2, ".", ",")
										}

										aHTML.push('<div style="margin-right:3px; margin-bottom:7px; font-size:0.875em;' + sCSSColor + '" class="ns1blankspaceSub" title="' + sTitle + '">' +
															'+ $' + (cReceipts).formatMoney(2, ".", ",")  + '</div>');

										var cPayments = (oResponse.Payments).parseCurrency() + (oResponse.CreditGeneralJournals).parseCurrency();
										var sCSSColor = '';
										var sTitle = 'Payments, journal debits';

										var cStatementDebits = (oResponse.StatementBalanceDebits).parseCurrency();

										if (cPayments.toFixed(2) != cStatementDebits && !(cPayments == 0 || cStatementDebits == 0))
										{
											sCSSColor = ' color:red;'
											sTitle = '$' + (cPayments - cStatementDebits).formatMoney(2, ".", ",")
										}

										if (ns1blankspace.financial.bankAccount.reconcile.data == undefined)
										{
											ns1blankspace.financial.bankAccount.reconcile.data = {}
										}

										ns1blankspace.financial.bankAccount.reconcile.data.locked =
										{
											debits: cPayments,
											credits: cReceipts
										}

										aHTML.push('<div style="margin-right:3px; margin-bottom:7px; font-size:0.875em;' + sCSSColor + '" class="ns1blankspaceSub" title="' + sTitle + '">' +
															'- $' + (cPayments).formatMoney(2, ".", ",")  + '</div>');

										aHTML.push('<div style="font-style:italic; margin-right:3px; margin-bottom:7px; font-size:0.875em;" class="ns1blankspaceSub">' +
															'equals</div>')

										aHTML.push('<div style="margin-right:3px; margin-bottom:1px; font-size:0.875em;" class="ns1blankspaceSub">' +
															'$' + (oResponse.outofbalance).parseCurrency().formatMoney(2, ".", ",")  + '</div>')

										if (parseFloat((oResponse.outofbalance).parseCurrency()) !== 0)
										{	
											aHTML.push('<div style="margin-right:3px; margin-bottom:7px; font-size:0.875em;" class="ns1blankspaceSub">' +
															'out of balance</div>');
										}
										else
										{
											aHTML.push('<div style="margin-right:3px; margin-bottom:7px; font-size:0.875em;" class="ns1blankspaceSub">' +
															'balanced</div>')
										}

										if (iStatus == 1 & iMode == 1)
										{	
											aHTML.push('<div style="width: 20px; margin-left:5px; margin-right:2px; margin-bottom:10px; float:right;" class="ns1blankspaceBankAccountRecoRefresh" id="ns1blankspaceBankAccountRecoRefresh-' + iReconciliation + '">' +
															'Refresh</div>');

											aHTML.push('<div style="width: 20px; margin-left:5px; margin-right:2px; margin-bottom:10px; float:right;" class="ns1blankspaceBankAccountRecoEdit" id="ns1blankspaceBankAccountRecoEdit-' + iReconciliation + '">' +
															'Edit</div>');
										}

										if (iMode == 1 && iStatus == 1 && parseFloat((oResponse.outofbalance).parseCurrency()) == 0)
										{	
											aHTML.push('<div style="width:20px; margin-left:5px; margin-right:2px; margin-bottom:10px; float:right;" class="ns1blankspaceBankAccountRecoLock" id="ns1blankspaceBankAccountRecoLock-' + iReconciliation + '">' +
															'Lock</div>');
										}

										aHTML.push('<div style="text-align:right; margin-left:5px; margin-right:3px; margin-bottom:16px;" id="ns1blankspaceBankAccountColumnItemType">');
										
										aHTML.push('<input style="width: 100%;"  type="radio" id="ns1blankspaceBankAccountColumnItemType-2-' + iReconciliation + '" name="radioType"' +
														(iType==2?' checked="checked"':'') + '/><label for="ns1blankspaceBankAccountColumnItemType-2-' + iReconciliation + '" style="width: 90px; margin-bottom:1px;">' +
														'Incoming<br /><span style="font-weight:200">(Credits)</span></label>');

										aHTML.push('<input style="width: 100%;" type="radio" id="ns1blankspaceBankAccountColumnItemType-1-' + iReconciliation + '" name="radioType"' +
														(iType==1?' checked="checked"':'') + ' /><label for="ns1blankspaceBankAccountColumnItemType-1-' + iReconciliation + '" style="width:90px;">' +
														'Outgoing<br /><span style="font-weight:200">(Debits)</span></label>');
										
										aHTML.push('</div>');

										if (iMode == 1)
										{	
											aHTML.push('<div style="text-align:right; margin-left:5px; margin-right:3px; margin-bottom:5px;" id="ns1blankspaceBankAccountColumnItemMode">');											
											aHTML.push('<input style="width: 100%;" type="radio" id="ns1blankspaceBankAccountColumnItemMode-1-' + iReconciliation + '" name="radioMode" checked="checked" /><label for="ns1blankspaceBankAccountColumnItemMode-1-' + iReconciliation + '" style="width:90px; margin-bottom:1px;">' +
															'Unreconciled</label>');
											aHTML.push('<input style="width: 100%;" type="radio" id="ns1blankspaceBankAccountColumnItemMode-2-' + iReconciliation + '" name="radioMode" /><label for="ns1blankspaceBankAccountColumnItemMode-2-' + iReconciliation + '" style="width: 90px;">' +
															'Reconciled</label>');
											aHTML.push('</div>');
										}	

										$('#ns1blankspaceControlContext_reco_summary-' + iReconciliation).html(aHTML.join(''));

										ns1blankspace.financial.bankAccount.reconcile.unlock.init({reconciliation: iReconciliation});

										$('#ns1blankspaceBankAccountColumnItemType').buttonset().css('font-size', '0.75em');
										
										$('#ns1blankspaceBankAccountColumnItemType :radio').click(function()
										{
											var aID = (this.id).split('-');
											oParam = ns1blankspace.util.setParam(oParam, 'type', parseInt(aID[1]));
											oParam = ns1blankspace.util.setParam(oParam, 'reconciliation', parseInt(aID[2]));

											delete oParam.searchSourceID;
											delete oParam.searchDate;
											delete oParam.searchAmount;
											delete oParam.searchReference;
											delete oParam.searchDescription;

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

											delete oParam.searchSourceID;
											delete oParam.searchDate;
											delete oParam.searchAmount;
											delete oParam.searchReference;
											delete oParam.searchDescription;

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

										$('div.ns1blankspaceBankAccountRecoRefresh').button(
										{
											text: false,
											icons:
											{
												primary: "ui-icon-arrowrefresh-1-e"
											}
										})
										.click(function()
										{
											//oParam.reset = false;
											ns1blankspace.financial.bankAccount.reconcile.refresh(oParam);	
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
												success: function()
												{
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
														'Opening Balance' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceReconcileEditPreviousStatementBalance" class="ns1blankspaceText">' +
														'</td></tr>');
													
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Total Credits<br /><span class="ns1blankspaceSubNote">(optional)</span>' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceReconcileEditStatementCredits" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Total Debits<br /><span class="ns1blankspaceSubNote">(optional)</span>' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceReconcileEditStatementDebits" class="ns1blankspaceText">' +
														'</td></tr>');
																									
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Closing Balance' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceReconcileEditStatementBalance" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Closing Balance Date' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceReconcileEditStatementDate" class="ns1blankspaceDate">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Reference<br /><span class="ns1blankspaceSubNote">(ie Statement Number)</span>' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceReconcileEditStatementNotes" class="ns1blankspaceText">' +
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
											if ($('#ns1blankspaceReconcileEditStatementBalance').val() != '') {sData += '&statementbalance=' + ns1blankspace.util.fs($('#ns1blankspaceReconcileEditStatementBalance').val())}
											if ($('#ns1blankspaceReconcileEditPreviousStatementBalance').val() != '') {sData += '&previousbalance=' + ns1blankspace.util.fs($('#ns1blankspaceReconcileEditPreviousStatementBalance').val())}
											sData += '&notes=' + ns1blankspace.util.fs($('#ns1blankspaceReconcileEditStatementNotes').val());
											sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());

											if ($('#ns1blankspaceReconcileEditStatementCredits').val() != '')
											{
												sData += '&statementbalancecredits=' + ns1blankspace.util.fs($('#ns1blankspaceReconcileEditStatementCredits').val());
											}	

											if ($('#ns1blankspaceReconcileEditStatementDebits').val() != '')
											{
												sData += '&statementbalancedebits=' + ns1blankspace.util.fs($('#ns1blankspaceReconcileEditStatementDebits').val());
											}	
											
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
											oSearch.addField('statementbalance,statementdate,statustext,status,previousbalance,notes,statementbalancecredits,statementbalancedebits');
											oSearch.addFilter('id', 'EQUAL_TO', sID);
											oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.edit(oParam, data)});
										}
										else
										{
											$('[name="radioStatus"][value="1"]').attr('checked', true);
											
											var cAmount = ns1blankspace.objectContextData.lastreconciledamount;
											if (ns1blankspace.financial.bankAccount.reconcile.current.data.statementbalance != undefined)
											{
												cAmount = ns1blankspace.financial.bankAccount.reconcile.current.data.statementbalance
											}
											
											$('#ns1blankspaceReconcileEditPreviousStatementBalance').val(cAmount);
										}
									}
									else
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];
											$('#ns1blankspaceReconcileEditStatementDate').val(oObjectContext.statementdate);
											$('#ns1blankspaceReconcileEditStatementBalance').val(oObjectContext.statementbalance);
											$('#ns1blankspaceReconcileEditPreviousStatementBalance').val(oObjectContext.previousbalance);
											$('#ns1blankspaceReconcileEditStatementNotes').val(oObjectContext.notes);
											$('#ns1blankspaceReconcileEditStatementCredits').val(oObjectContext.statementbalancecredits);
											$('#ns1blankspaceReconcileEditStatementDebits').val(oObjectContext.statementbalancedebits);
											$('[name="radioStatus"][value="' + oObjectContext.status + '"]').attr('checked', true);
										}
									}
								},

						unlock:
								{
									init: function (oParam, oResponse)
									{
										//For now, can only unlock if no current reconciliation - ie only one at a time.

										var iReconciliation = ns1blankspace.util.getParam(oParam, 'reconciliation').value;

										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
											oSearch.addField('id');
											oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
											oSearch.addBracket('(');
											oSearch.addFilter('status', 'EQUAL_TO', 1);
											oSearch.addOperator('or');
											oSearch.addBracket('(');
											oSearch.addFilter('status', 'EQUAL_TO', 2);
											oSearch.addFilter('id', 'GREATER_THAN', iReconciliation);
											oSearch.addBracket(')');
											oSearch.addBracket(')');
											oSearch.rows = 1;
											oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.unlock.init(oParam, data)});
										}
										else
										{
											if (oResponse.data.rows.length == 0)
											{
												ns1blankspace.financial.bankAccount.reconcile.unlock.show(oParam)
											}
										}
									},

									show: function (oParam, oResponse)
									{
										var iReconciliation = ns1blankspace.util.getParam(oParam, 'reconciliation').value;

										$('#ns1blankspaceBankAccountColumnItemType').before(
											'<div style="width:20px; margin-left:5px; margin-right:2px; margin-bottom:10px; float:right;" ' +
												'class="ns1blankspaceBankAccountRecoLock" id="ns1blankspaceBankAccountRecoUnlock-' + iReconciliation + '">' +
												'Unlock</div>');

										$('#ns1blankspaceBankAccountRecoUnlock-' + iReconciliation).button(
										{
											text: false,
											icons:
											{
												primary: "ui-icon-unlocked"
											}
										})
										.click(function()
										{
											ns1blankspace.status.working();
												
											var aID = (this.id).split('-');
												
											var oData = 
											{	
												id: aID[1],
												status: 1
											}	
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_RECONCILIATION_MANAGE'),
												data: oData,
												dataType: 'json',
												success: function()
												{
													ns1blankspace.financial.bankAccount.init({id: ns1blankspace.objectContext});
													ns1blankspace.status.message('Reconciliation unlocked.');
												}
											});
										})
										.css('font-size', '0.75em');
									}
								},		

						items: 	
								{	
									data: 	{unreconciled: {}},

									show:		function (oParam, oResponse)
												{
													var sXHTMLElementID;
													var iObjectContext = ns1blankspace.objectContext;
													var oOptions = {view: true, remove: true, automation: true};
													var oActions = {add: true};
													var iReconciliation;
													var dReconciliationEndDate;
													var iType = 2;
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
																		'<td id="ns1blankspaceBankAccountReconcileColumnItem" class="ns1blankspaceColumn2x" style="width:150px; font-size:0.875em; border-leftx-style:solid; border-width:1px; border-color:#B8B8B8; padding-left:7px;"></td>' +
																		'<td id="ns1blankspaceBankAccountReconcileColumnItemEdit" class="ns1blankspaceColumn2" style="font-size:0.875em; border-left-style:solid; border-width:1px; border-color:#B8B8B8; padding-left:7px;"></td>' +
																		'</tr></table>');			
													
														$('#ns1blankspaceBankAccountColumnReconcile2').html(aHTML.join(''));
														
														$('#ns1blankspaceBankAccountReconcileColumnItem').html(ns1blankspace.xhtml.loadingSmall);
														
														var oSearch = new AdvancedSearch();
														
														oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
														oSearch.addField('description,amount,posteddate,taxtype,financialaccount,financialaccounttext,' +
																			'contactbusiness,contactbusinesstext,contactperson,contactpersontext');
														oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
														//include 4
														oSearch.addFilter('status', 'IN_LIST', '3,4');
														oSearch.addFilter('category', 'EQUAL_TO', (iType==1?2:1));
														oSearch.addFilter('posteddate', 'LESS_THAN_OR_EQUAL_TO', dReconciliationEndDate);
														oSearch.sort('posteddate', 'asc');
														oSearch.rows = 1000;
														oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.reconcile.items.show(oParam, data)});		
													}
													else
													{		
														var aHTML = [];
															
														aHTML.push('<div class="ns1blankspaceHeaderCaption" style="width: 150px;margin-right:10px;margin-bottom:3px;">');
														aHTML.push('<span style="font-size:1.25em;">AT BANK</span>');
														aHTML.push('</div>');

														aHTML.push('<div id="ns1blankspaceBankAccountReconcileItems" style="width: 150px;margin-bottom:3px;"></div>');
														
														$('#ns1blankspaceBankAccountReconcileColumnItem').html(aHTML.join(''));
														
														$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html('<span class="ns1blankspaceAction" id="ns1blankspaceShowAll"></span>' +
															'<div class="ns1blankspaceSub" style="padding-left:6px; padding-top:16px; width:50%;">Before reconciling it is recommended that you check for any existing ' +
																(iType==1?'<a href="/#/financial.payment" target="_blank">unallocated payments</a>':'<a href="/#/financial.receipt" target="_blank">unallocated receipts</a>') + '.</div>');

														$('#ns1blankspaceShowAll').button({
															label: 'Show All Unreconciled ' + (iType==1?'Payments':'Receipts') + ' & Journals',
														})
														.click(function() {
															$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html('');
															oParam = ns1blankspace.util.setParam(oParam, 'editAction', 1);
															oParam = ns1blankspace.util.setParam(oParam, 'step', 0);
															ns1blankspace.financial.bankAccount.reconcile.items.init(oParam);
														});	

														var aHTML = [];	

														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<table id="ns1blankspaceReconcileItems"><tr class="ns1blankspace">');

															aHTML.push('<td class="ns1blankspaceNothing">There are no imported bank ' + (iType==1?'debit':'credit') +
																	' transactions requiring reconcilitation.<br /><br />If you haven\'t aready, you can either import transactions from a file or reconcile from a statement.' +
																	'<br /><br /></td>');
																			
															aHTML.push('</tr></table>');

															$('#ns1blankspaceBankAccountReconcileItems').html(aHTML.join(''));				
														}
														else
														{
															//$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html('<span class="ns1blankspaceSub">Select a bank transaction.</span>');

															aHTML.push('<table id="ns1blankspaceReconcileItems">');
															
															$.each(oResponse.data.rows, function()
															{
																aHTML.push(
																	'<tr class="ns1blankspaceRow">' +
																	'<td class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceReconcileItemsMatch" id="ns1blankspaceReconcileItems_options_search-' + this.id + '"' +
																					' data-searchDate="' + this.posteddate + '"' +
																					' data-searchAmount="' + Math.abs((this.amount).parseCurrency()).toFixed(2) + '"' +
																					' data-amount="' + Math.abs((this.amount).parseCurrency()).toFixed(2) + '"' +
																					' data-trantype="' + (this.amount<0?1:2) + '"' +
																					' data-taxtype="' + this.taxtype + '"' +
																					' data-financialaccount="' + this.financialaccount + '"' +
																					' data-financialaccounttext="' + this.financialaccounttext + '"' +
																					' data-description="' + this.description + '"' +
																					' data-date="' + this.posteddate + '"' +
																					' data-contactbusiness="' + this.contactbusiness + '"' +
																					' data-contactbusinesstext="' + this.contactbusinesstext + '"' +
																					' data-contactperson="' + this.contactperson + '"' +
																					' data-contactpersontext="' + this.contactpersontext + '"' +
																					' class="ns1blankspaceReconcileItemsMatch">' +
																	'<table cellspacing=0 cellpadding=0><tr>');
																				
																aHTML.push('<td id="ns1blankspaceReconcileItems_date-' + this.id + '" class="recoitemstatement">' +
																							this.posteddate + '</td>');
																	
																
																aHTML.push('<td id="ns1blankspaceReconcileItems_amount-' + this.id + '" style="text-align:right;"' +
																						' class="recoitem">' +
																						Math.abs((this.amount).parseCurrency()).formatMoney(2, ".", ",") + '</td>');
																	
																aHTML.push('</tr><tr><td colspan=2 id="ns1blankspaceRecocileItems_description-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																						' class="recoitem">' +
																						this.description + '</td>');

																aHTML.push('</tr><tr><td colspan=2 id="ns1blankspaceRecocileItems_allocated-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																						'></td>');
																			
																aHTML.push('</tr></table></td>');	
																				
																aHTML.push('</tr>');
															});
															
															aHTML.push('</table>');

															$('#ns1blankspaceBankAccountReconcileItems').html(aHTML.join(''));
														
															$('#ns1blankspaceReconcileItems .ns1blankspaceReconcileItemsMatch')
															.click(function()
															{
																$('#ns1blankspaceReconcileItems td.ns1blankspaceRowShaded').removeClass('ns1blankspaceRowShaded');
																$('td', $('#' + this.id).closest('tr')).addClass('ns1blankspaceRowShaded');
																var aID = (this.id).split('-');

																var sDescription = $(this).attr("data-description");
																var oDescription = sDescription.split(' ');
																var sSearchReference = ''

																if ($(this).attr("data-trantype") != '1')
																{
																	$.each(oDescription, function (d, description)
																	{
																		$.each(['INV', 'inv'], function (r, replace)
																		{
																			description = description.replace(replace, '');
																			description = description.replace('XX', '');
																		});
																		if (!isNaN(description) && description != '') {sSearchReference = description}
																	});
																}	

																$.extend(true, oParam,
																{
																	sourceXHTMLElementID: this.id,
																	searchSourceID: aID[1],
																	searchDate: $(this).attr("data-searchDate"),
																	searchAmount: $(this).attr("data-searchAmount"),
																	searchReference: sSearchReference,
																	searchDescription: sDescription,
																	step: 0
																});

																$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html('');

																oParam.onComplete = ns1blankspace.financial.bankAccount.reconcile.items.init;
																ns1blankspace.financial.bankAccount.reconcile.items.refresh(oParam);
															})
															.css('width', '20px')
															.css('height', '17px')
														}
													}	
												},

									refresh: function (oParam, oResponse)
												{
													var sSourceXHTMLElementID = ns1blankspace.util.getParam(oParam, 'sourceXHTMLElementID').value;
													var iTransactionID = ns1blankspace.util.getParam(oParam, 'sourceXHTMLElementID', {index: 1}).value;
													var iType = ns1blankspace.util.getParam(oParam, 'type').value;
													var cAmount = parseFloat(ns1blankspace.util.getData(oParam, 'data-amount', {param: 'sourceXHTMLElementID', "default": 0}).value);
													var iStep = ns1blankspace.util.getParam(oParam, 'refreshStep', {"default": 1}).value;

													if (iStep == 1)
													{
														ns1blankspace.financial.bankAccount.reconcile.items.data.current = {};

														var oSearch = new AdvancedSearch();
														oSearch.method = (iType==1?'FINANCIAL_PAYMENT_SEARCH':'FINANCIAL_RECEIPT_SEARCH');
														oSearch.addField('amount');	
														oSearch.addFilter('sourcebanktransaction', 'EQUAL_TO', iTransactionID);
														oSearch.rows = 1000;
														oSearch.getResults(function(data)
														{
															oParam = ns1blankspace.util.setParam(oParam, 'refreshStep', 2);
															ns1blankspace.financial.bankAccount.reconcile.items.refresh(oParam, data)
														});
													}
													else if (iStep == 2)
													{
														ns1blankspace.financial.bankAccount.reconcile.items.data.current.items = oResponse.data.rows;

														var oSearch = new AdvancedSearch();
														oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_ITEM_SEARCH';
														oSearch.addField('debitamount,creditamount');
														oSearch.addFilter('sourcebanktransaction', 'EQUAL_TO', iTransactionID);
														oSearch.rows = 1000;
														oSearch.getResults(function(data)
														{
															oParam = ns1blankspace.util.setParam(oParam, 'refreshStep', 3);
															ns1blankspace.financial.bankAccount.reconcile.items.refresh(oParam, data)
														});
													}
													else if (iStep == 3)
													{
														delete oParam.refreshStep;

														var cAllocated = 0;

														$.each(oResponse.data.rows, function (r, row)
														{
															ns1blankspace.financial.bankAccount.reconcile.items.data.current.items.push(
															{
																amount: row[(iType==1?'credit':'debit') + 'amount']
															})
														});

														$.each(ns1blankspace.financial.bankAccount.reconcile.items.data.current.items, function ()
														{
															cAllocated += (this.amount).parseCurrency();
														});

														cAllocated = numeral(cAllocated).format('0.00');
														cAllocated = numeral(cAllocated).value();

														$('#' + sSourceXHTMLElementID).attr('data-allocatedAmount', cAllocated);

														var oData = {}
														if ((cAmount - cAllocated) <= 0) {oData.status = 2}
														if (oParam.contactBusiness != undefined) {oData.contactbusiness = oParam.contactBusiness}
														if (oParam.contactPerson != undefined) {oData.contactperson = oParam.contactPerson}

														if (!_.isEmpty(oData))
														{
															oData.id = iTransactionID;

															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE'),
																data: oData,
																dataType: 'json',
																success: function(data) {}
															});
														}

														if ((cAmount - cAllocated) <= 0)
														{
															if ($('td.ns1blankspaceReconcileItemsMatch').length == 1)
															{
																ns1blankspace.financial.bankAccount.reconcile.items.show(oParam)
															}
															else
															{
																$('#ns1blankspaceReconcileItems_options_search-' + iTransactionID).fadeOut(500);
															}

															ns1blankspace.status.message('Reconciled');
														}
														else
														{	
															$('#' + sSourceXHTMLElementID).attr('data-unallocatedAmount', (cAmount - cAllocated).toFixed(2));
															$('#ns1blankspaceRecocileItems_allocated-' + iTransactionID).html('$' + (cAllocated).formatMoney() + ' allocated' +
																			'<br />$' + (cAmount - cAllocated).formatMoney() + ' unallocated');
															ns1blankspace.status.message('');
														}

														ns1blankspace.util.onComplete(oParam);
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

									init: 	function(oParam, oResponse)
												{
													var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 0}).value;
													var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": 1}).value;
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
															oSearch.rows = 1000;
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
																oSearch.addFilter('generaljournalitem.generaljournal.status', 'EQUAL_TO', 2);
																oSearch.addFilter('financialaccount', 'EQUAL_TO', ns1blankspace.objectContextData.financialaccount);
																oSearch.addFilter('generaljournalitem.generaljournal.journaldate', 'LESS_THAN_OR_EQUAL_TO', dReconciliationEndDate);
																oSearch.rows = 1000;
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

									transfer:
												{
													show:		function (oParam)
																{
																	var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": 1}).value;
																	var sLabel = (iType==2?'to <i>' + ns1blankspace.objectContextData.title + '</i> from':'from <i>' + ns1blankspace.objectContextData.title + '</i> to');
																
																	var aHTML = [];
										
																	aHTML.push('<table class="ns1blankspace">');

																	aHTML.push('<tr class="ns1blankspace">' +
																		'<td class="ns1blankspaceCaption">' +
																		'Create a bank transfer ' + sLabel +
																		'</td></tr>' +
																		'<tr class="ns1blankspaceRadio">' +
																		'<td id="ns1blankspaceBankAccountTransferFrom" class="ns1blankspaceRadio">');
													
																	var iDefaultBankAccount;
																	
																	$.each(ns1blankspace.financial.data.bankaccounts, function()
																	{
																		if (this.financialaccount !== '' && this.id != ns1blankspace.objectContext)
																		{	
																			if (iDefaultBankAccount == undefined) {iDefaultBankAccount = this.id}
																			aHTML.push('<input type="radio" id="radioTransferBankAccount' + this.id + '" name="radioTransferBankAccount" value="' + this.id + '"/>' +
																							this.title + '<br />');	
																		}								
																	});
									
																	aHTML.push('</td></tr>');

																	aHTML.push('<tr><td style="margin-top:14px;" id="ns1blankspaceReconcileItemsEditSave">' +
																					'<span id="ns1blankspaceReconcileItemsTransferSave" class="ns1blankspaceAction">Save</span>' +
																					'</td></tr>');

																	aHTML.push('</table>');	

																	$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html(aHTML.join(''));

																	$('[name="radioTransferBankAccount"][value="' + iDefaultBankAccount + '"]').attr('checked', true);

																	$('#ns1blankspaceReconcileItemsTransferSave').button(
																	{
																		label: 'Save'	
																	})
																	.click(function()
																	{
																		ns1blankspace.financial.bankAccount.reconcile.items.transfer.data = [];

																		$.extend(true, oParam, 
																		{
																			bankAccountFrom: ns1blankspace.objectContext,
																			bankAccountTo: $('input[name="radioTransferBankAccount"]:checked').val(),
																			amount: oParam.searchAmount,
																			date: oParam.searchDate,
																			onComplete: ns1blankspace.financial.bankAccount.reconcile.items.transfer.process,
																			persistData: ns1blankspace.financial.bankAccount.reconcile.items.transfer.data
																		});

																		if (iType == 2)
																		{
																			oParam.bankAccountTo = ns1blankspace.objectContext;
																			oParam.bankAccountFrom = $('input[name="radioTransferBankAccount"]:checked').val();
																		}

																		delete oParam.itemType;

																		ns1blankspace.financial.bankAccount.transfer.save.send(oParam);
																	})
																	.css('font-size', '0.875em');
																},
																
													process: function (oParam, oReponse)
																{
																	var aItem = ns1blankspace.financial.bankAccount.reconcile.items.transfer.data[0];

																	if (aItem != undefined)
																	{
																		var iID = aItem.id;
																		oParam.editAction = 3;
																		oParam.xhtmlElementID = 'ns1blankspaceReconcileItems_options_add-' + iID + '-journal';
																		ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
																	}

																	$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html('');
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

													var sLabel = (iType==2?'Receipt':'Payment');
													if (iSource == 2)	{sLabel = (iType==2?'Invoice':'Expense')}
													
													$.extend(true, oParam, {editAction: iEditAction, source: iSource, type: iType});
															
													if ($('#' + sXHTMLElementContainerID).html() == '')
													{
														var aHTML = [];

														//aHTML.push('<div class="ns1blankspaceHeaderCaption" style="width: 100%;margin-right:10px;margin-bottom:3px;">');
														//aHTML.push('<span style="font-size:1.25em;">THIS SPACE</span>');
														//aHTML.push('</div>');
														
														aHTML.push('<table class="ns1blankspaceContainer">' +
																		'<tr class="ns1blankspaceContainer">' +
																		'<td id="ns1blankspaceReconcileItemEdit1"></td>' +
																		'<td id="ns1blankspaceReconcileItemEdit2" style="width:90px; border-left-style:solid; border-width:0px; border-color:#B8B8B8; padding-left:7px;"></td>' +
																		'</tr>' +
																		'</table>');			
													
														$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html(aHTML.join(''));
														
														var aHTML = [];

														aHTML.push('<div id="ns1blankspaceReconcileItemEditOption" style="width:196;margin-bottom:3px;text-align:left;">');

														if (iType == 1)  //DEBITS (OUT)
														{	
															aHTML.push('<input type="radio" id="ns1blankspaceReconcileItemEdit-1" name="radioEdit" /><label for="ns1blankspaceReconcileItemEdit-1" style="width: 130px;">' +
																			'Payments & Journals</label>');

															aHTML.push('<input type="radio" id="ns1blankspaceReconcileItemEdit-2" name="radioEdit" /><label for="ns1blankspaceReconcileItemEdit-2" style="width: 135px;">' +
																			'Outstanding Expenses</label>');
														}
														else if (iType == 2) //CREDITS (IN)
														{
															aHTML.push('<input type="radio" id="ns1blankspaceReconcileItemEdit-1" name="radioEdit" /><label for="ns1blankspaceReconcileItemEdit-1" style="width: 130px;">' +
																			'Receipts & Journals</label>');

															aHTML.push('<input type="radio" id="ns1blankspaceReconcileItemEdit-2" name="radioEdit" /><label for="ns1blankspaceReconcileItemEdit-2" style="width:135px;">' +
																			'Unpaid&nbsp;Invoices</label>');
														}

														aHTML.push('</div>');
													
														aHTML.push('<div id="ns1blankspaceReconcileItemsEdit"></div>');
														
														$('#ns1blankspaceReconcileItemEdit1').html(aHTML.join(''));

														$('#ns1blankspaceReconcileItemEdit-' + iSource).attr('checked', 'checked');
		
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
																		'<span style="width:93%;" id="ns1blankspaceItemsEditSearch">Search</span>' +
																		'</td></tr>');

														aHTML.push('<tr><td class="ns1blankspaceAction">' +
																		'<span style="width:93%;" id="ns1blankspaceItemsEditClearSearch">Clear</span>' +
																		'</td></tr>');

														if (iSearchSourceID != undefined && ((iSource == 1 && ns1blankspace.financial.data.settings.taxreportcalculationmethod == 1) ||
																iSource == 2))
														{	
															aHTML.push('<tr><td class="ns1blankspaceCaption" style="padding-top:15px;">' +
																		'Reconcile as<br />a new' +
																		'</td></tr>');

															aHTML.push('<tr><td class="ns1blankspaceAction">' +
																		'<span style="width:93%;" id="ns1blankspaceItemsEditAdd">' + sLabel + '</span>' +
																		'</td></tr>');

															if (iSource==1)
															{
																aHTML.push('<tr><td class="ns1blankspaceAction">' +
																		'<span style="width:93%;" id="ns1blankspaceItemsEditAddTransfer">Bank Transfer</span>' +
																		'</td></tr>');
															}
														}	
														
														aHTML.push('</table>');					
														
														$('#ns1blankspaceReconcileItemEdit2').html(aHTML.join(''));
													
														$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});
										
														$('#ns1blankspaceItemsEditSearchDate').val(dSearchDate);
														$('#ns1blankspaceItemsEditSearchAmount').val(cSearchAmount);
														$('#ns1blankspaceItemsEditSearchReference').val(sSearchReference);
																
														$('#ns1blankspaceItemsEditSearchReference')

														$('#ns1blankspaceItemsEditSearchReference').keyup(function(e)
														{
															if (e.which === 13)
													    	{
																oParam.editAction = 1;
																oParam.searchDate = $('#ns1blankspaceItemsEditSearchDate').val();
																oParam.searchAmount = $('#ns1blankspaceItemsEditSearchAmount').val();
																oParam.searchReference = $('#ns1blankspaceItemsEditSearchReference').val();
																ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
															}		
														});	

														$('#ns1blankspaceItemsEditSearch').button(
														{
															label: 'Search',
															icons: false
														})
														.click(function() 
														{
															oParam.editAction = 1;
															oParam.searchDate = $('#ns1blankspaceItemsEditSearchDate').val();
															oParam.searchAmount = $('#ns1blankspaceItemsEditSearchAmount').val();
															oParam.searchReference = $('#ns1blankspaceItemsEditSearchReference').val();
															ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
														})

														$('#ns1blankspaceItemsEditClearSearch').button(
														{
															label: 'Clear',
															icons: false
														})
														.click(function()
														{
															oParam.editAction = 1;
															oParam.searchDate = '';
															oParam.searchAmount = '';
															oParam.searchReference = '';

															$('#ns1blankspaceItemsEditSearchDate').val('')
															$('#ns1blankspaceItemsEditSearchAmount').val('');
															$('#ns1blankspaceItemsEditSearchReference').val('');

															//ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
														})

														$('#ns1blankspaceItemsEditAdd').button(
														{
															label: sLabel,
															icons: false
														})
														.click(function()
														{
															$.extend(true, oParam, {editAction: 4});
															ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
														});

														$('#ns1blankspaceItemsEditAddTransfer').button(
														{
															label: 'Bank Transfer',
															icons: false
														})
														.click(function()
														{
															ns1blankspace.financial.bankAccount.reconcile.items.transfer.show(oParam);
														});
														
														$('#ns1blankspaceReconcileItemsEdit').html(ns1blankspace.xhtml.loadingSmall);
													}
													
													if (iEditAction == 1)  
													{
														if (iSource == 1) //SHOW PAYMENT/RECEIPT & JOURNALS
														{	
															var iTaxCategory = (iType==1?2:1);
															var sJournalType = (iType==1?'credit':'debit');
															var sClass = (iType == 1?'debits':'credits')
															var sType = (iType == 1?'payments':'receipts')

															var oJournals = $.grep(ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled.journals,
																				function (a) {return a[sJournalType + 'amount'] != 0;});

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
																					(sSearchReference !== ''?_.includes(a.reference, sSearchReference):false) ||
																					(sSearchReference !== ''?_.includes(a.description, sSearchReference):false) ||
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
																		sHTML += ' that closely match this bank transaction.  If you just added payment or journal then please reclick the Reconcile link.';
																		sHTML += '<br /><br />You can search for an outstanding expense,<br />add a new one.';
																	}	
																}
																else if (iType == 2)
																{
																	var sHTML = 'There are no unreconciled receipts or journals';

																	if (iSearchSourceID)
																	{
																		sHTML += '<br / >that match this bank transaction. If you just added payment or journal then please reclick the Reconcile link.';
																		sHTML += '<br /><br />You can search for an unpaid invoice,<br />add a new one.';
																	}	
																}	

																aHTML.push('<table style="margin-top:8px;"><tr class="ns1blankspace">' +
																				'<td class="ns1blankspaceNothing">' + sHTML + '</td>' +
																				'</tr></table>');

																aHTML.push('<table style="margin-top:6px;"><tr class="ns1blankspace" >' +
																				'<td><span class="ns1blankspaceAction" id="TODOns1blankspaceCheckIfReconciled"></span></td>' +
																				'</tr></table>');

																$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));

																$('#ns1blankspaceCheckIfReconciled').button(
																{
																	label: 'Check if already reconciled',
																})
																.click(function()
																{
																	ns1blankspace.status.message('Checking...')
																});
															}
															else
															{

																ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass + '-searched'].sort(ns1blankspace.util.sortBy('dateSort'));

																aHTML.push('<table id="ns1blankspaceReconcileItemsEdit">');
																
																$.each(ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled[sClass + '-searched'], function()
																{
																	aHTML.push(
																		'<tr class="ns1blankspaceRow">' +
																		'<td class="ns1blankspaceRow">' +
																		'<table cellspacing=0 cellpadding=0><tr>');
																					
																		aHTML.push('<td id="ns1blankspaceReconcileItems_date-' + this.id + '-1" class="recoitempayment">' +
																								ns1blankspace.util.fd(this.date) + '</td>');

																		aHTML.push('<td id="ns1blankspaceReconcileItems_amount-' + this.id + '" style="text-align:right;"' +
																								' class="recoitem">' +
																								this.amount + '</td>');																					
																		
																		var sDescription = this.description + (this.type=='journal'?' (' + this.type + ')':'');

																		aHTML.push('</tr><tr><td colspan=2 id="ns1blankspaceReconcileItems_reference-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																							' class="recoitem" title="' + this.reference + '">' +
																							sDescription + '</td>');
																					
																	aHTML.push('</tr></table></td>');	
																		
																	//if (iStatus == 1 && iSearchSourceID != undefined)
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
																.click(function()
																{
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
																	oSearch.addField('reference,description,amount,paymentduedate,outstandingamount,contactbusinesspaidtotext,contactpersonpaidtotext,' +
																								'contactbusinesspaidto,contactpersonpaidto');
																	if (dSearchDate != '')
																	{
																		oSearch.addFilter('paymentduedate', 'LESS_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(30).toString("dd-MMM-yyyy"))
																		oSearch.addFilter('paymentduedate', 'GREATER_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-365).toString("dd-MMM-yyyy"))
																	}		
																	oSearch.sort('paymentduedate', 'asc');

																	if (sSearchReference != '')
																	{
																		oSearch.addBracket('(');
																		oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchReference);
																		oSearch.addOperator('or');
																		oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchReference);
																		oSearch.addOperator('or');
																		oSearch.addFilter('expense.contactbusinesspaidto.tradename', 'TEXT_IS_LIKE', sSearchReference);
																		oSearch.addOperator('or');
																		oSearch.addFilter('expense.contactpersonpaidto.surname', 'TEXT_IS_LIKE', sSearchReference);
																		oSearch.addOperator('or');
																		oSearch.addFilter('expense.contactpersonpaidto.firstname', 'TEXT_IS_LIKE', sSearchReference);
																		oSearch.addBracket(')');
																	}
																}	
																else
																{
																	oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
																	oSearch.addField('reference,description,amount,duedate,outstandingamount,contactbusinesssenttotext,contactpersonsenttotext,' +
																								'contactbusinesssentto,contactpersonsentto');
																	if (dSearchDate)
																	{
																		oSearch.addFilter('duedate', 'LESS_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(30).toString("dd-MMM-yyyy"))
																		oSearch.addFilter('duedate', 'GREATER_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-365).toString("dd-MMM-yyyy"))
																	}
																	oSearch.sort('duedate', 'asc');

																	if (sSearchReference != '')
																	{
																		oSearch.addBracket('(');
																		oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchReference);
																		oSearch.addOperator('or');
																		oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchReference);
																		oSearch.addOperator('or');
																		oSearch.addFilter('invoice.contactbusinesssentto.tradename', 'TEXT_IS_LIKE', sSearchReference);
																		oSearch.addOperator('or');
																		oSearch.addFilter('invoice.contactpersonsentto.surname', 'TEXT_IS_LIKE', sSearchReference);
																		oSearch.addOperator('or');
																		oSearch.addFilter('invoice.contactpersonsentto.firstname', 'TEXT_IS_LIKE', sSearchReference);
																		oSearch.addBracket(')');
																	}
																}
															
																if (cSearchAmount != '') {oSearch.addFilter('outstandingamount', 'GREATER_THAN_OR_EQUAL_TO', cSearchAmount)}

																oSearch.addFilter('outstandingamount', 'GREATER_THAN', 0)
																
																oSearch.rows = (sSearchReference == ''?50:1000);
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
																			'<td class="ns1blankspaceRow">' +
																			'<table cellspacing=0 cellpadding=0><tr>');
																						
																			if (this.paymentduedate)
																			{				
																				aHTML.push('<td id="ns1blankspaceReconcileItems_date-' + this.id + '-1" class="recoitempayment">' +
																									ns1blankspace.util.fd(this.paymentduedate) + '</td>');
																			}
																			else if (this.duedate)
																			{
																				aHTML.push('<td id="tdRecoItems_date-' + this.id + '-2" class="recoitemreceipt">' +
																									ns1blankspace.util.fd(this.duedate) + '</td>');
																			}							
																			
																			aHTML.push('<td id="ns1blankspaceReconcileItems_amount-' + this.id + '" style="text-align:right;"' +
																								' class="recoitem">' +
																								this.outstandingamount + '</td>');
																			
																			var sDescription = '';
																			var iContactBusiness = '';
																			var iContactPerson = '';

																			if (this.description != '')
																			{
																				sDescription += this.description + '<br />';
																			}	

																			if (iType === 1)
																			{
																				iContactBusiness = this.contactbusinesspaidto;
																				iContactPerson = this.contactpersonpaidto;

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
																				iContactBusiness = this.contactbusinesssentto;
																				iContactPerson = this.contactpersonsentto;

																				if (this.contactbusinesssenttotext !== '')
																				{
																					sDescription += this.contactbusinesssenttotext + '<br />';
																				}

																				if (this.contactpersonsenttotext !== '')
																				{
																					sDescription += this.contactpersonsenttotext + '<br />';
																				}
																			}

																			sDescription += '$' + this.amount + ' / ' + this.reference;

																			aHTML.push('</tr><tr><td colspan=2 id="ns1blankspaceReconcileItems_reference-' + this.id + '" style="font-size:0.75;color:#B8B8B8"' +
																								' class="recoitem" title="' + this.reference + '">' +
																								sDescription + '</td>');
																						
																		aHTML.push('</tr></table></td>');	
																			

																		if (iStatus == 1 && iSearchSourceID != undefined)
																		{					
																			aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																			aHTML.push('<span id="ns1blankspaceReconcileItems_options_add-' + this.id + '-' + iType + '"' +
																							' data-amount="' + this.amount + '"' +
																							' data-outstandingamount="' + this.outstandingamount + '"' +
																							' data-contactbusiness="' + iContactBusiness + '"' +
																							' data-contactperson="' + iContactPerson + '"' +
																							' class="ns1blankspaceReconcileItemsAdd"></span>');
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
																	.click(function()
																	{
																		oParam.editAction = 5;
																		oParam.xhtmlElementID = this.id;
																		oParam.outstandingAmount = $(this).attr('data-outstandingamount');
																		oParam.contactBusiness = $(this).attr('data-contactbusiness');
																		oParam.contactPerson = $(this).attr('data-contactperson');
																		oParam.object = undefined;
																		ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
																		$(this).parent().html('');
																	})
																	.css('width', '15px')
																	.css('height', '17px')
																}		
															}	
														}
													}	

													else if (iEditAction == 3)  //MARK PAYMENT / RECEIPT / EXPENSE / INVOICE / JOURNAL AS RECONCILED
													{
														ns1blankspace.status.working();

														delete oParam.editAction;
														delete oParam.id;

														var aXHTMLElementID = sXHTMLElementID.split('-');
														var oData = {reconciliation: iReconciliation};
														var bAllUsed = ns1blankspace.util.getParam(oParam, 'allused', {"default": true}).value;
														var bReset = true;

														if (iObject === undefined || bReset)
														{	
															if (aXHTMLElementID[2] == 'payment') {iObject = 3}
															if (aXHTMLElementID[2] == 'receipt') {iObject = 6}
															if (aXHTMLElementID[2] == 'journal') {iObject = 122}

															iObjectContext = aXHTMLElementID[1];
														}
														
														oData.object = iObject;
														oData.objectcontext = iObjectContext;
														oData.sourcebanktransaction = iSearchSourceID;	

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_RECONCILIATION_ITEM_MANAGE'),
															data: oData,
															dataType: 'json',
															success: function(data)
															{
																//if ($('#' + sXHTMLElementID).length == 0)

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

																ns1blankspace.status.message('Reconciled');

																if (iSearchSourceID !== undefined)
																{	
																	if (bAllUsed)
																	{
																		$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html('')
																	}
																	else
																	{
																		$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
																	}	

																	oParam.reset = false;
																	oParam.onComplete = ns1blankspace.financial.bankAccount.reconcile.refresh;
																	ns1blankspace.financial.bankAccount.reconcile.items.refresh(oParam);		
																}
																else
																{
																	$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
																	oParam.reset = false;
																	ns1blankspace.financial.bankAccount.reconcile.refresh(oParam);
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
																				' data-columns="firstname-space-surname"' +
																				' data-parent="ns1blankspaceItemContactBusiness"' +
																				' data-parent-search-id="contactbusiness"' +
																				' data-parent-search-text="tradename">' +
																			'</td></tr>');

															aHTML.push('<tr class="ns1blankspaceCaption">' +
																			'<td class="ns1blankspaceCaption">' +
																			'<div style="float:left;" class="ns1blankspaceCaption">Financial Account&nbsp;</div>' +
																			'<div style="float:right; margin-top:8px;">' +
																				'<span style="font-weight:normal; font-size:0.625em; text-align:right; margin-right:4px;">All</span>' +
																				'<input type="checkbox" id="ns1blankspaceItemFinancialAccountAll" style="margin:0px; padding:0px; border: 0px;">' +
																			'</div>'	+
																			'</td></tr>' +
																			'<tr class="ns1blankspace">' +
																			'<td class="ns1blankspaceText">' +
																			'<input id="ns1blankspaceItemFinancialAccount" class="ns1blankspaceText">' +
																			'</td></tr>');
															
															aHTML.push('<tr><td style="padding-bottom:5px;" id="ns1blankspaceItemFinancialAccountSearchResults">' +
																			'<span class="ns1blankspaceSub" style="font-size:0.75em;">Press <i>enter</i> to see all accounts or just start typing.</span></td></tr>');

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
															
															aHTML.push('</table>');					
														
															$('#ns1blankspaceReconcileItemsEdit').html(aHTML.join(''));
														
															$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});

															var iTaxType = 1;
															var iTranType = (iType==1?2:1);

															if (ns1blankspace.util.param(oParam, 'sourceXHTMLElementID').exists)
															{	
																$('#ns1blankspaceItemDate').val(ns1blankspace.util.getData(oParam, 'data-date', {param: 'sourceXHTMLElementID'}).value);
																$('#ns1blankspaceItemAmount').val(ns1blankspace.util.getData(oParam, 'data-unallocatedAmount', {param: 'sourceXHTMLElementID'}).value);
																$('#ns1blankspaceItemDescription').val(ns1blankspace.util.getData(oParam, 'data-description', {param: 'sourceXHTMLElementID'}).value);
																$('#ns1blankspaceItemFinancialAccount').val(ns1blankspace.util.getData(oParam, 'data-financialaccounttext', {param: 'sourceXHTMLElementID'}).value);
																$('#ns1blankspaceItemFinancialAccount').attr('data-id', ns1blankspace.util.getData(oParam, 'data-financialaccount', {param: 'sourceXHTMLElementID'}).value);
																$('#ns1blankspaceItemContactBusiness').val(ns1blankspace.util.getData(oParam, 'data-contactbusinesstext', {param: 'sourceXHTMLElementID'}).value);
																$('#ns1blankspaceItemContactBusiness').attr('data-id', ns1blankspace.util.getData(oParam, 'data-contactbusiness', {param: 'sourceXHTMLElementID'}).value);
																$('#ns1blankspaceItemContactPerson').val(ns1blankspace.util.getData(oParam, 'data-contactpersontext', {param: 'sourceXHTMLElementID'}).value);
																$('#ns1blankspaceItemContactPerson').attr('data-id', ns1blankspace.util.getData(oParam, 'data-contactperson', {param: 'sourceXHTMLElementID'}).value);
																iTaxType = ns1blankspace.util.getData(oParam, 'data-taxtype', {param: 'sourceXHTMLElementID'}).value;
																//iTranType = ns1blankspace.util.getData(oParam, 'data-trantype', {param: 'sourceXHTMLElementID'}).value;
															}
															else
															{
																$('#ns1blankspaceItemDate').val(dSearchDate);
																$('#ns1blankspaceItemAmount').val(cSearchAmount);
															}

															if (iTranType == undefined) {iTranType = 1}
															if (iTaxType == 'undefined') {iTaxType = 1}

															ns1blankspace.financial.util.tax.codes(
															{
																xhtmlElementID: 'ns1blankspaceItemTaxCode',
																id: iTaxType,
																type: iTranType,
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

															ns1blankspace.financial.util.tax.calculate(
															{
																amountXHTMLElementID: 'ns1blankspaceItemAmount',
																taxXHTMLElementID: 'ns1blankspaceItemTax',
																taxTypeXHTMLElementName: 'radioItemTaxCode'
															});

															$('#ns1blankspaceItemFinancialAccount').keyup(function()
															{
																oParam = ns1blankspace.util.setParam(oParam, 'search', $(this).val());
																if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
																ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.bankAccount.reconcile.items.account(' + JSON.stringify(oParam) + ')', ns1blankspace.option.typingWait);
															});

															var aHTML = [];
															
															aHTML.push('<table class="ns1blankspaceColumn2">');
															
															aHTML.push('<tr><td id="ns1blankspaceReconcileItemsEditSave">' +
																			'<span id="ns1blankspaceReconcileItemsEditSave" class="ns1blankspaceAction">Save</span>' +
																			'</td></tr>');

															aHTML.push('<tr><td style="padding-top:10px;">' +
																			'<label for="ns1blankspaceReconcileItemsEditRemember">Remember as mapping</label>' +
																			'<br /><input type="checkbox" id="ns1blankspaceReconcileItemsEditRemember" class="ns1blankspaceAction">' +
																			'</td></tr>');

															aHTML.push('</table>');					
															
															$('#ns1blankspaceReconcileItemEdit2').html(aHTML.join(''));
														
															$('#ns1blankspaceReconcileItemsEditSave').button(
															{
																label: 'Save'	
															})
															.click(function()
															{
																delete oParam.outstandingAmount;

																if (iType == 1 && iSource == 1) {iObject = 3}  //PAYMENT
																if (iType == 1 && iSource == 2) {iObject = 2}  //EXPENSE
																if (iType == 2 && iSource == 1) {iObject = 6}  //RECEIPT
																if (iType == 2 && iSource == 2) {iObject = 5}  //INVOICE

																oParam = ns1blankspace.util.setParam(oParam, 'date', $('#ns1blankspaceItemDate').val());
																oParam = ns1blankspace.util.setParam(oParam, 'description', $('#ns1blankspaceItemDescription').val());
																oParam = ns1blankspace.util.setParam(oParam, 'contactBusiness', $('#ns1blankspaceItemContactBusiness').attr('data-id'));
																oParam = ns1blankspace.util.setParam(oParam, 'contactPerson', $('#ns1blankspaceItemContactPerson').attr('data-id'));
																oParam = ns1blankspace.util.setParam(oParam, 'account', $('#ns1blankspaceItemFinancialAccount').attr('data-id'));
																oParam = ns1blankspace.util.setParam(oParam, 'amount', $('#ns1blankspaceItemAmount').val());
																oParam = ns1blankspace.util.setParam(oParam, 'object', iObject);
																oParam = ns1blankspace.util.setParam(oParam, 'bankAccount', ns1blankspace.objectContext);
																oParam = ns1blankspace.util.setParam(oParam, 'taxType', $('input[name="radioItemTaxCode"]:checked').val());
																oParam = ns1blankspace.util.setParam(oParam, 'postSave', ns1blankspace.financial.bankAccount.reconcile.items.edit);

																if ($('#ns1blankspaceReconcileItemsEditRemember:checked').length != 0)
																{
																	ns1blankspace.financial.bankAccount.reconcile.items.remember(oParam);
																}

																$('#ns1blankspaceBankAccountReconcileColumnItemEdit').html('');

																ns1blankspace.financial.save.send(oParam);
															})
															.css('font-size', '0.875em');
														}
														else
														{
															if (iSource == 1)
															{
																oParam.xhtmlElementID = '-' + (oParam.objectContext);
																oParam.editAction = 3;
																ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
															}
															else
															{	
																oParam.xhtmlElementID = '-' + (oParam.objectContext);
																oParam.editAction = 5;
																ns1blankspace.financial.bankAccount.reconcile.items.edit(oParam);
															}	
														}
													}

													else if (iEditAction == 5)  //PAY EXISTING EXPENSE OR RECEIPT INVOICE & THEN RECONCILE
													{
														ns1blankspace.status.working((iType==1?'creating payment':'creating receipt') + '..');

														var cOutstandingAmount;

														if (oParam != undefined)
														{
															if (oParam.outstandingAmount != undefined) {cOutstandingAmount = oParam.outstandingAmount}
														}		

														var aXHTMLElementID = sXHTMLElementID.split('-');
														
														if (cOutstandingAmount !== undefined) {cOutstandingAmount = cOutstandingAmount.parseCurrency()}

														if (iSearchSourceID !== undefined)
														{
															var oSearchSource = $('#ns1blankspaceReconcileItems_options_search-' + iSearchSourceID);
															var dDate = oSearchSource.attr('data-searchDate');  

															var dLast = Date.parse(ns1blankspace.financial.data.settings['lockeddate' + (iType==1?'creditors':'debtors')]);
															var dSet = Date.parse(dDate);

															if (dSet.compareTo(dLast) != 1)
															{	
																dDate = dLast.add({days: 1});
															}

															var cAmount = oSearchSource.attr('data-searchAmount');
															var cAllocatedAmount = oSearchSource.attr('data-allocatedAmount');
															if (cAllocatedAmount != '')
															{
																cAmount = cAmount - cAllocatedAmount;
																if (cAmount < 0) {cAmount = 0}
																cAmount = parseFloat(cAmount);
															}	
														}
														else
														{
															var dDate = ns1blankspace.util.getParam(oParam, 'date').value;
															if (dDate == undefined) {dDate = ns1blankspace.util.getParam(oParam, 'reconciliationEndDate').value};
															if (dDate == undefined) {dDate = Date.today().toString("dd-MMM-yyyy")};
															var cAmount = cOutstandingAmount;
														}

														if (cOutstandingAmount !== undefined?cAmount > cOutstandingAmount:false)
														{
															//ns1blankspace.status.error('Bank transaction amount is to large!');
															oParam.allused = false;
															cAmount = cOutstandingAmount;
														}
														else
														{
															oParam.allused = true;
														}

														//if (oParam != undefined)
														//{
														//	if (oParam.amount != undefined) {cAmount = oParam.amount}
														//	if (oParam.date != undefined) {dDate = oParam.date}	
														//}
															
														var sData = 'id=' + ns1blankspace.util.fs(aXHTMLElementID[1]);
														sData += '&amount=' + ns1blankspace.util.fs(cAmount);
														sData += '&receiptdate=' + ns1blankspace.util.fs(dDate);
														sData += '&paiddate=' + ns1blankspace.util.fs(dDate);
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
																	oParam.objectContext = (iType==1?data.payment:data.receipt);
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
												},

									remember: 	function(oParam)
												{
													ns1blankspace.status.working();

													var oData = 
													{
														mapfrom: (ns1blankspace.util.getParam(oParam, 'type').value==1?2:1),
														descriptionmatchtype: 1,
														mapfromdescription: ns1blankspace.util.getParam(oParam, 'description').value,
														maptofinancialaccount: ns1blankspace.util.getParam(oParam, 'account').value,
														taxtype: ns1blankspace.util.getParam(oParam, 'taxType').value,
														maptocontactperson: ns1blankspace.util.getParam(oParam, 'contactPerson').value,
														maptocontactbusiness: ns1blankspace.util.getParam(oParam, 'contactBusiness').value,
													}
														
													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MAPPING_MANAGE'),
														data: oData,
														dataType: 'json',
														success: function(oResponse)
														{
															ns1blankspace.status.message('Mapping saved');
															ns1blankspace.util.onComplete(oParam);
														}
													});
												},		

									locked: 	function(oParam, oResponse)
												{
													var iType = 2;
													var iSource = 1;
													var iStatus = 2;
													var dSearchDate;
													var cSearchAmount;
													var sSearchReference;
													var bItem = false;
													var iReconciliation;

													if (ns1blankspace.financial.bankAccount.reconcile.items.data.reconciled == undefined)
													{
														ns1blankspace.financial.bankAccount.reconcile.items.data.reconciled = {}
													}

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
																		'<span style="width:95px;" id="ns1blankspaceItemsLockedSearch">Search</span>' +
																		'</td></tr>');

														aHTML.push('<tr><td class="ns1blankspaceAction">' +
																		'<span style="width:95px;" id="ns1blankspaceItemsLockedClearSearch">Clear</span>' +
																		'</td></tr>');

														aHTML.push('</table>');	

														aHTML.push('<table style="width:100%;">' +
																			'<tr><td style="padding-top:14px;" class="ns1blankspaceAction">' +
																			'<div style="width:95px;" id="ns1blankspaceFinancialBankAccountHealthCheck"' +
																			' data-date="' + oParam.reconciliationEndDate + '">' +
																			'Check GL</div></td></tr>' +
																			'<tr><td class="ns1blankspaceSub" id="ns1blankspaceFinancialBankAccountHealthCheckContainer" style="padding-top:6px;">' +
																			'</td></tr>' +
																			'</table>');
														
														$('#ns1blankspaceReconcileItemLocked2').html(aHTML.join(''));
													
														$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});
										
														$('#ns1blankspaceItemsLockedSearchDate').val(dSearchDate);
														$('#ns1blankspaceItemsLockedSearchAmount').val(cSearchAmount);
														$('#ns1blankspaceItemsLockedSearchReference').val(sSearchReference);
																
														$('#ns1blankspaceFinancialBankAccountHealthCheck').button(
														{
															label: 'Check GL',
															icons:
															{
																primary: "ui-icon-clipboard"
															}
														}).click(function ()
														{
															ns1blankspace.financial.bankAccount.healthCheck.init(
															{
																reconciliation: iReconciliation,
																reconciliationStatementDate: $(this).attr('data-date'),
																xhtmlElementID: 'ns1blankspaceFinancialBankAccountHealthCheckContainer'
															})
														});
																
														$('#ns1blankspaceItemsLockedSearch').button(
														{
															label: 'Search',
															icons:
															{
																primary: "ui-icon-search"
															}
														})
														.click(function()
														{
															oParam.searchDate = $('#ns1blankspaceItemsLockedSearchDate').val();
															oParam.searchAmount = $('#ns1blankspaceItemsLockedSearchAmount').val();
															oParam.searchReference = $('#ns1blankspaceItemsLockedSearchReference').val();
															ns1blankspace.financial.bankAccount.reconcile.items.locked(oParam);
														})

														$('#ns1blankspaceItemsLockedClearSearch').button({
															label: 'Clear',
															icons:
															{
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
																oSearch.addField('reference,description,amount,paiddate,reconciliation,contactbusinesspaidtotext,contactpersonpaidtotext' +
																						',sourcebanktransaction,payment.sourcebanktransaction.notes,payment.sourcebanktransaction.amount' +
																						',payment.sourcebanktransaction.posteddate');
																if (dSearchDate) {oSearch.addFilter('paiddate', 'GREATER_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-7).toString("dd-MMM-yyyy"))}
																oSearch.sort('paiddate', 'asc');
															}	
															else
															{
																oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
																oSearch.addField('reference,description,amount,receiveddate,reconciliation,contactbusinessreceivedfromtext,contactpersonreceivedfromtext' +
																						',sourcebanktransaction,receipt.sourcebanktransaction.notes,receipt.sourcebanktransaction.amount' +
																						',receipt.sourcebanktransaction.posteddate');
																if (dSearchDate) {oSearch.addFilter('receiveddate', 'GREATER_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-7).toString("dd-MMM-yyyy"))}
																oSearch.sort('receiveddate', 'asc');
															}

															if (cSearchAmount) {oSearch.addFilter('amount', 'APPROX_EQUAL_TO', cSearchAmount)}
															if (sSearchReference) {oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchReference)}	
														}
														else
														{
															oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_ITEM_SEARCH';
															oSearch.addField('creditamount,debitamount,generaljournalitem.generaljournal.reference,generaljournalitem.generaljournal.description' +
																					',generaljournalitem.generaljournal.journaldate' +
																					',sourcebanktransaction,generaljournalitem.sourcebanktransaction.notes' +
																					',generaljournalitem.sourcebanktransaction.amount,generaljournalitem.sourcebanktransaction.posteddate');
															
															if (dSearchDate) {oSearch.addFilter('generaljournalitem.generaljournal.journaldate', 'LESS_THAN_OR_EQUAL_TO', Date.parse(dSearchDate).addDays(-7).toString("dd-MMM-yyyy"))}
															
															if (cSearchAmount) {oSearch.addFilter((iType==1?'creditamount':'debitamount'), 'APPROX_EQUAL_TO', cSearchAmount)}
															
															//oSearch.addFilter('taxcategory', 'EQUAL_TO', (iType==1?2:1));
															oSearch.addFilter((iType==1?'creditamount':'debitamount'), 'NOT_EQUAL_TO', 0);

															oSearch.sort('generaljournalitem.generaljournal.journaldate', 'asc');

															if (sSearchReference) {oSearch.addFilter('generaljournalitem.generaljournal.reference', 'TEXT_IS_LIKE', sSearchReference)}
														}	

														oSearch.addFilter('reconciliation', 'EQUAL_TO', iReconciliation);
														oSearch.rows = 1000;

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
															
															var items = oResponse.data.rows;

															ns1blankspace.financial.bankAccount.reconcile.items.data.reconciled['items'] = items;

															if (bItem)
															{	
																$.each(items, function()
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
															}
															else
															{
																_.each(items, function (item)
																{
																	if (item.sourcebanktransaction == 0)
																	{
																		item.sourcebanktransaction = -1 * item.id
																	}
																});

																var sourceBankTransactions = _.groupBy(items, 'sourcebanktransaction');
																
																ns1blankspace.financial.bankAccount.reconcile.items.data.reconciled['transactions'] = sourceBankTransactions;

																if (iSource == 1)
																{
																	iNamespace = iType;
																}
																else
																{
																	iNamespace = iSource;
																}

																var namespace = 
																{
																	1: 'payment',
																	2: 'receipt',
																	3: 'generaljournalitem' 
																}

																var bankTransactions = [];

																_.each(sourceBankTransactions, function(value, id)
																{
																	bankTransactions.push(_.first(value))
																});

																bankTransactions = _.sortBy(bankTransactions, function(transaction)
																{ return new Date(transaction[namespace[iNamespace] + '.sourcebanktransaction.posteddate']) });

																_.each(bankTransactions, function(value)
																{
																	var transaction = value;
																	var cAmount = parseFloat(Math.abs((transaction[namespace[iNamespace] + '.sourcebanktransaction.amount']).parseCurrency())).formatMoney();
																	var sNotes = transaction[namespace[iNamespace] + '.sourcebanktransaction.notes'];
																	var sDate = transaction[namespace[iNamespace] + '.sourcebanktransaction.posteddate'];
																	var sourceBankTransaction = sourceBankTransactions[value.sourcebanktransaction];
																	var sReference = _.join(_.map(sourceBankTransaction, 'reference'), ', ');
																	var id = value.sourcebanktransaction;
																	var sReferenceLinks = _.join(_.map(sourceBankTransaction, function (transaction)
																	{
																		return '<span class="ns1blankspaceViewLink" id="-' + transaction.id + '" title="' + transaction.amount + '">' + transaction.reference + '</span>'
																	}), ', ');

																	var sContext = '';

																	if (iNamespace == 1)
																	{
																		sContext = 'paidto'
																	}

																	if (iNamespace == 2)
																	{
																		sContext = 'receivedfrom'
																	}

																	var sContactBusiness = transaction['contactbusiness' + sContext + 'text'];
																	if (sContactBusiness == '') {sContactBusiness = transaction['contactbusiness' + sContext + 'text']}
																	if (sContactBusiness == '') {sContactBusiness = '<span class="ns1blankspaceSubNote">Not linked to a contact.</span>'}

																	if (sDate == '')
																	{
																		if (iNamespace == 1)
																		{
																			sDate = transaction['paiddate']
																		}

																		if (iNamespace == 2)
																		{
																			sDate = transaction['receiveddate']
																		}

																		if (iNamespace == 3)
																		{
																			sDate = transaction['generaljournalitem.generaljournal.journaldate']
																		}

																		sDate = ns1blankspace.util.fd(sDate)
																	}

																	if (value.sourcebanktransaction > 0)
																	{
																		aHTML.push(
																			'<tr class="ns1blankspaceRow">' +
																				'<td class="ns1blankspaceRow">' +
																					'<table cellspacing=0 cellpadding=0>' +
																						'<tr>' +
																							'<td id="ns1blankspaceReconcileItems_date-' + id + '-3" class="recoitemstatement">' +
																								'<div style="font-weight:100;font-size:1.2em;">' + sDate + '</div>' + 
																								'<div style="padding-top:4px;">' + sNotes + '</div>' +
																							'</td>' +
																							'<td id="ns1blankspaceReconcileItems_amount-' + id + '" style="text-align:right; font-weight:100; font-size:1.2em;"' +
																								' class="recoitem">' + cAmount +
																							'</td>' +
																						'</tr>' +
																					'</table>' +
																				'</td>');
																	}
																	else
																	{
																		aHTML.push(
																			'<tr class="ns1blankspaceRow">' +
																				'<td class="ns1blankspaceRow">' +
																				'<div style="font-weight:100;font-size:1.2em;">' + sDate + '</div>' +
																					'<div class="ns1blankspaceSub" style="padding-top:3px;">No imported bank transaction.</div>' +
																				'</td>');
																	}	

																	if (iNamespace == 3)
																	{
																		cAmount = transaction['creditamount'];
																		if (cAmount == 0) {cAmount = transaction['debitamount']}

																		aHTML.push(
																				'<td class="ns1blankspaceRow" style="width:50%;">' +
																					'<table cellspacing=0 cellpadding=0 style="border-left-style:solid; border-width:1px; border-color:#B8B8B8; padding-left:10px;">' +
																						'<tr>' +
																							'<td id="ns1blankspaceReconcileItems_reference-' + id + '" style="font-weight:100;font-size:1.2em; color:#999999;" class="recoitem">' +
																								transaction['generaljournalitem.generaljournal.description'] +
																							'</td>' +
																							'<td style="text-align:right; font-size:1.2em;" class="ns1blankspaceSub">' +
																								numeral(cAmount).format('(0,0.00)') +
																							'</td>' +
																						'<tr>');

																		aHTML.push('</table></td>');

																		if (iStatus == 1)
																		{					
																			aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																			aHTML.push('<span id="ns1blankspaceReconcileItems_options_remove-' + id + '-' + iNamespace + '"' +
																							' data-amount="' + cAmount + '" data-class="transaction" data-namespace="' + namespace[iNamespace] + '"' +
																							' data-id="' + id + '"' +
																							' class="ns1blankspaceReconcileItemsRemove"></span>');
																			aHTML.push('</td>');
																			
																		}
																	}
																	else
																	{
																		if (transaction.amount != undefined)
																		{
																			aHTML.push(
																				'<td class="ns1blankspaceRow">' +
																					'<table cellspacing=0 cellpadding=0 style="border-left-style:solid; border-width:1px; border-color:#B8B8B8; padding-left:10px;">' +
																						'<tr>' +
																							'<td id="ns1blankspaceReconcileItems_reference-' + id + '" style="font-weight:100;font-size:1.2em; color:#999999;" class="recoitem">' +
																								sContactBusiness +
																							'</td>' +
																							'<td style="text-align:right; font-size:1.2em;" class="ns1blankspaceSub">' +
																								numeral(_.sum(_.map(sourceBankTransaction, function (t) {return numeral(t.amount).value()}))).format('(0,0.00)') +
																							'</td>' +
																						'<tr>');
																		

																			aHTML.push(_.join(_.map(sourceBankTransaction, function (transaction)
																			{
																				return '<tr><td class="ns1blankspaceSub ns1blankspaceViewLink" style="color:#999999;" id="-' + transaction.id + '">' + transaction.reference + '</td><td style="text-align:right;" class="ns1blankspaceSub">' + (_.size(sourceBankTransaction)>1?transaction.amount:'') + '</td></tr>'
																			}), ''));
																							
																			aHTML.push('</table></td>');	

																			if (iStatus == 1)
																			{					
																				aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
																				aHTML.push('<span id="ns1blankspaceReconcileItems_options_remove-' + id + '-' + iNamespace + '"' +
																								' data-amount="' + cAmount + '" data-class="transaction" data-namespace="' + namespace[iNamespace] + '"' +
																								' data-id="' + id + '"' +
																								' class="ns1blankspaceReconcileItemsRemove"></span>');
																				aHTML.push('</td>');
																				
																			}
																		}	
																	}	

																	aHTML.push('</tr>');
																});

																aHTML.push('</table>');	
															}

															$('#ns1blankspaceReconcileItemsLocked').html(aHTML.join(''));

															$('.ns1blankspaceReconcileItemsRemove').button(
															{
																text: false,
															 	icons: {primary: "ui-icon-close"}
															})
															.click(function()
															{
																oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', this.id);
																oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElement', this);
																oParam = ns1blankspace.util.setParam(oParam, 'itemIndex', 0);
																ns1blankspace.financial.bankAccount.reconcile.items.unreconcile(oParam);
															})
															.css('width', '15px')
															.css('height', '20px');
														}

														$('#ns1blankspaceReconcileItemsLocked td.ns1blankspaceViewLink').click(function()
														{
															ns1blankspace.financial[namespace[iNamespace]].init({id: (this.id).split('-')[1]})
														});
													}
												},

									account: function (oParam)
												{
													var iType = ns1blankspace.util.getParam(oParam, 'type').value
													var iFinancialAccountType = iType;
													var sSearch = ns1blankspace.util.getParam(oParam, 'search').value;

													if (sSearch == '')
													{
														var oData = $.grep(ns1blankspace.financial.data.accounts, function (a)
														{ 
															if ($('#ns1blankspaceItemFinancialAccountAll').prop('checked') == true)
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

													var aHTML = [];
					
													if (oData.length == 0)	
													{
														aHTML.push('<table class="ns1blankspace">' +
																		'<tr><td class="ns1blankspaceNothing">No accounts.</td></tr>' + 
																		'</table>');

														$('#ns1blankspaceItemFinancialAccountSearchResults').html(aHTML.join(''));		
													}
													else
													{	
														aHTML.push('<table class="ns1blankspace">');
														
														$.each(oData, function() 
														{ 
															aHTML.push('<tr class="ns1blankspaceRow">'+ 
																			'<td id="ns1blankspaceItem_title-' + this.id + '-' + this.taxtype + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																			this.title + '</td></tr>');	
														});
														
														aHTML.push('</table>');

														$('#ns1blankspaceItemFinancialAccountSearchResults').html(aHTML.join(''))
														
														$('.ns1blankspaceRowSelect')
														.click(function()
														{
															var sID = this.id;
															var aID = sID.split('-');

															$('#ns1blankspaceItemFinancialAccount').attr('data-id', aID[1]);
															$('#ns1blankspaceItemFinancialAccount').val($(this).html());
															$('#ns1blankspaceItemFinancialAccountSearchResults').html('');

															if (aID[2] != '')
															{
																$('[name="radioItemTaxCode"][value="' + aID[2] + '"]').attr('checked', true);

																ns1blankspace.financial.util.tax.calculate(
																{
																	amountXHTMLElementID: 'ns1blankspaceItemAmount',
																	taxXHTMLElementID: 'ns1blankspaceItemTax',
																	taxTypeXHTMLElementName: 'radioItemTaxCode'
																});
															}

														});
													}
												},			

									unreconcile:
												function (oParam)
												{
													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
													var oXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElement').value;
													var iItemIndex = ns1blankspace.util.getParam(oParam, 'itemIndex', {"default": 0}).value;
													var iReconciliation = ns1blankspace.util.getParam(oParam, 'reconciliation').value;

													var aXHTMLElementID = sXHTMLElementID.split('-');
													var oData = $(oXHTMLElementID).data();
													var iTransactionID = oData.id;
													var iObject = 122;

													if (aXHTMLElementID[2] == 1) {iObject = 3};
													if (aXHTMLElementID[2] == 2) {iObject = 6};

													ns1blankspace.status.working();

													var aTransactionItems = ns1blankspace.financial.bankAccount.reconcile.items.data.reconciled.transactions[iTransactionID];

													if (iItemIndex < aTransactionItems.length)
													{
														if (iItemIndex == 0)
														{
															ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled['debits'] = undefined;
															ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled['credits'] = undefined;
															ns1blankspace.financial.bankAccount.reconcile.items.data.unreconciled['journals'] = undefined;
														}

														var oData =
														{
															reconciliation: iReconciliation,
															remove: 1,
															object: iObject,
															objectcontext: aTransactionItems[iItemIndex].id
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
																oParam = ns1blankspace.util.setParam(oParam, 'itemIndex', iItemIndex + 1);
																ns1blankspace.financial.bankAccount.reconcile.items.unreconcile(oParam);
															}
														});	
													}
													else
													{
														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_BANK_ACCOUNT_TRANSACTION_MANAGE'),
															data: 'status=3&id=' + iTransactionID,
															dataType: 'json',
															success: function(data)
															{
																ns1blankspace.status.message('Removed from reconciliation');
															}
														});
													}
												}				
								}
				},

	transfer:
				{
					show: 	function(oParam, oResponse)
								{
									var aHTML = [];
											
									aHTML.push('<table class="ns1blankspace">' +
													'<tr>' +
													'<td id="ns1blankspaceTransferColumn1" style="width:250px;"></td>' +
													'<td id="ns1blankspaceTransferColumn2" style="width:100px;"></td>' +
													'<td id="ns1blankspaceTransferColumn3" class="ns1blankspaceSub" style="font-size:0.75em;">Bank transfers are saved as journals.</td>' +
													'</tr>' +
													'</table>');			
								
									$('#ns1blankspaceMain').html(aHTML.join(''));

									var aHTML = [];
						
									aHTML.push('<table class="ns1blankspace">');
												
									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Date' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceDate">' +
													'<input id="ns1blankspaceBankAccountTransferDate" class="ns1blankspaceDate">' +
													'</td></tr>');

									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Description' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceTextMulti">' +
													'<textarea rows="3" cols="35" id="ns1blankspaceBankAccountTransferDescription" class="ns1blankspaceTextMultiSmall"></textarea>' +
													'</td></tr>');

									aHTML.push('<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceCaption">' +
													'Amount' +
													'</td></tr>' +
													'<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceText">' +
													'<input id="ns1blankspaceBankAccountTransferAmount" class="ns1blankspaceText">' +
													'</td></tr>');

									aHTML.push('<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceCaption">' +
														'From' +
														'</td></tr>' +
														'<tr class="ns1blankspaceRadio">' +
														'<td id="ns1blankspaceBankAccountTransferFrom" class="ns1blankspaceRadio">');
									
									var iDefaultBankAccountFrom;
									
									$.each(ns1blankspace.financial.data.bankaccounts, function()
									{
										if (this.financialaccount !== '')
										{	
											if (iDefaultBankAccountFrom == undefined) {iDefaultBankAccountFrom = this.id}
											aHTML.push('<input type="radio" id="radioBankAccountFrom' + this.id + '" name="radioBankAccountFrom" value="' + this.id + '"/>' +
															this.title + '<br />');	
										}								
									});
	
									aHTML.push('</td></tr>');


									aHTML.push('<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceCaption">' +
														'To' +
														'</td></tr>' +
														'<tr class="ns1blankspaceRadio">' +
														'<td id="ns1blankspaceBankAccountTransferTo" class="ns1blankspaceRadio">');
									
									var iDefaultBankAccountTo;
									
									$.each(ns1blankspace.financial.data.bankaccounts, function()
									{
										if (this.financialaccount !== '')
										{	
											if (iDefaultBankAccountTo == undefined) {iDefaultBankAccountTo = this.id}
											aHTML.push('<input type="radio" id="radioBankAccountTo' + this.id + '" name="radioBankAccountTo" value="' + this.id + '"/>' +
															this.title + '<br />');
										}									
									});
									
									aHTML.push('</td></tr>');	
									
									
									aHTML.push('</table>');					
						
									$('#ns1blankspaceTransferColumn1').html(aHTML.join(''));

									$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

									$('#ns1blankspaceBankAccountTransferDate').val(Date.today().toString("dd MMM yyyy"));
									$('[name="radioBankAccountFrom"][value="' + iDefaultBankAccountFrom + '"]').attr('checked', true);
									$('[name="radioBankAccountTo"][value="' + iDefaultBankAccountTo + '"]').attr('checked', true);

									var aHTML = [];
						
									aHTML.push('<table class="ns1blankspaceColumn2">');
															
									aHTML.push('<tr><td>' +
													'<span class="ns1blankspaceAction" style="width:80px;" id="ns1blankspaceBankAccountTransferSave">Save</span>' +
													'</td></tr>');
								
									aHTML.push('<tr><td>' +
													'<span class="ns1blankspaceAction" style="width:80px;" id="ns1blankspaceBankAccountTransferCancel">Cancel</span>' +
													'</td></tr>');
													
									aHTML.push('</table>');		
															
									$('#ns1blankspaceTransferColumn2').html(aHTML.join(''));
						
									$('#ns1blankspaceBankAccountTransferSave').button(
									{
										text: "Save"
									})
									.click(function() 
									{
										$('#ns1blankspaceTransferColumn2').html(ns1blankspace.xhtml.loadingSmall);
										ns1blankspace.financial.bankAccount.transfer.save.send();
									});
									
									$('#ns1blankspaceBankAccountTransferCancel').button(
									{
										text: "Cancel"
									})
									.click(function() 
									{
										ns1blankspace.financial.bankAccount.home()
									})
								},
								
					save: 	{
									send: 	function(oParam)
												{
													if (oParam == undefined)
													{
														oParam =
														{
															bankAccountFrom: $('input[name="radioBankAccountFrom"]:checked').val(),
															bankAccountTo: $('input[name="radioBankAccountTo"]:checked').val(),
															amount: $('#ns1blankspaceBankAccountTransferAmount').val(),
															description: $('#ns1blankspaceBankAccountTransferDescription').val(),
															date: $('#ns1blankspaceBankAccountTransferDate').val()
														}
													}	

													if (oParam.bankAccountFrom == oParam.bankAccountTo)
													{
														ns1blankspace.status.error('Same bank account');
													}
													else if (oParam.amount == '')
													{
														ns1blankspace.status.error('No amount')
													}
													else
													{
														var oBankAccountFrom = ($.grep(ns1blankspace.financial.data.bankaccounts, function (a) { return a.id == oParam.bankAccountFrom;}))[0];
														var oBankAccountTo = ($.grep(ns1blankspace.financial.data.bankaccounts, function (a) { return a.id == oParam.bankAccountTo;}))[0];

														oParam.financialAccountFrom = oBankAccountFrom.financialaccount;
														oParam.financialAccountTo = oBankAccountTo.financialaccount;

														var oData =
														{
															journaldate: oParam.date,
															description: 'Bank transfer from ' + oBankAccountFrom.title + ' to ' + oBankAccountTo.title
														}

														if (oParam.description != '' && oParam.description != undefined) {oData.description = oParam.description}
														
														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_GENERAL_JOURNAL_MANAGE'),
															data: oData,
															dataType: 'json',
															success: function(data) {ns1blankspace.financial.bankAccount.transfer.save.process(oParam, data)}
														});
													}
												},

									process: function(oParam, oResponse)
												{
													if (oResponse.status == 'OK')
													{
														oParam.id = oResponse.id;
														ns1blankspace.financial.bankAccount.transfer.save.item(oParam);
													}
													else
													{
														ns1blankspace.status.error(oResponse.error.errornotes);
													}
												},

									item: 	function(oParam)
												{
													var iJournalID = ns1blankspace.util.getParam(oParam, 'id').value;
													var iItemType = ns1blankspace.util.getParam(oParam, 'itemType', {"default": 1}).value;
													var iType = ns1blankspace.util.getParam(oParam, 'type').value;
													var cAmount = ns1blankspace.util.getParam(oParam, 'amount').value;

													var oData =
													{
														generaljournal: iJournalID,
														taxcategory: 2,
														taxtype: 5
													}	

													if (iItemType == 1)
													{	
														oData.financialaccount = ns1blankspace.util.getParam(oParam, 'financialAccountFrom').value;
														oData.creditamount = cAmount;
														oData.credittax = 0;
													}
													else
													{
														oData.financialaccount = ns1blankspace.util.getParam(oParam, 'financialAccountTo').value;
														oData.debitamount = cAmount;
														oData.debittax = 0;
													}	
																
													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('FINANCIAL_GENERAL_JOURNAL_ITEM_MANAGE'),
														data: oData,
														dataType: 'json',
														success: function(oResponse)
														{
															if (iType == iItemType)
															{	
																if (ns1blankspace.financial.bankAccount.reconcile.items.transfer.data != undefined)
																{	
																	ns1blankspace.financial.bankAccount.reconcile.items.transfer.data.push(_.clone(oResponse));
																}	
															}	

															if (iItemType == 1)
															{
																oParam.itemType = 2;
																ns1blankspace.financial.bankAccount.transfer.save.item(oParam)
															}
															else
															{	
																ns1blankspace.financial.bankAccount.transfer.save.finalise(oParam)
															}	
														}
													});
												},

									finalise: function(oParam)
												{
													var iJournalID = ns1blankspace.util.getParam(oParam, 'id').value;

													var oData =
													{
														id: iJournalID,
														status: 2
													}
													
													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('FINANCIAL_GENERAL_JOURNAL_MANAGE'),
														data: oData,
														dataType: 'json',
														success: function(data)
														{
															ns1blankspace.status.message('Saved');
															$('#ns1blankspaceTransferColumn2').html('');
															$('#ns1blankspaceTransferColumn3').html('');
															$('#ns1blankspaceTransferColumn1').html('<div class="ns1blankspaceAction" id="ns1blankspaceBankAccountTransferView">View</div>');

															$('#ns1blankspaceBankAccountTransferView').button(
															{
																label: "View Journal"
															})
															.click(function() 
															{
																ns1blankspace.financial.journal.init({id: iJournalID});
															});

															ns1blankspace.util.onComplete(oParam);
														}
													});
												}								
								}
				}									
}								

ns1blankspace.financial.bankAccount.healthCheck = 
{
	data: {},

	init: function (oParam, oResponse)
	{
		ns1blankspace.financial.bankAccount.healthCheck.data = {};

		var iReconciliation = ns1blankspace.util.getParam(oParam, 'reconciliation').value;
		var sReconciliationStatementDate = ns1blankspace.util.getParam(oParam, 'reconciliationStatementDate').value; 

		ns1blankspace.status.message('Health check starting...');
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

		if (sXHTMLElementID != undefined)
		{
 			$('#' + sXHTMLElementID).html(ns1blankspace.xhtml.loadingSmall);
		}

		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
			oSearch.addField('statementbalance,statementdate,statustext,status,previousbalance,notes,reference');
			//oSearch.addFilter('id', 'LESS_THAN_OR_EQUAL_TO', iReconciliation);
			oSearch.addFilter('statementdate', 'LESS_THAN_OR_EQUAL_TO', sReconciliationStatementDate);
			oSearch.addFilter('bankaccount', 'EQUAL_TO', ns1blankspace.objectContext);
			oSearch.sort('statementdate', 'desc');
			oSearch.rows = 2;
			oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.healthCheck.init(oParam, data)});
		}
		else
		{
			ns1blankspace.financial.bankAccount.healthCheck.data.reconciliation = oResponse.data.rows[0];
			ns1blankspace.financial.bankAccount.healthCheck.data.previousReconciliation = oResponse.data.rows[1];

			ns1blankspace.financial.bankAccount.healthCheck.data.endDate = ns1blankspace.financial.bankAccount.healthCheck.data.reconciliation.statementdate;
			ns1blankspace.financial.bankAccount.healthCheck.data._endDate = moment(ns1blankspace.financial.bankAccount.healthCheck.data.endDate, ns1blankspace.option.dateFormats);

			if (ns1blankspace.financial.bankAccount.healthCheck.data.previousReconciliation != undefined)
			{
				ns1blankspace.financial.bankAccount.healthCheck.data._startDate =
					moment(ns1blankspace.financial.bankAccount.healthCheck.data.previousReconciliation.statementdate, ns1blankspace.option.dateFormats).add(1, 'days');
				ns1blankspace.financial.bankAccount.healthCheck.data.startDate = ns1blankspace.financial.bankAccount.healthCheck.data._startDate.format('DD MMM YYYY');
			}	

			ns1blankspace.financial.bankAccount.healthCheck.receipts(oParam);
		}
	},

	receipts: function (oParam, oResponse)
	{
		var iReconciliation = ns1blankspace.util.getParam(oParam, 'reconciliation').value;

		ns1blankspace.status.message('Health check, receipts...');

		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
			oSearch.addField('receiveddate,amount,reference');
			oSearch.addFilter('reconciliation', 'EQUAL_TO', iReconciliation);
			oSearch.rows = 10000;
			oSearch.sort('receiveddate', 'asc');
			oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.healthCheck.receipts(oParam, data)});
		}
		else
		{
			ns1blankspace.financial.bankAccount.healthCheck.data.receipts = oResponse.data.rows;
			if (ns1blankspace.financial.bankAccount.healthCheck.data.receipts.length != 0)
			{
				if (ns1blankspace.financial.bankAccount.healthCheck.data.previousReconciliation == undefined)
				{
					ns1blankspace.financial.bankAccount.healthCheck.data.startDate = ns1blankspace.financial.bankAccount.healthCheck.data.receipts[0].receiveddate;
					ns1blankspace.financial.bankAccount.healthCheck.data._startDate = moment(ns1blankspace.financial.bankAccount.healthCheck.data.startDate, ns1blankspace.option.dateFormats);
				}	
			}

			ns1blankspace.financial.bankAccount.healthCheck.payments(oParam);
		}
	},

	payments: function (oParam, oResponse)
	{
		var iReconciliation = ns1blankspace.util.getParam(oParam, 'reconciliation').value;

		ns1blankspace.status.message('Health check, payments...');

		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
			oSearch.addField('paiddate,amount,reference');
			oSearch.addFilter('reconciliation', 'EQUAL_TO', iReconciliation);
			oSearch.rows = 10000;
			oSearch.sort('paiddate', 'asc');
			oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.healthCheck.payments(oParam, data)});
		}
		else
		{
			ns1blankspace.financial.bankAccount.healthCheck.data.payments = oResponse.data.rows;
			if (ns1blankspace.financial.bankAccount.healthCheck.data.payments.length != 0)
			{				
				if (ns1blankspace.financial.bankAccount.healthCheck.data.previousReconciliation == undefined)
				{
					if (moment(ns1blankspace.financial.bankAccount.healthCheck.data.payments[0].paiddate, ns1blankspace.option.dateFormats)
					  .isBefore(ns1blankspace.financial.bankAccount.healthCheck.data._startDate))
					{
						ns1blankspace.financial.bankAccount.healthCheck.data.startDate = ns1blankspace.financial.bankAccount.healthCheck.data.payments[0].paiddate;
						ns1blankspace.financial.bankAccount.healthCheck.data._startDate =
								moment(ns1blankspace.financial.bankAccount.healthCheck.data.startDate, ns1blankspace.option.dateFormats);
						
					}
				}
			}

			ns1blankspace.financial.bankAccount.healthCheck.journals(oParam);
		}
	},

	journals: function (oParam, oResponse)
	{
		var iReconciliation = ns1blankspace.util.getParam(oParam, 'reconciliation').value;

		ns1blankspace.status.message('Health check, journals...');

		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_ITEM_SEARCH';
			oSearch.addField('generaljournalitem.generaljournal.journaldate,generaljournalitem.generaljournal.id,generaljournalitem.generaljournal.reference,creditamount,debitamount');
			oSearch.addFilter('reconciliation', 'EQUAL_TO', iReconciliation);
			oSearch.rows = 10000;
			oSearch.sort('generaljournalitem.generaljournal.journaldate', 'asc');
			oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.healthCheck.journals(oParam, data)});
		}
		else
		{
			ns1blankspace.financial.bankAccount.healthCheck.data.journals = oResponse.data.rows;
			if (ns1blankspace.financial.bankAccount.healthCheck.data.journals.length != 0)
			{	
				if (ns1blankspace.financial.bankAccount.healthCheck.data.previousReconciliation == undefined)
				{		
					if (moment(ns1blankspace.financial.bankAccount.healthCheck.data.journals[0]['generaljournalitem.generaljournal.journaldate'], ns1blankspace.option.dateFormats)
					  .isBefore(ns1blankspace.financial.bankAccount.healthCheck.data._startDate))
					{
						ns1blankspace.financial.bankAccount.healthCheck.data.startDate = ns1blankspace.financial.bankAccount.healthCheck.data.journals[0]['generaljournalitem.generaljournal.journaldate'];
						ns1blankspace.financial.bankAccount.healthCheck.data._startDate = moment(ns1blankspace.financial.bankAccount.healthCheck.data.startDate, ns1blankspace.option.dateFormats);
					}
				}	
			}

			ns1blankspace.financial.bankAccount.healthCheck.financialTransactions(oParam);
		}
	},

	financialTransactions: function (oParam, oResponse)
	{
		ns1blankspace.status.message('Health check, GL...');

		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
			oSearch.addField('amount,area,areatext,date,description,financialaccount,financialaccounttext,id,lineitem,lineitemtext,object,objectcontext,objecttext,project,projecttext,reference');
			oSearch.addSummaryField('sum(amount) sumamount, count(id) count');
			oSearch.sort('date', 'asc');
			oSearch.addFilter('financialaccount', 'EQUAL_TO', ns1blankspace.objectContextData.financialaccount);
			oSearch.addFilter('date', 'GREATER_THAN_OR_EQUAL_TO', ns1blankspace.financial.bankAccount.healthCheck.data.startDate);
			oSearch.addFilter('date', 'LESS_THAN_OR_EQUAL_TO', ns1blankspace.financial.bankAccount.healthCheck.data.endDate);
			oSearch.rows = 10000;
			oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.healthCheck.financialTransactions(oParam, data)});	
		}
		else
		{
			ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsSummary = oResponse.summary;
			ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactions = oResponse.data.rows;

			ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsByObject =
					_.groupBy(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactions, 'object');

			ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsByObjectTotal = 
			_.map(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsByObject,
					function (financialTransactions, key)
					{
						return {object: numeral(key).value(), amount: numeral(_.sumBy(financialTransactions, function (ft) {return numeral(ft.amount).value()})).format('0,0.00')}
					});

			ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsByType =
			{
				credits: _.filter(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactions,
					function (financialTransaction, key)
					{
						return (financialTransaction.object == 6 || (financialTransaction.object == 122 && numeral(financialTransaction.amount).value() > 0))
					}),

				debits: _.filter(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactions,
					function (financialTransaction, key)
					{
						return (financialTransaction.object == 3 || (financialTransaction.object == 122 &&  numeral(financialTransaction.amount).value() < 0))
					})

			}

			ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsByTypeTotal = 
			_.map(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsByType,
					function (financialTransactions, key)
					{
						return {type: key, amount: numeral(_.sumBy(financialTransactions, function (ft) {return numeral(ft.amount).value()})).format('0,0.00')}
					});

			ns1blankspace.financial.bankAccount.healthCheck.financialTransactionsBalance(oParam);
		}				
	},

	financialTransactionsBalance: function (oParam, oResponse)
	{
		ns1blankspace.status.message('Health check, GL Balance...');

		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
			oSearch.addField('sum(amount) sumamount, count(id) count');
			oSearch.addFilter('financialaccount', 'EQUAL_TO', ns1blankspace.objectContextData.financialaccount);
			oSearch.addFilter('date', 'LESS_THAN_OR_EQUAL_TO', ns1blankspace.financial.bankAccount.healthCheck.data.endDate);
			oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.healthCheck.financialTransactionsBalance(oParam, data)});	
		}
		else
		{
			ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsBalance = oResponse.data.rows[0];
			ns1blankspace.financial.bankAccount.healthCheck.lineitems.init(oParam);
		}				
	},

	lineitems: 
	{
		init: function (oParam, oResponse)
		{
			ns1blankspace.status.message('Health check, line items...');
			ns1blankspace.financial.bankAccount.healthCheck.data.lineitems =
					_.clone(ns1blankspace.financial.bankAccount.healthCheck.data.journals);
			ns1blankspace.financial.bankAccount.healthCheck.lineitems.receipts(oParam);
		},

		receipts: function (oParam, oResponse)
		{
			var aIDs = $.map(ns1blankspace.financial.bankAccount.healthCheck.data.receipts, function (receipt) {return receipt.id});

			if (aIDs.length == 0)
			{
				ns1blankspace.financial.bankAccount.healthCheck.lineitems.payments(oParam);
			}
			else
			{
				if (oResponse == undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'FINANCIAL_ITEM_SEARCH';
					oSearch.addField('amount,object,objectcontext');
					oSearch.addFilter('object', 'EQUAL_TO', 6);
					oSearch.addFilter('objectcontext', 'IN_LIST', aIDs.join(','));
					oSearch.rows = 10000;
					oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.healthCheck.lineitems.receipts(oParam, data)});
				}
				else
				{
					ns1blankspace.financial.bankAccount.healthCheck.data.lineitems = 
						ns1blankspace.financial.bankAccount.healthCheck.data.lineitems.concat(oResponse.data.rows);
						
					ns1blankspace.financial.bankAccount.healthCheck.lineitems.payments(oParam);
				}
			}	
		},

		payments: function (oParam, oResponse)
		{
			var aIDs = $.map(ns1blankspace.financial.bankAccount.healthCheck.data.payments, function (payment) {return payment.id});

			if (aIDs.length == 0)
			{
				ns1blankspace.financial.bankAccount.healthCheck.finalise(oParam);
			}
			else
			{
				if (oResponse == undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'FINANCIAL_ITEM_SEARCH';
					oSearch.addField('amount,object,objectcontext');
					oSearch.addFilter('object', 'EQUAL_TO', 3);
					oSearch.addFilter('objectcontext', 'IN_LIST', aIDs.join(','));
					oSearch.rows = 10000;
					oSearch.getResults(function(data) {ns1blankspace.financial.bankAccount.healthCheck.lineitems.payments(oParam, data)});	
				}
				else
				{
					ns1blankspace.financial.bankAccount.healthCheck.data.lineitems = 
						ns1blankspace.financial.bankAccount.healthCheck.data.lineitems.concat(oResponse.data.rows);
						
					ns1blankspace.financial.bankAccount.healthCheck.finalise(oParam);
				}
			}	
		}
	},

	finalise: function (oParam, oResponse)
	{
		ns1blankspace.status.message('Health check, finalise...');

		$.each(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactions, function (ft, financialTransaction)
		{
			if (financialTransaction.object == 6)
			{
				financialTransaction.items = $.grep(ns1blankspace.financial.bankAccount.healthCheck.data.receipts, function (receipt) {return financialTransaction.objectcontext == receipt.id});
			}

			if (financialTransaction.object == 3)
			{
				financialTransaction.items = $.grep(ns1blankspace.financial.bankAccount.healthCheck.data.payments, function (payment) {return financialTransaction.objectcontext == payment.id});
			}

			if (financialTransaction.object == 122)
			{
				financialTransaction.items = $.grep(ns1blankspace.financial.bankAccount.healthCheck.data.journals, function (journal) {return financialTransaction.objectcontext == journal['generaljournalitem.generaljournal.id']});
			}

			financialTransaction.lineitems = $.grep(ns1blankspace.financial.bankAccount.healthCheck.data.lineitems, function (lineitem) {return financialTransaction.lineitem == lineitem.id});
		});

		$.each(ns1blankspace.financial.bankAccount.healthCheck.data.lineitems, function (li, lineitem)
		{
			lineitem.financialTransaction = $.grep(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactions, function (financialTransaction) {return financialTransaction.lineitem == lineitem.id});
		});

		ns1blankspace.financial.bankAccount.healthCheck.data.unhealthy = 
		{
			items: $.grep(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactions,
								function (financialTransaction) {return financialTransaction.items.length == 0}),

			lineitems: $.grep(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactions,
								function (financialTransaction) {return financialTransaction.lineitems.length == 0}),

			lineitemsNoFinancialTransaction: $.grep(ns1blankspace.financial.bankAccount.healthCheck.data.lineitems,
								function (lineitem) {return lineitem.financialTransaction.length == 0 && numeral(lineitem.amount).value() != 0})
		}

		ns1blankspace.financial.bankAccount.healthCheck.data.unhealthy.summary =
				_.toArray(_.groupBy(ns1blankspace.financial.bankAccount.healthCheck.data.unhealthy.lineitems, 'reference'));

		ns1blankspace.financial.bankAccount.healthCheck.data.summary =
		{		
			financialTransactions: _.groupBy(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactions, 'reference')
		}

		ns1blankspace.financial.bankAccount.healthCheck.data.summary.totals = [];

		$.each(ns1blankspace.financial.bankAccount.healthCheck.data.summary.financialTransactions, function (reference, financialTransactions)
		{	
			ns1blankspace.financial.bankAccount.healthCheck.data.summary.totals.push(
			{
				reference: reference,
				object: _.first(financialTransactions).object,
				objectcontext: _.first(financialTransactions).objectcontext,
				amount: _.sumBy(financialTransactions, function (ft) {return numeral(ft.amount).value()})
			});
		});

		$.each(ns1blankspace.financial.bankAccount.healthCheck.data.summary.totals, function (t, total)
		{
			if (total.object == 6)
			{
				total.item = _.find(ns1blankspace.financial.bankAccount.healthCheck.data.receipts, function (receipt) {return total.objectcontext == receipt.id});
			}

			if (total.object == 3)
			{
				total.item = _.find(ns1blankspace.financial.bankAccount.healthCheck.data.payments, function (payment) {return total.objectcontext == payment.id});
			}

			if (total.object == 122)
			{
				total.item = _.find(ns1blankspace.financial.bankAccount.healthCheck.data.journals, function (journal) {return total.objectcontext == journal['generaljournalitem.generaljournal.id']});
				total.item.amount = (numeral(total.item.debitamount).value()!=0?total.item.debitamount:total.item.creditamount);
			}

			if (total.item == undefined)
			{
				total.balanced = false
			}
			else
			{
				total.balanced = (Math.abs(numeral(total.amount).value()) == Math.abs(numeral(total.item.amount).value()));
			}	
		});

		$.each(ns1blankspace.financial.bankAccount.healthCheck.data.unhealthy.lineitemsNoFinancialTransaction, function (li, lineitem)
		{
			if (lineitem.object == 6)
			{
				lineitem.item = _.find(ns1blankspace.financial.bankAccount.healthCheck.data.receipts, function (receipt) {return lineitem.objectcontext == receipt.id});
			}

			if (lineitem.object == 3)
			{
				lineitem.item = _.find(ns1blankspace.financial.bankAccount.healthCheck.data.payments, function (payment) {return lineitem.objectcontext == payment.id});
			}

			if (lineitem.object == 122)
			{
				lineitem.item = _.find(ns1blankspace.financial.bankAccount.healthCheck.data.journals, function (journal) {return lineitem.objectcontext == journal['generaljournalitem.generaljournal.id']});
			}
		});

		ns1blankspace.financial.bankAccount.healthCheck.data.unhealthy.financialTransactions = 
			_.find(ns1blankspace.financial.bankAccount.healthCheck.data.summary.totals, function (t) {return !t.balanced})

		console.log(ns1blankspace.financial.bankAccount.healthCheck.data);
		console.log(ns1blankspace.financial.bankAccount.healthCheck.data.unhealthy)

		ns1blankspace.status.message('Health check complete');
		ns1blankspace.financial.bankAccount.healthCheck.show(oParam);
	},

	show: function (oParam)
	{
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

		if (sXHTMLElementID != undefined)
		{
			var aHTML = [];

			aHTML.push('<div style="font-weight:600; padding-top:6px; padding-bottom:6px;">GL balance is ' + ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsBalance.sumamount + '.</div>');

			if (numeral(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsBalance.sumamount).value()
						!= numeral(ns1blankspace.financial.bankAccount.healthCheck.data.reconciliation.statementbalance).value())
			{
				aHTML.push('<div style="padding-top:6px; padding-bottom:2px;">The GL balance doesn\'t match the reconciliation balance of ' + ns1blankspace.financial.bankAccount.healthCheck.data.reconciliation.statementbalance +
						'.</div><div style="padding-top:2px; padding-bottom:6px;">It is out by ' + numeral(numeral(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsBalance.sumamount).value()
								- numeral(ns1blankspace.financial.bankAccount.healthCheck.data.reconciliation.statementbalance).value()).format('0,0.00') + '.</div>');
			}
			else
			{
				aHTML.push('<div style="padding-top:6px; padding-bottom:2px;">The GL balance matches the reconciliation balance.</div>');
			}

			/*var cReconciliationDifference = numeral(numeral(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsSummary.sumamount).value() -
						(numeral(ns1blankspace.financial.bankAccount.healthCheck.data.reconciliation.statementbalance).value()
						- numeral(ns1blankspace.financial.bankAccount.healthCheck.data.reconciliation.previousbalance).value())).format('0,0.00')

			if (cReconciliationDifference == 0)
			{
				aHTML.push('<div style="padding-top:6px; padding-bottom:6px;">This reconcilaton is balanced with the GL</div>')
			}
			else
			{
				aHTML.push('<div style="padding-top:6px; padding-bottom:6px;">This reconcilaton is out of balanced with the GL by $' +
									cReconciliationDifference + '</div>')
			}*/

			var cFinancialTransactionsCredits = numeral(_.find(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsByTypeTotal, function (ft) {return ft.type == 'credits'}).amount).value();
			var cReconciliationCredits = (ns1blankspace.financial.bankAccount.reconcile.data.locked.credits).toFixed(2);

			if (cFinancialTransactionsCredits != cReconciliationCredits)
			{
				aHTML.push('<div style="padding-top:6px; padding-bottom:4px;">Credits are out by ' +
					numeral(cFinancialTransactionsCredits - cReconciliationCredits).format('0,0.00') + '.</div>')
			}

			var cFinancialTransactionsDebits = Math.abs(numeral(_.find(ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsByTypeTotal, function (ft) {return ft.type == 'debits'}).amount).value());
			var cReconciliationDebits = (ns1blankspace.financial.bankAccount.reconcile.data.locked.debits).toFixed(2);

			if (cFinancialTransactionsDebits != cReconciliationDebits)
			{
				aHTML.push('<div style="padding-top:6px; padding-bottom:4px;">Debits are out by ' +
					numeral(cReconciliationDebits - cFinancialTransactionsDebits).format('0,0.00') + '.</div>')
			}

			aHTML.push('<div style="padding-top:6px; padding-bottom:4px;">There are ' + ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactionsSummary.count + ' GL transactions.</div>')
			aHTML.push('<div style="padding-top:6px; padding-bottom:4px;">There are ' + ns1blankspace.financial.bankAccount.healthCheck.data.financialTransactions.length + ' items in this reconciliation.</div>')

			if (ns1blankspace.financial.bankAccount.healthCheck.data.unhealthy.summary.length == 0)
			{
				aHTML.push('<div style="padding-top:6px;">No unrelated transactions in the GL.</div>');
			}
			else
			{
				aHTML.push('<div style="padding-top:6px;"><strong>' + ns1blankspace.util.toWords({upper: true, number: ns1blankspace.financial.bankAccount.healthCheck.data.unhealthy.summary.length}) +
									'</strong> GL transaction(s) found, with no related items in this reconciliation.</div>');

				$.each(ns1blankspace.financial.bankAccount.healthCheck.data.unhealthy.summary, function (ft, financialTransactionSummary)
				{
					var financialTransaction = _.first(financialTransactionSummary);

					var sObjectLink = 'financial.payment';
					if (financialTransaction.object == 6) {sObjectLink = 'financial.receipt'}
					if (financialTransaction.object == 122) {sObjectLink = 'financial.journal'}

					aHTML.push('<div style="padding-top:4px;">' +
						'<a target="_blank" href="/#/' + sObjectLink + '/' + financialTransaction.objectcontext + '">' + financialTransaction.reference + '</a></div>');
				});
			}

			if (ns1blankspace.financial.bankAccount.healthCheck.data.unhealthy.lineitemsNoFinancialTransaction.length != 0)
			{
				aHTML.push('<div style="padding-top:6px;"><strong>' + ns1blankspace.util.toWords({upper: true, number: ns1blankspace.financial.bankAccount.healthCheck.data.unhealthy.lineitemsNoFinancialTransaction.length}) +
									'</strong>Items in this reconciliation with no related GL transaction(s).</div>');

				$.each(ns1blankspace.financial.bankAccount.healthCheck.data.unhealthy.lineitemsNoFinancialTransaction, function (l, lineitem)
				{
					var sObjectLink = 'financial.payment';
					var sReference = lineitem.item.reference;

					if (lineitem.object == 6) {sObjectLink = 'financial.receipt'}
					if (lineitem.object == 122)
					{
						sObjectLink = 'financial.journal';
						sReference = lineitem.item['generaljournalitem.generaljournal.reference']
					}

					aHTML.push('<div style="padding-top:4px;">' +
						'<a target="_blank" href="/#/' + sObjectLink + '/' + lineitem.objectcontext + '">' + sReference + '</a></div>');
				});
			}

			$('#' + sXHTMLElementID).html(aHTML.join(''))	
		}
	}											
}





