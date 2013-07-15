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
						$('#ns1blankspaceViewControlContext').html('<input id="ns1blankspaceViewControlSearch">');

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
							aHTML.push('<table id="ns1blankspaceMostLikely">' +
											'<tr><td class="ns1blankspaceNothing">Click + to create a person contact.</td></tr>' +
											'</table>');
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
							'<div id="ns1blankspaceControlEdit" style="margin-bottom:2px;"></div>' +
							'<div id="ns1blankspaceControlSummaryActions"></div>');
					}	

					$('#ns1blankspaceControl').html(aHTML.join(''));

					$('#ns1blankspaceControlSave').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-disk"
						}
					})
					.click(function(event)
					{
						//ns1blankspace.home.show();
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
						ns1blankspace.contactPerson.summary();
					})
					.css('width', '26px')
					.css('height', '26px');

					$('#ns1blankspaceControlEdit').button(
					{
						text: false,
						icons:
						{
							primary: 'ui-icon-pencil'
						}
					})
					.click(function(event)
					{
						ns1blankspace.home.show();
					})
					.css('width', '26px')
					.css('height', '26px');

					aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Details</td></tr>');
										
						aHTML.push('<tr><td id="ns1blankspaceControlAddress" class="ns1blankspaceControl">' +
										'Address</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlBusiness" class="ns1blankspaceControl">' +
										'Business</td></tr>');							
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlAddress" class="ns1blankspaceControl">' +
										'Address</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlPersonal" class="ns1blankspaceControl">' +
										'Personal</td></tr>');
					
						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');
					
						aHTML.push('<tr><td id="ns1blankspaceControlGroups" class="ns1blankspaceControl">' +
										'Groups</td></tr>');
											
						aHTML.push('<tr><td id="ns1blankspaceControlBusiness" class="ns1blankspaceControl">' +
										'Business</td></tr>');
									
						aHTML.push('</table>');		
					
						aHTML.push('<table class="ns1blankspaceControl">');
					
						aHTML.push('<tr><td id="ns1blankspaceControlActions" class="ns1blankspaceControl">' +
										'Actions</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');
					}
							
					aHTML.push('</table>');					
						
					//$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAddress" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPersonal" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainGroups" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainBusiness" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainUser" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.contactPerson.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.contactPerson.details();
					});

					$('#ns1blankspaceControlPersonal').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPersonal'});
						ns1blankspace.contactPerson.personal();
					});
					
					$('#ns1blankspaceControlAddress').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAddress'});
						ns1blankspace.contactPerson.address();
					});
					
					$('#ns1blankspaceControlUser').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainUser', refresh: true});
						ns1blankspace.contactPerson.user();
					});
					
					$('#ns1blankspaceControlGroups').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainGroups', refresh: true});
						ns1blankspace.contactPerson.groups.show();
					});
					
					$('#ns1blankspaceControlBusiness').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainBusiness' , refresh: true});
						ns1blankspace.contactPerson.business();
					});
					
					$('#ns1blankspaceControlActions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainActions', refresh: true});
						
						if ($('#ns1blankspaceDetailsFirstName').val() != undefined)
						{
							ns1blankspace.contactPersonText = $('#ns1blankspaceDetailsFirstName').val() + ' ' + $('#ins1blankspaceDetailsSurname').val();
						}
						
						ns1blankspace.actions.show({
											xhtmlElementID: 'ns1blankspaceMainActions',
											contactPerson: ns1blankspace.objectContext, 
											contactPersonText: ns1blankspace.data.contactPersonText,
											contactBusiness: ns1blankspace.data.contactBusiness, 
											contactBusinessText: ns1blankspace.data.contactBusinessText,
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

							if (ns1blankspace.objectContextData.ratingtext != '')
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Rating</td></tr>' +
											'<tr><td class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.ratingtext +
											'</td></tr>');
							}

							if (ns1blankspace.objectContextData.workphone != '')
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Phone</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryPhone" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.workphone +
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

							if (ns1blankspace.objectContextData.email != '')
							{									
								aHTML.push('<div id="ns1blankspaceContactPersonEmail" style="margin-bottom:2px;"></div>');
							}

							if (ns1blankspace.objectContextData.mobile != '')
							{
								aHTML.push('<div id="ns1blankspaceContactPersonSMS" style="margin-bottom:2px;"></div>');

								//aHTML.push('<tr><td id="ns1blankspaceSMSContainer"></td></tr>');
							}				
							
							$('#ns1blankspaceControlSummaryActions').html(aHTML.join(''));	

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
								label: 'Send SMS'
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
										'<input id="ns1blankspaceDetailsRating" class="ns1blankspaceSelect" style="width:250px;"' +
											' data-method="SETUP_CONTACT_RATING_SEARCH">' +
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
						}
						
						$('#ns1blankspaceDetailsTitle').keyup(function(event)
						{
							$(ns1blankspace.xhtml.container).hide(200);
							ns1blankspace.search.send(event.target.id);
						});
					}	
				},

	personal: 	function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainPersonal').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainPersonal').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspacePersonalColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspacePersonalColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');					
						
						$('#ns1blankspaceMainPersonal').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Date of Birth' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsDateOfBirth" class="ns1blankspaceDate">' +
										'</td></tr>');			

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Number of Children' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsNumberOfChildren" class="ns1blankspaceText">' +
										'</td></tr>');			
										
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Other Details' +
										'</td></tr>' +
										'<tr class="ns1blankspaceTextMulti">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="5" cols="35" id="ns1blankspaceDetailsOtherFamilyDetails" class="ns1blankspaceTextMultiSmall"></textarea>' +
										'</td></tr>');
							
						aHTML.push('</table>');					
						
						$('#ns1blankspacePersonalColumn1').html(aHTML.join(''));

						$('input.ns1blankspaceDate').datepicker({ dateFormat: 'dd M yy' });

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsDateOfBirth').val(ns1blankspace.objectContextData.dateofbirth);
							$('#ns1blankspaceDetailsNumberOfChildren').val(ns1blankspace.objectContextData.numberofchildren);
							$('#ns1blankspaceDetailsOtherFamilyDetails').val(ns1blankspace.objectContextData.otherfamilydetails);
						}
					}	
				},

	address: 	function (oParam)
				{
					var aHTML = [];
					var bTwoLineAddress = false;

					if (oParam) {
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
										
						if (bTwoLineAddress) {
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
										
						if (bTwoLineAddress) {
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

	business: 	function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainBusiness').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainBusiness').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceBusinessColumn1" class="ns1blankspaceColumn1Large"></td>' +
										'<td id="ns1blankspaceBusinessColumn2" class="ns1blankspaceColumn2Action" style="width:100px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainBusiness').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Trading Name' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceBusiness" class="ns1blankspaceSelect"' +
											' data-method="CONTACT_BUSINESS_SEARCH"' +
											' data-columns="tradename">' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspace">' +
										'<td id="ns1blankspaceBusinessSummary" class="ns1blankspace">' +
										'</td></tr>');
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceBusinessColumn1').html(aHTML.join(''));
					
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceBusiness').attr('data-id', ns1blankspace.objectContextData.contactbusiness);
							$('#ns1blankspaceBusiness').val(ns1blankspace.objectContextData.contactbusinesstext);

							var aHTML = [];
						
							aHTML.push('<table class="ns1blankspaceColumn2">');
								
							if (ns1blankspace.objectContextData.contactbusiness != '')
							{	
								aHTML.push('<tr><td><span id="ns1blankspaceBusinessView" class="ns1blankspaceAction">' +
											'View</span></td></tr>');
							}
							
							aHTML.push('</table>');					
							
							$('#ns1blankspaceBusinessColumn2').html(aHTML.join(''));	
							
							$('#ns1blankspaceBusinessView').button(
							{
								label: 'View',
								icons:
								{
									primary: "ui-icon-play"
								}
							})
							.click(function()
							{
								ns1blankspace.contactBusiness.init({id: ns1blankspace.objectContextData.contactbusiness});
							});
						}
						else
						{
							$('#ns1blankspaceBusiness').attr('data-id', ns1blankspace.data.contactBusiness);
							$('#ns1blankspaceBusiness').val(ns1blankspace.data.contactBusinessText);
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
										sData += '&firstname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFirstName').val());
										sData += '&surname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSurname').val());
										sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTitle').attr('data-id'));
										sData += '&jobtitle=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPosition').val());
										sData += '&phone=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPhone').val());
										sData += '&fax=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFax').val());
										sData += '&mobile=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsMobile').val());
										sData += '&email=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEmail').val());
										sData += '&notes=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDescription').val());
										sData += '&rating=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsRating').attr('data-id'));
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

									if ($('#ns1blankspaceMainPersonal').html() != '')
									{
										sData += '&dateofbirth=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDateOfBirth').val());
										sData += '&numberofchildren=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsNumberOfChildren').val());
										sData += '&otherfamilydetails=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsOtherFamilyDetails').val());
									}	
									
									if ($('#ns1blankspaceMainBusiness').html() != '')
									{
										sData += '&contactbusiness=' + ns1blankspace.util.fs($('#ns1blankspaceBusiness').attr('data-id'));
									}
									else if (ns1blankspace.objectContext == -1)
									{
										if (ns1blankspace.data.contactBusiness) {sData += '&contactbusiness=' + ns1blankspace.util.fs(ns1blankspace.data.contactBusiness)};
									}		

									sData += ns1blankspace.extend.save();

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CONTACT_PERSON_MANAGE'),
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
													'<td id="ns1blankspaceContactPersonFavouriteColumn2" class="ns1blankspaceColumn1Large" style="width:200px;">' +
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
									var aHTML = [];
										
									aHTML.push('<table>');									
								
									aHTML.push('<tr><td class="ns1blankspaceTextMulti">' +
														'<textarea id="ns1blankspaceSMSMessage" name="message" rows="15" cols="5" style="width:175px; height:150px;" ' +
																' class="ns1blankspaceTextMulti"></textarea>' +
														'</td></tr>');
									
									aHTML.push('<tr><td>' +
													'<span id="ns1blankspaceSMSSend" class="ns1blankspaceAction">Send</span> ' +
													'<span id="ns1blankspaceSMSCancel" class="ns1blankspaceAction">Send</span>' +
													'</td></tr>');
															
									aHTML.push('</table>');

									
									$('#ns1blankspaceSMSContainer').html(aHTML.join(''));
	
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
									ns1blankspace.status.working('Sending SMS...');
									$('#ns1blankspaceSMSContainer').hide();

									var oData =
									{
										contactperson: ns1blankspace.objectContext,
										message: $('#ns1blankspaceSMSMessage').val()
									}

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('MESSAGING_SMS_SEND'),
										data: oData,
										dataType: 'json',
										success: function(data) 
										{
											ns1blankspace.status.message('SMS Sent');
										}
									});
								}			
				}
}														
