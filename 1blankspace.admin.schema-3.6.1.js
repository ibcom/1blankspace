/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

 /* 
	Endpoints, methods & properties are the resources to manage the underlying objects and their instances
	Object properties are derived by the associated _SEARCH method and structure additions
 */

if (ns1blankspace.admin === undefined) {ns1blankspace.admin = {}}

ns1blankspace.admin.schema = 
{
	data: 	{
					lab: (window.location.host.indexOf('lab.ibcom.biz') != -1),
					superUser: false,
					dataTypes:
					{
						Numeric: 1,
						Data: 2,
						Text: 3
				}},

	init: 	function (oParam)
				{
					var bShowHome = true;
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
					}

					ns1blankspace.app.reset();

					ns1blankspace.objectParentName = 'admin';
					ns1blankspace.objectName = 'schema';
					ns1blankspace.viewName = 'Schema';

					ns1blankspace.admin.schema.data.superUser = ns1blankspace.user.super;

					ns1blankspace.app.set(oParam);
				},

	home:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlNew').button({disabled: true});
					
					var aHTML = [];
								
					aHTML.push('<table>');

					aHTML.push('<tr><td><span style="color: #b8b8b8; font-size: 2.6em; margin-top: 4px;" class="glyphicon glyphicon-book" aria-hidden="true"></span></td></tr>');

					aHTML.push('</table>');		
						
					aHTML.push('<table class="ns1blankspaceControl" style="padding-top:10px;">');
					
					aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
									'Summary</td></tr>');

					aHTML.push('</table>');		
						
					aHTML.push('<table class="ns1blankspaceControl" style="padding-top:10px;">');
					
					aHTML.push('<tr><td id="ns1blankspaceControlEndpoints" class="ns1blankspaceControl">' +
									'Endpoints</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlMethods" class="ns1blankspaceControl">' +
									'Methods</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlProperties" class="ns1blankspaceControl">' +
									'Properties</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlLinks" class="ns1blankspaceControl">' +
									'Links</td></tr>');

					aHTML.push('</table>');		
						
					aHTML.push('<table class="ns1blankspaceControl" style="padding-top:10px;">');
				
					aHTML.push('<tr><td id="ns1blankspaceControlObjects" class="ns1blankspaceControl">' +
									'Objects</td></tr>');

					aHTML.push('</table>');	

					if (ns1blankspace.user.super)
					{
						aHTML.push('<table class="ns1blankspaceControl" style="padding-top:10px;">');
						
						aHTML.push('<tr><td id="ns1blankspaceControlCheck" class="ns1blankspaceControl">' +
										'Check</td></tr>');

						aHTML.push('</table>');	
					}
					
					$('#ns1blankspaceControl').html(aHTML.join(''));	
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainEndpoints" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainMethods" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainProperties" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainLinks" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainObjects" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainCheck" class="ns1blankspaceControlMain"></div>');

					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.admin.schema.summary();
					});

					$('#ns1blankspaceControlEndpoints').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainEndpoints'});
						ns1blankspace.admin.schema.endpoints.show();
					});

					$('#ns1blankspaceControlMethods').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainMethods'});
						ns1blankspace.admin.schema.methods.init();
					});

					$('#ns1blankspaceControlProperties').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainProperties'});
						ns1blankspace.admin.schema.properties.show();
					});

					$('#ns1blankspaceControlLinks').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainLinks'});
						ns1blankspace.admin.schema.links.show();
					});

					$('#ns1blankspaceControlObjects').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainObjects'});
						ns1blankspace.admin.schema.objects.show();
					});

					$('#ns1blankspaceControlCheck').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainCheck'});
						ns1blankspace.admin.schema.methods.check.init();
					});

					ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
					ns1blankspace.admin.schema.summary();
				},

	summary:	function ()
				{
					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceMain">' +
								'<tr class="ns1blankspaceRow">' +
								'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
								'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:250px;"></td>' +
								'</tr>' +
								'</table>');				
					
					$('#ns1blankspaceMainSummary').html(aHTML.join(''));	

					var aHTML = [];

					aHTML.push('<table class="ns1blankspace">');

					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Endpoints</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryEndpoints" class="ns1blankspaceSummary">' +
									ns1blankspace.xhtml.loadingSmall +
									'</td></tr>');

					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Methods</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryMethods" class="ns1blankspaceSummary">' +
									ns1blankspace.xhtml.loadingSmall +
									'</td></tr>');

					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Properties</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryProperties" class="ns1blankspaceSummary">' +
									ns1blankspace.xhtml.loadingSmall +
									'</td></tr>');

					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Objects</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryObjects" class="ns1blankspaceSummary">' +
									ns1blankspace.xhtml.loadingSmall +
									'</td></tr>');

					aHTML.push('</table>');

					$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceColumn2">');

					aHTML.push('<tr><td style="padding-top:14px;" class="ns1blankspaceSubNote">You can also explore the schema using' +
						' <a href="https://learn.mydigitalstructure.cloud/schema" target="_blank">learn.mydigitalstructure.cloud</a>.</td></tr>');

					aHTML.push('</table>')

					$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));

					ns1blankspace.admin.schema.endpoints.count();
					ns1blankspace.admin.schema.methods.count();
					ns1blankspace.admin.schema.properties.count();
					ns1blankspace.admin.schema.objects.count();
				}
}				

ns1blankspace.admin.schema.endpoints =
{
	data: 	{searchText: undefined},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.admin.schema.endpoints.show(oParam)
				},

	count: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_ENDPOINT_SEARCH';
						oSearch.addField('id');
						oSearch.addSummaryField('count(id) count');
						oSearch.rows = 1;
						oSearch.getResults(function(data) {ns1blankspace.admin.schema.endpoints.count(oParam, data)})	
					}
					else
					{
						$('#ns1blankspaceSummaryEndpoints').html(oResponse.summary.count);
					}	
				},	

	show:		function (oParam, oResponse)
				{
					var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
					var sSearchText;

					if (oSearchText.exists)
					{
						sSearchText = oSearchText.value;
						ns1blankspace.admin.schema.endpoints.data.searchText = sSearchText;
					}
					else
					{	
						sSearchText = ns1blankspace.admin.schema.endpoints.data.searchText;
					}	

					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceAdminSchemaEndpointsColumn1"></td>' +
										'<td id="ns1blankspaceAdminSchemaEndpointsColumn2" style="width:300px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainEndpoints').html(aHTML.join(''));

						$('#ns1blankspaceAdminSchemaEndpointsColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.admin.schema.endpoints.data.details = [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_ENDPOINT_SEARCH';
						oSearch.addField('category,categorytext,title,type,typetext,notes');
					
						if (sSearchText != '')
						{
							oSearch.addBracket('(');

							oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);
							
							if (!_.isNaN(_.toNumber(sSearchText)))
							{
								oSearch.addOperator('or');
								oSearch.addFilter('id', 'EQUAL_TO', sSearchText);
							}

							oSearch.addBracket(')');
						}

						oSearch.rows = 100;
						oSearch.sort('title', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.admin.schema.endpoints.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceAdminSchemaEndpoints">' +
											'<tr><td class="ns1blankspaceSub">No endpoints.</td></tr></table>');

							$('#ns1blankspaceAdminSchemaEndpointsColumn1').html(aHTML.join(''));
						}
						else
						{
							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceAdminSchemaEndpoints" class="ns1blankspace">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption">Title</td>' +
										'<td class="ns1blankspaceHeaderCaption">Type</td>' +
										'<td class="ns1blankspaceHeaderCaption">Category</td>' +
										'<td class="ns1blankspaceHeaderCaption"></td>' +
										'</tr>');

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.admin.schema.endpoints.row(this));
							});
							
							aHTML.push('</table>');
						}

						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceAdminSchemaEndpointsColumn1',
							xhtmlContext: 'AdminSchemaEndpoints',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.admin.schema.endpoints.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.admin.schema.endpoints.bind
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:14px;">' +
												'<input id="ns1blankspaceAdminSchemaEndpointsSearchText" class="ns1blankspaceText" style="width:130px;">' +
												'</td></tr>');
																			
						aHTML.push('<tr><td style="padding-top:0px;">' +
										'<span id="ns1blankspaceAdminSchemaEndpointsSearch" class="ns1blankspaceAction">Search</span>');

						if (sSearchText != undefined)
						{	
							aHTML.push(' <span id="ns1blankspaceAdminSchemaEndpointsSearchClear" class="ns1blankspaceAction">Clear</span>');
						}

						aHTML.push('</td></tr>');

						aHTML.push('</table>');

						if ($('#ns1blankspaceAdminSchemaEndpointsColumn2 table').length == 0)
						{
							$('#ns1blankspaceAdminSchemaEndpointsColumn2').html(aHTML.join(''));
						}
						else
						{
							$('#ns1blankspaceAdminSchemaEndpointsColumn2 table').before(aHTML.join(''));
						}

						$('#ns1blankspaceAdminSchemaEndpointsSearch').button(
						{
							label: 'Search'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminSchemaEndpointsSearchText').val());
							ns1blankspace.admin.schema.endpoints.show(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspaceAdminSchemaEndpointsSearchClear').button(
						{
							label: 'Clear'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', '');
							ns1blankspace.admin.schema.endpoints.show(oParam);
						})
						.css('width', '57px');

						$('#ns1blankspaceAdminSchemaEndpointsSearchText').keyup(function(e)
						{
							if (e.which === 13)
					    	{
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminSchemaEndpointsSearchText').val())
					    		ns1blankspace.admin.schema.endpoints.show(oParam);
					    	}
						});				

						$('#ns1blankspaceAdminSchemaEndpointsSearchText').val(sSearchText);
					}
				},	

	row: 		function (oRow)	
				{
					var aHTML = [];

					ns1blankspace.admin.schema.endpoints.data.details.push(oRow);

					aHTML.push('<tr id="ns1blankspaceAdminSchemaEndpoints_container-' + oRow["id"] + '">');
					
					aHTML.push('<td class="ns1blankspaceRow">' +
										'<div class="ns1blankspaceRowSelect" id="ns1blankspaceAdminSchemaEndpoints_title-' + oRow["id"] + '" style="font-size:1em;">' + oRow["title"] + '</div>' + 
										(oRow.notes!=''?'<div class="ns1blankspaceSubNote">' + oRow.notes + '</div>':'') + '</td>');
				
					aHTML.push('<td id="ns1blankspaceAdminSchemaEndpoints_type-' + oRow["id"] + '" class="ns1blankspaceRow">' +
									oRow["typetext"] + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminSchemaEndpoints_category-' + oRow["id"] + '" class="ns1blankspaceRow">' +
									oRow["categorytext"] + '</td>');

					if (ns1blankspace.user.super)
					{
						aHTML.push('<td style="width:70px;text-align:right;" class="ns1blankspaceRow">' + 
									'<span id="ns1blankspaceAdminSchemaEndpoints_remove-' + oRow.id + '" class="ns1blankspaceEndpointRemove" style="margin-right:2px;"></span>' +
									'<span id="ns1blankspaceAdminSchemaEndpoints_edit-' + oRow.id + '" class="ns1blankspaceEndpointEdit"' +
										' data-title="' + oRow["title"] + '"' +
										' data-type="' + oRow["type"] + '"' +
										' data-category="' + oRow["category"] + '"' +
										' data-notes="' + window.btoa(oRow["notes"]) + '"' +
										'></span></td>');
					}

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function ()
				{
					$('.ns1blankspaceRowSelect:visible').click(function()
					{
						ns1blankspace.admin.schema.endpoints.details({xhtmlElementID: this.id})
					});

					$('#ns1blankspaceAdminSchemaEndpoints .ns1blankspaceEndpointEdit').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-pencil"
						}
					})
					.click(function()
					{
						ns1blankspace.admin.schema.endpoints.edit({xhtmlElementID: this.id})
					})
					.css('width', '15px')
					.css('height', '17px');	
				},

	details: 	
				function (oParam)
				{
					var sXHTMLElementID;
					var sKey;

					if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
					{
						sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
						sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
					}

					if ($('#ns1blankspaceAdminSchemaEndpoints_container_details-' + sKey).length != 0)
					{
						$('#ns1blankspaceAdminSchemaEndpoints_container_details-' + sKey).remove();
					}
					else
					{
						var sHTML = 'No details';

						var oDetail = $.grep(ns1blankspace.admin.schema.endpoints.data.details, function (a) {return a.id == sKey;})[0];

						if (oDetail)
						{
							sHTML = '<div class="ns1blankspaceSummaryCaption">ID</div><div>' + oDetail.id + '</div>';

							if (oDetail.notes != '')
							{
								sHTML = sHTML + '<div class="ns1blankspaceSummaryCaption">Notes</div><div>' + oDetail.notes + '</div>';
							}

							sHTML = sHTML + '<div style="margin-top:14px;" id="ns1blankspaceAdminSchemaEndpointMethods-' + oDetail.title + '" class="ns1blankspaceViewLink">Methods</div>';
	
							$('#ns1blankspaceAdminSchemaEndpoints_container-' + sKey).after('<tr id="ns1blankspaceAdminSchemaEndpoints_container_details-' + sKey + '">' +
								'<td colspan=3><div style="background-color: #F3F3F3; padding:8px; color:#444444; font-weight:100; font-size:0.875em;">' + sHTML + '</div></td></tr>');	
						
							$('#ns1blankspaceAdminSchemaEndpointMethods-' + oDetail.title).click().click(function ()
							{
								$('.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
								$('#ns1blankspaceControlMethods').addClass('ns1blankspaceHighlight');
								ns1blankspace.show({selector: '#ns1blankspaceMainMethods'});
								ns1blankspace.admin.schema.methods.show({searchText: this.id.split('-')[1]})
							});
						}
					}
				},

	edit:		function (oParam, oResponse)
				{
					var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
					if (iID == undefined) {iID = ''}
		
					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceContainer">');

					aHTML.push('<tr class="ns1blankspaceContainer">' +
									'<td id="ns1blankspaceAdminSchemaEndpointsEditColumn1"></td>' +
									'<td id="ns1blankspaceAdminSchemaEndpointsEditColumn2" style="width:50px;"></td>' +
									'</tr>');

					aHTML.push('</table>');					
					
					$('#ns1blankspaceAdminSchemaEndpointsColumn2').html(aHTML.join(''));

					var aHTML = [];
								
					aHTML.push('<table class="ns1blankspaceColumn2a">' +
									'<tr><td><span id="ns1blankspaceAdminSchemaEndpointsEditSave" data-id="' + iID + '" class="ns1blankspaceAction">' +
									'Save</span></td></tr>' +
									'<tr><td><span id="ns1blankspaceAdminSchemaEndpointsEditCancel" class="ns1blankspaceAction">' +
									'Cancel</span></td></tr>' +
									'</table>');					
					
					$('#ns1blankspaceAdminSchemaEndpointsEditColumn2').html(aHTML.join(''));
					
					$('#ns1blankspaceAdminSchemaEndpointsEditSave').button(
					{
						text: "Save"
					})
					.click(function()
					{
						ns1blankspace.admin.schema.endpoints.save({id: $(this).attr('data-id')})
					})
					.css('width', '65px');

					$('#ns1blankspaceAdminSchemaEndpointsEditCancel').button(
					{
						text: "Cancel"
					})
					.click(function()
					{
						ns1blankspace.admin.schema.endpoints.show();
					})
					.css('width', '65px');

					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Title' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaEndpointsEditTitle" class="ns1blankspaceText">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Category' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceRadio">' +
									'<input type="radio" id="radioCategory1" name="radioCategory" value="1"/>Organisational' +
									'<br /><input type="radio" id="radioCategory2" name="radioCategory" value="2"/>Set up' +
									'<br /><input type="radio" id="radioCategory3" name="radioCategory" value="3"/>System' +
									'<br /><input type="radio" id="radioCategory3" name="radioCategory" value="4"/>Hidden' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Type' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceRadio">' +
									'<input type="radio" id="radioType1" name="radioType" value="1"/>Common' +
									'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Dedicated' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Notes' +
									'</td></tr>' +
									'<tr class="ns1blankspaceTextMulti">' +
									'<td class="ns1blankspaceTextMulti">' +
									'<textarea rows="10" cols="35" id="ns1blankspaceAdminSchemaEndpointsEditNotes" class="ns1blankspaceTextMulti"></textarea>' +
									'</td></tr>');

					aHTML.push('</table>');		

					$('#ns1blankspaceAdminSchemaEndpointsEditColumn1').html(aHTML.join(''));

					if (iID != '')
					{
						$('#ns1blankspaceAdminSchemaEndpointsEditTitle').val(ns1blankspace.util.getData(oParam, 'data-title').value);
						$('[name="radioCategory"][value="' + ns1blankspace.util.getData(oParam, 'data-category').value + '"]').attr('checked', true);
						$('[name="radioType"][value="' + ns1blankspace.util.getData(oParam, 'data-type').value + '"]').attr('checked', true);
						$('#ns1blankspaceAdminSchemaEndpointsEditNotes').val(window.atob(ns1blankspace.util.getData(oParam, 'data-notes').value));	 
					}
				},

	save: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var iID = ns1blankspace.util.getParam(oParam, 'id').value;

						var oData =
						{
							id: iID,
							title: $('#ns1blankspaceAdminSchemaEndpointsEditTitle').val(),
							category: $('input[name="radioCategory"]:checked').val(),
							type: $('input[name="radioType"]:checked').val(),
							notes: $('#ns1blankspaceAdminSchemaEndpointsEditNotes').val()
						}

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('ADMIN_ENDPOINT_MANAGE'),
							data: oData,
							dataType: 'json',
							success: function(data) 
							{
								if (data.status == 'OK')
								{
									ns1blankspace.status.message('Saved');
									ns1blankspace.admin.schema.endpoints.show()
								}
							}
						});
					}
				}				
}

ns1blankspace.admin.schema.methods =
{
	data: 	{searchText: undefined},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.admin.schema.properties.summaryByMethod(
					{
						onComplete: ns1blankspace.admin.schema.methods.show
					});
				},

	count: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_METHOD_SEARCH';
						oSearch.addField('id');
						oSearch.addSummaryField('count(id) count');
						oSearch.rows = 1;
						oSearch.getResults(function(data) {ns1blankspace.admin.schema.methods.count(oParam, data)})	
					}
					else
					{
						$('#ns1blankspaceSummaryMethods').html(oResponse.summary.count);
					}	
				},	
	
	show:		function (oParam, oResponse)
				{
					var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
					var sSearchText;

					if (oSearchText.exists)
					{
						sSearchText = oSearchText.value;
						ns1blankspace.admin.schema.methods.data.searchText = sSearchText;
					}
					else
					{	
						sSearchText = ns1blankspace.admin.schema.methods.data.searchText;
					}	

					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceAdminSchemaMethodsColumn1"></td>' +
										'<td id="ns1blankspaceAdminSchemaMethodsColumn2" style="width:300px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainMethods').html(aHTML.join(''));

						$('#ns1blankspaceAdminSchemaMethodsColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.admin.schema.methods.data.details = [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_METHOD_SEARCH';
						oSearch.addField('addavailable,advancedsearchavailable,endpoint,endpointtext,endpointother,endpointothertext,notes,object,objecttext,' +
										'removeavailable,title,name,unrestrictedaccess,unrestrictedloggedonaccess,updateavailable,useavailable,status,statustext');
					
						if (sSearchText != '')
						{
							oSearch.addBracket('(');

							oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);
							
							if (!_.isNaN(_.toNumber(sSearchText)))
							{
								oSearch.addOperator('or');
								oSearch.addFilter('id', 'EQUAL_TO', sSearchText);
							}

							oSearch.addBracket(')');
						}

						oSearch.rows = 20;
						oSearch.sort('title', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.admin.schema.methods.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceAdminSchemaMethods">' +
											'<tr><td class="ns1blankspaceSub">No methods.</td></tr></table>');

							$('#ns1blankspaceAdminSchemaMethodsColumn1').html(aHTML.join(''));
						}
						else
						{
							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceAdminSchemaMethods" class="ns1blankspace">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption">Title</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Name</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Properties</td>')

							if (ns1blankspace.user.super)
							{
								aHTML.push('<td class="ns1blankspaceHeaderCaption"></td>');
							}

							aHTML.push('</tr>');

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.admin.schema.methods.row(this));
							});
							
							aHTML.push('</table>');
						}

						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceAdminSchemaMethodsColumn1',
							xhtmlContext: 'AdminSchemaMethods',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 20,
							functionShowRow: ns1blankspace.admin.schema.methods.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.admin.schema.methods.bind
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:14px;">' +
												'<input id="ns1blankspaceAdminSchemaMethodsSearchText" class="ns1blankspaceText" style="width:130px;">' +
												'</td></tr>');
																			
						aHTML.push('<tr><td style="padding-top:0px;">' +
										'<span id="ns1blankspaceAdminSchemaMethodsSearch" class="ns1blankspaceAction">Search</span>');

						if (sSearchText != undefined)
						{	
							aHTML.push(' <span id="ns1blankspaceAdminSchemaMethodsSearchClear" class="ns1blankspaceAction">Clear</span>');
						}
							
						if (ns1blankspace.user.super)
						{
							aHTML.push('<tr><td style="padding-top:16px;">' +
										'<span id="ns1blankspaceAdminSchemaMethodsAdd" class="ns1blankspaceAction">Add</span>');
						}			
							
						aHTML.push('</td></tr>');

						aHTML.push('</table>');

						if ($('#ns1blankspaceAdminSchemaMethodsColumn2 table').length == 0)
						{
							$('#ns1blankspaceAdminSchemaMethodsColumn2').html(aHTML.join(''));
						}
						else
						{
							$('#ns1blankspaceAdminSchemaMethodsColumn2 table').before(aHTML.join(''));
						}

						$('#ns1blankspaceAdminSchemaMethodsSearch').button(
						{
							label: 'Search'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminSchemaMethodsSearchText').val());
							ns1blankspace.admin.schema.methods.show(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspaceAdminSchemaMethodsSearchClear').button(
						{
							label: 'Clear'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', '');
							ns1blankspace.admin.schema.methods.show(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspaceAdminSchemaMethodsSearchText').keyup(function(e)
						{
							if (e.which === 13)
					    	{
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminSchemaMethodsSearchText').val())
					    		ns1blankspace.admin.schema.methods.show(oParam);
					    	}
						});				

						$('#ns1blankspaceAdminSchemaMethodsSearchText').val(sSearchText);
						
						if (ns1blankspace.user.super)
						{
							$('#ns1blankspaceAdminSchemaMethodsAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								ns1blankspace.admin.schema.methods.edit({xhtmlElementID: this.id})
							})
							.css('width', '57px');
						}	
					}
				},	

	row: 		function (oRow)	
				{
					var aHTML = [];

					oRow._method = _.find(ns1blankspace.admin.schema.properties.data.summaryByMethod, function (oProperty) {return oProperty.method == oRow.id});
					oRow.properties = 0;

					if (oRow._method != undefined)
					{
						oRow.properties = oRow._method.properties;
					}

					ns1blankspace.admin.schema.methods.data.details.push(oRow);

					aHTML.push('<tr id="ns1blankspaceAdminSchemaMethods_container-' + oRow["id"] + '">');
					
					aHTML.push('<td class="ns1blankspaceRow">' +
										'<div id="ns1blankspaceAdminSchemaMethods_title-' + oRow["id"] + '" class="ns1blankspaceRowSelect" style="font-size:1em;">' + oRow["title"] + '</div>' + 
										(oRow.notes!=''?'<div class="ns1blankspaceSubNote">' + oRow.notes + '</div>':'') + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminSchemaMethods_name-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceSub" style="text-align:center;">' +
									(oRow["name"]==''?'-':oRow["name"]) + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminSchemaMethods_properties-' + oRow["id"] + '" style="text-align:center;" class="ns1blankspaceRow">' +
										(oRow["properties"]=='0'?'<div class="ns1blankspaceSubNote">-</div>':oRow["properties"]) + '</td>');

					if (ns1blankspace.user.super)
					{
						aHTML.push('<td style="width:70px;text-align:right;" class="ns1blankspaceRow">' + 
									'<span id="ns1blankspaceAdminSchemaMethods_remove-' + oRow.id + '" class="ns1blankspaceMethodRemove" style="margin-right:2px;"></span>' +
									'<span id="ns1blankspaceAdminSchemaMethods_edit-' + oRow.id + '" class="ns1blankspaceMethodEdit"' +
										' data-title="' + oRow["title"] + '"' +
										' data-name="' + oRow["name"] + '"' +
										' data-status="' + oRow["status"] + '"' +
										' data-endpoint="' + oRow["endpoint"] + '"' +
										' data-endpointtext="' + oRow["endpointtext"] + '"' +
										' data-endpointother="' + oRow["endpointother"] + '"' +
										' data-endpointothertext="' + oRow["endpointothertext"] + '"' +
										' data-object="' + oRow["object"] + '"' +
										' data-objecttext="' + oRow["objecttext"] + '"' +
										' data-endpoint="' + oRow["status"] + '"' +
										' data-addavailable="' + oRow["addavailable"] + '"' +
										' data-removeavailable="' + oRow["removeavailable"] + '"' +
										' data-updateavailable="' + oRow["updateavailable"] + '"' +
										' data-useavailable="' + oRow["useavailable"] + '"' +
										' data-unrestrictedaccess="' + oRow["unrestrictedaccess"] + '"' +
										' data-unrestrictedloggedonaccess="' + oRow["unrestrictedloggedonaccess"] + '"' +
										' data-notes="' + window.btoa(oRow["notes"]) + '"' +
										'></span></td>');
					}

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function ()
				{
					$('.ns1blankspaceRowSelect:visible').click(function()
					{
						ns1blankspace.admin.schema.methods.details({xhtmlElementID: this.id})
					});

					$('#ns1blankspaceAdminSchemaMethods .ns1blankspaceMethodRemove').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-close"
						}
					})
					.click(function()
					{
						ns1blankspace.remove(
						{
							xhtmlElementID: this.id,
							method: 'ADMIN_METHOD_MANAGE',
							ifNoneMessage: 'No methods.'
						});
					})
					.css('width', '15px')
					.css('height', '17px');

					$('#ns1blankspaceAdminSchemaMethods .ns1blankspaceMethodEdit:visible').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-pencil"
						}
					})
					.click(function()
					{
						ns1blankspace.admin.schema.methods.edit({xhtmlElementID: this.id})
					})
					.css('width', '15px')
					.css('height', '17px');	
				},

	details: 	
				function (oParam)
				{
					var sXHTMLElementID;
					var sKey;

					if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
					{
						sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
						sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
					}

					if ($('#ns1blankspaceAdminSchemaMethods_container_details-' + sKey).length != 0)
					{
						$('#ns1blankspaceAdminSchemaMethods_container_details-' + sKey).remove();
					}
					else
					{
						var sHTML = 'No details';

						var oDetail = $.grep(ns1blankspace.admin.schema.methods.data.details, function (a) {return a.id == sKey;})[0];

						if (oDetail)
						{
							sHTML = '<table class="table table-condensed">' +
										'<tr><td style="width:40%;">ID</td><td>' + oDetail.id + '</td></tr>' +
											'<tr><td>Endpoint</td><td>' + oDetail.endpointtext + '</td></tr>' +
											'<tr><td>Status</td><td>' + oDetail.statustext + '</td></tr>' +
											'<tr><td>Unrestricted Access</td><td>' + oDetail.unrestrictedaccess + '</td></tr>' +
											'<tr><td>Unrestricted Access (Authenticated)</td><td>' + oDetail.unrestrictedloggedonaccess + '</div>' +
											'<tr><td>Can Be Used To Search</td><td>' + oDetail.useavailable + '</td></tr>' +
											'<tr><td>Can Be Used To Add</td><td>' + oDetail.addavailable + '</td></tr>' +
											'<tr><td>Can Be Used To Update</td><td>' + oDetail.updateavailable + '</td></tr>' +
											'<tr><td>Can Be Used To Remove</td><td>' + oDetail.removeavailable + '</td></tr>';

							if (oDetail.endpointothertext != '')
							{
								sHTML = sHTML + '<tr><td>Other Endpoint</td><td>' + oDetail.endpointothertext + '</td></tr>';
							}

							if (oDetail.objecttext != '')
							{
								sHTML = sHTML + '<tr><td>Object</td><td>' + oDetail.objecttext + '</td></tr>';
							}

							if (oDetail.notes != '')
							{
								sHTML = sHTML + '<tr><td>Notes</td><td>' + oDetail.notes + '</td></tr>';
							}

							sHTML = sHTML + '<tr><td>Documentation</td><td><a href="https://docs.mydigitalstructure.cloud/' + oDetail.title + '" target="_blank">' + 
													'docs.mydigitalstructure.cloud/' + oDetail.title.toLowerCase() + '</a></td></tr>';

							sHTML = sHTML + '<tr><td></td><td id="ns1blankspaceAdminSchemaMethodProperties-' + oDetail.title + '" class="ns1blankspaceViewLink">Properties</td></tr>';

							sHTML = sHTML + '<tr><td></td><td id="ns1blankspaceAdminSchemaMethodLinks-' + oDetail.title + '" class="ns1blankspaceViewLink">Links</td></tr>';
							
							sHTML = sHTML + '</table>'
							
							$('#ns1blankspaceAdminSchemaMethods_container-' + sKey).after('<tr id="ns1blankspaceAdminSchemaMethods_container_details-' + sKey + '" style="font-size:0.875em;">' +
								'<td colspan=4><div style="background-color: #F3F3F3; padding:8px; color:#444444; font-weight:100; font-size:0.875em;">' + sHTML + '</div></td></tr>');

							$('#ns1blankspaceAdminSchemaMethodProperties-' + oDetail.title).click().click(function ()
							{
								$('.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
								$('#ns1blankspaceControlProperties').addClass('ns1blankspaceHighlight');
								ns1blankspace.show({selector: '#ns1blankspaceMainProperties'});
								ns1blankspace.admin.schema.properties.show({searchText: this.id.split('-')[1]})
							});

							$('#ns1blankspaceAdminSchemaMethodLinks-' + oDetail.title).click().click(function ()
							{
								$('.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
								$('#ns1blankspaceControlLinks').addClass('ns1blankspaceHighlight');
								ns1blankspace.show({selector: '#ns1blankspaceMainLinks'});
								ns1blankspace.admin.schema.links.show({searchText: this.id.split('-')[1]})
							});
						}
					}
				},

	edit:		function (oParam, oResponse)
				{
					var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
					if (iID == undefined) {iID = ''}
		
					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceContainer">');

					aHTML.push('<tr class="ns1blankspaceContainer">' +
									'<td id="ns1blankspaceAdminSchemaMethodsEditColumn1"></td>' +
									'<td id="ns1blankspaceAdminSchemaMethodsEditColumn2" style="width:50px;"></td>' +
									'</tr>');

					aHTML.push('</table>');					
					
					$('#ns1blankspaceAdminSchemaMethodsColumn2').html(aHTML.join(''));

					var aHTML = [];
								
					aHTML.push('<table class="ns1blankspaceColumn2a">' +
									'<tr><td><span id="ns1blankspaceAdminSchemaMethodsEditSave" data-id="' + iID + '" class="ns1blankspaceAction">' +
									'Save</span></td></tr>' +
									'<tr><td><span id="ns1blankspaceAdminSchemaMethodsEditCancel" class="ns1blankspaceAction">' +
									'Cancel</span></td></tr>' +
									'</table>');					
					
					$('#ns1blankspaceAdminSchemaMethodsEditColumn2').html(aHTML.join(''));
					
					$('#ns1blankspaceAdminSchemaMethodsEditSave').button(
					{
						text: "Save"
					})
					.click(function()
					{
						ns1blankspace.admin.schema.methods.save({id: $(this).attr('data-id')})
					})
					.css('width', '65px');

					$('#ns1blankspaceAdminSchemaMethodsEditCancel').button(
					{
						text: "Cancel"
					})
					.click(function()
					{
						ns1blankspace.admin.schema.methods.show();
					})
					.css('width', '65px');

					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Title' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaMethodsEditTitle" class="ns1blankspaceText">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Name' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaMethodsEditName" class="ns1blankspaceText">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Endpoint' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaMethodsEditEndpoint" class="ns1blankspaceSelect"' +
										' data-method="CORE_ENDPOINT_SEARCH"' +
										' data-columns="title">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Other Endpoint' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaMethodsEditEndpointOther" class="ns1blankspaceSelect"' +
										' data-method="CORE_ENDPOINT_SEARCH"' +
										' data-columns="title">' +
									'</td></tr>');	

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Status' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceRadio">' +
									'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Active' +
									'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Deprecated' +
									'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Proposed' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Unrestricted Access' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceRadio">' +
									'<input type="radio" id="radioUnrestrictedAccessY" name="radioUnrestrictedAccess" value="Y"/>Yes' +
									'<br /><input type="radio" id="radioUnrestrictedAccessN" name="radioUnrestrictedAccess" value="N"/>No' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Unrestricted Access (Authenticated)' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceRadio">' +
									'<input type="radio" id="radioUnrestrictedLoggedOnAccessY" name="radioUnrestrictedLoggedOnAccess" value="Y"/>Yes' +
									'<br /><input type="radio" id="radioUnrestrictedLoggedOnAccessN" name="radioUnrestrictedLoggedOnAccess" value="N"/>No' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Can Be Accessed / Used To Search' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceRadio">' +
									'<input type="radio" id="radioUseAvailableY" name="radioUseAvailable" value="Y"/>Yes' +
									'<br /><input type="radio" id="radioUseAvailableN" name="radioUseAvailable" value="N"/>No' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Can Be Used To Add' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceRadio">' +
									'<input type="radio" id="radioAddAvailableY" name="radioAddAvailable" value="Y"/>Yes' +
									'<br /><input type="radio" id="radioAddAvailableN" name="radioAddAvailable" value="N"/>No' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Can Be Used To Update' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceRadio">' +
									'<input type="radio" id="radioUpdateAvailableY" name="radioUpdateAvailable" value="Y"/>Yes' +
									'<br /><input type="radio" id="radioUpdateAvailableN" name="radioUpdateAvailable" value="N"/>No' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Can Be Used To Remove' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceRadio">' +
									'<input type="radio" id="radioRemoveAvailableY" name="radioRemoveAvailable" value="Y"/>Yes' +
									'<br /><input type="radio" id="radioRemoveAvailableN" name="radioRemoveAvailable" value="N"/>No' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Linked Object' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaMethodsEditObject" class="ns1blankspaceSelect"' +
										' data-method="CORE_OBJECT_SEARCH"' +
										' data-columns="title">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Notes' +
									'</td></tr>' +
									'<tr class="ns1blankspaceTextMulti">' +
									'<td class="ns1blankspaceTextMulti">' +
									'<textarea rows="10" cols="35" id="ns1blankspaceAdminSchemaMethodsEditNotes" class="ns1blankspaceTextMulti"></textarea>' +
									'</td></tr>');

					aHTML.push('</table>');		

					$('#ns1blankspaceAdminSchemaMethodsEditColumn1').html(aHTML.join(''));

					if (iID != '')
					{
						$('#ns1blankspaceAdminSchemaMethodsEditTitle').val(ns1blankspace.util.getData(oParam, 'data-title').value);
						$('#ns1blankspaceAdminSchemaMethodsEditName').val(ns1blankspace.util.getData(oParam, 'data-name').value);

						$('#ns1blankspaceAdminSchemaMethodsEditEndpoint').val(ns1blankspace.util.getData(oParam, 'data-endpointtext').value);
						$('#ns1blankspaceAdminSchemaMethodsEditEndpoint').attr('data-id', ns1blankspace.util.getData(oParam, 'data-endpoint').value);

						$('#ns1blankspaceAdminSchemaMethodsEditEndpointOther').val(ns1blankspace.util.getData(oParam, 'data-endpointothertext').value);
						$('#ns1blankspaceAdminSchemaMethodsEditEndpointOther').attr('data-id', ns1blankspace.util.getData(oParam, 'data-endpointother').value);

						$('#ns1blankspaceAdminSchemaMethodsEditObject').val(ns1blankspace.util.getData(oParam, 'data-objecttext').value);
						$('#ns1blankspaceAdminSchemaMethodsEditObject').attr('data-id', ns1blankspace.util.getData(oParam, 'data-object').value);

						$('[name="radioStatus"][value="' + ns1blankspace.util.getData(oParam, 'data-status').value + '"]').attr('checked', true);

						$('[name="radioUnrestrictedAccess"][value="' + ns1blankspace.util.getData(oParam, 'data-unrestrictedaccess').value + '"]').attr('checked', true);
						$('[name="radioUnrestrictedLoggedOnAccess"][value="' + ns1blankspace.util.getData(oParam, 'data-unrestrictedloggedonaccess').value + '"]').attr('checked', true);
						$('[name="radioUseAvailable"][value="' + ns1blankspace.util.getData(oParam, 'data-useavailable').value + '"]').attr('checked', true);
						$('[name="radioAddAvailable"][value="' + ns1blankspace.util.getData(oParam, 'data-addavailable').value + '"]').attr('checked', true);
						$('[name="radioUpdateAvailable"][value="' + ns1blankspace.util.getData(oParam, 'data-updateavailable').value + '"]').attr('checked', true);
						$('[name="radioRemoveAvailable"][value="' + ns1blankspace.util.getData(oParam, 'data-removeavailable').value + '"]').attr('checked', true);

						$('#ns1blankspaceAdminSchemaMethodsEditNotes').val(window.atob(ns1blankspace.util.getData(oParam, 'data-notes').value));	 
					}
					else
					{
						$('[name="radioStatus"][value="1"]').attr('checked', true);
					}
				},

	save: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var iID = ns1blankspace.util.getParam(oParam, 'id').value;

						var oData =
						{
							id: iID,
							title: $('#ns1blankspaceAdminSchemaMethodsEditTitle').val(),
							name: $('#ns1blankspaceAdminSchemaMethodsEditName').val(),
							endpoint: $('#ns1blankspaceAdminSchemaMethodsEditEndpoint').attr('data-id'),
							endpointother: $('#ns1blankspaceAdminSchemaMethodsEditEndpointOther').attr('data-id'),
							object: $('#ns1blankspaceAdminSchemaMethodsEditObject').attr('data-id'),
							status: $('input[name="radioStatus"]:checked').val(),
							unrestrictedaccess: $('[name="radioUnrestrictedAccess"]:checked').val(),
							unrestrictedloggedonaccess: $('[name="radioUnrestrictedLoggedOnAccess"]:checked').val(),
							useavailable: $('[name="radioUseAvailable"]:checked').val(),
							addavailable: $('[name="radioAddAvailable"]:checked').val(),
							updateavailable: $('[name="radioUpdateAvailable"]:checked').val(),
							removeavailable: $('[name="radioRemoveAvailable"]:checked').val(),
							notes: $('#ns1blankspaceAdminSchemaMethodsEditNotes').val()
						}

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('ADMIN_METHOD_MANAGE'),
							data: oData,
							dataType: 'json',
							success: function(data) 
							{
								if (data.status == 'OK')
								{
									ns1blankspace.status.message('Saved');
									ns1blankspace.admin.schema.methods.show()
								}
							}
						});
					}
				}					
}

ns1blankspace.admin.schema.methods.check =
{
	init: function (oParam)
	{
		ns1blankspace.admin.schema.properties.summaryByMethod(
		{
			onComplete: ns1blankspace.admin.schema.methods.check.process
		});
	},

	process: function (oParam, oResponse)
	{
		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'CORE_METHOD_SEARCH';
			oSearch.addField('title');
			oSearch.sort('title', 'asc');
			oSearch.rows = 9999;
			oSearch.getResults(function(data) {ns1blankspace.admin.schema.methods.check.process(oParam, data)})	
		}
		else
		{
			ns1blankspace.admin.schema.properties.data.checkMethods = oResponse.data.rows;

			_.each(ns1blankspace.admin.schema.properties.data.checkMethods, function (method)
			{
				method._method = _.find(ns1blankspace.admin.schema.properties.data.summaryByMethod, function (oProperty) {return oProperty.method == method.id});
				method.properties = 0;
				if (method._method != undefined)
				{
					method.properties = method._method.properties;
				}
			});
			
			var aMethodsNoProperties = _.filter(ns1blankspace.admin.schema.properties.data.checkMethods, function (method) {return method.properties == 0})

			$('#ns1blankspaceMainCheck').html('<div class="row"><div class="col-sm-6" id="ns1blankspaceCheck1"></div><div class="col-sm-6" style="font-size:0.5em; background-color:#f5f5f5;" id="ns1blankspaceCheck2"></div>');

			var aHTML = [];

			_.each(aMethodsNoProperties, function (methodNoProperties)
			{
				aHTML.push('<div class="ns1blankspaceSubNote ns1blankspaceRowSelect ns1blankspaceCheck" data-method-name="' + methodNoProperties.title + '">' + methodNoProperties.title + '</div>');
			});

			$('#ns1blankspaceCheck1').html(aHTML.join(''));

			$('.ns1blankspaceCheck').click(function(event)
			{
				ns1blankspace.admin.schema.properties.refresh.init(
				{
					methodName: $(this).attr('data-method-name')
				});
			});
		}	
	}
}

ns1blankspace.admin.schema.properties =
{
	data: 	{searchText: undefined, getFromSearch: {}, getFromDocs: {}, getParameters: {}},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.admin.schema.properties.show(oParam);
				},

	count: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_METHOD_PROPERTY_SEARCH';
						oSearch.addField('id');
						oSearch.addSummaryField('count(id) count');
						oSearch.rows = 1;
						oSearch.getResults(function(data) {ns1blankspace.admin.schema.properties.count(oParam, data)})	
					}
					else
					{
						$('#ns1blankspaceSummaryProperties').html(oResponse.summary.count);
					}	
				},	

	summaryByMethod: function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_METHOD_PROPERTY_SEARCH';
						oSearch.addField('method,count(id) properties');
						oSearch.rows = 9999;
						oSearch.getResults(function(data) {ns1blankspace.admin.schema.properties.summaryByMethod(oParam, data)})	
					}
					else
					{
						ns1blankspace.admin.schema.properties.data.summaryByMethod = oResponse.data.rows;
						ns1blankspace.util.onComplete(oParam);
					}	
				},

	getFromSearch: function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'ACTION_SEARCH';
						oSearch.addField('*');
						oSearch.returnParameters = 'Y';
						oSearch.getResults(function(data) {ns1blankspace.admin.schema.properties.getFromSearch(oParam, data)})	
					}
					else
					{
						ns1blankspace.admin.schema.properties.data.getFromSearch['ACTION_SEARCH'] = oResponse.data.parameters;
						ns1blankspace.util.onComplete(oParam);
					}	
				},

	getFromDocs: function (oParam, oResponse)
				{
					var sMethodName = ns1blankspace.util.getParam(oParam, 'methodName').value;

					if (sMethodName != undefined)
					{
						if (oResponse == undefined)
						{
							var oData =
							{
								url: 'https://docs.mydigitalstructure.cloud/' + sMethodName,
								type: 'GET'
							}

							$.ajax(
							{
								type: 'POST',
								url: '/rpc/core/?method=CORE_URL_GET',
								data: oData,
								dataType: 'json',
								cache: false,
								global: false,
								success: function(data) 
								{
									if (data.status == 'OK')
									{
										ns1blankspace.admin.schema.properties.getFromDocs(oParam, data)
									}
									else
									{
										console.log('Could not access the URL; ' + 'https://docs.mydigitalstructure.cloud/' + sMethodName)
									}
								}
							});	
						}
						else
						{
							ns1blankspace.admin.schema.properties.data.getFromDocs['_last'] = oResponse.response;

							ns1blankspace.admin.schema.properties.data.getFromDocs['_last'] = 
								'<table class="onDemandMethodReferenceHeader"' +
								ns1blankspace.admin.schema.properties.data.getFromDocs['_last'].split('<table class="onDemandMethodReferenceHeader"')[1];

							$('#ns1blankspaceCheck2').html($.parseHTML(ns1blankspace.admin.schema.properties.data.getFromDocs['_last']))

							ns1blankspace.admin.schema.properties.data.getFromDocs[sMethodName.toLowerCase()] =
								'<table>' + $('#ns1blankspaceMain table.onDemandMethodReferenceParameters:last').html() + '</table>';

							$('#ns1blankspaceCheck2').html(ns1blankspace.admin.schema.properties.data.getFromDocs[sMethodName.toLowerCase()]);

							var aTable = $('#ns1blankspaceCheck2 tr');

							ns1blankspace.admin.schema.properties.data.getFromDocs['_' + sMethodName.toLowerCase()] = [];

							var aParametersHTML = [];

							$.each(aTable, function (t, oTR)
							{
								aParametersHTML.push($(oTR).find('td'));
							});

							var aParameters = ns1blankspace.admin.schema.properties.data.getFromDocs['_' + sMethodName.toLowerCase()];

							$.each(aParametersHTML, function (p, oParameter)
							{
								if (_.trim($(oParameter[1]).text()) != 'ATTRIBUTES' &&
										_.trim($(oParameter[1]).text()) != '&nbsp;' &&
										_.trim($(oParameter[1]).text()) != 'Audit Fields' &&
										_.trim($(oParameter[1]).text()) != 'AVAILABLE FIELDS' &&
										_.trim($(oParameter[1]).text()) != '' &&
										_.trim($(oParameter[1]).text()) != 'Structure Fields' &&
										_.trim($(oParameter[1]).text()) != 'PARAMETERS' &&
										_.trim($(oParameter[1]).text()) != 'Standard System Parameters' &&
										_.trim($(oParameter[1]).text()) != 'Either:' &&
										_.trim($(oParameter[1]).text()) != 'Or:') 
								{
									aParameters.push(
									{
										name: _.trim($(oParameter[1]).text()),
										datatypetext: _.trim($(oParameter[2]).text()),
										notes: _.trim($(oParameter[3]).text()).replace(/&nbsp;/gi, '')
									})
								}
							});

							ns1blankspace.util.onComplete(oParam);
						}	
					}
				},

	getParameters: function (oParam, oResponse)
				{
					var sMethodName = ns1blankspace.util.getParam(oParam, 'methodName').value;

					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_METHOD_PROPERTY_SEARCH';
						oSearch.addField('name,title,method');
						oSearch.addFilter('methodtext', 'EQUAL_TO', sMethodName);
						oSearch.rows = 9999;
						oSearch.sort('title', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.admin.schema.properties.getParameters(oParam, data)});
					}
					else
					{
						ns1blankspace.admin.schema.properties.data.getParameters['_' + sMethodName.toLowerCase()] = oResponse.data.rows;
						ns1blankspace.util.onComplete(oParam);
					}
				},

	refresh: {
					init: function (oParam)
							{
								var sMethodName = ns1blankspace.util.getParam(oParam, 'methodName').value;
								if (sMethodName != undefined)
								{
									ns1blankspace.admin.schema.properties.data.getFromDocs['_' + sMethodName.toLowerCase()] = undefined;
									ns1blankspace.admin.schema.properties.data.getParameters['_' + sMethodName.toLowerCase()] = undefined;

									var oSearch = new AdvancedSearch();
									oSearch.method = 'CORE_METHOD_SEARCH';
									oSearch.addField('id');
									oSearch.addFilter('title', 'EQUAL_TO', sMethodName);
									oSearch.rows = 1;
									oSearch.getResults(function(oResponse)
									{
										ns1blankspace.admin.schema.properties.data.processing =
										{
											methodID: oResponse.data.rows[0].id,
											methodName: sMethodName
										}

										oParam = ns1blankspace.util.setParam(oParam, 'methodID', oResponse.data.rows[0].id);
										ns1blankspace.admin.schema.properties.refresh.getData(oParam)
									});
								}
							},

					getData: function (oParam)
							{
								var sMethodName = ns1blankspace.util.getParam(oParam, 'methodName').value;

								if (sMethodName != undefined)
								{		
									if (ns1blankspace.admin.schema.properties.data.getFromDocs['_' + sMethodName.toLowerCase()] == undefined)
									{
										oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.admin.schema.properties.refresh.getData)
										ns1blankspace.admin.schema.properties.getFromDocs(oParam);
									}
									else
									{
										if (ns1blankspace.admin.schema.properties.data.getParameters['_' + sMethodName.toLowerCase()] == undefined)
										{
											oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.admin.schema.properties.refresh.getData)
											ns1blankspace.admin.schema.properties.getParameters(oParam);
										}
										else
										{
											//console.log('From docs;')
											//console.log(ns1blankspace.admin.schema.properties.data.getFromDocs['_' + sMethodName.toLowerCase()]);
											//console.log('myds Parameters;')
											//console.log(ns1blankspace.admin.schema.properties.data.getParameters['_' + sMethodName.toLowerCase()]);
											ns1blankspace.admin.schema.properties.refresh.process(oParam)
										}

									}
								}
								else
								{
									console.log('Need to pass methodName:, else I have got nothing to do...')
								}
							},

					process: function (oParam)
							{
								var sMethodName = ns1blankspace.util.getParam(oParam, 'methodName').value;
								var bLog = ns1blankspace.util.getParam(oParam, 'log', {default: false}).value;

								$.each(ns1blankspace.admin.schema.properties.data.getFromDocs['_' + sMethodName.toLowerCase()], function (d, documentProperty)
								{
									documentProperty.match = _.find(ns1blankspace.admin.schema.properties.data.getParameters['_' + sMethodName.toLowerCase()], 
																			function (parameter) {return parameter.name == documentProperty.name})
								});

								var missingProperties = _.filter(ns1blankspace.admin.schema.properties.data.getFromDocs['_' + sMethodName.toLowerCase()], 
															function (documentProperty) {return documentProperty.match == undefined} )

								//console.log('Processed docs;')
								//console.log(ns1blankspace.admin.schema.properties.data.getFromDocs['_' + sMethodName.toLowerCase()]);

								console.log('Missing;');
								console.log(missingProperties);

								var oData;
								var aDataType;
								var sDataType;
								var sDataTypeLength;
								
								$.each(missingProperties, function (m, missingProperty)
								{
									aDataType = missingProperty.datatypetext.split(' (');
									sDataType = aDataType[0];
									sDataLength = undefined;

									if (sDataType == 'Text' && aDataType.length > 1)
									{
										sDataLength = aDataType[1].split(')')[0];
									}

									oData =
									{
										adminmethod: ns1blankspace.admin.schema.properties.data.processing.methodID,
										name: missingProperty.name,
										title: _.startCase(_.kebabCase(missingProperty.name)),
										notes: missingProperty.notes,
										datatype:  ns1blankspace.admin.schema.data.dataTypes[sDataType],
										datalength: sDataLength
									}

									if (bLog)
									{
										console.log(oData)
									}
									else
									{
										$.ajax(
										{
											type: 'POST',
											url: '/rpc/admin/?method=ADMIN_METHOD_PROPERTY_MANAGE',
											data: oData,
											dataType: 'json',
											success: function(data) 
											{}
										});
									}
									
								});
							}		
				},				
	
	show:		function (oParam, oResponse)
				{
					var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
					var sSearchText;

					if (oSearchText.exists)
					{
						sSearchText = oSearchText.value;
						ns1blankspace.admin.schema.properties.data.searchText = sSearchText;
					}
					else
					{	
						sSearchText = ns1blankspace.admin.schema.properties.data.searchText;
					}	

					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceAdminSchemaPropertiesColumn1"></td>' +
										'<td id="ns1blankspaceAdminSchemaPropertiesColumn2" style="width:115px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainProperties').html(aHTML.join(''));

						$('#ns1blankspaceAdminSchemaPropertiesColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.admin.schema.properties.data.details = [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_METHOD_PROPERTY_SEARCH';
						oSearch.addField('datalength,datatype,datatypetext,mandatory,method,methodtext,' +
								'name,notes,searchendpoint,searchmethod,searchrelatedproperty,title');
					
						if (sSearchText != '')
						{
							oSearch.addBracket('(');

							oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('name', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('methodtext', 'TEXT_IS_LIKE', sSearchText);
							
							if (!_.isNaN(_.toNumber(sSearchText)))
							{
								oSearch.addOperator('or');
								oSearch.addFilter('id', 'EQUAL_TO', sSearchText);
							}

							oSearch.addBracket(')');
						}

						oSearch.rows = 100;
						oSearch.sort('title', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.admin.schema.properties.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceAdminSchemaMethods">' +
											'<tr><td class="ns1blankspaceSub">No properties.</td></tr></table>');

							$('#ns1blankspaceAdminSchemaPropertiesColumn1').html(aHTML.join(''));
						}
						else
						{
							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceAdminSchemaProperties" class="ns1blankspace">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption">Name</td>' +
										'<td class="ns1blankspaceHeaderCaption">Method</td>');

							if (ns1blankspace.user.super)
							{
								aHTML.push('<td class="ns1blankspaceHeaderCaption"></td>');
							}

							aHTML.push('</tr>');

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.admin.schema.properties.row(this));
							});
							
							aHTML.push('</table>');
						}

						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceAdminSchemaPropertiesColumn1',
							xhtmlContext: 'AdminSchemaProperties',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.admin.schema.properties.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.admin.schema.properties.bind
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:14px;">' +
												'<input id="ns1blankspaceAdminSchemaPropertiesSearchText" class="ns1blankspaceText" style="width:130px;">' +
												'</td></tr>');
																			
						aHTML.push('<tr><td style="padding-top:0px;">' +
										'<span id="ns1blankspaceAdminSchemaPropertiesSearch" class="ns1blankspaceAction">Search</span>');

						if (sSearchText != undefined)
						{	
							aHTML.push(' <span id="ns1blankspaceAdminSchemaPropertiesSearchClear" class="ns1blankspaceAction">Clear</span>');
						}

						if (ns1blankspace.user.super)
						{
							aHTML.push('<tr><td style="padding-top:16px;">' +
										'<span id="ns1blankspaceAdminSchemaPropertiesAdd" class="ns1blankspaceAction">Add</span>');
						}	

						aHTML.push('</td></tr>');

						aHTML.push('</table>');

						if ($('#ns1blankspaceAdminSchemaPropertiesColumn2 table').length == 0)
						{
							$('#ns1blankspaceAdminSchemaPropertiesColumn2').html(aHTML.join(''));
						}
						else
						{
							$('#ns1blankspaceAdminSchemaPropertiesColumn2 table').before(aHTML.join(''));
						}

						$('#ns1blankspaceAdminSchemaPropertiesSearch').button(
						{
							label: 'Search'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminSchemaPropertiesSearchText').val());
							ns1blankspace.admin.schema.properties.show(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspaceAdminSchemaPropertiesSearchClear').button(
						{
							label: 'Clear'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', '');
							ns1blankspace.admin.schema.properties.show(oParam);
						})
						.css('width', '57px');

						$('#ns1blankspaceAdminSchemaPropertiesSearchText').keyup(function(e)
						{
							if (e.which === 13)
					    	{
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminSchemaPropertiesSearchText').val())
					    		ns1blankspace.admin.schema.properties.show(oParam);
					    	}
						});				

						$('#ns1blankspaceAdminSchemaPropertiesSearchText').val(sSearchText);

						if (ns1blankspace.user.super)
						{
							$('#ns1blankspaceAdminSchemaPropertiesAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								ns1blankspace.admin.schema.properties.edit({xhtmlElementID: this.id})
							})
							.css('width', '57px');
						}	
					}
				},	

	row: 		function (oRow)	
				{
					var aHTML = [];

					ns1blankspace.admin.schema.properties.data.details.push(oRow);

					aHTML.push('<tr id="ns1blankspaceAdminSchemaProperties_container-' + oRow["id"] + '">');
				
					aHTML.push('<td class="ns1blankspaceRow" style="word-break:break-all; word-wrap:break-word;">' +
										'<div class="ns1blankspaceRowSelect" id="ns1blankspaceAdminSchemaProperties_name-' + oRow["id"] + '" style="font-size:1em;">' + oRow["name"].toLowerCase() + '</div>' +
										'<div class="ns1blankspaceSubNote" word-break:break-all; word-wrap:break-word;"><em>' + oRow["methodtext"] + '</em></div>' +
										(oRow.notes!=''?'<div class="ns1blankspaceSubNote">' + oRow.notes + '</div>':'') + '</td>');

					if (ns1blankspace.user.super)
					{
						aHTML.push('<td style="width:70px;text-align:right;" class="ns1blankspaceRow">' + 
									'<span id="ns1blankspaceAdminSchemaProperties_remove-' + oRow.id + '" class="ns1blankspacePropertyRemove" style="margin-right:2px;"></span>' +
									'<span id="ns1blankspaceAdminSchemaProperties_edit-' + oRow.id + '" class="ns1blankspacePropertyEdit"' +
										' data-name="' + oRow["name"] + '"' +
										' data-datatype="' + oRow["datatype"] + '"' +
										' data-datatypetext="' + oRow["datatypetext"] + '"' +
										' data-data-length="' + oRow["datalength"] + '"' +
										' data-method="' + oRow["method"] + '"' +
										' data-methodtext="' + oRow["methodtext"] + '"' +
										' data-mandatory="' + oRow["mandatory"] + '"' +
										' data-searchmethod="' + oRow["searchmethod"] + '"' +
										' data-searchrelatedproperty="' + oRow["searchrelatedproperty"] + '"' +
										' data-title="' + oRow["title"] + '"' +
										' data-notes="' + window.btoa(oRow["notes"]) + '"' +	
										'></span></td>');
					}

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function ()
				{
					$('.ns1blankspaceRowSelect:visible').click(function()
					{
						ns1blankspace.admin.schema.properties.details({xhtmlElementID: this.id})
					});

					$('#ns1blankspaceAdminSchemaProperties .ns1blankspacePropertyRemove').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-close"
						}
					})
					.click(function()
					{
						ns1blankspace.remove(
						{
							xhtmlElementID: this.id,
							method: 'ADMIN_METHOD_PROPERTY_MANAGE',
							ifNoneMessage: 'No properties.'
						});
					})
					.css('width', '15px')
					.css('height', '17px');

					$('#ns1blankspaceAdminSchemaProperties .ns1blankspacePropertyEdit').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-pencil"
						}
					})
					.click(function()
					{
						ns1blankspace.admin.schema.properties.edit({xhtmlElementID: this.id})
					})
					.css('width', '15px')
					.css('height', '17px');	

				},

	details: 	
				function (oParam)
				{
					var sXHTMLElementID;
					var sKey;

					if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
					{
						sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
						sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
					}

					if ($('#ns1blankspaceAdminSchemaProperties_container_details-' + sKey).length != 0)
					{
						$('#ns1blankspaceAdminSchemaProperties_container_details-' + sKey).remove();
					}
					else
					{
						var sHTML = 'No details';

						var oDetail = $.grep(ns1blankspace.admin.schema.properties.data.details, function (a) {return a.id == sKey;})[0];

						if (oDetail)
						{
							sHTML = '<table class="table table-condensed">' +
										'<tr><td style="width:20%;">ID</td><td>' + oDetail.id + '</td></tr>' +
											'<tr><td>Title</td><td>' + oDetail.title + '</td></tr>' +
											'<tr><td>Mandatory</td><td>' + oDetail.mandatory + '</td></tr>' +
											'<tr><td>Data Type</td><td>' + oDetail.datatypetext + '</td></tr>';
								
							if (oDetail.datatypetext != 'Text')
							{
								sHTML = sHTML + '<tr><td>Data Length</td><td>' + oDetail.datalength + '</td></tr>';
							}
											
							if (oDetail.searchendpoint != '')
							{
								sHTML = sHTML + '<tr><td>Search Endpoint</td><td>' + oDetail.searchendpoint + '</td></tr>';
							}

							if (oDetail.searchrelatedproperty != '')
							{
								sHTML = sHTML + '<tr><td>Search Related Property</td><td>' + oDetail.searchrelatedproperty + '</td></tr>';
							}

							if ( oDetail.notes != '')
							{
								sHTML = sHTML + '<tr><td>Notes</td><td>' + oDetail.notes + '</td></tr>';
							}

							sHTML = sHTML + '<tr><td>Documentation</td><td><a href="https://docs.mydigitalstructure.cloud/' + oDetail.methodtext + '" target="_blank">' + 
													'docs.mydigitalstructure.cloud/' + oDetail.methodtext.toLowerCase() + '</a></td></tr>';

							sHTML = sHTML + '</table>'
							
							$('#ns1blankspaceAdminSchemaProperties_container-' + sKey).after('<tr id="ns1blankspaceAdminSchemaProperties_container_details-' + sKey + '" style="font-size:0.875em;">' +
								'<td colspan=4><div style="background-color: #F3F3F3; padding:8px; color:#444444; font-weight:100; font-size:0.875em;">' + sHTML + '</div></td></tr>');	
						}
					}
				},

	edit:		function (oParam, oResponse)
				{
					var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
					if (iID == undefined) {iID = ''}
		
					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceContainer">');

					aHTML.push('<tr class="ns1blankspaceContainer">' +
									'<td id="ns1blankspaceAdminSchemaPropertiesEditColumn1"></td>' +
									'<td id="ns1blankspaceAdminSchemaPropertiesEditColumn2" style="width:50px;"></td>' +
									'</tr>');

					aHTML.push('</table>');					
					
					$('#ns1blankspaceAdminSchemaPropertiesColumn2').html(aHTML.join(''));

					var aHTML = [];
								
					aHTML.push('<table class="ns1blankspaceColumn2a">' +
									'<tr><td><span id="ns1blankspaceAdminSchemaPropertiesEditSave" data-id="' + iID + '" class="ns1blankspaceAction">' +
									'Save</span></td></tr>' +
									'<tr><td><span id="ns1blankspaceAdminSchemaPropertiesEditCancel" class="ns1blankspaceAction">' +
									'Cancel</span></td></tr>' +
									'</table>');					
					
					$('#ns1blankspaceAdminSchemaPropertiesEditColumn2').html(aHTML.join(''));
					
					$('#ns1blankspaceAdminSchemaPropertiesEditSave').button(
					{
						text: "Save"
					})
					.click(function()
					{
						ns1blankspace.admin.schema.properties.save({id: $(this).attr('data-id')})
					})
					.css('width', '65px');

					$('#ns1blankspaceAdminSchemaPropertiesEditCancel').button(
					{
						text: "Cancel"
					})
					.click(function()
					{
						ns1blankspace.admin.schema.properties.show();
					})
					.css('width', '65px');

					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Name' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaPropertiesEditName" class="ns1blankspaceText">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Title' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaPropertiesEditTitle" class="ns1blankspaceText">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Method' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaPropertiesEditMethod" class="ns1blankspaceSelect"' +
										' data-method="CORE_METHOD_SEARCH"' +
										' data-columns="title">' +
									'</td></tr>');	

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Data Type' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceRadio">' +
									'<input type="radio" id="radioDataType1" name="radioDataType" value="1"/>Numeric' +
									'<br /><input type="radio" id="radioDataType2" name="radioDataType" value="2"/>Date' +
									'<br /><input type="radio" id="radioDataType3" name="radioDataType" value="3"/>Text' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Data Length' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaPropertiesEditDataLength" class="ns1blankspaceText">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Mandatory' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceRadio">' +
									'<input type="radio" id="radioMandatoryY" name="radioMandatory" value="Y"/>Yes' +
									'<br /><input type="radio" id="radioMandatoryN" name="radioMandatory" value="N"/>No' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Search Endpoint' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaPropertiesEditSearchEndpoint" class="ns1blankspaceText">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Search Method' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaPropertiesEditSearchMethod" class="ns1blankspaceText">' +
									'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Search Properties' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaPropertiesEditSearchRelatedProperty" class="ns1blankspaceText">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Notes' +
									'</td></tr>' +
									'<tr class="ns1blankspaceTextMulti">' +
									'<td class="ns1blankspaceTextMulti">' +
									'<textarea rows="10" cols="35" id="ns1blankspaceAdminSchemaPropertiesEditNotes" class="ns1blankspaceTextMulti"></textarea>' +
									'</td></tr>');

					aHTML.push('</table>');		

					$('#ns1blankspaceAdminSchemaPropertiesEditColumn1').html(aHTML.join(''));

					if (iID != '')
					{
						$('#ns1blankspaceAdminSchemaPropertiesEditName').val(ns1blankspace.util.getData(oParam, 'data-name').value);
						$('#ns1blankspaceAdminSchemaPropertiesEditTitle').val(ns1blankspace.util.getData(oParam, 'data-title').value);
						$('#ns1blankspaceAdminSchemaPropertiesEditMethod').val(ns1blankspace.util.getData(oParam, 'data-methodtext').value);
						$('#ns1blankspaceAdminSchemaPropertiesEditMethod').attr('data-id', ns1blankspace.util.getData(oParam, 'data-method').value);
						$('[name="radioDataType"][value="' + ns1blankspace.util.getData(oParam, 'data-datatype').value + '"]').attr('checked', true);
						$('#ns1blankspaceAdminSchemaPropertiesEditDataLength').val(ns1blankspace.util.getData(oParam, 'data-data-length').value);
						$('[name="radioMandatory"][value="' + ns1blankspace.util.getData(oParam, 'data-mandatory').value + '"]').attr('checked', true);
						$('#ns1blankspaceAdminSchemaPropertiesEditSearchEndpoint').val(ns1blankspace.util.getData(oParam, 'data-searchendpoint').value);
						$('#ns1blankspaceAdminSchemaPropertiesEditSearchMethod').val(ns1blankspace.util.getData(oParam, 'data-searchmethod').value);
						$('#ns1blankspaceAdminSchemaPropertiesEditSearchRelatedProperty').val(ns1blankspace.util.getData(oParam, 'data-searchrelatedproperty').value);
						$('#ns1blankspaceAdminSchemaPropertiesEditNotes').val(window.atob(ns1blankspace.util.getData(oParam, 'data-notes').value));	 
					}
				},

	save: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var iID = ns1blankspace.util.getParam(oParam, 'id').value;
						var iDataLength = $('#ns1blankspaceAdminSchemaPropertiesEditDataLength').val();
						if (iDataLength == '') {iDataLength = 0}

						var oData =
						{
							id: iID,
							name: $('#ns1blankspaceAdminSchemaPropertiesEditName').val(),
							title: $('#ns1blankspaceAdminSchemaPropertiesEditTitle').val(),
							adminmethod: $('#ns1blankspaceAdminSchemaPropertiesEditMethod').attr('data-id'),
							datatype: $('input[name="radioDataType"]:checked').val(),
							unrestrictedaccess: $('[name="radioUnrestrictedAccess"]:checked').val(),
							datalength: iDataLength,
							mandatory: $('[name="radioMandatory"]:checked').val(),
							searchendpoint: $('#ns1blankspaceAdminSchemaPropertiesEditSearchEndpoint').val(),
							searchmethod: $('#ns1blankspaceAdminSchemaPropertiesEditSearchMethod').val(),
							searchrelatedproperty: $('#ns1blankspaceAdminSchemaPropertiesEditSearchRelatedProperty').val(),
							notes: $('#ns1blankspaceAdminSchemaPropertiesEditNotes').val()
						}

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('ADMIN_METHOD_PROPERTY_MANAGE'),
							data: oData,
							dataType: 'json',
							success: function(data) 
							{
								if (data.status == 'OK')
								{
									ns1blankspace.status.message('Saved');
									ns1blankspace.admin.schema.properties.show()
								}
							}
						});
					}
				}									
}

ns1blankspace.admin.schema.objects =
{
	data: 	{searchText: undefined},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.admin.schema.objects.show(oParam);
				},

	count: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_OBJECT_SEARCH';
						oSearch.addField('id');
						oSearch.addSummaryField('count(id) count');
						oSearch.rows = 1;
						oSearch.getResults(function(data) {ns1blankspace.admin.schema.objects.count(oParam, data)})	
					}
					else
					{
						$('#ns1blankspaceSummaryObjects').html(oResponse.summary.count);
					}	
				},	
	
	show:		function (oParam, oResponse)
				{
					var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
					var sSearchText;

					if (oSearchText.exists)
					{
						sSearchText = oSearchText.value;
						ns1blankspace.admin.schema.objects.data.searchText = sSearchText;
					}
					else
					{	
						sSearchText = ns1blankspace.admin.schema.objects.data.searchText;
					}	

					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceAdminSchemaObjectsColumn1"></td>' +
										'<td id="ns1blankspaceAdminSchemaObjectsColumn2" style="width:115px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainObjects').html(aHTML.join(''));

						$('#ns1blankspaceAdminSchemaObjectsColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.admin.schema.objects.data.details = [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_OBJECT_SEARCH';
						oSearch.addField('categorytext,title,bulkavailable,advancedsearchmethod,defaulttextcolumn,parentobject,parentobjecttext,prefix,roleobjectaccessavailable,snapshotavailable,notes');
					
						if (sSearchText != '')
						{
							oSearch.addBracket('(');

							oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);
							
							if (!_.isNaN(_.toNumber(sSearchText)))
							{
								oSearch.addOperator('or');
								oSearch.addFilter('id', 'EQUAL_TO', sSearchText);
							}

							oSearch.addBracket(')');
						}

						oSearch.rows = 20;
						oSearch.sort('title', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.admin.schema.objects.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceAdminSchemaObjects">' +
											'<tr><td class="ns1blankspaceSub">No objects.</td></tr></table>');

							$('#ns1blankspaceAdminSchemaObjectsColumn1').html(aHTML.join(''));
						}
						else
						{
							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceAdminSchemaObjects" class="ns1blankspace">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption">Title</td>' +
										'<td class="ns1blankspaceHeaderCaption">Category</td>' +
										'</tr>');

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.admin.schema.objects.row(this));
							});
							
							aHTML.push('</table>');
						}

						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceAdminSchemaObjectsColumn1',
							xhtmlContext: 'AdminSchemaObjects',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.admin.schema.objects.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.admin.schema.objects.bind
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:14px;">' +
												'<input id="ns1blankspaceAdminSchemaObjectsSearchText" class="ns1blankspaceText" style="width:130px;">' +
												'</td></tr>');
																			
						aHTML.push('<tr><td style="padding-top:0px;">' +
										'<span id="ns1blankspaceAdminSchemaObjectsSearch" class="ns1blankspaceAction">Search</span>');

						if (sSearchText != undefined)
						{	
							aHTML.push(' <span id="ns1blankspaceAdminSchemaObjectsSearchClear" class="ns1blankspaceAction">Clear</span>');
						}

						aHTML.push('</td></tr>');

						aHTML.push('</table>');

						if ($('#ns1blankspaceAdminSchemaObjectsColumn2 table').length == 0)
						{
							$('#ns1blankspaceAdminSchemaObjectsColumn2').html(aHTML.join(''));
						}
						else
						{
							$('#ns1blankspaceAdminSchemaObjectsColumn2 table').before(aHTML.join(''));
						}

						$('#ns1blankspaceAdminSchemaObjectsSearch').button(
						{
							label: 'Search'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminSchemaObjectsSearchText').val());
							ns1blankspace.admin.schema.objects.show(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspaceAdminSchemaObjectsSearchClear').button(
						{
							label: 'Clear'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', '');
							ns1blankspace.admin.schema.objects.show(oParam);
						})
						.css('width', '57px');

						$('#ns1blankspaceAdminSchemaObjectsSearchText').keyup(function(e)
						{
							if (e.which === 13)
					    	{
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminSchemaObjectsSearchText').val())
					    		ns1blankspace.admin.schema.objects.show(oParam);
					    	}
						});				

						$('#ns1blankspaceAdminSchemaObjectsSearchText').val(sSearchText);
					}
				},	

	row: 		function (oRow)	
				{
					var aHTML = [];

					ns1blankspace.admin.schema.objects.data.details.push(oRow);

					aHTML.push('<tr id="ns1blankspaceAdminSchemaObjects_container-' + oRow["id"] + '">');
					
					aHTML.push('<td id="ns1blankspaceAdminSchemaObjects_title-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
										oRow["title"].toLowerCase() + '</td>');

					aHTML.push('<td id="ns1blankspaceAdminSchemaObjects_category-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										oRow["categorytext"] + '</td>');

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function ()
				{
					$('.ns1blankspaceRowSelect:visible').click(function()
					{
						ns1blankspace.admin.schema.objects.details({xhtmlElementID: this.id})
					});		
				},

	details: 	
				function (oParam)
				{
					var sXHTMLElementID;
					var sKey;

					if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
					{
						sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
						sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
					}

					if ($('#ns1blankspaceAdminSchemaObjects_container_details-' + sKey).length != 0)
					{
						$('#ns1blankspaceAdminSchemaObjects_container_details-' + sKey).remove();
					}
					else
					{
						var sHTML = 'No details';

						var oDetail = $.grep(ns1blankspace.admin.schema.objects.data.details, function (a) {return a.id == sKey;})[0];

						if (oDetail)
						{
							sHTML = '<table class="table table-condensed">' +
										'<tr><td style="width:40%;">ID</td><td>' + oDetail.id + '</td></tr>' +
										'<tr><td>Prefix</td><td>' + oDetail.prefix + '</td></tr>' +
										'<tr><td>Category</td><td>' + oDetail.categorytext + '</td></tr>' +
										'<tr><td>Bulk Update Available</td><td>' + oDetail.bulkavailable + '</td></tr>' +
										'<tr><td>Snapshot Available</td><td>' + oDetail.snapshotavailable + '</td></tr>' +
										'<tr><td>Role Based Access Available</td><td>' + oDetail.roleobjectaccessavailable + '</td></tr>' +
										'<tr><td>Default Reference Property</td><td>' + oDetail.defaulttextcolumn + '</td></tr>';

											
							if (oDetail.advancedsearchmethod != '')
							{
								sHTML = sHTML + '<tr><td>Search Endpoint</td><td>' + oDetail.advancedsearchmethod + '</td></tr>';
							}

							if (oDetail.parentobjecttext != '')
							{
								sHTML = sHTML + '<tr><td>Parent</td><td>' + oDetail.parentobjecttext + '</td></tr>';
							}

							if (oDetail.notes != '')
							{
								sHTML = sHTML + '<tr><td>Notes</td><td>' + oDetail.notes + '</td></tr>';
							}

							sHTML = sHTML + '</table>'
							
							$('#ns1blankspaceAdminSchemaObjects_container-' + sKey).after('<tr id="ns1blankspaceAdminSchemaObjects_container_details-' + sKey + '" style="font-size:0.875em;">' +
								'<td colspan=4><div style="background-color: #F3F3F3; padding:8px; color:#444444; font-weight:100; font-size:0.875em;">' + sHTML + '</div></td></tr>');	
						}
					}
				}				
}

ns1blankspace.admin.schema.links =
{
	data: 	{searchText: undefined},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.admin.schema.links.show(oParam);
				},

	count: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_METHOD_LINK_SEARCH';
						oSearch.addField('id');
						oSearch.addSummaryField('count(id) count');
						oSearch.rows = 1;
						oSearch.getResults(function(data) {ns1blankspace.admin.schema.links.count(oParam, data)})	
					}
					else
					{
						$('#ns1blankspaceSummaryLinks').html(oResponse.summary.count);
					}	
				},	
	
	show:		function (oParam, oResponse)
				{
					var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
					var sSearchText;

					if (oSearchText.exists)
					{
						sSearchText = oSearchText.value;
						ns1blankspace.admin.schema.links.data.searchText = sSearchText;
					}
					else
					{	
						sSearchText = ns1blankspace.admin.schema.links.data.searchText;
					}	

					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceAdminSchemaLinksColumn1"></td>' +
										'<td id="ns1blankspaceAdminSchemaLinksColumn2" style="width:300px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainLinks').html(aHTML.join(''));

						$('#ns1blankspaceAdminSchemaLinksColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.admin.schema.links.data.details = [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_METHOD_LINK_SEARCH';
						oSearch.addField('adminmethod,adminmethodtext,adminparentmethod,adminparentmethodtext,notes');
					
						if (sSearchText != '')
						{
							oSearch.addBracket('(');

							oSearch.addFilter('adminmethodtext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('adminparentmethodtext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addBracket(')');
						}

						oSearch.rows = 20;
						oSearch.sort('adminparentmethodtext', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.admin.schema.links.show(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceAdminSchemaLinkss">' +
											'<tr><td class="ns1blankspaceSub">No links.</td></tr></table>');

							$('#ns1blankspaceAdminSchemaLinksColumn1').html(aHTML.join(''));
						}
						else
						{
							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceAdminSchemaLinks" class="ns1blankspace">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption">Parent Method</td>' +
										'<td class="ns1blankspaceHeaderCaption">Method</td>')

							if (ns1blankspace.user.super)
							{
								aHTML.push('<td class="ns1blankspaceHeaderCaption"></td>');
							}

							aHTML.push('</tr>');

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.admin.schema.links.row(this));
							});
							
							aHTML.push('</table>');
						}

						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspaceAdminSchemaLinksColumn1',
							xhtmlContext: 'AdminSchemaLinks',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 20,
							functionShowRow: ns1blankspace.admin.schema.links.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.admin.schema.links.bind
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:14px;">' +
												'<input id="ns1blankspaceAdminSchemaLinksSearchText" class="ns1blankspaceText" style="width:130px;">' +
												'</td></tr>');
																			
						aHTML.push('<tr><td style="padding-top:0px;">' +
										'<span id="ns1blankspaceAdminSchemaLinksSearch" class="ns1blankspaceAction">Search</span>');

						if (sSearchText != undefined)
						{	
							aHTML.push(' <span id="ns1blankspaceAdminSchemaLinksSearchClear" class="ns1blankspaceAction">Clear</span>');
						}
							
						if (ns1blankspace.user.super)
						{
							aHTML.push('<tr><td style="padding-top:16px;">' +
										'<span id="ns1blankspaceAdminSchemaLinksAdd" class="ns1blankspaceAction">Add</span>');
						}			
							
						aHTML.push('</td></tr>');

						aHTML.push('</table>');

						if ($('#ns1blankspaceAdminSchemaLinksColumn2 table').length == 0)
						{
							$('#ns1blankspaceAdminSchemaLinksColumn2').html(aHTML.join(''));
						}
						else
						{
							$('#ns1blankspaceAdminSchemaLinksColumn2 table').before(aHTML.join(''));
						}

						$('#ns1blankspaceAdminSchemaLinksSearch').button(
						{
							label: 'Search'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminSchemaLinksSearchText').val());
							ns1blankspace.admin.schema.links.show(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspaceAdminSchemaLinksSearchClear').button(
						{
							label: 'Clear'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', '');
							ns1blankspace.admin.schema.links.show(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspaceAdminSchemaLinksSearchText').keyup(function(e)
						{
							if (e.which === 13)
					    	{
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAdminSchemaLinksSearchText').val())
					    		ns1blankspace.admin.schema.links.show(oParam);
					    	}
						});				

						$('#ns1blankspaceAdminSchemaLinksSearchText').val(sSearchText);
						
						if (ns1blankspace.user.super)
						{
							$('#ns1blankspaceAdminSchemaLinksAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								ns1blankspace.admin.schema.links.edit({xhtmlElementID: this.id})
							})
							.css('width', '57px');
						}	
					}
				},	

	row: 		function (oRow)	
				{
					var aHTML = [];

					ns1blankspace.admin.schema.links.data.details.push(oRow);

					aHTML.push('<tr id="ns1blankspaceAdminSchemaLinks_container-' + oRow["id"] + '">');
					
					aHTML.push('<td class="ns1blankspaceRow">' +
										'<div id="ns1blankspaceAdminSchemaLinks_parentmethod-' + oRow["id"] + '" class="ns1blankspaceRowSelect" style="font-size:1em;">' + oRow["adminparentmethodtext"] + '</div>' + 
										'</td>');

					aHTML.push('<td class="ns1blankspaceRow"><div id="ns1blankspaceAdminSchemaLinks_method-' + oRow["id"] + '">' +
									oRow["adminmethodtext"] + '</div>' +
									(oRow.notes!=''?'<div class="ns1blankspaceSubNote">' + oRow.notes + '</div>':'') + '</td>');

					if (ns1blankspace.user.super)
					{
						aHTML.push('<td style="width:70px;text-align:right;" class="ns1blankspaceRow">' + 
									'<span id="ns1blankspaceAdminSchemaLinks_remove-' + oRow.id + '" class="ns1blankspaceLinkRemove" style="margin-right:2px;"></span>' +
									'<span id="ns1blankspaceAdminSchemaLinks_edit-' + oRow.id + '" class="ns1blankspaceLinkEdit"' +
										' data-adminmethod="' + oRow["adminmethod"] + '"' +
										' data-adminmethodtext="' + oRow["adminmethodtext"] + '"' +
										' data-adminparentmethod="' + oRow["adminparentmethod"] + '"' +
										' data-adminparentmethodtext="' + oRow["adminparentmethodtext"] + '"' +
										' data-notes="' + window.btoa(oRow["notes"]) + '"' +
										'></span></td>');
					}

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function ()
				{
					$('.ns1blankspaceRowSelect:visible').click(function()
					{
						ns1blankspace.admin.schema.links.details({xhtmlElementID: this.id})
					});

					$('#ns1blankspaceAdminSchemaLinks .ns1blankspaceLinkRemove').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-close"
						}
					})
					.click(function()
					{
						ns1blankspace.remove(
						{
							xhtmlElementID: this.id,
							method: 'ADMIN_METHOD_LINK_MANAGE',
							ifNoneMessage: 'No links.'
						});
					})
					.css('width', '15px')
					.css('height', '17px');

					$('#ns1blankspaceAdminSchemaLinks .ns1blankspaceLinkEdit:visible').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-pencil"
						}
					})
					.click(function()
					{
						ns1blankspace.admin.schema.links.edit({xhtmlElementID: this.id})
					})
					.css('width', '15px')
					.css('height', '17px');	
				},

	details: 	
				function (oParam)
				{
					var sXHTMLElementID;
					var sKey;

					if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
					{
						sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
						sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
					}

					if ($('#ns1blankspaceAdminSchemaLinks_container_details-' + sKey).length != 0)
					{
						$('#ns1blankspaceAdminSchemaLinks_container_details-' + sKey).remove();
					}
					else
					{
						var sHTML = 'No details';

						var oDetail = $.grep(ns1blankspace.admin.schema.links.data.details, function (a) {return a.id == sKey;})[0];

						if (oDetail)
						{
							sHTML = '<table class="table table-condensed">' +
										'<tr><td style="width:40%;">ID</td><td>' + oDetail.id + '</td></tr>';

							if (oDetail.notes != '')
							{
								sHTML = sHTML + '<tr><td>Notes</td><td>' + oDetail.notes + '</td></tr>';
							}

							sHTML = sHTML + '<tr><td id="ns1blankspaceAdminSchemaLinkParentMethod-' + oDetail.adminparentmethodtext + '" class="ns1blankspaceViewLink">'
														+ oDetail.adminparentmethodtext + '</td><td></td></tr>';

							sHTML = sHTML + '<tr><td id="ns1blankspaceAdminSchemaLinkParentMethod-' + oDetail.adminmethodtext + '" class="ns1blankspaceViewLink">'
														+ oDetail.adminmethodtext + '</td><td></td></tr>';
							
							sHTML = sHTML + '</table>'
							
							$('#ns1blankspaceAdminSchemaLinks_container-' + sKey).after('<tr id="ns1blankspaceAdminSchemaLinks_container_details-' + sKey + '" style="font-size:0.875em;">' +
								'<td colspan=4><div style="background-color: #F3F3F3; padding:8px; color:#444444; font-weight:100; font-size:0.875em;">' + sHTML + '</div></td></tr>');

							$('#ns1blankspaceAdminSchemaLinkParentMethod-' + oDetail.adminparentmethodtext).click().click(function ()
							{
								$('.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
								$('#ns1blankspaceControlMethods').addClass('ns1blankspaceHighlight');
								ns1blankspace.show({selector: '#ns1blankspaceMainMethods'});
								ns1blankspace.admin.schema.methods.show({searchText: this.id.split('-')[1]})
							});

							$('#ns1blankspaceAdminSchemaLinkParentMethod-' + oDetail.adminmethodtext).click().click(function ()
							{
								$('.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
								$('#ns1blankspaceControlMethods').addClass('ns1blankspaceHighlight');
								ns1blankspace.show({selector: '#ns1blankspaceMainMethods'});
								ns1blankspace.admin.schema.methods.show({searchText: this.id.split('-')[1]})
							});
						}
					}
				},

	edit:		function (oParam, oResponse)
				{
					var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
					if (iID == undefined) {iID = ''}
		
					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceContainer">');

					aHTML.push('<tr class="ns1blankspaceContainer">' +
									'<td id="ns1blankspaceAdminSchemaLinksEditColumn1"></td>' +
									'<td id="ns1blankspaceAdminSchemaLinksEditColumn2" style="width:50px;"></td>' +
									'</tr>');

					aHTML.push('</table>');					
					
					$('#ns1blankspaceAdminSchemaLinksColumn2').html(aHTML.join(''));

					var aHTML = [];
								
					aHTML.push('<table class="ns1blankspaceColumn2a">' +
									'<tr><td><span id="ns1blankspaceAdminSchemaLinksEditSave" data-id="' + iID + '" class="ns1blankspaceAction">' +
									'Save</span></td></tr>' +
									'<tr><td><span id="ns1blankspaceAdminSchemaLinksEditCancel" class="ns1blankspaceAction">' +
									'Cancel</span></td></tr>' +
									'</table>');					
					
					$('#ns1blankspaceAdminSchemaLinksEditColumn2').html(aHTML.join(''));
					
					$('#ns1blankspaceAdminSchemaLinksEditSave').button(
					{
						text: "Save"
					})
					.click(function()
					{
						ns1blankspace.admin.schema.links.save({id: $(this).attr('data-id')})
					})
					.css('width', '65px');

					$('#ns1blankspaceAdminSchemaLinksEditCancel').button(
					{
						text: "Cancel"
					})
					.click(function()
					{
						ns1blankspace.admin.schema.links.show();
					})
					.css('width', '65px');

					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Parent Method' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaLinksEditParentMethod" class="ns1blankspaceSelect"' +
										' data-method="CORE_METHOD_SEARCH"' +
										' data-columns="title">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Method' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceAdminSchemaLinksEditMethod" class="ns1blankspaceSelect"' +
										' data-method="CORE_METHOD_SEARCH"' +
										' data-columns="title">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Notes' +
									'</td></tr>' +
									'<tr class="ns1blankspaceTextMulti">' +
									'<td class="ns1blankspaceTextMulti">' +
									'<textarea rows="10" cols="35" id="ns1blankspaceAdminSchemaLinksEditNotes" class="ns1blankspaceTextMulti"></textarea>' +
									'</td></tr>');

					aHTML.push('</table>');		

					$('#ns1blankspaceAdminSchemaLinksEditColumn1').html(aHTML.join(''));

					if (iID != '')
					{
						$('#ns1blankspaceAdminSchemaLinksEditParentMethod').val(ns1blankspace.util.getData(oParam, 'data-adminparentmethodtext').value);
						$('#ns1blankspaceAdminSchemaLinksEditParentMethod').attr('data-id', ns1blankspace.util.getData(oParam, 'data-adminparentmethod').value);
						$('#ns1blankspaceAdminSchemaLinksEditMethod').val(ns1blankspace.util.getData(oParam, 'data-adminmethodtext').value);
						$('#ns1blankspaceAdminSchemaLinksEditMethod').attr('data-id', ns1blankspace.util.getData(oParam, 'data-adminmethod').value);
						$('#ns1blankspaceAdminSchemaLinksEditNotes').val(window.atob(ns1blankspace.util.getData(oParam, 'data-notes').value));	 
					}
				},

	save: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var iID = ns1blankspace.util.getParam(oParam, 'id').value;

						var oData =
						{
							id: iID,
							adminparentmethod: $('#ns1blankspaceAdminSchemaLinksEditParentMethod').attr('data-id'),
							adminmethod: $('#ns1blankspaceAdminSchemaLinksEditMethod').attr('data-id'),
							notes: $('#ns1blankspaceAdminSchemaLinksEditNotes').val()
						}

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('ADMIN_METHOD_LINK_MANAGE'),
							data: oData,
							dataType: 'json',
							success: function(data) 
							{
								if (data.status == 'OK')
								{
									ns1blankspace.status.message('Saved');
									ns1blankspace.admin.schema.links.show()
								}
							}
						});
					}
				}					
}