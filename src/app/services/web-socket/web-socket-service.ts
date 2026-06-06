import { inject, Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {

  private client: Client;
  private connectionState = new BehaviorSubject<boolean>(false);

  constructor() {
    this.client = new Client({
      brokerURL: environment.wsUrl,
      reconnectDelay: 5000,
      onConnect: () => this.connectionState.next(true),
      onDisconnect: () => this.connectionState.next(false),
    });

    this.client.activate();
  }

  public subcribeToClickCounter(idUrl: number) {

    const subject = new Subject<number>();
    const topic = `/topic/url/${idUrl}`

    this.connectionState.subscribe(connected => {
      if (connected) {
        this.client.subscribe(topic, (message: IMessage) => {
          subject.next(Number(message.body));
        })
      }
    })

    return subject.asObservable()
  }

}
