/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 * http://docs.mydigitalstructure.com/community_authentication_msal
 *
 * https://github.com/AzureAD/microsoft-authentication-library-for-js
 * <script src="https://secure.aadcdn.microsoftonline-p.com/lib/1.0.0/js/msal.js"></script>
 *
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

var oMSALInstance;

//store token on myds for silent logon

ns1blankspace.util.msal =
{
    configs:
    [
        {
            tenant: 'singletouchsandbox.onmicrosoft.com/b2c_1_singletouch',
            auth:
            {
                clientId: '25859eef-b92a-49dc-b18e-416aba48ee4b',
                authority: 'https://login.microsoftonline.com/tfp/singletouchsandbox.onmicrosoft.com/b2c_1_singletouch'
            },
            cache:
            {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: true
            },
            scopes:
            [
                "https://singletouchsandbox.onmicrosoft.com/mydigitalstructure/user_impersonation",
                "https://singletouchsandbox.onmicrosoft.com/mydigitalstructure/read"
            ],
            apiURI: 'https://sandbox-api.singletouch.com.au/api/STPEvent2018',
            okToSend: function (oParam)
            {
                var bOKToSend = $('#ns1blankspaceMSALSendDeclaration').prop('checked');

                if (bOKToSend)
                {
                    bOKToSend = ($('#ns1blankspaceMSALSendName').val() != '')
                }

                $('#ns1blankspaceMSALSend').css('display',(bOKToSend?'block':'none'));
            },
            tokenAcquired: function (oToken)
            {
                location.href = location.origin + '/#/base64:' + window.btoa('financial.payroll/' + ns1blankspace.util.msal._param.context + ',showTotals:true,msalAccessToken:' + oToken.accessToken)
            }
        },
        {
            tenant: 'singletouch.onmicrosoft.com/b2c_1_singletouch',
            auth:
            {
                clientId: '198014d6-e28f-4835-b02e-1e5005df667d',
                authority: 'https://login.microsoftonline.com/tfp/singletouch.onmicrosoft.com/b2c_1_singletouch'
            },
            cache:
            {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: true
            },
            scopes:
            [
                'https://singletouch.onmicrosoft.com/mydigitalstructure/read',
                'https://singletouch.onmicrosoft.com/mydigitalstructure/user_impersonation'
            ],
            apiURI: 'https://api.singletouch.com.au/api/STPEvent2018'
        }
    ],

    init: function (oParam)
    {
        var sURIContext = location.hash;

        if (sURIContext.substr(0, 6) == '#msal:')
        {
            sURIContext = window.atob(sURIContext.replace('#msal:', ''));
            oParam = JSON.parse(sURIContext);
        }

        ns1blankspace.util.msal._param = oParam;

        var oConfig = oParam.config;
        var oEndpoint = oParam.endpoint;
        var sTenant = oParam.tenant;
        var bAutoSignIn = true;
       
        if (sTenant != undefined)
        {
            var _oConfig = $.grep(ns1blankspace.util.msal.configs, function (oConfig) {return oConfig.tenant == sTenant})
            if (_oConfig.length != 0) {oConfig = _oConfig[0]}
        }

        if (oConfig != undefined)
        {
            ns1blankspace.util.msal.config = $.extend(true, ns1blankspace.util.msal.config, oConfig);
        }

        if (oEndpoint != undefined)
        {
            ns1blankspace.util.msal.endpoint = $.extend(true, ns1blankspace.util.msal.endpoint, oEndpoint);
        }

        if (ns1blankspace.util.msal.config == undefined)
        {
            alert('No MSAL Config');
        }
        else
        {
            var oMSALConfig =
            {
                auth: ns1blankspace.util.msal.config.auth,
                cache: ns1blankspace.util.msal.config.cache
            }

            ns1blankspace.util.msal.instance = new Msal.UserAgentApplication(oConfig);
            //oMSALInstance = new Msal.UserAgentApplication(oMSALConfig)
 
            if (bAutoSignIn)
            {
                ns1blankspace.util.msal.account = ns1blankspace.util.msal.instance.getAccount();

                if (ns1blankspace.util.msal.account)
                {
                    ns1blankspace.util.msal.auth.acquireToken();
                }
                else
                {
                    ns1blankspace.util.msal.auth.signIn();
                }
            }
            else
            {
                $('#' + sTenant).show();

                if (typeof(ns1blankspace.util.msal.config.okToSend) == 'function')
                {
                    $('.ns1blankspaceMSAL').click(function (event)
                    {
                        ns1blankspace.util.msal.config.okToSend()   
                    });

                    $('.ns1blankspaceMSAL').keyup(function (event)
                    {
                        ns1blankspace.util.msal.config.okToSend()   
                    });
                }

                $('#ns1blankspaceMSALSend')
                .click(function()
                {       
                     ns1blankspace.util.msal.auth.signIn();
                });
            }
        }
    },
    auth:
    {   
        signIn: function ()
        {
            var oMSALScopes = 
            {
                scopes: ns1blankspace.util.msal.config.scopes
            }

            //oMSALInstance.loginPopup(oMSALScopes)

            ns1blankspace.util.msal.instance.loginPopup(oMSALScopes)
            .then(function (loginResponse)
            {
                console.log(loginResponse)
                //ns1blankspace.util.msal.show.welcomeMessage();
                ns1blankspace.util.msal.auth.acquireToken();
            })
            .catch(function (error)
            {
                console.log(error);
            });
        },
        signOut: function ()
        {
            ns1blankspace.util.msal.instance.logout();
        },
        acquireToken: function ()
        {
            console.log('Attempting to acquire token silently... Scopes:');
            console.log(ns1blankspace.util.msal.config.scopes);

            ns1blankspace.util.msal.instance.acquireTokenSilent({scopes: ns1blankspace.util.msal.config.scopes})
            .then(function (tokenResponse)
            {
                if (typeof(ns1blankspace.util.msal.config.tokenAcquired) == 'function')
                {
                    ns1blankspace.util.msal.config.tokenAcquired(tokenResponse)
                }
                else
                {
                    ns1blankspace.util.msal.auth.tokenResponse = tokenResponse;
                    console.log('Token aquired... Token:');
                    console.log(tokenResponse);
                    ns1blankspace.util.msal.show.updateMessage('token has been acquired for you.');
                    //ns1blankspace.util.msal.endpoint.call(ns1blankspace.util.msal.endpoint.uri, tokenResponse.accessToken, ns1blankspace.util.msal.endpoint.callback);
                }    
            })
            .catch(function (error)
            {
                console.log(error.errorMessage);
                console.log(error.errorCode);
                console.log('As per error, could not aquire token silently, now prompting user to sign in...');
 
                if (ns1blankspace.util.msal.util.requiresInteraction(error.errorCode))
                {
                    ns1blankspace.util.msal.instance.acquireTokenPopup({scopes: ns1blankspace.util.msal.config.scopes})
                    .then(function (tokenResponse)
                    {
                        if (typeof(ns1blankspace.util.msal.config.tokenAcquired) == 'function')
                        {
                            ns1blankspace.util.msal.config.tokenAcquired(tokenResponse)
                        }
                        else
                        {
                            ns1blankspace.util.msal.auth.tokenResponse = tokenResponse;
                            console.log(tokenResponse);
                            ns1blankspace.util.msal.show.updateMessage('token has been acquired for you.');
                            ns1blankspace.util.msal.endpoint.call(ns1blankspace.util.msal.endpoint.uri, tokenResponse.accessToken, ns1blankspace.util.msal.endpoint.callback);
                        }
                    })
                    .catch(function (error)
                    {
                        console.log(error.errorMessage);
                        console.log(error.errorCode);
                        console.log('Could not acquire a token.');
                        ns1blankspace.util.msal.show.updateMessage('sorry but could not acquire a token for you.');
                    });
                }
            });
        },
        callback: function (error, response)
        {
            if (error)
            {
                console.log(error);
            }
            else
            {
                if (response.tokenType === "access_token")
                {
                    ns1blankspace.util.msal.endpoint.call(ns1blankspace.util.msal.endpoint.uri, response.accessToken, ns1blankspace.util.msal.endpoint.callback);
                }
                else
                {
                    console.log("token type is:" + response.tokenType);
                }
            }
        }
    },
    show:
    {
        welcomeMessage: function (oParam)
        {
            var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

            if (sXHTMLElementID != undefined)
            {
                $('#' + sXHTMLElementID).html('Aquiring token for you...');
            }
        },
        updateMessage: function (oParam, sMessage)
        {
            var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

            if (sXHTMLElementID != undefined)
            {
                $('#' + sXHTMLElementID).html(sMessage);
            }
        }
    },
    endpoint:
    {
        uri: 'https://sandbox-api.singletouch.com.au/api/STPEvent2018',
        call: function (sURI, sAccessToken)
        {
            if (sURI == '')
            {
                sURI = ns1blankspace.util.msal.endpoint.uri;
            }

            ns1blankspace.util.msal.endpoint.accessToken = sAccessToken;
            console.log(sAccessToken)

            //As issue with CORS will need to send through myds proxy.



            if(false)
            {
                $.ajax(
                {
                    type: 'GET',
                    url: sURI,
                    dataType: 'json',
                    global: false,
                    headers:
                    {
                        'Authorization': 'Bearer ' + sAccessToken   
                    },
                    success: function(data)
                    {
                        ns1blankspace.util.msal.endpoint.callback(data)
                    },
                    error: function(data)
                    {
                        ns1blankspace.status.error(data)
                    }
                });
            }

            // var xmlHttp = new XMLHttpRequest();
            // xmlHttp.onreadystatechange = function ()
            // {
            //     if (this.readyState == 4 && this.status == 200)
            //         callback(JSON.parse(this.responseText));
            // }
            // xmlHttp.open("GET", theUrl, true); // true for asynchronous
            // xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            // xmlHttp.send();
        },
        callback: function (data)
        {
            console.log(data)
        }
    },
    util:
    {
        requiresInteraction: function (errorCode)
        {
            if (!errorCode || !errorCode.length)
            {
                return false;
            }
            return errorCode === "consent_required" ||
                errorCode === "interaction_required" ||
                errorCode === "login_required";
        },

        accessToken:
        {
            search: function (oParam, oResponse)
            {
                if (oResponse == undefined)
                {
                    var oSearch = new AdvancedSearch();
                    oSearch.method = 'CORE_URL_SEARCH';     
                    oSearch.addField('notes,url,urllogon');
                    oSearch.addFilter('private', 'EQUAL_TO', 'Y');
                    oSearch.addFilter('title', 'EQUAL_TO', 'singletouch.com.au');
                    oSearch.rows = 1
                    oSearch.getResults(function(data) {ns1blankspace.util.msal.util.accessToken.search(oParam, data)});
                }
                else
                {

                }    
            },

            save: function (oParam, oResponse)
            {

            }
        }
    }
}

