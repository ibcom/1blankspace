/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

/*

ns1blankspace.util.financial.init.accounts({
	onComplete: ns1blankspace.util.financial.init.transactions,
	onCompleteWhenCan: ns1blankspace.util.financial.prepare,
	startDate: '01 Jan 2015',
	endDate: '31 Jan 2015'
});

*/

ns1blankspace.util.financial =
{
	data: 		{transactions: {totals: {}, raw: []}, objects: [], results: {outOfBalance: [], notReconciled: []}},

	rules: 		{
					AccountIsDebitIfAmountGreaterZeroAndType: [1,3],
					AccountIsDebitIfAmountLessZeroAndType: [2,4,5]
				},

	side:
				function (account)
				{
					account.side = 'credit';
					if (account.financialaccount.type == 1 && accounting.unformat(account.amount) > 0) {account.side = 'debit'}
					if (account.financialaccount.type == 3 && accounting.unformat(account.amount) > 0) {account.side = 'debit'}
					if (account.financialaccount.type == 4 && accounting.unformat(account.amount) < 0) {account.side = 'debit'}
					if (account.financialaccount.type == 2 && accounting.unformat(account.amount) < 0) {account.side = 'debit'}
					if (account.financialaccount.type == 5 && accounting.unformat(account.amount) < 0) {account.side = 'debit'}	
				},		

	init: 		{
					accounts: 		function (oParam)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
										oSearch.addField('area,areatext,class,classtext,code,description,expensecostofsale,expensepayroll,' +
															'parentaccount,parentaccounttext,postable,title,taxtype,taxtypeincomingtext,taxtypeoutgoingtext,type,typetext');
										oSearch.sort('type', 'asc');
										oSearch.sort('title', 'asc');
										oSearch.rows = 500;
										oSearch.getResults(function(oResponse)
										{
											ns1blankspace.util.financial.data.accounts = oResponse.data.rows;
											ns1blankspace.util.onComplete(oParam);
										});
									},

					transactions: 	function (oParam)
									{
										var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
										var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
										var iFinancialAccount = ns1blankspace.util.getParam(oParam, 'financialAccount').value;
										var iID = ns1blankspace.util.getParam(oParam, 'id').value;
										var bInitialised = ns1blankspace.util.getParam(oParam, 'initialised', {"default": false}).value;

										if (!bInitialised)
										{
											oParam.initialised = true;
											ns1blankspace.util.financial.data.transactions.raw = [];
										}

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
										oSearch.addField('financialaccount,amount,date,object,objectcontext,lineitem,modifieddate,createddate,description');
										
										if (sStartDate != undefined)
										{
											oSearch.addFilter('date', 'GREATER_THAN_OR_EQUAL_TO', sStartDate);
										}	

										if (sEndDate != undefined)
										{
											oSearch.addFilter('date', 'LESS_THAN_OR_EQUAL_TO', sEndDate);
										}

										if (iFinancialAccount != undefined)
										{
											oSearch.addFilter('financialaccount', 'EQUAL_TO', iFinancialAccount);
										}

										if (iID != undefined)
										{
											oSearch.addFilter('id', 'GREATER_THAN', iID);
										}

										oSearch.rows = 250;
										oSearch.sort('id', 'asc');

										oSearch.getResults(function(oResponse)
										{
											if (oResponse.data.rows.length > 0)
											{	
												oParam.id = oResponse.data.rows[oResponse.data.rows.length-1].id;

												ns1blankspace.util.financial.data.transactions.raw =
													ns1blankspace.util.financial.data.transactions.raw.concat(oResponse.data.rows);
											}		

											if (oResponse.morerows == "false")
											{
												ns1blankspace.util.financial.data.transactions.raw.sort(ns1blankspace.util.sortBy('id'));

												$.each($.grep(ns1blankspace.util.financial.data.transactions.raw, function(a) {return a.object == '122'}),
												function (i, transaction)
												{
													transaction.parentobjectcontext = transaction.objectcontext;
													transaction.objectcontext = transaction.lineitem;
												});

												ns1blankspace.util.onComplete(oParam);
											}
											else
											{
												ns1blankspace.util.financial.init.transactions(oParam);
											}
										});
									},

					balances: 		function (oParam)
									{
										var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
										var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
										oSearch.addField('financialaccount,sum(amount) amount');
										
										oSearch.addFilter('date', 'GREATER_THAN_OR_EQUAL_TO', sStartDate);
										oSearch.addFilter('date', 'LESS_THAN_OR_EQUAL_TO', sEndDate);

										oSearch.rows = 1000;
										oSearch.getResults(function(oResponse)
										{
											if (oResponse.morerows != "true")
											{
												ns1blankspace.util.financial.data.transactions.balances = oResponse.data.rows;
												ns1blankspace.util.financial.data.transactions.totals.debit = 0;
												ns1blankspace.util.financial.data.transactions.totals.credit = 0;

												$.each(ns1blankspace.util.financial.data.transactions.balances, function (i, account)
												{
													account.financialaccount = $.grep(ns1blankspace.util.financial.data.accounts, function (a) {return a.id == account.financialaccount})[0];
													ns1blankspace.util.financial.side(account);
													ns1blankspace.util.financial.data.transactions.totals[account.side] += +Math.abs(accounting.unformat(account.amount)).toFixed(2);
												});

												ns1blankspace.util.financial.data.transactions.totals.credit = ns1blankspace.util.financial.data.transactions.totals.credit.toFixed(2);
												ns1blankspace.util.financial.data.transactions.totals.debit = ns1blankspace.util.financial.data.transactions.totals.debit.toFixed(2);
												ns1blankspace.util.onComplete(oParam);
											}
											else
											{	
												console.log('Too many records')
											}	
										});
									}
				},

	prepare: 	function (oParam)
				{
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
					var bCheckOutOfBalance = ns1blankspace.util.getParam(oParam, 'checkOutOfBalance', {"default": false}).value;
					var bCheckReconciliation = ns1blankspace.util.getParam(oParam, 'checkReconciliation', {"default": false}).value;
					
					ns1blankspace.util.financial.data.transactions.current = $.extend(true, [], ns1blankspace.util.financial.data.transactions.raw);

					ns1blankspace.util.financial.data.transactions.current =
							$.grep(ns1blankspace.util.financial.data.transactions.current, function (a) {return (iObject==undefined?true:a.object==iObject)});
					
					$.each(ns1blankspace.util.financial.data.transactions.current, function (i, transaction)
					{
						transaction.financialaccount = $.grep(ns1blankspace.util.financial.data.accounts, function (a) {return a.id == transaction.financialaccount})[0];
						ns1blankspace.util.financial.side(transaction);
					});

					console.log('Prepared');

					if (bCheckOutOfBalance) {ns1blankspace.util.financial.outOfBalance(oParam)}
					if (bCheckReconciliation) {ns1blankspace.util.financial.notReconciled.init(oParam)}
				},

	outOfBalance: 	function (oParam)
				{
					ns1blankspace.util.financial.data.objects.length = 0;
					ns1blankspace.util.financial.data.results.outOfBalance.length = 0;

					$.each(ns1blankspace.util.financial.data.transactions.current, function (i, v)
					{
						if ($.grep(ns1blankspace.util.financial.data.objects, function (a) {return (a.object==v.object && a.objectcontext==v.objectcontext)}).length==0)
						{
							ns1blankspace.util.financial.data.objects.push({object: v.object, objectcontext: v.objectcontext, transactions: []})
						}

						$.grep(ns1blankspace.util.financial.data.objects, function (a) {return (a.object==v.object && a.objectcontext==v.objectcontext)})[0].transactions.push(v);
					});

					$.each(ns1blankspace.util.financial.data.objects, function (i, object)
					{	
						object.total = 0;

						$.each(object.transactions, function (j, transaction)
						{
							transaction.factor = 1;
							ns1blankspace.util.financial.side(transaction);
							if (transaction.side == 'credit') {transaction.factor = -1}
							object.total = object.total + +(Math.abs(accounting.unformat(transaction.amount)) * transaction.factor).toFixed(2);
						});

						object.total = + object.total.toFixed(2);

						if (object.total != 0)
						{
							ns1blankspace.util.financial.data.results.outOfBalance.push(object);
						}
					});

					console.log('Out of balance check complete');
				},

	notReconciled: 	
				{
					data: 		{
									methods:
									{
										2: 'EXPENSE',
										3: 'PAYMENT',
										5: 'INVOICE',
										6: 'RECEIPT',
										122: 'GENERAL_JOURNAL_ITEM'
									}
								},

					init:		function (oParam)
								{
									ns1blankspace.util.financial.data.objects.length = 0;
									ns1blankspace.util.financial.data.results.notReconciled.length = 0;

									ns1blankspace.util.financial.notReconciled.data.types =
										$.map(ns1blankspace.util.unique({data: ns1blankspace.util.financial.data.transactions.current, key: 'object'}), function (a) {return a.object});
									ns1blankspace.util.financial.notReconciled.data.objectContexts = [];
									ns1blankspace.util.financial.notReconciled.process(oParam);
								},

					process: 	function (oParam)
								{
									var iTypeIndex = ns1blankspace.util.getParam(oParam, 'typeIndex', {"default": 0}).value;
									oParam.typeIndex = iTypeIndex;

									if (iTypeIndex < ns1blankspace.util.financial.notReconciled.data.types.length)
									{
										var aObjectContexts = $.map(
													ns1blankspace.util.unique(
													{
														data: $.grep(ns1blankspace.util.financial.data.transactions.current, function (v)
																{
																	return (v.object == ns1blankspace.util.financial.notReconciled.data.types[iTypeIndex])
																}),
														key: 'objectcontext'
													}),
													function (v) {return (v.objectcontext!=''?v.objectcontext:undefined)});

										ns1blankspace.util.financial.notReconciled.data.objectContexts.push(
										{
											object: ns1blankspace.util.financial.notReconciled.data.types[iTypeIndex],
											objectContexts: aObjectContexts
										});

										if (aObjectContexts.length == 0 || ns1blankspace.util.financial.notReconciled.data.types[iTypeIndex] == '')
										{
											oParam.typeIndex++;
											ns1blankspace.util.financial.notReconciled.process(oParam);
										}	
										else
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_' + ns1blankspace.util.financial.notReconciled.data.methods[ns1blankspace.util.financial.notReconciled.data.types[iTypeIndex]] + '_SEARCH';
											oSearch.addField('id');
											oSearch.rows = 1000;
											oSearch.addFilter('reconciliation', 'IS_NULL');
											oSearch.addFilter('id', 'IN_LIST', aObjectContexts.join(','));

											oSearch.getResults(function(oResponse)
											{
												if (oResponse.status == 'OK')
												{	
													$.each(oResponse.data.rows, function (i, item)
													{
														$.each($.grep(ns1blankspace.util.financial.data.transactions.current, function (a)
														{
															return (a.object == ns1blankspace.util.financial.notReconciled.data.types[iTypeIndex] && a.objectcontext == item.id)
														}),
														function (j, transaction) {transaction.notReconciled = true});
													});

													$.each($.grep(ns1blankspace.util.financial.data.transactions.current, function (a)
													{
														return (a.objectcontext == '')
													}),
													function (j, transaction) {transaction.notReconciled = true});
												}	

												oParam.typeIndex++;
												ns1blankspace.util.financial.notReconciled.process(oParam);
											});
										}		
									}
									else
									{	
										console.log('Not reconciled check completed');
										console.log($.grep(ns1blankspace.util.financial.data.transactions.current, function (a) {return a.notReconciled}));
										console.log(ns1blankspace.util.financial.show.notReconciled());
									}
								}
				},

	source: 	
				{
					data: 		{
									objects:
									[
										{
											id: 2,
											method: 'EXPENSE',
											date: 'accrueddate',
											contactBusiness: 'contactbusinesspaidto'
										},
										{
											id: 3,
											method: 'PAYMENT',
											date: 'paiddate',
											contactBusiness: 'contactbusinesspaidto'
										},
										{
											id: 5,
											method: 'INVOICE',
											date: 'sentdate',
											contactBusiness: 'contactbusinesssentto'
										},
										{
											id: 6,
											method: 'RECEIPT',
											date: 'receiveddate',
											contactBusiness: 'contactbusinessreceivedfrom'
										}
									],
									objectContexts: {},
									totals: {}
								},

					init:		function (oParam)
								{
									ns1blankspace.util.financial.source.data.balances = [];
									ns1blankspace.util.financial.data.objectContexts = {};
									ns1blankspace.util.financial.source.objectContexts(oParam);
								},

					objectContexts:
								function (oParam)
								{
									var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
									var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
									var iContactBusiness = ns1blankspace.util.getParam(oParam, 'contactBusiness').value;
									var iID = ns1blankspace.util.getParam(oParam, 'id').value;
									var bInitialised = ns1blankspace.util.getParam(oParam, 'initialised', {"default": false}).value;
									var iObject = ns1blankspace.util.getParam(oParam, 'object', {"default": 2}).value;
									var iObjectIndex = ns1blankspace.util.getParam(oParam, 'objectIndex', {"default": 0, set: true}).value;
									oParam.objectIndex = iObjectIndex;

									if (iObjectIndex < ns1blankspace.util.financial.source.data.objects.length)
									{
										var oObject = ns1blankspace.util.financial.source.data.objects[iObjectIndex];

										if (!bInitialised)
										{
											oParam.initialised = true;
											ns1blankspace.util.financial.source.data.objectContexts[oObject.id] = [];
										}

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_' + oObject.method + '_SEARCH';
										oSearch.addField('reference');
										
										if (sStartDate != undefined)
										{
											oSearch.addFilter(oObject.date, 'GREATER_THAN_OR_EQUAL_TO', sStartDate);
										}	

										if (sEndDate != undefined)
										{
											oSearch.addFilter(oObject.date, 'LESS_THAN_OR_EQUAL_TO', sEndDate);
										}

										if (iContactBusiness != undefined)
										{
											oSearch.addFilter(oObject.contactBusiness, 'EQUAL_TO', iContactBusiness);
										}

										if (iID != undefined)
										{
											oSearch.addFilter('id', 'GREATER_THAN', iID);
										}

										oSearch.rows = 250;
										oSearch.sort('id', 'asc');

										oSearch.getResults(function(oResponse)
										{
											if (oResponse.data.rows.length > 0)
											{	
												oParam.id = oResponse.data.rows[oResponse.data.rows.length-1].id;

												ns1blankspace.util.financial.source.data.objectContexts[oObject.id] =
													ns1blankspace.util.financial.source.data.objectContexts[oObject.id].concat(oResponse.data.rows);
											}		

											if (oResponse.morerows == "false")
											{
												oParam.objectIndex++;
												oParam.initialised = false;
												ns1blankspace.util.financial.source.objectContexts(oParam);
												
											}
											else
											{
												ns1blankspace.util.financial.source.objectContexts(oParam);
											}
										});
									}
									else
									{
										delete oParam.id;
										delete oParam.objectIndex;
										ns1blankspace.util.onComplete(oParam);
									}
								},

					transactions: 	
								function (oParam)
								{
									var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
									var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
									var iID = ns1blankspace.util.getParam(oParam, 'id').value;
									var iObject = ns1blankspace.util.getParam(oParam, 'object', {"default": 2}).value;
									var iObjectIndex = ns1blankspace.util.getParam(oParam, 'objectIndex', {"default": 0, set: true}).value;
									oParam.objectIndex = iObjectIndex;

									if (iObjectIndex < ns1blankspace.util.financial.source.data.objects.length)
									{
										var oObject = ns1blankspace.util.financial.source.data.objects[iObjectIndex];

										var aIDs = $.map(
													ns1blankspace.util.unique(
													{
														data: ns1blankspace.util.financial.source.data.objectContexts[oObject.id],
														key: 'id'
													}),
													function (v) {return (v.id!=''?v.id:undefined)});

										if (aIDs.length == 0)
										{
											delete oParam.id; 
											oParam.objectIndex++;
											ns1blankspace.util.financial.source.transactions(oParam);
										}	
										else
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
											oSearch.addField('financialaccount,sum(amount) amount');
											oSearch.addFilter('object', 'EQUAL_TO', oObject.id);
											oSearch.addFilter('objectcontext', 'IN_LIST', aIDs.join(','));

											if (iID != undefined)
											{
												oSearch.addFilter('id', 'GREATER_THAN', iID);
											}

											oSearch.sort('id', 'asc');
											oSearch.rows = 1000;
											oSearch.getResults(function(oResponse)
											{
												if (oResponse.data.rows.length > 0)
												{
													oParam.id = oResponse.data.rows[oResponse.data.rows.length-1].id;

													ns1blankspace.util.financial.source.data.balances =
														ns1blankspace.util.financial.source.data.balances.concat(oResponse.data.rows);
												}

												if (oResponse.morerows == "false")
												{
													delete oParam.id; 
													oParam.objectIndex++;
													ns1blankspace.util.financial.source.transactions(oParam);
												}
												else
												{	
													ns1blankspace.util.financial.source.transactions(oParam);
												}	
											});
										}	
									}
									else
									{
										ns1blankspace.util.financial.source.data.totals.debit = 0;
										ns1blankspace.util.financial.source.data.totals.credit = 0;

										$.each(ns1blankspace.util.financial.source.data.balances, function (i, account)
										{
											account.financialaccount = $.grep(ns1blankspace.util.financial.data.accounts, function (a) {return a.id == account.financialaccount})[0];
											ns1blankspace.util.financial.side(account);
											ns1blankspace.util.financial.source.data.totals[account.side] += +Math.abs(accounting.unformat(account.amount)).toFixed(2);
										});

										ns1blankspace.util.financial.source.data.totals.credit = ns1blankspace.util.financial.source.data.totals.credit.toFixed(2);
										ns1blankspace.util.financial.source.data.totals.debit = ns1blankspace.util.financial.source.data.totals.debit.toFixed(2);
									}
								}					
				},						
	
	show: 		{
					balances: 	function (oParam)
								{
									var sShow = '\n';

									$.each(ns1blankspace.util.financial.data.transactions.balances, function (i, balance)
									{
										sShow += balance.financialaccount.title + '\t' + (balance.side=='debit'?balance.amount:'') + '\t' + (balance.side=='credit'?balance.amount:'') + '\n'
									});

									sShow += 'TOTAL:\t' + ns1blankspace.util.financial.data.transactions.totals.debit + '\t' + ns1blankspace.util.financial.data.transactions.totals.credit + '\n';

									sShow += 'DIFF:\t' + (ns1blankspace.util.financial.data.transactions.totals.debit - ns1blankspace.util.financial.data.transactions.totals.credit) + '\n';

									return sShow
								},

					notReconciled: 	function (oParam)
								{
									var sShow = '\n';
									var cTotalCredit = 0;
									var cTotalDebit = 0;

									$.each($.grep(ns1blankspace.util.financial.data.transactions.current, function (a) {return a.notReconciled}), function (i, transaction)
									{
										sShow += transaction.date + '\t' + (transaction.side=='debit'?Math.abs(accounting.unformat(transaction.amount)):'') + '\t' + (transaction.side=='credit'?Math.abs(accounting.unformat(transaction.amount)):'') + '\n'

										if (transaction.side=='credit') {cTotalCredit = cTotalCredit + +Math.abs(accounting.unformat(transaction.amount)).toFixed(2)};
										if (transaction.side=='debit') {cTotalDebit = cTotalDebit + +Math.abs(accounting.unformat(transaction.amount)).toFixed(2)};
									});

									sShow += 'TOTAL:\t' + cTotalDebit + '\t' + cTotalCredit + '\n';

									sShow += 'DIFF:\t' + (cTotalDebit - cTotalCredit) + '\n';

									return sShow
								}
				}					
}	