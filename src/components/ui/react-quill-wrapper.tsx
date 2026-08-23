import ReactDOM from "react-dom";

if (typeof (ReactDOM as any).findDOMNode !== "function") {
  (ReactDOM as any).findDOMNode = function (component: any) {
    if (component && component instanceof Element) return component;
    if (component && component.node) return component.node;
    return null;
  };
}

import ReactQuill from "react-quill";
export default ReactQuill;
