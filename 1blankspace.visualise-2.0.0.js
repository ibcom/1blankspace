/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 * DEPENDECIES:
 *	/jscripts/d3.v3.min.js
 *	/jscripts/topojson.v1.min.js
 *	/jscripts/datamaps.world.min.js?v=1
 */
 
ns1blankspace.visualise = 
{
	data: 		{},

	options: 	{
					example: true
				},

	representations:
				[],

	initData: 	function (oParam)
				{
					oParam = ns1blankspace.util.setParam(oParam, 'initialised', true);
					ns1blankspace.visualise.init(oParam);
				},

	init: 		function (oParam)
				{
					var bInitialised = ns1blankspace.util.getParam(oParam, 'initialised', {"default": false}).value;
					ns1blankspace.visualise.options.example = ns1blankspace.util.getParam(oParam, 'example', {"default": true}).value;

					if (!bInitialised)
					{
						ns1blankspace.visualise.initData(oParam);
					}	
					else
					{	
						ns1blankspace.app.reset();

						ns1blankspace.objectName = 'visualise';
						ns1blankspace.viewName = 'Visualise';
		
						ns1blankspace.app.set(oParam);
					}
				},

	home:		function (oParam, oResponse)
				{
					
					var aHTML = [];
								
					aHTML.push('<table>');

					aHTML.push('<tr><td><div id="ns1blankspaceViewVisualiseLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

					aHTML.push('</table>');		
					
					aHTML.push('<table class="ns1blankspaceControl" style="padding-top:20px;">');
					
					$.each(ns1blankspace.visualise.representations, function()
					{
						var sName = (this.name).replace(/ /g,'')
						
						aHTML.push('<tr>' +
										'<td id="ns1blankspaceControl' + sName + '" class="ns1blankspaceControl"' +
												' data-method="' + this.method + '">' + this.name + '</td>' +
										'</tr>');	
					});
					
					if (ns1blankspace.visualise.options.example)
					{	
						aHTML.push('<tr><td class="ns1blankspaceControl ns1blankspaceSub" style="font-size:0.875em; border-bottom-style:solid; border-width: 0px; border-color: #D0D0D0;">' +
									'EXAMPLE</td></tr>');

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlSearch" class="ns1blankspaceControl">Search</td>' +
									'</tr>');

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlRenderUpdate" class="ns1blankspaceControl">Update</td>' +
									'</tr>');

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlRenderZoom" class="ns1blankspaceControl">Zoom</td>' +
									'</tr>');

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlRenderArc" class="ns1blankspaceControl">Arc</td>' +
									'</tr>');

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlRenderBubbles" class="ns1blankspaceControl">Bubbles</td>' +
									'</tr>');

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlRenderBubblesUpdate" class="ns1blankspaceControl ns1blankspaceSubNote">Update</td>' +
									'</tr>');
					}	

					aHTML.push('</table>');		
					
					$('#ns1blankspaceControl').html(aHTML.join(''));

					$('#ns1blankspaceControlSearch').click(function(event)
					{
						ns1blankspace.visualise.example();
					});

					$('#ns1blankspaceControlRenderUpdate').click(function(event)
					{
						var oData =
						{
							AUS: {fillKey: 'lt50' }
						}	

						ns1blankspace.visualise.provider.datamaps.render.choropleth({data: oData});
					});

					$('#ns1blankspaceControlRenderZoom').click(function(event)
					{
						ns1blankspace.visualise.provider.datamaps.render.zoom();
					});

					$('#ns1blankspaceControlRenderArc').click(function(event)
					{
						ns1blankspace.visualise.provider.datamaps.render.arc();
					});

					$('#ns1blankspaceControlRenderBubbles').click(function(event)
					{
						ns1blankspace.visualise.provider.datamaps.render.bubbles();
					});

					$('#ns1blankspaceControlRenderBubblesUpdate').click(function(event)
					{
						ns1blankspace.visualise.provider.datamaps.render.bubbles(
						{
							data:
							[
						    	{name: 'Hot Hot', latitude: 21.32, longitude: 5.32, radius: 50, fillKey: 'gt50'},
						    ]
						});
					});
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceVisualiseContainer" style="position: relative; width: 95%; max-height: 450px;"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					ns1blankspace.visualise.provider.datamaps.init({xhtmlElementContainerID: 'ns1blankspaceVisualiseContainer'});
				},

	example: 	function(oParam, oResponse)
				{
					if (oResponse === undefined)
					{
						ns1blankspace.status.working('Updating...');

						var oSearch = new AdvancedSearch();
						oSearch.method = 'CONTACT_BUSINESS_SEARCH';		
						oSearch.addField('tradename,streetcountry');
						oSearch.addFilter('streetcountry', 'IS_NOT_NULL')
						oSearch.rows = 100;
						oSearch.sort('tradename', 'desc');
						
						oSearch.getResults(function(data) {ns1blankspace.visualise.example(oParam, data)});	
					}	
					else
					{
						var oData = {};

						$.each(oResponse.data.rows, function(i, v)
						{
							oData[v.streetcountry] = {bank: v.tradename}
						});

						ns1blankspace.visualise.provider.datamaps.render.choropleth({data: oData});

						ns1blankspace.status.clear();
					}	
				},			

	provider:	{
					datamaps:
					{
						init: 	function(oParam)
								{
									var sXHTMLElementContainer = ns1blankspace.util.getParam(oParam, 'xhtmlElementContainerID', {"default": 'ns1blankspaceVisualiseContainer'}).value;
									var oOptions = ns1blankspace.util.getParam(oParam, 'options').value;
									var bLegend = ns1blankspace.util.getParam(oParam, 'legend', {"default": false}).value;
									var bLabels = ns1blankspace.util.getParam(oParam, 'labels', {"default": false}).value;

									if (oOptions === undefined && ns1blankspace.visualise.options.example)
									{
										oOptions =
										{
											element: document.getElementById('ns1blankspaceVisualiseContainer'),
									        scope: 'world',
									        projection: 'mercator',
									        legend: true,
 
									        fills:
									        {
									          	defaultFill: '#f0af0a',
									          	lt50: 'rgba(0,244,244,0.9)',
									          	gt50: 'blue',
									          	eq50: 'red'
									        },
									        
									        data:
									        {
									        	USA: {fillKey: 'gt50' },
									          	RUS: {fillKey: 'lt50' },
									          	CAN: {fillKey: 'lt50' },
									          	BRA: {fillKey: 'gt50' },
									          	ARG: {fillKey: 'gt50' },
									          	COL: {fillKey: 'gt50' },
									          	AUS: {fillKey: 'gt50' },
									          	ZAF: {fillKey: 'gt50' },
									          	MAD: {fillKey: 'gt50' }       
									        },	     
					       
					       					done: function(datamap)
					       					{
									            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography, data)
									            {
									                ns1blankspace.status.message(geography.properties.name);
									            });
									        },
					       
					       					geographyConfig:
					       					{
									            dataUrl: null,
									            hideAntarctica: true,
									            borderWidth: 1,
									            borderColor: '#FDFDFD',
									            popupTemplate: function(geography, data)
									            {
									            	return ns1blankspace.visualise.provider.datamaps.template.popup(geography, data)
									            },
									            popupOnHover: true,
									            highlightOnHover: true,
									            highlightFillColor: '#FC8D59',
									            highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
									            highlightBorderWidth: 2
									        }
									    }
									}    

									if (oOptions !== undefined)
									{	
										$('#' + sXHTMLElementContainer).empty();
										ns1blankspace.visualise.data.options = oOptions;
										ns1blankspace.visualise.data.choropleth = oOptions.data;
								    	ns1blankspace.visualise.data.map = new Datamap(oOptions);
								    	if (oOptions.legend) {ns1blankspace.visualise.data.map.legend()};
								    	if (oOptions.labels) {ns1blankspace.visualise.data.map.labels()};
								    }

								    if (bLegend) {ns1blankspace.visualise.data.map.legend()};
								    if (bLabels) {ns1blankspace.visualise.data.map.labels()};
								},

						template:
								{
									popup: 		function(geography, data)
									            {
									            	var aHTML = [];

									            	aHTML.push('<div class="hoverinfo">');

									            	aHTML.push('<strong>' + geography.properties.name + '</strong>');

									            	if (data !== null)
									            	{	
									            		if (data.bank !== undefined) {aHTML.push('<div>' + data.bank + '</div>')};
									            	}	

									            	aHTML.push('</div>');

									            	return aHTML.join('');
									            }
								},	

						render: {
									choropleth: function(oParam)
												{
													var oData = ns1blankspace.util.getParam(oParam, 'data').value;
													var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": false}).value;

													if (oData !== undefined)
													{	
														if (bRefresh)
														{
															ns1blankspace.visualise.data.choropleth = oData;
														}
														else
														{	
															ns1blankspace.visualise.data.choropleth = $.extend(true, ns1blankspace.visualise.data.choropleth, oData);
														}	
													}
												
													ns1blankspace.visualise.data.map.updateChoropleth(ns1blankspace.visualise.data.choropleth);
												},

									zoom: 		function()
												{
													ns1blankspace.visualise.data.options.setProjection = function(element)
											        {
													    var projection = d3.geo.equirectangular()
													      	.center([23, -3])
													     	.rotate([4.4, 0])
													      	.scale(400)
													      	.translate([element.offsetWidth / 2, element.offsetHeight / 2]);

													    var path = d3.geo.path()
													      	.projection(projection);
													    
													    return {path: path, projection: projection};
													}

													ns1blankspace.visualise.provider.datamaps.init({options: ns1blankspace.visualise.data.options})
												},			

									arc: 		function(oParam)
												{
													var oData = ns1blankspace.util.getParam(oParam, 'data').value;
												
													if (oData === undefined && ns1blankspace.visualise.options.example)
													{	
														oData =
														[
													       	{
													        	origin:
													        	{
													           	 	latitude: 3.639722,
													            	longitude: 73.778889
													       		},
													        	destination:
													        	{
													           	 latitude: 37.618889,
													            	longitude: -122.375
													       		}
													     	},
													     	{
													          	origin:
													         	{
													             	latitude: 30.194444,
													             	longitude: -97.67
													          	},
													         	destination:
													          	{
													              	latitude: 25.793333,
													              	longitude: -0.290556
													          	}
													     	}
													    ]
													}    

													if (oData !== undefined)
												   	{
														ns1blankspace.visualise.data.map.arc(
														oData,
													    {
													    	strokeWidth: 2
													    });
													}    
												},

									bubbles: 	function(oParam)
												{
													var oData = ns1blankspace.util.getParam(oParam, 'data').value;

													if (oData === undefined && ns1blankspace.visualise.options.example)
													{	
														oData =
														[
													    	{name: 'Hot', latitude: 21.32, longitude: 5.32, radius: 10, fillKey: 'gt50'},
													    	{name: 'Chilly', latitude: -25.32, longitude: 120.32, radius: 28, fillKey: 'ft50'},
													     	{name: 'Hot again', latitude: 21.32, longitude: -84.32, radius: 8, fillKey: 'gt50'}
													    ]
													}    	

												   	if (oData !== undefined)
												   	{	
														ns1blankspace.visualise.data.map.bubbles(
														oData,
													    {
													       	popupTemplate: function(geo, data)
													       	{
													        	return '<div class="hoverinfo">' + data.name + '</div>';
													       	}
													    });
													}    
												}
								}
					}				
				}			
}
