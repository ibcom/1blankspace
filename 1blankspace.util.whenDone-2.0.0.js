ns1blankspace.util.whenDone =
{
	init:		function (oParam)
				{
					var oManifest = ns1blankspace.util.getParam(oParam, 'manifest').value;

					$.each(oManifest.search, function(i, oSearch)
					{
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI(oSearch.method),
							data: JSON.stringify(oSearch.criteria),
							dataType: 'json',
							success: function(data)
							{
								ns1blankspace.util.whenDone.response(oParam, oSearch, data)
							}
						});
					});
				},

	response: 	function (oParam, oSearch, oResponse)
				{
					var oManifest = ns1blankspace.util.getParam(oParam, 'manifest').value;
					var oStore = ns1blankspace.util.toFunction(oManifest.store);
					oStore[oSearch.name] = oResponse.data.rows;
					ns1blankspace.util.whenDone.checkIfDone(oParam);
				},

	checkIfDone: 	
				function (oParam)
				{
					var oManifest = ns1blankspace.util.getParam(oParam, 'manifest').value;

					var iStoreLength = 0;
					var oStore = ns1blankspace.util.toFunction(oManifest.store);

					for (var key in oStore)
					{
    					if (oStore.hasOwnProperty(key))
    					{
    						iStoreLength++;
    					}
					}

					if (iStoreLength == oManifest.search.length)
					{
						ns1blankspace.util.execute(oManifest.execute, oParam)
					}
				}						
}	