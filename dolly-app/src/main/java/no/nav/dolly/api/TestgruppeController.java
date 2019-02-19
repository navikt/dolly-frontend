package no.nav.dolly.api;

import static java.lang.String.format;
import static no.nav.dolly.config.CachingConfig.CACHE_BESTILLING;
import static no.nav.dolly.config.CachingConfig.CACHE_GRUPPE;
import static no.nav.dolly.config.CachingConfig.CACHE_TEAM;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import ma.glasnost.orika.MapperFacade;
import no.nav.dolly.bestilling.service.DollyBestillingService;
import no.nav.dolly.domain.jpa.Bestilling;
import no.nav.dolly.domain.jpa.Testgruppe;
import no.nav.dolly.domain.resultset.RsBestilling;
import no.nav.dolly.domain.resultset.RsDollyBestillingFraIdenterRequest;
import no.nav.dolly.domain.resultset.RsDollyBestillingRequest;
import no.nav.dolly.domain.resultset.RsOpprettEndreTestgruppe;
import no.nav.dolly.domain.resultset.RsTestgruppe;
import no.nav.dolly.domain.resultset.RsTestgruppeUtvidet;
import no.nav.dolly.domain.resultset.RsTestident;
import no.nav.dolly.exceptions.NotFoundException;
import no.nav.dolly.service.BestillingService;
import no.nav.dolly.service.IdentService;
import no.nav.dolly.service.TestgruppeService;

@RestController
@RequestMapping(value = "api/v1/gruppe")
public class TestgruppeController {

    @Autowired
    private TestgruppeService testgruppeService;

    @Autowired
    private IdentService identService;

    @Autowired
    private MapperFacade mapperFacade;

    @Autowired
    private DollyBestillingService dollyBestillingService;

    @Autowired
    private BestillingService bestillingService;

    @CacheEvict(value = CACHE_GRUPPE, allEntries = true)
    @Transactional
    @PutMapping(value = "/{gruppeId}")
    public RsTestgruppeUtvidet oppdaterTestgruppe(@PathVariable("gruppeId") Long gruppeId, @RequestBody RsOpprettEndreTestgruppe testgruppe) {
        Testgruppe gruppe = testgruppeService.oppdaterTestgruppe(gruppeId, testgruppe);
        return mapperFacade.map(gruppe, RsTestgruppeUtvidet.class);
    }

    @CacheEvict(value = { CACHE_GRUPPE, CACHE_TEAM }, allEntries = true)
    @PostMapping
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public RsTestgruppeUtvidet opprettTestgruppe(@RequestBody RsOpprettEndreTestgruppe createTestgruppeRequest) {
        Testgruppe gruppe = testgruppeService.opprettTestgruppe(createTestgruppeRequest);
        return mapperFacade.map(testgruppeService.fetchTestgruppeById(gruppe.getId()), RsTestgruppeUtvidet.class);
    }

    @CacheEvict(value = CACHE_GRUPPE, allEntries = true)
    @Transactional
    @PutMapping("/{gruppeId}/slettTestidenter")
    public void deleteTestident(@RequestBody List<RsTestident> testpersonIdentListe) {
        identService.slettTestidenter(testpersonIdentListe);
    }

    @CacheEvict(value = CACHE_GRUPPE, allEntries = true)
    @Transactional
    @DeleteMapping("/{gruppeId}/slettTestident")
    public void deleteTestident(@RequestParam String ident) {
        if (identService.slettTestident(ident) == 0) {
            throw new NotFoundException(format("Testperson med ident %s ble ikke funnet.", ident));
        }
    }

    @Cacheable(CACHE_GRUPPE)
    @GetMapping("/{gruppeId}")
    public RsTestgruppeUtvidet getTestgruppe(@PathVariable("gruppeId") Long gruppeId) {
        return mapperFacade.map(testgruppeService.fetchTestgruppeById(gruppeId), RsTestgruppeUtvidet.class);
    }

    @Cacheable(CACHE_GRUPPE)
    @GetMapping
    public List<RsTestgruppe> getTestgrupper(
            @RequestParam(name = "navIdent", required = false) String navIdent,
            @RequestParam(name = "teamId", required = false) Long teamId) {
        return mapperFacade.mapAsList(testgruppeService.getTestgruppeByNavidentOgTeamId(navIdent, teamId), RsTestgruppe.class);
    }

    @CacheEvict(value = CACHE_GRUPPE, allEntries = true)
    @Transactional
    @DeleteMapping("/{gruppeId}")
    public void slettgruppe(@PathVariable("gruppeId") Long gruppeId) {
        if (testgruppeService.slettGruppeById(gruppeId) == 0) {
            throw new NotFoundException(format("Gruppe med id %s ble ikke funnet.", gruppeId));
        }
    }

    @CacheEvict(value = { CACHE_BESTILLING, CACHE_GRUPPE }, allEntries = true)
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/{gruppeId}/bestilling")
    public RsBestilling opprettIdentBestilling(@PathVariable("gruppeId") Long gruppeId, @RequestBody RsDollyBestillingRequest request) {
        Bestilling bestilling = bestillingService.saveBestillingByGruppeIdAndIdenter(gruppeId, request.getAntall(), request.getEnvironments(), request.getTpsf());

        dollyBestillingService.opprettPersonerByKriterierAsync(gruppeId, request, bestilling);
        return mapperFacade.map(bestilling, RsBestilling.class);
    }

    @CacheEvict(value = { CACHE_BESTILLING, CACHE_GRUPPE }, allEntries = true)
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/{gruppeId}/bestilling/fraidenter")
    public RsBestilling opprettIdentBestillingFraIdenter(@PathVariable("gruppeId") Long gruppeId, @RequestBody RsDollyBestillingFraIdenterRequest request) {
        Bestilling bestilling = bestillingService.saveBestillingByGruppeIdAndIdenter(gruppeId, request.getEnvironments(), request.getTpsf(), request.getEksisterendeIdenter());

        dollyBestillingService.opprettPersonerFraIdenterMedKriterierAsync(gruppeId, request, bestilling);
        return mapperFacade.map(bestilling, RsBestilling.class);
    }

    @Cacheable(CACHE_GRUPPE)
    @GetMapping("/{gruppeId}/identer")
    public List<String> getIdentsByGroupId(@PathVariable("gruppeId") Long gruppeId) {
        return testgruppeService.fetchIdenterByGruppeId(gruppeId);
    }
}
