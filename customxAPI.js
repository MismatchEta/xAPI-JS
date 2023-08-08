function sendStatement(verb, verbID, object, objectID, typeID, response) {
    /** Takes an xAPI Verb and Object alongside it's IRIs to
     *  writer an xAPI Statement to an LRS as configured below.
     *  The user Agent is to be provided by an Element with id "uName"
     *  and "uEmail" respectively.
     */

    // User Agent Variables.
    const uName = document.getElementById("uName").value;
    const uEmail = document.getElementById("uEmail").value;

    // LRS Configuration for XAPIWrapper function.
    const conf = {
        "endpoint": "https://sample-lrs-opavazi.lrs.io/xapi/",
        "auth": "Basic " + toBase64("writer:dingleberry")
    };

    // Connecting to LRS.
    ADL.XAPIWrapper.changeConfig(conf);

    // Creating a XAPI-statement as JSON-object.
    const statement = {
        "actor": {
            "objectType": "Agent",
            "name": uName,
            "mbox": "mailto:" + uEmail
        },
        "verb": {
            "id": verbID,
            "display": {
                "en-us": verb
            }
        },
        "object": {
            "id": objectID,
            "definition": {
                "name": {"en-us": object},
                "description": {"en-us": "Some description of the object."},
                "type": typeID 
            },
            "objectType": "Activity"
        },
        "result": {
            "response": "" + response
        }
    };

    // Send the statement.
    const result = ADL.XAPIWrapper.sendStatement(statement);
}