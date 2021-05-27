package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BillingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Billing.class);
        Billing billing1 = new Billing();
        billing1.setId(1L);
        Billing billing2 = new Billing();
        billing2.setId(billing1.getId());
        assertThat(billing1).isEqualTo(billing2);
        billing2.setId(2L);
        assertThat(billing1).isNotEqualTo(billing2);
        billing1.setId(null);
        assertThat(billing1).isNotEqualTo(billing2);
    }
}
