/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.supportIssue = 
{
	data: 		{
					mode:
					{
						options:
						{
							byMe: 1,
							forMe: 2
						}
					}
				},

	init: 		function (oParam)
				{
					if (oParam === undefined) {oParam = {}}

					ns1blankspace.app.reset();

					ns1blankspace.supportIssue.getUsers();

					ns1blankspace.object = -8;
					ns1blankspace.objectName = 'supportIssue';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Support Issues';

					if (ns1blankspace.supportIssue.data.mode.value === undefined)
					{
						ns1blankspace.supportIssue.data.mode.value = ns1blankspace.util.getParam(oParam, 'mode', {"default": 1}).value;
					}	
							
					oParam.bind = ns1blankspace.supportIssue.bind;

					oParam.xhtml = '<table id="ns1blankspaceOptions" class="ns1blankspaceViewControlContainer">' +	
											'<tr class="ns1blankspaceOptions">' +
											'<td id="ns1blankspaceControlActionOptionsRemove" class="ns1blankspaceViewControl">' +
											'Delete' +
											'</td></tr>' +
											'<tr class="ns1blankspaceOptions">' +
											'<td id="ns1blankspaceControlActionOptionsAlert" class="ns1blankspaceViewControl">' +
											'Send Email Alert' +
											'</td></tr>' +
											'</table>';
							
					ns1blankspace.app.set(oParam);
				},

	bind: 		function (oParam)
				{
					$('#ns1blankspaceControlActionOptionsRemove')
					.click(function() 
					{
						ns1blankspace.app.options.remove(oParam)
					});

					$('#ns1blankspaceControlActionOptionsAlert')
					.click(function() 
					{
						$(ns1blankspace.xhtml.container).hide();
						ns1blankspace.supportIssue.alert.init(oParam);
					});
				},			

	home: 		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

						if (false && ns1blankspace.supportIssue.data.mode.value === undefined)
						{
							ns1blankspace.supportIssue.data.mode.value = ns1blankspace.util.getParam(oParam, 'mode', {"default": 1}).value;
						}	

						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceMain">');
						aHTML.push('<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ns1blankspaceMain">' +
										ns1blankspace.xhtml.loading +
										'</td>' +
										'<td id="ns1blankspaceHomeAction" style="width:150px;"></td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						if (ns1blankspace.option.helpURI !== undefined)
						{ 
							aHTML.push('<tr><td style="font-size:0.875em; width:110px;">' +
										'<a href="' + ns1blankspace.option.helpURI + '" target="_blank"' +
										'>Get help from the community</a>' +
										'</td></tr>');	
						}

						aHTML.push('<tr><td style="padding-top:20px;" class="ns1blankspaceHeader">' +
										'DEBUGGING' +
										'</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceSupportDebugLogShowContainer">' +
										'<span id="ns1blankspaceSupportDebugLogShow" class="ns1blankspaceAction" style="width:20px; height:20px;"></span>' +
										'<span id="ns1blankspaceSupportDebugLogClear" class="ns1blankspaceAction" style="margin-left:4px; width:20px; height:20px;"></span>' +
										'</td></tr>');

						aHTML.push('</table>');

						if (ns1blankspace.option.helpNotes !== undefined)
						{ 
							aHTML.push(ns1blankspace.option.helpNotes);	
						}						

						$('#ns1blankspaceHomeAction').html(aHTML.join(''));	

						$('#ns1blankspaceSupportDebugLogShow').button(
						{	
							text: false,
							label: 'Show',
							icons:
							{
								primary: "ui-icon-clipboard"
							}
						})
						.click(function()
						{
							ns1blankspace.supportIssue.debug.show();
						});

						$('#ns1blankspaceSupportDebugLogClear').button(
						{	
							text: false,
							label: 'Clear',
							icons:
							{
								primary: "ui-icon-close"
							}
						})
						.click(function()
						{
							ns1blankspace.supportIssue.debug.clear();
							ns1blankspace.supportIssue.debug.show();
						});

						var aHTML = [];
									
						aHTML.push('<table><tr><td><div id="ns1blankspaceViewHelpLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControl-1" class="ns1blankspaceControl" style="padding-top:15px;">' +
										'By Me</td></tr>');			
								
						aHTML.push('<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControl-2" class="ns1blankspaceControl">' +
										'For Me</td></tr>');	

						aHTML.push('</table>');	
						
						$('#ns1blankspaceControl').html(aHTML.join(''));

						$('td.ns1blankspaceControl').click(function(event)
						{
							ns1blankspace.supportIssue.data.mode.value = (this.id).split('-')[1];
							ns1blankspace.supportIssue.home();
						});

						$('#ns1blankspaceControl-' + ns1blankspace.supportIssue.data.mode.value).addClass("ns1blankspaceHighlight");

						var oSearch = new AdvancedSearch();
						oSearch.method = 'SUPPORT_ISSUE_SEARCH';		
						oSearch.addField('completeddate,contactbusiness,contactbusinesstext,contactperson,contactpersontext,' +
										'description,email,lodgeddate,name,phone,processingtype,processingtypetext,reference,' +
										'severity,severitytext,solution,status,statustext,technicalnotes,title,' +
										'totaltime,type,typetext,user,usercontactemail,usertext');
						
						if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe)
						{
							oSearch.addCustomOption('showmyloggedissues', 'Y');
						}	

						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(function(data) {ns1blankspace.supportIssue.home(oParam, data)});

					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a support issue.</td></tr>' +
											'</table>');
						}
						else
						{
							aHTML.push('<table>');
							aHTML.push('<tr><td colspan=4 class="ns1blankspaceCaption">MOST LIKELY</td></tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');

								aHTML.push('<td id="ns1blankspaceMostLikely_Reference-' + this.id + '" class="ns1blankspaceMostLikely" style="width:50px;">' +
														this.reference + '</td>');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_Date-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:75px;" style="padding-left:10px;">' +
														this.lodgeddate + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_User-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:75px;" style="padding-left:10px;">' +
														this.usertext + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_Title-' + this.id + '" class="ns1blankspaceMostLikelySub" style="padding-left:10px;">' +
														this.title + '</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');			
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.supportIssue.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
									var sSearchContext = aSearch[1];
									var iMinimumLength = 0;
									var iSource = ns1blankspace.data.searchSource.text;
									var sSearchText;
									var iMaximumColumns = 1;

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
										oSearch.method = 'SUPPORT_ISSUE_SEARCH';		
										oSearch.addField('completeddate,contactbusiness,contactbusinesstext,contactperson,contactpersontext,' +
														'description,email,lodgeddate,name,phone,processingtype,processingtypetext,reference,' +
														'severity,severitytext,solution,status,statustext,technicalnotes,title,' +
														'totaltime,type,typetext,user,usercontactemail,usertext');

										oSearch.addField(ns1blankspace.option.auditFields);

										if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe)
										{
											oSearch.addCustomOption('showmyloggedissues', 'Y');
										}

										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										
										oSearch.getResults(function(data) {ns1blankspace.supportIssue.show(oParam, data)});
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
											sElementId = 'ns1blankspaceViewControlBrowse';
										}

										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.search.start();

											var oSearch = new AdvancedSearch();
											oSearch.method = 'SUPPORT_ISSUE_SEARCH';		
											oSearch.addField('completeddate,contactbusiness,contactbusinesstext,contactperson,contactpersontext,' +
															'description,email,lodgeddate,name,phone,processingtype,processingtypetext,reference,' +
															'severity,severitytext,solution,status,statustext,technicalnotes,title,' +
															'totaltime,type,typetext,user,usercontactemail,usertext');
											
											if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe)
											{
												oSearch.addCustomOption('showmyloggedissues', 'Y');
											}	

											oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);

											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.sort('reference', 'desc');
											
											oSearch.getResults(function(data) {ns1blankspace.supportIssue.search.show(oParam, data)});
										}
									};	
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
										
										var sClass = '';

										$.each(oResponse.data.rows, function()
										{	
											iColumn = iColumn + 1;

											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">');
											}
											
											if (this.status == 3 ||  this.status == 4 || this.status == 5)
											{	sClass = " ns1blankspaceInactive";	}

											aHTML.push('<td class="ns1blankspaceSearch' + sClass + '" id="ns1blankspaceSearch-' +
															this.id + '">' +
															this.reference + 
															'</td>');

											aHTML.push('<td class="ns1blankspaceSearch' + sClass + '" id="ns1blankspaceSearch-' +
															this.id + '">' +
															this.subject + '</td>');

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
											ns1blankspace.supportIssue.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'reference',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.supportIssue.search.send
										});   
									}	
								},

					"class":		function ()
								{
									var sClass = '';
									
									if (this.status = 3 ||  thisstatus == 4 || this.status == 5)	
									{
										sClass = ' ns1blankspaceInactive';
									}
									
									return sClass;
								}
				},			

	layout:		function ()
				{
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Details</td></tr>');		
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');

	
						if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.forMe)
						{
							aHTML.push('</table>');

							aHTML.push('<table class="ns1blankspaceControl">');

							aHTML.push('<tr><td id="ns1blankspaceControlSolution" class="ns1blankspaceControl">' +
										'Solution</td></tr>');

							aHTML.push('<tr><td id="ns1blankspaceControlAlert" class="ns1blankspaceControl">' +
										'Alerts</td></tr>');
						}	

						aHTML.push('</table>');

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');
					}	
					
					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainSolution" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAlert" class="ns1blankspaceControlMain"></div>');					
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
							
					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.supportIssue.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.supportIssue.details();
					});

					$('#ns1blankspaceControlSolution').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSolution'});
						ns1blankspace.supportIssue.solution();
					});

					$('#ns1blankspaceControlAlert').click(function(event)
					{
						ns1blankspace.supportIssue.alert.init();
					});


					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
						ns1blankspace.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments'});
					});
				},

	show:		function (oParam, oResponse)
				{
					ns1blankspace.app.clean();
					ns1blankspace.supportIssue.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this support issue.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
					
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.reference);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.supportIssue.init({id: ' + ns1blankspace.objectContext + ', mode: ' + ns1blankspace.supportIssue.data.mode.value + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.supportIssue.summary()'});

						ns1blankspace.util.onComplete(oParam);
					}	
				},	

	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this messaging IMAP account.</td></tr></table>');
								
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

						aHTML.push('<table class="ns1blankspace">');
						
						if (ns1blankspace.objectContextData.subject != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Date Created</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryDateCreated" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.createddate +
											'</td></tr>');

							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Subject</td></tr>' +
											'<tr><td id="ns1blankspaceSummarySubject" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.title +
											'</td></tr>');	

							if (ns1blankspace.objectContextData.solution != '')
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Solution</td></tr>' +
												'<tr><td id="ns1blankspaceSummarySolution" class="ns1blankspaceSummary">' +
												ns1blankspace.objectContextData.solution +
												'</td></tr>');
							}		


							if (ns1blankspace.objectContextData.description != '')
							{
								aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
												'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
												ns1blankspace.objectContextData.description +
												'</td></tr>');
							}											
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
										'Subject' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsTitle" class="ns1blankspaceText">' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Send To' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td id="ns1blankspaceDetailsUser" class="ns1blankspaceRadio">' +
										ns1blankspace.xhtml.loadingSmall +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<textarea id="ns1blankspaceDetailsDescription" style="width: 100%;" rows="10" cols="35" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Contact Name' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsName" class="ns1blankspaceText">' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Email' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsEmail" class="ns1blankspaceText">' +
										'</td></tr>');	

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Phone' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPhone" class="ns1blankspaceText">' +
										'</td></tr>');	

						aHTML.push('</table>');					

						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));

						ns1blankspace.supportIssue.getUsers();

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceMain">');

						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Type' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioType1" name="radioType" value="1"/>Help Required' +
										'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Suggestion' +
										'<br /><input type="radio" id="radioType3" name="radioType" value="3"/>General Comment' +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Severity' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioSeverity0" name="radioSeverity" value="0"/>Critical' +
										'<br /><input type="radio" id="radioSeverity1" name="radioSeverity" value="1"/>Urgent' +
										'<br /><input type="radio" id="radioSeverity2" name="radioSeverity" value="2"/>Routine' +
										'<br /><input type="radio" id="radioSeverity3" name="radioSeverity" value="3"/>Non-Critical' +
										'<br /><input type="radio" id="radioSeverity4" name="radioSeverity" value="4"/>Not Sure' +
										'</td></tr>');


						aHTML.push('</table>');					

						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.description);
							$('#ns1blankspaceDetailsName').val(ns1blankspace.objectContextData.name);
							$('#ns1blankspaceDetailsEmail').val(ns1blankspace.objectContextData.email);
							$('#ns1blankspaceDetailsPhone').val(ns1blankspace.objectContextData.phone);

							$('[name="radioType"][value="' + ns1blankspace.objectContextData.type + '"]').attr('checked', true);
							$('[name="radioSeverity"][value="' + ns1blankspace.objectContextData.severity+ '"]').attr('checked', true);
							$('[name="radioUser"][value="' + ns1blankspace.objectContextData.user + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioType"][value="1"]').attr('checked', true);
							$('[name="radioSeverity"][value="0"]').attr('checked', true);
							$('[name="radioUser"]').first().attr('checked', true);

							ns1blankspace.supportIssue.getContact();
						}

					}	
				},

	solution: 	function ()
				{
					var aHTML = [];

					if ($('#ns1blankspaceMainSolution').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainSolution').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceSolutionColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceSolutionColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');					
						
						$('#ns1blankspaceMainSolution').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Solution (shared with user)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<textarea id="ns1blankspaceSolutionSolution" style="width: 100%;" rows="10" cols="35" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Internal technical notes' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<textarea id="ns1blankspaceSolutionTechnicalNotes" style="width: 100%;" rows="10" cols="35" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');	

						aHTML.push('</table>');					

						$('#ns1blankspaceSolutionColumn1').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceMain">');

						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Processing Type' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioProcessingType5" name="radioProcessingType" value="5"/>Not sure' +
										'<br /><input type="radio" id="radioProcessingType2" name="radioProcessingType" value="2"/>Internet issue' +
										'<br /><input type="radio" id="radioProcessingType3" name="radioProcessingType" value="3"/>Fault' +
										'<br /><input type="radio" id="radioProcessingType3" name="radioProcessingType" value="4"/>Suggestion' +
										'</td></tr>')

						aHTML.push('</table>');					

						$('#ns1blankspaceSolutionColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceSolutionSolution').val(ns1blankspace.objectContextData.solution);
							$('#ns1blankspaceSolutionTechnicalNotes').val(ns1blankspace.objectContextData.technicalnotes);
							$('[name="radioProcessingType"][value="' + ns1blankspace.objectContextData.processingtype + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioProcessingType"][value="5"]').attr('checked', true);
						}
					}	
				},

	save: 		{
					send:		function ()
								{
									ns1blankspace.status.working();
									
									var oData = {}

									if (ns1blankspace.objectContext != -1)
									{
										oData.id = ns1blankspace.objectContext;
									} 
							
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										oData.title = $('#ns1blankspaceDetailsTitle').val();
										oData.description = $('#ns1blankspaceDetailsDescription').val();
										oData.name = $('#ns1blankspaceDetailsName').val();
										oData.email = $('#ns1blankspaceDetailsEmail').val();
										oData.phone =$('#ns1blankspaceDetailsPhone').val();
										oData.user = $('input[name="radioUser"]:checked').val();
										oData.type = $('input[name="radioType"]:checked').val();
										oData.severity = $('input[name="radioSeverity"]:checked').val();
									}

									if ($('#ns1blankspaceMainSolution').html() != '')
									{
										oData.solution = $('#ns1blankspaceSolutionSolution').val();
										oData.technicalnotes = $('#ns1blankspaceSolutionTechnicalNotes').val();
									}	

									if (!ns1blankspace.util.isEmpty(oData))
									{									
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('SUPPORT_ISSUE_MANAGE'),
											data: oData,
											dataType: 'json',
											success: function (data) {ns1blankspace.supportIssue.save.process(data, oData)}
										});
										
									}
									else
									{
										ns1blankspace.status.message('Saved');
									}	
										
								},

					process:	function (oResponse, oData)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');

										var bNew = (ns1blankspace.objectContext == -1)
										ns1blankspace.objectContext = oResponse.id;	
										ns1blankspace.inputDetected = false;

										ns1blankspace.supportIssue.init(
										{
											id: ns1blankspace.objectContext,
											onComplete: ns1blankspace.supportIssue.alert.init
										});
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}
				},				

	getUsers:	function (oParam, oResponse)
				{
					var sXHTMLElementID = 'ns1blankspaceDetailsUser';

					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}

					if (oResponse == undefined)
					{
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('SUPPORT_ISSUE_USER_SEARCH'),
							dataType: 'json',
							async: false,
							success: function(data){ns1blankspace.supportIssue.getUsers(oParam, data)}
						});
					}
					else
					{
						var aHTML = [];

						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">No users to log issue against!</td></tr>' +
											'</table>');
						}
						else
						{		

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<input type="radio" id="radioUser' + this.id + '"' +
													' name="radioUser" value="' + this.id + '"' +
													' data-email="' + this.email + '">' +
													this.contactfirstname + ' ' + this.contactsurname + '<br />');
							});

						}

						ns1blankspace.supportIssue.data.users = oResponse.data.rows;

						$('#' + sXHTMLElementID).html(aHTML.join(''));
					}	
				},	

	getContact:	function (oParam, oResponse)
				{
					var sXHTMLElementNameID = 'ns1blankspaceDetailsName';
					var sXHTMLElementEmailID = 'ns1blankspaceDetailsEmail';

					if (oParam != undefined)
					{
						if (oParam.xhtmlElementNameID != undefined) {sXHTMLElementNameID = oParam.xhtmlElementNameID}
						if (oParam.xhtmlElementEmailID != undefined) {sXHTMLElementEmailID = oParam.xhtmlElementEmailID}
					}

					if (oResponse == undefined)
					{
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('CORE_GET_USER_DETAILS'),
							dataType: 'json',
							success: function(data){ns1blankspace.supportIssue.getContact(oParam, data)}
						});
					}
					else
					{
						$('#' + sXHTMLElementNameID).val(oResponse.firstname + ' ' + oResponse.surname);
						$('#' + sXHTMLElementEmailID).val(oResponse.email);
					}	
				},

	alert: 		{
					init: 		function (oParam)
								{
									ns1blankspace.show({selector: '#ns1blankspaceMainAlert'});

									if (ns1blankspace.inputDetected)
									{
										$('#ns1blankspaceMainAlert').html('<span class="ns1blankspaceSub">You need to save the issue<br />before sending the alert.</span>');
									}
									else
									{
										ns1blankspace.supportIssue.alert.show(oParam);
									}
								},

					show: 		function (oParam)
								{
									if (oParam === undefined) {oParam = {}}

									if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe)
									{
										ns1blankspace.supportIssue.alert.send(oParam)
									}
									else
									{
										$('#ns1blankspaceMainAlert').html('<table class="ns1blankspaceMain">' +
													'<tr class="ns1blankspaceRow">' +
													'<td id="ns1blankspaceAlert1" class="ns1blankspaceColumn1" style="width:300px;"></td>' +
													'<td id="ns1blankspaceAlert2" class="ns1blankspaceColumn2" ></td>' +
													'</tr>' +
													'</table>');				

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn">');
																		
										aHTML.push('<tr><td class="ns1blankspaceSub">Send an email alert about this update to ' + ns1blankspace.objectContextData.usercontactemail + '?</td></tr>');

										aHTML.push('<tr><td class="ns1blankspaceRadio" style="padding-top:15px;">' +
													'<input type="checkbox" id="ns1blankspaceAlertClassic">Use "classic" back link</div>' +
															'</span></td></tr>');

										aHTML.push('</table>');

										$('#ns1blankspaceAlert1').html(aHTML.join(''));

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2">');
																		
										aHTML.push('<tr><td>' +
														'<span id="ns1blankspaceAlertSend" class="ns1blankspaceAction" style="width:75px;">' +
														'Send</span></td></tr>');

										aHTML.push('</table>');

										$('#ns1blankspaceAlert2').html(aHTML.join(''));

										$('#ns1blankspaceAlertSend').button(
										{
											label: 'Send'
										})
										.click(function(event)
										{
											oParam.classic = ($('#ns1blankspaceAlertClassic:checked').length == 0);
											oParam.onComplete = ns1blankspace.supportIssue.init;
											ns1blankspace.supportIssue.alert.send(oParam);
											$('#ns1blankspaceMainAlert').html('Sending alert.');
										});
									}	
								},

					send: 		function (oParam, oResponse)
								{
									if (oResponse === undefined)
									{	
										var sIssueText = ns1blankspace.util.getParam(oParam, 'issueText').value;
										var sSolutionText = ns1blankspace.util.getParam(oParam, 'solutionText').value;
										var bClassic = ns1blankspace.util.getParam(oParam, 'classic', {"default": false}).value;
										var sLinkUser = window.location.href + '#/supportIssue/';
										var sLinkSupport = sLinkUser;

										if (bClassic)
										{
											sLinkUser = 'https://secure.mydigitalspacelive.com/support/issueproperties.asp?select=';
										}

										//noreply@mydigitalstucture.com

										var aUser = $.grep(ns1blankspace.supportIssue.data.users, function (a) {return a.id == ns1blankspace.objectContextData.user});

										if (aUser.length > 0)
										{	
											if (sIssueText == undefined) {sIssueText = ns1blankspace.objectContextData.description}
											if (sSolutionText == undefined) {sSolutionText = ns1blankspace.objectContextData.solution}

											var oData = 
											{
												fromemail: 'mark.byers@ibcom.biz',
												subject: 'Support Issue ' + ns1blankspace.objectContext.reference,
												to: aUser[0].email
											}

											var aMessage = [];

											if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe)
											{
												//USER TO SUPPORT
												aMessage.push(sIssueText, '<a href="' + sLinkSupport + ns1blankspace.objectContext +'">View Issue</a>');
											}
											else
											{
												//SUPPORT SUPPORT TO USER
												aMessage.push(sIssueText, sSolutionText, '<a href="' + sLinkUser + ns1blankspace.objectContext +'">View Issue</a>');
											}	

											oData.message = aMessage.join('<br /><br />');

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND'),
												data: oData,
												dataType: 'json',
												success: function (data) {ns1blankspace.supportIssue.alert.send(oParam, data)}
											});
										}
										else
										{
											ns1blankspace.status.error('No one to email');
										}	
									}
									else
									{
										ns1blankspace.status.message('Alert sent');
										ns1blankspace.util.onComplete(oParam);
									}	
								}			
				},

	debug: 		{
						show: 		function()
									{
										var oErrors = ns1blankspace.util.local.cache.search({key: '1blankspace-debug.json', persist: true});
										var aHTML = [];

							  			if (oErrors == undefined)
							  			{
							  				oErrors = []
							  			}

							  			aHTML.push('<div class="ns1blankspaceNothing">');

							  			if (oErrors.length == 0)
							  			{
							  				aHTML.push('Nothing to show');
							  			}	
							  			else
							  			{	
							  				aHTML.push('Time,URI,Instance,Service Fault ID,Status Code,Status<br />');

								  			$.each(oErrors, function(i,v)
								  			{
									  			aHTML.push(
									  				v.time + ',' +
									  				v.uri + ',' +
									  				v.instance + ',' +
									  				v.fault + ',' +
									  				v.statusCode + ',' +
									  				v.status + '<br />'
									  			);
								  			});
								  		}

								  		aHTML.push('</div>');

							  			$('#ns1blankspaceMostLikely').html(aHTML.join(''));
									},

						clear: 		function()
									{
										ns1blankspace.util.local.cache.save({key: '1blankspace-debug.json', persist: true, data: []});
									}			
				}					
}					
