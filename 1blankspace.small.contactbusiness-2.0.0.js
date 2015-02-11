/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.contactBusiness = 
{
		init: 	function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 12;
					ns1blankspace.objectName = 'contactBusiness';
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectMethod = 'CONTACT_BUSINESS'
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Businesses';

					$('#ns1blankspaceViewControlContext').html('<input id="ns1blankspaceViewControlSearch">');
					$('#ns1blankspaceViewControlContextImage').html('<div id="ns1blankspaceViewContact" class="ns1blankspaceViewImage"></div>');
					
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
						
												$('#ns1blankspaceControl').html('<span id="ns1blankspaceControlFavourites"></span>');

						$('#ns1blankspaceControlFavourites').button(
						{
							text: false,
							icons:
							{
								primary: 'ui-icon-star'
							}
						})
						.click(function(event)
						{
							ns1blankspace.show({refresh: true});
							ns1blankspace.contactBusiness.favourites.show({xhtmlElementID: "ns1blankspaceMain"});
						})
						.css('width', '26px')
						.css('height', '26px');
						
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
							aHTML.push('<div class="ns1blankspaceNothing">No businesses.</td></tr></table>');
						}
						else
						{
							aHTML.push('<table>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
														'" class="ns1blankspaceMostLikely">' +
														this.tradename + ' ' +
														this.legalname +
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
									
									if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
									{							
										$('#ns1blankspaceMain').html(ns1blankspace.xhtml.loading);

										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.endPoint = 'contact';
										oSearch.method = 'CONTACT_BUSINESS_SEARCH';
										oSearch.addField( 'reference,tradename,legalname,phonenumber,faxnumber,industry,industrytext,' +
															'createddate,abn,customerstatus,customerstatustext' + 
															',webaddress,area,areatext,' +
															'streetaddress1,streetaddress2,streetsuburb,streetpostcode,streetstate,streetcountry' + 
															',mailingaddress1,mailingaddress2,mailingsuburb,mailingpostcode,mailingstate,mailingcountry,' +
															'notes,primarycontactperson,modifieddate');

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
											ns1blankspace.container.position({xhtmlElementID: sElementId});
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
											
											aHTML.push('<td class="ns1blankspaceSearch" id="contactbusiness' +
															'-' + this.id + '">' +
															this.tradename + 
															'</td>');
											
											aHTML.push('<td class="ns1blankspaceSearch" id="contactbusiness' +
															'-' + this.id + '">' +
															this.legalname + '</td>');
															
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');
										
										$(ns1blankspace.xhtml.container).html(
											ns1blankspace.render.init(
											{
												html: aHTML.join(''),
												more: (oResponse.morerows == "true")
											}) 
										);		
										
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										ns1blankspace.search.stop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.contactBusiness.search.send(event.target.id, {source: 1});
										});
										
										ns1blankspace.render.bind(
										{
											columns: 'tradename-legalname',
											more: oResponse.moreid,
											rows: 15,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.contactBusiness.search.send
										});   
										
									}	
								},
				},						

	layout:		function ()
				{
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceControlSave" style="margin-bottom:2px;"></div>');

					if (ns1blankspace.objectContext != -1)
					{
						aHTML.push(
							'<div id="ns1blankspaceControlSummary" style="margin-bottom:2px;"></div>' +
							'<div id="ns1blankspaceControlDetails" style="margin-bottom:2px;"></div>' +
							'<div id="ns1blankspaceControlActions" style="margin-bottom:2px;"></div>' +
							'<div id="ns1blankspaceControlAttachments" style="margin-bottom:2px;"></div>' +
							'<div id="ns1blankspaceControlSummaryOptions"></div>');
					}	

					$('#ns1blankspaceControl').html(aHTML.join(''));

					$('#ns1blankspaceControlSave').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-check"
						}
					})
					.click(function(event)
					{
						ns1blankspace.contactBusiness.save.send();
					})
					.css('width', '26px')
					.css('height', '26px');

					$('#ns1blankspaceControlSummary').button(
					{
						text: false,
						icons:
						{
							primary: 'ui-icon-grip-dotted-horizontal'
						}
					})
					.click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.contactBusiness.summary();
					})
					.css('width', '26px')
					.css('height', '26px');

					$('#ns1blankspaceControlDetails').button(
					{
						text: false,
						icons:
						{
							primary: 'ui-icon-pencil'
						}
					})
					.click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.contactBusiness.details();
					})
					.css('width', '26px')
					.css('height', '26px');

					$('#ns1blankspaceControlActions').button(
					{
						text: false,
						icons:
						{
							primary: 'ui-icon-clock'
						}
					})
					.click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainActions'});
						
						ns1blankspace.actions.show(
						{
							xhtmlElementContainerID: 'ns1blankspaceMainActions',
							contactBusiness: ns1blankspace.objectContext, 
							object: '',
							objectContext: ''
						});
					})
					.css('width', '26px')
					.css('height', '26px');

					$('#ns1blankspaceControlAttachments').button(
					{
						text: false,
						icons:
						{
							primary: 'ui-icon-paperclip'
						}
					})
					.click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments'});
						ns1blankspace.attachments.show();
					})
					.css('width', '26px')
					.css('height', '26px');
	
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPeople" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
				},

	show: 		function (oParam, oResponse)
				{

					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
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
						
						$('#ns1blankspaceViewControlContext').html(ns1blankspace.objectContextData.tradename);

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
		
	summary: 	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this business.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
					
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspace">');
						
						if (ns1blankspace.objectContextData.phonenumber != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Phone</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryPhone" class="ns1blankspaceSummary">' +
										'<a href="callto:' + ns1blankspace.objectContextData.phonenumber + '">' +
										ns1blankspace.objectContextData.phonenumber + '</a>' +
										'</td></tr>');
						}
												
						var aAddress = [];

						if (ns1blankspace.objectContextData.streetaddress1 != '') {aAddress.push(ns1blankspace.objectContextData.streetaddress1)}
						if (ns1blankspace.objectContextData.streetaddress2 != '') {aAddress.push(ns1blankspace.objectContextData.streetaddress2)}
						if (ns1blankspace.objectContextData.streetsuburb != '') {aAddress.push(ns1blankspace.objectContextData.streetsuburb)}
						if (ns1blankspace.objectContextData.streetpostcode != '') {aAddress.push(ns1blankspace.objectContextData.streetpostcode)}
						if (ns1blankspace.objectContextData.streetcountry != '') {aAddress.push(ns1blankspace.objectContextData.streetcountry)}

						if (aAddress.length != 0)
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Address</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryAddress" class="ns1blankspaceSummary">' +
										'<a href="comgooglemaps://?q=' +
										aAddress.join(',+').replace(/ /g, '+') + '">' +
										aAddress.join('<br />') +
										'</a></td></tr>');
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

						if (ns1blankspace.objectContextData.webaddress != '')
						{	
							var aHTML = [];
					
							aHTML.push('<table class="ns1blankspaceColumn2">');

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption" style="padding-bottom:10px;">' +
										'<a href="' + ns1blankspace.objectContextData.webaddress + '" target="_blank">' + 
										ns1blankspace.objectContextData.webaddress + '</a>' +
										'</td></tr>');	

							aHTML.push('</table>');					
						
							$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));	
						} 
					}	
				},

	details: 	function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDetails').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspace">');
						
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
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description / Notes' +
										'</td></tr>' +
										'<tr class="ns1blankspaceTextMulti">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="10" cols="35" id="ns1blankspaceDetailsDescription" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');
						
						aHTML.push('</table>');	

						aHTML.push('<table class="ns1blankspace">');
								
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Address' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressStreetAddress1" class="ns1blankspaceText">' +
										'</td></tr>');									
						
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressStreetAddress2" class="ns1blankspaceText">' +
										'</td></tr>');

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

						aHTML.push('</table>');									
							
						$('#ns1blankspaceMainDetails').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#ns1blankspaceDetailsTradeName').val(ns1blankspace.objectContextData.tradename);
							$('#ns1blankspaceDetailsLegalName').val(ns1blankspace.objectContextData.legalname);
							$('#ns1blankspaceDetailsIndustry').val(ns1blankspace.objectContextData.industrytext);
							$('#ns1blankspaceDetailsIndustry').attr('data-id', ns1blankspace.objectContextData.industry);
							$('#ns1blankspaceDetailsABN').val(ns1blankspace.objectContextData.abn);
							$('#ns1blankspaceDetailsPhone').val(ns1blankspace.objectContextData.phonenumber);
							$('#ns1blankspaceDetailsWebAddress').val(ns1blankspace.objectContextData.webaddress);
							$('#ns1blankspaceDetailsFax').val(ns1blankspace.objectContextData.fax);
							$('#ns1blankspaceDetailsStatus').val(ns1blankspace.objectContextData.customerstatustext);
							$('#ns1blankspaceDetailsStatus').attr('data-id', ns1blankspace.objectContextData.customerstatus);
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.notes);
							$('#ns1blankspaceAddressStreetAddress1').val(ns1blankspace.objectContextData.streetaddress1);
							$('#ns1blankspaceAddressStreetAddress2').val(ns1blankspace.objectContextData.streetaddress2);
							$('#ns1blankspaceAddressStreetSuburb').val(ns1blankspace.objectContextData.streetsuburb);
							$('#ns1blankspaceAddressStreetState').val(ns1blankspace.objectContextData.streetstate);
							$('#ns1blankspaceAddressStreetPostCode').val(ns1blankspace.objectContextData.streetpostcode);
							$('#ns1blankspaceAddressStreetCountry').val(ns1blankspace.objectContextData.streetcountry);
						}
						
						$('#ns1blankspaceDetailsTitle').keyup(function(event)
						{
							$(ns1blankspace.xhtml.container).hide(200);
							ns1blankspace.search.send(event.target.id);
						});
					}	
				},

	save: 		{
					send: 		function ()
								{
									ns1blankspace.status.working();

									var oData = {}
									
									if (ns1blankspace.objectContext != -1)
									{
										oData.id = ns1blankspace.objectContext;
									} 
									
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										$.extend(oData,
										{
											legalname: $('#ns1blankspaceDetailsLegalName').val(),
											tradename: $('#ns1blankspaceDetailsTradeName').attr('data-id'),
											abn: $('#ns1blankspaceDetailsABN').val(),
											phonenumber: $('#ns1blankspaceDetailsPhone').val(),
											faxnumber: $('#ns1blankspaceDetailsFax').val(),
											webaddress: $('#ns1blankspaceDetailsWebAddress').val(),
											notes: $('#ns1blankspaceDetailsDescription').val(),
											streetaddress1: $('#ns1blankspaceAddressStreetAddress1').val(),
											streetsuburb: $('#ns1blankspaceAddressStreetSuburb').val(),
											streetstate: $('#ns1blankspaceAddressStreetState').val(),
											streetpostcode: $('#ns1blankspaceAddressStreetPostCode').val(),
											streetcountry: $('#ns1blankspaceAddressStreetCountry').val()
										});
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CONTACT_BUSINESS_MANAGE'),
										data: oData,
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
													'</tr>' +
													'</table>');				
										
										$('#' + sXHTMLElementID).html(aHTML.join(''));
											
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<div class="ns1blankspaceNothing">No people.</div>');

											$('#ns1blankspaceContactBusinessPeopleColumn1').html(aHTML.join(''));		
										}
										else
										{		
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" class="ns1blankspace">');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.contactBusiness.people.row(this));
											});
											
											aHTML.push('</table>');
											
											ns1blankspace.render.page.show(
											{
												headerRow: false,
												xhtmlElementID: 'ns1blankspaceContactBusinessPeopleColumn1',
												xhtmlContext: 'ContactBusinessPeople',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspace.contactBusiness.people.row,
												functionOnNewPage: ns1blankspace.contactBusiness.people.bind,
												type: 'json'
											}); 	
										}
									}	
								},

					remove: 	function (sXHTMLElementID)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sSearchContext = aSearch[1];
									var sData = 'remove=1&id=' + sSearchContext;
											
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
															
									aHTML.push('<td id="ns1blankspaceContactBusinessPeople_firstname-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
															oRow.firstname + ' ' + oRow.surname + '<br />');

									aHTML.push('<div id="ns1blankspaceContactBusinessPeople_mobile-' + oRow.id + '" class="ns1blankspaceSub">' +
															oRow.mobile + '</div>');	

									aHTML.push('<div id="ns1blankspaceContactBusinessPeople_email-' + oRow.id + '" class="ns1blankspaceSub">' +
															oRow.email + '</div>');													
																							
									aHTML.push('</td></tr>');	
									
									return aHTML.join('');
								},

					bind: 		function ()
								{
									$('.ns1blankspaceRowSelect').click(function()
									{
										ns1blankspace.contactPerson.init({id: (this.id).split('-')[1]});
										
									});									
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
																'<td class="ns1blankspaceNothing">No favourites.</td></tr>' +
																'</table>');
										}
										else
										{		
											aHTML.push('<table class="ns1blankspace" id="ns1blankspaceFavourites">');
												
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.contactBusiness.favourites.row(this));
											});
											
											aHTML.push('</table>');
										}
										
										ns1blankspace.render.page.show(
										{
											headerRow: false,
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
															
									aHTML.push('<td id="tradename-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
															oRow.tradename + '</td>');
																								
									aHTML.push('</tr>');
												
									return aHTML.join('');
								},

					bind: 		function ()
								{
									$('ns1blankspaceFavourites .ns1blankspaceRowView').click(function()
									{
										ns1blankspace.contactBusiness.init({id: (this.id).split('-')[1]});
									});
								}	
				}
			
}													