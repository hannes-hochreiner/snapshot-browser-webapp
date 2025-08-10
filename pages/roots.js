import { SbRootsList } from "../components/roots-list";
import { SbBreadcrumbs } from "../components/breadcrumbs";

export class SbRoots extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open", slotAssignment: "manual", });
  }

  async connectedCallback() {
    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        div.content {
          display: flex;
          flex-direction: column;
        }
        main {
          margin: 0 1rem;
        }
      </style>
      <div class="content">
        <sb-header></sb-header>
        <div id="breadcrumbs"></div>
        <main>
          <p>Welcome to the Snapshot Browser! This is a simple web application that allows you to browse and manage your snapshots.</p>
          <div id="roots-list"></div>
        </main>
      </div>
    `;

    this.shadowRoot.querySelector("#roots-list").appendChild(new SbRootsList());
    this.shadowRoot.querySelector("#breadcrumbs").appendChild(new SbBreadcrumbs());
  }
}

customElements.define("sb-roots", SbRoots);