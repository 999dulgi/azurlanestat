export const DBconfig = {
    name: "AzurlaneStatDB",
    version: 1,
    objectStoresMeta: [
        {
            store: "shiplevel",
            storeConfig: {keyPath: "id", autoIncrement: true},
            storeSchema: [
                {name: "shipname", keypath: "shipname", options: { unique: true }},
                {name: "hasShip", keypath: "hasShip", options: { unique: false }},
                {name: "isFull", keypath: "isFull", options: { unique: false }},
                {name: "is120", keypath: "is120", options: { unique: false }},
            ]
        }
    ]
}