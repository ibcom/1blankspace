/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 

ns1blankspace.supportIssue = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = -1;
					ns1blankspace.objectName = 'supportIssue';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Support Issues';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.supportIssue.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
				},

	home: 		function ns1blankspaceSupportIssueHomeShow(oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
						

						aHTML.push('<table id="tablens1blankspaceViewportMain" class="ns1blankspaceViewportMain">';
						aHTML.push('<tr id="trns1blankspaceViewportMain" class="ns1blankspaceViewportMain">' +
										'<td id="tdns1blankspaceHomeMostLikely" class="ns1blankspaceViewportMain">' +
										ns1blankspace.xhtml.loading + 
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					

						$('#divns1blankspaceMain').html(aHTML.join(''));

						var aHTML = [];
						

						aHTML.push('<table>';
						aHTML.push('<tr>' +
										'<td id="ns1blankspaceViewportHelpLarge" class="ns1blankspaceViewportImageLarge">' +
										'&nbsp;' + 
										'</td>' +
										'</tr>';

						//aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
						//			'<td id="tdns1blankspaceViewportControlHistory" class="ns1blankspaceViewportControl">Past Issues</td>' +
						//			'</tr>';	

						aHTML.push('</table>';		

						$('#divns1blankspaceViewportControl').html(aHTML.join(''));	

						$('#tdns1blankspaceViewportControlByHistory').click(function(event)
						{
							ns1blankspaceMainViewportShow("#divns1blankspaceMain", true);
							ns1blankspaceSupportIssueHistory("divns1blankspaceMain");
						});

						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

						var sParam = 'method=SUPPORT_ISSUE_SEARCH&byme=1&status=1,2,6&rows=30';

						$.ajax(
						{
							type: 'GET',
							url: '/ondemand/support/?rf=XML&' + sParam,
							dataType: 'xml',
							success: ns1blankspaceSupportIssueHomeShow
						});
					}
					else
					{
						var aHTML = [];
						

						var oRoot = oXML.getElementsByTagName("ondemand").item(0);

						if (oRoot.childNodes.length == 0)
						{
							aHTML.push('<table id="tablens1blankspaceSupportIssueHomeMostLikely">';
							aHTML.push('<tr class="trns1blankspaceHomeMostLikely">';
							aHTML.push('<td class="tdns1blankspaceHomeMostLikelyNothing">Click New to create a support issue.</td>';
							aHTML.push('</tr>';
							aHTML.push('</table>';
						}
						else
						{
							aHTML.push('<table id="tablens1blankspaceSupportIssueHomeMostLikely">';
							aHTML.push('<tr>';
							aHTML.push('<td class="ns1blankspaceMain">MOST LIKELY</td>';
							aHTML.push('</tr>';

							for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
							{
								var oRow = oRoot.childNodes.item(iRow);

								aHTML.push('<tr class="ns1blankspaceMainRow">';

								aHTML.push('<td id="ns1blankspaceHomeMostLikely_Title-' + onDemandXMLGetData(oRow, "id") + 
														'" class="ns1blankspaceHomeMostLikely">' +
														onDemandXMLGetData(oRow, "reference") + ', ' +
														onDemandXMLGetData(oRow, "subject") +
														'</td>';

								aHTML.push('</tr>'
							}

								aHTML.push('</tbody></table>';
						}

						$('#tdns1blankspaceHomeMostLikely').html(aHTML.join(''));

						$('td.ns1blankspaceHomeMostLikely').click(function(event)
						{
							ns1blankspaceSupportIssueSearch(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function ns1blankspaceSupportIssueSearch(sXHTMLElementId, oParam)
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
										$('#divns1blankspaceViewportControl').html(ns1blankspace.xhtml.loading);

										ns1blankspace.objectContext = sSearchContext;

										var sParam = 'method=SUPPORT_ISSUE_SEARCH&byme=1&id=' + sSearchContext

										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/support/?rf=XML&' + sParam,
											dataType: 'xml',
											success: function(data) {ns1blankspaceSupportIssueShow(oParam, data)}
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
											sElementId = 'tablens1blankspaceViewportMasterBrowse';
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
												success: function(data) {ns1blankspaceSupportIssueSearchShow(oParam, data)}
											});
										}
									};	
								}

					process:	function ns1blankspaceSupportIssueSearchShow(oParam, oXML)
								{

									var iColumn = 0;
									var aHTML = [];
									
									var	iMaximumColumns = 1;
									var oRoot = oXML.getElementsByTagName('ondemand').item(0);

									if (oRoot.childNodes.length == 0)
									{
										ns1blankspaceSearchStop();
										$(ns1blankspace.xhtml.container).hide();
									}
									else
									{
										var oRow = oRoot.childNodes.item(0);

										aHTML.push('<table class="ns1blankspaceSearchMedium">';
										aHTML.push('<tbody>'
										var sClass = "";

										for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
										{

											var oRow = oRoot.childNodes.item(iRow);

											iColumn = iColumn + 1;

											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">';
											}
											
											if (onDemandXMLGetData(oRow, "status") == "3" ||  onDemandXMLGetData(oRow, "status") == "4" || onDemandXMLGetData(oRow, "status") == "5")
											{	sClass = " ns1blankspaceInactive";	}

											aHTML.push('<td class="ns1blankspaceSearch' + sClass + '" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
															'-' + onDemandXMLGetData(oRow, "id") + '">' +
															onDemandXMLGetData(oRow, "reference") + 
															'</td>';

											aHTML.push('<td class="ns1blankspaceSearch' + sClass + '" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
															'-' + onDemandXMLGetData(oRow, "id") + '">' +
															onDemandXMLGetData(oRow, "subject") + '</td>';

											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>'
												iColumn = 0;
											}	
										}
								    	
										aHTML.push('</tbody></table>';

										$(ns1blankspace.xhtml.container).html(
											ns1blankspacePagination(
											{
												html: aHTML.join(''),
												more: ($(oRoot).attr('morerows') == "true")
											}) 
										);		

										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);

										ns1blankspaceSearchStop();

										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspaceSupportIssueSearch(event.target.id, {source: 1});
										});

										ns1blankspacePaginationBind(
										{
											columns: 'firstname-surname',
											more: $(oRoot).attr('moreid'),
											rows: 15,
											startRow: parseInt($(oRoot).attr('startrow')) + parseInt($(oRoot).attr('rows')),
											functionSearch: ns1blankspaceSupportIssueSearch,
											functionClass: ns1blankspaceSupportIssueSearchClass
										});   

									}	
								},

					class:		function ns1blankspaceSupportIssueSearchClass()
								{
									var sClass = '';
									
									if (onDemandXMLGetData(oRow, "status") == "3" ||  onDemandXMLGetData(oRow, "status") == "4" || onDemandXMLGetData(oRow, "status") == "5")	
									{
										sClass = ' ns1blankspaceInactive';
									}
									
									return sClass;
								}
				},			

	layout:		function ns1blankspaceSupportIssueViewport()
				{

					var aHTML = [];
					

					aHTML.push('<div id="divns1blankspaceViewportControlContext" class="ns1blankspaceViewportControlContext"></div>';

					aHTML.push('<table id="tablens1blankspaceViewportControl" class="ns1blankspaceViewportControl">';

					if (ns1blankspace.objectContext != -1)
					{
						aHTML.push('<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlSummary" class="ns1blankspaceViewportControl';
						aHTML.push(' ns1blankspaceViewportControlHighlight';
						aHTML.push('">Summary</td></tr>';
					}

					aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlDetails" class="ns1blankspaceViewportControl '
					aHTML.push((ns1blankspace.objectContext==-1)?'ns1blankspaceViewportControlHighlight':'';
					aHTML.push('">Details</td></tr>';

					if (ns1blankspace.objectContext != -1)
					{
						aHTML.push('<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
										'<td id="tdns1blankspaceViewportControlAttachments" class="ns1blankspaceViewportControl">Attachments</td>' +
										'</tr>';
					}

					aHTML.push('</table>';					

					$('#divns1blankspaceViewportControl').html(aHTML.join(''));

					var aHTML = [];
					

					aHTML.push('<div id="divns1blankspaceMainSummary" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainDetails" class="divns1blankspaceViewportMain"></div>';
					aHTML.push('<div id="divns1blankspaceMainAttachments" class="divns1blankspaceViewportMain"></div>';

					$('#divns1blankspaceMain').html(aHTML.join(''));

					$('#tdns1blankspaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainSummary");
						ns1blankspaceSupportIssueSummary();
					});

					$('#tdns1blankspaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainDetails");
						ns1blankspaceSupportIssueDetails();
					});

					$('#tdns1blankspaceViewportControlAttachments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainAttachments", true);
						ns1blankspaceAttachments({xhtmlElementID: 'divns1blankspaceMainAttachments'});
					});
				},

	show:		function ns1blankspaceSupportIssueShow(oParam, oXML)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspaceSupportIssueViewport();

					ns1blankspace.objectContextDataXML = oXML;

					var aHTML = [];
					

					oRoot = oXML.getElementsByTagName('ondemand').item(0);

					if (oRoot.childNodes.length == 0)
					{
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find support issue.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';

						$('#divns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						var oRow = oRoot.childNodes.item(0);

						$('#divns1blankspaceViewportControlContext').html(onDemandXMLGetData(oRow, 'reference'));
						$('#spanns1blankspaceViewportControlAction').button({disabled: false});
						$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});

						ns1blankspaceViewportDestination({
							newDestination: 'ns1blankspaceSupportIssueMasterViewport({showHome: false});ns1blankspaceSupportIssueSearch("-' + ns1blankspace.objectContext + '")',
							move: false
							})

						ns1blankspaceObjectViewportHistory({functionDefault: 'ns1blankspaceSupportIssueSummary()'})
					}	
				},	

	summary:	function ns1blankspaceSupportIssueSummary()
				{

					var aHTML = [];
					
					var oXML = ns1blankspace.objectContextDataXML;

					oRoot = oXML.getElementsByTagName('ondemand').item(0);

					if (oRoot.childNodes.length == 0)
					{
						aHTML.push('<table><tbody><tr><td valign="top">Sorry can\'t find this support issue.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></tbody></table>';

						$('#divns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						var oRow = oRoot.childNodes.item(0);

						aHTML.push('<table id="tablens1blankspaceMainSummary" class="ns1blankspaceMain">';
						aHTML.push('<tr id="trns1blankspaceMainSummaryRow1" class="ns1blankspaceMainRow1">' +
									'<td id="tdns1blankspaceMainSummaryColumn1Large" class="ns1blankspaceMainColumn1Large">' +
										'</td>' +
										'<td id="tdns1blankspaceMainSummaryColumn2Action" style="width:100px;">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';				

						$('#divns1blankspaceMainSummary').html(aHTML.join(''));	

						var aHTML = [];
						

						aHTML.push('<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMainColumn1">';

						if (onDemandXMLGetData(oRow, 'subject') != '')
						{

							aHTML.push('<tr><td id="tdns1blankspaceMainSummaryCreatedDate" class="ns1blankspaceMainSummary">Date Lodged</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummaryCreatedDateValue" class="ns1blankspaceMainSummaryValue">' +
										onDemandXMLGetData(oRow, 'createddate') +
										'</td></tr>';

							aHTML.push('<tr><td id="tdns1blankspaceMainSummarySubject" class="ns1blankspaceMainSummary">Subject</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummarySubjectValue" class="ns1blankspaceMainSummaryValue">' +
										onDemandXMLGetData(oRow, 'subject') +
										'</td></tr>';

							if (onDemandXMLGetData(oRow, 'solution') != '')
							{	
								aHTML.push('<tr><td id="tdns1blankspaceMainSummarySolution" class="ns1blankspaceMainSummary">Solution</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummarySolutionValue" class="ns1blankspaceMainSummaryValue">' +
										onDemandXMLGetData(oRow, 'solution') +
										'</td></tr>';			
							}				

							if (onDemandXMLGetData(oRow, 'description') != '')
							{	
								aHTML.push('<tr><td id="tdns1blankspaceMainSummaryDescription" class="ns1blankspaceMainSummary">Description</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummaryDescriptionValue" class="ns1blankspaceMainSummaryValue">' +
										onDemandXMLGetData(oRow, 'description') +
										'</td></tr>';			
							}			
						}	

						aHTML.push('</table>';					

						$('#tdns1blankspaceMainSummaryColumn1Large').html(aHTML.join(''));
					}	
				},

	details: 	function ns1blankspaceSupportIssueDetails()
				{
					var aHTML = [];
					

					oRoot = ns1blankspace.objectContextDataXML.getElementsByTagName('ondemand').item(0);

					if ($('#divns1blankspaceMainDetails').attr('onDemandLoading') == '1')
					{
						$('#divns1blankspaceMainDetails').attr('onDemandLoading', '');

						var oRow = oRoot.childNodes.item(0);

						aHTML.push('<table id="tablens1blankspaceMainDetails" class="ns1blankspaceMainDetails">';
						aHTML.push('<tr id="trns1blankspaceMainDetailsRow1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsColumn1" class="ns1blankspaceMainColumn1">' +
										'</td>' +
										'<td id="tdns1blankspaceMainDetailsColumn2" class="ns1blankspaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					

						$('#divns1blankspaceMainDetails').html(aHTML.join(''));

						var aHTML = [];
						

						aHTML.push('<table id="tablens1blankspaceMainDetailsColumn1" class="ns1blankspaceMain">';

						aHTML.push('<tr id="trns1blankspaceMainDetailsSubject" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsSubject" class="ns1blankspaceMain">' +
										'Subject' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsSubjectValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsSubjectValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainDetailsSubject" class="inputns1blankspaceMainText">' +
										'</td></tr>';

						aHTML.push('<tr id="trns1blankspaceMainDetailsUser" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsUser" class="ns1blankspaceMain">' +
										'Send To' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsUserValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsUserValue" class="ns1blankspaceMainRadio">' +
										ns1blankspace.xhtml.loadingSmall +
										'</td></tr>';	

						aHTML.push('<tr id="trns1blankspaceMainDetailsDescription" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsDescription" class="ns1blankspaceMain">' +
										'Description' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsDescriptionValue" class="ns1blankspaceMainTextMulti">' +
										'<td id="tdns1blankspaceMainDetailsDescriptionValue" class="ns1blankspaceMainTextMulti">' +
										'<textarea style="width: 100%;" rows="10" cols="35" id="inputns1blankspaceMainDetailsDescription" class="inputns1blankspaceMainTextMulti"></textarea>' +
										'</td></tr>';	


						aHTML.push('<tr id="trns1blankspaceMainDetailsName" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsName" class="ns1blankspaceMain">' +
										'Best Contact Name' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsNameValue" class="ns1blankspaceMainTextMulti">' +
										'<td id="tdns1blankspaceMainDetailsNameValue" class="ns1blankspaceMainTextMulti">' +
										'<input id="inputns1blankspaceMainDetailsName" class="inputns1blankspaceMainText">' +
										'</td></tr>';	

						aHTML.push('<tr id="trns1blankspaceMainDetailsEmail" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsEmail" class="ns1blankspaceMain">' +
										'Email' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsEmailValue" class="ns1blankspaceMainTextMulti">' +
										'<td id="tdns1blankspaceMainDetailsEmailValue" class="ns1blankspaceMainTextMulti">' +
										'<input id="inputns1blankspaceMainDetailsEmail" class="inputns1blankspaceMainText">' +
										'</td></tr>';	

						aHTML.push('<tr id="trns1blankspaceMainDetailsPhone" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsPhone" class="ns1blankspaceMain">' +
										'Phone' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsPhoneValue" class="ns1blankspaceMainTextMulti">' +
										'<td id="tdns1blankspaceMainDetailsPhoneValue" class="ns1blankspaceMainTextMulti">' +
										'<input id="inputns1blankspaceMainDetailsPhone" class="inputns1blankspaceMainText">' +
										'</td></tr>';		

						aHTML.push('</table>';					

						$('#tdns1blankspaceMainDetailsColumn1').html(aHTML.join(''));

						ns1blankspaceSupportIssueGetUsers();

						var aHTML = [];
						

						aHTML.push('<table id="tablens1blankspaceMainDetailsColumn2" class="ns1blankspaceMain">';

						aHTML.push('<tr id="trns1blankspaceMainDetailsType" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsType" class="ns1blankspaceMain">' +
										'Type' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsType" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsTypeValue" class="ns1blankspaceMainRadio">' +
										'<input type="radio" id="radioType1" name="radioType" value="1"/>Help Required' +
										'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Suggestion' +
										'<br /><input type="radio" id="radioType3" name="radioType" value="3"/>General Comment' +
										'</td></tr>';

						aHTML.push('<tr id="trns1blankspaceMainDetailsSeverity" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsSeverity" class="ns1blankspaceMain">' +
										'Severity' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsSeverity" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsSeverityValue" class="ns1blankspaceMainRadio">' +
										'<input type="radio" id="radioSeverity0" name="radioSeverity" value="0"/>Critical' +
										'<br /><input type="radio" id="radioSeverity1" name="radioSeverity" value="1"/>Urgent' +
										'<br /><input type="radio" id="radioSeverity2" name="radioSeverity" value="2"/>Routine' +
										'<br /><input type="radio" id="radioSeverity3" name="radioSeverity" value="3"/>Non-Critical' +
										'<br /><input type="radio" id="radioSeverity4" name="radioSeverity" value="4"/>Not Sure' +
										'</td></tr>';


						aHTML.push('</table>';					

						$('#tdns1blankspaceMainDetailsColumn2').html(aHTML.join(''));

						if (oRoot.childNodes.length != 0)
						{
							$('#inputns1blankspaceMainDetailsSubject').val(onDemandXMLGetData(oRow, 'subject'));
							$('#inputns1blankspaceMainDetailsDescription').val(onDemandXMLGetData(oRow, 'description'));
							$('#inputns1blankspaceMainDetailsName').val(onDemandXMLGetData(oRow, 'name'));
							$('#inputns1blankspaceMainDetailsEmail').val(onDemandXMLGetData(oRow, 'email'));
							$('#inputns1blankspaceMainDetailsPhone').val(onDemandXMLGetData(oRow, 'phone'));

							$('[name="radioType"][value="' + onDemandXMLGetData(oRow, 'type') + '"]').attr('checked', true);
							$('[name="radioSeverity"][value="' + onDemandXMLGetData(oRow, 'severity') + '"]').attr('checked', true);
							$('[name="radioUser"][value="' + onDemandXMLGetData(oRow, 'user') + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioType"][value="1"]').attr('checked', true);
							$('[name="radioSeverity"][value="0"]').attr('checked', true);
							$('[name="radioUser"]').first().attr('checked', true);
							ns1blankspaceSupportIssueGetContact();
						}

					}	
				},

	new:		function ns1blankspaceSupportIssueNew(oXML)
				{
					ns1blankspace.objectContext = -1;
					ns1blankspace.objectContextDataXML = oXML;
					ns1blankspaceSupportIssueViewport();
					ns1blankspaceMainViewportShow("#divns1blankspaceMainDetails");
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
					ns1blankspaceSupportIssueDetails();	
				},

	save: 		{
					send:		function ns1blankspaceSupportIssueSave()
								{

									var sParam = 'method=SUPPORT_ISSUE_MANAGE'
									var sData = '';

									if (ns1blankspace.objectContext != -1)
									{
										sData += '&id=' + ns1blankspace.objectContext;
									} 

									if ($('#divns1blankspaceMainDetails').html() != '')
									{
										sData += '&subject=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsSubject').val());
										sData += '&description=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsDescription').val());
										sData += '&name=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsName').val());
										sData += '&email=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsEmail').val());
										sData += '&phone=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsPhone').val());
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
											success: ns1blankspaceSupportIssueSaveProcess
										});
										
									}
									else
									{
										ns1blankspaceStatus('Saved');
									}	
										
								},

					process;			function ns1blankspaceSupportIssueSaveProcess(oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspaceStatus('Saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
										
										if (bNew) {ns1blankspaceSupportIssueSearch('-' + ns1blankspace.objectContext)}
									}
									else
									{
										ns1blankspaceStatus(oResponse.error.errornotes);
										ns1blankspaceConfirm( {html: [oResponse.error.errornotes]
																   , title: 'Save error!'});
									}
								}
				}				

	getUsers:	function ns1blankspaceSupportIssueGetUsers(oParam, oXML)
				{
					var sXHTMLElementId = 'tdns1blankspaceMainDetailsUserValue';

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
							success: function(data){ns1blankspaceSupportIssueGetUsers(oParam, data)}
						});
					}
					else
					{

						var aHTML = [];
						

						var oRoot = oXML.getElementsByTagName("ondemand").item(0);

						if (oRoot.childNodes.length == 0)
						{
							aHTML.push('<table>';
							aHTML.push('<tr class="ns1blankspaceMainCaption">' +
												'<td class="ns1blankspaceMainRowNothing">No users to log issue against!</td></tr>';
							aHTML.push('</tbody></table>';
						}
						else
						{		

							for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
							{
								var oRow = oRoot.childNodes.item(iRow);

								aHTML.push('<input type="radio" id="radioUser' + onDemandXMLGetData(oRow, "id") + '"' +
													' name="radioUser" value="' + onDemandXMLGetData(oRow, "id") + '">' +
													onDemandXMLGetData(oRow, "contactfirstname") + ' ' + onDemandXMLGetData(oRow, "contactsurname")	+ '<br />';

							}

						}

						$('#' + sXHTMLElementId).html(aHTML.join(''));
					}	
				},	

	getContact:	function ns1blankspaceSupportIssueGetContact(oParam, oResponse)
				{
					var sXHTMLElementNameID = 'inputns1blankspaceMainDetailsName';
					var sXHTMLElementEmailID = 'inputns1blankspaceMainDetailsEmail';

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
							success: function(data){ns1blankspaceSupportIssueGetContact(oParam, data)}
						});
					}
					else
					{
						$('#' + sXHTMLElementNameID).val(oResponse.firstname + ' ' + oResponse.surname);
						$('#' + sXHTMLElementEmailID).val(oResponse.email);
					}	
				}
}					
