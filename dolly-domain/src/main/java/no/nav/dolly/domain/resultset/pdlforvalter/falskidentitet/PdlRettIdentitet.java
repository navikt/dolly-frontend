package no.nav.dolly.domain.resultset.pdlforvalter.falskidentitet;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PdlRettIdentitet {

      private Boolean rettIdentitetErUkjent;
      private String rettIdentitetVedIdentifikasjonsnummer;
      private PdlRettIdentitetVedOpplysninger rettIdentitetVedOpplysninger;
}