import { LightningElement, api, track } from "lwc";
import getExperiences from "@salesforce/apex/CarExperience.getExperiences";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";

export default class CarExperiences extends NavigationMixin(LightningElement) {
  privateCarId;
  //@api carId; //propriedade reativa publica (Pois é enviado o valor no component pai), agora estamos fazendo por get e setters

  /*O que eu quero fazer aqui é sempre que essa propriedade for alterada eu quero ligar para minha get carExperience
método novamente para que possamos carregar o novo registro de experiência do carro de nosso servidor.
ara isso precisamos definir o getter e o setter para esta propriedade pública em vez de declarar diretamente
como propriedade pública.
*/
  @api
  get carId() {
    return this.privateCarId;
  }

  set carId(value) {
    this.privateCarId = value;
    this.getCarExperiences(); //atribui o valor e chama o getCar novamente
  }

  @track carExperiences = []; //propriedade reativa privada (Pois é utilizada/visivel apenas no component)

  connectedCallback() {
    this.getCarExperiences();
  }

  //Utiliza a classe APEX CarExperience e chama o metodo getExperiences importado
  /* Desta vez não posso usar o adaptador de fio porque não vou fazer meu servidor getExperiences
	O método que pode ser armazenado em cache e não armazenado em cache não pode ser chamado a partir do adaptador de conexão.
	A razão pela qual não estou tornando esse assunto armazenável em cache é porque sempre que o usuário adicionar um novo
	registro de experiência usando nosso componente Add Car Experience, queremos recuperar esse novo registro de experiência
	do servidor. Mas se você torná-lo armazenável em cache, há chances de que nossa solicitação nunca chegue ao Salesforce
	backend e nossa resposta será servida a partir do próprio cache profundo do navegador.
	É melhor não armazenarmos nossa resposta em cache no cache do navegador e torná-la uma chamada imperativa para Método getExperiences
	*/
  //*inclui o component como publico reativo pois esta sendo chamado em:
  //*experienceAddedHandler() do carDetails.js
  @api
  getCarExperiences() {
    getExperiences({ carId: this.privateCarId }) /** com a nova solução reativa removi o this.carId para o privateCarId */
      .then((experiences) => {
        this.carExperiences = experiences;
      })
      .catch((error) => {
        this.showToast("ERROR", error.body.message, "error");
      });
  }

  //Navega até o usuario.
  userClickHandler(event) {
    const userId = event.target.getAttribute("data-userid");
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: userId,
        objectApiName: "User",
        actionName: "view"
      }
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

  //Pergunta se temos Experiences para esse car
  get hasExperiences() {
    if (this.carExperiences.length > 0) {
      return true;
    }
    return false;
  }
}
