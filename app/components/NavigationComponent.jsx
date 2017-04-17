import React from 'react'


export default class NavigationComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: props.user
        };
    }

    render() {
        let user = this.state.user 
        if(user.isSuperuser){
            return (
                <p>User status: Superuser</p>
            )
        }
        else{
            return (
                <p>User status: Normal</p>
            )
        }
    }

}