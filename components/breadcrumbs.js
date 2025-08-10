export class SbBreadcrumbs extends HTMLElement {
  constructor(rootName, path) {
    super();

    const shadowRoot = this.attachShadow({
      mode: "open",
    });

    let rootViable = rootName !== undefined && rootName !== null && rootName.length > 0;
    let pathViable = path !== undefined && path !== null && path.length > 0
    let breadcrumbs = [];

    // Add a link to the home page
    // This will always be the first breadcrumb
    // If the rootName is empty, do not add a link
    if (!rootViable) {
      breadcrumbs.push(`<div class="segment_current">Home</div>`);
    } else {
      breadcrumbs.push(`<div class="segment"><a href="/">Home</a></div>`);

      // Add the root name as the first breadcrumb
      // If the path is empty, don´t add a link
      if (!pathViable) {
        breadcrumbs.push(`<div class="segment_current">${rootName}</div>`);
      } else {
        breadcrumbs.push(`<div class="segment"><a href="/roots/${encodeURIComponent(rootName)}/path/">${rootName}</a></div>`);
   
        // If path starts with a slash, remove it
        if (path.startsWith("/")) {
          path = path.substring(1);
        }

        let pathSegments = path.split("/").filter(segment => segment.length > 0);
        breadcrumbs.push(...pathSegments.map((segment, index) => {
          // Create a link for each segment in the path
          // The link will point to the path up to that segment
          // Do not create a link for the last segment
          if (index === pathSegments.length - 1) {
            return `<div class="segment_current">${segment}</div>`;
          } 
        
          let href = `/roots/${encodeURIComponent(rootName)}/path/${encodeURI(pathSegments.slice(0, index + 1).join("/"))}`;
          return `<div class="segment"><a href="${href}">${segment}</a></div>`;
        }));
      }
    }

    shadowRoot.innerHTML = /*html*/ `
      <style>
          nav#breadcrumbs {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            padding: 0.5rem;
          }

          nav#breadcrumbs .segment {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            /* background is a gradient from secondary to secondary-light in a 45 degree angle */
            background: linear-gradient(45deg, var(--secondary) 0%, var(--secondary-light) 100%);
            border-radius: 0.25rem;
            color: var(--secondary-dark);
            text-decoration: none;
          }

          nav#breadcrumbs .segment a {
            color: var(--secondary-dark);
            text-decoration: none;
          }

          nav#breadcrumbs .segment_current {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            /* background is a gradient from secondary to secondary-light in a 45 degree angle */
            background: linear-gradient(45deg, var(--secondary-dark) 0%, var(--secondary) 100%);
            border-radius: 0.25rem;
            color: var(--secondary-light);
            text-decoration: none;
          }

          nav#breadcrumbs .separator {
            display: inline-block;
            padding: 0.25rem;
            color: var(--secondary-dark);
          }

      </style>
      <nav id="breadcrumbs">
        ${breadcrumbs.join('<div class="separator">/</div>')}
      </nav>
    `;

    this.rootName = rootName;
    this.path = path;
  }
}

customElements.define("sb-breadcrumbs", SbBreadcrumbs);