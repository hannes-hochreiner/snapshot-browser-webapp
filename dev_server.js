import spa from "./index.html";

Bun.serve({
  port: 8200,
  hostname: "localhost",
  // `routes` requires Bun v1.2.3+
  routes: {
    "/api/latest/roots": new Response(JSON.stringify(["root1", "root2"])),
    "/api/latest/roots/:rootName/path": req => {
      const rootName = req.params.rootName;

      if (rootName === "root1") {
        return new Response(JSON.stringify([
          {name: "tmp", details: {Directory: {}}},
          {name: "some file", details: {File: {}}}
        ]))
      } else if (rootName === "root2") {
        return new Response(JSON.stringify([{name: "Documents", details: {Directory: {}}}]));
      } else {
        return new Response("Root not found", { status: 404 });
      }
    },
    "/api/latest/roots/:rootName/path/": Response.redirect("/api/latest/roots/:rootName/path"),
    "/api/latest/roots/:rootName/path/*": req => {
      console.log("Request for path:", req.params, req);
      let url_parts = req.url.split("/path", 2);

      const path = url_parts.length > 1 ? url_parts[1] : "/";
      const { rootName } = req.params;
      if (rootName === "root1") {
        if (path === "/tmp") {
          return new Response(JSON.stringify([
            {name: "subdir", details: {Directory: {}}},
            {name: "file1.txt", details: {File: {}}},
            {name: "file2.txt", details: {File: {}}}
          ]));
        } else if (path === "/tmp/subdir") {
          return new Response(JSON.stringify([
            {name: "subfile1.txt", details: {File: {}}},
            {name: "subfile2.txt", details: {File: {}}}
          ]));
        }
      } else if (rootName === "root2" && path === "/Documents") {
        return new Response(JSON.stringify([{name: "report.pdf", details: {File: {}}}]));
      } else {
        return new Response("Path not found", { status: 404 });
      }
    },
    // Static routes
    // "/api/status": new Response("OK"),

    // Dynamic routes
    // "/users/:id": req => {
    //   return new Response(`Hello User ${req.params.id}!`);
    // },

    // Per-HTTP method handlers
    // "/api/posts": {
    //   GET: () => new Response("List posts"),
    //   POST: async req => {
    //     const body = await req.json();
    //     return Response.json({ created: true, ...body });
    //   },
    // },

    "/*": spa,

    // Wildcard route for all routes that start with "/api/" and aren't otherwise matched
    // "/api/*": Response.json({ message: "Not found" }, { status: 404 }),

    // Redirect from /blog/hello to /blog/hello/world
    // "/blog/hello": Response.redirect("/blog/hello/world"),

    // // Serve a file by buffering it in memory
    // "/favicon.ico": new Response(await Bun.file("./favicon.ico").bytes(), {
    //   headers: {
    //     "Content-Type": "image/x-icon",
    //   },
    // }),
  },

  // (optional) fallback for unmatched routes:
  // Required if Bun's version < 1.2.3
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});