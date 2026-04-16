# Understanding HTTP - Project Flow

This section builds up from raw HTTP basics to a small full-stack framework project.

## Learning Flow

### 1. `1-create-http-server`
- Starts with a basic Node.js HTTP server.
- Focus: how a server listens for requests and sends responses.

### 2. `2-create-client-send-request`
- Adds a client that sends HTTP requests to the server.
- Focus: request and response communication between two programs.

### 3. `3-sending-http-request-directly-on-tcp`
- Drops down to the TCP level to show that HTTP is just text sent over a socket.
- Focus: understanding the raw structure of an HTTP request and response.

### 4. `4-create-http-server`
- Serves real static files like HTML, CSS, and JavaScript.
- Focus: routing file requests and returning the correct content type.

### 5. `5-create-mini-express-framework`
- Introduces the custom `Butter` framework.
- Focus: creating reusable helpers like `route()`, `res.status()`, `res.json()`, and `res.sendFile()`.

### 5.1 `5.1-project-with-mini-framework/poster`
- Uses the mini framework in a small project.
- Focus: applying the framework to serve pages and basic API routes.

### 6. `6-http-proxy-server`
- Adds a proxy in front of multiple servers.
- Focus: load balancing, forwarding requests, and returning backend responses.

### 7. `7-full-stack-mini-framework`
- Combines static file serving, API routes, login, sessions, middleware, and protected routes.
- Focus: how a mini full-stack app works end to end.

## Core Flow of `Butter`

The main framework file is [butter.js](</d:/uncc-code/7.SectionRealSeven - Understanding HTTP/butter.js:1>).

When a request reaches the server, the flow is:

1. `http.createServer()` receives the request.
2. `Butter` adds helper methods to `res`:
   - `res.sendFile()`
   - `res.status()`
   - `res.json()`
3. `runMiddleware(req, res, this.middleware, 0)` starts the middleware chain.
4. Each middleware decides whether to:
   - handle the request immediately, or
   - call `next()` so the next middleware can run.
5. After all middleware finishes, `Butter` checks for a matching route.
6. If a route exists, the route handler runs.
7. If no route exists, the server returns `404`.

So the real order is:

`request -> response helpers -> middleware chain -> route handler -> response`

## What `runMiddleware` Does

`runMiddleware` is a recursive function that runs every middleware function in order.

Simplified idea:

```js
const runMiddleware = (req, res, middleware, index) => {
    if (index === middleware.length) {
        // no middleware left, go to the route
        runRouteHandler();
    } else {
        middleware[index](req, res, () => {
            runMiddleware(req, res, middleware, index + 1);
        });
    }
};
```

## Why It Uses Recursion

Each middleware gets a `next` function.

When middleware calls `next()`, it triggers:

- the same `runMiddleware` function
- with the next index
- so the next middleware runs

That means:

- middleware `0` runs first
- then middleware `1`
- then middleware `2`
- and so on

When the index reaches `middleware.length`, there is nothing left to run, so `Butter` moves to the route handler.

## `runMiddleware` Step by Step

From [butter.js](</d:/uncc-code/7.SectionRealSeven - Understanding HTTP/butter.js:40>):

```js
const runMiddleware = (req, res, middleware, index) => {
    if (index === middleware.length) {
        if (!this.routes[req.method.toLocaleLowerCase() + req.url]) {
            return res
                .status(404)
                .json({ error: `Cannot ${req.method} ${req.url}` });
        }

        this.routes[req.method.toLowerCase() + req.url](req, res);
    } else {
        middleware[index](req, res, () => {
            runMiddleware(req, res, middleware, index + 1);
        });
    }
};
```

### Explanation

#### `if (index === middleware.length)`
- This is the stopping condition.
- It means all middleware already ran.
- Now the framework should look for the correct route.

#### Route lookup
- The route key is built from:
  - `req.method.toLowerCase()`
  - `req.url`
- Example:
  - `GET /api/user` becomes `get/api/user`

#### 404 handling
- If the route does not exist in `this.routes`, `Butter` sends:

```js
res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
```

#### Middleware execution
- If there is still middleware left, `Butter` runs:

```js
middleware[index](req, res, () => {
    runMiddleware(req, res, middleware, index + 1);
});
```

- `middleware[index]` is the current middleware.
- It receives:
  - `req`
  - `res`
  - `next`
- If it calls `next()`, the next middleware starts.

## Example From `7-full-stack-mini-framework`

In [server.js](</d:/uncc-code/7.SectionRealSeven - Understanding HTTP/7-full-stack-mini-framework/server.js:1>), middleware is registered with `server.beforeEach(...)`.

Order matters:

1. Authentication middleware
2. JSON body parser middleware
3. SPA/static page middleware

So for a request like `POST /api/posts`, the flow is:

1. Auth middleware checks the session token.
2. JSON middleware parses the request body and stores it on `req.body`.
3. Page-serving middleware skips this route.
4. Route handler for `post/api/posts` runs.

For a request like `GET /profile`, the flow is:

1. Auth middleware checks whether this route needs auth.
2. JSON middleware skips because there is no JSON body.
3. Page middleware sends `index.html`.
4. The route handler is never needed because the middleware already finished the response.

## Important Idea About `next()`

If a middleware does **not** call `next()`, the chain stops there.

That is useful when middleware wants to:

- reject a request with `401 Unauthorized`
- send a file directly
- end the response early

Example:

```js
if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
}
```

Since `next()` is not called, the next middleware and the route handler never run.

## In Short

`runMiddleware` is the controller of the request pipeline.

Its job is to:

- run middleware one by one in order
- wait for each middleware to call `next()`
- stop early if a middleware sends a response
- move to the final route when all middleware is done

That is what gives `Butter` an Express-like flow.
