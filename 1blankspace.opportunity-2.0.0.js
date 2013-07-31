/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.opportunity = 
{
	init: 		function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 35;	
					ns1blankspace.objectName = 'opportunity';
					ns1blankspace.viewName = 'Opportunities';
					ns1blankspace.data.contactBusiness = -1;
					ns1blankspace.data.contactPerson = -1;

					ns1blankspace.opportunity.data = {};
					ns1blankspace.opportunity.data.objectStatus = -1;
					
					var bShowHome = true;
					var bNew = false;
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
						if (oParam.showNew != undefined) {bNew = oParam.showNew}
						if (bNew) {ns1blankspace.opportunity.new()};
					}	

					ns1blankspace.app.set(oParam);
				},

	home: 		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspace">');

						aHTML.push('<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ins1blankspaceMain">' +
										ns1blankspace.xhtml.loading + '</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						var aHTML = [];
									
						aHTML.push('<table>' +
							'<tr><td><div id="ns1blankspaceViewContactLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>' +
							'</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'OPPORTUNITY_SEARCH';
						oSearch.addField('description,reference');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(function (data) {ns1blankspace.opportunity.home(oParam, data)});
						
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">' +
										'<tr><td class="ns1blankspaceNothing">' +
										'Click New to create a opportunity.</td></tr></table>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">' +
											'<tr><td colspan=2 class="ns1blankspaceCaption">MOST LIKELY</td></tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_reference-' + this.id + 
												'" class="ns1blankspaceMostLikely" style="width:90px;">' +
												this.reference + 
												'</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_orderdate-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
																		this.description + '</td>');

								aHTML.push('</tr>');

							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.opportunity.search.send(event.target.id, {source: 1})
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
										oSearch.method = 'OPPORTUNITY_SEARCH';
										
										oSearch.addField('reference,businessname,firstname,surname,' +
																	'requestbycontactbusiness,requestbycontactbusinesstext,' +
																	'requestbycontactperson,requestbycontactpersontext,type,typetext,' +
																	'createddate,source,sourcetext,sourcetext,manageruser,managerusertext,' +
																	'status,statustext,processingstatus,processingstatustext,' +
																	'processingdate,description,startdate,' +
																	'mailingaddress1,mailingsuburb,mailingstate,mailingpostcode,mailingcountry,' +
																	'email,mobile,phone,createddate,createdusertext');

										oSearch.addField(ns1blankspace.option.auditFields);
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);									
										oSearch.getResults(function(data){ns1blankspace.opportunity.show(oParam, data)}) 
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
											oSearch.method = 'OPPORTUNITY_SEARCH';
											
											oSearch.addField('businessname,firstname,surname,requestbycontactbusinesstext,status,statustext');
											
											if (iSource == ns1blankspace.data.searchSource.text)
											{	
												oSearch.addFilter('quicksearch', 'TEXT_IS_LIKE', sSearchText);
											}
											else
											{
												oSearch.addFilter('quicksearch', 'TEXT_STARTS_WITH', sSearchText);
											}
											
											ns1blankspace.search.advanced.addFilters(oSearch);
											
											oSearch.getResults(function(data){ns1blankspace.opportunity.search.process(oParam, data)}) 
										}
									}	
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
											
											aHTML.push('<td class="ns1blankspaceSearch ns1blankspaceOpportunity' + this.statustext + '" id="opportunity' +
															'-' + this.id + '">' +
															this.businessname + 
															'</td>');
											
											aHTML.push('<td class="ns1blankspaceSearch ns1blankspaceOpportunity' + this.statustext + '" id="opportunity' +
															'-' + this.id + '">' +
															this.firstname + ' ' + this.surname + '</td>');
															
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
											ns1blankspace.opportunity.search.send(event.target.id, {source: 1});
										});
										
										ns1blankspace.render.bind(
										{
											columns: 'businessname-firstname-surname',
											more: oResponse.moreid,
											rows: 15,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.opportunity.search.send
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
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">Details</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlContact" class="ns1blankspaceControl">Contact</td></tr>');
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">Summary</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">Details</td></tr>');

						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');
									
						aHTML.push('<tr><td id="ns1blankspaceControlContact" class="ns1blankspaceControl">Contact</td></tr>');
					
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
					aHTML.push('<div id="ns1blankspaceMainContact" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.opportunity.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.opportunity.details();
					});
					
					
					$('#ns1blankspaceControlContact').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainContact'});
						ns1blankspace.opportunity.contact();
					});
					
					$('#ns1blankspaceControlActions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainActions', refresh: true});
						ns1blankspace.actions.show();
					});
					
					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
						ns1blankspace.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments'});
					});
				},

	show: 		function (oParam, oResponse)
				{
					ns1blankspace.app.clean();
					ns1blankspace.opportunity.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this opportunity.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						ns1blankspace.data.contactBusiness = ns1blankspace.objectContextData.requestbycontactbusiness;
						ns1blankspace.data.contactPerson = ns1blankspace.objectContextData.requestbycontactperson;
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.reference);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.opportunity.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.opportunity.summary()'})
					}	
				},		
		
	summary: 	function ()
				{
					var aHTML = [];

					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this opportunity.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" style="width:100px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
					
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
						
						if (ns1blankspace.objectContextData.businessname != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Business</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryBusinessValue" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.businessname +
										'</td></tr>');
						}				
										
						if (ns1blankspace.objectContextData.firstname != '' || ns1blankspace.objectContextData.surname != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Contact</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryContact" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.firstname + ' ' + ns1blankspace.objectContextData.surname +
										'</td></tr>');
						}				
							
						if (ns1blankspace.objectContextData.processingstatustext != '')
						{	
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Processing Status</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryProcessingStatusValue" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.processingstatustext +
										'</td></tr>');											
						}
						
						if (ns1blankspace.objectContextData.statustext != '')
						{	
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Status</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryStatusValue" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.statustext +
										'</td></tr>');											
						}
						
						if (ns1blankspace.objectContextData.startdate != '')
						{	
							var oDate = Date.parse(ns1blankspace.objectContextData.startdate);

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Date Received</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryStartDate" class="ns1blankspaceSummary">' +
											oDate.toString("ddd, dd MMM yyyy") +
											'</td></tr>');
						}	

						if (ns1blankspace.objectContextData.description)
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryDescriptionValue" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>');
						}	
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						//ADD SEND EMAIL
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
						
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption">' +
										'Reference' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsReference" class="ns1blankspaceText">' +
										'</td></tr>');			

						aHTML.push('<trclass="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Date Received' +
										'</td></tr>' +
										'<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaptionDate">' +
										'<input id="ns1blankspaceDetailsDateReceived" class="ns1blankspaceDate">' +
										'</td></tr>');						
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Source of Contact' +
										'</td></tr>' +
										'<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaptionSelect">' +
										'<input id="ns1blankspaceDetailsSourceOfContact" class="ns1blankspaceSelect"' +
											' data-method="SETUP_OPPORTUNITY_SOURCE_OF_CONTACT_SEARCH">' +
										'</td></tr>');				
										
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Managed By' +
										'</td></tr>' +
										'<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaptionSelect">' +
										'<input id="ns1blankspaceDetailsManagedBy" class="ns1blankspaceSelect"' +
											' data-method="CORE_USER_SEARCH"'+ 
											' data-columns="firstname-space-surname">' +
										'</td></tr>');			
						
						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr>' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Open' +
										'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Closed' +
										'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Cancelled' +
										'</td></tr>');
						
						aHTML.push('</table>');

						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						$('input.ns1blankspaceDate').datepicker({ dateFormat: 'dd M yy' });

						var aHTML = [];
							
						aHTML.push('<table class="ns1blankspace">');
					
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspaceTextMulti">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="9" cols="35" id="ns1blankspaceDetailsDescription" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');

						aHTML.push('</table>');		
						
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#ns1blankspaceDetailsDateReceived').val(ns1blankspace.objectContextData.startdate);
							$('#ns1blankspaceDetailsSourceOfContact').attr(ns1blankspace.objectContextData.source);
							$('#ns1blankspaceDetailsSourceOfContact').val(ns1blankspace.objectContextData.sourcetext);
							$('#ns1blankspaceDetailsManagedBy').attr('data-id', ns1blankspace.objectContextData.manageruser);
							$('#ns1blankspaceDetailsManagedBy').val(ns1blankspace.objectContextData.managerusertext);
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.description);
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
						}
						else
						{
							$('#ns1blankspaceDetailsDateReceived').val(Date.today().toString("dd MMM yyyy"));
							$('#ns1blankspaceDetailsManagedBy').attr('data-id', ns1blankspace.user.id);
							$('#ns1blankspaceDetailsManagedBy').val(ns1blankspace.user.logonname);
							$('[name="radioStatus"][value="1"]').attr('checked', true);
						}
					}	
				},

	contact: 	function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainContact').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainContact').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceContactColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceContactColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' +
										'</table>');					
								
						$('#ns1blankspaceMainContact').html(aHTML.join(''));
						
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						if (ns1blankspace.objectContextData != undefined)
						{
							if (ns1blankspace.objectContextData.requestbycontactperson != '')
							{	
								//aHTML.push('<tr><td>');
								//aHTML.push('<span id="ns1blankspaceContactUpdate" class="ns1blankspaceAction">Update Contact');
								//aHTML.push('</span></td></tr>');

								aHTML.push('<tr><td>');
								aHTML.push('<span id="ns1blankspaceContactView" class="ns1blankspaceAction">View Contact');
								aHTML.push('</span></td></tr>');
							}	
							else
							{
								aHTML.push('<tr><td>');
								aHTML.push('<span id="ns1blankspaceContactCreate" class="ns1blankspaceAction">Create Contact</span></td></tr>');
								aHTML.push('</td></tr>');
							}
						}	
						aHTML.push('</table>');
						
						$('#ns1blankspaceContactColumn2').html(aHTML.join(''));
						
						$('#ns1blankspaceContactCreate').button(
						{
							label: 'Create as contact'
						})
						.click(function(event)
						{
							ns1blankspace.opportunity.contactCreate.send();		
						});

						$('#ns1blankspaceContactView').button(
						{
							label: 'View contact'
						})
						.click(function(event)
						{
							var iContactPerson = ns1blankspace.objectContextData.requestbycontactperson;	
							ns1blankspace.contactPerson.init({showHome: false, id: iContactPerson});
						});
							
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspace">');
										
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Business Name' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceContactBusinessName" class="ns1blankspaceText">' +
										'</td></tr>');				

						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'First Name' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceContactFirstName" class="ns1blankspaceText">' +
										'</td></tr>');			

						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Surname' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceContactSurname" class="ns1blankspaceText">' +
										'</td></tr>');
					
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Phone' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceContactPhone" class="ns1blankspaceText">' +
										'</td></tr>');						
					
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Mobile' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceContactMobile" class="ns1blankspaceText">' +
										'</td></tr>');			
						
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Email' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceContactEmail" class="ns1blankspaceText">' +
										'</td></tr>');			
						
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Mailing Address' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceContactMailingAddress1" class="ns1blankspaceText">' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Suburb' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceContactMailingSuburb" class="ns1blankspaceText">' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'State' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceContactMailingState" class="ns1blankspaceText">' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Post Code' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceContactMailingPostCode" class="ns1blankspaceText">' +
										'</td></tr>');				
										
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption">' +
										'Country' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceContactMailingCountry" class="ns1blankspaceText">' +
										'</td></tr>');						
										
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceContactColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceContactBusinessName').val(ns1blankspace.objectContextData.businessname);
							$('#ns1blankspaceContactFirstName').val(ns1blankspace.objectContextData.firstname);
							$('#ns1blankspaceContactSurname').val(ns1blankspace.objectContextData.surname);
							$('#ns1blankspaceContactPhone').val(ns1blankspace.objectContextData.phone);
							$('#ns1blankspaceContactMobile').val(ns1blankspace.objectContextData.mobile);
							$('#ns1blankspaceContactEmail').val(ns1blankspace.objectContextData.email);
							$('#ns1blankspaceContactMailingAddress1').val(ns1blankspace.objectContextData.mailingaddress1);
							$('#ns1blankspaceContactMailingSuburb').val(ns1blankspace.objectContextData.mailingsuburb);
							$('#ns1blankspaceContactMailingState').val(ns1blankspace.objectContextData.mailingstate);
							$('#ns1blankspaceContactMailingPostCode').val(ns1blankspace.objectContextData.mailingpostcode);
							$('#ns1blankspaceContactMailingCountry').val(ns1blankspace.objectContextData.mailingcountry);
						}
					}	
				},

	new: 		function ()
				{
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.opportunity.init();
					ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlActionOptions').button({disabled: true});
					ns1blankspace.opportunity.details();
				},

	save: 		{
					validate: 	function ()
								{
									if ($('#ns1blankspaceContactFirstName').val() != '' && $('#ns1blankspaceContactSurname').val() == '')
									{	
										ns1blankspace.status.error('Surname is mandatory for a Contact.');
										return false;
									}
								},
									
					send: 		function ()
								{
									if (ns1blankspace.opportunity.save.validate)
									{	
										ns1blankspace.status.working();

										var sData = 'id=';
										
										if (ns1blankspace.objectContext != -1)
										{
											sData += ns1blankspace.objectContext;
										} 
										
										if ($('#ns1blankspaceMainDetails').html() != '')
										{
											sData += '&startdate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDateReceived').val());
											sData += '&source=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSourceOfContact').attr('data-id'));
											sData += '&sourcenote=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSourceOfContactOther').val());
											if ($('#ns1blankspaceDetailsManagedBy').attr('data-id') != undefined)
											{
												sData += '&manageruser=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsManagedBy').attr('data-id'));	
											}
											else
											{
												sData += '&manageruser='+ ns1blankspace.user.id; 
											}

											sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());											
											sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDescription').val());
										}

										if ($('#ns1blankspaceContact').html() != '')
										{	
											sData += '&businessname=' + ns1blankspace.util.fs($('#ns1blankspaceContactBusinessName').val());
											sData += '&firstname=' + ns1blankspace.util.fs($('#ns1blankspaceContactFirstName').val());
											sData += '&surname=' + ns1blankspace.util.fs($('#ns1blankspaceContactSurname').val());
											sData += '&phone=' + ns1blankspace.util.fs($('#ns1blankspaceContactPhone').val());
											sData += '&mobile=' + ns1blankspace.util.fs($('#ns1blankspaceContactMobile').val());
											sData += '&email=' + ns1blankspace.util.fs($('#ns1blankspaceContactEmail').val());
											sData += '&mailingaddress1=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingAddress1').val());
											sData += '&mailingsuburb=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingSuburb').val());
											sData += '&mailingstate=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingState').val());
											sData += '&mailingpostcode=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingPostCode').val());
											sData += '&mailingcountry=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingCountry').val());
										}
										
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('OPPORTUNITY_MANAGE'),
											data: sData,
											dataType: 'json',
											success: this.process
										});
									}	
								},

					process: 	function (oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
										
										if (bNew) {ns1blankspace.opportunity.search.send('-' + ns1blankspace.objectContext)}
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}
				},				

	contactCreate: 	
				{	
					send: 		function (oParam)
								{
									var sData = '_=';
									var iStep = 1;

									if (!oParam) {oParam = {}}

									if (oParam.step != undefined) {iStep = oParam.step}		

									oParam.step = iStep;

									var aHTML = [];
									
									if (ns1blankspace.objectContextData == undefined)	
									{
										ns1blankspace.status.error('Please save the Opportunity');
									}
									else
									{
										ns1blankspace.data.contactPerson = ns1blankspace.objectContextData.requestbycontactperson;
										ns1blankspace.data.contactBusiness = ns1blankspace.objectContextData.requestbycontactbusiness;
									}

									if (iStep == 1) //BUSINESS
									{	
										var bContinue = false;

										if ($('#ns1blankspaceContact').html() != '')
										{	
											if ($('#ns1blankspaceContactBusinessName').val() != '')
											{		
												bContinue = true;									
												sData += '&tradename=' + ns1blankspace.util.fs($('#ns1blankspaceContactBusinessName').val());
												sData += '&mailingaddress1=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingAddress1').val());
												sData += '&mailingsuburb=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingSuburb').val());
												sData += '&mailingstate=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingState').val());
												sData += '&mailingpostcode=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingPostCode').val());
												sData += '&mailingcountry=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingCountry').val());
												sData += '&phonenumber=' + ns1blankspace.util.fs($('#ns1blankspaceContactPhone').val());
												sData += '&faxnumber=' + ns1blankspace.util.fs($('#ns1blankspaceContactFax').val());
											}
										}	
										else if (ns1blankspace.objectContextData.businessname != '')
										{
											bContinue = true;
											sData += '&tradename=' + ns1blankspacens1blankspace.util.fs(ns1blankspace.objectContextData.businessname);
											sData += '&mailingaddress1=' + ns1blankspacens1blankspace.util.fs(ns1blankspace.objectContextData.mailingaddress1);
											sData += '&mailingsuburb=' + ns1blankspacens1blankspace.util.fs(ns1blankspace.objectContextData.mailingsuburb);
											sData += '&mailingstate=' + ns1blankspacens1blankspace.util.fs(ns1blankspace.objectContextData.mailingstate);
											sData += '&mailingpostcode=' + ns1blankspacens1blankspace.util.fs(ns1blankspace.objectContextData.mailingpostcode);
											sData += '&mailingcountry=' + ns1blankspacens1blankspace.util.fs(ns1blankspace.objectContextData.mailingcountry);
											sData += '&phonenumber=' + ns1blankspacens1blankspace.util.fs(ns1blankspace.objectContextData.phone);
										}
											
										if (bContinue)
										{	
											sData += '&customerstatus=1';
											
											if (ns1blankspace.objectContextData.requestbycontactbusiness != '')	
											{
												sData += '&id=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.requestbycontactbusiness);
												oParam.successMessage = 'Updated';
											}
											else
											{
												oParam.successMessage = 'Added';
											}

											ns1blankspace.status.working();

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('CONTACT_BUSINESS_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
												{ 
													ns1blankspace.opportunity.contactCreate.process(oParam, data);
												}
											});
										}
										else
										{
											ns1blankspace.opportunity.contactCreate.send({step: 2});
										}	
										
									}

									if (iStep == 2) //PERSON
									{	
										sData = (ns1blankspace.objectContextData.requestbycontactbusiness != '')?'&contactbusiness=' + ns1blankspace.objectContextData.requestbycontactbusiness + '&primarycontact=1':'';

										var bContinue = false;

										if ($('#ns1blankspaceContact').html() != '')
										{		
											if ($('#ns1blankspaceContactSurname').val() != '')
											{
												bContinue = true;
												sData += '&firstname=' + ns1blankspace.util.fs($('#ns1blankspaceContactFirstName').val());
												sData += '&surname=' + ns1blankspace.util.fs($('#ns1blankspaceContactSurname').val());
												sData += '&jobtitle=' + ns1blankspace.util.fs($('#ns1blankspaceContactJobTitle').val());
												sData += '&streetaddress1=' + ns1blankspace.util.fs($('#ns1blankspaceContactStreetAddress1').val());
												sData += '&streetsuburb=' + ns1blankspace.util.fs($('#ns1blankspaceContactStreetSuburb').val());
												sData += '&streetstate=' + ns1blankspace.util.fs($('#ns1blankspaceContactStreetState').val());
												sData += '&streetpostcode=' + ns1blankspace.util.fs($('#ns1blankspaceContactStreetPostCode').val());
												sData += '&streetcountry=' + ns1blankspace.util.fs($('#ns1blankspaceContactStreetCountry').val());
												sData += '&mailingaddress1=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingAddress1').val());
												sData += '&mailingsuburb=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingSuburb').val());
												sData += '&mailingstate=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingState').val());
												sData += '&mailingpostcode=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingPostCode').val());
												sData += '&mailingcountry=' + ns1blankspace.util.fs($('#ns1blankspaceContactMailingCountry').val());
												sData += '&phone=' + ns1blankspace.util.fs($('#ns1blankspaceContactPhone').val());
												sData += '&mobile=' + ns1blankspace.util.fs($('#ns1blankspaceContactMobile').val());
												sData += '&email=' + ns1blankspace.util.fs($('#ns1blankspaceContactEmail').val());
												sData += '&faxnumber=' + ns1blankspace.util.fs($('#ns1blankspaceContactFax').val());
											}

										}	
										else if (ns1blankspace.objectContextData.surname != '')
										{
											bContinue = true;
											sData += '&firstname=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.firstname);
											sData += '&surname=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.surname);
											sData += '&mailingaddress1=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.mailingaddress1);
											sData += '&mailingsuburb=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.mailingsuburb);
											sData += '&mailingstate=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.mailingstate);
											sData += '&mailingpostcode=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.mailingpostcode);
											sData += '&mailingcountry=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.mailingcountry);
											sData += '&phone=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.phone);
											sData += '&mobile=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.mobile);
											sData += '&email=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.email);
										}

										if (bContinue)
										{	
											sData += '&customerstatus=1';		
												
											if (ns1blankspace.objectContextData.requestbycontactpersontext != '')	
											{
												sData += '&id=' +  ns1blankspace.util.fs(ns1blankspace.objectContextData.requestbycontactperson);
												sSuccessMessage = 'Updated';
											}
											else
											{
												sSuccessMessage = 'Added';
											}
											
											ns1blankspace.status.working();

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('CONTACT_PERSON_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
												{ 
													ns1blankspace.opportunity.contactCreate.process(oParam, data);
												}
											});
										}
										else
										{
											ns1blankspace.status.error('No contact details');
										}	
									}
								},

					process: 	function(oParam, oResponse) 
								{
									var sMessage = '';
									var sObject = '';
									var iStep = 1;

									if (oParam != undefined)
									{
										if (oParam.successMessage != undefined) {sMessage = oParam.successMessage}
										if (oParam.object != undefined) {sObject = oParam.object}
										if (oParam.step != undefined) {iStep = oParam.step}	
									}	

									if (oResponse.status == 'OK')
									{
										//ns1blankspace.status.message(sMessage);

										if (iStep == 1)
										{
											ns1blankspace.objectContextData.requestbycontactbusiness = oResponse.id;	
										}
										else
										{
											ns1blankspace.objectContextData.requestbycontactperson = oResponse.id;	
										}
										
										var sData = 'id=' + ns1blankspace.objectContext;

										if (ns1blankspace.objectContextData.requestbycontactbusiness != '')
										{
											sData += '&requestbycontactbusiness=' + ns1blankspace.objectContextData.requestbycontactbusiness;
										}

										if (ns1blankspace.objectContextData.requestbycontactperson != '')
										{
											sData += '&requestbycontactperson=' + ns1blankspace.objectContextData.requestbycontactperson;
										}	

										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('OPPORTUNITY_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data)
											{
												if (iStep == 1)
												{
													oParam.step = 2;
													ns1blankspace.opportunity.contactCreate.send(oParam)
												}
												else
												{
													ns1blankspace.status.message(sMessage);

													var aHTML = [];
					
													aHTML.push('<table class="ns1blankspaceColumn2">');

													aHTML.push('<tr><td>');
													aHTML.push('<span id="ns1blankspaceContactView" class="ns1blankspaceAction">View Contact');
													aHTML.push('</span></td></tr>');

													aHTML.push('</table>');
													
													$('#ns1blankspaceContactColumn2').html(aHTML.join(''));
													
													$('#ns1blankspaceContactView').button(
													{
														label: 'View contact'
													})
													.click(function(event)
													{
														var iContactPerson = ns1blankspace.objectContextData.requestbycontactperson;	
														ns1blankspace.contactPerson.init({showHome: false, id: iContactPerson});
													});
												}	
												
											}
										});
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}
				},				

	contactStatus:
				function (oResponse, asContactType, aiContactId)
				{	
					if (oResponse == undefined) {oResponse = '';}
					if (asContactType == undefined) { asContactType = '';}
					if (aiContactId == undefined) {aiContactId = -1;}
					
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CONTACT_' + asContactType.toUpperCase() + '_SEARCH';
						oSearch.addField( 'customerstatus');
						oSearch.addFilter('id', 'EQUAL_TO', aiContactId);
						oSearch.rf = 'json';
						oSearch.getResults(opportunity.contactStatus) 
					}
					else
					{	
						if (oResponse.data.rows.length != 0)
						{
							ns1blankspace.opportunity.data.objectStatus = oResponse.data.rows[0].customerstatus;
						}
						else
						{	ns1blankspace.opportunity.data.objectStatus = -1;	}	
					}	
				}
}				
