// notes @ http://www.mydigitalstructure.com/1blankspace_namespace_experience
//ns1blankspace.experience.journey.get({routeID: 'ins-invoice'})
// http://json.parser.online.fr/

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
	init: 		function (oParam) 
				{
					ns1blankspace.experience.journey.controller.init(
					[
						{
							what: 'click',
							where: 'div.ns1blankspaceExperienceCancel, div.ns1blankspaceExperienceClose, td.ns1blankspaceExperienceClose',
							subject: 'cancel'
						},
						{
							what: 'click',
							where: 'span.ns1blankspaceExperienceDone',
							subject: 'done'
						},
						{
							what: 'click',
							where: 'span.ns1blankspaceExperienceEdit, input.ns1blankspaceExperienceEdit',
							subject: 'edit'
						},
						{
							what: 'keyup',
							where: 'input.ns1blankspaceExperiencePopulateDestinationWith, input.ns1blankspaceExperiencePopulateWithDestination',
							subject: 'populateDestinationWith',
							inspection: false
						},
						{
							what: 'keyup',
							where: 'input.ns1blankspaceExperiencePopulateThingWith, input.ns1blankspaceExperiencePopulateWith',
							subject: 'populateThingWith',
							inspection: false
						},
						{
							what: 'click',
							where: 'td.ns1blankspaceExperiencePopulateWith, div.ns1blankspaceExperiencePopulateWith',
							subject: 'makeMutable'
						},
						{
							what: 'change',
							where: 'input.ns1blankspaceExperiencePopulation',
							subject: 'repopulate'
						},
						{
							what: 'click',
							where: 'td.ns1blankspaceExperiencePopulate',
							subject: 'populate'
						},
						{
							what: 'click',
							where: 'div.ns1blankspaceExperienceDoIt',
							subject: 'doIt'
						},
						{
							what: 'click',
							where: 'td.ns1blankspaceExperienceTravelTo, div.ns1blankspaceExperienceTravelTo',
							subject: 'travelTo'
						},
						{
							what: 'focusout',
							where: 'input.ns1blankspaceExperiencePopulation',
							subject: 'rest'
						},
						{
							what: 'change',
							where: 'input.ns1blankspaceExperiencePopulationDate',
							subject: 'rest'
						},
						{
							what: 'click',
							where: 'div.ns1blankspaceExperienceAdd',
							subject: 'extend'
						},
						{
							what: 'click',
							where: 'td.ns1blankspaceExperiencePopulateDerived',
							subject: 'derive'
						}						
					]);

					//START APP
					if (ns1blankspace.util.getParam(oParam, 'xhtmlElementID').exists)
					{
						ns1blankspace.experience.journey.origins.show(oParam);
					}
				},

	get: 		function (oParam)
				{
					var oJourney = {};

					oJourney.xhtmlElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
					oJourney.xhtmlPopulateElementID = ns1blankspace.util.getParam(oParam, 'xhtmlPopulateElementID', {"default": oJourney.xhtmlElementID}).value;
					oJourney.routeID = ns1blankspace.util.getParam(oParam, 'routeID').value;

					if (oJourney.routeID === undefined) {oJourney.routeID = $('#' + oJourney.xhtmlElementID).attr('data-route-id')}
					oJourney.route = oJourney.routeID.split('-');
					oJourney.originID = ns1blankspace.util.getParam(oParam, 'originID').value;
					oJourney.destinationID = ns1blankspace.util.getParam(oParam, 'destinationID').value;
					oJourney.sourceRouteID = '';
					oJourney.previousRouteID = '';
					oJourney.destinations = [];

					$.each(oJourney.route, function(i, r)
					{
						if (i==0)
						{
							if (oJourney.originID === undefined) {oJourney.originID = r}
							oJourney.origin = ns1blankspace.util.getParam(oParam, 'origin').value;
							if (oJourney.origin === undefined) {oJourney.origin = $.grep(ns1blankspace.data.control.experience.origins, function(a) {return a.id == oJourney.originID})[0]}
							oJourney.destinations.push(oJourney.origin);

						}
						else if (i==1)
						{
							if (oJourney.destinationID === undefined) {oJourney.destinationID = r}
							oJourney.destination = ns1blankspace.util.getParam(oParam, 'destination').value;
							if (oJourney.destination === undefined) {oJourney.destination = $.grep(oJourney.origin.destinations, function(a) {return a.id == oJourney.destinationID})[0]}
							oJourney.destinations.push(oJourney.destination);
						}	
						else
						{
							oJourney.destinationID = r;
							oJourney.destination = $.grep(oJourney.destination.thingsToSee, function(a) {return a.id == r})[0];
							oJourney.destinations.push(oJourney.destination);
						}
					});

					oJourney.sourceRoute = oJourney.route.concat();
					oJourney.sourceRoute.pop();
					oJourney.sourceRouteID = oJourney.sourceRoute.join('-');
					oJourney.previousRouteID = oJourney.sourceRouteID;

					if (oJourney.destination !== undefined)
					{	
						oJourney.destination.xhtmlContainerID = 'ns1blankspaceExperience-' + oJourney.routeID + '-container';

						oJourney.previousDestination = (oJourney.sourceRoute.length!=0?oJourney.destinations[oJourney.sourceRoute.length-1]:undefined)

						oJourney.destination.populationIsAtWork = false;

						if (oJourney.destination.thingsToSee)
						{	
							$.each(oJourney.destination.thingsToSee, function (i, v)
							{
								if (oJourney.destination.populateWith !== undefined)
								{
									v.isPopulateWith = ($.grep(oJourney.destination.populateWith, function (a) {return (a.model == v.model)}).length != 0);
								}	
							});
						}	
		
						if (oJourney.destination.tenancy === undefined) {oJourney.destination.tenancy = 'single'}
						if (oJourney.destination.thingsToDo === undefined) {oJourney.destination.thingsToDo = []}

						oJourney.previousDestination.populationAtWorkToBeRestedWhenCan	= (oJourney.previousDestination.populationAtWorkToBeRestedWhenCan || []);

						oJourney.populateWith = ns1blankspace.util.getParam(oParam, 'populateWith', {"default": oJourney.destination.populateWith}).value;

						ns1blankspace.experience.journey.whereami = oJourney.destination;
					}	
 
					return oJourney
				},			

	controller:
				{
					init: 		function (aControls)
								{
									$.each(aControls, function (i, v)
									{
										$(document).on(v.what, v.where, function (e)
										{
											var oParam = 
											{
												initiator: $(this),
												id: $(this).attr('id'),
												xhtmlElementID: $(this).attr('id'),
												routeID: $(this).attr('data-route-id'),
												populateRouteID: $(this).attr('data-populate-route-id'),
												event: e,
												subject: v.subject,
												inspection: (v.inspection!==undefined?v.inspection:true),
												value: $(this).val(),
												xhtml: $(this).html(),
												populateID: $(this).attr('data-populate-id')
											}

											if ($(this).attr('data-populate-with-id') !== undefined)
											{	
												oParam.populateWithID = $(this).attr('data-populate-with-id')
											}		

											ns1blankspace.experience.journey.controller.message(oParam);
										});
									});
								},

					send: 		function (oParam)
								{
									var aThings = ns1blankspace.util.getParam(oParam, 'things').value;
									var sSubject = ns1blankspace.util.getParam(oParam, 'subject').value;

									$.each(aThings, function (i, thing)
									{
										oParam = $.extend(true, oParam,
										{
											initiator: $(this),
											id: $(this).attr('id'),
											xhtmlElementID: $(this).attr('id'),
											routeID: $(this).attr('data-route-id'),
											populateRouteID: $(this).attr('data-populate-route-id'),
											subject: sSubject,
											value: $(this).val(),
											xhtml: $(this).html(),
											populateID: $(this).attr('data-populate-id'),
											setFocus: false
										});

										if ($(this).attr('data-populate-with-id') !== undefined)
										{	
											oParam.populateWithID = $(this).attr('data-populate-with-id')
										}		

										ns1blankspace.experience.journey.controller.message(oParam);
									});
								},	

					message:	function (oParam)
								{
									var fMethod = ns1blankspace.util.getParam(oParam, 'method', {remove: true}).value;
									var sSubject = ns1blankspace.util.getParam(oParam, 'subject', {remove: true}).value;
									var sRouteID = ns1blankspace.util.getParam(oParam, 'routeID').value;
									var bInspection = ns1blankspace.util.getParam(oParam, 'inspection', {"default": true}).value;
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator').value;

									if (oInitiator.attr('data-populate'))
									{
										oParam = ns1blankspace.util.setParam(oParam, 'xhtmlPopulateElementID', oInitiator.attr('data-populate'));
									}

									ns1blankspace.debug.message(sSubject + ': ' + sRouteID, true);

									if (sSubject)
									{
										fMethod = ns1blankspace.experience.journey.controller[sSubject];
									}

									if (bInspection && ns1blankspace.debug.enabled) {debugger;}

									if (fMethod) {fMethod(oParam)}
								},

					done: 		function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;
									var oJourney = ns1blankspace.experience.journey.get(oParam);
									var sValue = oJourney.previousDestination.populationAtWork[0][oJourney.destination.model]
	
									ns1blankspace.experience.journey.thingsToSee.thingToSee.populate(oParam);
								},

					edit: 		function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;
									var oJourney = ns1blankspace.experience.journey.get(oParam);
									var sValue = oJourney.previousDestination.populationAtWork[0][oJourney.destination.model];

									if (oJourney.destination.populationAtWork)
									{
										var sValue = oJourney.destination.populationAtWork[0]['id'];
									}
									
									if (oParam.xhtmlPopulateElementID == undefined)
									{	
										oParam = ns1blankspace.util.setParam(oParam, 'xhtmlPopulateElementID', oInitiator.attr('id') + '-populate');
									}

									oParam = ns1blankspace.util.setParam(oParam, 'tenancy', 'multi');
									oParam = ns1blankspace.util.setParam(oParam, 'edit', true);

									oParam = ns1blankspace.util.setParam(oParam, 'populateWith', 
									[
										{
											"model": "id",
											"comparison": "EQUAL_TO",
											"value1": sValue
										}
									]);
									
									ns1blankspace.experience.journey.thingsToSee.populate(oParam);
								},

					cancel: 	function (oParam)
								{	
									$('#ns1blankspaceExperience-' + oParam.routeID + '-control').html('<div class="ns1blankspaceExperienceAdd"' +
											' id="ns1blankspaceExperience-' + oParam.routeID + '-cancel"' +
											' data-route-id="' + oParam.routeID + '">' +
											'Add</div>');

									$('#ns1blankspaceExperience-' + oParam.routeID + '-new-container').hide();
								},

					populateDestinationWith: 	
								function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;
									var oEvent = ns1blankspace.util.getParam(oParam, 'event', {remove: true}).value;
									var oJourney = ns1blankspace.experience.journey.get(oParam);

									oParam = ns1blankspace.util.setParam(oParam, 'xhtmlPopulateElementID', oJourney.previousDestination.xhtmlContainerID + '-populate');

									oParam = ns1blankspace.util.setParam(oParam, 'routeID', oJourney.sourceRouteID);

									if (oEvent.which === 13)
							    	{
										oParam = ns1blankspace.util.setParam(oParam, 'tenancy', 'multi');
										ns1blankspace.experience.journey.thingsToSee.populate(oParam);
									}
									else
									{
										if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
									
										oParam = ns1blankspace.util.setParam(oParam, 'tenancy', 'multi');

										var sFunction = 'ns1blankspace.experience.journey.thingsToSee.populate(' +
															JSON.stringify(oParam) + ');'
									
										ns1blankspace.timer.delayCurrent = setTimeout(sFunction, ns1blankspace.option.typingWait);
									}
								},

					populateThingWith: 	
								function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;
									var oEvent = ns1blankspace.util.getParam(oParam, 'event', {remove: true}).value;
									var oJourney = ns1blankspace.experience.journey.get(oParam);

									if (oInitiator.val().length == 0)
									{
										oInitiator.attr('data-id', '');

										if (oJourney.destination.populationCanReproduce == 'true')
										{	
											oParam = ns1blankspace.util.setParam(oParam, 'extend', true);
											ns1blankspace.experience.journey.thingsToSee.populate(oParam);
										}
									}
									else
									{
										if (oInitiator.attr('data-populate'))
										{
											oParam = ns1blankspace.util.setParam(oParam, 'xhtmlPopulateElementID', oInitiator.attr('data-populate'));
										}
										else
										{
											oParam = ns1blankspace.util.setParam(oParam, 'xhtmlPopulateElementID', oInitiator.attr('id') + '-populate');
										}

										if (oEvent.which === 13)
								    	{
											oParam = ns1blankspace.util.setParam(oParam, 'tenancy', 'multi');
											ns1blankspace.experience.journey.thingsToSee.populate(oParam);
										}
										else
										{
											if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
										
											oParam = ns1blankspace.util.setParam(oParam, 'tenancy', 'multi');
											var sFunction = 'ns1blankspace.experience.journey.thingsToSee.populate(' +
																JSON.stringify(oParam) + ');'
										
											ns1blankspace.timer.delayCurrent = setTimeout(sFunction, ns1blankspace.option.typingWait);
										}
									}	
								},

					makeMutable:
								function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;
									var oJourney = ns1blankspace.experience.journey.get(oParam);

									if ($('#' + oParam.xhtmlElementID + ' input').length == 0)
									{					
										var bIsPopulateWith = false;

										if (oJourney.destination.type == "text")
										{
											if (oJourney.previousDestination.populateWith != undefined)
											{	
												bIsPopulateWith = ($.grep(oJourney.previousDestination.populateWith, function (a) {return (a.model == oJourney.destination.model)}).length != 0);
											}

											if (bIsPopulateWith && !oJourney.previousDestination.populationAtRestIsNewBorn)
											{
												//oJourney.previousDestination.populationAtRestIsNewBorn = true;

												ns1blankspace.experience.journey.thingsToSee.thingToSee.vacate(
												{
													routeID: oJourney.previousRouteID,
													xhtmlElementID: 'ns1blankspaceExperience-' + oJourney.previousRouteID
												});

												ns1blankspace.experience.journey.thingsToSee.thingToSee.mutate(oParam);
											}
											else
											{	
												ns1blankspace.experience.journey.thingsToSee.thingToSee.mutate(oParam);
											}	
										}
										else
										{
											ns1blankspace.experience.journey.thingsToSee.thingToSee.mutate(oParam);
										}
									}
								},

					repopulate: function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;
									var oJourney = ns1blankspace.experience.journey.get(oParam);

									if (oJourney.previousDestination.populationData)
									{
										ns1blankspace.util.toFunction(oJourney.previousDestination.populationData)['populateWith'][oJourney.destination.model] = oInitiator.val();
									}

									if (oJourney.previousDestination.onArrival)
									{
										ns1blankspace.util.execute(oJourney.previousDestination.onArrival)
									}
								},			

					rest: 		function (oParam)
								{
									var oJourney = ns1blankspace.experience.journey.get(oParam);

									oParam.xhtmlElementID = oParam.xhtmlElementID.replace('-input', '');
									oParam.populationAtWorkToBeRested =
									{
										type: oJourney.destination.type,
										text: oParam.value
									}

									ns1blankspace.experience.journey.thingsToSee.thingToSee.rest(oParam);
								},	

					populate: 	function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;
									
									if (oInitiator.attr('data-populate-route-id'))
									{
										oParam = ns1blankspace.util.setParam(oParam, 'routeID', oInitiator.attr('data-populate-route-id'));
									}
									
									oParam = ns1blankspace.util.setParam(oParam, 'populateWithID', oInitiator.attr('data-populate-with-id'));

									var oJourney = ns1blankspace.experience.journey.get(oParam);

									if (oJourney.destination.type == 'select')
									{	
										ns1blankspace.experience.journey.thingsToSee.thingToSee.populate(oParam);
									}
									else
									{	
										ns1blankspace.experience.journey.destinations.destination.populate(oParam);
									}	
								},

					doIt: 		function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;
									var oJourney = ns1blankspace.experience.journey.get(oParam);
									var sDoItID = oInitiator.attr('data-do-it-id');
									var sDoIt = $.grep(oJourney.destination.thingsToDo, function(a) {return a.id == sDoItID})[0].doIt;

									ns1blankspace.util.execute(sDoIt, oParam);
								},

					travelTo: 	function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;

									if (oInitiator.attr('data-travel-to-route-id'))
									{
										oParam = ns1blankspace.util.setParam(oParam, 'routeID', oInitiator.attr('data-travel-to-route-id'));
									}
									
									ns1blankspace.experience.journey.destinations.destination.travelTo(oParam);
								},

					extend: 	function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;

									oParam = ns1blankspace.util.setParam(oParam, 'extend', true);
									ns1blankspace.experience.journey.thingsToSee.populate(oParam);
								},

					populateThing: 
								function (oParam)
								{
									ns1blankspace.experience.journey.thingsToSee.populate(oParam);
								},

					derive: 	function (oParam)
								{
									ns1blankspace.experience.journey.thingsToSee.thingToSee.derive(oParam);
								},																						
				},

	space: 		{		
					options: {lease: {nextTo: {me: 1, myParent: 2}}},

					lease:		function(oParam)
								{
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
									var iNextTo = ns1blankspace.util.getParam(oParam, 'nextTo', {"default": ns1blankspace.experience.journey.space.options.lease.nextTo.me}).value;
									var bRelease = ns1blankspace.util.getParam(oParam, 'release', {"default": false}).value;
									var sDisplay = (ns1blankspace.util.getParam(oParam, 'hide', {"default": 'false'}).value?'none':'block');
									var sRouteID = ns1blankspace.util.getParam(oParam, 'routeID').value;
									var sDataPopulateID = '';

									var sDataRouteID = (sRouteID!=undefined?' data-route-id="' + sRouteID + '"':'');

									var sXHTMLNextToElementID = sXHTMLElementID;
									var oXHTMLNextToElement = $('#' + sXHTMLNextToElementID);
									var sType = $('#' + sXHTMLNextToElementID).get(0).tagName.toLowerCase();

									if (oXHTMLNextToElement.attr('data-populate-id') != undefined)
									{
										sDataPopulateID = ' data-populate-id="' + oXHTMLNextToElement.attr('data-populate-id') + '"'
									}

									if (iNextTo == ns1blankspace.experience.journey.space.options.lease.nextTo.myParent)
									{
										if (sType !== 'div')
										{
											sXHTMLNextToElementID = sXHTMLElementID.replace('-input', '');
											oXHTMLNextToElement = $('#' + sXHTMLNextToElementID).closest('tr');
										}	
									}

									var sXHTMLPopulateElementID = sXHTMLElementID + '-populate';
									var iLength = oXHTMLNextToElement.children().length;

									if (bRelease)
									{	
										oXHTMLNextToElement.next().remove();
									}	
									else if ($('#' + sXHTMLPopulateElementID).length == 0)
									{	
										if (sType !== 'div')
										{
											oXHTMLNextToElement.after('<tr>' +
												'<td colspan=' + iLength + '" style="padding:0px;"><div id="' + sXHTMLPopulateElementID + '"' +
												sDataRouteID + sDataPopulateID + '></div></td></tr>');
										}
										else
										{
											oXHTMLNextToElement.after('<div style="display:' + sDisplay + ';" id="' + sXHTMLPopulateElementID + '"' +
												sDataRouteID + sDataPopulateID + '></div>');
										}	
									}

									return {xhtmlElementID: sXHTMLPopulateElementID}
								},

					release:	function(oParam)
								{
									oParam = ns1blankspace.util.setParam(oParam, 'release', true);
									ns1blankspace.experience.journey.space.lease(oParam);
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
														' data-route-id="' + v.id + '"' +
														' style="height:' + v.height + ';"' +
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
								},

					loading: 	function (oParam)
								{
									var sOriginID = ns1blankspace.util.getParam(oParam, 'originID').value;
									$('#ns1blankspaceExperienceOrigin-' + sOriginID).html('<div style="padding-top:20px;">' + ns1blankspace.xhtml.loading + '</div>');
								},

					reset: 		function (oParam)
								{
									var sOriginID = ns1blankspace.util.getParam(oParam, 'originID').value;
									var oJourney = ns1blankspace.experience.journey.get({routeID: sOriginID});
									$('#ns1blankspaceExperienceOrigin-' + sOriginID).html(oJourney.origin.caption);
								}			
				},	

	destinations:
				{ 	
					show: 		function (oParam)
								{
									var sOriginID = ns1blankspace.util.getParam(oParam, 'originID').value;
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

									var aHTML = [];

									aHTML.push('<div id="ns1blankspaceExperiences" style="background-color: rgba(255,255,255,0.8); border-radius:5px; padding:14px; padding-left:8px; padding-top:8px;">');

									var oOrigin = $.grep(ns1blankspace.data.control.experience.origins, function(a) {return a.id == sOriginID})[0];

									$.each(oOrigin.destinations, function(i, v)
									{
										aHTML.push('<div id="ns1blankspaceExperience-' + sOriginID + '-' + v.id + '"' +
														' data-route-id="' + sOriginID + '-' + v.id + '"' +
														' style="padding:10px; font-size:1.2em; cursor: pointer;" class="ns1blankspaceExperiences">' +
														ns1blankspace.experience.translate({commonText: (v.signage!==undefined?v.signage:v.name)}) + '</div>');
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
									$('#ns1blankspaceExperiences .ns1blankspaceExperiences').click(function()
									{
										var oParam = 
										{
											xhtmlElementID: this.id,
											routeID: $(this).attr('data-route-id')
										}

										ns1blankspace.container.hide();

										ns1blankspace.experience.journey.destinations.destination.travelTo(oParam);
									});	
								},

					destination: 
								{
									populate: 	function (oParam) 
												{
													var oJourney = ns1blankspace.experience.journey.get(oParam);
													var oData = oJourney.destination.populationAtRest;

													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
													var sPopulateWithID = ns1blankspace.util.getParam(oParam, 'populateWithID').value;

													var sXHTMLPopulateElementID = oJourney.destination.xhtmlContainerID;

													oParam.populationAtWorkToBeRested =
													{
														id: oParam.populateID
													}

													oParam.populationAtWorkToBeRested[(oJourney.destination.model).split('.')[1] || oJourney.destination.model] = sPopulateWithID;

													$('#' + sXHTMLPopulateElementID + '-populate').slideUp(500);

													oParam.xhtmlElementID = sXHTMLPopulateElementID;

													ns1blankspace.experience.journey.thingsToSee.thingToSee.rest(oParam);
												},

									travelTo: 	function (oParam) 
												{
													var oJourney = ns1blankspace.experience.journey.get(oParam);

													if (oJourney.destination.gettingThere !== undefined)
													{
														ns1blankspace.util.execute(oJourney.destination.gettingThere, oParam)
													}	
													else
													{	
														$('#ns1blankspaceControl').html('<div style="width:400px; float:left;">' + ns1blankspace.experience.translate({commonText: oJourney.destination.name}) + '</div>' +
																					'<div style="float:right; width:150px; padding-left:6px; font-weight:100; font-size:0.75em; text-align:right; margin-right:130px; vertical-align:bottom" id="ns1blankspaceExperienceSignPost"></span>');

														var aHTML = [];

														aHTML.push('<div id="ns1blankspaceJourney-' + oJourney.originID + '-' + oJourney.destinationID + '"' + 
																			' style="' + (oJourney.destination.boundary=='scalable'?'':'width:560px;') + 
																			' margin-right:18px; float:left; background-color: rgba(255,255,255,0.2);' +
																			' border-radius:5px; padding:18px; padding-left:18px; padding-top:12px;">' +
																			'loading...' +
																			'</div>');

														aHTML.push('<div id="ns1blankspaceExperienceToDo" style="width:100px; float:right;">');

														//if (oParam.populateWithID != undefined)
														//{	
															$.each(oJourney.destination.thingsToDo, function (i, thingToDo)
															{
																var sStyle = (thingToDo.backgroundColor?'background-color:' + thingToDo.backgroundColor + ';':'');

																sStyle = 'style="' + sStyle + ' padding:8px;"';

																aHTML.push('<div class="ns1blankspaceExperienceDoIt"' +
																			' id="ns1blankspaceExperienceJourneyDoIt-' + oJourney.routeID + '-' + thingToDo.id + '"' +
																			' data-do-it-id="' + thingToDo.id + '"' +
																			' data-route-id="' + oJourney.routeID + '">' + thingToDo.caption + '</div>');
															});
														//}	

														aHTML.push('</div>');

														$('#ns1blankspaceMain').html(aHTML.join(''));

														oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', 'ns1blankspaceJourney-' + oJourney.originID + '-' + oJourney.destinationID);
														oParam = ns1blankspace.util.setParam(oParam, 'destination', oJourney.destination);
														oParam = ns1blankspace.util.setParam(oParam, 'origin', oJourney.origin);

														if (ns1blankspace.util.getParam(oParam, 'populateWithID').exists)
														{
															oParam = ns1blankspace.util.setParam(oParam, 'populateWith', 
															[
																{
																	"model": "id",
																	"comparison": "EQUAL_TO",
																	"value1": ns1blankspace.util.getParam(oParam, 'populateWithID').value
																}
															]);
														}

														if (oJourney.destination.tenancy == 'vacant')
														{
															if (oJourney.destination.onArrival !== undefined)
															{	
																ns1blankspace.util.execute(oJourney.destination.onArrival, oParam);
															}	
														}
														else
														{	
															ns1blankspace.experience.journey.thingsToSee.populate(oParam);
														}	
													}	
												}
								}			
				},

	thingsToSee:
				{
					populate: 	function (oParam, oResponse)
								{
									var oJourney = ns1blankspace.experience.journey.get(oParam);
									var bExtend = ns1blankspace.util.getParam(oParam, 'extend', {"default": false}).value;
									var sTenancy = ns1blankspace.util.getParam(oParam, 'tenancy', {"default": oJourney.destination.tenancy}).value;
									var bEdit = ns1blankspace.util.getParam(oParam, 'edit', {"default": false}).value;
									var iPopulateID = ns1blankspace.util.getParam(oParam, 'populateID').value;
									var bOK = false;
									var bValue = ns1blankspace.util.getParam(oParam, 'value').exists;

									var bGetData = (oJourney.populateWith !== undefined && oResponse === undefined && !bExtend && (sTenancy == 'single' || sTenancy == 'multi'));

									if (bGetData)
									{
										$.each(oJourney.populateWith, function(i, v)
										{			
											if ((v.value1).toLowerCase().indexOf('id') !== -1 && oJourney.previousDestination.populationAtWork.length == 0)
											{
												bGetData = false;
											}
										});	
									}

									if (bGetData && sTenancy == 'single')
									{
										bGetData = !(oJourney.destination.type == 'destination');
									}

									if (bGetData)
									{	
										$('#' + oJourney.xhtmlPopulateElementID).html('');

										ns1blankspace.experience.journey.origins.loading({originID: oJourney.originID});

										if (oJourney.destination.populationAtRestLocationURI !== undefined)
										{
											$.ajax(
											{
												type: 'GET',
												url: oJourney.destination.populationAtRestLocationURI,
												dataType: 'json',
												success: function(data)
												{
													ns1blankspace.experience.journey.thingsToSee.populate(oParam, data)
												}
											});
										}
										else
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = oJourney.destination.populationAtRestLocation + '_SEARCH';
											oSearch.rows = 10;

											var aFields = [];

											$.each($.grep(oJourney.destination.thingsToSee, function(a) {return a.model !== undefined}), function (i, v)
											{
												if (i==0)
												{
													oSearch.sort(v.model, (v.type=='text'?'asc':'desc'));
												}

												aFields.push(v.model)

												if (v.thingsToSee)
												{
													$.each(v.thingsToSee, function (j, k)
													{
														if (k.model)
														{
															if (v.type == 'derived')
															{
																aFields.push(k.model);
															}
															else
															{	
																aFields.push(v.model + '.' + k.model);
															}	
														}	
													});		
												}
											});

											sFields = aFields.join(',');
	
											oSearch.addField(sFields);

											$.each(oJourney.populateWith, function(i, v)
											{
												var sValue = v.value1;
												
												if (sValue.indexOf('{{') !== -1)
												{
													var sRouteID = oJourney.routeID;
													if (oJourney.destination.tenancy == 'multi') {sRouteID = oJourney.sourceRouteID}

													sValue = sValue.replace('{{', '');
													sValue = sValue.replace('}}', '');

													if (sValue.toLowerCase() == 'context')
													{
														sValue = $('#' + oJourney.xhtmlElementID).val();
													}
													else if (sValue.toLowerCase() == 'id')
													{
														sValue = oJourney.previousDestination.populationAtWork[0].id;
													}
													else
													{	
														if ($('#ns1blankspaceExperience-' + sRouteID + '-' + sValue).is('input'))
														{
															sValue = $('#ns1blankspaceExperience-' + sRouteID + '-' + sValue).val();
														}
														else
														{	
															if ($('#ns1blankspaceExperience-' + sRouteID + '-' + sValue + ' input').length == 0)
															{	
																if (oParam[sValue] != undefined)
																{
																	sValue = oParam[sValue];
																}
																else
																{	
																	sValue = $('#ns1blankspaceExperience-' + sRouteID + '-' + sValue).html();
																}	
															}
															else
															{
																sValue = $($('#ns1blankspaceExperience-' + sRouteID + '-' + sValue + ' input')[0]).val();
															}	
														}
													}
												}	

												v.value = sValue;

												if (i!==0 && oJourney.destination.type == 'select') {oSearch.addOperator('or');}

												oSearch.addFilter(v.model, v.comparison, sValue);
											});
												
											oSearch.getResults(function(data) {ns1blankspace.experience.journey.thingsToSee.populate(oParam, data)});
										}	
									}
									else
									{
										$('#' + oJourney.xhtmlPopulateElementID).slideDown(500);

										ns1blankspace.experience.journey.origins.reset({originID: oJourney.originID});

										if (!bExtend)
										{
											oJourney.destination.populationAtRest = [];
											oJourney.destination.populationAtRestResponse = {};
										};

										if (oResponse !== undefined)
										{	
											oJourney.destination.populationAtRest = oResponse.data.rows;
											oJourney.destination.populationAtRestResponse = oResponse;
										}

										var aHTML = [];

										if (sTenancy == 'hub')
										{	
											$.each(oJourney.destination.thingsToSee, function (i, v)
											{
												if (v.caption) {aHTML.push('<div class="ns1blankspaceCaption">' + v.caption + '</div>')}

												if (v.type == 'text')
												{	
													aHTML.push('<div><input ' +
																' id="ns1blankspaceExperience-' + oJourney.originID + '-' + oJourney.destinationID + '-' + v.id + '"' +
																' data-destination-id="' + v.populate + '"' +
																' data-populate="ns1blankspaceExperience-' + oJourney.originID + '-' + oJourney.destinationID + '-' + v.populate + '"' +
																' data-route-id="' + oJourney.originID + '-' + oJourney.destinationID + '-' + (v.populate?v.populate:v.id) + '"' +
																' class="ns1blankspaceText ns1blankspaceExperiencePopulateWith"></div>');
												}

												if (v.type == 'destination')
												{
													aHTML.push('<div id="ns1blankspaceExperience-' + oJourney.originID + '-' + oJourney.destinationID + '-' + v.id + '"' +
																	' class="ns1blankspaceExperience"></div>');
												}
											});

											$('#' + oJourney.xhtmlPopulateElementID).html(aHTML.join(''));

											$('input.ns1blankspaceText:first').focus();
										}

										else if (sTenancy == 'single' && !bExtend)
										{	
											var aHTML = [];

											if (oParam.populateID == undefined)
											{
												aHTML.push('<div id="' + oJourney.destination.xhtmlContainerID + '" class="' + sClass + '" style="width:98%; float:right;">');

												$.each(oJourney.destination.thingsToSee, function (i, thingToSee)
												{
													if ((thingToSee.type == 'destination' && thingToSee.model !== undefined))
													{
														aHTML.push('<div><div class="ns1blankspaceCaption" style="width:300px; float:left;">' +
																	thingToSee.caption + '</div>');

														aHTML.push('<div id="ns1blankspaceExperience-' + oJourney.originID + '-' + oJourney.destinationID + '-' + thingToSee.id + '"' +
																	' data-destination-id="' + thingToSee.id + '"' +
																	' data-route-id="' + oJourney.originID + '-' + oJourney.destinationID + '-' + thingToSee.id + '"' +
																	' class="ns1blankspaceExperienceDestination"></div></div>');
													}
												});

												$.each(oJourney.destination.thingsToSee, function (i, thingToSee)
												{
													if (thingToSee.type == 'text')
													{
														var bShow = false;

														if (oJourney.destination.populateWith != undefined)
														{
															bShow = ($.grep(oJourney.destination.populateWith, function(a) {return a.model == thingToSee.model}).length != 0)
														}

														if (bShow)
														{	
															aHTML.push('<div><div style="clear:both;" class="ns1blankspaceCaption">' +
																	thingToSee.caption + '</div>');

															aHTML.push('<div' +
																		' id="ns1blankspaceExperience-' + oJourney.routeID + '-' + thingToSee.id + '"' +
																		' class="ns1blankspaceExperiencePopulateWith"' +
																		' style="height:30px;"' +
																		' data-route-id="' + oJourney.routeID + '-' + thingToSee.id + '">' +
																		'</div>');
															
															aHTML.push('</div>');
														}	
													}
												});

												aHTML.push('</div>');

												aHTML.push('<div id="' + oJourney.destination.xhtmlContainerID + '-populate" style="width:95%"></div>');

												$('#' + oJourney.xhtmlPopulateElementID).html(aHTML.join(''));
											}
											else
											{
												var aHTMLPopulateWith = [];
												var bContainsDestination = false;

												oJourney.destination.populationAtWork = oJourney.destination.populationAtRest.slice(0,1);

												oJourney.destination.populationID = 
													(oJourney.destination.populationAtRest.length>0?oJourney.destination.populationAtRest[0].id:undefined)	

												//iPopulateID = oJourney.destination.populationID;

												var sClass = '';

												if (oJourney.destination.model) {sClass = 'ns1blankspaceExperienceContainer'};

												$.each(oJourney.destination.thingsToSee, function (i, thingToSee)
												{
													var sValue;

													if (thingToSee.type == 'destination')
													{
														bContainsDestination = true;

														if (oJourney.destination.populationAtWork.length > 0)
														{	
															if (thingToSee.model)
															{	
																sValue = (oJourney.destination.populationAtWork[0][thingToSee.model] || '');
															}	
														}	

														aHTML.push('<div><div class="ns1blankspaceCaption" style="width:300px; float:left;">' +
																	thingToSee.caption + '</div>');

														aHTML.push('<div id="ns1blankspaceExperience-' + oJourney.routeID + '-' + thingToSee.id +
																		'-control" data-route-id="' + oJourney.routeID + '-' + thingToSee.id + '" class="ns1blankspaceExperienceControl" style="text-align:right; float:right; width:100px; margin-right:14px;">');
														
														if (thingToSee.tenancy == 'single' && oJourney.previousDestination.populationAtRestIsNewBorn)
														{	
															aHTML.push('<div id="ns1blankspaceExperience-' + oJourney.routeID + '-' + thingToSee.id +
																			'-cancel" class="ns1blankspaceExperienceCancel" style="text-align:right; float:right; width:100px; margin-right:14px;"' +
																			' data-route-id="' + oJourney.routeID + '-' + thingToSee.id + '">' +
																			'CANCEL</div>');
														}
														else if (thingToSee.tenancy == 'multi' && thingToSee.populationCanReproduce == 'true')
														{
															aHTML.push('<div id="ns1blankspaceExperience-' + oJourney.routeID + '-' + thingToSee.id +
																		'-add" data-route-id="' + oJourney.routeID + '-' + thingToSee.id + '"' +
																		' class="ns1blankspaceExperienceAdd" style="text-align:right;">Add</div>');
														}
														
														aHTML.push('</div></div>');
														
														aHTML.push('<div id="ns1blankspaceExperience-' + oJourney.originID + '-' + oJourney.destinationID + '-' + thingToSee.id + '"' +
																		' data-destination-id="' + thingToSee.id + '"' +
																		' data-route-id="' + oJourney.originID + '-' + oJourney.destinationID + '-' + thingToSee.id + '"' +
																		(iPopulateID!==undefined?' data-populate-id="' + iPopulateID + '"':'') +
																		(sValue?' data-populate-with-id="' + sValue + '"':'') +
																		(sValue?' data-id="' + sValue + '"':'') +
																		' class="ns1blankspaceExperienceDestination">');

														aHTML.push('</div>');
													}
													else
													{	
														var oDestination = (oJourney.previousDestination.tenancy=='single'?oJourney.previousDestination:oJourney.destination);

														if (oDestination.populationAtWork.length > 0)
														{	
															oJourney.destination.populationID = 
																oDestination.populationAtWork[0][oJourney.destination.model]

															if (thingToSee.model)
															{	
																if (oJourney.destination.model != undefined)
																{	
																	sValue = (oDestination.populationAtWork[0][oJourney.destination.model + '.' + thingToSee.model] || '');
																}
																else
																{
																	sValue = (oDestination.populationAtWork[0][thingToSee.model] || '');
																}	
															}

															if (oJourney.destination.populationAtWork.length == 0)
															{
																oJourney.destination.populationAtWork.push({id: oJourney.destination.populationID})
															}
															if (oJourney.destination.populationAtRest.length == 0)
															{
																oJourney.destination.populationAtRest.push({id: oJourney.destination.populationID})
															}

															oJourney.destination.populationAtWork[0][thingToSee.model] = sValue;
															oJourney.destination.populationAtRest[0][thingToSee.model] = sValue;
														}	

														if (thingToSee.type == 'signpost')
														{
															$('#ns1blankspaceExperienceSignPost').html(sValue);
														}
														else
														{
															var bIsPopulateWith = false;
															var bSet = false;

															var oPopulationAtWork = oDestination.populationAtWork[0];

															if (oPopulationAtWork)
															{
																bSet = (oPopulationAtWork[oJourney.destination.model] != undefined && oPopulationAtWork[oJourney.destination.model] != '')
															}

															if (oJourney.destination.populateWith)
															{	
																bIsPopulateWith = ($.grep(oJourney.destination.populateWith, function(a) {return a.model == thingToSee.model}).length != 0);
															}	

															var aHTMLThing = [];

															aHTMLThing.push('<div style="clear:both;"><div class="ns1blankspaceCaption">' +
																		thingToSee.caption + '</div>');

															aHTMLThing.push('<div' +
																			' id="ns1blankspaceExperience-' + oJourney.routeID + '-' + thingToSee.id + '"' +
																			' class="ns1blankspaceExperiencePopulateWith' +
																			(thingToSee.populationCanReproduce == "true"?' ns1blankspaceExperienceEdit':'') + '"' +
																			' data-destination-id="' + thingToSee.id + '"' +
																			' data-route-id="' + oJourney.routeID + '-' + thingToSee.id + '"' +
																			' data-populate-id="' + (!bIsPopulateWith?iPopulateID:oJourney.previousDestination.populationID) + '"' +
																			' style="height:30px;">' +
																			 sValue + '</div>');
																
															aHTMLThing.push('</div>');

															if (bIsPopulateWith)
															{
																aHTMLPopulateWith.push(aHTMLThing.join(''))
															}
															else
															{
																aHTML.push(aHTMLThing.join(''))
															}
														}	
													}
												});

												var aHTMLContainer = [];

												if (!bContainsDestination)
												{	
													aHTMLContainer.push('<div id="' + oJourney.destination.xhtmlContainerID + '-populateWith" class="' + sClass + '" style="width:240px;">');
													aHTMLContainer.push(aHTMLPopulateWith.join(''));
													aHTMLContainer.push('</div>');

													if (!bEdit)
													{	
														aHTMLContainer.push('<div id="' + oJourney.destination.xhtmlContainerID + '" class="' + sClass + '" style="float:right; width:240px;">');
														aHTMLContainer.push(aHTML.join(''));
														aHTMLContainer.push('</div>');
													}	
												}
												else
												{	
													aHTMLContainer.push('<div id="' + oJourney.destination.xhtmlContainerID + '" class="' + sClass + '" style="width:98%; float:right;">');
													aHTMLContainer.push(aHTML.join(''));
													aHTMLContainer.push('</div>');
												}

												aHTMLContainer.push('<div id="' + oJourney.destination.xhtmlContainerID + '-populate" style="width:95%"></div>');

												$('#' + oJourney.xhtmlPopulateElementID).html(aHTMLContainer.join(''));
											}	

											$('#' + oJourney.destination.xhtmlContainerID + ' div.ns1blankspaceExperienceDestination').each(function(i, v)
											{
												var iID = $(v).attr('data-populate-id');

												if ($(v).attr('data-populate-with-id'))
												{
													iID = $(v).attr('data-populate-with-id');
												}
												
												ns1blankspace.experience.journey.thingsToSee.populate({xhtmlElementID: v.id, populateID: iID});
											});
										}

										else if (sTenancy == 'multi' && bExtend)
										{	
											if (oJourney.destination.type == 'select')
											{	
												aHTML.push('<div class="ns1blankspaceExperienceContainer"><table>');	
											}
												
											if ($('#ns1blankspaceExperience-' + oJourney.routeID + '-header').length == 0 || oJourney.destination.type == 'select')
											{	
												aHTML.push('<tr id="ns1blankspaceExperience-' + oJourney.routeID + '-header">');

												$.each(oJourney.destination.thingsToSee, function (i, v)
												{
													aHTML.push('<td class="ns1blankspaceExperienceHeader">' +
																	v.caption + '</td>');
												});

												aHTML.push('</tr>');
											}

											aHTML.push('<tr id="ns1blankspaceExperience-' + oJourney.routeID + '-new-container">');

											$.each(oJourney.destination.thingsToSee, function (i, thingToSee)
											{
												var sClass = 'ns1blankspaceExperiencePopulateWith';

												aHTML.push('<td class="' + sClass + '" style="height:30px;"' +
																' id="ns1blankspaceExperience-' + oJourney.routeID + '-' + thingToSee.id + '-"' +
																' data-populate-route-id="' + oJourney.routeID + '"' +
																' data-populate-id=""' +
																' data-route-id="' + oJourney.routeID + '-' + thingToSee.id + '"' +
																' data-destination-id="' + thingToSee.id + '">' +
																'</td>');
											});

											aHTML.push('</tr>');

											if (oJourney.destination.type == 'select')
											{	
												aHTML.push('</table></div>');
												$('#' + oJourney.xhtmlPopulateElementID).html(aHTML.join(''));
											}
											else
											{				
												$('#ns1blankspaceExperience-' + oJourney.routeID + '-control').html('<div class="ns1blankspaceExperienceCancel"' +
														' id="ns1blankspaceExperience-' + oJourney.routeID + '-cancel"' +
														' data-populate-route-id="' + oJourney.routeID + '"' +
														(iPopulateID!==undefined?' data-populate-id="' + iPopulateID + '"':'') +
														' data-id="new"' +
														' data-route-id="' + oJourney.routeID + '"' +
														' data-destination-id="">' +
														'Cancel</div>');	

												if ($('#ns1blankspaceExperience-' + oJourney.routeID + '-header').length == 0)
												{
													$('#ns1blankspaceExperience-' + oJourney.routeID).html(aHTML.join(''));
												}
												else
												{	
													$('#ns1blankspaceExperience-' + oJourney.routeID + '-header').after(aHTML.join(''));
												}
											}
										}

										else if (sTenancy == 'multi' && !bExtend)
										{
											if (oJourney.destination.populationAtRest.length == 0)
											{	
												if (oJourney.destination.populationCanReproduce == 'true')
												{	
													//oParam = ns1blankspace.util.setParam(oParam, 'extend', true);
													//ns1blankspace.experience.journey.thingsToSee.populate(oParam);
												}
												else
												{
													aHTML.push('<div>Does not exist...</div>');
												}	
											}
											else
											{
												var bCanBeMutable = bExtend;
												if (!bCanBeMutable) {bCanBeMutable = bEdit}
												if (!bCanBeMutable) {bCanBeMutable = (oJourney.destination.type == 'destination' && oJourney.destination.tenancy == 'multi')}

												aHTML.push('<div class="ns1blankspaceExperienceContainer"><table>');

												if (oJourney.destination.thingsToSee.length > 1 || (oJourney.destination.populationCanReproduce == 'true' && !bEdit))
												{	
													aHTML.push('<tr id="ns1blankspaceExperience-' + oJourney.routeID + '-header">');

													if (oJourney.destination.thingsToSee.length > 0)
													{	
														$.each(oJourney.destination.thingsToSee, function (i, v)
														{
															if (bValue?v.isPopulateWith:true)
															{
																aHTML.push('<td class="ns1blankspaceExperienceHeader"' +
																			(v.style?' style="' + v.style + '"':'') + '">' +
																			v.caption + '</td>');
															}	
														});
													}	
	
													aHTML.push('</tr>');
												}	

												$.each(oJourney.destination.populationAtRest, function (i, v)
												{
													aHTML.push('<tr>');

													$.each(oJourney.destination.thingsToSee, function (j, thingToSee)
													{
														var sClass;

														if (thingToSee.travelToRouteID)
														{	
															sClass = 'ns1blankspaceExperienceTravelTo'
														}
														else if (thingToSee.populateWith && bCanBeMutable)
														{	
															sClass = 'ns1blankspaceExperiencePopulateWith'
														}
														else if (thingToSee.type == 'text' && bCanBeMutable)
														{	
															sClass = 'ns1blankspaceExperiencePopulateWith'
														}
														else if (thingToSee.type == 'derived')
														{	
															sClass = 'ns1blankspaceExperiencePopulateDerived'
														}
														else
														{
															sClass = 'ns1blankspaceExperiencePopulate'
														}

														var sValue = '';
														var iPopulateWithID;

														if (thingToSee.model)
														{	
															if (thingToSee.thingsToSee && thingToSee.type != 'derived')
															{	
																var aValues = [];

																$.each(thingToSee.thingsToSee, function (j, thingToSeeThingToSee)
																{
																	if (thingToSeeThingToSee.model) {aValues.push(v[thingToSee.model + '.' + thingToSeeThingToSee.model])}
																});

																sValue = aValues.join(' ');
																iPopulateWithID = v[thingToSee.model];
															}
															else
															{
																sValue = v[thingToSee.model];
																if (thingToSee.type != 'text' || sTenancy == 'multi') {iPopulateWithID = v['id']};
															}
														}

														if (!oJourney.previousDestination.populationIsAtWork && oJourney.previousDestination.tenancy == 'single') {iPopulateID = ''}

														if (bValue?thingToSee.isPopulateWith:true)
														{	
															aHTML.push('<td class="' + sClass + '"' +
																		' id="ns1blankspaceExperience-' + oJourney.routeID + '-' + thingToSee.id + '-' + v.id + '"' +
																		(thingToSee.travelToRouteID?' data-travel-to-route-id="' + thingToSee.travelToRouteID + '"':'') +
																		' data-populate-route-id="' + oJourney.routeID + '"' +
																		(iPopulateID!==undefined&&bValue?' data-populate-id="' + iPopulateID + '"':' data-populate-id="' + v.id + '"') +
																		(iPopulateWithID!==undefined?' data-populate-with-id="' + iPopulateWithID + '"':'') +
																		' data-route-id="' + oJourney.routeID + '-' + thingToSee.id + '"' +
																		' data-destination-id="' + thingToSee.id + '"' +
																		(thingToSee.style?' style="' + thingToSee.style + '"':'') + '">' +
																		sValue + '</td>');
														}	
													});

													var aXHTMLToDo = [];

													$.each(oJourney.destination.thingsToDo, function (j, thingToDo)
													{
														aXHTMLToDo.push('<div class="ns1blankspaceExperienceDoIt"' +
																		' id="ns1blankspaceExperienceJourneyDoIt-' + oJourney.routeID + '-' + thingToDo.id + '"' +
																		' data-do-it-id="' + thingToDo.id + '"' +
																		' data-route-id="' + oJourney.routeID + '">' + thingToDo.caption + '</div>');
													});

													if (oJourney.destination.populationCanReproduce == 'true' && bEdit)
													{
														aXHTMLToDo.push('<td class="ns1blankspaceExperienceDoSomething">' +
																		'<span class="ns1blankspaceExperienceDone"' +
																		' data-route-id="' + oJourney.routeID + '"' +
																		' data-id="' + oJourney.destination.populationAtRest[0]['id'] + '"' +
																		'">Done</span></td>');
													}
														
													aHTML.push('<td>' + aXHTMLToDo.join('') + '</td></tr>');
												});

												aHTML.push('</table>');

												if (oJourney.destination.populationAtRestResponse.morerows == "true")
												{
													aHTML.push('<div class="ns1blankspaceExperienceShowMore">show more</div>');
												}

												aHTML.push('</div>');

												$('#' + oJourney.xhtmlPopulateElementID).html(aHTML.join(''));
											}	
										}
									}
								},

					thingToSee: {			
									vacate: 	function (oParam) 
												{
													var oJourney = ns1blankspace.experience.journey.get(oParam);
													var bPermanent = ns1blankspace.util.getParam(oParam, 'terminate', {"default": false}).value;
													var oData = {};

													if (oJourney.previousDestination.populationAtWork !== undefined)
													{
														if (oJourney.destination.type == 'destination')  // VACATE DOWN
														{
															oJourney.previousDestination.populationAtWork[0][oJourney.destination.model] = undefined;
															oJourney.destination.populationAtWork = undefined;
															$.each(oJourney.destination.thingsToSee, function (i, thingToSee)
															{
																oJourney.previousDestination.populationAtWork[0][oJourney.destination.model + '.' + thingToSee.model] = undefined;
																thingToSee.populationAtWork = undefined;
															});
														}
														else  // VACATE UP
														{
															oJourney.previousDestination.populationAtWork[0][(oJourney.destination.model).split('.')[1]] = undefined;
															oJourney.destination.populationAtWork = undefined;
														}

														if (bPermanent)
														{
															oData[(oJourney.destination.model).split('.')[1]] = '';
															oData['id'] = oJourney.previousDestination.populationAtWork[0].id;
															
															oParam.populationAtWorkToBeRested = oData;
										
															ns1blankspace.experience.journey.thingsToSee.thingToSee.rest(oParam);
														}
														else
														{
															oParam.edit = true;
															ns1blankspace.experience.journey.thingsToSee.populate(oParam);
														}
													}	
												},									
																	
									populate: 	function (oParam) 
												{
													var oJourney = ns1blankspace.experience.journey.get(oParam);
													var oData = oJourney.destination.populationAtRest;

													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
													var sPopulateWithID = ns1blankspace.util.getParam(oParam, 'populateWithID').value;

													var sXHTMLPopulateElementID = 'ns1blankspaceExperience-' + oJourney.routeID;

													if (oParam.populateID!==undefined) {sXHTMLPopulateElementID = sXHTMLPopulateElementID + '-' + oParam.populateID}

													oParam.populationAtWorkToBeRested = $.grep(oData, function(a) {return a.id == sPopulateWithID})[0];

													var aValues = [];

													$.each(oJourney.destination.thingsToSee, function (i, v)
													{
														if (v.model) {aValues.push(oParam.populationAtWorkToBeRested[v.model])}
													});

													oParam.populationAtWorkToBeRested.text = aValues.join(' ');
													oParam.populationAtWorkToBeRested.type = 'select';

													$('#' + sXHTMLPopulateElementID + '-populate').slideUp(500);
													$('#' + sXHTMLPopulateElementID + '-input-populate').slideUp(500);

													oParam.xhtmlElementID = sXHTMLPopulateElementID;

													ns1blankspace.experience.journey.thingsToSee.thingToSee.rest(oParam);
												},

									mutate: 	function (oParam)
												{
													var oJourney = ns1blankspace.experience.journey.get(oParam);
													var bSetFocus = ns1blankspace.util.getParam(oParam, 'setFocus', {"default": true}).value;
											
													var sElementID = oJourney.xhtmlElementID;
													var sHTML = oParam.xhtml;
													var iPopulateID = oParam.populateID;
													var sElementMutatedToID = sElementID + '-input';

													var bIsPopulateWith = false;

													if (oJourney.previousDestination.tenancy == 'single')
													{
														if (oJourney.previousDestination.populateWith != undefined)
														{	
															bIsPopulateWith = ($.grep(oJourney.previousDestination.populateWith, function (a) {return (a.model == oJourney.destination.model)}).length != 0);
														}
													}	

													var sClass = '';

													if (oJourney.destination.type == 'select')
													{
														sClass += ' ns1blankspaceExperiencePopulateWith';
													}
													else if (oJourney.previousDestination.tenancy == 'single' && !oJourney.destination.populationIsAtWork && bIsPopulateWith)
													{
														sClass += ' ns1blankspaceExperiencePopulateDestinationWith';
													}
													else
													{
														if (oJourney.destination.type == 'date')
														{	
															sClass = 'ns1blankspaceExperiencePopulationDate';
														}
														else
														{
															sClass = 'ns1blankspaceExperiencePopulation';
														}	
													}

													sHTML = '<input id="' + sElementMutatedToID + '"' +
																' class="' + sClass + '" style="margin-bottom:4px;' +
																(oJourney.destinationID!==undefined?' data-destination-id="' + oJourney.destinationID + '"':'') +
																(oJourney.routeID!==undefined?' data-route-id="' + oJourney.routeID + '"':'') +
																(iPopulateID!==undefined?' data-populate-id="' + iPopulateID + '"':'') +
																			' value="' + sHTML + '">'
													
													$('#' + sElementID).html(sHTML);

													if (oJourney.destination.type == 'date')
													{	
														//$('#' + sElementMutatedToID).datepicker('destroy');
														$('#' + sElementMutatedToID).datepicker({dateFormat: 'd M yy'});
														$('#' + sElementMutatedToID).datepicker({showAnim: 'slideDown'});
														//$('#' + sElementMutatedToID).datepicker('show');
														//bSetFocus = false;
													}

													if (bSetFocus) {$('#' + sElementMutatedToID).focus()}

													if (oJourney.destination.type == "select")
													{	
														ns1blankspace.experience.journey.space.lease(
														{
															nextTo: 2,
															xhtmlElementID: sElementMutatedToID
														});
													}
												},	

									derive: 	function (oParam, oResponse) 
												{
													var oJourney = ns1blankspace.experience.journey.get(oParam);
													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
													
													sXHTMLElementID = ns1blankspace.experience.journey.space.lease(
													{
														nextTo: 2,
														xhtmlElementID: sXHTMLElementID
													})
													.xhtmlElementID;

													var aHTML = [];

													aHTML.push('<div class="ns1blankspaceExperienceContainer"><table><tr>');

													$.each(oJourney.destination.thingsToSee, function (i, thingToSee)
													{
														aHTML.push('<td>' + thingToSee.caption + '</td>');

														var oPopulationAtRest = $.grep(thingToSee.populationData, function (a) {return a.value == thingToSee.value});
														var sPopulationAtRestValue = oPopulationAtRest[0];

														<td class="ns1blankspaceExperiencePopulate" id="ns1blankspaceExperience-ins-invoice-items-account-title-30188" data-populate-route-id="ins-invoice-items-account" data-populate-id="4439619" data-populate-with-id="30188" data-route-id="ins-invoice-items-account-title" data-destination-id="title" "="">Sales Commission</td>

														if (sPopulationAtRestValue != undefined)
														{
															aHTML.push('<b>' + populationData.caption + '</b>');
														}	

														$.each(thingToSee.populationData, function (i, populationData)
														{
															if (populationData.value != sPopulationAtRestValue)
															{	
																aHTML.push(populationData.caption);
															}	
														});
													});

													aHTML.push('</div>');

													$('#' + sXHTMLElementID).html(aHTML.join(''));
												},

									rest: 		function (oParam, oResponse) 
												{
													var oJourney = ns1blankspace.experience.journey.get(oParam);
													var oPopulationAtWorkToBeRested = ns1blankspace.util.getParam(oParam, 'populationAtWorkToBeRested').value;
													var bOKToRest = false;
													
													if (oResponse == undefined)
													{	
														var oData = {};
														var oPopulationBeingRested = {};
														var sPutToRest = oJourney.previousDestination.populationAtRestLocation + '_MANAGE';

														if (oJourney.destination.type == 'destination')
														{
															oData = oPopulationAtWorkToBeRested;
															oPopulationBeingRested = oData;
															bOKToRest = true;
														}
														else
														{
															oData.id = oParam.populateID;
															oPopulationBeingRested.id = oData.id;

															if (oJourney.destination.type == 'select')
															{		
																oData[(oJourney.destination.model).split('.')[1]] = oPopulationAtWorkToBeRested.id;
																oPopulationBeingRested[oJourney.destination.model] = oPopulationAtWorkToBeRested.id;

																$.each(oJourney.destination.thingsToSee, function (i, v)
																{
																	oPopulationBeingRested[oJourney.destination.model + '.' + v.model] = oPopulationAtWorkToBeRested[v.model]
																});

																bOKToRest = true;
															}	

															if (oJourney.destination.type == 'text' || oJourney.destination.type == 'date')
															{		
																oData[(oJourney.destination.model).split('.')[1] || oJourney.destination.model] = oPopulationAtWorkToBeRested.text;
																oPopulationBeingRested[oJourney.destination.model] = oPopulationAtWorkToBeRested.text;

																//if ($.grep(oJourney.previousDestination.populateWith, function (a) {return (a.model == oJourney.destination.model)}).length == 0)
																//{
																	bOKToRest = true;
																//}
																//else
																//{
																//	bOKToRest = (oJourney.previousDestination.populationAtWork[0].id == '');
																//}
															}

															if (true || bOKToRest)
															{	
																//TODO GREP ON data-id
																$.each(oJourney.previousDestination.populationAtWorkToBeRestedWhenCan, function (i, v)
																{
																	if (v.type == 'select')
																	{		
																		oData[(v.model).split('.')[1]] = v.id;
																	}	

																	if (v.type == 'text')
																	{		
																		oData[(v.model).split('.')[1] || v.model] = v.text;
																	}
																});

																if ((oParam.populateID == '' || oParam.populateID == '0') && oJourney.previousDestination.type == 'destination')
																{	
																	$.each(oJourney.previousDestination.populateWith, function (i, v)
																	{
																		oData[(v.model).split('.')[1] || v.model] = v.value;
																	});
																}
															}	
														}	

														//ns1blankspace.debug.message(oPopulationBeingRested, true);
														ns1blankspace.debug.message('rest: ' + sPutToRest + ':', true);
														ns1blankspace.debug.message(oData, true);

														if (bOKToRest)
														{	
															oParam.populationBeingRested = oPopulationBeingRested;

															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI(sPutToRest),
																data: oData,
																dataType: 'json',
																success: function(data)
																{
																	ns1blankspace.experience.journey.thingsToSee.thingToSee.rest(oParam, data)
																}
															});
														}	
													}
													else
													{
														if (oResponse.status == 'ER')
														{
															oPopulationAtWorkToBeRested.model = oJourney.destination.model;
															oPopulationAtWorkToBeRested.xhtmlElementID = oJourney.xhtmlElementID;
															oJourney.previousDestination.populationAtWorkToBeRestedWhenCan.push(oPopulationAtWorkToBeRested);

															$('#' + oJourney.xhtmlElementID).closest('tr').css('background-color', '#FF6666');

															$('#' + oJourney.xhtmlElementID).html(oPopulationAtWorkToBeRested.text);
														}	
														else
														{
															var oPopulationBeingRested = ns1blankspace.util.getParam(oParam, 'populationBeingRested').value;
															if (oResponse.id) {oPopulationBeingRested.id = oResponse.id}

															if (oResponse.notes == 'ADDED' && oJourney.previousDestination.tenancy != 'multi')
															{
																ns1blankspace.experience.journey.thingsToSee.populate(
																{
																	xhtmlElementID: 'ns1blankspaceJourney-' + oJourney.previousRouteID,
																	routeID: oJourney.previousRouteID,
																	populateWithID: oPopulationBeingRested.id,
																	populateID: oPopulationBeingRested.id,
																	populateWith: 
																	[
																		{
																			"model": "id",
																			"comparison": "EQUAL_TO",
																			"value1": oPopulationBeingRested.id
																		}
																	]
																});
															}
															else
															{
																if (oJourney.destination.type == 'destination')
																{
																	var iID = oPopulationBeingRested[oJourney.destination.model.split('.')[1]];
																	var aPopulationAtRest = $.grep(oJourney.destination.populationAtRest, function(a) {return a.id == iID});
																	oJourney.destination.populationAtWork = [aPopulationAtRest[0]];

																	oJourney.previousDestination.populationAtWork = [{}];
																	oJourney.previousDestination.populationAtWork[0][oJourney.destination.model] = iID;

																	$.each(oJourney.destination.thingsToSee, function (i, v)
																	{	
																		if (v.model)
																		{
																			oJourney.previousDestination.populationAtWork[0][oJourney.destination.model + '.' + v.model] = aPopulationAtRest[0][v.model]
																		}	
																	})

																	oParam.xhtmlElementID = 'ns1blankspaceExperience-' + oParam.routeID;
																	ns1blankspace.experience.journey.thingsToSee.populate(oParam);
																}
																else
																{
																	$('#ns1blankspaceExperience-' + oJourney.previousRouteID + '-new-container [data-populate-id=""]').attr('data-populate-id', oResponse.id)
																	
																	$.each(oJourney.previousDestination.populationAtWorkToBeRestedWhenCan, function (i, v)
																	{
																		$('#' + v.xhtmlElementID).closest('tr').css('background-color', '');
																	});

																	oJourney.previousDestination.populationAtWorkToBeRestedWhenCan = undefined;
																	oJourney.previousDestination.populationAtRestIsNewBorn = (oResponse.notes == 'ADDED');

																	oJourney.destination.populationAtWork = [oPopulationAtWorkToBeRested];

																	var aPopulationAtRest = $.grep(oJourney.previousDestination.populationAtRest, function(a) {return a.id == oPopulationBeingRested.id});

																	if (aPopulationAtRest.length == 0)
																	{	
																		oJourney.previousDestination.populationAtRest.push(oPopulationBeingRested);
																	}
																	else
																	{
																		aPopulationAtRest[0] = $.extend(true, aPopulationAtRest[0], oPopulationBeingRested)
																	}	

																	if (oJourney.destination.type == 'select')
																	{		
																		$('#' + oJourney.xhtmlElementID).attr('data-populate-with-id', oJourney.destination.populationAtWork[0].id);
																		$('#' + oJourney.xhtmlElementID).val(oJourney.destination.populationAtWork[0].text);
																		$('#' + oJourney.xhtmlElementID).html(oJourney.destination.populationAtWork[0].text);
																	}

																	if (oJourney.destination.type == 'text' || oJourney.destination.type == 'date')
																	{		
																		$('#' + oJourney.xhtmlElementID).val(oJourney.destination.populationAtWork[0].text);
																		$('#' + oJourney.xhtmlElementID).html(oJourney.destination.populationAtWork[0].text);
																	}
																}
															}	
														}
													}	
												}
								}
				}										
}