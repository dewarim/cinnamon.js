// import CmnRegistry from './CmnRegistry'
//
// import Acl from './Acl'
// import Folder from './Folder'
// import FolderType from './FolderType'
// import Format from './Format'
// import Osd from './Osd'
// import Language from './Language'
// import LifeCycle from './LifeCycle'
// import LifeCycleState from './LifeCycleState'
// import ObjectType from './ObjectType'
// import Permission from './Permission'
// import Relation from './Relation'
// import RelationType from './RelationType'
// import UiLanguage from './UiLanguage'
// import UserAccount from './UserAccount'

export default class Cinnamon {

    constructor(config) {
        this.ticket = '::unconnected::';
        this.username = config.username;
        this.password = config.password;
        this.url = config.url;
    }


    static extractTicket(data) {
        let tick = $(data).find('ticket').text();
        console.log("extractTicket: " + tick);
        return tick;
    };

    /**
     * Connect to a Cinnamon 3 server via the xml API.
     * @param errorHandler an optional function which is used to display a login error.
     * If not set, use the default connectionError function.
     */
    connect(errorHandler) {
        let self = this;
        self.loginError = errorHandler ? errorHandler : self.connectionError;
        let connectionUrl = this.url + 'cinnamon/connect'
        console.log("connecting to Cinnamon with: " + connectionUrl)
        $.ajax(connectionUrl, {
            async: false,
            type: 'post',
            success: function (data) {
                self.ticket = Cinnamon.extractTicket(data);
            },
            data: {
                command: 'connect',
                user: this.username,
                pwd: this.password,
                repository: 'demo' // legacy parameter.
            },
            statusCode: {
                500: self.loginError
            }
        })
        
        if(self.ticket) {
            // fetch user list. This will be needed anyway to display the repository content or to
            // execute user related functions.
            console.log("load user accounts")
            this.fetchObjectList('userAccount')
            console.log("current user id = "+self.getCurrentUser().id)
        }
    };
    
    isConnected() {
        return this.ticket != '::unconnected::';
    };

    connectionError(message) {
        console.log("Error connecting to Cinnamon server: " + message);
        alert(message);
    };


    disconnect() {
        var result = false;
        var self = this;
        $.ajax(this.url + 'cinnamon/disconnect', {
            type: 'post',
            async: false,
            headers: {ticket: self.ticket},
            data: {ticket: self.ticket},
            success: function () {
                console.log("cinnamon: disconnected");
                result = true;
            },
            statusCode: {
                500: function () {
                    console.log("cinnamon: disconnect failed.");
                }
            }
        });
        return result;
    };

  

}