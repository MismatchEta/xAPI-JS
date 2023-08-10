/**
 * Todo:
 * - clean up functions
 * - try-catch lrs connection errors (see adl documentation)
 * - conf as seperate function for queryLRS() and sentStatement()
 * - writer proper doc-strings
 * - OO, maybe
 */

/** Sends basic xAPI Statement to configured LRS.
 * @param [string] verb - verb to display
 * @param [string] verbID - IRI of verb for reference in queries etc.
 * @param [string] object - object to display (hard coded as activity)
 * @param [string] objectID - IRI of object for reference in queries etc.
 * @param [string] typeID - IRI of type in definition child.
 * @param [string] response - for result object of statement.
 */
function sendStatement(verb, verbID, object, objectID, typeID, response) {
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

/** Sends a query to LRS with details given by some textboxes.
 *  @returns [Object] queryData - Object of statement-Array from LRS (json)
 */
function queryLRS() {
    // Set variables
    const agent = document.getElementById("uActor").value
    const verb = document.getElementById("uVerb").value
    const activity = document.getElementById("uObject").value

    // LRS Configuration for XAPIWrapper function.
    const conf = {
        "endpoint": "https://sample-lrs-opavazi.lrs.io/xapi/",
        "auth": "Basic " + toBase64("reader:dingleberry")
    };

    // Connecting to LRS.
    ADL.XAPIWrapper.changeConfig(conf);

    // Define search parameters.
    // Note: You can query by agent, verb, activity or timestamp
    // basically the things that have to exist
    const parameters = ADL.XAPIWrapper.searchParams()
    parameters["agent"] = agent 
    parameters["verb"] = verb
    parameters["object"] = activity

    // Query LRS
    const queryData = ADL.XAPIWrapper.getStatements(parameters)
    
    // Populate unordered list with details from queryData
    document.getElementById("query-results").textContent = ""
    queryData.statements.forEach(printStatements)

    return queryData
}

function printStatements(statement) {
    const newEntry = document.createElement("li")
    const newStatement = document.createTextNode(statement.actor.name + " " + statement.verb.display["en-us"] + " " + statement.object.definition.name["en-us"] + " to coords: [" + statement.result.response + "]")
    newEntry.appendChild(newStatement) 
    document.getElementById("query-results").appendChild(newEntry)
 }