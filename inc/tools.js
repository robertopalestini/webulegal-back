class tools {
    constructor() {}
    prepareInlineTags(data) {
        if (!data) {
            return;
        }
        var temp = [];
        for (var i = data.length - 1; i >= 0; i--) {
            temp.push(data[i].data.title);
        }
        return temp.join();
    }
     prepareInlineFolders(data) {
        if (!data) {
            return;
        }
        var temp = [];
        for (var i = data.length - 1; i >= 0; i--) {
            temp.push(data[i].text);
        }
        return temp.join();
    }
}
module.exports = new tools