if (ns1blankspace.experience === undefined) {ns1blankspace.experience = {}}

ns1blankspace.experience =
{
	translate: 	function (oParam)
				{
					var sCommonText = ns1blankspace.util.getParam(oParam, 'commonText').value;
					var oCommonText;

					$.each(ns1blankspace.data.control.experience.language, function(i, v)
					{
						oCommonText = new RegExp('{{' + v.common + '}}', 'g');
						sCommonText = sCommonText.replace(oCommonText, v.translation);
					}); 

					return sCommonText;
				}
}

ns1blankspace.experience.journey =
{
	option: 	{
					tenancy:
					{
						single: 1,
						multi: 2
					}
				},

	origins: 	{
					show:		function(oParam)
								{
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
									
									var aHTML = [];

									aHTML.push('<div id="ns1blankspaceExperienceOrigins">');

									$.each(ns1blankspace.data.control.experience.origins, function(i, v)
									{
										v.height = (v.height?v.height:'80px');
										v.xhtmlImage = (v.imageURI?'<img src="' + v.imageURI + '">':'');

										aHTML.push('<div id="ns1blankspaceExperienceOrigin-' + v.id + '"' +
														' style="margin-top:10px; padding: 10px; font-size:2em; color:#ffffff; cursor: pointer; text-align:center; vertical-align:middle;' +
														' height:' + v.height + ';' +
														' width:80px;' +
														' background-color: #333366;"' +
														' class="ns1blankspaceExperienceOrigins">' +
														v.xhtmlImage + v.caption + '</div>');
									});

									aHTML.push('</div>');

									$('#' + sXHTMLElementID).html(aHTML.join(''));

									ns1blankspace.experience.journey.origins.bind(oParam);
								},

					bind: 		function (oParam)
								{
									$('#ns1blankspaceExperienceOrigins .ns1blankspaceExperienceOrigins').click(function()
									{
										oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', this.id);
										oParam = ns1blankspace.util.setParam(oParam, 'originID', (this.id).split('-')[1]);
										ns1blankspace.experience.journey.destinations.show(oParam);
									});	
								}			
				},	

	destinations:
				{ 	
					show: 		function (oParam)
								{
									var sOriginID = ns1blankspace.util.getParam(oParam, 'originID').value;
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

									var aHTML = [];

									aHTML.push('<div id="ns1blankspaceExperienceOriginDestinations" style="background-color: rgba(255,255,255,0.8); border-radius:5px; padding:14px; padding-left:8px; padding-top:8px;">');

									var oOrigin = $.grep(ns1blankspace.data.control.experience.origins, function(a) {return a.id == sOriginID})[0];

									$.each(oOrigin.destinations, function(i, v)
									{
										aHTML.push('<div id="ns1blankspaceExperienceOriginDestination-' + sOriginID + '-' + v.id + '"' +
														' style="padding:10px; font-size:1.2em; cursor: pointer;" class="ns1blankspaceExperienceOriginDestinations">' +
														ns1blankspace.experience.translate({commonText: v.name}) + '</div>');
									});

									aHTML.push('</div>');

									iTopOffset = parseInt($('#' + sXHTMLElementID).height()) * -1
									oParam = ns1blankspace.util.setParam(oParam, 'xhtml', aHTML.join(''));
									oParam = ns1blankspace.util.setParam(oParam, 'leftOffset', 120);
									oParam = ns1blankspace.util.setParam(oParam, 'topOffset', iTopOffset);

									ns1blankspace.container.show(oParam);

									ns1blankspace.experience.journey.destinations.bind(oParam);
								},

					bind: 		function (oParam)
								{
									$('#ns1blankspaceExperienceOriginDestinations .ns1blankspaceExperienceOriginDestinations').click(function()
									{
										oParam = ns1blankspace.util.setParam(oParam, 'originID', (this.id).split('-')[1]);
										oParam = ns1blankspace.util.setParam(oParam, 'destinationID', (this.id).split('-')[2]);

										var oOrigin = $.grep(ns1blankspace.data.control.experience.origins, function(a) {return a.id == oParam.originID})[0];
										var oDestination = $.grep(oOrigin.destinations, function(a) {return a.id == oParam.destinationID})[0];

										if (oDestination.gettingThere !== undefined)
										{
											ns1blankspace.util.execute(oDestination.gettingThere, oParam);
										}	
										else
										{	
											ns1blankspace.experience.journey.travelTo(oParam);
										}	
									});	
								}
				},				

	travelTo: 	function (oParam) 
				{
					var sOriginID = ns1blankspace.util.getParam(oParam, 'originID').value;
					var sDestinationID = ns1blankspace.util.getParam(oParam, 'destinationID').value;

					var oOrigin = $.grep(ns1blankspace.data.control.experience.origins, function(a) {return a.id == sOriginID})[0];
					var oDestination = $.grep(oOrigin.destinations, function(a) {return a.id == sDestinationID})[0];

					if (oDestination.thingsToDo === undefined) {oDestination.thingsToDo = []}

					ns1blankspace.container.hide();

					$('#ns1blankspaceControl').html(ns1blankspace.experience.translate({commonText: oDestination.name}));

					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceJourneyOriginDestination-' + sOriginID + '-' + sDestinationID + '"' + 
										' style="width:560px; margin-right:18px; float:left; background-color: rgba(255,255,255,0.2);' +
										' border-radius:5px; padding:18px; padding-left:18px; padding-top:12px;"></div>');

					aHTML.push('<div id="ns1blankspaceExperienceOriginDestinationToDo" style="width:100px; float:right;">');

					$.each(oDestination.thingsToDo, function (i, v)
					{
						var sStyle = (v.backgroundColor?'background-color:' + v.backgroundColor + ';':'');

						sStyle = 'style="' + sStyle + ' padding:8px;"';

						aHTML.push('<div id="ns1blankspaceExperienceOriginDestinationToDo-' + sOriginID + '-' + sDestinationID + '-' + v.id + '"' +
										' class="ns1blankspaceAction"' +
										sStyle + '>' +
										v.caption +
										'</div>');
					});

					aHTML.push('</div>');

					$('#ns1blankspaceMain').html(aHTML.join(''));

					oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', 'ns1blankspaceJourneyOriginDestination-' + sOriginID + '-' + sDestinationID);
					oParam = ns1blankspace.util.setParam(oParam, 'destination', oDestination);
					oParam = ns1blankspace.util.setParam(oParam, 'origin', oOrigin);

					ns1blankspace.experience.journey.populateThingsToSee(oParam);
				},

	populateThingsToSee:
				function (oParam, oResponse)
				{
					var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

					var sOriginID = ns1blankspace.util.getParam(oParam, 'originID').value;

					if (sOriginID === undefined)
					{
						sOriginID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
					}

					var oOrigin = ns1blankspace.util.getParam(oParam, 'origin').value;

					if (oOrigin === undefined)
					{	
						oOrigin = $.grep(ns1blankspace.data.control.experience.origins, function(a) {return a.id == sOriginID})[0];
					}	

					var sDestinationID = ns1blankspace.util.getParam(oParam, 'destinationID').value;
					
					if (sDestinationID === undefined)
					{
						sDestinationID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 2}).value;
					}	

					var oDestination = ns1blankspace.util.getParam(oParam, 'destination').value;

					if (oDestination === undefined)
					{
						oDestination = $.grep(oOrigin.destinations, function(a) {return a.id == sDestinationID})[0];
					}

					var sThingToSeeID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {split: '-'}).values[3];

					if (sThingToSeeID !== undefined)
					{
						oDestination = $.grep(oDestination.thingsToSee, function(a) {return a.id == sThingToSeeID})[0];
					}

					if (oDestination.tenancy === undefined) {oDestination.tenancy = 'single'}

					if (ns1blankspace.util.getParam(oParam, 'populateWith').exists && oResponse === undefined)
					{	
						var aFields = [];

						$.each(oDestination.thingsToSee, function (i, v)
						{
							if (v.model) {aFields.push(v.model)}
						});

						sFields = aFields.join('');

						var oSearch = new AdvancedSearch();
						oSearch.method = oDestination.model + '_SEARCH';
						oSearch.addField(sFields);

						$.each(oPopulateWith, function(i, v)
						{
							oSearch.addFilter(v.field, v.comparison, v.value1);
						});
							
						oSearch.getResults(function(data) {ns1blankspace.experience.journey.populateThingsToSee(oParam, data)});
					}
					else
					{
						oDestination.data = [];

						if (oResponse !== undefined)
						{	
							oDestination.data = oResponse.data.rows;
						}

						var aHTML = [];

						if (oDestination.tenancy == 'single')
						{	
							$.each(oDestination.thingsToSee, function (i, v)
							{
								aHTML.push('<div class="ns1blankspaceCaption">' +
												v.caption + '</div>');

								if (v.type == 'text')
								{	
									aHTML.push('<div><input ' +
												' id="ns1blankspaceExperienceOriginDestinationToSee-' + sOriginID + '-' + sDestinationID + '-' + v.id + '"' +
												' class="ns1blankspaceText"' +
												' value="' + (oDestination.data.length>0?oDestination.data[0][v.model]:'') + '"></div>');

									aHTML.push('<div id="ns1blankspaceJourneyOriginDestinationToSeeHelper-' + sOriginID + '-' + sDestinationID + '-' + v.id + '"></div>');
								}

								if (v.type == 'destination')
								{
									aHTML.push('<div id="ns1blankspaceJourneyOriginDestination-' + sOriginID + '-' + sDestinationID + '-' + v.id + '"' +
													' class="ns1blankspaceJourneyOriginDestination"></div>');
								}
							});

							$('#' + sXHTMLElementID).html(aHTML.join(''));

							$('div.ns1blankspaceJourneyOriginDestination').each(function(i, v)
							{
								ns1blankspace.experience.journey.populateThingsToSee({xhtmlElementID: v.id});
							});
						}
						else
						{
							aHTML.push('<div><table>');

							aHTML.push('<tr>');

							$.each(oDestination.thingsToSee, function (i, v)
							{
								aHTML.push('<td class="ns1blankspace">' +
												v.caption + '</td>');
							});

							aHTML.push('</tr>');

							$.each(oDestination.data, function (i, v)
							{
								aHTML.push('<tr>');

								$.each(oDestination.thingsToSee, function (j, w)
								{
									aHTML.push('<td class="ns1blankspace">' +
													v.caption + '</td>');
								});

								aHTML.push('</tr>');
							});

							aHTML.push('</table></div>');

							$('#' + sXHTMLElementID).html(aHTML.join(''));
						}
					}
				}				
}				
					

