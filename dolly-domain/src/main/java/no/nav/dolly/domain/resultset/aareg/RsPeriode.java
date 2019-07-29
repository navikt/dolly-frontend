package no.nav.dolly.domain.resultset.aareg;

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
public class RsPeriode {

    private LocalDateTime fom;
    private LocalDateTime tom;
}