export interface IApiImageData {
    id: string;
    src: string;
    name: string;
    author: IApiUserData;
}

export interface IApiUserData {
    id: string,
    username: string
}

const IMAGES: IApiImageData[] = [
    {
        id: "0",
        src: "https://upload.wikimedia.org/wikipedia/commons/3/33/Blue_merle_koolie_short_coat_heading_sheep.jpg",
        name: "Blue merle herding sheep",
        author: {
            id: "0",
            username: "chunkylover23"
        }
    },
    {
        id: "1",
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Huskiesatrest.jpg/2560px-Huskiesatrest.jpg",
        name: "Huskies",
        author: {
            id: "0",
            username: "chunkylover23"
        }
    },
    {
        id: "2",
        src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Taka_Shiba.jpg",
        name: "Shiba",
        author: {
            id: "0",
            username: "chunkylover23"
        }
    },
    {
        id: "3",
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Felis_catus-cat_on_snow.jpg/2560px-Felis_catus-cat_on_snow.jpg",
        name: "Tabby cat",
        author: {
            id: "1",
            username: "silas_meow"
        },
    },
    {
        id: "4",
        src: "https://upload.wikimedia.org/wikipedia/commons/8/84/Male_and_female_chicken_sitting_together.jpg",
        name: "Chickens",
        author: {
            id: "2",
            username: "fulffycoat"
        }
    }
];

let fetchCount = 0;
export function fetchDataFromServer() {
    fetchCount++;
    console.log("Fetching data x" + fetchCount);
    return IMAGES;
}
