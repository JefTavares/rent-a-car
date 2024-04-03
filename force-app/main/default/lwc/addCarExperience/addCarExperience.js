import { LightningElement, api } from "lwc";
import { createRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
/** Salesforce saberá que você está usando esses campos e objetos em seu
componente de Lightning.E se você for modificar ou excluir esses objetos ou campos do back-end do Salesforce, 
o Salesforce fornecerá um aviso de erro informando que você precisará modificar seu Lighting Web Component 
primeiro porque você estão usando esses campos e objetos em seu Lighting Web Component.
 */
import NAME_FIELD from "@salesforce/schema/Car_Experience__c.Name";
import EXPERIENCE_FIELD from "@salesforce/schema/Car_Experience__c.Experience__c";
import CAR_FIELD from "@salesforce/schema/Car_Experience__c.Car__c";
import EXPERIENCE_OBJECT from "@salesforce/schema/Car_Experience__c"; //objeto trabalhado, que sera salvo

export default class AddCarExperience extends LightningElement {
  @api carId; //é o car-id={car.Id} lá no carDetails.html

  //Os campos abaixo não precisa de nenhuma anotação de reatividade
  //por que são tipos primitivos (string no caso) e os tipos primitivos no lwc são reativos
  expTitle = "";
  expDescription = "";

  handleTitleChange(event) {
    this.expTitle = event.target.value;
  }

  handleDescriptionChange(event) {
    this.expDescription = event.target.value;
  }

  addExperience() {
    const fields = {};
    fields[NAME_FIELD.fieldApiName] = this.expTitle;
    fields[EXPERIENCE_FIELD.fieldApiName] = this.expDescription;
    fields[CAR_FIELD.fieldApiName] = this.carId;

    const recordInput = { apiName: EXPERIENCE_OBJECT.objectApiName, fields };

    createRecord(recordInput)
      .then((carExperience) => {
        this.showToast("SUCCESS", "Experience Record Updated", "success");
        console.log("carExperience>>" + carExperience);
        console.log("expTitle>>>" + this.expTitle);
        console.log("expDescription>>>" + this.expDescription);
        console.log("this.carId>>>" + this.carId);
        this.expTitle = "";
        this.expDescription = "";
        //this.template.querySelector("form").reset(); //reseta o valor dos campos
      })
      .catch((error) => {
        this.showToast("ERROR", error.body.message, "error");
      });
  }

  showToast(title, message, variant) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(evt);
  }
}
