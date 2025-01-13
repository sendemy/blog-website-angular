import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NicknameService {
  private nicknameSubject = new BehaviorSubject<string>('User');
  nickname$ = this.nicknameSubject.asObservable();

  // Getter for the current nickname value
  get currentNickname(): string {
    return this.nicknameSubject.value;
  }

  // Update the nickname
  updateNickname(newNickname: string): void {
    this.nicknameSubject.next(newNickname);
  }
}
