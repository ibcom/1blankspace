/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 * Example code: 	http://jsfiddle.net/xzZ7n/1/
 * 					https://github.com/MrRio/jsPDF/blob/master/examples/basic.html
 *
 * Example usage:
 *				ns1blankspace.util.pdf.create(
 				{
 					saveToFile: true,
 					saveLocal: true,
 					xhtmlContainerElementID:,
 					setURI:,
 					openURI:,
 					object:,
 					objectContext:,
 					filename: 'file.pdf',
 					pageFormat: 'a4',
 					unit: 'pt',
 					margins:
 					{
				        top: 25,
				        bottom: 25,
				        left: 40,
				        width: 150
 					},
 					properties: 
 					{
						title:,
						subject:,
						author:,
						keywords:,
						generated:,
						creator:
 					}
 					xhtml: '<header>Header</header><div style="margin-top:20px;">Hello I am a PDF.</div><footer>Page <span class="pageCounter"></span> of <span class="totalPages"></span></footer>'
 				});
 
 *				1. if filename missing; a filename is generated using UUID.
 * 				2. margin: units as per the unit: value [default: pt]
 *
 * 				ns1blankspace.util.pdf.create(
 				{
 					xhtml: '<header>Header</header><div style="margin-top:20px;">Hello I am a PDF.</div><footer>Page <span class="pageCounter"></span> of <span class="totalPages"></span></footer>'
 				});
 *
 * Example xhtml:
 *				<header>
 *				<footer>
 * 				<span class="pageCounter">
 * 				<span class="totalPages">
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

ns1blankspace.util.pdf =
{
	data: 		{
					pageFormats:
					[
						'a0', 'a1',
						'a2', 'a3',
						'a4', 'a5',
						'a6', 'a7',
						'a8', 'a9',
						'a10', 'b0',
						'b1', 'b2',
						'b3', 'b4',
						'b5', 'b6',
						'b7', 'b8',
						'b9', 'b10',
						'c0', 'c1',
						'c2', 'c3',
						'c4', 'c5',
						'c6', 'c7',
						'c8', 'c9',
						'c10', 'dl',
						'letter',
						'government-letter',
						'legal' ,
						'junior-legal',
						'ledger',
						'tabloid',
						'credit-card'
					],
					orientations: 	['portrait', 'landscape'],
					units: 			['pt','mm','cm', 'in']
				},

	exists: 	function (oParam)
				{
					return ('jsPDF' in window);
				},

	create: 	function (oParam)
				{
					var bLocal = ns1blankspace.util.getParam(oParam, 'saveLocal', {"default": false}).value;
					var sFilename = ns1blankspace.util.getParam(oParam, 'filename', {"default": ns1blankspace.util.uuid() + '.pdf'}).value;
					var sOrientation = ns1blankspace.util.getParam(oParam, 'orientation', {"default": 'portrait'}).value;
					var sUnit = ns1blankspace.util.getParam(oParam, 'unit', {"default": 'pt'}).value;
					var sPaperSize = ns1blankspace.util.getParam(oParam, 'paperSize', {"default": 'a4'}).value;
					var oMargins = ns1blankspace.util.getParam(oParam, 'margins', {"default":  {top: 40, bottom: 60, left: 25, width: 500}}).value;
					var oElementHandlers = ns1blankspace.util.getParam(oParam, 'elementHanders').value;

					ns1blankspace.util.pdf.factory = new jsPDF(sOrientation, sUnit, sPaperSize);
				   
				  	var oXHTML = ns1blankspace.util.getParam(oParam, 'xhtml', {"default": '<i>No content.</i>'}).value;

				    if (oElementHandlers == undefined)
				    {	
				    	oElementHandlers =
					    {
					        '.skip': 	function (element, renderer)
								    	{
								            return true
								        }    
					    }
					} 

				    if (ns1blankspace.util.getParam(oParam, 'properties').exists)
				    {
					    ns1blankspace.util.pdf.factory.setProperties(ns1blankspace.util.getParam(oParam, 'properties').value);
					}	

				    ns1blankspace.util.pdf.factory.fromHTML(
				   	 	oXHTML,
				   	 	oMargins.left, 
				    	oMargins.top,
					    { 
					        'width': oMargins.width,
					        'elementHandlers': oElementHandlers
					    },
					    function (dispose)
					    {
					    	if (ns1blankspace.util.getParam(oParam, 'saveToFile').exists)
					    	{
					    		if (bLocal)
								{
									ns1blankspace.util.pdf.factory.save(sFilename);
								}
								else
								{
									ns1blankspace.util.pdf.data.raw = ns1blankspace.util.pdf.factory.output();

						    		if (ns1blankspace.util.getParam(oParam, 'whenCan').exists)
						    		{
						    			ns1blankspace.util.whenCan.execute(
										{
											now:
											{
												method: ns1blankspace.util.pdf.persist,
												param: oParam
											},
											then:
											{
												comment: 'pdfCreate',
												method: ns1blankspace.util.getParam(oParam, 'whenCan').value,
												set: 'downloadLink',
												param: oParam
											}	
										});
						    		}
						    		else
						    		{
						    			ns1blankspace.util.pdf.persist(oParam);
						    		}
						    	}	
					    	}
					    	else
					    	{
					    		ns1blankspace.util.pdf.data.raw = ns1blankspace.util.pdf.factory.output('datauristring');

					    		if (ns1blankspace.util.getParam(oParam, 'setURI').value)
					    		{
					    			window.location.href = ns1blankspace.util.pdf.data.raw
					    		}
					    		else if (ns1blankspace.util.getParam(oParam, 'openURI').value)
					    		{
					    			window.open(ns1blankspace.util.pdf.data.raw)
					    		}
					    		else if (ns1blankspace.util.getParam(oParam, 'xhtmlContainerElementID').exists)
					    		{
					    			$('#' + ns1blankspace.util.getParam(oParam, 'xhtmlContainerElementID').value).attr('src', ns1blankspace.util.pdf.data.raw);
					    		}
					    		else
					    		{
					    			ns1blankspace.util.whenCan.complete(ns1blankspace.util.pdf.data.raw, oParam);
					    		}	
					    	}
					    },
					    oMargins
					);
				},

	persist: 	function (oParam)
				{
					var sFilename = ns1blankspace.util.getParam(oParam, 'filename', {"default": ns1blankspace.util.uuid() + '.pdf'}).value;

					var oData =
					{
						filedata: ns1blankspace.util.pdf.data.raw,
						filename: sFilename
					}

					if (ns1blankspace.util.getParam(oParam, 'object').exists)
					{
						oData.object = ns1blankspace.util.getParam(oParam, 'object').value;
					}

					if (ns1blankspace.util.getParam(oParam, 'objectContext').exists)
					{
						oData.objectcontext = ns1blankspace.util.getParam(oParam, 'objectContext').value;
					}

					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('CORE_FILE_MANAGE'),
						data: oData,
						dataType: 'json',
						success: function(oResponse)
						{
							if (oResponse.status == 'OK')
							{	
								ns1blankspace.debug.message(oResponse.link, true)
								return ns1blankspace.util.whenCan.complete(oResponse.link, oParam);
							}	
						}
					});
				}			
}	