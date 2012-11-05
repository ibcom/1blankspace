/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.contactPerson = 
{
	init: 		function (oParam)
				{
					ns1blankspace.object = 32;	
					ns1blankspace.objectName = 'ContactPerson';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'People';
					
					var bShowHome = true;
					var bNew = false;
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
						if (oParam.showNew != undefined) {bNew = oParam.showNew}
						if (oParam.contactBusiness != undefined) {ns1blankspace.data.contactBusiness = oParam.contactBusiness}
						if (oParam.contactBusinessText != undefined) {ns1blankspace.data.contactBusinessText = oParam.contactBusinessText}
						if (bNew) {ns1blankspace.contactPerson.new()};
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
				},

	home: 		function (oResponse)
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

						aHTML.push('<tr><td id="ns1blankspaceViewContactLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');
								
						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlFavourites" class="ns1blankspaceControl">Favourites</td>' +
										'</tr>');			
								
						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlByGroup" class="ns1blankspaceControl">Groups</td>' +
										'</tr>');	
									
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						$('#ns1blankspaceControlByGroup').click(function(event)
						{
							ns1blankspace.show({refresh: true});
							ns1blankspace.contactPerson.groups.show();
						});
							
						$('#ns1blankspaceControlFavourites').click(function(event)
						{
							ns1blankspace.show({refresh: true});
							ns1blankspace.contactPerson.favourites.show({xhtmlElementID: "divInterfaceMain"});
						});
						
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CONTACT_PERSON_SEARCH';		
						oSearch.addField('firstname,surname');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(ns1blankspace.contactPerson.home());	
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a person contact.</td></tr>' +
											'</table>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceCaption">MOST LIKELY</td></tr>');

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
								{v
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
										$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'CONTACT_PERSON_SEARCH';
										oSearch.addField('firstname,surname,contactbusiness,contactbusinesstext,title,titletext,position,workphone,fax,mobile,email,' +
																 'customerstatus,customerstatustext,primarycontactfor,gender,gendertext,' +
																 'streetaddress1,streetaddress2,streetsuburb,streetstate,streetpostcode,streetcountry,' +
																 'mailingaddress1,mailingaddress2,mailingsuburb,mailingstate,mailingpostcode,mailingcountry');
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
											ns1blankspace.dialog.position({xhtmlElementID: sElementId});
											ns1blankspace.search.start();
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'CONTACT_PERSON_SEARCH';
											oSearch.addField('firstname,surname');
											
											if (iSource == ns1blankspace.data.searchSource.browse)
											{
												oSearch.addFilter('quicksearch', 'STRING_STARTS_WITH', sSearchText);
											}
											else
											{	
												oSearch.addFilter('quicksearch', 'STRING_IS_LIKE', sSearchText);
											}	
											
											oSearch.rows = 15;
											oSearch.rf = 'json';
											oSearch.getResults(function(data) {ns1blankspace.search.process(oParam, data)});
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
											ns1blankspace.pagination.init(
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
											interfaceContactPersonSearch(event.target.id, {source: 1});
										});
										
										ns1blankspace.pagination.bind(
										{
											columns: 'firstname-surname',
											more: oResponse.moreid,
											rows: 15,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: oResponse.contactPerson.search.send
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
										
						aHTML.push('<tr><td id="ns1blankspaceControlAddress" class="ns1blankspaceControl">' +
										'Address</td></tr>');				
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceAddress" class="ns1blankspaceControl">' +
										'Address</td></tr>');
					
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
									
						aHTML.push('<tr><td id="ns1blankspaceAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');
					}
							
					aHTML.push('</table>');					
						
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAddress" class="ns1blankspaceControlMain"></div>');
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
					
					$('#ns1blankspaceControlAddress').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAddress'});
						ns1blankspace.contactPerson.address();
					});
					
					$('#ns1blankspaceControlUser').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainUser', refresh: true});
						ns1blankspace.contactPerson.user();
					});
					
					$('#ns1blankspaceControlGroups').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainGroups', refresh: true});
						ns1blankspace.contactPerson.groups.show();
					});
					
					$('#ns1blankspaceControlBusiness').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainBusiness' , refresh: true});
						ns1blankspace.contactPerson.groups.business();
					});
					
					$('#ns1blankspaceControlActions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceActions', refresh: true});
						
						if ($('#ns1blankspaceDetailsFirstName').val() != undefined)
						{
							ns1blankspace.contactPersonText = $('#ns1blankspaceDetailsFirstName').val() + ' ' + $('#ins1blankspaceDetailsSurname').val();
						}
						
						ns1blankspace.actions.show({
											xhtmlElementID: 'ns1blankspaceActions',
											contactPerson: ns1blankspace.objectContext, 
											contactPersonText: ns1blankspace.contactPersonText,
											contactBusiness: ns1blankspace.contactBusiness, 
											contactBusinessText: ns1blankspace.contactBusinessText,
											object: '',
											objectContext: ''
											});
					});
					
					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
						ns1blankspace.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments'});
					});
					
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
						
						ns1blankspace.contactBusiness = ns1blankspace.objectContextData.contactbusiness;
						ns1blankspace.contactBusinessText = ns1blankspace.objectContextData.contactbusinesstext
						ns1blankspace.contactPersonText = ns1blankspace.objectContextData.firstname + ' ' + ns1blankspace.objectContextData.surname;
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.firstname + 
									'<br />' + ns1blankspace.objectContextData.surname);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.contactPerson.init({showHome: false});ns1blankspace.contactPerson.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.object({functionDefault: 'ns1blankspace.contactPerson.summary()'});
					}	
				},	
		
	summary: 	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this contact.</td></tr></table>');
								
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
					
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspaceColumn1">');
						
						if (ns1blankspace.objectContextData.workphone != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Phone</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryPhone" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.workphone +
										'</td></tr>');
						}

						if (ns1blankspace.objectContextData.mobile != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Mobile</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryMobile" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.mobile +
										'</td></tr>');
						}				
						
						if (ns1blankspace.objectContextData.email != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Email</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryEmail" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.email +
										'</td></tr>');
						}				
								
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));		 
					}	
				},

	details: 	function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
					{
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
										'Email' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsEmail" class="ns1blankspaceText">' +
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
							$('#ns1blankspaceDetailsFirstName').val(ns1blankspace.objectContextData.firstname);
							$('#ns1blankspaceDetailsSurname').val(ns1blankspace.objectContextData.surname);
							$('#ns1blankspaceDetailsTitle').attr('data-id', ns1blankspace.objectContextData.title);
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.titletext);
							$('#ns1blankspaceDetailsPosition').val(ns1blankspace.objectContextData.position);
							$('#ns1blankspaceDetailsPhone').val(ns1blankspace.objectContextData.workphone);
							$('#ns1blankspaceDetailsMobile').val(ns1blankspace.objectContextData.mobile);
							$('#ns1blankspaceDetailsFax').val(ns1blankspace.objectContextData.fax);
							$('#ns1blankspaceDetailsEmail').val(ns1blankspace.objectContextData.email);
						}
						
						$('#ns1blankspaceDetailsTitle').keyup(function(event)
						{
							$(ns1blankspace.xhtml.container).hide(200);
							ns1blankspace.search.send(event.target.id);
						});
					}	
				},

	address: 	function ()
				{
					var aHTML = [];
			
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
						
						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Street' +
										'</td></tr>');
								
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Address' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressStreetAddress1" class="ns1blankspaceText">' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Suburb' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressStreetSuburb" class="ns1blankspaceText">' +
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
										'<td class="ns1blankspace">' +
										'Country' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressStreetCountry" class="ns1blankspaceText">' +
										'</td></tr>');						
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceAddressColumn1').html(aHTML.join(''));

						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Mailing' +
										'</td></tr>');
								
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Address' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressStreetAddress1" class="ns1blankspaceText">' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Suburb' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceAddressMailingSuburb" class="ns1blankspaceText">' +
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
						}
					}	
				},

	contactBusiness: function ()
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
											' data-method="/ondemand/contact/?rf=XML&method=CONTACT_BUSINESS_SEARCH"' +
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
						}
						else
						{
							$('#ns1blankspaceBusiness').attr('data-id', ns1blankspace.contactBusiness);
							$('#ns1blankspaceBusiness').val(ns1blankspace.contactBusinessText);
						}
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
							
						if (ns1blankspace.objectContextData.contactbusiness != '')
						{	
							aHTML.push('<tr><td class="ns1blankspace">' +
										'<a href="#" id="ns1blankspaceBusinessView">View&nbsp;Business</a>' +
										'</td></tr>');
						}
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceBusinessColumn2').html(aHTML.join(''));	
						
						$('#ns1blankspaceBusinessColumn2BusinessView').click(function(event)
						{
							ns1blankspace.contactBusiness.init({showHome: false});
							ns1blankspace.contactBusiness.search.show('-' + ns1blankspace.objectContextData.contactbusiness, {source: 1});
						});
					}	
				},

	new: 		function ()
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspace.contactPerson.init();
					ns1blankspace.show({selector: '#divInterfaceMainDetails'});
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlActionOptions').button({disabled: true});
					ns1blankspace.contactPerson.details();
				},

	save: 		{
					send: 		function ()
								{
									var sData = 'id=';
									
									if (ns1blankspace.objectContext != -1)
									{
										sData += ns1blankspace.objectContext;
									} 
									
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&firstname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFirstName').val());
										sData += '&surname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSurname').val());
										sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTitle').attr('onDemandID'));
										sData += '&jobtitle=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPosition').val());
										sData += '&phone=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPhone').val());
										sData += '&fax=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFax').val());
										sData += '&mobile=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsMobile').val());
										sData += '&email=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEmail').val());
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
										
										if (bNew) {ns1blankspace.contactPerson.search.send('-' + ns1blankspace.objectContext)}
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}
				},				

	user: 		{
					show: 		function (oParam, oResponse)
								{

									var iObject = ns1blankspace.object;
									var iObjectContext = ns1blankspace.objectContext;
									
									if (oParam != undefined)
									{
										if (oParam.object != undefined || iObject == '') {iObject = oParam.object}
										if (oParam.objectName != undefined) {sObjectName = oParam.objectName}
									}

									if (oResponse == undefined)
									{
										var sData = 'contactperson=' + iObjectContext;
									
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/setup/?method=SETUP_USER_SEARCH',
											dataType: 'json',
											data: sData,
											success: function(data) {this.show(oParam, data)}
										});

									}
									else
									{	
										var aHTML = [];
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table class="ns1blankspace">');
												
											var sUserName = oResponse.username;
											sUserName = sUserName.replace('@' + msOnDemandSiteId, '');
											
											aHTML.push('<tr>' +
														'<td class="ns1blankspace">' +
														'This person already has access as ' +
														sUserName);
														
											if (oResponse.lastlogondatetime != '&nbsp;')
											{	
												aHTML.push(' and last logged on ' +
														oResponse.lastlogondatetime +
														'.</td></tr>');
											}
											else
											{
												aHTML.push('.</td></tr>');
											}	
														
											aHTML.push('</table>');					
										
											$('#ns1blankspaceMainUser').html(aHTML.join(''));
										}
										else
										{
										
											var aHTML = [];

											aHTML.push('<table class="ns1blankspace">');
													
											aHTML.push('<tr>' +
															'<td>' +
															'<span id="ns1blankspaceUserRegister">Register As User Now</span>' +
															'</td></tr>');
															
											aHTML.push('</table>');					
											
											$('#ns1blankspaceMainUser').html(aHTML.join(''));
											
											$('#ns1blankspaceUserRegister').button(
											{
												text: "Register As User Now"
											})
											.click(function() {
												ns1blankspace.contactPerson.user.add();
											});
										}
									}
								},	

					add: 		function (sResponse)
								{
									if (sResponse == undefined)
									{
										$('#ns1blankspaceUser').html(ns1blankspace.xhtml.loading);
										
										var sParam = 'method=REGISTER_ADD_USER';
										sParam += '&site=' + msOnDemandSiteId;
										
										var sData = 'ContactPersonperson=' + ns1blankspace.objectContext;
										//sData += '&ContactPersonbusiness=' + aResponse[4];
										sData += '&uselogonsuffix=1&logonsuffix=' + encodeURIComponent('@' + msOnDemandSiteId);
										sData += '&networkgroup=' + glNetworkGroupId; 
										
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/register/?' + sParam,
											data: sData,
											dataType: 'json',
											success: ns1blankspace.contactPerson.user.add
										});
									}		
									else
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspace">');
												
										var sUserName = oResponse.username;
										sUserName = sUserName.replace('@' + msOnDemandSiteId, '');
											
										aHTML.push('<tr><td>' +
														'User set up as ' +
														sUserName +
														' with initial password of ' +
														oResponse.initialpassword +
														'.</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainUser').html(aHTML.join(''));
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
										var oSearch = new AdvancedSearch();
										oSearch.method = 'CONTACT_PERSON_GROUP_SEARCH';
										oSearch.addField('contactperson,contactpersontext,group,grouptext');
										oSearch.addFilter('contactperson', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.rows = 100;
										oSearch.sort('grouptext', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.contactPerson.groups.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceContactPersonGroupsColumn1" class="ns1blankspaceColumn1Large"></td>' +
													'<td id="ns1blankspaceContactPersonGroupsColumn2" style="width: 100px;" class="ns1blankspaceColumn2Action"></td>' +
													'</tr>' +
													'</table>');				
										
										$('#ns1blankspaceMainGroups').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspace">');
										
										aHTML.push('<tr><td class="ns1blankspace">' +
														'<span id="ns1blankspaceContactPersonGroupsAdd">Add Group</span>' +
														'</td></tr>');
															
										aHTML.push('</table>');					
										
										$('#ns1blankspaceContactPersonGroupsColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceContactPersonGroupsAdd').button(
										{
											label: "Add Group"
										})
										.click(function() {
											ns1blankspace.dialog.position(
											{
												xhtmlElementID: 'ns1blankspaceContactPersonGroupsAdd',
												leftOffset: -50,
												topOffset: -280
											});
											ns1blankspace.contactPerson.groups.add(oParam);
										})
										.css('width', '75px')
										
										var aHTML = [];
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">' +
															'<tr><td class="ns1blankspaceNothing">No groups.</td></tr>' +
															'</table>');

											$('#ns1blankspaceContactPersonGroupsColumn1').html(aHTML.join(''));		
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

											$('#ns1blankspaceContactPersonGroupsColumn1').html(aHTML.join(''));
											
											$('.ns1blankspaceGroupsRemove').button( {
												text: false,
												 icons: {
													 primary: "ui-icon-close"
												}
											})
											.click(function() {
												ns1blankspace.contactPerson.groups.remove(this.id)
											})
											.css('width', '15px')
											.css('height', '20px')
										}
										
									}	
								},

					add: 		function (oParam, oResponse)
								{
										
									if ($(ns1blankspace.xhtml.container).attr('data-initiator') == 'ns1blankspaceContactPersonGroupsAdd')
									{
										$(ns1blankspace.xhtml.container).slideUp(500);
										$(ns1blankspace.xhtml.container).attr('data-initiator', '');
									}
									else
									{
										if (oResponse == undefined)
										{
											$.ajax(
											{
												type: 'GET',
												url: '/ondemand/setup/?method=SETUP_CONTACT_PERSON_GROUP_SEARCH',
												dataType: 'json',
												success: function(data){ns1blankspace.contactPerson.groups.add(oParam, data)}
											});
										}
										else
										{
											
											$(ns1blankspace.xhtml.container).attr('data-initiator', 'ns1blankspaceContactPersonGroupsAdd')
											
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
												aHTML.push('<table class="ns1blankspaceSearchMedium" style="font-size:0.725em;">');
												
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
													ns1blankspace.contactPerson.groups.select(event.target.id);
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
									
									var sData = 'contactperson=' + ns1blankspace.objectContext +
												'&group=' + sSearchContext;
												
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CONTACT_PERSON_GROUP_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data){ns1blankspace.contactPerson.groups.search.show()}
									});
										
								},

					remove: 	function (sXHTMLElementID)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sSearchContext = aSearch[1];
									var sData = 'remove=1&id=' + sSearchContext;
												
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CONTACT_PERSON_GROUP_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data){$('#' + sXHTMLElementID).parent().fadeOut(500)}
									});
										
								},					

					search: 	{
									show: 		function (oParam, oResponse)
												{
													var sXHTMLElementID = 'divInterfaceMain';
													var sLabel = "groups";
													var iOption = 1;
													
													if (oParam != undefined)
													{
														if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
													}

													if (oResponse == undefined)
													{
														$.ajax(
														{
															type: 'GET',
															url: ns1blankspace.util.endpointURI('SETUP_CONTACT_PERSON_GROUP_SEARCH'),
															dataType: 'json',
															success: function(data) {ns1blankspace.contactPerson.search.show(oParam, data)}
														});
													}
													else
													{
														var aHTML = [];
														
														aHTML.push('<table class="ns1blankspaceContainer">' +
																	'<tr class="ns1blankspaceContainer">' +
																	'<td id="ns1blankspaceContactPersonByGroupColumn1" style="width:150px;border-right-style:solid;border-width:2px;border-color:#B8B8B8;padding-right:15px;">' +
																	'</td>' +
																	'<td id="ns1blankspaceContactPersonByGroupColumn2" class="ns1blankspaceColumn1Large" style="padding-left:15px;">' +
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

															$('#ns1blankspaceContactPersonByGroupColumn1').html(aHTML.join(''));
														}
														else
														{
															aHTML.push('<table>');
															
															$.each(oResponse.data.rows, function()
															{
																aHTML.push('<tr class="interfaceMainRow">' +
																				'<td id="ns1blankspaceContactPersonByGroup_title-' + this.id +
																				'-' + this.title +
																				'" class="ns1blankspaceRowSelect ns1blankspaceRowSelectByGroup">' +
																				this.title + '</td></tr>');
															});
															
															aHTML.push('</table>');

															$('#ns1blankspaceContactPersonByGroupColumn1').html(aHTML.join(''));
																		
															$('td.ns1blankspaceRowSelectByGroup').click(function(event)
															{
																ns1blankspace.contactPerson.groups.search.process({xhtmlElementID: event.target.id});
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
														$('#ns1blankspaceContactPersonByGroupColumn2').html(ns1blankspace.xhtml.loading);
														
														var oSearch = new AdvancedSearch();
														oSearch.method = 'CONTACT_PERSON_GROUP_SEARCH';
														oSearch.addField('contactperson,persongroup.contactperson.firstname,persongroup.contactperson.surname,group,grouptext');
														oSearch.addFilter('group', 'EQUAL_TO', aXHTMLElementId[1]);
														oSearch.sort('persongroup.contactperson.firstname', 'asc');
														oSearch.sort('persongroup.contactperson.surname', 'asc');
														oSearch.getResults(function(data) {ns1blankspace.contactPerson.groups.search.process(oParam, data)});
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
															aHTML.push('<table class="ns1blankspace">');
										
															aHTML.push('<tr class="ns1blankspaceCaption">' + 
																			'<td colspan=2 class="ns1blankspaceCaption">' + aXHTMLElementId[2] + '</td>' +
																			'</tr>');
															
															$.each(oResponse.data.rows, function()
															{
																aHTML.push(ns1blankspace.contactPerson.groups.search.row(this));
															});
															
															aHTML.push('</table>');
														}
														
														ns1blankspace.pagination.list(
														{
															xhtmlElementID: 'ns1blankspaceContactPersonByGroupColumn2',
															xhtmlContext: 'ContactPersonGroupsContacts',
															xhtml: aHTML.join(''),
															showMore: (oResponse.data.morerows == "true"),
															more: oResponse.moreid,
															rows: ns1blankspace.option.defaultRows,
															functionShowRow: ns1blankspace.contactPerson.groups.search.row,
															functionNewPage: 'ns1blankspace.contactPerson.groups.search.bind()',
															type: 'json'
														}); 	
														
														ns1blankspace.contactPerson.groups.search.bind();
													}	
												},	

									row: 		function (oRow)
												{
													var aHTML = [];
													
													aHTML.push('<tr class="ns1blankspaceRow">');
										
													aHTML.push('<td id="ns1blankspaceContactPersonGroup_firstname-' + oRow.contactperson + '" class="ns1blankspaceRow">' +
																			oRow["persongroup.contactperson.firstname"] + '</td>');
																			
													aHTML.push('<td id="ns1blankspaceContactPersonGroup_surname-' + oRow.contactperson + '" class="ns1blankspaceRow">' +
																			oRow["persongroup.contactperson.surname"]+ '</td>');
																			
													aHTML.push('<td id="ns1blankspaceContactPersonGroup-' + oRow.contactperson + '" class="ns1blankspaceRowSelect ns1blankspaceContactPersonGroupRowSelect">&nbsp;</td>');						
													
													aHTML.push('</tr>');
																
													return aHTML.join('');
												},

									bind: 		function ()
												{
													$('.ns1blankspaceContactPersonGroupRowSelect').button( {
																text: false,
																icons: {
																	primary: "ui-icon-play"
																}
													})
													.click(function() {
														ns1blankspace.contactPerson.init({showHome: false});
														ins1blankspace.contactPerson.search.send(this.id)
													})
													.css('width', '15px')
													.css('height', '20px')
												}
								}
				},								

	favourites: {
						search: {
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
																	'<td id="ns1blankspaceContactPersonFavouriteColumn1" style="width:150px;border-right-style:solid;border-width:2px;border-color:#B8B8B8;padding-right:15px;">' +
																	'</td>' +
																	'<td id="ns1blankspaceContactPersonFavouriteColumn2" class="ns1blankspaceColumn1Large" style="padding-left:15px;">' +
																	'</td>' +
																	'</tr>' +
																	'</table>');				
														
														$('#ns1blankspaceMain').html(aHTML.join(''));

														$('#ns1blankspaceContactPersonFavouriteColumn2').html(ns1blankspace.xhtml.loading);
														
														var oSearch = new AdvancedSearch();
														oSearch.method = 'CONTACT_PERSON_SEARCH';
														oSearch.addField('firstname,surname');
														oSearch.addFilter('', 'IS_FAVOURITE', '');
														oSearch.rows = 20;
														oSearch.sort('firstname', 'asc');
														oSearch.getResults(function(data) {ns1blankspace.contactPerson.favourites.search.show(oParam, data)});	
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
															aHTML.push('<table class="ns1blankspace">');
															aHTML.push('<tr class="ns1blankspaceCaption">');
															aHTML.push('<td class="ns1blankspaceCaption">First Name</td>');
															aHTML.push('<td class="ns1blankspaceCaption">Last Name</td>');
															aHTML.push('</tr>');
															
															$.each(oResponse.data.rows, function() {
															
																aHTML.push(ns1blankspace.contactPerson.favourites.row(this));
															});
															
															aHTML.push('</table>');
														}
														
														ns1blankspacePaginationList(
														{
															xhtmlElementID: sXHTMLElementID,
															xhtmlContext: 'ContactFavourites',
															xhtml: aHTML.join(''),
															showMore: (oResponse.morerows == "true"),
															more: oResponse.moreid,
															rows: ns1blankspace.option.defaultRows,
															functionShowRow: ns1blankspace.contactPerson.favourites.row,
															functionNewPage: 'ns1blankspace.contactPerson.favourites.bind()',
															type: 'json'
														}); 	
														
														ns1blankspace.contactPerson.favourites.bindd();
													}	
												},	

									row: 		function (oRow)
												{
													var aHTML = [];
												
													aHTML.push('<tr class="ns1blankspaceRow">');
																			
													aHTML.push('<td id="ns1blankspaceFavourites_firstname-' + oRow.id + '" class="ns1blankspaceRow">' +
																			oRow.firstname + '</td>');
																			
													aHTML.push('<td id="ns1blankspaceFavourites_firstname-' + oRow.id + '" class="ns1blankspaceRow">' +
																			oRow.surname + '</td>');
																			
													aHTML.push('<td id="ns1blankspaceFavourites-' + oRow.id + '" class="ns1blankspaceRowSelect ns1blankspaceFavouritesRowSelect">&nbsp;</td>');						
													
													aHTML.push('</tr>');
																
													return aHTML.join('');
												},

									bind: 		function ()
												{
													$('.ns1blankspaceFavouritesRowSelect').button( {
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
												}	
								}
				}
}														
