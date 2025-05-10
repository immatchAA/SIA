package com.redweb.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long id;
    private String email;
    private String role;
    private String firstName;
    private String lastName;

    public JwtAuthResponse(String accessToken, Long id, String email, String role, String firstName, String lastName) {
        this.accessToken = accessToken;
        this.id = id;
        this.email = email;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
