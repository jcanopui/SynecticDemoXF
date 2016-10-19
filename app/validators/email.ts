import {Control} from '@angular/common';
 
export class EmailValidator {
 
    static isValid(control: Control) : any {

        var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/; 
        
        return EMAIL_REGEXP.test(control.value) ? null : {
          isValid: {
              valid: false
          }
        };
    }
 
}