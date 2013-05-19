/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.product = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.app.reset();

					ns1blankspace.object = 16;
					ns1blankspace.objectName = 'product';
					ns1blankspace.viewName = 'Products';	
					
					ns1blankspace.app.set(oParam);
				},

	home:		function (oResponse)
				{
					if (oResponse == undefined)
					{
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceMain">');
						aHTML.push('<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ins1blankspaceMain">' +
										ns1blankspace.xhtml.loading +
										'</td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));

						var aHTML = [];
									
						aHTML.push('<table>');

						aHTML.push('<tr><td><div id="ns1blankspaceViewProductLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
							
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
		
						var oSearch = new AdvancedSearch();
						oSearch.method = 'PRODUCT_SEARCH';
						oSearch.addField('reference,title');
						oSearch.rf = 'json';
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(ns1blankspace.product.home);
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a product.</td></tr>' +
											'</table>');
						}
						else
						{
							aHTML.push('<table>');
							aHTML.push('<tr><td class="ns1blankspaceCaption">MOST LIKELY</td></tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
														'" class="ns1blankspaceMostLikely">' +
														this.title +
														'</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');			
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.product.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									var iMinimumLength = 3;
									var iSource = ns1blankspace.data.searchSource.text;
									var sSearchText;
									var iMaximumColumns = 1;
									var iRows = 10;
									
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
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'PRODUCT_SEARCH';
										oSearch.addField('reference,title,trackinventory,status,statustext,description,financialaccountincome,financialaccountincometext,' +
															'unittype,unittypetext,units,category,categorytext,currentretailprice,type,minimumstocklevel');
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										oSearch.getResults(function(data){ns1blankspace.product.show(oParam, data)});
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
											sSearchText = aSearch[1];
											if (sSearchText == '#') {sSearchText = '[0-9]'}
											sElementID = 'ns1blankspaceViewControlBrowse';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.search.start();
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'PRODUCT_SEARCH';
											oSearch.addField('reference,title');
										
											if (iSource == ns1blankspace.data.searchSource.browse)
											{
												oSearch.addFilter('title', 'TEXT_STARTS_WITH', sSearchText);
											}
											else
											{	
												oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
												oSearch.addOperator('or');
												oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
											}	
										
											oSearch.getResults(function(data){ns1blankspace.product.search.process(oParam, data)});
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var	iMaximumColumns = 1;
									var aHTML = [];

									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.container).hide();
									}
									else
									{	
										aHTML.push('<table class="ns1blankspaceSearchMedium">');
										
										$.each(oResponse.data.rows, function()
										{	
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">');
											}
											
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'search-' + this.id + '">' +
															this.reference + '</td>');
											
											aHTML.push('<td class="ns1blankspaceSearchSub" id="' +
															'searchTitle-' + this.id + '">' +
															this.title + '</td>');

											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.product.search.send(event.target.id, {source: 1});
										});
									}

									ns1blankspace.search.stop();			
								}
				},				

	layout: 	function ()
				{
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Details</td></tr>');		
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlPricing" class="ns1blankspaceControl">' +
										'Pricing</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlCategory" class="ns1blankspaceControl">' +
										'Category</td></tr>');

						aHTML.push('</table>');					

						if (false)
						{
							aHTML.push('<table class="ns1blankspaceControl">');

							aHTML.push('<tr><td id="ns1blankspaceControlStock" class="ns1blankspaceControl">' +
											'Stock</td></tr>');

							aHTML.push('</table>');					
						}
							
						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlActions" class="ns1blankspaceControl">' +
										'Actions</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');
					}	
					
					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPricing" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainCategory" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainSupplier" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainStock" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');		

					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.product.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.product.details();
					});
					
					$('#ns1blankspaceControlPricing').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPricing'});
						ns1blankspace.product.pricing.show();
					});
					
					$('#ns1blankspaceControlCategory').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainCategory'});
						ns1blankspace.product.category();
					});
				
					$('#ns1blankspaceControlActions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainActions'});
						ns1blankspace.actions.show();
					});

					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments'});
						ns1blankspace.attachments.show();
					});
				},

	show:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.product.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this messaging IMAP account.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						aHTML.push(ns1blankspace.objectContextData.title);

						if (ns1blankspace.objectContextData.reference != '')
						{
							aHTML.push('<br /><span id="ns1blankspaceControlContext_reference" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.reference + '</span>');
						}
						
						if (ns1blankspace.objectContextData.categorytext != '')
						{
							aHTML.push('<br /><span id="ns1blankspaceControlContext_category" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.categorytext + '</span>');
						}
						
						if (ns1blankspace.objectContextData.currentretailprice != '')
						{
							aHTML.push('<br /><span id="ns1blankspaceControlContext_price" class="ns1blankspaceSub">$' + ns1blankspace.objectContextData.currentretailprice + '</span>');
						}

						$('#ns1blankspaceControlContext').html(aHTML.join(''));
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.product.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.product.summary()'});
					}
				},		
		
	summary: 	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this product.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:100px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));

						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Reference</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryReference" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.reference +
										'</td></tr>');

						if (ns1blankspace.objectContextData.currentretailprice != '')
						{

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Retail Price</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryPrice" class="ns1blankspaceSummary">$' +
										ns1blankspace.objectContextData.currentretailprice +
										'</td></tr>');
						}	
						
						if (ns1blankspace.objectContextData.units != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Units</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryUnits" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.units +
										'</td></tr>');
						}	
						
						if (ns1blankspace.objectContextData.description != '')
						{	
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>');
						}	
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
					}
				},

	details:	function ()
				{
					if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
					{
						var aHTML = [];

						$('#ns1blankspaceMainDetails').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');					
						
						$('#ns1blankspaceMainDetails').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Reference' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsReference" class="ns1blankspaceText">' +
										'</td></tr>');			
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Title' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsTitle" class="ns1blankspaceText">' +
										'</td></tr>');	
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea id="ns1blankspaceDetailsDescription" style="width:320px;" rows="5" cols="35" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Product Sales Account' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceDetailsFinancialAccountProductSales" class="ns1blankspaceSelect"' +
											' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
											' data-columns="title">' +
										'</td></tr>');						
									
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Coming Soon' +
										'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Available Now' +
										'<br /><input type="radio" id="radioStatus6" name="radioStatus" value="6"/>Discontinued' +
										'<br /><input type="radio" id="radioStatus7" name="radioStatus" value="7"/>Internal' +
										'</td></tr>');
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Type' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioProductType1" name="radioProductType" value="1"/>Standard' +
										'</td></tr>');
						
						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							var iStatus = ns1blankspace.objectContextData.status;
							if (iStatus == '') {iStatus = 1}
						
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#ns1blankspaceDetailsDescription').val((ns1blankspace.objectContextData.description).formatXHTML());
							$('[name="radioStatus"][value="' + iStatus + '"]').attr('checked', true);
							$('[name="radioProductType"][value="' + ns1blankspace.objectContextData.type + '"]').attr('checked', true);

							$('#ns1blankspaceDetailsFinancialAccountProductSales').val(ns1blankspace.objectContextData.financialaccountincometext);
							$('#ns1blankspaceDetailsFinancialAccountProductSales').attr("data-id", ns1blankspace.objectContextData.financialaccountincome);
						}
						else
						{
							$('[name="radioStatus"][value="2"]').attr('checked', true);
							$('[name="radioProductType"][value="1"]').attr('checked', true);
						}	
					}	
				},

	pricing: 	{			
					show: 		function ()
								{
									if ($('#ns1blankspaceMainPricing').attr('data-loading') == '1')
									{
										$('#ns1blankspaceMainPricing').attr('data-loading', '');
										
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspacePricingColumn1" class="ns1blankspaceColumn1"></td>' +
														'<td id="ns1blankspacePricingColumn2" class="ns1blankspaceColumn2"></td>' +
														'</tr>' + 
														'</table>');					
										
										$('#ns1blankspaceMainPricing').html(aHTML.join(''));
									
										var aHTML = [];

										aHTML.push('<table class="ns1blankspace">');
					
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Retail Price' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspacePricingPriceRetail" class="ns1blankspaceText">' +
														'</td></tr>');			

										aHTML.push('</table>');					
										
										$('#ns1blankspacePricingColumn1').html(aHTML.join(''));
											
										//ns1blankspace.product.pricing.group({xhtmlElemendID: 'ns1blankspacePricingColumn2'})

										if (ns1blankspace.objectContextData != undefined)
										{
											$('#ns1blankspacePricingPriceRetail').val(ns1blankspace.objectContextData.currentretailprice);
										}
									}	
								},

					group:		function (oParam, oResponse)
								{
									var aHTML = [];
									var sXHTMLElementID = 'ns1blankspacePricingColumn2';
									
									if (oResponse == undefined)
									{
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('SETUP_PRODUCT_PRICING_GROUP_SEARCH'),
											dataType: 'json',
											async: false,
											success: function(data) {ns1blankspace.product.pricing.group(oParam, data)}
										});
									}
									else
									{
										
										if (oParam != undefined)
										{
											if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										}	
										
										var aHTML = [];
								
										aHTML.push('<table class="ns1blankspace">');
										
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Group' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioPricingGroup-1" name="radioPricingGroup" value="-1"/>' +
														'All<br />');	

										if (oResponse.data.rows.length != 0)	
										{
											$.each(oResponse.data.rows, function() 
											{ 
												if (this.title != '')
												{
													aHTML.push('<input type="radio" id="radioPricingGroup' + this.id + '" name="radioPricingGroup" value="' + this.id + ' "/>' +
																this.title + '<br />');
												}				
											});
										}
										
										aHTML.push('</td></tr>');
										
										$('#' + sXHTMLElementID).html(aHTML.join(''));
									}	
								}
				},				

	category:	function (oParam, oResponse)
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainCategory').attr('data-loading') == '1')
					{
						if (oResponse == undefined)
						{	
							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_PRODUCT_CATEGORY_SEARCH';
							oSearch.addField('title');
							oSearch.getResults(function(data) {
									ns1blankspace.product.category(oParam, data)
									});
						}
						else
						{
							$('#ns1blankspaceMainCategory').attr('data-loading', '');

							var aHTML = [];
								
							aHTML.push('<table class="ns1blankspace">');

							if (oResponse.data.rows == 0)
							{
								aHTML.push('<tr><td class="ns1blankspaceNothing">No categories.</td></tr>');
							}
							else
							{
								aHTML.push('<tr class="ns1blankspaceRow">' +
												'<td style="font-size:0.875em">');
									
								$.each(oResponse.data.rows, function() 
								{ 
									aHTML.push('<input type="radio" id="radioCategory' + this.id + '" name="radioCategory" value="' + this.id + '"/>' +
													this.title + '<br />');
								});
						
								aHTML.push('</td></tr>');
							}
							
							aHTML.push('</table>');

							$('#ns1blankspaceMainCategory').html(aHTML.join(''));

							if (oResponse.data.rows.length != 0)
							{
								$('[name="radioCategory"][value="' + ns1blankspace.objectContextData.category + '"]').attr('checked', true);
							}
						}	
					}	
				},

	stock:		function ()
				{
					var aHTML = [];

					if ($('#ns1blankspaceMainPricing').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainPricing').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceStockColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceStockColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');					
						
						$('#ns1blankspaceMainStock').html(aHTML.join(''));
						
						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Units / Quantity' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceStockUnits" class="ns1blankspaceText">' +
										'</td></tr>');			

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Minimum Stock Level' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceMinimumStockLevel" class="ns1blankspaceText">' +
										'</td></tr>');	
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceStockColumn1').html(aHTML.join(''));
						
						var aHTML = [];
					
						aHTML.push('<table class="interfaceMain">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Stock Type' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStockUnit1" name="radioStockUnit" value="1"/>Each' +
										'<br /><input type="radio" id="radioStockUnit2" name="radioStockUnit" value="2"/>Packet' +
										'<br /><input type="radio" id="radioStockUnit6" name="radioStockUnit" value="3"/>Metre' +
										'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="4"/>Box' +
										'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="5"/>kg' +
										'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="6"/>Thousand' +
										'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="7"/>Unit' +
										'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="8"/>Hour' +
										'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="9"/>Pair' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Track Stock' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioTrackStockN" name="radioTrackStock" value="N"/>No' +
										'</td></tr>');
						
						aHTML.push('</table>');					
							
						$('#ns1blankspaceStockColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceStockUnits').val(ns1blankspace.objectContextData.units);
							$('#ns1blankspaceMinimumStockLevel').val(ns1blankspace.objectContextData.minimumstocklevel);
							$('[name="radioStockUnit"][value="' + ns1blankspace.objectContextData.unittype + '"]').attr('checked', true);
							$('[name="radioTrackStock"][value="' + ns1blankspace.objectContextData.trackinventory + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioStockUnit"][value="1"]').attr('checked', true);
							$('[name="radioTrackStock"][value="N"]').attr('checked', true);
						}	
					}	
				},

	new:		function ()
				{
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.product.layout();
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					$('#ns1blankspaceViewportControlAction').button({disabled: false});
					$('#ns1blankspaceViewportControlActionOptions').button({disabled: true});
					ns1blankspace.product.details();
				},

	save: 		{			
					send: 		function ()
								{
									ns1blankspace.status.working();

									var sData = 'id=' + ((ns1blankspace.objectContext == -1)?'':ns1blankspace.objectContext);
											
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsReference').val());
										sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTitle').val());
										sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDescription').val());
										
										var iStatus = $('input[name="radioStatus"]:checked').val()
										if (iStatus == '') {iStatus = 1}
										
										sData += '&status=' + ns1blankspace.util.fs(iStatus);
										sData += '&type=' + ns1blankspace.util.fs($('input[name="radioProductType"]:checked').val());

										sData += '&financialaccountincome=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFinancialAccountProductSales').attr('data-id'));
									}
									
									if ($('#ns1blankspaceMainStock').html() != '')
									{
										sData += '&minimumstocklevel=' + ns1blankspace.util.fs($('#ns1blankspaceMinimumStockLevel').val());
										sData += '&unittype=' + ns1blankspace.util.fs($('input[name="radioStockUnit"]:checked').val());
										sData += '&trackinventory=' + ns1blankspace.util.fs($('input[name="radioTrackStock"]:checked').val());
									}
									
									if ($('#ns1blankspaceMainCategory').html() != '')
									{
										var iCategory = ns1blankspace.util.fs($('input[name="radioCategory"]:checked').val());
										if (iCategory == '') {iCategory = ns1blankspace.util.fs($('input[name="radioCategory"]:first').val())}
									
										sData += '&category=' + ns1blankspace.util.fs(iCategory);
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('PRODUCT_MANAGE'),
										data: sData,
										dataType: 'json',
										success: ns1blankspace.product.save.process
									});
								},

					process:	function (oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
										
										if ($('#ns1blankspaceMainPricing').html() != '')
										{
											ns1blankspace.product.save.price();
										}
											
										if ($('#ns1blankspaceMainStock').html() != '')
										{
											ns1blankspace.product.save.units();
										}

										if (bNew)
										{
											ns1blankspace.inputDetected = false;
											ns1blankspace.product.search.send('-' + ns1blankspace.objectContext, {source: 1});
										}	
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								},

					price:		function (aParam)
								{
									var sData = 'price=' + ns1blankspace.util.fs($('#ns1blankspacePricingPriceRetail').val());
									sData += '&product=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
									sData += '&group=-1';
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('PRODUCT_PRICE_MANAGE'),
										data: sData,
										dataType: 'json'
									});
								},

					units:		function (oParam)
								{
									var sData = 'units=' + ns1blankspace.util.fs($('#ns1blankspaceStockUnits').val());
									sData += '&product=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
									sData += '&type=3';
									sData += '&effectivedate=' + Date.today().toString("dd-MMM-yyyy");
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('PRODUCT_STOCK_MANAGE'),
										data: sData,
										dataType: 'json'
									});
								}
				}
}				
	