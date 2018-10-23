/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

ns1blankspace.util.convert =
{
	csvToJSON: function (oParam)
	{
		if (window.Papa != undefined)
		{
			var oData = ns1blankspace.util.getParam(oParam, 'data').value;
			var oResponse = ns1blankspace.util.getParam(oParam, 'response').value;
			var sCSV = oData;

			if (oResponse != undefined)
			{
				sCSV = oResponse.data;
			}
			
			if (sCSV != undefined)
			{
				var oPapa = Papa.parse(sCSV, {header: true})

				if (oResponse != undefined)
				{
					oResponse.data = {rows: oPapa.data, errors: oPapa.errors, meta: oPapa.meta}
				}
			}
		}
		else
		{
			oResponse = 'No parser (http://papaparse.com)'
		}

		return oResponse
	}
}	