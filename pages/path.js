import { SbPathList } from "../components/path-list";
import { SbBreadcrumbs } from "../components/breadcrumbs";
import { SbHeader } from "../components/header";

export class SbPath extends HTMLElement {
  constructor(params) {
    super();
    const shadowRoot = this.attachShadow({ mode: "open", slotAssignment: "manual", });
    this.rootName = params.rootName;
    this.path = params.path;
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
          <div id="path-list"></div>
        </main>
      </div>
    `;

    this.shadowRoot.querySelector("#path-list").appendChild(new SbPathList(this.rootName, this.path));
    this.shadowRoot.querySelector("#breadcrumbs").appendChild(new SbBreadcrumbs(this.rootName, this.path));
  }
}

customElements.define("sb-path", SbPath);
