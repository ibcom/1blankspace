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
					
					ns1blankspace.object = 16;
					ns1blankspace.objectName = 'Product';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					
					if (bShowHome)
					{
						ns1blankspaceViewportDestination({
							newDestination: 'interfaceProductMasterViewport({showHome: true});',
							move: false
							})		
					}
					
					ns1blankspaceReset();
					
					$('#divns1blankspaceViewportControlSet').button(
					{
						label: "Products"
					});
					
					$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
					{
						if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
				        ns1blankspace.timer.delayCurrent = setTimeout("interfaceProductSearch('inputns1blankspaceViewportControlSearch')", ns1blankspace.option.typingWait);	
					});
					
					$('#spanns1blankspaceViewportControlSearch').click(function(event)
					{
						interfaceProductSearch('inputns1blankspaceViewportControlSearch');
					});
					
					$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
					{
						interfaceProductSearchOptions();
					});
					
					$('#spanns1blankspaceViewportControlNew').click(function(event)
					{
						interfaceProductNew();
					})
					
					$('#spanns1blankspaceViewportControlNewOptions').click(function(event)
					{
						interfaceProductNewOptions();
					});
					
					$('#spanns1blankspaceViewportControlAction').click(function(event)
					{
						interfaceProductSave();
					});
					
					$('#spanns1blankspaceViewportControlActionOptions').click(function(event)
					{
						interfaceProductSaveOptions();
					});
					
					$('#spanns1blankspaceViewportControlSetup').click(function(event)
					{
						interfaceProductSetup();
					});
					
					$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
					{
						interfaceProductSetupOptions();
					});
					
					$('#spanns1blankspaceViewportControlHelp').click(function(event)
					{
						interfaceProductHelp();
					});
					
					$('#spanns1blankspaceViewportControlHelpOptions').click(function(event)
					{
						interfaceProductHelpOptions();
					});
					
					$('td.interfaceViewportMasterControlBrowse').click(function(event)
					{
						interfaceProductSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
					});
					
					$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
					{
						interfaceProductSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
					});
					
					if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
					
					if (bShowHome) {interfaceProductHomeShow()};
				},

	home:		function (oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
						var h = -1;
									
						aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
						aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
										'<td id="tdInterfaceProductHomeMostLikely" class="interfaceViewportMain">' +
										ns1blankspace.xhtml.loading + 
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMain').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
									
						aHTML[++h] = '<table>';
						aHTML[++h] = '<tr>' +
										'<td id="ns1blankspaceViewportProductLarge" class="ns1blankspaceViewportImageLarge">' +
										'&nbsp;' + 
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';		
						
						$('#divInterfaceViewportControl').html(aHTML.join(''));	
						
						$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'PRODUCT_SEARCH';
						oSearch.addField('reference,title');
						oSearch.rf = 'json';
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(interfaceProductHomeShow);
					}
					else
					{
						var aHTML = [];
						var h = -1;
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML[++h] = '<table id="tableInterfaceProductHomeMostLikely">';
							aHTML[++h] = '<tr class="trInterfaceProductHomeMostLikelyNothing">';
							aHTML[++h] = '<td class="tdInterfaceProductHomeMostLikelyNothing">Click New to create a product.</td>';
							aHTML[++h] = '</tr>';
							aHTML[++h] = '</table>';
						}
						else
						{
							aHTML[++h] = '<table id="tableInterfaceProjectHomeMostLikely">';
							aHTML[++h] = '<tr>';
							aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
							aHTML[++h] = '</tr>';
							
							$.each(oResponse.data.rows, function()
							{	
								aHTML[++h] = '<tr class="interfaceMainRow">';
								
								aHTML[++h] = '<td id="interfaceProjectHomeMostLikely_Title-' + this.id + 
														'" class="interfaceHomeMostLikely">' +
														this.title +
														'</td>';
								
								aHTML[++h] = '</tr>'
							});
							
							aHTML[++h] = '</tbody></table>';
						}
						
						$('#tdInterfaceProductHomeMostLikely').html(aHTML.join(''));
					
						$('td.interfaceHomeMostLikely').click(function(event)
						{
							interfaceProductSearch(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function interfaceProductSearch(sXHTMLElementId, oParam)
								{
									var aSearch = sXHTMLElementId.split('-');
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
										$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'PRODUCT_SEARCH';
										oSearch.addField('reference,title,trackinventory,status,statustext,description,' +
															'unittype,unittypetext,units,category,categorytext,currentretailprice,type,minimumstocklevel');
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										oSearch.getResults(function(data){interfaceProductShow(oParam, data)});
									}
									else
									{
										if (sSearchText == undefined)
										{
											sSearchText = $('#inputns1blankspaceViewportControlSearch').val();
										}	
										
										if (iSource == ns1blankspace.data.searchSource.browse)
										{
											iMinimumLength = 1;
											iMaximumColumns = 4;
											sSearchText = aSearch[1];
											if (sSearchText == '#') {sSearchText = '[0-9]'}
											sElementId = 'tableInterfaceViewportMasterBrowse';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspaceOptionsSetPosition(sElementId);
											ns1blankspaceSearchStart(sElementId);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'PRODUCT_SEARCH';
											oSearch.addField('reference,title');
											oSearch.rf = 'json';
										
											if (iSource == ns1blankspace.data.searchSource.browse)
											{
												oSearch.addFilter('title', 'STRING_STARTS_WITH', sSearchText);
											}
											else
											{	
												oSearch.addFilter('title', 'STRING_IS_LIKE', sSearchText);
											}	
										
											oSearch.getResults(function(data){interfaceProductSearchShow(oParam, data)});
										}
									};	
								},

					process:	function interfaceProductSearchShow(oParam, oResponse)
								{

									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
										
									if (oResponse.data.rows.length == 0)
									{
										$('#divns1blankspaceViewportControlOptions').hide();
									}
									else
									{
										aHTML[++h] = '<table class="interfaceSearchMedium">';
										aHTML[++h] = '<tbody>'
											
										$.each(oResponse.data.rows, function()
										{	
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML[++h] = '<tr class="interfaceSearch">';
											}
											
											aHTML[++h] = '<td class="interfaceContactType' + this.type + ' interfaceSearch">&nbsp;</td>';
											aHTML[++h] = '<td class="interfaceSearch" id="' +
															'-' + this.id + '">' +
															this.title +
															'</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML[++h] = '</tr>'
												iColumn = 0;
											}	
										});
								    	
										aHTML[++h] = '</tbody></table>';

										$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
										$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
										var oElement = $('#inputns1blankspaceViewportControlSearch');
										$('#divns1blankspaceViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
										ns1blankspaceSearchStop();
										
										$('td.interfaceSearch').click(function(event)
										{
											$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
											$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
											interfaceProductSearch(event.target.id, {source: 1});
										});
									}			
								}
				},				

	layout: 	function interfaceProductViewport()
				{
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
					
					aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
										'</tr>';
					}
					else
					{	
						aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
										'</tr>';
									
						aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
										'</tr>';
									
						aHTML[++h] = '<tr id="trInterfaceViewportControlPricing" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlPricing" class="interfaceViewportControl">Pricing</td>' +
										'</tr>';
					
						aHTML[++h] = '<tr id="trInterfaceViewportControlCategory" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlCategory" class="interfaceViewportControl">Category</td>' +
										'</tr>';
					
						aHTML[++h] = '<tr id="trInterfaceViewportControlStock" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlStock" class="interfaceViewportControl">Stock</td>' +
										'</tr>';
					
						aHTML[++h] = '</table>';					

						aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
					
						aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlActions" class="interfaceViewportControl">Actions</td>' +
										'</tr>';
									
						aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
										'</tr>';
					}
									
					aHTML[++h] = '</table>';					
							
					$('#divInterfaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainPricing" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainCategory" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainSupplier" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainStock" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
					
					$('#divInterfaceMain').html(aHTML.join(''));
					
					$('#tdInterfaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
						interfaceProductSummary();
					});
					
					$('#tdInterfaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
						interfaceProductDetails();
					});
					
					$('#tdInterfaceViewportControlPricing').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainPricing");
						interfaceProductPricing();
					});
					
					$('#tdInterfaceViewportControlCategory').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainCategory");
						interfaceProductCategory();
					});
					
					$('#tdInterfaceViewportControlSupplier').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainSupplier");
						interfaceProductSupplier();
					});
					
					$('#tdInterfaceViewportControlStock').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainStock");
						interfaceProductStock("divInterfaceMainStock", true);
					});
					
					$('#tdInterfaceViewportControlActions').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainActions", true);
						ns1blankspaceActions({xhtmlElementID: 'divInterfaceMainActions'});
					});

					$('#tdInterfaceViewportControlAttachments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainAttachments", true);
						ns1blankspaceAttachments({xhtmlElementID: 'divInterfaceMainAttachments'});
					});
				},

	show:		function interfaceProductShow(oParam, oResponse)
				{
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
					interfaceProductViewport();

					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the product.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
								
						aHTML[++h] = ns1blankspace.objectContextData.title;
						
						if (ns1blankspace.objectContextData.categorytext != '')
						{
							aHTML[++h] = '<span id="spanInterfaceViewportControlSubContext">' + ns1blankspace.objectContextData.categorytext + '</span>'
						}
						
						if (ns1blankspace.objectContextData.currentretailprice != '')
						{
							aHTML[++h] = '<span id="spanInterfaceViewportControlSubContext">' + ns1blankspace.objectContextData.currentretailprice + '</span>'
						}
								
						$('#divInterfaceViewportControlContext').html(aHTML.join('<br />'));
						
						$('#spanns1blankspaceViewportControlAction').button({disabled: false});
						$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});
						
						ns1blankspaceViewportDestination({
							newDestination: 'interfaceProductMasterViewport({showHome: false});interfaceProductSearch("-' + ns1blankspace.objectContext + '")',
							move: false
							})
							
						ns1blankspaceObjectViewportHistory({functionDefault: 'interfaceProductSummary()'});
					}	
				},		
		
	summary: 	function interfaceProductSummary()
				{
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find Product.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMainSummary').html(aHTML.join(''));
					}
					else
					{	
						aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
						aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
									'<td id="tdInterfaceMainSummaryColumn1Large" class="interfaceMainColumn1Large">' +
										'</td>' +
										'<td id="tdInterfaceMainSummaryColumn2Action" style="width:100px;">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainSummary').html(aHTML.join(''));
					
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
						
						if (ns1blankspace.objectContextData.currentretailprice != '')
						{
							aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPrice" class="interfaceMainSummary">Retail Price</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryPriceValue" class="interfaceMainSummaryValue" style="font-size:1.5em;font-weight:bold;">';
							aHTML[++h] = '$' + ns1blankspace.objectContextData.currentretailprice;
							aHTML[++h] = '</td></tr>';
						}	
						
						if (ns1blankspace.objectContextData.units != '')
						{
							aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryQuantity" class="interfaceMainSummary">Units</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryQuantityValue" class="interfaceMainSummaryValue" style="font-size:1.5em;font-weight:bold;">';
							aHTML[++h] = ns1blankspace.objectContextData.units;
							aHTML[++h] = '</td></tr>';
						}	
						
						if (ns1blankspace.objectContextData.description != '')
						{	
							aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>';
						}
						
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;	
						
						aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action" cellspacing=0>';
										
						if (ns1blankspace.objectContextData.imageurl && ns1blankspace.objectContextData.imageurl != '')
						{	
							aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryImage class="interfaceMainColumn2Action">' +
										'<img border=0 src="' + ns1blankspace.objectContextData.imageurl + '">' +
										'</td></tr>';
						}						
										
						if (false && ns1blankspace.objectContextData.trackinventory != 'Y')
						{	
							aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryAdjustStock" class="interfaceMainColumn2Action">' +
										'<a href="#" id="aInterfaceMainSummaryAdjustStock">Adjust&nbsp;Stock</a>' +
										'</td></tr>';
						}				
										
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
						
						$('#aInterfaceMainSummaryAdjustStock').click(function(event)
						{
							interfaceProductStock();
						});
					}	
				},

	details:	function interfaceProductDetails()
				{
					var aHTML = [];
					var h = -1;
					
					if ($('#divInterfaceMainDetails').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainDetails').attr('onDemandLoading', '');
								
						aHTML[++h] = '<table id="tableInterfaceMainDetails" class="interfaceMainDetails">';
						aHTML[++h] = '<tr id="trInterfaceMainDetailsRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsColumn1" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainDetailsColumn2" class="interfaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainDetails').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
						
						aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
						
						aHTML[++h] = '<tr id="trInterfaceMainDetailsReference" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsReference" class="interfaceMain">' +
										'Reference' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsReference" class="inputInterfaceMainText">' +
										'</td></tr>';			
										
						aHTML[++h] = '<tr id="trInterfaceMainDetailsTitle" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
										'Title' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsTitleValue" class="interfaceMainSelect">' +
										'<td id="tdInterfaceMainDetailsTitleValue" class="interfaceMainSelect">' +
										'<input id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainText">' +
										'</td></tr>';							
							
						aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
										'Description' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
										'<textarea style="width:320px;" rows="10" cols="35" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
										'</td></tr>';	
							
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
							
						aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
						
						aHTML[++h] = '<tr id="trInterfaceMainDetailsStatus" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsStatus" class="interfaceMain">' +
										'Status' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsStatus" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsStatusValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Coming Soon' +
										'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Available Now' +
										'<br /><input type="radio" id="radioStatus6" name="radioStatus" value="6"/>Discontinued' +
										'<br /><input type="radio" id="radioStatus7" name="radioStatus" value="7"/>Internal' +
										'</td></tr>';
						
						aHTML[++h] = '<tr id="trInterfaceMainDetailsProductType" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsProductTypeStock" class="interfaceMain">' +
										'Product Type' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsProductType" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsProductTypeValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioProductType1" name="radioProductType" value="1"/>Standard' +
										'</td></tr>';
										
						//'<br /><input type="radio" id="radioProductType2" name="radioProductType" value="2"/>Grouped' +
						
						aHTML[++h] = '</table>';					
							
						$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							var iStatus = ns1blankspace.objectContextData.status;
							if (iStatus == '') {iStatus = 1}
						
							$('#inputInterfaceMainDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#inputInterfaceMainDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#inputInterfaceMainDetailsDescription').val(ns1blankspace.objectContextData.description);
							$('[name="radioStatus"][value="' + iStatus + '"]').attr('checked', true);
							$('[name="radioProductType"][value="' + ns1blankspace.objectContextData.type + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioStatus"][value="2"]').attr('checked', true);
							$('[name="radioProductType"][value="1"]').attr('checked', true);
						}	
					}	
				},

	pricing: 	{			
					show: 		function interfaceProductPricing()
								{
									var aHTML = [];
									var h = -1;
									
									if ($('#divInterfaceMainPricing').attr('onDemandLoading') == '1')
									{
										$('#divInterfaceMainPricing').attr('onDemandLoading', '');
												
										aHTML[++h] = '<table id="tableInterfaceMainPricing" class="interfaceMainPricing">';
										aHTML[++h] = '<tr id="trInterfaceMainPricingRow1" class="interfaceMain">' +
														'<td id="tdInterfaceMainPricingColumn1" class="interfaceMainColumn1">' +
														'</td>' +
														'<td id="tdInterfaceMainPricingColumn2" class="interfaceMainColumn2x">' +
														'</td>' +
														'</tr>';
										aHTML[++h] = '</table>';					
										
										$('#divInterfaceMainPricing').html(aHTML.join(''));
										
										var aHTML = [];
										var h = -1;
										
										aHTML[++h] = '<table id="tableInterfaceMainPricingColumn1" class="interfaceMain">';
										
										aHTML[++h] = '<tr id="trInterfaceMainDetailsPriceRetail" class="interfaceMain">' +
														'<td id="tdInterfaceMainDetailsPriceRetail" class="interfaceMain">' +
														'Retail Price' +
														'</td></tr>' +
														'<tr id="trInterfaceMainPricingPriceRetailValue" class="interfaceMainText">' +
														'<td id="tdInterfaceMainPricingPriceRetailValue" class="interfaceMainText">' +
														'<input id="inputInterfaceMainPricingPriceRetail" class="inputInterfaceMainText">' +
														'</td></tr>';			
										
										aHTML[++h] = '</table>';					
										
										$('#tdInterfaceMainPricingColumn1').html(aHTML.join(''));
											
										interfaceProductPricingGroup({xhtmlElemendID: 'tdInterfaceMainPricingColumn2'})

										if (ns1blankspace.objectContextData != undefined)
										{
											$('#inputInterfaceMainPricingPriceRetail').val(ns1blankspace.objectContextData.currentretailprice);
										}
										else
										{
											$('[name="radioPriceGroup"][value="-1"]').attr('checked', true);
										}	
									}	
								},

					group:		function interfaceProductPricingGroup(oParam, oResponse)
								{
									var aHTML = [];
									var h = -1;
									var sXHTMLElementID = 'tdInterfaceMainPricingColumn2';
									
									if (oResponse == undefined)
									{
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/setup/?rows=999&method=SETUP_PRODUCT_PRICING_GROUP_SEARCH',
											dataType: 'json',
											async: false,
											success: function(data) {interfaceProductPricingGroup(oParam, data)}
										});
									}
									else
									{
										
										if (oParam != undefined)
										{
											if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										}	
										
										var aHTML = [];
										var h = -1;
												
										aHTML[++h] = '<table id="tableInterfaceMainPricingColumn2" class="interfaceMain">';
										
										aHTML[++h] = '<tr id="trInterfaceMainPricingGroup" class="interfaceMain">' +
														'<td id="tdInterfaceMainPricingGroup" class="interfaceMain">' +
														'Group' +
														'</td></tr>' +
														'<tr id="trInterfaceMainPricingGroup" class="interfaceMain">' +
														'<td id="tdInterfaceMainPricingGroupValue" class="interfaceMainText" style="font-size:0.875em">' +
														'<input type="radio" id="radioPricingGroup-1" name="radioPricingGroup" value="-1"/>' +
														'All<br />';
										
										if (oResponse.data.rows.length != 0)	
										{
											$.each(oResponse.data.rows, function() 
											{ 
												if (this.title != '')
												{
													aHTML[++h] = '<input type="radio" id="radioPricingGroup' + this.id + '" name="radioPricingGroup" value="' + this.id + ' "/>' +
																this.title + '<br />';
												}				
											});
										}
										
										aHTML[++h] = '</td></tr>';
										
										$('#' + sXHTMLElementID).html(aHTML.join(''));
									}	
								},

					save: 		function (oParam)
								{
									var sParam = 'method=PRODUCT_PRICE_MANAGE&rf=JSON';
									var sData = 'price=' + ns1blankspace.util.fs($('#inputInterfaceMainPricingPriceRetail').val());
									sData += '&product=' + ns1blankspace.objectContext;
									
									$.ajax(
									{
										type: 'POST',
										url: '/ondemand/product/?' + sParam,
										data: sData,
										dataType: 'json'
									});
								}			
				},				

	category:	function interfaceProductCategory(oParam, oResponse)
				{
					var aHTML = [];
					var h = -1;
					
					if ($('#divInterfaceMainCategory').attr('onDemandLoading') == '1')
					{
						if (oResponse == undefined)
						{	
							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_PRODUCT_CATEGORY_SEARCH';
							oSearch.addField('title');
							oSearch.getResults(function(data) {
									interfaceProductCategory(oParam, data)
									});
						}
						else
						{
							$('#divInterfaceMainCategory').attr('onDemandLoading', '');
							
							var aHTML = [];
							var h = -1;
								
							aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';

							if (oResponse.data.rows == 0)
							{
								aHTML[++h] = '<tr>';
								aHTML[++h] = '<td class="interfaceMainRowNothing">No categories have been set up.</td>';
								aHTML[++h] = '</tr>';
							}
							else
							{
								aHTML[++h] = '<tr id="trInterfaceMainCategory" class="interfaceMain">' +
												'<td id="tdInterfaceMainCategoryValue" class="interfaceMainText" style="font-size:0.875em">';
									
								$.each(oResponse.data.rows, function() 
								{ 
									aHTML[++h] = '<input type="radio" id="radioCategory' + this.id + '" name="radioCategory" value="' + this.id + '"/>' +
													this.title + '<br />';
								});
						
								aHTML[++h] = '</td></tr>';
							}
							
							$('#divInterfaceMainCategory').html(aHTML.join(''));

							if (oResponse.data.rows.length != 0)
							{
								$('[name="radioCategory"][value="' + ns1blankspace.objectContextData.category + '"]').attr('checked', true);
							}
						}	
					}	
				},

	stock:		function interfaceProductStock()
				{
					var aHTML = [];
					var h = -1;

					if ($('#divInterfaceMainStock').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainStock').attr('onDemandLoading', '');
								
						aHTML[++h] = '<table id="tableInterfaceMainStock" class="interfaceMainStock">';
						aHTML[++h] = '<tr id="trInterfaceMainStockRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainStockColumn1" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainStockColumn2" class="interfaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainStock').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
						
						aHTML[++h] = '<table id="tableInterfaceMainStockColumn1" class="interfaceMain">';
						
						aHTML[++h] = '<tr id="trInterfaceMainDetailsQuantity" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsQuantity" class="interfaceMain">' +
										'Quantity' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsQuantityValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsQuantityValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsQuantity" class="inputInterfaceMainText">' +
										'</td></tr>';			
						
						aHTML[++h] = '<tr id="trInterfaceMainDetailsMinimumStockLevel" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsMinimumStockLevel" class="interfaceMain">' +
										'Minimum Stock Level' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsMinimumStockLevelValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsMinimumStockLevelValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsMinimumStockLevel" class="inputInterfaceMainText">' +
										'</td></tr>';			
						
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainStockColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
							
						aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
						
						aHTML[++h] = '<tr id="trInterfaceMainDetailsStockUnit" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsStockUnit" class="interfaceMain">' +
										'Stock Type' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsStockUnit" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsStockUnitValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioStockUnit1" name="radioStockUnit" value="1"/>Each' +
										'<br /><input type="radio" id="radioStockUnit2" name="radioStockUnit" value="2"/>Packet' +
										'<br /><input type="radio" id="radioStockUnit6" name="radioStockUnit" value="3"/>Metre' +
										'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="4"/>Box' +
										'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="5"/>kg' +
										'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="6"/>Thousand' +
										'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="7"/>Unit' +
										'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="8"/>Hour' +
										'<br /><input type="radio" id="radioStockUnit7" name="radioStockUnit" value="9"/>Pair' +
										'</td></tr>';
						
						aHTML[++h] = '<tr id="trInterfaceMainDetailsTrackStock" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsTrackStock" class="interfaceMain">' +
										'Track Stock' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsTrackStock" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsTrackStockValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioTrackStockN" name="radioTrackStock" value="N"/>No' +			
										'</td></tr>';
						
						aHTML[++h] = '</table>';					
							
						$('#tdInterfaceMainStockColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputInterfaceMainDetailsQuantity').val(ns1blankspace.objectContextData.units);
							$('#inputInterfaceMainDetailsMinimumStockLevel').val(ns1blankspace.objectContextData.minimumstocklevel);
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

	new:		function interfaceProductNew()
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					interfaceProductViewport();
					ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
					interfaceProductDetails();
				},

	save: 		{			
					send: 		function interfaceProductSave()
								{
									ns1blankspaceStatusWorking();

									var sData = 'id=' + ((ns1blankspace.objectContext == -1)?'':ns1blankspace.objectContext);
											
									if ($('#divInterfaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsReference').val());
										sData += '&title=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsTitle').val());
										sData += '&description=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsDescription').val());
										
										var iStatus = $('input[name="radioStatus"]:checked').val()
										if (iStatus == '') {iStatus = 1}
										
										sData += '&status=' + iStatus;
										sData += '&type=' + $('input[name="radioProductType"]:checked').val();
									}
									
									if ($('#divInterfaceMainStock').html() != '')
									{
										sData += '&minimumstocklevel=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsMinimumStockLevel').val());
										sData += '&unittype=' + $('input[name="radioStockUnit"]:checked').val();
										sData += '&trackinventory=' + $('input[name="radioTrackStock"]:checked').val();
									}
									
									if ($('#divInterfaceMainCategory').html() != '')
									{
										var iCategory = $('input[name="radioCategory"]:checked').val()
										if (iCategory == '') {iCategory = $('input[name="radioCategory"]:first').val()}
									
										sData += '&category=' + ns1blankspace.util.fs(iCategory);
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspaceEndpointURL('PRODUCT_MANAGE'),
										data: sData,
										dataType: 'json',
										success: interfaceProductSaveProcess
									});
								},

					process:	function interfaceProductSaveProcess(oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspaceStatus('Saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
										
										if ($('#divInterfaceMainPricing').html() != '')
										{
											interfaceProductPriceSave();
										}
											
										if ($('#divInterfaceMainStock').html() != '')
										{
											interfaceProductQuantitySave();
										}	
									}
									else
									{
										ns1blankspaceError(oResponse.error.errornotes);
									}
								}

					save:		function interfaceProductQuantitySave(oParam)
								{
									var sParam = 'method=PRODUCT_STOCK_MANAGE&rf=JSON';
									var sData = 'units=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsQuantity').val());
									sData += '&product=' + ns1blankspace.objectContext;
									sData += '&type=3';
									sData += '&effectivedate=' + Date.today().toString("dd-MMM-yyyy");
									
									$.ajax(
									{
										type: 'POST',
										url: '/ondemand/product/?' + sParam,
										data: sData,
										dataType: 'json'
									});
								}
				}
}				
	