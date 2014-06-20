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

													var sSavedCryptoKey = ns1blankspace.util.getParam(oParam, 'savedCryptoKey').value;

													if (!sSavedCryptoKey)
													{	
														var sSalt = CryptoJS.lib.WordArray.random(128/8);
														var sPassword = ns1blankspace.logonKey;
														if (sPassword == undefined) {sPassword = (Math.random()).toString()}
														var sCryptoKey = CryptoJS.PBKDF2(sPassword, sSalt, { keySize: 512/32 }).toString();

														if (bPersist)
														{	
															if (bLocal)
															{	
																//oParam = ns1blankspace.util.setParam(oParam, 'key', sCryptoKeyReference);
																//oParam = ns1blankspace.util.setParam(oParam, 'data', sCryptoKey);

																ns1blankspace.util.whenCan.execute(
																{
																	now:
																	{
																		method: ns1blankspace.util.local.cache.save,
																		param:
																		{
																			key: sCryptoKeyReference,
																			cryptoKeyReference: sCryptoKeyReference,
																			persist: true,
																			protect: oParam.protect,
																			data: sCryptoKey
																		}
																	},
																	then:
																	{
																		comment: 'util.local.cache.save<>util.protect.key.create.single',
																		method: ns1blankspace.util.protect.key.create.single,
																		set: 'savedCryptoKey',
																		param: oParam
																	}	
																});

																//ns1blankspace.util.local.cache.save(oParam);
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
																		oParam.savedCryptoKey = sCryptoKey;
																		ns1blankspace.util.protect.key.create.single(oParam)
																	}
																});		
															}
														}
													}
													else
													{	
														if (sCryptoKeyReference !== undefined)
														{	
															ns1blankspace.util.protect.key.data[sCryptoKeyReference] = sCryptoKey;
														}

														return ns1blankspace.util.whenCan.return(sSavedCryptoKey, oParam)
													}	
												},

									pair: 		function(oParam) {}			
								},			

					search: 	function(oParam, oResponse)
								{
									var bLocal = ns1blankspace.util.getParam(oParam, 'local', {"default": false}).value;
									var sCryptoKeyReference = ns1blankspace.util.getParam(oParam, 'cryptoKeyReference').value;

									if (ns1blankspace.util.protect.key.data[sCryptoKeyReference] !== undefined)
									{	
										ns1blankspace.util.whenCan.return(ns1blankspace.util.protect.key.data[sCryptoKeyReference], oParam);
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
												//else
												//{
													//oParam =  ns1blankspace.util.setParam(oParam, 'persist', true);
													//ns1blankspace.util.protect.key.create.single(oParam)
												//}	
											}

											if (sCryptoKey)
											{	
												ns1blankspace.util.protect.key.data[sCryptoKeyReference] = sCryptoKey;
											}

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

						if (ns1blankspace.util.getParam(oParam, 'onComplete').exists)
						{	
							oParam = ns1blankspace.util.setParam(oParam, 'protectedData', sProtectedData);
							ns1blankspace.util.onComplete(oParam)
						}
						else
						{
							return ns1blankspace.util.whenCan.return(sProtectedData, oParam);
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
							then:
							{
								comment: 'util.protect.key.search<>util.protect.encrypt',
								method: ns1blankspace.util.protect.encrypt,
								set: 'cryptoKey',
								param: oParam
							}	
						});
					}	
				},

	decrypt: 	function(oParam)
				{
					if (ns1blankspace.util.getParam(oParam, 'cryptoKey').value)
					{
						var sProtectedData = ns1blankspace.util.getParam(oParam, 'protectedData', {remove: true}).value;
						var sCryptoKey = ns1blankspace.util.getParam(oParam, 'cryptoKey', {remove: true}).value;
						var sData = CryptoJS.AES.decrypt(sProtectedData, sCryptoKey).toString(CryptoJS.enc.Utf8);

						if (ns1blankspace.util.getParam(oParam, 'onComplete').exists)
						{	
							oParam = ns1blankspace.util.setParam(oParam, 'data', sData)
							ns1blankspace.util.onComplete(oParam)
						}
						else
						{
							return ns1blankspace.util.whenCan.return(sData, oParam);
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
							then:
							{
								comment: 'util.protect.key.search<>util.protect.decrypt',
								method: ns1blankspace.util.protect.decrypt,
								set: 'cryptoKey',
								param: oParam
							}	
						});
					}	
				}								
}	