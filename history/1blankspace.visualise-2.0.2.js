/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 * DEPENDECIES:
 *	/jscripts/d3.v3.min.js
 *	/jscripts/topojson.v1.min.js
 *	/jscripts/datamaps.world.min.js?v=1
 */
 
ns1blankspace.visualise = 
{
	data: 		{
					styles:
					{
						chart:
						[
						  	{
						        color: "#46BFBD",
						        highlight: "#5AD3D1",
						        series: "2"
						    },
						    {
						        color: "#949FB1",
						        highlight: "#A8B3C5",
						        series: "2"
						    },
							{
						        color:"#F7464A",
						        highlight: "#FF5A5E",
						       	series: "1"
						    },
						    {
						        color: "#FDB45C",
						        highlight: "#FFC870",
						        series: "1"
						    },
						   
						    {
						        color: "#4D5360",
						        highlight: "#616774",
						        series: "1"
						    }
						]
					},

					renderType:
					{
						vector: 1,
						pixel: 2
					}

				},

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

	render: 	function (oParam)
				{
					var sProvider = ns1blankspace.util.getParam(oParam, 'provider').value;
					var iRenderType = ns1blankspace.util.getParam(oParam, 'renderType', {"default": 1}).value;
					if (sProvider==undefined) {sProvider=(iRenderType==1?'c3':'chartjs')}

					if (ns1blankspace.visualise.provider[sProvider] == undefined)
					{
						ns1blankspace.status.error('Unknown provider: ' + sProvider);
					}
					else
					{	
						if (iRenderType = ns1blankspace.visualise.data.renderType.vector && !window.d3)
						{
							ns1blankspace.status.error('You need d3.');
						}
						else
						{
							ns1blankspace.visualise.provider[sProvider].render(oParam);
						}	
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

					aHTML.push('</table>');
					
					if (ns1blankspace.visualise.options.example)
					{	
						aHTML.push('<table class="ns1blankspaceControl" style="padding-top:5px;">');

						aHTML.push('<tr><td class="ns1blankspaceControl ns1blankspaceSub" style="font-size:0.875em; border-bottom-style:solid; border-width: 0px; border-color: #D0D0D0;">' +
									'D3</td></tr>');

						aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlD3Chart" class="ns1blankspaceControl">Chart</td>' +
									'</tr>');

						aHTML.push('</table>');

						aHTML.push('<table class="ns1blankspaceControl" style="padding-top:20px;">');

						aHTML.push('<tr><td class="ns1blankspaceControl ns1blankspaceSub" style="font-size:0.875em; border-bottom-style:solid; border-width: 0px; border-color: #D0D0D0;">' +
									'DATAMAPS</td></tr>');

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

						aHTML.push('</table>');	
					}	
					
					$('#ns1blankspaceControl').html(aHTML.join(''));

					$('#ns1blankspaceControlD3Chart').click(function(event)
					{
						ns1blankspace.visualise.provider.d3.chart();
					});

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
					d3:
					{
						chart: 	function(oParam)
								{
									var sXHTMLElementContainer = ns1blankspace.util.getParam(oParam, 'xhtmlElementContainerID', {"default": 'ns1blankspaceVisualiseContainer'}).value;

									$('#' + sXHTMLElementContainer).empty();

									var oData = [1,2,3,4];

									var oD3 = d3.select('#' + sXHTMLElementContainer);

									oD3.selectAll("div").data(oData)
									  	.enter().append('div')
									    .style('width', function(d) { return d * 10 + 'px'; })
									    .style('background-color', 'red')
									    .text(function(d) { return d; });
								}
					},

					datamaps:
					{
						init: 	function(oParam)
								{
									var sXHTMLElementContainer = ns1blankspace.util.getParam(oParam, 'xhtmlElementContainerID', {"default": 'ns1blankspaceVisualiseContainer'}).value;
									var oOptions = ns1blankspace.util.getParam(oParam, 'options').value;
									var bLegend = ns1blankspace.util.getParam(oParam, 'legend', {"default": false}).value;
									var bLabels = ns1blankspace.util.getParam(oParam, 'labels', {"default": false}).value;
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

								    ns1blankspace.util.onComplete(oParam);
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
					},

					chartjs:
					{
						data: 	{
									url: 'http://www.chartjs.org/docs',
									options:
									{ 
									    animation: true,
									    animationSteps: 60,
									    animationEasing: "easeOutQuart",
									    showScale: true,
									    scaleOverride: false,
									    scaleSteps: null,
									    scaleStepWidth: null,
									    scaleStartValue: null,
									    scaleLineColor: "rgba(0,0,0,.1)",
									    scaleLineWidth: 1,
									    scaleShowLabels: true,
									    scaleLabel: "<%=value%>",
									    scaleIntegersOnly: true,
									    scaleBeginAtZero: false,
									    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
									    scaleFontSize: 12,
									    scaleFontStyle: "normal",
									    scaleFontColor: "#666",
									    responsive: false,
									    maintainAspectRatio: true,
									    showTooltips: true,
									    customTooltips: false,
									    tooltipEvents: ["mousemove", "touchstart", "touchmove"],
									    tooltipFillColor: "rgba(0,0,0,0.8)",
									    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
									    tooltipFontSize: 14,
									    tooltipFontStyle: "normal",
									    tooltipFontColor: "#fff",
									    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
									    tooltipTitleFontSize: 14,
									    tooltipTitleFontStyle: "bold",
									    tooltipTitleFontColor: "#fff",
									    tooltipYPadding: 6,
									    tooltipXPadding: 6,
									    tooltipCaretSize: 8,
									    tooltipCornerRadius: 6,
									    tooltipXOffset: 10,
									    tooltipTemplate: "<%if (label){%><%=label%><%}%>",
									    multiTooltipTemplate: "<%= value %>",
									    onAnimationProgress: function(){},
									    onAnimationComplete: function(){}
									},    

									types:
									[
										{
											name: 'Line',
											datasets: true
										},
										{
											name: 'Bar',
											datasets: true
										},
										{
											name: 'HorizontalBar',
											datasets: true
										},
										{
											name: 'Radar',
											datasets: true
										},
										{
											name: 'PolarArea'
										},
										{
											name: 'Pie'
										},
										{
											name: 'Doughnut'
										},
										{
											name: 'DoughnutLabel'
										}
									]
								},

						render: function(oParam)
								{
									var sXHTMLElementContainer = ns1blankspace.util.getParam(oParam, 'xhtmlElementContainerID', {"default": 'ns1blankspaceVisualiseContainer'}).value;
									var oOptions = ns1blankspace.util.getParam(oParam, 'options', {"default": {}}).value;
									var bLegend = ns1blankspace.util.getParam(oParam, 'legend', {"default": false}).value;
									var bLabels = ns1blankspace.util.getParam(oParam, 'labels', {"default": false}).value;
									var sWidth = ns1blankspace.util.getParam(oParam, 'width', {"default": '300px'}).value;
									var sHeight = ns1blankspace.util.getParam(oParam, 'height', {"default": '300px'}).value;
									var aDataSets = ns1blankspace.util.getParam(oParam, 'datasets').value;
									var aLabels = ns1blankspace.util.getParam(oParam, 'labels').value;
									var sType = ns1blankspace.util.getParam(oParam, 'type').value;
									var sStyle = ns1blankspace.util.getParam(oParam, 'style', {"default": 'chart'}).value
									var bShowData = ns1blankspace.util.getParam(oParam, 'showData', {"default": 'true'}).value

									var oType = $.grep(ns1blankspace.visualise.provider.chartjs.data.types, function (type) {return type.name == sType})[0];
									var aStyles = ns1blankspace.util.getParam(oParam, 'styles', {"default": ns1blankspace.visualise.data.styles[sStyle]}).value
									var oData;

									if (oType.name == 'DoughnutLabel' && Chart.types.DoughnutLabel == undefined)
									{
										Chart.types.Doughnut.extend({
									        name: "DoughnutLabel",
									        draw: function() {
									            Chart.types.Doughnut.prototype.draw.apply(this, arguments);
									            var oContext = this.chart.ctx;
									            oContext.font = this.options.label.font;
									            oContext.fillStyle = (this.options.label.color || '#000000');
									            oContext.textBaseline = 'middle';
									            oContext.textAlign = 'center';
									           
									            var x = (this.chart.width)/2;
												var y = (this.chart.height)/2;

									            oContext.fillText(this.options.label.text, x, y);
									        }
									    });
									}	

									if (oType.datasets) //Multi series, ie Line chart
									{
										oData = {datasets: aDataSets, labels: aLabels}

										$.each(oData.datasets, function (i, dataset)
										{
											dataset = $.extend(dataset,
														{
															fillColor: aStyles[i].color,
															strokeColor: (aStyles[i].strokeColor || aStyles[i].color),
												            pointColor: (aStyles[i].strokeColor || aStyles[i].color),
												            pointStrokeColor: (aStyles[i].strokeColor || aStyles[i].color),
												            pointHighlightFill: aStyles[i].color,
												            pointHighlightStroke: aStyles[i].color
												          } );
										});

									    oOptions.legendTemplate = '<ul class=\"chartjs-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\">' +
									    							'</span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>';

									    if (aDataSets.length == 1) {bLegend = false}
															
									}
									else //Single series, ie Pie chart
									{
										oData = [];
										var fTotal;

										if (bShowData)
										{
											fDataTotal = _.reduce(aDataSets[0].data, function(memo, num){ return memo + num; }, 0);
										}	

										$.each(aLabels, function (i, label)
										{
											oData.push(
									   		{
									   			label: label + (bShowData?' <div style="font-size:0.75em; color:#939598;">' + aDataSets[0].data[i] + ', ' + (aDataSets[0].data[i]/fDataTotal*100).toFixed(0) + '%</div>':''),
										        value: aDataSets[0].data[i],
										        color: aStyles[i].color,
										        highlight: (aStyles[i].highlight || "#13B5EA")
										    })

										});

										oOptions.showTooltips = false;
										oOptions.tooltipTemplate = "<%if (label){%><%=label%><%}%>";
										oOptions.legendTemplate = '<ul class=\"chartjs-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\">' + 
																	'</span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>';
									}	    

									$('#' + sXHTMLElementContainer).html('<canvas id="' + sXHTMLElementContainer + '_chart" style="height:' + sHeight + '; width:' + sWidth + ';"></canvas>');

									var oContext = document.getElementById(sXHTMLElementContainer + "_chart").getContext("2d");
								
									var oChart = new Chart(oContext)[sType](oData, oOptions);

									if (bLegend)
									{
										if ($('#' + sXHTMLElementContainer + '_legend').length == 0)
										{
											$('#' + sXHTMLElementContainer + '_chart').after('<div id="' + sXHTMLElementContainer + '_legend"></div>');
										}

										$('#' + sXHTMLElementContainer + '_legend').html(oChart.generateLegend())
									}

									ns1blankspace.util.onComplete(oParam);
								}
					},

					c3:
					{
						data: 	{
									url: 'http://c3js.org',
									options: {},    
									types:
									[
										{
											name: 'line',
											datasets: true,
											type: 'line',
											legend: true
										},
										{
											name: 'bar',
											datasets: true,
											type: 'bar',
											legend: true
										},
										{
											name: 'bar_pie',
											datasets: false,
											type: 'bar',
											percentage: true,
											legend: false
										},
										{
											name: 'horizontalbar',
											datasets: true,
											type: 'bar',
											rotated: true,
											legend: true
										},
										{
											name: 'horizontalbar_pie',
											datasets: false,
											type: 'bar',
											rotated: true,
											percentage: true,
											legend: false
										},
										{
											name: 'radar',
											datasets: true,
											type: 'radar',
											legend: true
										},
										{
											name: 'polararea'
										},
										{
											name: 'pie',
											type: 'pie',
											legend: true
										},
										{
											name: 'doughnut',
											type: 'donut',
											legend: true
										},
										{
											name: 'donut',
											type: 'donut',
											legend: true
										},
										{
											name: 'doughnutlabel',
											type: 'donut',
											legend: true
										}
									]
								},

						render: function(oParam)
								{
									var sXHTMLElementContainer = ns1blankspace.util.getParam(oParam, 'xhtmlElementContainerID', {"default": 'ns1blankspaceVisualiseContainer'}).value;
									var oOptions = ns1blankspace.util.getParam(oParam, 'options', {"default": {}}).value;
									
									var bLabels = ns1blankspace.util.getParam(oParam, 'labels', {"default": false}).value;
									var sWidth = ns1blankspace.util.getParam(oParam, 'width', {"default": '300px'}).value;
									var sHeight = ns1blankspace.util.getParam(oParam, 'height', {"default": '300px'}).value;
									var aDataSets = ns1blankspace.util.getParam(oParam, 'datasets').value;
									var aLabels = ns1blankspace.util.getParam(oParam, 'labels').value;
									var sType = ns1blankspace.util.getParam(oParam, 'type').value;
									var sStyle = ns1blankspace.util.getParam(oParam, 'style', {"default": 'chart'}).value
									var bShowData = ns1blankspace.util.getParam(oParam, 'showData', {"default": 'true'}).value
									var sCaption = ns1blankspace.util.getParam(oParam, 'caption', {"default": ''}).value;

									var oType = $.grep(ns1blankspace.visualise.provider.c3.data.types, function (type) {return type.name == sType.toLowerCase()})[0];

									var aStyles = ns1blankspace.util.getParam(oParam, 'styles', {"default": ns1blankspace.visualise.data.styles[sStyle]}).value
									var oData = [];
									var oNames = {};
									var aCategories = [];
									var iSteps = aDataSets.length + 1;

									var bLegend = ns1blankspace.util.getParam(oParam, 'legend', {"default": oType.legend}).value;
								
									if (false && oType.datasets) //Multi series, ie Line chart
									{}
									else //Single series, ie Pie chart
									{
										var aSeries;
										var fTotal;

										if (oType.percentage)
										{
											$.each(aDataSets, function (d, dataset)
											{
												if (dataset.id==undefined) {dataset.id = 'data-' + d};
												dataset.name = (aLabels?aLabels[d]:(dataset.label || dataset.id));
												aCategories.push(dataset.name);

												if (d==0)
												{	
													dataset.series = [dataset.id].concat(dataset.data);
													oNames[dataset.id] = dataset.name;
												}
												else
												{
													aDataSets[0].data = aDataSets[0].data.concat(dataset.data);
													aDataSets[0].series = aDataSets[0].series.concat(dataset.data);
												}
											});

											aDataSets.length = 1;
											oData.push(aDataSets[0].series);
										}
										else
										{
											$.each(aDataSets, function (d, dataset)
											{
												if (dataset.id==undefined) {dataset.id = 'data-' + d};
												dataset.name = (aLabels?aLabels[d]:(dataset.label || dataset.id));
												dataset.series = [dataset.id].concat(dataset.data);
												oData.push(dataset.series);
												oNames[dataset.id] = dataset.name;
											});
										}	
									}

									if (bShowData)
									{
										fDataTotal = _.reduce(aDataSets[0].data, function(memo, num){ return memo + num; }, 0);
									}  

									//if (aDataSets.length == 1) {bLegend = false}

									$('#' + sXHTMLElementContainer).html('<div id="' + sXHTMLElementContainer + '_chart" style="height:' + sHeight + '; width:' + sWidth + ';"></div>');

									var oOptionsChart =
									{
										bindto: '#' + sXHTMLElementContainer + '_chart',
									    data:
									    {
									    	type : oType.type,
									        columns: oData,
									        names: oNames,
									        labels:
									        {
									            format: function (v, id, i, j)
									            		{
									            			return (oType.percentage?(v/fDataTotal*100).toFixed(0) + '%':v);
									            		}
									        },
									        order: null
									    },
									    donut:
									    {
									        title: sCaption
									    },
									    pie:
									    {
										  	label:
										  	{
										    	format: function (value, ratio, id) {
										      			return (ratio*100).toFixed(0) + '%';
										    	}
										  	}
										},
									    axis:
									    {
									        rotated: oType.rotated
									    },
									    legend:
									    {
									    	show: bLegend,
									      
									        position:'bottom',
									        inset: {
									            anchor: 'top-right',
									            x: 0,
									            y: 0,
									            step: iSteps 
									        }
									    },
									    color:
									    {
									        pattern: $.map(aStyles, function (style) {return style.color})
									    },
									    grid: {y: {show:false}},
									    padding: {right:30},
									    oninit: function () {}
									}

									/*
									        onclick: function (d, i) { console.log("onclick", d, i); },
									        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
									        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
									*/        

									if (oType.percentage)
									{
										oOptionsChart.axis.x = $.extend(true, oOptionsChart.axis.x, {type: 'category', categories: aCategories});
										oOptionsChart.tooltip = $.extend(true, oOptionsChart.tooltip,  {show: false});
									}
									else
									{
										oOptionsChart.axis.x = $.extend(true, oOptionsChart.axis.x, {show: !bLegend});
									}

									oOptions = $.extend(true, oOptionsChart, oOptions);
   
									var oChart = c3.generate(oOptions);

									$('#' + sXHTMLElementContainer + '_chart svg').attr('id', sXHTMLElementContainer + '_chart_svg');

									ns1blankspace.util.onComplete(oParam);
								}
					}			
				},

	util: 		{
					months: 	function (oParam)
								{
									var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
									var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;

									var dStartDate = moment(sStartDate, "DD MMM YYYY").startOf("month");
									var dEndDate = moment(sEndDate, "DD MMM YYYY").endOf("month");

									var aMonths = [];

									while (dStartDate.isBefore(dEndDate.add(1, "day")))
									{
									  	aMonths.push(
									  	{
									  		year: dStartDate.format("YYYY"),
									  		month: dStartDate.format("M"),
									  		name: dStartDate.format("MMMM"),
									  		shortName: dStartDate.format("MMM"),
									  		start: dStartDate.startOf("month").format("DD MMM YYYY"),
									  		end: dStartDate.endOf("month").format("DD MMM YYYY"),
									  		endName: dStartDate.endOf("month").format("DD MMM"),
									  		data: {}
									  	});
									  		
									  	dStartDate = dStartDate.add(1, "month");
									};

									return aMonths;
								}
				}			
}
