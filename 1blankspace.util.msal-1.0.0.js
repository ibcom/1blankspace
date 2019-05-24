/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 * http://docs.mydigitalstructure.com/community_authentication_msal
 *
 * https://github.com/AzureAD/microsoft-authentication-library-for-js
 *
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

//store token on myds for silent logon

ns1blankspace.util.msal =
{
    init: function (oParam)
    {
        var oConfig = ns1blankspace.util.getParam(oParam, 'config').value;
        var oEndpoint = ns1blankspace.util.getParam(oParam, 'endpoint').value;
        var iLoginType = ns1blankspace.util.getParam(oParam, 'loginType', {"default": 'POPUP'}).value;

        if (oConfig != undefined)
        {
            ns1blankspace.util.msal.config = $.extend(true, ns1blankspace.util.msal.config, oConfig);
        }

        if (oEndpoint != undefined)
        {
            ns1blankspace.util.msal.endpoint = $.extend(true, ns1blankspace.util.msal.endpoint, oEndpoint);
        }

        if (ns1blankspace.util.msal.config.auth == undefined)
        {
            ns1blankspace.status.error('No MSAL Auth Config');
        }
        else
        {
            ns1blankspace.util.msal.instance = new Msal.UserAgentApplication(ns1blankspace.util.msal.config);
            ns1blankspace.util.msal.instance.handleRedirectCallback(ns1blankspace.util.msal.auth.callback);

            if (iLoginType == 'POPUP')
            {
                ns1blankspace.util.msal.account = ns1blankspace.util.msal.instance.getAccount();

                if (ns1blankspace.util.msal.account)
                {
                    //ns1blankspace.util.msal.show.account();
                    ns1blankspace.util.msal.auth.acquireToken();
                }
                else
                {
                    ns1blankspace.status.error('Can not get MSAL account.');
                }
            }
            else if (iLoginType == 'REDIRECT')
            {
                document.getElementById("SignIn").onclick = function () {
                   ns1blankspace.util.msal.instance.loginRedirect({scopes: ns1blankspace.util.msal.scopes});
                };

                if (ns1blankspace.util.msal.instance.getAccount() && !ns1blankspace.util.msal.instance.isCallback(window.location.hash))
                {
                    //ns1blankspace.util.msal.show.welcomeMessage();
                    ns1blankspace.util.msal.auth.acquireToken();
                }
            }
            else
            {
                ns1blankspace.status.error('Please set a valid login type');
            }
        }
    },
    config:
    {
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
            "https://singletouchsandbox.onmicrosoft.com/mydigitalstructure/read",
            "https://singletouchsandbox.onmicrosoft.com/mydigitalstructure/user_impersonation"
        ]
    },
    auth:
    {
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
        },
        signIn: function ()
        {
            ns1blankspace.util.msal.instance.loginPopup({scopes: ns1blankspace.util.msal.scopes})
            .then(function (loginResponse)
            {
                console.log(loginResponse)
                ns1blankspace.util.msal.show.welcomeMessage();
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
            console.log('Attempting to acquire token silently...');
            ns1blankspace.util.msal.instance.acquireTokenSilent({scopes: ns1blankspace.util.msal.scopes})
            .then(function (tokenResponse)
            {
                ns1blankspace.util.msal.auth.tokenResponse = tokenResponse;
                console.log(tokenResponse);
                ns1blankspace.util.msal.show.updateMessage('token has been acquired for you.');
                ns1blankspace.util.msal.endpoint.call(ns1blankspace.util.msal.endpoint.uri, tokenResponse.accessToken, ns1blankspace.util.msal.endpoint.callback);
            })
            .catch(function (error)
            {
                console.log(error.errorMessage);
                console.log(error.errorCode);
                console.log('As per error, could not aquire token silently, now prompting user to sign in...');
 
                if (ns1blankspace.util.msal.util.requiresInteraction(error.errorCode))
                {
                    ns1blankspace.util.msal.instance.acquireTokenPopup({scopes: ns1blankspace.util.msal.scopes})
                    .then(function (tokenResponse)
                    {
                        ns1blankspace.util.msal.auth.tokenResponse = tokenResponse;
                        console.log(tokenResponse);
                        ns1blankspace.util.msal.show.updateMessage('token has been acquired for you.');
                        ns1blankspace.util.msal.endpoint.call(ns1blankspace.util.msal.endpoint.uri, tokenResponse.accessToken, ns1blankspace.util.msal.endpoint.callback);
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
        }
    },
    show:
    {
        welcomeMessage: function ()
        {
            var divWelcome = document.getElementById('WelcomeMessage');
            divWelcome.innerHTML = "Welcome " + (ns1blankspace.util.msal.account.userName || ns1blankspace.util.msal.account.idToken.given_name) + ', aquiring token for you...';
            var loginbutton = document.getElementById('SignIn');
            loginbutton.innerHTML = 'Sign Out';
            loginbutton.setAttribute('onclick', 'signOut();');
        },
        updateMessage: function (message)
        {

            var divWelcome = document.getElementById('WelcomeMessage');
            divWelcome.innerHTML = "Hi " + (ns1blankspace.util.msal.account.userName || ns1blankspace.util.msal.account.idToken.given_name) + ', ' + message;
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
        }
    }
}

