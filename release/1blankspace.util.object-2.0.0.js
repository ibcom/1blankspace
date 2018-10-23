/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/

 ns1blankspace.util.object.link.init({xhtmlElementContainerID: 'ns1blankspaceMain', parentObject:41, parentObjectFilter: 'structure-EQUAL_TO-203', object:40, objectFilter: 'structure-EQUAL_TO-203'})
 
 */
 
"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

ns1blankspace.util.object =
{
	link: 		{
					data: 		{},

					init: 	function (oParam)
							{
								var sXHTMLElementContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlElementContainerID').value;
								var sParentObjectFilter = ns1blankspace.util.getParam(oParam, 'parentObjectFilter').value;
								var sObjectFilter = ns1blankspace.util.getParam(oParam, 'objectFilter').value;
								var sParentObjectMethod = ns1blankspace.util.getParam(oParam, 'parentObjectMethod').value;
								var sObjectMethod = ns1blankspace.util.getParam(oParam, 'objectMethod').value;

								$vq.init('<table class="ns1blankspaceContainer">' +
											'<tr class="ns1blankspaceContainer">' +
											'<td id="ns1blankspaceUtilObjectLinkColumn1" style="font-size:0.875em;" class="ns1blankspaceColumn2"></td>' +
											'<td id="ns1blankspaceUtilObjectLinkColumn2" class="ns1blankspaceColumn2"></td>' +
											'</tr>' +
											'</table>');					
											
								$vq.render('#' + sXHTMLElementContainerID);

								oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementContainerID', 'ns1blankspaceUtilObjectLinkColumn2');

								$vq.init('<table id="ns1blankspaceObjectLinks" style="width:250px;"><tbody>');

								$vq.add('<tr><td><input id="ns1blankspaceParentObjectContextAddValue" class="ns1blankspaceSelect" data-method="' + sParentObjectMethod + '" ' +
											'data-methodfilter="' + sParentObjectFilter  + '"></td></tr>');

								$vq.add('<tr><td><input id="ns1blankspaceObjectContextAddValue" class="ns1blankspaceSelect" data-method="' + sObjectMethod + '" ' +
											'data-methodfilter="' + sObjectFilter + '"></td></tr>');

								$vq.add('<tr><td><span id="ns1blankspaceObjectContextSearch" class="ns1blankspaceAction"><span></td></tr>');

								$vq.add('<tr><td><span id="ns1blankspaceObjectContextInitSave" class="ns1blankspaceAction"><span></td></tr>');

								$vq.render('#ns1blankspaceUtilObjectLinkColumn1');

								$('#ns1blankspaceObjectContextSearch').button(
								{
									label: 'Search'
								})
								.unbind('click').click(function()
								{
									if ($('#ns1blankspaceParentObjectContextAddValue').attr('data-id') == '')
									{
										delete oParam.parentObject;
										delete oParam.parentObjectContext;
									}
									else
									{	
										oParam = ns1blankspace.util.setParam(oParam, 'parentObject', 195);
										oParam = ns1blankspace.util.setParam(oParam, 'parentObjectContext', $('#ns1blankspaceParentObjectContextAddValue').attr('data-id'));
									}	

									if ($('#ns1blankspaceObjectContextAddValue').attr('data-id') == '')
									{
										delete oParam.object;
										delete oParam.objectContext;
									}
									else
									{	
										oParam = ns1blankspace.util.setParam(oParam, 'object', 41);
										oParam = ns1blankspace.util.setParam(oParam, 'objectContext', $('#ns1blankspaceObjectContextAddValue').attr('data-id'));
									}	
									
									ns1blankspace.util.object.link.show(oParam);
								})
								.css('height', '25px');

								$('#ns1blankspaceObjectContextInitSave').button(
								{
									label: 'Save'
								})
								.unbind('click').click(function()
								{
									var oData = 
									{
										parentobject: oParam.parentObject,
										parentobjectcontext: $('#ns1blankspaceParentObjectContextAddValue').attr('data-id'),
										object: oParam.object,
										objectcontext: $('#ns1blankspaceObjectContextAddValue').attr('data-id'),
										contextnotes: $('#ns1blankspaceParentObjectContextAddValue').val() + '|' + $('#ns1blankspaceObjectContextAddValue').val()
									}

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CORE_OBJECT_LINK_MANAGE'),
										data: oData,
										dataType: 'json',
										success: function(oResponse)
										{
											ns1blankspace.status.message('Saved');
											ns1blankspace.util.object.link.show(oParam);
										}
									});
								})
								.css('height', '25px');
							},

					show: 	function (oParam, oResponse)
							{
								var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
								var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext').value;
								var iParentObject = ns1blankspace.util.getParam(oParam, 'parentObject').value;
								var iParentObjectContext = ns1blankspace.util.getParam(oParam, 'parentObjectContext').value;
								var bOnlyIfNotes = ns1blankspace.util.getParam(oParam, 'onlyIfNotes', {"default": true}).value;
								var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
								var sXHTMLElementContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlElementContainerID').value;
								var sIfNoneMessage = ns1blankspace.util.getParam(oParam, 'ifNoneMessage', {"default": 'No links'}).value;
								var iOffsetTop = ns1blankspace.util.getParam(oParam, 'offsetTop', {"default": '4'}).value;

								if (oResponse == undefined)
								{	
									ns1blankspace.status.working();

									var oSearch = new AdvancedSearch();
									oSearch.method = 'CORE_OBJECT_LINK_SEARCH';
									oSearch.addField('contextnotes,object,objectcontext,objecttext,parentobject,parentobjectcontext,parentobjecttext');
									if (iObject != undefined) {oSearch.addFilter('object', 'EQUAL_TO', iObject)};
									if (iObjectContext != undefined) {oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext)};
									if (iParentObject != undefined) {oSearch.addFilter('parentobject', 'EQUAL_TO', iParentObject)};
									if (iParentObjectContext != undefined) {oSearch.addFilter('parentobjectcontext', 'EQUAL_TO', iParentObjectContext)};
									if (bOnlyIfNotes != undefined) {oSearch.addFilter('contextnotes', 'TEXT_IS_NOT_EMPTY')};
									oSearch.rows = 250;
									oSearch.getResults(function(data) {ns1blankspace.util.object.link.show(oParam, data)});
								}	
								else
								{
									ns1blankspace.status.clear();

									if (sXHTMLElementContainerID != undefined)
									{
										$vq.init('<table id="ns1blankspaceObjectLinks" class="ns1blankspaceColumn2" style="width:250px;"><tbody>');
									}
									else
									{
										$vq.init('<table id="ns1blankspaceObjectLinks" class="ns1blankspaceViewControlContainer" style="width:250px;"><tbody>');
										$vq.add('<tr><td id="ns1blankspaceObjectContextAddContainer"></td>' +
												'<td style="text-align:right;"><span id="ns1blankspaceObjectContextAdd" class="ns1blankspaceAction"><span></td></tr>');
									}	

									if (oResponse.data.rows == 0)
									{
										$vq.add('<tr><td style="font-size:0.825em;" class="ns1blankspaceNothing">' + sIfNoneMessage + '</td></tr>');
									}
									else
									{
										$.each(oResponse.data.rows, function (r, row)
										{
											$vq.add('<tr><td style="font-size:0.825em;" id="ns1blankspaceObjectLink_context-' + row.object + '-' + row.objectcontext + '">' +
														'<div class="ns1blankspaceSub">' + (row.objecttext=='Survey Results'?'Structure Data':row.objecttext) + '</div>' +
														'<div>' + row.contextnotes + '</div></td>');

											$vq.add('<td style="width:23px;text-align:right;"><span id="ns1blankspaceObjectLink_remove-' + row.id + 
														'" class="ns1blankspaceRowRemove"></span></td>');
										});
									}

									$vq.add('</tbody></table>');
									
									if (sXHTMLElementContainerID != undefined)
									{
										$vq.render('#' + sXHTMLElementContainerID);
									}
									else
									{	
										ns1blankspace.container.show(
										{
											xhtmlElementID: sXHTMLElementID,
											xhtml: $vq.get(),
											offsetTop: iOffsetTop,
											dropdown: true
										});	
									}				

									$('#ns1blankspaceObjectContextAdd').button(
									{
										label: 'Add'
									})
									.unbind('click').click(function()
									{
										ns1blankspace.util.object.link.add(oParam);
									})
									.css('height', '25px');

									$('#ns1blankspaceObjectLinks .ns1blankspaceRowRemove').button(
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
											method: 'CORE_OBJECT_LINK_MANAGE',
											ifNoneMessage: sIfNoneMessage,
											minimumSiblings: 0
										});
									})
									.css('width', '15px')
									.css('height', '20px');
								}
							},

					add: 	function (oParam, oResponse)
							{
								var iObject = ns1blankspace.util.getParam(oParam, 'object').value;

								$vq.init('<input id="ns1blankspaceObjectContextAddValue" class="ns1blankspaceSelect"');
								
								$vq.add('data-method="STRUCTURE_DATA_SEARCH" ' +
											'data-methodfilter="structure-EQUAL_TO-203">');

								$vq.render('#ns1blankspaceObjectContextAddContainer');

								$('#ns1blankspaceObjectContextAdd').button(
								{
									label: 'Save'
								})
								.unbind('click').click(function()
								{
									var oData = 
									{
										parentobject: oParam.parentObject,
										parentobjectcontext: oParam.parentObjectContext,
										object: oParam.object,
										objectcontext: $('#ns1blankspaceObjectContextAddValue').attr('data-id'),
										contextnotes: $('#ns1blankspaceObjectContextAddValue').val()
									}

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CORE_OBJECT_LINK_MANAGE'),
										data: oData,
										dataType: 'json',
										success: function(oResponse)
										{
											ns1blankspace.status.message('Saved');

											ns1blankspace.container.hide(
											{
												dropdown: true
											});

											ns1blankspace.util.object.link.show();
										}
									});
								})
								.css('height', '25px');
							}																		
				}			
}		