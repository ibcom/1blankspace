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
	data: 		{transactions: {}, objects: []},

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

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
										oSearch.addField('financialaccount,amount,date,object,objectcontext,modifieddate,createddate');
										
										oSearch.addFilter('date', 'GREATER_THAN_OR_EQUAL_TO', sStartDate);
										oSearch.addFilter('date', 'LESS_THAN_OR_EQUAL_TO', sEndDate);

										oSearch.rows = 1000;
										oSearch.getResults(function(oResponse)
										{
											if (oResponse.morerows != "true")
											{
												ns1blankspace.util.financial.data.transactions.raw = oResponse.data.rows;
												ns1blankspace.util.financial.data.transactions.raw.sort(ns1blankspace.util.sortBy('id'));
												ns1blankspace.util.onComplete(oParam);
											}	
										});
									}
				},

	prepare: 	function (oParam)
				{
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
					
					ns1blankspace.util.financial.data.transactions.current = $.extend(true, [], ns1blankspace.util.financial.data.transactions.raw);

					ns1blankspace.util.financial.data.transactions.current =
							$.grep(ns1blankspace.util.financial.data.transactions.current, function (a) {return (iObject==undefined?true:a.object==iObject)});
					
					$.each(ns1blankspace.util.financial.data.transactions.current, function (i, v)
					{
						v.financialaccount = $.grep(ns1blankspace.util.financial.data.accounts, function (a) {return a.id = v.financialaccount})[0];
					});
				},

	process: 	function (oParam)
				{
					ns1blankspace.util.financial.data.objects.length = 0;

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
							object.total = object.total + parseFloat(transaction.amount);
						});
					});
				}
}	