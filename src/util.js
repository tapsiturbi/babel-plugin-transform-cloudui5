

export default class Util {

    /**
     * Returns the capitalized string 
     * @param {*} str 
     */
    static capitalize([ first, ...rest ]) {
        return first.toUpperCase() + rest.join('');
    }

    /**
     * Converts TS types to UI5 normalize types.
     * 
     * @param {*} tsType 
     * @see https://sapui5.hana.ondemand.com/sdk/#/topic/ac56d92162ed47ff858fdf1ce26c18c4.html
     */
    static getNormalizedTypeByPath(path) {
        const typeAnnotation = path.node.typeAnnotation.typeAnnotation;
        const tsType = typeAnnotation.type;

        switch(tsType) {
            // case "TSBooleanKeyword":
            //     return "boolean";

            // case "TSBigIntKeyword":
            // case "TSNumberKeyword":
            //     return "float"; // use float since number type could be anything

            case "TSArrayType":
                let elemType = Util.getNormalizedType(typeAnnotation.elementType.type);

                return `${elemType}[]`;

            case "TSTypeReference":
                if ( typeAnnotation.typeName ) {
                    let name = typeAnnotation.typeName.name;
                    if ( name === "Date" ) {
                        return "Date";
                    } else {
                        // figure out how to get sap class from import
                    }
                }
                return "any";

            default:
                return Util.getNormalizedType(tsType);

            // case "TSStringKeyword":
            //     return "string";

            // default:
            //     return "any";
        }
    }

    static getNormalizedType(tsType) {
        switch(tsType) {
            case "TSBooleanKeyword":
                return "boolean";

            case "TSBigIntKeyword":
            case "TSNumberKeyword":
                return "float"; // use float since number type could be anything

            case "TSStringKeyword":
                return "string";

            default:
                return "any";
        }
    }
}