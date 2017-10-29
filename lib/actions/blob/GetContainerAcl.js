'use strict';

const storageManager = require('./../../StorageManager'),
    N = require('./../../model/blob/HttpHeaderNames'),
    js2xmlparser = require("js2xmlparser");

class GetContainerAcl {
    constructor() {
    }

    process(request, res) {
        storageManager.getContainerAcl(request)
            .then((response) => {
                if (response.proxy.original.access !== 'private') {
                    response.addHttpProperty(N.BLOB_PUBLIC_ACCESS, response.proxy.original.access);
                }
                res.set(response.httpProps);
                let xml = js2xmlparser.parse('SignedIdentifiers', response.payload);
                xml = xml.replace(`<?xml version='1.0'?>`, `<?xml version="1.0" encoding="utf-8"?>`);
                res.status(200).send(xml);
            });
    }
}

module.exports = new GetContainerAcl();