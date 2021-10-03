# babel-plugin-transform-cloudui5
Gulp plugin that makes it easy to create UI5 JSONModel classes and UI5 Controls by converting class properties into getters/setters and (in the case of controls), generates static metadata definition.


# Usage
## Install with NPM
```
npm install --save-dev babel-plugin-transform-cloudui5
```

## Add in your babelrc or babel.config.json or gulpfile
```
{
    "plugins": [
        "babel-plugin-transform-cloudui5",
    ]
}
```

# Sample Code
## Control in Typescript
```
/**
 * @name cloudui5.controls.EditableText
 * @cui5control
 */
export default class EditableText extends Control {

    /** @property */
    private editable: boolean = false;

    /** @property */
    private startDate: Date;

    /** @property */
    private values: any[];


    /**
     * Called when initialized. Creates the initial controls
     * @param args
     */
    init(...args:any) {
        if ( Control.prototype.init )
            Control.prototype.init.call(this, ...args);
        console.log("init called")
    }

    /** Renderer for this control */
    private static renderer = {}
}

```

## Control transpiled
```
/**
 * @name cloudui5.controls.EditableText
 * @cui5control
 */
class EditableText extends _Control.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "editable", false);

    _defineProperty(this, "isRendered", false);
  }
  /**
   * Called when initialized. Creates the initial controls
   * @param args
   */
  init(...args) {
    if (_Control.default.prototype.init) _Control.default.prototype.init.call(this, ...args);
    console.log("init called");
  }

  /** Renderer for this control */
}

exports.default = EditableText;

_defineProperty(EditableText, "renderer", {});

EditableText.metadata = {
  properties: {
    editable: {
      type: "boolean"
    },
    startDate: {
      type: "Date"
    },
    values: {
      type: "any[]"
    }
  }
};

```