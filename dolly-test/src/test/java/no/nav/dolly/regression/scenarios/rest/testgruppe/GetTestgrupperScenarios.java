package no.nav.dolly.regression.scenarios.rest.testgruppe;

import static java.util.Collections.singletonList;
import static org.assertj.core.util.Sets.newHashSet;
import static org.hamcrest.CoreMatchers.both;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasProperty;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

import no.nav.dolly.domain.jpa.Bruker;
import no.nav.dolly.domain.jpa.Team;
import no.nav.dolly.domain.jpa.Testgruppe;
import no.nav.dolly.domain.resultset.RsTestgruppeUtvidet;
import no.nav.dolly.service.BrukerService;

public class GetTestgrupperScenarios extends TestgruppeTestCaseBase {

    @Autowired
    private BrukerService brukerService;

    @Test
    public void hentAlleTestgrupperTilknyttetBrukerIgjennomFavoritterOgTeammedlemskap() throws Exception {
        Bruker bruker2 = brukerRepository.save(Bruker.builder().navIdent("navident2").build());

        Team team2 = teamRepository.save(Team.builder()
                .navn("team2")
                .datoOpprettet(LocalDate.now())
                .beskrivelse("besk2")
                .eier(bruker2)
                .medlemmer(new HashSet<>(Arrays.asList(bruker2, standardBruker)))
                .build()
        );

        Team team3 = teamRepository.save(Team.builder()
                .navn("team3")
                .datoOpprettet(LocalDate.now())
                .beskrivelse("besk3")
                .eier(bruker2)
                .medlemmer(newHashSet(singletonList(bruker2)))
                .build()
        );

        Testgruppe testgruppe2 = gruppeRepository.save(Testgruppe.builder()
                .navn("gruppe2")
                .hensikt("hensikt2")
                .opprettetAv(standardBruker)
                .sistEndretAv(standardBruker)
                .datoEndret(LocalDate.now())
                .teamtilhoerighet(team2)
                .build()
        );

        Testgruppe testgruppe3 = gruppeRepository.save(Testgruppe.builder()
                .navn("gruppe3")
                .hensikt("hensikt3")
                .opprettetAv(bruker2)
                .sistEndretAv(bruker2)
                .datoEndret(LocalDate.now())
                .teamtilhoerighet(team3)
                .build()
        );

        Testgruppe testgruppe4 = gruppeRepository.save(Testgruppe.builder()
                .navn("gruppe4")
                .hensikt("hensikt4")
                .opprettetAv(bruker2)
                .sistEndretAv(bruker2)
                .datoEndret(LocalDate.now())
                .teamtilhoerighet(team3)
                .build()
        );

        brukerService.leggTilFavoritter(standardBruker.getNavIdent(), singletonList(testgruppe4));

        String url = endpointUrl + "?navIdent=" + standardBruker.getNavIdent();
        MvcResult mvcResult = mvcMock.perform(get(url))
                .andExpect(status().isOk())
                .andReturn();

        Set<RsTestgruppeUtvidet> resultat = convertMvcResultToSet(mvcResult, RsTestgruppeUtvidet.class);


        /* ASSERT */
        assertThat(resultat.size(), is(3));

        assertThat(resultat, hasItem(both(
                hasProperty("navn", equalTo(standardGruppenavn))).and(
                hasProperty("hensikt", equalTo(standardGruppeHensikt))).and(
                hasProperty("opprettetAvNavIdent", equalTo(standardBruker.getNavIdent())))
                ));

        assertThat(resultat, hasItem(both(
                hasProperty("navn", equalTo("gruppe2"))).and(
                hasProperty("hensikt", equalTo("hensikt2")))
        ));

        assertThat(resultat, hasItem(both(
                hasProperty("navn", equalTo("gruppe4"))).and(
                hasProperty("hensikt", equalTo("hensikt4"))).and(
                hasProperty("opprettetAvNavIdent", equalTo(bruker2.getNavIdent())))
        ));
    }
}
