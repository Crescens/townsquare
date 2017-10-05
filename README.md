# townsquare.dtdb.co

Web based implementation of Doomtown: Reloaded

## FAQ v0.1

### Does't this look a lot like ~~Jinteki~~ TheIronThrone.Net? The ~~Android netrunner~~ Game of Thrones 2.0 online experience?

The original code is for [TheIronThrone.net](https://theironthrone.net) and was forked from [GitHub](https://github.com/cryogen/throneteki)

~~Glad you noticed!  Yes, jinteki was a huge inspiration for this project, as the interface is clean and user friendly, so I've tried to make this similar in a lot of ways~~

### Project Milestones and Current Progress

Client side - Implement React component for Locations
Server side - Dig into game pipeline and setup step
Documentation - Damn near everything

The code is written in node.js(server) and React/Redux.

Please follow the style of the existing code as much as possible.

Also bear in mind there is an .eslintrc file in the project so try to follow those rules.


## Development (Unmodified from TheIronThrone repo)

The game uses mongodb as storage so you'll need that installed and running.

```
Clone the repository
git submodule init
git submodule update
Run npm install
mkdir server/logs
cd server
node fetchdata.js
cd ..
node .
node server/gamenode
```

There are two exectuable components and you'll need to configure/run both to run a local server.  First is the lobby server and then there are game nodes.

For the lobby server, you'll need a file called server/config.js that should look like this:
```javascript
var config = {
  secret: 'somethingverysecret',
  dbPath: 'mongodb://127.0.0.1:27017/townsquare',
  mqUrl: 'tcp://127.0.0.1:6000' // This is the host/port of the Zero MQ server which does the node load balancing
};

module.exports = config;
```

For the game nodes you will need a file called server/gamenode/nodeconfig.js that looks like this:

```javascript
var config = {
  secret: 'somethingverysecret', // This needs to match the config above
  mqUrl: 'tcp://127.0.0.1:6000', // This is the host/port of the Zero MQ server which does the node load balancing and needs to match the config above
  socketioPort: 9500, // This is the port for the game node to listen on
  nodeIdentity: 'test1', // This is the identity of the node,
  host: 'localhost'
};

module.exports = config;
```

This will get you up and running in development mode.

For production:

```
npm run build
NODE_ENV=production PORT=4000 node .
```

Then for each game node (typically one per CPU/core):

```
PORT={port} SERVER={node-name} node server/gamenode
```

### Coding Guidelines

All JavaScript code included in Throneteki should pass (no errors, no warnings)
linting by [ESLint](http://eslint.org/), according to the rules defined in
`.eslintrc` at the root of this repo. To manually check that that is indeed the
case install ESLint and run

```
eslint client/ server/ test/
```

from repository's root.

All tests should also pass.  To run these manually do:

```
npm test
```

If you are making any game engine changes, these will not be accepted without unit tests to cover them.
