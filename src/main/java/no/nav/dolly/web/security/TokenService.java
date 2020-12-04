package no.nav.dolly.web.security;

import lombok.RequiredArgsConstructor;
import no.nav.dolly.web.security.domain.AccessScopes;
import no.nav.dolly.web.security.domain.AccessToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {
    final OnBehalfOfGenerateAccessTokenService behalfOfGenerateAccessTokenService;

    public AccessToken getAccessToken(AccessScopes scope) {
        return behalfOfGenerateAccessTokenService.generateToken(scope);
    }
}
