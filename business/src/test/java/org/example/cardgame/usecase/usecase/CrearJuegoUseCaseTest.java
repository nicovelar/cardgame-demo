package org.example.cardgame.usecase.usecase;



import org.example.cardgame.domain.command.CrearJuegoCommand;
import org.example.cardgame.domain.events.JuegoCreado;
import org.example.cardgame.domain.events.JugadorAgregado;
import org.example.cardgame.usecase.gateway.ListaDeCartaService;
import org.example.cardgame.usecase.gateway.model.CartaMaestra;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.HashMap;

import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class CrearJuegoUseCaseTest {

    @Mock
    private ListaDeCartaService service;
    @InjectMocks
    private CrearJuegoUseCase useCase;
    @Test
    void crearJuego() {
        var command = new CrearJuegoCommand();
        command.setJuegoId("xxx");
        command.setJugadores(new HashMap<>());
        command.getJugadores().put("1211", "Gianni");
        command.getJugadores().put("5678", "Matias");
        command.getJugadores().put("91011", "Joaco");
        command.setJugadorPrincipalId("1211");

        when(service.obtenerCartasDeMarvel()).thenReturn(CartasSet());

        StepVerifier.create(useCase.apply(Mono.just(command)))
                .expectNextMatches(domainEvent -> {
                    var event = (JuegoCreado) domainEvent;
                    return event.getJugadorPrincipal().value().equals("1211") && event.aggregateRootId().equals("xxx");
                })
                .expectNextMatches(domainEvent -> {
                    var event = (JugadorAgregado) domainEvent;
                    assert event.getMazo().value().cantidad().equals(6);
                    return event.getJugadorId().value().equals("1211") && event.getAlias().equals("Gianni");
                })
                .expectNextMatches(domainEvent -> {
                    var event = (JugadorAgregado) domainEvent;
                    assert event.getMazo().value().cantidad().equals(6);
                    return event.getJugadorId().value().equals("5678") && event.getAlias().equals("Matias");
                })
                .expectNextMatches(domainEvent -> {
                    var event = (JugadorAgregado) domainEvent;
                    assert event.getMazo().value().cantidad().equals(6);
                    return event.getJugadorId().value().equals("91011") && event.getAlias().equals("Joaco");
                })
                .expectComplete()
                .verify();
    }

    private Flux<CartaMaestra> CartasSet(){
        return Flux.just(

                new CartaMaestra("1", "aa"),
                new CartaMaestra("2", "ab"),
                new CartaMaestra("3", "ac"),
                new CartaMaestra("4", "ad"),
                new CartaMaestra("5", "ae"),
                new CartaMaestra("6", "af"),

                new CartaMaestra("7", "ag"),
                new CartaMaestra("8", "ah"),
                new CartaMaestra("9", "ai"),
                new CartaMaestra("10", "aj"),
                new CartaMaestra("11", "ak"),
                new CartaMaestra("12", "al"),

                new CartaMaestra("13", "am"),
                new CartaMaestra("14", "an"),
                new CartaMaestra("15", "ao"),
                new CartaMaestra("16", "ap"),
                new CartaMaestra("17", "aq"),
                new CartaMaestra("18", "ar")

        );
    }
}