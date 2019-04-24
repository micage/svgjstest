/*
The idea is to do graphical content by using a scenegraph. A scenegraph is a n-ary tree. 
Each node can have multiple children (note: it's isomorphic to a binary tree).
Each node is in fact a Frame that describes a coordinate system.
Objects that make our scene are attached to the frames of this tree.

The goal should be to have a description of geometrical and physical things that is
totally independent of it's graphical representation.

Dilemma: If a scene knows nothing about graphics and a renderer knows nothing about
a scene, how should they communicate?

DirectX knows nothing about any game that uses it. This direction is obviuos.
Can we make the other direction work, too? A scene that can be rendered by
different renderers. Pluggable. A 3d scene renderered as ASCII letter salad?
Not that this would be very useful but in principle it should work.

As a guide a scene should not need any data from the renderer. The communication
is only from the scene to the renderer not vice versa.

Contraint: both the scene and the renderer deal with vertices. 
In advanced graphics API's this process is called instantiation: you read 
the 3d model data from a file and convert it to a format which the renderer 
understands and upload it. You will get back a handle/pointer to your data.
The renderer mostly stores this data on the systems' graphics card. So you 
have it twice. One in system memory and one in fast GPU memory. 
In a game you wouldn't need the system memory copy anymore so you could free 
it's memory. In a 3d-editing program with hardware acceleration you would 
keep both copies.

In case of SVG we would have a similar situation. Vertex data is stored e.g. in
a path description but also in our scene. We could feed the SVG DOM with data
and throw away our scenes' version if we intend to leave the object unchanged.
But in general it seems to be a good idea to have both copies. Drawback is a
doubling of memory footprint.

In case of the Canvas API things are more straight. The renderer implementation
does not need to hold any data. Just converting general draw calls to the
canvas version of it. For example draw line from A to B would be:
    ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); 

Renderer:
    - knows about pixels, colors
    - drawing primitives (lines, rectangles, circles, pathes)
    - render states:
        - line width
        - stroke and fill color
    - optional 3d (better use WebGL to implement this):
        - lines, triangles, spheres, cuboids, meshes
        - camera frustum, field of view
        - culling (backface, hidden surface)
    - images/textures

Objects in a scene have three main properties:
    - dimension: 2d or 3d. 2d objects could still have a 3d frame, but we
                may not modify single vertices of the object. Also 3d orientaion
                would be ignored. Only the angle around the z-axis would be used.
    - spacial: position, orientation, scale) which are managed by the Frame class
    - geometrical: points, lines, circles, pathes, meshes and unions of them
    - material: in advanced graphics API's this is done with shaders in simpler ones 
                this boils down to stroke and fill color, maybe color gradients

    Note1: in advanced API's there is a connection between geometry and material. In order
    to access certain effects you have to give the vertices certain data e.g. normals,
    colors, texture coordinates, tangents ... you could even give them electric field 
    strength if you like. If the vertices of our meshes would just have positions, we 
    wouldn't be able to do much with it in our vertex and pixel shader code. A vertex
    shader has access to the data of one (1!) vertex. After some calculation (mostly
    space transformations by matrix multiplication -> screen space) it passes some data 
    to a pixel shader in case of Direct X or a fragment shader in case of OperGL. 
    It's task is to calculate the color for one (1!) pixel, based on the data it's been 
    passed by the vertex shader. It can also use certain buffers like diffuse map, normal map,
    light map, specular map and other textures to achieve certain effects.
    -> plz refer to books on this topic!

    Note2: in case of meshes we have to provide additional information on which vertices 
        are connected to build triangles (faces) out of it. This leads to face lists.
        Certain optimizations can have different list structures (e.g. triangle strips).

    Example: Let's consider a triangle. Each vertex has a position and a color. One
        is red, one green and the last blue. Since positions are stored in model
        coordinates they have to be transferred to the cameras coordinate system,
        then normalized and projected into screen space. This is done by the vertex shader.
        Nothing holds you back here to do some weird stuff (e.g. time dependency) to the 
        vertex data before it's finally passed to the pixel shader. Vertex data is
        interpolated for each pixel our triangle covers in screen space. The output
        of the pixel shader is in most use cases just a RGB color value.

    This is getting lengthy ... back to our 'simple' webshaders!

Implementing a renderer, differences of canvas and SVG API:
    Canvas API:
    - in canvas we set states that govern how things are drawn, they persist until changed
      e.g. ctx.lineWidth = 2; or ctx.strokeStyle = "#ff0000";
    - drawing commands alter pixels in the canvas: ctx.fillRect(0, 0, 100, 40);
    - there are no objects, just pixels with certain colors

    SVG API:
    - in svg we create an SVGElement that we append to the svg-dom (DOM-Tree), 
    - styles can be set via css just like ordinary HTML
    - event handling is the same as with HTLMElements


Scene:
    - a tree of coordinate frames with attached geometric elements
    - should be independent of a renderer (how it' drawn)
    - scene elements are lines, rectangles, circles (arcs), pathes 


*/
