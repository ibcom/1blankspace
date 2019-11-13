/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.favourite = 
{
	data: 	{
					mode:
					{
						options:
						{
							user: 1,
							everyone: 2
						}
					}
				},

	init: 	function (oParam)
				{
					if (oParam === undefined) {oParam = {}}

					var bInitialised = ns1blankspace.util.getParam(oParam, 'initialised', {"default": false}).value;

					ns1blankspace.app.reset();

					ns1blankspace.object = -8;
					ns1blankspace.objectName = 'favourite';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.objectMethod = "CORE_FAVOURITE"
					ns1blankspace.viewName = 'Tags / Favourites';

					if (ns1blankspace.favourite.data.mode.value === undefined)
					{
						ns1blankspace.favourite.data.mode.value = ns1blankspace.util.getParam(oParam, 'mode', {"default": 1}).value;
					}	
					
					if (!bInitialised)
					{	
						oParam = ns1blankspace.util.setParam(oParam, 'initialised', true);
						oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.favourite.init);
						ns1blankspace.favourite.types.get(oParam)
					}
					else
					{
						ns1blankspace.app.set(oParam);
					}
				},

	types: 	{
					get: function (oParam, oResponse)
					{
						if (oResponse == undefined)
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'SETUP_CORE_FAVOURITE_TYPE_SEARCH';		
							oSearch.addField('displayorder,hidden,notes,private,title,createduser');
							
							oSearch.addBracket('(')
							oSearch.addFilter('private', 'EQUAL_TO', 'Y');
							oSearch.addOperator('and')
							oSearch.addFilter('createduser', 'EQUAL_TO', ns1blankspace.user.id);
							oSearch.addBracket(')')
							oSearch.addOperator('or')
							oSearch.addFilter('private', 'EQUAL_TO', 'N');
						
							oSearch.rows = 99999;
							oSearch.sort('title', 'asc');
							
							oSearch.getResults(function(data) {ns1blankspace.favourite.types.get(oParam, data)});
						}
						else
						{
							ns1blankspace.favourite.data.types = oResponse.data.rows;
							ns1blankspace.favourite.data.userTypeIDs = _.map(_.filter(ns1blankspace.favourite.data.types, function (type) {return (type.private == 'Y')}), 'id');
							ns1blankspace.favourite.data.everyoneTypeIDs = _.map(_.filter(ns1blankspace.favourite.data.types, function (type) {return (type.private == 'N')}), 'id');

							if (ns1blankspace.favourite.data.userTypeIDs.length == 0)
							{
								ns1blankspace.favourite.data.userTypeIDs.push(-1)
							}

							if (ns1blankspace.favourite.data.everyoneTypeIDs.length == 0)
							{
								ns1blankspace.favourite.data.everyoneTypeIDs.push(-1)
							}

							ns1blankspace.util.onComplete(oParam)
						}
					},

					show:	function (oParam, oResponse)
					{
						var showTypes = _.filter(ns1blankspace.favourite.data.types, function (type)
						{
							var bInclude = (type.private == 'Y' && type.createduser == ns1blankspace.user.id && ns1blankspace.favourite.data.mode.value == 1)

							if (!bInclude && ns1blankspace.user.spaceAdmin && ns1blankspace.favourite.data.mode.value == 2)
							{
								bInclude = (type.private == 'N')
							}

							return bInclude
						})

						var aHTML = [];
						
						aHTML.push('<table id="ns1blankspaceFavouriteTypeContainer">');
		
						aHTML.push('<tr class="ns1blankspaceRow">');
						aHTML.push('<td class="ns1blankspaceHeaderCaption">Title</td>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right"><span id="ns1blankspaceFavouriteTypesAdd"></span></td>');
						aHTML.push('</tr>');
						
						_.each(showTypes, function (type)
						{
							aHTML.push('<tr class="ns1blankspaceRow">');
											
							aHTML.push('<td id="td_ns1blankspaceSetup-' + type.id + 
											'" class="ns1blankspaceRow ns1blankspaceEdit" style="cursor: pointer;">' +
											type.title + '</td>');
							
							aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
											'<span id="ns1blankspaceFavouriteTypesAdd_options_remove-' + type.id + '" data-id="' + type.id + '" class="ns1blankspaceRowRemove"></span></td>');

						
							aHTML.push('</tr>');
						});

						aHTML.push('</table>');

						$('#ns1blankspaceMostLikely').html(aHTML.join(''));

						$('#ns1blankspaceFavouriteTypesAdd').button(
						{
							text: false,
							icons:
							{
								 primary: "ui-icon-plus"
							}
						})
						.click(function()
						{
							ns1blankspace.favourite.types.add()
						})
						.css('width', ns1blankspace.option.rowButtonWidth)
						.css('height', ns1blankspace.option.rowButtonHeight);
							
						$('td.ns1blankspaceEdit').click(function(event)
						{
							ns1blankspace.favourite.types.edit.start(event.target.id);
						});
						
						$('.ns1blankspaceRowRemove').button(
						{
							text: false,
							icons:
							{
								 primary: "ui-icon-close"
							}
						})
						.click(function()
						{
							var sID = $(this).attr('data-id');
							var sXHTMLElementID = this.id;
							var oSearch = new AdvancedSearch();
							oSearch.method = 'CORE_FAVOURITE_SEARCH';		
							oSearch.addField('id');
							oSearch.addFilter('type', 'EQUAL_TO', sID);
							oSearch.rows = 9999;
							oSearch.getResults(function(oResponse)
							{
								if (oResponse.data.rows.length == 0)
								{
									ns1blankspace.remove(
									{
										xhtmlElementID: sXHTMLElementID,
										method: 'SETUP_CORE_FAVOURITE_TYPE_MANAGE',
										ifNoneMessage: 'No tags / favourite types.',
										onComplete: ns1blankspace.favourite.types.get
									});
								}
								else
								{
									ns1blankspace.status.error('Can not delete as it is in use.')
								}
							});
						})
						.css('width', ns1blankspace.option.rowButtonWidth)
						.css('height', ns1blankspace.option.rowButtonHeight);				
					},

					add: function ()
					{
						var aHTML = [];
							
						aHTML.push('<tr class="ns1blankspaceRow">');
											
						aHTML.push('<td id="td_ns1blankspaceFavouriteType-" class="ns1blankspaceRow ns1blankspaceFavouriteType"></td>');
						
						aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
												'<span id="ns1blankspaceFavouriteType_options_remove-" class="ns1blankspaceRowRemove"></span></td>');

						aHTML.push('</tr>');
								
						$('#ns1blankspaceFavouriteTypeContainer tr:first').after(aHTML.join(''));	
						$('#ns1blankspaceViewControlNew').button({disabled: true});
						$('#ns1blankspaceFavouriteTypesAdd').button({disabled: true});
						
						ns1blankspace.favourite.types.edit.start('td_ns1blankspaceFavouriteType-');
					},

					edit:
					{
						start:	function (sElementID)
									{
										var aSearch = sElementID.split('-');
										var sActionElementID = '#' + aSearch[0] + '-options-' + aSearch[2];

										var sHTML = $('#' + sElementID).html();
										
										var sElementInputID = sElementID.replace('td', 'input');
										
										sHTML = '<input style="width:100%;" id="' + sElementInputID + '" class="ns1blankspace" ' +
																'value="' + sHTML + '">'
										
										$('#' + sElementID).html(sHTML);
										$('#' + sElementInputID).focus();
										
										$('#' + sElementInputID).focusout(function(event)
										{
											ns1blankspace.favourite.types.edit.stop(sElementID);
										});
									},

						stop:		function (sElementID)
									{
										ns1blankspace.favourite.types.edit.save(sElementID);
										
										var aSearch = sElementID.split('-');
										var sHTML = $('#' + sElementID.replace('td', 'input')).val();

										$('#' + sElementID).html(sHTML);
									},

						save:		function (sElementID)
									{
										if ($('#' + sElementID.replace('td', 'input')).length === 1)
										{

											var aElement = sElementID.split('-');
											
											if (aElement[1] === '' && $('#' + sElementID.replace('td', 'input')).val() === '')
											{
												$('#ns1blankspaceFavouriteTypeContainer tr:first').next().fadeOut(500);	
												$('#ns1blankspaceViewControlNew').button({disabled: false});
												$('#ns1blankspaceFavouriteTypesAdd').button({disabled: false});
											}
											else
											{
												ns1blankspace.status.working();
												
												var oData =
												{
													id: aElement[1],
													title: $('#' + sElementID.replace('td', 'input')).val(),
													private: 'Y'
												}

												if (ns1blankspace.favourite.data.mode.value == 2)
												{
													oData.private = 'N'
												}

												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('SETUP_CORE_FAVOURITE_TYPE_MANAGE'),
													data: oData,
													dataType: 'json',
													success: function(data) 
													{
														if (data.notes === 'ADDED')
														{
															$('#ns1blankspaceFavouriteType-').attr('id','td_ns1blankspaceFavouriteType-' + data.id);
															
															$('td.ns1blankspaceFavouriteType').unbind('click');
																
															$('td.ns1blankspaceFavouriteType').click(function(event)
															{
																ns1blankspace.favourite.types.edit.start(event.target.id);
															});

															$('#ns1blankspaceFavouriteType_options_remove-').attr('id','ns1blankspaceFavouriteType_options_remove-' + data.id);
															
															$('.ns1blankspaceRowRemove').button(
															{
																text: false,
																icons:
																{
																	primary: "ui-icon-close"
																}
															})
															.click(function()
															{
																//check
															})
															.css('width', '15px')
															.css('height', '20px');
														}
														
														ns1blankspace.status.message('Saved');
														ns1blankspace.inputDetected = false;
														$('#ns1blankspaceViewControlNew').button({disabled: false});
														$('#ns1blankspaceFavouriteTypesAdd').button({disabled: false});
														$('#ns1blankspaceNothingToShow').hide();
														ns1blankspace.favourite.types.get();
													}
												});
											}
										}				
									}
					}

				},

	home: 	
	{
		show: function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

					var aHTML = [];
								
					aHTML.push('<table class="ns1blankspaceMain">');
					aHTML.push('<tr class="ns1blankspaceMain">' +
									'<td id="ns1blankspaceMostLikely" class="ns1blankspaceMain">' +
									ns1blankspace.xhtml.loading +
									'</td>' +
									'<td id="ns1blankspaceHomeAction" style="width:0px;"></td>' +
									'</tr>');
					aHTML.push('</table>');					
					
					$('#ns1blankspaceMain').html(aHTML.join(''));

					var aHTML = [];

					var aHTML = [];
								
					aHTML.push('<table><tr><td>' +
						'<span style="color:#b8b8b8; font-size:2.6em; margin-top:4px; margin-right: 8px;" class="glyphicon glyphicon-tags" aria-hidden="true"></span>' +
						'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControl-1" class="ns1blankspaceControl" style="padding-top:15px;">' +
									'Personal</td></tr>');			
							
					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControl-2" class="ns1blankspaceControl">' +
									'<div>Everyone</div><div class="ns1blankspaceSubNote">in this space</div>' +
									'</td></tr>');	

					aHTML.push('</table>');	
					
					$('#ns1blankspaceControl').html(aHTML.join(''));

					$('td.ns1blankspaceControl').click(function(event)
					{
						ns1blankspace.favourite.data.mode.value = (this.id).split('-')[1];
						ns1blankspace.favourite.home.show();
					});

					$('#ns1blankspaceControl-' + ns1blankspace.favourite.data.mode.value).addClass("ns1blankspaceHighlight");

					var aHTML = [];
					
					aHTML.push('<table><tr>');

					aHTML.push('<td style="width:100px;">');

						aHTML.push('<table id="ns1blankspaceFavouriteTypeContainer">');

						aHTML.push('<tr class="ns1blankspaceRow">');
						aHTML.push('<td id="ns1blankspaceFavouriteType_title-" data-id="" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceHighlight">' +
											'All</td>');
						aHTML.push('</tr>');

						var showTypes = _.filter(ns1blankspace.favourite.data.types, function (type)
						{
							var bInclude = ((type.private == 'Y') && (type.createduser == ns1blankspace.user.id) && (ns1blankspace.favourite.data.mode.value == 1))

							if (!bInclude && (ns1blankspace.favourite.data.mode.value == 2))
							{
								bInclude = (type.private == 'N')
							}

							return bInclude
						})

						_.each(showTypes, function (type)
						{	
							aHTML.push('<tr class="ns1blankspaceRow">');
							aHTML.push('<td id="ns1blankspaceFavouriteType_title-' + type.id + '" data-id="' + type.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
											type.title + '</td>');
							aHTML.push('</tr>');
						});

						if (ns1blankspace.favourite.data.mode.value == 1 || (ns1blankspace.favourite.data.mode.value == 2 && ns1blankspace.user.spaceAdmin))
						{
							aHTML.push('<tr class="ns1blankspaceRow">');
							aHTML.push('<td style="padding-top:16px;">' +
												'<span id="ns1blankspaceFavouriteTypesEdit" class="ns1blankspaceSubNote btn btn-default btn-sm">Manage Tags</span></td>');
							aHTML.push('</tr>');
						}
						
						aHTML.push('</table>');

					aHTML.push('</td>');
					
					aHTML.push('<td id="ns1blankspaceFavouritesContainer"></td>');

					aHTML.push('</table>');

					$('#ns1blankspaceMostLikely').html(aHTML.join(''));

					$('#ns1blankspaceFavouriteTypesEdit').click(function()
					{
						ns1blankspace.favourite.types.show()
					});

					$('#ns1blankspaceFavouriteTypeContainer .ns1blankspaceRowSelect:visible').click(function()
					{
						oParam = ns1blankspace.util.setParam(oParam, 'type', $(this).attr('data-id'))
						ns1blankspace.favourite.home.process(oParam);
					});

					ns1blankspace.favourite.home.process(oParam);
				},

		process: function (oParam, oResponse)
				{
					var bTypedOnly = ns1blankspace.util.getParam(oParam, 'typedOnly', {"default": false}).value;
					var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": ''}).value;

					if (oResponse == undefined)
					{
						ns1blankspace.status.working();
						$('#ns1blankspaceFavouritesContainer').html('<table class="ns1blankspaceColumn2"><tr><td>' + ns1blankspace.xhtml.loading + '</td></tr></table>')

						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_FAVOURITE_SEARCH';		
						oSearch.addField('notes,object,objecttext,objectcontext,objectcontexttext,type,typetext,modifieddate');
						
						if (ns1blankspace.favourite.data.mode.value == ns1blankspace.favourite.data.mode.options.user)
						{
							if (iType == '')
							{
								oSearch.addFilter('type', 'IN_LIST', ns1blankspace.favourite.data.userTypeIDs.join(','));
							}
							else
							{
								oSearch.addFilter('type', 'EQUAL_TO', iType);
							}

							oSearch.addOperator('and');
							oSearch.addFilter('createduser', 'EQUAL_TO', ns1blankspace.user.id);
						}
						else
						{
							if (iType == '')
							{
								oSearch.addFilter('type', 'IN_LIST', ns1blankspace.favourite.data.everyoneTypeIDs.join(','));

								if (!bTypedOnly)
								{
									oSearch.addOperator('or');
									oSearch.addFilter('type', 'IS_NULL');
								}
							}
							else
							{
								oSearch.addFilter('type', 'EQUAL_TO', iType);
							}
						}
		
						oSearch.rows = 50;
						oSearch.sort('modifieddate', 'desc');
						
						oSearch.getResults(function(data) {ns1blankspace.favourite.home.process(oParam, data)});
					}
					else
					{
						ns1blankspace.status.clear();

						var aHTML = [];

						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table class="ns1blankspaceColumn2">' +
											'<tr><td class="ns1blankspaceNothing">No tagged / favourite data.</td></tr>' +
											'</table>');
						}
						else
						{
							aHTML.push('<table class="ns1blankspaceColumn2">');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');

								aHTML.push('<td id="ns1blankspaceMostLikely_objectcontext-' + this.id + '" ' +
													' data-object="' + this.object + '"' +
													' data-objectcontext="' + this.objectcontext + '"' +
													' class="ns1blankspaceRow ns1blankspaceRowSelect">' +
													this.objectcontexttext + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_objectcontext-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSubNote" >' +
														this.objecttext + '</td>');

								if (iType == '')
								{
									aHTML.push('<td id="ns1blankspaceMostLikely_type-' + this.id + '" class="ns1blankspaceRow ns1blankspaceSubNote" >' +
														this.typetext + '</td>');
								}

								aHTML.push('<td style="width:40px; text-align:right;" class="ns1blankspaceRow">' +
									'<span id="ns1blankspaceFavourite_option_remove-' + this.id + '" class="ns1blankspaceOptionRemove"' +
										' data-id="' + this.id + '"></span>' +
									'</td>' +			
									'</tr>');

								aHTML.push('</td></tr>');
							});
						
							aHTML.push('<td></tr>');
							aHTML.push('</table>');

							if (oResponse.morerows == "true")
							{
								aHTML.push('<div style="padding:4px; padding-top:10px;" class="ns1blankspaceSubNote">' +
												'First 50 shown, use search to find more.</div>');
							}
						}		

						$('#ns1blankspaceFavouritesContainer').html(aHTML.join(''));
					
						$('.ns1blankspaceOptionRemove').button(
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
								method: 'CORE_FAVOURITE_MANAGE',
								ifNoneMessage: 'No favourites / tags.'
							});
						})
						.css('width', ns1blankspace.option.rowButtonWidth)
						.css('height', ns1blankspace.option.rowButtonHeight);

						$('#ns1blankspaceFavouritesContainer .ns1blankspaceRowSelect:visible').click(function()
						{
							var sObject = $(this).attr('data-object').toLowerCase();
							var oView = _.find(ns1blankspace.views, function (view)
							{
								return (view.object == sObject && view.show)
							});

							if (oView != undefined)
							{
								var sObjectContext = $(this).attr('data-objectcontext').toLowerCase();
								ns1blankspace[oView.namespace].init({id: sObjectContext});
							}
							else
							{
								ns1blankspace.status.error('Can not open this favourite')
							}
						});
					}
				}
	},

	util: 
	{
		types:
		{
			init: function (oParam, oResponse)
			{
				if (oResponse == undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'CORE_FAVOURITE_SEARCH';		
					oSearch.addField('type,typetext,modifieddate');
					oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
					oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
					oSearch.rows = 9999;
					oSearch.getResults(function(data) {ns1blankspace.favourite.util.types.init(oParam, data)});
				}
				else
				{
					ns1blankspace.favourite.data.objectContextFavourites = oResponse.data.rows;
					ns1blankspace.favourite.util.types.show(oParam);
				}
			},

			show: function (oParam)
			{
				if (ns1blankspace.favourite.data.types == undefined)
				{
					oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.favourite.util.types.show)
					ns1blankspace.favourite.types.get(oParam);
				}
				else
				{
					var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value
					var aHTML = [];

					aHTML.push('<table>');

					if (ns1blankspace.favourite.data.types.length != 0)
					{
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Tag' + (ns1blankspace.favourite.data.types.length?'s':'') + '</td></tr>');
					}

					var oFavourite;

					_.each(ns1blankspace.favourite.data.types, function (type)
					{	
						oFavourite = _.find(ns1blankspace.favourite.data.objectContextFavourites, function (oCF) {return oCF.type == type.id})

						aHTML.push('<tr class="ns1blankspaceRow">');
						aHTML.push('<td id="ns1blankspaceFavouriteTypes-' + type.id + '" data-id="' + type.id + '">' +
										'<input type="checkbox" class="ns1blankspaceFavouriteObjectContextTypes" data-type="' + type.id + '" ' +
										(oFavourite==undefined?'':'checked="checked" data-favourite="' + oFavourite.id + '"') + '> ' + type.title + '</td>');
						aHTML.push('</tr>');
					});

					aHTML.push('</table>');

					$('#' + sXHTMLElementID).html(aHTML.join(''));

					$('input.ns1blankspaceFavouriteObjectContextTypes').click(function ()
					{
						var bChecked = $(this)[0].checked;
						var oData;

						if (bChecked)
						{
							oData =
							{
								object: ns1blankspace.object,
								objectcontext: ns1blankspace.objectContext,
								type: $(this).attr('data-type')
							}
						}
						else
						{
							oData = 
							{
								id: $(this).attr('data-favourite'),
								remove: 1
							}
						}

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('CORE_FAVOURITE_MANAGE'),
							data: oData,
							dataType: 'json',
							success: function(data)
							{
								ns1blankspace.status.message('Saved');
							}
						});
					})
				}
			}
		}
	}
}							

	