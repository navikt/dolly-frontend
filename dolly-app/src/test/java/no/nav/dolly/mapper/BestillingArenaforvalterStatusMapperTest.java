package no.nav.dolly.mapper;

import static org.assertj.core.util.Lists.newArrayList;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;

import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

import no.nav.dolly.domain.jpa.BestillingProgress;
import no.nav.dolly.domain.resultset.RsMeldingStatusIdent;

@RunWith(MockitoJUnitRunner.class)
public class BestillingArenaforvalterStatusMapperTest {

    private static final List<BestillingProgress> RUN_STATUS = newArrayList(
            BestillingProgress.builder().ident("IDENT_1")
                    .arenaforvalterStatus("t4$Status: OK,t3$Status: Feil: Miljø ikke støttet")
                    .build()
    );

    @Test
    public void buildArenaForvalterStatusMap_OK() {

        List<RsMeldingStatusIdent> identStatuses = BestillingArenaforvalterStatusMapper.buildArenaStatusMap(RUN_STATUS);

        assertThat(identStatuses.get(0).getMelding(), is(equalTo("Status: Feil: Miljø ikke støttet")));
        assertThat(identStatuses.get(0).getStatusIdent().get("t3"), containsInAnyOrder("IDENT_1"));

        assertThat(identStatuses.get(1).getMelding(), is(equalTo("Status: OK")));
        assertThat(identStatuses.get(1).getStatusIdent().get("t4"), containsInAnyOrder("IDENT_1"));
    }
}