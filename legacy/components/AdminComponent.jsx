import React from 'react'
export default class AdminComponent extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            client: props.client
        }
    }

    render() {
        let client = this.state.client
        return (
            <div className="admin-area">
                <div className="admin-actions">
                    <h1>User management</h1>
                    <UserComponent client={client}/>
                </div>
                
            </div>
            

        )
    }

}