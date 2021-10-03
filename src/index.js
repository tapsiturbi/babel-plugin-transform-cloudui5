import { declare } from "@babel/helper-plugin-utils";
import ControlParser from "./ControlParser.js";
import { ModelParser } from "./ModelParser.js";

/**
 * Declare visitor as expected from a babel plugin
 */
export default declare((api, options) => {
    api.assertVersion(7);

    let modelParser = new ModelParser();
    let controlParser = new ControlParser();
    
    return {
        name: "babel-plugin-transform-cloudui5",

        visitor: {
            Class(path) {
                modelParser.processClass(path);
                
                controlParser.processClass(path);
            }
        }
    };
});
