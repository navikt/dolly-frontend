package no.nav.dolly.domain.resultset;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RsTestgruppe {
	private Long id;
	private String navn;
	private String hensikt;
	private String opprettetAvNavIdent;
	private String sistEndretAvNavIdent;
	private Boolean openAmSent;

	@JsonDeserialize(using = LocalDateDeserializer.class)
	private LocalDate datoEndret;

	private RsTeamMedIdOgNavn team;
	private Set<RsTestident> testidenter = new HashSet<>();
}
