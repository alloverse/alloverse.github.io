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

## The non-tutorial

Open up `Program.cs` and replace it with:

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
        App app;
        static void Main(string[] args)
        {
            Program sample = new Program();
            sample.Run(args[0]);
        }

        void Run(string url)
        {
            app = new App(new AlloClient(), "fancyapp");
            app.mainView = MakeMainUI();
            app.Connect(url);
            app.Run(20);
        }

        View MakeMainUI()
        {
            Cube cube = new Cube{
                Bounds= new Bounds{
                    Size= new Size(1.0, 1.0, 0.10)
                }.Move(0, 1.5, -2),
                Color= new Color(0.9, 0.7, 0.9, 1)
            };
            Label label = cube.addSubview(new Label{
                Bounds= new Bounds {
                    Size= new Size(cube.Bounds.Size.Width, 0.1, 0.01)
                }.Move(0, cube.Bounds.Size.Height/2 - 0.12, cube.Bounds.Size.Depth/2.0),
                Text= "Hello World!"
            });

            Button button = cube.addSubview(new Button{
                Bounds= new Bounds {
                    Size= new Size(0.6, 0.13, 0.1)
                }.Move(0, 0, cube.Bounds.Size.Depth/2.0 + 0.05),
            });
            button.Label.Text = "Do the thing";
            button.Action += delegate(object sender, Button.ActionArgs args) {
                button.Cube.Color = Color.Random();
            };

            Slider slider = cube.addSubview(new Slider{
                Bounds= new Bounds {
                    Size= new Size(0.8, 0.13, 0.1)
                }.Move(0, -0.3, cube.Bounds.Size.Depth/2.0 + 0.05),
            });
            slider.Action += delegate(object sender, Slider.ActionArgs args) {
                label.Text = $"{args.Value}";
            };

            cube.IsGrabbable = true;
            return cube;
        }
    }
}

{% endhighlight %}
