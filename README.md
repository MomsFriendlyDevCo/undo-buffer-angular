Undo-Buffer-Angular
==================



```javascript
app.factory('angular-factory', function($undoBuffer) {
    const obj = {};

    $undoBuffer.add(_.omit(state, [
        'excluded',
        'fields',
    ]));

    obj.doUndo = function() {
        const orig = $undoBuffer.enabled;
        $undoBuffer.enabled = false;
        Object.assign(obj, $undoBuffer.undo(obj));
        $rootScope.$evalAsync(() => $undoBuffer.enabled = orig);
    };

    obj.doRedo = function() {
        const orig = $undoBuffer.enabled;
        $undoBuffer.enabled = false;
        Object.assign(obj, $undoBuffer.redo(obj));
        $rootScope.$evalAsync(() => $undoBuffer.enabled = orig);
    };
});
```


API
===
