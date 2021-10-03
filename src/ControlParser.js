import Util from "./util.js";

/**
 * Parses model classes that creates getters/setters for all private 
 * class properties with @property jsdoc. Class should have the
 * @flexmodel in the comments
 */
export default class ControlParser {

    constructor(_ref) {
        this.t = _ref.types;
    }

    /**
     * Checks if the class is a flexmodel and creates getters/setters if they are.
     * @param {*} path 
     */
    processClass(path) {
        if ( this.isFlexControlClass(path) ) {
            console.log("Flex Control Class ");

            let properties = [];

            path.get("body.body").forEach(child => {
                if ( this.isFlexProperty(child) ) {
                    let prop = this.prepProperty(child, path);
                    if ( prop ) {
                        properties.push(prop);
                    }
                }
            });

            path.insertAfter(this.t.expressionStatement(
                this.t.assignmentExpression("=", 
                    this.t.memberExpression(
                        // this.t.memberExpression(
                        //     this.t.identifier(path.node.id.name),
                        //     this.t.identifier("prototype"),
                        // ), 
                        this.t.identifier(path.node.id.name),
                        this.t.identifier("metadata")
                    ),
                    this.t.objectExpression(properties.map(prop => {
                        return this.t.objectProperty(
                            this.t.identifier(prop.name),
                            this.t.objectExpression([
                                this.t.objectProperty(
                                    this.t.identifier("type"),
                                    this.t.stringLiteral(prop.type)
                                )
                            ]),
                        )
                    }))
                ),
            ));
        }
    }

    /**
     * Returns true if there is a @flexmodel in the comments of the class
     * @param {*} path 
     * @returns 
     */
    isFlexControlClass(path) {
        let leadingComments;
        if ( path && path.node && path.node.leadingComments ) {
            // return path.node.leadingComments.find(c => c.value.indexOf("@flex") > -1) ? true : false;
            leadingComments = path.node.leadingComments;
        } else if (
            (this.t.isClassExpression(path.node) && this.t.isReturnStatement(path.parent)) ||
            (this.t.isClassDeclaration(path.node) && (
                this.t.isExportDefaultDeclaration(path.parent) || this.t.isExportDeclaration(path.parent)
            ))
        ) {
            leadingComments = path.parent.leadingComments;
        }
    
        if ( leadingComments ) {
            return leadingComments.find(c => c.value.indexOf("@flexcontrol") > -1) ? true : false;;
        }
    
        return false;
    }
    
    /**
     * Returns true if there is @property in the class property.
     * 
     * @param {*} path 
     * @returns 
     */
    isFlexProperty(path) {
        if ( path && path.node && path.node.leadingComments ) {
            return path.node.leadingComments.find(c => c.value.indexOf("@property") > -1) ? true : false;
        }
    
        return false;
    }
    
    /**
     * Creates a getter/setter for the class property.
     * 
     * @param {*} path 
     */
    prepProperty(path) {
        // console.log("Class prop: ", path.isClassProperty(), " Class private prop: ", path.isClassPrivateProperty());
    
        if ( path.node.typeAnnotation ) {
            const name = path.node.key.name;
            const type = Util.getNormalizedTypeByPath(path);
            // console.log("Control property: ", name, path.node.typeAnnotation.typeAnnotation.type);

            return { name, type };

        }

        return null;
    }
    
    // return {
    //     Class(path) {
    //         if ( isFlexModelClass(path) ) {
    //             console.log("Flex class ");
    //             path.get("body.body").forEach(child => {
    //                 if ( isFlexProperty(child) ) {
    //                     privatePropHander(child, path);
    //                 }
    //                 // console.log("Class prop: ", child.isClassProperty(), " Class private prop: ", child.isClassPrivateProperty())
    //             });
    //         }
    //     }
    // };
}