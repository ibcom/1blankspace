/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.contactBusiness = 
{
	init: 		function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 12;
					ns1blankspace.objectName = 'contactBusiness';
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectMethod = 'CONTACT_BUSINESS'
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Businesses';
					
					var bShowHome = true;
					var bNew = false;
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
						if (oParam.showNew != undefined) {bNew = oParam.showNew}
						if (bNew) {ns1blankspace.contactBusiness["new"]()};
					}	

					ns1blankspace.app.set(oParam);
				},

	home: 		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
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

						aHTML.push('<tr><td><div id="ns1blankspaceViewContactLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
								
						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlFavourites" class="ns1blankspaceControl">Favourites</td>' +
										'</tr>');			
									
						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlByGroup" class="ns1blankspaceControl">Groups</td>' +
										'</tr>');	
													
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
													
						$('#ns1blankspaceControlFavourites').click(function(event)
						{
							ns1blankspace.show({refresh: true});
							ns1blankspace.contactBusiness.favourites.show({xhtmlElementID: "ns1blankspaceMain"});
						});

						$('#ns1blankspaceControlByGroup').click(function(event)
						{
							ns1blankspace.show({refresh: true});
							ns1blankspace.contactBusiness.groups.search.show();
						});
						
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CONTACT_BUSINESS_SEARCH';		
						oSearch.addField('tradename,legalname');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(function(data) {ns1blankspace.contactBusiness.home(oParam, data)});	
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">' +
											'Click New to create a business.</td></tr></table>');
						}
						else
						{
							aHTML.push('<table>');
							aHTML.push('<tr>');
							aHTML.push('<td class="ns1blankspaceCaption">RECENT</td>');
							aHTML.push('</tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
														'" class="ns1blankspaceMostLikely">' +
														this.tradename + 
														(this.tradename!=this.legalname && this.legalname !=''?' (' + this.legalname + ')':'') +
														'</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.contactBusiness.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function (sXHTMLElementId, oParam)
								{
									
									var aSearch = sXHTMLElementId.split('-');
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
									
									if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
									{							
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.endPoint = 'contact';
										oSearch.method = 'CONTACT_BUSINESS_SEARCH';
										oSearch.addField( 'reference,tradename,legalname,phonenumber,faxnumber,email,industry,industrytext,' +
															'createddate,abn,customerstatus,customerstatustext' + 
															',webaddress,area,areatext,' +
															'streetaddress1,streetaddress2,streetsuburb,streetpostcode,streetstate,streetcountry' + 
															',mailingaddress1,mailingaddress2,mailingsuburb,mailingpostcode,mailingstate,mailingcountry,' +
															'notes,primarycontactperson,modifieddate,' +
															'directdebitaccountname,directdebitaccountnumber,directdebitbank,directdebitbranchnumber');

										oSearch.addField(ns1blankspace.option.auditFields);
										
										oSearch.addField(ns1blankspace.extend.elements());
										
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										oSearch.rf = 'json';
										oSearch.getResults(function(data) {ns1blankspace.contactBusiness.show(oParam, data)}) 
										
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
											sElementId = 'ns1blankspaceViewBrowse';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.search.start();
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'CONTACT_BUSINESS_SEARCH';
											oSearch.addField('tradename,legalname');
											
											if (iSource == ns1blankspace.data.searchSource.browse)
											{
												oSearch.addFilter('quicksearch', 'TEXT_STARTS_WITH', sSearchText);
											}
											else
											{	
												oSearch.addFilter('quicksearch', 'TEXT_IS_LIKE', sSearchText);
											}	

											ns1blankspace.search.advanced.addFilters(oSearch);
											oSearch.rows = ns1blankspace.option.defaultRowsSmall;
											oSearch.sort('tradename', 'ASC');

											oSearch.getResults(function(data) {ns1blankspace.contactBusiness.search.process(oParam, data)});
										}
									}
								},

	
					process: 	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var	iMaximumColumns = 1;
									
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspace.search.stop();
										$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
									}
									else
									{	
										aHTML.push('<table class="ns1blankspaceSearchMedium" style="width:520px;">');
											
										$.each(oResponse.data.rows, function()
										{
											aHTML.push(ns1blankspace.contactBusiness.search.row(oParam, this));
										});
								    	
										aHTML.push('</table>');
										
										$(ns1blankspace.xhtml.searchContainer).html(
											ns1blankspace.render.init(
											{
												html: aHTML.join(''),
												more: (oResponse.morerows == "true"),
												header: false,
												width: 520
											}) 
										);		
										
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										ns1blankspace.search.stop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
											$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.contactBusiness.search.send(event.target.id, {source: 1});
										});
										
										ns1blankspace.render.bind(
										{
											columns: 'tradename-legalname',
											more: oResponse.moreid,
											width: 520,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.contactBusiness.search.send,
											functionRow: ns1blankspace.contactBusiness.search.row
										});   
										
									}	
								},

						row: 	function (oParam, oRow)
								{
									var aHTML = [];
									var sContact;
												
									aHTML.push('<tr class="ns1blankspaceSearch">');
								
									aHTML.push('<td class="ns1blankspaceSearch" id="' +
													'search-' + oRow.id + '">' +
													oRow.tradename +
													'</td>');

									aHTML.push('<td class="ns1blankspaceSearch ns1blankspaceSearchSub" id="' +
													'searchContact-' + oRow.id + '">' +
													oRow.legalname +
													'</td>');

									aHTML.push('</tr>');
									
									return aHTML.join('')
								}							
				},						

	layout:		function ()
				{
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">Details</td></tr>');
										
						aHTML.push('<tr><td id="ns1blankspaceControlAddress" class="ns1blankspaceControl">Address</td></tr>');				
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">Summary</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">Details</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlAddress" class="ns1blankspaceControl">Address</td></tr>');
					
						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');
						aHTML.push('<tr><td id="ns1blankspaceControlGroups" class="ns1blankspaceControl">Groups</td></tr>');
						aHTML.push('<tr><td id="ns1blankspaceControlPeople" class="ns1blankspaceControl">People</td></tr>');
						aHTML.push('</table>');

						aHTML.push('<table class="ns1blankspaceControl">');
						aHTML.push('<tr><td id="ns1blankspaceControlFinancial" class="ns1blankspaceControl">Financials</td></tr>');
						aHTML.push('</table>');		
					
						aHTML.push('<table class="ns1blankspaceControl">');
					
						aHTML.push('<tr><td id="ns1blankspaceControlActions" class="ns1blankspaceControl">Actions</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">Attachments</td></tr>');
					}
							
					aHTML.push('</table>');					
						
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAddress" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainGroups" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPeople" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainFinancials" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.contactBusiness.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.contactBusiness.details();
					});
					
					
					$('#ns1blankspaceControlAddress').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAddress'});
						ns1blankspace.contactBusiness.address();
					});
					
					$('#ns1blankspaceControlGroups').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainGroups', refresh: true});
						ns1blankspace.contactBusiness.groups.show();
					});

					$('#ns1blankspaceControlPeople').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPeople', refresh: true});
						ns1blankspace.contactBusiness.people.show();
					});

					$('#ns1blankspaceControlFinancial').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainFinancials'});
						ns1blankspace.contactBusiness.financials.show();
					});
					
					$('#ns1blankspaceControlActions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainActions', refresh: true});
						
						if ($('#ns1blankspaceDetailsTradename').val() != undefined)
						{
							ns1blankspace.contactBusinessText = $('#ns1blankspaceDetailsTradename').val();
						}
						
						ns1blankspace.actions.show({
											xhtmlElementID: 'ns1blankspaceMainActions',
											contactBusiness: ns1blankspace.objectContext, 
											contactBusinessText: ns1blankspace.contactBusinessText,
											object: '',
											objectContext: ''
											});
					});
					
					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
						ns1blankspace.attachments.show();
					});

					ns1blankspace.extend.layout();
				},

	show: 		function (oParam, oResponse)
				{
					ns1blankspace.app.clean();

					ns1blankspace.contactBusiness.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find contact business.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						ns1blankspace.data.contactBusiness = ns1blankspace.objectContextData.contactbusiness;
						ns1blankspace.data.contactBusinessText = ns1blankspace.objectContextData.contactbusinesstext;
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.tradename);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.contactBusiness.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.contactBusiness.summary()'})
					}	
				},		
		
	summary: 	function (oParam, oResponse)
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this business.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						if (oResponse == undefined)
						{
							aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceRow">' +
										'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
										'<td id="ns1blankspaceSummaryColumn2" style="width:300px;"></td>' +
										'</tr>' +
										'</table>');				
							
							$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
						
							var aHTML = [];
						
							aHTML.push('<table class="ns1blankspace">');
							
							if (ns1blankspace.objectContextData.phonenumber != '')
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Phone</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryPhone" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.phonenumber +
											'</td></tr>');
							}

							if (ns1blankspace.objectContextData.streetsuburb != '')
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Location</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryLocation" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.streetsuburb + ' ' + ns1blankspace.objectContextData.streetstate +
											'</td></tr>');
							}				
											
							if (ns1blankspace.objectContextData.customerstatus != '')
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Status</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryStatus" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.customerstatustext +
											'</td></tr>');
							}				
								
							if (ns1blankspace.objectContextData.notes != '')
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Notes</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryNotes" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.notes +
											'</td></tr>');
							}				
									
							if (ns1blankspace.objectContextData.modifieddate != '') {
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Last Updated</td></tr>' +
												'<tr><td id="ns1blankspaceSummaryLastUpdated" class="ns1blankspaceSummary">' +
												Date.parse(ns1blankspace.objectContextData.modifieddate).toString("dd MMM yyyy") +
												'</td></tr>');
							}
														
							aHTML.push('</table>');					
							
							$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

							var aHTML = [];
					
							aHTML.push('<table class="ns1blankspaceColumn2">');

							aHTML.push('<tr><td id="ns1blankspaceFavourite" class="ns1blankspaceSummaryCaption" style="padding-bottom:15px;">' +
										ns1blankspace.xhtml.loadingSmall + 
										'</td></tr>');	

							if (ns1blankspace.objectContextData.webaddress != '')
							{	
								if ((ns1blankspace.objectContextData.webaddress).indexOf('http') == -1)
								{
									ns1blankspace.objectContextData.webaddressURI = 'http://' + ns1blankspace.objectContextData.webaddress;
								}

								aHTML.push('<tr><td class="ns1blankspaceSummary" style="padding-bottom:10px;">' +
											'<a href="' + ns1blankspace.objectContextData.webaddressURI + '" target="_blank">' + 
											ns1blankspace.objectContextData.webaddress + '</a>' +
											'</td></tr>');	
							}

							aHTML.push('</table>');					
							
							$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));	

							var oData = 
							{
								object: ns1blankspace.object,
								objectContext: ns1blankspace.objectContext
							}	
							
							var oSearch = new AdvancedSearch();
							oSearch.method = 'CORE_FAVOURITE_SEARCH';		
							oSearch.addField('id');
							oSearch.getResults(function(data) {ns1blankspace.contactBusiness.summary(oParam, data)});	
						}
						else
						{
							var bFavourite = false;
							var iFavouriteID;
							var oButton =
							{
								text: true,
								label: 'Mark as<br />favourite',
							}

							if (oResponse.data.rows.length != 0)
							{
								oButton =
								{
									text: true,
									label: 'Favourite',
									icons:
									{
									primary: "ui-icon-star"
									}
								}

								sFavourite = 'Remove';
								bFavourite = true;
								iFavouriteID = oResponse.data.rows[0].id;
							}

							$('#ns1blankspaceFavourite').html('<input type="checkbox" ' + (bFavourite?'checked="checked" ':'') + 'id="ns1blankspaceContactBusinessFavourite"/>' +
									'<label for="ns1blankspaceContactBusinessFavourite" style="font-size:0.75em; width:100px;">&nbsp;</label>');

							$('#ns1blankspaceContactBusinessFavourite').button(oButton)
							.click(function()
							{
								var oData = 
								{
									object: ns1blankspace.object,
									objectContext: ns1blankspace.objectContext
								}	

								if (bFavourite)
								{
									ns1blankspace.status.message('No longer a favourite');
									oData.remove = 1;
									oData.id = iFavouriteID;
								}
								else
								{
									ns1blankspace.status.message('Is now a favourite');
								}

								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('CORE_FAVOURITE_MANAGE'),
									data: oData,
									dataType: 'json',
									success: function ()
									{
										ns1blankspace.contactBusiness.summary();
									}
								});							
							})
						}	
					}	
				},

	details: 	function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDetails').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">');
						aHTML.push('<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>');
						aHTML.push('</table>');					
						
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
										'Legal Name' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsLegalName" class="ns1blankspaceText">' +
										'</td></tr>');			
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Trading Name' +
										'</td></tr>' +
										'<tr class="ns1blankspaceSelect">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceDetailsTradeName" class="ns1blankspaceText">' +
										'</td></tr>');							
										
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Industry' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsIndustry" class="ns1blankspaceSelect"' +
											' data-method="SETUP_CONTACT_INDUSTRY_SEARCH">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'ABN' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsABN" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Phone' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPhone" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Fax' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsFax" class="ns1blankspaceText">' +
										'</td></tr>');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Email' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsEmail" class="ns1blankspaceText">' +
										'</td></tr>');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Web Address' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsWebAddress" class="ns1blankspaceText">' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsStatus" class="ns1blankspaceSelect"' + 
										  'data-method="SETUP_CONTACT_STATUS_SEARCH">' +
										'</td></tr>');
							
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						var aHTML = [];
							
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description / Notes' +
										'</td></tr>' +
										'<tr class="ns1blankspaceTextMulti">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="10" cols="35" id="ns1blankspaceDetailsDescription" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');
						
						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference.formatXHTML());
							$('#ns1blankspaceDetailsTradeName').val(ns1blankspace.objectContextData.tradename.formatXHTML());
							$('#ns1blankspaceDetailsLegalName').val(ns1blankspace.objectContextData.legalname.formatXHTML());
							$('#ns1blankspaceDetailsIndustry').val(ns1blankspace.objectContextData.industrytext.formatXHTML());
							$('#ns1blankspaceDetailsIndustry').attr('data-id', ns1blankspace.objectContextData.industry.formatXHTML());
							$('#ns1blankspaceDetailsABN').val(ns1blankspace.objectContextData.abn.formatXHTML());
							$('#ns1blankspaceDetailsPhone').val(ns1blankspace.objectContextData.phonenumber.formatXHTML());
							$('#ns1blankspaceDetailsWebAddress').val(ns1blankspace.objectContextData.webaddress.formatXHTML());
							$('#ns1blankspaceDetailsFax').val(ns1blankspace.objectContextData.faxnumber.formatXHTML());
							$('#ns1blankspaceDetailsEmail').val(ns1blankspace.objectContextData.email.formatXHTML());
							$('#ns1blankspaceDetailsStatus').val(ns1blankspace.objectContextData.customerstatustext.formatXHTML());
							$('#ns1blankspaceDetailsStatus').attr('data-id', ns1blankspace.objectContextData.customerstatus.formatXHTML());
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.notes.formatXHTML());
						}
						
						$('#ns1blankspaceDetailsTitle').keyup(function(event)
						{
							$(ns1blankspace.xhtml.container).hide(200);
							ns1blankspace.search.send(event.target.id);
						});
					}	
				},

	address: 	function (oParam)
				{
					var aHTML = [];
					var bTwoLineAddress = true;

					if (oParam)
					{
						if (oParam.twoLineAddress != undefined) {bTwoLineAddress = oParam.twoLineAddress}
					}
			
					if ($('#ns1blankspaceMainAddress').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainAddress').attr('data-loading', '');
							
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceAddressColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceAddressColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' +
										'</table>');					
						
						$('#ns1blankspaceMainAddress').html(aHTML.join(''));
						
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspace">');
								
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Street' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressStreetAddress1" class="ns1blankspaceText">' +
										'</td></tr>');
										
						if (bTwoLineAddress)
						{
							aHTML.push('<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceText">' +
											'<input id="ns1blankspaceAddressStreetAddress2" class="ns1blankspaceText">' +
											'</td></tr>');
						}

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Suburb' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressStreetSuburb" class="ns1blankspaceText ns1blankspaceSelectAddress">' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'State' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressStreetState" class="ns1blankspaceText">' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Post Code' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressStreetPostCode" class="ns1blankspaceText">' +
										'</td></tr>');				
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Country' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressStreetCountry" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr><td>&nbsp;</td></tr>' +
										'<tr><td id="ns1blankspaceAddressCopy" style="font-size:0.825em;">' +
										'</td></tr>');									
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceAddressColumn1').html(aHTML.join(''));

						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspace">');
								
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Mailing' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressMailingAddress1" class="ns1blankspaceText">' +
										'</td></tr>');
										
						if (bTwoLineAddress)
						{
							aHTML.push('<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceText">' +
											'<input id="ns1blankspaceAddressMailingAddress2" class="ns1blankspaceText">' +
											'</td></tr>');
						}

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Suburb' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressMailingSuburb" class="ns1blankspaceText ns1blankspaceSelectAddress">' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'State' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressMailingState" class="ns1blankspaceText">' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Post Code' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressMailingPostCode" class="ns1blankspaceText">' +
										'</td></tr>');				
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Country' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressMailingCountry" class="ns1blankspaceText">' +
										'</td></tr>');						
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceAddressColumn2').html(aHTML.join(''));
						
						$('#ns1blankspaceAddressCopy').button({
							label: 'Copy to Mailing Address'
						})
						.click(function() {

							$('#ns1blankspaceAddressMailingAddress1').val($('#ns1blankspaceAddressStreetAddress1').val());
							$('#ns1blankspaceAddressMailingAddress2').val($('#ns1blankspaceAddressStreetAddress2').val());
							$('#ns1blankspaceAddressMailingSuburb').val($('#ns1blankspaceAddressStreetSuburb').val());
							$('#ns1blankspaceAddressMailingState').val($('#ns1blankspaceAddressStreetState').val());
							$('#ns1blankspaceAddressMailingPostCode').val($('#ns1blankspaceAddressStreetPostCode').val());
							$('#ns1blankspaceAddressMailingCountry').val($('#ns1blankspaceAddressStreetCountry').val());
						});

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceAddressStreetAddress1').val(ns1blankspace.objectContextData.streetaddress1);
							$('#ns1blankspaceAddressStreetSuburb').val(ns1blankspace.objectContextData.streetsuburb);
							$('#ns1blankspaceAddressStreetState').val(ns1blankspace.objectContextData.streetstate);
							$('#ns1blankspaceAddressStreetPostCode').val(ns1blankspace.objectContextData.streetpostcode);
							$('#ns1blankspaceAddressStreetCountry').val(ns1blankspace.objectContextData.streetcountry);
							$('#ns1blankspaceAddressMailingAddress1').val(ns1blankspace.objectContextData.mailingaddress1);
							$('#ns1blankspaceAddressMailingSuburb').val(ns1blankspace.objectContextData.mailingsuburb);
							$('#ns1blankspaceAddressMailingState').val(ns1blankspace.objectContextData.mailingstate);
							$('#ns1blankspaceAddressMailingPostCode').val(ns1blankspace.objectContextData.mailingpostcode);
							$('#ns1blankspaceAddressMailingCountry').val(ns1blankspace.objectContextData.mailingcountry);

							if (bTwoLineAddress) {
								$('#ns1blankspaceAddressStreetAddress2').val(ns1blankspace.objectContextData.streetaddress2);
								$('#ns1blankspaceAddressMailingAddress2').val(ns1blankspace.objectContextData.mailingaddress2);
							}
						}
					}	
				},

	financials: 
				{
					show: 	function ()
								{
									var aHTML = [];
									
									if ($('#ns1blankspaceMainFinancials').attr('data-loading') == '1')
									{
										$('#ns1blankspaceMainFinancials').attr('data-loading', '');
										
										aHTML.push('<table class="ns1blankspaceContainer">');
										aHTML.push('<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceFinancialsColumn1" class="ns1blankspaceColumn1" style="width:100px;padding-right:10px; border-right-style:solid; border-width:1px; border-color:#B8B8B8;"></td>' +
														'<td id="ns1blankspaceFinancialsColumn2" class="ns1blankspaceColumn2" style="padding-left:10px;"></td>' +
														'</tr>');
										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainFinancials').html(aHTML.join(''));
									
										var aHTML = [];

										aHTML.push('<table id="ns1blankspaceMainFinancialsOptions" cellpadding=6>');

										aHTML.push('<tr><td id="ns1blankspaceMainFinancials-summary" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																'Summary</td></tr>');

										aHTML.push('<tr><td id="ns1blankspaceMainFinancials-details" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																'Details</td></tr>');

										aHTML.push('<tr><td id="ns1blankspaceMainFinancials-invoices" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																'Invoices</td></tr>');

										aHTML.push('<tr><td id="ns1blankspaceMainFinancials-expenses" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																'Expenses</td></tr>');

										aHTML.push('<tr><td id="ns1blankspaceMainFinancials-receipts" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																'Receipts</td></tr>');

										aHTML.push('<tr><td id="ns1blankspaceMainFinancials-payments" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																'Payments</td></tr>');

										aHTML.push('<tr><td id="ns1blankspaceMainFinancials-credits" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																'Credits</td></tr>');

										aHTML.push('</table>');

										$('#ns1blankspaceFinancialsColumn1').html(aHTML.join(''));

										$('#ns1blankspaceMainFinancialsOptions td.ns1blankspaceRowSelect').click(function()
										{
											$('#ns1blankspaceMainFinancialsOptions td.ns1blankspaceRowShadedHighlight').removeClass('ns1blankspaceRowShadedHighlight');
											$('#' + this.id).addClass('ns1blankspaceRowShadedHighlight');

											var sContext = (this.id).split('-')[1];
											ns1blankspace.contactBusiness.financials[sContext].show();
										});

										$('#ns1blankspaceMainFinancials-summary').addClass('ns1blankspaceRowShadedHighlight');
										ns1blankspace.contactBusiness.financials.summary.show();
									}
								},

						summary:
								{
									show: 	function (oParam, oResponse)
												{
													var aHTML = [];

													aHTML.push('<table class="ns1blankspace">' +
																		'<tr><td id="ns1blankspaceFinancialsSummaryDebtors">' +
																		ns1blankspace.xhtml.loadingSmall +
																		'</td></tr>' +
																		'<tr><td id="ns1blankspaceFinancialsSummaryCreditors" style="padding-top:26px;">' +
																		ns1blankspace.xhtml.loadingSmall +
																		'</td></tr>' +
																		'</table>');
													
													$('#ns1blankspaceFinancialsColumn2').html(aHTML.join(''));

													ns1blankspace.contactBusiness.financials.summary.debtors(oParam);
												},

									debtors: function (oParam, oResponse)
												{
													if (oResponse == undefined)
													{
														var oData = {reportby: 4, rows: 1, view: 1, contactbusiness: ns1blankspace.objectContext}

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_DEBTOR_SEARCH'),
															dataType: 'json',
															data: oData,
															global: false,
															success: function(oResponse)
															{
																if (oResponse.status == 'OK')
																{	
																	ns1blankspace.contactBusiness.financials.summary.debtors(oParam, oResponse);
																}
																else
																{
																	if (oResponse.error.errorcode == '4')
																	{	
																		if (oResponse.error.errornotes.indexOf('FINANCIAL_DEBTORSCREDITORS_PROCESSING_MANAGE') != -1)
																		{	
																			ns1blankspace.status.working('Optimising debtors');
																			oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.contactBusiness.financials.summary.debtors)
																			ns1blankspace.financial.optimise.start(oParam);
																		}
																	}
																}	
															}
														});			
													}
													else
													{
														ns1blankspace.contactBusiness.financials.summary.creditors(oParam);

														var oRow;
														var cAmount = 0;
														var aHTML = [];

														if (oResponse.data.rows.length != 0)
														{
															oRow = oResponse.data.rows[0];
															cAmount = oResponse.data.rows[0].total
														
															aHTML.push('<table class="ns1blankspace">' +
																		'<tr>' +
																		'<td class="ns1blankspaceHeaderCaption" style="text-align:left;">' +
																		'<span style="font-weight:600;">Amount Owed To You</span><br /><span style="font-size:0.625em;">(As Debtor)</span></td>' +
																		'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">' +
																		_.first(_.split(oResponse.CurrentDescription, ',')) +
																		'<br /><span style="font-size:0.625em;">(0&nbsp;to&nbsp;30)</span></td>' +
																		'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">' +
																		_.first(_.split(oResponse['31-60Description'], ',')) +
																		'<br /><span style="font-size:0.625em;">(31&nbsp;to&nbsp;60)</span></td>' +
																		'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">' +
																		_.first(_.split(oResponse['61-90Description'], ',')) +
																		'<br /><span style="font-size:0.625em;">(61&nbsp;to&nbsp;90)</span></td>' +
																		'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">' +
																		(_.first(_.split(oResponse['91Description'], ','))).replace(' or ', '<br />or&nbsp;') +
																		'<br /><span style="font-size:0.625em;">(91&nbsp;+)</span></td>' +
																		'</tr><tr>' +
																		'<td id="ns1blankspaceDebtors_current-" class="ns1blankspaceRow" style="text-align:left;color:#A0A0A0; font-weight:600;">' +
																		cAmount + '</td>' +
																		'<td id="ns1blankspaceDebtors_current-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
																		oRow.current + '</td>' +
																		'<td id="ns1blankspaceDebtors_current-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
																		oRow['31-60'] + '</td>' +
																		'<td id="ns1blankspaceDebtors_current-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
																		oRow['61-90'] + '</td>' +
																		'<td id="ns1blankspaceDebtors_current-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
																		oRow['91'] + '</td></tr>' +
																		'</table>');
														}
														else
														{
															aHTML.push('<div class="ns1blankspaceNothing">Nothing owed to you.</div>');
														}

														$('#ns1blankspaceFinancialsSummaryDebtors').html(aHTML.join(''))					
													}
												},

									creditors: function (oParam, oResponse)
												{
													if (oResponse == undefined)
													{
														var oData = {reportby: 4, rows: 1, view: 1, contactbusiness: ns1blankspace.objectContext}

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_CREDITOR_SEARCH'),
															dataType: 'json',
															data: oData,
															global: false,
															success: function(oResponse)
															{
																if (oResponse.status == 'OK')
																{	
																	ns1blankspace.contactBusiness.financials.summary.creditors(oParam, oResponse);
																}
																else
																{
																	if (oResponse.error.errorcode == '4')
																	{	
																		if (oResponse.error.errornotes.indexOf('FINANCIAL_DEBTORSCREDITORS_PROCESSING_MANAGE') != -1)
																		{	
																			ns1blankspace.status.working('Optimising creditors');
																			oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.contactBusiness.financials.summary.creditors)
																			ns1blankspace.financial.optimise.start(oParam);
																		}
																	}
																}	
															}
														});			
													}
													else
													{
														var oRow;
														var cAmount = 0;
														var aHTML = [];

														if (oResponse.data.rows.length != 0)
														{
															oRow = oResponse.data.rows[0];
															cAmount = oResponse.data.rows[0].total
														
															aHTML.push('<table class="ns1blankspace">' +
																		'<tr>' +
																		'<td class="ns1blankspaceHeaderCaption" style="text-align:left;">' +
																		'<span style="font-weight:600;">Amount You Owe Them</span><br /><span style="font-size:0.625em;">(As Creditor)</span></td>' +
																		'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">' +
																		_.first(_.split(oResponse.CurrentDescription, ',')) +
																		'<br /><span style="font-size:0.625em;">(0&nbsp;to&nbsp;30)</span></td>' +
																		'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">' +
																		_.first(_.split(oResponse['31-60Description'], ',')) +
																		'<br /><span style="font-size:0.625em;">(31&nbsp;to&nbsp;60)</span></td>' +
																		'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">' +
																		_.first(_.split(oResponse['61-90Description'], ',')) +
																		'<br /><span style="font-size:0.625em;">(61&nbsp;to&nbsp;90)</span></td>' +
																		'<td class="ns1blankspaceHeaderCaption" style="text-align:right;color:#A0A0A0;">' +
																		(_.first(_.split(oResponse['91Description'], ','))).replace(' or ', '<br />or&nbsp;') +
																		'<br /><span style="font-size:0.625em;">(91&nbsp;+)</span></td>' +
																		'</tr><tr>' +
																		'<td id="ns1blankspaceCreditors_current-" class="ns1blankspaceRow" style="text-align:left;color:#A0A0A0; font-weight:600;">' +
																		cAmount + '</td>' +
																		'<td id="ns1blankspaceCreditors_current-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
																		oRow.current + '</td>' +
																		'<td id="ns1blankspaceCreditors_current-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
																		oRow['31-60'] + '</td>' +
																		'<td id="ns1blankspaceCreditors_current-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
																		oRow['61-90'] + '</td>' +
																		'<td id="ns1blankspaceCreditors_current-" class="ns1blankspaceRow" style="text-align:right;color:#A0A0A0;">' +
																		oRow['91'] + '</td></tr>' +
																		'</table>');
														}
														else
														{
															aHTML.push('<div class="ns1blankspaceNothing">You owe them nothing.</div>');
														}

														$('#ns1blankspaceFinancialsSummaryCreditors').html(aHTML.join(''))					
													}
												}			
								},

						details: 
								{
									show:	function ()
											{	
												var aHTML = [];
												
												aHTML.push('<table class="ns1blankspace" style="width:350px;">');
												
												aHTML.push('<tr class="ns1blankspaceCaption">' +
																'<td class="ns1blankspaceCaption">' +
																'Account Name' +
																'</td></tr>' +
																'<tr class="ns1blankspace">' +
																'<td class="ns1blankspaceText">' +
																'<input id="ns1blankspaceFinancialsAccountName" class="ns1blankspaceText">' +
																'</td></tr>');

												aHTML.push('<tr class="ns1blankspaceCaption">' +
																'<td class="ns1blankspaceCaption">' +
																'BSB' +
																'</td></tr>' +
																'<tr class="ns1blankspace">' +
																'<td class="ns1blankspaceText">' +
																'<input id="ns1blankspaceFinancialsBSB" class="ns1blankspaceText">' +
																'</td></tr>');	

												aHTML.push('<tr class="ns1blankspaceCaption">' +
																'<td class="ns1blankspaceCaption">' +
																'Account Number' +
																'</td></tr>' +
																'<tr class="ns1blankspace">' +
																'<td class="ns1blankspaceText">' +
																'<input id="ns1blankspaceFinancialsAccountNumber" class="ns1blankspaceText">' +
																'</td></tr>');											

												aHTML.push('</table>');					
												
												$('#ns1blankspaceFinancialsColumn2').html(aHTML.join(''));
												
												if (ns1blankspace.objectContextData != undefined)
												{
													$('#ns1blankspaceFinancialsBSB').val(ns1blankspace.objectContextData.directdebitbranchnumber);
													$('#ns1blankspaceFinancialsAccountNumber').val(ns1blankspace.objectContextData.directdebitaccountnumber);
													$('#ns1blankspaceFinancialsAccountName').val(ns1blankspace.objectContextData.directdebitaccountname);
												}
											}	
								},

						invoices:
								{
									show: 	function (oParam, oResponse)
												{
													if (oResponse == undefined)
													{
														var oSearch = new AdvancedSearch();
														oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
														oSearch.addField('reference,description,duedate,outstandingamount,amount,sentdate');
														oSearch.addFilter('contactbusinesssentto', 'EQUAL_TO', ns1blankspace.objectContext);
														oSearch.rows = 25;
														oSearch.sort('id', 'desc');
														oSearch.getResults(function (data) {ns1blankspace.contactBusiness.financials.invoices.show(oParam, data)});
													}
													else
													{
														var aHTML = [];

														aHTML.push('<table id="ns1blankspaceFinancialsInvoices" class="ns1blankspace">');

														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<tr><td class="ns1blankspaceNothing">No invoices.</td></tr></table>');
															$('#ns1blankspaceFinancialsColumn2').html(aHTML.join(''));
														}
														else
														{
															aHTML.push('<tr class="ns1blankspaceCaption">');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Outstanding Amount</td>');
															aHTML.push('</tr>');

															$.each(oResponse.data.rows, function()
															{
																aHTML.push(ns1blankspace.contactBusiness.financials.invoices.row(this, oParam));
															});
															
															aHTML.push('</table>');

															ns1blankspace.render.page.show(
															{
																type: 'JSON',
																xhtmlElementID: 'ns1blankspaceFinancialsColumn2',
																xhtmlContext: 'FinancialsInvoices',
																xhtml: aHTML.join(''),
																showMore: (oResponse.morerows == "true"),
																more: oResponse.moreid,
																rows: 25,
																functionShowRow: ns1blankspace.contactBusiness.financials.invoices.row,
																functionOpen: undefined,
																functionOnNewPage: ns1blankspace.contactBusiness.financials.invoices.bind
															});									
														}

													}
												},

									row: 		function (oRow, oParam)	
												{
													var aHTML = [];

													aHTML.push('<tr class="ns1blankspaceRow">');
																				
													aHTML.push('<td id="ns1blankspaceFinancialInvoices_reference-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																	oRow.reference + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialInvoices_description-' + oRow.id + '" class="ns1blankspaceRow">' +
																	oRow.description + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialInvoices_sentdate-' + oRow.id + '" class="ns1blankspaceRow">' +
																	ns1blankspace.util.fd(oRow.sentdate) + '</td>');
																			
													aHTML.push('<td id="ns1blankspaceFinancialInvoices_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	oRow.amount + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialInvoices_outstanding_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	oRow.outstandingamount + '</td>');

													aHTML.push('</tr>');

													return aHTML.join('');
												},

									bind: 	function (oRow, oParam)	
												{
													$('div.ns1blankspaceRenderPage td.ns1blankspaceRowSelect:visible').click(function()
													{
														ns1blankspace.financial.invoice.init({id: (this.id).split('-')[1]});
													});
												}			
								},

						expenses:
								{
									show: 	function (oParam, oResponse)
												{
													if (oResponse == undefined)
													{
														var oSearch = new AdvancedSearch();
														
														oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
														oSearch.addField('reference,description,outstandingamount,amount,accrueddate,payeereference');
														oSearch.addFilter('contactbusinesspaidto', 'EQUAL_TO', ns1blankspace.objectContext);
														oSearch.rows = 25;
														oSearch.sort('id', 'desc');
														oSearch.getResults(function (data) {ns1blankspace.contactBusiness.financials.expenses.show(oParam, data)});
													}
													else
													{
														var aHTML = [];

														aHTML.push('<table id="ns1blankspaceFinancialsExpenses" class="ns1blankspace">');

														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<tr><td class="ns1blankspaceNothing">No expenses.</td></tr></table>');
															$('#ns1blankspaceFinancialsColumn2').html(aHTML.join(''));
														}
														else
														{
															aHTML.push('<tr class="ns1blankspaceCaption">');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Supplier Reference</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Outstanding Amount</td>');
															aHTML.push('</tr>');

															$.each(oResponse.data.rows, function()
															{
																aHTML.push(ns1blankspace.contactBusiness.financials.expenses.row(this, oParam));
															});
															
															aHTML.push('</table>');

															ns1blankspace.render.page.show(
															{
																type: 'JSON',
																xhtmlElementID: 'ns1blankspaceFinancialsColumn2',
																xhtmlContext: 'FinancialsExpenses',
																xhtml: aHTML.join(''),
																showMore: (oResponse.morerows == "true"),
																more: oResponse.moreid,
																rows: 25,
																functionShowRow: ns1blankspace.contactBusiness.financials.expenses.row,
																functionOpen: undefined,
																functionOnNewPage: ns1blankspace.contactBusiness.financials.expenses.bind
															});									
														}

													}
												},

									row: 		function (oRow, oParam)	
												{
													var aHTML = [];

													aHTML.push('<tr class="ns1blankspaceRow">');
																				
													aHTML.push('<td id="ns1blankspaceFinancialExpenses_reference-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																	oRow.reference + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialExpensess_description-' + oRow.id + '" class="ns1blankspaceRow">' +
																	oRow.description + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialExpenses_paiddate-' + oRow.id + '" class="ns1blankspaceRow">' +
																	ns1blankspace.util.fd(oRow.accrueddate) + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialExpenses_payeereference-' + oRow.id + '" class="ns1blankspaceRow">' +
																	oRow.payeereference + '</td>');
																			
													aHTML.push('<td id="ns1blankspaceFinancialExpenses_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	oRow.amount + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialExpenses_outstanding_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	oRow.outstandingamount + '</td>');

													aHTML.push('</tr>');

													return aHTML.join('');
												},

									bind: 	function (oRow, oParam)	
												{
													$('div.ns1blankspaceRenderPage td.ns1blankspaceRowSelect:visible').click(function()
													{
														ns1blankspace.financial.expense.init({id: (this.id).split('-')[1]});
													});
												}			
								},

						receipts:
								{
									show: 	function (oParam, oResponse)
												{
													if (oResponse == undefined)
													{
														var oSearch = new AdvancedSearch();
														
														oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
														oSearch.addField('reference,notes,receiveddate,amount,reconciliation');
														oSearch.addFilter('contactbusinessreceivedfrom', 'EQUAL_TO', ns1blankspace.objectContext);
														oSearch.rows = 25;
														oSearch.sort('id', 'desc');
														oSearch.getResults(function (data) {ns1blankspace.contactBusiness.financials.receipts.show(oParam, data)});
													}
													else
													{
														var aHTML = [];

														aHTML.push('<table id="ns1blankspaceFinancialsReceipts" class="ns1blankspace">');

														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<tr><td class="ns1blankspaceNothing">No receipts.</td></tr></table>');
															$('#ns1blankspaceFinancialsColumn2').html(aHTML.join(''));
														}
														else
														{
															aHTML.push('<tr class="ns1blankspaceCaption">');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Date Received</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Status</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
															aHTML.push('</tr>');

															$.each(oResponse.data.rows, function()
															{
																aHTML.push(ns1blankspace.contactBusiness.financials.receipts.row(this, oParam));
															});
															
															aHTML.push('</table>');

															ns1blankspace.render.page.show(
															{
																type: 'JSON',
																xhtmlElementID: 'ns1blankspaceFinancialsColumn2',
																xhtmlContext: 'FinancialsReceipts',
																xhtml: aHTML.join(''),
																showMore: (oResponse.morerows == "true"),
																more: oResponse.moreid,
																rows: 25,
																functionShowRow: ns1blankspace.contactBusiness.financials.receipts.row,
																functionOpen: undefined,
																functionOnNewPage: ns1blankspace.contactBusiness.financials.receipts.bind
															});									
														}
													}
												},

									row: 		function (oRow, oParam)	
												{
													var aHTML = [];

													aHTML.push('<tr class="ns1blankspaceRow">');
																				
													aHTML.push('<td id="ns1blankspaceFinancialReceipts_reference-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																	oRow.reference + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialReceipts_description-' + oRow.id + '" class="ns1blankspaceRow">' +
																	oRow.notes + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialReceipts_receiveddate-' + oRow.id + '" class="ns1blankspaceRow">' +
																	ns1blankspace.util.fd(oRow.receiveddate) + '</td>');
																			
													aHTML.push('<td id="ns1blankspaceFinancialReceipts_receiveddate-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																	(oRow.reconciliation==''?'-':'Reconciled') + '</td>');						

													aHTML.push('<td id="ns1blankspaceFinancialReceipts_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	oRow.amount + '</td>');

													aHTML.push('</tr>');

													return aHTML.join('');
												},

									bind: 	function (oRow, oParam)	
												{
													$('div.ns1blankspaceRenderPage td.ns1blankspaceRowSelect:visible').click(function()
													{
														ns1blankspace.financial.receipt.init({id: (this.id).split('-')[1]});
													});
												}			
								},

						payments:
								{
									show: 	function (oParam, oResponse)
												{
													if (oResponse == undefined)
													{
														var oSearch = new AdvancedSearch();
														
														oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
														oSearch.addField('reference,notes,reconciliation,paiddate,amount');
														oSearch.addFilter('contactbusinesspaidto', 'EQUAL_TO', ns1blankspace.objectContext);
														oSearch.rows = 25;
														oSearch.sort('id', 'desc');
														oSearch.getResults(function (data) {ns1blankspace.contactBusiness.financials.payments.show(oParam, data)});
													}
													else
													{
														var aHTML = [];

														aHTML.push('<table id="ns1blankspaceFinancialsPayments" class="ns1blankspace">');

														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<tr><td class="ns1blankspaceNothing">No payments.</td></tr></table>');
															$('#ns1blankspaceFinancialsColumn2').html(aHTML.join(''));
														}
														else
														{
															aHTML.push('<tr class="ns1blankspaceCaption">');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Date Paid</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Status</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
															aHTML.push('</tr>');

															$.each(oResponse.data.rows, function()
															{
																aHTML.push(ns1blankspace.contactBusiness.financials.payments.row(this, oParam));
															});
															
															aHTML.push('</table>');

															ns1blankspace.render.page.show(
															{
																type: 'JSON',
																xhtmlElementID: 'ns1blankspaceFinancialsColumn2',
																xhtmlContext: 'FinancialsPayments',
																xhtml: aHTML.join(''),
																showMore: (oResponse.morerows == "true"),
																more: oResponse.moreid,
																rows: 25,
																functionShowRow: ns1blankspace.contactBusiness.financials.payments.row,
																functionOpen: undefined,
																functionOnNewPage: ns1blankspace.contactBusiness.financials.payments.bind
															});									
														}
													}
												},

									row: 		function (oRow, oParam)	
												{
													var aHTML = [];

													aHTML.push('<tr class="ns1blankspaceRow">');
																				
													aHTML.push('<td id="ns1blankspaceFinancialPayments_reference-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																	oRow.reference + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialPayments_description-' + oRow.id + '" class="ns1blankspaceRow">' +
																	oRow.notes + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialPayments_receiveddate-' + oRow.id + '" class="ns1blankspaceRow">' +
																	ns1blankspace.util.fd(oRow.paiddate) + '</td>');
																			
													aHTML.push('<td id="ns1blankspaceFinancialPayments_receiveddate-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																	(oRow.reconciliation==''?'-':'Reconciled') + '</td>');						

													aHTML.push('<td id="ns1blankspaceFinancialPayments_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	oRow.amount + '</td>');

													aHTML.push('</tr>');

													return aHTML.join('');
												},

									bind: 	function (oRow, oParam)	
												{
													$('div.ns1blankspaceRenderPage td.ns1blankspaceRowSelect:visible').click(function()
													{
														ns1blankspace.financial.payment.init({id: (this.id).split('-')[1]});
													});
												}			
								},

						credits:
								{
									show: 	function (oParam, oResponse)
												{
													if (oResponse == undefined)
													{
														var oSearch = new AdvancedSearch();
														
														oSearch.method = 'FINANCIAL_CREDIT_NOTE_SEARCH';
														oSearch.addField('reference,amount,notes,type,typetext,creditdate,financialaccounttext');
														oSearch.addFilter('contactbusiness', 'EQUAL_TO', ns1blankspace.objectContext);
														oSearch.rows = 25;
														oSearch.sort('id', 'desc');
														oSearch.getResults(function (data) {ns1blankspace.contactBusiness.financials.credits.show(oParam, data)});
													}
													else
													{
														var aHTML = [];

														aHTML.push('<table id="ns1blankspaceFinancialsCredits" class="ns1blankspace">');

														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<tr><td class="ns1blankspaceNothing">No credits.</td></tr></table>');
															$('#ns1blankspaceFinancialsColumn2').html(aHTML.join(''));
														}
														else
														{
															aHTML.push('<tr class="ns1blankspaceCaption">');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Type</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption">Financial Account</td>');
															aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
															aHTML.push('</tr>');

															$.each(oResponse.data.rows, function()
															{
																aHTML.push(ns1blankspace.contactBusiness.financials.credits.row(this, oParam));
															});
															
															aHTML.push('</table>');

															ns1blankspace.render.page.show(
															{
																type: 'JSON',
																xhtmlElementID: 'ns1blankspaceFinancialsColumn2',
																xhtmlContext: 'FinancialsCredits',
																xhtml: aHTML.join(''),
																showMore: (oResponse.morerows == "true"),
																more: oResponse.moreid,
																rows: 25,
																functionShowRow: ns1blankspace.contactBusiness.financials.credits.row,
																functionOpen: undefined,
																functionOnNewPage: ns1blankspace.contactBusiness.financials.credits.bind
															});									
														}
													}
												},

									row: 		function (oRow, oParam)	
												{
													var aHTML = [];

													aHTML.push('<tr class="ns1blankspaceRow">');
																				
													aHTML.push('<td id="ns1blankspaceFinancialPayments_reference-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																	oRow.reference + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialPayments_notes-' + oRow.id + '" class="ns1blankspaceRow">' +
																	oRow.notes + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialPayments_receiveddate-' + oRow.id + '" class="ns1blankspaceRow">' +
																	ns1blankspace.util.fd(oRow.creditdate) + '</td>');
																			
													aHTML.push('<td id="ns1blankspaceFinancialPayments_receiveddate-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																	oRow.typetext + '</td>');

													aHTML.push('<td id="ns1blankspaceFinancialPayments_financialaccounttext-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																	oRow.financialaccounttext + '</td>');				

													aHTML.push('<td id="ns1blankspaceFinancialPayments_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	oRow.amount + '</td>');

													aHTML.push('</tr>');

													return aHTML.join('');
												},

									bind: 	function (oRow, oParam)	
												{
													$('div.ns1blankspaceRenderPage td.ns1blankspaceRowSelect:visible').click(function()
													{
														ns1blankspace.financial.credit.init({id: (this.id).split('-')[1]});
													});
												}			
								}																													
				},			

	save: 		{
					send: 		function ()
								{
									ns1blankspace.status.working();

									var sData = 'id=';
									
									if (ns1blankspace.objectContext != -1)
									{
										sData += ns1blankspace.objectContext;
									} 
									
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsReference').val());
										sData += '&legalname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsLegalName').val());
										sData += '&tradename=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTradeName').val());
										sData += '&industry=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsIndustry').attr('data-id'));
										sData += '&abn=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsABN').val());
										sData += '&phonenumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPhone').val());
										sData += '&faxnumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFax').val());
										sData += '&email=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEmail').val());
										sData += '&webaddress=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsWebAddress').val());
										//sData += '&area=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsArea').val());
										sData += '&customerstatus=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsStatus').attr('data-id'));
										sData += '&notes=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDescription').val());
									}
									
									if ($('#ns1blankspaceMainAddress').html() != '')
									{
										sData += '&streetaddress1=' + ns1blankspace.util.fs($('#ns1blankspaceAddressStreetAddress1').val());
										sData += '&streetsuburb=' + ns1blankspace.util.fs($('#ns1blankspaceAddressStreetSuburb').val());
										sData += '&streetstate=' + ns1blankspace.util.fs($('#ns1blankspaceAddressStreetState').val());
										sData += '&streetpostcode=' + ns1blankspace.util.fs($('#ns1blankspaceAddressStreetPostCode').val());
										sData += '&streetcountry=' + ns1blankspace.util.fs($('#ns1blankspaceAddressStreetCountry').val());
										sData += '&mailingaddress1=' + ns1blankspace.util.fs($('#ns1blankspaceAddressMailingAddress1').val());
										sData += '&mailingsuburb=' + ns1blankspace.util.fs($('#ns1blankspaceAddressMailingSuburb').val());
										sData += '&mailingstate=' + ns1blankspace.util.fs($('#ns1blankspaceAddressMailingState').val());
										sData += '&mailingpostcode=' + ns1blankspace.util.fs($('#ns1blankspaceAddressMailingPostCode').val());
										sData += '&mailingcountry=' + ns1blankspace.util.fs($('#ns1blankspaceAddressMailingCountry').val());
									}

									if ($('#ns1blankspaceMainFinancials').html() != '')
									{
										sData += '&directdebitbranchnumber=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialsBSB').val());
										sData += '&directdebitaccountnumber=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialsAccountNumber').val());
										sData += '&directdebitaccountname=' + ns1blankspace.util.fs($('#ns1blankspaceFinancialsAccountName').val());
									}	

									sData += ns1blankspace.extend.save();
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CONTACT_BUSINESS_MANAGE'),
										data: sData,
										dataType: 'json',
										success: this.process
									});
										
								},

					process: 	function (oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
										ns1blankspace.inputDetected = false;
										
										if (bNew) {ns1blankspace.contactBusiness.search.send('-' + ns1blankspace.objectContext)}
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}
				},

	groups: 	{							
					show: 		function (oParam, oResponse)
								{	
									var sXHTMLElementID = 'ns1blankspaceMainGroups';
									var sLabel = "groups";
									var iOption = 1;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}

									if (oResponse == undefined)
									{
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceContactBusinessGroupsColumn1" class="ns1blankspaceColumn1Flexible">' +
													ns1blankspace.xhtml.loading + '</td>' +
													'<td id="ns1blankspaceContactBusinessGroupsColumn2" style="width: 150px;" class="ns1blankspaceColumn2Action"></td>' +
													'</tr>' +
													'</table>');				
										
										$('#ns1blankspaceMainGroups').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
										
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceContactBusinessGroupsAdd" class="ns1blankspaceAction">Add to group</span>' +
														'</td></tr>');													
										aHTML.push('</table>');					
										
										$('#ns1blankspaceContactBusinessGroupsColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceContactBusinessGroupsAdd').button(
										{
											label: "Add to group"
										})
										.click(function()
										{
											ns1blankspace.contactBusiness.groups.add(oParam);
										});
									
										var oSearch = new AdvancedSearch();
										oSearch.endPoint = 'contact';
										oSearch.method = 'CONTACT_BUSINESS_GROUP_SEARCH';
										oSearch.addField('contactbusiness,contactbusinesstext,group,grouptext');
										oSearch.addFilter('contactbusiness', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.rows = 100;
										oSearch.sort('grouptext', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.contactBusiness.groups.show(oParam, data)});
									}
									else
									{
										
										var aHTML = [];
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table>' +
															'<tr><td class="ns1blankspaceNothing">No groups.</td></tr>' +
															'</table>');

											$('#ns1blankspaceContactBusinessGroupsColumn1').html(aHTML.join(''));		
										}
										else
										{
											aHTML.push('<table class="ns1blankspace">');
											
											$.each(oResponse.data.rows, function()
											{	
												if (this.grouptext != '')
												{
													aHTML.push('<tr class="ns1blankspaceRow">');
																	
													aHTML.push('<td id="ns1blankspaceGroups-title-' + this.id + '" class="ns1blankspaceRow">' +
																			this.grouptext + '</td>');
													
													aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
																	'<span id="ns1blankspaceGroups_remove-' + this.id + 
																	'" class="ns1blankspaceRow ns1blankspaceGroupsRemove">&nbsp;</span></td>');
								
													aHTML.push('</tr>');
												}					
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceContactBusinessGroupsColumn1').html(aHTML.join(''));
											
											$('.ns1blankspaceGroupsRemove').button( {
												text: false,
												 icons: {
													 primary: "ui-icon-close"
												}
											})
											.click(function() {
												ns1blankspace.contactBusiness.groups.remove(this.id)
											})
											.css('width', '15px')
											.css('height', '20px')
										}
										
									}	
								},	

					add: 		function (oParam, oResponse)
								{
										
									if ($(ns1blankspace.xhtml.container).attr('data-initiator') == 'ns1blankspaceContactBusinessGroupsAdd')
									{
										$(ns1blankspace.xhtml.container).slideUp(500);
										$(ns1blankspace.xhtml.container).attr('data-initiator', '');
									}
									else
									{
										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_CONTACT_BUSINESS_GROUP_SEARCH';		
											oSearch.addField('title');
											oSearch.rows = 100;
											oSearch.getResults(function(data) {ns1blankspace.contactBusiness.groups.add(oParam, data)});	
										}
										else
										{
											ns1blankspace.container.position(
											{
												xhtmlElementID: 'ns1blankspaceContactBusinessGroupsAdd',
												topOffset: -50,
												leftOffset: -257
											});

											$(ns1blankspace.xhtml.container).attr('data-initiator', 'ns1blankspaceContactBusinessGroupsAdd')
											
											var aHTML = [];
											
											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table class="ns1blankspaceSearchMedium">' + 
																'<tr><td class="ns1blankspaceNothing">No groups.</td></tr>' + 
																'</table>');

												$(ns1blankspace.xhtml.container).html(aHTML.join(''));
												$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
											}
											else
											{
												aHTML.push('<table class="ns1blankspaceSearchMedium" style="font-size:0.875em;">');
												
												$.each(oResponse.data.rows, function()
												{	
													aHTML.push('<tr class="ns1blankspaceRow">' +
																	'<td id="ns1blankspaceGroupsAdd-title-' + this.id + '" class="ns1blankspaceRowSelect ns1blankspaceGroupsAddRowSelect">' +
																			this.title + '</td>');
													
													aHTML.push('</tr>');
												});
												
												aHTML.push('</table>');

												$(ns1blankspace.xhtml.container).html(aHTML.join(''));
												$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
												
												$('td.ns1blankspaceGroupsAddRowSelect').click(function(event)
												{
													ns1blankspace.contactBusiness.groups.select(event.target.id);
												});
											}
										}
									}	
								},

					select: 	function (sXHTMLElementId)
								{

									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[2];
									
									$('#' + sXHTMLElementId).fadeOut(500);
									
									var sData = 'contactbusiness=' + ns1blankspace.objectContext +
												'&group=' + sSearchContext;
												
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CONTACT_BUSINESS_GROUP_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data){ns1blankspace.contactBusiness.groups.show()}
									});
								},

					remove: 	function (sXHTMLElementId)
								{
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									
									var sData = 'remove=1&id=' + sSearchContext;
												
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CONTACT_BUSINESS_GROUP_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data){$('#' + sXHTMLElementId).parent().parent().fadeOut(500)}
									});	
								},
					search: 	{
									show: 		function (oParam, oResponse)
												{
													var sXHTMLElementID = 'ns1blankspaceMain';
													var sLabel = "groups";
													var iOption = 1;
													
													if (oParam != undefined)
													{
														if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
													}

													if (oResponse == undefined)
													{
														var oSearch = new AdvancedSearch();
														oSearch.method = 'SETUP_CONTACT_BUSINESS_GROUP_TYPE_SEARCH';
														oSearch.addField('title');
														oSearch.rows = 100;
														oSearch.sort('title', 'asc');
														oSearch.getResults(function(data) {ns1blankspace.contactBusiness.groups.search.show(oParam, data)});
													}
													else
													{
														var aHTML = [];
														
														aHTML.push('<table class="ns1blankspaceContainer">' +
																	'<tr class="ns1blankspaceContainer">' +
																	'<td id="ns1blankspaceContactBusinessByGroupColumn1" style="width:150px;border-right-style:solid;border-width:1px;border-color:#B8B8B8;padding-right:15px;">' +
																	'</td>' +
																	'<td id="ns1blankspaceContactBusinessByGroupColumn2" class="ns1blankspaceColumn1Large" style="padding-left:15px;">' +
																	'</td>' +
																	'</tr>' +
																	'</table>');				
														
														$('#ns1blankspaceMain').html(aHTML.join(''));
														
														var aHTML = [];
														
														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<table class="ns1blankspace">' +
																			'<tr><td class="ns1blankspaceNothing">No groups.</td></tr>' + 
																			'</table>');

															$('#ns1blankspaceContactBusinessByGroupColumn1').html(aHTML.join(''));
														}
														else
														{
															aHTML.push('<table class="ns1blankspace">');
															
															$.each(oResponse.data.rows, function()
															{
																aHTML.push('<tr class="ns1blankspaceRow">' +
																				'<td id="ns1blankspaceContactBusinessByGroup_title-' + this.id +
																				'-' + this.title +
																				'" class="ns1blankspaceRowSelect ns1blankspaceRowSelectByGroup">' +
																				this.title + '</td></tr>');
															});
															
															aHTML.push('</table>');

															$('#ns1blankspaceContactBusinessByGroupColumn1').html(aHTML.join(''));
																		
															$('td.ns1blankspaceRowSelectByGroup').click(function(event)
															{
																ns1blankspace.contactBusiness.groups.search.process({xhtmlElementID: event.target.id});
															});
														}
													}	
												},	

									process: 	function (oParam, oResponse)
												{
													var sXHTMLElementID;
													
													if (oParam != undefined)
													{
														if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
													}

													var aXHTMLElementId = sXHTMLElementID.split('-')
													
													if (oResponse == undefined)
													{
														$('#ns1blankspaceContactBusinessByGroupColumn2').html(ns1blankspace.xhtml.loading);
														
														var oSearch = new AdvancedSearch();
														oSearch.method = 'CONTACT_BUSINESS_GROUP_SEARCH';
														oSearch.addField('contactbusiness,businessgroup.contactbusiness.tradename,group,grouptext');
														oSearch.addFilter('group', 'EQUAL_TO', aXHTMLElementId[1]);
														oSearch.sort('businessgroup.contactbusiness.tradename', 'asc');
														oSearch.getResults(function(data) {ns1blankspace.contactBusiness.groups.search.process(oParam, data)});
													}
													else
													{
														var aHTML = [];
														
														if (oResponse.data.rows.length == 0)
														{
															aHTML.push('<table><tr>' +
																				'<td class="ns1blankspaceNothing">No contacts.</td></tr>' +
																				'</table>');
														}
														else
														{		
															aHTML.push('<table class="ns1blankspace" id="ns1blankspaceContactBusinessGroup">');
										
															aHTML.push('<tr class="ns1blankspaceCaption">' + 
																			'<td colspan=2 class="ns1blankspaceHeaderCaption">' + aXHTMLElementId[2] + '</td>' +
																			'</tr>');
															
															$.each(oResponse.data.rows, function()
															{
																aHTML.push(ns1blankspace.contactBusiness.groups.search.row(this));
															});
															
															aHTML.push('</table>');
														}
														
														ns1blankspace.render.page.show(
														{
															xhtmlElementID: 'ns1blankspaceContactBusinessByGroupColumn2',
															xhtmlContext: 'ContactBusinessGroupsContacts',
															xhtml: aHTML.join(''),
															showMore: (oResponse.data.morerows == "true"),
															more: oResponse.moreid,
															rows: ns1blankspace.option.defaultRows,
															functionShowRow: ns1blankspace.contactBusiness.groups.search.row,
															functionNewPage: 'ns1blankspace.contactBusiness.groups.search.bind()',
															type: 'json'
														}); 	
														
														ns1blankspace.contactBusiness.groups.search.bind();
													}	
												},	

									row: 		function (oRow)
												{
													var aHTML = [];
													
													if (oRow["businessgroup.contactbusiness.tradename"] != '')
													{	
														aHTML.push('<tr class="ns1blankspaceRow">');
											
														aHTML.push('<td id="ns1blankspaceContactBusinessGroup_tradename-' + oRow.contactbusiness + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																				oRow["businessgroup.contactbusiness.tradename"] + '</td>');

														aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
																		'<span id="ns1blankspaceContactBusinessGroup_remove-' + oRow.id + 
																		'" class="ns1blankspaceRow ns1blankspaceGroupsRemove">&nbsp;</span>' +
																		'</td>');
														
														aHTML.push('</tr>');
													}	
																
													return aHTML.join('');
												},

									bind: 		function ()
												{
													$('#ns1blankspaceContactBusinessGroup td.ns1blankspaceRowSelect')
													.click(function()
													{
														var aID = (this.id).split('-');
														ns1blankspace.contactBusiness.init({id: aID[1]});
													});

													$('#ns1blankspaceContactBusinessGroup .ns1blankspaceGroupsRemove').button(
													{
														text: false,
														icons:
														{
															 primary: "ui-icon-close"
														}
													})
													.click(function()
													{
														ns1blankspace.contactBusiness.groups.remove(this.id)
													})
													.css('width', '15px')
													.css('height', '20px');
												}
								}
				},				

	people: 	{

					show:		function (oParam, oResponse)
								{
									
									var sXHTMLElementID = 'ns1blankspaceMainPeople';
									var sLabel = "people";
									var iOption = 1;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}

									if (oResponse == undefined)
									{
										$('#ns1blankspaceMainPeople').html(ns1blankspace.xhtml.loading);

										var oSearch = new AdvancedSearch();
										oSearch.endPoint = 'contact';
										oSearch.method = 'CONTACT_PERSON_SEARCH';
										
										oSearch.addField('firstname,surname,position,workphone,fax,mobile,email');
										oSearch.async = false;
										oSearch.rf = 'json';
										oSearch.rows = ns1blankspace.option.defaultRows;
										oSearch.addFilter('contactbusiness', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.sort('modifieddate', 'desc');
										
										oSearch.getResults(function(data) {ns1blankspace.contactBusiness.people.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceContactBusinessPeopleColumn1" class="ns1blankspaceColumn1Large">' +
													ns1blankspace.xhtml.loading +
													'</td>' +
													'<td id="ns1blankspaceContactBusinessPeopleColumn2" style="width: 100px;" class="ns1blankspaceColumn2Action">' +
													'</td>' +
													'</tr>' +
													'</table>');				
										
										$('#' + sXHTMLElementID).html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
										
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceContactBusinessPeopleAdd" class="ns1blankspaceAction">Add</span>' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceContactBusinessPeopleColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceContactBusinessPeopleAdd').button(
										{
											label: "Add Person"
										})
										.click(function() {
											ns1blankspace.contactPerson.init(
											{
												contactBusiness: ns1blankspace.objectContext,
												contactBusinessText: ns1blankspace.objectContextData.tradename,
												"new": true
											});
										})
										.css('width', '75px')
										
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px); margin-bottom:15px);">');
											aHTML.push('<tr>');
											aHTML.push('<td class="ns1blankspaceNothing">No people.</td>');
											aHTML.push('</tr>');
											aHTML.push('</table>');

											$('#ns1blankspaceContactBusinessPeopleColumn1').html(aHTML.join(''));		
										}
										else
										{
										
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" class="ns1blankspace">');
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">First Name</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Surname</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Position</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Mobile</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Email</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.contactBusiness.people.row(this));
											});
											
											aHTML.push('</table>');
											
											ns1blankspace.render.page.show(
											{
												xhtmlElementID: 'ns1blankspaceContactBusinessPeopleColumn1',
												xhtmlContext: 'ContactBusinessPeople',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspace.contactBusiness.people.row,
												functionNewPage: 'ns1blankspace.contactBusiness.people.bind()',
												type: 'json'
											}); 	
											
											ns1blankspace.contactBusiness.people.bind();
										}
									}	
								},

					remove: function (sXHTMLElementID)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sSearchContext = aSearch[1];
									var sData = 'remove=1&id=' + sSearchContext;
									
									//ToDo: Add check for linked actions / activities, etc			
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CONTACT_PERSON_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data){$('#' + sXHTMLElementID).parent().fadeOut(500)}
									});
										
								},					

					row: 	function (oRow)
								{
									var aHTML = [];
									
									aHTML.push('<tr class="ns1blankspaceRow">');
															
									aHTML.push('<td id="ns1blankspaceContactBusinessPeople_firstname-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.firstname + '</td>');
															
									aHTML.push('<td id="ns1blankspaceContactBusinessPeople_surname-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.surname + '</td>');						
																
									aHTML.push('<td id="ns1blankspaceContactBusinessPeople_position-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.position + '</td>');	

									aHTML.push('<td id="ns1blankspaceContactBusinessPeople_mobile-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.mobile + '</td>');	

									aHTML.push('<td id="ns1blankspaceContactBusinessPeople_email-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.email + '</td>');												
																													
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
									aHTML.push('<span id="ns1blankspaceContactBusinessPeople_options_view-' + oRow.id +
													'" class="ns1blankspaceRowSelect ns1blankspaceContactBusinessPeopleRowSelect"></span>');
									aHTML.push('</td>');
																							
									aHTML.push('</tr>');	
									
									return aHTML.join('');
								},

					bind: 		function ()
								{
									$('.ns1blankspaceContactBusinessPeopleRowSelect').button( {
												text: false,
												icons: {
													primary: "ui-icon-play"
												}
									})
									.click(function() {
										ns1blankspace.contactPerson.init({showHome: false});
										ns1blankspace.contactPerson.search.send(this.id)
									})
									.css('width', '15px')
									.css('height', '20px')
									
									$('.ns1blankspaceContactBusinessPeopleRowDelete').button( {
										text: false,
										 icons: {
											 primary: "ui-icon-close"
										}
									})
									.click(function() {
										ns1blankspace.contactBusiness.people.remove(this.id)
									})
									.css('width', '15px')
									.css('height', '20px')
								}

				},

	favourites: {
					show: 		function (oParam, oResponse)
								{
									var sXHTMLElementID;
									
									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}

									var aXHTMLElementId = sXHTMLElementID.split('-')
									
									if (oResponse == undefined)
									{
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceContactBusinessFavouriteColumn1" class="ns1blankspaceColumn1Flexible">' +
													'</td>' +
													'<td id="ns1blankspaceContactBusinessFavouriteColumn2" class="ns1blankspaceColumn1Large" style="width: 200px;">' +
													'</td>' +
													'</tr>' +
													'</table>');				
										
										$('#ns1blankspaceMain').html(aHTML.join(''));

										$('#ns1blankspaceContactBusinessFavouriteColumn1').html(ns1blankspace.xhtml.loading);
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'CONTACT_BUSINESS_SEARCH';
										oSearch.addField('tradename');
										oSearch.addFilter('', 'IS_FAVOURITE', '');
										oSearch.rows = 20;
										oSearch.sort('tradename', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.contactBusiness.favourites.show(oParam, data)});	
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr>' +
																'<td class="ns1blankspaceNothing">No favourite businesses.</td></tr>' +
																'</table>');
										}
										else
										{		
											aHTML.push('<table class="ns1blankspace" id="ns1blankspaceFavourites">');
											
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Trading Name</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.contactBusiness.favourites.row(this));
											});
											
											aHTML.push('</table>');
										}
										
										ns1blankspace.render.page.show(
										{
											xhtmlElementID: 'ns1blankspaceContactBusinessFavouriteColumn1',
											xhtmlContext: 'ContactBusinessFavourites',
											xhtml: aHTML.join(''),
											showMore: (oResponse.morerows == "true"),
											more: oResponse.moreid,
											rows: ns1blankspace.option.defaultRows,
											functionShowRow: ns1blankspace.contactBusiness.favourites.row,
											functionOnNewPage: ns1blankspace.contactBusiness.favourites.bind,
											type: 'json'
										}); 
									}	
								},	

					row: 		function (oRow)
								{
									var aHTML = [];
								
									aHTML.push('<tr class="ns1blankspace">');
															
									aHTML.push('<td id="tradename-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.tradename + '</td>');
															
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspaceFavourites_view-' + oRow.id + 
													'" class="ns1blankspaceRowView">&nbsp;</span></td>');						
									
									aHTML.push('</tr>');
												
									return aHTML.join('');
								},

					bind: 		function ()
								{
									$('#ns1blankspaceFavourites .ns1blankspaceRowView').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-play"
										}
									})
									.click(function()
									{
										ns1blankspace.contactBusiness.init({id: (this.id).split('-')[1]});
									})
									.css('width', '15px')
									.css('height', '20px');
								}	
				}
			
}													