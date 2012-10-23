/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 

ns1blankspace.supportIssue = 
{
	init: 		function interfaceSupportIssueMasterViewport(oParam)
				{

					ns1blankspace.object = 8;
					ns1blankspace.objectName = 'Support Issue';
					ns1blankspace.objectContextDataXML = '';
					ns1blankspace.objectContext = -1;

					var bShowHome = true;
					var bNew = false;

					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
						if (oParam.showNew != undefined) {bNew = oParam.showNew}
						if (bNew) {interfaceSupportIssueNew()};
					}	

					ns1blankspaceReset();

					if (bShowHome)
					{
						ns1blankspaceViewportDestination({
							newDestination: 'interfaceSupportIssueMasterViewport({showHome: true});',
							move: false
							})		
					}

					$('#divns1blankspaceViewportControlSet').button(
					{
						label: "Support Issue"
					});

					$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
					{
						if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
				        ns1blankspace.timer.delayCurrent = setTimeout("interfaceSupportIssueSearch('inputns1blankspaceViewportControlSearch')", ns1blankspace.option.typingWait);
					});

					$('#spanns1blankspaceViewportControlSearch').click(function(event)
					{
						interfaceSupportIssueSearch('inputns1blankspaceViewportControlSearch');
					});

					$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
					{
						interfaceSupportIssueSearchOptions();
					});

					$('#spanns1blankspaceViewportControlNew').click(function(event)
					{
						interfaceSupportIssueNew();
					})

					$('#spanns1blankspaceViewportControlNewOptions').click(function(event)
					{
						interfaceSupportIssueNewOptions();
					});

					$('#spanns1blankspaceViewportControlAction').click(function(event)
					{
						interfaceSupportIssueSave();
					});

					$('#spanns1blankspaceViewportControlAction').button({disabled: true});

					$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});

					$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
					{
						interfaceSupportIssueSetupOptions();
					});

					$('#spanns1blankspaceViewportControlHelpOptions').click(function(event)
					{
						interfaceSupportIssueHelp();
					});

					$('td.interfaceViewportMasterControlBrowse').click(function(event)
					{
						interfaceSupportIssueSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
					});

					$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
					{
						interfaceSupportIssueSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
					});

					$('#divInterfaceViewportControl').html('');	
					if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
					if (bNew) 
					{
						interfaceSupportIssueNew();
					}
					else
					{
						if (bShowHome) {interfaceSupportIssueHomeShow()};
					}
				},

	home: 		function interfaceSupportIssueHomeShow(oXML)
				{

					if (oXML == undefined)
					{
						var aHTML = [];
						var h = -1;

						aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
						aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
										'<td id="tdInterfaceHomeMostLikely" class="interfaceViewportMain">' +
										ns1blankspace.xhtml.loading + 
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					

						$('#divInterfaceMain').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;

						aHTML[++h] = '<table>';
						aHTML[++h] = '<tr>' +
										'<td id="ns1blankspaceViewportHelpLarge" class="ns1blankspaceViewportImageLarge">' +
										'&nbsp;' + 
										'</td>' +
										'</tr>';

						//aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						//			'<td id="tdInterfaceViewportControlHistory" class="interfaceViewportControl">Past Issues</td>' +
						//			'</tr>';	

						aHTML[++h] = '</table>';		

						$('#divInterfaceViewportControl').html(aHTML.join(''));	

						$('#tdInterfaceViewportControlByHistory').click(function(event)
						{
							ns1blankspaceMainViewportShow("#divInterfaceMain", true);
							interfaceSupportIssueHistory("divInterfaceMain");
						});

						$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);

						var sParam = 'method=SUPPORT_ISSUE_SEARCH&byme=1&status=1,2,6&rows=30';

						$.ajax(
						{
							type: 'GET',
							url: '/ondemand/support/?rf=XML&' + sParam,
							dataType: 'xml',
							success: interfaceSupportIssueHomeShow
						});
					}
					else
					{
						var aHTML = [];
						var h = -1;

						var oRoot = oXML.getElementsByTagName("ondemand").item(0);

						if (oRoot.childNodes.length == 0)
						{
							aHTML[++h] = '<table id="tableInterfaceSupportIssueHomeMostLikely">';
							aHTML[++h] = '<tr class="trInterfaceHomeMostLikely">';
							aHTML[++h] = '<td class="tdInterfaceHomeMostLikelyNothing">Click New to create a support issue.</td>';
							aHTML[++h] = '</tr>';
							aHTML[++h] = '</table>';
						}
						else
						{
							aHTML[++h] = '<table id="tableInterfaceSupportIssueHomeMostLikely">';
							aHTML[++h] = '<tr>';
							aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
							aHTML[++h] = '</tr>';

							for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
							{
								var oRow = oRoot.childNodes.item(iRow);

								aHTML[++h] = '<tr class="interfaceMainRow">';

								aHTML[++h] = '<td id="interfaceHomeMostLikely_Title-' + onDemandXMLGetData(oRow, "id") + 
														'" class="interfaceHomeMostLikely">' +
														onDemandXMLGetData(oRow, "reference") + ', ' +
														onDemandXMLGetData(oRow, "subject") +
														'</td>';

								aHTML[++h] = '</tr>'
							}

								aHTML[++h] = '</tbody></table>';
						}

						$('#tdInterfaceHomeMostLikely').html(aHTML.join(''));

						$('td.interfaceHomeMostLikely').click(function(event)
						{
							interfaceSupportIssueSearch(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function interfaceSupportIssueSearch(sXHTMLElementId, oParam)
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
										$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);

										ns1blankspace.objectContext = sSearchContext;

										var sParam = 'method=SUPPORT_ISSUE_SEARCH&byme=1&id=' + sSearchContext

										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/support/?rf=XML&' + sParam,
											dataType: 'xml',
											success: function(data) {interfaceSupportIssueShow(oParam, data)}
										});
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

											var sParam = 'method=SUPPORT_ISSUE_SEARCH&subject=' + sSearchText
											if (iSource == ns1blankspace.data.searchSource.text)
											{
												sParam += '&byme=1&status=1,2,6';
											}
											
											$.ajax(
											{
												type: 'GET',
												url: '/ondemand/support/?rf=XML&' + sParam,
												dataType: 'xml',
												success: function(data) {interfaceSupportIssueSearchShow(oParam, data)}
											});
										}
									};	
								}

					process:	function interfaceSupportIssueSearchShow(oParam, oXML)
								{

									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
									var oRoot = oXML.getElementsByTagName('ondemand').item(0);

									if (oRoot.childNodes.length == 0)
									{
										ns1blankspaceSearchStop();
										$('#divns1blankspaceViewportControlOptions').hide();
									}
									else
									{
										var oRow = oRoot.childNodes.item(0);

										aHTML[++h] = '<table class="interfaceSearchMedium">';
										aHTML[++h] = '<tbody>'
										var sClass = "";

										for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
										{

											var oRow = oRoot.childNodes.item(iRow);

											iColumn = iColumn + 1;

											if (iColumn == 1)
											{
												aHTML[++h] = '<tr class="interfaceSearch">';
											}
											
											if (onDemandXMLGetData(oRow, "status") == "3" ||  onDemandXMLGetData(oRow, "status") == "4" || onDemandXMLGetData(oRow, "status") == "5")
											{	sClass = " interfaceInactive";	}

											aHTML[++h] = '<td class="interfaceSearch' + sClass + '" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
															'-' + onDemandXMLGetData(oRow, "id") + '">' +
															onDemandXMLGetData(oRow, "reference") + 
															'</td>';

											aHTML[++h] = '<td class="interfaceSearch' + sClass + '" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
															'-' + onDemandXMLGetData(oRow, "id") + '">' +
															onDemandXMLGetData(oRow, "subject") + '</td>';

											if (iColumn == iMaximumColumns)
											{
												aHTML[++h] = '</tr>'
												iColumn = 0;
											}	
										}
								    	
										aHTML[++h] = '</tbody></table>';

										$('#divns1blankspaceViewportControlOptions').html(
											ns1blankspacePagination(
											{
												html: aHTML.join(''),
												more: ($(oRoot).attr('morerows') == "true")
											}) 
										);		

										$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);

										ns1blankspaceSearchStop();

										$('td.interfaceSearch').click(function(event)
										{
											$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
											$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
											interfaceSupportIssueSearch(event.target.id, {source: 1});
										});

										ns1blankspacePaginationBind(
										{
											columns: 'firstname-surname',
											more: $(oRoot).attr('moreid'),
											rows: 15,
											startRow: parseInt($(oRoot).attr('startrow')) + parseInt($(oRoot).attr('rows')),
											functionSearch: interfaceSupportIssueSearch,
											functionClass: interfaceSupportIssueSearchClass
										});   

									}	
								},

					class:		function interfaceSupportIssueSearchClass()
								{
									var sClass = '';
									
									if (onDemandXMLGetData(oRow, "status") == "3" ||  onDemandXMLGetData(oRow, "status") == "4" || onDemandXMLGetData(oRow, "status") == "5")	
									{
										sClass = ' interfaceInactive';
									}
									
									return sClass;
								}
				},			

	layout:		function interfaceSupportIssueViewport()
				{

					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';

					aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';

					if (ns1blankspace.objectContext != -1)
					{
						aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl';
						aHTML[++h] = ' interfaceViewportControlHighlight';
						aHTML[++h] = '">Summary</td></tr>';
					}

					aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl '
					aHTML[++h] = (ns1blankspace.objectContext==-1)?'interfaceViewportControlHighlight':'';
					aHTML[++h] = '">Details</td></tr>';

					if (ns1blankspace.objectContext != -1)
					{
						aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
										'</tr>';
					}

					aHTML[++h] = '</table>';					

					$('#divInterfaceViewportControl').html(aHTML.join(''));

					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';

					$('#divInterfaceMain').html(aHTML.join(''));

					$('#tdInterfaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
						interfaceSupportIssueSummary();
					});

					$('#tdInterfaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
						interfaceSupportIssueDetails();
					});

					$('#tdInterfaceViewportControlAttachments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainAttachments", true);
						ns1blankspaceAttachments({xhtmlElementID: 'divInterfaceMainAttachments'});
					});
				},

	show:		function interfaceSupportIssueShow(oParam, oXML)
				{
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
					interfaceSupportIssueViewport();

					ns1blankspace.objectContextDataXML = oXML;

					var aHTML = [];
					var h = -1;

					oRoot = oXML.getElementsByTagName('ondemand').item(0);

					if (oRoot.childNodes.length == 0)
					{
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find support issue.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';

						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						var oRow = oRoot.childNodes.item(0);

						$('#divInterfaceViewportControlContext').html(onDemandXMLGetData(oRow, 'reference'));
						$('#spanns1blankspaceViewportControlAction').button({disabled: false});
						$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});

						ns1blankspaceViewportDestination({
							newDestination: 'interfaceSupportIssueMasterViewport({showHome: false});interfaceSupportIssueSearch("-' + ns1blankspace.objectContext + '")',
							move: false
							})

						ns1blankspaceObjectViewportHistory({functionDefault: 'interfaceSupportIssueSummary()'})
					}	
				},	

	summary:	function interfaceSupportIssueSummary()
				{

					var aHTML = [];
					var h = -1;
					var oXML = ns1blankspace.objectContextDataXML;

					oRoot = oXML.getElementsByTagName('ondemand').item(0);

					if (oRoot.childNodes.length == 0)
					{
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this support issue.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';

						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						var oRow = oRoot.childNodes.item(0);

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

						if (onDemandXMLGetData(oRow, 'subject') != '')
						{

							aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryCreatedDate" class="interfaceMainSummary">Date Lodged</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryCreatedDateValue" class="interfaceMainSummaryValue">' +
										onDemandXMLGetData(oRow, 'createddate') +
										'</td></tr>';

							aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySubject" class="interfaceMainSummary">Subject</td></tr>' +
										'<tr><td id="tdInterfaceMainSummarySubjectValue" class="interfaceMainSummaryValue">' +
										onDemandXMLGetData(oRow, 'subject') +
										'</td></tr>';

							if (onDemandXMLGetData(oRow, 'solution') != '')
							{	
								aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySolution" class="interfaceMainSummary">Solution</td></tr>' +
										'<tr><td id="tdInterfaceMainSummarySolutionValue" class="interfaceMainSummaryValue">' +
										onDemandXMLGetData(oRow, 'solution') +
										'</td></tr>';			
							}				

							if (onDemandXMLGetData(oRow, 'description') != '')
							{	
								aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
										onDemandXMLGetData(oRow, 'description') +
										'</td></tr>';			
							}			
						}	

						aHTML[++h] = '</table>';					

						$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));
					}	
				},

	details: 	function interfaceSupportIssueDetails()
				{
					var aHTML = [];
					var h = -1;

					oRoot = ns1blankspace.objectContextDataXML.getElementsByTagName('ondemand').item(0);

					if ($('#divInterfaceMainDetails').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainDetails').attr('onDemandLoading', '');

						var oRow = oRoot.childNodes.item(0);

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

						aHTML[++h] = '<tr id="trInterfaceMainDetailsSubject" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsSubject" class="interfaceMain">' +
										'Subject' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsSubjectValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsSubjectValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsSubject" class="inputInterfaceMainText">' +
										'</td></tr>';

						aHTML[++h] = '<tr id="trInterfaceMainDetailsUser" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsUser" class="interfaceMain">' +
										'Send To' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsUserValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsUserValue" class="interfaceMainRadio">' +
										ns1blankspace.xhtml.loadingSmall +
										'</td></tr>';	

						aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
										'Description' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
										'<textarea style="width: 100%;" rows="10" cols="35" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
										'</td></tr>';	


						aHTML[++h] = '<tr id="trInterfaceMainDetailsName" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsName" class="interfaceMain">' +
										'Best Contact Name' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsNameValue" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainDetailsNameValue" class="interfaceMainTextMulti">' +
										'<input id="inputInterfaceMainDetailsName" class="inputInterfaceMainText">' +
										'</td></tr>';	

						aHTML[++h] = '<tr id="trInterfaceMainDetailsEmail" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsEmail" class="interfaceMain">' +
										'Email' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsEmailValue" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainDetailsEmailValue" class="interfaceMainTextMulti">' +
										'<input id="inputInterfaceMainDetailsEmail" class="inputInterfaceMainText">' +
										'</td></tr>';	

						aHTML[++h] = '<tr id="trInterfaceMainDetailsPhone" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsPhone" class="interfaceMain">' +
										'Phone' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsPhoneValue" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainDetailsPhoneValue" class="interfaceMainTextMulti">' +
										'<input id="inputInterfaceMainDetailsPhone" class="inputInterfaceMainText">' +
										'</td></tr>';		

						aHTML[++h] = '</table>';					

						$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));

						interfaceSupportIssueGetUsers();

						var aHTML = [];
						var h = -1;

						aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';

						aHTML[++h] = '<tr id="trInterfaceMainDetailsType" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsType" class="interfaceMain">' +
										'Type' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsType" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsTypeValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioType1" name="radioType" value="1"/>Help Required' +
										'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Suggestion' +
										'<br /><input type="radio" id="radioType3" name="radioType" value="3"/>General Comment' +
										'</td></tr>';

						aHTML[++h] = '<tr id="trInterfaceMainDetailsSeverity" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsSeverity" class="interfaceMain">' +
										'Severity' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsSeverity" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsSeverityValue" class="interfaceMainRadio">' +
										'<input type="radio" id="radioSeverity0" name="radioSeverity" value="0"/>Critical' +
										'<br /><input type="radio" id="radioSeverity1" name="radioSeverity" value="1"/>Urgent' +
										'<br /><input type="radio" id="radioSeverity2" name="radioSeverity" value="2"/>Routine' +
										'<br /><input type="radio" id="radioSeverity3" name="radioSeverity" value="3"/>Non-Critical' +
										'<br /><input type="radio" id="radioSeverity4" name="radioSeverity" value="4"/>Not Sure' +
										'</td></tr>';


						aHTML[++h] = '</table>';					

						$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

						if (oRoot.childNodes.length != 0)
						{
							$('#inputInterfaceMainDetailsSubject').val(onDemandXMLGetData(oRow, 'subject'));
							$('#inputInterfaceMainDetailsDescription').val(onDemandXMLGetData(oRow, 'description'));
							$('#inputInterfaceMainDetailsName').val(onDemandXMLGetData(oRow, 'name'));
							$('#inputInterfaceMainDetailsEmail').val(onDemandXMLGetData(oRow, 'email'));
							$('#inputInterfaceMainDetailsPhone').val(onDemandXMLGetData(oRow, 'phone'));

							$('[name="radioType"][value="' + onDemandXMLGetData(oRow, 'type') + '"]').attr('checked', true);
							$('[name="radioSeverity"][value="' + onDemandXMLGetData(oRow, 'severity') + '"]').attr('checked', true);
							$('[name="radioUser"][value="' + onDemandXMLGetData(oRow, 'user') + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioType"][value="1"]').attr('checked', true);
							$('[name="radioSeverity"][value="0"]').attr('checked', true);
							$('[name="radioUser"]').first().attr('checked', true);
							interfaceSupportIssueGetContact();
						}

					}	
				},

	new:		function interfaceSupportIssueNew(oXML)
				{
					ns1blankspace.objectContext = -1;
					ns1blankspace.objectContextDataXML = oXML;
					interfaceSupportIssueViewport();
					ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
					interfaceSupportIssueDetails();	
				},

	save: 		{
					send:		function interfaceSupportIssueSave()
								{

									var sParam = 'method=SUPPORT_ISSUE_MANAGE'
									var sData = '';

									if (ns1blankspace.objectContext != -1)
									{
										sData += '&id=' + ns1blankspace.objectContext;
									} 

									if ($('#divInterfaceMainDetails').html() != '')
									{
										sData += '&subject=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsSubject').val());
										sData += '&description=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsDescription').val());
										sData += '&name=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsName').val());
										sData += '&email=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsEmail').val());
										sData += '&phone=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsPhone').val());
										sData += '&user=' + $('input[name="radioUser"]:checked').val();
										sData += '&type=' + $('input[name="radioType"]:checked').val();
										sData += '&severity=' + $('input[name="radioSeverity"]:checked').val();
									}

									if (sData != '')
									{
										if (sData.slice(0,1) == '&') {sData = sData.replace('&', '')}
									
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/support/?' + sParam,
											data: sData,
											dataType: 'json',
											success: interfaceSupportIssueSaveProcess
										});
										
									}
									else
									{
										ns1blankspaceStatus('Saved');
									}	
										
								},

					process;			function interfaceSupportIssueSaveProcess(oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspaceStatus('Saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
										
										if (bNew) {interfaceSupportIssueSearch('-' + ns1blankspace.objectContext)}
									}
									else
									{
										ns1blankspaceStatus(oResponse.error.errornotes);
										ns1blankspaceConfirm( {html: [oResponse.error.errornotes]
																   , title: 'Save error!'});
									}
								}
				}				

	getUsers:	function interfaceSupportIssueGetUsers(oParam, oXML)
				{
					var sXHTMLElementId = 'tdInterfaceMainDetailsUserValue';

					if (oParam != undefined)
					{
						if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
					}

					if (oXML == undefined)
					{
						var sParam = 'method=SUPPORT_ISSUE_USER_SEARCH';

						$.ajax(
						{
							type: 'GET',
							url: '/ondemand/support/?rf=XML',
							data: sParam,
							dataType: 'xml',
							async: false,
							success: function(data){interfaceSupportIssueGetUsers(oParam, data)}
						});
					}
					else
					{

						var aHTML = [];
						var h = -1;

						var oRoot = oXML.getElementsByTagName("ondemand").item(0);

						if (oRoot.childNodes.length == 0)
						{
							aHTML[++h] = '<table>';
							aHTML[++h] = '<tr class="interfaceMainCaption">' +
												'<td class="interfaceMainRowNothing">No users to log issue against!</td></tr>';
							aHTML[++h] = '</tbody></table>';
						}
						else
						{		

							for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
							{
								var oRow = oRoot.childNodes.item(iRow);

								aHTML[++h] = '<input type="radio" id="radioUser' + onDemandXMLGetData(oRow, "id") + '"' +
													' name="radioUser" value="' + onDemandXMLGetData(oRow, "id") + '">' +
													onDemandXMLGetData(oRow, "contactfirstname") + ' ' + onDemandXMLGetData(oRow, "contactsurname")	+ '<br />';

							}

						}

						$('#' + sXHTMLElementId).html(aHTML.join(''));
					}	
				},	

	getContact:	function interfaceSupportIssueGetContact(oParam, oResponse)
				{
					var sXHTMLElementNameID = 'inputInterfaceMainDetailsName';
					var sXHTMLElementEmailID = 'inputInterfaceMainDetailsEmail';

					if (oParam != undefined)
					{
						if (oParam.xhtmlElementNameID != undefined) {sXHTMLElementNameID = oParam.xhtmlElementNameID}
						if (oParam.xhtmlElementEmailID != undefined) {sXHTMLElementEmailID = oParam.xhtmlElementEmailID}
					}

					if (oResponse == undefined)
					{
						var sParam = 'method=CORE_GET_USER_DETAILS';

						$.ajax(
						{
							type: 'GET',
							url: '/ondemand/core/?rf=JSON',
							data: sParam,
							dataType: 'json',
							success: function(data){interfaceSupportIssueGetContact(oParam, data)}
						});
					}
					else
					{
						$('#' + sXHTMLElementNameID).val(oResponse.firstname + ' ' + oResponse.surname);
						$('#' + sXHTMLElementEmailID).val(oResponse.email);
					}	
				}
}					
