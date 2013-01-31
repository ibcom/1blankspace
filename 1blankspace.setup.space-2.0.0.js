/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.setup.space = 
{
	init: 		function (oParam)
				{
					ns1blankspace.app.reset();

					ns1blankspace.object = 24;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'space';
					ns1blankspace.viewName = 'My Space / Account';
			
					ns1blankspace.app.set(oParam);
				},

	home:		function ()
				{
					var aHTML = [];
									
					aHTML.push('<table class="ns1blankspace">' +
									'<tr><td id="ns1blankspaceMostLikely" class="ns1blankspace">' +
									ns1blankspace.xhtml.loading +
									'</td></tr>' +
									'</table>');					
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<table>' +
							'<tr><td><div id="ns1blankspaceViewSetupSpaceLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>' +
							'</table>');

					aHTML.push('<table>');

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlSubscriptions" class="ns1blankspaceControl">Subscriptions</td>' +
									'</tr>');			
						
					if (ns1blankspace.option.advancedAccess)
					{	
						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlAccess" class="ns1blankspaceControl">Access</td>' +
									'</tr>');
					}	
								
					aHTML.push('</table>');		
					
					$('#ns1blankspaceControl').html(aHTML.join(''));	
					
					$('#ns1blankspaceControlSubscriptions').click(function(event)
					{
						ns1blankspace.show({refresh: true});
						ns1blankspace.setup.space.subscriptions();
					});

					$('#ns1blankspaceControlAccess').click(function(event)
					{
						ns1blankspace.show({refresh: true});
						ns1blankspace.setup.space.access();
					});
					
					$('#ns1blankspaceControlSubscriptions').addClass('ns1blankspaceHighlight');

					ns1blankspace.setup.space.subscriptions()
				},

	subscriptions:			
				function (oParam, oResponse)
				{
					var iStep = 1;
					var sID; 
					var sXHTMLElementID;
						
					if (oParam != undefined)
					{
						if (oParam.step != undefined) {iStep = oParam.step}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}
					else
					{
						oParam = {step: 1};
					}
					
					if (sXHTMLElementID != undefined)
					{
						var aXHTMLElementID = sXHTMLElementID.split('-');
						var sID = aXHTMLElementID[1];
					}	

					if (iStep == 1)
					{
						if (oResponse == undefined)
						{
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SUBSCRIPTION_SEARCH'),
								data: '',
								dataType: 'json',
								success: function(data){ns1blankspace.setup.space.subscriptions(oParam, data)}
							});	
						}
						else
						{
							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspaceMain">' +
											'<tr class="ns1blankspace">' +
											'<td id="ns1blankspaceSubscriptionColumn1" class="ns1blankspaceColumn1Large">' +
											ns1blankspace.xhtml.loading + '</td>' +
											'<td id="ns1blankspaceSubscriptionColumn2" class="ns1blankspaceColumn2Action" style="width:100px;"></td>' +
											'</tr>' +
											'</table>');	
						
							$('#ns1blankspaceMain').html(aHTML.join(''));
						
							var aHTML = [];
							
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<table><tr><td valign="top">You have no subsriptions.</td></tr></table>');

								$('#ns1blankspaceSubscriptionColumn1').html(aHTML.join(''));
							}
							else
							{			
								var aHTML = [];
								
								aHTML.push('<table id="ns1blankspaceSetupSpaceSubscriptions" class="ns1blankspace">');
						
								$(oResponse.data.rows).each(function() 
								{
									aHTML.push('<tr class="ns1blankspaceRow">');
									
									aHTML.push('<td id="ns1blankspaceSetupSpaceSubscription_membership-' + this.id + '" class="ns1blankspaceRow">' +
															this.membershiptext + '</td>');
														
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspaceSetupSpaceSubscription_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span></td>');				
																					
									aHTML.push('</tr>');
								});
								
								aHTML.push('</table>');
							}
							
							$('#ns1blankspaceSubscriptionColumn1').html(aHTML.join(''));

							$('ns1blankspaceSetupSpaceSubscriptions > span.ns1blankspaceRowOptionsRemoveX').button(
							{
								text: false,
								icons: {
									primary: "ui-icon-close"
								}
							})
							.click(function() {
								$.extend(true, oParam, {step: 4, xhtmlElementID: this.id});
								ns1blankspace.setup.space.subscriptions(oParam);
							})
							.css('width', '15px')
							.css('height', '17px');

							$('ns1blankspaceSetupSpaceSubscriptions td.ns1blankspaceRowSelect').click(function() {
								$.extend(true, oParam, {step: 2, xhtmlElementID: event.target.id});
								ns1blankspace.setup.space.subscriptions(oParam);
							})
						}	
					}

					if (iStep == 2)
					{	
						//EDIT SUBSCRIPTION
					}
					
					if (iStep == 4)
					{			
						//REMOVE SUBSCRIPTION
					}		
				},

	access:
				function (oParam, oResponse)
				{
					var iStep = 1;
					var iID;
					var sXHTMLElementID;

					if (oParam != undefined)
					{
						if (oParam.step != undefined) {iStep = oParam.step}
						if (oParam.id != undefined) {iID = oParam.id}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}
						
					if (iStep == 1)
					{
						var aHTML = [];
	
						if (oResponse == undefined)
						{
							aHTML.push('<table class="ns1blankspaceMain">' +
											'<tr class="ns1blankspace">' +
											'<td id="ns1blankspaceSetupAccessColumnAccess" class="ns1blankspaceColumn1Large" style="width:450px;padding-right:5px;font-size:0.75em;">' +
											ns1blankspace.xhtml.loading + '</td>' +
											'<td id="ns1blankspaceSetupAccessColumnAction" class="ns1blankspaceColumn2Action"></td>' +
											'</tr>' +
											'</table>');

							$('#ns1blankspaceMainAccess').html(aHTML.join(''));

							var aHTML = [];

							aHTML.push('<table class="ns1blankspaceColumn2">' +
											'<tr><td class="ns1blankspaceAction">' +
											'<span id="ns1blankspaceAccessAdd">Add</span>' +
											'</td></tr>' +
											'</table>');					
							
							$('#ns1blankspaceSetupAccessColumnAction').html(aHTML.join(''));
						
							$('#ns1blankspaceAccessAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								$.extend(true, oParam, {step: 4, id: ""});
								ns1blankspace.setup.space.access(oParam);
							})
						
							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_METHOD_ACCESS_SEARCH';
							oSearch.addField('title,accessmethod,accessmethodtext,addavailable,removeavailable,updateavailable,useavailable');
							oSearch.rows = 50;
							oSearch.sort('accessmethodtext', 'asc');
							oSearch.addFilter('accessmethodtext', 'TEXT_IS_NOT_EMPTY')
							oSearch.getResults(function(data) {ns1blankspace.setup.space.access(oParam, data)})	
						}
						else
						{
							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspaceContainer">');

							aHTML.push('<tr class="ns1blankspaceCaption">');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">Method</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:35px;text-align:center;">Search</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:35px;text-align:center;">Add</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:35px;text-align:center;">Update</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:35px;text-align:center;">Remove</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
							aHTML.push('</tr>');

							$(oResponse.data.rows).each(function()
							{

								aHTML.push('<tr id="ns1blankspaceSetupSpaceAccess" class="ns1blankspaceRow">');
								
								if (this.accessmethodtext != '')
								{
									aHTML.push('<td id="ns1blankspaceSetupSpaceAccess_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
														' title="">' +
														this.accessmethodtext + '</td>');

									aHTML.push('<td style="width:35px;text-align:center;" ' +
													'id="ns1blankspaceSetupSpaceAccess_useavailable-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowEdit' +
														((this.useavailable == 'Y') ? ' ticked' : '') + '">&nbsp;' +
													'</td>');		

									aHTML.push('<td style="width:35px;text-align:center;" ' +
													'id="ns1blankspaceSetupSpaceAccess_addavailable-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowEdit' +
														((this.addavailable == 'Y') ? ' ticked' : '') + '">&nbsp;' +
													'</td>');

									aHTML.push('<td style="width:35px;text-align:center;" ' +
													'id="ns1blankspaceSetupSpaceAccess_updateavailable-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowEdit' +
														((this.updateavailable == 'Y') ? ' ticked' : '') + '">&nbsp;' +
													'</td>');

									aHTML.push('<td style="width:35px;text-align:right;" ' +
													'id="ns1blankspaceSetupSpaceAccess_removeavailable-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowEdit' +
														((this.removeavailable == 'Y') ? ' ticked' : '') + '">&nbsp;' +
													'</td>');									

									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspaceSetupSpaceAccess_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>' +
													'</td>');		
								}

								aHTML.push('</tr>');

							});
						
							aHTML.push('</table>');
								
							$('#ns1blankspaceSetupAccessColumnAccess').html(aHTML.join(''));

							$('#ns1blankspaceSetupSpaceAccess > td.ns1blankspaceRowSelect').click(function(event)
							{
								var sXHTMLElementId = event.target.id;
								var aId = sXHTMLElementId.split('-');
								
								ns1blankspace.setup.space.access({id: aId[1], step: 3});
							});

							$('#ns1blankspaceSetupSpaceAccess > span.ns1blankspaceRowOptionsRemove').button(
							{
								text: false,
								icons: {
									primary: "ui-icon-close"
								}
							})
							.click(function() {
								$.extend(true, oParam, {step: 5, xhtmlElementID: this.id});
								ns1blankspace.setup.space.access(oParam);
							})
							.css('width', '15px')
							.css('height', '17px');
						}
						
					}	
					else if (iStep == 3)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'SETUP_METHOD_ACCESS_SEARCH';
						oSearch.addField('title,accessmethod,accessmethodtext,addavailable,removeavailable,updateavailable,useavailable');
						oSearch.addFilter('id', 'EQUAL_TO', iID);

						oSearch.getResults(function(data) {
								$.extend(true, oParam, {step: 4});
								ns1blankspace.setup.space.access(oParam, data)
								});
					}

					else if (iStep == 4)
					{
						var aHTML = [];

						if (iID == '')
						{
							aHTML.push('<table class="ns1blankspace">');
							
							aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceCaption">' +
											'Method' +
											'</td></tr>' +
											'<tr class="ns1blankspaceSelect">' +
											'<td class="ns1blankspaceSelect">' +
											'<input id="ns1blankspaceAccessMethod" class="ns1blankspaceSelectCustom">' +
											'</td></tr>');

							aHTML.push('</table>');					
						}

						aHTML.push('<table class="ns1blankspaceContainer">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Search?' +
										'</td></tr>' +
										'<tr class="ns1blankspaceRadio">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioCanUseY" name="radioCanUse" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioCanUseN" name="radioCanUse" value="N"/>No' +
									'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Add?' +
										'</td></tr>' +
										'<tr class="ns1blankspaceRadio">' +
										'<td id="ns1blankspaceAccessCanAddValue" class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioCanAddY" name="radioCanAdd" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioCanAddN" name="radioCanAdd" value="N"/>No' +
										'</td></tr>');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Remove?' +
										'</td></tr>' +
										'<tr class="ns1blankspaceRadio">' +
										'<td id="ns1blankspaceAccessCanRemoveValue" class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioCanRemoveY" name="radioCanRemove" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioCanRemoveN" name="radioCanRemove" value="N"/>No' +
									'</td></tr>');
					
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Update?' +
										'</td></tr>' +
										'<tr class="ns1blankspaceRadio">' +
										'<td id="ns1blankspaceAccessCanUpdateValue" class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioCanUpdateY" name="radioCanUpdate" value="Y"/>Yes' +
										'<br /><input type="radio" id="radioCanUpdateN" name="radioCanUpdate" value="N"/>No' +
									'</td></tr>');
					
						aHTML.push('</table>');					
						
						aHTML.push('<table class="ns1blankspaceContainer" style="font-size:0.875em">');
								
						aHTML.push('<tr class="ns1blankspaceAction">' +
										'<td id="ns1blankspaceAccessSave" class="ns1blankspaceAction">' +
										'<span style="width:70px;" id="ns1blankspaceAccessSave">Save</span>' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspaceAction">' +
											'<td id="tdns1blankspaceMethodAccessCancel" class="ns1blankspaceAction">' +
											'<span style="width:70px;" id="ns1blankspaceAccessCancel">Cancel</span>' +
											'</td></tr>');
															
						aHTML.push('</table>');					
							
						$('#ns1blankspaceSetupAccessColumnAction').html(aHTML.join(''));

						$('#ns1blankspaceAccessMethod').keyup(function()
						{
							if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
					        ns1blankspace.timer.delayCurrent = setTimeout("ns1blankspace.setup.space.methods.show('ns1blankspaceAccessMethod')", ns1blankspace.option.typingWait);
						});	
							
						$('#ns1blankspaceAccessMethod').live('blur', function() 
						{
							$(this).removeClass('ns1blankspaceHighlight');
						});
						
						$('#ns1blankspaceAccessSave').button(
						{
							text: "Save"
						})
						.click(function() 
						{
							ns1blankspace.status.working();

							var sData = 'id=' + ns1blankspace.util.fs(iID);
							if (iID == '')
							{
								sData += '&accessmethod=' + ns1blankspace.util.fs($('#ns1blankspaceAccessMethod').attr('data-id'));
							}	
							sData += '&addavailable=' + ns1blankspace.util.fs($('input[name="radioCanAdd"]:checked').val());
							sData += '&removeavailable=' + ns1blankspace.util.fs($('input[name="radioCanRemove"]:checked').val());
							sData += '&updateavailable=' + ns1blankspace.util.fs($('input[name="radioCanUpdate"]:checked').val());
							sData += '&useavailable=' + ns1blankspace.util.fs($('input[name="radioCanUse"]:checked').val());

							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('SETUP_METHOD_ACCESS_MANAGE'),
								data: sData,
								dataType: 'json',
								success: function(data) {
									if (data.status == "OK")
									{
										ns1blankspace.status.message('Saved');
										$.extend(true, oParam, {step: 1});
										ns1blankspace.setup.space.access(oParam);
									}
									else
									{
										ns1blankspace.status.error(data.error.errornotes);
									}
								}
							});
						});

						$('#ns1blankspaceAccessCancel').button(
						{
							text: "Cancel"
						})
						.click(function() 
						{
							$.extend(true, oParam, {step: 1});
							ns1blankspace.setup.space.access(oParam);
						});

						if (iID != '')
						{	
							if (oResponse.data.rows.length != 0)
							{
								var oObjectContext = oResponse.data.rows[0];
								
								$('[name="radioCanAdd"][value="' + oObjectContext.addavailable + '"]').attr('checked', true);
								$('[name="radioCanRemove"][value="' + oObjectContext.removeavailable + '"]').attr('checked', true);
								$('[name="radioCanUpdate"][value="' + oObjectContext.updateavailable + '"]').attr('checked', true);
								$('[name="radioCanUse"][value="' + oObjectContext.useavailable + '"]').attr('checked', true);
							}
							else
							{
								$('[name="radioCanAdd"][value="Y"]').attr('checked', true);
								$('[name="radioCanRemove"][value="Y"]').attr('checked', true);
								$('[name="radioCanUpdate"][value="Y"]').attr('checked', true);
								$('[name="radioCanUse"][value="Y"]').attr('checked', true);
							}
						}	
					}

					else if (iStep == 5)
					{
						var aSearch = sXHTMLElementID.split('-');
						var sData = 'remove=1&id=' + aSearch[1];
									
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('SETUP_METHOD_ACCESS_MANAGE'),
							data: sData,
							dataType: 'json',
							success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
						});	
					}
				},

	methods: 	{
					show: 		function (sXHTMLInputElementID, oResponse)
								{
									var aHTML = [];
									var sSearchText;
									var iXHTMLElementContextID;

									if (oResponse == undefined)
									{	
										sSearchText = $('#' + sXHTMLInputElementID).val();
										
										if (sSearchText.length > 2)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_METHOD_SEARCH';
											oSearch.addField('title');
											oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText)
											oSearch.rows = 10;
											oSearch.sort('title', 'asc');
											oSearch.getResults(function(data) {ns1blankspace.setup.space.methods.show(sXHTMLInputElementID, data)})	
										}
									}
									else
									{	
										aHTML.push('<table style="width: 350px;" class="ns1blankspaceSearchMedium">');

										$(oResponse.data.rows).each(function()
										{
											
											aHTML.push('<tr>' +
												'<td id="ns1blankspaceMethod-' + this.id + '" data-methodtext="' + this.title + '" class="ns1blankspaceSearch ns1blankspaceMethod">' +
												this.title +
												'</td></tr>');
												
										});			
														
										aHTML.push('</table>');
										
										$(ns1blankspace.xhtml.container).html(aHTML.join(''));

										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										$(ns1blankspace.xhtml.container).offset({ top: $('#' + sXHTMLInputElementID).offset().top + $('#' + sXHTMLInputElementID).height(), left: $('#' + sXHTMLInputElementID).offset().left});

										$('.ns1blankspaceMethod').click(function(event)
										{
											var aXHTMLElementID = (event.target.id).split('-');
											iXHTMLElementContextID = aXHTMLElementID[1];

											$('#' + sXHTMLInputElementID).val($('#' + event.target.id).attr("data-methodtext"))
											$('#' + sXHTMLInputElementID).attr("data-id", iXHTMLElementContextID)
											$(ns1blankspace.xhtml.container).hide();
										});
									}	
								}
				},

	template: 	{
					list: 		function ()
								{


								},

					create: 	function ()
								{

								}			

				}

}								
