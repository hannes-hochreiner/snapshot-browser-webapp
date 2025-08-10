export class SbHeader extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({
      mode: "open",
    });

    shadowRoot.innerHTML = /*html*/ `
      <style>
        header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: linear-gradient(45deg, var(--primary-light) 0%, var(--primary) 100%);
          color: var(--primary-dark);
        }
      </style>
      <header>
        <h1>Snapshot Browser</h1>
      </header>
    `;
  }
}

customElements.define("sb-header", SbHeader);