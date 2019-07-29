package no.nav.dolly.domain.resultset;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RsTestgruppeUtvidet extends RsTestgruppe {

    private List<RsTestidentBestillingId> testidenter;

    public List<RsTestidentBestillingId> getTestidenter() {
        if (testidenter == null) {
            testidenter = new ArrayList<>();
        }
        return testidenter;
    }
}