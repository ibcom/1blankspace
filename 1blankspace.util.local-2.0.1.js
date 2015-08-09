/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

ns1blankspace.util.local =
{
	cache: 		{
					data: 		{cryptoKeyReference: '1blankspace-local-cache-key'},

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
										var bAdvanced = (ns1blankspace.util.getParam(oParam, 'advanced', {"default": false}).value &&
															ns1blankspace.util.local.db.exists() && bPersist);

										if (typeof sData !== 'string')
										{
											sData = JSON.stringify(sData);
										}

										if (bProtect && ns1blankspace.util.protect !== undefined)
										{	
											if (ns1blankspace.util.getParam(oParam, 'protectedData').exists)
											{
												var sData = ns1blankspace.util.getParam(oParam, 'protectedData').value;

												if (bAdvanced && ns1blankspace.util.local.db.exists())
												{
													oParam = ns1blankspace.util.setParam(oParam, 'key', sKey);
													oParam = ns1blankspace.util.setParam(oParam, 'data', sData)
													ns1blankspace.util.local.db.save(oParam);
												}
												else
												{	
													oStorage.setItem(sKey, sData);
													return ns1blankspace.util.whenCan.complete(sData, oParam);
												}
											}
											else
											{	
												ns1blankspace.util.whenCan.execute(
												{
													now:
													{
														method: ns1blankspace.util.protect.encrypt,
														param:
														{
															cryptoKeyReference: ns1blankspace.util.local.cache.data.cryptoKeyReference,
															local: false,
															data: sData
														}
													},
													then:
													{
														comment: 'util.protect.encrypt<>util.local.cache.save',
														method: ns1blankspace.util.local.cache.save,
														set: 'protectedData',
														param: oParam
													}	
												});
											}	
										}
										else
										{
											oStorage.setItem(sKey, sData);

											return ns1blankspace.util.whenCan.complete(sData, oParam);
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
										var bJSON = ns1blankspace.util.getParam(oParam, 'json', {"default": sKey.toLowerCase().indexOf('.json') != -1}).value;
										var bProtect = ns1blankspace.util.getParam(oParam, 'protect', {"default": false}).value;
										var bAdvanced = (ns1blankspace.util.getParam(oParam, 'advanced', {"default": false}).value &&
															ns1blankspace.util.local.db.exists() && bPersist);

										var oData = ns1blankspace.util.getParam(oParam, 'data');

										if (!oData.exists)
										{	
											var sData = oStorage.getItem(sKey);
											if (sData == null) {sData = undefined}

											if (bProtect && ns1blankspace.util.protect !== undefined && sData !== undefined)
											{
												oParam = ns1blankspace.util.setParam(oParam, 'cryptoKeyReference', ns1blankspace.util.local.cache.data.cryptoKeyReference);
												oParam = ns1blankspace.util.setParam(oParam, 'cryptoKey', ns1blankspace.util.protect.key.data[ns1blankspace.util.local.cache.data.cryptoKeyReference]);
												oParam = ns1blankspace.util.setParam(oParam, 'protectedData', sData);

												ns1blankspace.util.whenCan.execute(
												{
													now:
													{
														method: ns1blankspace.util.protect.decrypt,
														param:
														{
															cryptoKeyReference: ns1blankspace.util.local.cache.data.cryptoKeyReference,
															cryptoKey: ns1blankspace.util.protect.key.data[ns1blankspace.util.local.cache.data.cryptoKeyReference],
															protectedData: sData
														}
													},
													then:
													{
														comment: 'util.protect.decrypt<>util.local.cache.search',
														method: (bAdvanced?ns1blankspace.util.local.db.search:ns1blankspace.util.local.cache.search),
														set: 'data',
														param: oParam
													}	
												});
											}
											else
											{
												oParam.data = sData;
												if (bAdvanced)
												{
													ns1blankspace.util.local.db.search(oParam)
												}
												else
												{	
													ns1blankspace.util.local.cache.search(oParam)
												}	
											}
										}	
										else		
										{
											var oDataReturn = oData.value;

											if (bJSON && oDataReturn !== undefined)
											{
												oDataReturn = JSON.parse(oDataReturn);
											}

											ns1blankspace.util.whenCan.complete(oDataReturn, oParam);
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
										var bAdvanced = (ns1blankspace.util.getParam(oParam, 'advanced', {"default": false}).value &&
															ns1blankspace.util.local.db.exists() && bPersist);

										if (bAll)
										{
											oStorage.clear()
										}
										else
										{
											if (bAdvanced)
											{	
												ns1blankspace.util.local.db.remove(oParam);
											}
											else
											{	
												oStorage.removeItem(sKey);
											}
										}	
									}	
								}
				},

	db: 		{
					data: 		{param: {}},

					exists: 	function () {return (indexedDB!=undefined)},

					init: 		function(oParam)
								{
									//https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

									ns1blankspace.util.local.db.data.param.init = oParam;

									var request = indexedDB.open('1blankspace-local', 1);

									request.onerror = function(event) {};

									request.onsuccess = function(event)
									{
									  	ns1blankspace.util.local.db.store = event.target.result;
									  	return ns1blankspace.util.whenCan.complete(true, ns1blankspace.util.local.db.data.param.init);
									};

									request.onupgradeneeded = function(event)
									{
									  ns1blankspace.util.local.db.store = event.target.result;
									  var objectStore = ns1blankspace.util.local.db.store.createObjectStore("cache", { keyPath: "name" });
									  objectStore.createIndex("name", "name", { unique: true });

									  objectStore.transaction.oncomplete = function(event)
									  {
										ns1blankspace.util.local.db.init()
									  }
									};
								},

					save: 		function(oParam)
								{
									if (ns1blankspace.util.local.db.store == undefined)
									{
										ns1blankspace.util.whenCan.execute(
										{
											now:
											{
												method: ns1blankspace.util.local.db.init,
												param: {}
											},
											then:
											{
												comment: 'util.local.db.init<>util.local.db.save',
												method: ns1blankspace.util.local.db.save,
												set: 'initialised',
												param: oParam
											}	
										});
									}	
									else
									{
										ns1blankspace.util.local.db.data.param.save = oParam;

										var sKey = ns1blankspace.util.getParam(oParam, 'key', {"default": false}).value;
										var sData = ns1blankspace.util.getParam(oParam, 'data', {"default": false}).value;

										var transaction = ns1blankspace.util.local.db.store.transaction(["cache"], "readwrite");
										transaction.oncomplete = function(event) {};
										transaction.onerror = function(event) {};

										var objectStore = transaction.objectStore("cache");

										var requestGet = objectStore.get(sKey);
										requestGet.onerror = function(event) {};
										requestGet.onsuccess = function(event)
										{
										  	var data = requestGet.result;

										  	if (data == undefined)
										  	{
										  		var requestAdd = objectStore.add({"name": sKey, "value": sData});

												requestAdd.onsuccess = function(event)
												{
													return ns1blankspace.util.whenCan.complete(true, ns1blankspace.util.local.db.data.param.init);
												};
												requestAdd.onerror = function(event) {};  
											}	
											else
											{
												data.value = sData;

												var requestUpdate = objectStore.put(data);
												requestUpdate.onerror = function(event) {};
												requestUpdate.onsuccess = function(event)
												{
													return ns1blankspace.util.whenCan.complete(true, ns1blankspace.util.local.db.data.param.init);
												};
											}
										};
									}	
								},

					search: 	function(oParam)
								{
									if (ns1blankspace.util.local.db.store == undefined)
									{
										ns1blankspace.util.whenCan.execute(
										{
											now:
											{
												method: ns1blankspace.util.local.db.init,
												param: {}
											},
											then:
											{
												comment: 'util.local.db.init<>util.local.db.search',
												method: ns1blankspace.util.local.db.search,
												set: 'initialised',
												param: oParam
											}	
										});
									}	
									else
									{
										ns1blankspace.util.local.db.data.param.search = oParam;
										
										var sKey = ns1blankspace.util.getParam(oParam, 'key', {"default": false}).value;
									
										var transaction = ns1blankspace.util.local.db.store.transaction(["cache"], "readwrite");
										transaction.oncomplete = function(event) {};
										transaction.onerror = function(event) {};

										var objectStore = transaction.objectStore("cache");

										var requestGet = objectStore.get(sKey);
										requestGet.onerror = function(event) {};
										requestGet.onsuccess = function(event)
										{
										  	var data = requestGet.result;
										  	if (data != undefined) {data = data.value}

										  	return ns1blankspace.util.whenCan.complete(data, ns1blankspace.util.local.db.data.param.search);
										};
									}	
								},

					remove: 	function(oParam)
								{
									if (ns1blankspace.util.local.db.store == undefined)
									{
										ns1blankspace.util.whenCan.execute(
										{
											now:
											{
												method: ns1blankspace.util.local.db.init,
												param: {}
											},
											then:
											{
												comment: 'util.local.db.init<>util.local.db.remove',
												method: ns1blankspace.util.local.db.remove,
												set: 'initialised',
												param: oParam
											}	
										});
									}	
									else
									{
										ns1blankspace.util.local.db.data.param.remove = oParam;
									
										var sKey = ns1blankspace.util.getParam(oParam, 'key', {"default": false}).value;
						
										var transaction = ns1blankspace.util.local.db.store.transaction(["cache"], "readwrite");
										transaction.oncomplete = function(event) {};
										transaction.onerror = function(event) {};

										var objectStore = transaction.objectStore("cache");

										var requestDelete = objectStore.delete(sKey);
										requestDelete.onerror = function(event) {};
										requestDelete.onsuccess = function(event)
										{
										  	return ns1blankspace.util.whenCan.complete(true, ns1blankspace.util.local.db.data.param.remove);
										};
									}	
								}														
				}			
}		