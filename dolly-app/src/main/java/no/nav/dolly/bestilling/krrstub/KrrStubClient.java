package no.nav.dolly.bestilling.krrstub;

import static java.util.Objects.nonNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import ma.glasnost.orika.MapperFacade;
import no.nav.dolly.bestilling.ClientRegister;
import no.nav.dolly.domain.jpa.BestillingProgress;
import no.nav.dolly.domain.resultset.NorskIdent;
import no.nav.dolly.domain.resultset.RsDollyBestilling;
import no.nav.dolly.domain.resultset.krrstub.DigitalKontaktdataRequest;

@Slf4j
@Service
public class KrrStubClient implements ClientRegister {

    @Autowired
    private KrrStubConsumer krrStubConsumer;

    @Autowired
    private KrrStubResponseHandler krrStubResponseHandler;

    @Autowired
    private MapperFacade mapperFacade;

    @Override public void gjenopprett(RsDollyBestilling bestilling, NorskIdent norskIdent, BestillingProgress progress) {

        if (nonNull(bestilling.getKrrstub())) {

            try {
                DigitalKontaktdataRequest digitalKontaktdataRequest = mapperFacade.map(bestilling.getKrrstub(), DigitalKontaktdataRequest.class);
                digitalKontaktdataRequest.setPersonident(norskIdent.getIdent());
                ResponseEntity krrstubResponse = krrStubConsumer.createDigitalKontaktdata(progress.getBestillingId(), digitalKontaktdataRequest);
                progress.setKrrstubStatus(krrStubResponseHandler.extractResponse(krrstubResponse));

            } catch (RuntimeException e) {
                progress.setKrrstubStatus("Feil: " + e.getMessage());
                log.error("Kall til KrrStub feilet: {}", e.getMessage(), e);
            }
        }
    }
}