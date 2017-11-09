/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

ns1blankspace.financial.reportSummary =
{
	"revenue":
		[
			{code: "g1", total: false, title: "Total sales income & other sales"},
			{code: "g2", total: false, title: "Exports"},
			{code: "g3", total: false, title: "Other GST-free sales"},
			{code: "g4", total: false, title: "Input taxed sales"},
			{code: "g5", total: true, title: "Total of GST-free and input taxed supplies"},
			{code: "g6", total: true, title: "Total of taxable sales"},
			{code: "g7", total: true, title: "Adjustments"},
			{code: "g8", total: true, title: "Total of taxable sales after adjustments"},
			{code: "g9", total: true, title: "GST Collected"}
		],
	"expense": 
		[
			{code: "g10", total: false, title: "Capital Acquisitions"},
			{code: "g11", total: false, title: "Other acquisitions"},
			{code: "g12", total: true, title: "Total of acquisitions"},
			{code: "g13", total: false, title: "Acquisitions for making input taxed sales"},
			{code: "g14", total: false, title: "Acquisitions with no GST in the price"},
			{code: "g15", total: false, title: "Total of estimated private use of acquisitions + non income tax deductible acquisitions"},
			{code: "g16", total: true, title: "Total of non-refundable acquisition"},
			{code: "g17", total: true, title: "Total of refundable acquisitions"},
			{code: "g18", total: true, title: "Adjustments"},
			{code: "g19", total: true, title: "Total of refundable acquisitions after adjustments"},
			{code: "g20", total: true, title: "GST Credits"}
		],
	"payroll":
		[
			{code: "w1", total: true, title: "Total salary, wages & other payments"},
			{code: "w2", total: true, title: "Amount withheld from payments shown at W1"}
		],
	"instalments":
		[
			{code: "t1", total: false, title: "PAYG Instalment Income"},
			{code: "t2", total: false, title: "Instalment Rate %"},
			{code: "t3", total: false, title: "Varied % Rate"},
			{code: "t7", total: false, title: "Nominated Value"},
			{code: "t9", total: false, title: "Varied amount for period"},
			{code: "t11", total: false, title: "Income Tax Instalment"}
		]
};

ns1blankspace.financial.tax = 
{
	init: 		function (oParam)
				{
					var bInitialised = false;

					if (oParam != undefined)
					{
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}	
					}

					ns1blankspace.app.reset();

					ns1blankspace.object = -4;
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'tax';
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Tax (BAS)';
					
					if (!bInitialised)
					{
						ns1blankspace.financial.initData(oParam)
					}
					else
					{
						ns1blankspace.app.set(oParam);
					}	
				},

	home: 		function (oParam, oResponse)
				{		
					if (oResponse == undefined)
					{
						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceMain">' + 
										'<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ns1blankspaceMain">' +
										ns1blankspace.xhtml.loading +
										'</td></tr>' + 
										'</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
											
						var aHTML = [];

						aHTML.push('<table>');
						aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
													
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
								
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_TAX_REPORT_SEARCH';
						oSearch.addField('taxstartdate,enddate,taxofficereference,statustext,reference');
						oSearch.rows = ns1blankspace.option.defaultRows;
						oSearch.sort('enddate', 'desc');
						oSearch.getResults(function(data){ns1blankspace.financial.tax.home(oParam, data)});
						
					}
					else
					{
						var aHTML = [];

						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceNothing">Click New to add a tax report.</td></tr>');
							aHTML.push('</table>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceCaption" colspan="4">RECENT</td></tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_enddate-' + this.id + '" class="ns1blankspaceMostLikely" style="width:130px;">' +
														this.enddate + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_status-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;">' +
														this.statustext  + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_reference-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;">' +
														this.reference  + '</td>');
							
								aHTML.push('<td>&nbsp;</td></tr>');
							});
					
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('.ns1blankspaceMostLikely').click(function(event) {
							ns1blankspace.financial.tax.search.send(event.target.id, {source: 1});
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
										oSearch.method = 'FINANCIAL_TAX_REPORT_SEARCH';
										oSearch.addField('area,areatext,taxofficereference,instalmentstartdate,deferredtax,enddate,payrolltaxstartdate,taxaccountingmethod,' +
															'taxstartdate,includeinstalment,includepayrolltax,includetax,previousinstalmentsamount,status,statustext,' +
															'submittedcontactperson,submittedcontactpersontext,type,typetext,' +
															'g1,g2,g3,g4,g5,g6,g7,g8,g9,g10,g11,g12,g13,g14,g15,g16,g17,g18,g19,g20,g21,' +
															't1,t2,t3,t7,t9,w1,w2,salesadjustment,purchasesadjustment,reference,' +
															'createdusertext,createduser,createddate,modifiedusertext,modifieduser,modifieddate');
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										oSearch.getResults(function(data) {ns1blankspace.financial.tax.show(oParam, data)});
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
											var aSearch = sSearch.split('-');
											sSearchText = aSearch[1];
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.search.start();
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_TAX_REPORT_SEARCH';
											oSearch.addField('enddate,taxofficereference');
											oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);

											var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
  											if (oSearchDate.isValid())
											{
												oSearch.addFilter('or');
												oSearch.addFilter('enddate', 'APPROX_EQUAL_TO', oSearchDate.format('DD MMM YYYY'));	
											}

											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.sort('enddate', 'DESC');
											oSearch.rows = ns1blankspace.option.defaultRowsSmall;

											oSearch.getResults(function(data) {ns1blankspace.financial.tax.search.process(oParam, data)});	
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var	iMaximumColumns = 1;

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
															'-' + this.id + '">' +
															this.enddate +
															'</td>');
											
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
											ns1blankspace.financial.tax.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'enddate',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.financial.tax.search.send
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

						aHTML.push('</table>');

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlVAT" class="ns1blankspaceControl">' +
										ns1blankspace.option.taxVATCaption + '</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlPayroll" class="ns1blankspaceControl">' +
										ns1blankspace.option.taxPayrollCaption + '<br /><span class="ns1blankspaceSub" style="font-size:0.75em;">wages</span></td></tr>');

						if (ns1blankspace.objectContextData.status == 2)
						{
							aHTML.push('</table>');

							aHTML.push('<table class="ns1blankspaceControl">');

							aHTML.push('<tr><td id="ns1blankspaceControlFinancials" class="ns1blankspaceControl">' +
										'Financials</td></tr>');
						}	
					}				
					
					aHTML.push('</table>');

					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = []

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainVAT" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPayroll" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainFinancials" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.financial.tax.summary();
					});

					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.financial.tax.details();
					});
					
					$('#ns1blankspaceControlVAT').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainVAT', refresh: true});
						ns1blankspace.financial.tax.vat.layout();
					});

					$('#ns1blankspaceControlPayroll').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPayroll', refresh: true});
						ns1blankspace.financial.tax.payroll.layout();
					});

					$('#ns1blankspaceControlFinancials').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainFinancials', refresh: true});
						ns1blankspace.financial.tax.financials.init();
					});
				},

	show:		function (oParam, oResponse)
				{	
					ns1blankspace.app.clean();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the tax report.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						ns1blankspace.financial.tax.layout();
						
						var sStartDate = ns1blankspace.objectContextData['taxstartdate'];
						if (sStartDate == '') {sStartDate = ns1blankspace.objectContextData['payrolltaxstartdate']}

						$('#ns1blankspaceViewControlAction').button({disabled: false});
								
						$('#ns1blankspaceControlContext').html(sStartDate +
							'<br />to ' + ns1blankspace.objectContextData['enddate'] +
							'<br /><span id="ns1blankspaceControlContext_status" class="ns1blankspaceSub">' + ns1blankspace.objectContextData['statustext'] + '</span>');
							
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.financial.tax.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.tax.summary()'});
					}	
				},	

	summary:	function (oParam, oResponse)
				{
					var aHTML = [];
					
					var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1}).value;

					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the tax report.</td></tr></table>');
								
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						if (iStep == 1)
						{	
							aHTML.push('<table class="ns1blankspaceMain">' +
											'<tr class="ns1blankspaceRow">' +
											'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
											'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:250px;"></td>' +
											'</tr>' +
											'</table>');				
			
							$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
					
							var aHTML = [];

							var cTaxPayable = (ns1blankspace.objectContextData['g9']).parseCurrency();

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">' + ns1blankspace.option.taxVATCaption + ' on Sales (collected)</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryG9" class="ns1blankspaceSummary">$' +
											cTaxPayable.formatMoney(0, ".", ",") +
											'</td></tr>');

							var cTaxCredit = (ns1blankspace.objectContextData['g20']).parseCurrency();

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">' + ns1blankspace.option.taxVATCaption + ' on Purchases (credits)</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryG20" class="ns1blankspaceSummary">$' +
											cTaxCredit.formatMoney(0, ".", ",")+
											'</td></tr>');

							var cTaxVATPayable = cTaxPayable - cTaxCredit;

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">' + ns1blankspace.option.taxVATCaption + ' Payable</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryG20" class="ns1blankspaceSummary">$' +
											(cTaxVATPayable).formatMoney(0, '.', ',') +
											'</td></tr>');

							var cTaxEmployeePayable = (ns1blankspace.objectContextData['w2']).parseCurrency();

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Employee Tax Payable</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryW2" class="ns1blankspaceSummary">$' +
											cTaxEmployeePayable.formatMoney(0, ".", ",") +
											'</td></tr>');

							var cTaxPayable = cTaxVATPayable + cTaxEmployeePayable;

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Total Tax Payable</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryW2" class="ns1blankspaceSummary" style="font-weight:bold;">$' +
											cTaxPayable.formatMoney(0, ".", ",") +
											'</td></tr>');

							$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

							var aHTML = [];

							var oDate = moment(ns1blankspace.objectContextData['modifieddate'], 'DD MMM YYYY HH:mm:ss');
						
							aHTML.push('<table class="ns1blankspaceColumn2">');

							aHTML.push('<tr><td id="ns1blankspaceSummaryAmount" class="ns1blankspaceSub">' +
											ns1blankspace.objectContextData['reference'] + 
											'</td></tr>');

							aHTML.push('<tr><td id="ns1blankspaceSummaryAmount" class="ns1blankspaceSub" style="padding-top:12px;">' +
											'This tax report was last updated on the ' + oDate.format('DD MMM YYYY h:mm a') + '.' +
											'</td></tr>');

							if (ns1blankspace.objectContextData['status'] == 1)
							{	
								aHTML.push('<tr><td style="padding-top:10px;">' +
											'<span id="ns1blankspaceSummaryCalculate" class="ns1blankspaceAction" style="font-size:0.875em; width:120px;">Recalculate</span>' +
											'</td></tr>');

								aHTML.push('<tr><td style="padding-top:10px;">' +
											'<span id="ns1blankspaceSummaryComplete" class="ns1blankspaceAction" style="font-size:0.875em; width:120px;">Complete</span>' +
											'</td></tr>');
							}	

							aHTML.push('<tr><td id="ns1blankspaceSummaryLastReconciliation" class="ns1blankspaceSub" style="padding-top:15px;"></td></tr>');

							aHTML.push('<tr><td id="ns1blankspaceSummaryLastPayroll" class="ns1blankspaceSub" style="padding-top:15px;"></td></tr>');

							aHTML.push('</table>');					

							$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));

							$('#ns1blankspaceSummaryCalculate').button({})
							.click(function()
							{
								ns1blankspace.financial.tax.save.send()
							});

							$('#ns1blankspaceSummaryComplete').button({})
							.click(function()
							{
								ns1blankspace.financial.tax.complete.send()
							});	

							if (ns1blankspace.objectContextData['status'] == 1)
							{	
								ns1blankspace.financial.tax.summary({step: 2});
								
								if (!oDate.isSame(moment(), 'day'))
								{
									ns1blankspace.financial.tax.save.send();
								}
							}	
						}

						if (iStep == 2)
						{
							var oReconciliations = $.grep(ns1blankspace.financial.data.bankaccounts, function (a)
							{ 
								return (a.status == 1)
							});

							oReconciliations.sort(ns1blankspace.util.sortBy('lastreconcileddate'));

							if (oReconciliations.length > 0)
							{
								if (oReconciliations[0].lastreconcileddate == '')
								{
									$('#ns1blankspaceSummaryLastReconciliation').html('At least one bank account has not been reconciled!');
								}	
								else
								{
									$('#ns1blankspaceSummaryLastReconciliation').html('Bank accounts reconciled up to ' + oReconciliations[0].lastreconcileddate + '.');
								}
							}	
						}
					}	
				},

	details:	function (oParam)
				{	
					if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDetails').attr('data-loading', '');
							
						var aHTML = [];
								
						aHTML.push('<table class="ns1blankspaceContainer">');
						aHTML.push('<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainDetails').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
						
						if (ns1blankspace.objectContext == -1)
						{
							aHTML.push('<table>');

							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'End Date (optional)' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceEndDate">' +
											'<input id="ns1blankspaceDetailsEndDate" class="ns1blankspaceDate">' +
											'</td></tr>');

							aHTML.push('<tr><td class="ns1blankspaceNothing">It is recommended that you leave the End Date blank, as then the details for the next tax reporting will be set up automatically.' +
								'<br /><br /><span id="ns1blankspaceFinancialTaxNewContinue" class="ns1blankspaceAction">Continue</span></td></tr>')

							aHTML.push('</table>');
						}	
						else
						{	
							
							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'End Date' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceEndDate">' +
											'<input id="ns1blankspaceDetailsEndDate" class="ns1blankspaceDate">' +
											'</td></tr>');		

							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'Status' +
											'</td></tr>' +
											'<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceRadio">' +
											'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>In Progress' +
											'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Completed' +
											'</td></tr>');
						}	
																																	
						aHTML.push('</table>');					
					
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));

						if (ns1blankspace.objectContext != -1)
						{
							var aHTML = [];
						
							aHTML.push('<table class="ns1blankspaceColumn2">');
							
							if (ns1blankspace.objectContext != -1)
							{
								aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										ns1blankspace.option.taxVATCaption +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioIncludeVATY" name="radioIncludeVAT" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioIncludeVATN" name="radioIncludeVAT" value="N"/>No' +
										'</td></tr>');

								aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceSubNote">' +
										'Start Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsVATStartDate" class="ns1blankspaceDate" style="width:120px;">' +
										'</td></tr>');

								aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										ns1blankspace.option.taxPayrollCaption +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioIncludePayrollY" name="radioIncludePayroll" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioIncludePayrollN" name="radioIncludePayroll" value="N"/>No' +
										'</td></tr>');

								aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceSubNote">' +
										'Start Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsPayrollStartDate" class="ns1blankspaceDate" style="width:120px;">' +
										'</td></tr>');
							}	
																																		
							aHTML.push('</table>');					
						
							$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));
						}

						$('#ns1blankspaceFinancialTaxNewContinue').button({})
						.click(function()
						{
							ns1blankspace.financial.tax.save.send();
						});				
					
						$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsEndDate').val(ns1blankspace.objectContextData['enddate']);
							$('#ns1blankspaceDetailsVATStartDate').val(ns1blankspace.objectContextData['taxstartdate']);
							$('#ns1blankspaceDetailsPayrollStartDate').val(ns1blankspace.objectContextData['payrolltaxstartdate']);

							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData['status'] + '"]').attr('checked', true);
							$('[name="radioIncludeVAT"][value="' + ns1blankspace.objectContextData['includetax'] + '"]').attr('checked', true);
							$('[name="radioIncludePayroll"][value="' + ns1blankspace.objectContextData['includepayrolltax'] + '"]').attr('checked', true);
						}
					}
				},		

	vat: 		{
					layout:		function ()
								{
									var aHTML = [];

									if (ns1blankspace.objectContextData.includetax == 'N')
									{
										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr><td class="ns1blankspaceNothing">Not applicable.</td></tr>' +
														'</table>');

										$('#ns1blankspaceMainVAT').html(aHTML.join(''));
									}	
									else
									{
										aHTML.push('<table class="ns1blankspaceContainer">');

										aHTML.push('<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceTaxReportCategoryColumn" class="ns1blankspaceColumn1" style="width: 100px;padding-right:5px;font-size:0.875em;">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspaceTaxReportTypeColumn" class="ns1blankspaceColumn2" style="width: 175px;padding-right:5px;"></td>' +
														'<td id="ns1blankspaceTaxReportItemColumn" class="ns1blankspaceColumn2"></td>' +
														'</tr>');

										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainVAT').html(aHTML.join(''));
													
										var aHTML = [];
										
										aHTML.push('<div id="ns1blankspaceTaxCategoryColumn" style="width: 95px;margin-bottom:3px; font-size:0.75em;">');
										aHTML.push('<input style="width: 115px;" type="radio" id="ns1blankspaceTaxCategoryColumn-revenue" name="radioCategory" checked="checked" />' +
														'<label for="ns1blankspaceTaxCategoryColumn-revenue" style="width: 100px;">Sales (Collected)</label>');
										aHTML.push('<input style="width: 115px;" type="radio" id="ns1blankspaceTaxCategoryColumn-expense" name="radioCategory" />' +
														'<label for="ns1blankspaceTaxCategoryColumn-expense" style="width: 100px;">Purchases (Credits)</label>');
										aHTML.push('</div>');

										$('#ns1blankspaceTaxReportCategoryColumn').html(aHTML.join(''));			
											
										$('#ns1blankspaceTaxCategoryColumn').buttonset().css('font-size', '0.75em');
												
										$('#ns1blankspaceTaxCategoryColumn :radio').click(function()
										{
											var aID = (event.target.id).split('-');
											ns1blankspace.financial.tax.vat.show({category: aID[1]});	
										});

										ns1blankspace.financial.tax.vat.show();
									}	
								},

					show:		function (oParam)	
								{	
									var sCategory = "revenue";
									
									if (oParam != undefined)
									{
										if (oParam.category != undefined) {sCategory = oParam.category}
									}
									
									$('#ns1blankspaceTaxReportTypeColumn').html(ns1blankspace.xhtml.loadingSmall);
									
									var aHTML = [];
									var sField;
										
									aHTML.push('<table id="ns1blankspaceTaxReportType" class="ns1blankspace" style="border-left-style:solid; border-width:1px; border-color: #B8B8B8; padding-left:7px;">');
									
									$.each(ns1blankspace.financial.reportSummary[sCategory], function()
									{
										sField = (this.code).toUpperCase();
										
										aHTML.push('<tr><td colspan=2 id="ns1blankspaceReportType_title-' + sField + '" class="ns1blankspaceSub" style="font-size:0.75em;">' +
														this.title + '</td></tr>');

										aHTML.push('<tr class="ns1blankspaceRow">');
														
										if (this.total)
										{		
											aHTML.push('<td id="ns1blankspaceReportType_type-' + sField + '" class="ns1blankspaceRow" style="width:150px;">' +
														sField + '</td>');

											aHTML.push('<td id="ns1blankspaceReportType_amount-' + sField + '" class="ns1blankspaceRow" style="width:90px;text-align:right;">' +
														'' + (ns1blankspace.objectContextData['' + this.code]).parseCurrency().formatMoney(0, ".", ",") + '</td>');
										}
										else
										{
											aHTML.push('<td id="ns1blankspaceReportType_type-' + sField + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceType" style="width:150px;">' +
														sField + '</td>');

											aHTML.push('<td id="ns1blankspaceReportType_amount-' + sField + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceType" style="width:90px;text-align:right;">' +
														'' + (ns1blankspace.objectContextData['' + this.code]).parseCurrency().formatMoney(0, ".", ",") + '</td>');
										}	
																																											
										aHTML.push('</tr>');
									});

									aHTML.push('</table>');
									
									$('#ns1blankspaceTaxReportTypeColumn').html(aHTML.join(''));
									$('#ns1blankspaceTaxReportItemColumn').html('');
									
									$('.ns1blankspaceType').click(function()
									{
										var aID = (event.target.id).split('-');
										ns1blankspace.financial.tax.vat.items.show({field: aID[1]});
									});
								},

					items:	{
									show:		function (oParam, oResponse)
												{
													var iStep = 1;
													var iType = 1;
													var iSubType = 1;
													var sField = 'G1';
													
													if (oParam != undefined)
													{
														if (oParam.step != undefined) {iStep = oParam.step}
														if (oParam.type != undefined) {iType = oParam.type}
														if (oParam.subType != undefined) {iSubType = oParam.subType}
														if (oParam.field != undefined) {sField = oParam.field}
													}
													else
													{
														oParam = {};
													}
													
													if (iStep == 1)
													{
														$.extend(true, oParam, {step: 2});
														
														var aHTML = [];
														
														aHTML.push('<tr class="ns1blankspaceContainer">' +
																	'<td id="ns1blankspaceTaxReportItemSubTypeColumn" class="ns1blankspaceColumn1" style="width:120px; padding-right:5px; font-size:0.75em;">' +
																	ns1blankspace.xhtml.loading + '</td>' +
																	'<td id="ns1blankspaceTaxReportItemsColumn" class="ns1blankspaceColumn2" style="width: 285px;padding-right:5px; font-size:0.875em;"></td>' +
																	'</tr>');

														$('#ns1blankspaceTaxReportItemColumn').html(aHTML.join(''));
																
														var aHTML = [];

														aHTML.push('<div id="ns1blankspaceTaxSubTypeColumn" style="width: 115px;margin-bottom:3px;">');
													
														aHTML.push('<input style="width: 115px;" type="radio" id="interfaceMainTaxSubTypeColumn-1" name="radioSubType" checked="checked" />' +
																		'<label for="interfaceMainTaxSubTypeColumn-1" style="width: 115px;">Standard</label>');
													
														aHTML.push('<input style="width: 115px;"  type="radio" id="interfaceMainTaxSubTypeColumn-2" name="radioSubType" />' +
																		'<label for="interfaceMainTaxSubTypeColumn-2" style="width: 115px;">Credit Notes</label>');
													
														aHTML.push('<input style="width: 115px;"  type="radio" id="interfaceMainTaxSubTypeColumn-3" name="radioSubType" />' +
																		'<label for="interfaceMainTaxSubTypeColumn-3" style="width: 115px;">Journals (+ve)</label>');
													
														aHTML.push('<input style="width: 115px;"  type="radio" id="interfaceMainTaxSubTypeColumn-4" name="radioSubType" />' +
																		'<label for="interfaceMainTaxSubTypeColumn-4" style="width: 115px;">Journals (-ve)</label>');
														
														aHTML.push('</div>');

														$('#ns1blankspaceTaxReportItemSubTypeColumn').html(aHTML.join(''));			
														
														$('#ns1blankspaceTaxSubTypeColumn').buttonset().css('font-size', '0.875em');
															
														$('#ns1blankspaceTaxSubTypeColumn :radio').click(function()
														{
															var aID = (event.target.id).split('-');
															$.extend(true, oParam, {subType: aID[1], step: 2});
															ns1blankspace.financial.tax.vat.items.show(oParam);	
														});
														
														ns1blankspace.financial.tax.vat.items.show(oParam);
													}
													
													if (iStep == 2)
													{
														oParam.step = 3;
														
														var sData = 'id=' + ns1blankspace.objectContext +
																	'&type=' + iType +
																	'&subtype=' + iSubType +
																	'&field=' + sField +
																	'&rows=15';
														
														$('#ns1blankspaceTaxReportItemsColumn').html(ns1blankspace.xhtml.loading);

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_TAX_REPORT_ITEM_SEARCH'),
															data: sData,
															dataType: 'json',
															success: function(data) {
																ns1blankspace.financial.tax.vat.items.show(oParam, data)
															}
														});
													}
													
													if (iStep == 3)
													{
														var aHTML = [];

														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<table class="ns1blankspace">' +
																			'<tr><td class="ns1blankspaceNothing">No items.</td></tr>' + 
																			'</table>');
														}	
														else
														{	
															aHTML.push('<table id="ns1blankspaceReportItems" class="ns1blankspace">' +
																	'<tr class="ns1blankspaceCaption">' +
																	'<td class="ns1blankspaceHeaderCaption">Details</td>' +
																	'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>' +
																	'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">' + ns1blankspace.option.taxVATCaption + '</td>' +
																	'<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
																	'</tr>');

															$.each(oResponse.data.rows, function()
															{
																aHTML.push(ns1blankspace.financial.tax.vat.items.row(this));
															});
															
															aHTML.push('</table>');
														}	

														ns1blankspace.render.page.show(
														{
															type: 'JSON',
															xhtmlElementID: 'ns1blankspaceTaxReportItemsColumn',
															xhtmlContext: 'TaxItems',
															xhtml: aHTML.join(''),
															showMore: (oResponse.morerows == "true"),
															more: oResponse.moreid,
															rows: ns1blankspace.option.defaultRows,
															functionShowRow: ns1blankspace.financial.tax.vat.items.row,
															functionOpen: undefined,
															functionNewPage: 'ns1blankspace.financial.tax.vat.items.bind()',
														});
													}	
												},

									row: 		function (oRow)
												{
													var aHTML = [];

													aHTML.push('<tr class="ns1blankspaceRow">');
															
													if (oRow.transactiondate)
													{					
														aHTML.push('<td id="ns1blankspaceReportItems_details-' + oRow.parentid + '" class="ns1blankspaceRow">' +
																			oRow.transactiondate + '<br /><span class="ns1blankspaceSub">' + oRow.description + '</span></td>');
												
													}
													else if (oRow.reference)
													{					
														aHTML.push('<td id="ns1blankspaceReportItems_reference-' + oRow.id + '" class="ns1blankspaceRow">' +
																			oRow.reference + '</td>');
													}

													aHTML.push('<td style="text-align:right;" class="ns1blankspaceRow">' +
																			oRow.amount + '</td>');
													
													aHTML.push('<td style="text-align:right;" class="ns1blankspaceRow">' +
																			oRow.tax + '</td>');
																	
													aHTML.push('</tr>');

													return aHTML.join('')
												},

									bind: 		function ()
												{
													$('#ns1blankspaceReportItems .ns1blankspaceRowSelect11').click(function()
													{
														var aID = (this.id).split('-');
															
														ns1blankspace.financial.expense.init({showHome: false});
														ns1blankspace.financial.expense.search.send('-' + aID[1]);	
													});
												}					
								}				
				},

	payroll: 	
				{	
					layout:		function ()
								{
									var aHTML = [];

									if (ns1blankspace.objectContextData.includepayrolltax == 'N')
									{
										aHTML.push('<table class="ns1blankspaceContainer">');
										aHTML.push('<tr><td class="ns1blankspaceNothing">Not applicable.</td></tr>');
										aHTML.push('</table>');

										$('#ns1blankspaceMainPayroll').html(aHTML.join(''));
									}
									else
									{
										var aHTML = [];
										var sField;
											
										aHTML.push('<table id="ns1blankspaceTaxReportType" class="ns1blankspace" style="width: 200px;">');
										
										$.each(ns1blankspace.financial.reportSummary["payroll"], function()
										{
											sField = (this.code).toUpperCase();
											
											aHTML.push('<tr><td colspan=2 id="ns1blankspaceReportType_title-' + sField + '" class="ns1blankspaceSub" style="font-size:0.75em;">' +
															this.title + '</td></tr>');

											aHTML.push('<tr class="ns1blankspaceRow">');
															
											if (this.total)
											{		
												aHTML.push('<td id="ns1blankspaceReportType_type-' + sField + '" class="ns1blankspaceRow" style="width:150px;">' +
															sField + '</td>');

												aHTML.push('<td id="ns1blankspaceReportType_amount-' + sField + '" class="ns1blankspaceRow" style="width:90px;text-align:right;">' +
															'' + (ns1blankspace.objectContextData['' + this.code]).parseCurrency().formatMoney(0, ".", ",") + '</td>');
											}
											else
											{
												aHTML.push('<td id="ns1blankspaceReportType_type-' + sField + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceType" style="width:150px;">' +
															sField + '</td>');

												aHTML.push('<td id="ns1blankspaceReportType_amount-' + sField + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceType" style="width:90px;text-align:right;">' +
															'' + (ns1blankspace.objectContextData['' + this.code]).parseCurrency().formatMoney(0, ".", ",") + '</td>');
											}	
																																												
											aHTML.push('</tr>');
										});

										aHTML.push('</table>');

										$('#ns1blankspaceMainPayroll').html(aHTML.join(''));
									}				
								}
				},

	financials: 	
				{
					data: 		{},

					init: 		function (oParam)
								{
									$('#ns1blankspaceMainFinancials').html(ns1blankspace.xhtml.loading);
									
									ns1blankspace.util.whenDone.init(
									ns1blankspace.util.setParam(oParam, 'manifest',
									{
										success: 	'ns1blankspace.financial.tax.financials.populate',
										store: 		'ns1blankspace.financial.tax.financials.data',
										search:
										[
											{
												name: 'expenses',
												method: 'FINANCIAL_EXPENSE_SEARCH',
												criteria:
												{
													"fields":
													[
														{
															"name": "description"
														},
														{
															"name": "amount"
														}
													],
													"filters":
													[
														{
															"name": "object",
															"comparison": "EQUAL_TO",
															"value1": "46"
														},
														{
															"name": "objectcontext",
															"comparison": "EQUAL_TO",
															"value1": ns1blankspace.objectContext
														}
													]
												}
											},
											{
												name: 'invoices',
												method: 'FINANCIAL_INVOICE_SEARCH',
												criteria:
												{
													"fields":
													[
														{
															"name": "description"
														},
														{
															"name": "amount"
														}
													],
													"filters":
													[
														{
															"name": "object",
															"comparison": "EQUAL_TO",
															"value1": "46"
														},
														{
															"name": "objectcontext",
															"comparison": "EQUAL_TO",
															"value1": ns1blankspace.objectContext
														}
													]
												}
											}
										]
									}));
								},

					populate: 	function (oParam)
								{
									var aHTML = [];
							
									aHTML.push('<table id="ns1blankspaceFinancialTaxFinancials" class="ns1blankspace" style="font-size:1em;">');
								
									var oData = ns1blankspace.financial.tax.financials.data;

									if (oData.expenses.data.rows.length == 0 && oData.invoices.data.rows.length == 0)
									{
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceSub">No items</td></tr>');
										aHTML.push('</table>');
									}
									else
									{		
										$(oData.expenses.data.rows).each(function()
										{
											aHTML.push('<tr class="ns1blankspaceRow">');
												
											aHTML.push('<td id="ns1blankspaceFinancialTaxExpenseItem_description-' + this.id + '" class="ns1blankspaceRow">' +
																	this["description"]);

											aHTML.push('<div id="ns1blankspaceFinancialTaxExpenseItem_type-' + this.id + '" class="ns1blankspaceSub">' +
																	 'Expense</div></td>');

											aHTML.push('<td id="ns1blankspaceFinancialTaxExpenseItem_amount-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	this["amount"] + '</td>');

											aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
															'<span id="ns1blankspaceTax_view-' + this.id + '" class="ns1blankspaceRowViewExpense"></span></td>');						 					
																																		
											aHTML.push('</tr>');
										});

										$(oData.invoices.data.rows).each(function()
										{
											aHTML.push('<tr class="ns1blankspaceRow">');
												
											aHTML.push('<td id="ns1blankspaceFinancialTaxExpenseItem_description-' + this.id + '" class="ns1blankspaceRow">' +
																	this["description"]);

											aHTML.push('<div id="ns1blankspaceFinancialTaxExpenseItem_type-' + this.id + '" class="ns1blankspaceSub">' +
																	 'Invoice</div></td>');

											aHTML.push('<td id="ns1blankspaceFinancialTaxExpenseItem_amount-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	this["amount"] + '</td>');

											aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
															'<span id="ns1blankspaceTax_view-' + this.id + '" class="ns1blankspaceRowViewInvoice"></span></td>');						 					
																																		
											aHTML.push('</tr>');
										});	
									}
										
									aHTML.push('</table>');
								
									$('#ns1blankspaceMainFinancials').html(aHTML.join(''));

									$('#ns1blankspaceFinancialTaxFinancials .ns1blankspaceRowViewExpense')
									.button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-play"
										}
									})
									.click(function()
									{
										ns1blankspace.financial.expense.init({id: (this.id).split('-')[1]});
									})
									.css('width', '15px')
									.css('height', '20px');

									$('#ns1blankspaceFinancialTaxFinancials .ns1blankspaceRowViewInvoice')
									.button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-play"
										}
									})
									.click(function()
									{
										ns1blankspace.financial.invoice.init({id: (this.id).split('-')[1]});
									})
									.css('width', '15px')
									.css('height', '20px');
								}
				},		
		
	save: 	{
					send: 	function ()
								{
									var sData = 'id=';
									
									if (ns1blankspace.objectContext != -1)
									{
										sData += ns1blankspace.objectContext;
									} 
									
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										if (ns1blankspace.util.fs($('#ns1blankspaceDetailsEndDate').val()) != '')
										{	
											sData += '&enddate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEndDate').val());
										}
											
										if (ns1blankspace.objectContext != -1)
										{	
											sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
											sData += '&includetax=' + ns1blankspace.util.fs($('input[name="radioIncludeVAT"]:checked').val());
											sData += '&includepayrolltax=' + ns1blankspace.util.fs($('input[name="radioIncludePayroll"]:checked').val());

											if (ns1blankspace.util.fs($('#ns1blankspaceDetailsVATStartDate').val()) != '')
											{	
												sData += '&taxstartdate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsVATStartDate').val());
											}

											if (ns1blankspace.util.fs($('#ns1blankspaceDetailsPayrollStartDate').val()) != '')
											{	
												sData += '&payrolltaxstartdate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPayrollStartDate').val());
											}
										}
									}
										
									ns1blankspace.status.working('Updating...');
										
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_TAX_REPORT_MANAGE'),
										data: sData,
										dataType: 'json',
										success: this.process
									});
								},

					process: 	function (oResponse)
								{	
									if (oResponse.status == 'OK')
									{
										ns1blankspace.inputDetected = false;
										ns1blankspace.status.message('Saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
										
										ns1blankspace.financial.tax.search.send('-' + ns1blankspace.objectContext);
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}
				},

	complete: 	{
					send: 		function ()
								{
									var oData = {id: ns1blankspace.objectContext}
													
									ns1blankspace.status.working('Completing...');
										
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_TAX_REPORT_COMPLETE'),
										data: oData,
										dataType: 'json',
										success: ns1blankspace.financial.tax.complete.process
									});
								},

					process: 	function (oResponse)
								{	
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Completed');
										ns1blankspace.financial.tax.search.send('-' + ns1blankspace.objectContext);
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}
				}
}				