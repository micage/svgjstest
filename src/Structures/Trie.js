


const trie = function(letter, isLast) {
    this.letter = letter;
    this.childs = new Map();
    this.isLast = isLast;
};

trie.prototype = {
    add: function(word) {

    },
    find: function (word, pre) {

    }
}

var rt = new trie();

const Trie = function () {
    this.rt = null; 
};

Trie.prototype = {
    add: function (word) {
        let node = this.rt;
        while(node) {
            
        }

    },
    find: function (word, pre) {

    }
}