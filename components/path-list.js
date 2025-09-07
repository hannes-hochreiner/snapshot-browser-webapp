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

        .path-item a svg {
          vertical-align: middle;
          margin-right: 0.5rem;
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
          link = `<a href="/api/latest/roots/${encodeURIComponent(this.rootName)}/path${encodeURI(this.path + "/" + path.name)}" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>${path.name}</a>`;
        } else {
          link = `<a href="/roots/${encodeURIComponent(this.rootName)}/path${encodeURI(this.path + "/" + path.name)}"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>${path.name}</a>`;
        }
        
        return `<div class="path-item">${link}</div>`;
      }).join("");
    } catch (error) {
      console.error(error.message);
    }
  }
}

customElements.define("sb-path-list", SbPathList);