class APIData {
    constructor() {
        // this.accessToken = null;

        // // Don't change these.
        // this.id = 'b2166e80-b732-4408-92f1-c53a523f2123';
        // this.secret = '79c0063046539713e1ad99c3a2ab24e2fd787bd37adca581e11cbc951fdac583';

        // this.products = [];
        // this.loaded = false;
        // // Get the Access Token on initialisation.
        // this.getAccessToken().then((token) => {
        //     this.accessToken = token.access_token;

        //     // this.createTestTag().then(() => {
        //         this.getProducts().then((products) => {
        //             this.products = products;

        //             // console.log(products);
        //             this.getFrames().then((frames) => {
        //                 // console.log(frames);

        //                 for(let f of frames){
        //                     for(let p of products){
        //                         // console.log(f.productId, p.product.result.missionid)

        //                         if(f.productId == p.product.result.missionid){
        //                             console.log(f);
        //                         }
        //                     }
        //                 }


        //                 this.getTags().then((tags) => {
        //                     console.log(tags);
        //                     this.loaded = true;
        //                 })
        //             })
        //         })
        //     // })
        // });

        // This commented code grabs the data from local json file
        this.loadJSON((json) => {
            this.products = json;
            this.loaded = true;
        });
    }

    //Load Flight Data from JSON file (loadedProducts.Json)
    loadJSON(callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', './loadedProducts.json', true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(JSON.parse(xobj.responseText));
            }
        };
        xobj.send(null);
    }

    async getFrames() {
        let frames = [];
        let frameData = []
        // Get the list of product IDs.
        let missionIDs = await fetch('https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions', {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Authorization': 'Bearer ' + this.accessToken,
                'Content-Type': 'application/vnd.api+json'
            }
        })


        // Load the data of each Product.
        if (missionIDs.ok) {
            missionIDs = await missionIDs.json();
            // console.log(missionIDs);

            let sceneIDs = []
            for (let m of missionIDs.missions) {
                // console.log(p);

                let sceneID = await fetch("https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/" + m.id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Host': 'hallam.sci-toolset.com',
                        'Authorization': 'Bearer ' + this.accessToken,
                    },
                })

                sceneIDs.push(await sceneID.json());
            }

            for (let s of sceneIDs) {
                let frameDataItem = await fetch("https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/" + s.id + "/scene/" + s.scenes[0].id + "/frames", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Host': 'hallam.sci-toolset.com',
                        'Authorization': 'Bearer ' + this.accessToken,
                    },
                })

                frameData.push(await frameDataItem.json());
            }
        }

        for (let fd of frameData) {
            // console.log(frameData.length);
            // console.log(fd)

            for(let f of fd.scenes[0].bands[0].frames){
                frames.push(f);
            }
        }

        return frames;
    }

    async getTags() {

        let tags = [];
        // Get the list of product IDs.
        let tagIDs = await fetch('https://hallam.sci-toolset.com/discover/api/v1/products/tags/?type=USER', {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Authorization': 'Bearer ' + this.accessToken,
                'Content-Type': 'application/vnd.api+json'
            }
        })


        // Load the data of each Product.
        if (tagIDs.ok) {
            tagIDs = await tagIDs.json();
            // console.log(tagIDs);

            for (let t of tagIDs.data) {
                // console.log(p);

                let tagData = await fetch("https://hallam.sci-toolset.com/discover/api/v1/products/tags/" + t.id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Host': 'hallam.sci-toolset.com',
                        'Authorization': 'Bearer ' + this.accessToken,
                    },
                })

                tags.push(await tagData.json());
            }
        }
        // console.log(tags);
        return tags;
    }

    async createTestTag() {
        const payload = {
            "data": {
                "attributes": {
                    "name": "groupATest9"
                },
                "relationships": {
                    "products": {
                        "data": [
                            {
                                "type": "products",
                                "id": "6788b122-67d4-4f8a-940e-67b99918c555"
                            },
                        ]
                    }
                },
                "type": "tags"
            }
        }

        // console.log(payload);

        const options = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Accept': '*/*',
                'Authorization': 'Bearer ' + this.accessToken,
                'Content-Type': 'application/vnd.api+json;charset=UTF-8',
            }
        }

        let tagRes = await fetch('https://hallam.sci-toolset.com/discover/api/v1/products/tags/', options);

        // console.log(tagRes);
    }

    async getAccessToken() {
        let d = await fetch('https://hallam.sci-toolset.com/api/v1/token/', {
            method: 'POST',
            body: 'grant_type=password&username=hallam-a&password=z[97V<WM',
            headers: {
                'Accept': '*/*',
                'Authorization': 'Basic ' + btoa(this.id + ":" + this.secret),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })

        if (d.ok) {
            return await d.json();
        }
    }

    // Get a given number of products (default = 1000)
    async getProducts(amt = 1000) {
        const req = {
            accessToken: this.accessToken,
        }
        // const options = {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     method: 'POST',
        //     body: JSON.stringify(req)
        // }

        // let products = await fetch("/getProducts", options);
        // products = products.json();

        let products = [];
        // Get the list of product IDs.
        let productIDs = await fetch('https://hallam.sci-toolset.com/discover/api/v1/products/search', {
            method: 'POST',
            body: `{"size":${amt}, "keywords":""}`,
            headers: {
                'Accept': '*/*',
                'Authorization': 'Bearer ' + this.accessToken,
                'Content-Type': 'application/json'
            }
        })

        // Load the data of each Product.
        if (productIDs.ok) {
            productIDs = await productIDs.json();

            for (let p of productIDs.results.searchresults) {
                // console.log(p);

                let productData = await fetch("https://hallam.sci-toolset.com/discover/api/v1/products/" + p.id, {
                    headers: {
                        Authorization: 'Bearer ' + this.accessToken,
                    },
                })

                products.push(await productData.json());
            }
        }

        return products;
    }

    //Send a get request for Json Data
    // Input a api function url and return that data.
    // async getReq(ApiFunc) {
    //     const url = 'https://hallam.sci-toolset.com/discover/api/v1/' + ApiFunc;
    //     let d = await fetch(url, {
    //         headers: {
    //             Authorization: 'Bearer ' + this.accessToken,
    //         },
    //     })

    //     if (d.ok) {
    //         return await d.json();
    //     }
    // }
}