import syntaxTypeScript from "@babel/plugin-syntax-typescript";
import ControlParser from "./ControlParser.js";
import ModelParser from "./ModelParser.js";



// module.exports.default = function (_ref) {
export default function FlexUI5(_ref) {
    var t = _ref.types;

    let modelParser = new ModelParser(_ref);
    let controlParser = new ControlParser(_ref);

    // function isFlexClass(path) {
    //     let leadingComments;
    //     if ( path && path.node && path.node.leadingComments ) {
    //         // return path.node.leadingComments.find(c => c.value.indexOf("@flex") > -1) ? true : false;
    //         leadingComments = path.node.leadingComments;
    //     } else if (
    //         (t.isClassExpression(path.node) && t.isReturnStatement(path.parent)) ||
    //         (t.isClassDeclaration(path.node) && (
    //             t.isExportDefaultDeclaration(path.parent) || t.isExportDeclaration(path.parent)
    //         ))
    //     ) {
    //         leadingComments = path.parent.leadingComments;
    //     }
    
    //     if ( leadingComments ) {
    //         return leadingComments.find(c => c.value.indexOf("@flexmodel") > -1) ? true : false;;
    //     }
    
    //     return false;
    // }
    
    // function isFlexProperty(path) {
    //     if ( path && path.node && path.node.leadingComments ) {
    //         return path.node.leadingComments.find(c => c.value.indexOf("@property") > -1) ? true : false;
    //     }
    
    //     return false;
    // }
    
    // function privatePropHander(path, classPath) {
    //     // console.log("Class prop: ", path.isClassProperty(), " Class private prop: ", path.isClassPrivateProperty());
    
    //     if ( path.isClassProperty() && path.node.typeAnnotation ) {
    //         const propName = path.node.key.name;
    //         const propType = path.node.typeAnnotation.typeAnnotation.type;
    //         const propNameCap = Util.capitalize(propName);
    
    //         // create getProperty method 
    //         // const getterExpr = t.callExpression(
    //         //     t.memberExpression(t.identifier("this"),t.identifier("setProperty")), [
    //         //         t.stringLiteral(propName)
    //         //     ]
    //         // );
    //         // const getterExpr = t.functionExpression(t.identifier(`get${propName}`), [], t.blockStatement([]));
    
    //         const getterBody = [
    //             t.returnStatement(
    //                 t.callExpression(
    //                     t.memberExpression(t.identifier("this"),t.identifier("getProperty")), [
    //                         t.stringLiteral(`/${propName}`)
    //                     ]
    //                 )
    //             )
    //         ];
    //         const getterExpr = t.classMethod("method", t.identifier(`get${propNameCap}`), [], t.blockStatement(getterBody));
    
    //         const setterBody = [
    //             t.expressionStatement(
    //                 t.callExpression(
    //                     t.memberExpression(t.identifier("this"),t.identifier("setProperty")), [
    //                         t.stringLiteral(`/${propName}`),
    //                         t.identifier("value")
    //                     ]
    //                 )
    //             )
    //         ];
    //         const setterExpr = t.classMethod("method", t.identifier(`set${propNameCap}`), [ t.identifier("value") ], t.blockStatement(setterBody));
    
    //         // classPath.insertAfter(getterExpr);
    //         classPath.get("body").unshiftContainer("body", getterExpr);
    //         classPath.get("body").unshiftContainer("body", setterExpr);
    //         // classPath.get("body.body").push(getterExpr);
    
    //         console.log("Child: ", propName, propType);
    //     }
    // }
    
    return {
        // inherits: syntaxTypeScript.default,
        visitor: {
            Class(path) {
                modelParser.processClass(path);
                
                controlParser.processClass(path);
            },
            // Class: {
            //     enter(path, { file, opts = {} }) {
            //         modelParser.processClass(path);
                    
            //         controlParser.processClass(path);
            //     }
            // },
            // ClassDeclaration(path){
            //     console.log('ClassDeclaration') // log
            // },
            // ClassMethod(path){
            //     console.log('ClassMethod') // log
            // }

            // ...ModelVisitor(_ref)
        }
    };
}
