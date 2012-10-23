/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.setup.project.task = 
{
	init: 		function interfaceSetupProjectTaskMasterViewport(oParam)
				{
					var bShowHome = true;

					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}
					
					ns1blankspace.object = 11;	
					ns1blankspace.objectName = 'Project Task Template';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
							
					ns1blankspaceReset();
					
					$('#divns1blankspaceViewportControlSet').button(
					{
						label: "Template Tasks"
					});
					
					$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
					{
						interfaceSetupProjectTaskSearch('inputns1blankspaceViewportControlSearch');
					});
					
					$('#imgns1blankspaceViewportControlSearch').click(function(event)
					{
						interfaceSetupProjectTaskSearch('inputns1blankspaceViewportControlSearch');
					});
					
					$('#imgns1blankspaceViewportControlSearchOptions').click(function(event)
					{
						interfaceSetupProjectTaskSearchOptions();
					});
					
					$('#imgns1blankspaceViewportControlNew').click(function(event)
					{
						interfaceSetupProjectTaskNew();
					})
					
					$('#imgns1blankspaceViewportControlNewOptions').click(function(event)
					{
						interfaceSetupProjectTaskNewOptions();
					});
					
					$('#divns1blankspaceViewportControlAction').click(function(event)
					{
						interfaceSetupProjectTaskSave();
					});
					
					$('#imgns1blankspaceViewportControlActionMore').click(function(event)
					{
						interfaceSetupProjectTaskSaveOptions();
					});
					
					$('#imgns1blankspaceViewportControlSetup').click(function(event)
					{
						interfaceSetupProjectTaskSetup();
					});
					
					$('#imgns1blankspaceViewportControlSetupOptions').click(function(event)
					{
						interfaceSetupProjectTaskSetupOptions();
					});
					
					$('#imgns1blankspaceViewportControlHelp').click(function(event)
					{
						interfaceSetupProjectTaskHelp();
					});
					
					$('#imgns1blankspaceViewportControlHelpOptions').click(function(event)
					{
						interfaceSetupProjectTaskHelpOptions();
					});
					
					$('.interfaceViewportMasterControlBrowse').click(function(event)
					{
						interfaceSetupProjectTaskSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
					});
					
					$('.interfaceViewportMasterControlBrowseAll').click(function(event)
					{
						interfaceSetupProjectTaskSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
					});
					
					if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
					
					if (bShowHome) {interfaceSetupProjectTaskHomeShow()};

					tinyMCE.init(
					{
				        mode : "none",
						height : "370px", 
						width : "100%",
						theme : "advanced",
						
						plugins : "table,advimage,advlink,emotions,iespell,insertdatetime,templateFields,preview,media,fullscreen,print,visualchars,nonbreaking,pagebreak,style,paste,searchreplace,print,contextmenu", 

						theme_advanced_buttons1_add_before : "forecolor,backcolor", 
						theme_advanced_buttons1_add : "fontselect,fontsizeselect", 
				 
						theme_advanced_buttons2_add : "separator,insertdate,inserttime,preview,zoom,separator,nonbreaking,pagebreak,visualchars", 
						theme_advanced_buttons2_add_before: "cut,copy,paste,pasteword,separator,search,replace,separator", 
						
						theme_advanced_buttons3_add_before : "tablecontrols,separator", 
						theme_advanced_buttons3_add : "emotions,iespell,fullscreen,print,templateFields,media,selectall,advhr",
				 		
						plugin_insertdate_dateFormat : "%d-%m-%y", 
						plugin_insertdate_timeFormat : "%H:%M:%S", 
					
						theme_advanced_toolbar_location : "top",
						theme_advanced_toolbar_align : "left",
						theme_advanced_resizing : true,
					
						font_size_style_values : "8pt,10pt,12pt,14pt,18pt,24pt,36pt",
						
						extended_valid_elements : "style,input[accept|accesskey|align<bottom?left?middle?right?top|alt|checked<checked|class|dir<ltr?rtl|disabled<disabled|id|ismap<ismap|lang|maxlength|name|onblur|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onselect|readonly<readonly|size|src|style|tabindex|title|type<button?checkbox?file?hidden?image?password?radio?reset?submit?text|usemap|value],select[class|dir<ltr?rtl|disabled<disabled|id|lang|multiple<multiple|name|onblur|onchange|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|size|style|tabindex|title],ol[class|compact<compact|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|start|style|title|type],div[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title],li[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title|type|value],iframe[src|width|height|name|align|frameborder|scrolling|marginheight|marginwidth]",

						fullscreen_new_window : true, 
						fullscreen_settings : 
						{ 
							theme_advanced_path_location : "top" 
						}, 
						relative_urls : false, 
						remove_script_host : false, 
						convert_urls : false, 
						visual : true, 
						gecko_spellcheck : true,
						
						content_css : ns1blankspace.xhtml.editorCSS,
						
						external_link_list_url : "/jscripts/ibcom/linkList.asp", 
						
						forced_root_block : false,
						force_p_newlines : 'false',
						remove_linebreaks : false,
						force_br_newlines : true, 
						remove_trailing_nbsp : false,   
						verify_html : false
					});		
				},

	home: 		function interfaceSetupProjectTaskHomeShow(oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
						var h = -1;
									
						aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
						aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
										'<td id="tdInterfaceProjectHomeMostLikely" class="interfaceViewportMain">' +
										ns1blankspace.xhtml.loading + 
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMain').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
									
						aHTML[++h] = '<table>';
						aHTML[++h] = '<tr>' +
										'<td id="ns1blankspaceViewportProjectLarge" class="ns1blankspaceViewportImageLarge">' +
										'&nbsp;' + 
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';		
						
						$('#divInterfaceViewportControl').html(aHTML.join(''));	
						
						$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'PROJECT_TASK_SEARCH';
						oSearch.addField('reference,description');
						oSearch.rf = 'json';
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(interfaceSetupProjectTaskHomeShow);
					}
					else
					{
						var aHTML = [];
						var h = -1;
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML[++h] = '<table id="tableInterfaceSetupProjectTaskHomeMostLikely">';
							aHTML[++h] = '<tr class="trInterfaceSetupProjectTaskHomeMostLikelyNothing">';
							aHTML[++h] = '<td class="tdInterfaceSetupProjectTaskHomeMostLikelyNothing">Click New to create a project template task.</td>';
							aHTML[++h] = '</tr>';
							aHTML[++h] = '</table>';
						}
						else
						{
						
							aHTML[++h] = '<table id="tableInterfaceSetupProjectTaskHomeMostLikely">';
							aHTML[++h] = '<tr>';
							aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
							aHTML[++h] = '</tr>';

							$.each(oResponse.data.rows, function()
							{
								aHTML[++h] = '<tr class="interfaceMainRow">';
								
								aHTML[++h] = '<td id="interfaceSetupProjectTaskHomeMostLikely_Title-' +
													this.id + '" class="interfaceHomeMostLikely">' +
													this.description + '</td>';
								
								aHTML[++h] = '</tr>'
							});
							
							aHTML[++h] = '</tbody></table>';
						}
						
						$('#tdInterfaceSetupProjectTaskHomeMostLikely').html(aHTML.join(''));
					
						$('td.interfaceHomeMostLikely').click(function(event)
						{
							interfaceSetupProjectTaskSearch(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function interfaceSetupProjectTaskSearch(sXHTMLElementId, oParam)
								{
									
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									var iMinimumLength = 3;
									var iSource = ns1blankspace.data.searchSource.text;
									var sSearchText;
									var iMaximumColumns = 1;
									var iRows = 10;
									var sQuickSearchType = '';
									
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
										var sParam = 'method=PROJECT_TASK_SEARCH&id=' + ns1blankspace.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/project/?' + sParam,
											dataType: 'json',
											success: function(data) {interfaceSetupProjectTaskShow(oParam, data)}
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
											sSearchText = aSearch[1];
											sElementId = 'tableInterfaceViewportMasterBrowse';
											sQuickSearchType = 'start';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspaceOptionsSetPosition(sElementId);
											
											var sParam = 'method=PROJECT_TASK_SEARCH&quicksearch' + sQuickSearchType + '=' + sSearchText;

											$.ajax(
											{
												type: 'GET',
												url: '/ondemand/project/?' + sParam,
												dataType: 'json',
												success: function(data) {interfaceSetupProjectTaskSearchShow(oParam, data)}
											});
										}
									};	
								},

					process:	function interfaceSetupProjectTaskSearchShow(oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
											
									if (oResponse.data.rows.length == 0)
									{
										$('#divns1blankspaceViewportControlOptions').hide();
									}
									else
									{
										aHTML[++h] = '<table class="interfaceSearchMedium">';
										aHTML[++h] = '<tbody>'
											
										$.each(oResponse.data.rows, function()
										{
											aHTML[++h] = '<tr class="interfaceSearch">';
										
											aHTML[++h] = '<td class="interfaceContactType' + onDemandXMLGetData(oRow, "type") + ' interfaceSearch">&nbsp;</td>';
											aHTML[++h] = '<td class="interfaceSearch class="interfaceProjectTaskType' + onDemandXMLGetData(oRow, "typetext") + '" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
															'-' + onDemandXMLGetData(oRow, "id") + '">' +
															onDemandXMLGetData(oRow, "title") +
															'</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML[++h] = '</tr>'
												iColumn = 0;
											}	
										});
								    	
										aHTML[++h] = '</tbody></table>';

										$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
										$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
										
										$('td.interfaceSearch').click(function(event)
										{
											$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
											$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
											interfaceSetupProjectTaskSearch(event.target.id, {source: 1});
										});
									}	
											
								}
				},

	layout:		function interfaceSetupProjectTaskViewport()
				{
					
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
					
					aHTML[++h] = '<table id="tableInterfaceViewportControl1" class="interfaceViewportControl">';
					
					aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
									'</tr>';
									
					aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
									'</tr>';
					
					aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlDescription" class="interfaceViewportControl">Description</td>' +
									'</tr>';
					
					aHTML[++h] = '</table>';					
					
					aHTML[++h] = '<table id="tableInterfaceViewportControl3" class="interfaceViewportControl">';
					
					aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlActions" class="interfaceViewportControl">Actions</td>' +
									'</tr>';
									
					aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
									'</tr>';
									
					aHTML[++h] = '</table>';								
							
					aHTML[++h] = '<table id="tableInterfaceViewportControl3" class="interfaceViewportControl">';
					
					aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
									'<td id="tdInterfaceViewportControlViewProject" class="interfaceViewportControl">View Project</td>' +
									'</tr>';
									
					aHTML[++h] = '</table>';			
					
					$('#divInterfaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainDescription" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainScheduling" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainActionDetails" class="divInterfaceViewportMain"></div>';
						
					$('#divInterfaceMain').html(aHTML.join(''));
					
					$('#tdInterfaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
						interfaceSetupProjectTaskSummary();
					});
					
					$('#tdInterfaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
						interfaceSetupProjectTaskDetails();
					});
					
					$('#tdInterfaceViewportControlDescription').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainDescription");
						interfaceSetupProjectTaskDescription();
					});
					
					$('#tdInterfaceViewportControlScheduling').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainScheduling");
						interfaceSetupProjectTaskScheduling("divInterfaceMainScheduling", true);
					});
					
					$('#tdInterfaceViewportControlActions').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainActions", true);
						interfaceSetupProjectTaskActions(
						{
							bindAdd: false,
							xhtmlElementId: 'divInterfaceMainActions',
							object: ns1blankspace.objectContext
						});
						
						$('#spanInterfaceMainActionsAdd').button(
						{
							label: "Add"
						})	
						.click(function() {
							 interfaceSetupProjectTaskActionDetails();
						})	

					});

					$('#tdInterfaceViewportControlAttachments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainAttachments", true);
						ns1blankspaceAttachments(
						{
							xhtmlElementID: "divInterfaceMainAttachments", 
							object: "11",
							objectContext: ns1blankspace.objectContext
						});
					});
					
					$('#tdInterfaceViewportControlViewProject').click(function(event)
					{
						interfaceSetupProjectMasterViewport();
						interfaceSetupProjectSearch('-' + giParentObjectContext)
					});
				},

	show:		function interfaceSetupProjectTaskShow(oParam, oResponse)
				{
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find template task.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
							
						interfaceSetupProjectTaskViewport();
										
						$('#divInterfaceViewportControlContext').html(onDemandXMLGetData(oRow, 'title'));
						$('#divInterfaceViewportControlContext').addClass('interfaceProjectTaskType' + onDemandXMLGetData(oRow, "typetext") + 'BG');
						giParentObjectContext = onDemandXMLGetData(oRow, "project");
						
						interfaceSetupProjectTaskSummary();
					}	
				},	
		
	summary:	function interfaceSetupProjectTaskSummary()
				{

					var aHTML = [];
					var h = -1;
					var oXML = ns1blankspace.objectContextDataXML;
					
					aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
					aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
								'<td id="tdInterfaceMainSummaryColumn1Large" class="interfaceMainColumn1Large">' +
									'</td>' +
									'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2Action">' +
									'</td>' +
									'</tr>';
					aHTML[++h] = '</table>';					
						
					$('#divInterfaceMainSummary').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find SetupProjectTask.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
						
						var sDescription = ns1blankspace.objectContextData.description;
						
						sDescription = sDescription.replace(/(\r\n|\r|\n)/g, "<br />");
						
						aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description<br /><br /></td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
										sDescription +
										'</td></tr>';
						
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;	
						
						aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2">';
												
						aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryViewProject" class="interfaceMainSummaryAction">' +
										'<a href="#" id="aInterfaceMainSummaryViewProject">View Project</a>' +
										'</td></tr>';
										
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));	
						
						$('#aInterfaceMainSummaryViewProject').click(function(event)
						{
							interfaceSetupProjectMasterViewport();
							interfaceSetupProjectSearch('-' + ns1blankspace.objectContextData.project)
						});
					}	
				},

	details:	function interfaceSetupProjectTaskDetails()
				{
					var aHTML = [];
					var h = -1;
					
					if ($('#divInterfaceMainDetails').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainDetails').attr('onDemandLoading', '');
						var oRow = oRoot.childNodes.item(0);
								
						aHTML[++h] = '<table id="tableInterfaceMainDetails" class="interfaceMainDetails">';
						aHTML[++h] = '<tr id="trInterfaceMainDetailsRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsColumn1" class="interfaceMainColumn1Large">' +
										'</td>' +
										'<td id="tdInterfaceMainDetailsColumn2" class="interfaceMain">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainDetails').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
						
						aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
						
						aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsTitle" class="interfaceMain">' +
											'<td id="tdInterfaceMainProjectTaskDetailsTitle" class="interfaceMain">' +
											'Title' +
											'</td></tr>' +
											'<tr id="trInterfaceMainProjectTaskDetailsTitleValue" class="interfaceMainText">' +
											'<td id="tdInterfaceMainProjectTaskDetailsTitleValue" class="interfaceMainText">' +
											'<input id="inputInterfaceMainProjectTaskDetailsTitle" class="inputInterfaceMainText">' +
											'</td></tr>';							
					
						aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsType" class="interfaceMain">' +
											'<td id="tdInterfaceMainProjectTaskDetailsType" class="interfaceMain">' +
											'Type' +
											'</td></tr>' +
											'<tr id="trInterfaceMainProjectTaskDetailsTypeValue" class="interfaceMainSelect">' +
											'<td id="tdInterfaceMainProjectTaskDetailsTypeValue" class="interfaceMainSelect">' +
											'<input id="inputInterfaceMainProjectTaskDetailsType" class="inputInterfaceMainSelect"' +
												' onDemandMethod="/ondemand/setup/?rf=XML&method=SETUP_PROJECT_TASK_TYPE_SEARCH">' +
											'</td></tr>';
					
						aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsTaskBy" class="interfaceMain">' +
											'<td id="tdInterfaceMainProjectTaskDetailsTaskBy" class="interfaceMain">' +
											'Task By' +
											'</td></tr>' +
											'<tr id="trInterfaceMainProjectTaskDetailsTaskByValue" class="interfaceMainSelect">' +
											'<td id="tdInterfaceMainProjectTaskDetailsTaskByValue" class="interfaceMainSelect">' +
											'<input id="inputInterfaceMainProjectTaskDetailsTaskBy" class="inputInterfaceMainSelect"' +
												' onDemandMethod="/ondemand/setup/?method=SETUP_USER_SEARCH&rf=XML" onDemandColumns="username">' +
											'</td></tr>';
					
						aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsTaskDependsOn" class="interfaceMain">' +
											'<td id="tdInterfaceMainProjectTaskDetailsTaskDependsOn" class="interfaceMain">' +
											'Depends On Task' +
											'</td></tr>' +
											'<tr id="trInterfaceMainProjectTaskDetailsTaskDependsOnValue" class="interfaceMainSelect">' +
											'<td id="tdInterfaceMainProjectTaskDetailsTaskDependsOnValue" class="interfaceMainSelect">' +
											'<input id="inputInterfaceMainProjectTaskDetailsTaskDependsOn" class="inputInterfaceMainSelect"' +
												' onDemandMethod="/ondemand/project/?rf=XML&method=PROJECT_TASK_SEARCH&project=' + onDemandXMLGetData(oRow, 'project') + '">' +
											'</td></tr>';
					
						aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsStartBasedOn" class="interfaceMain">' +
											'<td id="tdInterfaceMainProjectTaskDetailsStartBasedOn" class="interfaceMain">' +
											'Start Date Is Based On' +
											'</td></tr>' +
											'<tr id="trInterfaceMainProjectTaskDetailsStartBasedOnValue" class="interfaceMainText">' +
											'<td id="tdInterfaceMainProjectTaskDetailsStartBasedOnValue" class="interfaceMainText">' +
											'<input type="radio" id="radioStartBasedOn1" name="radioStartBasedOn" value="1"/>When Dependant Task Completed' +
												'&nbsp;&nbsp;<input type="radio" id="radioStartBasedOn2" name="radioStartBasedOn" value="2"/>Project Start Date<br /><br />';
											'</td></tr>';
					
						aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsStartDays" class="interfaceMain">' +
											'<td id="tdInterfaceMainProjectTaskDetailsStartDays" class="interfaceMain">' +
											'Days Before Start' +
											'</td></tr>' +
											'<tr id="trInterfaceMainProjectTaskDetailsStartDaysValue" class="interfaceMainText">' +
											'<td id="tdInterfaceMainProjectTaskDetailsStartDaysValue" class="interfaceMainText">' +
											'<input id="inputInterfaceMainProjectTaskDetailsStartDays" class="inputInterfaceMainText">' +
											'</td></tr>';				
					
						aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsDurationDays" class="interfaceMain">' +
											'<td id="tdInterfaceMainProjectTaskDetailsDurationDays" class="interfaceMain">' +
											'Duration (Elapsed Days)' +
											'</td></tr>' +
											'<tr id="trInterfaceMainProjectTaskDetailsDurationDaysValue" class="interfaceMainText">' +
											'<td id="tdInterfaceMainProjectTaskDetailsDurationDaysValue" class="interfaceMainText">' +
											'<input id="inputInterfaceMainProjectTaskDetailsDurationDays" class="inputInterfaceMainText">' +
											'</td></tr>';	
											
						aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsDisplayOrder" class="interfaceMain">' +
											'<td id="tdInterfaceMainProjectTaskDetailsDisplayOrder" class="interfaceMain">' +
											'Display Order' +
											'</td></tr>' +
											'<tr id="trInterfaceMainProjectTaskDetailsDisplayOrderValue" class="interfaceMainText">' +
											'<td id="tdInterfaceMainProjectTaskDetailsDisplayOrderValue" class="interfaceMainText">' +
											'<input id="inputInterfaceMainProjectTaskDetailsDisplayOrder" class="inputInterfaceMainText">' +
											'</td></tr>';						

						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
						
						$('#trInterfaceMainProjectTaskDetailsTaskBy').hide();
						
						var aHTML = [];
						var h = -1;
							
						aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
						
						aHTML[++h] = '</table>';					
							
						$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputInterfaceMainProjectTaskDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#inputInterfaceMainProjectTaskDetailsType').attr('onDemandID', ns1blankspace.objectContextData.type);
							$('#inputInterfaceMainProjectTaskDetailsType').val(ns1blankspace.objectContextData.typetext);
							$('#inputInterfaceMainProjectTaskDetailsTaskBy').attr('onDemandID', ns1blankspace.objectContextData.taskbyuser);
							$('#inputInterfaceMainProjectTaskDetailsTaskBy').val(ns1blankspace.objectContextData.taskbyusertext);
							$('#inputInterfaceMainProjectTaskDetailsTaskDependsOn').attr('onDemandID', ns1blankspace.objectContextData.templatedependsontask);
							$('#inputInterfaceMainProjectTaskDetailsTaskDependsOn').val(ns1blankspace.objectContextData.templatedependsontasktext);
							
							$('[name="radioStartBasedOn"][value="' + ns1blankspace.objectContextData.templateelapsedstartdatetype + '"]').attr('checked', true);
						
							$('#inputInterfaceMainProjectTaskDetailsStartDays').val(ns1blankspace.objectContextData.templateelapsedstartdatedurationdays);
							$('#inputInterfaceMainProjectTaskDetailsDurationDays').val(ns1blankspace.objectContextData.templateelapseddurationdays);
							$('#inputInterfaceMainProjectTaskDetailsDisplayOrder').val(ns1blankspace.objectContextData.displayorder);
						}
					}	
				},

	description:
				function interfaceSetupProjectTaskDescription()
				{
					
					var aHTML = [];
					var h = -1;
					
					if ($('#divInterfaceMainDescription').attr('onDemandLoading') == '1')
					{
						$('#divInterfaceMainDescription').attr('onDemandLoading', '');
								
						aHTML[++h] = '<table id="tableInterfaceMainDescription" class="interfaceMain">';
						aHTML[++h] = '<tr id="trInterfaceMainDescriptionRow1" class="interfaceMain">' +
										'<td id="tdInterfaceMainDescriptionColumn1" class="interfaceMainColumn1Large">' +
										'</td>' +
										'<td id="tdInterfaceMainDescriptionColumn2" class="interfaceMain">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMainDescription').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tableInterfaceMainDescriptionColumn1" class="interfaceMain">';
								
						aHTML[++h] = '<tr id="trInterfaceMainDescriptionValue" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainDescriptionValue" class="interfaceMainTextMulti">' +
										'<textarea rows="30" cols="50" id="inputInterfaceMainDescription" class="inputInterfaceMainTextMulti inputInterfaceMainTextMultiLarge"></textarea>' +
										'</td></tr>';
										
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainDescriptionColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputInterfaceMainDescription').val(unescape(ns1blankspace.objectContextData.description));
						}
					
						//tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainDescription');
					}	
				},

	save: 		{
					send: 		function interfaceSetupProjectTaskSave()
								{
									var sParam = '/ondemand/project/?method=PROJECT_TASK_MANAGE'
									var sData = (ns1blankspace.objectContext == -1)?'':'&id=' + ns1blankspace.objectContext;
										
									if ($('#divInterfaceMainDetails').html() != '')
									{
										sData += '&title=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsTitle').val());
										sData += '&type=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsType').attr('onDemandID'));
										sData += '&taskbyuser=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsTaskBy').attr('onDemandID'));
										sData += '&taskdependson=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsTaskDependsOn').attr('onDemandID'));
										sData += '&taskstartbasedon=' + $('input[name="radioStartBasedOn"]:checked').val();
										sData += '&daysbeforestart=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsStartDays').val());
										sData += '&durationdays=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsDurationDays').val());
										sData += '&displayorder=' + encodeURIComponent($('#inputInterfaceMainProjectTaskDetailsDisplayOrder').val());
									}

									if ($('#divInterfaceMainDescription').html() != '')
									{
										sData += '&description=' + encodeURIComponent($('#inputInterfaceMainDescription').val());
									}
									
									ns1blankspaceSave(sParam, sData, 'Template Task Saved');	
								}
				},
				
	actions: 	{
					show:		function interfaceSetupProjectTaskActionDetails(oParam, oResponse)
								{

									var sXHTMLElementId = "divInterfaceMainActionDetails";
									var sXHTMLElementContextId;
									var lProjectTask;
									
									if (oParam != undefined)
									{
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
										if (oParam.xhtmlElementContextId != undefined) {sXHTMLElementContextId = oParam.xhtmlElementContextId}
										if (oParam.action != undefined) {lAction = oParam.action}
									}

									if (sXHTMLElementContextId != undefined)
									{
										var aSearch = sXHTMLElementContextId.split('-');
										var sElementId = aSearch[0];
										var lAction = aSearch[1];
									}	
										
									ns1blankspaceMainViewportShow('#' + sXHTMLElementId);	
										
									var aHTML = [];
									var h = -1;
										
									aHTML[++h] = '<table id="tableInterfaceMainProjectTaskActionDetails" class="interfaceMain">' +
													'<tr id="trInterfaceMainProjectTaskActionDetailsRow1" class="interfaceMainRow1">' +
													'<td id="tdInterfaceMainProjectTaskActionDetailsColumn1" class="interfaceMainColumn1Large">' +
													'</td>' +
													'<td id="tdInterfaceMainProjectTaskActionDetailsColumn2" class="interfaceMainColumn2Action">' +
													'</td>' +
													'</tr>' +
													'</table>';				
										
									$('#' + sXHTMLElementId).html(aHTML.join(''));

									if (oResponse == undefined && lAction != undefined)
									{
										var sParam = 'method=ACTION_SEARCH' +
														'&id=' + lAction;
										
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/action/',
											data: sParam,
											dataType: 'json',
											success: function(data){interfaceSetupProjectTaskActionDetails(oParam, data)}
										});
									}
									else
									{
										for (edId in tinyMCE.editors) 
											tinyMCE.editors[edId].destroy(true);
											
										var aHTML = [];
										var h = -1;
										
										aHTML[++h] = '<table id="tableInterfaceMainTaskDetailsColumn2" class="interfaceMainColumn2">';
										
										aHTML[++h] = '<tr><td id="tdInterfaceMainTaskActionDetailsSave" class="interfaceMain">' +
														'<span id="spanInterfaceMainTaskActionDetailsSave">Save</span>' +
														'</td></tr>';
																
										aHTML[++h] = '</table>';					
										
										$('#tdInterfaceMainProjectTaskActionDetailsColumn2').html(aHTML.join(''));
										
										$('#spanInterfaceMainTaskActionDetailsSave').button(
										{
											label: "Save"
										})
										.click(function() {
											interfaceSetupProjectTaskActionDetailsSave(oParam);
										})
										
										var aHTML = [];
										var h = -1;
															
										aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';					
															
										aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsSubject" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsSubject" class="interfaceMain">' +
															'Subject' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsSubjectValue" class="interfaceMainText">' +
															'<td id="tdInterfaceMainProjectTaskDetailsSubjectValue" class="interfaceMainText">' +
															'<input id="inputInterfaceMainProjectTaskDetailsSubject" class="inputInterfaceMainText">' +
															'</td></tr>';		
															
										ns1blankspace.counter.editor = + ns1blankspace.counter.editor + 1;
									
										aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsDescriptionValue" class="interfaceMainTextMulti">' +
															'<td id="tdInterfaceMainProjectTaskDetailsDescriptionValue" class="interfaceMainTextMulti">' +
															'<textarea rows="10" cols="50" style="width:100%;" ' +
															'id="inputInterfaceMainProjectTaskDetailsDescription' + ns1blankspace.counter.editor + '" class="inputInterfaceMainTextMulti"></textarea>' +
															'</td></tr>';
									
										aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsType" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsType" class="interfaceMain">' +
															'Type' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsTypeValue" class="interfaceMainSelect">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTypeValue" class="interfaceMainSelect">' +
															'<input id="inputInterfaceMainProjectTaskActionDetailsType" class="inputInterfaceMainSelect"' +
																' onDemandMethod="/ondemand/setup/?rf=XML&method=SETUP_ACTION_TYPE_SEARCH">' +
															'</td></tr>';
									
										aHTML[++h] = '<tr id="trInterfaceMainProjectTaskDetailsTaskBy" class="interfaceMain">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTaskBy" class="interfaceMain">' +
															'Task By' +
															'</td></tr>' +
															'<tr id="trInterfaceMainProjectTaskDetailsTaskByValue" class="interfaceMainSelect">' +
															'<td id="tdInterfaceMainProjectTaskDetailsTaskByValue" class="interfaceMainSelect">' +
															'<input id="inputInterfaceMainProjectTaskActionDetailsTaskBy" class="inputInterfaceMainSelect"' +
																' onDemandMethod="SETUP_USER_SEARCH" onDemandColumns="username">' +
															'</td></tr>';
										
										aHTML[++h] = '</table>';						
									
										$('#tdInterfaceMainProjectTaskActionDetailsColumn1').html(aHTML.join(''));
										
										if (oResponse != undefined)
										{
											if (oResponse.data.rows.length != 0)
											{
												$('#inputInterfaceMainProjectTaskDetailsSubject').val(oResponse.data.rows[0].subject);
												
												$('#inputInterfaceMainProjectTaskDetailsDescription' + ns1blankspace.counter.editor).val(ns1blankspaceFormatXHTML(oResponse.data.rows[0].description));	
												
												$('#inputInterfaceMainProjectTaskActionDetailsType').attr('onDemandID', oResponse.data.rows[0].type);
												$('#inputInterfaceMainProjectTaskActionDetailsType').val(oResponse.data.rows[0].typetext);
												$('#inputInterfaceMainProjectTaskActionDetailsTaskBy').attr('onDemandID', oResponse.data.rows[0].actionby);
												$('#inputInterfaceMainProjectTaskActionDetailsTaskBy').val(oResponse.data.rows[0].actionbyfirstname + ' ' + oResponse.data.rows[0].actionbysurname);
											}
										}	
										
										tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainProjectTaskDetailsDescription' + ns1blankspace.counter.editor);
									}	
								},	

					remove:		function interfaceSetupProjectTaskActionRemove(sXHTMLElementId)
								{

									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									
									//var sParam = 'method=ACTION_MANAGE&remove=1';
									var sParam = 'method=ACTION_MANAGE&object=' + (-1 * ns1blankspace.objectProjectTask);
									var sData = 'id=' + sSearchContext;
												
									$.ajax(
										{
											type: 'POST',
											url: '/ondemand/action/?' + sParam,
											data: sData,
											dataType: 'text',
											success: function(data){$('#' + sXHTMLElementId).parent().parent().fadeOut(500)}
										});
										
								},

					save:		function interfaceSetupProjectTaskActionDetailsSave(oParam)
								{
									var sParam = '/ondemand/action/?rf=JSON&method=ACTION_MANAGE';
									var sData = '';
									var bAsync = true;
									//var ns1blankspace.report.today = new Date();
									//ns1blankspace.report.today = ns1blankspace.report.today.format('yyyy-mm-dd');
									var iAction;
									var sXHTMLElementContextId;
									
									if (oParam != undefined)
									{
										if (oParam.action != undefined) {iAction = oParam.action}
										if (oParam.xhtmlElementContextId != undefined) {sXHTMLElementContextId = oParam.xhtmlElementContextId}
									}	
									
									if (sXHTMLElementContextId != undefined)
									{
										var aSearch = sXHTMLElementContextId.split('-');
										var iAction = aSearch[1];
									}	
									
									if (iAction != undefined)
									{
											sData += 'id=' + iAction;
									}
									else
									{
										sData += 'object=' + ns1blankspace.objectProjectTask;
										sData += '&objectcontext=' + ns1blankspace.objectContext;
									}
									
									sData += '&subject=' + ns1blankspaceFormatValue($('#inputInterfaceMainProjectTaskDetailsSubject').val());
									sData += '&description=' + ns1blankspaceFormatValue(tinyMCE.get('inputInterfaceMainProjectTaskDetailsDescription' + ns1blankspace.counter.editor).getContent());
									sData += '&type=' + ns1blankspaceFormatValue($('#inputInterfaceMainProjectTaskActionDetailsType').attr('onDemandID'));
									sData += '&actionby=' + ns1blankspaceFormatValue($('#inputInterfaceMainProjectTaskActionDetailsTaskBy').attr('onDemandID'));
										  
									$.ajax(
									{
										type: 'POST',
										url: sParam,
										data: sData,
										dataType: 'json',
										async: bAsync,
										success: function(data) {
												ns1blankspaceStatus('Action saved');
												ns1blankspaceMainViewportShow("#divInterfaceMainActions");
												interfaceSetupProjectTaskActions(
													{
														actions: {add: false},
														xhtmlElementID: 'tdInterfaceMainActionsColumn1'
													});
												
												}
									});	
								}
				}
}								



