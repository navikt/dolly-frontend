package no.nav.dolly.api.config;

import no.nav.dolly.domain.resultset.tpsf.RsTpsfProps;
import no.nav.dolly.properties.TpsfProps;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/config", produces = MediaType.APPLICATION_JSON_VALUE)
public class EnvironmentPropsController {

    @Autowired
    private TpsfProps tpsfProps;

    @GetMapping
    public RsTpsfProps getEnvironmentProps() {
        return RsTpsfProps.builder().url(tpsfProps.getUrl()).build();
    }
}