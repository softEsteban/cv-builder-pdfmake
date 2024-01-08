import { Component, ViewChild } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { CvDataService } from 'src/app/services/cv.data.service';
import { CvHttpService } from 'src/app/services/cv.http.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent {

  @ViewChild('skillsSelect') skillsSelect: any;

  selectedSkill: string = "";
  searchQuery: string = "";
  searchQuery$: Subject<string> = new Subject<string>();

  showSpinner: boolean = false;
  skills: string[] = [];
  skillsRes: string[] = [];

  constructor(
    private cvHttpService: CvHttpService,
    private cvDataService: CvDataService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    const storedData = this.cvDataService.getSkillsData();
    if (storedData) {
      this.skills = storedData;
    }
  }

  addSkill() {
    const contains = this.skills.includes(this.selectedSkill || "");
    if (this.selectedSkill && !contains) {
      this.skills.push(this.selectedSkill)

      //Set data in service
      this.cvDataService.setSkillsData(this.skills);
    }
    else {
      this.alertService.showMessageAlert(`${this.selectedSkill} is already in skills`, 2);
    }
  }

  handleSearchChange() {
    this.showSpinner = true;

    if (this.searchQuery !== "") {
      // Delay the API request by 500 milliseconds
      this.searchQuery$
        .pipe(debounceTime(500))
        .subscribe(async (query) => {
          const skillRes = await this.cvHttpService.getSkills(query);

          if (skillRes.length > 0) {
            this.skillsRes = [...skillRes];
            this.skillsSelect.selected = true;
          } else {
            this.alertService.showMessageAlert(`${query} has no results!`, 3);
          }

          this.showSpinner = false;
        });

      // Emit the search query to trigger the API request
      this.searchQuery$.next(this.searchQuery);
    } else {
      this.showSpinner = false;
    }
  }

  deleteSkill(skillToDelete: string) {
    const index = this.skills.findIndex(skill => skill === skillToDelete);
    if (index !== -1) {
      this.skills.splice(index, 1);

      //Set data in service
      this.cvDataService.setSkillsData(this.skills);
    }
  }

}
