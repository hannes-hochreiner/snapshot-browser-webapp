export class SbRootsList extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({
      mode: "open",
    });

    shadowRoot.innerHTML = /*html*/ `
      <style>
        #roots-list {
          display: flex;
          flex-direction: column;
          padding: 1rem;
        }

        .root-item {
          margin: 0.25rem 0;
          border: 1px solid var(--primary-light);
          border-radius: 4px;
          padding: 0.5rem;
          color: var(--primary-dark);
        }

        .root-item a {
          text-decoration: none;
          color: var(--primary-dark);
        }
      </style>
      <div id="roots-list">Loading list of roots...</div>
    `;
  }

  async connectedCallback() {
    const url = "/api/latest/roots";
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();

      const rootsList = this.shadowRoot.querySelector("#roots-list");
      rootsList.innerHTML = result.map((root) => `
        <div class="root-item">
          <a href="/roots/${encodeURIComponent(root)}/path/">${root}</a>
        </div>
      `).join("");
    } catch (error) {
      console.error(error.message);
    }
  }
}

customElements.define("sb-roots-list", SbRootsList);