/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 *
 * Reference: http://www.mydigitalstructure.com/advancedSearch_direct
 *
 * Example usage:
 *
 		ns1blankspace.util.whenDone.init({manifest:
		{
			success: 	'nsXXX.populate',
			error: 		'nsXXX.error',
			store: 		'nsXXX.data',
			timeout: 	15,
			search:
			[
				{
					name: 'bankAccount',
					method: 'FINANCIAL_BANK_ACCOUNT_SEARCH',
					criteria:
					{
						"fields":
						[
							{
								"name": "lastreconciledamount"
							}
						],
						
						"sorts":
						[
							{
								"name": "lastreconcileddate",
								"direction": "desc"
							}
						],
						"options":
						{	
							"rows": "1"
						}
					}
				},
				{
					name: 'promisedIns',
					uri: '/rpc/financial/?method=FINANCIAL_DEBTOR_SEARCH&rows=100',
				},
			]
		});
 *
 *		1. timeout: is the number of seconds before error: function is called.
 * 		2. All the returned data is set in the store: object under its allocated name:.
 */


ns1blankspace.util.whenDone =
{
	data: 		{},

	init:		function (oParam)
				{
					var oManifest = ns1blankspace.util.getParam(oParam, 'manifest').value;
					var bIsLoggedOn  = ns1blankspace.util.getParam(oParam, 'isLoggedOn', {"default": false}).value;
					var iTimeout  = ns1blankspace.util.getParam(oParam, 'timeout').value;
					var iTimer  = ns1blankspace.util.getParam(oParam, 'timer').value;

					if (!bIsLoggedOn)
					{
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('CORE_GET_USER_DETAILS'),
							dataType: 'json',
							cache: false,
							global: false,
							success: function(data) 
							{
								oParam = ns1blankspace.util.setParam(oParam, 'isLoggedOn', (data.status=='OK'));
								ns1blankspace.util.whenDone.init(oParam);
							}
						});	
					}
					else
					{
						if (iTimeout !== undefined)
						{
							if (iTimer != 0) {clearTimeout(iTimer)};
							var oErrorParam = $.extend(true, {}, oParam);
							oErrorParam =  ns1blankspace.util.setParam(oErrorParam, 'error', true);
						    iTimer = setTimeout('ns1blankspace.util.whenDone.callError(' + JSON.stringify(oErrorParam) + ')', iTimeout/1000);
						    oParam = ns1blankspace.util.setParam(oParam, 'timer', iTimer);
						}

						$.each(oManifest.search, function(i, oSearch)
						{
							if (oSearch.uri != undefined)
							{
								$.ajax(
								{
									type: 'POST',
									url: oSearch.uri,
									data: oSearch.criteria,
									dataType: 'json',
									success: function(data)
									{
										ns1blankspace.util.whenDone.response(oParam, oSearch, data)
									}
								});
							}
							else
							{
								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI(oSearch.method),
									data: JSON.stringify(oSearch.criteria),
									dataType: 'json',
									success: function(data)
									{
										ns1blankspace.util.whenDone.response(oParam, oSearch, data)
									}
								});
							}	
						});
					}	
				},

	response: 	function (oParam, oSearch, oResponse)
				{
					var oManifest = ns1blankspace.util.getParam(oParam, 'manifest').value;
					var oStore = ns1blankspace.util.toFunction(oManifest.store);
					oStore[oSearch.name] = oResponse.data;
					ns1blankspace.util.whenDone.checkIfDone(oParam);
				},

	checkIfDone: 	
				function (oParam)
				{
					var oManifest = ns1blankspace.util.getParam(oParam, 'manifest').value;
					var iTimer = ns1blankspace.util.getParam(oParam, 'timer').value;
					var bError = ns1blankspace.util.getParam(oParam, 'error', {"default": false}).value;

					var iStoreLength = 0;
					var oStore = ns1blankspace.util.toFunction(oManifest.store);

					for (var key in oStore)
					{
    					if (oStore.hasOwnProperty(key))
    					{
    						iStoreLength++;
    					}
					}

					if (!bError & (iStoreLength == oManifest.search.length))
					{
						if (iTimer != 0) {clearTimeout(iTimer)};
						ns1blankspace.util.execute(oManifest.success, oParam)
					}
				},

	callError: 	function (oParam)
				{
					var oManifest = ns1blankspace.util.getParam(oParam, 'manifest').value;
					ns1blankspace.util.execute(oManifest.error, oParam)
				}								
}	