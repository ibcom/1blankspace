/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.setup.networkGroup = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = -1;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'networkGroup';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Network Groups';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.networkGroup.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
				},

	show:		function interfaceSetupNetworkGroupHomeShow(oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
						var h = -1;
									
						aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
						aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
										'<td id="tdInterfaceNetworkGroupHomeMostLikely" class="interfaceViewportMain">' +
										ns1blankspace.xhtml.loading + 
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMain').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
									
						aHTML[++h] = '<table>';
						aHTML[++h] = '<tr>' +
										'<td id="ns1blankspaceViewportSetupLarge" class="ns1blankspaceViewportImageLarge">' +
										'&nbsp;' + 
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';		
						
						$('#divInterfaceViewportControl').html(aHTML.join(''));	
						
						$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_NETWORK_GROUP_SEARCH';
						oSearch.addField('title');
						oSearch.rows = 10;
						oSearch.addSummaryField('count networkgroupcount')
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(function(data) {interfaceSetupNetworkGroupHomeShow(oParam, data)});	
					}
					else
					{
						var aHTML = [];
						var h = -1;
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML[++h] = '<table id="tableInterfaceNetworkGroupHomeMostLikely">';
							aHTML[++h] = '<tr class="trInterfaceNetworkGroupHomeMostLikely">';
							aHTML[++h] = '<td class="tdInterfaceNetworkGroupHomeMostLikelyNothing">Click New to create a network group.</td>';
							aHTML[++h] = '</tr>';
							aHTML[++h] = '</table>';
						}
						else
						{
							aHTML[++h] = '<table id="tableInterfaceNetworkGroupHomeMostLikely">';
							aHTML[++h] = '<tr>';
							aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
							aHTML[++h] = '</tr>';

							$.each(oResponse.data.rows, function()
							{	
								aHTML[++h] = '<tr class="interfaceMainRow">';
								
								aHTML[++h] = '<td id="interfaceNetworkGroupHomeMostLikely_Title-' + this.id + 
														'" class="interfaceHomeMostLikely">' +
														this.title +
														'</td>';
								
								aHTML[++h] = '</tr>'
							});
							
							aHTML[++h] = '</tbody></table>';
						}
						
						$('#tdInterfaceNetworkGroupHomeMostLikely').html(aHTML.join(''));
					
						$('td.interfaceHomeMostLikely').click(function(event)
						{
							interfaceSetupNetworkGroupSearch(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function interfaceSetupNetworkGroupSearch(sXHTMLElementId, iSource, sSearchText, sSearchContext)
								{
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
										
									if (iSource == undefined)
									{
										iSource = ns1blankspace.data.searchSource.text;
									}	
										
									if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
									{
										$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_NETWORK_GROUP_SEARCH';
										oSearch.addField('title');
										oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.getResults(function(data) {interfaceSetupNetworkGroupShow(data)});
									}
									else
									{
										var iMinimumLength = 3;
										var iMaximumColumns = 1;
										
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
											
											var sParam = 'method=SETUP_NETWORK_GROUP_SEARCH&quicksearch=' + sSearchText;

											$.ajax(
											{
												type: 'GET',
												url: '/ondemand/setup/?' + sParam,
												dataType: 'json',
												success: interfaceSetupNetworkGroupSearchShow
											});
										}
									};	
								},

					process:	function interfaceSetupNetworkGroupSearchShow(oResponse)
								{

									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
										
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspaceSearchStop();
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
											
											aHTML[++h] = '<td class="interfaceSearch" id="' +
															'-' + this.id + '">' +
															this.title + '</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML[++h] = '</tr>'
												iColumn = 0;
											}	
										});
								    	
										aHTML[++h] = '</tbody></table>';

										$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
										$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
										ns1blankspaceSearchStop();
										
										$('td.interfaceSearch').click(function(event)
										{
											$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
											$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
											interfaceSetupNetworkGroupSearch(event.target.id, 1);
										});
									}
								}
				},				

	layout: 	function interfaceSetupNetworkGroupViewport()
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
										
						aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlMembersAdd" class="interfaceViewportControl">Add Members</td>' +
										'</tr>';
					}
					
					aHTML[++h] = '</table>';					
								
					$('#divInterfaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainMembersAdd" class="divInterfaceViewportMain"></div>';
						
					$('#divInterfaceMain').html(aHTML.join(''));
						
					$('#tdInterfaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
						interfaceSetupNetworkGroupSummary();
					});
					
					$('#tdInterfaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
						interfaceSetupNetworkGroupDetails();
					});
					
					$('#tdInterfaceViewportControlMembersAdd').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainMembersAdd", true);
						interfaceSetupNetworkGroupMembersAdd();
					});	
				},

	show:		function interfaceSetupNetworkGroupShow(oResponse)
				{
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
					interfaceSetupNetworkGroupViewport();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find Network Group.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
					
						$('#divInterfaceViewportControlContext').html(ns1blankspace.objectContextData.title);
						
						aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
						aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
									'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainSummary').html(aHTML.join(''));
						$('#spanns1blankspaceViewportControlAction').button({disabled: false});
						$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});
						
						interfaceSetupNetworkGroupSummary();
					}	
				}		
						
	summary:	function interfaceSetupNetworkGroupSummary()
				{
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find Network Group.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
						aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryContactSynchronisation" class="interfaceMain">';
						
						if (ns1blankspace.objectContextData.contactsynchronisation == 'Y')
						{
							aHTML[++h] = 'Contact synchronisation is enabled.';
							//aHTML[++h] = '<br /><br />Updated member details are automatically sent to webmaster@rotarydistrict9800.com.au';
						}
						else
						{	
							aHTML[++h] = 'Contact synchronisation is disabled.'
						}	
						
						aHTML[++h] = '</td></tr></table>';					
						
						$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));
		
						$('#aInterfaceMainSummaryAddAttachment').click(function(event)
						{
							ns1blankspaceMainViewportShow("#divInterfaceMainAddMember");
							interfaceSetupNetworkGroupAddMember();
						});		
					}	
				},

	details: 	function interfaceSetupNetworkGroupDetails()
				{
					var aHTML = [];
					var h = -1;
					
					if ($('#divInterfaceMainDetails').html()  == ns1blankspace.xhtml.loading)
					{			
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
					
						aHTML[++h] = '<tr id="trInterfaceMainDetailsTitle" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
										'Title' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainText">' +
										'</td></tr>';
						
						aHTML[++h] = '<tr id="trInterfaceMainDetailsSharing" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsSharing" class="interfaceMain">' +
										'Contact Synchronisation' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsContactSynchronisation" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsContactSynchronisationValue" class="interfaceMainText">' +
										'<input type="radio" id="radioContactSynchronisationY" name="radioContactSync" value="Y"/>Enabled' +
										'<br /><input type="radio" id="radioContactSynchronisationN" name="radioContactSync" value="N"/>Disabled' +
										'</td></tr>';
									
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
							
						aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
					
						aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
										'Description' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
										'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
										'</td></tr>';
						
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputInterfaceMainDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('[name="radioContactSync"][value="' + ns1blankspace.objectContextData.contactsynchronisation + '"]').attr('checked', true);
						}
						
						$('#inputInterfaceMainDetailsStatus').keyup(function(event)
						{
							$('#divns1blankspaceViewportControlOptions').hide(200);
							ns1blankspaceElementOptionsSearch(event.target.id);
						});		
					}	
				},

	users:		function interfaceSetupNetworkGroupMembers()
				{
					var aHTML = [];
					var h = -1;
					
					if ($('#divInterfaceMainMembers').html() == ns1blankspace.xhtml.loading)
					{			
						aHTML[++h] = '<table id="tableInterfaceMainAttachments" class="interfaceMainDetails">';
						aHTML[++h] = '<tr id="trInterfaceMainAttachmentsRow1" class="interfaceMain">' +
										'<td style="width: 650px" id="tdInterfaceMainAttachmentsColumn1" class="interfaceMainColumn1">' +
										'</td>' +
										'<td id="tdInterfaceMainDetailsColumn2" class="interfaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainMembers').html(aHTML.join(''));
							
						$('#tdInterfaceMainMembersColumn1').html(ns1blankspace.xhtml.loading);
						ns1blankspaceAttachments("tdInterfaceMainMembersColumn1");
						
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
								
						aHTML[++h] = '<tr id="trInterfaceMainDetailsMembersAdd" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainDetailsMembersAdd" class="interfaceMainTextMulti">' +
										'<span id="spanInterfaceMainMembersAdd">Add</span>' +
										'</td></tr>';
										
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
						
						$('#spanInterfaceMainMembersAdd').button(
						{
							text: "Add"
						})
						.click(function() {
							ns1blankspaceMainViewportShow("#divInterfaceMainAddAttachment");
							interfaceSetupNetworkGroupAddMember();
						})
						
					}	
				},

	save: 		{
					send: 		function interfaceSetupNetworkGroupSave()
								{

									var sParam = 'method=SETUP_NETWORK_GROUP_MANAGE';
									var sData = '_=1';
									
									if (glObjectContext != -1)
									{
										sParam += '&id=' + glObjectContext	
									}	
									
									if ($('#divInterfaceMainDetails').html() != '')
									{
										sData += '&title=' + encodeURIComponent($('#inputInterfaceMainDetailsTitle').val());
										sData += '&contactsynchronisation=' + $('input[name="radioContactSync"]:checked').val();
									};

									$.ajax(
									{
										type: 'POST',
										url: '/ondemand/setup/?' + sParam,
										data: sData,
										dataType: 'text',
										success: function(data) 
													{ 
														var aReturn = data.split('|');
														glObjectContext = aReturn[2];
														glSetupContext = aReturn[2];
														ns1blankspaceStatus('Network Group Saved.');
														
														if ($('input[name="radioContactSync"]:checked').val() == 'Y')
														{
															interfaceSetupNetworkGroupMembersAddSyncProcess(gsParentWebMasterLogonName);
														}
													}
									});
										
								},

					add:		function interfaceSetupNetworkGroupMembersAdd(oResponse)
								{
									if (oResponse == undefined)
									{
										var aHTML = [];
										var h = -1;
												
										aHTML[++h] = '<table id="tableInterfaceMainAttachments" class="interfaceMainDetails">';
										aHTML[++h] = '<tr id="trInterfaceMainAttachmentsRow1" class="interfaceMain">' +
														'<td style="width: 650px" id="tdInterfaceMainAttachmentsColumn1" class="interfaceMainColumn1">' +
														'</td>' +
														'<td id="tdInterfaceMainAttachmentsColumn2" class="interfaceMainColumn2">' +
														'</td>' +
														'</tr>';
										aHTML[++h] = '</table>';					
										
										$('#divInterfaceMainMembersAdd').html(aHTML.join(''));
									
										var aHTML = [];
										var h = -1;

										aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
												
										aHTML[++h] = '<tr id="trInterfaceMainMembersAddContactBusiness" class="interfaceMain">' +
														'<td id="tdInterfaceMainMembersAddContactBusiness" class="interfaceMain">' +
														'Select the contact business from which to add members' +					
														'</td></tr>' +
														'<tr id="trInterfaceMainMembersAddContactBusinessValue" class="interfaceMainSelect">' +
														'<td id="tdInterfaceMainMembersAddContactBusinessValue" class="interfaceMainSelect">' +
														'<input id="inputInterfaceMainMembersAddContactBusiness" class="inputInterfaceMainSelect"' +
															' onDemandMethod="/ondemand/contact?rf=XML&method=CONTACT_BUSINESS_SEARCH' +
															' onDemandColumns="tradename">' +
														'</td></tr>';
										
										aHTML[++h] = '<tr id="trInterfaceMainMembersAddSyncUser" class="interfaceMain">' +
														'<td id="tdInterfaceMainMembersAddSyncUser" class="interfaceMain">' +
														'User (logon name) to send updates to' +
														'</td></tr>' +
														'<tr id="trInterfaceMainMembersAddSyncUserValue" class="interfaceMainText">' +
														'<td id="tdInterfaceMainMembersAddSyncUserValue" class="interfaceMainText">' +
														'<input id="inputInterfaceMainMembersAddSyncUser" class="inputInterfaceMainText">' +
														'</td></tr>';
														
										aHTML[++h] = '</table>';					
										
										$('#tdInterfaceMainAttachmentsColumn1').html(aHTML.join(''));
										
										var aHTML = [];
										var h = -1;
									
										aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
												
										aHTML[++h] = '<tr id="trInterfaceMainMembersAdd" class="interfaceMainTextMulti">' +
														'<td id="tdInterfaceMainMembersAdd" class="interfaceMainTextMulti">' +
														'<span id="spanInterfaceMainMembersAddAdd">Add</span>' +
														'</td></tr>';
									
										aHTML[++h] = '</table>';					
										
										$('#tdInterfaceMainAttachmentsColumn2').html(aHTML.join(''));
										
										$('#spanInterfaceMainMembersAddAdd').button(
										{
											text: "Add"
										})
										.click(function() 
										{
											var sParam = 'method=CONTACT_PERSON_SEARCH&rows=2&quicksearch=Auto';
											var sData = 'contactbusiness=' + $('#inputInterfaceMainMembersAddContactBusiness').attr("ondemandID");
										
											$.ajax(
											{
												type: 'POST',
												url: '/ondemand/contact/?' + sParam,
												data: sData,
												dataType: 'json',
												success: interfaceSetupNetworkGroupMembersAdd
											});
										});
									}
									else
									{
										if (oResponse.data.rows.length == 0)
										{
											
										}
										else
										{
											var aHTML = [];
											var h = -1;

											aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
													
											aHTML[++h] = '<tr id="trInterfaceMainMembersAdd" class="interfaceMainTextMulti">' +
															'<td id="tdInterfaceMainDetailsMembersAddStatus" class="interfaceMainTextMulti">' +
															ns1blankspace.xhtml.loadingSmall +
															' &nbsp;Adding members...'
															'</td></tr>';
											
											aHTML[++h] = '</table>';					
											
											$('#tdInterfaceMainAttachmentsColumn1').html(aHTML.join(''));
											
											$.each(oResponse.data.rows, function()
											{
												var sParam = 'method=SETUP_NETWORK_GROUP_MEMBER_MANAGE';
												var sData = 'networkgroup=' + glSetupContext;
												sData += '&usercontactperson=' +  this.id;
												
												$.ajax(
												{
													type: 'POST',
													url: '/ondemand/setup/?' + sParam,
													data: sData,
													async: false,
													dataType: 'text',
												});
											});
											
											$('#tdInterfaceMainDetailsMembersAddStatus').html('Users add to network group!');
											
											if ($('#inputInterfaceMainMembersAddSyncUser').val() != '')
											{
											
												var sParam = 'method=SETUP_NETWORK_GROUP_MEMBER_MANAGE';
												var sData = '_=1';
												
												sData += '&networkgroup=' + glSetupContext
												sData += '&userlogonname=' + encodeURIComponent($('#inputInterfaceMainMembersAddSyncUser').val());
												sData += '&sendalertwhenmemberupdated=Y';
												
												$.ajax(
												{
													type: 'POST',
													url: '/ondemand/setup/?' + sParam,
													data: sData,
													dataType: 'text',
													success: ns1blankspaceStatus('Users added.')
												});
											}
										}	
									}		
								}
				},

	new:		function interfaceSetupNetworkGroupNew(oXML)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					interfaceSetupNetworkGroupViewport();
					ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
					interfaceSetupNetworkGroupDetails();
				}
}				