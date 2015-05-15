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
										oSearch.addField('financialaccount,amount,date,object,objectcontext,modifieddate,createddate,description');
										
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
													function (v) {return v.objectcontext});

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
								}

				}			

}	