import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTime, Platform  } from 'ionic-angular';

import { EmailValidator } from  '../../../validators/email';

@Component({
  templateUrl: './build/pages/forms/basic/template.html'
})
export class BasicPage {

  myForm: FormGroup;
  private myData: any;

  countries = ["Albania (República de Albania)", "Alemania (República Federal de Alemania)", "Andorra (Principado de Andorra)", "Armenia (República de Armenia) *", "Austria (República de Austria)", "Azerbaiyán (República de Azerbaiyán) *", "Bélgica (Reino de Bélgica)", "Bielorrusia (República de Belarús)", "Bosnia y Herzegovina (Bosnia y Herzegovina)", "Bulgaria (República de Bulgaria)", "Chipre (República de Chipre) *", "Ciudad del Vaticano (Estado de la Ciudad del Vaticano)", "Croacia (República de Croacia)", "Dinamarca (Reino de Dinamarca)", "Eslovaquia (República Eslovaca)", "Eslovenia (República de Eslovenia)", "España (Reino de España)", "Estonia (República de Estonia)", "Finlandia (República de Finlandia)", "Francia (República Francesa)", "Georgia (Georgia) *", "Grecia (República Helénica)", "Hungría (Hungría)", "Irlanda (República de Irlanda)", "Islandia (Islandia)", "Italia (República Italiana)", "Kazajistán (República de Kazajistán) *", "Letonia (República de Letonia)", "Liechtenstein (Principado de Leichtenstein)", "Lituania (República de Lituania)", "Luxemburgo (Gran Ducado de Luxemburgo)", "Malta (República de Malta)", "Moldavia (República de Moldavia)", "Mónaco (Principado de Mónaco)", "Montenegro (Montenegro)", "Noruega (Reino de Noruega)", "Países Bajos (Reino de los Países Bajos)", "Polonia (República de Polonia)", "Portugal (República Portuguesa)", "Reino Unido (Reino Unido de Gran Bretaña e Irlanda del Norte)", "República Checa (República Checa)", "República de Macedonia (República de Macedonia)", "Rumanía (Rumanía)", "Rusia (Federación de Rusia) *", "San Marino (Serenísima República de San Marino)", "Serbia (República de Serbia)", "Suecia (Reino de Suecia)", "Suiza (Confederación Suiza)", "Turquía (República de Turquía) *", "Ucrania (Ucrania)"];
  colors = ["White", "Silver", "Gray", "Black", "Red", "Maroon", "Yellow", "Olive", "Lime", "Green", "Aqua", "Teal", "Blue", "Navy", "Fuchsia", "Purple"];

  @ViewChild('dateTimePicker') thing: DateTime;

  submitAttempt: boolean = false;

  constructor(public platform: Platform, private builder: FormBuilder) {

    this.myForm = builder.group({
      'name': ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      'birthDate': ['',Validators.required],
      'hour': ['',Validators.required],
      'email': ['', EmailValidator.isValid],
      'country': ['',Validators.required],
      'amount': ['',Validators.required],
      'favouriteColors': ['',Validators.required],
      'observations': ['',Validators.required]
    })

    platform.ready().then(() => {
      this.thing.setValue(this.getActualDateMinusYears(0));
      this.thing.max = this.getActualDateMinusYears(0);
      this.thing.min = this.getActualDateMinusYears(125);;
    })
  }

  onSubmit(formData) {

    this.submitAttempt = true;

    console.log('Form data is ', formData);
    this.myData = formData;
  }

  getActualDateMinusYears(years) : string {

    var stringDate = '';

    var today = new Date();
    var i_dd = today.getDate();
    var i_mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear() - years;

    var s_dd : string = i_dd + '';
    var s_mm : string = i_mm + '';

    if(i_dd<10) {
        s_dd='0'+i_dd
    } 

    if(i_mm<10) {
        s_mm='0'+i_mm
    } 

    stringDate = yyyy+'-'+s_mm+'-'+s_dd;

    return stringDate;
  }
}