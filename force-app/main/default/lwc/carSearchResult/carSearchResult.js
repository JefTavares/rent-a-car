import { LightningElement, api, wire, track } from "lwc";
import getCars from "@salesforce/apex/CarSearchResultController.getCars";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CarSearchResult extends LightningElement {
  @api carTypeId; //carTypeId fornecido pelo component pai

  @track cars;
  @track selectedCarId;

  //Passo o $ no tornando o wire mais reativo
  @wire(getCars, { carTypeId: "$carTypeId" })
  wiredCars({ data, error }) {
    if (data) {
      this.cars = data;
    } else if (error) {
      this.showToast("ERROR", error.body.message, "error");
    }
  }

  showToast(title, message, variant) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(evt);
  }

  //informa qual o car foi selecionado
  carSelectHandler(event) {
    const carId = event.detail;
    this.selectedCarId = carId;
  }

  get carsFound() {
    if (this.cars) {
      return true;
    }
    return false;
  }
}
