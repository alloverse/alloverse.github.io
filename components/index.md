---
layout: default
title: Components
permalink: /components
nav_order: 2
---

# {{ page.title }}

For an overview of what a component is, please see [Terminology](/protocol-reference).

These interactions are defined by alloserv. Third party developers may
create any components they want. They can vote to make their own
components official by opening an issue on this repo.

## `transform`

Defines the physical location and orientation of the entity relative to its parent
entity if it has one; otherwise relative to the world origo.
See [Coordinate System](protocol-reference/coordinate-system) for an extended description of how
things are positioned and oriented in Alloverse.

```json-doc
"transform": {
  "matrix": [1.0,0.0,0.0,0.0, 0.0,1.0,0.0,0.0, 0.0,0.0,1.0,0.0, 0.0,0.0,0.0,1.0]
}
```

_note: In an early version of the protocol, transform was represented as a 3-element position vector
and 3-element rotation vector with euler angle rotations._

## `geometry`

Defines the visual geometry of an entity. This should use assets in the future,
but until we have assets, geometry is encoded in-line in entity description.

**If type is `asset`**, you are providing an asset identifier that is a hash of the contents of the asset.

You also need to implement the client asset callbacks in order to respond to asset requests in order to deliver the asset.

```json-doc
"geometry": {
  "type": "asset",
  "name": "asset:sha256:d2a84f4b8b650937ec8f73cd8be2c74add5a911ba64df27458ed8229da804a26"
}
```

**If type is `hardcoded-model`**, you're using one of the models hard-coded
into the visor. `name` is the name of the model.

```json-doc
"geometry": {
  "type": "hardcoded-model",
  "name": "hand"
}
```

**If type is `inline`**, Well.. you're living in the past
This is only recommended for debugging, and until we have geometry assets.

- `vertices` is a required list of lists, each sub-list containing x, y, z coordinates for your vertices.
- `normals` is an optional list of lists, each sub-list containing the x, y, z coords for the normal at the corresponding vertex.
- `uvs` is an optional list of lists, each sub-list containing the u, v texture coordinates at the corresponding vertex.
- `triangles` is a required list of lists. Each sub-list is three integers, which are indices into the above arrays, forming a triangle.

```json-doc
"geometry": {
  "type": "inline",
  "vertices": [[1.0, 1.0, 1.0], [2.0, 2.0, 2.0], [3.0, 3.0, 3.0], [4.0, 4.0, 4.0]],
  "normals": [[1.0, 1.0, 1.0], [2.0, 2.0, 2.0], [3.0, 3.0, 3.0], [4.0, 4.0, 4.0]],
  "uvs": [[0.0, 0.0], [0.5, 1.0], [1.0, 0.0], [1.0, 1.0]],
  "triangles": [[0, 1, 2], [1, 2, 3]]
}
```

`geometry` used to also contain `texture`, but that's been moved to `material.texture`.

## `material`

Defines the surface appearance of the component being rendered.

```json-doc
"material": {
  "color": [1.0, 1.0, 0.0, 1.0],
  "shader_name": "plain",
  "texture": "asset:sha256:d2a84f4b8b650937ec8f73cd8be2c74add5a911ba64df27458ed8229da804a26"
}
```

- `color`: An array of R, G, B and A value to set as base color for the thing being rendered. Default is white.
- `shader_name`: Optional ame of hard-coded shader to use for this object. Currently allows `plain` and `pbr`. Default is `plain`.
- `texture`: optional texture asset. Default is none.

## `text`

Defines a text renderer for this entity, drawing a text texture at `transform`.

```json-doc
"text": {
  "string": "hello world",
  "height": 0.03,
  "wrap": 0,
  "halign": "center"
}
```

- `height`: The height of the text. 1 unit = 1 meter.
- `wrap`: The width in meters at which to wrap the text, if at all.
- `halign`: Horizontal alignment; "center", "left" or "right".

## `collider`

Defines the physical shape of an entity.

```json-doc
"collider": {
  "type": "box",
  "width": 1,
  "height": 1,
  "depth": 1
}
```

## `relationships`

Specify the relationships between entities, in particular child entites' "parent" entity. If an entity has a parent, its transform should be concatenated with all its ancestors' transforms before being displayed.

```json-doc
"relationships": {
  "parent": "abc123"
}
```

## `intent`

Specify how the entity's owning agent's intent affects this entity.

- `actuate_pose`: this named pose will be set as this entity's transform each frame.
- `from_avatar` (optional): Instead of following the owning agent's intents, follow the agent who has this entity as its avatar.

```json-doc
"intent": {
  "actuate_pose": "hand/left",
  "from_avatar": "abc123"
}
```

## `grabbable`

Describes how an entity maybe grabbed/held, and then
moved/dragged by a user.

The actual grabbing is accomplished using intents.
See the field `grab` under [intent](protocol-reference/intent).

```json-doc
"grabbable": {
  "actuate_on": "...",

  "translation_constraint": [1, 1, 1],
  "rotation_constraint": [1, 1, 1],
}
```

- **`actuate_on`**: Since the `grabbable` component is likely attached
  to a a handle rather than the entire object being movable,
  actuate_on indicates how far up this entity's ancestry to walk before deciding which entity to actually move.
  - Omitting this key indicates the entity itself should be
    moved within its local coordinate space.
  - Literal `$parent` means move the parent entity
  - Any entity ID must be an ancestor of this entity, and
    indicates exactly which entity to move.
- **`translation_constraint`**: Only allow the indicated fraction of movement in
  the corresponding axis in the actuated entity's local coordinate space. E g, to only
  allow movement along the floor (no lifting), set the y fraction
  to 0: `"translation_constraint": [1, 0, 1]".
- **`rotation_constraint`**: Similarly, constrain rotation to the given fraction
  in the given euler axis in the actuated entity's local coordinate space. E g, to only allow
  rotation along Y (so that it always stays up-right),
  use: `"rotation_constraint": [0, 1, 0]`.

## `live-media`

The entity that holds a `live-media` component for a specific track
is the entity that "plays" that track; e g for audio, audio will be played
from the location of that entity.

Please do not try to create live-media components manually. They must be
allocated server-side so that the server can allocate a track stream in
the network protocol. Instead, send
[allocate_track](/protocol-reference/interactions#entity-wishes-to-transmit-live-media)
to `place` to add a `live-media` component to your entity.

- `track_id`: `CHANNEL_MEDIA` track number that corresponds to what this
  entity should play back
- `sample_rate`: For audio: playback sample rate, as sent in `allocate_track`
- `channel_count`: For audio: only 1 mono channel supported
- `format`: Only "opus" audio supported

```json-doc
"live_media": {
  "track_id": 0, // filled in by server
  "sample_rate": 48000, //
  "channel_count": 1,
  "format": "opus"
}
```

## `sound-effect`

Play a sound emanating from this entity, based on a sound asset.

Supported file formats:
* .ogg
* .mp3
* .wav

Visors will load the sound asset upon encountering it. It won't play
until the `starts_at` field is set and server clock reaches that time.

It is recommended that you _first_ create and publish this entity
without the `starts_at` field so that visors cache it, and only later
sets a starts_at time so that it's more likely to be loaded by the
time it's played.

* `asset`: ID of the asset to play. (required)
* `starts_at`: The server clock time at which to start playing. Set to nil
  to just load but not play at this time. (optional, default nil)
* `loop_count`: How many times should it loop? 0 means no looping (optional, default 0).
* `offset`: Skip `n` seconds of audio into the file. (optional, default 0, not implemented yet)
* `length`: Play only `n` seconds of audio from the file, skipping the rest of
  the file before ending or looping. (optional, default false, not implemented yet)
* `volume`: Playback volume (optional, default full volume 1.0)


```json-doc
"sound-effect": {
  "asset": "asset:sha256:blabla",
  "starts_at": 12345.005,
  "loop_count": 2,
  "offset": 3.0,
  "length": 5.56,
  "volume": 1.0,
}
```


## `clock`

Only set on the entity `place`, this component defines the flow of time
for a place.

```json-doc
"clock": {
  "time": 123.0, // in seconds
}
```

Its reference time is undefined. It is always seconds as a double.

## `cursor`

Defines a custom cursor renderer, controlling the appearence of the cursor displayed when pointing at the entity.

```json-doc
"cursor": {
  "name": "brushCursor",
  "size": 3,
}
```

- `name`: The name of the custom cursor. There's currently only one defined; "brushCursor", which displays a white circle.
- `size`: The brushCursor's radius, meant to match the size of the current brush size when interacting with a drawable surface. 1 unit = 1 centimeter. Default: "3".