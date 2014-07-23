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
					var sXHTML = ns1blankspace.util.getParam(oParam, 'xhtml', {"default": false}).value;


				},

	footer:		function (oParam)
				{
					var sXHTML = ns1blankspace.util.getParam(oParam, 'xhtml', {"default": false}).value;


				},				

	create: 	function (oParam)
				{
					ns1blankspace.util.pdf.process = new jsPDF('p', 'pt', 'letter');
				   
				    var source = $('#customers')[0];
				    var sHTML = 'Hello World';

				    var specialElementHandlers =
				    {
				        // element with id of "bypass" - jQuery style selector
				        '#bypassme': function (element, renderer) {
				            // true = "handled elsewhere, bypass text extraction"
				            return true
				        }
				    };

				    var margins =
				    {
				        top: 80,
				        bottom: 60,
				        left: 40,
				        width: 522
				    };

				    ns1blankspace.util.pdf.process.fromHTML(
				   	 	sHTML,
				   	 	margins.left, 
				    	margins.top,
					    { 
					        'width': margins.width,
					        'elementHandlers': specialElementHandlers
					    },
					    function (dispose)
					    {
					    	ns1blankspace.util.pdf.data = ns1blankspace.util.pdf.process.output();

					    	if (ns1blankspace.util.getParam(oParam, 'saveToFile').exists)
					    	{
					    		if (ns1blankspace.util.getParam(oParam, 'whenCan').exists)
					    		{
					    			ns1blankspace.util.whenCan.execute(
									{
										now:
										{
											method: ns1blankspace.util.pdf.file,
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
					    			ns1blankspace.util.pdf.file(oParam);
					    		}	
					    	}
					    },
					    margins
					);
				},

	file: 		function (oParam)
				{
					var bLocal = ns1blankspace.util.getParam(oParam, 'saveLocal', {"default": false}).value;
					var sFilename = ns1blankspace.util.getParam(oParam, 'filename', {"default": ns1blankspace.util.uuid() + '.pdf'}).value;

					if (bLocal)
					{
						ns1blankspace.util.pdf.process.save(sFilename);
					}
					else
					{	
						var oData =
						{
							filedata: ns1blankspace.util.pdf.data,
							filename: 'test.pdf'
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
}	