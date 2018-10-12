package no.nav.dolly.appserivces.tpsf.service;

import lombok.extern.slf4j.Slf4j;
import no.nav.dolly.appserivces.sigrunstub.restcom.SigrunStubApiService;
import no.nav.dolly.appserivces.tpsf.restcom.TpsfApiService;
import no.nav.dolly.domain.jpa.Bestilling;
import no.nav.dolly.domain.jpa.BestillingProgress;
import no.nav.dolly.domain.jpa.Testgruppe;
import no.nav.dolly.domain.resultset.RsDollyBestillingsRequest;
import no.nav.dolly.domain.resultset.RsSkdMeldingResponse;
import no.nav.dolly.domain.resultset.SendSkdMeldingTilTpsResponse;
import no.nav.dolly.domain.resultset.tpsf.RsTpsfBestilling;
import no.nav.dolly.exceptions.TpsfException;
import no.nav.dolly.repository.BestillingProgressRepository;
import no.nav.dolly.service.BestillingService;
import no.nav.dolly.service.IdentService;
import no.nav.dolly.service.TestgruppeService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import static no.nav.dolly.util.UtilFunctions.isNullOrEmpty;

@Slf4j
@Service
public class DollyTpsfService {

    @Autowired
    private TpsfResponseHandler tpsfResponseHandler;

    @Autowired
    private TpsfApiService tpsfApiService;

    @Autowired
    private TestgruppeService testgruppeService;

    @Autowired
    private IdentService identService;

    @Autowired
    private SigrunStubApiService sigrunStubApiService;

    @Autowired
    private BestillingProgressRepository bestillingProgressRepository;

    @Autowired
    private BestillingService bestillingService;

    @Async
    public void opprettPersonerByKriterierAsync(Long gruppeId, RsDollyBestillingsRequest bestillingsRequest, Long bestillingsId) {
        Bestilling bestilling = bestillingService.fetchBestillingById(bestillingsId);
        Testgruppe testgruppe = testgruppeService.fetchTestgruppeById(gruppeId);

        RsTpsfBestilling tpsfBestilling = bestillingsRequest.getTpsf();
        tpsfBestilling.setEnvironments(bestillingsRequest.getEnvironments());
        tpsfBestilling.setAntall(1);

        try {
            for (int i = 0; i < bestillingsRequest.getAntall(); i++) {
                List<String> bestilteIdenter = tpsfApiService.opprettIdenterTpsf(tpsfBestilling);
                String hovedPersonIdent = getHovedpersonAvBestillingsidenter(bestilteIdenter);
                BestillingProgress progress = new BestillingProgress(bestillingsId, hovedPersonIdent);

                senderIdenterTilTPS(bestillingsRequest, bestilteIdenter, testgruppe, progress);

                bestillingService.saveBestillingToDB(bestilling);
            }
        } catch (Exception e) {
            log.error("Bestilling med id <" + bestillingsId + "> til gruppeId <" + gruppeId + "> feilet grunnet " + e.getMessage(), e);
        } finally {
            bestilling.setFerdig(true);
            bestillingService.saveBestillingToDB(bestilling);
        }
    }

    private void senderIdenterTilTPS(RsDollyBestillingsRequest request,  List<String> klareIdenter, Testgruppe testgruppe, BestillingProgress progress) {
        try {
            RsSkdMeldingResponse response = tpsfApiService.sendIdenterTilTpsFraTPSF(klareIdenter, request.getEnvironments().stream().map(String::toLowerCase).collect(Collectors.toList()));
            String feedbackTps = tpsfResponseHandler.extractTPSFeedback(response.getSendSkdMeldingTilTpsResponsene());
            log.info(feedbackTps);

            String hovedperson = getHovedpersonAvBestillingsidenter(klareIdenter);
            List<String> successMiljoer = extraxtSuccessMiljoForHovedperson(hovedperson, response);

            if(!isNullOrEmpty(successMiljoer)){
                identService.saveIdentTilGruppe(hovedperson, testgruppe);
                progress.setTpsfSuccessEnv(String.join(",",successMiljoer));
            } else {
                log.warn("Person med ident: " + hovedperson + " ble ikke opprettet i TPS");
            }
        } catch (TpsfException e){
            tpsfResponseHandler.handleError(e, progress);
        }

        bestillingProgressRepository.save(progress);
    }

    private String getHovedpersonAvBestillingsidenter(List<String> identer){
        return identer.get(0); //Rask fix for å hente hoveperson i bestilling. Vet at den er første, men burde gjøre en sikrere sjekk
    }

    private List<String> extraxtSuccessMiljoForHovedperson(String hovedperson, RsSkdMeldingResponse response){
        List<String> successMiljoer = new ArrayList<>();

        for(SendSkdMeldingTilTpsResponse r : response.getSendSkdMeldingTilTpsResponsene()){

            if("innvandringcreate".equals(r.getSkdmeldingstype().toLowerCase()) && hovedperson.equals(r.getPersonId())){
                for (Map.Entry<String, String> entry : r.getStatus().entrySet()) {
                    if((entry.getValue().contains("00"))){
                        successMiljoer.add(entry.getKey());
                    }
                }
            }

        }

        return successMiljoer;
    }
}
