import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
    /**
     * Angular knows that the route list is only responsible for providing additional routes
     *  and is intended for feature modules. You can use forChild() in multiple modules.
     */
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
