let test = {
    theWord: "foo",
    people: [
        { name: "Heinz", age: 42, hobbies: ["diving", "boulder", "cinema"] },
        { name: "Gabi", age: 22, hobbies: ["biking", "soccer"] },
        { name: "Bernd", age: 32, hobbies: ["cooking", "dancing", "barbecue"] }
    ],
    job: {
        type: "IT",
        city: "Güntzelsau",
    },
    i1: {
        i11: {
            i111: "Vogel",
            i112: {
                i1121: {
                    i11211: "i11211 data"
                },
                x: 0,
                y: null,
                w: 400
            },
            i113: "Ente",
        },
        i12: {
            i121: "i121 data"
        }
    },
    i2: "i2 data",
    i3: "i3 data"
};


let afterfx = {
    project: {
        compositions: {
            "Joker": {
                layers: {
                    "video1": {

                    }
                },
                properties: {
                    blendMode: "normal",
                    opacity: 0.7
                }
            }
        }
    }
};

export default test;