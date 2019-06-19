package no.nav.dolly.domain.resultset.arenaforvalter;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RsArenaAap {

   private LocalDateTime fraDato;
   private LocalDateTime tilDato;
}