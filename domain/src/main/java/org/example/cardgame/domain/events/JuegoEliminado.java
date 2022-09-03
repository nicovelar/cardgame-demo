package org.example.cardgame.domain.events;

import co.com.sofka.domain.generic.DomainEvent;

public class JuegoEliminado extends DomainEvent {
    public JuegoEliminado() {
        super("cardgame.juegoeliminado");
    }
}
