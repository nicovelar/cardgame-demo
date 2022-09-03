import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JuegoModel } from 'src/app/shared/model/juego';
import { ApiService } from 'src/app/shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import Swal from 'sweetalert2'



@Component({
  selector: 'app-list-game',
  templateUrl: './list-game.component.html',
  styleUrls: ['./list-game.component.scss']
})
export class ListGameComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['alias', 'cantidad', 'iniciado', 'id', 'eliminar','ganador'];
  dataSource: JuegoModel[] = [];
  constructor(
    public api: ApiService,
    public authService: AuthService,
    public ws: WebsocketService,
    public router: Router,
  ) {

  }
  ngOnDestroy(): void {
  this.ws.close()
  }

  ngOnInit(): void {
    this.api.getMisJuegos(this.authService.user.uid).subscribe((elements) => {
      this.dataSource = elements;
    });
  }

  entrar(id: string) {
  this.router.navigate(['board', id]);
  }

  iniciar(id: string) {
    this.ws.connect(id).subscribe({
    
      next: (event:any) => {
        if(event.type === 'cardgame.tablerocreado'){     
          this.api.crearRonda({
              juegoId: id,
              tiempo: 60,
              jugadores: event.jugadorIds.map((it:any) => it.uuid) 
          }).subscribe();
        }
       
        if(event.type == 'cardgame.rondacreada'){
          this.router.navigate(['board/'+id]);
        }
        
      },
      error: (err:any) => console.log(err),
    });
   
    this.api.iniciar({ juegoId: id }).subscribe();
  }


  eliminar(id: string) {

    Swal.fire({
      title: '¿Seguro que quieres eliminar el JUEGO?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, elimínalo!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Eliminado',
          'El juego fue eliminado.',
          'success'
        )
        this.ws.connect(id).subscribe({
    
          next: (event:any) => {
            if(event.type === 'cardgame.juegoeliminado'){     
              this.dataSource = this.dataSource.filter(juego => juego.id !== event.aggregateRootId)
            }
           
          },
          error: (err:any) => console.log(err),
        });
    
        this.api.eliminarJuego({ juegoId: id }).subscribe();
      }
    })

    }
    
}

  
    
   
 


 