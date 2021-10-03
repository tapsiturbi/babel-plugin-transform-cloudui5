import Util from "./util.js";
import { types as t } from "@babel/core";
// import babelCore from "@babel/core";

// const t = babelCore.types;

/**
 * Parses model classes that creates getters/setters for all private 
 * class properties with @property jsdoc. Class should have the
 * @flexmodel in the comments
 */
export default class ControlParser {

    // constructor(_ref) {
    //     t = _ref.types;
    // }

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

            path.insertAfter(t.expressionStatement(
                t.assignmentExpression("=", 
                    t.memberExpression(
                        // t.memberExpression(
                        //     t.identifier(path.node.id.name),
                        //     t.identifier("prototype"),
                        // ), 
                        t.identifier(path.node.id.name),
                        t.identifier("metadata")
                    ),

                    t.objectExpression([
                        t.objectProperty(
                            t.identifier("properties"),
                            t.objectExpression(properties.map(prop => {
                                return t.objectProperty(
                                    t.identifier(prop.name),
                                    t.objectExpression([
                                        t.objectProperty(
                                            t.identifier("type"),
                                            t.stringLiteral(prop.type)
                                        )
                                    ]),
                                );
                            }))
                        )
                    ]),

                    // t.objectExpression(properties.map(prop => {
                    //     return t.objectProperty(
                    //         t.identifier(prop.name),
                    //         t.objectExpression([
                    //             t.objectProperty(
                    //                 t.identifier("type"),
                    //                 t.stringLiteral(prop.type)
                    //             )
                    //         ]),
                    //     );
                    // }))
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
            (t.isClassExpression(path.node) && t.isReturnStatement(path.parent)) ||
            (t.isClassDeclaration(path.node) && (
                t.isExportDefaultDeclaration(path.parent) || t.isExportDeclaration(path.parent)
            ))
        ) {
            leadingComments = path.parent.leadingComments;
        }
    
        if ( leadingComments ) {
            return leadingComments.find(c => c.value.indexOf("@cui5control") > -1) ? true : false;;
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