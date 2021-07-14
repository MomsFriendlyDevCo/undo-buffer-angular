Undo-Buffer-Angular
==================



```javascript
app.factory('angular-factory', function($undoBuffer) {
    const obj = {};

    const undoBuffer = $undoBuffer.watch(_.omit(obj, [
        'excluded',
        'fields',
    ]));

    obj.doUndo = function() {
        console.time('apply-undo');
        const orig = undoBuffer.enabled;
        undoBuffer.enabled = false;
        undoBuffer.undo(obj).then(doc => {
            Object.assign(obj, doc);
            $timeout(() => {
                undoBuffer.enabled = orig;
                console.timeEnd('apply-undo');
            });
        });
    };

    obj.doRedo = function() {
        console.time('apply-redo');
        const orig = undoBuffer.enabled;
        undoBuffer.enabled = false;
        undoBuffer.redo(obj).then(doc => {
            Object.assign(obj, doc);
            $timeout(() => {
                undoBuffer.enabled = orig;
                console.timeEnd('apply-redo');
            });
        });
    };
});
```


API
===
