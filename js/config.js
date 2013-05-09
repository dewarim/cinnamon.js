/**
 * Created with IntelliJ IDEA.
 * User: ingo
 * Date: 03.05.13
 * Time: 20:06
 * To change this template use File | Settings | File Templates.
 */

function Config(params) {

    this.values = params || defaults();

    function defaults() {
        return {username: 'admin',
            password: 'admin',
            url: 'http://localhost:8080/cinnamon/',
            repository: 'demo'
        }
    }

}

Config.prototype.put = function (name, value) {
    this.values[name] = value;
};

Config.prototype.get = function (name) {
    return this.values[name];
};    