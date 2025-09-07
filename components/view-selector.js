export class SbViewSelector extends HTMLElement {
  constructor(currentView) {
    super();

    console.log(currentView);

    const shadowRoot = this.attachShadow({
      mode: "open",
    });

    shadowRoot.innerHTML = /*html*/ `
      <style>
          nav#view-selector {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            padding: 0.5rem;
          }

          nav#view-selector .selection-item {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            /* background is a gradient from secondary to secondary-light in a 45 degree angle */
            background: linear-gradient(45deg, var(--secondary) 0%, var(--secondary-light) 100%);
            border-radius: 0.25rem;
            color: var(--secondary-dark);
            text-decoration: none;
          }

          nav#view-selector .selected {
            background: linear-gradient(45deg, var(--secondary-dark) 0%, var(--secondary) 100%);
          }

          nav#view-selector .selection-item svg {
            vertical-align: middle;
          }

          nav#view-selector .selected svg {
            fill: var(--secondary-light);
          }
      </style>
      <nav id="view-selector">
        <div id="selector-grid" class="selection-item${currentView === 'grid' ? " selected": ""}">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z"/></svg>
        </div>
        <div id="selector-list" class="selection-item${currentView === 'list' ? " selected": ""}">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M360-240h440v-107H360v107ZM160-613h120v-107H160v107Zm0 187h120v-107H160v107Zm0 186h120v-107H160v107Zm200-186h440v-107H360v107Zm0-187h440v-107H360v107ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z"/></svg>
        </div>
      </nav>
    `;

    this.shadowRoot.querySelector("#selector-grid")
      .addEventListener("click", () => this.#switch("grid"));
    this.shadowRoot.querySelector("#selector-list")
      .addEventListener("click", () => this.#switch("list"));
  }

  #switch(view) {
    const params = new URL(window.location.href).searchParams;

    params.set("view", view);

    window.location.search = params.toString();
  }
}

customElements.define("sb-view-selector", SbViewSelector);