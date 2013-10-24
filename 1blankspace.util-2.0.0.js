if (ns1blankspace === undefined)
{
	ns1blankspace = {};
}

ns1blankspace.util =
{
	setParam: 	function(oParam, sParam, sValue, oOption)
				{
					var bOnlyIfMissing = false;

					if (ns1blankspace.util.param(oOption, 'onlyIfMissing').exists)
					{
						bOnlyIfMissing = ns1blankspace.util.param(oOption, 'onlyIfMissing').value
					}

					if (oParam === undefined) {oParam = {}}

					if (oParam.hasOwnProperty(sParam))
					{
						if (!bOnlyIfMissing) {oParam[sParam] = sValue};
					}
					else
					{
						oParam[sParam] = sValue;
					}
						
					return oParam
				},	

	getParam: 	function(oParam, sParam, oOption)
				{
					var sDefault;
					var sSplit;
					var iIndex;

					var oReturn = {exists: false};

					if (ns1blankspace.util.param(oOption, 'default').exists)
					{
						oReturn.value = ns1blankspace.util.param(oOption, 'default').value
					}

					if (ns1blankspace.util.param(oOption, 'split').exists)
					{
						sSplit = ns1blankspace.util.param(oOption, 'split').value
					}

					if (ns1blankspace.util.param(oOption, 'index').exists)
					{
						iIndex = ns1blankspace.util.param(oOption, 'index').value
					}

					if (oParam !== undefined) 
					{ 
						if (oParam.hasOwnProperty(sParam))
						{
							oReturn.value = oParam[sParam];
							oReturn.exists = true;

							if (iIndex !== undefined && sSplit === undefined) {sSplit = '-'}

							if (sSplit !== undefined)
							{
								if (oParam[sParam] !== undefined)
								{	
									oReturn.values = oParam[sParam].split(sSplit);

									if (iIndex !== undefined)
									{
										if (iIndex < oReturn.values.length)
										{
											oReturn.value = oReturn.values[iIndex];
										}
									}
								}	
							}
						}	
					}	

					return oReturn;
				},

	getData: 	function(oParam, sDataKey, oOption)
				{
					var sParam;
				
					var oReturn = {exists: false};

					if (ns1blankspace.util.param(oOption, 'param').exists)
					{
						sParam = ns1blankspace.util.param(oOption, 'param').value;
					}
					else
					{
						sParam = 'xhtmlElementID';
					}

					if (ns1blankspace.util.param(oParam, sParam).exists)
					{
						var sXHTMLElementID = ns1blankspace.util.param(oParam, sParam).value;
						oReturn.value = $('#' + sXHTMLElementID).attr(sDataKey);
						oReturn.exists = (oReturn.value !== undefined);
					}

					if (!oReturn.exists && ns1blankspace.util.param(oOption, 'default').exists)
					{
						oReturn.value = ns1blankspace.util.param(oOption, 'default').value
					}
					
					return oReturn;
				},

	getRow: 	function(oResponse, sDataKey, oOption)
				{
					var oReturn;

					if (oResponse.status == 'OK')
					{
						if (oResponse.data.rows !== undefined)
						{	
							iRow = ns1blankspace.util.getParam(oOption, 'row', {"default": 0}).value;

							if (iRow < oResponse.data.rows.length)
							{
								var oReturn = oResponse.data.rows[iRow];

								if (ns1blankspace.util.param(oOption, 'attr').exists)
								{
									oReturn = oReturn[ns1blankspace.util.param(oOption, 'property').value]
								}	
							}	
						}	
					}

					return oReturn;
				},								

	param: 		function(oParam, sParam, sSplit)
				{
					var oReturn = {exists: false};

					if (oParam !== undefined) 
					{ 
						if (oParam.hasOwnProperty(sParam))
						{
							oReturn.value = oParam[sParam];
							oReturn.exists = true;

							if (sSplit !== undefined)
							{
								oReturn.values = oParam[sParam].split(sSplit);
							}
						}	
					}	

					return oReturn;
				},

	json: 		function (oJSON, sElement, iRow)
				{
					oJSON = (oJSON === undefined)?'':oJSON;
					sElement = (sElement === undefined)?'':asElement;
					iRow = (iRow === undefined)?0:iRow;
					
					if (oJSON.length === 0) return '';
					
					if (sElement === '' || aiRow < 0) return '';
					
					if (oJSON.data.rows.length > 0)
					{	return oJSON.data.rows[iRow][sElement];	}
					else
					{	return '';}
				},

	tf2OnOff:	function (bValue)
				{
					if (bValue === undefined) {bValue = false}
					
					if (bValue)
					{ 
						return '1';
					}
					else
					{
						return '0';
					}	
					
				},

	onOff2TF:	function (sValue)
				{
					if (sValue === undefined) {sValue = '0'}
					
					if (sValue === '1')
					{ 
						return true;
					}
					else
					{
						return false;
					}	
				},

	tf2YN:		function (bValue)
				{
					if (bValue === undefined) {bValue = false}
					
					if (bValue)
					{ 
						return 'Y';
					}
					else
					{
						return 'N';
					}	
				},

	yn2tf:		function (sValue)
				{
					if (sValue === undefined) {sValue = 'N'}
					
					if (sValue === 'Y')
					{ 
						return true;
					}
					else
					{
						return false;
					}	
				},

	formatSave:	function (sValue)
				{
					if (sValue === undefined || sValue === 'undefined') { sValue = ''; }
					
					return encodeURIComponent(sValue)

				},

	fs:			function (sValue) {return this.formatSave(sValue)},

	fz: 		function (sValue)
				{
					if (sValue === undefined || sValue === 'undefined') { sValue = 0; }
					
					if (parseInt((sValue).parseCurrency()) === 0)
					{
						return '-';
					}
					else
					{
						return sValue
					}	
				},

	getID:		function (sValue) {return (sValue).split('-')[1]},

	getMethods:		function ()
				{
					if (ns1blankspace.methods === undefined)
					{
						$.ajax(
						{
							type: 'GET',
							url: '/jscripts/1blankspace.rpc-2.0.0.json',
							dataType: 'json',
							async: false,
							success: function(data) {ns1blankspace.methods = data.methods}
						});
					}
				},

	endpointURI:
				function (sMethod)
				{
					ns1blankspace.util.getMethods();

					var sBaseEndpoint = '/ondemand/';

					var oMethod = $.grep(ns1blankspace.methods, function (a) {return a.title == sMethod;})	

					if (oMethod.length != 0) 
					{
						if (oMethod[0].rpc == 'true')
						{	
							sBaseEndpoint = '/rpc/';
						}	
					}

					var aMethod = sMethod.split('_');
					var sEndpoint = aMethod[0];
					
					return sBaseEndpoint + (aMethod[0]).toLowerCase() + '/?method=' + (sMethod).toUpperCase();
				},

	isMethodAdvancedSearch:
				function (sMethod)
				{
					ns1blankspace.util.getMethods();

					var sBaseEndpoint;

					var oMethod = $.grep(ns1blankspace.methods, function (a) {return a.title == sMethod;})	

					if (oMethod.length == 0) 
					{
						return false;
					}
					else
					{
						return (oMethod[0].advancedSearch == 'true');
					}
				},

	uri: 		{
					parameters: 	function()
									{
										var vars = [], hash;
										var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
										
										for (var i = 0; i < hashes.length; i++)
										{
											hash = hashes[i].split('=');
											vars.push(hash[0]);
											vars[hash[0]] = hash[1];
										};
										
										return vars;
									},

					parameter: 		function(sName)
									{
										return $.urlParameters()[sName];
									}
				},

	unique: 	function (oParam)
				{
					var oData;
					var sKey;
					var oUniqueData = [];
					var aUniqueKey = [];

					if (oParam != undefined)
					{
						if (oParam.data != undefined) {oData = oParam.data}
						if (oParam.key != undefined) {sKey = oParam.key}	

						$.each(oData, function()
						{
							if ($.inArray(this[sKey], aUniqueKey) === -1)
							{
								aUniqueKey.push(this[sKey]);
								oUniqueData.push(this);
							}	
						});

						return oUniqueData;
					}		
				},

	initTemplate:  	
				function (oParam)
				{
					var sTemplate = 'invoice';

					if (ns1blankspace.util.param(oParam, 'template').exists) {sTemplate = ns1blankspace.util.param(oParam, 'template').value}

					if (ns1blankspace.xhtml.templates[sTemplate] == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'DOCUMENT_SEARCH';
						oSearch.addField('title,content');
						oSearch.addFilter('type', 'EQUAL_TO', 10);
						oSearch.addFilter('title', 'EQUAL_TO', (sTemplate).toUpperCase() + ' TEMPLATE');

						oSearch.getResults(function(oResponse)
						{
							if (oResponse.data.rows.length == 0) 
							{
								if (ns1blankspace.xhtml.templates.source[sTemplate] !== undefined)
								{	
									$.ajax(
									{
										type: 'GET',
										url: ns1blankspace.xhtml.templates.source[sTemplate],
										dataType: 'text',
										global: false,
										success: function(data)
										{
											ns1blankspace.xhtml.templates[sTemplate] = data;
											ns1blankspace.util.onComplete(oParam);
										},
										error: function(data)
										{
											ns1blankspace.xhtml.templates[sTemplate] = '';
											ns1blankspace.util.onComplete(oParam);
										}
									});	
								}	
							}
							else
							{
								ns1blankspace.xhtml.templates[sTemplate] = (oResponse.data.rows[0].content).formatXHTML();
								ns1blankspace.xhtml.templates.document[sTemplate] = oResponse.data.rows[0].id;
								ns1blankspace.util.onComplete(oParam);
							}
						});		
					}
					else
					{
						ns1blankspace.util.onComplete(oParam);
					}
				},

	onComplete: function (oParam)
				{
					if (ns1blankspace.util.param(oParam, 'onComplete').exists)
					{
						var fOnComplete = ns1blankspace.util.param(oParam, 'onComplete').value;
	
						if (ns1blankspace.util.param(oParam, 'onCompleteWhenCan').exists)
						{
							oParam.onComplete = oParam.onCompleteWhenCan;
							delete oParam.onCompleteWhenCan;
						}	
						else
						{
							delete oParam.onComplete;
						}

						fOnComplete(oParam);
					}
					else if (ns1blankspace.util.param(oParam, 'onCompleteWhenCan').exists)
					{
						var fOnCompleteWhenCan = ns1blankspace.util.param(oParam, 'onCompleteWhenCan').value;

						delete oParam.onCompleteWhenCan;
					
						fOnCompleteWhenCan(oParam);
					}
				},

	isEmpty: 	function (oObject)
				{
			  		for (var key in oObject)
			  		{
			     		if (oObject.hasOwnProperty(key)) {return false;}
			     	}
			  		
			   		return true;
				},

	isDate: 	function(sValue)
				{
					var toClass = {}.toString;
					return (toClass.call(sValue) == '[object Date]')
				},		

	sortBy: 	function (prop)
				{
					//yourArray.sort(ns1blankspace.util.sortBy('firstname'))

					return function(a,b)
					{
						if(a[prop] > b[prop])
						{
							return 1;
						}
						else if(a[prop] < b[prop])
						{
							return -1;
						}
						return 0;
					}
				},

	remove:		function (array, property, value)
				{
					return $.grep(array, function (a)
					{ 
						return (a[property] != value)
					});
				},

	trimLast:	function (sValue, sChar)
				{
					if (sChar == undefined) {sChar = '/'}
					if (sValue.charAt(sValue.length-1) == sChar)
					{
  						return sValue.slice(0, -1);
  					}
  					else
  					{
  						return sValue;
  					}	
  				},

  	toFunction:
  				function (sFunction, oNS)
  				{
  					if (sFunction === undefined || sFunction == '')
  					{
  						oNS = undefined;
  					}
  					else
  					{
	  					if (oNS === undefined) {oNS = window}

	  					sFunction = sFunction.split('(')[0];	

	  					var aF = (sFunction).split(".");

	  					$.each(aF, function(i,v)
	  					{
	  						if(oNS !== undefined) {oNS = oNS[this]};	
	  					});
		  					
	  				}	

  					return oNS;
  				},

  	execute:
  				function (sFunction, oParam, oNS)
  				{
  					var fFunction = ns1blankspace.util.toFunction(sFunction, oNS);

  					if (fFunction !== undefined) {fFunction(oParam);}
  					
  				},

  	toObject:
  				function (sObject)
  				{
  					var oObject;

  					if (sObject !== undefined && sObject != '')
  					{
  						oObject = {};

  						sObject = sObject.replace('{', '');
  						sObject = sObject.replace('}', '');

	  					var aObject = sObject.split(',');	
	  					var aValue;
	  					var sValue;

	  					$.each(aObject, function(i,v)
	  					{
	  						aValue = v.split(':');
	  						var sProperty = (aValue[0]).trim();
	  						aValue.splice(0, 1);
	  						sValue = aValue.join(':');
	  						sValue = (sValue).replace(/"/g, '');
	  						sValue = (sValue).replace(/'/g, '');
							sValue = (sValue).trim();
	  						oObject[sProperty] = sValue;	
	  					});
	  				}	

  					return oObject;
  				},

  	toBR: 		function (sValue)
  				{
					sValue = (sValue).replace(/\r\n/g, '<br />');

  					return sValue;
  				},

  	toFixed: 	function (sValue)
				{
					if (sValue == '' || sValue === undefined)
					{	
						sValue = 0;
					}
					
					return parseFloat(sValue).toFixed(2);	
				},

	format: 	function(oParam)
				{
					var sValue = ns1blankspace.util.getParam(oParam, 'text').value;
					var iLength = ns1blankspace.util.getParam(oParam, 'length').value;
					var sFill = ns1blankspace.util.getParam(oParam, 'fill').value;
					var sFillLeft = ns1blankspace.util.getParam(oParam, 'fillLeft').value;
					var sDefault = ns1blankspace.util.getParam(oParam, 'default').value;
					var sDateFormat = ns1blankspace.util.getParam(oParam, 'dateFormat').value;
					var iAmountDecimalPlaces = ns1blankspace.util.getParam(oParam, 'amountDecimalPlaces').value;
					var bUpper = ns1blankspace.util.getParam(oParam, 'upper', {"default": false}).value;
	
					if (sValue === undefined) {sValue = sDefault}

					if (sValue !== undefined && sValue !== null)
					{
						if (sDateFormat !== undefined)
						{
							if (!ns1blankspace.util.isDate(sValue)) {sValue = Date.parse(sValue)}

							if (sValue !== null)
							{	
								sValue = sValue.toString(sDateFormat);
							}
							else
							{
								sValue = '';
							}
						}

						if (iAmountDecimalPlaces !== undefined)
						{
							sValue = (sValue).parseCurrency().toFixed(iAmountDecimalPlaces)
						}

						if (iLength !== undefined)
						{	
							if (sValue.length > iLength)
							{
								sValue = sValue.substr(0, iLength);
							}
							else if (sValue.length < iLength)
							{
								if (sFill !== undefined)
								{	
									sValue += sFill.repeat(iLength - sValue.length)
								}	

								if (sFillLeft !== undefined)
								{	
									sValue = sFillLeft.repeat(iLength - sValue.length) + sValue
								}
							}	
						}
					}
					else if (sFill !== undefined && iLength !== undefined)
					{
						sValue = sFill.repeat(iLength)
					}

					if (bUpper) {sValue = sValue.toUpperCase()}

					if (sValue) {sValue = sValue.formatXHTML()}
						
					return sValue;
				},								

  	getMethod: 
  				function getM ()
  				{
  					var methods = [];
					for (var m in ns1blankspace) {
					    if (typeof ns1blankspace[m] == "function") {
					        methods.push(m);
					    }
					}
					console.log(methods.join(","));
  				},

  	hash: 		function(oParam)
  				{
  					//requires /jscripts/md5-min.js
  					
  					var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": 1}).value;
  					var sValue = ns1blankspace.util.getParam(oParam, 'value').value;

  					if (sValue !== undefined)
  					{	
	  					if (iType == 1)
	  					{
	  						return hex_md5(sValue);
	  					}
	  				}	
  				},

  	app:		{
  					option: 	function (oParam)
  								{
  									if (ns1blankspace.option.appTitle == undefined)
  									{
  										ns1blankspace.option.appTitle = document.title;
  									}

  									var sTitleSuffix = ns1blankspace.util.getParam(oParam, 'titleSuffix', {"default": ''}).value;
  									var sTitlePrefix = ns1blankspace.util.getParam(oParam, 'titlePrefix', {"default": ''}).value;
  									var sTitle = sTitlePrefix + ns1blankspace.util.getParam(oParam, 'title', {"default": ns1blankspace.option.appTitle}).value +
  													sTitleSuffix

  									document.title = sTitle;
  								}
  				},						

  	about: 		{
  					data: 		[],

  					init: 		function ()
  								{
  									ns1blankspace.util.about.initPush();
  									ns1blankspace.util.about.data.sort(ns1blankspace.util.sortBy('namePath'));
  								},

				  	initPush:
				  				function (sNamespace, sType, sProperty)
				  				{
				  					if (sNamespace === undefined) {sNamespace = 'ns1blankspace'}
				  					if (sType === undefined) {sType = 'object'}
				  					if (sProperty === undefined) {sProperty = 'namespaces'}

				  					if (sNamespace.indexOf('.data') == -1)
				  					{	
					  					var oNamespace = ns1blankspace.util.toFunction(sNamespace)

					  					var aNamespaces = [];

										for (var m in oNamespace)
										{
											var iLevel = sNamespace.split('.').length;

										    if (typeof oNamespace[m] == 'object')
										    {
										    	if (m != 'data' && m != 'views' && m != 'methods' && m != 'scripts' && m != 'tags' && m != 'reportSummary' && m != 'xhtml' && m != 'themes')
										    	{	
										        	ns1blankspace.util.about.data.push({name: m, namePath: sNamespace + '.' + m, type: 'namespace', level: iLevel});
										        	aNamespaces.push({name: m, namePath: sNamespace + '.' + m});
										        }	
										    }

										    if (typeof oNamespace[m] == 'function')
										    {
										        ns1blankspace.util.about.data.push({name: m, namePath: sNamespace + '.' + m, type: 'method', level: iLevel});
										    }
										}

										$.each(aNamespaces, function(i,v)
										{	
											ns1blankspace.util.about.initPush(v.namePath, sType, sProperty)
										});
									}	
				  				},

				  	toConsole: 	function (oParam) {ns1blankspace.util.about.show(oParam)},		

				  	show: 		function (oParam)
  								{
  									var sNamespace = ns1blankspace.util.getParam(oParam, 'namespace').value;
  									var iLevel = ns1blankspace.util.getParam(oParam, 'level').value;
  									var sType = ns1blankspace.util.getParam(oParam, 'type').value;
  									var bShowCode = ns1blankspace.util.getParam(oParam, 'showCode', {"default": false}).value;

  									if (ns1blankspace.util.about.data.length == 0)
  									{
  										ns1blankspace.util.about.init();
  									}

  									var aData = ns1blankspace.util.about.data;

  									if (sNamespace !== undefined)
  									{
  										aData = $.grep(aData, function (a) {return (a.namePath.indexOf(sNamespace) != -1)})
  									}

  									if (iLevel !== undefined)
  									{
  										aData = $.grep(aData, function (a) {return (a.level <= iLevel)})
  									}

  									if (sType !== undefined)
  									{
  										aData = $.grep(aData, function (a) {return (a.type == sType)})
  									}

									var aTmp = ['1BLANKSPACE NAMESPACE'];

  									aTmp.push($.grep(aData, function(a) {return a.type == 'namespace'}).length + ' namespaces')
  									aTmp.push($.grep(aData, function(a) {return a.type == 'method'}).length + ' methods')

  									$.each(aData, function (i,v)
  									{
  										aTmp.push(v.namePath + (v.type=='namespace'?'/':''))

  										if (v.type == 'method' && bShowCode)
  										{
  											aTmp.push(ns1blankspace.util.toFunction(v.namePath).valueOf())
  										}	
  									});

  									console.log(aTmp.join('\r\n'));
  								}
				},

	cleanURL: 	function (oParam)
				{
					var sText = ns1blankspace.util.getParam(oParam, 'text').value;
					var oSearchHost = ns1blankspace.util.getParam(oParam, 'searchHost', {"default": [{value: 'secure.mydigitalspacelive.com'}, {value: 'beta.mydigitalspacelive.com'}]}).value;
					var sNewHost = ns1blankspace.util.getParam(oParam, 'newHost', {"default": window.location.host}).value;
					var sProtocol = ns1blankspace.util.getParam(oParam, 'protocol').value;

					if (sText !== undefined)
					{
						$.each(oSearchHost, function()
						{
							sText = sText.replace(RegExp(this.value, "gi"), sNewHost);
						});
					}

					if (sProtocol !== undefined)
					{
						sText = sText.replace(RegExp('http', "gi"), sProtocol);
						sText = sText.replace(RegExp('https', "gi"), sProtocol);
					}

					return sText;
				},

	ifExists: 	function (oParam)
				{
					var sVariable = ns1blankspace.util.getParam(oParam, 'variable').value;

					if (sVariable in window)
					{
   						return window[sVariable];
					}
				},

	toWords: 	function (oParam)
				{
					var sNumber = ns1blankspace.util.getParam(oParam, 'number').value;
					var bUpper = ns1blankspace.util.getParam(oParam, 'upper', {"default": false}).value;

					var sWords = toWords(sNumber);
					if (bUpper) {sWords = (sWords).toUpperCase()}

					return sWords;
				}
}