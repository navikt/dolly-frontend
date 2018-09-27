package no.nav.dolly.util;

import no.nav.freg.security.oidc.auth.common.OidcTokenAuthentication;

import org.springframework.security.core.context.SecurityContextHolder;

public class CurrentNavIdentFetcher {

    public static String getLoggedInNavIdent(){
        OidcTokenAuthentication auth = (OidcTokenAuthentication) SecurityContextHolder.getContext().getAuthentication();
        return auth.getPrincipal();
    }
}