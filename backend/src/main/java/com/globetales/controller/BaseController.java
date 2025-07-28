package com.globetales.controller;

import org.springframework.http.ResponseEntity;

public class BaseController {
    
    protected <T> ResponseEntity<T> ok(T body) {
        return ResponseEntity.ok(body);
    }
    
    protected <T> ResponseEntity<T> created(T body) {
        return ResponseEntity.created(null).body(body);
    }
    
    protected ResponseEntity<Void> noContent() {
        return ResponseEntity.noContent().build();
    }
} 