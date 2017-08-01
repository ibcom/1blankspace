/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.product = 
{
	option: 	{
					manageStock: true
				},

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

	home:		function (oParam, oResponse)
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
						oSearch.addField('reference,title,currentretailprice,description');
						oSearch.rf = 'json';
						oSearch.rows = 10;  
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(function (data) {ns1blankspace.product.home(oParam, data)});
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
							aHTML.push('<tr><td class="ns1blankspaceCaption">RECENT</td></tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
														'" class="ns1blankspaceMostLikely" style="width:175px;">' +
														this.title + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_reference-' + this.id + 
														'" class="ns1blankspaceMostLikelySub" style="width:300px;">' +
														this.description + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_currentretailprice-' + this.id + 
														'" class="ns1blankspaceMostLikelySub" style="width:75px; text-align:right;">' +
														this.currentretailprice + '</td>');

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
									var iMinimumLength = 0;
									var iSource = ns1blankspace.data.searchSource.text;
									var sSearchText;
									var iMaximumColumns = 1;
									
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
															'financialaccountpurchases,financialaccountpurchasestext,financialaccountinventory,financialaccountinventorytext,' +
															'unittype,unittypetext,units,category,categorytext,currentretailprice,type,minimumstocklevel,unitprice');

										oSearch.addField(ns1blankspace.option.auditFields);
				
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
											oSearch.addField('reference,title,currentretailprice');
										
											if (iSource == ns1blankspace.data.searchSource.browse)
											{
												oSearch.addFilter('title', 'TEXT_STARTS_WITH', sSearchText);
											}
											else
											{	
												oSearch.addBracket('(');
												oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
												oSearch.addOperator('or');
												oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
												oSearch.addBracket(')');
											}	

											ns1blankspace.search.advanced.addFilters(oSearch);
											oSearch.rows = ns1blankspace.option.defaultRowsSmall;
										
											oSearch.getResults(function(data){ns1blankspace.product.search.process(oParam, data)});
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var	iMaximumColumns = 1;
									var aHTML = [];

									ns1blankspace.search.stop();

									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
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

										$(ns1blankspace.xhtml.searchContainer).html(
											ns1blankspace.render.init(
											{
												html: aHTML.join(''),
												more: (oResponse.morerows == "true"),
												header: false
											}) 
										);
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
											$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.product.search.send(event.target.id, {source: 1});
										});
									
										ns1blankspace.render.bind(
										{
											columns: 'reference-title',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.product.search.send
										}); 
									}
		
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

						if (ns1blankspace.product.option.manageStock)
						{
							aHTML.push('<table class="ns1blankspaceControl">');

							aHTML.push('<tr><td id="ns1blankspaceControlStock" class="ns1blankspaceControl">' +
											'Stock</td></tr>');

							aHTML.push('<tr><td id="ns1blankspaceControlStockHistory" class="ns1blankspaceControl">' +
											'Adjustments<br /><span class="ns1blankspaceSubNote">history</span></td></tr>');

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
					aHTML.push('<div id="ns1blankspaceMainStockHistory" class="ns1blankspaceControlMain"></div>');
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

					$('#ns1blankspaceControlStock').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainStock'});
						ns1blankspace.product.stock.show();
					});

					$('#ns1blankspaceControlStockHistory').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainStockHistory', refresh: true});
						ns1blankspace.product.stock.history.show();
					});
				},

	show:		function (oParam, oResponse)
				{
					ns1blankspace.app.clean();
					ns1blankspace.product.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this product.</td></tr></table>');
								
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
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Units in stock</td></tr>' +
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

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Product Purchases Account' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceDetailsFinancialAccountProductPurchases" class="ns1blankspaceSelect"' +
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
							$('#ns1blankspaceDetailsFinancialAccountProductPurchases').val(ns1blankspace.objectContextData.financialaccountpurchasestext);
							$('#ns1blankspaceDetailsFinancialAccountProductPurchases').attr("data-id", ns1blankspace.objectContextData.financialaccountpurchases);
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
							oSearch.sort('title', 'ASC');
							oSearch.rows = 100;
							oSearch.getResults(function(data)
							{
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

	stock:		{
					show: 		function ()
					{
						var aHTML = [];

						if ($('#ns1blankspaceMainStock').attr('data-loading') == '1')
						{
							$('#ns1blankspaceMainStock').attr('data-loading', '');
							
							aHTML.push('<table class="ns1blankspaceContainer">' +
											'<tr class="ns1blankspaceContainer">' +
											'<td id="ns1blankspaceStockColumn1" class="ns1blankspaceColumn2" style="width:65px;"></td>' +
											'<td id="ns1blankspaceStockColumn2" class="ns1blankspaceColumn1"></td>' +
											'<td id="ns1blankspaceStockColumn3" class="ns1blankspaceColumn2" style="width:125px;"></td>' +
											'</tr>' + 
											'</table>');					
							
							$('#ns1blankspaceMainStock').html(aHTML.join(''));

							var aHTML = [];
						
							aHTML.push('<table class="ns1blankspace">');
						
							aHTML.push('<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceRadio">' +
											'<input type="radio" id="radioTrackStockN" name="radioTrackStock" value="N"/>No Tracking' +
											'<br /><input type="radio" id="radioTrackStockY" name="radioTrackStock" value="Y"/>Track Stock' +
											'</td></tr>');
						
							aHTML.push('</table>');

							$('#ns1blankspaceStockColumn1').html(aHTML.join(''));			
							
							var aHTML = [];

							aHTML.push('<table class="ns1blankspaceColumn2">');
							
							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'Units In Stock' +
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

							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'Stock (Inventory) Account' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceSelect">' +
											'<input id="ns1blankspaceStockFinancialAccountInventory" class="ns1blankspaceSelect"' +
												' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
												' data-columns="title">' +
											'</td></tr>');
				
							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'Stock Purchase Unit Cost' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceText">' +
											'<input id="ns1blankspaceStockUnitPrice" class="ns1blankspaceText">' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceSubNote">' +
											'Stock-on-hand unit cost will be used if this is blank and units-in-stock is changed.' +
											'</td></tr>');

							aHTML.push('</table>');					
							
							$('#ns1blankspaceStockColumn2').html(aHTML.join(''));
							
							var aHTML = [];
						
							aHTML.push('<table class="ns1blankspaceColumn2">');
							
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
											'<td class="ns1blankspaceCaption" style="padding-top:12px;">' +
											'Effective<br />Stock On Hand<br />Unit Cost' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceSelect" id="ns1blankspaceStockUnitCostPrice">' +
											'</td></tr>');

							aHTML.push('</table>');					
								
							$('#ns1blankspaceStockColumn3').html(aHTML.join(''));

							if (ns1blankspace.objectContextData != undefined)
							{
								$('#ns1blankspaceStockUnits').val(ns1blankspace.objectContextData.units);
								$('#ns1blankspaceMinimumStockLevel').val(ns1blankspace.objectContextData.minimumstocklevel);
								$('[name="radioStockUnit"][value="' + ns1blankspace.objectContextData.unittype + '"]').attr('checked', true);
								$('#ns1blankspaceStockFinancialAccountInventory').val(ns1blankspace.objectContextData.financialaccountinventorytext);
								$('#ns1blankspaceStockFinancialAccountInventory').attr("data-id", ns1blankspace.objectContextData.financialaccountinventory);
								$('[name="radioTrackStock"][value="' + ns1blankspace.objectContextData.trackinventory + '"]').attr('checked', true);
								$('#ns1blankspaceStockUnitCostPrice').html(ns1blankspace.objectContextData.unitprice);
								$('#ns1blankspaceStockUnitPrice').val(ns1blankspace.objectContextData.stockunitprice);
							}
							else
							{
								$('[name="radioStockUnit"][value="1"]').attr('checked', true);
								$('[name="radioTrackStock"][value="' + (ns1blankspace.product.option.manageStock?'Y':'N') + '"]').attr('checked', true);
								$('#ns1blankspaceStockUnitCostPrice').html('Unknown');
							}	
						}
					},

					history:
					{
						data: 	{
									sources:
									{
										"43": "Order",
										"126": "Supplier Order"
									}	
								},

						show: 	function (oParam, oResponse)
								{
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceMainStockHistory'}).value;

									if (oResponse == undefined)
									{
										var aHTML = [];
									
										aHTML.push('<table>' +
													'<tr>' +
													'<td id="ns1blankspaceStockHistoryColumn1" class="ns1blankspaceColumn1Flexible">' + ns1blankspace.xhtml.loading + '</td>' +
													'<td id="ns1blankspaceStockHistoryColumn2" class="ns1blankspaceColumn2" style="width:0px;"></td></tr>' +
													'</table>');					
											
										$('#' + sXHTMLElementID).html(aHTML.join(''));

										var oSearch = new AdvancedSearch();
										oSearch.method = 'PRODUCT_STOCK_SEARCH';
										oSearch.addField('effectivedate,financialaccount,financialaccounttext,notes,objectcontext,object,store,storetext,type,typetext,unitprice,units,modifieddate');
										oSearch.addFilter('product', 'EQUAL_TO', ns1blankspace.objectContext)
										oSearch.sort('modifieddate', 'desc');
										oSearch.getResults(function(data)
										{
											ns1blankspace.product.stock.history.show(oParam, data)
										});
									}
									else
									{
										var aHTML = [];
										var h = -1;
											
										if (oResponse.data.rows.length === 0)
										{
											aHTML.push('<table style="margin-top:5px;">');
											aHTML.push('<tr>');
											aHTML.push('<td class="ns1blankspaceNothing">No stock history.</td>');
											aHTML.push('</tr>');
											aHTML.push('</table>');
											
											$('#ns1blankspaceStockHistoryColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceStockHistory">');
					
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Type</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Units</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Unit Cost Price ('
															+ (ns1blankspace.option.currencySymbol||'$') + ')</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											
											aHTML.push('</tr>');

											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.product.stock.history.row(this, oParam));
											});
									    	
											aHTML.push('</table>');

											ns1blankspace.render.page.show(
											{
												xhtmlElementID: 'ns1blankspaceStockHistoryColumn1',
												xhtmlContext: 'StockHistory',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows === "true"),
												columns: 'effectivedate',
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionSearch: ns1blankspace.attachments.show,
												functionShowRow: ns1blankspace.attachments.row,
												functionOnNewPage: ns1blankspace.attachments.bind,
												type: 'json'
											}); 	
												
											ns1blankspace.product.stock.history.bind();
										}
									}	
								},

						row:	function (oRow, oParam)
								{
									var aHTML = [];
									
									aHTML.push('<tr class="ns1blankspaceStockHistory">');
									
									aHTML.push('<td id="ns1blankspaceStockHistory_effectivedate-' + oRow.id + '" class="ns1blankspaceRow">' +
														oRow.effectivedate + '</td>');
														
									aHTML.push('<td id="ns1blankspaceStockHistory_units-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceNothing">' + oRow.typetext + '</td>');

									aHTML.push('<td id="ns1blankspaceStockHistory_units-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' + oRow.units + '</td>');

									aHTML.push('<td id="ns1blankspaceStockHistory_unitprice-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' + oRow.unitprice + '</td>');

									//aHTML.push('<td id="ns1blankspaceStockHistory_financialaccount-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceNothing">' + oRow.financialaccounttext + '</td>');

									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspaceStockHistory_more-' + oRow.id + '" class="ns1blankspaceRowMore"' +
													' data-sourceobject="' + oRow.object + '"' +
													' data-storetext="' + oRow.storetext + '"></span>' +
													'</td>');

									aHTML.push('</tr>');
									
									return aHTML.join('');
								},

						bind: 	function (oParam)
								{
									$('#ns1blankspaceStockHistory .ns1blankspaceRowMore').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-arrowthickstop-1-s"
										}
									})
									.click(function()
									{
										ns1blankspace.product.stock.history.more.init(
										{
											id: (this.id).split('-')[1],
											sourceObject: $(this).attr('data-sourceobject'),
											storeText: $(this).attr('data-storetext')
										});
									})
									.css('width', '15px')
									.css('height', '20px');
								},	

						more: 	{
									init:	function (oParam)
											{
												var sID = ns1blankspace.util.getParam(oParam, 'id').value;

												if ($('#ns1blankspaceStockHistory_more_container-' + sID).length != 0)
												{
													$('#ns1blankspaceStockHistory_more_container-' + sID).remove();
												}
												else
												{
													$('#ns1blankspaceStockHistory_more-' + sID).parent().parent().after('<tr id="ns1blankspaceStockHistory_more_container-' + sID + '">' +
																	'<td colspan=6>' +
																	'<div style="background-color:#f3f3f3; padding:10px; font-size:0.875em; margin-bottom:10px;" class="ns1blankspaceScale85"' +
																			' id="ns1blankspaceStockHistory_more_container_more-' + sID + '">' +
																			'<span class="ns1blankspaceSubNote">loading...</span></div></td></tr>');

													ns1blankspace.product.stock.history.more.show(oParam);
												}
											},

									show: 	function (oParam, oResponse)
											{
												var sID = ns1blankspace.util.getParam(oParam, 'id').value;
												var sSourceObject = ns1blankspace.util.getParam(oParam, 'sourceObject').value;
												var sStoreText = ns1blankspace.util.getParam(oParam, 'storeText').value;

												if (oResponse == undefined)
												{
													var oSearch = new AdvancedSearch();
													oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_ITEM_SEARCH';
													oSearch.addField('generaljournalitem.debitamount,generaljournalitem.debittax,generaljournalitem.creditamount,' +
																		'generaljournalitem.credittax,generaljournalitem.financialaccounttext');
													oSearch.addFilter('generaljournalitem.generaljournal.object','EQUAL_TO', 159)
													oSearch.addFilter('generaljournalitem.generaljournal.objectContext','EQUAL_TO', sID)
													oSearch.sort('modifieddate', 'desc');
													oSearch.getResults(function(data)
													{
														ns1blankspace.product.stock.history.more.show(oParam, data)
													});
												}
												else
												{
													var aHTML = [];

													aHTML.push('<table id="ns1blankspaceStockHistory">');
													aHTML.push('<tr class="ns1blankspaceCaption">' +
																	'<td class="ns1blankspaceHeaderCaption">Source</td>' +
																	'<td class="ns1blankspaceHeaderCaption">Store</td>');

													$.each(oResponse.data.rows, function (i, v)
													{
														aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right; padding-right:2px;">' + v['generaljournalitem.financialaccounttext'] + ' Account</td>');
													});

													aHTML.push('</tr>');

													aHTML.push('<tr>' +
																	'<td class="ns1blankspaceRow1">' + (sSourceObject==''?'This product':ns1blankspace.product.stock.history.data.sources[sSourceObject]) + '</td>' +
																	'<td class="ns1blankspaceRow1">' + sStoreText + '</td>');

													$.each(oResponse.data.rows, function (i, v)
													{
														aHTML.push('<td class="ns1blankspaceRow1" style="text-align:right;">' +
																	(ns1blankspace.option.currencySymbol||'$') +
																	(v['generaljournalitem.creditamount']!=0?v['generaljournalitem.creditamount']:v['generaljournalitem.debitamount']) + '</td>');
													});

													aHTML.push('</tr>');

													aHTML.push('</table>');

													$('#ns1blankspaceStockHistory_more_container_more-' + sID).html(aHTML.join(''));
												}	
											}		
								}						
					}	
				},

	save: 		{			
					send: 		function ()
								{
									ns1blankspace.status.working();

									var oData = {};

									if (ns1blankspace.objectContext != -1) {oData.id = ns1blankspace.objectContext};
											
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										oData.reference = $('#ns1blankspaceDetailsReference').val();
										oData.title = $('#ns1blankspaceDetailsTitle').val();
										oData.description = $('#ns1blankspaceDetailsDescription').val();
										
										var iStatus = $('input[name="radioStatus"]:checked').val()
										if (iStatus == '') {iStatus = 1}
										
										oData.status = iStatus;
										oData.type = $('input[name="radioProductType"]:checked').val();
										oData.financialaccountincome =  $('#ns1blankspaceDetailsFinancialAccountProductSales').attr('data-id');
										oData.financialaccountpurchases =  $('#ns1blankspaceDetailsFinancialAccountProductPurchases').attr('data-id');
									}
									
									if ($('#ns1blankspaceMainStock').html() != '')
									{
										if ($('#ns1blankspaceMinimumStockLevel').val() != '') {oData.minimumstocklevel = $('#ns1blankspaceMinimumStockLevel').val()};
										oData.unittype = $('input[name="radioStockUnit"]:checked').val();
										oData.trackinventory = $('input[name="radioTrackStock"]:checked').val();
										oData.financialaccountinventory = $('#ns1blankspaceStockFinancialAccountInventory').attr('data-id');
										oData.stockunitprice = $('#ns1blankspaceStockUnitPrice').val();
									}
									
									if ($('#ns1blankspaceMainCategory').html() != '')
									{
										var iCategory = $('input[name="radioCategory"]:checked').val();
										if (iCategory == '') {iCategory = $('input[name="radioCategory"]:first').val()}
										oData.category = iCategory;
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('PRODUCT_MANAGE'),
										data: oData,
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
											if ($('#ns1blankspaceStockUnits').val() != '')
											{
												var iNewUnits = parseInt($('#ns1blankspaceStockUnits').val());
												var iExistingUnits = parseInt(ns1blankspace.objectContextData.units);

												if ((iNewUnits - iExistingUnits) != 0)
												{	
													ns1blankspace.product.save.units(
													{
														units: (iNewUnits - iExistingUnits),
														price: $('#ns1blankspaceStockUnitPrice').val()
													});
												}
											}	
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
									var iUnits = ns1blankspace.util.getParam(oParam, 'units').value;
									var cPrice = ns1blankspace.util.getParam(oParam, 'price').value;

									var oData =
									{
										units: iUnits,
										unitprice: cPrice,
										product: ns1blankspace.objectContext,
										type: 3,
										effectivedate: Date.today().toString("dd-MMM-yyyy"),
									}	
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('PRODUCT_STOCK_MANAGE'),
										data: oData,
										dataType: 'json'
									});
								}
				}
}				
	