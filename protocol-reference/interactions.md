---
layout: default
title: Interactions
permalink: /protocol-reference/interactions
parent: Protocol Reference
---

# {{ page.title }}

These interactions are defined by alloserv. Third party developers may
create any interactions they want. They can vote to make their own
interactions official by opening an issue on this repo.

1. TOC
{:toc}

## Authentication and identity
### Agent announce

After an agent connects, before it can interact with the place
it must announce itself and spawn its avatar entity. Failure to
announce will lead to force disconnect.

- Receiver: `place`
- Type: `request`
- Request body:

```json-doc
[
  "announce",
  "version",
  1,
  "identity",
  {
    // identity body goes here
  },
  "spawn_avatar",
  {
    // same as "spawn_entity" key in "Agent requests to spawn entity"
  }
]
```

- Response:

```json-doc
[
  "announce",
  "{ID of avatar entity}",
  "{name of place}"
]
```

### Modify ACL

TBD

## Modifying the world
### Spawn entity

- Receiver: `place`
- Type: `request`
- Request body:

```json-doc
[
  "spawn_entity",
  {
    // list of initial values for components for new entity goes here

    "children": [
      // list of new child entities to create; same body as for "spawn_entity".
      // These will automatically get a "relationships" component set up referencing
      // the parent entity.
      {
        // list of initial values for components for child of new entity goes here
      },
      ...
    ]
  }
]
```

- Response:

```json-doc
[
  "spawn_entity",
  "{ID of entity if spawned}"
]
```

### Remove entity

- Receiver: `place`
- Type: `request`
- Request body:

```json-doc
[
  "remove_entity",
  "{ID of entity to remove}",
  "{'reparent' or 'cascade'}"
]
```

- Reparent: If the removed entity has children, they will be reparented to root
- Cascade: If the removed entity has children, they will also be removed.

- Response:

```json-doc
[
  "remove_entity",
  "ok"
]
```

### Change/add/remove component(s) in entity

- Receiver: `place`
- Type: `request`
- Request body:

```json-doc
[
  "change_components",
  "{entity ID}",
  "add_or_change",
  {
    // object with new values for components (regardless of if
    // component already exists on entity)
  }
  "remove",
  [
    // keys of components to remove
  ]
]
```

Response:

```json-doc
[
  "change_components",
  "ok"
]
```

A default ACL rule is set so that you must own the entity
whose component you're changing, but this rule can be changed.

### Launch app

- Receiver: `place`
- Type: `request`
- Request body:

```json-doc
[
  "launch_app",
  "{app URL}",
  { launch parameters as arbitrary JSON object }
]
```

Response:

```json-doc
[
  "launch_app",
  "ok",
  "{avatar id}"
]
```

or


```json-doc
[
  "launch_app",
  "error",
  "{human-readable error string"
]
```

Ask the Place to launch an app on behalf of the sending entity. The
Place will establish a connection to the requested app if possible,
launch it to that Place with the given arguments and the identity of the
calling client, and then return the avatar ID if all that succeeded.

(The avatar of an app is the "main UI" entity of the app.)


## User interface interactions

### Entity points at another entity

An entity, most likely the avatar of a user, is pointing with their
finger at another entity. This is used as a precursor to actually
interacting with it ("poking it").

The interaction describes two points in world space: the tip of
the finger, and the intersection point between the ray from the
finger and the nearest entity, so that the entity can know _where_
on itself someone is pointing.

- Receiver: The pointed-at entity
- Type: `one-way`
- Body:

```json-doc
[
  "point",
  [1.0, 2.0, 3.0], // finger tip in world space coordinates
  [4.0, 5.0, 6.0], // intersection point in world space coordinates
]
```

If the ray cast from the user's finger veers off the last pointed-at
entity, one last message is sent to indicate that the user has stopped
pointing at it. This is useful for removing highlight effect, etc.

```json-doc
[
  "point-exit"
]
```

### Entity pokes

Once an entity is pointing at another entity, it can ask to "physically"
interact with it, by turning the pointing into a poke. The poke doesn't
contain vector information -- it's up to the receiver to correlate with
pointing events, as those will be streaming a continuously updating
location, while poking is a request-response which the receiver
can reject. Such a rejection should be visualized, so that the
sender's user can understand if and why poking failed.

- Receiver: The pointed-at entity
- Type: `request`
- Request body:

```json-doc
[
  "poke",
  {true|false} // whether poking started (true) or stopped (false)
]
```

- Success response:

```json-doc
[
  "poke",
  "ok"
]
```

- Failure response:

```json-doc
[
  "poke",
  "failed",
  "{string explaining why, presentable to user}"
]
```

### Entity grabs

Another action an entity can do when pointing at another entity, is to
"grab" it. The below interaction is sent from the visor to the grabbed
entity, but the actual moving of the grabbed thing is performed with
a field in the intent struct, and the movement is performed server-side.
The purpose of this event is just to let the entity know that it will
be moved by the server between the start and stop event, and the
receiving app doesn't have to/can't do any movement on its own in response.

- Receiver: The pointed-at entity
- Type: `one-way`
- Request body:

```json-doc
[
  "grabbing",
  {true|false} // whether grabbing started (true) or stopped (false)
]
```

### Add property animation

Ask to add an animation to an entity. See the documentation for animation descriptor
in [property_animations](/components#property_animations)

- Receiver: The animated entity
- Type: `request`
- Request body:

```json-doc
[
  "add_property_animation",
  { animation descriptor }
]
```

- Success response:

```json-doc
[
  "add_property_animation",
  "ok",
  "abc123" // ID of this animation
]
```

- Failure response:

```json-doc
[
  "add_property_animation",
  "failed",
  "{string explaining why, presentable to user}"
]
```

### Remove property animation

Ask to remove an existing animation by ID.

```json-doc
[
  "remove_property_animation",
  "abc123"
]
```

- Success response:

```json-doc
[
  "remove_property_animation",
  "ok",
  "abc123" // ID of this animation that was removed
]
```

- Failure response:

```json-doc
[
  "remove_property_animation",
  "failed",
  "{string explaining why, presentable to user}"
]
```


## Protocol level messages

### Entity wishes to transmit live media

Before an entity can transmit streamed audio, video or geometry, a track must be created
along which to send that data. This interaction will add a
[live_media](/components#live_media)
component to the sender's entity.

See the [live_media](/components#live_media) compponent documentation for valid 
media types, media formats and metadata payloads.

- Receiver: `place`
- Type: `request`
- Request body:

```json-doc
[
  "allocate_track",
  "audio", # media type
  "opus", # media format
  { metadata ... }
]
```

- Legacy request body:

```json-doc
[
  "allocate_track",
  "audio", # media type
  48000, # sample rate
  1, # channel count
  "opus" # media format
]
```

- Success response:

```json-doc
[
  "allocate_track",
  "ok",
  3 # track_id
]
```

- Failure response:

```json-doc
[
  "allocate_track",
  "failed",
  "{string explaining why, presentable to user}"
]
```

### TBD: Subscribe/unsubscribe

- Receiver: `place`
- Type: `request`
- Request body for subscribe:

```json-doc
[
  "subscribe",
  """{guard pattern}"""
]
```

- Response:

```json-doc
[
  "subscribe",
  "{subscription ID}"
]
```

- Unsubscribe request body:

```json-doc
[
  "unsubscribe",
  "{subscription ID}"
]
```

- Response:

```json-doc
[
  "unsubscribe",
  "{'ok'|'not_subscribed'}"
]
```

- Example:

```json-doc
  [
    "interaction",
    "request",
    "1234",
    "place", // place is the subscription gateway
    "567",
    [
      "subscribe",
      """[
        "new_tweet",
        TweetSender,
        TweetBody
      ] where TweetSender == "nevyn" """
    ]
```

In this scenario the place contains an app that publishes new tweets
as interactions to the room. This interaction will ask the place to
subscribe to all interaction publications which start with the
word "new_tweet" followed by two fields. The guard clause asks that
the sender must be "nevyn". If the guard matches, the publication
interaction will be forwarded by the place from the sending agent
to the subscribing agent.
