// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CVBuilderComponent } from './cv-builder/cv-builder.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'cv-builder', component: CVBuilderComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
