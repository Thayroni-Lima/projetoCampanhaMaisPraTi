package com.projeto.campanhas.backend.api.dto.campaign;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DonationRequest {
    @NotNull(message = "Valor da doação é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor mínimo para doação é 0.01")
    @Digits(integer = 12, fraction = 2, message = "Valor inválido")
    private BigDecimal amount;
}
