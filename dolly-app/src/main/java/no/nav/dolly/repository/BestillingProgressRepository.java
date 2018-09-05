package no.nav.dolly.repository;

import no.nav.dolly.domain.jpa.BestillingProgress;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface BestillingProgressRepository extends CrudRepository<BestillingProgress, Long> {

    List<BestillingProgress> findBestillingProgressByBestillingId(Long bestillingId);
}