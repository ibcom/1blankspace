/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.visualise = 
{
	data: 		{},

	representations: [],

	initData: 	function (oParam)
				{
					oParam = ns1blankspace.util.setParam(oParam, 'initialised', true);
					ns1blankspace.visualise.init(oParam);
				},

	init: 		function (oParam)
				{
					var bInitialised = ns1blankspace.util.getParam(oParam, 'initialised', {"default": false}).value;

					if (!bInitialised)
					{
						ns1blankspace.report.initData(oParam);
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

					aHTML.push('<tr><td><div id="ns1blankspaceViewReportLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

					aHTML.push('</table>');		
					
					aHTML.push('<table>');
					
					$.each(ns1blankspace.visualise.representations, function()
					{
						var sName = (this.name).replace(/ /g,'')
						
						aHTML.push('<tr>' +
										'<td id="ns1blankspaceControl' + sName + '" class="ns1blankspaceControl"' +
												' data-method="' + this.method + '">' + this.name + '</td>' +
										'</tr>');	
					});
					
					aHTML.push('</table>');		
					
					$('#ns1blankspaceControl').html(aHTML.join(''));	
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceVisualiseContainer" class="ns1blankspaceMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					ns1blankspace.util.datamaps.init({xhtmlElementContainerID: 'ns1blankspaceVisualiseContainer'})
				},

	provider:	{
					datamaps:
					{
						init: 	function(oParam)
								{
									var sXHTMLElementContainer = ns1blankspace.util.getParam(oParam, 'xhtmlElementContainerID', {"default": 'ns1blankspaceVisualiseContainer'}).value;

									var oOptions =
									{
								        scope: 'world',
								        projection: 'mercator',
								        
								        fills:
								        {
								          	defaultFill: '#f0af0a',
								          	lt50: 'rgba(0,244,244,0.9)',
								          	gt50: 'blue'
								        },
								        
								        data:
								        {
								          USA: {fillKey: 'gt50' },
								          RUS: {fillKey: 'lt50' },
								          CAN: {fillKey: 'lt50' },
								          BRA: {fillKey: 'gt50' },
								          ARG: {fillKey: 'gt50'},
								          COL: {fillKey: 'gt50' },
								          AUS: {fillKey: 'gt50' },
								          ZAF: {fillKey: 'gt50' },
								          MAD: {fillKey: 'gt50' }       
								        },	     
				       
				       					done: function() {}, //callback when the map is done drawing
				       
				       					geographyConfig:
				       					{
								            dataUrl: null, //if not null, datamaps will fetch the map JSON (currently only supports topojson)
								            hideAntarctica: true,
								            borderWidth: 1,
								            borderColor: '#FDFDFD',
								            popupTemplate: function(geography, data)
								            { //this function should just return a string
								            	return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
								            },
								            popupOnHover: true, //disable the popup while hovering
								            highlightOnHover: true,
								            highlightFillColor: '#FC8D59',
								            highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
								            highlightBorderWidth: 2
								        },

								        bubbleConfig:
								        {
								            borderWidth: 2,
								            borderColor: '#FFFFFF',
								            popupOnHover: true,
								            popupTemplate: function(geography, data)
								            {
								              return '<div class="hoverinfo"><strong>' + data.name + '</strong></div>';
								            },
								            fillOpacity: 0.75,
								            highlightOnHover: true,
								            highlightFillColor: '#FC8D59',
								            highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
								            highlightBorderWidth: 2,
								            highlightFillOpacity: 0.85
								        }
								    }

								    $('#' + sXHTMLElementContainer).datamaps(oOptions);
								},

						render: {
									arc: 		function(oParam)
												{
													var sXHTMLElementContainer = ns1blankspace.util.getParam(oParam, 'xhtmlElementContainer', {"default": 'ns1blankspaceDataMapContainer'}).value;
													
													$('#' + sXHTMLElementContainer).arc(
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
												    ],
												    {
												    	strokeWidth: 2
												    });
												},

									bubbles: 	function(oParam)
												{
													var sXHTMLElementContainer = ns1blankspace.util.getParam(oOption, 'xhtmlElementContainer', {"default": 'ns1blankspaceDataMapContainer'}).value;
													
													$('#' + sXHTMLElementContainer).bubbles(
													[
												    	{name: 'Hot', latitude: 21.32, longitude: 5.32, radius: 10, fillKey: 'gt50'},
												    	{name: 'Chilly', latitude: -25.32, longitude: 120.32, radius: 28, fillKey: 'ft50'},
												     	{name: 'Hot again', latitude: 21.32, longitude: -84.32, radius: 8, fillKey: 'gt50'},
												    ],
												    {
												       	popupTemplate: function(geo, data)
												       	{
												        	return "<div class='hoverinfo'>It is " + data.name + "</div>";
												       	}
												     });
												}			
								}		
				}			
}
