// notes @ http://www.mydigitalstructure.com/1blankspace_namespace_experience

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

	get: 		function (oParam)
				{
					var oJourney = {};

					oJourney.xhtmlElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
					oJourney.xhtmlPopulateElementID = ns1blankspace.util.getParam(oParam, 'xhtmlPopulateElementID', {"default": oJourney.xhtmlElementID}).value;

					oJourney.originID = ns1blankspace.util.getParam(oParam, 'originID').value;
					if (oJourney.originID === undefined) {oJourney.originID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value}

					oJourney.origin = ns1blankspace.util.getParam(oParam, 'origin').value;
					if (oJourney.origin === undefined) {oJourney.origin = $.grep(ns1blankspace.data.control.experience.origins, function(a) {return a.id == oJourney.originID})[0]}	

					oJourney.destinationID = ns1blankspace.util.getParam(oParam, 'destinationID').value;
					if (oJourney.destinationID === undefined) {oJourney.destinationID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 2}).value}	

					oJourney.destination = ns1blankspace.util.getParam(oParam, 'destination').value;
					if (oJourney.destination === undefined) {oJourney.destination = $.grep(oJourney.origin.destinations, function(a) {return a.id == oJourney.destinationID})[0]}

					oJourney.thingsToSeeID = ns1blankspace.util.getParam(oJourney, 'xhtmlPopulateElementID', {split: '-'}).values[3];
					if (oJourney.thingsToSeeID !== undefined)
					{
						oJourney.destinationContext = oJourney.destination;
						oJourney.destination = $.grep(oJourney.destination.thingsToSee, function(a) {return a.id == oJourney.thingsToSeeID})[0]
					}

					if (oJourney.destination.tenancy === undefined) {oJourney.destination.tenancy = 'single'}
					if (oJourney.destination.thingsToDo === undefined) {oJourney.destination.thingsToDo = []}

					oJourney.populateWith = ns1blankspace.util.getParam(oParam, 'populateWith', {"default": oJourney.destination.populateWith}).value;

					return oJourney
				},		

	init: 		function (oParam) 
				{
					$(document).on('keyup', 'input.ns1blankspaceExperiencePopulate', function(e)
					{
						if ($(this).val().length == 0) {$(this).attr('data-id', '')}

						var oParam = {xhtmlElementID: this.id}

						if ($(this).attr('data-populate'))
						{
							oParam = ns1blankspace.util.setParam(oParam, 'xhtmlPopulateElementID', $(this).attr('data-populate'));
						}
						else
						{
							oParam = ns1blankspace.util.setParam(oParam, 'xhtmlPopulateElementID', this.id + '-populate');
						}

						if (e.which === 13)
				    	{
							//ns1blankspace.search.show({xhtmlElementID: ns1blankspace.xhtml.divID, source: 4});
							ns1blankspace.experience.journey.populateThingsToSee(oParam);
						}
						else
						{
							//if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
						
							//var sFunction = "ns1blankspace.search.show({xhtmlElementID: ns1blankspace.xhtml.divID," +
							//					"source: 1," +
							//					"minimumLength: 1});"
						
							//ns1blankspace.timer.delayCurrent = setTimeout(sFunction, ns1blankspace.option.typingWait);
						}		
					});

					$(document).on('click', 'td.ns1blankspaceExperienceTravelTo', function(e)
					{
						var oParam = {}

						if ($(this).attr('data-travelTo'))
						{
							oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', $(this).attr('data-travelTo'));
						}
						else	
						{
							oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', this.id);
						}

						oParam = ns1blankspace.util.setParam(oParam, 'populateContext', $(this).attr('data-id'));

						ns1blankspace.experience.journey.travelTo(oParam);
					});

					if (ns1blankspace.util.getParam(oParam, 'xhtmlElementID').exists)
					{
						ns1blankspace.experience.journey.origins.show(oParam);
					}
				},

	origins: 	{
					show:		function(oParam)
								{
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
									
									ns1blankspace.experience.journey.init();

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

					bind: 		function ()
								{
									$('#ns1blankspaceExperienceOriginDestinations .ns1blankspaceExperienceOriginDestinations').click(function()
									{
										var oParam = 
										{
											xhtmlElementID: this.id,
											originID: (this.id).split('-')[1],
											destinationID: (this.id).split('-')[2]
										}

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
					var oJourney = ns1blankspace.experience.journey.get(oParam);	

					ns1blankspace.container.hide();

					$('#ns1blankspaceControl').html(ns1blankspace.experience.translate({commonText: oJourney.destination.name}));

					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceJourneyOriginDestination-' + oJourney.originID + '-' + oJourney.destinationID + '"' + 
										' style="width:560px; margin-right:18px; float:left; background-color: rgba(255,255,255,0.2);' +
										' border-radius:5px; padding:18px; padding-left:18px; padding-top:12px;"></div>');

					aHTML.push('<div id="ns1blankspaceExperienceOriginDestinationToDo" style="width:100px; float:right;">');

					$.each(oJourney.destination.thingsToDo, function (i, v)
					{
						var sStyle = (v.backgroundColor?'background-color:' + v.backgroundColor + ';':'');

						sStyle = 'style="' + sStyle + ' padding:8px;"';

						aHTML.push('<div id="ns1blankspaceExperienceOriginDestinationToDo-' + oJourney.originID + '-' + oJourney.destinationID + '-' + v.id + '"' +
										' class="ns1blankspaceAction"' +
										sStyle + '>' +
										v.caption +
										'</div>');
					});

					aHTML.push('</div>');

					$('#ns1blankspaceMain').html(aHTML.join(''));

					oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', 'ns1blankspaceJourneyOriginDestination-' + oJourney.originID + '-' + oJourney.destinationID);
					oParam = ns1blankspace.util.setParam(oParam, 'destination', oJourney.destination);
					oParam = ns1blankspace.util.setParam(oParam, 'origin', oJourney.origin);

					if (ns1blankspace.util.getParam(oParam, 'populateContext').exists)
					{
						oParam = ns1blankspace.util.setParam(oParam, 'populateWith', 
									[
										{
											"model": "id",
											"comparison": "EQUAL_TO",
											"value1": ns1blankspace.util.getParam(oParam, 'populateContext').value
										}
									]);
					}	

					ns1blankspace.experience.journey.populateThingsToSee(oParam);
				},

	populateThingsToSee:
				function (oParam, oResponse)
				{
					var oJourney = ns1blankspace.experience.journey.get(oParam);
					
					if (oJourney.populateWith !== undefined && oResponse === undefined)
					{	
						var aFields = [];

						$.each(oJourney.destination.thingsToSee, function (i, v)
						{
							if (v.model) {aFields.push(v.model)}
						});

						sFields = aFields.join(',');

						var oSearch = new AdvancedSearch();
						oSearch.method = oJourney.destination.populationAtRest + '_SEARCH';
						oSearch.addField(sFields);

						$.each(oJourney.populateWith, function(i, v)
						{
							var sValue = v.value1;

							if (sValue.indexOf('{{') !== -1)
							{
								sValue = sValue.replace('{{', '');
								sValue = sValue.replace('}}', '');

								if (sValue.toLowerCase() == 'context')
								{
									sValue = $('#' + oJourney.xhtmlElementID).val();
								}
								else if (sValue.toLowerCase() == 'id')
								{
									sValue = oJourney.destinationContext.data[0].id;
								}
								else
								{	
									sValue = $('#ns1blankspaceExperienceOriginDestinationToSee-' + oJourney.originID + '-' + oJourney.destinationID + '-' + sValue).val();
								}	
							}	

							if (i!==0 && oJourney.destination.type == 'text') {oSearch.addOperator('or');}

							oSearch.addFilter(v.model, v.comparison, sValue);
						});
							
						oSearch.getResults(function(data) {ns1blankspace.experience.journey.populateThingsToSee(oParam, data)});
					}
					else
					{
						oJourney.destination.data = [];

						if (oResponse !== undefined)
						{	
							oJourney.destination.data = oResponse.data.rows;
						}

						var aHTML = [];

						if (oJourney.destination.tenancy == 'hub')
						{	
							$.each(oJourney.destination.thingsToSee, function (i, v)
							{
								if (v.caption) {aHTML.push('<div class="ns1blankspaceCaption">' + v.caption + '</div>')}

								if (v.type == 'text')
								{	
									aHTML.push('<div><input ' +
												' id="ns1blankspaceExperienceOriginDestinationToSee-' + oJourney.originID + '-' + oJourney.destinationID + '-' + v.id + '"' +
												' data-populate="ns1blankspaceExperienceOriginDestination-' + oJourney.originID + '-' + oJourney.destinationID + '-' + v.populate + '"' +
												' class="ns1blankspaceText ns1blankspaceExperiencePopulate"></div>');
								}

								if (v.type == 'destination')
								{
									aHTML.push('<div id="ns1blankspaceExperienceOriginDestination-' + oJourney.originID + '-' + oJourney.destinationID + '-' + v.id + '"' +
													' class="ns1blankspaceExperienceOriginDestination"></div>');
								}
							});

							$('#' + oJourney.xhtmlPopulateElementID).html(aHTML.join(''));
						}
						else if (oJourney.destination.tenancy == 'single')
						{	
							$.each(oJourney.destination.thingsToSee, function (i, v)
							{
								aHTML.push('<div class="ns1blankspaceCaption">' +
												v.caption + '</div>');

								if (v.type == 'destination')
								{
									aHTML.push('<div id="ns1blankspaceExperienceOriginDestination-' + oJourney.originID + '-' + oJourney.destinationID + '-' + v.id + '"' +
													' class="ns1blankspaceExperienceOriginDestination"></div>');
								}

								if (v.type == 'text')
								{	
									aHTML.push('<div><input ' +
												' id="ns1blankspaceExperienceOriginDestinationToSee-' + oJourney.originID + '-' + oJourney.destinationID + '-' + v.id + '"' +
												' class="ns1blankspaceText ns1blankspaceExperiencePopulate"' +
												' value="' + (oJourney.destination.data.length>0?oJourney.destination.data[0][v.model]:'') + '"></div>');

									aHTML.push('<div id="ns1blankspaceExperienceOriginDestinationToSee-' + oJourney.originID + '-' + oJourney.destinationID + '-' + v.id + '-populate"></div>');
								}
							});

							$('#' + oJourney.xhtmlPopulateElementID).html(aHTML.join(''));

							$('div.ns1blankspaceExperienceOriginDestination').each(function(i, v)
							{
								ns1blankspace.experience.journey.populateThingsToSee({xhtmlElementID: v.id});
							});
						}
						else
						{
							aHTML.push('<div><table>');

							aHTML.push('<tr>');

							$.each(oJourney.destination.thingsToSee, function (i, v)
							{
								aHTML.push('<td class="ns1blankspace">' +
												v.caption + '</td>');
							});

							aHTML.push('</tr>');

							$.each(oJourney.destination.data, function (i, v)
							{
								aHTML.push('<tr>');

								$.each(oJourney.destination.thingsToSee, function (j, w)
								{
									aHTML.push('<td class="ns1blankspaceExperienceTravelTo"' +
													' id="ns1blankspaceExperienceOriginDestination-' + oJourney.originID + '-' + oJourney.destinationID + '-' + w.model + '-' + v.id + '"' +
													' data-travelTo="ns1blankspaceExperienceOriginDestination-' + oJourney.originID + '-' + w.travelToDestinationID + '"' +
													' data-id="' + v.id + '">' +
													v[w.model] + '</td>');
								});

								aHTML.push('</tr>');
							});

							aHTML.push('</table></div>');

							$('#' + oJourney.xhtmlPopulateElementID).html(aHTML.join(''));
						}
					}
				}				
}				
					

