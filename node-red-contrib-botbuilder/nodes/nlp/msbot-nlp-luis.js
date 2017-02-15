
const path    = require('path');
const builder = require('botbuilder');

// --------------------------------------------------------------------------
//  NODE-RED
// --------------------------------------------------------------------------

let LUIS_URL = undefined;
module.exports = function(RED) {
    const register = function(config) {
        RED.nodes.createNode(this, config);
        LUIS_URL =                         (config.url || CONFIG.microsoft.luis.url)
                 + "/"                   + (config.modelId || CONFIG.microsoft.luis.modelId)
                 + "?subscription-key="  + (config.APIKey  || CONFIG.microsoft.luis.APIKey);
        this.on('input', (data)  => { input(node, data, config) });
    }
    RED.nodes.registerType("luis", register, {});
}

const input = (node, data, config) => {
    data.intent = "";
    if (!data.payload){ return node.send(data); }
    
    // Query
    builder.LuisRecognizer.recognize(data.payload, LUIS_URL, (err, intents, entities) => {

        // Intents
        if (intents && intents.length > 0){
            data.intent  = intents[0];
            data.intents = intents;
        }

        if (entities && entities.length > 0){
            data.entity  = entities[0];
            data.entities = entities;
        }

        // Forward data
        node.send(data);
    })
}
