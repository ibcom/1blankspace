/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.order = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 43;
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectName = 'order';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Orders';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.order.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
				},

	home:		{
					show:		function (oResponse)
								{	
									$('#ns1blankspaceMain').html(ns1blankspace.xhtml.loading);
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

									aHTML.push('<tr><td id="ns1blankspaceViewOrderLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');
											
									aHTML.push('<tr class="ns1blankspaceControl">' +
													'<td id="ns1blankspaceControlRecent" class="ns1blankspaceControl ns1blankspaceViewportControlHighlight">' +
													'Recent</td></tr>');			
											
									aHTML.push('<tr class="ns1blankspaceControl">' +
													'<td id="ns1blankspaceControlStatus-2" class="ns1blankspaceControl orderStatus">' +
													'To&nbsp;Be&nbsp;Submitted</td></tr>');	

									aHTML.push('<tr class="ns1blankspaceControl">' +
													'<td id="ns1blankspaceControlStatus-7" class="ns1blankspaceControl orderStatus">' +
													'Processing</td></tr>');

									aHTML.push('<tr class="ns1blankspaceControl">' +
													'<td id="ns1blankspaceControlStatus-1" class="ns1blankspaceControl orderStatus">' +
													'Completed</td></tr>');
												
									aHTML.push('</table>');		
									
									$('#ns1blankspaceControl').html(aHTML.join(''));	

									ns1blankspace.home.recent();
									
									$('#ns1blankspaceControlRecent').click(function(event)
									{
										ns1blankspace.home.recent();
									});
									
									$('td.orderStatus').click(function(event)
									{
										var sID = this.id;
										var aID = sID.split('-');
										ns1blankspace.home.status.show({status: aID[1]});
									});
										
								
								},

					recent:		function (oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'PRODUCT_ORDER_SEARCH';
										oSearch.addField('reference,orderbybusinesstext,orderbypersontext,orderdate');
										oSearch.rows = 50;
										oSearch.sort('orderdate', 'desc');
										oSearch.getResults(ns1blankspace.home.recent);
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">Click New to create an order.</td></tr></table>');
										}
										else
										{
											aHTML.push('<table class="ns1blankspaceContainer">');
										
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceMainRow">');
												
												aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
																		'" class="ns1blankspaceMostLikely" style="width:100px;" >' +
																		this.reference + '</td>');
												
												aHTML.push('<td id="ns1blankspaceMostLikely_orderdate-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:100px;">' +
																		this.orderdate + '</td>');
																		
												var sContact = this.orderbybusinesstext;
												if (sContact == '') {sContact = this.orderbypersontext}
																		
												aHTML.push('<td id="ns1blankspaceMostLikely_contact-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
																		sContact + '</td>');
																		
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');
										}
										
										$('#ns1blankspaceMain').html(aHTML.join(''));
									
										$('td.ins1blankspaceMostLikely').click(function(event)
										{
											ns1blankspace.order.search.send(event.target.id, {source: 1});
										});
									}
								}

					status:		{
									show: 		function (oParam, oResponse)
												{
													var iStatus = 1;
													
													if (oParam != undefined)
													{
														if (oParam.status != undefined) {iStatus = oParam.status}	
													}
														
													if (oResponse == undefined)
													{
														var oSearch = new AdvancedSearch();
														oSearch.method = 'PRODUCT_ORDER_SEARCH';
														oSearch.addField('reference,orderbybusinesstext,orderbypersontext,orderdate');
														oSearch.addFilter('status', 'EQUAL_TO', iStatus);
														oSearch.rows = 30;
														oSearch.sort('orderdate', 'desc');
														oSearch.getResults(function(data) {ns1blankspace.home.status.show(oParam, data)});
													}
													else
													{
														var aHTML = [];

														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<table><tr><td class="ns1blankspaceNothing">No orders, click New to create an order.</td></tr></table>');
														}
														else
														{			
															aHTML.push('<table class="ns1blankspaceContainer">';
															
															$.each(oResponse.data.rows, function()
															{
																aHTML.push(ns1blankspace.home.status.row(this)
															});
															
															aHTML.push('</table>');
														}
														
														$('#ns1blankspaceeMain').html(aHTML.join(''));
													
														ns1blankspace.pagination.list(
														{
															xhtmlElementID: 'divns1blankspaceMain',
															xhtmlContext: 'OrderStatus',
															xhtml: aHTML.join(''),
															showMore: (oResponse.morerows == "true"),
															more: oResponse.moreid,
															rows: 30,
															functionShowRow: ns1blankspace.home.status.row,
															functionNewPage: 'ns1blankspace.home.status.bind()',
															type: 'json'
														}); 
																	
														ns1blankspace.home.status.bind();
													}
												},

									row:		function (oRow)
												{
													var aHTML = [];

													aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
																		'" class="ns1blankspaceMostLikely" style="width:100px;" >' +
																		this.reference + '</td>');
												
													aHTML.push('<td id="ns1blankspaceMostLikely_orderdate-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:100px;">' +
																		this.orderdate + '</td>');
																		
													var sContact = this.orderbybusinesstext;
													if (sContact == '') {sContact = this.orderbypersontext}
																			
													aHTML.push('<td id="ns1blankspaceMostLikely_contact-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
																		sContact + '</td>');

													aHTML.push('</tr>');

													return aHTML.join('');
												},

									bind:		function ()
												{
													$('td.ns1blankspaceMostLikelySub').click(function(event)
													{
														ns1blankspace.order.search.send(event.target.id, {source: 1});
													});
												}	
								}
				},				

	search: 	{
					send: 		function (sXHTMLElementId, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
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
										oSearch.method = 'PRODUCT_ORDER_SEARCH';
										
										oSearch.addField('reference,orderbybusinesstext,orderbybusiness,orderbypersontext,orderbyperson,billtobusinesstext,billtobusiness,billtoperson,' +
															'salespersontext,salesperson,projecttext,project,areatext,area,' +
															'purchaseorder,orderdate,deliverydate,statustext,status,processingstatustext,processingstatus,sourcetext,source,' +
															'notes,streetaddresscombined,streetaddress1,streetaddress2,streetsuburb,streetstate,streetpostcode,streetcountry,' +
															'mailingaddresscombined,mailingaddress1,mailingaddress2,mailingsuburb,mailingstate,mailingpostcode,mailingcountry,' +
															'createdusertext,createduser,createddate,modifiedusertext,modifieduser,modifieddate');
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);	
										oSearch.getResults(function(data){ns1blankspace.order.show(oParam, data)});	
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
											sElementId = 'ns1blankspaceViewControlBrowse';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.container.position(sElementID);
											ns1blankspace.search.start(sElementID);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'PRODUCT_ORDER_SEARCH';
											oSearch.addField('reference,orderbybusinesstext');
											oSearch.rf = 'json';
											oSearch.addFilter('reference', 'STRING_IS_LIKE', sSearchText);		
											oSearch.getResults(function(data) {ns1blankspace.order.search.show(oParam, data)});
										}
									};	
								}

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
															'-' + this.id + '">' +
															this.reference +
															'</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										var oElement = $('#ns1blankspaceViewControlSearch');
										$(ns1blankspace.xhtml.container).offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
										ns1blankspace.aearch.stop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.order.search.send(event.target.id, {source: 1});
										});
									}		
								}
				},

	layout: 	function ns1blankspaceOrderViewport()
				{
					
					var aHTML = [];
					var h = -1;

					aHTML.push('<div id="divns1blankspaceViewportControlContext" class="ns1blankspaceViewportControlContext"></div>';
					
					aHTML.push('<table id="tablens1blankspaceViewportControl" class="ns1blankspaceViewportControl">';
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlDetails" class="ns1blankspaceViewportControl ns1blankspaceViewportControlHighlight">Details</td>' +
										'</tr>';
					}
					else
					{	
						aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlSummary" class="ns1blankspaceViewportControl ns1blankspaceViewportControlHighlight">Summary</td>' +
										'</tr>';
									
						aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlDetails" class="ns1blankspaceViewportControl">Details</td>' +
										'</tr>';
					
						aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlAddress" class="ns1blankspaceViewportControl">Address</td>' +
										'</tr>';
						
						aHTML.push('<tr id="trns1blankspaceViewportControlProducts" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlProducts" class="ns1blankspaceViewportControl">Items</td>' +
										'</tr>';							
					}
					
					aHTML.push('</table>';					
					
					aHTML.push('<table id="tablens1blankspaceViewportControl" class="ns1blankspaceViewportControl">';
					
					aHTML.push('<tr id="trns1blankspaceViewportControlInvoices" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlInvoices" class="ns1blankspaceViewportControl">Invoices</td>' +
									'</tr>';
										
					aHTML.push('</table>';					
					
					aHTML.push('<table id="tablens1blankspaceViewportControl" class="ns1blankspaceViewportControl">';
					
					aHTML.push('<tr id="trns1blankspaceViewportControlActions" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlActions" class="ns1blankspaceViewportControl">Actions</td>' +
									'</tr>';
									
					aHTML.push('<tr id="trns1blankspaceViewportControlAttachments" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlAttachments" class="ns1blankspaceViewportControl">Attachments</td>' +
									'</tr>';
									
					aHTML.push('</table>';					
							
					$('#divns1blankspaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;

					aHTML.push('<div id="divns1blankspaceMainSummary" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainDetails" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainAddress" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainProducts" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainStatus" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainDelivery" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainDeliveryPick" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainInvoices" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainCredits" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainSupplierOrders" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainActions" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainAttachments" class="divns1blankspaceViewportMain"></div>';
					
					$('#divns1blankspaceMain').html(aHTML.join(''));
					
					$('#tdns1blankspaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainSummary");
						ns1blankspaceOrderSummary();
					});
					
					$('#tdns1blankspaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainDetails");
						ns1blankspaceOrderDetails();
					});
					
					$('#tdns1blankspaceViewportControlAddress').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainAddress");
						ns1blankspaceOrderAddress("divns1blankspaceMainAddress");
					});
					
					$('#tdns1blankspaceViewportControlProducts').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainProducts");
						ns1blankspaceOrderProductItems();
					});
					
					$('#tdns1blankspaceViewportControlSupplier').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainSupplier");
						ns1blankspaceOrderSupplier();
					});
					
					$('#tdns1blankspaceViewportControlStock').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainStatus");
						ns1blankspaceOrderStatus();
					});
					
					$('#tdns1blankspaceViewportControlDelivery').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainDelivery");
						ns1blankspaceOrderDelivery();
					});
					
					$('#tdns1blankspaceViewportControlDeliveryPick').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainDeliveryPick");
						ns1blankspaceOrderDeliveryPick();
					});
					
					$('#tdns1blankspaceViewportControlInvoices').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainInvoices");
						ns1blankspaceOrderInvoices();
					});
					
					$('#tdns1blankspaceViewportControlCredits').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainCredits");
						ns1blankspaceOrderCredits();
					});
					
					$('#tdns1blankspaceViewportControlSupplierOrders').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainSupplierOrders");
						ns1blankspaceOrderSupplierOrders();
					});
					
					$('#tdns1blankspaceViewportControlActions').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainActions", true);
						ns1blankspaceActions({xhtmlElementID: 'divns1blankspaceMainActions'});
					});

					$('#tdns1blankspaceViewportControlAttachments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainAttachments", true);
						ns1blankspaceAttachments({xhtmlElementID: 'divns1blankspaceMainAttachments'});
					});
				},

	show:		function ns1blankspaceOrderShow(oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspaceOrderViewport();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
					
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find the order.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
								
						$('#spanns1blankspaceViewportControlAction').button({disabled: false});
								
						$('#divns1blankspaceViewportControlContext').html(ns1blankspace.objectContextData.reference);

						ns1blankspaceViewportDestination({
							newDestination: 'ns1blankspaceOrderMasterViewport({showHome: false});ns1blankspaceOrderSearch("-' + ns1blankspace.objectContext + '")',
							move: false
							})
						
						ns1blankspaceObjectViewportHistory({functionDefault: 'ns1blankspaceOrderSummary()'});
					}	
				},		
		
	summary:	function ns1blankspaceOrderSummary()
				{
					var aHTML = [];
					var h = -1;
					
					aHTML.push('<table id="tablens1blankspaceMainSummary" class="ns1blankspaceMain">';
					aHTML.push('<tr id="trns1blankspaceMainSummaryRow1" class="ns1blankspaceMainRow1">' +
								'<td id="tdns1blankspaceMainSummaryColumn1Large" class="ns1blankspaceMainColumn1Large">' +
									'</td>' +
									'<td id="tdns1blankspaceMainSummaryColumn2Action" class="ns1blankspaceMainColumn2" style="width:175px;">' +
									'</td>' +
									'</tr>';
					aHTML.push('</table>';				
						
					$('#divns1blankspaceMainSummary').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find order.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';
								
						$('#divns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMainColumn1">';
						
						aHTML.push('<tr><td id="tdns1blankspaceMainSummaryOrderDate" class="ns1blankspaceMainSummary">Order Date</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummaryOrderDateValue" class="ns1blankspaceMainSummaryValue">' +
										ns1blankspace.objectContextData.orderdate +
										'</td></tr>';
										
						if (ns1blankspace.objectContextData.deliverydate != '')
						{				
							var dDeliveryDate = new Date(ns1blankspace.objectContextData.deliverydate);
							
							aHTML.push('<tr><td id="tdns1blankspaceMainSummaryDeliveryDate" class="ns1blankspaceMainSummary">Delivery Date</td></tr>' +
											'<tr><td id="tdns1blankspaceMainSummaryDeliveryDateValue" class="ns1blankspaceMainSummaryValue">' +
											$.fullCalendar.formatDate(dDeliveryDate, "dd MMM yyyy HH:mm") +
											'</td></tr>';
						}					
							
						if (ns1blankspace.objectContextData.streetaddresscombined != '')
						{				
							aHTML.push('<tr><td id="tdns1blankspaceMainSummaryDeliveryAddress" class="ns1blankspaceMainSummary">Deliver To</td></tr>' +
											'<tr><td id="tdns1blankspaceMainSummaryDeliveryAddressValue" class="ns1blankspaceMainSummaryValue">' +
											ns1blankspace.objectContextData.streetaddresscombined;
											
							if (ns1blankspace.objectContextData.streetsuburb != '')
							{				
								aHTML.push('<br />' +	ns1blankspace.objectContextData.streetsuburb;
							}
											
							if (ns1blankspace.objectContextData.streetstate != '')
							{				
								aHTML.push('<br />' +	ns1blankspace.objectContextData.streetstate;		
							}
							
							aHTML.push('</td></tr>';
													
						}
									
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainSummaryColumn1Large').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;	
						
						aHTML.push('<table id="tablens1blankspaceMainColumn2" class="ns1blankspaceMainColumn2" style="width: 100%">';
						
						if (ns1blankspace.objectContextData.statustext != '')
						{	
							aHTML.push('<tr><td class="ns1blankspaceMainSummary" style="padding-bottom:10px;">' +
										ns1blankspace.objectContextData.statustext +
										'</td></tr>';				
						}
						
						if (ns1blankspace.objectContextData.status == 7)
						{	
							aHTML.push('<tr><td>' +
										'<span style="font-size:0.75em;" id="spanns1blankspaceMainOrderAction-7" class="orderAction">Unsubmit</span>' +
										'</td></tr>';
										
							aHTML.push('<tr><td>' +
										'<span style="font-size:0.75em;" id="spanns1blankspaceMainOrderAction-8" class="orderAction">Finalise</span>' +
										'</td></tr>';			
						}
						
						if (ns1blankspace.objectContextData.status == 2)
						{	
							aHTML.push('<tr><td>' +
										'<span style="font-size:0.75em;" id="spanns1blankspaceMainOrderAction-2" class="orderAction">Submit</span>' +
										'</td></tr>';
						}
										
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainSummaryColumn2Action').html(aHTML.join(''));	
						
						$('span.orderAction').button(
						{
							
						})
						.click(function() {
							
							var sID = this.id;
							var aID = sID.split('-');
							var iAction = aID[1];
							
							$.ajax(
							{
								type: 'GET',
								url: '/ondemand/product/?method=PRODUCT_ORDER_MANAGE&action=' + iAction + '&id=' + ns1blankspace.objectContext,
								dataType: 'json',
								async: false,
								success: function(oResponse) {ns1blankspaceOrderSearch('-' + ns1blankspace.objectContext)}
							});
						})
						.css('width', '100px')
													
					}	
				},

	details:	function ns1blankspaceOrderDetails()
				{
					var aHTML = [];
					var h = -1;

					if ($('#divns1blankspaceMainDetails').attr('onDemandLoading') == '1')
					{
						$('#divns1blankspaceMainDetails').attr('onDemandLoading', '');
						
						aHTML.push('<table id="tablens1blankspaceMainDetails" class="ns1blankspaceMainDetails">';
						aHTML.push('<tr id="trns1blankspaceMainDetailsRow1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsColumn1" class="ns1blankspaceMainColumn1">' +
										'</td>' +
										'<td id="tdns1blankspaceMainDetailsColumn2" class="ns1blankspaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divns1blankspaceMainDetails').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
						
						aHTML.push('<table id="tablens1blankspaceMainDetailsColumn1" class="ns1blankspaceMain">';
						
						aHTML.push('<tr id="trns1blankspaceMainDetailsReference" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsReference" class="ns1blankspaceMain">' +
										'Reference' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsReferenceValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsReferenceValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainDetailsReference" class="inputns1blankspaceMainText">' +
										'</td></tr>';			
									
						aHTML.push('<tr id="trns1blankspaceMainDetailsStartDate" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsStartDate" class="ns1blankspaceMain">' +
										'Order Date' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsStartDateValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsStartDateValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainDetailsOrderDate" class="inputns1blankspaceMainDate">' +
										'</td></tr>';
										
						aHTML.push('<tr id="trns1blankspaceMainDetailsOrderByBusiness" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsOrderByBusiness" class="ns1blankspaceMain">' +
										'Business' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsOrderByBusinessValue" class="ns1blankspaceMainSelect">' +
										'<td id="tdns1blankspaceMainDetailsOrderByBusinessValue" class="ns1blankspaceMainSelect">' +
										'<input id="inputns1blankspaceMainDetailsOrderByBusiness" class="inputns1blankspaceMainSelect"' +
											' data-method="CONTACT_BUSINESS_SEARCH"' +
											' data-columns="tradename">' +
										'</td></tr>';
										
						aHTML.push('<tr id="trns1blankspaceMainDetailsOrderByPerson" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsOrderByPerson" class="ns1blankspaceMain">' +
										'Person' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsOrderByPersonValue" class="ns1blankspaceMainSelect">' +
										'<td id="tdns1blankspaceMainDetailsOrderByPersonValue" class="ns1blankspaceMainSelect">' +
										'<input id="inputns1blankspaceMainDetailsOrderByPerson" class="inputns1blankspaceMainSelect"' +
											' data-method="CONTACT_PERSON_SEARCH"' +
											' data-columns="surname"' +
											' data-parent="inputns1blankspaceMainDetailsOrderByBusiness"' +
											' data-parent-search-id="contactbusiness"' +
											' data-parent-search-text="tradename">' +
										'</td></tr>';											
						/*				
						aHTML.push('<tr id="trns1blankspaceMainDetailsEndDate" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsEndDate" class="ns1blankspaceMain">' +
										'Delivery/Pickup Date' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsEndDateValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsEndDateValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainDetailsEndDate" class="inputns1blankspaceMainDate">' +
										'</td></tr>';			
						*/
									
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainDetailsColumn1').html(aHTML.join(''));
						
						$('input.inputns1blankspaceMainDate').datepicker({ dateFormat: 'dd M yy' });
						
						var aHTML = [];
						var h = -1;
							
						aHTML.push('<table id="tablens1blankspaceMainDetailsColumn2" class="ns1blankspaceMain">';
						
						aHTML.push('<tr id="trns1blankspaceMainDetailsSource" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsSource" class="ns1blankspaceMain">' +
										'Source' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsSource" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsSourceValue" class="ns1blankspaceMainRadio" style="height:33px;">' +
										'<input type="radio" id="radioSource1" name="radioSource" value="1"/>Manually Entered' +
										'&nbsp;&nbsp;<input type="radio" id="radioSource2" name="radioSource" value="2"/>Web Order' +
										'</td></tr>';
						
						aHTML.push('<tr id="trns1blankspaceMainDetailsPurchaseOrderReference" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsPurchaseOrderReference" class="ns1blankspaceMain" >' +
										'Purchase Order' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsPurchaseOrderReferenceValue" class="ns1blankspaceMainSelect">' +
										'<td id="tdns1blankspaceMainDetailsPurchaseOrderReferenceValue" class="ns1blankspaceMainSelect">' +
										'<input id="inputns1blankspaceMainDetailsPurchaseOrderReference" class="inputns1blankspaceMainText">' +
										'</td></tr>';	
						
						aHTML.push('<tr id="trns1blankspaceMainDetailsNotes" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsNotes" class="ns1blankspaceMain">' +
										'Notes' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsNotesValue" class="ns1blankspaceMainTextMulti">' +
										'<td id="tdns1blankspaceMainDetailsNotesValue" class="ns1blankspaceMainTextMulti">' +
										'<textarea style="width:350px;height:120px;" rows="5" cols="35" id="inputns1blankspaceMainDetailsNotes" class="inputns1blankspaceMainTextMulti"></textarea>' +
										'</td></tr>';
						
						
						aHTML.push('</table>';					
							
						$('#tdns1blankspaceMainDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputns1blankspaceMainDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#inputns1blankspaceMainDetailsOrderDate').val(ns1blankspace.objectContextData.orderdate);
							$('#inputns1blankspaceMainDetailsOrderByBusiness').attr('data-id', ns1blankspace.objectContextData.orderbybusiness);
							$('#inputns1blankspaceMainDetailsOrderByBusiness').val(ns1blankspace.objectContextData.orderbybusinesstext);
							$('#inputns1blankspaceMainDetailsOrderByPerson').attr('data-id', ns1blankspace.objectContextData.orderbyperson);
							$('#inputns1blankspaceMainDetailsOrderByPerson').val(ns1blankspace.objectContextData.orderbypersontext);	
							$('[name="radioSource"][value="' + ns1blankspace.objectContextData.source + '"]').attr('checked', true);
							$('#inputns1blankspaceMainDetailsPurchaseOrderReference').val(ns1blankspace.objectContextData.purchaseorder);
							$('#inputns1blankspaceMainDetailsNotes').val(ns1blankspace.objectContextData.notes);	
						}
						else
						{
							$('[name="radioSource"][value="1"]').attr('checked', true);
						}
					}	
				},

	address:	function ns1blankspaceOrderAddress()
				{
					var aHTML = [];
					var h = -1;
					
					ns1blankspace.debug.appContext = 'address';
						
					if ($('#divns1blankspaceMainAddress').attr('onDemandLoading') == '1')
					{
						$('#divns1blankspaceMainAddress').attr('onDemandLoading', '');
								
						aHTML.push('<table id="tablens1blankspaceMainAddress" class="ns1blankspaceMain">';
						aHTML.push('<tr id="trns1blankspaceMainAddressRow1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainAddressColumn1" class="ns1blankspaceMainColumn1">' +
										'</td>' +
										'<td id="tdns1blankspaceMainAddressColumn2" class="ns1blankspaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divns1blankspaceMainAddress').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML.push('<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMainColumn1">';
								
						aHTML.push('<tr id="trns1blankspaceMainAddressStreetAddress1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainAddressStreetAddress1" class="ns1blankspaceMain">' +
										'Delivery Address' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainAddressStreetAddress1Value" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainAddressStreetAddress1Value" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainAddressStreetAddress1" class="inputns1blankspaceMainText">' +
										'</td></tr>';
										
						aHTML.push('<tr id="trns1blankspaceMainAddressStreetAddress2" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainAddressStreetAddress2" class="ns1blankspaceMain">' +
										'' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainAddressStreetAddress2Value" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainAddressStreetAddress2Value" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainAddressStreetAddress2" class="inputns1blankspaceMainText">' +
										'</td></tr>';
										
						aHTML.push('<tr id="trns1blankspaceMainAddressStreetSuburb" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainAddressStreetSuburb" class="ns1blankspaceMain">' +
										'Suburb' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainAddressStreetSuburbValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainAddressStreetSuburbValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainAddressStreetSuburb" class="inputns1blankspaceMainText inputns1blankspaceMainSelectAddress">' +
										'</td></tr>';
										
						aHTML.push('<tr id="trns1blankspaceMainAddressStreetState" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainAddressStreetState" class="ns1blankspaceMain">' +
										'State' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainAddressStreetStateValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainAddressStreetStateValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainAddressStreetState" class="inputns1blankspaceMainText">' +
										'</td></tr>';
										
						aHTML.push('<tr id="trns1blankspaceMainAddressStreetPostCode" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainAddressStreetPostCode" class="ns1blankspaceMain">' +
										'Post Code' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainAddressStreetPostCodeValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainAddressStreetPostCodeValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainAddressStreetPostCode" class="inputns1blankspaceMainText">' +
										'</td></tr>';				
										
						aHTML.push('<tr id="trns1blankspaceMainAddressStreetCountry" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainAddressStreetCountry" class="ns1blankspaceMain">' +
										'Country' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainAddressStreetCountryValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainAddressStreetCountryValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainAddressStreetCountry" class="inputns1blankspaceMainText">' +
										'</td></tr>';						
						
						aHTML.push('<tr><td id="tdns1blankspaceMainContactCopyToMailingAddress" class="ns1blankspaceMainAction">' +
										'<span id="spanns1blankspaceMainContactCopyToMailingAddress">Copy to Mailing Address</span>' +
										'</td></tr>';
										
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainAddressColumn1').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;
					
						aHTML.push('<table id="tablens1blankspaceMainColumn2" class="ns1blankspaceMain">';
								
						aHTML.push('<tr id="trns1blankspaceMainAddressMailingAddress1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainAddressMailingAddress1" class="ns1blankspaceMain">' +
										'Billing Address' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainAddressMailingAddress1Value" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainAddressMailingAddress1Value" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainAddressMailingAddress1" class="inputns1blankspaceMainText">' +
										'</td></tr>';
										
						aHTML.push('<tr id="trns1blankspaceMainAddressMailingAddress2" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainAddressMailingAddress2" class="ns1blankspaceMain">' +
										'' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainAddressMailingAddress2Value" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainAddressMailingAddress2Value" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainAddressMailingAddress2" class="inputns1blankspaceMainText">' +
										'</td></tr>';
										
						aHTML.push('<tr id="trns1blankspaceMainAddressMailingSuburb" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainAddressMailingSuburb" class="ns1blankspaceMain">' +
										'Suburb' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainAddressMailingSuburbValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainAddressMailingSuburbValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainAddressMailingSuburb" class="inputns1blankspaceMainText inputns1blankspaceMainSelectAddress">' +
										'</td></tr>';
										
						aHTML.push('<tr id="trns1blankspaceMainAddressMailingState" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainAddressMailingState" class="ns1blankspaceMain">' +
										'State' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainAddressMailingStateValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainAddressMailingStateValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainAddressMailingState" class="inputns1blankspaceMainText">' +
										'</td></tr>';
										
						aHTML.push('<tr id="trns1blankspaceMainAddressMailingPostCode" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainAddressMailingPostCode" class="ns1blankspaceMain">' +
										'Post Code' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainAddressMailingPostCodeValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainAddressMailingPostCodeValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainAddressMailingPostCode" class="inputns1blankspaceMainText">' +
										'</td></tr>';				
										
						aHTML.push('<tr id="trns1blankspaceMainAddressMailingCountry" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainAddressMailingCountry" class="ns1blankspaceMain">' +
										'Country' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainAddressMailingCountryValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainAddressMailingCountryValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainAddressMailingCountry" class="inputns1blankspaceMainText">' +
										'</td></tr>';						
						
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainAddressColumn2').html(aHTML.join(''));
						
						$('#spanns1blankspaceMainContactCopyToMailingAddress').button(
						{
							label: "Copy to Billing Address"
						})
						.click(function() {
						
							$('#inputns1blankspaceMainAddressMailingAddress1').val($('#inputns1blankspaceMainAddressStreetAddress1').val());
							$('#inputns1blankspaceMainAddressMailingAddress2').val($('#inputns1blankspaceMainAddressStreetAddress2').val());
							$('#inputns1blankspaceMainAddressMailingSuburb').val($('#inputns1blankspaceMainAddressStreetSuburb').val());
							$('#inputns1blankspaceMainAddressMailingState').val($('#inputns1blankspaceMainAddressStreetState').val());
							$('#inputns1blankspaceMainAddressMailingPostCode').val($('#inputns1blankspaceMainAddressStreetPostCode').val());
							$('#inputns1blankspaceMainAddressMailingCountry').val($('#inputns1blankspaceMainAddressStreetCountry').val());

						})

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputns1blankspaceMainAddressStreetAddress1').val((ns1blankspace.objectContextData.streetaddress1).formatXHTML());
							$('#inputns1blankspaceMainAddressStreetAddress2').val((ns1blankspace.objectContextData.streetaddress2).formatXHTML());
							$('#inputns1blankspaceMainAddressStreetSuburb').val((ns1blankspace.objectContextData.streetsuburb).formatXHTML());
							$('#inputns1blankspaceMainAddressStreetState').val((ns1blankspace.objectContextData.streetstate).formatXHTML());
							$('#inputns1blankspaceMainAddressStreetPostCode').val((ns1blankspace.objectContextData.streetpostcode).formatXHTML());
							$('#inputns1blankspaceMainAddressStreetCountry').val((ns1blankspace.objectContextData.streetcountry).formatXHTML());
							$('#inputns1blankspaceMainAddressMailingAddress1').val((ns1blankspace.objectContextData.mailingaddress1).formatXHTML());
							$('#inputns1blankspaceMainAddressMailingAddress2').val((ns1blankspace.objectContextData.mailingaddress2).formatXHTML());
							$('#inputns1blankspaceMainAddressMailingSuburb').val((ns1blankspace.objectContextData.mailingsuburb).formatXHTML());
							$('#inputns1blankspaceMainAddressMailingState').val((ns1blankspace.objectContextData.mailingstate).formatXHTML());
							$('#inputns1blankspaceMainAddressMailingPostCode').val((ns1blankspace.objectContextData.mailingpostcode).formatXHTML());
							$('#inputns1blankspaceMainAddressMailingCountry').val((ns1blankspace.objectContextData.mailingcountry).formatXHTML());
						}
					}	
				},

	items: 		{
					show:		function ns1blankspaceOrderProductItems(oParam, oResponse)
								{
									var sXHTMLElementID = 'divns1blankspaceMainProducts';
									
									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}

									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'PRODUCT_ORDER_ITEM_SEARCH';
										oSearch.addField('producttext,quantity,totalcost,totaltax');
										oSearch.addFilter('order', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.sort('producttext', 'desc');
										oSearch.getResults(function(data){ns1blankspaceOrderProductItems(oParam, data)});
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tablens1blankspaceMainOrderProductItems" class="ns1blankspaceMain">' +
													'<tr id="trns1blankspaceMainOrderProductItemsRow1" class="ns1blankspaceMainRow1">' +
													'<td id="tdns1blankspaceMainOrderProductItemsColumn1" class="ns1blankspaceMainColumn1Large">' +
													ns1blankspace.xhtml.loading +
													'</td>' +
													'<td id="tdns1blankspaceMainOrderProductItemsColumn2" style="width: 200px;" class="ns1blankspaceMainColumn2">' +
													'</td>' +
													'</tr>' +
													'</table>';				
										
										$('#' + sXHTMLElementID).html(aHTML.join(''));
										
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tablens1blankspaceMainOrderProductItemsColumn2" class="ns1blankspaceMainColumn2">';
										
										if (ns1blankspace.objectContextData.status == 2)
										{
											aHTML.push('<tr><td id="tdns1blankspaceMainOrderProductItemsAdd" class="ns1blankspaceMainAction">' +
														'<span id="spanns1blankspaceMainOrderProductItemsAdd">Add</span>' +
														'</td></tr>';
										}
										else
										{
											aHTML.push('<tr><td class="ns1blankspaceViewportControlSub">' +
														'The order has been submitted, so items can not be added or removed.' +
													'</td></tr>';
										}				
														
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainOrderProductItemsColumn2').html(aHTML.join(''));
										
										$('#spanns1blankspaceMainOrderProductItemsAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											ns1blankspaceOrderProductItemsAdd()
										})
										.css('width', '75px')
										
										var aHTML = [];
										var h = -1;

										if (oResponse.data.rows.length == 0)	
										{
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceActions">';
											aHTML.push('<td class="ns1blankspaceMainRowNothing">No items.</td>';
											aHTML.push('</tr>';
											aHTML.push('</tbody></table>';

											$('#tdns1blankspaceMainOrderProductItemsColumn1').html(aHTML.join(''));		
										}
										else
										{
											aHTML.push('<table id="tableOrderProductItemsList" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceMainCaption">';
											aHTML.push('<td class="ns1blankspaceMainCaption">Product</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption" style="text-align:right;">Quantity</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption" style="text-align:right;">Price</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption">&nbsp;</td>';
											aHTML.push('</tr>';
											
											$.each(oResponse.data.rows, function() 
											{ 
												aHTML.push(ns1blankspaceOrderProductItemsRow(this);
											});
											
											aHTML.push('</tbody></table>';

											ns1blankspacePaginationList(
											{
												xhtmlElementID: 'tdns1blankspaceMainOrderProductItemsColumn1',
												xhtmlContext: 'OrderProductItems',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspaceOrderProductItemsRow,
												functionNewPage: 'ns1blankspaceOrderProductItemsBind()',
												type: 'json'
											}); 		
											ns1blankspaceOrderProductItemsBind();
										}
									}	
								}	

					row:		function ns1blankspaceOrderProductItemsRow(oRow)
								{
									var aHTML = [];
									var h = -1;

									aHTML.push('<tr class="ns1blankspaceMainRow">';
									
									aHTML.push('<td id="tdOrderProductItems_title-' + oRow.id + '" class="ns1blankspaceMainRow">' +
															oRow.producttext + '</td>';	
															
									aHTML.push('<td id="tdOrderProductItems_quantity-' + oRow.id + '" class="ns1blankspaceMainRow"' +
															' style="text-align:right;">' +
															oRow.quantity + '</td>';						
																
									aHTML.push('<td id="tdOrderProductItems_price-' + oRow.id + '" class="ns1blankspaceMainRow"' +
															' style="text-align:right;">' +
															oRow.totalcost + '</td>';					
														
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceMainRow">';	
									aHTML.push('<span id="spanOrderProductItems_options_remove-' + oRow.id + '" class="ns1blankspaceMainRowOptionsRemove"></span>';
									//aHTML.push('<span id="spanOrderProductItems_options_view-' + oRow.id + '" class="ns1blankspaceMainRowOptionsView"></span>';
									aHTML.push('</td>';
																									
									aHTML.push('</tr>';	
									
									return aHTML.join('');
								},

					bind:		function ns1blankspaceOrderProductItemsBind()
								{
									$('.ns1blankspaceMainRowOptionsView').button( {
												text: false,
												icons: {
													primary: "ui-icons"
												}
									})
									.click(function() {
										alert("View product");
									})
									.css('width', '15px')
									.css('height', '17px')
									
									if (ns1blankspace.objectContextData.status == 2)
									{
										$('.ns1blankspaceMainRowOptionsRemove').button( {
											text: false,
											 icons: {
												 primary: "ui-icon-close"
											}
										})
										.click(function() {
											ns1blankspaceOrderProductItemsRemove({xhtmlElementID: this.id});
										})
										.css('width', '15px')
										.css('height', '17px')
									}	
								},

					remove:		function ns1blankspaceOrderProductItemsRemove(oParam, oResponse)
								{
									var sXHTMLElementID;

									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}
									
									var aXHTMLElementID = sXHTMLElementID.split('-');
									var sID = aXHTMLElementID[1];
									
									if (oResponse == undefined)
									{	
										var sParam = 'method=PRODUCT_ORDER_ITEM_MANAGE&remove=1';
										var sData = 'id=' + sID;
										
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/product/?' + sParam,
											data: sData,
											dataType: 'json',
											success: function(data){ns1blankspaceOrderProductItemsRemove(oParam, data)}
										});
									}	
									else
									{
										if (oResponse.status == 'OK')
										{
											$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
										}
										else
										{
											ns1blankspaceError(oResponse.error.errornotes);
										}
									}	
								},

					add:		function ns1blankspaceOrderProductItemsAdd(oParam, oResponse)
								{
									var iStep = 1;
									
									if (oParam != undefined)
									{
										if (oParam.step != undefined) {iStep = oParam.step}	
									}
									
									if (oResponse == undefined)
									{
										if (iStep == 1)
										{
											var aHTML = [];
											var h = -1;
													
											aHTML.push('<table id="tablens1blankspaceMainProductAddColumn2">';
									
											aHTML.push('<tr id="trns1blankspaceMainProductAddReference" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainProductAddReference" class="ns1blankspaceMain">' +
															'Product' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainProductAddReferenceValue" class="ns1blankspaceMainText">' +
															'<td id="tdns1blankspaceMainProductAddReferenceValue" class="ns1blankspaceMainText">' +
															'<input id="inputns1blankspaceMainProductAddReference" class="inputns1blankspaceMainText">' +
															'</td></tr>';
											
											aHTML.push('<tr id="trns1blankspaceMainProductAdd">' +
															'<td id="tdns1blankspaceMainProductAddSearch" style="font-size:0.75em;" title="Enter part of the title and click search.">' +
															'<span id="spanns1blankspaceMainOrderProductItemsAddSearch">Search</span>' +
															'</td></tr>';
																			
											aHTML.push('</table>';
											
											aHTML.push('<table style="margin-top:15px;">';
											
											aHTML.push('<tr>' +
															'<td id="tdns1blankspaceMainProductAddSearchResults">' +
															'</td></tr>';
																			
											aHTML.push('</table>';		
											
											$('#tdns1blankspaceMainOrderProductItemsColumn2').html(aHTML.join(''));

											$('#spanns1blankspaceMainOrderProductItemsAddSearch').button(
												{
													label: "Search"
												})
												.click(function() {
													ns1blankspaceOrderProductItemsAdd($.extend(true, oParam, {step: 2}))
												})
												
											$('#inputns1blankspaceMainProductAddReference').focus();
										}
										if (iStep == 2)
										{
											$('#tdns1blankspaceMainProductAddSearchResults').html(ns1blankspace.xhtml.loadingSmall);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'PRODUCT_SEARCH';
											oSearch.addField('reference,title');
											oSearch.addFilter('title', 'STRING_IS_LIKE', $('#inputns1blankspaceMainProductAddReference').val());
											oSearch.sort('title', 'asc');
											oSearch.getResults(function(data){ns1blankspaceOrderProductItemsAdd($.extend(true, oParam, {step:3}), data)});
										}
									}
									else
									{
										var aHTML = [];
										var h = -1;

										if (oResponse.data.rows.length == 0)	
										{
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" style="margin-top:15px; margin-bottom:15px;">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceActions">';
											aHTML.push('<td class="ns1blankspaceMainRowNothing">No products.</td>';
											aHTML.push('</tr>';
											aHTML.push('</tbody></table>';

											$('#tdns1blankspaceMainProductAddSearchResults').html(aHTML.join(''));		
										}
										else
										{	
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" >';
											aHTML.push('<tbody>'
											
											$.each(oResponse.data.rows, function() 
											{ 
												aHTML.push('<tr class="ns1blankspaceMainRow">';	
															
												aHTML.push('<td id="tdOrderProductItems_title-' + this.id + '" class="ns1blankspaceMainRow productadd">' +
																		this.title + '</td>';
																		
												aHTML.push('<td id="tdOrderProductItems_quantity-' + this.id + '" class="ns1blankspaceMainRow productadd">' +
																'<input style="width:25px;" id="inputOrderProductItems_title-quantity-' + this.id + '" class="inputns1blankspaceMainText productadd"></td>';						
														
												aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceMainRow">';	
												aHTML.push('<span id="spanOrderProductItems_options_add-' + this.id + '" class="ns1blankspaceMainRowOptionsAdd"></span>';
												aHTML.push('</td>';
												
												aHTML.push('</tr>';	

											});
											
											aHTML.push('</tbody></table>';

											$('#tdns1blankspaceMainProductAddSearchResults').html(aHTML.join(''))
											
											$('.ns1blankspaceMainRowOptionsAdd').button({
												text: false,
												icons: {
													primary: "ui-icon-plus"
												}
											})
											.click(function()
											{
												var sID = this.id;
												var aID = sID.split('-');
												var iProduct = aID[1];
												var iQuantity = $('#inputOrderProductItems_title-quantity-' + iProduct).val();
												if (iQuantity == '') {iQuantity = 1};
												
												var sData = 'order=' + ns1blankspace.objectContext;
												sData += '&product=' + iProduct;
												sData += '&quantity=' + iQuantity;
												
												$.ajax(
												{
													type: 'POST',
													url: '/ondemand/product/?method=PRODUCT_ORDER_ITEM_MANAGE',
													data: sData,
													dataType: 'json',
													async: false,
													success: function(oResponse) {ns1blankspaceOrderProductItems()}
												});
											})
											.css('width', '20px')
											.css('height', '20px')
											
											$('input.productadd:first').focus();
										}
									}	
								}
				},

	new:		function ()
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspaceOrderViewport();
					ns1blankspaceMainViewportShow("#divns1blankspaceMainDetails");
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
					ns1blankspaceOrderDetails();
				}

	save: 		{		
					send:		function ns1blankspaceOrderSave()
								{
									ns1blankspaceStatusWorking();
									
									var sData = 'id=' + ((ns1blankspace.objectContext == -1)?'':ns1blankspace.objectContext);
										
									if ($('#divns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsReference').val());
										sData += '&orderdate=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsOrderDate').val());
										sData += '&orderbybusiness=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsOrderByBusiness').attr("data-id"));
										sData += '&orderbyperson=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsOrderByPerson').attr("data-id"));
										sData += '&purchaseorder=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsPurchaseOrderReference').val());
										sData += '&source=' + $('input[name="radioSource"]:checked').val();
										sData += '&notes=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsNotes').val());
									}
										
									if ($('#divns1blankspaceMainAddress').html() != '')
									{
										sData += '&streetaddress1=' + ns1blankspace.util.fs($('#inputns1blankspaceMainAddressStreetAddress1').val());
										sData += '&streetaddress2=' + ns1blankspace.util.fs($('#inputns1blankspaceMainAddressStreetAddress2').val());
										sData += '&streetsuburb=' + ns1blankspace.util.fs($('#inputns1blankspaceMainAddressStreetSuburb').val());
										sData += '&streetstate=' + ns1blankspace.util.fs($('#inputns1blankspaceMainAddressStreetState').val());
										sData += '&streetpostcode=' + ns1blankspace.util.fs($('#inputns1blankspaceMainAddressStreetPostCode').val());
										sData += '&streetcountry=' + ns1blankspace.util.fs($('#inputns1blankspaceMainAddressStreetCountry').val());
										
										sData += '&mailingaddress1=' + ns1blankspace.util.fs($('#inputns1blankspaceMainAddressMailingAddress1').val());
										sData += '&mailingaddress2=' + ns1blankspace.util.fs($('#inputns1blankspaceMainAddressMailingAddress2').val());
										sData += '&mailingsuburb=' + ns1blankspace.util.fs($('#inputns1blankspaceMainAddressMailingSuburb').val());
										sData += '&mailingstate=' + ns1blankspace.util.fs($('#inputns1blankspaceMainAddressMailingState').val());
										sData += '&mailingpostcode=' + ns1blankspace.util.fs($('#inputns1blankspaceMainAddressMailingPostCode').val());
										sData += '&mailingcountry=' + ns1blankspace.util.fs($('#inputns1blankspaceMainAddressMailingCountry').val());
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspaceEndpointURL('PRODUCT_ORDER_MANAGE'),
										data: sData,
										dataType: 'json',
										success: ns1blankspaceOrderSaveProcess
									});
								},

					process:	function ns1blankspaceOrderSaveProcess(oResponse)
								{
									
									if (oResponse.status == 'OK')
									{
										ns1blankspaceStatus('Saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
									}
									else
									{
										ns1blankspaceError(oResponse.error.errornotes);
									}
								}
				},

	deliveries: {
					show:		function ns1blankspaceOrderDelivery(oParam, oResponse)
								{
									var sXHTMLElementID = 'divns1blankspaceMainDelivery';
									
									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}

									if (oResponse == undefined)
									{
										
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tablens1blankspaceMainOrderDelivery" class="ns1blankspaceMain">' +
													'<tr id="trns1blankspaceMainOrderDeliveryRow1" class="ns1blankspaceMainRow1">' +
													'<td id="tdns1blankspaceMainOrderDeliveryColumn1" class="ns1blankspaceMainColumn1Large">' +
													ns1blankspace.xhtml.loading +
													'</td>' +
													'<td id="tdns1blankspaceMainOrderDeliveryColumn2" style="width: 200px;" class="ns1blankspaceMainColumn2Actionx">' +
													'</td>' +
													'</tr>' +
													'</table>';				
										
										$('#' + sXHTMLElementID).html(aHTML.join(''));
										
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tablens1blankspaceMainOrderDeliveryColumn2" class="ns1blankspaceMainColumn2">';
																		
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainOrderDeliveryColumn2').html(aHTML.join(''));
										
										$('#spanns1blankspaceMainOrderDeliveryAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											ns1blankspaceOrderDeliveryPick();
										})
										.css('width', '75px')
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'PRODUCT_ORDER_DELIVERY_SEARCH';
										oSearch.addField('reference,deliverydate,notes');
										oSearch.addFilter('order', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(data) {ns1blankspaceOrderDelivery(oParam, data)});	
									}
									else
									{	
										var aHTML = [];
										var h = -1;
											
										if (oResponse.data.rows.length == 0)	
										{
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceOrderInvoicesPick">';
											aHTML.push('<td class="ns1blankspaceMainRowNothing">No deliveries.</td>';
											aHTML.push('</tr>';
											aHTML.push('</tbody></table>';

											$('#tdns1blankspaceMainOrderDeliveryColumn1').html(aHTML.join(''));		
										}
										else
										{
										
											aHTML.push('<table id="tableOrderOrderDelivery" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceMainCaption">';
											aHTML.push('<td class="ns1blankspaceMainCaption">Date</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption">Notes</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption">&nbsp;</td>';
											aHTML.push('</tr>';
												
											$.each(oResponse.data.rows, function() 
											{
												aHTML.push(ns1blankspaceOrderDeliveryRow(this);
											});
											
											aHTML.push('</tbody></table>';

											ns1blankspacePaginationList(
											{
												xhtmlElementID: 'tdns1blankspaceMainOrderDeliveryColumn1',
												xhtmlContext: 'OrderDelivery',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspaceOrderDeliveryRow,
												type: 'json'
											}); 	
										
										}
									}	
								},

					row:		function ns1blankspaceOrderDeliveryRow(oRow)
								{
									var aHTML = [];
									var h = -1;
									
									aHTML.push('<tr class="ns1blankspaceMainRow">';
															
									aHTML.push('<td id="tdOrderDelivery_deliverydate-' + oRow.id + '" class="ns1blankspaceMainRow"' +
															'>' +
															oRow.deliverydate + '</td>';						
																
									aHTML.push('<td id="tdOrderDelivery_notes-' + oRow.id + '" class="ns1blankspaceMainRow"' +
															'>' +
															oRow.notes + '</td>';	
																						
									aHTML.push('<td id="tdOrderDelivery-' + oRow.id + '" class="ns1blankspaceMainRowOptionsSelect">&nbsp;</td>';
															
									aHTML.push('</tr>';	
									
									return aHTML.join('');
								}
				},
				
	pick: 		{
					show:		function ns1blankspaceOrderDeliveryPick(oParam, oResponse)
								{
									
									var sXHTMLElementID = 'divns1blankspaceMainDeliveryPick';
									
									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}

									if (oResponse == undefined)
									{
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tablens1blankspaceMainOrderDeliveryPick" class="ns1blankspaceMain">' +
													'<tr id="trns1blankspaceMainOrderDeliveryPickRow1" class="ns1blankspaceMainRow1">' +
													'<td id="tdns1blankspaceMainOrderDeliveryPickColumn1" class="ns1blankspaceMainColumn1Large">' +
													ns1blankspace.xhtml.loading +
													'</td>' +
													'<td id="tdns1blankspaceMainOrderDeliveryPickColumn2" style="width: 100px;" class="ns1blankspaceMainColumn2Action">' +
													'</td>' +
													'</tr>' +
													'</table>';				
										
										$('#' + sXHTMLElementID).html(aHTML.join(''));
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'PRODUCT_ORDER_DELIVERY_ITEM_SEARCH';
										oSearch.addField('producttext,quantity');
										oSearch.addFilter('order', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(data) {ns1blankspaceOrderDeliveryPick(oParam, data)});	
									}
									else
									{	
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tablens1blankspaceMainOrderDeliveryPickColumn2" class="ns1blankspaceMainColumn2">';
										
										aHTML.push('<tr><td id="tdns1blankspaceMainOrderstreetPickPrint" class="ns1blankspaceMainAction">' +
														'<span id="spanns1blankspaceMainOrderstreetPickPrint">Print</span>' +
														'</td></tr>';
														
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainOrderstreetPickColumn2').html(aHTML.join(''));
										
										$('#spanns1blankspaceMainOrderstreetPickPrint').button(
										{
											label: "Print"
										})
										.click(function() {
											alert("Show delivery docket");
										})
										.css('width', '75px')
										
										var aHTML = [];
										var h = -1;
											
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceOrderstreetPick">';
											aHTML.push('<td class="ns1blankspaceMainRowNothing">Nothing to pick.</td>';
											aHTML.push('</tr>';
											aHTML.push('</tbody></table>';

											$('#tdns1blankspaceMaiOrderstreetPickColumn1').html(aHTML.join(''));	
										}
										else
										{
											aHTML.push('<table id="tableOrderstreetPick" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceMainCaption">';
											aHTML.push('<td class="ns1blankspaceMainCaption">Product</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption" style="text-align:right;">Quantity Ordered</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption" style="text-align:right;">Already Delivered</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption" style="text-align:right;">This street</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption">&nbsp;</td>';
											aHTML.push('</tr>';
												
											$.each(oResponse.data.rows, function() 
											{ 
												aHTML.push(ns1blankspaceOrderstreetPickRow(this);
											});
											
											aHTML.push('</tbody></table>';

											ns1blankspacePaginationList(
											{
												xhtmlElementID: 'tdns1blankspaceMainOrderDeliveryPickColumn1',
												xhtmlContext: 'OrderDeliveryPick',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspaceOrderDeliveryPickRow,
												type: 'json'
											}); 	
										}
									}	
								},	

					row:		function ns1blankspaceOrderDeliveryPickRow(oRow)
								{
									var aHTML = [];
									var h = -1;
									
									aHTML.push('<tr class="ns1blankspaceMainRow">';
															
									aHTML.push('<td id="tdOrderstreetPick_title-' + oRow.id + '" class="ns1blankspaceMainRow">' +
															oRow.producttext + '</td>';
															
									aHTML.push('<td id="tdOrderstreetPick_quantity-' + oRow.id + '" class="ns1blankspaceMainRow"' +
															' style="text-align:right;">' +
															oRow.quantity + '</td>';						
																
									aHTML.push('<td id="tdOrderstreetPick_price-' + oRow.id + '" class="ns1blankspaceMainRow"' +
															' style="text-align:right;">' +
															'</td>';	

									aHTML.push('<td id="tdOrderstreetPick_totalprice-' + oRow.id + '" class="ns1blankspaceMainRow"' +
															' style="text-align:right;">' +
															'</td>';						
																						
									aHTML.push('<td id="tdOrderstreetPick-' + oRow.id + '" class="ns1blankspaceMainRowOptionsSelect">&nbsp;</td>';
															
									aHTML.push('</tr>';	
									
									return aHTML.join('');
								}
				},
				
	invoices: 	{
					show:		function ns1blankspaceOrderInvoices(oParam, oResponse)
								{
									var sXHTMLElementID = 'divns1blankspaceMainInvoices';
									
									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}

									if (oResponse == undefined)
									{
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tablens1blankspaceMainOrderInvoices" class="ns1blankspaceMain">' +
													'<tr id="trns1blankspaceMainOrderInvoicesRow1" class="ns1blankspaceMainRow1">' +
													'<td id="tdns1blankspaceMainOrderInvoicesColumn1" class="ns1blankspaceMainColumn1Large">' +
													ns1blankspace.xhtml.loading +
													'</td>' +
													'<td id="tdns1blankspaceMainOrderInvoicesColumn2" style="width: 100px;" class="ns1blankspaceMainColumn2Actionx">' +
													'</td>' +
													'</tr>' +
													'</table>';				
										
										$('#' + sXHTMLElementID).html(aHTML.join(''));
										
										var aHTML = [];
										var h = -1;
										
										aHTML.push('<table id="tablens1blankspaceMainOrderInvoicesColumn2" class="ns1blankspaceMainColumn2">';
										/*
										aHTML.push('<tr><td id="tdns1blankspaceMainOrderInvoicesAdd" class="ns1blankspaceMainAction">' +
														'<span id="spanns1blankspaceMainOrderInvoicesAdd">Add</span>' +
														'</td></tr>';
										*/				
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainOrderInvoicesColumn2').html(aHTML.join(''));
										
										$('#spanns1blankspaceMainOrderInvoicesAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											alert("Add Invoice");
										})
										.css('width', '75px')
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'PRODUCT_ORDER_DELIVERY_SEARCH';
										oSearch.addField('reference');
										oSearch.addFilter('order', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(oResponse)
										{	
											var aID = [];
											
											$.each(oResponse.data.rows, function() 
											{
												aID.push(this.id);
											});
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
											oSearch.addField('contactbusinesssenttotext,contactbusinesssentto,contactpersonsenttotext,contactpersonsentto,' +
																'projecttext,project,areatext,area,' +
																'reference,purchaseorder,sentdate,duedate,description,amount,tax,sent');
											oSearch.addFilter('object', 'EQUAL_TO', 51);
											oSearch.addFilter('objectcontext', 'IN_LIST', aID.join(','));
										
											oSearch.getResults(function(data) {ns1blankspaceOrderInvoices(oParam, data)});
										});	
									}
									else
									{	
										var aHTML = [];
										var h = -1;
											
										if (oResponse.data.rows.length == 0)	
										{
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceOrderInvoices">';
											aHTML.push('<td class="ns1blankspaceMainRowNothing">No invoices for this order.<br /><br />';
											
											if (ns1blankspace.objectContextData.status == 2)
											{
												aHTML.push('Click <strong>submit</strong> and then <strong>finalise</strong> in the summary section to create the invoice.</td>';
											}
											else
											{
												aHTML.push('Click <strong>finalise</strong> in the summary section to create the invoice.</td>';
											}
												
											aHTML.push('</tr>';
											aHTML.push('</tbody></table>';

											$('#tdns1blankspaceMainOrderInvoicesColumn1').html(aHTML.join(''));		
										}
										else
										{
											aHTML.push('<table id="tableOrderOrderInvoices" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push('<tbody>'
											aHTML.push('<tr class="ns1blankspaceMainCaption">';
											aHTML.push('<td class="ns1blankspaceMainCaption">Reference</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption" style="text-align:right;">Date</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption" style="text-align:right;">Amount</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption">&nbsp;</td>';
											aHTML.push('</tr>';
												
											$.each(oResponse.data.rows, function() 
											{
												aHTML.push(ns1blankspaceOrderInvoicesRow(this);
											});
											
											aHTML.push('</tbody></table>';

											ns1blankspacePaginationList(
											{
												xhtmlElementID: 'tdns1blankspaceMainOrderInvoicesColumn1',
												xhtmlContext: 'OrderInvoices',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspaceOrderInvoicesRow,
												functionNewPage: 'ns1blankspaceOrderProductsBind()',
												type: 'json'
											}); 	
										
											ns1blankspaceOrderIvoicesBind();
										}
									}	
								},

					row:		function ns1blankspaceOrderInvoicesRow(oRow)
								{
									var aHTML = [];
									var h = -1;
									
									aHTML.push('<tr class="ns1blankspaceMainRow">';
															
									aHTML.push('<td id="tdOrderInvoices_title-' + oRow.id + '" class="ns1blankspaceMainRow">' +
															oRow.reference + '</td>';
															
									aHTML.push('<td id="tdOrderInvoices_quantity-' + oRow.id + '" class="ns1blankspaceMainRow"' +
															' style="text-align:right;">' +
															oRow.sentdate + '</td>';						
																
									aHTML.push('<td id="tdOrderInvoices_price-' + oRow.id + '" class="ns1blankspaceMainRow"' +
															' style="text-align:right;">' +
															oRow.amount + '</td>';	
																						
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceMainRow">';	
									aHTML.push('<span id="spanOrderInvoices_options_view-' + oRow.id + '" class="ns1blankspaceMainRowOptionsView"></span>';
									aHTML.push('</td>';
																									
									aHTML.push('</tr>';							
									
									return aHTML.join('');
								},

					bind:		function ns1blankspaceOrderIvoicesBind()
								{
									$('.ns1blankspaceMainRowOptionsView').button( {
												text: false,
												icons: {
													primary: "ui-icon-play"
												}
									})
									.click(function() {
										var sID = this.id;
										var aID = sID.split('-');
											
										ns1blankspaceFinancialInvoiceMasterViewport({showHome: false});
										ns1blankspaceFinancialInvoiceSearch('-' + aID[1]);
									})
									.css('width', '15px')
									.css('height', '17px')
								}
				}
}								