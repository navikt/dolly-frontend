package no.nav.dolly.bestilling.sigrunstub;

import static no.nav.dolly.sts.StsOidcService.getUserIdToken;
import static no.nav.dolly.sts.StsOidcService.getUserPrinciple;
import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.net.URI;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import no.nav.dolly.domain.resultset.sigrunstub.RsOpprettSkattegrunnlag;
import no.nav.dolly.properties.ProvidersProps;

@Slf4j
@Service
public class SigrunStubConsumer {

    private static final String SIGRUN_STUB_DELETE_GRUNNLAG = "/testdata/slett";
    private static final String SIGRUN_STUB_OPPRETT_GRUNNLAG = "/testdata/opprettBolk";

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    ProvidersProps providersProps;

    public ResponseEntity deleteSkattegrunnlag(String ident) {

        return restTemplate.exchange(RequestEntity.delete(URI.create(providersProps.getSigrunStub().getUrl() + SIGRUN_STUB_DELETE_GRUNNLAG))
                        .header(AUTHORIZATION, getUserIdToken())
                        .header("personidentifikator", ident)
                        .build(),
                String.class);
    }

    public ResponseEntity createSkattegrunnlag(List<RsOpprettSkattegrunnlag> request) {

        return restTemplate.exchange(RequestEntity.post(URI.create(providersProps.getSigrunStub().getUrl() + SIGRUN_STUB_OPPRETT_GRUNNLAG))
                        .header(ACCEPT, APPLICATION_JSON_VALUE)
                        .header(AUTHORIZATION, getUserIdToken())
                        .header("testdataEier", getUserPrinciple())
                        .body(request),
                Object.class);
    }
}