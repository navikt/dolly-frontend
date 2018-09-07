package no.nav.dolly.regression;

import no.nav.dolly.regression.scenarios.UtilsMetoderForTransactions;
import no.nav.dolly.repository.BestillingProgressRepository;
import no.nav.dolly.repository.BestillingRepository;
import no.nav.dolly.repository.BrukerRepository;
import no.nav.dolly.repository.IdentRepository;
import no.nav.dolly.repository.TeamRepository;
import no.nav.dolly.repository.TestGruppeRepository;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
@ActiveProfiles(value = "test")
//@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
public abstract class InMememoryDbTestSetup {

    @Autowired
    public BrukerRepository brukerRepository;

    @Autowired
    public TestGruppeRepository testGruppeRepository;

    @Autowired
    public TeamRepository teamRepository;

    @Autowired
    public IdentRepository identRepository;

    @Autowired
    public BestillingRepository bestillingRepository;

    @Autowired
    public BestillingProgressRepository bestillingProgressRepository;

    @Autowired
    public UtilsMetoderForTransactions utilsMetoderForLazyLoadingValues;
}
