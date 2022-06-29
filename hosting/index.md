---
layout: default
title: Hosting an Alloverse app
permalink: /hosting
nav_order: 9
---

# {{ page.title }}

So! You've built an Alloverse app, and now you want to host it on the Internet so that
other people can use it. This is very similar to hosting a web app: you put some code
on a server on the Internet, and then other people can access that server, and run
the code on that server to access your web app in their browser.

The one thing that is a bit weird to get your head around is that an alloapp isn't
accessed directly by the end user's browser! Instead, the APP talks to the PLACE,
and then the PLACE updates its world representation and sends this new world to the
USER's visor. 

![alloui](/assets/images/alloui.png)

When you're running an alloapp on your **local development machine**, you have used
`./allo/assist run alloplace://sandbox.places.alloverse.com` or something similar
to connect your app directly to a specific place. This is good for debugging,
or for demoing something to someone once. However, it won't let other users
in other Places launch your app, and also your app will stop running in the Place
e g when your laptop goes to sleep.

**In production**, you can run `./allo/assist serve` on a dedicated server to start
a http gateway. When an alloplace accesses this gateway, it will start a new instance
of your alloapp, and connect it to the alloplace that asked for it. This is how you put your
app properly on the internet, and let other people launch it to their Alloverse
Places.

## What's actually going on, underneath?

1. A user clicks an `alloapp:` URL on their computer or headset
2. If Alloverse Visor is already running on that device, and is connected to a place:
3. The Visor calls the interaction `launch_app` on the connected Place, asking it 
  to launch the app on behalf of the user.
4. The Place extracts the http(s) URL portion, and calls it with the URL to get back
  to the current place + identity of the requesting user (see 
  [url definition](/protocol-reference/url-definitions#alloapp) for full description).
5. The gateway launches a new instance of the app, and connects it to the calling place.

## Step-by-step best practice hosting

In the future, there will be a Dockerfile in the standard alloapp template. For now,
you can do something like this:

1. Put your code on a server somewhere. This server should have a nice DNS name and
   proper SSL certificates.
2. Using systemd or similar, configure the server to automatically run 
   `./allo/assist serve` in the root of your project on boot
3. [Setup an nginx SSL termination proxy](https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-load-balancing-with-ssl-termination) in front of it,
   with a `proxy_pass` to `http://localhost:8000` (which is where the gateway
   is running). (this is technically optional, but recommended)
4. If you did step 3, make sure to add a firewall disallowing traffic to port 8000.

You can now figure out the URL of your app. If your server is `example.com`, your
gateway is now available over HTTPS at `https://example.com`; or if you didn't
configure nginx or ssl, at `http://example.com:8000`. Take this URL, and prepend
`alloapp:`, so you get something like: **`alloapp:https://example.com/`**.
That's your app's URL!

In the hopefully not too distant future, you'll be able to log
onto [my.alloverse.com](https://my.alloverse.com) to register
your app metadata and URL. This will then publish your app to
the Marketplace inside Alloverse, so any user can access it.
