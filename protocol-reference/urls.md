---
layout: default
title: URL Definitions
permalink: /protocol-reference/url-definitions
parent: Protocol Reference
---

# {{ page.title }}

URLs are used to identify and locate various resources in Alloverse. This document should be a full list of such URLs and their format.

## Alloplace

There is currently one format for locating an alloplace server:

`alloplace://{host}:{port}`

- `host`: Hostname or IP of machine that is running the `alloplace` service
- `port`: This is the enet UDP endpoint for the listen socket. Optional: default value is 21337.

Such an URL should be fed into `alloclient_connect` or its high-level equivalents, and `allonet` will take care
of parsing and connecting to the server at that URL.

### Virtual hosting (unimplemented)

The downside of this scheme is that it doesn't allow for virtual hosting: with the same domain name for the same
IP, you'll end up at the same placeserv unless you include a custom port in the URL, which is ugly.

One solution is to use a HTTPS gateway which returns the real alloplace URL given a URL of this form:

`alloplacegw:http(s)://{host}:{port}/{path}`

Another solution is to have a "load balancer" allplace socket which forwards to an internal instance. This
solution can use the original `alloplace://` url schema.

## Alloapp

An alloapp is launched with an URL in this format:

`alloapp:http(s)://{host}:{port}/{path}?{params}`

This is a HTTP(S) gateway endpoint which is basically a "CGI launcher". Upon POST, it'll launch an instance of
the app and connect it to the requested alloplace. Please [read more over on the topic of hosting](/hosting).

You can launch this gateway by calling `./allo/assist serve` inside an alloapp.

When an alloplace accesses the above URL, it will fill in these HTTP headers:

* `x-alloverse-server`: The `alloplace:` url of the place that the new app instance shouild connect to
* `x-alloverse-identity`: The identity blob of the user who requested the app launch

