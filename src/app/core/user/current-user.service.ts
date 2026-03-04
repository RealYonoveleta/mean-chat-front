import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { UserService } from '../../user/services/user.service';
import { filter, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  currentUser$ = this.authService.user$.pipe(
    filter((user) => !!user),
    switchMap((user) => this.userService.getUser(user.uid!)),
  );
}
