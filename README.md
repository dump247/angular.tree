# Description

Tree control directive for [angularjs](http://www.angularjs.org).

# Installation

Copy the script into your project and add a script tag to your page.

```html
<script src="/js/angular.tree.js"></script>
```

Add a dependency to your application module.

```javascript
angular.module('myApp', ['angularTree']);
```

Add a tree to your application. See [Usage](#usage).

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

## Selection

Tree items can be selected and deselected if a selection change
expression is provided. If no select expression is provided, selection
support will not be enabled.

The 'select' attribute must be an expression that is evaluated in the
scope of the tree node that was selected/deselected. The 'this' variable
of the expression will be the scope of the tree node. A special scope
variable '$selected' is set to true if the item is selected and false
if not.

```html
<ul ng-tree="model">
    <li select="selected()">{{item.name}}</li>
</ul>
```

```javascript
$scope.selected = function () {
    console.log(this.item.name + ' is selected: ' + this.$selected);
};
```

### Multiple Selection

Multiple tree nodes can be selected at once by enabling mutli-selection
on the tree.

When enabled, holding down the meta key (Control/Command key) allows
the user to select multiple tree nodes.

Note: a 'select' expression must be provided to enable selection support
for the tree.

```html
<ul ng-tree="model" multiple>
    <li select="selected()">{{item.name}}</li>
</ul>
```

# License

The MIT License (MIT)  
Copyright (c) 2012 Cory Thomas

See [LICENSE](angularTree/blob/master/LICENSE)

