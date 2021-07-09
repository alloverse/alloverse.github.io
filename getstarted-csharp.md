---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Get Started (C#)
permalink: /csharp
nav_order: 2
---

# {{ page.title }}
{: .no_toc }

<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
1. TOC
{:toc}
</details>

## Introduction

For an overview of what Alloverse and alloapps are, please see the
first chapters of the [Get Started (Lua)](/) guide. 

Note that Lua is the preferred alloapp language, and 
**C# language support is in beta**.

## Prerequisites

To write Alloverse apps in C#, you'll need the following:

* [The Alloverse app](https://www.alloverse.com/download/).
* Either Visual Studio Community >= 2019 (on a Mac or Windows machine)...
* Or a plain text editor for code (We recommend Visual Studio Code), together with a command line terminal.

Personally, I'm more of a Linux/Mac with command line kind of person,
so this guide will primarily be using the `dotnet`. I'll try to include
the equivalent Visual Studio screenshots so that you can follow along
without using a Terminal.

## Creating your project

Let's create a new C# project:

{% highlight terminal %}
$ dotnet new console -n fancyapp
$ cd fancyapp
{% endhighlight %}

Add AlloUI as a dependency:

{% highlight terminal %}
$ dotnet add package AlloUI
{% endhighlight %}

You remember how I said at the top that this is a beta? There's
one really terrible hack you'll have to do until I figure out how
to properly package native code in a nuget package.

You have to manually download `liballonet.so`, and put it at
`/home/nevyn/Dev/allonet/build/liballonet.so`. This unfortunately
means that this'll only work on Linux for now.

{% highlight terminal %}
$ mkdir -p /home/nevyn/Dev/allonet/build/
$ curl -o /home/nevyn/Dev/allonet/build/liballonet.so https://alloverse-downloads-prod.s3.eu-north-1.amazonaws.com/allonet/3.0.63.g131e106/liballonet.so
{% endhighlight %}

## Setting up the basics

Open up `Program.cs`. The most basic setup for an alloapp is one which:

1. Creates an AlloClient and connects to the specified alloplace server,
2. and creates some basic UI elements,
3. and starts the runloop which will serve requests.

Modify your file to look something like this, adjusting to taste;

{% highlight csharp %}

using System;
using System.Diagnostics;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using AlloUI;

namespace fancyapp {
    class Program
    {
        // AlloUI.App manages your connection to the place
        App app;
        static void Main(string[] args)
        {
            Program sample = new Program();
            // Let's use the first commandline argument as the place's URL
            sample.Run(args[0]);
        }

        void Run(string url)
        {
            // This is step 1.
            // Create a client and an app which manages the connection for us.
            app = new App(new AlloClient(), "fancyapp");
            // Step 2 is to create our UI
            app.mainView = MakeMainUI();
            // Step 3: connect and run. Run never returns until program
            // is stopped.
            app.Connect(url);
            app.Run(20);
        }

        View MakeMainUI()
        {
            // Simple UI with a cube and a button
            Cube cube = new Cube{
                Bounds= new Bounds{
                    Size= new Size(1.0, 1.0, 0.10)
                }.Move(0, 1.5, -2),
                Color= new Color(0.9, 0.7, 0.9, 1)
            };
            // Button is laid on top of cube
            Button button = cube.addSubview(new Button{
                Bounds= new Bounds {
                    Size= new Size(0.6, 0.13, 0.1)
                }.Move(0, 0, cube.Bounds.Size.Depth/2.0 + 0.05),
            });
            button.Label.Text = "Do the thing";
            // handle clicking the button
            button.Action += delegate(object sender, Button.ActionArgs args) {
                Console.WriteLine("Hello world!");
            };
            button.Cube.Color = new Color(1,1,1,1);

            // make the cube moveable
            cube.IsGrabbable = true;
            return cube;
        }
    }
}

{% endhighlight %}

## Trying your app out

That’s it! You should now be able to start your project and see it appear in an Alloplace. If you don’t have one already, you can <!--get or rent a Place at [places.alloverse.com](places.alloverse.com/),--> use our sandbox [alloplace://sandbox.places.alloverse.com](alloplace://sandbox.places.alloverse.com/), or be ambitious and boot one on your own (`docker run -e ALLOPLACE_NAME="my place" -p 21337:21337/udp -it alloverse/alloplace2`). I'm gonna do the former:

{% highlight terminal %}
$ dotnet run alloplace://sandbox.places.alloverse.com
{% endhighlight %}

If it all checks out, you should be able to jump into that place on your VR headset or computer and press the button it has created.

[Download the Visor app](https://alloverse.com/download/) for your VR or desktop platform of choice, and then click “Connect”, “Sandbox” (or click the alloplace link of the place you’ve rented or started yourself).

![On the left, the UI of our app shown as a white rectangle with an orange button. On the left, a terminal showing the assist run command that instantiates the app; and the word Hello printed thrice.](/assets/images/hello-world-csharp.png "Hello world running inside Alloverse")
Our app running in Sandbox place. I’ve clicked our simple app’s white button button three times, and the laws of causality held up, printing "Hello" thrice to our terminal.

At this point, you could go off, do your own thing, read the documentation as you go. Or you could keep reading, and be guided through the development of a simple but functional todo list app, which will help establish the fundamentals and make it much easier for you to build real, complex apps.

This is also a good point at which to remind you: if you get stuck, or have questions or feedback, please [hop on Discord](https://discord.gg/KhdMU6P6Uw) and give it to us straight.

## Surprise ending

This is where one would expect the tutorial to _really_ get started, 
teaching the deeper concepts and doing something more advanced. But alas,
the number of hours in a day are finite, and the docs are left unwritten.

Maybe see it as a challenge? "Left as an exercise to the reader" and all that.
Who knows, maybe you end up sending us a 
[docs improvement PR](https://github.com/alloverse/alloverse.github.io/compare)?
;)

And again, if you have any questions, [hop on Discord](https://discord.gg/KhdMU6P6Uw)!
