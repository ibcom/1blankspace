/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

$.extend(true, ns1blankspace.setup, 
{
	init: 		function interfaceSetupMasterViewport(oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
						if (oParam.method != undefined) {ns1blankspace.setup.method = oParam.method}
						if (oParam.viewName != undefined) {ns1blankspace.setup.name = oParam.viewName}	
					}

					ns1blankspace.object = -1;
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectName = 'setup';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = ns1blankspace.setup.name;
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);

					//???
					
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
					
					ns1blankspaceStatus('Click value to edit.')
					
					var oSearch = new AdvancedSearch();
					oSearch.method = gsSetupMethod + '_SEARCH';
					oSearch.addField('title');
					oSearch.rows = 100;
					oSearch.sort('title', 'asc');
					oSearch.getResults(function(data) {interfaceSetupHomeShow(oParam, data)});
				},

	home:		function interfaceSetupHomeShow(oParam, oResponse)
				{
					var aHTML = [];
					var h = -1;
								
					var aHTML = [];
					var h = -1;
								
					aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
					aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
									'<td id="tdInterfaceSetupHomeMostLikely" class="interfaceViewportMain">' +
									ns1blankspace.xhtml.loading + 
									'</td>' +
									'</tr>';
					aHTML[++h] = '</table>';					
					
					$('#divInterfaceMain').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;
					
					aHTML[++h] = '<table style="width:100%" border="0" cellspacing="0" cellpadding="0" id="tableInterfaceSetupHomeMostLikely">';
					aHTML[++h] = '<tbody>'
						
					aHTML[++h] = '<tr class="interfaceMainRow">';
					aHTML[++h] = '<td class="interfaceMainCaption">Title</td>';
					aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right"><span id="spanInterfaceSetupAdd">Add</span></td>';
					aHTML[++h] = '</tr>';
					
					if (oResponse.data.rows.length == 0)
					{
						aHTML[++h] = '<tr>';
						aHTML[++h] = '<td class="interfaceMainRowNothing">Nothing to show.</td>';
						aHTML[++h] = '<td></td>';
						aHTML[++h] = '</tr>';	
						$('#tdInterfaceProjectHomeMostLikely').html('Nothing to show.');
					}
					else
					{	
						$.each(oResponse.data.rows, function()
						{
							aHTML[++h] = '<tr class="interfaceMainRow">';
										
							aHTML[++h] = '<td id="tdSetup-' + this.id + 
											'" class="interfaceMainRow interfaceHomeMostLikely">' +
											this.title + '</td>';
							
							aHTML[++h] = '<td style="width:23px;text-align:right;" id="tdSetup_delete-' + this.id + 
											'" class="interfaceMainRowOptionsDelete"></td>';
							
							aHTML[++h] = '</tr>'
						});
					}

					aHTML[++h] = '</tbody></table>';

					$('#tdInterfaceSetupHomeMostLikely').html(aHTML.join(''));
						
					$('#spanInterfaceSetupAdd').button({
							text: false,
							 icons: {
								 primary: "ui-icon-plus"
							}
						})
						.click(function() {
							interfaceSetupAdd()
						})
						.css('width', '15px')
						.css('height', '20px')	
						
					$('td.interfaceHomeMostLikely').click(function(event)
					{
						interfaceSetupElementEditStart(event.target.id);
					});
					
					$('.interfaceMainRowOptionsDelete').button({
							text: false,
							 icons: {
								 primary: "ui-icon-close"
							}
						})
						.click(function() {
							interfaceSetupRemove(this.id)
						})
						.css('width', '15px')
						.css('height', '20px')
							
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
				},		
		
	add:		function interfaceSetupAdd()
				{
					var aHTML = [];
					var h = -1;
						
					aHTML[++h] = '<tr class="interfaceMainRow">';
										
					aHTML[++h] = '<td id="tdSetup-" class="interfaceMainRow interfaceHomeMostLikely"></td>';
					
					aHTML[++h] = '<td style="width:23px;text-align:right;" id="tdSetup_delete-' + 
									'" class="interfaceMainRowOptionsDelete"></td>';
					
					aHTML[++h] = '</tr>'
							
					$('#tableInterfaceSetupHomeMostLikely tr:first').after(aHTML.join(''));	
					$('#spanns1blankspaceViewportControlNew').button({disabled: true});
					$('#spanInterfaceSetupAdd').button({disabled: true});
					
					interfaceSetupElementEditStart("tdSetup-")
				},
	
	search: 	{
					send: 		function interfaceSetupSearch(sXHTMLElementId, iSource, sSearchText, sSearchContext)
								{
									
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
										
									if (sSearchContext != undefined)
									{
										glSetupContext = aSearch[1];
										var sParam = gsSetupMethod + '_SEARCH&rf=XML&id=' + glSetupContext;
										
										$.ajax(
										{
											type: 'GET',
											url: sParam,
											dataType: 'xml',
											success: interfaceSetupShow
										});
									}
									else
									{
									
										var iMinimumLength = 3;
										var iMaximumColumns = 1;
									
										if (iSource == undefined)
										{
											iSource = ns1blankspace.data.searchSource.text;
										}	
										
										if (sSearchText == undefined)
										{
											sSearchText = $('#inputns1blankspaceViewportControlSearch').val();
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
											
											ns1blankspaceOptionsSetPosition(sElementId);
											
											var sParam = gsSetupMethod + '_SEARCH&rf=XMLtitle=' + sSearchText;
																
											$.ajax(
											{
												type: 'GET',
												url: sParam,
												dataType: 'xml',
												success: interfaceSetupSearchShow
											});
											
										}
									};	
								}

					process:	function interfaceSetupSearchShow(oXML)
								{

									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
										
									var oRoot = oXML.getElementsByTagName('ondemand').item(0);
									
									if (oRoot.childNodes.length == 0)
									{
										$('#divns1blankspaceViewportControlOptions').hide();
									}
									else
									{
										var oRow = oRoot.childNodes.item(0);
										
										aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0">';
										aHTML[++h] = '<tbody>'
											
										for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
										{
											
											var oRow = oRoot.childNodes.item(iRow);
											
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML[++h] = '<tr class="interfaceSearch">';
											}
											
											aHTML[++h] = '<td class="interfaceSearch" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
															'-' + onDemandXMLGetData(oRow, "id") + '">' +
															onDemandXMLGetData(oRow, "title") + '</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML[++h] = '</tr>'
												iColumn = 0;
											}	
										}
								    	
										aHTML[++h] = '</tbody></table>';

										$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
										$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
										
										$('td.interfaceSearch').click(function(event)
										{
											$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
											$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
											interfaceSetupSearch(event.target.id, 1);
										});
									}	
											
								}
				},

	layout:		function interfaceSetupViewport()
				{
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
					
					aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
									
					aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
									'</tr>';
									
					aHTML[++h] = '</table>';					
						
					//$('#divInterfaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;
					
					aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain">&nbsp;</div>';
						
					$('#divInterfaceMain').html(aHTML.join(''));
						
					$('#tdInterfaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
						interfaceSetupDetails();
					})
				},

	show:		function interfaceSetupShow(oParam, oXML)
				{

					var iActionID = -1;
					var dStartDate = new Date();
					var dEndDate = dStartDate;
					var sXHTMLElementID;
					var iOffsetHeight = 5;
					var iOffsetLeft = 0;
					
					if (oParam != undefined)
					{
						if (oParam.setupObjectContextID != undefined) {iSetupObjectContextID = oParam.setupObjectContextID};
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID};
						if (oParam.offsetHeight != undefined) {iOffsetHeight = oParam.offsetHeight};
						if (oParam.offsetLeft != undefined) {iOffsetLeft = oParam.offsetLeft};
					}	

					if ($('#divns1blankspaceDialog').attr('data-initiator') == sXHTMLElementID)
					{
						$('#divns1blankspaceDialog').hide("slide", { direction: "up" }, 500);
						$('#divns1blankspaceDialog').attr('data-initiator', '');
					}
					else
					{
						$('#divns1blankspaceDialog').attr('data-initiator', sXHTMLElementID);
					
						if (iActionID != -1 && oXML == undefined)
						{
							var sParam = gsSetupMethod + '_SEARCH&rf=XML&rows=100';
							sParam += 'id=' + iSetupObjectContextID;
						
							$.ajax(
							{
								type: 'GET',
								url: '/ondemand/setup/?' + sParam,
								dataType: 'xml',
								success: function(data) {interfaceSetupShow(oParam, data)}
							});	
						}
						else
						{
							var aHTML = [];
							var h = -1;
							
							aHTML[++h] = '<table id="tablens1blankspaceActionAdd" class="interfaceDialogMedium">';
							
							aHTML[++h] = '<tr id="trInterfaceActionCalendarAddSubjectValue" class="interfaceMainText">' +
												'<td id="tdInterfaceActionCalendarAddSubjectValue" class="interfaceMainText">' +
												'<input onDemandType="TEXT" id="inputMasterActionAddSubject" class="inputInterfaceMainText';
												
							if (iActionID == -1)
							{	
								aHTML[++h] = ' ns1blankspaceWatermark" value="Subject">';
							}
							else
							{
								aHTML[++h] = '">'
							}
							
							aHTML[++h] = '</td></tr>';
							
							aHTML[++h] = '<tr><td id="tdns1blankspaceActionAddDescriptionValue" class="interfaceMain">' +
												'<textarea rows="5" cols="35" onDemandType="TEXTMULTI" id="inputns1blankspaceActionAddDescription" class="inputInterfaceMainTextMultiSmall';

							if (iActionID == -1)
							{	
								aHTML[++h] = ' ns1blankspaceWatermark">Add more text here, if required.</textarea>';
							}
							else
							{
								aHTML[++h] = '"></textarea>'
							}

							aHTML[++h] = '</td></tr>';

							aHTML[++h] = '<tr id="trns1blankspaceActionAddBusiness" class="interfaceMain">' +
												'<td id="tdns1blankspaceActionAddBusiness" class="interfaceMain">' +
												'Business' +
												'</td></tr>' +
												'<tr id="trns1blankspaceActionAddBusinessValue" class="interfaceMainSelect">' +
												'<td id="tdns1blankspaceActionAddBusinessValue" class="interfaceMainSelect">' +
												'<input onDemandType="SELECT" id="inputns1blankspaceActionAddBusiness" class="inputInterfaceMainSelect"' +
													' onDemandMethod="/ondemand/contact/?method=CONTACT_BUSINESS_SEARCH"' +
													' onDemandColumns="tradename">' +
												'</td></tr>';
												
							
							aHTML[++h] = '<tr id="trns1blankspaceActionAddPerson" class="interfaceMain">' +
												'<td id="tdns1blankspaceActionAddPerson" class="interfaceMain">' +
												'Person' +
												'</td></tr>' +
												'<tr id="trns1blankspaceActionAddPersonValue" class="interfaceMainSelect">' +
												'<td id="tdns1blankspaceActionAddPersonValue" class="interfaceMainSelect">' +
												'<input onDemandType="SELECT" id="inputns1blankspaceActionAddPerson" class="inputInterfaceMainSelectContact"' +
													' onDemandMethod="/ondemand/contact/?method=CONTACT_PERSON_SEARCH"' +
													' onDemandParent="inputns1blankspaceActionAddBusiness">' +
												'</td></tr>';									
												
												
							aHTML[++h] = '<tr><td id="tdns1blankspaceActionAddHighPriority" class="interfaceMain">' +
												'<input type="checkbox" id="inputns1blankspaceActionAddNoteHighPriority"/>&nbsp;High Priority?<td></tr>';
												
								
							aHTML[++h] = '<tr><td>';
							
								aHTML[++h] = '<table class="interfaceSearchFooterMedium">';
								
								aHTML[++h] = '<tr><td style="text-align: right;">' +
													'<span id="spanSave">Save</span>' +
													'<span id="spanCancel">Cancel</span>' +
													'<td></tr>';
								
								aHTML[++h] = '</table>';						

							aHTML[++h] = '</td></tr>';	
								
							aHTML[++h] = '</table>';		
							
							var oElement = $('#' + sXHTMLElementID)
							
							$('#divns1blankspaceDialog').html('');
							$('#divns1blankspaceDialog').show();
							$('#divns1blankspaceDialog').offset(
								{
									top: $(oElement).offset().top + $(oElement).height() + iOffsetHeight,
									left: $(oElement).offset().left + iOffsetLeft
								});
							$('#divns1blankspaceDialog').html(aHTML.join(''));
							
							$('#spanCancel').button(
								{
									text: false,
									 icons: {
										 primary: "ui-icon-close"
									}
								})
								.click(function() {
									$('#divns1blankspaceDialog').slideUp(500);
									$('#divns1blankspaceDialog').html('');
								})
								.css('width', '20px')
								.css('height', '20px')

							$('#spanSave').button(
								{
									text: false,
									 icons: {
										 primary: "ui-icon-check"
									}
								})
								.click(function() {
									interfaceActionQuickSave({
											id: iActionID,
											date: $.fullCalendar.formatDate(dStartDate, "dd MMM yyyy") + 
														' ' + $.fullCalendar.formatDate(dStartDate, "HH:mm"),
											endDate: $.fullCalendar.formatDate(dEndDate, "dd MMM yyyy") + 
														' ' + $.fullCalendar.formatDate(dEndDate, "HH:mm"),
											subject: $('#inputActionCalendarAddSubject').val(),
											description: $('#inputActionCalendarAddDescription').val(),
											priority: ($('#inputActionCalendarAddHighPriority').attr('checked')?3:2),
											calendarXHTMLElementID: 'divInterfaceMainCalendar'
											});
									
									$('#divns1blankspaceDialog').slideUp(500);
									$('#divns1blankspaceDialog').html('');

								})
								.css('width', '30px')
								.css('height', '20px')
							
							if (oXML != undefined)
							{
								var oRoot = oXML.getElementsByTagName('ondemand').item(0);
								
								if (oRoot.childNodes.length != 0)
								{
									var oRow = oRoot.childNodes.item(0);
									
									$('#inputActionCalendarAddSubject').val(onDemandXMLGetData(oRow, 'subject'));
									$('#inputActionCalendarAddDescription').val(onDemandXMLGetData(oRow, 'description'));
								}	
							}	
						}
					}
				},

	remove:		function interfaceSetupRemove(sXHTMLElementId)
				{
					var aSearch = sXHTMLElementId.split('-');
					var sElementId = aSearch[0];
					var sSearchContext = aSearch[1];
					
					if (confirm('Are you sure?'))
					{
						var aMethod = gsSetupMethod.split('_');
						var sEndpoint = aMethod[0];
						var sParam = '/ondemand/' + sEndpoint + '/?method=' + gsSetupMethod + '_MANAGE&remove=1';
						var sData = 'id=' + sSearchContext;
									
						$.ajax(
							{
								type: 'POST',
								url: sParam,
								data: sData,
								dataType: 'text',
								success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
							});
					}
				},

	edit: 		{
					start:		function interfaceSetupElementEditStart(sElementId)
								{
									var aSearch = sElementId.split('-');
									var sActionElementId = '#' + aSearch[0] + '-options-' + aSearch[2];

									if (1==0)
									{
										$('td.interfaceActionsOptions').button('destroy');
										
										$(sActionElementId).button(
										{
											icons: 
											{
												primary: "ui-icon-disk"
											}
										});
									}
									
									var sHTML = $('#' + sElementId).html();
									
									var sElementInputId = sElementId.replace('td', 'input');
									
									sHTML = '<input style="width:100%;" onDemandType="TEXT" id="' + sElementInputId + '" class="inputInterfaceMainValue" ' +
															'value="' + sHTML + '">'
									
									$('#' + sElementId).html(sHTML);
									$('#' + sElementInputId).focus();
									
									$('#' + sElementInputId).blur(function(event)
									{
										interfaceSetupElementEditStop(sElementId);
									});
								},

					stop:		function interfaceSetupElementEditStop(sElementId)
								{
									
									interfaceSetupElementEditSave(sElementId);
									
									var aSearch = sElementId.split('-');
									var sHTML = $('#' + sElementId.replace('td', 'input')).val();

									$('#' + sElementId).html(sHTML);

								},

					save:		function interfaceSetupElementEditSave(sElementId)
								{
									var aMethod = gsSetupMethod.split('_');
									var sEndpoint = aMethod[0];
									var aElement = sElementId.split('-');
									var sParam = '/ondemand/' + sEndpoint + '/?method=' + gsSetupMethod + '_MANAGE&id=' + aElement[1];
									sParam += '&title=' + $('#' + sElementId.replace('td', 'input')).val();
									
									if (aElement[1] == '' && $('#' + sElementId.replace('td', 'input')).val() == '')
									{
										$('#tableInterfaceSetupHomeMostLikely tr:first').next().fadeOut(500);	
										$('#spanns1blankspaceViewportControlNew').button({disabled: false});
										$('#spanInterfaceSetupAdd').button({disabled: false});
									}
									else
									{
										$.ajax(
										{
											type: 'POST',
											url: sParam,
											dataType: 'text',
											success: function(data) 
													{
														var aReturn = data.split('|');
														if (aReturn[2] == 'ADDED')
														{
															$('#tdSetup-').attr('id','tdSetup-' + aReturn[3]);
															
															$('td.interfaceHomeMostLikely').unbind('click');
																
															$('td.interfaceHomeMostLikely').click(function(event)
																{
																	interfaceSetupElementEditStart(event.target.id);
																});

															$('#tdSetup_delete-').attr('id','tdSetup_delete-' + aReturn[3]);
															
															$('.interfaceMainRowOptionsDelete').button({
																	text: false,
																	 icons: {
																		 primary: "ui-icon-close"
																	}
																})
																.click(function() {
																	interfaceSetupRemove(this.id)
																})
																.css('width', '15px')
																.css('height', '20px')
														}
														ns1blankspaceStatus('Saved')
														$('#spanns1blankspaceViewportControlNew').button({disabled: false});
														$('#spanInterfaceSetupAdd').button({disabled: false});
													}
										});
									}			
								}
				}
});								