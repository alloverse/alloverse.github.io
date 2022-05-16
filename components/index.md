---
layout: default
title: Components
permalink: /components
nav_order: 2
---

# {{ page.title }}

For an overview of what a component is, please see [Terminology](/protocol-reference).

These components are defined by placeserv. Third party developers may
create any components they want. They can vote to make their own
components official by [pinging the dev team on Discord](https://discord.gg/4KQPX4wuW5).

1. TOC
{:toc}

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
  "target_hand_transform": [1, 0, 0, 0, 0, 1, .....],
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
- **`target_hand_transform`**: If omitted, the relationship between the hand and the target
  object is kept constant throughout the grab. If set, the relationship between the hand
  and the target is set to this 4x4 transformation matrix upon grabbing it. For example,
  set this to the identity matrix to make an object move immediately into the user's hand
  when grabbed.

## `live_media`

The entity that holds a `live_media` component for a specific track
is the entity that "plays" that track; e g for audio, audio will be played
from the location of that entity.

Please do not try to create live-media components manually. They must be
allocated server-side so that the server can allocate a track stream in
the network protocol. Instead, send
[allocate_track](/protocol-reference/interactions#entity-wishes-to-transmit-live-media)
to `place` to add a `live_media` component to your entity.

- `track_id`: `CHANNEL_MEDIA` track number that corresponds to what this
  entity should play back
- `type`: `audio` or `video`
- `format`: what media format encoder/decoder to use.
- `metadata`: a dict of type+format specific metadata about the format of the data.

### Audio

For audio, the only valid format is `opus`. The valid `metadata` fields for opus audio are:

- `sample_rate`: playback sample rate
- `channel_layout`: "mono" supported for now.

### Video

For video, the two valid formats are `mjpeg` and `h264`. 

* Pick `mjpeg` for video where a
  low framerate is okay but you want to make sure everybody always has the latest frame,
  such as for a whiteboard or drawing app.
* Pick `h264` for high framerate video, or decorative video, such as camera,
  screenshare or a video frame.

The valid `metadata` fields for video are:

- `width`: Width in pixels of each video frame
- `height`: Height in pixels of each video frame

### Example component:

```json-doc
"live_media": {
  "track_id": 0, // filled in by server
  "type": "audio",
  "format": "opus"
  "metadata": {
    "sample_rate": 48000,
    "channel_count": 1,
  }
}
```


Legacy format:

```json-doc
"live_media": {
  "track_id": 0, // filled in by server
  "sample_rate": 48000,
  "channel_count": 1,
  "format": "opus"
}
```

## `sound_effect`

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
* `finish_if_orphaned`: Keep playing the sound to finish even if the component or entity is removed


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

## `property_animations`

A list of property animations to play.

```json-doc
"property_animations": {
  "animations": {
    "abc123": { ... }
  }
}
```

`animations` contains key-value pairs of animation IDs and animation descriptors. You don't
manually create this component; instead, please use these interactions:

* [add_property_animation](/protocol-reference/interactions#add-property-animation)
* [remove_property_animation](/protocol-reference/interactions#remove-property-animation)

... to modify the list of animations. Note that animations are automatically removed if
they're non-repeating and their progress reaches 100%.

Each animation descriptor has the following structure:

```json-doc
{
  "path": "transform.matrix.rotation.y",
  "from": 0,
  "to": 3.14,
  "start_at": 10004.2,
  "duration": 0.5,
  "easing": "quadInOut",
  "repeats": true,
  "autoreverses": true
}
```

* `path`:  You describe the property to be animated by setting the path to the _key path_ of the property For example, to change the alpha field (fourth field) of the color property of the `material` component, use the path `material.color.3` (0-indexed). Required
  *  Matrices also have some magical computed properties. You can access `rotation`, `scale` and `translation` of a matrix to directly set that attribute of the matrix. 
  * You can also dive into the specific setting for the x, y or z axies of each of those. For example, to rotate around y, you can animate `transform.matrix.rotation.y`. In that case, the "from" and "to" values can be regular numbers.
* `from`: The value to animate from. Can be a number, matrix (list of 16 numbers), vector (list of 3 numbers) or rotation (list of 4 numbers: angle, and the x y z of the axis). It MUST be the same kind of value as the property we're animating. Required.
* `to`: The value to animate to. See `from`. Required.
* `start_at`: The server time at which to start the animation. Required.
* `duration`: Duration, in seconds. Required.
* `easing`: Easing algorithm. Default `linear`. Allowed values: `linear`, `quadInOut`, `quadIn`, `quadOut`, .`bounceInOut`, `bounceIn`, `bounceOut`, `backInOut`, `backIn`, `backOut`, `sineInOut`, `sineIn`, `sineOut`, .`cubicInOut`, `cubicIn`, `cubicOut`, `quartInOut`, `quartIn`, `quartOut`, `quintInOut`, `quintIn`, .`quintOut`, `elasticInOut`, `elasticIn`, `elasticOut`, `circularInOut`, `circularIn`, `circularOut`, .`expInOut`, `expIn`, `expOut`.
* `repeats`: Whether to play again from the start after animation finishes. Default `false`.
* `autoreverses`: Whether every other repeated iteration should be in reverse. Default `false.`

## `service_discovery`

Indicates that the entity provides some sort of service as an interaction API.

```json-doc
{
  "name": "servicename",
  "description": "Short developer-readable description of the service",
  "docs": "https://url/to/documentation"
}
```

For example, to find a service that lets you view image files, you might look for
a service name `imageviewer`, and look into its documentation on how to
ask it to display a specific file.