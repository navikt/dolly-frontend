package no.nav.appserivces.tpsf.domain.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRoutineResponseStatus {
    private String personId;
    private String serviceRutinenavn;
    private String environment;
    private ResponseStatus status;
    
}
