package no.nav.dolly.web.security;

import java.net.URI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.extern.slf4j.Slf4j;
import no.nav.dolly.web.security.domain.AccessScopes;
import no.nav.dolly.web.security.domain.AccessToken;
import no.nav.dolly.web.security.domain.ClientCredential;
import no.nav.dolly.web.security.domain.DollyFrontendClientCredential;
import reactor.netty.http.client.HttpClient;
import reactor.netty.tcp.ProxyProvider;


@Slf4j
@Service
class OnBehalfOfGenerateAccessTokenService {
    private final WebClient webClient;
    private final AuthenticationTokenResolver tokenResolver;
    private final ClientCredential clientCredential;

    public OnBehalfOfGenerateAccessTokenService(
            @Value("${http.proxy:#{null}}") String proxyHost,
            @Value("${AAD_ISSUER_URI}") String issuerUrl,
            DollyFrontendClientCredential clientCredential,
            AuthenticationTokenResolver tokenResolver
    ) {
        this.clientCredential = clientCredential;

        WebClient.Builder builder = WebClient
                .builder()
                .baseUrl(issuerUrl + "/oauth2/v2.0/token")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE);

        if (proxyHost != null) {
            log.info("Setter opp proxy host {} for Client Credentials", proxyHost);
            var uri = URI.create(proxyHost);

            HttpClient httpClient = HttpClient
                    .create()
                    .tcpConfiguration(tcpClient -> tcpClient.proxy(proxy -> proxy
                            .type(ProxyProvider.Proxy.HTTP)
                            .host(uri.getHost())
                            .port(uri.getPort())
                    ));
            builder.clientConnector(new ReactorClientHttpConnector(httpClient));
        }

        this.tokenResolver = tokenResolver;
        this.webClient = builder.build();
    }

    public AccessToken generateToken(AccessScopes accessScopes) {
        if (accessScopes.getScopes().isEmpty()) {
            throw new RuntimeException("Kan ikke opprette accessToken uten clients");
        }
        OAuth2AccessToken accessToken = tokenResolver.getToken();

        var body = BodyInserters
                .fromFormData("scope", String.join(" ", accessScopes.getScopes()))
                .with("spring.security.oauth2.client.registration.aad.client-id", clientCredential.getClientId())
                .with("spring.security.oauth2.client.registration.aad.client-secret", clientCredential.getClientSecret())
                .with("assertion", accessToken.getTokenValue())
                .with("requested_token_use", "on_behalf_of")
                .with("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");

        AccessToken token = webClient.post()
                .body(body)
                .retrieve()
                .bodyToMono(AccessToken.class)
                .block();

        log.info("Access token opprettet for OAuth 2.0 On-Behalf-Of Flow");
        return token;
    }
}