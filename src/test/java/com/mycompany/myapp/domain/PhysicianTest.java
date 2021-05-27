package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PhysicianTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Physician.class);
        Physician physician1 = new Physician();
        physician1.setId(1L);
        Physician physician2 = new Physician();
        physician2.setId(physician1.getId());
        assertThat(physician1).isEqualTo(physician2);
        physician2.setId(2L);
        assertThat(physician1).isNotEqualTo(physician2);
        physician1.setId(null);
        assertThat(physician1).isNotEqualTo(physician2);
    }
}
