// ==UserScript==
// @name         Substitute
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/Substitute/raw/master/substitute.user.js
// @version      0.1
// @description  Replace text content with other text or images.
// @author       LenAnderson
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

GM_registerMenuCommand('Substitute - Preferences', function() {
    var dlgWindow = open('about:blank', 'Substitute - Preferences', 'resizable,innerHeight=500,innerWidth=485,centerscreen,menubar=no,toolbar=no,location=no');
    var dlg = dlgWindow.document.body;
    dlg.style.fontFamily = 'sans-serif';
    var title = document.createElement('h2');
    title.textContent = 'Substitute - Preferences';
    dlg.appendChild(title);
    dict.forEach(function(rep) {
        var row = document.createElement('div');
        row.classList.add('row');
        row.style.margin = '3px 0';
        var key = document.createElement('input');
        key.style.margin = '0 3px';
        key.placeholder = 'key';
        key.value = rep.key;
        row.appendChild(key);
        var val = document.createElement('input');
        val.style.margin = '0 3px';
        val.placeholder = 'value';
        val.value = rep.value;
        row.appendChild(val);
        var img = document.createElement('input');
        img.style.margin = '0 3px';
        img.type = 'checkbox';
        img.checked = rep.img;
        row.appendChild(img);
        var lbl = document.createElement('label');
        lbl.textContent = ' image';
        row.appendChild(lbl);
        dlg.appendChild(row);
        var del = document.createElement('button');
        del.style.margin = '0 0 0 15px';
        del.textContent = 'X';
        del.addEventListener('click', function() {
            row.remove();
        });
        row.appendChild(del);
    });
    var add = document.createElement('div');
    var addBtn = document.createElement('button');
    addBtn.textContent = 'Add Substitution';
    addBtn.addEventListener('click', function() {
        var row = document.createElement('div');
        row.classList.add('row');
        row.style.margin = '3px 0';
        var key = document.createElement('input');
        key.style.margin = '0 3px';
        key.placeholder = 'key';
        row.appendChild(key);
        var val = document.createElement('input');
        val.style.margin = '0 3px';
        val.placeholder = 'value';
        row.appendChild(val);
        var img = document.createElement('input');
        img.style.margin = '0 3px';
        img.type = 'checkbox';
        row.appendChild(img);
        var lbl = document.createElement('label');
        lbl.textContent = ' image';
        row.appendChild(lbl);
        dlg.insertBefore(row,add);
    });
    add.appendChild(addBtn);
    dlg.appendChild(add);
    var actions = document.createElement('div');
    actions.style.margin = '8px 3px';
    actions.style.textAlign = 'right';
    var save = document.createElement('button');
    save.style.margin = '0 3px';
    save.textContent = 'Save';
    save.addEventListener('click', function() {
        var _dict = [];
        Array.prototype.forEach.call(dlg.querySelectorAll('.row'), function(row) {
            if (row.children[0].value == '') return;
            _dict.push({key: row.children[0].value, value: row.children[1].value, img: row.children[2].checked});
        });
        dict = _dict;
        GM_setValue('substitute_dict', JSON.stringify(dict));
        dlgWindow.close();
    });
    actions.appendChild(save);
    var cancel = document.createElement('button');
    cancel.style.margin = '0 3px';
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', dlgWindow.close.bind(dlgWindow));
    actions.appendChild(cancel);
    dlg.appendChild(actions);
});

var dict = JSON.parse(GM_getValue('substitute_dict') || '[]');
dict.forEach(function(rep) {
    var nodes = document.evaluate('//text()[contains(., "'+rep.key.replace(/"/g,'\"')+'")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for(var i=0;i<nodes.snapshotLength;i++) {
        var node = nodes.snapshotItem(i);
        var parts = node.data.split(rep.key);
        node.data = parts.pop();
        parts.forEach(function(part) {
            var sub;
            if (rep.img) {
                sub = document.createElement('img');
                sub.src = rep.value;
            } else {
                sub = document.createTextNode(rep.value);
            }
            node.parentNode.insertBefore(sub, node);
            node.parentNode.insertBefore(document.createTextNode(part), sub);
        });
    }
});
