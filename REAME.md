# Description

Tree control directive for [angularjs](http://www.angularjs.org).

# Usage

In this simple example 'model' is an expression in the current scope that results
in an array of objects. The inner li is the template for the tree nodes.
The default name for the current tree item is 'item' and each item
should contain a list of child items in a property name 'children'.

```html
<ul ng-tree="model">
    <li>{{item.name}}</li>
</ul>
```

Example model:

```javascript
$scope.model = [
    {
        name: 'Item 1 Name',
        children: [
            {
                name: 'Item 2 Name'
            }, {
                name: 'Item 3 Name'
            }
        ]
    }
];       
```

## Context Variable and Collection Name

The default children collection and tree node context variable name can
be overridden on the tree node template with an each expression.

The default expression is _item in children_.

```html
<ul ng-tree="model">
    <li each="obj in subItems">{{obj.name}}</li>
</ul>
```

## Item Template Content Div

The contents of the tree item template will be automatically wrapped in
a div element.

So this template:

```html
<ul ng-tree="model">
    <li>{{item.name}}</li>
</ul>
```

will result in the following HTML:

```html
<ul ng-tree="tree">
    <li class="ng-scope">
        <div class="ng-binding">Item 1 Name</div>
        <ul>
            <li class="ng-scope">
                <div class="ng-binding">Item 2 Name</div>
                <ul></ul>
            </li>
            <li class="ng-scope">
                <div class="ng-binding">Item 3 Name</div>
                <ul></ul>
            </li>
        </ul>
    </li>
</ul>
```

You can control the wrapper element yourself by wrapping the contents of
the item template in a single container element.

So this template:

```html
<ul ng-tree="model">
    <li><span>{{item.name}}</span></li>
</ul>
```

will result in the following HTML:

```html
<ul ng-tree="tree">
    <li class="ng-scope">
        <span class="ng-binding">Item 1 Name</span>
        <ul>
            <li class="ng-scope">
                <span class="ng-binding">Item 2 Name</span>
                <ul></ul>
            </li>
            <li class="ng-scope">
                <span class="ng-binding">Item 3 Name</span>
                <ul></ul>
            </li>
        </ul>
    </li>
</ul>
```

# License

The MIT License (MIT)  
Copyright (c) 2012 Cory Thomas

See [LICENSE](angularTree/blob/master/LICENSE)

