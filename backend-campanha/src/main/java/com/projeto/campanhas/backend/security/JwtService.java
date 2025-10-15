package com.projeto.campanhas.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final Key signingKey;
    private final long expirationMillis;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration}") long expirationMillis
    ) {
        byte[] keyBytes = null;
        try {
            byte[] decoded = Decoders.BASE64.decode(secret);
            if (decoded != null && decoded.length > 0) {
                if (decoded.length < 32) {
                    try {
                        java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
                        decoded = md.digest(decoded);
                    } catch (java.security.NoSuchAlgorithmException e) {
                        // If SHA-256 not available, we'll pad below via fallback
                    }
                }
                keyBytes = decoded;
            }
        } catch (Exception ignored) {
            // not base64, will use raw secret below
        }
        if (keyBytes == null) {
            byte[] raw = secret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            if (raw.length < 32) {
                try {
                    java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
                    keyBytes = md.digest(raw);
                } catch (java.security.NoSuchAlgorithmException e) {
                    // Fallback: pad the key to 32 bytes deterministically
                    byte[] padded = new byte[32];
                    for (int i = 0; i < 32; i++) {
                        padded[i] = raw[i % raw.length];
                    }
                    keyBytes = padded;
                }
            } else {
                keyBytes = raw;
            }
        }
        if (keyBytes.length < 32) {
            // Absolute last resort safety
            byte[] padded = new byte[32];
            for (int i = 0; i < 32; i++) {
                padded[i] = keyBytes[i % keyBytes.length];
            }
            keyBytes = padded;
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMillis = expirationMillis;
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(Map.of(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMillis);
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
