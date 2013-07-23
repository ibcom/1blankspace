/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.contactPerson = 
{
	data: 		{},

	init: 		function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 32;	
					ns1blankspace.objectName = 'contactPerson';
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectMethod = 'CONTACT_PERSON'
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'People';	
					ns1blankspace.data.contactBusiness = undefined;

					$('#ns1blankspaceViewControlContext').html('<input id="ns1blankspaceViewControlSearch">');
					$('#ns1blankspaceViewControlContextImage').html('<div id="ns1blankspaceViewContact" class="ns1blankspaceViewImage"></div>');

					if (oParam != undefined)
					{
						if (oParam.contactBusiness != undefined) {ns1blankspace.data.contactBusiness = oParam.contactBusiness}
						if (oParam.contactBusinessText != undefined) {ns1blankspace.data.contactBusinessText = oParam.contactBusinessText}
					}	

					ns1blankspace.app.set(oParam);					
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
							ns1blankspace.contactPerson.favourites.show({xhtmlElementID: "ns1blankspaceMain"});
						})
						.css('width', '26px')
						.css('height', '26px');
						
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CONTACT_PERSON_SEARCH';		
						oSearch.addField('firstname,surname');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(function(data) {ns1blankspace.contactPerson.home(oParam, data)});	
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<div class="ns1blankspaceNothing">No people.</div>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
												'" class="ns1blankspaceMostLikely">' +
												this.firstname + ' ' +
												this.surname +
												'</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.contactPerson.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function (sXHTMLElementId, oParam)
								{
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									var iMinimumLength = 2;
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
										oSearch.method = 'CONTACT_PERSON_SEARCH';
										oSearch.addField('firstname,surname,contactbusiness,contactbusinesstext,title,titletext,position,workphone,fax,mobile,email,' +
																 'customerstatus,customerstatustext,gender,gendertext,' +
																 'streetaddress1,streetaddress2,streetsuburb,streetstate,streetpostcode,streetcountry,' +
																 'mailingaddress1,mailingaddress2,mailingsuburb,mailingstate,mailingpostcode,mailingcountry,modifieddate,notes,' +
																 'dateofbirth,rating,ratingtext,numberofchildren,otherfamilydetails');

										oSearch.addField(ns1blankspace.extend.elements());

										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										oSearch.getResults(function(data) {ns1blankspace.contactPerson.show(oParam, data)});
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
											oSearch.method = 'CONTACT_PERSON_SEARCH';
											oSearch.addField('firstname,surname');
											
											if (iSource == ns1blankspace.data.searchSource.browse)
											{
												oSearch.addFilter('quicksearch', 'TEXT_STARTS_WITH', sSearchText);
											}
											else
											{	
												var aSearchText = sSearchText.split(' ');

												if (aSearchText.length > 1)
												{
													oSearch.addFilter('firstname', 'TEXT_STARTS_WITH', aSearchText[0]);
													oSearch.addFilter('surname', 'TEXT_STARTS_WITH', aSearchText[1]);
												}
												else
												{
													oSearch.addFilter('firstname', 'TEXT_IS_LIKE', sSearchText);
													oSearch.addOperator('or');
													oSearch.addFilter('surname', 'TEXT_IS_LIKE', sSearchText);
												}	
											}	
											
											oSearch.rows = 15;
											oSearch.rf = 'json';
											oSearch.getResults(function(data) {ns1blankspace.contactPerson.search.process(oParam, data)});
										}
									};	
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
											
											aHTML.push('<td class="ns1blankspaceSearch" id="contactperson' +
															'-' + this.id + '">' +
															this.firstname + 
															'</td>');
											
											aHTML.push('<td class="ns1blankspaceSearch" id="contactperson' +
															'-' + this.id + '">' +
															this.surname + '</td>');
															
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
											ns1blankspace.contactPerson.search.send(event.target.id, {source: 1});
										});
										
										ns1blankspace.render.bind(
										{
											columns: 'firstname-surname',
											more: oResponse.moreid,
											rows: 15,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.contactPerson.search.send
										});   
										
									}	
								}
				},						

	layout: 	function ()
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
						ns1blankspace.contactPerson.save.send();
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
						ns1blankspace.contactPerson.summary();
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
						ns1blankspace.contactPerson.details();
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

						if ($('#ns1blankspaceDetailsFirstName').val() != undefined)
						{
							ns1blankspace.contactPersonText = $('#ns1blankspaceDetailsFirstName').val() + ' ' + $('#ins1blankspaceDetailsSurname').val();
						}
						
						ns1blankspace.actions.show(
						{
							xhtmlElementContainerID: 'ns1blankspaceMainActions',
							contactPerson: ns1blankspace.objectContext, 
							contactPersonText: ns1blankspace.data.contactPersonText,
							contactBusiness: ns1blankspace.data.contactBusiness, 
							contactBusinessText: ns1blankspace.data.contactBusinessText,
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
					aHTML.push('<div id="ns1blankspaceMainSMS" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));			
				},

	show: 		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.contactPerson.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find contact person.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						ns1blankspace.data.contactBusiness = ns1blankspace.objectContextData.contactbusiness;
						ns1blankspace.data.contactBusinessText = ns1blankspace.objectContextData.contactbusinesstext
						ns1blankspace.data.contactPersonText = ns1blankspace.objectContextData.firstname + ' ' + ns1blankspace.objectContextData.surname;
						
						$('#ns1blankspaceViewControlContext').html(ns1blankspace.objectContextData.firstname + 
								' ' + ns1blankspace.objectContextData.surname);

						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.contactPerson.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.contactPerson.summary()'});
					}	
				},	
		
	summary: 	function (oParam, oResponse)
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this contact.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						if (oResponse == undefined)
						{	
							aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceRow">' +
										'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
										'</tr>' +
										'</table>');				
							
							$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
						
							var aHTML = [];
						
							aHTML.push('<table class="ns1blankspace">');

							if (ns1blankspace.objectContextData.contactbusinesstext != '')
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Business</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryBusiness" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.contactbusinesstext +
											'</td></tr>');
							}

							if (ns1blankspace.objectContextData.mobile != '')
							{	
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Mobile</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryMobile" class="ns1blankspaceSummary">' +
											'<a href="callto:' + ns1blankspace.objectContextData.mobile + '">' +
											ns1blankspace.objectContextData.mobile + '</a>' +
											'</td></tr>');
							}

							if (ns1blankspace.objectContextData.workphone != '')
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Phone</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryPhone" class="ns1blankspaceSummary">' +
											'<a href="callto:' + ns1blankspace.objectContextData.workphone + '">' +
											ns1blankspace.objectContextData.workphone + '</a>' +
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
											aAddress.join('<br />') +
											'</td></tr>');
							}

							if (ns1blankspace.objectContextData.email != '')
							{	
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Email</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryEmail" class="ns1blankspaceSummary">' +
											'<a href="mailto:' + ns1blankspace.objectContextData.email + '">' +
											ns1blankspace.objectContextData.email + '</a>' +
											'</td></tr>');
							}

							var oDate = new Date(ns1blankspace.objectContextData.modifieddate);

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Last Updated</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryLastUpdated" class="ns1blankspaceSummary">' +
											oDate.toString("dd MMM yyyy") +
											'</td></tr>');	
									
							aHTML.push('</table>');					
							
							$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));	

							var aHTML = [];
						
							aHTML.push('<div id="ns1blankspaceFavourite" style="margin-bottom:2px; width:26px;>' +
											ns1blankspace.xhtml.loadingSmall + 
											'</div>');	

							if (false && ns1blankspace.objectContextData.email != '')
							{									
								aHTML.push('<div id="ns1blankspaceContactPersonEmail" style="margin-bottom:2px;"></div>');
							}

							if (ns1blankspace.objectContextData.mobile != '')
							{
								aHTML.push('<div id="ns1blankspaceContactPersonSMS" style="margin-bottom:2px;"></div>');
							}				
							
							$('#ns1blankspaceControlSummaryOptions').html(aHTML.join(''));	

							$('#ns1blankspaceContactPersonEmail').button(
							{
								text: false,
								icons:
								{
									primary: "ui-icon ui-icon-mail-closed"
								}
							})
							.click(function()
							{
								ns1blankspace.messaging.imap.init(
								{
									action: 1,
									emailTo: ns1blankspace.objectContextData.email,
									contactPersonTo: ns1blankspace.objectContextData.id,
									object: 32,
									objectContext: ns1blankspace.objectContextData.id
								});
							})
							.css('width', '26px')
							.css('height', '26px');

							$('#ns1blankspaceContactPersonSMS').button(
							{
								text: false,
								label: 'Send SMS',
								icons:
								{
									primary: "ui-icon-comment"
								}
							})
							.click(function()
							{
								ns1blankspace.contactPerson.sms.show();
							})
							.css('width', '26px')
							.css('height', '26px');

							var sData = 'object=' + ns1blankspace.object;
							sData += '&objectContext=' + ns1blankspace.objectContext;
							
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('CORE_FAVOURITE_SEARCH'),
								data: sData,
								dataType: 'json',
								success: function (data)
								{
									ns1blankspace.contactPerson.summary(oParam, data);
								}
							});
						}	
						else
						{
							var bFavourite = false;
							var iFavouriteID;
							var oButton =
							{
								text: false,
								label: 'Favourite',
								icons:
								{
									primary: "ui-icon-star"
								}
							}

							if (oResponse.data.rows.length != 0)
							{
								oButton =
								{
									text: false,
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

							$('#ns1blankspaceFavourite').html('<input type="checkbox" ' + (bFavourite?'checked="checked" ':'') + 'id="ns1blankspaceContactPersonFavourite"/>' +
									'<label for="ns1blankspaceContactPersonFavourite" style="font-size:0.75em;"></label>');

							$('#ns1blankspaceContactPersonFavourite').button(
							oButton)
							.click(function()
							{
								var sData = 'object=' + ns1blankspace.object;
								sData += '&objectContext=' + ns1blankspace.objectContext;
								if (bFavourite)
								{
									ns1blankspace.status.message('No longer a favourite');
									sData += '&remove=1&id=' + ns1blankspace.util.fs(iFavouriteID);
								}
								else
								{
									ns1blankspace.status.message('Is now a favourite');
								}

								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('CORE_FAVOURITE_MANAGE'),
									data: sData,
									dataType: 'json',
									success: function ()
									{
										ns1blankspace.contactPerson.summary();
									}
								});							
							})
							.css('width', '26px')
							.css('height', '26px')
							.css('margin-botton', '2px;');
						}	
					}	
				},

	details: 	function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDetails').attr('data-loading', '');
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'First Name' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsFirstName" class="ns1blankspaceText">' +
										'</td></tr>');			

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Surname' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsSurname" class="ns1blankspaceText">' +
										'</td></tr>');			
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Title' +
										'</td></tr>' +
										'<tr class="ns1blankspaceSelect">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceDetailsTitle" class="ns1blankspaceSelect"' +
											' data-method="SETUP_CONTACT_TITLE_SEARCH">' +
										'</td></tr>');							
										
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Position' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPosition" class="ns1blankspaceText">' +
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
										'Phone' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPhone" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Mobile' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsMobile" class="ns1blankspaceText">' +
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
										'Description / Notes' +
										'</td></tr>' +
										'<tr class="ns1blankspaceTextMulti">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="10" cols="35" id="ns1blankspaceDetailsDescription" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Rating</td></tr>' +
										'<tr class="ns1blankspaceSelect">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceDetailsRating" class="ns1blankspaceSelect"' +
											' data-method="SETUP_CONTACT_RATING_SEARCH">' +
										'</td></tr>');
															
						aHTML.push('</table>');

						aHTML.push('<table class="ns1blankspace">');
				
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Street Address' +
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
						
						aHTML.push('<tr><td>&nbsp;</td></tr>' +
										'<tr><td id="ns1blankspaceAddressCopy" style="font-size:0.825em;">' +
										'</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainDetails').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsFirstName').val((ns1blankspace.objectContextData.firstname).formatXHTML());
							$('#ns1blankspaceDetailsSurname').val((ns1blankspace.objectContextData.surname).formatXHTML());
							$('#ns1blankspaceDetailsTitle').attr('data-id', ns1blankspace.objectContextData.title);
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.titletext);
							$('#ns1blankspaceDetailsPosition').val(ns1blankspace.objectContextData.position);
							$('#ns1blankspaceDetailsPhone').val(ns1blankspace.objectContextData.workphone);
							$('#ns1blankspaceDetailsMobile').val(ns1blankspace.objectContextData.mobile);
							$('#ns1blankspaceDetailsFax').val(ns1blankspace.objectContextData.fax);
							$('#ns1blankspaceDetailsEmail').val(ns1blankspace.objectContextData.email);
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.notes);
							$('#ns1blankspaceDetailsRating').attr('data-id', ns1blankspace.objectContextData.rating);
							$('#ns1blankspaceDetailsRating').val(ns1blankspace.objectContextData.ratingtext);
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
											firstname: $('#ns1blankspaceDetailsFirstName').val(),
											surname: $('#ns1blankspaceDetailsSurname').val(),
											title: $('#ns1blankspaceDetailsTitle').attr('data-id'),
											jobtitle: $('#ns1blankspaceDetailsPosition').val(),
											phone: $('#ns1blankspaceDetailsPhone').val(),
											fax: $('#ns1blankspaceDetailsFax').val(),
											mobile: $('#ns1blankspaceDetailsMobile').val(),
											email: $('#ns1blankspaceDetailsEmail').val(),
											notes: $('#ns1blankspaceDetailsDescription').val(),
											rating: $('#ns1blankspaceDetailsRating').attr('data-id'),
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
										url: ns1blankspace.util.endpointURI('CONTACT_PERSON_MANAGE'),
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
										
										if (bNew) {ns1blankspace.contactPerson.search.send('-' + ns1blankspace.objectContext)}
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
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
													'<td id="ns1blankspaceContactPersonFavouriteColumn1" class="ns1blankspaceColumn1Flexible">' +
													'</td>' +
													'</tr>' +
													'</table>');				
										
										$('#ns1blankspaceMain').html(aHTML.join(''));

										$('#ns1blankspaceContactPersonFavouriteColumn1').html(ns1blankspace.xhtml.loading);
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'CONTACT_PERSON_SEARCH';
										oSearch.addField('firstname,surname');
										oSearch.addFilter('', 'IS_FAVOURITE', '');
										oSearch.rows = 20;
										oSearch.sort('firstname', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.contactPerson.favourites.show(oParam, data)});	
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">' +
															'No favourite.</td></tr></table>');
										}
										else
										{		
											aHTML.push('<table class="ns1blankspace" id="ns1blankspaceFavourites">');
											
											$.each(oResponse.data.rows, function() {
											
												aHTML.push(ns1blankspace.contactPerson.favourites.row(this));
											});
											
											aHTML.push('</table>');
										}
										
										ns1blankspace.render.page.show(
										{
											xhtmlElementID: 'ns1blankspaceContactPersonFavouriteColumn1',
											xhtmlContext: 'ContactFavourites',
											xhtml: aHTML.join(''),
											showMore: (oResponse.morerows == "true"),
											more: oResponse.moreid,
											rows: ns1blankspace.option.defaultRows,
											functionShowRow: ns1blankspace.contactPerson.favourites.row,
											functionNewPage: 'ns1blankspace.contactPerson.favourites.bind()',
											type: 'json'
										}); 	
										
										ns1blankspace.contactPerson.favourites.bind();
									}	
								},	

					row: 		function (oRow)
								{
									var aHTML = [];
								
									aHTML.push('<tr class="ns1blankspaceRow">');
															
									aHTML.push('<td id="ns1blankspaceFavourites_firstname-' + oRow.id + '" class="ns1blankspaceRowSelect">' +
															oRow.firstname + ' ' +
															oRow.surname + '</td>');
									
									aHTML.push('</tr>');
												
									return aHTML.join('');
								},

					bind: 		function ()
								{
									$('#ns1blankspaceFavourites .ns1blankspaceRowSelect').click(function()
									{
										ns1blankspace.contactPerson.init({showHome: false});
										ns1blankspace.contactPerson.search.send(this.id);
									});
								}	
				},

	sms: 		{
					show: 		function ()
								{
									ns1blankspace.show({selector: '#ns1blankspaceMainSMS'});

									var aHTML = [];
										
									aHTML.push('<table>');

									aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Send SMS</td></tr>' +
											'<tr><td class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.mobile + 
											'</td></tr>');								
								
									aHTML.push('<tr><td class="ns1blankspaceTextMulti">' +
														'<textarea id="ns1blankspaceSMSMessage" name="message" rows="15" cols="5" style="width:175px; height:150px;" ' +
																' class="ns1blankspaceTextMulti"></textarea>' +
														'</td></tr>');
									
									aHTML.push('<tr><td>' +
													'<span id="ns1blankspaceSMSSend" class="ns1blankspaceAction">Send</span> ' +
													'</td></tr>');
															
									aHTML.push('</table>');
		
									$('#ns1blankspaceMainSMS').html(aHTML.join(''));
	
									$('#ns1blankspaceSMSSend').button(
									{
										label: "Send"
									})
									.click(function() {
										ns1blankspace.contactPerson.sms.send();
									})

									$('#ns1blankspaceSMSCancel').button(
									{
										label: "Cancel"
									})
									.click(function()
									{
										$('#ns1blankspaceSMSContainer').html('');
									})

									$('#ns1blankspaceSMSMessage').focus();
								},

					send: 		function ()
								{
									var oData =
									{
										contactperson: ns1blankspace.objectContext,
										message: $('#ns1blankspaceSMSMessage').val()
									}

									$('#ns1blankspaceMainSMS').html(ns1blankspace.xhtml.loading);

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('MESSAGING_SMS_SEND'),
										data: oData,
										dataType: 'json',
										success: function(data) 
										{
											$('#ns1blankspaceMainSMS').html('SMS Sent');
										}
									});
								}			
				}
}														
