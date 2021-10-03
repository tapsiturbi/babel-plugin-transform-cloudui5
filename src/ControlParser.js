import Util from "./util.js";
import { types as t } from "@babel/core";

/**
 * Parses model classes that creates getters/setters for all private 
 * class properties with @property jsdoc. Class should have the
 * @cui5control in the comments
 */
export default class ControlParser {

    /**
     * Checks if the class is a flexmodel and creates getters/setters if they are.
     * @param {*} path 
     */
    processClass(path) {
        if ( this.isFlexControlClass(path) ) {

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
        if ( path.node.typeAnnotation ) {
            const name = path.node.key.name;
            const type = Util.getNormalizedTypeByPath(path);

            return { name, type };

        }

        return null;
    }

}