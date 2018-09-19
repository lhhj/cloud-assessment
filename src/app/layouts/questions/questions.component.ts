import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
// config
import { Config } from '../../data/Config';
// model
import QuestionItem from '../../classes/QuestionItem';
// service
import { WorkFlowService } from '../../services/work-flow.service';
import { SubmitServiceService } from '../../services/submit-service.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  private formSubmitted: boolean;
  showModal: boolean;
  currentQuestion: QuestionItem;
  @ViewChild('myform') form: NgForm;

  constructor(
    private router: Router,
    private workFlowService: WorkFlowService,
    private submitServiceService: SubmitServiceService
  ) { }

  ngOnInit() {
    this.showModal = false;
    this.currentQuestion = this.workFlowService.current();
    this.formSubmitted = false;
  }

  get subTitle(): string {
    let subtitle = '';
    subtitle += this.currentQuestion.Category ? this.currentQuestion.Category + ' > ' : '';
    subtitle += this.currentQuestion.SubCategory ? this.currentQuestion.SubCategory + ' > ' : '';
    subtitle += this.currentQuestion.Quality ? this.currentQuestion.Quality : '';
    return subtitle;
  }

  get processBar(): string {
    return (this.workFlowService.index + 1) + ' of ' + this.workFlowService.count;
  }

  get processBarProgress(): number {
    return Math.floor((this.workFlowService.index + 1) / this.workFlowService.count * 100);
  }

  get showPrevious(): boolean {
    return true;
    // return !this.workFlowService.isFirst;
  }

  get showError(): boolean {
    return this.form.invalid && this.formSubmitted;
  }

  get checkValidity(): boolean {
    const result = this.currentQuestion.AssessmentValue.filter(x => x.checked).length === 0;
    return result;
  }

  goPrevious() {
    this.formReset();
    // todo unique url per question
    // this.router.navigateByUrl(Config.RoutePath.QUESTIONS + `/${this.workFlowService.currentIndex}`);
    if (this.workFlowService.isFirst) {
      this.router.navigateByUrl(Config.RoutePath.GENERALQUESTION);
    } else {
      this.currentQuestion = this.workFlowService.Previous();
    }
  }

  goNext() {
    if (this.form.valid) {
      window.scroll(0, 0);

      // reset  conditional value is condition changed
      if (this.form.dirty) {
        const asd_certified_index = (19 - 2);
        const IRAP_assessment_index = (20 - 2);
        const cloud_model_index = (3 - 2);

        switch (this.workFlowService.index) {
          case asd_certified_index:
            if (this.workFlowService.appData.AssessmentQuestion[(20 - 2)]) {
              this.workFlowService.appData.AssessmentQuestion[(20 - 2)].AssessmentValue = '';
              this.workFlowService.appData.AssessmentQuestion[(21 - 2)].AssessmentValue = '';
            }
            break;
          case IRAP_assessment_index:
            if (this.workFlowService.appData.AssessmentQuestion[(21 - 2)]) {
              this.workFlowService.appData.AssessmentQuestion[(21 - 2)].AssessmentValue = '';
            }
            break;
          case cloud_model_index:
            if (this.workFlowService.appData.AssessmentQuestion[(22 - 2)]) {
              this.workFlowService.appData.AssessmentQuestion[(22 - 2)].AssessmentValue = '';
              this.workFlowService.appData.AssessmentQuestion[(23 - 2)].AssessmentValue = '';
              this.workFlowService.appData.AssessmentQuestion[(27 - 2)].AssessmentValue = '';
              this.workFlowService.appData.AssessmentQuestion[(28 - 2)].AssessmentValue = '';
              this.workFlowService.appData.AssessmentQuestion[(29 - 2)].AssessmentValue = '';
              this.workFlowService.appData.AssessmentQuestion[(41 - 2)].AssessmentValue = '';
            }
            break;
        }
      }

      // this.localStorageService.set(this.workFlowService.appData);
      this.workFlowService.localStorageSave();
      this.currentQuestion = this.workFlowService.Next();
      if (this.currentQuestion === undefined) {
        // this.localStorageService.clear();
        this.saveReport();
        this.workFlowService.localStorageClear();
        this.router.navigateByUrl(Config.RoutePath.RESULT);
      } else {
        this.formReset();
        // todo unique url per question
        // this.router.navigateByUrl(Config.RoutePath.QUESTIONS + `/${this.workFlowService.currentIndex + 1}`);
      }
    } else {
      this.formSubmitted = true;
    }
  }

  private formReset() {
    this.formSubmitted = false;
  }

  saveButtonClick() {
    this.showModal = true;
  }

  saveExit() {
    this.workFlowService.localStorageSave();
    this.showModal = false;
    this.router.navigateByUrl(Config.RoutePath.HOME);
  }

  saveCancel() {
    this.showModal = false;
  }

  saveReport() {
    // todo remove console
    this.submitServiceService.submitReport()
      .subscribe(data => console.log(data));
  }
}
