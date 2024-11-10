package com.app.rentconnect.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestConnectController {

    @GetMapping("test")
    public String test() {
        return "connected successfully";
    }
}
