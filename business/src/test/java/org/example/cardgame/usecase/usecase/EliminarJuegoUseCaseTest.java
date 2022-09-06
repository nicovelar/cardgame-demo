package org.example.cardgame.usecase.usecase;
import co.com.sofka.domain.generic.DomainEvent;
import org.example.cardgame.domain.command.EliminarJuego;
import org.example.cardgame.domain.events.JuegoCreado;
import org.example.cardgame.domain.events.JuegoEliminado;
import org.example.cardgame.domain.values.JugadorId;
import org.example.cardgame.usecase.gateway.JuegoDomainEventRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EliminarJuegoUseCaseTest {

    @InjectMocks
    private EliminarJuegoUseCase useCase;

    @Mock
    private JuegoDomainEventRepository repository;

    @Test
    void eliminarJuego(){
        //ARRANGE
        var command = new EliminarJuego();
        command.setJuegoId("XXXX");

        //ASSERT & ACT
        when(repository.obtenerEventosPor("XXXX"))
                .thenReturn(juegoCreado());

        StepVerifier
                .create(useCase.apply(Mono.just(command)))
                .expectNextMatches(domainEvent -> {
                    var event = (JuegoEliminado) domainEvent;
                    return event.aggregateRootId().equals("XXXX");
                })
                .expectComplete()
                .verify();
    }

    private Flux<DomainEvent> juegoCreado() {
        var event = new JuegoCreado(JugadorId.of("FFFF"));
        event.setAggregateRootId("XXXX");

        return Flux.just(event);
    }
}