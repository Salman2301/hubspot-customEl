class HubSpotForm extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.innerHTML = `<style>${getGlobalStyle()}</style>`
    this._shadowRoot.innerHTML += body();


    this._setHUBSrc();
    // selector
    this.$loader = this._shadowRoot.querySelector(".loader");


    this._maxRetry = 3;
    this._retry = 1;
    this._initForm();
  }

  _initForm() {
    if (this._retry > this._maxRetry) {
      console.error("failed to load hubspot form after : ", this._retry);
      return;
    }
    const { hbspt } = window;

    if (hbspt) {

      this._formid = this.getAttribute("formid");
      this._renderForm();

    } else {
      console.log("retrying : ", this._retry);
      ++this._retry;
      setTimeout(() => {
        this._initForm();
      }, 100)
    }



  }
  _setHUBSrc() {
    let script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/v2.js";
    document.querySelector("body").append(script);
  }
  _renderForm() {
    if (!this._formid) return;
    if(!window.hbspt) return;
    window.hbspt.forms.create({
      portalId: "6341951",
      formId: this._formid
    });

    this.$loader.classList.add("hide")
  }

  set formid(value) {
    console.log(value)
    if (!value) return;
    this._formid = value;
    this._renderForm();
  }

  get formid() {
    return this._formid;
  }

   // Attribute observe and call back
   static get observedAttributes() {
    return [
      "formid"
    ];
  }

  
  attributeChangedCallback(attr, oldValue, newValue) {
    if(attr === "formid") {
      this.formid = newValue;
    }
  }
}

function body() {
  return `
  <img class="loader" src="https://static.wixstatic.com/media/46e3aa_d82bd5f4267041f4ae4b30645cebea6b~mv2.gif" />
  `
}

function getGlobalStyle() {
  return `
    .loader {
      position: absolute;
      width: 75px;
      top: calc(50vh - 75px);
      left: calc(50vw - 75px);
    }

    .hide {
      display: none;
    }
  `;
}


customElements.define('hub-spot-form', HubSpotForm);