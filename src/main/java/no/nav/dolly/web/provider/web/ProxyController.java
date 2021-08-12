package no.nav.dolly.web.provider.web;

import static java.lang.String.format;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import no.nav.registre.testnorge.libs.dependencyanalysis.DependenciesOn;
import no.nav.registre.testnorge.libs.dependencyanalysis.DependencyOn;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@DependenciesOn({
        @DependencyOn(value = "arena-forvalteren", external = true),
        @DependencyOn(value = "digdir-krr-stub", external = true),
        @DependencyOn(value = "sigrun-skd-stub", external = true),
        @DependencyOn(value = "tps-forvalteren", external = true),
        @DependencyOn(value = "pensjon-testdata-facade", external = true),
        @DependencyOn(value = "pdl-api", external = true),
        @DependencyOn("testnorge-inst"),
        @DependencyOn("testnorge-statisk-data-forvalter"),
        @DependencyOn("testnorge-hodejegeren"),
        @DependencyOn("testnorge-aareg"),
        @DependencyOn("brreg-stub"),
        @DependencyOn("udi-stub")
})
public class ProxyController {

    public static final String API_URI = "/api/v1";
    public static final String PROXY_URI = "/api/proxy";
    @Value("${fagsystem.arena.url}")
    private String arenaUrl;

    @Value("${fagsystem.instdata.url}")
    private String instUrl;

    @Value("${fagsystem.krrstub.url}")
    private String krrUrl;

    @Value("${fagsystem.sigrunstub.url}")
    private String sigrunUrl;

    @Value("${fagsystem.tpsf.url}")
    private String tpsfUrl;

    @Value("${fagsystem.udistub.url}")
    private String udiUrl;

    @Value("${fagsystem.pensjonforvalter.url}")
    private String poppUrl;

    @Value("${fagsystem.aareg.url}")
    private String aaregUrl;

    @Value("${fagsystem.inntektstub.url}")
    private String inntektstubUrl;

    @Value("${fagsystem.brregstub.url}")
    private String brregstubUrl;

    @Value("${fagsystem.hodejegeren.url}")
    private String hodejegerenUrl;

    private final ProxyService proxyService;

    @RequestMapping("/proxy/udi/**")
    public ResponseEntity<String> udiProxy(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request) throws UnsupportedEncodingException {

        String requestURL = createURL(request, udiUrl + API_URI, PROXY_URI + "/udi");
        HttpHeaders headers = proxyService.copyHeaders(request);
        return proxyService.proxyRequest(body, method, headers, requestURL);
    }

    private static String createURL(HttpServletRequest request, String host, String splitUri)
            throws UnsupportedEncodingException {

        if (request.getRequestURI().split(splitUri).length < 2) {
            throw new UnsupportedEncodingException(format("Incomplete url: %s", request.getRequestURI()));
        }
        String queryString = "";
        if (StringUtils.isNotBlank(request.getQueryString())) {
            queryString = URLDecoder.decode("?" + request.getQueryString(), StandardCharsets.UTF_8.name());
        }

        return format("%s%s%s", host, request.getRequestURI().split(splitUri)[1], queryString);
    }
}