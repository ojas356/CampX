package com.campx

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CampxApplication

fun main(args: Array<String>) {
    runApplication<CampxApplication>(*args)
}
