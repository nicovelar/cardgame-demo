import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Carta } from 'src/app/shared/model/mazo';
import { ApiService } from 'src/app/shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  cartasDelJugador: Carta[] = [];
  cartasDelTablero: Carta[] = [];
  cartasJugadorTablero: string[] = []
  tiempo: number = 0;
  jugadoresRonda: number = 0;
  jugadoresTablero: number = 0;
  numeroRonda: number = 0;
  juegoId: string = "";
  uid: string = "";
  roundStarted:boolean = false;
  ganadorAlias:string = "";
  ganador:boolean = false;


  constructor(
    public api: ApiService,
    public authService: AuthService,
    public ws: WebsocketService,
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.juegoId = params['id'];
      this.uid = this.authService.user.uid;
      this.api.getMiMazo(this.uid, this.juegoId).subscribe((element:any) => {
        this.cartasDelJugador = element.cartas;
      });

      this.api.getTablero(this.juegoId).subscribe((element) => {
        
        this.cartasDelTablero = Object.entries(element.tablero.cartas).map((a: any) => {
          return a[1];
        });
        this.tiempo = element.tiempo;
        this.jugadoresRonda = element.ronda.jugadores.length;
        this.jugadoresTablero = element.tablero.jugadores.length;
        this.numeroRonda = element.ronda.numero;
      });

      this.ws.connect(this.juegoId).subscribe({  
        next: (event:any) => {
          if (event.type === 'cardgame.ponercartaentablero' ) {
            
              this.cartasDelTablero.push({
                cartaId: event.carta.cartaId.uuid,
                poder: event.carta.poder,
                estaOculta: event.carta.estaOculta,
                estaHabilitada: event.carta.estaHabilitada
              })
              if(event.jugadorId.uuid == this.uid) {
                this.cartasJugadorTablero.push(event.carta.cartaId.uuid)
              }
              
          }
          
          if (event.type === 'cardgame.cartaquitadadelmazo') {
            this.cartasDelJugador = this.cartasDelJugador
              .filter((item) => item.cartaId !== event.carta.cartaId.uuid);

          }         

          if (event.type === 'cardgame.tiempocambiadodeltablero') {
            this.tiempo = event.tiempo;
          }

          if (event.type === 'cardgame.rondacreada') {
            this.tiempo = event.tiempo;
            this.jugadoresRonda = event.ronda.jugadores.length;
            this.numeroRonda = event.ronda.numero;
          }

          if(event.type === 'cardgame.rondainiciada'){
            this.roundStarted = true;
          }

          if(event.type === 'cardgame.rondaterminada'){
            this.roundStarted = false;
            this.cartasDelTablero = []
            this.cartasJugadorTablero = []
          }

          if(event.type === 'cardgame.juegofinalizado') {
            this.ganadorAlias = "Ganador:" + event.alias;
            this.ganador = true;
          }

          if(event.type === 'cardgame.cartaquitadadeltablero') {
            let carta: Carta[]
            carta = this.cartasDelTablero.filter(carta => carta.cartaId === event.cartaId)
            this.cartasDelJugador.push(carta[0])
            this.cartasDelTablero = this.cartasDelTablero.filter(cartas => cartas.cartaId !== event.cartaId)
          }

          if(event.type === 'cardgame.cartasasignadasajugador'){
            if(event.ganadorId.uuid === this.uid){
              event.cartasApuesta.forEach((carta: any) => {
                this.cartasDelJugador.push({
                  cartaId: carta.cartaId.uuid,
                  poder: carta.poder,
                  estaOculta: carta.estaOculta,
                  estaHabilitada: carta.estaHabilitada
                });
              });
              alert("Ganaste la ronda!")
            }else{
              alert("Perdiste la ronda :(")
            }
          }
        },
        error: (err:any) => console.log(err),
        complete: () => console.log('complete')
      });
    });
  }


  ngOnDestroy(): void {
    this.ws.close();
  }

  poner(cartaId: string) {
    this.api.ponerCarta({
      cartaId: cartaId,
      juegoId: this.juegoId,
      jugadorId: this.uid
    }).subscribe();
  }


  comparar(cartaId: string) {
   return this.cartasJugadorTablero.includes(cartaId)
  }

  quitar(cartaId: string) {
    this.api.quitarCarta({
      cartaId: cartaId,
      juegoId: this.juegoId,
      jugadorId: this.uid
    }).subscribe();
  }

  iniciarRonda(){
    this.api.iniciarRonda({
      juegoId: this.juegoId,
    }).subscribe();
  }



}

