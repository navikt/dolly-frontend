package no.nav.dolly.domain.jpa;

import static java.lang.String.format;
import static no.nav.dolly.domain.jpa.HibernateConstants.SEQUENCE_STYLE_GENERATOR;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "T_BESTILLING_PROGRESS")
public class BestillingProgress {

    @Id
    @GeneratedValue(generator = "bestillingProgressIdGenerator")
    @GenericGenerator(name = "bestillingProgressIdGenerator", strategy = SEQUENCE_STYLE_GENERATOR, parameters = {
            @Parameter(name = "sequence_name", value = "T_BESTILLING_PROGRESS_SEQ"),
            @Parameter(name = "initial_value", value = "1"),
            @Parameter(name = "increment_size", value = "1")
    })
    private Long id;

    private Long bestillingId;

    private String ident;

    @Column(name = "TPSF_SUCCESS_ENVIRONMENTS")
    private String tpsfSuccessEnv;

    @Column(name = "SIGRUNSTUB_STATUS")
    private String sigrunstubStatus;

    @Column(name = "KRRSTUB_STATUS")
    private String krrstubStatus;

    private String feil;

    public BestillingProgress(Long bestillingId, String ident) {
        this.ident = ident;
        this.bestillingId = bestillingId;
    }

    public void appendKrrstubStatus(String jsonObject) {
        if (krrstubStatus != null) {
            krrstubStatus = format("%s,%s", krrstubStatus, jsonObject);
        }
        krrstubStatus = jsonObject;
    }

    public void appendSigrunstubStatus(String jsonObject) {
        if (sigrunstubStatus != null) {
            sigrunstubStatus = format("%s,%s", sigrunstubStatus, jsonObject);
        }
        sigrunstubStatus = jsonObject;
    }
}
