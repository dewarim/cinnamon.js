import React from 'react'
export default class UserComponent extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            client: props.client
        }
    }

    render() {
        let client = this.state.client
        return (
            <div className="user-actions">
                <button></button>
            </div>

        )
    }

}