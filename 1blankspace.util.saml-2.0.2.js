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

ns1blankspace.util.saml =
{
	exists: function (oParam)
	{
		return ('btoa' in window);
	},

    identityProviderURI: function (oParam)
    {
        var oOptionsTrustedLogon = ns1blankspace.util.getParam(oParam, 'options', {"default": ns1blankspace.option.trustedLogon}).value;

        if (oOptionsTrustedLogon != undefined)
        {
            if (oOptionsTrustedLogon.type == undefined)
            {
                oOptionsTrustedLogon.type = 'SAML2.0'
            }

            if (oOptionsTrustedLogon.assertionConsumerServiceURL == undefined)
            {
                oOptionsTrustedLogon.assertionConsumerServiceURL =
                    window.location.protocol + '//' + window.location.host + '/rpc/logon/?method=LOGON_TRUSTED';
            }

            if (oOptionsTrustedLogon.issuer == undefined)
            {
                oOptionsTrustedLogon.issuer =
                    window.location.host;
            }

            if (oOptionsTrustedLogon.identityProviderAppName == undefined)
            {
                oOptionsTrustedLogon.identityProviderAppName =
                    'site-' + ns1blankspace.user.site;
            }

            if (oOptionsTrustedLogon.type == 'SAML2.0')
            {
                var sSAMLRequest = 
                    '<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"' +
                        ' ID="mydigitalstructure_' + ns1blankspace.session.logonkey + '"' +
                        ' Version="2.0"' +
                        ' ProviderName="' + oOptionsTrustedLogon.identityProviderAppName + '"' +
                        ' IssueInstant="' + moment.utc().format() + '"' +
                        ' Destination="' + oOptionsTrustedLogon.identityProviderEntityID + '"' +
                        ' ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"' +
                        ' AssertionConsumerServiceURL="' + oOptionsTrustedLogon.assertionConsumerServiceURL + '">' +
                         '<saml:Issuer>' + oOptionsTrustedLogon.issuer + '</saml:Issuer>' +
                            '<samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" AllowCreate="true"/>' +
                            '<samlp:RequestedAuthnContext Comparison="exact">' +
                             '<saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>' +
                            '</samlp:RequestedAuthnContext>' +
                    '</samlp:AuthnRequest>';

                var sURISAMLRequest = btoa(sSAMLRequest);
                sURISAMLRequest = encodeURIComponent(sURISAMLRequest);
    
                var sURI = oOptionsTrustedLogon.identityProviderEntityID + '&SAMLRequest=' + sURISAMLRequest;

                return sURI
            }
        }
    },   

    test:   function ()
    {
        var sSAMLRequest = '<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"' +
            ' ID="1blankspace_809707f0030a5d00620c9d9df97f627afe9dcc24"' +
            ' Version="2.0" ProviderName="1blankspace" IssueInstant="2017-11-22T23:52:45Z" Destination="https://accounts.google.com/o/saml2/idp?idpid=C00mem5jv"' +
            ' ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" AssertionConsumerServiceURL="https://app-next.lab.ibcom.biz/saml">' +
          '<saml:Issuer>app-next.lab.ibcom.biz</saml:Issuer>' +
          '<samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" AllowCreate="true"/>' +
          '<samlp:RequestedAuthnContext Comparison="exact">' +
          '<saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>' +
          '</samlp:RequestedAuthnContext>' +
            '</samlp:AuthnRequest>'

        var sURISAMLRequest = btoa(sSAMLRequest);
        console.log(sURISAMLRequest)

        sURISAMLRequest = encodeURIComponent(sURISAMLRequest);
        console.log(sURISAMLRequest)        

        var sURL = 'https://accounts.google.com/o/saml2/idp?idpid=C00mem5jv&SAMLRequest=' + sURISAMLRequest
        console.log(sURL)
    }              
}