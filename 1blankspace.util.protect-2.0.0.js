/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

ns1blankspace.util.protect =
{
	exists: 	function (oParam)
				{
					return ('CryptoJS' in window);
				},

	key: 		{
					data: 		{},

					create: 	{				
									single:		function(oParam)
												{
													var iType
													var bPersist = ns1blankspace.util.getParam(oParam, 'persist', {"default": false}).value;
													var sCryptoKeyReference = ns1blankspace.util.getParam(oParam, 'cryptoKeyReference').value;
													var bLocal = ns1blankspace.util.getParam(oParam, 'local', {"default": false}).value;

													var sSalt = CryptoJS.lib.WordArray.random(128/8);
													var sPassword = ns1blankspace.logonKey;
													if (sPassword == undefined) {sPassword = (Math.random()).toString()}
													var sCryptoKey = CryptoJS.PBKDF2(sPassword, sSalt, { keySize: 512/32 }).toString();
		
													if (sCryptoKeyReference !== undefined)
													{	
														ns1blankspace.util.protect.key.data[sCryptoKeyReference] = sCryptoKey;
													}	

													if (bPersist)
													{	
														if (bLocal)
														{	
															oParam = ns1blankspace.util.setParam(oParam, 'key', sCryptoKeyReference);
															oParam = ns1blankspace.util.setParam(oParam, 'data', sCryptoKey);
															//oParam = ns1blankspace.util.setParam(oParam, 'protect', false);
															ns1blankspace.util.local.cache.save(oParam);
														}
														else
														{
															var oData = 
															{
																reference: sCryptoKeyReference,
																key: sCryptoKey
															}

															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI('CORE_PROTECT_KEY_MANAGE'),
																data: oData,
																dataType: 'json',
																success: function ()
																{
																	//Show Error
																}
															});		
														}
													}

													ns1blankspace.util.whenCan.return({data: sCryptoKey})
												},

									pair: 		function(oParam) {}			
								},			

					search: 	function(oParam, oResponse)
								{
									var bLocal = ns1blankspace.util.getParam(oParam, 'local', {"default": false}).value;
									var sCryptoKeyReference = ns1blankspace.util.getParam(oParam, 'cryptoKeyReference').value;

									if (ns1blankspace.util.protect.key.data[sCryptoKeyReference] !== undefined)
									{	
										oParam = ns1blankspace.util.setParam(oParam, 'cryptoKey', ns1blankspace.util.protect.key.data[sCryptoKeyReference]);
										ns1blankspace.debug.message(oParam);
										//ns1blankspace.util.onComplete(oParam);
										return ns1blankspace.util.whenCan.return(ns1blankspace.connect.protect.key.value, oParam);
									}
									else
									{	
										if (!bLocal && oResponse === undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'CORE_PROTECT_KEY_SEARCH';
											oSearch.addField('key');
											oSearch.addField(ns1blankspace.option.auditFields);
											oSearch.addFilter('reference', 'EQUAL_TO', sCryptoKeyReference);
											oSearch.sort('modifieddate', 'desc');
											
											oSearch.getResults(function(data)
											{
												ns1blankspace.util.protect.key.search(oParam, data)
											});
										}
										else
										{
											if (bLocal)
											{
												oParam = ns1blankspace.util.setParam(oParam, 'key', sCryptoKeyReference);
												var sCryptoKey = ns1blankspace.util.local.cache.search(oParam);
											}	
											else
											{
												if (oResponse.data.rows.length !== 0)
												{	
													var sCryptoKey = oResponse.data.rows[0].key;
												}
												else
												{
													//{cryptoKeyReference: ns1blankspace.util.local.cache.data.cryptoKeyReference, persist: true}
													oParam =  ns1blankspace.util.setParam(oParam, 'persist', true);
													ns1blankspace.util.protect.key.create.single(oParam)
												}	
											}

											ns1blankspace.util.protect.key.data[sCryptoKeyReference] = sCryptoKey;
											//oParam = ns1blankspace.util.setParam(oParam, 'cryptoKey', sCryptoKey);
											ns1blankspace.debug.message(sCryptoKeyReference + ':' + sCryptoKey);

											//ns1blankspace.util.onComplete(oParam);
											return ns1blankspace.util.whenCan.return(sCryptoKey, oParam);
										}
									}	
								}					
				},

	encrypt: 	function(oParam)
				{
					if (ns1blankspace.util.getParam(oParam, 'cryptoKey').exists)
					{
						var sData = ns1blankspace.util.getParam(oParam, 'data', {remove: true}).value;
						var sCryptoKey = ns1blankspace.util.getParam(oParam, 'cryptoKey', {remove: true}).value;
						var sProtectedData = CryptoJS.AES.encrypt(sData, sCryptoKey).toString();

						oParam = ns1blankspace.util.setParam(oParam, 'protectedData', sProtectedData);
						ns1blankspace.debug.message('ENCRYPTING');
						ns1blankspace.debug.message(oParam);
						if (ns1blankspace.util.getParam(oParam, 'onComplete').exists)
						{	
							ns1blankspace.util.onComplete(oParam)
						}
						else
						{
							return ns1blankspace.util.whenCan.return(ns1blankspace.connect.protect.key.value, oParam);
						}	
					}
					else
					{	
						ns1blankspace.util.whenCan.execute(
						{
							now:
							{
								method: ns1blankspace.util.protect.key.search,
								param: oParam
							},
							later:
							{
								method: ns1blankspace.util.protect.encrypt,
								set: 'cryptoKey'
							}	
						});
						//oParam.onComplete = ns1blankspace.util.protect.encrypt;
						//ns1blankspace.util.protect.key.search(oParam)
					}	
				},

	decrypt: 	function(oParam)
				{
					if (ns1blankspace.util.getParam(oParam, 'cryptoKey').value)
					{
						var sProtectedData = ns1blankspace.util.getParam(oParam, 'protectedData', {remove: true}).value;
						var sCryptoKey = ns1blankspace.util.getParam(oParam, 'cryptoKey', {remove: true}).value;
						var sData = CryptoJS.AES.decrypt(sProtectedData, sCryptoKey).toString(CryptoJS.enc.Utf8);

						oParam = ns1blankspace.util.setParam(oParam, 'data', sData)
						ns1blankspace.debug.message('DECRYPTING');
						ns1blankspace.debug.message(oParam);
						if (ns1blankspace.util.getParam(oParam, 'onComplete').exists)
						{	
							ns1blankspace.util.onComplete(oParam)
						}
						else
						{
							return ns1blankspace.util.whenCan.return(ns1blankspace.connect.protect.key.value, oParam);
						}	
					}
					else
					{	
						ns1blankspace.util.whenCan.execute(
						{
							now:
							{
								method: ns1blankspace.util.protect.key.search,
								param: oParam
							},
							later:
							{
								method: ns1blankspace.util.protect.decrypt,
								set: 'cryptoKey'
							}	
						});
						//oParam.onComplete = ns1blankspace.util.protect.decrypt;
						//ns1blankspace.util.protect.key.search(oParam)
					}	
				}								
}	