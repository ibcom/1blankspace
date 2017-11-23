/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
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
	exists: 	function (oParam)
				{
					return ('btoa' in window);
				},

	test: 	function ()
				{
				/*	<samlp:AuthnRequest 
  AssertionConsumerServiceURL='https://mydomain.com/auth/saml/callback' 
  Destination='https://accounts.google.com/o/saml2?idpid=****' 
  ID='_********-****-****-****-************' 
  IssueInstant='2016-09-22T08:39:45Z' 
  Version='2.0' 
  xmlns:saml='urn:oasis:names:tc:SAML:2.0:assertion' 
  xmlns:samlp='urn:oasis:names:tc:SAML:2.0:protocol'>
<saml:Issuer>my_app_id</saml:Issuer>
<samlp:NameIDPolicy AllowCreate='true' Format='urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'/>
</samlp:AuthnRequest>*/


					var sSAMLRequest = '<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"' +
						' xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="1blankspace_809707f0030a5d00620c9d9df97f627afe9dcc24"' +
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

					//var d = decodeURIComponent('PD94bWwgdmVyc2lvbj0iMS4wIj8%2BPHNhbWxwOkF1dGhuUmVxdWVzdCBJRD0iX2FiYzEyMyIgSXNzdWVJbnN0YW50PSIyMDE0LTA5LTE3VDIwOjUzOjIxIiBWZXJzaW9uPSIyLjAiPjwvc2FtbHA6QXV0aG5SZXF1ZXN0Pg%3D%3D');
					//console.log(d)
					//console.log(base64.decode(d))
				}
}

/*<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<saml2p:Response Destination="https://app-next.lab.ibcom.biz/saml"
    ID="_ba04a953e00ad53ca7798d6324adf44f"
    InResponseTo="1blankspace_809707f0030a5d00620c9d9df97f627afe9dcc24"
    IssueInstant="2017-11-23T03:34:07.474Z" Version="2.0"
    xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol">
    <saml2:Issuer xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">https://accounts.google.com/o/saml2?idpid=C00mem5jv</saml2:Issuer>
    <saml2p:Status><saml2p:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/></saml2p:Status>
    <saml2:Assertion ID="_72bb34de3fb8dabf161d99d9767f2b2c" IssueInstant="2017-11-23T03:34:07.474Z"
        Version="2.0" xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">
        <saml2:Issuer>https://accounts.google.com/o/saml2?idpid=C00mem5jv</saml2:Issuer>
        <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
            <ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
                <ds:Reference URI="#_72bb34de3fb8dabf161d99d9767f2b2c">
                    <ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
                    <ds:DigestValue>LFaNq/7lzUGSdlrZI5lHdrq90S1v0p1b8C3wuNrg6YY=</ds:DigestValue>
                </ds:Reference>
            </ds:SignedInfo>
            <ds:SignatureValue>tr+t3UysK/TefpGhHnptv9Q4vHG77HnvpT2H+kBCQiuCnk6hRvUauIMMmzdIqLUR5V0wL9mgkD+I
                Mw2nhE3ooDIMU8895IaZWNdtRYxzIcTGV/yKpzthL8oMlRKQE9LrwV0Q2v2FDFGueyZCDDNTmoQg
                PF8z+8kDt6m5pCl8BDN1aAe6ob5S/4PYnSDTgpGXp7O9HN1HSwF2GcM/9Vkruy2+nR3QJFZiAz5H
                CYl1kNQwtiY38j0Wu5478f+SPcuTPKHgXTMpzZsCYRekWGfu4O0rl6ZYiPiLI9F/cms0hqxanRqw
                MWp6DdzRUIeTirs/ATWBTQwcludzoyZE5wP+jw==</ds:SignatureValue>
            <ds:KeyInfo>
                <ds:X509Data>
                    <ds:X509SubjectName>ST=California,C=US,OU=Google For Work,CN=Google,L=Mountain View,O=Google Inc.</ds:X509SubjectName>
                    <ds:X509Certificate>MIIDdDCCAlygAwIBAgIGAV/X7y4+MA0GCSqGSIb3DQEBCwUAMHsxFDASBgNVBAoTC0dvb2dsZSBJ
                        bmMuMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MQ8wDQYDVQQDEwZHb29nbGUxGDAWBgNVBAsTD0dv
                        b2dsZSBGb3IgV29yazELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWEwHhcNMTcxMTIw
                        MDUzODE2WhcNMjIxMTE5MDUzODE2WjB7MRQwEgYDVQQKEwtHb29nbGUgSW5jLjEWMBQGA1UEBxMN
                        TW91bnRhaW4gVmlldzEPMA0GA1UEAxMGR29vZ2xlMRgwFgYDVQQLEw9Hb29nbGUgRm9yIFdvcmsx
                        CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
                        MIIBCgKCAQEA4oEMl0r7IWbIXT/rbO7Jf9C2xWSLmhyiYzf5I5jfIwAO2i1KT4AWUJxjA3NUqIBy
                        4wyQ+NBqWz5vdcCcCz/6bS+Udoi7l5dWxfEZPqFqXNnqhslbpTzeGnVKjFWgUgOIcbEcnH0ikUva
                        BDt1OGM5lC7HeCwil1GvD5ZHoMPC83HBBqiMkBbxcrbA2T/HWI2TxiW92w4sqj1DM2ucIn7UFk38
                        t+oAonEUaVGLh59sE5F7+mJOnIQzrUl1f9nWRH2bD7sRZ9fcTx4DdDTDLMXYGcD42IeFK4TJIT5M
                        8Qg0nvB0D8gbufBSmaYWyOx46UxJ4ZWvIjpN2sRSwVjrduZHxwIDAQABMA0GCSqGSIb3DQEBCwUA
                        A4IBAQCs6dSj+5kDL9r9cZx8tQwEaj8svT2U4FCh7sccDN6jDsmDrWkBw68YxWRDRLW6UuMvsFCE
                        DJZQrVbCbr+RByrktKwh6f5DxiHnUhyno3ohpHSzldqPW06VQknwynQ7X/5DXrGajxiGEZPmct2f
                        BdD49cMjWzdLwN1pAwJSmycEvkYfWARVV6Ejjlz0JgEH+hr5+0DfH4xD4nn7Koq1BJ28kilRwNY+
                        egNkm0FUcEXdmyJwZtg49d6Dg+qSFlBoN2fMLZdCH7G2rP4p0XMZa2FcYH6Uu3bvDyGy0xd20Vl1
                        Awj6mhS2mc3YR8dsgQo4A4kZa4WH0zLly8Rry/U4oj7S</ds:X509Certificate>
                </ds:X509Data>
            </ds:KeyInfo>
        </ds:Signature>
        <saml2:Subject>
            <saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">mark.byers@ibcom.biz</saml2:NameID>
            <saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><saml2:SubjectConfirmationData InResponseTo="1blankspace_809707f0030a5d00620c9d9df97f627afe9dcc24"
                NotOnOrAfter="2017-11-23T03:39:07.474Z" Recipient="https://app-next.lab.ibcom.biz/saml"/></saml2:SubjectConfirmation>
        </saml2:Subject>
        <saml2:Conditions NotBefore="2017-11-23T03:29:07.474Z" NotOnOrAfter="2017-11-23T03:39:07.474Z">
            <saml2:AudienceRestriction>
                <saml2:Audience>app-next.lab.ibcom.biz</saml2:Audience>
            </saml2:AudienceRestriction>
        </saml2:Conditions>
        <saml2:AuthnStatement AuthnInstant="2017-11-23T03:18:28.000Z"
            SessionIndex="_72bb34de3fb8dabf161d99d9767f2b2c">
            <saml2:AuthnContext>
                <saml2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified</saml2:AuthnContextClassRef>
            </saml2:AuthnContext>
        </saml2:AuthnStatement>
    </saml2:Assertion>
</saml2p:Response>*/

/*Notes for Chad

TRUSTED_LOGON
samlresponse=
Convert from base64
check signature - use signature > reference to get XML ID
*/
