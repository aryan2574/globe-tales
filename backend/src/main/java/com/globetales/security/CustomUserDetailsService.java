package com.globetales.security;

import com.globetales.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("Attempting to load user by email: '" + email + "'");
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("User not found for email: '" + email + "'");
                    return new UsernameNotFoundException("User not found");
                });

        if (user.isDeleted()) {
            throw new UsernameNotFoundException("User account is deleted");
        }

        return new User(
                user.getEmail(),
                user.getPassword(),
                user.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .toList()
        );
    }
} 