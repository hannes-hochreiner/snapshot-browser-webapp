export class SbPathGrid extends HTMLElement {
  constructor(rootName, path) {
    super();

    const shadowRoot = this.attachShadow({
      mode: "open",
    });

    shadowRoot.innerHTML = /*html*/ `
      <style>
        #path-list {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
          margin-top: 1rem;
        }        

        .path-item {
          margin: 0.25rem 0;
          border: 1px solid var(--primary-light);
          border-radius: 4px;
          padding: 0.5rem;
          color: var(--primary-dark);
        }

        .path-item {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 200px auto;
          text-decoration: none;
          color: var(--primary-dark);
          justify-items: center;
        }

        .image {
          height: 200px;
          justify-self: center;
        }

        .image svg {
          height: 100%;
          width: 100%;
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
          const image = (path.name.toLowerCase().endsWith(".png") || path.name.toLowerCase().endsWith(".jpg") || path.name.toLowerCase().endsWith(".jpeg") || path.name.toLowerCase().endsWith(".gif") || path.name.toLowerCase().endsWith(".bmp") || path.name.toLowerCase().endsWith(".webp")) ?
            /*html*/`<img class="image" src="/api/latest/roots/${encodeURIComponent(this.rootName)}/path${encodeURI(this.path + "/" + path.name)}" alt="${path.name}">` :
            /*html*/`<svg class="image" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>`;

          link = /*html*/`<a class="path-item" href="/api/latest/roots/${encodeURIComponent(this.rootName)}/path${encodeURI(this.path + "/" + path.name)}" target="_blank">
            ${image}
            <div class="description">${path.name}</div>
          </a>`;
        } else {
          link = /*html*/`<a class="path-item" href="/roots/${encodeURIComponent(this.rootName)}/path${encodeURI(this.path + "/" + path.name)}?view=grid">
            <svg class="image" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>
            <div class="description">${path.name}</div>
          </a>`;
        }
        
        return link;
      }).join("");
    } catch (error) {
      console.error(error.message);
    }
  }
}

customElements.define("sb-path-grid", SbPathGrid);