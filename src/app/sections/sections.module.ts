import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkillsComponent } from './skills/skills.component';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';


@NgModule({
  declarations: [
    PersonalInfoComponent,
    SkillsComponent,
    EducationComponent,
    ExperienceComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    PersonalInfoComponent,
    SkillsComponent,
    EducationComponent,
    ExperienceComponent
  ]
})
export class SectionsModule { }
