import { SbPathList } from "../components/path-list";
import { SbPathGrid } from "../components/path-grid";
import { SbBreadcrumbs } from "../components/breadcrumbs";
import { SbHeader } from "../components/header";
import { SbViewSelector } from "../components/view-selector";

export class SbPath extends HTMLElement {
  constructor(params) {
    super();
    const shadowRoot = this.attachShadow({ mode: "open", slotAssignment: "manual", });
    this.rootName = params.rootName;
    this.path = params.path;
  }

  async connectedCallback() {
    let view = new URL(window.location.href).searchParams.get("view");
    
    if (!view || ["list", "grid"].indexOf(view) === -1) {
      view = "list";
    }

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
        <div id="view-selector"></div>
        <main>
          <div id="path-view"></div>
        </main>
      </div>
    `;

    const pathViewChild = view === "list" ? new SbPathList(this.rootName, this.path) : new SbPathGrid(this.rootName, this.path);

    this.shadowRoot.querySelector("#path-view").appendChild(pathViewChild);
    this.shadowRoot.querySelector("#breadcrumbs").appendChild(new SbBreadcrumbs(this.rootName, this.path));
    this.shadowRoot.querySelector("#breadcrumbs").appendChild(new SbViewSelector(view));
  }
}

customElements.define("sb-path", SbPath);
