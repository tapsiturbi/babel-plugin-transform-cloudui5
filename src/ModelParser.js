import Util from "./util.js";
import { types as t } from "@babel/core";
// import babelCore from "@babel/core";

// const t = babelCore.types;

/**
 * Parses model classes that creates getters/setters for all private 
 * class properties with @property jsdoc. Class should have the
 * @flexmodel in the comments
 */
export class ModelParser {

    // constructor(_ref) {
    //     t = _ref.types;
    // }

    /**
     * Checks if the class is a flexmodel and creates getters/setters if they are.
     * @param {*} path 
     */
    processClass(path) {
        if ( this.isFlexModelClass(path) ) {
            console.log("Flex class ");
            path.get("body.body").forEach(child => {
                if ( this.isFlexProperty(child) ) {
                    this.privatePropHander(child, path);
                }
                // console.log("Class prop: ", child.isClassProperty(), " Class private prop: ", child.isClassPrivateProperty())
            });
        }
    }

    /**
     * Returns true if there is a @flexmodel in the comments of the class
     * @param {*} path 
     * @returns 
     */
    isFlexModelClass(path) {
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
            return leadingComments.find(c => c.value.indexOf("@cui5model") > -1) ? true : false;;
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
     * @param {*} classPath 
     */
    privatePropHander(path, classPath) {
        // console.log("Class prop: ", path.isClassProperty(), " Class private prop: ", path.isClassPrivateProperty());
    
        if ( path.node.typeAnnotation ) {
            const propName = path.node.key.name;
            const propType = path.node.typeAnnotation.typeAnnotation.type;
            const propNameCap = Util.capitalize(propName);
    
            // create getProperty method 
            // const getterExpr = t.callExpression(
            //     t.memberExpression(t.identifier("this"),t.identifier("setProperty")), [
            //         t.stringLiteral(propName)
            //     ]
            // );
            // const getterExpr = t.functionExpression(t.identifier(`get${propName}`), [], t.blockStatement([]));
    
            const getterBody = [
                t.returnStatement(
                    t.callExpression(
                        t.memberExpression(t.identifier("this"),t.identifier("getProperty")), [
                            t.stringLiteral(`/${propName}`)
                        ]
                    )
                )
            ];
            const getterExpr = t.classMethod("method", t.identifier(`get${propNameCap}`), [], t.blockStatement(getterBody));
    
            const setterBody = [
                t.expressionStatement(
                    t.callExpression(
                        t.memberExpression(t.identifier("this"),t.identifier("setProperty")), [
                            t.stringLiteral(`/${propName}`),
                            t.identifier("value")
                        ]
                    )
                )
            ];
            const setterExpr = t.classMethod("method", t.identifier(`set${propNameCap}`), [ t.identifier("value") ], t.blockStatement(setterBody));
    
            // classPath.insertAfter(getterExpr);
            classPath.get("body").unshiftContainer("body", getterExpr);
            classPath.get("body").unshiftContainer("body", setterExpr);
            // classPath.get("body.body").push(getterExpr);
    
            console.log("Child: ", propName, propType);
        }
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