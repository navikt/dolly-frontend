package no.nav.dolly.web.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.client.AuthorizedClientServiceReactiveOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.ClientCredentialsReactiveOAuth2AuthorizedClientProvider;
import org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.endpoint.WebClientReactiveClientCredentialsTokenResponseClient;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.tcp.ProxyProvider;

import java.net.URI;

@Slf4j
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfig {

    public HttpClient proxyHttpClient() {
        String httpProxy = System.getProperty("http.proxy");

        if (httpProxy == null) {
            return HttpClient.create();
        }
        log.info("Setter opp proxy {}.", httpProxy);


        var uri = URI.create(httpProxy);

        return HttpClient.create()
                .tcpConfiguration(tcpClient ->
                        tcpClient.proxy(proxy ->
                                proxy.type(ProxyProvider.Proxy.HTTP).host(uri.getHost()).port(uri.getPort())
                        )
                );
    }

    @Bean
    public ReactiveOAuth2AuthorizedClientManager authorizedClientManager(
            ReactiveClientRegistrationRepository clientRegistrationRepository,
            ReactiveOAuth2AuthorizedClientService authorizedClientService) {

        return configureHttpProxy(
                new AuthorizedClientServiceReactiveOAuth2AuthorizedClientManager(
                        clientRegistrationRepository,
                        authorizedClientService
                )
        );
    }

    @Bean
    WebClient webClient(ReactiveOAuth2AuthorizedClientManager authorizedClientManager) {
        ServerOAuth2AuthorizedClientExchangeFilterFunction oauth2Client = new ServerOAuth2AuthorizedClientExchangeFilterFunction(authorizedClientManager);
        oauth2Client.setDefaultClientRegistrationId("registration_id");
        return WebClient.builder()
                .filter(oauth2Client)
                .clientConnector(new ReactorClientHttpConnector(HttpClient.create().wiretap(true)))
                .build();
    }

    private AuthorizedClientServiceReactiveOAuth2AuthorizedClientManager configureHttpProxy(AuthorizedClientServiceReactiveOAuth2AuthorizedClientManager authorizedClientManager) {
        // set the webclient with proxy configuration in the ReactiveOAuth2AccessTokenResponseClient
        WebClientReactiveClientCredentialsTokenResponseClient tokenResponseClient = new WebClientReactiveClientCredentialsTokenResponseClient();
        tokenResponseClient.setWebClient(
                WebClient.builder()
                        .clientConnector(new ReactorClientHttpConnector(proxyHttpClient()))
                        .build()
        );

        // set the ReactiveOAuth2AccessTokenResponseClient with webclient configuration in the ReactiveOAuth2AuthorizedClientProvider
        ClientCredentialsReactiveOAuth2AuthorizedClientProvider authorizedClientProvider = new ClientCredentialsReactiveOAuth2AuthorizedClientProvider();
        authorizedClientProvider.setAccessTokenResponseClient(tokenResponseClient);

        // set the ReactiveOAuth2AuthorizedClientProvider in the ReactiveOAuth2AuthorizedClientManager
        authorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);

        return authorizedClientManager;
    }


    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http.csrf().disable()
                .authorizeExchange()
                .pathMatchers("/internal/isReady", "/internal/isAlive").permitAll()
                .anyExchange().authenticated()
                .and().oauth2Client()
                .and().oauth2Login()
                .and().logout().logoutUrl("/");
        return http.build();
    }
}