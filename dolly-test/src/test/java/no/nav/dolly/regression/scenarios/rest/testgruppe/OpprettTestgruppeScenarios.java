package no.nav.dolly.regression.scenarios.rest.testgruppe;

import no.nav.dolly.domain.jpa.Bruker;
import no.nav.dolly.domain.jpa.Team;
import no.nav.dolly.domain.jpa.Testgruppe;
import no.nav.dolly.domain.resultset.RsOpprettTestgruppe;
import no.nav.dolly.testdata.builder.RsOpprettTestgruppeBuilder;

import org.junit.Test;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.Matchers.hasProperty;
import static org.junit.Assert.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class OpprettTestgruppeScenarios extends TestgruppeTestCaseBase {

    @Test
    public void opprettTestgruppeBasertPaaCurrentBruker() throws Exception {
        Team team = teamRepository.findAll().get(0);

        RsOpprettTestgruppe rsOpprettTestgruppe = RsOpprettTestgruppeBuilder.builder()
                .navn("mingruppe")
                .hensikt("hensikt")
                .teamId(team.getId())
                .build()
                .convertToRealRsOpprettTestgruppe();

        String url = endpointUrl;

        MvcResult mvcResult = mvcMock.perform(post(url)
                .contentType(APPLICATION_JSON_UTF8)
                .content(convertObjectToJson(rsOpprettTestgruppe)))
                .andExpect(status().isCreated())
                .andReturn();

        Testgruppe gruppe = gruppeRepository.findByNavn("mingruppe");

        assertThat(gruppe.getId(), is(notNullValue()));
        assertThat(gruppe.getNavn(), is("mingruppe"));
        assertThat(gruppe.getHensikt(), is("hensikt"));
        assertThat(gruppe.getOpprettetAv().getNavIdent(), is(standardNavIdent));
    }

    @Test
    public void opprettTestgruppeUtenAaSpesifisereTeamOgFaaSpesifisertTeamMedNavidentNavn() throws Exception {
        RsOpprettTestgruppe rsOpprettTestgruppe = RsOpprettTestgruppeBuilder.builder()
                .navn("mingruppe")
                .hensikt("hensikt")
                .build()
                .convertToRealRsOpprettTestgruppe();

        String url = endpointUrl;

        MvcResult mvcResult = mvcMock.perform(post(url)
                .contentType(APPLICATION_JSON_UTF8)
                .content(convertObjectToJson(rsOpprettTestgruppe)))
                .andExpect(status().isCreated())
                .andReturn();

        Testgruppe gruppe = gruppeRepository.findByNavn("mingruppe");
        Team teamG1 = teamTestRepository.findByIdFetchMedlemmerEagerly(gruppe.getTeamtilhoerighet().getId());
        Bruker brukerG1 = brukerTestRepository.findByNavIdentTeamsEagerly(standardNavIdent);

        assertThat(gruppe.getId(), is(notNullValue()));
        assertThat(gruppe.getNavn(), is("mingruppe"));
        assertThat(gruppe.getHensikt(), is("hensikt"));
        assertThat(gruppe.getTeamtilhoerighet().getNavn(), is(standardNavIdent));
        assertThat(gruppe.getOpprettetAv().getNavIdent(), is(standardNavIdent));

        assertThat(teamG1.getMedlemmer(), hasItem(hasProperty("navIdent", equalTo(standardNavIdent))));
        assertThat(teamG1.getEier().getNavIdent(), is(standardNavIdent));

        assertThat(brukerG1.getTeams(), hasItem(hasProperty("navn", equalTo(standardNavIdent))));
    }

    @Test
    public void opprettTestgruppeUtenAaSpesifisereTeamOgTeamMedNavidentnavnAlleredeEksisterer() throws Exception {
        RsOpprettTestgruppe rsOpprettTestgruppe = RsOpprettTestgruppeBuilder.builder()
                .navn("mingruppe")
                .hensikt("hensikt")
                .build()
                .convertToRealRsOpprettTestgruppe();

        RsOpprettTestgruppe rsOpprettTestgruppe2 = RsOpprettTestgruppeBuilder.builder()
                .navn("mingruppe2")
                .hensikt("hensikt2")
                .build()
                .convertToRealRsOpprettTestgruppe();

        String url = endpointUrl;

        MvcResult mvcResult = mvcMock.perform(post(url)
                .contentType(APPLICATION_JSON_UTF8)
                .content(convertObjectToJson(rsOpprettTestgruppe)))
                .andExpect(status().isCreated())
                .andReturn();

        MvcResult mvcResult2 = mvcMock.perform(post(url)
                .contentType(APPLICATION_JSON_UTF8)
                .content(convertObjectToJson(rsOpprettTestgruppe2)))
                .andExpect(status().isCreated())
                .andReturn();

        Testgruppe gruppe = gruppeRepository.findByNavn("mingruppe");
        Testgruppe gruppe2 = gruppeRepository.findByNavn("mingruppe2");
        Team teamG1 = teamTestRepository.findByIdFetchMedlemmerEagerly(gruppe.getTeamtilhoerighet().getId());

        assertThat(gruppe.getId(), is(notNullValue()));
        assertThat(gruppe.getNavn(), is("mingruppe"));
        assertThat(gruppe.getHensikt(), is("hensikt"));
        assertThat(gruppe.getTeamtilhoerighet().getNavn(), is(standardNavIdent));
        assertThat(gruppe.getOpprettetAv().getNavIdent(), is(standardNavIdent));

        assertThat(teamG1.getMedlemmer(), hasItem(hasProperty("navIdent", equalTo(standardNavIdent))));

        assertThat(gruppe2.getId(), is(notNullValue()));
        assertThat(gruppe2.getNavn(), is("mingruppe2"));
        assertThat(gruppe2.getHensikt(), is("hensikt2"));
        assertThat(gruppe2.getTeamtilhoerighet().getNavn(), is(standardNavIdent));
        assertThat(gruppe2.getOpprettetAv().getNavIdent(), is(standardNavIdent));
    }
}