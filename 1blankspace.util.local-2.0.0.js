/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

ns1blankspace.util.local =
{
	cache: 		{
					data: 		{cryptoKeyReference: 'local-cache-key'},

					exists: 	function (oParam)
								{
									var bPersist = ns1blankspace.util.getParam(oParam, "persist", {"default": false}).value;
									return (bPersist?'localStorage' in window:'sessionStorage' in window);
								},

					init: 		function (oParam)
								{
									ns1blankspace.debug.enabled = true;

									if (ns1blankspace.util.protect.key.search({key: ns1blankspace.util.local.cache.data.cryptoKeyReference, persist: true}) == undefined)
									{	
										ns1blankspace.util.protect.key.create.single({cryptoKeyReference: ns1blankspace.util.local.cache.data.cryptoKeyReference, persist: true})
									}	
								},			

					context: 	function (oParam)
								{
									var bUserContext = ns1blankspace.util.getParam(oParam, 'userContext', {"default": false}).value;
									var sKey = ns1blankspace.util.getParam(oParam, 'key').value;
									if (ns1blankspace.user.id == -1) {bUserContext = false}
									if (bUserContext) {sKey = ns1blankspace.user + '-' + sKey}
									return sKey;
								},			

					save: 		function (oParam)
								{
									if (ns1blankspace.util.local.cache.exists(oParam))
									{	
										var sKey = ns1blankspace.util.local.cache.context(oParam);
										var bPersist = ns1blankspace.util.getParam(oParam, 'persist', {"default": false}).value;
										var oStorage = (bPersist?localStorage:sessionStorage);

										var sData = ns1blankspace.util.getParam(oParam, 'data').value;
										var bProtect = ns1blankspace.util.getParam(oParam, 'protect', {"default": false}).value;

										if (typeof sData !== 'string')
										{
											sData = JSON.stringify(sData);
										}

										if (bProtect && ns1blankspace.util.protect !== undefined)
										{	
											if (ns1blankspace.util.getParam(oParam, 'protectedData').exists)
											{
												var sData = ns1blankspace.util.getParam(oParam, 'protectedData').value;
												oStorage.setItem(sKey, sData);
											}
											else
											{	
												oParam = ns1blankspace.util.setParam(oParam, 'cryptoKeyReference', ns1blankspace.util.local.cache.data.cryptoKeyReference);
												oParam = ns1blankspace.util.setParam(oParam, 'onCompleteWhenCan', ns1blankspace.util.local.cache.save);
												ns1blankspace.util.protect.encrypt(oParam);
											}	
										}
										else
										{
											oStorage.setItem(sKey, sData);
										}	
									}	
								},

					search: 	function (oParam)
								{
									if (ns1blankspace.util.local.cache.exists(oParam))
									{	
										var sKey = ns1blankspace.util.local.cache.context(oParam);
										var bPersist = ns1blankspace.util.getParam(oParam, 'persist', {"default": false}).value;
										var oStorage = (bPersist?localStorage:sessionStorage);
										var bJSON = ns1blankspace.util.getParam(oParam, 'json', {default: sKey.toLowerCase().indexOf('.json') != -1}).value;
										var bProtect = ns1blankspace.util.getParam(oParam, 'protect', {"default": false}).value;

										var oData = ns1blankspace.util.getParam(oParam, 'data').value;

										if (oData === undefined)
										{	
											var oData = oStorage.getItem(sKey);

											if (bProtect && ns1blankspace.util.protect !== undefined && oData !== null)
											{
												oParam = ns1blankspace.util.setParam(oParam, 'cryptoKeyReference', ns1blankspace.util.local.cache.data.cryptoKeyReference);
												oParam = ns1blankspace.util.setParam(oParam, 'cryptoKey', ns1blankspace.util.protect.key.data[ns1blankspace.util.local.cache.data.cryptoKeyReference]);
												oParam = ns1blankspace.util.setParam(oParam, 'protectedData', oData);
												oParam = ns1blankspace.util.setParam(oParam, 'onCompleteWhenCan', ns1blankspace.util.local.cache.search);

												ns1blankspace.util.whenCan.execute(
												{
													now:
													{
														method: ns1blankspace.util.protect.decrypt,
														param: oParam
													},
													later:
													{
														method: ns1blankspace.util.local.cache.search,
														set: 'data'
													}	
												});
											}
											else
											{
												oParam.data = oData;
												ns1blankspace.util.local.cache.search(oParam)
											}
										}	
										else		
										{
											if (bJSON && oData !== undefined)
											{
												oData = JSON.parse(oStorage.getItem(sKey));
											}

											oParam.data = oData;
											ns1blankspace.util.whenCan.return(oParam);
										}	
									}	
								},

					remove: 	function (oParam)
								{
									if (ns1blankspace.util.local.cache.exists(oParam))
									{	
										var sKey = ns1blankspace.util.local.cache.context(oParam);
										var bPersist = ns1blankspace.util.getParam(oParam, 'persist', {"default": false}).value;
										var bAll = ns1blankspace.util.getParam(oParam, 'all', {"default": false}).value;
										var oStorage = (bPersist?localStorage:sessionStorage);

										if (bAll)
										{
											oStorage.clear()
										}
										else
										{
											oStorage.removeItem(sKey);
										}	
									}	
								}
				}
}		