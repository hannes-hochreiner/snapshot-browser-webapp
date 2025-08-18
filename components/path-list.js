export class SbPathList extends HTMLElement {
  constructor(rootName, path) {
    super();

    const shadowRoot = this.attachShadow({
      mode: "open",
    });

    shadowRoot.innerHTML = /*html*/ `
      <style>
        #path-list {
          display: flex;
          flex-direction: column;
          padding: 1rem;
        }

        .path-item {
          margin: 0.25rem 0;
          border: 1px solid var(--primary-light);
          border-radius: 4px;
          padding: 0.5rem;
          color: var(--primary-dark);
        }

        .path-item a {
          text-decoration: none;
          color: var(--primary-dark);
        }
      </style>
      <div id="path-list">Loading list of paths...</div>
    `;

    this.rootName = rootName;

    if (!path.startsWith("/") && path.length > 0) {
      this.path = "/" + path;
    } else {
      this.path = path;
    }
  }

  async connectedCallback() {
    const url = `/api/latest/roots/${encodeURIComponent(this.rootName)}/path${encodeURI(this.path)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();

      const rootsList = this.shadowRoot.querySelector("#path-list");
      rootsList.innerHTML = result.sort((a, b) => a.name.localeCompare(b.name)).map((path) => {
        let link;

        if ("File" in path.details) {
          link = `<a href="/api/latest/roots/${encodeURIComponent(this.rootName)}/path${encodeURI(this.path + "/" + path.name)}" target="_blank">${path.name}</a>`;
        } else {
          link = `<a href="/roots/${encodeURIComponent(this.rootName)}/path${encodeURI(this.path + "/" + path.name)}">${path.name}</a>`;
        }
        
        return `<div class="path-item">${link}</div>`;
      }).join("");
    } catch (error) {
      console.error(error.message);
    }
  }
}

customElements.define("sb-path-list", SbPathList);