/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 * Examplea: 	http://jsfiddle.net/xzZ7n/1/
 * 				https://github.com/MrRio/jsPDF/blob/master/examples/basic.html
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

ns1blankspace.util.pdf =
{
	data: 		{},

	exists: 	function (oParam)
				{
					return ('jsPDF' in window);
				},

	header:		function (oParam)
				{
					//To be implemented
					var sXHTML = ns1blankspace.util.getParam(oParam, 'xhtml').value;
				},

	footer:		function (oParam)
				{
					//To be implemented
					var sXHTML = ns1blankspace.util.getParam(oParam, 'xhtml').value;
				},				

	create: 	function (oParam)
				{
					var bLocal = ns1blankspace.util.getParam(oParam, 'saveLocal', {"default": false}).value;
					var sFilename = ns1blankspace.util.getParam(oParam, 'filename', {"default": ns1blankspace.util.uuid() + '.pdf'}).value;

					ns1blankspace.util.pdf.process = new jsPDF('p', 'pt', 'letter');
				   
				  	var oXHTML = ns1blankspace.util.getParam(oParam, 'xhtml', {"default": '<i>No content.</i>'}).value;

				    var oElementHandlers =
				    {
				        "#skip": 	function (element, renderer)
							    	{
							            return true
							        }    
				    };

				    var oMargins =
				    {
				        top: 80,
				        bottom: 60,
				        left: 40,
				        width: 522
				    };

				    ns1blankspace.util.pdf.process.fromHTML(
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
									ns1blankspace.util.pdf.process.save(sFilename);
								}
								else
								{
									ns1blankspace.util.pdf.data = ns1blankspace.util.pdf.process.output();

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
					    },
					    oMargins
					);
				},

	persist: 	function (oParam)
				{
					var sFilename = ns1blankspace.util.getParam(oParam, 'filename', {"default": ns1blankspace.util.uuid() + '.pdf'}).value;

					var oData =
					{
						filedata: ns1blankspace.util.pdf.data,
						filename: sFilename
					}

					if (ns1blankspace.util.getParam(oParam, 'object').exists)
					{
						oData.object = ns1blankspace.util.getParam(oParam, 'object').value;
					}

					if (ns1blankspace.util.getParam(oParam, 'objectcontext').exists)
					{
						oData.objectcontext = ns1blankspace.util.getParam(oParam, 'objectcontext').value;
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