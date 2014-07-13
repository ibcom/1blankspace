// notes @ http://www.mydigitalstructure.com/1blankspace_namespace_experience
//ns1blankspace.experience.journey.get({routeID: 'ins-invoice'})

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
							where: 'div.ns1blankspaceExperienceClose, td.ns1blankspaceExperienceClose',
							subject: 'close'
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
							where: 'td.ns1blankspaceExperienceTravelTo',
							subject: 'travelTo'
						},
						{
							what: 'focusout',
							where: 'input.ns1blankspaceExperiencePopulation',
							subject: 'rest'
						},
						{
							what: 'click',
							where: 'div.ns1blankspaceExperienceAdd',
							subject: 'extend'
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

					oJourney.destination.xhtmlContainerID = 'ns1blankspaceExperience-' + oJourney.routeID + '-container';

					oJourney.previousDestination = (oJourney.sourceRoute.length!=0?oJourney.destinations[oJourney.sourceRoute.length-1]:undefined)

					oJourney.destination.populationIsAtWork = false;
	
					if (oJourney.destination.tenancy === undefined) {oJourney.destination.tenancy = 'single'}
					if (oJourney.destination.thingsToDo === undefined) {oJourney.destination.thingsToDo = []}

					oJourney.previousDestination.populationAtWorkToBeRestedWhenCan	= (oJourney.previousDestination.populationAtWorkToBeRestedWhenCan || []);

					oJourney.populateWith = ns1blankspace.util.getParam(oParam, 'populateWith', {"default": oJourney.destination.populateWith}).value;

					ns1blankspace.experience.journey.whereami = oJourney.destination;

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
											ns1blankspace.experience.journey.controller.message(
											{
												initiator: $(this),
												id: $(this).attr('id'),
												xhtmlElementID: $(this).attr('id'),
												routeID: $(this).attr('data-route-id'),
												populateRouteID: $(this).attr('data-populaterouteid'),
												event: e,
												subject: v.subject,
												inspection: (v.inspection!==undefined?v.inspection:true),
												value: $(this).val(),
												xhtml: $(this).html(),
												populateID: $(this).attr('data-populate-id'),
												populateWithID: $(this).attr('data-populate-with-id')
											});
										});
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
	
									//oParam = ns1blankspace.util.setParam(oParam, 'populateContext', oParam.populationID);

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

					close: 		function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;

									//Need to find one in table below
									oInitiator.closest('tr').hide();
								},

					populateDestinationWith: 	
								function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;
									var oEvent = ns1blankspace.util.getParam(oParam, 'event', {remove: true}).value;
									var oJourney = ns1blankspace.experience.journey.get(oParam);

									//var oParam = {xhtmlElementID: oInitiator.attr('id')}
									
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
										if (oJourney.destination.type == "text")
										{
											var bIsPopulateWith = ($.grep(oJourney.previousDestination.populateWith, function (a) {return (a.model == oJourney.destination.model)}).length != 0);

											if (bIsPopulateWith && !oJourney.previousDestination.populationAtRestIsNewBorn)
											{
												oJourney.previousDestination.populationAtRestIsNewBorn = true;

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

					rest: 		function (oParam)
								{
									oParam.xhtmlElementID = oParam.xhtmlElementID.replace('-input', '');
									oParam.populationAtWorkToBeRested = {type: 'text', text: oParam.value}

									ns1blankspace.experience.journey.thingsToSee.thingToSee.rest(oParam);
								},	

					populate: 	function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;
									
									if (oInitiator.attr('data-populaterouteid'))
									{
										oParam = ns1blankspace.util.setParam(oParam, 'routeID', oInitiator.attr('data-populaterouteid'));
									}
									
									//oParam = ns1blankspace.util.setParam(oParam, 'populateContext', oInitiator.attr('data-id'));
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
									var sDoItID = oInitiator.attr('data-doitid');
									var sDoIt = $.grep(oJourney.destination.thingsToDo, function(a) {return a.id == sDoItID})[0].doIt;

									ns1blankspace.util.execute(sDoIt);
								},

					travelTo: 	function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;

									if (oInitiator.attr('data-travelToRouteID'))
									{
										oParam = ns1blankspace.util.setParam(oParam, 'routeID', oInitiator.attr('data-travelToRouteID'));
									}
									
									//oParam = ns1blankspace.util.setParam(oParam, 'populateContext', oParam.populationID);

									ns1blankspace.experience.journey.destinations.destination.travelTo(oParam);
								},

					extend: 	function (oParam)
								{
									var oInitiator = ns1blankspace.util.getParam(oParam, 'initiator', {remove: true}).value;

									oParam = ns1blankspace.util.setParam(oParam, 'extend', true);
									ns1blankspace.experience.journey.thingsToSee.populate(oParam);
								}																
				},

	space: 		{		
					options: {lease: {nextTo: {me: 1, myParent: 2}}},

					lease:	function(oParam)
								{
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
									var iNextTo = ns1blankspace.util.getParam(oParam, 'nextTo', {"default": ns1blankspace.experience.journey.space.options.lease.nextTo.me}).value;
									var bRelease = ns1blankspace.util.getParam(oParam, 'release', {"default": false}).value;

									var sXHTMLNextToElementID = sXHTMLElementID;
									var oXHTMLNextToElement = $('#' + sXHTMLNextToElementID);

									if (iNextTo == ns1blankspace.experience.journey.space.options.lease.nextTo.myParent)
									{
										sXHTMLNextToElementID = sXHTMLElementID.replace('-input', '');
										oXHTMLNextToElement = $('#' + sXHTMLNextToElementID).closest('tr');
									}

									var sXHTMLPopulateElementID = sXHTMLElementID + '-populate';
									var iLength = oXHTMLNextToElement.children().length;

									if (bRelease)
									{	
										oXHTMLNextToElement.next().remove();
									}	
									else if ($('#' + sXHTMLPopulateElementID).length == 0)
									{	
										oXHTMLNextToElement.after('<tr>' +
											'<td colspan=' + iLength + '"><div id="' + sXHTMLPopulateElementID + '"></div></td></tr>');
									}	
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

									aHTML.push('<div id="ns1blankspaceExperiences" style="background-color: rgba(255,255,255,0.8); border-radius:5px; padding:14px; padding-left:8px; padding-top:8px;">');

									var oOrigin = $.grep(ns1blankspace.data.control.experience.origins, function(a) {return a.id == sOriginID})[0];

									$.each(oOrigin.destinations, function(i, v)
									{
										aHTML.push('<div id="ns1blankspaceExperience-' + sOriginID + '-' + v.id + '"' +
														' data-route-id="' + sOriginID + '-' + v.id + '"' +
														' style="padding:10px; font-size:1.2em; cursor: pointer;" class="ns1blankspaceExperiences">' +
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
														id: oJourney.previousDestination.populationAtRestContext
													}

													oParam.populationAtWorkToBeRested[(oJourney.destination.model).split('.')[1] || oJourney.destination.model] = sPopulateWithID;

													$('#' + sXHTMLPopulateElementID + '-populate').slideUp(500);

													oParam.xhtmlElementID = sXHTMLPopulateElementID;

													ns1blankspace.experience.journey.thingsToSee.thingToSee.rest(oParam);
												},

									travelTo: 	function (oParam) 
												{
													var oJourney = ns1blankspace.experience.journey.get(oParam);

													if (oJourney.destination.gettingThere)
													{
														ns1blankspace.util.execute(oJourney.destination.gettingThere)
													}	
													else
													{	
														$('#ns1blankspaceControl').html(ns1blankspace.experience.translate({commonText: oJourney.destination.name}));

														var aHTML = [];

														aHTML.push('<div id="ns1blankspaceJourney-' + oJourney.originID + '-' + oJourney.destinationID + '"' + 
																			' style="width:560px; margin-right:18px; float:left; background-color: rgba(255,255,255,0.2);' +
																			' border-radius:5px; padding:18px; padding-left:18px; padding-top:12px;"></div>');

														aHTML.push('<div id="ns1blankspaceExperienceToDo" style="width:100px; float:right;">');

														$.each(oJourney.destination.thingsToDo, function (i, v)
														{
															var sStyle = (v.backgroundColor?'background-color:' + v.backgroundColor + ';':'');

															sStyle = 'style="' + sStyle + ' padding:8px;"';

															aHTML.push('<div id="ns1blankspaceExperienceToDo-' + oJourney.originID + '-' + oJourney.destinationID + '-' + v.id + '"' +
																			' class="ns1blankspaceAction"' +
																			' data-route-id="' + oJourney.originID + '-' + oJourney.destinationID + '"' +
																			sStyle + '>' +
																			v.caption +
																			'</div>');
														});

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

														ns1blankspace.experience.journey.thingsToSee.populate(oParam);
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
									//var iPopulateID = ns1blankspace.util.getParam(oParam, 'populateID', {"default": oJourney.previousDestination.populationID}).value;
									var iPopulateID = ns1blankspace.util.getParam(oParam, 'populateID').value;

									if (oJourney.populateWith !== undefined && oResponse === undefined && !bExtend && ((sTenancy == 'single' && oJourney.previousDestination.tenancy != 'single') || sTenancy == 'multi'))
									{	
										$('#' + oJourney.xhtmlPopulateElementID).html('');

										var aFields = [];

										$.each(oJourney.destination.thingsToSee, function (i, v)
										{
											if (v.model)
											{
												aFields.push(v.model)

												if (v.thingsToSee)
												{
													$.each(v.thingsToSee, function (j, k)
													{
														if (k.model) aFields.push(v.model + '.' + k.model)
													});		
												}
											}	
										});

										sFields = aFields.join(',');

										var oSearch = new AdvancedSearch();
										oSearch.method = oJourney.destination.populationAtRestLocation + '_SEARCH';
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
															sValue = $('#ns1blankspaceExperience-' + sRouteID + '-' + sValue).html();
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
									else
									{
										$('#' + oJourney.xhtmlPopulateElementID).slideDown(500);

										if (!bExtend) {oJourney.destination.populationAtRest = []};

										if (oResponse !== undefined)
										{	
											oJourney.destination.populationAtRest = oResponse.data.rows;
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
											var aHTMLPopulateWith = [];
											var bContainsDestination = false;

											oJourney.destination.populationAtWork = oJourney.destination.populationAtRest.slice(0,1);

											oJourney.destination.populationID = 
												(oJourney.destination.populationAtRest.length>0?oJourney.destination.populationAtRest[0].id:undefined)	

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

													if (thingToSee.tenancy == 'single' && oJourney.previousDestination.populationAtRestIsNewBorn)
													{	
														aHTML.push('<div id="ns1blankspaceExperience-' + oJourney.routeID + '-' + thingToSee.id +
																		'-action" class="ns1blankspaceExperienceCancel" style="float:right; width:100px;"' +
																		' data-route-id="' + oJourney.routeID + '-' + thingToSee.id + '">' +
																		'CANCEL</div></div>');
													}
													else if (thingToSee.tenancy == 'multi' && thingToSee.populationCanReproduce == 'true')
													{
														aHTML.push('<div id="ns1blankspaceExperience-' + oJourney.routeID + '-' + thingToSee.id +
																	'-action" data-route-id="' + oJourney.routeID + '-' + thingToSee.id + '" class="ns1blankspaceExperienceAdd" style="float:right; width:100px;">Add</div></div>');
													}
													else
													{
														aHTML.push('</div>');
													}

													aHTML.push('<div id="ns1blankspaceExperience-' + oJourney.originID + '-' + oJourney.destinationID + '-' + thingToSee.id + '"' +
																	' data-destination-id="' + thingToSee.id + '"' +
																	' data-route-id="' + oJourney.originID + '-' + oJourney.destinationID + '-' + thingToSee.id + '"' +
																	' data-populate-id="' + iPopulateID + '"' +
																	(sValue?' data-populate-with-id="' + sValue + '"':'') +
																	(sValue?' data-id="' + sValue + '"':'') +
																	' class="ns1blankspaceExperienceDestination">');

													aHTML.push('</div>');
												}
												else
												{	
													if (oJourney.previousDestination.populationAtWork.length > 0)
													{	
														if (thingToSee.model)
														{	
															sValue = (oJourney.previousDestination.populationAtWork[0][oJourney.destination.model + '.' + thingToSee.model] || '');
														}

														if (oJourney.destination.populationAtWork.length == 0)
														{
															oJourney.destination.populationAtWork.push({id: oJourney.dataID})
														}
														if (oJourney.destination.populationAtRest.length == 0)
														{
															oJourney.destination.populationAtRest.push({id: oJourney.dataID})
														}

														oJourney.destination.populationAtWork[0][thingToSee.model] = sValue;
														oJourney.destination.populationAtRest[0][thingToSee.model] = sValue;
													}	

													var bIsPopulateWith = true;
													var bSet = false;

													var oPopulationAtWork = oJourney.previousDestination.populationAtWork[0];

													if (oPopulationAtWork)
													{
														bSet = (oPopulationAtWork[oJourney.destination.model] != undefined && oPopulationAtWork[oJourney.destination.model] != '')
													}

													bIsPopulateWith = ($.grep(oJourney.destination.populateWith, function(a) {return a.model == thingToSee.model}).length != 0);

													var aHTMLThing = [];

													aHTMLThing.push('<div><div class="ns1blankspaceCaption">' +
																thingToSee.caption + '</div>');

													if (bEdit)
													{	
														aHTMLThing.push('<div><input ' +
																	' id="ns1blankspaceExperience-' + oJourney.routeID + '-' + thingToSee.id + '"' +
																	' class="ns1blankspaceText ns1blankspaceExperiencePopulateDestinationWith' +
																	(thingToSee.populationCanReproduce == "true"?' ns1blankspaceExperienceEdit':'') + '"' +
																	' data-destination-id="' + thingToSee.id + '"' +
																	' data-route-id="' + oJourney.routeID + '-' + thingToSee.id + '"' +
																	' data-populate-id="' + iPopulateID + '"' +
																	' value="' + sValue + '">');
													}
													else
													{
														aHTMLThing.push('<div' +
																	' id="ns1blankspaceExperience-' + oJourney.routeID + '-' + thingToSee.id + '"' +
																	' class="ns1blankspaceText ns1blankspaceExperiencePopulateWith' +
																	(thingToSee.populationCanReproduce == "true"?' ns1blankspaceExperienceEdit':'') + '"' +
																	' data-destination-id="' + thingToSee.id + '"' +
																	' data-route-id="' + oJourney.routeID + '-' + thingToSee.id + '"' +
																	' data-populate-id="' + iPopulateID + '"' +
																	' style="height:30px;">' +
																	 sValue + '</div>');
													}	
														
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
											});

											var aHTMLContainer = [];

											if (!bContainsDestination)
											{	
												aHTMLContainer.push('<div id="' + oJourney.destination.xhtmlContainerID + '-populateWith" class="' + sClass + '" style="width:250px;">');
												aHTMLContainer.push(aHTMLPopulateWith.join(''));
												aHTMLContainer.push('</div>');

												if (!bEdit)
												{	
													aHTMLContainer.push('<div id="' + oJourney.destination.xhtmlContainerID + '" class="' + sClass + '" style="float:right; width:250px;">');
													aHTMLContainer.push(aHTML.join(''));
													aHTMLContainer.push('</div>');
												}	
											}
											else
											{	
												aHTMLContainer.push('<div id="' + oJourney.destination.xhtmlContainerID + '" class="' + sClass + '" style="float:right;">');
												aHTMLContainer.push(aHTML.join(''));
												aHTMLContainer.push('</div>');
											}

											aHTMLContainer.push('<div id="' + oJourney.destination.xhtmlContainerID + '-populate"></div>');

											$('#' + oJourney.xhtmlPopulateElementID).html(aHTMLContainer.join(''));

											$('#' + oJourney.destination.xhtmlContainerID + ' div.ns1blankspaceExperienceDestination').each(function(i, v)
											{
												var iID;
												if ($(v).attr('data-populate-with-id')) {iID = $(v).attr('data-populate-with-id')}
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
																' id="ns1blankspaceExperience-' + oJourney.routeID + '-' + thingToSee.id + '-new"' +
																' data-traveltorouteid="' + thingToSee.travelToRouteID + '"' +
																' data-populaterouteid="' + oJourney.routeID + '"' +
																(oJourney.populateID?' data-populate-id="' + oJourney.populateID + '"':'') +
																' data-id="new"' +
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
												if (true)
												{
													$('#ns1blankspaceExperience-' + oJourney.routeID + '-action').html('<td class="ns1blankspaceExperienceClose"' +
																	' id="ns1blankspaceExperience-' + oJourney.routeID + '-cancel"' +
																	' data-populaterouteid="' + oJourney.routeID + '"' +
																	(oJourney.populateID?' data-populate-id="' + oJourney.populateID + '"':'') +
																	' data-id="new"' +
																	' data-route-id="' + oJourney.routeID + '"' +
																	' data-destination-id="">' +
																	'Cancel</td>');
												}	

												$('#ns1blankspaceExperience-' + oJourney.routeID + '-header').after(aHTML.join(''));
											}
										}

										else if (sTenancy == 'multi' && !bExtend)
										{
											if (oJourney.destination.populationAtRest.length == 0)
											{	
												if (oJourney.destination.populationCanReproduce == 'true')
												{	
													oParam = ns1blankspace.util.setParam(oParam, 'extend', true);
													ns1blankspace.experience.journey.thingsToSee.populate(oParam);
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

												if (oJourney.destination.thingsToSee.length > 1 || (oJourney.destination.populationCanReproduce == 'true' & !bEdit))
												{	
													aHTML.push('<tr id="ns1blankspaceExperience-' + oJourney.routeID + '-header">');

													if (oJourney.destination.thingsToSee.length > 0)
													{	
														$.each(oJourney.destination.thingsToSee, function (i, v)
														{
															aHTML.push('<td class="ns1blankspaceExperienceHeader">' +
																			v.caption + '</td>');
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
															sClass = 'ns1blankspaceExperience'
														}
														else
														{
															sClass = 'ns1blankspaceExperiencePopulate'
														}

														var sValue = '';
														var iPopulateWithID;

														if (thingToSee.model)
														{	
															if (thingToSee.thingsToSee)
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
																if (thingToSee.type != 'text') {iPopulateWithID = v['id']};
															}
														}

														aHTML.push('<td class="' + sClass + '"' +
																		' id="ns1blankspaceExperience-' + oJourney.routeID + '-' + thingToSee.id + '-' + v.id + '"' +
																		(thingToSee.travelToRouteID?' data-traveltorouteid="' + thingToSee.travelToRouteID + '"':'') +
																		' data-populaterouteid="' + oJourney.routeID + '"' +
																		(iPopulateID?' data-populate-id="' + iPopulateID + '"':' data-populate-id="' + v.id + '"') +
																		(iPopulateWithID?' data-populate-with-id="' + iPopulateWithID + '"':'') +
																		' data-route-id="' + oJourney.routeID + '-' + thingToSee.id + '"' +
																		' data-destination-id="' + thingToSee.id + '">' +
																		sValue + '</td>');
															
													});

													var aXHTMLToDo = [];

													$.each(oJourney.destination.thingsToDo, function (j, thingToDo)
													{
														aXHTMLToDo.push('<div class="ns1blankspaceExperienceDoIt"' +
																		' id="ns1blankspaceExperienceJourneyDoIt-' + oJourney.routeID + '-' + thingToDo.id + '"' +
																		' data-doitid="' + thingToDo.id + '"' +
																		' data-route-id="' + oJourney.routeID + '">' + thingToDo.caption + '</div>');
													});

													if (oJourney.destination.populationCanReproduce == 'true' && bEdit)
													{
														aXHTMLToDo.push('<td class="ns1blankspaceExperienceDoSomething">' +
																		'<span class="ns1blankspaceExperienceDone"' +
																		' data-route-id="' + oJourney.routeID + '"' +
																		' data-id="' + oJourney.destination.populationAtRest[0]['id'] + '"' +
																		' data-xhtmlpopulateelementid="' + oJourney.xhtmlPopulateElementID +
																		'">Done</span></td>');
													}
														
													aHTML.push('<td>' + aXHTMLToDo.join('') + '</td></tr>');
												});

												aHTML.push('</table></div>');

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
												},									
																	
									populate: 	function (oParam) 
												{
													var oJourney = ns1blankspace.experience.journey.get(oParam);
													var oData = oJourney.destination.populationAtRest;

													var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
													var sPopulateWithID = ns1blankspace.util.getParam(oParam, 'populateWithID').value;

													var sXHTMLPopulateElementID = 'ns1blankspaceExperience-' + oJourney.routeID;

													if (oParam.populateID) {sXHTMLPopulateElementID = sXHTMLPopulateElementID + '-' + oParam.populateID}

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
											
													var sElementID = oJourney.xhtmlElementID;
													var sHTML = $('#' + sElementID).html();
													var iPopulateID = $('#' + sElementID).attr('data-populate-id');
													var sElementMutatedToID = sElementID + '-input';

													var bIsPopulateWith = ($.grep(oJourney.previousDestination.populateWith, function (a) {return (a.model == oJourney.destination.model)}).length != 0);

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
														sClass = 'ns1blankspaceExperiencePopulation';
													}

													sHTML = '<input style="width:100%;" id="' + sElementMutatedToID + '"' +
																' class="' + sClass + '" ' +
																(oJourney.destinationID?' data-destination-id="' + oJourney.destinationID + '"':'') +
																(oJourney.routeID?' data-route-id="' + oJourney.routeID + '"':'') +
																(iPopulateID?' data-populate-id="' + iPopulateID + '"':'') +
																			'value="' + sHTML + '">'
													
													$('#' + sElementID).html(sHTML);
													$('#' + sElementMutatedToID).focus();

													if (oJourney.destination.type == "select")
													{	
														ns1blankspace.experience.journey.space.lease(
														{
															nextTo: 2,
															xhtmlElementID: sElementMutatedToID
														});
													}
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
															if (oJourney.dataID == "new")
															{

															}	
															else
															{

															}
																
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

															if (oJourney.destination.type == 'text')
															{		
																oData[(oJourney.destination.model).split('.')[1] || oJourney.destination.model] = oPopulationAtWorkToBeRested.text;
																oPopulationBeingRested[oJourney.destination.model] = oPopulationAtWorkToBeRested.text;

																if ($.grep(oJourney.previousDestination.populateWith, function (a) {return (a.model == oJourney.destination.model)}).length == 0)
																{
																	bOKToRest = true;
																}
																else
																{
																	bOKToRest = (oJourney.previousDestination.populationAtWork[0].id == '');
																}
															}

															if (bOKToRest)
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

																if (oJourney.dataID == 'new' && oJourney.previousDestination.type == 'destination')
																{	
																	$.each(oJourney.previousDestination.populateWith, function (i, v)
																	{
																		oData[(v.model).split('.')[1] || v.model] = v.value;
																	});
																}
															}	
														}	

														ns1blankspace.debug.message(oPopulationBeingRested, true);

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
															if (oJourney.previousDestination.type == 'destination')
															{
																$('td.ns1blankspaceExperienceClose').html('');
															}
															else
															{
																$('#ns1blankspaceExperience-' + oJourney.sourceRouteID + '-new').text('Done');
																$('#ns1blankspaceExperience-' + oJourney.sourceRouteID + '-new').addClass('ns1blankspaceExperiencePopulate');
															}

															$('#ns1blankspaceExperience-' + oJourney.sourceRouteID + '-new-container [data-id="new"]').attr('data-id', oResponse.id)

															$('#ns1blankspaceExperience-' + oJourney.sourceRouteID + '-add').show();
															
															$.each(oJourney.previousDestination.populationAtWorkToBeRestedWhenCan, function (i, v)
															{
																$('#' + v.xhtmlElementID).closest('tr').css('background-color', '');
															});

															oJourney.previousDestination.populationAtWorkToBeRestedWhenCan = undefined;
															oJourney.previousDestination.populationAtRestIsNewBorn = (oResponse.notes == 'ADDED');

															oJourney.destination.populationAtWork = [oPopulationAtWorkToBeRested];

															var oPopulationBeingRested = ns1blankspace.util.getParam(oParam, 'populationBeingRested').value;

															if (oResponse.id) {oPopulationBeingRested.id = oResponse.id}

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
															}

															$('#' + oJourney.xhtmlElementID).val(oJourney.destination.populationAtWork[0].text);
															$('#' + oJourney.xhtmlElementID).html(oJourney.destination.populationAtWork[0].text);
														}
													}	
												}
								}
				}										
}