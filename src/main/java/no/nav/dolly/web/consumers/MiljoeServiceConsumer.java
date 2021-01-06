package no.nav.dolly.web.consumers;

import no.nav.dolly.web.config.RemoteApplicationsProperties;
import no.nav.dolly.web.security.TokenService;
import no.nav.dolly.web.security.domain.AccessScopes;
import no.nav.dolly.web.security.domain.AccessToken;
import no.nav.registre.testnorge.libs.dependencyanalysis.DependencyOn;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@DependencyOn("testnorge-miljoer-service")
public class MiljoeServiceConsumer {
    private final WebClient webClient;
    private final RemoteApplicationsProperties properties;
    private final TokenService tokenService;

    public MiljoeServiceConsumer(
            @Value("${consumers.testnorge-miljoer-service.baseUrl}") String baseUrl,
            RemoteApplicationsProperties properties,
            TokenService tokenService
    ) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
        this.properties = properties;
        this.tokenService = tokenService;
    }

    public List<String> getMiljoer() {
        AccessToken accessToken = tokenService.getAccessToken(
                new AccessScopes(properties.get("testnorge-miljoer-service"))
        );
        return webClient
                .get()
                .uri("/api/v1/miljoer")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken.getTokenValue())
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .retrieve()
                .bodyToMono(List.class)
                .block();
    }
}
