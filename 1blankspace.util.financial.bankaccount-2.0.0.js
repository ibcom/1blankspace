/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 * http://docs.mydigitalstructure.com/gettingstarted_authentication_sso
 *
 * https://github.com/jch/saml
 * btoa('<?xml version="1.0"?><samlp:AuthnRequest ID="_abc123" IssueInstant="2014-09-17T20:53:21" Version="2.0"></samlp:AuthnRequest>')
 *
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}
if (ns1blankspace.util.financial === undefined) {ns1blankspace.util.financial = {}}

ns1blankspace.util.financial.bankAccounts =
{
    link: 
    {
        init:  function (oParam, oResponse)
        {
            if (oResponse == undefined)
            {
                var oSearch = new AdvancedSearch();
                oSearch.method = 'SETUP_EXTERNAL_USER_ACCESS_SEARCH';     
                oSearch.addField('createddate,etag');
                oSearch.addFilter('userlogon', 'EQUAL_TO', 'Yodlee');
                oSearch.getResults(function(data) {ns1blankspace.util.financial.bankAccounts.link.init(oParam, data)});
            }
            else
            {
                var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceSummaryColumn2AccountLinking'}).value;
                var aHTML = [];

                aHTML.push('<table class="ns1blankspace">');
                    
                aHTML.push('<tr><td class="ns1blankspaceHeaderCaption">TRANSACTION IMPORTING</td></tr>');

                if (oResponse.data.rows.length != 0)
                {
                    aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-top:6px;">You have automatic bank transaction importing enabled.</td></tr>');

                    aHTML.push('<tr><td class="ns1blankspaceAction" style="font-size:0.625em; padding-top:12px;"><span id="ns1blankspaceSetupFinancialsBankingLinkingDisable" data-id="' + oResponse.data.rows[0].id + '">Disable</span></td></tr>');

                    aHTML.push('<tr><td class="ns1blankspaceAction" style="font-size:0.625em; padding-top:12px;"><span id="ns1blankspaceSetupFinancialsBankingLinkingAccounts" data-id="' + oResponse.data.rows[0].id + '">Link Accounts</span></td></tr>');

                    aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-top:12px;">When you click this button a Yodlee webpage will open and you can then add your banking credentials.  Once complete, just close it and come back to this page.</td></tr>');

                     aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-top:12px;">Bank transactions will then start to be imported into your space, it can take up to 24 hours for the importing start.  You can view the transactions in the "Import" section of any matching bank accounts you have setup in this space.</td></tr>');

                    aHTML.push('<tr><td class="ns1blankspaceAction" style="font-size:0.625em; padding-top:12px;"><div id="ns1blankspaceSetupFinancialsBankingLinkingAccountsContainer"></div></td></tr>');
                }
                else
                {
                    aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-top:6px;">If you use one of the following providers to manage your bank accounts, you can get transactions automatically imported into your space;</td></tr>');

                    aHTML.push('<tr><td class="ns1blankspaceSubNote"><ul><li>Westpac<li>St George<li>NAB<li>ANZ<li>CBA<li>AMEX (Australia)</ul></td></tr>');

                    aHTML.push('<tr><td class="ns1blankspaceSubNote">The transactions are imported using the <a href="yodlee.com" target="_blank">Yodlee</a> service and at no time do we have access to your online bank credentials.</td></tr>');

                    aHTML.push('<tr><td class="ns1blankspaceAction" style="font-size:0.625em; padding-top:12px;"><span id="ns1blankspaceSetupFinancialsBankingLinkingEnable">Enable</span></td></tr>');
                }

                $('#' + sXHTMLElementID).html(aHTML.join(''));

                $('#ns1blankspaceSetupFinancialsBankingLinkingEnable').button(
                {
                    label: "Enable"
                })
                .click(function()
                {
                     ns1blankspace.util.financial.bankAccounts.link.enable();
                });

                $('#ns1blankspaceSetupFinancialsBankingLinkingDisable').button(
                {
                    label: "Disable"
                })
                .click(function()
                {
                    var sID = $(this).attr('data-id');
                    ns1blankspace.util.financial.bankAccounts.link.disable({id: sID});
                });

                 $('#ns1blankspaceSetupFinancialsBankingLinkingAccounts').button(
                {
                    label: "Link bank accounts using Yodlee"
                })
                .click(function()
                {
                    ns1blankspace.util.financial.bankAccounts.link.accounts.init();
                });   
            }
        },

        disable: function (oParam, oResponse)
        {
            var sID = ns1blankspace.util.getParam(oParam, 'id').value;

            ns1blankspace.status.working();

            var oData =
            {
                remove: 1,
                id: sID
            }
            
            $.ajax(
            {
                type: 'POST',
                url: ns1blankspace.util.endpointURI('SETUP_EXTERNAL_USER_ACCESS_MANAGE'),
                data: oData,
                dataType: 'json',
                success: function()
                {
                    ns1blankspace.util.financial.bankAccounts.link.init();
                    ns1blankspace.status.message('Disabled');
                }
            });
        },

        enable: function (oParam, oResponse)
        {
            var iYodleeUser = 37059;
            if (ns1blankspace.option.yodlee != undefined)
            {
                if (ns1blankspace.option.yodlee.user != undefined)
                {
                    iYodleeUser = ns1blankspace.option.yodlee.user
                }    
            }

            var oData =
            {
                user: iYodleeUser,
                type: 5,
                unrestrictedaccess: 'N',
                targetuser: ns1blankspace.user.id
            }

            $.ajax(
            {
                type: 'POST',
                url: ns1blankspace.util.endpointURI('SETUP_EXTERNAL_USER_ACCESS_MANAGE'),
                data: oData,
                dataType: 'json',
                success: function()
                {
                    ns1blankspace.util.financial.bankAccounts.link.register.init();
                    ns1blankspace.status.message('Enabled');
                }
            });
        },

        register:
        {
            init: function (oParam, oResponse)
            {
                if (oResponse == undefined)
                {
                    var oSearch = new AdvancedSearch();
                    oSearch.method = 'SETUP_EXTERNAL_USER_ACCESS_SEARCH';     
                    oSearch.addField('createddate,etag');
                    oSearch.addFilter('userlogon', 'EQUAL_TO', 'Yodlee');
                    oSearch.getResults(function(data) {ns1blankspace.util.financial.bankAccounts.link.register.init(oParam, data)});
                }
                else
                {
                    if (oResponse.data.rows.length != 0)
                    {
                        var sYodleeProxyURL = 'http://127.0.0.1:3000';
                        if (ns1blankspace.option.yodlee != undefined)
                        {
                            if (ns1blankspace.option.yodlee.proxyURL != undefined)
                            {
                                sYodleeProxyURL = ns1blankspace.option.yodlee.proxyURL
                            }    
                        }

                        $.ajax(
                        {
                            type: 'GET',
                            url: sYodleeProxyURL + '/_register/' + oResponse.data.rows[0].etag,
                            dataType: 'json',
                            global: false,
                            success: function()
                            {
                                ns1blankspace.util.financial.bankAccounts.link.init();
                            }
                        });
                    }    
                }
            }
        },

        accounts:
        {
            init: function (oParam, oResponse)
            {
                if (oResponse == undefined)
                {
                    var oSearch = new AdvancedSearch();
                    oSearch.method = 'SETUP_EXTERNAL_USER_ACCESS_SEARCH';     
                    oSearch.addField('createddate,etag');
                    oSearch.addFilter('userlogon', 'EQUAL_TO', 'Yodlee');
                    oSearch.getResults(function(data) {ns1blankspace.util.financial.bankAccounts.link.accounts.init(oParam, data)});
                }
                else
                {
                    if (oResponse.data.rows.length != 0)
                    {
                        var sYodleeProxyURL = 'http://127.0.0.1:3000';
                        if (ns1blankspace.option.yodlee != undefined)
                        {
                            if (ns1blankspace.option.yodlee.proxyURL != undefined)
                            {
                                sYodleeProxyURL = ns1blankspace.option.yodlee.proxyURL
                            }    
                        }

                        $.ajax(
                        {
                            type: 'GET',
                            url: sYodleeProxyURL + '/_accesstokens/' + oResponse.data.rows[0].etag,
                            dataType: 'json',
                            global: false,
                            success: function(data)
                            {
                                ns1blankspace.util.financial.bankAccounts.link.accounts.show(
                                {
                                    userSession: data.userSession,
                                    token: data.token
                                });
                            }
                        });
                    }    
                }
            },

            show: function (oParam)
            {
                var sXHMTLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceSetupFinancialsBankingLinkingAccountsContainer'}).value;

                var bUseFrame = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": false}).value;

                ns1blankspace.status.working('Initialising...');

                var aHTML = [];

                aHTML.push('<form action="https://quickstartaunode.yodlee.com.au/authenticate/quickstartau3/?channelAppName=quickstartau" method="post"' +
                                ' name="ns1blankspaceLinkApp" id="ns1blankspaceLinkApp" target="ns1blankspaceBankAccountLinkingContainer" style="display: none">' +
                                ' <input type="text" name="app" id="finappId" value="10003600" />' +
                                ' <input type="text" name="redirectReq" value="true" />' +
                                ' <input type="text" name="rsession" id="rsession" value="' + oParam.userSession + '" />' +
                                ' <input type="text" name="token" value="' + oParam.token + '" id="token" />' +
                                ' <input type="text" name="extraParams" id="extraParams" value=""/>' +
                            '</form>');

                if (bUseFrame)
                {
                    aHTML.push('<div style="width:100%">' +
                                '<iframe name="ns1blankspaceBankAccountLinkingContainer" ' +
                                'id="ns1blankspaceBankAccountLinkingContainer" frameborder="0" border="0" scrolling="auto"' +
                                ' style="min-height:800px; width:90%;"></iframe></div>');
                }

                $('#' + sXHMTLElementID).html(aHTML.join(''));
            
                document.getElementById('ns1blankspaceLinkApp').submit();

                ns1blankspace.status.clear();
            }
        }    
    },   

    test:   function ()
    {
        /*

        <form action="https://quickstartaunode.yodlee.com.au/authenticate/quickstarta3/?channelAppName=quickstartau" method="POST"><input type="text" name="app" value="10003600" /><input type="text" name="rsession" value="04062017_0:c143c88e61db2e09c1fdf2ceae86d49f22a12544c814c0f28a7fa49d3dece7e2ac7cfae3e7e5d62cfd171e6224cdddeef0d7f068010515917b67922f8fbacd15"/><input type="text" name="token" value="35f9e47d8a7d88c1439b67c11f6df362a32d6f49ed897c4172f574eddd992e2f"/><input type="text" name="redirectReq" value="true"/><input type="submit" name="submit" /></form>

        ns1blankspace.util.financial.bankAccounts.link({}, {userSession: '04062017_1:294182dcbbc6dc26e377416de2594730967d4965f49ec0c9f8bb827d8a3830ce809aa663d94476560d5ebe023ab711cdf7592da7652a6243e1d8198e9270bd54', appToken: 'f654a91d86475679b295ce28a2b7a591001c9f6c3510bbf96aa8dd8cf9192f8e'}) 

        lambda-local -f app.js -c settings-private.json -e event-user-accesstokens.json

        ns1blankspace.util.financial.bankAccounts.link.show({},
        {
        userSession: '04062017_0:337de4145a7f8a22c64267869aa75db84febb1c33de7d6050fc8d7ed29c39a0b708baef3a4e6fd9ef623e08b43390f5bc0ed1b6af7b6d5bc684e6428d4ce5ad8',
        appToken: '6904683be6960bf4ef1d259315284d005582c000a0a5718d8488e836d2331b7c'
        })

        */
    }              
}