/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.setup.projectTask = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 11;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'projectTask';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Project Templates';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.projectTask.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);

					if (ns1blankspace.option.richTextEditing)
					{
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
							
							external_link_list_url : "/jscripts/ibcom/linkList.asp", //???
							
							forced_root_block : false,
							force_p_newlines : 'false',
							remove_linebreaks : false,
							force_br_newlines : true, 
							remove_trailing_nbsp : false,   
							verify_html : false
						});
					}
				},

	home: 		function (oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ins1blankspaceMain">' +
										ns1blankspace.xhtml.loading + '</td></tr></table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						var aHTML = [];
									
						aHTML.push('<table><tr><td id="ns1blankspaceViewProjectLarge"' +
										' class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>' +
										'</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
									
						var oSearch = new AdvancedSearch();
						oSearch.method = 'PROJECT_TASK_SEARCH';
						oSearch.addField('reference,description');
						oSearch.rf = 'json';
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(ns1blankspace.setup.projectTask.home);
					}
					else
					{
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a new project template task.</td></tr>' +
											'</table>');
						}
						else
						{
								aHTML.push('<table><tr><td class="ns1blankspaceCaption">MOST LIKELY</td></tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + '" class="ns1blankspaceMostLikely">' +
														this.reference + '</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.setup.projectTask.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function (sXHTMLElementID, oParam)
								{	
									var aSearch = sXHTMLElementID.split('-');
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
										$('#ns1blankspaceViewControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
		
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('PROJECT_TASK_SEARCH'),
											data: 'id=' + ns1blankspace.objectContext,
											dataType: 'json',
											success: function(data) {ns1blankspace.setup.projectTask.show(oParam, data)}
										});
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
											sSearchText = aSearch[1];
											sElementId = 'ns1blankspaceViewControlBrowse';
											sQuickSearchType = 'start';
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.container.position(sElementId);
											
											var sParam = 'method=PROJECT_TASK_SEARCH&quicksearch' + sQuickSearchType + '=' + sSearchText;

											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('PROJECT_TASK_SEARCH'),
												data: 'quicksearch' + sQuickSearchType + '=' + sSearchText,
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.projectTask.process(oParam, data)}
											});
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
											
									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.container).hide();
									}
									else
									{
										aHTML[++h] = '<table class="ns1blankspaceSearchMedium">';
										aHTML[++h] = '<tbody>'
											
										$.each(oResponse.data.rows, function()
										{
											aHTML[++h] = '<tr class="ns1blankspaceSearch">';
										
											aHTML[++h] = '<td class="ns1blankspaceContactType' + onDemandXMLGetData(oRow, "type") + ' ns1blankspaceSearch">&nbsp;</td>';
											aHTML[++h] = '<td class="ns1blankspaceSearch class="ns1blankspaceProjectTaskType' + onDemandXMLGetData(oRow, "typetext") + '" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
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

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspaceSetupProjectTaskSearch(event.target.id, {source: 1});
										});
									}	
											
								}
				},

	layout:		function ()
				{
					
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divns1blankspaceViewportControlContext" class="ns1blankspaceViewportControlContext"></div>';
					
					aHTML[++h] = '<table id="tablens1blankspaceViewportControl1" class="ns1blankspaceViewportControl">';
					
					aHTML[++h] = '<tr id="trns1blankspaceViewportControl1" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlSummary" class="ns1blankspaceViewportControl ns1blankspaceViewportControlHighlight">Summary</td>' +
									'</tr>';
									
					aHTML[++h] = '<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlDetails" class="ns1blankspaceViewportControl">Details</td>' +
									'</tr>';
					
					aHTML[++h] = '<tr id="trns1blankspaceViewportControl2" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlDescription" class="ns1blankspaceViewportControl">Description</td>' +
									'</tr>';
					
					aHTML[++h] = '</table>';					
					
					aHTML[++h] = '<table id="tablens1blankspaceViewportControl3" class="ns1blankspaceViewportControl">';
					
					aHTML[++h] = '<tr id="trns1blankspaceViewportControl" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlActions" class="ns1blankspaceViewportControl">Actions</td>' +
									'</tr>';
									
					aHTML[++h] = '<tr id="trns1blankspaceViewportControl" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlAttachments" class="ns1blankspaceViewportControl">Attachments</td>' +
									'</tr>';
									
					aHTML[++h] = '</table>';								
							
					aHTML[++h] = '<table id="tablens1blankspaceViewportControl3" class="ns1blankspaceViewportControl">';
					
					aHTML[++h] = '<tr id="trns1blankspaceViewportControl" class="ns1blankspaceViewportControl">' +
									'<td id="tdns1blankspaceViewportControlViewProject" class="ns1blankspaceViewportControl">View Project</td>' +
									'</tr>';
									
					aHTML[++h] = '</table>';			
					
					$('#divns1blankspaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divns1blankspaceMainSummary" class="divns1blankspaceViewportMain"></div>';
					aHTML[++h] = '<div id="divns1blankspaceMainDetails" class="divns1blankspaceViewportMain"></div>';
					aHTML[++h] = '<div id="divns1blankspaceMainDescription" class="divns1blankspaceViewportMain"></div>';
					aHTML[++h] = '<div id="divns1blankspaceMainScheduling" class="divns1blankspaceViewportMain"></div>';
					aHTML[++h] = '<div id="divns1blankspaceMainActions" class="divns1blankspaceViewportMain"></div>';
					aHTML[++h] = '<div id="divns1blankspaceMainAttachments" class="divns1blankspaceViewportMain"></div>';
					aHTML[++h] = '<div id="divns1blankspaceMainActionDetails" class="divns1blankspaceViewportMain"></div>';
						
					$('#divns1blankspaceMain').html(aHTML.join(''));
					
					$('#tdns1blankspaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainSummary");
						ns1blankspaceSetupProjectTaskSummary();
					});
					
					$('#tdns1blankspaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainDetails");
						ns1blankspaceSetupProjectTaskDetails();
					});
					
					$('#tdns1blankspaceViewportControlDescription').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainDescription");
						ns1blankspaceSetupProjectTaskDescription();
					});
					
					$('#tdns1blankspaceViewportControlScheduling').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainScheduling");
						ns1blankspaceSetupProjectTaskScheduling("divns1blankspaceMainScheduling", true);
					});
					
					$('#tdns1blankspaceViewportControlActions').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainActions", true);
						ns1blankspaceSetupProjectTaskActions(
						{
							bindAdd: false,
							xhtmlElementId: 'divns1blankspaceMainActions',
							object: ns1blankspace.objectContext
						});
						
						$('#spanns1blankspaceMainActionsAdd').button(
						{
							label: "Add"
						})	
						.click(function() {
							 ns1blankspaceSetupProjectTaskActionDetails();
						})	

					});

					$('#tdns1blankspaceViewportControlAttachments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divns1blankspaceMainAttachments", true);
						ns1blankspaceAttachments(
						{
							xhtmlElementID: "divns1blankspaceMainAttachments", 
							object: "11",
							objectContext: ns1blankspace.objectContext
						});
					});
					
					$('#tdns1blankspaceViewportControlViewProject').click(function(event)
					{
						ns1blankspaceSetupProjectMasterViewport();
						ns1blankspaceSetupProjectSearch('-' + giParentObjectContext)
					});
				},

	show:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find template task.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
							
						ns1blankspaceSetupProjectTaskViewport();
										
						$('#divns1blankspaceViewportControlContext').html(onDemandXMLGetData(oRow, 'title'));
						$('#divns1blankspaceViewportControlContext').addClass('ns1blankspaceProjectTaskType' + onDemandXMLGetData(oRow, "typetext") + 'BG');
						giParentObjectContext = onDemandXMLGetData(oRow, "project");
						
						ns1blankspaceSetupProjectTaskSummary();
					}	
				},	
		
	summary:	function ()
				{

					var aHTML = [];
					var h = -1;
					var oXML = ns1blankspace.objectContextDataXML;
					
					aHTML[++h] = '<table id="tablens1blankspaceMainSummary" class="ns1blankspaceMain">';
					aHTML[++h] = '<tr id="trns1blankspaceMainSummaryRow1" class="ns1blankspaceMainRow1">' +
								'<td id="tdns1blankspaceMainSummaryColumn1Large" class="ns1blankspaceMainColumn1Large">' +
									'</td>' +
									'<td id="tdns1blankspaceMainSummaryColumn2" class="ns1blankspaceMainColumn2Action">' +
									'</td>' +
									'</tr>';
					aHTML[++h] = '</table>';					
						
					$('#divns1blankspaceMainSummary').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find SetupProjectTask.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML[++h] = '<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMainColumn1">';
						
						var sDescription = ns1blankspace.objectContextData.description;
						
						sDescription = sDescription.replace(/(\r\n|\r|\n)/g, "<br />");
						
						aHTML[++h] = '<tr><td id="tdns1blankspaceMainSummaryDescription" class="ns1blankspaceMainSummary">Description<br /><br /></td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummaryDescriptionValue" class="ns1blankspaceMainSummaryValue">' +
										sDescription +
										'</td></tr>';
						
						aHTML[++h] = '</table>';					
						
						$('#tdns1blankspaceMainSummaryColumn1Large').html(aHTML.join(''));

						var aHTML = [];
						var h = -1;	
						
						aHTML[++h] = '<table id="tablens1blankspaceMainColumn2" class="ns1blankspaceMainColumn2">';
												
						aHTML[++h] = '<tr><td id="tdns1blankspaceMainSummaryViewProject" class="ns1blankspaceMainSummaryAction">' +
										'<a href="#" id="ans1blankspaceMainSummaryViewProject">View Project</a>' +
										'</td></tr>';
										
						aHTML[++h] = '</table>';					
						
						$('#tdns1blankspaceMainSummaryColumn2').html(aHTML.join(''));	
						
						$('#ans1blankspaceMainSummaryViewProject').click(function(event)
						{
							ns1blankspaceSetupProjectMasterViewport();
							ns1blankspaceSetupProjectSearch('-' + ns1blankspace.objectContextData.project)
						});
					}	
				},

	details:	function ()
				{
					var aHTML = [];
					var h = -1;
					
					if ($('#divns1blankspaceMainDetails').attr('onDemandLoading') == '1')
					{
						$('#divns1blankspaceMainDetails').attr('onDemandLoading', '');
						var oRow = oRoot.childNodes.item(0);
								
						aHTML[++h] = '<table id="tablens1blankspaceMainDetails" class="ns1blankspaceMainDetails">';
						aHTML[++h] = '<tr id="trns1blankspaceMainDetailsRow1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsColumn1" class="ns1blankspaceMainColumn1Large">' +
										'</td>' +
										'<td id="tdns1blankspaceMainDetailsColumn2" class="ns1blankspaceMain">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divns1blankspaceMainDetails').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
						
						aHTML[++h] = '<table id="tablens1blankspaceMainDetailsColumn1" class="ns1blankspaceMain">';
						
						aHTML[++h] = '<tr id="trns1blankspaceMainProjectTaskDetailsTitle" class="ns1blankspaceMain">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsTitle" class="ns1blankspaceMain">' +
											'Title' +
											'</td></tr>' +
											'<tr id="trns1blankspaceMainProjectTaskDetailsTitleValue" class="ns1blankspaceMainText">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsTitleValue" class="ns1blankspaceMainText">' +
											'<input id="inputns1blankspaceMainProjectTaskDetailsTitle" class="inputns1blankspaceMainText">' +
											'</td></tr>';							
					
						aHTML[++h] = '<tr id="trns1blankspaceMainProjectTaskDetailsType" class="ns1blankspaceMain">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsType" class="ns1blankspaceMain">' +
											'Type' +
											'</td></tr>' +
											'<tr id="trns1blankspaceMainProjectTaskDetailsTypeValue" class="ns1blankspaceMainSelect">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsTypeValue" class="ns1blankspaceMainSelect">' +
											'<input id="inputns1blankspaceMainProjectTaskDetailsType" class="inputns1blankspaceMainSelect"' +
												' onDemandMethod="/ondemand/setup/?rf=XML&method=SETUP_PROJECT_TASK_TYPE_SEARCH">' +
											'</td></tr>';
					
						aHTML[++h] = '<tr id="trns1blankspaceMainProjectTaskDetailsTaskBy" class="ns1blankspaceMain">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsTaskBy" class="ns1blankspaceMain">' +
											'Task By' +
											'</td></tr>' +
											'<tr id="trns1blankspaceMainProjectTaskDetailsTaskByValue" class="ns1blankspaceMainSelect">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsTaskByValue" class="ns1blankspaceMainSelect">' +
											'<input id="inputns1blankspaceMainProjectTaskDetailsTaskBy" class="inputns1blankspaceMainSelect"' +
												' onDemandMethod="/ondemand/setup/?method=SETUP_USER_SEARCH&rf=XML" onDemandColumns="username">' +
											'</td></tr>';
					
						aHTML[++h] = '<tr id="trns1blankspaceMainProjectTaskDetailsTaskDependsOn" class="ns1blankspaceMain">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsTaskDependsOn" class="ns1blankspaceMain">' +
											'Depends On Task' +
											'</td></tr>' +
											'<tr id="trns1blankspaceMainProjectTaskDetailsTaskDependsOnValue" class="ns1blankspaceMainSelect">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsTaskDependsOnValue" class="ns1blankspaceMainSelect">' +
											'<input id="inputns1blankspaceMainProjectTaskDetailsTaskDependsOn" class="inputns1blankspaceMainSelect"' +
												' onDemandMethod="/ondemand/project/?rf=XML&method=PROJECT_TASK_SEARCH&project=' + onDemandXMLGetData(oRow, 'project') + '">' +
											'</td></tr>';
					
						aHTML[++h] = '<tr id="trns1blankspaceMainProjectTaskDetailsStartBasedOn" class="ns1blankspaceMain">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsStartBasedOn" class="ns1blankspaceMain">' +
											'Start Date Is Based On' +
											'</td></tr>' +
											'<tr id="trns1blankspaceMainProjectTaskDetailsStartBasedOnValue" class="ns1blankspaceMainText">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsStartBasedOnValue" class="ns1blankspaceMainText">' +
											'<input type="radio" id="radioStartBasedOn1" name="radioStartBasedOn" value="1"/>When Dependant Task Completed' +
												'&nbsp;&nbsp;<input type="radio" id="radioStartBasedOn2" name="radioStartBasedOn" value="2"/>Project Start Date<br /><br />';
											'</td></tr>';
					
						aHTML[++h] = '<tr id="trns1blankspaceMainProjectTaskDetailsStartDays" class="ns1blankspaceMain">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsStartDays" class="ns1blankspaceMain">' +
											'Days Before Start' +
											'</td></tr>' +
											'<tr id="trns1blankspaceMainProjectTaskDetailsStartDaysValue" class="ns1blankspaceMainText">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsStartDaysValue" class="ns1blankspaceMainText">' +
											'<input id="inputns1blankspaceMainProjectTaskDetailsStartDays" class="inputns1blankspaceMainText">' +
											'</td></tr>';				
					
						aHTML[++h] = '<tr id="trns1blankspaceMainProjectTaskDetailsDurationDays" class="ns1blankspaceMain">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsDurationDays" class="ns1blankspaceMain">' +
											'Duration (Elapsed Days)' +
											'</td></tr>' +
											'<tr id="trns1blankspaceMainProjectTaskDetailsDurationDaysValue" class="ns1blankspaceMainText">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsDurationDaysValue" class="ns1blankspaceMainText">' +
											'<input id="inputns1blankspaceMainProjectTaskDetailsDurationDays" class="inputns1blankspaceMainText">' +
											'</td></tr>';	
											
						aHTML[++h] = '<tr id="trns1blankspaceMainProjectTaskDetailsDisplayOrder" class="ns1blankspaceMain">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsDisplayOrder" class="ns1blankspaceMain">' +
											'Display Order' +
											'</td></tr>' +
											'<tr id="trns1blankspaceMainProjectTaskDetailsDisplayOrderValue" class="ns1blankspaceMainText">' +
											'<td id="tdns1blankspaceMainProjectTaskDetailsDisplayOrderValue" class="ns1blankspaceMainText">' +
											'<input id="inputns1blankspaceMainProjectTaskDetailsDisplayOrder" class="inputns1blankspaceMainText">' +
											'</td></tr>';						

						aHTML[++h] = '</table>';					
						
						$('#tdns1blankspaceMainDetailsColumn1').html(aHTML.join(''));
						
						$('#trns1blankspaceMainProjectTaskDetailsTaskBy').hide();
						
						var aHTML = [];
						var h = -1;
							
						aHTML[++h] = '<table id="tablens1blankspaceMainDetailsColumn2" class="ns1blankspaceMain">';
						
						aHTML[++h] = '</table>';					
							
						$('#tdns1blankspaceMainDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputns1blankspaceMainProjectTaskDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#inputns1blankspaceMainProjectTaskDetailsType').attr('onDemandID', ns1blankspace.objectContextData.type);
							$('#inputns1blankspaceMainProjectTaskDetailsType').val(ns1blankspace.objectContextData.typetext);
							$('#inputns1blankspaceMainProjectTaskDetailsTaskBy').attr('onDemandID', ns1blankspace.objectContextData.taskbyuser);
							$('#inputns1blankspaceMainProjectTaskDetailsTaskBy').val(ns1blankspace.objectContextData.taskbyusertext);
							$('#inputns1blankspaceMainProjectTaskDetailsTaskDependsOn').attr('onDemandID', ns1blankspace.objectContextData.templatedependsontask);
							$('#inputns1blankspaceMainProjectTaskDetailsTaskDependsOn').val(ns1blankspace.objectContextData.templatedependsontasktext);
							
							$('[name="radioStartBasedOn"][value="' + ns1blankspace.objectContextData.templateelapsedstartdatetype + '"]').attr('checked', true);
						
							$('#inputns1blankspaceMainProjectTaskDetailsStartDays').val(ns1blankspace.objectContextData.templateelapsedstartdatedurationdays);
							$('#inputns1blankspaceMainProjectTaskDetailsDurationDays').val(ns1blankspace.objectContextData.templateelapseddurationdays);
							$('#inputns1blankspaceMainProjectTaskDetailsDisplayOrder').val(ns1blankspace.objectContextData.displayorder);
						}
					}	
				},

	description:
				function ()
				{
					
					var aHTML = [];
					var h = -1;
					
					if ($('#divns1blankspaceMainDescription').attr('onDemandLoading') == '1')
					{
						$('#divns1blankspaceMainDescription').attr('onDemandLoading', '');
								
						aHTML[++h] = '<table id="tablens1blankspaceMainDescription" class="ns1blankspaceMain">';
						aHTML[++h] = '<tr id="trns1blankspaceMainDescriptionRow1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDescriptionColumn1" class="ns1blankspaceMainColumn1Large">' +
										'</td>' +
										'<td id="tdns1blankspaceMainDescriptionColumn2" class="ns1blankspaceMain">' +
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divns1blankspaceMainDescription').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
					
						aHTML[++h] = '<table id="tablens1blankspaceMainDescriptionColumn1" class="ns1blankspaceMain">';
								
						aHTML[++h] = '<tr id="trns1blankspaceMainDescriptionValue" class="ns1blankspaceMainTextMulti">' +
										'<td id="tdns1blankspaceMainDescriptionValue" class="ns1blankspaceMainTextMulti">' +
										'<textarea rows="30" cols="50" id="inputns1blankspaceMainDescription" class="inputns1blankspaceMainTextMulti inputns1blankspaceMainTextMultiLarge"></textarea>' +
										'</td></tr>';
										
						aHTML[++h] = '</table>';					
						
						$('#tdns1blankspaceMainDescriptionColumn1').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputns1blankspaceMainDescription').val(unescape(ns1blankspace.objectContextData.description));
						}
					
						//tinyMCE.execCommand('mceAddControl', false, 'inputns1blankspaceMainDescription');
					}	
				},

	save: 		{
					send: 		function ()
								{
									var sParam = '/ondemand/project/?method=PROJECT_TASK_MANAGE'
									var sData = (ns1blankspace.objectContext == -1)?'':'&id=' + ns1blankspace.objectContext;
										
									if ($('#divns1blankspaceMainDetails').html() != '')
									{
										sData += '&title=' + encodeURIComponent($('#inputns1blankspaceMainProjectTaskDetailsTitle').val());
										sData += '&type=' + encodeURIComponent($('#inputns1blankspaceMainProjectTaskDetailsType').attr('onDemandID'));
										sData += '&taskbyuser=' + encodeURIComponent($('#inputns1blankspaceMainProjectTaskDetailsTaskBy').attr('onDemandID'));
										sData += '&taskdependson=' + encodeURIComponent($('#inputns1blankspaceMainProjectTaskDetailsTaskDependsOn').attr('onDemandID'));
										sData += '&taskstartbasedon=' + $('input[name="radioStartBasedOn"]:checked').val();
										sData += '&daysbeforestart=' + encodeURIComponent($('#inputns1blankspaceMainProjectTaskDetailsStartDays').val());
										sData += '&durationdays=' + encodeURIComponent($('#inputns1blankspaceMainProjectTaskDetailsDurationDays').val());
										sData += '&displayorder=' + encodeURIComponent($('#inputns1blankspaceMainProjectTaskDetailsDisplayOrder').val());
									}

									if ($('#divns1blankspaceMainDescription').html() != '')
									{
										sData += '&description=' + encodeURIComponent($('#inputns1blankspaceMainDescription').val());
									}
									
									ns1blankspaceSave(sParam, sData, 'Template Task Saved');	
								}
				},
				
	actions: 	{
					show:		function (oParam, oResponse)
								{

									var sXHTMLElementId = "divns1blankspaceMainActionDetails";
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
										
									aHTML[++h] = '<table id="tablens1blankspaceMainProjectTaskActionDetails" class="ns1blankspaceMain">' +
													'<tr id="trns1blankspaceMainProjectTaskActionDetailsRow1" class="ns1blankspaceMainRow1">' +
													'<td id="tdns1blankspaceMainProjectTaskActionDetailsColumn1" class="ns1blankspaceMainColumn1Large">' +
													'</td>' +
													'<td id="tdns1blankspaceMainProjectTaskActionDetailsColumn2" class="ns1blankspaceMainColumn2Action">' +
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
											success: function(data){ns1blankspaceSetupProjectTaskActionDetails(oParam, data)}
										});
									}
									else
									{
										for (edId in tinyMCE.editors) 
											tinyMCE.editors[edId].destroy(true);
											
										var aHTML = [];
										var h = -1;
										
										aHTML[++h] = '<table id="tablens1blankspaceMainTaskDetailsColumn2" class="ns1blankspaceMainColumn2">';
										
										aHTML[++h] = '<tr><td id="tdns1blankspaceMainTaskActionDetailsSave" class="ns1blankspaceMain">' +
														'<span id="spanns1blankspaceMainTaskActionDetailsSave">Save</span>' +
														'</td></tr>';
																
										aHTML[++h] = '</table>';					
										
										$('#tdns1blankspaceMainProjectTaskActionDetailsColumn2').html(aHTML.join(''));
										
										$('#spanns1blankspaceMainTaskActionDetailsSave').button(
										{
											label: "Save"
										})
										.click(function() {
											ns1blankspaceSetupProjectTaskActionDetailsSave(oParam);
										})
										
										var aHTML = [];
										var h = -1;
															
										aHTML[++h] = '<table id="tablens1blankspaceMainDetailsColumn1" class="ns1blankspaceMain">';					
															
										aHTML[++h] = '<tr id="trns1blankspaceMainProjectTaskDetailsSubject" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsSubject" class="ns1blankspaceMain">' +
															'Subject' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainProjectTaskDetailsSubjectValue" class="ns1blankspaceMainText">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsSubjectValue" class="ns1blankspaceMainText">' +
															'<input id="inputns1blankspaceMainProjectTaskDetailsSubject" class="inputns1blankspaceMainText">' +
															'</td></tr>';		
															
										ns1blankspace.counter.editor = + ns1blankspace.counter.editor + 1;
									
										aHTML[++h] = '<tr id="trns1blankspaceMainProjectTaskDetailsDescriptionValue" class="ns1blankspaceMainTextMulti">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsDescriptionValue" class="ns1blankspaceMainTextMulti">' +
															'<textarea rows="10" cols="50" style="width:100%;" ' +
															'id="inputns1blankspaceMainProjectTaskDetailsDescription' + ns1blankspace.counter.editor + '" class="inputns1blankspaceMainTextMulti"></textarea>' +
															'</td></tr>';
									
										aHTML[++h] = '<tr id="trns1blankspaceMainProjectTaskDetailsType" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsType" class="ns1blankspaceMain">' +
															'Type' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainProjectTaskDetailsTypeValue" class="ns1blankspaceMainSelect">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsTypeValue" class="ns1blankspaceMainSelect">' +
															'<input id="inputns1blankspaceMainProjectTaskActionDetailsType" class="inputns1blankspaceMainSelect"' +
																' onDemandMethod="/ondemand/setup/?rf=XML&method=SETUP_ACTION_TYPE_SEARCH">' +
															'</td></tr>';
									
										aHTML[++h] = '<tr id="trns1blankspaceMainProjectTaskDetailsTaskBy" class="ns1blankspaceMain">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsTaskBy" class="ns1blankspaceMain">' +
															'Task By' +
															'</td></tr>' +
															'<tr id="trns1blankspaceMainProjectTaskDetailsTaskByValue" class="ns1blankspaceMainSelect">' +
															'<td id="tdns1blankspaceMainProjectTaskDetailsTaskByValue" class="ns1blankspaceMainSelect">' +
															'<input id="inputns1blankspaceMainProjectTaskActionDetailsTaskBy" class="inputns1blankspaceMainSelect"' +
																' onDemandMethod="SETUP_USER_SEARCH" onDemandColumns="username">' +
															'</td></tr>';
										
										aHTML[++h] = '</table>';						
									
										$('#tdns1blankspaceMainProjectTaskActionDetailsColumn1').html(aHTML.join(''));
										
										if (oResponse != undefined)
										{
											if (oResponse.data.rows.length != 0)
											{
												$('#inputns1blankspaceMainProjectTaskDetailsSubject').val(oResponse.data.rows[0].subject);
												
												$('#inputns1blankspaceMainProjectTaskDetailsDescription' + ns1blankspace.counter.editor).val(ns1blankspaceFormatXHTML(oResponse.data.rows[0].description));	
												
												$('#inputns1blankspaceMainProjectTaskActionDetailsType').attr('onDemandID', oResponse.data.rows[0].type);
												$('#inputns1blankspaceMainProjectTaskActionDetailsType').val(oResponse.data.rows[0].typetext);
												$('#inputns1blankspaceMainProjectTaskActionDetailsTaskBy').attr('onDemandID', oResponse.data.rows[0].actionby);
												$('#inputns1blankspaceMainProjectTaskActionDetailsTaskBy').val(oResponse.data.rows[0].actionbyfirstname + ' ' + oResponse.data.rows[0].actionbysurname);
											}
										}	
										
										tinyMCE.execCommand('mceAddControl', false, 'inputns1blankspaceMainProjectTaskDetailsDescription' + ns1blankspace.counter.editor);
									}	
								},	

					remove:		function (sXHTMLElementId)
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

					save:		function (oParam)
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
									
									sData += '&subject=' + ns1blankspaceFormatValue($('#inputns1blankspaceMainProjectTaskDetailsSubject').val());
									sData += '&description=' + ns1blankspaceFormatValue(tinyMCE.get('inputns1blankspaceMainProjectTaskDetailsDescription' + ns1blankspace.counter.editor).getContent());
									sData += '&type=' + ns1blankspaceFormatValue($('#inputns1blankspaceMainProjectTaskActionDetailsType').attr('onDemandID'));
									sData += '&actionby=' + ns1blankspaceFormatValue($('#inputns1blankspaceMainProjectTaskActionDetailsTaskBy').attr('onDemandID'));
										  
									$.ajax(
									{
										type: 'POST',
										url: sParam,
										data: sData,
										dataType: 'json',
										async: bAsync,
										success: function(data) {
												ns1blankspaceStatus('Action saved');
												ns1blankspaceMainViewportShow("#divns1blankspaceMainActions");
												ns1blankspaceSetupProjectTaskActions(
													{
														actions: {add: false},
														xhtmlElementID: 'tdns1blankspaceMainActionsColumn1'
													});
												
												}
									});	
								}
				}
}								



