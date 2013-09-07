# PizzaByte

This is my sails.js/node.js web applictaion that is my entry for this course:

http://c2.etf.unsa.ba/course/view.php?id=171

## Rationale

Showcasing the power of web sockets and single-page apps. It uses the following technologies:

* [Sails.js](http://sailsjs.org/) as it's MVC backend, and RESTful database.
* [Knockout.js](http://knockoutjs.com/) as the front-end MVx engine for Single Page App implementation, augmentet with [Sammy.js](http://sammyjs.org/) used as SPA router. 
* [Socket.io](http://socket.io/) as web sockets implementation, [Express.js](http://expressjs.comno/) as web-service framework and [node.js](http://nodejs.org/) as the runtime, are the main technologies Sails.
* [jQuery](http://jquery.com/) is Knockout.js dependency, and is also used independently for DOM traversal, visual effects and AJAX.
* [Pure CSS](http://purecss.io/) is used to bootstrap graphic design of the front-end.

Quite obviously, the application is almost entirely written in JavaScript.

## What is it

It's a mockup pizza ordering app that enables users to order Pizza from a menu through the front-end, and pizzeria staff to print orders, mark them processed and edit the menu from the back-end.

## Installation

To run the app locally you need Node.js and while people have run node apps on Windows, I wouldn't know how to go about it, so to follow these steps a *nix machine (a VM will do fine) is recommended. The app and steps have been tested on Ubuntu Raring, Ubuntu Precise and OS X Mountain Lion under **nodeenv**, while the easy way was tested only under Raring. 

There are two ways to bootstrap.

### The easy way

Provided you already have node.js setup, you could simply clone this repo and install dependencies locally with `npm`:

    # git clone https://github.com/bmarkovic/pizzabyte.git
    # cd pizzabyte
    # npm install

Finally after all dependencies are installed you can run the app simply with:

    # node app.js

from within the `pizzabyte` directory.

### The recommended way

Sails requests fairly newish node. This might conflict with your other node apps. Luckily, the good people from Python land have forked their amazing tool for development environment virtualization `virtualenv` to node.js development world, and it's called, quite unexpectedly, `nodeenv`. 

Python is omnipresent but under OSX might be a tad incopatible with how things are done on Linux so a Python installed via [Homebrew](http://brew.sh/) would do you better.

So, for the first part the two OS-es differ.

Linux:

    # sudo apt-get install python-pip
    # sudo pip install nodeenv

Mac:

    # ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
    # brew install python
    # easy_install pip
    # pip install nodeenv

Further down the road the things are the same.

First we need to create a virtual node environment using `nodeenv`

    # nodeenv sails
    # cd sails
    # . bin/activate
    # npm install sails@0.8.94


It's important to use the pinned version of Sails.js as the framework is a moving target ATM. The 0.9 that was available at the time I've developed this app didn't handle multiple SPAs in one instance in the prefered way.

After bootstrapping you can proceed as in the easy way.

    # git clone https://github.com/bmarkovic/pizzabyte.git
    # cd pizzabyte
    # npm install

Additionally you can run the app from the global sails instance.

    # sails lift

Simply go to

http://localhost:1338/populate

to populate the database with a base menu and some orders and that's it.

The front end should be available at http://localhost:1338

To erase the old database (for re-population) delete the file `.tmp/dirty.db` relative to the directory you cloned the repository into (the `pizzabyte` directory)

## Usage

**Front end** is at the root of the app. It's a fairly simple wizard UI that is self explanatory really (tho it's not in English or I18N-ized at all ATM).

**Back office** is accessed at http://localhost:1338/bo and you can choose from the list which order to process, and look at it, print it out, or mark it processed, or use **Enter** to process the next order in line (the eldest, next order implements a FIFO).

## How it works

It uses socket.io to communicate between the offices. When a new order is made it's automatically added to the list (it "pings" the backend app via socket.io). When an order is processed in the backend it's simply marked as such in data storage and will no longer show up in the list. There are three SPAs (not counting the database fixture filler described above):

* Front office
* Order processing
* Menu editor

All are implemented as single page apps running entirely on the client side as Sails Views, each with it's own client-side MVVM code implemented using Knockout.js. Because asset management is slightly differnet for this approach in Sails post 0.9 (and I haven't worked out a way around it) it uses the last 0.8 version of Sails.

At the moment no authentication and security is implemented, mostly because Sails makes that part relatively trivial so it will likely change in some of the next commits.

(c) 2013 Bojan Marković / Elivero