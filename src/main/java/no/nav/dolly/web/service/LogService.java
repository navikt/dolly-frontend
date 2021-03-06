package no.nav.dolly.web.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

import no.nav.dolly.web.consumers.TilbakemeldingConsumer;
import no.nav.dolly.web.domain.Level;
import no.nav.dolly.web.domain.LogEvent;

@Slf4j
@Service
@RequiredArgsConstructor
public class LogService {

    private final TilbakemeldingConsumer tilbakemeldingConsumer;

    private void logKibana(LogEvent event) {
        MDC.clear();
        MDC.setContextMap(event.toPropertyMap());
        switch (event.getLevel()) {
            case TRACE:
                log.trace(event.getMessage());
                break;
            case INFO:
                log.info(event.getMessage());
                break;
            case WARNING:
                log.warn(event.getMessage());
                break;
            case ERROR:
                log.error(event.getMessage());
                break;
            default:
                log.debug(event.getMessage());
                break;
        }
        MDC.clear();
    }

    public void log(LogEvent event) {
        try {
            if (Strings.isNotBlank(event.getMessage()) && event.getLevel() == Level.INFO) {
                tilbakemeldingConsumer.send(event.toTilbakemeldingDTO());
            }
        } catch (Exception e) {
            log.error("Feil ved innsendelse til tilbakemelding consumer.", e);
        } finally {
            logKibana(event);
        }
    }
}