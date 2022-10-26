class MissionData {
    constructor(APIData) {
        this.titles = [];
        this.data = this.parseAPIData(APIData);
    }

    parseAPIData(APIData) {
        let data = [];
        this.titles = [];

        for (let p of APIData) {
            // Get the date we want
            if (p.product.result.footprint) {
                data.push({
                    productID: p.product.id,
                    centre: p.product.result.centre,
                    geoJSONData: p.product.result.footprint,
                    missionID: p.product.result.missionid,
                    startDate: p.product.result.objectstartdate,
                    endDate: p.product.result.objectenddate,
                    title: p.product.result.title,
                    corners: this.calculateCorners(p.product.result.footprint.coordinates[0]),
                    selected: false,
                    tags: [],
                });
            }

            this.titles.push(p.product.result.title);
        }
        // console.log(this.titles);
        return data;
    }

    getProductsByDate(startDate, endDate) {
        let products = [];

        for (let p of this.data) {
            if (p.startDate >= startDate && p.startDate <= endDate) {
                products.push(p);
            }
        }

        return products;
    }

    calculateCorners(coords) {
        let ne, se, sw, nw;
        let maxX = coords[0][0];
        let minX = coords[0][0];
        let maxY = coords[0][1];
        let minY = coords[0][1];

        for (let i = 1; i < coords.length; i++) {
            if (coords[i][0] > maxX) maxX = coords[i][0];
            else if (coords[i][0] < minX) minX = coords[i][0];

            if (coords[i][1] > maxY) maxY = coords[i][1];
            else if (coords[i][1] < minY) minY = coords[i][1];
        }

        ne = { x: maxX, y: minY };
        se = { x: maxX, y: maxY };
        sw = { x: minX, y: maxY };
        nw = { x: minX, y: minY };

        return [nw, ne, se, sw];
    }
}