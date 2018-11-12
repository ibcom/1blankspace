/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}
if (ns1blankspace.util.site === undefined) {ns1blankspace.util.site = {}}
if (ns1blankspace.util.site.invoice === undefined) {ns1blankspace.util.site.invoice = {}}

$(document).ready(function()
{  
    var aContext = [];
    var oContext = {};

    if (window.mydigitalstructureContextId != undefined && window.mydigitalstructureContextId != '')
    {
        aContext = window.mydigitalstructureContextId.split('|'); 
    }
    else if (window.location.hash != '')
    {
        aContext = window.location.hash.replace('#', '').split('|');
    }

    $.each(aContext, function (c, context)
    {
        oContext[context.split('=')[0]] = context.split('=')[1]
    })

    ns1blankspace.util.site.invoice.data = {context: oContext};
});

ns1blankspace.util.site.invoice =
{
    data: {_publicKey: undefined, option: {autoReceipt: true}},

    init: function (oParam)
    {    
        if (window.location.protocol == 'http:')
        {
            window.location.href = window.location.href.replace('http', 'https')
        }
        else
        {
            ns1blankspace.util.site.invoice.search(oParam);
        }    
    },

    error: function (sError)
    {
        console.log(sError)
    },

    
    search: function (oParam, oResponse)
    {
        var sGUID = 'f3eb5f6b-1bf5-4e8b-846f-7836b72b7f85';
        var sAccessToken = '4913|296bdc372f1880cb458a84f8f345ac04';

        if (oResponse == undefined)
        {
            // data: 'access_token=' + sAccessToken +
            //            '&criteria={"fields":[{"name":"reference"}],"filters":[{"name":"guid","comparison":"EQUAL_TO","value1":"' + sGUID + '"}]' +
            //            ',"customoptions":[ {"name": "guid", "value": "' + sGUID + '" }]}',
            //    dataType: 'json',

            $.ajax(
            {
                type: 'POST',
                url: '/rpc/financial/?method=FINANCIAL_INVOICE_SEARCH&advanced=1',
                data: 'access_token=' + sAccessToken +
                        '&criteria={"fields":[{"name":"reference"}]' +
                        ',"customoptions":[ {"name": "guid", "value": "' + sGUID + '" }]}',
                dataType: 'json',
                success: function (data)
                {
                    ns1blankspace.util.site.invoice.search(oParam, data);
                }
            });
        }
        else
        {
            if (oResponse.status == 'ER')
            {
                ns1blankspace.util.site.invoice.error(oResponse.error.errornotes)
            }
            else
            {
                
            }
        }    
    }
}




