(function (angular, document) {
    'use strict';

    function getItemTemplate (document, treeElem) {
        var itemTemplate;

        while (treeElem.childNodes.length > 0) {
            var childNode = treeElem.childNodes[0];

            treeElem.removeChild(childNode);

            if (childNode.nodeName === 'LI') {
                if (itemTemplate) {
                    throw new Error('Tree ul must contain only a single li template.');
                }

                var createWrapper = childNode.childNodes.length === 0;
                var innerNodes = 0;

                for (var i = 0; i < childNode.childNodes.length; i += 1) {
                    var innerNode = childNode.childNodes[i];

                    if (innerNode.nodeName === '#text') {
                       if (! /^\s*$/.test(innerNode.nodeValue)) {
                            createWrapper = true;
                            break;
                       }
                    } else if (innerNodes > 0) {
                        createWrapper = true;
                        break;
                    } else {
                        innerNodes += 1;
                    }
                }

                if (createWrapper) {
                    var wrapperEl = document.createElement('DIV');

                    while (childNode.childNodes.length > 0) {
                        wrapperEl.appendChild(childNode.childNodes[0]);
                    }

                    childNode.appendChild(wrapperEl);
                }

                childNode.appendChild(document.createElement('UL'));

                itemTemplate = angular.element(childNode);
            }
        }

        return itemTemplate || angular.element('<li><div>{{item}}</div></li>');
    }

    function initTree (treeElem, attributes, $compile, $document) {
        var itemTemplate = getItemTemplate($document[0], treeElem[0]);
        var treeModelExpr = attributes.src || attributes.ngTree;
        var eachIter = itemTemplate[0].getAttribute('each');
        var contextName = 'item';
        var collectionExpr = 'item.children';

        if (eachIter) {
            var match = /^\s*(\w+)\s+in\s+(.*?)\s*$/.exec(eachIter);

            if (! match) {
                throw new Error('Invalid item iteration expression: "' + eachIter + '". The expression must follow the pattern "name in collection".');
            }

            contextName = match[1];
            collectionExpr = contextName + '.' + match[2];
        }

        return {
            rootElem: treeElem,
            treeModelExpr: treeModelExpr,
            itemTemplate: $compile(itemTemplate),
            contextName: contextName,
            collectionExpr: collectionExpr,

            collectionWatch: function (scope) { return scope.$eval(collectionExpr); },
            treeModelWatch: function (scope) { return scope.$eval(treeModelExpr); },

            getItem: function (scope) {
                return scope.$eval(this.contextName);
            },

            setItem: function (scope, value) {
                scope[this.contextName] = value;
            }
        };
    }

    function addListItem (scope, tree, listElem, item, index) {
        var itemScope = scope.$new();
        tree.setItem(itemScope, item);

        var itemElem = tree.itemTemplate(itemScope, angular.noop);
        insertListItem(listElem, itemElem, index);

        var childrenListElem = itemElem.children().eq(1);

        loadTree(itemScope, tree, childrenListElem, tree.collectionWatch);
    }

    function insertListItem (listElem, itemElem, index) {
        if (index < 0) {
            listElem.append(itemElem);
        } else if (index === 0) {
            listElem.prepend(itemElem);
        } else {
            listElem.eq(index - 1).after(itemElem);
        }
    }

    function loadTree (scope, tree, listElem, listWatch) {
        scope.$watch(listWatch, function (newList, oldList, scope) {
            if (typeof newList === 'undefined' || newList === null || newList.length === 0) {
                listElem.children().remove();
                return;
            }

            // Remove list DOM elements that do not exist in the new list data
            (function() {
                var listChildren = listElem.children();

                for (var i = 0; i < listChildren.length; i += 1) {
                    var child = angular.element(listChildren[i]);

                    if (newList.indexOf(tree.getItem(child.scope())) < 0) {
                        child.remove();
                    }
                }
            })();

            (function () {
                newList.forEach(function (item, index) {
                    var listChildren = listElem.children(); // TODO don't do this ever loop iteration

                    if (index >= listChildren.length) {
                        addListItem(scope, tree, listElem, item, -1);
                        return;
                    }

                    for (var i = index; i < listChildren.length; i += 1) {
                        if (tree.getItem(angular.element(listChildren[i]).scope()) === item) {
                            break;
                        }
                    }

                    if (i >= listChildren.length) {
                        addListItem(scope, tree, listElem, item, index);
                    } else if (i !== index) {
                        insertListItem(listElem, listChildren[i], index);
                    }
                });
            })();
        }, true);
    }

    angular.module('angularTree', []).
        directive('ngTree', function ($compile, $document) {

            return {
                compile: function (elem, attrs) {
                    var tree = initTree(elem, attrs, $compile, $document);

                    return function (scope, elem, attrs) {
                        loadTree(scope, tree, elem, tree.treeModelWatch);
                    };
                }
            };
        });
})(angular);

