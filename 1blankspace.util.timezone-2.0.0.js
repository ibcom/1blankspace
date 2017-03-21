/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
*/	

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

ns1blankspace.util.timezone =
{
	data: 	{},

	init: 	{
					timezones: 	function (oParam, oResponse)
									{
										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'SETUP_TIMEZONE_SEARCH';
											oSearch.addField('title,notes');
											oSearch.sort('id', 'asc');
											oSearch.rows = 100;
											
											oSearch.getResults(function(oResponse)
											{
												ns1blankspace.util.timezone.init(oParam, oResponse)
											});
										}
										else
										{
											ns1blankspace.util.timezone.data.timezones = oResponse.data.rows;

										}
									}
				}					
}	