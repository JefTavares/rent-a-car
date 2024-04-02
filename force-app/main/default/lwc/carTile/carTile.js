import { LightningElement, api, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent } from "c/pubsub";

export default class CarTile extends LightningElement {
  @api car; //esse component car sera fornecido pelo component pai carSearch
  @api carSelectedId;

  @wire(CurrentPageReference) pageRef;

  handleCarSelect(event) {
    event.preventDefault();

    const carId = this.car.Id; //pega o id do carro selecionado para passar ao pai

    //cria o evento
    const carSelect = new CustomEvent("carselect", { detail: carId });
    //? envia para o component (carSearchResult) pai o evento
    //? esta lá no carSearchResult.html dentro da tag  o carSelect
    this.dispatchEvent(carSelect);

    fireEvent(this.pageRef, "carselect", this.car.Id);
  }

  //Utilizado na property da img do html
  get isCarSelected() {
    if (this.car.Id === this.carSelectedId) {
      return "tile selected"; //devolve as class css
    }
    return "tile";
  }
}
